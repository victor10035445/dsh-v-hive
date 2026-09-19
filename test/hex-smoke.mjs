/**
 * 晶格尖刺单测（M0 尖刺 2.1）：hexDist 占据检查纯函数 + 晶格基本量。
 * 运行：node test/hex-smoke.mjs
 */
import {
  hexDist,
  hexAdd,
  hexKey,
  ringCells,
  spiralCells,
  capacity,
  layersForCount,
  territoryCells,
  canCoexist,
  wallRadius,
  cellOf,
  worldOf,
  HEX_DIRECTIONS,
  SQRT3
} from "../src/hex.mjs";

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};
const close = (actual, expected, message, eps = 1e-9) => {
  if (Math.abs(actual - expected) > eps) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};

/* ── hexDist ── */
eq(hexDist({ q: 0, r: 0 }, { q: 0, r: 0 }), 0, "自身距离 0");
eq(hexDist({ q: 0, r: 0 }, { q: 1, r: 0 }), 1, "相邻 1");
eq(hexDist({ q: 0, r: 0 }, { q: 3, r: -3 }), 3, "对角 3");
eq(hexDist({ q: -2, r: 5 }, { q: 1, r: -4 }), 9, "负坐标（dq=3, dr=−9, dq+dr=−6 → (3+9+6)/2=9）");
for (const dir of HEX_DIRECTIONS) {
  eq(hexDist({ q: 0, r: 0 }, dir), 1, "六邻居距离都是 1");
}

/* ── 容量公式 3L²−3L+1 ── */
eq(capacity(1), 1, "L=1 → 1");
eq(capacity(2), 7, "L=2 → 7");
eq(capacity(3), 19, "L=3 → 19（≥3 层起步）");
eq(capacity(4), 37, "L=4 → 37");
eq(capacity(5), 61, "L=5 → 61");

/* ── 蜂群扩环判定 ── */
eq(layersForCount(0), 3, "0 蜂也是 3 层起步");
eq(layersForCount(19), 3, "19 蜂 3 层");
eq(layersForCount(20), 4, "20 蜂扩到 4 层");
eq(layersForCount(37), 4, "37 蜂 4 层");
eq(layersForCount(38), 5, "38 蜂扩到 5 层");

/* ── 环 / 螺旋 / 补丁 ── */
eq(ringCells({ q: 0, r: 0 }, 1).length, 6, "第一环 6 格");
eq(ringCells({ q: 0, r: 0 }, 2).length, 12, "第二环 12 格");
const spiral = spiralCells({ q: 2, r: -1 }, 3);
eq(spiral.length, capacity(4), "螺旋序覆盖全补丁");
const unique = new Set(spiral.map(hexKey));
eq(unique.size, spiral.length, "螺旋序无重复");
for (const cell of spiral) ok(hexDist(cell, { q: 2, r: -1 }) <= 3, "补丁内格距中心 ≤ R");
eq(territoryCells({ q: 0, r: 0 }, 3).length, 19, "3 层补丁 = 19 格");

/* ── 防叠加公式：hexDist > R₁+R₂+G（G=1） ── */
ok(canCoexist({ q: 0, r: 0 }, 3, { q: 7, r: 0 }, 3), "hexDist 7 > 2+2+1 → 可共存");
ok(!canCoexist({ q: 0, r: 0 }, 3, { q: 5, r: 0 }, 3), "hexDist 5 ≤ 2+2+1 → 叠加拒绝");
ok(canCoexist({ q: 0, r: 0 }, 3, { q: 6, r: 0 }, 3), "hexDist 6 = 2+2+1+1 → 恰好一格缝");
ok(!canCoexist({ q: 0, r: 0 }, 4, { q: 6, r: 0 }, 4), "更大巢 6 格距不够");

/* ── 世界坐标换算（平顶六边形，边长 1） ── */
close(worldOf({ q: 1, r: 0 }).x, 1.5, "q+1 → x+1.5");
close(worldOf({ q: 1, r: 0 }).z, SQRT3 / 2, "q+1 → z+√3/2");
close(worldOf({ q: 0, r: 1 }).z, SQRT3, "r+1 → z+√3");
for (const cell of spiralCells({ q: 3, r: 4 }, 5)) {
  const w = worldOf(cell);
  const back = cellOf(w.x, w.z);
  eq(hexKey(back), hexKey(cell), "world→cell 往返一致 " + hexKey(cell));
}

/* ── 巢墙半径：相邻巢墙面间距恒正 ── */
const wallR3 = wallRadius(3);
close(wallR3, SQRT3 * 2.5, "3 层巢墙外接半径 √3·2.5");
/* 两个 3 层巢最小合法距离 hexDist=6 → 世界距 6·√3 ≈ 10.392；墙外接半径和 2·2.5·√3 ≈ 8.66 */
ok(6 * SQRT3 > 2 * wallR3, "最小间距下墙外接圆不相交（呼吸缝为正）");

console.log("ALL HEX SMOKE TESTS PASSED");
