/**
 * 工具召唤（hive_summon）冒烟测试（hive-summon-tool 任务 2.3 + 3.5）：
 *  - resolveCallerWorkspace 三分支（主会话/无人机父链/野蜂）+ cwd 兜底 + 环防御
 *    + registry 未就绪兜底（注入假 registry 与 header，纯函数直测）；
 *  - hive_summon 工具：签名校验/缺省巢/无人机父链解析巢/蜂种缺失/野蜂显式失败/
 *    首条消息组装（payload 在前 + presetPrompt）/纯创建/serialized 车道排队/
 *    保险丝父链记账（工具 execute 注入假 ctx，经 apply 装配后以模拟 exec 调用）。
 * 运行：node test/summon-tool-smoke.mjs
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { apply, fuseRootSessionId, resolveCallerWorkspace } from "../src/index.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ════ 第一部分：resolveCallerWorkspace（任务 2.3，纯函数直测） ════ */

/* ── 假 registry / 假 agents（注入假 registry 与 header） ── */
const registry = {
  list: () => [
    { id: "ws-1", path: "F:/repo", sessionIds: ["s-main"] },
    { id: "ws-2", path: "F:/other", sessionIds: ["s-main2", "s-child-main2"] }
  ],
  archivedSessionIds: []
};
const makeAgent = (id, { cwd = "F:/repo", origin, parentSession } = {}) => ({
  id,
  session: { header: { id, cwd, ...(origin ? { origin } : {}), ...(parentSession ? { parentSession } : {}) } }
});
const agentsById = new Map();
const agents = { get: (id) => agentsById.get(id) };
const deps = { agents, registry };

/* 主会话分支：在册 sessionIds 反查命中 */
const main1 = makeAgent("s-main", { cwd: "F:/repo" });
agentsById.set("s-main", main1);
eq(resolveCallerWorkspace(main1, deps), "ws-1", "主会话 → registry sessionIds 反查");

/* 无人机分支：父链上溯至非 subagent 根再反查（SHALL NOT 因无人机不在册误判野蜂） */
const root = makeAgent("s-main2", { cwd: "F:/other" });
const drone1 = makeAgent("d-1", { cwd: "F:/other", origin: "subagent", parentSession: "s-main2" });
const drone2 = makeAgent("d-2", { cwd: "F:/other", origin: "subagent", parentSession: "d-1" });
agentsById.set("s-main2", root);
agentsById.set("d-1", drone1);
agentsById.set("d-2", drone2);
eq(resolveCallerWorkspace(drone2, deps), "ws-2", "无人机的无人机 → 沿 parentSession 上溯至根反查");
eq(resolveCallerWorkspace(drone1, deps), "ws-2", "单级无人机 → 同链解析");

/* fuseRootSessionId（D5）：记账根 = 父链上溯出的非 subagent 会话 */
eq(fuseRootSessionId(drone2, { agents }), "s-main2", "无人机链保险丝记账根 = 链顶主会话");
eq(fuseRootSessionId(main1, { agents }), "s-main", "主会话记账根 = 自身");
const orphanDrone = makeAgent("d-orphan", { origin: "subagent", parentSession: "s-gone" });
agentsById.set("d-orphan", orphanDrone);
eq(fuseRootSessionId(orphanDrone, { agents }), "d-orphan", "父离线 → 保守记账到最深可解析会话（防绕过）");
const loopA = makeAgent("loop-a", { origin: "subagent", parentSession: "loop-b" });
const loopB = makeAgent("loop-b", { origin: "subagent", parentSession: "loop-a" });
agentsById.set("loop-a", loopA);
agentsById.set("loop-b", loopB);
ok(typeof fuseRootSessionId(loopA, { agents }) === "string", "parentSession 环 → 收敛到链上节点（不悬挂）");

/* 野蜂分支：不在册且 cwd 不匹配 → null */
const wild = makeAgent("s-wild", { cwd: "F:/nowhere" });
agentsById.set("s-wild", wild);
eq(resolveCallerWorkspace(wild, deps), null, "野蜂（无巢）→ null");

