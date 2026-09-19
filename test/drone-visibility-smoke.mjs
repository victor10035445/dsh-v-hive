/**
 * 无人机活跃态显隐冒烟测试（drone-active-visibility，无需 WebGL 纯逻辑层，
 * 先例 bee-model-smoke.mjs / hex-fx-smoke.mjs）：
 *  - deriveWorld：降级/野蜂无人机 droneStandIn 标记（origin 不动，F3）、散开确定性
 *    （同输入同位置、互不重叠、半径 = BEE_RADIUS 倍率）、activeDroneCount 预聚合；
 *  - 可见性谓词真值表（四态 × 两模式，scene.isDroneVisible 单一出处）；
 *  - 场景装配：构造 world → assembleBeeRecords 断言渲染输入不含 done 无人机、活跃全保留、
 *    droneIndex/droneCount 连续重编（角度均布无空洞）；mode="all" 全量回归；
 *  - 卡片口径（F4）：isCardBeeVisible / 角标活跃/总数 / 折叠按钮按活跃数显示；
 *  - 簿记修复回归（F1）：连续两次 setBees（id 缺席）退场不重启；播完后记录 SHALL NOT
 *    重入 renderList/pickIndex（保留于 beeMap）；重现走 "in"；
 *  - 差分喂食回归（F2）：diff 输入为全量——迁 done tick doneIds 包含该 id（绿墙照常）、
 *    恢复运行 enterIds SHALL NOT 包含该 id（黄墙不误触发）。
 * 运行：node test/drone-visibility-smoke.mjs
 */
import { deriveWorld, standInRingRadius } from "../src/bee-model.mjs";
import { worldOf, BEE_RADIUS } from "../src/hex.mjs";
import { isDroneVisible, isCardBeeVisible, assembleBeeRecords } from "../src/hive/scene.mjs";
import { droneBadge, droneCollapseVisible } from "../src/hive/cards.mjs";
import { BeeLayer, EXIT_OUT_MS, EXIT_TO_HONEY_MS } from "../src/hive/bees.mjs";
import { GestureController } from "../src/hive/interact.mjs";
import { diffBeeTransitions } from "../src/hive/hex-fx.mjs";
import * as THREE from "three";

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

/** 组合夹具：父挂无人机（活跃/done）+ 8 只降级停驻（父空白）+ 2 只野蜂箱无人机 + 普通野蜂。 */
function fixture() {
  const byId = {};
  const ids = [];
  const add = (s) => {
    byId[s.id] = s;
    ids.push(s.id);
  };
  add(summary({ id: "p1", cwd: "F:/a", running: true }));
  add(summary({ id: "d1", origin: "subagent", parentId: "p1", running: true, cwd: "F:/a" })); // 活跃（busy）
  add(summary({ id: "d2", origin: "subagent", parentId: "p1", completed: true, cwd: "F:/a" })); // done
  add(summary({ id: "p2", cwd: "F:/a" })); // idle 父蜂
  add(summary({ id: "d3", origin: "subagent", parentId: "p2", pendingInteraction: "question", cwd: "F:/a" })); // 活跃（help）
  add(summary({ id: "p-blank", blank: true, cwd: "F:/a" })); // 降级父（空白不渲染）
  for (let i = 1; i <= 8; i++) {
    add(summary({ id: "std" + i, origin: "subagent", parentId: "p-blank", running: true, cwd: "F:/a" }));
  }
  add(summary({ id: "std-done", origin: "subagent", parentId: "p-blank", completed: true, cwd: "F:/a" })); // done 降级
  add(summary({ id: "wd1", origin: "subagent", parentId: "p-missing", running: true })); // 野蜂箱无人机（父缺失+无账号）
  add(summary({ id: "wd2", origin: "subagent", parentId: "p-missing", completed: true })); // 野蜂箱无人机 done
  add(summary({ id: "wildx", cwd: "F:/nowhere" })); // 普通野蜂（无标记）
  const sessions = { ids, byId, current: "p1" };
  const workspaces = {
    items: [
      {
        workspaceId: "ws-a",
        path: "F:/a",
        title: "a",
        sessionIds: ["p1", "d1", "d2", "p2", "d3", "p-blank", ...Array.from({ length: 8 }, (_, i) => "std" + (i + 1)), "std-done"]
      }
    ],
    archivedSessionIds: []
  };
  return { sessions, workspaces };
}

