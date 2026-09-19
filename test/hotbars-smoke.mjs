/**
 * 道具栏纯逻辑模块冒烟测试（context-hotbar-rework 2.4，承接
 * quick-commands-client-smoke 的 appendPrompt/workerBeeIdOf 断言）：
 *  - normalizeHotbars：三栏形状 / 按栏字段矩阵裁剪 / 联动裁剪 / 容量裁剪 /
 *    重名去重 / 旧坏数据按空处理；
 *  - validateSlotDraft：名称非空唯一 / 蜂栏提示词必填 / 召唤·建蜂关闭提示词
 *    不接受 / 上限 32 / 容量超出提示键（保存允许）；
 *  - resolveHotbarKind：三态互斥门控矩阵（studio/tile/cup/空 × selectedBee ×
 *    浮窗态）；
 *  - hotbar-default-actions：DEFAULT_HOTBAR_SLOTS 骨架形状（巢栏空骨架、
 *    蜂栏继续 + 归档/打开动作卡、地板栏建巢；id 稳定唯一、builtin 标记、
 *    提示词卡经 normalizeSlot 按栏往返合法、动作卡非槽位形状、builtin/action
 *    无伪造通道）+ effectiveHotbarSlots 栏级回退矩阵（空 → 整组默认、
 *    非空 → 用户组原样、三栏互不影响、t 注入文案解析、非数组容错、
 *    未知 kind 安全空）；
 *  - appendPrompt 拼接语义 + workerBeeIdOf 门控矩阵（工蜂/无人机/orphan 无人机/
 *    野蜂/非蜂选中/清选中/未渲染会话）。
 * 运行：node test/hotbars-smoke.mjs
 */
import {
  DEFAULT_HOTBAR_SLOTS,
  HOTBAR_COLUMN_LIMIT,
  HOTBAR_RESIDENT_KINDS,
  appendPrompt,
  effectiveHotbarSlots,
  emptyHotbars,
  normalizeHotbars,
  normalizeSlot,
  resolveHotbarKind,
  validateSlotDraft,
  workerBeeIdOf
} from "../src/hotbars.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── normalizeHotbars（2.1 镜像归一化） ── */
eq(normalizeHotbars(undefined), emptyHotbars(), "undefined → 三栏空（旧文档兼容）");
eq(normalizeHotbars("bad"), emptyHotbars(), "非对象 → 三栏空");
eq(normalizeHotbars({ hive: "bad", bee: 3, floor: [null] }), emptyHotbars(), "非数组栏 → 空栏");

const norm = normalizeHotbars({
  hive: [
    { id: "h1", name: " 巢召唤 ", summon: true, beeTypeId: "bt-design", prompt: "开工", autoSend: true },
    { id: "h2", name: "巢禁用", summon: false, prompt: "应被联动裁剪", beeTypeId: "bt-x" },
    { id: "h3", name: "巢禁用" },
    { id: "", name: "x", summon: true }, // 空 id → 滤
    { id: "h4", name: "   ", summon: true }, // 空 name → 滤
    { id: "h1", name: "巢召唤", summon: true }, // 重复 id → 滤
    { id: "h5", name: " 巢召唤", summon: true }, // trim 重名 → 滤
    { id: "h6", name: "带建蜂字段", summon: true, createBee: true } // 巢栏无 createBee → 裁剪
  ],
  bee: [
    { id: "b1", name: "蜂指令", prompt: "跑测试", autoSend: 1 }, // 非布尔 autoSend → false
    { id: "b2", name: "空白提示词", prompt: "  " }, // 蜂栏提示词必填 → 滤
    { id: "b3", name: "带召唤字段", prompt: "x", summon: true, createBee: true }, // 蜂栏字段矩阵裁剪
    { id: "b4", name: "无提示词" } // 蜂栏提示词缺失 → 滤
  ],
  floor: [
    { id: "f1", name: "建巢建蜂", createBee: true, beeTypeId: "", prompt: "  ", autoSend: true }, // 空白 prompt/空蜂种 → 字段不落
    { id: "f2", name: "纯建巢", createBee: false, prompt: "应被联动裁剪" },
    { id: "f3", name: "缺 createBee", prompt: "可选可留" } // createBee 缺省 false → prompt 联动裁剪
  ]
});
eq(norm.hive.length, 3, "巢栏：结构非法/重名条目全部滤除（h3 与 h2 重名 → 滤）");
eq(norm.hive[0], { id: "h1", name: "巢召唤", autoSend: true, summon: true, beeTypeId: "bt-design", prompt: "开工" }, "巢栏召唤条目归一化（name trim / 字段保留）");
eq(norm.hive[1], { id: "h2", name: "巢禁用", autoSend: false, summon: false }, "巢栏召唤关闭 → prompt/beeTypeId 联动裁剪");
eq(norm.hive[2], { id: "h6", name: "带建蜂字段", autoSend: false, summon: true }, "巢栏无 createBee → 按栏裁剪丢弃");
eq(norm.bee.length, 2, "蜂栏：提示词缺失/空白条目滤除（b3 保留、字段矩阵裁剪）");
eq(norm.bee[0], { id: "b1", name: "蜂指令", autoSend: false, prompt: "跑测试" }, "蜂栏条目归一化（召唤/建蜂字段不落）");
eq(norm.bee[1], { id: "b3", name: "带召唤字段", autoSend: false, prompt: "x" }, "蜂栏 summon/createBee 字段不落");
eq(norm.floor.length, 3, "地板栏：三条保留");
eq(norm.floor[0], { id: "f1", name: "建巢建蜂", autoSend: true, createBee: true }, "地板栏建蜂开启（空 prompt/蜂种不落）");
eq(norm.floor[1], { id: "f2", name: "纯建巢", autoSend: false, createBee: false }, "地板栏建蜂关闭 → prompt 联动裁剪");
eq(norm.floor[2], { id: "f3", name: "缺 createBee", autoSend: false, createBee: false }, "createBee 缺省 false");

