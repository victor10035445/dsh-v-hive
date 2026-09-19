/**
 * 蜂巢 UI store（root 作用域，整页条目共享；insight 模式下「页面开合」走
 * 模块级 hiveOpenStore（见 client.jsx），这里只持有设置/工具条/toast 等页面态。
 * 布局文档（positions/revision）只是缓存——权威在宿主端（D8）；设置是页签本地。
 * 设置纯函数层（默认值/净房/迁移哨兵）已抽取到 settings.mjs（1.1/1.2，Node 可测）。
 */
import { defineStore } from "@deepseek-ai/dsh-client-store";
import {
  PANEL_LIMITS,
  BAR_LIMITS,
  REPORT_ROWS_LIMIT,
  LAYOUT_DEFAULTS,
  CHROME_SCHEMES,
  DEFAULT_SETTINGS,
  sanitizeLayout,
  sanitizeReportRows,
  normalizeSettings
} from "./settings.mjs";
import { normalizeHotbars } from "./hotbars.mjs";
import { normalizeStatusCards } from "./status-cards.mjs";

const SETTINGS_KEY = "dsh-v-hive:settings";

/* 既有导出面保持不变（client.jsx 从本模块导入）：纯函数层原样再出口。 */
export { PANEL_LIMITS, BAR_LIMITS, REPORT_ROWS_LIMIT, LAYOUT_DEFAULTS, CHROME_SCHEMES, DEFAULT_SETTINGS, sanitizeLayout };

function readLocal(key, fallback) {
  try {
    const raw = localStorage?.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  try {
    localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    /* 隐私模式等场景写不进就算了 */
  }
}

export const hiveStore = defineStore({
  init: () => ({
    fullscreen: false,
    settings: (() => {
      const raw = readLocal(SETTINGS_KEY, {});
      const merged = normalizeSettings(raw);
      /* 迁移哨兵落盘（1.2）：首次装载即把强制结果随整对象写回——此后显式关闭
         （setSettings 沿用同一整对象写路径）被永久尊重，重进不再翻转。 */
      if (raw?.followCurrentMigrated !== true) writeLocal(SETTINGS_KEY, merged);
      return merged;
    })(),
    toast: null, // { text, kind, seq }
    legend: false,
    /* 会话浮窗开合（hive-quick-commands D3）：页面态，不持久化——关页即收（任务 3.6） */
    floatOpen: false
  }),
  actions: {
    setFullscreen(d, v) {
      d.fullscreen = !!v;
    },
    openFloat(d) {
      d.floatOpen = true;
    },
    closeFloat(d) {
      d.floatOpen = false;
    },
    setSettings(d, patch) {
      d.settings = { ...d.settings, ...patch };
      /* 阵列参数写侧净房（patch 携带 layout 时界内裁剪，防越界值落 localStorage） */
      if (patch.layout) d.settings.layout = sanitizeLayout(d.settings.layout);
      /* 报告行数写侧净房（沿 layout 同纪律，防越界值落 localStorage） */
      if (patch.reportRows !== undefined) d.settings.reportRows = sanitizeReportRows(d.settings.reportRows);
      /* chrome 配色方案写侧净房（未知值落官方令牌默认） */
      if (patch.chromeScheme !== undefined && !CHROME_SCHEMES.includes(d.settings.chromeScheme)) {
        d.settings.chromeScheme = "default";
      }
      writeLocal(SETTINGS_KEY, d.settings);
    },
    notify(d, text, kind) {
      d.toast = { text, kind: kind ?? "ok", seq: (d.toast?.seq ?? 0) + 1 };
    },
    clearToast(d) {
      d.toast = null;
    },
    toggleLegend(d) {
      d.legend = !d.legend;
    }
  }
});

/* ------------------------------------------------------------------ *
 * 蜂种镜像 store（custom-bee-types 任务 4.1）：布局文档 beeTypes /
 * beeAssignments 镜像 + 引擎状态帧（bee-engine SSE）镜像。模块级微观察者
 * （commandsStore 同款；权威在宿主端 doc，SSE / fetchState / 写回成功三路同步）。
 * ------------------------------------------------------------------ */

export const beeTypesStore = {
  beeTypes: [],
  assignments: {},
  listeners: new Set(),
  getSnapshot() {
    return this.beeTypes;
  },
  getAssignments() {
    return this.assignments;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  set(beeTypes, assignments) {
    const nextTypes = Array.isArray(beeTypes) ? beeTypes : [];
    const nextAssignments = assignments && typeof assignments === "object" ? assignments : {};
    if (JSON.stringify(this.beeTypes) === JSON.stringify(nextTypes) && JSON.stringify(this.assignments) === JSON.stringify(nextAssignments)) return;
    this.beeTypes = nextTypes;
    this.assignments = nextAssignments;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* 订阅者异常不阻断其余通知 */
      }
    }
  }
};

/* ------------------------------------------------------------------ *
 * 指令编辑域镜像 store（context-hotbar-rework 6.1 + bee-status-cards
 * D9）：布局文档 hotbars 三栏 + statusCards 两字段镜像（controller 在
 * fetchState / SSE 广播 / 写回成功三路同步；状态栏与指令编辑模态共享同一
 * 份）。模块级微观察者（beeTypesStore 同款；权威在宿主端 doc），入 store
 * 即 normalizeHotbars / normalizeStatusCards 归一化（坏数据按空处理，
 * statusCards 丢弃悬空键）。热区集合变化时「热区变化」通知也走同一订阅。
 * ------------------------------------------------------------------ */

export const hotbarsStore = {
  hotbars: { hive: [], bee: [], floor: [] },
  statusCards: {},
  listeners: new Set(),
  getSnapshot() {
    return this.hotbars;
  },
  getStatusCards() {
    return this.statusCards;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  emit() {
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* 订阅者异常不阻断其余通知 */
      }
    }
  },
  /** 单口收口（D9）：同帧镜像 hotbars + statusCards（入 store 即归一化）。 */
  set(doc) {
    const next = normalizeHotbars(doc?.hotbars);
    const nextStatus = normalizeStatusCards(doc?.statusCards, doc?.beeTypes);
    const changed =
      JSON.stringify(this.hotbars) !== JSON.stringify(next) ||
      JSON.stringify(this.statusCards) !== JSON.stringify(nextStatus);
    if (!changed) return;
    this.hotbars = next;
    this.statusCards = nextStatus;
    this.emit();
  }
};

/** 引擎状态帧镜像（lane 快照 + 会话等待/通知；内存瞬态，重启即空）。 */
export const beeEngineStore = {
  lane: {},
  sessions: {},
  listeners: new Set(),
  getSnapshot() {
    return this;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  setFrame(frame) {
    const lane = frame?.lane && typeof frame.lane === "object" ? frame.lane : {};
    const sessions = frame?.sessions && typeof frame.sessions === "object" ? frame.sessions : {};
    if (JSON.stringify(this.lane) === JSON.stringify(lane) && JSON.stringify(this.sessions) === JSON.stringify(sessions)) return;
    this.lane = lane;
    this.sessions = sessions;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }
};
