/**
 * 左坞让位量计算（纯函数，供 src/client.jsx 与 test/dock-yield-smoke.mjs 共用）。
 *
 * 蜂巢坞是 fixed 左缘贴视口左缘的浮层（explorer 右坞的镜像，见 design.md D7）；
 * 宿主 AppFrame 的会话中列（1fr track）左缘起于官方 sidebar 右侧。只有中列与
 * 坞真正重叠的部分才需要让位：
 *
 *   overlap = max(0, 坞宽 - 中列左缘)
 *   yield   = clamp(overlap, 0, 中列宽 - 最小保留宽度)
 *
 * 最小保留宽度兜底：窗口太窄时宁可让坞压住一部分，也不把会话挤没（D7：floor=320px）。
 * @param {number} colLeft 中列视口左缘（getBoundingClientRect().left）
 * @param {number} colWidth 中列宽度
 * @param {number} viewportWidth 视口宽度
 * @param {number} dockWidth 坞宽度
 * @param {number} [floor=320] 中列最小保留宽度（px）
 * @returns {number} 应让位的像素数（padding-left），≥ 0
 */
export function computeLeftDockYield(colLeft, colWidth, viewportWidth, dockWidth, floor = 320) {
  const overlap = Math.max(0, dockWidth - colLeft);
  return Math.max(0, Math.min(overlap, colWidth - floor));
}
