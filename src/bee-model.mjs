/**
 * 「蜂模型」派生层（纯函数，供 src/client.jsx 与 test/bee-model-smoke.mjs 共用）。
 *
 * 会话/工作区事实 100% 来自官方客户端镜像（design.md 数据流原则）；本模块把
 * `ctx.sessions.list` + `ctx.workspaces.list` 快照 + 宿主端布局文档折叠成 3D 场景的
 * 渲染模型：巢（工作室领地）、蜂（工蜂/无人机）、蜜杯（归档）、野蜂（未分组）。
 *
 * 语义对齐（design.md D3，官方侧边栏同源）：
 *  - 过滤：blank === true 不渲染；archivedSessionIds 成员不进巢（进储蜜层）；
 *  - 状态优先级：琥珀（pendingInteraction）> 蓝（running 或子代理后代聚合运行）>
 *    绿（completed）> 灰白（idle）；
 *  - origin === 'subagent' → 无人机：绕父蜂盘旋；父蜂未渲染（空白/归档/已移除）时
 *    降级为蜂位停驻（不悬空盘旋）；
 *  - 野蜂：不在任何工作区账号内的非空活会话。
 */
import { BEE_RADIUS, capacity, spiralCells, territoryCells, worldOf } from "./hex.mjs";
import { allocateSlots, nextLayer, placeStudios, PLACEMENT_GAP, occupancyMap } from "./layout.mjs";

export const BEE_STATE = Object.freeze({
  idle: "idle",   // 待命灰白
  busy: "busy",   // 忙碌蓝
  help: "help",   // 求助琥珀
  done: "done"    // 带蜜归绿
});

/* ── 悬停高度 = 场景比例尺 BEE_RADIUS 的倍率（design.md D3；scene.mjs 蜂记录构造共用，消重） ── */
/** 基础悬停高度：1.0 × BEE_RADIUS（蜂体半高 ≈ 0.6 × BEE_RADIUS，贴地余量充足）。 */
export const HOVER_HEIGHT = 1.0 * BEE_RADIUS;

/* ── 降级停驻蜂散开（drone-active-visibility D5）：嵌套 subagent（父会话同为无人机）
   此前全部叠在巢心同一点穿模。停靠环半径 = 场景比例尺 BEE_RADIUS 倍率（禁独立绝对值
   魔数——场景比例尺规范约束），角度序位由 sessionId 的本地 FNV-1a 哈希决定。 ── */

/**
 * 降级停驻蜂停靠环半径（BEE_RADIUS 倍率制）：随数量外扩——由「相邻弦长 ≥ 无人机
 * 包围球直径（0.55×BEE_RADIUS×2，留约 10% 余量）」反解倍率，任意数量下互不重叠；
 * 下限 1.5×（巢心与首环瓦片之间，守“巢心附近一圈”）。count ≤ 2 时弦长恒足，取下限。
 */
export function standInRingRadius(count) {
  if (count <= 2) return 1.5 * BEE_RADIUS;
  const needed = (0.6 * BEE_RADIUS) / Math.sin(Math.PI / count);
  return Math.max(1.5 * BEE_RADIUS, needed);
}

/** 本地 FNV-1a 32 位哈希（确定性散开序位；SHALL NOT 引用 hive/ 层 hashPhase——
 *  派生层反向依赖表现层会造成层向倒挂，审阅 F5）。 */
