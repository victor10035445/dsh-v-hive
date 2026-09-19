/**
 * 键盘仲裁纯逻辑（hive-interaction-polish 3.1/D1）：守卫真值与 Z/C 键集推导的
 * 唯一出处——client.jsx 统一键盘仲裁层（effect）与冒烟测试共用，行为漂移零容忍的
 * 双源消除（先例：isDroneVisible 单一出处）。
 *
 * 仲裁结构（design.md D1）：window keydown/keyup 由 client.jsx 键盘层接线；
 * Z/C 记键集合由 CameraRig 持有（rig.setSpinKey / clearSpinKeys），渲染循环每帧
 * rig.keySpin(dt) 以固定角速度积分方位角——帧率无关、平滑无跳格。
 */

/** Z/C → 方位角方向（Z = 逆时针 = +1；C = 顺时针 = -1；同时按住互抵 = 0）。
 *  方向语义：theta 增大 = 相机绕目标逆时针公转（俯视地图面，与右键 spin 同一极角坐标系）。 */
export const SPIN_KEYS = Object.freeze({ z: 1, c: -1 });

/** 键盘按住旋转的固定角速度（rad/s）：约 4.2s/整圈——缓慢巡检档，帧率无关。 */
export const KEY_SPIN_OMEGA = 1.5;

/**
 * 守卫真值表（D1 四重守卫 + 输入法保险位；任一命中 → 键盘层忽略该次按键）：
 *  ① activeElement 为文本输入（input/textarea/select/contenteditable）
 *  ② topModalGuard() 非空（设置/蜂群/指令编辑模态打开，Esc 分层同源）
 *  ③ floatOpen（会话浮窗打开，渲染循环已停——双保险）
 *  ④ scene.dragInProgress（拖蜂/搬巢进行中）
 *  ⑤ e.isComposing（输入法组合期，保险位）
 */
export function keyboardGuarded({ activeElement, modalGuard, floatOpen, dragInProgress, isComposing } = {}) {
  if (isComposing) return true;
  if (floatOpen || dragInProgress || modalGuard) return true;
  return isTextEntryTarget(activeElement);
}

/** 文本输入焦点判定（守卫 ①）：焦点在文本类控件时 Z/C/E SHALL 无动作（键入照常）。 */
export function isTextEntryTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable === true;
}

/** Z/C 记键集合 → 方位角方向（+1 逆时针 / -1 顺时针 / 0 无键或互抵）。未知键忽略。 */
export function spinDirection(keys) {
  let dir = 0;
  for (const key of keys ?? []) dir += SPIN_KEYS[key] ?? 0;
  return dir > 0 ? 1 : dir < 0 ? -1 : 0;
}