/* cwd × path 兜底：不在任何 sessionIds，但 cwd 与某巢 path 相等 */
const cwdOnly = makeAgent("s-cwd", { cwd: "F:/other" });
agentsById.set("s-cwd", cwdOnly);
eq(resolveCallerWorkspace(cwdOnly, deps), "ws-2", "cwd 匹配 registry path → 兜底命中");
const droneCwd = makeAgent("d-cwd", { cwd: "F:/other", origin: "subagent", parentSession: "s-gone" });
agentsById.set("d-cwd", droneCwd);
eq(resolveCallerWorkspace(droneCwd, deps), "ws-2", "父会话离线的无人机 → cwd 兜底（SHALL NOT 误判野蜂）");

/* 环防御：parentSession 自环 / 双向环 → 停止上溯并按兜底/野蜂收敛 */
const loopWs = makeAgent("loop-ws", { cwd: "F:/loop", origin: "subagent", parentSession: "loop-ws2" });
const loopWs2 = makeAgent("loop-ws2", { cwd: "F:/loop", origin: "subagent", parentSession: "loop-ws" });
agentsById.set("loop-ws", loopWs);
agentsById.set("loop-ws2", loopWs2);
eq(resolveCallerWorkspace(loopWs, deps), null, "parentSession 双向环 → null（不悬挂不抛错）");
const selfLoop = makeAgent("self", { cwd: "F:/nowhere", origin: "subagent", parentSession: "self" });
agentsById.set("self", selfLoop);
eq(resolveCallerWorkspace(selfLoop, deps), null, "自环 → null");

/* registry 未就绪兜底：list 抛错 / registry 缺失 → null（不裸异常） */
eq(resolveCallerWorkspace(main1, { agents, registry: { list: () => { throw new Error("not ready"); } } }), null, "registry 抛错 → null");
eq(resolveCallerWorkspace(main1, {}), null, "deps 缺 registry → null");
eq(resolveCallerWorkspace(undefined, deps), null, "agent 缺省 → null");

/* 归属优先级：sessionIds 反查先于 cwd 兜底 */
const overlapping = makeAgent("s-ovl", { cwd: "F:/other" });
const reg2 = { list: () => [{ id: "ws-x", path: "F:/elsewhere", sessionIds: ["s-ovl"] }, { id: "ws-y", path: "F:/other", sessionIds: [] }] };
eq(resolveCallerWorkspace(overlapping, { agents, registry: reg2 }), "ws-x", "sessionIds 归属优先于 cwd×path 兜底");

/* cwd 兜底候选取链上最近祖先 */
const rootFar = makeAgent("root-far", { cwd: "F:/root-cwd" });
const droneFar = makeAgent("drone-far", { cwd: "F:/other", origin: "subagent", parentSession: "root-far" });
agentsById.set("root-far", rootFar);
agentsById.set("drone-far", droneFar);
eq(resolveCallerWorkspace(droneFar, deps), "ws-2", "根不在册且 cwd 不匹配 → 途中 drone cwd 兜底");

/* ════ 第二部分：hive_summon 工具（任务 3.5，注入假 ctx 经 apply 装配） ════ */

process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-hive-summon-"));

const toolDefs = new Map(); // name → definition（ctx.tools.register 捕获）
const disposedTools = [];
const engineListeners = [];
const apiLog = { create: [], selectModel: [], prompt: [] };
let childSeq = 0;
let lastCreated = null;
const ws1Members = ["s-root"]; // 主会话在册；召唤出的子蜂随 create 入巢（workspaceRegistry 镜像语义）

const sessionControllerStub = {
  create: async (request) => {
    apiLog.create.push(request);
    const sessionId = "s-child-" + ++childSeq;
    lastCreated = sessionId;
    if (request.workspaceId === "ws-1") ws1Members.push(sessionId); // create(workspaceId) 附着巢账号
    return { sessionId };
  },
  selectModel: async (request) => {
    apiLog.selectModel.push(request);
    return { selected: { provider: request.provider, model: request.model } };
  },
  prompt: async (request) => {
    apiLog.prompt.push(request);
    return { accepted: true };
  },
  modelCatalog: async () => ({ groups: [] })
};

