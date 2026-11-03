/**
 * 道具栏纯逻辑模块冒烟测试（context-hotbar-rework 2.4，承接
 * quick-commands-client-smoke 的 appendPrompt/workerBeeIdOf 断言）：
 *  - normalizeHotbars：四栏形状 / 按栏字段矩阵裁剪 / 联动裁剪 / 容量裁剪 /
 *    重名去重 / 旧坏数据按空处理 / 槽位 `model` 透传（四栏全开、与
 *    prompt/beeTypeId 同门控、形状非法仅剥离字段不丢槽位）/
 *    **`setStatus` 形状放宽（非空字符串，不再枚举封闭）与 `citeName` 透传不物化**
 *    （proposal-panel-config 1.3）/ **蜂栏 `newSession` 缺省不物化 + `beeTypeId`
 *    读取裁剪、提案栏 `summon` 键剥离**（new-session-hotbar 1.1/1.2）；
 *  - validateSlotDraft：名称非空唯一 / 蜂栏与提案栏提示词必填 / 召唤·建蜂关闭提示词
 *    不接受 / `model` 形状字段级拒绝（hive.hb.err.invalidModel，R6）/
 *    上限 32 / 容量超出提示键（保存允许）/ 蜂栏 `newSession`·`beeTypeId` 与提案栏
 *    蜂种无拒绝规则（new-session-hotbar 1.4）；
 *  - resolveHotbarKind：**四态**互斥门控矩阵（studio/tile/cup/空 × selectedBee ×
 *    浮窗态 × 提案选中）；
 *  - hotbar-default-actions：DEFAULT_HOTBAR_SLOTS 骨架形状（巢栏空骨架、
 *    蜂栏继续 + 归档/打开动作卡、地板栏建巢、提案栏无默认卡；id 稳定唯一、builtin
 *    标记、提示词卡经 normalizeSlot 按栏往返合法、动作卡非槽位形状、builtin/action
 *    无伪造通道）+ effectiveHotbarSlots 栏级回退矩阵（空 → 整组默认、
 *    非空 → 用户组原样、四栏互不影响、t 注入文案解析、非数组容错、
 *    未知 kind 安全空）；
 *  - appendPrompt 拼接语义 + workerBeeIdOf 门控矩阵（工蜂/无人机/orphan 无人机/
 *    野蜂 → null（工蜂 = 巢内蜂，new-session-hotbar 1.3）/非蜂选中/清选中/未渲染会话）。
 * 运行：node test/hotbars-smoke.mjs
 */
