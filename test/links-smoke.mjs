/**
 * 连线层装配冒烟测试（hive-interaction-polish 7.4，纯函数真值表 + LinkLayer 桩场景直测）：
 *  - beeDroneLinks 显示条件真值表：hover 工蜂 / 选中常驻 / hover 无人机不触发 /
 *    降级停驻蜂不作为源 / 显隐过滤一致（被过滤无人机不在渲染集不画线）；
 *  - summonLinks 真值表：召唤者侧 / 被召唤蜂侧 hover与选中 / 无人机召唤者 /
 *    无触发空集 / 未渲染端点不画 / 去重；
 *  - LinkLayer：空集零写入（visible=false、drawRange 0、position 不置脏）、
 *    命中写入端点坐标（当帧姿态）、第二颜色走 palette 常量、dispose 清理。
 * 运行：node test/links-smoke.mjs
 */
import * as THREE from "three";
import { beeDroneLinks, summonLinks, LinkLayer, MAX_LINKS } from "../src/hive/links.mjs";
import { PALETTE } from "../src/hive/palette.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* 渲染记录夹具（BeeLayer.renderList 同构：pose 为当帧姿态） */
const worker = (id, extra = {}) => ({ id, droneOf: null, pose: { x: 1, y: 1, z: 1 }, world: { x: 1, y: 1, z: 1 }, ...extra });
const droneRec = (id, parentOf, extra = {}) => ({
  id,
  droneOf: { x: 1, y: 1, z: 1 },
  parentOf,
  pose: { x: 2.4, y: 1.4, z: 2.2 }, // 绕飞当帧位置
  world: { x: 2.4, y: 1.4, z: 2.2 },
  ...extra
});

/* ════ 1. beeDroneLinks 真值表 ════ */
{
  const rendered = [
    worker("p1"),
    droneRec("d1", "p1"),
    droneRec("d2", "p1"),
    worker("p2"),
    worker("std1", { droneStandIn: true }) // 降级停驻蜂（无绕飞无人机）
  ];
  eq(beeDroneLinks({ hoverId: "p1", hoverKind: "bee", selectedId: null, rendered }), [["p1", "d1"], ["p1", "d2"]], "hover 工蜂 → 全部可见无人机");
  eq(beeDroneLinks({ hoverId: null, hoverKind: null, selectedId: "p1", rendered }), [["p1", "d1"], ["p1", "d2"]], "选中常驻（当前会话工蜂，无悬停）");
  eq(beeDroneLinks({ hoverId: "d1", hoverKind: "drone", selectedId: null, rendered }), [], "hover 无人机 SHALL NOT 显示从属连线");
  eq(beeDroneLinks({ hoverId: "std1", hoverKind: "bee", selectedId: null, rendered }), [], "降级停驻蜂（kind bee）无无人机可连");
  eq(beeDroneLinks({ hoverId: "d1", hoverKind: "drone", selectedId: "p1", rendered }), [], "hover 无人机抑制全部从属连线（含父蜂与兄弟无人机的选中常驻连线，spec 场景「悬停无人机不显示」）");
  /* 显隐过滤一致：done 无人机被过滤（不在 rendered）→ 不画线 */
  const filtered = [worker("p1"), droneRec("d1", "p1")]; // d2 (done) 被过滤缺席
  eq(beeDroneLinks({ hoverId: "p1", hoverKind: "bee", selectedId: "p1", rendered: filtered }), [["p1", "d1"]], "被显隐过滤的无人机 SHALL NOT 被画线");
}

/* ════ 2. summonLinks 真值表 ════ */
{
  const rendered = [
    worker("p1", { summonedTo: ["c1", "c-ghost"] }), // c-ghost 未渲染
    droneRec("d1", "p1", { summonedTo: ["c2"] }), // 无人机召唤者
    worker("c1", { summonedBy: "p1" }),
    worker("c2", { summonedBy: "d1" }),
    worker("p2")
  ];
  eq(summonLinks({ hoverId: "p1", hoverKind: "bee", selectedId: null, rendered }), [["p1", "c1"]], "召唤者 hover → 指向全部被召唤蜂（未渲染端点跳过）");
  eq(summonLinks({ hoverId: "c1", hoverKind: "bee", selectedId: null, rendered }), [["p1", "c1"]], "被召唤蜂 hover → 指向它的边（child 侧显示）");
  eq(summonLinks({ hoverId: "d1", hoverKind: "drone", selectedId: null, rendered }), [["d1", "c2"]], "无人机召唤者 hover → 召唤边照常显示（正交规则）");
  eq(summonLinks({ hoverId: null, hoverKind: null, selectedId: "c2", rendered }), [["d1", "c2"]], "选中被召唤蜂 → 常驻显示");
  eq(summonLinks({ hoverId: "p2", hoverKind: "bee", selectedId: null, rendered }), [], "无召唤关系对象 hover → 空集");
  eq(summonLinks({ hoverId: null, hoverKind: null, selectedId: null, rendered }), [], "无触发 → 空集");
  /* 去重：hover 召唤者 + 选中被召唤蜂 → 同一条边只画一次 */
  eq(summonLinks({ hoverId: "p1", hoverKind: "bee", selectedId: "c1", rendered }), [["p1", "c1"]], "两侧同时触发去重");
  /* hover 蜜杯/巢（kind 不触发集）→ 空集 */
  eq(summonLinks({ hoverId: "p1", hoverKind: "studio", selectedId: null, rendered }), [], "非蜂 hover 不触发召唤边");
}

