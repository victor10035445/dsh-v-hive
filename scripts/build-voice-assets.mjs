#!/usr/bin/env node
/**
 * 固定语音资产建库脚本（add-hive-voice-desk 2.6 / design D7，审阅 R17/R18）。
 *
 * 开发期用 GLM-TTS **一次性**生成指令应答音与附和短句 → `assets/voice/*.wav`；
 * 运行期零 TTS 调用（浏览器 WebAudio 解码本地资产）。
 *
 * 用法：
 *   pnpm voice:build                 # 用默认音色/语速生成全部资产
 *   pnpm voice:build --voice jam --speed 1.1
 *   pnpm voice:build --rate 24000 --no-trim   # 关掉归一化（保留上游原始格式）
 *   pnpm voice:build --check         # 只校验既有资产（体积预算/缺失），不需要 key
 *   pnpm voice:build --dry-run       # 只列出将生成什么，不发请求
 *
 * 纪律：
 *  - 官方契约（审阅 F2/F4）：`POST /api/paas/v4/audio/speech`，
 *    JSON 体 `{ model:"glm-tts", input, voice, response_format:"wav", speed }`，
 *    非流式返回**裸二进制 wav**（不是 JSON 包装）。
 *  - `input` ≤1024 字符；`watermark_enabled` 默认 true（音频含显式+隐式水印，README 有说明）。
 *  - **无 key 非零退出并给指引，SHALL NOT 产出半套资产**：全部音频先在内存生成、
 *    归一化、全部过体积预算后才一次性落盘。
 *  - **归一化是必需的**（2026-09-27 真实 key 实测）：上游返回 24kHz 单声道 PCM16 且带
 *    1–2s 空白垫——「好的」2.51s/118KB、「这是蜂巢总览」3.55s/166KB，直接落盘单条必然超预算。
 *    故默认「去静音 + 降到 16kHz」（16k 对短提示音足够，WebAudio 会自行重采样到设备率）。
 *  - 体积预算（R18，按实测重新标定）：单条 ≤80KB、总量 ≤1.5MB（预生成 wav 进发布包）。
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ASSET_BUDGET, VOICE_CUES } from "../src/hive/voice/assets.mjs";
import { KEY_ENV_NAMES, ZHIPU_TTS_MODEL, ZHIPU_TTS_URL, normalizeCueWav } from "../src/hive-voice.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "assets", "voice");

function parseArgs(argv) {
  const out = { voice: null, speed: null, rate: 16000, trim: true, check: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--check") out.check = true;
    else if (arg === "--dry-run") out.dryRun = true;
    else if (arg === "--no-trim") out.trim = false;
    else if (arg === "--trim") out.trim = true;
    else if (arg === "--rate") out.rate = Number(argv[++i]);
    else if (arg === "--voice") out.voice = argv[++i] ?? null;
    else if (arg === "--speed") out.speed = Number(argv[++i]);
    else if (arg === "--help" || arg === "-h") out.help = true;
  }
  return out;
}

function readFileConfig() {
  const envHome = typeof process.env.DSH_HOME === "string" ? process.env.DSH_HOME.trim() : "";
  const home = envHome || join(homedir(), ".dsh");
  const path = join(home, "hive-voice.json");
  if (!existsSync(path)) return { path, config: {} };
  try {
    return { path, config: JSON.parse(readFileSync(path, "utf8")) ?? {} };
  } catch {
    return { path, config: {} };
  }
}

function resolveKey() {
  for (const name of KEY_ENV_NAMES) {
    const value = typeof process.env[name] === "string" ? process.env[name].trim() : "";
    if (value) return { apiKey: value, source: `env ${name}` };
  }
  const { path, config } = readFileConfig();
  const fileKey = typeof config.apiKey === "string" ? config.apiKey.trim() : "";
  if (fileKey) return { apiKey: fileKey, source: path };
  return { apiKey: null, source: null, configPath: path };
}

/** `--check`：只校验既有资产（缺失 / 单条超预算 / 总量超预算）。 */
function check() {
  const problems = [];
  let total = 0;
  if (!existsSync(OUT_DIR)) {
    problems.push(`资产目录不存在：${OUT_DIR}`);
    return { problems, total };
  }
  for (const cue of VOICE_CUES) {
    const file = join(OUT_DIR, cue.file);
    if (!existsSync(file)) {
      problems.push(`缺失：${cue.file}（"${cue.text}"）`);
      continue;
    }
    const size = statSync(file).size;
    total += size;
    if (size > ASSET_BUDGET.maxPerFile) {
      problems.push(`超单条预算：${cue.file} = ${size}B > ${ASSET_BUDGET.maxPerFile}B（裁剪文本或提高采样率前先看 README）`);
    }
  }
  const extras = readdirSync(OUT_DIR).filter((name) => name.endsWith(".wav") && !VOICE_CUES.some((c) => c.file === name));
  for (const name of extras) problems.push(`孤儿资产（清单里没有）：${name}`);
  if (total > ASSET_BUDGET.maxTotal) problems.push(`超总量预算：${total}B > ${ASSET_BUDGET.maxTotal}B`);
  return { problems, total };
}