import {
  DEFAULT_HOTBAR_SLOTS,
  HOTBAR_COLUMN_LIMIT,
  HOTBAR_KINDS,
  HOTBAR_RESIDENT_KINDS,
  appendPrompt,
  effectiveHotbarSlots,
  emptyHotbars,
  isValidSlotStatus,
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
eq(normalizeHotbars(undefined), emptyHotbars(), "undefined → 四栏空（旧文档兼容）");
eq(normalizeHotbars("bad"), emptyHotbars(), "非对象 → 四栏空");
eq(normalizeHotbars({ hive: "bad", bee: 3, floor: [null], proposal: "bad" }), emptyHotbars(), "非数组栏 → 空栏");

const norm = normalizeHotbars({
  hive: [
    { id: "h1", name: " 巢召唤 ", summon: true, beeTypeId: "bt-design", model: { provider: " p ", model: " m ", reasoningEffort: " high " }, prompt: "开工", autoSend: true },
    { id: "h2", name: "巢禁用", summon: false, prompt: "应被联动裁剪", beeTypeId: "bt-x", model: { provider: "p", model: "m" } },
    { id: "h3", name: "巢禁用" },
    { id: "", name: "x", summon: true }, // 空 id → 滤
    { id: "h4", name: "   ", summon: true }, // 空 name → 滤
    { id: "h1", name: "巢召唤", summon: true }, // 重复 id → 滤
    { id: "h5", name: " 巢召唤", summon: true }, // trim 重名 → 滤
    { id: "h6", name: "带建蜂字段", summon: true, createBee: true }, // 巢栏无 createBee → 裁剪
    { id: "h7", name: "坏模型", summon: true, model: { provider: "", model: "m" } }, // 形状非法 → 独立剥离字段（不丢槽位）
    { id: "h8", name: "非对象模型", summon: true, model: "p/m" } // 形状非法 → 独立剥离字段
  ],
  bee: [
    { id: "b1", name: "蜂指令", prompt: "跑测试", model: { provider: "p", model: "m" }, autoSend: 1 }, // 非布尔 autoSend → false
    { id: "b2", name: "空白提示词", prompt: "  " }, // 蜂栏提示词必填 → 滤
    { id: "b3", name: "带召唤字段", prompt: "x", summon: true, createBee: true }, // 蜂栏字段矩阵裁剪
    { id: "b4", name: "无提示词" }, // 蜂栏提示词缺失 → 滤
    { id: "b5", name: "档位坏", prompt: "y", model: { provider: "p", model: "m", reasoningEffort: 5 } }, // 档位非字符串 → 剥离
    /* new-session-hotbar 1.1/D1/D3：newSession 仅 true 落字段；beeTypeId 随 newSession 裁剪 */
    { id: "b6", name: "开新会话", prompt: "新会话", newSession: true, beeTypeId: "bt-review", autoSend: true }, // 两键落库
    { id: "b7", name: "未勾带蜂种", prompt: "p", newSession: false, beeTypeId: "bt-review" }, // 未勾 → newSession/beeTypeId 均不落
    { id: "b8", name: "缺勾带蜂种", prompt: "p", beeTypeId: "bt-review" }, // 缺省 = 未勾 → 蜂种裁剪
    { id: "b9", name: "坏 newSession", prompt: "p", newSession: "yes", beeTypeId: "bt-review" }, // 非 true → 不落字段
    { id: "b10", name: "空蜂种", prompt: "p", newSession: true, beeTypeId: "" } // 空蜂种 → 仅落 newSession
  ],
  floor: [
    { id: "f1", name: "建巢建蜂", createBee: true, beeTypeId: "", model: { provider: "p", model: "m" }, prompt: "  ", autoSend: true }, // 空白 prompt/空蜂种 → 字段不落（模型保留）
    { id: "f2", name: "纯建巢", createBee: false, prompt: "应被联动裁剪", model: { provider: "p", model: "m" } }, // 建蜂关闭 → prompt 与模型同门控裁剪
    { id: "f3", name: "缺 createBee", prompt: "可选可留" } // createBee 缺省 false → prompt 联动裁剪
  ],
  /* 提案栏（add-proposal-panel 3.1；proposal-panel-config 1.3/1.4；new-session-hotbar
     1.2/D6）：提示词必填、summon 恒剥离（存量键不物化）、蜂种/模型恒适用、
     setStatus **形状校验**（非空字符串，枚举不封闭）、citeName 透传 */
  proposal: [
    { id: "p1", name: " 继续推进 ", summon: true, beeTypeId: "bt-review", model: { provider: " p ", model: " m " }, prompt: "推进 {change}", autoSend: true, setStatus: "reviewed" },
    { id: "p2", name: "存量直发卡", summon: false, beeTypeId: "bt-review", model: { provider: "p", model: "m" }, prompt: "看 {change}", autoSend: false, setStatus: "custom-x" }, // summon 剥离；蜂种/模型恒适用（不再联动裁剪）
    { id: "p3", name: "缺提示词", summon: true }, // 提案栏提示词必填 → 滤
    { id: "p4", name: "空白提示词", summon: false, prompt: "   " }, // 空白 → 滤
    { id: "p5", name: "无 setStatus", prompt: "p" }, // setStatus 缺省 → 无该字段；summon 缺省亦不物化
    { id: "p6", name: "setStatus 非字符串", prompt: "p", setStatus: 7 }, // 形状非法 → 剥离
    { id: "p7", name: "带建蜂字段", prompt: "p", createBee: true }, // 提案栏无 createBee → 裁剪
    { id: "p8", name: "不引用", prompt: "p", citeName: false }, // citeName 显式关 → 透传落字段
    { id: "p9", name: "引用缺省", prompt: "p", citeName: true }, // citeName 显式开 → 透传落字段
    { id: "p10", name: "坏 citeName", prompt: "p", citeName: "yes" }, // 非 boolean → 剥离字段（缺省 = 勾选）
    { id: "p11", name: "空白 setStatus", prompt: "p", setStatus: "   " } // 全空白 → 形状非法，剥离
  ]
});
eq(norm.hive.length, 5, "巢栏：结构非法/重名条目全部滤除；模型形状非法仅剥离字段不丢槽位");
eq(norm.hive[0], { id: "h1", name: "巢召唤", autoSend: true, summon: true, beeTypeId: "bt-design", model: { provider: "p", model: "m", reasoningEffort: "high" }, prompt: "开工" }, "巢栏召唤条目归一化（name/model trim / 字段保留）");
eq(norm.hive[1], { id: "h2", name: "巢禁用", autoSend: false, summon: false }, "巢栏召唤关闭 → prompt/beeTypeId/model 同门控联动裁剪（R14g）");
eq(norm.hive[2], { id: "h6", name: "带建蜂字段", autoSend: false, summon: true }, "巢栏无 createBee → 按栏裁剪丢弃");
eq(norm.hive[3], { id: "h7", name: "坏模型", autoSend: false, summon: true }, "provider 空 → 独立剥离 model 字段（槽位保留）");
eq(norm.hive[4], { id: "h8", name: "非对象模型", autoSend: false, summon: true }, "model 非对象 → 独立剥离字段（槽位保留）");
eq(norm.bee.length, 8, "蜂栏：提示词缺失/空白条目滤除；newSession 缺省不物化、beeTypeId 随 newSession 裁剪");
eq(norm.bee[0], { id: "b1", name: "蜂指令", autoSend: false, model: { provider: "p", model: "m" }, prompt: "跑测试" }, "蜂栏条目归一化（召唤/建蜂字段不落；模型四栏全开）");
eq(norm.bee[1], { id: "b3", name: "带召唤字段", autoSend: false, prompt: "x" }, "蜂栏 summon/createBee 字段不落（newSession 缺省亦不产键）");
eq(norm.bee[2], { id: "b5", name: "档位坏", autoSend: false, prompt: "y" }, "reasoningEffort 非字符串 → 剥离 model 字段");
eq(norm.bee[3], { id: "b6", name: "开新会话", autoSend: true, newSession: true, beeTypeId: "bt-review", prompt: "新会话" }, "newSession=true → 落标记 + 蜂种；模型未绑定不产键");
eq(norm.bee[4], { id: "b7", name: "未勾带蜂种", autoSend: false, prompt: "p" }, "newSession=false → 标记与蜂种均不落（读取路径联动裁剪）");
eq(norm.bee[5], { id: "b8", name: "缺勾带蜂种", autoSend: false, prompt: "p" }, "newSession 缺省 = 未勾 → 蜂种裁剪");
eq(norm.bee[6], { id: "b9", name: "坏 newSession", autoSend: false, prompt: "p" }, "newSession 非 true → 不落字段（形状宽松读）");
eq(norm.bee[7], { id: "b10", name: "空蜂种", autoSend: false, newSession: true, prompt: "p" }, "newSession=true + 空蜂种 → 仅落标记（缺省 = 默认蜂）");
eq(norm.floor.length, 3, "地板栏：三条保留");
eq(norm.floor[0], { id: "f1", name: "建巢建蜂", autoSend: true, createBee: true, model: { provider: "p", model: "m" } }, "地板栏建蜂开启（空 prompt/蜂种不落；模型保留）");
eq(norm.floor[1], { id: "f2", name: "纯建巢", autoSend: false, createBee: false }, "地板栏建蜂关闭 → prompt/model 同门控裁剪");
eq(norm.floor[2], { id: "f3", name: "缺 createBee", autoSend: false, createBee: false }, "createBee 缺省 false");

/* 提案栏（3.1 + proposal-panel-config 1.3 + new-session-hotbar 1.2）：
   提示词必填 + summon 剥离 + 蜂种/模型恒适用 + setStatus 形状校验 + citeName */
eq(norm.proposal.length, 9, "提案栏：缺/空白提示词滤除，其余保留（坏 setStatus/citeName 仅剥离字段）");
eq(norm.proposal[0], { id: "p1", name: "继续推进", autoSend: true, prompt: "推进 {change}", beeTypeId: "bt-review", model: { provider: "p", model: "m" }, setStatus: "reviewed" }, "提案栏条目归一化（name trim / 提示词原文保留 / 模型 trim；summon 不物化）");
eq(norm.proposal[1], { id: "p2", name: "存量直发卡", autoSend: false, prompt: "看 {change}", beeTypeId: "bt-review", model: { provider: "p", model: "m" }, setStatus: "custom-x" }, "存量 summon=false → 键剥离且**蜂种/模型恒适用**（不丢槽位、不联动裁剪）；列表外 setStatus 原样保留（D4）");
eq(norm.proposal[2], { id: "p5", name: "无 setStatus", autoSend: false, prompt: "p" }, "setStatus 缺省 → 字段缺席（本卡不改状态）；summon 缺省不产键");
eq(norm.proposal[3], { id: "p6", name: "setStatus 非字符串", autoSend: false, prompt: "p" }, "setStatus 非字符串 → 独立剥离字段（槽位保留）");
eq(norm.proposal[4], { id: "p7", name: "带建蜂字段", autoSend: false, prompt: "p" }, "提案栏无 createBee → 按栏裁剪丢弃");
eq(norm.proposal[5], { id: "p8", name: "不引用", autoSend: false, prompt: "p", citeName: false }, "citeName 显式 false → 透传落字段（消费点据此不前置引用）");
eq(norm.proposal[6], { id: "p9", name: "引用缺省", autoSend: false, prompt: "p", citeName: true }, "citeName 显式 true → 透传落字段");
eq(norm.proposal[7], { id: "p10", name: "坏 citeName", autoSend: false, prompt: "p" }, "citeName 非 boolean → 剥离字段（缺字段 = 缺省勾选，消费点 `!== false` 判定）");
eq(norm.proposal[8], { id: "p11", name: "空白 setStatus", autoSend: false, prompt: "p" }, "setStatus 全空白 → 形状非法，剥离字段");
/* summon 退役：存量键一律剥离（不物化），恒召唤语义由执行链路承担（1.2/D6） */
ok(!("summon" in norm.proposal[0]) && !("summon" in norm.proposal[1]), "提案栏 summon 键剥离（存量 true/false 均不物化）");
eq(normalizeSlot("proposal", { id: "x", name: "n", prompt: "p", summon: false }).summon, undefined, "normalizeSlot 直测：summon=false 剥离");
ok(!("summon" in normalizeSlot("proposal", { id: "x", name: "n", prompt: "p", summon: true })), "normalizeSlot 直测：summon=true 亦剥离");
/* newSession 缺省不物化 + 蜂种读取裁剪（1.1/D1/D3） */
ok(!("newSession" in normalizeSlot("bee", { id: "x", name: "n", prompt: "p" })), "normalizeSlot 直测：newSession 缺省不产键");
eq(normalizeSlot("bee", { id: "x", name: "n", prompt: "p", newSession: true, beeTypeId: "bt-1" }), { id: "x", name: "n", autoSend: false, newSession: true, beeTypeId: "bt-1", prompt: "p" }, "normalizeSlot 直测：newSession=true → 标记 + 蜂种");
ok(!("beeTypeId" in normalizeSlot("bee", { id: "x", name: "n", prompt: "p", beeTypeId: "bt-1" })), "normalizeSlot 直测：未勾 newSession → beeTypeId 读取裁剪");
/* citeName 缺省不物化：透传落盘的槽位**不含**该键（缺字段不写盘，归一化幂等） */
ok(!("citeName" in norm.proposal[0]) && !("citeName" in norm.proposal[2]), "citeName 缺省不物化（透传不落盘，归一化幂等）");
eq(normalizeSlot("proposal", { id: "x", name: "n", prompt: "p", citeName: false }).citeName, false, "normalizeSlot 直测：citeName=false 透传");
ok(!("citeName" in normalizeSlot("proposal", { id: "x", name: "n", prompt: "p" })), "normalizeSlot 直测：citeName 缺省不产键");
/* isValidSlotStatus：形状判定（非空字符串），不再对常量枚举封闭 */
ok(isValidSlotStatus("reviewed") && isValidSlotStatus("custom-x"), "isValidSlotStatus：形状校验（出厂 id 与自定义 id 同等放行）");
ok(!isValidSlotStatus("") && !isValidSlotStatus("   ") && !isValidSlotStatus(7) && !isValidSlotStatus(undefined), "isValidSlotStatus：空/空白/非字符串 → false");
ok(Object.keys(emptyHotbars()).sort().join(",") === "bee,floor,hive,proposal", "emptyHotbars 四键（patchSlot 直接索引 prev[section] 的前提）");
eq(HOTBAR_KINDS, ["hive", "bee", "floor", "proposal"], "HOTBAR_KINDS 四栏（数组序即模态 nav 序）");

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

/* model 字段级校验（add-hotbar-llm-model-and-import R6：与宿主 zod 同口径，错误码
   hive.hb.err.invalidModel 为指令卡域词条——不复用已删的蜂种域 hive.bee.err.invalidModel） */
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: { provider: "p", model: "m" } }], "bee").error, null, "合法 model（最小形状）→ 通过");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: { provider: "p", model: "m", reasoningEffort: "max" } }], "bee").error, null, "合法 model（含档位）→ 通过");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: undefined }], "bee").error, null, "未绑定 model → 通过（部署默认）");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: null }], "bee").error, null, "null 与 undefined 同义 → 通过");
eq(
  validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: { provider: "", model: "m" } }], "bee").error,
  { index: 0, field: "model", code: "hive.hb.err.invalidModel" },
  "provider 空 → invalidModel 字段级拒绝"
);
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: { provider: "p" } }], "bee").error?.code, "hive.hb.err.invalidModel", "缺 model 键 → invalidModel");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: { provider: "  ", model: "m" } }], "bee").error?.code, "hive.hb.err.invalidModel", "provider 纯空白（trim 后空）→ invalidModel");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: "p/m" }], "bee").error?.code, "hive.hb.err.invalidModel", "非对象 model → invalidModel");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: { provider: "p", model: "m", reasoningEffort: "" } }], "bee").error?.code, "hive.hb.err.invalidModel", "档位空串 → invalidModel");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: { provider: "p", model: "m", reasoningEffort: 3 } }], "bee").error?.code, "hive.hb.err.invalidModel", "档位非字符串 → invalidModel");
eq(validateSlotDraft([{ id: "a", name: "x", summon: true, prompt: "p", model: { provider: "p" } }], "hive").error?.code, "hive.hb.err.invalidModel", "巢栏同样适用（三栏全开同口径）");
eq(validateSlotDraft([{ id: "a", name: "x", createBee: true, model: { provider: "p" } }], "floor").error?.code, "hive.hb.err.invalidModel", "地板栏同样适用（四栏全开同口径）");

