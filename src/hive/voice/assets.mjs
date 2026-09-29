/**
 * 固定语音资产清单（add-hive-voice-desk 3.5 / design D7/D8）。
 *
 * 指令应答音与附和短句 = **包内预生成 wav**（开发期用 GLM-TTS 一次性生成，
 * 见 scripts/build-voice-assets.mjs），运行期零 TTS 调用：WebAudio 解码本地资产播放。
 *
 * 本模块同时被浏览器半区与建库脚本 import——清单是唯一事实源，改名/增删只改这里。
 */

/** 资产体积预算（审阅 R18；**2026-09-27 按真实上游实测重新标定**）。
 *
 * 实测：GLM-TTS 非流式 wav = 24kHz 单声道 PCM16 = 48KB/秒，且带 1–2s 空白垫
 * （「好的」原始 2.51s / 118KB）。经「去静音 + 16kHz」归一化后本清单单条约 10–30KB、
 * 总量约 0.4MB；此处留一倍余量，仍远小于包内 ~9MB 的 GLB 模型。 */
export const ASSET_BUDGET = Object.freeze({
  /** 单条 ≤80KB（归一化后 ≈4s @16kHz 单声道 PCM16）。 */
  maxPerFile: 80 * 1024,
  /** 资产总量 ≤1.5MB。 */
  maxTotal: 1.5 * 1024 * 1024
});

/** 资产服务前缀（宿主白名单子目录 voice/，add-hive-voice-desk 2.6）。 */
export const ASSET_BASE = "/api/dsh-hive/assets/voice/";

/**
 * 台词表：`id` 为代码侧引用键，`text` 为建库脚本喂给 GLM-TTS 的原文，
 * `kind` 区分应答音（ack）与附和短句（backchannel）。
 * 文案保持短促口语（`input` ≤1024 字符；越短越省体积与播放等待——实测每字 ≈0.3s）。
 */
export const VOICE_CUES = Object.freeze([
  /* ── 指令应答音（M1 零 LLM 通路） ── */
  cue("ack-ok", "ack", "好的"),
  cue("ack-overview", "ack", "蜂巢总览"),
  cue("ack-focus", "ack", "已聚焦"),
  cue("ack-summoned", "ack", "召唤完成"),
  cue("ack-sent", "ack", "已发送"),
  cue("ack-doc-saved", "ack", "文档已落盘"),
  cue("ack-confirm", "ack", "请确认"),
  cue("ack-cancelled", "ack", "已取消"),
  cue("ack-ending", "ack", "会话结束"),
  cue("ack-no-last", "ack", "没有上一次"),
  cue("ack-no-bee", "ack", "未找到该蜂"),
  cue("ack-answer", "ack", "我去整理一下"),
  cue("ack-truncated", "ack", "文档已截断"),
  cue("ack-error", "ack", "出错了"),
  cue("ack-mic", "ack", "麦克风不可用"),
  cue("ack-asr-failed", "ack", "这段没听清"),
  cue("ack-no-model", "ack", "没有可用模型"),
  /* ── 附和短句（仅段落间隙停顿窗口，D8） ── */
  cue("bc-yeah", "backchannel", "嗯，你说"),
  cue("bc-right", "backchannel", "原来如此"),
  cue("bc-hmm", "backchannel", "嗯嗯"),
  cue("bc-go-on", "backchannel", "继续"),
  cue("bc-got-it", "backchannel", "明白了")
]);

function cue(id, kind, text) {
  return Object.freeze({ id, kind, text, file: `${id}.wav`, url: ASSET_BASE + `${id}.wav` });
}

const BY_ID = new Map(VOICE_CUES.map((c) => [c.id, c]));

/** 取台词项（未知 id → null，调用方静默跳过而 SHALL NOT 抛错）。 */
export function cueById(id) {
  return BY_ID.get(id) ?? null;
}

/** 应答音池（ack）。 */
export const ACK_CUES = Object.freeze(VOICE_CUES.filter((c) => c.kind === "ack"));

/** 附和池（backchannel，随机抽签）。 */
export const BACKCHANNEL_CUES = Object.freeze(VOICE_CUES.filter((c) => c.kind === "backchannel"));

/**
 * 指令命中 → 应答音 id 映射（M1 指令通路固定应答，design D3）。
 * 值可以是字符串（单条）或数组（随机抽一条，避免重复听感）。
 */
export const ACK_FOR_INTENT = Object.freeze({
  "session-end": "ack-ending",
  "session-resume": "ack-ok",
  "resume-missing": "ack-no-last",
  "hive-overview": "ack-overview",
  "bee-focus": "ack-focus",
  "bee-focus-missing": "ack-no-bee",
  summon: "ack-confirm",
  deliver: "ack-confirm",
  confirm: "ack-ok",
  cancel: "ack-cancelled",
  answer: "ack-answer",
  "delivery-sent": "ack-sent",
  "delivery-failed": "ack-no-bee",
  "doc-saved": "ack-doc-saved",
  "doc-truncated": "ack-truncated",
  error: "ack-error",
  "mic-denied": "ack-mic",
  "asr-failed": "ack-asr-failed",
  "no-model": "ack-no-model"
});
