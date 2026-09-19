/**
 * dsh-v-hive — 宿主半区。
 *
 * 为浏览器半区提供布局持久化与跨页签同步（design.md D8）：
 *  - GET  /api/dsh-hive/state            读布局文档（无/损坏 → 重建默认螺旋布局）
 *  - PUT  /api/dsh-hive/state            写布局文档：zod 校验 + revision 乐观锁
 *                                        （不匹配 → 409 带最新文档，客户端重拉重放）
 *  - GET  /api/dsh-hive/events           SSE：布局变更广播 {type:"layout-changed", doc}
 *                                        + 引擎状态帧 {type:"bee-engine", ...}
 *                                        （多页签实时同步；心跳注释防代理断连）
 *  - POST /api/dsh-hive/send            蜂栏直发（context-hotbar-rework 保留，
 *                                        原 hive-quick-commands 直发通道）：
 *                                        { sessionId, prompt } → agent.followup 五连
 *                                        （randomUUID / role:user / content text /
 *                                        source kind:user / deepFreeze(structuredClone)，
 *                                        与 dsh-jiyu-skill-links /run 同构）。
 *  - POST /api/dsh-hive/summon          槽位召唤（context-hotbar-rework D4）：
 *                                        { workspaceId, beeTypeId?, prompt?, autoSend }
 *                                        → create → 绑蜂种 → selectModel → 非空
 *                                        prompt 且 autoSend 真经 sessionController.prompt
 *                                        直调投递（绕 serialized 车道），否则只建不发；
 *                                        两分支均返 sessionId。
 *  - POST /api/dsh-hive/hatch            手动孵化（custom-bee-types）：{sessionId, capabilityId}
 *                                        → spawn 链直通，绕过车道（用户显式指令，审阅 F6）。
 *  - POST /api/dsh-hive/lane             车道手动操作：{workspaceId, action, sessionId?}
 *                                        （release 放行 / clear 清空 / cancel 取消等待项）。
 *  - GET  /api/dsh-hive/models           模型目录代理（浮窗下拉数据源，S4 复验定稿）：
 *                                        ?sessionId=<活会话>（哨兵）→ sessionController.modelCatalog()。
 *
 * 能力引擎（custom-bee-types，design D1/D2–D6）：监听 agent/turn-stopping（主触发）
 * 与 agent/status→idle（兜底），对最后一条 assistant 消息做四重门评估
 * （src/capabilities.mjs 纯函数），按声明顺序执行 send/spawn/notify 动作；
 * serialized 蜂型动作经巢级车道（src/lane.mjs）FIFO 互斥；门状态（vars/latches/
 * watermarks）持久化进布局文档 beeEngineState（D4）。蜂种配置为空时引擎旁路
 * （每次事件一次布尔判断，零开销，任务 3.8）。
 *
 * 存储：profile storages 目录下 `<home>/storages/dsh-hive.json` 单文件（storage-json
 * 同款语义：内存态即全量、temp 写 + rename 原子替换）。刻意不走 ctx.storageDomain
 * —— 其 domain/changed 是进程内事件，跨页签同步退化为 focus 补拉（R5）。
 *
 * 并发正确性：PUT 携带读取时的 revision，宿主校验不匹配即拒绝——两个页签同时
 * 搬巢时后写者不会被静默覆盖（与官方 settings 的 revision fencing 同思路）。
 */

import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, openSync, readFileSync, closeSync, writeSync, fdatasyncSync, renameSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  cascadeDeleteBeeType,
  boundBeeTypeOf,
  beeTypeById,
  normalizeAssignments,
  normalizeEngineState,
  normalizeBeeTypes,
  validateBeeTypesDraft
} from "./bee-types.mjs";
import {
  FUSE_LIMITS,
  applyHitsToSessionState,
  buildAutoMessage,
  buildSummonMessage,
  childChainDepth,
  createFuseCounters,
  evaluateBeeType,
  fuseVerdict,
  interpolateTemplate,
  isAutoPrefixed,
  recordFuseAction,
  resetFuseOnUserMessage
} from "./capabilities.mjs";
import { createLane, laneMode } from "./lane.mjs";
import { MAX_STATUS_CARDS, normalizeStatusCards } from "./status-cards.mjs";

export const name = "dsh-v-hive";

/** agents：/send 直发与引擎事件；sessionController：spawn 建会话/选模型/投递
 *  与模型目录（S1 复验定稿，DSH 0.1.2-rc.1 直调形状）；
 *  workspaceRegistry：会话归属与归档清单（车道键 + 入口过滤）。
 *  tools（hive-summon-tool spike 0.1）：hive_summon/hive_wait 注册面 —— mcp-client
 *  同机制先例（inject=["tools"] → ctx.tools.register）。 */
export const inject = ["webServer", "agents", "sessionController", "workspaceRegistry", "tools"];

/** prompt 直调的第二参数：SessionController.prompt(request, signal) 首行
 *  signal.throwIfAborted()——网关路径由网关注入永不中止信号，插件直调自铸同构信号
 *  （spike 复验 δ1，explore.md 复验记录）。 */
const NEVER_ABORTED_SIGNAL = new AbortController().signal;

const API_PREFIX = "/api/dsh-hive";
const DOC_VERSION = 1;
const MAX_BODY_BYTES = 512 * 1024;

/* ── 布局文档 schema（zod，入库前强校验；损坏/超版本文档丢弃重建，D8） ──
   （context-hotbar-rework：旧快捷指令 commands 字段已拆除——存量残留随下次
   写入自然剥离，不做迁移；道具栏配置 hotbars 见任务 3.1。） */

const cellSchema = z.object({ q: z.number().int(), r: z.number().int() });

const cameraSchema = z
  .object({
    theta: z.number(),
    phi: z.number(),
    dist: z.number(),
    tx: z.number(),
    tz: z.number()
  })
  .nullable();

/* ── 蜂种（custom-bee-types 任务 3.1，D7）：zod 只管结构；语义级校验（非空名/
      保留字/重复 id/模板可编译性/spawn 目标）统一走 validateBeeTypesDraft，
      以拿到字段级原因（400 + {field, code}）。 ── */

const beeTypeModelSchema = z.object({
  provider: z.string(),
  model: z.string(),
  reasoningEffort: z.string().optional()
});

const capabilityTriggerSchema = z
  .object({
    capture: z.record(z.string(), z.string()).optional(),
    filePredicate: z.string().optional()
  })
  .optional();

const capabilityActionSchema = z.object({
  type: z.enum(["send", "spawn", "notify", "conductor"]),
  promptTemplate: z.string().optional(),
  targetBeeTypeId: z.string().optional()
});

const capabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  trigger: capabilityTriggerSchema,
  action: capabilityActionSchema,
  once: z.boolean().optional()
});

const beeTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  model: beeTypeModelSchema.optional(),
  beeModel: z.string().optional(),
  /* 预设提示词（hive-summon-tool）：optional 字段，布局文档 version 1 不变，
     旧文档缺省兼容（读取路径 normalizeBeeTypes 按缺失处理）；长度/语义校验走
     validateBeeTypesDraft（字段级 400），zod 只管结构。 */
  presetPrompt: z.string().optional(),
  queuePolicy: z.enum(["free", "serialized"]).optional(),
  capabilities: z.array(capabilitySchema).optional()
});

const beeTypesSchema = z.array(beeTypeSchema).max(16);

const beeAssignmentsSchema = z.record(z.string(), z.string());

const beeEngineStateSchema = z.record(
  z.string(),
  z.object({
    vars: z.record(z.string(), z.string()).optional(),
    latches: z.record(z.string(), z.array(z.string())).optional(),
    watermarks: z.record(z.string(), z.number().int().nonnegative()).optional()
  })
);

/* ── 情境道具栏 hotbars（context-hotbar-rework D3）：一套槽位形状 + 按栏裁剪。
      strict 对象——栏不适用的字段（巢栏 createBee、蜂栏 summon/beeTypeId/
      createBee、地板栏 summon）直接 400（字段级原因，与浏览器侧
      validateSlotDraft 同口径）；每栏上限 32（审阅 F7）；id 栏内唯一、
      name trim 非空且栏内唯一；蜂栏 prompt trim 非空；巢/地板栏 prompt 仅在
      召唤/建蜂开启时接受（字段联动，空白 = 纯召唤/纯建蜂合法）。 ── */

const HOTBAR_COLUMN_LIMIT = 32;

const hotbarHiveSlotSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().trim().min(1),
    summon: z.boolean(),
    beeTypeId: z.string().optional(),
    prompt: z.string().optional(),
    autoSend: z.boolean()
  })
  .strict();

const hotbarBeeSlotSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().trim().min(1),
    prompt: z.string().trim().min(1),
    autoSend: z.boolean()
  })
  .strict();

const hotbarFloorSlotSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().trim().min(1),
    createBee: z.boolean(),
    beeTypeId: z.string().optional(),
    prompt: z.string().optional(),
    autoSend: z.boolean()
  })
  .strict();

/** 按栏数组级校验：唯一性（id/name）+ 巢/地板栏提示词字段联动。 */
function hotbarColumnRefinements(schema, kind) {
  return schema
    .max(HOTBAR_COLUMN_LIMIT)
    .refine(
      (list) => {
        const ids = new Set();
        const names = new Set();
        for (const slot of list) {
          if (ids.has(slot.id) || names.has(slot.name)) return false;
          ids.add(slot.id);
          names.add(slot.name);
        }
        return true;
      },
      { message: "duplicate id or name in column" }
    )
    .refine(
      (list) => {
        if (kind === "bee") return true;
        const gateKey = kind === "hive" ? "summon" : "createBee";
        return list.every((slot) => !slot.prompt || !slot.prompt.trim() || slot[gateKey] === true);
      },
      { message: "prompt requires the summon/createBee switch on" }
    );
}

const hotbarsSchema = z
  .object({
    hive: hotbarColumnRefinements(z.array(hotbarHiveSlotSchema), "hive"),
    bee: hotbarColumnRefinements(z.array(hotbarBeeSlotSchema), "bee"),
    floor: hotbarColumnRefinements(z.array(hotbarFloorSlotSchema), "floor")
  })
  .strict();

