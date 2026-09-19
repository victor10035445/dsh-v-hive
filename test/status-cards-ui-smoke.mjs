/**
 * 状态卡片 UI 冒烟测试（bee-status-cards 3.4/4.5/5.5）：factory-smoke /
 * hotbars-ui-smoke 同款沙箱里执行 lib/client.js 懒 CJS 工厂，直测导出的
 * StatusBar 与 StatusCardsSection 组件：
 *  - StatusBar：逐蜂种卡 + 默认蜂末位卡、完成数、已配置卡显示发送按钮、未配置与
 *    默认蜂无按钮、空池禁用态（title「暂无完成蜂」）、点卡体循环选蜂链路
 *    （clearSelection + selectBee，稳定序）；
 *  - StatusCardsSection：蜂种列表 + 默认蜂灰置行、选中展开 prompt/autoSend/清除。
 * 运行：node test/status-cards-ui-smoke.mjs（先 node build.mjs）
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

/* ── React 桩（hotbars-ui 同款）：useState/useRef 跨调用保持、useEffect 立即执行、useSyncExternalStore 直读快照 ── */
let hookCells = [];
let hookIndex = 0;
const react = {
  useState: (init) => {
    const i = hookIndex++;
    if (!hookCells[i]) hookCells[i] = { value: typeof init === "function" ? init() : init };
    const cell = hookCells[i];
    return [cell.value, (next) => { cell.value = typeof next === "function" ? next(cell.value) : next; }];
  },
  useRef: (init) => {
    const i = hookIndex++;
    if (!hookCells[i]) hookCells[i] = { value: init };
    return hookCells[i];
  },
  useEffect: (fn) => { fn(); },
  useLayoutEffect: () => {},
  useMemo: (fn) => fn(),
  useSyncExternalStore: (subscribe, getSnapshot) => getSnapshot(),
  createElement: (type, props) => ({ type, props }),
  forwardRef: (fn) => fn
};
react.default = react;
const jsxRuntime = {
  Fragment: Symbol.for("react.fragment"),
  jsx: (type, props) => ({ type, props }),
  jsxs: (type, props) => ({ type, props }),
  jsxDEV: (type, props) => ({ type, props })
};

/* ── 沙箱（hotbars-ui 同款） ── */
const listeners = new Set();
const registered = [];
const windowStub = {
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  innerWidth: 1920, devicePixelRatio: 1, EventSource: undefined, __ModuleLoader__: null
};
const fakeElement = () => ({
  dataset: {}, style: { setProperty() {}, removeProperty() {}, toggle() {} },
  classList: { toggle() {}, add() {}, remove() {} }, textContent: "", innerHTML: "",
  type: "", children: [], addEventListener() {}, removeEventListener() {}, appendChild() {},
  remove() {}, querySelector: () => null, querySelectorAll: () => [], setAttribute() {}, isConnected: false
});
const documentStub = {
  head: { appendChild() {} }, body: { appendChild() {}, observe() {}, contains() { return false; } },
  createElement: fakeElement, querySelector: () => null, querySelectorAll: () => [],
  addEventListener() {}, removeEventListener() {}, visibilityState: "visible"
};
const ctxStub = {
  effect(fn, label) { const d = fn(); return () => d?.(); },
  locale: { register() {}, bind() { return (key) => key; } },
  slots: { inject(name, cb) { cb(); }, register(decl, Component) { registered.push({ decl, Component }); } },
  sessions: undefined, workspaces: undefined, uiWorkspace: undefined
};
const sandbox = {
  window: windowStub, document: documentStub,
  localStorage: { getItem: () => null, setItem() {} },
  performance, requestAnimationFrame: () => 0, cancelAnimationFrame() {},
  navigator: { userAgent: "smoke", hardwareConcurrency: 8 }, location: { href: "http://localhost/" },
  console, setTimeout, clearTimeout, setInterval, clearInterval, URL, URLSearchParams,
  Event: class Event {}, fetch: async () => ({ ok: true, status: 200, json: async () => ({ doc: { version: 1, revision: 0, positions: {}, camera: null } }) }),
  AbortController, ResizeObserver: class ResizeObserver { observe() {} disconnect() {} unobserve() {} },
  MutationObserver: class MutationObserver { observe() {} disconnect() {} },
  HTMLElement: class HTMLElement {}, HTMLTextAreaElement: class HTMLTextAreaElement {},
  Element: class Element {}, Node: class Node {}, queueMicrotask
};

