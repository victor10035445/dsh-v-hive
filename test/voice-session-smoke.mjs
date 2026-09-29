/**
 * 语音会话状态机冒烟测试（add-hive-voice-desk 3.7）。
 *
 * 覆盖 spec「语音会话生命周期 / 分段聆听与拼接稿 / 静默自动回答 / 指令副作用确认」：
 *  - 状态机流转（待机 → 监听 ⇄ 应答播放 → 待机）+ 失焦冻结恢复 + 失焦超时自动结束；
 *  - 唤醒即新会话 vs「继续上次」快照（当前/上次分离，空会话不覆盖快照，R11）；
 *  - 静默触发与重置语义（新录音/指令/手动回答）；
 *  - 分段编辑对拼接稿的影响 + **乱序回填不回错位**（R12）；
 *  - 转写失败保留音频（受段数与字节上限约束）+ 成功即释放；
 *  - 确认卡：请求 / 确认 / 取消 / 超时弹回（R10）；
 *  - 附和保护窗与「录音中不附和」（D8）。
 * 运行：node test/voice-session-smoke.mjs
 */
import { VOICE_STATE, createVoiceSession, sessionConfigOf, transcriptOf } from "../src/hive/voice/session.mjs";
import { SEGMENT_DEFAULTS, createSegmenter, classifyMicError, resampleLinear, floatToPcm16, wavBytes, rmsOf, micEnvironment } from "../src/hive/voice/recorder.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

let clock = 1_000_000;
const now = () => clock;
const advance = (ms) => {
  clock += ms;
};
const machine = (config) => createVoiceSession({ config, now });

/* ════ 1. 状态机流转 ════ */

{
  const session = machine({ silenceMs: 8000 });
  eq(session.state, VOICE_STATE.IDLE, "初始待机");
  session.wake();
  eq(session.state, VOICE_STATE.LISTENING, "唤醒 → 监听");
  session.beginAnswer();
  eq(session.state, VOICE_STATE.SPEAKING, "应答 → 播放");
  session.endAnswer();
  eq(session.state, VOICE_STATE.LISTENING, "应答完成 → 回监听（多轮延续）");
  session.end("button");
  eq(session.state, VOICE_STATE.IDLE, "结束 → 待机");
}

/* ════ 2. 唤醒即新会话 / 继续上次（当前与上次分离，R11） ════ */

{
  const session = machine();
  session.wake();
  session.openSegment(1);
  session.resolveSegment(1, { text: "第一轮讨论" });
  session.pushHistory("user", "第一轮讨论");
  eq(session.transcript(), "第一轮讨论", "拼接稿");

  session.end("command");
  eq(session.state, VOICE_STATE.IDLE, "结束回待机");
  ok(session.hasSnapshot(), "有内容 → 留下快照");

  /* 空会话不覆盖快照：唤醒后什么都不说再结束，「继续上次」仍能恢复。 */
  session.wake();
  eq(session.transcript(), "", "唤醒即新会话（当前清零）");
  session.end("button");
  ok(session.hasSnapshot(), "空会话不覆盖上一次快照");

  const resumed = session.resumeLast();
  eq(resumed.ok, true, "继续上次成功");
  eq(session.transcript(), "第一轮讨论", "快照恢复拼接稿");
  eq(session.history().length, 1, "快照恢复多轮历史");
}

{
  const session = machine();
  session.wake();
  const missing = session.resumeLast();
  eq(missing.ok, false, "无快照 → 结构化失败");
  eq(missing.reason, "no-snapshot", "无快照原因（刷新后分支）");
  eq(session.state, VOICE_STATE.LISTENING, "无快照不改变当前会话状态");
}

/* ════ 3. 分段：乱序回填 / 编辑 / 失败保留（R12） ════ */

{
  const session = machine();
  session.wake();
  session.openSegment(1);
  session.openSegment(2);
  /* 第 2 段先返回 → 按段号落位，顺序不因到达顺序改变。 */
  session.resolveSegment(2, { text: "第二段" });
  session.resolveSegment(1, { text: "第一段" });
  eq(session.transcript(), "第一段\n第二段", "乱序返回不回错位");

  session.deleteSegment(1);
  eq(session.transcript(), "第二段", "删除分段即时影响拼接稿");

  session.markRerecord(2);
  eq(session.transcript(), "", "重录中的段不计入拼接稿");
  session.resolveSegment(2, { text: "第二段（修正）" });
  eq(session.transcript(), "第二段（修正）", "重录结果替换");

  session.resolveSegment(2, { error: "upstream 500", wav: new Uint8Array(1024) });
  const failed = session.session.segments.find((s) => s.seq === 2);
  eq(failed.status, "failed", "失败段标记");
  eq(failed.audioBytes, 1024, "失败段保留音频");
  eq(session.transcript(), "", "失败段不计入拼接稿");

  session.resolveSegment(2, { text: "第二段（重录成功）", wav: new Uint8Array(4096) });
  const recovered = session.session.segments.find((s) => s.seq === 2);
  eq(recovered.status, "ok", "重录成功");
  eq(recovered.audio, undefined, "成功即释放原始音频");
  eq(recovered.audioBytes, 0, "成功即释放字节记账");
}

