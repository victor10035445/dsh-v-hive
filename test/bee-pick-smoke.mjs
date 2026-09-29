/**
 * 蜂拾取基础设施冒烟测试（bee-pick-and-marquee-focus 任务 5.3 / 6.1 / 6.2）：
 *  - 静态全场包围球（D1）：**图元**三档桶网格与代理网格装配/扩容/布局重建后
 *    `boundingSphere` 恒非空且半径 ≥ 全场外接（含各外观变体装配时**不**被替换为
 *    全场球——GLB 部件保留紧球）；
 *  - 拾取代理（D2/D2b）：`BEE_PICK_RADIUS = 1.0 × BEE_RADIUS` 常量锁定、容量 = `maxBees`
 *    （含 `grow()` 后）、逐帧同步覆盖三档（含远档冻结）+ 无人机分类、记录表实例序与
 *    写入序一致、离场蜂按 `scale <= 0.01` 跳过、`pickMeshes()` 首位为代理；
 *  - 群体级早退（D1 配对项）：当帧候选群体球覆盖全部蜂（逐蜂射线均不被拒绝）、
 *    射线落在蜂群外被拒绝、空集（无可拾取蜂）恒拒绝；
 *  - 库行为锁定（任务 6.2）：`Raycaster` 对 `visible = false` 的 InstancedMesh 仍求交
 *    （three@0.185.1：`intersect()` 只做 `layers.test`）；零尺度初值矩阵下**惰性**
 *    `computeBoundingSphere()` 会退化成 NaN 球（= 根因 A 的库侧机制，显式赋值静态球
 *    后不再触发）；张紧球（GLB 路径）与全场球（图元路径）都是有效 early-out。
 *
 * 性能基线（任务 6.1）另见 test/perf-smoke.mjs 的千蜂段（同进程外预算断言）。
 * 运行：node test/bee-pick-smoke.mjs
 */
import * as THREE from "three";
import { GestureController } from "../src/hive/interact.mjs";
import { BEE_RADIUS, SQRT3, wallRadius } from "../src/hex.mjs";
import {
  BeeLayer,
  BEE_PICK_RADIUS,
  TIER_NEAR,
  TIER_MID,
  TIER_FAR,
  LOD_NEAR,
  LOD_MID,
  fieldSphereOf
} from "../src/hive/bees.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};
const close = (actual, expected, message, eps = 1e-6) => {
  if (!(Math.abs(actual - expected) <= eps)) {
    throw new Error(`FAIL: ${message}（期望 ${expected} ± ${eps}，实际 ${actual}）`);
  }
};

/* ── 1. 常量与比例尺纪律 ── */
eq(BEE_PICK_RADIUS, 1.0 * BEE_RADIUS, "宽容球半径 = 1.0 × BEE_RADIUS（比例尺锚点倍率，非独立魔数）");
eq(BEE_PICK_RADIUS, 0.8, "宽容球半径 = 0.8 世界单位（比例尺锚点 BEE_RADIUS = 0.8）");
ok(2 * BEE_PICK_RADIUS < SQRT3, "三维热区不重叠：2 × BEE_PICK_RADIUS = 1.6 < 相邻格心距 √3 ≈ 1.732");
ok(BEE_PICK_RADIUS < SQRT3 / 2, "宽容球收于瓦片内切圆（地面投影不出格）");
ok(2 * BEE_PICK_RADIUS > 1.7 * 0.458, "热区明显宽于模型视觉半尺寸（径向余量 ≈ 1.7 倍口径的保守下界）");

/* ── 2. 静态全场包围球（D1）── */
{
  const single = fieldSphereOf([{ worldCenter: { x: 0, z: 0 }, layer: 3 }]);
  close(single.center.x, 0, "单巢：全场球心 x = 巢心");
  close(single.radius, wallRadius(3) + 2 * BEE_RADIUS, "单巢：半径 = 巢墙外接半径 + 2×BEE_RADIUS 余量");
  const pair = fieldSphereOf([
    { worldCenter: { x: 0, z: 0 }, layer: 3 },
    { worldCenter: { x: 60, z: 0 }, layer: 3 }
  ]);
  close(pair.center.x, 30, "两巢：球心 = 外接中心");
  close(pair.radius, 30 + wallRadius(3) + 2 * BEE_RADIUS, "两巢：半径覆盖两端巢分布");
  ok(fieldSphereOf([]).radius > 0, "空巢列表：兜底球半径为正（构造期兜底，避免零/NaN 球）");
  ok(fieldSphereOf(null).radius > 0, "null 入参：兜底球（防御）");
}

