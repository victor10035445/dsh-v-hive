/**
 * 状态卡片纯逻辑模块冒烟测试（bee-status-cards 1.5）：
 *  - normalizeStatusCards：悬空键丢弃 / 形状非法值丢弃 / prompt trim / autoSend
 *    布尔化 / 空白 prompt 清除 / 键数上限 16；
 *  - validateStatusCardDraft：字段级错误码（缺 beeTypeId / prompt 非字符串）；
 *  - completionPool：done 主蜂归类 / 排除无人机（droneStandIn + origin subagent）/
 *    归档天然不在 world / 野蜂计入绑定蜂种 / 未绑定野蜂计入默认蜂 / 稳定序；
 *  - advanceCursor：+1 取模 / 空池 no-op；
 *  - statusBarReserve：收起 pill / 展开 rows×24 + 头部 + 边距。
 * 运行：node test/status-cards-smoke.mjs
 */
import {
  MAX_STATUS_CARDS,
  advanceCursor,
  completionPool,
  completionSessions,
  emptyStatusCards,
  normalizeStatusCards,
  snapshotSessions,
  statusBarReserve,
  validateStatusCardDraft
} from "../src/status-cards.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── normalizeStatusCards（1.1 镜像归一化） ── */
const beeTypes = [{ id: "bt-design", name: "设计蜂" }, { id: "bt-review", name: "审查蜂" }];

eq(normalizeStatusCards(undefined, beeTypes), emptyStatusCards(), "undefined → 空（旧文档兼容）");
eq(normalizeStatusCards("bad", beeTypes), emptyStatusCards(), "非对象 → 空");
eq(normalizeStatusCards([1, 2], beeTypes), emptyStatusCards(), "数组 → 空");
eq(normalizeStatusCards({}, beeTypes), emptyStatusCards(), "空对象 → 空");

const norm = normalizeStatusCards(
  {
    "bt-design": { prompt: "  汇报进度  ", autoSend: true },
    "bt-review": { prompt: "审查", autoSend: 0 }, // 非布尔 → false
    "bt-gone": { prompt: "悬空键", autoSend: true }, // 悬空蜂种 → 丢弃
    "bt-x": "not-object", // 形状非法 → 丢弃
    "bt-y": { prompt: "   ", autoSend: true }, // 空白 prompt → 清除（丢弃）
    "bt-z": null // 空值 → 丢弃
  },
  beeTypes
);
eq(Object.keys(norm).sort(), ["bt-design", "bt-review"], "悬空键/坏形状/空白 prompt 值全部丢弃");
eq(norm["bt-design"], { prompt: "汇报进度", autoSend: true }, "prompt trim + autoSend 真 → true");
eq(norm["bt-review"], { prompt: "审查", autoSend: false }, "非布尔 autoSend → false");

/* 键数上限 16 */
const floodTypes = Array.from({ length: 20 }, (_, i) => ({ id: "bt" + i, name: "n" + i }));
const floodRaw = {};
for (let i = 0; i < 20; i++) floodRaw["bt" + i] = { prompt: "p" + i, autoSend: false };
const flood = normalizeStatusCards(floodRaw, floodTypes);
eq(Object.keys(flood).length, MAX_STATUS_CARDS, "键数上限 16：20 键 → 裁到 16");

/* ── validateStatusCardDraft（1.1 字段级错误码） ── */
eq(validateStatusCardDraft({ beeTypeId: "bt-design", prompt: "开会", autoSend: false }), null, "合法草稿 → null");
eq(validateStatusCardDraft({ beeTypeId: "bt-design", prompt: "", autoSend: false }), null, "空白 prompt → 允许（清除配置）");
eq(validateStatusCardDraft({ prompt: "开会" }), { field: "beeTypeId", code: "hive.hb.status.err.missingType" }, "缺 beeTypeId → missingType");
eq(validateStatusCardDraft({ beeTypeId: "bt-design", prompt: 42 }), { field: "prompt", code: "hive.hb.status.err.invalidPrompt" }, "prompt 非字符串 → invalidPrompt");
eq(validateStatusCardDraft(null), { field: "beeTypeId", code: "hive.hb.status.err.missingType" }, "null 行 → missingType");

