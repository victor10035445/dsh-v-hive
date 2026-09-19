/**
 * 连线层（hive-interaction-polish 7.1/D6/D8）：蜂→无人机 + 召唤者→被召唤蜂。
 *  - 两个 LineSegments 集（各自 BufferGeometry + 独立半透明材质 transparent +
 *    depthWrite:false——ghost/watermark/hex-fx 同款透明件纪律），renderOrder 20
 *    叠于蜂层（10）之上；第二颜色走 palette 常量（linkSummon 品紫对撞 linkBeeDrone
 *    蜜金琥珀）；
 *  - 显示条件（7.2，纯函数 beeDroneLinks / summonLinks 单一出处供冒烟真值表）：
 *      · 蜂→无人机：hover 工蜂 或 当前会话工蜂（选中常驻）；悬停无人机 SHALL NOT
 *        触发；无人机 = 该蜂可见无人机（BeeLayer.renderList 渲染集，与显隐过滤口径
 *        一致——被过滤的 done 无人机不画线）；
 *      · 召唤边：召唤者或被召唤蜂任一 hover/选中（无人机召唤者照常，与蜂→无人机
 *        连线规则正交）；边数据来自 deriveWorld 装配的 summonedBy/summonedTo 双索引
 *        （失效边在派生层已忽略）；
 *  - 逐帧端点写入（7.3）：从 BeeLayer 当帧记录取位置（record.pose——无人机绕飞、
 *    忙碌低巡逐帧跟随，SHALL NOT 滞后断裂）；
 *  - 空集整层 visible=false 零成本（spec「性能与体验基线」）：不触几何、不置上传、
 *    不建 Set（先于一切分配短路）。
 * 几何选型（D6）：直线为默认——单 buffer 每帧改端点，O(可见连线数)；贝塞尔为后续
 * 渲染增强可选项，本期不启用。
 */
import * as THREE from "three";
import { PALETTE } from "./palette.mjs";

/** 单集容量上限（两簇无人机 + 召唤边的量级封顶；超出截断——显示为部分连线，不报错）。 */
export const MAX_LINKS = 256;

/**
 * 蜂→无人机连线对（7.2，纯函数）：源 = hover 工蜂（kind === "bee"）∪ 当前会话工蜂
 * （选中常驻）。返回 [[beeId, droneId], ...]——无人机从渲染集（rendered，含 parentOf
 * 归属）取，天然满足显隐过滤一致（被过滤的无人机不在渲染集中）。
 * 悬停无人机（含降级停驻蜂）→ SHALL NOT 显示**任何**从属连线（含其父蜂与兄弟
 * 无人机的选中常驻连线，spec bee-summon-links 场景「悬停无人机不显示」）。
 */
export function beeDroneLinks({ hoverId, hoverKind, selectedId, rendered }) {
  const list = rendered ?? [];
  const sources = [];
  if (hoverKind === "bee" && hoverId) sources.push(hoverId);
  if (selectedId && selectedId !== hoverId) sources.push(selectedId);
  if (sources.length === 0) return [];
  if (hoverId) {
    const hovered = list.find((r) => r.id === hoverId);
    if (hovered && (hovered.droneOf || hovered.droneStandIn)) return []; // 悬停无人机：全部从属连线抑制
  }
  const out = [];
  for (const record of list) {
    if (!record.droneOf) continue; // 无人机记录（含绕飞归属 parentOf）
    if (sources.includes(record.parentOf)) out.push([record.parentOf, record.id]);
  }
  return out;
}

/**
 * 召唤边连线对（7.2，纯函数）：召唤者或被召唤蜂任一 hover/选中。触发集命中
 * rendered 记录的 summonedBy（被召唤蜂侧）/ summonedTo（召唤者侧）；两端都必须在
 * 渲染集中（显隐过滤/未渲染会话不画——失效边即时降级）。返回去重后的
 * [[parentId, childId], ...]。
 */
