/**
 * 蜂巢 3D 场景编排器（命令式，React 只做外壳——design.md D12）：
 *  - 单一 WebGL 上下文：主场景（瓦片场/巢/蜂/蜜杯）；
 *  - 相机俯仰锁定为设置俯角（cameraPitchDeg，φ ∈ [20°,75°]，不可翻入地下——相机手势重排 D3/D5）；
 *    渲染循环页签隐藏或坞关闭即暂停（节能）；
 *  - 镜像数据（setWorld）与布局（setLayout）分离：bee-model 派生层产出渲染模型；
 *  - 实例索引在镜像变化时整体重建（不追加，防内存增长，D11）；
 *  - devicePixelRatio 上限 2；powerPreference high-performance；
 *  - webglcontextlost → 尝试 restore 重建；创建失败 → 抛给外壳渲染静态降级卡（R6/D11）；
 *  - reduced-motion：停持续位移动画，保留状态色与出现/消失反馈（spec 动效降级）。
 */
import * as THREE from "three";
import { CameraRig } from "./camera-rig.mjs";
import { TileField, TerritoryLayer, hexGeometry } from "./tiles.mjs";
import { WallLayer } from "./walls.mjs";
import { BeeLayer, TIER_FAR, TIER_NEAR, STATE_COLORS } from "./bees.mjs";
import { CupLayer } from "./cups.mjs";
import { WatermarkLayer } from "./watermark.mjs";
import { GestureController } from "./interact.mjs";
import { CardLayer } from "./cards.mjs";
import { OutlinePass } from "./outline-pass.mjs";
import { TipsLayer } from "./tips.mjs";
import { LinkLayer } from "./links.mjs";
import { worldOf, boundaryEdges, interiorEdges, hexKey, spiralCells, BEE_RADIUS } from "../hex.mjs";
import { WALL_HEIGHT } from "./walls.mjs";
import { PALETTE, APPEARANCE_DEFAULTS } from "./palette.mjs";
import { SkyDome } from "./sky-dome.mjs";
import { MotesLayer } from "./motes.mjs";
import { HexRiseFxLayer, diffBeeTransitions } from "./hex-fx.mjs";
import { parseTemplate, DEFAULT_APPEARANCE_MODEL, BEE_APPEARANCE_MODELS } from "../bee-types.mjs";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/* 卡片/气泡悬挂锚点（× BEE_RADIUS）：蜂体半高 0.6 + 悬挂间隙 0.05。
   锚点位于蜂体**上缘**之上少许间隙处，卡片 DOM 以 bottom-center（正下方中点）
   对齐锚点、向上生长，SHALL NOT 遮挡蜂体。
   历史：`2026-09-02-worker-scale-normalization` D6 曾因「DOM 左上角锚定、向右下
   展开」把锚点刻意放在蜂体下缘之下（CARD_ANCHOR_DROP）；bubble-anchor-and-bee-fixes
   修正 DOM 对齐后，锚点镜像翻回上缘，spec「头顶投影」原文达成。 */
const CARD_ANCHOR_LIFT = (0.6 + 0.05) * BEE_RADIUS;

/* 预览快照状态集（5.1）：与 STATE_COLORS 键集同源（idle/busy/help/done），4 外观 ×
   4 状态 ≤16 张快照；键 = `${modelId}:${state}`。 */
const BEE_PREVIEW_STATES = Object.keys(STATE_COLORS);

/* 主光偏移（world）：sun.position = 阴影目标点 + SUN_OFFSET，方向恒定（方向光）。
   阴影吸附（render-stability，loop）以此为灯光基准位。 */
const SUN_OFFSET = new THREE.Vector3(12, 26, 8);

/* ── 无人机活跃态显隐（drone-active-visibility D1/D2） ── */

/**
 * 无人机可见性谓词（单一出处，供冒烟测试真值表复用；顶层无 DOM 依赖，Node 可导入）：
 * active-only → 仅非 done（活跃 = busy ∪ help ∪ idle，idle 暂计活跃——用户决策）；
 * all → 恒真（三处装配回到现状全量，零行为差异）。
 */
export function isDroneVisible(state, mode) {
  if ((mode ?? "active-only") === "all") return true;
  return state !== "done";
}

/** 卡片可见性同谓词（审阅 F4）：被过滤的降级停驻蜂 SHALL NOT 投射气泡；工蜂恒可见。 */
export function isCardBeeVisible(bee, mode) {
  return !(bee?.droneStandIn && !isDroneVisible(bee?.state, mode));
}

/**
 * 可选中工蜂谓词（hive-marquee-and-card-rework 1.3/2.4 单一出处，供冒烟测试真值表
 * 复用——isDroneVisible 先例）：无人机（origin === "subagent"）与降级停驻蜂
 * （droneStandIn）SHALL NOT 可选中——镜头跟随、框选命中共用此口径。
 */
export function isSelectableWorkerBee(record) {
  return Boolean(record) && record.origin !== "subagent" && !record.droneStandIn;
}

/**
 * 气泡距离剔除谓词（render-perf-optimization D8；纯函数供冒烟测试真值表复用——
 * 先例 isDroneVisible 顶层导出）：远档（T2）且非例外集 → 剔除（不产出 entries、
 * 跳过投影计算）。例外集 = 悬停 / 选中 / 展开中的蜂（与蜂层强制近档同集，D4.3）；
 * 档位未知（undefined，镜像后首帧前）按可见处理（默认常驻语义）。
 */
export function isBubbleVisible(tier, anchored) {
  if (tier !== TIER_FAR) return true;
  return Boolean(anchored);
}

/**
 * 装配蜂记录（rebuildAll 的蜂列表步骤提取为纯函数，供冒烟测试复用）：
 *  - allRecords：全量（工蜂 + 全部降级停驻蜂 + 全部无人机）——hex-rise-fx 差分基线
 *    必须吃全量（审阅 F2：喂过滤列表会丢绿墙、恢复运行误触黄墙）；
 *  - renderRecords：过滤后（工蜂恒含；降级停驻蜂与无人机按 isDroneVisible 过滤）——
 *    BeeLayer.setBees 渲染装配输入；绕飞序号 droneIndex/droneCount 按可见集重编
 *    （绕飞环角度均布、无空洞）。次序约束：setBees 吃过滤后、diff 吃全量（F2）。
 * @returns {{allRecords: Array, renderRecords: Array}}
 */
export function assembleBeeRecords(world, { droneMode = "active-only", collapsedParents = null } = {}) {
  const allRecords = [];
  const renderRecords = [];
  for (const studio of world.studios) {
    for (const bee of studio.bees) {
      const record = {
        id: bee.sessionId,
        x: bee.pos.x,
        z: bee.pos.z,
        y: bee.y,
        state: bee.state,
        droneOf: null,
        phase: hashPhase(bee.sessionId),
        origin: bee.origin,
        /* hive-interaction-polish 透传：droneStandIn = 无人机点击无动作 + tips 降级
           判定（4.1/6.2）；workspaceId/tipFace = tips 六字段（1.1/1.2）；
           summonedBy/summonedTo = 召唤边双索引（1.2/D6，links 消费）。 */
        droneStandIn: bee.droneStandIn,
        workspaceId: bee.workspaceId,
        tipFace: bee.tipFace,
        summonedBy: bee.summonedBy,
        summonedTo: bee.summonedTo
      };
      allRecords.push(record);
      if (isCardBeeVisible(bee, droneMode)) renderRecords.push(record); // 降级停驻蜂同谓词（F4）
    }
  }
  for (const studio of world.studios) {
    for (const bee of studio.bees) {
      const visible = bee.drones.filter((drone) => isDroneVisible(drone.state, droneMode));
      visible.forEach((drone, index) => {
        const record = {
          id: drone.sessionId,
          x: bee.pos.x,
          z: bee.pos.z,
          y: bee.y,
          state: drone.state,
          scale: 0.55,
          droneOf: { x: bee.pos.x, y: bee.y, z: bee.pos.z },
          droneIndex: index, // 可见集重编（绕飞环角度均布、无空洞，D2）
          droneCount: visible.length,
          collapsed: collapsedParents?.has(bee.sessionId) ?? false,
          phase: hashPhase(drone.sessionId),
          origin: "subagent",
          parentOf: bee.sessionId, // 蜂→无人机连线端点归属（7.2/7.3）
          workspaceId: drone.workspaceId, // tips「所属工作区」= 父巢（1.1 透传）
          tipFace: drone.tipFace, // 无人机降级口径（会话数/token/DPS = null → `-`）
          summonedBy: drone.summonedBy,
          summonedTo: drone.summonedTo
        };
        allRecords.push(record);
        renderRecords.push(record);
      });
      /* 被过滤的 done 无人机仍入全量基线（差分观测绿墙迁入 + 恢复运行不误报黄墙，F2）；
         渲染装配跳过——退场经 setBees 缺席差分触发既有离场动画（D4）。 */
      for (const drone of bee.drones) {
        if (isDroneVisible(drone.state, droneMode)) continue;
        allRecords.push({
          id: drone.sessionId,
          x: bee.pos.x,
          z: bee.pos.z,
          y: bee.y,
          state: drone.state,
          scale: 0.55,
          droneOf: { x: bee.pos.x, y: bee.y, z: bee.pos.z },
          collapsed: collapsedParents?.has(bee.sessionId) ?? false,
          phase: hashPhase(drone.sessionId),
          origin: "subagent",
          parentOf: bee.sessionId,
          workspaceId: drone.workspaceId,
          tipFace: drone.tipFace
        });
      }
    }
  }
  return { allRecords, renderRecords };
}

/**
 * 框选命中纯函数（hive-marquee-and-card-rework 2.4，供冒烟测试真值表复用——
 * assignTier/isDroneVisible 先例）：records = beeMap 值集（含 origin/droneStandIn/
 * pose/world），rect = canvas 本地坐标矩形 {x0,y0,x1,y1}，width/height = canvas
 * CSS 尺寸（与 interact.pointOf 同一坐标系）。命中口径：蜂体当帧位置**直接投影**
 * （pose?.y ?? world.y——SHALL NOT 走 projectToScreen 气泡卡锚点，CARD_ANCHOR_LIFT
 * 系统性偏上会「视觉框住蜂体却命不中」）→ 矩形包含测试；SHALL NOT 遮挡剔除
 * （被墙遮挡的蜂同样命中，用户定稿）；相机背切（z>1）不命中（与 projectToScreen
 * 同口径）；无人机（origin=subagent）与降级停驻蜂排除（isSelectableWorkerBee）。
 * 返回按投影序（先上到下、先左后右）排序的 sessionId 数组——面板投影序冻结源。
 */
