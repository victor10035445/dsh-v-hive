/**
 * 蜂种字段瘦身冒烟测试（add-hotbar-llm-model-and-import 任务 1.5，spec
 * `dsh-hive-bee-types`「蜂种数据模型与持久化」场景「已删字段静默剥离」）：
 *  - normalizeBeeTypes：存量 `model` / `presetPrompt` 一律剥离（读取宽松，不整条丢弃蜂种）；
 *  - validateBeeTypesDraft：两字段不再有校验规则（宿主 zod strip 未知键）——
 *    `MAX_PRESET_PROMPT` 与 invalidModel / invalidPresetPrompt / presetPromptTooLong
 *    三个错误码**不再存在**（原预设提示词测试整段反转）；
 *  - 级联：删除蜂种后无残留，既有级联语义回归；
 *  - 绑定归一化/旧文档形状与本次瘦身正交。
 * 运行：node test/bee-types-summon-tool-smoke.mjs
 */
import * as beeTypes from "../src/bee-types.mjs";
import { cascadeDeleteBeeType, normalizeAssignments, normalizeBeeTypes, validateBeeTypesDraft } from "../src/bee-types.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 常量面：预设提示词长度上限随需求删除 ── */
ok(!("MAX_PRESET_PROMPT" in beeTypes), "MAX_PRESET_PROMPT 导出已删除（无残留导出被引用）");
ok(!("normalizeModel" in beeTypes), "normalizeModel 内部函数已删除（不随模块导出）");

/* ── normalizeBeeTypes：归一化路径（读取，宽松）——两字段一律剥离 ── */
const norm = normalizeBeeTypes([
  { id: "exec", name: "执行蜂", presetPrompt: "  先读技能再动手  ", model: { provider: "p", model: "m" } },
  { id: "blank", name: "空白蜂", presetPrompt: "   " },
  { id: "wrong", name: "类型坏", presetPrompt: 123, model: "not-an-object" },
  { id: "plain", name: "旧文档蜂" }
]);
ok(
  norm.every((t) => !("presetPrompt" in t) && !("model" in t)),
  "存量 presetPrompt / model 经归一化整批剥离（不整条丢弃蜂种）"
);
eq(norm.map((t) => t.id), ["exec", "blank", "wrong", "plain"], "剥离只作用于字段，蜂种条目与顺序不变");
eq(norm[3], { id: "plain", name: "旧文档蜂", queuePolicy: "free", capabilities: [] }, "旧文档缺省 → 键序/形状零变化（version 1 不变）");

/* ── validateBeeTypesDraft：PUT 严格路径不再接受两字段（strip 语义） ── */
const codesOf = (draft) => {
  const verdict = validateBeeTypesDraft(draft);
  return verdict === null ? [] : [verdict.code];
};
eq(validateBeeTypesDraft([{ id: "a", name: "A", presetPrompt: "ok", model: { provider: "p", model: "m" } }]), null, "两字段随提交直通（宿主 zod strip，非校验面）");
const legacyCodes = new Set([
  ...codesOf([{ id: "a", name: "A", presetPrompt: "x".repeat(4001) }]),
  ...codesOf([{ id: "a", name: "A", presetPrompt: 42 }]),
  ...codesOf([{ id: "a", name: "A", presetPrompt: "   " }]),
  ...codesOf([{ id: "a", name: "A", model: { provider: "", model: "m" } }]),
  ...codesOf([{ id: "a", name: "A", model: 123 }])
]);
for (const retired of ["invalidModel", "invalidPresetPrompt", "presetPromptTooLong"]) {
  ok(!legacyCodes.has(retired), `${retired} 错误码不再存在（草稿已无该字段规则）`);
}

/* ── 删除级联（spec「删除级联」）：既有语义回归，无残留 ── */
const swarm = [
  { id: "with", name: "带预设", presetPrompt: "行为定义", capabilities: [] },
  { id: "other", name: "其它蜂", capabilities: [{ id: "c1", name: "N", trigger: {}, action: { type: "spawn", promptTemplate: "去 {A}", targetBeeTypeId: "with" } }] }
];
const cascade = cascadeDeleteBeeType(swarm, { "s-1": "with", "s-2": "other" }, "with");
eq(cascade.beeTypes.some((t) => t.id === "with"), false, "蜂种移除");
eq(cascade.beeTypes.some((t) => "presetPrompt" in t), false, "presetPrompt 不入级联结果（字段已不存在）");
eq(cascade.beeTypes[0].capabilities.length, 0, "指向被删蜂种的 spawn 能力经既有级联清理");
eq(cascade.assignments, { "s-2": "other" }, "绑定级联清理（既有语义回归）");

/* ── 旧文档兼容：不含两字段的文档形状照常归一化 ── */
const legacy = normalizeBeeTypes([{ id: "old", name: "旧蜂", queuePolicy: "serialized", capabilities: [] }]);
eq(legacy, [{ id: "old", name: "旧蜂", queuePolicy: "serialized", capabilities: [] }], "旧文档键序/形状零变化");
eq(normalizeAssignments({ "s-9": "old" }, legacy), { "s-9": "old" }, "绑定归一化不受影响");

console.log("ALL BEE-TYPES SUMMON-TOOL SMOKE TESTS PASSED");
