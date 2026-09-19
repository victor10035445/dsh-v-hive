/**
 * 六边形升起光墙特效层冒烟测试（hex-rise-fx design.md D10，无需 WebGL 纯逻辑层，
 * 先例 bee-model-smoke.mjs）：
 *  - 状态机推进与钳制（定格最后一帧）；
 *  - transient 全程（升起→停留→淡出）后释放回池；
 *  - 池满回收最旧 transient 且常驻槽位不挤占；
 *  - 灰墙跟随吸附不重播、followEnd/hidePersistent 幂等与槽位保护；
 *  - 预设瞬切（独立实例，无中途换色）；
 *  - reduced-motion 直达定格 / 静态显示后消失；
 *  - 完工/出场差分语义（done 迁入触发 / 保持 done 不重触发 / 首帧基线不触发）。
 * 运行：node test/hex-fx-smoke.mjs
 */
import {
  HexRiseFxLayer,
  diffBeeTransitions,
  RISE_MS,
  HOLD_MS,
  FADE_MS,
  REDUCED_HOLD_MS,
  POOL_SIZE
} from "../src/hive/hex-fx.mjs";
import { PALETTE } from "../src/hive/palette.mjs";

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
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

/* ── 池结构 ── */
{
  const scene = stubScene();
  const layer = new HexRiseFxLayer(scene);
  eq(layer.slots.length, POOL_SIZE, "池上限 = 8");
  eq(scene.children.length, POOL_SIZE, "全部网格挂入 scene");
  for (const mesh of scene.children) {
    eq(mesh.renderOrder, 15, "renderOrder 15（蜂 10 之后、墙 20 之前）");
    eq(mesh.frustumCulled, false, "特效不做视锥剔除");
    ok(mesh.geometry === layer.geometry, "全部实例共享同一几何");
  }
  eq(layer.materials.length, POOL_SIZE, "独立材质份数 = 8");
  eq(new Set(layer.materials).size, POOL_SIZE, "材质实例互不共享");
}

/* ── 几何对齐（design.md D2：平顶族 + 高度 H + 底边贴地） ── */
{
  const layer = new HexRiseFxLayer(stubScene());
  const pos = layer.geometry.attributes.position;
  const mod60 = new Set();
  let hasXAxisVertex = false;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    if (Math.hypot(x, z) < 1e-6) continue;
    const deg = (Math.atan2(z, x) * 180) / Math.PI;
    if (Math.abs(Math.abs(deg) % 180) < 1e-6) hasXAxisVertex = true; // 首顶点落 ±X（thetaStart=π/2）
    const degR = Math.round(deg); // 真值为 60° 精确倍数，先取整消除三角函数浮点抖动
    mod60.add(((degR % 60) + 60) % 60); // 顶点角模 60° 归一
  }
  eq([...mod60].join(","), "0", "顶点族 i·60° 与平顶瓦片对齐（无旋转偏差）");
  ok(hasXAxisVertex, "顶点族含 +X 顶点（thetaStart=π/2）");
  const ys = [];
  for (let i = 0; i < pos.count; i++) ys.push(pos.getY(i));
  ok(Math.abs(Math.min(...ys)) < 1e-6, "底边贴地（y≈0；Float32 顶点存储残差 <1e-6）");
  ok(Math.abs(Math.max(...ys) - 0.35) < 1e-6, "墙高 H = 0.35");
}

/* ── 状态机推进与钳制（定格最后一帧） ── */
{
  const layer = new HexRiseFxLayer(stubScene());
  const slot = layer.trigger({ x: 3, z: 4 }, "white", "hold");
  ok(slot && slot.active && slot.mesh.visible, "trigger 返回激活槽位");
  eq(slot.mesh.position.x, 3, "定位 x = worldOf(cell)");
  eq(slot.mesh.position.z, 4, "定位 z = worldOf(cell)");
  ok(Math.abs(slot.mesh.position.y - 0.02) < 1e-12, "y = 0.02（与选中遮罩同层）");
  layer.frame(100, false);
  eq(slot.progress, 100 / RISE_MS, "升起按 dt/RISE_MS 推进");
  layer.frame(RISE_MS, false);
  eq(slot.progress, 1, "升起完成");
  eq(slot.stage, "hold", "进入定格");
  layer.frame(RISE_MS * 5, false);
  eq(slot.progress, 1, "进度钳制不循环");
  ok(slot.active && slot.mesh.visible, "定格驻留（最后一帧持续渲染）");
  eq(slot.material.uniforms.uProgress.value, 1, "uniform 与进度同步");
  // 旧 select 常驻被新 hold 替换（同刻至多一枚，新实例从头升起）
  const next = layer.trigger({ x: 0, z: 0 }, "white", "hold");
  const holds = layer.slots.filter((s) => s.active && s.mode === "hold" && s.channel === "select");
  eq(holds.length, 1, "同刻至多一枚 select 常驻（旧的被替换）");
  ok(next.active && next.progress === 0, "新 hold 从头升起（瞬切到新实例）");
  ok(next.mesh.position.x === 0 && next.mesh.position.z === 0, "新 hold 定位新格");
}

