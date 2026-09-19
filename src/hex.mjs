/**
 * 蜂巢晶格数学（纯函数，无依赖）——全插件六边形几何的唯一来源。
 *
 * 约定（design.md D1/D2）：
 *  - 轴向坐标 (q, r)；瓦片为「平顶六边形」（flat-top，上下各一条水平边）；
 *  - 瓦片边长 = 1（外接圆半径 = 1）；世界坐标 y 向上，晶格平铺在 y=0 平面：
 *      x = 1.5 * q
 *      z = sqrt(3) * (r + q/2)
 *  - 邻居方向（轴向）：(+1,0) (+1,-1) (0,-1) (-1,0) (-1,+1) (0,+1)
 *  - hexDist = (|dq| + |dr| + |dq+dr|) / 2
 *  - 领地层数 L（≥1）：补丁 = { cell : hexDist(center, cell) ≤ L−1 }，
 *    容量 capacity(L) = 3L²−3L+1（L=3 → 19 格起步）；
 *  - 防叠加（含一格呼吸缝 G=1）：两领地不相交 ⟺ hexDist(c₁,c₂) > R₁+R₂+G（R=L−1）。
 */

export const SQRT3 = Math.sqrt(3);

/**
 * 场景比例尺锚点（worker-scale-normalization）：工蜂包围球半径 = 0.8 × 瓦片边长
 * （瓦片边长 = 1 → 0.8 世界单位）。几何自洽上界由公式保证：
 *  - 收于瓦片内切圆内：BEE_RADIUS < 内切圆半径 √3/2 ≈ 0.866（余量 0.066）；
 *  - 相邻蜂球不穿插：2 × BEE_RADIUS = 1.6 < 相邻格心距 √3 ≈ 1.732。
 * 蜂体相关间距量（动画半径、悬停高度、气泡锚点、入场/离场位移等）一律以本常量
 * 或其倍率表达式推导，SHALL NOT 散落独立绝对值魔数。
 */
export const BEE_RADIUS = 0.8;

/** 六个轴向邻居方向（逆时针自 +q 起）。 */
export const HEX_DIRECTIONS = Object.freeze([
  Object.freeze({ q: 1, r: 0 }),
  Object.freeze({ q: 1, r: -1 }),
  Object.freeze({ q: 0, r: -1 }),
  Object.freeze({ q: -1, r: 0 }),
  Object.freeze({ q: -1, r: 1 }),
  Object.freeze({ q: 0, r: 1 })
]);

export function hexAdd(a, b) {
  return { q: a.q + b.q, r: a.r + b.r };
}

export function hexSub(a, b) {
  return { q: a.q - b.q, r: a.r - b.r };
}

export function hexEqual(a, b) {
  return a.q === b.q && a.r === b.r;
}

export function hexKey(a) {
  return a.q + "," + a.r;
}

/** 两格的轴向距离（六格距离）。 */
export function hexDist(a, b) {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

/** 轴向 → 世界坐标（y=0 平面，x/z）。scale 为瓦片边长。 */
export function worldOf(cell, scale = 1) {
  return {
    x: 1.5 * scale * cell.q,
    z: SQRT3 * scale * (cell.r + cell.q / 2)
  };
}

/**
 * 世界坐标 → 最近格（cube rounding）。先做连续轴向反演，再按立方坐标取整。
 */
export function cellOf(x, z, scale = 1) {
  const qf = x / (1.5 * scale);
  const rf = z / (SQRT3 * scale) - qf / 2;
  return cubeRound(qf, rf, -qf - rf);
}

/** 立方坐标舍入（Red Blob Games 标准算法）。 */
export function cubeRound(qf, rf, sf) {
  let q = Math.round(qf);
  let r = Math.round(rf);
  const s = Math.round(sf);
  const dq = Math.abs(q - qf);
  const dr = Math.abs(r - rf);
  const ds = Math.abs(s - sf);
  if (dq > dr && dq > ds) q = -r - s;
  else if (dr > ds) r = -q - s;
  return { q, r };
}

/** 以 origin 为圆心、radius 半径的一圈格（6·radius 个；radius=0 返回空）。 */
export function ringCells(origin, radius) {
  const cells = [];
  if (radius <= 0) return cells;
  let cell = origin;
  for (let i = 0; i < radius; i++) cell = hexAdd(cell, HEX_DIRECTIONS[4]);
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      cells.push(cell);
      cell = hexAdd(cell, HEX_DIRECTIONS[i]);
    }
  }
  return cells;
}

/**
 * 螺旋序：center 本身 + 半径 1..maxRadius 的环依次拼接。
 * 这是蜂位分配与默认搬巢落位共用的稳定遍历序。
 */
