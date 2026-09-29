/**
 * 提案纯逻辑单点（add-proposal-panel，design D1/D3/D4 + R13）：
 * 提案清单收集口径、`proposalStates` 归一化/剪除/封顶、面板报告让位 reserve。
 * 独立模块——宿主 index.mjs 消费（路由/剪除）、浏览器 client.jsx 消费（状态色与
 * 名称）、test/proposals-smoke.mjs 冒烟直测。
 *
 * 数据形状（layout doc optional 字段 proposalStates，version 1 不变）：
 *   doc.proposalStates: Record<"<workspaceId>/<changeName>", { status, at }>
 *   引擎自有记账（浏览器 PUT 不携带此键——putSchema 无它，zod strip）。
 *   键只构造不反解（proposalStateKey 单点），故分隔符不参与任何解析。
 *
 * 清单收集单一来源（D1）：`collectProposalNames` **从 hive-voice.mjs 引入并再出口**
 * ——该模块零 node 内建依赖、可被任意模块 import；SHALL NOT 复制第二份过滤实现
 * （两处口径漂移会让语音热词与提案面板对同一目录给出不同清单）。
 */

import { collectProposalNames } from "./hive-voice.mjs";

export { collectProposalNames };

/* ── 状态枚举（D4：代码固定三值，DOM 色串 + i18n 名） ──
   色值为 **CSS 色串**；PALETTE 是 three.js 数字色（src/hive/palette.mjs），
   DOM 面板不 import 3D 调色板，仅在注释里标注语义对应：
     - reviewed 琥珀 #e8a63c ≈ PALETTE.amberAccent（STATE_COLORS.help 同族）；
     - executed 蜜金 #f2b544 = PALETTE.wallTrim / trimColor（归档/储蜜语义）；
     - paused   中性灰（无 PALETTE 对应，刻意取低饱和中性以表达「停住」）。
   条目形状 { id, color }；显示名走 i18n `hive.proposal.status.<id>`（zh/en 成对）。
   存储为字符串——将来放开自由枚举时数据格式不变。 */

export const PROPOSAL_STATUSES = Object.freeze([
  Object.freeze({ id: "reviewed", color: "#e8a63c" }),
  Object.freeze({ id: "executed", color: "#f2b544" }),
  Object.freeze({ id: "paused", color: "#9aa3ad" })
]);

/** 状态枚举值域（封闭；宿主 zod `setStatus` 与客户端受限下拉共用）。 */
export const PROPOSAL_STATUS_IDS = Object.freeze(PROPOSAL_STATUSES.map((entry) => entry.id));

/** 状态条目数上限（与 SUMMON_EDGES_LIMIT 同量级）：超限按 at 淘汰最旧。 */
export const PROPOSAL_STATES_LIMIT = 512;

/** 状态位键构造（单点；只构造不反解）。 */
export function proposalStateKey(workspaceId, name) {
  return String(workspaceId ?? "") + "/" + String(name ?? "");
}

/** 状态色查表（未知/空状态 → null，卡片无标记）。 */
export function proposalStatusColor(status) {
  return PROPOSAL_STATUSES.find((entry) => entry.id === status)?.color ?? null;
}

/* ── 归一化（形状校验 + 封顶淘汰 + scope 剪除） ── */

/** 单个状态条目的形状判定：status ∈ 枚举、at 有限数。 */
function validEntry(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const status = typeof value.status === "string" ? value.status : "";
  if (!PROPOSAL_STATUS_IDS.includes(status)) return null;
  const at = Number(value.at);
  if (!Number.isFinite(at)) return null;
  return { status, at };
}

/**
 * `doc.proposalStates` 归一化（纯函数，宿主读档与写入口共用）：
 *  - 非对象/数组 → undefined（文档无此字段）；
 *  - 键非空、值形状非法（status 枚举外 / at 非有限数）→ 丢弃该条目；
 *  - 数量封顶 PROPOSAL_STATES_LIMIT，超出按 at 淘汰最旧（**SHALL NOT 拒绝置位**
 *    ——与召唤边同思路：zod 只强校验形状，数量封顶走归一化，避免「超限走 schema
 *    拒绝 → 整档重建默认 → positions 全丢」的代价）；
 *  - scope 提供时剪除：`scope.keys` 是「本轮仍然存在的键」集合，
 *    `scope.indeterminate` 是「本轮不可判定的工作区 id」集合——命中
 *    indeterminate 前缀的键一律保留（宁留勿误删）；
 *  - 全部剪空 → undefined（宿主写入口据此摘除整键）。
 *
 * @param {unknown} raw 原始 proposalStates
 * @param {{keys?: Set<string>, indeterminate?: Set<string>}|null} [scope]
 * @returns {Record<string, {status: string, at: number}>|undefined}
 */
