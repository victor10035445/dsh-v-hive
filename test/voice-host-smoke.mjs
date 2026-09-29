/**
 * 宿主语音路由冒烟测试（add-hive-voice-desk 2.7）。
 *
 * 直驱 `src/index.mjs` 的 webServer handler（与 host-state-smoke 同款「源码直 import」），
 * 以假 ctx + 假 req/res + mock 上游 fetch 覆盖：
 *  - `/voice/status` 结构化 not-configured / no-model / ready 三态；
 *  - `/voice/asr` multipart 转写、content-type 拒绝、独立字节上限（2MB，非 512KB）、
 *    30s 时长拒绝、非 wav/mp3 拒绝、上游错误透传；
 *  - `/voice/tts` SSE 帧透传 + 帧内 error 转结构化；
 *  - `/voice/answer` 临时蜂后会话取一次补全 → 首段即摘要 → 宿主拼装路径写盘 →
 *    排他创建（-2）→ max-tokens 截断重试一次并标注；
 *  - `/voice/index` openspec 提案名 + 蜂种名索引；
 *  - 资产路由：voice/ 白名单子目录 + audio/wav、路径逃逸 400、models 语义不变。
 * 运行：node test/voice-host-smoke.mjs
 */
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 隔离的 DSH_HOME（storagePath() 在插件 init 时读 process.env） ── */
const home = mkdtempSync(join(tmpdir(), "dsh-voice-home-"));
process.env.DSH_HOME = home;
delete process.env.ZHIPU_API_KEY;
delete process.env.ZHIPUAI_API_KEY;

const workspaceDir = mkdtempSync(join(tmpdir(), "dsh-voice-ws-"));
const workspaceDir2 = mkdtempSync(join(tmpdir(), "dsh-voice-ws2-"));
mkdirSync(join(workspaceDir, "openspec", "changes", "add-hive-voice-desk"), { recursive: true });
mkdirSync(join(workspaceDir, "openspec", "changes", "archive"), { recursive: true });
mkdirSync(join(workspaceDir, "openspec", "changes", "harden-bee-summon-tool"), { recursive: true });

/* ── mock 上游 fetch ── */
const realFetch = globalThis.fetch;
let upstreamCalls = [];
let upstreamScript = () => ({ status: 200, json: {} });
globalThis.fetch = async (url, init = {}) => {
  upstreamCalls.push({ url: String(url), init });
  const scripted = upstreamScript(String(url), init) ?? {};
  if (scripted.body !== undefined) {
    return new Response(scripted.body, { status: scripted.status ?? 200, headers: scripted.headers ?? {} });
  }
  return new Response(JSON.stringify(scripted.json ?? {}), {
    status: scripted.status ?? 200,
    headers: { "content-type": "application/json" }
  });
};

const { apply } = await import("../src/index.mjs");
const { wavHeader } = await import("../src/hive-voice.mjs");

/* ── 假 ctx / req / res ── */
let handler = null;
let archived = [];
let tempSessions = [];
let tempEvents = [];
let tempStatus = "idle";
const promptedSessions = new Set();
let catalog = null;
let promptBodies = [];
let taggedSessions = 0;
let lastCreateArg = null;

const ctx = {
  effect(fn) {
    const dispose = fn();
    return () => dispose?.();
  },
  on() {
    return () => {};
  },
  logger: { warn() {}, info() {} },
  webServer: {
    register(decl) {
      handler = decl.handler;
      return () => {
        handler = null;
      };
    }
  },
  tools: { register: () => () => {} },
  agents: {
    get(sessionId) {
      if (!tempSessions.includes(sessionId)) return undefined;
      return {
        id: sessionId,
        status: promptedSessions.has(sessionId) ? tempStatus : "running",
        /* 临时会话在 prompt 之前是空日志（真实宿主同形）——事件只在 prompt 之后出现。 */
        session: { header: { id: sessionId }, snapshotEvents: () => (promptedSessions.has(sessionId) ? tempEvents : []) }
      };
    }
  },
  sessionController: {
    async modelCatalog() {
      if (!catalog) throw new Error("catalog unavailable");
      return catalog;
    },
    async create(arg) {
      lastCreateArg = arg ?? {};
      taggedSessions += 1;
      const sessionId = `tmp-queen-${taggedSessions}`;
      tempSessions.push(sessionId);
      return { sessionId };
    },
    async selectModel() {
      return { selected: {} };
    },
    async prompt(request) {
      promptBodies.push(request.content?.[0]?.text ?? "");
      promptedSessions.add(request.sessionId);
      return { accepted: true };
    }
  },
  workspaceRegistry: {
    list: () => [
      { id: "ws-1", path: workspaceDir, title: "主巢", sessionIds: [] },
      { id: "ws-2", path: workspaceDir2, title: "副巢", sessionIds: [] }
    ],
    archivedSessionIds: [],
    async archiveSession(sessionId) {
      archived.push(sessionId);
    }
  }
};

