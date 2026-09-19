/**
 * 相机手势重排冒烟测试（camera-gesture-rework，纯逻辑层无需 WebGL，
 * 先例 render-lod-smoke 的最小 THREE 注入）：
 *  - spin(dx)：仅方位角变化、phi 不动（D2）；保留 tween = null 打断语义；
 *  - setPitchDeg(deg)：φ = 90° − 俯角；范围外值夹取 [20°, 75°]（D3）；
 *  - loadPose：忽略 phi（含 >90° 地下存档输入），方位/距离/目标点照常恢复（D5）；
 *  - pose()：仍写入 phi（写入格式兼容，schema 不动）。
 * 运行：node test/camera-gesture-smoke.mjs
 */
import * as THREE from "three";
import { CameraRig, POLAR_MIN, POLAR_MAX } from "../src/hive/camera-rig.mjs";
import { KEY_SPIN_OMEGA } from "../src/hive/keyboard.mjs";
import { GestureController } from "../src/hive/interact.mjs";
import { beeIdsInRect, convergeMarqueeIds } from "../src/hive/scene.mjs";
import { BEE_RADIUS } from "../src/hex.mjs";

const DEG = Math.PI / 180;
const near = (actual, expected, message) => {
  if (Math.abs(actual - expected) > 1e-9) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};
const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};

const rigOf = () => new CameraRig(new THREE.PerspectiveCamera());

/* ── 1. 构造默认 = 设置默认俯角 45°（D3；二轮定稿 45°，dist 默认 15）── */
{
  const rig = rigOf();
  near(rig.phi, 45 * DEG, "构造默认 φ = 45°（俯角 45°）");
  near(rig.dist, 15, "构造默认镜头距离 dist = 15");
  near(POLAR_MIN, 20 * DEG, "POLAR_MIN 收敛为 20°（俯角 70° 上限）");
  near(POLAR_MAX, 75 * DEG, "POLAR_MAX 收敛为 75°（俯角 15° 下限）");
}

/* ── 2. spin(dx)：仅方位角，phi 不动（D2）── */
{
  const rig = rigOf();
  const phi0 = rig.phi;
  const theta0 = rig.theta;
  rig.spin(120); // 120px 水平拖拽
  near(rig.phi, phi0, "spin 正增量不改 phi（俯仰锁定）");
  ok(rig.theta < theta0, "spin 正增量驱动方位角（theta -= dx × 0.005）");
  near(rig.theta - theta0, -120 * 0.005, "spin 速率保持 0.005/px");
  rig.spin(-80);
  near(rig.phi, phi0, "spin 负增量同样不改 phi");
  /* tween 打断语义保留：飞行中 spin → tween 立即取消 */
  rig.flyTo({ dist: 100 });
  ok(rig.tween, "flyTo 设置 tween");
  rig.spin(10);
  ok(rig.tween === null, "spin 打断进行中飞行（tween = null 语义保留）");
}

/* ── 2b. pan(dx, dy)：目标点平移、贴地、俯仰/距离不动；零分配重构后跨实例确定性 ── */
{
  const rig = rigOf();
  const { theta, phi, dist } = rig;
  const tx0 = rig.target.x;
  const tz0 = rig.target.z;
  rig.pan(100, 60);
  ok(rig.target.x !== tx0 || rig.target.z !== tz0, "pan 移动视线目标点");
  near(rig.target.y, 0, "pan 目标点恒贴地（y = 0）");
  near(rig.phi, phi, "pan 不改俯仰（phi 锁定）");
  near(rig.dist, dist, "pan 不改距离");
  near(rig.theta, theta, "pan 不改方位角");
  /* 相同输入 → 相同落点：pan 热路径改用模块级暂存向量后无跨调用状态泄漏 */
  const rig2 = rigOf();
  rig2.pan(100, 60);
  near(rig2.target.x, rig.target.x, "pan 跨实例结果一致（x）");
  near(rig2.target.z, rig.target.z, "pan 跨实例结果一致（z）");
}

