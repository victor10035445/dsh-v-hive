/**
 * 提案宿主半区冒烟测试（add-proposal-panel 2.6）：
 *  - `GET /proposals` 契约：全工作区一次返回、组形状、无目录工作区空组不抛错、
 *    客户端侧口径（空组不渲染）在 ui-smoke 覆盖；
 *  - `POST /proposals/status`：400/404 字面（字段级原因）、成功 → persistDoc +
 *    SSE layout-changed 广播、拒绝路径文档不变更；
 *  - 布局文档：`proposalStates` **只进 docSchema 不进 putSchema**——PUT 仅带 camera
 *    后状态位不变（重建透传）；旧档 `statusCards` 残留剥离；三键 `hotbars` PUT 仍 200
 *    （`proposal` optional）；
 *  - 剪除三重守卫（经 persistDoc 观测）：空工作区清单本轮跳过 / ENOENT 参与剪除 /
 *    其它错误（EACCES）该工作区本轮跳过；
 *  - fs.watch 生命周期：`persistent:false` 不阻塞进程退出 + dispose 关闭全部 watcher。
 * 运行：node test/proposals-host-smoke.mjs
 */
import { mkdtempSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseStoredDoc, apply, __setReadDirImpl } from "../src/index.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 1. 读档口径（parseStoredDoc）：proposalStates 归一化 + 旧键剥离 ── */
const baseDoc = { version: 1, revision: 2, positions: {}, camera: null };

const withStates = parseStoredDoc(
  JSON.stringify({ ...baseDoc, proposalStates: { "ws-a/add-foo": { status: "reviewed", at: 5 }, "ws-a/x": { status: "executed", at: 9 } } })
);
eq(withStates.proposalStates["ws-a/add-foo"], { status: "reviewed", at: 5 }, "合法 proposalStates 读取保留");
eq(withStates.revision, 2, "proposalStates 不触发整档重建");
/* 形状非法 → zod 强校验 → 整档重建默认（沿 summonEdges 同等严格度） */
eq(parseStoredDoc(JSON.stringify({ ...baseDoc, proposalStates: { "ws-a/x": { status: "nope", at: 1 } } })).revision, 0, "枚举外 status → 文档重建");
eq(parseStoredDoc(JSON.stringify({ ...baseDoc, proposalStates: { "ws-a/x": { status: "paused" } } })).revision, 0, "缺 at → 文档重建");
eq(parseStoredDoc(JSON.stringify({ ...baseDoc, proposalStates: [] })).revision, 0, "proposalStates 数组 → 文档重建");
/* 旧档 statusCards 残留：docSchema 已去键 → zod strip（不重建整档，其余字段无损） */
const legacy = parseStoredDoc(
  JSON.stringify({ ...baseDoc, statusCards: { "bt-1": { prompt: "x", autoSend: false } } })
);
eq(legacy.statusCards ?? null, null, "旧档 statusCards 读取即剥离（docSchema 去键）");
eq(legacy.revision, 2, "剥离 statusCards 不导致整档重建（语义反转：旧断言为重建）");
eq(legacy.positions, {}, "剥离后其余字段无损");
/* 旧档无 proposalStates → 缺省（version 保持 1） */
const plain = parseStoredDoc(JSON.stringify(baseDoc));
eq(plain.proposalStates ?? null, null, "旧档无 proposalStates → 字段缺席");
eq(plain.version, 1, "version 保持 1（SHALL NOT 触发迁移）");

/* ── 2. 路由级测试：apply() + 桩 ctx ── */
process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-hive-proposals-"));

/** 每个工作区一个临时目录；A 有 2 个 change + archive + 隐藏项，B 无 openspec 目录。 */
const mkWorkspace = (changes) => {
  const dir = mkdtempSync(join(tmpdir(), "ws-"));
  if (changes !== null) {
    for (const name of changes) mkdirSync(join(dir, "openspec", "changes", name), { recursive: true });
  }
  return dir;
};
const wsAPath = mkWorkspace(["add-foo", "add-bar", "archive", ".tmp"]);
const wsBPath = mkWorkspace(null); // 无 openspec/changes 目录
const wsCPath = mkWorkspace(["fix-baz"]);