/* ── deriveWorld：标记、预聚合、散开 ── */
const derived = deriveWorld(fixture());
const world = derived.world;
const studioA = world.studios[0];
const beeOf = (id) => studioA.bees.find((b) => b.sessionId === id);

/* 1.1 独立标记（SHALL NOT 动 origin——F3） */
const p1 = beeOf("p1");
eq(p1.drones.length, 2, "父蜂挂 2 只无人机");
ok(p1.drones.every((d) => !d.droneStandIn), "父挂无人机无 droneStandIn 标记");
const std1 = beeOf("std1");
ok(std1 && std1.droneStandIn === true, "降级停驻蜂补独立标记 droneStandIn");
eq(std1.cellIndex, -1, "降级停驻蜂 cellIndex = -1（现状不变）");
eq(std1.origin, undefined, "origin 字段未动（拖拽/右键/寻址三类交互零漂移，F3）");
const wd1 = (world.wildBees ?? []).find((b) => b.sessionId === "wd1");
const wd2 = (world.wildBees ?? []).find((b) => b.sessionId === "wd2");
ok(wd1 && wd1.droneStandIn === true, "野蜂箱无人机补 droneStandIn 标记");
ok(wd2 && wd2.droneStandIn === true, "野蜂箱 done 无人机同标记");
ok(!(world.wildBees ?? []).find((b) => b.sessionId === "wildx")?.droneStandIn, "普通野蜂无标记");

/* 1.3 活跃预聚合（done 不计；单遍派生） */
eq(p1.activeDroneCount, 1, "p1 活跃无人机数 = 1（busy 计、done 不计）");
eq(beeOf("p2").activeDroneCount, 1, "p2 活跃无人机数 = 1（help 计）");
eq(beeOf("p2").drones.length, 1, "总数口径 = drones.length（全量）");

/* 1.2 确定性散开：同输入同位置、互不重叠、半径 = BEE_RADIUS 倍率 */
const center = worldOf(studioA.center);
const standIns = studioA.bees.filter((b) => b.droneStandIn);
eq(standIns.length, 9, "9 只降级停驻蜂全部入巢（8 活跃 + 1 done）");
const expectedRadius = standInRingRadius(standIns.length);
ok(expectedRadius > 1.5 * BEE_RADIUS, "半径随数量外扩（倍率制）");
for (const bee of standIns) {
  const dist = Math.hypot(bee.pos.x - center.x, bee.pos.z - center.z);
  ok(Math.abs(dist - expectedRadius) < 1e-9, "停靠半径 = standInRingRadius（BEE_RADIUS 倍率，无独立魔数）");
}
/* 互不重叠：最小两两间距 > 无人机包围球直径（0.55 × BEE_RADIUS × 2） */
let minPair = Infinity;
for (let i = 0; i < standIns.length; i++) {
  for (let j = i + 1; j < standIns.length; j++) {
    const d = Math.hypot(standIns[i].pos.x - standIns[j].pos.x, standIns[i].pos.z - standIns[j].pos.z);
    if (d < minPair) minPair = d;
  }
}
ok(minPair > 2 * 0.55 * BEE_RADIUS, `停驻蜂两两间距 > 无人机直径（最小 ${minPair.toFixed(3)}）`);
const derivedAgain = deriveWorld(fixture());
const std1Again = derivedAgain.world.studios[0].bees.find((b) => b.sessionId === "std1");
eq(std1Again.pos.x, std1.pos.x, "同输入同位置（x 确定性）");
eq(std1Again.pos.z, std1.pos.z, "同输入同位置（z 确定性）");