async function synthesize({ apiKey, voice, speed, cue }) {
  const response = await fetch(ZHIPU_TTS_URL, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + apiKey },
    body: JSON.stringify({
      model: ZHIPU_TTS_MODEL,
      input: cue.text,
      voice,
      response_format: "wav",
      speed
    })
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const error = new Error(`${cue.id}: upstream ${response.status} ${detail.slice(0, 200)}`);
    try {
      error.code = JSON.parse(detail)?.error?.code ?? null;
    } catch {
      error.code = null;
    }
    throw error;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length === 0) throw new Error(`${cue.id}: empty audio`);
  /* 非流式 wav：校验 RIFF 魔数，防上游改回 JSON 包装（F4）。 */
  if (buffer.subarray(0, 4).toString("ascii") !== "RIFF") {
    throw new Error(`${cue.id}: response is not a RIFF wav (upstream contract changed?)`);
  }
  return buffer;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log("usage: pnpm voice:build [--voice <id>] [--speed <0.5-2>] [--check] [--dry-run]");
    return 0;
  }
  if (args.check) {
    const { problems, total } = check();
    console.log(`voice assets: ${VOICE_CUES.length} 条清单，现盘总量 ${(total / 1024).toFixed(1)}KB / 预算 ${(ASSET_BUDGET.maxTotal / 1024).toFixed(0)}KB`);
    if (problems.length === 0) {
      console.log("✓ 资产齐备且未超预算");
      return 0;
    }
    for (const problem of problems) console.error("✗ " + problem);
    return 1;
  }

  const key = resolveKey();
  const { config } = readFileConfig();
  const voice = args.voice ?? (typeof config.voice === "string" ? config.voice : "tongtong");
  const speed = Number.isFinite(args.speed) ? args.speed : Number.isFinite(Number(config.speed)) ? Number(config.speed) : 1;

  console.log(`voice assets: voice=${voice} speed=${speed} rate=${args.rate} trim=${args.trim} 条数=${VOICE_CUES.length}`);
  if (args.dryRun) {
    for (const cue of VOICE_CUES) console.log(`  · ${cue.file}  [${cue.kind}]  "${cue.text}"`);
    return 0;
  }
  if (!key.apiKey) {
    console.error("✗ 未配置智谱 key —— 建库脚本不产出任何资产（避免半套资产）。");
    console.error("  任选其一后重跑：");
    console.error(`   1) 设置环境变量 ${KEY_ENV_NAMES.join(" / ")}`);
    console.error(`   2) 写入 ${key.configPath}：{ "apiKey": "…", "voice": "tongtong", "speed": 1 }`);
    console.error("  只校验既有资产（不需要 key）：pnpm voice:build --check");
    return 2;
  }

  /* 全量先生成 + 归一化到内存（SHALL NOT 半套落盘），全部过预算后再一次性写盘。 */
  const generated = [];
  let total = 0;
  let rawTotal = 0;
  for (const cue of VOICE_CUES) {
    if (cue.text.length > 1024) {
      console.error(`✗ ${cue.id}: 文案超过 TTS input 上限 1024 字符`);
      return 1;
    }
    const raw = await synthesize({ apiKey: key.apiKey, voice, speed, cue });
    rawTotal += raw.length;
    const normalized = normalizeCueWav(raw, { targetRate: args.rate, trim: args.trim });
    if (!normalized) {
      console.error(`✗ ${cue.id}: 上游返回的不是 PCM16 WAV（契约变更？）——未写入任何文件`);
      return 1;
    }
    if (normalized.bytes.length > ASSET_BUDGET.maxPerFile) {
      console.error(`✗ ${cue.id}: 归一化后 ${normalized.bytes.length}B 仍超单条预算 ${ASSET_BUDGET.maxPerFile}B（缩短文案后重跑）`);
      return 1;
    }
    total += normalized.bytes.length;
    generated.push({ cue, buffer: normalized.bytes });
    console.log(
      `  ✓ ${cue.file}  ${normalized.seconds.toFixed(2)}s  ${(normalized.bytes.length / 1024).toFixed(1)}KB` +
        `（原始 ${(raw.length / 1024).toFixed(1)}KB，去静音 ${normalized.trimmedMs}ms）`
    );
  }
  if (total > ASSET_BUDGET.maxTotal) {
    console.error(`✗ 总量 ${total}B 超预算 ${ASSET_BUDGET.maxTotal}B —— 未写入任何文件`);
    return 1;
  }
  mkdirSync(OUT_DIR, { recursive: true });
  for (const { cue, buffer } of generated) writeFileSync(join(OUT_DIR, cue.file), buffer);
  console.log(`✓ 已写入 ${generated.length} 条资产到 assets/voice/（归一化后 ${(total / 1024).toFixed(1)}KB；上游原始合计 ${(rawTotal / 1024).toFixed(1)}KB）`);
  console.log(`  归一化：去静音 + ${args.rate}Hz 单声道（--no-trim / --rate 可关）。`);
  console.log("  注：GLM-TTS 默认加水印（显式 + 隐式数字水印），README 已说明。");
  return 0;
}