/* ── transient 全程后释放回池 ── */
{
  const layer = new HexRiseFxLayer(stubScene());
  const slot = layer.trigger({ x: 0, z: 0 }, "green", "transient");
  layer.frame(RISE_MS, false);
  eq(slot.stage, "hold", "升起完进入停留");
  layer.frame(HOLD_MS - 1, false);
  ok(slot.active, "停留期内仍占池");
  layer.frame(1, false);
  eq(slot.stage, "fade", "停留结束进入淡出");
  layer.frame(FADE_MS - 1, false);
  ok(slot.active && slot.material.uniforms.uFade.value > 0, "淡出中途仍激活且 alpha 未到 0");
  layer.frame(1, false);
  ok(!slot.active && !slot.mesh.visible, "淡出完释放（彻底消失）");
  eq(layer.activeCount(), 0, "回池：场景不残留占位");
}

/* ── 池满回收最旧 transient，常驻槽位不挤占 ── */
{
  const layer = new HexRiseFxLayer(stubScene(), { poolSize: POOL_SIZE });
  const hold = layer.trigger({ x: 0, z: 0 }, "white", "hold");
  layer.frame(120, false);
  const holdProgress = hold.progress;
  const seqs = [];
  for (let i = 0; i < POOL_SIZE - 1; i++) {
    seqs.push(layer.trigger({ x: i + 1, z: 0 }, "yellow", "transient").seq);
  }
  eq(layer.activeCount(), POOL_SIZE, "池满");
  const extra = layer.trigger({ x: 99, z: 99 }, "green", "transient");
  ok(extra && extra.active, "池满仍可触发（回收复用）");
  ok(!layer.slots.some((s) => s.active && s.seq === seqs[0]), "回收的是最旧 transient");
  eq(layer.activeCount(), POOL_SIZE, "池不超限");
  ok(hold.active && hold.mesh.visible, "白驻留墙不受挤占");
  eq(hold.progress, holdProgress, "白墙进度不被打断");
}

/* ── hidePersistent：移除 select 常驻、保护灰跟随槽位 ── */
{
  const layer = new HexRiseFxLayer(stubScene());
  layer.trigger({ x: 0, z: 0 }, "white", "hold");
  layer.followStart({ x: 1, z: 1 });
  layer.hidePersistent();
  eq(layer.slots.filter((s) => s.active && s.channel === "select").length, 0, "select 常驻全部移除");
  ok(layer.followIndex >= 0 && layer.slots[layer.followIndex].active, "灰跟随墙不受 hidePersistent 影响");
  layer.followEnd();
  eq(layer.activeCount(), 0, "followEnd 后清池");
}

/* ── 灰墙跟随：吸附平移不重播、幂等结束 ── */
{
  const layer = new HexRiseFxLayer(stubScene());
  layer.followMove({ x: 9, z: 9 }); // 未 start → 忽略
  eq(layer.activeCount(), 0, "未 followStart 时 followMove 无效");
  layer.followStart({ x: 1, z: 2 });
  const f = layer.slots[layer.followIndex];
  ok(f && f.active && f.channel === "follow", "跟随墙激活（单格锚点标记）");
  layer.frame(100, false);
  const p0 = f.progress;
  ok(p0 > 0 && p0 < 1, "首格播放一次升起");
  layer.followMove({ x: 4, z: 5 });
  eq(f.progress, p0, "落点格变化仅吸附平移，不重播");
  ok(f.mesh.position.x === 4 && f.mesh.position.z === 5, "位置吸附新格");
  layer.followStart({ x: 7, z: 8 }); // 已激活时幂等
  eq(f.progress, p0, "重复 followStart 不重播");
  ok(f.mesh.position.x === 7 && f.mesh.position.z === 8, "幂等 followStart 仍吸附平移");
  layer.followEnd();
  ok(!f.active && !f.mesh.visible, "followEnd 立即消失");
  eq(layer.followIndex, -1, "跟随槽位清空");
  layer.followEnd(); // 幂等
  eq(layer.activeCount(), 0, "followEnd 幂等");
}

/* ── 预设瞬切：独立实例即目标色，无中途换色 ── */
{
  const layer = new HexRiseFxLayer(stubScene());
  const w = layer.trigger({ x: 0, z: 0 }, "white", "hold");
  eq(w.material.uniforms.uColor.value.getHex(), PALETTE.hexFxWhite, "白墙预设色");
  const g = layer.trigger({ x: 5, z: 0 }, "green", "transient");
  eq(g.material.uniforms.uColor.value.getHex(), PALETTE.hexFxGreen, "绿墙预设色");
  ok(g !== w, "不同状态不同实例（不共用同一枚中途改色）");
  eq(w.material.uniforms.uColor.value.getHex(), PALETTE.hexFxWhite, "互不串扰");
  let threw = false;
  try {
    layer.trigger({ x: 0, z: 0 }, "magenta", "transient");
  } catch {
    threw = true;
  }
  ok(threw, "未知预设快速失败");
}