/* ── 2.1 可见性谓词真值表（四态 × 两模式） ── */
for (const state of ["idle", "busy", "help"]) {
  eq(isDroneVisible(state, "active-only"), true, `活跃态 active-only 可见：${state}`);
  eq(isDroneVisible(state, "all"), true, `活跃态 all 可见：${state}`);
}
eq(isDroneVisible("done", "active-only"), false, "done 在 active-only 不可见");
eq(isDroneVisible("done", "all"), true, "done 在 all 可见（恒真）");
eq(isDroneVisible("done", undefined), false, "缺省模式 = active-only（与 store 默认对齐）");

/* ── 2.2/2.3/2.6 场景装配：过滤 + 可见集重编 + 全量差分基线 ── */
const assembled = assembleBeeRecords(world, { droneMode: "active-only", collapsedParents: new Set() });
const renderIds = new Set(assembled.renderRecords.map((r) => r.id));
const allIds = new Set(assembled.allRecords.map((r) => r.id));
ok(!renderIds.has("d2"), "渲染输入不含 done 无人机（2.2）");
ok(!renderIds.has("std-done"), "done 降级蜂被过滤（2.3）");
ok(renderIds.has("d1") && renderIds.has("d3"), "活跃无人机全保留");
ok(renderIds.has("std1"), "活跃降级蜂保留");
ok(!(renderIds.has("wd1") || allIds.has("wd1")), "野蜂箱无人机不经蜂层 beeRecords（走 setWildBees 独立路径）");
ok(isCardBeeVisible(wd1, "active-only") && !isCardBeeVisible(wd2, "active-only"), "野蜂箱入箱清单同谓词（wildBeesForBox）：活跃入箱、done 不入箱");
ok(allIds.has("d2") && allIds.has("std-done"), "全量差分基线仍含被过滤 done 无人机（F2 喂食约束）");
/* 绕飞序号按可见集重编（连续、无空洞） */
const orbit = assembled.renderRecords.filter((r) => r.droneOf != null);
eq(orbit.length, 2, "可见绕飞无人机 2 只");
const indexByParent = new Map();
for (const rec of orbit) {
  const key = rec.droneOf.x + "," + rec.droneOf.z; // 同父 = 同锚点
  const seen = indexByParent.get(key) ?? [];
  ok(Number.isInteger(rec.droneIndex) && rec.droneIndex >= 0 && rec.droneIndex < rec.droneCount, "droneIndex ∈ [0, droneCount)（角度均布无空洞）");
  ok(!seen.includes(rec.droneIndex), "同父序号唯一");
  seen.push(rec.droneIndex);
  indexByParent.set(key, seen);
}
/* 单父多无人机：可见集重编为 0..n-1（done 不占序号） */
{
  const byId2 = {};
  const ids2 = [];
  const add2 = (s) => {
    byId2[s.id] = s;
    ids2.push(s.id);
  };
  add2(summary({ id: "pp", cwd: "F:/a", running: true }));
  for (let i = 0; i < 3; i++) add2(summary({ id: "a" + i, origin: "subagent", parentId: "pp", running: true, cwd: "F:/a" }));
  for (let i = 0; i < 2; i++) add2(summary({ id: "z" + i, origin: "subagent", parentId: "pp", completed: true, cwd: "F:/a" }));
  const w3 = deriveWorld({
    sessions: { ids: ids2, byId: byId2, current: "pp" },
    workspaces: { items: [{ workspaceId: "ws-a", path: "F:/a", title: "a", sessionIds: ids2 }], archivedSessionIds: [] }
  }).world;
  const asm3 = assembleBeeRecords(w3, { droneMode: "active-only", collapsedParents: new Set() });
  const orbit3 = asm3.renderRecords.filter((r) => r.droneOf != null);
  eq(orbit3.length, 3, "单父 5 只无人机：可见 3 只");
  eq(
    JSON.stringify(orbit3.map((r) => r.droneIndex).sort()),
    JSON.stringify([0, 1, 2]),
    "可见集重编 = 0..n-1（无空洞，done 不占序号）"
  );
  ok(orbit3.every((r) => r.droneCount === 3), "droneCount 按可见集计数");
}
/* mode="all" 全量回归：三处装配回到现状 */
const assembledAll = assembleBeeRecords(world, { droneMode: "all", collapsedParents: new Set() });
eq(assembledAll.renderRecords.length, assembledAll.allRecords.length, "mode=all 渲染输入 = 全量基线");
const orbitAll = assembledAll.renderRecords.filter((r) => r.droneOf != null);
eq(orbitAll.length, 3, "mode=all 无人机全量渲染（含 done，现状行为）");
ok(assembledAll.renderRecords.some((r) => r.id === "std-done"), "mode=all done 降级蜂回到渲染");
/* 折叠标记透传（collapsedParents 接口不动） */
const collapsedAsm = assembleBeeRecords(world, { droneMode: "all", collapsedParents: new Set(["p1"]) });
ok(
  collapsedAsm.renderRecords.filter((r) => r.droneOf != null && r.id === "d1").every((r) => r.collapsed === true),
  "collapsed 标记按父蜂透传（toggleDroneCollapse 接口不变）"
);

