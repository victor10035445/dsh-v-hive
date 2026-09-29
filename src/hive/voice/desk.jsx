/**
 * 蜂巢语音工作台（add-hive-voice-desk 3.4–3.6 + 4.x）。
 *
 * 本文件两部分：
 *  1. `createVoiceDesk`——**编排核心**（框架无关）：PTT 采集 → 段转写串行回填 →
 *     静默计时 → 指令语法分流（零 LLM）/ 蜂后管线（双 register）→ 副作用确认卡 →
 *     固定语音资产播放 + 附和 → 作战报告回执。依赖全部注入，可被 Node 侧最小驱动。
 *  2. `VoiceDeskPanel` / `VoiceSettingsBody`——React 呈现层（左下面板 + 设置「语音」节）。
 *
 * 纪律（spec/design 对应）：
 *  - 指令命中不调用任何 LLM（D2）；有副作用指令先出确认卡（D3/R10）；
 *  - 只有焦点页出声/录音（D11）；附和只在段间隙且带保护窗（D8）；
 *  - 错误类回执 MUST 带 `err` kind（R16），否则只进报告不弹 toast。
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { matchIntent, INTENT, hasSideEffect } from "./grammar.mjs";
import { createVoiceRecorder, SEGMENT_DEFAULTS } from "./recorder.mjs";
import { createVoiceSession, VOICE_STATE, sessionConfigOf } from "./session.mjs";
import { createCuePlayer, createSpeechStreamer } from "./speech.mjs";
import { BACKCHANNEL_CUES, VOICE_CUES, cueById } from "./assets.mjs";

/* ── 编排核心 ── */

/**
 * @param {object} deps
 *  - `notify(text, kind)`：作战报告/toast 收口（kind==="err" → 错误通道）
 *  - `t(key)`：i18n
 *  - `actions`：蜂巢动作面（focusBee/hiveOverview/summon/send/selectSession/showCards）
 *  - `referents()`：客户端指称表（面板序号 + 标题 + 蜂种名 + 选中态）
 *  - `beeTypes()`：蜂种清单（`[{id,name}]`，召唤指令解析用）
 *  - `workspaceId()`：目标工作区（落盘/召唤）
 *  - `settings()`：会话类语音设置（session.mjs 口径）
 *  - `hasFocus()`：`document.hasFocus()`（唯一出声许可）
 */
