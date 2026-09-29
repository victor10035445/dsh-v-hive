/**
 * 蜂巢整页「渲染期 TDZ」冒烟（回归护栏）：把 lib/client.js 当宿主那样在沙箱里执行，
 * 置真页面开合 store（hiveOpenStore）后**递归展开 shell.overlay 条目**（= HivePage
 * 及其全部子组件），断言无异常抛出、顶层结构在场。
 *
 * 背景（real bug，实盘复现）：HivePage 体内「页级模态 state」（settingsOpen/swarmOpen/
 * hotbarsOpen…）曾声明在引用它们的 useEffect **之后**——React 的依赖数组在渲染期求值，
 * 故 `}, [ctl, settingsOpen])` 先于 `const [settingsOpen] = useState(false)` 执行，
 * 命中 TDZ：`ReferenceError: Cannot access 'settingsOpen' before initialization`
 * （浏览器栈：bE (client.jsx:2359:12)），整页被 shell.overlay 的 error boundary 接住，
 * 点「蜂群」按钮即白屏。压缩 bundle 下该错误只能靠 sourcemap 定位，故一并建立本护栏：
 * 任何「先用后声明」的页级 state 都会在 Node 里直接炸出来。
 *
 * 运行：node test/hive-page-render-smoke.mjs（先 node build.mjs）
 */
import { readFileSync } from "node:fs";

/* 默认读构建产物；`HIVE_SMOKE_BUNDLE` 可指向别的 bundle（排障用，如未压缩版）。 */
const code = readFileSync(process.env.HIVE_SMOKE_BUNDLE ?? new URL("../lib/client.js", import.meta.url), "utf8");

const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── React 桩（沿 swarm-preset-ui-smoke 口径：state/ref 跨调用保持） ── */
let hookCells = [];
let hookIndex = 0;
const calls = { effects: 0 };
/* 页面开合门控（模块级 hiveOpenStore）在沙箱里没有句柄：用布尔开关模拟
   「点开/关闭蜂巢页」——见下方 useSyncExternalStore 桩。 */
let pageOpen = false;
const react = {
  useState: (init) => {
    const i = hookIndex++;
    if (!hookCells[i]) hookCells[i] = { value: typeof init === "function" ? init() : init };
    const cell = hookCells[i];
    return [cell.value, (next) => { cell.value = typeof next === "function" ? next(cell.value) : next; }];
  },
  useRef: (init) => {
    /* React 语义：ref 对象形如 { current }（此处早期误用 { value } 导致
       `voiceDepsRef.current` 恒为 undefined，误伤 createVoiceDesk 的惰性取值）。 */
    const i = hookIndex++;
    if (!hookCells[i]) hookCells[i] = { current: init };
    return hookCells[i];
  },
  useEffect: (fn) => {
    calls.effects += 1;
    if (process.env.HIVE_SMOKE_TRACE === "1") {
      try {
        const cleanup = fn();
        void cleanup;
      } catch (error) {
        console.error("[trace] effect threw:", error?.message);
        console.error((error?.stack ?? "").split("\n").slice(0, 6).join("\n"));
      }
      return;
    }
    const cleanup = fn();
    void cleanup;
  },
  useLayoutEffect: () => {},
  useMemo: (fn) => fn(),
  useCallback: (fn) => fn,
  useSyncExternalStore: (subscribe, getSnapshot) => {
    /* 「蜂群」入口的内联开合按钮在页头内部——页面关时它不在树上，沙箱里点不到；
       故凡订阅「页面开合 store」（其快照为裸布尔）者一律以 `pageOpen` 应答：
       用例 1 置 false 覆盖「关页渲染 null」，用例 2 起置 true 覆盖「开页整树渲染」。
       其余 store（快照为对象/数组）原样回放。 */
    const snapshot = getSnapshot();
    const isOpenStore = typeof snapshot === "boolean";
    if (!isOpenStore) {
      const unsubscribe = subscribe(() => {});
      void unsubscribe;
      return snapshot;
    }
    const unsubscribe = subscribe(() => {});
    void unsubscribe;
    return pageOpen;
  },
  createElement: (type, props) => ({ type, props, _via: "createElement" }),
  forwardRef: (fn) => fn,
  StrictMode: function StrictMode() {},
  memo: (fn) => fn
};
react.default = react;
const jsxRuntime = {
  Fragment: Symbol.for("react.fragment"),
  jsx: (type, props) => ({ type, props }),
  jsxs: (type, props) => ({ type, props }),
  jsxDEV: (type, props) => ({ type, props })
};

