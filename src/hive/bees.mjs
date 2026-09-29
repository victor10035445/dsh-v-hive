/**
 * 工蜂层（design.md D3/D10；v0.2.6 起支持 GLB 模型替换图元；custom-bee-types 起支持
 * 多外观模型按蜂种变体实例化；render-perf-optimization 起支持 LOD 距离分桶）：
 *  - 模型路径：外观模型（assets/models/<id>.glb，宿主 /api/dsh-hive/assets/ 提供）
 *    加载成功后，遍历其 Mesh 构建逐部件 InstancedMesh（beeMatrix × 部件归一化矩阵），
 *    状态色经 instanceColor 乘染（与纹理相乘，idle 为本色）；图元蜂保留为默认模型
 *    加载完成前的回退。
 *  - 外观变体（bee-model-variants）：每模型一个变体桶（独立的部件实例集 + 密集实例
 *    序 + 拾取记录数组），蜂按蜂种 beeModel 字段落入对应桶；变体懒加载，未就绪时
 *    回落默认外观（worker）。拾取经 (mesh, instanceId) → 桶记录表解析。
 *  - 图元路径：身体（胸+头+条纹，顶点色固定）/ 腹部（instanceColor 状态色）/ 翅膀
 *    （顶点着色器拍动）共享同一份逐蜂变换（D10）。
 *  - LOD 距离分桶（render-perf-optimization，design.md D1-D5/D9）：按蜂到相机的世界
 *    距离分三档——T0 近（完整动画 + 翅膀 + 投影阴影 + 气泡）、T1 中（身体/腹部动画
 *    保留，无翅膀/阴影/气泡）、T2 远（姿态冻结：实例矩阵不逐帧重写、状态色仅状态
 *    变更沿更新）。实现为 per-tier InstancedMesh（共享几何/材质），mesh.count = 桶内
 *    实例数——上传量、顶点着色、阴影提交随可见集缩放；分桶带滞回防抖动，生命周期
 *    动画 / 描边蜂 / 出泡蜂强制近档（D4）；T2 用槽位分配表（Map<id, slot> + 空闲回收）
 *    冻结矩阵仅迁移沿写入（D5）。分桶只发生在帧路径，SHALL NOT 触碰 setBees 装配
 *    与 hex-rise-fx 差分数据流。
 *  - 场景比例尺（worker-scale-normalization）：GLB 模型按「包围球半径 = BEE_RADIUS
 *    （0.8 × 瓦片边长，锚点定义于 src/hex.mjs）」归一化；蜂体相关间距（动画半径、
 *    悬停高度、入场/离场位移、LOD 阈值）均为其倍率表达式；图元回退蜂自成比例，
 *    不随比例尺缩放（加载瞬态的尺寸不一致被接受）。
 * 五态动画（D3）：待命悬停轻晃；忙碌振翅+贴格低巡（蜂位内小幅徘徊，不压瓦片边界）；
 * 求助发光脉冲+悬停升高；带蜜归落格绿光；归档化蜜坠落（飞向蜜杯收缩淡出）。
 * 无人机绕父蜂盘旋（折叠收拢）。
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BEE_RADIUS, SQRT3, wallRadius } from "../hex.mjs";
import { BEE_APPEARANCE_MODELS, DEFAULT_APPEARANCE_MODEL } from "../bee-types.mjs";

export const STATE_COLORS = Object.freeze({
  idle: new THREE.Color(0xd8d3c8),   // 待命灰白
  busy: new THREE.Color(0x3f8fd6),   // 忙碌蓝
  help: new THREE.Color(0xe8a13c),   // 求助琥珀
  done: new THREE.Color(0x57b26a)    // 带蜜归绿
});

const BODY_COLOR = new THREE.Color(0x4a3826);
const HEAD_COLOR = new THREE.Color(0x2e2317);
const STRIPE_COLOR = new THREE.Color(0x1d1712);
const WING_COLOR = new THREE.Color(0xdfe8f2);

/* ── 退场动画时长（ms，drone-active-visibility D8/任务 3.2）：从 poseOf 内联魔数提取
   为模块常量——setBees 簿记判断（终态播完判定）与 poseOf 动画共用同一出处，防双处漂移 ── */
export const EXIT_OUT_MS = 420; // 离场（升空淡出）
export const EXIT_TO_HONEY_MS = 900; // 归档化蜜飞行（飞向蜜杯收缩淡出）

const MODEL_YAW = Math.PI / 2; // glTF 角色朝 +Z → 蜂头朝 +X

/* ── 蜂体相关间距 = 场景比例尺锚点 BEE_RADIUS × 倍率（design.md D3/D4，禁止独立绝对值魔数） ── */
/** 忙碌态贴格低巡幅度：0.08 × BEE_RADIUS，上界 = 瓦片内切圆半径 − 蜂包围球半径
 *  （0.0825 × BEE_RADIUS；蜂体最远触达 BEE_RADIUS + BUSY_WANDER ≈ 0.864 < 0.866）。 */
export const BUSY_WANDER = 0.08 * BEE_RADIUS;
export const BUSY_WANDER_MAX = SQRT3 / 2 - BEE_RADIUS; // 几何上界（内切圆 − 蜂半径）

/* ── 拾取宽容球半径（bee-pick-and-marquee-focus D2）：比例尺锚点倍率，禁独立绝对值
   魔数（与 BUSY_WANDER / LOD_* 同一纪律，冒烟锁定等式）。球心 = 蜂矩阵原点 ⇒
   径向余量 ≈ 0.32~0.34 世界单位（模型视觉半尺寸 ≈ 0.458/0.482/0.445，余量 ≈ 1.7 倍）；
   仍受比例尺纪律约束：2 × 0.8 = 1.6 < 相邻格心距 √3 ≈ 1.732（**三维**不重叠；
   屏幕空间重叠由「最近命中优先」消解，SHALL NOT 宣称屏幕空间不重叠）。唯一旋钮。 */
export const BEE_PICK_RADIUS = 1.0 * BEE_RADIUS;

/* ── LOD 距离分桶常量（design.md D1；BEE_RADIUS 倍率——比例尺锚点唯一约束，
   禁独立绝对值魔数）。距离语义 = 蜂世界坐标到相机世界坐标的距离（屏幕占比语义）。 ── */
export const TIER_NEAR = 0; // 近档：完整动画 + 翅膀 + 阴影 + 气泡
export const TIER_MID = 1;  // 中档：身体/腹部动画保留，无翅膀/阴影/气泡
export const TIER_FAR = 2;  // 远档：姿态冻结，状态色仅状态变更沿更新
/** 近/中档边界（= 24 世界单位）：近档以「翅膀/巡游肉眼可辨」为界（任务 1.1 基线定稿）。 */
export const LOD_NEAR = 30 * BEE_RADIUS;
/** 中/远档边界（= 60 世界单位）：远景蜂仅状态色可读。 */
export const LOD_MID = 75 * BEE_RADIUS;
/** 滞回带（= 1.6 世界单位）：升档（远→近）用紧阈值、降档（近→远）用松阈值，带内不换档。 */
export const LOD_HYSTERESIS = 2 * BEE_RADIUS;

/**
 * 距离定档（含滞回；纯函数，供冒烟测试真值表复用——先例 isDroneVisible 顶层导出）。
 * record.tier 为上一帧**自然**档位（强制近档帧不改写它，解除强制后按滞回回落）；
 * 首次定档（无记录）用紧阈值（名义常量）。降档可跨档单帧完成（相机瞬移），升档
 * 逐档恢复（spec「全景缩放全场冻结」：重新推近时按滞回规则逐档恢复动画）。
 */
export function assignTier(record, dist) {
  const prev = record.tier;
  if (prev === TIER_NEAR) {
    if (dist <= LOD_NEAR + LOD_HYSTERESIS) return TIER_NEAR; // 滞回带内不换档
    if (dist > LOD_MID + LOD_HYSTERESIS) return TIER_FAR;    // 瞬移跨档：单帧完成
    return TIER_MID;
  }
  if (prev === TIER_MID) {
    if (dist <= LOD_NEAR) return TIER_NEAR;                  // 升档用紧阈值（名义常量）
    if (dist > LOD_MID + LOD_HYSTERESIS) return TIER_FAR;
    return TIER_MID;
  }
  if (prev === TIER_FAR) {
    if (dist <= LOD_MID) return TIER_MID;                    // 逐档恢复（升档）
    return TIER_FAR;
  }
  return dist <= LOD_NEAR ? TIER_NEAR : dist <= LOD_MID ? TIER_MID : TIER_FAR;
}

/**
 * 静态全场包围球（bee-pick-and-marquee-focus D1）：圆心 = 各巢世界中心的外接中心，
 * 半径 = max(巢心距圆心距离) + 该巢墙外接半径 wallRadius(layer) + 2×BEE_RADIUS
 * 余量（巢内离场升空/无人机绕飞环/忙碌低巡水平位移 + 蜂体半径，全部 ≤ 1×BEE_RADIUS，
 * 取 2× 保守）。纯 raycast early-out 用途（`frustumCulled = false` 下渲染器不用它；
 * `three.core.js` 的 `intersectsObject` 与视锥剔除路径都不参与）——「永不误杀」优先于
 * 「紧贴分布」，故余量取保守侧。用途与边界见 design.md D1。
 *
 * @param {Array<{worldCenter: {x:number,z:number}, layer:number}>} studioLayers
 * @returns {THREE.Sphere}
 */