apply(ctx);
ok(typeof handler === "function", "webServer handler 已注册");

/* ── 假 req/res ── */
function makeReq(method, url, { body = null, headers = {} } = {}) {
  const chunks = body === null ? [] : [Buffer.isBuffer(body) ? body : Buffer.from(String(body), "utf8")];
  return {
    method,
    url,
    headers,
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) yield chunk;
    },
    on() {},
    removeListener() {}
  };
}

function makeRes() {
  const res = {
    status: 0,
    headers: {},
    chunks: [],
    headersSent: false,
    ended: false,
    writeHead(status, headers) {
      res.status = status;
      res.headers = headers ?? {};
      res.headersSent = true;
    },
    write(chunk) {
      res.chunks.push(String(chunk));
      return true;
    },
    end(chunk) {
      if (chunk !== undefined) res.chunks.push(String(chunk));
      res.ended = true;
    },
    on() {},
    removeListener() {}
  };
  return res;
}

async function call(method, route, options) {
  const res = makeRes();
  await handler(makeReq(method, `/api/dsh-hive${route}`, options), res);
  const text = res.chunks.join("");
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { res, text, json };
}

function multipartBody({ filename = "seg.wav", contentType = "audio/wav", bytes, boundary = "----smoke" }) {
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`,
    "utf8"
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`, "utf8");
  return { body: Buffer.concat([head, bytes, tail]), contentType: `multipart/form-data; boundary=${boundary}` };
}

function wavOf(seconds) {
  const samples = Math.round(16000 * seconds);
  const pcm = Buffer.alloc(samples * 2);
  return Buffer.concat([wavHeader({ dataLength: pcm.length }), pcm]);
}

const sep = process.platform === "win32" ? "\\" : "/";
const resetTemp = () => {
  tempSessions = [];
  promptedSessions.clear();
};

/* ════ 1. /voice/status ════ */

{
  const { res, json } = await call("GET", "/voice/status");
  eq(res.status, 200, "status 200");
  eq(json.state, "not-configured", "无 key → not-configured");
  eq(json.key.configured, false, "key 未配置标记");
  ok(Array.isArray(json.voices) && json.voices.includes("tongtong"), "音色枚举随包");
  ok(json.personas.length >= 1, "人设模板清单随包");
}

{
  process.env.ZHIPU_API_KEY = "smoke-key";
  const { json } = await call("GET", "/voice/status");
  eq(json.state, "no-model", "有 key 但目录不可用 → no-model");
  eq(json.key.configured, true, "key 已配置");
  eq(json.key.source, "env", "key 来源 env");

  catalog = { default: { provider: "p1", model: "m1" }, routableProviders: ["p1"] };
  const ready = await call("GET", "/voice/status");
  eq(ready.json.state, "ready", "目录可用 → ready");
  eq(ready.json.text.provider, "p1", "文本模型选型取目录默认");
}

/* ════ 2. /voice/asr ════ */