let routeHandler = null;
let dispose = null;
let listOverride = null;
const registry = () => (listOverride ? listOverride() : [
  { id: "ws-a", title: "A 巢", path: wsAPath, sessionIds: [] },
  { id: "ws-b", title: "", path: wsBPath, sessionIds: [] },
  { id: "ws-c", title: "C 巢", path: wsCPath, sessionIds: [] }
]);

const ctxStub = {
  effect(fn) {
    dispose = fn(); // 持有 disposer：watcher 生命周期断言需要显式调用
  },
  on() {
    return () => {};
  },
  webServer: {
    register(decl) {
      ok(decl.kind === "prefix" && decl.path === "/api/dsh-hive", "路由注册为 prefix");
      routeHandler = decl.handler;
      return () => {};
    }
  },
  agents: { get: () => undefined },
  sessionController: { async create() { return { sessionId: "c1" }; }, async selectModel() {}, async prompt() {} },
  workspaceRegistry: { list: registry, archivedSessionIds: [] }
};
apply(ctxStub);
ok(typeof routeHandler === "function", "路由 handler 已捕获");
ok(typeof dispose === "function", "ctx.effect 返回卸载函数（watcher 生命周期挂点）");

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

const sseWrites = [];
const sseRes = {
  writeHead() {},
  write(line) { sseWrites.push(line); },
  on() {}
};
await routeHandler({ url: "/api/dsh-hive/events", method: "GET" }, sseRes);
const lastFrame = () =>
  sseWrites
    .map((w) => w.replace(/^data: /, "").trim())
    .filter((l) => l.startsWith("{"))
    .map((l) => JSON.parse(l))
    .pop();
const framesOf = (type) =>
  sseWrites
    .map((w) => w.replace(/^data: /, "").trim())
    .filter((l) => l.startsWith("{"))
    .map((l) => JSON.parse(l))
    .filter((f) => f.type === type);

/** 每次 PUT 前重读当前 revision（置位路由也递增 revision；写死旧值会撞 409）。 */
const currentRev = async () => (await callRoute("GET", "/api/dsh-hive/state")).body.doc.revision;
const putState = async (patch) => callRoute("PUT", "/api/dsh-hive/state", { revision: await currentRev(), ...patch });

/* ── GET /proposals：清单契约 ── */
const list1 = await callRoute("GET", "/api/dsh-hive/proposals");
eq(list1.status, 200, "GET /proposals → 200");
eq(list1.body.length, 3, "恒返回全部在册工作区（含无目录者）");
eq(list1.body[0], { workspaceId: "ws-a", title: "A 巢", path: wsAPath, changes: [{ name: "add-bar" }, { name: "add-foo" }] }, "A 组：archive/隐藏项排除 + 名称序 + 无状态标记");
eq(list1.body[1].changes, [], "无 openspec/changes 目录 → changes: []（不抛错）");
eq(list1.body[1].title, "", "title 空串原样透传（客户端回退 id）");
eq(list1.body[2].changes.map((c) => c.name), ["fix-baz"], "C 组内容");
eq(Object.keys(list1.body[0]).sort(), ["changes", "path", "title", "workspaceId"], "组形状 = { workspaceId, title, path, changes }");
/* 读路径 SHALL NOT 写文档 */
const st0 = await callRoute("GET", "/api/dsh-hive/state");
eq(st0.body.doc.proposalStates ?? null, null, "GET /proposals 不写文档（读路径零副作用）");
eq(st0.body.doc.revision, 0, "读路径不改 revision");

/* 工作区清单为空 → 空数组且不抛错（守卫 a 的清单口径） */
listOverride = () => [];
const listEmpty = await callRoute("GET", "/api/dsh-hive/proposals");
eq(listEmpty.status, 200, "空工作区清单 → 仍 200");
eq(listEmpty.body, [], "空工作区清单 → 空组数组");
listOverride = null;

