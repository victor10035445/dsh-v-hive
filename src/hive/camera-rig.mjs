/**
 * 轨道相机 rig（命令式，design.md D6）：
 *  - 极角范围 [20°, 75°]（= 俯角 70°–15°）：俯仰锁定为设置值（setPitchDeg，D3），
 *    SHALL NOT 越过水平线翻到地板下方（相机手势重排 spec「相机与手势仲裁」）；
 *  - 手势（仲裁在 interact.mjs）：右键拖拽 = 双态——「右键旋转」开关开 = spin 方位
 *    旋转（仅水平，垂直分量在 interact 层丢弃）、关（默认）= pan 全向平移（水平
 *    左右 + 垂直前后）；中键拖拽 = pan 兜底；滚轮与触控板捏合 ctrl+wheel 同映射为
 *    指针处缩放；
 *  - 一键镜头动画（聚焦双击）：姿态插值飞行（俯仰保持当前设置值，D6）；
 *  - 姿态快照 / 恢复（布局文档的「镜头偏好」持久化，D8）：写入照旧（pose 仍含 phi，
 *    schema 不动）、加载忽略 phi（旧存档含地下 phi 一律落回设置俯角，D5）。
 * 不用 OrbitControls examples 模块：减少 examples 依赖面，手势仲裁统一在 interact.mjs。
 */
import * as THREE from "three";
import { SPIN_KEYS, KEY_SPIN_OMEGA, spinDirection } from "./keyboard.mjs";

const DEG = Math.PI / 180;
/* pan() 拖拽热路径复用暂存向量（零分配；单线程无重入，模块级安全） */
const _panRight = new THREE.Vector3();
const _panForward = new THREE.Vector3();
/* 极角保险夹取（D3）：设置范围俯角 15°–70° 之外的双保险（apply()/flyTo 自动收口），
   70° 俯角上限的存在理由：90° 俯角时相机 up 列 ≈ 世界 +y，pan 垂直分量退化死亡。 */