{
  const okBody = multipartBody({ bytes: wavOf(2) });
  upstreamScript = () => ({ status: 200, json: { text: "这是第一段转写。" } });
  upstreamCalls = [];
  const { res, json } = await call("POST", "/voice/asr", { body: okBody.body, headers: { "content-type": okBody.contentType } });
  eq(res.status, 200, "asr 200");
  eq(json.text, "这是第一段转写。", "asr 文本透传");
  eq(json.duration, 2, "时长解析随包");
  eq(upstreamCalls.length, 1, "上游被调用一次");
  ok(upstreamCalls[0].url.includes("/audio/transcriptions"), "上游端点正确");
  ok(upstreamCalls[0].init.headers.authorization === "Bearer smoke-key", "key 只在宿主侧附加");
}

{
  /* 独立字节上限：1.5MB（>512KB JSON 口径，<2MB 语音口径）必须放行。 */
  const big = multipartBody({ bytes: wavOf(2) });
  const padded = Buffer.concat([big.body, Buffer.alloc(1_500_000, 0)]);
  upstreamScript = () => ({ status: 200, json: { text: "ok" } });
  const { res } = await call("POST", "/voice/asr", { body: padded, headers: { "content-type": big.contentType } });
  eq(res.status, 200, "1.5MB 上传不被 512KB JSON 口径拒绝");
}

{
  const big = multipartBody({ bytes: wavOf(2) });
  const padded = Buffer.concat([big.body, Buffer.alloc(2_200_000, 0)]);
  const { res, json } = await call("POST", "/voice/asr", { body: padded, headers: { "content-type": big.contentType } });
  eq(res.status, 413, "超 2MB → 413");
  eq(json.error, "payload too large", "超限原因结构化");
}

{
  const { res, json } = await call("POST", "/voice/asr", { body: "{}", headers: { "content-type": "application/json" } });
  eq(res.status, 415, "非 multipart → 415");
  ok(String(json.error).includes("multipart"), "content-type 拒绝原因");
}

{
  const bad = multipartBody({ filename: "seg.webm", contentType: "audio/webm", bytes: wavOf(1) });
  const { res } = await call("POST", "/voice/asr", { body: bad.body, headers: { "content-type": bad.contentType } });
  eq(res.status, 400, "非 wav/mp3 → 400");
}

{
  const long = multipartBody({ bytes: wavOf(31) });
  const { res, json } = await call("POST", "/voice/asr", { body: long.body, headers: { "content-type": long.contentType } });
  eq(res.status, 400, "超 30s → 400");
  eq(json.error, "audio exceeds 30s", "时长拒绝原因");
}

{
  const okBody = multipartBody({ bytes: wavOf(1) });
  upstreamScript = () => ({ status: 429, json: { error: { code: "1301", message: "rate limited" } } });
  const { res, json } = await call("POST", "/voice/asr", { body: okBody.body, headers: { "content-type": okBody.contentType } });
  eq(res.status, 502, "上游错误 → 502");
  eq(json.error, "rate limited", "上游错误信息透传");
}

/* ════ 3. /voice/tts ════ */

{
  const frames =
    'data: {"choices":[{"delta":{"content":"AAAA"}}],"return_sample_rate":24000}\n\n' +
    'data: {"error":{"code":1214,"message":"voice not found"}}\n\n' +
    "data: [DONE]\n\n";
  upstreamScript = () => ({ status: 200, body: frames, headers: { "content-type": "text/event-stream" } });
  const { res, text } = await call("POST", "/voice/tts", {
    body: JSON.stringify({ text: "你好" }),
    headers: { "content-type": "application/json" }
  });
  eq(res.status, 200, "tts 200 流式");
  ok(String(res.headers["content-type"]).includes("text/event-stream"), "SSE 内容类型");
  ok(text.includes('"type":"audio"') && text.includes('"pcm":"AAAA"'), "音频帧透传且标注类型");
  ok(text.includes('"type":"error"') && text.includes("1214"), "帧内 error 转结构化错误帧");
  ok(text.includes('"type":"done"'), "结束帧");
}

{
  upstreamScript = () => ({ status: 200, json: { error: "unused" } });
  const { res } = await call("POST", "/voice/tts", { body: JSON.stringify({ text: "" }), headers: { "content-type": "application/json" } });
  eq(res.status, 400, "空文本 → 400");
}

