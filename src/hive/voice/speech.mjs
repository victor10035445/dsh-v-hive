/**
 * 语音播报（add-hive-voice-desk 3.5 / design D6③、D7、D8）。
 *
 * 两条播放路径：
 *  1. **流式应答**（`/voice/tts`）：宿主透传的 SSE 帧 → base64 PCM（24kHz mono PCM16）
 *     → 前置 WAV 头或直接喂 WebAudio，边收边播；打断即停源并 abort 上游
 *     （不空跑计费，spec「中途中止不空跑」）。
 *  2. **固定语音资产**（assets/voice/*.wav）：WebAudio 解码播放，运行期零 TTS 调用；
 *     附和只在段落间隙由 desk 调用，并以保护窗（hold-off）收尾。
 *
 * 纯解析函数（base64/PCM/帧解码）可 Node 直测；播放器壳依赖注入便于冒烟。
 */

/** 默认采样率（官方 `return_sample_rate` 通常为 24000）。 */
export const DEFAULT_TTS_SAMPLE_RATE = 24000;

/** base64 → 字节（浏览器 atob / Node Buffer 双兼容）。 */
export function base64ToBytes(input) {
  const text = String(input ?? "").replace(/\s+/g, "");
  if (!text) return new Uint8Array(0);
  if (typeof atob === "function") {
    const binary = atob(text);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  }
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(text, "base64"));
  throw new Error("no base64 decoder available");
}