export function fieldSphereOf(studioLayers) {
  const list = Array.isArray(studioLayers) ? studioLayers : [];
  if (list.length === 0) return new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2 * BEE_RADIUS);
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const studio of list) {
    const wc = studio?.worldCenter;
    if (!wc) continue;
    minX = Math.min(minX, wc.x);
    maxX = Math.max(maxX, wc.x);
    minZ = Math.min(minZ, wc.z);
    maxZ = Math.max(maxZ, wc.z);
  }
  if (!Number.isFinite(minX)) return new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2 * BEE_RADIUS);
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  let radius = 0;
  for (const studio of list) {
    const wc = studio?.worldCenter;
    if (!wc) continue;
    const margin = wallRadius(studio.layer ?? 1); // 巢内分布（格心距巢心 ≤ 补丁外接半径）
    radius = Math.max(radius, Math.hypot(wc.x - cx, wc.z - cz) + margin);
  }
  return new THREE.Sphere(new THREE.Vector3(cx, 0, cz), radius + 2 * BEE_RADIUS);
}

/** 群体级早退球并集（D1 收敛项）：候选球 ∪ 单蜂球（圆心 + 定长半径，零分配地写入 out）。 */
function unionGroupSphere(out, x, y, z, radius) {
  if (out.radius < 0) {
    out.center.set(x, y, z);
    out.radius = radius;
    return;
  }
  const dx = x - out.center.x;
  const dy = y - out.center.y;
  const dz = z - out.center.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (dist + radius <= out.radius) return; // 已被覆盖（多数帧的常态：群体球远大于单蜂球）
  if (dist + out.radius <= radius) {
    out.center.set(x, y, z);
    out.radius = radius;
    return;
  }
  const next = (out.radius + dist + radius) / 2;
  const k = dist > 1e-6 ? (next - out.radius) / dist : 0;
  out.center.set(out.center.x + dx * k, out.center.y + dy * k, out.center.z + dz * k);
  out.radius = next;
}

/**
 * 桶集（图元路径与每个 GLB 变体各一份）：per-tier 部件网格 + T2 槽位分配表。
 * tierParts[tier] = [{ mesh, tinted, normalization? }]——mesh.count 即当帧桶容量落点；
 * T0/T1 每帧全量重写（槽位 = 当帧桶内序号），T2 冻结矩阵写在其固定槽位
 * （slots + free + next 满足不变量 slots.size + free.length = next ≤ maxBees）。
 */
function createBuckets() {
  return {
    tierParts: [[], [], []],
    counts: [0, 0, 0],   // T0/T1 当帧计数（T2 由槽位表驱动）
    records: [[], [], []], // 拾取表：T0/T1 当帧紧凑、T2 槽位稀疏（slot → record）
    slots: new Map(),    // T2 槽位表：sessionId → slot（进桶沿分配、离桶沿释放）
    free: [],            // 空闲槽回收（LIFO）
    next: 0,             // 已创建槽位高水位
    states: new Map(),   // T2 冻结状态色变更沿检测：sessionId → 已写状态
    matrixDirty: false,  // T2 迁移沿 → instanceMatrix.needsUpdate
    colorDirty: false    // T2 状态变更沿 → instanceColor.needsUpdate
  };
}

/* ── 蜂体几何集：身体/腹部/翅膀三份几何（局部空间：+x 为蜂头朝向，y 向上）。 ── */
function buildGeometries() {
  const parts = [];
  const push = (geometry, color, transform) => {
    if (transform) geometry.applyMatrix4(transform);
    const count = geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    parts.push(geometry);
  };
  const matrix = (x, y, z, sx, sy, sz) =>
    new THREE.Matrix4().compose(
      new THREE.Vector3(x, y, z),
      new THREE.Quaternion(),
      new THREE.Vector3(sx, sy, sz)
    );
  push(new THREE.SphereGeometry(0.105, 12, 10), BODY_COLOR, matrix(0, 0, 0, 1, 0.92, 0.92)); // 胸
  push(new THREE.SphereGeometry(0.07, 10, 8), HEAD_COLOR, matrix(0.135, 0.015, 0, 1, 1, 1)); // 头
  const ring = new THREE.TorusGeometry(0.118, 0.014, 6, 18);
  push(ring.clone().applyMatrix4(matrix(-0.11, -0.01, 0)), STRIPE_COLOR, null);
  push(ring.applyMatrix4(matrix(-0.155, -0.012, 0)), STRIPE_COLOR, null);
  push(new THREE.ConeGeometry(0.022, 0.08, 6), STRIPE_COLOR, matrix(-0.29, -0.02, 0, 1, 1, 1).multiply(
    new THREE.Matrix4().makeRotationZ(Math.PI / 2)
  ));
  const body = mergeGeometries(parts);

  const abdomen = new THREE.SphereGeometry(0.125, 12, 10);
  abdomen.scale(1.45, 0.95, 0.95);
  abdomen.translate(-0.2, -0.012, 0);

  const wing = new THREE.CircleGeometry(0.15, 14);
  wing.rotateX(-Math.PI / 2);
  wing.scale(0.62, 1, 1.35);
  wing.translate(0, 0, 0.16);
  return { body, abdomen, wing };
}

