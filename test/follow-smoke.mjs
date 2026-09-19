/**
 * 镜头跟随当前会话冒烟测试（hive-marquee-and-card-rework 1.1–1.6，纯逻辑层无需 WebGL）：
 *  - 设置默认值：followCurrent 默认开（1.1）；
 *  - 一次性迁移哨兵（1.2）：存量用户旧默认 false 随写落盘 → 首次归一化强制翻 true +
 *    写标记；此后显式关闭被永久尊重（布尔无法值迁移，标记是唯一迁移通道）；
 *  - 可选中工蜂谓词（1.3 单一出处）：无人机（subagent）/降级停驻蜂/无记录 SHALL NOT
 *    可跟随/框选；
 *  - followBee 飞行语义（1.3）：flyTo 不传 dist = 保持当前距离（纯平移 SHALL NOT 缩放）、
 *    俯角不动；scene running 门禁语义由 followBee 内 `!this.running` 前置返回承载
 *    （HiveScene 需 WebGL 无法无头实例化，门禁行内联断言于 scene 源码走查 6.3）。
 * 运行：node test/follow-smoke.mjs
 */
import * as THREE from "three";
import { DEFAULT_SETTINGS, normalizeSettings } from "../src/settings.mjs";
import { isSelectableWorkerBee } from "../src/hive/scene.mjs";
import { CameraRig } from "../src/hive/camera-rig.mjs";

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 1. 默认值（1.1） ── */
eq(DEFAULT_SETTINGS.followCurrent, true, "DEFAULT_SETTINGS.followCurrent 默认开（1.1）");

/* ── 2. 一次性迁移哨兵（1.2） ── */
/* 全新用户（空档）：默认开 + 标记写入 */
{
  const merged = normalizeSettings({});
  eq(merged.followCurrent, true, "全新用户 → followCurrent = true");
  eq(merged.followCurrentMigrated, true, "全新用户 → 迁移标记写入");
}
/* 存量用户（动过设置，旧默认 false 已随整对象写落盘、无标记）：首次装载强制翻转一次 */
{
  const legacy = { followCurrent: false, cameraPitchDeg: 45, layout: { panelM: 2, panelN: 2, barM: 8, barN: 1 } };
  eq(legacy.followCurrentMigrated, undefined, "前置：存量档无迁移标记");
  const merged = normalizeSettings(legacy);
  eq(merged.followCurrent, true, "存量旧默认 false（无标记）→ 首次归一化强制翻 true（只此一次）");
  eq(merged.followCurrentMigrated, true, "存量迁移 → 标记写入（随整对象落盘）");
}
/* 标记在档 + 显式关闭：SHALL NOT 翻转（开关失效即本迁移方案的否决项，1.2） */
{
  const explicitOff = { followCurrent: false, followCurrentMigrated: true };
  const merged = normalizeSettings(explicitOff);
  eq(merged.followCurrent, false, "标记在档 + 显式 false → 尊重显式关闭（SHALL NOT 翻转）");
  eq(merged.followCurrentMigrated, true, "标记保持");
}
/* 标记在档 + 显式开启：值原样尊重 */
{
  const merged = normalizeSettings({ followCurrent: true, followCurrentMigrated: true });
  eq(merged.followCurrent, true, "标记在档 + 显式 true → 尊重");
}
/* 全生命周期闭环：存量翻转 → 用户显式关闭 → 重进（再归一化）保持关闭 */
{
  const afterMigrate = normalizeSettings({ followCurrent: false });
  const afterUserOff = { ...afterMigrate, followCurrent: false }; // setSettings 整对象写回
  const afterReload = normalizeSettings(afterUserOff);
  eq(afterReload.followCurrent, false, "闭环：翻转一次后显式关闭，重进保持关闭（哨兵只翻转一次）");
}

/* ── 3. 可选中工蜂谓词（1.3 单一出处） ── */
ok(isSelectableWorkerBee({ id: "w1", origin: "user" }) === true, "工蜂（origin=user）→ 可选中");
ok(isSelectableWorkerBee({ id: "w2" }) === true, "无 origin 记录（工蜂缺省）→ 可选中");
ok(isSelectableWorkerBee({ id: "d1", origin: "subagent" }) === false, "无人机（subagent 会话）→ SHALL NOT 可选中");
ok(isSelectableWorkerBee({ id: "d2", origin: "user", droneStandIn: true }) === false, "降级停驻蜂 → SHALL NOT 可选中");
ok(isSelectableWorkerBee(null) === false, "无记录（归档化蜜/空 current）→ SHALL NOT 可选中");
ok(isSelectableWorkerBee(undefined) === false, "undefined → SHALL NOT 可选中");

/* ── 4. followBee 飞行语义（1.3）：flyTo({tx,tz}) 纯平移 ── */
{
  const rig = new CameraRig(new THREE.PerspectiveCamera());
  rig.setPitchDeg(45);
  const { dist, phi, theta } = rig;
  rig.flyTo({ tx: 12, tz: -5 }); // followBee 同款调用形态：不传 dist
  ok(rig.tween != null, "followBee 形态 → 设置 tween（700ms 平滑飞行）");
  eq(rig.tween.to.dist, dist, "不传 dist → tween 终点保持当前距离（SHALL NOT 缩放）");
  eq(rig.tween.to.phi, phi, "tween 保持当前设置俯角");
  eq(rig.tween.to.theta, theta, "tween 保持当前方位角");
  eq(rig.tween.to.tx, 12, "tween 目标点 x = 蜂位");
  eq(rig.tween.to.tz, -5, "tween 目标点 z = 蜂位");
  /* 与 focusBee（dist 压近 ≤14）区分：距离 15 > 14，压近语义不得混入跟随 */
  ok(dist > 14, "前置：当前距离 15（>14）——若误走 focusBee 会压近，纯平移断言可辨");
}

/* ── 5. 跟随与聚焦的语义分界：focusBee 压近、followBee 不压近（防实现期回归） ── */
{
  const rig = new CameraRig(new THREE.PerspectiveCamera());
  rig.setPitchDeg(45);
  rig.flyTo({ tx: 3, tz: 3, dist: Math.min(rig.dist, 14) }); // focusBee 形态
  eq(rig.tween.to.dist, 14, "focusBee 形态 → 距离压近 ≤14（语义分界保留）");
}

console.log("ALL FOLLOW SMOKE TESTS PASSED");
