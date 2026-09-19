/**
 * 道具栏宿主半区冒烟测试（context-hotbar-rework 3.1/3.4）：
 *  - 布局文档 schema：hotbars 三栏合法/非法（strict 按栏裁剪、唯一性、上限 32、
 *    提示词字段联动）、旧文档无 hotbars 兼容、PUT 缺省沿用、commands 残留剥离；
 *  - POST /summon：autoSend 两分支、蜂种/工作区缺失 404（字段级）、workspaceId
 *    缺失 400、空白 prompt 纯召唤（不投递）、模型降级 notify、serialized 蜂种
 *    绕车道直投（3.3）。
 * 运行：node test/hotbars-host-smoke.mjs
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseStoredDoc, apply, name, inject } from "../src/index.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

eq(name, "dsh-v-hive", "插件名");
ok(inject.includes("webServer") && inject.includes("sessionController"), "inject 声明含 webServer + sessionController");

/* ── schema：hotbars 合法/非法（读路径） ── */
const baseDoc = { version: 1, revision: 2, positions: {}, camera: null };
const hiveSlot = (id, name, over = {}) => ({ id, name, summon: true, autoSend: false, ...over });
const beeSlot = (id, name, prompt = "run tests") => ({ id, name, prompt, autoSend: false });
const floorSlot = (id, name, over = {}) => ({ id, name, createBee: true, autoSend: false, ...over });

const withHotbars = parseStoredDoc(
  JSON.stringify({
    ...baseDoc,
    hotbars: {
      hive: [hiveSlot("h1", "巢召唤", { beeTypeId: "bt-1", prompt: "开工", autoSend: true })],
      bee: [beeSlot("b1", "蜂指令")],
      floor: [floorSlot("f1", "建巢", { prompt: "新巢" })]
    }
  })
);
eq(withHotbars.hotbars.hive.length, 1, "合法 hotbars 保留");
eq(withHotbars.hotbars.hive[0].name, "巢召唤", "name trim 落库");
eq(withHotbars.hotbars.bee.length, 1, "蜂栏保留");
eq(withHotbars.hotbars.floor[0].prompt, "新巢", "地板栏建蜂开启 → prompt 保留");

/* 旧文档兼容：无 hotbars 字段 → 读取不炸（客户端按空配置处理） */
const legacy = parseStoredDoc(JSON.stringify(baseDoc));
eq(legacy.hotbars ?? null, null, "旧文档（无 hotbars）→ 视为空配置");
eq(parseStoredDoc(null).hotbars ?? null, null, "空文档 → 空配置");

/* 非法 hotbars → 整份文档重建默认（与 positions/camera 同等严格度） */
const invalidDocs = [
  { ...baseDoc, hotbars: { hive: [hiveSlot("", "x")], bee: [], floor: [] } }, // 空 id
  { ...baseDoc, hotbars: { hive: [hiveSlot("h1", "   ")], bee: [], floor: [] } }, // 空白 name
  { ...baseDoc, hotbars: { hive: [hiveSlot("h1", "x"), hiveSlot("h1", "y")], bee: [], floor: [] } }, // 重复 id
  { ...baseDoc, hotbars: { hive: [hiveSlot("h1", "x"), hiveSlot("h2", " x ")], bee: [], floor: [] } }, // trim 重名
  { ...baseDoc, hotbars: { hive: [hiveSlot("h1", "x", { createBee: true })], bee: [], floor: [] } }, // 巢栏禁字段（strict）
  { ...baseDoc, hotbars: { hive: [], bee: [beeSlot("b1", "x", "  ")], floor: [] } }, // 蜂栏空白 prompt
  { ...baseDoc, hotbars: { hive: [], bee: [beeSlot("b1", "x", "p", )], floor: [] } }, // 蜂栏 slot（合法对照）
  { ...baseDoc, hotbars: { hive: [], bee: [{ id: "b1", name: "x", prompt: "p", autoSend: false, summon: true }], floor: [] } }, // 蜂栏禁字段
  { ...baseDoc, hotbars: { hive: [], bee: [], floor: [{ id: "f1", name: "x", summon: true, autoSend: false }] } }, // 地板栏禁字段
  { ...baseDoc, hotbars: { hive: [hiveSlot("h1", "x", { summon: false, prompt: "关着还带提示词" })], bee: [], floor: [] } }, // 召唤关 + prompt 非空（联动拒绝）
  { ...baseDoc, hotbars: { hive: Array.from({ length: 33 }, (_, i) => hiveSlot("id" + i, "n" + i)), bee: [], floor: [] } } // 上限 32
];
for (const [i, doc] of invalidDocs.entries()) {
  if (i === 6) continue; // 合法对照跳过
  eq(parseStoredDoc(JSON.stringify(doc)).hotbars ?? null, null, `非法 hotbars[${i}] → 文档重建`);
}
const cap32 = parseStoredDoc(
  JSON.stringify({ ...baseDoc, hotbars: { hive: Array.from({ length: 32 }, (_, i) => hiveSlot("id" + i, "n" + i)), bee: [], floor: [] } })
);
eq(cap32.hotbars.hive.length, 32, "上限 32：32 条 → 通过");

