/**
 * 宿主端 API 桥（布局持久化 + SSE + 快捷指令直发，design.md D8/7.x、D5）。
 *
 * - fetchState / putState：/api/dsh-hive/state GET/PUT（PUT 携带 revision，
 *   409 时返回 conflict 让调用方重拉重放）；
 * - subscribeLayout：/api/dsh-hive/events SSE 广播（layout-changed → onDoc）。
 *   EventSource 自带重连；这里只做坏帧容错与卸载关闭；
 * - sendCommand：/api/dsh-hive/send POST（hive-quick-commands D5）——宿主把
 *   Prompt 以 followup 直发进该会话（add-hotbar-llm-model-and-import D4：可选
 *   model 先切会话模型，切换失败降级不阻断，响应带 degraded）；永不抛错，
 *   失败以 { ok:false, error } 返回（用户定稿静默：调用方仅 console 留痕）。
 * - summonBee：可选 model 随卡片携带（D3，宿主按卡片模型 selectModel）。
 * - fetchImportButtons：跨插件导入源只读拉取（D6/R7，三态区分）。
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
      else if (frame?.type && onFrame) onFrame(frame);
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
 *
 * add-hotbar-llm-model-and-import D4：`model`（蜂栏卡绑定的 LLM 模型，optional）——
 * 宿主在 followup 前对该会话 selectModel；**切换失败降级不阻断发送**，响应携带
 * `degraded: true`（调用方据此 toast 提示：消息以会话当前模型发出）。
 * @param {{provider: string, model: string, reasoningEffort?: string}} [model]
 * @returns {Promise<{ok: true, degraded?: boolean}|{ok: false, error: string}>}
 */
