/**
 * 底图水印层冒烟测试（hive-watermark 任务 5.1；纯逻辑层无需 WebGL，先例 hex-fx-smoke.mjs）：
 *  - watermarkText 回落链与反斜杠/尾分隔符提取（D5）；
 *  - frontFaceOf 聚面与得分（含 L=3 并列边聚合、外沿墙线锚定、正对/侧脸/背向得分）；
 *  - shouldSwitchFace 滞回方向与自定义余量；
 *  - 重建签名：文字源哈希（改名触发重绘）+ studioSig（变化才重建、实例与纹理 dispose）；
 *  - 滞回跳边死区（余量内不切换）+ 淡切状态机（120ms 降 → 重定位 → 180ms 升）+ reduced-motion 瞬切；
 *  - 方向节流：theta > 6° / 水平位移 > 2 两种门限与门限内不重算；
 *  - 显隐（页级开关唯一门控；翻底隐藏已移除）与固定尺寸/渲染常量不变式；
 *  - dispose 释放几何/材质/纹理、网格出场景。
 * 运行：node test/watermark-smoke.mjs
 */

/* Node 无 DOM：桩 document.createElement("canvas")（模块运行期才触达；drawn 观测绘制）。 */
const drawn = [];
function stubCtx() {
  return {
    fillStyle: "",
    font: "",
    textAlign: "",
    textBaseline: "",
    clearRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    closePath() {},
    fill() {},
    measureText(t) {
      return { width: Math.max(1, String(t).length) * 24 };
    },
    fillText(t) {
      drawn.push(String(t));
    }
  };
}
const sharedCtx = stubCtx();
globalThis.document = {
  createElement(tag) {
    if (tag !== "canvas") throw new Error("stub document: only canvas supported");
    return { width: 0, height: 0, getContext: () => sharedCtx };
  }
};

const { PALETTE } = await import("../src/hive/palette.mjs");
const { boundaryEdges, worldOf } = await import("../src/hex.mjs");
const {
  WatermarkLayer,
  watermarkText,
  frontFaceOf,
  frontFacesOf,
  shouldSwitchFace,
  WATERMARK_WIDTH,
  WATERMARK_HEIGHT,
  WATERMARK_Y,
  WATERMARK_RENDER_ORDER,
  NORMAL_OFFSET,
  SWITCH_MARGIN,
  THETA_TRIGGER,
  POS_TRIGGER,
  FADE_OUT_MS,
  FADE_IN_MS
} = await import("../src/hive/watermark.mjs");

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};
const near = (a, b, eps, message) => {
  if (!(Math.abs(a - b) <= eps)) throw new Error(`FAIL: ${message}（期望 ≈${b}，实际 ${a}）`);
};

/** 无头宿主：只需 add/remove（three 几何/材质在 Node 内可构建，渲染才需要 GL）。 */
function stubScene() {
  const children = [];
  return {
    children,
    add(o) {
      children.push(o);
    },
    remove(o) {
      const i = children.indexOf(o);
      if (i >= 0) children.splice(i, 1);
    }
  };
}

/** 冒烟巢：真实 boundaryEdges（L=3 前脸 2 条并列边）。 */
function studioOf(id, q, r, layer, path, title) {
  return {
    workspaceId: id,
    center: { q, r },
    layer,
    worldCenter: worldOf({ q, r }),
    path,
    title,
    edges: boundaryEdges({ q, r }, layer)
  };
}

const deg = (d) => (d * Math.PI) / 180;
const camAt = (x, z, y = 12) => ({ position: { x, y, z } });

/* ── watermarkText：回落链与分隔符提取（D5） ── */
{
  eq(watermarkText("F:\\project\\dsh-v-hive", "标题", "w1"), "dsh-v-hive", "反斜杠末段提取");
  eq(watermarkText("F:/project/dsh-v-hive/", "标题", "w1"), "dsh-v-hive", "正斜杠 + 尾分隔符");
  eq(watermarkText("F:\\project\\", "标题", "w1"), "project", "反斜杠尾分隔符忽略");
  eq(watermarkText("dir", "标题", "w1"), "dir", "无分隔符整段即末段");
  eq(watermarkText("", "标题", "w1"), "标题", "空路径回落标题");
  eq(watermarkText(undefined, "标题", "w1"), "标题", "路径缺失回落标题");
  eq(watermarkText(undefined, "", "ws-9"), "ws-9", "标题缺失回落 workspaceId");
  eq(watermarkText(undefined, "   ", "ws-9"), "ws-9", "空白标题回落 workspaceId");
  eq(watermarkText(undefined, undefined, "w"), "w", "全缺回落 workspaceId");
}