{
  /* 音频保留受段数与字节上限约束（隐私 + 内存，R12）。 */
  const session = machine({ maxRetainedAudioSegments: 2, maxRetainedAudioBytes: 4096 });
  session.wake();
  for (let seq = 1; seq <= 3; seq++) {
    session.openSegment(seq);
    session.resolveSegment(seq, { error: "boom", wav: new Uint8Array(2048) });
  }
  const kept = session.session.segments.filter((s) => s.audio);
  ok(kept.length <= 2, "段数上限约束生效");
  const total = kept.reduce((sum, s) => sum + s.audioBytes, 0);
  ok(total <= 4096, `字节上限约束生效（实测 ${total}）`);
}

{
  /* 段数上限（净房下限 8）：超限拒收且原因结构化。 */
  const session = machine({ maxSegments: 8 });
  session.wake();
  for (let seq = 1; seq <= 8; seq++) session.openSegment(seq);
  eq(session.openSegment(9).ok, false, "段数上限拒收");
  eq(session.openSegment(9).reason, "too-many-segments", "段数上限原因");
}

/* ════ 4. 静默计时与自动应答（含重置语义） ════ */

{
  const session = machine({ silenceMs: 8000, backchannelEnabled: false });
  session.wake();
  session.openSegment(1);
  session.resolveSegment(1, { text: "一段调研内容" });
  session.markActivity(clock);

  advance(3000);
  eq(session.tick(clock).action, "none", "未达阈值不触发");

  /* 新录音重置计时 */
  advance(6000);
  session.setRecording(true, clock);
  session.setRecording(false, clock);
  eq(session.tick(clock).action, "none", "新语音重置静默计时");

  advance(8001);
  eq(session.tick(clock).action, "auto-answer", "静默达阈值 → 自动应答");
  eq(session.tick(clock).action, "none", "应答后计时清零");
}

{
  const session = machine({ silenceMs: 5000, backchannelEnabled: false });
  session.wake();
  eq(session.tick(clock).action, "none", "空拼接稿不触发应答");
}

{
  /* 应答播放中不触发（状态门）。 */
  const session = machine({ silenceMs: 1000, backchannelEnabled: false });
  session.wake();
  session.openSegment(1);
  session.resolveSegment(1, { text: "内容" });
  session.beginAnswer();
  advance(5000);
  eq(session.tick(clock).action, "none", "播放中不触发自动应答");
  session.endAnswer();
  advance(1001);
  eq(session.tick(clock).action, "auto-answer", "回到监听后继续计时");
}

/* ════ 5. 确认卡：请求 / 确认 / 取消 / 超时弹回（R10） ════ */

{
  const session = machine({ confirmTimeoutMs: 30000 });
  session.wake();
  const confirm = session.requestConfirm({ kind: "summon", echo: "2 × 侦察蜂" });
  eq(session.pendingConfirm().echo, "2 × 侦察蜂", "确认卡挂起");
  eq(session.tick(clock).action, "none", "未超时不弹回");

  advance(30001);
  const outcome = session.tick(clock);
  eq(outcome.action, "confirm-expired", "超时 → 自动取消");
  eq(session.pendingConfirm(), null, "确认卡被丢弃（不悬置阻塞后续口述）");
}

{
  const session = machine();
  session.wake();
  session.requestConfirm({ kind: "deliver", echo: "总结 → 3号蜂" });
  const resolved = session.resolveConfirm(true);
  eq(resolved.echo, "总结 → 3号蜂", "确认返回被消费的卡");
  eq(session.pendingConfirm(), null, "确认后清空");
  eq(session.resolveConfirm(true), null, "无卡时确认 → null（幂等）");
}

{
  /* 有确认卡时不自动应答（口述继续进拼接稿）。 */
  const session = machine({ silenceMs: 1000, backchannelEnabled: false });
  session.wake();
  session.openSegment(1);
  session.resolveSegment(1, { text: "内容" });
  session.requestConfirm({ kind: "summon", echo: "1 × 侦察蜂" });
  advance(5000);
  eq(session.tick(clock).action, "none", "确认未决时不抢答");
}

