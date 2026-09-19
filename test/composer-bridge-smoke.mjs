/**
 * 幻影桥 + 蜂栏直发 bundle 级冒烟测试（context-hotbar-rework 改造自
 * quick-commands-bridge-smoke：saveCommands→PUT 断言随拆除移除，composer 桥 /
 * 浮窗 / api.sendCommand 断言保留）。在 factory-smoke 同款沙箱里执行
 * lib/client.js 懒 CJS 工厂，验证——
 *  - 幻影桥当帧镜像：渲染 conversation.composer.dock 桥条目（props 变化即镜像、
 *    卸载清桥）；composer.dock 槽位已注册；
 *  - 草稿通道 appendViaBridge：立即命中 / 延迟收敛（召唤链轮询）/ 超时放弃 /
 *    非 plain phase 拒绝；
 *  - 召唤种子通道 seedSummonDraft：binding 就绪种子 / 追加语义 / 永不就绪超时；
 *  - api.sendCommand（mock fetch）：成功/失败返回形状（蜂栏直发通道）。
 * 运行：node test/composer-bridge-smoke.mjs（先 node build.mjs）
 */
import { readFileSync } from "node:fs";

const code = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── React 桩：hooks 足以驱动被测组件（ComposerBridgeEntry 只用 useRef/useEffect） ── */
const effectCleanups = [];
const react = {
  useState: (init) => [typeof init === "function" ? init() : init, () => {}],
  useEffect: (fn) => {
    const cleanup = fn();
    if (typeof cleanup === "function") effectCleanups.push(cleanup);
  },
  useLayoutEffect: () => {},
  useRef: (init) => ({ current: init }),
  useMemo: (fn) => fn(),
  createElement: (type, props) => ({ type, props }),
  forwardRef: (fn) => fn,
  StrictMode: function StrictMode() {}
};
react.default = react;
const jsxRuntime = {
  Fragment: Symbol.for("react.fragment"),
  jsx: (type, props) => ({ type, props }),
  jsxs: (type, props) => ({ type, props }),
  jsxDEV: (type, props) => ({ type, props })
};

/* ── mock fetch：/state GET 供控制器启动拉取；/send 直发 ── */
const fetchCalls = [];
let sendResponse = { status: 200, body: { ok: true } };
async function fetchStub(url, opts = {}) {
  const method = opts.method ?? "GET";
  fetchCalls.push({ url, method, body: opts.body ? JSON.parse(opts.body) : null });
  const respond = (status, data) => ({ ok: status < 400, status, json: async () => data });
  if (url === "/api/dsh-hive/state" && method === "GET") {
    return respond(200, { doc: { version: 1, revision: 7, positions: {}, camera: null } });
  }
  if (url === "/api/dsh-hive/send" && method === "POST") {
    return respond(sendResponse.status, sendResponse.body);
  }
  return respond(404, { error: "unknown route" });
}

/* ── 沙箱与桩 ctx（factory-smoke 同款） ── */
const registered = [];
const effects = [];
const fakeElement = () => ({
  dataset: {},
  style: { setProperty() {}, removeProperty() {}, toggle() {} },
  classList: { toggle() {}, add() {}, remove() {} },
  textContent: "",
  innerHTML: "",
  type: "",
  children: [],
  addEventListener() {},
  removeEventListener() {},
  appendChild() {},
  remove() {},
  querySelector: () => null,
  querySelectorAll: () => [],
  setAttribute() {},
  isConnected: false
});
const documentStub = {
  head: { appendChild() {} },
  body: { appendChild() {}, observe() {}, contains() { return false; } },
  createElement: fakeElement,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
  removeEventListener() {},
  visibilityState: "visible"
};
const windowStub = {
  addEventListener() {},
  removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  innerWidth: 1920,
  devicePixelRatio: 1,
  EventSource: undefined,
  __ModuleLoader__: null
};
const ctxStub = {
  effect(fn, label) {
    effects.push(label ?? "<anonymous>");
    const disposer = fn();
    return () => disposer?.();
  },
  locale: {
    register() {},
    bind() {
      return (key) => key;
    }
  },
  slots: {
    inject(name, cb) {
      cb();
    },
    register(decl, Component) {
      registered.push({ decl, Component });
    }
  },
  sessions: undefined,
  workspaces: undefined
};
const sandbox = {
  window: windowStub,
  document: documentStub,
  localStorage: { getItem: () => null, setItem() {} },
  performance,
  requestAnimationFrame: (cb) => setTimeout(() => cb(0), 0),
  cancelAnimationFrame: (id) => clearTimeout(id),
  navigator: { userAgent: "smoke", hardwareConcurrency: 8 },
  location: { href: "http://localhost/" },
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  URL,
  URLSearchParams,
  Event: class Event {},
  fetch: fetchStub,
  AbortController,
  ResizeObserver: class ResizeObserver { observe() {} disconnect() {} unobserve() {} },
  MutationObserver: class MutationObserver { observe() {} disconnect() {} },
  HTMLElement: class HTMLElement {},
  HTMLTextAreaElement: class HTMLTextAreaElement {},
  Element: class Element {},
  Node: class Node {},
  queueMicrotask
};

