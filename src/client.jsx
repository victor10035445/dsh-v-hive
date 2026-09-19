/**
 * dsh-v-hive — 浏览器半区（由 build.mjs 打包成懒 CJS 工厂 lib/client.js）。
 *
 * 入口与页面（v0.2 改版，对齐 dsh-token-insight 的形态；用户决策）：
 *  - sidebar.footer.action 座位：侧栏底部「Hive」按钮（Token统计/设置同款座位排版，
 *    wide 双形态），order 30 排在 Token统计（20）一侧上方；
 *  - shell.overlay 条目（order 40）：应用内整页帧——left 跟踪侧栏右缘
 *    （usePageLeft 测量 [data-slot="sidebar"] 父列，降级 left:0），Esc 关闭；
 *  - 页面开合走模块级 hiveOpenStore（微观察者，insight dashboardOpenStore 同款），
 *    座位与页面不绑同一 slot store handle（one handle, one scope 纪律不受影响）；
 *  - 会话头 utilities 方形回巢按钮（explorer 同款 MutationObserver 注入，session
 *    作用域不共享 store，动作经镜像转发）；
 *  - 页内设置模态（hive-quick-commands 五轮：「场景显示」页签，动作经 store 桥
 *    转发；不走宿主 settings.plugins.tab；context-hotbar-rework 将改左纵排并
 *    增设布局节）；
 *  - 会话浮窗（CSS 整形 + 遮罩孔洞，D3）+ 幻影桥（conversation.composer.dock
 *    渲染 null 条目，D2）：镜像当帧输入机快照，供蜂栏未勾自动发送卡片经
 *    setDraft 追加草稿（旧快捷指令拆除后由 context-hotbar-rework 道具栏复用）；
 *  - 镜像控制器（controller）：订阅 ctx.sessions.list / ctx.workspaces.list →
 *    bee-model 派生世界 → 场景；布局持久化走宿主端 /api/dsh-hive/*（D8）；
 *  - 全部官方动词经注入服务使用，不修改任何官方包。
 */
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { IconSettingsOutline16 } from "@deepseek-ai/dsh-client-ui-primitives";
import { HiveScene } from "./hive/scene.mjs";
import { deriveWorld, sessionsBriefOf } from "./bee-model.mjs";
import { sessionsBriefStore } from "./brief.mjs";
import { keyboardGuarded } from "./hive/keyboard.mjs";
import { fetchState, putState, sendCommand, subscribeLayout, hatchBee, laneAction, fetchModels, resetLatch, summonBee } from "./api.mjs";
import {
  appendPrompt,
  workerBeeIdOf,
  resolveHotbarKind,
  normalizeHotbars,
  effectiveHotbarSlots,
  HOTBAR_RESIDENT_KINDS,
  validateSlotDraft,
  HOTBAR_COLUMN_LIMIT,
  HOTBAR_KINDS
} from "./hotbars.mjs";
import { validateBeeTypesDraft, normalizeBeeTypes, BEE_APPEARANCE_MODELS, DEFAULT_APPEARANCE_MODEL } from "./bee-types.mjs";
import {
  normalizeStatusCards,
  validateStatusCardDraft,
  completionPool,
  completionSessions,
  advanceCursor,
  snapshotSessions,
  statusBarReserve,
  MAX_STATUS_CARDS
} from "./status-cards.mjs";
import { hiveStore, beeTypesStore, beeEngineStore, hotbarsStore, sanitizeLayout, LAYOUT_DEFAULTS, PANEL_LIMITS, BAR_LIMITS, REPORT_ROWS_LIMIT, CHROME_SCHEMES } from "./store.mjs";
import { CSS } from "./styles.mjs";
import { APPEARANCE_DEFAULTS, APPEARANCE_REV } from "./hive/palette.mjs";
import { CombatLogFeed, EV_KIND } from "./hive/combat-log.mjs";

const PLUGIN_ID = "dsh-v-hive";
const NS = "dsh-hive";

/** 报告行数读侧净房（localStorage 手改/旧档越界 → 落回界内，store 同款纪律）。 */
function sanitizeReportRows(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 8;
  return Math.min(REPORT_ROWS_LIMIT[1], Math.max(REPORT_ROWS_LIMIT[0], n));
}

/** @type {import("react").MutableRefObject<import("react").Context | null>} 由 apply 注入 */
const ctxRef = { current: null };

/* ------------------------------------------------------------------ *
 * 页面开合 store（模块级微观察者，insight 的 dashboardOpenStore 同款）：
 * 座位按钮（sidebar.footer.action）与整页（shell.overlay）共用同一份开合事实，
 * 两者不绑同一 slot store handle（one handle, one scope 纪律）。
 * ------------------------------------------------------------------ */

const hiveOpenStore = {
  open: false,
  listeners: new Set(),
  getSnapshot() {
    return this.open;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  set(open) {
    if (this.open === open) return;
    this.open = open;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* 订阅者异常不阻断其余通知 */
      }
    }
  }
};

function useHiveOpen() {
  return useSyncExternalStore(
    (listener) => hiveOpenStore.subscribe(listener),
    () => hiveOpenStore.getSnapshot()
  );
}

/* ------------------------------------------------------------------ *
 * 门控与桥镜像（context-hotbar-rework D1/D2）：
 *  - selectedBeeStore：当前选中工蜂 id 镜像（蜂栏/覆盖面板门控：工蜂才显示）；
 *  - composerBridge：幻影桥（D2）——conversation.composer.dock 渲染 null 的
 *    条目把当帧 InputZone 快照 { sessionId, inputActions, input, phase } 镜像
 *    进来（inputRef 当帧纪律），root 作用域（蜂巢页）点击蜂栏未勾卡片时经桥
 *    取当帧快照写草稿。桥对 sessionId/phase/inputActions 就绪性的变化做计数
 *    发布，供卡片禁用态响应；input 本体静默更新（草稿逐键变化，不触发蜂巢重渲染）。
 * ------------------------------------------------------------------ */

