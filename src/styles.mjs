/** 蜂巢样式（insight 模式）：侧栏座位按钮 / 应用内整页帧 / 工具条 / 卡片 / 菜单 / toast /
 *  会话浮窗（遮罩孔洞） / 左纵排模态 / 情境道具栏 / 工蜂阵列面板。
 *  页面 chrome 一律直连官方 --dsw-alias-* / --dsw-shadow-* 默认令牌（无本地兜底值），
 *  主题风格插件经 theme.overrideTokens 覆盖令牌即可整体换肤；
 *  仅 3D 场景耦合色保留字面量（蜂状态四色 = hive/bees.mjs STATE_COLORS、暗角/画布底色、
 *  车道琥珀——图例与 3D 蜜蜂必须同色，不随 UI 主题漂移）。
 *  字阶纪律：font-size 仅用官方词汇表内的值——常规 11/12/13/14/16px（--dsw-font-* 字阶，
 *  官方 UI bundle 主用档），微型徽章 10px、提示/次级控件 12.5px（官方罕见先例档），
 *  页面标题 15px、大图标 20px；半像素（10.5/11.5/13.5）官方 0 使用，禁新增。 */
export const CSS = `
/* ── 画布 chrome 配色方案（hive-interaction-polish 追加）：--jyv-* 变量定义于 body，
      默认值 = 官方令牌（与既有观感一致、随应用主题）；body[data-jy-chrome] 五套
      主题化方案只覆盖「浮在 3D 画布上的 chrome」（道具栏/蜂群面板/状态卡/概要条/
      tips/右键菜单/toast/FPS/蜂卡）的底图、描边、hover 与文字——模态/输入件/座位/
      页面帧仍走官方令牌（在应用层，随应用主题）；遮罩保持纯压暗。 ── */
body{--jyv-plate:var(--dsw-alias-bg-overlay);--jyv-card:var(--dsw-alias-button-tool-bar-fill);--jyv-card-hover:var(--dsw-alias-button-tool-bar-hover);--jyv-brd:var(--dsw-alias-border-l2);--jyv-accent:var(--dsw-alias-state-business-primary);--jyv-toast:var(--dsw-alias-tooltip-bg);--jyv-text:var(--dsw-alias-label-primary);--jyv-text-dim:var(--dsw-alias-label-tertiary)}
body[data-jy-chrome="amber"]{--jyv-plate:rgba(32,23,9,.86);--jyv-card:rgba(48,35,14,.88);--jyv-card-hover:rgba(66,48,19,.92);--jyv-brd:rgba(185,138,46,.55);--jyv-accent:#f2b544;--jyv-glow:0 0 10px rgba(242,181,68,.35);--jyv-toast:rgba(24,17,7,.94);--jyv-text:#f2e9d8;--jyv-text-dim:#cbbd97}
body[data-jy-chrome="indigo"]{--jyv-plate:rgba(13,11,28,.86);--jyv-card:rgba(20,16,42,.88);--jyv-card-hover:rgba(31,25,60,.92);--jyv-brd:rgba(93,82,150,.55);--jyv-accent:#22d3ee;--jyv-glow:0 0 10px rgba(34,211,238,.30);--jyv-toast:rgba(8,6,18,.94);--jyv-text:#e5e7f8;--jyv-text-dim:#a8adcc}
body[data-jy-chrome="cyan"]{--jyv-plate:rgba(6,24,28,.86);--jyv-card:rgba(8,32,36,.88);--jyv-card-hover:rgba(12,44,50,.92);--jyv-brd:rgba(34,150,166,.55);--jyv-accent:#7ce8f5;--jyv-glow:0 0 10px rgba(124,232,245,.30);--jyv-toast:rgba(4,18,20,.94);--jyv-text:#dff6fa;--jyv-text-dim:#9fc9cf}
body[data-jy-chrome="magenta"]{--jyv-plate:rgba(30,10,32,.86);--jyv-card:rgba(40,14,44,.88);--jyv-card-hover:rgba(56,20,60,.92);--jyv-brd:rgba(170,70,160,.50);--jyv-accent:#f472b6;--jyv-glow:0 0 10px rgba(244,114,182,.32);--jyv-toast:rgba(20,6,22,.94);--jyv-text:#f7e6f5;--jyv-text-dim:#d0a8cc}
body[data-jy-chrome="frost"]{--jyv-plate:rgba(240,242,248,.88);--jyv-card:rgba(255,255,255,.78);--jyv-card-hover:rgba(255,255,255,.94);--jyv-brd:rgba(15,23,42,.16);--jyv-accent:#2563eb;--jyv-glow:0 0 10px rgba(37,99,235,.25);--jyv-toast:rgba(248,250,252,.96);--jyv-text:#17233b;--jyv-text-dim:#4b5a75}
/* ── 侧栏底部座位按钮（Hive，仿官方设置座位排版，insight .tsn-seat 同款思路：
      关键 border:none 保证与设置座位同款；wide 双形态）。
      容器 [data-slot=sidebar.footer.action] 为 display:contents，其父
      .hHd-Xa_footerActions 是 nowrap 横向 flex（宽 256px）——两个 260px 宽座位并存时
      第二个会被挤出侧栏；用 :has 在容器含本插件座位时允许换行（Chromium 105+），
      Hive（order 10）因此独占一行、位于 Token统计（20）之上。 ── */
div:has(> [data-slot="sidebar.footer.action"]):has(.jyv-seat){flex-wrap:wrap}
.jyv-seat{display:contents}
.jyv-seat-row{box-sizing:border-box;cursor:pointer;width:calc(100% + 4px);height:42px;color:var(--dsw-alias-label-primary);background:0 0;border:none;border-radius:12px;flex:none;align-items:center;gap:8px;margin:4px -2px;padding:0 10px 0 8px;font-family:inherit;font-size:14px;line-height:22px;display:flex;overflow:hidden}
.jyv-seat-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.jyv-seat-rail{box-sizing:border-box;cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;gap:0;width:36px;height:36px;margin:8px 0 10px;padding:0;display:flex}
.jyv-seat-rail:hover{background:var(--dsw-alias-interactive-bg-hover)}
/* 开合态（insight .tsn-seat 同款）：data-active 在容器上，后代选择器命中按钮 */
.jyv-seat[data-active="true"] .jyv-seat-row,.jyv-seat[data-active="true"] .jyv-seat-rail{color:var(--dsw-alias-state-business-primary)}
.jyv-seat-row svg,.jyv-seat-rail svg{width:16px;height:18px;flex:none}
.jyv-seat-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* ── 蜂巢整页帧（shell.overlay 条目；left = 侧栏右缘，useSidebarLeft 测量；
      降级（测不到侧栏）→ left:0；全屏 → left:0 + 更高层） ── */
.jyv-page{position:absolute;top:0;right:0;bottom:0;z-index:1000;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base);border-left:1px solid var(--dsw-alias-border-l2);pointer-events:auto}
.jyv-page[data-degraded="true"]{left:0;box-shadow:none;border-left:none}
.jyv-page[data-full="true"]{left:0;z-index:1200}
.jyv-page:focus{outline:none}
.jyv-pageHead{border-bottom:1px solid var(--dsw-alias-border-l2);justify-content:space-between;align-items:center;gap:12px;padding:10px 16px;display:flex;flex:none}
.jyv-pageTitle{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:22px;display:flex;align-items:center;gap:8px;min-width:0}
.jyv-pageTitle .jyv-hexMark{width:15px;height:17px;flex:none}
.jyv-pageActions{align-items:center;gap:2px;display:flex;flex:none}
.jyv-canvasWrap{position:relative;flex:1;min-height:0;overflow:hidden;background:#0b0f16}
.jyv-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
/* CSS 暗角（neon-scene-overhaul 5.2）：画布之上、卡片层之下——零 GPU 成本的深靛
   径向渐变遮罩（色彩对应 src/hive/palette.mjs vignette*），pointer-events:none
   不遮气泡操作 */
.jyv-vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 130% 110% at 50% 44%, rgba(18,16,42,0) 50%, rgba(8,7,20,0.62) 100%)}
.jyv-cardsRoot{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.jyv-cardsRoot .jyv-card{pointer-events:auto}
/* ── FPS 计数器（context-hotbar-rework R8）：画布左上角只读浮标（调试用，
      设置可开关；字号加大便于观览） ── */
.jyv-fps{position:absolute;top:10px;left:10px;z-index:30;padding:4px 12px;border-radius:8px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);color:var(--jyv-text);font:600 14px/20px ui-monospace,SFMono-Regular,Menlo,monospace;pointer-events:none;font-variant-numeric:tabular-nums;user-select:none}
.jyv-toolBtn{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border:none;background:transparent;border-radius:7px;color:var(--dsw-alias-label-secondary);font-size:12px;cursor:pointer;white-space:nowrap}
.jyv-toolBtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.jyv-toolBtnOn{color:var(--dsw-alias-state-business-primary)}
.jyv-toolBtn svg{display:block;flex:none} /* 官方 primitives 图标（设置齿轮）与文字字形基线对齐护栏 */
/* ── 图例 ── */
.jyv-legend{display:flex;gap:10px;flex-wrap:wrap;padding:6px 12px;border-top:1px solid var(--dsw-alias-border-l1);font-size:11px;color:var(--dsw-alias-label-secondary);flex:none}
.jyv-legendItem{display:inline-flex;align-items:center;gap:5px}
.jyv-legendDot{width:9px;height:9px;border-radius:999px;flex:none}
/* ── 蜜蜂卡片（HTML 投影） ── */
.jyv-card{position:absolute;top:0;left:0;width:230px;padding:8px 10px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);border-radius:10px;box-shadow:var(--dsw-shadow-lv3);font-size:12px;color:var(--jyv-text);will-change:transform}
.jyv-cardHead{display:flex;align-items:center;gap:6px;min-width:0}
.jyv-cardDot{width:8px;height:8px;border-radius:999px;flex:none}
.jyv-state-idle{background:#d8d3c8}
.jyv-state-busy{background:#3f8fd6}
.jyv-state-help{background:#e8a13c;box-shadow:0 0 6px #e8a13c}
.jyv-state-done{background:#57b26a}
.jyv-cardTitle{flex:1;min-width:0;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-cardPin{border:none;background:transparent;color:var(--jyv-text-dim);cursor:pointer;font-size:10px;padding:2px}
.jyv-cardPinOn{color:var(--jyv-accent)}
.jyv-cardMeta{color:var(--jyv-text-dim);font-size:11px;margin-top:3px}
.jyv-cardTodos{display:flex;align-items:center;gap:6px;margin-top:5px;color:var(--jyv-text-dim);font-size:11px}
.jyv-cardTodosBar{flex:1;height:4px;border-radius:999px;background:color-mix(in srgb,var(--jyv-text) 14%,transparent);overflow:hidden}
.jyv-cardTodosBar span{display:block;height:100%;background:var(--dsw-alias-state-success-primary);border-radius:999px}
.jyv-cardDrones{margin-top:4px;color:var(--jyv-text-dim);font-size:11px}
.jyv-cardActions{display:flex;gap:6px;margin-top:7px}
.jyv-cardBtn{border:1px solid color-mix(in srgb,var(--jyv-text) 25%,transparent);background:transparent;color:var(--jyv-text-dim);border-radius:6px;font-size:11px;padding:2px 8px;cursor:pointer}
.jyv-cardBtn:hover{color:var(--jyv-text);border-color:color-mix(in srgb,var(--jyv-text) 50%,transparent)}
.jyv-cardCup{width:210px}
.jyv-cardArchived{margin-top:5px;color:var(--jyv-text-dim);font-size:11px}
/* ── 小气泡（每蜂常驻状态点芯片；点击展开完整卡；标题走 tooltip）。
      尺寸 = 初版 2 倍（用户反馈：气泡过小）——padding/gap/圆点/字号全量翻倍，
      width:auto 内容驱动，整体随之等比放大；对齐仍为 bottom-center 不受影响。 ── */
.jyv-cardMini{width:auto;display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;cursor:pointer}
.jyv-cardMini:hover{border-color:var(--jyv-accent);background:color-mix(in srgb,var(--jyv-text) 8%,transparent)}
.jyv-cardMini .jyv-cardDot{width:18px;height:18px}
.jyv-bubbleTodo{color:var(--jyv-text-dim);font-size:20px;flex:none;line-height:1}
/* ── 右键菜单 / toast ── */
.jyv-menu{position:fixed;z-index:10000;min-width:170px;padding:4px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);border-radius:10px;box-shadow:var(--dsw-shadow-lv3)}
.jyv-menuItem{display:block;width:100%;text-align:left;padding:7px 12px;border:none;background:transparent;font:inherit;font-size:12.5px;color:var(--jyv-text);border-radius:7px;cursor:pointer}
.jyv-menuItem:hover{background:color-mix(in srgb,var(--jyv-text) 9%,transparent)}
.jyv-toast{position:fixed;left:16px;bottom:16px;z-index:10001;max-width:380px;padding:8px 14px;border-radius:8px;background:var(--jyv-toast);color:var(--jyv-text);font-size:12px;border:1px solid var(--jyv-brd);box-shadow:var(--dsw-shadow-lv2);animation:jyvToastIn .18s ease-out}
.jyv-toastErr{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}
@keyframes jyvToastIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
/* ── 会话头方形回巢按钮（explorer 同款） ── */
.jyv-toggleBtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;flex:none;border:none;background:transparent;border-radius:8px;color:var(--dsw-alias-label-secondary);cursor:pointer;padding:0}
.jyv-toggleBtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.jyv-toggleBtn svg{width:15px;height:15px;display:block}
.jyv-toggleBtnOn{color:var(--dsw-alias-state-business-primary)}
/* ── WebGL 降级卡 ── */
.jyv-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:#0c1118}
.jyv-fallbackCard{max-width:340px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:1.8;border:1px dashed var(--dsw-alias-border-l2);border-radius:12px;padding:20px}
.jyv-fallbackTitle{color:var(--dsw-alias-label-primary);font-weight:600;font-size:13px;margin-bottom:6px}
.jyv-fallbackRetry{margin-top:12px}
/* ── 设置卡 ── */
.jyv-settings{display:flex;flex-direction:column;gap:2px}
.jyv-setRow{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:44px;padding:8px 2px;border-top:1px solid var(--dsw-alias-border-l1)}
.jyv-setRow:first-child{border-top:none}
.jyv-setLabel{font-size:13px;color:var(--dsw-alias-label-primary)}
.jyv-setHint{font-size:11px;color:var(--dsw-alias-label-tertiary);margin-top:2px}
.jyv-setSelect{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border-radius:8px;height:30px;padding:0 8px;font-size:12.5px}
.jyv-setToggle{position:relative;width:38px;height:21px;border-radius:999px;border:none;background:var(--dsw-alias-interactive-bg-hover);cursor:pointer;transition:background .15s}
.jyv-setToggle::after{content:"";position:absolute;top:2px;left:2px;width:17px;height:17px;border-radius:999px;background:var(--dsw-alias-label-primary);transition:transform .15s}
.jyv-setToggleOn{background:var(--dsw-alias-state-business-primary)}
.jyv-setToggleOn::after{transform:translateX(17px)}
/* ── 页内设置面板（四轮）：对齐 DSH 设置弹层风格——实色深底、高对比分组、
      可见可拖拽的滚动条；滑杆/取色器沿用宿主语义色 ── */
.jyv-setTabs{display:flex;gap:2px;padding:3px;background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l1);border-radius:9px;margin-bottom:4px}
.jyv-setTab{flex:1;border:none;background:transparent;color:var(--dsw-alias-label-secondary);border-radius:7px;height:30px;font-size:12.5px;cursor:pointer}
.jyv-setTab:hover{color:var(--dsw-alias-label-primary)}
.jyv-setTabOn{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);font-weight:600}
.jyv-setGroup{font-size:11px;font-weight:700;color:var(--dsw-alias-state-business-primary);letter-spacing:.08em;padding:14px 2px 4px;border-top:1px solid var(--dsw-alias-border-l1);margin-top:10px}
.jyv-setRangeWrap{display:flex;align-items:center;gap:8px}
.jyv-setRange{width:132px;accent-color:var(--dsw-alias-state-business-primary);cursor:pointer}
.jyv-setRangeVal{min-width:44px;text-align:right;font-size:12px;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}
.jyv-setColorWrap{display:flex;align-items:center;gap:8px}
.jyv-setColor{width:36px;height:26px;padding:0;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-3);cursor:pointer}
.jyv-setColor::-webkit-color-swatch-wrapper{padding:2px}
.jyv-setColor::-webkit-color-swatch{border:none;border-radius:4px}
.jyv-setColorVal{font-size:11px;color:var(--dsw-alias-label-secondary);font-family:ui-monospace,monospace}
.jyv-setActions{display:flex;justify-content:flex-end;padding:12px 2px 2px;border-top:1px solid var(--dsw-alias-border-l1);margin-top:10px}
.jyv-setReset{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:8px;height:28px;padding:0 12px;font-size:12px;cursor:pointer}
.jyv-setReset:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
/* ── 会话浮窗（hive-quick-commands D3 遮罩孔洞模型；spike 3.2 结论）：
      AppFrame 根 = position:relative + 填充视口 + inline grid-template-columns
      （sidebar px / minmax(0,1fr) / details px 显式三轨）+ 子元素序
      [sidebarCol, centerCol, detailsCol, overlayLayer([data-shell-overlay]), handles…]。
      孔洞坐标系 = AppFrame 根（遮罩 chrome 挂 overlay 层 inset:0，同源）：
      宽 min(720px,80%)、高 70%、水平垂直居中。中列整形用 position:absolute
      （相对 frame，不用 transform——避免吞掉后代 fixed 基准）；零 z-index 改动。 ── */
[data-jy-float="open"] .jyv-page{visibility:hidden}
/* 中列脱流防 auto-placement 左移：详情列钉回第 3 轨、侧栏列钉回第 1 轨
   （结构钩子 = frame 根属性 + [data-shell-overlay] 前驱 :has() 链，不依赖哈希类名） */
[data-jy-float="open"] > *:has(+ [data-shell-overlay]){grid-column:3 !important;grid-row:1 !important}
[data-jy-float="open"] > *:has(+ * + * + [data-shell-overlay]){grid-column:1 !important;grid-row:1 !important}
/* 中列整形为孔洞矩形（官方列层序不动；圆角边框 + 阴影 = 浮起感） */
[data-jy-float="open"] > *:has(+ * + [data-shell-overlay]){
  position:absolute;
  left:calc((100% - min(720px,80%))/2);
  top:15%;
  width:min(720px,80%);
  height:70%;
  border-radius:14px;
  border:1px solid var(--dsw-alias-border-l2);
  box-shadow:var(--dsw-shadow-lv3);
  background:var(--dsw-alias-bg-base);
}
.jyv-floatChrome{position:absolute;inset:0;z-index:1300;pointer-events:none}
.jyv-floatMask{position:absolute;pointer-events:auto;cursor:pointer;background:var(--dsw-alias-bg-mask-3)}
.jyv-floatMaskT{top:0;left:0;right:0;height:15%}
.jyv-floatMaskB{bottom:0;left:0;right:0;height:15%}
.jyv-floatMaskL{top:15%;bottom:15%;left:0;width:calc((100% - min(720px,80%))/2)}
.jyv-floatMaskR{top:15%;bottom:15%;right:0;width:calc((100% - min(720px,80%))/2)}
.jyv-floatTitle{position:absolute;pointer-events:auto;box-sizing:border-box;left:calc((100% - min(720px,80%))/2);width:min(720px,80%);top:calc(15% - 34px);height:30px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 6px 0 12px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);border-bottom:none;border-radius:10px 10px 0 0;color:var(--dsw-alias-label-primary);font-size:13px;cursor:default}
.jyv-floatName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.jyv-floatClose{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:1;cursor:pointer;padding:4px 8px;border-radius:6px;flex:none}
.jyv-floatClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
/* ── 设置模态（hive-quick-commands 5.x）：页内居中模态，页签 tablist。
      高度固定（不随内容缩放），内容在 modalBody 内滚动。
      （「快捷指令」卡带/编辑器样式已随 context-hotbar-rework 拆除；
      模态表单通用件（qcRow 系）为蜂群编辑沿用。） ── */
.jyv-modalBack{position:absolute;inset:0;z-index:1400;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-mask-3);cursor:pointer}
.jyv-modal{width:min(560px,92%);height:min(560px,88%);display:flex;flex-direction:column;box-sizing:border-box;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);border-radius:12px;box-shadow:var(--dsw-shadow-lv3);padding:12px 14px;cursor:auto}
.jyv-modalHead{display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;flex:none}
.jyv-modalTitle{font-size:14px;font-weight:600;color:var(--dsw-alias-label-primary)}
.jyv-modalBody{flex:1 1 auto;overflow-y:auto;min-height:0;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;padding-top:4px}
/* ── 模态表单通用件（蜂群编辑沿用；命名承自旧快捷指令编辑器）：
      每条一个边框圆角块，首行名称+开关（带文字）+排序/删除，次行 textarea ── */
.jyv-qcRows{display:flex;flex-direction:column;gap:6px}
.jyv-qcRow{flex-direction:column;gap:4px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:8px;display:flex}
.jyv-qcRowHead{align-items:center;gap:6px;display:flex}
.jyv-qcNameInput{flex:1;min-width:0;height:26px;box-sizing:border-box;font:12px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:3px 8px;outline:none}
.jyv-qcNameInput:focus{border-color:var(--dsw-alias-border-inverted)}
.jyv-qcPromptInput{resize:vertical;min-height:44px;box-sizing:border-box;font:12px ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.5;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:6px 8px;outline:none}
.jyv-qcPromptInput:focus{border-color:var(--dsw-alias-border-inverted)}
.jyv-qcAuto{flex:none;display:inline-flex;align-items:center;gap:5px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px;cursor:pointer;user-select:none}
.jyv-qcAuto input{accent-color:var(--dsw-alias-border-inverted);margin:0;cursor:pointer}
.jyv-qcMove{flex:none;cursor:pointer;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;padding:0;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);border-radius:6px;font-size:12px;line-height:1}
.jyv-qcMove:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed)}
.jyv-qcMove:disabled{opacity:.4;cursor:not-allowed}
.jyv-qcRemove{cursor:pointer;border:0;background:0 0;color:var(--dsw-alias-label-tertiary);font-size:14px;line-height:18px;padding:2px 6px;border-radius:6px}
.jyv-qcRemove:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover)}
.jyv-qcEmpty{padding:16px 4px;color:var(--dsw-alias-label-tertiary);font-size:12px;text-align:center}
.jyv-qcActions{display:flex;align-items:center;gap:8px;padding-top:10px;margin-top:10px;border-top:1px solid var(--dsw-alias-border-l1)}
.jyv-qcAdd{border:1px dashed var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:8px;height:28px;padding:0 12px;font-size:12px;cursor:pointer}
.jyv-qcAdd:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.jyv-qcSave{margin-left:auto;border:none;background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary-inverted);border-radius:8px;height:28px;padding:0 14px;font-size:12px;cursor:pointer}
.jyv-qcSave:disabled{opacity:.55;cursor:default}
.jyv-qcDirty{color:var(--dsw-alias-label-tertiary);font-size:11px}
.jyv-qcError{color:var(--dsw-alias-state-error-primary);font-size:11px}
.jyv-qcConfirm{display:flex;align-items:center;gap:8px;padding:8px 10px;margin-bottom:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;color:var(--dsw-alias-label-primary);font-size:12px;background:var(--dsw-alias-bg-layer-3);flex:none}
.jyv-qcDiscard{margin-left:auto;border:1px solid var(--dsw-alias-state-error-primary);background:transparent;color:var(--dsw-alias-state-error-primary);border-radius:7px;height:26px;padding:0 10px;font-size:11px;cursor:pointer}
.jyv-qcDiscard:hover{background:var(--dsw-alias-interactive-bg-hover)}
/* ── 蜂群编辑浮窗（custom-bee-types 4.x）：复用设置模态骨架 + 可拖拽头部 ── */
.jyv-swarmBtn{flex:none;margin-right:2px}
.jyv-swarmModal{width:min(560px,calc(100vw - 48px));max-height:min(76vh,640px);display:flex;flex-direction:column}
.jyv-swarmHead{cursor:grab;user-select:none;touch-action:none}
.jyv-swarmHead:active{cursor:grabbing}
.jyv-swarmRowOn{outline:1px solid var(--dsw-alias-state-business-primary);outline-offset:-1px}
.jyv-swarmTypeRow{display:flex;align-items:flex-end;gap:10px;margin-top:8px;flex-wrap:wrap}
.jyv-swarmField{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--dsw-alias-label-secondary)}
.jyv-swarmField select{height:26px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;font-size:12px;padding:0 6px;max-width:220px}
.jyv-swarmFieldGrow{flex:1;min-width:180px}
.jyv-swarmFieldGrow select{max-width:none;width:100%}
.jyv-swarmHint{color:var(--dsw-alias-label-tertiary);font-size:11px;height:26px;display:inline-flex;align-items:center}
.jyv-swarmDesc{margin-top:8px}
/* 预设提示词编辑项（hive-summon-tool 5.1）：textarea 形态，复用 qcPromptInput 基形。 */
.jyv-swarmPreset{margin-top:6px;min-height:64px;font-family:inherit}
.jyv-swarmCaps{display:flex;flex-direction:column;gap:8px}
.jyv-swarmCapsHead{display:flex;align-items:center;justify-content:space-between;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600}
.jyv-swarmCapture{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:8px}
.jyv-swarmCaptureRow{display:inline-flex;align-items:center;gap:4px}
.jyv-swarmCaptureName{width:64px;height:24px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;font-size:12px;padding:0 6px}
.jyv-swarmCapturePath{flex:1;min-width:140px;height:24px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;font-size:12px;padding:0 6px}
.jyv-swarmInsert{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
/* ── 蜂卡蜂种增量（custom-bee-types 5.2/5.3）：徽章 / 变量 / ⏸ 车道 / 动作行。
      卡片锚点、对齐与遮挡语义零改动（spec 固化项）——只在卡内追加行。 ── */
.jyv-bubbleBee{display:inline-flex;align-items:center;height:16px;padding:0 5px;border-radius:8px;background:color-mix(in srgb,var(--jyv-accent) 28%,transparent);color:var(--jyv-text);font-size:10px;line-height:16px;max-width:88px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-bubbleLane{display:inline-flex;align-items:center;height:16px;padding:0 5px;border-radius:8px;background:color-mix(in srgb,#d9a441 30%,transparent);color:#f5d9a0;font-size:10px;line-height:16px}
.jyv-cardBeeRow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px}
.jyv-cardBee{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:10px;background:color-mix(in srgb,var(--jyv-accent) 30%,transparent);color:var(--jyv-text);font-size:12px;line-height:20px;font-weight:600}
.jyv-cardQueue{color:var(--jyv-text-dim);font-size:11px}
.jyv-cardVars{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-top:6px}
.jyv-cardVar{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:9px;background:color-mix(in srgb,var(--jyv-text) 9%,transparent);color:var(--jyv-text-dim);font-size:10px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-cardVarReset{margin-left:auto}
.jyv-cardWaits{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.jyv-cardWait{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:9px;background:color-mix(in srgb,#d9a441 22%,transparent);color:#f0d9ad;font-size:10px}
.jyv-cardNotices{display:flex;flex-direction:column;gap:3px;margin-top:6px}
.jyv-cardNotice{color:var(--jyv-text-dim);font-size:11px;line-height:15px}
.jyv-cardHatch{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.jyv-cardHatchBtn{border-color:var(--jyv-accent);color:var(--jyv-accent)}
.jyv-menuItemOn{color:var(--jyv-accent);font-weight:600}
/* ── 左纵排模态骨架（context-hotbar-rework 4.1/5.1，D9）：设置与指令编辑共用
      overlay+mask+panel+左 nav rail（图标+节名）+内容滚动区；自绘、全 token。
      层序：模态(1400) > 浮窗 chrome(1300) > 覆盖面板/道具栏 > 画布拾取。 ── */
.jyv-railModal{width:min(640px,94%);height:min(560px,88%);padding:12px 0 12px 12px}
.jyv-railBody{display:flex;gap:0;flex:1;min-height:0}
.jyv-railNav{display:flex;flex-direction:column;gap:2px;width:132px;flex:none;padding-right:10px;border-right:1px solid var(--dsw-alias-border-l1)}
.jyv-railItem{display:flex;align-items:center;gap:8px;width:100%;padding:7px 10px;border:none;background:transparent;border-radius:8px;color:var(--dsw-alias-label-secondary);font-size:12.5px;cursor:pointer;text-align:left}
.jyv-railItem:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.jyv-railItem:focus-visible{outline:1px solid var(--dsw-alias-border-inverted);outline-offset:-1px}
.jyv-railItemOn{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);font-weight:600}
.jyv-railIcon{width:16px;flex:none;text-align:center}
.jyv-railLabel{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-railContent{flex:1;min-width:0;min-height:0;padding-left:12px;display:flex;flex-direction:column}
.jyv-hbBody{padding-top:0}
/* ── 底部情境道具栏（6.x）：紧凑阵列（用户定稿）——无空位占位卡，可见行数 =
      ⌈槽位数/m⌉ 封顶 n（max-height + 纵向滚动），条宽 = min(槽位数, m) 且底部
      水平居中；卡片 64×64 方形（与蜂群面板同规格）；三态门控由外壳条件渲染
      （kind null 或无槽位不渲染）。层序 30：画布拾取之上、浮窗 chrome 之下。 ── */
.jyv-hotbar{position:absolute;left:0;right:0;bottom:0;z-index:30;margin-inline:auto;width:fit-content;box-sizing:border-box;max-height:calc(var(--jyv-hb-rows) * 64px + (var(--jyv-hb-rows) - 1) * 5px + 16px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;display:grid;grid-template-columns:repeat(var(--jyv-hb-cols),64px);grid-auto-rows:64px;gap:5px;padding:8px 10px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);border-radius:12px;box-shadow:var(--dsw-shadow-lv3)}
.jyv-hbCard{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-sizing:border-box;width:64px;height:64px;min-width:0;padding:5px 4px;border:1px solid var(--jyv-brd);background:var(--jyv-card);border-radius:10px;color:var(--jyv-text);font-size:11px;cursor:pointer;overflow:hidden}
.jyv-hbCard:hover:not(:disabled){background:var(--jyv-card-hover);border-color:var(--jyv-accent);box-shadow:var(--jyv-glow,none)}
.jyv-hbCard:disabled{opacity:.45;cursor:not-allowed}
.jyv-hbCard[data-auto]{border-color:var(--jyv-accent)}
/* 动作卡蜜金描边（hotbar-default-actions 9.1，用户定稿）：归档/打开等内置动作卡
   专属辨识色——与场景归档蜜金/作战报告归档动词同源（#f2b544 = PALETTE.trimColor），
   不占用「蓝框 = ⚡直发」语义；hover 回落 label-dimmed 与既有卡一致。 */
.jyv-hbCard[data-action]{border-color:#f2b544}
.jyv-hbCard[data-busy]{opacity:.6}
.jyv-hbName{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;line-height:14px}
.jyv-hbBolt{position:absolute;top:3px;right:4px;font-size:10px;line-height:12px}
/* 内置角标（hotbar-default-actions 4.1）：左上角微型单行 chip，与 ⚡（右上）对称；
   全走 --dsw-alias-* token，absolute 定位不占 flex 流——不破 64px 卡面网格；
   cursor:help + title（收回提示挂在元素自身，组件接线）。 */
.jyv-hbBuiltin{position:absolute;top:2px;left:4px;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 4px;border-radius:6px;background:color-mix(in srgb,var(--jyv-text) 12%,transparent);color:var(--jyv-text-dim);font-size:9px;line-height:11px;cursor:help}
.jyv-hbGlyph{flex:none;font-size:16px;line-height:18px}
.jyv-hbIndex{flex:none;min-width:16px;text-align:right;color:var(--jyv-text-dim);font-size:11px;font-variant-numeric:tabular-nums}
.jyv-hbRowOn{outline:1px solid var(--jyv-accent);outline-offset:-1px}
.jyv-hbForm{display:flex;flex-direction:column;gap:8px;margin-top:6px}
/* ── 工蜂阵列覆盖面板（7.x，D2/D8；hive-marquee-and-card-rework 4.3/4.4 16:9 改版）：
      canvas 右缘覆盖；面板壳去 chrome（无底图/无边框/无阴影，直接浮于画布），头部
      只留计数（studio = n/容量；marquee = 已选 N 只）；卡片 114×64 长方形（16:9，
      推翻 64×64 方形旧定稿）左图右文——左列 48px 模型渲染区（128px 快照源 dpr2
      仍清晰；52px 会把文字区挤到 ~44px 反比方卡窄，F12）+ 右列文字栈；面板宽随
      内容（上限 40vw：3 列 ≈ 380px，常规画布不顶限）、高随实际行数自适应（可视
      行数上限 = 设置 panelN，超出纵向滚动），在画布可用区（底缘让位道具栏）垂直
      居中。 ── */
.jyv-workerPanel{--jyv-wp-card-w:114px;position:absolute;top:0;right:10px;bottom:76px;z-index:30;margin-block:auto;height:fit-content;max-width:40vw;max-height:calc(100% - 96px);display:flex;flex-direction:column;min-height:0;background:transparent;border:none;border-radius:0;box-shadow:none;pointer-events:auto}
.jyv-wpHead{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:2px 4px;flex:none;text-shadow:0 1px 2px rgba(0,0,0,.5)}
.jyv-wpCount{color:var(--jyv-text);font-size:11px;font-weight:600;font-variant-numeric:tabular-nums}
.jyv-wpGrid{flex:1 1 auto;min-height:0;box-sizing:border-box;max-height:calc(var(--jyv-wp-rows) * 64px + (var(--jyv-wp-rows) - 1) * 6px + 16px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;display:grid;grid-template-columns:repeat(var(--jyv-wp-cols),var(--jyv-wp-card-w));grid-auto-rows:64px;gap:6px;padding:8px;justify-content:start}
.jyv-wpCard{position:relative;display:flex;flex-direction:row;align-items:stretch;gap:6px;box-sizing:border-box;width:var(--jyv-wp-card-w);height:64px;min-width:0;padding:6px;border:1px solid var(--jyv-brd);background:var(--jyv-card);border-radius:10px;color:var(--jyv-text);font-size:12px;cursor:pointer;text-align:left;overflow:hidden}
.jyv-wpCard:hover{border-color:var(--jyv-accent);background:var(--jyv-card-hover);box-shadow:var(--jyv-glow,none)}
.jyv-wpPlaceholder{border-style:dashed;border-color:var(--dsw-alias-border-l1);background:transparent;cursor:default;pointer-events:none}
/* 左列模型渲染区（4.4）：48px 宽；128px 快照源 object-fit contain 收纳 */
.jyv-wpFig{position:relative;flex:none;width:48px;border-radius:6px;overflow:hidden;background:color-mix(in srgb,var(--jyv-brd) 22%,transparent)}
.jyv-wpPreview{position:absolute;inset:2px;display:block;width:calc(100% - 4px);height:calc(100% - 4px);object-fit:contain;pointer-events:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,.45));user-select:none}
/* 右列文字栈（4.4）：状态点 + 标题 / todo 进度 / 🐝角标 + 蜂种徽章（~52px 宽，
   标题截断悬停完整） */
.jyv-wpBody{flex:1;display:flex;min-width:0;flex-direction:column;justify-content:center;gap:3px}
.jyv-wpCardHead{display:flex;align-items:center;gap:4px;min-width:0}
.jyv-wpName{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;font-size:11px;text-shadow:0 1px 2px rgba(0,0,0,.35)}
.jyv-wpMeta{display:flex;align-items:center;gap:4px;min-width:0}
.jyv-wpDrones{flex:none;color:var(--jyv-text-dim);font-size:10px;font-variant-numeric:tabular-nums;line-height:14px;text-shadow:0 1px 2px rgba(0,0,0,.35)}
.jyv-wpTodos{display:flex;align-items:center;gap:4px;color:var(--jyv-text-dim);font-size:10px}
.jyv-wpTodos .jyv-cardTodosBar{height:3px}
.jyv-wpTodosVal{flex:none;font-variant-numeric:tabular-nums}
.jyv-wpBadge{flex:none;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 5px;border-radius:7px;background:color-mix(in srgb,var(--jyv-accent) 26%,transparent);color:var(--jyv-text);font-size:10px;line-height:14px}
.jyv-wpEmpty{flex:1;display:flex;align-items:center;justify-content:center;padding:18px;color:var(--jyv-text-dim);font-size:12px;text-align:center}
/* ── 框选矩形层（hive-marquee-and-card-rework 2.3）：canvasWrap 内 absolute 覆盖，
      accent 描边 + 低透明填充；pointer-events:none（SHALL NOT 参与画布拾取）；
      显示/位置由 MarqueeOverlay 命令式写 style（拖拽高频路径零 React 重渲染）。 ── */
.jyv-marquee{position:absolute;z-index:40;box-sizing:border-box;display:none;border:1px solid var(--jyv-accent);border-radius:2px;background:color-mix(in srgb,var(--jyv-accent) 14%,transparent);pointer-events:none}
/* ── 作战报告面板（hive-combat-log D6）：canvasWrap 内 absolute 左下，直接贴底
      （bottom 固定 10px，不再用道具栏避让算式——之前 var(--jyv-hb-rows,2) 在道具栏
      未渲染时回落 2 行，把面板抬离左下角）。
      底图透明（无背景卡片/border/阴影），文字直接浮于画布之上。 ── */
.jyv-combatLog{position:absolute;left:10px;bottom:10px;z-index:30;width:280px;display:flex;flex-direction:column;box-sizing:border-box;background:transparent;pointer-events:auto;overflow:hidden;text-shadow:0 1px 2px rgba(0,0,0,.5)}
/* 折叠态 = 小胶囊 + 未读徽数 */
.jyv-combatLog[data-collapsed="true"]{width:auto;display:inline-flex;flex-direction:row;align-items:center;background:transparent}
.jyv-combatLogPill{display:inline-flex;align-items:center;gap:6px;border:none;background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;font-weight:600;cursor:pointer;padding:6px 10px;border-radius:999px;line-height:18px;text-shadow:0 1px 2px rgba(0,0,0,.5)}
.jyv-combatLogPill:hover{background:var(--dsw-alias-interactive-bg-hover)}
.jyv-combatLogBadge{min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--dsw-alias-state-error-primary);color:#fff;font-size:11px;font-weight:700;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
/* 展开态头部（透明底，仅底部细分隔线） */
.jyv-combatLogHead{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;background:transparent}
.jyv-combatLogTitle{flex:1;min-width:0;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jyv-combatLogFilter{display:inline-flex;align-items:center;gap:4px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px;cursor:pointer;user-select:none;white-space:nowrap}
.jyv-combatLogFilter input{accent-color:var(--dsw-alias-border-inverted);margin:0;cursor:pointer}
.jyv-combatLogClose{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:1;cursor:pointer;padding:2px 6px;border-radius:6px;flex:none}
.jyv-combatLogClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.jyv-combatLogClear{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1;cursor:pointer;padding:2px 6px;border-radius:6px;flex:none}
.jyv-combatLogClear:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-state-error-primary)}
/* 滚动列表（时间正序 = 最新在底，终端日志式，自动滚底；thin scrollbar 沿既有纪律）。
   高度恒为默认行数（--jyv-report-rows，行高 24px：padding 4px×2 + line-height 16px），
   不随内容伸缩——不足默认行数留白、超出滚动。 */
.jyv-combatLogList{flex:none;height:calc(var(--jyv-report-rows,8) * 24px + 12px);min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;padding:6px 0;display:flex;flex-direction:column;background:transparent}
.jyv-combatLogEmpty{padding:18px 12px;color:var(--dsw-alias-label-tertiary);font-size:11px;text-align:center}
/* 速读行（D6）：行首 HH:MM tabular-nums、蜂名粗体、附加信息弱化色 */
.jyv-combatRow{display:flex;align-items:baseline;gap:7px;padding:4px 10px;font-size:12px;line-height:16px;color:var(--dsw-alias-label-primary);animation:jyvCombatIn .18s ease-out}
.jyv-combatTime{flex:none;color:var(--dsw-alias-label-tertiary);font:11px/16px ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums}
.jyv-combatTitle{flex:none;color:#8fd3ff;font-weight:600;max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-combatVerb{flex:none;font-weight:600}
.jyv-combatBody{flex:1;min-width:0;overflow-wrap:break-word;color:var(--dsw-alias-label-secondary)}
.jyv-combatBody b{font-weight:700;color:var(--dsw-alias-label-primary)}
.jyv-combatExtra{color:var(--dsw-alias-label-tertiary)}
@keyframes jyvCombatIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
/* 动词配色（字面量与场景色同源，见 src/hive/bees.mjs STATE_COLORS / palette.mjs PALETTE）：
   召唤=黄 #ffd44d（PALETTE.hexFxYellow 新蜂出场同族）、开始=蓝 #3f8fd6（STATE_COLORS.busy）、
   完成=绿 #57b26a（STATE_COLORS.done）、求助=琥珀 #e8a13c（STATE_COLORS.help）、
   归档=蜜金 #f2b544（PALETTE.trimColor）。异常色（--dsw-alias-state-error-primary）为
   配色体系完整性预置项，v1 事件目录不产生异常行（错误保留弹条）。 */
.jyv-combatRow[data-kind="enterWorker"] .jyv-combatVerb{color:#ffd44d}
.jyv-combatRow[data-kind="dronesNew"] .jyv-combatVerb{color:#ffd44d}
.jyv-combatRow[data-kind="newNest"] .jyv-combatVerb{color:#ffd44d}
.jyv-combatRow[data-kind="start"] .jyv-combatVerb{color:#3f8fd6}
.jyv-combatRow[data-kind="done"] .jyv-combatVerb{color:#57b26a}
.jyv-combatRow[data-kind="dronesDone"] .jyv-combatVerb{color:#57b26a}
.jyv-combatRow[data-kind="help"]{background:color-mix(in srgb,#e8a13c 16%,transparent);border-left:2px solid #e8a13c;padding-left:8px}
.jyv-combatRow[data-kind="help"] .jyv-combatVerb{color:#e8a13c}
.jyv-combatRow[data-kind="archive"] .jyv-combatVerb{color:#f2b544}
.jyv-combatRow[data-kind="receipt"] .jyv-combatVerb{color:var(--dsw-alias-label-tertiary);font-weight:400}
/* 低优先级行（巢搬移/野蜂出现）：整体弱化中性；被过滤开关隐藏 */
.jyv-combatRow[data-low="true"]{color:var(--dsw-alias-label-tertiary)}
.jyv-combatRow[data-low="true"] .jyv-combatVerb{color:var(--dsw-alias-label-tertiary);font-weight:500}
.jyv-combatRow[data-low="true"] .jyv-combatBody{color:var(--dsw-alias-label-tertiary)}
.jyv-combatLog[data-hidelow="true"] .jyv-combatRow[data-low="true"]{display:none}
/* 减动效：reduced 直插无动画（CSS 兜底 + prefers-reduced-motion） */
.jyv-combatLog[data-reduced="true"] .jyv-combatRow{animation:none}
@media (prefers-reduced-motion: reduce){
  .jyv-combatRow{animation:none}
  .jyv-statusBar{transition:none}
}
/* ── 完成状态栏（bee-status-cards D2）：canvasWrap 内左缘垂直居中，max-height
      滚动；下缘按 --jyv-statusBarBottom（76px 道具栏 + 报告让位 reserve）动态让位。
      底图透明、无边框（只保留卡片与按钮）；完成信息 ≤0 时整栏向左滑出屏幕外，
      >0 时从屏幕外向右切入（transform transition 动效）。 ── */
.jyv-statusBar{position:absolute;left:10px;top:50%;transform:translateY(-50%) translateX(0);z-index:30;display:flex;flex-direction:column;gap:6px;width:158px;max-height:calc(100% - 100px);box-sizing:border-box;padding:6px;pointer-events:auto;bottom:var(--jyv-statusBarBottom,76px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;transition:transform .28s cubic-bezier(.22,.61,.36,1)}
.jyv-statusBar[data-hidden="true"]{transform:translateY(-50%) translateX(calc(-100% - 24px));pointer-events:none}
/* 减动效：reduced 直插到位无滑入动画（CSS 兜底 + prefers-reduced-motion） */
.jyv-statusBar[data-reduced="true"]{transition:none}
.jyv-statusCard{position:relative;display:flex;align-items:center;gap:6px;flex:none;box-sizing:border-box;height:32px;padding:0 8px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);border-radius:8px;box-shadow:var(--dsw-shadow-lv2);color:var(--jyv-text);font-size:12px;cursor:pointer;overflow:hidden}
.jyv-statusCard:hover{color:var(--jyv-text)}
.jyv-statusName{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.jyv-statusCount{flex:none;min-width:18px;text-align:center;font-variant-numeric:tabular-nums;font-weight:600;color:var(--jyv-text-dim)}
.jyv-statusCountOn{color:var(--dsw-alias-state-success-primary)}
.jyv-statusSend{flex:none;border:none;background:transparent;color:var(--jyv-accent);font-size:13px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:6px}
.jyv-statusSend:hover:not(:disabled){background:color-mix(in srgb,var(--jyv-text) 9%,transparent)}
.jyv-statusSend:disabled{color:var(--jyv-text-dim);cursor:default}
.jyv-statusDefault{opacity:.72}
/* 确认弹窗（D5）：轻量遮罩面板，复用 jyv-modal 骨架 */
.jyv-statusConfirmBack{z-index:1500}
.jyv-statusConfirm{width:min(420px,92%);height:auto;max-height:70%}
.jyv-statusConfirmHint{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.6;margin-bottom:8px}
.jyv-statusConfirmLabel{font-size:11px;font-weight:700;color:var(--dsw-alias-state-business-primary);letter-spacing:.06em;margin:6px 2px 4px}
.jyv-statusConfirmPrompt{white-space:pre-wrap;word-break:break-word;max-height:200px;overflow-y:auto;margin:0;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace}
.jyv-statusConfirm .jyv-modalHead:last-child{justify-content:flex-end;gap:8px;border-top:1px solid var(--dsw-alias-border-l1);padding-top:8px;margin-top:8px}
/* 状态卡片节默认蜂灰置行 */
.jyv-hbStatusDefaultRow{opacity:.6;cursor:default}
.jyv-hbStatusDefaultRow .jyv-qcRowHead{cursor:default}
/* ── 顶部会话概要条（session-brief-bar 5.2/D4 重设计）：canvasWrap 顶部居中半透明
      只读卡片；pointer-events 限定条体（不遮挡画布手势，条外事件穿透）；栈式布局：
      标题行（accent 圆点 + 加粗，单行省略）→「任务」徽标行（末回合 prompt）→
      「报告」徽标行（末回合 response）；任务/报告正文各最多 2 行折行截断（第 2 行
      末尾省略号），悬停 title 提示全文；无空格长串（路径/命令）依赖 word-break:break-all
      强制断行——legacy -webkit-box 折行管线不认 overflow-wrap:anywhere。 ── */
.jyv-briefBar{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:30;display:flex;flex-direction:column;gap:4px;max-width:min(66%,620px);box-sizing:border-box;padding:7px 12px;border-radius:14px;background:color-mix(in srgb,var(--jyv-plate) 92%,transparent);border:1px solid var(--jyv-brd);box-shadow:var(--dsw-shadow-lv2);color:var(--jyv-text);font-size:12px;line-height:18px;pointer-events:auto;user-select:none;overflow:hidden}
.jyv-briefHead{display:flex;align-items:center;gap:6px;min-width:0}
.jyv-briefDot{flex:none;width:6px;height:6px;border-radius:99px;background:var(--jyv-accent)}
.jyv-briefTitle{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.jyv-briefRow{display:flex;align-items:flex-start;gap:8px;min-width:0}
.jyv-briefKey{flex:none;box-sizing:border-box;min-width:38px;margin-top:1px;padding:0 7px;border-radius:7px;background:color-mix(in srgb,var(--jyv-accent) 14%,transparent);color:var(--jyv-text-dim);font-size:10px;font-weight:600;line-height:16px;text-align:center;letter-spacing:1px}
.jyv-briefText{flex:1 1 auto;min-width:0;overflow:hidden;color:var(--jyv-text-dim);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;white-space:normal;word-break:break-all;overflow-wrap:anywhere}
/* ── 悬停 tips 层（hive-interaction-polish 6.3/D5）：瞬态 DOM 层（cardRoot 兄弟），
      整层 pointer-events:none（SHALL NOT 干扰拾取与卡片点击）；指针旁偏移避让
      蜂顶气泡卡；六字段 rows（类型徽章 + 键值对），缺失值以「-」占位。 ── */
.jyv-tips{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:40}
.jyv-tip{position:absolute;top:0;left:0;min-width:150px;max-width:250px;box-sizing:border-box;padding:8px 11px;border-radius:10px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);box-shadow:var(--dsw-shadow-lv3);font-size:12px;color:var(--jyv-text);will-change:transform}
.jyv-tipType{display:inline-flex;align-items:center;max-width:100%;box-sizing:border-box;height:18px;padding:0 7px;border-radius:9px;background:color-mix(in srgb,var(--jyv-accent) 26%,transparent);font-weight:600;font-size:11px;line-height:18px;margin-bottom:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-tipRow{display:flex;align-items:baseline;gap:8px;line-height:18px;max-width:100%}
.jyv-tipKey{flex:none;color:var(--jyv-text-dim);font-size:11px}
.jyv-tipVal{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums}
/* 图例键盘手势提示项（hive-interaction-polish 8.1）：与状态图例同行，弱化色 */
.jyv-legendKey{color:var(--dsw-alias-label-tertiary)}
`;
