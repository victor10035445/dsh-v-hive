/**
 * 样式表健全性冒烟测试（hive-interaction-polish 回归护栏）：
 * CSS SHALL 为完整字符串。防回归背景：模板串内注释里的裸反引号会把模板提前终止，
 * 解析变成 `T1 - T2`（字符串相减 = NaN），esbuild 不报错、构建静默通过——运行时
 * textContent = "NaN"（3 字符）→ 插件样式层整体失效（座位变形/页面无样式/3D 视口
 * 塌缩），且既有关冒烟不覆盖字符串内容，必须显式断言。
 * 运行：node test/styles-smoke.mjs
 */
import { CSS } from "../src/styles.mjs";

const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

ok(typeof CSS === "string", "CSS SHALL 为字符串（NaN = 模板串被裸反引号提前终止）");
ok(CSS.length > 20000, `CSS 长度健全（实测 ${CSS.length}）`);

/* 首部规则（座位长条）与尾部规则（新增段）同时在档——提前终止必然丢失尾部 */
ok(CSS.includes('.jyv-seat-row{'), "座位长条规则在档（首部）");
ok(CSS.includes('.jyv-canvasWrap{'), "画布容器规则在档");
ok(CSS.includes('.jyv-briefBar{'), "会话概要条规则在档");
ok(CSS.includes('.jyv-briefHead{') && CSS.includes('.jyv-briefRow{') && CSS.includes('.jyv-briefKey{') && CSS.includes('.jyv-briefText{'), "会话概要条栈式布局（标题/任务/报告）规则在档");
ok(CSS.includes('-webkit-line-clamp:2') && CSS.includes('word-break:break-all'), "任务/报告正文 2 行折行截断在档（break-all 兜住 -webkit-box 内无空格长串）");
ok(!CSS.includes('jyv-briefPreview') && !CSS.includes('jyv-briefSep'), "旧问/答平行布局类名已清退");
ok(CSS.includes('.jyv-tips{'), "悬停 tips 规则在档");
ok(CSS.includes('.jyv-legendKey{'), "图例键位提示规则在档（尾部哨兵）");

/* 16:9 卡与框选矩形（hive-marquee-and-card-rework 4.3/2.3） */
ok(CSS.includes('--jyv-wp-card-w:114px'), "16:9 卡宽变量 114px 在档（64×64 方形旧定稿已推翻）");
ok(CSS.includes('grid-template-columns:repeat(var(--jyv-wp-cols),var(--jyv-wp-card-w))'), "面板 grid 列宽走卡宽变量");
ok(CSS.includes('.jyv-wpFig{'), "卡内左列模型渲染区规则在档（左图右文 48px）");
ok(CSS.includes('.jyv-wpBody{'), "卡内右列文字栈规则在档");
ok(CSS.includes('.jyv-marquee{') && CSS.includes('pointer-events:none'), "框选矩形层规则在档（accent 描边 + 低透明填充 + 不参与拾取）");
ok(CSS.includes('max-width:40vw'), "面板 40vw 上限在档（16:9 后 3 列 ≈ 380px 不顶限，复核通过）");

/* 花括号配平（忽略注释）——结构完整性哨兵 */
const noComments = CSS.replace(/\/\*[\s\S]*?\*\//g, "");
let depth = 0;
for (const ch of noComments) {
  if (ch === "{") depth++;
  if (ch === "}") depth--;
}
ok(depth === 0, `CSS 花括号配平（深度 ${depth} 应为 0）`);

console.log("ALL STYLES SMOKE TESTS PASSED");
