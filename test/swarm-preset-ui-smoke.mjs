/**
 * 蜂群编辑浮窗「预设提示词」冒烟测试（hive-summon-tool 任务 5.3，沿 hotbars-ui-smoke
 * 先例：factory-smoke 同款沙箱内执行 lib/client.js 懒 CJS 工厂，直测 BeeSwarmModal）：
 *  - 草稿暂存：textarea 输入暂存进草稿（空白 = 无预设，键不落）；
 *  - 保存链路：save → validateBeeTypesDraft 预校验 → normalizeBeeTypes 对齐 →
 *    onSave 收到 trim 后的 presetPrompt；
 *  - 校验拒绝：超上限 → 字段级错误（presetPromptTooLong 词条），onSave 不被调用；
 *  - zh/en 词条齐全（hive.swarm.presetPrompt* / hive.bee.err.presetPrompt*）。
 * 运行：node test/swarm-preset-ui-smoke.mjs（先 node build.mjs）
 */
import { readFileSync } from "node:fs";
import { MAX_PRESET_PROMPT } from "../src/bee-types.mjs";

const code = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── React 桩：useState/useRef 跨调用保持（同一组件实例多遍渲染驱动交互） ── */
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

/* ── 沙箱执行工厂（懒 CJS） ── */
const localeCaptures = [];
const registered = [];
const ctxStub = {
  effect(fn) {
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
  body: { appendChild() {}, observe() {}, contains() { return false; } },
  createElement: () => ({
    style: { setProperty() {}, removeProperty() {} },
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {},
    removeEventListener() {},
    appendChild() {},
    remove() {},
    setAttribute() {},
    dataset: {}
  }),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
  removeEventListener() {},
  visibilityState: "visible"
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
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  URL,
  URLSearchParams,
  Event: class Event {},
  fetch: async () => ({ ok: false, status: 404, json: async () => ({}) }),
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
        "@deepseek-ai/dsh-client-ui-primitives": { IconSettingsOutline16: () => null },
        "@deepseek-ai/dsh-client-store": {
          defineStore: (decl) => {
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

/* ── 渲染助手（与 hotbars-ui-smoke 同款：函数组件直调展开 + 树遍历收集） ── */
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

const { BeeSwarmModal } = m;
ok(typeof BeeSwarmModal === "function", "BeeSwarmModal 已导出（测试面）");

const t = (key) => key;
const mirror = [{ id: "exec", name: "执行蜂", queuePolicy: "free", capabilities: [] }];
const modelProps = { modelCatalog: { groups: [] }, modelState: "ready" };

/* ── 1. 草稿暂存：textarea 输入暂存进草稿 ── */
let savedRows = null;
const props1 = {
  t,
  beeTypes: mirror,
  guardRef: { current: null },
  onClose: () => {},
  onSave: async (rows) => {
    savedRows = rows;
    return { ok: true };
  },
  onNotify: () => {},
  ...modelProps
};
hookCells = []; hookIndex = 0; // 新组件实例
const modal1a = render(BeeSwarmModal(props1));
let presetAreas = collect(modal1a, (n) => n.tag === "textarea" && String(n.props.className ?? "").includes("jyv-swarmPreset"));
eq(presetAreas.length, 1, "蜂种卡呈现「预设提示词」编辑项（textarea）");
eq(presetAreas[0].props.value, "", "旧蜂种（无 presetPrompt）→ 空值渲染");
presetAreas[0].props.onChange({ target: { value: "  先读技能全路径并遵循。  " } });
hookIndex = 0; // 第二遍渲染：复用同一组 useState 胞元（保持草稿）
const modal1b = render(BeeSwarmModal(props1));
presetAreas = collect(modal1b, (n) => n.tag === "textarea" && String(n.props.className ?? "").includes("jyv-swarmPreset"));
eq(presetAreas[0].props.value, "  先读技能全路径并遵循。  ", "输入暂存进草稿（暂存-保存模型）");

const typesPanelSave = (modal) => {
  const panel = collect(modal, (n) => n.props?.id === "jyv-swarmPanel-types")[0];
  return collect(panel, (n) => String(n.props.className ?? "").includes("jyv-qcSave"));
};

/* ── 2. 保存链路：validate → normalize 对齐 → onSave 收到 trim 后字段 ── */
const saveBtn = typesPanelSave(modal1b);
eq(saveBtn.length, 1, "保存按钮在场（types 页签）");
await saveBtn[0].props.onClick();
ok(savedRows !== null, "保存触发 onSave");
eq(savedRows[0].presetPrompt, "先读技能全路径并遵循。", "保存载荷携带 trim 后的 presetPrompt");
eq(savedRows[0].id, "exec", "其余字段原样保留");

/* ── 3. 校验拒绝：超上限 → 字段级错误，onSave 不被调用 ── */
hookCells = []; hookIndex = 0; // 新组件实例（超限草稿）
let rejectedCalled = false;
const props2 = {
  t,
  beeTypes: mirror,
  guardRef: { current: null },
  onClose: () => {},
  onSave: async () => {
    rejectedCalled = true;
    return { ok: true };
  },
  onNotify: () => {},
  ...modelProps
};
const modal2a = render(BeeSwarmModal(props2));
const overArea = collect(modal2a, (n) => n.tag === "textarea" && String(n.props.className ?? "").includes("jyv-swarmPreset"));
overArea[0].props.onChange({ target: { value: "x".repeat(MAX_PRESET_PROMPT + 1) } });
hookIndex = 0;
const modal2b = render(BeeSwarmModal(props2));
const overSave = typesPanelSave(modal2b);
await overSave[0].props.onClick();
hookIndex = 0;
const modal2c = render(BeeSwarmModal(props2));
const alerts = collect(modal2c, (n) => n.props?.role === "alert");
ok(alerts.length >= 1 && alerts.every((a) => textOf(a) === "hive.bee.err.presetPromptTooLong"), "超上限 → 字段级 presetPromptTooLong 提示");
eq(rejectedCalled, false, "校验拒绝 → onSave SHALL NOT 被调用");

/* ── 4. 空白输入 = 无预设（键不落草稿，保存载荷无残留） ── */
hookCells = []; hookIndex = 0;
const props3 = {
  t,
  beeTypes: mirror,
  guardRef: { current: null },
  onClose: () => {},
  onSave: async (rows) => {
    savedRows = rows;
    return { ok: true };
  },
  onNotify: () => {},
  ...modelProps
};
const modal3a = render(BeeSwarmModal(props3));
const blankArea = collect(modal3a, (n) => n.tag === "textarea" && String(n.props.className ?? "").includes("jyv-swarmPreset"));
blankArea[0].props.onChange({ target: { value: "   " } });
hookIndex = 0;
const modal3b = render(BeeSwarmModal(props3));
const blankArea2 = collect(modal3b, (n) => n.tag === "textarea" && String(n.props.className ?? "").includes("jyv-swarmPreset"));
eq(blankArea2[0].props.value, "", "纯空白输入 → 归位无预设（undefined 键不落）");
const blankSave = typesPanelSave(modal3b);
await blankSave[0].props.onClick();
ok(savedRows !== null && !("presetPrompt" in savedRows[0]), "空白保存 → 载荷无 presetPrompt 键（旧文档兼容同形）");

/* ── 5. zh/en 词条齐全 ── */
const localeEntry = localeCaptures.find((c) => c.dict?.zh && c.dict?.en);
ok(localeEntry, "双语词典已注册");
for (const lang of ["zh", "en"]) {
  for (const key of [
    "hive.swarm.presetPromptPlaceholder",
    "hive.swarm.presetPromptHint",
    "hive.bee.err.presetPromptTooLong",
    "hive.bee.err.invalidPresetPrompt"
  ]) {
    ok(typeof localeEntry.dict[lang]?.[key] === "string", `${lang} 词条 ${key} 齐全`);
  }
}

console.log("ALL SWARM PRESET UI SMOKE TESTS PASSED");