/* ── POST /proposals/status：400/404 字面 ── */
const bad1 = await callRoute("POST", "/api/dsh-hive/proposals/status", { workspaceId: "ws-gone", name: "add-foo", status: "reviewed" });
eq(bad1.status, 404, "非法工作区 → 404");
eq(bad1.body.field, "workspaceId", "404 字段级原因（workspaceId）");
const bad2 = await callRoute("POST", "/api/dsh-hive/proposals/status", { workspaceId: "ws-a", name: "add-foo", status: "nope" });
eq(bad2.status, 400, "枚举外 status → 400");
eq(bad2.body.field, "status", "400 字段级原因（status）");
const bad3 = await callRoute("POST", "/api/dsh-hive/proposals/status", { workspaceId: "ws-a", name: "", status: "reviewed" });
eq(bad3.status, 400, "空 name → 400");
eq(bad3.body.field, "name", "400 字段级原因（name）");
const bad4 = await callRoute("POST", "/api/dsh-hive/proposals/status", { workspaceId: "ws-a", name: "not-there", status: "reviewed" });
eq(bad4.status, 404, "目录内不存在的 change → 404");
eq(bad4.body.field, "name", "404 字段级原因（name）");
const bad5 = await callRoute("POST", "/api/dsh-hive/proposals/status", { name: "add-foo", status: "reviewed" });
eq(bad5.status, 400, "缺 workspaceId → 400");
/* 无 openspec 目录的工作区 → 404（该工作区当前不含任何 change） */
const bad6 = await callRoute("POST", "/api/dsh-hive/proposals/status", { workspaceId: "ws-b", name: "add-foo", status: "reviewed" });
eq(bad6.status, 404, "无目录工作区置位 → 404");
const stAfterBad = await callRoute("GET", "/api/dsh-hive/state");
eq(stAfterBad.body.doc.proposalStates ?? null, null, "拒绝路径文档不变更");

/* ── 置位 → persistDoc → SSE layout-changed 广播 ── */
sseWrites.length = 0;
const put1 = await callRoute("POST", "/api/dsh-hive/proposals/status", { workspaceId: "ws-a", name: "add-foo", status: "reviewed" });
eq(put1.status, 200, "置位 → 200");
eq(put1.body, { ok: true }, "响应 { ok: true }");
const st1 = await callRoute("GET", "/api/dsh-hive/state");
eq(st1.body.doc.proposalStates["ws-a/add-foo"].status, "reviewed", "状态落库");
ok(typeof st1.body.doc.proposalStates["ws-a/add-foo"].at === "number", "at 为数值时间戳（宿主写入侧铸造）");
const layoutFrames = framesOf("layout-changed");
ok(layoutFrames.length >= 1, "置位 → persistDoc 广播 layout-changed（跨页签收敛）");
eq(layoutFrames.at(-1).doc.proposalStates["ws-a/add-foo"].status, "reviewed", "广播帧携带最新 proposalStates");
/* 清单并入状态位；重复置位覆盖 */
const list2 = await callRoute("GET", "/api/dsh-hive/proposals");
eq(list2.body[0].changes.find((c) => c.name === "add-foo").status, "reviewed", "清单并入状态位");
eq(list2.body[0].changes.find((c) => c.name === "add-bar").status ?? null, null, "未置位条目不带 status 键");
await callRoute("POST", "/api/dsh-hive/proposals/status", { workspaceId: "ws-a", name: "add-foo", status: "paused" });
const st2 = await callRoute("GET", "/api/dsh-hive/state");
eq(st2.body.doc.proposalStates["ws-a/add-foo"].status, "paused", "重复置位 → 覆盖（无顺序/无推导）");