/* ════ 3. LinkLayer：空集零写入 / 命中写入 / 第二颜色 / dispose ════ */
{
  const sceneStub = { add() {}, remove() {} };
  const layer = new LinkLayer(sceneStub);
  /* 空集零成本 */
  layer.frame({ hover: null, selectedId: null, bees: { renderList: [], beeMap: new Map() } });
  eq(layer.beeDrone.lines.visible, false, "空集 → 蜂→无人机集不可见");
  eq(layer.summon.lines.visible, false, "空集 → 召唤集不可见");
  eq(layer.beeDrone.geometry.drawRange.count, 0, "空集 → drawRange 0（零写入）");
  ok(!layer.beeDrone.geometry.attributes.position.needsUpdate, "空集 → position 未置脏（零上传）");
  eq(layer.beeDrone.pairs, 0, "空集 → 计数 0");
  /* 幂等空清：再次空集 frame 依旧零成本 */
  layer.frame({ hover: null, selectedId: null, bees: { renderList: [], beeMap: new Map() } });
  ok(!layer.beeDrone.geometry.attributes.position.needsUpdate, "幂等空集（重复 frame 不置脏）");

  /* 命中写入：hover 工蜂（2 无人机）+ 召唤者 hover */
  const records = new Map(
    [
      worker("p1", { summonedTo: ["c1"] }),
      droneRec("d1", "p1"),
      droneRec("d2", "p1"),
      worker("c1", { summonedBy: "p1" })
    ].map((r) => [r.id, r])
  );
  const renderList = [...records.values()];
  layer.frame({ hover: { kind: "bee", id: "p1" }, selectedId: null, bees: { renderList, beeMap: records } });
  eq(layer.beeDrone.lines.visible, true, "hover 工蜂 → 蜂→无人机连线可见");
  eq(layer.beeDrone.geometry.drawRange.count, 4, "两条连线 = 4 顶点");
  const pos = layer.beeDrone.geometry.attributes.position.array;
  const near3 = (a, b) => Math.abs(a - b) < 1e-5; // Float32Array 存储精度
  ok(near3(pos[0], 1) && near3(pos[1], 1) && near3(pos[2], 1), "端点 a = 蜂当帧姿态");
  ok(near3(pos[3], 2.4) && near3(pos[4], 1.4) && near3(pos[5], 2.2), "端点 b = 无人机绕飞当帧位置（逐帧跟随源）");
  eq(layer.summon.lines.visible, true, "召唤者 hover → 召唤边可见");
  eq(layer.summon.geometry.drawRange.count, 2, "一条召唤边 = 2 顶点");
  /* 第二颜色走 palette 常量（可区分） */
  eq(layer.beeDrone.material.color.getHex(), PALETTE.linkBeeDrone, "蜂→无人机 = palette.linkBeeDrone");
  eq(layer.summon.material.color.getHex(), PALETTE.linkSummon, "召唤边 = palette.linkSummon（第二颜色）");
  ok(PALETTE.linkBeeDrone !== PALETTE.linkSummon, "两类连线颜色可区分");
  ok(layer.beeDrone.material.transparent && layer.summon.material.transparent, "半透明材质");
  ok(!layer.beeDrone.material.depthWrite && !layer.summon.material.depthWrite, "depthWrite:false（透明件纪律）");

  /* 触发消失 → 整层回隐（零残留） */
  layer.frame({ hover: null, selectedId: null, bees: { renderList, beeMap: records } });
  eq(layer.beeDrone.lines.visible, false, "hover 移出 → 连线消失");
  eq(layer.summon.lines.visible, false, "触发消失 → 召唤边消失");
  eq(layer.beeDrone.geometry.drawRange.count, 0, "消失 → drawRange 0");

  /* 选中常驻：当前会话工蜂 */
  layer.frame({ hover: null, selectedId: "p1", bees: { renderList, beeMap: records } });
  eq(layer.beeDrone.lines.visible, true, "选中常驻（无悬停）");

  /* 端点缺失（记录不在 beeMap）→ 跳过该线不崩溃 */
  const brokenMap = new Map([["d1", records.get("d1")]]); // p1 缺席
  layer.frame({ hover: { kind: "bee", id: "p1" }, selectedId: null, bees: { renderList, beeMap: brokenMap } });
  eq(layer.beeDrone.lines.visible, false, "端点记录缺失 → 该线跳过（整集回隐）");

  /* dispose 清理（几何/材质释放、出场景） */
  layer.dispose();
  ok(true, "dispose 无异常");
}

/* 容量常量 sanity */
ok(MAX_LINKS >= 16, "连线容量上限覆盖两簇无人机 + 召唤边量级");

console.log("ALL LINKS SMOKE TESTS PASSED");
