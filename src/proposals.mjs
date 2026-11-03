/**
 * 提案纯逻辑单点（add-proposal-panel，design D1/D3/D4 + R13；
 * proposal-panel-config 增量 D1/D3/D4）：提案清单收集口径、状态列表归一化与名称
 * 回退链、`proposalStates` 归一化/剪除/封顶、面板报告让位 reserve。
 * 独立模块——宿主 index.mjs 消费（路由/剪除）、浏览器 client.jsx 消费（状态色与
 * 名称）、test/proposals-smoke.mjs 冒烟直测。
 *
 * 数据形状（layout doc optional 字段，version 1 不变）：
 *   doc.proposalStates:   Record<"<workspaceId>/<changeName>", { status, at }>
 *   doc.proposalStatuses: Array<{ id, color, name? }>（封顶 16；缺省 = 出厂四值）
 *   两者均为引擎自有记账（浏览器 PUT 不携带——putSchema 无它们，zod strip）。
 *   键只构造不反解（proposalStateKey 单点），故分隔符不参与任何解析。
 *
 * 校验口径（proposal-panel-config D4）：全链**从「封闭枚举」放宽为「形状校验」**，
 * 语义判断后置到消费点（置位路由 400 / 执行点静默跳过 / 卡片无标记）。
 *
 * 清单收集单一来源（D1）：`collectProposalNames` **从 hive-voice.mjs 引入并再出口**
 * ——该模块零 node 内建依赖、可被任意模块 import；SHALL NOT 复制第二份过滤实现
 * （两处口径漂移会让语音热词与提案面板对同一目录给出不同清单）。
 */

import { collectProposalNames } from "./hive-voice.mjs";

export { collectProposalNames };

/* ── 状态列表（proposal-panel-config D1/D3：由布局文档 `proposalStatuses` 承载） ──
   色值为 **CSS 色串**；PALETTE 是 three.js 数字色（src/hive/palette.mjs），
   DOM 面板不 import 3D 调色板，仅在注释里标注语义对应：
     - reviewed 琥珀 #e8a63c ≈ PALETTE.amberAccent（STATE_COLORS.help 同族）；
     - executed 蜜金 #f2b544 = PALETTE.wallTrim / trimColor（归档/储蜜语义）；
     - paused   中性灰（无 PALETTE 对应，刻意取低饱和中性以表达「停住」）；
     - archived 低饱和青灰 #7d8ca3（收档语义，避开既有三色；评审期可调项）。
   条目形状 { id, color, name? }；显示名回退链见 `proposalStatusName`。
   本常量是**出厂默认列表**（文档无该字段时的读侧回退，SHALL NOT 落盘）。 */

export const PROPOSAL_STATUSES = Object.freeze([
  Object.freeze({ id: "reviewed", color: "#e8a63c" }),
  Object.freeze({ id: "executed", color: "#f2b544" }),
  Object.freeze({ id: "paused", color: "#9aa3ad" }),
  Object.freeze({ id: "archived", color: "#7d8ca3" })
]);

/** 出厂默认值域（工厂 id 判定用：名称回退链第二段 = i18n `hive.proposal.status.<id>`）。 */
export const PROPOSAL_STATUS_IDS = Object.freeze(PROPOSAL_STATUSES.map((entry) => entry.id));

/** 状态列表条目数上限（写侧 400 拒绝 / 读档截断保留前 16）。 */
export const PROPOSAL_STATUS_LIMIT = 16;

/** 状态条目 id 字符上限（trim 后；构造后不参与任何解析语义）。 */
export const PROPOSAL_STATUS_ID_MAX = 32;

/** 状态条目显示名长度上限（trim 后；超出写侧 400、读档条目丢弃）。 */
export const PROPOSAL_STATUS_NAME_MAX = 24;

/** 十六进制色串（`#rgb` / `#rrggbb`，大小写不敏感）。 */
const STATUS_COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/* ── 状态列表归一化（读档宽容 / 写侧复用） ── */

