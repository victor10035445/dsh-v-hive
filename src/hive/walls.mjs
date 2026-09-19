/**
 * 巢墙层（design.md D4 + neon-scene-overhaul D5，二轮目检定稿）：
 *  - 外围墙板：沿领地真实边缘逐边生成（1×0.9 竖直平面，法线朝外），**霓虹金透感**
 *    （金色基色 + 金色自发光，半透明）——段段相接形成蜂巢簇真实轮廓；
 *  - 内隔墙：巢内格间公共边（hex.interiorEdges），比外围更透（压低视觉遮挡），
 *    体现「多个六面体房间」的体块感；不投影；**不做朝向相机淡出**（四轮：可见度
 *    已由外观设置显式给定时，恒定 alpha 更符合直觉）；
 *  - 内墙轮廓边条：内隔墙顶缘金条（独立透明材质，透明度可调）；
 *  - 外围墙保留 D4 朝向淡出 onBeforeCompile 注入（alpha 基准为运行时 uniform，
 *    经外观设置实时可调）；
 *  - 顶缘金饰条 InstancedMesh（沿同一 edges 数据，y=WALL_HEIGHT，emissive HDR
 *    不投影——Bloom 阈值上的发光体）。
 */
import * as THREE from "three";
import { PALETTE } from "./palette.mjs";

export const WALL_HEIGHT = 0.9;
const TRIM_HEIGHT = 0.07; // 饰条截面高（世界单位，细长条）
const TRIM_DEPTH = 0.055; // 饰条截面厚
const TRIM_OUTSET = 0.03; // 沿墙法线外移（贴外缘可见）
/* 未选中巢饰条强度（context-hotbar-rework R7，用户定稿「未选中的蜂巢不显示
   高光的特效」）：0.3 低于 Bloom 阈值 0.85——金条可见但不进泛光；选中巢用
   外观设置 trimGlow（默认 1.9，HDR 辉光）。 */
const TRIM_DIM_INTENSITY = 0.3;

/** D4 朝向淡出注入：仅当相机自上方俯视且墙面朝向相机时淡出。
    alphaUniform（vec2：x=实色可见度 / y=淡出下限）为运行时 uniform——
    外围墙/内隔墙的可见度经设置页「外观」页签实时可调（三轮）。 */
function injectFacingFade(material, fadeUniform, alphaUniform) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uJyvCam = fadeUniform;
    shader.uniforms.uJyvAlpha = alphaUniform;
    shader.vertexShader =
      "varying vec3 vJyvWorld;\nvarying vec3 vJyvNormalW;\n" +
      shader.vertexShader
        .replace(
          "#include <beginnormal_vertex>",
          "#include <beginnormal_vertex>\n vJyvNormalW = normalize(mat3(instanceMatrix) * objectNormal);"
        )
        .replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\n vec4 jyvWp4 = vec4(transformed, 1.0);\n jyvWp4 = instanceMatrix * jyvWp4;\n vJyvWorld = (modelMatrix * jyvWp4).xyz;"
        );
    shader.fragmentShader =
      "uniform vec3 uJyvCam;\nuniform vec2 uJyvAlpha;\nvarying vec3 vJyvWorld;\nvarying vec3 vJyvNormalW;\n" +
      shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        "#include <dithering_fragment>\n float jyvFacing = dot(normalize(vJyvNormalW), normalize(uJyvCam - vJyvWorld));\n float jyvAbove = normalize(uJyvCam - vJyvWorld).y;\n float jyvFade = smoothstep(0.0, 0.30, jyvFacing) * smoothstep(0.22, 0.52, jyvAbove);\n gl_FragColor.a *= mix(uJyvAlpha.x, uJyvAlpha.y, jyvFade);"
      );
  };
}

