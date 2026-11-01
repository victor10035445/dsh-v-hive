/**
 * 语音工作台 UI + 编排核心冒烟测试（add-hive-voice-desk 3.4/3.6/4.5）。
 *
 * 沿 hotbars-ui-smoke 的沙箱（懒 CJS 工厂 + React 桩）执行 `lib/client.js`：
 *  - `VoiceDeskPanel`：PTT / 状态徽标 / 分段 chips / 确认卡 / 文档卡片 / 目标工作区
 *    选择器按快照渲染；
 *  - `VoiceSettingsBody`：设置「语音」节的 key 探测态、音色/语速/静默阈值/确认超时/
 *    人设/附和开关/打断阈值控件在档；
 *  - `createVoiceDesk`（编排核心）：PTT → 采集 → 段转写串行回填；ASR 失败与
 *    模型不可用两条错误路径 **必须带 err kind**（R16 错误可见性）；确认卡超时弹回；
 *    指令命中零 LLM（不触发 answer 回调）。
 * 运行：node test/voice-ui-smoke.mjs（先 node build.mjs）
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

/* ── React 桩（hotbars-ui 同款） ── */
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
  useEffect: () => {},
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

const listeners = new Set();
const windowStub = {
  addEventListener() {},
  removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  innerWidth: 1920,
  devicePixelRatio: 1,
  EventSource: undefined,
  __ModuleLoader__: null
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
  body: { appendChild() {}, observe() {}, contains: () => false },
  createElement: fakeElement,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
  removeEventListener() {},
  visibilityState: "visible",
  hasFocus: () => true
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
                        for (const l of [...listeners]) l();
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
    if (!m) console.error("[voice-ui-smoke] factory returned falsy exports");
  }
};
try {
  new Function(
    "window", "document", "localStorage", "performance", "requestAnimationFrame", "cancelAnimationFrame",
    "navigator", "location", "console", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
    "URL", "URLSearchParams", "Event", "fetch", "AbortController", "ResizeObserver", "MutationObserver",
    "HTMLElement", "HTMLTextAreaElement", "Element", "Node", "queueMicrotask", code
  )(
    windowStub, documentStub, { getItem: () => null, setItem() {} }, performance,
    () => 0, () => {}, { userAgent: "smoke", hardwareConcurrency: 8 }, { href: "http://localhost/" },
    console, setTimeout, clearTimeout, setInterval, clearInterval, URL, URLSearchParams,
    class Event {}, async () => ({ ok: false, status: 404, json: async () => ({}) }), AbortController,
    class ResizeObserver { observe() {} disconnect() {} unobserve() {} },
    class MutationObserver { observe() {} disconnect() {} },
    class HTMLElement {}, class HTMLTextAreaElement {}, class Element {}, class Node {}, queueMicrotask
  );
} catch (error) {
  console.error("[voice-ui-smoke] client bundle load failed:", error?.stack || error);
  throw error;
}

ok(m, "工厂产出 exports");

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
const byTestId = (root, id) => collect(root, (n) => n.props?.["data-testid"] === id);
/** React 桩的 hook 游标在每个组件实例内从 0 起——重渲染前必须归零（否则读到别的 cell）。 */
const renderFresh = (el) => {
  hookIndex = 0;
  return render(el);
};
/** select 的 option 值序列（JSX 多子表达式时 children 可能是 [静态项, 数组] 的嵌套）。 */
const optionValues = (node) => {
  const list = Array.isArray(node?.props?.children) ? node.props.children.flat(Infinity) : [node?.props?.children];
  return list.filter((child) => child && typeof child === "object" && child.type === "option").map((child) => child.props?.value);
};

const { VoiceDeskPanel, VoiceSettingsBody, createVoiceDesk } = m;
const t = (key) => key;

/* ════ 1. 面板渲染（快照驱动） ════ */