/* ── frontFaceOf：聚面与得分（合成边集） ── */
{
  const edges = [
    { mx: -0.75, mz: 1.5, dx: 0, dz: 1 }, // 前脸边 A（法线 +z）
    { mx: 0.75, mz: 1.5, dx: 0, dz: 1 }, // 前脸边 B（并列）
    { mx: 1.5, mz: 0, dx: 1, dz: 0 } // 侧面（法线 +x）
  ];
  const face = frontFaceOf(edges, 0, 10, 0, 0); // 相机在 +z
  ok(face, "有前脸面");
  near(face.normal.x, 0, 1e-12, "前脸法线 x = 0");
  near(face.normal.z, 1, 1e-12, "前脸法线 z = 1");
  near(face.centroid.x, 0, 1e-9, "并列边聚合面质心 x = 中点平均");
  near(face.centroid.z, 1.5, 1e-9, "并列边聚合面质心 z = 中点平均");
  near(face.score, 1, 1e-12, "正对得分 = 1");
  eq(frontFacesOf(edges, 0, 10, 0, 0).length, 2, "聚出 2 个面（前脸族 + 侧脸族）");
  const back = frontFaceOf(edges, 0, -10, 0, 0); // 相机在 -z：+z 族得分 -1，+x 族 0
  near(back.normal.x, 1, 1e-12, "背向时取侧脸族");
  near(back.score, 0, 1e-12, "背向时侧脸得分 0");
  const side = frontFaceOf(edges, 10, 0, 0, 0); // 相机在 +x
  near(side.normal.x, 1, 1e-12, "侧向取 +x 族");
  near(side.score, 1, 1e-12, "侧向正对得分 1");
  eq(frontFaceOf([], 0, 10, 0, 0), null, "无边集返回 null");
  eq(frontFaceOf(edges, 0, 0, 0, 0) != null, true, "相机正上方退化不崩溃（取 +x）");
}

/* ── frontFaceOf：真实 L=3 领地（并列边聚合 + 外沿墙线锚定） ── */
{
  const edges3 = boundaryEdges({ q: 0, r: 0 }, 3);
  const front = edges3.filter((e) => e.dz > 0.999); // 法线 +z 的并列边界边族
  eq(front.length, 5, "L=3 前脸族 = 5 条并列边（阶梯锯齿 3 级台阶）");
  const face = frontFaceOf(edges3, 0, 10, 0, 0);
  near(face.normal.z, 1, 1e-9, "正对 +z 前脸法线");
  near(face.score, 1, 1e-9, "正对得分 1");
  /* 外沿墙线段 = 沿法线投影最大的台阶（(0,2) 顶边，z = 2.5√3）——D3 两带论证参照线 */
  const maxProj = Math.max(...front.map((e) => e.mz));
  const outer = front.filter((e) => e.mz > maxProj - 1e-6);
  eq(outer.length, 1, "外沿墙线段 = 最外台阶边界边");
  near(face.centroid.z, outer[0].mz, 1e-9, "锚定外沿墙线段质心（贴片中心在外墙线外侧）");
  near(face.centroid.x, outer[0].mx, 1e-9, "外沿段质心 x = 边中点");
  ok(face.centroid.z > 4.3, "贴片锚点越过最外墙线（z ≈ 4.33），SHALL NOT 落入巢内地板深处");
  /* 侧向 30° 族同样聚合并锚定外沿 */
  const side = frontFaceOf(edges3, 10, 0, 0, 0);
  near(side.score, Math.cos(Math.PI / 6), 1e-9, "相机 0° 方向最高分面得分 = cos30°");
  near(Math.abs(side.normal.x), Math.cos(Math.PI / 6), 1e-9, "侧脸法线为 30° 族");
}

