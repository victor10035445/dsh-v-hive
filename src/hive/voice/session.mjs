/**
 * 语音会话状态机与拼接稿（add-hive-voice-desk 3.2 / design D5/D8，审阅 R11/R12）。
 *
 * 纯逻辑（零 DOM/React/WebAudio）——可被 Node 直接 import 打真值表，也可被
 * client.jsx 驱动。承载：
 *  - 状态机 `待机 → 活跃(监听) ⇄ 应答播放 → 待机`（+ 失焦暂停）；
 *  - 静默计时（默认 8s，设置可调）与「新语音/指令/手动回答」的重置语义；
 *  - 分段拼接稿（按段号回填，乱序不拼错；删除/重录；失败段保留音频）；
 *  - 「当前」与「上次」分离的快照（待机切换只清当前、不清上次）；
 *  - 副作用确认卡的生命周期（请求 / 确认 / 取消 / 超时弹回）；
 *  - 附和触发判据（仅段落间隙 + 节流 + 保护窗）。
 */

/** 会话状态。 */
export const VOICE_STATE = Object.freeze({
  IDLE: "idle", // 待机（麦克风关闭）
  LISTENING: "listening", // 活跃·监听
  SPEAKING: "speaking", // 应答播放
  PAUSED: "paused" // 失焦暂停（冻结静默计时）
});

/** 会话类默认值（与 src/settings.mjs DEFAULT_SETTINGS.voice 同口径，净房在此兜底）。 */
export const VOICE_SESSION_DEFAULTS = Object.freeze({
  /** 静默自动应答阈值（design Q2 暂定 8s）。 */
  silenceMs: 8000,
  /** 副作用确认卡超时（design D3 纪律 3）。 */
  confirmTimeoutMs: 30000,
  /** 失焦持续超过此值自动结束会话（D5）。 */
  focusLossTimeoutMs: 300000,
  /** 附和开关（设置可关，D8）。 */
  backchannelEnabled: true,
  /** 附和节流：两次附和最小间隔。 */
  backchannelMinGapMs: 12000,
  /** 附和触发的最小停顿窗口（保守默认，Q3）。 */
  backchannelGapMs: 2500,
  /** 分段数上限（内存预算，R12）。 */
  maxSegments: 200,
  /** 失败段保留音频的总字节上限（R12）。 */
  maxRetainedAudioBytes: 8 * 1024 * 1024,
  /** 失败段保留音频的段数上限。 */
  maxRetainedAudioSegments: 8,
  /** 单段字节上限（30s×16k×PCM16 ≈ 0.96MB，留冗余）。 */
  maxSegmentBytes: 2 * 1024 * 1024,
  /** VAD 语音判定 RMS 阈值（设置可调）。 */
  speechRms: 0.02,
  /** 打断判据的能量阈值（S4：AEC 不达标时抬高，默认同 VAD）。 */
  bargeInRms: 0.02
});

export function sessionConfigOf(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const number = (value, fallback, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, Math.round(n)));
  };
  const decimal = (value, fallback, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  };
  return {
    silenceMs: number(source.silenceMs, VOICE_SESSION_DEFAULTS.silenceMs, 1000, 120000),
    confirmTimeoutMs: number(source.confirmTimeoutMs, VOICE_SESSION_DEFAULTS.confirmTimeoutMs, 3000, 300000),
    focusLossTimeoutMs: number(source.focusLossTimeoutMs, VOICE_SESSION_DEFAULTS.focusLossTimeoutMs, 10000, 3600000),
    backchannelEnabled: source.backchannelEnabled !== false,
    backchannelMinGapMs: number(source.backchannelMinGapMs, VOICE_SESSION_DEFAULTS.backchannelMinGapMs, 1000, 600000),
    backchannelGapMs: number(source.backchannelGapMs, VOICE_SESSION_DEFAULTS.backchannelGapMs, 500, 60000),
    maxSegments: number(source.maxSegments, VOICE_SESSION_DEFAULTS.maxSegments, 8, 2000),
    maxRetainedAudioBytes: number(source.maxRetainedAudioBytes, VOICE_SESSION_DEFAULTS.maxRetainedAudioBytes, 0, 64 * 1024 * 1024),
    maxRetainedAudioSegments: number(source.maxRetainedAudioSegments, VOICE_SESSION_DEFAULTS.maxRetainedAudioSegments, 0, 64),
    maxSegmentBytes: number(source.maxSegmentBytes, VOICE_SESSION_DEFAULTS.maxSegmentBytes, 4096, 25 * 1024 * 1024),
    speechRms: decimal(source.speechRms, VOICE_SESSION_DEFAULTS.speechRms, 0.001, 0.5),
    bargeInRms: decimal(source.bargeInRms ?? source.speechRms, VOICE_SESSION_DEFAULTS.bargeInRms, 0.001, 0.5)
  };
}

