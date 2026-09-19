/**
 * 能力引擎宿主接线冒烟测试（custom-bee-types 任务 3.1–3.8 行为级覆盖）：
 *  - 布局文档 schema 扩展 + PUT 校验（字段级 400 / 409 冲突 / 部分写语义）；
 *  - 触发点评估：四重门 → spawn 链（sessionController 直调建会话/选模型/投递 + 绑定 + 车道续占）；
 *  - 水位/闩锁消重；send 直发与 serialized 车道排队；野蜂降级；保险丝；
 *  - /hatch 手动孵化绕车道；/lane 手动放行/清空；/models 目录代理；
 *  - 引擎旁路（无蜂种配置 → 事件零动作）。
 * 运行：node test/bee-engine-smoke.mjs
 */
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { apply, name, inject, storagePath } from "../src/index.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

eq(name, "dsh-v-hive", "插件名");
eq(inject, ["webServer", "agents", "sessionController", "workspaceRegistry", "tools"], "inject 恰为五名在册服务（S1 复验定稿 + hive-summon-tool 工具注册面；已删除的旧服务名 SHALL NOT 残留）");

/* ── 桩 ctx（DSH_HOME 指到临时目录，避免碰真实存储） ── */
process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-hive-engine-"));

let routeHandler = null;
const engineListeners = [];
const followupLog = [];
const apiLog = { create: [], selectModel: [], prompt: [], models: [] };

const agentById = new Map();
const makeAgent = (id, { cwd = "F:/repo", origin, events = [], status = "running" } = {}) => {
  const agent = {
    id,
    status,
    session: {
      header: { cwd, ...(origin ? { origin } : {}) },
      events, // 夹具句柄（push 式追加续用）；引擎只经 snapshotEvents() 读取
      /* 新版 Session 快照契约桩（D2）：深冻结只读视图，每次物化当前日志。 */
      snapshotEvents: () => Object.freeze([...events])
    },
    followup(message) {
      followupLog.push({ sessionId: id, message });
    }
  };
  agentById.set(id, agent);
  return agent;
};

/** 会话事件夹具：turn/start（过空白门）+ assistant/message（hive-handoff 块）。 */
const handoff = (json) => [
  { type: "turn/start", seq: json.seq - 1, data: { turn: json.turn ?? 1 } },
  { type: "assistant/message", seq: json.seq, data: { message: { role: "assistant", content: [{ type: "text", text: "```hive-handoff\n" + json.body + "\n```" }] } } }
];

/** sessionController 直调形状桩（S1 复验定稿）：请求对象即请求体、返回值即结果，
 *  失败走 reject（无 result.ok 信封）。记录调用参数供断言（create/selectModel/prompt
 *  次数与请求体正确性，含 requestId 存在性与 modelCatalog 无参调用）。 */
const sessionControllerStub = {
  create: async (request) => {
    apiLog.create.push(request);
    return { sessionId: "s-child-" + apiLog.create.length, agentPreset: "standard" };
  },
  selectModel: async (request) => {
    apiLog.selectModel.push(request);
    return { selected: { provider: request.provider, model: request.model } };
  },
  prompt: async (request, signal) => {
    ok(signal instanceof AbortSignal, "prompt 直调必须携带 AbortSignal（spike 复验 δ1）");
    apiLog.prompt.push(request);
    return { accepted: true };
  },
  modelCatalog: async (...args) => {
    apiLog.models.push(args);
    return {
      default: { provider: "p", model: "m" },
      routableProviders: ["p"],
      groups: [{ id: "p", name: "P", models: [{ id: "m", name: "M" }] }],
      failures: []
    };
  }
};

const workspaceRegistryStub = {
  list: () => [{ id: "ws-1", sessionIds: ["s-idea", "s-design-1", "s-design-2"], path: "F:/repo", title: "主巢" }],
  archivedSessionIds: []
};

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
  agents: { get: (id) => agentById.get(id) },
  sessionController: sessionControllerStub,
  workspaceRegistry: workspaceRegistryStub
};

