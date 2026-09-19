/**
 * 巢级车道状态机冒烟测试（custom-bee-types 任务 2.7）：排队蜂互斥、自由蜂豁免、
 * spawn 续占道、琥珀持有、FIFO 放行、手动清空、野蜂直发（spec 车道五场景）。
 * 运行：node test/lane-smoke.mjs
 */
import { createLane, laneMode } from "../src/lane.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 前置守卫判定：serialized+有巢 → 车道；free / 野蜂 → 直发 ── */

eq(laneMode("serialized", "ws-1"), "lane", "排队蜂 + 有巢 → 进车道");
eq(laneMode("free", "ws-1"), "direct", "自由蜂 → 直发");
eq(laneMode("serialized", null), "direct", "野蜂（无巢）→ 直发不占道（spec「野蜂动作不占道」）");
eq(laneMode(undefined, "ws-1"), "direct", "默认蜂（无策略）→ 直发");

/* ── spec「排队蜂互斥」：设计蜂甲占道，乙排队等待，甲归静后乙 FIFO 放行 ── */

const lane = createLane();
const first = lane.request("ws-1", "bee-a");
ok(first.granted === true, "首只排队蜂立即占道");
eq(lane.status("ws-1").holder, "bee-a", "持有者记录");

const second = lane.request("ws-1", "bee-b");
ok(second.granted === false && second.queued === true, "第二只排队蜂进入等待");
eq(second.position, 0, "等待位次 0（⏸ 前方 N 项）");
eq(lane.status("ws-1").waiting.length, 1, "等待队列长度 1");
ok(lane.request("ws-1", "bee-c").position === 1, "第三只 FIFO 队尾");
eq(lane.request("ws-1", "bee-b").position, 0, "同会话重入不重复排队");

const releaseA = lane.release("ws-1", "bee-a");
eq(releaseA, { released: true, granted: "bee-b" }, "甲归静 → 乙按 FIFO 放行");
eq(lane.status("ws-1").holder, "bee-b", "乙接棒持有");
eq(lane.release("ws-1", "bee-a"), { released: false, granted: null }, "非持有者释放无效");

/* 释放后由引擎执行放行蜂的动作（状态机只记 granted）——此处仅断言状态 */
eq(lane.waitingPosition("ws-1", "bee-c"), 0, "丙升队头");

/* ── spec「自由蜂不受限」：占道期间自由蜂动作不进车道 ── */

const lane2 = createLane();
lane2.request("ws-2", "queued-1");
const freeBee = lane2.request("ws-2", "free-bee");
/* 自由蜂由引擎 laneMode 判定后直接执行，根本不调用 request ——
   这里模拟「错误调用」也会被拒绝占道，证明其不受车道保护也不阻塞他人 */
ok(freeBee.granted === false, "车道被占时自由蜂即使误申请也排队（引擎层已豁免，不发生此调用）");
eq(laneMode("free", "ws-2"), "direct", "豁免判定：自由蜂 direct（引擎不调用 request）");

/* ── spec「spawn 首条消息续占道」：甲占道孵化战斗蜂，新蜂首条接棒 ── */

const lane3 = createLane();
lane3.request("ws-3", "design-a");
const queued = lane3.request("ws-3", "design-b");
ok(queued.queued === true, "同巢乙排队");
ok(lane3.transfer("ws-3", "design-a", "battle-x") === true, "spawn 首条消息续占道：甲→战斗蜂转移");
eq(lane3.status("ws-3").holder, "battle-x", "战斗蜂持有车道");
eq(lane3.waitingPosition("ws-3", "design-b"), 0, "乙仍等待（SHALL NOT 插队）");
ok(lane3.transfer("ws-3", "design-a", "other") === false, "甲已非持有者 → 转移失败");
ok(lane3.transfer("ws-3", "stranger", "other") === false, "陌生会话转移无效");
const afterBattle = lane3.release("ws-3", "battle-x");
eq(afterBattle.granted, "design-b", "战斗蜂首次归静 → 乙放行");

/* spawn 触发蜂不持有（如自由蜂孵化排队蜂种）→ 引擎对子蜂走正常 request */
const lane3b = createLane();
lane3b.request("ws-3b", "holder-x");
ok(lane3b.transfer("ws-3b", "free-parent", "child-y") === false, "父非持有者 → 转移失败");
const childReq = lane3b.request("ws-3b", "child-y");
ok(childReq.queued === true, "子蜂改走 request 排队");

/* ── spec「琥珀持有与手动放行」：占道蜂等用户验收，车道不放行；手动放行才轮转 ── */

const lane4 = createLane();
lane4.request("ws-4", "amber-bee");
lane4.request("ws-4", "queued-y");
/* 琥珀语义 = 引擎在会话 pendingInteraction 期间不调用 release —— 状态机无从窥探，
   这里断言「不调用 release 就不轮转」+ forceRelease 手动轮转 */
eq(lane4.status("ws-4").holder, "amber-bee", "琥珀蜂仍持有（时间流逝无变化）");
const manual = lane4.forceRelease("ws-4");
eq(manual, { released: true, previous: "amber-bee", granted: "queued-y" }, "手动放行 → 排队蜂放行");
ok(lane4.forceRelease("ws-4").granted === null, "无等待者时手动放行 → 空放行");
ok(lane4.forceRelease("empty-ws").released === false, "无车道记录 → 放行无效");

/* ── 手动清空 / 取消等待项 ── */

const lane5 = createLane();
lane5.request("ws-5", "h-1");
lane5.request("ws-5", "w-1");
lane5.request("ws-5", "w-2");
ok(lane5.cancelItem("ws-5", "w-1") === true, "蜂卡取消等待项");
ok(lane5.cancelItem("ws-5", "w-1") === false, "重复取消无效");
eq(lane5.clearWaiting("ws-5"), 1, "手动清空剩余等待项");
eq(lane5.status("ws-5").waiting, [], "等待队列空");
eq(lane5.status("ws-5").holder, "h-1", "清空不动持有者");
eq(lane5.clearWaiting("no-such-ws"), 0, "无车道记录 → 清 0");
eq(lane5.waitingPosition("no-such-ws", "h-1"), -1, "无车道记录 → 位次 -1");
ok(lane5.isHolder("ws-5", "h-1") === true && !lane5.isHolder("ws-5", "w-2"), "isHolder 判定");

/* request 参数防御 */
ok(lane5.request(null, "s").granted === true, "无 workspace → 直发放行");
ok(lane5.request("ws", null).granted === true, "无 sessionId → 直发放行");

console.log("ALL LANE SMOKE TESTS PASSED");