/** 空会话。 */
export function emptySession(at = 0) {
  return {
    segments: [], // { seq, text, status: "pending"|"ok"|"failed", error, audioBytes }
    history: [], // { role: "user"|"assistant", text }
    artifacts: [], // { title, relativePath, path, truncated, at }
    confirm: null, // { kind, echo, payload, candidates, at, expiresAt }
    startedAt: at,
    lastActivityAt: at
  };
}

/** 会话是否有内容（决定「结束会话」是否留下快照；空会话不覆盖上一次快照）。 */
export function hasContent(session) {
  return Boolean(session && (session.segments.length > 0 || session.history.length > 0 || session.artifacts.length > 0));
}

/** 拼接稿（按段号排序、仅取成功的段；乱序回填不影响顺序）。 */
export function transcriptOf(session) {
  return [...(session?.segments ?? [])]
    .filter((s) => s.status === "ok" && typeof s.text === "string" && s.text.trim())
    .sort((a, b) => a.seq - b.seq)
    .map((s) => s.text.trim())
    .join("\n");
}

/** 待确认的确认卡是否已超时（弹回语义：超时自动取消，SHALL NOT 悬置）。 */
export function confirmExpired(session, at) {
  const confirm = session?.confirm;
  if (!confirm) return false;
  return at >= confirm.expiresAt;
}

/** 向模型投喂的多轮历史（最近若干轮，user/assistant 交替语义由宿主净房兜底）。 */
export function historyForAnswer(session, limit = 12) {
  return (session?.history ?? []).slice(-limit).map((row) => ({ role: row.role, text: row.text }));
}

/**
 * 语音会话机。
 * @param {object} deps `{ config, now }`（now 注入便于时序冒烟）
 */
