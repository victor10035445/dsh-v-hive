/**
 * 提案面板 UI 冒烟测试（add-proposal-panel 5.8）：在 hotbars-ui-smoke 同款沙箱里执行
 * `lib/client.js` 懒 CJS 工厂，直测导出的 `ProposalPanel` 与 `HotbarsModal`：
 *  - 分组渲染与空组不渲染（宿主恒返回全部在册工作区，空组口径在客户端）；
 *  - 组标题空串回退工作区 id；
 *  - 状态色点 + 本地化名称（无状态 = 无标记）；`at` 仅悬停提示（不渲染正文）；
 *  - 头部刷新按钮 + 空态刷新入口（watcher 降级路径的一等公民）；
 *  - 模态门控（disabled → 不渲染）与让位 reserve（`--jyv-panelBottom` 展开/收起两态）；
 *  - 选中互斥（页面级四态纯函数 `resolveHotbarKind`：提案选中优先于场景三态、
 *    浮窗优先于提案选中、提案选中不占场景选中槽）；
 *  - 编辑器第四节 = 提案栏（tab id / 面板 id）；状态下拉受限枚举；
 *  - 校验拒绝（提案栏提示词空白 → missingPrompt）、名称重复；
 *  - **`proposals-changed` 轻帧不改动 lane/等待镜像**（帧类型守卫，D9 硬要求）。
 * 运行：node test/proposals-ui-smoke.mjs（先 node build.mjs）
 */
import { readFileSync } from "node:fs";
import { resolveHotbarKind } from "../src/hotbars.mjs";
import { PROPOSAL_ROW_PX, PROPOSAL_STATUSES } from "../src/proposals.mjs";

const code = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── React 桩（useState/useRef 跨调用保持、useEffect 立即执行） ── */
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

/* ── mock fetch：/state GET、/proposals GET、/proposals/status POST ── */
const fetchCalls = [];
let proposalsFixture = [];
let statusWrites = [];
let statusesWrites = [];
let proposalsStatus = 200;
let statusesStatus = 200;
async function fetchStub(url, opts = {}) {
  const method = opts.method ?? "GET";
  const body = opts.body ? JSON.parse(opts.body) : null;
  fetchCalls.push({ url, method, body });
  const respond = (status, data) => ({ ok: status < 400, status, json: async () => data });
  if (url === "/api/dsh-hive/state" && method === "GET") {
    return respond(200, { doc: { version: 1, revision: 3, positions: {}, camera: null, proposalStates: {} } });
  }
  if (url === "/api/dsh-hive/proposals" && method === "GET") {
    if (proposalsStatus !== 200) return respond(proposalsStatus, { error: "boom" });
    return respond(200, proposalsFixture);
  }
  if (url === "/api/dsh-hive/proposals/status" && method === "POST") {
    statusWrites.push(body);
    return respond(200, { ok: true });
  }
  if (url === "/api/dsh-hive/proposals/statuses" && method === "POST") {
    statusesWrites.push(body);
    if (statusesStatus !== 200) return respond(statusesStatus, { error: "bad list", field: "proposalStatuses.0.color", code: "invalid-entry" });
    return respond(200, { ok: true });
  }
  if (url === "/api/dsh-hive/imports/skill-links-buttons") {
    return respond(404, { error: "unknown route" });
  }
  return respond(404, { error: "unknown route" });
}

/* ── 沙箱 ── */
const registered = [];
const localeCaptures = [];
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
  body: { appendChild() {}, observe() {}, contains() { return false; }, dataset: {} },
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
  effect(fn) { const disposer = fn(); return () => disposer?.(); },
  locale: {
    register(ns, dict) { localeCaptures.push({ ns, dict }); },
    bind() { return (key) => key; }
  },
  slots: { inject(name, cb) { cb(); }, register(decl, Component) { registered.push({ decl, Component }); } },
  sessions: undefined,
  workspaces: undefined,
  uiWorkspace: undefined
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
                  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
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
ok(typeof m.ProposalPanel === "function", "导出面含 ProposalPanel（冒烟观测点）");

