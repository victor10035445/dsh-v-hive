/**
 * 宿主端 API 桥（布局持久化 + SSE + 快捷指令直发，design.md D8/7.x、D5）。
 *
 * - fetchState / putState：/api/dsh-hive/state GET/PUT（PUT 携带 revision，
 *   409 时返回 conflict 让调用方重拉重放）；
 * - subscribeLayout：/api/dsh-hive/events SSE 广播（layout-changed → onDoc）。
 *   EventSource 自带重连；这里只做坏帧容错与卸载关闭；
 * - sendCommand：/api/dsh-hive/send POST（hive-quick-commands D5）——宿主把
 *   Prompt 以 followup 直发进该会话；永不抛错，失败以 { ok:false, error } 返回
 *   （用户定稿静默：调用方仅 console 留痕，无 toast 无镜头）。
 */
const API = "/api/dsh-hive";

export async function fetchState() {
  const res = await fetch(API + "/state");
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || res.status + " " + res.statusText);
  return body.doc ?? null;
}

/**
 * @returns {Promise<{ok: true, doc: object}|{conflict: true, doc: object}|{ok: false, error: string}>}
 */
export async function putState(revision, patch) {
  const res = await fetch(API + "/state", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ revision, ...patch })
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 409) return { conflict: true, doc: body.doc ?? null };
  if (!res.ok) return { ok: false, error: body.error || res.status + " " + res.statusText };
  return { ok: true, doc: body.doc ?? null };
}

/**
 * @param {(doc: object) => void} onDoc 广播帧回调（positions/commands 随 doc 整体携带，camera 由各页签自有）
 * @param {(frame: object) => void} [onFrame] 非 layout 帧回调（custom-bee-types：
 *        bee-engine 引擎状态帧；坏帧忽略）
 * @returns {() => void} 卸载函数
 */
export function subscribeLayout(onDoc, onFrame) {
  if (typeof EventSource === "undefined") return () => {};
  const source = new EventSource(API + "/events");
  source.onmessage = (event) => {
    try {
      const frame = JSON.parse(event.data);
      if (frame?.type === "layout-changed" && frame.doc) onDoc(frame.doc);
      else if (frame?.type === "bee-engine" && onFrame) onFrame(frame);
    } catch {
      /* 坏帧忽略 */
    }
  };
  return () => source.close();
}

/**
 * 快捷指令直发（hive-quick-commands D5）：POST /send，宿主经 agent.followup
 * 把 Prompt 投递进该会话。空白 Prompt 由宿主 400 拒绝（客户端另有前置拦截）；
 * 会话无活跃代理 → 404。
 * @returns {Promise<{ok: true}|{ok: false, error: string}>}
 */
export async function sendCommand(sessionId, prompt) {
  try {
    const res = await fetch(API + "/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, prompt })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) return { ok: false, error: body.error || res.status + " " + res.statusText };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 槽位召唤（context-hotbar-rework D4）：POST /summon——宿主 create → 绑蜂种 →
 * selectModel → 非空 prompt 且 autoSend 真时直调投递首条消息，否则只建不发；
 * 两分支均返 sessionId。蜂种/工作区缺失 → 404（body.field 字段级原因）。
 * @returns {Promise<{ok: true, sessionId: string}|{ok: false, error: string, field?: string}>}
 */
export async function summonBee({ workspaceId, beeTypeId, prompt, autoSend }) {
  try {
    const res = await fetch(API + "/summon", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        ...(beeTypeId ? { beeTypeId } : {}),
        ...(typeof prompt === "string" && prompt.length ? { prompt } : {}),
        autoSend: autoSend === true
      })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) {
      return { ok: false, error: body.error || res.status + " " + res.statusText, field: body.field };
    }
    return { ok: true, sessionId: body.sessionId };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 手动孵化（custom-bee-types，spec「手动孵化绕过车道」）：POST /hatch。
 * @returns {Promise<{ok: true, sessionId?: string, degraded?: boolean}|{ok: false, error: string, missing?: string[]}>}
 */
export async function hatchBee(sessionId, capabilityId) {
  try {
    const res = await fetch(API + "/hatch", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, capabilityId })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) return { ok: false, error: body.error || res.status + " " + res.statusText, missing: body.missing };
    return { ok: true, sessionId: body.sessionId, degraded: body.degraded === true };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 车道手动操作（spec「琥珀持有与手动放行」）：POST /lane。
 * @param {"release"|"clear"|"cancel"} action
 */
export async function laneAction(workspaceId, action, sessionId) {
  try {
    const res = await fetch(API + "/lane", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ workspaceId, action, ...(sessionId ? { sessionId } : {}) })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) return { ok: false, error: body.error || res.status + " " + res.statusText };
    return { ok: true, ...body };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/** 闩锁重置（spec「用户可在蜂卡上重置闩锁」）：POST /latch。 */
export async function resetLatch(sessionId, capabilityId) {
  try {
    const res = await fetch(API + "/latch", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, ...(capabilityId ? { capabilityId } : {}) })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) return { ok: false, error: body.error || res.status + " " + res.statusText };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 模型目录代理（S4 定稿：浮窗下拉数据源）：GET /models?sessionId=<活会话>。
 * @returns {Promise<{ok: true, models: SessionModels}|{ok: false, error: string}>}
 */
export async function fetchModels(sessionId) {
  try {
    const res = await fetch(API + "/models?sessionId=" + encodeURIComponent(sessionId));
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body.error || res.status + " " + res.statusText };
    return { ok: true, models: body.models };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}