/* ── 3. setPitchDeg：φ = 90° − 俯角；范围外夹取（D3） ── */
{
  const rig = rigOf();
  rig.setPitchDeg(38);
  near(rig.phi, 52 * DEG, "setPitchDeg(38) → φ = 52°");
  rig.setPitchDeg(70);
  near(rig.phi, POLAR_MIN, "setPitchDeg(70) → φ = POLAR_MIN(20°)");
  rig.setPitchDeg(15);
  near(rig.phi, POLAR_MAX, "setPitchDeg(15) → φ = POLAR_MAX(75°)");
  /* 范围外值夹取：滑杆只发 15–70，此处是设置流之外的保险（D3） */
  rig.setPitchDeg(90); // 俯角 90°（水平贴地）→ 夹回 70° 俯角
  near(rig.phi, POLAR_MIN, "setPitchDeg(90) 越上界 → 夹取 POLAR_MIN（pan 垂直分量不退化）");
  rig.setPitchDeg(0); // 俯角 0°（平视/地下）→ 夹回 15° 俯角
  near(rig.phi, POLAR_MAX, "setPitchDeg(0) 越下界 → 夹取 POLAR_MAX（SHALL NOT 到地板下方）");
  rig.setPitchDeg(-30); // 负值同径
  near(rig.phi, POLAR_MAX, "setPitchDeg(-30) → 夹取 POLAR_MAX");
  /* 相机位置随之正确落位（apply 生效）：俯角 15° 时相机高于目标点（恒在地上） */
  ok(rig.camera.position.y > rig.target.y, "夹取后相机位置恒在目标点上方（地上）");
}

/* ── 4. loadPose：phi 一律忽略（D5，含地下存档）；其余字段照常恢复 ── */
{
  const rig = rigOf();
  rig.setPitchDeg(38); // 当前设置俯角 → φ = 52°
  const phiSetting = rig.phi;
  rig.loadPose({
    theta: 1.234,
    phi: 2.5, // ≈143° 地下存档（储蜜层视角时期写入，>90°）
    dist: 50,
    tx: 10,
    tz: -4
  });
  near(rig.theta, 1.234, "loadPose 方位角照常恢复");
  near(rig.dist, 50, "loadPose 距离照常恢复");
  near(rig.target.x, 10, "loadPose 目标点 x 照常恢复");
  near(rig.target.z, -4, "loadPose 目标点 z 照常恢复");
  near(rig.phi, phiSetting, "loadPose 地下 phi(2.5) 被忽略 → 保持设置俯角");
  rig.loadPose({ theta: 0.5, phi: 0.8 }); // 合法界内 phi 同样忽略（一律取设置值）
  near(rig.phi, phiSetting, "loadPose 界内 phi 同样被忽略（俯仰一律取设置值）");
  rig.loadPose(null);
  rig.loadPose(undefined);
  rig.loadPose("bad");
  ok(true, "loadPose 非对象输入安全返回");
}

/* ── 5. pose()：仍写入 phi（写入格式兼容，schema 不动——D5「写入照旧」） ── */
{
  const rig = rigOf();
  rig.setPitchDeg(52); // φ = 38°
  const pose = rig.pose();
  ok(Number.isFinite(pose.phi), "pose() 仍含 phi 字段（布局文档写入格式不变）");
  near(pose.phi, 38 * DEG, "pose().phi = 当前设置俯角对应极角");
  ok(Number.isFinite(pose.theta) && Number.isFinite(pose.dist) && Number.isFinite(pose.tx) && Number.isFinite(pose.tz), "pose() theta/dist/tx/tz 字段齐全");
  /* 写入 → 读回闭环：方位/距离/目标点恢复、phi 落回设置值（老存档新写档同径） */
  rig.loadPose({ ...pose, phi: 3.0 });
  near(rig.theta, pose.theta, "闭环：theta 写读一致");
  near(rig.phi, 38 * DEG, "闭环：读回仍取设置俯角（存档 phi 被忽略）");
}

