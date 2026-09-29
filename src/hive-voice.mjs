/**
 * dsh-v-hive 宿主半区语音纯逻辑层（add-hive-voice-desk 2.1–2.5，design D4/D6/D7/D9/D10）。
 *
 * 与 ctx 无关的全部判定/解析/拼装收口于此——Node 可直接 import（零 node 内建依赖，
 * 需要文件系统与时间的入口一律以参数注入），冒烟测试真值表复用（先例
 * bee-types.mjs / capabilities.mjs / lane.mjs / proposals.mjs）。
 *
 * 覆盖面：
 *  - 凭据与口径常量（VOICE_LIMITS / 上游端点与模型枚举 / 音色枚举）；
 *  - `hive-voice.json` 读取（注入 readTextFile，对齐 storagePath() 的 $DSH_HOME 语义）；
 *  - multipart/form-data 解析（ASR 上传面，独立于 readJsonBody 的 JSON 口径）；
 *  - WAV 头解析取时长（30s 上限前置校验）与上传准入（content-type/字节数/时长）；
 *  - 热词表拼装（≤100 项，分层优先级）；
 *  - 人设模板 + 应答提示词拼装 + 「首段即摘要」抽取；
 *  - 落盘文件名（日期 + slug）与排他创建（-2/-3）；
 *  - 截断判定（assistant/message 流内 finish 块的 max-tokens）。
 */

/* ── 口径常量（spec「宿主语音代理与 key 管理」「分段聆听与拼接稿」） ── */

export const VOICE_LIMITS = Object.freeze({
  /** ASR 上传独立字节上限：30s×16kHz×mono×PCM16 ≈ 0.96MB，留一倍余量（审阅 R4）。 */
  ASR_MAX_BYTES: 2 * 1024 * 1024,
  /** GLM-ASR 官方硬顶：单段 ≤30 秒。 */
  ASR_MAX_SECONDS: 30,
  /** `prompt` = 上一段转写尾部，官方建议 <8000 字符。 */
  PROMPT_MAX_CHARS: 8000,
  /** `hotwords` 官方上限 100 项。 */
  HOTWORDS_MAX: 100,
  /** GLM-TTS `input` 上限 1024 字符。 */
  TTS_INPUT_MAX: 1024,
  /** 人设模板的 token 口径产出上限（设置可调，design D6 ②）。 */
  ANSWER_MAX_TOKENS: 4096,
  /** 投喂给模型的拼接稿字符上限（超长截尾，防炸上下文）。 */
  ANSWER_TRANSCRIPT_MAX: 24000,
  /** 多轮历史保留的轮数（最近 N 轮，各轮截断）。 */
  HISTORY_TURNS_MAX: 12,
  HISTORY_TURN_MAX: 4000,
  /** 客户端指称表条目上限（面板蜂数量级）。 */
  REFERENTS_MAX: 200,
  /** 排他创建的最大序号（base、base-2 … base-99）。 */
  EXCLUSIVE_MAX_SEQ: 99,
  /** 落盘文件名 slug 的字符上限。 */
  SLUG_MAX_CHARS: 48
});

/* ── 上游端点与枚举（审阅 F1/F2/F3 核对的官方契约） ── */

export const ZHIPU_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
export const ZHIPU_ASR_URL = ZHIPU_BASE_URL + "/audio/transcriptions";
export const ZHIPU_TTS_URL = ZHIPU_BASE_URL + "/audio/speech";
export const ZHIPU_CHAT_URL = ZHIPU_BASE_URL + "/chat/completions";
/** ASR 模型枚举只有这一个（无 glm-asr 别名）。 */
export const ZHIPU_ASR_MODEL = "glm-asr-2512";
export const ZHIPU_TTS_MODEL = "glm-tts";
/** TTS 音色枚举（`voice` 字段；F2）。 */
export const TTS_VOICES = Object.freeze(["tongtong", "chuichui", "xiaochen", "jam", "kazi", "douji", "luodo"]);
export const DEFAULT_VOICE = "tongtong";
export const DEFAULT_SPEED = 1;
export const SPEED_RANGE = Object.freeze([0.5, 2]);
/** 统一上游超时（连接/整体；流式另有首帧超时）。 */
export const VOICE_TIMEOUT_MS = 60000;
export const VOICE_TTS_FIRST_FRAME_TIMEOUT_MS = 15000;
/**
 * 文本应答收口超时（临时蜂后会话从 prompt 到归静）。
 * 用户是在等一段语音回答，不能无限等：2 分钟未收口即结构化失败（可重说/重试）。
 */
export const VOICE_ANSWER_TIMEOUT_MS = 120000;

/** 凭据环境变量优先级（design D10）。 */
export const KEY_ENV_NAMES = Object.freeze(["ZHIPU_API_KEY", "ZHIPUAI_API_KEY"]);

/* ── 凭据：env → $DSH_HOME/hive-voice.json（对齐 storagePath() 语义） ── */

/**
 * `hive-voice.json` 路径：`$DSH_HOME`（非空）优先，否则 `<home>/.dsh`，
 * 与 storages/dsh-hive.json 同根（storagePath 语义）。
 * @param {object} deps `{ env, home }`（home = os.homedir() 结果，注入以便纯测）
 */
export function voiceConfigPath(deps = {}) {
  const env = deps.env ?? {};
  const envHome = typeof env.DSH_HOME === "string" ? env.DSH_HOME.trim() : "";
  const home = envHome || joinPath(deps.home ?? "", ".dsh");
  return joinPath(home, "hive-voice.json");
}

/** 极简路径拼接（避免在纯逻辑层 import node:path；两段式以内足够）。 */
function joinPath(base, leaf) {
  const head = String(base ?? "");
  if (!head) return leaf;
  const sep = head.includes("\\") && !head.includes("/") ? "\\" : "/";
  return head.replace(/[\\/]+$/, "") + sep + leaf;
}