function fakeDesk(snapshot) {
  return {
    subscribe: () => () => {},
    getSnapshot: () => snapshot,
    pttDown: () => {},
    pttUp: () => {},
    triggerAnswer: () => {},
    endSession: () => {},
    confirm: () => {},
    cancel: () => {},
    deleteSegment: () => {},
    rerecordSegment: () => {},
    deliverArtifact: () => {},
    preloadCues: () => Promise.resolve()
  };
}

{
  const desk = fakeDesk({
    state: "listening",
    segments: [
      { seq: 1, text: "第一段内容", status: "ok" },
      { seq: 2, text: "", status: "failed", error: "boom" },
      { seq: 3, text: "", status: "pending" }
    ],
    transcript: "第一段内容",
    confirm: { kind: "summon", echo: "2 × 侦察蜂", candidates: [] },
    artifacts: [{ relativePath: "hive-voice/2026-09-27-x.md", path: "C:/ws/hive-voice/2026-09-27-x.md", truncated: true }],
    history: [],
    busy: false,
    speaking: false,
    micError: null,
    status: { state: "ready", key: { configured: true, source: "env" }, text: { provider: "p1", model: "m1" } },
    workspaceId: null,
    hotwords: [],
    missingCues: ["ack-ok"],
    receipts: []
  });
  hookCells = [];
  hookIndex = 0;
  const tree = render(
    react.createElement(VoiceDeskPanel, {
      t,
      desk,
      workspaces: [
        { id: "ws-1", title: "主巢", path: "C:/ws" },
        { id: "ws-2", title: "副巢", path: "C:/ws2" }
      ],
      onWorkspace: () => {},
      onClose: () => {}
    })
  );
  ok(byTestId(tree, "voice-desk").length === 1, "面板根节点在档");
  const stateNode = byTestId(tree, "voice-state")[0];
  eq(stateNode.props["data-state"], "listening", "状态徽标映射监听态");
  eq(textOf(stateNode), "hive.voice.stateListening", "状态文案走 i18n");
  ok(byTestId(tree, "voice-ptt").length === 1, "PTT 按钮在档");
  ok(byTestId(tree, "voice-answer").length === 1, "手动回答按钮在档");
  /* 原「唤醒/结束」独立按钮已删除（与单击切换语义重复，用户反馈）。 */
  const actionRow = collect(tree, (n) => String(n.props?.className ?? "").includes("jyv-voiceRow")).at(0);
  eq(collect(actionRow ?? { children: [] }, (n) => n.tag === "button").length, 2, "操作行只剩两个按钮（说话键 + 回答）");
  const chips = byTestId(tree, "voice-chips")[0];
  ok(chips !== undefined, "分段 chips 在档");
  eq(collect(chips, (n) => n.tag === "span" && n.props?.className === "jyv-voiceChip").length, 3, "三段 chips");
  const failed = collect(chips, (n) => n.props?.["data-status"] === "failed");
  eq(failed.length, 1, "失败段标记");
  const confirmNode = byTestId(tree, "voice-confirm")[0];
  ok(confirmNode !== undefined, "确认卡在档（副作用闸门）");
  ok(textOf(confirmNode).includes("2 × 侦察蜂"), "确认卡回显解析结果");
  ok(byTestId(tree, "voice-confirm-ok").length === 1 && byTestId(tree, "voice-confirm-cancel").length === 1, "确认/取消按钮在档");
  const docs = byTestId(tree, "voice-docs")[0];
  ok(textOf(docs).includes("2026-09-27-x.md"), "文档卡片在档");
  ok(textOf(docs).includes("⚠️"), "截断文档带警示");
  ok(byTestId(tree, "voice-workspace").length === 1, "目标工作区选择器在档");
  ok(textOf(tree).includes("hive.voice.assetsMissing"), "资产缺失提示在档（未建库降级）");
}