/* ── 6. keySpin（hive-interaction-polish 3.2/D1）：Z/C 按住连续方位旋转 ── */
{
  const rig = rigOf();
  const theta0 = rig.theta;
  const phi0 = rig.phi;
  const dist0 = rig.dist;
  const tx0 = rig.target.x;
  const tz0 = rig.target.z;
  ok(rig.keySpin(16) === false, "无记键 → keySpin 零成本返回 false（空集短路）");
  near(rig.theta, theta0, "无记键 → theta 不动");
  /* Z = 逆时针（theta 增大 = 相机绕目标逆时针公转） */
  rig.setSpinKey("z", true);
  ok(rig.keySpin(1000) === true, "Z 按住 → 每帧入口返回 true");
  near(rig.theta - theta0, KEY_SPIN_OMEGA, "Z 以固定角速度 +KEY_SPIN_OMEGA rad/s 积分");
  near(rig.phi, phi0, "keySpin 不改俯仰（phi 锁定，spec「Z/C 不改俯仰」）");
  near(rig.dist, dist0, "keySpin 不改距离");
  near(rig.target.x, tx0, "keySpin 不改目标点 x");
  near(rig.target.z, tz0, "keySpin 不改目标点 z");
  /* 帧率无关：60 帧 × 16ms = 960ms 积分（与时长成正比，与帧数无关） */
  const rig2 = rigOf();
  rig2.setSpinKey("z", true);
  for (let i = 0; i < 60; i++) rig2.keySpin(16);
  near(rig2.theta - theta0, KEY_SPIN_OMEGA * 0.96, "帧率无关：60×16ms ≡ 960ms 定角速度积分");
  near(rig2.phi, phi0, "分帧积分同样不改俯仰");
  /* C = 顺时针（theta 减小） */
  const rig3 = rigOf();
  rig3.setSpinKey("c", true);
  rig3.keySpin(1000);
  near(rig3.theta - theta0, -KEY_SPIN_OMEGA, "C = 顺时针（−KEY_SPIN_OMEGA rad/s）");
  /* 同时按住互抵 */
  const rig4 = rigOf();
  rig4.setSpinKey("z", true);
  rig4.setSpinKey("c", true);
  ok(rig4.keySpin(1000) === false, "Z+C 同时按住互抵 → 无旋转");
  /* 旋转打断进行中飞行（tween = null，与 spin 同语义） */
  const rig7 = rigOf();
  rig7.flyTo({ dist: 100 });
  ok(rig7.tween, "flyTo 设置 tween");
  rig7.setSpinKey("z", true);
  rig7.keySpin(16);
  ok(rig7.tween === null, "keySpin 打断进行中飞行");
}

/* ── 7. marquee 框选手势（hive-marquee-and-card-rework 2.1/2.2：定型路由 / 阈值 / Esc）── */
/* interact 的 window keydown（Esc 取消）挂 window——测试进程内静态桩 */
const windowHandlers = new Map();
if (typeof globalThis.window === "undefined") {
  globalThis.window = {
    addEventListener(type, fn) {
      if (!windowHandlers.has(type)) windowHandlers.set(type, []);
      windowHandlers.get(type).push(fn);
    },
    removeEventListener() {}
  };
}

function fakeCanvas() {
  const listeners = new Map();
  return {
    style: {},
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener(type, fn) {
      const arr = listeners.get(type) ?? [];
      const i = arr.indexOf(fn);
      if (i >= 0) arr.splice(i, 1);
    },
    setPointerCapture() {},
    releasePointerCapture() {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
    dispatch(type, event) {
      for (const fn of listeners.get(type) ?? []) fn(event);
    }
  };
}

/** GestureController 最小装配：默认拾取 = ground（相机俯视原点，射线交 y=0 平面）；
    用例按需覆写 gc.pick 注入落点分类。 */
function marqueeRig({ callbacks, editMode = false, selection = null }) {
  const canvas = fakeCanvas();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400);
  camera.position.set(0, 12, 15);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const rig = new CameraRig(camera);
  const gc = new GestureController({
    canvas,
    scene: { add() {}, remove() {} },
    camera,
    rig,
    tileField: {},
    territory: { floor: null },
    walls: { mesh: null },
    bees: { pickMeshes: () => [] },
    cups: { mesh: null },
    studioLayersOf: () => [],
    occupancyOf: () => new Map(),
    editModeOf: () => editMode,
    spinModeOf: () => false,
    selectionOf: () => selection,
    callbacks
  });
  return { gc, canvas, rig };
}