export function createVoiceDesk(deps = {}) {
  const listeners = new Set();
  const t = deps.t ?? ((key) => key);
  const scope = deps.scope ?? globalThis;

  let config = sessionConfigOf(deps.settings?.() ?? {});
  const session = createVoiceSession({
    config,
    now: deps.now,
    onEvent: (event) => {
      if (event.type === "confirm-expired") {
        void playCue("ack-cancelled");
        receipt(t("hive.voice.confirmTimeout"), "err");
      }
      publish();
    }
  });

  const streamer = createSpeechStreamer({
    scope,
    endpoint: deps.ttsEndpoint,
    fetch: deps.fetch,
    onState: () => publish()
  });
  const missingCues = new Set();
  const cues = createCuePlayer({ scope, fetch: deps.fetch, onMissing: (cue) => missingCues.add(cue.id) });

  const recorder =
    deps.recorder ??
    createVoiceRecorder({
      scope,
      now: deps.now,
      onLevel: (rms) => onLevel(rms),
      onSegment: (segment) => enqueueSegment(segment),
      onError: (error) => {
        micError = error?.reason ?? "unknown";
      }
    });
  /* 注入型 recorder（测试/宿主自备）也要接线：两条路径挂同一组回调。 */
  recorder.onSegment = (segment) => enqueueSegment(segment);
  recorder.onLevel = (rms) => onLevel(rms);
  recorder.onError = (error) => {
    micError = error?.reason ?? "unknown";
  };

  let actions = deps.actions ?? {};
  let status = null;
  let workspaceId = null;
  let hotwords = [];
  let micError = null;
  let busy = false;
  let speaking = false;
  let confirmBusy = false;
  let disposed = false;
  let timer = null;
  let queue = [];
  let pumping = false;
  let nextSeq = 0;
  let levelStreak = 0;
  let lastPressWasIdle = false;
  let receiptSeq = 0;
  let receipts = [];

  const snapshotOf = () => ({
    state: session.state,
    focusPaused: session.isFocusPaused(),
    segments: session.session.segments.map((s) => ({ seq: s.seq, text: s.text, status: s.status, error: s.error, audioBytes: s.audioBytes })),
    transcript: session.transcript(),
    confirm: session.pendingConfirm(),
    artifacts: session.artifacts(),
    history: session.history(),
    busy,
    speaking,
    micError,
    status,
    workspaceId,
    hotwords,
    missingCues: [...missingCues],
    receipts: receipts.slice(-8)
  });
  let cache = snapshotOf();

  function publish() {
    cache = snapshotOf();
    for (const listener of listeners) {
      try {
        listener();
      } catch {
        /* ignore */
      }
    }
  }

  const receipt = (text, kind) => {
    receiptSeq += 1;
    receipts = [...receipts.slice(-15), { seq: receiptSeq, text, kind: kind ?? "" }];
    deps.notify?.(text, kind);
    publish();
  };

  async function playCue(id) {
    const cue = cueById(id);
    if (!cue) return { ok: false, reason: "unknown-cue" };
    try {
      const result = await cues.play(cue);
      /* 固定音结束后留保护窗再续录（D8 防串音）：资产缺失时也走同一路径（无害）。 */
      recorder.holdOff?.(SEGMENT_DEFAULTS.holdOffMs);
      resumeListening(SEGMENT_DEFAULTS.holdOffMs + 60);
      return result;
    } catch {
      return { ok: false, reason: "play-failed" };
    }
  }

  /**
   * 续录（段落循环的自动闭环）：段收口 / 应答播完 / 固定音播完后回到监听，
   * 让「成段口述 → 停顿续录」无需反复按 PTT；保护窗内 start() 会被 segmenter 挡住，
   * 因此这里统一按「hold-off + 余量」延迟重入。
   */
  function resumeListening(extraMs = 0) {
    if (disposed) return;
    const timer = setTimeout(() => {
      if (disposed || session.state !== VOICE_STATE.LISTENING) return;
      Promise.resolve(recorder.start?.()).catch(() => {});
    }, Math.max(0, extraMs));
    timer?.unref?.();
  }

  /* ── 段采集 → 串行转写 → 按段号回填（R12/乱序安全） ── */

  /** 采集回调：段号在**入队时**按录音顺序分配，回填永远按段号落位。 */
  function enqueueSegment({ wav, bytes, durationMs }) {
    if (disposed) return;
    nextSeq += 1;
    queue.push({ seq: nextSeq, wav, bytes, durationMs });
    /* 段已收口 → 进入段间隙：解除录音态（静默计时与附和窗口据此推进）并续录下一段。 */
    session.setRecording(false);
    publish();
    resumeListening(0);
    void pump();
  }

  async function pump() {
    if (pumping || disposed) return;
    pumping = true;
    try {
      while (queue.length > 0) {
        const item = queue.shift();
        const opened = session.openSegment(item.seq, item.bytes);
        if (!opened.ok) {
          receipt(t("hive.voice.segmentLimit"), "err");
          continue;
        }
        publish();
        const prompt = tailOfTranscript();
        const result = await deps.asr
          ? await deps.asr(item.wav, { prompt, hotwords })
          : { ok: false, error: "asr unavailable" };
        if (result.ok) {
          const resolved = session.resolveSegment(item.seq, { text: result.text });
          publish();
          /* 空转写（上游没听出内容）走中性提示，**不算错误**——真机实测它曾刷出一串
             「转写失败」，其实是噪声段/太轻的说话（spec「转写失败」只覆盖真实失败）。 */
          if (resolved?.status === "empty") receipt(t("hive.voice.segEmpty").replace("{n}", String(item.seq)));
        } else {
          session.resolveSegment(item.seq, { error: result.error, wav: item.wav });
          publish();
          await playCue("ack-asr-failed");
          receipt(t("hive.voice.asrFailed").replace("{n}", String(item.seq)).replace("{msg}", String(result.error ?? "")), "err");
        }
      }
    } finally {
      pumping = false;
    }
  }

  /** 前段转写尾部（`prompt` 连续性；宿主侧再截断到 8000 字符）。 */
  function tailOfTranscript() {
    const text = session.transcript();
    return text.length > 400 ? text.slice(-400) : text;
  }

  /* ── 指令分流 ── */

  async function triggerAnswer(manual = false) {
    if (busy) return;
    if (session.pendingConfirm()) return; // 确认卡未决：口述继续进拼接稿，不抢答
    const text = session.transcript();
    if (!text.trim()) {
      if (manual) await playCue("ack-ok");
      return;
    }
    const hit = matchIntent(text, {
      referents: deps.referents?.() ?? [],
      beeTypes: deps.beeTypes?.() ?? [],
      selectedSessionId: deps.selectedSessionId?.() ?? null
    });
    if (!hit.matched) {
      await runQueenPipeline(text);
      return;
    }
    await runCommand(hit, text);
  }

  async function runCommand(hit, text) {
    switch (hit.kind) {
      case INTENT.SESSION_END:
        endSession("command");
        await playCue("ack-ending");
        return;
      case INTENT.SESSION_RESUME: {
        const result = session.resumeLast();
        if (!result.ok) {
          await playCue("ack-no-last");
          receipt(t("hive.voice.noSnapshot"), "err");
          return;
        }
        await playCue("ack-ok");
        receipt(t("hive.voice.resumed"));
        publish();
        return;
      }
      case INTENT.HIVE_OVERVIEW:
        actions.hiveOverview?.();
        session.commitTurn({ text });
        await playCue("ack-overview");
        receipt(t("hive.voice.overview"));
        publish();
        return;
      case INTENT.BEE_FOCUS: {
        const target = hit.payload.target;
        if (target?.sessionId) actions.focusBee?.(target.sessionId);
        session.commitTurn({ text });
        await playCue("ack-focus");
        receipt(t("hive.voice.focused").replace("{who}", hit.echo || target?.title || ""));
        publish();
        return;
      }
      case "bee-focus-missing":
        session.commitTurn({ text });
        await playCue("ack-no-bee");
        receipt(t("hive.voice.noBee").replace("{list}", candidateList(hit.candidates)), "err");
        publish();
        return;
      case INTENT.ANSWER:
        await runQueenPipeline(text);
        return;
      case INTENT.CONFIRM: {
        const confirm = session.resolveConfirm(true);
        if (!confirm) {
          await playCue("ack-ok");
          return;
        }
        await executeConfirm(confirm);
        return;
      }
      case INTENT.CANCEL: {
        const confirm = session.resolveConfirm(false);
        session.commitTurn({ text });
        await playCue("ack-cancelled");
        if (confirm) receipt(t("hive.voice.cancelled"));
        publish();
        return;
      }
      case INTENT.SUMMON:
      case INTENT.DELIVER: {
        if (hit.kind === INTENT.DELIVER && !hit.payload.target) {
          /* 解析失败 → 固定「未找到该蜂」音 + 候选（SHALL NOT 盲投）。 */
          session.commitTurn({ text });
          await playCue("ack-no-bee");
          receipt(t("hive.voice.noBee").replace("{list}", candidateList(hit.candidates)), "err");
          publish();
          return;
        }
        session.requestConfirm({
          kind: hit.kind,
          echo: hit.echo,
          payload: hit.payload,
          candidates: hit.candidates
        });
        await playCue("ack-confirm");
        publish();
        return;
      }
      default:
        await runQueenPipeline(text);
    }
  }

  function candidateList(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) return t("hive.voice.noCandidate");
    return candidates.map((c) => `${c.index}. ${c.title}`).join(" / ");
  }

  /** 确认卡消费：召唤 / 投递（M3）。 */
  async function executeConfirm(confirm) {
    if (confirmBusy) return;
    confirmBusy = true;
    busy = true;
    publish();
    try {
      if (confirm.kind === INTENT.SUMMON) {
        const count = Math.max(1, Math.min(8, Number(confirm.payload?.count) || 1));
        const wsId = workspaceId ?? deps.workspaceId?.() ?? null;
        if (!wsId) {
          await playCue("ack-error");
          receipt(t("hive.voice.noWorkspace"), "err");
          return;
        }
        let created = 0;
        for (let i = 0; i < count; i++) {
          const result = await actions.summon?.({
            workspaceId: wsId,
            beeTypeId: confirm.payload?.beeTypeId ?? undefined,
            prompt: "",
            autoSend: false
          });
          if (result?.ok) created += 1;
          else {
            await playCue("ack-error");
            receipt(t("hive.voice.summonFailed").replace("{msg}", String(result?.error ?? "")), "err");
            break;
          }
        }
        if (created > 0) {
          await playCue("ack-summoned");
          receipt(t("hive.voice.summoned").replace("{n}", String(created)));
        }
        session.commitTurn({ text: confirmTextOf(confirm) });
        return;
      }
      if (confirm.kind === INTENT.DELIVER) {
        const target = confirm.payload?.target;
        const artifact = confirm.payload?.artifact ?? session.latestArtifact();
        const bodyText = artifact?.markdown ?? session.transcript();
        const prompt = assembleDeliveryPrompt({
          title: artifact?.title ?? t("hive.voice.deliveryDefaultTitle"),
          body: bodyText,
          artifact,
          fallbackTitle: target?.title
        });
        const result = await deliverTo(target, prompt);
        if (result?.ok) {
          await playCue("ack-sent");
          receipt(t("hive.voice.sent").replace("{who}", target?.title ?? ""));
        } else {
          await playCue("ack-no-bee");
          receipt(t("hive.voice.sendFailed").replace("{msg}", String(result?.error ?? "")), "err");
        }
        session.commitTurn({ text: confirmTextOf(confirm) });
        return;
      }
    } finally {
      confirmBusy = false;
      busy = false;
      publish();
    }
  }

  function confirmTextOf(confirm) {
    return `${confirm.kind === INTENT.SUMMON ? "召唤" : "投递"}：${confirm.echo || ""}`;
  }

  /**
   * 投递：指称表里的蜂都对应一个**已有会话** → 只走现有 `send` 路由。
   *
   * 纪律（2026-09-27 复查修正）：**SHALL NOT 在 send 失败时静默改走 summon 新建蜂**。
   * 确认卡回显的是「发给三号蜂」，此时凭空创建一只新会话属于**另一种副作用**，
   * 与 D3/R10 的「确认什么就只做什么」相悖（用户确认的不是「新建一只蜂」）。
   * 失败即如实回执，由用户决定是否改用「召唤」指令。
   * （`summon` 分支留给未来「显式新建蜂」型指称；当前指称表产不出这种目标。）
   */
  async function deliverTo(target, prompt) {
    if (!target?.sessionId) return { ok: false, error: "no-target-session" };
    if (!actions.send) return { ok: false, error: "no-route" };
    return actions.send(target.sessionId, prompt);
  }

  /** 文档卡片「发给蜂」：以当前选中蜂为目标弹确认卡（M3 闸门同路）。 */
  function deliverArtifact(artifact) {
    const referents = deps.referents?.() ?? [];
    const selected = referents.find((r) => r.selected) ?? null;
    if (!selected) {
      receipt(t("hive.voice.pickBee"), "err");
      return { ok: false, reason: "no-selection" };
    }
    const confirm = session.requestConfirm({
      kind: INTENT.DELIVER,
      echo: `${artifact?.relativePath ?? ""} → ${selected.index}号蜂 = 「${selected.title}」`,
      payload: { what: artifact?.relativePath ?? "", target: selected, artifact },
      candidates: []
    });
    publish();
    return { ok: true, confirm };
  }

  /* ── 蜂后管线（M2） ── */

  async function runQueenPipeline(text) {
    if (busy) return;
    busy = true;
    session.beginAnswer();
    publish();
    const settings = deps.settings?.() ?? {};
    try {
      const result = await deps.answer
        ? await deps.answer({
            text,
            history: session.history(),
            referents: deps.referents?.() ?? [],
            workspaceId: workspaceId ?? deps.workspaceId?.() ?? null,
            personaId: settings.personaId,
            maxTokens: settings.maxTokens
          })
        : { ok: false, error: "answer unavailable" };
      if (!result.ok) {
        if (result.state === "no-model" || result.state === "not-configured" || result.state === "no-workspace") {
          await playCue("ack-no-model");
          receipt(t("hive.voice.unavailable").replace("{msg}", String(result.error ?? result.state ?? "")), "err");
        } else {
          await playCue("ack-error");
          receipt(t("hive.voice.answerFailed").replace("{msg}", String(result.error ?? "")), "err");
        }
        return;
      }
      session.addArtifact({
        title: result.relativePath?.split("/").pop() ?? "voice.md",
        markdown: result.markdown ?? "",
        relativePath: result.relativePath ?? "",
        path: result.path ?? "",
        truncated: result.truncated === true,
        usedTools: result.usedTools?.names ?? []
      });
      session.commitTurn({ text, reply: result.spoken ?? "" });
      publish();
      /* 工具面可见性（真机反馈修正）：宿主上报本回合调过工具 → 明确警告
         「内容可能引用了会话外信息」，把猜测变成可见事实。 */
      const toolNames = result.usedTools?.names ?? [];
      if (toolNames.length > 0) {
        receipt(t("hive.voice.toolWarning").replace("{tools}", toolNames.join(" / ")), "err");
      }
      receipt(
        `${result.truncated ? t("hive.voice.truncated") + " " : ""}${t("hive.voice.saved").replace("{path}", result.relativePath ?? "")}`,
        result.truncated ? "err" : undefined
      );
      await playCue(result.truncated ? "ack-truncated" : "ack-doc-saved");
      await speak(result.spoken ?? "");
    } finally {
      session.endAnswer();
      busy = false;
      publish();
      /* 应答完成 → 自动回监听延续多轮讨论（spec「多轮延续」）。 */
      resumeListening(SEGMENT_DEFAULTS.holdOffMs + 60);
    }
  }

  /** 口语摘要流式播放（边收边播；`interrupt()` 停源并 abort 上游）。 */
  async function speak(text) {
    const value = String(text ?? "").trim();
    if (!value) return;
    if (!isAllowedToSpeak()) return;
    speaking = true;
    publish();
    const settings = deps.settings?.() ?? {};
    const result = await streamer.speak({ text: value, voice: settings.voice, speed: settings.speed });
    speaking = false;
    publish();
    if (result.ok === false && result.aborted !== true) {
      receipt(t("hive.voice.ttsFailed").replace("{msg}", String(result.error ?? "")), "err");
    }
  }

  function isAllowedToSpeak() {
    return deps.hasFocus?.() !== false;
  }

  function interrupt() {
    if (!speaking) return;
    streamer.stop();
    speaking = false;
    session.interrupt();
    /* 打断者本人正在说话：维持录音态，捕获余下内容为下一段。 */
    session.setRecording(true);
    publish();
  }

  /* ── 会话生命周期 ── */

  /**
   * 说话键按下面（鼠标/触摸/Alt+Space 统一走这里）。
   *
   * 交互语义（2026-09-27 用户实测反馈后定稿）：
   *  - **单击（<300ms）= 切换**：待机 → 进入监听；已在监听 → 结束会话。
   *    用户原话：「单击进入对话状态，再点击则结束会话更合理」——段落制的实际形态是
   *    「进会话后麦克风一直开着」，长按并不是必要动作。
   *  - **按住（≥300ms）= PTT**：松手收当前段（spec 的「按住说话」语义保留）。
   * 两者并存：想连着说就用单击进会话，想精确控制某一段就用按住。
   */
  async function pressStart() {
    const wasIdle = session.state !== VOICE_STATE.LISTENING && session.state !== VOICE_STATE.SPEAKING;
    lastPressWasIdle = wasIdle;
    if (!wasIdle) return { ok: true, wasIdle: false };
    const result = await pttDown();
    return { ...result, wasIdle: true };
  }

  /**
   * 松开说话键。
   *
   * 关键：**「这一次按下是否从待机进入」必须在按下时判定**（`lastPressWasIdle`），
   * 不能在松开时看状态——按下就已经把状态推到 listening 了，松开时无从区分
   * 「刚进来」和「本来就在会话里」。
   * @param {number} heldMs 按下到松开的毫秒数
   */
  function pressEnd(heldMs = 0) {
    const wasIdle = lastPressWasIdle;
    lastPressWasIdle = false;
    const isTap = heldMs < 300;
    if (isTap) {
      if (wasIdle) return { ok: true, action: "keep-listening" };
      endSession("tap");
      return { ok: true, action: "end" };
    }
    session.setRecording(false);
    recorder.stop();
    publish();
    resumeListening(0);
    return { ok: true, action: "cut" };
  }

  async function pttDown() {
    if (!isAllowedToSpeak()) return { ok: false, reason: "unfocused" };
    session.wake();
    publish();
    try {
      await recorder.start();
      session.setRecording(true);
      micError = null;
      publish();
      return { ok: true };
    } catch (error) {
      const reason = error?.reason ?? "unknown";
      micError = reason;
      session.setRecording(false);
      publish();
      await playCue("ack-mic");
      receipt(t("hive.voice.micFailed").replace("{msg}", t(`hive.voice.mic.${reason}`)), "err");
      return { ok: false, reason };
    }
  }

  function pttUp() {
    session.setRecording(false);
    recorder.stop();
    publish();
    resumeListening(0);
  }

  function endSession(reason = "manual") {
    recorder.release();
    streamer.stop();
    speaking = false;
    session.end(reason);
    publish();
    receipt(t("hive.voice.ended"));
  }

  /* ── 静默计时 / 附和 / 焦点 ── */

  function tick() {
    if (disposed) return;
    const outcome = session.tick();
    if (outcome.action === "auto-answer") {
      void triggerAnswer(false);
      return;
    }
    if (outcome.action === "backchannel") {
      const cue = BACKCHANNEL_CUES[Math.floor(Math.random() * BACKCHANNEL_CUES.length)];
      if (cue) {
        session.markActivity();
        void cues.play(cue).then(() => {
          recorder.holdOff(config.holdOffMs ?? SEGMENT_DEFAULTS.holdOffMs);
          resumeListening(SEGMENT_DEFAULTS.holdOffMs + 60);
        });
      }
      return;
    }
    if (outcome.action === "end" || outcome.action === "confirm-expired") publish();
  }

  function onLevel(rms) {
    if (session.state !== VOICE_STATE.SPEAKING) {
      levelStreak = 0;
      return;
    }
    /* 打断判据（S4：AEC 不达标时以能量阈值兜底）：连续两帧过阈即打断。 */
    if (rms >= (config.bargeInRms ?? SEGMENT_DEFAULTS.speechRms)) {
      levelStreak += 1;
      if (levelStreak >= 2) {
        levelStreak = 0;
        interrupt();
      }
    } else {
      levelStreak = 0;
    }
  }

  function focusLost() {
    streamer.stop();
    speaking = false;
    recorder.holdOff?.(200);
    session.focusLost();
    publish();
  }
  function focusGained() {
    session.focusGained();
    publish();
  }

  /* ── 装配 ── */

  recorder.segmenter.config.speechRms = config.speechRms ?? SEGMENT_DEFAULTS.speechRms;

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => cache,
    /* 外部注入面 */
    setActions(next) {
      actions = next ?? {};
    },
    setStatus(next) {
      status = next ?? null;
      publish();
    },
    setWorkspace(id) {
      workspaceId = id ?? null;
      publish();
    },
    setHotwords(list) {
      hotwords = Array.isArray(list) ? list : [];
      publish();
    },
    applySettings(next) {
      config = session.setConfig(next ?? {});
      recorder.segmenter.config.speechRms = config.speechRms ?? SEGMENT_DEFAULTS.speechRms;
      publish();
      return config;
    },
    /* 生命周期 */
    start() {
      if (timer) return;
      timer = setInterval(tick, 500);
      timer.unref?.();
      recorder.segmenter.config.speechRms = config.speechRms ?? SEGMENT_DEFAULTS.speechRms;
      publish();
    },
    dispose() {
      disposed = true;
      if (timer) clearInterval(timer);
      timer = null;
      streamer.stop();
      cues.stop();
      recorder.release?.();
      listeners.clear();
    },
    /* 动作面 */
    pttDown,
    pttUp,
    pressStart,
    pressEnd,
    triggerAnswer: (manual = true) => triggerAnswer(manual),
    confirm: () => {
      const confirm = session.resolveConfirm(true);
      if (!confirm) return Promise.resolve({ ok: false, reason: "no-confirm" });
      return executeConfirm(confirm);
    },
    cancel: () => {
      const confirm = session.resolveConfirm(false);
      if (!confirm) return Promise.resolve({ ok: false, reason: "no-confirm" });
      publish();
      return playCue("ack-cancelled");
    },
    endSession,
    resumeLast: () => {
      const result = session.resumeLast();
      publish();
      return result;
    },
    deleteSegment: (seq) => {
      const result = session.deleteSegment(seq);
      publish();
      return result;
    },
    rerecordSegment: (seq) => {
      const result = session.markRerecord(seq);
      publish();
      return result;
    },
    interrupt,
    focusLost,
    focusGained,
    tick,
    onLevel,
    playCue,
    preloadCues: () => cues.preload(VOICE_CUES),
    deliverArtifact,
    /* 内部件（测试/调试观察面） */
    session,
    recorder,
    streamer
  };
}

