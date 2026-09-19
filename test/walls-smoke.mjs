/**
 * 巢墙层冒烟测试（context-hotbar-rework R7 回归）：WallLayer 头less 直测——
 *  - setStudios：外墙/内隔墙/内轮廓边条装配 + 饰条按选中态分桶（trim/trimDim）；
 *  - setHighlighted：选中巢饰条进辉光桶、其余进无泛光桶（幂等、null = 全暗）；
 *  - applyAppearance：trimGlow 仅作用于辉光桶材质；
 *  - dispose：全部网格与材质清理（含分桶材质）。
 * 背景：setStudios 重构曾误删 innerTrim 创建（null.setMatrixAt → attach 整页降级），
 * 本测试防止该类回归。
 * 运行：node test/walls-smoke.mjs
 */
import * as THREE from "three";
import { WallLayer } from "../src/hive/walls.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* 场景桩：只记录 add/remove（three 的几何/材质/InstancedMesh 构造无需 GL 上下文） */
const added = new Set();
const removed = new Set();
const sceneStub = {
  add(obj) {
    added.add(obj);
  },
  remove(obj) {
    removed.add(obj);
  }
};

const edge = (mx, mz) => ({ mx, mz, dx: 0, dz: 1 });
const studios = [
  { workspaceId: "ws-1", edges: [edge(0, 0)], interiorEdges: [edge(1, 0)] },
  { workspaceId: "ws-2", edges: [edge(5, 0), edge(6, 0)], interiorEdges: [] }
];

const walls = new WallLayer(sceneStub);
walls.setStudios(studios);

ok(walls.mesh && walls.innerMesh && walls.innerTrim && walls.trim && walls.trimDim, "setStudios 装配全部网格（含 innerTrim——回归防护）");
eq(walls.mesh.count, 3, "外墙板 = 逐边实例（1 + 2）");
eq(walls.innerMesh.count, 1, "内隔墙 = 逐内边实例");
eq(walls.innerTrim.count, 1, "内轮廓边条随内隔墙");
eq(walls.trim.count, 0, "初始未选中 → 辉光桶空");
eq(walls.trimDim.count, 3, "初始未选中 → 全部饰条在无泛光桶");
eq(walls.pickIndex, ["ws-1", "ws-2", "ws-2"], "拾取索引 instanceId → workspaceId");

walls.setHighlighted("ws-1");
eq(walls.trim.count, 1, "选中 ws-1 → 其饰条进辉光桶");
eq(walls.trimDim.count, 2, "选中 ws-1 → 其余进无泛光桶");
walls.setHighlighted("ws-1");
eq(walls.trim.count, 1, "setHighlighted 幂等（同值不重建计数不变）");
walls.setHighlighted("ws-2");
eq(walls.trim.count, 2, "切换选中 ws-2 → 辉光桶跟随");
eq(walls.trimDim.count, 1, "切换选中 ws-2 → 无泛光桶跟随");
walls.setHighlighted(null);
eq(walls.trim.count, 0, "清空选中 → 全暗（辉光桶空）");
eq(walls.trimDim.count, 3, "清空选中 → 全部无泛光");

walls.applyAppearance({ trimGlow: 2.5, trimColor: "#ffd700" });
eq(walls.trimMaterial.emissiveIntensity, 2.5, "外观 trimGlow 仅作用于辉光桶材质");
eq(walls.trimDimMaterial.emissiveIntensity, 0.3, "无泛光桶保持低于 Bloom 阈值");

walls.setStudios(studios); // 重建路径（分桶随 highlighted 保持）
eq(walls.trimDim.count, 3, "setStudios 重建后分桶保持（无选中）");

walls.dispose();
eq(removed.size >= 5, true, "dispose 清理全部网格");
console.log("ALL WALLS SMOKE TESTS PASSED");
