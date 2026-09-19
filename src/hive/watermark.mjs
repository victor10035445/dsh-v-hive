/**
 * 底图水印层（hive-watermark，design.md D1–D5/D7）：
 *  - 形态：每巢一块平贴地面水印贴片（灰色圆角衬底 + 大号浅灰文字），固定世界尺寸
 *    3.6×1.3（SHALL NOT 随领地层数缩放），y=0.018 严格介于领地地板 0.012 与选中遮罩
 *    0.024 之间，renderOrder 3（领地 2 之后、蜂 10 之前）；transparent + depthWrite:false；
 *    无 emissive（灰底水印非发光体，Bloom 阈值不捕捉——「霓虹 SHALL NOT 落在公共地面」）。
 *  - 文字（D5）：默认 = 工作区路径最后一级目录名（`[\\/]+` 切分，兼容正反斜杠与尾分隔符），
 *    回落链 path 末段 → title → workspaceId；measureText 等比充满牌宽（含内边距，长名不
 *    截断、短名同放大）；512×192 CanvasTexture（纵横比 2.67 ≈ 牌面 2.77，texel 近方形防
 *    文字纵向拉伸，R4）；色源 PALETTE.watermarkPlate / watermarkText（色彩脚本单一出处）。
 *  - 摆放（D3）：前脸面 = 法线并列（点积 > cos30°）的边界边族；贴片锚定该族**外沿墙线段**
 *    质心 + 外法线 × 0.35。勘误注：L≥2 领地的并列法线族实为阶梯锯齿轮廓（如 L=3 的 +z 族
 *    是 3 级台阶 5 条边，并非共面 2 条）——外沿段即 D3 两带论证的「本巢墙线」参照线
 *    （贴片中心在外墙线外侧、超出至多 0.35+1.3/2=1.0 的论证以此线为基准）；L=1 单巢与
 *    共面族退化为普通面质心，spec「得分并列的外边界边段取其面质心」在此精确化。
 *    牌短轴沿外法线、长轴平行墙线（rotation.y 对齐前脸法线），纹理「上」朝巢心
 *    （从前脸外侧俯读时字面朝上）。
 *  - 跳边（D4/R2）：余量滞回——新面得分 > 当前面**在新镜头方向下的重评分** × 1.12 才切换
 *    （分母是当前面重评分而非旧值，R7；防邻面得分交叠区抖动）+ 节流（theta 变化 > 6° 或
 *    相机水平位移 > 2 世界单位或签名变化才重算——pan/zoom 同样改变「巢中心→相机」方向）；
 *    跳边淡切 = alpha 降 120ms → 重定位 → 升 180ms；reduced-motion 瞬切。
 *  - 纯视觉层：不入 maskScene、不进 interact 拾取集合（scene 装配保证）——描边与指针交互
 *    天然穿透；整层显隐仅由页级开关控制（D6；相机俯仰锁定后无翻底视角，「翻底隐藏」
 *    语义已随相机手势重排移除）。
 *  - 重建签名（D2/R3）：studioSig + 文字源哈希——搬巢/扩环/增删巢才重建贴片实例，
 *    改名（path/title 变化）只重绘纹理；贴片实例与纹理正确 dispose。
 *  - 上下文恢复：canvas/几何保留 CPU 侧数据，webglcontextrestored 后 three 首次渲染
 *    自动重上传（D2，无需进入 rebuildComposer 式特殊重建）。
 */
import * as THREE from "three";
import { PALETTE } from "./palette.mjs";