const selectedBeeStore = {
  id: null,
  listeners: new Set(),
  getSnapshot() {
    return this.id;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  set(id) {
    if (this.id === id) return;
    this.id = id;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }
};

/* 场景选中槽镜像（context-hotbar-rework 6.1/D1）：{kind,id} 整值发布（null = 无
   选中）。三路驱动：镜像 tick（rebuild）、current 变化、场景选中变化/自动清空
   （onSelectionChange + rebuild 双路兜底）。道具栏门控与覆盖面板收起共用。 */
const selectionStore = {
  selection: null,
  listeners: new Set(),
  getSnapshot() {
    return this.selection;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  set(selection) {
    const next = selection && typeof selection === "object" ? { kind: selection.kind, id: selection.id } : null;
    if (JSON.stringify(this.selection) === JSON.stringify(next)) return;
    this.selection = next;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }
};

/* 世界派生版本号镜像（7.2 面板实时跟随）：controller.rebuild 每轮 +1（整值，
   便宜且无深比较），覆盖面板订阅后取 getScene().world 渲染。 */
const worldVersionStore = {
  version: 0,
  listeners: new Set(),
  getSnapshot() {
    return this.version;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  bump() {
    this.version += 1;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }
};

/* 蜂群面板 3D 模型预览镜像（hive-interaction-polish 追加）：场景侧每外观模型渲染
   一次小尺寸快照（dataURL），经 onBeePreview 回调入 store；面板卡片按蜂种外观
   模型取用。版本号 store（worldVersionStore 同款）——快照生成完成时 bump（低频：
   每外观模型至多一次），驱动面板重渲染。 */
const beePreviewStore = {
  version: 0,
  map: {},
  listeners: new Set(),
  getSnapshot() {
    return this.version;
  },
  getMap() {
    return this.map;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  set(modelId, url) {
    if (this.map[modelId] === url) return;
    this.map = { ...this.map, [modelId]: url };
    this.version += 1;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }
};

/* 框选多选集镜像（hive-marquee-and-card-rework 2.5）：页内临时态（SHALL NOT 持久化、
   SHALL NOT 改变当前会话），轻量 store 非 React state（逐帧免渲染压力）。ids 为
   松手时刻投影序冻结数组（先上到下、先左后右，beeIdsInRect 产出）；scene 经
   onMarqueeCommit（松手/收敛）/onMarqueeCancel 回调驱动，提交集合回写 scene
   （setMarqueeIds）供描边目标集合与收敛。 */
const marqueeStore = {
  ids: [],
  set: new Set(),
  version: 0,
  listeners: new Set(),
  getSnapshot() {
    return this.version;
  },
  getIds() {
    return this.ids;
  },
  getSet() {
    return this.set;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  commit(ids) {
    const next = Array.isArray(ids) ? ids : [];
    if (next.length === this.ids.length && next.every((id, i) => id === this.ids[i])) return;
    this.ids = next;
    this.set = new Set(next);
    this.version += 1;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }
};

/* 框选矩形镜像（2.3）：interact onMarqueeMove → scene 透传 → 选框 DOM。消费方
   MarqueeOverlay 订阅后**命令式**写 style（非 React state）——拖拽 pointermove
   高频路径零重渲染。rect 为 canvas 本地坐标（与 canvasWrap 同系）。 */
const marqueeRectStore = {
  rect: null,
  listeners: new Set(),
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  set(rect) {
    this.rect = rect;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }
};

/* 模态打开序栈（context-hotbar-rework 5.5/Esc 分层 F1）：设置/蜂群/指令编辑
   同层模态按打开序消费 Esc——后开先关。挂载 push、卸载 remove，栈顶 guard
   即当前应消费的关闭请求（脏草稿离开提醒在各自 guard 内）。 */const modalStack = [];
function pushModalEntry(id, guard) {
  removeModalEntry(id);
  modalStack.push({ id, guard });
}
function removeModalEntry(id) {
  const index = modalStack.findIndex((entry) => entry.id === id);
  if (index !== -1) modalStack.splice(index, 1);
}
function topModalGuard() {
  return modalStack.length ? modalStack[modalStack.length - 1].guard : null;
}

const composerBridge = {
  sessionId: null,
  inputActions: null,
  input: null,
  phase: "plain",
  sig: 0,
  listeners: new Set(),
  getSnapshot() {
    return this.sig;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  notify() {
    this.sig += 1;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }
};

/**
 * 幻影桥条目（D2）：渲染 null 的 conversation.composer.dock 条目（契约允许
 * null 返回——skill-links hero 条目同款先例）。渲染期直接写模块级桥（当帧纪律：
 * 官方 skeleton 在 session/input 任一 store 变化时重渲染本条目，桥即最新）；
 * 卸载清桥。视觉零影响、零层序改动。
 */
function ComposerBridgeEntry(props) {
  const session = props.session ?? null;
  const input = props.input ?? null;
  const inputActions = props.inputActions ?? null;
  const phase = input !== null && typeof input.phase === "string" ? input.phase : "plain";
  const sigChanged =
    session?.sessionId !== composerBridge.sessionId ||
    phase !== composerBridge.phase ||
    Boolean(inputActions) !== Boolean(composerBridge.inputActions);
  composerBridge.sessionId = session?.sessionId ?? null;
  composerBridge.inputActions = inputActions;
  composerBridge.input = input;
  composerBridge.phase = phase;
  if (sigChanged) {
    /* 发布移出渲染期（微任务）：桥写入同步、通知异步，避免渲染期唤起订阅者 */
    const publish = () => composerBridge.notify();
    if (typeof queueMicrotask === "function") queueMicrotask(publish);
    else setTimeout(publish, 0);
  }
  useEffect(() => {
    return () => {
      composerBridge.sessionId = null;
      composerBridge.inputActions = null;
      composerBridge.input = null;
      composerBridge.phase = "plain";
      composerBridge.notify();
    };
  }, []);
  return null;
}

function tryBridgeAppend(sessionId, prompt) {
  const bridge = composerBridge;
  if (!bridge.inputActions || bridge.sessionId !== sessionId || bridge.phase !== "plain") return false;
  const draft = bridge.input !== null && typeof bridge.input.draft === "string" ? bridge.input.draft : "";
  bridge.inputActions.setDraft(appendPrompt(draft, prompt));
  return true;
}

function nextFrame() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 16);
  });
}

/** 召唤草稿等待窗口（ms）：种子通道轮询宿主名单收录（binding 就绪）的上限，
 *  桥回退通道共用；本地流通常数百毫秒内收敛，3s 只兜底慢网/流重连。 */
const BRIDGE_CONVERGE_TIMEOUT_MS = 3000;
/** 等待期重发 selectBee 间隔（ms）：open 幂等；stage 对「名单未收录」的选择会
 *  掩蔽 current（selection 仍在、stage 不动），名单补录后需要一次 current 触碰
 *  才会开演（宿主 open 语义：a failed one retries the next time current is
 *  touched）。 */
const BRIDGE_RESELECT_INTERVAL_MS = 400;
/** 输入壳种子轮询间隔（ms）：等宿主名单收录新召唤会话（binding 就绪）。 */
const SHELL_SEED_INTERVAL_MS = 120;

function selectSession(sessionId) {
  try {
    controllerRef.current?.actions.selectBee?.(sessionId);
  } catch {
    /* 宿主 open 对名单外 id fail-loud：召唤返回与流补录之间的窗口会命中；
       等待循环随名单收敛自然消失，不在此上报。 */
  }
}

/**
 * 召唤草稿主通道（D5 修订）：新召唤会话 blank 期 composer 为 hero variant，
 * composer.dock 槽位（桥条目宿主）不渲染——桥对空白会话结构性缺席，等待永不
 * 收敛（实测：轮询 3s 超时告警）。改为轮询直址输入壳（宿主 conversation.input
 * 服务，官方 selectWorkspace 切会话搬草稿同款通道）：binding 就绪即写稿，随后
 * open 切当前会话，composer 挂载即带稿。周期性重发 open（幂等）让 selection 在
 * 名单补录后落位。超时返回 false，调用方回落桥通道/提示。
 */
async function seedSummonDraft(sessionId, prompt, timeoutMs = BRIDGE_CONVERGE_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  let lastSelect = 0;
  for (;;) {
    if (controllerRef.current?.actions.seedDraft?.(sessionId, prompt)) {
      selectSession(sessionId); // 种子就位 → open（binding 已就绪，不再 fail-loud）
      return true;
    }
    const now = Date.now();
    if (now >= deadline) return false;
    if (now - lastSelect >= BRIDGE_RESELECT_INTERVAL_MS) {
      lastSelect = now;
      selectSession(sessionId); // 名单补录后重触碰 current（open 幂等）
    }
    await new Promise((resolve) => setTimeout(resolve, SHELL_SEED_INTERVAL_MS));
  }
}

/**
 * 草稿通道（D2 点击路径，现为召唤链回退）：桥当帧校验（sessionId 与选中蜂一致
 * + phase plain）。当前蜂路径当帧可达、立即命中；对空白新召唤会话结构性不可达
 * （hero variant 不渲染 dock 桥，见 seedSummonDraft），仅作非 blank 会话的短
 * 回退。窗口内逐帧校验、定期重发 selectBee（幂等），收敛即追加；超时返回
 * false，由调用方决定兜底提示。
 */
async function appendViaBridge(sessionId, prompt, timeoutMs = BRIDGE_CONVERGE_TIMEOUT_MS) {
  if (tryBridgeAppend(sessionId, prompt)) return true;
  selectSession(sessionId);
  const deadline = Date.now() + timeoutMs;
  let lastSelect = Date.now();
  while (Date.now() < deadline) {
    await nextFrame();
    if (tryBridgeAppend(sessionId, prompt)) return true;
    const now = Date.now();
    if (now - lastSelect >= BRIDGE_RESELECT_INTERVAL_MS) {
      lastSelect = now;
      selectSession(sessionId);
    }
  }
  return false;
}
/* ------------------------------------------------------------------ *
 * 文案（zh 为准，en 对齐键集；官方状态语义同源措辞）
 * ------------------------------------------------------------------ */

const zh = {
  "hive.title": "蜂巢指挥中心",
  "hive.seat": "Hive",
  "hive.seat.aria": "打开蜂巢指挥中心",
  "hive.fullscreen": "全屏巡检",
  "hive.exitFullscreen": "退出全屏（Esc）",
  "hive.spinToggle": "右键旋转",
  "hive.spinToggle.tooltip": "开启后：右键拖拽 = 方位旋转（俯仰锁定为设置值）；关闭（默认）= 右键拖拽 = 全向平移；中键拖拽恒为平移",
  "hive.editToggle": "蜂巢编辑",
  "hive.editToggle.tooltip": "开启后：先点选一个蜂巢，再拖动它搬巢；关闭时拖巢无动作（相机手势已集中到右键）",
  "hive.legend": "图例",
  "hive.state.idle": "待命",
  "hive.state.busy": "忙碌",
  "hive.state.help": "等待你",
  "hive.state.done": "带蜜归",
  "hive.pin": "钉住卡片",
  "hive.shrink": "收起卡片",
  "hive.collapse": "折叠无人机",
  "hive.openSession": "打开会话",
  "hive.archive": "归档",
  "hive.archivedTag": "已归档 · 储蜜只读",
  "hive.todos": "todo {done}/{total}",
  "hive.runningCount": "运行中 {n}",
  "hive.activeCount": "活跃 {n}",
  "hive.time.now": "刚刚",
  "hive.time.min": "{n} 分钟前",
  "hive.time.hour": "{n} 小时前",
  "hive.time.day": "{n} 天前",
  "hive.menu.newSession": "新会话",
  "hive.menu.openDir": "在系统中打开目录",
  "hive.menu.archive": "归档蜜蜂",
  "hive.toast.newSession": "已在新巢开会",
  "hive.toast.archived": "蜜蜂已化蜜归仓",
  "hive.toast.openDir": "已在系统中打开目录",
  "hive.toast.moveSaved": "蜂巢已搬移",
  "hive.toast.moveConflict": "布局被其它页签修改，已合并重放",
  "hive.toast.moveInvalid": "落点会与邻巢叠加，已取消",
  "hive.toast.adoptUnavailable": "该会话钉在自己的巢里（cwd 决定归属），无法换巢",
  "hive.toast.adoptSelf": "已重排到巢首",
  "hive.toast.fail": "操作失败",
  "hive.fallback.title": "3D 蜂巢不可用",
  "hive.fallback.body": "3D 场景不可用或已在设置中选择 2D 降级。可改用侧边栏会话列表，或在设置中切回 WebGL。",
  "hive.fallback.retry": "重试 WebGL",
  "hive.settings.anim": "动态效果",
  "hive.settings.animHint": "跟随系统 = 系统开启「减少动态」时停持续动画；强制开启 = 忽略系统设置，当前页始终播放",
  "hive.settings.renderer": "渲染",
  "hive.settings.rendererHint": "强制 2D 降级时不启动 3D 场景，仅呈现静态降级卡",
  "hive.settings.rendererWebgl": "WebGL（失败自动降级）",
  "hive.settings.renderer2d": "2D 降级（无 3D 场景）",
  "hive.settings.showFps": "FPS 计数",
  "hive.settings.showFpsHint": "画布左上角帧率读数（调试用）",
  "hive.settings.cameraPitch": "相机俯角",
  "hive.settings.cameraPitchHint": "俯仰锁定为该值：旋转/平移/缩放/聚焦都不改变俯仰；默认 45°，范围 15°–70°",
  "hive.settings.drones": "无人机",
  "hive.drones.activeOnly": "仅活跃",
  "hive.drones.all": "全部显示",
  "hive.settings.watermark": "底图水印",
  "hive.settings.hotkey": "快捷键",
  "hive.settings.follow": "镜头跟随当前会话",
  "hive.settings.followHint": "切换会话与打开蜂巢页时镜头自动平移定位到对应蜜蜂（默认开）",
  "hive.settings.title": "设置",
  "hive.settings.close": "关闭",
  /* 模态共享词条（蜂群编辑沿用；旧快捷指令专属词条已随拆除移除） */
  "hive.qc.moveUp": "上移",
  "hive.qc.moveDown": "下移",
  "hive.qc.save": "保存",
  "hive.qc.saving": "保存中…",
  "hive.qc.saveFailed": "保存失败，请重试",
  "hive.qc.confirmDiscard": "有未保存的修改，放弃并关闭？",
  "hive.qc.discard": "放弃修改",
  "hive.qc.keepEditing": "继续编辑",
  /* 设置左纵排（context-hotbar-rework 4.x） */
  "hive.settings.navScene": "场景",
  "hive.settings.navAppearance": "外观",
  "hive.settings.navLayout": "布局",
  "hive.settings.layoutPanelGroup": "覆盖面板（右侧蜂群阵列）",
  "hive.settings.layoutPanelM": "列数 m",
  "hive.settings.layoutPanelN": "行数 n",
  "hive.settings.layoutBarGroup": "道具栏（底部阵列）",
  "hive.settings.layoutBarM": "列数 m",
  "hive.settings.layoutBarN": "行数 n",
  "hive.settings.reportGroup": "作战报告（左下角面板）",
  "hive.settings.reportRows": "可视行数",
  "hive.settings.reportRowsHint": "面板锚定左下角；列表按行数定高，超出滚动",
  "hive.settings.layoutHint": "调整即时生效，仅保存在本页签",
  "hive.settings.resetAll": "恢复默认",
  /* 指令编辑（context-hotbar-rework 5.x） */
  "hive.hb.title": "指令编辑",
  "hive.hb.close": "关闭指令编辑",
  "hive.hb.tabHive": "巢栏",
  "hive.hb.tabBee": "蜂栏",
  "hive.hb.tabFloor": "地板栏",
  "hive.hb.add": "新增槽位",
  "hive.hb.empty": "还没有槽位——点击「新增槽位」创建。",
  "hive.hb.namePlaceholder": "名称（如：召唤设计蜂）",
  "hive.hb.delete": "删除",
  "hive.hb.summon": "召唤新蜂",
  "hive.hb.summonHint": "勾选后点击卡片召唤新蜂；不勾选则卡片为禁用态（预留后续巢级动作）",
  "hive.hb.createBee": "建巢后创建新蜂",
  "hive.hb.createBeeHint": "取消勾选 = 纯建巢（空巢落地，不建蜂）",
  "hive.hb.beeType": "新蜂种",
  "hive.hb.beeTypeDefault": "机械蜂",
  "hive.hb.prompt": "预设提示词",
  "hive.hb.promptRequired": "必填",
  "hive.hb.promptPlaceholder": "提示词（发给新蜂或当前会话）",
  "hive.hb.autoSend": "自动发送",
  "hive.hb.autoSendHint": "勾选后点击卡片直接发送；不勾选则填入输入框供审查回车",
  "hive.hb.pureSummonHint": "提示词留空 = 纯召唤（只建蜂不发消息）",
  "hive.hb.summonOffHint": "召唤关闭：提示词不接受，卡片在道具栏为禁用态",
  "hive.hb.overflow": "超出阵列容量 {n} 个槽位——保存允许，但超出部分不在道具栏渲染",
  "hive.hb.dirty": "有未保存的修改",
  "hive.hb.saveStale": "保存未被宿主持久化（宿主半区可能是旧版本）——请重启 dsh 后重试",
  "hive.hb.err.invalidName": "名称不能为空",
  "hive.hb.err.duplicateName": "槽位名称重复",
  "hive.hb.err.missingPrompt": "蜂栏提示词不能为空白",
  "hive.hb.err.promptBlocked": "召唤/建蜂关闭时提示词不接受",
  "hive.hb.err.tooManySlots": "槽位数量超出上限 32",
  /* 状态卡片（bee-status-cards）：完成状态栏 + 状态卡功能 */
  "hive.status.aria": "完成状态栏",
  "hive.status.cardTitle": "{name}：当前带蜜归蜂数 {count}",
  "hive.status.default": "机械蜂",
  "hive.status.send": "批量发送",
  "hive.status.sendEmpty": "暂无完成蜂",
  "hive.status.confirmTitle": "批量发送确认",
  "hive.status.confirmPrompt": "预设提示词",
  "hive.status.confirmTargets": "目标蜂数",
  "hive.status.confirmHint": "将把预设提示词逐蜂发送给卡内全部完成蜂",
  "hive.status.confirm": "确认发送",
  "hive.status.cancel": "取消",
  "hive.status.toastSent": "已发 {n} 只，{m} 只失败",
  "hive.status.toastNone": "无目标完成蜂",
  "hive.hb.tabStatus": "状态卡片",
  "hive.hb.status.defaultRow": "机械蜂不可设置状态卡功能",
  "hive.hb.status.promptPlaceholder": "预设提示词（发给该蜂种全部完成蜂）",
  "hive.hb.status.autoSendHint": "勾选后点击卡片直接批量发送；不勾选则先弹人工确认",
  "hive.hb.status.clear": "清除配置",
  "hive.hb.status.cleared": "已清除配置",
  "hive.hb.status.empty": "选择蜂种以配置状态卡功能。",
  "hive.hb.status.err.missingType": "缺少蜂种 id",
  "hive.hb.status.err.invalidPrompt": "提示词须为字符串",
  "hive.settings.batchSendConfirm": "批量发送人工确认",
  "hive.settings.batchSendConfirmHint": "关闭后，未勾选自动发送的状态卡点击即直发（不再弹确认）",
  /* 情境道具栏（context-hotbar-rework 6.x） */
  "hive.bar.aria.hive": "巢栏道具栏",
  "hive.bar.aria.bee": "蜂栏道具栏",
  "hive.bar.aria.floor": "地板栏道具栏",
  "hive.bar.pureSummon": "纯召唤",
  "hive.bar.summonOff": "召唤已关闭",
  "hive.bar.floorHint": "选定目录建巢",
  "hive.bar.toastSummoned": "已召唤新蜂",
  "hive.bar.toastSummonFailed": "召唤失败",
  "hive.bar.toastMissingBee": "蜂种缺失，召唤被拒",
  "hive.bar.toastFloorCreated": "已建巢",
  "hive.bar.toastFloorCreateFailed": "建巢失败",
  "hive.bar.toastFloorPickFailed": "目录选择器不可用",
  "hive.bar.toastFloorSummonFailed": "建巢成功，但召唤失败（空巢已保留）",
  "hive.bar.toastSummonAppendFailed": "召唤成功，但提示词未能填入输入框（会话已打开，可手动粘贴）",
  /* 内置默认动作卡（hotbar-default-actions 2.1，design D5；卡组用户定稿调整） */
  "hive.bar.defaults.beeContinue": "继续",
  "hive.bar.defaults.beeContinuePrompt": "继续",
  "hive.bar.defaults.beeArchive": "归档会话",
  "hive.bar.defaults.beeArchiveTitle": "归档当前会话（蜜蜂化蜜入库，不可恢复）",
  "hive.bar.defaults.beeOpen": "打开会话",
  "hive.bar.defaults.beeOpenTitle": "收起蜂巢页，打开当前会话",
  "hive.bar.defaults.floorNest": "建巢",
  "hive.bar.defaults.badge": "内置",
  "hive.bar.defaults.hint": "添加自定义槽位后本栏默认卡收起",
  "hive.bar.defaults.hintResident": "蜂栏内置卡常驻显示，不随自定义槽位收回",
  /* 工蜂阵列面板（context-hotbar-rework 7.x） */
  "hive.panel.empty": "空巢——还没有工蜂",
  "hive.panel.drones": "无人机：活跃 {a} / 总数 {n}",
  "hive.panel.selected": "已选 {n} 只",
  /* 蜂群编辑（custom-bee-types 4.x） */
  "hive.swarm.title": "蜂群编辑",
  "hive.swarm.close": "关闭蜂群编辑",
  "hive.swarm.tabTypes": "蜂种列表",
  "hive.swarm.tabCaps": "能力编辑器",
  "hive.swarm.add": "新增蜂种",
  "hive.swarm.empty": "还没有自定义蜂种——机械蜂之外，点击「新增蜂种」创建第一只。",
  "hive.swarm.namePlaceholder": "蜂种名（如：设计蜂）",
  "hive.swarm.descPlaceholder": "描述（可选）",
  "hive.swarm.presetPromptPlaceholder": "预设提示词（可选，工具召唤首条消息 = payload + 本字段）",
  "hive.swarm.presetPromptHint": "B 侧行为定义：召唤该蜂种时附加的行为指引（数据走调用方的 payload）",
  "hive.swarm.queuePolicy": "排队策略",
  "hive.swarm.queueFree": "自由（不占道）",
  "hive.swarm.queueSerialized": "排队（同巢自动动作互斥）",
  "hive.swarm.model": "对话模型（可选）",
  "hive.swarm.beeModel": "外观模型",
  "hive.beeModel.worker": "默认工蜂",
  "hive.beeModel.purple_worker": "紫工蜂",
  "hive.beeModel.pink_worker": "粉工蜂",
  "hive.beeModel.blue_worker": "蓝峰",
  "hive.swarm.modelNone": "使用默认模型",
  "hive.swarm.modelLoading": "模型目录加载中…",
  "hive.swarm.modelUnavailable": "暂无活会话可取模型目录",
  "hive.swarm.capsFor": "能力（{name}）",
  "hive.swarm.capAdd": "新增能力",
  "hive.swarm.capEmpty": "该蜂种还没有能力。",
  "hive.swarm.capNamePlaceholder": "能力名（如：交接）",
  "hive.swarm.capture": "捕获变量（变量名=handoff JSON 键路径，如 A=proposal）",
  "hive.swarm.capturePlaceholder": "A=proposal",
  "hive.swarm.filePredicate": "文件谓词（相对路径模板，可选，仅存在性检查）",
  "hive.swarm.filePredicatePlaceholder": "openspec/changes/{A}/tasks.md",
  "hive.swarm.actionType": "动作",
  "hive.swarm.actionSend": "自动回复",
  "hive.swarm.actionSpawn": "召唤新蜂",
  "hive.swarm.actionNotify": "调整姿态",
  "hive.swarm.actionConductor": "编排者（本期未实现）",
  "hive.swarm.target": "目标蜂种",
  "hive.swarm.promptTemplate": "提示词模板（{变量} 插值）",
  "hive.swarm.promptPlaceholder": "请用 /opsx:new 创建提案 {A}",
  "hive.swarm.once": "同值闩锁（同捕获值只触发一次）",
  "hive.swarm.onceLabel": "仅触发一次",
  "hive.swarm.insertVar": "插入 {v}",
  "hive.swarm.deleteType": "删除蜂种（其蜜蜂自动回落机械蜂）",
  "hive.swarm.deleteCap": "删除能力",
  "hive.swarm.dirty": "有未保存的蜂种修改",
  "hive.swarm.saved": "蜂群已保存",
  "hive.swarm.hostStale": "保存未被宿主持久化（宿主半区可能是旧版本）——请重启 dsh 后重试",
  "hive.bee.err.duplicateId": "蜂种 id 重复",
  "hive.bee.err.reservedId": "不能使用保留字 default",
  "hive.bee.err.missingName": "蜂种名称不能为空",
  "hive.bee.err.missingId": "缺少蜂种 id",
  "hive.bee.err.invalidId": "蜂种 id 形状非法（字母数字-_）",
  "hive.bee.err.invalidModel": "模型形状非法（需 provider + model）",
  "hive.bee.err.invalidQueuePolicy": "排队策略非法",
  "hive.bee.err.invalidActionType": "动作类型非法",
  "hive.bee.err.missingTemplate": "send/spawn 动作必须填提示词模板",
  "hive.bee.err.invalidTemplate": "模板语法非法（{变量} 未闭合或变量名非法）",
  "hive.bee.err.missingTarget": "孵化动作必须选择目标蜂种",
  "hive.bee.err.invalidTarget": "目标蜂种非法",
  "hive.bee.err.invalidCaptureVar": "捕获变量名非法",
  "hive.bee.err.invalidCapturePath": "捕获键路径非法（点分段，如 proposal 或 a.b）",
  "hive.bee.err.invalidPredicate": "文件谓词须为相对路径（禁绝对路径/上跳）",
  "hive.bee.err.invalidOnce": "闩锁开关须为布尔",
  "hive.bee.err.presetPromptTooLong": "预设提示词超出长度上限 4000",
  "hive.bee.err.invalidPresetPrompt": "预设提示词须为非空字符串",
  "hive.bee.err.tooManyBeeTypes": "蜂种数量超出上限 16",
  "hive.bee.err.tooManyCapabilities": "能力数量超出上限 16",
  "hive.bee.err.tooManyCaptureVars": "捕获变量过多（上限 8）",
  "hive.bee.err.invalidShape": "配置结构非法",
  "hive.bee.serialized": "排队蜂",
  "hive.bee.free": "自由蜂",
  "hive.card.beeChanged": "蜂种已更换（当次回合不追溯，下一回合起生效）",
  "hive.card.beeCleared": "已清除绑定，回到机械蜂",
  "hive.card.hatchSent": "孵化已执行",
  "hive.card.hatchDegraded": "野蜂无巢，已降级为本会话续发",
  "hive.card.hatchFailed": "孵化失败",
  "hive.card.hatchMissing": "缺少已捕获变量，无法孵化",
  "hive.card.laneCanceled": "已取消车道等待",
  "hive.card.latchReset": "闩锁已重置（同值可重新触发）",
  "hive.hatch": "孵化{name}",
  "hive.lane.cancel": "取消等待",
  "hive.lane.ahead": "前方 {n} 项",
  "hive.lane.holding": "占道中",
  "hive.latch.reset": "重置闩锁",
  "hive.wait.marker": "等待标记",
  "hive.wait.predicate": "等待文件谓词",
  "hive.wait.latch": "闩锁生效",
  "hive.wait.watermark": "已处理",
  "hive.menu.changeBeeType": "更换蜂种",
  "hive.menu.beeDefault": "机械蜂",
  "hive.float.collapse": "收起会话浮窗（Esc）",
  "hive.appearance.groupWall": "巢墙",
  /* 画布 chrome 配色方案（hive-interaction-polish 追加） */
  "hive.appearance.chromeGroup": "窗口配色",
  "hive.appearance.chrome": "配色方案",
  "hive.appearance.chromeHint": "画布上浮层卡片/面板（道具栏、蜂群面板、状态卡、概要条、tips、菜单、toast）的底图配色；模态与输入件仍随应用主题",
  "hive.appearance.chromeDefault": "官方令牌（随应用主题）",
  "hive.appearance.chromeAmber": "琥珀金",
  "hive.appearance.chromeIndigo": "靛夜霓虹",
  "hive.appearance.chromeCyan": "萤尘青",
  "hive.appearance.chromeMagenta": "玫瑰霓虹",
  "hive.appearance.chromeFrost": "霜白玻璃",
  "hive.appearance.groupFloor": "地面",
  "hive.appearance.groupPad": "巢内地砖",
  "hive.appearance.groupAccent": "点缀",
  "hive.appearance.groupSky": "天穹",
  "hive.appearance.wallOuter": "外围墙可见度",
  "hive.appearance.wallOuterHint": "巢簇外框墙的实体感（100% = 实色）",
  "hive.appearance.wallInner": "内隔墙可见度",
  "hive.appearance.wallInnerHint": "巢内六面体房间的隔断（越低越透）",
  "hive.appearance.innerTrim": "内墙轮廓边条透明度",
  "hive.appearance.innerTrimHint": "内隔墙顶缘的金色边条（0 = 隐藏）",
  "hive.appearance.trimGlow": "顶缘饰条亮度",
  "hive.appearance.trimGlowHint": "发光倍数；高于阈值时经 Bloom 呈现辉光",
  "hive.appearance.wallGold": "墙体金色",
  "hive.appearance.trimColor": "饰条金色",
  "hive.appearance.floorBase": "基板底色",
  "hive.appearance.floorLine": "蜂窝线色",
  "hive.appearance.padBase": "砖底金色",
  "hive.appearance.padInner": "内圈金色",
  "hive.appearance.outline": "选中描边色",
  "hive.appearance.amber": "蜜杯琥珀",
  "hive.appearance.mote": "数据萤尘",
  "hive.appearance.skyTop": "穹顶深靛",
  "hive.appearance.horizon": "地平线辉光",
  "hive.anim.full": "跟随系统",
  "hive.anim.force": "强制开启",
  "hive.anim.reduced": "关闭",
  "hive.hotkey.alt": "Alt + H",
  "hive.hotkey.ctrl": "Ctrl + Alt + H",
  "hive.hotkey.off": "关闭",
  "hive.legend.idle": "待命",
  "hive.legend.busy": "忙碌",
  "hive.legend.help": "求助",
  "hive.legend.done": "带蜜归",
  "hive.legend.honey": "蜂蜜（归档）",
  /* 键盘手势（hive-interaction-polish 8.1）：图例提示项 */
  "hive.legend.keysZC": "按住 Z/C 旋转镜头",
  "hive.legend.keysE": "按 E 直达当前会话",
  /* 顶部会话概要条（session-brief-bar 5.2）：标题 / 任务 / 报告 三行栈式布局 */
  "hive.brief.aria": "当前会话概要（只读预览：任务与报告）",
  "hive.brief.task": "任务",
  "hive.brief.report": "报告",
  /* 悬停 tips（bee-hover-tips 6.3）：六字段键名与降级口径 */
  "hive.tips.drone": "无人机",
  "hive.tips.defaultBee": "机械蜂",
  "hive.tips.status": "状态",
  "hive.tips.workspace": "所属工作区",
  "hive.tips.sessions": "巢内会话",
  "hive.tips.tokens": "token 消耗",
  "hive.tips.dps": "平均 DPS",
  "hive.tips.avg": "平均",
  /* 作战报告（hive-combat-log）：左下角可收起文字面板（D8） */
  "hive.report.title": "作战报告",
  "hive.report.collapse": "收起作战报告",
  "hive.report.expand": "展开作战报告（未读 {n}）",
  "hive.report.clear": "清空作战报告",
  "hive.report.empty": "暂无作战记录——蜂群活动会在这里实时滚动。",
  "hive.report.filterLow": "显示低优先级",
  "hive.report.filterLowOn": "隐藏低优先级",
  "hive.report.enterWorker": "召唤了工蜂 {name}",
  "hive.report.start": "{name} 开始执行任务",
  "hive.report.done": "{name} 完成了任务",
  "hive.report.help": "{name} 发出求助",
  "hive.report.dronesNew": "召唤了 {n} 个无人机",
  "hive.report.dronesDone": "{n} 个无人机完工",
  "hive.report.archive": "会话已归档化蜜",
  "hive.report.newNest": "新巢建立：{title}",
  "hive.report.nestMove": "巢已搬移：{title}",
  "hive.report.wildBee": "野蜂出现：{name}"
};

const en = {
  "hive.title": "Hive Command Center",
  "hive.seat": "Hive",
  "hive.seat.aria": "Open the Hive Command Center",
  "hive.fullscreen": "Fullscreen patrol",
  "hive.exitFullscreen": "Exit fullscreen (Esc)",
  "hive.spinToggle": "Right-drag orbit",
  "hive.spinToggle.tooltip": "When on: right-drag orbits (azimuth only; pitch stays at the configured value). When off (default): right-drag pans. Middle-drag always pans",
  "hive.editToggle": "Hive edit",
  "hive.editToggle.tooltip": "When on: click a studio to select it, then drag to move. When off: dragging a studio does nothing (camera gestures moved to the right button)",
  "hive.legend": "Legend",
  "hive.state.idle": "Idle",
  "hive.state.busy": "Running",
  "hive.state.help": "Needs you",
  "hive.state.done": "Done",
  "hive.pin": "Pin card",
  "hive.shrink": "Shrink card",
  "hive.collapse": "Fold drones",
  "hive.openSession": "Open session",
  "hive.archive": "Archive",
  "hive.archivedTag": "Archived · honey is read-only",
  "hive.todos": "todos {done}/{total}",
  "hive.runningCount": "{n} running",
  "hive.activeCount": "{n} active",
  "hive.time.now": "just now",
  "hive.time.min": "{n}m ago",
  "hive.time.hour": "{n}h ago",
  "hive.time.day": "{n}d ago",
  "hive.menu.newSession": "New session",
  "hive.menu.openDir": "Open directory in system",
  "hive.menu.archive": "Archive bee",
  "hive.toast.newSession": "New session started",
  "hive.toast.archived": "Bee became honey",
  "hive.toast.openDir": "Opened in system",
  "hive.toast.moveSaved": "Studio moved",
  "hive.toast.moveConflict": "Layout changed in another tab; merged and replayed",
  "hive.toast.moveInvalid": "Drop would overlap a neighbor studio; cancelled",
  "hive.toast.adoptUnavailable": "This session is pinned to its own studio (cwd-decided); move unavailable",
  "hive.toast.adoptSelf": "Reordered to the front of its studio",
  "hive.toast.fail": "Action failed",
  "hive.fallback.title": "3D hive unavailable",
  "hive.fallback.body": "The 3D scene is unavailable or 2D fallback is selected in settings. Use the sidebar session list, or switch back to WebGL in settings.",
  "hive.fallback.retry": "Retry WebGL",
  "hive.settings.anim": "Animation",
  "hive.settings.animHint": "Follow system = stop continuous animation when the OS requests reduced motion; Always on = ignore the OS setting on this page",
  "hive.settings.renderer": "Renderer",
  "hive.settings.rendererHint": "2D fallback shows a static card and skips the 3D scene",
  "hive.settings.rendererWebgl": "WebGL (auto-fallback)",
  "hive.settings.renderer2d": "2D fallback (no 3D)",
  "hive.settings.showFps": "FPS counter",
  "hive.settings.showFpsHint": "Frame-rate readout at the canvas top-left (debug)",
  "hive.settings.cameraPitch": "Camera pitch",
  "hive.settings.cameraPitchHint": "Pitch locks to this value: orbit, pan, zoom and focus never change it. Default 45°, range 15°–70°",
  "hive.settings.drones": "Drones",
  "hive.drones.activeOnly": "Active only",
  "hive.drones.all": "Show all",
  "hive.settings.watermark": "Floor watermark",
  "hive.settings.hotkey": "Hotkey",
  "hive.settings.follow": "Camera follows current session",
  "hive.settings.followHint": "Gently pan the camera to the matching bee on session switch and page open (on by default)",
  "hive.settings.title": "Settings",
  "hive.settings.close": "Close",
  /* Shared modal vocabulary (reused by the bee swarm editor) */
  "hive.qc.moveUp": "Move up",
  "hive.qc.moveDown": "Move down",
  "hive.qc.save": "Save",
  "hive.qc.saving": "Saving…",
  "hive.qc.saveFailed": "Save failed, please retry",
  "hive.qc.confirmDiscard": "You have unsaved changes. Discard and close?",
  "hive.qc.discard": "Discard",
  "hive.qc.keepEditing": "Keep editing",
  /* Settings nav rail (context-hotbar-rework 4.x) */
  "hive.settings.navScene": "Scene",
  "hive.settings.navAppearance": "Appearance",
  "hive.settings.navLayout": "Layout",
  "hive.settings.layoutPanelGroup": "Overlay panel (worker grid, right)",
  "hive.settings.layoutPanelM": "Columns m",
  "hive.settings.layoutPanelN": "Rows n",
  "hive.settings.layoutBarGroup": "Hotbar (bottom grid)",
  "hive.settings.layoutBarM": "Columns m",
  "hive.settings.layoutBarN": "Rows n",
  "hive.settings.reportGroup": "Combat report (bottom-left panel)",
  "hive.settings.reportRows": "Visible rows",
  "hive.settings.reportRowsHint": "Panel is anchored bottom-left; the list height follows the row count and scrolls beyond it",
  "hive.settings.layoutHint": "Applies instantly; stored per tab only",
  "hive.settings.resetAll": "Reset to defaults",
  /* Command editor (context-hotbar-rework 5.x) */
  "hive.hb.title": "Command editor",
  "hive.hb.close": "Close the command editor",
  "hive.hb.tabHive": "Hive bar",
  "hive.hb.tabBee": "Bee bar",
  "hive.hb.tabFloor": "Floor bar",
  "hive.hb.add": "Add slot",
  "hive.hb.empty": "No slots yet — add one to get started.",
  "hive.hb.namePlaceholder": "Name (e.g. Summon designer)",
  "hive.hb.delete": "Delete",
  "hive.hb.summon": "Summon a new bee",
  "hive.hb.summonHint": "Checked = clicking the card summons a new bee; unchecked = the card renders disabled (reserved)",
  "hive.hb.createBee": "Create a bee after nesting",
  "hive.hb.createBeeHint": "Unchecked = nest only (an empty studio, no bee)",
  "hive.hb.beeType": "Bee type",
  "hive.hb.beeTypeDefault": "Mechanical bee",
  "hive.hb.prompt": "Preset prompt",
  "hive.hb.promptRequired": "required",
  "hive.hb.promptPlaceholder": "Prompt (sent to the new bee or the current session)",
  "hive.hb.autoSend": "Auto send",
  "hive.hb.autoSendHint": "Checked = a click sends directly; unchecked = fills the composer for review",
  "hive.hb.pureSummonHint": "Empty prompt = summon only (no message sent)",
  "hive.hb.summonOffHint": "Summon off: prompt not accepted; the card renders disabled in the hotbar",
  "hive.hb.overflow": "{n} slots exceed the grid — saved, but the overflow is not rendered in the hotbar",
  "hive.hb.dirty": "Unsaved changes",
  "hive.hb.saveStale": "Save was not persisted by the host (host half may be outdated) — restart dsh and retry",
  "hive.hb.err.invalidName": "Name cannot be empty",
  "hive.hb.err.duplicateName": "Duplicate slot name",
  "hive.hb.err.missingPrompt": "Bee-bar prompt cannot be blank",
  "hive.hb.err.promptBlocked": "Prompt is not accepted while summon/create-bee is off",
  "hive.hb.err.tooManySlots": "Too many slots (limit 32)",
  /* Status cards (bee-status-cards): completion status bar + status card action */
  "hive.status.aria": "Completion status bar",
  "hive.status.cardTitle": "{name}: {count} bee(s) carrying honey now",
  "hive.status.default": "Mechanical bee",
  "hive.status.send": "Batch send",
  "hive.status.sendEmpty": "No completed bees",
  "hive.status.confirmTitle": "Confirm batch send",
  "hive.status.confirmPrompt": "Preset prompt",
  "hive.status.confirmTargets": "Target bees",
  "hive.status.confirmHint": "The preset prompt will be sent to every completed bee on this card, one by one",
  "hive.status.confirm": "Send",
  "hive.status.cancel": "Cancel",
  "hive.status.toastSent": "Sent {n}, {m} failed",
  "hive.status.toastNone": "No completed bees to send to",
  "hive.hb.tabStatus": "Status cards",
  "hive.hb.status.defaultRow": "The mechanical bee cannot have a status card action",
  "hive.hb.status.promptPlaceholder": "Preset prompt (sent to every completed bee of this type)",
  "hive.hb.status.autoSendHint": "Checked = a click batch-sends directly; unchecked = confirm first",
  "hive.hb.status.clear": "Clear config",
  "hive.hb.status.cleared": "Config cleared",
  "hive.hb.status.empty": "Select a bee type to configure its status card action.",
  "hive.hb.status.err.missingType": "Missing bee type id",
  "hive.hb.status.err.invalidPrompt": "Prompt must be a string",
  "hive.settings.batchSendConfirm": "Batch-send confirmation",
  "hive.settings.batchSendConfirmHint": "When off, cards without auto-send send directly on click (no confirmation)",
  /* Contextual hotbar (context-hotbar-rework 6.x) */
  "hive.bar.aria.hive": "Hive hotbar",
  "hive.bar.aria.bee": "Bee hotbar",
  "hive.bar.aria.floor": "Floor hotbar",
  "hive.bar.pureSummon": "Summon only",
  "hive.bar.summonOff": "Summon off",
  "hive.bar.floorHint": "Pick a directory to nest",
  "hive.bar.toastSummoned": "New bee summoned",
  "hive.bar.toastSummonFailed": "Summon failed",
  "hive.bar.toastMissingBee": "Bee type missing; summon refused",
  "hive.bar.toastFloorCreated": "Studio registered",
  "hive.bar.toastFloorCreateFailed": "Studio creation failed",
  "hive.bar.toastFloorPickFailed": "Directory picker unavailable",
  "hive.bar.toastFloorSummonFailed": "Studio created, but summon failed (empty studio kept)",
  "hive.bar.toastSummonAppendFailed": "Bee summoned, but the prompt could not be filled into the composer (session opened; paste it manually)",
  /* Built-in default action cards (hotbar-default-actions 2.1, design D5; user-tuned set) */
  "hive.bar.defaults.beeContinue": "Continue",
  "hive.bar.defaults.beeContinuePrompt": "Continue",
  "hive.bar.defaults.beeArchive": "Archive session",
  "hive.bar.defaults.beeArchiveTitle": "Archive the current session (bee becomes honey; cannot be undone)",
  "hive.bar.defaults.beeOpen": "Open session",
  "hive.bar.defaults.beeOpenTitle": "Close the hive page and open the current session",
  "hive.bar.defaults.floorNest": "Nest",
  "hive.bar.defaults.badge": "Built-in",
  "hive.bar.defaults.hint": "Defaults collapse once this column has a custom slot",
  "hive.bar.defaults.hintResident": "Bee-column built-ins always show; custom slots don't collapse them",
  /* Worker panel (context-hotbar-rework 7.x) */
  "hive.panel.empty": "Empty studio — no workers yet",
  "hive.panel.drones": "Drones: {a} active / {n} total",
  "hive.panel.selected": "{n} selected",
  "hive.swarm.title": "Bee swarm editor",
  "hive.swarm.close": "Close the bee swarm editor",
  "hive.swarm.tabTypes": "Bee types",
  "hive.swarm.tabCaps": "Capabilities",
  "hive.swarm.add": "Add bee type",
  "hive.swarm.empty": "No custom bee types yet — add the first one besides the mechanical bee.",
  "hive.swarm.namePlaceholder": "Bee type name (e.g. Designer)",
  "hive.swarm.descPlaceholder": "Description (optional)",
  "hive.swarm.presetPromptPlaceholder": "Preset prompt (optional; summon first message = payload + this field)",
  "hive.swarm.presetPromptHint": "B-side behavior: guidance appended when this bee type is summoned (task data goes in the caller's payload)",
  "hive.swarm.queuePolicy": "Queue policy",
  "hive.swarm.queueFree": "Free (never queues)",
  "hive.swarm.queueSerialized": "Serialized (auto actions queue per studio)",
  "hive.swarm.model": "Chat model (optional)",
  "hive.swarm.beeModel": "Bee model",
  "hive.beeModel.worker": "Default worker",
  "hive.beeModel.purple_worker": "Purple worker",
  "hive.beeModel.pink_worker": "Pink worker",
  "hive.beeModel.blue_worker": "Lanfeng",
  "hive.swarm.modelNone": "Use default model",
  "hive.swarm.modelLoading": "Loading model catalog…",
  "hive.swarm.modelUnavailable": "No live session to read the model catalog from",
  "hive.swarm.capsFor": "Capabilities ({name})",
  "hive.swarm.capAdd": "Add capability",
  "hive.swarm.capEmpty": "This bee type has no capabilities yet.",
  "hive.swarm.capNamePlaceholder": "Capability name (e.g. Handoff)",
  "hive.swarm.capture": "Capture vars (name=handoff JSON key path, e.g. A=proposal)",
  "hive.swarm.capturePlaceholder": "A=proposal",
  "hive.swarm.filePredicate": "File predicate (relative path template, optional, existence-only)",
  "hive.swarm.filePredicatePlaceholder": "openspec/changes/{A}/tasks.md",
  "hive.swarm.actionType": "Action",
  "hive.swarm.actionSend": "Auto reply",
  "hive.swarm.actionSpawn": "Summon a new bee",
  "hive.swarm.actionNotify": "Adjust posture",
  "hive.swarm.actionConductor": "Conductor (not implemented yet)",
  "hive.swarm.target": "Target bee type",
  "hive.swarm.promptTemplate": "Prompt template ({var} interpolation)",
  "hive.swarm.promptPlaceholder": "Use /opsx:new to create proposal {A}",
  "hive.swarm.once": "Value latch (fire once per captured value)",
  "hive.swarm.onceLabel": "Fire only once",
  "hive.swarm.insertVar": "Insert {v}",
  "hive.swarm.deleteType": "Delete bee type (its bees fall back to the mechanical bee)",
  "hive.swarm.deleteCap": "Delete capability",
  "hive.swarm.dirty": "Unsaved bee swarm changes",
  "hive.swarm.saved": "Bee swarm saved",
  "hive.swarm.hostStale": "Save was not persisted by the host (host half may be outdated) — restart dsh and retry",
  "hive.bee.err.duplicateId": "Duplicate bee type id",
  "hive.bee.err.reservedId": "Reserved word default cannot be used",
  "hive.bee.err.missingName": "Bee type name cannot be empty",
  "hive.bee.err.missingId": "Missing bee type id",
  "hive.bee.err.invalidId": "Bee type id shape is invalid (letters/digits/-/_)",
  "hive.bee.err.invalidModel": "Model shape is invalid (provider + model required)",
  "hive.bee.err.invalidQueuePolicy": "Invalid queue policy",
  "hive.bee.err.invalidActionType": "Invalid action type",
  "hive.bee.err.missingTemplate": "send/spawn actions require a prompt template",
  "hive.bee.err.invalidTemplate": "Template syntax invalid ({var} unclosed or bad name)",
  "hive.bee.err.missingTarget": "Hatch actions require a target bee type",
  "hive.bee.err.invalidTarget": "Invalid target bee type",
  "hive.bee.err.invalidCaptureVar": "Invalid capture variable name",
  "hive.bee.err.invalidCapturePath": "Invalid capture key path (dot segments, e.g. proposal or a.b)",
  "hive.bee.err.invalidPredicate": "File predicate must be a relative path (no absolute/..)",
  "hive.bee.err.invalidOnce": "Latch switch must be a boolean",
  "hive.bee.err.presetPromptTooLong": "Preset prompt exceeds the 4000 character limit",
  "hive.bee.err.invalidPresetPrompt": "Preset prompt must be a non-empty string",
  "hive.bee.err.tooManyBeeTypes": "Too many bee types (limit 16)",
  "hive.bee.err.tooManyCapabilities": "Too many capabilities (limit 16)",
  "hive.bee.err.tooManyCaptureVars": "Too many capture vars (limit 8)",
  "hive.bee.err.invalidShape": "Invalid configuration shape",
  "hive.bee.serialized": "Serialized",
  "hive.bee.free": "Free",
  "hive.card.beeChanged": "Bee type changed (no retroactive trigger; effective from the next turn)",
  "hive.card.beeCleared": "Binding cleared; back to the mechanical bee",
  "hive.card.hatchSent": "Hatch executed",
  "hive.card.hatchDegraded": "Wild bee has no studio; degraded to a followup here",
  "hive.card.hatchFailed": "Hatch failed",
  "hive.card.hatchMissing": "Captured variables missing; cannot hatch",
  "hive.card.laneCanceled": "Lane wait cancelled",
  "hive.card.latchReset": "Latch reset (same value can fire again)",
  "hive.hatch": "Hatch {name}",
  "hive.lane.cancel": "Cancel wait",
  "hive.lane.ahead": "{n} ahead",
  "hive.lane.holding": "Holding lane",
  "hive.latch.reset": "Reset latch",
  "hive.wait.marker": "Waiting for marker",
  "hive.wait.predicate": "Waiting for file predicate",
  "hive.wait.latch": "Latched",
  "hive.wait.watermark": "Processed",
  "hive.menu.changeBeeType": "Change bee type",
  "hive.menu.beeDefault": "Mechanical bee",
  "hive.float.collapse": "Collapse session float (Esc)",
  "hive.appearance.groupWall": "Walls",
  /* Canvas chrome color schemes (hive-interaction-polish) */
  "hive.appearance.chromeGroup": "Chrome palette",
  "hive.appearance.chrome": "Color scheme",
  "hive.appearance.chromeHint": "Backgrounds of cards & panels over the 3D canvas (hotbar, swarm panel, status cards, brief bar, tips, menu, toast); modals follow the app theme",
  "hive.appearance.chromeDefault": "Official tokens (follow app theme)",
  "hive.appearance.chromeAmber": "Honey amber",
  "hive.appearance.chromeIndigo": "Indigo neon",
  "hive.appearance.chromeCyan": "Cyan HUD",
  "hive.appearance.chromeMagenta": "Rose neon",
  "hive.appearance.chromeFrost": "Frost glass",
  "hive.appearance.groupFloor": "Floor",
  "hive.appearance.groupPad": "Studio tiles",
  "hive.appearance.groupAccent": "Accents",
  "hive.appearance.groupSky": "Sky dome",
  "hive.appearance.wallOuter": "Outer wall visibility",
  "hive.appearance.wallOuterHint": "Solidity of the studio boundary walls (100% = solid)",
  "hive.appearance.wallInner": "Inner partition visibility",
  "hive.appearance.wallInnerHint": "Hex-room partitions inside a studio (lower = clearer)",
  "hive.appearance.innerTrim": "Inner trim opacity",
  "hive.appearance.innerTrimHint": "Gold edge strip on studio partitions (0 = hidden)",
  "hive.appearance.trimGlow": "Trim glow intensity",
  "hive.appearance.trimGlowHint": "Emissive multiplier; blooms above threshold",
  "hive.appearance.wallGold": "Wall gold",
  "hive.appearance.trimColor": "Trim gold",
  "hive.appearance.floorBase": "Lattice base",
  "hive.appearance.floorLine": "Honeycomb line",
  "hive.appearance.padBase": "Tile gold",
  "hive.appearance.padInner": "Inner gold",
  "hive.appearance.outline": "Selection outline",
  "hive.appearance.amber": "Honey amber",
  "hive.appearance.mote": "Data motes",
  "hive.appearance.skyTop": "Dome indigo",
  "hive.appearance.horizon": "Horizon glow",
  "hive.anim.full": "Follow system",
  "hive.anim.force": "Always on",
  "hive.anim.reduced": "Off",
  "hive.hotkey.alt": "Alt + H",
  "hive.hotkey.ctrl": "Ctrl + Alt + H",
  "hive.hotkey.off": "Off",
  "hive.legend.idle": "Idle",
  "hive.legend.busy": "Running",
  "hive.legend.help": "Needs you",
  "hive.legend.done": "Done",
  "hive.legend.honey": "Honey (archived)",
  /* Keyboard gestures (hive-interaction-polish 8.1): legend hint items */
  "hive.legend.keysZC": "Hold Z/C to orbit the camera",
  "hive.legend.keysE": "Press E to open the current session",
  /* Session brief bar (session-brief-bar 5.2): title / task / report stacked rows */
  "hive.brief.aria": "Current session brief (read-only preview: task & report)",
  "hive.brief.task": "Task",
  "hive.brief.report": "Report",
  /* Hover tips (bee-hover-tips 6.3): field labels and degraded wording */
  "hive.tips.drone": "Drone",
  "hive.tips.defaultBee": "Mechanical bee",
  "hive.tips.status": "Status",
  "hive.tips.workspace": "Workspace",
  "hive.tips.sessions": "Studio sessions",
  "hive.tips.tokens": "Tokens",
  "hive.tips.dps": "Avg DPS",
  "hive.tips.avg": "avg",
  /* Combat report (hive-combat-log): collapsible text panel at the canvas bottom-left (D8) */
  "hive.report.title": "Combat report",
  "hive.report.collapse": "Collapse the combat report",
  "hive.report.expand": "Expand the combat report ({n} unread)",
  "hive.report.clear": "Clear the combat report",
  "hive.report.empty": "No combat log yet — swarm activity will scroll here in real time.",
  "hive.report.filterLow": "Show low-priority",
  "hive.report.filterLowOn": "Hide low-priority",
  "hive.report.enterWorker": "Summoned worker {name}",
  "hive.report.start": "{name} started a task",
  "hive.report.done": "{name} completed a task",
  "hive.report.help": "{name} needs help",
  "hive.report.dronesNew": "Summoned {n} drones",
  "hive.report.dronesDone": "{n} drones finished",
  "hive.report.archive": "Session archived into honey",
  "hive.report.newNest": "New studio: {title}",
  "hive.report.nestMove": "Studio moved: {title}",
  "hive.report.wildBee": "Wild bee appeared: {name}"
};

/* ------------------------------------------------------------------ *
 * 镜像控制器：官方镜像 → 蜂模型 → 场景；布局持久化（D8）
 * ------------------------------------------------------------------ */

function createController(ctx, notify) {
  let scene = null;
  let studioState = new Map();
  let layout = null; // { version, revision, positions, camera }
  let disposed = false;
  let menuHandler = null; // React 右键菜单桥
  let storeBridge = null; // { getSettings }
  const disposers = [];
  let cameraTimer = null;
  let lastCameraJson = "";
  let lastDisplacedSig = "";
  let displacedTimer = null;
  let latestCenters = new Map();
  /* 镜头跟随变化沿哨兵（hive-marquee-and-card-rework 1.4）：仅 current 变化沿触发
     followBee——列表镜像的任意非 current 刷新 SHALL NOT 重触发飞行。开页定位（1.5）
     与订阅哨兵独立，但会同步本哨兵防同值重复触发。 */
  let lastFollowed = null;

  /* 「作战报告」事件源（hive-combat-log D1）：实例挂镜像控制器（插件 fiber 生命周期），
     页关页开基线/缓冲不丢；HMR 重载/页面重载随 fiber 重建清零（可接受）。 */
  const feed = new CombatLogFeed();

  const positionsOf = () => layout?.positions ?? {};

  /* 镜像同步（4.1）：fetchState / SSE 广播 / 写回成功三路都会经过这里。 */
  function syncMirrors(doc) {
    /* 指令编辑域镜像（context-hotbar-rework 6.1 + bee-status-cards D9）：
       hotbars + statusCards 两字段同帧入 store 即归一化（悬空键丢弃）。 */
    hotbarsStore.set(doc);
    /* 蜂种镜像（custom-bee-types 4.1）：同源三路同步 + 场景 overlay 下发 */
    beeTypesStore.set(doc?.beeTypes ?? [], doc?.beeAssignments ?? {});
    pushBeeOverlay();
  }

  /* 引擎状态帧镜像（custom-bee-types 4.1/5.1）：SSE bee-engine 帧 → store → 场景 overlay。 */
  function syncBeeEngine(frame) {
    beeEngineStore.setFrame(frame);
    pushBeeOverlay();
  }

  /** 蜂种增量 overlay 下发场景（布局文档 ∪ 引擎状态帧合并视图）。 */
  function pushBeeOverlay() {
    scene?.setBeeOverlay?.({
      beeTypes: beeTypesStore.beeTypes,
      assignments: beeTypesStore.assignments,
      engineState: layout?.beeEngineState ?? {},
      lane: beeEngineStore.lane,
      sessions: beeEngineStore.sessions
    });
  }

  /* 门控镜像刷新（4.2 + context-hotbar-rework 6.1）：镜像 tick、current 变化、
     场景选中变化三路驱动——工蜂 id 与场景选中槽整值发布（道具栏三态门控、
     覆盖面板呈现/收起共用）。 */
  function refreshSelectedBee() {
    const current = ctx.sessions?.list?.getSnapshot?.()?.current ?? null;
    selectedBeeStore.set(
      workerBeeIdOf(scene?.world ?? null, current, scene?.getSelection?.() ?? null, ctx.sessions?.list?.getSnapshot?.())
    );
    selectionStore.set(scene?.getSelection?.() ?? null);
  }

  async function refreshLayout() {
    try {
      const doc = await fetchState();
      if (disposed || !doc) return;
      layout = doc;
      syncMirrors(doc);
      scene?.setLayout(doc);
      scheduleRebuild();
    } catch {
      /* 宿主端不可达：纯本地默认布局（螺旋落位） */
      if (!layout) layout = { version: 1, revision: 0, positions: {}, camera: null };
      syncMirrors(layout);
      scheduleRebuild();
    }
  }

  /** 布局写回（revision 乐观锁；409 → 重拉后合并本客户端补丁重放一次，D8）。 */
  async function putLayout(patch) {
    if (!layout) return;
    const attempt = async (rev, body) => {
      const result = await putState(rev, body);
      if (result.conflict) return { conflict: true, doc: result.doc };
      if (!result.ok) {
        notify(String(result.error ?? "layout write failed"), "err");
        return { conflict: false };
      }
      layout = result.doc;
      return { conflict: false };
    };
    let outcome = await attempt(layout.revision, patch);
    if (outcome.conflict) {
      layout = outcome.doc ?? layout;
      const merged = { positions: { ...positionsOf(), ...(patch.positions ?? {}) } };
      if (patch.camera !== undefined) merged.camera = patch.camera;
      outcome = await attempt(layout?.revision ?? 0, merged);
      if (outcome.conflict) {
        layout = outcome.doc ?? layout;
        syncMirrors(layout);
        scheduleRebuild();
        notify("conflict-retry", "err");
        return;
      }
      notify("conflict-replay", "ok");
    }
    if (outcome.doc) {
      layout = outcome.doc;
      syncMirrors(layout);
    }
    scheduleRebuild();
  }

  /**
   * 指令编辑保存（context-hotbar-rework 5.3 + bee-status-cards D4）：一次性
   * putState(revision, { hotbars, statusCards }) 同帧写两字段——409 冲突重放一次，
   * host-stale 检测同时比对两字段（宿主半区旧版本 → zod strip 未知键 → 200 但
   * doc 缺字段 → 显式失败）。动作名保留、签名扩容，避免新增平行通道造成两份
   * revision 竞争（D4 定稿）。
   * @returns {Promise<{ok: true, doc: object}|{ok: false, error: string}>}
   */
  async function saveHotbars(nextHotbars, nextStatusCards) {
    if (!layout) return { ok: false, error: "layout not ready" };
    const normalized = normalizeHotbars(nextHotbars);
    const normalizedStatus = normalizeStatusCards(nextStatusCards, layout.beeTypes ?? []);
    const body = { hotbars: normalized };
    if (nextStatusCards !== undefined) body.statusCards = normalizedStatus;
    const stale = (doc) =>
      JSON.stringify(normalizeHotbars(doc?.hotbars ?? {})) !== JSON.stringify(normalized) ||
      JSON.stringify(normalizeStatusCards(doc?.statusCards ?? {}, doc?.beeTypes ?? [])) !== JSON.stringify(normalizedStatus);
    let result = await putState(layout.revision, body);
    if (result.conflict) {
      layout = result.doc ?? layout;
      result = await putState(layout?.revision ?? 0, body);
      if (result.conflict) {
        layout = result.doc ?? layout;
        syncMirrors(layout);
        scheduleRebuild();
        return { ok: false, error: "conflict" };
      }
    }
    if (!result.ok) return { ok: false, error: String(result.error ?? "hotbars save failed") };
    layout = result.doc;
    syncMirrors(layout);
    scheduleRebuild();
    if (stale(layout)) return { ok: false, error: "host-stale" };
    return { ok: true, doc: layout };
  }

  /**
   * 蜂种保存（custom-bee-types 4.2/4.4）：整体数组替换 + 409 冲突重放一次；
   * host-stale 检测同旧 saveCommands 纪律（宿主半区旧版本 → zod strip 未知键 →
   * 200 但 doc 无 beeTypes → 显式失败）。
   * 发送前先 normalizeBeeTypes 规范化：宿主落库前做同款规范化（键序、空字段
   * 丢弃），原文直发会让 stale 检查把「已成功持久化」误判成 host-stale
   * （双侧 normalize 同款纪律）。
   * @returns {Promise<{ok: true, doc: object}|{ok: false, error: string, field?: string, code?: string}>}
   */
  async function saveBeeTypes(nextBeeTypes) {
    if (!layout) return { ok: false, error: "layout not ready" };
    const normalized = normalizeBeeTypes(nextBeeTypes);
    const body = { beeTypes: normalized };
    const stale = (doc) => JSON.stringify(doc?.beeTypes ?? []) !== JSON.stringify(normalized);
    let result = await putState(layout.revision, body);
    if (result.conflict) {
      layout = result.doc ?? layout;
      result = await putState(layout?.revision ?? 0, body);
      if (result.conflict) {
        layout = result.doc ?? layout;
        syncMirrors(layout);
        scheduleRebuild();
        return { ok: false, error: "conflict" };
      }
    }
    if (!result.ok) {
      return { ok: false, error: String(result.error ?? "bee types save failed"), field: result.field, code: result.code };
    }
    layout = result.doc;
    syncMirrors(layout);
    scheduleRebuild();
    if (stale(layout)) return { ok: false, error: "host-stale" };
    return { ok: true, doc: layout };
  }

  /** 更换蜂种（5.4）：绑定整体替换（从镜像取当前 assignments 增删一键）；
   *  能力驱动只从下一次回合闭合开始（宿主语义），UI 提示由调用方 toast。 */
  async function setBeeType(sessionId, typeId) {
    if (!layout) return { ok: false, error: "layout not ready" };
    const assignments = { ...(layout.beeAssignments ?? {}) };
    if (typeId) assignments[sessionId] = typeId;
    else delete assignments[sessionId];
    let result = await putState(layout.revision, { beeAssignments: assignments });
    if (result.conflict) {
      layout = result.doc ?? layout;
      result = await putState(layout?.revision ?? 0, { beeAssignments: assignments });
      if (result.conflict) {
        layout = result.doc ?? layout;
        syncMirrors(layout);
        scheduleRebuild();
        return { ok: false, error: "conflict" };
      }
    }
    if (!result.ok) return { ok: false, error: String(result.error ?? "assignment save failed") };
    layout = result.doc;
    syncMirrors(layout);
    scheduleRebuild();
    return { ok: true, doc: layout };
  }

  /* ── 事件重建 rAF 合帧（hive-render-storm-fix D2）：镜像订阅 / SSE 布局广播 /
     布局回写等全部重建入口收敛到本调度——置脏 + requestAnimationFrame，同一帧内
     到达的多个事件合并为至多一次全量重建（归档级联、召唤风暴等突发事件不再逐事件
     付费）。回调入口复查 disposed（悬挂回调天然无害）；document.hidden 时保持置脏
     直接返回——隐藏期 rAF 本就不触发，恢复可见后该帧回调以最新镜像快照重建一次
     （与 scene.loop 暂停语义一致，SHALL NOT 积压逐事件重放）。例外（保持直连，
     不经本调度）：镜头跟随哨兵订阅（current 边沿触发 followBee/scene.setSelected，
     合帧会丢边沿）；轻量镜像同步 syncMirrors/pushBeeOverlay/syncBeeEngine（整值
     比较防抖，非重建路径）。 ── */
  let rebuildScheduled = false;
  let rebuildFrame = 0;
  function scheduleRebuild() {
    if (rebuildScheduled) return;
    rebuildScheduled = true;
    const flush = () => {
      if (disposed) {
        rebuildScheduled = false;
        return;
      }
      if (document.hidden) return; // 保持置脏：恢复可见后的帧回调以最新快照重建一次
      rebuildScheduled = false;
      rebuild();
    };
    if (typeof requestAnimationFrame === "function") rebuildFrame = requestAnimationFrame(flush);
    else flush(); // 无 rAF 环境（防御，与 appendViaBridge 同款守卫）：退化为同步重建
  }
  disposers.push(() => cancelAnimationFrame(rebuildFrame));

  function rebuild() {
    if (disposed || !ctx.sessions || !ctx.workspaces) return;
    const sessions = ctx.sessions.list.getSnapshot();
    const workspaces = ctx.workspaces.list.getSnapshot();
    /* 召唤边随布局文档既有通道入世界模型（hive-interaction-polish 1.3/D7）：
       fetchState / SSE layout-changed 双路都先落 layout，再由本 tick 传入 deriveWorld。 */
    const derived = deriveWorld({
      sessions,
      workspaces,
      positions: positionsOf(),
      studioState,
      summonEdges: layout?.summonEdges ?? null
    });
    studioState = derived.studioState;
    latestCenters = new Map(derived.world.studios.map((s) => [s.workspaceId, s.center]));
    scene?.setWorld(derived.world);
    /* 「作战报告」差分喂入（hive-combat-log 3.1/D1）：deriveWorld 之后喂入
       （同一数据源一致），与 3D 场景解耦——2D 降级（scene 为 null）下照常采集。
       feed 内部发布轻量订阅（版本号 bump），面板据此重渲染。 */
    feed.ingest({ world: derived.world, workspaces });
    /* 扩环受阻轻推 / 默认重排后的位移回写：同一批 displaced 只回写一次 + 去抖
       （镜像 tick 高频，写入在途时重复触发会造成 PUT 风暴 → 409 风暴）。 */
    if (derived.world.displaced?.length) {
      const sig = [...derived.world.displaced].sort().join(",");
      if (sig !== lastDisplacedSig) {
        lastDisplacedSig = sig;
        clearTimeout(displacedTimer);
        displacedTimer = setTimeout(() => {
          if (disposed) return;
          const positions = { ...positionsOf() };
          for (const id of sig.split(",")) {
            const center = latestCenters.get(id);
            if (center) positions[id] = { q: center.q, r: center.r };
          }
          putLayout({ positions }).catch(() => {});
        }, 300);
        displacedTimer.unref?.();
      }
    }
    /* 工蜂选中门控镜像（4.1）：world 派生变化即刷新（工蜂出现/消失影响卡片区显隐）；
       世界版本号 bump（覆盖面板实时跟随，7.2） */
    refreshSelectedBee();
    /* 会话概要条镜像（session-brief-bar 1.4/D4）：标题 + 末回合预览；内容不变不 bump
       （brief.mjs store 整值比较，镜像 tick 高频下概要条不入 React 重渲染热路径）。 */
    sessionsBriefStore.set(sessionsBriefOf(sessions.byId[sessions.current]));
    worldVersionStore.bump();
  }

  /* ── 官方动词（全部经注入服务，零新协议） ── */

  const actions = {
    selectBee(sessionId) {
      ctx.sessions.open(sessionId);
    },
    /** 会话名单强制补录（召唤链路加速）：宿主流帧未达时兜底拉一次基线。 */
    refreshSessions() {
      try {
        ctx.sessions?.refresh?.()?.catch?.(() => {});
      } catch {
        /* 尽力而为：失败由 appendViaBridge 的有界等待兜底 */
      }
    },
    /** 直址会话输入壳（宿主 conversation.input 服务 = SessionInputResolver
        face）：按 sessionId 写草稿——宿主 selectWorkspace 切会话搬草稿的官方
        同款通道。新召唤会话 blank 期 composer 为 hero variant，composer.dock
        槽位（桥条目宿主）不渲染，桥结构性缺席；binding 未就绪（会话未入宿主
        名单）时 shell(id) fail-loud → 返回 false 交由调用方轮询。 */
    seedDraft(sessionId, prompt) {
      try {
        const conversation = typeof ctx.get === "function" ? ctx.get("conversation") : ctx.conversation;
        const shell = conversation?.input?.shell?.(sessionId);
        if (!shell || typeof shell.setDraft !== "function") return false;
        const current = shell.snapshot?.draft;
        shell.setDraft(appendPrompt(typeof current === "string" ? current : "", String(prompt ?? "")));
        return true;
      } catch {
        return false; // binding 未就绪 → 轮询重试
      }
    },
    /** 蜂卡「打开会话」→ 会话浮窗（3.5）：先 selectBee 同步 current，再开浮窗；
        非工蜂（无人机）保持既有打开行为。 */
    openBeeSession(sessionId) {
      ctx.sessions.open(sessionId);
      if (actions.isWorkerBee(sessionId)) storeBridge?.openFloat?.();
    },
    isWorkerBee(sessionId) {
      return (
        !!sessionId &&
        workerBeeIdOf(scene?.world ?? null, sessionId, null, ctx.sessions?.list?.getSnapshot?.()) === sessionId
      );
    },
    beeTitleOf(sessionId) {
      const world = scene?.world;
      for (const studio of world?.studios ?? []) {
        const bee = (studio?.bees ?? []).find((b) => b.sessionId === sessionId);
        if (bee) return bee.displayTitle ?? "";
      }
      const wild = (world?.wildBees ?? []).find((b) => b.sessionId === sessionId);
      return wild?.displayTitle ?? "";
    },
    /* 蜂种动作（custom-bee-types 4.x/5.x） */
    saveBeeTypes,
    setBeeType,
    /* 道具栏动作（context-hotbar-rework 5.x/6.x） */
    saveHotbars,
    async summon(payload) {
      return summonBee(payload);
    },
    /** 官方目录选择器（D6 spike 结论：uiWorkspace 服务，取消返 null）。 */
    async pickDirectory() {
      return ctx.uiWorkspace?.pickDirectory?.() ?? null;
    },
    /** 官方建工作区（D6）：register an existing path as a Workspace。 */
    async createWorkspace(path) {
      return ctx.workspaces.create({ path });
    },
    clearSelection() {
      scene?.clearSelection();
    },
    /** 清空框选多选集（hive-marquee-and-card-rework 2.6）：外壳 store + scene 双清
        （点面板卡跳蜂等 DOM 路径使用——DOM 点击不经过 scene 单击回调）。 */
    clearMarquee() {
      marqueeStore.commit([]);
      scene?.setMarqueeIds?.(new Set());
    },
    async hatch(sessionId, capabilityId) {
      return hatchBee(sessionId, capabilityId);
    },
    async laneCancel(workspaceId, sessionId) {
      return laneAction(workspaceId, "cancel", sessionId);
    },
    async latchReset(sessionId) {
      return resetLatch(sessionId);
    },
    async fetchModelCatalog(sessionId) {
      return fetchModels(sessionId);
    },
    /** 任一活会话 id（模型目录代理需要活会话；S4）。 */
    anyLiveSessionId() {
      const snapshot = ctx.sessions?.list?.getSnapshot?.();
      const byId = snapshot?.byId ?? {};
      for (const id of snapshot?.ids ?? []) {
        if (byId[id]?.origin !== "subagent" && !byId[id]?.blank) return id;
      }
      return snapshot?.current ?? null;
    },
    /** 会话镜像快照（bee-status-cards：completionPool 排除 subagent 的口径源）。 */
    sessionsSnapshot() {
      return ctx.sessions?.list?.getSnapshot?.() ?? null;
    },
    openFloat() {
      storeBridge?.openFloat?.();
    },
    closeFloat() {
      storeBridge?.closeFloat?.();
    },
    /* 无人机目录打开动作（函数体保留防外部引用漂移；hive-interaction-polish 4.2：
       3D 场景触发已旁路——无人机不可选中，官方侧栏目录仍是子代理会话打开路径）。 */
    selectDrone(sessionId) {
      const address = ctx.sessions.subagentAddress?.(sessionId);
      if (address) ctx.sessions.openSubagent(address);
      else ctx.sessions.open(sessionId);
    },
    newSession(workspaceId) {
      try {
        // 官方 New Session 流（复用 blank 会话并打开；blank 不出蜂，首次请求后才出蜂）
        ctx.workspaces.startSession(workspaceId);
        notify("newSession", "ok");
      } catch (error) {
        notify(String(error?.message || error), "err");
      }
    },
    async openDirectory(path) {
      try {
        await ctx.workspaces.openPath(path);
        notify("openDir", "ok");
      } catch (error) {
        notify(String(error?.message || error), "err");
      }
    },
    async archiveBee(sessionId) {
      try {
        await ctx.workspaces.archiveSession(sessionId);
        notify("archived", "ok");
      } catch (error) {
        notify(String(error?.message || error), "err");
      }
    },
    /** 拖蜂换巢（D6/5.5）：insertSessionBefore 是「巢内重排」动词——宿主源码证实
     非本巢账号的会话直接 WorkspaceMoveInvalidError（M0 尖刺 2.6 结论，R4）。
     * 落点 = 本巢 → 重排到巢首；跨巢/野蜂收养 → 明确取消提示。 */
    async beeDropped(sessionId, workspaceId) {
      try {
        await ctx.workspaces.insertSessionBefore(workspaceId, sessionId);
        notify("adoptSelf", "ok");
      } catch {
        notify("adoptUnavailable", "err"); // 预期路径：cwd 决定巢归属（R4 尖刺结论）
      }
    },
    async studioMoved(workspaceId, cell) {
      await putLayout({ positions: { ...positionsOf(), [workspaceId]: { q: cell.q, r: cell.r } } });
      notify("moveSaved", "ok");
    },
    focusSession(sessionId) {
      scene?.focusBee(sessionId);
    },
    attachScene(host) {
      if (!scene) {
        scene = new HiveScene(host, tBridge.t, {
          onSelectBee: (id) => actions.selectBee(id),
          /* 无人机不可选中（hive-interaction-polish 4.2/D2）：场景触发已旁路——
             interact 单击分支不再调用 onSelectDrone（悬停 tips 与双击聚焦保持）；
             actions.selectDrone 函数体保留防外部引用漂移。 */
          onOpenSession: (id) => actions.openBeeSession(id),
          onSelectCup: () => {},
          onSelectStudio: () => {},
          onStudioMenu: (workspaceId, x, y) => {
            const wsList = ctx.workspaces.list.getSnapshot();
            const ws = wsList.items.find((w) => w.workspaceId === workspaceId);
            menuHandler?.({ kind: "studio", workspaceId, path: ws?.path, title: ws?.title, x, y });
          },
          onBeeMenu: (sessionId, x, y) => menuHandler?.({ kind: "bee", sessionId, x, y }),
          onStudioMoved: (workspaceId, cell) => actions.studioMoved(workspaceId, cell),
          onBeeDropped: (sessionId, workspaceId) => actions.beeDropped(sessionId, workspaceId),
          onInvalidDrop: () => notify("moveInvalid", "err"),
          onDragCancel: () => {},
          onArchiveBee: (sessionId) => actions.archiveBee(sessionId),
          /* 蜂种增量动作（custom-bee-types 5.3）：孵化/车道取消/闩锁重置 → 宿主端点 */
          onHatch: (sessionId, capabilityId) => {
            actions.hatch(sessionId, capabilityId).then((result) => {
              if (result?.ok) notify(result.degraded ? "hatchDegraded" : "hatchSent", "ok");
              else if (result?.missing?.length) notify("hatchMissing", "err");
              else notify("hatchFailed", "err");
            });
          },
          onLaneCancel: (workspaceId, sessionId) => {
            actions.laneCancel(workspaceId, sessionId).then((result) => {
              notify(result?.ok ? "laneCanceled" : "fail", result?.ok ? "ok" : "err");
            });
          },
          onLatchReset: (sessionId) => {
            actions.latchReset(sessionId).then((result) => {
              notify(result?.ok ? "latchReset" : "fail", result?.ok ? "ok" : "err");
            });
          },
          onContextLost: () => notify("contextLost", "err"),
          /* 蜂群面板 3D 模型预览（hive-interaction-polish 追加；5.3 键迁移）：场景侧每
             外观模型 × 状态渲染一次快照（键 `${modelId}:${state}`），入 store 供
             WorkerPanel 卡片取用（低频 bump）。 */
          onBeePreview: (key, url) => beePreviewStore.set(key, url),
          /* 框选通道（2.3/2.5）：矩形 → 选框 DOM（命令式）；提交集合（松手投影序冻结
             数组 / 离场收敛数组 / 空数组=清空）→ marqueeStore + 回写 scene；取消 →
             选框收口（预览集合由 scene 内部回落正式集，外壳无需快照状态）。 */
          onMarqueeRect: (rect) => marqueeRectStore.set(rect),
          onMarqueeCommit: (ids) => {
            marqueeStore.commit(ids);
            scene?.setMarqueeIds?.(marqueeStore.getSet());
          },
          onMarqueeCancel: () => marqueeRectStore.set(null)
        });
        if (layout) scene.setLayout(layout);
        scene.setSelected(ctx.sessions?.list.getSnapshot()?.current);
        scene.setSettings(storeBridge?.getSettings?.() ?? {});
        scene.onSelectionChange = refreshSelectedBee; // 非蜂选中/清选中 → 卡片门控刷新
        startCameraSync();
        /* 场景晚于镜像创建：页面首次打开前积累的镜像更新不会重放，
           立即补一轮派生（否则开页后要等下一次镜像 tick 才有内容）。 */
        scheduleRebuild();
      }
      scene.reattach(host);
      scene.start();
      /* 开页定位（1.5）：每次开页均执行（attachScene 每次调用都跑；scene 创建分支
         只跑一次，SHALL NOT 作为挂点）。挂 start() 之后——700ms 飞行在运行循环内
         可见；时序位于 setLayout（镜头恢复）之后，定位覆盖恢复姿态（D2 风险项时序）。
         与订阅哨兵独立（不受 lastFollowed 约束，每次开页都定位），但同步哨兵防
         随后同值列表刷新重复触发。开关关闭时 SHALL NOT 定位（统一门禁）。 */
      {
        const current = ctx.sessions?.list.getSnapshot()?.current ?? null;
        lastFollowed = current;
        if (storeBridge?.getSettings?.().followCurrent && current) scene.followBee(current);
      }
      return scene;
    },
    detachScene() {
      scene?.stop();
    },
    setMenuHandler(fn) {
      menuHandler = fn;
    },
    setStoreBridge(bridge) {
      storeBridge = bridge;
    },
    getScene: () => scene
  };

  const tBridge = { t: (key) => key };

  /* ── 镜像订阅（实时推送帧驱动；页面关闭也刷新，insight/explorer 同策略） ── */
  disposers.push(ctx.sessions?.list.subscribe(() => scheduleRebuild()));
  disposers.push(ctx.workspaces?.list.subscribe(() => scheduleRebuild()));
  disposers.push(
    ctx.sessions?.list.subscribe(() => {
      const current = ctx.sessions.list.getSnapshot().current;
      scene?.setSelected(current);
      refreshSelectedBee();
      /* 镜头跟随（1.4）：仅 current 变化沿触发——列表镜像的任意非 current 刷新
         （状态/todo/标题）SHALL NOT 重触发飞行、SHALL NOT 把手动摇离的镜头拽回；
         页关闭（scene.stop）期间不飞（followBee 内 running 门禁），由下次开页
         定位兜底（1.5）。开关关闭时无任何相机运动。 */
      if (current === lastFollowed) return;
      lastFollowed = current;
      if (storeBridge?.getSettings?.().followCurrent && current) scene?.followBee(current);
    })
  );

  /* ── SSE 布局广播 + focus 补拉（R5） ── */
  disposers.push(
    subscribeLayout(
      (doc) => {
        layout = doc;
        syncMirrors(doc);
        pushBeeOverlay();
        scheduleRebuild();
      },
      (frame) => syncBeeEngine(frame)
    )
  );
  const onFocus = () => refreshLayout();
  window.addEventListener("focus", onFocus);
  disposers.push(() => window.removeEventListener("focus", onFocus));

  /* ── 镜头偏好节流回写（D8） ── */
  function startCameraSync() {
    if (cameraTimer) return;
    cameraTimer = setInterval(() => {
      if (disposed || !scene) return;
      const pose = JSON.stringify(scene.cameraPose());
      if (pose !== lastCameraJson) {
        lastCameraJson = pose;
        putLayout({ camera: scene.cameraPose() }).catch(() => {});
      }
    }, 20000);
    cameraTimer.unref?.();
  }
  disposers.push(() => {
    if (cameraTimer) clearInterval(cameraTimer);
    cameraTimer = null;
    if (displacedTimer) clearTimeout(displacedTimer);
    displacedTimer = null;
  });

  refreshLayout();

  return {
    actions,
    getFeed: () => feed,
    setT(fn) {
      tBridge.t = fn;
    },
    dispose() {
      disposed = true;
      for (const fn of disposers.splice(0)) {
        try {
          fn();
        } catch {
          /* ignore */
        }
      }
      scene?.dispose();
      scene = null;
    }
  };
}

/* ------------------------------------------------------------------ *
 * 侧栏底部座位按钮（Hive；wide 双形态，insight DashboardSeat 同款）
 * ------------------------------------------------------------------ */

const HEX_SVG =
  '<svg viewBox="0 0 24 28" fill="none" aria-hidden="true"><path d="M12 1.5 22.5 7.5v13L12 26.5 1.5 20.5v-13L12 1.5z" stroke="currentColor" stroke-width="1.6"/><path d="M12 8.5 17 11.4v5.7L12 20l-5-2.9v-5.7L12 8.5z" fill="currentColor" opacity=".55"/></svg>';

function HexIcon() {
  return <span style={{ display: "inline-flex", width: 16, height: 18 }} dangerouslySetInnerHTML={{ __html: HEX_SVG }} />;
}

function HiveSeat({ wide, t }) {
  const open = useHiveOpen();
  const toggle = () => hiveOpenStore.set(!hiveOpenStore.getSnapshot());
  if (wide) {
    return (
      <div className="jyv-seat" data-active={open || undefined}>
        <button
          type="button"
          className="jyv-seat-row"
          data-plugin-anchor="dsh-v-hive:seat"
          aria-expanded={open}
          onClick={toggle}
        >
          <HexIcon />
          <span className="jyv-seat-label">{t("hive.seat")}</span>
        </button>
      </div>
    );
  }
  return (
    <div className="jyv-seat" data-active={open || undefined}>
      <button
        type="button"
        className="jyv-seat-rail"
        data-plugin-anchor="dsh-v-hive:seat"
        aria-label={t("hive.seat.aria")}
        aria-expanded={open}
        title={t("hive.seat")}
        onClick={toggle}
        dangerouslySetInnerHTML={{ __html: HEX_SVG }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 右键菜单（巢 / 蜜蜂）
 * ------------------------------------------------------------------ */

function ContextMenu({ t, menu, onClose, onAction, beeTypes = [], assignments = {} }) {
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menu) return undefined;
    const dismiss = (e) => {
      if (menuRef.current && e.target instanceof Node && menuRef.current.contains(e.target)) return;
      onClose();
    };
    window.addEventListener("pointerdown", dismiss, true);
    window.addEventListener("blur", dismiss);
    return () => {
      window.removeEventListener("pointerdown", dismiss, true);
      window.removeEventListener("blur", dismiss);
    };
  }, [menu, onClose]);
  if (!menu) return null;
  const x = Math.min(menu.x, window.innerWidth - 210);
  const y = Math.min(menu.y, window.innerHeight - 130);
  const item = (label, kind, data) => (
    <button
      type="button"
      className={"jyv-menuItem" + (data?.active ? " jyv-menuItemOn" : "")}
      onClick={() => {
        onClose();
        onAction(kind, { ...menu, ...data });
      }}
    >
      {label}
    </button>
  );
  const currentTypeId = menu.kind === "bee" ? assignments[menu.sessionId] ?? null : null;
  return (
    <div ref={menuRef} className="jyv-menu" style={{ left: x, top: y }} onPointerDown={(e) => e.stopPropagation()}>
      {menu.kind === "studio" && item(t("hive.menu.newSession"), "newSession")}
      {menu.kind === "studio" && menu.path && item(t("hive.menu.openDir"), "openDir")}
      {menu.kind === "bee" && item(t("hive.menu.changeBeeType"), "noop", { header: true })}
      {/* 更换蜂种（custom-bee-types 5.4）：列全部自定义蜂种 + 默认蜂（清除绑定）。
          当前绑定高亮；选择后即时更新绑定（当次回合不追溯，由引擎语义保证）。 */}
      {menu.kind === "bee" &&
        (beeTypes.length > 0 || currentTypeId
          ? beeTypes.map((beeType) => item("⟡ " + beeType.name, "setBeeType", { typeId: beeType.id, active: currentTypeId === beeType.id }))
          : item("⟡ " + t("hive.menu.changeBeeType") + " · 0", "noop", { header: true }))}
      {menu.kind === "bee" && item(t("hive.menu.beeDefault"), "setBeeType", { typeId: null, active: !currentTypeId })}
      {menu.kind === "bee" && item(t("hive.menu.archive"), "archive")}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * WebGL 降级卡（D11/R6）
 * ------------------------------------------------------------------ */

function WebGLFallback({ t, onRetry }) {
  return (
    <div className="jyv-fallback">
      <div className="jyv-fallbackCard">
        <div className="jyv-fallbackTitle">{t("hive.fallback.title")}</div>
        {t("hive.fallback.body")}
        {onRetry ? (
          <div className="jyv-fallbackRetry">
            <button type="button" className="jyv-setReset" onClick={onRetry}>{t("hive.fallback.retry")}</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 顶部会话概要条（hive-interaction-polish 5.1/D4）：canvasWrap 顶部覆盖层。
 *  - 显示 = 仅当前会话为已渲染工蜂（selectedBee 镜像门控：无人机/蜜杯/空白 → 不渲染）；
 *  - 内容 = 标题 + 末回合 prompt/response 预览（sessionsBriefStore 发布，超长 CSS 截断）；
 *  - 纯只读预览：无 onClick 导航（点击 SHALL NOT 触发任何导航/切换/关页）；
 *  - 数据直读会话列表镜像（零新协议），缺失槽位以 `-` 占位（sessionsBriefOf 已置 null）。
 * ------------------------------------------------------------------ */

function BriefBar({ t, selectedBee }) {
  const sig = useSyncExternalStore(
    (listener) => sessionsBriefStore.subscribe(listener),
    () => sessionsBriefStore.getSnapshot()
  );
  void sig; // 订阅即目的：末回合/标题真实变化时重渲染（store 内容不变不 bump）
  const brief = sessionsBriefStore.brief;
  if (!selectedBee || !brief) return null;
  return (
    <div className="jyv-briefBar" role="note" aria-label={t("hive.brief.aria")}>
      <div className="jyv-briefHead">
        <span className="jyv-briefDot" aria-hidden="true"></span>
        <span className="jyv-briefTitle" title={brief.title ?? ""}>{brief.title ?? "-"}</span>
      </div>
      <div className="jyv-briefRow">
        <span className="jyv-briefKey">{t("hive.brief.task")}</span>
        <span className="jyv-briefText" title={brief.prompt ?? ""}>{brief.prompt ?? "-"}</span>
      </div>
      <div className="jyv-briefRow">
        <span className="jyv-briefKey">{t("hive.brief.report")}</span>
        <span className="jyv-briefText" title={brief.response ?? ""}>{brief.response ?? "-"}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 蜂巢整页（shell.overlay 条目；open=false 渲染 null——insight 总览页同款）
 * ------------------------------------------------------------------ */

const HivePageOverlay = function HivePageOverlay(props) {
  const open = useHiveOpen();
  if (!open) return null;
  return <HivePage {...props} />;
};

function HivePage(props) {
  const { t, useStore, ctl, setFullscreen, toggleLegend, clearToast, notify, setSettings, openFloat, closeFloat } = props;
  const fullscreen = useStore((s) => s.fullscreen);
  const toast = useStore((s) => s.toast);
  const legend = useStore((s) => s.legend);
  const settings = useStore((s) => s.settings);
  const floatOpen = useStore((s) => s.floatOpen);
  /* 蜂种镜像（custom-bee-types 4.1）：同源三路同步 */
  const beeTypes = useSyncExternalStore(
    (listener) => beeTypesStore.subscribe(listener),
    () => beeTypesStore.getSnapshot()
  );
  /* 选中工蜂镜像（4.2 门控）：工蜂才显示卡片区 */
  const selectedBee = useSyncExternalStore(
    (listener) => selectedBeeStore.subscribe(listener),
    () => selectedBeeStore.getSnapshot()
  );
  /* 道具栏三栏镜像（context-hotbar-rework 6.1）：SSE 广播 + fetchState 驱动 */
  const hotbars = useSyncExternalStore(
    (listener) => hotbarsStore.subscribe(listener),
    () => hotbarsStore.getSnapshot()
  );
  /* 状态卡片镜像（bee-status-cards D9）：与 hotbars 同源三路同步（同一个订阅源） */
  const statusCards = useSyncExternalStore(
    (listener) => hotbarsStore.subscribe(listener),
    () => hotbarsStore.getStatusCards()
  );
  /* 场景选中槽镜像（6.1）：三态门控信号源 */
  const selection = useSyncExternalStore(
    (listener) => selectionStore.subscribe(listener),
    () => selectionStore.getSnapshot()
  );
  /* 世界派生版本（7.2 覆盖面板实时跟随）：镜像 tick 驱动 */
  const worldVersion = useSyncExternalStore(
    (listener) => worldVersionStore.subscribe(listener),
    () => worldVersionStore.getSnapshot()
  );
  /* 蜂群面板 3D 模型预览镜像（hive-interaction-polish 追加）：场景侧快照生成完成时
     bump（5.3 组合键 `${modelId}:${state}`，每键至多一次，低频）——面板卡片 <img> 随之补上 */
  const beePreviews = useSyncExternalStore(
    (listener) => beePreviewStore.subscribe(listener),
    () => beePreviewStore.getSnapshot()
  );
  void beePreviews; // 订阅即目的：快照就绪时重渲染面板
  /* 框选多选集镜像（4.1/4.2）：非空时覆盖面板切换为多选数据源（投影序冻结） */
  const marqueeVersion = useSyncExternalStore(
    (listener) => marqueeStore.subscribe(listener),
    () => marqueeStore.getSnapshot()
  );
  void marqueeVersion; // 订阅即目的：多选集提交/收敛时重算面板数据源

  const frameRef = useRef(null);
  const measuredRef = useRef(null);
  const pageLeft = usePageLeft(frameRef, measuredRef);
  const degraded = pageLeft === null;

  const hostRef = useRef(null);
  const [webglFailed, setWebglFailed] = useState(settings.renderer === "fallback2d");
  /* WebGL 重试序号（降级卡「重试」按钮驱动）：attach 失败后可原地重试，不必重开页面 */
  const [sceneRetrySeq, setSceneRetrySeq] = useState(0);
  const [menu, setMenu] = useState(null);
  /* 蜂巢编辑开关：页面态，默认关、不持久化（design.md D5）；经 getScene().setEditMode 下发。 */
  const [editMode, setEditMode] = useState(false);
  /* 页内设置模态（context-hotbar-rework 4.x 左纵排改版：场景/外观/布局三节）。
     guardRef 由模态注册「关闭请求」处理（脏草稿 → 离开提醒；干净 → 直接关），
     页级 Esc 分层（模态栈）与模态自身 ✕/遮罩共用同一入口。 */
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsGuardRef = useRef(null);
  /* 蜂群编辑浮窗（custom-bee-types 4.2）：同款守卫与 Esc 分层。 */
  const [swarmOpen, setSwarmOpen] = useState(false);
  const swarmGuardRef = useRef(null);
  /* 指令编辑模态（context-hotbar-rework 5.x）：页头 ⟡ 旁入口，左纵排三节。 */
  const [hotbarsOpen, setHotbarsOpen] = useState(false);
  const hotbarsGuardRef = useRef(null);
  /* 模型目录（4.3，S4）：浮窗打开时经活会话拉一次。 */
  const [modelCatalog, setModelCatalog] = useState(null);
  const [modelState, setModelState] = useState("idle");

  const toggleEdit = () => {
    const next = !editMode;
    setEditMode(next);
    ctl().actions.getScene?.()?.setEditMode(next);
  };

  /* 右键旋转开关（相机手势重排 4.1/D4）：读写 store 设置 rightDragSpin（页签设置持久化，
     默认 false = 右键全向平移）。场景侧经既有「settings 变化 → scene.setSettings」effect
     即时下发（gestures.spinModeOf 闭包读取），拖拽中途切开关不影响当前拖拽（D1）。 */
  const rightDragSpin = Boolean(settings.rightDragSpin ?? false);
  const toggleSpin = () => setSettings({ rightDragSpin: !rightDragSpin });

  /* 场景挂载：页开即启（首次创建，之后挂/卸仅停启 RAF——场景与相机常驻）。
     渲染开关（settings.renderer，即时切换）：fallback2d 强制 2D 降级——卸停 3D、
     移除画布/暗角/卡片层并呈现降级卡；切回 webgl 时 attachScene 经 reattach
     重挂既有画布（场景与相机不重建）。WebGL 创建失败同样自动降级（D11/R6）。 */
  useEffect(() => {
    if (settings.renderer === "fallback2d") {
      ctl().actions.detachScene();
      for (const selector of [".jyv-canvas", ".jyv-vignette", ".jyv-cardsRoot", ".jyv-tips"]) {
        hostRef.current?.querySelector(selector)?.remove();
      }
      setWebglFailed(true);
      return undefined;
    }
    setWebglFailed(false);
    try {
      ctl().actions.setMenuHandler(setMenu);
      ctl().actions.attachScene(hostRef.current);
    } catch (error) {
      // WebGL 不可用 → 移除残留画布/暗角层，渲染静态降级卡（D11/R6）；异常必须留痕
      console.error("[dsh-v-hive] scene attach failed:", error);
      for (const selector of [".jyv-canvas", ".jyv-vignette", ".jyv-cardsRoot", ".jyv-tips"]) {
        hostRef.current?.querySelector(selector)?.remove();
      }
      setWebglFailed(true);
    }
    return () => ctl().actions.detachScene();
  }, [ctl, setMenu, settings.renderer, sceneRetrySeq]);

  /* 浮窗编排（D3 遮罩孔洞模型）：frame 根挂 data-jy-float="open"——样式表据此把
     官方 center 列整形为孔洞矩形（absolute 相对 frame，spike 3.2：frame 为
     position:relative 且填充视口，与遮罩 chrome 同坐标系；不用 transform 避免
     吞掉后代 fixed 基准）、把侧栏/详情列钉回原轨道（中列脱流防 auto-placement
     左移），并以 .jyv-page{visibility:hidden} 隐藏蜂巢页（保持挂载、状态无损）。
     frame 根定位经 data-shell-overlay 锚：.jyv-page 与
     overlayLayer 之间还隔着渲染器 SlotOutlet 注入的 <div data-slot="shell.overlay">
     （display:contents——真实 DOM 节点但无盒，parentElement 照常可数，两跳父级会
     错停在 overlayLayer 上，三条整形子代选择器随之全部落空＝标准会话页全幅直出 +
     小窗蒙版 chrome 的错位叠加）；closest 锚定稳定属性再上一跳到 AppFrame 根，
     对锚层有无/层数漂移免疫。React 不摘除它不管理的外来属性（AppFrame 重渲染
     安全）；卸载兜底摘除。 */
  useEffect(() => {
    const overlay = frameRef.current?.closest("[data-shell-overlay]") ?? null;
    const frame = overlay?.parentElement ?? null; // overlayLayer[data-shell-overlay] → AppFrame 根
    if (!frame) {
      console.warn("[dsh-v-hive] float frame root unresolved: no [data-shell-overlay] ancestor — float reshaping skipped (host DOM drift?)");
      return undefined;
    }
    if (floatOpen) frame.setAttribute("data-jy-float", "open");
    else frame.removeAttribute("data-jy-float");
    return () => frame.removeAttribute("data-jy-float");
  }, [floatOpen]);

  /* 浮窗期间暂停渲染循环（节能）；镜像更新继续入队（仅停 RAF，不丢选中与镜头）。
     卸载（关页）路径不重启场景——detachScene 统一停；开页路径恢复渲染。 */
  useEffect(() => {
    if (!floatOpen) return undefined;
    ctl().actions.getScene?.()?.stop();
    return () => {
      if (hiveOpenStore.getSnapshot()) ctl().actions.getScene?.()?.start();
    };
  }, [floatOpen, ctl]);

  /* 生命周期收口（3.6）：浮窗态在 hiveStore 跨页开合残留会让下次开页直接进浮窗；
     页面卸载兜底收浮窗（覆盖座位/热键/头部按钮/Esc 全部关页路径）。 */
  useEffect(() => {
    return () => closeFloat();
  }, [closeFloat]);

  /* Esc 分层（design.md D9/F1，context-hotbar-rework 5.5）：
     拖拽 > 浮窗 > 退全屏 > 设置/蜂群/指令编辑模态（同层按打开序消费，脏草稿
     同走离开提醒）> 收展开卡 > 清场景选中 > 关页。 */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      const scene = ctl().actions.getScene?.();
      if (scene?.dragInProgress) {
        /* 拖拽取消由 interact 的 window keydown 监听处理（最高优先）；外壳不连带动作。 */
        return;
      }
      if (floatOpen) {
        closeFloat();
        return;
      }
      if (fullscreen) {
        setFullscreen(false);
        return;
      }
      const modalGuard = topModalGuard();
      if (modalGuard) {
        modalGuard();
        return;
      }
      if (scene?.cards?.expandedKey) {
        scene.cards.setExpanded(null);
        return;
      }
      if (scene?.getSelection?.()) {
        scene.clearSelection();
        return;
      }
      /* 清除场景选中层的连带分支（2.6）：框选多选集非空 → 清空（描边消失、面板
         收起），SHALL NOT 连带关闭蜂巢页或退出全屏（spec「Esc 清多选」）。 */
      if (marqueeStore.getSet().size > 0) {
        marqueeStore.commit([]);
        scene?.setMarqueeIds?.(new Set());
        return;
      }
      hiveOpenStore.set(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, floatOpen, setFullscreen, closeFloat, ctl]);

  /* 模型目录加载（4.3，S4）：蜂群浮窗打开时经任一活会话拉取一次。 */
  useEffect(() => {
    if (!swarmOpen) return undefined;
    setModelState("loading");
    let alive = true;
    const sessionId = ctl().actions.anyLiveSessionId?.();
    if (!sessionId) {
      setModelState("unavailable");
      setModelCatalog(null);
      return undefined;
    }
    ctl()
      .actions.fetchModelCatalog?.(sessionId)
      .then((result) => {
        if (!alive) return;
        if (result?.ok) {
          setModelCatalog(result.models);
          setModelState("ready");
        } else {
          setModelCatalog(null);
          setModelState("unavailable");
        }
      });
    return () => {
      alive = false;
    };
  }, [swarmOpen, ctl]);

  /* 打开时聚焦页面帧（insight 焦点管理同款）。 */
  useEffect(() => {
    frameRef.current?.focus?.();
  }, []);

  /* 快捷键（可配置，settings.hotkey）。 */
  useEffect(() => {
    const combo = settings?.hotkey ?? "alt+h";
    if (combo === "off") return undefined;
    const onKey = (e) => {
      const alt = e.altKey;
      const ctrl = e.ctrlKey || e.metaKey;
      if (String(e.key).toLowerCase() !== "h") return;
      if (combo === "alt+h" && alt && !ctrl) {
        e.preventDefault();
        hiveOpenStore.set(!hiveOpenStore.getSnapshot());
      } else if (combo === "ctrl+alt+h" && alt && ctrl) {
        e.preventDefault();
        hiveOpenStore.set(!hiveOpenStore.getSnapshot());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settings?.hotkey]);

  /* 动态效果（三态）：跟随系统（系统 prefers-reduced-motion 时停）| 强制开启
     （忽略系统减动效，当前页始终播放）| 关闭。force 为 hive 页级覆盖——只影响
     蜂巢场景，不改系统设置。 */
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const systemReduce = Boolean(mq?.matches);
      const reduced = settings.animation === "reduced" || (settings.animation !== "force" && systemReduce);
      ctl().actions.getScene?.()?.setReducedMotion(reduced);
    };
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, [ctl, settings.animation]);

  /* 设置变化 → 场景（动画降级/俯角/无人机显隐/外观）。 */
  useEffect(() => {
    ctl().actions.getScene?.()?.setSettings(settings);
  }, [ctl, settings]);

  /* 画布 chrome 配色方案（hive-interaction-polish 追加）：data 属性挂 body——
     --jyv-* 变量定义于 body，蜂群面板/道具栏/菜单/toast 等 canvas 浮层统一继承；
     卸载恢复官方令牌默认（attribute 摘除）。 */
  useEffect(() => {
    const scheme = CHROME_SCHEMES.includes(settings.chromeScheme) ? settings.chromeScheme : "default";
    if (scheme === "default") delete document.body.dataset.jyChrome;
    else document.body.dataset.jyChrome = scheme;
    return () => {
      delete document.body.dataset.jyChrome;
    };
  }, [settings.chromeScheme]);

  /* toast 自动消退。 */
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => clearToast(), 2600);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  const runMenu = async (kind, m) => {
    if (kind === "newSession") await ctl().actions.newSession(m.workspaceId);
    else if (kind === "openDir") await ctl().actions.openDirectory(m.path);
    else if (kind === "archive") await ctl().actions.archiveBee(m.sessionId);
    else if (kind === "setBeeType") {
      const result = await ctl().actions.setBeeType?.(m.sessionId, m.typeId);
      if (result?.ok) notify(m.typeId ? "beeChanged" : "beeCleared", "ok");
      else if (!m.header) notify("fail", "err");
    }
  };

  const close = () => hiveOpenStore.set(false);

  /* 统一键盘仲裁层（hive-interaction-polish 3.1/D1，与 Esc 分层同构的 effect）：
     Z/C 按住连续方位旋转 + E 直达会话共用四重守卫（activeElement 文本输入 /
     topModalGuard / floatOpen / 拖拽进行中，任一命中 → 忽略；isComposing 保险位）。
     Z/C：keydown 记键、keyup 清键（幂等集合，e.repeat 天然无害），渲染循环每帧
     rig.keySpin(dt) 积分（帧率无关）；E：单发直达（e.repeat SHALL 忽略，防长按
     反复关页），对象 = 当前会话工蜂（selectedBee 镜像；无人机/无蜂/非蜂选中无操作），
     组件作用域组合「切会话 + 关页」（D3：关页动词 close() 在组件作用域，SHALL NOT
     新增控制器动作）。window blur / visibilitychange hidden 清空按键集合（防切窗后
     keyup 丢失导致「键卡死」持续旋转）。 */
  const selectedBeeRef = useRef(null);
  selectedBeeRef.current = selectedBee;
  const closeRef = useRef(null);
  closeRef.current = close;
  useEffect(() => {
    const keys = new Set();
    const sceneOf = () => ctl().actions.getScene?.();
    const guarded = (e) =>
      keyboardGuarded({
        activeElement: document.activeElement,
        modalGuard: topModalGuard(),
        floatOpen,
        dragInProgress: Boolean(sceneOf()?.dragInProgress),
        isComposing: e?.isComposing === true
      });
    const onKeyDown = (e) => {
      const key = String(e.key ?? "").toLowerCase();
      if (key === "z" || key === "c") {
        if (guarded(e) || keys.has(key)) return; // 守卫未通过忽略；记键幂等（e.repeat 无害）
        keys.add(key);
        sceneOf()?.setSpinKey?.(key, true);
        return;
      }
      if (key === "e") {
        if (e.repeat || guarded(e)) return; // E 单发：长按反复触发 SHALL 忽略
        const bee = selectedBeeRef.current;
        if (!bee) return; // 无人机/无蜂/非蜂选中 → 无操作（页面保持打开）
        ctl().actions.selectBee?.(bee); // 幂等（current 已是该会话，保险位）
        closeRef.current?.(); // 关页直达标准会话视图（非浮窗语义，D3）
      }
    };
    const onKeyUp = (e) => {
      const key = String(e.key ?? "").toLowerCase();
      if (key !== "z" && key !== "c") return;
      keys.delete(key);
      sceneOf()?.setSpinKey?.(key, false);
    };
    const clearKeys = () => {
      keys.clear();
      sceneOf()?.clearSpinKeys?.();
    };
    const onBlur = () => clearKeys(); // 失焦后 keyup 丢失 → 清键防空转
    const onVisibility = () => {
      if (document.hidden) clearKeys();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearKeys();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ctl, floatOpen]);

  /* ── 情境道具栏（context-hotbar-rework 6.x）：三态门控 + 双通道/召唤/建巢 ── */
  const layout = sanitizeLayout(settings.layout); // 写读两侧净房，保证 m/n 恒在界内
  const hotbarKind = resolveHotbarKind({ selection, selectedBee, floatOpen });

  /* 蜂栏双通道（6.3，继承旧快捷指令语义）：未勾 = 桥追加草稿 + 唤起浮窗（非
     plain 禁用）；勾选 = POST /send followup 直发（静默：无 toast 无镜头）；
     空 Prompt 前置拦截。 */
  const handleBeeSlot = async (slot) => {
    const prompt = String(slot.prompt ?? "");
    if (!prompt.trim() || !selectedBee) return;
    if (slot.autoSend === true) {
      const result = await sendCommand(selectedBee, prompt);
      if (!result.ok) console.warn("[dsh-v-hive] hotbar send failed:", result.error);
      return;
    }
    const appended = await appendViaBridge(selectedBee, prompt);
    if (!appended) return; // 桥当帧不一致且重试失败 → 静默放弃（design 风险表）
    openFloat();
  };

  /* 巢栏召唤卡（6.4/D4/D5）：in-flight 锁至请求返回（防双击双蜂，视觉禁用）。
     autoSend 假 = 切会话 + 填稿 + 关页直达会话视图（不开浮窗）；真且 prompt
     非空 = 宿主直发（页面保持打开）；空白 prompt = 纯召唤（notify 兜底）。 */
  const [summonBusy, setSummonBusy] = useState(false);
  const handleHiveSummon = async (slot) => {
    if (summonBusy || !selection || selection.kind !== "studio") return;
    setSummonBusy(true);
    try {
      const prompt = String(slot.prompt ?? "");
      const result = await ctl().actions.summon({
        workspaceId: selection.id,
        beeTypeId: slot.beeTypeId || undefined,
        prompt,
        autoSend: slot.autoSend === true
      });
      if (!result.ok) {
        notify(result.field === "beeTypeId" ? "summonMissingBee" : "summonFailed", "err");
        return;
      }
      if (!prompt.trim()) {
        notify("summoned", "ok"); // 纯召唤：仅建不发，蜂出场动画 + SSE 自然收敛
        return;
      }
      if (slot.autoSend !== true) {
        /* 审查路径：主通道 = 直址输入壳种子（blank 期 dock 桥结构性缺席）；
           种子成功 → open 切当前会话 → 关页直达标准会话视图（composer 挂载即
           带稿，回车即发）。不开浮窗：浮窗形态会把蜂巢页整体藏掉、四周露出
           被压暗的官方三列（侧栏/explorer 全部可见），视觉上与直接开会话无
           异，窗框纯冗余（用户定稿）。种子失败回落桥通道短等待（非 blank
           会话仍可达）；两路皆败 → 留在蜂巢页显式提示（会话已切，退出蜂巢
           可手动粘贴）。 */
        ctl().actions.refreshSessions?.();
        const appended = (await seedSummonDraft(result.sessionId, prompt))
          || (await appendViaBridge(result.sessionId, prompt, 800));
        if (appended) close(); // 关页直达：终点即“标准新会话 + 预填稿”，无浮窗
        else notify("summonAppendFailed", "err");
      }
    } finally {
      setSummonBusy(false);
    }
  };

  /* 地板建巢卡（6.5/D6）：pickDirectory（取消无副作用）→ workspaces.create →
     按槽位 createBee 走召唤 / 纯建巢；失败 notify 且无半成品（建巢成功而召唤
     失败时保留空巢并提示）。 */
  const [floorBusy, setFloorBusy] = useState(false);
  const handleFloorCard = async (slot) => {
    if (floorBusy) return;
    setFloorBusy(true);
    try {
      let path = null;
      try {
        path = await ctl().actions.pickDirectory();
      } catch (error) {
        console.warn("[dsh-v-hive] pickDirectory failed:", error);
        notify("floorPickFailed", "err");
        return;
      }
      if (!path) return; // 用户取消：无任何副作用
      let workspace;
      try {
        workspace = await ctl().actions.createWorkspace(path);
      } catch (error) {
        console.warn("[dsh-v-hive] workspace create failed:", error);
        notify("floorCreateFailed", "err");
        return;
      }
      const workspaceId = workspace?.workspaceId ?? workspace?.id ?? null;
      if (!workspaceId) {
        notify("floorCreateFailed", "err");
        return;
      }
      if (slot.createBee !== true) {
        notify("floorCreated", "ok"); // 纯建巢：空巢落地（渲染为无蜂工作室）
        return;
      }
      const prompt = String(slot.prompt ?? "");
      const result = await ctl().actions.summon({
        workspaceId,
        beeTypeId: slot.beeTypeId || undefined,
        prompt,
        autoSend: slot.autoSend === true
      });
      if (!result.ok) {
        /* 建巢成功但召唤失败：保留空巢并提示（无半成品） */
        notify(result.field === "beeTypeId" ? "summonMissingBee" : "floorSummonFailed", "err");
        return;
      }
      if (!prompt.trim()) {
        notify("floorCreated", "ok");
        return;
      }
      if (slot.autoSend !== true) {
        /* 审查路径与巢栏召唤同款：种子成功 → 关页直达标准会话视图（不开浮窗，
           理由见 handleHiveSummon）；失败留在蜂巢页提示（会话已切）。 */
        ctl().actions.refreshSessions?.();
        const appended = (await seedSummonDraft(result.sessionId, prompt))
          || (await appendViaBridge(result.sessionId, prompt, 800));
        if (appended) close(); // 关页直达：终点即“标准新会话 + 预填稿”，无浮窗
        else notify("summonAppendFailed", "err");
      }
    } finally {
      setFloorBusy(false);
    }
  };

  /* 覆盖面板数据（7.x + 4.1/4.2 双数据源）：巢选中 = 选中工作室的世界派生；
     框选多选集非空 = world 巢内蜂按 marqueeSet 过滤（ids 与投影序 y→x 于松手时刻
     冻结，卡片内容经 worldVersion tick 实时跟随镜像）。marquee 优先：框选命中
     ≥1 已清巢选中（后到者赢），二者天然互斥；巢选中模式行为全保留。 */
  const sceneWorld = ctl().actions.getScene?.()?.world ?? null;
  const panelStudio =
    selection?.kind === "studio"
      ? (sceneWorld?.studios ?? []).find((s) => s.workspaceId === selection.id) ?? null
      : null;
  void worldVersion; // 订阅即目的：世界派生 tick 时重算 panelStudio 与多选卡内容
  const marqueeSet = marqueeStore.getSet();
  let panelMarqueeBees = null;
  if (marqueeSet.size > 0) {
    const beeById = new Map();
    for (const studio of sceneWorld?.studios ?? []) {
      for (const bee of studio.bees ?? []) {
        if (!bee.droneStandIn) beeById.set(bee.sessionId, bee); // 无人机/降级停驻蜂不出卡（同 studio 模式口径）
      }
    }
    panelMarqueeBees = marqueeStore.getIds().map((id) => beeById.get(id)).filter(Boolean);
    if (panelMarqueeBees.length === 0) panelMarqueeBees = null; // 收敛竞态兜底（集合已空 → 面板收起）
  }

  const floatBeeName = floatOpen && selectedBee ? String(ctl().actions.beeTitleOf?.(selectedBee) ?? "") : "";

  return (
    <>
      <div
        ref={frameRef}
        className="jyv-page"
        tabIndex={-1}
        data-degraded={degraded || undefined}
        data-full={fullscreen || undefined}
        style={fullscreen || degraded ? { left: 0 } : { left: pageLeft }}
      >
        <div className="jyv-pageHead">
          {/* 蜂群编辑（custom-bee-types 4.2）：页面左上角卡按钮入口 */}
          <button
            type="button"
            className={"jyv-toolBtn jyv-swarmBtn" + (swarmOpen ? " jyv-toolBtnOn" : "")}
            title={t("hive.swarm.title")}
            aria-label={t("hive.swarm.title")}
            aria-haspopup="dialog"
            onClick={() => setSwarmOpen(true)}
          >
            ⟡ {t("hive.swarm.title")}
          </button>
          {/* 指令编辑（context-hotbar-rework 5.1）：与蜂群编辑并排的页头卡按钮入口 */}
          <button
            type="button"
            className={"jyv-toolBtn jyv-swarmBtn" + (hotbarsOpen ? " jyv-toolBtnOn" : "")}
            title={t("hive.hb.title")}
            aria-label={t("hive.hb.title")}
            aria-haspopup="dialog"
            onClick={() => setHotbarsOpen(true)}
          >
            ⌘ {t("hive.hb.title")}
          </button>
          {/* 蜂巢编辑（搬巢/整理开关，自底栏上收）：开启后先点巢再拖动搬巢 */}
          <button
            type="button"
            className={"jyv-toolBtn" + (editMode ? " jyv-toolBtnOn" : "")}
            title={t("hive.editToggle.tooltip")}
            aria-pressed={editMode}
            onClick={toggleEdit}
          >
            ✎ {t("hive.editToggle")}
          </button>
          {/* 右键旋转开关（相机手势重排 4.1/D4，沿 ✎ 开关先例）：开 = 右键拖拽方位
              旋转；关（默认）= 右键拖拽全向平移。随页签设置持久化（rightDragSpin）。 */}
          <button
            type="button"
            className={"jyv-toolBtn" + (rightDragSpin ? " jyv-toolBtnOn" : "")}
            title={t("hive.spinToggle.tooltip")}
            aria-pressed={rightDragSpin}
            onClick={toggleSpin}
          >
            ⟳ {t("hive.spinToggle")}
          </button>
          <span className="jyv-pageTitle">
            <span className="jyv-hexMark" dangerouslySetInnerHTML={{ __html: HEX_SVG }} />
            {t("hive.title")}
          </span>
          <span className="jyv-pageActions">
            {/* 图例（自底栏上收，图标形态；储蜜层一键镜头已随相机手势重排移除） */}
            <button type="button" className={"jyv-toolBtn" + (legend ? " jyv-toolBtnOn" : "")} title={t("hive.legend")} aria-label={t("hive.legend")} onClick={toggleLegend}>◑</button>
            <button
              type="button"
              className={"jyv-toolBtn" + (settingsOpen ? " jyv-toolBtnOn" : "")}
              title={t("hive.settings.title")}
              aria-label={t("hive.settings.title")}
              aria-haspopup="dialog"
              onClick={() => setSettingsOpen(true)}
            >
              {/* 官方设置图标（IconSettingsOutline16, size 16）——与侧栏设置触发按钮
                  wide 形态同一组件同一尺寸（窄栏 rail 为 IconSettingsOutline14/18）；
                  fill: currentColor 跟随 jyv-toolBtn 文字色 */}
              <IconSettingsOutline16 size={16} />
            </button>
            <button
              type="button"
              className="jyv-toolBtn"
              title={t(fullscreen ? "hive.exitFullscreen" : "hive.fullscreen")}
              onClick={() => setFullscreen(!fullscreen)}
            >
              {fullscreen ? "⤡" : "⤢"}
            </button>
            <button type="button" className="jyv-toolBtn" title={t("hive.title")} onClick={close}>
              ×
            </button>
          </span>
        </div>
        <div className="jyv-canvasWrap" ref={hostRef}>
          {webglFailed ? (
            <WebGLFallback
              t={t}
              onRetry={settings.renderer !== "fallback2d" ? () => setSceneRetrySeq((n) => n + 1) : null}
            />
          ) : null}
          {/* FPS 计数器（用户定稿）：画布左上角，设置可开关 */
            settings.showFps !== false ? <FpsMeter /> : null}
          {/* 顶部会话概要条（session-brief-bar 5.1）：仅当前会话为已渲染工蜂时渲染；
              纯只读预览（无 onClick 导航），数据直读会话列表镜像（零新协议） */}
          <BriefBar t={t} selectedBee={selectedBee} />
          {/* 工蜂阵列覆盖面板（7.x + 4.x）：巢选中或框选多选时右缘呈现（画布之上的 UI 层） */}
          <WorkerPanel
            t={t}
            studio={panelStudio}
            marquee={panelMarqueeBees}
            layout={layout}
            assignments={beeTypesStore.getAssignments()}
            beeTypes={beeTypes}
            previews={beePreviewStore.getMap()}
            onPickBee={(sessionId) => {
              /* 清巢跳蜂（D7）+ 清多选跳蜂（4.1 框选卡同语义）：清场景选中与多选集 →
                 切当前会话；描边回落、面板收起、道具栏切蜂栏均由既有选中链驱动 */
              ctl().actions.clearSelection?.();
              ctl().actions.clearMarquee?.();
              ctl().actions.selectBee(sessionId);
            }}
          />
          {/* 框选矩形层（2.3）：canvasWrap 内覆盖 div，accent 描边 + 低透明填充，
              pointer-events:none；矩形随 interact move 命令式更新、结束/取消隐藏 */}
          <MarqueeOverlay />
          {/* 作战报告面板（hive-combat-log 4.1）：左下角可收起文字面板 */ }
          <CombatLogPanel
            t={t}
            ctl={ctl}
            settings={settings}
            setSettings={setSettings}
          />
          {/* 完成状态栏（bee-status-cards 3.x/4.x）：左缘居中，逐蜂种完成池卡片 */}
          <StatusBar
            t={t}
            ctl={ctl}
            settings={settings}
            beeTypes={beeTypes}
            assignments={beeTypesStore.getAssignments()}
            statusCards={statusCards}
            notify={notify}
            disabled={settingsOpen || swarmOpen || hotbarsOpen}
          />
        </div>
        {legend ? (
          <div className="jyv-legend">
            <span className="jyv-legendItem"><span className="jyv-legendDot jyv-state-idle" />{t("hive.legend.idle")}</span>
            <span className="jyv-legendItem"><span className="jyv-legendDot jyv-state-busy" />{t("hive.legend.busy")}</span>
            <span className="jyv-legendItem"><span className="jyv-legendDot jyv-state-help" />{t("hive.legend.help")}</span>
            <span className="jyv-legendItem"><span className="jyv-legendDot jyv-state-done" />{t("hive.legend.done")}</span>
            <span className="jyv-legendItem">🍯 {t("hive.legend.honey")}</span>
            {/* 键盘手势提示（hive-interaction-polish 8.1）：Z/C 旋转与 E 直达 */}
            <span className="jyv-legendItem jyv-legendKey">{t("hive.legend.keysZC")}</span>
            <span className="jyv-legendItem jyv-legendKey">{t("hive.legend.keysE")}</span>
          </div>
        ) : null}
        {/* 情境道具栏（6.x）：三态互斥（kind null 不渲染）；浮窗开启 = 遮罩暂停态；
            内置卡接入（hotbar-default-actions 3.1）：蜂栏内置卡常驻追加在用户槽位后，
            其余栏空栏回退整组默认卡——有效槽位派生见 effectiveHotbarSlots */}
        <HotbarBar
          t={t}
          kind={hotbarKind}
          slots={hotbarKind ? effectiveHotbarSlots(hotbarKind, hotbars[hotbarKind], t) : []}
          layout={layout}
          bridgeReady={composerBridge.inputActions !== null && composerBridge.phase === "plain"}
          disabled={settingsOpen || swarmOpen || hotbarsOpen}
          summonBusy={summonBusy}
          floorBusy={floorBusy}
          onSlot={async (slot) => {
            if (hotbarKind === "bee") {
              /* 动作默认卡分派（用户定稿）：归档 = 既有 archiveBee 动词（与蜂卡/
                 右键菜单同路，无确认）；打开 = 收起蜂巢页直达当前会话标准视图
                 （不开浮窗，与召唤审查路径同款「关页直达」）。 */
              if (slot.action === "archive") {
                if (selectedBee) await ctl().actions.archiveBee(selectedBee);
                return;
              }
              if (slot.action === "open") {
                close();
                return;
              }
              await handleBeeSlot(slot);
            }
            else if (hotbarKind === "hive") await handleHiveSummon(slot);
            else if (hotbarKind === "floor") await handleFloorCard(slot);
          }}
        />
        {settingsOpen ? (
          <HiveSettingsModal
            t={t}
            settings={settings}
            setSettings={setSettings}
            guardRef={settingsGuardRef}
            onClose={() => setSettingsOpen(false)}
          />
        ) : null}
        {swarmOpen ? (
          <BeeSwarmModal
            t={t}
            beeTypes={beeTypes}
            guardRef={swarmGuardRef}
            onClose={() => setSwarmOpen(false)}
            onSave={(rows) => ctl().actions.saveBeeTypes?.(rows) ?? Promise.resolve({ ok: false, error: "controller unavailable" })}
            onNotify={(text, kind) => notify?.(text, kind)}
            modelCatalog={modelCatalog}
            modelState={modelState}
          />
        ) : null}
        {hotbarsOpen ? (
          /* 指令编辑模态（context-hotbar-rework 5.x）：左纵排四节（巢/蜂/地板/状态卡片） */
          <HotbarsModal
            t={t}
            hotbars={hotbars}
            statusCards={statusCards}
            beeTypes={beeTypes}
            layout={layout}
            guardRef={hotbarsGuardRef}
            onClose={() => setHotbarsOpen(false)}
            onSave={(next, nextStatus) => ctl().actions.saveHotbars?.(next, nextStatus) ?? Promise.resolve({ ok: false, error: "controller unavailable" })}
          />
        ) : null}
      </div>
      {floatOpen ? (
        /* 浮窗 chrome（D3）：全部在 overlay 层内——四条半透明遮罩条围出孔洞
           （点击 = 收起）+ 标题栏（蜂名随选蜂 + ✕，紧贴孔洞上缘）。
           chrome 自身 pointer-events:none，孔洞处点击穿透到官方 center 列。 */
        <div className="jyv-floatChrome">
          <div className="jyv-floatMask jyv-floatMaskT" onClick={closeFloat} />
          <div className="jyv-floatMask jyv-floatMaskB" onClick={closeFloat} />
          <div className="jyv-floatMask jyv-floatMaskL" onClick={closeFloat} />
          <div className="jyv-floatMask jyv-floatMaskR" onClick={closeFloat} />
          <div className="jyv-floatTitle">
            <span className="jyv-floatName">{floatBeeName}</span>
            <button
              type="button"
              className="jyv-floatClose"
              title={t("hive.float.collapse")}
              aria-label={t("hive.float.collapse")}
              onClick={closeFloat}
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
      <ContextMenu t={t} menu={menu} onClose={() => setMenu(null)} onAction={runMenu} beeTypes={beeTypes} assignments={beeTypesStore.getAssignments()} />
      {toast ? <div key={toast.seq} className={"jyv-toast" + (toast.kind === "err" ? " jyv-toastErr" : "")}>{toastText(t, toast.text)}</div> : null}
    </>
  );
}

/**
 * 页面帧左缘 = 侧栏右缘（insight useSidebarLeft 同款测量）：
 * [data-slot="sidebar"] 出口父列的右缘相对 shell.overlay 层容器左缘的距离，
 * ResizeObserver 跟踪（折叠/拖宽/动画帧都触发）；测不到 → null（降级 left:0）。
 */
function usePageLeft(frameRef, measuredRef) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    let ro = null;
    let raf = 0;
    let tries = 90;
    let disposed = false;
    let currentLeft = -1;
    const sidebarColumn = () => {
      try {
        const anchor = document.querySelector('[data-slot="sidebar"]');
        return anchor?.parentElement ?? null;
      } catch {
        return null;
      }
    };
    const apply = () => {
      const column = sidebarColumn();
      /* shell.overlay 层容器（inset:0 于 AppFrame）——以其左缘为原点，避免 AppFrame
         不在视口原点时的坐标漂移。经 data-shell-overlay 锚定位（同浮窗 frame 根
         修复）：page 的直接父级是渲染器 SlotOutlet 注入的 display:contents 锚 div
         （无盒，getBoundingClientRect 为全零矩形），父级一跳会错停其上、左缘恒 0，
         测量将退化为视口原点口径。 */
      const overlay = frameRef.current?.closest("[data-shell-overlay]") ?? null;
      if (!column || !overlay) return false;
      const rect = column.getBoundingClientRect();
      const base = overlay.getBoundingClientRect();
      if (rect.width <= 0 && rect.height <= 0) return false;
      const next = Math.max(0, Math.round(rect.right - base.left));
      if (next !== currentLeft) {
        currentLeft = next;
        measuredRef.current = next;
        setLeft(next);
      }
      return true;
    };
    const scheduleApply = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    const tick = () => {
      if (disposed) return;
      if (apply()) {
        const column = sidebarColumn();
        if (column && typeof ResizeObserver !== "undefined") {
          ro = new ResizeObserver(scheduleApply);
          ro.observe(column);
        }
        window.addEventListener("resize", scheduleApply);
        return;
      }
      if (tries-- > 0) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", scheduleApply);
    };
  }, []);
  return left;
}

/** toast 文案：控制器的语义键 → 字典；已是完整文本则原样。 */
function toastText(t, text) {
  const map = {
    newSession: t("hive.toast.newSession"),
    archived: t("hive.toast.archived"),
    openDir: t("hive.toast.openDir"),
    moveSaved: t("hive.toast.moveSaved"),
    "conflict-replay": t("hive.toast.moveConflict"),
    "conflict-retry": t("hive.toast.moveConflict"),
    moveInvalid: t("hive.toast.moveInvalid"),
    adoptUnavailable: t("hive.toast.adoptUnavailable"),
    adoptSelf: t("hive.toast.adoptSelf"),
    contextLost: t("hive.fallback.title"),
    swarmSaved: t("hive.swarm.saved"),
    beeChanged: t("hive.card.beeChanged"),
    beeCleared: t("hive.card.beeCleared"),
    hatchSent: t("hive.card.hatchSent"),
    hatchDegraded: t("hive.card.hatchDegraded"),
    hatchFailed: t("hive.card.hatchFailed"),
    hatchMissing: t("hive.card.hatchMissing"),
    laneCanceled: t("hive.card.laneCanceled"),
    latchReset: t("hive.card.latchReset"),
    /* 道具栏（context-hotbar-rework 6.x） */
    summoned: t("hive.bar.toastSummoned"),
    summonFailed: t("hive.bar.toastSummonFailed"),
    summonMissingBee: t("hive.bar.toastMissingBee"),
    floorCreated: t("hive.bar.toastFloorCreated"),
    floorCreateFailed: t("hive.bar.toastFloorCreateFailed"),
    floorPickFailed: t("hive.bar.toastFloorPickFailed"),
    floorSummonFailed: t("hive.bar.toastFloorSummonFailed"),
    summonAppendFailed: t("hive.bar.toastSummonAppendFailed")
  };
  return map[text] ?? text;
}

/* ------------------------------------------------------------------ *
 * 设置模态（hive-quick-commands 5.x，替换原三轮页内设置面板）：
 *  - 页头 ⚙ 弹出页内模态，页签 tablist（官方 plugins 页同构键盘导航：
 *    左右/Home/End 循环 + roving tabindex）；
 *  - 「场景显示」页签：现有五个场景控件平移 + 外观分组（同属场景显示语义，
 *    功能保留），复用 setSettings localStorage 写入路径；
 *  - 「快捷指令」页签已随 context-hotbar-rework 拆除（道具栏编辑走指令编辑
 *    模态，任务 5.x）；左纵排 nav rail 改版见任务 4.x。
 * bundle 纯净门不变：控件全部自绘，不按值 import 官方卡 chrome/form 模型。
 * ------------------------------------------------------------------ */

const SetRow = ({ label, hint, children }) => (
  <div className="jyv-setRow">
    <span>
      <div className="jyv-setLabel">{label}</div>
      {hint ? <div className="jyv-setHint">{hint}</div> : null}
    </span>
    {children}
  </div>
);

const SetSelect = ({ value, options, onChange }) => (
  <select className="jyv-setSelect" value={value} onChange={(e) => onChange(e.target.value)}>
    {options.map(([v, label]) => (
      <option key={v} value={v}>{label}</option>
    ))}
  </select>
);

const SetToggle = ({ value, onChange }) => (
  <button type="button" className={"jyv-setToggle" + (value ? " jyv-setToggleOn" : "")} onClick={() => onChange(!value)} aria-pressed={value} />
);

const SetSlider = ({ value, min, max, step, format, onChange }) => (
  <span className="jyv-setRangeWrap">
    <input type="range" className="jyv-setRange" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    <span className="jyv-setRangeVal">{format(value)}</span>
  </span>
);

const SetColor = ({ value, onChange }) => (
  <span className="jyv-setColorWrap">
    <input type="color" className="jyv-setColor" value={value} onChange={(e) => onChange(e.target.value)} aria-label={value} />
    <span className="jyv-setColorVal">{value}</span>
  </span>
);

const SetGroup = ({ label }) => <div className="jyv-setGroup">{label}</div>;

/* （场景/外观/布局三节内容体见文件后段：SceneSettingsBody / AppearanceSettingsBody /
    LayoutSettingsBody —— context-hotbar-rework 4.2 自原「场景显示」拆分归位。） */

/* ------------------------------------------------------------------ *
 * 蜂群编辑浮窗（custom-bee-types 4.2/4.3）：双页签（蜂种列表 + 能力编辑器）。
 * 骨架复用页内设置模态（遮罩 + 关闭守卫 + Esc 分层 + tablist 键盘导航），
 * 头部可拖拽定位（任务 4.2「拖拽」）；保存走 validateBeeTypesDraft 客户端
 * 预校验（字段级 zh/en 提示）→ 控制器 putState（409 重放 + host-stale 检测）。
 * ------------------------------------------------------------------ */

/* 对话模型（LLM；与 3D 外观模型 beeModel 是两个不同字段）下拉的键构造——
 * 受控 value 与 <option> value 的唯一出处（fix-swarm-llm-model-select：历史上
 * option 用 JSON 串、value 用拼接串，两轨永不相等 → 选择后弹回默认）。 */
const modelKeyOf = (m) => m.provider + "/" + m.model + (m.reasoningEffort ? "/" + m.reasoningEffort : "");

function BeeSwarmModal({ t, beeTypes, guardRef, onClose, onSave, onNotify, modelCatalog, modelState }) {
  const [tab, setTab] = useState("types");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const tabRefs = useRef({});
  const dirtyRef = useRef(false);
  const [draft, setDraft] = useState(() => beeTypes.map((b) => ({ ...b, capabilities: (b.capabilities ?? []).map((c) => ({ ...c, trigger: { ...(c.trigger ?? {}) } })) })));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(() => beeTypes[0]?.id ?? null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(beeTypes);
  dirtyRef.current = dirty;
  /* 干净草稿跟随镜像（跨页签 SSE 收敛；脏草稿仅本地——commands D4 同款） */
  useEffect(() => {
    if (!dirty) setDraft(beeTypes.map((b) => ({ ...b, capabilities: (b.capabilities ?? []).map((c) => ({ ...c, trigger: { ...(c.trigger ?? {}) } })) })));
  }, [beeTypes, dirty]);

  /* 可拖拽头部（4.2「拖拽」）：pointerdown 拖动 offset，double-click 复位。 */
  const dragRef = useRef(null);
  const [pos, setPos] = useState(null);
  const onHeadPointerDown = (e) => {
    if (e.target.closest("button")) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, base: pos ?? { x: 0, y: 0 } };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onHeadPointerMove = (e) => {
    if (!dragRef.current) return;
    const { startX, startY, base } = dragRef.current;
    setPos({ x: base.x + (e.clientX - startX), y: base.y + (e.clientY - startY) });
  };
  const onHeadPointerUp = () => {
    dragRef.current = null;
  };

  const requestClose = () => {
    if (dirtyRef.current) {
      setConfirmDiscard(true);
      return;
    }
    onClose();
  };
  useModalGuard("swarm", guardRef, requestClose);

  const patchType = (id, p) => setDraft((prev) => prev.map((b) => (b.id === id ? { ...b, ...p } : b)));
  const addType = () => {
    setError(null);
    const id = "bee-" + Date.now().toString(36);
    setDraft((prev) => [...prev, { id, name: "", queuePolicy: "free", capabilities: [] }]);
    setSelectedId(id);
    setTab("types");
  };
  const removeType = (id) => {
    /* 删除级联预览：其它蜂种能力里 spawn 目标指向它的能力一并移除（与宿主级联一致） */
    setDraft((prev) =>
      prev
        .filter((b) => b.id !== id)
        .map((b) => ({ ...b, capabilities: (b.capabilities ?? []).filter((c) => !(c.action?.type === "spawn" && c.action?.targetBeeTypeId === id)) }))
    );
    setSelectedId((prev) => (prev === id ? null : prev));
  };
  const moveType = (id, delta) =>
    setDraft((prev) => {
      const from = prev.findIndex((b) => b.id === id);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      return next;
    });

  const selected = draft.find((b) => b.id === selectedId) ?? null;
  const patchCap = (typeId, capId, p) =>
    setDraft((prev) => prev.map((b) => (b.id === typeId ? { ...b, capabilities: (b.capabilities ?? []).map((c) => (c.id === capId ? { ...c, ...p } : c)) } : b)));
  const addCap = (typeId) => {
    const capId = "cap-" + Date.now().toString(36);
    setDraft((prev) =>
      prev.map((b) =>
        b.id === typeId
          ? { ...b, capabilities: [...(b.capabilities ?? []), { id: capId, name: "", trigger: { capture: {} }, action: { type: "send", promptTemplate: "" }, once: true }] }
          : b
      )
    );
  };
  const removeCap = (typeId, capId) =>
    setDraft((prev) => prev.map((b) => (b.id === typeId ? { ...b, capabilities: (b.capabilities ?? []).filter((c) => c.id !== capId) } : b)));

  const errText = (err) => (err?.code ? t("hive.bee.err." + err.code) : null);

  const save = async () => {
    const invalid = validateBeeTypesDraft(draft);
    if (invalid) {
      setError(errText(invalid) ?? t("hive.bee.err.invalidShape"));
      return;
    }
    setSaving(true);
    /* 与宿主落库形态对齐（normalizeBeeTypes：键序/空字段丢弃同源），保存成功后
       草稿与镜像逐字一致，脏标记消解（双侧 normalize 同款纪律） */
    const aligned = normalizeBeeTypes(draft).map((b) => ({
      ...b,
      capabilities: (b.capabilities ?? []).map((c) => ({ ...c, trigger: { ...c.trigger } }))
    }));
    const result = await onSave(aligned);
    setSaving(false);
    if (result?.ok) {
      setError(null);
      setDraft(aligned.map((b) => ({ ...b, capabilities: (b.capabilities ?? []).map((c) => ({ ...c, trigger: { ...c.trigger } })) })));
      onNotify?.("swarmSaved", "ok");
      return;
    }
    setError(result?.error === "host-stale" ? t("hive.swarm.hostStale") : t("hive.qc.saveFailed"));
  };

  /* 对话模型目录展开：options（含首项「使用默认模型」空键）+ 键→对象映射（onChange
   * 反查构造模型对象，杜绝 JSON-in-DOM-attribute；重键以先建者胜，查表不做手写解析）。 */
  const modelOptions = (() => {
    const items = [{ key: "", entry: null, label: t("hive.swarm.modelNone") }];
    const byKey = new Map([["", null]]);
    for (const g of modelCatalog?.groups ?? []) {
      for (const mm of g.models ?? []) {
        const efforts = mm.reasoning?.efforts ?? [];
        for (const eff of efforts.length ? efforts : [null]) {
          const entry = { provider: g.id, model: mm.id, ...(eff ? { reasoningEffort: eff.id } : {}) };
          const key = modelKeyOf(entry);
          if (!byKey.has(key)) byKey.set(key, entry);
          items.push({ key, entry, label: g.name + " · " + mm.name + (eff ? " · " + eff.name : "") });
        }
      }
    }
    return { items, byKey };
  })();

  const onTabKeyDown = (e) => {
    const order = ["types", "caps"];
    const idx = order.indexOf(tab);
    let to = null;
    if (e.key === "ArrowRight") to = order[(idx + 1) % order.length];
    else if (e.key === "ArrowLeft") to = order[(idx + order.length - 1) % order.length];
    if (to) {
      e.preventDefault();
      setTab(to);
      tabRefs.current[to]?.focus?.();
    }
  };
  const tabButton = (key, labelKey) => (
    <button
      type="button"
      ref={(el) => (tabRefs.current[key] = el)}
      role="tab"
      id={"jyv-swarmTab-" + key}
      aria-selected={tab === key}
      aria-controls={"jyv-swarmPanel-" + key}
      tabIndex={tab === key ? 0 : -1}
      className={"jyv-setTab" + (tab === key ? " jyv-setTabOn" : "")}
      onClick={() => setTab(key)}
    >
      {t(labelKey)}
    </button>
  );

  return (
    <div className="jyv-modalBack" onClick={requestClose}>
      <div
        className="jyv-modal jyv-swarmModal"
        role="dialog"
        aria-modal="true"
        aria-label={t("hive.swarm.title")}
        style={pos ? { transform: `translate(${pos.x}px, ${pos.y}px)` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="jyv-modalHead jyv-swarmHead" onPointerDown={onHeadPointerDown} onPointerMove={onHeadPointerMove} onPointerUp={onHeadPointerUp} onDoubleClick={() => setPos(null)}>
          <span className="jyv-modalTitle">{t("hive.swarm.title")}</span>
          <button type="button" className="jyv-toolBtn" title={t("hive.swarm.close")} onClick={requestClose}>×</button>
        </div>
        <div className="jyv-setTabs" role="tablist" aria-label={t("hive.swarm.title")} onKeyDown={onTabKeyDown}>
          {tabButton("types", "hive.swarm.tabTypes")}
          {tabButton("caps", "hive.swarm.tabCaps")}
        </div>
        {confirmDiscard ? (
          <div className="jyv-qcConfirm" role="alertdialog" aria-label={t("hive.qc.confirmDiscard")}>
            <span>{t("hive.qc.confirmDiscard")}</span>
            <button type="button" className="jyv-qcMove" title={t("hive.qc.keepEditing")} onClick={() => setConfirmDiscard(false)}>↩</button>
            <button type="button" className="jyv-qcDiscard" onClick={onClose}>{t("hive.qc.discard")}</button>
          </div>
        ) : null}
        <div role="tabpanel" id="jyv-swarmPanel-types" aria-labelledby="jyv-swarmTab-types" className="jyv-modalBody" hidden={tab !== "types"}>
          <div className="jyv-qcRows">
            {draft.length === 0 ? <div className="jyv-qcEmpty">{t("hive.swarm.empty")}</div> : null}
            {draft.map((row, index) => (
              <div key={row.id} className={"jyv-qcRow" + (selectedId === row.id ? " jyv-swarmRowOn" : "")} onClick={() => setSelectedId(row.id)}>
                <div className="jyv-qcRowHead">
                  <input
                    className="jyv-qcNameInput"
                    value={row.name}
                    placeholder={t("hive.swarm.namePlaceholder")}
                    onChange={(e) => patchType(row.id, { name: e.target.value })}
                  />
                  <button type="button" className="jyv-qcMove" disabled={index === 0} title={t("hive.qc.moveUp")} onClick={() => moveType(row.id, -1)}>↑</button>
                  <button type="button" className="jyv-qcMove" disabled={index === draft.length - 1} title={t("hive.qc.moveDown")} onClick={() => moveType(row.id, 1)}>↓</button>
                  <button type="button" className="jyv-qcRemove" title={t("hive.swarm.deleteType")} aria-label={t("hive.swarm.deleteType")} onClick={() => removeType(row.id)}>✕</button>
                </div>
                <div className="jyv-swarmTypeRow" onClick={(e) => e.stopPropagation()}>
                  <label className="jyv-swarmField">
                    <span>{t("hive.swarm.queuePolicy")}</span>
                    <select value={row.queuePolicy ?? "free"} onChange={(e) => patchType(row.id, { queuePolicy: e.target.value })}>
                      <option value="free">{t("hive.swarm.queueFree")}</option>
                      <option value="serialized">{t("hive.swarm.queueSerialized")}</option>
                    </select>
                  </label>
                  <label className="jyv-swarmField">
                    <span>{t("hive.swarm.beeModel")}</span>
                    <select value={row.beeModel ?? "worker"} onChange={(e) => patchType(row.id, e.target.value === "worker" ? { beeModel: undefined } : { beeModel: e.target.value })}>
                      {BEE_APPEARANCE_MODELS.map((id) => (
                        <option key={id} value={id}>{t("hive.beeModel." + id)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="jyv-swarmField jyv-swarmFieldGrow">
                    <span>{t("hive.swarm.model")}</span>
                    {modelState === "loading" ? (
                      <span className="jyv-swarmHint">{t("hive.swarm.modelLoading")}</span>
                    ) : !modelCatalog ? (
                      <span className="jyv-swarmHint">{t("hive.swarm.modelUnavailable")}</span>
                    ) : (
                      <select
                        value={row.model ? modelKeyOf(row.model) : ""}
                        onChange={(e) => patchType(row.id, { model: modelOptions.byKey.get(e.target.value) ?? undefined })}
                      >
                        {modelOptions.items.map((it) => (
                          <option key={it.key} value={it.key}>{it.label}</option>
                        ))}
                      </select>
                    )}
                  </label>
                </div>
                <input
                  className="jyv-qcPromptInput jyv-swarmDesc"
                  value={row.description ?? ""}
                  placeholder={t("hive.swarm.descPlaceholder")}
                  onChange={(e) => patchType(row.id, { description: e.target.value })}
                />
                <textarea
                  className="jyv-qcPromptInput jyv-swarmPreset"
                  value={row.presetPrompt ?? ""}
                  placeholder={t("hive.swarm.presetPromptPlaceholder")}
                  aria-label={t("hive.swarm.presetPromptPlaceholder")}
                  title={t("hive.swarm.presetPromptHint")}
                  onChange={(e) => patchType(row.id, e.target.value.trim() ? { presetPrompt: e.target.value } : { presetPrompt: undefined })}
                />
              </div>
            ))}
          </div>
          <div className="jyv-qcActions">
            <button type="button" className="jyv-qcAdd" onClick={addType}>+ {t("hive.swarm.add")}</button>
            {error ? <span className="jyv-qcError" role="alert">{error}</span> : null}
            {dirty && !error ? <span className="jyv-qcDirty">{t("hive.swarm.dirty")}</span> : null}
            <button type="button" className="jyv-qcSave" disabled={saving} onClick={save}>{saving ? t("hive.qc.saving") : t("hive.qc.save")}</button>
          </div>
        </div>
        <div role="tabpanel" id="jyv-swarmPanel-caps" aria-labelledby="jyv-swarmTab-caps" className="jyv-modalBody" hidden={tab !== "caps"}>
          {!selected ? (
            <div className="jyv-qcEmpty">{t("hive.swarm.empty")}</div>
          ) : (
            <div className="jyv-swarmCaps">
              <div className="jyv-swarmCapsHead">
                <span>{t("hive.swarm.capsFor").replace("{name}", selected.name || selected.id)}</span>
                <button type="button" className="jyv-qcAdd" onClick={() => addCap(selected.id)}>+ {t("hive.swarm.capAdd")}</button>
              </div>
              {(selected.capabilities ?? []).length === 0 ? <div className="jyv-qcEmpty">{t("hive.swarm.capEmpty")}</div> : null}
              {(selected.capabilities ?? []).map((cap) => {
                const captureEntries = Object.entries(cap.trigger?.capture ?? {});
                const vars = Array.from(new Set([...captureEntries.map(([k]) => k)]));
                return (
                  <div key={cap.id} className="jyv-qcRow">
                    <div className="jyv-qcRowHead">
                      <input
                        className="jyv-qcNameInput"
                        value={cap.name}
                        placeholder={t("hive.swarm.capNamePlaceholder")}
                        onChange={(e) => patchCap(selected.id, cap.id, { name: e.target.value })}
                      />
                      <label className="jyv-qcAuto" title={t("hive.swarm.once")}>
                        <input type="checkbox" checked={cap.once !== false} onChange={(e) => patchCap(selected.id, cap.id, { once: e.target.checked })} />
                        {t("hive.swarm.onceLabel")}
                      </label>
                      <button type="button" className="jyv-qcRemove" title={t("hive.swarm.deleteCap")} onClick={() => removeCap(selected.id, cap.id)}>✕</button>
                    </div>
                    <div className="jyv-swarmTypeRow">
                      <label className="jyv-swarmField">
                        <span>{t("hive.swarm.actionType")}</span>
                        <select value={cap.action?.type ?? "send"} onChange={(e) => patchCap(selected.id, cap.id, { action: { ...cap.action, type: e.target.value } })}>
                          <option value="send">{t("hive.swarm.actionSend")}</option>
                          <option value="spawn">{t("hive.swarm.actionSpawn")}</option>
                          <option value="notify">{t("hive.swarm.actionNotify")}</option>
                          <option value="conductor">{t("hive.swarm.actionConductor")}</option>
                        </select>
                      </label>
                      {cap.action?.type === "spawn" ? (
                        <label className="jyv-swarmField jyv-swarmFieldGrow">
                          <span>{t("hive.swarm.target")}</span>
                          <select value={cap.action?.targetBeeTypeId ?? ""} onChange={(e) => patchCap(selected.id, cap.id, { action: { ...cap.action, targetBeeTypeId: e.target.value } })}>
                            <option value="">—</option>
                            {draft.filter((b) => b.id !== selected.id).map((b) => (
                              <option key={b.id} value={b.id}>{b.name || b.id}</option>
                            ))}
                          </select>
                        </label>
                      ) : null}
                    </div>
                    <div className="jyv-swarmCapture">
                      {captureEntries.map(([varName, keyPath]) => (
                        <span key={varName} className="jyv-swarmCaptureRow">
                          <input
                            className="jyv-swarmCaptureName"
                            value={varName}
                            aria-label={t("hive.swarm.capture")}
                            onChange={(e) => {
                              const next = { ...(cap.trigger?.capture ?? {}) };
                              delete next[varName];
                              if (e.target.value) next[e.target.value] = keyPath;
                              patchCap(selected.id, cap.id, { trigger: { ...cap.trigger, capture: next } });
                            }}
                          />
                          <span>=</span>
                          <input
                            className="jyv-swarmCapturePath"
                            value={keyPath}
                            placeholder={t("hive.swarm.capturePlaceholder")}
                            onChange={(e) => patchCap(selected.id, cap.id, { trigger: { ...cap.trigger, capture: { ...(cap.trigger?.capture ?? {}), [varName]: e.target.value } } })}
                          />
                          <button
                            type="button"
                            className="jyv-qcRemove"
                            onClick={() => {
                              const next = { ...(cap.trigger?.capture ?? {}) };
                              delete next[varName];
                              patchCap(selected.id, cap.id, { trigger: { ...cap.trigger, capture: next } });
                            }}
                          >✕</button>
                        </span>
                      ))}
                      <button
                        type="button"
                        className="jyv-qcMove"
                        title={t("hive.swarm.capture")}
                        onClick={() => {
                          const name = "V" + (captureEntries.length + 1);
                          patchCap(selected.id, cap.id, { trigger: { ...cap.trigger, capture: { ...(cap.trigger?.capture ?? {}), [name]: "" } } });
                        }}
                      >+</button>
                    </div>
                    <input
                      className="jyv-qcPromptInput jyv-swarmDesc"
                      value={cap.trigger?.filePredicate ?? ""}
                      placeholder={t("hive.swarm.filePredicatePlaceholder")}
                      onChange={(e) => patchCap(selected.id, cap.id, { trigger: { ...cap.trigger, filePredicate: e.target.value } })}
                    />
                    {cap.action?.type === "send" || cap.action?.type === "spawn" ? (
                      <div>
                        <textarea
                          className="jyv-qcPromptInput"
                          rows={Math.min(6, Math.max(2, String(cap.action?.promptTemplate ?? "").split("\n").length))}
                          value={cap.action?.promptTemplate ?? ""}
                          placeholder={t("hive.swarm.promptPlaceholder")}
                          onChange={(e) => patchCap(selected.id, cap.id, { action: { ...cap.action, promptTemplate: e.target.value } })}
                        />
                        {vars.length ? (
                          <div className="jyv-swarmInsert">
                            {vars.map((v) => (
                              <button
                                key={v}
                                type="button"
                                className="jyv-qcMove"
                                title={t("hive.swarm.insertVar").replace("{v}", v)}
                                onClick={() => patchCap(selected.id, cap.id, { action: { ...cap.action, promptTemplate: String(cap.action?.promptTemplate ?? "") + "{" + v + "}" } })}
                              >{"{" + v + "}"}</button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
          <div className="jyv-qcActions">
            {error ? <span className="jyv-qcError" role="alert">{error}</span> : null}
            {dirty && !error ? <span className="jyv-qcDirty">{t("hive.swarm.dirty")}</span> : null}
            <button type="button" className="jyv-qcSave" disabled={saving} onClick={save}>{saving ? t("hive.qc.saving") : t("hive.qc.save")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 页内设置模态（context-hotbar-rework 4.1 左纵排改版）：遮罩 + 居中面板 +
 *  左 nav rail（场景/外观/布局，上下/Home/End roving tabindex）+ 右内容滚动区。
 *  自绘框架（不 import 官方组件、不经 createPortal——bundle 纯净门），样式全走
 *  --dsw-alias-* token；「布局」节提供右侧/底部阵列 m×n 显示参数（localStorage）。 */
function HiveSettingsModal({ t, settings, setSettings, guardRef, onClose }) {
  const [section, setSection] = useState("scene");

  /* 关闭请求统一入口：设置即时生效无脏态 → 直接关。
     页级 Esc 分层（模态栈）经 useModalGuard 复用同一入口；✕/遮罩同路。 */
  const requestClose = () => {
    onClose();
  };
  useModalGuard("settings", guardRef, requestClose);

  return (
    <RailModal
      t={t}
      title={t("hive.settings.title")}
      closeLabel={t("hive.settings.close")}
      sections={[
        { key: "scene", icon: "◇", label: t("hive.settings.navScene") },
        { key: "appearance", icon: "✦", label: t("hive.settings.navAppearance") },
        { key: "layout", icon: "▦", label: t("hive.settings.navLayout") }
      ]}
      active={section}
      onNavigate={setSection}
      requestClose={requestClose}
    >
      <div className="jyv-modalBody" role="tabpanel" id="jyv-railPanel-scene" aria-labelledby="jyv-railTab-scene" hidden={section !== "scene"}>
        <SceneSettingsBody t={t} settings={settings} setSettings={setSettings} />
      </div>
      <div className="jyv-modalBody" role="tabpanel" id="jyv-railPanel-appearance" aria-labelledby="jyv-railTab-appearance" hidden={section !== "appearance"}>
        <AppearanceSettingsBody t={t} settings={settings} setSettings={setSettings} />
      </div>
      <div className="jyv-modalBody" role="tabpanel" id="jyv-railPanel-layout" aria-labelledby="jyv-railTab-layout" hidden={section !== "layout"}>
        <LayoutSettingsBody t={t} settings={settings} setSettings={setSettings} />
      </div>
    </RailModal>
  );
}

/* ── 左纵排模态共用骨架（context-hotbar-rework D9）：设置模态与指令编辑模态
      同一套 overlay+mask+panel+nav rail+内容滚动区。 ── */

/** 模态守卫：guardRef 上抛关闭请求 + 注册进模态打开序栈（Esc 同层按打开序消费）。 */
function useModalGuard(id, guardRef, requestClose) {
  useEffect(() => {
    guardRef.current = requestClose;
    pushModalEntry(id, requestClose);
    return () => {
      guardRef.current = null;
      removeModalEntry(id);
    };
  });
}

function RailModal({ t, title, closeLabel, sections, active, onNavigate, requestClose, children }) {
  const navRefs = useRef({});
  const onNavKeyDown = (e) => {
    const order = sections.map((s) => s.key);
    const idx = order.indexOf(active);
    let to = null;
    if (e.key === "ArrowDown") to = order[(idx + 1) % order.length];
    else if (e.key === "ArrowUp") to = order[(idx + order.length - 1) % order.length];
    else if (e.key === "Home") to = order[0];
    else if (e.key === "End") to = order[order.length - 1];
    if (to) {
      e.preventDefault();
      onNavigate(to);
      navRefs.current[to]?.focus?.();
    }
  };
  return (
    <div className="jyv-modalBack" onClick={requestClose}>
      <div className="jyv-modal jyv-railModal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="jyv-modalHead">
          <span className="jyv-modalTitle">{title}</span>
          <button type="button" className="jyv-toolBtn" title={closeLabel} onClick={requestClose}>×</button>
        </div>
        <div className="jyv-railBody">
          <div className="jyv-railNav" role="tablist" aria-label={title} aria-orientation="vertical" onKeyDown={onNavKeyDown}>
            {sections.map((s) => (
              <button
                key={s.key}
                type="button"
                ref={(el) => (navRefs.current[s.key] = el)}
                role="tab"
                id={"jyv-railTab-" + s.key}
                aria-selected={active === s.key}
                aria-controls={"jyv-railPanel-" + s.key}
                tabIndex={active === s.key ? 0 : -1}
                className={"jyv-railItem" + (active === s.key ? " jyv-railItemOn" : "")}
                onClick={() => onNavigate(s.key)}
              >
                <span className="jyv-railIcon" aria-hidden="true">{s.icon}</span>
                <span className="jyv-railLabel">{s.label}</span>
              </button>
            ))}
          </div>
          <div className="jyv-railContent">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 场景节（4.2）：原「场景显示」的场景组控件归位（动画/无人机/水印/快捷键/跟随）。 */
function SceneSettingsBody({ t, settings, setSettings }) {
  const patch = (p) => setSettings?.(p);
  return (
    <div className="jyv-settings">
      <SetRow label={t("hive.settings.renderer")} hint={t("hive.settings.rendererHint")}>
        <SetSelect
          value={settings?.renderer ?? "webgl"}
          options={[["webgl", t("hive.settings.rendererWebgl")], ["fallback2d", t("hive.settings.renderer2d")]]}
          onChange={(v) => patch({ renderer: v })}
        />
      </SetRow>
      <SetRow label={t("hive.settings.showFps")} hint={t("hive.settings.showFpsHint")}>
        <SetToggle value={settings?.showFps !== false} onChange={(v) => patch({ showFps: v })} />
      </SetRow>
      <SetRow label={t("hive.settings.anim")} hint={t("hive.settings.animHint")}>
        <SetSelect
          value={settings?.animation ?? "full"}
          options={[["full", t("hive.anim.full")], ["force", t("hive.anim.force")], ["reduced", t("hive.anim.reduced")]]}
          onChange={(v) => patch({ animation: v })}
        />
      </SetRow>
      {/* 相机俯角滑杆（相机手势重排 4.2/D3）：15–70、步长 1、默认 38；调整即时生效
          （scene.setSettings → rig.setPitchDeg 既有链路）并随页签设置持久化。 */}
      <SetRow label={t("hive.settings.cameraPitch")} hint={t("hive.settings.cameraPitchHint")}>
        <SetSlider value={settings?.cameraPitchDeg ?? 45} min={15} max={70} step={1} format={(v) => v + "°"} onChange={(v) => patch({ cameraPitchDeg: v })} />
      </SetRow>
      {/* 无人机显隐（drone-active-visibility）：仅活跃（默认）| 全部显示 */}
      <SetRow label={t("hive.settings.drones")}>
        <SetSelect
          value={settings?.drones ?? "active-only"}
          options={[["active-only", t("hive.drones.activeOnly")], ["all", t("hive.drones.all")]]}
          onChange={(v) => patch({ drones: v })}
        />
      </SetRow>
      <SetRow label={t("hive.settings.watermark")}>
        <SetToggle value={(settings?.watermark ?? "show") === "show"} onChange={(v) => patch({ watermark: v ? "show" : "hide" })} />
      </SetRow>
      <SetRow label={t("hive.settings.hotkey")}>
        <SetSelect
          value={settings?.hotkey ?? "alt+h"}
          options={[["alt+h", t("hive.hotkey.alt")], ["ctrl+alt+h", t("hive.hotkey.ctrl")], ["off", t("hive.hotkey.off")]]}
          onChange={(v) => patch({ hotkey: v })}
        />
      </SetRow>
      <SetRow label={t("hive.settings.follow")} hint={t("hive.settings.followHint")}>
        <SetToggle value={Boolean(settings?.followCurrent)} onChange={(v) => patch({ followCurrent: v })} />
      </SetRow>
      <SetRow label={t("hive.settings.batchSendConfirm")} hint={t("hive.settings.batchSendConfirmHint")}>
        <SetToggle value={settings?.batchSendConfirm !== false} onChange={(v) => patch({ batchSendConfirm: v })} />
      </SetRow>
    </div>
  );
}

/** 外观节（4.2）：原「场景显示」的外观分组归位（墙体/配色/饰条），即时生效。 */
function AppearanceSettingsBody({ t, settings, setSettings }) {
  const patch = (p) => setSettings?.(p);
  /* 外观：缺省键以 APPEARANCE_DEFAULTS 兜底（rev 门控见 store——旧存档自动落新默认） */
  const appearance = { ...APPEARANCE_DEFAULTS, rev: APPEARANCE_REV, ...(settings?.appearance ?? {}) };
  const patchAppearance = (p) => patch({ appearance: { ...appearance, ...p } });
  return (
    <div className="jyv-settings">
      <SetGroup label={t("hive.appearance.chromeGroup")} />
      <SetRow label={t("hive.appearance.chrome")} hint={t("hive.appearance.chromeHint")}>
        <SetSelect
          value={CHROME_SCHEMES.includes(settings?.chromeScheme) ? settings.chromeScheme : "default"}
          onChange={(v) => patch({ chromeScheme: v })}
          options={[
            ["default", t("hive.appearance.chromeDefault")],
            ["amber", t("hive.appearance.chromeAmber")],
            ["indigo", t("hive.appearance.chromeIndigo")],
            ["cyan", t("hive.appearance.chromeCyan")],
            ["magenta", t("hive.appearance.chromeMagenta")],
            ["frost", t("hive.appearance.chromeFrost")]
          ]}
        />
      </SetRow>
      <SetGroup label={t("hive.appearance.groupWall")} />
      <SetRow label={t("hive.appearance.wallOuter")} hint={t("hive.appearance.wallOuterHint")}>
        <SetSlider value={appearance.outerWallAlpha} min={0.05} max={1} step={0.05} format={(v) => Math.round(v * 100) + "%"} onChange={(v) => patchAppearance({ outerWallAlpha: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.wallInner")} hint={t("hive.appearance.wallInnerHint")}>
        <SetSlider value={appearance.innerWallAlpha} min={0.02} max={1} step={0.02} format={(v) => Math.round(v * 100) + "%"} onChange={(v) => patchAppearance({ innerWallAlpha: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.innerTrim")} hint={t("hive.appearance.innerTrimHint")}>
        <SetSlider value={appearance.innerTrimAlpha} min={0} max={1} step={0.05} format={(v) => Math.round(v * 100) + "%"} onChange={(v) => patchAppearance({ innerTrimAlpha: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.trimGlow")} hint={t("hive.appearance.trimGlowHint")}>
        <SetSlider value={appearance.trimGlow} min={0} max={4} step={0.1} format={(v) => "×" + Number(v).toFixed(1)} onChange={(v) => patchAppearance({ trimGlow: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.wallGold")}>
        <SetColor value={appearance.wallGold} onChange={(v) => patchAppearance({ wallGold: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.trimColor")}>
        <SetColor value={appearance.trimColor} onChange={(v) => patchAppearance({ trimColor: v })} />
      </SetRow>
      <SetGroup label={t("hive.appearance.groupFloor")} />
      <SetRow label={t("hive.appearance.floorBase")}>
        <SetColor value={appearance.floorBase} onChange={(v) => patchAppearance({ floorBase: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.floorLine")}>
        <SetColor value={appearance.floorLine} onChange={(v) => patchAppearance({ floorLine: v })} />
      </SetRow>
      <SetGroup label={t("hive.appearance.groupPad")} />
      <SetRow label={t("hive.appearance.padBase")}>
        <SetColor value={appearance.padBase} onChange={(v) => patchAppearance({ padBase: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.padInner")}>
        <SetColor value={appearance.padInner} onChange={(v) => patchAppearance({ padInner: v })} />
      </SetRow>
      <SetGroup label={t("hive.appearance.groupAccent")} />
      <SetRow label={t("hive.appearance.outline")}>
        <SetColor value={appearance.outlineColor} onChange={(v) => patchAppearance({ outlineColor: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.amber")}>
        <SetColor value={appearance.amberColor} onChange={(v) => patchAppearance({ amberColor: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.mote")}>
        <SetColor value={appearance.moteColor} onChange={(v) => patchAppearance({ moteColor: v })} />
      </SetRow>
      <SetGroup label={t("hive.appearance.groupSky")} />
      <SetRow label={t("hive.appearance.skyTop")}>
        <SetColor value={appearance.skyTop} onChange={(v) => patchAppearance({ skyTop: v })} />
      </SetRow>
      <SetRow label={t("hive.appearance.horizon")}>
        <SetColor value={appearance.horizonGlow} onChange={(v) => patchAppearance({ horizonGlow: v })} />
      </SetRow>
    </div>
  );
}

/** 布局节（4.3）：右侧蜂群阵列 m、n 与底部道具栏阵列 m、n 四个显示参数；
 *  调整即时生效（覆盖面板与道具栏网格即时重排）并随页签设置持久化
 *  （localStorage，不入布局文档）；「恢复默认」一并覆盖场景/外观/布局（spec）。 */
function LayoutSettingsBody({ t, settings, setSettings }) {
  const patch = (p) => setSettings?.(p);
  const layout = sanitizeLayout(settings?.layout);
  const patchLayout = (p) => patch({ layout: { ...layout, ...p } });
  return (
    <div className="jyv-settings">
      <SetGroup label={t("hive.settings.layoutPanelGroup")} />
      <SetRow label={t("hive.settings.layoutPanelM")} hint={t("hive.settings.layoutHint")}>
        <SetSlider value={layout.panelM} min={PANEL_LIMITS.m[0]} max={PANEL_LIMITS.m[1]} step={1} format={(v) => String(v)} onChange={(v) => patchLayout({ panelM: v })} />
      </SetRow>
      <SetRow label={t("hive.settings.layoutPanelN")}>
        <SetSlider value={layout.panelN} min={PANEL_LIMITS.n[0]} max={PANEL_LIMITS.n[1]} step={1} format={(v) => String(v)} onChange={(v) => patchLayout({ panelN: v })} />
      </SetRow>
      <SetGroup label={t("hive.settings.layoutBarGroup")} />
      <SetRow label={t("hive.settings.layoutBarM")} hint={t("hive.settings.layoutHint")}>
        <SetSlider value={layout.barM} min={BAR_LIMITS.m[0]} max={BAR_LIMITS.m[1]} step={1} format={(v) => String(v)} onChange={(v) => patchLayout({ barM: v })} />
      </SetRow>
      <SetRow label={t("hive.settings.layoutBarN")}>
        <SetSlider value={layout.barN} min={BAR_LIMITS.n[0]} max={BAR_LIMITS.n[1]} step={1} format={(v) => String(v)} onChange={(v) => patchLayout({ barN: v })} />
      </SetRow>
      <SetGroup label={t("hive.settings.reportGroup")} />
      <SetRow label={t("hive.settings.reportRows")} hint={t("hive.settings.reportRowsHint")}>
        <SetSlider value={sanitizeReportRows(settings.reportRows)} min={REPORT_ROWS_LIMIT[0]} max={REPORT_ROWS_LIMIT[1]} step={1} format={(v) => String(v)} onChange={(v) => patch({ reportRows: v })} />
      </SetRow>
      <div className="jyv-setActions">
        <button
          type="button"
          className="jyv-setReset"
          onClick={() =>
            patch({
              animation: "full",
              watermark: "show",
              drones: "active-only",
              hotkey: "alt+h",
              followCurrent: true, // 跟随默认开（hive-marquee-and-card-rework 1.1；恢复默认 = 新默认值）
              renderer: "webgl",
              reportCollapsed: false, // 作战报告面板展开态（hive-combat-log，沿 showFps 先例覆盖）
              reportRows: 8, // 作战报告面板可视行数默认（hive-combat-log）
              cameraPitchDeg: 45, // 俯角默认（二轮定稿 45）
              rightDragSpin: false, // 右键旋转默认关 = 全向平移（D4）
              batchSendConfirm: true, // 批量发送人工确认默认开（bee-status-cards D6）
              appearance: { ...APPEARANCE_DEFAULTS, rev: APPEARANCE_REV },
              layout: { ...LAYOUT_DEFAULTS }
            })
          }
        >
          {t("hive.settings.resetAll")}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * FPS 计数器（用户定稿：页面左上角，了解当前帧率）：
 * rAF 独立计数（与场景渲染循环解耦——降级态也显示），每 500ms 刷新一次读数。
 * ------------------------------------------------------------------ */

function FpsMeter() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    const tick = (now) => {
      frames += 1;
      if (now - last >= 500) {
        const fps = Math.round((frames * 1000) / (now - last));
        if (ref.current) ref.current.textContent = String(fps) + " FPS";
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref} className="jyv-fps">-- FPS</div>;
}

/* ------------------------------------------------------------------ *
 * 情境道具栏（context-hotbar-rework 6.x）：
 *  - 门控：resolveHotbarKind 三态互斥（外壳传入 kind；null 不渲染）；
 *  - 固定阵列：CSS grid m×n（布局参数），槽位按配置序填充，紧凑呈现
 *    （无空位占位卡），超出容量的槽位不渲染（配置保留）；
 *  - slots 语义 = 有效槽位（hotbar-default-actions 3.1）：外壳经
 *    effectiveHotbarSlots 派生——空栏注入整组内置默认卡（builtin 标记驱动
 *    「内置」角标，收回提示挂角标自身 title，卡体 title 保持动作语义）；
 *  - 点击语义：蜂栏 = 双通道（未勾追加+浮窗 / 勾选直发）+ 动作默认卡
 *    （归档/打开，action 判别，外壳分派）；巢栏 = 召唤；地板栏 = 建巢
 *    （经官方选择器）；默认卡与用户卡同 handler 同门控。
 * ------------------------------------------------------------------ */

function HotbarBar({ t, kind, slots, layout, bridgeReady, disabled, summonBusy, floorBusy, onSlot }) {
  if (!kind) return null;
  const cols = Math.max(1, layout.barM);
  const rows = Math.max(1, layout.barN);
  const capacity = cols * rows;
  const visible = slots.slice(0, capacity);
  /* 紧凑渲染（用户定稿，与蜂群面板同语义）：无空位占位卡——可见行数 =
     ⌈槽位数/m⌉ 封顶 n（CSS max-height），条宽 = min(槽位数, m)；槽位数 0 → 不渲染。 */
  if (visible.length === 0) return null;
  const colsShown = Math.min(visible.length, cols);
  /* 角标悬停提示按呈现分型：常驻栏（蜂栏）说明常驻语义，回退栏说明收回规则 */
  const builtinHint = t(HOTBAR_RESIDENT_KINDS.includes(kind)
    ? "hive.bar.defaults.hintResident"
    : "hive.bar.defaults.hint");
  return (
    <div
      className="jyv-hotbar"
      role="group"
      aria-label={t("hive.bar.aria." + kind)}
      data-kind={kind}
      style={{ "--jyv-hb-cols": colsShown, "--jyv-hb-rows": rows }}
    >
      {visible.map((slot) => {
        const prompt = String(slot.prompt ?? "");
        const empty = !prompt.trim();
        let blocked = disabled;
        let title = prompt;
        if (kind === "bee") {
          if (slot.action) {
            /* 动作默认卡（归档/打开，用户定稿卡组）：非提示词语义——
               不受桥就绪/空提示词门控，卡体 title 承载归档警示/打开说明 */
            title = slot.action === "archive"
              ? t("hive.bar.defaults.beeArchiveTitle")
              : t("hive.bar.defaults.beeOpenTitle");
          } else {
            blocked = blocked || empty || (slot.autoSend !== true && !bridgeReady);
          }
        } else if (kind === "hive") {
          /* 召唤关闭 → 卡禁用（预留后续巢级动作，spec） */
          blocked = blocked || slot.summon !== true || summonBusy;
          title = slot.summon === true ? prompt || t("hive.bar.pureSummon") : t("hive.bar.summonOff");
        } else {
          blocked = blocked || floorBusy;
          title = prompt || t("hive.bar.floorHint");
        }
        return (
          <button
            key={slot.id}
            type="button"
            className="jyv-hbCard"
            data-auto={slot.autoSend === true || undefined}
            data-action={slot.action || undefined}
            data-busy={(kind === "hive" && summonBusy) || (kind === "floor" && floorBusy) || undefined}
            disabled={blocked}
            title={title}
            onClick={() => onSlot(slot)}
          >
            {kind === "hive" ? <span className="jyv-hbGlyph" aria-hidden="true">🥚</span> : null}
            {kind === "floor" ? <span className="jyv-hbGlyph" aria-hidden="true">⬡</span> : null}
            {slot.autoSend === true ? <span className="jyv-hbBolt" aria-hidden="true">⚡</span> : null}
            {/* 内置角标（hotbar-default-actions 3.2，审阅 F1）：独立 span 自带提示，
                不覆盖卡体 title（卡体保持提示词/归档警示/建巢提示等动作语义） */}
            {slot.builtin === true ? (
              <span className="jyv-hbBuiltin" title={builtinHint}>{t("hive.bar.defaults.badge")}</span>
            ) : null}
            <span className="jyv-hbName">{slot.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 工蜂阵列覆盖面板（context-hotbar-rework 7.x，D2/D7/D8；hive-marquee-and-card-rework
 * 4.1/4.4 双数据源 + 16:9 卡）：
 *  - 双数据源：studio（巢选中，蜂位格序 cellIndex）/ marquee（框选多选集，投影序
 *    冻结数组，头部「已选 N 只」，无占位卡）；无人机不出卡（降级停驻蜂滤除）；
 *  - 卡片 114×64（16:9）左图右文：左列 48px 模型渲染区（外观 × 状态色快照，5.3
 *    组合键取图）+ 右列文字栈（状态色点 + 标题、todo 进度、🐝角标 + 蜂种徽章）；
 *  - 超容量纵向滚动（全量可见），studio 模式容量内空位末行占位卡不接受点击；空巢空态；
 *  - 点卡跳蜂：studio = 清巢跳蜂；marquee = 清多选 + 跳蜂（语义同 3D 点蜂）。
 * ------------------------------------------------------------------ */

function WorkerPanel({ t, studio, marquee, layout, assignments, beeTypes, previews, onPickBee }) {
  const marqueeMode = Array.isArray(marquee);
  if (!marqueeMode && !studio) return null;
  const cols = Math.max(1, layout.panelM);
  const rows = Math.max(1, layout.panelN);
  const beeTypeNameOf = (typeId) => beeTypes.find((bt) => bt.id === typeId)?.name ?? "";
  /* 3D 模型预览（hive-interaction-polish；5.3 键迁移）：按蜂种绑定解析外观模型 id
     （未绑定/未知 → 默认外观），取键 `${modelId}:${state}` 快照 dataURL——变体未就绪/
     未生成 → 无图，卡片降级为纯文字（SHALL NOT 阻塞其余卡片）。 */
  const beeModelIdOf = (typeId) => {
    const beeType = beeTypes.find((bt) => bt.id === typeId);
    return beeType && BEE_APPEARANCE_MODELS.includes(beeType.beeModel) ? beeType.beeModel : DEFAULT_APPEARANCE_MODEL;
  };
  /* 蜂数据：marquee = 投影序冻结数组（松手时刻 y→x，不随镜头重排，内容实时跟随镜像）；
     studio = 蜂位格序 + 无人机滤除（既有）。 */
  const bees = marqueeMode
    ? marquee
    : (studio.bees ?? [])
        .filter((bee) => !bee.droneStandIn)
        .slice()
        .sort((a, b) => (a.cellIndex ?? 0) - (b.cellIndex ?? 0));
  /* 占位卡只补齐最后一行（studio 模式既有定稿）；marquee 模式 SHALL NOT 呈现占位卡。 */
  const remainder = bees.length % cols;
  const placeholders = marqueeMode || remainder === 0 ? 0 : cols - remainder;
  return (
    <div
      className="jyv-workerPanel"
      data-mode={marqueeMode ? "marquee" : "studio"}
      data-empty={bees.length === 0 || undefined}
      style={{ "--jyv-wp-cols": cols, "--jyv-wp-rows": rows }}
    >
      <div className="jyv-wpHead">
        {marqueeMode ? (
          <span className="jyv-wpCount">{t("hive.panel.selected").replace("{n}", String(bees.length))}</span>
        ) : (
          <span className="jyv-wpCount">
            {bees.length}/{studio.capacity ?? bees.length}
          </span>
        )}
      </div>
      {bees.length === 0 ? (
        <div className="jyv-wpEmpty">{t("hive.panel.empty")}</div>
      ) : (
        <div className="jyv-wpGrid">
          {bees.map((bee) => {
            const typeId = assignments?.[bee.sessionId] ?? "";
            const typeName = typeId ? beeTypeNameOf(typeId) : "";
            const state = bee.state ?? "idle";
            const preview = previews?.[beeModelIdOf(typeId) + ":" + state] ?? null;
            const droneTotal = bee.drones?.length ?? 0;
            return (
              <button
                key={bee.sessionId}
                type="button"
                className={"jyv-wpCard jyv-state-" + state}
                title={bee.displayTitle ?? ""}
                onClick={() => onPickBee(bee.sessionId)}
              >
                <span className="jyv-wpFig">
                  {preview ? <img className="jyv-wpPreview" src={preview} alt="" draggable={false} /> : null}
                </span>
                <span className="jyv-wpBody">
                  <span className="jyv-wpCardHead">
                    <span className={"jyv-legendDot jyv-state-" + state} />
                    <span className="jyv-wpName">{bee.displayTitle ?? bee.sessionId}</span>
                  </span>
                  {bee.todos ? (
                    <span className="jyv-wpTodos">
                      <span className="jyv-cardTodosBar">
                        <span style={{ width: Math.round((bee.todos.done / Math.max(1, bee.todos.total)) * 100) + "%" }} />
                      </span>
                      <span className="jyv-wpTodosVal">
                        {bee.todos.done}/{bee.todos.total}
                      </span>
                    </span>
                  ) : null}
                  {droneTotal > 0 || typeName ? (
                    <span className="jyv-wpMeta">
                      {droneTotal > 0 ? (
                        <span
                          className="jyv-wpDrones"
                          title={t("hive.panel.drones").replace("{a}", String(bee.activeDroneCount ?? 0)).replace("{n}", String(droneTotal))}
                        >
                          🐝{bee.activeDroneCount ?? 0}/{droneTotal}
                        </span>
                      ) : null}
                      {typeName ? <span className="jyv-wpBadge">{typeName}</span> : null}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
          {Array.from({ length: placeholders }, (_, i) => (
            <div key={"ph-" + i} className="jyv-wpCard jyv-wpPlaceholder" aria-hidden="true" />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
 * 框选矩形层（hive-marquee-and-card-rework 2.3）：canvasWrap 内 absolute 覆盖
 * div——accent 描边 + 低透明填充、pointer-events:none（SHALL NOT 参与画布拾取）。
 * 矩形更新走 marqueeRectStore 订阅 + 命令式 style 写入（拖拽 pointermove 高频
 * 路径零 React 重渲染）；结束/取消随 onMarqueeRect(null) 隐藏。
 * ------------------------------------------------------------------ */

function MarqueeOverlay() {
  const ref = useRef(null);
  useEffect(
    () =>
      marqueeRectStore.subscribe(() => {
        const el = ref.current;
        if (!el) return;
        const rect = marqueeRectStore.rect;
        if (!rect) {
          el.style.display = "none";
          return;
        }
        el.style.display = "block";
        el.style.left = rect.x0 + "px";
        el.style.top = rect.y0 + "px";
        el.style.width = Math.max(0, rect.x1 - rect.x0) + "px";
        el.style.height = Math.max(0, rect.y1 - rect.y0) + "px";
      }),
    []
  );
  return <div ref={ref} className="jyv-marquee" style={{ display: "none" }} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ *
 * 作战报告面板（hive-combat-log 4.1/D6）：canvasWrap 内左下角可收起浮层。
 *  - 展开态 = 头部（标题 + 「显示低优先级」过滤开关 + 收起钮）+ 滚动列表（新行置顶）；
 *  - 折叠态 = 带未读数的小胶囊（点击展开）；空态文案；
 *  - 折叠/展开同步 feed.setCollapsed（未读只在折叠期累计），折叠态持久化走
 *    settings.reportCollapsed（沿 showFps 先例）；过滤开关为页内临时态不持久化。
 * ------------------------------------------------------------------ */

function CombatLogRow({ t, entry }) {
  const name = entry.name ?? "";
  let verb = "";
  const body = [];
  switch (entry.kind) {
    case EV_KIND.enterWorker:
      verb = t("hive.report.enterWorker").replace("{name}", name);
      break;
    case EV_KIND.start:
      verb = t("hive.report.start").replace("{name}", name);
      break;
    case EV_KIND.done:
      verb = t("hive.report.done").replace("{name}", name);
      break;
    case EV_KIND.help:
      verb = t("hive.report.help").replace("{name}", name);
      break;
    case EV_KIND.dronesNew:
      verb = t("hive.report.dronesNew").replace("{n}", String(entry.count ?? 0));
      break;
    case EV_KIND.dronesDone:
      verb = t("hive.report.dronesDone").replace("{n}", String(entry.count ?? 0));
      break;
    case EV_KIND.archive:
      verb = t("hive.report.archive");
      break;
    case EV_KIND.newNest:
      verb = t("hive.report.newNest").replace("{title}", entry.title ?? "");
      break;
    case EV_KIND.nestMove:
      verb = t("hive.report.nestMove").replace("{title}", entry.title ?? "");
      break;
    case EV_KIND.wildBee:
      verb = t("hive.report.wildBee").replace("{name}", name);
      break;
    case EV_KIND.receipt:
      verb = toastText(t, entry.text ?? "");
      break;
    default:
      verb = "";
  }
  const d = new Date(entry.ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  /* 巢级别/野蜂/回执事件不带巢名前缀（新巢、搬离、野蜂本身即巢级或野蜂语义）；
     工蜂/无人机/归档等「某巢行动」统一在行首补巢名 {title}。 */
  const hasTitle =
    entry.title != null &&
    entry.title !== "" &&
    entry.kind !== EV_KIND.newNest &&
    entry.kind !== EV_KIND.nestMove &&
    entry.kind !== EV_KIND.wildBee &&
    entry.kind !== EV_KIND.receipt;
  return (
    <div className="jyv-combatRow" data-kind={entry.kind} data-low={entry.low ? "true" : undefined}>
      <span className="jyv-combatTime">{hh}:{mm}</span>
      {hasTitle ? <span className="jyv-combatTitle">[{entry.title}]</span> : null}
      <span className="jyv-combatVerb">{verb}</span>
      {body.length ? <span className="jyv-combatBody">{body}</span> : null}
    </div>
  );
}

function CombatLogPanel({ t, ctl, settings, setSettings }) {
  const feed = ctl().feed();
  const version = useSyncExternalStore(
    (listener) => (feed ? feed.subscribe(listener) : () => {}),
    () => (feed ? feed.getSnapshot() : 0)
  );
  const [showLow, setShowLow] = useState(true); // 页内临时态，不持久化（D2/D6）
  const listRef = useRef(null);
  const [systemReduce, setSystemReduce] = useState(
    () => typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
  );
  useEffect(() => {
    const mq = typeof window !== "undefined" ? window.matchMedia?.("(prefers-reduced-motion: reduce)") : null;
    if (!mq) return undefined;
    const apply = () => setSystemReduce(Boolean(mq.matches));
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);
  /* 动效降级合成（复用 HivePage 三态公式）：reduced = 关闭 或（非强制开启 && 系统减动效） */
  const reduced = settings.animation === "reduced" || (settings.animation !== "force" && systemReduce);
  const collapsed = settings.reportCollapsed === true;
  const rows = sanitizeReportRows(settings.reportRows);
  if (!feed) return null;

  /* 折叠/展开切换：同步 feed.setCollapsed（未读门控）+ 持久化折叠态（D8） */
  const setCollapsed = (next) => {
    feed.setCollapsed(next);
    setSettings({ reportCollapsed: next });
  };

  const entries = feed.list();
  const visible = showLow ? entries : entries.filter((e) => !e.low);

  /* 最新报告在最下一行：版本变化（新事件入队）即滚到底，显示最新行；旧行向上翻看。 */
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [version, visible.length, collapsed]);

  return (
    <div
      className="jyv-combatLog"
      data-collapsed={collapsed ? "true" : undefined}
      data-hidelow={showLow ? undefined : "true"}
      data-reduced={reduced ? "true" : undefined}
      style={{ "--jyv-report-rows": rows }}
    >
      {collapsed ? (
        <button
          type="button"
          className="jyv-combatLogPill"
          title={t("hive.report.expand").replace("{n}", String(feed.unread))}
          aria-label={t("hive.report.expand").replace("{n}", String(feed.unread))}
          onClick={() => setCollapsed(false)}
        >
          ⚔ {t("hive.report.title")}
          {feed.unread > 0 ? <span className="jyv-combatLogBadge">{feed.unread}</span> : null}
        </button>
      ) : (
        <>
          <div className="jyv-combatLogHead">
            <span className="jyv-combatLogTitle">{t("hive.report.title")}</span>
            <label className="jyv-combatLogFilter" title={t("hive.report.filterLow")}>
              <input
                type="checkbox"
                checked={showLow}
                onChange={(e) => setShowLow(e.target.checked)}
              />
              {showLow ? t("hive.report.filterLowOn") : t("hive.report.filterLow")}
            </label>
            <button
              type="button"
              className="jyv-combatLogClear"
              title={t("hive.report.clear")}
              aria-label={t("hive.report.clear")}
              onClick={() => feed.clear()}
            >
              🗑
            </button>
            <button
              type="button"
              className="jyv-combatLogClose"
              title={t("hive.report.collapse")}
              aria-label={t("hive.report.collapse")}
              onClick={() => setCollapsed(true)}
            >
              ×
            </button>
          </div>
          {visible.length === 0 ? (
            <div className="jyv-combatLogEmpty">{t("hive.report.empty")}</div>
          ) : (
            <div className="jyv-combatLogList" ref={listRef}>
              {visible.map((entry) => (
                <CombatLogRow key={entry.seq} t={t} entry={entry} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 完成状态栏（bee-status-cards 3.x/4.x，design D1/D2/D5/D7）：
 *  - canvasWrap 内左缘垂直居中层（.jyv-statusBar），max-height 滚动；
 *  - 逐蜂种完成池卡片 + 默认蜂末位卡，实时数（worldVersion 驱动派生）；
 *  - 点卡体循环选蜂（稳定序游标取模）；已配置发送按钮批量派发（快照 → 阀门
 *    → 顺序直发 → toast 汇总）；确认弹窗走 useModalGuard 进 Esc 分层。
 * ------------------------------------------------------------------ */

function StatusBar({ t, ctl, settings, beeTypes, assignments, statusCards, notify, disabled }) {
  const worldVersion = useSyncExternalStore(
    (listener) => worldVersionStore.subscribe(listener),
    () => worldVersionStore.getSnapshot()
  );
  void worldVersion; // 订阅即目的：世界派生 tick 时重算完成池

  /* 动效降级合成（与 CombatLogPanel 同款三态公式）：reduced = 关闭 或（非强制 && 系统减动效）。 */
  const [systemReduce, setSystemReduce] = useState(
    () => typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
  );
  useEffect(() => {
    const mq = typeof window !== "undefined" ? window.matchMedia?.("(prefers-reduced-motion: reduce)") : null;
    if (!mq) return undefined;
    const apply = () => setSystemReduce(Boolean(mq.matches));
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);
  const reduced = settings.animation === "reduced" || (settings.animation !== "force" && systemReduce);

  const world = ctl().actions.getScene?.()?.world ?? null;
  const sessionsState = ctl().actions.sessionsSnapshot?.() ?? null;
  const pool = completionPool(world, assignments, sessionsState);

  /* 报告让位 reserve（design D2）：收起 = pill 高；展开 = rows×24 + 头部 + 边距。 */
  const reservePx = statusBarReserve({ reportCollapsed: settings.reportCollapsed === true, reportRows: settings.reportRows });

  /* 循环选蜂游标：per 卡 ref（design D7，不跨页持久）。key = 蜂种 id。 */
  const cursorsRef = useRef({});

  /* 批量发送编排态：{ typeId, sending, pending, snapshot } 一次一组。 */
  const [sendState, setSendState] = useState(null);
  const [confirm, setConfirm] = useState(null); // { typeId, prompt, targets } | null

  const cards = [
    ...beeTypes.map((bt) => ({ typeId: bt.id, name: bt.name || bt.id })),
    { typeId: "default", name: t("hive.status.default") }
  ];

  /* 卡体点击 → 循环选蜂（D7）。空池 no-op。 */
  const pickBee = (typeId) => {
    const sessions = completionSessions(pool, typeId);
    if (sessions.length === 0) return;
    const cursor = advanceCursor(sessions.length, cursorsRef.current[typeId] ?? 0);
    cursorsRef.current[typeId] = cursor;
    ctl().actions.clearSelection?.();
    ctl().actions.selectBee(sessions[cursor]);
  };

  /* 批量发送（D5）：快照 → 阀门分流 → 顺序直发 → toast 汇总。in-flight 锁。 */
  const runBatch = async (typeId) => {
    const cfg = statusCards?.[typeId];
    if (!cfg || !String(cfg.prompt ?? "").trim()) return;
    const snapshot = snapshotSessions(pool, typeId);
    if (snapshot.length === 0) {
      notify(t("hive.status.toastNone"), "err");
      return;
    }
    const valved = cfg.autoSend !== true && settings.batchSendConfirm !== false;
    if (valved) {
      setConfirm({ typeId, prompt: cfg.prompt, targets: snapshot });
      return;
    }
    await deliver(typeId, snapshot);
  };

  const cancelConfirm = () => {
    setConfirm(null);
  };
  /* 确认弹窗 Esc 层：仅挂载（confirm 非空）时注册请求关闭 = 放弃发送；取消/✕/遮罩
     同路（复用 cancelConfirm）。Esc = 取消 = 放弃本次发送（spec）。 */
  useEffect(() => {
    if (!confirm) return undefined;
    pushModalEntry("statusConfirm", cancelConfirm);
    return () => removeModalEntry("statusConfirm");
  }, [confirm]);

  const deliver = async (typeId, snapshot) => {
    const cfg = statusCards?.[typeId];
    setSendState({ typeId, sending: true });
    let okCount = 0;
    let failCount = 0;
    for (const sessionId of snapshot) {
      const result = await sendCommand(sessionId, cfg?.prompt ?? "");
      if (result?.ok) okCount++;
      else {
        failCount++;
        console.warn("[dsh-v-hive] status-card send failed:", sessionId, result?.error);
      }
    }
    setSendState(null);
    notify(t("hive.status.toastSent").replace("{n}", String(okCount)).replace("{m}", String(failCount)), failCount > 0 ? "err" : "ok");
  };

  const confirmSend = async () => {
    const c = confirm;
    setConfirm(null);
    if (c) await deliver(c.typeId, c.targets);
  };

  if (disabled) return null;

  const allCards = cards;
  /* 完成信息总数（全部蜂种完成池之和）：≤0 时整栏向左收起，>0 时从屏幕外向右切入。 */
  const totalDone = allCards.reduce((acc, c) => acc + completionSessions(pool, c.typeId).length, 0);
  return (
    <>
      <div
        className="jyv-statusBar"
        role="group"
        aria-label={t("hive.status.aria")}
        data-hidden={totalDone <= 0 ? "true" : undefined}
        data-reduced={reduced ? "true" : undefined}
        style={{ "--jyv-statusBarBottom": "calc(76px + " + reservePx + "px)" }}
      >
        {allCards.map((card) => {
          const sessions = completionSessions(pool, card.typeId);
          const count = sessions.length;
          const cfg = statusCards?.[card.typeId];
          const configured = !!cfg && String(cfg.prompt ?? "").trim().length > 0;
          const isDefault = card.typeId === "default";
          const sending = sendState?.sending && sendState.typeId === card.typeId;
          const disabledBtn = count === 0 || sending;
          return (
            <div
              key={card.typeId}
              className={"jyv-statusCard" + (isDefault ? " jyv-statusDefault" : "")}
              title={t("hive.status.cardTitle").replace("{name}", card.name).replace("{count}", String(count))}
              onClick={() => pickBee(card.typeId)}
            >
              <span className="jyv-statusName">{card.name}</span>
              <span className={"jyv-statusCount" + (count > 0 ? " jyv-statusCountOn" : "")}>{count}</span>
              {!isDefault && configured ? (
                <button
                  type="button"
                  className="jyv-statusSend"
                  disabled={disabledBtn}
                  title={count === 0 ? t("hive.status.sendEmpty") : t("hive.status.send")}
                  onClick={(e) => {
                    e.stopPropagation();
                    runBatch(card.typeId);
                  }}
                >
                  {sending ? "…" : "➤"}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
      {confirm ? (
        <div className="jyv-modalBack jyv-statusConfirmBack" onClick={cancelConfirm}>
          <div className="jyv-modal jyv-statusConfirm" role="dialog" aria-modal="true" aria-label={t("hive.status.confirmTitle")} onClick={(e) => e.stopPropagation()}>
            <div className="jyv-modalHead">
              <span className="jyv-modalTitle">{t("hive.status.confirmTitle")}</span>
              <button type="button" className="jyv-toolBtn" title={t("hive.status.cancel")} onClick={cancelConfirm}>×</button>
            </div>
            <div className="jyv-modalBody">
              <div className="jyv-statusConfirmHint">{t("hive.status.confirmHint")} · {t("hive.status.confirmTargets")}: {confirm.targets.length}</div>
              <div className="jyv-statusConfirmLabel">{t("hive.status.confirmPrompt")}</div>
              <pre className="jyv-statusConfirmPrompt">{confirm.prompt}</pre>
            </div>
            <div className="jyv-modalHead">
              <button type="button" className="jyv-qcSave" onClick={confirmSend}>{t("hive.status.confirm")}</button>
              <button type="button" className="jyv-qcDiscard" onClick={cancelConfirm}>{t("hive.status.cancel")}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 指令编辑模态（context-hotbar-rework 5.x，D9）：页头 ⌘ 入口，左纵排四节
 * （巢栏/蜂栏/地板栏/状态卡片）。槽位列表 CRUD + 上移下移（顺序 = 展示序）+
 * 按栏裁剪编辑表单（字段联动禁用）+ 暂存-保存模型（草稿态 + 未保存标记 +
 * 一次性写入 + 409 重放）+ 校验拒绝 + 容量超出提示 + 脏草稿离开提醒；
 * 状态卡片节（bee-status-cards D4）：蜂种列表 + 唯一配置编辑（prompt/autoSend/清除）。
 * ------------------------------------------------------------------ */

/** 槽位行 id（crypto.randomUUID 优先，非安全上下文退化为时间+随机）。 */
function newSlotId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch {
    /* fallthrough */
  }
  return "slot-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

function HotbarsModal({ t, hotbars, statusCards, beeTypes, layout, guardRef, onClose, onSave }) {
  const [section, setSection] = useState("hive");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null); // { index, field, code } | { code } | null
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(() => normalizeHotbars(hotbars));
  /* 状态卡片草稿（bee-status-cards D4）：独立于槽位草稿，选中蜂种 id + 配置值 */
  const [statusDraft, setStatusDraft] = useState(() => normalizeStatusCards(statusCards, beeTypes));
  const [statusSelected, setStatusSelected] = useState(null);
  const hotbarsDirty = JSON.stringify(draft) !== JSON.stringify(normalizeHotbars(hotbars));
  const statusDirty = JSON.stringify(statusDraft) !== JSON.stringify(normalizeStatusCards(statusCards, beeTypes));
  const dirty = hotbarsDirty || statusDirty;
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;

  /* 干净草稿跟随镜像（跨页签 SSE 收敛；脏草稿仅本地——旧 commands D4 同款） */
  useEffect(() => {
    if (!hotbarsDirty) setDraft(normalizeHotbars(hotbars));
  }, [hotbars, hotbarsDirty]);
  useEffect(() => {
    if (!statusDirty) {
      setStatusDraft(normalizeStatusCards(statusCards, beeTypes));
      /* 选中的蜂种若已被删除（级联清理后不再在册）→ 清空选中 */
      setStatusSelected((prev) => (prev && !beeTypes.some((bt) => bt.id === prev) ? null : prev));
    }
  }, [statusCards, beeTypes, statusDirty]);

  const requestClose = () => {
    if (dirtyRef.current) {
      setConfirmDiscard(true);
      return;
    }
    onClose();
  };
  useModalGuard("hotbars", guardRef, requestClose);

  const rows = draft[section] ?? [];
  const capacity = Math.max(1, layout.barM) * Math.max(1, layout.barN);
  const selected = rows.find((r) => r.id === selectedId) ?? null;

  const patchSlot = (id, p) =>
    setDraft((prev) => ({
      ...prev,
      [section]: prev[section].map((r) => (r.id === id ? { ...r, ...p } : r))
    }));
  const addSlot = () => {
    setError(null);
    const fresh =
      section === "bee"
        ? { id: newSlotId(), name: "", prompt: "", autoSend: false }
        : section === "hive"
          ? { id: newSlotId(), name: "", summon: false, autoSend: false }
          : { id: newSlotId(), name: "", createBee: true, autoSend: false };
    setDraft((prev) => ({ ...prev, [section]: [...prev[section], fresh] }));
    setSelectedId(fresh.id);
  };
  const removeSlot = (id) => {
    setDraft((prev) => ({ ...prev, [section]: prev[section].filter((r) => r.id !== id) }));
    setSelectedId((prev) => (prev === id ? null : prev));
  };
  const moveSlot = (id, delta) =>
    setDraft((prev) => {
      const list = prev[section];
      const from = list.findIndex((r) => r.id === id);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= list.length) return prev;
      const next = [...list];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      return { ...prev, [section]: next };
    });

  /* 状态卡片草稿增改/清除（D4）：prompt trim 空白 = 清除该蜂种配置。 */
  const patchStatus = (typeId, p) =>
    setStatusDraft((prev) => {
      const next = { ...prev };
      const merged = { prompt: "", autoSend: false, ...(next[typeId] ?? {}), ...p };
      const prompt = String(merged.prompt ?? "").trim();
      if (!prompt) delete next[typeId];
      else next[typeId] = { prompt, autoSend: merged.autoSend === true };
      return next;
    });
  const clearStatus = (typeId) =>
    setStatusDraft((prev) => {
      const next = { ...prev };
      delete next[typeId];
      return next;
    });

  const save = async () => {
    /* 三栏全量校验（S6 单点）：首个命中字段级错误即拒绝，草稿态不变。 */
    for (const kind of HOTBAR_KINDS) {
      const verdict = validateSlotDraft(draft[kind] ?? [], kind, { capacity });
      if (verdict.error) {
        setError({ ...verdict.error, kind });
        setSection(kind);
        return;
      }
    }
    setSaving(true);
    /* 预 normalize 对齐宿主落库形态（trim/字段矩阵裁剪同源）——保存成功后草稿
       与镜像逐字一致，脏标记消解（saveBeeTypes 双侧 normalize 纪律）。 */
    const aligned = normalizeHotbars(draft);
    /* 状态卡片草稿（D4）：同帧写入 statusCards（写入时宿主归一化丢弃悬空键）。 */
    const alignedStatus = normalizeStatusCards(statusDraft, beeTypes);
    const result = await onSave(aligned, alignedStatus);
    setSaving(false);
    if (result?.ok) {
      setError(null);
      setDraft(normalizeHotbars(result.doc?.hotbars ?? aligned));
      setStatusDraft(normalizeStatusCards(result.doc?.statusCards ?? alignedStatus, beeTypes));
      return;
    }
    setError(result?.error === "host-stale" ? { code: "hostStale" } : { code: "saveFailed" });
  };

  /* 容量超出提示（保存允许但提示，spec「容量溢出不渲染」）。 */
  const overflowSummary = HOTBAR_KINDS.reduce((acc, kind) => {
    const verdict = validateSlotDraft(draft[kind] ?? [], kind, { capacity });
    return acc + (verdict.error ? 0 : verdict.overflow);
  }, 0);

  const errText =
    error?.code === "hostStale"
      ? t("hive.hb.saveStale")
      : error?.code === "saveFailed"
        ? t("hive.qc.saveFailed")
        : error?.code
          ? t(error.code)
          : null;

  const kindLabel = (kind) => t("hive.hb.tab" + kind.charAt(0).toUpperCase() + kind.slice(1));

  return (
    <RailModal
      t={t}
      title={t("hive.hb.title")}
      closeLabel={t("hive.hb.close")}
      sections={[
        { key: "hive", icon: "⬡", label: kindLabel("hive") },
        { key: "bee", icon: "🐝", label: kindLabel("bee") },
        { key: "floor", icon: "▤", label: kindLabel("floor") },
        { key: "status", icon: "✦", label: t("hive.hb.tabStatus") }
      ]}
      active={section}
      onNavigate={setSection}
      requestClose={requestClose}
    >
      {confirmDiscard ? (
        <div className="jyv-qcConfirm" role="alertdialog" aria-label={t("hive.qc.confirmDiscard")}>
          <span>{t("hive.qc.confirmDiscard")}</span>
          <button type="button" className="jyv-qcMove" title={t("hive.qc.keepEditing")} onClick={() => setConfirmDiscard(false)}>↩</button>
          <button type="button" className="jyv-qcDiscard" onClick={onClose}>{t("hive.qc.discard")}</button>
        </div>
      ) : null}
      <div className="jyv-modalBody jyv-hbBody" role="tabpanel" id={"jyv-railPanel-" + section} aria-labelledby={"jyv-railTab-" + section}>
        {section === "status" ? (
          <StatusCardsSection
            t={t}
            beeTypes={beeTypes}
            statusDraft={statusDraft}
            selected={statusSelected}
            onSelect={setStatusSelected}
            onPatch={patchStatus}
            onClear={clearStatus}
          />
        ) : (
        <>
        {/* 槽位列表（顺序 = 展示序） */}
        <div className="jyv-qcRows">
          {rows.length === 0 ? <div className="jyv-qcEmpty">{t("hive.hb.empty")}</div> : null}
          {rows.map((row, index) => (
            <div
              key={row.id}
              className={"jyv-qcRow" + (selectedId === row.id ? " jyv-hbRowOn" : "")}
              onClick={() => setSelectedId(row.id)}
            >
              <div className="jyv-qcRowHead">
                <span className="jyv-hbIndex" aria-hidden="true">{index + 1}</span>
                <input
                  className="jyv-qcNameInput"
                  value={row.name}
                  placeholder={t("hive.hb.namePlaceholder")}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => patchSlot(row.id, { name: e.target.value })}
                />
                <button type="button" className="jyv-qcMove" disabled={index === 0} title={t("hive.qc.moveUp")} aria-label={t("hive.qc.moveUp")} onClick={(e) => { e.stopPropagation(); moveSlot(row.id, -1); }}>↑</button>
                <button type="button" className="jyv-qcMove" disabled={index === rows.length - 1} title={t("hive.qc.moveDown")} aria-label={t("hive.qc.moveDown")} onClick={(e) => { e.stopPropagation(); moveSlot(row.id, 1); }}>↓</button>
                <button type="button" className="jyv-qcRemove" title={t("hive.hb.delete")} aria-label={t("hive.hb.delete")} onClick={(e) => { e.stopPropagation(); removeSlot(row.id); }}>✕</button>
              </div>
              {selectedId === row.id ? (
                <div className="jyv-hbForm" onClick={(e) => e.stopPropagation()}>
                  {section === "hive" ? (
                    <label className="jyv-qcAuto" title={t("hive.hb.summonHint")}>
                      <input
                        type="checkbox"
                        checked={row.summon === true}
                        onChange={(e) => patchSlot(row.id, { summon: e.target.checked })}
                      />
                      {t("hive.hb.summon")}
                    </label>
                  ) : null}
                  {section === "floor" ? (
                    <label className="jyv-qcAuto" title={t("hive.hb.createBeeHint")}>
                      <input
                        type="checkbox"
                        checked={row.createBee === true}
                        onChange={(e) => patchSlot(row.id, { createBee: e.target.checked })}
                      />
                      {t("hive.hb.createBee")}
                    </label>
                  ) : null}
                  {section !== "bee" ? (
                    <label className="jyv-swarmField">
                      <span>{t("hive.hb.beeType")}</span>
                      <select
                        value={row.beeTypeId ?? ""}
                        disabled={(section === "hive" ? row.summon !== true : row.createBee !== true)}
                        onChange={(e) => patchSlot(row.id, e.target.value ? { beeTypeId: e.target.value } : { beeTypeId: undefined })}
                      >
                        <option value="">{t("hive.hb.beeTypeDefault")}</option>
                        {beeTypes.map((bt) => (
                          <option key={bt.id} value={bt.id}>{bt.name || bt.id}</option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                  {/* 提示词（字段联动禁用）：蜂栏必填；巢/地板栏仅召唤/建蜂开启时接受 */}
                  <label className="jyv-swarmField">
                    <span>{t("hive.hb.prompt")}{section === "bee" ? " · " + t("hive.hb.promptRequired") : ""}</span>
                    <textarea
                      className="jyv-qcPromptInput"
                      rows={Math.min(6, Math.max(2, String(row.prompt ?? "").split("\n").length))}
                      value={row.prompt ?? ""}
                      disabled={section === "hive" ? row.summon !== true : section === "floor" ? row.createBee !== true : false}
                      placeholder={t("hive.hb.promptPlaceholder")}
                      onChange={(e) => patchSlot(row.id, { prompt: e.target.value })}
                    />
                  </label>
                  <label className="jyv-qcAuto" title={t("hive.hb.autoSendHint")}>
                    <input
                      type="checkbox"
                      checked={row.autoSend === true}
                      onChange={(e) => patchSlot(row.id, { autoSend: e.target.checked })}
                    />
                    {t("hive.hb.autoSend")}
                  </label>
                  {section === "hive" && row.summon === true ? <div className="jyv-swarmHint">{t("hive.hb.pureSummonHint")}</div> : null}
                  {section === "hive" && row.summon !== true ? <div className="jyv-swarmHint">{t("hive.hb.summonOffHint")}</div> : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        </>
        )}
        <div className="jyv-qcActions">
          {section !== "status" ? (
            <button type="button" className="jyv-qcAdd" disabled={rows.length >= HOTBAR_COLUMN_LIMIT} onClick={addSlot}>+ {t("hive.hb.add")}</button>
          ) : null}
          {error ? <span className="jyv-qcError" role="alert">{errText}</span> : null}
          {section !== "status" && overflowSummary > 0 ? <span className="jyv-qcDirty">{t("hive.hb.overflow").replace("{n}", String(overflowSummary))}</span> : null}
          {dirty && !error && (section !== "status" || overflowSummary === 0) ? <span className="jyv-qcDirty">{t("hive.hb.dirty")}</span> : null}
          <button type="button" className="jyv-qcSave" disabled={saving} onClick={save}>{saving ? t("hive.qc.saving") : t("hive.qc.save")}</button>
        </div>
      </div>
    </RailModal>
  );
}

/* ------------------------------------------------------------------ *
 * 状态卡片节（bee-status-cards D4）：蜂种列表（beeTypes 镜像序 + 默认蜂灰置行）
 * + 选中蜂种展开唯一配置表单（prompt textarea + autoSend + 清除配置）。
 * ------------------------------------------------------------------ */
function StatusCardsSection({ t, beeTypes, statusDraft, selected, onSelect, onPatch, onClear }) {
  const rows = [...beeTypes.map((bt) => ({ typeId: bt.id, name: bt.name || bt.id, isDefault: false })), { typeId: "default", name: t("hive.status.default"), isDefault: true }];
  const sel = selected && !rows.some((r) => r.typeId === selected) ? null : selected;
  const cfg = sel ? (statusDraft?.[sel] ?? null) : null;
  return (
    <div className="jyv-qcRows">
      {rows.map((row) => (
        <div
          key={row.typeId}
          className={"jyv-qcRow" + (sel === row.typeId ? " jyv-hbRowOn" : "") + (row.isDefault ? " jyv-hbStatusDefaultRow" : "")}
          onClick={() => { if (!row.isDefault) onSelect(row.typeId); }}
        >
          <div className="jyv-qcRowHead">
            <span className="jyv-hbName">{row.name}</span>
            {row.isDefault ? <span className="jyv-qcDirty">{t("hive.hb.status.defaultRow")}</span> : null}
            {cfg && sel === row.typeId ? (
              <button type="button" className="jyv-qcRemove" title={t("hive.hb.status.clear")} aria-label={t("hive.hb.status.clear")} onClick={(e) => { e.stopPropagation(); onClear(row.typeId); }}>✕</button>
            ) : null}
          </div>
          {sel === row.typeId && !row.isDefault ? (
            <div className="jyv-hbForm" onClick={(e) => e.stopPropagation()}>
              <label className="jyv-swarmField">
                <span>{t("hive.hb.prompt")}</span>
                <textarea
                  className="jyv-qcPromptInput"
                  rows={Math.min(6, Math.max(2, String(cfg?.prompt ?? "").split("\n").length))}
                  value={cfg?.prompt ?? ""}
                  placeholder={t("hive.hb.status.promptPlaceholder")}
                  onChange={(e) => onPatch(row.typeId, { prompt: e.target.value })}
                />
              </label>
              <label className="jyv-qcAuto" title={t("hive.hb.status.autoSendHint")}>
                <input
                  type="checkbox"
                  checked={cfg?.autoSend === true}
                  onChange={(e) => onPatch(row.typeId, { autoSend: e.target.checked })}
                />
                {t("hive.hb.autoSend")}
              </label>
              <button type="button" className="jyv-qcDiscard" onClick={() => onClear(row.typeId)}>{t("hive.hb.status.clear")}</button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}


const HIVE_ICON_SVG =
  '<svg viewBox="0 0 24 28" fill="none" aria-hidden="true"><path d="M12 1.5 22.5 7.5v13L12 26.5 1.5 20.5v-13L12 1.5z" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5 17 11.4v5.7L12 20l-5-2.9v-5.7L12 8.5z" fill="currentColor" opacity=".55"/></svg>';

let sidebarToggle = null;
const dockOpenMirror = { current: false };

function injectHeaderButton(ctx) {
  if (typeof document === "undefined") return;
  ctx.effect(() => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "jyv-toggleBtn";
    btn.title = "V 蜂巢 / Hive";
    btn.setAttribute("aria-label", "V 蜂巢 / Hive");
    btn.innerHTML = HIVE_ICON_SVG;
    btn.addEventListener("click", () => sidebarToggle?.());

    let stopped = false;
    let containerObserver = null;
    const attach = (container) => {
      if (btn.isConnected) return;
      const logBtn = container.querySelector('[class*="sessionLogButton"]');
      if (logBtn) logBtn.after(btn);
      else container.appendChild(btn);
      btn.classList.toggle("jyv-toggleBtnOn", dockOpenMirror.current);
    };
    const findContainer = () => {
      const all = document.querySelectorAll('[class*="headerUtilities"]');
      for (const el of all) {
        if (el.querySelector('[class*="sessionLogButton"]') || el.offsetParent !== null) return el;
      }
      return all[0] ?? null;
    };
    const mountInto = (container) => {
      attach(container);
      containerObserver?.disconnect();
      containerObserver = new MutationObserver(() => {
        if (stopped) return;
        if (!btn.isConnected && container.isConnected) attach(container);
      });
      containerObserver.observe(container, { childList: true });
    };
    const bodyObserver = new MutationObserver(() => {
      if (stopped || btn.isConnected) return;
      const container = findContainer();
      if (container) mountInto(container);
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    const first = findContainer();
    if (first) mountInto(first);
    return () => {
      stopped = true;
      bodyObserver.disconnect();
      containerObserver?.disconnect();
      btn.remove();
    };
  }, "dsh-v-hive: header toggle button");
}

/* ------------------------------------------------------------------ *
 * 样式注入 + 插件主体
 * ------------------------------------------------------------------ */

function installStyles(ctx) {
  if (typeof document === "undefined") return;
  ctx.effect(() => {
    const tag = document.createElement("style");
    tag.dataset.plugin = PLUGIN_ID;
    tag.dataset.pluginCss = PLUGIN_ID + "/hive.css";
    tag.textContent = CSS;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, "dsh-v-hive: stylesheets");
}

/** 需要的服务：slots（注册）、locale（文案）、sessions（会话镜像与动词）、
 *  workspaces（巢镜像与动词 + 官方建工作区 create）、uiWorkspace（官方目录
 *  选择器 pickDirectory，context-hotbar-rework D6 spike 结论：独立服务）。 */
export const inject = ["slots", "locale", "sessions", "workspaces", "uiWorkspace"];

/** 控制器单例桥：apply 的 effect 创建，整页与设置卡共用。 */
const controllerRef = { current: null };
const storeBridge = { current: null }; // dock 页持续写入的 store 镜像（notify/setSettings/getSettings）

export function apply(ctx) {
  ctxRef.current = ctx;
  installStyles(ctx);

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-v-hive: dictionaries");
  const t = ctx.locale.bind(NS);

  /* 镜像控制器：与插件 fiber 同生命周期（HMR 重载 = 新 fiber = 全套重建）。 */
  ctx.effect(() => {
    controllerRef.current = createController(ctx, (text, kind) => storeBridge.current?.notify?.(text, kind));
    return () => {
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, "dsh-v-hive: mirror controller");

  /* 1. 侧栏底部座位「Hive」（sidebar.footer.action；order 10 —— 排在 Token统计(20)
       之前，配合容器 wrap 样式独占一行，位于 Token统计/设置 上方——用户要求的位置）。 */
  ctx.slots.inject("sidebar.footer.action", () =>
    ctx.slots.register(
      {
        name: "sidebar.footer.action",
        id: "v-hive-seat",
        order: 10,
        locale: NS
      },
      HiveSeat
    )
  );

  /* 2. 蜂巢整页（shell.overlay，order 40——insight 总览页同层）。
       store 绑 root 作用域 hiveStore（设置/toast/浮窗）；页面开合走
       hiveOpenStore（座位与页不共用 slot store handle）。 */
  ctx.slots.inject("shell.overlay", () =>
    ctx.slots.register(
      {
        name: "shell.overlay",
        id: "v-hive-page",
        order: 40,
        store: hiveStore,
        locale: NS,
        inject: (actions) => {
          sidebarToggle = () => hiveOpenStore.set(!hiveOpenStore.getSnapshot());
          /* 通知分发（hive-combat-log D7）：err 保留弹条；成功语义键/裸文本成功通知
             收编入「作战报告」回执行、不再置 toast。controller 尚未就绪时回落原生
             toast（首帧极短窗口）。 */
          const reportNotify = (text, kind) => {
            if (kind === "err") return actions.notify(text, kind);
            const feed = controllerRef.current?.getFeed?.();
            if (feed) feed.pushReceipt(text);
            else actions.notify(text, kind);
          };
          return {
            setFullscreen: (v) => actions.setFullscreen(v),
            toggleLegend: () => actions.toggleLegend(),
            clearToast: () => actions.clearToast(),
            notify: (text, kind) => reportNotify(text, kind),
            setSettings: (patch) => actions.setSettings(patch),
            openFloat: () => actions.openFloat(),
            closeFloat: () => actions.closeFloat(),
            ctl: () => ({ actions: controllerRef.current?.actions ?? {}, feed: () => controllerRef.current?.getFeed?.() ?? null })
          };
        }
      },
      function HivePageEntry(props) {
        const { t: tProp, useStore, setFullscreen, toggleLegend, clearToast, notify, setSettings, openFloat, closeFloat, ctl } = props;
        const settings = useStore((s) => s.settings);

        /* store ↔ controller 桥（控制器早于条目挂载，懒取值；explorer dockActions 同款）。
           openFloat/closeFloat 同时入桥：蜂卡「打开会话」（controller 动作）开浮窗走此路。 */
        storeBridge.current = { notify, setSettings, getSettings: () => settings, openFloat, closeFloat };
        useEffect(() => {
          controllerRef.current?.actions.setStoreBridge(storeBridge.current);
        });

        /* locale.bind 的 t 交给场景（卡片文案）；条目组件用框架注入的 tProp。 */
        controllerRef.current?.setT?.(t);

        return (
          <HivePageOverlay
            t={tProp}
            useStore={useStore}
            setFullscreen={setFullscreen}
            toggleLegend={toggleLegend}
            clearToast={clearToast}
            notify={notify}
            setSettings={setSettings}
            openFloat={openFloat}
            closeFloat={closeFloat}
            ctl={ctl}
          />
        );
      }
    )
  );

  /* 3. 幻影桥条目（conversation.composer.dock，order -2 紧贴输入卡片）：渲染 null，
       仅把当帧 InputZone 快照镜像进模块级桥（design D2）。裸调用 slots.inject
       （skill-links 同款：声明等待语义使本插件与 ui-conversation 加载顺序无关）。 */
  ctx.slots.inject("conversation.composer.dock", () =>
    ctx.slots.register(
      {
        name: "conversation.composer.dock",
        id: "v-hive-bridge",
        order: -2,
        locale: NS
      },
      ComposerBridgeEntry
    )
  );

  /* 4. 会话头回巢按钮。 */
  injectHeaderButton(ctx);
}

/* 冒烟测试观测面（skill-links exports.appendPrompt / composerBridge 同款先例）：
   只读镜像桥 + 草稿通道（召唤种子/桥回退）+ 道具栏/面板/模态组件引用，供
   bundle 级冒烟直测渲染输出与交互 props；运行时行为不受影响。 */
export { composerBridge, appendViaBridge, seedSummonDraft, HotbarBar, WorkerPanel, HiveSettingsModal, HotbarsModal, LayoutSettingsBody, BeeSwarmModal, StatusBar, StatusCardsSection };