const events = (names) => {
  const log = [];
  const callbacks = {};
  for (const name of names) callbacks[name] = (...args) => log.push([name, ...args]);
  return { log, callbacks };
};
const ev = (props) => ({ pointerId: 1, button: 0, ...props });
const lastKind = (log, name) => log.filter(([k]) => k === name).map(([, ...rest]) => rest);

{
  /* (a) ground 起手 → marquee：拖拽只报矩形、SHALL NOT 触发相机手势 */
  const { log, callbacks } = events(["onMarqueeMove", "onMarqueeEnd", "onMarqueeCancel", "onDragCell"]);
  const { gc, canvas, rig } = marqueeRig({ callbacks });
  const target0 = { x: rig.target.x, z: rig.target.z };
  const dist0 = rig.dist;
  canvas.dispatch("pointerdown", ev({ clientX: 100, clientY: 100 }));
  canvas.dispatch("pointermove", ev({ button: -1, clientX: 180, clientY: 160 }));
  canvas.dispatch("pointermove", ev({ button: -1, clientX: 200, clientY: 140 }));
  const moves = lastKind(log, "onMarqueeMove");
  eq(moves.length, 2, "ground 起手拖拽 → 每次 move 报一次矩形");
  eq(moves[0][0], { x0: 100, y0: 100, x1: 180, y1: 160 }, "矩形 = down→当前点（canvas 本地坐标，min/max 归一化）");
  eq(moves[1][0], { x0: 100, y0: 100, x1: 200, y1: 140 }, "矩形随指针更新（回拉 y1 收缩）");
  eq(rig.target.x, target0.x, "marquee 拖拽 SHALL NOT 平移目标点 x");
  eq(rig.target.z, target0.z, "marquee 拖拽 SHALL NOT 平移目标点 z");
  eq(rig.dist, dist0, "marquee 拖拽 SHALL NOT 缩放");
  canvas.dispatch("pointerup", ev({ clientX: 200, clientY: 140 }));
  eq(lastKind(log, "onMarqueeEnd").length, 1, "release → onMarqueeEnd 恰一次");
  eq(lastKind(log, "onMarqueeEnd")[0][0], { x0: 100, y0: 100, x1: 200, y1: 140 }, "onMarqueeEnd 收终矩形");
  eq(lastKind(log, "onMarqueeCancel").length, 0, "正常 release SHALL NOT 触发 cancel");

  /* (b) 未选中巢起手 → marquee；拖蜂优先级不侵蚀（bee > 搬巢 > 框选） */
  const beeCase = events(["onMarqueeMove", "onBeeDragStart"]);
  const gcBee = marqueeRig({ callbacks: beeCase.callbacks });
  gcBee.gc.pick = () => ({ kind: "bee", id: "bee-1", face: {}, point: null });
  gcBee.canvas.dispatch("pointerdown", ev({ clientX: 100, clientY: 100 }));
  gcBee.canvas.dispatch("pointermove", ev({ button: -1, clientX: 160, clientY: 160 }));
  eq(lastKind(beeCase.log, "onBeeDragStart").length, 1, "bee 落点 → 拖蜂手势优先（2.1 路由优先级不变）");
  eq(lastKind(beeCase.log, "onMarqueeMove").length, 0, "拖蜂 SHALL NOT 进入框选");
  gcBee.canvas.dispatch("pointerup", ev({ clientX: 160, clientY: 160 }));

  const studioCase = events(["onMarqueeMove", "onDragCell", "onStudioMoved"]);
  const gcStudio = marqueeRig({ callbacks: studioCase.callbacks, editMode: true, selection: { kind: "studio", id: "ws-1" } });
  gcStudio.gc.pick = () => ({ kind: "studio", id: "ws-1", point: null });
  gcStudio.canvas.dispatch("pointerdown", ev({ clientX: 100, clientY: 100 }));
  gcStudio.canvas.dispatch("pointermove", ev({ button: -1, clientX: 160, clientY: 160 }));
  eq(lastKind(studioCase.log, "onDragCell").length >= 1, true, "编辑开 + 拖已选中巢 → 搬巢手势保留");
  eq(lastKind(studioCase.log, "onMarqueeMove").length, 0, "搬巢 SHALL NOT 进入框选");
  gcStudio.canvas.dispatch("pointerup", ev({ clientX: 160, clientY: 160 }));

  const unselectedCase = events(["onMarqueeMove"]);
  const gcUnsel = marqueeRig({ callbacks: unselectedCase.callbacks, editMode: true, selection: null });
  gcUnsel.gc.pick = () => ({ kind: "studio", id: "ws-2", point: null });
  gcUnsel.canvas.dispatch("pointerdown", ev({ clientX: 100, clientY: 100 }));
  gcUnsel.canvas.dispatch("pointermove", ev({ button: -1, clientX: 160, clientY: 160 }));
  eq(lastKind(unselectedCase.log, "onMarqueeMove").length, 1, "未选中巢拖拽 → 框选（预留键位正式启用）");
  gcUnsel.canvas.dispatch("pointerup", ev({ clientX: 160, clientY: 160 }));

  /* (c) 蜜杯起手 = 无动作（F11：不入 marquee 起手、SHALL NOT 平移） */
  const cupCase = events(["onMarqueeMove", "onMarqueeEnd", "onSelectCup"]);
  const gcCup = marqueeRig({ callbacks: cupCase.callbacks });
  gcCup.gc.pick = () => ({ kind: "cup", id: "cup-1", workspaceId: "ws-1", point: null });
  const rigCup = gcCup.rig;
  const cupTarget0 = { x: rigCup.target.x, z: rigCup.target.z };
  gcCup.canvas.dispatch("pointerdown", ev({ clientX: 100, clientY: 100 }));
  gcCup.canvas.dispatch("pointermove", ev({ button: -1, clientX: 170, clientY: 170 }));
  gcCup.canvas.dispatch("pointerup", ev({ clientX: 170, clientY: 170 }));
  eq(lastKind(cupCase.log, "onMarqueeMove").length, 0, "蜜杯落点拖拽 = 无动作（mode null，不进框选）");
  eq(lastKind(cupCase.log, "onMarqueeEnd").length, 0, "蜜杯拖拽 release 无框选提交");
  eq(rigCup.target.x, cupTarget0.x, "蜜杯拖拽 SHALL NOT 平移镜头");

  /* (d) 阈值区分单击：位移 < 5px = 单击语义照常（点杯选中），不进框选 */
  const clickCase = events(["onMarqueeMove", "onSelectCup"]);
  const gcClick = marqueeRig({ callbacks: clickCase.callbacks });
  gcClick.gc.pick = () => ({ kind: "cup", id: "cup-9", workspaceId: "ws-1", point: null });
  gcClick.canvas.dispatch("pointerdown", ev({ clientX: 100, clientY: 100 }));
  gcClick.canvas.dispatch("pointermove", ev({ button: -1, clientX: 102, clientY: 101 })); // 位移 ~2.2px < 5
  gcClick.canvas.dispatch("pointerup", ev({ clientX: 102, clientY: 101 }));
  eq(lastKind(clickCase.log, "onMarqueeMove").length, 0, "未过阈值 SHALL NOT 进入框选");
  eq(lastKind(clickCase.log, "onSelectCup").length, 1, "阈值内 up = 单击选中语义照常");

  /* (e) Esc 取消（2.2）：拖框中 Esc 仅取消手势（onMarqueeCancel），release 不再 End */
  const escCase = events(["onMarqueeMove", "onMarqueeEnd", "onMarqueeCancel", "onDragCancel"]);
  const gcEsc = marqueeRig({ callbacks: escCase.callbacks });
  gcEsc.canvas.dispatch("pointerdown", ev({ clientX: 100, clientY: 100 }));
  gcEsc.canvas.dispatch("pointermove", ev({ button: -1, clientX: 180, clientY: 160 }));
  for (const fn of windowHandlers.get("keydown") ?? []) fn({ key: "Escape" });
  eq(lastKind(escCase.log, "onMarqueeCancel").length, 1, "拖框中 Esc → onMarqueeCancel 恰一次（仅取消手势）");
  eq(lastKind(escCase.log, "onMarqueeEnd").length, 0, "Esc 取消 SHALL NOT 提交 onMarqueeEnd");
  gcEsc.canvas.dispatch("pointerup", ev({ clientX: 180, clientY: 160 }));
  eq(lastKind(escCase.log, "onMarqueeEnd").length, 0, "Esc 后 release 不二次收口（downPoint 已清）");

  /* (f) pointercancel → 取消（防指针移出画布后拖拽悬挂） */
  const pcCase = events(["onMarqueeEnd", "onMarqueeCancel"]);
  const gcPc = marqueeRig({ callbacks: pcCase.callbacks });
  gcPc.canvas.dispatch("pointerdown", ev({ clientX: 100, clientY: 100 }));
  gcPc.canvas.dispatch("pointermove", ev({ button: -1, clientX: 150, clientY: 150 }));
  gcPc.canvas.dispatch("pointercancel", ev({ clientX: 150, clientY: 150 }));
  eq(lastKind(pcCase.log, "onMarqueeCancel").length, 1, "pointercancel → onMarqueeCancel 恰一次");
  gcPc.canvas.dispatch("pointerup", ev({ clientX: 150, clientY: 150 }));
  eq(lastKind(pcCase.log, "onMarqueeEnd").length, 0, "pointercancel 后 release 无提交");
}

