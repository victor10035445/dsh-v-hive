/**
 * 语音指令语法匹配器（add-hive-voice-desk 3.3 / design D2/D3，审阅 R10/R13）。
 *
 * 纯逻辑模块（零 DOM、零 React），可被 Node 直接 import 做真值表冒烟。
 *
 * 三条纪律：
 *  1. **整段意图**：匹配作用于归一化后的完整拼接稿——模式一律两端锚定
 *     （`^…$`），SHALL NOT 对正文做子串命中。讨论里出现的「召唤」「发给」字样
 *     在整段语义里会被多余实义词挡住 → 判未命中 → 回落调研模式。
 *  2. **副作用闸门**：`summon` / `deliver` 标 `sideEffect: true`，调用方（M3）
 *     必须先出确认卡；纯本地动作（总览/聚焦/会话控制/手动应答）直接执行。
 *  3. **弹回**：确认态超时由调用方丢弃；匹配器本身不持状态。
 *
 * 数字与同义词归一：一二三…十/十一…九十九 → 数字；`看看/聚焦/打开` 同义归一。
 */

/** 指令族（值即 intent kind）。 */
export const INTENT = Object.freeze({
  SESSION_END: "session-end",
  SESSION_RESUME: "session-resume",
  HIVE_OVERVIEW: "hive-overview",
  BEE_FOCUS: "bee-focus",
  SUMMON: "summon",
  DELIVER: "deliver",
  CONFIRM: "confirm",
  CANCEL: "cancel",
  ANSWER: "answer",
  NONE: "none"
});

/** 有副作用（创建会话 / 投递消息）→ 必须过确认卡（D3 纪律 2）。 */
export const SIDE_EFFECT_INTENTS = Object.freeze([INTENT.SUMMON, INTENT.DELIVER]);

export function hasSideEffect(kind) {
  return SIDE_EFFECT_INTENTS.includes(kind);
}

/* ── 归一化 ── */

/** 中文数字表（一…十 + 常用口语变体）。 */
const CN_DIGITS = Object.freeze({ 零: 0, 〇: 0, 一: 1, 幺: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 });

/** 句首填充词（整段意图判定时剥离，design D3「允许填充词」）。 */
const LEAD_FILLERS = Object.freeze([
  "那个", "这个", "帮我", "帮忙", "麻烦", "请你", "请", "你给我", "给我", "我想", "我要", "我打算", "现在", "然后", "接着", "另外", "顺便", "嗯", "哦", "呃", "哎", "诶", "我", "你"
]);

/** 句尾语气词（同上）。 */
const TAIL_FILLERS = Object.freeze(["吧", "呢", "啊", "呀", "好吗", "行吗", "谢谢", "一下", "一点", "了"]);

/** 指称结构标记（判断「这是在对蜂说话」还是「正文里恰好出现相似字样」）。 */
const REFERENCE_MARKERS = /(号?(蜂|工蜂)|这只蜂|这个蜂|当前蜂|当前会话|这个会话)/;

/** 蜂种泛称（「召唤两个蜂」= 默认蜂，不要求配置过蜂种）。 */
const GENERIC_BEE_WORD = /^(蜂|工蜂|蜜蜂|助手|会话|bot)?$/;