/* ── 状态卡片 statusCards（bee-status-cards D3）：strict record（蜂种 id → { prompt, autoSend }），
      值形状固定、键数上限 16（与蜂种上限对齐）。宿主只管结构（zod）；语义校验（prompt
      非空 = 已配置、默认蜂 SHALL NOT 拥有键）在客户端——读取路径 normalizeStatusCards
      丢弃悬空键与非法值，蜂种删除级联清理对应键。version 1 不变。 ── */

const statusCardSchema = z
  .object({
    prompt: z.string(),
    autoSend: z.boolean()
  })
  .strict();

const statusCardsSchema = z
  .record(z.string(), statusCardSchema)
  .refine((record) => Object.keys(record).length <= MAX_STATUS_CARDS, {
    message: "too many status card entries (limit " + MAX_STATUS_CARDS + ")"
  });

/* ── 召唤边 summonEdges（hive-interaction-polish 2.1/D7）：optional 字段、version 1
      不变（presetPrompt 先例）。形状 = Record<childSessionId, { parentId, at }>，
      引擎自有记账（浏览器半区不写此字段——PUT 侧不收，zod strip 未知键）。
      zod 强校验形状；数量封顶与非法条目清理走 normalizeSummonEdges（超出按 at
      淘汰最旧，SHALL NOT 拒绝召唤或使召唤失败）——刻意不做 zod 级 refine 拒绝：
      存档超限若走 schema 拒绝会整档重建默认（positions 全丢），代价不成比例。 ── */

export const SUMMON_EDGES_LIMIT = 512;

const summonEdgeSchema = z.object({
  parentId: z.string().min(1),
  at: z.number()
});

const summonEdgesSchema = z.record(z.string().min(1), summonEdgeSchema);

const docSchema = z.object({
  version: z.literal(DOC_VERSION),
  revision: z.number().int().nonnegative(),
  positions: z.record(z.string(), cellSchema),
  camera: cameraSchema.optional(),
  hotbars: hotbarsSchema.optional(),
  beeTypes: beeTypesSchema.optional(),
  beeAssignments: beeAssignmentsSchema.optional(),
  beeEngineState: beeEngineStateSchema.optional(),
  statusCards: statusCardsSchema.optional(),
  summonEdges: summonEdgesSchema.optional()
});

const putSchema = z.object({
  revision: z.number().int().nonnegative(),
  positions: z.record(z.string(), cellSchema).optional(),
  camera: cameraSchema.optional(),
  hotbars: hotbarsSchema.optional(),
  beeTypes: beeTypesSchema.optional(),
  beeAssignments: beeAssignmentsSchema.optional(),
  beeEngineState: beeEngineStateSchema.optional(),
  statusCards: statusCardsSchema.optional()
});

function defaultDoc() {
  return { version: DOC_VERSION, revision: 0, positions: {}, camera: null };
}

/**
 * 召唤边归一化（hive-interaction-polish 2.1/2.3，纯函数供冒烟直测）：
 *  - 非法条目丢弃（childId/parentId 非空串、at 为有限数，其余形状错误一律剪）；
 *  - 数量封顶 SUMMON_EDGES_LIMIT，超出按 at 淘汰最旧（SHALL NOT 拒绝召唤）；
 *  - 失效过滤（scope 提供时）：端点会话已消失（不在任一 workspace sessionIds 且不在
 *    ctx.agents 在册）或已归档（archivedSessionIds 命中）即剪除。归档判定 SHALL 并查
 *    archivedSessionIds——归档会话仍保留在 workspace sessionIds 中（储蜜层镜像语义，
 *    蜜杯按巢内账号镜像推导），仅查 sessionIds 会漏剪。
 *
 * @param {*} edges 原始记录（无/形状非法 → undefined = 文档无此字段）
 * @param {{liveSessionIds?: Set<string>, archivedSessionIds?: Set<string>,
 *          agentIds?: Set<string>|((id: string) => boolean)}} [scope]
 *        失效判定基准（缺省 = 只做归一化不过滤——parseStoredDoc 读档时 registry 语义
 *        不可得，失效剪除只在宿主半区持久化写入点进行，D7）
 * @returns {Record<string, {parentId: string, at: number}>|undefined}
 */
export function normalizeSummonEdges(edges, scope = null) {
  if (!edges || typeof edges !== "object" || Array.isArray(edges)) return undefined;
  let entries = [];
  for (const [childId, edge] of Object.entries(edges)) {
    if (!childId || typeof edge !== "object" || edge === null) continue;
    const { parentId, at } = edge;
    if (typeof parentId !== "string" || !parentId) continue;
    if (typeof at !== "number" || !Number.isFinite(at)) continue;
    entries.push({ childId, parentId, at });
  }
  if (scope) {
    const archived = scope.archivedSessionIds ?? null;
    const live = scope.liveSessionIds ?? null;
    const agents = scope.agentIds ?? null;
    const inAgents = (id) => (typeof agents === "function" ? Boolean(agents(id)) : agents ? agents.has(id) : false);
    const vanished = (id) => {
      if (archived?.has(id)) return true; // 归档即失效（并查陷阱，D7）
      if ((live && live.has(id)) || inAgents(id)) return false;
      return Boolean(live || agents); // 有判定面但两端皆无着落 → 会话已消失
    };
    entries = entries.filter(({ childId, parentId }) => !vanished(childId) && !vanished(parentId));
  }
  if (entries.length > SUMMON_EDGES_LIMIT) {
    entries.sort((a, b) => a.at - b.at);
    entries = entries.slice(entries.length - SUMMON_EDGES_LIMIT); // 保留最新（按 at 淘汰最旧）
  }
  if (entries.length === 0) return undefined; // 全部失效/非法 → 无此字段（宿主写入口据此摘除整键）
  const out = {};
  for (const { childId, parentId, at } of entries) out[childId] = { parentId, at };
  return out;
}

/**
 * 召唤边记账（hive-interaction-polish 2.2/D7，纯函数）：executeSummon 成功路径调用——
 * childId → { parentId, at }（同 child 重复召唤覆盖 = 最新事实）；沿用
 * normalizeSummonEdges 完成封顶淘汰与脏数据清理。
 */
export function recordSummonEdge(edges, childId, parentId, at = Date.now()) {
  return normalizeSummonEdges({ ...(edges ?? {}), [childId]: { parentId, at } });
}

/* ── 存储路径：$DSH_HOME（非空）优先，否则 ~/.dsh（对齐 dsh-home-paths 语义） ── */

export function storagePath(env = process.env) {
  const envHome = typeof env.DSH_HOME === "string" ? env.DSH_HOME.trim() : "";
  const home = envHome || join(homedir(), ".dsh");
  return join(home, "storages", "dsh-hive.json");
}

/* ── 工具召唤的调用方巢解析（hive-summon-tool D2，纯函数） ──
   无人机不在任何巢的 sessionIds 中（subagent 架构既定），其巢 = 发起会话所属巢：
   沿会话头 parentSession 链上溯至非 subagent 会话再反查；cwd×path 匹配兜底；
   无巢（野蜂）返回 null。主会话（非 subagent）在首节点即走同一反查。 */

/** 上溯深度上限（环防御二道闸；正常链深 ≤ delegationDepth 上限，32 远超其实）。 */
const MAX_PARENT_CHAIN_DEPTH = 32;

/**
 * 解析调用方会话所属巢 id，无巢返回 null。依赖注入形式（agents: 会话注册表
 * `get` 形、registry: workspaceRegistry 形），便于纯函数冒烟直测。
 *
 * 解析顺序（D2）：对链上每个会话先做 `registry.list()` 的 `sessionIds` 反查
 * （巢归属权威面；无人机不在册 → 实际由根会话命中）；整条链反查未命中时以
 * 首个 `header.cwd` 与 registry `path` 相等的会话兜底；仍未命中 → null。
 * 上溯防御：visited 集合断环 + 深度上限；registry 未就绪/抛错按空注册表兜底。
 *
 * @param {object} [agent] 调用方 agent（`session.header` 形；缺省 → null）
 * @param {object} [deps] `{ agents: { get(id) }, registry: { list() } }`
 * @returns {string|null} workspaceId
 */
export function resolveCallerWorkspace(agent, deps = {}) {
  if (!agent?.session?.header) return null;
  const listWorkspaces = () => {
    try {
      return deps.registry?.list?.() ?? [];
    } catch {
      return []; // registry 未就绪按野蜂处理（spec：结构化报错而非裸异常）
    }
  };
  const workspaceHolding = (sessionId) => {
    for (const workspace of listWorkspaces()) {
      if (workspace?.sessionIds?.includes(sessionId)) return workspace.id;
    }
    return null;
  };
  const workspaceByCwd = (cwd) => {
    if (!cwd) return null;
    for (const workspace of listWorkspaces()) {
      if (workspace?.path === cwd) return workspace.id;
    }
    return null;
  };
  const visited = new Set();
  let cwdFallback = null;
  let current = agent;
  for (let depth = 0; depth < MAX_PARENT_CHAIN_DEPTH; depth++) {
    const sessionId = current.session?.header?.id;
    if (!sessionId || visited.has(sessionId)) break; // 环：自引用/重复访问 → 停止上溯
    visited.add(sessionId);
    const held = workspaceHolding(sessionId);
    if (held) return held;
    if (cwdFallback === null) {
      cwdFallback = workspaceByCwd(current.session.header.cwd); // 最近祖先的 cwd 匹配候选
    }
    const header = current.session.header;
    if (header.origin !== "subagent" || !header.parentSession) break; // 非无人机根：上溯终点
    const parent = deps.agents?.get?.(header.parentSession);
    if (!parent?.session?.header) break; // 父会话不在册（已归档/离线）：止于 cwd 兜底
    current = parent;
  }
  return cwdFallback;
}

/**
 * 工具召唤保险丝记账归属（hive-summon-tool D5，纯函数）：parentSession 链上溯出的
 * 非 subagent 根会话 id。无人机是短命会话，按其自身记账会每单清零；链深与 spawn
 * 计数记账到根（chainDepth = 根 + 1）。上溯失败（父离线/环）回落链上最深可解析
 * 会话（保守记账，防绕过）。deps 同 resolveCallerWorkspace（`{ agents }`）。
 */
