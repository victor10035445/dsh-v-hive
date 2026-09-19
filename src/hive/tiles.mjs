/**
 * 地面与领地（neon-scene-overhaul D4，二轮目检定稿）：
 *  - 大地板 = 尽量灰度的公共基板：深灰底 + 暗灰蜂窝线（albedo 烘焙，纹理即最终色），
 *    不承担霓虹表达；环境雾已移除（二轮反馈）——地板平面放大至半跨 450 > camera.far(400)，
 *    边缘永不进入渲染距离，再以径向压暗渐入天穹地面近黑色替代雾衔接（无接缝）；
 *  - 领地地板 = 金 + 黑色内描边瓦片（albedo 烘焙，材质 color → 0xffffff），
 *    背面 = 半透明暗铜窖顶；receiveShadow；
 *  - 无 scene.fog（二轮反馈移除）。
 */
import * as THREE from "three";
import { spiralCells, worldOf, hexKey } from "../hex.mjs";
import { PALETTE, css } from "./palette.mjs";

/** 平铺六边形路径（平顶，外接半径 r，顶点族 i·60° 与 hexGeometry 一致），fill 专用。 */
function hexFillPath(ctx, cx, cz, r, s) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const x = (cx + Math.cos(a) * r) * s;
    const z = (cz + Math.sin(a) * r) * s;
    if (i === 0) ctx.moveTo(x, z);
    else ctx.lineTo(x, z);
  }
  ctx.closePath();
}

/** 程序化蜂窝网格绘制（灰度基板，D4 二轮定稿）：底 + 线均来自参数。平铺周期 =
    横 3.0（2 列间距，蜂巢晶格横向最小周期）× 纵 √3（1 行间距）；每格画六边形
    描边环（先整格填线色、再内缩填底色 —— 纯 fill，无 stroke 依赖）。 */
function drawHoneycomb(ctx, width, height, s, { base, line, speckle }) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);
  // 格心：x=1.5q, z=√3(r+q/2)；覆盖周期块并外扩一圈保证无缝。半径 1 的平顶
  // 六边形与该晶格无缝平铺（横距 1.5 / 纵距 √3），描边环宽 0.1 世界单位。
  const centers = [];
  for (let q = -1; q <= 3; q++) {
    for (let r = -2; r <= 3; r++) centers.push([1.5 * q, Math.sqrt(3) * (r + q / 2)]);
  }
  for (const [cx, cz] of centers) {
    ctx.fillStyle = line;
    hexFillPath(ctx, cx, cz, 1, s);
    ctx.fill();
    ctx.fillStyle = base;
    hexFillPath(ctx, cx, cz, 0.9, s);
    ctx.fill();
  }
  if (speckle) {
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = speckle;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
  }
}

/** 大地板灰度纹理：{ albedo, pitchX, pitchZ, redraw }。redraw(baseCss, lineCss)
    重绘同一画布并置 needsUpdate（设置页「外观」页签实时改色）。 */
function makeHoneycombTexture() {
  const pitchX = 3.0;
  const pitchZ = Math.sqrt(3);
  const px = 128; // 每世界单位像素
  const width = Math.round(pitchX * px);
  const height = Math.round(pitchZ * px);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const speckle = "rgba(255, 255, 255, 0.02)"; // 中性微噪点
  const draw = (base, line) => drawHoneycomb(ctx, width, height, width / pitchX, { base, line, speckle });
  draw(css(PALETTE.floorBase), css(PALETTE.floorLine)); // 深灰底 + 暗灰蜂窝线
  const albedo = new THREE.CanvasTexture(canvas);
  albedo.wrapS = THREE.RepeatWrapping;
  albedo.wrapT = THREE.RepeatWrapping;
  albedo.colorSpace = THREE.SRGBColorSpace;
  albedo.anisotropy = 8; // 斜视时压缩方向的细环线不发虚
  return {
    albedo,
    pitchX,
    pitchZ,
    redraw: (base, line) => {
      draw(base, line);
      albedo.needsUpdate = true;
    }
  };
}

/** 径向压暗（无雾衔接，D4 二轮定稿）：按世界水平距离把远端颜色混向天穹地面
    近黑——地板半跨 450 > camera.far(400)，边缘永不入画，近黑渐变代替原雾接缝。
    注入在 tonemapping 之前 → uJyvFade 为线性工作空间颜色（THREE.Color 语义）。 */
function applyRadialFade(material, uniforms) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uJyvCenter = uniforms.uJyvCenter;
    shader.uniforms.uJyvRadius = uniforms.uJyvRadius;
    shader.uniforms.uJyvFade = uniforms.uJyvFade;
    shader.vertexShader =
      "varying vec3 vJyvWorld;\n" +
      shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n vJyvWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;"
      );
    shader.fragmentShader =
      "uniform vec2 uJyvCenter;\nuniform float uJyvRadius;\nuniform vec3 uJyvFade;\nvarying vec3 vJyvWorld;\n" +
      shader.fragmentShader.replace(
        "#include <tonemapping_fragment>",
        "float jyvR = length(vJyvWorld.xz - uJyvCenter) / max(uJyvRadius, 1.0);\n" +
          "gl_FragColor.rgb = mix(gl_FragColor.rgb, uJyvFade, smoothstep(0.58, 0.92, jyvR));\n" +
          "#include <tonemapping_fragment>"
      );
  };
}