/**
 * `doc.proposalStatuses` 归一化（纯函数，宿主读档与写入口共用）：
 *  - 非数组 → undefined（文档无此字段 = 回退出厂四值）；
 *  - 坏条目（非对象 / id 非字符串或 trim 后为空或超 32 字符 / color 非 `#rgb|#rrggbb`
 *    / name 非字符串或 trim 后超 24 字符）→ **丢弃该条目**；
 *  - `name` trim 后为空 → 不产出该键（呈现侧走回退链）；
 *  - **列表内 id 唯一**：重复 id **丢弃后续**条目（重复 id 会让置位匹配、色查表与
 *    下拉 key 全部歧义）；
 *  - 超封顶 `PROPOSAL_STATUS_LIMIT` → 截断保留前 16（SHALL NOT 因个别条目非法而
 *    整档重建默认文档）；全表归一化后为空 → undefined。
 *
 * @param {unknown} raw 原始 proposalStatuses
 * @returns {Array<{id: string, color: string, name?: string}>|undefined}
 */
export function normalizeProposalStatuses(raw) {
  if (!Array.isArray(raw)) return undefined;
  const seen = new Set();
  const out = [];
  for (const item of raw) {
    if (out.length >= PROPOSAL_STATUS_LIMIT) break; // 封顶：保留前 16
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const id = typeof item.id === "string" ? item.id.trim() : "";
    if (!id || id.length > PROPOSAL_STATUS_ID_MAX) continue;
    if (seen.has(id)) continue; // 重复 id → 丢弃后续
    const color = typeof item.color === "string" ? item.color.trim() : "";
    if (!STATUS_COLOR_RE.test(color)) continue;
    seen.add(id);
    const entry = { id, color };
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (name.length > PROPOSAL_STATUS_NAME_MAX) continue; // 名称超限 → 条目非法
    if (name) entry.name = name;
    out.push(entry);
  }
  return out.length > 0 ? out : undefined;
}

/**
 * **有效状态列表**（缺省合并的单点，D2）：`doc.proposalStatuses` 归一化结果非空
 * 即以其为准，否则回退出厂四值（`PROPOSAL_STATUSES`）。卡片渲染、执行守卫、
 * 置位校验、槽位下拉、素材编辑五处**共用本函数**——SHALL NOT 各自写一份 `??` 兜底。
 *
 * @param {unknown} raw `doc.proposalStatuses`
 * @returns {Array<{id: string, color: string, name?: string}>}（恒非空；缺省 = 出厂四值）
 */
export function effectiveProposalStatuses(raw) {
  const normalized = normalizeProposalStatuses(raw);
  return normalized ?? PROPOSAL_STATUSES;
}

/** 状态列表条目查表（未知/空 id → null = 卡片无标记；列表缺省 = 出厂四值）。 */
export function proposalStatusOf(list, id) {
  if (typeof id !== "string" || !id) return null;
  const source = Array.isArray(list) ? list : PROPOSAL_STATUSES;
  return source.find((entry) => entry?.id === id) ?? null;
}

/** 状态 id 是否在当前列表（置位路由与执行守卫共用口径）。 */
export function isKnownProposalStatus(list, id) {
  return proposalStatusOf(list, id) !== null;
}

/**
 * 提案槽位执行结果分流（new-session-hotbar 3.3/D6）：**置位判据 = 「召唤请求被宿主
 * 接受」**（`result.ok === true`），与投递/填稿结果无关——审查路径会话已建即执行事实
 * 成立，投递结果不回溯改判。`review` = 未勾自动发送的审查收尾（种子稿 + 关页直达），
 * 仅在请求被接受后成立。
 *
 * @param {{ok?: boolean}|null|undefined} result POST /summon 的客户端响应
 * @param {{autoSend?: boolean}|null|undefined} slot 槽位
 * @returns {{accepted: boolean, review: boolean}}
 */
export function proposalSlotOutcome(result, slot) {
  const accepted = result?.ok === true;
  return { accepted, review: accepted && slot?.autoSend !== true };
}

