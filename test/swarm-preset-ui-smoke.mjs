/**
 * 蜂群编辑浮窗「字段瘦身」冒烟测试（add-hotbar-llm-model-and-import 任务 4.5，
 * 反转 hive-summon-tool 时代的「预设提示词 / 对话模型」编辑项断言；沿 hotbars-ui-smoke
 * 先例：工厂沙箱内执行 lib/client.js 懒 CJS 工厂，直测 BeeSwarmModal）：
 *  - 表单 SHALL NOT 出现「对话模型」下拉与「预设提示词」输入框（字段职责分离，
 *    两个 prop `modelCatalog`/`modelState` 一并删除——即便外部仍传也不渲染模型控件）；
 *  - 存量蜂种（含 model/presetPrompt）经保存链路被 normalizeBeeTypes 静默剥离：
 *    onSave 载荷无这两键，其余字段无损；
 *  - i18n：`hive.swarm.model` / `hive.swarm.presetPrompt*` /
 *    `hive.bee.err.presetPromptTooLong` / `hive.bee.err.invalidPresetPrompt` /
 *    `hive.bee.err.invalidModel` 词条**缺席**；`hive.swarm.modelNone/modelLoading/
 *    modelUnavailable` 三键**保留**（文案归属改记指令编辑器，R5a）；
 *  - 回归护栏：外观模型（beeModel，3D 资产）下拉与能力编辑器不受影响。
 * 运行：node test/swarm-preset-ui-smoke.mjs（先 node build.mjs）
 */
import { readFileSync } from "node:fs";
import { BEE_APPEARANCE_MODELS, normalizeBeeTypes } from "../src/bee-types.mjs";

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
/* 存量蜂种（含已删两字段）：读取侧由此镜像进入表单——表单 SHALL NOT 呈现两编辑项。 */
const mirror = [
  {
    id: "exec",
    name: "执行蜂",
    queuePolicy: "free",
    model: { provider: "volc", model: "deepseek-v3.1", reasoningEffort: "high" },
    presetPrompt: "存量行为定义",
    capabilities: []
  }
];
const typesPanelSave = (modal) => {
  const panel = collect(modal, (n) => n.props?.id === "jyv-swarmPanel-types")[0];
  return collect(panel, (n) => String(n.props.className ?? "").includes("jyv-qcSave"));
};

/* ── 1. 表单无「对话模型」下拉与「预设提示词」输入框（spec 场景「表单无模型与预设提示词编辑项」） ── */
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
  /* 即便外部仍传旧 props（页面级目录 state），组件也不消费、不渲染模型控件。 */
  modelCatalog: { groups: [{ id: "volc", name: "Volc", models: [{ id: "deepseek-v3.1", name: "DeepSeek V3.1" }] }] },
  modelState: "ready"
};
hookCells = []; hookIndex = 0; // 新组件实例
const modal1 = render(BeeSwarmModal(props1));

eq(collect(modal1, (n) => n.tag === "textarea" && String(n.props.className ?? "").includes("jyv-swarmPreset")).length, 0, "SHALL NOT 出现「预设提示词」输入框（jyv-swarmPreset）");
const fieldLabels = collect(modal1, (n) => n.tag === "label" && String(n.props.className ?? "").includes("jyv-swarmField"));
const fieldText = fieldLabels.map((n) => textOf(n)).join(" | ");
ok(!fieldText.includes("hive.swarm.model"), "SHALL NOT 出现「对话模型」字段（hive.swarm.model）");
ok(!collect(modal1, (n) => n.tag === "option").some((o) => String(o.props.value ?? "").includes("volc/deepseek-v3.1")), "SHALL NOT 渲染模型目录选项");
eq(fieldLabels.length, 2, "表单字段仅排队策略 + 外观模型（无模型/无预设提示词）");
ok(fieldText.includes("hive.swarm.queuePolicy") && fieldText.includes("hive.swarm.beeModel"), "保留字段：排队策略 + 外观模型");
eq(collect(modal1, (n) => n.tag === "textarea").length, 0, "types 面板 SHALL NOT 含 textarea（预设提示词输入框已删；描述为单行 input）");