/* ── 3. 装配与扩容：图元桶网格 / 代理网格的静态球与容量不变量（D1/D2b）── */
const scene = new THREE.Scene();
const layer = new BeeLayer(scene, { reduced: false });
const bee = (id, x, z = 0, extra = {}) => ({
  id,
  x,
  z,
  y: 1,
  state: "idle",
  scale: 1,
  droneOf: null,
  phase: 0,
  ...extra
});
const pickMeshesWith = (mesh) => layer.pickMeshes().filter((m) => m === mesh);
const bucketMeshes = () => layer.buckets.tierParts.flat().map((p) => p.mesh);

ok(fieldSphereOf([]).radius > 0, "（前置）兜底球有效");
for (const mesh of bucketMeshes()) {
  ok(mesh.boundingSphere, `图元桶网格装配即持有包围球（${mesh.userData.pick.tier} 档，SHALL NOT 依赖惰性快照）`);
  ok(mesh.boundingSphere.radius >= fieldSphereOf([]).radius - 1e-9, "图元桶网格静态球 = 全场球（半径 ≥ 兜底球）");
  ok(mesh.frustumCulled === false, "图元桶网格 frustumCulled=false 语义不变（球仅服务 raycast）");
}
ok(layer.pickMesh.boundingSphere, "代理网格装配即持有包围球（D1）");
ok(layer.pickMesh.visible === false, "代理网格 visible=false（不参与渲染）");
ok(layer.pickMesh.frustumCulled === false, "代理网格 frustumCulled=false（渲染器跳过）");
ok(layer.pickMesh.instanceMatrix.usage === THREE.DynamicDrawUsage, "代理 instanceMatrix 使用 DynamicDrawUsage（逐帧重写）");
eq(layer.pickMesh.instanceMatrix.count, layer.maxBees, "代理容量 = maxBees（初始 64）");
eq(pickMeshesWith(layer.pickMesh).length, 1, "pickMeshes() 含代理网格");
ok(layer.pickMeshes().includes(layer.pickMesh), "pickMeshes() 含代理网格（与桶网格共同求交；顺序无关语义）");

/* 布局重建：setFieldExtent 覆写全部图元拾取网格 + 代理网格 */
layer.setFieldExtent([{ worldCenter: { x: 0, z: 0 }, layer: 3 }]);
{
  const expect = fieldSphereOf([{ worldCenter: { x: 0, z: 0 }, layer: 3 }]).radius;
  for (const mesh of bucketMeshes()) close(mesh.boundingSphere.radius, expect, "布局重建后图元桶网格静态球随巢分布重算");
  close(layer.pickMesh.boundingSphere.radius, expect, "布局重建后代理静态球随巢分布重算");
}
/* 巢分布变化（建巢/搬巢）→ 球随之扩大；同一分布重复下发不重复覆写（值比对短路） */
layer.setFieldExtent([
  { worldCenter: { x: 0, z: 0 }, layer: 3 },
  { worldCenter: { x: 200, z: 0 }, layer: 3 }
]);
{
  const expect = fieldSphereOf([
    { worldCenter: { x: 0, z: 0 }, layer: 3 },
    { worldCenter: { x: 200, z: 0 }, layer: 3 }
  ]).radius;
  close(layer.pickMesh.boundingSphere.radius, expect, "巢分布扩大 → 全场球覆盖新巢（永不误杀优先）");
}
const fieldRefBefore = layer._fieldSphere;
layer.setFieldExtent([
  { worldCenter: { x: 0, z: 0 }, layer: 3 },
  { worldCenter: { x: 200, z: 0 }, layer: 3 }
]);
ok(layer._fieldSphere === fieldRefBefore, "同一巢分布重复下发 → 值比对短路（不新建球对象）");