/** 投递提示词组装（标题 + 正文 + 上下文脚注；task 4.3）。 */
export function assembleDeliveryPrompt({ title, body, artifact, fallbackTitle } = {}) {
  const head = `# ${title || fallbackTitle || "语音整理产物"}`;
  const meta = [];
  if (artifact?.relativePath) meta.push(`来源文档：${artifact.relativePath}`);
  if (artifact?.truncated) meta.push("注意：该文档在生成长度上限处被截断，内容不完整。");
  const footer = meta.length > 0 ? `\n\n---\n${meta.join("\n")}` : "";
  return `${head}\n\n${String(body ?? "").trim()}${footer}`;
}

/* ── React 呈现层 ── */

/** 订阅编排核心快照。 */
export function useVoiceDeskSnapshot(desk) {
  return useSyncExternalStore(
    (listener) => desk.subscribe(listener),
    () => desk.getSnapshot()
  );
}

const STATE_LABEL_KEY = {
  idle: "hive.voice.stateIdle",
  listening: "hive.voice.stateListening",
  speaking: "hive.voice.stateSpeaking",
  paused: "hive.voice.statePaused"
};

/** 设置节内分组小标题（与 client.jsx 的同名组件同样式类；各半区自持一份避免循环依赖）。 */
const SetGroup = ({ label }) => <div className="jyv-setGroup">{label}</div>;