/** 轻量几何合并（position/normal/color/index）。 */
function mergeGeometries(list) {
  let vertexCount = 0;
  let indexCount = 0;
  for (const g of list) {
    vertexCount += g.attributes.position.count;
    indexCount += g.index ? g.index.count : g.attributes.position.count;
  }
  const position = new Float32Array(vertexCount * 3);
  const normal = new Float32Array(vertexCount * 3);
  const color = new Float32Array(vertexCount * 3);
  const index = new Uint16Array(indexCount);
  let vOffset = 0;
  let iOffset = 0;
  for (const g of list) {
    position.set(g.attributes.position.array, vOffset * 3);
    normal.set(g.attributes.normal.array, vOffset * 3);
    color.set(g.attributes.color.array, vOffset * 3);
    if (g.index) {
      for (let i = 0; i < g.index.count; i++) index[iOffset + i] = g.index.getX(i) + vOffset;
      iOffset += g.index.count;
    } else {
      for (let i = 0; i < g.attributes.position.count; i++) index[iOffset + i] = i + vOffset;
      iOffset += g.index.count;
    }
    vOffset += g.attributes.position.count;
  }
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(position, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  merged.setAttribute("color", new THREE.BufferAttribute(color, 3));
  merged.setIndex(new THREE.BufferAttribute(index, 1));
  return merged;
}

const WING_VERTEX = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  uniform float uFlap;
  varying vec3 vNormalW;
  void main() {
    float flap = sin(uTime * uFlap + aPhase) * 0.75;
    float c = cos(flap);
    float s = sin(flap);
    vec3 p = vec3(position.x, position.y * c - position.z * s, position.y * s + position.z * c);
    vec3 n = vec3(normal.x, normal.y * c - normal.z * s, normal.y * s + normal.z * c);
    vec4 world = instanceMatrix * vec4(p, 1.0);
    vNormalW = normalize(mat3(instanceMatrix) * n);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const WING_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormalW;
  void main() {
    float light = 0.72 + 0.28 * max(dot(normalize(vNormalW), normalize(vec3(0.4, 1.0, 0.3))), 0.0);
    gl_FragColor = vec4(uColor * light, 0.55);
  }
`;

/**
 * 蜂动画层。setBees 重建实例索引（防内存增长，D11）；frame 每帧按状态推进矩阵并
 * 分桶（LOD）。模型（GLB）加载成功后自动切换到模型实例渲染；未就绪/加载失败保持图元蜂。
 */
export class BeeLayer {
  constructor(scene, opts = {}) {
    const geos = buildGeometries();
    this.geos = geos;
    this.bodyMat = new THREE.MeshLambertMaterial({ vertexColors: true });
    this.abdomenMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.wingMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uFlap: { value: 42 },
        uColor: { value: WING_COLOR.clone() }
      },
      vertexShader: WING_VERTEX,
      fragmentShader: WING_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    this.maxBees = 64;
    this.color = new THREE.Color();
    this.tint = new THREE.Color();
    this.white = new THREE.Color(0xffffff);
    this.matrix = new THREE.Matrix4();
    this.partMatrix = new THREE.Matrix4();
    this.quat = new THREE.Quaternion();
    this.euler = new THREE.Euler();
    this.pos = new THREE.Vector3();
    this.scaleV = new THREE.Vector3();
    this.wingOffset = new THREE.Vector3();
    this.zeroScale = new THREE.Matrix4().makeScale(0, 0, 0); // T2 空槽填充（防恒等矩阵现形）
    this.group = new THREE.Group();
    scene.add(this.group);
    this.buckets = createBuckets(); // 图元路径桶集
    /* 静态全场包围球（D1）：构造期先给「单巢岛」兜底球——`setWorld → setFieldExtent`
       在首帧前按真实巢分布覆写；图元拾取网格的 `boundingSphere` 因此**永不为 null**
       （实例矩阵缓冲初值为零尺度矩阵，惰性 `computeBoundingSphere()` 会算出 NaN 球 →
       射线被永久 early-out，正是根因 A）。 */
    this._fieldSphere = fieldSphereOf([]);
    this.beeMap = new Map(); // sessionId → bee record
    /* 拾取代理（D2/D2b）：每蜂一个球体实例（半径 = BEE_PICK_RADIUS），逐帧随姿态同步、
       覆盖全档；不进渲染列表（visible=false，`Raycaster` 不检 `visible`——已核实并以
       冒烟锁定），不参与视锥剔除；矩阵每帧全量重写（T2 冻结蜂一并重写，换取远档同样
       具备宽容热区，design 已知取舍②）。 */
    this.pickGeom = new THREE.SphereGeometry(BEE_PICK_RADIUS, 8, 6);
    this.pickMesh = new THREE.InstancedMesh(this.pickGeom, this.bodyMat, this.maxBees);
    this.pickMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.pickMesh.frustumCulled = false;
    this.pickMesh.visible = false; // 不参与渲染（raycast 仍可用）
    this.pickMesh.count = 0;
    this.pickBuckets = createBuckets(); // 记录表容器（tierParts 恒空 = 无部件网格写入）
    this.pickMesh.userData.pick = { buckets: this.pickBuckets, tier: TIER_NEAR };
    this.group.add(this.pickMesh);
    /* 群体级早退球（D1 硬性配对项）：当帧候选群体的包围球，由帧路径 O(N) 维护
       （~60 个浮点运算/蜂，与既有逐帧矩阵写入同量级）；半径初值 -1 = 空集哨兵。 */
    this._pickSphere = new THREE.Sphere(new THREE.Vector3(), -1);
    this._pickScratch = new THREE.Sphere();
    this._applyFieldSphere(this.pickMesh);
    this._buildPrimitiveMeshes(this.maxBees);
    this.reduced = opts.reduced ?? false;
    this.time = 0;
    /* LOD 分桶状态（design.md D1/D5）：出泡例外集由 scene 每帧下发（悬停/选中/展开）。 */
    this.anchorIds = new Set();

    /* ── GLB 外观模型变体（异步懒加载；默认 worker，蜂种 beeModel 引用其它外观） ── */
    this.defaultModelId = DEFAULT_APPEARANCE_MODEL;
    this.variants = new Map(); // modelId → { ready, loading, masks, buckets }
    this.modelReady = false; // 默认外观就绪 = 模型渲染路径开启（图元蜂退场）
    this.selectedId = null;
    /* 选中蜂「整体外轮廓」遮罩：maskScene/maskMaterial 由 scene 统一持有并注入
       （scene 级统一选中装配，design.md D2）——蜂遮罩网格挂入共享 maskScene，
       逐帧写入仍在本层。 */
    this.maskScene = opts.maskScene ?? new THREE.Scene();
    this.maskMaterial = opts.maskMaterial ?? new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    this.maskBody = new THREE.InstancedMesh(geos.body, this.maskMaterial, 1);
    this.maskAbd = new THREE.InstancedMesh(geos.abdomen, this.maskMaterial, 1);
    for (const m of [this.maskBody, this.maskAbd]) {
      m.count = 0;
      m.frustumCulled = false;
      this.maskScene.add(m);
    }
    this._maskCapacity = 1; // 蜂遮罩实例容量（多选描边按需扩容，3.1）
    this._primitiveMaskCount = 0; // 本帧已写遮罩实例数（图元路径）
    this.outlineState = { active: false, maskScene: this.maskScene };
    this._outlinedThisFrame = false;
    /* 蜂遮罩语义：selection 为空 → 跟随 current（selectedId）；非蜂选中 → null 让位；
       多选集（3.2）非空 → 集合渲染。scene 通过 setOutlineBeeIds 每帧下发
       （setOutlineBeeId 单值接口保留为兼容封装）。 */
    this.outlineBeeId = null;
    this.outlineBeeIds = null;
    this.loadModel(this.defaultModelId);
  }

  /** 静态全场包围球写入单个拾取网格（D1）：**显式赋值**覆盖全场，SHALL NOT 依赖
      `InstancedMesh` 惰性快照（`computeBoundingSphere()` 的惰性路径对零尺度初始矩阵
      会算出 NaN/退化球，即根因 A）。仅图元通路与代理网格赋值——GLB 部件网格保留其
      由几何居中 + 实例矩阵求得的紧球（模型路径的紧球是有效 early-out，替换成全场球
      反而更慢，design D1）。 */
  _applyFieldSphere(mesh) {
    mesh.boundingSphere = new THREE.Sphere().copy(this._fieldSphere);
  }

  /** 巢分布下发（D1）：`layout 重建`/世界镜像变化时由 scene 下发 studioLayers，
      重算一次静态全场球并覆写**全部图元通路拾取网格 + 代理网格**。纯 raycast
      early-out 用途；`frustumCulled=false` 语义不变。
      同一分布重复下发（搬巢无关的镜像 tick）经值比对短路：不新建球对象、不重写网格。 */
  setFieldExtent(studioLayers) {
    const next = fieldSphereOf(studioLayers);
    const changed =
      Math.abs(next.radius - this._fieldSphere.radius) > 1e-6 ||
      next.center.distanceToSquared(this._fieldSphere.center) > 1e-12;
    if (!changed) return;
    this._fieldSphere = next;
    for (const tierParts of this.buckets.tierParts) {
      for (const part of tierParts) this._applyFieldSphere(part.mesh);
    }
    this._applyFieldSphere(this.pickMesh);
  }

  /** 图元三档网格装配（新建/扩容共用）：body/abdomen 各三档（共享几何/材质）+
     翅膀仅近档；castShadow 仅 T0 桶承载（阴影随桶收缩，design.md D6）。 */
  _buildPrimitiveMeshes(capacity) {
    const buckets = this.buckets;
    for (const tier of [TIER_NEAR, TIER_MID, TIER_FAR]) {
      const body = new THREE.InstancedMesh(this.geos.body, this.bodyMat, capacity);
      const abd = new THREE.InstancedMesh(this.geos.abdomen, this.abdomenMat, capacity);
      for (const [mesh, tinted] of [[body, false], [abd, true]]) {
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        mesh.frustumCulled = false; // 实例分布全场，mesh 级剔除永不命中（explore §2）
        mesh.renderOrder = 10;
        mesh.castShadow = tier === TIER_NEAR;
        mesh.count = 0;
        this._applyFieldSphere(mesh); // D1：静态全场球（SHALL NOT 走惰性路径）
        if (tinted) for (let i = 0; i < capacity; i++) mesh.setColorAt(i, this.white); // 预分配 instanceColor
        mesh.userData.pick = { buckets, tier }; // 拾取解析：(mesh, instanceId) → 桶记录表
        this.group.add(mesh);
        buckets.tierParts[tier].push({ mesh, tinted });
      }
    }
    this.wings = new THREE.InstancedMesh(this.geos.wing, this.wingMat, capacity * 2);
    this.wings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.wings.frustumCulled = false;
    this.wings.renderOrder = 10;
    this.wings.castShadow = true; // 翅膀仅 T0 桶存在
    this.wings.count = 0;
    this.wings.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 2), 1));
    this.group.add(this.wings);
  }

  /** 确保外观变体已加载（懒加载；未知 id / 默认外观 / 已就绪或加载中 → no-op）。 */
  ensureVariant(modelId) {
    if (!modelId || modelId === this.defaultModelId) return;
    if (!BEE_APPEARANCE_MODELS.includes(modelId)) return;
    const variant = this.variants.get(modelId);
    if (variant?.ready || variant?.loading) return;
    this.loadModel(modelId);
  }

  /** 确保全部外观变体已加载（bee-model-choose-by-color 2.1）：编辑浮窗打开时按需
      触发一次全量预载，使色版快照不必等「第一只该外观的蜂出现」。
      幂等可重入——逐 id 复用 ensureVariant（默认 worker 构造已载、加载中/已就绪
      均 no-op），重复打开不重复发请求；失败路径沿用 loadModel 的 variants.delete()
      （下次打开重试，每次打开各变体至多一次，SHALL NOT 无限重试）。 */
  ensureAllVariants() {
    for (const modelId of BEE_APPEARANCE_MODELS) this.ensureVariant(modelId);
  }

  /** 加载外观模型 GLB：收集 Mesh 部件 → 归一化（居中/包围球半径 = 比例尺 BEE_RADIUS/
       朝向 +X）→ 实例化。仅浏览器环境加载（Node 单测/压测无 fetch，保持图元路径——
       图元蜂自成比例，不随比例尺缩放）。加载失败移除占位变体（可重试）。 */
  loadModel(modelId) {
    if (typeof document === "undefined") return;
    if (this.variants.get(modelId)?.ready || this.variants.get(modelId)?.loading) return;
    this.variants.set(modelId, { ready: false, loading: true, masks: [], buckets: null });
    const loader = new GLTFLoader();
    loader.load(
      /* 宿主资产路由是 `/api/dsh-hive/assets/<白名单子目录>/<file>`（子目录 `models/` +
         文件名各为单段白名单，见 src/index.mjs「资产服务」段：`parts.length !== 2` 即
         400）。此前此处漏写 `models/` 段 → **四个外观模型全部 400**、`variants.delete()`
         静默回落图元蜂（实盘表现＝场景蜂恒为白色图元体，与所选外观无关；HEAD 即存在的
         既有缺陷，预载改动只是把它从「偶发一次」放大为「一次三个」）。 */
      "/api/dsh-hive/assets/models/" + modelId + ".glb",
      (gltf) => {
        try {
          this.attachModel(gltf.scene, modelId);
        } catch (error) {
          console.warn("[dsh-v-hive] bee model attach failed, keep primitives:", error);
          this.variants.delete(modelId);
        }
      },
      undefined,
      (error) => {
        console.warn("[dsh-v-hive] bee model load failed, keep primitives:", String(error).slice(0, 200));
        this.variants.delete(modelId);
      }
    );
  }

  /** 装配外观模型变体：计算整体包围盒 → 包围球半径归一到 BEE_RADIUS（场景比例尺锚点，
       非体长语义）→ 逐部件 × 三档实例化 + 外轮廓遮罩网格；矩阵序 R(yaw)·S·T(-center) 不变。 */
  attachModel(root, modelId = this.defaultModelId) {
    const parts = [];
    const box = new THREE.Box3();
    let hasBox = false;
    root.updateMatrixWorld(true);
    root.traverse((node) => {
      if (!node.isMesh || !node.geometry) return;
      const geo = node.geometry.clone();
      geo.applyMatrix4(node.matrixWorld);
      geo.computeBoundingBox();
      if (hasBox) box.union(geo.boundingBox);
      else {
        box.copy(geo.boundingBox);
        hasBox = true;
      }
      parts.push({ geometry: geo, material: node.material });
    });
    if (parts.length === 0 || !hasBox) throw new Error("model has no meshes");
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    /* 包围球半径归一（场景比例尺语义，design.md D2）：以盒对角线半长为保守包围球，
       缩放到半径 = BEE_RADIUS——对任意未来替换的蜂模型保持同一比例尺含义，
       不与具体模型形状/最长边耦合。 */
    const boundingRadius = size.length() / 2 || 1;
    const scale = BEE_RADIUS / boundingRadius;
    /* N = R(yaw) · S · T(-center)：先居中，再缩放，再转朝向（蜂头 +X） */
    const normalization = new THREE.Matrix4()
      .makeRotationY(MODEL_YAW)
      .multiply(new THREE.Matrix4().makeScale(scale, scale, scale))
      .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));
    const variant = { ready: true, loading: false, masks: [], maskCapacity: 1, buckets: createBuckets() };
    /* GLB 路径 per-tier：每 part × 三档 InstancedMesh（共享 part 几何/材质；
       castShadow 仅 T0 桶——阴影随桶收缩，design.md D6）。 */
    for (const part of parts) {
      for (const tier of [TIER_NEAR, TIER_MID, TIER_FAR]) {
        const mesh = new THREE.InstancedMesh(part.geometry, part.material, this.maxBees);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        mesh.frustumCulled = false;
        mesh.renderOrder = 10;
        mesh.castShadow = tier === TIER_NEAR;
        mesh.count = 0;
        for (let i = 0; i < this.maxBees; i++) mesh.setColorAt(i, this.white); // 预分配 instanceColor
        mesh.userData.pick = { buckets: variant.buckets, tier }; // 拾取解析：三档全部可拾取（D9）
        this.group.add(mesh);
        variant.buckets.tierParts[tier].push({ mesh, normalization, tinted: true });
      }
    }
    /* GLB 部件遮罩（外轮廓描边用；遮罩矩阵 = 蜂矩阵 × 归一化，与可见层一致） */
    for (const part of parts) {
      const mask = new THREE.InstancedMesh(part.geometry, this.maskMaterial, 1);
      mask.count = 0;
      mask.frustumCulled = false;
      this.maskScene.add(mask);
      variant.masks.push(mask);
    }
    this.variants.set(modelId, variant);
    /* 图元蜂退场（默认外观就绪即切模型路径） */
    if (modelId === this.defaultModelId) {
      this.modelReady = true;
      for (const tierParts of this.buckets.tierParts) {
        for (const part of tierParts) part.mesh.count = 0;
      }
      this.wings.count = 0;
      this.maskBody.count = 0;
      this.maskAbd.count = 0;
    }
  }

  /** 选中高亮（外描边）跟随的会话；null 取消。 */
  setSelected(sessionId) {
    this.selectedId = sessionId ?? null;
  }

  /** scene 每帧下发的实际描边蜂 id（selection 空 → current；非蜂选中 → null 让位）。
      单值接口保留为兼容封装（既有断言/调用点零改动）——内部转集合。 */
  setOutlineBeeId(id) {
    this.outlineBeeId = id ?? null;
    this.setOutlineBeeIds(id != null ? new Set([id]) : null);
  }

  /** scene 每帧下发的描边蜂集合（hive-marquee-and-card-rework 3.1：多选描边集合
      渲染；null/空集 = 无描边）。遮罩实例容量按命中蜂数逐帧按需扩容
      （_ensurePrimitiveMaskCapacity / _ensureVariantMaskCapacity）。 */
  setOutlineBeeIds(ids) {
    this.outlineBeeIds = ids && typeof ids.has === "function" && ids.size > 0 ? ids : null;
  }

  /** 描边目标判定（单值 + 集合双通道；集合为权威，单值字段兼容保留）。 */
  _isOutlined(record) {
    if (this.outlineBeeIds != null) return this.outlineBeeIds.has(record.id);
    return record.id === this.outlineBeeId;
  }

  /** 蜂遮罩实例容量确保 ≥ n（图元路径 maskBody/maskAbd；3.1 集合渲染按镜像蜂数
      扩容——重建替换，矩阵每帧全量重写无需搬迁）。 */
  _ensurePrimitiveMaskCapacity(n) {
    if (n <= this._maskCapacity) return;
    const cap = Math.max(n, 8); // 小步扩容：描边集通常个位数
    this.maskBody = this._rebuildMaskMesh(this.maskBody, this.geos.body, cap);
    this.maskAbd = this._rebuildMaskMesh(this.maskAbd, this.geos.abdomen, cap);
    this._maskCapacity = cap;
  }

  /** 变体部件遮罩容量确保 ≥ n（GLB 路径 per-part masks；3.1）。 */
  _ensureVariantMaskCapacity(variant, n) {
    if (n <= (variant.maskCapacity ?? 1)) return;
    const cap = Math.max(n, 8);
    variant.masks = variant.masks.map((old) => this._rebuildMaskMesh(old, old.geometry, cap));
    variant.maskCapacity = cap;
  }

  /** 遮罩网格扩容重建：同几何/材质新实例替换旧实例（maskScene 挂载点不变）。 */
  _rebuildMaskMesh(old, geometry, cap) {
    const mesh = new THREE.InstancedMesh(geometry, this.maskMaterial, cap);
    mesh.count = 0;
    mesh.frustumCulled = false;
    this.maskScene.remove(old);
    old.dispose();
    this.maskScene.add(mesh);
    return mesh;
  }

  /**
   * bees: [{id, x, z, y, state, scale, droneOf, droneIndex, droneCount, collapsed, phase}]
   * honeyTargets: Map<sessionId, {x,y,z}>（归档化蜜的飞行落点）
   * 实例渲染列表（renderList）在此确定性重建（D11：重建而非追加）；分桶发生在其后的
   * 帧路径（design.md D1），本方法只做档位持久化（tier 随记录延续）与 T2 槽位回收。
   */
  setBees(bees, honeyTargets = new Map()) {
    if (!this.modelReady && bees.length > this.maxBees) this.grow(bees.length);
    const nextIds = new Set(bees.map((b) => b.id));
    const renderList = [];
    for (const bee of bees) {
      const prev = this.beeMap.get(bee.id);
      let anim = "none";
      let animStart = this.time;
      if (prev) {
        if (prev.anim === "out" || prev.anim === "toHoney") anim = "in";
        else {
          anim = "none";
          animStart = prev.animStart;
        }
      }
      const record = {
        ...bee,
        anim,
        animStart,
        animTo: null,
        baseY: bee.y,
        world: { x: bee.x, y: bee.y, z: bee.z },
        tier: prev?.tier // 档位随记录持久（design.md D1；记录对象每次镜像重建）
      };
      this.beeMap.set(bee.id, record);
    renderList.push(record);
    }
    const leavingRecords = new Set(); // 离场中记录（入渲染列表、不入拾取代理）
    for (const [id, record] of this.beeMap) {
      if (nextIds.has(id)) continue;
      const target = honeyTargets.get(id);
      const nextAnim = target ? "toHoney" : "out";
      /* 簿记修复（drone-active-visibility D8/审阅 F1）：仅在动画转换沿重置
         anim/animStart/animTo——此前每 tick 无条件重置导致退场动画在镜像 tick
         高频下反复重播起步帧（波及会话移除离场/归档化蜜飞行）。 */
      if (record.anim !== nextAnim) {
        record.anim = nextAnim;
        record.animStart = this.time;
        record.animTo = target ?? null;
      }
      /* 终态已播完的记录 SHALL NOT 重入渲染/拾取列表（视觉隐藏、脱离拾取），
         但保留于 beeMap——重现（done→busy 恢复运行、显隐开关切回全量）经既有
         差分走 "in" 出场动画（D4 依赖）。时长与 poseOf 动画共用同一常量出处。 */
      const exitDur = record.anim === "toHoney" ? EXIT_TO_HONEY_MS : EXIT_OUT_MS;
      if (this.time - record.animStart < exitDur) {
        renderList.push(record);
        leavingRecords.add(record); // 离场中（含本帧才转入者）：入渲染列表但不入拾取代理
      }
    }
    this.renderList = renderList;
    /* 离场中记录集（bee-pick-and-marquee-focus D2b）：`renderList` 在离场动画窗口内还含
       「已离场仍在播动画」的记录（可见桶据此时长继续画收拢动画），而拾取代理只应覆盖
       **点得到**的蜂 ⇒ 代理同步以「活蜂记录集」为门槛（记录对象每次镜像重建，故按引用
       判定）。代理实例数由此恒 ≤ maxBees，不受离场记录把 renderList 顶过容量的影响
       （`InstancedMesh.setMatrixAt` 无边界检查，越界即写坏实例缓冲）。 */
    this._liveRecords = new Set(renderList);
    for (const record of leavingRecords) this._liveRecords.delete(record);
    /* 外观变体解析（bee-model-variants）：蜂记录的 beeModel（scene 自蜂种 overlay
       透传）→ 合法模型 id；未知/缺省回落 worker，并确保对应变体懒加载。 */
    for (const record of renderList) {
      record.modelId = BEE_APPEARANCE_MODELS.includes(record.beeModel) ? record.beeModel : this.defaultModelId;
      this.ensureVariant(record.modelId);
    }
    /* 离场播完的记录脱离渲染列表（D8 簿记）——其 T2 冻结槽位同步回收（design.md D5） */
    this._releaseDepartedT2(renderList);
  }

  /** 离场播完记录的 T2 槽位回收：图元桶集与全部就绪变体桶集统一处理。 */
  _releaseDepartedT2(renderList) {
    const live = new Set(renderList.map((r) => r.id));
    if (this.buckets.slots.size > 0) {
      for (const id of [...this.buckets.slots.keys()]) {
        if (!live.has(id)) this._freeT2Slot(this.buckets, id);
      }
    }
    for (const variant of this.variants.values()) {
      if (!variant.ready || variant.buckets.slots.size === 0) continue;
      for (const id of [...variant.buckets.slots.keys()]) {
        if (!live.has(id)) this._freeT2Slot(variant.buckets, id);
      }
    }
  }

  /** T2 槽位分配（进桶沿）：写冻结矩阵与状态色，槽位表登记，置脏标记。
      代理桶集 `tierParts[TIER_FAR]` 恒空（matrix 由调用方写代理网格，color 传 null
      ——无 instanceColor 分账），本方法对之自然退化为「槽位表 + 记录表」登记。 */
  _allocT2Slot(buckets, record, matrix, color) {
    let slot;
    if (buckets.free.length > 0) slot = buckets.free.pop();
    else slot = buckets.next++; // 不变量：slots.size + free.length = next ≤ maxBees
    buckets.slots.set(record.id, slot);
    buckets.states.set(record.id, record.state);
    buckets.records[TIER_FAR][slot] = record;
    for (const part of buckets.tierParts[TIER_FAR]) {
      part.mesh.setMatrixAt(slot, matrix);
      if (part.tinted && color) part.mesh.setColorAt(slot, color);
    }
    buckets.matrixDirty = true;
    buckets.colorDirty = true;
    return slot;
  }

  /** T2 槽位释放（离桶沿）：空槽写零尺度矩阵（防空洞实例以恒等矩阵现形）并入回收表。 */
  _freeT2Slot(buckets, id) {
    const slot = buckets.slots.get(id);
    if (slot === undefined) return;
    buckets.slots.delete(id);
    buckets.states.delete(id);
    buckets.records[TIER_FAR][slot] = null;
    buckets.free.push(slot);
    for (const part of buckets.tierParts[TIER_FAR]) {
      part.mesh.setMatrixAt(slot, this.zeroScale);
      part.mesh.instanceMatrix.needsUpdate = true;
    }
  }

  /** 代理网格重建（容量不变量，D2b）：旧实例移除/释放，新实例容量 = maxBees，
      静态全场球重赋，T2 槽位表在实例槽位上位置不变故记录表无需搬迁（矩阵每帧全量
      重写）。抛错或漏调即越界——`setMatrixAt` 无边界检查（three.core.js :25034），
      模型路径下 `setBees` 不会 `grow()`，百蜂/千蜂规模必须靠本方法扩容。 */
  _rebuildPickMesh() {
    this.group.remove(this.pickMesh);
    this.pickMesh.dispose();
    this.pickMesh = new THREE.InstancedMesh(this.pickGeom, this.bodyMat, this.maxBees);
    this.pickMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.pickMesh.frustumCulled = false;
    this.pickMesh.visible = false;
    this.pickMesh.count = 0;
    this.pickMesh.userData.pick = { buckets: this.pickBuckets, tier: TIER_NEAR };
    this._applyFieldSphere(this.pickMesh);
    this.group.add(this.pickMesh);
  }

  grow(needed) {
    const next = Math.max(needed, this.maxBees * 2);
    /* T2 冻结缓冲快照：扩容搬迁（槽位布局不变），避免重算 pose 造成冻结姿态跳变
       （design.md 边界情况「maxBees 扩容」）。 */
    const oldFar = this.buckets.tierParts[TIER_FAR];
    const snapshot = oldFar.map((part) => ({
      matrix: part.mesh.instanceMatrix.array.slice(0, this.buckets.next * 16),
      color: part.mesh.instanceColor ? part.mesh.instanceColor.array.slice(0, this.buckets.next * 3) : null
    }));
    for (const tierParts of this.buckets.tierParts) {
      for (const part of tierParts) {
        this.group.remove(part.mesh);
        part.mesh.dispose();
      }
      tierParts.length = 0;
    }
    this.group.remove(this.wings);
    this.wings.dispose();
    this.maxBees = next;
    this._buildPrimitiveMeshes(next);
    this._rebuildPickMesh(); // D2b：代理随 grow() 同步扩容（容量恒 = maxBees）
    /* 回放 T2 冻结槽位（矩阵/状态色原样搬入新缓冲，迁移沿置位上传） */
    const newFar = this.buckets.tierParts[TIER_FAR];
    newFar.forEach((part, i) => {
      const snap = snapshot[i];
      part.mesh.instanceMatrix.array.set(snap.matrix);
      if (snap.color && part.mesh.instanceColor) part.mesh.instanceColor.array.set(snap.color);
    });
    this.buckets.matrixDirty = true;
    this.buckets.colorDirty = true;
  }

  /**
   * 共用姿态计算：状态/入场/离场/化蜜动画 → {x, y, z, facing, glowPulse, scale}。
   * t 为层内毫秒时钟；dt 推进在 frame。
   */
  poseOf(record, t, flap) {
    const isDrone = Boolean(record.droneOf);
    const scaleBase = record.scale ?? (isDrone ? 0.55 : 1);
    let x = record.world.x;
    let y = record.baseY;
    let z = record.world.z;
    let facing = record.heading ?? 0;
    let glowPulse = 0;
    let scale = scaleBase;
    const phase = record.phase ?? 0;
    if (record.anim === "in") {
      const k = Math.min(1, (t - record.animStart) / 420);
      const ease = 1 - Math.pow(1 - k, 3);
      y = record.baseY + (1 - ease) * 2.75 * BEE_RADIUS; // 入场位移 2.75×比例尺 ≈ 2.2 世界单位
      scale = scaleBase * (0.2 + 0.8 * ease);
      if (k >= 1) record.anim = "none";
    } else if (record.anim === "out" || record.anim === "toHoney") {
      const dur = record.anim === "toHoney" ? EXIT_TO_HONEY_MS : EXIT_OUT_MS; // 与 setBees 簿记共用常量（D8）
      const k = Math.min(1, (t - record.animStart) / dur);
      const ease = k * k;
      if (record.anim === "toHoney" && record.animTo) {
        x = record.world.x + (record.animTo.x - record.world.x) * ease;
        y = record.baseY + (record.animTo.y - record.baseY) * ease;
        z = record.world.z + (record.animTo.z - record.world.z) * ease;
      } else {
        y = record.baseY + ease * 3.00 * BEE_RADIUS; // 离场位移 3.00×比例尺 ≈ 2.4 世界单位
      }
      scale = scaleBase * (1 - ease);
    } else if (isDrone) {
      const parent = record.droneOf;
      const count = Math.max(1, record.droneCount ?? 1);
      const idx = record.droneIndex ?? 0;
      /* 无人机半径/高度 = 比例尺倍率（design.md D3）：绕飞环 ≥ 蜂球（1.0×BEE_RADIUS）
         + 无人机球（0.55 相对倍率），折叠收拢贴附父蜂体外缘不完全没入。 */
      const radius = record.collapsed ? 0.50 * BEE_RADIUS : (1.75 + 0.11 * (idx % 3)) * BEE_RADIUS;
      const angle = this.reduced ? (idx / count) * Math.PI * 2 : t * 0.0012 + (idx / count) * Math.PI * 2;
      x = parent.x + Math.cos(angle) * radius;
      z = parent.z + Math.sin(angle) * radius;
      /* 垂直 bob 接入动效降级（bubble-anchor-and-bee-fixes D5）：reduced 档无人机
         静止贴附绕飞位（绕飞角门控已有）——spec「动效降级」全场景收口的最后一处。 */
      y = parent.y + (record.collapsed ? 0.125 : 0.35 + (this.reduced ? 0 : 0.10 * Math.sin(t * 0.002 + idx))) * BEE_RADIUS;
      facing = angle + Math.PI / 2;
    } else {
      const state = record.state;
      if (state === "help") {
        /* 求助：抬升 0.60×比例尺 + 微起伏（0.075×BEE_RADIUS ≈ 0.06 世界单位） */
        y = record.baseY + 0.60 * BEE_RADIUS + (this.reduced ? 0 : 0.075 * BEE_RADIUS * Math.sin(t * 0.004 + phase));
        glowPulse = this.reduced ? 0.5 : 0.35 + 0.3 * Math.sin(t * 0.006 + phase);
      } else if (state === "busy" && !this.reduced) {
        /* 忙碌 = 贴格低巡（design.md D4）：蜂球半径 0.8 压不住任何绕格巡游（必压瓦片边界
           且与邻格蜂球穿插），改蜂位内小幅徘徊 + 高度起伏 + 振翅；徘徊幅度 ≤ 内切圆 − 蜂半径。 */
        const angle = t * 0.0009 + phase;
        x += Math.cos(angle) * BUSY_WANDER;
        z += Math.sin(angle) * BUSY_WANDER;
        y = record.baseY + (0.20 + 0.06 * Math.sin(t * 0.003 + phase)) * BEE_RADIUS;
        facing = angle + Math.PI / 2;
      } else if (state === "done") {
        y = record.baseY - 0.075 * BEE_RADIUS; // 带蜜归落格下沉 0.075×比例尺 ≈ 0.06 世界单位
        glowPulse = 0.18;
      } else if (!this.reduced) {
        /* 待命：摇幅 0.06×比例尺 ≈ 0.048 世界单位 */
        const sway = 0.06 * BEE_RADIUS;
        x += Math.sin(t * 0.0011 + phase) * sway;
        z += Math.cos(t * 0.0009 + phase * 1.3) * sway;
        y = record.baseY + sway * Math.sin(t * 0.0016 + phase);
      }
    }
    return { x, y, z, facing, glowPulse, scale };
  }

  /** 每帧姿态缓存：帧循环算出的 `record.pose` 打上帧戳，代理同步据此复用（同帧零重复
      计算——否则每帧要多付一遍 `poseOf`，千蜂量级约 +0.13ms/帧；帧预算见 perf-smoke）。 */
  _poseCached(record) {
    const t = this.time;
    if (record.poseStamp === t && record.pose) return record.pose;
    const pose = this.poseOf(record, t, this.reduced ? 0 : 1);
    record.pose = pose;
    record.poseStamp = t;
    return pose;
  }

  /** 蜂矩阵合成（共用：T0/T1 逐帧写与 T2 冻结写同源，防两处漂移）。 */
  _composeBee(pose) {
    this.euler.set(0, -pose.facing, 0);
    this.quat.setFromEuler(this.euler);
    this.pos.set(pose.x, pose.y, pose.z);
    this.scaleV.setScalar(Math.max(0.001, pose.scale));
    return this.matrix.compose(this.pos, this.quat, this.scaleV);
  }

  /** 强制近档判定（design.md D4）：生命周期动画 / 描边蜂（单值或集合，3.1）/ 出泡例外集（悬停/选中/展开）。 */
  _isForcedNear(record) {
    return record.anim !== "none" || this._isOutlined(record) || this.anchorIds.has(record.id);
  }

  /**
   * 拾取代理逐帧同步（D2b；**写入点 = 定档之后、姿态已算之处**，两个帧路径各调一次，
   * SHALL NOT 只挂近档写入循环——否则远档蜂在代理里缺席）：
   *  - 单遍 renderList：`poseOf` 一次定档（与可见桶同一判据），matrix = `_composeBee`
   *    同源蜂矩阵（SHALL NOT 另算一套姿态）；
   *  - **实例号两段不重叠布局**：紧凑段（近/中档当帧序）占 `0 .. near+mid-1`，远档
   *    冻结段占 `near+mid .. near+mid+slots-1`（= 紧凑段长度 + 槽位号）。两段**同帧**
   *    叠加，若共用同一号段则「槽位号 0」与「紧凑号 0」互相遮蔽 ⇒ `beeAt` 会把远档
   *    实例解析成另一只蜂（抬取命中却选错蜂）。故远档写号 = 当帧紧凑段长度 + 槽位号
   *    （`farOffset`），`beeAt` 的回落亦按同一口径；
   *  - 记录表每帧先清空再按同一遍累积（与 `buckets.records[TIER_NEAR/MID]` 同构；
   *    远档写一次固定槽位、与 `_allocT2Slot` 同一槽位表语义），覆盖三档（含远档冻结
   *    姿态者）与无人机分类（`origin = "subagent"` 的 drone / 降级停驻蜂照常入表——
   *    `interact.pick` 的 `origin` 分类口径不变，无人机照旧不可选中）；
   *  - 离场蜂按 `pose.scale <= 0.01` 与模型路径同门槛跳过（「不可见即不可拾取」两条
   *    路径一致）；
   *  - 同时 O(N) 维护群体级早退球（D1）：候选球 ∪ 当帧写入代理的每只蜂
   *    （圆心 + BEE_PICK_RADIUS），供 `pick()` 入场前一次射线-球拒绝测试。
   */
  syncPickProxies(t, liveRecords) {
    const proxy = this.pickBuckets;
    const mesh = this.pickMesh;
    /* 记录表每帧先清空再按同一遍累积；远档槽位表跨帧保留（冻结槽位复用） */
    proxy.records[TIER_NEAR].length = 0;
    proxy.records[TIER_MID].length = 0;
    const nearRecs = proxy.records[TIER_NEAR];
    const midRecs = proxy.records[TIER_MID];
    /* 紧凑段布局：NEAR 占 `0..nearN-1`、MID 紧随占 `nearN..nearN+midN-1`（两段不重叠，
       远档块再紧随其后——实例号全域无歧义）。 */
    let nearN = 0;
    let midN = 0;
    /* 远档冻结（D3）的代理侧对应：可见桶在远档不逐帧重写矩阵，代理若无条件重写就把该
       收益吃掉。判定用两条**严格信号**（不看矩阵数值——空闲槽与新占槽可能数值相同却是
       不同蜂，逐值比较无法证伪「未变」）：
         · 槽位未迁移：上帧记录的槽号 == 本帧 `slots.get(id)`；
         · 紧凑段长度未变：长度一变，远档实例号（紧凑段长度 + 槽位号）全体平移。
       两者同时成立 ⇒ 该实例槽承载同一只蜂、冻结姿态早已写入 ⇒ 跳过写入。
       首帧、槽位迁移、长度变化一律退回写入（正确性优先，性能次之）。 */
    const prevCompact = proxy.compactLen ?? -1;
    const prevSlots = proxy.slotSnapshot ?? null; // 上帧 id → 槽号
    /* 群体级早退球：从空集起累积（半径 < 0 = 空集哨兵） */
    const group = this._pickSphere;
    group.center.set(0, 0, 0);
    group.radius = -1;
    for (const record of this.renderList ?? []) {
      /* 代理的契约是「点得到的蜂」：正在播离场动画的记录（renderList 会含它，可见桶据
         此时长继续画收拢动画）**不入代理**——它们不可拾取，同时使代理实例数恒
         ≤ `liveRecords.size ≤ maxBees`（不受离场窗口把 renderList 顶过容量的影响）。
         已播完（scale ≤ 0.01）的记录同侧跳过，并回收其远档实例槽（写零尺度，防残影）。 */
      const departed = !liveRecords?.has(record);
      if (departed) {
        const stale = proxy.slots.get(record.id);
        if (stale !== undefined) {
          const at = (prevCompact >= 0 ? prevCompact : 0) + stale;
          mesh.setMatrixAt(at, this.zeroScale);
          this._freeT2Slot(proxy, record.id);
        }
        continue;
      }
      const pose = this._poseCached(record); // 帧戳命中则复用（同帧零重复）
      record.pose = pose; // 卡片投影读取（与可见桶同一写入语义）
      if (pose.scale <= 0.01) {
        /* 已播完的退场蜂：与 frameModel 同门槛跳过（写入侧与记录表同侧跳过）；
           其远档实例槽同步写零尺度矩阵，避免残影被拾取（与可见桶 _freeT2Slot 同向）。 */
        const stale = proxy.slots.get(record.id);
        if (stale !== undefined) {
          const at = (prevCompact >= 0 ? prevCompact : 0) + stale;
          mesh.setMatrixAt(at, this.zeroScale);
          this._freeT2Slot(proxy, record.id);
        }
        continue;
      }
      unionGroupSphere(group, pose.x, pose.y, pose.z, BEE_PICK_RADIUS);
      const forced = !this._pickHasCamera || this._isForcedNear(record);
      let tier;
      if (forced) {
        tier = TIER_NEAR; // 强制帧不改写自然档位（record.tier），与可见桶同一纪律
      } else {
        const dx = record.world.x - this._pickCamX;
        const dy = record.world.y - this._pickCamY;
        const dz = record.world.z - this._pickCamZ;
        tier = assignTier(record, Math.sqrt(dx * dx + dy * dy + dz * dz));
        record.tier = tier;
      }
      if (tier !== TIER_FAR) {
        if (proxy.slots.has(record.id)) this._freeT2Slot(proxy, record.id);
        const writeIndex = tier === TIER_MID ? nearN + midN++ : nearN++;
        (tier === TIER_MID ? midRecs : nearRecs).push(record); // 实例 i ↔ 记录 i（同序同构）
        mesh.setMatrixAt(writeIndex, this._composeBee(pose));
        continue;
      }
      const slot = proxy.slots.get(record.id);
      if (slot === undefined) {
        const fresh = this._allocT2Slot(proxy, record, null, null);
        mesh.setMatrixAt(nearN + midN + fresh, this._composeBee(pose));
        continue;
      }
      proxy.records[TIER_FAR][slot] = record; // 镜像刷新（记录对象每次 setBees 重建）
      const stable = prevCompact === nearN + midN && prevSlots?.get(record.id) === slot;
      if (!stable) mesh.setMatrixAt(nearN + midN + slot, this._composeBee(pose));
    }
    /* 档位计数 / 实例数收口：紧凑段 + 远档段（槽位表占用数，非高水位——`next` 是分配
       高水位，收缩回收后仍偏大，用它当长度会在规模缩小时把 count 顶过容量）。
       **容量夹逼**：`renderList` 在离场动画窗口内可含「已离场但仍播动画」的记录（可见桶
       的既有语义），同帧（蜂数 = 容量 ∧ 一只在离场）时三段之和会到 `maxBees + 1`——
       `InstancedMesh.count` 越界会让 `getMatrixAt` 读出缓冲外的数据。夹逼保证
       `count ≤ 容量`（越界尾实例本就不该被拾取：代理的契约是「点得到的蜂」，离场即出列）。 */
    proxy.counts[TIER_NEAR] = nearN;
    proxy.counts[TIER_MID] = midN;
    proxy.farOffset = nearN + midN; // 当帧远档块偏移（beeAt 回落同一口径）
    let maxSlot = -1;
    for (const slot of proxy.slots.values()) {
      if (slot > maxSlot) maxSlot = slot;
    }
    mesh.count = Math.min(nearN + midN + maxSlot + 1, this.maxBees);
    mesh.instanceMatrix.needsUpdate = true;
    /* 冻结判定基准持久化：紧凑段长度 + 槽位表快照（供下帧比对）。两块 Map 交替复用
       （`slotSnapshot`/`slotSnapshotPrev` 互换）——每帧新建千级 Map 的构造成本与一次
       全量矩阵重写同量级，交替复用后每帧只付「清空 + 逐 id 写入」。 */
    proxy.compactLen = nearN + midN;
    const scratch = proxy.slotSnapshotScratch ?? new Map();
    scratch.clear();
    for (const [id, slot] of proxy.slots) scratch.set(id, slot);
    proxy.slotSnapshot = scratch;
    proxy.slotSnapshotScratch = proxy.slotSnapshotPrev ?? new Map();
    proxy.slotSnapshotPrev = scratch;
  }

  /** 每帧推进（图元路径）。dt 毫秒；cameraPos = 相机世界坐标（scene.loop 下发）——
   *  null/缺省时全量按近档处理（既有全量口径：Node 冒烟与未接线调用点兼容）。 */
  frame(dt, cameraPos) {
    this.time += dt;
    const t = this.time;
    const flap = this.reduced ? 0 : 1;
    this.wingMat.uniforms.uTime.value = t;
    this.wingMat.uniforms.uFlap.value = 42;
    if (this.modelReady) {
      this.frameModel(t, cameraPos);
      return;
    }
    const buckets = this.buckets;
    buckets.counts[TIER_NEAR] = 0;
    buckets.counts[TIER_MID] = 0;
    buckets.records[TIER_NEAR].length = 0;
    buckets.records[TIER_MID].length = 0;
    buckets.matrixDirty = false;
    buckets.colorDirty = false;
    this._outlinedThisFrame = false;
    this._primitiveMaskCount = 0; // 本帧遮罩实例写入数归零（3.1 集合渲染）
    const hasCamera = cameraPos != null && Number.isFinite(cameraPos.x);
    const camX = hasCamera ? cameraPos.x : 0;
    const camY = hasCamera ? cameraPos.y : 0;
    const camZ = hasCamera ? cameraPos.z : 0;
    /* 代理同步与早退球共用同一相机定档（syncPickProxies 读本组 scratch） */
    this._pickHasCamera = hasCamera;
    this._pickCamX = camX;
    this._pickCamY = camY;
    this._pickCamZ = camZ;
    let wingCount = 0;
    /* 单遍 renderList 定档 → 写桶（design.md D5） */
    for (const record of this.renderList ?? []) {
      const forced = !hasCamera || this._isForcedNear(record);
      let tier;
      if (forced) {
        tier = TIER_NEAR; // 强制帧不改写自然档位（record.tier），解除后按滞回回落
      } else {
        const dx = record.world.x - camX;
        const dy = record.world.y - camY;
        const dz = record.world.z - camZ;
        tier = assignTier(record, Math.sqrt(dx * dx + dy * dy + dz * dz));
        record.tier = tier;
      }
      if (tier !== TIER_FAR && buckets.slots.has(record.id)) this._freeT2Slot(buckets, record.id);
      if (tier === TIER_FAR) {
        const slot = buckets.slots.get(record.id);
        if (slot === undefined) {
          /* 进桶沿：姿态计算一次并冻结（矩阵此后不逐帧重写，design.md D3）；
             帧戳缓存使同帧的代理同步直接复用本次结果（零重复计算）。 */
          const pose = this._poseCached(record);
          record.pose = pose;
          this._composeBee(pose);
          this.color.copy(STATE_COLORS[record.state] ?? STATE_COLORS.idle).multiplyScalar(1 + pose.glowPulse);
          this._allocT2Slot(buckets, record, this.matrix, this.color);
        } else {
          buckets.records[TIER_FAR][slot] = record; // 拾取表随镜像刷新（记录对象每次 setBees 重建）
          if (buckets.states.get(record.id) !== record.state) {
            /* 状态变更沿：状态色更新一次（颜色实时跟随语义保留，design.md D3） */
            buckets.states.set(record.id, record.state);
            this.color.copy(STATE_COLORS[record.state] ?? STATE_COLORS.idle);
            for (const part of buckets.tierParts[TIER_FAR]) {
              if (part.tinted) part.mesh.setColorAt(slot, this.color);
            }
            buckets.colorDirty = true;
          }
        }
        continue;
      }
      const pose = this._poseCached(record);
      record.pose = pose; // 卡片投影读取（bubble-anchor-and-bee-fixes D1：锚点跟随姿态）
      this._composeBee(pose);
      const index = buckets.counts[tier]++;
      buckets.records[tier].push(record);
      for (const part of buckets.tierParts[tier]) {
        part.mesh.setMatrixAt(index, this.matrix);
        if (part.tinted) {
          this.color.copy(STATE_COLORS[record.state] ?? STATE_COLORS.idle).multiplyScalar(1 + pose.glowPulse);
          part.mesh.setColorAt(index, this.color);
        }
      }
      if (tier === TIER_NEAR) {
        /* 翅膀实例仅近档存在（42Hz 顶点拍动）；矩阵写入用 partMatrix，保留
           this.matrix = 蜂矩阵供遮罩使用（此前遮罩误用末枚翅膀矩阵，顺手修正）。 */
        const phaseAttr = this.wings.geometry.getAttribute("aPhase");
        for (let w = 0; w < 2; w++) {
          const mirrored = w === 1;
          this.euler.set(0, mirrored ? Math.PI : 0, 0);
          this.quat.setFromEuler(this.euler);
          this.wingOffset.set(0.01, 0.075, 0).applyQuaternion(this.quat);
          this.pos.set(pose.x + this.wingOffset.x, pose.y + this.wingOffset.y, pose.z + this.wingOffset.z);
          this.scaleV.setScalar(Math.max(0.001, pose.scale));
          this.partMatrix.compose(this.pos, this.quat, this.scaleV);
          this.wings.setMatrixAt(wingCount + w, this.partMatrix);
          if (phaseAttr) phaseAttr.setX(wingCount + w, (record.phase ?? 0) + (flap ? 0 : Math.PI * 0.35));
        }
        wingCount += 2;
        /* 图元路径选中：写入遮罩实例矩阵（整体外轮廓描边；3.1 集合渲染——描边集合
           内的蜂逐只写入递增实例槽，容量按需扩容）。 */
        if (this._isOutlined(record)) {
          this._ensurePrimitiveMaskCapacity(this._primitiveMaskCount + 1);
          this._outlinedThisFrame = true;
          for (const mask of [this.maskBody, this.maskAbd]) {
            mask.setMatrixAt(this._primitiveMaskCount, this.matrix);
          }
          this._primitiveMaskCount += 1;
        }
      }
    }
    /* 逐桶 count 收口与按需 needsUpdate（design.md D5）：T0/T1 每帧全量重写恒上传；
       T2 仅迁移沿/状态变更沿置位（DynamicDrawUsage 下未置位不上传）。 */
    for (const tier of [TIER_NEAR, TIER_MID]) {
      for (const part of buckets.tierParts[tier]) {
        part.mesh.count = buckets.counts[tier];
        part.mesh.instanceMatrix.needsUpdate = true;
        if (part.tinted && part.mesh.instanceColor) part.mesh.instanceColor.needsUpdate = true;
      }
    }
    for (const part of buckets.tierParts[TIER_FAR]) {
      part.mesh.count = buckets.next; // 槽位高水位；空槽为零尺度矩阵（不可见、顶点成本趋零）
      if (buckets.matrixDirty) part.mesh.instanceMatrix.needsUpdate = true;
      if (buckets.colorDirty && part.tinted && part.mesh.instanceColor) part.mesh.instanceColor.needsUpdate = true;
    }
    this.wings.count = wingCount;
    this.wings.instanceMatrix.needsUpdate = true;
    const phaseAttr = this.wings.geometry.getAttribute("aPhase");
    if (phaseAttr) phaseAttr.needsUpdate = true;
    /* 蜂遮罩收口（3.1）：count = 本帧实际写入数（集合渲染；0 = 无描边） */
    for (const mask of [this.maskBody, this.maskAbd]) {
      mask.count = this._primitiveMaskCount;
      if (this._primitiveMaskCount > 0) mask.instanceMatrix.needsUpdate = true;
    }
    this.outlineState.active = this._outlinedThisFrame;
    /* 拾取代理同步 + 群体级早退球（D1/D2b）：定档之后、姿态已算之处 */
    this.syncPickProxies(t, this._liveRecords);
  }

  /** 每帧推进（GLB 模型路径，按外观变体分桶 × LOD 三档）：beeMatrix × 部件归一化
   *  矩阵，instanceColor 状态染色。变体未就绪的蜂回落默认外观渲染。 */
  frameModel(t, cameraPos) {
    const hasCamera = cameraPos != null && Number.isFinite(cameraPos.x);
    const camX = hasCamera ? cameraPos.x : 0;
    const camY = hasCamera ? cameraPos.y : 0;
    const camZ = hasCamera ? cameraPos.z : 0;
    this._pickHasCamera = hasCamera;
    this._pickCamX = camX;
    this._pickCamY = camY;
    this._pickCamZ = camZ;
    for (const variant of this.variants.values()) {
      if (!variant.ready) continue;
      const b = variant.buckets;
      b.counts[TIER_NEAR] = 0;
      b.counts[TIER_MID] = 0;
      b.records[TIER_NEAR].length = 0;
      b.records[TIER_MID].length = 0;
      b.matrixDirty = false;
      b.colorDirty = false;
      variant.maskCount = 0; // 本帧遮罩实例写入数归零（3.1 集合渲染，按变体分账）
    }
    this._outlinedThisFrame = false;
    for (const record of this.renderList ?? []) {
      const pose = this._poseCached(record);
      record.pose = pose; // 卡片投影读取（锚点跟随姿态）
      if (pose.scale <= 0.01) continue; // 出场完成即不画
      const own = this.variants.get(record.modelId);
      const variant = own?.ready ? own : this.variants.get(this.defaultModelId);
      if (!variant?.ready) continue; // 默认模型未就绪时 frame() 不走模型路径
      const forced = !hasCamera || this._isForcedNear(record);
      let tier;
      if (forced) {
        tier = TIER_NEAR;
      } else {
        const dx = record.world.x - camX;
        const dy = record.world.y - camY;
        const dz = record.world.z - camZ;
        tier = assignTier(record, Math.sqrt(dx * dx + dy * dy + dz * dz));
        record.tier = tier;
      }
      const b = variant.buckets;
      if (tier !== TIER_FAR && b.slots.has(record.id)) this._freeT2Slot(b, record.id);
      this.euler.set(0, -pose.facing, 0);
      this.quat.setFromEuler(this.euler);
      this.pos.set(pose.x, pose.y, pose.z);
      this.scaleV.setScalar(pose.scale);
      this.matrix.compose(this.pos, this.quat, this.scaleV);
      /* 状态染色：idle 本色，其余向状态色收拢（乘染不毁纹理），求助/带蜜归带脉冲 */
      this.tint.copy(this.white).lerp(STATE_COLORS[record.state] ?? STATE_COLORS.idle, record.state === "idle" ? 0 : 0.45);
      if (pose.glowPulse > 0) this.tint.multiplyScalar(1 + pose.glowPulse);
      if (tier === TIER_FAR) {
        const slot = b.slots.get(record.id);
        if (slot === undefined) {
          this._allocT2Slot(b, record, this.matrix, this.tint);
        } else {
          b.records[TIER_FAR][slot] = record;
          if (b.states.get(record.id) !== record.state) {
            /* 状态变更沿：冻结蜂状态色更新一次（脉冲定格不复算，远处不可辨） */
            b.states.set(record.id, record.state);
            const frozen = this.tint.copy(this.white).lerp(STATE_COLORS[record.state] ?? STATE_COLORS.idle, record.state === "idle" ? 0 : 0.45);
            for (const part of b.tierParts[TIER_FAR]) {
              if (part.tinted) part.mesh.setColorAt(slot, frozen);
            }
            b.colorDirty = true;
          }
        }
        continue;
      }
      const index = b.counts[tier]++;
      b.records[tier].push(record);
      for (const part of b.tierParts[tier]) {
        this.partMatrix.copy(this.matrix).multiply(part.normalization);
        part.mesh.setMatrixAt(index, this.partMatrix);
        if (part.tinted) part.mesh.setColorAt(index, this.tint);
      }
      /* 选中蜂：写入其所在变体的遮罩实例矩阵（整体外轮廓描边；遮罩矩阵 =
         蜂矩阵 × 归一化；3.1 集合渲染——描边集合跨变体逐只写入递增实例槽，
         容量按需扩容）。 */
      if (this._isOutlined(record)) {
        this._ensureVariantMaskCapacity(variant, variant.maskCount + 1);
        this._outlinedThisFrame = true;
        for (const mask of variant.masks) {
          mask.setMatrixAt(variant.maskCount, this.partMatrix);
        }
        variant.maskCount += 1;
      }
    }
    for (const variant of this.variants.values()) {
      if (!variant.ready) continue;
      const b = variant.buckets;
      for (const tier of [TIER_NEAR, TIER_MID]) {
        for (const part of b.tierParts[tier]) {
          part.mesh.count = b.counts[tier];
          part.mesh.instanceMatrix.needsUpdate = true;
          if (part.tinted && part.mesh.instanceColor) part.mesh.instanceColor.needsUpdate = true;
        }
      }
      for (const part of b.tierParts[TIER_FAR]) {
        part.mesh.count = b.next;
        if (b.matrixDirty) part.mesh.instanceMatrix.needsUpdate = true;
        if (b.colorDirty && part.tinted && part.mesh.instanceColor) part.mesh.instanceColor.needsUpdate = true;
      }
      /* 蜂遮罩收口（3.1）：count = 本帧该变体实际写入数（跨变体集合渲染；0 = 无） */
      const maskCount = variant.maskCount ?? 0;
      for (const mask of variant.masks) {
        mask.count = maskCount;
        if (maskCount > 0) mask.instanceMatrix.needsUpdate = true;
      }
    }
    this.outlineState.active = this._outlinedThisFrame;
    /* 拾取代理同步 + 群体级早退球（D1/D2b）：与图元路径同一挂点语义（定档之后、姿态已算） */
    this.syncPickProxies(t, this._liveRecords);
  }

  /** 拾取：实例 → 蜂记录（含 id）。三档全部可拾取（拾取语义 SHALL NOT 随档位变化，
   *  design.md D9）：(桶网格, instanceId) → 桶记录表（T0/T1 当帧序号、T2 槽位）。
   *  **代理网格**（`userData.pick.tier = TIER_NEAR`）的实例号是「紧凑段（NEAR 段
   *  `0..nearN-1` → MID 段 `nearN..nearN+midN-1`）+ 远档段（`farOffset..`）」三段拼接
   *  （`syncPickProxies` 维护 `farOffset`），故除空槽/越界外恒可解析：先按 NEAR 段、
   *  再按 MID 段（号 − NEAR 计数）、最后按远档块（号 − farOffset）查表。两段不重叠 ⇒
   *  实例号全域无歧义（同帧既有近档蜂又有远档蜂时不会解析到错蜂）。可见桶网格
   *  （`tier ≠ NEAR`）不变：其网格与档位一一对应，越界实例本就应返回 null。 */
  beeAt(mesh, instanceId) {
    const pick = mesh?.userData?.pick;
    if (!pick) return null;
    const proxy = pick.tier === TIER_NEAR;
    const buckets = pick.buckets;
    const direct = buckets.records[pick.tier][instanceId] ?? null;
    if (direct) return direct;
    if (!proxy) return null;
    const nearN = buckets.counts[TIER_NEAR];
    if (instanceId >= nearN) {
      const midRec = buckets.records[TIER_MID][instanceId - nearN] ?? null;
      if (midRec) return midRec;
    }
    const slot = instanceId - (buckets.farOffset ?? 0);
    return slot >= 0 ? buckets.records[TIER_FAR][slot] ?? null : null;
  }

  /**
   * 群体级早退（D1 收敛项，供 `interact.pick` 入场前调用一次）：射线连当帧候选群体的
   * 包围球都不碰时返回 true → 调用方跳过全部蜂网格的逐实例求交。球由帧路径 O(N)
   * 维护（`syncPickProxies`），**指针事件路径内零计算**（SHALL NOT 在事件路径重算）。
   * 球为空集（无可拾取蜂）时同样返回 true——无蜂可命中，逐网格求交必然全空。
   */
  pickRejects(ray) {
    if (this._pickSphere.radius < 0) return true; // 空集哨兵
    this._pickScratch.copy(this._pickSphere).applyMatrix4(this.group.matrixWorld);
    return ray.intersectsSphere(this._pickScratch) === false;
  }

  /** 场景拾取对象（承载 instanceId 的网格）：桶/部件网格 + **拾取代理**（热区宽容，
   *  覆盖两条通路与全部三档）。顺序无关语义——`interact.pick` 跨网格取**最近命中**
   *  （桶拆分后网格顺序本就不对应距离），故代理一律**追加在尾部**，不制造「代理先测
   *  即省算」的错觉。
   *  **注**：代理球与模型部件几何同径（皆经 BEE_RADIUS 归一）⇒ 本路径下两者都要遍历
   *  全部实例、命中时都要逐实例求交——代理**不承担剪枝职责**，其价值在热区与「模型
   *  就绪前的图元通路也始终有正确的拾取几何」（design D2）。 */
  pickMeshes() {
    if (this.modelReady) {
      const meshes = [];
      for (const variant of this.variants.values()) {
        if (!variant.ready) continue;
        for (const tierParts of variant.buckets.tierParts) {
          for (const part of tierParts) meshes.push(part.mesh);
        }
      }
      if (meshes.length) {
        meshes.push(this.pickMesh);
        return meshes;
      }
    }
    const meshes = [];
    for (const tierParts of this.buckets.tierParts) {
      for (const part of tierParts) meshes.push(part.mesh);
    }
    meshes.push(this.pickMesh);
    return meshes;
  }

  /** 分桶统计（当前激活渲染路径：图元 / 模型变体桶合计）——走查与调试采样用。 */
  tierStats() {
    if (!this.modelReady) {
      return {
        path: "primitive",
        near: this.buckets.counts[TIER_NEAR],
        mid: this.buckets.counts[TIER_MID],
        far: this.buckets.slots.size,
        total: this.renderList?.length ?? 0
      };
    }
    let near = 0;
    let mid = 0;
    let far = 0;
    for (const variant of this.variants.values()) {
      if (!variant.ready) continue;
      near += variant.buckets.counts[TIER_NEAR];
      mid += variant.buckets.counts[TIER_MID];
      far += variant.buckets.slots.size;
    }
    return { path: "model", near, mid, far, total: this.renderList?.length ?? 0 };
  }

  /** 拾取资格视图（历史字段）：三桶记录表并集恒等 renderList，保留给既有断言/调试。 */
  get pickIndex() {
    return this.renderList;
  }

  dispose() {
    for (const tierParts of this.buckets.tierParts) {
      for (const part of tierParts) {
        this.group.remove(part.mesh);
        part.mesh.dispose();
      }
    }
    this.group.remove(this.wings);
    this.wings.dispose();
    /* 拾取代理网格与其球体几何（材质共享 bodyMat，归本层所有、在下方统一释放） */
    this.group.remove(this.pickMesh);
    this.pickMesh.dispose();
    this.pickGeom.dispose();
    /* 蜂遮罩网格从共享 maskScene 移除并释放几何引用（maskMaterial 归 scene 所有，不在此释放）。 */
    for (const mask of [this.maskBody, this.maskAbd]) {
      this.maskScene.remove(mask);
      mask.dispose();
    }
    for (const variant of this.variants.values()) {
      for (const mask of variant.masks) {
        this.maskScene.remove(mask);
        mask.dispose();
      }
      if (!variant.ready) continue;
      for (const tierParts of variant.buckets.tierParts) {
        for (const part of tierParts) part.mesh.dispose();
      }
    }
    this.bodyMat.dispose();
    this.abdomenMat.dispose();
    this.wingMat.dispose();
  }
}