export function summonLinks({ hoverId, hoverKind, selectedId, rendered }) {
  const trigger = new Set();
  if (hoverId && (hoverKind === "bee" || hoverKind === "drone")) trigger.add(hoverId);
  if (selectedId) trigger.add(selectedId);
  if (trigger.size === 0) return [];
  const list = rendered ?? [];
  const idSet = new Set(list.map((r) => r.id)); // 渲染集（触发后才建，空集零分配）
  const out = [];
  const seen = new Set();
  const push = (parentId, childId) => {
    if (parentId === childId || !idSet.has(parentId) || !idSet.has(childId)) return;
    const key = parentId + "→" + childId;
    if (seen.has(key)) return;
    seen.add(key);
    out.push([parentId, childId]);
  };
  for (const record of list) {
    if (record.summonedBy && (trigger.has(record.id) || trigger.has(record.summonedBy))) {
      push(record.summonedBy, record.id); // 被召唤蜂侧显示：指向它的边
    }
    const summonedTo = record.summonedTo;
    if (Array.isArray(summonedTo)) {
      for (const childId of summonedTo) {
        if (trigger.has(record.id) || trigger.has(childId)) push(record.id, childId); // 召唤者侧显示
      }
    }
  }
  return out;
}

export class LinkLayer {
  /** @param {THREE.Scene|{add: Function}} scene 挂载场景（冒烟测试可注入桩） */
  constructor(scene) {
    this.group = new THREE.Group();
    scene?.add?.(this.group);
    this.beeDrone = this._makeSet(PALETTE.linkBeeDrone); // 蜂→无人机：蜜金琥珀（第一色）
    this.summon = this._makeSet(PALETTE.linkSummon); // 召唤边：品紫（第二颜色）
  }

  _makeSet(color) {
    const geometry = new THREE.BufferGeometry();
    const position = new THREE.BufferAttribute(new Float32Array(MAX_LINKS * 6), 3);
    position.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", position);
    geometry.setDrawRange(0, 0);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4, depthWrite: false });
    const lines = new THREE.LineSegments(geometry, material);
    lines.frustumCulled = false;
    lines.renderOrder = 20; // 蜂层（10）之上、特效层之下；无 raycast 参与——不遮挡拾取
    lines.visible = false;
    this.group.add(lines);
    return { lines, geometry, material, pairs: 0 };
  }

  /**
   * 每帧推进（scene.loop 调用，置于 bees.frame 之后——读取当帧姿态）。
   * @param {{hover: object|null, selectedId: string|null, bees: object}} input
   *        bees = BeeLayer 实例（renderList 渲染集 + beeMap 记录表）
   */
  frame({ hover, selectedId, bees } = {}) {
    const hoverId = hover && (hover.kind === "bee" || hover.kind === "drone") ? hover.id : null;
    const hoverKind = hover?.kind ?? null;
    if (!hoverId && !selectedId) {
      /* 空集整层零成本：不扫渲染集、不建 Set、不触几何（幂等短路） */
      this._clear(this.beeDrone);
      this._clear(this.summon);
      return;
    }
    const rendered = bees?.renderList ?? [];
    const records = bees?.beeMap ?? new Map();
    this._write(this.beeDrone, beeDroneLinks({ hoverId, hoverKind, selectedId, rendered }), records);
    this._write(this.summon, summonLinks({ hoverId, hoverKind, selectedId, rendered }), records);
  }

  /** 端点写入：两蜂当帧姿态（pose 优先，未定档回落 world 基准位）。 */
  _write(set, pairs, records) {
    if (pairs.length === 0) {
      this._clear(set);
      return;
    }
    const position = set.geometry.attributes.position;
    const array = position.array;
    let n = 0;
    for (const [aId, bId] of pairs) {
      if (n >= MAX_LINKS) break;
      const a = records.get(aId);
      const b = records.get(bId);
      if (!a || !b) continue;
      const pa = a.pose ?? a.world;
      const pb = b.pose ?? b.world;
      if (!pa || !pb) continue; // 当帧姿态缺失（未入渲染/未定档）→ 跳过该线
      array[n * 6] = pa.x;
      array[n * 6 + 1] = pa.y;
      array[n * 6 + 2] = pa.z;
      array[n * 6 + 3] = pb.x;
      array[n * 6 + 4] = pb.y;
      array[n * 6 + 5] = pb.z;
      n++;
    }
    set.pairs = n;
    if (n === 0) {
      this._clear(set);
      return;
    }
    set.geometry.setDrawRange(0, n * 2);
    position.needsUpdate = true;
    set.lines.visible = true;
  }

  /** 清空单集（幂等：已空再清零成本——不触几何不置脏）。 */
  _clear(set) {
    if (set.pairs === 0 && !set.lines.visible) return;
    set.pairs = 0;
    set.geometry.setDrawRange(0, 0);
    set.lines.visible = false;
  }

  dispose() {
    this.group.parent?.remove(this.group);
    for (const set of [this.beeDrone, this.summon]) {
      set.geometry.dispose();
      set.material.dispose();
    }
  }
}
