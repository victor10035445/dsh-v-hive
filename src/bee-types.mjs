/**
 * 自定义蜂种纯逻辑（custom-bee-types，design D7/D9）：蜂种与绑定/门状态的归一化、
 * PUT 前严格校验、删除级联、默认蜂回落语义。独立无依赖模块——宿主 index.mjs
 * 的 schema/PUT 校验、浏览器浮窗、冒烟测试三方共用（沿 commands.mjs 先例）。
 *
 * 数据形状（layout doc optional 字段，version 1 不变）：
 *   doc.beeTypes: BeeType[]（上限 16）
 *   doc.beeAssignments: Record<sessionId, beeTypeId>（随绑定清理）
 *   doc.beeEngineState: Record<sessionId, { vars, latches, watermarks }>（见 capabilities.mjs）
 *
 * BeeType = {
 *   id: string                    唯一；禁用保留字 "default"（缺省蜂由「无绑定」语义表达）
 *   name: string                  非空（trim）
 *   description?: string
 *   model?: { provider, model, reasoningEffort? }   只校验形状，不校验目录成员（审阅 F10）
 *   beeModel?: string             外观模型 id（BEE_APPEARANCE_MODELS 之一；缺省 = worker）
 *   presetPrompt?: string         蜂种级预设提示词（hive-summon-tool，B 侧行为定义）：
 *                                 工具召唤首条消息 = payload（A 侧数据，在前）+ 本字段
 *                                 （B 侧行为，在后）；trim 存储，超上限丢弃/拒绝
 *   queuePolicy: "free" | "serialized"              缺省 free
 *   capabilities: Capability[]（每蜂种上限 16）
 * }
 *
 * Capability = {
 *   id: string                    蜂种内唯一
 *   name: string                  非空（自动消息前缀「⟡蜂种名·能力：能力名」用它）
 *   trigger: {
 *     capture?: { [varName]: "a.b.c" }    变量名 → hive-handoff JSON 键路径（点分段）
 *     filePredicate?: string               相对路径模板（{A} 插值，仅存在性检查）
 *   }
 *   action: {
 *     type: "send" | "spawn" | "notify" | "conductor"   conductor 仅保留枚举形状不实现
 *     promptTemplate?: string      send/spawn 必填；{A} 插值
 *     targetBeeTypeId?: string     spawn 必填（指向同文档内另一蜂种）
 *   }
 *   once?: boolean                 值闩锁开关，缺省 true（同值不重燃，fail-safe）
 * }
 *
 * 宽松模式（裸正则）按 design D3 默认关，v1 不暴露配置面，故无正则模板字段。
 */

export const MAX_BEE_TYPES = 16;
export const MAX_CAPABILITIES = 16;
export const MAX_CAPTURE_VARS = 8;
export const RESERVED_BEE_TYPE_ID = "default";

/** 蜂种预设提示词长度上限（hive-summon-tool）：字符数（trim 后）。B 侧行为定义
 *  是紧凑的指引文本而非任务载荷（任务走 payload），4000 字符余量充足。 */
export const MAX_PRESET_PROMPT = 4000;

/** 蜂种外观模型（3D 蜂模型 id）：资产 = assets/models/<id>.glb（宿主 /assets/ 路由
 *  提供），渲染层按蜂种变体实例化。worker 为默认外观（缺省/未知 id 回落）。 */
export const BEE_APPEARANCE_MODELS = Object.freeze(["worker", "purple_worker", "pink_worker", "blue_worker"]);
export const DEFAULT_APPEARANCE_MODEL = "worker";

/** id / 变量名的保守形状：字母数字下划线连字符，1–64；变量名再禁连字符（占位符 {A} 可读性）。 */
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const VAR_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]{0,31}$/;
const KEY_PATH_SEGMENT_RE = /^[^.\s]{1,64}$/;

/* ── 模板占位符解析（「模板可编译性」校验与插值共用同一套语法） ── */

/**
 * 解析模板里的 `{name}` 占位符。语法错误（空占位符 `{}`、`{A`、裸 `}`、
 * 占位符名不合法）返回 `{ ok: false, badVars }`；合法返回 `{ ok: true, vars }`
 * （去重后的变量名列表）。字面花括号用 `{{` / `}}` 转义。
 */