{
  /* 未配置 key → PTT 置灰 + 引导（入口可用但不可录）。 */
  const desk = fakeDesk({
    state: "idle",
    segments: [],
    transcript: "",
    confirm: null,
    artifacts: [],
    history: [],
    busy: false,
    speaking: false,
    micError: null,
    status: { state: "not-configured", key: { configured: false, source: null }, text: {} },
    workspaceId: null,
    hotwords: [],
    missingCues: [],
    receipts: []
  });
  hookCells = [];
  hookIndex = 0;
  const tree = render(react.createElement(VoiceDeskPanel, { t, desk, workspaces: [], onWorkspace: () => {}, onClose: () => {} }));
  eq(byTestId(tree, "voice-ptt")[0].props.disabled, true, "未配置 key → PTT 置灰");
  ok(textOf(tree).includes("hive.voice.statusNoKey"), "未配置 key → 引导文案");
  eq(byTestId(tree, "voice-confirm").length, 0, "无确认卡时不渲染");
}

/* ════ 2. 设置「语音」节（三层分区 + 写入式凭据） ════ */

const settings = { voice: { silenceMs: 8000, confirmTimeoutMs: 30000, backchannelEnabled: true, speechRms: 0.02 } };
const voiceWorkspaces = [
  { id: "ws-1", title: "主巢", path: "C:/ws" },
  { id: "ws-2", title: "副巢", path: "C:/ws2" }
];
const voiceDeskStatus = {
  state: "ready",
  key: { configured: true, source: "file" },
  voices: ["tongtong", "jam"],
  hotwordEncodings: ["repeat", "json"],
  personas: [
    { id: "queen-research", label: "蜂后·调研陪聊" },
    { id: "queen-brief", label: "蜂后·简报到点" }
  ],
  text: { provider: "p1", model: "m1" },
  prefs: { voice: "jam", speed: 1.1, textChannel: "dsh", asrHotwordsEncoding: "repeat", maxTokens: 4096, textModel: null, personaId: null, targetWorkspaceId: null },
  catalog: {
    default: { provider: "p1", model: "m1" },
    groups: [{ id: "p1", name: "Provider One", models: [{ id: "m1", name: "Model One", reasoning: { efforts: [{ id: "high", name: "High" }] } }] }]
  }
};

{
  hookCells = [];
  hookIndex = 0;
  const tree = render(
    react.createElement(VoiceSettingsBody, {
      t,
      settings,
      setSettings: () => {},
      deskStatus: voiceDeskStatus,
      onRefreshStatus: () => {},
      onSaveHostConfig: async () => ({ ok: true }),
      workspaces: voiceWorkspaces
    })
  );
  ok(byTestId(tree, "voice-settings").length === 1, "语音节根节点在档");
  const text = textOf(tree);
  for (const key of [
    "hive.voice.groupHost",
    "hive.voice.groupPrefs",
    "hive.voice.groupSession",
    "hive.voice.keyStatus",
    "hive.voice.apiKey",
    "hive.voice.textChannel",
    "hive.voice.textModel",
    "hive.voice.maxTokens",
    "hive.voice.persona",
    "hive.voice.targetWorkspace",
    "hive.voice.hotwords",
    "hive.voice.voice",
    "hive.voice.speed",
    "hive.voice.silence",
    "hive.voice.confirmTimeoutLabel",
    "hive.voice.backchannel",
    "hive.voice.bargeIn",
    "hive.voice.watermarkNote"
  ]) {
    ok(text.includes(key), `设置项在档：${key}`);
  }
  ok(text.includes("hive.voice.keyHint"), "key 配置指引在档（宿主侧路径说明）");
  eq(byTestId(tree, "voice-key-state")[0].props["data-state"], "ready", "凭据状态徽标");

  /* 只写不读：已配置状态下输入框仍为空，渲染树不含任何 key 值。 */
  const keyInput = byTestId(tree, "voice-key-input")[0];
  eq(keyInput.props.type, "password", "key 输入框为密码型（不明文显示）");
  eq(keyInput.props.value, "", "key 输入框恒空（SHALL NOT 回显已存 key）");
  eq(keyInput.props.autoComplete, "off", "关闭浏览器自动填充");
  eq(text.includes("sk-"), false, "渲染树不含任何 key 值");

  /* 宿主侧偏好控件在档（音色/语速/通道/模型/上限/人设/工作区/热词编码）。 */
  for (const id of ["voice-pref-voice", "voice-pref-channel", "voice-pref-model", "voice-pref-maxtokens", "voice-pref-persona", "voice-pref-workspace", "voice-pref-hotwords"]) {
    eq(byTestId(tree, id).length, 1, `宿主偏好控件在档：${id}`);
  }
  const modelSelect = byTestId(tree, "voice-pref-model")[0];
  /* 与蜂群编辑模态同口径：有 reasoning efforts 的模型按 effort 展开（不再单列无 effort 项）。 */
  eq(optionValues(modelSelect), ["", "p1/m1/high"], "模型下拉 = 默认项 + provider·model·effort");
  const modelLabels = (Array.isArray(modelSelect.props.children) ? modelSelect.props.children.flat(Infinity) : []).map((c) => String(c?.props?.children ?? ""));
  ok(modelLabels.some((label) => label.includes("Provider One · Model One · High")), "下拉标签带 provider/model/effort 名");
  eq(modelSelect.props.value, "", "未选模型 → 跟随目录默认");
  eq(byTestId(tree, "voice-pref-voice")[0].props.value, "jam", "音色取自宿主偏好");
  eq(optionValues(byTestId(tree, "voice-pref-workspace")[0]), ["", "ws-1", "ws-2"], "工作区下拉 = 自动 + 两个在册巢");
}

