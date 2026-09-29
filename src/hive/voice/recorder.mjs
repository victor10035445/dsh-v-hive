/**
 * 语音采集与分段（add-hive-voice-desk 3.1 / design D4/D8，审阅 R9/R12）。
 *
 * 职责：
 *  - 48kHz 采集 → 重采样 16kHz 单声道 PCM16 → 自建 44 字节 WAV 头（ASR 上游只收 wav/mp3）；
 *  - VAD 判停：段内静音达阈值即收段；单段 30s 硬顶自动切分并续录（用户无感）；
 *  - 附和保护窗（hold-off，默认 300ms）：固定音播放结束到下一次开录之间留窗，
 *    避免附和尾音被 VAD 起录进段内（D8 防串音纪律）；
 *  - 麦克风失败面（权限拒绝 / 无设备 / 非安全上下文）→ 结构化原因，调用方播固定音 + 引导。
 *
 * 纯函数（重采样/PCM16/WAV 头/RMS）与 `createSegmenter` 状态机可被 Node 直接 import
 * 做真值表冒烟；`createVoiceRecorder` 是浏览器壳（WebAudio + getUserMedia），依赖全部注入。
 */

/* ── 纯 DSP 助手 ── */

/** 线性插值重采样（48k → 16k 等整数/非整数比通吃；语音场景足够）。 */
export function resampleLinear(input, inputRate, outputRate) {
  const source = input instanceof Float32Array ? input : Float32Array.from(input ?? []);
  if (inputRate === outputRate) return source.slice();
  if (source.length === 0) return new Float32Array(0);
  const ratio = inputRate / outputRate;
  const outLength = Math.max(1, Math.floor(source.length / ratio));
  const out = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const pos = i * ratio;
    const left = Math.floor(pos);
    const right = Math.min(source.length - 1, left + 1);
    const frac = pos - left;
    out[i] = source[left] * (1 - frac) + source[right] * frac;
  }
  return out;
}

/** Float32 [-1,1] → PCM16（clamp 防溢出爆音）。 */
export function floatToPcm16(input) {
  const source = input instanceof Float32Array ? input : Float32Array.from(input ?? []);
  const out = new Int16Array(source.length);
  for (let i = 0; i < source.length; i++) {
    const value = Math.max(-1, Math.min(1, source[i] ?? 0));
    out[i] = value < 0 ? Math.round(value * 0x8000) : Math.round(value * 0x7fff);
  }
  return out;
}

/** 44 字节 WAV 头（宿主 hive-voice.mjs 的 wavHeader 同口径，浏览器侧自建）。 */
export function wavBytes(pcm16, sampleRate) {
  const dataBytes = pcm16.byteLength;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);
  const writeText = (offset, text) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  writeText(0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, (sampleRate * 2), true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, "data");
  view.setUint32(40, dataBytes, true);
  new Uint8Array(buffer, 44).set(new Uint8Array(pcm16.buffer, pcm16.byteOffset, dataBytes));
  return new Uint8Array(buffer);
}

/** 帧均方根（VAD 判据）。 */
export function rmsOf(frame) {
  const source = frame instanceof Float32Array ? frame : Float32Array.from(frame ?? []);
  if (source.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < source.length; i++) sum += source[i] * source[i];
  return Math.sqrt(sum / source.length);
}

/** 多帧拼接（分段窗口内累积）。 */
export function concatFrames(frames) {
  const list = Array.isArray(frames) ? frames : [];
  let total = 0;
  for (const frame of list) total += frame.length;
  const out = new Float32Array(total);
  let offset = 0;
  for (const frame of list) {
    out.set(frame, offset);
    offset += frame.length;
  }
  return out;
}

/* ── 分段状态机（纯逻辑，Node 可测） ── */

