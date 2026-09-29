/**
 * 跨插件配置导入：白名单命名空间只读拉取纯逻辑（add-hotbar-llm-model-and-import D6/R1）。
 * 独立无依赖模块——宿主 index.mjs 装配、冒烟测试直测（沿 hotbars.mjs / bee-types.mjs 先例）。
 *
 * 通道（R1 修订）：DSH settings 服务以**可选消费**接入——宿主用回调形态
 * `ctx.inject(["settings"], (sctx) => …)` 把可用 scope 记进本模块的模块级变量
 * （服务不在册 → 回调不执行 → scope 为 null，插件其余功能照常加载）。`inject`
 * **数组**是硬依赖声明，加 "settings" 会让无该服务的部署整插件不加载——SHALL NOT。
 *
 * 安全边界（D7）：只读**白名单常量命名空间**、只按已知形状提取字段；
 * `settings.describe()` 输出、白名单以外的命名空间、原始用户层/组合层文档
 * SHALL NOT 出现在任何响应或日志。本模块只经 `scope.get(ns)` 取解析后值。
 *
 * 扩展点（spec「新导入源走同一机制」）：新导入源 = 本文件 `IMPORT_SOURCES` 加一行
 * （命名空间 + 形状化提取函数），客户端导入源描述表加一行（源 id → 目标栏）。
 * SHALL NOT 为单个源新开专用读取路径。
 */

/** 白名单命名空间（首发 skill-links；后续同品牌插件在此登记）。 */
export const IMPORT_NAMESPACES = Object.freeze(["v-skill-links"]);

/** 不可用原因（客户端据此区分文案：「未安装/未启用」与「宿主 settings 缺席」）。 */
export const IMPORT_REASONS = Object.freeze({
  /** 宿主未装载 settings 服务（旧版宿主 / 服务被 disabled）——插件其余功能照常。 */
  SERVICE_ABSENT: "settings-service-absent",
  /** 命名空间未注册：插件未安装 / 未启用 / 注册失败。 */
  NAMESPACE_UNREGISTERED: "namespace-unregistered"
});

/* ── 可选 scope 持有（apply 内 ctx.inject 回调写入；未注入 = null） ── */

let settingsScope = null;

/** 记录可用 settings scope（服务在册时由 ctx.inject 回调调用；传 null 复位）。 */
export function setPluginImportScope(scope) {
  settingsScope = scope && typeof scope.get === "function" ? scope : null;
}

/** 当前 scope（测试与路由层读取；未注入 = null）。 */
export function getPluginImportScope() {
  return settingsScope;
}

/**
 * 白名单命名空间只读拉取（settings 服务缺席/未注册均以 `available:false` 表达，
 * SHALL NOT 抛错）。`scope` 缺省 = 模块级 scope（apply 注入）。
 * @returns {{available: true, value: unknown} | {available: false, reason: string}}
 */
export function readPluginNamespace(namespace, scope = settingsScope) {
  if (!IMPORT_NAMESPACES.includes(namespace)) {
    /* 防御：非白名单命名空间一律拒绝读取（不区分「不存在」与「不允许」，不泄漏探测面）。 */
    return { available: false, reason: IMPORT_REASONS.NAMESPACE_UNREGISTERED };
  }
  if (!scope || typeof scope.get !== "function") {
    return { available: false, reason: IMPORT_REASONS.SERVICE_ABSENT };
  }
  let value;
  try {
    value = scope.get(namespace);
  } catch {
    /* settings.get 在册命名空间上「读不到即 undefined」，抛错属异常路径；用户可见面上
       与未注册同为「源不可用」（两态文案不误导：宿主服务在场，问题在源侧）。 */
    return { available: false, reason: IMPORT_REASONS.NAMESPACE_UNREGISTERED };
  }
  if (value === undefined || value === null) {
    return { available: false, reason: IMPORT_REASONS.NAMESPACE_UNREGISTERED };
  }
  return { available: true, value };
}

/**
 * 快捷按钮 model 形状防御（只兜「用户手改 settings.yaml」的边界——对端
 * `normalizeButtonModel` 已是同口径：provider/model trim 非空、reasoningEffort
 * 缺省不输出该键）。形状非法 → undefined（调用方剥离 model 字段但保留条目主体）。
 */
export function normalizeImportedButtonModel(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const provider = typeof raw.provider === "string" ? raw.provider.trim() : "";
  const model = typeof raw.model === "string" ? raw.model.trim() : "";
  if (!provider || !model) return undefined;
  if (raw.reasoningEffort === undefined) return { provider, model };
  if (typeof raw.reasoningEffort !== "string") return undefined;
  const reasoningEffort = raw.reasoningEffort.trim();
  if (!reasoningEffort) return undefined;
  return { provider, model, reasoningEffort };
}

/**
 * v-skill-links 生效值 → 形状化按钮数组（逐条 `{ name, prompt, autoSend, model? }`）。
 * 只回吐白名单字段：directories / commands 等未注册消费的节 SHALL NOT 出现，
 * 命名空间里的其它键（含未来新增节）一律不透传。
 */
export function extractSkillLinksButtons(value) {
  if (!value || typeof value !== "object") return [];
  const list = Array.isArray(value.buttons) ? value.buttons : [];
  const out = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const prompt = typeof raw.prompt === "string" ? raw.prompt.trim() : "";
    /* 名称/提示词空白条目丢弃（与对端 normalizeButtons 的必填口径同侧；蜂栏卡提示词
       本就必须非空——丢弃而非导入一条空稿，避免 toast 计数与实际落稿不一致）。 */
    if (!name || !prompt) continue;
    const entry = { name, prompt, autoSend: raw.autoSend === true };
    const model = normalizeImportedButtonModel(raw.model);
    if (model) entry.model = model;
    out.push(entry);
  }
  return out;
}

/**
 * 导入源描述表（宿主半区一行 = 一个源）：源 id → { namespace, extract }。
 * 路由层按源 id 取值，SHALL NOT 为单个源新开专用读取分支。
 */
export const IMPORT_SOURCES = Object.freeze({
  "skill-links-buttons": Object.freeze({
    namespace: "v-skill-links",
    extract: extractSkillLinksButtons
  })
});

/**
 * 读取一个导入源（白名单命名空间 → 形状化载荷）。
 * 恒返回 `{ ok: true, … }`（端点恒 200 的口径）：可用 = `{ ok, available: true, buttons }`，
 * 不可用 = `{ ok, available: false, reason }`——SHALL NOT 用错误码/404/空数组表达不可用。
 * @returns {{ok: true, available: true, buttons: object[]} | {ok: true, available: false, reason: string}}
 */
export function readImportSource(sourceId, scope = settingsScope) {
  const source = IMPORT_SOURCES[sourceId];
  if (!source) return { ok: true, available: false, reason: IMPORT_REASONS.NAMESPACE_UNREGISTERED };
  const read = readPluginNamespace(source.namespace, scope);
  if (!read.available) return { ok: true, available: false, reason: read.reason };
  return { ok: true, available: true, buttons: source.extract(read.value) };
}