/* 提交路径：保存 key 只发 apiKey（不夹带偏好）；保存偏好一次 PUT 全字段。 */
{
  hookCells = [];
  hookIndex = 0;
  const saved = [];
  const props = {
    t,
    settings,
    setSettings: () => {},
    deskStatus: voiceDeskStatus,
    onRefreshStatus: () => {},
    onSaveHostConfig: async (patch) => {
      saved.push(patch);
      return { ok: true };
    },
    workspaces: voiceWorkspaces
  };
  eq(byTestId(renderFresh(react.createElement(VoiceSettingsBody, props)), "voice-key-save")[0].props.disabled, true, "空 key → 保存按钮禁用（防空值覆盖已存 key）");

  byTestId(renderFresh(react.createElement(VoiceSettingsBody, props)), "voice-key-input")[0].props.onChange({ target: { value: "sk-test-abc" } });
  const typed = renderFresh(react.createElement(VoiceSettingsBody, props));
  eq(byTestId(typed, "voice-key-save")[0].props.disabled, false, "有内容 → 保存按钮可用");
  byTestId(typed, "voice-key-save")[0].props.onClick();
  await new Promise((resolve) => setTimeout(resolve, 10));
  eq(saved.length, 1, "保存 key 发一次请求");
  eq(Object.keys(saved[0]), ["apiKey"], "key 提交不夹带偏好字段");
  eq(saved[0].apiKey, "sk-test-abc", "key 原样提交");

  byTestId(renderFresh(react.createElement(VoiceSettingsBody, props)), "voice-key-clear")[0].props.onClick();
  await new Promise((resolve) => setTimeout(resolve, 10));
  eq(saved[1], { clearKey: true }, "清除 key 提交 clearKey");

  /* 改音色 + 文本通道 → 保存偏好：一次 PUT 带全部宿主侧字段（不含 key）。 */
  byTestId(renderFresh(react.createElement(VoiceSettingsBody, props)), "voice-pref-voice")[0].props.onChange({ target: { value: "tongtong" } });
  byTestId(renderFresh(react.createElement(VoiceSettingsBody, props)), "voice-pref-channel")[0].props.onChange({ target: { value: "zhipu" } });
  byTestId(renderFresh(react.createElement(VoiceSettingsBody, props)), "voice-prefs-save")[0].props.onClick();
  await new Promise((resolve) => setTimeout(resolve, 10));
  const prefs = saved[2];
  eq(prefs.voice, "tongtong", "偏好：音色");
  eq(prefs.textChannel, "zhipu", "偏好：文本通道");
  eq(prefs.asrHotwordsEncoding, "repeat", "偏好：热词编码（未改也随全量提交）");
  eq(prefs.maxTokens, 4096, "偏好：产出上限");
  eq(prefs.textModel, null, "偏好：未选模型 → null（清除键）");
  eq(prefs.personaId, null, "偏好：未选人设 → null");
  ok(!("apiKey" in prefs), "偏好提交不夹带 key");
}