/* ── completionPool（1.2 完成池口径） ── */
const done = { state: "done", droneStandIn: false };
const busy = { state: "busy", droneStandIn: false };
const world = {
  studios: [
    {
      workspaceId: "ws-1",
      bees: [
        { ...done, sessionId: "s-design-1", cellIndex: 2 },
        { ...done, sessionId: "s-design-0", cellIndex: 1 },
        { ...busy, sessionId: "s-busy" },
        { ...done, sessionId: "s-drone", cellIndex: 3, droneStandIn: true }, // 降级停驻无人机
        { ...done, sessionId: "s-subagent", cellIndex: 4 } // origin subagent（双保险）
      ]
    }
  ],
  wildBees: [
    { ...done, sessionId: "s-wild-bound" }, // 绑定蜂种的野蜂
    { ...done, sessionId: "s-wild-default" } // 未绑定野蜂 → 默认蜂
  ]
};
const assignments = {
  "s-design-1": "bt-design",
  "s-design-0": "bt-design",
  "s-drone": "bt-design",
  "s-subagent": "bt-review",
  "s-wild-bound": "bt-review"
};
const sessionsState = {
  byId: {
    "s-subagent": { origin: "subagent" },
    "s-design-1": { origin: "user" },
    "s-design-0": { origin: "user" },
    "s-drone": { origin: "subagent" },
    "s-wild-bound": { origin: "user" },
    "s-wild-default": { origin: "user" }
  }
};

const pool = completionPool(world, assignments, sessionsState);
eq(Object.keys(pool).sort(), ["bt-design", "bt-review", "default"], "归类键 = 绑定蜂种 + 默认蜂");
eq(completionSessions(pool, "bt-design"), ["s-design-0", "s-design-1"], "设计蜂完成池：稳定序（cellIndex 优先）且排除无人机/降级停驻");
eq(completionSessions(pool, "bt-review"), ["s-wild-bound"], "审查蜂完成池：绑定野蜂计入；subagent 排除");
eq(completionSessions(pool, "default"), ["s-wild-default"], "默认蜂完成池：未绑定野蜂计入");

/* 稳定序 = cellIndex 优先、sessionId 字典序次级 */
const tieWorld = {
  studios: [{ workspaceId: "ws", bees: [
    { ...done, sessionId: "zb", cellIndex: 0 },
    { ...done, sessionId: "aa", cellIndex: 0 }
  ] }],
  wildBees: []
};
const tiePool = completionPool(tieWorld, {}, { byId: {} });
eq(completionSessions(tiePool, "default"), ["aa", "zb"], "同 cellIndex → sessionId 字典序次级");

/* 无人机（挂在父蜂 drones 上的）也不入卡——world 里只有主蜂，这里验证 droneStandIn 双保险已覆盖 */
ok(!completionSessions(pool, "bt-design").includes("s-drone"), "droneStandIn 不入卡");

/* ── advanceCursor（1.3 循环游标） ── */
eq(advanceCursor(0, 0), 0, "空池 no-op → 0");
eq(advanceCursor(3, 0), 1, "池长 3、游标 0 → 1");
eq(advanceCursor(3, 1), 2, "游标 1 → 2");
eq(advanceCursor(3, 2), 0, "游标 2 → 0（循环回首）");
eq(advanceCursor(1, 0), 0, "池长 1 → 恒 0");

/* snapshotSessions = 稳定序快照 */
eq(snapshotSessions(pool, "bt-design"), ["s-design-0", "s-design-1"], "快照 = 完成池有序 sessionId 列表");
ok(snapshotSessions(pool, "bt-design") !== pool["bt-design"], "快照返回新数组（不共享引用）");

/* ── statusBarReserve（1.4 报告让位） ── */
eq(statusBarReserve({ reportCollapsed: true, reportRows: 8 }), 30, "收起 → pill 高 30px");
eq(statusBarReserve({ reportCollapsed: false, reportRows: 8 }), 34 + 8 * 24 + 12, "展开 8 行 → 头部 34 + 8×24 + 边距 12");
eq(statusBarReserve({ reportCollapsed: false, reportRows: 20 }), 34 + 20 * 24 + 12, "展开 20 行 → 头部 34 + 20×24 + 边距 12");
eq(statusBarReserve({}), 34 + 0 * 24 + 12, "缺省（未折叠、rows 0）→ 头部 + 边距");
eq(statusBarReserve({ reportCollapsed: false, reportRows: -3 }), 34 + 0 * 24 + 12, "负 rows → 按 0 处理");

console.log("ALL STATUS-CARDS MODULE SMOKE TESTS PASSED");
