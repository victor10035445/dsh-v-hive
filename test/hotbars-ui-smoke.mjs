/**
 * 道具栏 UI 冒烟测试（context-hotbar-rework 4.4/5.5/6.6/7.4）：在 factory-smoke
 * 同款沙箱里执行 lib/client.js 懒 CJS 工厂，直测导出的组件与 store——
 *  - 布局参数（store）：默认值、写侧越界净房、localStorage 持久化；
 *  - 道具栏 HotbarBar：三态门控（null 不渲染）、空位占位零交互、溢出截断、
 *    三栏禁用语义（蜂栏桥/巢栏召唤关/地板 in-flight）；hotbar-default-actions
 *    增段：内置卡组渲染（蜂栏常驻：继续 + 归档/打开动作卡，用户槽位后恒追加；
 *    地板回退：建巢；巢栏空骨架不渲染）、⚡/「内置」角标与分型提示、动作卡
 *    门控旁路与在途禁用、onSlot 接线收到默认卡对象（action 判别）、容量截断
 *    用户卡优先、kind null / 空 slots 不渲染路径不变；
 *  - 覆盖面板 WorkerPanel：cellIndex 排序、无人机不出卡、空态、占位零交互、
 *    点卡 onPickBee 链路；
 *  - 左纵排模态：设置/指令编辑 rail 三节渲染 + guardRef 干净关闭路径；
 *  - 框选门控（bee-pick-and-marquee-focus 5.2）：从 **lib/client.js 产物**抽出打包后的
 *    道具栏门控函数本体直测 `marqueeActive` 短路（渲染层「整栏不渲染」的产物级锚点）；
 *  - 保存链路：ctl().actions.saveHotbars → PUT（409 重放，hotbars 整体替换）。
 * 运行：node test/hotbars-ui-smoke.mjs（先 node build.mjs）
 */
import { readFileSync } from "node:fs";
import { effectiveHotbarSlots, normalizeHotbars } from "../src/hotbars.mjs";

const code = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── React 桩：useState/useRef 跨调用保持（同组件两遍渲染驱动交互）、useEffect 立即执行 ── */
const effectCleanups = [];
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
  useEffect: (fn) => {
    const cleanup = fn();
    if (typeof cleanup === "function") effectCleanups.push(cleanup);
  },
  useLayoutEffect: () => {},
  useMemo: (fn) => fn(),
  createElement: (type, props) => ({ type, props, _via: "createElement" }),
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

/* ── mock fetch：/state GET 供控制器启动拉取；PUT 演练 409 重放 ──
   导入端点（add-hotbar-llm-model-and-import）：由 `importResponder` 逐段改写三态
   （可用 / available:false / 404 旧宿主 / 网络错），默认 404 = 宿主旧版无该路由。 */
const fetchCalls = [];
let putCount = 0;
let putConflictFirst = true;
let importResponder = null; // (respond) => ({ok, status, json}) | throw
async function fetchStub(url, opts = {}) {
  const method = opts.method ?? "GET";
  fetchCalls.push({ url, method, body: opts.body ? JSON.parse(opts.body) : null });
  const respond = (status, data) => ({ ok: status < 400, status, json: async () => data });
  if (url === "/api/dsh-hive/state" && method === "GET") {
    return respond(200, { doc: { version: 1, revision: 5, positions: {}, camera: null } });
  }
  if (url === "/api/dsh-hive/state" && method === "PUT") {
    putCount += 1;
    if (putConflictFirst && putCount === 1) {
      return respond(409, { error: "revision conflict", doc: { version: 1, revision: 6, positions: {}, camera: null } });
    }
    const doc = { version: 1, revision: 7, positions: {}, camera: null, ...fetchCalls[fetchCalls.length - 1].body };
    return respond(200, { doc });
  }
  if (url === "/api/dsh-hive/imports/skill-links-buttons") {
    if (importResponder) return importResponder(respond);
    return respond(404, { error: "unknown route" });
  }
  return respond(404, { error: "unknown route" });
}