apply(ctxStub);
ok(typeof routeHandler === "function", "路由 handler 已捕获");
ok(engineListeners.some((l) => l.event === "agent/turn-stopping"), "turn-stopping 监听已挂（主触发）");
ok(engineListeners.some((l) => l.event === "agent/status"), "status 监听已挂（兜底）");
ok(engineListeners.some((l) => l.event === "agent/inbox/inserted"), "inbox 监听已挂（保险丝重置）");

const fire = (event, payload) => {
  for (const listener of engineListeners) {
    if (listener.event === event) listener.handler(payload);
  }
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

/* ── 引擎旁路（任务 3.8）：无蜂种配置 → 事件零动作 ── */
makeAgent("s-bypass", { events: handoff({ seq: 1, body: '{"proposal":"x"}' }) });
fire("agent/turn-stopping", { agent: agentById.get("s-bypass"), turn: 1 });
fire("agent/status", { agent: agentById.get("s-bypass"), status: "idle" });
eq(followupLog.length, 0, "旁路：无蜂种配置不动作");
eq(apiLog.create.length, 0, "旁路：不建会话");

/* ── PUT /state：蜂种落盘（任务 3.1） ── */
const beeTypes = [
  {
    id: "idea",
    name: "创意蜂",
    queuePolicy: "free",
    capabilities: [
      {
        id: "handoff",
        name: "交接",
        trigger: { capture: { A: "proposal" } },
        action: { type: "spawn", promptTemplate: "请用 /opsx:new 创建提案 {A}", targetBeeTypeId: "design" }
      }
    ]
  },
  {
    id: "design",
    name: "设计蜂",
    queuePolicy: "serialized",
    model: { provider: "deepseek-official", model: "deepseek-v4-pro" },
    capabilities: [
      {
        id: "review",
        name: "审阅",
        trigger: { capture: { A: "proposal" } },
        action: { type: "send", promptTemplate: "请审阅提案 {A} 的任务清单" }
      }
    ]
  }
];
const put1 = await callRoute("PUT", "/api/dsh-hive/state", { revision: 0, beeTypes, beeAssignments: { "s-idea": "idea", "s-design-1": "design", "s-design-2": "design" } });
eq(put1.status, 200, "PUT 蜂种 → 200");
eq(put1.body.doc.beeTypes.length, 2, "蜂种落盘");
eq(put1.body.doc.beeAssignments["s-design-1"], "design", "绑定落盘");
const frame1 = frames().at(-1);
ok(frame1?.type === "layout-changed" && frame1.doc.beeTypes.length === 2, "布局广播帧携带蜂种");

/* 非法配置 → 400 字段级原因（spec「非法配置拒绝」） */
const put2 = await callRoute("PUT", "/api/dsh-hive/state", { revision: 1, beeTypes: [{ id: "x", name: "  " }] });
eq(put2.status, 400, "缺名称 → 400");
eq(put2.body.code, "missingName", "字段级 code");
const put3 = await callRoute("PUT", "/api/dsh-hive/state", { revision: 1, beeTypes: [{ id: "default", name: "D" }] });
eq(put3.body.code, "reservedId", "保留字 default → 400 reservedId");
const put4 = await callRoute("PUT", "/api/dsh-hive/state", { revision: 1, beeTypes: [{ id: "a", name: "A" }, { id: "a", name: "B" }] });
eq(put4.body.code, "duplicateId", "id 重复 → 400");
const put5 = await callRoute("PUT", "/api/dsh-hive/state", { revision: 1, beeTypes: [{ id: "a", name: "A", capabilities: [{ id: "c", name: "N", action: { type: "send", promptTemplate: "{A" } }] }] });
eq(put5.body.code, "invalidTemplate", "模板不可编译 → 400");
ok((await callRoute("PUT", "/api/dsh-hive/state", { revision: 0, positions: {} })).status === 409, "revision 冲突 → 409");
ok((await callRoute("PUT", "/api/dsh-hive/state", { revision: 1, camera: { theta: 0, phi: 0, dist: 9, tx: 0, tz: 0 } })).body.doc.beeTypes.length === 2, "部分写：不带 beeTypes 的 PUT 沿用旧值");

/* ── spawn 链（任务 3.5 + spec「创意蜂孵化设计蜂」） ── */
makeAgent("s-idea", { events: handoff({ seq: 10, body: '{"proposal":"add-auth-system"}' }) });
fire("agent/turn-stopping", { agent: agentById.get("s-idea"), turn: 1 });
await sleep(20);
eq(apiLog.create.length, 1, "sessionController.create 恰好一次");
eq(apiLog.create[0].workspaceId, "ws-1", "同巢创建（触发蜂工作区，直调请求体即 createArg）");
eq(apiLog.selectModel.length, 1, "selectModel 按目标蜂种模型");
eq(apiLog.selectModel[0].model, "deepseek-v4-pro", "模型取自目标蜂种配置");
eq(apiLog.selectModel[0].sessionId, "s-child-1", "selectModel 请求体携带子蜂 sessionId");
eq(apiLog.prompt.length, 1, "首条提示词投递");
ok(typeof apiLog.prompt[0].requestId === "string" && apiLog.prompt[0].requestId.length > 0, "prompt 请求携带铸造的 requestId（必填）");
const promptText = apiLog.prompt[0].content[0].text;
ok(promptText.startsWith("⟡设计蜂·能力：交接"), "首条提示词带蜂种前缀（spec「自动消息可辨识」）");
ok(promptText.includes("add-auth-system"), "{A} 插值");
ok(!promptText.includes("{A}"), "SHALL NOT 发送未插值占位符");
eq(apiLog.prompt[0].mode, "queue", "queue 模式");
/* 子蜂绑定 + 水位持久化 */
const afterSpawn = JSON.parse(readFileSync(storagePath(), "utf8"));
eq(afterSpawn.beeAssignments["s-child-1"], "design", "子蜂绑定目标蜂种");
eq(afterSpawn.beeEngineState["s-idea"].watermarks.handoff, 10, "水位持久化");
eq(afterSpawn.beeEngineState["s-idea"].vars.A, "add-auth-system", "变量持久化");
eq(afterSpawn.beeEngineState["s-idea"].latches.handoff.length, 1, "闩锁持久化");
/* 车道：spawn 出的设计蜂（serialized）首条消息占道（父 free 非持有者 → request 放行） */
const engineFrame1 = frames().filter((f) => f.type === "bee-engine").at(-1);
eq(engineFrame1?.lane?.["ws-1"]?.holder, "s-child-1", "serialized 子蜂首条消息占道");

/* ── 水位消重 + 同值闩锁（spec「历史标记不误触」「同值闩锁防重燃」） ── */
fire("agent/turn-stopping", { agent: agentById.get("s-idea"), turn: 2 });
await sleep(20);
eq(apiLog.create.length, 1, "同 seq 重评 → 水位消重不重孵");
agentById.get("s-idea").session.events.push(...handoff({ seq: 11, body: '{"proposal":"add-auth-system"}' }));
fire("agent/turn-stopping", { agent: agentById.get("s-idea"), turn: 3 });
await sleep(20);
eq(apiLog.create.length, 1, "同值新回合 → 闩锁不重燃");
agentById.get("s-idea").session.events.push(...handoff({ seq: 12, body: '{"proposal":"add-pay-system"}' }));
fire("agent/turn-stopping", { agent: agentById.get("s-idea"), turn: 4 });
await sleep(20);
eq(apiLog.create.length, 2, "新值 → 正常孵化");

/* ── serialized 车道（任务 3.4 守卫 + spec「排队蜂互斥」） ──
   车道被 s-child-1（spawn 1 的 serialized 子蜂投递）持有；spawn 2 的子蜂投递
   与设计蜂乙的 send 都在等待队列（FIFO：子蜂投递在前）。 */
makeAgent("s-design-2", { events: handoff({ seq: 20, body: '{"proposal":"queued-proposal"}' }) });
fire("agent/turn-stopping", { agent: agentById.get("s-design-2"), turn: 1 });
const queueFrame = frames().filter((f) => f.type === "bee-engine").at(-1);
ok(queueFrame?.lane?.["ws-1"]?.waiting?.some((w) => w.sessionId === "s-design-2"), "serialized 乙进入车道等待");
eq(followupLog.filter((f) => f.sessionId === "s-design-2").length, 0, "等待期间 SHALL NOT 发出");

/* 手动放行 #1 → FIFO 队头 s-child-2 的投递执行（prompt 发出） */
const laneRelease1 = await callRoute("POST", "/api/dsh-hive/lane", { workspaceId: "ws-1", action: "release" });
eq(laneRelease1.status, 200, "手动放行 200");
await sleep(20);
eq(apiLog.prompt.length, 2, "放行后排队子蜂的首条提示词投递");
eq(apiLog.prompt[1].sessionId, "s-child-2", "FIFO 队头是先排队的子蜂");

/* 手动放行 #2 → 设计蜂乙的 send 执行 */
const laneRelease2 = await callRoute("POST", "/api/dsh-hive/lane", { workspaceId: "ws-1", action: "release" });
eq(laneRelease2.status, 200, "第二次放行 200");
await sleep(20);
const designFollowups = followupLog.filter((f) => f.sessionId === "s-design-2");
eq(designFollowups.length, 1, "放行后乙的 send 执行");
ok(designFollowups[0].message.content[0].text.startsWith("⟡设计蜂·能力：审阅"), "续发消息带前缀");
ok(designFollowups[0].message.content[0].text.includes("queued-proposal"), "续发消息插值");
eq(designFollowups[0].message.source, { kind: "user" }, "followup source kind:user");
eq(designFollowups[0].message.role, "user", "followup role:user");

/* ── 空白/无人机/归档过滤（任务 3.2） ── */
makeAgent("s-blank", { events: [] });
fire("agent/turn-stopping", { agent: agentById.get("s-blank"), turn: 0 });
eq(apiLog.create.length, 2, "空白会话不评估");
makeAgent("s-drone", { origin: "subagent", events: handoff({ seq: 1, body: '{"proposal":"drone-p"}' }) });
fire("agent/turn-stopping", { agent: agentById.get("s-drone"), turn: 1 });
eq(apiLog.create.length, 2, "无人机不评估");

/* ── 野蜂 spawn 降级（spec「野蜂孵化降级」） ── */
makeAgent("s-wild-spawn", { events: handoff({ seq: 30, body: '{"proposal":"wild-p"}' }) });
/* spawn 目标蜂种必须同帧提交（宿主级联会移除目标缺失的孵化规则） */
const wildBeeTypes = [
  { id: 'lonely', name: '独蜂', capabilities: [{ id: 'h', name: '交接', trigger: { capture: { A: 'proposal' } }, action: { type: 'spawn', promptTemplate: '去孵化 {A}', targetBeeTypeId: 'design' } }] },
  { id: 'design', name: '设计蜂', capabilities: [] }
];
await callRoute("PUT", "/api/dsh-hive/state", { revision: 2, beeTypes: wildBeeTypes, beeAssignments: { "s-wild-spawn": "lonely" } });
fire("agent/turn-stopping", { agent: agentById.get("s-wild-spawn"), turn: 1 });
await sleep(20);
eq(apiLog.create.length, 2, "野蜂 spawn 不创建会话");
const wildFollowup = followupLog.filter((f) => f.sessionId === "s-wild-spawn");
eq(wildFollowup.length, 1, "降级为本会话 send");
ok(wildFollowup[0].message.content[0].text.includes("wild-p"), "降级提示词插值");

/* ── 保险丝（任务 2.3 接线）：连续 send 超限停链 ── */
const fusyTypes = [{ id: "chatty", name: "话痨蜂", queuePolicy: "free", capabilities: [{ id: "loop", name: "续发", trigger: { capture: { A: "n" } }, action: { type: "send", promptTemplate: "第 {A} 轮" }, once: false }] }];
await callRoute("PUT", "/api/dsh-hive/state", { revision: 3, beeTypes: fusyTypes, beeAssignments: { "s-chat": "chatty" } });
makeAgent("s-chat", { events: handoff({ seq: 40, body: '{"n":"1"}' }) });
let seqCounter = 40;
for (let round = 0; round < 30; round++) {
  seqCounter += 1;
  agentById.get("s-chat").session.events.push(...handoff({ seq: seqCounter, turn: round + 1, body: '{"n":"' + (seqCounter - 40) + '"}' }));
  fire("agent/turn-stopping", { agent: agentById.get("s-chat"), turn: round + 1 });
  await sleep(5);
}
const chatSends = followupLog.filter((f) => f.sessionId === "s-chat");
ok(chatSends.length < 30, `连续自动续发计数触发停链（发送 ${chatSends.length} < 30）`);
ok(chatSends.length <= 9, "停链在连续计数上限附近（含野蜂降级消耗 1 次）");

/* ── /hatch 手动孵化（spec「手动孵化绕过车道」） ── */
await callRoute("PUT", "/api/dsh-hive/state", { revision: 4, beeTypes, beeAssignments: { "s-idea": "idea", "s-design-1": "design", "s-design-2": "design" } });
const hatch1 = await callRoute("POST", "/api/dsh-hive/hatch", { sessionId: "s-idea", capabilityId: "handoff" });
eq(hatch1.status, 200, "手动孵化 200");
ok(hatch1.body.sessionId?.startsWith("s-child-"), "孵化产出新会话");
eq(apiLog.selectModel.at(-1).model, "deepseek-v4-pro", "手动孵化也按目标蜂种模型");
const hatch2 = await callRoute("POST", "/api/dsh-hive/hatch", { sessionId: "s-idea", capabilityId: "nonexistent" });
eq(hatch2.status, 404, "未知能力 → 404");

/* ── /models 目录代理（任务 3.7，S4 复验定稿：modelCatalog 数据源） ── */
const models = await callRoute("GET", "/api/dsh-hive/models?sessionId=s-idea");
eq(models.status, 200, "models 200");
eq(models.body.models.groups[0].id, "p", "models 目录近恒等透传（groups 信封）");
eq(models.body.models.groups[0].models[0].id, "m", "models 条目字段与客户端消费面一致");
eq(apiLog.models.length, 1, "modelCatalog 恰好一次");
eq(apiLog.models[0].length, 0, "modelCatalog 无参调用（sessionId 仅哨兵，不转发服务面）");

/* ── 蜂卡状态事件（任务 3.6）：bee-engine 帧含 waits 与 lane ── */
const lastEngine = frames().filter((f) => f.type === "bee-engine").at(-1);
ok(lastEngine && "lane" in lastEngine && "sessions" in lastEngine, "bee-engine 帧形状");

/* ── 监听器卸载清理（任务 3.8） ── */
const ctxEffectDisposers = [];
const ctx2 = {
  effect(fn) {
    const d = fn();
    if (typeof d === "function") ctxEffectDisposers.push(d);
    return d;
  },
  on() {
    return () => {};
  },
  webServer: { register: () => () => {} },
  agents: { get: () => undefined },
  sessionController: sessionControllerStub,
  workspaceRegistry: workspaceRegistryStub
};
apply(ctx2);
eq(ctxEffectDisposers.length, 1, "effect 卸载函数已返回");
ctxEffectDisposers[0]();
ok(true, "卸载无异常");

console.log("ALL BEE-ENGINE SMOKE TESTS PASSED");
