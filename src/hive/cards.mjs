/**
 * 蜜蜂卡片层（v0.2.4 改版，用户决策；bubble-anchor-and-bee-fixes 修正对齐）：
 *  - 每只渲染的蜜蜂头顶**常驻小气泡**（状态色点 + 标题摘要 + todo/无人机计数），
 *    位置逐帧跟随其 3D→2D 屏幕投影（每帧只更新 transform）；蜂卡统一 bottom-center
 *    对齐锚点（正下方中点、向上生长），蜜杯只读卡除外（top-left 向右下展开）；
 *  - 点击气泡展开为**完整卡片**（标题/状态/todo 进度/相对时间/打开·归档·折叠操作）；
 *    同屏至多一张展开卡；点击空白处、Esc 或卡上 — 收回气泡态；
 *  - 选中会话的蜂自动展开（选蜂联动）；DOM 直管不走 React 状态（避免每帧重渲染）。
 */

/**
 * 无人机角标文本（活跃/总数，drone-active-visibility D6）：总数 > 0 时返回
 * 「🐝活跃/总数」（如 🐝3/5），否则空串。口径与显隐模式正交——「全部显示」下
 * 5 只全在场，角标仍为活跃/总数（角标描述群体构成，非描述渲染模式）。
 */
export function droneBadge(entry) {
  const total = entry?.droneCount ?? 0;
  if (total <= 0) return "";
  const active = Math.min(entry?.activeDroneCount ?? total, total);
  return "🐝" + active + "/" + total;
}

/** 「折叠无人机」按钮显示条件（D6/任务 5.2）：活跃（可见）无人机数 > 0——折叠作用于
 *  可见无人机，全部休眠时按钮隐藏。collapsedParents 状态保留，toggleDroneCollapse 不动。 */
export function droneCollapseVisible(entry) {
  return (entry?.droneCount ?? 0) > 0 && (entry?.activeDroneCount ?? 0) > 0;
}

export class CardLayer {
  constructor(container, t, callbacks) {
    this.container = container;
    this.t = t;
    this.callbacks = callbacks;
    this.root = document.createElement("div");
    this.root.className = "jyv-cards";
    container.appendChild(this.root);
    this.cards = new Map(); // key → {el, sig}
    this.expandedKey = null; // 当前展开的完整卡（至多一张）
    this.lastFrame = null;
    this.lastLaneByWorkspace = {}; // 车道快照（setBeeOverlay 下发，⏸ 角标用）
    /* 点击卡外任意处（画布/工具条/页面其他区域）收回展开卡；点在卡上不收回。
       document 捕获段：canvas 是卡片层的兄弟节点，事件不会冒泡到这里。 */
    this.onDocPointerDown = (e) => {
      if (!(e.target instanceof Element) || !e.target.closest(".jyv-card")) this.setExpanded(null);
    };
    document.addEventListener("pointerdown", this.onDocPointerDown, true);
  }

  setExpanded(key) {
    if (this.expandedKey === key) return;
    this.expandedKey = key;
    if (this.lastFrame) this.update(this.lastFrame);
  }

  /** 车道等待位次（⏸ 前方 N 项；无车道信息或未等待 → -1）。 */
  lanePositionOf(entry) {
    const lane = entry?.workspaceId ? this.lastLaneByWorkspace?.[entry.workspaceId] : null;
    if (!lane) return -1;
    if (lane.holder === entry.key) return -2; // 持有中（⏸ 无数字语义）
    return lane.waiting?.findIndex((w) => w.sessionId === entry.key) ?? -1;
  }

  setLaneSnapshot(laneByWorkspace) {
    this.lastLaneByWorkspace = laneByWorkspace ?? {};
    if (this.lastFrame) this.update(this.lastFrame);
  }