/* ── 8. 框选命中谓词（2.4 纯函数 beeIdsInRect：投影锚点 / 无人机排除 / 投影序）── */
{
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400);
  camera.position.set(0, 12, 15);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const width = 800;
  const height = 600;
  const rec = (id, x, z, extra = {}) => ({ id, world: { x, y: 0, z }, pose: { y: 0.2 }, origin: "user", ...extra });
  const project = (x, y, z) => {
    const v = new THREE.Vector3(x, y, z).project(camera);
    return { px: ((v.x + 1) / 2) * width, py: ((-v.y + 1) / 2) * height };
  };
  const CARD_LIFT = (0.6 + 0.05) * BEE_RADIUS; // 与 scene CARD_ANCHOR_LIFT 同式（命中 SHALL NOT 含此偏移）

  /* 无人机排除 + 投影命中 + 投影序（先上到下）：a（z=-2 高位）→ b（z=+2 低位） */
  const records = [
    rec("a", 0, -2),
    rec("b", 0, 2),
    rec("drone", 0, 0, { origin: "subagent" }), // 无人机（subagent 会话）
    rec("standIn", 0, 1.5, { droneStandIn: true }) // 降级停驻蜂
  ];
  const pa = project(0, 0.2, -2);
  const pb = project(0, 0.2, 2);
  const pDrone = project(0, 0.2, 0);
  const pStandIn = project(0, 0.2, 1.5);
  const x = Math.min(pa.px, pb.px, pDrone.px, pStandIn.px) - 30;
  const X = Math.max(pa.px, pb.px, pDrone.px, pStandIn.px) + 30;
  const y = Math.min(pa.py, pb.py, pDrone.py, pStandIn.py) - 30;
  const Y = Math.max(pa.py, pb.py, pDrone.py, pStandIn.py) + 30;
  const ids = beeIdsInRect(records, { x0: x, y0: y, x1: X, y1: Y }, camera, width, height);
  eq(ids.join(","), "a,b", "框选命中 = 工蜂 a、b（投影序先上到下），无人机/降级停驻蜂排除");

  /* x 序 tie-break（先左后右）：同 z 对称两蜂 py 相等 → px 升序 */
  const pair = [rec("left", -1.2, 0), rec("right", 1.2, 0)];
  const pl = project(-1.2, 0.2, 0);
  const pr = project(1.2, 0.2, 0);
  ok(Math.abs(pl.py - pr.py) < 1e-6, "前置：对称两蜂投影 py 相等（x tie-break 可辨）");
  const pairIds = beeIdsInRect(
    pair,
    { x0: Math.min(pl.px, pr.px) - 20, y0: pl.py - 20, x1: Math.max(pl.px, pr.px) + 20, y1: pl.py + 20 },
    camera,
    width,
    height
  );
  eq(pairIds.join(","), "left,right", "同投影行 → 先左后右（面板投影序冻结口径）");

  /* 投影锚点无偏移：蜂体点（pose.y）1px 精确命中；仅 CARD_ANCHOR_LIFT 抬升锚点
     的等尺寸矩形 SHALL NOT 命中（证明未复用气泡卡锚点——F3 正确性关键） */
  const bodyPoint = project(0, 0.2, 0);
  const liftPoint = project(0, 0.2 + CARD_LIFT, 0);
  ok(Math.abs(liftPoint.py - bodyPoint.py) > 2, "前置：锚点偏移在屏上可辨（>2px）");
  const boxOf = (p) => ({ x0: p.px - 1, y0: p.py - 1, x1: p.px + 1, y1: p.py + 1 });
  const bodyRec = [rec("solo", 0, 0)];
  eq(beeIdsInRect(bodyRec, boxOf(bodyPoint), camera, width, height).join(","), "solo", "蜂体投影点（pose.y）精确命中");
  eq(beeIdsInRect(bodyRec, boxOf(liftPoint), camera, width, height).join(","), "", "仅气泡卡锚点（+CARD_ANCHOR_LIFT）矩形 SHALL NOT 命中（未复用 projectToScreen）");

  /* 相机背切与缺参安全 */
  eq(beeIdsInRect([rec("behind", 0, 40)], { x0: 0, y0: 0, x1: 800, y1: 600 }, camera, width, height).length, 0, "相机背切蜂不命中（z>1 同 projectToScreen 口径）");
  eq(beeIdsInRect(bodyRec, null, camera, width, height).length, 0, "空矩形 → 空集");
  eq(beeIdsInRect(bodyRec, boxOf(bodyPoint), camera, 0, height).length, 0, "零宽视口 → 空集");

  /* 遮挡蜂命中（口径 = 纯投影，不做遮挡剔除）：两蜂投影近重叠（深度不同）均入集 */
  const stacked = [rec("s1", 0.05, 0), rec("s2", -0.05, 0.02)];
  const p1 = project(0.05, 0.2, 0);
  const p2 = project(-0.05, 0.2, 0.02);
  const stackedIds = beeIdsInRect(
    stacked,
    { x0: Math.min(p1.px, p2.px) - 1, y0: Math.min(p1.py, p2.py) - 1, x1: Math.max(p1.px, p2.px) + 1, y1: Math.max(p1.py, p2.py) + 1 },
    camera,
    width,
    height
  );
  eq(stackedIds.length, 2, "重叠投影（隔墙遮挡语义）均命中——SHALL NOT 遮挡剔除");
}

/* ── 9. 蜂离场收敛（2.7 纯函数 convergeMarqueeIds：world 收敛源）── */
{
  const world = {
    studios: [
      { workspaceId: "ws-1", bees: [{ sessionId: "keep-1" }, { sessionId: "keep-2" }] },
      { workspaceId: "ws-2", bees: [{ sessionId: "keep-3" }] }
    ]
  };
  eq(convergeMarqueeIds(["keep-2", "gone", "keep-1", "keep-3"], world).join(","), "keep-2,keep-1,keep-3", "离场蜂剔除、保序、其余保留");
  eq(convergeMarqueeIds(["gone"], world).length, 0, "全部离场 → 空集（面板收起）");
  eq(convergeMarqueeIds([], world).length, 0, "空集幂等");
  eq(convergeMarqueeIds(["keep-1"], null).length, 0, "world 缺席 → 全清（安全）");
}

console.log("ALL CAMERA-GESTURE SMOKE TESTS PASSED");
