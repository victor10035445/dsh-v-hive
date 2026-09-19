/**
 * 手势仲裁与拾取（design.md D6 / spec「相机与手势仲裁」；相机手势重排 D1/D8；
 * hive-interaction-polish 4.1/D2；hive-marquee-and-card-rework 2.1/2.2）：
 *  - 按落点路由：左键 = 对象手势专用——单击 = 选中（**无人机/降级停驻蜂除外：单击
 *    无动作**，悬停 tips 与双击聚焦保持）；拖蜂 = 拖蜂（换巢协议）；
 *    编辑开 + 拖「已选中」巢 = 搬巢；左键从空白瓦片/地板/未选中巢拖拽 = **框选
 *    marquee**（预留键位正式启用，2.1：只报矩形，命中计算归 scene；蜜杯/天空落点
 *    维持无动作不入起手——F11）；
 *  - 右键拖 = 双态相机手势（D1）：工具条「右键旋转」开关开 = spin 方位旋转
 *    （垂直分量丢弃，俯仰锁定）、关（默认）= pan 全向平移（水平左右 + 垂直前后）；
 *    定型时刻读开关，拖拽中途切开关不改变当前手势；右键单击（未过阈值）= 巢/蜂
 *    右键菜单，不受开关影响；中键拖 = pan 兜底平移（任意开关态）；滚轮（含触控板
 *    捏合 ctrl+wheel）= 指针处缩放；单击 = 选中；拾取优先级 蜜蜂 > 巢 > 瓦片，
 *    ≥5px 位移阈值区分点击/拖拽；
 *  - 拖拽一律 setPointerCapture，pointercancel / Escape 统一取消（防指针移出画布
 *    后拖拽悬挂）；
 *  - 搬巢 ghost：红/绿高亮 + 吸附，落定校验（hexDist 公式）回调宿主写布局；
 *  - 拖拽落点回调（hex-rise-fx，可选）：studio/bee 模式落点格计算处通知 onDragCell(cell)，
 *    finish() 全部路径（落定/取消/pointercancel）与 Esc 分支各触发一次 onDragEnd()（宿主侧幂等）；
 *  - marquee 回调（2.1）：拖拽中 onMarqueeMove(rect)（canvas 本地坐标系，矩形归一化）、
 *    release onMarqueeEnd(rect)、Esc/pointercancel onMarqueeCancel()——cancel/End 互斥
 *    且各恰一次；选框 DOM 与命中预览由 scene/外壳消费。
 */
import * as THREE from "three";
import { cellOf, worldOf, canCoexist, hexKey } from "../hex.mjs";

const DRAG_THRESHOLD = 5;

/** 框选矩形（canvas 本地坐标，min/max 归一化；2.1 纯函数便于测试复用）。 */
function marqueeRectOf(a, b) {
  return {
    x0: Math.min(a.x, b.x),
    y0: Math.min(a.y, b.y),
    x1: Math.max(a.x, b.x),
    y1: Math.max(a.y, b.y)
  };
}

export class GestureController {
  constructor({ canvas, scene, camera, rig, tileField, territory, walls, bees, cups, studioLayersOf, occupancyOf, editModeOf, spinModeOf, selectionOf, callbacks }) {
    this.canvas = canvas;
    this.scene = scene;
    this.camera = camera;
    this.rig = rig;
    this.tileField = tileField;
    this.territory = territory;
    this.walls = walls;
    this.bees = bees;
    this.cups = cups;
    this.studioLayersOf = studioLayersOf; // () => [{workspaceId, center, layer}]
    this.occupancyOf = occupancyOf; // () => Map(hexKey → workspaceId)
    this.editModeOf = editModeOf ?? (() => false); // () => bool（蜂巢编辑开关）
    this.spinModeOf = spinModeOf ?? (() => false); // () => bool（右键旋转开关，D1：定型时刻读取）
    this.selectionOf = selectionOf ?? (() => null); // () => {kind, id} | null
    this.callbacks = callbacks;
    this.raycaster = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.mode = null; // 'pan' | 'spin' | 'studio' | 'bee' | 'marquee' | null
    this.downButton = 0; // 按下时的键位：pointermove 的 event.button 恒为 -1（仅表示状态切换），定型必须用它
    this.downPoint = null;
    this.lastPoint = null;
    this.downHit = null;
    this.moved = false;
    this.ghost = null;
    this.dragBee = null;
    this.hover = null; // { kind, id }
    this.attached = this.attach();
  }