export const SEGMENT_DEFAULTS = Object.freeze({
  /** 单段硬顶（对齐 GLM-ASR ≤30s）。 */
  maxSegmentMs: 30000,
  /** 段内静音判停阈值。 */
  silenceMs: 900,
  /** 最短有效段（短于此且无语音 → 丢弃，避免误触发起录）。 */
  minSegmentMs: 350,
  /**
   * 最短**有效语音**累计时长（2026-09-27 真机实测追加）：只有累计过阈的帧达到此值才允许收段，
   * 否则整段本地丢弃、**不发起 ASR 调用**。动机：一次咳嗽/键盘声就能把 `sawVoice` 置真，
   * 随后 900ms 静音即收段 → 把近乎无声的音频送上游 → 返回空转写 → 界面刷出一串
   * 「转写失败」（用户实测反馈）。本地丢弃既省额度，也不再误导用户。
   */
  minVoiceMs: 250,
  /** 语音判定 RMS 阈值（AEC 不达标时由设置抬高，审阅 S4）。 */
  speechRms: 0.02,
  /** 附和保护窗（D8：固定音尾音不得进段）。 */
  holdOffMs: 300
});

/**
 * 分段状态机：`push(frame)` 逐个音频帧推进，产出事件。
 * 事件：`{type:"speech-start"}` / `{type:"segment-close", reason:"silence"|"max-length"|"manual"}` /
 * `{type:"discard", reason:"too-short"|"no-voice"}` / `{type:"hold-off", ms}` / `{type:"hold-off-end"}`。
 */
export function createSegmenter(options = {}) {
  const config = { ...SEGMENT_DEFAULTS, ...options };
  let recording = false;
  let startedAt = 0;
  let lastVoiceAt = 0;
  let sawVoice = false;
  let voiceMs = 0;
  let lastFrameAt = 0;
  let holdOffUntil = 0;
  let holdOffPending = false;

  const reset = (at) => {
    recording = true;
    startedAt = at;
    lastVoiceAt = at;
    sawVoice = false;
    voiceMs = 0;
    lastFrameAt = at;
  };

  /** 语音累计是否够长（不够 → 本地丢弃，不打扰上游）。 */
  const hasEnoughVoice = () => sawVoice && voiceMs >= config.minVoiceMs;

  return {
    config,
    snapshot: () => ({ recording, startedAt, lastVoiceAt, sawVoice, voiceMs, holdOffUntil }),
    /** 进入保护窗（附和保护窗 / 播报结束）。 */
    holdOff(at, ms = config.holdOffMs) {
      holdOffUntil = at + ms;
      holdOffPending = ms > 0;
      recording = false;
      return { type: "hold-off", ms };
    },
    /** 开始录音（外部按钮/续录触发；保护窗中则等窗过）。 */
    begin(at) {
      if (at < holdOffUntil) {
        holdOffPending = true;
        recording = false;
        return [];
      }
      holdOffPending = false;
      reset(at);
      return [{ type: "speech-start" }];
    },
    /** 手动收段（PTT 松开 / 显式结束）。 */
    end(at) {
      if (!recording) return [];
      const durationMs = at - startedAt;
      recording = false;
      if (!hasEnoughVoice() || durationMs < config.minSegmentMs) {
        return [{ type: "discard", reason: sawVoice ? "no-voice" : "too-short", durationMs, voiceMs }];
      }
      return [{ type: "segment-close", reason: "manual", durationMs }];
    },
    /**
     * 推一帧。
     * @param {{rms:number, at:number}} frame
     */
    push(frame) {
      const at = Number(frame?.at ?? 0);
      const rms = Number(frame?.rms ?? 0);
      const events = [];
      if (holdOffPending && at >= holdOffUntil) {
        holdOffPending = false;
        events.push({ type: "hold-off-end" });
      }
      if (!recording) return events;
      if (rms >= config.speechRms) {
        if (!sawVoice) events.push({ type: "speech-start" });
        sawVoice = true;
        lastVoiceAt = at;
        /* 累计过阈时长（帧间隔按上一帧时间差估；首帧按 0 计）。 */
        voiceMs += Math.max(0, at - lastFrameAt);
      }
      lastFrameAt = at;
      const durationMs = at - startedAt;
      if (durationMs >= config.maxSegmentMs) {
        /* 30s 硬顶：自动收段并立即续录（用户无感，spec「超时段自动切分」）。 */
        const closeable = hasEnoughVoice();
        recording = false;
        events.push(
          closeable
            ? { type: "segment-close", reason: "max-length", durationMs }
            : { type: "discard", reason: sawVoice ? "no-voice" : "too-short", durationMs, voiceMs }
        );
        reset(at);
        events.push({ type: "speech-start" });
        return events;
      }
      if (sawVoice && at - lastVoiceAt >= config.silenceMs) {
        recording = false;
        /* 只有噪声瞬态（如咳嗽/键盘声）凑不满 minVoiceMs → 本地丢弃，不打上游。 */
        events.push(hasEnoughVoice() ? { type: "segment-close", reason: "silence", durationMs } : { type: "discard", reason: "no-voice", durationMs, voiceMs });
      }
      return events;
    }
  };
}