{
  /* 宿主未加载 /voice/config（客户端 HMR 先行、宿主需重启）→ 给「重启 dsh web」的准确指引。 */
  hookCells = [];
  hookIndex = 0;
  const staleProps = {
    t,
    settings,
    setSettings: () => {},
    deskStatus: voiceDeskStatus,
    onRefreshStatus: () => {},
    onSaveHostConfig: async () => ({ ok: false, stale: true, error: "voice config route missing" }),
    workspaces: voiceWorkspaces
  };
  byTestId(renderFresh(react.createElement(VoiceSettingsBody, staleProps)), "voice-key-input")[0].props.onChange({ target: { value: "sk-stale" } });
  byTestId(renderFresh(react.createElement(VoiceSettingsBody, staleProps)), "voice-key-save")[0].props.onClick();
  await new Promise((resolve) => setTimeout(resolve, 10));
  const afterStale = renderFresh(react.createElement(VoiceSettingsBody, staleProps));
  ok(textOf(afterStale).includes("hive.voice.configStale"), "宿主缺路由 → 提示重启 dsh web（不是裸 404）");
  ok(!textOf(afterStale).includes("sk-stale"), "失败回执也不回显 key");
}

{
  /* 未配置 key → 状态徽标与空态占位；目录为空时模型下拉退化为「跟随默认」一项。 */
  hookCells = [];
  hookIndex = 0;
  const bare = render(
    react.createElement(VoiceSettingsBody, {
      t,
      settings,
      setSettings: () => {},
      deskStatus: { state: "not-configured", key: { configured: false, source: null }, prefs: {}, voices: ["tongtong"], personas: [], catalog: { default: null, groups: [] } },
      onRefreshStatus: () => {},
      onSaveHostConfig: async () => ({ ok: true }),
      workspaces: []
    })
  );
  eq(byTestId(bare, "voice-key-state")[0].props["data-state"], "not-configured", "未配置态徽标");
  eq(byTestId(bare, "voice-key-input")[0].props.placeholder, "hive.voice.keyPlaceholderEmpty", "未配置 → 空态占位提示");
  eq(byTestId(bare, "voice-pref-model")[0].props.children.length, 1, "无目录 → 仅「跟随目录默认」");
  eq(byTestId(bare, "voice-key-input")[0].props.value, "", "未配置时输入框同样为空");
}

/* ════ 3. 编排核心：段转写串行 + 错误可见性（R16） ════ */

async function deskHarness(overrides = {}) {
  const notified = [];
  const segments = [];
  const asrCalls = [];
  let answerCalls = 0;
  let segmentHandler = null;
  const fakeRecorder = {
    segmenter: { config: { speechRms: 0.02 } },
    onSegment: null,
    start: async () => true,
    stop: () => [],
    release: () => {},
    holdOff: () => {}
  };
  const desk = createVoiceDesk({
    /* 默认 t 回显键名（与其它用例一致）；需要验证插值的用例可覆盖，给出带占位符的模板。 */
    t: overrides.t ?? ((key) => key),
    notify: (text, kind) => notified.push({ text, kind }),
    scope: windowStub,
    recorder: fakeRecorder,
    fetch: async () => ({ ok: false, status: 404, json: async () => ({}) }),
    asr: async (wav, options) => {
      asrCalls.push(options);
      return overrides.asr ? overrides.asr(wav, options) : { ok: true, text: `段${asrCalls.length}` };
    },
    answer: async () => {
      answerCalls += 1;
      return overrides.answer ? overrides.answer() : { ok: true, spoken: "摘要", markdown: "文档", relativePath: "hive-voice/a.md", path: "C:/ws/hive-voice/a.md", truncated: false };
    },
    actions: { summon: async () => ({ ok: true }), send: async () => ({ ok: true }) },
    referents: () => overrides.referents ?? [],
    beeTypes: () => overrides.beeTypes ?? [{ id: "t1", name: "侦察蜂" }],    workspaceId: () => "ws-1",
    settings: () => ({ silenceMs: 8000, voice: "tongtong", speed: 1 }),
    hasFocus: () => true
  });
  segmentHandler = (segment) => fakeRecorder.onSegment?.(segment);
  desk.setActions({ summon: async () => ({ ok: true }), send: async () => ({ ok: true }) });
  return { desk, notified, asrCalls, fakeRecorder, emit: segmentHandler, answerCalls: () => answerCalls };
}