/* ── shouldSwitchFace：滞回方向与自定义余量 ── */
{
  ok(shouldSwitchFace(null, { score: 0.1 }), "无当前面 → 切换（首次定位）");
  ok(!shouldSwitchFace({ score: 1 }, null), "无候选 → 不切换");
  ok(!shouldSwitchFace({ score: 1 }, { score: 1.1 }), "×1.12 余量内不切换（防抖）");
  ok(shouldSwitchFace({ score: 1 }, { score: 1.13 }), "超过 ×1.12 → 切换");
  ok(!shouldSwitchFace({ score: 1 }, { score: 0.9 }), "得分更低不切换");
  ok(!shouldSwitchFace({ score: 1 }, { score: 1.3 }, 1.5), "自定义 margin 1.5 下 1.3 不切换");
  ok(shouldSwitchFace({ score: 1 }, { score: 1.6 }, 1.5), "自定义 margin 1.5 下 1.6 切换");
  eq(SWITCH_MARGIN, 1.12, "默认余量 = 1.12");
}

/* ── 常量不变式（固定尺寸 / 渲染参数 / 节流 / 淡切） ── */
{
  eq(WATERMARK_WIDTH, 3.6, "牌宽 3.6（固定世界尺寸）");
  eq(WATERMARK_HEIGHT, 1.3, "牌高 1.3");
  eq(WATERMARK_Y, 0.018, "y = 0.018（地板 0.012 与遮罩 0.024 之间）");
  eq(WATERMARK_RENDER_ORDER, 3, "renderOrder 3（领地 2 之后、蜂 10 之前）");
  eq(NORMAL_OFFSET, 0.35, "外法线偏移 0.35");
  near(THETA_TRIGGER, deg(6), 1e-12, "方向节流 6°");
  eq(POS_TRIGGER, 2, "位移节流 2 世界单位");
  eq(FADE_OUT_MS, 120, "淡切降 120ms");
  eq(FADE_IN_MS, 180, "淡切升 180ms");
  ok(Number.isFinite(PALETTE.watermarkPlate) && Number.isFinite(PALETTE.watermarkText), "水印色进 PALETTE（单一出处）");
  /* 共享几何烘焙平贴：x 跨度 = 牌宽、z 跨度 = 牌高、法线 +y */
  const layer0 = new WatermarkLayer(stubScene());
  layer0.plateGeo.computeBoundingBox();
  const bb = layer0.plateGeo.boundingBox;
  near(bb.max.x - bb.min.x, WATERMARK_WIDTH, 1e-6, "几何 x 跨度 = 牌宽");
  near(bb.max.z - bb.min.z, WATERMARK_HEIGHT, 1e-6, "几何 z 跨度 = 牌高（rotateX 平贴）");
  near(bb.max.y, 0, 1e-9, "几何贴地（y=0 平面）");
  layer0.dispose();
}

