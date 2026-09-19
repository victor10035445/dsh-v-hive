/**
 * 蜂层 LOD 距离分桶冒烟测试（render-perf-optimization，无需 WebGL 纯逻辑层，
 * 先例 drone-visibility-smoke / perf-smoke 的伪场景注入）：
 *  - 定档真值表（assignTier 纯函数）：阈值边界（紧/松阈值）、滞回带内不换档、
 *    降档跨档单帧完成、升档逐档恢复、档位随记录持久；
 *  - 强制近档三类边界（design.md D4）：生命周期动画（in/out/toHoney）、描边蜂
 *    （outlineBeeId）、出泡例外集（悬停/选中/展开 anchorIds）——强制帧不改写自然档位；
 *  - 桶统计与 count：三档 mesh count 与当帧分布一致、翅膀 count = 2×T0 数、
 *    castShadow 仅 T0 桶承载（阴影随桶收缩）；
 *  - T2 冻结：连续帧槽位矩阵不变（冻结）、状态变更沿 instanceColor 更新、
 *    离桶/离场释放槽位（槽位表回收 + 空槽零尺度矩阵）、grow 扩容冻结矩阵搬迁；
 *  - 拾取映射：beeAt(mesh, instanceId) 三桶解析一致（并集 = renderList、无重复）；
 *  - 气泡剔除谓词真值表（scene.isBubbleVisible 单一出处）。
 * 运行：node test/render-lod-smoke.mjs
 */
import { worldOf, BEE_RADIUS } from "../src/hex.mjs";
import { BeeLayer, TIER_NEAR, TIER_MID, TIER_FAR, LOD_NEAR, LOD_MID, LOD_HYSTERESIS, assignTier, STATE_COLORS } from "../src/hive/bees.mjs";
import { isBubbleVisible } from "../src/hive/scene.mjs";
import * as THREE from "three";

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 1. 定档真值表（assignTier 纯函数，BEE_RADIUS = 0.8 → 24 / 60 / 1.6） ── */
eq(LOD_NEAR, 24, "LOD_NEAR = 30 × BEE_RADIUS（比例尺锚点倍率）");
eq(LOD_MID, 60, "LOD_MID = 75 × BEE_RADIUS");
eq(LOD_HYSTERESIS, 2 * BEE_RADIUS, "LOD_HYSTERESIS = 2 × BEE_RADIUS");
const tierOf = (prev, dist) => assignTier(prev == null ? {} : { tier: prev }, dist);
/* 首次定档：紧阈值（名义常量） */
eq(tierOf(null, 0), TIER_NEAR, "首次定档 dist 0 → 近档");
eq(tierOf(null, LOD_NEAR), TIER_NEAR, "首次定档 dist = LOD_NEAR → 近档（紧阈值含边界）");
eq(tierOf(null, LOD_NEAR + 0.001), TIER_MID, "首次定档 dist 略超近档 → 中档");
eq(tierOf(null, LOD_MID), TIER_MID, "首次定档 dist = LOD_MID → 中档");
eq(tierOf(null, LOD_MID + 0.001), TIER_FAR, "首次定档 dist 略超中档 → 远档");
/* 滞回带内不换档：带 = (名义阈值, 名义阈值 + 滞回] */
eq(tierOf(TIER_NEAR, LOD_NEAR + LOD_HYSTERESIS), TIER_NEAR, "近档蜂在滞回带外沿不降档（带内不换档）");
eq(tierOf(TIER_NEAR, LOD_NEAR + LOD_HYSTERESIS + 0.001), TIER_MID, "近档蜂越过松阈值 → 中档");
eq(tierOf(TIER_MID, LOD_NEAR), TIER_NEAR, "中档蜂到紧阈值升近档");
eq(tierOf(TIER_MID, LOD_NEAR + LOD_HYSTERESIS), TIER_MID, "中档蜂在近档滞回带内不升档");
eq(tierOf(TIER_MID, LOD_MID + LOD_HYSTERESIS), TIER_MID, "中档蜂在中/远滞回带内不降档");
eq(tierOf(TIER_MID, LOD_MID + LOD_HYSTERESIS + 0.001), TIER_FAR, "中档蜂越过松阈值 → 远档");
eq(tierOf(TIER_FAR, LOD_MID), TIER_MID, "远档蜂到紧阈值升中档");
eq(tierOf(TIER_FAR, LOD_MID + LOD_HYSTERESIS), TIER_FAR, "远档蜂在滞回带内不升档");
/* 降档跨档单帧完成（相机瞬移）、升档逐档恢复（spec「全景缩放全场冻结」） */
eq(tierOf(TIER_NEAR, 500), TIER_FAR, "近档蜂瞬移极远 → 单帧直落远档");
eq(tierOf(TIER_FAR, 10), TIER_MID, "远档蜂瞬移极近 → 逐档恢复（先中档）");
eq(tierOf(TIER_MID, 10), TIER_NEAR, "中档蜂极近 → 升近档");