/* ── 常量集中（design.md D2–D4，目检初值，单点调参） ── */
export const WATERMARK_WIDTH = 3.6; // 牌宽（固定世界尺寸，不随领地层数缩放）
export const WATERMARK_HEIGHT = 1.3; // 牌高（短轴，沿外法线方向）
export const WATERMARK_Y = 0.018; // 领地地板 0.012 与选中遮罩 0.024 之间（避 z-fighting）
export const WATERMARK_RENDER_ORDER = 3; // 领地(2)之后、蜂(10)之前（hex-fx 15 之前）
export const NORMAL_OFFSET = 0.35; // 面外沿墙线沿外法线的外移量（牌体大部落墙线外侧）
export const SWITCH_MARGIN = 1.12; // 滞回余量（新面得分 > 当前重评分 ×1.12 才切）
export const THETA_TRIGGER = 6 * (Math.PI / 180); // 方向节流：theta 变化 > 6° 重算
export const POS_TRIGGER = 2; // 位移节流：相机水平位移 > 2 世界单位重算
export const FADE_OUT_MS = 120; // 淡切：alpha 降时长
export const FADE_IN_MS = 180; // 淡切：alpha 升时长
export const FACE_MERGE_COS = Math.cos(Math.PI / 6); // 法线点积 > cos30° 聚面（六向族间隔 60°，余量充分）
const FACE_IDENTITY_COS = 0.999; // 当前面按法线身份匹配（同族点积 ≈1，邻族 = cos60° = 0.5）

const PLATE_CANVAS_W = 512; // 纹理宽（纵横比 2.67 ≈ 牌面 3.6/1.3 = 2.77，texel 近方形）
const PLATE_CANVAS_H = 192;
const PLATE_MARGIN = 8; // canvas 内衬底外边距（透明）
const PLATE_RADIUS = 26; // 衬底圆角
const PLATE_ALPHA = 0.78; // 衬底不透明度（画进纹理；材质 opacity 仅作淡切乘子）
const TEXT_PAD_X = 26; // 文字左右内边距（等比充满的可用宽 = 牌宽 − 2×内边距）
const TEXT_BASE_PX = 120; // 文字基准字号（measureText 后按可用宽等比缩放）
const TEXT_FONT_STACK = '600 {SIZE}px "Segoe UI", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';

/** 字号 → canvas font 串。 */
function fontOf(size) {
  return TEXT_FONT_STACK.replace("{SIZE}", String(size));
}

/** 16 进制数字 → rgba() 画笔串（色值出自 PALETTE，透明度是绘制参数）。 */
function rgba(hex, alpha) {
  const n = Number(hex) & 0xffffff;
  return "rgba(" + ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255) + ", " + alpha + ")";
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/** 角差（弧度，归一 0..π，处理 ±π 回绕）。 */
function angleDelta(a, b) {
  let d = Math.abs(a - b) % (2 * Math.PI);
  if (d > Math.PI) d = 2 * Math.PI - d;
  return d;
}

/** 圆角矩形路径（四角 arc，Node 桩环境同样可执行）。 */
function roundedRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arc(x + w - rr, y + rr, rr, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arc(x + w - rr, y + h - rr, rr, 0, Math.PI / 2);
  ctx.lineTo(x + rr, y + h);
  ctx.arc(x + rr, y + h - rr, rr, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + rr);
  ctx.arc(x + rr, y + rr, rr, Math.PI, (3 * Math.PI) / 2);
  ctx.closePath();
}

/**
 * 水印文字（D5，纯函数）：路径末段 → 标题 → workspaceId 回落链。
 * `split(/[\\/]+/)` 兼容正反斜杠与尾分隔符（空段过滤后取末段）。
 */
