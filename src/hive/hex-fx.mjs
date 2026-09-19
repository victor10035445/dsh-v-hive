/**
 * 六边形升起光墙特效层（hex-rise-fx，design.md D2/D3/D4/D6/D8）：
 *  - 几何：开口六棱壁 CylinderGeometry(1,1,H,6,1,true) thetaStart=π/2——首顶点落 +X，
 *    顶点族 i·60° 与 tiles.mjs hexGeometry 平顶族逐边重合（外接半径 1 = 瓦片外接半径）；
 *  - 材质：自研 ShaderMaterial（先例 outline-pass.mjs）——底浓顶淡幂渐变 × 高度揭示
 *    （升起 = 自底向上生长，SHALL NOT 整墙透明度乘法），标准混合（输出封顶不进
 *    Bloom，R6 二次修复）、不写深度、双面、不参与雾；片尾 tonemapping/colorspace
 *    include 保证 composer 线性 HDR 路径与降级直出路径观感一致（outline-pass 同款）；
 *    不入 maskScene（描边不描绘光墙）、纳入 outlineState.depthExemptOf（scene 接线，
 *    SHALL NOT 参与 OutlinePass 深度预填）；
 *  - 生命周期：trigger(hold 定格驻留 | transient 停留→淡出→释放)，进度钳制最后一帧；
 *    灰色跟随墙 followStart/followMove/followEnd（恒为单格锚点标记，SHALL NOT 随巢体足迹放大）；
 *  - 池化：8 枚共享几何 + 独立材质克隆；池满回收最旧 transient，常驻槽位（白选中/灰跟随）不挤占；
 *  - reduced-motion：hold 直达定格帧；transient 静态显示 REDUCED_HOLD_MS 后消失（保留出现/消失反馈）；
 *  - 上下文恢复：无 RT，常规几何/材质/程序由 three.js 自动恢复（motes/sky 同例），
 *    白墙驻留由 scene updateSelection 派生装配自然延续，无需手动重建。
 * 渲染次序 renderOrder 15：蜂(10)之后、巢墙(20)之前。
 */
import * as THREE from "three";
import { PALETTE } from "./palette.mjs";

/* ── 常量集中（目检定稿，任务 4.2） ── */
export const HEX_FX_HEIGHT = 0.35; // 光墙高（状态标记量级，远小于瓦片外接半径）
export const RISE_MS = 350; // 升起时长
export const HOLD_MS = 150; // transient 升起完后的停留
export const FADE_MS = 300; // transient 淡出（整体 alpha，无位移）
export const REDUCED_HOLD_MS = 450; // reduced-motion 静态显示时长（≈0.5s 后消失）
export const POOL_SIZE = 8; // 实例池上限（共享几何、独立材质）
const BASE_Y = 0.02; // 与瓦片选中遮罩同层，避 z-fighting（design.md D2）

