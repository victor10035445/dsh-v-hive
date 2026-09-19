/**
 * 性能预算冒烟测试（M4 尖刺 9.3 的无头部分，design.md D11；render-perf-optimization 6.2 定稿）：
 *  - 规模目标：200 巢 / 1000+ 蜂的压力规模（千蜂 fixture 固化）——「蜂模型」派生与
 *    落位耗时、内存纪律（镜像反复重建，重建而非追加）；
 *  - 分桶预算断言（design.md D1/D5，任务 1.1 基线定标）：
 *      · 全近档（无相机入参 = 既有全量口径）单帧写入 < 4ms（基线实测 0.203ms 的
 *        20 倍余量，与既有 200 蜂 <4ms 口径的余量一致）；
 *      · 远景相机（T2 主导）单帧写入 < 2ms 且 < 全近档实测的 50%（相对断言跨机器稳定）
 *        ——帧成本 SHALL 随可见集而非全集缩放（spec「性能与体验基线」）；
 *      · 迁移沿（远景 → 近景切档）后三桶拾取并集覆盖全部蜂且无重复（槽位无错位/泄漏）。
 *  - 逐帧成本：蜂层实例矩阵/颜色写入（three 数学层，Node 可跑）——渲染侧为
 *    3P+2 个 InstancedMesh draw call（P=部件数，与规模无关），60fps 帧预算由填充率
 *    与驱动决定，实机帧率留验收走查确认。
 *  - 事件路径预算（hive-render-storm-fix 1.2/1.3）：含无人机子代理的压力规模
 *    （父蜂数 0/200/800 三档）单次 deriveWorld 预算断言；行为探针（1.4）固化
 *    归档中间节点遍历可达性与 parentId 成环收敛（explore.md §6）。
 * 运行：node --expose-gc test/perf-smoke.mjs
 */
import { deriveWorld } from "../src/bee-model.mjs";
import { placeStudios } from "../src/layout.mjs";
import { BeeLayer, TIER_NEAR, TIER_MID, TIER_FAR } from "../src/hive/bees.mjs";
import { LinkLayer } from "../src/hive/links.mjs";
import * as THREE from "three";

const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

function megaFixture(studioCount, beesPerStudio) {
  const byId = {};
  const ids = [];
  const items = [];
  const archived = [];
  for (let w = 0; w < studioCount; w++) {
    const wsId = "ws-" + w;
    const sessionIds = [];
    for (let b = 0; b < beesPerStudio; b++) {
      const id = "s-" + w + "-" + b;
      sessionIds.push(id);
      ids.push(id);
      byId[id] = {
        id,
        displayTitle: "会话 " + id,
        blank: false,
        running: b % 3 === 0,
        completed: b % 5 === 0,
        pendingInteraction: b % 7 === 0 ? "approval" : undefined,
        cwd: "F:/proj-" + w,
        updatedAt: Date.now() - b * 1000,
        projectionValues: b % 4 === 0 ? { todos: [{ status: "completed" }, { status: "pending" }, { status: "completed" }] } : undefined
      };
    }
    // 每巢再挂 1 只归档蜜 + 1 只子代理
    const archId = "s-" + w + "-arch";
    sessionIds.push(archId);
    ids.push(archId);
    byId[archId] = { id: archId, displayTitle: archId, blank: false, running: false, cwd: "F:/proj-" + w, updatedAt: 1 };
    archived.push(archId);
    const subId = "s-" + w + "-sub";
    ids.push(subId);
    byId[subId] = { id: subId, displayTitle: subId, blank: false, running: true, origin: "subagent", parentId: sessionIds[0], cwd: "F:/proj-" + w, updatedAt: 2 };
    items.push({ workspaceId: wsId, path: "F:/proj-" + w, title: "proj-" + w, sessionIds });
  }
  // 野蜂数只
  for (let i = 0; i < 6; i++) {
    const id = "s-wild-" + i;
    ids.push(id);
    byId[id] = { id, displayTitle: id, blank: false, running: i % 2 === 0, cwd: "F:/nowhere", updatedAt: 3 };
  }
  return {
    sessions: { ids, byId, current: ids[0] },
    workspaces: { items, archivedSessionIds: archived }
  };
}