/* ── 2. BeeLayer 集成：桶统计 / 强制近档 / T2 冻结 / 槽位表 ── */
const layer = new BeeLayer(new THREE.Scene(), { reduced: false });
const bee = (id, x, state = "busy", extra = {}) => ({ id, x, z: 0, y: 0, state, scale: 1, droneOf: null, phase: 0.5, ...extra });
const cameraFar = { x: 0, y: 0, z: 0 }; // 蜂 y=0 → 距离 = |x|

/* 装配：近(10) / 中(40) / 远(100) 各一只 */
layer.setBees([bee("A", 10), bee("B", 40), bee("C", 100, "done")]);
layer.frame(16, cameraFar);
const buckets = layer.buckets;
eq(buckets.counts[TIER_NEAR], 1, "近档桶 1 只");
eq(buckets.counts[TIER_MID], 1, "中档桶 1 只");
eq(buckets.slots.size, 1, "远档槽位表 1 只");
eq(layer.buckets.tierParts[TIER_NEAR][0].mesh.count, 1, "T0 body mesh.count = 1");
eq(layer.buckets.tierParts[TIER_MID][0].mesh.count, 1, "T1 body mesh.count = 1");
eq(layer.buckets.tierParts[TIER_FAR][0].mesh.count, 1, "T2 body mesh.count = 槽位高水位");
eq(layer.wings.count, 2, "翅膀 count = 2 × T0 数");
for (const tierParts of buckets.tierParts) {
  for (const part of tierParts) {
    eq(part.mesh.castShadow, part.mesh.userData.pick.tier === TIER_NEAR, "castShadow 仅 T0 桶承载（阴影随桶收缩）");
  }
}
eq(layer.wings.castShadow, true, "翅膀（仅 T0 存在）投影阴影");
eq(buckets.records[TIER_NEAR][0].id, "A", "T0 拾取表 = 当帧桶内序号");
eq(buckets.records[TIER_MID][0].id, "B", "T1 拾取表 = 当帧桶内序号");
eq(buckets.records[TIER_FAR][buckets.slots.get("C")].id, "C", "T2 拾取表按槽位解析");

/* T2 冻结：连续帧槽位矩阵不变 */
const slotC = buckets.slots.get("C");
const frozenMatrix = buckets.tierParts[TIER_FAR][0].mesh.instanceMatrix.array.slice(slotC * 16, slotC * 16 + 16);
for (let f = 0; f < 10; f++) layer.frame(16, cameraFar);
const stillFrozen = buckets.tierParts[TIER_FAR][0].mesh.instanceMatrix.array.slice(slotC * 16, slotC * 16 + 16);
ok(Array.from(frozenMatrix).every((v, i) => v === stillFrozen[i]), "T2 连续帧矩阵冻结（SHALL NOT 逐帧重写）");

/* 强制近档（D4.2 描边蜂）：远档蜂被描边 → 当帧完整姿态 + 遮罩矩阵新鲜 */
layer.setOutlineBeeId("C");
layer.frame(16, cameraFar);
eq(layer.buckets.counts[TIER_NEAR], 2, "描边蜂强制近档（A + C 进近档桶）");
eq(layer.buckets.counts[TIER_MID], 1, "中档桶不受影响");
eq(buckets.slots.size, 0, "描边蜂离桶沿释放 T2 槽位");
eq(layer.maskBody.count, 1, "描边蜂遮罩矩阵当帧写入");
eq(layer.beeMap.get("C").tier, TIER_FAR, "强制帧 SHALL NOT 改写自然档位（解除后按滞回回落）");
layer.setOutlineBeeId(null);
layer.frame(16, cameraFar);
eq(buckets.slots.size, 1, "描边解除 → 回落自然档（T2 重新进桶）");
eq(buckets.slots.get("C"), slotC, "槽位回收后复用同一槽（LIFO）");
const refrozen = buckets.tierParts[TIER_FAR][0].mesh.instanceMatrix.array.slice(slotC * 16, slotC * 16 + 16);
ok(Array.from(refrozen).every((v, i) => v === stillFrozen[i]), "重新进桶沿重新冻结（姿态定格不漂移）");

