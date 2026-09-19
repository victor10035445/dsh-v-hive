/**
 * 情境道具栏纯逻辑（context-hotbar-rework，design D3/S6 单点收口）：
 * 三栏槽位归一化、草稿校验、三态门控、追加语义与工蜂门控。
 * 独立无依赖模块——client.jsx 消费、冒烟测试直测（替代旧 src/commands.mjs）。
 * hotbar-default-actions 增量：内置默认动作卡骨架（D2）与栏级回退派生。
 *
 * 槽位形状（扁平，一套 schema + 按栏裁剪）：
 *   { id, name, summon?, beeTypeId?, createBee?, prompt?, autoSend }
 * 字段矩阵：
 *   - hive（巢栏）：summon 适用（默认否）；无 createBee；提示词/蜂种仅召唤开启时有意义；
 *   - bee（蜂栏）：召唤灰置（恒否）、无 summon/beeTypeId/createBee；提示词必填；
 *   - floor（地板栏）：建巢恒开（无开关字段必要，createBee 指建蜂）；提示词/蜂种仅建蜂开启时有意义。
 */

/** 每栏槽位上限（审阅 F7：防滥用；宿主 zod 同界）。 */
export const HOTBAR_COLUMN_LIMIT = 32;

/** 三栏键（数组序即模态 nav 序）。 */
export const HOTBAR_KINDS = ["hive", "bee", "floor"];

/** 空配置（旧文档无 hotbars 字段 → 三栏全空）。 */
export function emptyHotbars() {
  return { hive: [], bee: [], floor: [] };
}

/* ── 按栏字段矩阵（归一化与校验共用） ── */

/** 提示词/蜂种字段的启用开关（字段联动：关 → 字段不接受）。 */
function promptGate(kind, slot) {
  if (kind === "hive") return slot.summon === true;
  if (kind === "floor") return slot.createBee === true;
  return true; // 蜂栏：提示词必填、恒启用
}

export function normalizeSlot(kind, raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = typeof raw.id === "string" ? raw.id : "";
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!id || !name) return null;
  const slot = {
    id,
    name,
    autoSend: raw.autoSend === true
  };
  /* 按栏裁剪：蜂栏无召唤/蜂种/建蜂字段；巢栏无 createBee；地板栏建巢恒开。 */
  if (kind === "hive" || kind === "floor") {
    const flag = kind === "hive" ? raw.summon === true : raw.createBee === true;
    if (kind === "hive") slot.summon = raw.summon === true;
    else slot.createBee = raw.createBee === true;
    if (flag) {
      if (typeof raw.beeTypeId === "string" && raw.beeTypeId) slot.beeTypeId = raw.beeTypeId;
      if (typeof raw.prompt === "string" && raw.prompt.trim()) slot.prompt = raw.prompt;
    }
  } else {
    if (typeof raw.prompt === "string" && raw.prompt.trim()) slot.prompt = raw.prompt;
    else return null; // 蜂栏提示词必填（结构性缺失 → 坏数据过滤）
  }
  return slot;
}

/**
 * 布局文档 hotbars 镜像归一化（spec「布局文档扩容向后兼容」）：旧文档无字段 /
 * 坏形状 → 三栏空；仅保留结构合法条目（id 非空唯一、name trim 非空且栏内唯一、
 * 蜂栏提示词必填、字段按栏裁剪 + 联动裁剪），顺序 = 数组序，每栏容量裁剪
 * （超出 HOTBAR_COLUMN_LIMIT 的槽位丢弃，配置不炸）。
 */
export function normalizeHotbars(raw) {
  const out = emptyHotbars();
  if (!raw || typeof raw !== "object") return out;
  for (const kind of HOTBAR_KINDS) {
    const list = raw[kind];
    if (!Array.isArray(list)) continue;
    const ids = new Set();
    const names = new Set();
    for (const item of list) {
      if (out[kind].length >= HOTBAR_COLUMN_LIMIT) break;
      const slot = normalizeSlot(kind, item);
      if (!slot || ids.has(slot.id) || names.has(slot.name)) continue;
      ids.add(slot.id);
      names.add(slot.name);
      out[kind].push(slot);
    }
  }
  return out;
}