/* ── 4. 代理逐帧同步（D2b）：三档覆盖 / 记录表实例序 / 无人机分类 / 离场跳过 ── */
layer.setFieldExtent([{ worldCenter: { x: 0, z: 0 }, layer: 3 }]);
const camFar = { x: 0, y: 0, z: 0 }; // 蜂 y=1 → 距离 = sqrt(x²+1)
const bees = [
  bee("near", 4, 0), // 近档
  bee("mid", LOD_NEAR + 10, 0), // 中档
  bee("far", LOD_MID + 50, 0), // 远档（冻结）
  bee("drone", 5, 3, { origin: "subagent", droneOf: { x: 4, y: 1, z: 0 }, droneIndex: 0, droneCount: 1 })
];
layer.setBees(bees);
layer.frame(16, camFar);
{
  const p = layer.pickBuckets;
  ok(p.counts[TIER_NEAR] >= 1 && p.counts[TIER_MID] >= 1, "代理记录表覆盖近/中档（当帧紧凑累积）");
  eq(p.slots.size, 1, "代理记录表覆盖远档（槽位稀疏表；远档蜂同样具备宽容热区）");
  const farSlot = p.slots.get("far");
  const farOffset = p.counts[TIER_NEAR] + p.counts[TIER_MID];
  eq(p.farOffset, farOffset, "代理记录当帧远档块偏移 = 紧凑段长度（beeAt 回落同一口径）");
  eq(layer.beeAt(layer.pickMesh, farOffset + farSlot)?.id, "far", "远档实例（紧凑段长度 + 槽位号）解析到远档蜂");
  /* 实例序 = 当帧写入序（NEAR 段 → MID 段 → 远档块）；两段同帧并存不互相遮蔽 */
  const near = [];
  for (let i = 0; i < p.counts[TIER_NEAR]; i++) near.push(p.records[TIER_NEAR][i]?.id);
  const mid = [];
  for (let i = 0; i < p.counts[TIER_MID]; i++) mid.push(p.records[TIER_MID][i]?.id);
  eq(near.length + mid.length + p.slots.size, bees.length, "代理记录表并集 = 当帧渲染集（无遗漏/无重复）");
  ok(near.includes("near") && near.includes("drone"), "无人机照常入代理记录表（分类口径不由代理引入）");
  eq(layer.beeAt(layer.pickMesh, 0)?.id, near[0], "紧凑段实例 0 = NEAR 段第 0 条记录（与远档块不重叠）");
  if (mid.length > 0) {
    eq(layer.beeAt(layer.pickMesh, p.counts[TIER_NEAR])?.id, mid[0], "MID 段紧随 NEAR 段（实例号 = NEAR 计数起）");
  }
  eq(layer.beeAt(layer.pickMesh, 999), null, "越界实例 → null（记录表解析安全）");
  eq(layer.pickMesh.count, near.length + mid.length + p.next, "代理 count = 紧凑段 + 远档段（两段不重叠，无空洞复用）");
  eq(layer.beeAt(layer.pickMesh, 0)?.origin, undefined, "近档工蜂记录 origin 未被代理改写");
}
/* 远档冻结蜂的代理矩阵逐帧重写（已知取舍②：换取远档同样具备宽容热区） */
{
  const slot = layer.pickBuckets.slots.get("far");
  const at = layer.pickBuckets.farOffset + slot;
  const before = layer.pickMesh.instanceMatrix.array.slice(at * 16, at * 16 + 16);
  layer.frame(16, { x: 0, y: 0, z: 5000 }); // 相机瞬移 → 整群远档
  const after = layer.pickMesh.instanceMatrix.array.slice(at * 16, at * 16 + 16);
  ok(Array.from(after).some((v, i) => v !== before[i]), "远档蜂的代理矩阵逐帧重写（冻结姿态下仍随姿态同步）");
}

/* 离场蜂按 pose.scale <= 0.01 与模型路径同门槛跳过（不可见即不可拾取） */
{
  const keep = [bee("alive", 4, 0)];
  layer.setBees(keep);
  layer.frame(16, camFar);
  layer.setBees([bee("alive", 4, 0), bee("leaving", 8, 0)]); // 新记录 → 入场
  layer.frame(16, camFar);
  layer.setBees([bee("alive", 4, 0)]); // leaving 转入离场动画
  for (let f = 0; f < 60; f++) layer.frame(16, camFar); // 60 × 16ms = 960ms > 420ms 离场时长
  const ids = [];
  for (const tier of [TIER_NEAR, TIER_MID]) {
    for (let i = 0; i < layer.pickBuckets.counts[tier]; i++) ids.push(layer.pickBuckets.records[tier][i]?.id);
  }
  for (const slot of layer.pickBuckets.slots.values()) ids.push(layer.pickBuckets.records[TIER_FAR][slot]?.id);
  ok(!ids.includes("leaving"), "离场播完的蜂不入代理记录表（与模型路径 scale 门槛同侧跳过）");
  ok(ids.includes("alive"), "在场蜂仍在代理记录表");
}