/* 强制近档（D4.3 出泡例外集）：anchorIds（悬停/选中/展开） */
layer.anchorIds.add("C");
layer.frame(16, cameraFar);
eq(layer.buckets.counts[TIER_NEAR], 2, "出泡蜂（anchorIds）强制近档");
eq(buckets.slots.size, 0, "出泡蜂离桶沿释放 T2 槽位");
layer.anchorIds.clear();
layer.frame(16, cameraFar);
eq(buckets.slots.size, 1, "例外解除 → 回落自然档");

/* 强制近档（D4.1 生命周期动画）：离场/入场/化蜜动画远处完整逐帧播放 */
layer.setBees([bee("A", 10), bee("B", 40)]); // C 缺席 → 退场动画 out
layer.frame(16, cameraFar);
ok(layer.renderList.some((r) => r.id === "C" && r.anim === "out"), "缺席差分触发离场动画");
eq(buckets.counts[TIER_NEAR], 2, "离场动画蜂强制近档（远处 SHALL NOT 定格跳变）");
eq(buckets.slots.size, 0, "离场蜂不再占用 T2 槽位");
for (let f = 0; f < 40; f++) layer.frame(16, cameraFar); // 640ms > 420ms 离场时长
layer.setBees([bee("A", 10), bee("B", 40)]);
eq(layer.renderList.some((r) => r.id === "C"), false, "离场播完脱离渲染/拾取列表");
eq(buckets.slots.size, 0, "离场播完 T2 槽位保持回收（无泄漏）");

/* 状态变更沿：冻结蜂状态色仅变更沿更新一次 */
layer.setBees([bee("A", 10), bee("B", 40), bee("C", 100, "done")]);
for (let f = 0; f < 30; f++) layer.frame(16, cameraFar); // 重现触发入场动画（480ms > 420ms）→ 播完回落自然档
eq(buckets.slots.size, 1, "入场播完后 C 回落远档冻结");
const slotC2 = buckets.slots.get("C");
const abdMesh = buckets.tierParts[TIER_FAR].find((p) => p.tinted).mesh;
const colorOf = (slot) => abdMesh.instanceColor.array.slice(slot * 3, slot * 3 + 3);
const doneColor = colorOf(slotC2);
layer.frame(16, cameraFar);
layer.frame(16, cameraFar);
ok(Array.from(colorOf(slotC2)).every((v, i) => v === doneColor[i]), "T2 状态色不随帧漂移");
layer.setBees([bee("A", 10), bee("B", 40), bee("C", 100, "help")]);
layer.frame(16, cameraFar);
const helpColor = colorOf(slotC2);
const expectHelp = STATE_COLORS.help;
ok(
  Math.abs(helpColor[0] - expectHelp.r) < 1e-3 && Math.abs(helpColor[1] - expectHelp.g) < 1e-3 && Math.abs(helpColor[2] - expectHelp.b) < 1e-3,
  "T2 状态变更沿 instanceColor 更新（颜色实时跟随语义保留）"
);

/* 滞回集成：蜂从近档缓慢远离 → 带内不换档、越过松阈值才降档 */
layer.setBees([bee("H", 10)]);
for (let f = 0; f < 40; f++) layer.frame(16, cameraFar); // 冲刷 A/B/C 离场动画
layer.frame(16, cameraFar);
eq(layer.beeMap.get("H").tier, TIER_NEAR, "H 初始近档");
layer.setBees([bee("H", 25)]); // 带内（24, 25.6]
layer.frame(16, cameraFar);
eq(layer.beeMap.get("H").tier, TIER_NEAR, "滞回带内不换档（无闪烁）");
eq(buckets.counts[TIER_NEAR], 1, "带内蜂仍在近档桶");
layer.setBees([bee("H", 27)]); // 越过松阈值
layer.frame(16, cameraFar);
eq(layer.beeMap.get("H").tier, TIER_MID, "越过松阈值 → 中档");
eq(buckets.counts[TIER_NEAR], 0, "近档桶随降档收缩");

