/**
 * 左坞让位量冒烟测试（computeLeftDockYield 边界，explorer dock-yield-smoke 的镜像）：
 *  - 无 sidebar（中列左缘 = 0）：让位 = dock 全宽
 *  - sidebar 盖得住 dock：不让位
 *  - dock 压进中列一部分：只让实际重叠量
 *  - 中列太窄：最小保留宽度兜底
 * 运行：node test/dock-yield-smoke.mjs
 */
import { computeLeftDockYield } from "../src/dock-yield.mjs";

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};

/* 无 sidebar：中列左缘 ≈ 0，让位 = dock 全宽 */
eq(computeLeftDockYield(0, 1500, 1920, 300), 300, "无 sidebar 时让出 dock 全宽");
eq(computeLeftDockYield(0, 1500, 1920, 560), 560, "宽 dock 同样全让");

/* sidebar 比 dock 宽（colLeft ≥ dock 宽）：dock 只盖 sidebar，不让位 */
eq(computeLeftDockYield(360, 1100, 1920, 300), 0, "sidebar 盖得住 dock 时不让位");

/* dock 压进中列一部分：只让重叠量（dock 宽 560、中列左缘 360 → 重叠 200px） */
eq(computeLeftDockYield(360, 1220, 1920, 560), 200, "部分重叠时只让重叠量");

/* 中列太窄：最小保留宽度兜底 */
eq(computeLeftDockYield(0, 500, 1920, 300), 180, "中列 500px 只让 180px（保底 320）");
eq(computeLeftDockYield(0, 300, 1920, 300), 0, "中列已到保底线，不再让");
eq(computeLeftDockYield(0, 200, 1920, 300), 0, "中列低于保底线，clamp 到 0");

/* 组合：dock 560、中列左缘 100、宽 700 → 重叠 460，保底只允许 380 */
eq(computeLeftDockYield(100, 700, 1920, 560), 380, "窄窗口下按保底 clamp");

console.log("ALL DOCK-YIELD SMOKE TESTS PASSED");
