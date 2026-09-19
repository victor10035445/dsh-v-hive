/**
 * 蜂种预设提示词冒烟测试（hive-summon-tool 任务 1.4，spec「蜂种预设提示词」）：
 *  - normalizeBeeTypes：trim 存储、空/缺失丢弃、超 MAX_PRESET_PROMPT 丢弃（宽松路径）；
 *  - validateBeeTypesDraft：非法类型 / 空白 / 超上限字段级拒绝（presetPromptTooLong）；
 *  - 级联：删除配置 presetPrompt 的蜂种 → 字段随蜂种消失，无孤儿引用；
 *  - 绑定归一化/引擎状态与 presetPrompt 正交（旧文档缺省兼容形状回归）。
 * 运行：node test/bee-types-summon-tool-smoke.mjs
 */
import {
  MAX_PRESET_PROMPT,
  cascadeDeleteBeeType,
  normalizeAssignments,
  normalizeBeeTypes,
  validateBeeTypesDraft
} from "../src/bee-types.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── normalizeBeeTypes：归一化路径（读取，宽松） ── */
const norm = normalizeBeeTypes([
  { id: "exec", name: "执行蜂", presetPrompt: "  先读技能再动手  " },
  { id: "blank", name: "空白蜂", presetPrompt: "   " },
  { id: "gone", name: "超限蜂", presetPrompt: "x".repeat(MAX_PRESET_PROMPT + 1) },
  { id: "wrong", name: "类型坏", presetPrompt: 123 },
  { id: "plain", name: "旧文档蜂" }
]);
eq(norm[0].presetPrompt, "先读技能再动手", "trim 存储");
eq(norm[1].presetPrompt, undefined, "空白 → 丢弃（视为无预设）");
eq(norm[2].presetPrompt, undefined, "超上限 → 丢弃归一化路径（不整条丢弃蜂种）");
eq(norm[2].id, "gone", "超限蜂种本身保留（宽松读取路径不报错）");
eq(norm[3].presetPrompt, undefined, "非字符串 → 丢弃");
eq(norm[4].presetPrompt, undefined, "旧文档缺省 → 无该键（version 1 不变，无迁移）");

/* 上限恰好等于 MAX_PRESET_PROMPT → 保留 */
const atLimit = normalizeBeeTypes([{ id: "edge", name: "边界蜂", presetPrompt: "y".repeat(MAX_PRESET_PROMPT) }]);
eq(atLimit[0].presetPrompt?.length, MAX_PRESET_PROMPT, "上限边界值保留");

/* ── validateBeeTypesDraft：PUT 严格路径（字段级原因） ── */
eq(validateBeeTypesDraft([{ id: "a", name: "A", presetPrompt: "ok" }]), null, "合法预设提示词通过");
eq(
  validateBeeTypesDraft([{ id: "a", name: "A", presetPrompt: "x".repeat(MAX_PRESET_PROMPT + 1) }]),
  { field: "beeTypes[0].presetPrompt", code: "presetPromptTooLong" },
  "超上限 → 字段级 presetPromptTooLong"
);
eq(
  validateBeeTypesDraft([{ id: "a", name: "A", presetPrompt: 42 }]),
  { field: "beeTypes[0].presetPrompt", code: "invalidPresetPrompt" },
  "非字符串 → invalidPresetPrompt"
);
eq(
  validateBeeTypesDraft([{ id: "a", name: "A", presetPrompt: "   " }]),
  { field: "beeTypes[0].presetPrompt", code: "invalidPresetPrompt" },
  "纯空白 → invalidPresetPrompt（PUT 路径拒绝，与读取路径宽松丢弃不同侧）"
);
eq(
  validateBeeTypesDraft([{ id: "a", name: "A", presetPrompt: null }]),
  null,
  "null 与 undefined 同义（缺省处理）"
);

/* ── 删除级联（spec「删除级联」）：字段随蜂种消失，无残留 ── */
const swarm = [
  { id: "with", name: "带预设", presetPrompt: "行为定义", capabilities: [] },
  { id: "other", name: "其它蜂", capabilities: [{ id: "c1", name: "N", trigger: {}, action: { type: "spawn", promptTemplate: "去 {A}", targetBeeTypeId: "with" } }] }
];
const cascade = cascadeDeleteBeeType(swarm, { "s-1": "with", "s-2": "other" }, "with");
eq(cascade.beeTypes.some((t) => t.id === "with"), false, "蜂种移除");
eq(cascade.beeTypes.some((t) => t.presetPrompt === "行为定义"), false, "presetPrompt 随蜂种级联消失，SHALL NOT 产生残留");
eq(cascade.beeTypes[0].capabilities.length, 0, "指向被删蜂种的 spawn 能力经既有级联清理");
eq(cascade.assignments, { "s-2": "other" }, "绑定级联清理（既有语义回归）");

/* ── 旧文档兼容：不含 presetPrompt 的文档形状照常归一化 ── */
const legacy = normalizeBeeTypes([{ id: "old", name: "旧蜂", queuePolicy: "serialized", capabilities: [] }]);
eq(legacy, [{ id: "old", name: "旧蜂", queuePolicy: "serialized", capabilities: [] }], "旧文档键序/形状零变化");
eq(normalizeAssignments({ "s-9": "old" }, legacy), { "s-9": "old" }, "绑定归一化不受影响");

ok(MAX_PRESET_PROMPT > 0 && Number.isInteger(MAX_PRESET_PROMPT), "上限常量为正整数");

console.log("ALL BEE-TYPES SUMMON-TOOL SMOKE TESTS PASSED");
