/**
 * 悬停 tips 层（hive-interaction-polish 6.1/D5）：独立瞬态 DOM 层（cardRoot 兄弟层）。
 *  - 跟随 interact.onHover 的 screen 坐标（画布局部系，指针旁偏移避让蜂顶气泡卡）；
 *  - 整层 pointer-events:none（SHALL NOT 干扰拾取与卡片点击，冲突仅视觉层）；
 *  - 签名节流：内容签名不变只更新 transform（卡片层同款纪律，帧内零 DOM 重建）；
 *  - hover 清理 / pointerleave（onHover(null)）即隐藏，SHALL NOT 残留悬空 tips
 *    （与 hover 同生命周期）。
 * 数据面：六字段经 tipFields 纯函数装配（1.2 的 tipFace 预计算 + overlay 索引 +
 * 巢标题查表）；SHALL NOT 呈现费用/成本字段（宿主无定价数据）。
 */
import { statusText } from "./cards.mjs";

/** tips 相对指针偏移（px）：右下避让——指针下的蜂顶气泡卡向上生长，tips 落右下侧。 */
export const TIP_OFFSET_X = 16;
export const TIP_OFFSET_Y = 20;

const DASH = "-";

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

const isNum = (v) => typeof v === "number" && Number.isFinite(v);

/**
 * 六字段装配（纯函数供冒烟直测，spec bee-hover-tips 字段口径）：
 *  - 类型：引擎蜂种徽章名（overlay.beeTypeName）；未绑定 = 「默认蜂」；无人机 = 「无人机」；
 *  - 状态：既有状态机文案（琥珀 > 蓝 > 绿 > 灰白，复用 cards.statusText）；
 *  - 所属工作区：蜂记录 workspaceId → 巢标题；缺失 `-`；
 *  - 会话数量：tipFace.sessions（巢内工蜂计数含自身）；无人机降级 `-`；
 *  - token 消耗：tipFace.tokens（projectionValues.tokenUsage 四桶合计）；缺失 `-`；
 *  - 平均 DPS：tipFace.dps（decodeTokens ÷ decodeMs × 1000 预计算，样本 <1s 为
 *    null），呈现 `{n} t/s · 平均`；缺失/除零 `-`。
 * 无人机降级口径：类型/状态/所属工作区照常，会话数/token/DPS 统一 `-`（spec——
 * 无人机镜像行可能有 tokenUsage，但口径以 `-` 统一避免歧义）。
 */
export function tipFields({ face, overlay, studioTitle, t }) {
  const isDrone = Boolean(face?.droneOf || face?.droneStandIn);
  const boundName = !isDrone && overlay?.beeTypeName ? String(overlay.beeTypeName) : "";
  const type = isDrone ? t("hive.tips.drone") : boundName || t("hive.tips.defaultBee");
  const state = statusText(t, face?.state);
  const workspace = studioTitle ? String(studioTitle) : DASH;
  const tipFace = face?.tipFace ?? null;
  const sessions = !isDrone && isNum(tipFace?.sessions) ? String(tipFace.sessions) : DASH;
  const tokens = !isDrone && isNum(tipFace?.tokens) ? String(tipFace.tokens) : DASH;
  const dps = !isDrone && isNum(tipFace?.dps) ? `${Math.round(tipFace.dps)} t/s · ${t("hive.tips.avg")}` : DASH;
  return { type, state, workspace, sessions, tokens, dps };
}

export class TipsLayer {
  /**
   * @param {HTMLElement} host 画布容器（canvasWrap；tips 根 = cardRoot 兄弟层）
   * @param {Function} t 文案函数（场景构造时下发，卡片层同款）
   */
  constructor(host, t) {
    this.t = t;
    this.root = document.createElement("div");
    this.root.className = "jyv-tips";
    host.appendChild(this.root);
    this.el = document.createElement("div");
    this.el.className = "jyv-tip";
    this.el.style.display = "none";
    this.root.appendChild(this.el);
    this.sig = null; // 当前内容签名（null = 隐藏态）
  }

  /**
   * 每帧推进（scene.loop 调用）：hover 为蜂/无人机时显示并跟随指针，否则隐藏。
   * @param {{kind: string, id: string, screen: {x, y}, face: object}|null} hover
   * @param {{overlayOf?: Function, studioTitleOf?: Function}} providers 场景查表
   */
  frame(hover, providers = {}) {
    const face = hover && (hover.kind === "bee" || hover.kind === "drone") ? hover.face : null;
    const screen = hover?.screen;
    if (!face || !screen || screen.x == null || screen.y == null) {
      this.hide();
      return;
    }
    const fields = tipFields({
      face,
      overlay: providers.overlayOf?.(hover.id) ?? null,
      studioTitle: face.workspaceId ? providers.studioTitleOf?.(face.workspaceId) ?? "" : "",
      t: this.t
    });
    const sig = `${hover.kind}|${hover.id}|${fields.type}|${fields.state}|${fields.workspace}|${fields.sessions}|${fields.tokens}|${fields.dps}`;
    if (sig !== this.sig) {
      this.sig = sig;
      this.render(fields);
    }
    /* 指针旁偏移 + 视口内收口（越界翻转/夹取；仅 hover 期执行，非每帧热路径常态） */
    const host = this.root.parentElement;
    const width = host?.clientWidth ?? 0;
    const height = host?.clientHeight ?? 0;
    let x = screen.x + TIP_OFFSET_X;
    let y = screen.y + TIP_OFFSET_Y;
    if (width > 0 && x + this.el.offsetWidth > width) x = Math.max(0, screen.x - TIP_OFFSET_X - this.el.offsetWidth);
    if (height > 0 && y + this.el.offsetHeight > height) y = Math.max(0, screen.y - TIP_OFFSET_Y - this.el.offsetHeight);
    this.el.style.display = "";
    this.el.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`;
  }

  /** 内容渲染（签名变化时才执行——签名节流）。 */
  render(fields) {
    const t = this.t;
    const row = (key, value) =>
      '<div class="jyv-tipRow"><span class="jyv-tipKey">' + escapeHtml(key) + '</span><span class="jyv-tipVal">' + escapeHtml(value) + "</span></div>";
    this.el.innerHTML =
      '<div class="jyv-tipType">' + escapeHtml(fields.type) + "</div>" +
      row(t("hive.tips.status"), fields.state) +
      row(t("hive.tips.workspace"), fields.workspace) +
      row(t("hive.tips.sessions"), fields.sessions) +
      row(t("hive.tips.tokens"), fields.tokens) +
      row(t("hive.tips.dps"), fields.dps);
  }

  hide() {
    if (this.sig === null) return; // 已隐藏：幂等
    this.sig = null;
    this.el.style.display = "none";
  }

  dispose() {
    this.el.remove();
    this.root.remove();
    this.sig = null;
  }
}
