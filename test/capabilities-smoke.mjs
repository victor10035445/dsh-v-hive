/**
 * 能力引擎纯逻辑冒烟测试（custom-bee-types 任务 2.6）：四重门逐门场景
 * （历史标记不误触、复述不误触、同值不重燃、谓词放行/拦截）、变量捕获与
 * {A} 插值、未捕获变量拒发、前缀构造、保险丝触发。
 * 运行：node test/capabilities-smoke.mjs
 */
import {
  FUSE_LIMITS,
  applyHitsToSessionState,
  autoMessagePrefix,
  buildAutoMessage,
  captureKey,
  chainDepthOf,
  childChainDepth,
  createFuseCounters,
  evaluateBeeType,
  evaluateCapability,
  extractCaptureValues,
  fuseVerdict,
  interpolateTemplate,
  isAutoPrefixed,
  lastHandoffPayload,
  parseHandoffBlocks,
  readKeyPath,
  recordFuseAction,
  resetFuseOnUserMessage,
  resolvePredicatePath
} from "../src/capabilities.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 围栏块解析（严格格式门基础） ── */

const block = (json) => "```hive-handoff\n" + json + "\n```";
const payload = { proposal: "add-auth-system", nested: { id: "deep" } };

eq(parseHandoffBlocks("散文提及 hive-handoff 不算 " + JSON.stringify(payload)), [], "散文/复述不匹配（严格格式）");
eq(parseHandoffBlocks("```\n{}\n```"), [], "无语言标记的围栏块不匹配");
eq(parseHandoffBlocks(block("{bad json")), [], "围栏内非法 JSON 不算标记");
eq(parseHandoffBlocks(block(JSON.stringify(payload))).length, 1, "合法围栏块解析");
eq(parseHandoffBlocks("```hive-handoff\n[1,2]\n```\n" + block(JSON.stringify(payload))).length, 1, "数组载荷块被忽略、对象块保留");
eq(lastHandoffPayload("x " + block('{"a":1}') + " y " + block('{"b":2}')).payload, { b: 2 }, "多块取最后一个（尾部输出习惯）");
ok(lastHandoffPayload("no blocks").ok === false, "无块 → not ok");

ok(readKeyPath(payload, "proposal") === "add-auth-system", "键路径取值");
eq(readKeyPath(payload, "nested.id"), "deep", "嵌套键路径取值");
eq(readKeyPath(payload, "missing.x"), undefined, "路径断裂 undefined");

/* ── 捕获 ── */

const CAPTURE = { A: "proposal", B: "nested.id" };
eq(extractCaptureValues(CAPTURE, payload), { A: "add-auth-system", B: "deep" }, "捕获映射");
eq(extractCaptureValues({ A: "missing.key" }, payload), {}, "缺失键不捕获");
eq(captureValueToStringCheck(), true, "捕获值字符串化");
function captureValueToStringCheck() {
  eq(extractCaptureValues({ A: "n" }, { n: 42 }).A, "42", "数字 → 字符串");
  eq(extractCaptureValues({ A: "o" }, { o: { x: 1 } }).A, '{"x":1}', "对象 → 紧凑 JSON");
  return true;
}
eq(captureKey({ A: "x", B: "y" }), captureKey({ B: "y", A: "x" }), "闩锁键键序无关");
eq(captureKey({}), "[]", "空捕获 → 常量键");

/* ── ① 水位门：历史标记不误触 ── */

const capability = {
  id: "handoff",
  name: "交接",
  trigger: { capture: { A: "proposal" } },
  action: { type: "send", promptTemplate: "请用 /opsx:new 创建提案 {A}" },
  once: true
};
const text = block(JSON.stringify(payload));
const state0 = { vars: {}, latches: {}, watermarks: {} };

eq(evaluateCapability({ capability, text, seq: 5, sessionState: { vars: {}, latches: {}, watermarks: { handoff: 9 } } }).gate, "watermark", "seq <= 水位 → 水位门拦截（历史回合不重评）");
eq(evaluateCapability({ capability, text, seq: 9, sessionState: { vars: {}, latches: {}, watermarks: { handoff: 9 } } }).gate, "watermark", "seq == 水位 → 拦截");
eq(evaluateCapability({ capability, text, seq: 10, sessionState: { vars: {}, latches: {}, watermarks: { handoff: 9 } } }).triggered, true, "seq > 水位 → 评估放行");

/* spec 场景「历史标记不误触」：早前回合出现块，新回复无块 → 引擎不触发 */
const noBlockText = "本轮只讨论，没有交接块。";
eq(evaluateCapability({ capability, text: noBlockText, seq: 11, sessionState: state0 }).gate, "format", "新回复无块 → 格式门拦截");

