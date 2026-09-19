/**
 * 能力引擎纯逻辑（custom-bee-types，design D3/D4/D5）：四重门评估器、变量捕获
 * 与模板插值、自动消息前缀、自动动作保险丝。全部确定性纯函数、可冒烟直测
 * （design D9）；宿主 index.mjs 只做事件接线与动作执行。
 *
 * 四重门（D3）：
 *   ① seq 水位    每(会话×能力)记 lastProcessedSeq，只评更新回合 → 历史标记免疫
 *   ② 值闩锁      (sessionId, capabilityId, 捕获值) 三元组一次性 → 同值不重燃
 *   ③ 严格格式    仅 ```hive-handoff 围栏块内合法 JSON 视为标记；多块取最后一个
 *   ④ 文件谓词    以会话 cwd 解析相对路径（模板 {A} 插值），存在才放行；仅存在性检查
 *
 * 会话门状态（持久化进 doc.beeEngineState，D4）：
 *   sessionState = { vars: {名→值}, latches: {能力id→[捕获键]}, watermarks: {能力id→seq} }
 *
 * 宽松模式（裸正则）按 D3 默认关：v1 不实现、不暴露配置面，评估器只走严格格式门。
 */

import { parseTemplate } from "./bee-types.mjs";

/** hive-handoff 围栏块语言标记（严格格式门只认这个 tag）。 */
export const HANDOFF_TAG = "hive-handoff";

/* ── ③ 严格格式门：围栏块解析 ── */

/**
 * 从消息文本解析全部合法 ```hive-handoff 围栏块（按出现序）。
 * 仅围栏块内的内容参与 JSON 解析；JSON 不合法的块忽略（散文/复述/引用天然免疫）。
 * 围栏闭合缺失时取到文本尾。返回解析成功的 payload 数组（可空）。
 */
export function parseHandoffBlocks(text) {
  if (typeof text !== "string" || !text) return [];
  const payloads = [];
  const fence = "```" + HANDOFF_TAG;
  let from = 0;
  while (true) {
    const start = text.indexOf(fence, from);
    if (start === -1) break;
    let bodyStart = start + fence.length;
    /* 语言标记行容错：```hive-handoff 后允许同行尾随空白 */
    const lineEnd = text.indexOf("\n", bodyStart);
    if (lineEnd !== -1 && text.slice(bodyStart, lineEnd).trim() === "") bodyStart = lineEnd + 1;
    const end = text.indexOf("```", bodyStart);
    const body = text.slice(bodyStart, end === -1 ? text.length : end);
    from = end === -1 ? text.length : end + 3;
    try {
      const payload = JSON.parse(body);
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        payloads.push(payload);
      }
    } catch {
      /* 非法 JSON：该块不视为标记 */
    }
  }
  return payloads;
}

/** 末条消息的 handoff 载荷：多个合法块取最后一个（尾部输出习惯，审阅 F3 定稿）。 */
export function lastHandoffPayload(text) {
  const payloads = parseHandoffBlocks(text);
  return payloads.length ? { ok: true, payload: payloads[payloads.length - 1] } : { ok: false };
}

/* ── 变量捕获（变量名 → JSON 键路径） ── */