/* ── 路由级测试：apply() + 桩 ctx（DSH_HOME 指到临时目录，避免碰真实存储） ── */
process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-hive-hotbars-"));

let routeHandler = null;
const engineListeners = [];
const promptCalls = [];
const selectModelCalls = [];
const createdFrom = [];
let selectModelShouldFail = false;
const agentsStub = { get() { return undefined; } };
const sessionControllerStub = {
  async create(arg) {
    createdFrom.push(arg);
    return { sessionId: "child-" + (createdFrom.length) };
  },
  async selectModel(arg) {
    if (selectModelShouldFail) throw new Error("model unavailable");
    selectModelCalls.push(arg);
  },
  async prompt(arg) {
    promptCalls.push(arg);
  }
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
      ok(decl.kind === "prefix" && decl.path === "/api/dsh-hive", "路由注册为 prefix");
      routeHandler = decl.handler;
      return () => {};
    }
  },
  agents: agentsStub,
  sessionController: sessionControllerStub,
  workspaceRegistry: { list: () => [{ id: "ws-1" }, { id: "ws-2" }], archivedSessionIds: [] }
};
apply(ctxStub);
ok(typeof routeHandler === "function", "路由 handler 已捕获");

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
const lastFrame = () =>
  sseRes.writes
    .map((w) => w.replace(/^data: /, "").trim())
    .filter((l) => l.startsWith("{"))
    .map((l) => JSON.parse(l))
    .pop();

/* GET /state → 默认文档 */
const st0 = await callRoute("GET", "/api/dsh-hive/state");
eq(st0.status, 200, "GET /state → 200");
eq(st0.body.doc.revision, 0, "初始 revision 0");

/* PUT /state 携带 hotbars → 写入 + 广播帧携带 hotbars */
const putBody = {
  revision: 0,
  positions: { "ws-1": { q: 1, r: -1 } },
  hotbars: {
    hive: [hiveSlot("h1", "巢召唤", { beeTypeId: "bt-1", prompt: "开工", autoSend: true })],
    bee: [beeSlot("b1", "蜂指令", "跑测试")],
    floor: [floorSlot("f1", "建巢")]
  }
};
const put1 = await callRoute("PUT", "/api/dsh-hive/state", putBody);
eq(put1.status, 200, "PUT hotbars → 200");
eq(put1.body.doc.hotbars.bee[0].prompt, "跑测试", "文档携带 hotbars（trim 落库）");
let frame = lastFrame();
ok(frame && frame.type === "layout-changed" && frame.doc.hotbars?.hive?.length === 1, "广播帧携带 hotbars");

/* PUT /state 不带 hotbars → 缺省沿用旧值（镜头/位置回写不丢道具栏配置） */
const put2 = await callRoute("PUT", "/api/dsh-hive/state", { revision: 1, camera: { theta: 1, phi: 1, dist: 20, tx: 0, tz: 0 } });
eq(put2.status, 200, "PUT 不带 hotbars → 200");
eq(put2.body.doc.hotbars.hive.length, 1, "hotbars 沿用旧值");