let moduleExports = null;
windowStub.__ModuleLoader__ = {
  load({ factory }) {
    const require = (specifier) => {
      const modules = {
        react,
        "react/jsx-runtime": jsxRuntime,
        "react-dom": { createPortal: (children) => children, flushSync: (fn) => fn?.() },
        "@deepseek-ai/dsh-client-store": {
          defineStore: (decl) => ({ __store: true, decl })
        },
        /* 官方 primitives（页头设置图标 IconSettingsOutline16） */
        "@deepseek-ai/dsh-client-ui-primitives": {
          IconSettingsOutline16: () => null
        }
      };
      if (!(specifier in modules)) throw new Error("unexpected external require: " + specifier);
      return modules[specifier];
    };
    moduleExports = factory(require);
  }
};

new Function(
  "window", "document", "localStorage", "performance", "requestAnimationFrame", "cancelAnimationFrame",
  "navigator", "location", "console", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
  "URL", "URLSearchParams", "Event", "fetch", "AbortController", "ResizeObserver", "MutationObserver",
  "HTMLElement", "HTMLTextAreaElement", "Element", "Node", "queueMicrotask", code
)(
  sandbox.window, sandbox.document, sandbox.localStorage, sandbox.performance, sandbox.requestAnimationFrame,
  sandbox.cancelAnimationFrame, sandbox.navigator, sandbox.location, sandbox.console, sandbox.setTimeout,
  sandbox.clearTimeout, sandbox.setInterval, sandbox.clearInterval, sandbox.URL, sandbox.URLSearchParams,
  sandbox.Event, sandbox.fetch, sandbox.AbortController, sandbox.ResizeObserver, sandbox.MutationObserver,
  sandbox.HTMLElement, sandbox.HTMLTextAreaElement, sandbox.Element, sandbox.Node, sandbox.queueMicrotask
);

ok(moduleExports, "工厂产出 exports");
moduleExports.apply(ctxStub);

/* ── 幻影桥：conversation.composer.dock 注册 + 当帧镜像 + 卸载清桥 ── */
const bridgeEntry = registered.find((r) => r.decl.name === "conversation.composer.dock" && r.decl.id === "v-hive-bridge");
ok(bridgeEntry, "conversation.composer.dock 桥条目已注册");
const bridge = moduleExports.composerBridge;
ok(bridge && typeof bridge.subscribe === "function", "composerBridge 观测面导出");

const inputActionsA = { setDraft() {} };
bridgeEntry.Component({
  session: { sessionId: "s-1" },
  input: { draft: "已有草稿", phase: "plain" },
  inputActions: inputActionsA
});
eq(bridge.sessionId, "s-1", "镜像① sessionId 当帧写入");
eq(bridge.phase, "plain", "镜像① phase 当帧写入");
eq(bridge.inputActions, inputActionsA, "镜像① inputActions 当帧写入");
eq(bridge.input?.draft, "已有草稿", "镜像① input 当帧写入");

/* 当帧性：props 变化即镜像（不依赖任何订阅时机） */
bridgeEntry.Component({
  session: { sessionId: "s-2" },
  input: { draft: "更替草稿", phase: "adjudicating" },
  inputActions: null
});
eq(bridge.sessionId, "s-2", "镜像② sessionId 随当帧更新");
eq(bridge.phase, "adjudicating", "镜像② phase 随当帧更新");
eq(bridge.inputActions, null, "镜像② inputActions 缺失 → null");

/* 非 plain phase（桥禁用依据）+ 卸载清桥 */
for (const cleanup of effectCleanups.splice(0)) cleanup();
eq(bridge.sessionId, null, "卸载清桥：sessionId 置空");
eq(bridge.inputActions, null, "卸载清桥：inputActions 置空");
eq(bridge.phase, "plain", "卸载清桥：phase 复位 plain");

/* ── 草稿通道 appendViaBridge（召唤链回归：有界轮询等待桥收敛） ── */
const { appendViaBridge } = moduleExports;

/* ① 立即命中：桥已在目标会话 → 当帧追加（追加语义：非空草稿换行拼接） */
const drafted = [];
bridgeEntry.Component({
  session: { sessionId: "s-1" },
  input: { draft: "已有草稿", phase: "plain" },
  inputActions: { setDraft: (d) => drafted.push(d) }
});
ok(await appendViaBridge("s-1", "新指令"), "① 桥已在目标会话 → 立即追加成功");
eq(drafted, ["已有草稿\n新指令"], "① 追加语义：非空草稿换行拼接");
for (const cleanup of effectCleanups.splice(0)) cleanup(); // 清桥

/* ② 延迟收敛：新召唤会话当帧不可达（桥 sessionId=null），宿主 composer 稍后
   挂载新会话 → 轮询窗口内命中并追加（单帧重试时代此处静默丢词） */
