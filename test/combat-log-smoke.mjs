/**
 * 「作战报告」差分与缓冲冒烟测试（hive-combat-log 任务 2.1，design D9）：
 *  - 首轮基线无事件；八类高优先级事件判定；
 *  - 无人机同帧按父合并；同键去重；
 *  - 抖动阻尼（busy↔idle 抖动仅 1 行、help 穿透）；环形覆写；未读计数。
 * 沿 bee-model-smoke.mjs fixture 风格直调 deriveWorld 构造前后世界。
 * 运行：node test/combat-log-smoke.mjs
 */
import { deriveWorld, BEE_STATE } from "../src/bee-model.mjs";
import {
  diffHiveEvents,
  CombatLogFeed,
  COMBAT_LOG_CAP,
  EV_KIND,
  isLowPriority,
  MIGRATE_COOLDOWN_MS
} from "../src/hive/combat-log.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/** 会话摘要（bee-model stateOf 同源字段）。 */
function summary(overrides) {
  return {
    id: overrides.id,
    displayTitle: overrides.title ?? overrides.id,
    blank: false,
    running: false,
    completed: false,
    pendingInteraction: null,
    origin: overrides.origin ?? "user",
    parentId: overrides.parentId ?? null,
    updatedAt: 1000,
    ...overrides
  };
}

/** 由快照描述构造 sessions/workspaces（deriveWorld 直调）。 */
function makeSnapshots({ bees = [], archive = [], items }) {
  const byId = {};
  const ids = [];
  for (const b of bees) {
    byId[b.id] = b;
    ids.push(b.id);
  }
  const sessions = { ids, byId, current: ids[0] ?? null };
  const workspaces = { items: items ?? [], archivedSessionIds: archive };
  return { sessions, workspaces };
}

/** 派生世界 + 返回 { world, workspaces } 供 diffHiveEvents 喂入。 */
function worldOf(bees, archive, items) {
  const snap = makeSnapshots({ bees, archive, items });
  const derived = deriveWorld({ sessions: snap.sessions, workspaces: snap.workspaces, positions: {} });
  return { world: derived.world, workspaces: snap.workspaces };
}

/* ═══ 首轮基线：无事件 ═══ */
{
  const { world, workspaces } = worldOf(
    [
      summary({ id: "a", running: true, cwd: "F:/ws1" }),
      summary({ id: "b", completed: true, cwd: "F:/ws1" })
    ],
    ["b"],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a", "b"] }]
  );
  const r = diffHiveEvents(null, { world, workspaces, now: 1000 });
  eq(r.events.length, 0, "首轮只建基线不产生事件");
  ok(r.baseline.sessionState.has("a"), "基线含 sessionState");
  ok(r.baseline.workspaceIds.has("ws1"), "基线含 workspaceId 集");
  ok(r.baseline.archived.has("b"), "基线含 archived 集");
}