/* ── 5. 容量不变量（D2b）：grow() 后代理容量恒 = maxBees，写入数 ≤ 容量 ── */
{
  const many = [];
  for (let i = 0; i < 200; i++) many.push(bee("m" + i, 2 + i * 3, 0));
  layer.setBees(many);
  layer.frame(16, camFar);
  ok(layer.maxBees >= 200, `grow() 扩容触发（maxBees = ${layer.maxBees}）`);
  eq(layer.pickMesh.instanceMatrix.count, layer.maxBees, "grow() 后代理容量 = maxBees（setMatrixAt 无边界检查，缺失即越界）");
  const proxy = layer.pickBuckets;
  ok(proxy.next <= layer.maxBees, "代理槽位高水位 ≤ 容量（分配不越界）");
  ok(proxy.counts[TIER_NEAR] + proxy.counts[TIER_MID] + proxy.slots.size <= layer.maxBees, "代理同帧写入实例数 ≤ 容量（三段拼接各自占号，总量受蜂数约束）");
  ok(layer.pickMesh.count <= layer.maxBees, "代理 count ≤ 容量（= 紧凑段 + 远档段占用槽位，三段不重叠）");
  ok(layer.pickMesh.count >= proxy.counts[TIER_NEAR] + proxy.counts[TIER_MID] + proxy.slots.size, "代理 count 覆盖全部当帧写入实例");
  ok(proxy.farOffset === proxy.counts[TIER_NEAR] + proxy.counts[TIER_MID], "远档块偏移 = 紧凑段长度（beeAt 回落同口径）");
  for (const mesh of bucketMeshes()) ok(mesh.boundingSphere, "grow() 重建的图元桶网格仍持有静态球（D1 随重建同步）");
  ok(layer.pickMesh.boundingSphere, "grow() 重建的代理网格仍持有静态球");
}

/* ── 6. 群体级早退球（D1 硬性配对项）── */
{
  const near2 = new BeeLayer(new THREE.Scene(), { reduced: false });
  near2.setBees([bee("a", 0, 0), bee("b", 10, 0), bee("c", -10, 6)]);
  near2.setFieldExtent([{ worldCenter: { x: 0, z: 0 }, layer: 3 }]);
  near2.frame(16, { x: 0, y: 40, z: 40 });
  ok(near2._pickSphere.radius > 0, "当帧候选群体球非空（帧路径 O(N) 维护）");
  /* 覆盖性：逐蜂自上而下的射线 SHALL NOT 被早退拒绝（否则拾取会被误杀） */
  const down = new THREE.Vector3(0, -1, 0);
  for (const record of near2.renderList) {
    const ray = new THREE.Raycaster(new THREE.Vector3(record.pose.x, 60, record.pose.z), down);
    ok(near2.pickRejects(ray.ray) === false, `群体球覆盖当帧蜂 ${record.id}（早退不误杀）`);
  }
  /* 拒绝性：远离蜂群（天空/远景）的射线被直接拒绝 */
  const away = new THREE.Raycaster(new THREE.Vector3(500, 60, 500), down);
  eq(near2.pickRejects(away.ray), true, "射线落在蜂群之外 → 早退拒绝（跳过全部蜂网格）");
  const sky = new THREE.Raycaster(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 1, 0));
  eq(near2.pickRejects(sky.ray), true, "朝天射线 → 早退拒绝");
  /* 空集（无可拾取蜂）恒拒绝：逐网格求交必然全空 */
  const empty = new BeeLayer(new THREE.Scene(), { reduced: false });
  empty.frame(16, { x: 0, y: 40, z: 40 });
  eq(empty._pickSphere.radius, -1, "无蜂 → 群体球为空集哨兵（radius = -1）");
  eq(empty.pickRejects(away.ray), true, "空集 → 早退恒拒绝（零成本短路）");
  /* 早退球在事件路径零计算：连续两次调用结果稳定且不改写球（只读消费） */
  const r0 = near2._pickSphere.radius;
  const c0 = near2._pickSphere.center.x;
  near2.pickRejects(away.ray);
  near2.pickRejects(away.ray);
  eq([near2._pickSphere.radius, near2._pickSphere.center.x], [r0, c0], "早退球只读消费（事件路径 SHALL NOT 重算/改写）");
}

