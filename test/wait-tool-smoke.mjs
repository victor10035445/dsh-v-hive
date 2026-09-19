/**
 * 工具等待（hive_wait）冒烟测试（hive-summon-tool 任务 4.3，spec「工具等待」四分支）：
 *  - idle 分支：入口即检（已归静立即 ok / 在等收到归静事件放行）；
 *  - 琥珀分支：approval 瀑布开始 → 在等等待器立即 waiting-interaction；入口即检；
 *  - 超时分支：timeoutMs 到期 → timeout；
 *  - 消失分支：归档 → session-archived；不存在 → session-not-found；
 *  - 附加：同会话多等待者、调用方取消传播（aborted）、插件卸载清理（SHALL NOT 泄漏）。
 * 运行：node test/wait-tool-smoke.mjs
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
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-hive-wait-"));

const toolDefs = new Map();
const effectCleanups = [];
const listeners = [];
const agentsById = new Map();

const makeAgent = (id, { status = "running", cwd = "F:/repo" } = {}) => {
  const agent = { id, status, session: { header: { id, cwd } } };
  agentsById.set(id, agent);
  return agent;
};

const ctxStub = {
  effect(fn) {
    const dispose = fn();
    if (typeof dispose === "function") effectCleanups.push(dispose);
  },
  on(event, handler) {
    listeners.push({ event, handler });
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
  sessionController: { create: async () => ({}), prompt: async () => ({}) },
  workspaceRegistry: {
    list: () => [{ id: "ws-1", path: "F:/repo", sessionIds: ["s-idle", "s-run", "s-amber", "s-multi", "s-unload"] }],
    archivedSessionIds: ["s-archived"]
  }
};

apply(ctxStub);
const hiveWait = toolDefs.get("hive_wait");
ok(typeof hiveWait?.execute === "function", "hive_wait 已注册且 execute 可用");
ok(hiveWait.output.render({}, { ok: true }).length === 1, "输出 render 可用");

const fire = (event, payload) => {
  for (const listener of listeners) {
    if (listener.event === event) listener.handler(payload);
  }
};
const execFor = (signal) => ({ agent: agentsById.get("s-waiter"), name: "hive_wait", arguments: {}, signal: signal ?? new AbortController().signal });
makeAgent("s-waiter"); // 调用方占位（exec.agent 不参与判定，仅信号与身份）

/* ── 分支一（idle）：目标已归静 → 入口即检立即 ok:true（SHALL NOT 空等下一次事件） ── */
const idleAgent = makeAgent("s-idle", { status: "idle" });
const idleDirect = await hiveWait.execute({ sessionId: "s-idle" }, execFor());
eq(idleDirect, { ok: true }, "已归静（缓存缺项回读活代理状态）→ 立即 ok:true");

/* 经事件缓存后入口即检：running 事件 → idle 事件 → 缓存 idle → 立即 ok */
fire("agent/status", { agent: idleAgent, status: "idle" });
eq(await hiveWait.execute({ sessionId: "s-idle" }, execFor()), { ok: true }, "statusBySession 缓存 idle → 立即 ok:true");

/* 在等分支：running 期间注册等待 → idle 事件到达 → 放行 ok:true（事件驱动非轮询） */
const runAgent = makeAgent("s-run", { status: "running" });
fire("agent/status", { agent: runAgent, status: "running" });
const waitPromise = hiveWait.execute({ sessionId: "s-run" }, execFor());
let settled = false;
waitPromise.then(() => (settled = true));
await sleep(10);
eq(settled, false, "未归静期间等待器挂起（不轮询不误放）");
fire("agent/status", { agent: runAgent, status: "idle" });
eq(await waitPromise, { ok: true }, "归静事件到达 → 等待器放行 ok:true");