export function parseTemplate(template) {
  const vars = [];
  const badVars = [];
  const text = typeof template === "string" ? template : "";
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "{") {
      if (text[i + 1] === "{") {
        i += 2;
        continue;
      }
      const end = text.indexOf("}", i + 1);
      if (end === -1) return { ok: false, vars, badVars };
      const name = text.slice(i + 1, end);
      if (!VAR_NAME_RE.test(name)) {
        badVars.push(name);
        return { ok: false, vars, badVars };
      }
      if (!vars.includes(name)) vars.push(name);
      i = end + 1;
      continue;
    }
    if (ch === "}") {
      /* 裸 } 只有在不成对时才可能是转义残留；}}} 视为语法错误 */
      if (text[i + 1] === "}") {
        i += 2;
        continue;
      }
      return { ok: false, vars, badVars };
    }
    i += 1;
  }
  return { ok: true, vars, badVars };
}

/* ── 内部小工具 ── */

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

function normalizeKeyPath(value) {
  if (typeof value !== "string") return null;
  const segments = value.trim().split(".");
  if (segments.length < 1 || segments.length > 8) return null;
  for (const segment of segments) {
    if (!KEY_PATH_SEGMENT_RE.test(segment)) return null;
  }
  return segments.join(".");
}

function normalizeModel(value) {
  if (!value || typeof value !== "object") return undefined;
  const provider = cleanText(value.provider);
  const model = cleanText(value.model);
  const reasoningEffort = cleanText(value.reasoningEffort);
  if (!provider || !model) return undefined;
  return reasoningEffort ? { provider, model, reasoningEffort } : { provider, model };
}

function normalizeFilePredicate(value) {
  const raw = cleanText(value);
  if (!raw) return undefined;
  /* 相对路径形状：禁绝对路径 / 盘符 / 上跳段；分隔符统一为 /，供 cwd join。 */
  if (raw.startsWith("/") || raw.startsWith("\\") || /^[A-Za-z]:/.test(raw)) return undefined;
  const segments = raw.split(/[\\/]/);
  if (segments.some((s) => s === "..")) return undefined;
  return segments.join("/");
}

function normalizeTrigger(value) {
  const trigger = value && typeof value === "object" ? value : {};
  const capture = {};
  if (trigger.capture && typeof trigger.capture === "object") {
    for (const [name, path] of Object.entries(trigger.capture)) {
      if (capture.length >= MAX_CAPTURE_VARS) break;
      if (!VAR_NAME_RE.test(name)) continue;
      const keyPath = normalizeKeyPath(path);
      if (!keyPath || Object.values(capture).includes(keyPath)) continue;
      capture[name] = keyPath;
    }
  }
  return {
    capture,
    ...(normalizeFilePredicate(trigger.filePredicate) ? { filePredicate: normalizeFilePredicate(trigger.filePredicate) } : {})
  };
}

function normalizeAction(value) {
  const action = value && typeof value === "object" ? value : {};
  const type = typeof action.type === "string" ? action.type : "";
  if (!["send", "spawn", "notify", "conductor"].includes(type)) return null;
  const promptTemplate = typeof action.promptTemplate === "string" ? action.promptTemplate : "";
  const targetBeeTypeId = cleanText(action.targetBeeTypeId);
  return {
    type,
    ...(promptTemplate ? { promptTemplate } : {}),
    ...(targetBeeTypeId ? { targetBeeTypeId } : {})
  };
}

function normalizeCapability(value) {
  if (!value || typeof value !== "object") return null;
  const id = cleanText(value.id);
  const name = cleanText(value.name);
  const action = normalizeAction(value.action);
  if (!id || !ID_RE.test(id) || !name || !action) return null;
  return {
    id,
    name,
    trigger: normalizeTrigger(value.trigger),
    action,
    once: value.once !== false
  };
}

/**
 * 蜂种列表归一化（读取路径，宽松）：非法条目整条丢弃，顺序 = 数组序。
 * 超上限截断到前 MAX_BEE_TYPES 条（旧文档被手工改坏时的兜底，不报错）。
 */
