/**
 * 蜂巢指挥中心「作战报告」事件源（hive-combat-log，design.md D1–D5）：
 *  - `diffHiveEvents(prev, { world, workspaces })`：纯函数——对 `deriveWorld` 产物 +
 *    workspaces 快照做前后世界差分，产出事件行。首轮（prev 为 null）只建基线返回空列表
 *    （沿 `diffBeeTransitions` 先例，src/hive/hex-fx.mjs）；
 *  - `CombatLogFeed` 类：模块级环形缓冲（200 覆写最旧）、单调 seq + Date.now() 时间戳、
 *    未读计数（折叠期累计、展开清零）、`pushReceipt(text)`（操作回执）、`setCollapsed(bool)`。
 *
 * 事件目录（v1，D2）：
 *   高优先级：召唤工蜂 / 开始执行任务 / 完成任务 / 发出求助 / 召唤了 x 个无人机 /
 *             无人机完工（批量）/ 归档 / 新巢建立；
 *   低优先级：巢搬移 / 野蜂出现（面板头部「显示低优先级」过滤开关）。
 * 每行携带稳定事件键（去重）+ 优先级标记（`low: true` 为低优先级）。
 *
 * 抖动阻尼（D4）：每会话 2000ms 迁移冷却窗，窗内非 help 迁移只刷新基线不发行；
 * →help 恒即时穿透。
 */
import { stateOf, BEE_STATE } from "../bee-model.mjs";

/** 环形缓冲容量（D5；约 200 条，写满覆写最旧）。 */
export const COMBAT_LOG_CAP = 200;
/** 每会话状态迁移冷却窗（ms，D4）。 */
export const MIGRATE_COOLDOWN_MS = 2000;
/** 报告缓冲 localStorage 键（跨页面重载保留近期报告；页签隔离，settings 同粒度）。 */
export const COMBAT_LOG_STORAGE_KEY = "dsh-v-hive:combat-log";

/* ── 事件 kind（渲染用动词 + 配色字面量落 styles.mjs/client.jsx 字典侧；此处为
      差分层事实编码，不承载文案） ── */
export const EV_KIND = Object.freeze({
  enterWorker: "enterWorker",   // 召唤工蜂（黄）
  start: "start",               // 开始执行任务（蓝）
  done: "done",                 // 完成任务（绿）
  help: "help",                 // 发出求助（琥珀，整行常驻高亮）
  dronesNew: "dronesNew",       // 召唤了 x 个无人机（黄）
  dronesDone: "dronesDone",     // 无人机完工·批量（绿）
  archive: "archive",           // 归档（蜜金）
  newNest: "newNest",           // 新巢建立（黄）
  nestMove: "nestMove",         // 巢搬移（低优先级，弱化中性）
  wildBee: "wildBee",           // 野蜂出现（低优先级，弱化中性）
  receipt: "receipt"            // 操作回执（中性弱化；pushReceipt 专用）
});

const LOW_PRIORITY = new Set([EV_KIND.nestMove, EV_KIND.wildBee]);

/**
 * 首轮（prev 为 null）只建基线。基线结构（沿 D3）：sessionId→state 集、
 * workspaceId 集、archivedSessionIds 集、巢 center 表、无人机父挂表。
 * 全部以普通对象/Map 表示，保持纯函数可测。
 */