const liveRegistry = {
  list: () => [
    { id: "ws-1", path: "F:/repo", sessionIds: [...ws1Members] },
    { id: "ws-2", path: "F:/other", sessionIds: ["s-main2"] }
  ],
  archivedSessionIds: []
};

const ctxStub = {
  effect(fn) {
    const dispose = fn();
    if (typeof dispose === "function") effectCleanups.push(dispose);
  },
  on(event, handler) {
    engineListeners.push({ event, handler });
    return () => {};
  },
  webServer: {
    register() {
      return () => {};
    }
  },
  tools: {
    register(definition) {
      toolDefs.set(definition.name, definition);
      return () => {
        disposedTools.push(definition.name);
      };
    }
  },
  agents: { get: (id) => agentsById.get(id) },
  sessionController: sessionControllerStub,
  workspaceRegistry: liveRegistry
};
const effectCleanups = [];

apply(ctxStub);
ok(toolDefs.has("hive_summon"), "hive_summon 已注册（ctx.tools.register 注入点）");
ok(toolDefs.has("hive_summon") && toolDefs.get("hive_summon").output.render({}, { ok: true }).length === 1, "输出 render 可用");

const fire = (event, payload) => {
  for (const listener of [...engineListeners, ...listeners2]) {
    if (listener.event === event) listener.handler(payload);
  }
};

/* 蜂种落盘（经既有 PUT 路由形不可行——webServer 桩未捕路由；直接驱使宿主加载
   存储文档：写入 DSH_HOME storages 后重载。简化：以第二实例装载已写文档。 */
const { writeFileSync, readFileSync, mkdirSync: mkDir } = await import("node:fs");
const storageDir = join(process.env.DSH_HOME, "storages");
mkDir(storageDir, { recursive: true });
writeFileSync(
  join(storageDir, "dsh-hive.json"),
  JSON.stringify({
    version: 1,
    revision: 1,
    positions: {},
    beeTypes: [
      { id: "exec", name: "执行蜂", presetPrompt: "先读技能全路径并遵循。", queuePolicy: "free" },
      { id: "serial", name: "排队蜂", presetPrompt: "", queuePolicy: "serialized" },
      { id: "mod", name: "模型蜂", model: { provider: "p", model: "m" }, queuePolicy: "free" }
    ],
    beeAssignments: {}
  })
);
/* 重启实例（读取持久化文档 + 重挂工具）——同时演练工具重注册幂等 */
const effectCleanups2 = [];
const listeners2 = [];
const ctx2 = {
  effect(fn) {
    const dispose = fn();
    if (typeof dispose === "function") effectCleanups2.push(dispose);
  },
  on(event, handler) {
    listeners2.push({ event, handler });
    return () => {};
  },
  webServer: { register: () => () => {} },
  tools: {
    register(definition) {
      toolDefs.set(definition.name, definition);
      return () => {};
    }
  },
  agents: { get: (id) => agentsById.get(id) },
  sessionController: sessionControllerStub,
  workspaceRegistry: liveRegistry
};
apply(ctx2);
const summon = toolDefs.get("hive_summon");
ok(typeof summon.execute === "function", "hive_summon execute 已装配");

const execFor = (agent) => ({ agent, name: "hive_summon", arguments: {}, signal: new AbortController().signal });

/* ── 签名校验：非法参数类型 → 结构化失败，SHALL NOT 创建会话 ── */
const badArgs = await summon.execute({ payload: 123 }, execFor(main1));
eq(badArgs, { ok: false, reason: "invalid-arguments" }, "非字符串 payload → invalid-arguments");
eq(apiLog.create.length, 0, "签名失败不建会话");

