/**
 * 蜂模型派生层冒烟测试（design.md D3 语义）：
 *  - blank 过滤、归档 → 蜜杯、状态优先级（琥珀 > 蓝 > 绿 > 灰白）；
 *  - 子代理 → 无人机挂父蜂；父蜂缺失降级停驻；
 *  - 未分组 → 野蜂；后代运行聚合。
 * 运行：node test/bee-model-smoke.mjs
 */
import { deriveWorld, stateOf, BEE_STATE, HOVER_HEIGHT, tipFaceOf, sessionsBriefOf } from "../src/bee-model.mjs";
import { BEE_RADIUS, SQRT3 } from "../src/hex.mjs";
import { BUSY_WANDER, BUSY_WANDER_MAX } from "../src/hive/bees.mjs";

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

function summary(overrides) {
  return {
    id: overrides.id,
    displayTitle: overrides.title ?? overrides.id,
    blank: false,
    running: false,
    updatedAt: 1000,
    ...overrides
  };
}

function fixture() {
  const byId = {};
  const ids = [];
  const add = (s) => {
    byId[s.id] = s;
    ids.push(s.id);
  };
  add(summary({ id: "s-idle", cwd: "F:/a" }));
  add(summary({ id: "s-busy", running: true, cwd: "F:/a" }));
  add(summary({ id: "s-help", pendingInteraction: "approval", running: true, cwd: "F:/a" })); // 琥珀优先
  add(summary({ id: "s-done", completed: true, cwd: "F:/b" }));
  add(summary({ id: "s-blank", blank: true, cwd: "F:/a" })); // 不渲染
  add(summary({ id: "s-arch", cwd: "F:/a" })); // 归档（在 workspaces.archivedSessionIds）
  add(summary({ id: "s-wild", cwd: "F:/nowhere" })); // 未分组
  add(summary({ id: "s-sub", origin: "subagent", parentId: "s-busy", running: true, cwd: "F:/a" })); // 无人机
  add(summary({ id: "s-orphan", origin: "subagent", parentId: "s-blank", cwd: "F:/b" })); // 父空白 → 降级
  const sessions = { ids, byId, current: "s-idle" };
  const workspaces = {
    items: [
      { workspaceId: "ws-a", path: "F:/a", title: "a", sessionIds: ["s-idle", "s-busy", "s-help", "s-blank", "s-arch", "s-sub"] },
      { workspaceId: "ws-b", path: "F:/b", title: "b", sessionIds: ["s-done", "s-orphan"] }
    ],
    archivedSessionIds: ["s-arch"]
  };
  return { sessions, workspaces };
}

/* ── 状态归并 ── */
eq(stateOf({ pendingInteraction: "approval" }), BEE_STATE.help, "琥珀优先于蓝");
eq(stateOf({ pendingInteraction: "question", running: true }), BEE_STATE.help, "question 也是琥珀");
eq(stateOf({ running: true }), BEE_STATE.busy, "蓝");
eq(stateOf({ completed: true }), BEE_STATE.done, "绿");
eq(stateOf({}), BEE_STATE.idle, "灰白");

/* ── 派生 ── */
const derived = deriveWorld({ sessions: fixture().sessions, workspaces: fixture().workspaces, positions: {} });
const world = derived.world;
eq(world.studios.length, 2, "两个工作室");
ok(world.occupancy.size >= 38, "两个 3 层补丁占据图 ≥ 38 格");

const studioA = world.studios.find((s) => s.workspaceId === "ws-a");
const studioB = world.studios.find((s) => s.workspaceId === "ws-b");
const beeIds = (studio) => studio.bees.map((b) => b.sessionId);

ok(!beeIds(studioA).includes("s-blank"), "blank 会话不出蜂");
ok(!beeIds(studioA).includes("s-arch"), "归档会话不进巢");
ok(beeIds(studioA).includes("s-idle"), "普通蜂在巢");
eq(studioA.cups.map((c) => c.sessionId)[0], "s-arch", "归档会话化蜜杯");
ok(beeIds(studioA).includes("s-sub") === false, "子代理不作为独立工蜂");
const busyBee = studioA.bees.find((b) => b.sessionId === "s-busy");
eq(busyBee.drones.map((d) => d.sessionId)[0], "s-sub", "子代理挂父蜂为无人机");
eq(busyBee.state, BEE_STATE.busy, "有运行后代的父蜂保持蓝");
ok(studioA.bees.find((b) => b.sessionId === "s-help").state === BEE_STATE.help, "求助琥珀");
const orphanBee = studioB.bees.find((b) => b.sessionId === "s-orphan");
ok(orphanBee, "父蜂未渲染的无人机降级为蜂位停驻");
eq(world.wildBees.map((b) => b.sessionId)[0], "s-wild", "未分组会话进野蜂箱");