function buildBaseline(world, workspaces) {
  const sessionState = new Map(); // sessionId → state（工蜂与无人机统一在此，供迁移判定）
  const workspaceIds = new Set();
  const archived = new Set(workspaces?.archivedSessionIds ?? []);
  const centers = new Map(); // workspaceId → { q, r }（或 null 当无 center）
  const droneParent = new Map(); // drone sessionId → parentId

  for (const studio of world?.studios ?? []) {
    workspaceIds.add(studio.workspaceId);
    centers.set(studio.workspaceId, studio.center ?? null);
    for (const bee of studio.bees ?? []) {
      sessionState.set(bee.sessionId, bee.state ?? BEE_STATE.idle);
    }
  }

  for (const item of workspaces?.items ?? []) {
    workspaceIds.add(item.workspaceId);
    if (!centers.has(item.workspaceId)) centers.set(item.workspaceId, null);
  }

  /* 无人机父挂表：从 workspaces.items 的 sessionIds 无法直接拿到 parentId，
     故从 world.studios[].bees[].drones 映射回父蜂（deriveWorld 已挂载无人机的
     sessionId 列表）。此外野蜂中的 origin==='subagent' 降级停驻蜂也需记录。 */
  for (const studio of world?.studios ?? []) {
    for (const bee of studio.bees ?? []) {
      for (const drone of bee.drones ?? []) {
        droneParent.set(drone.sessionId, bee.sessionId);
        sessionState.set(drone.sessionId, drone.state ?? BEE_STATE.idle);
      }
    }
  }

  /* 野蜂（含降级停驻无人机）：sessionId 也入基线的状态表，供迁移判定。 */
  const wildSessions = new Set();
  for (const w of world?.wildBees ?? []) {
    sessionState.set(w.sessionId, w.state ?? BEE_STATE.idle);
    wildSessions.add(w.sessionId);
  }

  return {
    sessionState,
    workspaceIds,
    archived,
    centers,
    droneParent,
    wildSessions,
    /* 迁移冷却簿记：sessionId → 上次已发时间戳（Date.now）与已发态 */
    lastEmitAt: new Map(), // sessionId → ts
    lastEmitState: new Map() // sessionId → state（用于「冷却到期后当前态 ≠ 已发态才发」）
  };
}

/** 派生本轮事实（供差分读侧），结构与基线同源。 */
function deriveFacts(world, workspaces) {
  const sessionState = new Map();
  const workspaceIds = new Set();
  const archived = new Set(workspaces?.archivedSessionIds ?? []);
  const centers = new Map();
  const wildSessions = new Set();
  const droneParent = new Map(); // drone sessionId → parentId（结构化已知时）
  const sessionTitles = new Map(); // sessionId → 所属蜂巢 title（工蜂/无人机/归档会话；野蜂不入）

  for (const studio of world?.studios ?? []) {
    workspaceIds.add(studio.workspaceId);
    centers.set(studio.workspaceId, studio.center ?? null);
    for (const bee of studio.bees ?? []) {
      sessionState.set(bee.sessionId, bee.state ?? BEE_STATE.idle);
      sessionTitles.set(bee.sessionId, studio.title ?? "");
      for (const drone of bee.drones ?? []) {
        sessionState.set(drone.sessionId, drone.state ?? BEE_STATE.idle);
        droneParent.set(drone.sessionId, bee.sessionId);
        sessionTitles.set(drone.sessionId, studio.title ?? "");
      }
    }
    for (const cup of studio.cups ?? []) {
      sessionTitles.set(cup.sessionId, studio.title ?? "");
    }
  }
  for (const item of workspaces?.items ?? []) {
    workspaceIds.add(item.workspaceId);
    if (!centers.has(item.workspaceId)) centers.set(item.workspaceId, null);
  }
  for (const w of world?.wildBees ?? []) {
    sessionState.set(w.sessionId, w.state ?? BEE_STATE.idle);
    wildSessions.add(w.sessionId);
  }
  return { sessionState, workspaceIds, archived, centers, wildSessions, droneParent, sessionTitles };
}

/**
 * 前后世界差分（纯函数）。
 * @param {object|null} prev 上一轮基线（首轮传 null → 只建基线返回空事件列表）。
 * @param {{world: object, workspaces: object, now?: number}} input
 *   world = deriveWorld 产物；workspaces = ctx.workspaces.list.getSnapshot()；
 *   now = 时间戳（测试注入；缺省 Date.now()）。
 * @returns {{events: Array, baseline: object, now: number}}
 *   events：事件行数组 [{ key, kind, low, text?, sessionId, name?, count?, from?, to?, workspaceId?, title? }]
 *   baseline：本轮基线（持久于 CombatLogFeed 实例，传回下一轮）。
 */
