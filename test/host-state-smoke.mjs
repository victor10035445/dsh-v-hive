/**
 * 宿主半区布局文档冒烟测试（zod 校验 + 原子写路径解析，design.md D8/7.1）。
 * 运行：node test/host-state-smoke.mjs
 */
import { parseStoredDoc, storagePath, name, inject, normalizeSummonEdges, recordSummonEdge, SUMMON_EDGES_LIMIT } from "../src/index.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

eq(name, "dsh-v-hive", "插件名");
ok(inject.includes("webServer"), "声明 webServer 注入");

/* 空文档 → 默认 */
eq(parseStoredDoc(null).positions, {}, "空文档 → 默认");
eq(parseStoredDoc("").revision, 0, "空字符串 → revision 0");

/* 合法文档 */
const good = {
  version: 1,
  revision: 3,
  positions: { "ws-1": { q: 4, r: -2 } },
  camera: { theta: 1, phi: 0.9, dist: 30, tx: 0, tz: 0 }
};
const parsed = parseStoredDoc(JSON.stringify(good));
eq(parsed.revision, 3, "合法文档保留");
eq(parsed.positions["ws-1"].q, 4, "positions 保留");
eq(parsed.camera.dist, 30, "camera 保留");

/* 损坏/超版本/坏字段 → 重建默认 */
eq(parseStoredDoc("{not json").revision, 0, "坏 JSON → 默认");
eq(parseStoredDoc(JSON.stringify({ ...good, version: 2 })).revision, 0, "超版本 → 默认");
eq(parseStoredDoc(JSON.stringify({ ...good, positions: { x: { q: "bad", r: 0 } } })).revision, 0, "坏 positions → 默认");
eq(parseStoredDoc(JSON.stringify({ ...good, camera: { theta: "x" } })).revision, 0, "坏 camera → 默认");
eq(parseStoredDoc(JSON.stringify({ version: 1, revision: -1, positions: {} })).revision, 0, "负 revision → 默认");

/* storagePath：DSH_HOME 优先、空白忽略、默认 ~/.dsh */
ok(storagePath({ DSH_HOME: "F:/custom-home" }).startsWith("F:\\custom-home") || storagePath({ DSH_HOME: "F:/custom-home" }).includes("custom-home"), "DSH_HOME 覆盖");
eq(storagePath({ DSH_HOME: "   " }).split("storages").length, 2, "空白 DSH_HOME 视为未设");
ok(storagePath({}).toLowerCase().includes(".dsh") || storagePath({}).includes("dsh"), "默认 ~/.dsh");

/* ── statusCards（bee-status-cards 2.3）：读路径宽松归一化 ── */
/* 合法键 + 悬空键（形状合法但指向已删蜂种）+ 空白 prompt（清除语义）→ 归一化 */
const scParsed = parseStoredDoc(
  JSON.stringify({
    ...good,
    beeTypes: [{ id: "bt-1", name: "设计蜂", capabilities: [] }],
    statusCards: {
      "bt-1": { prompt: "  汇报  ", autoSend: true },
      "bt-gone": { prompt: "悬空键", autoSend: false },
      "bt-blank": { prompt: "  ", autoSend: true }
    }
  })
);
eq(scParsed.statusCards["bt-1"], { prompt: "汇报", autoSend: true }, "statusCards 合法键 trim 落库");
eq(scParsed.statusCards["bt-gone"] ?? null, null, "悬空键丢弃（指向已删蜂种）");
eq(scParsed.statusCards["bt-blank"] ?? null, null, "空白 prompt 清除（丢弃）");
/* 旧文档无 statusCards → 空配置 */
eq(parseStoredDoc(JSON.stringify(good)).statusCards ?? null, null, "旧文档（无 statusCards）→ 空配置");
/* 非法 statusCards（值形状非法，如字符串/数组）→ 整档重建默认（沿用 hotbars 同等严格度） */
eq(parseStoredDoc(JSON.stringify({ ...good, statusCards: { "bt-1": "not-object" } })).revision, 0, "statusCards 值形状非法 → 文档重建");
eq(parseStoredDoc(JSON.stringify({ ...good, statusCards: [] })).revision, 0, "statusCards 数组 → 文档重建");

/* ════ summonEdges（hive-interaction-polish 2.1/2.3/2.4）：归一化 + 失效剪除 + 兼容 ════ */

/* 2.4 兼容：旧文档（无 summonEdges）读取按缺省处理、version 保持 1（无迁移） */
const legacy = parseStoredDoc(JSON.stringify(good));
eq(legacy.summonEdges ?? null, null, "旧文档无 summonEdges → 缺省（字段缺席，静默降级）");
eq(legacy.version, 1, "version 保持 1（SHALL NOT 触发迁移）");

/* 2.1 zod 强校验：形状非法 → 整档重建默认（沿用 statusCards/hotbars 同等严格度） */
eq(parseStoredDoc(JSON.stringify({ ...good, summonEdges: { "s-x": { parentId: "s-p", at: 1 }, "bad": true } })).revision, 0, "summonEdges 值形状非法 → 文档重建");
eq(parseStoredDoc(JSON.stringify({ ...good, summonEdges: [] })).revision, 0, "summonEdges 数组 → 文档重建");

/* 2.1 归一化：合法 summonEdges 原样保留 + 封顶淘汰（引擎自记账路径的数据面） */
const withEdges = parseStoredDoc(
  JSON.stringify({
    ...good,
    summonEdges: { "s-c1": { parentId: "s-p1", at: 7 }, "s-c2": { parentId: "s-p2", at: 9 } }
  })
);
eq(withEdges.revision, 3, "合法 summonEdges 不触发重建");
eq(withEdges.summonEdges["s-c1"], { parentId: "s-p1", at: 7 }, "合法条目原样落库");