/** 巢内格纹理（金色瓦片，五轮：去掉黑色内描边）：金底 + 稍亮金内圈（材质
    color → 0xffffff，纹理即最终色）。ShapeGeometry 的 UV = 形状坐标 [-1,1] →
    repeat/offset 0.5 归一。redraw 同步支持外观实时改色。 */
function makeStudioFloorTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const hexPath = (r) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const x = size / 2 + Math.cos(a) * r;
      const y = size / 2 + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  };
  const draw = (base, inner) => {
    ctx.fillStyle = base; // 金色砖底
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = inner; // 稍亮金内圈（≈形状半径 0.78 内）
    hexPath(size * 0.39);
    ctx.fill();
  };
  draw(css(PALETTE.padBase), css(PALETTE.padInner));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.repeat.set(0.5, 0.5);
  texture.offset.set(0.5, 0.5);
  return {
    texture,
    redraw: (base, inner) => {
      draw(base, inner);
      texture.needsUpdate = true;
    }
  };
}

/** 平顶六边形（外接半径 1）ShapeGeometry，法线 +y。ring 宽度 >0 时为描边环。 */
export function hexGeometry(ringWidth = 0) {
  const shape = new THREE.Shape();
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    pts.push([Math.cos(a), Math.sin(a)]);
  }
  shape.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < 6; i++) shape.lineTo(pts[i][0], pts[i][1]);
  shape.closePath();
  if (ringWidth > 0) {
    const hole = new THREE.Path();
    const inner = [];
    const scale = Math.max(0.05, 1 - ringWidth);
    for (let i = 0; i < 6; i++) inner.push([pts[i][0] * scale, pts[i][1] * scale]);
    hole.moveTo(inner[0][0], inner[0][1]);
    for (let i = 1; i < 6; i++) hole.lineTo(inner[i][0], inner[i][1]);
    hole.closePath();
    shape.holes.push(hole);
  }
  const geometry = new THREE.ShapeGeometry(shape);
  geometry.rotateX(-Math.PI / 2); // XY 面片 → XZ 地板，法线 +y
  return geometry;
}

/** 地面（无限蜂窝灰度地毯）。update(focusPos)：按纹理周期吸附跟随视线目标。
    正面不透明；underMesh（BackSide）从下方半透明呈现，压暗地上结构透入。 */
export class TileField {
  constructor(scene, opts = {}) {
    const { albedo, pitchX, pitchZ, redraw } = makeHoneycombTexture();
    this.redrawFloor = redraw; // 外观实时改色（设置页「外观」页签）
    this.pitchX = pitchX;
    this.pitchZ = pitchZ;
    /* 半跨 450 > camera.far(400)：任何相机位姿下地板边缘都在渲染距离之外（无雾衔接） */
    const spanX = Math.round(300) * pitchX; // 900
    const spanZ = Math.round(520) * pitchZ; // ≈900.7
    albedo.repeat.set(spanX / pitchX, spanZ / pitchZ);
    this.fadeUniforms = {
      uJyvCenter: { value: new THREE.Vector2(0, 0) },
      uJyvRadius: { value: spanX / 2 },
      uJyvFade: { value: new THREE.Color(PALETTE.groundDeep) } // 渐入天穹地面近黑
    };
    this.material = new THREE.MeshStandardMaterial({
      map: albedo,
      color: 0xffffff, // 纹理即最终色
      roughness: 0.82,
      metalness: 0.08,
      side: THREE.FrontSide // 正面不透明
    });
    this.underMaterial = new THREE.MeshStandardMaterial({
      map: albedo, // 共享纹理（repeat 已设）
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.05,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });
    applyRadialFade(this.material, this.fadeUniforms);
    applyRadialFade(this.underMaterial, this.fadeUniforms);
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(spanX, spanZ), this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = 0;
    this.mesh.receiveShadow = true;
    this.underMesh = new THREE.Mesh(this.mesh.geometry, this.underMaterial); // 共享几何
    this.underMesh.rotation.x = -Math.PI / 2;
    this.underMesh.position.y = 0;
    this.underMesh.renderOrder = 2;
    scene.add(this.mesh);
    scene.add(this.underMesh);
    this.scene = scene;
    this.lastSnap = "";
  }