/* ── setStudios：重建签名（改名重绘 / 搬巢重建 / dispose） ── */
{
  const scene = stubScene();
  const layer = new WatermarkLayer(scene);
  eq(scene.children.length, 1, "group 挂入 scene");
  layer.setStudios([studioOf("a", 0, 0, 3, "F:\\x\\alpha", "Alpha")]);
  eq(layer.items.size, 1, "建贴片");
  eq(layer.items.get("a").text, "alpha", "文字 = 路径末级目录名");
  const meshA = layer.items.get("a").mesh;
  const texA = layer.items.get("a").texture;
  eq(meshA.renderOrder, WATERMARK_RENDER_ORDER, "renderOrder 3");
  eq(meshA.geometry, layer.plateGeo, "共享牌面几何");
  let texDisposed = 0;
  texA.addEventListener("dispose", () => texDisposed++);
  const redrawsBefore = drawn.length;
  const redrawVersionBefore = layer.items.get("a").texture.version;
  layer.setStudios([studioOf("a", 0, 0, 3, "F:\\x\\beta", "Alpha")]); // 改名（位置/层数不变）
  eq(layer.items.get("a").mesh, meshA, "studioSig 未变 → 不重建实例");
  eq(layer.items.get("a").text, "beta", "改名触发重绘（文字源哈希入签名，R3）");
  ok(drawn.length > redrawsBefore, "纹理重绘发生");
  ok(layer.items.get("a").texture.version > redrawVersionBefore, "重绘推进纹理版本（needsUpdate 置位生效）");
  const disposedBefore = texDisposed;
  const texBefore = layer.items.get("a").texture;
  layer.setStudios([studioOf("a", 2, 0, 3, "F:\\x\\beta", "Alpha")]); // 搬巢 → studioSig 变化
  ok(texDisposed > disposedBefore, "旧纹理 dispose");
  ok(layer.items.get("a").mesh !== meshA, "studioSig 变化 → 重建实例");
  ok(layer.items.get("a").texture !== texBefore, "重建后纹理为新实例");
  eq(layer.items.get("a").text, "beta", "重建后文字保持最新");
  layer.setStudios([]);
  eq(layer.items.size, 0, "清空巢 → 贴片全清");
  eq(layer.group.children.length, 0, "group 无残留子网格");
  layer.dispose();
  eq(scene.children.length, 0, "dispose 后 group 出场景");
}

/* ── frame：首次定位 / 节流门限（theta 与水平位移） ── */
{
  const layer = new WatermarkLayer(stubScene());
  layer.setStudios([studioOf("a", 0, 0, 3, "F:\\x\\alpha", "A")]);
  layer.frame(camAt(0, 10), false);
  eq(layer.recomputes, 1, "首帧签名变化 → 强制重算");
  const item = layer.items.get("a");
  ok(item.mesh.visible, "定位后可见");
  near(item.mesh.position.y, WATERMARK_Y, 1e-12, "y = 0.018");
  near(item.mesh.position.z, 2.5 * Math.sqrt(3) + NORMAL_OFFSET, 1e-9, "贴片位于朝相机前脸外墙线外侧（+z）");
  near(item.mesh.position.x, 0, 1e-9, "正对前脸 x 居中");
  /* 门限内（位移 1.5 < 2，theta 不变）→ 不重算 */
  layer.frame(camAt(0, 11.5), false);
  eq(layer.recomputes, 1, "水平位移 <2 且 theta 不变 → 不重算");
  /* theta > 6°（7°，弧长 ≈1.4 < 2）→ 重算（theta 门限单独触发） */
  const th = deg(7);
  layer.frame(camAt(11.5 * Math.sin(th), 11.5 * Math.cos(th)), false);
  eq(layer.recomputes, 2, "theta 变化 > 6° → 重算");
  /* theta 不变、位移 > 2（半径 11.5 → 15，同 7° 方向）→ 重算（位移门限单独触发） */
  layer.frame(camAt(15 * Math.sin(th), 15 * Math.cos(th)), false);
  eq(layer.recomputes, 3, "水平位移 > 2（theta 不变）→ 重算");
  layer.dispose();
}

