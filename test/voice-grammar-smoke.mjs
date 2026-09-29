/**
 * 语音指令语法匹配器冒烟测试（add-hive-voice-desk 3.3）。
 *
 * 覆盖 design D3 词表 + 三条纪律：
 *  - 整段意图：正向命令命中；**正文里出现「召唤/发给」字样不得劫持**（负例，R13）；
 *  - 副作用标记：summon/deliver 必须 sideEffect=true，其余为 false（R10）；
 *  - 指称解析优先级：显式选中蜂 → 面板序号 → 会话标题 → 蜂种名；
 *    序号不存在 → 解析失败 + 候选列表（SHALL NOT 盲投）；
 *  - 数字与同义词归一（一二三 ↔ 1/2/3，看看/聚焦/打开 同义）。
 * 运行：node test/voice-grammar-smoke.mjs
 */
import {
  INTENT,
  grammarTable,
  hasSideEffect,
  matchIntent,
  normalizeUtterance,
  parseCountToken,
  parseNumberToken,
  resolveReferents
} from "../src/hive/voice/grammar.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

const referents = [
  { index: 1, title: "重构渲染管线", beeTypeName: "侦察蜂", sessionId: "s1", selected: false },
  { index: 2, title: "梳理语音方案", beeTypeName: "工蜂", sessionId: "s2", selected: false },
  { index: 3, title: "调研段落制 ASR", beeTypeName: "侦察蜂", sessionId: "s3", selected: true }
];
const beeTypes = [
  { id: "t1", name: "侦察蜂" },
  { id: "t2", name: "工蜂" }
];
const run = (text) => matchIntent(text, { referents, beeTypes, selectedSessionId: "s3" });

/* ── 数字归一 ── */
eq(parseNumberToken("三"), 3, "中文数字");
eq(parseNumberToken("十"), 10, "十");
eq(parseNumberToken("十二"), 12, "十二");
eq(parseNumberToken("二十三"), 23, "二十三");
eq(parseNumberToken("7"), 7, "阿拉伯数字");
eq(parseCountToken("两个"), 2, "数量词两个");
eq(parseCountToken(""), 1, "空数量词 → 1");

/* ── 归一化：填充词与标点剥离 ── */
eq(normalizeUtterance("嗯，那个帮我看看三号蜂吧。").lean, "看看三号蜂", "首尾填充词剥离");

/* ── 无副作用指令族 ── */
for (const text of ["结束会话", "就到这里", "回到待机", "先到这里"]) {
  const hit = run(text);
  eq(hit.kind, INTENT.SESSION_END, `会话控制：${text}`);
  eq(hit.sideEffect, false, `无副作用：${text}`);
}
for (const text of ["继续上次", "恢复上次会话", "接着上次"]) {
  eq(run(text).kind, INTENT.SESSION_RESUME, `会话恢复：${text}`);
}
for (const text of ["查看蜂巢", "蜂巢状态", "总览"]) {
  eq(run(text).kind, INTENT.HIVE_OVERVIEW, `蜂巢总览：${text}`);
}
for (const text of ["回答", "就这些", "说完了", "开始整理"]) {
  eq(run(text).kind, INTENT.ANSWER, `手动应答：${text}`);
}
for (const text of ["确认", "确定", "好的", "就这样"]) {
  eq(run(text).kind, INTENT.CONFIRM, `确认：${text}`);
}
for (const text of ["取消", "算了", "不用了"]) {
  eq(run(text).kind, INTENT.CANCEL, `取消：${text}`);
}

/* ── 聚焦：同义词 + 数字归一 + 回显「序号 = 标题」 ── */
{
  const byNumber = run("看看三号蜂");
  eq(byNumber.kind, INTENT.BEE_FOCUS, "聚焦三号蜂命中");
  eq(byNumber.payload.target.sessionId, "s3", "三号蜂 = 面板序号 3");
  eq(byNumber.echo, "3号蜂 = 「调研段落制 ASR」", "确认/聚焦回显序号=标题");
  eq(byNumber.sideEffect, false, "聚焦无副作用");

  eq(run("打开2号蜂").payload.target.sessionId, "s2", "打开=聚焦同义词");
  eq(run("聚焦到一号蜂").payload.target.sessionId, "s1", "聚焦到=聚焦同义词");
  eq(run("看看梳理语音方案").payload.target.sessionId, "s2", "会话标题命中");
  eq(run("看看工蜂").payload.target.sessionId, "s2", "蜂种名唯一命中 → 聚焦");
  /* 同一蜂种多只 → 不盲选，走「未找到该蜂」+ 候选（R2/D9）。 */
  const ambiguous = run("看看侦察蜂");
  eq(ambiguous.kind, "bee-focus-missing", "蜂种名多只命中 → 聚焦失败路径");
  eq(ambiguous.candidates.length, 2, "多只命中列候选");
}