/**
 * 指令编辑草稿校验（spec「校验拒绝非法输入」，design D3/S6 单点表驱动）：
 * 全部通过返回 error = null；否则返回首个命中的字段级错误 { index, field, code }。
 * 规则（按序）：
 *  - 名称非空（hive.hb.err.invalidName）；
 *  - 名称栏内唯一（trim 比对；hive.hb.err.duplicateName）；
 *  - 蜂栏提示词必填（hive.hb.err.missingPrompt）；
 *  - 巢/地板栏召唤/建蜂关闭时提示词不接受（字段联动；hive.hb.err.promptBlocked）；
 *  - 栏内槽位数超上限 32（hive.hb.err.tooManySlots；宿主 zod 同界 400）。
 * 另返回 overflow：超出 capacity（该栏显示阵列 m×n）的槽位数（>0 → 保存允许但
 * 编辑器呈现超出提示，spec「容量溢出不渲染」）。
 */
export function validateSlotDraft(rows, kind, { capacity } = {}) {
  const names = new Set();
  const list = Array.isArray(rows) ? rows : [];
  for (let index = 0; index < list.length; index++) {
    const row = list[index] ?? {};
    const name = typeof row.name === "string" ? row.name.trim() : "";
    if (!name) return { error: { index, field: "name", code: "hive.hb.err.invalidName" }, overflow: 0 };
    if (names.has(name)) return { error: { index, field: "name", code: "hive.hb.err.duplicateName" }, overflow: 0 };
    names.add(name);
    const prompt = typeof row.prompt === "string" ? row.prompt.trim() : "";
    if (kind === "bee" && !prompt) {
      return { error: { index, field: "prompt", code: "hive.hb.err.missingPrompt" }, overflow: 0 };
    }
    if (kind !== "bee" && prompt && !promptGate(kind, row)) {
      /* 召唤/建蜂关闭而提示词非空 → 编辑器字段联动禁用后仍可能带入旧值，拒绝保存 */
      return { error: { index, field: "prompt", code: "hive.hb.err.promptBlocked" }, overflow: 0 };
    }
  }
  if (list.length > HOTBAR_COLUMN_LIMIT) {
    return { error: { index: HOTBAR_COLUMN_LIMIT, field: "list", code: "hive.hb.err.tooManySlots" }, overflow: 0 };
  }
  const overflow =
    Number.isFinite(capacity) && capacity > 0 ? Math.max(0, list.length - Math.floor(capacity)) : 0;
  return { error: null, overflow };
}

/* ── 内置默认动作卡（hotbar-default-actions，design D2/D5；卡组经用户定稿调整）──
 * 按栏骨架常量：结构字段 + i18n 无关文案键（nameKey/promptKey）+ 稳定 id +
 * builtin 标记 + 动作卡 action 判别。不持久化、不进布局文档；effectiveHotbarSlots
 * 渲染期经注入 t 解析为本地化默认卡。builtin/action 仅存在于内存派生对象——
 * normalizeSlot 重建剥离未知字段，用户配置无法注入（无伪造通道，design D3）。
 * 卡组：巢栏无默认卡（召唤由用户自定义槽位覆盖）；蜂栏「继续」+ 动作卡
 * 「归档会话」「打开会话」（常驻）；地板栏仅「建巢」（回退型）。 */
export const DEFAULT_HOTBAR_SLOTS = {
  /* 巢栏：空骨架——空栏派生空数组 → 道具栏整栏不渲染（紧凑规则）。 */
  hive: [],
  bee: [
    /* 继续：autoSend 是 = followup 直发通道（恒可用） */
    { id: "default-hb-continue", nameKey: "hive.bar.defaults.beeContinue", promptKey: "hive.bar.defaults.beeContinuePrompt", builtin: true, autoSend: true },
    /* 归档会话：非提示词动作卡——归档当前会话蜂（archiveBee，化蜜入库不可恢复） */
    { id: "default-hb-archive", nameKey: "hive.bar.defaults.beeArchive", builtin: true, autoSend: false, action: "archive" },
    /* 打开会话：非提示词动作卡——收起蜂巢页直达当前会话标准视图（用户定稿，不开浮窗） */
    { id: "default-hb-open", nameKey: "hive.bar.defaults.beeOpen", builtin: true, autoSend: false, action: "open" }
  ],
  floor: [
    /* 建巢：createBee 否 = 纯建巢（空巢落地） */
    { id: "default-hb-nest", nameKey: "hive.bar.defaults.floorNest", builtin: true, createBee: false, autoSend: false }
  ]
};