/* PUT /state 携带旧 commands 残留 → 写入后剥离（不做迁移，不报错） */
const put3 = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 2,
  commands: [{ id: "a", name: "旧指令", prompt: "p", autoSend: false }]
});
eq(put3.status, 200, "PUT 携带 commands 残留 → 200（未知键 strip）");
eq(put3.body.doc.commands ?? null, null, "落盘文档不再含 commands");

/* PUT /state 非法 hotbars → 400 + 字段级原因，文档不变更 */
const put4 = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 3,
  hotbars: { hive: [hiveSlot("h1", "x", { createBee: true })], bee: [], floor: [] }
});
eq(put4.status, 400, "巢栏禁字段 → 400");
ok(Array.isArray(put4.body.issues) && put4.body.issues.some((p) => String(p).includes("hotbars.hive.0")), "400 返回字段级路径");

const put5 = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 3,
  hotbars: { hive: [hiveSlot("h1", "x"), hiveSlot("h2", " x ")], bee: [], floor: [] }
});
eq(put5.status, 400, "trim 重名 → 400");

const st1 = await callRoute("GET", "/api/dsh-hive/state");
eq(st1.body.doc.hotbars.hive.length, 1, "非法提交后文档不变更");

/* PUT 蜂种（serialized + 模型配置，供 summon 蜂种分支使用） */
await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 3,
  beeTypes: [
    { id: "bt-design", name: "设计蜂", queuePolicy: "serialized", model: { provider: "p", model: "m" }, capabilities: [] }
  ]
});

/* 409 乐观锁（跨页签收敛的宿主半侧）：stale revision 提交 → 409 携带最新文档，
   后写者重放后成功，广播帧将两页签收敛到同一份 hotbars */
const put6 = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 0,
  hotbars: { hive: [hiveSlot("h9", "另一页签")], bee: [], floor: [] }
});
eq(put6.status, 409, "stale revision → 409");
eq(put6.body.doc.revision, 4, "409 携带最新文档（含蜂种写入后的 revision）");
sseRes.writes.length = 0;
const put7 = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: put6.body.doc.revision,
  hotbars: { hive: [hiveSlot("h9", "另一页签")], bee: [], floor: [] }
});
eq(put7.status, 200, "重放（最新 revision）→ 200");
frame = lastFrame();
ok(frame && frame.type === "layout-changed" && frame.doc.hotbars?.hive?.[0]?.name === "另一页签", "广播帧收敛两页签的 hotbars");

/* ── POST /summon：autoSend 两分支 ── */
/* 直发分支：autoSend 真 + 非空 prompt → create + prompt 直调（无蜂种 = 默认蜂，不 selectModel） */
const sum1 = await callRoute("POST", "/api/dsh-hive/summon", {
  workspaceId: "ws-1",
  prompt: "  开工  ",
  autoSend: true
});
eq(sum1.status, 200, "召唤直发 → 200");
ok(sum1.body.ok === true && typeof sum1.body.sessionId === "string", "响应 { ok, sessionId }");
eq(createdFrom[0], { workspaceId: "ws-1" }, "create({workspaceId}) 直调");
eq(promptCalls.length, 1, "非空 prompt + autoSend → 投递恰好一次");
eq(promptCalls[0].sessionId, sum1.body.sessionId, "投递目标 = 新会话");
ok(typeof promptCalls[0].requestId === "string" && /^[0-9a-f-]{36}$/.test(promptCalls[0].requestId), "requestId 铸造（randomUUID）");
eq(promptCalls[0].mode, "queue", "mode: queue（fix-dsh-012-host-half 直调契约）");
eq(promptCalls[0].content, [{ type: "text", text: "开工" }], "首条消息 = trim 后提示词");
eq(selectModelCalls.length, 0, "无蜂种 → 不 selectModel（默认蜂）");