/* ── ③ 严格格式门：复述约定不误触 ── */

const prose = '如果要交接，请输出 ```hive-handoff 围栏块，例如 {"proposal": "x"}。';
eq(evaluateCapability({ capability, text: prose, seq: 3, sessionState: state0 }).gate, "format", "行文中标记字样不触发（spec「复述约定不误触」）");
eq(evaluateCapability({ capability, text: '引用旧文 ' + block('{"proposal":"old"}'), seq: 3, sessionState: state0 }).triggered, true, "引用整块仍算标记（块本身合法）");

/* ── ② 值闩锁：同值不重燃 ── */

const latched = { vars: {}, latches: { handoff: [captureKey({ A: "add-auth-system" })] }, watermarks: {} };
eq(evaluateCapability({ capability, text, seq: 20, sessionState: latched }).gate, "latch", "同值闩锁拒绝重燃（spec「同值闩锁防重燃」）");
eq(evaluateCapability({ capability, text: block('{"proposal":"other-proposal"}'), seq: 20, sessionState: latched }).triggered, true, "不同值照常触发");
const onceOff = { ...capability, once: false };
eq(evaluateCapability({ capability: onceOff, text, seq: 20, sessionState: latched }).triggered, true, "once:false → 同值可重燃（配置语义）");

/* ── ④ 文件谓词：放行 / 拦截 / 未捕获变量视为不满足 ── */

const predCap = {
  id: "ready",
  name: "就绪",
  trigger: { capture: { A: "proposal" }, filePredicate: "openspec/changes/{A}/tasks.md" },
  action: { type: "send", promptTemplate: "提案 {A} 已就绪" }
};
let fsView = new Set(["openspec/changes/add-auth-system/tasks.md"]);
const fileExists = (rel) => fsView.has(rel.replace(/\\/g, "/"));
eq(evaluateCapability({ capability: predCap, text, seq: 30, sessionState: state0, fileExists }).triggered, true, "谓词文件存在 → 放行（spec「文件谓词放行」）");
fsView = new Set();
const predBlocked = evaluateCapability({ capability: predCap, text, seq: 30, sessionState: state0, fileExists });
eq(predBlocked.gate, "predicate", "谓词文件不存在 → 拦截（spec「文件不存在不放行」）");
eq(predBlocked.missingVars, undefined, "谓词拦截非变量缺失");
fsView = new Set(["anything"]);
const missingVar = evaluateCapability({ capability: { ...predCap, trigger: { capture: { A: "proposal" }, filePredicate: "dir/{Z}/file.md" } }, text, seq: 30, sessionState: state0, fileExists });
eq(missingVar.gate, "predicate", "谓词引用未捕获变量 → 不满足（审阅 F3）");
eq(missingVar.missingVars, ["Z"], "未捕获变量名随拦截返回");

/* ── 整蜂种评估：声明顺序 + blocked 状态 ── */

const beeType = {
  id: "design",
  name: "设计蜂",
  capabilities: [
    { id: "c-review", name: "审阅", trigger: { capture: {} }, action: { type: "send", promptTemplate: "继续" } },
    { id: "c-handoff", name: "交接", trigger: { capture: { A: "proposal" } }, action: { type: "spawn", promptTemplate: "孵化 {A}", targetBeeTypeId: "battle" } }
  ]
};
const multi = evaluateBeeType({ beeType, text: block('{"proposal":"p1"}'), seq: 40, sessionState: state0 });
eq(multi.hits.map((h) => h.capability.id), ["c-review", "c-handoff"], "多命中按声明顺序");
eq(multi.blocked, [], "无拦截");
const blockedEval = evaluateBeeType({ beeType, text: "plain", seq: 40, sessionState: state0 });
eq(blockedEval.hits, [], "无命中");
eq(blockedEval.blocked.map((b) => b.capability.id), ["c-review", "c-handoff"], "拦截清单（蜂卡等待状态）");
eq(blockedEval.blocked[0].gate, "format", "拦截门名");

/* 落盘补丁：水位 / 闩锁 / 变量 */
const hits = evaluateBeeType({ beeType, text: block('{"proposal":"p2"}'), seq: 50, sessionState: state0 }).hits;
const nextState = applyHitsToSessionState(state0, hits, 50);
eq(nextState.watermarks, { "c-review": 50, "c-handoff": 50 }, "水位落盘");
eq(nextState.latches["c-review"], ["[]"], "闩锁落盘（空捕获常量键）");
eq(nextState.latches["c-handoff"], [captureKey({ A: "p2" })], "闩锁落盘（捕获值键）");
eq(nextState.vars, { A: "p2" }, "变量落盘");
/* 落盘后同值再评 → 闩锁拦截；水位推进 */
const reEval = evaluateBeeType({ beeType, text: block('{"proposal":"p2"}'), seq: 51, sessionState: nextState });
eq(reEval.hits.map((h) => h.capability.id), [], "同值再评 → 全部拦截（不重燃）");