/** 智谱 key 与偏好读取（纯文本入参；文件不存在 → readTextFile 返回 null）。 */
export function parseVoiceConfig(text) {
  if (typeof text !== "string" || !text.trim()) return {};
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {}; // 损坏配置文件按「未配置」处理，SHALL NOT 抛错堆栈
  }
}

/**
 * 凭据解析：环境变量优先，其次配置文件 apiKey。
 * @param {object} deps `{ env, fileConfig }`
 * @returns {{ apiKey: string|null, source: "env"|"file"|null, envName?: string }}
 */
export function resolveVoiceKey(deps = {}) {
  const env = deps.env ?? {};
  for (const name of KEY_ENV_NAMES) {
    const value = typeof env[name] === "string" ? env[name].trim() : "";
    if (value) return { apiKey: value, source: "env", envName: name };
  }
  const fileKey = typeof deps.fileConfig?.apiKey === "string" ? deps.fileConfig.apiKey.trim() : "";
  if (fileKey) return { apiKey: fileKey, source: "file" };
  return { apiKey: null, source: null };
}

/** 文本通道形态（design D6①）：`dsh` = 复用 DSH 已配置 provider（默认），`zhipu` = 显式兜底。 */
export const TEXT_CHANNELS = Object.freeze(["dsh", "zhipu"]);

/**
 * ASR 热词在 multipart 里的序列化形态（官方 OpenAPI 未固定数组编码）：
 * `repeat` = 标准 form-style explode（`hotwords=a&hotwords=b`，默认）；
 * `json` = 单字段 JSON 字符串（部分网关口径）。
 */
export const HOTWORD_ENCODINGS = Object.freeze(["repeat", "json"]);

/** 产出上限界（token 口径；设置模态与配置文件共用）。 */
export const MAX_TOKENS_RANGE = Object.freeze([1, 131072]);

/** 音色/语速/文本模型/人设偏好净房（配置文件缺项/越界 → 默认，SHALL NOT 抛错）。 */
export function normalizeVoicePrefs(fileConfig = {}) {
  const source = fileConfig && typeof fileConfig === "object" ? fileConfig : {};
  const voice = TTS_VOICES.includes(source.voice) ? source.voice : DEFAULT_VOICE;
  const speedRaw = Number(source.speed);
  const speed = Number.isFinite(speedRaw)
    ? Math.min(SPEED_RANGE[1], Math.max(SPEED_RANGE[0], Math.round(speedRaw * 100) / 100))
    : DEFAULT_SPEED;
  const model = source.textModel && typeof source.textModel === "object" ? source.textModel : null;
  const provider = typeof model?.provider === "string" ? model.provider.trim() : "";
  const modelId = typeof model?.model === "string" ? model.model.trim() : "";
  const channel = TEXT_CHANNELS.includes(source.textChannel) ? source.textChannel : "dsh";
  const maxTokensRaw = Number(source.maxTokens);
  return {
    voice,
    speed,
    textChannel: channel,
    /* 临时蜂后会话的 agent 预设（2026-09-27 真机反馈修正）：默认 `minimal`——
       只剩一个常驻 shell，剥掉 fs / fs-search / subagent / web / skill 等工具面，
       避免模型去读别的会话日志或工作区历史。显式写 `standard` 可恢复宿主的默认工具面。 */
    textAgentPreset: typeof source.textAgentPreset === "string" && source.textAgentPreset.trim() ? source.textAgentPreset.trim() : "minimal",
    textModel: provider && modelId ? { provider, model: modelId } : null,
    personaId: typeof source.personaId === "string" ? source.personaId : null,
    targetWorkspaceId: typeof source.targetWorkspaceId === "string" ? source.targetWorkspaceId : null,
    maxTokens: Number.isFinite(maxTokensRaw) && maxTokensRaw > 0 ? Math.round(maxTokensRaw) : VOICE_LIMITS.ANSWER_MAX_TOKENS,
    asrHotwordsEncoding: HOTWORD_ENCODINGS.includes(source.asrHotwordsEncoding) ? source.asrHotwordsEncoding : "repeat"
  };
}

/**
 * 设置模态写入 `hive-voice.json` 的补丁合并（纯函数，2026-09-27 用户追补的写入式配置面）：
 *  - **只写不读**：key 只在此处写入/清除；任何读取路径（`/voice/status`）不回显、响应体不含 key；
 *  - 未知键原样保留（用户手写的说明性字段不被设置模态清掉）；
 *  - `undefined` = 不改；`null`/空串 = 删除该键（textModel / personaId / targetWorkspaceId / apiKey）；
 *  - `clearKey: true` 与空串 apiKey 同义（不写半截空 key）。
 * @param {object} existing 现有文件内容
 * @param {object} patch 已过 zod 的补丁
 */
export function mergeVoiceFileConfig(existing, patch = {}) {
  const next = { ...(existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {}) };
  const drop = (key) => {
    delete next[key];
  };
  if (patch.clearKey === true) drop("apiKey");
  else if (typeof patch.apiKey === "string") {
    const value = patch.apiKey.trim();
    if (value) next.apiKey = value;
    else drop("apiKey");
  }
  if (patch.voice !== undefined) next.voice = patch.voice;
  if (patch.speed !== undefined) next.speed = patch.speed;
  if (patch.textChannel !== undefined) next.textChannel = patch.textChannel;
  if (patch.asrHotwordsEncoding !== undefined) next.asrHotwordsEncoding = patch.asrHotwordsEncoding;
  if (patch.maxTokens !== undefined) next.maxTokens = patch.maxTokens;
  if (patch.textModel !== undefined) {
    if (patch.textModel === null) drop("textModel");
    else next.textModel = { provider: patch.textModel.provider, model: patch.textModel.model };
  }
  if (patch.personaId !== undefined) {
    if (patch.personaId === null || patch.personaId === "") drop("personaId");
    else next.personaId = patch.personaId;
  }
  if (patch.targetWorkspaceId !== undefined) {
    if (patch.targetWorkspaceId === null || patch.targetWorkspaceId === "") drop("targetWorkspaceId");
    else next.targetWorkspaceId = patch.targetWorkspaceId;
  }
  return next;
}