const STUDIO_COUNT = 200; // 千蜂压力规模（spec「性能与体验基线」：约 200 巢 / 1000 蜜蜂）
const BEES_PER_STUDIO = 4; // 200 巢 × 4 蜂 + 归档/子代理/野蜂 ≈ 1200+ 会话
const fixture = megaFixture(STUDIO_COUNT, BEES_PER_STUDIO);
const beeCount = fixture.sessions.ids.length;
console.log(`fixture: ${STUDIO_COUNT} 巢 / ${beeCount} 会话`);

/* ── 落位：200 巢螺旋放置 ── */
const entries = Array.from({ length: STUDIO_COUNT }, (_, i) => ({ workspaceId: "ws-" + i, layer: 3 }));
let t0 = performance.now();
const { placements } = placeStudios(entries, {});
const placeMs = performance.now() - t0;
console.log(`placeStudios(${STUDIO_COUNT}): ${placeMs.toFixed(1)}ms`);
ok(placeMs < 4000, `${STUDIO_COUNT} 巢落位应在秒级内（实测 ${placeMs.toFixed(1)}ms）`);
ok(placements.size === STUDIO_COUNT, "全部落位");

const positions = Object.fromEntries([...placements]);
positions["ws-0"] = { q: 0, r: 0 };

/* ── 派生：稳态（全保存位）重建耗时 ── */
let studioState = new Map();
const once = deriveWorld({ sessions: fixture.sessions, workspaces: fixture.workspaces, positions, studioState });
studioState = once.studioState;
const saved = { ...positions, ...Object.fromEntries(once.world.studios.map((s) => [s.workspaceId, s.center])) };

t0 = performance.now();
const steady = deriveWorld({ sessions: fixture.sessions, workspaces: fixture.workspaces, positions: saved, studioState });
const deriveMs = performance.now() - t0;
console.log(`deriveWorld 稳态重建: ${deriveMs.toFixed(1)}ms`);
ok(steady.world.studios.length === STUDIO_COUNT, `${STUDIO_COUNT} 巢派生`);
const totalBees = steady.world.studios.reduce((n, s) => n + s.bees.length, 0);
ok(totalBees >= STUDIO_COUNT * BEES_PER_STUDIO, `蜂数 ${totalBees} ≥ ${STUDIO_COUNT * BEES_PER_STUDIO}`);
ok(steady.world.wildBees.length === 6, "野蜂 6 只");
// 每巢 1 蜜杯
ok(steady.world.studios.every((s) => s.cups.length === 1), "每巢 1 蜜杯");
// 派生层数：4 蜂 → 3 层（19 格 ≥ 4）
ok(steady.world.studios.every((s) => s.layer === 3), "低蜂群保持 3 层");

/* ── 内存纪律：反复重建（dispose 语义在宿主端由 rebuild 覆盖） ── */
if (globalThis.gc) {
  globalThis.gc();
  const base = process.memoryUsage().heapUsed;
  for (let i = 0; i < 300; i++) {
    const r = deriveWorld({ sessions: fixture.sessions, workspaces: fixture.workspaces, positions: saved, studioState });
    studioState = r.studioState;
    if (i % 100 === 0) globalThis.gc();
  }
  globalThis.gc();
  const after = process.memoryUsage().heapUsed;
  const growth = (after - base) / 1024 / 1024;
  console.log(`300 次重建堆增长: ${growth.toFixed(2)}MB（基线 ${(base / 1048576).toFixed(1)}MB）`);
  ok(growth < 24, `重建不泄漏（实测 +${growth.toFixed(2)}MB < 24MB 容忍带）`);
} else {
  console.log("（未启用 --expose-gc，跳过堆增长断言）");
}