/* 蜂位（1 蜂 1 格，格位在补丁内） */
for (const studio of world.studios) {
  for (const bee of studio.bees) {
    ok(Number.isFinite(bee.pos.x) && Number.isFinite(bee.pos.z), "蜂有世界坐标");
  }
}

/* ── 布局持久化接入：positions 被尊重 ── */
const derived2 = deriveWorld({
  sessions: fixture().sessions,
  workspaces: fixture().workspaces,
  positions: { "ws-a": { q: 40, r: 0 }, "ws-b": { q: 55, r: 0 } }
});
eq(derived2.world.studios.find((s) => s.workspaceId === "ws-a").center.q, 40, "持久化中心坐标被尊重");

/* ── 稳定性：同一快照重复派生，格位不变 ── */
const again = deriveWorld({ sessions: fixture().sessions, workspaces: fixture().workspaces, positions: {}, studioState: derived.studioState });
const before = derived.world.studios.find((s) => s.workspaceId === "ws-a").bees.map((b) => [b.sessionId, b.cellIndex]);
const after = again.world.studios.find((s) => s.workspaceId === "ws-a").bees.map((b) => [b.sessionId, b.cellIndex]);
eq(JSON.stringify(after), JSON.stringify(before), "重复派生格位稳定（粘性蜂位）");

/* ── 场景比例尺关系（worker-scale-normalization）：锚点常量 vs 晶格几何 ── */
eq(BEE_RADIUS, 0.8, "比例尺锚点：工蜂包围球半径 = 0.8 × 瓦片边长");
ok(2 * BEE_RADIUS < SQRT3, "相邻蜂球不穿插：2×BEE_RADIUS < 相邻格心距 √3");
ok(BEE_RADIUS < SQRT3 / 2, "蜂球收于瓦片内切圆：BEE_RADIUS < √3/2 ≈ 0.866");
ok(SQRT3 / 2 - BEE_RADIUS >= 0.06, "蜂球距瓦片边 ≥ 0.06 瓦片边长");
/* 悬停高度 = BEE_RADIUS 倍率（派生层产出，scene 消费同一常量，无独立魔数） */
eq(HOVER_HEIGHT, 1.0 * BEE_RADIUS, "基础悬停高度 = 1.0 × BEE_RADIUS");
eq(studioA.bees.find((b) => b.sessionId === "s-idle").y, HOVER_HEIGHT, "派生蜂悬停高度使用 HOVER_HEIGHT");
/* 忙碌贴格低巡：徘徊幅度 ≤ 瓦片内切圆半径 − 蜂包围球半径（design.md D4 上界公式） */
ok(BUSY_WANDER <= BUSY_WANDER_MAX, "忙碌徘徊幅度 ≤ 内切圆 − 蜂半径");
ok(BEE_RADIUS + BUSY_WANDER < SQRT3 / 2, "忙碌蜂体最远触达仍收于内切圆（含浮动余量）");

/* ── hive-interaction-polish 1.1/1.2：workspaceId/tipFace 透传 + 召唤边双索引 ── */

/* 1.1 workspaceId 透传：工蜂（巢）、无人机（父巢）、降级停驻蜂（所在巢） */
eq(busyBee.workspaceId, "ws-a", "工蜂记录透传 workspaceId");
ok(busyBee.drones.every((d) => d.workspaceId === "ws-a"), "无人机记录自父蜂透传 workspaceId");
eq(orphanBee.workspaceId, "ws-b", "降级停驻蜂携带所在巢 workspaceId");

/* 无人机降级 tipFace：会话数/token/DPS 置 null（呈现 -），workspaceId 保留 */
eq(JSON.stringify(busyBee.drones[0].tipFace), JSON.stringify({ tokens: null, dps: null, sessions: null, workspaceId: "ws-a" }), "无人机降级 tipFace 口径");
eq(JSON.stringify(orphanBee.tipFace), JSON.stringify({ tokens: null, dps: null, sessions: null, workspaceId: "ws-b" }), "降级停驻蜂同口径");