/* ── 名称与颜色（回退链单点，D3） ── */

/**
 * 状态名称回退链（纯函数单点；卡片标记/下拉/悬停共用）：
 *  1. 条目 `name` 非空 → **字面呈现**；
 *  2. `name` 空缺且为工厂 id（出厂四值）→ 回退 i18n 键 `hive.proposal.status.<id>`
 *     （zh/en 成对；英文界面不被出厂中文名绑架）；
 *  3. `name` 空缺且为自定义 id → 呈现**字面 id**（存储宽容、呈现确定）。
 *
 * @param {{id?: string, name?: string}|null} entry 列表条目
 * @returns {string} （未知条目 → ""；`translate` 未提供时 i18n 段回退为整键字面）
 */
export function proposalStatusName(entry, translate) {
  if (!entry || typeof entry.id !== "string" || !entry.id) return "";
  const name = typeof entry.name === "string" ? entry.name.trim() : "";
  if (name) return name;
  if (PROPOSAL_STATUS_IDS.includes(entry.id)) {
    const key = "hive.proposal.status." + entry.id;
    const resolved = typeof translate === "function" ? translate(key) : undefined;
    return typeof resolved === "string" && resolved ? resolved : entry.id;
  }
  return entry.id;
}

/** 状态色查表（`list` 为当前列表，缺省 = 出厂四值；未知/空状态 → null，卡片无标记）。
 *  两参顺序刻意与 `proposalStatusColor(status, list)` 的既有调用面一致。 */
export function proposalStatusColor(status, list) {
  const entry = proposalStatusOf(list, status);
  return entry?.color ?? null;
}

/** 状态条目数上限（与 SUMMON_EDGES_LIMIT 同量级）：超限按 at 淘汰最旧。 */
export const PROPOSAL_STATES_LIMIT = 512;

/** 提案面板单行像素（卡片 28px + 列表 gap 6px；面板高度滑杆的「行 → px」折算口径，
 *  与 settings.mjs 的 `proposalRows` 界（3–32、默认 24）配套使用）。 */
export const PROPOSAL_ROW_PX = 34;

/** 状态位键构造（单点；只构造不反解）。 */
export function proposalStateKey(workspaceId, name) {
  return String(workspaceId ?? "") + "/" + String(name ?? "");
}

/**
 * 状态列表**渲染期**名称查表（UI 单点）：把列表条目索引成 `id → 名称` 的取值函数，
 * 名称经 `proposalStatusName` 回退链（字面 name → 工厂 id i18n → 自定义 id 字面）。
 * 组件只构造一次并复用（卡片标记、悬停 title、槽位下拉、设置节编辑器四处共用）。
 *
 * @param {Array<{id: string, name?: string}>} list 有效状态列表
 * @param {(key: string) => string} [translate] i18n 取值函数
 * @returns {(id: string) => string} 取值函数（未知 id → ""）
 */
export function buildProposalStatusName(list, translate) {
  const source = Array.isArray(list) ? list : PROPOSAL_STATUSES;
  const names = new Map(source.map((entry) => [entry?.id, proposalStatusName(entry, translate)]));
  return (id) => names.get(id) ?? "";
}

/**
 * 设置模态状态编辑器草稿归一化（UI 侧，与宿主写侧校验**同规则**）：
 * 编辑器行是半成品（用户正在敲名称/取色），故本函数只做**安全裁剪**而非拒绝——
 *  - 条目顺序原样保留（草稿数组序 = 保存后的呈现序）；
 *  - `id` 原样透传（写入时一次生成的稳定键，构造后不参与解析）；
 *  - `name` 原样透传**不 trim**（正在输入的中间态不得被吞字符；落盘前由宿主 trim）；
 *  - `color` 非字符串 → 落回出厂首色（取色器给不出非法值，此处只防手改草稿）。
 * 真正的拒绝（颜色格式 / 名称超限 / id 重复 / 封顶）在保存时的宿主 400 上呈现。
 *
 * @param {unknown} raw
 * @returns {Array<{id: string, color: string, name: string}>}（缺省 = 出厂四值的可编辑副本）
 */