export function normalizeProposalStates(raw, scope = null) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  let entries = [];
  for (const [key, value] of Object.entries(raw)) {
    if (!key) continue;
    const entry = validEntry(value);
    if (!entry) continue;
    entries.push({ key, status: entry.status, at: entry.at });
  }
  if (scope) {
    const keys = scope.keys ?? null;
    const indeterminate = scope.indeterminate ?? null;
    entries = entries.filter(({ key }) => {
      if (keys?.has(key)) return true;
      /* 工作区本轮不可判定（registry 为空 / 目录 EACCES 等）→ 保留（守卫 b/c）。 */
      if (indeterminate && hasIndeterminatePrefix(key, indeterminate)) return true;
      if (!keys) return true; // 无判定面 → 不剪
      return false;
    });
  }
  if (entries.length > PROPOSAL_STATES_LIMIT) {
    entries.sort((a, b) => a.at - b.at);
    entries = entries.slice(entries.length - PROPOSAL_STATES_LIMIT); // 保留最新
  }
  if (entries.length === 0) return undefined;
  const out = {};
  for (const { key, status, at } of entries) out[key] = { status, at };
  return out;
}

/** 键是否属于某个「本轮不可判定」的工作区（前缀 = `<workspaceId>/`）。 */
function hasIndeterminatePrefix(key, indeterminate) {
  for (const workspaceId of indeterminate) {
    if (!workspaceId) continue;
    if (key.startsWith(workspaceId + "/")) return true;
  }
  return false;
}

/* ── scope 构造（三重守卫，D3） ── */

/**
 * 剪除基准构造（纯函数，注入读目录回调）：
 * 把「哪些键仍然存在」与「哪些工作区本轮不可判定」分开返回，供
 * `normalizeProposalStates` 与宿主剪除使用。
 *
 * 三重守卫（缺一不可，否则瞬时异常会全量删除贴纸且不可逆）：
 *  (a) 工作区清单为空 → `indeterminate` 置空、`keys` 为空集，调用方据此**本轮跳过**；
 *  (b) 逐个工作区读目录，`ENOENT`（目录确实消失）→ 该工作区参与剪除；
 *      其它错误（EACCES/EPERM/EMFILE…）→ 该工作区计入 `indeterminate`（本轮跳过）；
 *  (c) 读目录返回非数组/抛非 Error → 按不可判定处理（保守）。
 *
 * @param {Array<{id?: string, workspaceId?: string, path?: string}>} workspaces 在册工作区实体
 * @param {(workspacePath: string) => {ok: true, names: string[]}|{ok: false, code?: string}} readNames
 *        返回该工作区 `openspec/changes` 目录下的原始目录名（ok:false 带 code）
 * @returns {{keys: Set<string>, indeterminate: Set<string>, decidable: boolean}}
 */
export function collectProposalScope(workspaces, readNames) {
  const keys = new Set();
  const indeterminate = new Set();
  const list = Array.isArray(workspaces) ? workspaces : [];
  if (list.length === 0) return { keys, indeterminate, decidable: false };
  for (const workspace of list) {
    const workspaceId = workspaceEntityId(workspace);
    if (!workspaceId) continue; // 无 id 的实体无法构造键 → 不参与（保守：不计入 indeterminate）
    if (typeof readNames !== "function") {
      indeterminate.add(workspaceId); // 无判定回调 = 判定面不可得（保守跳过）
      continue;
    }
    const read = readNames(workspace?.path);
    if (!read || read.ok !== true) {
      /* ENOENT = 目录确实消失 → 不产出键（该工作区参与剪除）；
         其它错误 = 不可读 → 本轮不可判定（保留该工作区全部键）。 */
      if (read?.code !== "ENOENT") indeterminate.add(workspaceId);
      continue;
    }
    for (const name of collectProposalNames(read.names)) {
      keys.add(proposalStateKey(workspaceId, name));
    }
  }
  return { keys, indeterminate, decidable: true };
}