/* 提案栏校验口径（3.3/R15；new-session-hotbar 1.4）：prompt 必填走 missingPrompt；
   summon 已退役（不再参与任何校验）；蜂种/模型**恒适用**，SHALL NOT 成为保存拒绝理由 */
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "推进 {change}" }], "proposal").error, null, "提案栏合法草稿 → null（恒召唤，无开关）");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "  " }], "proposal").error, { index: 0, field: "prompt", code: "hive.hb.err.missingPrompt" }, "提案栏空白提示词 → missingPrompt（必填）");
eq(validateSlotDraft([{ id: "a", name: "x" }], "proposal").error?.code, "hive.hb.err.missingPrompt", "提案栏提示词缺失 → missingPrompt");
eq(validateSlotDraft([{ id: "a", name: "x", beeTypeId: "bt-1", prompt: "p" }], "proposal").error, null, "提案栏蜂种恒适用 → 保存 SHALL NOT 被拒绝");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", setStatus: "reviewed" }], "proposal").error, null, "提案栏 setStatus 枚举值 → 通过（编辑器为受限下拉，校验面不新增拒绝）");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", model: { provider: "p" } }], "proposal").error?.code, "hive.hb.err.invalidModel", "提案栏 model 形状同口径字段级拒绝");
eq(validateSlotDraft(Array.from({ length: 33 }, (_, i) => ({ id: "i" + i, name: "n" + i, prompt: "p" })), "proposal").error?.code, "hive.hb.err.tooManySlots", "提案栏超 32 → tooManySlots（宿主 zod 同界）");
/* 蜂栏 newSession/beeTypeId 无新增拒绝规则（联动只走读取路径裁剪，1.4） */
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", newSession: true, beeTypeId: "bt-1" }], "bee").error, null, "蜂栏 newSession + 蜂种 → 保存不被拒绝（联动只走读取裁剪）");
eq(validateSlotDraft([{ id: "a", name: "x", prompt: "p", beeTypeId: "bt-1" }], "bee").error, null, "蜂栏未勾 newSession 而带蜂种 → 保存不被拒绝（读取时裁剪）");