/* 1.2 tipFace 装配（工蜂）：token 四桶合计 / 平均 DPS 预计算 / 巢内会话数 */
{
  const byId = {};
  const ids = ["s-tok", "s-plain"];
  byId["s-tok"] = summary({
    id: "s-tok",
    cwd: "F:/a",
    projectionValues: {
      tokenUsage: { uncachedInput: 100, output: 200, cacheRead: 300, cacheWrite: 400 },
      sessionStats: { decodeTokens: 2400, decodeMs: 200000 }
    }
  });
  byId["s-plain"] = summary({ id: "s-plain", cwd: "F:/a" });
  const w = deriveWorld({ sessions: { ids, byId, current: "s-tok" }, workspaces: { items: [{ workspaceId: "ws-a", path: "F:/a", title: "a", sessionIds: ids }], archivedSessionIds: [] }, positions: {} }).world;
  const tok = w.studios[0].bees.find((b) => b.sessionId === "s-tok");
  eq(tok.tipFace.tokens, 1000, "token 四桶合计 100/200/300/400 → 1000");
  eq(tok.tipFace.dps, 12, "平均 DPS = round(2400 ÷ 200000 × 1000) = 12 t/s");
  eq(tok.tipFace.sessions, 2, "巢内会话数 = 巢内工蜂计数（含自身）");
  eq(tok.tipFace.workspaceId, "ws-a", "tipFace 携带 workspaceId");
  const plain = w.studios[0].bees.find((b) => b.sessionId === "s-plain");
  eq(plain.tipFace.tokens, null, "tokenUsage 缺失（投影缓存未命中）→ null（呈现 -）");
  eq(plain.tipFace.dps, null, "sessionStats 缺失 → null（呈现 -）");
}

/* tipFaceOf 边界：除零 / 样本 <1s / 非数值桶 */
{
  eq(tipFaceOf({ projectionValues: { sessionStats: { decodeTokens: 100, decodeMs: 0 } } }).dps, null, "decodeMs = 0 → null（除零回退）");
  eq(tipFaceOf({ projectionValues: { sessionStats: { decodeTokens: 100, decodeMs: 500 } } }).dps, null, "样本不足 1 秒 → null");
  eq(tipFaceOf({ projectionValues: { sessionStats: { decodeMs: 2000 } } }).dps, null, "decodeTokens 缺失 → null");
  eq(tipFaceOf({ projectionValues: { tokenUsage: { uncachedInput: 5 } } }).tokens, 5, "缺失桶按 0 计（5）");
}

/* 1.2 召唤边双索引：child 侧 summonedBy 单值 + parent 侧 summonedTo[] 数组 + 未知边忽略 */
{
  const f = fixture();
  const w2 = deriveWorld({
    sessions: f.sessions,
    workspaces: f.workspaces,
    positions: {},
    summonEdges: {
      "s-help": { parentId: "s-idle", at: 1 }, // 工蜂 → 工蜂
      "s-busy": { parentId: "s-sub", at: 2 }, // 无人机召唤者（边照常装配）
      "s-ghost": { parentId: "s-idle", at: 3 }, // child 未渲染 → 忽略
      "s-idle": { parentId: "s-ghost", at: 4 }, // parent 未渲染 → 忽略
      "s-wild": { parentId: "s-idle", at: 5 } // 野蜂不渲染 → 忽略
    }
  }).world;
  const studioA2 = w2.studios.find((s) => s.workspaceId === "ws-a");
  const bee2 = (id) => studioA2.bees.find((b) => b.sessionId === id);
  const idle2 = bee2("s-idle");
  const help2 = bee2("s-help");
  const busy2 = bee2("s-busy");
  eq(help2.summonedBy, "s-idle", "child 侧 summonedBy 单值");
  ok(Array.isArray(idle2.summonedTo) && idle2.summonedTo.includes("s-help"), "parent 侧 summonedTo[] 聚合");
  eq(idle2.summonedTo.length, 1, "未渲染端点的边 SHALL NOT 计入 summonedTo");
  eq(idle2.summonedBy, undefined, "parent 未渲染的边忽略（不产生 summonedBy）");
  eq(busy2.summonedBy, "s-sub", "无人机召唤者边照常装配（child 侧）");
  ok(busy2.drones[0].summonedTo?.includes("s-busy"), "无人机召唤者侧 summonedTo（连线层正交消费）");
  /* 基线：无 summonEdges 入参 → 记录无召唤字段（旧宿主半区/旧文档静默降级） */
  eq(studioA.bees.find((b) => b.sessionId === "s-help").summonedBy, undefined, "无边入参 → 记录无 summonedBy（静默降级）");
  eq(beeIds(studioA).includes("s-idle"), true, "双索引不改变渲染装配");
}

/* 1.4 sessionsBriefOf：概要条数据面（详见 test/brief-bar-smoke.mjs 全量真值表） */
eq(sessionsBriefOf(null), null, "会话缺失 → null（呈现层隐藏整条 bar）");

console.log("ALL BEE-MODEL SMOKE TESTS PASSED");