  /* ── 指针 → NDC / 视口矩形 ── */

  pointOf(event) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, rect };
  }

  setNdc(p, camera) {
    this.ndc.set((p.x / p.rect.width) * 2 - 1, -(p.y / p.rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, camera ?? this.camera);
  }

  /* ── 拾取（优先级：蜜蜂 > 蜜杯 > 巢墙/巢内地板 > 瓦片） ── */

  pick(p) {
    this.setNdc(p);
    // 蜜蜂（LOD 三档 per-tier 桶网格：跨网格取**最近**命中——桶拆分后网格顺序不再对应
    // 距离；(mesh, instanceId) → 桶记录表解析，三档拾取语义一致）
    let bestBee = null;
    for (const mesh of this.bees.pickMeshes()) {
      const hits = this.raycaster.intersectObject(mesh, false);
      if (hits.length > 0 && (!bestBee || hits[0].distance < bestBee.distance)) bestBee = hits[0];
    }
    if (bestBee) {
      const record = this.bees.beeAt(bestBee.object, bestBee.instanceId);
      if (record) {
        if (record.origin === "subagent") return { kind: "drone", id: record.id, face: record, point: bestBee.point };
        return { kind: "bee", id: record.id, face: record, point: bestBee.point };
      }
    }
    // 蜜杯
    if (this.cups.mesh) {
      const hits = this.raycaster.intersectObject(this.cups.mesh, false);
      if (hits.length > 0) {
        const cup = this.cups.cupAt(hits[0].instanceId);
        if (cup) return { kind: "cup", id: cup.sessionId, face: cup, point: hits[0].point, workspaceId: cup.workspaceId };
      }
    }
    // 巢（墙 → 巢内地板）
    if (this.walls.mesh) {
      const hits = this.raycaster.intersectObject(this.walls.mesh, false);
      if (hits.length > 0) {
        const wsId = this.walls.studioAt(hits[0].instanceId);
        if (wsId) return { kind: "studio", id: wsId, point: hits[0].point };
      }
    }
    if (this.territory.floor) {
      const hits = this.raycaster.intersectObject(this.territory.floor, false);
      if (hits.length > 0) {
        const wsId = this.territory.studioAt(hits[0].instanceId);
        if (wsId) return { kind: "studio", id: wsId, point: hits[0].point };
      }
    }
    // 空瓦片/世界地板（y=0 平面求交兜底，供相机拖拽/搬巢吸附）
    const ground = this.groundPoint(p);
    if (ground) return { kind: "ground", id: null, point: ground };
    return { kind: "void", id: null, point: null };
  }

  groundPoint(p) {
    this.setNdc(p);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    return this.raycaster.ray.intersectPlane(plane, point) ? point : null;
  }

  /* ── ghost（搬巢吸附高亮） ── */

  ensureGhost() {
    if (this.ghost) return this.ghost;
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + Math.PI / 6; // 顶点 30° 族（与巢墙同向）
      const x = Math.cos(a);
      const y = Math.sin(a);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(-Math.PI / 2);
    this.ghost = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x35c26a, transparent: true, opacity: 0.38, side: THREE.DoubleSide, depthWrite: false })
    );
    this.ghost.visible = false;
    this.ghost.renderOrder = 30;
    this.scene.add(this.ghost);
    return this.ghost;
  }

  setGhost(cell, valid, radius) {
    const ghost = this.ensureGhost();
    const w = worldOf(cell);
    ghost.position.set(w.x, 0.05, w.z);
    const r = Math.max(1.2, radius ?? 2.2);
    ghost.scale.setScalar(r);
    ghost.material.color.set(valid ? 0x35c26a : 0xd64545);
    ghost.visible = true;
  }

  hideGhost() {
    if (this.ghost) this.ghost.visible = false;
  }

  /** 落点格对现有巢是否合法（含一格呼吸缝）。 */
  cellValid(cell, ignoreId, movingLayer) {
    for (const studio of this.studioLayersOf()) {
      if (studio.workspaceId === ignoreId) continue;
      if (!canCoexist(cell, movingLayer, studio.center, studio.layer, 1)) return false;
    }
    return true;
  }

  /* ── 事件 ── */

  attach() {
    const canvas = this.canvas;
    const onPointerDown = (event) => {
      if (event.button !== 0 && event.button !== 1 && event.button !== 2) return;
      const p = this.pointOf(event);
      const hit = this.pick(p);
      this.downPoint = p;
      this.lastPoint = p;
      this.downButton = event.button; // pointerdown 才带真实键位
      this.moved = false;
      this.downHit = hit;
      this.mode = null; // 位移过阈值才定型
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (event) => {
      const p = this.pointOf(event);
      /* hover 追踪（无按压时） */
      if (!this.downPoint) {
        const hit = this.pick(p);
        const kind = hit.kind;
        const id = hit.id ?? null;
        const changed = kind !== this.hover?.kind || id !== this.hover?.id;
        this.hover = { kind, id, screen: p, face: hit.face ?? null, workspaceId: hit.workspaceId ?? null };
        if (changed) this.callbacks.onHover?.(this.hover);
        else if (this.hover) this.hover.screen = p;
        let cursor = "default";
        if (kind === "bee" || kind === "drone") cursor = "pointer";
        else if (kind === "studio") {
          /* 编辑开 + hover 已选中巢 = 可搬 → move；未选中巢保持 context-menu
             （拖 = 无动作：左键已出让相机手势，相机手势重排 D8）。 */
          const sel = this.selectionOf();
          cursor = this.editModeOf() && sel?.kind === "studio" && sel.id === id ? "move" : "context-menu";
        }
        this.canvas.style.cursor = cursor;
        return;
      }
      const dx = p.x - this.lastPoint.x;
      const dy = p.y - this.lastPoint.y;
      const totalDx = p.x - this.downPoint.x;
      const totalDy = p.y - this.downPoint.y;
      if (!this.moved && Math.hypot(totalDx, totalDy) < DRAG_THRESHOLD) return;
      this.moved = true;
      /* 首次过阈值：按落点定型手势（键位取 pointerdown 记录，move 事件 button 恒为 -1） */
      if (!this.mode) {
        const hit = this.downHit;
        const button = this.downButton;
        if (button === 0 && hit.kind === "bee") {
          this.mode = "bee";
          this.dragBee = { sessionId: hit.id, from: hit.face };
          this.callbacks.onBeeDragStart?.(hit.id);
        } else if (button === 0 && hit.kind === "studio") {
          /* 搬巢门禁（design.md D6）：编辑开 + 拖「已选中」的巢才搬；未选中巢拖拽 =
             框选 marquee（2.1：预留键位正式启用，接管原「无动作」分支）。 */
          const sel = this.selectionOf();
          const canMove = this.editModeOf() && sel?.kind === "studio" && sel.id === hit.id;
          if (canMove) {
            this.mode = "studio";
            this.dragStudio = { workspaceId: hit.id };
            const studio = this.studioLayersOf().find((s) => s.workspaceId === hit.id);
            this.dragStudio.layer = studio?.layer ?? 3;
          } else {
            this.mode = "marquee";
            this.canvas.style.cursor = "crosshair";
          }
        } else if (button === 0 && hit.kind === "ground") {
          /* 空白瓦片/地板拖拽 = 框选 marquee（2.1）：左键出让相机手势的原则不变，
             预留键位正式启用（相机手势重排 D8 → hive-marquee-and-card-rework 2.1）。 */
          this.mode = "marquee";
          this.canvas.style.cursor = "crosshair";
        } else if (button === 1) {
          this.mode = "pan"; // 中键兜底全向平移（任意开关态）
        } else if (button === 2) {
          /* 右键双态（D1）：定型时刻读开关，拖拽中途切开关不影响当前拖拽。 */
          this.mode = this.spinModeOf() ? "spin" : "pan";
        }
        /* else：左键从蜜杯（维持无动作不入起手，F11）或天空 void 按下拖拽 = 无动作
          （mode 保持 null，不触发任何手势）。 */
      }
      if (this.mode === "spin") {
        this.rig.spin(dx); // 仅水平分量；dy 直接丢弃（俯仰锁定，D2）
      } else if (this.mode === "pan") {
        this.rig.pan(dx, dy);
      } else if (this.mode === "studio") {
        const ground = this.groundPoint(p);
        if (ground) {
          const cell = cellOf(ground.x, ground.z);
          this.dragStudio.cell = cell;
          this.dragStudio.valid = this.cellValid(cell, this.dragStudio.workspaceId, this.dragStudio.layer);
          this.setGhost(cell, this.dragStudio.valid, Math.sqrt(3) * (this.dragStudio.layer - 1 + 0.5));
          this.callbacks.onDragCell?.(cell); // 落点格通知（hex-rise-fx 灰墙跟随）
        }
      } else if (this.mode === "bee") {
        const ground = this.groundPoint(p);
        if (ground) {
          const cell = cellOf(ground.x, ground.z);
          this.dragBee.cell = cell;
          // 落点格所在巢（占据图查得）；未来 skill 工位在此分叉：{type:'skillSlot'}（D6）
          const occupancy = this.occupancyOf?.();
          const owner = occupancy?.get(hexKey(cell));
          this.dragBee.targetWorkspaceId = owner ?? null;
          this.setGhost(cell, true, 1.6);
          this.callbacks.onDragCell?.(cell); // 落点格通知（hex-rise-fx 灰墙跟随）
        }
      } else if (this.mode === "marquee") {
        /* 框选拖拽（2.1）：只报矩形（down → 当前点，canvas 本地坐标、min/max 归一化），
           命中计算归 scene（rAF 合帧节流在 scene 侧）。 */
        this.callbacks.onMarqueeMove?.(marqueeRectOf(this.downPoint, p));
      }
      this.lastPoint = p;
    };
    const finish = (event, cancelled) => {
      if (!this.downPoint) return;
      try {
        this.canvas.releasePointerCapture(event.pointerId);
      } catch {
        /* 已释放 */
      }
      const p = this.pointOf(event);
      const down = this.downPoint; // 框选矩形起点（downPoint 随后清空，先留档）
      const mode = this.mode;
      const hit = this.downHit;
      const moved = this.moved;
      this.downPoint = null;
      this.mode = null;
      this.canvas.style.cursor = "default";
      this.hideGhost();
      /* 拖拽结束统一通知（hex-rise-fx 灰墙消失）：finish() 全部路径（落定/取消/
         pointercancel/普通单击）各触发一次；downPoint 已清空 → 不会二次进入。 */
      this.callbacks.onDragEnd?.();
      if (cancelled) {
        if (mode === "marquee") this.callbacks.onMarqueeCancel?.(); // pointercancel：选框/预览收口（2.1）
        this.callbacks.onDragCancel?.();
        return;
      }
      if (mode === "marquee") {
        /* 框选 release（2.1）：命中计算归 scene（即时计算，不走 rAF 节流）。 */
        this.downHit = null;
        this.callbacks.onMarqueeEnd?.(marqueeRectOf(down, p));
        return;
      }
      if (mode === "studio" && this.dragStudio?.cell) {
        const { workspaceId, cell, valid } = this.dragStudio;
        this.dragStudio = null;
        if (valid) this.callbacks.onStudioMoved?.(workspaceId, cell);
        else this.callbacks.onInvalidDrop?.("studio");
        return;
      }
      if (mode === "bee" && this.dragBee) {
        const { sessionId, targetWorkspaceId, cell } = this.dragBee;
        this.dragBee = null;
        if (targetWorkspaceId) this.callbacks.onBeeDropped?.(sessionId, targetWorkspaceId, cell);
        else this.callbacks.onDragCancel?.();
        return;
      }
      /* 单击（未过阈值） */
      if (!moved) {
        const upHit = this.pick(p);
        if (event.button === 0) {
          if (upHit.kind === "bee") {
            /* 降级停驻蜂 = 无人机（droneStandIn 独立标记，SHALL NOT 动 origin 分类
               F3）：单击无动作（spec「无人机 SHALL NOT 可选中，含降级停驻蜂」）。 */
            if (!upHit.face?.droneStandIn) this.callbacks.onSelectBee?.(upHit.id, upHit.face);
          } else if (upHit.kind === "drone") {
            /* 无人机不可选中（hive-interaction-polish 4.1/D2）：单击无动作——
               onSelectDrone 调用路径移除（回调签名保留兼容）；hover tips 与双击聚焦
               保持（拾取分类/悬停分支不动，备选否决见设计 D2）。 */
          } else if (upHit.kind === "cup") {
            this.callbacks.onSelectCup?.(upHit.id, upHit.workspaceId, upHit.face);
          } else if (upHit.kind === "studio") {
            this.callbacks.onSelectStudio?.(upHit.id);
          } else if (upHit.kind === "ground") {
            /* 单击空白地面瓦片 → 按落点反算格坐标选中（design.md D4）。 */
            const cell = cellOf(upHit.point.x, upHit.point.z);
            this.callbacks.onSelectTile?.(cell);
          } else if (upHit.kind === "void") {
            /* 天空/空白 → 取消选中（design.md D7）。 */
            this.callbacks.onClearSelection?.();
          }
        } else if (event.button === 2) {
          if (upHit.kind === "studio") this.callbacks.onStudioMenu?.(upHit.id, p);
          else if (upHit.kind === "bee") this.callbacks.onBeeMenu?.(upHit.id, p);
        }
      }
      this.downHit = null;
    };
    const onPointerUp = (event) => finish(event, false);
    const onPointerCancel = (event) => finish(event, true);
    const onPointerLeave = () => {
      /* 指针离开画布：清除 hover（否则最后悬停对象的卡片/光标永久残留——悬空卡根因之一） */
      this.hover = null;
      this.downPoint = null;
      const wasMarquee = this.mode === "marquee";
      this.mode = null;
      this.canvas.style.cursor = "default";
      /* 框选拖拽中指针离画布 → 选框/预览 MUST 收口（选框 DOM 悬挂是可见缺陷）；
         studio/bee 既有静默收口行为保持不变（2.1 不侵蚀既有手势）。 */
      if (wasMarquee) this.callbacks.onMarqueeCancel?.();
      this.callbacks.onHover?.(null);
    };
    const onContextMenu = (event) => event.preventDefault();
    const onWheel = (event) => {
      event.preventDefault();
      const p = this.pointOf(event);
      const ground = this.groundPoint(p);
      const focusShift = ground
        ? new THREE.Vector3(ground.x - this.rig.target.x, 0, ground.z - this.rig.target.z).multiplyScalar(0.18)
        : null;
      this.rig.zoom(event.deltaY, focusShift);
    };
    const onDoubleClick = (event) => {
      const p = this.pointOf(event);
      const hit = this.pick(p);
      if (hit.kind === "bee" || hit.kind === "drone") {
        this.callbacks.onFocusBee?.(hit.id);
      } else if (hit.kind === "studio") {
        this.callbacks.onFocusStudio?.(hit.id);
      }
    };
    const onKeyDown = (event) => {
      /* 拖拽中 Esc 仅取消手势（2.2：mode 检查纳入 marquee——外壳 Esc 守卫经
         scene.dragInProgress 同步漏判修复，拖框中按 Esc SHALL NOT 连动关页）。 */
      if (event.key === "Escape" && (this.mode === "studio" || this.mode === "bee" || this.mode === "marquee")) {
        const marquee = this.mode === "marquee";
        this.downPoint = null;
        this.mode = null;
        this.hideGhost();
        this.canvas.style.cursor = "default";
        this.callbacks.onDragEnd?.(); // 灰墙消失（hex-rise-fx；Esc 不经 finish，单独触发一次）
        if (marquee) this.callbacks.onMarqueeCancel?.(); // 框选：清选框与预览集合，SHALL NOT 提交
        else this.callbacks.onDragCancel?.(); // 搬巢/拖蜂统一取消（含 Esc，D6）
      }
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("contextmenu", onContextMenu);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("dblclick", onDoubleClick);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("dblclick", onDoubleClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }

  dispose() {
    this.attached?.();
    if (this.ghost) {
      this.scene.remove(this.ghost);
      this.ghost.geometry.dispose();
      this.ghost.material.dispose();
    }
  }
}