/* ── 2. 保存链路：存量两字段经 normalizeBeeTypes 静默剥离，其余字段无损 ── */
const saveBtn = typesPanelSave(modal1);
eq(saveBtn.length, 1, "保存按钮在场（types 页签）");
await saveBtn[0].props.onClick();
ok(savedRows !== null, "保存触发 onSave");
eq("model" in savedRows[0], false, "保存载荷无 model 键（蜂种已不承载对话模型）");
eq("presetPrompt" in savedRows[0], false, "保存载荷无 presetPrompt 键（已 REMOVED 需求）");
eq(savedRows[0].id, "exec", "其余字段原样保留");
eq(savedRows[0].name, "执行蜂", "名称无损");
eq(savedRows[0].queuePolicy, "free", "排队策略无损");
/* 与宿主落库口径同源：纯函数归一化同样剥离两字段（双侧纪律） */
const aligned = normalizeBeeTypes(mirror);
ok(!("model" in aligned[0]) && !("presetPrompt" in aligned[0]), "normalizeBeeTypes 剥离两字段（客户端与宿主同口径）");

/* ── 3. 外观模型下拉回归护栏（3D 资产，不受字段瘦身影响） ── */
const beeLabels = collect(modal1, (n) => n.tag === "label" && String(n.props.className ?? "").includes("jyv-swarmField") && textOf(n).includes("hive.swarm.beeModel"));
eq(beeLabels.length, 1, "外观模型字段在场");
const beeSelect = collect(beeLabels[0], (n) => n.tag === "select")[0];
const beeValues = collect(beeSelect, (n) => n.tag === "option").map((o) => o.props.value);
eq(beeValues, [...BEE_APPEARANCE_MODELS], "外观模型选项集 = BEE_APPEARANCE_MODELS（键格式未变）");

/* ── 4. 能力编辑器页签不受影响（tab 切换后仍渲染能力列表） ── */
const capTabs = collect(modal1, (n) => n.props?.id === "jyv-swarmTab-caps");
eq(capTabs.length, 1, "能力编辑器页签在场");
ok(collect(modal1, (n) => n.props?.id === "jyv-swarmPanel-caps").length === 1, "能力面板容器在场");

/* ── 5. i18n：删词条缺席 + 保留三键在场（R5a） ── */
const localeEntry = localeCaptures.find((c) => c.dict?.zh && c.dict?.en);
ok(localeEntry, "双语词典已注册");
const removedKeys = [
  "hive.swarm.model",
  "hive.swarm.presetPromptPlaceholder",
  "hive.swarm.presetPromptHint",
  "hive.bee.err.presetPromptTooLong",
  "hive.bee.err.invalidPresetPrompt",
  "hive.bee.err.invalidModel"
];
for (const lang of ["zh", "en"]) {
  for (const key of removedKeys) {
    ok(!(key in localeEntry.dict[lang]), `${lang} 词条 ${key} 已删除（字段随职责分离移除）`);
  }
  for (const key of ["hive.swarm.modelNone", "hive.swarm.modelLoading", "hive.swarm.modelUnavailable"]) {
    ok(typeof localeEntry.dict[lang]?.[key] === "string", `${lang} 词条 ${key} 保留（文案归属改记指令编辑器）`);
  }
  /* 指令编辑器新增词条齐备（模型/档位控件 + 导入入口与降级文案） */
  for (const key of ["hive.hb.model", "hive.hb.effort", "hive.hb.effortDefault", "hive.hb.err.invalidModel", "hive.hb.import", "hive.hb.importSummary", "hive.hb.importNotInstalled", "hive.hb.importServiceAbsent", "hive.hb.importStale"]) {
    ok(typeof localeEntry.dict[lang]?.[key] === "string", `${lang} 词条 ${key} 齐全（指令编辑器）`);
  }
}

console.log("ALL SWARM PRESET UI SMOKE TESTS PASSED");