/* ── 5.1/5.2 卡片口径（F4）：isCardBeeVisible / 角标 / 折叠按钮 ── */
ok(isCardBeeVisible({ state: "busy" }, "active-only"), "工蜂恒可见（无标记不受过滤）");
ok(!isCardBeeVisible({ state: "done", droneStandIn: true }, "active-only"), "done 降级蜂不可见（SHALL NOT 留幽灵气泡，F4）");
ok(isCardBeeVisible({ state: "busy", droneStandIn: true }, "active-only"), "活跃降级蜂可见");
ok(isCardBeeVisible({ state: "done", droneStandIn: true }, "all"), "mode=all 恒可见");
eq(droneBadge({ droneCount: 5, activeDroneCount: 2 }), "🐝2/5", "mini角标 = 活跃/总数");
eq(droneBadge({ droneCount: 3, activeDroneCount: 0 }), "🐝0/3", "A=0 且 T>0 → 🐝0/3");
eq(droneBadge({ droneCount: 0 }), "", "总数 0 不显示角标");
eq(droneBadge({ droneCount: 2 }), "🐝2/2", "缺活跃数回落总数（口径与显隐模式正交）");
ok(!droneCollapseVisible({ droneCount: 3, activeDroneCount: 0 }), "全部休眠 → 折叠按钮隐藏（按活跃数口径）");
ok(droneCollapseVisible({ droneCount: 3, activeDroneCount: 1 }), "有活跃 → 折叠按钮显示");
ok(!droneCollapseVisible({ droneCount: 0 }), "无无人机 → 折叠按钮隐藏");

/* ── 6.2 簿记修复回归（F1）：Node 图元路径直接驱动 BeeLayer ── */
const layer = new BeeLayer(new THREE.Scene());
const worker = [{ id: "w1", x: 0, z: 0, y: 1, state: "busy" }];
layer.setBees([{ id: "d1", x: 1, z: 1, y: 1, state: "busy" }, ...worker]);
eq(layer.beeMap.get("d1").anim, "none", "初始无动画");
layer.setBees(worker); // d1 缺席 → 退场
const rec = layer.beeMap.get("d1");
eq(rec.anim, "out", "缺席差分触发离场动画");
const start1 = rec.animStart;
ok(layer.renderList.some((r) => r.id === "d1"), "退场动画期间仍在渲染列表");
layer.frame(10);
layer.setBees(worker); // 高频 tick 再缺席
eq(rec.animStart, start1, "连续缺席 setBees 退场不重启（F1：转换沿才重置）");
eq(rec.anim, "out", "anim 保持 out 不翻动");
layer.frame(EXIT_OUT_MS + 5);
layer.setBees(worker);
ok(!layer.renderList.some((r) => r.id === "d1"), "终态播完后 SHALL NOT 重入渲染列表");
ok(!layer.pickIndex.some((r) => r.id === "d1"), "播完后脱离拾取（pickIndex = renderList）");
ok(layer.beeMap.has("d1"), "记录保留于 beeMap（重现依赖，D4）");
layer.setBees([{ id: "d1", x: 1, z: 1, y: 1, state: "busy" }, ...worker]);
eq(layer.beeMap.get("d1").anim, "in", "重现（恢复运行）走 in 出场动画（D4）");