/* 容量裁剪：超出 32 的槽位丢弃 */
const flood = normalizeHotbars({
  hive: Array.from({ length: 40 }, (_, i) => ({ id: "id" + i, name: "n" + i, summon: true }))
});
eq(flood.hive.length, HOTBAR_COLUMN_LIMIT, "每栏上限 32：40 条 → 裁剪为 32");

/* ── validateSlotDraft（2.2 草稿校验） ── */
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p" }], "bee").error, null, "蜂栏合法草稿 → null");
eq(validateSlotDraft([], "hive").error, null, "空列表（全删光）合法");
eq(validateSlotDraft([{ id: "a", name: "  ", prompt: "p" }], "bee").error?.code, "hive.hb.err.invalidName", "空名称 → invalidName");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p" }, { id: "b", name: " x ", prompt: "q" }], "bee").error?.code, "hive.hb.err.duplicateName", "trim 重名 → duplicateName");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: " \n " }], "bee").error, { index: 0, field: "prompt", code: "hive.hb.err.missingPrompt" }, "蜂栏空白提示词 → missingPrompt（必填）");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p" }], "hive").error, { index: 0, field: "prompt", code: "hive.hb.err.promptBlocked" }, "巢栏召唤关闭 + 提示词非空 → promptBlocked（字段联动）");
eq(validateSlotDraft([{ id: "a", name: "x", summon: true, prompt: "p" }], "hive").error, null, "巢栏召唤开启 → 提示词可选（纯召唤合法）");
eq(validateSlotDraft([{ id: "a", name: "x", createBee: false, prompt: "p" }], "floor").error?.code, "hive.hb.err.promptBlocked", "地板栏建蜂关闭 + 提示词非空 → promptBlocked");
eq(validateSlotDraft([{ id: "a", name: "x", createBee: true, prompt: "" }], "floor").error, null, "地板栏建蜂开启 + 空白提示词 → 合法（纯建蜂）");
eq(validateSlotDraft(Array.from({ length: 33 }, (_, i) => ({ id: "i" + i, name: "n" + i, summon: true })), "hive").error?.code, "hive.hb.err.tooManySlots", "栏内超 32 → tooManySlots");

/* 容量超出 → 保存允许（error null）但提示键返回 overflow 数 */
const over = validateSlotDraft(
  Array.from({ length: 10 }, (_, i) => ({ id: "i" + i, name: "n" + i, summon: true })),
  "hive",
  { capacity: 8 }
);
eq(over.error, null, "容量超出 → 保存允许");
eq(over.overflow, 2, "overflow = 超出阵列容量的槽位数");
eq(validateSlotDraft([{ id: "a", name: "x" }], "hive", { capacity: 8 }).overflow, 0, "未超 → overflow 0");