export function spiralCells(origin, maxRadius) {
  const cells = [origin];
  for (let radius = 1; radius <= maxRadius; radius++) cells.push(...ringCells(origin, radius));
  return cells;
}

/** L 层领地的容量：3L²−3L+1（L=1→1, 2→7, 3→19, 4→37, 5→61…）。 */
export function capacity(layer) {
  return 3 * layer * layer - 3 * layer + 1;
}

/** 领地补丁内的全部格（spiral 序，容量个）。 */
export function territoryCells(center, layer) {
  return spiralCells(center, Math.max(0, layer - 1));
}

/**
 * 容纳 count 只蜂所需层数；不低于 minLayer（设计锁定 ≥3 层起步）。
 */
export function layersForCount(count, minLayer = 3) {
  let layer = Math.max(1, minLayer);
  while (capacity(layer) < count) layer++;
  return layer;
}

/** 领地外接半径 R = L−1（格单位）。 */
export function territoryRadius(layer) {
  return Math.max(0, layer - 1);
}

/**
 * 两领地是否可共存（防叠加公式，含 gap 格呼吸缝，默认 G=1）：
 * hexDist(c1, c2) > R1 + R2 + gap
 */
export function canCoexist(c1, layer1, c2, layer2, gap = 1) {
  return hexDist(c1, c2) > territoryRadius(layer1) + territoryRadius(layer2) + gap;
}

/** 巢墙（正六棱柱）外接半径（世界单位）：sqrt(3)·(R + 0.5)。顶点朝 0°族、
 *  平边朝 30°族邻居轴——相邻巢间墙间距恒为正（见实施记录，防 z-fighting）。 */
export function wallRadius(layer, scale = 1) {
  return SQRT3 * (territoryRadius(layer) + 0.5) * scale;
}

/**
 * 领地真实边界（v0.2.2 边缘墙）：成员格与非成员格之间的每一条公共格边。
 * @returns {Array<{mx:number, mz:number, dx:number, dz:number}>}
 *          mx/mz = 边中点世界坐标；dx/dz = 朝外（背离补丁）单位向量。
 *          平顶六边形外接半径 = 边长 = scale，中心到边中点 = √3/2·scale。
 */
export function boundaryEdges(center, layer, scale = 1) {
  const cells = spiralCells(center, Math.max(0, layer - 1));
  const member = new Set(cells.map(hexKey));
  const edges = [];
  for (const cell of cells) {
    for (const dir of HEX_DIRECTIONS) {
      const n = hexAdd(cell, dir);
      if (member.has(hexKey(n))) continue;
      const c = worldOf(cell, scale);
      const w = worldOf(n, scale);
      let dx = w.x - c.x;
      let dz = w.z - c.z;
      const len = Math.hypot(dx, dz) || 1;
      dx /= len;
      dz /= len;
      const theta = Math.atan2(dz, dx);
      const apothem = (SQRT3 / 2) * scale;
      edges.push({
        mx: c.x + Math.cos(theta) * apothem,
        mz: c.z + Math.sin(theta) * apothem,
        dx,
        dz
      });
    }
  }
  return edges;
}

/**
 * 领地内部隔断（neon-scene-overhaul 内墙）：成员格与成员格之间的公共格边
 * （无序对去重——每条内部边只产出一次）。
 * @returns {Array<{mx:number, mz:number, dx:number, dz:number}>}
 *          同 boundaryEdges；dx/dz = 两格连线方向单位向量（面板法线，
 *          DoubleSide 下方向无语义）。
 */
export function interiorEdges(center, layer, scale = 1) {
  const cells = spiralCells(center, Math.max(0, layer - 1));
  const member = new Set(cells.map(hexKey));
  const edges = [];
  const seen = new Set();
  for (const cell of cells) {
    const cellKey = hexKey(cell);
    for (const dir of HEX_DIRECTIONS) {
      const n = hexAdd(cell, dir);
      const nKey = hexKey(n);
      if (!member.has(nKey)) continue; // 只保留两侧都是成员的公共边
      const pairKey = cellKey < nKey ? cellKey + "|" + nKey : nKey + "|" + cellKey;
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);
      const c = worldOf(cell, scale);
      const w = worldOf(n, scale);
      let dx = w.x - c.x;
      let dz = w.z - c.z;
      const len = Math.hypot(dx, dz) || 1;
      dx /= len;
      dz /= len;
      const theta = Math.atan2(dz, dx);
      const apothem = (SQRT3 / 2) * scale;
      edges.push({
        mx: c.x + Math.cos(theta) * apothem,
        mz: c.z + Math.sin(theta) * apothem,
        dx,
        dz
      });
    }
  }
  return edges;
}