/** hex → 字节（`encode_format: "hex"` 变体，审阅 F3）。 */
export function hexToBytes(input) {
  const text = String(input ?? "").replace(/\s+/g, "");
  if (!text || text.length % 2 !== 0) return new Uint8Array(0);
  const out = new Uint8Array(text.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(text.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/** PCM16 小端字节 → Float32（WebAudio 采样域）。 */
export function pcm16BytesToFloat32(bytes) {
  const source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes ?? []);
  const samples = Math.floor(source.length / 2);
  const out = new Float32Array(samples);
  const view = new DataView(source.buffer, source.byteOffset, samples * 2);
  for (let i = 0; i < samples; i++) out[i] = view.getInt16(i * 2, true) / 32768;
  return out;
}

/** 抽取帧内音频载荷（兼容官方原形与宿主规范化后的形态）。 */
function payloadOf(frame) {
  if (!frame || typeof frame !== "object") return null;
  if (typeof frame.pcm === "string") return { encoded: frame.pcm, format: "base64" };
  if (typeof frame.audio === "string") return { encoded: frame.audio, format: "base64" };
  if (typeof frame.delta === "string" && frame.type !== "audio") return { encoded: frame.delta, format: "base64" };
  const choice = Array.isArray(frame.choices) ? frame.choices[0] : null;
  const content = choice?.delta?.content ?? choice?.message?.content ?? choice?.delta?.audio?.data;
  if (typeof content === "string" && content) {
    return { encoded: content, format: frame.encode_format === "hex" ? "hex" : "base64" };
  }
  return null;
}

/**
 * 解码一帧 SSE JSON 载荷。
 * @returns {{type:"audio", bytes:Uint8Array, sampleRate:number}|{type:"error", error:object}|{type:"done"}|null}
 */
export function decodeTtsFrame(frame) {
  if (!frame || typeof frame !== "object") return null;
  if (frame.type === "done") return { type: "done" };
  if (frame.type === "error" || frame.error) return { type: "error", error: frame.error ?? { message: "tts error" } };
  const payload = payloadOf(frame);
  if (!payload) return null;
  const bytes = payload.format === "hex" ? hexToBytes(payload.encoded) : base64ToBytes(payload.encoded);
  if (bytes.length === 0) return null;
  const sampleRate = Number(frame.return_sample_rate ?? frame.sample_rate ?? frame.sampleRate ?? DEFAULT_TTS_SAMPLE_RATE);
  return { type: "audio", bytes, sampleRate: Number.isFinite(sampleRate) && sampleRate > 0 ? sampleRate : DEFAULT_TTS_SAMPLE_RATE };
}

/**
 * 流式播报器（`/voice/tts` → 边收边播）。依赖注入 `AudioContext` 与 `fetch`。
 */
export function createSpeechStreamer(deps = {}) {
  const scope = deps.scope ?? globalThis;
  const AudioCtor = deps.AudioContext ?? scope.AudioContext ?? scope.webkitAudioContext ?? null;
  const fetchImpl = deps.fetch ?? (typeof scope.fetch === "function" ? scope.fetch.bind(scope) : null);
  const endpoint = deps.endpoint ?? "/api/dsh-hive/voice/tts";

  let audioCtx = deps.audioContext ?? null;
  let controller = null;
  let sources = [];
  let nextStartTime = 0;
  let finished = false;
  let scheduled = 0;
  let streamError = null;

  const ensureContext = () => {
    if (!audioCtx) {
      if (!AudioCtor) throw new Error("AudioContext unavailable");
      audioCtx = new AudioCtor();
    }
    if (audioCtx.state === "suspended") audioCtx.resume?.().catch(() => {});
    return audioCtx;
  };

  const schedule = (bytes, sampleRate) => {
    const ctx = ensureContext();
    const samples = pcm16BytesToFloat32(bytes);
    if (samples.length === 0) return;
    const buffer = ctx.createBuffer(1, samples.length, sampleRate);
    buffer.copyToChannel ? buffer.copyToChannel(samples, 0) : buffer.getChannelData(0).set(samples);
    const node = ctx.createBufferSource();
    node.buffer = buffer;
    node.connect(ctx.destination);
    const startAt = Math.max(ctx.currentTime + 0.02, nextStartTime);
    node.start(startAt);
    nextStartTime = startAt + buffer.duration;
    sources.push(node);
    scheduled += 1;
    node.onended = () => {
      sources = sources.filter((s) => s !== node);
      if (sources.length === 0 && !finished) deps.onIdle?.();
    };
  };

  const stop = () => {
    finished = true;
    try {
      controller?.abort();
    } catch {
      /* ignore */
    }
    controller = null;
    for (const node of sources.splice(0)) {
      try {
        node.stop();
      } catch {
        /* 已结束 */
      }
    }
    nextStartTime = 0;
  };

  return {
    /** 播放中的振幅包络代理（3D 表现用：按已排程片段数给出粗略强度）。 */
    isPlaying: () => sources.length > 0,
    stop,
    /**
     * 请求并播放一段文本。
     * @param {{text:string, voice?:string, speed?:number}} request
     * @returns {Promise<{ok:true}|{ok:false, aborted?:boolean, error:string}>}
     */
    async speak(request) {
      if (!fetchImpl) return { ok: false, error: "fetch unavailable" };
      stop();
      finished = false;
      controller = new AbortController();
      nextStartTime = 0;
      scheduled = 0;
      streamError = null;
      deps.onState?.("speaking");
      try {
        const response = await fetchImpl(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text: String(request?.text ?? ""), voice: request?.voice, speed: request?.speed }),
          signal: controller.signal
        });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          deps.onState?.("idle");
          return { ok: false, error: body.error || `tts ${response.status}`, state: body.state };
        }
        if (!response.body?.getReader) {
          deps.onState?.("idle");
          return { ok: false, error: "streaming unavailable" };
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          buffer = buffer.replace(/\r\n/g, "\n"); // SSE 行结束符可能是 CRLF
          let sep = buffer.indexOf("\n\n");
          while (sep >= 0) {
            const frame = buffer.slice(0, sep);
            buffer = buffer.slice(sep + 2);
            consumeFrame(frame);
            sep = buffer.indexOf("\n\n");
          }
        }
        if (buffer.trim()) consumeFrame(buffer);
        deps.onState?.("idle");
        finished = true;
        /* 流内错误帧 / 无音频帧（上游余额不足时返回 `200 + 0 字节`）都必须变成失败回执，
           SHALL NOT 让界面「静默播放成功」（spec：错误必须可见）。 */
        if (streamError) {
          return { ok: false, error: String(streamError.message ?? streamError.code ?? "tts error"), streamError };
        }
        if (scheduled === 0) return { ok: false, error: "empty audio stream", empty: true };
        return { ok: true };
      } catch (error) {
        const aborted = controller?.signal?.aborted === true || error?.name === "AbortError";
        deps.onState?.("idle");
        return aborted ? { ok: false, aborted: true, error: "aborted" } : { ok: false, error: String(error?.message || error) };
      } finally {
        controller = null;
      }
    }
  };

  function consumeFrame(rawFrame) {
    for (const line of String(rawFrame).split(/\r?\n/)) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      let parsed = null;
      try {
        parsed = JSON.parse(payload);
      } catch {
        continue;
      }
      const decoded = decodeTtsFrame(parsed);
      if (!decoded) continue;
      if (decoded.type === "error") {
        if (!streamError) streamError = decoded.error ?? { message: "tts error" };
        deps.onError?.(decoded.error);
        continue;
      }
      if (decoded.type === "audio") schedule(decoded.bytes, decoded.sampleRate);
    }
  }
}

