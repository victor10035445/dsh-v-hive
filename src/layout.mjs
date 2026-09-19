/**
 * 巢位布局算法（纯函数，供客户端派生层与 test/layout-smoke.mjs 共用）。
 *
 * 覆盖 design.md D1 的两个机制：
 *  1. 默认落位：新巢自原点螺旋向外找首个可容纳其 footprint 的落点（不与现有领地叠加）；
 *  2. 收缩滞回：连续两次刷新低于 capacity(L−2) 才降一层（防会话随 blank 翻转忽大忽小）。
 * 以及 D1 的蜂位分配：领地内螺旋填格、格位稳定（粘性保留），扩容最小重排。
 * 扩环即时（nextLayer）保证容量不变式 capacity(layer) ≥ count；「扩环受阻→邻居轻推/
 * 紧凑加密悬停」整条路径为不可达死代码，已移除（bubble-anchor-and-bee-fixes D6：
 * 落位经螺旋全量重排，无格位可分配的蜂不可能出现）。
 */
import {
  capacity,
  canCoexist,
  hexDist,
  hexKey,
  layersForCount,
  spiralCells,
  territoryRadius,
  worldOf
} from "./hex.mjs";

/** 相邻领地间的呼吸缝（格单位，design.md D1/F1：强制一格，防墙体贴面）。 */
export const PLACEMENT_GAP = 1;

/**
 * 为全部工作室解析中心坐标。
 * @param {Array<{workspaceId: string, layer: number}>} entries 稳定顺序（工作区列表序）
 * @param {Record<string, {q:number,r:number}>} saved 宿主端持久化的中心坐标
 * @returns {{placements: Map<string, {q,r}>, displaced: string[]}} displaced = 保存位
 *          与现有领地冲突而被迫重排的 workspaceId（客户端应回写宿主端）。
 */
export function placeStudios(entries, saved = {}) {
  const placements = new Map();
  const displaced = [];
  const placed = []; // { id, layer, cell }
  const consider = (entry, cell) => {
    // 与已放置领地两两校验（可共存 ⟺ hexDist > R1+R2+G）
    for (const other of placed) {
      if (!canCoexist(cell, entry.layer, other.cell, other.layer, PLACEMENT_GAP)) return false;
    }
    return true;
  };
  for (const entry of entries) {
    const radius = Math.max(0, entry.layer - 1);
    const savedCell = saved[entry.workspaceId];
    if (savedCell && Number.isInteger(savedCell.q) && Number.isInteger(savedCell.r) && consider(entry, savedCell)) {
      placements.set(entry.workspaceId, savedCell);
      placed.push({ id: entry.workspaceId, layer: entry.layer, cell: savedCell });
      continue;
    }
    // 默认螺旋落位（含保存位失效时的重排）
    const spiral = spiralCells({ q: 0, r: 0 }, 64);
    let found = null;
    for (const cell of spiral) {
      if (consider(entry, cell)) {
        found = cell;
        break;
      }
    }
    if (!found) found = { q: placements.size * (2 * radius + 2 + PLACEMENT_GAP), r: 0 }; // 理论不可达的兜底
    if (savedCell) displaced.push(entry.workspaceId);
    placements.set(entry.workspaceId, found);
    placed.push({ id: entry.workspaceId, layer: entry.layer, cell: found });
  }
  return { placements, displaced };
}

/**
 * 收缩滞回（design.md D1/F2）：扩环即时；降层需连续两次刷新低于 capacity(L−2)。
 * @returns {{layer: number, strikes: number}}
 */
export function nextLayer(layer, count, strikes, minLayer = 3) {
  const target = layersForCount(count, minLayer);
  if (target > layer) return { layer: target, strikes: 0, expanded: true };
  if (target < layer) {
    // 只在蜂群 shrink 到 capacity(L−2) 以下时累计滞回计数（一层一层降）
    if (count <= capacity(layer - 2)) {
      const nextStrikes = strikes + 1;
      if (nextStrikes >= 2) return { layer: layer - 1, strikes: 0, shrunk: true };
      return { layer, strikes: nextStrikes };
    }
  }
  return { layer, strikes: 0 };
}

/**
 * 蜂位分配：领地内螺旋序填格、格位粘性（稳定），新蜂取最低空闲格。
 * 容量不变式 capacity(layer) ≥ count 由 nextLayer 即时扩环保证——不存在无格位
 * 可分配的蜂（bubble-anchor-and-bee-fixes D6：溢出悬停分支为不可达死代码，已移除）。
 * @param {Map<string, number>|null} prev 上一轮分配（sessionId → 螺旋序号）
 * @param {string[]} orderedIds 本轮蜂群（稳定序：工作区账号序）
 * @param {number} layer 领地层数
 * @returns {Map<string, number>} sessionId → 螺旋序号
 */
export function allocateSlots(prev, orderedIds, layer) {
  const cap = capacity(layer);
  const slots = new Map();
  const taken = new Set();
  const idSet = new Set(orderedIds);
  // 1) 粘性保留仍在群内且未越界的旧格位
  if (prev) {
    for (const [id, index] of prev) {
      if (idSet.has(id) && index < cap && !taken.has(index)) {
        slots.set(id, index);
        taken.add(index);
      }
    }
  }
  // 2) 其余按稳定序填最低空闲格
  let cursor = 0;
  for (const id of orderedIds) {
    if (slots.has(id)) continue;
    while (taken.has(cursor)) cursor++;
    slots.set(id, cursor);
    taken.add(cursor);
  }
  return slots;
}

/**
 * 蜂格 → 领地内世界坐标。cellIndex 为 territoryCells(原点, L) 的螺旋序号。
 */
export function slotWorld(centerCell, layer, index, scale = 1) {
  const cells = spiralCells(centerCell, Math.max(0, layer - 1));
  const cell = cells[Math.min(index, cells.length - 1)];
  return worldOf(cell, scale);
}

/** 全 pairwise 校验（测试与落定校验共用）。 */
export function allPairsValid(placements, layers, gap = PLACEMENT_GAP) {
  const ids = [...placements.keys()];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (!canCoexist(placements.get(ids[i]), layers.get(ids[i]), placements.get(ids[j]), layers.get(ids[j]), gap)) {
        return false;
      }
    }
  }
  return true;
}

/** 布局文档的补丁占据图（axial key → workspaceId），供拾取与巢内地板重建。 */
export function occupancyMap(placements, layers) {
  const map = new Map();
  for (const [id, center] of placements) {
    const layer = layers.get(id) ?? 3;
    for (const cell of spiralCells(center, Math.max(0, layer - 1))) map.set(hexKey(cell), id);
  }
  return map;
}

export { capacity, canCoexist, hexDist, territoryRadius, layersForCount, spiralCells };