  /** 跟随视线目标：按纹理周期吸附，蜂窝与晶格保持对齐且无接缝跳变；
      径向压暗中心随吸附点更新。 */
  update(focusPos) {
    const sx = Math.round(focusPos.x / this.pitchX) * this.pitchX;
    const sz = Math.round(focusPos.z / this.pitchZ) * this.pitchZ;
    const snap = sx + "," + sz;
    if (snap === this.lastSnap) return;
    this.lastSnap = snap;
    this.mesh.position.x = sx;
    this.mesh.position.z = sz;
    this.underMesh.position.x = sx;
    this.underMesh.position.z = sz;
    this.fadeUniforms.uJyvCenter.value.set(sx, sz);
  }

  frame() {}

  /** 外观设置（设置页「外观」页签）：基板底色/蜂窝线色实时重绘。 */
  applyAppearance(a = {}) {
    if (a.floorBase || a.floorLine) {
      this.redrawFloor(a.floorBase ?? css(PALETTE.floorBase), a.floorLine ?? css(PALETTE.floorLine));
    }
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.scene.remove(this.underMesh);
    this.mesh.geometry.dispose(); // underMesh 共享同一几何
    this.material.map?.dispose();
    this.material.dispose();
    this.underMaterial.dispose();
  }
}

/**
 * 领地地板（金 + 黑色内描边瓦片；背面 = 半透明暗铜窖顶）。
 * 正/背是共享几何的两只 InstancedMesh（矩阵一致）；拾取只挂正面（interact）。
 * 镜像变化时整体重建实例缓冲（防内存增长）。
 */
export class TerritoryLayer {
  constructor(scene, opts = {}) {
    this.scale = opts.scale ?? 1;
    this.floorGeo = hexGeometry(0);
    const { texture, redraw } = makeStudioFloorTexture();
    this.floorTexture = texture;
    this.redrawPad = redraw; // 外观实时改色（设置页「外观」页签）
    this.matFloor = new THREE.MeshStandardMaterial({
      map: this.floorTexture,
      color: opts.floorTop ?? 0xffffff, // 烘焙底色，材质白乘
      roughness: 0.6,
      metalness: 0.08,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0.97
    });
    this.matFloorUnder = new THREE.MeshStandardMaterial({
      color: opts.floorBottom ?? PALETTE.floorUnder, // 背面暗铜窖顶
      roughness: 0.9,
      metalness: 0.05,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    this.floor = null;
    this.floorUnder = null;
    this.pickIndex = []; // instanceId → workspaceId
    this.group = new THREE.Group();
    scene.add(this.group);
    this.matrix = new THREE.Matrix4();
  }

  /** studios: [{workspaceId, center:{q,r}, layer}]（bee-model 派生）。 */
  setStudios(studios) {
    if (this.floor) {
      this.group.remove(this.floor);
      this.floor.dispose();
      this.floor = null;
    }
    if (this.floorUnder) {
      this.group.remove(this.floorUnder);
      this.floorUnder.dispose();
      this.floorUnder = null;
    }
    const floorCells = [];
    this.pickIndex = [];
    for (const studio of studios) {
      const cells = spiralCells(studio.center, Math.max(0, studio.layer - 1));
      for (const cell of cells) {
        this.pickIndex.push(studio.workspaceId);
        floorCells.push(cell);
      }
    }
    const capacity = Math.max(1, floorCells.length);
    this.floor = new THREE.InstancedMesh(this.floorGeo, this.matFloor, capacity);
    this.floorUnder = new THREE.InstancedMesh(this.floorGeo, this.matFloorUnder, capacity);
    for (const mesh of [this.floor, this.floorUnder]) {
      mesh.count = floorCells.length;
      mesh.frustumCulled = false;
      mesh.renderOrder = 2;
    }
    this.floor.receiveShadow = true;
    for (let i = 0; i < floorCells.length; i++) {
      const w = worldOf(floorCells[i], this.scale);
      this.matrix.makeTranslation(w.x, 0.012, w.z);
      this.floor.setMatrixAt(i, this.matrix);
      this.floorUnder.setMatrixAt(i, this.matrix);
    }
    this.group.add(this.floor);
    this.group.add(this.floorUnder);
  }

  /** 拾取：巢内地板 instanceId → workspaceId。 */
  studioAt(instanceId) {
    return this.pickIndex[instanceId] ?? null;
  }

  frame() {}

  /** 外观设置（页内「外观」面板）：金底/内圈实时重绘。 */
  applyAppearance(a = {}) {
    if (a.padBase || a.padInner) {
      this.redrawPad(a.padBase ?? css(PALETTE.padBase), a.padInner ?? css(PALETTE.padInner));
    }
  }

  dispose() {
    if (this.floor) {
      this.group.remove(this.floor);
      this.floor.dispose();
    }
    if (this.floorUnder) {
      this.group.remove(this.floorUnder);
      this.floorUnder.dispose();
    }
    this.floorGeo.dispose();
    this.floorTexture.dispose();
    this.matFloor.dispose();
    this.matFloorUnder.dispose();
  }
}

export { hexKey };