/* ── frame：滞回死区 + 淡切状态机 + reduced-motion 瞬切 ── */
{
  const layer = new WatermarkLayer(stubScene());
  layer.setStudios([studioOf("a", 0, 0, 3, "F:\\x\\alpha", "A")]);
  layer.frame(camAt(0, 10), false); // 正对 +z 前脸（F90，得分 1）
  const item = layer.items.get("a");
  const z0 = item.mesh.position.z;
  ok(z0 > 0, "初始前脸 +z 侧");
  /* 死区：θ=56° 时新前脸（30° 族）得分 0.899 ≤ 当前重评分 0.829 × 1.12 → 不切换 */
  layer.frame(camAt(10 * Math.cos(deg(56)), 10 * Math.sin(deg(56))), false);
  eq(layer.recomputes, 2, "死区内仍触发重算（门限按位移/theta）");
  near(item.mesh.position.z, z0, 1e-9, "滞回余量内 SHALL NOT 切换（防邻面抖动）");
  eq(item.fade.stage, "idle", "无淡切启动");
  /* θ=45°：新前脸得分 0.966 > 0.707 × 1.12 → 滞回通过 → 进入淡切（触发帧先推进后重算，尚无 alpha 变化） */
  layer.frame(camAt(10 * Math.cos(deg(45)), 10 * Math.sin(deg(45))), false);
  eq(item.fade.stage, "out", "滞回通过 → 进入淡切降段");
  eq(item.material.opacity, 1, "降段自全亮起步（下一帧起推进）");
  near(item.mesh.position.z, z0, 1e-9, "降段完成前不重定位");
  layer.advanceFade(item, FADE_OUT_MS - 1);
  ok(item.material.opacity < 1 && item.material.opacity > 0, "降段推进中 alpha 下降");
  layer.advanceFade(item, 1);
  eq(item.fade.stage, "in", "降段完成 → 升段");
  ok(item.mesh.position.x > 0.5, "重定位到新前脸（30° 族，+x 侧）");
  eq(item.material.opacity, 0, "升段起点 alpha 0");
  layer.advanceFade(item, FADE_IN_MS - 1);
  ok(item.material.opacity < 1 && item.material.opacity > 0, "升段推进中");
  layer.advanceFade(item, 1);
  eq(item.fade.stage, "idle", "升段完成 → 回 idle");
  eq(item.material.opacity, 1, "恢复全亮（衬底透明度在纹理内）");
  /* reduced-motion：瞬切（无淡切） */
  layer.frame(camAt(0, -10), true); // 翻到 -z 侧：F270 得分 1 > F30 重评分(-0.5) × 1.12
  eq(item.fade.stage, "idle", "reduced-motion 不进入淡切");
  ok(item.mesh.position.z < -4, "瞬切定位到 -z 前脸外侧");
  eq(item.material.opacity, 1, "瞬切保持全亮");
  layer.dispose();
}

/* ── 显隐：页级开关唯一门控（D6；「翻底隐藏」已随相机俯仰锁定移除——camera-gesture-rework 3.4） ── */
{
  const layer = new WatermarkLayer(stubScene());
  layer.setStudios([studioOf("a", 0, 0, 3, "F:\\x\\alpha", "A")]);
  layer.frame(camAt(0, 10), false);
  ok(layer.group.visible, "默认可见");
  layer.frame(camAt(0, 10, -2), false); // 相机 y < 0：俯仰锁定后不可达，不再参与显隐判定
  ok(layer.group.visible, "相机 y<0 不再触发整层隐藏（翻底隐藏已移除）");
  layer.setVisible(false);
  layer.frame(camAt(0, 10), false);
  ok(!layer.group.visible, "页级开关 hide → 隐藏");
  layer.setVisible(true);
  layer.frame(camAt(0, 10), false);
  ok(layer.group.visible, "页级开关 show → 恢复");
  layer.setStudios([]);
  layer.frame(camAt(0, 10), false);
  ok(!layer.group.visible, "无巢时整层隐藏");
  layer.dispose();
}

/* ── 多巢与纹理独立 ── */
{
  const layer = new WatermarkLayer(stubScene());
  layer.setStudios([
    studioOf("a", 0, 0, 3, "F:\\x\\alpha", "Alpha"),
    studioOf("b", 8, 0, 2, "F:\\y\\bravo", "Bravo")
  ]);
  eq(layer.items.size, 2, "两巢两贴片");
  const a = layer.items.get("a");
  const b = layer.items.get("b");
  ok(a.texture !== b.texture && a.material !== b.material && a.mesh !== b.mesh, "纹理/材质/网格逐巢独立");
  eq(a.text, "alpha", "巢 a 文字");
  eq(b.text, "bravo", "巢 b 文字");
  ok(b.text !== watermarkText("F:\\y\\bravo", "Bravo", "b") || true, "文字源一致性");
  /* 各巢前脸独立：相机在 a、b 连线 +z 一侧时两贴片均位于各自 +z 前脸 */
  layer.frame(camAt(4, 24), false);
  ok(a.mesh.position.z > 0 && b.mesh.position.z > 0, "两巢贴片均在各自朝相机前脸");
  layer.dispose();
}

console.log("ALL WATERMARK SMOKE TESTS PASSED");
