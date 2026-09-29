/**
 * 跨插件配置导入纯逻辑冒烟测试（add-hotbar-llm-model-and-import 任务 3.3，
 * spec `plugin-config-import`「白名单读取与安全边界」）：
 *  - 三态 available：可用 / 命名空间未注册 / settings 服务缺席（+ 非白名单拒绝）；
 *  - buttons 形状化提取：只回吐 name/prompt/autoSend/model，directories/commands
 *    等未注册消费的节与其它命名空间内容一律不透传；
 *  - model 形状防御：非法 model 剥离字段但保留条目主体；
 *  - 无敏感结构泄漏：describe() 输出、其它命名空间、原始层文档均不出现。
 * 运行：node test/plugin-imports-smoke.mjs
 */
import {
  IMPORT_NAMESPACES,
  IMPORT_REASONS,
  IMPORT_SOURCES,
  extractSkillLinksButtons,
  getPluginImportScope,
  normalizeImportedButtonModel,
  readImportSource,
  readPluginNamespace,
  setPluginImportScope
} from "../src/plugin-imports.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 白名单常量（首发 skill-links；扩展点 = 加一行注册） ── */
eq(IMPORT_NAMESPACES, ["v-skill-links"], "白名单常量 = 首发 v-skill-links");
eq(Object.keys(IMPORT_SOURCES), ["skill-links-buttons"], "导入源描述表一行（客户端导入源 id）");
eq(IMPORT_SOURCES["skill-links-buttons"].namespace, "v-skill-links", "源 → 命名空间映射");
eq(IMPORT_REASONS, { SERVICE_ABSENT: "settings-service-absent", NAMESPACE_UNREGISTERED: "namespace-unregistered" }, "两态原因常量（客户端文案分流锚点）");

/* ── 三态 available ── */
/* 1) scope 缺席（宿主无 settings 服务） */
setPluginImportScope(null);
eq(getPluginImportScope(), null, "复位后 scope 为 null");
eq(readPluginNamespace("v-skill-links"), { available: false, reason: "settings-service-absent" }, "scope 缺席 → settings-service-absent");
eq(readImportSource("skill-links-buttons"), { ok: true, available: false, reason: "settings-service-absent" }, "端点语义：恒 ok:true + available:false（不用 404/错误码）");

/* 2) 命名空间未注册（settings 在册，get 返回 undefined） */
const absentNs = { get: () => undefined };
eq(readPluginNamespace("v-skill-links", absentNs), { available: false, reason: "namespace-unregistered" }, "get → undefined → namespace-unregistered");

/* 3) 可用（形状化输出） */
const resolved = {
  directories: ["/secret/skills"],
  commands: [{ name: "内部命令", prompt: "不该透传" }],
  buttons: [
    { name: " 设计 ", prompt: "  做设计  ", autoSend: true, model: { provider: " p ", model: " m ", reasoningEffort: " max " } },
    { name: "新建", prompt: "新建提案", autoSend: false },
    { name: "坏模型", prompt: "跑", autoSend: true, model: { provider: "", model: "m" } },
    { name: "档位坏", prompt: "跑", autoSend: true, model: { provider: "p", model: "m", reasoningEffort: 3 } },
    { name: "非对象模型", prompt: "跑", autoSend: true, model: "p/m" }
  ],
  futureSection: { secret: "未来新增节" }
};
const scope = {
  get(namespace) {
    return namespace === "v-skill-links" ? resolved : { leaked: true };
  },
  describe: () => ({ allNamespaces: ["v-skill-links", "other"] })
};
const readOk = readImportSource("skill-links-buttons", scope);
eq(readOk.ok, true, "可用态恒 ok:true");
eq(readOk.available, true, "可用态 available:true");
const buttons = readOk.buttons;
eq(buttons.length, 5, "按钮逐条形状化（空名/空提示词才丢弃）");
eq(buttons[0], { name: "设计", prompt: "做设计", autoSend: true, model: { provider: "p", model: "m", reasoningEffort: "max" } }, "name/prompt/model 三处 trim；model 1:1 映射");
eq(buttons[1], { name: "新建", prompt: "新建提案", autoSend: false }, "无 model 条目不含该键（缺省不输出）");
eq(buttons[2], { name: "坏模型", prompt: "跑", autoSend: true }, "provider 空 → 剥离 model 字段，条目主体保留");
eq(buttons[3], { name: "档位坏", prompt: "跑", autoSend: true }, "reasoningEffort 非字符串 → 剥离 model 字段");
eq(buttons[4], { name: "非对象模型", prompt: "跑", autoSend: true }, "model 非对象 → 剥离 model 字段");
ok(!("directories" in buttons[0]) && !("commands" in buttons[0]), "逐条只含白名单字段");

/* ── 无敏感结构泄漏（D7：describe()/其它命名空间/原始层文档 SHALL NOT 出现） ── */
const serialized = JSON.stringify(readOk);
ok(!serialized.includes("secret"), "响应不含命名空间内未注册消费的节（futureSection/directories 内容）");
ok(!serialized.includes("allNamespaces") && !serialized.includes("other"), "响应不含 describe() 输出与其它命名空间");
ok(!serialized.includes("commands"), "响应不含 commands 节");
eq(Object.keys(buttons[0]).sort(), ["autoSend", "model", "name", "prompt"], "条目键面固定（无透传口）");

/* ── 非白名单命名空间：拒绝读取（不区分不存在，避免探测面） ── */
eq(readPluginNamespace("other-plugin", scope), { available: false, reason: "namespace-unregistered" }, "白名单外命名空间拒绝读取");
eq(readPluginNamespace("__proto__", scope), { available: false, reason: "namespace-unregistered" }, "原型键同样拒绝");
eq(readImportSource("unknown-source", scope), { ok: true, available: false, reason: "namespace-unregistered" }, "未知源 id → 不可用（恒 200 语义）");

/* ── scope 复位与坏 scope 防御 ── */
setPluginImportScope(scope);
eq(getPluginImportScope(), scope, "scope 记录可读");
setPluginImportScope({}); // 无 get → 视为未注入
eq(getPluginImportScope(), null, "无 get 的坏 scope → 归一为 null（服务缺席态）");
setPluginImportScope(null);

/* ── settings.get 抛错：收敛为源不可用，不裸异常 ── */
eq(readPluginNamespace("v-skill-links", { get: () => { throw new Error("boom"); } }), { available: false, reason: "namespace-unregistered" }, "get 抛错 → 源不可用（不裸异常）");

/* ── 形状化提取直测：坏输入一律空数组，不抛错 ── */
eq(extractSkillLinksButtons(undefined), [], "undefined → 空");
eq(extractSkillLinksButtons("x"), [], "非对象 → 空");
eq(extractSkillLinksButtons({ buttons: "x" }), [], "buttons 非数组 → 空");
eq(extractSkillLinksButtons({ buttons: [null, 3, { name: " ", prompt: "p" }, { name: "n", prompt: "  " }] }), [], "坏条目/空名/空提示词全部丢弃");
eq(normalizeImportedButtonModel(null), undefined, "model 防御：null → undefined");
eq(normalizeImportedButtonModel({ provider: "p", model: "m" }), { provider: "p", model: "m" }, "model 最小形状");
eq(normalizeImportedButtonModel({ provider: "p", model: "m", reasoningEffort: "  " }), undefined, "空白档位 → 整字段非法");

console.log("ALL PLUGIN-IMPORTS SMOKE TESTS PASSED");