/* ── 事件路径预算（hive-render-storm-fix 1.2/1.3）：含无人机子代理的压力规模 fixture
   （200 巢 × 4 蜂 × 1 无人机/蜂 + 各 1 孙代），派生父蜂数 D = 0 / 200 / 800 三档变体
   （0 档移除子代理行）。索引化前 deriveWorld 为 D×N×深度 全表扫描（explore.md 实测
   同规模秒级，D=800 达 606ms）；根修后单次派生 SHALL 低于绝对预算上限（秒级实测的
   1/10，留 10 倍余量），且成本随 Σ后代数（随 D 线性）而非 D×N 乘积增长
   （800 档 ≤ 200 档 × 3，spec「事件路径派生预算」场景）。 ── */
function droneStressFixture(parentBees) {
  const byId = {};
  const ids = [];
  const items = [];
  for (let w = 0; w < STUDIO_COUNT; w++) {
    const wsId = "ws-" + w;
    const sessionIds = [];
    for (let b = 0; b < BEES_PER_STUDIO; b++) {
      const id = "s-" + w + "-" + b;
      sessionIds.push(id);
      ids.push(id);
      byId[id] = {
        id,
        displayTitle: "会话 " + id,
        blank: false,
        running: b % 3 === 0,
        completed: b % 5 === 0,
        cwd: "F:/proj-" + w,
        updatedAt: Date.now() - b * 1000
      };
      const droneIndex = w * BEES_PER_STUDIO + b;
      if (droneIndex < parentBees) {
        const droneId = id + "-d";
        ids.push(droneId);
        byId[droneId] = { id: droneId, displayTitle: droneId, blank: false, running: droneIndex % 2 === 0, origin: "subagent", parentId: id, cwd: "F:/proj-" + w, updatedAt: 4 };
        const grandId = droneId + "-g";
        ids.push(grandId);
        byId[grandId] = { id: grandId, displayTitle: grandId, blank: false, running: droneIndex % 2 === 1, origin: "subagent", parentId: droneId, cwd: "F:/proj-" + w, updatedAt: 5 };
      }
    }
    items.push({ workspaceId: wsId, path: "F:/proj-" + w, title: "proj-" + w, sessionIds });
  }
  return { sessions: { ids, byId, current: ids[0] }, workspaces: { items, archivedSessionIds: [] } };
}