/** 捕获值的字符串形态：原值 → 字符串；对象/数组 → 紧凑 JSON；undefined/null/缺失 → 不捕获。 */
export function captureValueToString(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

/** 按 JSON 键路径取值；路径断裂返回 undefined。 */
export function readKeyPath(payload, keyPath) {
  let current = payload;
  for (const segment of String(keyPath).split(".")) {
    if (!current || typeof current !== "object") return undefined;
    current = current[segment];
  }
  return current;
}

/**
 * 捕获映射求值：{ 变量名: 键路径 } × handoff payload → { 变量名: 字符串值 }。
 * 引用缺失键的变量不进结果（模板插值侧按未捕获拒发兜底）。
 */
export function extractCaptureValues(capture, payload) {
  const values = {};
  if (!capture || !payload) return values;
  for (const [name, keyPath] of Object.entries(capture)) {
    const value = captureValueToString(readKeyPath(payload, keyPath));
    if (value !== null) values[name] = value;
  }
  return values;
}

/** 闩锁键（捕获值三元组里「值」一侧的确定性形态；空捕获 → ""）。 */
export function captureKey(values) {
  const names = Object.keys(values ?? {}).sort();
  return JSON.stringify(names.map((name) => [name, values[name]]));
}

/* ── 模板插值 ── */

/**
 * `{A}` 插值：未捕获变量 → { ok:false, missing }（fail-safe 拒发，SHALL NOT 把
 * 未插值占位符发给模型）。字面 `{{`/`}}` 转义还原为单花括号。
 */
export function interpolateTemplate(template, vars) {
  const parsed = parseTemplate(template);
  if (!parsed.ok) return { ok: false, missing: [], badTemplate: true };
  const missing = parsed.vars.filter((name) => !vars || typeof vars[name] !== "string");
  if (missing.length) return { ok: false, missing };
  let out = "";
  const text = String(template);
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "{" && text[i + 1] === "{") {
      out += "{";
      i += 2;
      continue;
    }
    if (ch === "}") {
      /* `}}` 转义对 → 单 }；孤立 }（parseTemplate 已拒，防御性兜底）原样输出 */
      out += "}";
      i += text[i + 1] === "}" ? 2 : 1;
      continue;
    }
    if (ch === "{") {
      const end = text.indexOf("}", i + 1);
      const name = end === -1 ? "" : text.slice(i + 1, end);
      out += vars[name] ?? "";
      i = end + 1;
      continue;
    }
    out += ch;
    i += 1;
  }
  return { ok: true, text: out };
}

/* ── 文件谓词 ── */

/**
 * 文件谓词路径解析（纯路径合成，不做 IO）：以 cwd 为基拼相对模板路径；
 * 模板引用未捕获变量 → 视为不满足（审阅 F3：不解析即不放行）。
 * 引擎与蜂卡等待状态用这个展示绝对路径；评估器本身只把插值后的相对路径
 * 交给注入的 fileExists 回调。
 */
export function resolvePredicatePath(filePredicate, vars, cwd) {
  const parsed = parseTemplate(filePredicate);
  if (!parsed.ok) return { ok: false };
  const missing = parsed.vars.filter((name) => typeof vars?.[name] !== "string");
  if (missing.length) return { ok: false, missing };
  const relative = interpolateTemplate(filePredicate, vars);
  if (!relative.ok) return { ok: false };
  const base = String(cwd ?? "").replace(/[\\/]+$/, "");
  return { ok: true, path: base ? base + "/" + relative.text : relative.text };
}

/* ── 四重门评估 ── */

/**
 * 逐能力评估（门序：水位 → 严格格式 → 值闩锁 → 文件谓词；格式门先于闩锁是因为
 * 闩锁键需要捕获值）。只读入参、只产出决策 —— 状态落盘由调用方（引擎接线）按
 * 返回的 nextPatch 执行，保证纯度。
 *
 * @param {object} input
 *   capability  能力规则（bee-types.mjs 形状）
 *   text        会话最后一条 assistant 消息文本（作用域仅末条消息）
 *   seq         该消息的事件 seq（水位比较基准）
 *   sessionState { vars, latches, watermarks }（可空，按空处理）
 *   fileExists  (absolutePath) => boolean（谓词仅存在性检查；缺省恒 false）
 * @returns 触发：{ triggered:true, values, latchKey, gate:'pass', nextWatermark }
 *          拦截：{ triggered:false, gate:'watermark'|'format'|'latch'|'predicate', missingVars? }
 */
