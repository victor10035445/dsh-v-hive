/**
 * 会话导航迁移冒烟（fix-rc5-session-navigation-migration 5.3）：在 factory-smoke /
 * hotbars-ui-smoke 同款沙箱里执行 lib/client.js 懒 CJS 工厂，直测 **rc.5 会话导航契约**
 * 的两条腿（动作面 + 读源面）——不需要 WebGL、不需要真实 React 树：
 *
 *  ① 单点出口 `currentSessionIdOf(ctx)` 的三态：
 *     - 主源命中（uiSession.adapter.current 快照 `.key` 即 sessionId）；
 *     - absent 形态（`key: void 0`）与形状不符（非字符串 key）→ 回落降级镜像；
 *     - 降级镜像 = 本插件最近一次**成功** openSession 的目标（模块级、初值 null）。
 *  ② 动作通道映射：`uiWorkspace.openSession(target)` 覆盖 SessionId 与 SubagentAddress
 *     （`SessionTarget` 联合类型），含「无地址时回落 sessionId」与「宿主 fail-loud 上抛
 *     且不污染镜像」两条 rc.5 语义（spike.md S2）。
 *  ③ 契约闸门的双向断言（正一反一）住在 `test/host-export-contract-smoke.mjs` 的
 *     `selfCheckGate()`：禁词表对真实违规夹具全命中、对良性行零误报；成员级断言
 *     命中 `list`、不把注释里的独立词 `open` 当成员。本文件不重复该闸门（防两份正则漂移）。
 *
 * 运行：node test/session-navigation-smoke.mjs（先 node build.mjs）
 */
import { readFileSync } from "node:fs";

const code = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");

const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};
const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};

/* ── React 桩（state/ref 跨调用保持；effects 立即执行） ── */
function createReact() {
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
      if (!hookCells[i]) hookCells[i] = { current: init };
      return hookCells[i];
    },
    useEffect: (fn) => {
      void fn();
    },
    useLayoutEffect: () => {},
    useMemo: (fn) => fn(),
    useCallback: (fn) => fn,
    useSyncExternalStore: (subscribe, getSnapshot) => {
      const snapshot = getSnapshot();
      subscribe(() => {});
      return snapshot;
    },
    createElement: (type, props) => ({ type, props }),
    forwardRef: (fn) => fn,
    StrictMode: function StrictMode() {},
    memo: (fn) => fn
  };
  react.default = react;
  return react;
}

const jsxRuntime = {
  Fragment: Symbol.for("react.fragment"),
  jsx: (type, props) => ({ type, props }),
  jsxs: (type, props) => ({ type, props }),
  jsxDEV: (type, props) => ({ type, props })
};

/** dsh-client-store 的 defineStore 桩（store.mjs 的布局/设置 store 用它建快照面）。 */
function defineStoreStub(decl) {
  let state = null;
  const listeners = new Set();
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
          Object.entries(decl.actions ?? {}).map(([name, fn]) => [
            name,
            (...args) => {
              const draft = JSON.parse(JSON.stringify(state));
              const returned = fn(draft, ...args);
              state = Object.freeze(returned ?? draft);
              for (const listener of [...listeners]) listener();
              return returned;
            }
          ])
        )
      };
    }
  };
}

/* ── 最小 DOM（沿 hive-page-render-smoke 口径：只够 apply 阶段不炸） ── */
function createDom() {
  const elementStub = () => {
    const element = {
      style: { setProperty() {}, removeProperty() {} },
      classList: { add() {}, remove() {}, toggle() {} },
      addEventListener() {},
      removeEventListener() {},
      appendChild() {},
      remove() {},
      setAttribute() {},
      closest: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      contains: () => false,
      getBoundingClientRect: () => ({ right: 1200, left: 0, width: 1200, height: 900, top: 0, bottom: 900 }),
      dataset: {},
      children: [],
      parentElement: null,
      textContent: "",
      innerHTML: "",
      isConnected: true
    };
    element.style.ownerElement = element;
    return element;
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
  const documentStub = {
    head: { appendChild() {} },
    body: {
      appendChild() {},
      observe() {},
      contains: () => false,
      dataset: {},
      style: {},
      classList: { add() {}, remove() {}, toggle() {} }
    },
    createElement: elementStub,
    querySelector: () => elementStub(),
    querySelectorAll: () => [],
    addEventListener() {},
    removeEventListener() {},
    visibilityState: "visible",
    hidden: false,
    hasFocus: () => true
  };
  const sandbox = {
    window: windowStub,
    document: documentStub,
    localStorage: { getItem: () => null, setItem() {} },
    performance,
    requestAnimationFrame: () => 0,
    cancelAnimationFrame() {},
    navigator: { userAgent: "smoke", hardwareConcurrency: 8 },
    location: { href: "http://localhost/" },
    console: { log() {}, info() {}, debug() {}, warn() {}, error: () => {}, trace() {} },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    URL,
    URLSearchParams,
    Event: class Event {},
    fetch: async () => ({ ok: false, status: 404, json: async () => ({}) }),
    AbortController,
    ResizeObserver: class { observe() {} disconnect() {} unobserve() {} },
    MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } },
    HTMLElement: class HTMLElement {},
    HTMLTextAreaElement: class HTMLTextAreaElement {},
    Element: class Element {},
    Node: class Node {},
    queueMicrotask,
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    Image: class Image {}
  };
  return { sandbox, windowStub, documentStub };
}