/* 化蜜飞行（toHoney）同源修复：转换沿重置 + 播完隐藏 */
const honey = new Map([["h1", { x: 5, y: -1.35, z: 5 }]]);
layer.setBees([{ id: "h1", x: 2, z: 2, y: 1, state: "done" }, ...worker]);
layer.setBees(worker, honey); // h1 缺席 + 有落点 → toHoney
const hrec = layer.beeMap.get("h1");
eq(hrec.anim, "toHoney", "缺席 + 蜜杯落点 → 化蜜飞行");
const hstart = hrec.animStart;
layer.frame(50);
layer.setBees(worker, honey);
eq(hrec.animStart, hstart, "化蜜飞行同样不每 tick 重启（同源潜伏缺陷）");
layer.frame(EXIT_TO_HONEY_MS + 5);
layer.setBees(worker, honey);
ok(!layer.renderList.some((r) => r.id === "h1"), "化蜜播完后隐藏（脱离渲染/拾取）");

/* 常量出处唯一：簿记判断与 poseOf 动画共用（防双处漂移） */
eq(EXIT_OUT_MS, 420, "退场时长常量 = 420ms");
eq(EXIT_TO_HONEY_MS, 900, "化蜜时长常量 = 900ms");

/* ── 6.3 差分喂食回归（F2）：diff 输入为全量（rebuildAll 同款喂食次序） ── */
// tick1 基线：无人机活跃（全量含）
const tick1 = assembleBeeRecords(deriveWorld(fixture()).world, { droneMode: "active-only", collapsedParents: new Set() });
let diff = diffBeeTransitions(null, tick1.allRecords);
eq(diff.doneIds.length, 0, "首帧基线不触发绿墙");
eq(diff.enterIds.length, 0, "首帧基线不触发黄墙");
// tick2：d1 迁 done（渲染被过滤，但喂给 diff 的全量仍含）→ doneIds 包含（绿墙照常触发）
{
  const f = fixture();
  f.sessions.byId.d1 = { ...f.sessions.byId.d1, running: false, completed: true };
  const tick2 = assembleBeeRecords(deriveWorld(f).world, { droneMode: "active-only", collapsedParents: new Set() });
  ok(!tick2.renderRecords.some((r) => r.id === "d1"), "迁 done 后渲染输入已过滤该无人机");
  diff = diffBeeTransitions({ states: diff.states, sessions: diff.sessions }, tick2.allRecords);
  ok(diff.doneIds.includes("d1"), "done 迁入 tick doneIds 包含该 id（绿墙不丢）");
}
// tick3：d1 恢复运行（回到渲染）→ enterIds SHALL NOT 包含该 id（黄墙不误触发）
{
  const f = fixture();
  f.sessions.byId.d1 = { ...f.sessions.byId.d1, running: true, completed: false };
  const tick3 = assembleBeeRecords(deriveWorld(f).world, { droneMode: "active-only", collapsedParents: new Set() });
  ok(tick3.renderRecords.some((r) => r.id === "d1"), "恢复运行后回到渲染输入");
  diff = diffBeeTransitions({ states: diff.states, sessions: diff.sessions }, tick3.allRecords);
  ok(!diff.enterIds.includes("d1"), "恢复运行 enterIds SHALL NOT 包含该 id（黄墙不误触发，F2）");
}

