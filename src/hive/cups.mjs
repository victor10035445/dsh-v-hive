/**
 * 蜜杯层（design.md D10 / neon-scene-overhaul D6）：归档会话 → 地板下方悬挂的琥珀
 * 半透明蜜杯（压扁球），按巢内晶格镜像排布（杯 i 挂在该巢第 i 个螺旋格正下方，容量
 * 19 杯一层向下叠），instanceColor 呼吸微光。琥珀 = 全场唯一暖 accent（数据之蜜）；
 * emissiveIntensity ~1.4 = HDR 级辉光体（ACES 滚降 + Bloom 阈值截取成辉光核心；
 * 呼吸仅漫反射为已知限制）。v1 只读（官方客户端面无 unarchive，R3）。
 */
import * as THREE from "three";
import { PALETTE } from "./palette.mjs";

const CUP_COLOR = new THREE.Color(PALETTE.amberAccent);

export class CupLayer {
  constructor(scene, opts = {}) {
    this.cupColor = CUP_COLOR.clone(); // 外观可调（设置页「外观」页签：蜜杯琥珀）
    this.geometry = new THREE.SphereGeometry(0.22, 14, 10);
    this.geometry.scale(1, 0.62, 1); // 压扁泪滴感
    this.geometry.translate(0, -0.1, 0);
    this.material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.82,
      emissive: PALETTE.amberEmber,
      emissiveIntensity: 1.4 // HDR 级（0.55 → 1.4，D6）
    });
    this.mesh = null;
    this.pickIndex = []; // instanceId → {workspaceId, sessionId}
    this.phases = [];
    this.scene = scene;
    this.matrix = new THREE.Matrix4();
    this.pos = new THREE.Vector3();
    this.quat = new THREE.Quaternion();
    this.scaleV = new THREE.Vector3(1, 1, 1);
    this.color = new THREE.Color();
    this.group = new THREE.Group();
    scene.add(this.group);
    this.glow = opts.reduced ? 0 : 1;
  }

  /** cups: [{workspaceId, worldCenter:{x,z}, sessionId, index}] */
  setCups(cups) {
    if (this.mesh) {
      this.group.remove(this.mesh);
      this.mesh.dispose();
    }
    this.pickIndex = cups.map((c) => ({ workspaceId: c.workspaceId, sessionId: c.sessionId }));
    this.phases = cups.map((c, i) => (c.phase ?? i * 0.7) % (Math.PI * 2));
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, Math.max(1, cups.length));
    this.mesh.count = cups.length;
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 5;
    this.mesh.castShadow = true;
    // 杯 i 挂在巢内第 i 个螺旋格正下方；每 19 杯（3 层巢基准）向下再叠一排
    for (let i = 0; i < cups.length; i++) {
      const cup = cups[i];
      const row = Math.floor(i / 19);
      this.pos.set(cup.worldCenter.x, -(1.35 + row * 1.15), cup.worldCenter.z);
      this.matrix.compose(this.pos, this.quat.identity(), this.scaleV);
      this.mesh.setMatrixAt(i, this.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.mesh);
  }

  cupAt(instanceId) {
    return this.pickIndex[instanceId] ?? null;
  }

  /** 按 sessionId 查询杯实例是否仍在渲染索引中（scene 选中存在性校验，design.md D3）。 */
  hasSession(sessionId) {
    return this.pickIndex.some((c) => c.sessionId === sessionId);
  }

  /** 按 sessionId 取该杯的世界实例矩阵副本（选中遮罩复用，design.md D3）。 */
  matrixOf(sessionId) {
    if (!this.mesh) return null;
    const idx = this.pickIndex.findIndex((c) => c.sessionId === sessionId);
    if (idx < 0 || idx >= this.mesh.count) return null;
    const m = new THREE.Matrix4();
    this.mesh.getMatrixAt(idx, m);
    return m;
  }

  /** 呼吸微光：instanceColor 相位呼吸（蜜杯数量小，逐帧写色可忽略）。 */
  frame(time) {
    if (!this.mesh || this.mesh.count === 0) return;
    for (let i = 0; i < this.mesh.count; i++) {
      const breathe = this.glow > 0 ? 0.82 + 0.18 * Math.sin(time * 0.0016 + this.phases[i]) : 1;
      this.color.copy(this.cupColor).multiplyScalar(breathe);
      this.mesh.setColorAt(i, this.color);
    }
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  /** 外观设置（设置页「外观」页签）：蜜杯琥珀实时生效。 */
  applyAppearance(a = {}) {
    if (a.amberColor) this.cupColor.set(a.amberColor);
  }

  dispose() {
    if (this.mesh) {
      this.group.remove(this.mesh);
      this.mesh.dispose();
    }
    this.geometry.dispose();
    this.material.dispose();
  }
}