/* 容量超出 → 保存允许（error null）但提示键返回 overflow 数 */
const over = validateSlotDraft(
  Array.from({ length: 10 }, (_, i) => ({ id: "i" + i, name: "n" + i, summon: true })),
  "hive",
  { capacity: 8 }
);
eq(over.error, null, "容量超出 → 保存允许");
eq(over.overflow, 2, "overflow = 超出阵列容量的槽位数");
eq(validateSlotDraft([{ id: "a", name: "x" }], "hive", { capacity: 8 }).overflow, 0, "未超 → overflow 0");

/* ── resolveHotbarKind（2.3 / add-proposal-panel 3.2 四态门控矩阵） ── */
const gate = (selection, selectedBee, floatOpen, selectedProposal) => resolveHotbarKind({ selection, selectedBee, floatOpen, selectedProposal });
const proposalPick = { workspaceId: "ws-a", name: "add-foo" };
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
/* 第四态：提案选中（纯入参，函数保持纯净——SHALL NOT 触碰场景选中槽） */
eq(gate(null, null, false, proposalPick), "proposal", "提案选中 → 提案栏");
eq(gate({ kind: "studio", id: "ws-1" }, null, false, proposalPick), "proposal", "提案选中优先于巢选中");
eq(gate(null, "bee-1", false, proposalPick), "proposal", "提案选中优先于蜂栏（直发目标蜂仍由 selectedBee 解析，互不干扰）");
eq(gate(null, "bee-1", true, proposalPick), null, "浮窗优先于提案选中（页面遮罩暂停态）");
eq(gate(null, null, false, null), null, "提案选中共清空 → 回落既有三态");
eq(gate(null, null, false, { workspaceId: "ws-a" }), null, "提案选中缺 name（半形状）→ 不渲染提案栏");
eq(gate(null, null, false, { name: "add-foo" }), null, "提案选中缺 workspaceId（半形状）→ 不渲染提案栏");
/* 纯净性：调用不改写入参对象与场景选中槽（无副作用） */
{
  const selection = { kind: "studio", id: "ws-1" };
  const pick = { workspaceId: "ws-a", name: "add-foo" };
  resolveHotbarKind({ selection, selectedBee: "bee-1", floatOpen: false, selectedProposal: pick });
  eq(selection, { kind: "studio", id: "ws-1" }, "调用不改写入参 selection");
  eq(pick, { workspaceId: "ws-a", name: "add-foo" }, "调用不改写入参 selectedProposal");
}