{
  const harness = await deskHarness();
  const { desk } = harness;
  ok(typeof harness.fakeRecorder.onSegment === "function", "段事件已接线（onSegment 注入）");
  await desk.pttDown();
  eq(desk.getSnapshot().state, "listening", "PTT → 监听");

  /* 段 1、段 2 按录音顺序入队 → 串行转写 → 按段号回填。 */
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  eq(harness.asrCalls.length, 2, "两段各自转写一次");
  eq(desk.getSnapshot().transcript, "段1\n段2", "按段号顺序拼接");
  eq(desk.getSnapshot().segments.map((s) => s.seq), [1, 2], "段号按录音顺序");

  /* 段编辑：删除 / 重录影响拼接稿与后续投递输入。 */
  desk.deleteSegment(1);
  eq(desk.getSnapshot().transcript, "段2", "删除分段即时影响拼接稿");
  desk.rerecordSegment(2);
  eq(desk.getSnapshot().transcript, "", "重录中的段不计入拼接稿");
  desk.dispose();
}

{
  /* 投递确认卡：命中「把总结发给三号蜂」→ 确认后才走 send；**send 失败 SHALL NOT 静默改走 summon**
     （确认卡回显的是「发给三号蜂」，凭空新建会话属于另一种副作用，与 D3/R10 相悖）。 */
  const referents = [
    { index: 1, title: "一号蜂会话", beeTypeName: "工蜂", sessionId: "s1", selected: false },
    { index: 3, title: "三号蜂会话", beeTypeName: "工蜂", sessionId: "s3", selected: false }
  ];
  const harness = await deskHarness({ referents });
  const desk = harness.desk;
  const calls = { send: [], summon: [] };
  desk.setActions({
    send: async (sessionId, prompt) => {
      calls.send.push({ sessionId, prompt });
      return { ok: true };
    },
    summon: async (payload) => {
      calls.summon.push(payload);
      return { ok: true };
    }
  });
  await desk.pttDown();
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  desk.session.session.segments[0].text = "把总结发给三号蜂";
  await desk.triggerAnswer(true);
  const pending = desk.getSnapshot().confirm;
  ok(pending !== null, "投递命中 → 确认卡");
  eq(pending.kind, "deliver", "确认卡类型 = 投递");
  ok(pending.echo.includes("3号蜂 = 「三号蜂会话」"), "确认卡回显序号→标题");
  eq(calls.send.length, 0, "确认前 SHALL NOT 投递");
  await desk.confirm();
  eq(calls.send.length, 1, "确认后走 send 一次");
  eq(calls.send[0].sessionId, "s3", "投递到解析出的会话");
  ok(calls.send[0].prompt.includes("# "), "投递内容是组装好的提示词（含标题）");
  eq(calls.summon.length, 0, "投递 SHALL NOT 触发新建蜂");
  desk.dispose();

  /* send 失败 → 如实失败 + 错误回执，仍不新建蜂。 */
  const failing = await deskHarness({
    referents: [{ index: 3, title: "三号蜂会话", beeTypeName: "工蜂", sessionId: "s3", selected: false }]
  });
  const failCalls = { send: 0, summon: 0 };
  failing.desk.setActions({
    send: async () => {
      failCalls.send += 1;
      return { ok: false, error: "session has no live agent" };
    },
    summon: async () => {
      failCalls.summon += 1;
      return { ok: true };
    }
  });
  await failing.desk.pttDown();
  failing.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  failing.desk.session.session.segments[0].text = "把总结发给三号蜂";
  await failing.desk.triggerAnswer(true);
  await failing.desk.confirm();
  eq(failCalls.send, 1, "send 失败仍只试一次");
  eq(failCalls.summon, 0, "send 失败 SHALL NOT 改走 summon");
  ok(
    failing.notified.some((n) => n.kind === "err" && n.text.includes("hive.voice.sendFailed")),
    "投递失败 → 错误通道回执"
  );
  failing.desk.dispose();
}