  /** entries: [{key, kind:'bee'|'cup', screen:{x,y}|{x:null}, face, state, droneCount, activeDroneCount}] */
  update(entries) {
    this.lastFrame = entries;
    const wanted = new Map(entries.map((e) => [e.key, e]));
    for (const [key, card] of this.cards) {
      if (!wanted.has(key)) {
        card.el.remove();
        this.cards.delete(key);
        if (this.expandedKey === key) this.expandedKey = null;
      }
    }
    for (const entry of entries) {
      let card = this.cards.get(entry.key);
      if (!card) {
        card = { el: this.buildCard(entry) };
        this.cards.set(entry.key, card);
        this.root.appendChild(card.el);
      }
      const mode = entry.full || this.expandedKey === entry.key ? "full" : "mini";
      /* 内容仅在签名变化时重渲染；每帧只更新 transform（D5） */
      const f = entry.face ?? {};
      const overlay = entry.overlay ?? null;
      const lanePosition = this.lanePositionOf(entry);
      const sig = [
        mode, entry.kind, f.displayTitle, f.updatedAt, f.todos?.done, f.todos?.total, entry.state ?? "",
        entry.droneCount ?? 0, entry.activeDroneCount ?? 0,
        overlay?.beeTypeName ?? "", Object.keys(overlay?.vars ?? {}).length, lanePosition,
        overlay?.hatchables?.length ?? 0, overlay?.waits?.length ?? 0, overlay?.notices?.length ?? 0,
        JSON.stringify(overlay?.vars ?? {})
      ].join("|");
      if (card.el.dataset.sig !== sig) {
        this.renderCard(card.el, entry, mode);
        card.el.dataset.sig = sig;
      }
      if (entry.screen.x === null || entry.screen.x === undefined) {
        card.el.style.display = "none";
        continue;
      }
      card.el.style.display = "";
      /* 对齐模式（bubble-anchor-and-bee-fixes D2）：蜂卡（mini 与展开统一）
         bottom-center——正下方中点对齐锚点、向上生长，百分比参照元素自身盒子
         （mini auto 宽度免测量，内容变化自动重居中）；蜜杯卡（kind === 'cup'）
         保持 top-left 向右下展开（锚于蜜杯位置的既有语义）。 */
      const align = entry.kind === "cup" ? "" : " translate(-50%,-100%)";
      card.el.style.transform = "translate(" + Math.round(entry.screen.x) + "px," + Math.round(entry.screen.y) + "px)" + align;
    }
  }

  buildCard(entry) {
    const el = document.createElement("div");
    el.className = "jyv-card";
    return el;
  }