/* ── 7. 库行为锁定（任务 6.2）：visible=false 可求交 / 惰性球退化 / 静态球行为 ── */
{
  /* 7a. 显式赋值静态球后，射线对 visible=false 的代理网格仍求交（three@0.185.1） */
  const l3 = new BeeLayer(new THREE.Scene(), { reduced: false });
  l3.setBees([bee("hit", 0, 0)]);
  l3.frame(16, { x: 0, y: 60, z: 0 });
  const ray = new THREE.Raycaster(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, -1, 0));
  eq(l3.pickMesh.visible, false, "（前置）代理网格 visible=false");
  const hits = ray.intersectObject(l3.pickMesh, false);
  ok(hits.length > 0, "Raycaster 对 visible=false 的 InstancedMesh 仍求交（库行为锁定：intersect 只做 layers.test）");
  eq(l3.beeAt(hits[0].object, hits[0].instanceId)?.id, "hit", "代理命中经 userData.pick 解析回蜂记录（beeAt 口径不变）");

  /* 7b. 惰性包围球的退化形态（根因 A 的库侧机制复核；显式静态球后该路径不再触发）：
         - `count = 0`（图元通路开页首帧：蜂尚未写入）→ `makeEmpty()` 球，半径 -1，
           **射线全被 early-out**（此即「打开页面后第一次 hover 冻结快照」的库侧成因）；
         - 实例矩阵缓冲为零尺度初值（新建 InstancedMesh 且从未 `setMatrixAt`）→ 球半径 =
           几何半径、球心恒在原点 ⇒ 只有穿过网格原点的射线能命中，其余全被拒绝。
         两者都说明图元通路 MUST 显式赋值静态球（SHALL NOT 依赖惰性快照）。 */
  const emptyMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(BEE_PICK_RADIUS, 6, 4), new THREE.MeshBasicMaterial(), 4);
  emptyMesh.count = 0;
  emptyMesh.computeBoundingSphere();
  eq(emptyMesh.boundingSphere.radius, -1, "count = 0 的惰性球 = 空球（半径 -1，makeEmpty）");
  const rayDown = new THREE.Raycaster(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, -1, 0));
  eq(rayDown.intersectObject(emptyMesh, false).length, 0, "空球 → 射线全被 early-out（开页首帧冻结即此形态）");
  const rawMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(BEE_PICK_RADIUS, 6, 4), new THREE.MeshBasicMaterial(), 4);
  rawMesh.computeBoundingSphere();
  close(rawMesh.boundingSphere.radius, BEE_PICK_RADIUS, "零尺度初值矩阵 → 惰性球半径收缩为几何半径（球心仍在原点）", 1e-4);
  eq(rawMesh.boundingSphere.center.length(), 0, "零尺度初值矩阵 → 惰性球心恒在网格原点");
  eq(new THREE.Raycaster(new THREE.Vector3(8, 60, 0), new THREE.Vector3(0, -1, 0)).intersectObject(rawMesh, false).length, 0, "球心在原点的退化球 → 偏离原点的射线被 early-out（拾取失效的库侧复现）");
  ok(Number.isFinite(l3.pickMesh.boundingSphere.radius) && l3.pickMesh.boundingSphere.radius > 0, "显式静态球后代理包围球恒为有效大球（不依赖惰性路径）");

  /* 7c. 紧球同样是有效 early-out（模型路径纪律：SHALL NOT 替换为全场球） */
  const proxy = l3.pickMesh;
  const inst = new THREE.Matrix4().makeTranslation(0, 1, 0).scale(new THREE.Vector3(1, 1, 1));
  proxy.setMatrixAt(0, inst);
  proxy.count = 1;
  proxy.computeBoundingSphere();
  ok(proxy.boundingSphere.radius >= BEE_PICK_RADIUS - 1e-6 && proxy.boundingSphere.radius < 2, "紧球半径贴合实际实例范围（远小于全场球）");
  const fieldRadius = l3._fieldSphere.radius;
  const tightSphere = proxy.boundingSphere.clone();
  ok(tightSphere.radius < fieldRadius, "紧球 < 全场球（全场球会关闭 early-out：模型路径保留紧球的原因）");
  proxy.boundingSphere = new THREE.Sphere().copy(l3._fieldSphere); // 复原（本用例只借网格验证库行为）
}