export function diffHiveEvents(prev, input) {
  const world = input?.world ?? {};
  const workspaces = input?.workspaces ?? { items: [], archivedSessionIds: [] };
  const now = input?.now ?? Date.now();

  if (!prev) {
    return { events: [], baseline: { ...buildBaseline(world, workspaces), builtAt: now }, now };
  }

  const facts = deriveFacts(world, workspaces);
  const events = [];
  const emit = (line) => events.push(line);

  /* ── 1. 召唤工蜂：新非 blank 工蜂会话（droneStandIn 除外） ──
         工蜂会话 = 出现在 studios[].bees 中且非 droneStandIn 且父挂表不记录其
         为无人机；droneParent 用于排除降级停驻蜂（它们的 sessionId 也可能落在
         studios[].bees，但无人机父挂表已在当前 world 装配，需独立判定）。
         判定口径（D2）：凡本轮 world.studios.flatMap(bees) 中非 droneStandIn 的新
         sessionId 即「召唤工蜂」。无人机挂载（bees[].drones）中的 sessionId 永不
         落入 bees[].sessionId（deriveWorld 把无人机放进父蜂 drones 而非独立蜂），
         故只需排除 droneStandIn。 */
  const seenWorker = new Set();
  for (const studio of world?.studios ?? []) {
    for (const bee of studio.bees ?? []) {
      if (bee.droneStandIn) continue; // 降级停驻蜂不单列（其生命周期由无人机口径覆盖）
      if (!prev.sessionState.has(bee.sessionId)) {
        emit({
          key: "enter:" + bee.sessionId,
          kind: EV_KIND.enterWorker,
          low: false,
          sessionId: bee.sessionId,
          name: bee.displayTitle,
          title: studio.title ?? ""
        });
      }
      seenWorker.add(bee.sessionId);
    }
  }

  /* ── 2–5. 工蜂状态迁移（→busy / →done / →help），沿基线 + 冷却窗 ──
         工蜂 = seenWorker（本轮工蜂）+ 野蜂（wildBees 也参与 help 判定——design D2
         「工蜂（含降级停驻蜂）状态迁移出事件」，野蜂出现本身已单列为低优先级，其
         状态迁移按同口径处理：help 即时、非 help 冷却）。 */
  const migrateTargets = [];
  for (const [sid, state] of facts.sessionState) {
    const prevState = prev.sessionState.has(sid) ? prev.sessionState.get(sid) : null;
    if (prevState === null) continue; // 新会话由「召唤/野蜂出现/无人机召唤」口径覆盖
    if (state === prevState) continue;
    migrateTargets.push({ sid, prevState, state });
  }

  /* 无人机迁移不出 busy/done 行（其生命周期由「召唤 x 个 / 完工批量」覆盖）：
     排除本轮世界中的无人机 sessionId（含降级停驻蜂与挂父无人机）。 */
  const droneSids = new Set();
  for (const studio of world?.studios ?? []) {
    for (const bee of studio.bees ?? []) {
      if (bee.droneStandIn) droneSids.add(bee.sessionId);
      for (const drone of bee.drones ?? []) droneSids.add(drone.sessionId);
    }
  }
  for (const w of world?.wildBees ?? []) {
    if (w.droneStandIn) droneSids.add(w.sessionId);
  }

  for (const t of migrateTargets) {
    if (t.state !== BEE_STATE.help && droneSids.has(t.sid)) continue;

    const isHelp = t.state === BEE_STATE.help;
    const hasEmit = prev.lastEmitState?.has(t.sid) ?? false;
    const lastAt = prev.lastEmitAt?.get(t.sid) ?? 0;
    const lastState = prev.lastEmitState?.get(t.sid) ?? null;
    /* 首个迁移（无已发记录）恒即时；此后只在冷却到期且态 ≠ 已发态时发行（D4） */
    const inCooldown = hasEmit && now - lastAt < MIGRATE_COOLDOWN_MS;

    if (isHelp) {
      /* →help 恒即时穿透（D4，最高视觉优先级） */
      const key = "state:" + t.sid + ":" + t.prevState + ">" + t.state;
      emit({
        key,
        kind: EV_KIND.help,
        low: false,
        sessionId: t.sid,
        from: t.prevState,
        to: t.state,
        title: facts.sessionTitles.get(t.sid) ?? ""
      });
    } else if (!inCooldown && t.state !== lastState) {
      /* 冷却到期且当前态 ≠ 上次已发态 → 发行 */
      const kind = t.state === BEE_STATE.busy
        ? EV_KIND.start
        : t.state === BEE_STATE.done
          ? EV_KIND.done
          : null;
      if (kind) {
        emit({
          key: "state:" + t.sid + ":" + t.prevState + ">" + t.state,
          kind,
          low: false,
          sessionId: t.sid,
          from: t.prevState,
          to: t.state,
          title: facts.sessionTitles.get(t.sid) ?? ""
        });
      }
    }
    /* 其余（非 help 且冷却窗内，或已发同态）只刷新基线不发行 → 落 lastEmit 簿记见下 */
  }

  /* ── 6. 召唤了 x 个无人机：同 tick 新 subagent 会话按 parentId 合并计数 ──
         无人机的「新出现」= 其 sessionId 进入本轮世界（父蜂 drones 或降级停驻
         或野蜂 droneStandIn），且基线无此 id。按 parentId 归并。 */
  const newDroneByParent = new Map();
  for (const studio of world?.studios ?? []) {
    for (const bee of studio.bees ?? []) {
      for (const drone of bee.drones ?? []) {
        if (!prev.sessionState.has(drone.sessionId)) {
          const pid = bee.sessionId;
          if (!newDroneByParent.has(pid)) newDroneByParent.set(pid, []);
          newDroneByParent.get(pid).push(drone.sessionId);
        }
      }
      if (bee.droneStandIn && !prev.sessionState.has(bee.sessionId)) {
        /* 降级停驻蜂作为「父蜂未渲染」的无人机新出现——父挂表未知，按自身归并 */
        const pid = "__standin__" + (studio.workspaceId ?? "?");
        if (!newDroneByParent.has(pid)) newDroneByParent.set(pid, []);
        newDroneByParent.get(pid).push(bee.sessionId);
      }
    }
  }
  for (const w of world?.wildBees ?? []) {
    if (w.droneStandIn && !prev.sessionState.has(w.sessionId)) {
      const pid = "__standin__" + (w.sessionId);
      newDroneByParent.set(pid, [w.sessionId]);
    }
  }
  for (const [pid, sids] of newDroneByParent) {
    emit({
      key: "drones-new:" + pid + ":" + sids.slice().sort().join(","),
      kind: EV_KIND.dronesNew,
      low: false,
      sessionId: pid,
      count: sids.length,
      title: facts.sessionTitles.get(pid) ?? ""
    });
  }

  /* ── 7. 无人机完工（批量）：同 tick 同父迁入 done 合并 ──
         无人机迁入 done（基线态 ≠ done → 本轮 done）。按 parentId 归并。 */
  const doneDroneByParent = new Map();
  const collectDoneDrone = (sid, pid) => {
    const prevState = prev.sessionState.get(sid);
    const state = facts.sessionState.get(sid);
    if (state === BEE_STATE.done && prevState !== BEE_STATE.done) {
      if (!doneDroneByParent.has(pid)) doneDroneByParent.set(pid, []);
      doneDroneByParent.get(pid).push(sid);
    }
  };
  for (const studio of world?.studios ?? []) {
    for (const bee of studio.bees ?? []) {
      for (const drone of bee.drones ?? []) collectDoneDrone(drone.sessionId, bee.sessionId);
      if (bee.droneStandIn) collectDoneDrone(bee.sessionId, "__standin__" + (studio.workspaceId ?? "?"));
    }
  }
  for (const w of world?.wildBees ?? []) {
    if (w.droneStandIn) collectDoneDrone(w.sessionId, "__standin__wild");
  }
  for (const [pid, sids] of doneDroneByParent) {
    emit({
      key: "drones-done:" + pid + ":" + sids.slice().sort().join(","),
      kind: EV_KIND.dronesDone,
      low: false,
      sessionId: pid,
      count: sids.length,
      title: facts.sessionTitles.get(pid) ?? ""
    });
  }

  /* ── 8. 归档：sessionId 新进入 archivedSessionIds ── */
  for (const sid of facts.archived) {
    if (!prev.archived.has(sid)) {
      emit({
        key: "archive:" + sid,
        kind: EV_KIND.archive,
        low: false,
        sessionId: sid,
        title: facts.sessionTitles.get(sid) ?? ""
      });
    }
  }

  /* ── 9. 新巢建立：workspaces.items 出现新 workspaceId ── */
  for (const wsid of facts.workspaceIds) {
    if (!prev.workspaceIds.has(wsid)) {
      const item = (workspaces?.items ?? []).find((it) => it.workspaceId === wsid);
      emit({
        key: "ws-new:" + wsid,
        kind: EV_KIND.newNest,
        low: false,
        workspaceId: wsid,
        title: item?.title
      });
    }
  }

  /* ── 10. 巢搬移（低优先级）：巢中心相对基线变化 ── */
  for (const [wsid, center] of facts.centers) {
    const prevCenter = prev.centers.get(wsid);
    if (center && prevCenter && (center.q !== prevCenter.q || center.r !== prevCenter.r)) {
      const item = (workspaces?.items ?? []).find((it) => it.workspaceId === wsid);
      emit({
        key: "ws-move:" + wsid + ":" + prevCenter.q + "," + prevCenter.r + ">" + center.q + "," + center.r,
        kind: EV_KIND.nestMove,
        low: true,
        workspaceId: wsid,
        title: item?.title ?? ""
      });
    }
  }

  /* ── 11. 野蜂出现（低优先级）：world.wildBees 新 sessionId ── */
  for (const sid of facts.wildSessions) {
    if (!prev.wildSessions.has(sid)) {
      const bee = (world?.wildBees ?? []).find((b) => b.sessionId === sid);
      emit({
        key: "wild:" + sid,
        kind: EV_KIND.wildBee,
        low: true,
        sessionId: sid,
        name: bee?.displayTitle
      });
    }
  }

  /* ── 更新迁移冷却簿记（基线回填 lastEmit） ── */
  const lastEmitAt = new Map(prev.lastEmitAt ?? []);
  const lastEmitState = new Map(prev.lastEmitState ?? []);
  for (const ev of events) {
    if (ev.kind === EV_KIND.help || ev.kind === EV_KIND.start || ev.kind === EV_KIND.done) {
      lastEmitAt.set(ev.sessionId, now);
      lastEmitState.set(ev.sessionId, ev.to);
    }
  }

  const baseline = {
    sessionState: facts.sessionState,
    workspaceIds: facts.workspaceIds,
    archived: facts.archived,
    centers: facts.centers,
    droneParent: facts.droneParent,
    wildSessions: facts.wildSessions,
    lastEmitAt,
    lastEmitState,
    builtAt: now
  };

  return { events, baseline, now };
}