  renderCard(el, entry, mode) {
    const t = this.t;
    const face = entry.face ?? {};
    const mini = mode === "mini";
    const overlay = entry.overlay ?? null;
    const lanePosition = this.lanePositionOf(entry);
    el.className = "jyv-card" + (mini ? " jyv-cardMini" : "") + (entry.kind === "cup" ? " jyv-cardCup" : "");
    el.dataset.mode = mode;
    if (mini) {
      /* 小气泡 = 状态点芯片（+todo/无人机/蜂种/车道角标）：标题进 tooltip，点击展开完整卡。
         不放标题文字——相邻蜂的气泡会互相遮挡（蜂距 ~52px < 文字气泡宽度）。 */
      const todos = face.todos ? '<span class="jyv-bubbleTodo">' + face.todos.done + "/" + face.todos.total + "</span>" : "";
      const drones = droneBadge(entry) ? '<span class="jyv-bubbleTodo">' + droneBadge(entry) + "</span>" : "";
      /* 蜂种徽章（⟡蜂种名）与 ⏸ 车道等待角标（custom-bee-types 5.2）：默认蜂零增量 */
      const beeBadge = overlay?.beeTypeName ? '<span class="jyv-bubbleBee">⟡' + escapeHtml(overlay.beeTypeName) + "</span>" : "";
      const laneBadge =
        lanePosition >= 0
          ? '<span class="jyv-bubbleLane">⏸' + lanePosition + "</span>"
          : lanePosition === -2
            ? '<span class="jyv-bubbleLane">⏸</span>'
            : "";
      el.title = (face.displayTitle ?? "") + (entry.state ? " · " + statusText(t, entry.state) : "") + (overlay?.beeTypeName ? " · " + overlay.beeTypeName : "");
      el.innerHTML =
        '<span class="jyv-cardDot jyv-state-' + (entry.state ?? "idle") + '"></span>' + todos + drones + beeBadge + laneBadge;
      el.onclick = (event) => {
        event.stopPropagation();
        this.setExpanded(entry.key);
      };
      return;
    }
    /* 完整卡 */
    const archived = entry.kind === "cup";
    const vars = overlay?.vars ?? {};
    const varNames = Object.keys(vars);
    const notices = overlay?.notices ?? [];
    /* 蜂种徽章 + 变量徽章（如 A=add-auth-system）+ 等待状态（等待标记/等待谓词/闩锁） */
    const beeRow = overlay?.beeTypeName
      ? '<div class="jyv-cardBeeRow"><span class="jyv-cardBee">⟡' + escapeHtml(overlay.beeTypeName) + "</span>" +
        (overlay.queuePolicy === "serialized" ? '<span class="jyv-cardQueue">' + t("hive.bee.serialized") + "</span>" : "") +
        (lanePosition >= 0 ? '<span class="jyv-bubbleLane">⏸ ' + t("hive.lane.ahead").replace("{n}", String(lanePosition)) + "</span>" : "") +
        (lanePosition === -2 ? '<span class="jyv-bubbleLane">⏸ ' + t("hive.lane.holding") + "</span>" : "") +
        "</div>"
      : "";
    const varsRow = varNames.length
      ? '<div class="jyv-cardVars">' +
        varNames.map((name) => '<span class="jyv-cardVar">' + escapeHtml(name) + "=" + escapeHtml(vars[name]) + "</span>").join("") +
        (varNames.length ? '<button type="button" class="jyv-cardBtn jyv-cardVarReset" data-act="latchReset">' + t("hive.latch.reset") + "</button>" : "") +
        "</div>"
      : "";
    const waitsRow = (overlay?.waits ?? []).length
      ? '<div class="jyv-cardWaits">' +
        overlay.waits.map((w) => '<span class="jyv-cardWait">' + escapeHtml(w.name ?? w.capabilityId ?? "") + " · " + waitText(t, w.gate) + "</span>").join("") +
        "</div>"
      : "";
    const noticesRow = notices.length
      ? '<div class="jyv-cardNotices">' + notices.slice(-2).map((n) => '<span class="jyv-cardNotice">' + escapeHtml(n.text ?? "") + "</span>").join("") + "</div>"
      : "";
    /* 孵化按钮（能力捕获变量后出现；spec「孵化按钮与车道角标」）+ 车道等待取消 */
    const hatchRow = (overlay?.hatchables ?? []).length
      ? '<div class="jyv-cardHatch">' +
        overlay.hatchables.map((h) => '<button type="button" class="jyv-cardBtn jyv-cardHatchBtn" data-act="hatch" data-cap="' + escapeHtml(h.capabilityId) + '">' + t("hive.hatch").replace("{name}", escapeHtml(h.name)) + "</button>").join("") +
        (lanePosition >= 0 && entry.workspaceId ? '<button type="button" class="jyv-cardBtn" data-act="laneCancel">' + t("hive.lane.cancel") + "</button>" : "") +
        "</div>"
      : lanePosition >= 0 && entry.workspaceId
        ? '<div class="jyv-cardHatch"><button type="button" class="jyv-cardBtn" data-act="laneCancel">' + t("hive.lane.cancel") + "</button></div>"
        : "";
    const actions = archived
      ? '<div class="jyv-cardArchived">' + t("hive.archivedTag") + "</div>"
      : '<div class="jyv-cardActions">' +
        (droneCollapseVisible(entry) ? '<button type="button" class="jyv-cardBtn" data-act="collapse">' + t("hive.collapse") + "</button>" : "") +
        '<button type="button" class="jyv-cardBtn" data-act="open">' + t("hive.openSession") + "</button>" +
        '<button type="button" class="jyv-cardBtn" data-act="archive">' + t("hive.archive") + "</button></div>";
    const todos = face.todos
      ? '<div class="jyv-cardTodos"><span class="jyv-cardTodosBar"><span style="width:' +
        Math.round((face.todos.done / Math.max(1, face.todos.total)) * 100) +
        '%"></span></span><span>' +
        t("hive.todos").replace("{done}", String(face.todos.done)).replace("{total}", String(face.todos.total)) +
        "</span></div>"
      : "";
    const drones = entry.droneCount > 0
      ? '<div class="jyv-cardDrones">🐝 ×' + entry.droneCount +
        " · " + t("hive.activeCount").replace("{n}", String(entry.activeDroneCount ?? 0)) +
        (entry.runningDescendants > 0 ? " · " + t("hive.runningCount").replace("{n}", String(entry.runningDescendants)) : "") +
        "</div>"
      : "";
    el.innerHTML =
      '<div class="jyv-cardHead"><span class="jyv-cardDot jyv-state-' + (entry.state ?? "idle") + '"></span>' +
      '<span class="jyv-cardTitle" title="' + escapeHtml(face.displayTitle ?? "") + '">' + escapeHtml(face.displayTitle ?? "") + "</span>" +
      '<button type="button" class="jyv-cardPin" data-act="shrink" title="' + t("hive.shrink") + '">—</button></div>' +
      '<div class="jyv-cardMeta">' + statusText(t, entry.state) + " · " + relativeTime(t, face.updatedAt) + "</div>" +
      beeRow + varsRow + waitsRow + noticesRow + hatchRow + todos + drones + actions;
    for (const btn of el.querySelectorAll("[data-act]")) {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const act = btn.dataset.act;
        if (act === "shrink") this.setExpanded(null);
        else if (act === "open") this.callbacks.onOpen?.(entry.key);
        else if (act === "archive") this.callbacks.onArchive?.(entry.key);
        else if (act === "collapse") this.callbacks.onToggleCollapse?.(entry.key);
        else if (act === "hatch") this.callbacks.onHatch?.(entry.key, btn.dataset.cap);
        else if (act === "laneCancel") this.callbacks.onLaneCancel?.(entry.workspaceId, entry.key);
        else if (act === "latchReset") this.callbacks.onLatchReset?.(entry.key);
      });
    }
  }

  clear() {
    for (const [, card] of this.cards) card.el.remove();
    this.cards.clear();
    this.expandedKey = null;
  }

  dispose() {
    document.removeEventListener("pointerdown", this.onDocPointerDown, true);
    this.clear();
    this.root.remove();
  }
}

export function statusText(t, state) {
  switch (state) {
    case "busy": return t("hive.state.busy");
    case "help": return t("hive.state.help");
    case "done": return t("hive.state.done");
    default: return t("hive.state.idle");
  }
}

/** 引擎等待门名（蜂卡等待状态；custom-bee-types 3.6）。 */
export function waitText(t, gate) {
  switch (gate) {
    case "format": return t("hive.wait.marker");
    case "predicate": return t("hive.wait.predicate");
    case "latch": return t("hive.wait.latch");
    case "watermark": return t("hive.wait.watermark");
    default: return gate ?? "";
  }
}

export function relativeTime(t, updatedAt) {
  if (!updatedAt) return "";
  const diff = Date.now() - updatedAt;
  if (diff < 60_000) return t("hive.time.now");
  if (diff < 3_600_000) return t("hive.time.min").replace("{n}", String(Math.floor(diff / 60_000)));
  if (diff < 86_400_000) return t("hive.time.hour").replace("{n}", String(Math.floor(diff / 3_600_000)));
  return t("hive.time.day").replace("{n}", String(Math.floor(diff / 86_400_000)));
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}
