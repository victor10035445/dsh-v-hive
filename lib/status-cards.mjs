/**
 * 状态卡片纯逻辑单点（bee-status-cards，design D1/D7/D8 + proposal）：
 * 完成状态栏口径、statusCards 归一化/校验、循环游标推进、报告让位 reserve。
 * 独立无依赖模块——client.jsx 消费、test/status-cards-smoke.mjs 冒烟直测。
 *
 * 数据形状（layout doc optional 字段 statusCards，version 1 不变）：
 *   doc.statusCards: Record<蜂种id, { prompt, autoSend }>（每蜂种至多一条）
 *   默认蜂 SHALL NOT 拥有键；键数上限 MAX_BEE_TYPES（16）。
 */

/** 状态卡功能键数上限（与蜂种上限对齐，design D3）。 */
export const MAX_STATUS_CARDS = 16;

/** 空配置（旧文档无 statusCards 字段 → 空）。 */
export function emptyStatusCards() {
  return {};
}

/* ── 归一化（读取路径，宽松）：丢弃坏值，不炸 UI ── */

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * 布局文档 statusCards 镜像归一化（spec「读取路径宽松归一化」）：
 *  - 非对象 → 空；
 *  - 丢弃指向不存在蜂种的键（蜂种删除级联兜底 / 手工改坏）；
 *  - 丢弃形状非法的值（非对象 / prompt 非字符串）；
 *  - prompt trim 存储；autoSend 布尔化（仅 === true 才落 true）；
 *  - prompt trim 后为空 → 视为「未配置」（丢弃该键——与客户端「空白 = 清除」同口径）；
 *  - 键数 ≤ MAX_STATUS_CARDS（超出部分丢弃，按对象键枚举序）。
 *
 * @param {unknown} raw  布局文档原始 statusCards
 * @param {Array<{id:string}>} beeTypes 在册蜂种镜像（用于丢弃悬空键）
 */
export function normalizeStatusCards(raw, beeTypes) {
  const out = emptyStatusCards();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  const known = new Set((beeTypes ?? []).map((t) => t.id));
  for (const [typeId, value] of Object.entries(raw)) {
    if (!typeId || !known.has(typeId)) continue;
    if (Object.keys(out).length >= MAX_STATUS_CARDS) break;
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const prompt = cleanText(value.prompt);
    if (!prompt) continue; // 空白提示词 = 未配置（清除语义）
    const entry = { prompt, autoSend: value.autoSend === true };
    out[typeId] = entry;
  }
  return out;
}

/**
 * 状态卡草稿字段级校验（spec「校验拒绝非法输入」对标 validateSlotDraft）：
 * row = 单个蜂种的草稿 { beeTypeId, prompt, autoSend }。全部通过返回 null；
 * 否则返回首个 `{ field, code }`（客户端映射 zh/en 词条）。
 * 规则：
 *  - prompt 类型非字符串且已定义（非空）→ invalidPrompt；
 *  - beeTypeId 缺失 → missingType（默认蜂灰置不可配置已由 UI 挡，这里兜底）；
 *  - prompt trim 后空白 → 允许（清除配置），不算错误。
 */
export function validateStatusCardDraft(row) {
  const r = row && typeof row === "object" ? row : {};
  if (r.beeTypeId === undefined || r.beeTypeId === null || String(r.beeTypeId) === "") {
    return { field: "beeTypeId", code: "hive.hb.status.err.missingType" };
  }
  if (r.prompt !== undefined && r.prompt !== null && typeof r.prompt !== "string") {
    return { field: "prompt", code: "hive.hb.status.err.invalidPrompt" };
  }
  return null;
}

/* ── 完成池口径（design D1） ── */

/**
 * 完成池派生纯函数：按蜂种归类当前处于 done（带蜜归）状态的主蜂。
 * 排除无人机（droneStandIn 标记）与 subagent 会话（origin === "subagent" 双保险）；
 * 归档（蜜杯）天然不在 world。绑定蜂种 → 计入其蜂种；未绑定 → 默认蜂。
 *
 * @param {object} world        bee-model 派生的世界（studios[].bees / wildBees）
 * @param {Record<string,string>} assignments  布局文档 beeAssignments 镜像
 * @param {object} sessionsState 官方会话镜像（ctx.sessions.list.getSnapshot()）
 * @returns {Record<string, Array<{sessionId:string, cellIndex:number}>>}
 *          key = 蜂种 id 或 "default"（默认蜂）；value = 稳定序的完成蜂列表。
 */