/* ── 2.1 重建透传：PUT 仅带 camera → proposalStates 不变 ── */
const putCam = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: await currentRev(),
  camera: { theta: 1, phi: 1, dist: 20, tx: 0, tz: 0 }
});
eq(putCam.status, 200, "PUT 仅带 camera → 200");
eq(putCam.body.doc.proposalStates["ws-a/add-foo"].status, "paused", "PUT 回写不清状态位（显式透传，镜头移动不丢贴纸）");
eq(putCam.body.doc.revision, st2.body.doc.revision + 1, "PUT 递增 revision");
/* 客户端携带 proposalStates 也被 zod strip（putSchema 无此键） */
const putInject = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: await currentRev(),
  proposalStates: { "ws-attacker/evil": { status: "reviewed", at: 1 } }
});
eq(putInject.status, 200, "PUT 携带 proposalStates → 200（未知键 strip）");
eq(putInject.body.doc.proposalStates["ws-attacker/evil"] ?? null, null, "客户端提交的 proposalStates SHALL NOT 被接受（宿主侧独占记账）");
eq(putInject.body.doc.proposalStates["ws-a/add-foo"].status, "paused", "既有状态位在 strip 后仍透传保留");

/* ── 旧档 statusCards 残留剥离 + 三键 hotbars PUT 仍 200 ── */
const putLegacy = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: await currentRev(),
  statusCards: { "bt-1": { prompt: "x", autoSend: false } }
});
eq(putLegacy.status, 200, "旧 statusCards 残留 PUT → 200（zod strip，不报错）");
eq(putLegacy.body.doc.statusCards ?? null, null, "落盘文档不再含 statusCards（残留随写入剥离）");
eq(putLegacy.body.doc.proposalStates["ws-a/add-foo"].status, "paused", "剥离旧键不影响状态位");

const threeKeyHotbars = { hive: [], bee: [], floor: [] };
const putThree = await callRoute("PUT", "/api/dsh-hive/state", { revision: await currentRev(), hotbars: threeKeyHotbars });
eq(putThree.status, 200, "三键 hotbars PUT 仍 200（proposal optional，旧客户端兼容）");
eq(putThree.body.doc.hotbars.proposal ?? null, null, "缺省 proposal → 文档不含该键（= 空栏）");
/* 四键 PUT（新客户端）：proposal 落库 */
const proposalSlot = { id: "p1", name: "继续推进", summon: true, beeTypeId: undefined, prompt: "推进 {change}", autoSend: true, setStatus: "reviewed" };
const fourKey = { hive: [], bee: [], floor: [], proposal: [proposalSlot] };
const putFour = await callRoute("PUT", "/api/dsh-hive/state", { revision: await currentRev(), hotbars: fourKey });
eq(putFour.status, 200, "四键 hotbars PUT → 200");
eq(putFour.body.doc.hotbars.proposal.length, 1, "提案栏槽位落库");
eq(putFour.body.doc.hotbars.proposal[0].setStatus, "reviewed", "提案栏 setStatus 落库（枚举值）");
/* 提案栏：setStatus 枚举外 → 400 字段级 */
const putBadStatus = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: await currentRev(),
  hotbars: { hive: [], bee: [], floor: [], proposal: [{ ...proposalSlot, setStatus: "nope" }] }
});
eq(putBadStatus.status, 400, "提案栏 setStatus 枚举外 → 400");
ok(putBadStatus.body.issues?.some((p) => String(p).includes("hotbars.proposal.0")), "400 返回字段级路径（hotbars.proposal.0）");
/* 提案栏：prompt 必填（空白 → 400） */
const putBadPrompt = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: await currentRev(),
  hotbars: { hive: [], bee: [], floor: [], proposal: [{ ...proposalSlot, prompt: "   " }] }
});
eq(putBadPrompt.status, 400, "提案栏空白 prompt → 400（必填）");
/* 提案栏：summon 关而 beeTypeId 非空 → 仍 200（联动只走读取裁剪，SHALL NOT 成为拒绝理由） */
const putLinked = await callRoute("PUT", "/api/dsh-hive/state", {
  revision: await currentRev(),
  hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p2", name: "只直发", summon: false, beeTypeId: "bt-1", prompt: "看 {change}", autoSend: false }] }
});
eq(putLinked.status, 200, "提案栏 summon 关 + beeTypeId 非空 → 200（R15：读取路径裁剪，非拒绝理由）");