export function normalizeBeeTypes(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const ids = new Set();
  for (const item of raw) {
    if (!item || typeof item !== "object" || out.length >= MAX_BEE_TYPES) continue;
    const id = cleanText(item.id);
    const name = cleanText(item.name);
    if (!id || !ID_RE.test(id) || id === RESERVED_BEE_TYPE_ID || !name) continue;
    if (ids.has(id)) continue;
    const model = normalizeModel(item.model);
    const queuePolicy = item.queuePolicy === "serialized" ? "serialized" : "free";
    const beeModel = BEE_APPEARANCE_MODELS.includes(item.beeModel) ? item.beeModel : undefined;
    /* 预设提示词（hive-summon-tool）：trim 存储；超上限的条目按缺失处理（读取路径
       宽松归一化——手工改坏的文档丢弃字段而非整条蜂种，与 description 同口径）。 */
    const presetPrompt = cleanText(item.presetPrompt);
    const capabilities = [];
    const capIds = new Set();
    for (const rawCap of Array.isArray(item.capabilities) ? item.capabilities : []) {
      if (capabilities.length >= MAX_CAPABILITIES) break;
      const cap = normalizeCapability(rawCap);
      if (!cap || capIds.has(cap.id)) continue;
      capIds.add(cap.id);
      capabilities.push(cap);
    }
    ids.add(id);
    out.push({
      id,
      name,
      ...(cleanText(item.description) ? { description: cleanText(item.description) } : {}),
      ...(model ? { model } : {}),
      ...(presetPrompt && presetPrompt.length <= MAX_PRESET_PROMPT ? { presetPrompt } : {}),
      queuePolicy,
      ...(beeModel && beeModel !== DEFAULT_APPEARANCE_MODEL ? { beeModel } : {}),
      capabilities
    });
  }
  return out;
}

/**
 * 绑定归一化（读取路径，宽松）：丢弃指向不存在蜂种的条目（删除级联漏网/旧文档残留），
 * 会话 id 非空字符串才算键。默认蜂 = 键缺失，不落「default」值。
 */
export function normalizeAssignments(raw, beeTypes) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  const known = new Set((beeTypes ?? []).map((t) => t.id));
  for (const [sessionId, typeId] of Object.entries(raw)) {
    if (!sessionId || typeof typeId !== "string") continue;
    if (!known.has(typeId)) continue;
    out[sessionId] = typeId;
  }
  return out;
}

/** 会话门状态归一化（读取路径，宽松）：形状坏掉的条目整条丢弃。 */
export function normalizeEngineState(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [sessionId, entry] of Object.entries(raw)) {
    if (!sessionId || !entry || typeof entry !== "object") continue;
    const vars = {};
    if (entry.vars && typeof entry.vars === "object") {
      for (const [name, value] of Object.entries(entry.vars)) {
        if (VAR_NAME_RE.test(name) && typeof value === "string") vars[name] = value;
      }
    }
    const latches = {};
    if (entry.latches && typeof entry.latches === "object") {
      for (const [capabilityId, values] of Object.entries(entry.latches)) {
        if (!Array.isArray(values)) continue;
        const list = values.filter((v) => typeof v === "string").slice(0, 64);
        if (list.length) latches[capabilityId] = list;
      }
    }
    const watermarks = {};
    if (entry.watermarks && typeof entry.watermarks === "object") {
      for (const [capabilityId, seq] of Object.entries(entry.watermarks)) {
        if (Number.isInteger(seq) && seq >= 0) watermarks[capabilityId] = seq;
      }
    }
    out[sessionId] = { vars, latches, watermarks };
  }
  return out;
}

/* ── 严格校验（PUT 路径）：首个错误即返回，字段级原因 ── */

const fieldAt = (index, sub) => `beeTypes[${index}]${sub ? "." + sub : ""}`;

/**
 * 校验待提交的蜂种草稿（PUT /state 的 beeTypes 字段）。全部通过返回 null；
 * 否则返回首个 `{ field, code }`（宿主 400 带字段级原因，客户端映射 zh/en 词条）。
 *
 * 规则：id 合法且唯一且非保留字；name 非空；model 形状；presetPrompt 类型/长度
 * （超上限 → presetPromptTooLong）；queuePolicy 枚举；
 * capabilities 上限与逐条校验（含模板可编译性：占位符语法、捕获键路径、文件谓词形状）；
 * spawn 动作必须带 promptTemplate + targetBeeTypeId；send 必须带 promptTemplate。
 */