/**
 * `/voice/status` 载荷（spec：结构化 not-configured / no-model）。
 *
 * **只读面，恒不含 key**：`key` 只有 `{ configured, source, envNames }`；
 * 设置模态的可编辑值取自 `prefs`（宿主侧偏好）+ `catalog`（provider/model 下拉数据源）。
 * @param {object} input `{ key, prefs, catalog }`（catalog = modelCatalog() 结果或 null）
 */
export function voiceStatusOf(input = {}) {
  const key = input.key ?? { apiKey: null, source: null };
  const prefs = normalizeVoicePrefs(input.prefs ?? {});
  const catalog = input.catalog && typeof input.catalog === "object" ? input.catalog : null;
  const routableProviders = collectRoutableProviders(catalog);
  const selected = prefs.textModel ?? normalizedDefault(catalog);
  const routable = selected ? routableProviders.includes(selected.provider) : false;
  const keyConfigured = typeof key.apiKey === "string" && key.apiKey.length > 0;
  const state = !keyConfigured ? "not-configured" : !selected || !routable ? "no-model" : "ready";
  return {
    state,
    key: { configured: keyConfigured, source: key.source, envNames: [...KEY_ENV_NAMES] },
    prefs,
    text: {
      channel: prefs.textChannel,
      provider: selected?.provider ?? null,
      model: selected?.model ?? null,
      reasoningEffort: selected?.reasoningEffort ?? null,
      routable,
      routableProviders,
      default: normalizedDefault(catalog)
    },
    voices: [...TTS_VOICES],
    personas: PERSONAS.map((p) => ({ id: p.id, label: p.label })),
    hotwordEncodings: [...HOTWORD_ENCODINGS],
    catalog: catalog
      ? { default: normalizedDefault(catalog), groups: Array.isArray(catalog.groups) ? catalog.groups : [] }
      : { default: null, groups: [] }
  };
}

/** 目录默认选型（未选模型 → modelCatalog().default）。 */
export function normalizedDefault(catalog) {
  const fallback = catalog?.default;
  if (!fallback || typeof fallback !== "object") return null;
  const provider = typeof fallback.provider === "string" ? fallback.provider : "";
  const model = typeof fallback.model === "string" ? fallback.model : "";
  if (!provider || !model) return null;
  return {
    provider,
    model,
    ...(typeof fallback.reasoningEffort === "string" && fallback.reasoningEffort ? { reasoningEffort: fallback.reasoningEffort } : {})
  };
}

/** 可路由 provider 名集合（groups 结构兼容 `{ provider }` / `{ id }` / 字符串键三种形态）。 */
export function collectRoutableProviders(catalog) {
  const explicit = catalog?.routableProviders;
  if (Array.isArray(explicit)) return explicit.filter((p) => typeof p === "string" && p);
  const groups = catalog?.groups;
  if (Array.isArray(groups)) {
    return groups
      .map((g) => (typeof g === "string" ? g : g?.provider ?? g?.id ?? g?.name))
      .filter((p) => typeof p === "string" && p);
  }
  if (groups && typeof groups === "object") return Object.keys(groups);
  return [];
}

/* ── 上传面：content-type / multipart / WAV 时长 ── */