{
  /* 实测回归（2026-09-27 真实 key）：上游余额/资源包不足时流式 TTS 返回
     `HTTP 200 + content-type: null + 0 字节`——既无状态码也无错误帧。
     宿主必须把「零音频帧的空流」转成结构化错误帧，SHALL NOT 只回 done 让界面静默成功。 */
  upstreamScript = () => ({ status: 200, body: "", headers: { "content-type": "text/plain" } });
  const { res, text } = await call("POST", "/voice/tts", { body: JSON.stringify({ text: "余额不足场景" }), headers: { "content-type": "application/json" } });
  eq(res.status, 200, "空流仍以 SSE 承载（已 writeHead）");
  ok(text.includes('"type":"error"'), "零音频帧 → 结构化错误帧");
  ok(text.includes("empty-stream"), "错误码可辨识");
  ok(!text.includes('"type":"done"'), "SHALL NOT 同时回 done 造成「成功」歧义");
}

{
  /* CRLF 分隔的 SSE 帧也必须被切开（部分网关用 \r\n\r\n）。 */
  upstreamScript = () => ({
    status: 200,
    body: 'data: {"choices":[{"delta":{"content":"BBBB"}}]}\r\n\r\ndata: [DONE]\r\n\r\n',
    headers: { "content-type": "text/event-stream" }
  });
  const { text } = await call("POST", "/voice/tts", { body: JSON.stringify({ text: "CRLF" }), headers: { "content-type": "application/json" } });
  ok(text.includes('"type":"audio"') && text.includes("BBBB"), "CRLF 帧被正确解析并标注类型");
  ok(text.includes('"type":"done"'), "有音频帧 → 回 done");
}

/* ════ 4. /voice/answer ════ */

const answerText = "这是口语摘要第一段，讲结论。第二句补充。\n\n## 正文\n细节内容。\n";
const assistantEvent = (text, { finish = "stop", seq = 10 } = {}) => ({
  type: "assistant/message",
  seq,
  data: {
    turn: 1,
    step: 1,
    message: { content: [{ type: "text", text }] },
    stream: [{ type: "chunk", chunk: { type: "finish", reason: { kind: finish } } }],
    usage: { inputTokens: 10, outputTokens: 20 }
  }
});

{
  tempEvents = [assistantEvent(answerText)];
  tempStatus = "idle";
  resetTemp();
  promptBodies = [];
  archived = [];
  upstreamScript = () => ({ status: 200, json: {} });
  const { res, json } = await call("POST", "/voice/answer", {
    body: JSON.stringify({
      /* 口述里明确指称「三号蜂」——这是指称表**该被注入**的那一类（见下方按需注入块）。 */
      text: "帮我整理一下段落制的取舍，顺便让三号蜂跟进",
      history: [{ role: "user", text: "先前问题" }],
      referents: [{ index: 3, title: "调研 ASR", beeTypeName: "侦察蜂", selected: true }]
    }),
    headers: { "content-type": "application/json" }
  });
  eq(res.status, 200, "answer 200");
  eq(json.ok, true, "answer ok");
  eq(json.spoken, "这是口语摘要第一段，讲结论。第二句补充。", "首段即摘要抽取");
  eq(json.truncated, false, "未截断");
  eq(json.relativePath.startsWith("hive-voice" + sep), true, "相对路径在固定子目录下");
  ok(existsSync(json.path), "文档已落盘");
  eq(readFileSync(json.path, "utf8"), answerText.trim(), "落盘内容 = 模型 markdown（首尾空白归一）");
  eq(archived.length, 1, "临时蜂后会话已归档");
  ok(promptBodies[0].includes("3号蜂 = 「调研 ASR」"), "口述提到蜂 → 指称表进提示词");
  ok(promptBodies[0].includes("此前多轮讨论") && promptBodies[0].includes("先前问题"), "多轮历史进提示词");
  ok(promptBodies[0].includes("不得复述、不得罗列"), "指称表带「不得复述/统计」纪律");
  ok(promptBodies[0].includes("不要调用任何工具"), "人设提示词显式禁工具");
}

