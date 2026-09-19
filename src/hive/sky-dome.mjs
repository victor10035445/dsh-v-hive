/**
 * 数字虚空天穹（neon-scene-overhaul design.md D1）：
 *  - 自研渐变 ShaderMaterial 球（BackSide / fog:false / depthWrite:false / 最早渲染），
 *    半径 200 满足约束 fogFar(115) < r < camera.far(400)；
 *  - 三段渐变：顶部深靛紫 → 地平线青色辉光带（低强度、中心仰角 ~0.09 rad）→
 *    地面半区自深靛渐变至近黑（环境雾已移除——地面半区与地板径向压暗同色系衔接）；
 *  - 内建低强度数据星点（hash 闪烁）与地平线六边形网格回声，默认微弱；
 *  - **每帧 position.copy(camera.position) 跟随相机**：pan 目标无界、zoom 上限
 *    220 大于任何可行固定半径，固定穹必穿帮（经典 skybox 跟随模式）；
 *  - 片元着色器尾部挂 tonemapping/colorspace 内建 chunk：直出路径与
 *    EffectComposer(OutputPass) 路径获得一致的 ACES + 输出色彩空间语义
 *    （r152+ 渲染到 RT 时 three 自动跳过 → 由 OutputPass 终末执行）。
 */
import * as THREE from "three";
import { PALETTE } from "./palette.mjs";

const DOME_VERTEX = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position); // 穹顶跟随相机 → 方向即本对象空间单位向量
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const DOME_FRAGMENT = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uGround;     // 深靛（地平线及以下的起点；无雾环境，清屏色同源）
uniform vec3 uGroundDeep; // 地面半区渐变终点近黑
uniform float uTime;
uniform float uStar;      // 星点强度（默认微弱）
uniform float uGrid;      // 六边形网格回声强度（默认微弱）
varying vec3 vDir;

float hash31(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

/* 低强度数据星点：稀疏格子 + 哈希闪烁（上半球渐入，地平线下无星）。 */
float starField(vec3 d, float t) {
  vec3 p = d * 60.0;
  vec3 id = floor(p);
  vec3 f = fract(p) - 0.5;
  float h = hash31(id);
  float on = step(0.93, h);
  float tw = 0.55 + 0.45 * sin(t * (0.5 + h * 1.9) + h * 6.2831);
  float falloff = exp(-dot(f, f) * 22.0);
  return on * tw * falloff;
}

/* 平顶六边形网格距离场：返回到单元中心的六边形度量距离（0.5 = 单元边缘）。 */
float hexEdge(vec2 p) {
  vec2 r = vec2(1.0, 1.7320508);
  vec2 h = r * 0.5;
  vec2 a = mod(p, r) - h;
  vec2 b = mod(p - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  return max(dot(abs(gv), normalize(vec2(1.0, 1.7320508))), abs(gv).x);
}

void main() {
  vec3 d = normalize(vDir);
  float h = d.y;

  /* 辉光带：高斯，中心仰角 ~0.09 rad，地平线以下归零（衔接不变式）。 */
  float band = exp(-pow((h - 0.09) * 5.5, 2.0)) * step(0.0, h);
  vec3 sky = mix(uTop, uHorizon, clamp(band * 0.9 + exp(-max(h, 0.0) * 3.0) * 0.15, 0.0, 1.0));

  /* 地平线及以下自深靛起 → 地面半区渐变至近黑（与地板径向压暗同色系）。 */
  vec3 col = mix(uGround, sky, smoothstep(0.0, 0.14, h));
  col = mix(col, uGroundDeep, smoothstep(0.04, 0.6, -h));

  /* 六边形网格回声：贴地平线上方低仰角带，极低强度。 */
  vec2 gp = vec2(atan(d.z, d.x) * 5.0, h * 30.0);
  float grid = (1.0 - smoothstep(0.42, 0.5, hexEdge(gp))) * exp(-max(h, 0.0) * 13.0);
  col += uHorizon * grid * uGrid * smoothstep(0.0, 0.06, h);

  /* 数据星点（上半球）。 */
  col += vec3(0.62, 0.82, 1.0) * starField(d, uTime) * uStar * smoothstep(0.02, 0.3, h);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export class SkyDome {
  /**
   * @param {object} opts radius 半径（默认 200：fogFar 115 < r < camera.far 400）；
   *                      star 星点强度；grid 网格回声强度。
   *                      PMREM 反射源用小半径独立实例（fromScene 默认 far=100）。
   */
  constructor(opts = {}) {
    this.uniforms = {
      uTop: { value: new THREE.Color(PALETTE.voidTop) },
      uHorizon: { value: new THREE.Color(PALETTE.horizonGlow) },
      uGround: { value: new THREE.Color(PALETTE.voidGround) },
      uGroundDeep: { value: new THREE.Color(PALETTE.groundDeep) },
      uTime: { value: 0 },
      uStar: { value: opts.star ?? 0.42 },
      uGrid: { value: opts.grid ?? 0.09 } // 六边形回声：默认微弱（目检回调 0.16 → 0.09）
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: DOME_VERTEX,
      fragmentShader: DOME_FRAGMENT,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(opts.radius ?? 200, 32, 20), this.material);
    this.mesh.renderOrder = -10; // 最早渲染（不写深度，不会遮挡任何几何）
    this.mesh.frustumCulled = false;
  }

  /** 每帧调用：跟随相机（pan 无界 / zoom 上限 220 > 固定半径可行域）+ 星点时钟。 */
  update(camera, timeMs) {
    this.mesh.position.copy(camera.position);
    this.uniforms.uTime.value = (timeMs ?? 0) * 0.001;
  }

  /** 外观设置（设置页「外观」页签）：穹顶深靛/地平线辉光实时生效。 */
  applyAppearance(a = {}) {
    if (a.skyTop) this.uniforms.uTop.value.set(a.skyTop);
    if (a.horizonGlow) this.uniforms.uHorizon.value.set(a.horizonGlow);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