/* ── resolveHotbarKind 的框选门控（bee-pick-and-marquee-focus 5.1）：真值表 ——
      `marqueeActive` 真 → 任何栏不渲染（首部短路，先于浮窗/提案/巢/地板/蜂栏）；
      缺省/false → 既有输出**逐项不变**（向后兼容的回归锚点）。 ── */
{
  const mGate = (selection, selectedBee, floatOpen, selectedProposal, marqueeActive) =>
    resolveHotbarKind({ selection, selectedBee, floatOpen, selectedProposal, marqueeActive });
  const states = [
    ["巢选中", { selection: { kind: "studio", id: "ws-1" }, selectedBee: null, floatOpen: false, selectedProposal: null }, "hive"],
    ["地板选中", { selection: { kind: "tile", id: "4,-2" }, selectedBee: null, floatOpen: false, selectedProposal: null }, "floor"],
    ["蜂栏", { selection: null, selectedBee: "bee-1", floatOpen: false, selectedProposal: null }, "bee"],
    ["提案栏", { selection: null, selectedBee: null, floatOpen: false, selectedProposal: proposalPick }, "proposal"],
    ["蜜杯选中", { selection: { kind: "cup", id: "cup-1" }, selectedBee: "bee-1", floatOpen: false, selectedProposal: null }, null],
    ["清选中", { selection: null, selectedBee: null, floatOpen: false, selectedProposal: null }, null],
    ["浮窗开", { selection: null, selectedBee: "bee-1", floatOpen: true, selectedProposal: null }, null]
  ];
  for (const [label, input, expected] of states) {
    eq(mGate(input.selection, input.selectedBee, input.floatOpen, input.selectedProposal, true), null, `${label}：marqueeActive 真 → 任何栏不渲染`);
    eq(mGate(input.selection, input.selectedBee, input.floatOpen, input.selectedProposal, false), expected, `${label}：marqueeActive false → 既有输出不变`);
    eq(gate(input.selection, input.selectedBee, input.floatOpen, input.selectedProposal), expected, `${label}：marqueeActive 缺省 → 既有输出逐项不变（向后兼容）`);
  }
  /* 框选优先于浮窗与提案（首部短路：真值下不得回落到任何具体栏） */
  eq(mGate(null, "bee-1", true, proposalPick, true), null, "marqueeActive 真 + 浮窗开 → null（浮窗亦不渲染）");
  eq(mGate({ kind: "studio", id: "ws-1" }, null, false, proposalPick, true), null, "marqueeActive 真 + 提案选中 → null");
  /* 纯净性：加入本入参后仍不改写入参 */
  {
    const selection = { kind: "studio", id: "ws-1" };
    resolveHotbarKind({ selection, selectedBee: "bee-1", floatOpen: false, selectedProposal: null, marqueeActive: true });
    eq(selection, { kind: "studio", id: "ws-1" }, "marqueeActive 路径不改写入参 selection");
  }
}

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
eq(Object.keys(DEFAULT_HOTBAR_SLOTS).sort(), ["bee", "floor", "hive", "proposal"], "骨架按四栏组织");
eq(DEFAULT_HOTBAR_SLOTS.proposal, [], "提案栏无默认卡（提案语义全部由用户槽位承载，空栏不渲染）");
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
/* 提案栏：无默认卡——空栏派生空数组（组件整栏不渲染），非空原样返回 */
eq(effectiveHotbarSlots("proposal", [], identityT), [], "空提案栏 → 空数组（无默认卡，整栏不渲染）");
const userProposal = [{ id: "p9", name: "提案卡", prompt: "p", autoSend: false }];
eq(effectiveHotbarSlots("proposal", userProposal, identityT), userProposal, "提案栏非空用户槽位 → 原样返回（同引用）");
/* 四栏互不影响：仅蜂栏有用户槽位 → 巢/地板/提案照常按各自骨架派生 */
eq(effectiveHotbarSlots("hive", [], identityT), [], "蜂栏有用户槽位，巢栏照常派生空（四栏互不影响）");
eq(effectiveHotbarSlots("floor", [], identityT).map((s) => s.id), ["default-hb-nest"], "蜂栏有用户槽位，地板栏回退不受影响");
eq(effectiveHotbarSlots("proposal", [], identityT), [], "蜂栏有用户槽位，提案栏照常派生空（互不影响）");
ok(HOTBAR_RESIDENT_KINDS.includes("bee") && !HOTBAR_RESIDENT_KINDS.includes("floor") && !HOTBAR_RESIDENT_KINDS.includes("hive") && !HOTBAR_RESIDENT_KINDS.includes("proposal"), "常驻分型：仅蜂栏常驻，巢/地板/提案回退");
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