export function sanitizeProposalStatusesDraft(raw) {
  const source = Array.isArray(raw) && raw.length > 0 ? raw : PROPOSAL_STATUSES;
  const fallbackColor = PROPOSAL_STATUSES[0].color;
  return source.map((entry) => ({
    id: typeof entry?.id === "string" ? entry.id : "",
    color: typeof entry?.color === "string" && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(entry.color.trim())
      ? entry.color.trim()
      : fallbackColor,
    name: typeof entry?.name === "string" ? entry.name : ""
  }));
}

/* ── 归一化（形状校验 + 封顶淘汰 + scope 剪除） ── */

/** 单个状态条目的形状判定：status **非空字符串**（D4：形状校验，SHALL NOT 枚举封闭）、
 *  at 有限数。孤儿/自定义状态值一律保留——按枚举剪除会让「删状态即丢历史戳」。 */
function validEntry(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const status = typeof value.status === "string" ? value.status.trim() : "";
  if (!status) return null;
  const at = Number(value.at);
  if (!Number.isFinite(at)) return null;
  return { status, at };
}

/**
 * `doc.proposalStates` 归一化（纯函数，宿主读档与写入口共用）：
 *  - 非对象/数组 → undefined（文档无此字段）；
 *  - 键非空、值形状非法（status 非字符串/空白 / at 非有限数）→ 丢弃该条目；
 *    `status` 只做**形状校验**（D4）：不在当前列表或出厂枚举中的值 SHALL NOT 被剪除
 *    ——状态列表可配置后，按枚举剪除等于「用户删一个状态就丢一批历史戳」；
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
 *  - 每条目并入状态位：`status` 缺省**或不在当前状态列表**时不出现在条目上
 *    （无标记 = 数据保留但不呈现——D4：把「枚举封闭」双保险换成「在当前列表中」判定，
 *    孤儿戳不再当状态透出）；
 *  - 组内名称序（`collectProposalNames` 已排序）；
 *  - `title` 空串**原样透传**（客户端回退工作区 id，宿主不做回退——两侧分写口径）；
 *  - `path` 原样透传（召唤落点 cwd 提示用；客户端不写盘）。
 *
 * @param {Array<object>} workspaces 在册工作区实体
 * @param {(workspacePath: string) => string[]} readChanges 读该工作区未归档 change 名
 * @param {Record<string, {status: string, at: number}>} [states] `doc.proposalStates`
 * @param {Array<{id: string}>} [statuses] **有效状态列表**（调用方经
 *        `effectiveProposalStatuses(doc.proposalStatuses)` 取得——缺省合并的单点不在此处，
 *        本函数保持纯入参）；缺省 = 出厂四值（旧调用方零回归）
 * @returns {Array<{workspaceId: string, title: string, path: string,
 *                  changes: Array<{name: string, status?: string}>}>}
 */
export function buildProposalGroups(workspaces, readChanges, states, statuses) {
  const list = Array.isArray(workspaces) ? workspaces : [];
  const stateMap = states && typeof states === "object" && !Array.isArray(states) ? states : {};
  const statusList = Array.isArray(statuses) && statuses.length > 0 ? statuses : PROPOSAL_STATUSES;
  const known = new Set(statusList.map((entry) => entry?.id).filter(Boolean));
  const out = [];
  for (const workspace of list) {
    const workspaceId = workspaceEntityId(workspace);
    if (!workspaceId) continue;
    const names = collectProposalNames(typeof readChanges === "function" ? readChanges(workspace?.path) : []);
    const changes = names.map((name) => {
      const entry = stateMap[proposalStateKey(workspaceId, name)];
      /* 状态位在当前列表中才并出（列表外/缺省 → 条目不带 status = 卡片无标记）；
         正常路径上 doc.proposalStates 已被 normalizeProposalStates 过滤，此处为双保险。 */
      const status = known.has(entry?.status) ? entry.status : "";
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