const EVENT_BUDGET_MS = 6; // explore.md 同规模秒级实测（606ms）的 1/10 → 预算留 10 倍余量
const stress800 = droneStressFixture(STUDIO_COUNT * BEES_PER_STUDIO);
ok(stress800.sessions.ids.length >= 2000, `无人机压力 fixture ≥2000 会话（800 档实测 ${stress800.sessions.ids.length}）`);
const tierMedianMs = {};
for (const [parentBees, stress] of [
  [0, droneStressFixture(0)],
  [200, droneStressFixture(200)],
  [800, stress800]
]) {
  let stressState = new Map();
  const warm = deriveWorld({ sessions: stress.sessions, workspaces: stress.workspaces, positions: saved, studioState: stressState });
  stressState = warm.studioState;
  ok(warm.world.studios.length === STUDIO_COUNT, `D=${parentBees} 档 ${STUDIO_COUNT} 巢派生`);
  const samples = [];
  for (let i = 0; i < 7; i++) {
    const t = performance.now();
    const r = deriveWorld({ sessions: stress.sessions, workspaces: stress.workspaces, positions: saved, studioState: stressState });
    samples.push(performance.now() - t);
    stressState = r.studioState;
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  tierMedianMs[parentBees] = median;
  console.log(
    `deriveWorld 事件路径 D=${parentBees}（${stress.sessions.ids.length} 会话）: ` +
    `中位 ${median.toFixed(2)}ms / 最大 ${sorted[sorted.length - 1].toFixed(2)}ms [${samples.map((s) => s.toFixed(1)).join(", ")}]`
  );
  ok(median < EVENT_BUDGET_MS, `D=${parentBees} 档单次 deriveWorld < ${EVENT_BUDGET_MS}ms（实测中位 ${median.toFixed(2)}ms）`);
}
ok(
  tierMedianMs[800] <= tierMedianMs[200] * 3,
  `800 档 ≤ 200 档 × 3（成本随 Σ后代数而非 D×N 乘积增长：${tierMedianMs[800].toFixed(2)}ms vs ${tierMedianMs[200].toFixed(2)}ms × 3）`
);

/* ── 行为探针（hive-render-storm-fix 1.4，固化 explore.md §6 复审探针）：
   活蜂 A → 归档子代理 B → running C，且 A 另有在场 running 子代理 Y（Y 下再挂
   嵌套无人机 Z，与探针 v2 一致）。断言：walk 穿过归档中间节点 B（C 计入）但 B
   本身被归档过滤排除；B 仅以蜜杯呈现；Y 照常挂载为 A 的无人机；C/Z 按既有语义
   降级停驻。 ── */
{
  const byId = {};
  const ids = ["s-p-A", "s-p-B", "s-p-C", "s-p-Y", "s-p-Z"];
  byId["s-p-A"] = { id: "s-p-A", displayTitle: "A", blank: false, running: false, updatedAt: 10 };
  /* B：归档子代理（running 置真——证明归档过滤在计数处生效，且 B 仍是遍历中途的边） */
  byId["s-p-B"] = { id: "s-p-B", displayTitle: "B", blank: false, running: true, origin: "subagent", parentId: "s-p-A", updatedAt: 11 };
  byId["s-p-C"] = { id: "s-p-C", displayTitle: "C", blank: false, running: true, origin: "subagent", parentId: "s-p-B", updatedAt: 12 };
  byId["s-p-Y"] = { id: "s-p-Y", displayTitle: "Y", blank: false, running: true, origin: "subagent", parentId: "s-p-A", updatedAt: 13 };
  byId["s-p-Z"] = { id: "s-p-Z", displayTitle: "Z", blank: false, running: true, origin: "subagent", parentId: "s-p-Y", updatedAt: 14 };
  const probe = {
    sessions: { ids, byId, current: "s-p-A" },
    workspaces: {
      items: [{ workspaceId: "ws-p", path: "F:/probe", title: "probe", sessionIds: ["s-p-A", "s-p-B", "s-p-C", "s-p-Z"] }],
      archivedSessionIds: ["s-p-B"]
    }
  };
  const probeWorld = deriveWorld({ sessions: probe.sessions, workspaces: probe.workspaces, positions: { "ws-p": { q: 0, r: 0 } }, studioState: new Map() }).world;
  const studio = probeWorld.studios[0];
  const beeA = studio.bees.find((b) => b.sessionId === "s-p-A");
  ok(beeA, "探针：活蜂 A 渲染为工蜂");
  eq2(beeA.runningDescendants, 3, "A.runningDescendants === 3（walk 穿过归档中间节点 B：C/Y/Z 计入，B 被归档过滤排除——可达性保持）");
  ok(beeA.drones.some((d) => d.sessionId === "s-p-Y"), "A.drones 含在场 running 子代理 Y");
  ok(studio.cups.some((c) => c.sessionId === "s-p-B"), "归档子代理 B 仅以蜜杯呈现");
  ok(!studio.bees.some((b) => b.sessionId === "s-p-B"), "B 不渲染为蜂（beeById 不含归档行）");
  ok(!beeA.drones.some((d) => d.sessionId === "s-p-B"), "B 不挂载为无人机");
  ok(!probeWorld.wildBees.some((b) => b.sessionId === "s-p-B"), "B 不入野蜂箱");
  const standIns = studio.bees.filter((b) => b.droneStandIn).map((b) => b.sessionId);
  ok(standIns.includes("s-p-C") && standIns.includes("s-p-Z"), `C（父 B 未渲染）/Z（父 Y 为无人机）降级停驻（实测 ${standIns.join("、")}）`);
  ok(!probeWorld.wildBees.some((b) => b.sessionId === "s-p-C" || b.sessionId === "s-p-Z"), "C/Z 按账号归巢停驻，不入野蜂箱");
}
{
  /* parentId 成环（畸形数据）：聚合 SHALL 收敛（不栈溢出、不死循环），环上互指不重复
     计数——X.parentId = Y、Y.parentId = X，X 另有子代理 D 使 X 成为聚合根。 */
  const byId = {};
  const ids = ["s-c-X", "s-c-Y", "s-c-D"];
  byId["s-c-X"] = { id: "s-c-X", displayTitle: "X", blank: false, running: true, parentId: "s-c-Y", updatedAt: 20 };
  byId["s-c-Y"] = { id: "s-c-Y", displayTitle: "Y", blank: false, running: false, parentId: "s-c-X", updatedAt: 21 };
  byId["s-c-D"] = { id: "s-c-D", displayTitle: "D", blank: false, running: true, origin: "subagent", parentId: "s-c-X", updatedAt: 22 };
  const cyc = {
    sessions: { ids, byId, current: "s-c-X" },
    workspaces: { items: [{ workspaceId: "ws-c", path: "F:/cyc", title: "cyc", sessionIds: ["s-c-X", "s-c-Y"] }], archivedSessionIds: [] }
  };
  const cycWorld = deriveWorld({ sessions: cyc.sessions, workspaces: cyc.workspaces, positions: { "ws-c": { q: 40, r: 0 } }, studioState: new Map() }).world;
  const beeX = cycWorld.studios[0].bees.find((b) => b.sessionId === "s-c-X");
  ok(beeX, "成环 fixture：X 正常渲染为工蜂");
  eq2(beeX.runningDescendants, 1, "parentId 成环聚合正常收敛（X 的运行后代 = D，环边 X↔Y 不重复计数、不栈溢出）");
  ok(beeX.drones.some((d) => d.sessionId === "s-c-D"), "成环 fixture：X 的子代理 D 照常挂载为无人机");
}

/* ── 逐帧成本：千蜂 BeeLayer 分桶预算（three 数学层，无 GL） ── */
const scene = { add() {}, remove() {} };
const layer = new BeeLayer(scene, { reduced: false });
const bees = [];
let originBee = null;
for (const studio of steady.world.studios) {
  for (const bee of studio.bees) {
    const item = {
      id: bee.sessionId, x: bee.pos.x, z: bee.pos.z, y: bee.y,
      state: bee.state, scale: 1, droneOf: null, phase: 0.5
    };
    bees.push(item);
    if (!originBee && Math.hypot(bee.pos.x, bee.pos.z) < 2) originBee = item;
  }
  for (const bee of studio.bees) {
    if (bee.drones.length === 0) continue;
    for (const drone of bee.drones) {
      bees.push({
        id: drone.sessionId, x: bee.pos.x, z: bee.pos.z, y: bee.y,
        state: drone.state, scale: 0.55, droneOf: { x: bee.pos.x, y: bee.y, z: bee.pos.z },
        droneIndex: 0, droneCount: 1, phase: 0.3
      });
    }
  }
}
ok(bees.length >= 1000, `压力规模蜂数 ${bees.length} ≥ 1000（千蜂 fixture）`);
layer.setBees(bees, new Map());
ok(layer.renderList.length === bees.length, "实例列表覆盖全部蜂");
const FRAMES = 200;
for (let f = 0; f < 20; f++) layer.frame(16); // JIT 预热（与任务 1.1 基线口径一致）

/* (a) 全近档：无相机入参 = 既有全量口径（未接线调用点兼容；成本上界 = 全集） */
t0 = performance.now();
for (let f = 0; f < FRAMES; f++) layer.frame(16);
const frameMsAll = (performance.now() - t0) / FRAMES;
console.log(`BeeLayer.frame 全近档（${bees.length} 蜂）: ${frameMsAll.toFixed(3)}ms/帧 × ${FRAMES} 帧`);
ok(frameMsAll < 4, `千蜂全近档单帧写入 < 4ms（实测 ${frameMsAll.toFixed(3)}ms；任务 1.1 基线 0.203ms 的 20 倍余量）`);

/* (b) 远景相机（T2 主导）：迁移沿一次性重排后，帧成本随可见集收缩 */
const farCam = { x: 4000, y: 0, z: 4000 }; // 距全场任意蜂 > LOD_MID + 滞回
for (let f = 0; f < 5; f++) layer.frame(16, farCam); // 迁移沿（单帧重排，不计入预算）
const buckets = layer.buckets;
eq2(buckets.counts[TIER_NEAR], 0, "远景相机近档清空");
eq2(buckets.counts[TIER_MID], 0, "远景相机中档清空");
eq2(buckets.slots.size, bees.length, "整群单帧完成 T2 冻结重排（槽位表无泄漏）");
t0 = performance.now();
for (let f = 0; f < FRAMES; f++) layer.frame(16, farCam);
const frameMsFar = (performance.now() - t0) / FRAMES;
console.log(`BeeLayer.frame 远景 T2 主导: ${frameMsFar.toFixed(3)}ms/帧 × ${FRAMES} 帧（冻结期零矩阵重写）`);
ok(frameMsFar < 2, `千蜂远景单帧写入 < 2ms（实测 ${frameMsFar.toFixed(3)}ms，任务 6.2 定标）`);
ok(frameMsFar < Math.max(frameMsAll, 0.02) * 0.5, `远景成本 < 全近档实测 50%（相对断言跨机器稳定：${frameMsFar.toFixed(3)} vs ${frameMsAll.toFixed(3)}）`);

/* (b2) 描边集合渲染预算（hive-marquee-and-card-rework 3.3）：整群描边（远档蜂
    强制近档 + 遮罩集合逐只写入）单帧 < 4ms——遮罩膨胀 pass 单次复用，pass 成本
    SHALL NOT 随 N 增长（每蜂仅增一次 setMatrixAt 写入）。 */
layer.setOutlineBeeIds(new Set(bees.map((b) => b.id)));
for (let f = 0; f < 5; f++) layer.frame(16, farCam); // 迁移沿（整群强制近档，不计入预算）
t0 = performance.now();
for (let f = 0; f < FRAMES; f++) layer.frame(16, farCam);
const frameMsOutline = (performance.now() - t0) / FRAMES;
console.log(`BeeLayer.frame 描边集合全量（${bees.length} 蜂）: ${frameMsOutline.toFixed(3)}ms/帧 × ${FRAMES} 帧`);
ok(frameMsOutline < 4, `整群描边单帧写入 < 4ms（实测 ${frameMsOutline.toFixed(3)}ms）`);
eq2(layer.maskBody.count, bees.length, "遮罩实例 count = 描边集合蜂数（集合渲染全量写入）");
ok(layer._maskCapacity >= bees.length, "遮罩容量按镜像蜂数扩容到位（无越界写入）");
layer.setOutlineBeeIds(null);
for (let f = 0; f < 5; f++) layer.frame(16, farCam); // 解除迁移沿（回落自然档，(c) 从干净状态起测）

/* (c) 近景相机（原点巢区）：近档 = 可见集，中/远档照常冻结 */
const nearCam = { x: originBee ? originBee.x : 0, y: 0, z: originBee ? originBee.z : 0 };
for (let f = 0; f < 5; f++) layer.frame(16, nearCam); // 迁移沿
const t0Count = buckets.counts[TIER_NEAR];
const t2Count = buckets.slots.size;
console.log(`近景分布: T0=${t0Count} T1=${buckets.counts[TIER_MID]} T2=${t2Count} / ${bees.length}`);
ok(t0Count >= 1, "近景相机下近档桶非空（原点巢蜂可见）");
ok(t0Count < bees.length * 0.15, `近档仅少数（翅膀/阴影/气泡提交随可见集收缩：${t0Count} < 15%）`);
ok(t2Count > bees.length * 0.25, `远档冻结占可观比例（零逐帧写入：${t2Count} > 25%）`);

/* (d) 迁移沿后拾取解析正确：三桶并集覆盖全部蜂且无重复（槽位无错位/泄漏） */
const pickedIds = new Set();
for (const tierParts of buckets.tierParts) {
  for (const part of tierParts) {
    if (part.mesh.userData.pick.tier === TIER_FAR) continue; // T2 槽位稀疏表单独遍历
    for (let i = 0; i < part.mesh.count; i++) {
      const record = layer.beeAt(part.mesh, i);
      ok(record, "迁移沿后 T0/T1 桶实例均可拾取解析");
      pickedIds.add(record.id);
    }
  }
}
const farMesh = buckets.tierParts[TIER_FAR][0].mesh;
for (const slot of buckets.slots.values()) {
  const record = layer.beeAt(farMesh, slot);
  ok(record, "迁移沿后 T2 占用槽可拾取解析");
  pickedIds.add(record.id);
}
eq2(pickedIds.size, bees.length, "迁移沿后三桶拾取并集覆盖全部蜂且无重复");

/* ── 重建幂等 / 无记录累积（D11：索引重建而非追加，9.4 泄漏纪律的实例面） ── */
layer.setBees(bees, new Map()); // 同快照重复镜像
layer.setBees(bees.slice(50), new Map()); // 50 只离场
layer.setBees(bees, new Map()); // 全部回来（部分离场动画未放完也应正确收敛）
for (let f = 0; f < 80; f++) layer.frame(16, farCam); // 推进时间，让离场动画到期
layer.setBees(bees, new Map()); // 最终镜像
eq2(layer.beeMap.size, bees.length, "重复镜像后 beeMap 收敛到活蜂数（离场记录已回收）");
eq2(layer.renderList.length, bees.length, "渲染列表无累积");
const uniqueIds = new Set(layer.renderList.map((r) => r.id));
eq2(uniqueIds.size, layer.renderList.length, "渲染列表无重复记录");
/* T2 槽位纪律：稳定镜像远景帧全量冻结入槽；占用 + 空闲 = 已创建（无泄漏） */
layer.frame(16, farCam);
eq2(buckets.slots.size, bees.length, "稳定镜像远景帧全部冻结入槽");
eq2(buckets.slots.size + buckets.free.length, buckets.next, "T2 槽位不变量：占用 + 空闲 = 已创建（无泄漏）");
ok(buckets.next <= layer.maxBees, `槽位高水位 ≤ maxBees（${buckets.next} ≤ ${layer.maxBees}）`);

function eq2(actual, expected, message) {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
}

/* ── 连线层（hive-interaction-polish 7.4/8.2）：空集零成本（spec「性能与体验基线」：
      无 hover/无选中 → 整层 visible=false，不扫渲染集、不触几何、不置上传）。
      tips/bar 的热路径纪律：tips 仅 hover 期挂载内容（DOM 瞬态层，空 hover 幂等隐藏）；
      概要条经 brief.mjs store 内容不变不 bump（test/brief-bar-smoke.mjs 已断言）——
      两者均不在每帧渲染热路径，无帧预算断言面。 ── */
{
  const linkLayer = new LinkLayer(scene);
  const emptyFrame = () => linkLayer.frame({ hover: null, selectedId: null, bees: layer });
  emptyFrame();
  eq2(linkLayer.beeDrone.lines.visible, false, "空集 → 蜂→无人机集不可见");
  eq2(linkLayer.summon.lines.visible, false, "空集 → 召唤集不可见");
  eq2(linkLayer.beeDrone.geometry.drawRange.count, 0, "空集 → drawRange 0（零写入）");
  ok(!linkLayer.beeDrone.geometry.attributes.position.needsUpdate, "空集 → position 未置脏（零上传）");
  const tLink = performance.now();
  for (let i = 0; i < 1000; i++) emptyFrame();
  const emptyMs = (performance.now() - tLink) / 1000;
  console.log(`LinkLayer 空集帧: ${emptyMs.toFixed(4)}ms/帧 × 1000`);
  ok(emptyMs < 0.05, `连线层空集零成本（实测 ${emptyMs.toFixed(4)}ms < 0.05ms）`);
  /* 命中路径 sanity：hover 一只蜂 → 连线层可见（成本 O(可见连线数)） */
  const hoverId = originBee?.id ?? layer.renderList[0].id;
  linkLayer.frame({ hover: { kind: "bee", id: hoverId }, selectedId: null, bees: layer });
  ok(!linkLayer.beeDrone.lines.visible || linkLayer.beeDrone.pairs > 0, "命中路径可见集写入（pairs>0 或无无人机回隐）");
  linkLayer.dispose();
}

layer.dispose();

console.log("ALL PERF SMOKE TESTS PASSED");