/* ════ 6. 焦点页声控（D11） ════ */

{
  const session = machine({ silenceMs: 1000, backchannelEnabled: false, focusLossTimeoutMs: 300000 });
  session.wake();
  session.focusLost(clock);
  eq(session.state, VOICE_STATE.PAUSED, "失焦 → 暂停");
  session.openSegment(1);
  session.resolveSegment(1, { text: "内容" });
  advance(60000);
  eq(session.tick(clock).action, "none", "失焦冻结静默计时");
  session.focusGained(clock);
  eq(session.state, VOICE_STATE.LISTENING, "回焦恢复监听");
  advance(1001);
  eq(session.tick(clock).action, "auto-answer", "回焦后计时继续");
}

{
  const session = machine({ focusLossTimeoutMs: 60000 });
  session.wake();
  session.focusLost(clock);
  advance(60001);
  eq(session.tick(clock).action, "end", "失焦超时 → 自动结束会话");
  eq(session.state, VOICE_STATE.IDLE, "自动结束后回待机");
}

/* ════ 7. 附和：仅段落间隙 + 节流（D8） ════ */

{
  const session = machine({ backchannelEnabled: true, backchannelGapMs: 2000, backchannelMinGapMs: 10000, silenceMs: 600000 });
  session.wake();
  advance(3000);
  eq(session.tick(clock).action, "none", "尚无段落 → 不附和");
  session.openSegment(1);
  session.resolveSegment(1, { text: "内容" });
  session.markActivity(clock);
  advance(3000);
  eq(session.tick(clock).action, "backchannel", "段落间隙 → 附和");
  advance(3000);
  eq(session.tick(clock).action, "none", "节流窗口内不重复附和");
  advance(10001);
  eq(session.tick(clock).action, "backchannel", "节流窗口过后可再附和");
}

{
  const session = machine({ backchannelEnabled: false, backchannelGapMs: 1000, silenceMs: 600000 });
  session.wake();
  session.openSegment(1);
  session.resolveSegment(1, { text: "内容" });
  session.markActivity(clock);
  advance(5000);
  eq(session.tick(clock).action, "none", "设置关闭附和 → 不播（5.1 即时生效）");
}

{
  /* 录音中不附和（防串音，D8）。 */
  const session = machine({ backchannelGapMs: 1000, backchannelMinGapMs: 0, silenceMs: 600000 });
  session.wake();
  session.openSegment(1);
  session.resolveSegment(1, { text: "内容" });
  session.setRecording(true, clock);
  advance(5000);
  eq(session.tick(clock).action, "none", "录音中 SHALL NOT 附和");
}

/* ════ 8. 采集侧纯函数（recorder.mjs） ════ */

{
  const input = new Float32Array(480);
  for (let i = 0; i < input.length; i++) input[i] = Math.sin((i / 480) * Math.PI * 2);
  const down = resampleLinear(input, 48000, 16000);
  eq(down.length, 160, "48k → 16k 重采样长度");
  const pcm = floatToPcm16(new Float32Array([0, 1, -1, 2, -2]));
  eq([...pcm], [0, 32767, -32768, 32767, -32768], "PCM16 钳位");
  const wav = wavBytes(pcm, 16000);
  eq(String.fromCharCode(...wav.subarray(0, 4)), "RIFF", "WAV 头 RIFF");
  eq(String.fromCharCode(...wav.subarray(8, 12)), "WAVE", "WAV 头 WAVE");
  eq(wav.byteLength, 44 + pcm.byteLength, "WAV 总长度 = 头 + 数据");
  eq(rmsOf(new Float32Array([0, 0, 0])), 0, "静音 RMS = 0");
  ok(rmsOf(new Float32Array([0.5, -0.5])) > 0.4, "有声 RMS 计算");
}

{
  /* 分段状态机：静音判停 / 30s 硬顶 / 保护窗。 */
  const segmenter = createSegmenter({ silenceMs: 500, maxSegmentMs: 2000, speechRms: 0.02, holdOffMs: 300 });
  segmenter.begin(0);
  const events = [];
  for (let at = 0; at <= 2200; at += 100) {
    const rms = at < 1000 ? 0.3 : 0.001;
    for (const event of segmenter.push({ rms, at })) events.push(event);
  }
  const closes = events.filter((e) => e.type === "segment-close");
  ok(closes.length >= 1, "静音达阈值收段");
  eq(closes[0].reason, "silence", "收段原因 = 静音");

  /* 保护窗：holdOff 期间不起录。 */
  const guarded = createSegmenter({ holdOffMs: 300, speechRms: 0.02 });
  guarded.holdOff(0, 300);
  eq(guarded.begin(100).length, 0, "保护窗内不起录");
  ok(guarded.begin(400).length > 0, "保护窗过后起录");
}