{
  /* 指称表**按需注入**（2026-09-27 二轮真机反馈的关键修正）：
     表里含每只蜂的会话标题，无条件注入时模型会清点它——真机产物出现过
     「18 只已命名蜂的状态保持原样」「蜂巢里已经有一只『算一下18乘以9』」，
     用户读到的正是「它读取了其他会话的信息」。口述不提蜂 → 整节省略。 */
  promptBodies = [];
  tempEvents = [assistantEvent(answerText)];
  resetTemp();
  await call("POST", "/voice/answer", {
    body: JSON.stringify({
      text: "帮我判断一下段落制和实时双工的取舍",
      referents: [{ index: 1, title: "绝对不该出现在文档里的标题甲", beeTypeName: "侦察蜂", sessionId: "s1", selected: false }]
    }),
    headers: { "content-type": "application/json" }
  });
  ok(!promptBodies[0].includes("绝对不该出现在文档里的标题甲"), "口述不提蜂 → 会话标题不进提示词");
  ok(!promptBodies[0].includes("几号蜂的对应关系"), "整节指称表被省略");
  ok(promptBodies[0].includes("本次口述拼接稿"), "拼接稿仍正常在场");

  /* 口述明确指称蜂 → 表回来（否则「让三号蜂去做 X」这类无法解析）。 */
  promptBodies = [];
  tempEvents = [assistantEvent(answerText)];
  resetTemp();
  await call("POST", "/voice/answer", {
    body: JSON.stringify({
      text: "让三号蜂接着做这个设计",
      referents: [{ index: 3, title: "梳理语音方案", beeTypeName: "工蜂", sessionId: "s3", selected: false }]
    }),
    headers: { "content-type": "application/json" }
  });
  ok(promptBodies[0].includes("3号蜂 = 「梳理语音方案」"), "口述指名蜂 → 指称表回来");
  ok(promptBodies[0].includes("不得据此统计蜂群状态"), "表头带反清点纪律");
  ok(promptBodies[0].includes("忽略且不要评论"), "提示词要求忽略无关附带上下文（技能清单等）");
  ok(promptBodies[0].includes("不要用篇幅解释你的限制"), "提示词要求不铺陈自身限制");
}

{
  /* 空指称表：**不再送占位句**（模型曾把「（当前蜂巢页没有可指称的蜂）」原样抄进文档）。 */
  promptBodies = [];
  tempEvents = [assistantEvent(answerText)];
  resetTemp();
  await call("POST", "/voice/answer", {
    body: JSON.stringify({ text: "没有蜂时的应答" }),
    headers: { "content-type": "application/json" }
  });
  ok(!promptBodies[0].includes("没有可指称的蜂"), "空指称表不送占位句");
  ok(!promptBodies[0].includes("蜂巢页当前可指称的蜂"), "空指称表整节省略");
  ok(promptBodies[0].includes("本次口述拼接稿"), "拼接稿仍正常在场");
}

{
  /* 同日同题第二份 → 排他创建 -2（既有文档内容不变）。 */
  const dir = join(workspaceDir, "hive-voice");
  const before = readdirSync(dir);
  const snapshot = new Map(before.map((name) => [name, readFileSync(join(dir, name), "utf8")]));
  tempEvents = [assistantEvent(answerText)];
  resetTemp();
  const { json } = await call("POST", "/voice/answer", {
    body: JSON.stringify({ text: "帮我整理一下段落制的取舍，顺便让三号蜂跟进" }),
    headers: { "content-type": "application/json" }
  });
  const after = readdirSync(dir);
  eq(after.length, before.length + 1, "第二次落盘新增文件（不覆盖）");
  ok(json.relativePath.includes("-2"), "排他创建追加 -2 序号");
  for (const [name, content] of snapshot) {
    eq(readFileSync(join(dir, name), "utf8"), content, `既有文档不变：${name}`);
  }
}