{
  /* 单击切换会话 / 按住收段（2026-09-27 用户实测反馈定稿的交互）：
     单击（<300ms）= 待机 → 监听；已在监听 → 结束会话；按住（≥300ms）= 松手收段。 */
  const harness = await deskHarness();
  const desk = harness.desk;
  eq(desk.getSnapshot().state, "idle", "初始待机");

  await desk.pressStart();
  eq(desk.getSnapshot().state, "listening", "单击进入监听");
  let outcome = desk.pressEnd(120);
  eq(outcome.action, "keep-listening", "待机态单击松手 → 保持监听（不进段收口）");
  eq(desk.getSnapshot().state, "listening", "仍在监听");

  outcome = desk.pressEnd(900);
  eq(outcome.action, "cut", "已在会话中按住松手 → 收段");
  eq(desk.getSnapshot().state, "listening", "收段后仍在会话里");

  outcome = desk.pressEnd(100);
  eq(outcome.action, "end", "会话中单击 → 结束会话");
  eq(desk.getSnapshot().state, "idle", "结束后回待机");
  eq(harness.notified.some((n) => n.text.includes("hive.voice.ended")), true, "结束有回执");
  desk.dispose();
}

{
  /* 空转写走中性提示（非错误通道）——真机反馈它曾被刷成一串「转写失败」。 */
  const harness = await deskHarness({ asr: () => ({ ok: true, text: "   " }) });
  await harness.desk.pttDown();
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  eq(harness.desk.getSnapshot().segments[0].status, "empty", "空转写 → empty");
  ok(harness.notified.some((n) => n.text.includes("hive.voice.segEmpty")), "中性提示在档");
  eq(harness.notified.filter((n) => n.kind === "err").length, 0, "空转写 SHALL NOT 走错误通道");
  harness.desk.dispose();
}

{
  /* 工具面可见性：宿主上报 usedTools → 客户端必须给可见警告（真机反馈的「读了其他会话」症状）。 */
  const harness = await deskHarness({
    t: (key) => (key === "hive.voice.toolWarning" ? "⚠️ 本次应答调用了工具（{tools}）" : key),
    answer: () => ({
      ok: true,
      spoken: "摘要",
      markdown: "文档",
      relativePath: "hive-voice/a.md",
      path: "C:/ws/hive-voice/a.md",
      truncated: false,
      usedTools: { count: 2, names: ["fs", "hive_wait"] }
    })
  });
  await harness.desk.pttDown();
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  await harness.desk.triggerAnswer(true);
  const warn = harness.notified.find((n) => n.text.includes("调用了工具"));
  ok(warn !== undefined, "调过工具 → 可见警告在档");
  eq(warn.kind, "err", "警告走错误通道（可见）");
  ok(warn.text.includes("fs") && warn.text.includes("hive_wait"), "警告列出工具名");
  harness.desk.dispose();
}

{
  /* ASR 失败：固定音 + **err kind 回执** + 段保留重录入口。 */
  const harness = await deskHarness({ asr: () => ({ ok: false, error: "upstream 500" }) });
  await harness.desk.pttDown();
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  const errors = harness.notified.filter((n) => n.kind === "err");
  ok(errors.length >= 1, "转写失败必须走错误通道（kind=err）");
  ok(errors[0].text.includes("hive.voice.asrFailed"), "转写失败回执文案");
  eq(harness.desk.getSnapshot().segments[0].status, "failed", "失败段保留（可重录）");
  harness.desk.dispose();
}