/* ═══ 八类高优先级事件 ═══ */
{
  /* 召唤工蜂 + 开始执行任务 + 完成任务 + 发出求助 */
  const before = worldOf(
    [summary({ id: "a", cwd: "F:/ws1" })],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
  );
  let prev = diffHiveEvents(null, before).baseline;

  /* tick1：a→busy（开始），新工蜂 b 出现（召唤） */
  const tick1 = worldOf(
    [
      summary({ id: "a", running: true, cwd: "F:/ws1" }),
      summary({ id: "b", cwd: "F:/ws1" })
    ],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a", "b"] }]
  );
  const r1 = diffHiveEvents(prev, { world: tick1.world, workspaces: tick1.workspaces, now: 1000 });
  const kinds1 = r1.events.map((e) => e.kind);
  ok(kinds1.includes(EV_KIND.enterWorker), "新工蜂 → 召唤事件");
  ok(kinds1.includes(EV_KIND.start), "→busy → 开始事件");
  /* 巢名前缀：工蜂类事件携带所属蜂巢 title（用于看清「哪些蜂巢行动了」） */
  eq(r1.events.find((e) => e.kind === EV_KIND.enterWorker).title, "one", "召唤工蜂带巢名 one");
  eq(r1.events.find((e) => e.kind === EV_KIND.start).title, "one", "开始任务带巢名 one");
  prev = r1.baseline;

  /* tick2：a→done（完成），b→help（求助）。时间推进越过冷却窗保证 done 发行。 */
  const tick2 = worldOf(
    [
      summary({ id: "a", completed: true, cwd: "F:/ws1" }),
      summary({ id: "b", pendingInteraction: "approval", cwd: "F:/ws1" })
    ],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a", "b"] }]
  );
  const r2 = diffHiveEvents(prev, { world: tick2.world, workspaces: tick2.workspaces, now: 4000 });
  ok(r2.events.some((e) => e.kind === EV_KIND.done && e.sessionId === "a"), "→done → 完成任务事件");
  ok(r2.events.some((e) => e.kind === EV_KIND.help && e.sessionId === "b"), "→help → 求助事件");
  prev = r2.baseline;
  prev.lastEmitAt = new Map(); // 清冷却，避免后续断言受冷却影响

  /* tick3：归档（b 入 archived）+ 新巢（ws2）。b 仍在 sessions 快照且列在 ws1.sessionIds，
     归档时化蜜杯挂巢心（deriveWorld 语义：archived.has(id) → cups）。 */
  const tick3 = worldOf(
    [
      summary({ id: "a", completed: true, cwd: "F:/ws1" }),
      summary({ id: "b", completed: true, cwd: "F:/ws1" })
    ],
    ["b"],
    [
      { workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a", "b"] },
      { workspaceId: "ws2", path: "F:/ws2", title: "two", sessionIds: [] }
    ]
  );
  const r3 = diffHiveEvents(prev, { world: tick3.world, workspaces: tick3.workspaces, now: 4000 });
  ok(r3.events.some((e) => e.kind === EV_KIND.archive && e.sessionId === "b"), "归档事件");
  ok(r3.events.some((e) => e.kind === EV_KIND.newNest && e.workspaceId === "ws2"), "新巢建立事件");
  /* 归档带巢名；新巢/搬离/野蜂不带巢名前缀（本身即巢级/野蜂语义） */
  eq(r3.events.find((e) => e.kind === EV_KIND.archive).title, "one", "归档带巢名 one");
  eq(r3.events.find((e) => e.kind === EV_KIND.newNest).title, "two", "新巢 title=two（渲染侧不加前缀）");
}

/* ═══ 无人机同帧按父合并 + 完工批量 ═══ */
{
  const before = worldOf(
    [summary({ id: "p", cwd: "F:/ws1" })],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["p"] }]
  );
  let prev = diffHiveEvents(null, before).baseline;
  prev.lastEmitAt = new Map();

  /* 同 tick 两个新 subagent 都挂父 p → 合并为 1 行「召唤了 2 个无人机」 */
  const tick = worldOf(
    [
      summary({ id: "p", cwd: "F:/ws1" }),
      summary({ id: "d1", origin: "subagent", parentId: "p", running: true, cwd: "F:/ws1" }),
      summary({ id: "d2", origin: "subagent", parentId: "p", running: true, cwd: "F:/ws1" })
    ],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["p", "d1", "d2"] }]
  );
  const r = diffHiveEvents(prev, { world: tick.world, workspaces: tick.workspaces, now: 1000 });
  const dronesNew = r.events.filter((e) => e.kind === EV_KIND.dronesNew);
  eq(dronesNew.length, 1, "同 tick 同父新无人机合并 1 行");
  eq(dronesNew[0].count, 2, "合并计数 x=2");
  eq(dronesNew[0].title, "one", "无人机召唤带父蜂所在巢名 one");
  prev = r.baseline;
  prev.lastEmitAt = new Map();

  /* 同 tick 两个无人机迁入 done → 1 行完工（批量） */
  const tickDone = worldOf(
    [
      summary({ id: "p", cwd: "F:/ws1" }),
      summary({ id: "d1", origin: "subagent", parentId: "p", completed: true, cwd: "F:/ws1" }),
      summary({ id: "d2", origin: "subagent", parentId: "p", completed: true, cwd: "F:/ws1" })
    ],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["p", "d1", "d2"] }]
  );
  const rDone = diffHiveEvents(prev, { world: tickDone.world, workspaces: tickDone.workspaces, now: 5000 });
  const dronesDone = rDone.events.filter((e) => e.kind === EV_KIND.dronesDone);
  eq(dronesDone.length, 1, "同 tick 同父无人机完工合并 1 行");
  eq(dronesDone[0].count, 2, "完工合并计数 x=2");
}