function makeWallMaterial(fadeUniform, alphaUniform, emissiveIntensity) {
  const material = new THREE.MeshStandardMaterial({
    color: PALETTE.wallGold, // 霓虹金墙板基色
    emissive: PALETTE.wallGoldEmissive, // 金色自发光（透感）
    emissiveIntensity,
    roughness: 0.42,
    metalness: 0.16,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  injectFacingFade(material, fadeUniform, alphaUniform);
  return material;
}

export class WallLayer {
  constructor(scene, opts = {}) {
    // 单元墙板：宽 1（=瓦片边长）、高 1（实例 y 缩放 = 墙高），底边对齐原点，法线 +z
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.geometry.translate(0, 0.5, 0);
    this.fadeUniform = { value: new THREE.Vector3() };
    /* 外围墙可见度 uniform（页内「外观」实时可调）：默认 70% 可见 */
    this.outerAlphaUniform = { value: new THREE.Vector2(0.7, 0.2) };
    this.material = makeWallMaterial(this.fadeUniform, this.outerAlphaUniform, 0.6); // 外围墙：透感金 + 朝向淡出
    /* 内隔墙（四轮）：不做朝向相机淡出——可见度已由「外观」显式设置，恒定 alpha 更符合直觉 */
    this.innerMaterial = new THREE.MeshStandardMaterial({
      color: PALETTE.wallGold,
      emissive: PALETTE.wallGoldEmissive,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    /* 内墙轮廓边条（四轮）：内隔墙顶缘金条，透明度可调（默认 0.45） */
    this.innerTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1206,
      emissive: PALETTE.wallTrim,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      roughness: 0.4,
      metalness: 0.1
    });
    this.mesh = null;
    this.innerMesh = null;
    this.innerTrim = null;
    /* 顶缘金饰条（D5）：细长条截面，沿 edges 数据置于墙顶，emissive HDR、不投影。
       分桶（R7）：选中巢 → trimMaterial（外观 trimGlow，HDR 辉光）；未选中 →
       trimDimMaterial（低于 Bloom 阈值，无外发光）。 */
    this.trimGeometry = new THREE.BoxGeometry(1, TRIM_HEIGHT, TRIM_DEPTH);
    this.trimMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1206,
      emissive: PALETTE.wallTrim,
      emissiveIntensity: 1.9, // HDR：恰在 Bloom 阈值上（目检定，克制细辉光）
      roughness: 0.4,
      metalness: 0.1
    });
    this.trimDimMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1206,
      emissive: PALETTE.wallTrim,
      emissiveIntensity: TRIM_DIM_INTENSITY,
      roughness: 0.4,
      metalness: 0.1
    });
    this.trim = null;
    this.trimDim = null;
    this.highlighted = null; // 选中巢 workspaceId（null = 无；分桶装配见 setHighlighted）
    this.trimPanels = []; // setStudios 缓存（workspaceId + 矩阵），选中变化时重分桶
    this.pickIndex = []; // instanceId → workspaceId
    this.scene = scene;
    this.matrix = new THREE.Matrix4();
    this.pos = new THREE.Vector3();
    this.quat = new THREE.Quaternion();
    this.euler = new THREE.Euler();
    this.scaleV = new THREE.Vector3();
  }

  /** studios: [{workspaceId, edges, interiorEdges}]（边缘/隔断由 hex 生成，scene 装配） */
  setStudios(studios) {
    for (const key of ["mesh", "innerMesh", "trim", "trimDim", "innerTrim"]) {
      if (this[key]) {
        this.scene.remove(this[key]);
        this[key].dispose();
        this[key] = null;
      }
    }
    const panels = [];
    const innerPanels = [];
    for (const studio of studios) {
      for (const edge of studio.edges ?? []) panels.push({ ...edge, workspaceId: studio.workspaceId });
      for (const edge of studio.interiorEdges ?? []) innerPanels.push({ ...edge, workspaceId: studio.workspaceId });
    }
    this.pickIndex = panels.map((p) => p.workspaceId);
    this.trimPanels = panels;
    /* 外围墙板 */
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, Math.max(1, panels.length));
    this.mesh.count = panels.length;
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 20; // 蜂(10)/地板(2)之后
    this.mesh.castShadow = true;
    /* 内隔墙：更透、不投影，先于外墙渲染（透明序：由内向外） */
    this.innerMesh = new THREE.InstancedMesh(this.geometry, this.innerMaterial, Math.max(1, innerPanels.length));
    this.innerMesh.count = innerPanels.length;
    this.innerMesh.frustumCulled = false;
    this.innerMesh.renderOrder = 19;
    /* 内墙轮廓边条：内隔墙顶缘（同几何，独立透明材质），透明序在外墙之后 */
    this.innerTrim = new THREE.InstancedMesh(this.trimGeometry, this.innerTrimMaterial, Math.max(1, innerPanels.length));
    this.innerTrim.count = innerPanels.length;
    this.innerTrim.frustumCulled = false;
    this.innerTrim.renderOrder = 21;
    /* 顶缘金饰条：按选中态分桶装配（trim = 选中巢辉光桶 / trimDim = 未选中无泛光桶），
       见 rebuildTrim；此处仅收集逐边变换。 */
    const trimXforms = [];
    for (let i = 0; i < panels.length; i++) {
      const e = panels[i];
      this.pos.set(e.mx, 0, e.mz);
      this.euler.set(0, Math.atan2(e.dx, e.dz), 0); // 平面法线 +z → 朝外方向
      this.quat.setFromEuler(this.euler);
      this.scaleV.set(1, WALL_HEIGHT, 1);
      this.matrix.compose(this.pos, this.quat, this.scaleV);
      this.mesh.setMatrixAt(i, this.matrix);
      /* 饰条：沿同一边置于墙顶 y=WALL_HEIGHT，沿外法线微移出贴外缘 */
      const len = Math.hypot(e.dx, e.dz) || 1;
      this.pos.set(e.mx + (e.dx / len) * TRIM_OUTSET, WALL_HEIGHT, e.mz + (e.dz / len) * TRIM_OUTSET);
      this.scaleV.set(1, 1, 1);
      this.matrix.compose(this.pos, this.quat, this.scaleV);
      trimXforms.push({ workspaceId: e.workspaceId, matrix: this.matrix.clone() });
    }
    this.trimXforms = trimXforms;
    for (let i = 0; i < innerPanels.length; i++) {
      const e = innerPanels[i];
      this.pos.set(e.mx, 0, e.mz);
      this.euler.set(0, Math.atan2(e.dx, e.dz), 0);
      this.quat.setFromEuler(this.euler);
      this.scaleV.set(1, WALL_HEIGHT, 1);
      this.matrix.compose(this.pos, this.quat, this.scaleV);
      this.innerMesh.setMatrixAt(i, this.matrix);
      /* 内墙轮廓边条：随内隔墙同点位（y=WALL_HEIGHT） */
      this.pos.set(e.mx, WALL_HEIGHT, e.mz);
      this.scaleV.set(1, 1, 1);
      this.matrix.compose(this.pos, this.quat, this.scaleV);
      this.innerTrim.setMatrixAt(i, this.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.innerMesh.instanceMatrix.needsUpdate = true;
    this.innerTrim.instanceMatrix.needsUpdate = true;
    this.rebuildTrim();
    this.scene.add(this.mesh);
    this.scene.add(this.innerMesh);
    this.scene.add(this.innerTrim);
  }

  /** 选中巢高亮分桶（R7）：workspaceId 的饰条进辉光桶，其余进无泛光桶；null = 全暗。
      每次选中变化调用（scene.updateSelection 接线；内含边沿检测，幂等）。 */
  setHighlighted(workspaceId) {
    if (this.highlighted === workspaceId) return;
    this.highlighted = workspaceId;
    this.rebuildTrim();
  }

  /** 重建饰条桶：trim（选中，外观 trimGlow HDR）+ trimDim（其余，低于 Bloom 阈值）。 */
  rebuildTrim() {
    for (const key of ["trim", "trimDim"]) {
      if (this[key]) {
        this.scene.remove(this[key]);
        this[key].dispose();
        this[key] = null;
      }
    }
    const on = [];
    const off = [];
    for (const t of this.trimXforms ?? []) (t.workspaceId === this.highlighted ? on : off).push(t);
    this.trim = new THREE.InstancedMesh(this.trimGeometry, this.trimMaterial, Math.max(1, on.length));
    this.trim.count = on.length;
    this.trim.frustumCulled = false;
    this.trimDim = new THREE.InstancedMesh(this.trimGeometry, this.trimDimMaterial, Math.max(1, off.length));
    this.trimDim.count = off.length;
    this.trimDim.frustumCulled = false;
    on.forEach((t, i) => this.trim.setMatrixAt(i, t.matrix));
    off.forEach((t, i) => this.trimDim.setMatrixAt(i, t.matrix));
    this.trim.instanceMatrix.needsUpdate = true;
    this.trimDim.instanceMatrix.needsUpdate = true;
    if (on.length) this.scene.add(this.trim);
    if (off.length) this.scene.add(this.trimDim);
  }

  studioAt(instanceId) {
    return this.pickIndex[instanceId] ?? null;
  }

  /** 外观设置（蜂巢指挥中心页内「外观」面板）：墙金色 / 饰条金与亮度 /
      内外可见度 / 内墙轮廓边条透明度实时生效。
      淡出下限随外墙可见度按比例缩放（0.25×）；内隔墙为恒定 alpha（无朝向淡出）。 */
  applyAppearance(a = {}) {
    if (a.wallGold) {
      this.material.color.set(a.wallGold);
      this.innerMaterial.color.set(a.wallGold);
    }
    if (a.trimColor) {
      this.trimMaterial.emissive.set(a.trimColor);
      this.trimDimMaterial.emissive.set(a.trimColor);
      this.innerTrimMaterial.emissive.set(a.trimColor);
    }
    if (Number.isFinite(a.trimGlow)) this.trimMaterial.emissiveIntensity = Math.max(0, a.trimGlow);
    if (Number.isFinite(a.outerWallAlpha)) {
      const visible = Math.min(1, Math.max(0.05, a.outerWallAlpha));
      this.outerAlphaUniform.value.set(visible, visible * 0.25);
    }
    if (Number.isFinite(a.innerWallAlpha)) {
      this.innerMaterial.opacity = Math.min(1, Math.max(0.02, a.innerWallAlpha));
    }
    if (Number.isFinite(a.innerTrimAlpha)) {
      this.innerTrimMaterial.opacity = Math.min(1, Math.max(0, a.innerTrimAlpha));
    }
  }

  frame(camera) {
    this.fadeUniform.value.copy(camera.position);
  }

  dispose() {
    for (const key of ["mesh", "innerMesh", "trim", "trimDim", "innerTrim"]) {
      if (this[key]) {
        this.scene.remove(this[key]);
        this[key].dispose();
      }
    }
    this.geometry.dispose();
    this.material.dispose();
    this.innerMaterial.dispose();
    this.trimGeometry.dispose();
    this.trimMaterial.dispose();
    this.trimDimMaterial.dispose();
    this.innerTrimMaterial.dispose();
  }
}