export function evaluateCapability({ capability, text, seq, sessionState, fileExists }) {
  const state = sessionState ?? { vars: {}, latches: {}, watermarks: {} };
  const watermark = state.watermarks?.[capability.id] ?? -1;
  /* ① 水位：只评更新回合（历史标记免疫） */
  if (!Number.isInteger(seq) || seq <= watermark) return { triggered: false, gate: "watermark" };

  /* ③ 严格格式：合法 hive-handoff 围栏块（多块取最后一个） */
  const handoff = lastHandoffPayload(text);
  if (!handoff.ok) return { triggered: false, gate: "format" };

  const values = extractCaptureValues(capability.trigger?.capture, handoff.payload);
  const key = captureKey(values);

  /* ② 值闩锁：once（缺省 true）时 (会话, 能力, 捕获值) 一次性 */
  if (capability.once !== false) {
    const latched = state.latches?.[capability.id] ?? [];
    if (latched.includes(key)) return { triggered: false, gate: "latch" };
  }

  /* ④ 文件谓词：未捕获变量视为不满足；存在性检查 */
  const predicate = capability.trigger?.filePredicate;
  if (predicate) {
    const parsed = parseTemplate(predicate);
    const missing = parsed.ok ? parsed.vars.filter((name) => typeof values[name] !== "string") : [];
    if (!parsed.ok || missing.length) return { triggered: false, gate: "predicate", missingVars: missing };
    const relative = interpolateTemplate(predicate, values);
    if (!relative.ok) return { triggered: false, gate: "predicate" };
    if (typeof fileExists !== "function" || !fileExists(relative.text)) {
      return { triggered: false, gate: "predicate" };
    }
  }

  return { triggered: true, gate: "pass", values, latchKey: key, nextWatermark: seq };
}

/**
 * 整蜂种评估：按能力声明顺序逐条过门（审阅 F8：命中多条按声明顺序执行）。
 * 返回 hits（触发项）与 blocked（拦截项，供蜂卡「等待标记/等待谓词」状态）；
 * 不改写 sessionState —— 引擎接线按 hits 落水位于闩锁。
 */
export function evaluateBeeType({ beeType, text, seq, sessionState, fileExists }) {
  const hits = [];
  const blocked = [];
  for (const capability of beeType?.capabilities ?? []) {
    const verdict = evaluateCapability({ capability, text, seq, sessionState, fileExists });
    if (verdict.triggered) hits.push({ capability, values: verdict.values, latchKey: verdict.latchKey });
    else blocked.push({ capability, gate: verdict.gate, missingVars: verdict.missingVars });
  }
  return { hits, blocked };
}

/** 触发落盘补丁：把 hits 的水位/闩锁/变量并进会话门状态（纯函数，返回新对象）。 */
export function applyHitsToSessionState(sessionState, hits, seq) {
  const state = {
    vars: { ...(sessionState?.vars ?? {}) },
    latches: Object.fromEntries(Object.entries(sessionState?.latches ?? {}).map(([k, v]) => [k, [...v]])),
    watermarks: { ...(sessionState?.watermarks ?? {}) }
  };
  for (const hit of hits) {
    if (Number.isInteger(seq)) state.watermarks[hit.capability.id] = seq;
    if (hit.capability.once !== false) {
      const list = state.latches[hit.capability.id] ?? [];
      if (!list.includes(hit.latchKey)) list.push(hit.latchKey);
      state.latches[hit.capability.id] = list.slice(-64);
    }
    for (const [name, value] of Object.entries(hit.values ?? {})) state.vars[name] = value;
  }
  return state;
}

/* ── 自动消息前缀 ── */

export const AUTO_PREFIX_MARK = "⟡";

/** 自动消息前缀（spec「自动消息可辨识」）：⟡蜂种名·能力：能力名。 */
export function autoMessagePrefix(beeTypeName, capabilityName) {
  return `${AUTO_PREFIX_MARK}${beeTypeName ?? ""}·能力：${capabilityName ?? ""}`;
}

/** 组装引擎自动消息全文：前缀行 + 空行 + 正文（正文经插值）。 */
export function buildAutoMessage(beeTypeName, capabilityName, bodyText) {
  return `${autoMessagePrefix(beeTypeName, capabilityName)}\n\n${bodyText ?? ""}`;
}

/* ── 工具召唤首条消息（hive-summon-tool D3，能力前缀族的可辨识变体） ── */

/** 工具召唤前缀（spec「自动消息可辨识」）：⟡蜂种名·召唤（与 ⟡蜂种名·能力：X 同族）。 */
export function autoSummonPrefix(beeTypeName) {
  return `${AUTO_PREFIX_MARK}${beeTypeName ?? ""}·召唤`;
}