/* ── reduced-motion：直达定格 / 静态显示后消失 ── */
{
  const layer = new HexRiseFxLayer(stubScene());
  const w = layer.trigger({ x: 0, z: 0 }, "white", "hold");
  layer.frame(0, true);
  eq(w.progress, 1, "hold 直达定格帧（无升起）");
  const w2 = layer.trigger({ x: 1, z: 0 }, "white", "hold");
  layer.frame(50, false);
  ok(w2.progress < 1, "正常升起中");
  layer.frame(0, true);
  eq(w2.progress, 1, "中途启用降级 → 直达定格");
  const g = layer.trigger({ x: 2, z: 0 }, "green", "transient");
  layer.frame(0, true);
  eq(g.progress, 1, "transient 降级同样直达定格");
  eq(g.material.uniforms.uFade.value, 1, "静态显示（无渐隐动画）");
  layer.frame(REDUCED_HOLD_MS - 1, true);
  ok(g.active, "静态显示期内仍在（保留出现反馈）");
  layer.frame(1, true);
  ok(!g.active, "静态显示结束即消失（保留消失反馈）");
}

/* ── 差分触发语义（design.md D7 / diffBeeTransitions） ── */
{
  // 首帧基线：只建基线不触发（含既有 done 蜂）
  let d = diffBeeTransitions(
    null,
    [
      { id: "a", state: "busy" },
      { id: "b", state: "done" },
      { id: "c", state: "idle" }
    ]
  );
  eq(d.doneIds.length, 0, "首帧基线不触发绿墙");
  eq(d.enterIds.length, 0, "首帧基线不触发黄墙");
  eq(d.states.size, 3, "基线状态表建立");
  ok(d.sessions.has("b"), "基线会话集建立");

  // 非 done 迁入 done 触发；保持 done 不重触发
  d = diffBeeTransitions({ states: d.states, sessions: d.sessions }, [
    { id: "a", state: "done" },
    { id: "b", state: "done" },
    { id: "c", state: "idle" }
  ]);
  eq(JSON.stringify(d.doneIds), JSON.stringify(["a"]), "非 done 迁入 done 触发绿墙");
  eq(d.enterIds.length, 0, "无新会话不出场");

  // 新 sessionId 出场；保持 done 不重触发
  d = diffBeeTransitions({ states: d.states, sessions: d.sessions }, [
    { id: "a", state: "done" },
    { id: "b", state: "done" },
    { id: "c", state: "idle" },
    { id: "d", state: "busy" }
  ]);
  eq(JSON.stringify(d.enterIds), JSON.stringify(["d"]), "新 sessionId 出场触发黄墙");
  eq(d.doneIds.length, 0, "保持 done 不重触发绿墙");

  // 离开 done 不触发；离场会话移出基线
  d = diffBeeTransitions({ states: d.states, sessions: d.sessions }, [
    { id: "a", state: "busy" },
    { id: "b", state: "done" },
    { id: "c", state: "idle" }
  ]);
  eq(d.doneIds.length, 0, "离开 done 不触发");
  eq(d.enterIds.length, 0, "状态变化不是出场");
  ok(!d.sessions.has("d"), "离场会话移出基线");

  // 离场后重新入场且为 done：出场优先，同 tick 一蜂至多一枚
  d = diffBeeTransitions({ states: d.states, sessions: d.sessions }, [
    { id: "b", state: "done" },
    { id: "c", state: "idle" }
  ]);
  d = diffBeeTransitions({ states: d.states, sessions: d.sessions }, [
    { id: "a", state: "done" }, // 重新入场
    { id: "b", state: "done" },
    { id: "c", state: "idle" }
  ]);
  eq(JSON.stringify(d.enterIds), JSON.stringify(["a"]), "重新入场 = 新会话（黄）");
  eq(d.doneIds.length, 0, "同 tick 出场优先，不叠加绿墙");
}

/* ── dispose：几何/全部材质释放，网格出场景 ── */
{
  const scene = stubScene();
  const layer = new HexRiseFxLayer(scene);
  layer.trigger({ x: 0, z: 0 }, "white", "hold");
  layer.trigger({ x: 1, z: 0 }, "green", "transient");
  let geoDisposed = false;
  layer.geometry.addEventListener("dispose", () => {
    geoDisposed = true;
  });
  let matDisposed = 0;
  for (const m of layer.materials) m.addEventListener("dispose", () => matDisposed++);
  layer.dispose();
  ok(geoDisposed, "几何已释放");
  eq(matDisposed, POOL_SIZE, "全部池内材质已释放");
  eq(scene.children.length, 0, "全部网格出场景");
  eq(layer.slots.length, 0, "槽位清空");
}

console.log("ALL HEX-FX SMOKE TESTS PASSED");
