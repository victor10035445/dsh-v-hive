/**
 * 会话态常驻上限冒烟测试（2026-09-16 泄漏修复，对应 F18）：
 *
 * 修复前：waitsBySession / statusBySession 以「见过的每个会话」为键写入（含每个子会话），
 * 全文件无 delete ⇒ 宿主进程寿命内无界累积，且 engineFrame() 每次广播都要遍历全部键。
 * 本测试锁定三条不变式：
 *  1. 等待器结算后，该会话的等待/状态缓存条目被遗忘（不再常驻）；
 *  2. 空白/归档/无能力会话评估时，其旧条目被清除；
 *  3. 引擎帧里的会话条目数被 HIVE_SESSION_STATE_MAX(512) 封顶（最冷会话被驱逐）。
 *
 * 运行：node test/session-state-bound-smoke.mjs
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { apply } from "../src/index.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-hive-state-bound-"));

/* ── 桩 ctx（与 bee-engine-smoke 同构的最小面） ── */
let routeHandler = null;
const engineListeners = [];
const toolDefs = new Map();
const agentById = new Map();

const makeAgent = (id, { status = "running", events = [], cwd } = {}) => {
  const agent = {
    id,
    status,
    session: {
      header: { ...(cwd ? { cwd } : {}) },
      snapshotEvents: () => Object.freeze([...events])
    }
  };
  agentById.set(id, agent);
  return agent;
};
const turnEvents = (seq) => [
  { type: "turn/start", seq: seq - 1, data: { turn: 1 } },
  { type: "assistant/message", seq, data: { message: { role: "assistant", content: [{ type: "text", text: '```hive-handoff\n{"proposal":"x"}\n```' }] } } }
];

const ctxStub = {
  effect(fn) {
    fn();
  },
  on(event, handler) {
    engineListeners.push({ event, handler });
    return () => {};
  },
  webServer: {
    register(decl) {
      routeHandler = decl.handler;
      return () => {};
    }
  },
  tools: {
    register(definition) {
      toolDefs.set(definition.name, definition);
      return () => {};
    }
  },
  agents: { get: (id) => agentById.get(id) },
  sessionController: { create: async () => ({ sessionId: "s-child" }), selectModel: async () => ({}), prompt: async () => ({ accepted: true }) },
  workspaceRegistry: { list: () => [], archivedSessionIds: [] }
};

apply(ctxStub);

const callRoute = async (method, url, body) => {
  const res = {
    status: 0,
    bodyText: "",
    writeHead(status) {
      this.status = status;
    },
    end(text) {
      this.bodyText = text ?? "";
    }
  };
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))];
  await routeHandler({ url, method, [Symbol.iterator]: chunks[Symbol.iterator].bind(chunks) }, res);
  return { status: res.status, body: res.bodyText ? JSON.parse(res.bodyText) : null };
};

const sseRes = {
  writes: [],
  writeHead() {},
  write(line) {
    this.writes.push(line);
  },
  on() {}
};
await routeHandler({ url: "/api/dsh-hive/events", method: "GET" }, sseRes);
const frames = () =>
  sseRes.writes
    .map((w) => w.replace(/^data: /, "").trim())
    .filter((l) => l.startsWith("{"))
    .map((l) => JSON.parse(l));
const engineFrame = () => frames().filter((f) => f.type === "bee-engine").at(-1);

const fire = (event, payload) => {
  for (const listener of engineListeners) {
    if (listener.event === event) listener.handler(payload);
  }
};

/* 蜂种：唯一能力带「捕获 A 的谓词」；评估时由 beeEngineState 注入水位，使其可确定性拦截。 */
const gatedBeeTypes = [
  {
    id: "gated",
    name: "门控蜂",
    queuePolicy: "free",
    capabilities: [
      {
        id: "handoff",
        name: "交接",
        trigger: { capture: { A: "proposal" }, when: { capture: { B: "missing" } } },
        action: { type: "send", promptTemplate: "请处理 {A}" }
      }
    ]
  }
];

/* ── 1. 等待器结算 → 条目被遗忘（回归：修复前永久常驻） ── */
const waiterAgent = makeAgent("s-settle", { status: "running", events: turnEvents(1) });
fire("agent/status", { agent: waiterAgent, status: "running" });
const hiveWait = toolDefs.get("hive_wait");
ok(typeof hiveWait?.execute === "function", "hive_wait 已注册（工具面可用）");
const pending = hiveWait.execute({ sessionId: "s-settle" }, { agent: waiterAgent, name: "hive_wait", arguments: {}, signal: new AbortController().signal });
fire("agent/status", { agent: waiterAgent, status: "idle" });
eq(await pending, { ok: true }, "归静事件 → 等待器放行 ok:true");
/* 结算后状态缓存已删：agent.status 仍为 running → 必须重新挂起（若条目残留会立刻 ok） */
{
  let settled = false;
  const again = hiveWait.execute({ sessionId: "s-settle" }, { agent: waiterAgent, name: "hive_wait", arguments: {}, signal: new AbortController().signal });
  again.then(() => (settled = true));
  await new Promise((r) => setTimeout(r, 10));
  eq(settled, false, "结算后条目已遗忘（不缺项就不会走活代理回读，故必须重新挂起）");
  fire("agent/status", { agent: waiterAgent, status: "idle" });
  eq(await again, { ok: true }, "再次归静 → 放行（等待器注册表仍工作）");
}

/* ── 2. 上限封顶：600 个等待会话 → 帧内条目数 ≤ 512，且最冷会话被驱逐 ── */
const MAX = 512;
const TOTAL = 600;
for (let i = 0; i < TOTAL; i++) {
  makeAgent(`s-cap-${i}`, { status: "running", events: turnEvents(1) });
}
await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 0,
  beeTypes: gatedBeeTypes,
  beeAssignments: Object.fromEntries(Array.from({ length: TOTAL }, (_, i) => [`s-cap-${i}`, "gated"])),
  beeEngineState: Object.fromEntries(Array.from({ length: TOTAL }, (_, i) => [`s-cap-${i}`, { vars: {}, latches: {}, watermarks: { handoff: 1 } }]))
});
for (let i = 0; i < TOTAL; i++) {
  fire("agent/turn-stopping", { agent: agentById.get(`s-cap-${i}`), turn: 1 });
}
const keys = Object.keys(engineFrame()?.sessions ?? {});
ok(keys.length > 0, "拦截确实产生了等待条目（夹具有效）");
ok(keys.length <= MAX, `等待条目数被上限封顶（实际 ${keys.length} ≤ ${MAX}）`);
ok(!keys.includes("s-cap-0"), "最冷会话（s-cap-0）已被驱逐");
ok(keys.includes(`s-cap-${TOTAL - 1}`), "最新会话（s-cap-599）仍在表内");

/* ── 3. 归档会话：条目在「清除后」不再出现在新鲜帧里 ── */
ctxStub.workspaceRegistry.archivedSessionIds = [`s-cap-${TOTAL - 1}`];
fire("agent/turn-stopping", { agent: agentById.get(`s-cap-${TOTAL - 1}`), turn: 1 });
/* 归档分支不广播 ⇒ 再评估一个非归档会话逼出新鲜帧，再断言聚合帧里已无归档键。 */
fire("agent/turn-stopping", { agent: agentById.get("s-cap-1"), turn: 1 });
ok(!Object.keys(engineFrame()?.sessions ?? {}).includes(`s-cap-${TOTAL - 1}`), "归档会话的等待条目已清除（新鲜帧无该键）");

console.log(`session-state-bound-smoke: OK（条目数 ${keys.length}/${MAX}，最冷已驱逐，归档已清除）`);
