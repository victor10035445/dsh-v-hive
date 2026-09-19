/**
 * 场景色彩脚本（neon-scene-overhaul design.md D11，二轮目检定稿）：
 * 场景全部视觉色在此集中定义。二轮定稿方向（用户确认）：
 *  - 大地板尽量灰度（深灰底 + 暗灰蜂窝线），霓虹不落在公共地面上；
 *  - 巢墙 = 霓虹金透感、巢内地砖 = 金 + 黑色内描边（金为暖 accent 家族）；
 *  - 琥珀蜜杯仍是 HDR 暖辉光体；蜂状态四色语义不变；
 *  - 环境雾已移除（二轮反馈），清屏色与天穹地面半区同源。
 * scene / tiles / walls / cups / outline-pass / motes 统一引用本模块。
 */

/* 16 进制数字 → canvas 绘制用的 CSS 颜色串（程序纹理画笔）。 */
export function css(hex) {
  return "#" + Number(hex).toString(16).padStart(6, "0");
}

export const PALETTE = Object.freeze({
  /* ── 数字虚空（天穹 / 清屏；无雾环境） ── */
  voidTop: 0x16102e, // 天穹顶部深靛紫
  horizonGlow: 0x22d3ee, // 地平线青色辉光带（低强度）
  voidGround: 0x0d0b1e, // 天穹地面半区起始深靛（= 清屏色，无雾语义）
  groundDeep: 0x05050d, // 天穹地面半区渐变终点近黑（保留——渐变本体仍在渲染管线，相机手势重排 D7 避免视觉 churn）

  /* ── 光位（D2，二轮定稿：暖蜜色光——金色主题下金才读金） ── */
  keyLight: 0xffe2b8, // 蜜色暖白主光（投影/随动保留）
  rimPurple: 0xb58cff, // 品紫 rim 逆光（蜂体轮廓分离，与金互补）
  hemiSky: 0xd8c49a, // 半球光天顶暖沙
  hemiGround: 0x1a1033, // 半球光地面深紫
  ambient: 0xe6dcc8, // 环境光暖白（强度 0.5）

  /* ── 琥珀（暖 accent，蜜杯 HDR 辉光） ── */
  amberAccent: 0xe8a63c, // 蜜杯主色
  amberEmber: 0x7a4d10, // 蜜杯 emissive 基色（×1.4 HDR，D6）

  /* ── 大地板：灰度基板（二轮定稿：霓虹不落在公共地面） ── */
  floorBase: 0x121212, // 深灰底
  floorLine: 0x2f2f35, // 暗灰蜂窝线（近无彩度）

  /* ── 巢内地砖：金色瓦片（五轮：去掉黑色内描边） ── */
  padBase: 0x93702c, // 金色砖底
  padInner: 0xb08e33, // 稍亮金内圈
  floorUnder: 0x241b0c, // 砖背面暗铜窖顶

  /* ── 巢墙：霓虹金透感（D5 二轮定稿） ── */
  wallGold: 0x8a6a24, // 金色墙板基色（透感半透明）
  wallGoldEmissive: 0xe8a63c, // 墙板金色自发光（霓虹金透感）
  wallTrim: 0xf2b544, // 顶缘金饰条（HDR emissive，Bloom 阈值上发光体）

  /* ── 选中描边（D10；五轮：所有外描边高亮统一白色） ── */
  outline: 0xffffff, // 选中描边合成色 白（遮罩 maskMaterial 白色不动）

  /* ── 数据萤尘（D9） ── */
  moteCyan: 0x7ce8f5, // 加法混合微点

  /* ── 六边形升起光墙（hex-rise-fx）：代码级预设，暂不进「外观」页签
      （避免设置膨胀；APPEARANCE_REV 不动）。初值目检定稿（任务 4.2）。 ── */
  hexFxWhite: 0xffffff, // 瓦片选中·驻留（与描边白同族）
  hexFxGray: 0x8b93a0, // 拖拽落点·跟随（位置语义，恒单格）
  hexFxGreen: 0x59e06e, // 蜂完工·一次性（亮于 STATE_COLORS.done 0x57b26a 才读「亮绿」）
  hexFxYellow: 0xffd44d, // 新蜂出场·一次性

  /* ── 底图水印层（hive-watermark D2）：灰衬底 + 浅灰大字，无 emissive——非发光体
      不落 Bloom（霓虹 SHALL NOT 落在公共地面上），色彩脚本单一出处 ── */
  watermarkPlate: 0x34343e, // 水印衬底灰（深灰基板上的半透明圆角牌底）
  watermarkText: 0xd2d6df, // 水印文字浅灰（大号、可读优先）

  /* ── 连线层（hive-interaction-polish 7.1/D6）：两类连线颜色对撞可区分（设计
      开放问题「颜色定稿」按常量落定，不进「外观」页签——避免设置膨胀）。
      蜂→无人机 = 蜜金琥珀（巢归属语义，amberAccent 同族）；
      召唤边 = 品紫（第二颜色，rimPurple 同族）。 ── */
  linkBeeDrone: 0xe8a63c, // 蜂→无人机连线（悬停工蜂 / 选中常驻簇）
  linkSummon: 0xb58cff, // 召唤者→被召唤蜂连线（第二颜色）

  /* ── CSS 暗角（5.2） ── */
  vignetteInner: "rgba(18, 16, 42, 0)", // 中心透明
  vignetteOuter: "rgba(8, 7, 20, 0.62)" // 边缘深靛压暗
});

/** 外观存档版本：默认值发生变更（改默认色/增删项）时递增——旧存档整体落新默认，
 *  避免旧值遮蔽新默认（如五轮描边青→白）。用户自定义在两次默认变更之间保留。 */
export const APPEARANCE_REV = 3;

/** 外观设置默认值（页内设置面板「外观」页签的可调全集）。
 *  颜色一律 CSS hex 串（input[type=color] 直用）；透明度/亮度为 0–1 / HDR 倍数。
 *  与 PALETTE 同源——改 PALETTE 后此处同步即是新默认。 */
export const APPEARANCE_DEFAULTS = Object.freeze({
  outerWallAlpha: 0.7, // 外围墙可见度（70% 可见）
  innerWallAlpha: 0.4, // 内隔墙可见度（40% 可见，恒定无朝向淡出）
  innerTrimAlpha: 0.45, // 内墙轮廓边条透明度（0 = 隐藏）
  trimGlow: 1.9, // 顶缘饰条发光强度（HDR 倍数）
  wallGold: "#8a6a24", // 墙体金色
  trimColor: "#f2b544", // 饰条金色
  floorBase: "#121212", // 基板深灰底
  floorLine: "#2f2f35", // 蜂窝线灰
  padBase: "#93702c", // 地砖金底
  padInner: "#b08e33", // 地砖内圈金
  outlineColor: "#ffffff", // 选中描边白（五轮：所有外描边高亮统一白）
  amberColor: "#e8a63c", // 蜜杯琥珀
  moteColor: "#7ce8f5", // 数据萤尘
  skyTop: "#16102e", // 穹顶深靛紫
  horizonGlow: "#22d3ee" // 地平线辉光青
});

/** CSS hex 串（#rrggbb）→ 数字。 */
export function hexOf(text) {
  const n = Number.parseInt(String(text).replace("#", ""), 16);
  return Number.isFinite(n) ? n : 0;
}