/* ── workerBeeIdOf 门控矩阵（蜂栏/覆盖面板门控复用；工蜂 = 巢内蜂，1.3） ── */
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
eq(workerBeeIdOf(world, "wild-1", null, sessionsOf()), null, "野蜂（未分组主会话）→ null（工蜂仅认巢内蜂，蜂栏 SHALL NOT 渲染：D2）");
eq(workerBeeIdOf(world, "drone-1", null, sessionsOf()), null, "无人机（巢蜂 drones 挂载）→ 不显示");
eq(workerBeeIdOf(world, "orphan-drone", null, sessionsOf()), null, "orphan 无人机（降级混入巢内）→ 不显示");
eq(workerBeeIdOf(world, "bee-1", { kind: "tile", id: "4,-2" }, sessionsOf()), null, "非蜂显式选中 → 收起");
eq(workerBeeIdOf(world, "bee-1", null, sessionsOf({ byId: {} })), "bee-1", "镜像缺 byId → 仍按渲染世界判定");
eq(workerBeeIdOf(world, "ghost", null, sessionsOf()), null, "未渲染会话 → 不显示");
eq(workerBeeIdOf(world, null, null, sessionsOf()), null, "清选中（无 current）→ 不显示");
eq(workerBeeIdOf(null, "bee-1", null, sessionsOf()), null, "世界未就绪 → 不显示");

console.log("ALL HOTBARS MODULE SMOKE TESTS PASSED");