/* ── resolveHotbarKind（2.3 三态门控矩阵） ── */
const gate = (selection, selectedBee, floatOpen) => resolveHotbarKind({ selection, selectedBee, floatOpen });
eq(gate({ kind: "studio", id: "ws-1" }, null, false), "hive", "巢选中 → 巢栏");
eq(gate({ kind: "tile", id: "4,-2" }, null, false), "floor", "地板选中 → 地板栏");
eq(gate({ kind: "tile", id: "4,-2" }, "bee-1", false), "floor", "地板选中优先于蜂栏（studio > tile > 蜂栏）");
eq(gate({ kind: "cup", id: "cup-1" }, "bee-1", false), null, "蜜杯选中 → 不渲染");
eq(gate(null, "bee-1", false), "bee", "无显式选中 + 当前会话蜂 → 蜂栏");
eq(gate(null, null, false), null, "清选中且无当前会话蜂 → 不渲染");
eq(gate(null, undefined, false), null, "selectedBee undefined → 不渲染");
eq(gate({ kind: "studio", id: "ws-1" }, "bee-1", true), null, "浮窗开启（遮罩暂停态）→ 不渲染");
eq(gate(null, "bee-1", true), null, "浮窗开启压制蜂栏");
eq(resolveHotbarKind(), null, "无参 → 不渲染");

/* ── DEFAULT_HOTBAR_SLOTS 骨架形状（hotbar-default-actions 5.1；卡组用户定稿调整） ── */
/* 巢栏：无默认卡（召唤由用户自定义槽位覆盖，空巢栏不渲染） */
eq(DEFAULT_HOTBAR_SLOTS.hive, [], "巢栏空骨架——空栏派生空数组 → 道具栏不渲染");
/* 地板栏：仅建巢（纯建巢，无「建巢并召唤蜂」） */
eq(DEFAULT_HOTBAR_SLOTS.floor.map((s) => [s.id, s.createBee, s.promptKey]), [["default-hb-nest", false, undefined]], "地板栏：仅「建巢」（纯建巢）");
/* 蜂栏：继续（直发提示词卡）+ 归档会话/打开会话（非提示词动作卡） */
const skeletonIds = [];
for (const entry of DEFAULT_HOTBAR_SLOTS.bee) {
  ok(typeof entry.id === "string" && entry.id.startsWith("default-hb-"), `蜂栏默认卡携带稳定 id 前缀（${entry.id}）`);
  skeletonIds.push(entry.id);
  ok(entry.builtin === true, `${entry.id} 携带 builtin: true 标记`);
  ok(typeof entry.nameKey === "string" && entry.nameKey.startsWith("hive.bar.defaults."), `${entry.id} nameKey 收口 hive.bar.defaults.* 命名空间`);
  ok(entry.autoSend === true || entry.autoSend === false, `${entry.id} autoSend 为显式布尔`);
}
eq(new Set(skeletonIds).size, skeletonIds.length, "蜂栏骨架 id 稳定唯一");
eq(Object.keys(DEFAULT_HOTBAR_SLOTS).sort(), ["bee", "floor", "hive"], "骨架按三栏组织");
eq(DEFAULT_HOTBAR_SLOTS.bee.map((s) => [s.id, s.autoSend, s.promptKey ?? null, s.action ?? null]), [
  ["default-hb-continue", true, "hive.bar.defaults.beeContinuePrompt", null],
  ["default-hb-archive", false, null, "archive"],
  ["default-hb-open", false, null, "open"]
], "蜂栏：「继续」（直发）+「归档会话」「打开会话」（action 判别动作卡，无提示词）");
/* 提示词默认卡经 normalizeSlot 往返合法；动作卡非提示词槽位形状（normalizeSlot 滤除，
   动作语义仅存在于默认派生对象——编辑器/持久化天然绝缘） */
const identityT = (key) => key;
for (const card of effectiveHotbarSlots("bee", [], identityT)) {
  const rebuilt = normalizeSlot("bee", card);
  if (card.action) {
    ok(rebuilt === null, `${card.id} 动作卡非提示词槽位形状（normalizeSlot 滤除）`);
  } else {
    ok(rebuilt !== null, `${card.id} 经 normalizeSlot 蜂栏往返合法（结构合法不被滤除）`);
    eq(rebuilt.id, card.id, `${card.id} 往返保留 id`);
    eq(rebuilt.autoSend, card.autoSend, `${card.id} 往返保留 autoSend`);
    ok(rebuilt.builtin === undefined, `${card.id} normalizeSlot 重建剥离 builtin（未知字段不落）`);
  }
}
const rebuiltFloor = normalizeSlot("floor", effectiveHotbarSlots("floor", [], identityT)[0]);
ok(rebuiltFloor !== null, "地板默认卡经 normalizeSlot 往返合法");
eq(rebuiltFloor, { id: "default-hb-nest", name: "hive.bar.defaults.floorNest", autoSend: false, createBee: false }, "地板默认卡往返保留纯建巢形状");
/* builtin/action 无伪造通道（design D3）：用户配置混入标记 → 归一化剥离 */
eq(normalizeSlot("bee", { id: "u1", name: "伪装卡", prompt: "p", builtin: true }).builtin, undefined, "用户槽位混入 builtin: true → normalizeSlot 剥离（无伪造通道）");
eq(normalizeSlot("bee", { id: "u2", name: "动作伪装", prompt: "p", action: "archive" }).action, undefined, "用户槽位混入 action → normalizeSlot 剥离（动作卡无伪造通道）");