/* ── 插值 ── */

eq(interpolateTemplate("请用 /opsx:new 创建提案 {A}，负责人 {B}", { A: "add-auth-system", B: "张三" }).text, "请用 /opsx:new 创建提案 add-auth-system，负责人 张三", "{A} 插值正确（spec「捕获与插值」）");
const refused = interpolateTemplate("模板引用 {B} 但未捕获", { A: "x" });
ok(refused.ok === false && refused.missing.join() === "B", "未捕获变量拒发（spec「未捕获变量拒发」）");
eq(interpolateTemplate("字面 {{A}} 保持", { A: "x" }).text, "字面 {A} 保持", "转义还原");
ok(interpolateTemplate("坏模板 {A", {}).badTemplate === true, "坏模板 → 拒绝");

/* 谓词路径合成 */
eq(resolvePredicatePath("openspec/changes/{A}/tasks.md", { A: "p" }, "F:/repo").path, "F:/repo/openspec/changes/p/tasks.md", "cwd + 模板路径合成");
ok(resolvePredicatePath("dir/{Z}/f", {}, "F:/repo").ok === false, "未捕获变量 → 不解析");

/* ── 前缀 ── */

eq(autoMessagePrefix("设计蜂", "审阅"), "⟡设计蜂·能力：审阅", "前缀构造（spec「自动消息可辨识」）");
ok(buildAutoMessage("设计蜂", "审阅", "正文").startsWith("⟡设计蜂·能力：审阅\n\n正文"), "前缀 + 正文组装");
ok(isAutoPrefixed(buildAutoMessage("设计蜂", "审阅", "x")), "引擎消息可判别");
ok(!isAutoPrefixed("用户手打消息"), "用户消息判别为非引擎");

/* ── 保险丝 ── */

const counters = createFuseCounters();
ok(fuseVerdict(counters, FUSE_LIMITS, { sessionId: "s-1", kind: "send" }).allowed, "初态放行");
for (let i = 0; i < FUSE_LIMITS.consecutiveAutoActions; i++) recordFuseAction(counters, { sessionId: "s-1", kind: "send" });
const overConsecutive = fuseVerdict(counters, FUSE_LIMITS, { sessionId: "s-1", kind: "send" });
ok(overConsecutive.allowed === false && overConsecutive.reason === "consecutive", "连续自动动作超限 → 停链（spec「spawn 链深超限」同型保险丝）");
resetFuseOnUserMessage(counters);
ok(fuseVerdict(counters, FUSE_LIMITS, { sessionId: "s-1", kind: "send" }).allowed, "用户消息重置连续计数");

/* spawn 链深：A→B→C…逐级 +1，链深达上限的会话再孵化被拦 */
const chain = createFuseCounters();
eq(childChainDepth(chain, "a", "b"), 1, "链深 1");
eq(childChainDepth(chain, "b", "c"), 2, "链深 2");
eq(chainDepthOf(chain, "c"), 2, "链深可查");
eq(chainDepthOf(chain, "unrelated"), 0, "无链记录 → 0");
let chainTail = "c";
while (chainDepthOf(chain, chainTail) < FUSE_LIMITS.spawnChainDepth) {
  const next = chainTail + "+";
  childChainDepth(chain, chainTail, next);
  chainTail = next;
}
const overChain = fuseVerdict(chain, FUSE_LIMITS, { sessionId: chainTail, kind: "spawn" });
ok(overChain.allowed === false && overChain.reason === "chainDepth", "spawn 链深超限 → 停链并 notify（spec「spawn 链深超限」）");
ok(fuseVerdict(chain, FUSE_LIMITS, { sessionId: chainTail, kind: "send" }).allowed, "send 不受链深限制");

/* 单会话自动 spawn 次数 */
const spawnCount = createFuseCounters();
for (let i = 0; i < FUSE_LIMITS.sessionAutoSpawns; i++) recordFuseAction(spawnCount, { sessionId: "s-9", kind: "spawn" });
const overSpawns = fuseVerdict(spawnCount, FUSE_LIMITS, { sessionId: "s-9", kind: "spawn" });
ok(overSpawns.allowed === false && overSpawns.reason === "sessionSpawns", "单会话自动 spawn 次数超限 → 停链");

console.log("ALL CAPABILITIES SMOKE TESTS PASSED");