/* ── 沙箱（factory/composer-bridge 同款） ── */
const registered = [];
const localeCaptures = [];
const localStorageWrites = [];
const listeners = new Set();
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
    const disposer = fn();
    return () => disposer?.();
  },
  locale: {
    register(ns, dict) {
      localeCaptures.push({ ns, dict });
    },
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
  workspaces: undefined,
  uiWorkspace: undefined
};
const sandbox = {
  window: windowStub,
  document: documentStub,
  localStorage: { getItem: () => null, setItem(k, v) { localStorageWrites.push({ k, v: JSON.parse(v) }); } },
  performance,
  requestAnimationFrame: () => 0,
  cancelAnimationFrame() {},
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

let m = null;
windowStub.__ModuleLoader__ = {
  load({ factory }) {
    const require = (specifier) => {
      const modules = {
        react,
        "react/jsx-runtime": jsxRuntime,
        "react-dom": { createPortal: (children) => children, flushSync: (fn) => fn?.() },
        "@deepseek-ai/dsh-client-store": {
          defineStore: (decl) => {
            let state = null;
            return {
              spec: decl,
              create() {
                if (state === null) state = Object.freeze(decl.init());
                return {
                  getSnapshot: () => state,
                  subscribe(listener) {
                    listeners.add(listener);
                    return () => listeners.delete(listener);
                  },
                  actions: Object.fromEntries(
                    Object.entries(decl.actions).map(([name, fn]) => [
                      name,
                      (...args) => {
                        const draft = JSON.parse(JSON.stringify(state));
                        const returned = fn(draft, ...args);
                        state = Object.freeze(returned ?? draft);
                        for (const listener of [...listeners]) listener();
                      }
                    ])
                  )
                };
              }
            };
          }
        },
        "@deepseek-ai/dsh-client-ui-primitives": { IconSettingsOutlineMedium: () => null }
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
m.apply(ctxStub);

/* ── 渲染助手：函数组件直调展开（桩级 render），树遍历收集 ── */
function render(el, depth = 0) {
  if (depth > 32) throw new Error("render depth exceeded");
  if (el === null || el === undefined || typeof el === "boolean") return null;
  if (typeof el === "string" || typeof el === "number") return String(el);
  if (Array.isArray(el)) return el.map((e) => render(e, depth + 1)).filter((x) => x !== null);
  if (typeof el.type === "function") return render(el.type(el.props ?? {}), depth + 1);
  const children = el.props?.children;
  return { tag: el.type, props: el.props ?? {}, children: render(children, depth + 1) };
}
function collect(node, predicate, out = []) {
  if (node === null || node === undefined) return out;
  if (Array.isArray(node)) {
    for (const child of node) collect(child, predicate, out);
    return out;
  }
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

const { HotbarBar, WorkerPanel, HiveSettingsModal, HotbarsModal, LayoutSettingsBody } = m;

/* ── 1. 布局参数（4.4）：默认值 + 写侧净房 + localStorage 持久化 ── */
const pageEntry = registered.find((r) => r.decl.name === "shell.overlay" && r.decl.id === "v-hive-page");
ok(pageEntry, "shell.overlay 页面条目已注册");
const storeHandle = pageEntry.decl.store.create();
const layout0 = storeHandle.getSnapshot().settings.layout;
eq(layout0, { panelM: 2, panelN: 2, barM: 8, barN: 1 }, "布局参数默认值（panel 2×2 / bar 8×1）");
storeHandle.actions.setSettings({ layout: { panelM: 99, panelN: 0, barM: 99, barN: 0 } });
const layout1 = storeHandle.getSnapshot().settings.layout;
eq(layout1, { panelM: 3, panelN: 1, barM: 8, barN: 1 }, "越界 layout 写侧净房（panel m≤3/n≤8、bar m≤8/n≤2）");
ok(localStorageWrites.some((w) => w.k === "dsh-v-hive:settings" && w.v?.layout?.panelM === 3), "布局参数随页签设置持久化（localStorage）");

/* ── 1b. 跟随默认值迁移哨兵（hive-marquee-and-card-rework 1.1/1.2） ── */
const settings0 = storeHandle.getSnapshot().settings;
eq(settings0.followCurrent, true, "followCurrent 默认开（1.1；本沙箱 localStorage 恒空读 = 全新用户路径）");
eq(settings0.followCurrentMigrated, true, "迁移标记随归一化写入（1.2）");
storeHandle.actions.setSettings({ followCurrent: false });
eq(storeHandle.getSnapshot().settings.followCurrent, false, "显式关闭 → 值尊重（写侧不回翻）");
ok(
  localStorageWrites.some((w) => w.k === "dsh-v-hive:settings" && w.v?.followCurrent === false && w.v?.followCurrentMigrated === true),
  "显式关闭随整对象落盘（重进保持关闭，哨兵不二次翻转）"
);
storeHandle.actions.setSettings({ followCurrent: true });

/* ── 2. 道具栏 HotbarBar（6.6，紧凑阵列） ── */
const t = (key) => key;
/* 三态门控：kind null → 不渲染 */
eq(HotbarBar({ t, kind: null, slots: [], layout: layout0 }), null, "kind null（cup/空/浮窗）→ 不渲染");
eq(HotbarBar({ t, kind: "hive", slots: [], layout: layout0 }), null, "当前栏无槽位 → 不渲染（紧凑，无空条）");
/* 紧凑阵列：3 槽位 / 8 列设置 → 仅 3 卡（无占位），条宽收缩为 3 列 */
const slots3 = [
  { id: "a", name: "跑测试", summon: true, prompt: "npm test", autoSend: false },
  { id: "b", name: "审查", summon: true, prompt: "review", autoSend: true },
  { id: "c", name: "纯召唤", summon: true, autoSend: false }
];
const bar1 = render(HotbarBar({ t, kind: "hive", slots: slots3, layout: { barM: 8, barN: 5 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: () => {} }));
eq(collect(bar1, (n) => n.tag === "button").length, 3, "3 张功能卡按序渲染");
eq(collect(bar1, (n) => n.tag === "div" && String(n.props.className ?? "").includes("jyv-hbPlaceholder")).length, 0, "无空位占位卡（紧凑）");
eq(bar1.props.style["--jyv-hb-cols"], 3, "条宽随实际槽位数收缩（min(3, 8) = 3 列）");
eq(bar1.props.style["--jyv-hb-rows"], 5, "行数上限 = 设置 barN（CSS max-height 封顶）");
/* 1 槽位 / 8×5 设置 → 1 行 1 列（用户示例） */
const bar1a = render(HotbarBar({ t, kind: "hive", slots: [slots3[0]], layout: { barM: 8, barN: 5 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: () => {} }));
eq(collect(bar1a, (n) => n.tag === "button").length, 1, "1 卡 → 仅 1 行（高度用实际值）");
eq(bar1a.props.style["--jyv-hb-cols"], 1, "1 卡 → 条宽 1 列");
/* 溢出截断：10 槽位 / 8×1 容量 → 仅前 8 渲染 */
const slots10 = Array.from({ length: 10 }, (_, i) => ({ id: "s" + i, name: "n" + i, summon: true, autoSend: false }));
const bar2 = render(HotbarBar({ t, kind: "hive", slots: slots10, layout: { barM: 8, barN: 1 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: () => {} }));
const bar2Buttons = collect(bar2, (n) => n.tag === "button");
eq(bar2Buttons.length, 8, "超出容量的槽位不渲染（10 → 8）");
eq(bar2Buttons.map((b) => b.props.children.filter(Boolean).at(-1).props.children), ["n0","n1","n2","n3","n4","n5","n6","n7"], "截断保留配置序前 8 个（先左后右、先上到下）");
/* 三栏禁用语义 */
const beeBar = render(HotbarBar({ t, kind: "bee", slots: [{ id: "b1", name: "追加", prompt: "x", autoSend: false }], layout: { barM: 4, barN: 1 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: false, onSlot: () => {} }));
eq(collect(beeBar, (n) => n.tag === "button")[0].props.disabled, true, "蜂栏未勾 + 桥未就绪 → 禁用");
const beeBar2 = render(HotbarBar({ t, kind: "bee", slots: [{ id: "b2", name: "直发", prompt: "x", autoSend: true }], layout: { barM: 4, barN: 1 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: false, onSlot: () => {} }));
eq(collect(beeBar2, (n) => n.tag === "button")[0].props.disabled, false, "蜂栏勾选直发 → 恒可用");
/* 蜂栏「新开会话」卡门控（new-session-hotbar 2.4/D1/D5）：召唤通道不受输入桥就绪门控，
   纳入召唤类共享在途锁（data-busy 视觉在途态），title 区分落点语义 */
const beeNewSessionSlot = { id: "b3", name: "开新会话", prompt: "新任务", autoSend: false, newSession: true };
const beeNewSession = render(HotbarBar({ t, kind: "bee", slots: [beeNewSessionSlot], layout: { barM: 4, barN: 1 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: false, onSlot: () => {} }));
const beeNewSessionBtn = collect(beeNewSession, (n) => n.tag === "button")[0];
eq(beeNewSessionBtn.props.disabled, false, "newSession=是 卡不受桥未就绪门控（桥未就绪仍可用）");
eq(beeNewSessionBtn.props.title, "新任务 · hive.bar.beeNewSessionTitle", "title = 提示词 + 落点语义说明（区分「新开会话」通道）");
eq(beeNewSessionBtn.props["data-busy"], undefined, "未在途 → 无 data-busy");
const beeNewSessionBusy = render(HotbarBar({ t, kind: "bee", slots: [beeNewSessionSlot], layout: { barM: 4, barN: 1 }, disabled: false, summonBusy: true, floorBusy: false, bridgeReady: true, onSlot: () => {} }));
const beeNewSessionBusyBtn = collect(beeNewSessionBusy, (n) => n.tag === "button")[0];
eq(beeNewSessionBusyBtn.props.disabled, true, "召唤在途 → newSession=是 卡禁用（召唤类共享单飞锁）");
eq(beeNewSessionBusyBtn.props["data-busy"], true, "在途 → data-busy 视觉在途态");
const beeLegacyBusy = render(HotbarBar({ t, kind: "bee", slots: [{ id: "b4", name: "追加", prompt: "x", autoSend: false }], layout: { barM: 4, barN: 1 }, disabled: false, summonBusy: true, floorBusy: false, bridgeReady: true, onSlot: () => {} }));
eq(collect(beeLegacyBusy, (n) => n.tag === "button")[0].props.disabled, false, "newSession=否 卡不受召唤在途锁（不建蜂）");
const hiveBar = render(HotbarBar({ t, kind: "hive", slots: [{ id: "h1", name: "禁用卡", summon: false, autoSend: false }], layout: { barM: 4, barN: 1 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: () => {} }));
eq(collect(hiveBar, (n) => n.tag === "button")[0].props.disabled, true, "巢栏召唤关闭 → 卡禁用态");
const floorBar = render(HotbarBar({ t, kind: "floor", slots: [{ id: "f1", name: "建巢", createBee: true, autoSend: false }], layout: { barM: 4, barN: 1 }, disabled: false, summonBusy: false, floorBusy: true, bridgeReady: true, onSlot: () => {} }));
eq(collect(floorBar, (n) => n.tag === "button")[0].props.disabled, true, "地板卡 in-flight → 禁用（防重复）");
/* 点击语义：onClick 透传槽位 */
let clicked = null;
const bar3 = render(HotbarBar({ t, kind: "hive", slots: [slots3[0]], layout: { barM: 2, barN: 1 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: (slot) => { clicked = slot; } }));
collect(bar3, (n) => n.tag === "button")[0].props.onClick(slots3[0]);
eq(clicked?.id, "a", "卡片点击经 onSlot 透传槽位（召唤/双通道语义由外壳分派）");

/* ── 2b. 内置默认动作卡（hotbar-default-actions 5.2；卡组与呈现分型用户定稿） ──
 * 蜂栏内置卡常驻（用户槽位后恒追加），巢/地板回退型。UI 冒烟以 identity t
 * （键即值）直测派生 → 渲染链路；文案解析正确性由 hotbars-smoke.mjs 覆盖。 */
const hbDefaults = (kind, userSlots, extra = {}) => render(
  HotbarBar({
    t, kind, slots: effectiveHotbarSlots(kind, userSlots, t),
    layout: { barM: 8, barN: 5 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true,
    onSlot: () => {}, ...extra
  })
);
/* 蜂栏默认卡组：继续（⚡ 直发）+ 归档会话/打开会话（动作卡） */
const defBee = hbDefaults("bee", []);
const defBeeButtons = collect(defBee, (n) => n.tag === "button");
eq(defBeeButtons.map((b) => b.props.children.filter(Boolean).at(-1).props.children), ["hive.bar.defaults.beeContinue", "hive.bar.defaults.beeArchive", "hive.bar.defaults.beeOpen"], "蜂栏空栏 → 整组默认卡渲染（继续 + 归档 + 打开）");
eq(defBeeButtons.map((b) => collect(b, (n) => String(n.props.className ?? "").includes("jyv-hbBolt")).length), [1, 0, 0], "⚡ 直发角标仅「继续」卡（autoSend true）携带");
eq(defBeeButtons.map((b) => b.props["data-action"]), [undefined, "archive", "open"], "动作卡携带 data-action 标记（蜜金描边钩子），提示词卡不带");
eq(collect(defBee, (n) => n.tag === "span" && String(n.props.className ?? "").includes("jyv-hbBuiltin")).length, 3, "三张默认卡均带「内置」角标");
ok(collect(defBee, (n) => String(n.props.className ?? "").includes("jyv-hbBuiltin")).every((n) => n.props.title === "hive.bar.defaults.hintResident"), "常驻栏角标 title = 常驻说明（蜂栏内置卡不随自定义收回）");
eq(defBeeButtons.map((b) => b.props.title), ["hive.bar.defaults.beeContinuePrompt", "hive.bar.defaults.beeArchiveTitle", "hive.bar.defaults.beeOpenTitle"], "卡体 title 保持动作语义（提示词/归档警示/打开说明），未被收回提示覆盖");
/* 门控：桥未就绪不影响默认卡组（继续恒直发可用；动作卡非提示词语义，不受桥/空提示词拦截） */
eq(collect(hbDefaults("bee", [], { bridgeReady: false }), (n) => n.tag === "button").map((b) => b.props.disabled), [false, false, false], "桥未就绪 → 蜂栏默认卡组全部可用");
/* 巢栏无默认卡（用户定稿）：空栏 → 不渲染（紧凑路径），召唤在途亦无卡可禁用 */
eq(hbDefaults("hive", []), null, "巢栏空骨架 → 不渲染（召唤由用户自定义槽位覆盖）");
eq(collect(hbDefaults("hive", [], { summonBusy: true }), (n) => n.tag === "button").length, 0, "巢栏无默认卡——召唤在途无卡可禁用");
/* 地板栏默认卡：仅建巢 + 卡体 title 建巢提示 + 在途禁用 */
const defFloorButtons = collect(hbDefaults("floor", []), (n) => n.tag === "button");
eq(defFloorButtons.map((b) => [b.props.title, b.props.disabled]), [["hive.bar.floorHint", false]], "地板栏空栏 → 仅「建巢」默认卡（纯建巢），卡体 title = 建巢提示语义");
ok(collect(defFloorButtons[0], (n) => String(n.props.className ?? "").includes("jyv-hbBuiltin")).every((n) => n.props.title === "hive.bar.defaults.hint"), "回退栏角标 title = 收回提示（与常驻栏分型区分）");
eq(defFloorButtons.map((b) => b.props["data-action"]), [undefined], "回退型提示词默认卡不带 data-action（蜜金描边语义专属动作卡）");
eq(collect(hbDefaults("floor", [], { floorBusy: true }), (n) => n.tag === "button").map((b) => b.props.disabled), [true], "建巢在途 → 地板默认卡禁用（floorBusy 同等生效）");
/* 点击接线：onSlot 收到默认卡对象（动作卡携带 action 判别，外壳据此分派归档/打开） */
let defaultClicked = null;
const defBeeWire = render(HotbarBar({ t, kind: "bee", slots: effectiveHotbarSlots("bee", [], t), layout: { barM: 8, barN: 5 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: (slot) => { defaultClicked = slot; } }));
collect(defBeeWire, (n) => n.tag === "button")[1].props.onClick();
eq(defaultClicked?.id, "default-hb-archive", "点击默认卡 → onSlot 收到默认卡对象（稳定 id）");
eq(defaultClicked?.action, "archive", "归档卡携带 action 判别字段（不走双通道，外壳分派 archiveBee）");
collect(defBeeWire, (n) => n.tag === "button")[2].props.onClick();
eq(defaultClicked?.action, "open", "打开会话卡携带 action: open（外壳收起蜂巢页直达会话）");
collect(defBeeWire, (n) => n.tag === "button")[0].props.onClick();
eq(defaultClicked?.action, undefined, "继续卡无 action → 落入既有双通道 handler（autoSend 直发）");
/* 蜂栏常驻（用户定稿）：用户槽位之后恒追加整组内置卡（用户卡无角标、内置卡有角标） */
const defBeeResident = hbDefaults("bee", [{ id: "b9", name: "用户卡", prompt: "自己的卡", autoSend: false }]);
const residentButtons = collect(defBeeResident, (n) => n.tag === "button");
eq(residentButtons.map((b) => b.props.children.filter(Boolean).at(-1).props.children), ["用户卡", "hive.bar.defaults.beeContinue", "hive.bar.defaults.beeArchive", "hive.bar.defaults.beeOpen"], "蜂栏有用户槽位 → 用户卡在前、内置卡恒追加（常驻不收回）");
eq(collect(defBeeResident, (n) => n.tag === "span" && String(n.props.className ?? "").includes("jyv-hbBuiltin")).length, 3, "「内置」角标仅内置卡携带");
ok(collect(defBeeResident, (n) => n.tag === "span" && String(n.props.className ?? "").includes("jyv-hbBuiltin")).every((n) => n.props.title === "hive.bar.defaults.hintResident"), "常驻角标 title = 常驻说明");
/* 容量截断：用户卡优先、内置卡尾随先切——1×1 阵列下 1 用户卡 + 3 内置 → 仅用户卡；空用户 3 内置 → 仅首张 */
const defBeeCappedUser = render(HotbarBar({ t, kind: "bee", slots: effectiveHotbarSlots("bee", [{ id: "b9", name: "用户卡", prompt: "p", autoSend: false }], t), layout: { barM: 1, barN: 1 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: () => {} }));
eq(collect(defBeeCappedUser, (n) => n.tag === "button").map((b) => b.props.children.filter(Boolean).at(-1).props.children), ["用户卡"], "容量截断用户卡优先（1×1 → 内置卡全部被截）");
const defBeeCapped = render(HotbarBar({ t, kind: "bee", slots: effectiveHotbarSlots("bee", [], t), layout: { barM: 1, barN: 1 }, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: () => {} }));
eq(collect(defBeeCapped, (n) => n.tag === "button").map((b) => b.props.children.filter(Boolean).at(-1).props.children), ["hive.bar.defaults.beeContinue"], "容量截断对内置卡同等生效（1×1 → 仅首卡渲染）");
/* kind null / 空 slots 不渲染路径不变（巢栏空骨架与未知 kind 同路径） */
eq(HotbarBar({ t, kind: null, slots: [], layout: layout0 }), null, "kind null → 不渲染（路径不变）");
eq(HotbarBar({ t, kind: "hive", slots: [], layout: layout0 }), null, "有效槽位空数组 → 不渲染（紧凑路径不变）");
eq(HotbarBar({ t, kind: "hive", slots: effectiveHotbarSlots("hive", [], t), layout: layout0, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: () => {} }), null, "巢栏空骨架派生空数组 → 不渲染");

/* ── 2b. 框选多选门控（bee-pick-and-marquee-focus 5.2）——规格措辞为「误伤通道物理
   切断」，纯函数真值表不足以支撑，故本条做**渲染层 + 产物级**两层锚定 ──
   (a) 渲染层：`kind = null` ⇒ 道具栏整栏不渲染（无 `.jyv-hotbar`、无任何 `.jyv-hbCard`
       ——内置「归档会话」卡随之物理不可达）；
   (b) 产物级：从 `lib/client.js` 抽出**打包后的门控函数本体**直测——`marqueeActive`
       真必须短路为 null（含浮窗/提案/巢/地板/蜂栏各态叠加），假/缺省时既有判定次序
       逐项不变。单元测试测的是 `src/hotbars.mjs`；本项测的是页面真正调用的那一份，
       故「派生点确实把 `marqueeActive` 传进门控」这一静默回归点被产物锁定。 */
{
  const beeSlot = { id: "b1", name: "蜂卡", prompt: "p", autoSend: false };
  const barProps = { t, slots: [beeSlot], layout: layout0, disabled: false, summonBusy: false, floorBusy: false, bridgeReady: true, onSlot: () => {} };
  const beeBar = render(HotbarBar({ ...barProps, kind: "bee" }));
  ok(collect(beeBar, (n) => n.tag === "div" && String(n.props.className ?? "").includes("jyv-hotbar")).length === 1, "（对照）kind = bee + 有槽位 → 道具栏在场");
  ok(collect(beeBar, (n) => n.tag === "button").length >= 1, "（对照）蜂栏呈现卡片");
  eq(HotbarBar({ ...barProps, kind: null }), null, "kind = null → 道具栏整栏不渲染（门控的渲染层语义）");
  const noBar = render(HotbarBar({ ...barProps, kind: null }));
  eq(collect(noBar, (n) => String(n.props?.className ?? "").includes("jyv-hotbar")).length, 0, "kind = null → 树中无 .jyv-hotbar（整栏消失）");
  eq(collect(noBar, (n) => String(n.props?.className ?? "").includes("jyv-hbCard")).length, 0, "kind = null → 树中无任何 .jyv-hbCard（内置「归档会话」卡不可达）");
  /* 产物级抽取：`resolveHotbarKind` 被 esbuild 内联、原名不存——按参数形状定位整段
     （参数解构 + body；body 内无花括号嵌套），并保留**产物原名**（如 `marqueeActive:s`）
     重建同一函数：按 `名:标识符` 取参数序，body 原样作函数体（两者同属一个最小化作用域）。 */
  /* 未声明标识符护栏（real bug，实盘复现）：本次实施曾在 `attachScene` 里写入
     `sceneProxy.onSelectionChange = …`——该名字只是页面渲染冒烟沙箱里的替身，
     **源文件里从未声明**；esbuild 把它当全局引用照样打包成功，运行时 `attachScene`
     直接 `ReferenceError` ⇒ 3D 场景挂载失败、整页进 WebGL 降级卡（Node 冒烟全绿也
     抓不到）。故此处对产物做一次「沙箱专有标识符」扫描：它们**只允许出现在 test/
     里**，一旦泄漏进 lib/client.js 即失败。 */
  for (const leaked of ["sceneProxy", "ctlWithWorld", "realCtl"]) {
    eq(code.includes(leaked), false, `产物中不含测试替身标识符 \`${leaked}\`（未声明全局引用的实盘护栏）`);
  }
  const gateMatch = code.match(/selection:[^}]*marqueeActive:([A-Za-z_$][\w$]*)\}=\{\}\)\{([^{}]*)\}/);
  ok(gateMatch, "从 lib/client.js 抽出打包后的道具栏门控函数本体（产物级锚点；抽取失效即告警）");
  const gateHead = gateMatch[0].slice(0, gateMatch[0].indexOf("}={})"));
  const gateParams = [...gateHead.matchAll(/(\w+):([A-Za-z_$][\w$]*)(?=[,}]|$)/g)].map((x) => x[2]);
  eq(gateParams.length, 5, `产物门控函数参数序还原（selection/selectedBee/floatOpen/selectedProposal/marqueeActive → ${gateParams.join(",")}）`);
  const gateFn = new Function(...gateParams, gateMatch[2]);
  const gateOf = ({ selection, selectedBee, floatOpen, selectedProposal, marqueeActive } = {}) =>
    gateFn(selection, selectedBee, floatOpen, selectedProposal, marqueeActive);
  /* 透传锚点（**独立于参数名**：缺失透传时该对象字面量只剩四路，本项即失败）：
     `marqueeActive` 在产物中应恰有「门控函数参数位」与「派生点调用处」两处对象字面量，
     调用处形态为 `{selection:…,selectedBee:…,floatOpen:…,selectedProposal:…,marqueeActive:…}`
     （参数位紧跟 `=` 起默认值，据此排除）。 */
  const literalPattern = /\{[^{}]*selection:[^{}]*selectedBee:[^{}]*floatOpen:[^{}]*selectedProposal:[^{}]*marqueeActive:[^{}]*\}/g;
  const gateCallSites = [];
  for (const literal of code.matchAll(literalPattern)) {
    if (code[literal.index + literal[0].length] === "=") continue; // 参数位（`…}={}`）
    gateCallSites.push(literal[0]);
  }
  eq(gateCallSites.length, 1, `产物中门控派生点唯一且透传 marqueeActive（缺失透传即 0 处 → 静默回归点被锁死；实际 ${gateCallSites.length} 处）`);
  /* 取数锚点（**独立于透传形状**）：产物中按 `getSet().size > 0` 取值的赋值恰好两处
     （Esc 清多选守卫 + 门控派生），且其中一处赋给的变量正是调用处传入 `marqueeActive`
     的那个——若实现退化为常量（`!1`）或改指他处，本项即失败。 */
  const wireIdent = gateCallSites[0].match(/marqueeActive:([A-Za-z_$][\w$]*)/)?.[1] ?? "";
  const getSetHits = code.split(".getSet().size>0").length - 1;
  const derivedIds = [...code.matchAll(/([A-Za-z_$][\w$]*)=[^;,]{0,80}\.getSet\(\)\.size>0/g)].map((x) => x[1]);
  eq(getSetHits, 2, `产物中按「框选多选集非空」取值的表达式恰两处（Esc 守卫 + 门控派生；实际 ${getSetHits} 处）`);
  ok(
    wireIdent && derivedIds.includes(wireIdent),
    `产物派生点 marqueeActive 取数来自框选多选集（${wireIdent || "?"} ∈ {${derivedIds.join(",")}}）`
  );
  const pick = { workspaceId: "ws-a", name: "add-foo" };
  const states = [
    ["巢选中", { selection: { kind: "studio", id: "ws-1" }, selectedBee: null, floatOpen: false, selectedProposal: null }, "hive"],
    ["地板选中", { selection: { kind: "tile", id: "4,-2" }, selectedBee: null, floatOpen: false, selectedProposal: null }, "floor"],
    ["蜂栏", { selection: null, selectedBee: "bee-1", floatOpen: false, selectedProposal: null }, "bee"],
    ["提案栏", { selection: null, selectedBee: null, floatOpen: false, selectedProposal: pick }, "proposal"],
    ["蜜杯选中", { selection: { kind: "cup", id: "cup-1" }, selectedBee: "bee-1", floatOpen: false, selectedProposal: null }, null],
    ["浮窗开", { selection: null, selectedBee: "bee-1", floatOpen: true, selectedProposal: null }, null]
  ];
  for (const [label, input, expected] of states) {
    eq(gateOf({ ...input, marqueeActive: true }), null, `${label}：marqueeActive 真 → 任何栏不渲染（产物级）`);
    eq(gateOf({ ...input, marqueeActive: false }), expected, `${label}：marqueeActive false → 既有输出不变（产物级）`);
    eq(gateOf(input), expected, `${label}：marqueeActive 缺省 → 既有输出逐项不变（产物级向后兼容）`);
  }
  ok(/marqueeActive/.test(code), "产物中派生点调用处携带 marqueeActive（透传锚点）");
}

/* ── 3. 覆盖面板 WorkerPanel（7.4） ── */
eq(WorkerPanel({ t, studio: null, layout: layout0, assignments: {}, beeTypes: [], onPickBee: () => {} }), null, "无巢选中 → 面板不渲染");
const beeTypeName = "设计蜂";
const studio = {
  workspaceId: "ws-1",
  capacity: 19,
  bees: [
    { sessionId: "bee-2", displayTitle: "工蜂二", state: "busy", cellIndex: 1, drones: [{}, {}, {}, {}, {}], activeDroneCount: 2, todos: { done: 1, total: 3 } },
    { sessionId: "bee-1", displayTitle: "工蜂一", state: "idle", cellIndex: 0, drones: [], activeDroneCount: 0 },
    { sessionId: "standin", displayTitle: "降级停驻无人机", state: "idle", droneStandIn: true, cellIndex: -1, drones: [], activeDroneCount: 0 }
  ]
};
const panel1 = render(WorkerPanel({ t, studio, layout: { panelM: 2, panelN: 2 }, assignments: { "bee-1": "bt-design" }, beeTypes: [{ id: "bt-design", name: beeTypeName }], onPickBee: () => {} }));
ok(!textOf(panel1).includes("hive.panel.title"), "面板去标题（chrome 移除，仅计数——hive-interaction-polish）");
ok(textOf(panel1).includes("2/19"), "面板计数 2/19（无人机停驻不计）");
const panelCards = collect(panel1, (n) => n.tag === "button" && String(n.props.className ?? "").includes("jyv-wpCard"));
eq(panelCards.length, 2, "无人机（降级停驻）不出卡");
eq(panelCards.map((c) => c.props.title), ["工蜂一", "工蜂二"], "卡片按蜂位格序（cellIndex）排列");
ok(textOf(panel1).includes("2/5"), "无人机角标 🐝活跃/总数 同口径呈现");
ok(textOf(panel1).includes(beeTypeName), "蜂种徽章呈现");
let picked = null;
const panel2 = render(WorkerPanel({ t, studio: { ...studio, bees: [studio.bees[0]] }, layout: { panelM: 2, panelN: 2 }, assignments: {}, beeTypes: [], onPickBee: (id) => { picked = id; } }));
collect(panel2, (n) => n.tag === "button" && String(n.props.className ?? "").includes("jyv-wpCard"))[0].props.onClick();
eq(picked, "bee-2", "点卡 → onPickBee（清巢跳蜂链路由外壳执行 clearSelection + sessions.open）");
const panelEmpty = render(WorkerPanel({ t, studio: { workspaceId: "ws-2", capacity: 19, bees: [] }, layout: { panelM: 2, panelN: 2 }, assignments: {}, beeTypes: [], onPickBee: () => {} }));
ok(textOf(panelEmpty).includes("hive.panel.empty"), "空巢 → 空态占位文案");
eq(collect(panelEmpty, (n) => String(n.props.className ?? "").includes("jyv-wpGrid")).length, 0, "空巢无滚动区（grid 不渲染）");
const panelPh = render(WorkerPanel({ t, studio: { workspaceId: "ws-3", capacity: 19, bees: [studio.bees[1]] }, layout: { panelM: 2, panelN: 2 }, assignments: {}, beeTypes: [], onPickBee: () => {} }));
eq(collect(panelPh, (n) => String(n.props.className ?? "").includes("jyv-wpPlaceholder")).length, 1, "占位卡只补齐最后一行（1 蜂 / 2 列 → 末行 1 占位）");
/* 行数语义（用户定稿）：列1行4 + 2 蜂 → 2 行无占位；4行2列 + 5 蜂 → 3 行（第 3 行 1 蜂居左 + 1 占位补行） */
const panelCol1 = render(WorkerPanel({ t, studio: { workspaceId: "ws-4", capacity: 19, bees: [studio.bees[1], studio.bees[0]] }, layout: { panelM: 1, panelN: 4 }, assignments: {}, beeTypes: [], onPickBee: () => {} }));
eq(collect(panelCol1, (n) => n.tag === "button" && String(n.props.className ?? "").includes("jyv-wpCard")).length, 2, "列1：2 蜂 → 2 行（无占位）");
eq(collect(panelCol1, (n) => String(n.props.className ?? "").includes("jyv-wpPlaceholder")).length, 0, "列1：整除行无占位");
const fiveBees = Array.from({ length: 5 }, (_, i) => ({ sessionId: "b" + i, displayTitle: "蜂" + i, state: "idle", cellIndex: i, drones: [], activeDroneCount: 0 }));
const panelGrid = render(WorkerPanel({ t, studio: { workspaceId: "ws-5", capacity: 19, bees: fiveBees }, layout: { panelM: 2, panelN: 4 }, assignments: {}, beeTypes: [], onPickBee: () => {} }));
eq(collect(panelGrid, (n) => n.tag === "button" && String(n.props.className ?? "").includes("jyv-wpCard")).length, 5, "4行2列：5 蜂 → 5 卡全渲染（第 3 行 1 蜂居左）");
eq(collect(panelGrid, (n) => String(n.props.className ?? "").includes("jyv-wpPlaceholder")).length, 1, "4行2列：第 3 行右侧 1 占位补行（高 = 3 行，未撑满 4 行）");
ok(collect(panelPh, (n) => String(n.props.className ?? "").includes("jyv-wpPlaceholder")).every((n) => n.props.onClick === undefined), "占位卡不接受点击");

/* ── 3b. 框选多选数据源 + 16:9 左图右文卡（hive-marquee-and-card-rework 4.1/4.4/4.5） ── */
const marqueeBees = [
  { sessionId: "bee-1", displayTitle: "工蜂一", state: "idle", drones: [], activeDroneCount: 0 },
  { sessionId: "bee-2", displayTitle: "工蜂二", state: "help", drones: [{}, {}], activeDroneCount: 1, todos: { done: 2, total: 3 } }
];
const panelMarquee = render(WorkerPanel({ t, studio: null, marquee: marqueeBees, layout: { panelM: 2, panelN: 2 }, assignments: {}, beeTypes: [], onPickBee: () => {} }));
ok(panelMarquee != null, "框选多选集非空 → 面板呈现（无巢选中亦可）");
eq(String(panelMarquee.props["data-mode"] ?? ""), "marquee", "面板 data-mode = marquee（双数据源标记）");
ok(textOf(panelMarquee).includes("hive.panel.selected") && textOf(panelMarquee).includes("2"), "头部计数 = 已选 N 只");
eq(collect(panelMarquee, (n) => String(n.props.className ?? "").includes("jyv-wpPlaceholder")).length, 0, "marquee 模式 SHALL NOT 呈现占位卡");
eq(
  collect(panelMarquee, (n) => n.tag === "button" && String(n.props.className ?? "").includes("jyv-wpCard")).map((c) => c.props.title),
  ["工蜂一", "工蜂二"],
  "marquee 卡按投影序冻结数组原样排列（SHALL NOT 重排）"
);
const marqueeCard0 = collect(panelMarquee, (n) => n.tag === "button" && String(n.props.className ?? "").includes("jyv-wpCard"))[0];
eq(collect(marqueeCard0, (n) => String(n.props.className ?? "").includes("jyv-wpFig")).length, 1, "卡内左列模型渲染区（jyv-wpFig，16:9 左图右文）");
eq(collect(marqueeCard0, (n) => String(n.props.className ?? "").includes("jyv-wpBody")).length, 1, "卡内右列文字栈（jyv-wpBody）");
let marqueePicked = null;
const panelMarquee2 = render(WorkerPanel({ t, studio: null, marquee: marqueeBees, layout: { panelM: 2, panelN: 2 }, assignments: {}, beeTypes: [], onPickBee: (id) => { marqueePicked = id; } }));
collect(panelMarquee2, (n) => n.tag === "button" && String(n.props.className ?? "").includes("jyv-wpCard"))[1].props.onClick();
eq(marqueePicked, "bee-2", "marquee 点卡 → onPickBee（清多选跳蜂链路由外壳执行 clearMarquee + selectBee）");
const panelStudioMode = render(WorkerPanel({ t, studio, layout: { panelM: 2, panelN: 2 }, assignments: {}, beeTypes: [], onPickBee: () => {} }));
eq(String(panelStudioMode.props["data-mode"] ?? ""), "studio", "studio 模式 data-mode 标记（巢选中模式行为全保留）");

/* ── 3c. 卡片预览组合键（hive-marquee-and-card-rework 5.3/5.4）：键 = `${modelId}:${state}` ── */
const previewBees = [{ sessionId: "bee-p", displayTitle: "预览蜂", state: "busy", cellIndex: 0, drones: [], activeDroneCount: 0 }];
const previewMap = { "worker:idle": "data:image/png;base64,IDLE", "worker:busy": "data:image/png;base64,BUSY" };
const panelPreview = render(WorkerPanel({ t, studio: { workspaceId: "ws-p", capacity: 19, bees: previewBees }, layout: { panelM: 1, panelN: 2 }, assignments: {}, beeTypes: [], previews: previewMap, onPickBee: () => {} }));
eq(
  collect(panelPreview, (n) => n.tag === "img").map((i) => i.props.src),
  ["data:image/png;base64,BUSY"],
  "预览键 = 外观模型 × 状态（busy 蜂取 worker:busy 快照，状态变化即时换图）"
);
const panelPreviewMissing = render(WorkerPanel({ t, studio: { workspaceId: "ws-p", capacity: 19, bees: [{ ...previewBees[0], state: "help" }] }, layout: { panelM: 1, panelN: 2 }, assignments: {}, beeTypes: [], previews: previewMap, onPickBee: () => {} }));
eq(collect(panelPreviewMissing, (n) => n.tag === "img").length, 0, "组合键未就绪（help 无快照）→ 无图降级纯文字，SHALL NOT 报错/阻塞其余卡");

/* ── 4. 左纵排模态（4.4/5.1） ── */
const guardRef = { current: null };
const settingsModal = render(HiveSettingsModal({ t, settings: { layout: layout0 }, setSettings: () => {}, guardRef, onClose: () => {} }));
const railTabs = collect(settingsModal, (n) => n.props?.id && String(n.props.id).startsWith("jyv-railTab-"));
/* 左纵排五节（add-hive-voice-desk 起追加「语音」节；proposal-panel-config 追加「提案」节） */
eq(railTabs.map((n) => n.props.id), ["jyv-railTab-scene", "jyv-railTab-appearance", "jyv-railTab-layout", "jyv-railTab-voice", "jyv-railTab-proposal"], "设置左纵排：场景/外观/布局/语音/提案五节 nav");
ok(typeof guardRef.current === "function", "设置模态守卫已注册（guardRef.current）");
ok(String(collect(settingsModal, (n) => String(n.props.className ?? "").includes("jyv-railNav")).at(0)?.props["aria-orientation"]) === "vertical", "nav rail 纵向（tablist 上下键语义）");
/* 布局节滑杆 onChange → setSettings（即时生效路径） */
let patched = null;
const layoutBody = render(LayoutSettingsBody({ t, settings: { layout: layout0 }, setSettings: (p) => { patched = p; } }));
const sliders = collect(layoutBody, (n) => n.tag === "input" && n.props.type === "range");
eq(sliders.length, 5, "布局节五个控件（panel m/n + bar m/n + 报告行数）");
/* 滑杆量程 = 界常量：panel m∈1–3 / n∈1–8，bar m∈1–8 / n∈1–2，报告行数∈1–20（用户定稿，2026-09-06） */
eq(sliders.map((s) => [s.props.min, s.props.max]), [[1, 3], [1, 8], [1, 8], [1, 2], [1, 20]], "布局滑杆 min/max 与界常量一致（panel 列1-3/行1-8，bar 列1-8/行1-2，报告行数1-20）");
sliders[0].props.onChange({ target: { value: "3" } });
eq(patched?.layout?.panelM, 3, "面板 m 调整即时上报（setSettings → localStorage + 即时重排）");
sliders[2].props.onChange({ target: { value: "8" } });
eq(patched?.layout?.barM, 8, "道具栏 m 调整即时上报");
sliders[4].props.onChange({ target: { value: "20" } });
eq(patched?.reportRows, 20, "报告行数调整即时上报（setSettings → localStorage）");

/* ── 5. 指令编辑模态（5.5） ── */
const hbGuardRef = { current: null };
let hbClosed = false;
const hbModal = render(
  HotbarsModal({
    t,
    hotbars: { hive: [], bee: [], floor: [] },
    beeTypes: [{ id: "bt-design", name: beeTypeName }],
    layout: { barM: 8, barN: 1 },
    guardRef: hbGuardRef,
    onClose: () => { hbClosed = true; },
    onSave: async () => ({ ok: true })
  })
);
const hbTabs = collect(hbModal, (n) => n.props?.id && String(n.props.id).startsWith("jyv-railTab-"));
eq(hbTabs.map((n) => n.props.id), ["jyv-railTab-hive", "jyv-railTab-bee", "jyv-railTab-floor", "jyv-railTab-proposal"], "指令编辑左纵排：巢栏/蜂栏/地板栏/提案栏四节（第四节随 add-proposal-panel 由「状态卡片」换为「提案栏」）");
ok(textOf(hbModal).includes("hive.hb.empty"), "空配置 → 空态文案");
hbGuardRef.current();
ok(hbClosed, "干净草稿 → 守卫直接关闭（脏草稿走离开提醒，模态栈同层按打开序消费）");
/* 蜂种下拉跟随蜂群编辑：beeTypes 镜像 + 默认蜂项（选中行展开编辑表单后可见） */
const hbProps2 = {
  t,
  hotbars: { hive: [{ id: "h1", name: "巢召唤", summon: true, autoSend: false }], bee: [], floor: [] },
  beeTypes: [{ id: "bt-design", name: beeTypeName }],
  layout: { barM: 8, barN: 1 },
  guardRef: { current: null },
  onClose: () => {},
  onSave: async () => ({ ok: true })
};
hookCells = []; hookIndex = 0; // 新组件实例
const hbModal2a = render(HotbarsModal(hbProps2));
const hbRows = collect(hbModal2a, (n) => String(n.props.className ?? "").includes("jyv-qcRow") && typeof n.props.onClick === "function");
eq(hbRows.length, 1, "巢栏节渲染槽位列表行");
hbRows[0].props.onClick(); // 选中行 → 编辑表单展开（selectedId 置位）
hookIndex = 0; // 第二遍渲染：复用同一组 useState 胞元（保持 selectedId）
const hbModal2 = render(HotbarsModal(hbProps2));
const options = collect(hbModal2, (n) => n.tag === "option").map((o) => o.props.value);
ok(options.includes("bt-design") && options.includes(""), "蜂种下拉含默认蜂项 + beeTypes 镜像（跟随蜂群编辑实时更新）");
const prompts = collect(hbModal2, (n) => n.tag === "textarea");
eq(prompts.length, 1, "选中行展开提示词编辑表单");

/* ══ 5b. 指令编辑：模型/档位下拉（add-hotbar-llm-model-and-import 5.5 / spec hotbar-card-model） ══ */

const zhDict = localeCaptures.find((c) => c.dict?.zh)?.dict.zh ?? {};
const tZh = (key) => (typeof zhDict[key] === "string" ? zhDict[key] : key); // 真实中文词典（汇报模板与文案断言）
const L = (key) => tZh(key); // 界面标签文本（断言用；t 已本地化，不再是裸键）
const catalogFixture = {
  groups: [
    {
      id: "p-a",
      name: "A 家",
      models: [
        { id: "glm-5.3-flash", name: "GLM 5.3 Flash", reasoning: { efforts: [{ id: "low", name: "低" }, { id: "high", name: "高" }], defaultEffort: "low" } },
        { id: "plain", name: "Plain" },
        { id: "org/sub", name: "带斜杠" }
      ]
    }
  ]
};
const beeSlotProps = (over = {}) => ({
  t: tZh,
  hotbars: { hive: [], bee: [{ id: "b1", name: "蜂指令", prompt: "跑测试", autoSend: false }], floor: [] },
  beeTypes: [{ id: "bt-design", name: beeTypeName }],
  layout: { barM: 8, barN: 1 },
  guardRef: { current: null },
  onClose: () => {},
  onSave: async () => ({ ok: true }),
  onNotify: () => {},
  modelCatalog: catalogFixture,
  modelState: "ready",
  ...over
});
/* 渲染助手：进入蜂栏节 → 展开选中槽位（多遍渲染复用同一组 hook 胞元） */
const pass = (props) => {
  hookIndex = 0; // 每遍渲染从第一个 hook 胞元开始（与既有断言同款纪律）
  return render(HotbarsModal(props));
};
const openBeeForm = (props) => {
  hookCells = []; hookIndex = 0;
  pass(props);
  collect(pass(props), (n) => n.props?.id === "jyv-railTab-bee")[0].props.onClick(); // 切到蜂栏节
  collect(pass(props), (n) => String(n.props.className ?? "").includes("jyv-qcRow") && typeof n.props.onClick === "function")[0].props.onClick(); // 展开表单
  return pass(props);
};
const fieldOf = (tree, labelText) => {
  const label = collect(tree, (n) => n.tag === "label" && String(n.props.className ?? "").includes("jyv-swarmField") && textOf(n).includes(labelText));
  return label.length ? label[0] : null;
};
const selectOf = (tree, labelText) => {
  const label = fieldOf(tree, labelText);
  return label ? collect(label, (n) => n.tag === "select")[0] : null;
};

/* 模型下拉：空键首项 + 每模型一项（不按档位展平）+ 值轨道 */
let formTree = openBeeForm(beeSlotProps());
const modelSelect = selectOf(formTree, L("hive.hb.model"));
ok(modelSelect, "蜂栏槽位展开表单含「LLM 模型」下拉（5.1）");
eq(modelSelect.props.value, "", "未绑定 → 受控 value = 空键（使用默认模型）");
eq(collect(modelSelect, (n) => n.tag === "option").map((o) => o.props.value), ["", "p-a/glm-5.3-flash", "p-a/plain", "p-a/org/sub"], "模型下拉：空键首项 + 每模型一项（两维键，不按档位展平）");
eq(textOf(collect(modelSelect, (n) => n.tag === "option")[0]), "使用默认模型", "首项文案 = 保留词条 hive.swarm.modelNone");
ok(!collect(modelSelect, (n) => n.tag === "option").some((o) => /低|高/.test(textOf(o))), "模型下拉 SHALL NOT 出现档位名（档位归独立控件）");
eq(selectOf(formTree, L("hive.hb.effort")), null, "未绑定模型 → 档位下拉整控件不渲染");

/* 选择模型 → 即时显示；档位控件联动出现（预选首项「模型默认档位」） */
modelSelect.props.onChange({ target: { value: "p-a/glm-5.3-flash" } });
hookIndex = 0;
formTree = render(HotbarsModal(beeSlotProps()));
eq(selectOf(formTree, L("hive.hb.model")).props.value, "p-a/glm-5.3-flash", "选择后受控 value 精确命中（值轨道同源，不弹回默认）");
const effortSelect = selectOf(formTree, L("hive.hb.effort"));
ok(effortSelect, "所选模型暴露 reasoning.efforts → 档位下拉渲染");
eq(collect(effortSelect, (n) => n.tag === "option").map((o) => o.props.value), ["", "low", "high"], "档位项 = 首项空键 + efforts（defaultEffort 不额外产项 → 无重键）");
eq(effortSelect.props.value, "", "预选 = 首项「模型默认档位」（尚未绑定档位）");

/* 选定档位 → 回显；换到无 efforts 的模型 → 档位控件收起；含 `/` 的 model id 反查 */
effortSelect.props.onChange({ target: { value: "high" } });
hookIndex = 0;
formTree = render(HotbarsModal(beeSlotProps()));
eq(selectOf(formTree, L("hive.hb.effort")).props.value, "high", "选定档位后回显（受控 value = 绑定档位键）");
selectOf(formTree, L("hive.hb.model")).props.onChange({ target: { value: "p-a/plain" } });
hookIndex = 0;
formTree = render(HotbarsModal(beeSlotProps()));
eq(selectOf(formTree, L("hive.hb.model")).props.value, "p-a/plain", "换模型后回显新模型");
eq(selectOf(formTree, L("hive.hb.effort")), null, "所选模型无 reasoning.efforts → 档位下拉不渲染");
selectOf(formTree, L("hive.hb.model")).props.onChange({ target: { value: "p-a/org/sub" } });
hookIndex = 0;
formTree = render(HotbarsModal(beeSlotProps()));
ok(collect(selectOf(formTree, L("hive.hb.model")), (n) => n.tag === "option").some((o) => o.props.value === "p-a/org/sub"), "含 / 的 model id 键命中真实 option（映射反查，无字符串解析）");

/* 保存链路：model 与档位落草稿载荷 */
let savedSlots = null;
const saveProps = beeSlotProps({ onSave: async (next) => { savedSlots = next; return { ok: true }; } });
let saveTree = openBeeForm(saveProps);
selectOf(saveTree, L("hive.hb.model")).props.onChange({ target: { value: "p-a/glm-5.3-flash" } });
hookIndex = 0;
saveTree = render(HotbarsModal(saveProps));
selectOf(saveTree, L("hive.hb.effort")).props.onChange({ target: { value: "high" } });
hookIndex = 0;
saveTree = render(HotbarsModal(saveProps));
await collect(saveTree, (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0].props.onClick();
eq(savedSlots?.bee?.[0]?.model, { provider: "p-a", model: "glm-5.3-flash", reasoningEffort: "high" }, "保存链路：槽位 model 形状 {provider, model, reasoningEffort} 落草稿载荷");

/* 重开回显 + 切回「使用默认模型」→ 清字段（undefined，SHALL NOT 留空对象占位） */
let savedCleared = null;
const clearProps = beeSlotProps({
  hotbars: { hive: [], bee: [{ id: "b1", name: "蜂指令", prompt: "跑测试", autoSend: false, model: { provider: "p-a", model: "glm-5.3-flash", reasoningEffort: "high" } }], floor: [] },
  onSave: async (next) => { savedCleared = next; return { ok: true }; }
});
let clearTree = openBeeForm(clearProps);
eq(selectOf(clearTree, L("hive.hb.model")).props.value, "p-a/glm-5.3-flash", "已绑定模型重开 → 精确回显（不弹回默认）");
eq(selectOf(clearTree, L("hive.hb.effort")).props.value, "high", "已绑定档位重开 → 精确回显");
selectOf(clearTree, L("hive.hb.model")).props.onChange({ target: { value: "" } });
hookIndex = 0;
clearTree = render(HotbarsModal(clearProps));
eq(selectOf(clearTree, L("hive.hb.model")).props.value, "", "切回「使用默认模型」→ 空键");
await collect(clearTree, (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0].props.onClick();
ok(savedCleared !== null && !("model" in savedCleared.bee[0]), "切回默认 → 载荷无 model 键（undefined 不落盘）");

/* 目录不可用（无活会话/拉取失败）：提示替代控件 + 草稿已存值保留 */
let savedUnavailable = null;
const unavailProps = beeSlotProps({
  hotbars: { hive: [], bee: [{ id: "b1", name: "蜂指令", prompt: "跑测试", autoSend: false, model: { provider: "p-a", model: "glm-5.3-flash" } }], floor: [] },
  modelCatalog: null,
  modelState: "unavailable",
  onSave: async (next) => { savedUnavailable = next; return { ok: true }; }
});
const unavailTree = openBeeForm(unavailProps);
ok(!selectOf(unavailTree, L("hive.hb.model")), "目录不可用 → 无模型下拉（提示替代）");
ok(textOf(unavailTree).includes(L("hive.swarm.modelUnavailable")), "目录不可用提示呈现");
await collect(unavailTree, (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0].props.onClick();
eq(savedUnavailable?.bee?.[0]?.model, { provider: "p-a", model: "glm-5.3-flash" }, "不可用态只挡新选择：草稿已存模型值保留（SHALL NOT 清空或改写）");

/* ══ 5b2. 蜂栏「新开会话」表单（new-session-hotbar 4.1/4.2/D3） ══
   勾选框默认不勾；蜂种下拉随 newSession 联动禁用（缺省「默认蜂」）；
   模型/档位控件恒启用（直发 = 切当前蜂模型 / 召唤 = 新蜂选型），hint 双语义。 */
const beeNewSessionBoxOf = (tree) =>
  collect(tree, (n) => n.props?.["data-testid"] === "hb-bee-newSession")[0];
const beeTypeSelectOf = (tree) => collect(tree, (n) => n.props?.["data-testid"] === "hb-beeType")[0];
let nsForm = openBeeForm(beeSlotProps());
const nsBox = beeNewSessionBoxOf(nsForm);
ok(nsBox, "蜂栏节槽位表单含「新开会话」勾选框（data-testid）");
eq(nsBox.props.checked, false, "新开会话默认不勾（缺省 = 既有双通道）");
eq(textOf(nsForm).includes(L("hive.hb.newSession")), true, "勾选框文案 = 本地化「新开会话」");
eq(beeTypeSelectOf(nsForm).props.disabled, true, "未勾 newSession → 蜂种下拉联动禁用");
eq(beeTypeSelectOf(nsForm).props.value, "", "蜂种缺省 = 默认蜂（空键）");
eq(selectOf(nsForm, L("hive.hb.model")).props.disabled, false, "模型下拉恒启用（直发语义仍可用）");
ok(textOf(nsForm).includes(L("hive.hb.beeModelHint")), "模型 hint 呈现双语义说明");
nsBox.props.onChange({ target: { checked: true } });
hookIndex = 0;
nsForm = render(HotbarsModal(beeSlotProps()));
eq(beeNewSessionBoxOf(nsForm).props.checked, true, "勾选后受控回显");
eq(beeTypeSelectOf(nsForm).props.disabled, false, "勾选 newSession → 蜂种下拉可用");
/* 保存链路：newSession + 蜂种随载荷落盘（未勾时读取裁剪由 normalize 侧保证） */
let nsPayload = null;
const nsSaveProps = beeSlotProps({ onSave: async (next) => { nsPayload = next; return { ok: true }; } });
let nsSaveTree = openBeeForm(nsSaveProps);
beeNewSessionBoxOf(nsSaveTree).props.onChange({ target: { checked: true } });
hookIndex = 0;
nsSaveTree = render(HotbarsModal(nsSaveProps));
beeTypeSelectOf(nsSaveTree).props.onChange({ target: { value: "bt-design" } });
hookIndex = 0;
nsSaveTree = render(HotbarsModal(nsSaveProps));
await collect(nsSaveTree, (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0].props.onClick();
eq(nsPayload?.bee?.[0]?.newSession, true, "保存载荷携带 newSession=true（勾选后）");
eq(nsPayload?.bee?.[0]?.beeTypeId, "bt-design", "保存载荷携带蜂种（联动可用后）");
/* 直接保存一个未勾槽位 → 载荷不含 newSession/beeTypeId（缺省不物化） */
let nsDefaultPayload = null;
const nsDefaultProps = beeSlotProps({ onSave: async (next) => { nsDefaultPayload = next; return { ok: true }; } });
const nsDefaultTree = openBeeForm(nsDefaultProps);
await collect(nsDefaultTree, (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0].props.onClick();
ok(nsDefaultPayload !== null && !("newSession" in nsDefaultPayload.bee[0]) && !("beeTypeId" in nsDefaultPayload.bee[0]), "未勾 newSession → 载荷无 newSession/beeTypeId 键（缺省不物化）");

/* ══ 5b3. 提案栏节表单（new-session-hotbar 4.3/6.2/D6） ══
   「新召唤」开关退役（恒召唤）；蜂种/模型恒可用；恒召唤说明呈现。 */
const openSectionForm = (props, tabId) => {
  hookCells = []; hookIndex = 0;
  pass(props);
  collect(pass(props), (n) => n.props?.id === tabId)[0].props.onClick();
  collect(pass(props), (n) => String(n.props.className ?? "").includes("jyv-qcRow") && typeof n.props.onClick === "function")[0].props.onClick();
  return pass(props);
};
const proposalFormProps = beeSlotProps({
  hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p1", name: "推进", prompt: "推进 {change}", autoSend: false }] }
});
const proposalForm = openSectionForm(proposalFormProps, "jyv-railTab-proposal");
eq(collect(proposalForm, (n) => n.tag === "label" && textOf(n) === L("hive.hb.summon")).length, 0, "提案栏节 SHALL NOT 呈现「召唤新蜂」开关（恒召唤）");
eq(selectOf(proposalForm, L("hive.hb.beeType")).props.disabled, false, "提案栏蜂种恒可用（不随任何开关联动）");
eq(selectOf(proposalForm, L("hive.hb.model")).props.disabled, false, "提案栏模型恒可用（恒召唤 = 新蜂选型）");
ok(textOf(proposalForm).includes(L("hive.hb.proposalAlwaysSummonHint")), "提案栏恒召唤说明呈现");
ok(textOf(proposalForm).includes(L("hive.hb.proposalCiteName")), "引用提案目录勾选框仍在（提案栏专属控件保留）");

/* ══ 5c. 蜂栏「导入快捷功能」（plugin-config-import；5.2/5.3/5.5） ══ */

const importBtnOf = (tree) => collect(tree, (n) => String(n.props.className ?? "").includes("jyv-hbImport"))[0];
/* 进入蜂栏节（可用性探针在挂载 effect 内，需等一个宏任务落地） */
const openBeeSection = async (props) => {
  hookCells = []; hookIndex = 0;
  pass(props);
  await new Promise((resolve) => setTimeout(resolve, 0));
  collect(pass(props), (n) => n.props?.id === "jyv-railTab-bee")[0].props.onClick();
  const tree = pass(props);
  await new Promise((resolve) => setTimeout(resolve, 0));
  return pass(props);
};
const beeRowCount = (tree) => collect(tree, (n) => String(n.props.className ?? "").includes("jyv-qcRow") && typeof n.props.onClick === "function").length;
const saveOf = (tree) => collect(tree, (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0];

/* 入口只出现在蜂栏节（巢栏/地板栏 SHALL NOT 出现） */
hookCells = []; hookIndex = 0;
eq(importBtnOf(render(HotbarsModal(beeSlotProps()))), undefined, "巢栏节不出现「导入快捷功能」入口");

/* 未安装/未启用（available:false + namespace-unregistered）→ 按钮灰置 + 悬停原因 */
importResponder = (respond) => respond(200, { ok: true, available: false, reason: "namespace-unregistered" });
const importBtnOff = importBtnOf(await openBeeSection(beeSlotProps()));
ok(importBtnOff, "蜂栏节呈现「导入快捷功能」按钮");
eq(importBtnOff.props.disabled, true, "源不可用 → 按钮灰置（不可点击）");
eq(importBtnOff.props.title, L("hive.hb.importNotInstalled"), "悬停说明 = 未安装/未启用文案");

/* 宿主 settings 缺席 → 两态文案可区分 */
importResponder = (respond) => respond(200, { ok: true, available: false, reason: "settings-service-absent" });
eq(importBtnOf(await openBeeSection(beeSlotProps())).props.title, L("hive.hb.importServiceAbsent"), "悬停说明 = 宿主 settings 缺席文案（两态可区分）");

/* 可用：重名跳过 + model 1:1 + 非法 model 剥离 + 三计数 toast */
importResponder = (respond) =>
  respond(200, {
    ok: true,
    available: true,
    buttons: [
      { name: "设计", prompt: "做设计", autoSend: true, model: { provider: "p-a", model: "glm-5.3-flash", reasoningEffort: "max" } },
      { name: "蜂指令", prompt: "重名条目", autoSend: false },
      { name: "新建", prompt: "新建提案", autoSend: true, model: { provider: "", model: "破" } }
    ]
  });
const toasts = [];
let importedPayload = null;
const importProps = beeSlotProps({
  onNotify: (text, kind) => toasts.push({ text, kind }),
  onSave: async (next) => { importedPayload = next; return { ok: true }; }
});
const importTree = await openBeeSection(importProps);
const importBtnOn = importBtnOf(importTree);
eq(importBtnOn.props.disabled, false, "源可用 → 按钮可点");
await importBtnOn.props.onClick();
hookIndex = 0;
const importedTree = render(HotbarsModal(importProps));
eq(beeRowCount(importedTree), 3, "导入 2 条 → 蜂栏草稿 1 + 2 = 3 行（重名条目跳过不导入）");
eq(toasts.at(-1)?.text, "导入 2 条，跳过 1 条（重名），因容量未导入 0 条", "toast 汇报三计数（调用方填好模板文本后透出）");
eq(toasts.at(-1)?.kind, "ok", "有导入 → ok 级 toast");

/* 导入条目落草稿形态：id 重铸 + 保序 + model 1:1 / 非法剥离（保存载荷核对） */
await saveOf(importedTree).props.onClick();
eq(importedPayload.bee.length, 3, "保存载荷 = 既有 + 导入条目");
eq(importedPayload.bee[1].name, "设计", "导入条目按源数组序追加（保序）");
eq(importedPayload.bee[1].model, { provider: "p-a", model: "glm-5.3-flash", reasoningEffort: "max" }, "model 1:1 映射（含档位）");
eq(importedPayload.bee[2].name, "新建", "重名者被跳过后的下一条照常导入");
ok(!("model" in importedPayload.bee[2]), "形状非法 model → 剥离字段但保留条目主体");
ok(importedPayload.bee[1].id !== "b1" && importedPayload.bee[1].id !== importedPayload.bee[2].id, "id 重新铸造（不与既有/彼此冲突）");
ok(!("model" in importedPayload.bee[0]) && importedPayload.bee[0].name === "蜂指令", "既有槽位未被覆盖（重名不自动改名）");

/* 容量截断：已有 30 条（上限 32）→ 仅前 2 条导入，K = 3 */
const manyBee = Array.from({ length: 30 }, (_, i) => ({ id: "x" + i, name: "槽" + i, prompt: "p" + i, autoSend: false }));
importResponder = (respond) => respond(200, { ok: true, available: true, buttons: Array.from({ length: 5 }, (_, i) => ({ name: "新" + i, prompt: "p", autoSend: false })) });
const capToasts = [];
let capPayload = null;
const capProps = beeSlotProps({
  hotbars: { hive: [], bee: manyBee, floor: [] },
  onNotify: (text, kind) => capToasts.push({ text, kind }),
  onSave: async (next) => { capPayload = next; return { ok: true }; }
});
const capTree = await openBeeSection(capProps);
await importBtnOf(capTree).props.onClick();
hookIndex = 0;
const capTree2 = render(HotbarsModal(capProps));
eq(beeRowCount(capTree2), 32, "容量截断：30 + 2 = 32（其余未导入）");
await saveOf(capTree2).props.onClick();
eq(capPayload.bee.length, 32, "蜂栏 32 上限：装不下的条目 SHALL NOT 落稿");
eq(capToasts.at(-1)?.text, "导入 2 条，跳过 0 条（重名），因容量未导入 3 条", "容量截断逐条判定：装不下即止计 K（保序不回填）");

/* 拉取失败（404 宿主旧版无该路由）→ toast 且草稿零变化（无半批） */
importResponder = (respond) => respond(404, { error: "unknown route" });
const failToasts = [];
let failSaved = null;
const failProps = beeSlotProps({ onNotify: (text, kind) => failToasts.push({ text, kind }), onSave: async (next) => { failSaved = next; return { ok: true }; } });
const failTree = await openBeeSection(failProps);
const failBtn = importBtnOf(failTree);
eq(failBtn.props.disabled, false, "拉取失败态保持可点（点击重试，非灰置——灰置只表「源不可用」）");
await failBtn.props.onClick();
hookIndex = 0;
const failTree2 = render(HotbarsModal(failProps));
eq(beeRowCount(failTree2), 1, "拉取失败 → 草稿零变化（无半批导入）");
eq(failToasts.at(-1)?.text, "导入失败：宿主未重启或版本较旧（缺少导入端点）——请重启 dsh 后重试", "拉取失败 toast 含「宿主未重启或版本较旧」提示");
eq(failToasts.at(-1)?.kind, "err", "失败 → err 级 toast");
await saveOf(failTree2).props.onClick();
eq(failSaved.bee.length, 1, "保存载荷仍为导入前草稿（无半批残留）");
importResponder = null;

/* ── 6. 保存链路（5.3）：ctl().actions.saveHotbars → PUT 409 重放 ── */
const storeActionsStub = {
  setFullscreen() {}, toggleLegend() {}, clearToast() {}, notify() {}, setSettings() {},
  openFloat() {}, closeFloat() {}
};
const face = pageEntry.decl.inject(storeActionsStub);
await new Promise((resolve) => setTimeout(resolve, 0)); // 控制器启动 fetchState 先落地
fetchCalls.length = 0;
putCount = 0;
const nextHotbars = {
  hive: [{ id: "h1", name: "巢召唤", summon: true, beeTypeId: "bt-design", prompt: "开工", autoSend: true }],
  bee: [{ id: "b1", name: "跑测试", prompt: "npm test", autoSend: false }],
  floor: []
};
const saveResult = await face.ctl().actions.saveHotbars(nextHotbars);
ok(saveResult.ok === true, "saveHotbars 成功（409 重放后）");
const puts = fetchCalls.filter((c) => c.method === "PUT");
eq(puts.length, 2, "PUT 恰好两次（409 → 重放一次）");
eq(normalizeHotbars(puts[0].body.hotbars), normalizeHotbars(nextHotbars), "首次 PUT 携带读取时 revision + hotbars 整体对象");
eq(puts[0].body.revision, 5, "首次 PUT revision = 读取时 revision");
eq(normalizeHotbars(puts[1].body.hotbars), normalizeHotbars(nextHotbars), "重放 PUT = 最新 revision + hotbars 整体替换（不掺 positions）");
eq(puts[1].body.revision, 6, "重放 PUT revision = 冲突帧 revision");
ok(puts[0].body.positions === undefined && puts[1].body.positions === undefined, "PUT 不掺 positions（整体替换语义）");

console.log("ALL HOTBARS UI SMOKE TESTS PASSED");