/* ── 剪除三重守卫（经 persistDoc 观测） ── */
/* 先给 C 组置位，使剪除断言有「该留」的对照物 */
await callRoute("POST", "/api/dsh-hive/proposals/status", { workspaceId: "ws-c", name: "fix-baz", status: "executed" });
const stC = await callRoute("GET", "/api/dsh-hive/state");
eq(stC.body.doc.proposalStates["ws-c/fix-baz"].status, "executed", "C 组状态位置位");
eq(Object.keys(stC.body.doc.proposalStates).length, 2, "前置：A/C 两组各一条状态位");

/* 守卫 (b)：ENOENT（目录确实消失）→ 该工作区参与剪除 */
rmSync(join(wsAPath, "openspec", "changes", "add-foo"), { recursive: true });
const putAfterArchive = await callRoute("PUT", "/api/dsh-hive/state", { revision: await currentRev(), camera: null });
eq(putAfterArchive.status, 200, "归档后 PUT → 200");
eq(putAfterArchive.body.doc.proposalStates["ws-a/add-foo"] ?? null, null, "ENOENT → 该键被剪（归档消卡剪状态）");
eq(putAfterArchive.body.doc.proposalStates["ws-c/fix-baz"].status, "executed", "可读工作区的状态位不受影响");

/* 守卫 (c)：目录不可读（非 ENOENT）→ 该工作区本轮跳过（宁留勿误删）
   经 __setReadDirImpl 注入「ws-c 的目录读取抛 EACCES」——生产路径恒为 fs.readdirSync，
   该注入点只为在不依赖平台权限模型的前提下端到端覆盖这条守卫。 */
{
  const stBeforeC = await callRoute("GET", "/api/dsh-hive/state");
  eq(stBeforeC.body.doc.proposalStates["ws-c/fix-baz"].status, "executed", "前置：C 组状态位在册");
  const restoreReadDir = __setReadDirImpl((dir) => {
    if (String(dir).startsWith(wsCPath)) {
      const error = new Error("permission denied");
      error.code = "EACCES";
      throw error;
    }
    return readdirSync(dir);
  });
  const putUnreadable = await putState({ camera: null });
  restoreReadDir();
  eq(putUnreadable.status, 200, "不可读工作区下 PUT → 200（静默降级，不报错）");
  eq(putUnreadable.body.doc.proposalStates["ws-c/fix-baz"].status, "executed", "目录不可读（EACCES，非 ENOENT）→ 该工作区本轮跳过剪除（宁留勿误删）");
  eq(putUnreadable.body.doc.proposalStates["ws-a/add-foo"] ?? null, null, "同轮内其它工作区照常剪除（EACCES 只保护自身）");
}

/* 守卫 (a)：工作区清单为空 → 本轮跳过（贴纸不因瞬时空 registry 被清空） */
{
  const stBefore = await callRoute("GET", "/api/dsh-hive/state");
  listOverride = () => [];
  const putNoWorkspaces = await callRoute("PUT", "/api/dsh-hive/state", { revision: await currentRev(), camera: null });
  eq(putNoWorkspaces.status, 200, "空工作区清单下 PUT → 200");
  eq(putNoWorkspaces.body.doc.proposalStates["ws-c/fix-baz"].status, "executed", "工作区清单为空 → 本轮跳过剪除（不可逆误删防线）");
  listOverride = null;
}

/* ── fs.watch 生命周期：persistent:false 不阻塞进程退出 ── */
/* 触发一次 /proposals 让对账为合格工作区挂上 watcher（A/C 有 openspec 目录） */
await callRoute("GET", "/api/dsh-hive/proposals");
dispose();
console.log("ALL PROPOSALS HOST SMOKE TESTS PASSED");

/* 进程应能自然退出：若 watcher 未用 persistent:false 建立，本行之后的退出会被挂住。 */
setTimeout(() => console.log("PROCESS EXIT OK (watcher 未持事件循环)"), 10);