/**
 * 加载一份**全新**的 bundle 实例（模块级读源/镜像状态互不串味——两个场景需要两态）。
 * @param {{ uiSession: boolean }} options false = 宿主无 uiSession 服务（降级态）
 */
function instantiate({ uiSession }) {
  const { sandbox, windowStub } = createDom();
  const react = createReact();

  const openCalls = [];
  const registered = [];
  const injectCalls = [];
  const currentListeners = [];
  let snapshot = { key: "s-main" };
  const uiSessionService = uiSession
    ? {
        adapter: {
          current: {
            getSnapshot: () => snapshot,
            subscribe: (listener) => {
              currentListeners.push(listener);
              return () => {
                const index = currentListeners.indexOf(listener);
                if (index !== -1) currentListeners.splice(index, 1);
              };
            }
          }
        }
      }
    : null;

  const ctxStub = {
    effect(fn) {
      const disposer = fn();
      return () => disposer?.();
    },
    locale: { register() {}, bind() { return (key) => key; } },
    slots: {
      inject(name, cb) {
        cb();
      },
      register(decl, Component) {
        registered.push({ decl, Component });
      }
    },
    sessions: {
      list: {
        getSnapshot: () => ({
          ids: ["s-main"],
          /* blank 行：让 anyLiveSessionId 的「任一活会话」循环落空，从而暴露兜底取值面
             （单点出口）——本文件用它验证派生读点是否跟随主源。 */
          byId: { "s-main": { id: "s-main", displayTitle: "main", origin: "user", blank: true } },
          phase: "ready"
        }),
        subscribe: () => () => {}
      },
      refresh: async () => {},
      subagentAddress: (id) =>
        id === "d-addressed" ? { parentSessionId: "s-main", childSessionId: id, mode: "spawn" } : undefined
    },
    workspaces: { list: { getSnapshot: () => ({ items: [], phase: "ready" }), subscribe: () => () => {} } },
    uiWorkspace: {
      openSession(target) {
        openCalls.push(target);
        /* 宿主 fail-loud 形态（spike.md S2：sessions.retain: unknown session） */
        if (target === "unknown-id") throw new Error("sessions.retain: unknown session unknown-id");
      }
    },
    get: (name) => (name === "uiSession" && uiSessionService ? uiSessionService : undefined),
    inject(deps, callback) {
      injectCalls.push([...deps]);
      /* 服务不在册 → 回调不执行（可选消费语义：不阻断外层插件） */
      if (uiSessionService && deps.includes("uiSession")) callback({ uiSession: uiSessionService });
      return { dispose() {} };
    }
  };

  const requireMap = {
    react,
    "react/jsx-runtime": jsxRuntime,
    "react-dom": { createPortal: (children) => children, flushSync: (fn) => fn?.() },
    "@deepseek-ai/dsh-client-ui-primitives": { IconSettingsOutlineMedium: () => null },
    "@deepseek-ai/dsh-client-store": { defineStore: defineStoreStub }
  };
  let exportsRef = null;
  windowStub.__ModuleLoader__ = {
    load({ factory }) {
      exportsRef = factory((specifier) => {
        if (!(specifier in requireMap)) throw new Error("unexpected external require: " + specifier);
        return requireMap[specifier];
      });
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

  ok(exportsRef, "bundle 工厂产出 exports");
  exportsRef.apply(ctxStub);

  /* shell.overlay 条目的 inject 面 = 控制器动作的测试入口（hotbars-ui-smoke 同款）。 */
  const pageEntry = registered.find((entry) => entry.decl?.name === "shell.overlay" && entry.decl?.id === "v-hive-page");
  ok(pageEntry, "shell.overlay 条目已注册（v-hive-page）");
  const face = pageEntry.decl.inject({
    notify() {},
    setFullscreen() {},
    toggleLegend() {},
    clearToast() {},
    setSettings() {},
    openFloat() {},
    closeFloat() {}
  });

  return {
    m: exportsRef,
    ctx: ctxStub,
    openCalls,
    injectCalls,
    currentListeners,
    actions: () => face.ctl().actions,
    setMainKey: (key) => {
      snapshot = { key };
    }
  };
}

/* ────────────────────── ① 单点出口：主源命中 / absent / 形状不符 ────────────────────── */

const main = instantiate({ uiSession: true });

eq(main.m.currentSessionIdOf(main.ctx), "s-main", "主源命中：快照 .key 即当前会话 sessionId");
eq(main.currentListeners.length, 1, "主源 subscribe 已接线（换绑沿 → 哨兵）");
ok(
  main.injectCalls.some((deps) => deps.includes("uiSession")),
  'uiSession 经可选注入回调形态消费（ctx.inject(["uiSession"], cb)）'
);

main.setMainKey(undefined);
eq(main.m.currentSessionIdOf(main.ctx), null, "absent 形态（key: void 0）→ 回落降级镜像（初值 null）");

main.setMainKey(42);
eq(main.m.currentSessionIdOf(main.ctx), null, "形状不符（key 非字符串）→ 回落降级镜像，SHALL NOT 采信");

/* 读源连通 + 哨兵沿：主源换绑后出口跟随；通知触发控制器回调（applyCurrentSession：
   场景选中槽/工蜂门控/概要条定向刷新/镜头跟随沿）不抛异常，派生读点同步跟随。 */
main.setMainKey("s-sidebar");
eq(main.m.currentSessionIdOf(main.ctx), "s-sidebar", "主源换绑后出口跟随新 key");
let sidelineThrew = false;
try {
  for (const listener of [...main.currentListeners]) listener();
} catch {
  sidelineThrew = true;
}
ok(!sidelineThrew, "主源 subscribe 回调（applyCurrentSession）不抛异常");
eq(main.actions().anyLiveSessionId(), "s-sidebar", "派生读点（anyLiveSessionId 兜底）跟随单点出口");

/* ────────────────────── ② 动作通道（SessionId / SubagentAddress） ────────────────────── */

main.actions().selectBee("s-bee");
eq(main.openCalls.at(-1), "s-bee", "selectBee → uiWorkspace.openSession(SessionId)");

main.actions().selectDrone("d-addressed");
eq(
  main.openCalls.at(-1),
  { parentSessionId: "s-main", childSessionId: "d-addressed", mode: "spawn" },
  "selectDrone → openSession(SubagentAddress)：地址对象原样传入（SessionTarget 并集）"
);

main.actions().selectDrone("d-plain");
eq(main.openCalls.at(-1), "d-plain", "selectDrone 无地址证据 → openSession(sessionId) 兜底分支");

/* fail-loud 语义（spike.md S2）：宿主抛错上抛、镜像不被污染 */
main.setMainKey(undefined); // 主源 absent，确保观察的是镜像
const mirrorAfterSuccess = main.m.currentSessionIdOf(main.ctx);
let threw = false;
try {
  main.actions().selectBee("unknown-id");
} catch (error) {
  threw = true;
  ok(/unknown session/.test(String(error?.message ?? "")), "fail-loud 异常原样上抛（sessions.retain: unknown session）");
}
ok(threw, "名单外 id：uiWorkspace.openSession 抛错必须上抛（旧导航动词同形 fail-loud）");
eq(main.m.currentSessionIdOf(main.ctx), mirrorAfterSuccess, "失败动作 SHALL NOT 改写降级镜像");

/* ────────────────────── ①' 降级态（宿主无 uiSession 服务） ────────────────────── */

const degraded = instantiate({ uiSession: false });

ok(
  degraded.injectCalls.some((deps) => deps.includes("uiSession")),
  "降级态仍尝试可选注入（回调形态，服务不在册就不执行）"
);
eq(degraded.currentListeners.length, 0, "服务不在册 → 主源未接线（无 subscribe）");
eq(degraded.m.currentSessionIdOf(degraded.ctx), null, "降级态开页初值：无当前会话（无描边，design D2 已知边界）");

degraded.actions().selectBee("s-mirror");
eq(degraded.m.currentSessionIdOf(degraded.ctx), "s-mirror", "降级态镜像：成功 openSession 后出口返回该目标");

degraded.actions().selectDrone("d-addressed");
eq(
  degraded.m.currentSessionIdOf(degraded.ctx),
  "d-addressed",
  "降级态镜像：SubagentAddress 取 childSessionId 落镜像（出口恒返回 sessionId）"
);

console.log("ALL SESSION NAVIGATION SMOKE TESTS PASSED");