/* ── 麦克风失败面（审阅 R9） ── */

/** 运行环境探测（非安全上下文 / 无 getUserMedia → 结构化原因，不抛堆栈）。 */
export function micEnvironment(scope = globalThis) {
  const secure =
    typeof scope.isSecureContext === "boolean"
      ? scope.isSecureContext
      : typeof scope.location?.protocol === "string"
        ? scope.location.protocol === "https:" || scope.location.hostname === "127.0.0.1" || scope.location.hostname === "localhost"
        : false;
  const media = scope.navigator?.mediaDevices;
  return { secure, hasGetUserMedia: typeof media?.getUserMedia === "function" };
}

/** 采集异常 → 结构化原因（权限拒绝 / 无设备 / 非安全上下文 / 未知）。 */
export function classifyMicError(error) {
  const name = String(error?.name ?? "");
  if (name === "NotAllowedError" || name === "SecurityError" || name === "PermissionDeniedError") return "permission-denied";
  if (name === "NotFoundError" || name === "DevicesNotFoundError" || name === "OverconstrainedError") return "no-device";
  if (name === "NotReadableError" || name === "TrackStartError") return "device-busy";
  if (name === "AbortError") return "aborted";
  return "unknown";
}

/** 结构化原因 → 引导文案键（i18n；client 侧映射到 zh/en 词条）。 */
export const MIC_GUIDANCE_KEY = Object.freeze({
  "permission-denied": "hive.voice.micDenied",
  "no-device": "hive.voice.micMissing",
  "insecure-context": "hive.voice.micInsecure",
  "device-busy": "hive.voice.micBusy",
  aborted: "hive.voice.micAborted",
  unknown: "hive.voice.micUnknown"
});

/* ── 浏览器采集壳（依赖全注入，便于 smoke 以假 AudioContext 驱动） ── */

/**
 * @param {object} deps `{ getUserMedia, AudioContext, now, onSegment, onEvent, onLevel, onError }`
 */