/**
 * 语音工作台面板（页面右下角浮层；PTT + 分段 chips + 状态 + 文档卡片 + 目标工作区）。
 */
export function VoiceDeskPanel({ t, desk, workspaces = [], onWorkspace, onClose }) {
  const snap = useVoiceDeskSnapshot(desk);
  const disabled = snap.status?.state === "not-configured";
  const [pttHeld, setPttHeld] = useState(false);
  const pressAtRef = useRef(0);

  /** 按下：记录时刻并进入会话（待机态才真正开麦）。 */
  const down = () => {
    pressAtRef.current = Date.now();
    setPttHeld(true);
    void desk.pressStart?.();
  };
  /** 松开：<300ms 视为单击（切换会话），否则为按住说话（收段）。 */
  const up = () => {
    if (!pttHeld) return;
    setPttHeld(false);
    desk.pressEnd?.(Date.now() - pressAtRef.current);
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.code !== "Space" || !event.altKey || event.repeat) return;
      event.preventDefault();
      down();
    };
    const onKeyUp = (event) => {
      if (event.code !== "Space" || !event.altKey) return;
      up();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  });

  const statusKey = disabled ? "hive.voice.statusNoKey" : snap.status?.state === "no-model" ? "hive.voice.statusNoModel" : "hive.voice.statusReady";

  return (
    <div className="jyv-voiceDesk" data-state={snap.state} data-testid="voice-desk">
      <div className="jyv-voiceHead">
        <span className="jyv-voiceTitle">{t("hive.voice.title")}</span>
        <span className="jyv-voiceState" data-state={snap.state} data-testid="voice-state">
          {t(STATE_LABEL_KEY[snap.state] ?? "hive.voice.stateIdle")}
        </span>
        <button type="button" className="jyv-toolBtn" title={t("hive.voice.close")} onClick={onClose}>
          ×
        </button>
      </div>

      <div className="jyv-voiceRow">
        <button
          type="button"
          className={"jyv-voicePtt" + (pttHeld ? " jyv-voicePttOn" : "")}
          data-testid="voice-ptt"
          disabled={disabled}
          title={t("hive.voice.pttHint")}
          onMouseDown={down}
          onMouseUp={up}
          onMouseLeave={up}
          onTouchStart={(e) => {
            e.preventDefault();
            down();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            up();
          }}
        >
          🎙 {snap.state === "idle" ? t("hive.voice.pttStart") : t("hive.voice.pttEnd")}
        </button>
        <button type="button" className="jyv-voiceMini" data-testid="voice-answer" onClick={() => desk.triggerAnswer(true)} disabled={disabled}>
          {t("hive.voice.answer")}
        </button>
        {/* 原「唤醒/结束」独立按钮已删除（2026-09-27 用户反馈）：说话键单击即切换
            「进入监听 / 结束会话」，与它完全重复；留着反而让人犹豫该按哪个。 */}
      </div>

      <div className="jyv-voiceStatus" data-testid="voice-status">
        <span>{t(statusKey)}</span>
        {snap.status?.key?.source ? <span className="jyv-voiceDim">{t("hive.voice.keySource").replace("{src}", snap.status.key.source)}</span> : null}
        {snap.status?.text?.provider ? (
          <span className="jyv-voiceDim">{`${snap.status.text.provider}/${snap.status.text.model}`}</span>
        ) : null}
      </div>

      {snap.segments.length > 0 ? (
        <div className="jyv-voiceChips" data-testid="voice-chips">
          {snap.segments.map((segment) => (
            <span key={segment.seq} className="jyv-voiceChip" data-status={segment.status}>
              <span className="jyv-voiceChipNo">{segment.seq}</span>
              <span className="jyv-voiceChipText" title={segment.text || segment.error || ""}>
                {segment.text || (segment.status === "pending" ? t("hive.voice.segPending") : segment.status === "failed" ? t("hive.voice.segFailed") : "")}
              </span>
              <button type="button" className="jyv-voiceChipBtn" title={t("hive.voice.rerecord")} onClick={() => desk.rerecordSegment(segment.seq)}>
                ⟳
              </button>
              <button type="button" className="jyv-voiceChipBtn" title={t("hive.voice.delete")} onClick={() => desk.deleteSegment(segment.seq)}>
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {snap.confirm ? (
        <div className="jyv-voiceConfirm" data-testid="voice-confirm">
          <div className="jyv-voiceConfirmEcho">{snap.confirm.echo || t("hive.voice.confirmGeneric")}</div>
          {snap.confirm.candidates?.length ? (
            <div className="jyv-voiceDim">{snap.confirm.candidates.map((c) => `${c.index}. ${c.title}`).join(" / ")}</div>
          ) : null}
          <div className="jyv-voiceRow">
            <button type="button" className="jyv-voiceMini" data-testid="voice-confirm-ok" onClick={() => desk.confirm()}>
              {t("hive.voice.confirmOk")}
            </button>
            <button type="button" className="jyv-voiceMini" data-testid="voice-confirm-cancel" onClick={() => desk.cancel()}>
              {t("hive.voice.confirmCancel")}
            </button>
          </div>
        </div>
      ) : null}

      {snap.artifacts.length > 0 ? (
        <div className="jyv-voiceDocs" data-testid="voice-docs">
          {snap.artifacts.map((artifact, index) => (
            <div key={`${artifact.relativePath}-${index}`} className="jyv-voiceDoc">
              <span className="jyv-voiceDocName" title={artifact.path}>
                📄 {artifact.relativePath}
                {artifact.truncated ? " ⚠️" : ""}
              </span>
              <button type="button" className="jyv-voiceChipBtn" title={t("hive.voice.sendTo")} onClick={() => desk.deliverArtifact?.(artifact)}>
                {t("hive.voice.sendTo")}
              </button>
              <button
                type="button"
                className="jyv-voiceChipBtn"
                title={t("hive.voice.copyPath")}
                onClick={() => navigator.clipboard?.writeText?.(artifact.path ?? artifact.relativePath ?? "")}
              >
                ⧉
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="jyv-voiceRow">
        <label className="jyv-voiceDim" htmlFor="jyv-voiceWs">
          {t("hive.voice.workspace")}
        </label>
        <select
          id="jyv-voiceWs"
          className="jyv-voiceSelect"
          data-testid="voice-workspace"
          value={snap.workspaceId ?? ""}
          onChange={(event) => onWorkspace?.(event.target.value || null)}
        >
          <option value="">{t("hive.voice.workspaceAuto")}</option>
          {workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.title || workspace.path}
            </option>
          ))}
        </select>
      </div>

      {snap.micError ? <div className="jyv-voiceErr">{t("hive.voice.micFailed").replace("{msg}", t(`hive.voice.mic.${snap.micError}`))}</div> : null}
      {snap.missingCues.length > 0 ? <div className="jyv-voiceDim">{t("hive.voice.assetsMissing")}</div> : null}
    </div>
  );
}

/**
 * 设置模态「语音」节（M4 + 2026-09-27 用户追补的**写入式**宿主配置面）。
 *
 * 三层分区，互不混层（spec「语音设置与状态可视化」）：
 *  ① **宿主凭据**（只写不读）：key 输入框恒空、永不回填，提交后宿主写
 *     `$DSH_HOME/hive-voice.json`；界面只显示「已配置/未配置 + 来源」。
 *  ② **宿主侧偏好**：音色/语速/文本通道/文本模型/产出上限/人设/默认工作区/热词编码
 *     —— draft + 显式「保存到宿主」提交（同一路由，一次 PUT）。
 *  ③ **页签级设置**（localStorage 即时生效）：静默阈值/确认卡超时/附和开关/打断阈值。
 */
export function VoiceSettingsBody({ t, settings, setSettings, deskStatus, onRefreshStatus, onSaveHostConfig, workspaces = [] }) {
  const voice = settings?.voice ?? {};
  const patchSession = (next) => setSettings?.({ voice: { ...voice, ...next } });
  const state = deskStatus?.state ?? "unknown";
  const prefs = deskStatus?.prefs ?? {};

  const [keyDraft, setKeyDraft] = useState("");
  const [draft, setDraft] = useState(() => draftOf(prefs));
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);

  /* 探测结果刷新后把宿主侧 draft 拉回真实值（未保存的本地改动会被覆盖——见 note 提示）。 */
  useEffect(() => {
    setDraft(draftOf(prefs));
  }, [deskStatus]);

  const modelOptions = modelOptionsOf(deskStatus?.catalog, t("hive.voice.modelDefault"));

  const submit = async (payload, okKey, failKey) => {
    if (typeof onSaveHostConfig !== "function") return;
    setBusy(true);
    setNote(null);
    const result = await onSaveHostConfig(payload);
    setBusy(false);
    if (result?.ok) {
      setNote({ kind: "ok", text: t(okKey) });
      setKeyDraft("");
      return;
    }
    /* 宿主半区未加载 /voice/config（客户端 HMR 先行）：给「重启 dsh web」的准确指引，
       而不是一个裸 404——否则用户会以为是自己填错了。 */
    const text = result?.stale
      ? t("hive.voice.configStale")
      : t(failKey).replace("{msg}", String(result?.error ?? ""));
    setNote({ kind: "err", text });
  };

  const saveKey = () => {
    const value = keyDraft.trim();
    if (!value) return;
    void submit({ apiKey: value }, "hive.voice.keySaved", "hive.voice.configFailed");
  };
  const clearKey = () => void submit({ clearKey: true }, "hive.voice.keyCleared", "hive.voice.configFailed");
  const savePrefs = () =>
    void submit(
      {
        voice: draft.voice,
        speed: draft.speed,
        textChannel: draft.textChannel,
        asrHotwordsEncoding: draft.asrHotwordsEncoding,
        maxTokens: draft.maxTokens,
        textModel: draft.textModel,
        personaId: draft.personaId,
        targetWorkspaceId: draft.targetWorkspaceId
      },
      "hive.voice.configSaved",
      "hive.voice.configFailed"
    );

  return (
    <div className="jyv-settings" data-testid="voice-settings">
      {/* ① 宿主凭据（只写不读） */}
      <SetGroup label={t("hive.voice.groupHost")} />
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.keyStatus")}</span>
        <span className="jyv-setValue" data-state={state} data-testid="voice-key-state">
          {state === "ready" ? t("hive.voice.keyReady") : state === "not-configured" ? t("hive.voice.keyMissing") : t("hive.voice.keyNoModel")}
        </span>
        {deskStatus?.key?.source ? (
          <span className="jyv-voiceDim">{t("hive.voice.keySource").replace("{src}", deskStatus.key.source)}</span>
        ) : null}
        <button type="button" className="jyv-voiceMini" onClick={() => onRefreshStatus?.()}>
          {t("hive.voice.probe")}
        </button>
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.apiKey")}</span>
        <input
          className="jyv-voiceInput"
          data-testid="voice-key-input"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder={deskStatus?.key?.configured ? t("hive.voice.keyPlaceholderSet") : t("hive.voice.keyPlaceholderEmpty")}
          value={keyDraft}
          onChange={(e) => setKeyDraft(e.target.value)}
        />
        <button type="button" className="jyv-voiceMini" data-testid="voice-key-save" disabled={busy || !keyDraft.trim()} onClick={saveKey}>
          {t("hive.voice.saveKey")}
        </button>
        <button type="button" className="jyv-voiceMini" data-testid="voice-key-clear" disabled={busy} onClick={clearKey}>
          {t("hive.voice.clearKey")}
        </button>
      </div>
      <div className="jyv-voiceDim">{t("hive.voice.keyHint")}</div>

      {/* ② 宿主侧偏好（写入 $DSH_HOME/hive-voice.json） */}
      <SetGroup label={t("hive.voice.groupPrefs")} />
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.voice")}</span>
        <select
          className="jyv-voiceSelect"
          data-testid="voice-pref-voice"
          value={draft.voice}
          onChange={(e) => setDraft({ ...draft, voice: e.target.value })}
        >
          {(deskStatus?.voices ?? ["tongtong"]).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <span className="jyv-setLabel">{t("hive.voice.speed")}</span>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.05"
          value={draft.speed}
          onChange={(e) => setDraft({ ...draft, speed: Number(e.target.value) })}
        />
        <span className="jyv-setValue">{Number(draft.speed).toFixed(2)}</span>
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.textChannel")}</span>
        <select
          className="jyv-voiceSelect"
          data-testid="voice-pref-channel"
          value={draft.textChannel}
          onChange={(e) => setDraft({ ...draft, textChannel: e.target.value })}
        >
          <option value="dsh">{t("hive.voice.channelDsh")}</option>
          <option value="zhipu">{t("hive.voice.channelZhipu")}</option>
        </select>
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.textModel")}</span>
        <select
          className="jyv-voiceSelect"
          data-testid="voice-pref-model"
          value={draft.textModel ? modelKey(draft.textModel) : ""}
          onChange={(e) => {
            const hit = modelOptions.items.find((item) => item.key === e.target.value) ?? null;
            setDraft({ ...draft, textModel: hit?.entry ?? null });
          }}
        >
          {modelOptions.items.map((item) => (
            <option key={item.key || "__default"} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.maxTokens")}</span>
        <input
          type="number"
          min="1"
          max="131072"
          step="1"
          data-testid="voice-pref-maxtokens"
          value={draft.maxTokens}
          onChange={(e) => setDraft({ ...draft, maxTokens: Math.max(1, Math.round(Number(e.target.value) || 1)) })}
        />
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.persona")}</span>
        <select
          className="jyv-voiceSelect"
          data-testid="voice-pref-persona"
          value={draft.personaId ?? ""}
          onChange={(e) => setDraft({ ...draft, personaId: e.target.value || null })}
        >
          <option value="">{t("hive.voice.personaDefault")}</option>
          {(deskStatus?.personas ?? []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.targetWorkspace")}</span>
        <select
          className="jyv-voiceSelect"
          data-testid="voice-pref-workspace"
          value={draft.targetWorkspaceId ?? ""}
          onChange={(e) => setDraft({ ...draft, targetWorkspaceId: e.target.value || null })}
        >
          <option value="">{t("hive.voice.workspaceAuto")}</option>
          {workspaces.map((w) => (
            <option key={w.id} value={w.id}>
              {w.title || w.path}
            </option>
          ))}
        </select>
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.hotwords")}</span>
        <select
          className="jyv-voiceSelect"
          data-testid="voice-pref-hotwords"
          value={draft.asrHotwordsEncoding}
          onChange={(e) => setDraft({ ...draft, asrHotwordsEncoding: e.target.value })}
        >
          {(deskStatus?.hotwordEncodings ?? ["repeat", "json"]).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="jyv-setRow">
        <button type="button" className="jyv-voiceMini" data-testid="voice-prefs-save" disabled={busy} onClick={savePrefs}>
          {busy ? t("hive.voice.saving") : t("hive.voice.saveHost")}
        </button>
        {note ? (
          <span className={note.kind === "err" ? "jyv-voiceErr" : "jyv-voiceDim"} role={note.kind === "err" ? "alert" : undefined}>
            {note.text}
          </span>
        ) : null}
      </div>
      <div className="jyv-voiceDim">{t("hive.voice.watermarkNote")}</div>

      {/* ③ 页签级设置（localStorage，即时生效，不写宿主） */}
      <SetGroup label={t("hive.voice.groupSession")} />
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.silence")}</span>
        <input
          type="number"
          min="1"
          max="120"
          step="1"
          value={Math.round((voice.silenceMs ?? 8000) / 1000)}
          onChange={(e) => patchSession({ silenceMs: Math.max(1000, Number(e.target.value) * 1000) })}
        />
        <span className="jyv-setValue">{t("hive.voice.seconds")}</span>
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.confirmTimeoutLabel")}</span>
        <input
          type="number"
          min="3"
          max="300"
          step="1"
          value={Math.round((voice.confirmTimeoutMs ?? 30000) / 1000)}
          onChange={(e) => patchSession({ confirmTimeoutMs: Math.max(3000, Number(e.target.value) * 1000) })}
        />
        <span className="jyv-setValue">{t("hive.voice.seconds")}</span>
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.backchannel")}</span>
        <input type="checkbox" checked={voice.backchannelEnabled !== false} onChange={(e) => patchSession({ backchannelEnabled: e.target.checked })} />
      </div>
      <div className="jyv-setRow">
        <span className="jyv-setLabel">{t("hive.voice.bargeIn")}</span>
        <input
          type="range"
          min="0.005"
          max="0.2"
          step="0.005"
          value={voice.speechRms ?? 0.02}
          onChange={(e) => patchSession({ speechRms: Number(e.target.value) })}
        />
        <span className="jyv-setValue">{Number(voice.speechRms ?? 0.02).toFixed(3)}</span>
      </div>
    </div>
  );
}

/** 宿主侧偏好 draft（探测结果 → 表单值；缺项落默认）。 */
export function draftOf(prefs) {
  const source = prefs && typeof prefs === "object" ? prefs : {};
  return {
    voice: typeof source.voice === "string" ? source.voice : "tongtong",
    speed: Number.isFinite(Number(source.speed)) ? Number(source.speed) : 1,
    textChannel: source.textChannel === "zhipu" ? "zhipu" : "dsh",
    asrHotwordsEncoding: source.asrHotwordsEncoding === "json" ? "json" : "repeat",
    maxTokens: Number.isFinite(Number(source.maxTokens)) ? Number(source.maxTokens) : 4096,
    textModel: source.textModel && source.textModel.provider ? { provider: source.textModel.provider, model: source.textModel.model } : null,
    personaId: typeof source.personaId === "string" && source.personaId ? source.personaId : null,
    targetWorkspaceId: typeof source.targetWorkspaceId === "string" && source.targetWorkspaceId ? source.targetWorkspaceId : null
  };
}

/** 模型选型键（provider/model[/effort]，与蜂群编辑模态同口径）。 */
export function modelKey(entry) {
  if (!entry) return "";
  return entry.provider + "/" + entry.model + (entry.reasoningEffort ? "/" + entry.reasoningEffort : "");
}

/**
 * 目录 → 下拉项（首项空键 = 跟随目录默认）。目录 groups 形状与
 * `/api/dsh-hive/models` 同源（`{ id, name, models: [{ id, name, reasoning }] }`）。
 */
export function modelOptionsOf(catalog, noneLabel) {
  const items = [{ key: "", entry: null, label: noneLabel }];
  for (const group of catalog?.groups ?? []) {
    const provider = group?.id ?? group?.provider;
    if (!provider) continue;
    for (const model of group.models ?? []) {
      const efforts = model.reasoning?.efforts ?? [];
      for (const effort of efforts.length ? efforts : [null]) {
        const entry = { provider, model: model.id, ...(effort ? { reasoningEffort: effort.id } : {}) };
        const key = modelKey(entry);
        if (items.some((item) => item.key === key)) continue;
        items.push({ key, entry, label: `${group.name ?? provider} · ${model.name ?? model.id}${effort ? " · " + effort.name : ""}` });
      }
    }
  }
  return { items };
}

export { VOICE_STATE, INTENT, hasSideEffect };