export function fuseRootSessionId(agent, deps = {}) {
  const visited = new Set();
  let current = agent;
  let last = null;
  for (let depth = 0; depth < MAX_PARENT_CHAIN_DEPTH; depth++) {
    const sessionId = current?.session?.header?.id;
    if (!sessionId || visited.has(sessionId)) break;
    visited.add(sessionId);
    last = sessionId;
    const header = current.session?.header;
    if (header?.origin !== "subagent" || !header.parentSession) return sessionId; // 非 drone 根
    const parent = deps.agents?.get?.(header.parentSession);
    if (!parent?.session?.header) break; // 父不在册（离线/归档）：保守记账到已解析的最深节点
    current = parent;
  }
  return last;
}

/* ── 原子读写（storage-json 同款：temp 写 + fsync + rename 替换） ── */

/** 同步原子写（文档极小；storage-json 同款 temp 写 + fsync + rename 替换语义）。 */
function atomicWrite(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = join(dirname(path), "." + randomUUID() + ".tmp");
  const fd = openSync(tmp, "w");
  try {
    writeSync(fd, text, 0, "utf8");
    try {
      fdatasyncSync(fd);
    } catch {
      /* 平台不支持时跳过（rename 已保证替换原子性） */
    }
  } finally {
    closeSync(fd);
  }
  try {
    renameSync(tmp, path);
  } catch (error) {
    try {
      unlinkSync(tmp);
    } catch {
      /* ignore */
    }
    throw error;
  }
}

/* ── JSON 响应与请求体 ── */

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) throw new Error("payload too large");
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("malformed JSON body");
  }
}

/** 读当前文档；无文件/损坏/超版本 → 默认文档（重建，不落盘——首次写入时再落）。
 *  蜂种三字段额外过归一化（手工改坏的条目丢弃而非整档重建）；
 *  召唤边同口径（2.1）：非法条目丢弃 + 封顶淘汰，旧文档无此字段按缺省处理
 *  （version 保持 1，SHALL NOT 触发迁移或整档重建）。 */
export function parseStoredDoc(text) {
  if (!text) return defaultDoc();
  try {
    const parsed = JSON.parse(text);
    const result = docSchema.safeParse(parsed);
    if (result.success) {
      const data = result.data;
      const beeTypes = data.beeTypes !== undefined ? normalizeBeeTypes(data.beeTypes) : undefined;
      const summonEdges = data.summonEdges !== undefined ? normalizeSummonEdges(data.summonEdges) : undefined;
      return {
        ...data,
        ...(data.beeTypes !== undefined ? { beeTypes } : {}),
        ...(data.beeAssignments !== undefined ? { beeAssignments: normalizeAssignments(data.beeAssignments, beeTypes ?? []) } : {}),
        ...(data.beeEngineState !== undefined ? { beeEngineState: normalizeEngineState(data.beeEngineState) } : {}),
        ...(data.statusCards !== undefined ? { statusCards: normalizeStatusCards(data.statusCards, beeTypes ?? []) } : {}),
        ...(summonEdges !== undefined ? { summonEdges } : {})
      };
    }
  } catch {
    /* fallthrough */
  }
  return defaultDoc();
}

/* ── 消息构造（hive-quick-commands D5，与 dsh-jiyu-skill-links /run 同构） ── */

function deepFreeze(value) {
  if (value === null || typeof value !== "object") return value;
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  Object.freeze(value);
  return value;
}

const sendSchema = z.object({
  sessionId: z.string().min(1),
  prompt: z.string().trim().min(1)
});

/* ── 插件主体 ── */