export function validateBeeTypesDraft(rows) {
  if (!Array.isArray(rows)) return { field: "beeTypes", code: "invalidShape" };
  if (rows.length > MAX_BEE_TYPES) return { field: "beeTypes", code: "tooManyBeeTypes" };
  const ids = new Set();
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    if (!row || typeof row !== "object") return { field: fieldAt(index), code: "invalidShape" };
    const id = cleanText(row.id);
    if (!id) return { field: fieldAt(index, "id"), code: "missingId" };
    if (id === RESERVED_BEE_TYPE_ID) return { field: fieldAt(index, "id"), code: "reservedId" };
    if (!ID_RE.test(id)) return { field: fieldAt(index, "id"), code: "invalidId" };
    if (ids.has(id)) return { field: fieldAt(index, "id"), code: "duplicateId" };
    ids.add(id);
    if (!cleanText(row.name)) return { field: fieldAt(index, "name"), code: "missingName" };
    if (row.model !== undefined && row.model !== null) {
      if (typeof row.model !== "object") return { field: fieldAt(index, "model"), code: "invalidModel" };
      if (!cleanText(row.model.provider) || !cleanText(row.model.model)) {
        return { field: fieldAt(index, "model"), code: "invalidModel" };
      }
      if (row.model.reasoningEffort !== undefined && !cleanText(row.model.reasoningEffort)) {
        return { field: fieldAt(index, "model.reasoningEffort"), code: "invalidModel" };
      }
    }
    if (row.queuePolicy !== undefined && row.queuePolicy !== "free" && row.queuePolicy !== "serialized") {
      return { field: fieldAt(index, "queuePolicy"), code: "invalidQueuePolicy" };
    }
    if (row.beeModel !== undefined && row.beeModel !== null && !BEE_APPEARANCE_MODELS.includes(row.beeModel)) {
      return { field: fieldAt(index, "beeModel"), code: "invalidBeeModel" };
    }
    /* 预设提示词（hive-summon-tool）：可空（缺省 = 无预设）；非法类型/超上限
       → 字段级原因（宿主 400，客户端映射词条）。 */
    if (row.presetPrompt !== undefined && row.presetPrompt !== null) {
      if (typeof row.presetPrompt !== "string" || !cleanText(row.presetPrompt)) {
        return { field: fieldAt(index, "presetPrompt"), code: "invalidPresetPrompt" };
      }
      if (row.presetPrompt.trim().length > MAX_PRESET_PROMPT) {
        return { field: fieldAt(index, "presetPrompt"), code: "presetPromptTooLong" };
      }
    }
    const caps = row.capabilities ?? [];
    if (!Array.isArray(caps)) return { field: fieldAt(index, "capabilities"), code: "invalidShape" };
    if (caps.length > MAX_CAPABILITIES) return { field: fieldAt(index, "capabilities"), code: "tooManyCapabilities" };
    const capIds = new Set();
    for (let c = 0; c < caps.length; c++) {
      const cap = caps[c];
      const base = `${fieldAt(index, "capabilities")}[${c}]`;
      if (!cap || typeof cap !== "object") return { field: base, code: "invalidShape" };
      const capId = cleanText(cap.id);
      if (!capId) return { field: `${base}.id`, code: "missingId" };
      if (!ID_RE.test(capId)) return { field: `${base}.id`, code: "invalidId" };
      if (capIds.has(capId)) return { field: `${base}.id`, code: "duplicateId" };
      capIds.add(capId);
      if (!cleanText(cap.name)) return { field: `${base}.name`, code: "missingName" };
      /* trigger */
      const trigger = cap.trigger;
      if (trigger !== undefined && (trigger === null || typeof trigger !== "object")) {
        return { field: `${base}.trigger`, code: "invalidShape" };
      }
      const capture = trigger?.capture;
      if (capture !== undefined && (capture === null || typeof capture !== "object" || Array.isArray(capture))) {
        return { field: `${base}.trigger.capture`, code: "invalidCapture" };
      }
      if (capture && Object.keys(capture).length > MAX_CAPTURE_VARS) {
        return { field: `${base}.trigger.capture`, code: "tooManyCaptureVars" };
      }
      for (const [varName, keyPath] of Object.entries(capture ?? {})) {
        if (!VAR_NAME_RE.test(varName)) return { field: `${base}.trigger.capture.${varName}`, code: "invalidCaptureVar" };
        if (typeof keyPath !== "string" || !normalizeKeyPath(keyPath)) {
          return { field: `${base}.trigger.capture.${varName}`, code: "invalidCapturePath" };
        }
      }
      const predicate = trigger?.filePredicate;
      if (predicate !== undefined && predicate !== null) {
        if (typeof predicate !== "string" || !cleanText(predicate) || !normalizeFilePredicate(predicate)) {
          return { field: `${base}.trigger.filePredicate`, code: "invalidPredicate" };
        }
        const parsedPredicate = parseTemplate(predicate);
        if (!parsedPredicate.ok) return { field: `${base}.trigger.filePredicate`, code: "invalidTemplate" };
      }
      /* action */
      const action = cap.action;
      if (!action || typeof action !== "object") return { field: `${base}.action`, code: "invalidShape" };
      const type = action.type;
      if (!["send", "spawn", "notify", "conductor"].includes(type)) {
        return { field: `${base}.action.type`, code: "invalidActionType" };
      }
      if (type === "send" || type === "spawn") {
        if (typeof action.promptTemplate !== "string" || !action.promptTemplate.trim()) {
          return { field: `${base}.action.promptTemplate`, code: "missingTemplate" };
        }
        const parsed = parseTemplate(action.promptTemplate);
        if (!parsed.ok) return { field: `${base}.action.promptTemplate`, code: "invalidTemplate" };
      }
      if (type === "spawn") {
        const target = cleanText(action.targetBeeTypeId);
        if (!target) return { field: `${base}.action.targetBeeTypeId`, code: "missingTarget" };
        if (target === RESERVED_BEE_TYPE_ID || !ID_RE.test(target)) {
          return { field: `${base}.action.targetBeeTypeId`, code: "invalidTarget" };
        }
      }
      if (cap.once !== undefined && typeof cap.once !== "boolean") {
        return { field: `${base}.once`, code: "invalidOnce" };
      }
    }
  }
  return null;
}