let m = null;
windowStub.__ModuleLoader__ = {
  load({ factory }) {
    const require = (specifier) => {
      const modules = {
        react,
        "react/jsx-runtime": jsxRuntime,
        "react-dom": { createPortal: (c) => c, flushSync: (fn) => fn?.() },
        "@deepseek-ai/dsh-client-store": {
          defineStore: (decl) => {
            let state = null;
            return {
              spec: decl, create() {
                if (state === null) state = Object.freeze(decl.init());
                return {
                  getSnapshot: () => state,
                  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
                  actions: Object.fromEntries(Object.entries(decl.actions).map(([name, fn]) => [name, (...args) => { const draft = JSON.parse(JSON.stringify(state)); const returned = fn(draft, ...args); state = Object.freeze(returned ?? draft); for (const l of [...listeners]) l(); }]))
                };
              }
            };
          }
        },
        "@deepseek-ai/dsh-client-ui-primitives": { IconSettingsOutline16: () => null }
      };
      if (!(specifier in modules)) throw new Error("unexpected external require: " + specifier);
      return modules[specifier];
    };
    m = factory(require);
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

ok(m, "工厂产出 exports");

function render(el, depth = 0) {
  if (depth > 32) throw new Error("render depth exceeded");
  if (el === null || el === undefined || typeof el === "boolean") return null;
  if (typeof el === "string" || typeof el === "number") return String(el);
  if (Array.isArray(el)) return el.map((e) => render(e, depth + 1)).filter((x) => x !== null);
  if (typeof el.type === "function") return render(el.type(el.props ?? {}), depth + 1);
  return { tag: el.type, props: el.props ?? {}, children: render(el.props?.children, depth + 1) };
}
function collect(node, predicate, out = []) {
  if (node === null || node === undefined) return out;
  if (Array.isArray(node)) { for (const child of node) collect(child, predicate, out); return out; }
  if (typeof node === "object" && node.tag !== undefined) {
    if (predicate(node)) out.push(node);
    collect(node.children, predicate, out);
  }
  return out;
}
const textOf = (node) => {
  if (node === null || node === undefined) return "";
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "string") return node;
  if (typeof node === "object" && node.tag !== undefined) return textOf(node.children);
  return "";
};

const { StatusBar, StatusCardsSection } = m;
const t = (key) => key;

/* ── StatusCardsSection（5.1/5.5） ── */
const beeTypes = [{ id: "bt-design", name: "设计蜂" }, { id: "bt-review", name: "审查蜂" }];
let selected = null, patched = null, cleared = null;
hookCells = []; hookIndex = 0;
const sec = render(
  StatusCardsSection({
    t, beeTypes,
    statusDraft: { "bt-design": { prompt: "开会", autoSend: true } },
    selected: null,
    onSelect: (id) => { selected = id; },
    onPatch: (id, p) => { patched = [id, p]; },
    onClear: (id) => { cleared = id; }
  })
);
const secRows = collect(sec, (n) => String(n.props.className ?? "").includes("jyv-qcRow") && typeof n.props.onClick === "function");
eq(secRows.length, 3, "列表 = beeTypes 镜像序（2）+ 默认蜂灰置行（1）");
ok(String(secRows[2].props.className).includes("jyv-hbStatusDefaultRow"), "默认蜂行灰置");
ok(textOf(sec).includes("hive.hb.status.defaultRow"), "默认蜂行呈现「不可配置」说明");
secRows[0].props.onClick();
eq(selected, "bt-design", "点选蜂种 → onSelect 回调");

hookCells = []; hookIndex = 0;
const sec2 = render(
  StatusCardsSection({
    t, beeTypes,
    statusDraft: { "bt-design": { prompt: "开会", autoSend: true } },
    selected: "bt-design",
    onSelect: () => {}, onPatch: (id, p) => { patched = [id, p]; }, onClear: (id) => { cleared = id; }
  })
);
const textareas = collect(sec2, (n) => n.tag === "textarea");
eq(textareas.length, 1, "选中蜂种展开提示词 textarea");
eq(textareas[0].props.value, "开会", "草稿基线读 statusDraft 镜像");
const checkboxes = collect(sec2, (n) => n.tag === "input" && n.props.type === "checkbox");
eq(checkboxes[0].props.checked, true, "autoSend 勾选态来自草稿");
const clearBtns = collect(sec2, (n) => n.tag === "button" && String(n.props.title ?? "").includes("hive.hb.status.clear"));
ok(clearBtns.length >= 1, "清除配置按钮呈现（行头 ✕）");
clearBtns[0].props.onClick({ stopPropagation() {} });
eq(cleared, "bt-design", "清除配置 → onClear 回调");

/* ── StatusBar（3.x/4.x） ── */
const world = {
  studios: [{ workspaceId: "ws-1", bees: [
    { sessionId: "d0", state: "done", droneStandIn: false, cellIndex: 0 },
    { sessionId: "d1", state: "done", droneStandIn: false, cellIndex: 1 }
  ] }],
  wildBees: []
};
const sessionsState = { byId: { d0: { origin: "user" }, d1: { origin: "user" } } };
let clearedSel = false, selectedBee = null;
const ctl = () => ({
  actions: {
    getScene: () => ({ world }),
    sessionsSnapshot: () => sessionsState,
    clearSelection: () => { clearedSel = true; },
    selectBee: (id) => { selectedBee = id; }
  }
});
const statusCards = { "bt-design": { prompt: "汇报进度", autoSend: true } };
const assignments = { d0: "bt-design", d1: "bt-design" };
const settings = { reportCollapsed: true, reportRows: 8, batchSendConfirm: true };

hookCells = []; hookIndex = 0;
const bar = render(StatusBar({ t, ctl, settings, beeTypes, assignments, statusCards, notify: () => {}, disabled: false }));
const cardNodes = collect(bar, (n) => String(n.props.className ?? "").includes("jyv-statusCard"));
eq(cardNodes.length, 3, "蜂种数组序 + 默认蜂末位卡（3 卡）");
ok(String(cardNodes[2].props.className).includes("jyv-statusDefault"), "末位 = 默认蜂卡");
eq(cardNodes.map((c) => collect(c, (n) => String(n.props.className ?? "").includes("jyv-statusCount"))[0]?.children), ["2", "0", "0"], "完成数 = 完成池大小（设计蜂 2 / 审查蜂 0 / 默认蜂 0）");
const sendBtns = collect(bar, (n) => String(n.props.className ?? "").includes("jyv-statusSend"));
eq(sendBtns.length, 1, "仅已配置卡（设计蜂）有发送按钮；未配置与默认蜂无按钮");

/* 空池禁用态：审查蜂已配置但池空 → 按钮禁用（title「暂无完成蜂」） */
hookCells = []; hookIndex = 0;
const bar2 = render(StatusBar({ t, ctl, settings, beeTypes, assignments, statusCards: { "bt-review": { prompt: "审查", autoSend: false } }, notify: () => {}, disabled: false }));
const emptySend = collect(bar2, (n) => String(n.props.className ?? "").includes("jyv-statusSend"));
eq(emptySend.length, 1, "已配置但池空的卡仍有发送按钮（禁用形态）");
eq(emptySend[0].props.disabled, true, "空池 → 按钮禁用");
eq(emptySend[0].props.title, "hive.status.sendEmpty", "空池按钮 title「暂无完成蜂」");

/* 点卡体循环选蜂链路：卡体 onClick 已绑定（选蜂编排的 completionSessions +
   advanceCursor 纯函数由 status-cards-smoke 直测覆盖） */
hookCells = []; hookIndex = 0; clearedSel = false; selectedBee = null;
const bar3 = render(StatusBar({ t, ctl, settings, beeTypes, assignments, statusCards, notify: () => {}, disabled: false }));
const clickableCards = collect(bar3, (n) => String(n.props.className ?? "").includes("jyv-statusCard") && typeof n.props.onClick === "function");
eq(clickableCards.length, 3, "三张卡体均绑定 onClick（循环选蜂）");

/* 收起/滑入门控：完成信息总数 ≤0 → data-hidden="true"（整栏向左收起）；
   >0 → 无 data-hidden（从屏幕外向右切入）。 */
{
  const emptyWorld = { studios: [{ workspaceId: "ws-1", bees: [
    { sessionId: "b1", state: "busy", droneStandIn: false, cellIndex: 0 }
  ] }], wildBees: [] };
  const emptyCtl = () => ({ actions: { getScene: () => ({ world: emptyWorld }), sessionsSnapshot: () => ({ byId: { b1: { origin: "user" } } }), clearSelection: () => {}, selectBee: () => {} } });
  hookCells = []; hookIndex = 0;
  const barHidden = render(StatusBar({ t, ctl: emptyCtl, settings, beeTypes, assignments, statusCards, notify: () => {}, disabled: false }));
  const barNode = collect(barHidden, (n) => String(n.props.className ?? "").includes("jyv-statusBar"));
  eq(barNode[0]?.props["data-hidden"], "true", "完成信息总数 0 → 整栏 data-hidden 收起");

  /* 有完成蜂时无 data-hidden（保持展开，可触发滑入） */
  hookCells = []; hookIndex = 0;
  const barShown = render(StatusBar({ t, ctl, settings, beeTypes, assignments, statusCards, notify: () => {}, disabled: false }));
  const barNode2 = collect(barShown, (n) => String(n.props.className ?? "").includes("jyv-statusBar"));
  eq(barNode2[0]?.props["data-hidden"] ?? null, null, "完成信息总数 >0 → 无 data-hidden（展开）");
}

console.log("ALL STATUS-CARDS UI SMOKE TESTS PASSED");