/**
 * 组装工具召唤首条消息全文：前缀行 + 空行 + payload（A 侧数据，在前）+
 * presetPrompt（B 侧行为，在后）。组合规则唯一（spec「组合投递」）；payload 空白的
 * 召唤在调用方即不投递（纯创建），本函数只被非空 payload 路径调用。
 * 前缀以 ⟡ 开头 → isAutoPrefixed 命中 → 子蜂 inbox 不误判用户消息（保险丝重置兼容）。
 */
export function buildSummonMessage(beeTypeName, payload, presetPrompt) {
  const body = [typeof payload === "string" ? payload.trim() : "", typeof presetPrompt === "string" ? presetPrompt.trim() : ""]
    .filter(Boolean)
    .join("\n\n");
  return `${autoSummonPrefix(beeTypeName)}\n\n${body}`;
}

/** 是否引擎自动消息（保险丝「连续自动续发」与用户消息重置的判别）。 */
export function isAutoPrefixed(text) {
  return typeof text === "string" && text.startsWith(AUTO_PREFIX_MARK);
}

/* ── 自动动作保险丝（内存态，重启清零 —— 损害有界，design D4/S2） ── */

export const FUSE_LIMITS = Object.freeze({
  /** 连续自动动作上限（无用户消息间隔的引擎动作串）。 */
  consecutiveAutoActions: 8,
  /** spawn 链深度上限（A 孵 B、B 孵 C…每级 +1）。 */
  spawnChainDepth: 4,
  /** 单会话自动 spawn 次数上限。 */
  sessionAutoSpawns: 4
});

/** 保险丝计数器（引擎内存态）：consecutive + 每 sessionId 的 spawn 计数与链深。 */
export function createFuseCounters() {
  return { consecutive: 0, autoSpawnsBySession: {}, chainDepthBySession: {} };
}

/**
 * 用户消息进来（非引擎前缀）→ 连续自动动作计数清零。spawn 链深与单会话 spawn
 * 计数是有界产物计数，不随用户消息清零（防「用户喂一句、无限孵化」绕过）。
 */
export function resetFuseOnUserMessage(counters) {
  if (counters) counters.consecutive = 0;
}

/** 取某会话的 spawn 链深（无链记录 → 0）。 */
export function chainDepthOf(counters, sessionId) {
  return counters?.chainDepthBySession?.[sessionId] ?? 0;
}

/** spawn 产出子会话的链深 = 父链深 + 1（父无链记录 → 1）。 */
export function childChainDepth(counters, parentSessionId, childSessionId) {
  const depth = chainDepthOf(counters, parentSessionId) + 1;
  if (counters) counters.chainDepthBySession[childSessionId] = depth;
  return depth;
}

/**
 * 放行判定：超任一上限 → { allowed:false, reason }（引擎停链并 notify）。
 * reason: 'consecutive'（连续自动动作超限）| 'chainDepth' | 'sessionSpawns'。
 */
export function fuseVerdict(counters, limits, { sessionId, kind }) {
  const caps = { ...FUSE_LIMITS, ...limits };
  if ((counters?.consecutive ?? 0) >= caps.consecutiveAutoActions) {
    return { allowed: false, reason: "consecutive" };
  }
  if (kind === "spawn") {
    if (chainDepthOf(counters, sessionId) >= caps.spawnChainDepth) {
      return { allowed: false, reason: "chainDepth" };
    }
    if ((counters?.autoSpawnsBySession?.[sessionId] ?? 0) >= caps.sessionAutoSpawns) {
      return { allowed: false, reason: "sessionSpawns" };
    }
  }
  return { allowed: true };
}

/** 记账一次引擎动作（放行后调用）。 */
export function recordFuseAction(counters, { sessionId, kind }) {
  if (!counters) return;
  counters.consecutive += 1;
  if (kind === "spawn" && sessionId) {
    counters.autoSpawnsBySession[sessionId] = (counters.autoSpawnsBySession[sessionId] ?? 0) + 1;
  }
}