/** 上游错误码 → 可执行指引（避免只丢一个 code 让用户自己猜）。 */
const UPSTREAM_HINTS = {
  1113: "账号余额 / 资源包不足——去智谱控制台充值，或换一个有额度的 key 后重跑。",
  1000: "鉴权失败——key 无效或已停用（检查 $DSH_HOME/hive-voice.json 的 apiKey）。",
  1214: "音色不存在——用 --voice 指定合法音色（tongtong/chuichui/xiaochen/jam/kazi/douji/luodo）。",
  1301: "触发限流——稍后重跑（失败不会留下半套资产）。"
};

main()
  /* 用 exitCode 而非 process.exit()：Windows 上后者会与仍在收尾的 fetch/undici 句柄
     竞态（实测触发 libuv `!(handle->flags & UV_HANDLE_CLOSING)` 断言崩溃），
     既掩盖真实原因又污染 stderr。让进程自然退出，退出码照常非零。 */
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error("✗ 建库失败：" + String(error?.message || error));
    const hint = error?.code != null ? UPSTREAM_HINTS[error.code] : null;
    if (hint) console.error("  → " + hint);
    else if (error?.code != null) console.error(`  → 上游错误码 ${error.code}（见智谱控制台错误码表）`);
    console.error("  未写入任何文件（SHALL NOT 产出半套资产）。");
    process.exitCode = 1;
  });