/* 预设色（PALETTE 代码级常量，暂不进「外观」页签）。换色 = 瞬切（D5）。 */
const PRESETS = Object.freeze({
  white: PALETTE.hexFxWhite,
  gray: PALETTE.hexFxGray,
  green: PALETTE.hexFxGreen,
  yellow: PALETTE.hexFxYellow
});

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uProgress;   // 升起进度 0→1（钳制）
  uniform vec3 uColor;       // 预设色（瞬切）
  uniform float uIntensity;  // 整体强度（目检调）
  uniform float uFalloff;    // 底浓顶淡幂指数（目检调）
  uniform float uRevealEdge; // 揭示前缘软边宽度
  uniform float uFade;       // transient 淡出乘子 1→0（hold 恒 1）
  varying vec2 vUv;
  void main() {
    /* vUv.y：0=底缘，1=顶缘（CylinderGeometry 侧壁 UV 已核对）。
       高度揭示：自底向上生长，前缘软边——SHALL NOT 整墙透明度乘法。 */
    float reveal = 1.0 - smoothstep(uProgress - uRevealEdge, uProgress, vUv.y);
    float alpha = pow(1.0 - vUv.y, uFalloff) * uIntensity; // 底浓顶淡
    gl_FragColor = vec4(uColor, alpha * reveal * uFade);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * 完工/出场差分（design.md D7，纯函数便于冒烟）：
 *  - prev = null（首次 setWorld / 无基线）→ 只建基线不触发；
 *  - 绿（done 迁入）：prev ≠ done && next === done；
 *  - 黄（新蜂出场）：prevSessions 无此 sessionId（工蜂/无人机；野蜂不入 records 天然排除）；
 *  - 基线持久于调用方（scene 实例），非每次重建重置。
 * @param {{states: Map, sessions: Set}|null} prev 上一轮基线
 * @param {Array<{id: string, state: string}>} records 本轮蜂记录
 * @returns {{doneIds: string[], enterIds: string[], states: Map, sessions: Set}}
 */
export function diffBeeTransitions(prev, records) {
  const doneIds = [];
  const enterIds = [];
  const states = new Map();
  const sessions = new Set();
  const baseline = !prev || !prev.states; // 首帧只建基线
  for (const rec of records) {
    states.set(rec.id, rec.state);
    sessions.add(rec.id);
    if (baseline) continue;
    if (!prev.sessions.has(rec.id)) {
      enterIds.push(rec.id); // 新 sessionId → 黄（出场优先：同 tick 一蜂至多一枚特效，
    } else if (rec.state === "done" && prev.states.get(rec.id) !== "done") { // 重新入场即 done 不叠加绿）
      doneIds.push(rec.id); // 迁入 done → 绿
    }
  }
  return { doneIds, enterIds, states, sessions };
}

export class HexRiseFxLayer {
  /**
   * @param {object} scene THREE.Scene（或提供 add/remove 的宿主，供冒烟注入）
   * @param {object} opts { poolSize, height }
   */
  constructor(scene, opts = {}) {
    this.scene = scene;
    this.poolSize = opts.poolSize ?? POOL_SIZE;
    this.height = opts.height ?? HEX_FX_HEIGHT;

    /* 共享几何：开口六棱壁（无顶底盖），thetaStart=π/2 对齐平顶瓦片顶点族；
       底边对齐 y=0（几何整体上移 H/2），实例仅需 x/z 平移。 */
    this.geometry = new THREE.CylinderGeometry(1, 1, this.height, 6, 1, true, Math.PI / 2);
    this.geometry.translate(0, this.height / 2, 0);

    /* 原型材质 + 池内独立克隆（uniforms 深拷贝互不影响，D6） */
    this.protoMaterial = this.createMaterial();
    this.materials = [];
    this.slots = []; // 池槽位（读侧公开供冒烟断言；写侧仅内部）
    this.seq = 0; // 触发单调序号（回收"最旧 transient"依据）
    this.followIndex = -1; // 灰跟随墙槽位（-1 = 无）
    for (let i = 0; i < this.poolSize; i++) {
      const material = this.protoMaterial.clone();
      const mesh = new THREE.Mesh(this.geometry, material);
      mesh.visible = false;
      mesh.renderOrder = 15; // 蜂(10)之后、墙(20)之前（motes 同区）
      mesh.frustumCulled = false;
      scene.add(mesh);
      this.materials.push(material);
      this.slots.push({
        mesh,
        material,
        active: false,
        mode: "transient", // 'hold' | 'transient'
        channel: "select", // 'select'（白选中）| 'follow'（灰跟随）
        stage: "rise", // 'rise' | 'hold' | 'fade'
        progress: 0,
        elapsed: 0,
        seq: 0
      });
    }
  }

  createMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uColor: { value: new THREE.Color(PRESETS.white) },
        /* 0.55 且**标准混合**（context-hotbar-rework R6 二次修复）：此前加法混合下
           输出 = 光墙 + 身后画面——地板本身有亮度，叠加总和越过 Bloom 阈值 0.85，
           常驻白墙持续泛光 + ACES 压缩 → 全帧发灰变暗（用户实测，压强度无效——
           加法可无限叠加）。标准混合把输出封顶在墙色 × 0.55 < 阈值，任何背景
           下都不触发泛光；深色地板上观感与加法基本一致。 */
        uIntensity: { value: 0.55 },
        uFalloff: { value: 2.0 }, // 底浓顶淡幂指数（≈2.0 目检调）
        uRevealEdge: { value: 0.18 }, // 揭示前缘软边
        uFade: { value: 1.0 }
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      blending: THREE.NormalBlending, // 标准混合：输出封顶 ≤ 墙色，SHALL NOT 进 Bloom（见上）
      depthWrite: false,
      depthTest: true, // 被墙/蜂正确遮挡
      side: THREE.DoubleSide, // 俯仰锁定后相机恒在地上（φ ≤ 75°）；双面渲染保留以稳兜斜视角
      fog: false // 不参与雾（本场景已无雾，语义声明）
    });
  }

  /* ── 池管理 ── */

  /** 取槽位：空闲优先；hold 不挤占（常驻槽位满 → 放弃）；transient 池满回收最旧。 */
  acquire(mode) {
    for (let i = 0; i < this.slots.length; i++) {
      if (!this.slots[i].active) return i;
    }
    if (mode === "hold") return -1;
    let oldest = -1;
    let oldestSeq = Infinity;
    for (let i = 0; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (s.active && s.mode === "transient" && s.seq < oldestSeq) {
        oldestSeq = s.seq;
        oldest = i;
      }
    }
    return oldest;
  }

  activate(slot, pos, preset, mode, channel) {
    if (!(preset in PRESETS)) throw new Error("hex-fx: unknown preset " + preset);
    slot.active = true;
    slot.mode = mode;
    slot.channel = channel;
    slot.stage = "rise";
    slot.progress = 0;
    slot.elapsed = 0;
    slot.seq = ++this.seq;
    slot.mesh.visible = true;
    slot.mesh.position.set(pos.x, BASE_Y, pos.z);
    slot.material.uniforms.uColor.value.set(PRESETS[preset]); // 瞬切，无中途渐变
    slot.material.uniforms.uProgress.value = 0;
    slot.material.uniforms.uFade.value = 1;
  }

  release(slot) {
    slot.active = false;
    slot.mesh.visible = false;
    if (this.followIndex >= 0 && this.slots[this.followIndex] === slot) this.followIndex = -1;
  }

  activeCount() {
    return this.slots.reduce((n, s) => n + (s.active ? 1 : 0), 0);
  }

  /* ── 生命周期状态机（D4） ── */

  /**
   * 触发一枚特效。mode='hold' 定格驻留至显式移除；mode='transient' 播完自动释放。
   * hold（选中白墙）同槽位语义：新 hold 触发自动回收旧 select 常驻（不同状态用不同
   * 预设实例，不共用同一枚特效中途改色——D5）。
   * @param {{x: number, z: number}} pos 世界坐标（格心；y 由层内 BASE_Y 决定）
   * @param {"white"|"gray"|"green"|"yellow"} preset 预设色
   * @param {"hold"|"transient"} mode 生命周期模式
   */
  trigger(pos, preset, mode = "transient") {
    if (mode === "hold") {
      // select 常驻槽位唯一：触发新 hold 前回收旧 select hold（灰跟随不受影响）
      for (const s of this.slots) {
        if (s.active && s.mode === "hold" && s.channel === "select") this.release(s);
      }
    }
    const index = this.acquire(mode);
    if (index < 0) return null; // hold 槽位异常占满（理论不发生）→ 触发丢弃
    const slot = this.slots[index];
    this.activate(slot, pos, preset, mode, "select");
    return slot;
  }

  /** 移除全部 select 常驻特效（选中清空/离开瓦片）。灰跟随墙有独立生命周期，不受影响。 */
  hidePersistent() {
    for (const s of this.slots) {
      if (s.active && s.mode === "hold" && s.channel !== "follow") this.release(s);
    }
  }

  /**
   * 每帧推进。dt 毫秒；reduced = reduced-motion。
   * progress = min(1, progress + dt/RISE_MS)——"单次播放停在最后一帧"是钳制语义。
   */
  frame(dt, reduced) {
    for (const slot of this.slots) {
      if (!slot.active) continue;
      if (slot.stage === "rise") {
        if (reduced) {
          slot.progress = 1; // 降级：跳过升起直达定格帧
        } else {
          slot.progress = Math.min(1, slot.progress + dt / RISE_MS);
        }
        if (slot.progress >= 1) {
          slot.stage = "hold";
          slot.elapsed = 0;
        }
      } else if (slot.stage === "hold" && slot.mode === "transient") {
        if (reduced) {
          // 降级：静态显示后直接消失（无升起无渐隐，保留出现/消失反馈）
          slot.elapsed += dt;
          if (slot.elapsed >= REDUCED_HOLD_MS) {
            this.release(slot);
            continue;
          }
        } else {
          slot.elapsed += dt;
          if (slot.elapsed >= HOLD_MS) {
            slot.stage = "fade";
            slot.elapsed = 0;
          }
        }
      } else if (slot.stage === "fade") {
        slot.elapsed += dt;
        const fade = Math.max(0, 1 - slot.elapsed / FADE_MS);
        slot.material.uniforms.uFade.value = fade;
        if (fade <= 0) {
          this.release(slot);
          continue;
        }
      }
      slot.material.uniforms.uProgress.value = slot.progress;
    }
  }

  /* ── 灰色跟随（拖拽落点，恒为单格锚点标记） ── */

  /** 进入拖拽的首个落点格：播放一次升起。已激活时仅吸附平移（幂等，SHALL NOT 重播）。 */
  followStart(pos) {
    if (this.followIndex >= 0 && this.slots[this.followIndex].active) {
      this.followMove(pos);
      return;
    }
    const index = this.acquire("hold");
    if (index < 0) return;
    this.followIndex = index;
    this.activate(this.slots[index], pos, "gray", "hold", "follow");
  }

  /** 落点格变化：仅吸附平移（progress 保持，SHALL NOT 逐格重播）。未激活时忽略。 */
  followMove(pos) {
    if (this.followIndex < 0) return;
    const slot = this.slots[this.followIndex];
    if (!slot.active) return;
    slot.mesh.position.set(pos.x, BASE_Y, pos.z);
  }

  /** 拖拽结束（落定/取消/Esc）：立即消失。幂等。 */
  followEnd() {
    if (this.followIndex < 0) return;
    const slot = this.slots[this.followIndex];
    if (slot.active) this.release(slot);
    this.followIndex = -1;
  }

  /** 释放全部资源（几何/原型与池内全部材质/网格出场景）。 */
  dispose() {
    for (const slot of this.slots) {
      this.scene.remove(slot.mesh);
      slot.material.dispose();
    }
    this.materials.length = 0;
    this.slots.length = 0;
    this.protoMaterial.dispose();
    this.geometry.dispose();
    this.followIndex = -1;
  }
}
