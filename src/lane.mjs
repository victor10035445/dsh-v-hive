/**
 * 巢级自动发送车道（custom-bee-types，design D6）：serialized 蜂型自动动作的
 * 同工作区 FIFO 互斥状态机。纯内存运行态（重启即空，触发条件自然重现）；
 * 只做状态机，不碰 IO —— 引擎接线负责「idle 且无在途自动消息」的放行判定、
 * 琥珀（等用户）期间不调用 release、SSE 广播。
 *
 * 语义（D6 + 审阅 F5/F6）：
 *   - 占道：serialized 蜂型的 send/spawn 前置 request()；直至该蜂首次归静且无在途自动消息；
 *   - 续占：spawn 出的新蜂首条自动消息经 transfer() 接棒占道；
 *   - 持有：琥珀期间引擎不 release，车道不放行（防隐性插队）；
 *   - 豁免：free 蜂型（含默认蜂）不进车道 —— 引擎按 laneMode() 判定后直接执行；
 *   - 野蜂（无 workspace）serialized 动作直发不占道；
 *   - 手动放行/清空：forceRelease() / clearWaiting() / cancelItem()。
 *
 * 同一会话重入（其 spawn 首条消息、或其在途确认未到期再次触发）不重复排队。
 */

/** 车道参与判定（引擎前置守卫用）：'lane' = 排队蜂 + 有巢；'direct' = 直发。 */
export function laneMode(queuePolicy, workspaceId) {
  if (queuePolicy === "serialized" && workspaceId) return "lane";
  return "direct";
}

export function createLane() {
  /** workspaceId → { holder: sessionId|null, waiting: [{sessionId, enqueuedAt}] } */
  const lanes = new Map();

  const laneOf = (workspaceId) => {
    let lane = lanes.get(workspaceId);
    if (!lane) {
      lane = { holder: null, waiting: [] };
      lanes.set(workspaceId, lane);
    }
    return lane;
  };

  return {
    /**
     * 申请占道。holder 空 → 直接占道；已是自己 → 重入放行（不重复排队）；
     * 他人持有 → FIFO 排队（去重），返回等待位次（0 基，供 ⏸ 角标「前方 N 项」）。
     */
    request(workspaceId, sessionId) {
      if (!workspaceId || !sessionId) return { granted: true };
      const lane = laneOf(workspaceId);
      if (lane.holder === null) {
        lane.holder = sessionId;
        return { granted: true };
      }
      if (lane.holder === sessionId) return { granted: true };
      const existing = lane.waiting.findIndex((item) => item.sessionId === sessionId);
      if (existing !== -1) return { granted: false, queued: true, position: existing };
      lane.waiting.push({ sessionId, enqueuedAt: Date.now() });
      return { granted: false, queued: true, position: lane.waiting.length - 1 };
    },

    /**
     * spawn 首条消息续占道：parent 持有 → 转移给 child（含把 child 从等待队头
     * 摘除的兜底）；parent 非持有者返回 false，由引擎改走 request() 排队。
     */
    transfer(workspaceId, parentSessionId, childSessionId) {
      const lane = lanes.get(workspaceId);
      if (!lane || lane.holder !== parentSessionId) return false;
      lane.holder = childSessionId;
      const index = lane.waiting.findIndex((item) => item.sessionId === childSessionId);
      if (index !== -1) lane.waiting.splice(index, 1);
      return true;
    },

    /**
     * 释放（引擎判定「idle 且无在途自动消息」后调用；琥珀期间引擎不得调用）。
     * holder 是 sessionId 才有效；释放后按 FIFO 放行队头（如有）。
     * @returns {{ released: boolean, granted: string|null }}
     */
    release(workspaceId, sessionId) {
      const lane = lanes.get(workspaceId);
      if (!lane || lane.holder !== sessionId) return { released: false, granted: null };
      lane.holder = null;
      const next = lane.waiting.shift();
      if (next) {
        lane.holder = next.sessionId;
        return { released: true, granted: next.sessionId };
      }
      return { released: true, granted: null };
    },

    /** 手动放行（用户显式指令，无视琥珀持有）。 */
    forceRelease(workspaceId) {
      const lane = lanes.get(workspaceId);
      if (!lane || lane.holder === null) return { released: false, granted: null };
      const previous = lane.holder;
      lane.holder = null;
      const next = lane.waiting.shift();
      if (next) lane.holder = next.sessionId;
      return { released: true, previous, granted: next ? next.sessionId : null };
    },

    /** 从等待队列取消一项（蜂卡「车道等待取消」）。 */
    cancelItem(workspaceId, sessionId) {
      const lane = lanes.get(workspaceId);
      if (!lane) return false;
      const index = lane.waiting.findIndex((item) => item.sessionId === sessionId);
      if (index === -1) return false;
      lane.waiting.splice(index, 1);
      return true;
    },

    /** 清空等待队列（手动清空；不释放持有者）。返回清掉的数量。 */
    clearWaiting(workspaceId) {
      const lane = lanes.get(workspaceId);
      if (!lane) return 0;
      const count = lane.waiting.length;
      lane.waiting.length = 0;
      return count;
    },

    /** 视图（SSE 广播帧形状）。 */
    status(workspaceId) {
      const lane = lanes.get(workspaceId);
      return {
        holder: lane?.holder ?? null,
        waiting: (lane?.waiting ?? []).map((item) => ({ ...item }))
      };
    },

    /** 该会话是否正在等待（蜂卡 ⏸ 角标）。 */
    waitingPosition(workspaceId, sessionId) {
      const lane = lanes.get(workspaceId);
      if (!lane) return -1;
      return lane.waiting.findIndex((item) => item.sessionId === sessionId);
    },

    /** 该会话是否持有某巢车道。 */
    isHolder(workspaceId, sessionId) {
      return lanes.get(workspaceId)?.holder === sessionId;
    }
  };
}