export function createVoiceRecorder(deps = {}) {
  const scope = deps.scope ?? globalThis;
  const now = deps.now ?? (() => Date.now());
  const AudioCtor = deps.AudioContext ?? scope.AudioContext ?? scope.webkitAudioContext ?? null;
  const getUserMedia =
    deps.getUserMedia ??
    (typeof scope.navigator?.mediaDevices?.getUserMedia === "function"
      ? scope.navigator.mediaDevices.getUserMedia.bind(scope.navigator.mediaDevices)
      : null);
  const segmenter = createSegmenter(deps.segmenter);
  const sampleRateTarget = deps.sampleRate ?? 16000;

  let audioCtx = null;
  let stream = null;
  let source = null;
  let processor = null;
  let sink = null;
  let frames = [];
  let seq = 0;
  let lastLevelAt = 0;

  const emit = (event) => deps.onEvent?.(event);

  const closeSegment = (reason, durationMs) => {
    const audio = concatFrames(frames);
    frames = [];
    const pcm = floatToPcm16(resampleLinear(audio, audioCtx?.sampleRate ?? 48000, sampleRateTarget));
    seq += 1;
    const wav = wavBytes(pcm, sampleRateTarget);
    emit({ type: "segment", seq, reason, durationMs, wav, bytes: wav.byteLength });
    deps.onSegment?.({ seq, reason, durationMs, wav, bytes: wav.byteLength });
  };

  const handleFrame = (frame) => {
    if (!segmenter.snapshot().recording) return;
    frames.push(frame);
  };

  return {
    segmenter,
    mode: () => segmenter.snapshot(),
    /** 保护窗（附和保护窗 / 播报结束调用）。 */
    holdOff(ms) {
      const event = segmenter.holdOff(now(), ms);
      emit(event);
    },
    /** 打开麦克风并开始（PTT 按下 / 唤醒）。 */
    async start() {
      const env = micEnvironment(scope);
      if (!env.secure) {
        const reason = "insecure-context";
        deps.onError?.({ reason, guidance: MIC_GUIDANCE_KEY[reason] });
        throw Object.assign(new Error("insecure context"), { reason });
      }
      if (!getUserMedia || !AudioCtor) {
        const reason = "no-device";
        deps.onError?.({ reason, guidance: MIC_GUIDANCE_KEY[reason] });
        throw Object.assign(new Error("media capture unavailable"), { reason });
      }
      if (!audioCtx) audioCtx = new AudioCtor();
      if (!stream) {
        try {
          stream = await getUserMedia({
            audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
          });
        } catch (error) {
          const reason = classifyMicError(error);
          deps.onError?.({ reason, guidance: MIC_GUIDANCE_KEY[reason], error });
          throw Object.assign(new Error("microphone unavailable"), { reason });
        }
        source = audioCtx.createMediaStreamSource(stream);
        processor = audioCtx.createScriptProcessor(4096, 1, 1);
        /* ScriptProcessor 需连到 destination 才会跑——经零增益节点接地，避免回授。 */
        sink = audioCtx.createGain();
        sink.gain.value = 0;
        source.connect(processor);
        processor.connect(sink);
        sink.connect(audioCtx.destination);
        processor.onaudioprocess = (event) => {
          const frame = new Float32Array(event.inputBuffer.getChannelData(0));
          const at = now();
          const events = segmenter.push({ rms: rmsOf(frame), at });
          handleFrame(frame);
          for (const segmentEvent of events) {
            emit(segmentEvent);
            if (segmentEvent.type === "segment-close") closeSegment(segmentEvent.reason, segmentEvent.durationMs);
            else if (segmentEvent.type === "discard") frames = [];
          }
          if (at - lastLevelAt > 100) {
            lastLevelAt = at;
            deps.onLevel?.(rmsOf(frame));
          }
        };
      }
      for (const event of segmenter.begin(now())) emit(event);
      return true;
    },
    /** 手动收段（PTT 松开）。 */
    stop() {
      const events = segmenter.end(now());
      for (const event of events) {
        emit(event);
        if (event.type === "segment-close") closeSegment(event.reason, event.durationMs);
        else if (event.type === "discard") frames = [];
      }
      return events;
    },
    /** 关闭麦克风（回待机；spec：待机态麦克风保持关闭）。 */
    release() {
      try {
        processor?.disconnect?.();
        source?.disconnect?.();
        sink?.disconnect?.();
        for (const track of stream?.getTracks?.() ?? []) track.stop?.();
      } catch {
        /* ignore */
      }
      processor = null;
      source = null;
      sink = null;
      stream = null;
      frames = [];
    },
    dispose() {
      this.release();
      try {
        audioCtx?.close?.();
      } catch {
        /* ignore */
      }
      audioCtx = null;
    }
  };
}
