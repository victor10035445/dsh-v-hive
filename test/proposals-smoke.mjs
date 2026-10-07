/**
 * 提案纯逻辑模块冒烟测试（add-proposal-panel 1.6；proposal-panel-config 1.4 扩展）：
 *  - 单一来源：`collectProposalNames` 经 proposals.mjs **再出口**（与 hive-voice.mjs
 *    同一函数引用——SHALL NOT 复制第二份过滤实现）；
 *  - `collectProposalNames`：archive / 隐藏项排除、trim、排序；
 *  - `buildProposalGroups`：多工作区分组与排序、**恒返回全部在册工作区**（空组口径）、
 *    title 空串原样透传、状态并查（无状态 = 无名）、**有效列表入参的中性合并**
 *    （列表外状态不并出，缺省入参 = 出厂四值零回归）；
 *  - `proposalStateKey` / `proposalStatusColor` / **状态列表归一化**（形状/id 唯一去重/
 *    封顶截断/非法拒绝）/ **有效列表缺省合并** / **名称回退链三段真值表**；
 *  - `normalizeProposalStates`：形状校验（键非空 / status 非空字符串 / at 有限数）、
 *    **孤儿条目保留**、封顶淘汰、scope 剪除、全空摘除整键；
 *  - `collectProposalScope`：三重守卫三真值表（空工作区清单 / ENOENT / EACCES）；
 *  - `panelReserve`：收起（pill）与展开（rows×24 + 头部 + 边距）两态。
 * 运行：node test/proposals-smoke.mjs
 */
import {
  PROPOSAL_STATES_LIMIT,
  PROPOSAL_STATUSES,
  PROPOSAL_STATUS_IDS,
  PROPOSAL_STATUS_LIMIT,
  PROPOSAL_STATUS_ID_MAX,
  PROPOSAL_STATUS_NAME_MAX,  REPORT_HEAD_PX,
  REPORT_LIST_PAD_PX,
  REPORT_PILL_PX,
  REPORT_ROW_PX,
  buildProposalGroups,
  buildProposalStatusName,
  collectProposalNames,
  collectProposalScope,
  effectiveProposalStatuses,
  isKnownProposalStatus,
  normalizeProposalStates,
  normalizeProposalStatuses,
  panelReserve,
  proposalStateKey,
  proposalStatusColor,
  proposalStatusName,
  proposalStatusOf,
  sanitizeProposalStatusesDraft
} from "../src/proposals.mjs";
import { collectProposalNames as voiceCollectProposalNames } from "../src/hive-voice.mjs";
const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 单一来源（D1/R16）：再出口即同一函数引用，SHALL NOT 复制实现 ── */
ok(collectProposalNames === voiceCollectProposalNames, "collectProposalNames 由 proposals.mjs 再出口（同一引用，单一来源）");

/* ── collectProposalNames：archive / 隐藏项排除 + trim + 排序 ── */
eq(collectProposalNames(["add-foo", "archive", ".tmp", "fix-baz"]), ["add-foo", "fix-baz"], "archive 与隐藏项排除");
eq(collectProposalNames(["  add-b  ", "add-a"]), ["add-a", "add-b"], "名称 trim 后排序");
eq(collectProposalNames(["archive"]), [], "仅 archive → 空表");
eq(collectProposalNames(["a", ".git", "..hidden", "b"]), ["a", "b"], "以 . 开头的一律排除");
eq(collectProposalNames(null), [], "非数组 → 空表");
eq(collectProposalNames([null, undefined, "", "  ", "ok"]), ["ok"], "空值/空白项剔除");

