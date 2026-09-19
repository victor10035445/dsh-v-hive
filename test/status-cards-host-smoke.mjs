/**
 * 状态卡片宿主半区冒烟测试（bee-status-cards 2.3）：
 *  - PUT /state 合并链 statusCards（写路径整体替换 + 归一化丢弃悬空键）；
 *  - PUT /state 不带 statusCards → 缺省沿用旧值（镜头/位置回写不丢配置）；
 *  - 蜂种删除级联清理（beeTypes 替换时 statusCards 指向已删蜂种的键被移除）；
 *  - PUT /state 非法 statusCards（值形状非法 / 键数超上限）→ 400 结构级，文档不变更。
 * 运行：node test/status-cards-host-smoke.mjs
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { apply, name, inject } from "../src/index.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

eq(name, "dsh-v-hive", "插件名");
ok(inject.includes("webServer"), "inject 声明含 webServer");

process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-hive-status-cards-"));

let routeHandler = null;
const ctxStub = {
  effect(fn) { fn(); },
  on() { return () => {}; },
  webServer: {
    register(decl) {
      ok(decl.kind === "prefix" && decl.path === "/api/dsh-hive", "路由注册为 prefix");
      routeHandler = decl.handler;
      return () => {};
    }
  },
  agents: { get() { return undefined; } },
  sessionController: { async create() { return {}; }, async selectModel() {}, async prompt() {} },
  workspaceRegistry: { list: () => [], archivedSessionIds: [] }
};
apply(ctxStub);

const callRoute = async (method, url, body) => {
  const res = {
    status: 0,
    bodyText: "",
    writeHead(status) { this.status = status; },
    end(text) { this.bodyText = text ?? ""; }
  };
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))];
  await routeHandler({ url, method, [Symbol.iterator]: chunks[Symbol.iterator].bind(chunks) }, res);
  return { status: res.status, body: res.bodyText ? JSON.parse(res.bodyText) : null };
};

const sseRes = { writes: [], writeHead() {}, write(line) { this.writes.push(line); }, on() {} };
await routeHandler({ url: "/api/dsh-hive/events", method: "GET" }, sseRes);

/* ── 写入 beeTypes + statusCards ── */
const put1 = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 0,
  beeTypes: [
    { id: "bt-design", name: "设计蜂", capabilities: [] },
    { id: "bt-review", name: "审查蜂", capabilities: [] }
  ],
  statusCards: {
    "bt-design": { prompt: "  汇报进度  ", autoSend: true },
    "bt-review": { prompt: "审查", autoSend: false }
  }
});
eq(put1.status, 200, "PUT statusCards → 200");
eq(put1.body.doc.statusCards["bt-design"], { prompt: "汇报进度", autoSend: true }, "写路径 prompt trim 落库");
eq(put1.body.doc.statusCards["bt-review"], { prompt: "审查", autoSend: false }, "autoSend false 落库");

/* ── 不带 statusCards 的 PUT（镜头回写）→ 缺省沿用旧值 ── */
const put2 = await callRoute("PUT", "/api/dsh-hive/state", { revision: 1, camera: { theta: 1, phi: 1, dist: 20, tx: 0, tz: 0 } });
eq(put2.status, 200, "PUT 不带 statusCards → 200");
eq(put2.body.doc.statusCards["bt-design"].prompt, "汇报进度", "缺省沿用旧 statusCards");

/* ── 蜂种删除级联清理：beeTypes 替换（仅保留 bt-review）→ bt-design 的 statusCards 键被移除 ── */
const put3 = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 2,
  beeTypes: [{ id: "bt-review", name: "审查蜂", capabilities: [] }]
});
eq(put3.status, 200, "PUT 删除 bt-design → 200");
eq(put3.body.doc.statusCards["bt-design"] ?? null, null, "statusCards 中已删蜂种键被级联移除");
eq(put3.body.doc.statusCards["bt-review"], { prompt: "审查", autoSend: false }, "保留蜂种键不受影响");

/* ── 非法 statusCards → 400 结构级，文档不变更 ── */
const put4 = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 3,
  statusCards: { "bt-review": "not-object" }
});
eq(put4.status, 400, "值形状非法（字符串）→ 400");
ok(Array.isArray(put4.body.issues) && put4.body.issues.some((p) => String(p).includes("statusCards")), "400 返回字段级路径");

const put5 = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: 3,
  statusCards: { "bt-review": { prompt: "审查" } } // 缺 autoSend（strict）
});
eq(put5.status, 400, "值缺 autoSend（strict）→ 400");

/* 键数超上限 16 → 400 */
const flood = {};
for (let i = 0; i < 17; i++) flood["bt" + i] = { prompt: "p", autoSend: false };
const put6 = await callRoute("PUT", "/api/dsh-hive/state", { revision: 3, statusCards: flood });
eq(put6.status, 400, "键数超上限 16 → 400");

/* 非法提交后文档不变更（仍只有 bt-review 一条） */
const st1 = await callRoute("GET", "/api/dsh-hive/state");
eq(Object.keys(st1.body.doc.statusCards).sort(), ["bt-review"], "非法提交后 statusCards 不变更");

console.log("ALL STATUS-CARDS HOST SMOKE TESTS PASSED");