/* ── 召唤：有副作用 + 数量/蜂种解析（含 beeTypeId 回填） ── */
{
  const hit = run("召唤两个侦察蜂");
  eq(hit.kind, INTENT.SUMMON, "召唤命中");
  eq(hit.sideEffect, true, "召唤有副作用（必须过确认卡）");
  eq(hit.payload.count, 2, "召唤数量归一");
  eq(hit.payload.beeTypeId, "t1", "蜂种 id 回填（走 summon 路由）");
  eq(hit.echo, "2 × 侦察蜂", "确认卡回显蜂种与数量");

  eq(run("召唤一个工蜂").payload.count, 1, "召唤一个");
  eq(run("召唤两个蜂").payload.beeTypeId, null, "泛称蜂 → 默认蜂");
  eq(run("帮我召唤三个侦察蜂吧").payload.count, 3, "填充词容忍");
  eq(run("召唤十一个侦察蜂").kind, INTENT.NONE, "超过 8 只 → 不认（防误触）");
}

/* ── 投递：有副作用 + 目标回显 ── */
{
  const hit = run("把总结发给三号蜂");
  eq(hit.kind, INTENT.DELIVER, "投递命中");
  eq(hit.sideEffect, true, "投递有副作用");
  eq(hit.payload.target.sessionId, "s3", "投递目标解析");
  eq(hit.echo, "总结 → 3号蜂 = 「调研段落制 ASR」", "确认卡回显目标");

  eq(run("这份文档发给二号蜂").payload.target.sessionId, "s2", "宾语变体");
  eq(run("发给这只蜂").payload.target.sessionId, "s3", "显式选中蜂（这只蜂）");
  eq(run("把总结发给工蜂").payload.target.sessionId, "s2", "蜂种名唯一命中");
}

/* ── 指称解析失败：序号不存在 → 候选列表，SHALL NOT 盲投 ── */
{
  const hit = run("把总结发给五号蜂");
  eq(hit.kind, INTENT.DELIVER, "序号不存在仍是投递命中（走失败回执）");
  eq(hit.payload.target, null, "目标为空 → 不盲投");
  eq(hit.candidates.length, referents.length, "候选列表回填全部可指称蜂");

  eq(run("发给五号蜂").kind, INTENT.DELIVER, "省略宾语式「发给五号蜂」也命中");
  const noName = run("把总结发给老王");
  eq(noName.payload.target, null, "未知名字 → 不盲投");
  ok(noName.candidates.length > 0, "未知名字 → 候选列表");
}

/* ── 纪律 1：正文不劫持讨论（负例，R13） ── */
for (const text of [
  "刚才那个方案我想召唤更多人来评审",
  "我觉得应该召唤一个侦察蜂来做详细设计，然后再讨论",
  "看看这个方案怎么样",
  "这个结论要不要发给老王看一下",
  "给你一个建议：先把段落制跑通再考虑实时",
  "我想把这段讨论记下来",
  "召唤更多人来评审这个设计"
]) {
  const hit = run(text);
  eq(hit.kind, INTENT.NONE, `正文不得劫持：${text}`);
  eq(hit.matched, false, `未命中标记：${text}`);
}

/* ── 纪律 2/3：副作用族清单与弹回语义（纯函数面） ── */
ok(hasSideEffect(INTENT.SUMMON) && hasSideEffect(INTENT.DELIVER), "副作用族 = 召唤/投递");
ok(!hasSideEffect(INTENT.HIVE_OVERVIEW) && !hasSideEffect(INTENT.BEE_FOCUS), "纯本地动作无副作用");
ok(!hasSideEffect(INTENT.SESSION_END) && !hasSideEffect(INTENT.ANSWER), "会话控制/手动应答无副作用");

/* ── 指称表净房 ── */
eq(resolveReferents("三号蜂", [{ index: 0, title: "坏项" }, { index: 3, title: "好项" }]).targets.length, 1, "坏项丢弃");
eq(resolveReferents("三号蜂", []).reason, "no-referents", "空指称表结构化原因");
eq(resolveReferents("看看侦察蜂", referents).reason, "ambiguous-bee-type", "同一蜂种多只 → 候选（不盲投）");

/* ── 词表快照（设置页展示用） ── */
ok(grammarTable().length >= 9, "词表快照覆盖全部指令族");

console.log("voice-grammar-smoke: OK");