/** content-type 主类型（小写，去参数）。 */
export function mediaTypeOf(contentType) {
  return String(contentType ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
}

/** multipart 边界（无边界 → null）。 */
export function boundaryOf(contentType) {
  const match = /;\s*boundary\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(String(contentType ?? ""));
  if (!match) return null;
  const value = (match[1] ?? match[2] ?? "").trim();
  return value || null;
}

const AUDIO_EXTENSIONS = Object.freeze([".wav", ".mp3"]);

/** 文件名扩展名是否在 ASR 白名单（.wav/.mp3）。 */
export function isAllowedAudioName(filename) {
  const lower = String(filename ?? "").toLowerCase();
  return AUDIO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * 上传准入（spec「音频请求体独立口径」+ 审阅 R6）。
 * @returns {{ok:true, kind:"wav"|"mp3"}|{ok:false, status:number, error:string}}
 */
export function audioUploadCheck(input = {}) {
  const type = mediaTypeOf(input.contentType);
  if (type !== "multipart/form-data") {
    const err = new Error("content-type must be multipart/form-data");
    err.status = 415;
    return { ok: false, status: 415, error: err.message };
  }
  if (!boundaryOf(input.contentType)) return { ok: false, status: 400, error: "multipart boundary missing" };
  const bytes = Number(input.byteLength);
  if (!Number.isFinite(bytes) || bytes <= 0) return { ok: false, status: 400, error: "empty body" };
  if (bytes > VOICE_LIMITS.ASR_MAX_BYTES) return { ok: false, status: 413, error: "payload too large" };
  if (!isAllowedAudioName(input.filename)) return { ok: false, status: 400, error: "unsupported audio format" };
  const seconds = input.durationSeconds;
  if (typeof seconds === "number" && Number.isFinite(seconds) && seconds > VOICE_LIMITS.ASR_MAX_SECONDS + 0.5) {
    return { ok: false, status: 400, error: "audio exceeds 30s" };
  }
  return { ok: true, kind: String(input.filename).toLowerCase().endsWith(".mp3") ? "mp3" : "wav" };
}

/**
 * 极简 multipart/form-data 解析（只服务 ASR 上传面：单层字段 + 单文件）。
 * 输入 Buffer/Uint8Array，返回 `{ fields, files }`；结构非法 → 抛错（调用方 400）。
 * @param {Uint8Array} body
 * @param {string} boundary
 */
export function parseMultipart(body, boundary) {
  if (!boundary) throw new Error("multipart boundary missing");
  const bytes = body instanceof Uint8Array ? body : new Uint8Array(body ?? []);
  const delim = Buffer.from("--" + boundary);
  const parts = [];
  let cursor = 0;
  while (cursor < bytes.length) {
    const start = indexOfBytes(bytes, delim, cursor);
    if (start < 0) break;
    const afterDelim = start + delim.length;
    // 结束边界：`--boundary--`
    if (bytes[afterDelim] === 0x2d && bytes[afterDelim + 1] === 0x2d) break;
    // 跳过边界后的 CRLF
    let head = afterDelim;
    if (bytes[head] === 0x0d && bytes[head + 1] === 0x0a) head += 2;
    const sep = indexOfBytes(bytes, Buffer.from("\r\n\r\n"), head);
    if (sep < 0) break;
    const end = indexOfBytes(bytes, delim, sep);
    if (end < 0) break;
    parts.push({ headerStart: head, headerEnd: sep, bodyStart: sep + 4, bodyEnd: end - 2 });
    cursor = end;
  }
  const fields = {};
  const files = [];
  for (const part of parts) {
    const headerText = Buffer.from(bytes.subarray(part.headerStart, part.headerEnd)).toString("utf8");
    const disposition = /content-disposition:([^\r\n]*)/i.exec(headerText)?.[1] ?? "";
    const name = /name="([^"]*)"/i.exec(disposition)?.[1] ?? "";
    const filename = /filename="([^"]*)"/i.exec(disposition)?.[1] ?? null;
    const contentType = /content-type:\s*([^\r\n]+)/i.exec(headerText)?.[1]?.trim() ?? null;
    const data = Buffer.from(bytes.subarray(part.bodyStart, Math.max(part.bodyStart, part.bodyEnd)));
    if (filename === null) {
      if (name) fields[name] = data.toString("utf8");
    } else {
      files.push({ name, filename, contentType, data });
    }
  }
  return { fields, files };
}

