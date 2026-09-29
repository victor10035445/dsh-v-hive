/**
 * 页签设置纯函数层（hive-marquee-and-card-rework 1.1/1.2 从 store.mjs 抽取）：
 * 设置归一化（init 读侧）与净房（读写两侧）全部收口于此——Node 可导入
 * （无 defineStore/localStorage 依赖），冒烟测试真值表复用（先例 assignTier /
 * isDroneVisible / isBubbleVisible 顶层导出）。store.mjs 持有 hiveStore 并再出口。
 */
import { APPEARANCE_DEFAULTS, APPEARANCE_REV } from "./hive/palette.mjs";
import { normalizeHotbars } from "./hotbars.mjs";

/* 阵列显示参数界（context-hotbar-rework D8/F5；hive-summon-tool 后按用户定稿调整）：
   右侧面板 行 n∈1–8 / 列 m∈1–3；底部道具栏 行 n∈1–2 / 列 m∈1–8。 */
export const PANEL_LIMITS = Object.freeze({ m: [1, 3], n: [1, 8] });
export const BAR_LIMITS = Object.freeze({ m: [1, 8], n: [1, 2] });
/** 作战报告面板可视行数界（左下角锚定，默认 8、上限 20；hive-combat-log）。 */
export const REPORT_ROWS_LIMIT = Object.freeze([1, 20]);

export const LAYOUT_DEFAULTS = Object.freeze({
  panelM: 2, // 右侧工蜂阵列列数
  panelN: 2, // 右侧工蜂阵列行数（可视容量，超出纵向滚动）
  barM: 8, // 底部道具栏列数
  barN: 1 // 底部道具栏行数
});

function clampInt(value, [min, max], fallback) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** 作战报告行数净房（store 写侧与 client 读侧共用口径；原 client 局部实现上移）。 */
export function sanitizeReportRows(value) {
  return clampInt(value, REPORT_ROWS_LIMIT, DEFAULT_SETTINGS.reportRows);
}

/** 布局参数读侧净房（localStorage 手改/旧档越界 → 落回界内）。 */
export function sanitizeLayout(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  return {
    panelM: clampInt(source.panelM, PANEL_LIMITS.m, LAYOUT_DEFAULTS.panelM),
    panelN: clampInt(source.panelN, PANEL_LIMITS.n, LAYOUT_DEFAULTS.panelN),
    barM: clampInt(source.barM, BAR_LIMITS.m, LAYOUT_DEFAULTS.barM),
    barN: clampInt(source.barN, BAR_LIMITS.n, LAYOUT_DEFAULTS.barN)
  };
}

/** 画布 chrome 配色方案界（hive-interaction-polish 追加）：官方令牌 + 五套主题化方案。 */
export const CHROME_SCHEMES = Object.freeze(["default", "amber", "indigo", "cyan", "magenta", "frost"]);

/* ── 语音工作台会话类设置（add-hive-voice-desk 5.1 / 审阅 R14） ──
   分层纪律：**会话/工作台设置**入本文件（localStorage，净房 + 默认值回落）；
   **人设模板与目标工作区**属宿主侧（hive-voice.json / 布局文档），两处不混层。
   这里的键与 src/hive/voice/session.mjs 的 VOICE_SESSION_DEFAULTS 同口径，
   净房由 sessionConfigOf 兜底（此处只做声明与默认值来源）。 */
export const VOICE_SETTING_LIMITS = Object.freeze({
  silenceMs: [1000, 120000],
  confirmTimeoutMs: [3000, 300000],
  focusLossTimeoutMs: [10000, 3600000],
  backchannelMinGapMs: [1000, 600000],
  backchannelGapMs: [500, 60000],
  speechRms: [0.001, 0.5]
});

export const VOICE_SETTINGS_DEFAULTS = Object.freeze({
  /** 静默自动应答阈值（默认 8s，design Q2 暂定）。 */
  silenceMs: 8000,
  /** 副作用确认卡超时（默认 30s）。 */
  confirmTimeoutMs: 30000,
  /** 失焦持续超时自动结束会话（默认 5 分钟）。 */
  focusLossTimeoutMs: 300000,
  /** 附和开关（默认开；可在设置关闭）。 */
  backchannelEnabled: true,
  /** 附和节流与窗口（Q3 保守默认）。 */
  backchannelMinGapMs: 12000,
  backchannelGapMs: 2500,
  /** 音色与语速（TTS 请求参数）。 */
  voice: "tongtong",
  speed: 1,
  /** 人设模板 id（宿主侧 personas 的引用；空 = 宿主默认）。 */
  personaId: null,
  /** VAD / 打断能量阈值（S4 预案：AEC 不达标时抬高）。 */
  speechRms: 0.02
});