/**
 * 常驻内置卡栏（用户定稿）：这些栏的内置卡排在用户槽位之后恒呈现、不随自定义
 * 收回（容量截断时尾随先切，用户卡优先）；其余栏内置卡为回退型——该栏存在
 * 任一用户槽位即整栏收回。
 */
export const HOTBAR_RESIDENT_KINDS = ["bee"];

/**
 * 栏级有效槽位派生（hotbar-default-actions，design D1/D2；蜂栏常驻为用户定稿修订）：
 * 常驻栏（蜂栏）→ 用户槽位（原序）之后恒追加整组内置卡（userSlots 非数组按空处理）；
 * 回退栏（巢栏/地板栏）→ userSlots 非空数组原样返回（内置卡整栏收回），否则（空数组/
 * 非数组坏值按空回退）把该栏骨架经注入的 t 解析为本地化默认卡（nameKey/promptKey →
 * 文案，builtin 标记与动作卡 action 判别透传）。
 * 纯函数、渲染期廉价（O(栏内槽数)）；id 稳定不破 React key；未知 kind 与空
 * 骨架栏（巢栏）→ 空数组（组件不渲染）。
 */
export function effectiveHotbarSlots(kind, userSlots, t) {
  const users = Array.isArray(userSlots) ? userSlots : [];
  const resident = HOTBAR_RESIDENT_KINDS.includes(kind);
  if (users.length > 0 && !resident) return users;
  const translate = typeof t === "function" ? t : (key) => key;
  const builtin = (DEFAULT_HOTBAR_SLOTS[kind] ?? []).map((entry) => {
    const card = {
      id: entry.id,
      name: String(translate(entry.nameKey) ?? ""),
      autoSend: entry.autoSend === true,
      builtin: true
    };
    if (entry.summon !== undefined) card.summon = entry.summon === true;
    if (entry.createBee !== undefined) card.createBee = entry.createBee === true;
    if (entry.action !== undefined) card.action = entry.action;
    if (entry.promptKey) {
      const prompt = String(translate(entry.promptKey) ?? "");
      if (prompt.trim()) card.prompt = prompt;
    }
    return card;
  });
  return resident ? [...users, ...builtin] : builtin;
}

/**
 * 道具栏三态门控纯函数（design D1）：selection（studio/tile）× selectedBee ×
 * 浮窗态 → `hive|bee|floor|null` 三态互斥。优先级 studio > tile > 蜂栏；
 * 蜜杯选中、清选中（且无当前会话蜂）与浮窗开启（页面遮罩暂停态）→ null。
 */
export function resolveHotbarKind({ selection, selectedBee, floatOpen } = {}) {
  if (floatOpen) return null;
  const kind = selection?.kind;
  if (kind === "studio") return "hive";
  if (kind === "tile") return "floor";
  if (kind) return null; // cup 等其它非蜂选中 → 不渲染
  return selectedBee ? "bee" : null;
}

/**
 * 追加语义（spec「未勾选自动发送——填入」，dsh-jiyu-skill-links 同款验收口径）：
 * 空草稿直接填入；非空草稿以换行拼接（一次 setDraft 机器事务，可撤销）。
 */
export function appendPrompt(draft, prompt) {
  const base = typeof draft === "string" ? draft : "";
  const addition = String(prompt ?? "");
  return base.length === 0 ? addition : base + "\n" + addition;
}

/**
 * 工蜂门控（原 hive-quick-commands 4.2，蜂栏/覆盖面板门控复用）：返回当前选中
 * 工蜂的 sessionId 或 null。工蜂 = 巢内主蜂或野蜂（未分组主会话）；无人机与非蜂
 * 对象不算；任何非蜂显式选中（巢/瓦片/蜜杯，蜂不入槽）与清选中 → null。
 *
 * world 为 bee-model 派生世界（studios[].bees 为主蜂、wildBees 为野蜂）；无人机
 * 排除走 sessionsState.byId[].origin === "subagent"（权威分类，覆盖 orphan 降级
 * 混入 studio.bees / wildBees 的边角——bee-model 未在卡面透出 origin）。
 */
export function workerBeeIdOf(world, current, selection, sessionsState) {
  if (selection) return null;
  if (!current) return null;
  if (sessionsState?.byId?.[current]?.origin === "subagent") return null;
  for (const studio of world?.studios ?? []) {
    for (const bee of studio?.bees ?? []) {
      if (bee?.sessionId === current) return current;
    }
  }
  for (const wild of world?.wildBees ?? []) {
    if (wild?.sessionId === current) return current;
  }
  return null;
}