/* ── 7. 无人机不可选中（hive-interaction-polish 4.1/4.2/D2）：单击无动作，hover/双击聚焦保持 ── */
{
  /* interact 的 Esc 监听挂 window——Node 侧最小桩（仅本块作用域） */
  const prevWindow = globalThis.window;
  globalThis.window = { addEventListener() {}, removeEventListener() {} };
  try {
    const listeners = {};
    const canvasStub = {
      addEventListener: (type, fn) => {
        listeners[type] = fn;
      },
      removeEventListener: () => {},
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
      style: {},
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 })
    };
    const calls = [];
    const callbacks = {
      onSelectBee: (id) => calls.push(["bee", id]),
      onSelectDrone: (id) => calls.push(["drone", id]),
      onFocusBee: (id) => calls.push(["focus", id]),
      onHover: (hover) => calls.push(["hover", hover?.kind ?? null])
    };
    const gesture = new GestureController({
      canvas: canvasStub,
      scene: { add() {}, remove() {} },
      camera: new THREE.PerspectiveCamera(),
      rig: { spin() {}, pan() {}, zoom() {}, target: new THREE.Vector3() },
      tileField: {},
      territory: { floor: null },
      walls: { mesh: null },
      bees: { pickMeshes: () => [] },
      cups: { mesh: null },
      studioLayersOf: () => [],
      occupancyOf: () => new Map(),
      callbacks
    });
    const click = () => {
      listeners.pointerdown({ button: 0, pointerId: 1, clientX: 10, clientY: 10 });
      listeners.pointerup({ button: 0, pointerId: 1, clientX: 10, clientY: 10 });
    };
    /* 无人机（origin subagent）单击 → 无动作（onSelectDrone 调用路径已移除） */
    gesture.pick = () => ({ kind: "drone", id: "d1", face: { origin: "subagent" } });
    click();
    eq(calls.filter((c) => c[0] === "drone" || c[0] === "bee").length, 0, "无人机单击无动作（SHALL NOT 切会话/开目录/选中）");
    /* 降级停驻蜂（kind bee + droneStandIn 标记）单击 → 无动作 */
    gesture.pick = () => ({ kind: "bee", id: "std1", face: { droneStandIn: true } });
    click();
    eq(calls.filter((c) => c[0] === "drone" || c[0] === "bee").length, 0, "降级停驻蜂单击无动作（SHALL NOT 动 origin 分类，F3）");
    /* 工蜂单击照常选中 */
    gesture.pick = () => ({ kind: "bee", id: "p1", face: {} });
    click();
    eq(JSON.stringify(calls.filter((c) => c[0] === "bee").map((c) => c[1])), JSON.stringify(["p1"]), "工蜂单击照常选中（语义不变）");
    /* hover 追踪保持（无人机 tips 依赖）+ 双击聚焦保持 */
    calls.length = 0;
    gesture.pick = () => ({ kind: "drone", id: "d1", face: { origin: "subagent" } });
    listeners.pointermove({ clientX: 12, clientY: 12 });
    ok(calls.some((c) => c[0] === "hover" && c[1] === "drone"), "无人机 hover 追踪保持（tips 数据源）");
    eq(canvasStub.style.cursor, "pointer", "无人机 hover 指针光标保持");
    listeners.dblclick({ clientX: 12, clientY: 12 });
    eq(JSON.stringify(calls.filter((c) => c[0] === "focus").map((c) => c[1])), JSON.stringify(["d1"]), "双击聚焦保持（聚焦非选中，不在本轮范围）");
    gesture.dispose();
  } finally {
    if (prevWindow === undefined) delete globalThis.window;
    else globalThis.window = prevWindow;
  }
}

console.log("ALL DRONE-VISIBILITY SMOKE TESTS PASSED");