/* 2.1 normalizeSummonEdges：非法条目丢弃（引擎侧 recordSummonEdge 的防守面） */
eq(normalizeSummonEdges(null) ?? null, null, "无 edges → undefined（文档无此字段）");
eq(normalizeSummonEdges("bad") ?? null, null, "形状非法 → undefined");
const dirtyEdges = normalizeSummonEdges({
  "s-ok": { parentId: "s-p", at: 1 },
  "s-noparent": { at: 2 },
  "s-empty": { parentId: "", at: 3 },
  "s-badat": { parentId: "s-p", at: "x" },
  "s-objbad": "not-object"
});
eq(Object.keys(dirtyEdges).length, 1, "非法条目丢弃（parentId/at/形状不合格式）");
eq(dirtyEdges["s-ok"], { parentId: "s-p", at: 1 }, "合法条目原样保留");

/* 2.1 封顶 512：超出按 at 淘汰最旧（SHALL NOT 拒绝召唤） */
{
  const many = {};
  for (let i = 0; i < SUMMON_EDGES_LIMIT + 88; i++) many["s-" + i] = { parentId: "s-root", at: i };
  const capped = normalizeSummonEdges(many);
  eq(Object.keys(capped).length, SUMMON_EDGES_LIMIT, "封顶 " + SUMMON_EDGES_LIMIT);
  ok(!("s-0" in capped) && !("s-87" in capped) && "s-88" in capped && "s-" + (SUMMON_EDGES_LIMIT + 87) in capped, "超出按 at 淘汰最旧（保留最新）");
}

/* 2.2 recordSummonEdge：写入新边 + 同 child 重复召唤覆盖（最新事实） */
{
  const rec = recordSummonEdge({ "s-a": { parentId: "s-p1", at: 1 } }, "s-b", "s-p2", 7);
  eq(rec["s-b"], { parentId: "s-p2", at: 7 }, "recordSummonEdge 写入新边");
  eq(rec["s-a"], { parentId: "s-p1", at: 1 }, "既有边保留");
  const rec2 = recordSummonEdge(rec, "s-b", "s-p3", 9);
  eq(rec2["s-b"], { parentId: "s-p3", at: 9 }, "同 child 重复召唤覆盖");
  const fromEmpty = recordSummonEdge(undefined, "s-c", "s-p", 3);
  eq(fromEmpty["s-c"], { parentId: "s-p", at: 3 }, "无边建档起点可用");
}

/* 2.3 失效剪除（消失 / 归档两条路径；归档 SHALL 并查 archivedSessionIds 陷阱） */
{
  const edges = {
    "s-live": { parentId: "s-root", at: 1 }, // 两端均活 → 保留
    "s-vanished": { parentId: "s-root", at: 2 }, // child 消失 → 剪
    "s-live2": { parentId: "s-gone", at: 3 }, // parent 消失 → 剪
    "s-archived": { parentId: "s-root", at: 4 }, // child 归档（仍在 sessionIds！）→ 剪
    "s-live3": { parentId: "s-archp", at: 5 } // parent 归档（仍在 sessionIds！）→ 剪
  };
  /* 储蜜层镜像语义：归档会话仍保留在 workspace sessionIds 中——仅查 sessionIds 会漏剪。
     （s-vanished / s-gone 已从镜像消失：不在 sessionIds 也不在册。） */
  const liveSessionIds = new Set(["s-root", "s-live", "s-live2", "s-archived", "s-live3", "s-archp"]);
  const scope = { liveSessionIds, archivedSessionIds: new Set(["s-archived", "s-archp"]) };
  const pruned = normalizeSummonEdges(edges, scope);
  eq(Object.keys(pruned).length, 1, "失效剪除：仅两端均活的边保留");
  eq(pruned["s-live"], { parentId: "s-root", at: 1 }, "活边原样保留");
  ok(!("s-archived" in pruned) && !("s-live3" in pruned), "归档路径剪除（并查 archivedSessionIds）");
  ok(!("s-vanished" in pruned) && !("s-live2" in pruned), "消失路径剪除（不在 sessionIds 且不在册）");

  /* 在册代理兜底：新蜂未入 sessionIds 镜像前的窗口（ctx.agents 在册）不误剪 */
  const pruned2 = normalizeSummonEdges(
    { "s-new": { parentId: "s-root", at: 1 }, "s-lost": { parentId: "s-root", at: 2 } },
    { liveSessionIds: new Set(["s-root"]), agentIds: new Set(["s-new"]) }
  );
  eq(Object.keys(pruned2).length, 1, "在册代理兜底（agentIds）不误剪新边");
  const pruned2b = normalizeSummonEdges(
    { "s-new": { parentId: "s-root", at: 1 }, "s-lost": { parentId: "s-root", at: 2 } },
    { liveSessionIds: new Set(["s-root"]), agentIds: (id) => id === "s-new" }
  );
  eq(Object.keys(pruned2b).length, 1, "agentIds 函数形（ctx.agents.get 适配）同口径");

  /* scope 缺省 = 只归一化不过滤（parseStoredDoc 读档口径：registry 语义不可得） */
  eq(Object.keys(normalizeSummonEdges(edges)).length, 5, "scope 缺省 → 不过滤");

  /* 全部失效 → undefined（宿主写入口摘除整键） */
  eq(normalizeSummonEdges({ "s-x": { parentId: "s-y", at: 1 } }, scope) ?? null, null, "全部失效 → undefined");
}

console.log("ALL HOST-STATE SMOKE TESTS PASSED");