export function apply(ctx) {
  let doc = defaultDoc();
  const sseClients = new Set();
  let heartbeat = null;

  const broadcast = (event) => {
    const line = "data: " + JSON.stringify(event) + "\n\n";
    for (const res of sseClients) {
      try {
        res.write(line);
      } catch {
        /* 写失败由 close 统一清理 */
      }
    }
  };

  const startHeartbeat = () => {
    if (heartbeat) return;
    heartbeat = setInterval(() => {
      for (const res of sseClients) {
        try {
          res.write(": ping\n\n");
        } catch {
          /* ignore */
        }
      }
    }, 25000);
    heartbeat.unref?.();
  };
  const maybeStopHeartbeat = () => {
    if (heartbeat && sseClients.size === 0) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
  };

  /* ══ 能力引擎运行态（custom-bee-types 任务 3.2，design D4/D6） ══
     门状态（vars/latches/watermarks）持久化进 doc.beeEngineState；车道与保险丝
     计数、蜂卡等待/通知状态是内存瞬态（重启即空，损害有界）。 */

  const lane = createLane();
  const fuse = createFuseCounters();
  /** 会话 → 引擎在途自动消息数（车道「idle 且无在途」放行判定的在途侧）。 */
  const inFlightBySession = new Map();
  /** 会话 → 最近一次评估的拦截清单 [{capabilityId, name, gate}]（蜂卡等待状态）。 */
  const waitsBySession = new Map();
  /** 会话 → notify 提醒环（蜂卡提示位；内存瞬态，上限 5 条）。 */
  const noticesBySession = new Map();
  let noticeSeq = 0;
  /** 车道动作已被申请过的工作区（SSE lane 快照范围）。 */
  const laneWorkspaces = new Set();

  /* ── hive_wait 运行态（hive-summon-tool D6，内存瞬态） ──
     statusBySession：agent/status 全量状态缓存（不只 idle 分支）——事件驱动等待的
     归静判定基准；interactionBySession：琥珀标记（approval/question 瀑布在途计数）；
     waitersBySession：per-session 等待者注册表（支持同会话多等待者）。 */
  const HIVE_WAIT_TIMEOUT_MS = 30 * 60 * 1000; // 缺省等待上限（防无限占用工具管线，D6）
  const statusBySession = new Map();
  const interactionBySession = new Map();
  const waitersBySession = new Map();

  /* ── 会话态常驻上限（2026-09-16 泄漏修复） ──
     waitsBySession / statusBySession 以「见过的每个会话」为键写入（含每一个子会话），
     此前全文件无任何 delete：宿主进程活得越久，键越多且永不回收——engineFrame() 每次
     广播都要遍历全部键，于是「广播成本」随宿主寿命线性上升（同时抬高内存水位，见
     F:\project\dsh-token-insight\_audit_memory_retention.md F18）。
     两处读取点（hive_wait 入口即检 / 注册后即检）都在等待器存在时命中，而状态缓存缺项
     本就有活代理回读兜底（`cached === undefined && agent.status === "idle"`）——因此
     按插入序封顶驱逐最旧键是安全的：代价只是最冷会话的蜂卡等待标记晚一轮出现。
     注意：绝不能用「读时 re-insert」做 LRU 触碰——engineFrame() 是热路径遍历，
     一旦触碰就会在每次广播里反复重排/驱逐，把泄漏修成抖动。 */
  const HIVE_SESSION_STATE_MAX = 512;

  /** 写会话态缓存：超上限按插入序驱逐最旧会话（O(1)，无热路径触碰）。 */
  const setSessionState = (map, sessionId, value) => {
    if (!map.has(sessionId) && map.size >= HIVE_SESSION_STATE_MAX) {
      const oldest = map.keys().next();
      if (!oldest.done) map.delete(oldest.value);
    }
    map.set(sessionId, value);
  };

  /** 会话可被遗忘：无等待者、且无 hive_wait 在途琥珀标记。 */
  const forgetSessionState = (sessionId) => {
    if (waitersBySession.has(sessionId)) return;
    if ((interactionBySession.get(sessionId) ?? 0) > 0) return;
    waitsBySession.delete(sessionId);
    statusBySession.delete(sessionId);
  };

  const engineActive = () => (doc.beeTypes?.length ?? 0) > 0;

  const pushNotice = (sessionId, text) => {
    const list = noticesBySession.get(sessionId) ?? [];
    list.push({ seq: ++noticeSeq, text });
    noticesBySession.set(sessionId, list.slice(-5));
  };

  const engineFrame = () => {
    const laneByWorkspace = {};
    for (const workspaceId of laneWorkspaces) laneByWorkspace[workspaceId] = lane.status(workspaceId);
    /* 等待与通知的并集（context-hotbar-rework：召唤 notify 兜底需要无等待项的
       会话也能呈现通知——原实现只遍历 waitsBySession，纯通知会话被吞）。 */
    const sessionIds = new Set([...waitsBySession.keys(), ...noticesBySession.keys()]);
    const sessions = {};
    for (const sessionId of sessionIds) {
      const waits = waitsBySession.get(sessionId) ?? [];
      const notices = noticesBySession.get(sessionId) ?? [];
      if (waits.length === 0 && notices.length === 0) continue;
      sessions[sessionId] = {
        ...(waits.length ? { waits } : {}),
        ...(notices.length ? { notices } : {})
      };
    }
    return { type: "bee-engine", lane: laneByWorkspace, sessions };
  };

  const broadcastEngine = () => broadcast(engineFrame());

  /** 引擎侧文档变更：revision 不动（非用户布局编辑）、原子落盘 + 布局广播。 */
  const persistDoc = () => {
    /* 召唤边失效剪除（hive-interaction-polish 2.3/D7）：挂在宿主半区持久化写入点
       （executeSummon / 引擎触发落盘 / 闩锁重置 / PUT /state 全部写路径共用）——
       失效 = 端点会话已从会话镜像消失或已归档；SHALL NOT 依赖官方归档动词的
       插件钩子（archiveSession 是客户端 → 宿主 RPC，不经插件端点）。 */
    pruneSummonEdges();
    try {
      atomicWrite(storagePath(), JSON.stringify(doc, null, 2));
    } catch (error) {
      ctx.logger?.warn?.("[dsh-v-hive] 引擎状态落盘失败: %s", String(error?.message || error));
      return;
    }
    broadcast({ type: "layout-changed", doc });
  };

  /** 召唤边失效判定基准（2.3/D7）：registry 会话镜像 + 归档清单 + 在册代理兜底。
      registry 未就绪 → null（不剪，保守宁留勿误删——新档/离线场景无剪边需求）。 */
  const summonScope = () => {
    try {
      const liveSessionIds = new Set();
      for (const workspace of ctx.workspaceRegistry?.list?.() ?? []) {
        for (const sid of workspace?.sessionIds ?? []) liveSessionIds.add(sid);
      }
      return {
        liveSessionIds,
        archivedSessionIds: new Set(ctx.workspaceRegistry?.archivedSessionIds ?? []),
        agentIds: (id) => Boolean(ctx.agents?.get?.(id)) // 在册代理兜底（新蜂未入 sessionIds 镜像前的窗口）
      };
    } catch {
      return null;
    }
  };

  /** 召唤边失效剪除（写入口）：失效边从 doc.summonEdges 移除；全空则摘除整键。 */
  const pruneSummonEdges = () => {
    const edges = doc.summonEdges;
    if (!edges) return;
    const scope = summonScope();
    if (!scope) return;
    const pruned = normalizeSummonEdges(edges, scope);
    const before = Object.keys(edges).length;
    const after = pruned ? Object.keys(pruned).length : 0;
    if (after === before) return;
    doc = { ...doc };
    if (after === 0) delete doc.summonEdges;
    else doc.summonEdges = pruned;
  };

  /** 懒清理（任务 3.2）：清除指向已归档会话的绑定与门状态（评估/保存时机调用）。 */
  const lazyPrune = () => {
    let archived;
    try {
      archived = new Set(ctx.workspaceRegistry?.archivedSessionIds ?? []);
    } catch {
      return;
    }
    if (archived.size === 0) return;
    let changed = false;
    if (doc.beeAssignments) {
      const next = {};
      for (const [sessionId, typeId] of Object.entries(doc.beeAssignments)) {
        if (archived.has(sessionId)) {
          changed = true;
          continue;
        }
        next[sessionId] = typeId;
      }
      if (changed) doc = { ...doc, beeAssignments: next };
    }
    if (doc.beeEngineState) {
      const next = {};
      let stateChanged = false;
      for (const [sessionId, state] of Object.entries(doc.beeEngineState)) {
        if (archived.has(sessionId)) {
          stateChanged = true;
          continue;
        }
        next[sessionId] = state;
      }
      if (stateChanged) doc = { ...doc, beeEngineState: next };
    }
    if (changed || stateChanged) persistDoc();
  };

  /** 会话 → workspaceId（官方账号镜像；未分组 → undefined = 野蜂）。 */
  const workspaceOf = (sessionId) => {
    try {
      for (const workspace of ctx.workspaceRegistry?.list?.() ?? []) {
        if (workspace.sessionIds?.includes(sessionId)) return workspace.id;
      }
    } catch {
      /* registry 未就绪按野蜂处理 */
    }
    return undefined;
  };

  const isArchived = (sessionId) => {
    try {
      return (ctx.workspaceRegistry?.archivedSessionIds ?? []).includes(sessionId);
    } catch {
      return false;
    }
  };

  /** 最后一条 assistant 消息（四重门作用域仅末条；文本块拼接 + 事件 seq）。 */
  const lastAssistantMessage = (events) => {
    const event = typeof events?.findLast === "function" ? events.findLast((e) => e?.type === "assistant/message") : null;
    if (!event) return null;
    const blocks = event.data?.message?.content;
    const text = Array.isArray(blocks)
      ? blocks
          .filter((b) => b?.type === "text")
          .map((b) => b.text ?? "")
          .join("")
      : "";
    return { text, seq: event.seq };
  };

  const sessionFileExists = (cwd) => (relativePath) => {
    try {
      if (!cwd) return false;
      return existsSync(join(cwd, relativePath));
    } catch {
      return false;
    }
  };

  /* ── 动作执行（任务 3.4/3.5） ── */

  const followupMessage = (text) =>
    deepFreeze(
      structuredClone({
        id: randomUUID(),
        role: "user",
        content: [{ type: "text", text }],
        source: { kind: "user" }
      })
    );

  /**
   * 召唤执行核心（hive-summon-tool D4 参数化，能力 spawn 与工具召唤 hive_summon
   * 共用）：同巢建会话 → 绑蜂种（targetType 非空时；缺省 = 默认蜂不绑定）→
   * selectModel（失败降默认模型 + notify）→ 首条消息按**目标蜂种** queuePolicy 过
   * 车道投递（serialized 占道/续占/排队；free 或手动直发）→ 保险丝记账。
   * 首条消息由调用方组装（能力 = ⟡蜂种名·能力：X；工具 = ⟡蜂种名·召唤）；
   * firstMessage 为空 = 纯创建不投递（工具召唤的 payload 空白语义）。
   * fuseSessionId：保险丝记账归属（D5 父链根会话；能力 spawn 即触发会话）。
   * manual=true：用户显式动作既有语义——直发绕车道且不记账。
   * childNotice：可选，创建成功后投递到新蜂卡面的提醒（手动孵化「手动孵化自 X」）。
   */
  const executeSummon = async ({ triggerSessionId, workspaceId, targetType, firstMessage, manual, fuseSessionId, childNotice }) => {
    inFlightBySession.set(triggerSessionId, (inFlightBySession.get(triggerSessionId) ?? 0) + 1);
    try {
      const createArg = workspaceId ? { workspaceId } : { cwd: ctx.agents?.get?.(triggerSessionId)?.session?.header?.cwd };
      /* 直调形状（S1 复验）：请求对象即请求体、返回值即结果；失败 reject 落
         外层 catch——「孵化失败：」前缀保留，文案变 error 插值。 */
      const created = await ctx.sessionController.create(createArg);
      const childSessionId = created.sessionId;
      /* 召唤边记账（hive-interaction-polish 2.2/D7）：executeSummon 是能力 spawn、
         /hatch 手动孵化、hive_summon 工具召唤三入口共用的执行核心——一处写全。
         manual=true（用户显式动作）也记边：连线是视觉事实，与保险丝记账的 manual
         豁免无关。封顶 512 超出按 at 淘汰最旧；失效剪除随 persistDoc 写入点统一进行；
         持久化 + 广播沿用既有链路（函数末 persistDoc → layout-changed 广播）。 */
      doc = { ...doc, summonEdges: recordSummonEdge(doc.summonEdges, childSessionId, triggerSessionId) };
      if (targetType) {
        /* 绑定蜂种（落盘 + 广播；删除级联与回落语义见 bee-types.mjs）。 */
        doc = { ...doc, beeAssignments: { ...(doc.beeAssignments ?? {}), [childSessionId]: targetType.id } };
        /* 按蜂种模型配置 selectModel；失败降默认模型 + notify（D5，审阅 F10）。 */
        const model = targetType.model;
        if (model) {
          try {
            await ctx.sessionController.selectModel({
              sessionId: childSessionId,
              provider: model.provider,
              model: model.model,
              ...(model.reasoningEffort ? { reasoningEffort: model.reasoningEffort } : {})
            });
          } catch {
            pushNotice(childSessionId, "模型不可用，已用默认模型");
          }
        }
      }
      if (firstMessage) {
        const deliverChild = async () => {
          inFlightBySession.set(childSessionId, (inFlightBySession.get(childSessionId) ?? 0) + 1);
          /* requestId 每次铸造（client-minted，持久化在对应 user message 上）；
             第二参数为永不中止信号（spike 复验 δ1）；reject 沿既有两路径传播
             （直发 → 外层 catch，排队 → 下方 .catch 日志）。 */
          await ctx.sessionController.prompt(
            {
              requestId: randomUUID(),
              sessionId: childSessionId,
              mode: "queue",
              content: [{ type: "text", text: firstMessage }]
            },
            NEVER_ABORTED_SIGNAL
          );
          childChainDepth(fuse, fuseSessionId, childSessionId);
        };
        const queuePolicy = targetType?.queuePolicy ?? "free";
        if (manual || !workspaceId || queuePolicy !== "serialized") {
          await deliverChild();
        } else if (workspaceId && lane.transfer(workspaceId, triggerSessionId, childSessionId)) {
          /* 父持有车道 → 新蜂首条消息续占道（design D6「续占」）。 */
          laneWorkspaces.add(workspaceId);
          await deliverChild();
        } else {
          /* 父非持有者 → 子蜂首条消息按 serialized 正常申请/排队。 */
          laneWorkspaces.add(workspaceId);
          dispatchWithLane(workspaceId, childSessionId, queuePolicy, () => {
            deliverChild().catch((error) => {
              ctx.logger?.warn?.("[dsh-v-hive] 子蜂投递异常: %s", String(error?.message || error));
            });
          });
        }
      }
      if (!manual) recordFuseAction(fuse, { sessionId: fuseSessionId, kind: "spawn" });
      if (childNotice) pushNotice(childSessionId, childNotice);
      pushNotice(triggerSessionId, `已孵化 ${targetType?.name ?? "蜂"}`);
      persistDoc();
      broadcastEngine();
      return { ok: true, sessionId: childSessionId };
    } catch (error) {
      pushNotice(triggerSessionId, "孵化失败：" + String(error?.message || error));
      broadcastEngine();
      return { ok: false };
    } finally {
      inFlightBySession.set(triggerSessionId, Math.max(0, (inFlightBySession.get(triggerSessionId) ?? 1) - 1));
    }
  };

  /**
   * spawn 链（能力引擎路径，任务 3.4/3.5）：四重门命中后的 spawn 动作——模板插值
   * + 能力前缀首条消息，经召唤执行核心 executeSummon 执行。野蜂触发由调用方
   * （dispatchAction）降级为 send；手动孵化（/hatch）直通本路径绕车道（审阅 F6）。
   */
  const runSpawn = async ({ triggerSessionId, workspaceId, beeType, capability, values, manual }) => {
    const targetTypeId = capability.action.targetBeeTypeId ?? "";
    const targetType = beeTypeById(doc.beeTypes, targetTypeId);
    if (!targetType) {
      pushNotice(triggerSessionId, `孵化目标蜂种缺失（${targetTypeId || "未配置"}）`);
      broadcastEngine();
      return { ok: false };
    }
    const interpolated = interpolateTemplate(capability.action.promptTemplate ?? "", values);
    if (!interpolated.ok) {
      pushNotice(triggerSessionId, `孵化拒发：变量未捕获 ${interpolated.missing?.join(", ") ?? ""}`);
      broadcastEngine();
      return { ok: false };
    }
    const outcome = await executeSummon({
      triggerSessionId,
      workspaceId,
      targetType,
      firstMessage: buildAutoMessage(targetType.name, capability.name, interpolated.text),
      manual,
      fuseSessionId: triggerSessionId,
      ...(manual ? { childNotice: `手动孵化自 ${beeType?.name ?? "蜂"}` } : {})
    });
    return outcome;
  };

  /** send 动作：模板插值 + 前缀 + agent.followup 五连同构（任务 3.4）。 */
  const runSend = ({ sessionId, beeType, capability, values, manual, degradeText }) => {
    const agent = ctx.agents?.get?.(sessionId);
    if (!agent) return { ok: false };
    let text;
    if (degradeText !== undefined) {
      text = degradeText;
    } else {
      const interpolated = interpolateTemplate(capability.action.promptTemplate ?? "", values);
      if (!interpolated.ok) {
        pushNotice(sessionId, `续发拒发：变量未捕获 ${interpolated.missing?.join(", ") ?? ""}`);
        return { ok: false };
      }
      text = buildAutoMessage(beeType?.name ?? "", capability.name, interpolated.text);
    }
    try {
      inFlightBySession.set(sessionId, (inFlightBySession.get(sessionId) ?? 0) + 1);
      agent.followup(followupMessage(text));
      if (!manual) recordFuseAction(fuse, { sessionId, kind: "send" });
      return { ok: true };
    } catch (error) {
      inFlightBySession.set(sessionId, Math.max(0, (inFlightBySession.get(sessionId) ?? 1) - 1));
      pushNotice(sessionId, "续发失败：" + String(error?.message || error));
      return { ok: false };
    }
  };

  /** 车道放行后执行排队的动作（lane.mjs 只管次序，动作载荷在这里）。 */
  const laneJobs = new Map(); // workspaceId → [{ sessionId, run }]

  const dispatchWithLane = (workspaceId, sessionId, queuePolicy, run) => {
    if (laneMode(queuePolicy, workspaceId) !== "lane") {
      run();
      return;
    }
    laneWorkspaces.add(workspaceId);
    const grant = lane.request(workspaceId, sessionId);
    if (grant.granted) {
      run();
    } else {
      const queue = laneJobs.get(workspaceId) ?? [];
      if (!queue.some((job) => job.sessionId === sessionId)) queue.push({ sessionId, run });
      laneJobs.set(workspaceId, queue);
    }
    broadcastEngine();
  };

  const onLaneGranted = (workspaceId, sessionId) => {
    const queue = laneJobs.get(workspaceId);
    if (!queue) return;
    const index = queue.findIndex((job) => job.sessionId === sessionId);
    if (index === -1) return;
    const [job] = queue.splice(index, 1);
    job.run();
  };

  /** 单个命中动作的分派（fuse → 车道 → 执行；spec 执行顺序 = 声明顺序）。 */
  const dispatchAction = ({ triggerSessionId, workspaceId, beeType, hit, manual }) => {
    const capability = hit.capability;
    const actionType = capability.action.type;
    if (actionType === "conductor") {
      /* Non-Goal：编排者动作仅保留枚举形状（design D5），引擎不实现，通知停链。 */
      pushNotice(triggerSessionId, `能力「${capability.name}」的 conductor 动作本期未实现`);
      return;
    }
    if (actionType === "notify") {
      pushNotice(triggerSessionId, `能力「${capability.name}」提醒`);
      return;
    }
    if (!manual) {
      const verdict = fuseVerdict(fuse, FUSE_LIMITS, { sessionId: triggerSessionId, kind: actionType === "spawn" ? "spawn" : "send" });
      if (!verdict.allowed) {
        pushNotice(triggerSessionId, `自动动作保险丝（${verdict.reason}）触发，链路停止`);
        return;
      }
    }
    if (actionType === "spawn") {
      if (!workspaceId) {
        /* spec「野蜂孵化降级」：不创建会话，降级为向本会话 send + notify。 */
        const degraded = interpolateTemplate(capability.action.promptTemplate ?? "", hit.values);
        runSend({
          sessionId: triggerSessionId,
          beeType,
          capability,
          values: hit.values,
          manual,
          degradeText: degraded.ok ? buildAutoMessage(beeType?.name ?? "", capability.name, degraded.text) : undefined
        });
        pushNotice(triggerSessionId, "野蜂无巢可孵化，已降级为本会话续发");
        return;
      }
      dispatchWithLane(workspaceId, triggerSessionId, beeType.queuePolicy, () => {
        runSpawn({ triggerSessionId, workspaceId, beeType, capability, values: hit.values, manual }).catch((error) => {
          ctx.logger?.warn?.("[dsh-v-hive] spawn 异常: %s", String(error?.message || error));
        });
      });
      return;
    }
    /* send */
    dispatchWithLane(workspaceId, triggerSessionId, beeType.queuePolicy, () => {
      runSend({ sessionId: triggerSessionId, beeType, capability, values: hit.values, manual });
    });
  };

  /* ── 触发点 → 四重门评估 → 动作分派（任务 3.3；spike-findings 定稿） ── */

  const evaluateAndDispatch = (agent) => {
    if (!engineActive()) return; // 任务 3.8：无蜂种配置 → 零开销旁路
    const sessionId = agent?.id;
    if (!sessionId) return;
    if (agent.session?.header?.origin === "subagent") return; // 无人机不驱动
    const events = agent.session?.snapshotEvents?.() ?? []; // D2：新版 Session 快照（深冻结只读；`.some`/`findLast` 照常工作，零写操作）
    if (!events.some((e) => e?.type === "turn/start")) {
      forgetSessionState(sessionId);
      return; // 空白会话
    }
    if (isArchived(sessionId)) {
      forgetSessionState(sessionId);
      return; // 归档会话
    }
    lazyPrune();
    const beeType = boundBeeTypeOf(sessionId, doc.beeTypes, doc.beeAssignments);
    if (!beeType || beeType.capabilities.length === 0) {
      forgetSessionState(sessionId);
      return; // 默认蜂 / 无能力
    }
    const last = lastAssistantMessage(events);
    if (!last) return;
    const sessionState = normalizeEngineState({ [sessionId]: doc.beeEngineState?.[sessionId] ?? {} })[sessionId] ?? { vars: {}, latches: {}, watermarks: {} };
    const cwd = agent.session?.header?.cwd;
    const verdict = evaluateBeeType({
      beeType,
      text: last.text,
      seq: last.seq,
      sessionState,
      fileExists: sessionFileExists(cwd)
    });
    /* 蜂卡等待状态（等待标记/等待谓词/闩锁生效）。有界写入：超上限按插入序驱逐最旧会话。 */
    setSessionState(
      waitsBySession,
      sessionId,
      verdict.blocked.map((b) => ({ capabilityId: b.capability.id, name: b.capability.name, gate: b.gate }))
    );
    if (verdict.hits.length === 0) {
      broadcastEngine();
      return;
    }
    /* 触发落盘（水位/闩锁/变量持久化，D4）后按声明顺序执行动作。 */
    doc = {
      ...doc,
      beeEngineState: { ...(doc.beeEngineState ?? {}), [sessionId]: applyHitsToSessionState(sessionState, verdict.hits, last.seq) }
    };
    persistDoc();
    const workspaceId = workspaceOf(sessionId);
    for (const hit of verdict.hits) {
      dispatchAction({ triggerSessionId: sessionId, workspaceId, beeType, hit, manual: false });
    }
    broadcastEngine();
  };

  /** 车道放行判定（idle 且无在途自动消息；琥珀期间驱动器 parked → 不会到 idle）。 */
  const releaseCheck = (sessionId) => {
    if ((inFlightBySession.get(sessionId) ?? 0) > 0) return;
    const workspaceId = workspaceOf(sessionId);
    if (!workspaceId || !lane.isHolder(workspaceId, sessionId)) return;
    laneWorkspaces.add(workspaceId);
    const released = lane.release(workspaceId, sessionId);
    if (released.granted) onLaneGranted(workspaceId, released.granted);
    broadcastEngine();
  };

  /* ── hive_wait 等待器结算（事件驱动，D6；SHALL NOT 轮询） ── */

  /** 移除单个等待器（不结算——结算由调用方负责并先移除，防双重 resolve）。 */
  const removeWaiter = (sessionId, waiter) => {
    const set = waitersBySession.get(sessionId);
    if (!set) return;
    set.delete(waiter);
    if (set.size === 0) waitersBySession.delete(sessionId);
  };

  /** 结算单个等待器：清计时器、摘除中止监听、出册、resolve。 */
  const settleOneWaiter = (sessionId, waiter, outcome) => {
    clearTimeout(waiter.timer);
    if (waiter.onAbort) {
      try {
        waiter.signal?.removeEventListener("abort", waiter.onAbort);
      } catch {
        /* ignore */
      }
    }
    removeWaiter(sessionId, waiter);
    /* 最后一个等待者出册 → 该会话的等待/状态缓存已无读者，立即遗忘，防止常驻累积。 */
    forgetSessionState(sessionId);
    waiter.settle(outcome);
  };

  /** 目标会话事件（归静/琥珀/卸载）→ 放行其全部等待者。 */
  const settleWaiters = (sessionId, outcome) => {
    const set = waitersBySession.get(sessionId);
    if (!set) return;
    for (const waiter of [...set]) settleOneWaiter(sessionId, waiter, outcome);
  };

  /** 琥珀标记（计数制，容忍同会话嵌套/并发交互瀑布）。 */
  const enterInteraction = (sessionId) => {
    interactionBySession.set(sessionId, (interactionBySession.get(sessionId) ?? 0) + 1);
    try {
      settleWaiters(sessionId, { ok: false, reason: "waiting-interaction" });
    } catch {
      /* ignore */
    }
  };
  const exitInteraction = (sessionId) => {
    const count = (interactionBySession.get(sessionId) ?? 1) - 1;
    if (count <= 0) interactionBySession.delete(sessionId);
    else interactionBySession.set(sessionId, count);
  };

  /* ── 引擎监听（spike S3：turn-stopping 主 + status idle 兜底 + inbox 保险丝重置） ── */

  const installEngineListeners = () => {
    const disposers = [];
    disposers.push(
      ctx.on("agent/turn-stopping", (payload) => {
        try {
          evaluateAndDispatch(payload?.agent);
        } catch (error) {
          ctx.logger?.warn?.("[dsh-v-hive] turn-stopping 评估失败: %s", String(error?.message || error));
        }
      })
    );
    disposers.push(
      ctx.on("agent/status", (payload) => {
        const agent = payload?.agent;
        if (!agent?.id) return;
        /* hive_wait（D6）：全量状态缓存（不只 idle 分支）——等待器的事件基准。有界写入。 */
        setSessionState(statusBySession, agent.id, payload.status === "running" ? "running" : "idle");
        if (payload?.status !== "idle") return;
        try {
          evaluateAndDispatch(agent); // 兜底：监听晚挂/中途接入（水位消重，不重燃）
        } catch (error) {
          ctx.logger?.warn?.("[dsh-v-hive] idle 兜底评估失败: %s", String(error?.message || error));
        }
        try {
          /* idle = 驱动器全静默：引擎在途自动消息（各自的回合）已归静。 */
          inFlightBySession.delete(agent.id);
          releaseCheck(agent.id);
        } catch (error) {
          ctx.logger?.warn?.("[dsh-v-hive] 车道释放失败: %s", String(error?.message || error));
        }
        /* hive_wait：目标归静 → 放行该会话全部等待者（完工可能早于调用方事件
           到达，注册后即检兜底竞态）。 */
        try {
          settleWaiters(agent.id, { ok: true });
        } catch (error) {
          ctx.logger?.warn?.("[dsh-v-hive] 等待器放行失败: %s", String(error?.message || error));
        }
      })
    );
    /* 琥珀检测（D6）：pendingInteraction 是客户端 UI 态，宿主侧的等价事件面是
       approval/request 与 user-questions/request 两道 agent 作用域瀑布（客户端
       琥珀三态 approval / plan-review / question 的共同来源）。标记期间 hive_wait
       入口即检命中、在等等待器立即上报 waiting-interaction（插件自身只观察不干预，
       恒向下游放行）。 */
    const joinInteractionWaterfall = (event) => {
      disposers.push(
        ctx.on(event, (request, next) => {
          const sessionId = request?.agent?.session?.header?.id ?? request?.agent?.id;
          if (!sessionId || typeof next !== "function") return next();
          enterInteraction(sessionId);
          let result;
          try {
            result = next();
          } catch (error) {
            exitInteraction(sessionId);
            throw error;
          }
          return Promise.resolve(result).finally(() => exitInteraction(sessionId));
        })
      );
    };
    joinInteractionWaterfall("approval/request");
    joinInteractionWaterfall("user-questions/request");
    disposers.push(
      ctx.on("agent/inbox/inserted", (payload) => {
        try {
          const blocks = payload?.message?.content;
          const text = Array.isArray(blocks)
            ? blocks
                .filter((b) => b?.type === "text")
                .map((b) => b.text ?? "")
                .join("")
            : "";
          if (!isAutoPrefixed(text)) resetFuseOnUserMessage(fuse); // 用户消息重置连续自动计数
        } catch {
          /* 判别失败按用户消息处理 */
          resetFuseOnUserMessage(fuse);
        }
      })
    );
    return () => {
      for (const dispose of disposers) {
        try {
          dispose?.();
        } catch {
          /* ignore */
        }
      }
    };
  };

  /* ── 模型可调用工具（hive-summon-tool，D1/D2/D4/D7）：经 ctx.tools.register
     全局注册、对全部会话可见（D7：可见面不做会话级裁剪，schema 精炼）。工具调用
     的 exec.agent 免费提供调用方身份（无人机即经此解析父链）。ctx.tools 缺席
     （旧宿主/测试桩）时整段跳过——HTTP 通路与能力 spawn 不受影响（回滚 = 回退
     插件版本，工具消失）。 ── */

  /** hive_summon 参数 schema（execute 侧 zod 自校验；模型侧参数以 JSON Schema 提供）。 */
  const summonArgsSchema = z.object({
    payload: z.string().optional(),
    beeTypeId: z.string().optional(),
    workspaceId: z.string().optional()
  });

  const registerSummonTools = () => {
    const disposers = [];
    const register = ctx.tools?.register?.bind(ctx.tools);
    if (typeof register !== "function") return () => {};

    disposers.push(
      register({
        name: "hive_summon",
        description:
          "Summon (create) a new bee session in a hive workspace and deliver its first message. " +
          "This is an automatic action: the first message queues through the target bee type's lane " +
          "(serialized bee types queue FIFO), and the summon counts toward the spawn fuse of the " +
          "caller's root session (chain depth + 1). Defaults: workspaceId omitted = the caller's own " +
          "workspace (subagent sessions resolve it via their parentSession chain); beeTypeId omitted = " +
          "the default bee (no binding); blank/omitted payload = create only, deliver nothing. " +
          "Returns { ok, sessionId } or { ok: false, reason, field? } on failure — inspect reason and " +
          "self-correct instead of retrying blindly.",
        parameters: {
          type: "object",
          properties: {
            payload: {
              type: "string",
              description:
                "First message body: the task data for the new bee (prepended before the bee type's preset prompt). Blank or omitted = create without delivering any message."
            },
            beeTypeId: {
              type: "string",
              description: "Target bee type id (as configured in the swarm editor). Omit for the default bee."
            },
            workspaceId: {
              type: "string",
              description: "Target workspace id. Omit to summon into the caller's own workspace (recommended)."
            }
          },
          additionalProperties: false
        },
        output: {
          schema: {
            type: "object",
            properties: {
              ok: { type: "boolean" },
              sessionId: { type: "string" },
              reason: { type: "string" },
              field: { type: "string" }
            },
            required: ["ok"],
            additionalProperties: false
          },
          render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }]
        },
        async execute(args, exec) {
          const parsed = summonArgsSchema.safeParse(args ?? {});
          if (!parsed.success) return { ok: false, reason: "invalid-arguments" };
          const { payload, beeTypeId, workspaceId } = parsed.data;
          const caller = exec?.agent;
          const callerId = caller?.session?.header?.id ?? caller?.id;
          if (!callerId) return { ok: false, reason: "no-caller" };
          /* 蜂种在册校验：缺失 → 结构化错误，SHALL NOT 创建会话（spec「蜂种缺失
             结构化报错」，调用方模型可自纠）。 */
          let targetType = null;
          if (beeTypeId) {
            targetType = beeTypeById(doc.beeTypes, beeTypeId);
            if (!targetType) return { ok: false, reason: "bee-type-missing", field: "beeTypeId" };
          }
          /* 巢解析（D2）：显式 workspaceId 校验在册（罕见跨巢覆盖）；缺省 = 调用方
             所属巢（主会话反查在册，无人机沿 parentSession 链上溯）。无巢（野蜂）
             显式失败，SHALL NOT 静默降级为 send。 */
          let resolvedWorkspace = workspaceId ?? null;
          if (resolvedWorkspace) {
            const known = (() => {
              try {
                return (ctx.workspaceRegistry?.list?.() ?? []).some((workspace) => workspace?.id === resolvedWorkspace);
              } catch {
                return false;
              }
            })();
            if (!known) return { ok: false, reason: "workspace-missing", field: "workspaceId" };
          } else {
            resolvedWorkspace = resolveCallerWorkspace(caller, { agents: ctx.agents, registry: ctx.workspaceRegistry });
            if (!resolvedWorkspace) return { ok: false, reason: "no-workspace" };
          }
          /* 保险丝（D5）：spawn 计数与链深记账到父链根会话；超限停链 + notify
             （既有语义），SHALL NOT 因无人机自身计数清零而绕过。 */
          const fuseSessionId = fuseRootSessionId(caller, { agents: ctx.agents }) ?? callerId;
          const verdict = fuseVerdict(fuse, FUSE_LIMITS, { sessionId: fuseSessionId, kind: "spawn" });
          if (!verdict.allowed) {
            pushNotice(fuseSessionId, `自动动作保险丝（${verdict.reason}）触发，链路停止`);
            broadcastEngine();
            return { ok: false, reason: "fuse-" + verdict.reason };
          }
          /* 首条消息（D3）：payload 空白 = 纯创建不投递（即使 presetPrompt 非空，
             沿 summon 端点「空白提示词只建不发」既有语义）。 */
          const deliverable = typeof payload === "string" && payload.trim().length > 0;
          const outcome = await executeSummon({
            triggerSessionId: callerId,
            workspaceId: resolvedWorkspace,
            targetType,
            firstMessage: deliverable
              ? buildSummonMessage(targetType?.name ?? "蜂", payload, targetType?.presetPrompt ?? "")
              : "",
            manual: false,
            fuseSessionId
          });
          if (!outcome.ok) return { ok: false, reason: "create-failed" };
          return { ok: true, sessionId: outcome.sessionId };
        }
      })
    );

    /** hive_wait 参数 schema（execute 侧 zod 自校验）。 */
    const waitArgsSchema = z.object({
      sessionId: z.string().min(1),
      timeoutMs: z.number().int().positive().optional()
    });

    disposers.push(
      register({
        name: "hive_wait",
        description:
          "Wait until a bee session settles: its turn has ended and the engine has no in-flight automatic " +
          "messages. Event-driven (subscribes to status events, no polling) — if the target already settled, " +
          "returns immediately; if it asks for human help (approval/question amber), returns waiting-interaction " +
          "at once so you can report instead of blocking. A missing or archived session fails with a structured " +
          "error. Your own session's cancellation signal propagates and cleans up the waiter. Use after hive_summon " +
          "to report 'created and finished' instead of fire-and-forget.",
        parameters: {
          type: "object",
          properties: {
            sessionId: {
              type: "string",
              description: "Target bee session id to wait for (e.g. the sessionId returned by hive_summon)."
            },
            timeoutMs: {
              type: "integer",
              description: "Maximum wait in milliseconds. Defaults to and is capped at 30 minutes; on expiry returns { ok: false, reason: 'timeout' }."
            }
          },
          required: ["sessionId"],
          additionalProperties: false
        },
        output: {
          schema: {
            type: "object",
            properties: {
              ok: { type: "boolean" },
              reason: { type: "string" }
            },
            required: ["ok"],
            additionalProperties: false
          },
          render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }]
        },
        async execute(args, exec) {
          const parsed = waitArgsSchema.safeParse(args ?? {});
          if (!parsed.success) return { ok: false, reason: "invalid-arguments" };
          const { sessionId, timeoutMs } = parsed.data;
          /* 目标消失（归档/不存在）→ 结构化错误，SHALL NOT 永久挂起（D6）。 */
          if (isArchived(sessionId)) return { ok: false, reason: "session-archived" };
          const agent = ctx.agents?.get?.(sessionId);
          if (!agent) return { ok: false, reason: "session-not-found" };
          /* 入口即检（D6）：琥珀立即上报；已归静立即 ok（完工可能早于本次调用，
             SHALL NOT 空等下一次事件）。缓存缺项（插件晚挂）回读活代理实时状态。 */
          if (interactionBySession.get(sessionId)) return { ok: false, reason: "waiting-interaction" };
          const cached = statusBySession.get(sessionId);
          if (cached === "idle" || (cached === undefined && agent.status === "idle")) return { ok: true };
          /* 未归静 → 注册等待器（per-session 注册表，支持同会话多等待者）。 */
          const timeout = Math.min(Math.max(timeoutMs ?? HIVE_WAIT_TIMEOUT_MS, 1), HIVE_WAIT_TIMEOUT_MS);
          const signal = exec?.signal ?? null;
          if (signal?.aborted) return { ok: false, reason: "aborted" };
          return await new Promise((resolve) => {
            const waiter = { settle: resolve, timer: null, signal, onAbort: null };
            waiter.timer = setTimeout(() => settleOneWaiter(sessionId, waiter, { ok: false, reason: "timeout" }), timeout);
            waiter.timer.unref?.();
            /* 调用方自身的取消信号传播：会话中止 → 等待器清理（SHALL NOT 泄漏）。 */
            if (signal) {
              waiter.onAbort = () => settleOneWaiter(sessionId, waiter, { ok: false, reason: "aborted" });
              signal.addEventListener("abort", waiter.onAbort, { once: true });
            }
            let set = waitersBySession.get(sessionId);
            if (!set) {
              set = new Set();
              waitersBySession.set(sessionId, set);
            }
            set.add(waiter);
            /* 注册后即检：消除「入口即检之后、注册之前」的事件窗（idle 到达 /
               琥珀开始都可能恰在此窗口）。 */
            if (interactionBySession.get(sessionId)) settleOneWaiter(sessionId, waiter, { ok: false, reason: "waiting-interaction" });
            else if (statusBySession.get(sessionId) === "idle") settleOneWaiter(sessionId, waiter, { ok: true });
          });
        }
      })
    );

    return () => {
      for (const dispose of disposers) {
        try {
          dispose?.();
        } catch {
          /* ignore */
        }
      }
    };
  };

  /* ── 插件主体 ── */

  ctx.effect(() => {
    /* 启动即加载持久化文档（损坏即默认）。 */
    try {
      doc = parseStoredDoc(readFileSync(storagePath(), "utf8"));
    } catch {
      doc = defaultDoc();
    }

    const disposeEngine = installEngineListeners();
    const disposeTools = registerSummonTools(); // hive-summon-tool：hive_summon/hive_wait 注册（ctx.tools 缺席时为空操作）

    const dispose = ctx.webServer.register({
      kind: "prefix",
      path: API_PREFIX,
      handler: async (req, res) => {
        const url = new URL(req.url, "http://localhost");
        const route = url.pathname.slice(API_PREFIX.length) || "/";
        try {
          /* ── 读布局 ── */
          if (route === "/state" && req.method === "GET") {
            json(res, 200, { doc });
            return;
          }

          /* ── 写布局（revision 乐观锁） ── */
          if (route === "/state" && req.method === "PUT") {
            const body = await readJsonBody(req);
            const parsed = putSchema.safeParse(body);
            if (!parsed.success) {
              json(res, 400, { error: "invalid layout payload", issues: parsed.error?.issues?.map((i) => i.path.join(".")) });
              return;
            }
            if (parsed.data.revision !== doc.revision) {
              json(res, 409, { error: "revision conflict", doc });
              return;
            }
            /* 蜂种语义级校验（任务 3.1 接 2.1 校验器）：400 + 字段级原因，文档不变更。 */
            if (parsed.data.beeTypes !== undefined) {
              const beeError = validateBeeTypesDraft(parsed.data.beeTypes);
              if (beeError) {
                json(res, 400, { error: "invalid bee types", field: beeError.field, code: beeError.code });
                return;
              }
            }
            const nextBeeTypes = parsed.data.beeTypes === undefined ? doc.beeTypes : normalizeBeeTypes(parsed.data.beeTypes);
            /* 级联兜底（spec：SHALL NOT 产生孤儿引用或残留触发规则）：spawn 目标
               不在提交列表中的能力规则在宿主侧移除（UI 已先行级联，此处兜底）。 */
            let cascadedTypes = nextBeeTypes;
            if (nextBeeTypes) {
              const ids = new Set(nextBeeTypes.map((t) => t.id));
              cascadedTypes = nextBeeTypes.map((t) => ({
                ...t,
                capabilities: (t.capabilities ?? []).filter(
                  (c) => !(c.action?.type === "spawn" && c.action?.targetBeeTypeId && !ids.has(c.action.targetBeeTypeId))
                )
              }));
            }
            /* 绑定归一化：丢弃指向已删蜂种的条目（删除级联兜底）。 */
            const nextAssignments =
              parsed.data.beeAssignments === undefined
                ? doc.beeAssignments
                : normalizeAssignments(parsed.data.beeAssignments, nextBeeTypes ?? []);
            /* 状态卡片（bee-status-cards D3）：写路径整体替换 + 归一化（丢弃指向已删
               蜂种的键 = 蜂种删除级联清理；prompt trim、autoSend 布尔化）。缺省沿用旧值
               （镜头/位置回写等不含此字段的 PUT 不丢配置），但 SHALL 始终对新蜂种清单
               重归一化——蜂种删除即使未显式携带 statusCards 也级联清理悬空键。 */
            const rawStatusCards = parsed.data.statusCards === undefined ? doc.statusCards : parsed.data.statusCards;
            const nextStatusCards = normalizeStatusCards(rawStatusCards, nextBeeTypes ?? []);
            /* 召唤边（hive-interaction-polish 2.3/D7）：引擎自有记账，浏览器 PUT 不携带
               （putSchema 无此键，zod strip）——重建文档时沿旧值透传并在持久化写入点
               做失效剪除（消失/归档两条路径并查 archivedSessionIds）。 */
            const nextSummonEdges = doc.summonEdges ? normalizeSummonEdges(doc.summonEdges, summonScope()) : undefined;
            doc = {
              version: DOC_VERSION,
              revision: doc.revision + 1,
              positions: parsed.data.positions ?? doc.positions ?? {},
              camera: parsed.data.camera === undefined ? (doc.camera ?? null) : parsed.data.camera,
              /* 缺省沿用旧值（部分写语义：镜头回写等不含对应字段的 PUT 不丢数据）；
                 旧文档无字段 → 空值。commands 字段已拆除：PUT 重建 doc 不含该键，
                 存量残留随本次写入自然剥离（zod strip 未知键，不报错）。 */
              ...(parsed.data.hotbars === undefined ? (doc.hotbars ? { hotbars: doc.hotbars } : {}) : { hotbars: parsed.data.hotbars }),
              beeTypes: cascadedTypes ?? [],
              beeAssignments: nextAssignments ?? {},
              beeEngineState: normalizeEngineState(parsed.data.beeEngineState === undefined ? (doc.beeEngineState ?? {}) : parsed.data.beeEngineState),
              ...(nextStatusCards ? { statusCards: nextStatusCards } : {}),
              ...(nextSummonEdges && Object.keys(nextSummonEdges).length > 0 ? { summonEdges: nextSummonEdges } : {})
            };
            try {
              atomicWrite(storagePath(), JSON.stringify(doc, null, 2));
            } catch (error) {
              json(res, 500, { error: "persist failed: " + String(error?.message || error) });
              return;
            }
            broadcast({ type: "layout-changed", doc });
            json(res, 200, { doc });
            return;
          }

          /* ── 快捷指令直发（hive-quick-commands D5）：followup 五连进该会话 ── */
          if (route === "/send" && req.method === "POST") {
            const body = await readJsonBody(req);
            const parsed = sendSchema.safeParse(body);
            if (!parsed.success) {
              /* 空白 prompt（trim 后为空）等非法载荷 → 400（客户端另有前置拦截，双保险） */
              json(res, 400, { error: "invalid send payload", issues: parsed.error?.issues?.map((i) => i.path.join(".")) });
              return;
            }
            const agent = ctx.agents?.get?.(parsed.data.sessionId);
            if (!agent) {
              json(res, 404, { error: "session has no live agent" });
              return;
            }
            agent.followup(
              deepFreeze(
                structuredClone({
                  id: randomUUID(),
                  role: "user",
                  content: [{ type: "text", text: parsed.data.prompt }],
                  source: { kind: "user" }
                })
              )
            );
            json(res, 200, { ok: true });
            return;
          }

          /* ── 槽位召唤（context-hotbar-rework 3.2/D4）：镜像 runSpawn 的
                sessionController 直调通道——create → 绑蜂种（beeAssignments 落盘
                + 广播）→ selectModel（失败降默认 + notify）→ 非空 prompt 且
                autoSend 真时 prompt 直调投递首条消息（requestId 每次铸造，
                mode:queue——契约见 fix-dsh-012-host-half），否则只建不发；
                两分支均返 { ok, sessionId }。
                绕车道（3.3）：用户点卡属显式动作，沿「手动孵化绕过车道」语义
                （manual 同款）——本路由不申请 serialized 车道，SHALL NOT 排队。
                校验：workspaceId 缺失 400（zod）；蜂种缺失/工作区未知 404（均
                字段级原因，不产生半成品）；提示词空白放行创建、仅跳过投递
                （两个 autoSend 分支同义，运行时对配置宽松、合法性由编辑器门禁）。 ── */
          if (route === "/summon" && req.method === "POST") {
            const body = await readJsonBody(req);
            const summonSchema = z.object({
              workspaceId: z.string().min(1),
              beeTypeId: z.string().optional(),
              prompt: z.string().optional(),
              autoSend: z.boolean().optional()
            });
            const parsed = summonSchema.safeParse(body);
            if (!parsed.success) {
              json(res, 400, { error: "invalid summon payload", issues: parsed.error?.issues?.map((i) => i.path.join(".")) });
              return;
            }
            const { workspaceId, autoSend } = parsed.data;
            const prompt = typeof parsed.data.prompt === "string" ? parsed.data.prompt : "";
            const deliverable = prompt.trim().length > 0;
            /* 蜂种校验（缺失 404，字段级原因）。 */
            const targetType = parsed.data.beeTypeId ? beeTypeById(doc.beeTypes, parsed.data.beeTypeId) : null;
            if (parsed.data.beeTypeId && !targetType) {
              json(res, 404, { error: "bee type not found", field: "beeTypeId" });
              return;
            }
            /* 工作区校验（未知 404，字段级原因）。 */
            const knownWorkspace = (() => {
              try {
                return (ctx.workspaceRegistry?.list?.() ?? []).some((workspace) => workspace.id === workspaceId);
              } catch {
                return false;
              }
            })();
            if (!knownWorkspace) {
              json(res, 404, { error: "workspace not found", field: "workspaceId" });
              return;
            }
            try {
              /* 直调形状（runSpawn S1 复验同款）：请求对象即请求体、返回值即结果。 */
              const created = await ctx.sessionController.create({ workspaceId });
              const childSessionId = created.sessionId;
              if (targetType) {
                /* 绑定蜂种（落盘 + 广播；删除级联与回落语义见 bee-types.mjs）。 */
                doc = { ...doc, beeAssignments: { ...(doc.beeAssignments ?? {}), [childSessionId]: targetType.id } };
                const model = targetType.model;
                if (model) {
                  try {
                    await ctx.sessionController.selectModel({
                      sessionId: childSessionId,
                      provider: model.provider,
                      model: model.model,
                      ...(model.reasoningEffort ? { reasoningEffort: model.reasoningEffort } : {})
                    });
                  } catch {
                    pushNotice(childSessionId, "模型不可用，已用默认模型");
                  }
                }
              }
              persistDoc(); // 绑定落盘 + 布局广播
              if (autoSend === true && deliverable) {
                try {
                  /* requestId 每次铸造（client-minted）；第二参数为永不中止信号
                     （spike 复验 δ1）；失败留空蜂可接受（explore S2，notify 兜底）。 */
                  await ctx.sessionController.prompt(
                    {
                      requestId: randomUUID(),
                      sessionId: childSessionId,
                      mode: "queue",
                      content: [{ type: "text", text: prompt.trim() }]
                    },
                    NEVER_ABORTED_SIGNAL
                  );
                } catch (error) {
                  pushNotice(childSessionId, "召唤投递失败：" + String(error?.message || error));
                }
              }
              broadcastEngine(); // notices 兜底呈现（模型降级/投递失败）
              json(res, 200, { ok: true, sessionId: childSessionId });
            } catch (error) {
              json(res, 500, { error: "summon failed: " + String(error?.message || error) });
            }
            return;
          }

          /* ── 手动孵化（custom-bee-types 任务 3.7，spec「手动孵化绕过车道」） ── */
          if (route === "/hatch" && req.method === "POST") {
            const body = await readJsonBody(req);
            const hatchSchema = z.object({ sessionId: z.string().min(1), capabilityId: z.string().min(1) });
            const parsed = hatchSchema.safeParse(body);
            if (!parsed.success) {
              json(res, 400, { error: "invalid hatch payload" });
              return;
            }
            const { sessionId, capabilityId } = parsed.data;
            const agent = ctx.agents?.get?.(sessionId);
            if (!agent) {
              json(res, 404, { error: "session has no live agent" });
              return;
            }
            const beeType = boundBeeTypeOf(sessionId, doc.beeTypes, doc.beeAssignments);
            const capability = beeType?.capabilities.find((c) => c.id === capabilityId);
            if (!beeType || !capability) {
              json(res, 404, { error: "capability not found" });
              return;
            }
            if (capability.action.type !== "spawn") {
              json(res, 400, { error: "capability is not a spawn action" });
              return;
            }
            const vars = normalizeEngineState({ [sessionId]: doc.beeEngineState?.[sessionId] ?? {} })[sessionId]?.vars ?? {};
            const interpolated = interpolateTemplate(capability.action.promptTemplate ?? "", vars);
            if (!interpolated.ok) {
              json(res, 400, { error: "missing captured variables", missing: interpolated.missing ?? [] });
              return;
            }
            const workspaceId = workspaceOf(sessionId);
            if (!workspaceId) {
              /* 野蜂孵化降级：send + notify（spec「野蜂孵化降级」）。 */
              runSend({
                sessionId,
                beeType,
                capability,
                values: vars,
                manual: true,
                degradeText: buildAutoMessage(beeType.name, capability.name, interpolated.text)
              });
              pushNotice(sessionId, "野蜂无巢可孵化，已降级为本会话续发");
              broadcastEngine();
              json(res, 200, { ok: true, degraded: true });
              return;
            }
            const outcome = await runSpawn({ triggerSessionId: sessionId, workspaceId, beeType, capability, values: vars, manual: true });
            if (!outcome.ok) {
              json(res, 500, { error: "hatch failed" });
              return;
            }
            json(res, 200, { ok: true, sessionId: outcome.sessionId });
            return;
          }

          /* ── 车道手动操作（custom-bee-types 任务 3.7，spec「琥珀持有与手动放行」） ── */
          if (route === "/lane" && req.method === "POST") {
            const body = await readJsonBody(req);
            const laneActionSchema = z.object({
              workspaceId: z.string().min(1),
              action: z.enum(["release", "clear", "cancel"]),
              sessionId: z.string().min(1).optional()
            });
            const parsed = laneActionSchema.safeParse(body);
            if (!parsed.success) {
              json(res, 400, { error: "invalid lane payload" });
              return;
            }
            const { workspaceId, action, sessionId } = parsed.data;
            laneWorkspaces.add(workspaceId);
            let result = { ok: true };
            if (action === "release") {
              const released = lane.forceRelease(workspaceId);
              if (released.granted) onLaneGranted(workspaceId, released.granted);
              result = { ok: true, ...released };
            } else if (action === "clear") {
              result = { ok: true, cleared: lane.clearWaiting(workspaceId) };
            } else if (action === "cancel") {
              if (!sessionId) {
                json(res, 400, { error: "cancel needs sessionId" });
                return;
              }
              result = { ok: true, canceled: lane.cancelItem(workspaceId, sessionId) };
            }
            broadcastEngine();
            json(res, 200, result);
            return;
          }

          /* ── 闩锁重置（custom-bee-types 任务 5.3，spec「同值闩锁防重燃」的
                 用户手动兜底）：清除该会话全部或指定能力的闩锁，同值可重燃。 ── */
          if (route === "/latch" && req.method === "POST") {
            const body = await readJsonBody(req);
            const latchSchema = z.object({ sessionId: z.string().min(1), capabilityId: z.string().min(1).optional() });
            const parsed = latchSchema.safeParse(body);
            if (!parsed.success) {
              json(res, 400, { error: "invalid latch payload" });
              return;
            }
            const { sessionId, capabilityId } = parsed.data;
            const state = doc.beeEngineState?.[sessionId];
            if (!state || !state.latches || Object.keys(state.latches).length === 0) {
              json(res, 200, { ok: true, cleared: 0 });
              return;
            }
            const nextLatches = { ...state.latches };
            let cleared = 0;
            if (capabilityId) {
              cleared = nextLatches[capabilityId] ? 1 : 0;
              delete nextLatches[capabilityId];
            } else {
              cleared = Object.keys(nextLatches).length;
              for (const key of Object.keys(nextLatches)) delete nextLatches[key];
            }
            doc = {
              ...doc,
              beeEngineState: { ...(doc.beeEngineState ?? {}), [sessionId]: { ...state, latches: nextLatches } }
            };
            persistDoc();
            json(res, 200, { ok: true, cleared });
            return;
          }

          /* ── 模型目录代理（custom-bee-types 任务 3.7，S4 复验定稿：浮窗下拉数据源） ── */
          if (route === "/models" && req.method === "GET") {
            const sessionId = url.searchParams.get("sessionId") ?? "";
            if (!sessionId) {
              json(res, 400, { error: "sessionId required" });
              return;
            }
            /* sessionId 仅作客户端 anyLiveSessionId 哨兵（上方 400 分支），不再转发——
               目录是全局的（modelCatalog 不带 sessionId，spike 复验 δ1：async 直调）。 */
            try {
              const catalog = await ctx.sessionController.modelCatalog();
              json(res, 200, { models: catalog });
            } catch (error) {
              json(res, 502, { error: String(error?.message || error) });
            }
            return;
          }

          /* ── SSE 广播 ── */
          if (route === "/events" && req.method === "GET") {
            res.writeHead(200, {
              "content-type": "text/event-stream",
              "cache-control": "no-cache",
              connection: "keep-alive"
            });
            res.write("retry: 3000\n\n");
            res.write(": connected\n\n");
            sseClients.add(res);
            startHeartbeat();
            res.on("close", () => {
              sseClients.delete(res);
              maybeStopHeartbeat();
            });
            return;
          }

          /* ── 资产服务：模型等静态资源（包内 assets/models/<file>）── */
          if (route.startsWith("/assets/") && req.method === "GET") {
            const name = decodeURIComponent(route.slice("/assets/".length));
            if (!/^[A-Za-z0-9._-]+$/.test(name) || name.includes("..")) {
              json(res, 400, { error: "bad asset name" });
              return;
            }
            const file = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "models", name);
            let data;
            try {
              data = readFileSync(file);
            } catch {
              json(res, 404, { error: "asset not found" });
              return;
            }
            const type = name.toLowerCase().endsWith(".glb")
              ? "model/gltf-binary"
              : name.toLowerCase().endsWith(".bin")
                ? "application/octet-stream"
                : "application/octet-stream";
            res.writeHead(200, {
              "content-type": type,
              "content-length": data.length,
              "cache-control": "public, max-age=86400"
            });
            res.end(data);
            return;
          }

          json(res, 404, { error: "unknown route" });
        } catch (error) {
          json(res, 400, { error: String(error?.message || error) });
        }
      }
    });

    return () => {
      dispose();
      disposeEngine(); // 任务 3.8：监听器卸载清理
      /* hive_wait（D6）：卸载时放行全部等待器并清计时器（SHALL NOT 泄漏挂起 Promise）。 */
      for (const sessionId of [...waitersBySession.keys()]) settleWaiters(sessionId, { ok: false, reason: "unloaded" });
      disposeTools(); // hive-summon-tool：工具登出清理（SHALL NOT 泄漏）
      for (const res of sseClients) {
        try {
          res.end();
        } catch {
          /* 已断开 */
        }
      }
      sseClients.clear();
      if (heartbeat) clearInterval(heartbeat);
    };
  }, "dsh-v-hive: api routes");
}
