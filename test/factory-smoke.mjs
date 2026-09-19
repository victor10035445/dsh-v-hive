/**
 * 工厂形态冒烟测试（M0 尖刺 2.5 的静态面）：lib/client.js 的懒 CJS 工厂能在
 * DSH client-modules 的等价环境里执行——window.__ModuleLoader__.load 包裹、
 * externals（react / react-dom / @deepseek-ai/*）由注入的 require 提供、
 * three 打进包内不外求、apply() 全套注入声明可解析。
 * 运行：node test/factory-smoke.mjs
 */
import { readFileSync } from "node:fs";

const code = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");

/* ── 环境桩 ── */
const registered = [];
const effects = [];
let applied = null;

const reactStub = (name) => {
  const fn = () => {
    throw new Error(name + " should not be invoked in factory smoke");
  };
  return fn;
};
const react = {
  useState: reactStub("useState"),
  useEffect: reactStub("useEffect"),
  useLayoutEffect: reactStub("useLayoutEffect"),
  useRef: reactStub("useRef"),
  useMemo: reactStub("useMemo"),
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

/* store 语义桩的发布纪律（design D3/D4）：镜像 immer produce + autofreeze——
   action 首参为可变副本 draft，产出的整态深冻结后发布并同步通知订阅者。 */
const deepFreeze = (value) => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const key of Object.keys(value)) deepFreeze(value[key]);
    Object.freeze(value);
  }
  return value;
};
const cloneDraft = (value) => (value && typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value);
const storeListeners = new Set();