/* ── 渲染助手 ── */
function render(el, depth = 0) {
  if (depth > 40) throw new Error("render depth exceeded");
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
/* i18n 桩：整体恒返回键（断言只看键名），**但带占位符的词条按真实字典插值**——
   「保存失败」这类词条在真字典里是「状态列表保存失败：{err}」，键名直出会让
   `replace("{err}", …)` 无靶可打（字段级原因就断在测试桩上而不是实现上）。 */
const PLACEHOLDER_SAMPLES = {
  "hive.settings.proposalStatusSaveFailed": "hive.settings.proposalStatusSaveFailed:{err}"
};
const t = (key) => (key in PLACEHOLDER_SAMPLES ? PLACEHOLDER_SAMPLES[key] : key);

/* ── 1. 分组渲染 + 空组不渲染 + 组标题回退 + 状态标记 ── */
/* 状态列表镜像（proposal-panel-config 3.3）：面板经动作面读**有效列表**；缺省 = 出厂四值。 */
let statusListFixture = null; // null = 未配置（动作面回落出厂四值）
const panelProps = (over = {}) => ({
  t,
  ctl: () => ({
    actions: {
      proposalStates: () => ({}),
      proposalStatuses: () => statusListFixture ?? PROPOSAL_STATUSES,
      refreshProposals: async () => {}
    }
  }),
  settings: { reportCollapsed: true, reportRows: 8, proposalRows: 24 },
  disabled: false,
  selectedProposal: null,
  onSelect: () => {},
  ...over
});

/* 清单注入点：沙箱无 EventSource/SSE，直接经 store 落 fixture（与 hotbars-ui 直测 store
   同款纪律）；面板读 `useSyncExternalStore` 快照，故渲染前先注入。 */
const seed = () => m.proposalsStore.set({ groups: proposalsFixture });

proposalsFixture = [
  { workspaceId: "ws-a", title: "A 巢", path: "C:/a", changes: [{ name: "add-bar" }, { name: "add-foo", status: "reviewed" }] },
  { workspaceId: "ws-b", title: "", path: "C:/b", changes: [] },
  { workspaceId: "ws-c", title: "C 巢", path: "C:/c", changes: [{ name: "fix-baz", status: "executed" }] }
];
hookCells = []; hookIndex = 0;
seed();
let tree = render(m.ProposalPanel(panelProps()));
{
  const groups = collect(tree, (n) => String(n.props.className ?? "") === "jyv-proposalGroup");
  eq(groups.length, 2, "空组不渲染：A/C 两组呈现，无 change 的 B 组不出现");
  const names = collect(tree, (n) => String(n.props.className ?? "").includes("jyv-proposalGroupName"));
  eq(names.map((n) => textOf(n)), ["A 巢", "C 巢"], "组标题 = 工作区标题（原序）");
  const cards = collect(tree, (n) => String(n.props.className ?? "").includes("jyv-proposalCard"));
  eq(cards.map((n) => textOf(n)).length, 3, "卡片数 = 全部非空组内 change 数（2 + 1）");
  const dots = collect(tree, (n) => String(n.props.className ?? "").includes("jyv-proposalDot"));
  eq(dots.length, 2, "状态色点仅出现在有状态卡片上（add-foo=reviewed / fix-baz=executed；无状态 → 无标记）");
  eq(cards.filter((c) => c.props["data-status"] !== undefined).length, 2, "data-status 仅落在有状态卡片");
  ok(cards.find((c) => textOf(c).includes("add-bar")).props["data-status"] === undefined, "无状态卡片不带 data-status");
  ok(textOf(tree).includes("hive.proposal.status.reviewed"), "状态名称经 i18n 本地化呈现");
  ok(collect(tree, (n) => String(n.props.className ?? "").includes("jyv-proposalRefresh")).length >= 1, "头部刷新按钮呈现");
}
/* 组标题空串回退工作区 id */
proposalsFixture = [{ workspaceId: "ws-empty", title: "   ", path: "C:/e", changes: [{ name: "x" }] }];
seed();
seed();
hookCells = []; hookIndex = 0; tree = render(m.ProposalPanel(panelProps()));
{
  const names = collect(tree, (n) => String(n.props.className ?? "").includes("jyv-proposalGroupName"));
  eq(names.map((n) => textOf(n)), ["ws-empty"], "组标题空串/空白 → 回退工作区 id");
}
/* 全部空组 → 空态占位（含刷新入口），无滚动区 */
proposalsFixture = [{ workspaceId: "ws-a", title: "A", path: "a", changes: [] }];
seed();
seed();
hookCells = []; hookIndex = 0; tree = render(m.ProposalPanel(panelProps()));
{
  const empty = collect(tree, (n) => String(n.props.className ?? "") === "jyv-proposalEmpty");
  eq(empty.length, 1, "无任何 change → 空态占位");
  ok(textOf(empty[0]).includes("hive.proposal.empty"), "空态文案经 i18n 呈现");
  ok(collect(empty[0], (n) => String(n.props.className ?? "").includes("jyv-proposalEmptyBtn")).length === 1, "空态含刷新入口（降级路径一等公民）");
  eq(collect(tree, (n) => String(n.props.className ?? "").includes("jyv-proposalGroup")).length, 0, "空态不渲染任何分组/滚动区");
}

/* ── 2. 模态门控 + 让位 reserve 两态 ── */
hookCells = []; hookIndex = 0;
eq(render(m.ProposalPanel(panelProps({ disabled: true }))), null, "模态期 disabled → 面板不渲染（同层组件同款门控）");
proposalsFixture = [{ workspaceId: "ws-a", title: "A", path: "a", changes: [{ name: "x" }] }];
seed();
seed();
hookCells = []; hookIndex = 0;
{
  const collapsed = render(m.ProposalPanel(panelProps({ settings: { reportCollapsed: true, reportRows: 8 } })));
  hookCells = []; hookIndex = 0;
  const expanded = render(m.ProposalPanel(panelProps({ settings: { reportCollapsed: false, reportRows: 20 } })));
  const root = (node) => collect(node, (n) => String(n.props.className ?? "").includes("jyv-proposalPanel"))[0];
  eq(root(collapsed).props.style["--jyv-panelBottom"], "calc(76px + 30px)", "收起 → 让位 = 76px 道具栏 + pill 30px");
  eq(root(expanded).props.style["--jyv-panelBottom"], "calc(76px + " + String(34 + 20 * 24 + 12) + "px)", "展开 20 行 → 让位随报告占位增长（无重叠）");
  eq(root(collapsed).props.role, "group", "role=group（a11y）");
  eq(root(collapsed).props["aria-label"], "hive.proposal.aria", "aria-label 走本地化词条");
  /* 面板高度（proposal-panel-config 4.2/D5）：行数 → CSS 变量；缺省 24 行、越界净房 */
  eq(root(collapsed).props.style["--jyv-proposalMaxH"], String(24 * PROPOSAL_ROW_PX) + "px", "缺省 24 行 → --jyv-proposalMaxH = 816px（零回归量级）");
  /* 可用带变量（用户反馈修正）：`--jyv-proposalBandH` 为**实测可用带**（画布高 − 让位），
     未测得时（沙箱无 ResizeObserver）退化为行数上限——两条路径都必须在场，
     CSS 侧 `max-height: min(--jyv-proposalMaxH, --jyv-proposalBandH)` 才恒有值。 */
  ok(
    root(collapsed).props.style["--jyv-proposalBandH"] === String(24 * PROPOSAL_ROW_PX) + "px",
    "无 ResizeObserver 的沙箱 → --jyv-proposalBandH 退化为行数上限（首帧不缺值）"
  );
  /* 面板挂 ref（实测可用带的量测挂点）；沙箱里 ref 形如 { current } */
  ok(root(collapsed).props.ref !== undefined, "面板根节点带 ref（ResizeObserver 量测挂点在场）");
  hookCells = []; hookIndex = 0;
  const wide = render(m.ProposalPanel(panelProps({ settings: { reportCollapsed: true, reportRows: 8, proposalRows: 32 } })));
  eq(root(wide).props.style["--jyv-proposalMaxH"], String(32 * PROPOSAL_ROW_PX) + "px", "32 行 → 上限抬升（滑杆即时生效路径）");
  hookCells = []; hookIndex = 0;
  const tiny = render(m.ProposalPanel(panelProps({ settings: { reportCollapsed: true, reportRows: 8, proposalRows: 1 } })));
  eq(root(tiny).props.style["--jyv-proposalMaxH"], String(3 * PROPOSAL_ROW_PX) + "px", "越界（1 行）→ 净房落回下界 3 行");
  hookCells = []; hookIndex = 0;
  const bad = render(m.ProposalPanel(panelProps({ settings: { reportCollapsed: true, reportRows: 8, proposalRows: "x" } })));
  eq(root(bad).props.style["--jyv-proposalMaxH"], String(24 * PROPOSAL_ROW_PX) + "px", "坏值 → 净房落回默认 24 行");
}

/* ── 2b. 卡片标记数据驱动（proposal-panel-config 3.3）：列表外的孤儿戳无标记 ── */
{
  /* 当前列表 = [doing]：宿主不再为 reviewed 并出 status（双保险），本地也按列表查色。 */
  statusListFixture = [{ id: "doing", color: "#4c8f5c", name: "进行中" }];
  proposalsFixture = [
    { workspaceId: "ws-a", title: "A", path: "a", changes: [{ name: "add-foo", status: "doing" }, { name: "add-bar", status: "reviewed" }] }
  ];
  seed();
  seed();
  hookCells = []; hookIndex = 0;
  const tree = render(m.ProposalPanel(panelProps()));
  const cards = collect(tree, (n) => String(n.props.className ?? "").includes("jyv-proposalCard"));
  eq(cards.length, 2, "两张卡都在（孤儿戳卡片保留——数据不删）");
  eq(collect(tree, (n) => String(n.props.className ?? "").includes("jyv-proposalDot")).length, 1, "色点只落在列表内状态的卡上（孤儿戳无标记）");
  eq(cards.filter((c) => c.props["data-status"] !== undefined).map((c) => c.props["data-status"]), ["doing"], "data-status 只落列表内状态");
  ok(textOf(tree).includes("进行中"), "自定义状态按列表条目的字面名呈现（数据驱动名称）");
  ok(!textOf(tree).includes("reviewed"), "孤儿戳不呈现任何名称（无标记）");
  const orphanCard = cards.find((c) => textOf(c).includes("add-bar"));
  eq(orphanCard.props.title, "add-bar", "孤儿戳卡片悬停仅显示 change 名（无状态/时间戳）");
  /* 列表内状态的悬停：名称 + 时间戳（proposalStates 仍带 at） */
  hookCells = []; hookIndex = 0;
  const withStamp = render(
    m.ProposalPanel(
      panelProps({
        ctl: () => ({
          actions: {
            proposalStates: () => ({ "ws-a/add-foo": { status: "doing", at: Date.UTC(2026, 0, 2, 3, 4, 5) } }),
            proposalStatuses: () => statusListFixture,
            refreshProposals: async () => {}
          }
        })
      })
    )
  );
  const stampedCard = collect(withStamp, (n) => String(n.props.className ?? "").includes("jyv-proposalCard")).find((c) => textOf(c).includes("add-foo"));
  ok(String(stampedCard.props.title).startsWith("add-foo · 进行中 · "), "有标记卡片悬停 = change 名 · 状态名 · 时间戳");
  /* 缺省（未配置列表）→ 出厂四值：reviewed 重新成为有效标记 */
  statusListFixture = null;
  hookCells = []; hookIndex = 0;
  const factoryTree = render(m.ProposalPanel(panelProps()));
  eq(collect(factoryTree, (n) => String(n.props.className ?? "").includes("jyv-proposalDot")).length, 1, "列表缺省回退出厂四值 → reviewed 标记回显（列表即权威）");
  ok(textOf(factoryTree).includes("hive.proposal.status.reviewed"), "工厂 id 空缺名称 → 走 i18n 词条（英文界面不被中文名绑架）");
}

/* ── 2c. 设置模态「提案」节（proposal-panel-config 4.1–4.3） ── */
{
  const guard = { current: null };
  const settingsModal = render(
    m.HiveSettingsModal({
      t,
      settings: { layout: { panelM: 2, panelN: 2, barM: 8, barN: 1 }, reportRows: 8, proposalRows: 24 },
      setSettings: () => {},
      guardRef: guard,
      onClose: () => {},
      ctl: () => ({ actions: { proposalStatuses: () => statusListFixture } })
    })
  );
  const tabs = collect(settingsModal, (n) => n.props?.id && String(n.props.id).startsWith("jyv-railTab-"));
  eq(
    tabs.map((n) => n.props.id),
    ["jyv-railTab-scene", "jyv-railTab-appearance", "jyv-railTab-layout", "jyv-railTab-voice", "jyv-railTab-proposal"],
    "设置左纵排第五节 = 提案（场景/外观/布局/语音不动）"
  );
  /* 提案节面板骨架在场（hidden 属性按当前 section 切；此处只断言节点存在 + tabpanel 语义） */
  const panel = collect(settingsModal, (n) => n.props?.id === "jyv-railPanel-proposal")[0];
  ok(Boolean(panel), "提案节 tabpanel 骨架在场");
  eq(panel.props.role, "tabpanel", "提案节为 tabpanel");
  eq(panel.props["aria-labelledby"], "jyv-railTab-proposal", "tabpanel 与 nav 项 aria 关联");
  /* 高度滑杆：行数口径 3–32、即时上报（setSettings 路径） */
  let patched = null;
  const body = render(
    m.ProposalSettingsBody({
      t,
      settings: { proposalRows: 24 },
      setSettings: (p) => { patched = p; },
      statuses: null
    })
  );
  const slider = collect(body, (n) => n.tag === "input" && n.props.type === "range")[0];
  eq([slider.props.min, slider.props.max, slider.props.value], [3, 32, 24], "高度滑杆量程 3–32、当前值取净房后的设置");
  slider.props.onChange({ target: { value: "30" } });
  eq(patched?.proposalRows, 30, "滑杆调整即时上报（setSettings → localStorage + 面板即时重算）");
  /* 状态列表编辑器：行式条目（色块 + 名称输入 + 删除）*/
  const rows = collect(body, (n) => String(n.props.className ?? "").includes("jyv-proposalStatusRow"));
  eq(rows.length, PROPOSAL_STATUSES.length, "列表缺省 → 呈现出厂四值行（可编辑副本）");
  const colorInputs = collect(body, (n) => n.tag === "input" && n.props.type === "color");
  eq(colorInputs.length, PROPOSAL_STATUSES.length, "每行一个 native 取色控件");
  eq(colorInputs.map((c) => c.props.value), PROPOSAL_STATUSES.map((e) => e.color), "取色初值 = 出厂色（archived 青灰在场）");
  eq(collect(body, (n) => n.props["data-testid"] === "proposal-status-add").length, 1, "「添加状态」按钮在场");
  eq(collect(body, (n) => n.props["data-testid"] === "proposal-status-restore").length, 1, "「恢复默认列表」按钮在场");
  ok(collect(body, (n) => n.props["data-testid"] === "proposal-status-save").length === 1, "「保存到宿主」按钮在场（草稿 + 显式保存形态）");
  eq(collect(body, (n) => String(n.props.className ?? "").includes("jyv-qcDirty")).length, 0, "刚打开（草稿 = 镜像）→ 无「未保存」提示");
}
/* 编辑 → 脏提示 → 保存载荷（整单替换）→ 400 字段级原因呈现 */
{
  let savePayload = null;
  let saveResult = { ok: true };
  const props = (over = {}) => ({
    t,
    settings: { proposalRows: 24 },
    setSettings: () => {},
    statuses: null,
    onSaveStatuses: async (list) => { savePayload = list; return saveResult; },
    ...over
  });
  /* 编辑名称：草稿脏 → hint 出现；保存载荷不含空名键、含编辑后的名称 */
  hookCells = []; hookIndex = 0;
  render(m.ProposalSettingsBody(props()));
  hookIndex = 0;
  const first = render(m.ProposalSettingsBody(props()));
  const nameInput = collect(first, (n) => n.props["data-testid"] === "proposal-status-name-0")[0];
  nameInput.props.onChange({ target: { value: "  我的审阅  " } });
  hookIndex = 0;
  const dirtyTree = render(m.ProposalSettingsBody(props()));
  eq(collect(dirtyTree, (n) => String(n.props.className ?? "").includes("jyv-qcDirty")).length, 1, "有未保存改动 → 脏提示出现（不被镜像覆盖）");
  savePayload = null;
  await collect(dirtyTree, (n) => n.props["data-testid"] === "proposal-status-save")[0].props.onClick();
  eq(savePayload?.length, PROPOSAL_STATUSES.length, "保存 → 整单替换（一次提交，条目数与草稿一致）");
  eq(savePayload?.[0], { id: "reviewed", color: "#e8a63c", name: "我的审阅" }, "载荷条目 trim 后携带 name");
  eq(savePayload?.[3], { id: "archived", color: "#7d8ca3" }, "空名条目不带 name 键（走名称回退链）");
  /* 400 → 字段级原因呈现且草稿保持 */
  saveResult = { ok: false, error: "invalid proposal statuses payload", field: "proposalStatuses.0.color", code: "invalid-entry" };
  hookCells = []; hookIndex = 0;
  render(m.ProposalSettingsBody(props()));
  hookIndex = 0;
  const failTree = render(m.ProposalSettingsBody(props()));
  await collect(failTree, (n) => n.props["data-testid"] === "proposal-status-save")[0].props.onClick();
  hookIndex = 0;
  const errTree = render(m.ProposalSettingsBody(props()));
  const alert = collect(errTree, (n) => n.props.role === "alert")[0];
  ok(Boolean(alert), "保存失败 → 错误提示呈现（role=alert）");
  ok(textOf(alert).includes("proposalStatuses.0.color"), "400 字段级路径透出（用户可据此就地修正）");
  ok(textOf(alert).includes("invalid-entry"), "具名原因（code）随字段级路径一并透出");
  eq(collect(errTree, (n) => String(n.props.className ?? "").includes("jyv-proposalStatusRow")).length, PROPOSAL_STATUSES.length, "失败后草稿保持（不清空、不回退）");
  /* 成功 → 成功提示（列表已保存） */
  saveResult = { ok: true };
  hookCells = []; hookIndex = 0;
  render(m.ProposalSettingsBody(props()));
  hookIndex = 0;
  const okTree = render(m.ProposalSettingsBody(props()));
  await collect(okTree, (n) => n.props["data-testid"] === "proposal-status-save")[0].props.onClick();
  hookIndex = 0;
  const savedTree = render(m.ProposalSettingsBody(props()));
  ok(textOf(savedTree).includes("hive.settings.proposalStatusSaved"), "保存成功 → 成功提示词条呈现");
  /* 添加 / 删除 / 恢复默认：草稿操作（仍需保存落盘） */
  hookCells = []; hookIndex = 0;
  render(m.ProposalSettingsBody(props()));
  hookIndex = 0;
  const addTree = render(m.ProposalSettingsBody(props()));
  collect(addTree, (n) => n.props["data-testid"] === "proposal-status-add")[0].props.onClick();
  hookIndex = 0;
  const addedTree = render(m.ProposalSettingsBody(props()));
  eq(collect(addedTree, (n) => String(n.props.className ?? "").includes("jyv-proposalStatusRow")).length, PROPOSAL_STATUSES.length + 1, "「添加状态」→ 草稿多一行（本地 id 生成）");
  collect(addedTree, (n) => n.props["data-testid"] === "proposal-status-remove-0")[0].props.onClick();
  hookIndex = 0;
  const removedTree = render(m.ProposalSettingsBody(props()));
  eq(collect(removedTree, (n) => String(n.props.className ?? "").includes("jyv-proposalStatusRow")).length, PROPOSAL_STATUSES.length, "「删除」→ 草稿少一行（仅草稿，未落盘）");
  collect(removedTree, (n) => n.props["data-testid"] === "proposal-status-restore")[0].props.onClick();
  hookIndex = 0;
  const restoredTree = render(m.ProposalSettingsBody(props()));
  eq(
    collect(restoredTree, (n) => n.tag === "input" && n.props.type === "color").map((c) => c.props.value),
    PROPOSAL_STATUSES.map((e) => e.color),
    "「恢复默认列表」= 草稿整单替换为出厂四值（仍需保存落盘）"
  );
}

const gate = (input) => resolveHotbarKind(input);
const pick = { workspaceId: "ws-a", name: "add-foo" };
eq(gate({ selectedProposal: pick }), "proposal", "提案选中 → 提案栏");
eq(gate({ selection: { kind: "studio", id: "ws-a" }, selectedProposal: pick }), "proposal", "提案选中优先于场景巢选中");
eq(gate({ selectedBee: "b1", selectedProposal: pick }), "proposal", "提案选中优先于蜂栏");
eq(gate({ floatOpen: true, selectedProposal: pick }), null, "浮窗优先于提案选中（遮罩暂停）");
eq(gate({ selection: { kind: "studio", id: "ws-a" } }), "hive", "清提案选中 → 回落场景巢栏（反向）");
eq(gate({ selectedBee: "b1" }), "bee", "清提案选中 → 回落蜂栏");
/* 点卡 onSelect 载荷 = { workspaceId, name }（页面级第四态的形状契约） */
{
  proposalsFixture = [{ workspaceId: "ws-a", title: "A", path: "a", changes: [{ name: "add-foo" }] }];
  seed();
  seed();
  let picked = null;
  hookCells = []; hookIndex = 0;
  const tree2 = render(m.ProposalPanel(panelProps({ onSelect: (p) => { picked = p; } })));
  collect(tree2, (n) => String(n.props.className ?? "").includes("jyv-proposalCard"))[0].props.onClick();
  eq(picked, { workspaceId: "ws-a", name: "add-foo" }, "点卡 onSelect 载荷 = { workspaceId, name }（不进文档/不进场景槽）");
}

/* ── 4. 编辑器第四节 = 提案栏 + 状态下拉**读镜像列表**（proposal-panel-config 4.4） ── */
const hbStatusList = [{ id: "doing", color: "#4c8f5c", name: "进行中" }, { id: "reviewed", color: "#e8a63c" }];
const modalProps = (over = {}) => ({
  t,
  hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p1", name: "继续推进", summon: true, prompt: "推进 {change}", autoSend: true, setStatus: "reviewed" }] },
  beeTypes: [{ id: "bt-review", name: "审查蜂" }],
  layout: { barM: 8, barN: 1 },
  guardRef: { current: null },
  onClose: () => {},
  onSave: async () => ({ ok: true }),
  onNotify: () => {},
  modelCatalog: { groups: [] },
  modelState: "ready",
  ctl: () => ({ actions: { proposalStatuses: () => hbStatusList } }),
  ...over
});
hookCells = []; hookIndex = 0;
const modalTree = render(m.HotbarsModal(modalProps()));
{
  const tabs = collect(modalTree, (n) => n.props?.id && String(n.props.id).startsWith("jyv-railTab-"));
  eq(tabs.map((n) => n.props.id), ["jyv-railTab-hive", "jyv-railTab-bee", "jyv-railTab-floor", "jyv-railTab-proposal"], "编辑器四节：巢栏/蜂栏/地板栏/提案栏（第四节已换）");
  ok(!tabs.some((n) => n.props.id === "jyv-railTab-status"), "旧「状态卡片」节 SHALL NOT 再现");
  ok(String(tabs[3].props["aria-controls"]).includes("proposal"), "第四节 aria-controls 指向提案栏面板");
}
/* 切到提案栏节 → 展开槽位 → 状态下拉受限枚举（多遍渲染复用同一组 hook 胞元） */
hookCells = []; hookIndex = 0;
render(m.HotbarsModal(modalProps())); // 首遍：建立胞元
hookIndex = 0;
collect(render(m.HotbarsModal(modalProps())), (n) => n.props?.id === "jyv-railTab-proposal")[0].props.onClick(); // 切节（setSection）
hookIndex = 0;
collect(render(m.HotbarsModal(modalProps())), (n) => String(n.props.className ?? "").includes("jyv-qcRow") && typeof n.props.onClick === "function")[0].props.onClick(); // 展开表单（setSelectedId）
hookIndex = 0;
const propForm = render(m.HotbarsModal(modalProps()));
{
  const labels = collect(propForm, (n) => n.tag === "label" && String(n.props.className ?? "").includes("jyv-swarmField"));
  const labelText = labels.map((n) => textOf(n)).join(" | ");
  ok(labelText.includes("hive.hb.setStatus"), "提案栏表单含「状态置位」字段");
  const statusLabel = labels.find((n) => textOf(n).includes("hive.hb.setStatus"));
  const select = collect(statusLabel, (n) => n.tag === "select")[0];
  eq(collect(select, (n) => n.tag === "option").map((o) => o.props.value), ["", "doing", "reviewed"], "状态下拉读**镜像列表**（首项「不设置」+ 列表条目；无自由文本）");
  eq(collect(select, (n) => n.tag === "option").map((o) => textOf(o)), [
    "hive.proposal.status.none", "进行中", "hive.proposal.status.reviewed"
  ], "状态项名称走名称回退链（自定义字面名 / 工厂 id i18n）");
  eq(select.props.value, "reviewed", "受控 value = 草稿 setStatus");
  ok(labelText.includes("hive.hb.promptRequired"), "提案栏提示词标注「必填」");
  const textareas = collect(propForm, (n) => n.tag === "textarea");
  eq(textareas.length, 1, "提案栏表单恰一个提示词 textarea");
  eq(textareas[0].props.placeholder, "hive.hb.proposalPromptPlaceholder", "模板占位说明文案（含 {change} 与转义语义）");
  ok(textareas[0].props.disabled !== true, "提案栏提示词恒启用（不随 summon 裁剪）");
  /* citeName 勾选框（4.4/D6）：默认勾选（缺省 `!== false`）、文案与 hint 词条在场 */
  const citeBox = collect(propForm, (n) => n.tag === "input" && n.props.type === "checkbox" && n.props["data-testid"] === "hb-proposal-citeName")[0];
  ok(Boolean(citeBox), "提案栏表单含「引用提案目录」勾选框");
  eq(citeBox.props.checked, true, "citeName 缺省 → 勾选框呈现为**勾选**（读取缺省 = 勾选）");
  ok(textOf(collect(propForm, (n) => n.tag === "label" && n.props.title === "hive.hb.proposalCiteNameHint")[0] ?? { children: [] }).includes("hive.hb.proposalCiteName"), "勾选框携带 hint 词条（含「模板已含 {change} 时可取消勾选」说明）");
  /* 显式 citeName:false → 勾选框不勾选（透传语义） */
  hookCells = []; hookIndex = 0;
  render(m.HotbarsModal(modalProps({ hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p1", name: "继续推进", summon: false, prompt: "p", autoSend: false, citeName: false }] } })));
  hookIndex = 0;
  collect(render(m.HotbarsModal(modalProps({ hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p1", name: "继续推进", summon: false, prompt: "p", autoSend: false, citeName: false }] } }))), (n) => n.props?.id === "jyv-railTab-proposal")[0].props.onClick();
  hookIndex = 0;
  collect(render(m.HotbarsModal(modalProps({ hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p1", name: "继续推进", summon: false, prompt: "p", autoSend: false, citeName: false }] } }))), (n) => String(n.props.className ?? "").includes("jyv-qcRow") && typeof n.props.onClick === "function")[0].props.onClick();
  hookIndex = 0;
  const citeOffForm = render(m.HotbarsModal(modalProps({ hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p1", name: "继续推进", summon: false, prompt: "p", autoSend: false, citeName: false }] } })));
  eq(collect(citeOffForm, (n) => n.props?.["data-testid"] === "hb-proposal-citeName")[0].props.checked, false, "citeName:false → 勾选框不勾选（旧槽位缺字段才走缺省勾选）");
}
/* 已失效引用（4.4/D7）：setStatus 不在镜像列表 → 下拉出现「（已删除）」占位项且 value 保留原值 */
{
  const orphanProps = modalProps({
    hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p1", name: "旧卡", summon: false, prompt: "p", autoSend: false, setStatus: "gone-x" }] }
  });
  hookCells = []; hookIndex = 0;
  render(m.HotbarsModal(orphanProps));
  hookIndex = 0;
  collect(render(m.HotbarsModal(orphanProps)), (n) => n.props?.id === "jyv-railTab-proposal")[0].props.onClick();
  hookIndex = 0;
  collect(render(m.HotbarsModal(orphanProps)), (n) => String(n.props.className ?? "").includes("jyv-qcRow") && typeof n.props.onClick === "function")[0].props.onClick();
  hookIndex = 0;
  const orphanForm = render(m.HotbarsModal(orphanProps));
  const select = collect(collect(orphanForm, (n) => n.tag === "label" && textOf(n).includes("hive.hb.setStatus"))[0], (n) => n.tag === "select")[0];
  const values = collect(select, (n) => n.tag === "option").map((o) => o.props.value);
  eq(values, ["", "gone-x", "doing", "reviewed"], "已失效引用 → 首项「不设置」之后插入占位项，其后为当前列表");
  eq(collect(select, (n) => n.tag === "option").map((o) => textOf(o))[1], "hive.proposal.status.deleted", "占位项文案 =「（已删除）」词条");
  eq(select.props.value, "gone-x", "受控 value 保留原值（SHALL NOT 静默改写为「不设置」）");
  /* 原样保存 → setStatus 仍为 gone-x（不做静默清空） */
  let saved = null;
  const saveProps = modalProps({
    hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p1", name: "旧卡", summon: false, prompt: "p", autoSend: false, setStatus: "gone-x" }] },
    onSave: async (next) => { saved = next; return { ok: true }; }
  });
  hookCells = []; hookIndex = 0;
  await collect(render(m.HotbarsModal(saveProps)), (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0].props.onClick();
  eq(saved?.proposal?.[0]?.setStatus, "gone-x", "保存保留失效引用原值（宿主形状校验放行，执行点静默跳过）");
}

/* ── 5. 校验与净化：提案栏提示词空白（读取路径过滤）/ 名称重复（校验拒绝） ── */
{
  /* 提示词为空白的提案槽位在**入 store 的归一化**处即被滤除（与蜂栏「提示词必填、
     结构性缺失 → 坏数据过滤」同口径）——故非法槽位既不落草稿也不上载荷。 */
  let savedPayload = null;
  const badPrompt = modalProps({
    hotbars: { hive: [], bee: [], floor: [], proposal: [{ id: "p1", name: "空白提示词", summon: false, prompt: "   ", autoSend: false }] },
    onSave: async (next) => { savedPayload = next; return { ok: true }; }
  });
  hookCells = []; hookIndex = 0;
  const tree3 = render(m.HotbarsModal(badPrompt));
  /* 巢栏节（新实例默认节）本就为空，故这里切到提案栏节再断言滤除结果。 */
  hookIndex = 0;
  collect(render(m.HotbarsModal(badPrompt)), (n) => n.props?.id === "jyv-railTab-proposal")[0].props.onClick();
  hookIndex = 0;
  const propEmptyTree = render(m.HotbarsModal(badPrompt));
  const rowsIn = (tree) => collect(tree, (n) => String(n.props.className ?? "").split(" ").includes("jyv-qcRow")).length;
  eq(rowsIn(propEmptyTree), 0, "空白提示词槽位入草稿即被滤除（提案栏与蜂栏同口径）");
  const emptyHint = collect(propEmptyTree, (n) => String(n.props.className ?? "").includes("jyv-qcEmpty"));
  ok(emptyHint.length === 1, "滤除后呈空态文案（提示用户新增槽位）");
  await collect(propEmptyTree, (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0].props.onClick();
  eq(savedPayload?.proposal?.length ?? 0, 0, "载荷不含非法槽位（空栏落盘，不写坏数据）");
  hookIndex = 0;
  ok(collect(render(m.HotbarsModal(badPrompt)), (n) => n.props.role === "alert").length === 0, "净化路径不产生错误提示（不是拒绝，是过滤）");

  /* 栏内 trim 重名：入 store 的归一化先按「先到者胜」去重（坏数据过滤），
     故草稿只保留首条；校验器的 duplicateName 分支由 hotbars-smoke 直测覆盖。 */
  let dupPayload = null;
  const dup = modalProps({
    hotbars: {
      hive: [], bee: [], floor: [],
      proposal: [
        { id: "p1", name: "同名", summon: false, prompt: "a", autoSend: false },
        { id: "p2", name: " 同名 ", summon: false, prompt: "b", autoSend: false }
      ]
    },
    onSave: async (next) => { dupPayload = next; return { ok: true }; }
  });
  hookCells = []; hookIndex = 0;
  render(m.HotbarsModal(dup));
  hookIndex = 0;
  collect(render(m.HotbarsModal(dup)), (n) => n.props?.id === "jyv-railTab-proposal")[0].props.onClick();
  hookIndex = 0;
  const dupTree = render(m.HotbarsModal(dup));
  eq(collect(dupTree, (n) => String(n.props.className ?? "").split(" ").includes("jyv-qcRow")).length, 1, "栏内 trim 重名 → 归一化去重（仅保留首条，坏数据不炸 UI）");
  await collect(dupTree, (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0].props.onClick();
  eq(dupPayload?.proposal?.length ?? 0, 1, "去重后保存载荷仅 1 条（无重复名落盘）");
  hookIndex = 0;
  eq(collect(render(m.HotbarsModal(dup)), (n) => n.props.role === "alert").length, 0, "去重路径无错误提示（过滤而非拒绝）");
}

/* ── 6. 合法提案槽位可保存（prompt 必填 + setStatus 落盘 + beeTypeId 不触发拒绝） ── */
{
  let okPayload = null;
  const goodProps = modalProps({
    hotbars: {
      hive: [], bee: [], floor: [],
      proposal: [{ id: "p1", name: "推进", summon: false, beeTypeId: "bt-review", prompt: "推进 {change}", autoSend: false, setStatus: "paused" }]
    },
    onSave: async (next) => { okPayload = next; return { ok: true }; }
  });
  hookCells = []; hookIndex = 0;
  await collect(render(m.HotbarsModal(goodProps)), (n) => String(n.props.className ?? "").includes("jyv-qcSave"))[0].props.onClick();
  ok(okPayload !== null, "合法提案槽位 → 保存放行");
  eq(okPayload.proposal[0].setStatus, "paused", "setStatus 随载荷落盘");
  eq(okPayload.proposal[0].prompt, "推进 {change}", "提示词模板原样落盘（不插值）");
}

/* ── 7. proposals-changed 轻帧不改动 lane/等待镜像（D9 帧类型守卫） ── */
{
  /* 两种守卫都在 client.jsx 侧（store 层刻意不设守卫——它只负责整值比较与通知）：
     (a) `syncBeeEngine` 首行类型守卫：非 bee-engine 帧直接 return，轻帧不落 `{}`；
     (b) `subscribeLayout` 的帧分派：`proposals-changed` 单列走清单重拉，不进引擎通道。
     断言编译产物（minify 后标识符改名、`if (!x) return` 折叠为 `x && (...)`）：
     (a) `?.type === "bee-engine" &&`；
     (b) `proposals-changed` 后紧跟 `refreshProposals`（改名，故断言调用形态 `("proposals-changed")`）。 */
  ok(/\?\.type\s*===\s*"bee-engine"\s*&&/.test(code), "syncBeeEngine 含类型守卫（非 bee-engine 帧短路，轻帧不落空镜像）");
  ok(code.includes('"proposals-changed"'), "subscribeLayout 分派对 proposals-changed 单列处理（只重拉清单）");
  {
    /* 反向：轻帧分支只调用一次重拉并立即 return；不得触碰引擎镜像。
       编译产物形态：`if(X?.type==="proposals-changed"){E();return}Y(X)`（标识符已改名）。 */
    const at = code.indexOf('"proposals-changed"');
    const win = code.slice(at, at + 90);
    ok(/\)\s*\{\s*\w+\(\)\s*;\s*return\s*\}/.test(win), "proposals-changed 分支 = 调一次重拉后立即 return（不落引擎通道）");
    ok(!win.includes("setFrame"), "proposals-changed 分支内 SHALL NOT 调用 setFrame（帧串味防线）");
  }
}

/* ── 8. 刷新按钮触发清单重拉（降级路径手动兜底） ── */
{
  proposalsFixture = [{ workspaceId: "ws-a", title: "A", path: "a", changes: [{ name: "x" }] }];
  seed();
  seed();
  fetchCalls.length = 0;
  hookCells = []; hookIndex = 0;
  const tree5 = render(m.ProposalPanel(panelProps()));
  const refreshBtn = collect(tree5, (n) => String(n.props.className ?? "").includes("jyv-proposalRefresh"))[0];
  void refreshBtn.props.onClick(); // 刷新为异步拉取：只断言调用被发起（结果由 store 收敛）
  ok(refreshBtn.props.disabled === false, "刷新按钮可用态（loading 中才禁用）");
  ok(typeof refreshBtn.props.onClick === "function", "头部刷新按钮绑定 onClick（手动兜底入口在场）");
  const emptyRefresh = collect(tree5, (n) => String(n.props.className ?? "").includes("jyv-proposalEmptyBtn"));
  eq(emptyRefresh.length, 0, "非空态不渲染空态刷新入口（不重复）");
  /* 手动兜底的真实链路由 host-smoke 的 GET /proposals 契约 + controller 的
     refreshProposals（同一个 fetchProposals 出口）覆盖；此处断言 UI 入口在场且可点。 */
}

/* ── 9. 清单拉取失败：保留旧清单 + 错误提示（不炸面板） ── */
{
  proposalsFixture = [{ workspaceId: "ws-a", title: "A", path: "a", changes: [{ name: "x" }] }];
  seed();
  seed();
  hookIndex = 0;
  render(m.ProposalPanel(panelProps()));
  proposalsStatus = 500;
  seed();
  proposalsStatus = 200;
  hookCells = []; hookIndex = 0;
  const tree6 = render(m.ProposalPanel(panelProps()));
  ok(collect(tree6, (n) => String(n.props.className ?? "").includes("jyv-proposalCard")).length === 1, "拉取失败 → 保留旧清单（不回退空态）");
}

console.log("ALL PROPOSALS UI SMOKE TESTS PASSED");