/* 审查分支：autoSend 假 → 只建不发，仍返 sessionId */
const sum2 = await callRoute("POST", "/api/dsh-hive/summon", { workspaceId: "ws-1", prompt: "审查一下", autoSend: false });
eq(sum2.status, 200, "召唤审查 → 200");
ok(typeof sum2.body.sessionId === "string", "审查分支返 sessionId");
eq(promptCalls.length, 1, "autoSend 假 → 不投递");

/* 蜂种绑定：带 beeTypeId → beeAssignments 落盘 + selectModel 失败降级 notify */
sseRes.writes.length = 0;
selectModelShouldFail = true;
const sum3 = await callRoute("POST", "/api/dsh-hive/summon", { workspaceId: "ws-1", beeTypeId: "bt-design", prompt: "开工", autoSend: true });
selectModelShouldFail = false;
eq(sum3.status, 200, "蜂种召唤（selectModel 失败）→ 200");
eq(promptCalls.length, 2, "模型降级不阻断投递");
frame = lastFrame();
ok(frame && frame.type === "bee-engine", "broadcastEngine 帧已发");
const notices = frame.sessions?.[sum3.body.sessionId]?.notices ?? [];
ok(notices.some((n) => String(n.text).includes("模型不可用")), "模型降级 → notify 兜底");
const st2 = await callRoute("GET", "/api/dsh-hive/state");
eq(st2.body.doc.beeAssignments?.[sum3.body.sessionId], "bt-design", "beeAssignments 绑定落盘");

/* serialized 蜂种占道也不排队（3.3 绕车道）：蜂种已配 serialized，prompt 仍立即直调 */
eq(promptCalls.length, 2, "前置： serialized 蜂种在册");
const sum4 = await callRoute("POST", "/api/dsh-hive/summon", { workspaceId: "ws-2", beeTypeId: "bt-design", prompt: "不排队", autoSend: true });
eq(sum4.status, 200, "serialized 蜂种召唤 → 200");
eq(promptCalls.length, 3, "显式召唤绕车道：立即投递，SHALL NOT 进 FIFO");

/* 校验拒绝：蜂种缺失 404（不创建）、工作区未知 404、workspaceId 缺失 400 */
const createdBefore = createdFrom.length;
const sum5 = await callRoute("POST", "/api/dsh-hive/summon", { workspaceId: "ws-1", beeTypeId: "bt-gone", prompt: "x", autoSend: true });
eq(sum5.status, 404, "蜂种缺失 → 404");
eq(sum5.body.field, "beeTypeId", "404 字段级原因（beeTypeId）");
const sum6 = await callRoute("POST", "/api/dsh-hive/summon", { workspaceId: "ws-gone", prompt: "x", autoSend: true });
eq(sum6.status, 404, "工作区未知 → 404");
eq(sum6.body.field, "workspaceId", "404 字段级原因（workspaceId）");
const sum7 = await callRoute("POST", "/api/dsh-hive/summon", { prompt: "x", autoSend: true });
eq(sum7.status, 400, "workspaceId 缺失 → 400");
eq(createdFrom.length, createdBefore, "拒绝路径不创建会话（无半成品）");

/* 纯召唤：空白 prompt → 放行创建、仅跳过投递（autoSend 真假同义） */
const sum8 = await callRoute("POST", "/api/dsh-hive/summon", { workspaceId: "ws-1", prompt: "   \n  ", autoSend: true });
eq(sum8.status, 200, "空白 prompt 纯召唤 → 200（放行创建）");
eq(promptCalls.length, 3, "纯召唤 → 不投递");
const sum9 = await callRoute("POST", "/api/dsh-hive/summon", { workspaceId: "ws-1", prompt: "", autoSend: false });
eq(sum9.status, 200, "空白 prompt + autoSend 假 → 200");
eq(promptCalls.length, 3, "两个 autoSend 分支对空白 prompt 同义（只建不发）");

console.log("ALL HOTBARS HOST SMOKE TESTS PASSED");