/** 标点与空白（归一化一律剥离）。 */
const PUNCT = /[，。！？、；：""''「」『』（）〔〕《》〈〉\[\]{}<>·.,!?;:'"()|/\\~…—－\-_+*#@$%^&=\s]/g;

/**
 * 归一化：NFKC（全角→半角）→ 小写 → 去标点空白 → 去首尾填充词。
 * @returns {{ raw: string, lean: string }}
 */
export function normalizeUtterance(text) {
  const base = String(text ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(PUNCT, "");
  let lean = base;
  let changed = true;
  while (changed) {
    changed = false;
    /* 长填充词优先（先剥「我想」再剥「我」），故每轮按长度降序试剥。 */
    for (const filler of LEAD_FILLERS) {
      if (lean.length > filler.length && lean.startsWith(filler)) {
        lean = lean.slice(filler.length);
        changed = true;
        break;
      }
    }
    if (changed) continue;
    for (const filler of TAIL_FILLERS) {
      if (lean.length > filler.length && lean.endsWith(filler)) {
        lean = lean.slice(0, lean.length - filler.length);
        changed = true;
        break;
      }
    }
  }
  return { raw: base, lean };
}

/** 中文/阿拉伯数字 token → 数字（失败 → null）。 */
export function parseNumberToken(token) {
  const value = String(token ?? "").trim();
  if (!value) return null;
  if (/^\d{1,3}$/.test(value)) return Number(value);
  if (value === "十") return 10;
  if (/^十[一二三四五六七八九]$/.test(value)) return 10 + CN_DIGITS[value[1]];
  if (/^[一二两三四五六七八九]十$/.test(value)) return CN_DIGITS[value[0]] * 10;
  if (/^[一二两三四五六七八九]十[一二三四五六七八九]$/.test(value)) return CN_DIGITS[value[0]] * 10 + CN_DIGITS[value[2]];
  if (value.length === 1 && CN_DIGITS[value] !== undefined) return CN_DIGITS[value];
  return null;
}

/** 数量词 token → 数字（`两个` / `2个` / `三个` / 空 → fallback）。 */
export function parseCountToken(token, fallback = 1) {
  const value = String(token ?? "").trim();
  if (!value) return fallback;
  const stripped = value.replace(/个|只|位|名|支/g, "");
  const parsed = parseNumberToken(stripped);
  return parsed === null ? fallback : parsed;
}

/* ── 指称解析（design D9 / 审阅 R2） ── */

const SELF_MARKERS = Object.freeze(["这只蜂", "这个蜂", "这只工蜂", "当前蜂", "当前这只蜂", "选中的蜂", "选中的这只蜂", "当前会话", "这个会话"]);

/**
 * 指称表项净房（与宿主 hive-voice.mjs normalizeReferents 同形；客户端是唯一
 * 掌握阵列顺序与蜂种名的一侧，序号即面板下标）。
 * @returns {Array<{index:number,title:string,beeTypeName:string,sessionId:string,selected:boolean}>}
 */
export function normalizeReferents(referents) {
  const out = [];
  for (const raw of Array.isArray(referents) ? referents : []) {
    const index = Math.round(Number(raw?.index));
    const title = typeof raw?.title === "string" ? raw.title.trim() : "";
    if (!Number.isFinite(index) || index <= 0 || !title) continue;
    out.push({
      index,
      title,
      beeTypeName: typeof raw?.beeTypeName === "string" ? raw.beeTypeName.trim() : "",
      sessionId: typeof raw?.sessionId === "string" ? raw.sessionId : "",
      selected: raw?.selected === true
    });
  }
  return out.sort((a, b) => a.index - b.index);
}

/**
 * 指称解析（优先级：显式选中蜂 → 面板序号 → 会话标题词 → 蜂种名）。
 * 多只命中 → 列为候选（SHALL NOT 盲投）。
 * @returns {{targets: Array, candidates: Array, echo: string, reason: string}}
 */
export function resolveReferents(text, referents, options = {}) {
  const rows = normalizeReferents(referents);
  const { raw, lean } = normalizeUtterance(text);
  const haystack = lean || raw;
  if (rows.length === 0) return { targets: [], candidates: [], echo: "", reason: "no-referents" };

  /* ① 显式选中蜂（「这只蜂」「当前会话」）。 */
  if (SELF_MARKERS.some((marker) => haystack.includes(marker))) {
    const selected = rows.filter((r) => r.selected || (options.selectedSessionId && r.sessionId === options.selectedSessionId));
    if (selected.length === 1) return { targets: selected, candidates: [], echo: echoOf(selected[0]), reason: "selected" };
    if (selected.length > 1) return { targets: [], candidates: selected, echo: "", reason: "ambiguous-selected" };
  }

  /* ② 面板序号（`三号蜂` / `第3个蜂` / `3号工蜂`）。 */
  const indexMatch = /第?([0-9]{1,3}|[一二两三四五六七八九十]{1,3})号?(?:蜂|工蜂|只蜂)/.exec(haystack);
  if (indexMatch) {
    const index = parseNumberToken(indexMatch[1]);
    const hit = rows.find((r) => r.index === index);
    if (hit) return { targets: [hit], candidates: [], echo: echoOf(hit), reason: "index" };
    return { targets: [], candidates: [], echo: "", reason: "index-missing", requestedIndex: index };
  }

  /* ③ 会话标题词命中（长标题优先，避免短标题误吞）。 */
  const titleHits = rows
    .filter((r) => r.title && haystack.includes(normalizeUtterance(r.title).lean || normalizeUtterance(r.title).raw))
    .sort((a, b) => b.title.length - a.title.length);
  if (titleHits.length === 1) return { targets: [titleHits[0]], candidates: [], echo: echoOf(titleHits[0]), reason: "title" };
  if (titleHits.length > 1 && titleHits[0].title.length > titleHits[1].title.length) {
    return { targets: [titleHits[0]], candidates: [], echo: echoOf(titleHits[0]), reason: "title" };
  }
  if (titleHits.length > 1) return { targets: [], candidates: titleHits, echo: "", reason: "ambiguous-title" };

  /* ④ 蜂种名（唯一命中方可投；多只 → 候选）。 */
  const typeHits = rows.filter((r) => r.beeTypeName && haystack.includes(normalizeUtterance(r.beeTypeName).lean || normalizeUtterance(r.beeTypeName).raw));
  if (typeHits.length === 1) return { targets: [typeHits[0]], candidates: [], echo: echoOf(typeHits[0]), reason: "bee-type" };
  if (typeHits.length > 1) return { targets: [], candidates: typeHits, echo: "", reason: "ambiguous-bee-type" };

  return { targets: [], candidates: [], echo: "", reason: "no-match" };
}

/** 确认卡回显串（「三号蜂 = <会话标题>」，design D9/审阅 R10 的当场可否决要求）。 */
export function echoOf(referent) {
  return referent ? `${referent.index}号蜂 = 「${referent.title}」` : "";
}

/* ── 意图匹配 ── */

const PATTERNS = [
  /* 会话控制（无副作用）。「就到这里」= 结束；「就这些」= 手动应答（D3 词表）。 */
  { kind: INTENT.SESSION_END, re: /^(结束会话|结束|就到这里|先到这里|回到待机|收工|不聊了|到此为止|关闭会话)$/ },
  { kind: INTENT.SESSION_RESUME, re: /^(继续上次|继续上一个会话|继续上次会话|恢复上次|恢复上次会话|回到上次|接着上次)$/ },
  { kind: INTENT.HIVE_OVERVIEW, re: /^(查看蜂巢|看看蜂巢|蜂巢状态|蜂巢总览|总览|全局总览|看看整体|看看全局)$/ },
  { kind: INTENT.ANSWER, re: /^(回答|就这些|说完了|我说完了|没了|没有了|开始整理|整理一下)$/ },
  { kind: INTENT.CONFIRM, re: /^(确认|确定|可以|好|好的|行|执行|同意|没问题|就这样|确认执行)$/ },
  { kind: INTENT.CANCEL, re: /^(取消|算了|不用了|不要了|否|放弃|取消掉|当我没说)$/ },
  /* 投递（有副作用）：把/将 + 指称物 + 发给 + 指称。 */
  {
    kind: INTENT.DELIVER,
    re: /^(?:把|将)?(总结|汇总|这份文档|这个文档|文档|内容|报告|结论|纪要|摘要|刚才的讨论|讨论结果)(?:发给|发送给|投递给|交给|传给|给)(.+)$/
  },
  /* 投递（省略宾语：「发给三号蜂」= 最近 artifact）——rest 必须是结构化指称，
     否则视为普通句子（「给你一个建议」不得劫持）。 */
  { kind: INTENT.DELIVER, re: /^(?:把|将)?(?:发给|发送给|投递给|交给|传给|给)(.+)$/, objectless: true },
  /* 召唤（有副作用）：召唤 [数量] [蜂种]。 */
  { kind: INTENT.SUMMON, re: /^(召唤|叫|派|生成|创建)([0-9一二两三四五六七八九十]{0,3})(个|只|位|名)?(.*)$/ },
  /* 蜂聚焦（无副作用）：看看/聚焦/打开 N 号蜂 | <标题>。 */
  { kind: INTENT.BEE_FOCUS, re: /^(?:看看|看一下|看下|聚焦|聚焦到|打开|切到|去看)(.+)$/ },
  /* 裸序号/标题形式（无动词）：「三号蜂」。 */
  { kind: INTENT.BEE_FOCUS, re: /^(第?[0-9一二两三四五六七八九十]{1,3}号?(?:蜂|工蜂))$/ }
];

/**
 * 整段意图匹配（design D3 纪律 1）。
 *
 * @param {string} text 拼接稿全文
 * @param {object} [options] `{ referents, beeTypeNames, selectedSessionId }`
 * @returns {{
 *   kind: string, sideEffect: boolean, matched: boolean, normalized: string,
 *   payload: object, echo: string, candidates: Array, reason: string
 * }}
 */
export function matchIntent(text, options = {}) {
  const { raw, lean } = normalizeUtterance(text);
  const probes = raw === lean ? [raw] : [raw, lean];
  const referents = options.referents ?? [];
  /* 蜂种清单：优先 `beeTypes`（{id,name}，可回填 beeTypeId 走 summon 路由），
     退化接受 `beeTypeNames`（纯字符串，只作词表匹配）。 */
  const beeTypes =
    Array.isArray(options.beeTypes) && options.beeTypes.length > 0
      ? options.beeTypes
          .map((t) => ({ id: typeof t?.id === "string" ? t.id : null, name: typeof t?.name === "string" ? t.name.trim() : "" }))
          .filter((t) => t.name)
      : (options.beeTypeNames ?? []).filter((n) => typeof n === "string" && n.trim()).map((name) => ({ id: null, name }));

  for (const probe of probes) {
    if (!probe) continue;
    for (const pattern of PATTERNS) {
      const hit = pattern.re.exec(probe);
      if (!hit) continue;
      const built = buildHit(pattern, hit, probe, { referents, beeTypes, selectedSessionId: options.selectedSessionId });
      if (built) return { normalized: probe, ...built };
    }
  }
  return { kind: INTENT.NONE, sideEffect: false, matched: false, normalized: raw, payload: {}, echo: "", candidates: [], reason: "no-match" };
}

function buildHit(pattern, hit, probe, ctx) {
  const kind = pattern.kind;
  switch (kind) {
    case INTENT.SESSION_END:
    case INTENT.SESSION_RESUME:
    case INTENT.HIVE_OVERVIEW:
    case INTENT.ANSWER:
    case INTENT.CONFIRM:
    case INTENT.CANCEL:
      return { kind, sideEffect: false, matched: true, payload: {}, echo: "", candidates: [], reason: "exact" };

    case INTENT.SUMMON: {
      const count = parseCountToken(hit[2], 1);
      const rest = (hit[4] ?? "").trim();
      const typeName = matchBeeTypeName(rest, ctx.beeTypes);
      /* 纪律 1：召唤族必须「剩余实义词为 0」——除数量与已知蜂种名（或泛称「蜂」）
         外还有别的内容 → 判未命中（正文里的「召唤更多人来评审」不得劫持）。 */
      if (rest && !typeName && !GENERIC_BEE_WORD.test(rest)) return null;
      if (!Number.isFinite(count) || count < 1 || count > 8) return null;
      return {
        kind,
        sideEffect: true,
        matched: true,
        payload: { count, beeTypeName: typeName?.name ?? null, beeTypeId: typeName?.id ?? null },
        echo: typeName ? `${count} × ${typeName.name}` : `${count} × 默认蜂`,
        candidates: [],
        reason: "summon"
      };
    }

    case INTENT.DELIVER: {
      const objectless = pattern.objectless === true;
      const what = objectless ? null : hit[1];
      const rest = (objectless ? hit[1] : hit[2] ?? "").trim();
      /* 省略宾语式：rest 必须是结构化指称，否则不认（普通句子回落调研）。 */
      if (objectless && !REFERENCE_MARKERS.test(rest) && !looksLikeKnownName(rest, ctx)) return null;
      const resolved = resolveReferents(rest, ctx.referents, { selectedSessionId: ctx.selectedSessionId });
      if (resolved.targets.length === 0) {
        /* 解析失败：播放固定「未找到该蜂」音 + 列出候选（SHALL NOT 盲投）。
           投递句式本身已是明确指令 → 仍算命中（走失败回执，不回落调研）。 */
        return {
          kind,
          sideEffect: true,
          matched: true,
          payload: { what: what ?? "最近整理产物", target: null },
          echo: "",
          candidates: resolved.candidates.length > 0 ? resolved.candidates : normalizeReferents(ctx.referents),
          reason: resolved.reason
        };
      }
      return {
        kind,
        sideEffect: true,
        matched: true,
        payload: { what: what ?? "最近整理产物", target: resolved.targets[0] },
        echo: `${what ?? "最近整理产物"} → ${resolved.echo}`,
        candidates: [],
        reason: resolved.reason
      };
    }

    case INTENT.BEE_FOCUS: {
      const rest = (hit[1] ?? "").trim();
      const resolved = resolveReferents(rest, ctx.referents, { selectedSessionId: ctx.selectedSessionId });
      if (resolved.targets.length === 0) {
        /* 纪律 1：只有 rest 是**结构化指称**（N号蜂 / 已知标题 / 已知蜂种）时才算
           命中失败的聚焦指令；否则是普通讨论句（「看看这个方案怎么样」）→ 未命中，
           回落调研模式。 */
        const structural = REFERENCE_MARKERS.test(rest) || looksLikeKnownName(rest, ctx);
        if (!structural) return null;
        return {
          kind: "bee-focus-missing",
          sideEffect: false,
          matched: true,
          payload: { query: rest },
          echo: "",
          candidates: resolved.candidates.length > 0 ? resolved.candidates : normalizeReferents(ctx.referents),
          reason: resolved.reason
        };
      }
      return {
        kind,
        sideEffect: false,
        matched: true,
        payload: { target: resolved.targets[0], query: rest },
        echo: resolved.echo,
        candidates: [],
        reason: resolved.reason
      };
    }

    default:
      return null;
  }
}

/** 蜂种名匹配：rest 必须整体等于某个已知蜂种名（口语归一后），否则 null。 */
function matchBeeTypeName(rest, beeTypes) {
  const value = String(rest ?? "").trim();
  if (!value || value === "蜂") return null;
  for (const entry of beeTypes) {
    const normalized = normalizeUtterance(entry.name);
    if (normalized.lean === value || normalized.raw === value) return entry;
  }
  return null;
}

/** rest 是否命中某个已知标题/蜂种名（聚焦失败路径的结构化判据）。 */
function looksLikeKnownName(rest, ctx) {
  const value = String(rest ?? "").trim();
  if (!value) return false;
  for (const referent of normalizeReferents(ctx.referents)) {
    const title = normalizeUtterance(referent.title);
    if (title.lean && (value.includes(title.lean) || title.lean.includes(value))) return true;
    const type = normalizeUtterance(referent.beeTypeName);
    if (type.lean && (value.includes(type.lean) || type.lean.includes(value))) return true;
  }
  return false;
}

/**
 * 词表快照（设置页/文档展示用；不参与匹配逻辑）。
 * @returns {Array<{kind:string, examples: string[]}>}
 */
export function grammarTable() {
  return [
    { kind: INTENT.SESSION_END, sideEffect: false, examples: ["结束会话", "就到这里"] },
    { kind: INTENT.SESSION_RESUME, sideEffect: false, examples: ["继续上次"] },
    { kind: INTENT.HIVE_OVERVIEW, sideEffect: false, examples: ["查看蜂巢", "蜂巢状态"] },
    { kind: INTENT.BEE_FOCUS, sideEffect: false, examples: ["看看三号蜂"] },
    { kind: INTENT.SUMMON, sideEffect: true, examples: ["召唤两个侦察蜂"] },
    { kind: INTENT.DELIVER, sideEffect: true, examples: ["把总结发给三号蜂"] },
    { kind: INTENT.CONFIRM, sideEffect: false, examples: ["确认"] },
    { kind: INTENT.CANCEL, sideEffect: false, examples: ["取消", "算了"] },
    { kind: INTENT.ANSWER, sideEffect: false, examples: ["回答", "就这些"] }
  ];
}