export function beeIdsInRect(records, rect, camera, width, height) {
  const ids = [];
  if (!rect || !camera || !(width > 0) || !(height > 0)) return ids;
  const vector = new THREE.Vector3();
  const hits = [];
  for (const record of records) {
    if (!record?.world || !isSelectableWorkerBee(record)) continue;
    vector.set(record.world.x, record.pose?.y ?? record.world.y, record.world.z).project(camera);
    if (vector.z > 1) continue; // 相机背切
    const px = ((vector.x + 1) / 2) * width;
    const py = ((-vector.y + 1) / 2) * height;
    if (px < rect.x0 || px > rect.x1 || py < rect.y0 || py > rect.y1) continue;
    hits.push({ id: record.id, px, py });
  }
  hits.sort((a, b) => a.py - b.py || a.px - b.px);
  for (const hit of hits) ids.push(hit.id);
  return ids;
}

/**
 * 蜂离场收敛纯函数（hive-marquee-and-card-rework 2.7，冒烟测试复用）：
 * ids 过滤出仍存在于 world 巢内蜂中的会话（保持原顺序）。收敛源 = world——
 * beeMap 永久保留已离场记录（退场簿记），SHALL NOT 作收敛源。
 */
export function convergeMarqueeIds(ids, world) {
  const out = [];
  if (!Array.isArray(ids)) return out;
  const studios = world?.studios ?? [];
  for (const id of ids) {
    let present = false;
    for (const studio of studios) {
      if (studio.bees.some((b) => b.sessionId === id)) {
        present = true;
        break;
      }
    }
    if (present) out.push(id);
  }
  return out;
}