/* ── 蜂种缺失 → bee-type-missing（字段级），SHALL NOT 创建会话 ── */
const missingBee = await summon.execute({ payload: "x", beeTypeId: "nope" }, execFor(main1));
eq(missingBee, { ok: false, reason: "bee-type-missing", field: "beeTypeId" }, "蜂种缺失结构化报错");
eq(apiLog.create.length, 0, "蜂种缺失不建会话");

/* ── 野蜂召唤显式失败：no-workspace，SHALL NOT 静默降级为 send ── */
const wildAgent = makeAgent("s-wild-live", { cwd: "F:/nowhere" });
agentsById.set("s-wild-live", wildAgent);
const wildSummon = await summon.execute({ payload: "x" }, execFor(wildAgent));
eq(wildSummon, { ok: false, reason: "no-workspace" }, "野蜂 → no-workspace");
eq(apiLog.create.length, 0, "野蜂不建会话");

/* ── 主会话缺省巢召唤（spec 场景一）：payload + presetPrompt 组装，payload 在前 ──
   （每个小节独立的根会话 —— 保险丝按根会话记账，互不挤占预算） */
const mainSummon = await summon.execute({ payload: "执行提案 add-auth", beeTypeId: "exec" }, execFor(main1));
ok(mainSummon.ok === true && typeof mainSummon.sessionId === "string", "主会话缺省巢召唤 ok:true + sessionId");
eq(apiLog.create[0].workspaceId, "ws-1", "缺省 = 发起会话所属巢（registry 反查）");
const firstText = apiLog.prompt[0].content[0].text;
ok(firstText.startsWith("⟡执行蜂·召唤"), "首条消息带 ⟡蜂种名·召唤 可辨识前缀");
const body = firstText.slice(firstText.indexOf("\n\n") + 2);
ok(body.startsWith("执行提案 add-auth"), "payload 在前（正文开头）");
ok(body.endsWith("先读技能全路径并遵循。"), "presetPrompt 在后");
eq(apiLog.prompt[0].mode, "queue", "queue 模式投递");
ok(typeof apiLog.prompt[0].requestId === "string" && apiLog.prompt[0].requestId.length > 0, "requestId 每次铸造");

/* ── 无人机经父链解析巢（spec 场景二）：无人机不在 sessionIds，SHALL NOT 误判野蜂 ── */
const liveRoot = makeAgent("s-root-live", { cwd: "F:/repo" });
const liveDrone = makeAgent("d-live", { cwd: "F:/repo", origin: "subagent", parentSession: "s-root-live" });
agentsById.set("s-root-live", liveRoot);
agentsById.set("d-live", liveDrone);
const droneSummon = await summon.execute({ payload: "无人机单", beeTypeId: "exec" }, execFor(liveDrone));
ok(droneSummon.ok === true, "无人机召唤落巢成功");
eq(apiLog.create.at(-1).workspaceId, "ws-1", "无人机经 parentSession 链上溯解析巢");

/* ── 纯创建（payload 空白，spec 场景「纯创建」）：只建不发，即使 presetPrompt 非空 ── */
const main2 = makeAgent("s-main2-live", { cwd: "F:/repo" });
agentsById.set("s-main2-live", main2);
const createOnly = await summon.execute({ payload: "   ", beeTypeId: "exec" }, execFor(main2));
ok(createOnly.ok === true && typeof createOnly.sessionId === "string", "纯创建返回 ok:true + sessionId");
eq(apiLog.prompt.filter((p) => p.sessionId === createOnly.sessionId).length, 0, "空白 payload SHALL NOT 投递任何消息");

/* ── 蜂种模型 selectModel：按目标蜂种模型配置 ── */
const main3 = makeAgent("s-main3-live", { cwd: "F:/repo" });
agentsById.set("s-main3-live", main3);
await summon.execute({ payload: "模型蜂开工", beeTypeId: "mod" }, execFor(main3));
eq(apiLog.selectModel.at(-1).model, "m", "selectModel 按蜂种模型");
eq(apiLog.selectModel.at(-1).sessionId, lastCreated, "selectModel 作用于新蜂会话");