/* 拾取映射：三桶解析一致（并集 = renderList、无重复、跨桶可拾取） */
layer.setBees([bee("A", 10), bee("B", 40), bee("C", 100, "done")]);
for (let f = 0; f < 30; f++) layer.frame(16, cameraFar); // 冲刷 H 离场与 C 入场动画
layer.setBees([bee("A", 10), bee("B", 40), bee("C", 100, "done")]); // 镜像 tick：播完离场记录脱离渲染列表（既有簿记语义）
layer.frame(16, cameraFar);
eq(layer.renderList.length, 3, "离场播完后渲染列表收敛（无残留记录）");
const picked = [];
for (const tierParts of buckets.tierParts) {
  for (const part of tierParts) {
    if (part.mesh.userData.pick.tier === TIER_FAR) continue; // T2 为槽位稀疏表：仅遍历占用槽
    for (let i = 0; i < part.mesh.count; i++) {
      const record = layer.beeAt(part.mesh, i);
      ok(record, `桶内实例 ${i} 可拾取解析（远档拾取资格不变）`);
      picked.push(record.id);
    }
  }
}
for (const slot of buckets.slots.values()) {
  const record = layer.beeAt(buckets.tierParts[TIER_FAR][0].mesh, slot);
  ok(record, "T2 占用槽可拾取解析");
  picked.push(record.id);
}
eq(new Set(picked).size, 3, "三桶拾取解析唯一（并集 = renderList；body/abdomen 双网格重复命中同一蜂）");
ok(picked.includes("A") && picked.includes("B") && picked.includes("C"), "三档全部可拾取（并集 = renderList）");
eq(layer.beeAt(buckets.tierParts[TIER_FAR][0].mesh, buckets.slots.get("C")).id, "C", "T2 槽位拾取解析正确（迁移沿后）");
eq(layer.beeAt(buckets.tierParts[TIER_FAR][0].mesh, 999), null, "空槽拾取越界 → null");

/* grow 扩容：T2 冻结矩阵随缓冲搬迁（防重算 pose 跳变） */
const frozenBeforeGrow = buckets.tierParts[TIER_FAR][0].mesh.instanceMatrix.array.slice(slotC2 * 16, slotC2 * 16 + 16);
const many = [];
for (let i = 0; i < 130; i++) many.push(bee("M" + i, 200 + i));
many.push(bee("A", 10), bee("B", 40), bee("C", 100, "help"));
layer.setBees(many);
ok(layer.maxBees >= 130, "grow 扩容触发");
layer.frame(16, cameraFar);
const slotC3 = buckets.slots.get("C");
const frozenAfterGrow = buckets.tierParts[TIER_FAR][0].mesh.instanceMatrix.array.slice(slotC3 * 16, slotC3 * 16 + 16);
ok(Array.from(frozenBeforeGrow).every((v, i) => v === frozenAfterGrow[i]), "grow 扩容 T2 冻结矩阵原样搬迁");
eq(buckets.slots.size, 131, "C 保持原槽 + 130 只远蜂全部冻结入槽");

/* 离场播完 → 槽位批量回收（镜像收缩） */
const keep = [bee("A", 10), bee("B", 40), bee("C", 100, "help")];
layer.setBees(keep);
for (let f = 0; f < 30; f++) layer.frame(16, cameraFar); // 冲刷 M* 离场动画
layer.setBees(keep); // 镜像 tick：播完记录脱离渲染列表
layer.frame(16, cameraFar);
eq(buckets.slots.size, 1, "镜像收缩后仅 C 在 T2");

/* 全景冻结（相机瞬移拉远）：整群单帧跨档重排 */
layer.frame(16, { x: 0, y: 0, z: 1000 });
eq(buckets.counts[TIER_NEAR], 0, "全景距离近档清空");
eq(buckets.counts[TIER_MID], 0, "全景距离中档清空");
eq(buckets.slots.size, 3, "整群单帧完成 T2 重排（A/B/C 全冻结）");
/* 推近逐档恢复：A ≈ 30、B ≈ 42（均入中档），C ≈ 95 仍远档 */
layer.frame(16, { x: 10, y: 0, z: 30 });
eq(buckets.counts[TIER_MID], 2, "推近后 A/B 逐档恢复中档（动画保留）");
eq(buckets.slots.size, 1, "C 保持冻结");