/* ═══ 低优先级：巢搬移 + 野蜂出现 ═══ */
{
  const before = worldOf(
    [summary({ id: "a", cwd: "F:/ws1" })],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
  );
  let prev = diffHiveEvents(null, before).baseline;
  /* 巢搬移：用 positions 强迁中心 */
  const moved = (() => {
    const snap = makeSnapshots({
      bees: [summary({ id: "a", cwd: "F:/ws1" })],
      items: [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
    });
    const derived = deriveWorld({ sessions: snap.sessions, workspaces: snap.workspaces, positions: { ws1: { q: 40, r: 0 } } });
    return { world: derived.world, workspaces: snap.workspaces };
  })();
  const rMove = diffHiveEvents(prev, { world: moved.world, workspaces: moved.workspaces, now: 1000 });
  ok(rMove.events.some((e) => e.kind === EV_KIND.nestMove), "巢搬移事件（低优先级）");
  ok(isLowPriority(EV_KIND.nestMove), "巢搬移标记低优先级");
  prev = rMove.baseline;

  /* 野蜂出现 */
  const wild = worldOf(
    [summary({ id: "a", cwd: "F:/ws1" }), summary({ id: "w", cwd: "F:/nowhere" })],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
  );
  const rWild = diffHiveEvents(prev, { world: wild.world, workspaces: wild.workspaces, now: 1500 });
  ok(rWild.events.some((e) => e.kind === EV_KIND.wildBee && e.sessionId === "w"), "野蜂出现事件（低优先级）");
  ok(isLowPriority(EV_KIND.wildBee), "野蜂出现标记低优先级");
}

/* ═══ 同键去重（CombatLogFeed.push） ═══ */
{
  const feed = new CombatLogFeed({ storage: null, now: () => 1 });
  ok(feed.push({ key: "k1", kind: "x", low: false }), "首次入队成功");
  ok(!feed.push({ key: "k1", kind: "x", low: false }), "同键去重丢弃");
  eq(feed.entries.length, 1, "缓冲仅 1 条");
}

/* ═══ 抖动阻尼：busy↔idle 抖动仅 1 行、help 穿透 ═══ */
{
  const base = worldOf(
    [summary({ id: "a", cwd: "F:/ws1" })],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
  );
  let prev = diffHiveEvents(null, base).baseline;

  /* a → busy（冷却外，发行） */
  const busy = worldOf(
    [summary({ id: "a", running: true, cwd: "F:/ws1" })],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
  );
  let r = diffHiveEvents(prev, { world: busy.world, workspaces: busy.workspaces, now: 1000 });
  eq(r.events.filter((e) => e.kind === EV_KIND.start).length, 1, "首迁移 busy 发行");
  prev = r.baseline;

  /* 冷却窗内 busy→idle（应只刷新基线不发） */
  const idle1 = worldOf(
    [summary({ id: "a", cwd: "F:/ws1" })],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
  );
  r = diffHiveEvents(prev, { world: idle1.world, workspaces: idle1.workspaces, now: 1500 });
  eq(r.events.length, 0, "冷却窗内 busy→idle 不发行");
  prev = r.baseline;

  /* 冷却窗内 idle→busy（仍不发） */
  const busy2 = worldOf(
    [summary({ id: "a", running: true, cwd: "F:/ws1" })],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
  );
  r = diffHiveEvents(prev, { world: busy2.world, workspaces: busy2.workspaces, now: 2000 });
  eq(r.events.length, 0, "冷却窗内 busy↔idle 抖动不刷屏");
  prev = r.baseline;

  /* 冷却窗内 → help（恒穿透） */
  const help = worldOf(
    [summary({ id: "a", pendingInteraction: "approval", running: true, cwd: "F:/ws1" })],
    [],
    [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
  );
  r = diffHiveEvents(prev, { world: help.world, workspaces: help.workspaces, now: 2100 });
  ok(r.events.some((e) => e.kind === EV_KIND.help), "冷却窗内 →help 即时穿透");
}

/* ═══ 环形覆写 ═══ */
{
  const feed = new CombatLogFeed({ storage: null, cap: 3, now: () => 1 });
  feed.push({ key: "a", kind: "x", low: false });
  feed.push({ key: "b", kind: "x", low: false });
  feed.push({ key: "c", kind: "x", low: false });
  feed.push({ key: "d", kind: "x", low: false });
  eq(feed.entries.map((e) => e.key), ["b", "c", "d"], "满后覆写最旧");
  eq(feed.entries.length, 3, "缓冲不超容量");
  eq(COMBAT_LOG_CAP, 200, "默认容量 200");
}

/* ═══ 未读计数（折叠累计、展开清零） ═══ */
{
  const feed = new CombatLogFeed({ storage: null, now: () => 1 });
  feed.push({ key: "a", kind: "x", low: false });
  eq(feed.unread, 0, "展开态入队不累计未读");
  feed.setCollapsed(true);
  feed.push({ key: "b", kind: "x", low: false });
  feed.push({ key: "c", kind: "x", low: false });
  eq(feed.unread, 2, "折叠期累计未读");
  feed.setCollapsed(false);
  eq(feed.unread, 0, "展开清零未读");
}

/* ═══ pushReceipt 回执行（中性） ═══ */
{
  const feed = new CombatLogFeed({ storage: null, now: () => 1 });
  feed.pushReceipt("已召唤新蜂");
  eq(feed.entries.length, 1, "回执行入队");
  eq(feed.entries[0].kind, EV_KIND.receipt, "回执 kind = receipt");
  eq(feed.entries[0].text, "已召唤新蜂", "回执正文保留原文案");
}

/* ═══ 页关页开不重放（基线持久于 feed 实例） ═══ */
{
  const worldFactory = () =>
    worldOf(
      [summary({ id: "a", cwd: "F:/ws1" })],
      [],
      [{ workspaceId: "ws1", path: "F:/ws1", title: "one", sessionIds: ["a"] }]
    );
  const first = worldFactory();
  const feed = new CombatLogFeed({ storage: null, now: () => 1000 });
  feed.ingest({ world: first.world, workspaces: first.workspaces });
  eq(feed.entries.length, 0, "首次喂入只建基线");

  /* 同世界再次喂入（模拟页关页开）→ 不重放 */
  const again = worldFactory();
  feed.ingest({ world: again.world, workspaces: again.workspaces });
  eq(feed.entries.length, 0, "页关页开不重放存量蜂");
}

/* ═══ MIGRATE_COOLDOWN_MS 常量可测 ═══ */
eq(MIGRATE_COOLDOWN_MS, 2000, "迁移冷却窗 2000ms");

/* ═══ 持久化：跨重载恢复近期报告 + 手动清空 + 自动超量清理 ═══ */
{
  const makeStorage = () => {
    const m = new Map();
    return {
      getItem: (k) => (m.has(k) ? m.get(k) : null),
      setItem: (k, v) => m.set(k, String(v)),
      removeItem: (k) => m.delete(k)
    };
  };
  const storage = makeStorage();

  /* 入队 → 持久化；新 feed 从同一 storage 恢复近期报告 */
  const a = new CombatLogFeed({ cap: 200, now: () => 1000, storage });
  a.push({ key: "k1", kind: EV_KIND.start, low: false });
  a.push({ key: "k2", kind: EV_KIND.done, low: false });
  eq(a.entries.length, 2, "入队 2 条");

  const b = new CombatLogFeed({ cap: 200, now: () => 2000, storage });
  eq(b.entries.length, 2, "新实例恢复近期报告（跨重载保留）");
  eq(b.entries[0].key, "k1", "恢复顺序保持（最旧在前）");
  ok(b.seq >= 2, "seq 续用历史最大值，不与旧 seq 冲突");

  /* 手动清空：内存 + 持久化一并清 */
  b.clear();
  eq(b.entries.length, 0, "clear 清空内存缓冲");
  eq(b.unread, 0, "clear 清零未读");
  const c = new CombatLogFeed({ cap: 200, now: () => 3000, storage });
  eq(c.entries.length, 0, "clear 后新实例恢复为空（持久化已清）");

  /* 超量自动清理：cap=3 时第 4 条覆写最旧，且持久化同步裁剪 */
  const d = new CombatLogFeed({ cap: 3, now: () => 4000, storage });
  d.push({ key: "a", kind: EV_KIND.start, low: false });
  d.push({ key: "b", kind: EV_KIND.start, low: false });
  d.push({ key: "c", kind: EV_KIND.start, low: false });
  d.push({ key: "d", kind: EV_KIND.start, low: false });
  eq(d.entries.map((e) => e.key), ["b", "c", "d"], "超 cap 覆写最旧（自动清理）");
  const e = new CombatLogFeed({ cap: 3, now: () => 5000, storage });
  eq(e.entries.map((x) => x.key), ["b", "c", "d"], "持久化随超量裁剪同步（重载仍只有 3 条）");
}

console.log("ALL COMBAT-LOG SMOKE TESTS PASSED");