export function completionPool(world, assignments, sessionsState) {
  const pool = { default: [] };
  const byId = sessionsState?.byId ?? {};
  const isSubagent = (sessionId) => byId[sessionId]?.origin === "subagent";

  const addBee = (bee, bucketKey) => {
    if (!bee || bee.state !== "done") return;
    if (bee.droneStandIn) return;
    if (isSubagent(bee.sessionId)) return;
    const key = bucketKey || "default";
    if (!pool[key]) pool[key] = [];
    pool[key].push({ sessionId: bee.sessionId, cellIndex: bee.cellIndex ?? Number.MAX_SAFE_INTEGER });
  };

  for (const studio of world?.studios ?? []) {
    for (const bee of studio?.bees ?? []) {
      const typeId = assignments?.[bee.sessionId] || "";
      addBee(bee, typeId);
    }
  }
  for (const wild of world?.wildBees ?? []) {
    const typeId = assignments?.[wild.sessionId] || "";
    addBee(wild, typeId);
  }

  /* 稳定序（design D7）：cellIndex 优先（未落蜂位用上限兜底）、sessionId 字典序次级。 */
  for (const key of Object.keys(pool)) {
    pool[key].sort(
      (a, b) => (a.cellIndex - b.cellIndex) || (a.sessionId < b.sessionId ? -1 : a.sessionId > b.sessionId ? 1 : 0)
    );
  }
  return pool;
}

/** 某蜂种完成池的有序 sessionId 列表（供循环选蜂 / 批量发送快照）。 */
export function completionSessions(pool, beeTypeId) {
  const list = pool?.[beeTypeId] ?? [];
  return list.map((b) => b.sessionId);
}

/* ── 循环游标推进（design D7） ── */

/**
 * 循环游标推进：+1 对池长取模；空池 no-op（返回 0）。
 * @param {number} poolLength 完成池长度
 * @param {number} cursor     当前游标
 * @returns {number} 下一游标（0 ≤ 返回值 < poolLength；空池恒 0）
 */
export function advanceCursor(poolLength, cursor) {
  const len = Math.max(0, Math.floor(Number(poolLength) || 0));
  if (len === 0) return 0;
  const cur = Math.max(0, Math.floor(Number(cursor) || 0));
  return (cur + 1) % len;
}

/** 批量发送目标快照选取（design D5）：点击瞬间的完成池以稳定序快照成 sessionId 列表。 */
export function snapshotSessions(pool, beeTypeId) {
  return completionSessions(pool, beeTypeId).slice();
}

/* ── 报告让位 reserve（design D2 / 任务 1.4） ── */

/** 作战报告面板展开态头部占高（标题行 padding 8px×2 + line-height 16px + 底边线）。 */
export const REPORT_HEAD_PX = 34;
/** 作战报告折叠态 pill 高（padding 6px×2 + line-height 18px）。 */
export const REPORT_PILL_PX = 30;
/** 展开态列表每行高（padding 4px×2 + line-height 16px，见 styles 的 --jyv-report-rows 口径）。 */
export const REPORT_ROW_PX = 24;
/** 展开态列表额外边距（padding 6px×2 = 12px，见 .jyv-combatLogList）。 */
export const REPORT_LIST_PAD_PX = 12;

/**
 * 报告让位 reserve 计算（状态栏下缘让位给作战报告面板的占位高度，px）：
 *  - 收起（reportCollapsed）→ pill 高；
 *  - 展开 → rows×24px + 头部 + 列表边距。
 * @param {{ reportCollapsed?: boolean, reportRows?: number }} input
 * @returns {number} reserve 像素高度（≥0）
 */
export function statusBarReserve({ reportCollapsed, reportRows } = {}) {
  if (reportCollapsed === true) return REPORT_PILL_PX;
  const rows = Math.max(0, Math.floor(Number(reportRows) || 0));
  return REPORT_HEAD_PX + rows * REPORT_ROW_PX + REPORT_LIST_PAD_PX;
}
