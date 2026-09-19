/**
 * 蜂种纯逻辑冒烟测试（custom-bee-types 任务 2.5，对应 spec「非法配置拒绝」
 * 「删除蜂种自动回落」「旧文档兼容」）。
 * 运行：node test/bee-types-smoke.mjs
 */
import {
  MAX_BEE_TYPES,
  RESERVED_BEE_TYPE_ID,
  cascadeDeleteBeeType,
  boundBeeTypeOf,
  normalizeAssignments,
  normalizeBeeTypes,
  normalizeEngineState,
  parseTemplate,
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
const codeOf = (draft, field, code, message) => {
  const error = validateBeeTypesDraft(draft);
  ok(error && error.field === field && error.code === code, `${message}（got ${JSON.stringify(error)}）`);
};

/* ── 归一化（读取路径） ── */

const cap = (id, name, action = {}) => ({
  id,
  name,
  trigger: { capture: { A: "proposal" } },
  action: { type: "send", promptTemplate: "审阅 {A}", ...action }
});
const bee = (id, name, extra = {}) => ({
  id,
  name,
  queuePolicy: "free",
  capabilities: [cap(id + "-c1", "交接")],
  ...extra
});

eq(normalizeBeeTypes(null), [], "null → 空列表");
eq(normalizeBeeTypes(undefined), [], "undefined → 空列表");
eq(normalizeBeeTypes("x"), [], "字符串 → 空列表");

const list = normalizeBeeTypes([
  bee("design-bee", "设计蜂", { description: " 设计  ", model: { provider: "deepseek-official", model: "deepseek-v4-pro" }, queuePolicy: "serialized" }),
  { id: "bad-id", name: "" },
  { id: RESERVED_BEE_TYPE_ID, name: "保留字" },
  { id: "dup", name: "A" },
  { id: "dup", name: "B" },
  { id: "wild-card", name: "野蜂", queuePolicy: "whatever", capabilities: [{ id: "c", name: "n", action: { type: "fly" } }] }
]);
eq(list.length, 3, "非法条目丢弃、重复 id 去重后剩 3 条");
eq(list[0].description, "设计", "description trim");
eq(list[0].model, { provider: "deepseek-official", model: "deepseek-v4-pro" }, "model 形状合法保留");
eq(list[0].queuePolicy, "serialized", "queuePolicy 保留");
eq(list[2].queuePolicy, "free", "非法 queuePolicy 回落 free");
eq(list[2].capabilities.length, 0, "非法 action 的能力丢弃");

/* 外观模型（bee-model-variants）：合法保留、非法/缺省回落 */
const withModels = normalizeBeeTypes([
  bee("p", "紫", { beeModel: "purple_worker" }),
  bee("w", "默", { beeModel: "worker" }),
  bee("x", "坏", { beeModel: "not-a-model" })
]);
eq(withModels[0].beeModel, "purple_worker", "合法外观模型保留");
eq(withModels[1].beeModel, undefined, "默认外观省略字段");
eq(withModels[2].beeModel, undefined, "未知外观模型回落默认");
codeOf([bee("a", "A", { beeModel: "nope" })], "beeTypes[0].beeModel", "invalidBeeModel", "未知外观模型拒绝");

/* model 缺 reasoningEffort 时不补空串 */
eq(normalizeBeeTypes([bee("m", "M", { model: { provider: "p", model: "m" } })])[0].model, { provider: "p", model: "m" }, "model 最小形状");

/* 上限 16 截断 */
eq(normalizeBeeTypes(Array.from({ length: 20 }, (_, i) => bee("t" + i, "T" + i))).length, MAX_BEE_TYPES, "超上限截断 16");

/* 绑定归一化：未知蜂种回落为无绑定（默认蜂） */
const types = normalizeBeeTypes([bee("a", "A"), bee("b", "B")]);
eq(normalizeAssignments({ "s-1": "a", "s-2": "gone", "s-3": "b" }, types), { "s-1": "a", "s-3": "b" }, "指向已删蜂种的绑定清除");
eq(normalizeAssignments(null, types), {}, "null 绑定 → 空");
eq(boundBeeTypeOf("s-2", types, { "s-2": "gone" }), null, "默认蜂回落：无有效绑定 → null");
eq(boundBeeTypeOf("s-1", types, { "s-1": "a" }).id, "a", "有效绑定解析蜂种");
eq(boundBeeTypeOf(undefined, types, {}), null, "无会话 → null");

/* 门状态归一化 */
eq(normalizeEngineState({ "s-1": { vars: { A: "x" }, latches: { c1: ["k"] }, watermarks: { c1: 5 } } }), { "s-1": { vars: { A: "x" }, latches: { c1: ["k"] }, watermarks: { c1: 5 } } }, "合法门状态保留");
eq(normalizeEngineState({ "s-1": { vars: { "bad name": "x" }, latches: { c1: "nope" }, watermarks: { c1: -1 } } }), { "s-1": { vars: {}, latches: {}, watermarks: {} } }, "坏形状条目清空");

/* ── 模板占位符解析（可编译性） ── */

ok(parseTemplate("请用 /opsx:new 创建提案 {A}").ok === true, "合法占位符");
ok(parseTemplate("字面 {{literal}} 值").ok === true, "{{ }} 转义合法");
ok(parseTemplate("缺失闭合 {A").ok === false, "未闭合 → 不可编译");
ok(parseTemplate("空 {} 占位").ok === false, "空占位符 → 不可编译");
ok(parseTemplate("倒 {1x} 占位").ok === false, "非法变量名 → 不可编译");
ok(parseTemplate("裸 } 括号").ok === false, "裸 } → 不可编译");

/* ── 严格校验（PUT 路径）：spec「非法配置拒绝」→ 400 字段级原因 ── */

ok(validateBeeTypesDraft([]) === null, "空列表合法（清空全部蜂种）");
ok(validateBeeTypesDraft([bee("a", "A", { capabilities: [] })]) === null, "无能力蜂种合法");

codeOf("nope", "beeTypes", "invalidShape", "非数组拒绝");
codeOf(Array.from({ length: 17 }, (_, i) => bee("t" + i, "T" + i)), "beeTypes", "tooManyBeeTypes", "超出上限 16 拒绝");
codeOf([bee("", "A")], "beeTypes[0].id", "missingId", "缺 id 拒绝");
codeOf([bee("default", "A")], "beeTypes[0].id", "reservedId", "保留字 default 拒绝");
codeOf([bee("Bad Id", "A")], "beeTypes[0].id", "invalidId", "id 形状拒绝");
codeOf([bee("a", "A"), bee("a", "B")], "beeTypes[1].id", "duplicateId", "id 重复拒绝");
codeOf([bee("a", "  ")], "beeTypes[0].name", "missingName", "缺名称拒绝（spec 场景）");
codeOf([bee("a", "A", { model: { provider: "", model: "m" } })], "beeTypes[0].model", "invalidModel", "model 缺 provider 拒绝");
codeOf([bee("a", "A", { queuePolicy: "fifo" })], "beeTypes[0].queuePolicy", "invalidQueuePolicy", "queuePolicy 枚举外拒绝");

const draft = (capOverrides, beeExtra = {}) => [bee("a", "A", { capabilities: [{ id: "c1", name: "N", trigger: { capture: { A: "proposal" } }, action: { type: "send", promptTemplate: "x {A}" }, ...capOverrides }], ...beeExtra })];

codeOf([{ id: "a", name: "A", capabilities: "nope" }], "beeTypes[0].capabilities", "invalidShape", "capabilities 非数组拒绝");
codeOf([bee("a", "A", { capabilities: Array.from({ length: 17 }, (_, i) => cap("c" + i, "N")) })], "beeTypes[0].capabilities", "tooManyCapabilities", "能力超上限拒绝");
codeOf(draft({ id: "c1", name: "" }), "beeTypes[0].capabilities[0].name", "missingName", "能力缺名拒绝");
codeOf([bee("a", "A", { capabilities: [cap("c1", "N"), cap("c1", "M")] })], "beeTypes[0].capabilities[1].id", "duplicateId", "能力 id 重复拒绝");
codeOf(draft({ action: { type: "teleport" } }), "beeTypes[0].capabilities[0].action.type", "invalidActionType", "动作类型枚举外拒绝");
codeOf(draft({ action: { type: "send" } }), "beeTypes[0].capabilities[0].action.promptTemplate", "missingTemplate", "send 缺模板拒绝");
codeOf(draft({ action: { type: "send", promptTemplate: "{A" } }), "beeTypes[0].capabilities[0].action.promptTemplate", "invalidTemplate", "模板不可编译拒绝（spec 场景）");
codeOf(draft({ action: { type: "spawn", promptTemplate: "x" } }), "beeTypes[0].capabilities[0].action.targetBeeTypeId", "missingTarget", "spawn 缺目标拒绝");
codeOf(draft({ action: { type: "spawn", promptTemplate: "x", targetBeeTypeId: "default" } }), "beeTypes[0].capabilities[0].action.targetBeeTypeId", "invalidTarget", "spawn 目标保留字拒绝");
codeOf([bee("a", "A", { capabilities: [{ id: "c1", name: "N", trigger: { capture: { "9bad": "p" } }, action: { type: "notify" } }] })], "beeTypes[0].capabilities[0].trigger.capture.9bad", "invalidCaptureVar", "捕获变量名非法拒绝");
codeOf([bee("a", "A", { capabilities: [{ id: "c1", name: "N", trigger: { capture: { A: "a..b" } }, action: { type: "notify" } }] })], "beeTypes[0].capabilities[0].trigger.capture.A", "invalidCapturePath", "键路径非法拒绝");
codeOf([bee("a", "A", { capabilities: [{ id: "c1", name: "N", trigger: { filePredicate: "/abs/path" }, action: { type: "notify" } }] })], "beeTypes[0].capabilities[0].trigger.filePredicate", "invalidPredicate", "绝对路径谓词拒绝");
codeOf([bee("a", "A", { capabilities: [{ id: "c1", name: "N", trigger: { filePredicate: "../escape" }, action: { type: "notify" } }] })], "beeTypes[0].capabilities[0].trigger.filePredicate", "invalidPredicate", "上跳段谓词拒绝");

/* 合法spawn 链路与 once 语义通过 */
ok(
  validateBeeTypesDraft([
    bee("idea", "创意蜂", { capabilities: [{ id: "handoff", name: "交接", trigger: { capture: { A: "proposal" }, filePredicate: "openspec/changes/{A}/tasks.md" }, action: { type: "spawn", promptTemplate: "请用 /opsx:new 创建提案 {A}", targetBeeTypeId: "design" }, once: true }] }),
    bee("design", "设计蜂", { queuePolicy: "serialized", capabilities: [{ id: "review", name: "审阅", trigger: { capture: {} }, action: { type: "notify" }, once: false }] })
  ]) === null,
  "合法创意蜂→设计蜂链路通过"
);

/* ── 删除级联：spec「删除蜂种自动回落」+ 无孤儿引用 ── */

const before = normalizeBeeTypes([
  bee("idea", "创意蜂", { capabilities: [{ id: "h", name: "交接", trigger: {}, action: { type: "spawn", promptTemplate: "x", targetBeeTypeId: "design" } }] }),
  bee("design", "设计蜂", { capabilities: [{ id: "r", name: "审阅", trigger: {}, action: { type: "send", promptTemplate: "y" } }] })
]);
const assignments = { "s-1": "design", "s-2": "design", "s-3": "design", "s-4": "idea" };
const cascaded = cascadeDeleteBeeType(before, assignments, "design");
eq(cascaded.beeTypes.map((t) => t.id), ["idea"], "蜂种移除");
eq(cascaded.beeTypes[0].capabilities.length, 0, "spawn 目标指向被删蜂种的能力级联移除（无孤儿引用）");
eq(cascaded.assignments, { "s-4": "idea" }, "3 条绑定级联清除，其余保留");
eq(cascaded.droppedSessions.sort(), ["s-1", "s-2", "s-3"], "回落会话清单（调用方清引擎状态）");
eq(boundBeeTypeOf("s-1", cascaded.beeTypes, cascaded.assignments), null, "被删蜂种的蜜蜂回到默认蜂");
eq(boundBeeTypeOf("s-4", cascaded.beeTypes, cascaded.assignments).id, "idea", "未受影响绑定不动");

console.log("ALL BEE-TYPES SMOKE TESTS PASSED");