/* ── effectiveHotbarSlots 派生矩阵（hotbar-default-actions 5.1；蜂栏常驻为用户定稿修订） ── */
/* 常驻栏（蜂栏）：内置卡排在用户槽位之后恒呈现，不随自定义收回 */
eq(effectiveHotbarSlots("bee", [], identityT), [
  { id: "default-hb-continue", name: "hive.bar.defaults.beeContinue", autoSend: true, builtin: true, prompt: "hive.bar.defaults.beeContinuePrompt" },
  { id: "default-hb-archive", name: "hive.bar.defaults.beeArchive", autoSend: false, builtin: true, action: "archive" },
  { id: "default-hb-open", name: "hive.bar.defaults.beeOpen", autoSend: false, builtin: true, action: "open" }
], "蜂栏空 → 整组内置卡（继续 + 归档 + 打开）");
const userBee = [{ id: "b9", name: "用户卡", prompt: "p", autoSend: false }];
eq(effectiveHotbarSlots("bee", userBee, identityT).map((s) => s.id),
  ["b9", "default-hb-continue", "default-hb-archive", "default-hb-open"],
  "蜂栏用户槽位 → 用户卡在前、内置卡恒追加（常驻，不收回）");
ok(effectiveHotbarSlots("bee", userBee, identityT)[0] === userBee[0], "常驻栏用户槽位原序原样保留（同引用成员）");
/* 回退栏（巢栏/地板栏）：非空用户槽位原样返回（内置卡整栏收回） */
eq(effectiveHotbarSlots("hive", [], identityT), [], "空数组 → 巢栏派生空（无默认卡）");
eq(effectiveHotbarSlots("hive", userBee, identityT), userBee, "巢栏非空用户槽位 → 原样返回（同引用）");
eq(effectiveHotbarSlots("floor", [], identityT), [
  { id: "default-hb-nest", name: "hive.bar.defaults.floorNest", autoSend: false, builtin: true, createBee: false }
], "空数组 → 地板栏整组默认卡（纯建巢）");
const userFloor = [{ id: "f9", name: "地板卡", createBee: false, autoSend: false }];
eq(effectiveHotbarSlots("floor", userFloor, identityT), userFloor, "地板栏非空用户槽位 → 原样返回（同引用，默认卡收回）");
/* 三栏互不影响：仅蜂栏有用户槽位 → 巢/地板照常按各自骨架派生 */
eq(effectiveHotbarSlots("hive", [], identityT), [], "蜂栏有用户槽位，巢栏照常派生空（三栏互不影响）");
eq(effectiveHotbarSlots("floor", [], identityT).map((s) => s.id), ["default-hb-nest"], "蜂栏有用户槽位，地板栏回退不受影响");
ok(HOTBAR_RESIDENT_KINDS.includes("bee") && !HOTBAR_RESIDENT_KINDS.includes("floor") && !HOTBAR_RESIDENT_KINDS.includes("hive"), "常驻分型：仅蜂栏常驻，巢/地板回退");
/* t 注入文案解析（design D2：i18n 无关骨架 + 注入翻译） */
const zhDict = {
  "hive.bar.defaults.beeContinue": "继续",
  "hive.bar.defaults.beeContinuePrompt": "继续",
  "hive.bar.defaults.beeArchive": "归档会话",
  "hive.bar.defaults.beeOpen": "打开会话",
  "hive.bar.defaults.floorNest": "建巢"
};
const zhT = (key) => zhDict[key];
const zhBee = effectiveHotbarSlots("bee", [], zhT);
eq(zhBee.map((s) => [s.name, s.prompt ?? null, s.action ?? null]), [
  ["继续", "继续", null],
  ["归档会话", null, "archive"],
  ["打开会话", null, "open"]
], "t 注入 → 名称/提示词解析为本地化文案（动作卡无提示词、action 透传）");
eq(effectiveHotbarSlots("floor", [], zhT).map((s) => s.name), ["建巢"], "地板默认卡名称本地化解析");
ok(zhBee.every((s) => s.builtin === true), "本地化派生保留 builtin 标记");
/* 非数组 userSlots 按空处理（旧文档/坏形状兼容）：常驻栏 = 纯内置卡，回退栏 = 默认卡 */
eq(effectiveHotbarSlots("bee", null, identityT).map((s) => s.id), ["default-hb-continue", "default-hb-archive", "default-hb-open"], "userSlots null（常驻栏）→ 纯内置卡");
eq(effectiveHotbarSlots("bee", "bad", identityT).map((s) => s.id), ["default-hb-continue", "default-hb-archive", "default-hb-open"], "userSlots 非数组（常驻栏）→ 纯内置卡");
eq(effectiveHotbarSlots("floor", null, identityT).map((s) => s.id), ["default-hb-nest"], "userSlots null（回退栏）→ 按空回退");
eq(effectiveHotbarSlots("floor", undefined, identityT).map((s) => s.id), ["default-hb-nest"], "userSlots undefined（回退栏）→ 按空回退");
eq(effectiveHotbarSlots("floor", "bad", identityT).map((s) => s.id), ["default-hb-nest"], "userSlots 非数组字符串（回退栏）→ 按空回退");
eq(effectiveHotbarSlots("floor", 42, identityT).map((s) => s.id), ["default-hb-nest"], "userSlots 数值（回退栏）→ 按空回退");
/* 未知 kind → 空数组（组件不渲染路径）；t 未注入 → 键原样返回（不炸） */
eq(effectiveHotbarSlots("nope", [], identityT), [], "未知 kind → 空数组");
eq(effectiveHotbarSlots("bee", [], undefined)[0].name, "hive.bar.defaults.beeContinue", "t 缺省 → 键原样返回（模块零依赖纪律）");