/**
 * 固定资产播放器（D7）：预生成 wav 解码后缓存，运行期零 TTS。
 * 资产缺失（404）→ 标记 miss 并静默返回（SHALL NOT 报错堆栈；未建库时链路仍可用）。
 */
export function createCuePlayer(deps = {}) {
  const scope = deps.scope ?? globalThis;
  const AudioCtor = deps.AudioContext ?? scope.AudioContext ?? scope.webkitAudioContext ?? null;
  const fetchImpl = deps.fetch ?? (typeof scope.fetch === "function" ? scope.fetch.bind(scope) : null);
  const cache = new Map();
  const missing = new Set();
  let audioCtx = deps.audioContext ?? null;
  let current = null;

  const ensureContext = () => {
    if (!audioCtx) {
      if (!AudioCtor) throw new Error("AudioContext unavailable");
      audioCtx = new AudioCtor();
    }
    if (audioCtx.state === "suspended") audioCtx.resume?.().catch(() => {});
    return audioCtx;
  };

  const load = async (cue) => {
    if (cache.has(cue.id)) return cache.get(cue.id);
    if (missing.has(cue.id)) return null;
    if (!fetchImpl) return null;
    try {
      const response = await fetchImpl(cue.url);
      if (!response.ok) {
        missing.add(cue.id);
        deps.onMissing?.(cue);
        return null;
      }
      const bytes = await response.arrayBuffer();
      const buffer = await ensureContext().decodeAudioData(bytes);
      cache.set(cue.id, buffer);
      return buffer;
    } catch {
      missing.add(cue.id);
      deps.onMissing?.(cue);
      return null;
    }
  };

  return {
    preload: (cues) => Promise.all((cues ?? []).map((cue) => load(cue))),
    missingIds: () => [...missing],
    stop() {
      try {
        current?.stop?.();
      } catch {
        /* ignore */
      }
      current = null;
    },
    /**
     * 播一条固定音。
     * @returns {Promise<{ok:boolean, reason?:string}>}
     */
    async play(cue) {
      if (!cue) return { ok: false, reason: "unknown-cue" };
      const buffer = await load(cue);
      if (!buffer) return { ok: false, reason: "asset-missing" };
      const ctx = ensureContext();
      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(ctx.destination);
      node.start();
      current = node;
      deps.onPlay?.(cue);
      await new Promise((resolve) => {
        node.onended = () => resolve();
        /* 兜底：解码器给出的时长 + 200ms 抖动，防 onended 缺席挂死。 */
        setTimeout(resolve, Math.ceil(buffer.duration * 1000) + 200);
      });
      if (current === node) current = null;
      return { ok: true };
    }
  };
}
