/**
 * 数据萤尘（neon-scene-overhaul design.md D9）：~256 粒加法混合青色微点
 * （InstancedMesh + MeshBasicMaterial AdditiveBlending，低透明、不写深度），
 * 缓慢上浮 + 微摆，水平范围按视线目标周期回绕（TileField 吸附同思路——
 * pan 无界下粒子永远存在于注视区附近）；reduced-motion 时静止不漂移；
 * 不入 maskScene（选中遮罩不含尘埃）、不投影。
 */
import * as THREE from "three";
import { PALETTE } from "./palette.mjs";

const COUNT = 256;
const WRAP_SPAN = 52; // 水平回绕周期（世界单位，> 视野最大覆盖即可）
const Y_BASE = 0.25;
const Y_BAND = 6.2; // 垂直上浮带

/** 稳定伪随机（种子确定性，避免每次加载密度不同）。 */
function seededRandom(seed) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 8) & 0xffffff) / 0x1000000;
  };
}

/** 把 v 回绕到 [-span/2, span/2)。 */
function wrap(v, span) {
  return (((v % span) + span * 1.5) % span) - span / 2;
}

export class MotesLayer {
  constructor(scene, opts = {}) {
    this.count = opts.count ?? COUNT;
    const random = seededRandom(0x9e3779b9);
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        bx: (random() - 0.5) * WRAP_SPAN, // 相对目标的基准水平偏移
        bz: (random() - 0.5) * WRAP_SPAN,
        y0: Y_BASE + random() * Y_BAND,
        rise: 0.1 + random() * 0.28, // 上浮速度（单位/秒）
        risePhase: random() * Y_BAND,
        swayAmp: 0.25 + random() * 0.5, // 微摆幅度
        phase: random() * Math.PI * 2,
        scale: 0.5 + random() * 0.95 // 尺寸差异 → 星空感
      });
    }
    this.geometry = new THREE.IcosahedronGeometry(0.042, 0);
    this.material = new THREE.MeshBasicMaterial({
      color: PALETTE.moteCyan,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false // 加法混合叠雾色会发灰，氛围由低透明承担
    });
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 15; // 地板/蜂之后、墙(20)之前的透明序
    scene.add(this.mesh);
    this.scene = scene;
    this.matrix = new THREE.Matrix4();
    this.pos = new THREE.Vector3();
    this.quat = new THREE.Quaternion();
    this.scaleV = new THREE.Vector3();
  }

  /**
   * 每帧推进。t 毫秒；target = 视线目标（rig.target）；reduced = 静止不漂移。
   */
  frame(t, target, reduced) {
    const time = reduced ? 0 : t * 0.001;
    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i];
      /* 缓慢上浮（带内回绕）+ 微摆 */
      const y = Y_BASE + ((p.y0 - Y_BASE + time * p.rise) % Y_BAND + Y_BAND) % Y_BAND;
      const swayX = reduced ? 0 : Math.sin(time * 0.42 + p.phase) * p.swayAmp * 0.35;
      const swayZ = reduced ? 0 : Math.cos(time * 0.35 + p.phase * 1.7) * p.swayAmp * 0.35;
      /* 水平范围按视线目标周期回绕（pan 远处粒子仍在注视区） */
      this.pos.set(
        target.x + wrap(p.bx + swayX - target.x, WRAP_SPAN),
        y,
        target.z + wrap(p.bz + swayZ - target.z, WRAP_SPAN)
      );
      const pulse = 1 + (reduced ? 0 : 0.12 * Math.sin(time * 1.3 + p.phase * 2.3));
      this.scaleV.setScalar(p.scale * pulse);
      this.matrix.compose(this.pos, this.quat.identity(), this.scaleV);
      this.mesh.setMatrixAt(i, this.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.dispose();
    this.geometry.dispose();
    this.material.dispose();
  }

  /** 外观设置（设置页「外观」页签）：萤尘色实时生效。 */
  applyAppearance(a = {}) {
    if (a.moteColor) this.material.color.set(a.moteColor);
  }
}
