/**
 * 顶部会话概要条数据面冒烟测试（hive-interaction-polish 5.3，纯函数直测）：
 *  - sessionsBriefOf：turnOutline 末回合提取、缺失回退（无键 / 无回合 / 空 response /
 *    标题回退 sessionId）；
 *  - sessionsBriefStore：内容不变不 bump（镜像 tick 高频下概要条 SHALL NOT 入 React
 *    重渲染热路径）、变化即发布、订阅清理；
 *  - 非工蜂隐藏判定：workerBeeIdOf（无人机 / 空白 / 归档蜜杯 / 无蜂会话 → null）。
 * 运行：node test/brief-bar-smoke.mjs
 */
import { deriveWorld, sessionsBriefOf } from "../src/bee-model.mjs";
import { sessionsBriefStore } from "../src/brief.mjs";
import { workerBeeIdOf } from "../src/hotbars.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ════ 1. sessionsBriefOf：末回合提取与缺失回退 ════ */

eq(
  sessionsBriefOf({
    id: "s-1",
    displayTitle: "实现提案",
    projectionValues: { turnOutline: [{ prompt: "第一回合", response: "完成" }, { prompt: "继续测试", response: "全部通过" }] }
  }),
  { title: "实现提案", prompt: "继续测试", response: "全部通过" },
  "末回合 prompt/response 提取"
);
eq(sessionsBriefOf({ id: "s-2", projectionValues: {} }), { title: "s-2", prompt: null, response: null }, "无 turnOutline 键 → 双 null 槽位");
eq(sessionsBriefOf({ id: "s-3", projectionValues: { turnOutline: [] } }), { title: "s-3", prompt: null, response: null }, "无已提交回合 → 双 null 槽位");
eq(
  sessionsBriefOf({ id: "s-4", projectionValues: { turnOutline: [{ prompt: "只有提问", response: "" }] } }),
  { title: "s-4", prompt: "只有提问", response: null },
  "末回合 response 空串 → response 槽位 null（prompt 照常）"
);
eq(sessionsBriefOf({ id: "s-5", title: "备用标题" }), { title: "备用标题", prompt: null, response: null }, "displayTitle 缺失 → title 回退");
eq(sessionsBriefOf({ id: "s-6" }), { title: "s-6", prompt: null, response: null }, "displayTitle/title 均缺失 → sessionId 回退（SHALL NOT 留空）");
eq(sessionsBriefOf(null), null, "会话缺失 → null（呈现层隐藏整条 bar）");
eq(
  sessionsBriefOf({ id: "s-7", projectionValues: { turnOutline: { turns: [{ prompt: "对象形态", response: "ok" }] } } }),
  { title: "s-7", prompt: "对象形态", response: "ok" },
  "turnOutline 对象形态（turns 数组）兼容"
);

/* ════ 2. sessionsBriefStore：内容不变不 bump（热路径纪律） ════ */
{
  const briefA = { title: "t", prompt: "p", response: null };
  let bumps = 0;
  const unsubscribe = sessionsBriefStore.subscribe(() => {
    bumps++;
  });
  const sig0 = sessionsBriefStore.getSnapshot();
  sessionsBriefStore.set(briefA);
  eq(bumps, 1, "内容变化 → 发布一次");
  const sig1 = sessionsBriefStore.getSnapshot();
  ok(sig1 !== sig0, "版本号 bump");
  sessionsBriefStore.set({ title: "t", prompt: "p", response: null }); // 深相等内容（镜像 tick 重复发布）
  eq(bumps, 1, "内容不变 → SHALL NOT bump（镜像 tick 不入 React 热路径）");
  sessionsBriefStore.set(briefA); // 同一引用
  eq(bumps, 1, "同引用 → 不 bump");
  sessionsBriefStore.set(null);
  eq(bumps, 2, "内容清空 → 发布（呈现层隐藏）");
  unsubscribe();
  sessionsBriefStore.set(briefA);
  eq(bumps, 2, "订阅清理后不再通知");
  sessionsBriefStore.set(null); // 复位
}

/* ════ 3. 非工蜂隐藏判定（workerBeeIdOf 门控 = BriefBar 显示条件） ════ */
{
  const byId = {};
  const ids = [];
  const add = (s) => {
    byId[s.id] = s;
    ids.push(s.id);
  };
  add({ id: "s-worker", displayTitle: "工蜂", blank: false, cwd: "F:/a", updatedAt: 1 });
  add({ id: "s-drone", displayTitle: "无人机", blank: false, origin: "subagent", parentId: "s-worker", cwd: "F:/a", updatedAt: 2 });
  add({ id: "s-blank", displayTitle: "空白", blank: true, cwd: "F:/a", updatedAt: 3 });
  add({ id: "s-arch", displayTitle: "归档", blank: false, cwd: "F:/a", updatedAt: 4 });
  const sessions = { ids, byId, current: "s-worker" };
  const workspaces = { items: [{ workspaceId: "ws-a", path: "F:/a", title: "a", sessionIds: ["s-worker", "s-drone", "s-blank", "s-arch"] }], archivedSessionIds: ["s-arch"] };
  const world = deriveWorld({ sessions, workspaces, positions: {} }).world;
  eq(workerBeeIdOf(world, "s-worker", null, sessions), "s-worker", "当前会话为已渲染工蜂 → 显示（门控通过）");
  eq(workerBeeIdOf(world, "s-drone", null, sessions), null, "当前会话为无人机 → null（隐藏，SHALL NOT 空壳）");
  eq(workerBeeIdOf(world, "s-blank", null, sessions), null, "空白会话（无蜂）→ null（隐藏）");
  eq(workerBeeIdOf(world, "s-arch", null, sessions), null, "归档蜜杯 → null（隐藏）");
  eq(workerBeeIdOf(world, "s-missing", null, sessions), null, "无蜂会话（未知 id）→ null（隐藏）");
  eq(workerBeeIdOf(world, "s-worker", { kind: "studio", id: "ws-a" }, sessions), null, "非蜂显式选中 → null（隐藏）");
}

console.log("ALL BRIEF-BAR SMOKE TESTS PASSED");