/** 工作区实体 id（`id ?? workspaceId` 双写兜底，与宿主 workspaceEntityId 同口径）。 */
function workspaceEntityId(workspace) {
  const id = typeof workspace?.id === "string" && workspace.id ? workspace.id : "";
  if (id) return id;
  const alt = typeof workspace?.workspaceId === "string" && workspace.workspaceId ? workspace.workspaceId : "";
  return alt;
}

/* ── 清单分组（D1：宿主恒返回全部在册工作区） ── */

/**
 * 提案清单分组（纯函数）：
 *  - **恒返回全部在册工作区**，无 `openspec/changes` 目录者 `changes: []`（不抛错）；
 *  - 每条目并入状态位：`status` 缺省不出现在条目上（无状态 = 无标记）；
 *  - 组内名称序（`collectProposalNames` 已排序）；
 *  - `title` 空串**原样透传**（客户端回退工作区 id，宿主不做回退——两侧分写口径）；
 *  - `path` 原样透传（召唤落点 cwd 提示用；客户端不写盘）。
 *
 * @param {Array<object>} workspaces 在册工作区实体
 * @param {(workspacePath: string) => string[]} readChanges 读该工作区未归档 change 名
 * @param {Record<string, {status: string, at: number}>} [states] `doc.proposalStates`
 * @returns {Array<{workspaceId: string, title: string, path: string,
 *                  changes: Array<{name: string, status?: string}>}>}
 */
export function buildProposalGroups(workspaces, readChanges, states) {
  const list = Array.isArray(workspaces) ? workspaces : [];
  const stateMap = states && typeof states === "object" && !Array.isArray(states) ? states : {};
  const out = [];
  for (const workspace of list) {
    const workspaceId = workspaceEntityId(workspace);
    if (!workspaceId) continue;
    const names = collectProposalNames(typeof readChanges === "function" ? readChanges(workspace?.path) : []);
    const changes = names.map((name) => {
      const entry = stateMap[proposalStateKey(workspaceId, name)];
      /* 状态位经枚举封闭校验后才并出（枚举外/缺省 → 条目不带 status = 卡片无标记）；
         正常路径上 doc.proposalStates 已被 normalizeProposalStates 过滤，此处为双保险。 */
      const status = PROPOSAL_STATUS_IDS.includes(entry?.status) ? entry.status : "";
      return status ? { name, status } : { name };
    });
    out.push({
      workspaceId,
      title: typeof workspace?.title === "string" ? workspace.title : "",
      path: typeof workspace?.path === "string" ? workspace.path : "",
      changes
    });
  }
  return out;
}

/* ── 报告让位 reserve（R13：由 status-cards.mjs 的 statusBarReserve 原样迁移改名） ──
   机制保留换主（作战报告面板下缘让位量），dock-yield.mjs 不动。 */

/** 作战报告面板展开态头部占高（标题行 padding 8px×2 + line-height 16px + 底边线）。 */
export const REPORT_HEAD_PX = 34;
/** 作战报告折叠态 pill 高（padding 6px×2 + line-height 18px）。 */
export const REPORT_PILL_PX = 30;
/** 展开态列表每行高（padding 4px×2 + line-height 16px，见 styles 的 --jyv-report-rows 口径）。 */
export const REPORT_ROW_PX = 24;
/** 展开态列表额外边距（padding 6px×2 = 12px，见 .jyv-combatLogList）。 */
export const REPORT_LIST_PAD_PX = 12;

/**
 * 报告让位 reserve 计算（面板下缘让位给作战报告面板的占位高度，px）：
 *  - 收起（reportCollapsed）→ pill 高；
 *  - 展开 → rows×24px + 头部 + 列表边距。
 * @param {{ reportCollapsed?: boolean, reportRows?: number }} input
 * @returns {number} reserve 像素高度（≥0）
 */
export function panelReserve({ reportCollapsed, reportRows } = {}) {
  if (reportCollapsed === true) return REPORT_PILL_PX;
  const rows = Math.max(0, Math.floor(Number(reportRows) || 0));
  return REPORT_HEAD_PX + rows * REPORT_ROW_PX + REPORT_LIST_PAD_PX;
}