{
  /* 截断：finish=max-tokens → 重试一次；仍截断 → 文档与回执标注「已截断」。 */
  tempEvents = [assistantEvent(answerText, { finish: "max-tokens", seq: 20 })];
  resetTemp();
  const { json } = await call("POST", "/voice/answer", {
    body: JSON.stringify({ text: "再来一份超长整理稿" }),
    headers: { "content-type": "application/json" }
  });
  eq(json.truncated, true, "重试后仍截断 → truncated=true");
  ok(json.markdown.includes("已截断"), "markdown 尾部带截断标注");
  eq(tempSessions.length, 2, "截断触发重试（两个临时会话）");
  ok(readFileSync(json.path, "utf8").includes("已截断"), "落盘文档带截断标注");
}

{
  /* 模型不可路由：无目录 → 结构化 no-model，不写盘不抛错。 */
  const saved = catalog;
  catalog = null;
  const { res, json } = await call("POST", "/voice/answer", {
    body: JSON.stringify({ text: "无模型时" }),
    headers: { "content-type": "application/json" }
  });
  eq(res.status, 200, "不可用态仍 200（结构化）");
  eq(json.state, "no-model", "结构化 no-model");
  catalog = saved;
}

{
  const { res, json } = await call("POST", "/voice/answer", {
    body: JSON.stringify({ text: "x", workspaceId: "ws-nope" }),
    headers: { "content-type": "application/json" }
  });
  eq(res.status, 404, "未知工作区 404");
  eq(json.field, "workspaceId", "字段级原因");
}

{
  /* 实测回归（2026-09-27 真实 key 首次端到端）：临时蜂后会话是**完整 agent 会话**，
     一个回合可能含多个 step——工具调用步的 assistant/message 正文为空。
     旧实现取「第一条新 assistant 消息」→ 直接判 empty content 失败（真机复现）。
     正确收口 = 归静后取该回合**最后一条有正文**的 assistant 消息。 */
  tempEvents = [
    { ...assistantEvent("", { finish: "tool-calls", seq: 11 }), data: { ...assistantEvent("", { seq: 11 }).data, message: { content: [{ type: "tool-call", name: "read" }] } } },
    assistantEvent(answerText, { finish: "stop", seq: 12 })
  ];
  tempStatus = "idle";
  resetTemp();
  const { res, json } = await call("POST", "/voice/answer", {
    body: JSON.stringify({ text: "先调工具再作答的场景" }),
    headers: { "content-type": "application/json" }
  });
  eq(res.status, 200, "含工具步的回合仍成功收口");
  eq(json.spoken, "这是口语摘要第一段，讲结论。第二句补充。", "取最后一条有正文的 assistant 消息（而非空的首条）");
  ok(json.spokenFromFallback === false, "正文取自工具步之后");
}

{
  /* 只有空正文（纯工具步 / 空回合）：如实失败，SHALL NOT 落盘空文档。 */
  tempEvents = [{ ...assistantEvent("", { seq: 13 }), data: { ...assistantEvent("", { seq: 13 }).data, message: { content: [{ type: "tool-call", name: "read" }] } } }];
  tempStatus = "idle";
  resetTemp();
  const before = readdirSync(join(workspaceDir, "hive-voice")).length;
  const { res, json } = await call("POST", "/voice/answer", {
    body: JSON.stringify({ text: "全程没有正文的回合" }),
    headers: { "content-type": "application/json" }
  });
  eq(res.status, 502, "无正文 → 结构化失败");
  eq(json.state, "model-failed", "失败态可辨识");
  eq(readdirSync(join(workspaceDir, "hive-voice")).length, before, "SHALL NOT 落盘空文档");
  eq(archived.length >= 1, true, "失败路径同样归档临时会话（不漏临时蜂）");
}