/* ── serialized 车道排队（spec 场景三）：占道期间第二只同蜂种召唤照常创建、消息排队 ── */
const main4 = makeAgent("s-main4-live", { cwd: "F:/repo" });
agentsById.set("s-main4-live", main4);
const serial1 = await summon.execute({ payload: "排队蜂一号", beeTypeId: "serial" }, execFor(main4));
ok(serial1.ok === true, "一号召唤创建");
await sleep(10);
eq(apiLog.prompt.filter((p) => p.sessionId === serial1.sessionId).length, 1, "一号首条消息占道直投（车道空闲）");
const serial2 = await summon.execute({ payload: "排队蜂二号", beeTypeId: "serial" }, execFor(main4));
ok(serial2.ok === true, "二号召唤照常创建（SHALL NOT 拒绝）");
await sleep(10);
eq(apiLog.prompt.filter((p) => p.sessionId === serial2.sessionId).length, 0, "二号首条消息进入车道等待（SHALL NOT 插队）");
/* 一号归静（idle 且无在途）→ 车道放行 → 二号投递 */
const serial1Agent = makeAgent(serial1.sessionId, { cwd: "F:/repo" });
agentsById.set(serial1.sessionId, serial1Agent);
fire("agent/status", { agent: serial1Agent, status: "idle" });
await sleep(20);
eq(apiLog.prompt.filter((p) => p.sessionId === serial2.sessionId).length, 1, "前一只归静后放行，二号首条消息投递");

/* ── 保险丝父链记账（spec 场景六）：无人机链计数记到根会话，超限停链 ──
   此前 main1 已成功召唤 4 次（1+1+1+1：exec/mod/serial×2… 至少 4 次 spawn）。
   换用全新根会话精确计数：s-fuse 主会话连召至超限。 */
const fuseRoot = makeAgent("s-fuse-root", { cwd: "F:/repo" });
const fuseDrone = makeAgent("d-fuse", { cwd: "F:/repo", origin: "subagent", parentSession: "s-fuse-root" });
agentsById.set("s-fuse-root", fuseRoot);
agentsById.set("d-fuse", fuseDrone);
/* 用户消息重置连续自动动作计数（既有语义：保险丝 consecutive 只计无用户消息间隔的串） */
fire("agent/inbox/inserted", { message: { content: [{ type: "text", text: "用户插话" }] } });
const fuseMarker = apiLog.create.length;
for (let i = 0; i < 4; i++) {
  const droneSummonN = await summon.execute({ payload: "无人机第" + i + "单", beeTypeId: "exec" }, execFor(fuseDrone));
  ok(droneSummonN.ok === true, "无人机第 " + i + " 单召唤成功（记账到根）");
}
/* 主会话（同根）的第 5 次 → 根计数已达 sessionAutoSpawns=4 → 拒绝 */
const overFuse = await summon.execute({ payload: "第 5 单", beeTypeId: "exec" }, execFor(fuseRoot));
ok(overFuse.ok === false && String(overFuse.reason).startsWith("fuse-"), "根会话超限 → 后续工具召唤被拒绝并 notify");
eq(apiLog.create.length - fuseMarker, 4, "超限后 SHALL NOT 创建会话");
/* 无人机自身计数不用于判定：同无人机（自身计数 0）仍被根计数拦截 */
const droneOver = await summon.execute({ payload: "第 6 单", beeTypeId: "exec" }, execFor(fuseDrone));
ok(droneOver.ok === false, "SHALL NOT 因无人机自身计数清零而绕过保险丝");

/* ── 显式 workspaceId（罕见跨巢覆盖）：在册校验 ── */
const main5 = makeAgent("s-main5-live", { cwd: "F:/repo" });
agentsById.set("s-main5-live", main5);
const crossWs = await summon.execute({ payload: "跨巢", beeTypeId: "exec", workspaceId: "ws-2" }, execFor(main5));
ok(crossWs.ok === true, "显式在册 workspaceId 召唤成功");
const badWs = await summon.execute({ payload: "x", workspaceId: "ws-gone" }, execFor(main5));
eq(badWs, { ok: false, reason: "workspace-missing", field: "workspaceId" }, "未知 workspaceId → 结构化报错");