export async function sendCommand(sessionId, prompt, model) {
  try {
    const res = await fetch(API + "/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, prompt, ...(model ? { model } : {}) })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) return { ok: false, error: body.error || res.status + " " + res.statusText };
    return body.degraded === true ? { ok: true, degraded: true } : { ok: true };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 提案清单（add-proposal-panel 5.1）：GET /proposals——宿主每请求即时收集全部在册
 * 工作区（无 `openspec/changes` 目录者 `changes: []`）；响应体即分组数组。
 * @returns {Promise<{ok: true, groups: object[]}|{ok: false, error: string}>}
 */
export async function fetchProposals() {
  try {
    const res = await fetch(API + "/proposals");
    const body = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(body)) {
      return { ok: false, error: (body && body.error) || res.status + " " + res.statusText };
    }
    return { ok: true, groups: body };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 提案状态位置位（add-proposal-panel 5.1/D3）：POST /proposals/status。
 * 专用路由（不走 PUT /state 的 revision 通道）——宿主原子写入 + persistDoc +
 * SSE `layout-changed` 广播（跨页签自然收敛）。
 * @param {{workspaceId: string, name: string, status: string}} patch
 * @returns {Promise<{ok: true}|{ok: false, error: string, field?: string}>}
 */
export async function setProposalStatus({ workspaceId, name, status } = {}) {
  try {
    const res = await fetch(API + "/proposals/status", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ workspaceId, name, status })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) {
      return { ok: false, error: body.error || res.status + " " + res.statusText, field: body.field };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 提案状态列表写入（proposal-panel-config 2.2/3.1）：POST /proposals/statuses——
 * **整单替换**（不做逐条增删路由）。宿主归一化 + persistDoc + SSE `layout-changed`
 * 广播（跨页签自然收敛）；形状非法 / id 重复 / 超封顶 16 → 400 字段级原因且文档不变更。
 * @param {Array<{id: string, color: string, name?: string}>} list
 * @returns {Promise<{ok: true}|{ok: false, error: string, field?: string, code?: string}>}
 */
export async function setProposalStatuses(list) {
  try {
    const res = await fetch(API + "/proposals/statuses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Array.isArray(list) ? list : [])
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) {
      return { ok: false, error: body.error || res.status + " " + res.statusText, field: body.field, code: body.code };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 槽位召唤（context-hotbar-rework D4）：POST /summon——宿主 create → 绑蜂种 →
 * selectModel → 非空 prompt 且 autoSend 真时直调投递首条消息，否则只建不发；
 * 两分支均返 sessionId。蜂种/工作区缺失 → 404（body.field 字段级原因）。
 *
 * add-hotbar-llm-model-and-import D3：`model`（卡片绑定的 LLM 模型，optional）随
 * 请求体携带——宿主按**卡片模型** selectModel（缺省 = 部署默认），形状非法 400。
 * 形状同 beeTypeId 的条件展开：未绑定不产生该键（老调用方行为不变）。
 * @param {{workspaceId: string, beeTypeId?: string, prompt?: string, autoSend?: boolean, model?: {provider: string, model: string, reasoningEffort?: string}}} args
 * @returns {Promise<{ok: true, sessionId: string}|{ok: false, error: string, field?: string}>}
 */
export async function summonBee({ workspaceId, beeTypeId, prompt, autoSend, model }) {
  try {
    const res = await fetch(API + "/summon", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        ...(beeTypeId ? { beeTypeId } : {}),
        ...(typeof prompt === "string" && prompt.length ? { prompt } : {}),
        autoSend: autoSend === true,
        ...(model ? { model } : {})
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
 * 跨插件快捷功能导入源拉取（add-hotbar-llm-model-and-import D5/R7）：
 * GET /imports/skill-links-buttons（宿主半区只读白名单端点）。
 * 三态区分（缺一不可，否则用户看到 "404 Not Found" 这类原始串）：
 *  - `{ ok:true, available:true, buttons }`——可用（形状化条目）；
 *  - `{ ok:true, available:false, reason }`——源不可用（未安装/未启用
 *    `namespace-unregistered`；宿主无 settings 服务 `settings-service-absent`）；
 *  - `{ ok:false, stale:true, error }`——宿主半区未重启/版本较旧（路由 404）；
 *  - `{ ok:false, error }`——网络异常 / 响应非 JSON。
 * @returns {Promise<{ok:true, available:true, buttons: object[]}|{ok:true, available:false, reason:string}|{ok:false, error:string, stale?:boolean}>}
 */
export async function fetchImportButtons() {
  try {
    const res = await fetch(API + "/imports/skill-links-buttons");
    if (res.status === 404) {
      /* 宿主半区旧版无该路由（客户端 HMR 先行、宿主需重启）——单列 stale 供界面给准确指引。 */
      return { ok: false, stale: true, error: "import route missing" };
    }
    const body = await res.json().catch(() => null);
    if (!res.ok || !body || body.ok !== true) {
      return { ok: false, error: body?.error || res.status + " " + res.statusText };
    }
    if (body.available !== true) {
      return { ok: true, available: false, reason: typeof body.reason === "string" ? body.reason : "namespace-unregistered" };
    }
    return { ok: true, available: true, buttons: Array.isArray(body.buttons) ? body.buttons : [] };
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

/* ------------------------------------------------------------------ *
 * 语音路由 helper（add-hive-voice-desk 2.x；TTS 走 speech.mjs 的流式播放器）
 * ------------------------------------------------------------------ */

/**
 * key / 文本模型 / 音色 / 人设探测：GET /voice/status。
 * 恒 200：结构化 `state = ready | not-configured | no-model`（SHALL NOT 抛错堆栈）。
 */
export async function voiceStatus() {
  try {
    const res = await fetch(API + "/voice/status");
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body.error || res.status + " " + res.statusText };
    return { ok: true, ...body };
  } catch (error) {
    return { ok: false, error: String(error?.message || error), state: "unreachable" };
  }
}

/**
 * 宿主侧语音配置写入（2026-09-27 追补）：PUT /voice/config。
 * **只写不读**——提交 key 与偏好，宿主合并写 `$DSH_HOME/hive-voice.json` 并回探测结果；
 * 响应体与任何读取路由都不含 key（写入成功后界面自行清空输入框）。
 * `undefined` = 不改；`null` / 空串 = 清除该键；`clearKey: true` = 删除 key。
 * @returns {Promise<({ok:true} & object) | {ok:false, error:string, field?:string}>}
 */
export async function voiceConfig(patch) {
  try {
    const res = await fetch(API + "/voice/config", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch ?? {})
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 404) {
      /* 宿主半区未加载该路由（客户端 HMR 先行、宿主需重启）——单列 stale 供界面给准确指引。 */
      return { ok: false, stale: true, error: body.error || "voice config route missing" };
    }
    if (!res.ok || body.ok !== true) {
      return { ok: false, error: body.error || res.status + " " + res.statusText, field: body.field };
    }
    return { ok: true, ...body };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 索引（openspec 提案名 + 蜂种名；热词与解析辅助）：GET /voice/index?workspaceId=。
 * 蜂显示名（会话标题）只存在于浏览器投影，由客户端自行并入热词表。
 */
export async function voiceIndex(workspaceId) {
  try {
    const query = workspaceId ? "?workspaceId=" + encodeURIComponent(workspaceId) : "";
    const res = await fetch(API + "/voice/index" + query);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body.error || res.status + " " + res.statusText, field: body.field };
    return { ok: true, ...body };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 段转写：POST /voice/asr（multipart/form-data，字段 `file`）。
 * 宿主侧独立 2MB 口径；`signal` 用于打断时中止本段上传。
 * @returns {Promise<{ok:true, text:string}|{ok:false, error:string, status?:number}>}
 */
export async function voiceAsr(wav, options = {}) {
  try {
    const bytes = wav instanceof Uint8Array ? wav : new Uint8Array(wav ?? []);
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: "audio/wav" }), options.filename ?? "segment.wav");
    if (options.prompt) form.append("prompt", String(options.prompt).slice(-8000));
    if (Array.isArray(options.hotwords) && options.hotwords.length > 0) {
      form.append("hotwords", JSON.stringify(options.hotwords.slice(0, 100)));
    }
    const res = await fetch(API + "/voice/asr", { method: "POST", body: form, signal: options.signal });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) {
      return { ok: false, error: body.error || res.status + " " + res.statusText, status: res.status, state: body.state };
    }
    return { ok: true, text: typeof body.text === "string" ? body.text : "", duration: body.duration ?? null };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

/**
 * 蜂后应答（双 register + 落盘）：POST /voice/answer。
 * 请求体只带语义字段；**路径一律由宿主拼装**（客户端不得传路径）。
 * @returns {Promise<{ok:true, spoken:string, markdown:string, relativePath:string, path:string, truncated:boolean}|{ok:false, error:string, state?:string}>}
 */
export async function voiceAnswer(payload) {
  try {
    const res = await fetch(API + "/voice/answer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: String(payload?.text ?? ""),
        history: Array.isArray(payload?.history) ? payload.history.slice(-12) : [],
        referents: Array.isArray(payload?.referents) ? payload.referents : [],
        ...(payload?.workspaceId ? { workspaceId: payload.workspaceId } : {}),
        ...(payload?.personaId ? { personaId: payload.personaId } : {}),
        ...(Number.isFinite(payload?.maxTokens) ? { maxTokens: Math.round(payload.maxTokens) } : {})
      })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok !== true) {
      return { ok: false, error: body.error || res.status + " " + res.statusText, state: body.state };
    }
    return { ok: true, ...body };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}