export function createVoiceSession(deps = {}) {
  const now = deps.now ?? (() => Date.now());
  let config = sessionConfigOf(deps.config);
  let state = VOICE_STATE.IDLE;
  let session = emptySession(now());
  let lastSnapshot = null; // 「上次」会话快照（页内存活期内；刷新即丢）
  let focusPaused = false;
  let focusLostAt = 0;
  let lastBackchannelAt = 0;
  let silenceAnchor = now();
  let recording = false;
  let inFlight = 0;

  const setState = (next, reason) => {
    if (state === next) return;
    state = next;
    deps.onEvent?.({ type: "state", state, reason });
  };

  const touch = (at) => {
    session.lastActivityAt = at;
    silenceAnchor = at;
  };

  /** 失败段音频保留（R12：段数与总字节双上限，超限丢弃最旧）。 */
  const retainAudio = (seq, wav) => {
    if (!wav) return 0;
    const bytes = wav.byteLength ?? wav.length ?? 0;
    if (bytes === 0 || config.maxRetainedAudioBytes === 0) return 0;
    const failed = session.segments.filter((s) => s.status === "failed" && s.audio);
    const totalBytes = () => failed.reduce((sum, s) => sum + (s.audioBytes ?? 0), 0);
    while (failed.length >= config.maxRetainedAudioSegments || totalBytes() + bytes > config.maxRetainedAudioBytes) {
      const oldest = failed.shift();
      if (!oldest) break;
      delete oldest.audio;
      oldest.audioBytes = 0;
    }
    const segment = session.segments.find((s) => s.seq === seq);
    if (segment) segment.audio = wav;
    return bytes;
  };

  /** 结束当前会话：有内容则留快照（「当前」与「上次」分离，R11）。 */
  const stash = () => {
    if (hasContent(session)) {
      lastSnapshot = {
        segments: session.segments.map((s) => ({ ...s })),
        history: session.history.map((h) => ({ ...h })),
        artifacts: session.artifacts.map((a) => ({ ...a }))
      };
      deps.onEvent?.({ type: "snapshot-saved" });
    }
  };

  const api = {
    get state() {
      return state;
    },
    get session() {
      return session;
    },
    get config() {
      return config;
    },
    setConfig(next) {
      config = sessionConfigOf({ ...config, ...(next ?? {}) });
      return config;
    },
    /** 待机快照是否可用（「继续上次」分支判据）。 */
    hasSnapshot: () => hasContent(lastSnapshot),
    snapshot: () => ({
      state,
      session: JSON.parse(JSON.stringify(session)),
      lastSnapshot: lastSnapshot ? JSON.parse(JSON.stringify(lastSnapshot)) : null
    }),

    /**
     * 唤醒（PTT 按下 / 口令入口）：默认开新会话（当前清零），但**不动** lastSnapshot。
     * 已在活跃态再次唤醒 → 幂等（不重置拼接稿）。
     */
    wake() {
      if (state === VOICE_STATE.LISTENING || state === VOICE_STATE.SPEAKING) return { ok: true, fresh: false };
      if (state === VOICE_STATE.PAUSED) {
        focusPaused = false;
      }
      const at = now();
      session = emptySession(at);
      silenceAnchor = at;
      setState(VOICE_STATE.LISTENING, "wake");
      return { ok: true, fresh: true };
    },

    /** 显式结束（口令「结束会话」/ 面板按钮，二者语义等价）。 */
    end(reason = "manual") {
      stash();
      const at = now();
      recording = false;
      inFlight = 0;
      session = emptySession(at);
      focusPaused = false;
      setState(VOICE_STATE.IDLE, reason);
      deps.onEvent?.({ type: "ended", reason });
      return { ok: true };
    },

    /** 恢复最近一次快照（口令「继续上次」）；无快照 → 结构化「没有上一次」。 */
    resumeLast() {
      if (!hasContent(lastSnapshot)) return { ok: false, reason: "no-snapshot" };
      const at = now();
      session = {
        segments: lastSnapshot.segments.map((s) => ({ ...s })),
        history: lastSnapshot.history.map((h) => ({ ...h })),
        artifacts: lastSnapshot.artifacts.map((a) => ({ ...a })),
        confirm: null,
        startedAt: at,
        lastActivityAt: at
      };
      lastSnapshot = null; // 快照被取用后即消费（避免「继续上次」反复回到同一状态）
      silenceAnchor = at;
      focusPaused = false;
      setState(VOICE_STATE.LISTENING, "resume");
      deps.onEvent?.({ type: "resumed" });
      return { ok: true };
    },

    /** 录制态标记（静默计时只在段间隙推进：录音中不算静默）。 */
    setRecording(value, at = now()) {
      recording = value === true;
      if (recording) touch(at);
    },
    isRecording: () => recording,

    /* ── 分段 ── */

    /**
     * 新段开录：登记 pending 段（段号由调用方按录音顺序分配）。
     * @returns {{ok:boolean, reason?:string, seq?:number}}
     */
    openSegment(seq, bytes = 0) {
      if (session.segments.length >= config.maxSegments) return { ok: false, reason: "too-many-segments" };
      if (bytes > config.maxSegmentBytes) return { ok: false, reason: "segment-too-large" };
      session.segments.push({ seq, text: "", status: "pending", error: null, audioBytes: bytes });
      touch(now());
      return { ok: true, seq };
    },

    /**
     * 按段号回填 ASR 结果（乱序安全：序号即位置，与到达顺序无关）。
     * 成功即释放该段音频；失败保留音频供重录（受段数/字节上限约束）。
     */
    resolveSegment(seq, { text, error, wav } = {}) {
      const segment = session.segments.find((s) => s.seq === seq);
      if (!segment) return { ok: false, reason: "unknown-segment" };
      const at = now();
      if (error) {
        segment.status = "failed";
        segment.error = String(error);
        segment.audioBytes = retainAudio(seq, wav);
      } else if (!text || !text.trim()) {
        /* 空转写（上游没听出内容）**不是错误**：单列 `empty` 状态，中性文案 + 保留重录入口。
           旧实现把它并进 failed，界面会刷出一串「转写失败」（2026-09-27 真机反馈）；
           真实传输/HTTP 失败仍走 failed + 错误通道。 */
        segment.status = "empty";
        segment.text = "";
        segment.error = "no-speech";
        segment.audioBytes = retainAudio(seq, wav);
      } else {
        segment.status = "ok";
        segment.text = text;
        segment.error = null;
        segment.audioBytes = 0;
        if (segment.audio) delete segment.audio;
      }
      touch(at);
      deps.onEvent?.({ type: "segment", seq, status: segment.status });
      return { ok: true, status: segment.status };
    },

    /** 失败段音频保留（对外暴露；内部实现见 retainAudio）。 */
    retainAudio,

    deleteSegment(seq) {
      const index = session.segments.findIndex((s) => s.seq === seq);
      if (index < 0) return { ok: false, reason: "unknown-segment" };
      session.segments.splice(index, 1);
      touch(now());
      return { ok: true };
    },

    /** 整段重录：删除旧结果并把段号交回调用方重录（段号保持，顺序不变）。 */
    markRerecord(seq) {
      const segment = session.segments.find((s) => s.seq === seq);
      if (!segment) return { ok: false, reason: "unknown-segment" };
      segment.status = "pending";
      segment.text = "";
      segment.error = null;
      delete segment.audio;
      segment.audioBytes = 0;
      touch(now());
      return { ok: true };
    },

    /** 重录完成：用新音频替换该段（音频先入 pending，转写成功后释放）。 */
    replaceSegmentAudio(seq, wav, bytes) {
      const segment = session.segments.find((s) => s.seq === seq);
      if (!segment) return { ok: false, reason: "unknown-segment" };
      segment.status = "pending";
      segment.audioBytes = bytes ?? wav?.byteLength ?? 0;
      if (wav) segment.audio = wav;
      touch(now());
      return { ok: true };
    },

    transcript: () => transcriptOf(session),
    segmentCount: () => session.segments.length,

    /* ── 多轮历史与产物 ── */

    pushHistory(role, text) {
      const value = String(text ?? "").trim();
      if (!value) return;
      session.history.push({ role: role === "assistant" ? "assistant" : "user", text: value });
      if (session.history.length > 64) session.history.splice(0, session.history.length - 64);
    },
    /**
     * 消费本轮拼接稿（指令已执行 / 应答已产出）：文本入多轮历史、段清单清空。
     * 清空是**必须**的——否则静默计时会在同一份稿上反复触发同一条指令
     * （spec「计时清零」的落点）；产物（artifacts）保留供投递。
     */
    commitTurn({ text, reply } = {}) {
      const prompt = String(text ?? "").trim();
      if (prompt) api.pushHistory("user", prompt);
      const answer = String(reply ?? "").trim();
      if (answer) api.pushHistory("assistant", answer);
      session.segments = [];
      touch(now());
      deps.onEvent?.({ type: "turn-committed" });
      return { ok: true, history: session.history.length };
    },
    history: (limit) => historyForAnswer(session, limit),
    artifacts: () => session.artifacts.map((a) => ({ ...a })),
    addArtifact(artifact) {
      if (!artifact) return;
      session.artifacts.push({ ...artifact, at: now() });
    },
    latestArtifact() {
      return session.artifacts.length > 0 ? { ...session.artifacts[session.artifacts.length - 1] } : null;
    },

    /* ── 应答播放与指令 ── */

    beginAnswer() {
      inFlight += 1;
      setState(VOICE_STATE.SPEAKING, "answer");
    },
    endAnswer() {
      inFlight = Math.max(0, inFlight - 1);
      if (inFlight === 0 && state === VOICE_STATE.SPEAKING) setState(VOICE_STATE.LISTENING, "answer-done");
      touch(now());
    },
    /** 打断了在途应答（回监听 + 上游 abort 由调用方执行）。 */
    interrupt() {
      inFlight = 0;
      if (state === VOICE_STATE.SPEAKING) setState(VOICE_STATE.LISTENING, "interrupt");
      touch(now());
    },
    markActivity(at = now()) {
      touch(at);
    },

    /* ── 副作用确认卡（D3 纪律 2/3，R10） ── */

    requestConfirm({ kind, echo, payload = {}, candidates = [] } = {}) {
      const at = now();
      session.confirm = {
        kind,
        echo: echo ?? "",
        payload,
        candidates,
        at,
        expiresAt: at + config.confirmTimeoutMs
      };
      touch(at);
      deps.onEvent?.({ type: "confirm-request", confirm: { ...session.confirm } });
      return { ...session.confirm };
    },
    pendingConfirm: () => (session.confirm ? { ...session.confirm } : null),
    /** 确认/取消：返回被消费的确认卡（无卡 → null）。 */
    resolveConfirm(accepted) {
      const confirm = session.confirm;
      session.confirm = null;
      touch(now());
      if (confirm) deps.onEvent?.({ type: "confirm-resolved", accepted: accepted === true, confirm: { ...confirm } });
      return confirm;
    },
    /** 超时弹回（返回被丢弃的卡；未超时 → null）。 */
    expireConfirm(at = now()) {
      if (!session.confirm || !confirmExpired(session, at)) return null;
      const confirm = session.confirm;
      session.confirm = null;
      deps.onEvent?.({ type: "confirm-expired", confirm: { ...confirm } });
      return confirm;
    },

    /* ── 静默计时与附和 ── */

    /**
     * 静默推进：返回本次应触发的动作（自动应答 / 失焦超时结束 / 附和）。
     * 与手动「回答」共用同一分流逻辑（spec：行为无差异）。
     */
    tick(at = now()) {
      if (focusPaused) {
        if (focusLostAt && at - focusLostAt >= config.focusLossTimeoutMs) {
          api.end("focus-timeout");
          return { action: "end", reason: "focus-timeout" };
        }
        return { action: "none" };
      }
      if (state !== VOICE_STATE.LISTENING) return { action: "none" };
      const expired = api.expireConfirm(at);
      if (expired) return { action: "confirm-expired", confirm: expired };
      const gap = at - silenceAnchor;
      const text = api.transcript();
      if (!session.confirm && !recording && inFlight === 0 && text.trim() && gap >= config.silenceMs) {
        silenceAnchor = at;
        return { action: "auto-answer", gap };
      }
      if (
        config.backchannelEnabled &&
        !session.confirm &&
        !recording &&
        inFlight === 0 &&
        session.segments.length > 0 &&
        gap >= config.backchannelGapMs &&
        at - lastBackchannelAt >= config.backchannelMinGapMs
      ) {
        lastBackchannelAt = at;
        return { action: "backchannel", gap };
      }
      return { action: "none" };
    },

    /* ── 焦点页声控（D11） ── */

    focusLost(at = now()) {
      if (focusPaused) return;
      focusPaused = true;
      focusLostAt = at;
      setState(VOICE_STATE.PAUSED, "blur");
      deps.onEvent?.({ type: "focus-lost" });
    },
    focusGained(at = now()) {
      if (!focusPaused) return;
      focusPaused = false;
      focusLostAt = 0;
      /* 静默计时冻结语义：回焦后从冻结时刻续算——把锚点整体后移失焦时长。 */
      silenceAnchor = at;
      setState(VOICE_STATE.LISTENING, "focus");
      deps.onEvent?.({ type: "focus-gained" });
    },
    isFocusPaused: () => focusPaused
  };

  return api;
}