export class HiveScene {
  /**
   * @param {HTMLElement} host 画布容器
   * @param {Function} t 文案函数
   * @param {object} callbacks 场景 → 外壳回调（见下）
   */
  constructor(host, t, callbacks) {
    this.host = host;
    this.t = t;
    this.callbacks = callbacks ?? {};
    this.disposed = false;
    this.running = false;
    this.reducedMotion = false;
    this.canvas = document.createElement("canvas");
    this.canvas.className = "jyv-canvas";
    host.appendChild(this.canvas);
    /* CSS 暗角（D8/任务 5.2）：画布之上、卡片层之下——零 GPU 成本的深靛径向
       渐变遮罩，不遮气泡操作（pointer-events:none） */
    this.vignette = document.createElement("div");
    this.vignette.className = "jyv-vignette";
    host.appendChild(this.vignette);
    this.cardRoot = document.createElement("div");
    this.cardRoot.className = "jyv-cardsRoot";
    host.appendChild(this.cardRoot);
    /* 悬停 tips 层（hive-interaction-polish 6.1/D5）：cardRoot 兄弟瞬态层，
       pointer-events:none——hover 时跟随指针显示六字段，清理生命周期见 tips.mjs。 */
    this.tips = new TipsLayer(host, t);

    /* ── 渲染器（WebGL 不可用时抛错，外壳降级） ── */
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false
    });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    /* 清屏色 = 天穹地面半区起始深靛（二轮反馈：环境雾已移除；清屏被跟随相机的
       天穹覆盖，OutlinePass 深度预填一致性仍依赖它） */
    this.renderer.setClearColor(new THREE.Color(PALETTE.voidGround));
    this.renderer.autoClear = false; // 主场景手动清屏（直出路径；bloom 路径清默认帧缓冲深度/模板）
    /* 霓虹光照基线：ACES 色调映射 + 冷青白主光（带软阴影）/品紫 rim/天光半球 + 环境反射 */
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene(); // 环境雾已移除（二轮反馈）：远景靠地板径向压暗衔接天穹
    this.camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400);
    this.rig = new CameraRig(this.camera);

    /* 数字虚空天穹（D1）：每帧跟随相机的渐变穹顶（接入渲染循环见 loop） */
    this.sky = new SkyDome();
    this.scene.add(this.sky.mesh);

    /* 环境反射（PMREM，D7）：独立轻量天穹实例（主穹随相机不可直接用；
       小半径 r=50 < fromScene 默认 far=100），替换室内白盒 RoomEnvironment */
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const pmremScene = new THREE.Scene();
    const pmremDome = new SkyDome({ radius: 50, star: 0.2, grid: 0.08 });
    pmremScene.add(pmremDome.mesh);
    this.scene.environment = pmrem.fromScene(pmremScene, 0.04).texture;
    this.scene.environmentIntensity = 0.45; // 暗环境反射更弱，0.4–0.5 目检定
    pmrem.dispose();
    pmremDome.dispose();

    /* 灯光重排（D2）：冷青白主光（投影/随动保留）+ 品紫 rim 对角低位（随动）+
       青/紫半球光；环境光 0.85 → 0.5（霓虹需要黑）；固定方位冷补光移除 */
    this.scene.add(new THREE.AmbientLight(PALETTE.ambient, 0.5));
    this.sun = new THREE.DirectionalLight(PALETTE.keyLight, 2.0);
    this.sun.position.set(12, 26, 8);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.left = -45;
    this.sun.shadow.camera.right = 45;
    this.sun.shadow.camera.top = 45;
    this.sun.shadow.camera.bottom = -45;
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 90;
    this.sun.shadow.bias = -0.0004;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);
    /* 阴影按需更新（render-stability）：autoUpdate=false + loop 内 needsUpdate 门控
       （吸附格变化或隔帧轮换），2048² PCFSoft 阴影 pass 不再每帧全量重绘；
       蜂影延迟 ≤1 帧（33ms）不可辨。配合光位纹素吸附，拖拽平移时阴影图不再
       亚纹素滚动（阴影游动/闪烁观感的经典根源）。 */
    this.renderer.shadowMap.autoUpdate = false;
    /* 灯光空间基（恒定光向 → 一次性预计算）：吸附网格沿阴影相机的 right/up 轴，
       使阴影相机只按整纹素步进（标准 CSM 稳定化手法）。 */
    this._shadowBasisR = new THREE.Vector3();
    this._shadowBasisU = new THREE.Vector3();
    {
      const look = new THREE.Matrix4().lookAt(SUN_OFFSET, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
      const zAxis = new THREE.Vector3();
      look.extractBasis(this._shadowBasisR, this._shadowBasisU, zAxis);
    }
    this._shadowSnapX = NaN; // 上一帧吸附坐标（NaN = 首帧必更新）
    this._shadowSnapY = NaN;
    this._frameNo = 0; // 阴影隔帧轮换计数
    /* rim 逆光：与 key 对角低位、无阴影；每帧与 sun 同款随动视线目标
       （固定方位在 pan 远处后逆光失效——既有 fill light 瑕疵同因） */
    this.rim = new THREE.DirectionalLight(PALETTE.rimPurple, 1.1);
    this.rim.position.set(-14, 7, -11);
    this.scene.add(this.rim);
    this.scene.add(this.rim.target);
    this.scene.add(new THREE.HemisphereLight(PALETTE.hemiSky, PALETTE.hemiGround, 0.8));

    /* 统一选中遮罩场景（scene 级）：蜂/巢/蜜杯/瓦片遮罩共享同一 maskScene 与 maskMaterial，
       由 OutlinePass 屏幕空间遮罩膨胀合成恒宽描边（design.md D2/D3）。
       必须先于 BeeLayer 创建——蜂遮罩网格要挂入这个共享 maskScene（D2）。 */
    this.maskScene = new THREE.Scene();
    this.maskMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    /* 巢选中遮罩专用材质（studio-mask-depth-immune，用户实测修正）：不吃深度——
       主渲染深度里巢内的蜂（拼片前方实体）曾把拼片遮罩打出蜂形洞，膨胀沿洞边
       生成白圈（「部分蜜蜂被描边」伪影）；近侧墙板矩形边缘（竖直侧边/水平顶缘，
       真实渲染里朝向淡出近乎不可见）又在洞边切出直线断口（「方形裁切」观感）。
       巢轮廓 SHALL 是完整单一闭合锯齿外轮廓（D3 本意）→ 巢遮罩对主渲染深度免疫；
       蜂/蜜杯/瓦片选中描边仍走共享 maskMaterial，遮挡语义不变。 */
    this.studioMaskMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false
    });
    /* depthExemptOf（六轮）：内隔墙/内边条不参与 OutlinePass 深度预填——
       巢选中的高亮外描边 SHALL 只是整个巢的外轮廓，不含内部隔墙。
       hex-rise-fx（D7）：特效层全部网格同款豁免——特效墙写入预填深度会咬掉
       同瓦片的选中遮罩（y=0.02 位于墙内侧后方），白描边沿远侧边缘断裂。 */
    this.outlineState = {
      active: false,
      maskScene: this.maskScene,
      depthExemptOf: () => [
        this.walls.innerMesh,
        this.walls.innerTrim,
        ...(this.hexFx ? this.hexFx.slots.map((s) => s.mesh) : [])
      ].filter(Boolean)
    };

    /* ── 各层 ── */
    this.tileField = new TileField(this.scene);
    this.territory = new TerritoryLayer(this.scene);
    /* 底图水印层（hive-watermark）：领地之后的纯视觉层（renderOrder 3、y=0.018）；
       不入 maskScene、不进 interact 拾取集合——描边与指针交互天然穿透（design D2） */
    this.watermark = new WatermarkLayer(this.scene);
    this.walls = new WallLayer(this.scene);
    this.cups = new CupLayer(this.scene);
    this.bees = new BeeLayer(this.scene, {
      maskScene: this.maskScene,
      maskMaterial: this.maskMaterial
    });
    /* 连线层（hive-interaction-polish 7.1/D6）：蜂→无人机 + 召唤边两个 LineSegments
       集（半透明、depthWrite:false、palette 第二色）；空集整层不可见零成本。 */
    this.links = new LinkLayer(this.scene);
    /* 蜂群面板 3D 模型预览（hive-interaction-polish 追加；hive-marquee-and-card-rework
       5.1 扩展为外观 × 状态双层）：`${modelId}:${state}` → dataURL 快照缓存；
       _preview = 懒建的独立 128×128 渲染上下文（4 外观 × 4 状态 ≤16 张，每键至多
       渲染一次，缓存命中即零成本——逐帧仅 Map 检查，不入每帧热路径）。 */
    this.beePreviews = new Map();
    this._preview = null;
    this._previewTint = new THREE.Color(); // tint scratch（5.2 同步任务内覆写用，零分配）
    /* 选中蜂整体外轮廓描边（屏幕空间遮罩膨胀，主渲染后合成） */
    this.outlinePass = new OutlinePass();

    /* ── 二档管线（D8）：EffectComposer + UnrealBloomPass + OutputPass ──
       RT = HalfFloatType 线性 HDR（emissive >1 存活，Bloom 阈值在线性空间截取）、
       samples:4 与 outline RT 多采样对齐；ACES 由 OutputPass 终末执行。 */
    this.lowEndDevice = (typeof navigator !== "undefined" ? navigator.hardwareConcurrency : 8) <= 4;
    this.composer = this.buildComposer();

    /* 数据萤尘（D9）：加法混合青色微点；不入 maskScene、不投影 */
    this.motes = new MotesLayer(this.scene);

    /* 六边形升起光墙特效层（hex-rise-fx）：白选中驻留/灰拖拽跟随/绿完工/黄出场；
       不入 maskScene；深度豁免见 outlineState.depthExemptOf；无 RT——上下文恢复由
       three.js 自动恢复（motes/sky 同例），白墙驻留由 updateSelection 派生装配延续。 */
    this.hexFx = new HexRiseFxLayer(this.scene);

    this.cards = new CardLayer(this.cardRoot, t, {
      /* 「打开会话」改接会话浮窗（hive-quick-commands 3.5）：外壳在 onOpenSession
         里先 selectBee 同步 current 再开浮窗；未提供时回落既有选蜂路径。 */
      onOpen: (sessionId) => {
        if (this.callbacks.onOpenSession) this.callbacks.onOpenSession(sessionId);
        else this.callbacks.onSelectBee?.(sessionId);
      },
      onArchive: (sessionId) => this.callbacks.onArchiveBee?.(sessionId),
      onToggleCollapse: (sessionId) => this.toggleDroneCollapse(sessionId),
      onCardEnter: (key) => this.hoverKey = key,
      onCardLeave: (key) => { if (this.hoverKey === key) this.hoverKey = null; },
      /* 蜂种增量动作（custom-bee-types 任务 5.3）：孵化 / 车道取消 / 闩锁重置。 */
      onHatch: (sessionId, capabilityId) => this.callbacks.onHatch?.(sessionId, capabilityId),
      onLaneCancel: (workspaceId, sessionId) => this.callbacks.onLaneCancel?.(workspaceId, sessionId),
      onLatchReset: (sessionId) => this.callbacks.onLatchReset?.(sessionId)
    });

    this.gestures = new GestureController({
      canvas: this.canvas,
      scene: this.scene,
      camera: this.camera,
      rig: this.rig,
      tileField: this.tileField,
      territory: this.territory,
      walls: this.walls,
      bees: this.bees,
      cups: this.cups,
      studioLayersOf: () => this.studioLayers ?? [],
      occupancyOf: () => this.occupancy ?? new Map(),
      editModeOf: () => this.editMode,
      /* 右键旋转开关（相机手势重排 D1/D4）：读 scene 运行态（setSettings 写入）；
         定型时刻才被调用，拖拽中途切开关不影响当前拖拽。 */
      spinModeOf: () => Boolean(this.rightDragSpin),
      selectionOf: () => this.selection,
      callbacks: {
        /* 点蜂 = 先清显式选中再开会话（design.md D1/F4：防双描边，描边随 current 迁移）。
           单击清理协议（2.6）：所有单击回调路径前置 clearMarquee——多选集清空后本次
           单击语义照常执行（互斥：后到者赢）。 */
        onSelectBee: (id) => {
          this.clearMarquee();
          this.clearSelection();
          this.callbacks.onSelectBee?.(id);
        },
        onSelectDrone: (id) => {
          this.clearMarquee();
          this.clearSelection();
          this.callbacks.onSelectDrone?.(id);
        },
        /* 非蜂单击 → scene 统一选中（单槽位）。 */
        onSelectCup: (id) => {
          this.clearMarquee();
          this.select("cup", id);
        },
        onSelectStudio: (id) => {
          this.clearMarquee();
          this.select("studio", id);
        },
        onSelectTile: (cell) => {
          this.clearMarquee();
          this.onSelectTile(cell);
        },
        onClearSelection: () => {
          this.clearMarquee();
          this.clearSelection();
        },
        /* 框选手势（2.1/2.4）：interact 只报矩形——命中计算、预览、提交、取消全在
           scene（onMarqueeMove 置脏 rAF 合帧；onMarqueeEnd 即时计算提交）。 */
        onMarqueeMove: (rect) => this._onMarqueeMove(rect),
        onMarqueeEnd: (rect) => this._onMarqueeEnd(rect),
        onMarqueeCancel: () => this._onMarqueeCancel(),
        onStudioMenu: (id, p) => this.callbacks.onStudioMenu?.(id, p.x, p.y),
        onBeeMenu: (id, p) => this.callbacks.onBeeMenu?.(id, p.x, p.y),
        onStudioMoved: (id, cell) => this.callbacks.onStudioMoved?.(id, cell),
        onBeeDropped: (id, workspaceId) => this.callbacks.onBeeDropped?.(id, workspaceId),
        onInvalidDrop: () => this.callbacks.onInvalidDrop?.(),
        onDragCancel: () => this.callbacks.onDragCancel?.(),
        /* 拖拽落点灰墙（hex-rise-fx D7）：首格播放一次升起，其后吸附平移不重播；
           既有绿/红 ghost 调用点零改动（位置语义 ≠ 合法性语义）。 */
        onDragCell: (cell) => {
          const w = worldOf(cell);
          if (this.dragFollowing) {
            this.hexFx.followMove(w);
          } else {
            this.dragFollowing = true;
            this.hexFx.followStart(w);
          }
        },
        /* 拖拽结束（落定/取消/pointercancel/Esc 各一次）：灰墙立即消失（幂等）。 */
        onDragEnd: () => {
          if (!this.dragFollowing) return;
          this.dragFollowing = false;
          this.hexFx.followEnd();
        },
        onHover: (hover) => { this.hover = hover; },
        onFocusBee: (id) => this.focusBee(id),
        onFocusStudio: (id) => this.focusStudio(id)
      }
    });

    /* ── 尺寸与生命周期 ── */
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.lastTime = performance.now();
    this.raf = 0;
    this.onVisibility = () => {
      if (!document.hidden && this.running) this.loop();
    };
    document.addEventListener("visibilitychange", this.onVisibility);
    this.canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      this.contextLost = true;
      this.callbacks.onContextLost?.();
    });
    this.canvas.addEventListener("webglcontextrestored", () => {
      this.contextLost = false;
      this.callbacks.onContextRestored?.();
      this.outlinePass.invalidate(); // RT 属丢失的上下文，强制重建
      this.rebuildComposer(); // composer RT 同属丢失的上下文，整体重建（D8）
      this.rebuildAll();
    });

    this.world = null;
    this.studioLayers = [];
    this.occupancy = new Map();
    this.hover = null;
    this.hoverKey = null;
    this.selectedSessionId = null;
    this.collapsedParents = new Set();
    this.settings = { animation: "full", followCurrent: false, drones: "active-only" };
    /* 右键旋转开关运行态（相机手势重排 D4）：setSettings 写入，gestures.spinModeOf 闭包读取；
       默认 false = 右键全向平移（构造即默认语义，首次 setSettings 前同样成立）。 */
    this.rightDragSpin = false;
    /* 统一场景选中（design.md D1）：单槽位 {kind, id} | null；蜂不入槽（由 current 驱动）。 */
    this.selection = null;
    /* 白色选中光墙边沿检测状态（hex-rise-fx D7）：上次装配的瓦片选中 id（null = 无）。 */
    this.selectionTileFx = null;
    /* 拖拽灰墙跟随进行中（hex-rise-fx D7）：onDragCell 首次 → followStart，其后 followMove。 */
    this.dragFollowing = false;
    /* 完工/出场差分基线（hex-rise-fx D7）：持久于 scene 实例（非每次重建重置）；
       null = 尚未建基线（首次 setWorld 只建基线不触发，防整群误报出场）。 */
    this.fxPrevStates = null;
    this.fxPrevSessions = null;
    /* 选中态变化通知（外壳注入；浮窗卡片门控订阅，hive-quick-commands） */
    this.onSelectionChange = null;
    this.editMode = false;
    /* 选中遮罩网格（scene 级装配，挂入共享 maskScene），按 selection.kind 复用。 */
    this.selectionMask = {
      studio: null, // InstancedMesh（巢内格拼片 + 逐边墙板）
      cup: null,    // InstancedMesh（实例球遮罩，复制杯实例矩阵）
      tile: null    // Mesh（平置六边形遮罩，单枚）
    };
    this.studioMaskSig = null; // 巢遮罩重建签名（随 studioSig 变化）
    this.studioMaskFor = null; // 当前巢遮罩所属的 workspaceId（选中切换时按需重建）
    /* 左键框选多选（hive-marquee-and-card-rework 2.4–2.7）：marqueeSet = 已提交集合
       （外壳 marqueeStore 镜像，经 setMarqueeIds 下发，描边目标与收敛消费）；
       _marqueePreview = 拖拽中预览集合（描边当帧跟随，松手/取消即失效，SHALL NOT
       提交面板）；_marqueeRect/_marqueeDirty = rAF 合帧待算矩形（pointermove 只置脏）。
       多选集为页内临时态，SHALL NOT 持久化。 */
    this.marqueeSet = new Set();
    this._marqueePreview = null;
    this._marqueeRect = null;
    this._marqueeDirty = false;
    /* 描边目标集合 scratch（updateSelection 每帧复用——零分配纪律） */
    this._outlineIds = new Set();
    /* 诊断句柄（无头浏览器验收用；不影响生产） */
    try {
      window.__JYV_HIVE_DEBUG = this;
    } catch {
      /* ignore */
    }
    this.start();
  }

  /** 无人机折叠聚合切换（D3：折叠 → 收拢成团）。 */
  toggleDroneCollapse(parentSessionId) {
    if (this.collapsedParents.has(parentSessionId)) this.collapsedParents.delete(parentSessionId);
    else this.collapsedParents.add(parentSessionId);
    this.rebuildAll();
  }

  /* ── 数据接入 ── */

  /** bee-model 派生世界 → 场景重建（实例索引整体重建，不追加）。 */
  setWorld(world) {
    this.world = world;
    this.rebuildAll();
  }

  rebuildAll() {
    const world = this.world;
    if (!world) return;
    /* 巢几何：仅在落位/层数签名变化时重建实例缓冲（镜像 tick 高频、搬巢低频） */
    const studioSig = world.studios
      .map((studio) => studio.workspaceId + ":" + studio.layer + ":" + studio.center.q + "," + studio.center.r)
      .join("|");
    if (studioSig !== this.studioSig) {
      this.studioSig = studioSig;
      this.studioLayers = world.studios.map((studio) => {
        const wc = worldOf(studio.center);
        return {
          workspaceId: studio.workspaceId,
          center: studio.center,
          layer: studio.layer,
          worldCenter: wc,
          path: studio.path, // 水印文字源（hive-watermark R3：原映射丢弃它们）
          title: studio.title,
          edges: boundaryEdges(studio.center, studio.layer), // 真实边缘（逐边墙与饰条共用）
          interiorEdges: interiorEdges(studio.center, studio.layer) // 巢内隔断（内隔墙，D5 二轮）
        };
      });
      this.territory.setStudios(this.studioLayers);
      this.walls.setStudios(this.studioLayers);
      this.occupancy = world.occupancy ?? new Map();
    }
    /* 底图水印层（hive-watermark）：文字源逐 tick 刷新（改名时 studioSig 不变——R3/D2），
       层内签名比对去抖，setStudios 高频调用安全 */
    const wsById = new Map(world.studios.map((w) => [w.workspaceId, w]));
    for (const s of this.studioLayers) {
      const ws = wsById.get(s.workspaceId);
      if (ws) {
        s.path = ws.path;
        s.title = ws.title;
      }
    }
    this.watermark.setStudios(this.studioLayers);
    /* 蜜杯 */
    const cups = [];
    for (const studio of world.studios) {
      const wc = worldOf(studio.center);
      studio.cups.forEach((cup, index) => {
        cups.push({ workspaceId: studio.workspaceId, sessionId: cup.sessionId, worldCenter: wc, index, phase: index * 0.9 });
      });
    }
    const cupSig = cups.map((c) => c.sessionId + "@" + c.worldCenter.x.toFixed(3) + "," + c.worldCenter.z.toFixed(3)).join("|");
    if (cupSig !== this.cupSig) {
      this.cupSig = cupSig;
      this.cups.setCups(cups);
    }
    /* 蜂（含无人机）；归档化蜜的落点 = 该蜂的蜜杯位置 */
    const honeyTargets = new Map();
    const cupBySession = new Map(cups.map((c) => [c.sessionId, c]));
    /* 装配过滤（drone-active-visibility D2）：allRecords 全量（差分基线）、renderRecords
       过滤后（渲染装配）。次序约束（审阅 F2）：setBees 吃过滤后列表、diffBeeTransitions
       吃全量 beeRecords——现代码顺序不变，仅各自换入参。 */
    const { allRecords: beeRecords, renderRecords } = assembleBeeRecords(world, {
      droneMode: this.settings?.drones ?? "active-only",
      collapsedParents: this.collapsedParents
    });
    /* 外观模型透传（bee-model-variants）：蜂种 beeModel → 蜂记录（未绑定/未知 → 默认外观） */
    for (const record of beeRecords) {
      record.beeModel = this.beeOverlayIndex?.get(record.id)?.beeModel ?? DEFAULT_APPEARANCE_MODEL;
    }
    for (const [sessionId, cup] of cupBySession) honeyTargets.set(sessionId, { x: cup.worldCenter.x, y: -1.35, z: cup.worldCenter.z });
    this.bees.setBees(renderRecords, honeyTargets);
    /* 完工/出场差分（hex-rise-fx D7）：绿 = 非 done 迁入 done（带蜜归）；黄 = 新 sessionId
       （工蜂/无人机；野蜂不入 beeRecords，天然排除）。基线持久于 scene 实例——首次
       setWorld / 上下文恢复后首轮只建基线不触发；无 beeMap 记录（同 tick 未落位）的
       触发跳过（迁移语义一次性，不补触发）。输入保持全量（含被显隐过滤的 done 无人机，
       审阅 F2：绿墙照常触发、恢复运行不误报黄墙）。 */
    const hadFxBaseline = this.fxPrevStates != null;
    const fxDiff = diffBeeTransitions(
      hadFxBaseline ? { states: this.fxPrevStates, sessions: this.fxPrevSessions } : null,
      beeRecords
    );
    this.fxPrevStates = fxDiff.states;
    this.fxPrevSessions = fxDiff.sessions;
    if (hadFxBaseline) {
      for (const id of fxDiff.doneIds) {
        const record = this.bees.beeMap.get(id);
        if (!record) continue;
        this.hexFx.trigger({ x: record.world.x, z: record.world.z }, "green", "transient");
      }
      for (const id of fxDiff.enterIds) {
        const record = this.bees.beeMap.get(id);
        if (!record) continue;
        this.hexFx.trigger({ x: record.world.x, z: record.world.z }, "yellow", "transient");
      }
    }
    this.callbacks.onWorldUpdated?.(world);
    /* 蜂离场收敛（2.7）：世界镜像 tick 即时收敛多选集（归档/移除 → 剔除；
       全空 → 面板收起）。world 已就绪，收敛幂等。 */
    this._convergeMarquee();
  }

  /** 布局文档（镜头偏好恢复，D8）。旧默认 dist（34/28）迁移为新默认 15：
      历史版本默认值会被 loadPose 照常恢复而遮蔽新默认——恰好等于旧默认
      （从未手动缩放）的存档一律落新默认；手动缩放到其它值不受影响。
      迁移只改本次加载副本，不写回文档；20s 防抖回写会以新姿态自然落盘。 */
  setLayout(doc) {
    let camera = doc?.camera;
    if (camera && (camera.dist === 34 || camera.dist === 28)) {
      camera = { ...camera, dist: 15 };
    }
    if (camera) this.rig.loadPose(camera);
  }

  /**
   * 蜂种增量 overlay（custom-bee-types 任务 5.1）：beeTypes / assignments /
   * 引擎状态 / 车道快照合并视图。控制器在布局文档或 bee-engine 帧变化时下发；
   * 这里把每会话的增量信息预组索引（updateCards 每帧 O(1) 查表）。
   */
  setBeeOverlay(overlay) {
    const index = new Map();
    let laneByWorkspace = {};
    if (overlay) {
      const typeById = new Map((overlay.beeTypes ?? []).map((t) => [t.id, t]));
      for (const [sessionId, typeId] of Object.entries(overlay.assignments ?? {})) {
        const beeType = typeById.get(typeId) ?? null;
        const engine = overlay.engineState?.[sessionId] ?? {};
        const vars = engine.vars ?? {};
        const hatchables = [];
        if (beeType) {
          for (const capability of beeType.capabilities ?? []) {
            if (capability.action?.type !== "spawn") continue;
            const parsed = parseTemplate(capability.action.promptTemplate ?? "");
            const missing = parsed.ok ? parsed.vars.filter((name) => typeof vars[name] !== "string") : [];
            if (parsed.ok && missing.length === 0) hatchables.push({ capabilityId: capability.id, name: capability.name });
          }
        }
        index.set(sessionId, {
          beeTypeName: beeType?.name ?? "",
          queuePolicy: beeType?.queuePolicy ?? "",
          beeModel: typeof beeType?.beeModel === "string" ? beeType.beeModel : DEFAULT_APPEARANCE_MODEL,
          vars,
          latches: engine.latches ?? {},
          hatchables,
          waits: overlay.sessions?.[sessionId]?.waits ?? [],
          notices: overlay.sessions?.[sessionId]?.notices ?? []
        });
      }
      for (const [sessionId, status] of Object.entries(overlay.sessions ?? {})) {
        if (index.has(sessionId)) continue;
        index.set(sessionId, { beeTypeName: "", queuePolicy: "", beeModel: DEFAULT_APPEARANCE_MODEL, vars: {}, latches: {}, hatchables: [], waits: status.waits ?? [], notices: status.notices ?? [] });
      }
      laneByWorkspace = overlay.lane ?? {};
    }
    this.beeOverlayIndex = index;
    this.beeLaneByWorkspace = laneByWorkspace;
    if (this.cards) this.cards.lastLaneByWorkspace = laneByWorkspace;
    /* overlay 变化即重建蜂装配（蜂种 beeModel 变化 → 外观变体切换）+ 卡片内容刷新 */
    this.rebuildAll?.();
  }

  setSettings(settings) {
    const prevDrones = this.settings?.drones ?? "active-only";
    this.settings = { ...this.settings, ...settings };
    /* 相机俯角设置（相机手势重排 D3）：缺省 45 兜底（二轮定稿；旧默认 38 的
       localStorage 迁移在 store.init），即时下发 rig（φ = 90° − deg）。
       走既有页签设置轨道（水印显隐/无人机显隐同款实时生效链路，零新机制）。 */
    this.rig.setPitchDeg(this.settings.cameraPitchDeg ?? 45);
    /* 右键旋转开关（D4）：存运行态供 gestures.spinModeOf 闭包读取；缺省 false = 全向平移。 */
    this.rightDragSpin = Boolean(this.settings.rightDragSpin ?? false);
    /* 底图水印层显隐（hive-watermark D6）：页级开关即时生效 */
    this.watermark?.setVisible((this.settings.watermark ?? "show") !== "hide");
    if (settings.appearance) this.applyAppearance(settings.appearance);
    this.setReducedMotion(this.reducedMotion || this.settings.animation === "reduced");
    /* 无人机显隐模式变化 → 蜂重装配（切换即时生效，D3；rebuildAll 幂等，world 为空时直接返回） */
    if ((this.settings.drones ?? "active-only") !== prevDrones) this.rebuildAll();
  }

  /** 外观设置（设置页「外观」页签，三轮）：配色/透明度汇总下发到各层。
      缺省键以 APPEARANCE_DEFAULTS（与 PALETTE 同源）兜底，部分补丁安全。 */
  applyAppearance(appearance = {}) {
    const a = { ...APPEARANCE_DEFAULTS, ...appearance };
    this.walls.applyAppearance?.(a);
    this.tileField.applyAppearance?.(a);
    this.territory.applyAppearance?.(a);
    this.cups.applyAppearance?.(a);
    this.outlinePass.applyAppearance?.(a);
    this.motes.applyAppearance?.(a);
    this.sky.applyAppearance?.(a);
  }

  setReducedMotion(reduced) {
    this.reducedMotion = reduced;
    this.bees.reduced = reduced;
    this.cups.glow = reduced ? 0 : 1;
  }

  /** 当前会话（选中环跟随 list.current）——对应蜜蜂加高亮外描边（不弹卡，用户反馈）。
      回落语义（design.md D1）：仅在无显式非蜂选中时生效——实际门控在 updateSelection
      每帧下发描边目标集合（3.2 集合化：selection 空 → current 回落进集合；
      非蜂选中 → current 不入集合）。 */
  setSelected(sessionId) {
    this.selectedSessionId = sessionId ?? null;
    this.bees.setSelected(sessionId ?? null);
  }

  /* ── 统一场景选中（design.md D1/D2/D3） ── */

  /**
   * 设置显式选中（单槽位）。kind ∈ 'studio' | 'cup' | 'tile' | 'bubble'；
   * 'bubble' 本期仅占位不实现（点气泡走 DOM 路径）。蜂由 current 驱动不入槽。
   * 点击同一对象保持选中（幂等）。切换选中会重建对应遮罩。
   */
  select(kind, id) {
    if (this.selection && this.selection.kind === kind && this.selection.id === id) return;
    this.selection = { kind, id };
    this.syncSelectionMask();
    this.onSelectionChange?.(); // 外壳通知（浮窗卡片门控，hive-quick-commands）
  }

  /** 清空场景选中（蜂描边回落到当前会话）。 */
  clearSelection() {
    if (!this.selection) return;
    this.selection = null;
    this.syncSelectionMask();
    this.onSelectionChange?.(); // 外壳通知（浮窗卡片门控，hive-quick-commands）
  }

  /* ── 左键框选多选（hive-marquee-and-card-rework 2.4–2.7） ── */

  /** 多选集下发（2.5 通道 scene 侧）：外壳 marqueeStore 提交集合镜像至此，
      供描边目标集合（updateSelection）与蜂离场收敛（rebuildAll）消费。 */
  setMarqueeIds(ids) {
    this.marqueeSet = ids && typeof ids.has === "function" ? new Set(ids) : new Set();
  }

  /** 清空多选集（2.6 单击/Esc 清理协议）：预览丢弃 + 集合清空 + 回发外壳同步
      （面板收起、描边回落既有单目标逻辑）。幂等：空集且无预览时零成本返回。 */
  clearMarquee() {
    if (this._marqueePreview == null && this.marqueeSet.size === 0) return;
    this._marqueePreview = null;
    this._marqueeRect = null;
    this._marqueeDirty = false;
    this.marqueeSet.clear();
    this.callbacks.onMarqueeCommit?.([]); // 外壳 store 同步（回写 setMarqueeIds 幂等）
  }

  /** 拖拽中（interact onMarqueeMove）：矩形即时转发外壳（选框 DOM），命中计算置脏
      ——rAF 合帧至渲染循环统一计算（高回报率鼠标 pointermove 率可高于帧率，2.4）。 */
  _onMarqueeMove(rect) {
    this._marqueeRect = rect;
    this._marqueeDirty = true;
    this.callbacks.onMarqueeRect?.(rect);
  }

  /** 拖拽中命中预览（渲染循环每帧至多一次，2.4）：更新预览集合——描边当帧跟随
      （updateSelection 以 _marqueePreview 优先），SHALL NOT 改变正式状态（单选与
      多选集提交均留到松手）。 */
  _computeMarqueePreview() {
    this._marqueeDirty = false;
    this._marqueePreview = new Set(this.beesInRect(this._marqueeRect));
  }

  /** 松手提交（interact onMarqueeEnd，2.6）：即时计算命中（不走 rAF 节流）。
      命中 ≥1 → 清既有单选（后到者赢：巢描边与光墙消失）+ 提交多选集（ids 为
      投影序冻结数组）；命中 0 → 空框选：多选集清空、既有单选维持不动。
      预览集合失效（描边回落正式集合）。 */
  _onMarqueeEnd(rect) {
    const ids = this.beesInRect(rect);
    this._marqueeRect = null;
    this._marqueeDirty = false;
    this._marqueePreview = null;
    if (ids.length > 0) this.clearSelection();
    this.marqueeSet = new Set(ids);
    this.callbacks.onMarqueeRect?.(null); // 选框 DOM 收口
    this.callbacks.onMarqueeCommit?.(ids);
  }

  /** 取消（interact onMarqueeCancel：Esc/pointercancel/指针离画布）：恢复拖拽前
      快照——预览集合丢弃即回落正式集合（通常为空），SHALL NOT 提交、SHALL NOT
      动既有单选。 */
  _onMarqueeCancel() {
    this._marqueeRect = null;
    this._marqueeDirty = false;
    this._marqueePreview = null;
    this.callbacks.onMarqueeRect?.(null); // 选框 DOM 收口
    this.callbacks.onMarqueeCancel?.();
  }

  /** 框选命中（2.4）：beeMap 全量过 beeIdsInRect 纯函数（蜂体当帧位置直接投影，
      无人机/降级停驻蜂排除）。viewport 用 canvas 客户区 CSS 尺寸——与
      interact.pointOf 的 canvas 本地坐标系同系（SHALL NOT 混用 cardRoot 锚点系）。 */
  beesInRect(rect) {
    return beeIdsInRect(
      this.bees.beeMap.values(),
      rect,
      this.camera,
      this.canvas.clientWidth || 0,
      this.canvas.clientHeight || 0
    );
  }

  /** 蜂离场收敛（2.7）：多选集以世界镜像收敛——无记录剔除，全部离场清空（面板
      收起，对齐单选「选中对象消失自动清空」先例）。收敛逻辑见纯函数
      convergeMarqueeIds（源 = world 巢内蜂）；在 rebuildAll（镜像 tick）调用，
      即时且幂等。 */
  _convergeMarquee() {
    if (this.marqueeSet.size === 0 || !this.world) return;
    const next = convergeMarqueeIds([...this.marqueeSet], this.world);
    if (next.length !== this.marqueeSet.size) {
      this.marqueeSet = new Set(next);
      this.callbacks.onMarqueeCommit?.(next); // 全空 → 空数组（面板收起）
    }
  }

  /** 蜂巢编辑开关（仅门禁搬巢手势；不持久化，design.md D5）。 */
  setEditMode(on) {
    this.editMode = Boolean(on);
  }

  /** 拖拽（搬巢/拖蜂/框选）是否进行中——interact 的 gestures.mode 为 studio/bee/marquee
      时激活。供外壳 Esc 分层守卫（design.md D7/F3；hive-marquee-and-card-rework 2.2
      纳入 marquee：拖框中按 Esc 仅取消手势，SHALL NOT 漏判进外壳分层连带关页）。 */
  get dragInProgress() {
    const mode = this.gestures?.mode;
    return mode === "studio" || mode === "bee" || mode === "marquee";
  }

  /* ── 键盘 Z/C 按住旋转（hive-interaction-polish 3.2/D1）：外壳键盘层记键/清键，
        渲染循环每帧 rig.keySpin(dt) 积分。scene 薄委托保持 rig 姿态权威单一。 ── */

  /** 记/清一枚旋转键（keydown=true / keyup=false；幂等）。 */
  setSpinKey(key, down) {
    this.rig?.setSpinKey?.(key, down);
  }

  /** 清空全部旋转键（window blur / visibilitychange hidden 键卡死防线）。 */
  clearSpinKeys() {
    this.rig?.clearSpinKeys?.();
  }

  /* ── 蜂群面板 3D 模型预览（hive-interaction-polish 追加；hive-marquee-and-card-rework
        5.1/5.2）：每外观模型 × 每状态渲染一次小尺寸快照（独立 128×128 上下文 +
        canvas.toDataURL 缓存，缓存键 `${modelId}:${state}` ≤16 张），WorkerPanel 卡片
        直接复用 <img>——SHALL NOT 每卡挂独立上下文。外观模型为懒加载，变体就绪的
        下一帧补生成；全部缓存命中后本入口零渲染成本。 ── */

  /** 逐模型 × 逐状态补齐快照缓存（每帧调用；缓存命中即跳过）。 */
  _ensureBeePreviews() {
    for (const modelId of BEE_APPEARANCE_MODELS) {
      const variant = this.bees.variants.get(modelId);
      if (!variant?.ready) continue; // 外观模型懒加载未就绪 → 下一帧再试
      for (const state of BEE_PREVIEW_STATES) {
        const key = modelId + ":" + state;
        if (this.beePreviews.has(key)) continue;
        const url = this._renderBeePreview(variant, state);
        if (!url) continue; // 渲染失败 → 下帧重试（有界：失败也不阻塞主循环）
        this.beePreviews.set(key, url);
        this.callbacks.onBeePreview?.(key, url);
      }
    }
  }

  /** 渲染单只外观模型 × 状态色快照：部件 Mesh × 归一化矩阵挂入独立小场景，3/4 俯视
      取景，透明底渲染后 toDataURL。几何/材质与主场景共享（只读，不复制不释放）。
      tint 零污染（5.2）：材质与主场景**共享**——在同步渲染任务内临时覆写
      material.color = 原色 × 状态色 tint（与 3D 近档 instanceColor 乘染同源公式，
      bees.mjs lerp(white, STATE_COLORS[state], state==='idle'?0:0.45)）→ render →
      立即还原（同任务内无帧间泄漏、零克隆零堆积；SHALL NOT 长期持有改色材质）。 */
  _renderBeePreview(variant, state = "idle") {
    try {
      if (!this._preview) {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        /* preserveDrawingBuffer: true——128² 离屏快照 canvas 永不上屏，保留绘图缓冲
           成本可忽略；换取 toDataURL 跨驱动必然可读（消除 antialias/present 时序
           读空的驱动差异隐患）。 */
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
        renderer.setPixelRatio(1);
        renderer.setSize(128, 128, false);
        renderer.toneMapping = this.renderer.toneMapping; // 与主场景观感一致
        renderer.toneMappingExposure = this.renderer.toneMappingExposure;
        const scene = new THREE.Scene();
        /* 环境反射（PBR 依赖，快照发灰根因）：v0.2.7 起蜂模型为 MeshStandardMaterial——
           金属度高的 PBR 材质无 envMap 时只剩直射光微高光，整蜂渲染近黑、叠在深色
           卡底上不可见。与主场景同款天穹 PMREM；注意环境贴图必须在预览渲染器
           自己的上下文内生成（RTT 纹理不可跨上下文共享主场景的 environment）。 */
        const pmrem = new THREE.PMREMGenerator(renderer);
        const pmremScene = new THREE.Scene();
        const pmremDome = new SkyDome({ radius: 50, star: 0.2, grid: 0.08 });
        pmremScene.add(pmremDome.mesh);
        scene.environment = pmrem.fromScene(pmremScene, 0.04).texture;
        scene.environmentIntensity = 0.45; // 与主场景同强度
        pmrem.dispose();
        pmremDome.dispose();
        scene.add(new THREE.AmbientLight(PALETTE.ambient, 0.75));
        const key = new THREE.DirectionalLight(PALETTE.keyLight, 2.4);
        key.position.set(2.2, 3.0, 2.0);
        scene.add(key);
        const rim = new THREE.DirectionalLight(PALETTE.rimPurple, 1.0);
        rim.position.set(-2.4, 1.6, -2.2);
        scene.add(rim);
        const group = new THREE.Group();
        scene.add(group);
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
        camera.position.set(1.7, 1.4, 2.0); // 3/4 俯视（蜂头朝 +X），包围球半径 0.8 恰满框
        camera.lookAt(0, 0, 0);
        this._preview = { renderer, scene, camera, group, canvas };
      }
      const p = this._preview;
      p.group.clear();
      const tintedMaterials = new Set();
      for (const part of variant.buckets.tierParts[TIER_NEAR]) {
        /* 部件几何与材质都取自实例网格自身：tierParts 条目 = { mesh, normalization,
           tinted }（bees.mjs attachModel），无独立 geometry/material 字段——原实现
           误写 part.geometry / part.material（双双恒 undefined）→ Mesh 回落
           「空 BufferGeometry + 默认白材质」→ 顶点数为 0，快照自功能上线起渲染的
           就是一张全透明 PNG（「卡面看不到模型」的真正根因；材质修复后仍不现形
           的原因同此）。修正后与主场景共享同一几何与材质实例（只读共享语义不变；
           下方覆写→渲染→还原保证零污染）。 */
        const material = part.mesh?.material;
        const mesh = new THREE.Mesh(part.mesh?.geometry, material);
        mesh.matrix.copy(part.normalization); // 模型归一化（居中/比例尺/朝向）照搬蜂层
        mesh.matrixAutoUpdate = false;
        p.group.add(mesh);
        if (material?.color) tintedMaterials.add(material); // 同一材质多部件共享 → 去重
      }
      /* tint 覆写 → 渲染 → 立即还原（同步任务内；含原色分量——instanceColor 乘染
         语义 = 材质原色 × tint，idle 即原色快照） */
      const tint = this._previewTint.set(0xffffff).lerp(STATE_COLORS[state] ?? STATE_COLORS.idle, state === "idle" ? 0 : 0.45);
      const savedColors = [];
      for (const material of tintedMaterials) savedColors.push([material, material.color.r, material.color.g, material.color.b]);
      for (const [material, r, g, b] of savedColors) material.color.setRGB(r * tint.r, g * tint.g, b * tint.b);
      p.renderer.render(p.scene, p.camera);
      for (const [material, r, g, b] of savedColors) material.color.setRGB(r, g, b);
      p.group.clear();
      return p.canvas.toDataURL("image/png"); // 同步任务内读取帧缓冲（preserveDrawingBuffer 已开，双保险）
    } catch (error) {
      console.warn("[dsh-v-hive] bee preview render failed:", error);
      return null;
    }
  }

  getEditMode() {
    return this.editMode;
  }

  getSelection() {
    return this.selection;
  }

  /** 对外冒泡：地面瓦片选中（interact 单击路由 ground → 反算格坐标）。 */
  onSelectTile(cell) {
    const key = hexKey(cell);
    /* 被领地占据的瓦片不可选中（design.md D4/F7：占用视同不可选）。 */
    if (this.occupancy?.has(key)) return;
    this.select("tile", key);
  }

  /** 每帧统一选中装配：校验存在性 + 写遮罩 + 下发描边门控（集合化，3.2）。 */
  updateSelection() {
    const sel = this.selection;
    /* 1) 蜂描边门控（3.2 集合化）：多选集（拖拽中取预览集）非空 → 集合渲染
        （多选集 ∪ {current 回落}）；否则既有单目标逻辑不变——selection 空 → current，
        非蜂选中 → null 让位（蜂不入槽）。 */
    const outlineIds = this._outlineIds;
    outlineIds.clear();
    const marquee = this._marqueePreview ?? this.marqueeSet;
    if (marquee.size > 0) {
      for (const id of marquee) outlineIds.add(id);
      if (!sel && this.selectedSessionId) outlineIds.add(this.selectedSessionId); // current 回落
    } else if (!sel && this.selectedSessionId) {
      outlineIds.add(this.selectedSessionId);
    }
    this.bees.setOutlineBeeIds(outlineIds.size > 0 ? outlineIds : null);

    /* 2) 选中对象存在性校验：消失或（瓦片）被占用 → 清空（design.md D1/D4）。 */
    if (sel) {
      if (sel.kind === "studio") {
        if (!this.studioLayers.some((s) => s.workspaceId === sel.id)) this.selection = null;
      } else if (sel.kind === "cup") {
        if (!this.cups.hasSession(sel.id)) this.selection = null;
      } else if (sel.kind === "tile") {
        /* 瓦片键解析回 {q,r} 判断是否被占用；被占用视同对象消失（F7）。 */
        if (this.occupancy?.has(sel.id)) this.selection = null;
      }
      /* 'bubble' 不参与（占位） */
    }

    /* 瓦片选中反馈（R10，用户实测二分定位）：常驻白墙在 Bloom 路径（强制开启）
       与 composer 并跑时全帧压黑（直出路径正常；标准混合/0.55 强度均无效），
       机制待离线定位——瓦片选中暂不点亮常驻光墙，选中态由底栏地板栏呈现；
       瞬态绿/黄出场特效不受影响。 */
    this.hexFx.hidePersistent();

    /* 3) 重建/更新遮罩 + 置位 outlineState.active（3.2 加多选分支：集合中任一蜂
        在 beeMap 有记录即活动——遮罩是否存在由 Bees 层逐帧按集合写入）。
        瓦片描边（R11）：与巢/蜜杯同一 OutlinePass 路径；常驻光墙保持移除（R10）。
        （若瓦片描边在你机器上仍触发压黑，退路为 DOM 投影标记方案。） */
    this.syncSelectionMask();
    let beePresent = false;
    for (const id of outlineIds) {
      if (this.bees.beeMap?.has(id)) {
        beePresent = true;
        break;
      }
    }
    this.outlineState.active =
      this.selection?.kind === "studio" ||
      this.selection?.kind === "cup" ||
      this.selection?.kind === "tile" ||
      beePresent;
    /* 选中巢饰条高亮分桶（R7）：选中巢饰条辉光、未选中巢无泛光；
       瓦片/蜜杯/清空选中 → 全暗（setHighlighted 内含边沿检测）。 */
    this.walls.setHighlighted(sel?.kind === "studio" ? sel.id : null);
  }

  /** 按当前 selection 重建或更新遮罩网格，并维护（蜂）遮罩占位。
      蜂遮罩由 Bees 层逐帧写入；这里负责 studio/cup/tile 三类。
      瓦片描边（R11）：与巢/蜜杯同一条 OutlinePass 路径（已验证安全）——
      常驻光墙才是 Bloom 压黑元凶（R10，保持移除）。 */
  syncSelectionMask() {
    const sel = this.selection;
    /* 清空非蜂遮罩可见性 */
    if (this.selectionMask.studio) this.selectionMask.studio.visible = false;
    if (this.selectionMask.cup) this.selectionMask.cup.visible = false;
    if (this.selectionMask.tile) this.selectionMask.tile.visible = false;
    if (!sel) return;

    if (sel.kind === "studio") {
      this.ensureStudioMask(sel.id).visible = true;
    } else if (sel.kind === "cup") {
      this.ensureCupMask(sel.id).visible = true;
    } else if (sel.kind === "tile") {
      const tile = this.ensureTileMask();
      const cell = this.cellOfKey(sel.id);
      if (cell) {
        const w = worldOf(cell);
        tile.position.set(w.x, 0.02, w.z);
      }
      tile.visible = true;
    }
  }

  cellOfKey(key) {
    const parts = key.split(",");
    if (parts.length !== 2) return null;
    const q = Number(parts[0]);
    const r = Number(parts[1]);
    if (!Number.isFinite(q) || !Number.isFinite(r)) return null;
    return { q, r };
  }

  /* ── 巢遮罩：实心锯齿拼合（巢内格拼片 + 逐边墙板），design.md D3 / explore.md F1 ── */

  ensureStudioMask(workspaceId) {
    const studio = this.studioLayers.find((s) => s.workspaceId === workspaceId);
    if (!studio) return this.selectionMask.studio ?? null;
    /* 选中切换（不同 workspaceId）或 studioSig 变化时整体重建（巢内格/边界边集随之变化）。 */
    if (!this.selectionMask.studio || this.studioMaskFor !== workspaceId || this.studioMaskSig !== this.studioSig) {
      if (this.selectionMask.studio) this.disposeObject(this.selectionMask.studio);
      this.selectionMask.studio = this.buildStudioMask(studio);
      this.studioMaskSig = this.studioSig;
      this.studioMaskFor = workspaceId;
    }
    return this.selectionMask.studio;
  }

  /** 单只巢的遮罩：Group（巢内格六边形拼片 InstancedMesh + 逐边墙板 InstancedMesh）。 */
  buildStudioMask(studio) {
    const cells = spiralCells(studio.center, Math.max(0, studio.layer - 1));
    const edges = studio.edges ?? [];
    const group = new THREE.Group();
    const m = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const euler = new THREE.Euler();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    /* 巢内格拼片：贴地板面，y 略高于巢内地板 0.012 与地面（避 z-fighting） */
    const tileGeo = hexGeometry(0);
    const tiles = new THREE.InstancedMesh(tileGeo, this.studioMaskMaterial, Math.max(1, cells.length));
    tiles.count = cells.length;
    tiles.frustumCulled = false;
    let i = 0;
    for (const cell of cells) {
      const w = worldOf(cell);
      pos.set(w.x, 0.024, w.z);
      quat.identity();
      scale.set(1, 1, 1);
      m.compose(pos, quat, scale);
      tiles.setMatrixAt(i++, m);
    }
    tiles.instanceMatrix.needsUpdate = true;
    group.add(tiles);
    /* 逐边墙板：矩阵按 walls.mjs 同款 compose 自 studioLayers[].edges（真实锯齿轮廓） */
    const wallGeo = new THREE.PlaneGeometry(1, 1);
    wallGeo.translate(0, 0.5, 0);
    const wallPanels = new THREE.InstancedMesh(wallGeo, this.studioMaskMaterial, Math.max(1, edges.length));
    wallPanels.count = edges.length;
    wallPanels.frustumCulled = false;
    i = 0;
    for (const e of edges) {
      pos.set(e.mx, 0, e.mz);
      euler.set(0, Math.atan2(e.dx, e.dz), 0);
      quat.setFromEuler(euler);
      scale.set(1, WALL_HEIGHT, 1);
      m.compose(pos, quat, scale);
      wallPanels.setMatrixAt(i++, m);
    }
    wallPanels.instanceMatrix.needsUpdate = true;
    group.add(wallPanels);
    group.visible = false;
    this.maskScene.add(group);
    return group;
  }

  /** 递归释放遮罩对象（Group → 子 InstancedMesh 的几何与实例）。 */
  disposeObject(obj) {
    if (!obj) return;
    this.maskScene.remove(obj);
    obj.traverse?.((child) => {
      if (child.isMesh || child.isInstancedMesh) {
        child.geometry?.dispose?.();
        child.dispose?.();
      }
    });
    if (obj.isMesh || obj.isInstancedMesh) obj.dispose?.();
  }

  /* ── 蜜杯遮罩：复用 CupLayer.geometry + 复制实例矩阵（design.md D3） ── */

  ensureCupMask(sessionId) {
    if (!this.selectionMask.cup) {
      const mesh = new THREE.InstancedMesh(this.cups.geometry, this.maskMaterial, 1);
      mesh.count = 1;
      mesh.frustumCulled = false;
      mesh.visible = false;
      this.maskScene.add(mesh);
      this.selectionMask.cup = mesh;
    }
    const cupMatrix = this.cups.matrixOf(sessionId);
    if (cupMatrix) {
      this.selectionMask.cup.setMatrixAt(0, cupMatrix);
      this.selectionMask.cup.instanceMatrix.needsUpdate = true;
    }
    return this.selectionMask.cup;
  }

  /* ── 瓦片遮罩：平置六边形（单枚，y≈0.02），design.md D4 ── */

  ensureTileMask() {
    if (!this.selectionMask.tile) {
      const tile = new THREE.Mesh(hexGeometry(0), this.maskMaterial);
      tile.frustumCulled = false;
      tile.visible = false;
      this.maskScene.add(tile);
      this.selectionMask.tile = tile;
    }
    return this.selectionMask.tile;
  }

  /** 搜索高亮 + 聚焦（spec「搜索」）。 */
  highlightSearch(sessionIds) {
    this.searchHighlight = new Set(sessionIds ?? []);
  }

  focusBee(sessionId) {
    const record = this.bees.beeMap.get(sessionId);
    if (!record) return;
    /* 聚焦只动位置与距离（相机手势重排 D6）：不传 phi，tween 保持当前设置俯角。 */
    this.rig.flyTo({
      tx: record.world.x,
      tz: record.world.z,
      dist: Math.min(this.rig.dist, 14)
    });
  }

  /** 镜头跟随当前会话（hive-marquee-and-card-rework 1.3）：current 变化沿由外壳订阅
      驱动（本方法只做单次定位）。仅命中可选中工蜂时飞行——无人机（subagent）/降级
      停驻蜂/归档（蜜杯，beeMap 无记录）/无蜂记录 SHALL NOT 飞（isSelectableWorkerBee）。
      纯平移：flyTo 不传 dist = 保持当前镜头距离（SHALL NOT 缩放，区别于 focusBee 压近）。
      scene running 门禁：stop（页关闭/浮窗/页签隐藏）期间 SHALL NOT 飞——页关闭期间
      的 current 变化由下次开页定位兜底（1.4/1.5）。 */
  followBee(sessionId) {
    if (!this.running || this.disposed) return;
    const record = this.bees.beeMap.get(sessionId);
    if (!isSelectableWorkerBee(record)) return;
    this.rig.flyTo({ tx: record.world.x, tz: record.world.z });
  }

  focusStudio(workspaceId) {
    const studio = this.studioLayers.find((s) => s.workspaceId === workspaceId);
    if (!studio) return;
    this.rig.flyTo({ tx: studio.worldCenter.x, tz: studio.worldCenter.z, dist: Math.min(this.rig.dist, 18) });
  }

  studioOfSession(sessionId) {
    const studio = this.world?.studios.find((s) => s.bees.some((b) => b.sessionId === sessionId) || s.cups.some((c) => c.sessionId === sessionId));
    return studio ? this.studioLayers.find((l) => l.workspaceId === studio.workspaceId) : undefined;
  }

  /* ── 渲染循环 ── */

  /** 组装 Bloom composer（D8）：RenderPass → UnrealBloomPass（strength≈0.6 /
      radius≈0.4 / threshold≈0.85，线性 HDR 空间）→ OutputPass。
      RT 启用 depthTexture（render-perf-optimization D7）：主场景深度经 MSAA resolve
      落入该纹理，OutlinePass 直接采样取消全场景 overrideMaterial 重画。r185 内部
      RenderPass 渲染进 readBuffer（RT1/RT2 逐帧交替），composer.render() 返回后
      writeBuffer 恒指向本帧主场景 RT（spike T2 实测）。 */
  buildComposer() {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const target = new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), {
      type: THREE.HalfFloatType,
      samples: 4,
      depthTexture: new THREE.DepthTexture(Math.max(1, size.x), Math.max(1, size.y))
    });
    const composer = new EffectComposer(this.renderer, target);
    composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(Math.max(1, size.x), Math.max(1, size.y)), 0.6, 0.4, 0.85);
    composer.addPass(this.bloomPass);
    composer.addPass(new OutputPass());
    return composer;
  }

  /** webglcontextrestored 后整体重建（composer RT 属丢失的上下文）。 */
  rebuildComposer() {
    if (!this.composer) return;
    this.bloomPass?.dispose?.();
    this.composer.dispose();
    this.composer = this.buildComposer();
  }

  /** 二档 Bloom 门控（D8 / 任务 4.4）：reduced-motion、低端设备或设置
      animation=reduced 时绕过 composer 直出现状渲染路径（一档配色观感一致）。
      设置项经 setSettings 既有链路生效。 */
  bloomActive() {
    if (!this.composer || this.lowEndDevice || this.reducedMotion) return false;
    return (this.settings?.animation ?? "full") !== "reduced";
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  loop = () => {
    if (!this.running || this.disposed || this.contextLost) return;
    if (document.hidden) {
      this.running = false; // 页签隐藏暂停（恢复可见时 visibilitychange 重启）
      return;
    }
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min(64, now - this.lastTime);
    this.lastTime = now;
    /* 键盘 Z/C 按住旋转（hive-interaction-polish 3.2/D1）：每帧积分方位角（固定角速度，
       帧率无关）；先于 rig.update——旋转打断进行中飞行（tween = null），无键时零成本。 */
    this.rig.keySpin(dt);
    this.rig.update();
    this.tileField.update(this.rig.target); // 锚点 = 视线目标（注视哪里铺哪里）
    /* 太阳（阴影相机）跟随视线目标——光位沿灯光空间纹素网格**吸附**（render-stability）：
       ① 拖拽平移时阴影图不再亚纹素滚动（拖拽中阴影游动/闪烁的经典根源）；
       ② 吸附格未变且非轮换帧时跳过阴影重绘（needsUpdate 门控，~50% 阴影 pass 成本）；
       ③ 光向恒定（位置+目标同步平移），漫反射/高光光照不受吸附影响。 */
    const shadowCam = this.sun.shadow.camera;
    const shadowTexel = (shadowCam.right - shadowCam.left) / this.sun.shadow.mapSize.x; // 世界单位/纹素
    const ox = this.rig.target.x * this._shadowBasisR.x + this.rig.target.z * this._shadowBasisR.z;
    const oy = this.rig.target.x * this._shadowBasisU.x + this.rig.target.z * this._shadowBasisU.z;
    const snapX = Math.round(ox / shadowTexel) * shadowTexel;
    const snapY = Math.round(oy / shadowTexel) * shadowTexel;
    const sunMoved = snapX !== this._shadowSnapX || snapY !== this._shadowSnapY;
    this._shadowSnapX = snapX;
    this._shadowSnapY = snapY;
    const sbR = this._shadowBasisR;
    const sbU = this._shadowBasisU;
    this.sun.target.position.set(sbR.x * snapX + sbU.x * snapY, sbR.y * snapX + sbU.y * snapY, sbR.z * snapX + sbU.z * snapY);
    this.sun.position.copy(this.sun.target.position).add(SUN_OFFSET);
    this.sun.target.updateMatrixWorld();
    this.renderer.shadowMap.needsUpdate = sunMoved || (this._frameNo & 1) === 0;
    this._frameNo += 1;
    /* 品紫 rim 与 sun 同款随动（D2）：对角低位逆光，pan 远处仍有效 */
    this.rim.position.set(this.rig.target.x - 14, 7, this.rig.target.z - 11);
    this.rim.target.position.set(this.rig.target.x, 0, this.rig.target.z);
    this.rim.target.updateMatrixWorld();
    /* 数字天穹每帧跟随相机（D1） */
    this.sky.update(this.camera, now);
    /* 数据萤尘（D9）：按视线目标回绕；reduced-motion 静止不漂移 */
    this.motes.frame(now, this.rig.target, this.reducedMotion);
    this.tileField.frame(this.camera);
    this.territory.frame(this.camera);
    this.walls.frame(this.camera);
    /* 底图水印（hive-watermark）：跳边节流/滞回/淡切推进（walls.frame 之后） */
    this.watermark.frame(this.camera, this.reducedMotion);
    /* 统一选中装配：每帧校验选中对象仍存在（消失/瓦片被占用 → 清空），
       并下发蜂描边门控（3.2 集合化：多选集/预览集 ∪ current 回落；单目标回落）。
       框选命中预览（2.4）置于其前：rAF 合帧——pointermove 只置脏，本帧至多计算
       一次，预览集合当帧即驱动描边集合。 */
    if (this._marqueeDirty) this._computeMarqueePreview();
    this.updateSelection();
    /* 光墙特效推进（hex-rise-fx）：置于 updateSelection 之后——本帧触发的白墙当帧
       即推进到首个升起帧（reduced-motion 当帧即定格），不留空白帧。 */
    this.hexFx.frame(dt, this.reducedMotion);
    /* 出泡例外集（render-perf-optimization D4.3/D8）：悬停/选中/展开中的蜂 →
       蜂层强制近档（姿态新鲜）+ 气泡剔除例外。Set 复用（零分配）。 */
    const anchorIds = this.bees.anchorIds;
    anchorIds.clear();
    if (this.hover && (this.hover.kind === "bee" || this.hover.kind === "drone")) anchorIds.add(this.hover.id);
    if (this.selectedSessionId) anchorIds.add(this.selectedSessionId);
    if (this.cards?.expandedKey) anchorIds.add(this.cards.expandedKey);
    /* 蜂层帧推进：传相机世界坐标（LOD 距离分桶，design.md D1/D5） */
    this.bees.frame(dt, this.camera.position);
    /* 连线层（hive-interaction-polish 7.3/D6）：蜂→无人机 + 召唤边；端点取当帧
       姿态（绕飞/低巡逐帧跟随），置于 bees.frame 之后。空集整层零成本。 */
    this.links.frame({ hover: this.hover, selectedId: this.selectedSessionId, bees: this.bees });
    /* 蜂群面板 3D 预览（hive-interaction-polish 追加）：每外观模型生成一次快照；
       全部缓存命中后本调用为 O(模型数) 的 Map.has 检查，零渲染成本。 */
    this._ensureBeePreviews();
    this.cups.frame(now);
    /* 卡片投影：hover/选中/钉住/搜索高亮的蜂 → 屏幕 */
    this.updateCards();
    /* 悬停 tips（hive-interaction-polish 6.1/D5）：跟随 interact.onHover 屏幕坐标；
       hover 清理/pointerleave 即隐藏（非蜂 hover 与无 hover 均隐藏）。 */
    this.tips.frame(this.hover, {
      overlayOf: (id) => this.beeOverlayIndex?.get(id) ?? null,
      studioTitleOf: (workspaceId) => {
        const studio = (this.world?.studios ?? []).find((w) => w.workspaceId === workspaceId);
        return studio?.title ?? "";
      }
    });
    /* 主渲染（D8 顺序不变）：二档 composer 上屏 → OutlinePass 合成 quad
       （autoClear=false）；降级/一档 = 现状手动清屏直出路径。
       手动清屏仅保留给描边合成前路径——composer 由 RenderPass 自行清 RT；
       bloom 路径下只清默认帧缓冲深度/模板（颜色 = composer 输出保留），
       合成 quad（depthTest:false）与全屏 pass 不受残留深度影响。
       描边深度来源（render-perf-optimization D7）：bloom 路径采样主渲染深度
       （composer.writeBuffer 的 depthTexture）；直出路径（低端机/reduced-motion）
       无 RT 深度可读 → OutlinePass 自建半分辨率预填兜底。 */
    if (this.bloomActive()) {
      this.composer.render();
      this.outlinePass.setDepthTexture(this.composer.writeBuffer?.depthTexture ?? null);
      this.renderer.clear(false, true, true);
    } else {
      this.outlinePass.setDepthTexture(null);
      this.renderer.clear(true, true, true);
      this.renderer.render(this.scene, this.camera);
    }
    /* 选中对象外轮廓（遮罩膨胀合成；主帧最后一遍绘制） */
    this.outlinePass.render(this.renderer, this.camera, this.outlineState, this.scene);
  };

  /** 每帧装配卡片：每只渲染的蜂一个小气泡（3D→2D 逐帧投影）；蜜杯 hover 出只读卡。
      容器 rect 每帧读取一次传参贯穿（render-perf-optimization D8：SHALL NOT 逐蜂
      getBoundingClientRect 强制同步布局）；远档蜂气泡剔除（例外集见 isBubbleVisible）。 */
  updateCards() {
    const entries = [];
    const world = this.world;
    if (world) {
      const rootRect = this.cardRoot.getBoundingClientRect(); // 每帧至多一次布局测量
      const droneMode = this.settings?.drones ?? "active-only";
      /* 巢内蜂：每只一个小气泡（展开态由 CardLayer 按 expandedKey 决定）；
         被显隐过滤的降级停驻蜂同谓词跳过（审阅 F4：SHALL NOT 留幽灵气泡）；
         远档（T2）且非例外集的蜂跳过投影计算且不产出 entries（D8 气泡剔除）。 */
      for (const studio of world.studios) {
        for (const bee of studio.bees) {
          if (!isCardBeeVisible(bee, droneMode)) continue;
          const anchored =
            bee.sessionId === this.selectedSessionId ||
            Boolean(this.hover && (this.hover.kind === "bee" || this.hover.kind === "drone") && this.hover.id === bee.sessionId) ||
            bee.sessionId === this.cards?.expandedKey;
          const record = this.bees.beeMap.get(bee.sessionId);
          if (!isBubbleVisible(record?.tier, anchored)) continue;
          const screen = this.projectToScreen(bee.sessionId, 0, false, rootRect); // 锚点已含悬挂偏移（CARD_ANCHOR_LIFT）
          if (screen.x === null) continue;
          entries.push({
            key: bee.sessionId,
            kind: "bee",
            screen,
            face: { sessionId: bee.sessionId, displayTitle: bee.displayTitle, updatedAt: bee.updatedAt, todos: bee.todos },
            state: bee.state,
            droneCount: bee.drones.length,
            activeDroneCount: bee.activeDroneCount ?? 0, // 活跃/总数口径（D6，卡片层免每帧扫描）
            runningDescendants: bee.runningDescendants ?? 0,
            workspaceId: studio.workspaceId,
            overlay: this.beeOverlayIndex?.get(bee.sessionId) ?? null
          });
        }
      }
      /* 蜜杯 hover 只读卡 */
      if (this.hover?.kind === "cup" && this.hover.id) {
        for (const studio of world.studios) {
          const cup = studio.cups.find((c) => c.sessionId === this.hover.id);
          if (cup) {
            const screen = this.projectToScreen(cup.sessionId, -1.2, true, rootRect);
            if (screen.x !== null) {
              entries.push({
                key: "cup:" + cup.sessionId,
                kind: "cup",
                screen,
                full: true,
                face: { sessionId: cup.sessionId, displayTitle: cup.displayTitle, updatedAt: cup.updatedAt },
                state: null,
                droneCount: 0,
                runningDescendants: 0
              });
            }
          }
        }
      }
    }
    this.cards.update(entries);
  }

  /** 3D→屏幕投影 scratch 向量（模块级复用——每蜂每帧分配已消除，render-perf D8）。 */
  _projectScratch = new THREE.Vector3();

  /** 蜂的 3D 位置 → 卡片容器局部屏幕坐标（beeMap 无记录或被相机背切 → x:null 隐藏）。
      rect 由调用方传入（每帧单次布局测量复用；缺省时自读——非逐帧调用点兼容）。 */
  projectToScreen(sessionId, offsetY = 0, belowFloor = false, rect = null) {
    const record = this.bees.beeMap.get(sessionId);
    if (!record && !belowFloor) return { x: null, y: null };
    let wx;
    let wz;
    let y;
    if (belowFloor) {
      /* 蜜杯：挂在巢内 0 号格正下方 */
      const cupWorld = this.cupAnchorOf(sessionId);
      if (!cupWorld) return { x: null, y: null };
      wx = cupWorld.x;
      wz = cupWorld.z;
      y = -1.35;
    } else {
      wx = record.world.x;
      wz = record.world.z;
      /* 悬挂锚点：蜂体上缘（半高 0.6×BEE_RADIUS）+ 间隙 0.05×BEE_RADIUS，垂直分量
         跟随当帧姿态（record.pose 由 bees.frame 每帧写入），水平钉蜂位格心不随摇摆 */
      y = (record.pose?.y ?? record.baseY ?? record.world.y) + CARD_ANCHOR_LIFT + offsetY;
    }
    const vector = this._projectScratch.set(wx, y, wz).project(this.camera);
    if (vector.z > 1) return { x: null, y: null };
    const r = rect ?? this.cardRoot.getBoundingClientRect();
    return {
      x: ((vector.x + 1) / 2) * r.width,
      y: ((-vector.y + 1) / 2) * r.height
    };
  }

  /** 蜜杯的世界锚点（该蜜杯所属巢的中心格下方）。 */
  cupAnchorOf(sessionId) {
    for (const studio of this.world?.studios ?? []) {
      if (studio.cups.some((c) => c.sessionId === sessionId)) return worldOf(studio.center);
    }
    return null;
  }

  resize() {
    if (this.disposed) return;
    const w = this.host.clientWidth || 1;
    const h = this.host.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.outlinePass.setSize(w, h, this.renderer.getPixelRatio());
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(w, h);
    }
  }

  /** 坞重新挂载时把既有 canvas/卡片层迁入新宿主（坞关/开/全屏共享同一场景与相机，D7）。 */
  reattach(host) {
    if (!host || this.disposed || host === this.host) return;
    this.host = host;
    host.appendChild(this.canvas);
    host.appendChild(this.vignette);
    host.appendChild(this.cardRoot);
    host.appendChild(this.tips.root); // tips 层随坞迁移（cardRoot 兄弟层）
    this.ro.disconnect();
    this.ro.observe(host);
    this.resize();
  }

  /** 相机偏好落盘（外壳防抖调用）。 */
  cameraPose() {
    return this.rig.pose();
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.ro.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.gestures.dispose();
    this.cards.dispose();
    this.tips.dispose(); // 悬停 tips 层（DOM 根移除，hive-interaction-polish 6.1）
    this.links?.dispose(); // 连线层（几何/材质出场景，hive-interaction-polish 7.1）
    this._preview?.renderer.dispose(); // 预览快照上下文（独立小上下文，SHALL NOT 泄漏）
    this._preview?.renderer.forceContextLoss?.();
    this._preview = null;
    this.bees.dispose();
    this.sky.dispose();
    this.motes?.dispose();
    this.hexFx?.dispose(); // 光墙特效层（几何/全部材质/网格出场景，hex-rise-fx）
    this.bloomPass?.dispose?.();
    this.composer?.dispose();
    /* 统一选中遮罩（studio/cup/tile 网格 + 共享 maskScene/maskMaterial/studioMaskMaterial）。 */
    for (const key of Object.keys(this.selectionMask)) {
      this.disposeObject(this.selectionMask[key]);
      this.selectionMask[key] = null;
    }
    this.maskMaterial.dispose();
    this.studioMaskMaterial.dispose();
    this.outlinePass.dispose();
    this.cups.dispose();
    this.walls.dispose();
    this.watermark?.dispose(); // 底图水印层（几何/材质/纹理，hive-watermark）
    this.territory.dispose();
    this.tileField.dispose();
    this.renderer.dispose();
    this.canvas.remove();
    this.vignette.remove();
    this.cardRoot.remove();
  }
}

/** sessionId → 稳定动画相位（避免整群同拍）。 */
function hashPhase(id) {
  let hash = 0;
  const text = String(id);
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return ((hash % 6283) / 1000);
}

export { hexKey };