function fnv1a(text) {
  let hash = 0x811c9dc5;
  const s = String(text);
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** 官方同语义的状态归并（琥珀 > 蓝 > 绿 > 灰白）。 */
export function stateOf(summary) {
  if (!summary) return BEE_STATE.idle;
  if (summary.pendingInteraction) return BEE_STATE.help;
  if (summary.running) return BEE_STATE.busy;
  if (summary.completed) return BEE_STATE.done;
  return BEE_STATE.idle;
}

/** 蜂卡展示的 todo 进度（projectionValues.todos: TodoItem[] | null）。 */
export function todoProgress(summary) {
  const todos = summary?.projectionValues?.todos;
  if (!Array.isArray(todos) || todos.length === 0) return null;
  let done = 0;
  for (const item of todos) {
    if (item?.status === "completed" || item?.done === true) done++;
  }
  return { done, total: todos.length };
}

/** 空摘要的卡面字段（卡片/拾取共用）。 */
function cardFace(summary) {
  return {
    sessionId: summary.id,
    displayTitle: summary.displayTitle ?? summary.title ?? summary.id,
    updatedAt: summary.updatedAt ?? 0,
    pendingInteraction: summary.pendingInteraction ?? null,
    todos: todoProgress(summary)
  };
}

/**
 * 悬停 tips 数据面预计算（hive-interaction-polish 1.2/D5，纯函数供冒烟直测）：
 *  - token 四桶合计（projectionValues.tokenUsage：uncachedInput + output + cacheRead +
 *    cacheWrite）；tokenUsage 缺失（投影缓存未命中）→ null（呈现层 `-` 回退）；
 *  - 平均 DPS（sessionStats.decodeTokens ÷ decodeMs × 1000 的平均值近似）：decodeMs
 *    缺失/为 0/样本不足 1 秒（< 1000ms）或投影键缺失 → null；
 *  - 巢内会话数（sessionCount，巢内工蜂计数含自身）与 workspaceId 由调用方传入；
 *  - 全部缺数据置 null，SHALL NOT 报错（spec bee-hover-tips「缺失以 - 占位」）。
 * 无人机不走本函数（降级口径在派生处显式置 null——会话数/token/DPS 统一 `-`）。
 */
export function tipFaceOf(summary, { workspaceId = null, sessionCount = null } = {}) {
  const pv = summary?.projectionValues ?? null;
  let tokens = null;
  const usage = pv?.tokenUsage;
  if (usage && typeof usage === "object" && !Array.isArray(usage)) {
    const total =
      (Number(usage.uncachedInput) || 0) +
      (Number(usage.output) || 0) +
      (Number(usage.cacheRead) || 0) +
      (Number(usage.cacheWrite) || 0);
    tokens = Number.isFinite(total) ? total : null;
  }
  let dps = null;
  const stats = pv?.sessionStats;
  if (stats && typeof stats === "object" && !Array.isArray(stats)) {
    const ms = Number(stats.decodeMs);
    const toks = Number(stats.decodeTokens);
    if (Number.isFinite(ms) && ms >= 1000 && Number.isFinite(toks)) {
      dps = Math.round((toks / ms) * 1000);
    }
  }
  return { tokens, dps, sessions: sessionCount, workspaceId: workspaceId ?? null };
}

/** 无人机降级 tipFace（spec bee-hover-tips）：状态/所属工作区照常，会话数/token/DPS 统一 `-`。 */
function droneTipFace(workspaceId) {
  return { tokens: null, dps: null, sessions: null, workspaceId: workspaceId ?? null };
}

/**
 * 会话概要条数据面（session-brief-bar 1.4/D4，纯函数供冒烟直测）：会话标题
 * （displayTitle，缺失回退 sessionId）+ projectionValues.turnOutline 末回合的
 * prompt/response 预览。缺失键 → null 槽位（呈现层 `-` 占位，SHALL NOT 隐藏整条
 * bar 或报错）；末回合 response 为空串同样按缺失处理。
 */
export function sessionsBriefOf(summary) {
  if (!summary || typeof summary !== "object") return null;
  const title = summary.displayTitle ?? summary.title ?? summary.id ?? null;
  const outline = summary.projectionValues?.turnOutline;
  const turns = Array.isArray(outline) ? outline : Array.isArray(outline?.turns) ? outline.turns : null;
  let prompt = null;
  let response = null;
  if (turns && turns.length > 0) {
    const last = turns[turns.length - 1];
    if (last && typeof last === "object") {
      prompt = typeof last.prompt === "string" && last.prompt.length > 0 ? last.prompt : null;
      response = typeof last.response === "string" && last.response.length > 0 ? last.response : null;
    }
  }
  return { title, prompt, response };
}

/**
 * 派生整张蜂巢世界。
 * @param {object} input
 * @param {SessionListState} input.sessions ctx.sessions.list.getSnapshot()
 * @param {WorkspaceListState} input.workspaces ctx.workspaces.list.getSnapshot()
 * @param {Record<string, {q,r}>} input.positions 宿主端持久化中心坐标
 * @param {Map<string, {layer:number, strikes:number, slots:Map}>} [input.studioState]
 *        上一轮的每巢运行态（层数滞回计数 + 蜂位分配），保持格位稳定
 * @param {Record<string, {parentId:string, at:number}>} [input.summonEdges]
 *        宿主半区布局文档的召唤边（hive-interaction-polish 1.2/D7；optional——
 *        旧宿主半区 / 旧文档缺省 = 无召唤连线，静默降级）
 * @returns {{world: object, studioState: Map}} world = 场景渲染模型；
 *          studioState = 传回下一轮的运行态
 */
export function deriveWorld({ sessions, workspaces, positions = {}, studioState = new Map(), summonEdges = null }) {
  const byId = sessions?.byId ?? {};
  const ids = sessions?.ids ?? [];
  const items = workspaces?.items ?? [];
  const archived = new Set(workspaces?.archivedSessionIds ?? []);

  /* ── 账号索引：sessionId → workspaceId（官方分组镜像） ── */
  const accountOf = new Map();
  for (const ws of items) {
    for (const sid of ws.sessionIds ?? []) {
      if (!accountOf.has(sid)) accountOf.set(sid, ws.workspaceId);
    }
  }

  /* ── 会话分类：蜜蜂（按巢）/ 无人机候选 / 蜜杯 / 野蜂 ── */
  const liveBeesByStudio = new Map(); // workspaceId → [{summary, state}]
  const cupsByStudio = new Map(); // workspaceId → [cardFace]
  const wild = [];
  const wildStandIns = new Set(); // 野蜂箱中的降级无人机 id（droneStandIn 标记源，D2）
  const droneByParent = new Map(); // parentId → [summary]
  const parentChildren = new Map(); // parentId → [sessionId]（单遍构建的父子索引，hive-render-storm-fix D1）

  const isRenderable = (s) => s && !s.blank && !archived.has(s.id);

  for (const id of ids) {
    const s = byId[id];
    if (!s) continue;
    /* 父子索引边登记（hive-render-storm-fix 2.1）：先于归档/空白/子代理三处 continue
       跳过分支，对镜像中全部携带 parentId 的行登记边（含归档行与空白行）——归档中间
       节点是遍历中途的「边」而非终点（explore.md §6 探针实证：剔除归档边会让归档子树
       下的 running 后代从计数中消失 3→2，违反聚合口径一致性约束）。ids 与 byId 同源
       同集（官方镜像 flattenLineage 成对构建），键宇宙与旧全表扫描一致。 */
    if (s.parentId) {
      const siblings = parentChildren.get(s.parentId);
      if (siblings) siblings.push(id);
      else parentChildren.set(s.parentId, [id]);
    }
    if (archived.has(s.id)) {
      const wsId = accountOf.get(id);
      if (wsId) {
        if (!cupsByStudio.has(wsId)) cupsByStudio.set(wsId, []);
        cupsByStudio.get(wsId).push(cardFace(s));
      }
      continue; // 未分组归档会话：蜂蜜无巢可挂，v1 不渲染（蜜杯按巢内账号镜像）
    }
    if (s.blank) continue; // 空白会话不出蜂（用户决策 D-1）
    if (s.origin === "subagent" && s.parentId && byId[s.parentId]) {
      if (!droneByParent.has(s.parentId)) droneByParent.set(s.parentId, []);
      droneByParent.get(s.parentId).push(s);
      continue;
    }
    const wsId = accountOf.get(id);
    if (!wsId) {
      if (s.origin === "subagent") wildStandIns.add(s.id); // 父会话已移除的无人机滞留野蜂箱（D2 同标记）
      wild.push(s);
      continue;
    }
    if (!liveBeesByStudio.has(wsId)) liveBeesByStudio.set(wsId, []);
    liveBeesByStudio.get(wsId).push(s);
  }

  /* ── 巢：层数（扩环即时/收缩滞回）→ 落位 → 蜂位分配 ── */
  const entries = items.map((ws) => {
    const bees = liveBeesByStudio.get(ws.workspaceId) ?? [];
    const cups = cupsByStudio.get(ws.workspaceId) ?? [];
    const prev = studioState.get(ws.workspaceId);
    const count = bees.length;
    const hysteresis = nextLayer(prev?.layer ?? 3, count, prev?.strikes ?? 0);
    return { workspaceId: ws.workspaceId, title: ws.title, path: ws.path, layer: hysteresis.layer, bees, cups, hysteresis };
  });

  const { placements, displaced } = placeStudios(
    entries.map((e) => ({ workspaceId: e.workspaceId, layer: e.layer })),
    positions
  );

  const nextStudioState = new Map();
  const studios = [];
  for (const entry of entries) {
    const center = placements.get(entry.workspaceId);
    const layer = entry.layer;
    const ordered = entry.bees.map((s) => s.id);
    const prevSlots = studioState.get(entry.workspaceId)?.slots ?? null;
    const slots = allocateSlots(prevSlots, ordered, layer);
    nextStudioState.set(entry.workspaceId, {
      layer,
      strikes: entry.hysteresis.strikes,
      slots
    });
    const cells = territoryCells(center, layer);
    const cap = capacity(layer);
    const bees = entry.bees.map((s) => {
      const index = slots.get(s.id) ?? 0;
      const cell = cells[Math.min(index, cells.length - 1)];
      const pos = worldOf(cell);
      return {
        ...cardFace(s),
        state: BEE_STATE[stateOf(s)],
        workspaceId: entry.workspaceId, // tips「所属工作区」透传（hive-interaction-polish 1.1）
        tipFace: tipFaceOf(s, { workspaceId: entry.workspaceId, sessionCount: entry.bees.length }), // 巢内会话数含自身（1.2/D5）
        cellIndex: index,
        cell,
        pos,
        y: HOVER_HEIGHT,
        drones: [],
        activeDroneCount: 0 // 父蜂活跃无人机预聚合（单遍派生，卡片层免每帧扫描，D2/1.3）
      };
    });
    studios.push({
      workspaceId: entry.workspaceId,
      title: entry.title,
      path: entry.path,
      layer,
      center,
      radius: layer - 1,
      capacity: cap,
      bees,
      cups: entry.cups
    });
  }

  /* ── 无人机：挂父蜂；父蜂未渲染 → 降级为所在巢的停驻蜂 ── */
  const studioByWorkspace = new Map(studios.map((s) => [s.workspaceId, s]));
  const beeById = new Map();
  for (const studio of studios) for (const bee of studio.bees) beeById.set(bee.sessionId, bee);

  for (const [parentId, drones] of droneByParent) {
    const parent = beeById.get(parentId);
    for (const drone of drones) {
      if (parent) {
        const state = BEE_STATE[stateOf(drone)];
        parent.drones.push({
          ...cardFace(drone),
          state,
          workspaceId: parent.workspaceId, // 无人机记录自父蜂透传（tips「所属工作区」= 父巢，1.1）
          tipFace: droneTipFace(parent.workspaceId) // 无人机降级口径：会话数/token/DPS 统一 `-`（spec bee-hover-tips）
        });
        if (state !== BEE_STATE.done) parent.activeDroneCount += 1; // 活跃 = busy ∪ help ∪ idle（D1）
        continue;
      }
      // 父蜂未渲染（空白/归档/已移除）：降级为蜂位停驻（D3/F5），按自身账号归巢
      const wsId = accountOf.get(drone.id);
      const studio = wsId ? studioByWorkspace.get(wsId) : undefined;
      if (studio) {
        studio.bees.push({
          ...cardFace(drone),
          state: BEE_STATE[stateOf(drone)],
          droneStandIn: true, // 独立标记（SHALL NOT 复用 origin——interact 拾取分类读 origin，动它会漂移拖拽/右键/寻址三类交互，D2/F3）
          workspaceId: studio.workspaceId, // 降级停驻蜂同样携带（1.1：按自身账号归巢 = 所在巢）
          tipFace: droneTipFace(studio.workspaceId), // 降级口径同无人机（spec bee-hover-tips）
          cellIndex: -1,
          cell: studio.center,
          pos: worldOf(studio.center),
          y: HOVER_HEIGHT,
          drones: []
        });
      } else {
        wildStandIns.add(drone.id); // 野蜂箱无人机：入箱清单打同款标记（过滤口径一致，D2）
        wild.push(drone);
      }
    }
  }

  /* ── 降级停驻蜂确定性散开（D5）：以 sessionId 的 FNV-1a 哈希排定环上序位，按秩均布
     角度（同输入同位置；序位由哈希决定，且互不重叠），停靠巢心附近一圈。完工者随后
     经 scene 装配层显隐过滤隐藏，散开与过滤正交。 ── */
  for (const studio of studios) {
    const standIns = studio.bees.filter((b) => b.droneStandIn);
    if (standIns.length === 0) continue;
    const wc = worldOf(studio.center);
    const ringRadius = standInRingRadius(standIns.length);
    standIns
      .map((bee) => ({ bee, hash: fnv1a(bee.sessionId) }))
      .sort((a, z) => a.hash - z.hash || (a.bee.sessionId < z.bee.sessionId ? -1 : 1))
      .forEach(({ bee }, index) => {
        const angle = ((index + 0.5) / standIns.length) * Math.PI * 2;
        bee.pos = {
          x: wc.x + Math.cos(angle) * ringRadius,
          z: wc.z + Math.sin(angle) * ringRadius
        };
      });
  }

  /* ── 后代运行聚合（沿 origin 链）：任一后代 running → 父蜂蓝态提示。
     索引化（hive-render-storm-fix 2.2）：沿单遍构建的 parentChildren 索引做 BFS
     迭代聚合（非递归，无栈深风险），复杂度 O(N + Σ后代数)，SHALL NOT 逐父蜂全表
     扫描会话镜像（旧 collectDescendants 的 D×N×深度 全表扫描已在 CPU profile 占
     72.5%，explore.md）。visited 集每次 walk 独立（两根共享后代时各自计数，复刻
     现状；parentId 成环的畸形数据下防重复访问、正常收敛不栈溢出）；计数过滤
     （running && !blank && !archived）在访问时判断，口径与索引化前逐字段一致
     （遍历根自身不入 visited 计数，与旧实现「只数严格后代」一致）。 ── */
  for (const [parentId] of droneByParent) {
    const parent = beeById.get(parentId);
    if (!parent) continue;
    let runningDescendants = 0;
    const visited = new Set([parentId]);
    const queue = [parentId];
    for (let head = 0; head < queue.length; head++) {
      for (const childId of parentChildren.get(queue[head]) ?? []) {
        if (visited.has(childId)) continue;
        visited.add(childId);
        const s = byId[childId];
        if (s?.running && !s?.blank && !archived.has(childId)) runningDescendants++;
        queue.push(childId);
      }
    }
    parent.runningDescendants = runningDescendants;
    if (runningDescendants > 0 && parent.state === BEE_STATE.idle) parent.state = BEE_STATE.busy;
  }

  /* ── 召唤边双索引（hive-interaction-polish 1.2/D6/D7）：child 侧 summonedBy（单值）
     + parent 侧 summonedTo[]（数组——召唤者侧显示按 parent 聚合，单索引每次 O(n) 扫描
     不划算）。边指向未渲染会话（空白/归档化蜜/已消失/野蜂）时忽略——呈现侧对失效边
     即时不画，SHALL NOT 等待宿主半区剪边（两端修正独立生效，D7）。 ── */
  if (summonEdges && typeof summonEdges === "object" && !Array.isArray(summonEdges)) {
    const rendered = new Map(); // 渲染记录表（工蜂 + 降级停驻蜂 + 无人机；野蜂不入 3D 场景）
    for (const studio of studios) {
      for (const bee of studio.bees) {
        rendered.set(bee.sessionId, bee);
        for (const drone of bee.drones) rendered.set(drone.sessionId, drone);
      }
    }
    for (const [childId, edge] of Object.entries(summonEdges)) {
      const parentId = edge?.parentId;
      if (typeof parentId !== "string" || !parentId || childId === parentId) continue;
      const child = rendered.get(childId);
      const parent = rendered.get(parentId);
      if (!child || !parent) continue; // 端点未渲染 → 忽略
      child.summonedBy = parentId;
      if (!Array.isArray(parent.summonedTo)) parent.summonedTo = [];
      parent.summonedTo.push(childId);
    }
  }

  /* ── 野蜂（未分组会话）：派生保留在镜像世界（道具栏工蜂判定等数据层消费）；
      3D 场景已移除野蜂箱视口，不做渲染呈现 ── */
  const wildBees = wild
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    .map((s) => ({
      ...cardFace(s),
      state: BEE_STATE[stateOf(s)],
      ...(wildStandIns.has(s.id) ? { droneStandIn: true } : {}) // 降级停驻无人机标记（D2）
    }));

  return {
    world: {
      studios,
      wildBees,
      occupancy: occupancyMap(placements, new Map(studios.map((s) => [s.workspaceId, s.layer]))),
      displaced
    },
    studioState: nextStudioState
  };
}

/** 供场景使用的常量再出口（避免场景直接依赖多个模块）。 */
export { capacity, spiralCells, territoryCells, worldOf, PLACEMENT_GAP };