let slowDraft = null;
const slowPromise = appendViaBridge("s-new", "预设提示词");
await new Promise((resolve) => setTimeout(resolve, 30)); // 数帧皆 miss
ok(bridge.sessionId === null, "② 前置：桥尚未收敛");
bridgeEntry.Component({
  session: { sessionId: "s-new" },
  input: { draft: "", phase: "plain" },
  inputActions: { setDraft: (d) => { slowDraft = d; } }
});
ok(await slowPromise, "② 轮询窗口内桥收敛 → 追加成功");
eq(slowDraft, "预设提示词", "② 空草稿直接填入预设提示词");
for (const cleanup of effectCleanups.splice(0)) cleanup();

/* ③ 超时放弃：桥永不收敛 → 返回 false（调用方显式提示），且不写草稿 */
let neverDraft = null;
bridgeEntry.Component({
  session: { sessionId: "s-other" },
  input: { draft: "", phase: "plain" },
  inputActions: { setDraft: (d) => { neverDraft = d; } }
});
ok((await appendViaBridge("s-elsewhere", "x", 60)) === false, "③ 超时未收敛 → false");
eq(neverDraft, null, "③ 超时路径不触碰他蜂草稿");
for (const cleanup of effectCleanups.splice(0)) cleanup();

/* ④ 非 plain phase 拒绝：busy 输入区不接受草稿 */
bridgeEntry.Component({
  session: { sessionId: "s-busy" },
  input: { draft: "", phase: "adjudicating" },
  inputActions: { setDraft: () => { throw new Error("不应写入"); } }
});
ok((await appendViaBridge("s-busy", "x", 60)) === false, "④ 非 plain phase → 拒绝");
for (const cleanup of effectCleanups.splice(0)) cleanup();

/* ── 召唤种子通道 seedSummonDraft（blank 期 dock 桥结构性缺席的主通道） ── */
const { seedSummonDraft } = moduleExports;

/* ⑤ binding 未就绪 → 轮询等待；宿主名单收录（conversation 服务可解析）后种子成功 */
const seededDrafts = [];
const shellStub = {
  snapshot: { draft: "" },
  setDraft: (text) => seededDrafts.push(text)
};
let shellReady = false;
ctxStub.conversation = {
  input: {
    shell(id) {
      if (!shellReady) throw new Error(`conversation.input: session "${id}" resolved no binding`);
      return shellStub;
    }
  }
};
setTimeout(() => { shellReady = true; }, 150);
const seedStart = Date.now();
ok(await seedSummonDraft("s-summon", "预设提示词", 2000), "⑤ binding 就绪后种子成功");
eq(seededDrafts, ["预设提示词"], "⑤ 空草稿直接填入预设提示词");
ok(Date.now() - seedStart >= 140, "⑤ 确实经历了轮询等待（非首帧命中）");

/* ⑥ 非空草稿追加语义 + 立即命中（binding 已就绪） */
shellStub.snapshot.draft = "已有草稿";
ok(await seedSummonDraft("s-summon", "再补一条", 100), "⑥ binding 已就绪 → 立即种子");
eq(seededDrafts[1], "已有草稿\n再补一条", "⑥ 追加语义：换行拼接");

/* ⑦ binding 永不就绪 → 超时 false（调用方回落桥通道/提示） */
shellReady = false;
ok((await seedSummonDraft("s-never", "x", 120)) === false, "⑦ binding 永不就绪 → 超时 false");

/* ── shell.overlay 页面条目注册面（道具栏/模态宿主；保存链路断言随拆除移除） ── */
const pageEntry = registered.find((r) => r.decl.name === "shell.overlay" && r.decl.id === "v-hive-page");
ok(pageEntry, "shell.overlay 页面条目已注册");
const storeActionsStub = {
  setFullscreen() {}, toggleLegend() {}, clearToast() {}, notify() {}, setSettings() {},
  openFloat() {}, closeFloat() {}
};
const face = pageEntry.decl.inject(storeActionsStub);
ok(typeof face.ctl === "function", "注入面暴露 ctl");

await new Promise((resolve) => setTimeout(resolve, 0)); // 控制器启动 fetchState（微任务）先落地

/* ── api.sendCommand（mock fetch）：成功 / 失败返回形状（蜂栏直发通道） ── */
globalThis.fetch = fetchStub;
const { sendCommand } = await import("../src/api.mjs");
sendResponse = { status: 200, body: { ok: true } };
const sentOk = await sendCommand("s-live", "跑一遍测试");
ok(sentOk.ok === true, "sendCommand 成功 → { ok: true }");
const sendCall = fetchCalls.find((c) => c.url === "/api/dsh-hive/send");
eq(sendCall.body, { sessionId: "s-live", prompt: "跑一遍测试" }, "send POST 请求体 { sessionId, prompt }");

sendResponse = { status: 404, body: { error: "session has no live agent" } };
const sentFail = await sendCommand("s-gone", "x");
ok(sentFail.ok === false && sentFail.error === "session has no live agent", "sendCommand 失败 → { ok: false, error }（不抛错）");

globalThis.fetch = async () => {
  throw new TypeError("offline");
};
const sentOffline = await sendCommand("s-live", "x");
ok(sentOffline.ok === false && typeof sentOffline.error === "string", "网络异常 → { ok: false, error }（静默路径）");

console.log("ALL COMPOSER BRIDGE SMOKE TESTS PASSED");
