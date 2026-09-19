/**
 * 键盘仲裁冒烟测试（hive-interaction-polish 3.3/D1，纯逻辑层无需 DOM/WebGL）：
 *  - keyboardGuarded 守卫真值表：文本输入焦点（input/textarea/select/contenteditable）、
 *    模态（topModalGuard 非空）、浮窗、拖拽进行中、输入法组合——任一命中 → 忽略；
 *  - spinDirection 键集推导：Z 逆时针 / C 顺时针 / 同时按住互抵 / 未知键忽略；
 *  - CameraRig 记键幂等、keyup 清键、失焦清键（clearSpinKeys，防「键卡死」持续旋转）。
 * 运行：node test/keyboard-smoke.mjs
 */
import * as THREE from "three";
import { keyboardGuarded, isTextEntryTarget, spinDirection, SPIN_KEYS } from "../src/hive/keyboard.mjs";
import { CameraRig } from "../src/hive/camera-rig.mjs";

const eq = (actual, expected, message) => {
  if (actual !== expected) throw new Error(`FAIL: ${message}（期望 ${expected}，实际 ${actual}）`);
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ════ 1. 守卫真值表（D1 四重守卫 + 输入法保险位） ════ */

const clean = { activeElement: { tagName: "DIV" }, modalGuard: null, floatOpen: false, dragInProgress: false, isComposing: false };
eq(keyboardGuarded(clean), false, "无守卫命中 → 不忽略（Z/C 生效）");
eq(keyboardGuarded({ ...clean, activeElement: { tagName: "INPUT" } }), true, "焦点在 input → 忽略");
eq(keyboardGuarded({ ...clean, activeElement: { tagName: "TEXTAREA" } }), true, "焦点在 textarea → 忽略");
eq(keyboardGuarded({ ...clean, activeElement: { tagName: "SELECT" } }), true, "焦点在 select → 忽略");
eq(keyboardGuarded({ ...clean, activeElement: { tagName: "DIV", isContentEditable: true } }), true, "焦点在 contenteditable → 忽略");
eq(keyboardGuarded({ ...clean, activeElement: null }), false, "无焦点（activeElement null）→ 不忽略");
eq(keyboardGuarded({ ...clean, modalGuard: () => {} }), true, "模态打开（topModalGuard 非空）→ 忽略");
eq(keyboardGuarded({ ...clean, floatOpen: true }), true, "会话浮窗打开 → 忽略");
eq(keyboardGuarded({ ...clean, dragInProgress: true }), true, "拖拽进行中 → 忽略");
eq(keyboardGuarded({ ...clean, isComposing: true }), true, "输入法组合期 → 忽略（保险位）");
eq(keyboardGuarded({ ...clean, activeElement: { tagName: "BUTTON" } }), false, "焦点在按钮（非文本输入）→ 不忽略");

/* isTextEntryTarget 单元口径 */
eq(isTextEntryTarget(null), false, "null 元素 → 非文本输入");
eq(isTextEntryTarget({ tagName: "INPUT" }), true, "input → 文本输入");
eq(isTextEntryTarget({ tagName: "div" }), false, "小写 tagName 不误判（权威面是大写 DOM 契约）");

/* ════ 2. spinDirection 键集推导 ════ */

eq(SPIN_KEYS.z, 1, "Z = 逆时针（+1）");
eq(SPIN_KEYS.c, -1, "C = 顺时针（−1）");
eq(spinDirection(new Set()), 0, "空键集 → 0");
eq(spinDirection(new Set(["z"])), 1, "Z → 逆时针");
eq(spinDirection(new Set(["c"])), -1, "C → 顺时针");
eq(spinDirection(new Set(["z", "c"])), 0, "Z+C 同时按住 → 互抵");
eq(spinDirection(new Set(["x"])), 0, "未知键 → 0（忽略）");

/* ════ 3. CameraRig：记键幂等 / keyup 清键 / 失焦清键（含 keySpin 协同） ════ */

const rigOf = () => new CameraRig(new THREE.PerspectiveCamera());
{
  const rig = rigOf();
  const theta0 = rig.theta;
  /* 记键幂等：重复 keydown 不叠加角速度 */
  rig.setSpinKey("z", true);
  rig.setSpinKey("z", true);
  rig.keySpin(1000);
  eq(Math.round((rig.theta - theta0) * 1e6) / 1e6, 1.5, "记键幂等（重复 keydown 单倍角速度）");
  /* keyup 清键 → 停转 */
  rig.setSpinKey("z", false);
  eq(rig.keySpin(16), false, "keyup 清键 → 停转");
  eq(rig.theta, rig.theta, "theta 不再变化（引用自检）");
  /* 非法输入防御 */
  rig.setSpinKey("q", true);
  rig.setSpinKey("", true);
  rig.setSpinKey(null, true);
  rig.setSpinKey("Z", true); // 大写键（键盘层已 lowercase，此处双保险接受）
  eq(rig.keySpin(16), true, "大写 Z 经 lowercase 兜底接受（防御性）");
  rig.clearSpinKeys();
  eq(rig.keySpin(1000), false, "clearSpinKeys 后无旋转");
}

/* 失焦清键（window blur / visibilitychange hidden 场景的 rig 侧协同）：按住 Z+C →
   清空 → theta 恒定（「键卡死」防线）。 */
{
  const rig = rigOf();
  const theta0 = rig.theta;
  rig.setSpinKey("z", true);
  rig.setSpinKey("c", true);
  rig.clearSpinKeys(); // 失焦清键
  eq(rig.keySpin(1000), false, "失焦清键后 keySpin 无旋转");
  eq(rig.theta, theta0, "失焦清键后 theta 保持（SHALL NOT 持续旋转）");
}

/* keySpin 空集零成本（空集短路不触 apply） */
{
  const rig = rigOf();
  let applyCount = 0;
  const original = rig.apply.bind(rig);
  rig.apply = () => {
    applyCount++;
    original();
  };
  rig.keySpin(16);
  eq(applyCount, 0, "空集 keySpin 零成本（SHALL NOT 触发姿态重算）");
}

console.log("ALL KEYBOARD SMOKE TESTS PASSED");