/** 判断事件是否为低优先级行（面板过滤开关消费）。 */
export function isLowPriority(kind) {
  return LOW_PRIORITY.has(kind);
}

/**
 * 「作战报告」环形缓冲 + 未读门控（D1/D5）。实例挂在镜像控制器（插件 fiber 生命周期），
 * 页关页开基线/缓冲不丢；页面重载清零（可接受）。
 */
export class CombatLogFeed {
  /**
   * @param {object} opts {
   *   cap = COMBAT_LOG_CAP,
   *   now = () => Date.now(),
   *   storage = 可选的持久化后端（缺省用 globalThis.localStorage，Node 下无则禁用），
   *   storageKey = COMBAT_LOG_STORAGE_KEY
   * }
   */
  constructor(opts = {}) {
    this.cap = opts.cap ?? COMBAT_LOG_CAP;
    this.now = opts.now ?? (() => Date.now());
    /* storage：显式传（含 null = 禁用）优先；未传则探测浏览器 localStorage（Node 下缺失即禁用）。 */
    this.storage =
      opts.storage !== undefined
        ? opts.storage
        : typeof localStorage !== "undefined" && localStorage
          ? localStorage
          : null;
    this.storageKey = opts.storageKey ?? COMBAT_LOG_STORAGE_KEY;
    this.baseline = null; // 差分基线（持久于内存，但不持久化——页面重载后重建）
    this.entries = []; // 环形缓冲（新行 push 到尾部；渲染侧倒序取最新置顶）
    this.seq = 0; // 单调序号
    this.unread = 0; // 未读计数（折叠期累计、展开清零）
    this.collapsed = false; // 折叠态门控
    this.version = 0; // 版本号（useSyncExternalStore 快照，worldVersionStore 同款）
    this.listeners = new Set(); // 轻量订阅（面板渲染跟随）
    this.restore(); // 恢复近期报告（跨页面重载）
  }