export const POLAR_MIN = 20 * DEG; // = 俯角 70°
export const POLAR_MAX = 75 * DEG; // = 俯角 15°

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.target = new THREE.Vector3(0, 0, 0);
    this.theta = -Math.PI / 2; // 方位角（绕 y）
    this.phi = 45 * DEG; // 极角（自 +y 起）= 90° − 默认俯角 45°（D3；二轮定稿 45°，历史默认 38°/φ52° 已迁移）
    this.dist = 15; // 默认镜头距离（用户定稿：34 → 28 → 15；旧默认 34/28 布局文档迁移见 scene.setLayout）
    this.tween = null;
    /* Z/C 按住旋转的记键集合（hive-interaction-polish 3.2/D1）：键盘层 keydown/keyup
       经 setSpinKey 记/清（幂等），loop 每帧 keySpin(dt) 读取积分；blur/visibilitychange
       经 clearSpinKeys 清空（防失焦后 keyup 丢失「键卡死」）。 */
    this.spinKeys = new Set();
    this.apply();
  }

  /** 姿态 → 相机（每帧或变更时调用）。零分配：直接写入 camera.position——
      apply() 在拖拽期随 pointermove 高频触发（高回报率鼠标每帧可数百次），
      每次分配 Vector3 会造成逐帧 GC 压力（拖拽卡顿/掉帧贡献项）。 */
  apply() {
    const { theta, phi, dist, target } = this;
    const clampedPhi = Math.min(POLAR_MAX, Math.max(POLAR_MIN, phi));
    const sinPhi = Math.sin(clampedPhi);
    this.camera.position.set(
      target.x + dist * sinPhi * Math.sin(theta),
      target.y + dist * Math.cos(clampedPhi),
      target.z + dist * sinPhi * Math.cos(theta)
    );
    this.camera.lookAt(target);
    this.phi = clampedPhi;
    /* 矩阵新鲜度收口（bubble-anchor-and-bee-fixes D3）：apply() 是全部姿态变更的
       唯一出口（pan/spin/zoom/setPitchDeg/loadPose/flyTo tween）——末尾统一
       updateMatrixWorld()
       （Camera 覆写同步重算 matrixWorldInverse），卡片投影（updateCards，先于
       render 执行）自此总读到当帧矩阵，消除拖拽/缩放/镜头飞行时气泡滞后一帧的
       闪动；顺带修复构造后首个渲染帧 matrixWorldInverse 尚为单位矩阵的首帧错位。 */
    this.camera.updateMatrixWorld();
  }

  /** 方位旋转（右键旋转开关开启，D2）：仅水平分量驱动方位角，垂直分量在 interact
      层已丢弃——rig 的 phi 唯一权威是设置下发（setPitchDeg），不引入「锁定」概念。 */
  spin(dx) {
    this.tween = null;
    this.theta -= dx * 0.005;
    this.apply();
  }

  /** Z/C 键记/清（hive-interaction-polish 3.2/D1）：keydown 记键、keyup 清键，幂等；
      非 Z/C 键忽略。 */
  setSpinKey(key, down) {
    const k = String(key ?? "").toLowerCase();
    if (!(k in SPIN_KEYS)) return;
    if (down) this.spinKeys.add(k);
    else this.spinKeys.delete(k);
  }

  /** 清空 Z/C 记键集合（window blur / visibilitychange hidden；键卡死防线）。 */
  clearSpinKeys() {
    this.spinKeys.clear();
  }

  /** 每帧入口（hive-interaction-polish 3.2/D1）：按记键集合以固定角速度积分 theta——
      Z = 逆时针（+）、C = 顺时针（−）、同时按住互抵（净 0 不动）；帧率无关（ω·dt），
      平滑无跳格；phi（俯仰锁定）/ 距离 / 目标点 SHALL NOT 被触碰。有旋转时打断进行中
      姿态飞行（与 spin 同语义）。返回 true 表示本帧有旋转。 */
  keySpin(dt) {
    const dir = spinDirection(this.spinKeys);
    if (dir === 0) return false;
    this.tween = null;
    this.theta += dir * KEY_SPIN_OMEGA * ((dt ?? 0) / 1000);
    this.apply();
    return true;
  }

  /** 俯角设置入口（D3，滑杆唯一俯仰入口）：φ = 90° − deg；范围外值夹取为保险。 */
  setPitchDeg(deg) {
    this.phi = Math.min(POLAR_MAX, Math.max(POLAR_MIN, (90 - deg) * DEG));
    this.apply();
  }

  /** 平移（右键开关关闭时的右键拖拽 / 中键兜底拖拽）：沿相机右手与前进投影方向移动目标点。
      零分配（模块级暂存向量）：同 apply()，拖拽期 pointermove 高频路径。 */
  pan(dx, dy) {
    this.tween = null;
    const speed = this.dist * 0.0016;
    const cam = this.camera;
    _panRight.setFromMatrixColumn(cam.matrix, 0);
    _panForward.setFromMatrixColumn(cam.matrix, 1);
    this.target.addScaledVector(_panRight, -dx * speed);
    this.target.addScaledVector(_panForward, dy * speed);
    this.target.y = 0;
    this.apply();
  }

  /** 指针处缩放：dist 乘性缩放；at 为 NDC 或屏幕点时做轻量目标牵引（指向感）。 */
  zoom(delta, focusShift) {
    this.tween = null;
    const factor = Math.exp(delta * 0.0012);
    const next = Math.min(220, Math.max(4, this.dist * factor));
    if (focusShift) this.target.add(focusShift.multiplyScalar(1 - next / this.dist));
    this.dist = next;
    this.apply();
  }

  pose() {
    return { theta: this.theta, phi: this.phi, dist: this.dist, tx: this.target.x, tz: this.target.z };
  }

  loadPose(pose) {
    if (!pose || typeof pose !== "object") return;
    if (Number.isFinite(pose.theta)) this.theta = pose.theta;
    /* phi 一律忽略（相机手势重排 D5）：俯仰锁定为设置值，历史存档（含地下姿态
       phi > 90°——储蜜层视角时期写入）加载后自动落回当前设置俯角，不困在地下。 */
    if (Number.isFinite(pose.dist) && pose.dist > 0) this.dist = pose.dist;
    if (Number.isFinite(pose.tx)) this.target.x = pose.tx;
    if (Number.isFinite(pose.tz)) this.target.z = pose.tz;
    this.tween = null;
    this.apply();
  }

  /** 姿态飞行（聚焦双击；D6——不传 phi 即保持当前设置俯角）。ms 内线性-平滑插值。 */
  flyTo(pose, ms = 700) {
    const to = {
      theta: pose.theta ?? this.theta,
      phi: Math.min(POLAR_MAX, Math.max(POLAR_MIN, pose.phi ?? this.phi)),
      dist: Math.min(220, Math.max(4, pose.dist ?? this.dist)),
      tx: pose.tx ?? this.target.x,
      tz: pose.tz ?? this.target.z
    };
    // 方位角走最短弧
    let dTheta = to.theta - this.theta;
    while (dTheta > Math.PI) dTheta -= Math.PI * 2;
    while (dTheta < -Math.PI) dTheta += Math.PI * 2;
    this.tween = {
      from: { theta: this.theta, phi: this.phi, dist: this.dist, tx: this.target.x, tz: this.target.z },
      to: { ...to, theta: this.theta + dTheta },
      start: performance.now(),
      ms
    };
  }

  /** 每帧推进（返回 true 表示仍在动画）。 */
  update() {
    const tween = this.tween;
    if (!tween) return false;
    const t = Math.min(1, (performance.now() - tween.start) / tween.ms);
    const ease = t * t * (3 - 2 * t); // smoothstep
    const lerp = (a, b) => a + (b - a) * ease;
    this.theta = lerp(tween.from.theta, tween.to.theta);
    this.phi = lerp(tween.from.phi, tween.to.phi);
    this.dist = lerp(tween.from.dist, tween.to.dist);
    this.target.x = lerp(tween.from.tx, tween.to.tx);
    this.target.z = lerp(tween.from.tz, tween.to.tz);
    this.apply();
    if (t >= 1) this.tween = null;
    return true;
  }
}