/* ── 分支二（琥珀）：approval 瀑布开始 → 在等等待器立即 waiting-interaction ── */
const amberAgent = makeAgent("s-amber", { status: "running" });
fire("agent/status", { agent: amberAgent, status: "running" });
const amberWait = hiveWait.execute({ sessionId: "s-amber" }, execFor());
const approvalHandler = listeners.find((l) => l.event === "approval/request")?.handler;
ok(typeof approvalHandler === "function", "approval/request 瀑布监听已挂（琥珀事件面）");
let releaseApproval;
const approvalFlow = approvalHandler(
  { agent: amberAgent },
  () => new Promise((resolve) => (releaseApproval = resolve))
);
await sleep(10);
eq(await amberWait, { ok: false, reason: "waiting-interaction" }, "琥珀开始 → 在等等待器立即上报");
releaseApproval("allowed-once");
eq(await approvalFlow, "allowed-once", "瀑布放行恒向下游（插件只观察不干预）");
/* 琥珀入口即检：瀑布在途时新调用立即 waiting-interaction */
fire("agent/status", { agent: amberAgent, status: "running" });
const amberWait2 = hiveWait.execute({ sessionId: "s-amber" }, execFor());
let releaseApproval2;
const approvalFlow2 = approvalHandler({ agent: amberAgent }, () => new Promise((resolve) => (releaseApproval2 = resolve)));
await sleep(10);
eq(await amberWait2, { ok: false, reason: "waiting-interaction" }, "琥珀期间入口即检 → 立即 waiting-interaction");
releaseApproval2("allowed-once");
await approvalFlow2; // 瀑布闭合 → 琥珀计数清除
await sleep(5);
/* user-questions/request 同事件面（question/plan-review 琥珀） */
const questionHandler = listeners.find((l) => l.event === "user-questions/request")?.handler;
ok(typeof questionHandler === "function", "user-questions/request 瀑布监听已挂");
/* 琥珀清除后 → 恢复事件驱动等待语义（无残留） */
const amberWait3 = hiveWait.execute({ sessionId: "s-amber", timeoutMs: 200 }, execFor());
await sleep(5);
fire("agent/status", { agent: amberAgent, status: "idle" });
eq(await amberWait3, { ok: true }, "琥珀结束后恢复事件驱动等待语义");

/* ── 分支三（超时）：timeoutMs 到期 → { ok:false, reason:"timeout" }（SHALL NOT 无限阻塞） ── */
makeAgent("s-slow", { status: "running" });
fire("agent/status", { agent: agentsById.get("s-slow"), status: "running" });
const slowStart = Date.now();
/* 等待器计时器为 unref（生产语义：不独占事件循环）——测试用 ref 的 keep-alive 并行等待 */
const [slowWait] = await Promise.all([hiveWait.execute({ sessionId: "s-slow", timeoutMs: 30 }, execFor()), sleep(80)]);
eq(slowWait, { ok: false, reason: "timeout" }, "超时 → timeout");
ok(Date.now() - slowStart >= 25, "确有等待（未提前误判）");
/* 非法 timeoutMs → invalid-arguments（0/负数/非整数） */
eq(await hiveWait.execute({ sessionId: "s-slow", timeoutMs: 0 }, execFor()), { ok: false, reason: "invalid-arguments" }, "timeoutMs 0 → invalid-arguments");
eq(await hiveWait.execute({}, execFor()), { ok: false, reason: "invalid-arguments" }, "缺 sessionId → invalid-arguments");

/* ── 分支四（消失）：归档 / 不存在 → 结构化错误，SHALL NOT 永久挂起 ── */
eq(await hiveWait.execute({ sessionId: "s-archived" }, execFor()), { ok: false, reason: "session-archived" }, "已归档 → session-archived");
eq(await hiveWait.execute({ sessionId: "s-ghost" }, execFor()), { ok: false, reason: "session-not-found" }, "不存在 → session-not-found");

/* ── 同会话多等待者：单次归静事件放行全部 ── */
const multiAgent = makeAgent("s-multi", { status: "running" });
fire("agent/status", { agent: multiAgent, status: "running" });
const multi1 = hiveWait.execute({ sessionId: "s-multi" }, execFor());
const multi2 = hiveWait.execute({ sessionId: "s-multi" }, execFor());
await sleep(10);
fire("agent/status", { agent: multiAgent, status: "idle" });
eq(await multi1, { ok: true }, "多等待者 #1 放行");
eq(await multi2, { ok: true }, "多等待者 #2 放行");

/* ── 调用方取消传播：会话中止信号 → 等待器清理 + aborted ── */
makeAgent("s-cancel", { status: "running" });
fire("agent/status", { agent: agentsById.get("s-cancel"), status: "running" });
const cancelCtl = new AbortController();
const cancelWait = hiveWait.execute({ sessionId: "s-cancel" }, execFor(cancelCtl.signal));
await sleep(10);
cancelCtl.abort();
eq(await cancelWait, { ok: false, reason: "aborted" }, "调用方中止 → aborted（等待器清理）");
/* 中止后再次归静事件不再触及已移除的等待器（无泄漏表现：不抛错） */
fire("agent/status", { agent: agentsById.get("s-cancel"), status: "idle" });
ok(true, "中止后事件不触及残留等待器");

/* ── 插件卸载清理：effect disposer 放行全部在等等待器（SHALL NOT 泄漏） ── */
makeAgent("s-unload", { status: "running" });
fire("agent/status", { agent: agentsById.get("s-unload"), status: "running" });
const unloadWait = hiveWait.execute({ sessionId: "s-unload" }, execFor());
await sleep(10);
effectCleanups[0]();
eq(await unloadWait, { ok: false, reason: "unloaded" }, "插件卸载 → 在等等待器全部放行（不悬挂）");

console.log("ALL WAIT-TOOL SMOKE TESTS PASSED");