{
  /* 工具面隔离（2026-09-27 真机反馈修正）：
     ① 临时蜂后会话默认用 `minimal` 预设建（旧实现用默认 standard → 模型带 fs/subagent/web
        一整套工具，能去读别的会话日志，用户实测「应答里出现其他会话信息」）；
     ② 本回合若调过工具，响应如实带 `usedTools`（工具名），供客户端给可见警告。 */
  tempEvents = [
    assistantEvent("", { finish: "tool-calls", seq: 30 }),
    { type: "tool/call", seq: 31, data: { turn: 1, step: 1, callId: "c1", name: "fs", arguments: "{}" } },
    { type: "tool/call", seq: 32, data: { turn: 1, step: 1, callId: "c2", name: "hive_wait", arguments: "{}" } },
    assistantEvent(answerText, { finish: "stop", seq: 33 })
  ];
  tempStatus = "idle";
  resetTemp();
  const { json } = await call("POST", "/voice/answer", {
    body: JSON.stringify({ text: "调了工具的回合" }),
    headers: { "content-type": "application/json" }
  });
  eq(json.ok, true, "调过工具仍正常返回");
  eq(json.usedTools.names, ["fs", "hive_wait"], "usedTools 如实上报工具名");
  eq(lastCreateArg?.agentPreset, "minimal", "临时会话用 minimal 预设建（剥掉 fs/subagent/web 工具面）");
}

/* ════ 5. /voice/index ════ */

{
  const { res, json } = await call("GET", "/voice/index?workspaceId=ws-1");
  eq(res.status, 200, "index 200");
  eq(json.proposals, ["add-hive-voice-desk", "harden-bee-summon-tool"], "提案名扫描（排除 archive）");
  ok(json.hotwords.includes("add-hive-voice-desk"), "热词表含提案名");

  const unknown = await call("GET", "/voice/index?workspaceId=ws-nope");
  eq(unknown.res.status, 404, "未知工作区 404");
}

/* ════ 6. 资产路由 ════ */

{
  const model = await call("GET", "/assets/models/worker.glb");
  eq(model.res.status, 200, "models 资产语义不变");
  eq(model.res.headers["content-type"], "model/gltf-binary", "glb 内容类型不变");

  const missing = await call("GET", "/assets/voice/ack-nonexistent.wav");
  eq(missing.res.status, 404, "不存在的语音资产 → 404（链路不报错，播放器降级静音）");

  /* 已建库的资产按 audio/wav 直出（spec dsh-hive「语音资产可播」场景；资产随仓库提交，
     故此处断言的是**稳态**而非「尚未建库」的临时态）。 */
  const cue = await call("GET", "/assets/voice/ack-ok.wav");
  eq(cue.res.status, 200, "已建库的语音资产 200");
  eq(cue.res.headers["content-type"], "audio/wav", "wav 内容类型");
  ok(Number(cue.res.headers["content-length"]) > 44, "wav 有实际载荷（>44 字节头）");

  const escape = await call("GET", "/assets/voice/..%2F..%2Fsrc%2Findex.mjs");
  eq(escape.res.status, 400, "路径逃逸 400");
  const nested = await call("GET", "/assets/voice/sub/dir.wav");
  eq(nested.res.status, 400, "二级子目录 400");
  const unknownDir = await call("GET", "/assets/secrets/x.wav");
  eq(unknownDir.res.status, 400, "白名单外子目录 400");
}

/* ════ 7. /voice/config（写入式配置：只写不读） ════ */