{
  /* 模型不可用：结构化态 + err 回执（不抛错堆栈）。 */
  const harness = await deskHarness({ answer: () => ({ ok: false, error: "no routable text model", state: "no-model" }) });
  await harness.desk.pttDown();
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  await harness.desk.triggerAnswer(true);
  const errors = harness.notified.filter((n) => n.kind === "err");
  ok(errors.some((n) => n.text.includes("hive.voice.unavailable")), "模型不可用 → 引导回执（err）");
  eq(harness.desk.getSnapshot().state, "listening", "不可用后仍回监听（不卡死）");
  harness.desk.dispose();
}

{
  /* 指令命中零 LLM：不触发 answer 回调，且副作用族先出确认卡。 */
  const harness = await deskHarness();
  const desk = harness.desk;
  await desk.pttDown();
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  /* 用拼接稿替换为命令句（模拟 ASR 结果即命令）。 */
  desk.session.session.segments[0].text = "结束会话";
  await desk.triggerAnswer(true);
  eq(harness.answerCalls(), 0, "指令命中 SHALL NOT 调用任何 LLM（M1 零成本）");
  eq(desk.getSnapshot().state, "idle", "「结束会话」→ 回待机");
  desk.dispose();
}

{
  /* 有副作用指令：先出确认卡，未确认不执行。 */
  const harness = await deskHarness();
  const desk = harness.desk;
  await desk.pttDown();
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  desk.session.session.segments[0].text = "召唤两个侦察蜂";
  await desk.triggerAnswer(true);
  const pending = desk.getSnapshot().confirm;
  ok(pending !== null, "召唤命中 → 确认卡（副作用闸门）");
  eq(pending.kind, "summon", "确认卡动作类型");
  eq(harness.answerCalls(), 0, "确认前不调用 LLM");
  await desk.confirm();
  eq(desk.getSnapshot().confirm, null, "确认后清空待确认态");
  desk.dispose();
}

{
  /* 确认卡超时：弹回并播固定音（不悬置阻塞后续口述）。 */
  const harness = await deskHarness();
  const desk = harness.desk;
  await desk.pttDown();
  harness.emit({ wav: new Uint8Array(64), bytes: 64, durationMs: 900 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  desk.session.session.segments[0].text = "把总结发给三号蜂";
  desk.session.session.confirm = null;
  desk.session.requestConfirm({ kind: "deliver", echo: "总结 → 3号蜂", payload: { target: { index: 3, title: "三号" } } });
  ok(desk.getSnapshot().confirm !== null, "投递确认卡挂起");
  desk.session.session.confirm.expiresAt = Date.now() - 1;
  desk.tick();
  eq(desk.getSnapshot().confirm, null, "超时 → 自动取消（弹回）");
  ok(harness.notified.some((n) => n.kind === "err"), "超时回执走错误通道");
  desk.dispose();
}

{
  /* 交付提示词组装：标题 + 正文 + 脚注（含截断提示与来源路径，task 4.3）。 */
  const prompt = m.assembleDeliveryPrompt({
    title: "语音整理产物",
    body: "正文内容",
    artifact: { relativePath: "hive-voice/a.md", truncated: true }
  });
  ok(prompt.startsWith("# 语音整理产物"), "提示词以标题开头");
  ok(prompt.includes("正文内容"), "提示词含正文");
  ok(prompt.includes("来源文档：hive-voice/a.md"), "脚注含来源路径");
  ok(prompt.includes("被截断"), "脚注含截断提示");
}

{
  /* 安全网清理：确认卡超时时钟与定时器（避免挂住 smoke 进程）。 */
  await new Promise((resolve) => setTimeout(resolve, 10));
}

console.log("voice-ui-smoke: OK");