/* ── appendPrompt（spec「未勾选自动发送——填入」验收口径，skill-links 同款） ── */
eq(appendPrompt("", "run tests"), "run tests", "空草稿直接填入");
eq(appendPrompt("已有草稿", "run tests"), "已有草稿\nrun tests", "非空草稿换行拼接");
eq(appendPrompt(undefined, "x"), "x", "非字符串草稿 → 视为空");
eq(appendPrompt("d", 42), "d\n42", "非字符串 prompt → 字符串化");
const once = appendPrompt("", "a");
eq(appendPrompt(once, "b"), "a\nb", "两次追加 → 换行分隔");

/* ── workerBeeIdOf 门控矩阵（蜂栏/覆盖面板门控复用） ── */
const world = {
  studios: [
    {
      workspaceId: "ws-1",
      bees: [
        { sessionId: "bee-1", displayTitle: "工蜂一" },
        { sessionId: "orphan-drone", displayTitle: "孤儿无人机" } // bee-model orphan 降级混入
      ]
    }
  ],
  wildBees: [{ sessionId: "wild-1", displayTitle: "野蜂" }]
};
const sessionsOf = (over = {}) => ({ byId: { "bee-1": { origin: "user" }, "orphan-drone": { origin: "subagent" }, "wild-1": { origin: "user" }, "drone-1": { origin: "subagent" } }, ...over });

eq(workerBeeIdOf(world, "bee-1", null, sessionsOf()), "bee-1", "工蜂选中 → 卡片区显示");
eq(workerBeeIdOf(world, "wild-1", null, sessionsOf()), "wild-1", "野蜂（未分组主会话）→ 显示");
eq(workerBeeIdOf(world, "drone-1", null, sessionsOf()), null, "无人机（巢蜂 drones 挂载）→ 不显示");
eq(workerBeeIdOf(world, "orphan-drone", null, sessionsOf()), null, "orphan 无人机（降级混入巢内）→ 不显示");
eq(workerBeeIdOf(world, "bee-1", { kind: "tile", id: "4,-2" }, sessionsOf()), null, "非蜂显式选中 → 收起");
eq(workerBeeIdOf(world, "bee-1", null, sessionsOf({ byId: {} })), "bee-1", "镜像缺 byId → 仍按渲染世界判定");
eq(workerBeeIdOf(world, "ghost", null, sessionsOf()), null, "未渲染会话 → 不显示");
eq(workerBeeIdOf(world, null, null, sessionsOf()), null, "清选中（无 current）→ 不显示");
eq(workerBeeIdOf(null, "bee-1", null, sessionsOf()), null, "世界未就绪 → 不显示");

console.log("ALL HOTBARS MODULE SMOKE TESTS PASSED");