const modules = {
  react,
  "react/jsx-runtime": jsxRuntime,
  "react-dom": { createPortal: (children) => children, flushSync: (fn) => fn?.() },
  /* DSH 0.1.2-rc.1+：defineStore 收编进 shell 静态种子表（裸包名 require）。
     语义桩：defineStore 返回 {spec, create} 句柄工厂，create() 实例化。 */
  "@deepseek-ai/dsh-client-store": {
    defineStore: (decl) => {
      if (typeof decl.init !== "function") throw new Error("defineStore decl.init missing");
      if (!decl.actions || typeof decl.actions !== "object") throw new Error("defineStore decl.actions missing");
      let state = null;
      return {
        spec: decl,
        create() {
          if (state === null) state = deepFreeze(decl.init());
          return {
            getSnapshot: () => state,
            subscribe(listener) {
              storeListeners.add(listener);
              return () => storeListeners.delete(listener);
            },
            actions: Object.fromEntries(
              Object.entries(decl.actions).map(([name, fn]) => [
                name,
                (...args) => {
                  const draft = cloneDraft(state); // immer draft 的桩形态：可变副本
                  const returned = fn(draft, ...args);
                  state = deepFreeze(returned ?? draft); // 产出的新状态深冻结发布
                  for (const listener of [...storeListeners]) listener();
                }
              ])
            )
          };
        }
      };
    }
  },
  /* 官方 primitives（页头设置图标 IconSettingsOutline16，hive-quick-commands） */
  "@deepseek-ai/dsh-client-ui-primitives": {
    IconSettingsOutline16: reactStub("IconSettingsOutline16")
  }
};

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
    register(ns, dict) {
      if (ns !== "dsh-hive") throw new Error("locale namespace should be dsh-hive");
      for (const key of Object.keys(dict.zh)) {
        if (!(key in dict.en)) throw new Error("en dict missing key: " + key);
      }
      registered.push({ kind: "locale", ns, count: Object.keys(dict.zh).length });
    },
    bind(ns) {
      if (ns !== "dsh-hive") throw new Error("locale bind namespace should be dsh-hive");
      return (key) => ns + ":" + key; // 供建立在 apply 作用域的 t（场景文案桥）
    }
  },
  slots: {
    inject(name, cb) {
      registered.push({ kind: "inject", name });
      cb(); // 模拟框架立刻物化注册
    },
    register(decl, Component) {
      if (typeof decl.name !== "string" || typeof decl.id !== "string") throw new Error("slot decl incomplete");
      if (typeof Component !== "function") throw new Error("slot component missing");
      registered.push({ kind: "register", name: decl.name, id: decl.id, order: decl.order, store: decl.store ?? null });
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
  requestAnimationFrame: () => 0,
  cancelAnimationFrame() {},
  navigator: { userAgent: "smoke" },
  location: { href: "http://localhost/" },
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  URL,
  URLSearchParams,
  Event: class Event {},
  fetch: () => Promise.reject(new TypeError("offline")),
  AbortController,
  ResizeObserver: class ResizeObserver { observe() {} disconnect() {} unobserve() {} },
  MutationObserver: class MutationObserver { observe() {} disconnect() {} },
  HTMLElement: class HTMLElement {},
  HTMLTextAreaElement: class HTMLTextAreaElement {},
  Element: class Element {},
  Node: class Node {}
};

/* ── 执行 factory：先落 __ModuleLoader__，再 eval ── */
let moduleExports = null;
const loaderCalls = [];
windowStub.__ModuleLoader__ = {
  load({ id, factory }) {
    loaderCalls.push(id);
    const require = (specifier) => {
      if (!(specifier in modules)) {
        throw new Error("bundle-purity gate: unexpected external require: " + specifier);
      }
      return modules[specifier];
    };
    moduleExports = factory(require);
  }
};

new Function("window", "document", "localStorage", "performance", "requestAnimationFrame", "cancelAnimationFrame", "navigator", "location", "console", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "URL", "URLSearchParams", "Event", "fetch", "AbortController", "ResizeObserver", "MutationObserver", "HTMLElement", "HTMLTextAreaElement", "Element", "Node", code)(
  sandbox.window, sandbox.document, sandbox.localStorage, sandbox.performance, sandbox.requestAnimationFrame,
  sandbox.cancelAnimationFrame, sandbox.navigator, sandbox.location, sandbox.console, sandbox.setTimeout,
  sandbox.clearTimeout, sandbox.setInterval, sandbox.clearInterval, sandbox.URL, sandbox.URLSearchParams,
  sandbox.Event, sandbox.fetch, sandbox.AbortController, sandbox.ResizeObserver, sandbox.MutationObserver,
  sandbox.HTMLElement, sandbox.HTMLTextAreaElement, sandbox.Element, sandbox.Node
);

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── require 白名单（design D4）：bundle 外部依赖恰为四项静态种子词——
    任何新增非种子词外部依赖（含旧 runtime 路径回潮）即红。 ── */
const requireSpecifiers = [...new Set(
  [...code.matchAll(/\brequire\((["'])([^"']+)\1\)/g)].map((m) => m[2])
)].sort();
const REQUIRE_WHITELIST = [
  "react",
  "react/jsx-runtime",
  "@deepseek-ai/dsh-client-store",
  "@deepseek-ai/dsh-client-ui-primitives"
].sort();
eq(JSON.stringify(requireSpecifiers), JSON.stringify(REQUIRE_WHITELIST), "lib/client.js require 面恰为四项种子词白名单");

eq(loaderCalls.length, 1, "工厂恰好注册一次");
eq(loaderCalls[0], "dsh-v-hive", "工厂 id = dsh-v-hive");
ok(moduleExports, "工厂产出 exports");
ok(Array.isArray(moduleExports.inject) && moduleExports.inject.includes("slots") && moduleExports.inject.includes("sessions") && moduleExports.inject.includes("workspaces"), "inject 声明含 slots/locale/sessions/workspaces");

/* apply 全套注册在桩 ctx 上成功 */
moduleExports.apply(ctxStub);

ok(effects.some((l) => String(l).includes("dictionaries")), "locale 注册 effect 已挂");
ok(effects.some((l) => String(l).includes("stylesheets")), "样式注入 effect 已挂");
ok(effects.some((l) => String(l).includes("mirror controller")), "镜像控制器 effect 已挂");
ok(effects.some((l) => String(l).includes("header toggle button")), "头部按钮 effect 已挂");

const registers = registered.filter((r) => r.kind === "register");
ok(registers.some((r) => r.name === "sidebar.footer.action" && r.id === "v-hive-seat"), "sidebar.footer.action 注册 Hive 座位按钮");
ok(registers.some((r) => r.name === "shell.overlay" && r.id === "v-hive-page" && r.order === 40), "shell.overlay 注册蜂巢整页条目");
/* 三轮：设置移入蜂巢指挥中心页内面板（工具条 ⚙），不再注册宿主 settings.plugins.tab */
ok(!registers.some((r) => r.name === "settings.plugins.tab"), "settings.plugins.tab 已移除（设置改为页内面板）");
const injects = registered.filter((r) => r.kind === "inject").map((r) => r.name);
ok(injects.includes("sidebar.footer.action") && injects.includes("shell.overlay") && !injects.includes("settings.plugins.tab"), "inject 声明覆盖两个插槽");

/* ── store 冻结纪律演练（design D3/D4）：发布态即冻结，一切后续写入走不可变派生。
    经 slot 注册句柄实测 setSettings（含 appearance patch）与 notify 路径——
    全程不抛只读错误（只读 mutate 会在此抛 TypeError 或使状态断言变红）。 ── */
const pageEntry = registered.find((r) => r.kind === "register" && r.id === "v-hive-page");
ok(pageEntry?.store && typeof pageEntry.store.create === "function", "shell.overlay 捕获 {spec, create} 形态的 store 句柄");
const hive = pageEntry.store.create(); // root scope：无参单例
ok(hive.actions && typeof hive.actions.setSettings === "function" && typeof hive.actions.notify === "function", "实例动作桥可用");
let notified = 0;
hive.subscribe(() => { notified++; });

/* setSettings：标量 patch 合并——patch 外既有键不动，旧冻结快照不受影响 */
const snap0 = hive.getSnapshot();
ok(Object.isFrozen(snap0) && Object.isFrozen(snap0.settings) && Object.isFrozen(snap0.settings.appearance), "初始快照深冻结");
hive.actions.setSettings({ hotkey: "ctrl+alt+h" });
const snap1 = hive.getSnapshot();
eq(snap1.settings.hotkey, "ctrl+alt+h", "setSettings 合并写入 patch 键");
eq(snap1.settings.animation, "full", "setSettings 合并保留 patch 外既有键");
eq(snap0.settings.hotkey, "alt+h", "旧冻结快照不被原地改动（不可变派生）");
ok(Object.isFrozen(snap1) && Object.isFrozen(snap1.settings), "发布态重新深冻结");

/* setSettings：appearance patch——以展开构造的全新 appearance 对象整体替换 */
const appearancePatch = { ...snap1.settings.appearance, amberColor: "#ff9d2e" };
hive.actions.setSettings({ appearance: appearancePatch });
const snap2 = hive.getSnapshot();
eq(snap2.settings.appearance.amberColor, "#ff9d2e", "appearance patch 生效");
eq(snap2.settings.appearance.wallGold, "#8a6a24", "appearance 其余键随整对象保留");
ok(snap2.settings.appearance !== snap1.settings.appearance, "appearance 以全新对象整体替换");
eq(snap1.settings.appearance.amberColor, "#e8a63c", "旧冻结 appearance 不被改动");
ok(Object.isFrozen(snap2.settings.appearance), "新 appearance 发布态冻结");

/* notify：连续执行——seq 递增、缺省 kind，且每次变更同步通知订阅者 */
hive.actions.notify("第一条", "warn");
eq(hive.getSnapshot().toast.text, "第一条", "notify 写入 toast 文本");
eq(hive.getSnapshot().toast.kind, "warn", "notify 写入 kind");
eq(hive.getSnapshot().toast.seq, 1, "notify 首条 seq=1");
hive.actions.notify("第二条");
eq(hive.getSnapshot().toast.seq, 2, "notify 连续调用 seq 递增");
eq(hive.getSnapshot().toast.kind, "ok", "notify 缺省 kind=ok");
ok(notified >= 4, "每次变更同步通知订阅者");

console.log("ALL FACTORY SMOKE TESTS PASSED");
console.log("  registered:", registered.map((r) => r.kind + ":" + (r.name ?? r.id) + (r.order !== undefined ? "@" + r.order : "")).join(", "));