function indexOfBytes(haystack, needle, from = 0) {
  const limit = haystack.length - needle.length;
  outer: for (let i = Math.max(0, from); i <= limit; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

/**
 * WAV 时长（秒）：解析 RIFF/WAVE 的 fmt + data 块。非 WAV / 缺块 → null。
 * 仅用于 30s 上限的前置校验（拿不到就不拦，交由上游判定）。
 */
export function wavDurationSeconds(body) {
  const bytes = body instanceof Uint8Array ? body : new Uint8Array(body ?? []);
  if (bytes.length < 44) return null;
  const tag = (offset, text) => String.fromCharCode(...bytes.subarray(offset, offset + text.length)) === text;
  if (!tag(0, "RIFF") || !tag(8, "WAVE")) return null;
  let offset = 12;
  let byteRate = null;
  let dataSize = null;
  while (offset + 8 <= bytes.length) {
    const id = String.fromCharCode(...bytes.subarray(offset, offset + 4));
    const view = new DataView(bytes.buffer, bytes.byteOffset + offset + 4, 4);
    const size = view.getUint32(0, true);
    if (id === "fmt ") {
      const fmt = new DataView(bytes.buffer, bytes.byteOffset + offset + 8, Math.min(16, bytes.length - offset - 8));
      byteRate = fmt.getUint32(8, true);
    } else if (id === "data") {
      dataSize = Math.min(size, bytes.length - offset - 8);
    }
    offset += 8 + size + (size % 2); // 块按偶数字节对齐
  }
  if (!byteRate || dataSize === null || !Number.isFinite(byteRate) || byteRate <= 0) return null;
  return Math.round((dataSize / byteRate) * 1000) / 1000;
}

/** 自建 44 字节 WAV 头（客户端侧同口径；宿主仅用于测试构造与校验）。 */
export function wavHeader({ dataLength, sampleRate = 16000, channels = 1, bitsPerSample = 16 }) {
  const header = Buffer.alloc(44);
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(36 + dataLength, 4);
  header.write("WAVE", 8, "ascii");
  header.write("fmt ", 12, "ascii");
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE((channels * bitsPerSample) / 8, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(dataLength, 40);
  return header;
}

/* ── WAV 归一化（固定语音资产建库专用；design D7「建库脚本支持裁剪与采样率参数」） ── */

/** 解码 RIFF/PCM16 WAV → 单声道 Int16 采样（立体声取均值；非 PCM16/非 RIFF → null）。 */
export function decodeWavPcm16(body) {
  const bytes = body instanceof Uint8Array ? body : new Uint8Array(body ?? []);
  if (bytes.length < 44) return null;
  const tag = (offset, text) => String.fromCharCode(...bytes.subarray(offset, offset + text.length)) === text;
  if (!tag(0, "RIFF") || !tag(8, "WAVE")) return null;
  let offset = 12;
  let fmt = null;
  let data = null;
  while (offset + 8 <= bytes.length) {
    const id = String.fromCharCode(...bytes.subarray(offset, offset + 4));
    const size = new DataView(bytes.buffer, bytes.byteOffset + offset + 4, 4).getUint32(0, true);
    if (id === "fmt ") {
      const view = new DataView(bytes.buffer, bytes.byteOffset + offset + 8, Math.min(16, bytes.length - offset - 8));
      fmt = { format: view.getUint16(0, true), channels: view.getUint16(2, true), sampleRate: view.getUint32(4, true), bits: view.getUint16(14, true) };
    } else if (id === "data") {
      data = bytes.subarray(offset + 8, Math.min(offset + 8 + size, bytes.length));
    }
    offset += 8 + size + (size % 2);
  }
  if (!fmt || !data || fmt.format !== 1 || fmt.bits !== 16 || !fmt.channels || !fmt.sampleRate) return null;
  const frames = Math.floor(data.length / (2 * fmt.channels));
  const out = new Int16Array(frames);
  const view = new DataView(data.buffer, data.byteOffset, frames * 2 * fmt.channels);
  for (let i = 0; i < frames; i++) {
    let sum = 0;
    for (let c = 0; c < fmt.channels; c++) sum += view.getInt16((i * fmt.channels + c) * 2, true);
    out[i] = Math.round(sum / fmt.channels);
  }
  return { sampleRate: fmt.sampleRate, channels: fmt.channels, samples: out };
}

/** 编码单声道 Int16 → 44 字节头 WAV（Buffer，便于直写文件）。 */
export function encodeWavPcm16(samples, sampleRate) {
  const pcm = Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength);
  return Buffer.concat([wavHeader({ dataLength: pcm.length, sampleRate }), pcm]);
}

/**
 * 掐头去尾非语音段（**实测必需**：GLM-TTS 非流式 wav 前面挂着 ~1.9s 低电平水印噪声）。
 *
 * 判据是**相对阈值**（`全局峰值 × ratio`），不是固定阈值：实测「好的」水印段峰值 ~5%、
 * 人声段峰值 ~71%，固定阈值切不开（水印 RMS 高于任何合理静音门限）。
 * 相对阈值同时保住了句中自然停顿（同属人声段，仍高于 ratio×峰值）。
 * @param {Int16Array} samples
 * @param {{sampleRate:number, ratio?:number, threshold?:number, padMs?:number, frameMs?:number}} options
 */
export function trimSilence(samples, options = {}) {
  const source = samples instanceof Int16Array ? samples : Int16Array.from(samples ?? []);
  const sampleRate = Number(options.sampleRate) || 16000;
  const ratio = Number.isFinite(options.ratio) ? options.ratio : 0.15;
  const padMs = Number.isFinite(options.padMs) ? options.padMs : 60;
  const frameMs = Number.isFinite(options.frameMs) ? options.frameMs : 20;
  let globalPeak = 0;
  for (let i = 0; i < source.length; i++) globalPeak = Math.max(globalPeak, Math.abs(source[i]));
  if (globalPeak === 0) return source.slice(); // 全静音：原样返回（交预算判定，不产空文件）
  const absLimit = (Number.isFinite(options.threshold) ? options.threshold : 0.012) * 0x8000;
  const limit = Math.max(absLimit, globalPeak * ratio);
  const frame = Math.max(1, Math.round((sampleRate * frameMs) / 1000));
  const isVoice = (start) => {
    let peak = 0;
    for (let i = start; i < Math.min(start + frame, source.length); i++) peak = Math.max(peak, Math.abs(source[i]));
    return peak >= limit;
  };
  let first = 0;
  while (first + frame <= source.length && !isVoice(first)) first += frame;
  let last = source.length;
  while (last - frame >= 0 && !isVoice(last - frame)) last -= frame;
  if (first >= last) return source.slice();
  const pad = Math.round((sampleRate * padMs) / 1000);
  return source.slice(Math.max(0, first - pad), Math.min(source.length, last + pad));
}

/** 线性插值重采样（Int16；短提示音足够，零依赖）。 */
export function resamplePcm16(samples, fromRate, toRate) {
  const source = samples instanceof Int16Array ? samples : Int16Array.from(samples ?? []);
  if (!fromRate || !toRate || fromRate === toRate || source.length === 0) return source.slice();
  const ratio = fromRate / toRate;
  const outLength = Math.max(1, Math.floor(source.length / ratio));
  const out = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const pos = i * ratio;
    const left = Math.floor(pos);
    const right = Math.min(source.length - 1, left + 1);
    const frac = pos - left;
    out[i] = Math.round(source[left] * (1 - frac) + source[right] * frac);
  }
  return out;
}

/**
 * 建库归一化：解码 → 去静音 → 降采样 → 重编码（返回 null = 非 PCM16 WAV）。
 * 实测依据（2026-09-27 真实 key）：上游给 24kHz 单声道 PCM16 且带空白垫，
 * 「好的」2.51s/118KB、「这是蜂巢总览」3.55s/166KB——不归一化单条必然超预算。
 * @returns {{bytes:Buffer, sampleRate:number, seconds:number, trimmedMs:number}|null}
 */
export function normalizeCueWav(body, options = {}) {
  const decoded = decodeWavPcm16(body);
  if (!decoded) return null;
  const targetRate = Number.isFinite(options.targetRate) ? options.targetRate : 16000;
  const trimmed =
    options.trim === false ? decoded.samples : trimSilence(decoded.samples, { sampleRate: decoded.sampleRate, ...(options.trimOptions ?? {}) });
  const resampled = resamplePcm16(trimmed, decoded.sampleRate, targetRate);
  return {
    bytes: encodeWavPcm16(resampled, targetRate),
    sampleRate: targetRate,
    seconds: Math.round((resampled.length / targetRate) * 1000) / 1000,
    trimmedMs: Math.round(((decoded.samples.length - trimmed.length) / decoded.sampleRate) * 1000)
  };
}

/* ── ASR 提示词侧：prompt 截断 + 动态热词 ── */

/** 上一段转写尾部（<8000 字符，取尾部以保连续性）。 */
export function truncatePrompt(text, max = VOICE_LIMITS.PROMPT_MAX_CHARS) {
  const value = String(text ?? "");
  if (value.length <= max) return value;
  return value.slice(value.length - max);
}

/**
 * 热词表（≤100 项，分层优先级）：①openspec 提案名 ②蜂名 ③蜂种名 ④技能/技术词。
 * 归一化去重（大小写不敏感）后按优先级截断。
 */
export function buildHotwords(sources = {}, max = VOICE_LIMITS.HOTWORDS_MAX) {
  const tiers = [
    asArray(sources.proposals),
    asArray(sources.beeNames),
    asArray(sources.beeTypeNames),
    asArray(sources.terms)
  ];
  const seen = new Set();
  const out = [];
  for (const tier of tiers) {
    for (const raw of tier) {
      const word = String(raw ?? "").trim();
      if (!word || word.length > 64) continue;
      const key = word.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(word);
      if (out.length >= max) return out;
    }
  }
  return out;
}

/** openspec/changes 目录名 → 提案名索引（排除 archive 与隐藏项）。 */
export function collectProposalNames(names) {
  return asArray(names)
    .map((n) => String(n ?? "").trim())
    .filter((n) => n && n !== "archive" && !n.startsWith("."))
    .sort();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/* ── 人设模板与应答提示词（design D6②⑤） ── */

/** 人设模板（宿主侧版本化；首段即口语摘要的约定写死在模板里）。 */
export const PERSONAS = Object.freeze([
  Object.freeze({
    id: "queen-research",
    label: "蜂后·调研陪聊",
    rev: 1,
    spokenSentences: "2–4",
    skeleton: [
      "## 结论速览",
      "## 关键比较 / 事实依据",
      "## 建议的下一步"
    ],
    tone: "沉稳、直接、像一位一起做技术调研的资深同伴；先给判断，再给依据。"
  }),
  Object.freeze({
    id: "queen-brief",
    label: "蜂后·简报到点",
    rev: 1,
    spokenSentences: "1–2",
    skeleton: ["## 要点", "## 待办"],
    tone: "极简、点到为止，不展开论证。"
  })
]);

export const DEFAULT_PERSONA_ID = "queen-research";

export function personaById(id) {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}

/** 系统提示词：人设 + 首段即摘要 + 文档骨架 + token 硬上限约定。 */
export function buildSystemPrompt(persona, { maxTokens = VOICE_LIMITS.ANSWER_MAX_TOKENS } = {}) {
  const p = persona ?? PERSONAS[0];
  return [
    `你是 DSH 蜂巢页的「蜂后」，${p.tone}`,
    "",
    "输出要求（务必严格遵守）：",
    `1. 只输出一份 markdown 文档，不要任何前后缀说明、不要代码围栏包裹整篇。`,
    `2. **第一个自然段就是口语摘要**：${p.spokenSentences} 句，可直接朗读，不出现任何 markdown 标记`,
    "   （不要标题、不要列表、不要加粗、不要反引号、不要链接、不要 emoji）。",
    "3. 摘要段之后空一行，再写详细正文；正文用下列骨架（可按内容增补小节）：",
    ...p.skeleton.map((h) => `   ${h}`),
    `4. 全文总量控制在 ${maxTokens} token 以内；宁精不泛，绝不写空话。`,
    "5. 语言与用户口述一致（默认中文）。若口述内容不足以支撑结论，就直说缺什么信息，不要编造。",
    /* 实测修正（2026-09-27 真实 key 首次端到端）：临时蜂后会话是**完整 agent 会话**，
       默认带工具；模型一旦去调工具，本回合首条 assistant 消息正文为空（旧收口逻辑因此
       误判「empty content」）并白烧额度。显式禁工具是最省的护栏。 */
    "6. **不要调用任何工具**（不读写文件、不搜索、不执行命令）：回答所需的全部信息都已在下方给出。",
    /* 实测修正 2（同日真机反馈）：默认 standard 预设下模型真会去翻文件/会话，
       出现「应答里带出其他会话信息」。除了改用 minimal 预设（宿主侧），提示词再加硬约束。 */
    "7. **只依据「本次口述拼接稿」作答**：不得引用、猜测或罗列任何未在此处出现的信息",
    "   （其他会话标题、文件内容、历史记录一律不算素材）；缺信息就直说缺什么。",
    /* 实测修正 3（同日第二轮真机）：宿主会把技能清单等附带内容拼进上下文，
       模型于是花整段解释「我拿到了 openspec-explore 技能说明但用不了」；
       另有把篇幅花在罗列自身限制上的倾向。两条都按噪音处理。 */
    "8. 上下文中若出现与本次口述无关的附带内容（技能清单、运行环境说明、工具说明等），",
    "   一律**忽略且不要评论**：它们不是用户口述，也不该出现在你的回答里。",
    "9. **不要用篇幅解释你的限制**（不知道时间、不能查文件之类最多一句带过），",
    "   把字数留给口述内容本身的结论与依据；信息确实不足时，只列出「还需要什么」即可。"
  ].join("\n");
}

/**
 * 指称表格式化（客户端组装，宿主只读；design D9/R2）。
 * @param {Array} referents `[{ index, title, beeTypeName, sessionId, selected }]`
 */
export function formatReferents(referents) {
  const rows = normalizeReferents(referents);
  if (rows.length === 0) return "（当前蜂巢页没有可指称的蜂）";
  return rows
    .map((r) => {
      const parts = [`${r.index}号蜂 = 「${r.title}」`];
      if (r.beeTypeName) parts.push(`蜂种：${r.beeTypeName}`);
      if (r.selected) parts.push("（当前选中）");
      return "- " + parts.join(" ");
    })
    .join("\n");
}

/** 指称表净房：丢弃无标题/无序号项，封顶并去重。 */
export function normalizeReferents(referents) {
  const out = [];
  for (const raw of asArray(referents)) {
    const index = Math.round(Number(raw?.index));
    const title = typeof raw?.title === "string" ? raw.title.trim() : "";
    if (!Number.isFinite(index) || index <= 0 || !title) continue;
    out.push({
      index,
      title: title.slice(0, 120),
      beeTypeName: typeof raw?.beeTypeName === "string" ? raw.beeTypeName.trim().slice(0, 60) : "",
      sessionId: typeof raw?.sessionId === "string" ? raw.sessionId : "",
      selected: raw?.selected === true
    });
    if (out.length >= VOICE_LIMITS.REFERENTS_MAX) break;
  }
  return out;
}

/** 多轮历史净房（最近 N 轮，各轮截断）。 */
export function normalizeHistory(history) {
  const rows = [];
  for (const raw of asArray(history)) {
    const role = raw?.role === "assistant" ? "assistant" : raw?.role === "user" ? "user" : null;
    const text = typeof raw?.text === "string" ? raw.text.trim() : "";
    if (!role || !text) continue;
    rows.push({ role, text: text.slice(0, VOICE_LIMITS.HISTORY_TURN_MAX) });
  }
  return rows.slice(-VOICE_LIMITS.HISTORY_TURNS_MAX);
}

/**
 * 口述是否**真的在指称蜂**（决定要不要把指称表塞进提示词）。
 *
 * 2026-09-27 真机反馈修正（关键）：指称表含**每只蜂的会话标题**。无条件注入时，模型会把它
 * 当内容清点——真实产物里出现过「18 只已命名蜂的状态保持原样」「蜂巢里已经有一只
 * 『算一下18乘以9』」这类句子，用户读到的正是「它读取了其他会话的信息」。
 * 而指称表对模型的唯一用途是解析「几号蜂」指谁，**普通调研口述根本用不到**。
 * 故：只有口述里真的出现蜂指称（序号蜂 / 这只蜂 / 已知标题 / 蜂种名）才注入。
 * 指令型的「发给三号蜂」在客户端语法层就解析掉了，不进这条管线。
 */
export function transcriptReferencesBees(transcript, referents) {
  const text = String(transcript ?? "")
    .normalize("NFKC")
    .toLowerCase();
  if (!text.trim()) return false;
  if (/([0-9]{1,3}|[一二两三四五六七八九十]{1,3})号?(蜂|工蜂)/.test(text)) return true;
  if (/这只蜂|这个蜂|当前蜂|选中的蜂|这只工蜂|当前会话/.test(text)) return true;
  for (const row of normalizeReferents(referents)) {
    const title = row.title.trim().toLowerCase();
    if (title.length >= 4 && text.includes(title)) return true;
    const type = row.beeTypeName.trim().toLowerCase();
    if (type.length >= 3 && text.includes(type)) return true;
  }
  return false;
}

/**
 * 用户提示词：指称表 + 多轮历史 + 本次拼接稿。
 *
 * 指称表纪律（2026-09-27 真机反馈修正，两处）：
 *  ① **按需注入**——口述没提到蜂就整节省略（见 `transcriptReferencesBees`），
 *     从源头断掉「把别的会话标题当素材清点」；
 *  ② 空表不送占位句（模型曾把「（当前蜂巢页没有可指称的蜂）」原样抄进正文）。
 */
export function buildAnswerPrompt({ transcript, history, referents, targetWorkspacePath } = {}) {
  const text = String(transcript ?? "").slice(0, VOICE_LIMITS.ANSWER_TRANSCRIPT_MAX);
  const rows = normalizeHistory(history);
  const refs = normalizeReferents(referents);
  const lines = [];
  if (refs.length > 0 && transcriptReferencesBees(text, refs)) {
    lines.push(
      "## 几号蜂的对应关系（**仅供解析「几号蜂」指谁；它不是本次讨论的内容，" +
        "不得复述、不得罗列、不得据此统计蜂群状态**）",
      formatReferents(refs),
      ""
    );
  }
  if (targetWorkspacePath) lines.push(`目标工作区：${targetWorkspacePath}`, "");
  if (rows.length > 0) {
    lines.push("## 此前多轮讨论");
    for (const row of rows) lines.push(`${row.role === "user" ? "用户" : "蜂后"}：${row.text}`);
    lines.push("");
  }
  lines.push("## 本次口述拼接稿（可能含 ASR 误差，按语义理解）", text);
  return lines.join("\n");
}

/* ── 双 register 产出：首段即摘要的抽取 ── */

const MD_INLINE = [
  [/`([^`]*)`/g, "$1"],
  [/\*\*([^*]+)\*\*/g, "$1"],
  [/__([^_]+)__/g, "$1"],
  [/(^|[^*])\*([^*]+)\*/g, "$1$2"],
  [/\[([^\]]+)\]\([^)]*\)/g, "$1"],
  [/~~([^~]+)~~/g, "$1"]
];

/** 去掉行内 markdown 标记（摘要朗读用）。 */
export function stripInlineMarkdown(text) {
  let out = String(text ?? "");
  for (const [pattern, replacement] of MD_INLINE) out = out.replace(pattern, replacement);
  return out.replace(/\s+/g, " ").trim();
}

/**
 * 抽取 `spoken`（首段即口语摘要）与正文。
 * 首段为空（模型先写了标题）→ 顺延到第一个非标题非列表段落；
 * 仍拿不到 → 取正文前 2 句兜底（SHALL NOT 返回空摘要）。
 * @returns {{spoken: string, markdown: string, fromFallback: boolean}}
 */
export function splitAnswer(markdown) {
  const doc = String(markdown ?? "").trim();
  if (!doc) return { spoken: "", markdown: "", fromFallback: false };
  const blocks = doc.split(/\r?\n\s*\r?\n/);
  for (const block of blocks) {
    const firstLine = block.split(/\r?\n/)[0] ?? "";
    if (/^\s*(#{1,6}\s|[-*+]\s|\d+[.)]\s|>|\|)/.test(firstLine)) continue; // 标题/列表/引用/表格
    const spoken = stripInlineMarkdown(block);
    if (spoken) return { spoken, markdown: doc, fromFallback: false };
  }
  const plain = stripInlineMarkdown(doc.replace(/^\s*#{1,6}[^\n]*$/gm, ""));
  const sentences = plain.split(/(?<=[。！？!?；;])/).filter((s) => s.trim());
  const spoken = sentences.slice(0, 2).join("").trim() || plain.slice(0, 200);
  return { spoken, markdown: doc, fromFallback: true };
}

/* ── 落盘：文件名与排他创建（design D6④，审阅 R7） ── */

/** 本地日期戳 YYYY-MM-DD（注入 Date 便于纯测）。 */
export function dateStamp(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * 文件名 slug：保留中日韩与字母数字，其余折成 `-`；Windows 非法字符一律剥离。
 * 空结果回落 "voice"。
 */
export function slugify(text, max = VOICE_LIMITS.SLUG_MAX_CHARS) {
  const raw = String(text ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  const trimmed = raw.slice(0, max).replace(/[-. ]+$/g, "");
  return trimmed || "voice";
}

/** 文档文件名（不含目录）：`<YYYY-MM-DD>-<slug>.md`。 */
export function docFileName(date, slug) {
  return `${dateStamp(date)}-${slugify(slug)}.md`;
}

/**
 * 排他创建：base.md 占用则 base-2.md / base-3.md …（上限 EXCLUSIVE_MAX_SEQ）。
 * @param {string} fileName 期望文件名（含 .md）
 * @param {(name: string) => boolean} exists 存在性判定（注入，纯测）
 * @returns {{ name: string, seq: number }}
 */
export function exclusiveDocName(fileName, exists) {
  const name = String(fileName);
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  if (!exists(name)) return { name, seq: 1 };
  for (let seq = 2; seq <= VOICE_LIMITS.EXCLUSIVE_MAX_SEQ; seq++) {
    const candidate = `${stem}-${seq}${ext}`;
    if (!exists(candidate)) return { name: candidate, seq };
  }
  throw new Error("too many files with the same name");
}

/** 截断标注尾注（SHALL NOT 静默存半截文档；文案含 spec 要求的「已截断」字样）。 */
export const TRUNCATION_NOTE = "> ⚠️ 本文档已截断：模型输出达到长度上限，内容不完整。";

/** 追加截断标注（幂等）。 */
export function withTruncationNote(markdown) {
  const doc = String(markdown ?? "");
  if (doc.includes(TRUNCATION_NOTE)) return doc;
  return doc.replace(/\s*$/, "") + "\n\n" + TRUNCATION_NOTE + "\n";
}

/* ── 截断判定：assistant/message 的流内 finish 块（design D6②） ── */

/**
 * 从 `assistant/message` 事件的 `stream` 记录里取 finish 种类。
 * 兼容三种承载：raw `chunk` 记录 / `chunk.reason` / `reason.kind` 直挂。
 * @returns {"stop"|"tool-calls"|"max-tokens"|"aborted"|"error"|null}
 */
export function finishKindOf(stream) {
  for (const record of asArray(stream)) {
    const chunk = record?.type === "chunk" ? record.chunk : record;
    if (chunk?.type !== "finish") continue;
    const kind = chunk.reason?.kind ?? chunk.reason?.type ?? chunk.reason;
    if (typeof kind === "string") return kind;
  }
  return null;
}

/** 该 finish 种类是否代表被长度截断。 */
export function isLengthTruncation(kind) {
  return kind === "max-tokens" || kind === "length";
}

/** 截断判定：finish 种类优先，缺省回落 usage.outputTokens 逼近上限的启发式。 */
export function detectTruncation({ finishKind, usage, maxTokens }) {
  if (isLengthTruncation(finishKind)) return true;
  if (finishKind) return false;
  const out = Number(usage?.outputTokens);
  if (!Number.isFinite(out) || !Number.isFinite(maxTokens) || maxTokens <= 0) return false;
  return out >= maxTokens - 1;
}

/* ── 目标工作区解析（宿主反查：registry 实体字段为 `id`，见 design D13.1 结论） ── */

/**
 * 在册工作区按 id 反查（`ctx.workspaceRegistry.list()` 返回 Workspace 实体：
 * `{ id, path, title, sessionIds }`——`workspaceId` 是浏览器投影 WorkspaceView 的字段名，
 * 宿主侧 SHALL 用 `id`。双写兜底以兼容未来投影变更。）
 */
export function workspaceEntityId(workspace) {
  const id = workspace?.id ?? workspace?.workspaceId;
  return typeof id === "string" && id ? id : null;
}

/** 目标工作区解析：显式 id 优先（须在册），否则默认首个；均无 → null。 */
export function resolveWorkspaceTarget(workspaces, workspaceId) {
  const list = asArray(workspaces).filter((w) => workspaceEntityId(w) && typeof w?.path === "string" && w.path);
  if (list.length === 0) return null;
  if (workspaceId) {
    const hit = list.find((w) => workspaceEntityId(w) === workspaceId);
    if (hit) return { id: workspaceEntityId(hit), path: hit.path, title: typeof hit.title === "string" ? hit.title : "" };
    return null; // 显式指定但不在册 → 结构化报错，SHALL NOT 静默落到别的工作区
  }
  const first = list[0];
  return { id: workspaceEntityId(first), path: first.path, title: typeof first.title === "string" ? first.title : "" };
}
