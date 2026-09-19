/**
 * 悬停 tips 字段口径冒烟测试（hive-interaction-polish 6.4，纯函数直测）：
 * 六字段真值表——正常工蜂 / 未绑定蜂种（默认蜂）/ 无人机降级（含降级停驻蜂）/
 * 除零 / 样本不足 1s / 投影缺失；token 四桶合计；SHALL NOT 出现费用字段。
 * 运行：node test/tips-smoke.mjs
 */
import { tipFields, TIP_OFFSET_X, TIP_OFFSET_Y } from "../src/hive/tips.mjs";
import { tipFaceOf } from "../src/bee-model.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

const t = (key) =>
  (
    {
      "hive.tips.drone": "无人机",
      "hive.tips.defaultBee": "默认蜂",
      "hive.tips.avg": "平均",
      "hive.state.idle": "待命",
      "hive.state.busy": "忙碌",
      "hive.state.done": "带蜜归"
    }
  )[key] ?? key;

const workerFace = (tipFace, state = "busy") => ({ state, tipFace });

/* ════ 1. 正常工蜂：六字段齐备 ════ */
{
  const face = workerFace(
    tipFaceOf(
      {
        projectionValues: {
          tokenUsage: { uncachedInput: 100, output: 200, cacheRead: 300, cacheWrite: 400 },
          sessionStats: { decodeTokens: 2400, decodeMs: 200000 }
        }
      },
      { workspaceId: "ws-a", sessionCount: 5 }
    )
  );
  const f = tipFields({ face, overlay: { beeTypeName: "设计蜂" }, studioTitle: "项目巢", t });
  eq(f.type, "设计蜂", "类型 = 引擎蜂种徽章名");
  eq(f.state, "忙碌", "状态 = 既有状态机文案（cards.statusText 同源）");
  eq(f.workspace, "项目巢", "所属工作区 = 巢标题");
  eq(f.sessions, "5", "巢内会话数（含自身）");
  eq(f.tokens, "1000", "token 四桶合计");
  eq(f.dps, "12 t/s · 平均", "平均 DPS = round(2400 ÷ 200000 × 1000)，标注平均");
  ok(Object.keys(f).length === 6, "六字段（SHALL NOT 呈现费用字段）");
  ok(!("cost" in f) && !("fee" in f), "无费用/成本字段（宿主无定价数据）");
}

/* ════ 2. 未绑定蜂种 → 默认蜂 ════ */
{
  const f = tipFields({ face: workerFace(tipFaceOf({}, { workspaceId: "ws-a", sessionCount: 1 })), overlay: null, studioTitle: "项目巢", t });
  eq(f.type, "默认蜂", "未绑定蜂种 → 默认蜂");
  eq(f.sessions, "1", "其余字段照常");
}

/* ════ 3. 无人机降级口径（悬停无人机 + 降级停驻蜂） ════ */
{
  /* 绕飞无人机：droneOf 命中 */
  const droneFace = { state: "busy", droneOf: { x: 0, y: 0, z: 0 }, tipFace: { tokens: null, dps: null, sessions: null, workspaceId: "ws-a" } };
  const f = tipFields({ face: droneFace, overlay: { beeTypeName: "设计蜂" }, studioTitle: "项目巢", t });
  eq(f.type, "无人机", "无人机类型（蜂种绑定被降级口径覆盖）");
  eq(f.state, "忙碌", "状态照常");
  eq(f.workspace, "项目巢", "所属工作区（父巢）照常");
  eq(f.sessions, "-", "会话数量 → -");
  eq(f.tokens, "-", "token → -（无人机镜像可能有 tokenUsage，口径统一 -）");
  eq(f.dps, "-", "平均 DPS → -");
  /* 降级停驻蜂：droneStandIn 命中 */
  const standInFace = { state: "idle", droneStandIn: true, tipFace: { tokens: null, dps: null, sessions: null, workspaceId: "ws-a" } };
  const g = tipFields({ face: standInFace, overlay: null, studioTitle: "项目巢", t });
  eq(g.type, "无人机", "降级停驻蜂类型 = 无人机");
  eq(g.sessions, "-", "降级停驻蜂会话数 → -");
}

/* ════ 4. 缺失回退：除零 / 样本不足 / 投影缺失 ════ */
{
  eq(tipFaceOf({ projectionValues: { sessionStats: { decodeTokens: 100, decodeMs: 0 } } }).dps, null, "decodeMs = 0 → null（除零）");
  eq(tipFaceOf({ projectionValues: { sessionStats: { decodeTokens: 100, decodeMs: 999 } } }).dps, null, "样本不足 1s → null");
  eq(tipFaceOf({ projectionValues: { tokenUsage: {} } }).tokens, 0, "tokenUsage 空对象 → 四桶合计 0（合法值，非缺失）");
  const missing = tipFields({ face: workerFace(null), overlay: null, studioTitle: "", t });
  eq(missing.workspace, "-", "巢标题缺失 → -");
  eq(missing.sessions, "-", "tipFace 缺失 → 会话数 -");
  eq(missing.tokens, "-", "tipFace 缺失 → token -");
  eq(missing.dps, "-", "tipFace 缺失 → DPS -");
  const absent = tipFields({ face: workerFace({ tokens: null, dps: null, sessions: null, workspaceId: null }), overlay: null, studioTitle: "", t });
  eq(absent.tokens, "-", "tokenUsage 缺失（投影缓存未命中）→ -");
}

/* ════ 5. 偏移常量：非零正偏移（指针右下避让蜂顶气泡卡） ════ */
ok(TIP_OFFSET_X > 0 && TIP_OFFSET_Y > 0, "tips 指针偏移常量（避让气泡卡）");

console.log("ALL TIPS SMOKE TESTS PASSED");