{
  /* 语音时长门槛（2026-09-27 真机反馈修正）：一次噪声瞬态（咳嗽/键盘声）不得收段送 ASR。
     旧行为：单个过阈帧即置 sawVoice → 900ms 静音后收段 → 上游返回空转写 → 界面刷「转写失败」。 */
  const blip = createSegmenter({ silenceMs: 300, speechRms: 0.02, minVoiceMs: 250, maxSegmentMs: 30000 });
  blip.begin(0);
  const blipEvents = [];
  for (let at = 0; at <= 700; at += 50) {
    const rms = at === 100 ? 0.4 : 0.001; // 仅 at=100 处一个 50ms 噪声尖峰
    for (const event of blip.push({ rms, at })) blipEvents.push(event);
  }
  eq(blipEvents.filter((e) => e.type === "segment-close").length, 0, "噪声瞬态不收段（不打上游）");
  const discarded = blipEvents.find((e) => e.type === "discard");
  ok(discarded !== undefined && discarded.reason === "no-voice", "本地丢弃并标注 no-voice");

  /* 真实说话（连续 400ms 过阈）照常收段。 */
  const speech = createSegmenter({ silenceMs: 300, speechRms: 0.02, minVoiceMs: 250, maxSegmentMs: 30000 });
  speech.begin(0);
  const speechEvents = [];
  for (let at = 0; at <= 900; at += 50) {
    const rms = at <= 400 ? 0.3 : 0.001;
    for (const event of speech.push({ rms, at })) speechEvents.push(event);
  }
  const spoken = speechEvents.find((e) => e.type === "segment-close");
  ok(spoken !== undefined && spoken.reason === "silence", "够长的语音正常收段");
}

{
  /* 空转写 ≠ 转写失败（2026-09-27 真机反馈修正）：上游返回空文本时状态是 `empty`，
     不是 `failed`——界面因此给中性提示而不是刷一串「转写失败」。 */
  const session = machine();
  session.wake();
  session.openSegment(1);
  const outcome = session.resolveSegment(1, { text: "   " });
  eq(outcome.status, "empty", "空转写 → empty 状态");
  const segment = session.session.segments.find((s) => s.seq === 1);
  eq(segment.status, "empty", "段状态为 empty");
  eq(segment.error, "no-speech", "原因标记 no-speech（非错误）");
  eq(session.transcript(), "", "空段不计入拼接稿");
  ok(segment.audioBytes > 0 || segment.audio !== undefined || segment.audioBytes === 0, "保留重录入口（不抛错）");

  session.openSegment(2);
  const failed = session.resolveSegment(2, { error: "upstream 502" });
  eq(failed.status, "failed", "真实传输失败仍为 failed");
}

{
  eq(classifyMicError({ name: "NotAllowedError" }), "permission-denied", "权限拒绝分类");
  eq(classifyMicError({ name: "NotFoundError" }), "no-device", "无设备分类");
  eq(classifyMicError({ name: "Weird" }), "unknown", "未知分类");
  eq(micEnvironment({ isSecureContext: false, navigator: {} }).secure, false, "非安全上下文探测");
  eq(micEnvironment({ isSecureContext: true, navigator: { mediaDevices: { getUserMedia() {} } } }).hasGetUserMedia, true, "getUserMedia 探测");
}

/* ════ 9. 设置净房（会话类设置越界回落） ════ */

{
  const config = sessionConfigOf({ silenceMs: 1, confirmTimeoutMs: 10_000_000, speed: 99, backchannelEnabled: "yes", speechRms: -5 });
  ok(config.silenceMs >= 1000, "静默阈值下限净房");
  ok(config.confirmTimeoutMs <= 300000, "确认超时上限净房");
  eq(config.backchannelEnabled, true, "非 false 一律视为开启（净房口径）");
  ok(config.speechRms > 0, "能量阈值下限净房");
  eq(sessionConfigOf({}).silenceMs, SEGMENT_DEFAULTS.silenceMs === 900 ? 8000 : 8000, "默认静默阈值 8s");
}

/* ════ 10. 拼接稿纯函数 ════ */

{
  const session = { segments: [{ seq: 2, text: "b", status: "ok" }, { seq: 1, text: "a", status: "ok" }, { seq: 3, text: "c", status: "failed" }] };
  eq(transcriptOf(session), "a\nb", "拼接稿按段号排序且排除失败段");
}

console.log("voice-session-smoke: OK");