/* ── 删除级联 ── */

/**
 * 删除蜂种（design D7 / spec「删除蜂种自动回落」）：
 *  - 从 beeTypes 移除该蜂种；
 *  - 级联清 beeAssignments 中指向它的绑定（这些蜜蜂自动回落默认蜂）；
 *  - 级联移除其它蜂种能力里 spawn 目标指向它的能力（spec：SHALL NOT 产生孤儿引用或残留触发规则）；
 *  - 返回被清绑定的会话 id 列表（调用方可据此清 beeEngineState 同帧失效）。
 */
export function cascadeDeleteBeeType(beeTypes, assignments, targetId) {
  const types = (beeTypes ?? []).filter((t) => t.id !== targetId);
  const droppedSessions = [];
  const nextAssignments = {};
  for (const [sessionId, typeId] of Object.entries(assignments ?? {})) {
    if (typeId === targetId) {
      droppedSessions.push(sessionId);
      continue;
    }
    nextAssignments[sessionId] = typeId;
  }
  const nextTypes = types.map((type) => ({
    ...type,
    capabilities: type.capabilities.filter(
      (cap) => !(cap.action.type === "spawn" && cap.action.targetBeeTypeId === targetId)
    )
  }));
  return { beeTypes: nextTypes, assignments: nextAssignments, droppedSessions };
}

/* ── 查询 ── */

export function beeTypeById(beeTypes, id) {
  return (beeTypes ?? []).find((t) => t.id === id) ?? null;
}

/**
 * 默认蜂回落语义：绑定存在且蜂种在册 → 该蜂种；否则 null（默认蜂，无徽章无能力驱动）。
 */
export function boundBeeTypeOf(sessionId, beeTypes, assignments) {
  if (!sessionId) return null;
  const typeId = assignments?.[sessionId];
  if (!typeId) return null;
  return beeTypeById(beeTypes, typeId);
}
