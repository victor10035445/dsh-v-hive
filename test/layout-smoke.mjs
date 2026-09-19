/**
 * 布局算法冒烟测试：默认螺旋落位不叠加、收缩滞回、蜂位稳定分配。
 * 运行：node test/layout-smoke.mjs
 */
import { placeStudios, nextLayer, allocateSlots, allPairsValid } from "../src/layout.mjs";
import { hexKey } from "../src/hex.mjs";

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 默认落位：多个巢不叠加（含一格呼吸缝） ── */
const entries = Array.from({ length: 12 }, (_, i) => ({ workspaceId: "ws-" + i, layer: 3 }));
const { placements } = placeStudios(entries, {});
eq(placements.size, 12, "12 巢全部落位");
const layers = new Map(entries.map((e) => [e.workspaceId, e.layer]));
ok(allPairsValid(placements, layers), "默认落位两两不叠加");
ok(placements.get("ws-0").q === 0 && placements.get("ws-0").r === 0, "首巢落原点");

/* 保存位被尊重 */
const saved = { "ws-0": { q: 10, r: 10 } };
const placed2 = placeStudios(entries.slice(0, 2), saved);
eq(hexKey(placed2.placements.get("ws-0")), hexKey({ q: 10, r: 10 }), "保存位被尊重");

/* 保存位与现有领地冲突 → 重排且报 displaced */
const savedConflict = placeStudios([{ workspaceId: "a", layer: 3 }], { a: { q: 0, r: 0 } });
eq(savedConflict.displaced.length, 0, "首个巢落原点不算 displaced");
const placed3 = placeStudios([{ workspaceId: "a", layer: 3 }, { workspaceId: "b", layer: 3 }], { b: { q: 0, r: 0 } });
ok(placed3.displaced.includes("b"), "b 的保存位(0,0)撞上 a 的默认位 → displaced");
ok(allPairsValid(placed3.placements, new Map([["a", 3], ["b", 3]])), "重排后依然两两不叠加");

/* ── 收缩滞回（design.md D1/F2） ── */
let h = nextLayer(4, 5, 0); // 5 蜂 → 3 层目标 < 4 层
eq(h.layer, 4, "首次低于阈值不降层（需 capacity(L−2)）");
ok(h.strikes === 1, "滞回计数 +1");
h = nextLayer(h.layer, 5, h.strikes);
eq(h.layer, 3, "连续第二次降一层");
eq(h.strikes, 0, "降层后计数清零");
h = nextLayer(3, 20, 0);
eq(h.layer, 4, "扩环即时（20 蜂从 3 层扩到 4 层）");
h = nextLayer(5, 30, 3);
eq(h.layer, 5, "30 蜂（>19）不满足 capacity(L−2)=19 之下不降");
h = nextLayer(5, 7, 0);
ok(h.layer === 5 && h.strikes === 1, "7 蜂在 5 层：首刷计数");

/* ── 蜂位分配：粘性 + 最低空位（容量不变式 capacity(layer) ≥ count 由
      nextLayer 即时扩环保证；溢出悬停分支已随死代码路径移除） ── */
const prev = new Map([
  ["s1", 4],
  ["s2", 0]
]);
let alloc = allocateSlots(prev, ["s2", "s1", "s3"], 3);
eq(alloc.get("s2"), 0, "粘性保留 s2@0");
eq(alloc.get("s1"), 4, "粘性保留 s1@4");
eq(alloc.get("s3"), 1, "新蜂取最低空闲格");

/* 离巢后格位回收、剩余蜂不整体搬移 */
alloc = allocateSlots(new Map([["a", 0], ["b", 1], ["c", 2]]), ["b", "c"], 3);
eq(alloc.get("b"), 1, "b 保持格位 1");
eq(alloc.get("c"), 2, "c 保持格位 2");
ok(!alloc.has("a"), "离巢蜂清除");

console.log("ALL LAYOUT SMOKE TESTS PASSED");