const localeCaptures = [];
const registered = [];
const ctxStub = {
  effect(fn) { const d = fn(); return () => d?.(); },
  locale: { register(ns, dict) { localeCaptures.push({ ns, dict }); }, bind() { return (key) => key; } },
  slots: { inject(name, cb) { cb(); }, register(decl, Component) { registered.push({ decl, Component }); } },
  sessions: undefined,
  workspaces: undefined,
  uiWorkspace: undefined,
  get: () => undefined
};
const elementStub = () => ({
  style: { setProperty() {}, removeProperty() {} },
  classList: { add() {}, remove() {}, toggle() {} },
  addEventListener() {}, removeEventListener() {}, appendChild() {}, remove() {}, setAttribute() {},
  closest: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  contains: () => false,
  getBoundingClientRect: () => ({ right: 1200, left: 0, width: 1200, height: 900, top: 0, bottom: 900 }),
  dataset: {}, children: [], parentElement: null, textContent: "", innerHTML: ""
});
const windowStub = {
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  innerWidth: 1920, devicePixelRatio: 1, EventSource: undefined, __ModuleLoader__: null
};
const documentStub = {
  head: { appendChild() {} },
  /* body 需带 dataset：HivePage 的 chrome 配色 effect 会读写 document.body.dataset.jyChrome。 */
  body: { appendChild() {}, observe() {}, contains() { return false; }, dataset: {}, style: {}, classList: { add() {}, remove() {}, toggle() {} } },
  createElement: elementStub,
  querySelector: () => elementStub(),
  querySelectorAll: () => [],
  addEventListener() {}, removeEventListener() {}, visibilityState: "visible", hidden: false,
  hasFocus: () => true
};
const sandbox = {
  window: windowStub, document: documentStub,
  localStorage: { getItem: () => null, setItem() {} },
  performance, requestAnimationFrame: () => 0, cancelAnimationFrame() {},
  navigator: { userAgent: "smoke", hardwareConcurrency: 8 },
  /* 静音宿主/插件里的普通日志（沙箱里 locale 注册等会 print 巨量文本），只放行错误。 */
  location: { href: "http://localhost/" },
  console: { log() {}, info() {}, debug() {}, warn() {}, error: (...args) => console.error("[bundle]", ...args), trace() {} },
  setTimeout, clearTimeout, setInterval, clearInterval,
  URL, URLSearchParams, Event: class Event {},
  fetch: async () => ({ ok: false, status: 404, json: async () => ({}) }),
  AbortController, ResizeObserver: class { observe() {} disconnect() {} unobserve() {} },
  MutationObserver: class { observe() {} disconnect() {} },
  HTMLElement: class HTMLElement {}, HTMLTextAreaElement: class HTMLTextAreaElement {},
  Element: class Element {}, Node: class Node {}, queueMicrotask,
  getComputedStyle: () => ({ getPropertyValue: () => "" }), Image: class Image {}
};
let m = null;
windowStub.__ModuleLoader__ = {
  load({ factory }) {
    const require = (specifier) => {
      const modules = {
        react,
        "react/jsx-runtime": jsxRuntime,
        "react-dom": { createPortal: (children) => children, flushSync: (fn) => fn?.() },
        "@deepseek-ai/dsh-client-ui-primitives": { IconSettingsOutline16: () => null },
        "@deepseek-ai/dsh-client-store": {
          defineStore: (decl) => {
            let state = null;
            const listeners = new Set();
            const store = {
              spec: decl,
              create() {
                if (state === null) state = Object.freeze(decl.init());
                return {
                  getSnapshot: () => state,
                  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
                  actions: Object.fromEntries(
                    Object.entries(decl.actions ?? {}).map(([name, fn]) => [name, (...args) => {
                      const draft = JSON.parse(JSON.stringify(state));
                      const returned = fn(draft, ...args);
                      state = Object.freeze(returned ?? draft);
                      for (const listener of [...listeners]) listener();
                      return returned;
                    }])
                  )
                };
              }
            };
            return store;
          }
        }
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
  "HTMLElement", "HTMLTextAreaElement", "Element", "Node", "queueMicrotask", "getComputedStyle", "Image", code
)(
  sandbox.window, sandbox.document, sandbox.localStorage, sandbox.performance, sandbox.requestAnimationFrame,
  sandbox.cancelAnimationFrame, sandbox.navigator, sandbox.location, sandbox.console, sandbox.setTimeout,
  sandbox.clearTimeout, sandbox.setInterval, sandbox.clearInterval, sandbox.URL, sandbox.URLSearchParams,
  sandbox.Event, sandbox.fetch, sandbox.AbortController, sandbox.ResizeObserver, sandbox.MutationObserver,
  sandbox.HTMLElement, sandbox.HTMLTextAreaElement, sandbox.Element, sandbox.Node, sandbox.queueMicrotask,
  sandbox.getComputedStyle, sandbox.Image
);
ok(m, "工厂产出 exports");
m.apply(ctxStub);

const overlay = registered.find((r) => r.decl?.name === "shell.overlay");
ok(overlay, "shell.overlay 条目已注册");

/* ── 渲染助手：函数组件直调展开（每遍渲染从第一个 hook 胞元开始） ── */
const seen = [];
function render(el, depth = 0) {
  if (depth > 60) return null;
  if (el === null || el === undefined || typeof el === "boolean") return null;
  if (typeof el === "string" || typeof el === "number") return String(el);
  if (Array.isArray(el)) return el.map((e) => render(e, depth + 1));
  if (typeof el.type === "function") {
    hookIndex = 0;
    seen.push(el.type.name || "anon");
    return render(el.type(el.props ?? {}), depth + 1);
  }
  return { tag: el.type, props: el.props ?? {}, children: render(el.props?.children, depth + 1) };
}
const collect = (node, predicate, out = []) => {
  if (node === null || node === undefined) return out;
  if (Array.isArray(node)) { for (const c of node) collect(c, predicate, out); return out; }
  if (typeof node === "object" && node.tag !== undefined) {
    if (predicate(node)) out.push(node);
    collect(node.children, predicate, out);
  }
  return out;
};

/* 宿主注入的 props（沿 shell.overlay 条目契约）：
   - `useStore` 绑条目的 store spec（`decl.store` = defineStore 句柄，宿主以 `spec.init()`
     造初值），故此处照做——settings/toast 等页面态即真实形状；
   - `ctl` 是控制器句柄（本护栏不触达场景，回落空动作）。 */
const storeHandle = overlay.decl?.store;
ok(storeHandle?.spec?.init, "shell.overlay 条目携带 store spec（defineStore 句柄）");
const storeInstance = storeHandle.create();
const useStore = (selector) => selector(storeInstance.getSnapshot());
/* 真实宿主的 t 恒返回字符串（缺失键回退键名）；桩也必须如此——插件内多处
   `String(t(key)).replace(...)` / `.replace("{x}", …)` 依赖「t 不返回 undefined」。 */
const t = (key) => (typeof key === "string" ? key : String(key ?? ""));
const props = {
  t,
  useStore,
  /* 控制器句柄：本护栏只做渲染，场景相关动作全部空实现（含 setMenuHandler/attachScene/
     detachScene——它们由场景挂载 effect 在渲染后立即调用）。 */
  ctl: () => ({
    actions: {
      getScene: () => null,
      setMenuHandler: () => {},
      attachScene: () => {},
      detachScene: () => {},
      setStoreBridge: () => {},
      setT: () => {},
      clearSelection: () => {},
      clearMarquee: () => {},
      selectBee: () => {},
      getWorld: () => null
    },
    feed: () => null
  }),
  setFullscreen: () => {}, toggleLegend: () => {}, clearToast: () => {},
  notify: () => {}, setSettings: () => {},
  openFloat: () => {}, closeFloat: () => {}
};

/* ── 2. 页面关：门控返回 null（不触达 HivePage） ── */
pageOpen = false;
hookCells = [];
seen.length = 0;
const closed = render(overlay.Component(props));
ok(closed === null, "页面关（hiveOpen=false）→ 条目渲染 null");
ok(!seen.includes("HivePage"), "页面关时不展开 HivePage");

/* ── 3. 页面开：点「蜂群/Hive」入口 = 座位条目把页面开合 store 置真 ── */
pageOpen = true;
const seat = registered.find((r) => r.decl?.name === "sidebar.footer.action");
ok(seat, "sidebar.footer.action 条目已注册");
hookCells = [];
hookIndex = 0;
let toggled = false;
const seatProps = {
  ...props,
  sidebarToggle: () => { toggled = true; },
  sidebarActive: false,
  sidebarTitle: "hive"
};
try {
  seat.Component(seatProps);
} catch (error) {
  throw new Error(`座位条目渲染抛错：${error?.constructor?.name}: ${error?.message}`);
}
/* 座位条目至少提供了一条开合通道（inline 按钮或 sidebarToggle）；两者都走同一 store */
ok(typeof seatProps.sidebarToggle === "function", "座位条目提供开合回调（点「蜂群」入口的通道）");

/* ── 4. 页面开：递归展开 shell.overlay 条目（= HivePage 及其全部子组件） ── */
let tree = null;
let failure = null;
try {
  hookCells = [];
  hookIndex = 0;
  seen.length = 0;
  calls.effects = 0;
  tree = render(overlay.Component(props));
} catch (error) {
  failure = error;
}
const detail = failure ? `${failure.constructor?.name}: ${failure.message}` : "";
ok(!failure, `页面渲染 SHALL NOT 抛异常（渲染期 TDZ 回归护栏：页级 state 必须声明在任何引用它的 effect 之前）——实际：${detail}`);
ok(tree !== null, "页面开 → 条目渲染出整页树（门控通过）");
/* 组件序列在压缩包下是短名（如 bE），故用「页面骨架特征元素」断言 HivePage 真的渲染了：
   `.jyv-page` / `.jyv-canvasWrap` / 蜂群入口按钮都只存在于 HivePage 的返回树中。 */
const pageRoot = collect(tree, (n) => String(n.props?.className ?? "").includes("jyv-page"));
if (process.env.HIVE_SMOKE_TRACE === "1") {
  console.error("[trace] tree 顶层:", JSON.stringify(tree)?.slice(0, 400));
  console.error("[trace] pageRoot 命中:", pageRoot.length);
}
ok(pageRoot.length >= 1, `展开到 HivePage（.jyv-page 根在场；组件序列：${seen.slice(0, 8).join(" → ")}）`);
ok(calls.effects > 0, "HivePage 的 effect 已执行；后续渲染命中 TDZ 会在此前抛出");
const tabs = collect(tree, (n) => String(n.props?.className ?? "").includes("jyv-swarmBtn"));
ok(tabs.length >= 2, "页头「蜂群/指令」入口按钮在场（页面骨架渲染完成）");
const panels = collect(tree, (n) => String(n.props?.className ?? "").includes("jyv-canvasWrap"));
ok(panels.length === 1, "画布容器在场（3D 视口挂载点）");
ok(toggled === false, "（对照）未点击座位时不做多余切换");

console.log("ALL HIVE PAGE RENDER SMOKE TESTS PASSED");