/* ── 8. GLB 模型路径（D1 边界）：部件网格 SHALL NOT 被替换为全场球 ── */
{
  const l4 = new BeeLayer(new THREE.Scene(), { reduced: false });
  l4.setFieldExtent([{ worldCenter: { x: 0, z: 0 }, layer: 3 }]);
  const root = new THREE.Group();
  const part = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
  part.position.set(0.5, 0.25, 0);
  root.add(part);
  const cx = new THREE.Vector3(0.5, 0.25, 0);
  const expectTight = new THREE.Box3()
    .setFromCenterAndSize(cx, new THREE.Vector3(1, 1, 1))
    .getBoundingSphere(new THREE.Sphere()).radius;
  l4.attachModel(root, l4.defaultModelId);
  ok(l4.modelReady, "attachModel 后进入模型路径（modelReady = true，默认外观）");
  const variant = l4.variants.get(l4.defaultModelId);
  ok(variant?.ready, "默认外观变体就绪");
  const parts = variant.buckets.tierParts.flat().map((p) => p.mesh);
  ok(parts.length >= 3, `模型部件三档桶网格已装配（${parts.length} 个）`);
  for (const mesh of parts) {
    eq(mesh.boundingSphere, null, "GLB 部件网格装配时**不**显式赋值包围球（保留几何紧球路径，SHALL NOT 替换为全场球）");
    /* 部件几何由 attachModel 居中 + 归一化（`computeBoundingBox` 已产出 boundingBox）；
       惰性射线路径下由几何算出紧球——此处按同一口径复核其紧度。 */
    if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
    close(mesh.geometry.boundingSphere.radius, expectTight, "部件紧球半径 = 居中后几何包围盒球（未被替换为全场球）", 1e-4);
    ok(mesh.geometry.boundingSphere.radius < l4._fieldSphere.radius, "部件紧球 < 全场球（模型路径的 early-out 有效）");
  }
  const pickList = l4.pickMeshes();
  ok(pickList.includes(l4.pickMesh), "模型路径下代理网格在拾取集合内（pickMeshes 双轨一致）");
  ok(pickList.includes(parts[0]), "模型路径下部件网格仍在拾取集合（代理 + 部件共同求交）");
  /* 模型路径的代理同步同样挂载（定档之后、姿态已算之处） */
  l4.setBees([bee("m1", 0, 0)]);
  l4.frame(16, { x: 0, y: 60, z: 0 });
  ok(l4.pickMesh.count >= 1, "模型路径下代理逐帧同步（frameModel 内同一挂点）");
  ok(l4._pickSphere.radius > 0, "模型路径下群体早退球同样维护（两条通路一致）");
}

/* ── 9. 图元路径 GLB 变体装配时（默认外观未就绪）的静态球不受影响 ── */
{
  const l5 = new BeeLayer(new THREE.Scene(), { reduced: false });
  l5.setFieldExtent([{ worldCenter: { x: 0, z: 0 }, layer: 3 }]);
  const root = new THREE.Group();
  root.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial()));
  l5.attachModel(root, "purple");
  for (const mesh of l5.buckets.tierParts.flat().map((p) => p.mesh)) {
    ok(mesh.boundingSphere && mesh.boundingSphere.radius > 0, "非默认外观装配不影响图元桶网格静态球（图元通路兜底不变）");
  }
  ok(l5.modelReady === false, "非默认外观就绪不切换模型路径（图元通路仍激活）");
  ok(l5.pickMeshes().includes(l5.pickMesh), "图元通路下代理网格同样在拾取集合内");
}