  /** 从 storage 恢复近期报告条目；baseline 不恢复（重载后首轮重走建基线，不重放存量蜂）。 */
  restore() {
    if (!this.storage) return;
    let raw = null;
    try {
      raw = this.storage.getItem(this.storageKey);
    } catch {
      return;
    }
    if (raw === null || raw === undefined) return;
    let items = null;
    try {
      items = JSON.parse(raw);
    } catch {
      return;
    }
    if (!Array.isArray(items)) return;
    this.entries = items
      .filter((e) => e && typeof e === "object" && typeof e.seq === "number")
      .slice(-this.cap); // 越界/脏数据逐条容忍，截断到容量上限
    /* seq 续用历史最大值，避免重载后与旧 seq 冲突 */
    for (const e of this.entries) {
      if (typeof e.seq === "number" && e.seq > this.seq) this.seq = e.seq;
    }
  }

  /** 把近期报告条目写回 storage（隐私模式写不进则静默）。 */
  persist() {
    if (!this.storage) return;
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(this.entries));
    } catch {
      /* 写不进就算了（隐私模式/配额），不影响内存缓冲 */
    }
  }

  /** 手动清空全部报告（内存 + 持久化）。 */
  clear() {
    this.entries = [];
    this.unread = 0;
    this.persist();
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** 快照 = 版本号（面板订阅后按版本重渲染，读 list()。沿 worldVersionStore 先例）。 */
  getSnapshot() {
    return this.version;
  }

  notify() {
    this.version += 1;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }

  /** 差分喂入（D1）：pure diff → 去重 → 环形入队 → 未读累计 → 发布。 */
  ingest(input) {
    const result = diffHiveEvents(this.baseline, { ...input, now: this.now() });
    this.baseline = result.baseline;
    for (const ev of result.events) {
      this.push(ev); // push 内部去重 + 入队 + notify（单条即一次发布）
    }
    return result.events;
  }

  /** 入队一行（去重 + 环形覆写 + 未读门控）。同键已在缓冲中 → 丢弃。 */
  push(line) {
    if (!line || !line.key) return false;
    /* 事件键去重：同键已在缓冲中即丢弃（吸收 SSE/409 重放同帧重复） */
    for (const e of this.entries) {
      if (e.key === line.key) return false;
    }
    const entry = {
      seq: ++this.seq,
      ts: this.now(),
      key: line.key,
      kind: line.kind,
      low: line.low === true,
      sessionId: line.sessionId ?? null,
      name: line.name ?? null,
      count: line.count ?? null,
      from: line.from ?? null,
      to: line.to ?? null,
      workspaceId: line.workspaceId ?? null,
      title: line.title ?? null,
      text: line.text ?? null // 回执行独占（pushReceipt）
    };
    this.entries.push(entry);
    if (this.entries.length > this.cap) {
      this.entries.splice(0, this.entries.length - this.cap); // 覆写最旧（自动清理超量条目）
    }
    /* 未读门控：折叠期累计、展开清零（D5） */
    if (this.collapsed) this.unread += 1;
    this.persist();
    this.notify();
    return true;
  }

  /** 操作回执（D7）：成功类 toast 收编入报告——中性弱化行，正文沿用原 toast 文案。 */
  pushReceipt(text) {
    return this.push({
      key: "toast:" + String(text),
      kind: EV_KIND.receipt,
      low: false,
      text: String(text)
    });
  }

  /** 折叠/展开切换同步未读门控；展开即清零未读（D5）。 */
  setCollapsed(collapsed) {
    const next = collapsed === true;
    if (next === this.collapsed) return;
    this.collapsed = next;
    if (!next) this.unread = 0;
    this.notify();
  }

  /** 渲染侧：全部事件（时间正序 = 最新在底，终端日志式；面板自动滚底显示最新行）。 */
  list() {
    return this.entries.slice();
  }
}