{
  const configPath = join(home, "hive-voice.json");
  const secret = "sk-smoke-1234567890";
  /* 本节验证**配置文件**路径（env 优先级更高，先摘掉以免遮蔽）。 */
  delete process.env.ZHIPU_API_KEY;

  /* 未知键保留：先手写一个说明性字段。 */
  writeFileSync(configPath, JSON.stringify({ note: "keep me" }, null, 2), "utf8");

  const saved = await call("PUT", "/voice/config", {
    body: JSON.stringify({ apiKey: secret, voice: "jam", speed: 1.25, textChannel: "dsh", asrHotwordsEncoding: "json", maxTokens: 2048 }),
    headers: { "content-type": "application/json" }
  });
  eq(saved.res.status, 200, "写入配置 200");
  eq(saved.json.ok, true, "写入成功");
  eq(saved.json.key.configured, true, "写入后即报已配置");
  eq(saved.json.key.source, "file", "来源 = 配置文件");
  ok(!saved.text.includes(secret), "响应体 SHALL NOT 含 key");

  const onDisk = JSON.parse(readFileSync(configPath, "utf8"));
  eq(onDisk.apiKey, secret, "key 落盘在宿主侧");
  eq(onDisk.note, "keep me", "未知键原样保留");
  eq(onDisk.voice, "jam", "音色写入");
  eq(onDisk.asrHotwordsEncoding, "json", "热词编码写入");

  const status = await call("GET", "/voice/status");
  ok(!status.text.includes(secret), "读取路由 SHALL NOT 含 key");
  eq(status.json.key.configured, true, "探测报已配置");
  eq(status.json.prefs.voice, "jam", "偏好回读");
  eq(status.json.prefs.speed, 1.25, "语速回读");
  eq(status.json.prefs.maxTokens, 2048, "产出上限回读");
  eq(status.json.prefs.asrHotwordsEncoding, "json", "热词编码回读");

  /* 文本模型 / 人设 / 默认工作区（指向在册工作区）。 */
  const more = await call("PUT", "/voice/config", {
    body: JSON.stringify({ textModel: { provider: "p1", model: "m1" }, personaId: "queen-brief", targetWorkspaceId: "ws-2" }),
    headers: { "content-type": "application/json" }
  });
  eq(more.res.status, 200, "偏好二次写入 200");
  eq(more.json.prefs.personaId, "queen-brief", "人设写入");
  eq(more.json.prefs.targetWorkspaceId, "ws-2", "默认工作区写入");

  /* 清除单项：null = 删除该键。 */
  const cleared = await call("PUT", "/voice/config", {
    body: JSON.stringify({ textModel: null, personaId: null, targetWorkspaceId: null }),
    headers: { "content-type": "application/json" }
  });
  eq(cleared.json.prefs.textModel, null, "textModel 可清除");
  eq(cleared.json.prefs.personaId, null, "人设可清除");
  eq(cleared.json.prefs.targetWorkspaceId, null, "默认工作区可清除");
  eq(JSON.parse(readFileSync(configPath, "utf8")).apiKey, secret, "清除偏好不动 key");

  /* 非法载荷 400；未在册工作区 404。 */
  eq((await call("PUT", "/voice/config", { body: JSON.stringify({ voice: "nope" }), headers: { "content-type": "application/json" } })).res.status, 400, "非法音色 400");
  eq((await call("PUT", "/voice/config", { body: JSON.stringify({ speed: 9 }), headers: { "content-type": "application/json" } })).res.status, 400, "越界语速 400");
  eq(
    (await call("PUT", "/voice/config", { body: JSON.stringify({ unknownField: 1 }), headers: { "content-type": "application/json" } })).res.status,
    400,
    "未知字段 400（strict）"
  );
  const badWs = await call("PUT", "/voice/config", { body: JSON.stringify({ targetWorkspaceId: "ws-nope" }), headers: { "content-type": "application/json" } });
  eq(badWs.res.status, 404, "未在册工作区 404");
  eq(badWs.json.field, "targetWorkspaceId", "字段级原因");

  /* 清除 key：文件里不再有 apiKey，探测回落 not-configured。 */
  const wiped = await call("PUT", "/voice/config", { body: JSON.stringify({ clearKey: true }), headers: { "content-type": "application/json" } });
  eq(wiped.json.key.configured, false, "清除后未配置");
  ok(JSON.parse(readFileSync(configPath, "utf8")).apiKey === undefined, "key 已从文件移除");
  eq((await call("GET", "/voice/status")).json.state, "not-configured", "探测回落 not-configured");

  /* 清掉文件并恢复 env key，后续收尾与其它用例回到原路径。 */
  rmSync(configPath, { force: true });
  process.env.ZHIPU_API_KEY = "smoke-key";
}

/* ── 收尾 ── */
rmSync(home, { recursive: true, force: true });
rmSync(workspaceDir, { recursive: true, force: true });
rmSync(workspaceDir2, { recursive: true, force: true });
globalThis.fetch = realFetch;
delete process.env.ZHIPU_API_KEY;
delete process.env.DSH_HOME;

console.log("voice-host-smoke: OK");