/* ── 2b. 多选描边集合渲染（hive-marquee-and-card-rework 3.1/3.3）：集合写入 / 容量扩容 ── */
{
  layer.setOutlineBeeIds(new Set(["A", "C"]));
  layer.frame(16, cameraFar);
  eq(buckets.counts[TIER_NEAR], 2, "描边集合成员强制近档（A+C 进近档桶；B 不在集合保持自然档）");
  eq(buckets.counts[TIER_MID], 1, "非集合成员档位不受影响（B 中档）");
  eq(layer.maskBody.count, 2, "图元路径遮罩 count = 集合蜂数（A+C 各写一实例）");
  ok(layer._maskCapacity >= 2, "遮罩容量 ≥ 写入数（按需扩容纪律）");
  layer.setOutlineBeeIds(new Set(["A", "B", "C"]));
  layer.frame(16, cameraFar);
  eq(layer.maskBody.count, 3, "集合扩至三只 → 遮罩 count = 3（逐只递增实例槽）");
  layer.setOutlineBeeIds(null);
  layer.frame(16, cameraFar);
  eq(layer.maskBody.count, 0, "集合清空 → 遮罩 count = 0（描边消失）");
  eq(buckets.slots.size, 1, "解除后回落自然档（C 回 T2 冻结；A/B 自然近/中档）");
  /* 单值兼容接口：setOutlineBeeId 内部转集合（既有断言面零漂移） */
  layer.setOutlineBeeId("B");
  layer.frame(16, cameraFar);
  eq(layer.maskBody.count, 1, "setOutlineBeeId 兼容封装 → 单蜂遮罩 count = 1");
  layer.setOutlineBeeId(null);
  layer.frame(16, cameraFar);
  /* 大集合按需扩容：10 只描边蜂 → 容量一次性增长到位 */
  const outlinedMany = [];
  for (let i = 0; i < 10; i++) outlinedMany.push(bee("O" + i, 10 + i));
  layer.setBees(outlinedMany);
  layer.setOutlineBeeIds(new Set(outlinedMany.map((b) => b.id)));
  layer.frame(16, cameraFar);
  eq(layer.maskBody.count, 10, "10 只描边蜂全量写入（3.1 集合渲染）");
  ok(layer._maskCapacity >= 10, "maskBody/maskAbd 容量按镜像蜂数扩容（≥10）");
  layer.setOutlineBeeIds(null);
  layer.frame(16, cameraFar);
}

/* ── 3. reduced-motion × 分桶正交：降级下档位机制照常生效 ── */
const reducedLayer = new BeeLayer(new THREE.Scene(), { reduced: true });
reducedLayer.setBees([bee("A", 10), bee("B", 40), bee("C", 100, "done")]);
reducedLayer.frame(16, cameraFar);
eq(reducedLayer.buckets.counts[TIER_NEAR], 1, "reduced：近档桶照常");
eq(reducedLayer.buckets.slots.size, 1, "reduced：远档冻结照常（阴影/上传收缩收益保留）");
eq(reducedLayer.wings.count, 2, "reduced：翅膀渲染但拍动停用（既有语义）");
reducedLayer.dispose();

/* ── 4. 气泡剔除谓词真值表（scene.isBubbleVisible 单一出处） ── */
eq(isBubbleVisible(undefined, false), true, "档位未知（首帧前）→ 可见（默认常驻语义）");
eq(isBubbleVisible(TIER_NEAR, false), true, "近档 → 可见");
eq(isBubbleVisible(TIER_MID, false), true, "中档 → 可见");
eq(isBubbleVisible(TIER_FAR, false), false, "远档且非例外 → 剔除（满屏气泡噪点收缩）");
eq(isBubbleVisible(TIER_FAR, true), true, "远档但悬停/选中/展开 → 例外可见");

layer.dispose();
console.log("ALL RENDER-LOD SMOKE TESTS PASSED");