/* ── 10. 端到端手势路径（任务 6.3/6.5 的自动化等价物）：真 `BeeLayer` + 真
   `GestureController` + 真相机 ⇒ 指针事件走完整 `pick()`（群体早退 + 逐网格射线求交），
   断言「点蜂命中该蜂」「按下判型抗漂移」「右键菜单取按下落点」「拖拽/框选语义不变」。
   这不替代浏览器里的观感验收（6.3–6.7 的运行态项），但把「射线→命中→分类→分发」这条
   链路在 Node 里锁死——拾取失效类的回归会在此处直接失败。 ── */
{
  const prevWindow = globalThis.window;
  globalThis.window = { addEventListener() {}, removeEventListener() {} };
  try {
    const W = 800;
    const H = 600;
    const listeners = {};
    const canvas = {
      style: {},
      clientWidth: W,
      clientHeight: H,
      addEventListener: (type, fn) => {
        listeners[type] = fn;
      },
      removeEventListener: () => {},
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
      getBoundingClientRect: () => ({ left: 0, top: 0, width: W, height: H })
    };
    const e2eScene = new THREE.Scene();
    const e2eLayer = new BeeLayer(e2eScene, { reduced: false });
    /* 巢分布覆盖三只蜂（`x ∈ [0,30]`）：静态全场球必须包住全部蜂——蜂分布在布局外时
       全场球会在 raycast 入口整批拒绝（本测试早期用单巢球跑 x=30 的蜂即踩到此点，属
       测试装配问题，非实现缺陷；真实世界的蜂恒在巢内）。 */
    e2eLayer.setFieldExtent([
      { worldCenter: { x: 0, z: 0 }, layer: 3 },
      { worldCenter: { x: 30, z: 0 }, layer: 3 }
    ]);
    /* 相机与蜂位选取（使三条拾取语义同时可测且全部落在画布内）：中景相机下
       nearBee/midBee 入中档紧凑段、farBee 入远档槽位段 ⇒ 同帧覆盖代理的**两段**
       （远档块偏移 = 紧凑段长度），是「远档蜂同样具备宽容热区」的端到端证据。 */
    const e2eBees = [bee("nearBee", 0, 0), bee("midBee", 14, 0), bee("farBee", 30, 0)];
    e2eLayer.setBees(e2eBees);
    const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 4000);
    camera.position.set(0, 40, 40);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);
    e2eLayer.frame(16, camera.position);
    for (let f = 0; f < 40; f++) e2eLayer.frame(16, camera.position); // 冲刷入场动画 → 姿态稳定
    ok(e2eLayer.pickBuckets.slots.size === 1, "（前置）远档蜂落入代理槽位段（远档块偏移 = 紧凑段长度）");

    /* 蜂体当帧位置 → canvas 本地屏幕坐标（与 interact.pointOf 同一坐标系） */
    const screenOf = (id) => {
      const record = e2eLayer.renderList.find((r) => r.id === id);
      const v = new THREE.Vector3(record.world.x, record.pose?.y ?? record.world.y, record.world.z).project(camera);
      return { x: ((v.x + 1) / 2) * W, y: ((-v.y + 1) / 2) * H };
    };
    const calls = [];
    const gc = new GestureController({
      canvas,
      scene: { add() {}, remove() {} },
      camera,
      rig: { spin() {}, pan() {}, zoom() {}, target: new THREE.Vector3() },
      tileField: {},
      territory: { floor: null },
      walls: { mesh: null },
      bees: e2eLayer,
      cups: { mesh: null },
      studioLayersOf: () => [],
      occupancyOf: () => new Map(),
      callbacks: {
        onSelectBee: (id) => calls.push(["select", id]),
        onSelectStudio: (id) => calls.push(["studio", id]),
        onSelectTile: (cell) => calls.push(["tile", cell.q + "," + cell.r]),
        onClearSelection: () => calls.push(["clear"]),
        onBeeMenu: (id) => calls.push(["beeMenu", id]),
        onStudioMenu: (id) => calls.push(["studioMenu", id]),
        onHover: (hover) => calls.push(["hover", hover?.kind ?? null, hover?.id ?? null]),
        onMarqueeMove: () => calls.push(["marqueeMove"]),
        onMarqueeEnd: (rect) => calls.push(["marqueeEnd", rect])
      }
    });
    const ev = (props) => ({ pointerId: 1, button: 0, ...props });
    const clickAt = (p, button = 0) => {
      listeners.pointerdown(ev({ button, clientX: p.x, clientY: p.y }));
      listeners.pointerup(ev({ button, clientX: p.x, clientY: p.y }));
    };
    const selectCalls = () => calls.filter((c) => c[0] === "select").map((c) => c[1]);

    /* 10a. 点近档蜂命中该蜂（SHALL NOT 落到其它分类） */
    const near = screenOf("nearBee");
    clickAt(near);
    eq(selectCalls(), ["nearBee"], "推近后点近档蜂 → 选中该蜂（射线经群体早退 + 逐网格求交命中）");
    eq(calls.filter((c) => c[0] === "studio" || c[0] === "tile" || c[0] === "clear").length, 0, "点蜂 SHALL NOT 改选巢/瓦片/清选中");

    /* 10b. 远档段（T2 冻结槽位）蜂同样可命中：档位无关。远蜂的**代理实例矩阵**由
        「远档块偏移 + 槽位号」定位（`beeAt` 同口径回落），故直接在该实例的当帧世界
        位置上方投射一条向下射线——命中的 instanceId 必须解析回远档蜂。这同时锁定
        「远档蜂在代理里」「远档实例号口径」「矩阵确实写在 远档块偏移+槽位 处」三件事
        （屏幕投影点击对远蜂不可靠：同列近/远蜂的最近命中会先取近蜂）。 */
    calls.length = 0;
    clickAt(screenOf("nearBee"));
    eq(selectCalls(), ["nearBee"], "点近蜂 → 命中该蜂（射线经群体早退 + 逐网格求交命中）");
    ok(e2eLayer.pickBuckets.slots.size >= 1, "（前置）远档槽位段非空");
    {
      const slot = e2eLayer.pickBuckets.slots.get("farBee");
      eq(typeof slot, "number", "远档蜂占用代理槽位（槽位号可解析）");
      const at = e2eLayer.pickBuckets.farOffset + slot;
      eq(e2eLayer.beeAt(e2eLayer.pickMesh, at)?.id, "farBee", "远档实例号（远档块偏移 + 槽位号）解析回远档蜂");
      const mat = new THREE.Matrix4();
      e2eLayer.pickMesh.getMatrixAt(at, mat);
      const center = new THREE.Vector3().setFromMatrixPosition(mat);
      const down = new THREE.Raycaster(new THREE.Vector3(center.x, center.y + 40, center.z), new THREE.Vector3(0, -1, 0));
      ok(e2eLayer.pickRejects(down.ray) === false, "远档蜂上方射线通过群体级早退（早退球覆盖远档蜂）");
      const proxyHits = down.intersectObject(e2eLayer.pickMesh, false);
      ok(proxyHits.length > 0, "远档蜂的代理实例可被射线命中（T2 冻结蜂同样具备宽容热区）");
      eq(e2eLayer.beeAt(proxyHits[0].object, proxyHits[0].instanceId)?.id, "farBee", "远档代理命中解析回远档蜂（T2 拾取语义与近档一致）");
    }

    /* 10c. 宽容球：在蜂体外（视觉轮廓之外、宽容球之内）按下 → 仍命中该蜂。
        取蜂心右移 0.55 世界单位的屏幕偏移（模型视觉半尺寸 ≈ 0.46 < 0.55 < BEE_PICK_RADIUS = 0.8）。 */
    calls.length = 0;
    const offset = new THREE.Vector3(e2eBees[0].x + 0.55, 1, 0).project(camera);
    const loose = { x: ((offset.x + 1) / 2) * W, y: ((-offset.y + 1) / 2) * H };
    clickAt(loose);
    eq(selectCalls(), ["nearBee"], "视觉轮廓外、宽容球内点击 → 命中该蜂（热区 ≥ 宽容球）");

    /* 10d. 按下判型抗漂移：按下时指向 A，松手前把射线可命中物改到别处（模拟蜂体漂移）
        ——单击仍分发到按下时刻的 A。 */
    calls.length = 0;
    listeners.pointerdown(ev({ clientX: near.x, clientY: near.y }));
    const farPos = screenOf("farBee");
    e2eLayer._pickSphere.radius = 0; // 事件之间的帧状态被外力改变（等价于 down→up 之间局面变化）
    e2eLayer._pickSphere.center.set(farPos.x, 0, 0);
    listeners.pointerup(ev({ clientX: farPos.x, clientY: farPos.y }));
    eq(selectCalls(), ["nearBee"], "单击判型取按下落点（up 时刻重拾取不再参与：抗漂移）");
    e2eLayer.frame(16, camera.position); // 恢复早退球

    /* 10e. 右键菜单目标同样取按下落点 */
    calls.length = 0;
    listeners.pointerdown(ev({ button: 2, clientX: near.x, clientY: near.y }));
    listeners.pointerup(ev({ button: 2, clientX: near.x, clientY: near.y }));
    eq(calls.filter((c) => c[0] === "beeMenu").length, 1, "右键单击（未过阈值）→ 触发蜂右键菜单恰一次");
    eq(calls.find((c) => c[0] === "beeMenu")?.[1], "nearBee", "右键菜单目标 = 按下落点的蜂");

    /* 10f. 位移过阈值 → 拖蜂/框选语义不变（不进入单击分支） */
    calls.length = 0;
    listeners.pointerdown(ev({ clientX: near.x, clientY: near.y }));
    listeners.pointermove(ev({ button: -1, clientX: near.x + 40, clientY: near.y + 30 }));
    listeners.pointerup(ev({ clientX: near.x + 40, clientY: near.y + 30 }));
    eq(selectCalls().length, 0, "拖蜂（>5px）SHALL NOT 进入单击分发");

    /* 10g. hover 追踪（tips 数据源）：无按压 pointermove 落在蜂上 → onHover 报 bee */
    calls.length = 0;
    listeners.pointermove(ev({ button: -1, clientX: near.x, clientY: near.y }));
    ok(
      calls.some((c) => c[0] === "hover" && c[1] === "bee" && c[2] === "nearBee"),
      `悬停蜂 → onHover 报 bee（tips 与拾取同源；实际 ${JSON.stringify(calls.slice(0, 3))}）`
    );
    eq(canvas.style.cursor, "pointer", "悬停蜂指针光标为 pointer");

    /* 10h. 蜂群之外：hover 报非蜂（群体级早退拒绝 → 无蜂命中），且不报 bee */
    calls.length = 0;
    listeners.pointermove(ev({ button: -1, clientX: 4, clientY: H - 4 }));
    eq(calls.filter((c) => c[0] === "hover" && c[1] === "bee").length, 0, "蜂群之外悬停 SHALL NOT 报蜂（早退路径 + 无命中）");

    gc.dispose();
  } finally {
    if (prevWindow === undefined) delete globalThis.window;
    else globalThis.window = prevWindow;
  }
}

console.log("ALL BEE PICK SMOKE TESTS PASSED");