/* ── 召唤边记账（hive-interaction-polish 2.2/D7）：executeSummon 成功路径写
   doc.summonEdges（工具召唤入口；能力 spawn 与 /hatch 共用同一核心）。 ── */
const readStoredDoc = () => JSON.parse(readFileSync(join(storageDir, "dsh-hive.json"), "utf8"));
{
  const stored = readStoredDoc();
  const edges = stored.summonEdges ?? {};
  eq(edges[mainSummon.sessionId]?.parentId, "s-main", "工具召唤记账：child → { parentId: 召唤者会话 }");
  ok(typeof edges[mainSummon.sessionId]?.at === "number" && Number.isFinite(edges[mainSummon.sessionId].at), "召唤边带 at 时间戳");
  eq(edges[droneSummon.sessionId]?.parentId, "d-live", "无人机召唤者记账（父链语义照常）");
  eq(edges[createOnly.sessionId]?.parentId, "s-main2-live", "纯创建（空白 payload）同样记账（连线是视觉事实）");
  ok(!("at" in stored) && stored.version === 1, "文档 version 保持 1（optional 字段，无迁移）");
}

/* ── 召唤边失效剪除（2.3/D7）：失效边在宿主半区下一次持久化时从 doc.summonEdges 剪除 ── */
{
  /* 消失路径：child 会话从镜像移除（不在 sessionIds 也不在 ctx.agents）→ 剪除 */
  const vanished = createOnly.sessionId;
  const idx = ws1Members.indexOf(vanished);
  ok(idx >= 0, "剪除前置：消失会话原在巢 sessionIds 中");
  if (idx >= 0) ws1Members.splice(idx, 1);
  fire("agent/inbox/inserted", { message: { content: [{ type: "text", text: "用户插话" }] } });
  const vanishRoot = makeAgent("s-vanish-root", { cwd: "F:/repo" });
  agentsById.set("s-vanish-root", vanishRoot);
  const vanishSummon = await summon.execute({ payload: "触发消失剪边", beeTypeId: "exec" }, execFor(vanishRoot));
  ok(vanishSummon.ok === true, "触发剪除的召唤成功");
  ok(!readStoredDoc().summonEdges?.[vanished], "消失端点边已剪除（下次持久化时）");
  ok(readStoredDoc().summonEdges?.[vanishSummon.sessionId]?.parentId === "s-vanish-root", "新边照常记账");

  /* 归档路径：child 归档（仍留在 sessionIds——储蜜层镜像语义）→ 剪除（并查 archivedSessionIds） */
  const victim = mainSummon.sessionId;
  ok(readStoredDoc().summonEdges?.[victim], "剪除前置：归档会话的边在档");
  liveRegistry.archivedSessionIds.push(victim);
  fire("agent/inbox/inserted", { message: { content: [{ type: "text", text: "用户插话" }] } });
  const pruneRoot = makeAgent("s-prune-root", { cwd: "F:/repo" });
  agentsById.set("s-prune-root", pruneRoot);
  const pruneSummon = await summon.execute({ payload: "触发归档剪边", beeTypeId: "exec" }, execFor(pruneRoot));
  ok(pruneSummon.ok === true, "触发剪除的召唤成功");
  ok(!readStoredDoc().summonEdges?.[victim], "归档端点边已剪除（并查 archivedSessionIds，仅查 sessionIds 会漏剪）");
  liveRegistry.archivedSessionIds = liveRegistry.archivedSessionIds.filter((id) => id !== victim); // 复位（不影响后续断言）
}

/* ── 工具卸载清理：effect disposer 触发登出（SHALL NOT 泄漏） ── */
effectCleanups2[0]();
ok(true, "卸载无异常");

console.log("ALL SUMMON-TOOL SMOKE TESTS PASSED");