function clampNumber(value, [min, max], fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** 语音设置读侧净房（localStorage 手改/旧档越界 → 落回界内；未知键丢弃）。 */
export function sanitizeVoiceSettings(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const out = { ...VOICE_SETTINGS_DEFAULTS };
  for (const [key, [min, max]] of Object.entries(VOICE_SETTING_LIMITS)) {
    out[key] = clampNumber(source[key], [min, max], VOICE_SETTINGS_DEFAULTS[key]);
  }
  out.backchannelEnabled = source.backchannelEnabled !== false;
  out.voice = typeof source.voice === "string" && /^[a-z0-9_-]{1,32}$/i.test(source.voice) ? source.voice : VOICE_SETTINGS_DEFAULTS.voice;
  out.speed = clampNumber(source.speed, [0.5, 2], VOICE_SETTINGS_DEFAULTS.speed);
  out.personaId = typeof source.personaId === "string" && source.personaId ? source.personaId : null;
  return out;
}

export const DEFAULT_SETTINGS = Object.freeze({
  animation: "full", // full | reduced（额外于系统 prefers-reduced-motion）
  watermark: "show", // show | hide（底图水印层显隐，hive-watermark D6，默认开）
  drones: "active-only", // active-only | all（无人机活跃态显隐，drone-active-visibility：完工者不渲染，默认仅活跃）
  hotkey: "alt+h", // alt+h | ctrl+alt+h | off（快捷键）
  followCurrent: true, // 镜头跟随当前会话（默认开，hive-marquee-and-card-rework 1.1；仅 current 变化沿触发）
  renderer: "webgl", // webgl（失败自动降级）| fallback2d（强制 2D 降级，不启动 3D 场景）
  showFps: true, // FPS 计数浮标（画布左上角，调试用）
  reportCollapsed: false, // 作战报告面板折叠态（左下角，展开默认；hive-combat-log）
  reportRows: 8, // 作战报告面板可视行数（左下角锚定，1–20 行，默认 8；hive-combat-log）
  cameraPitchDeg: 45, // 相机俯角锁定值（15–70，相机手势重排 D3；二轮定稿 45，旧默认 38 见 init 迁移）
  rightDragSpin: false, // 右键旋转开关（D4：开 = 右键拖拽方位旋转；关 = 全向平移，默认关）
  /* batchSendConfirm 已随 bee-status-cards 全拆移除（add-proposal-panel 4.3）：
     其唯一作用域是已拆除的完成状态栏批量派发；存量 localStorage 键由
     normalizeSettings 显式剥离（无标量白名单，不删会永久残留）。 */
  chromeScheme: "default", // 画布 chrome 配色方案（default = 官方令牌；amber/indigo/cyan/magenta/frost = 主题化底图）
  voice: { ...VOICE_SETTINGS_DEFAULTS }, // 语音工作台会话类设置（add-hive-voice-desk 5.1；人设/工作区属宿主侧）
  appearance: { ...APPEARANCE_DEFAULTS, rev: APPEARANCE_REV }, // 外观（页内设置面板）：配色/透明度
  layout: { ...LAYOUT_DEFAULTS } // 阵列显示参数（context-hotbar-rework D9：localStorage，不入布局文档）
});

/**
 * 设置读侧归一化（store.init 唯一入口；纯函数，不触 localStorage）：
 *  - 默认合并 + 外观 rev 门控 + 俯角旧默认迁移（既有语义原样搬运）；
 *  - 已拆设置键显式剥离（add-proposal-panel 4.3）：`batchSendConfirm` 随
 *    bee-status-cards 全拆移除。本函数无标量白名单（纯展开），不显式 delete
 *    则旧 localStorage 键会随整对象永久残留；
 *  - 跟随默认值一次性迁移哨兵（1.2，沿 cameraPitchDeg/appearance 迁移先例）：
 *    settings 整对象落盘——动过任何设置的老用户旧默认 followCurrent:false 已随写
 *    落盘，单纯改默认对他们无效；布尔无法沿值哨兵迁移（false 既是旧默认随写也是
 *    显式关闭）。无 `followCurrentMigrated` 标记 → 强制 true 并写标记（store.init
 *    落盘整对象）；此后显式关闭被永久尊重。
 * @returns {object} 归一化后的完整 settings（恒含 followCurrentMigrated 标记）
 */
export function normalizeSettings(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const merged = { ...DEFAULT_SETTINGS, ...source };
  /* 已拆除设置键剥离（文档字段同纪律：残留随写入剥离，不做迁移） */
  delete merged.batchSendConfirm;
  /* 外观默认值变更（rev 不一致）→ 丢弃旧外观落新默认：默认改色不被旧存档遮蔽 */
  if (merged.appearance?.rev !== APPEARANCE_REV) merged.appearance = { ...DEFAULT_SETTINGS.appearance };
  /* 俯角旧默认迁移：38 为 camera-gesture-rework 首发默认，二轮定稿改 45——
     已持久化的 38（多半是默认值随写，非显式选择）一并落新默认，可再手动调回 */
  if (merged.cameraPitchDeg === 38) merged.cameraPitchDeg = DEFAULT_SETTINGS.cameraPitchDeg;
  /* 跟随默认值一次性迁移哨兵（1.2）：标记缺失 = 迁移未执行（含全新用户）→ 翻 true；
     标记在档 = 用户已有显式选择机会 → 值原样尊重（含 false） */
  if (merged.followCurrentMigrated !== true) {
    merged.followCurrent = true;
    merged.followCurrentMigrated = true;
  }
  merged.layout = sanitizeLayout(merged.layout); // 阵列参数越界净房
  merged.reportRows = clampInt(merged.reportRows, REPORT_ROWS_LIMIT, DEFAULT_SETTINGS.reportRows); // 报告行数越界净房
  merged.voice = sanitizeVoiceSettings(merged.voice); // 语音会话类设置越界净房（5.1/R14）
  return merged;
}