export function watermarkText(path, title, workspaceId) {
  if (typeof path === "string" && path.length > 0) {
    const parts = path.split(/[\\/]+/).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  if (typeof title === "string" && title.trim().length > 0) return title.trim();
  return String(workspaceId ?? "");
}

/**
 * 前脸面集合（D3，纯函数）：边界边按法线并列（点积 > cos30°）聚族，逐族返回
 * { centroid, normal, score }：
 *  - score = 族内最高分边得分（外法线 ·「领地中心 → 相机」水平单位向量；同族法线并列，得分近同）；
 *  - centroid = 族内**外沿墙线段**（沿法线投影最大者，浮点容差聚合）的边中点平均——
 *    L≥2 的并列族是阶梯锯齿轮廓，外沿段即 D3 两带论证的「本巢墙线」参照线；
 *    L=1 单巢 / 共面族时全体边同线，退化为普通面质心；
 *  - normal = 族法线（取最高分边法线，六向族内逐边一致）。
 * 选面而非单边：并列边聚合避免取点偏离脸心（spec「得分并列的外边界边段取其面质心」）。
 * @returns {Array<{centroid:{x:number,z:number}, normal:{x:number,z:number}, score:number}>}
 */
export function frontFacesOf(edges, camX, camZ, centerX, centerZ) {
  if (!Array.isArray(edges) || edges.length === 0) return [];
  let dirX = camX - centerX;
  let dirZ = camZ - centerZ;
  const len = Math.hypot(dirX, dirZ);
  if (len < 1e-6) {
    dirX = 1; // 相机正上方退化（极角下限 10° 实际不达）：取 +x 保持确定性
    dirZ = 0;
  } else {
    dirX /= len;
    dirZ /= len;
  }
  /* 聚族：法线并列（点积 > cos30°）的边界边为同一前脸面（六向族间隔 60°，无歧义链并） */
  const groups = []; // { nx, nz, best:{score,nx,nz}|null, members:[{mx,mz,proj}] }
  for (const e of edges) {
    if (!e || !Number.isFinite(e.mx) || !Number.isFinite(e.mz) || !Number.isFinite(e.dx) || !Number.isFinite(e.dz)) continue;
    let group = null;
    for (const g of groups) {
      if (g.nx * e.dx + g.nz * e.dz > FACE_MERGE_COS) {
        group = g;
        break;
      }
    }
    if (!group) {
      group = { nx: e.dx, nz: e.dz, best: null, members: [] };
      groups.push(group);
    }
    const score = e.dx * dirX + e.dz * dirZ;
    group.members.push({ mx: e.mx, mz: e.mz, proj: e.mx * group.nx + e.mz * group.nz });
    if (!group.best || score > group.best.score) group.best = { score, nx: e.dx, nz: e.dz };
  }
  const faces = [];
  for (const g of groups) {
    if (!g.best || g.members.length === 0) continue;
    /* 外沿墙线段：沿法线投影最大者（容差聚合浮点噪声）；L≥2 阶梯族的外沿台阶 */
    let maxProj = -Infinity;
    for (const m of g.members) if (m.proj > maxProj) maxProj = m.proj;
    let sumX = 0;
    let sumZ = 0;
    let count = 0;
    for (const m of g.members) {
      if (m.proj < maxProj - 1e-6) continue;
      sumX += m.mx;
      sumZ += m.mz;
      count += 1;
    }
    faces.push({
      centroid: { x: sumX / count, z: sumZ / count },
      normal: { x: g.best.nx, z: g.best.nz },
      score: g.best.score
    });
  }
  return faces;
}

/**
 * 最高分前脸面（任务 1.2 纯函数签名）：frontFacesOf 中得分最高者
 *（并列时保持首见——确定性；滞回层负责并列不抖动）。
 * @returns {{centroid:{x,z}, normal:{x,z}, score:number}|null}
 */
export function frontFaceOf(edges, camX, camZ, centerX, centerZ) {
  const faces = frontFacesOf(edges, camX, camZ, centerX, centerZ);
  let top = null;
  for (const f of faces) {
    if (!top || f.score > top.score) top = f;
  }
  return top;
}

/**
 * 滞回跳边判定（D4，纯函数）：仅当新面得分 > 当前面得分 × margin 时切换。
 * 当前面为空（首次定位）→ 切换；候选面为空 → 不切换。
 * 分母安全（R7）：调用方以下「当前面在新镜头方向下的重评分」为基准——六向法线中必有
 * 与指向相机方向夹角 ≤ 30° 者使候选面得分恒 ≥ cos30°；当前面重评分走低时切换更易，无趋零风险。
 */
export function shouldSwitchFace(current, candidate, margin = SWITCH_MARGIN) {
  if (!candidate) return false;
  if (!current) return true;
  return candidate.score > current.score * margin;
}

/** 文字源（D5 回落链结果）——进重建签名：改名改变显示文字即触发重绘（R3）。 */
function textSigOf(studio) {
  return watermarkText(studio.path, studio.title, studio.workspaceId);
}

/**
 * 底图水印层（D1：独立层模块，对齐 cups/motes 生命周期）。
 * scene 装配：构造 / rebuildAll 透传 studioLayers（含 path/title）/ 渲染循环 frame /
 * setSettings 开关 / dispose。
 */
export class WatermarkLayer {
  /**
   * @param {object} scene THREE.Scene（或提供 add/remove 的宿主，供冒烟注入）
   */
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = "watermark";
    scene.add(this.group);
    /* 共享几何：各巢牌面同尺寸，PlaneGeometry 一次烘焙平贴（法线 +y，先例 hexGeometry） */
    this.plateGeo = new THREE.PlaneGeometry(WATERMARK_WIDTH, WATERMARK_HEIGHT);
    this.plateGeo.rotateX(-Math.PI / 2);
    this.items = new Map(); // workspaceId → { studio, mesh, material, texture, canvas, ctx, text, fade }
    this.visibleOn = true; // 页级开关（D6，整层显隐唯一来源——翻底隐藏已随俯仰锁定移除）
    this.sig = null; // 重建签名 = studioSig + 文字源哈希（D2/R3）
    this.studioSig = null;
    /* 跳边状态（D4）：滞回当前面 + 节流基线（自上次重算起累计） */
    this.currentFace = new Map(); // workspaceId → face（滞回基准，按法线身份重评）
    this.lastTheta = null;
    this.lastCamX = null;
    this.lastCamZ = null;
    this.lastFrameSig = null;
    this.lastTime = null; // 内部 dt（frame 签名固定不自场景取 dt；页签隐藏暂停后钳制 64ms）
    this.recomputes = 0; // 全体重算次数（诊断/冒烟观测点，不影响生产行为）
  }

  /**
   * 巢集合（scene.studioLayers：{workspaceId, center, layer, worldCenter, edges, path, title}）。
   * 重建签名 = studioSig + 文字源哈希：studioSig 变化（搬巢/扩环/增删巢）→ 重建贴片实例；
   * 仅文字源变化（改名）→ 原位重绘纹理（R3：studioSig 不含 path/title，改名静默）。
   * rebuildAll 每 tick 调用——签名短路与早期返回保证高频安全。
   */
  setStudios(studios) {
    const list = Array.isArray(studios) ? studios : [];
    const studioSig = list
      .map((s) => s.workspaceId + ":" + s.layer + ":" + s.center.q + "," + s.center.r)
      .join("|");
    const textSig = list.map((s) => s.workspaceId + "=" + textSigOf(s)).join("|");
    const sig = studioSig + "\u241f" + textSig;
    if (sig === this.sig) return;
    const rebuilt = studioSig !== this.studioSig;
    this.sig = sig;
    this.studioSig = studioSig;
    if (rebuilt) {
      this.rebuild(list);
    } else {
      /* 仅文字变化：命中的巢重绘，其余刷新 studio 引用（edges/worldCenter 随重建更新） */
      for (const s of list) {
        const item = this.items.get(s.workspaceId);
        if (!item) continue;
        item.studio = s;
        const text = textSigOf(s);
        if (item.text !== text) {
          item.text = text;
          this.drawPlate(item);
        }
      }
    }
    this.currentFace.clear(); // 前脸面引用随 edges/studio 刷新，下帧强制重算定位
    this.lastFrameSig = null; // 签名变化 → 下帧免节流强制重算（D4/R2）
  }

  /** 全体重建（studioSig 变化）：旧实例/材质/纹理先 dispose，逐巢新建贴片。 */
  rebuild(list) {
    this.clearItems();
    for (const s of list) {
      if (!s || !s.center || !Array.isArray(s.edges) || s.edges.length === 0) continue;
      const canvas = document.createElement("canvas");
      canvas.width = PLATE_CANVAS_W;
      canvas.height = PLATE_CANVAS_H;
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8; // 斜视地面文字不发虚（地板纹理同款）
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide
      });
      const mesh = new THREE.Mesh(this.plateGeo, material);
      mesh.renderOrder = WATERMARK_RENDER_ORDER;
      mesh.visible = false; // 首次定位前不渲染（防 (0,0) 原点残影）
      this.group.add(mesh);
      const item = {
        studio: s,
        mesh,
        material,
        texture,
        canvas,
        ctx: canvas.getContext("2d"),
        text: textSigOf(s),
        fade: { stage: "idle", t: 0, pending: null }
      };
      this.drawPlate(item);
      this.items.set(s.workspaceId, item);
    }
  }

  /** 释放全部贴片实例（材质/纹理；共享几何由 dispose 统一释放）。 */
  clearItems() {
    for (const item of this.items.values()) {
      this.group.remove(item.mesh);
      item.material.map?.dispose?.();
      item.material.dispose();
      item.texture.dispose();
    }
    this.items.clear();
  }

  /** 程序纹理绘制（D2/D5）：灰色圆角衬底 + 浅灰大字，measureText 等比充满牌宽（含内边距）。 */
  drawPlate(item) {
    const ctx = item.ctx;
    if (!ctx) return; // 无 2D 上下文（异常环境）：贴片退化为纯几何，不绘制
    const W = item.canvas.width;
    const H = item.canvas.height;
    ctx.clearRect(0, 0, W, H);
    /* 衬底：深灰基板上的半透明灰圆角牌（色出 PALETTE.watermarkPlate，非发光体） */
    ctx.fillStyle = rgba(PALETTE.watermarkPlate, PLATE_ALPHA);
    roundedRectPath(ctx, PLATE_MARGIN, PLATE_MARGIN, W - PLATE_MARGIN * 2, H - PLATE_MARGIN * 2, PLATE_RADIUS);
    ctx.fill();
    /* 文字：等比缩放充满可用宽（长名不截断、短名同放大保持「大」的观感一致，D5）；
       字号上钳到牌高内（短名放大受高度约束）、下钳防退化 */
    const text = item.text ?? "";
    const padX = PLATE_MARGIN + TEXT_PAD_X;
    const maxWidth = W - padX * 2;
    const maxFont = H - (PLATE_MARGIN + 18) * 2;
    let fontSize = TEXT_BASE_PX;
    if (text.length > 0 && maxWidth > 0) {
      ctx.font = fontOf(fontSize);
      const measured = ctx.measureText(text).width;
      if (measured > 0) fontSize = clamp((fontSize * maxWidth) / measured, 6, maxFont);
    }
    ctx.font = fontOf(fontSize);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = rgba(PALETTE.watermarkText, 1);
    ctx.fillText(text, W / 2, H / 2 + 2); // +2 视觉基线微调
    item.texture.needsUpdate = true;
  }

  /**
   * 定位贴片（D3）：外沿墙线段质心 + 外法线偏移；牌短轴沿外法线（长轴平行墙线，
   * 两带论证前提）；rotation.y = atan2(nx, nz) 使纹理「上」朝巢心——从前脸外侧俯读字面朝上。
   */
  placeItem(item, face) {
    const x = face.centroid.x + face.normal.x * NORMAL_OFFSET;
    const z = face.centroid.z + face.normal.z * NORMAL_OFFSET;
    item.mesh.position.set(x, WATERMARK_Y, z);
    item.mesh.rotation.y = Math.atan2(face.normal.x, face.normal.z);
    item.mesh.visible = true;
  }

  /**
   * 每帧更新（D4）：页级开关门控 → 淡切推进（每帧，不受节流影响）→
   * 节流门限（theta > 6° / 水平位移 > 2 / 签名变化，自上次重算起累计）→ 全体巢前脸重算 +
   * 滞回跳边。节流基线仅在重算时更新（慢漂移累计同样触发，不滞留旧牌）。
   */
  frame(camera, reducedMotion) {
    this.group.visible = this.visibleOn && this.items.size > 0;
    if (!this.group.visible) return;

    const now = performance.now();
    let dt = 16;
    if (this.lastTime != null) dt = clamp(now - this.lastTime, 0, 64);
    this.lastTime = now;

    /* 淡切推进（每帧；reduced-motion 立即落定瞬切） */
    for (const item of this.items.values()) {
      if (item.fade.stage === "idle") continue;
      if (reducedMotion) this.settleFade(item);
      else this.advanceFade(item, dt);
    }

    /* 节流门限（D4）：每帧 O(1) 检查，触发才全体 O(总边数) 点积重算 */
    const camX = camera.position.x;
    const camZ = camera.position.z;
    const theta = Math.atan2(camZ, camX);
    const sigChanged = this.sig !== this.lastFrameSig;
    const thetaMoved = this.lastTheta != null && angleDelta(theta, this.lastTheta) > THETA_TRIGGER;
    const posMoved = this.lastCamX != null && Math.hypot(camX - this.lastCamX, camZ - this.lastCamZ) > POS_TRIGGER;
    if (!sigChanged && !thetaMoved && !posMoved) return;
    this.lastTheta = theta;
    this.lastCamX = camX;
    this.lastCamZ = camZ;
    this.lastFrameSig = this.sig;
    this.recomputes += 1;

    for (const [id, item] of this.items) {
      const s = item.studio;
      const faces = frontFacesOf(s.edges, camX, camZ, s.worldCenter.x, s.worldCenter.z);
      if (faces.length === 0) continue;
      const current = this.currentFace.get(id) ?? null;
      /* 候选 = 最高分面；当前面按法线身份在新镜头方向下重评（滞回分母非旧值，D4/R7） */
      let candidate = null;
      let currentFresh = null;
      for (const f of faces) {
        if (!candidate || f.score > candidate.score) candidate = f;
        if (current && f.normal.x * current.normal.x + f.normal.z * current.normal.z > FACE_IDENTITY_COS) {
          currentFresh = f;
        }
      }
      const baseline = current ? currentFresh ?? { score: -1 } : null;
      if (!shouldSwitchFace(baseline, candidate)) continue; // 滞回：余量不足不动（防邻面抖动）
      this.currentFace.set(id, candidate);
      if (reducedMotion || !current || item.fade.stage !== "idle") {
        this.settleFade(item); // 首次定位 / 降级 / 淡切中再切：瞬切落定
        this.placeItem(item, candidate);
      } else {
        item.fade = { stage: "out", t: 0, pending: candidate }; // alpha 降 → 重定位 → 升（D4）
      }
    }
  }

  /** 淡切瞬落（reduced-motion / 淡切中再切 / 首次定位前清理）：立即重定位并恢复全亮。 */
  settleFade(item) {
    const fade = item.fade;
    if (fade.stage === "out" && fade.pending) this.placeItem(item, fade.pending);
    fade.stage = "idle";
    fade.t = 0;
    fade.pending = null;
    item.material.opacity = 1;
  }

  /** 淡切推进（D4）：alpha 降 FADE_OUT_MS → 重定位 → 升 FADE_IN_MS（整程 ≈300ms）。 */
  advanceFade(item, dt) {
    const fade = item.fade;
    fade.t += dt;
    if (fade.stage === "out") {
      const k = Math.min(1, fade.t / FADE_OUT_MS);
      item.material.opacity = 1 - k;
      if (k >= 1) {
        this.placeItem(item, fade.pending);
        fade.stage = "in";
        fade.t = 0;
      }
    } else {
      const k = Math.min(1, fade.t / FADE_IN_MS);
      item.material.opacity = k;
      if (k >= 1) {
        fade.stage = "idle";
        fade.t = 0;
        fade.pending = null;
      }
    }
  }

  /** 页级显隐开关（D6）：整层唯一显隐来源（俯仰锁定后无翻底视角），即时生效。 */
  setVisible(on) {
    this.visibleOn = Boolean(on);
  }

  /** 释放全部几何/材质/纹理（共享几何一次），网格出场景。 */
  dispose() {
    this.clearItems();
    this.plateGeo.dispose();
    this.scene.remove(this.group);
    this.items = new Map();
  }
}