/* ── 状态列表（proposal-panel-config D1/D3）：出厂默认四值 + 归一化 + 回退链 ── */
eq(PROPOSAL_STATUS_IDS, ["reviewed", "executed", "paused", "archived"], "出厂默认值域 = reviewed/executed/paused/archived（顺序即呈现序）");
eq(PROPOSAL_STATUSES.map((e) => e.id), PROPOSAL_STATUS_IDS, "条目 id 与值域同源");
ok(PROPOSAL_STATUSES.every((e) => /^#[0-9a-f]{6}$/i.test(e.color)), "条目 color 为 CSS 色串（DOM 侧不 import three 调色板）");
ok(Object.isFrozen(PROPOSAL_STATUSES) && Object.isFrozen(PROPOSAL_STATUSES[0]), "枚举条目冻结（值域不可被运行时改写）");
eq(proposalStatusColor("reviewed"), "#e8a63c", "色点查表：reviewed 琥珀（≈ PALETTE.amberAccent）");
eq(proposalStatusColor("executed"), "#f2b544", "色点查表：executed 蜜金（= PALETTE.wallTrim）");
eq(proposalStatusColor("paused"), "#9aa3ad", "色点查表：paused 中性灰");
eq(proposalStatusColor("archived"), "#7d8ca3", "色点查表：archived 低饱和青灰（本轮新增默认值）");
eq(proposalStatusColor("nope"), null, "列表外状态 → null（卡片无标记）");
eq(proposalStatusColor(undefined), null, "缺省状态 → null");
eq(PROPOSAL_STATUS_LIMIT, 16, "封顶 16 条");
eq([PROPOSAL_STATUS_ID_MAX, PROPOSAL_STATUS_NAME_MAX], [32, 24], "id ≤32 / name ≤24 字符");

/* ── normalizeProposalStatuses：形状归一化 + id 唯一去重 + 封顶截断 + 非法拒绝 ── */
eq(normalizeProposalStatuses(undefined) ?? null, null, "undefined → undefined（文档无该字段）");
eq(normalizeProposalStatuses(null) ?? null, null, "null → undefined");
eq(normalizeProposalStatuses("bad") ?? null, null, "非数组 → undefined");
eq(normalizeProposalStatuses({}) ?? null, null, "非数组对象 → undefined");
eq(normalizeProposalStatuses([]) ?? null, null, "空数组 → undefined（读侧按缺省回退出厂四值）");
eq(normalizeProposalStatuses([{ id: "", color: "#fff" }]) ?? null, null, "id 空 → 条目丢弃（全丢 → undefined）");
eq(normalizeProposalStatuses([{ id: "   ", color: "#fff" }]) ?? null, null, "id 全空白 → 条目丢弃");
eq(normalizeProposalStatuses([{ id: 7, color: "#fff" }]) ?? null, null, "id 非字符串 → 条目丢弃");
eq(normalizeProposalStatuses([{ id: "x" }]) ?? null, null, "color 缺失 → 条目丢弃");
eq(normalizeProposalStatuses([{ id: "x", color: "red" }]) ?? null, null, "color 非十六进制 → 条目丢弃");
eq(normalizeProposalStatuses([{ id: "x", color: "#12" }]) ?? null, null, "color 位数非法（#12）→ 条目丢弃");
eq(normalizeProposalStatuses([{ id: "x", color: "12ab34" }]) ?? null, null, "color 缺 # → 条目丢弃");
eq(normalizeProposalStatuses(["nope", null, 7]) ?? null, null, "非对象条目 → 丢弃");
eq(normalizeProposalStatuses([{ id: "x".repeat(33), color: "#fff" }]) ?? null, null, "id 超 32 字符 → 条目丢弃");
eq(normalizeProposalStatuses([{ id: "x".repeat(32), color: "#fff" }]).length, 1, "id 恰 32 字符 → 保留（界含边界值）");
eq(normalizeProposalStatuses([{ id: "x", color: "#fff", name: "n".repeat(25) }]) ?? null, null, "name 超 24 字符 → 条目丢弃");
eq(normalizeProposalStatuses([{ id: "x", color: "#fff", name: "n".repeat(24) }])[0].name, "n".repeat(24), "name 恰 24 字符 → 保留");

eq(
  normalizeProposalStatuses([{ id: " 进行中 ", color: "#4c8f5c", name: " 推进 " }]),
  [{ id: "进行中", color: "#4c8f5c", name: "推进" }],
  "id/name trim、色彩原样（合法条目归一化）"
);
eq(normalizeProposalStatuses([{ id: "ok", color: "#ABC" }]), [{ id: "ok", color: "#ABC" }], "三色短形 #rgb 接受（大小写不敏感）");
eq(normalizeProposalStatuses([{ id: "ok", color: "#aabbcc" }]), [{ id: "ok", color: "#aabbcc" }], "六位 #rrggbb 接受");
eq(normalizeProposalStatuses([{ id: "ok", color: "#fff", name: "   " }]), [{ id: "ok", color: "#fff" }], "name 全空白 → 不产出该键（呈现侧走回退链）");
eq(normalizeProposalStatuses([{ id: "ok", color: "#fff", name: 7 }]), [{ id: "ok", color: "#fff" }], "name 非字符串 → 按空缺处理");

/* id 列表内唯一：重复 → 丢弃后续（写侧同规则 400） */
eq(
  normalizeProposalStatuses([{ id: "dup", color: "#111111" }, { id: "dup", color: "#222222" }, { id: "ok", color: "#333333" }]),
  [{ id: "dup", color: "#111111" }, { id: "ok", color: "#333333" }],
  "重复 id → 丢弃后续条目（首到者胜）"
);
eq(
  normalizeProposalStatuses([{ id: " dup ", color: "#111111" }, { id: "dup", color: "#222222" }]).length,
  1,
  "重复判定在 trim 之后（` dup ` 与 `dup` 视为同一 id）"
);

/* 封顶 16：截断保留前 16（SHALL NOT 因超限而整档重建） */
{
  const flood = [];
  for (let i = 0; i < PROPOSAL_STATUS_LIMIT + 5; i++) flood.push({ id: "s" + i, color: "#123456" });
  const capped = normalizeProposalStatuses(flood);
  eq(capped.length, PROPOSAL_STATUS_LIMIT, "超 16 条 → 截断到 " + PROPOSAL_STATUS_LIMIT);
  eq(capped.map((e) => e.id), flood.slice(0, PROPOSAL_STATUS_LIMIT).map((e) => e.id), "截断保留**前** 16 条（数组序即呈现序）");
  const exact = flood.slice(0, PROPOSAL_STATUS_LIMIT);
  eq(normalizeProposalStatuses(exact).length, PROPOSAL_STATUS_LIMIT, "恰 16 条 → 不截断");
}

/* ── effectiveProposalStatuses：缺省合并单点（有效列表恒非空） ── */
eq(effectiveProposalStatuses(undefined), PROPOSAL_STATUSES, "缺省 → 出厂四值（引用即常量，不复制）");
eq(effectiveProposalStatuses(null), PROPOSAL_STATUSES, "null → 出厂四值");
eq(effectiveProposalStatuses([]), PROPOSAL_STATUSES, "空列表 → 出厂四值（列表为空 = 未配置）");
eq(effectiveProposalStatuses("bad"), PROPOSAL_STATUSES, "坏形状 → 出厂四值");
eq(effectiveProposalStatuses([{ id: "nope", color: "red" }]), PROPOSAL_STATUSES, "条目全非法 → 出厂四值");
eq(effectiveProposalStatuses([{ id: "doing", color: "#4c8f5c", name: "进行中" }]), [{ id: "doing", color: "#4c8f5c", name: "进行中" }], "合法列表原样生效");
eq(effectiveProposalStatuses([{ id: "dup", color: "#111111" }, { id: "dup", color: "#222222" }]), [{ id: "dup", color: "#111111" }], "有效列表同样经归一化（唯一/封顶/丢弃）");

/* ── 列表查表与判定 ── */
{
  const list = effectiveProposalStatuses([{ id: "doing", color: "#4c8f5c", name: "进行中" }]);
  eq(proposalStatusOf(list, "doing")?.color, "#4c8f5c", "proposalStatusOf 命中条目");
  eq(proposalStatusOf(list, "reviewed") ?? null, null, "proposalStatusOf：不在列表 → null");
  eq(proposalStatusOf(list, "") ?? null, null, "proposalStatusOf：空 id → null");
  eq(proposalStatusOf(null, "doing") ?? null, null, "proposalStatusOf：非数组列表 → 出厂四值兜底（自定义 id 未命中）");
  ok(proposalStatusOf(null, "reviewed")?.id === "reviewed", "proposalStatusOf：非数组列表 → 出厂四值兜底（工厂 id 命中）");
  ok(isKnownProposalStatus(list, "doing"), "isKnownProposalStatus：列表内 → true");
  ok(!isKnownProposalStatus(list, "reviewed"), "isKnownProposalStatus：列表外 → false");
  ok(isKnownProposalStatus(undefined, "reviewed"), "isKnownProposalStatus：列表缺省 = 出厂四值");
  eq(proposalStatusColor("doing", list), "#4c8f5c", "proposalStatusColor 按传入列表查表");
  eq(proposalStatusColor("reviewed", list), null, "proposalStatusColor：列表外的出厂 id 也无色（列表即权威）");
}

/* ── 名称回退链三段真值表（D3）：字面名 → 工厂 id i18n → 自定义 id 字面 ── */
{
  const tr = (key) => ({ "hive.proposal.status.reviewed": "Reviewed", "hive.proposal.status.archived": "Archived" }[key] ?? key);
  eq(proposalStatusName({ id: "reviewed", color: "#fff", name: "已审阅" }, tr), "已审阅", "第一段：条目 name 非空 → 字面呈现（i18n 被覆盖）");
  eq(proposalStatusName({ id: "reviewed", color: "#fff" }, tr), "Reviewed", "第二段：name 空缺的工厂 id → i18n 名称（英文界面不被出厂中文名绑架）");
  eq(proposalStatusName({ id: "archived", color: "#fff" }, tr), "Archived", "第二段：archived 同走 i18n（zh/en 成对）");
  eq(proposalStatusName({ id: "doing", color: "#fff" }, tr), "doing", "第三段：name 空缺的自定义 id → 字面 id（存储宽容、呈现确定）");
  eq(proposalStatusName({ id: "  reviewed  ", color: "#fff" }, tr), "  reviewed  ", "id 原样参与工厂判定（条目 id 在归一化时已 trim，此处不二次解析）");
  eq(proposalStatusName(null, tr), "", "缺条目 → 空串（调用方据此不渲染标记）");
  eq(proposalStatusName({ id: "" }, tr), "", "空 id → 空串");
  eq(proposalStatusName({ id: "reviewed", color: "#fff", name: "   " }, tr), "Reviewed", "name 全空白 → 按空缺处理，落回 i18n");
  eq(proposalStatusName({ id: "reviewed", color: "#fff" }), "reviewed", "translate 缺席 → i18n 段回退字面 id（不抛错）");
  eq(proposalStatusName({ id: "reviewed", color: "#fff" }, () => ""), "reviewed", "translate 返回空串 → 回退字面 id");
}

/* ── proposalStateKey：只构造不反解 ── */
eq(proposalStateKey("ws-a", "add-foo"), "ws-a/add-foo", "键 = <workspaceId>/<changeName>");
eq(proposalStateKey("ws-a", "a/b"), "ws-a/a/b", "change 名自身含 / 也能构造（键不作反解，故无歧义）");
eq(proposalStateKey(undefined, "x"), "/x", "缺 workspaceId → 空前缀（调用方另有在册校验）");

/* ── 渲染期名称查表与编辑器草稿（UI 单点，proposal-panel-config 3.3/4.3） ── */
{
  const tr = (key) => ({ "hive.proposal.status.paused": "Paused" }[key] ?? key);
  const nameOf = buildProposalStatusName([{ id: "reviewed" }, { id: "doing", name: "进行中" }, { id: "paused" }], tr);
  eq(nameOf("paused"), "Paused", "buildProposalStatusName：工厂 id 空缺 name → i18n");
  eq(nameOf("doing"), "进行中", "buildProposalStatusName：自定义条目字面名");
  eq(nameOf("reviewed"), "hive.proposal.status.reviewed", "buildProposalStatusName：translate 未定义该键 → 整键字面（i18n 缺席不失真）");
  eq(nameOf("nope"), "", "buildProposalStatusName：列表外 → 空串（调用方不渲染标记）");
  eq(buildProposalStatusName(null, tr)("reviewed"), "hive.proposal.status.reviewed", "buildProposalStatusName：列表缺省 = 出厂四值");
}
{
  eq(sanitizeProposalStatusesDraft(undefined), PROPOSAL_STATUSES.map((e) => ({ id: e.id, color: e.color, name: "" })), "草稿缺省 = 出厂四值的可编辑副本（name 空串）");
  eq(sanitizeProposalStatusesDraft([]), sanitizeProposalStatusesDraft(undefined), "空草稿 → 回落出厂四值（编辑器永不为空）");
  eq(
    sanitizeProposalStatusesDraft([{ id: "d", color: "red", name: " 敲一半" }]),
    [{ id: "d", color: PROPOSAL_STATUSES[0].color, name: " 敲一半" }],
    "草稿：非法色落回出厂首色；name 原样透传（不 trim，正在输入的中间态不吞字符）"
  );
  eq(
    sanitizeProposalStatusesDraft([{ id: 7, color: "#123456" }]),
    [{ id: "", color: "#123456", name: "" }],
    "草稿：坏 id 归空串（行仍在，用户在编辑器里可见）；缺 name 补空串"
  );
  eq(sanitizeProposalStatusesDraft([{ id: "a", color: " #ABCDEF " }])[0].color, "#ABCDEF", "草稿：色值 trim");
}
/* ── id 长度界（实测踩坑护栏，proposal-panel-config 6.1） ──
   宿主写侧把 id 上限定在 PROPOSAL_STATUS_ID_MAX = 32，而 `crypto.randomUUID()`
   恰好 36 字符——客户端若拿 UUID 当状态行 id，**任何新增状态保存必 400**。此处断言
   「界」本身，并断言与界配套的生成式可满足它（`client.jsx` 的 newShortId 同款：
   前缀 + base36 时间戳 + 随机段）。 */
{
  eq(PROPOSAL_STATUS_ID_MAX, 32, "id 字符上限 = 32（与宿主 zod 同界）");
  const uuid = "3c4d3683-2a06-497f-ba75-45fee7fe42af";
  ok(uuid.length === 36 && uuid.length > PROPOSAL_STATUS_ID_MAX, "crypto.randomUUID 产物（36）**超界**——正是本轮实测的 400 根因");
  eq(normalizeProposalStatuses([{ id: uuid, color: "#e8a63c" }]) ?? null, null, "读档侧：超长 id 条目丢弃（与宿主写侧同规则）");
  const shortId = (prefix) => prefix + Date.now().toString(36) + "-" + "abc123def456";
  for (const prefix of ["ps-", "slot-"]) {
    const id = shortId(prefix);
    ok(id.length <= PROPOSAL_STATUS_ID_MAX, `${prefix} 生成式产物在界内（${id.length} ≤ 32）`);
    eq(normalizeProposalStatuses([{ id, color: "#e8a63c" }])?.[0]?.id, id, `${prefix} 生成式产物读档往返合法`);
  }
}

/* ── normalizeProposalStates：形状校验 + 封顶 + 剪除 ── */
eq(normalizeProposalStates(undefined) ?? null, null, "undefined → undefined（文档无此字段）");
eq(normalizeProposalStates(null) ?? null, null, "null → undefined");
eq(normalizeProposalStates("bad") ?? null, null, "非对象 → undefined");
eq(normalizeProposalStates([]) ?? null, null, "数组 → undefined");
eq(normalizeProposalStates({}) ?? null, null, "空对象 → undefined（全空摘除整键）");

const dirty = normalizeProposalStates({
  "ws-a/ok": { status: "reviewed", at: 7 },
  "ws-a/custom": { status: "custom-x", at: 2 }, // 列表外/自定义状态 → **保留**（D4 形状校验）
  "ws-a/bad-status": { status: 7, at: 1 }, // status 非字符串 → 丢弃
  "ws-a/blank-status": { status: "   ", at: 1 }, // status 全空白 → 丢弃
  "ws-a/bad-at": { status: "paused", at: "x" }, // at 非有限数 → 丢弃
  "ws-a/no-at": { status: "paused" }, // at 缺失 → 丢弃
  "ws-a/not-object": "nope", // 非对象 → 丢弃
  "ws-a/nulled": null, // null → 丢弃
  "": { status: "paused", at: 3 } // 空键 → 丢弃
});
eq(Object.keys(dirty), ["ws-a/ok", "ws-a/custom"], "形状合法条目保留（孤儿/自定义状态值 SHALL NOT 被剪除）");
eq(dirty["ws-a/ok"], { status: "reviewed", at: 7 }, "合法条目原样保留（键序即插入序）");
eq(dirty["ws-a/custom"], { status: "custom-x", at: 2 }, "列表外状态值原样保留（删状态不丢历史戳）");
eq(normalizeProposalStates({ "k": { status: " reviewed ", at: 4 } })["k"], { status: "reviewed", at: 4 }, "status trim 后落库（形状校验口径与槽位一致）");
/* at 为数值字符串 → Number() 可转，按有限数接受（宽松读侧） */
eq(Object.keys(normalizeProposalStates({ "k": { status: "paused", at: "12" } })), ["k"], "at 数值字符串按有限数接受");

/* 封顶 512：超出按 at 淘汰最旧（SHALL NOT 拒绝置位） */
{
  const flood = {};
  for (let i = 0; i < PROPOSAL_STATES_LIMIT + 88; i++) flood["ws/c" + i] = { status: "reviewed", at: i };
  const capped = normalizeProposalStates(flood);
  eq(Object.keys(capped).length, PROPOSAL_STATES_LIMIT, "封顶 " + PROPOSAL_STATES_LIMIT);
  ok(!("ws/c0" in capped) && !("ws/c87" in capped) && "ws/c88" in capped && "ws/c" + (PROPOSAL_STATES_LIMIT + 87) in capped, "超出按 at 淘汰最旧（保留最新）");
}
{
  const exact = {};
  for (let i = 0; i < PROPOSAL_STATES_LIMIT; i++) exact["ws/e" + i] = { status: "paused", at: i };
  eq(Object.keys(normalizeProposalStates(exact)).length, PROPOSAL_STATES_LIMIT, "恰好等于上限 → 不淘汰");
}

/* scope 剪除：keys 命中保留；未命中且非不可判定 → 剪 */
{
  const scope = { keys: new Set(["ws-a/add-foo"]), indeterminate: new Set() };
  const pruned = normalizeProposalStates(
    { "ws-a/add-foo": { status: "reviewed", at: 1 }, "ws-a/gone": { status: "paused", at: 2 } },
    scope
  );
  eq(Object.keys(pruned), ["ws-a/add-foo"], "scope 剪除：目录内已不存在的键被剪");
  eq(normalizeProposalStates({ "ws-a/gone": { status: "paused", at: 2 } }, scope) ?? null, null, "全部剪空 → undefined（宿主据此摘除整键）");
}
/* scope.keys 缺席 → 不剪（无判定面） */
eq(Object.keys(normalizeProposalStates({ "ws-a/x": { status: "paused", at: 1 } }, {})), ["ws-a/x"], "scope 无 keys → 不剪（保守）");
/* indeterminate 前缀命中 → 保留（守卫 b/c 的落地） */
{
  const scope = { keys: new Set(), indeterminate: new Set(["ws-a"]) };
  eq(Object.keys(normalizeProposalStates({ "ws-a/keep": { status: "paused", at: 1 }, "ws-b/drop": { status: "paused", at: 2 } }, scope)), ["ws-a/keep"], "不可判定工作区的键保留，其余照剪");
  /* 前缀匹配不得误伤同名前缀的其它工作区（ws-a vs ws-ab 的边界） */
  const scope2 = { keys: new Set(), indeterminate: new Set(["ws-a"]) };
  eq(normalizeProposalStates({ "ws-ab/x": { status: "paused", at: 1 } }, scope2) ?? null, null, "前缀匹配以 `id/` 为界，不误判 ws-ab");
}

/* ── collectProposalScope：三重守卫三真值表 ── */
const readOk = (namesByPath) => (path) => ({ ok: true, names: namesByPath[path] ?? [] });
const wsA = { id: "ws-a", path: "A", title: "A 巢" };
const wsB = { id: "ws-b", path: "B", title: "" };

/* 守卫 (a)：工作区清单为空 → decidable:false（调用方本轮跳过剪除） */
{
  const scope = collectProposalScope([], readOk({}));
  eq(scope.decidable, false, "空工作区清单 → decidable=false（本轮跳过剪除）");
  eq([...scope.keys], [], "空清单 → keys 空集");
  eq([...scope.indeterminate], [], "空清单 → indeterminate 空集");
  const scope2 = collectProposalScope(null, readOk({}));
  eq(scope2.decidable, false, "非数组工作区清单 → 同空清单口径");
}
/* 正常：目录可读 → 产出该工作区全部存在的键（archive/隐藏项经单一来源排除） */
{
  const scope = collectProposalScope([wsA, wsB], readOk({ A: ["add-foo", "archive", ".tmp", "add-bar"] }));
  eq(scope.decidable, true, "有工作区 → decidable=true");
  eq([...scope.keys].sort(), ["ws-a/add-bar", "ws-a/add-foo"], "keys = 该工作区未归档 change 的键（archive/隐藏项排除）");
  eq([...scope.indeterminate], [], "可读目录不计入 indeterminate");
}
/* 守卫 (b)：ENOENT（目录确实消失）→ 不出键、不计 indeterminate（参与剪除） */
{
  const scope = collectProposalScope([wsA, wsB], (path) => (path === "A" ? { ok: false, code: "ENOENT" } : { ok: true, names: ["fix-baz"] }));
  eq(scope.decidable, true, "部分工作区目录消失 → 仍 decidable");
  eq([...scope.keys], ["ws-b/fix-baz"], "ENOENT 工作区不出键（其键本轮被剪）");
  eq([...scope.indeterminate], [], "ENOENT 不计入 indeterminate（目录确实消失）");
}
/* 守卫 (c)：其它错误（EACCES/EPERM/EMFILE）→ 该工作区本轮不可判定（宁留勿误删） */
{
  for (const code of ["EACCES", "EPERM", "EMFILE", "EIO"]) {
    const scope = collectProposalScope([wsA, wsB], (path) => (path === "A" ? { ok: false, code } : { ok: true, names: [] }));
    eq([...scope.indeterminate], ["ws-a"], `${code} → 该工作区计入 indeterminate（本轮跳过）`);
    eq([...scope.keys], [], "不可读工作区不出键");
  }
  /* 无 code 的失败（未知异常）同样按不可判定处理（保守） */
  const scope = collectProposalScope([wsA], () => ({ ok: false }));
  eq([...scope.indeterminate], ["ws-a"], "失败而无 code → 保守计入 indeterminate");
  /* 回调缺席 → 全部计入不可判定 */
  const scope2 = collectProposalScope([wsA], undefined);
  eq([...scope2.indeterminate], ["ws-a"], "无 readNames 回调 → 判定面不可得（全部跳过）");
}
/* 双重兜底：ENOENT 剪除 + EACCES 保留同一份 states 上并存 */
{
  const scope = collectProposalScope(
    [wsA, wsB],
    (path) => (path === "A" ? { ok: false, code: "ENOENT" } : { ok: false, code: "EACCES" })
  );
  const pruned = normalizeProposalStates(
    { "ws-a/vanish": { status: "paused", at: 1 }, "ws-b/unreadable": { status: "reviewed", at: 2 } },
    scope
  );
  eq(Object.keys(pruned), ["ws-b/unreadable"], "同轮内 ENOENT 剪除、EACCES 保留（三真值表核心）");
}
/* workspaceId 双写兜底：实体用 workspaceId 字段也能构造键 */
{
  const scope = collectProposalScope([{ workspaceId: "ws-alt", path: "C" }], readOk({ C: ["x"] }));
  eq([...scope.keys], ["ws-alt/x"], "实体仅有 workspaceId 字段 → 经双写兜底构造键");
  const scopeNoId = collectProposalScope([{ path: "D" }], readOk({ D: ["x"] }));
  eq([...scopeNoId.keys], [], "无 id 实体 → 不产出键");
  eq([...scopeNoId.indeterminate], [], "无 id 实体 → 不计入 indeterminate（无法构造前缀）");
}

/* ── buildProposalGroups：恒返回全部在册工作区 + 排序 + 状态并查 + title 透传 ── */
{
  const read = (path) => (path === "A" ? ["add-foo", "add-bar", "archive"] : path === "B" ? ["fix-baz"] : []);
  const groups = buildProposalGroups(
    [wsA, wsB, { id: "ws-c", path: "C", title: "C 巢" }],
    read,
    { "ws-a/add-foo": { status: "reviewed", at: 5 }, "ws-a/add-bar": { status: "bogus", at: 6 } }
  );
  eq(groups.length, 3, "恒返回全部在册工作区（含无目录者）");
  eq(groups[0].workspaceId, "ws-a", "组序 = 宿主工作区序");
  eq(groups[0].changes, [{ name: "add-bar" }, { name: "add-foo", status: "reviewed" }], "组内名称序；状态并查；列表外状态不落名（缺省列表 = 出厂四值）");
  eq(groups[1].changes, [{ name: "fix-baz" }], "第二组内容");
  eq(groups[2].changes, [], "无 openspec/changes 目录的工作区 → changes: []（不抛错）");
  eq(groups[1].title, "", "title 空串原样透传（客户端回退工作区 id，宿主不回退）");
  eq(groups[0].path, "A", "path 原样透传（召唤落点用）");
  eq(Object.keys(groups[0]).sort(), ["changes", "path", "title", "workspaceId"], "组形状 = { workspaceId, title, path, changes }");
}
/* 有效列表入参（D4）：中性合并——列表内并出、列表外（含出厂 id）不并出 */
{
  const read = () => ["add-foo", "add-bar", "add-baz", "add-qux"];
  const states = {
    "ws-a/add-foo": { status: "doing", at: 1 },
    "ws-a/add-bar": { status: "reviewed", at: 2 },
    "ws-a/add-baz": { status: "custom-x", at: 3 },
    "ws-a/add-qux": { status: "archived", at: 4 }
  };
  const custom = buildProposalGroups([wsA], read, states, [{ id: "doing", color: "#4c8f5c" }]);
  eq(
    custom[0].changes,
    [{ name: "add-bar" }, { name: "add-baz" }, { name: "add-foo", status: "doing" }, { name: "add-qux" }],
    "有效列表 = [doing]：仅列表内状态并出；出厂 id（reviewed/archived）与自定义孤儿（custom-x）均无标记"
  );
  const factory = buildProposalGroups([wsA], read, states, effectiveProposalStatuses(undefined));
  eq(
    factory[0].changes.filter((c) => c.status).map((c) => [c.name, c.status]),
    [["add-bar", "reviewed"], ["add-qux", "archived"]],
    "有效列表 = 出厂四值：reviewed/archived 并出，自定义 doing/custom-x 无标记"
  );
  eq(buildProposalGroups([wsA], read, states, [])[0].changes.filter((c) => c.status).length, 2, "空列表入参按缺省出厂四值处理（中性合并口径）");
  eq(buildProposalGroups([wsA], read, states, null)[0].changes.filter((c) => c.status).length, 2, "null 列表入参按缺省出厂四值处理");
}
/* 读目录回调缺席/非函数 → 该组空 changes（不抛错）；抛错由调用方兜底
   （纯函数不做 try/catch——宿主 readProposalNames 已吞错并回 {ok:false}）。 */
eq(buildProposalGroups([wsA], null, {})[0].changes, [], "readChanges 非函数 → changes: []（不抛错）");
/* states 坏形状 → 按空处理 */
eq(buildProposalGroups([wsA], () => ["x"], null)[0].changes, [{ name: "x" }], "states 缺省 → 无状态标记");
eq(buildProposalGroups([wsA], () => ["x"], "bad")[0].changes, [{ name: "x" }], "states 非对象 → 按空处理");
eq(buildProposalGroups([], () => ["x"], {}), [], "空工作区清单 → 空组数组");
eq(buildProposalGroups(null, () => ["x"], {}), [], "非数组工作区 → 空组数组（不抛错）");

/* ── panelReserve：收起/展开两态 ── */
eq(panelReserve({ reportCollapsed: true, reportRows: 8 }), REPORT_PILL_PX, "收起 → pill 高 30px");
eq(panelReserve({ reportCollapsed: false, reportRows: 8 }), REPORT_HEAD_PX + 8 * REPORT_ROW_PX + REPORT_LIST_PAD_PX, "展开 8 行 → 头部 34 + 8×24 + 边距 12");
eq(panelReserve({ reportCollapsed: false, reportRows: 20 }), REPORT_HEAD_PX + 20 * REPORT_ROW_PX + REPORT_LIST_PAD_PX, "展开 20 行（真机核验档）→ 34 + 480 + 12");
eq(panelReserve({}), REPORT_HEAD_PX + REPORT_LIST_PAD_PX, "缺省（未折叠、rows 0）→ 头部 + 边距");
eq(panelReserve({ reportCollapsed: false, reportRows: -3 }), REPORT_HEAD_PX + REPORT_LIST_PAD_PX, "负 rows → 按 0 处理");
eq(panelReserve({ reportCollapsed: true, reportRows: "x" }), REPORT_PILL_PX, "收起态不受 rows 坏值影响");
eq(panelReserve(), REPORT_HEAD_PX + REPORT_LIST_PAD_PX, "无参 → 不抛错（缺省展开 0 行）");
ok(panelReserve({ reportCollapsed: false, reportRows: 20 }) >= panelReserve({ reportCollapsed: true, reportRows: 20 }), "展开 reserve ≥ 收起 reserve（让位单调）");

console.log("ALL PROPOSALS MODULE SMOKE TESTS PASSED");
