#!/usr/bin/env node
/**
 * 模型资产转换管线：仓库根目录 `<id>.fbx` → `assets/models/<id>.glb`
 * （bee-model-choose-by-color / design.md D5，规格 `bee-model-asset-pipeline`）。
 *
 * 用法：
 *   pnpm models:build                  # 全量：转换全部根目录 FBX 源（未变更源跳过）
 *   pnpm models:build --only pink_worker
 *   pnpm models:build --force          # 覆盖未变更源
 *   pnpm models:build --doc            # 只打印各模型转换参数与手工流程说明
 *   pnpm models:build --check <file.glb>   # 只跑产物校验器（不转换）
 *   node scripts/build-model-assets.mjs --check assets/models/worker.glb
 *
 * ── 两个包级事实（设计审阅实测，务必知悉） ──────────────────────────────
 * 1) `fbx2gltf` 的 `convert()` 在子进程 close 回调里**无条件删除源旁同名 `.fbm` 目录**
 *    （node_modules/fbx2gltf/index.js L59-68）。仓库现有 `pink_worker.fbm` /
 *    `purple_worker.fbm` 即历史转换遗留物——本脚本运行会清掉它们，**不是源资产丢失**：
 *    FBX 自带贴图引用，转换不依赖该目录（`pink/purple` 的源贴图与 GLB 内嵌贴图
 *    SHA256 已实测一致）。
 * 2) 平台二进制随包分发（`bin/{Darwin,Linux,Windows_NT}/`），需可执行权限与 stdio 管道。
 *    受限沙箱/CI 里可能不可用——本管线定位为**开发机工具**：不入 CI 门禁、不被
 *    `build.mjs` 与发布流程调用（发布包 `files` 也不含根目录 FBX 源）。
 *
 * ── 非 FBX 源（不在本管线强制范围） ────────────────────────────────────
 * `blue_worker` 无根目录 FBX 源：其源为 `blue-worker/` 内 19.5MB Blender 手工导出 GLB
 * （mesh `node_0`、单贴图、无 `extensionsUsed`），经上游减容压缩（gltf-transform 类）后
 * 改名入库为 `assets/models/blue_worker.glb`。该类产物的可复现性由**手工流程**承担，
 * 本脚本只校验其产物（`--check`），不参与其生成。
 */
import { createRequire } from "node:module";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const MODELS_DIR = join(ROOT, "assets", "models");

const require = createRequire(import.meta.url);

/* ── 按模型的显式转换参数（规格「转换参数按模型显式」） ─────────────────────
   SHALL NOT 一套默认参数打天下：实测既有产物 `worker.glb` 带 `KHR_materials_unlit`
   （unlit 观感档位），`purple/pink` 为 PBR（`extensionsUsed` 为空）——转换参数必须
   逐模型显式给出，参数漂移由产物校验的「扩展集合比对」警告兜住。
   `args` 逐项传给 fbx2gltf（`--binary` 由包内 convert() 依 `.glb` 后缀自动补）。 */
export const PIPELINE = [
  {
    id: "worker",
    args: ["--khr-materials-unlit"],
    note: "unlit 材质（KHR_materials_unlit）——黑红工蜂本色直出，不受光照影响"
  },
  {
    id: "purple_worker",
    args: [],
    note: "PBR 默认（无扩展）"
  },
  {
    id: "pink_worker",
    args: [],
    note: "PBR 默认（无扩展）"
  }
];

/* 非 FBX 源产物：登记在案但不入转换管线（注释即文档，规格要求「记录来源与手工流程」）。 */
export const MANUAL_ASSETS = [
  {
    id: "blue_worker",
    note:
      "源 = blue-worker/ 内 Blender 手工导出 GLB（19.5MB，mesh node_0、单贴图、无 extensionsUsed）" +
      "→ 上游减容压缩后改名入库；不在本脚本转换范围，仅可 --check 校验"
  }
];

/* ── 产物校验器（纯 node 解析 GLB header + JSON chunk，零新依赖） ─────────── */

/* 加载器白名单：渲染层 `new GLTFLoader()` 未挂解码器（src/hive/bees.mjs），故拒绝
   一切需额外解码器的压缩扩展。原生支持扩展不受限（按需追加白名单）。 */
export const EXTENSION_WHITELIST = Object.freeze([
  "KHR_materials_unlit",
  "KHR_materials_emissive_strength",
  "KHR_texture_transform",
  "KHR_materials_ior",
  "KHR_materials_specular",
  "KHR_materials_clearcoat",
  "KHR_materials_sheen",
  "KHR_materials_transmission",
  "KHR_materials_volume",
  "KHR_materials_iridescence",
  "KHR_materials_anisotropy",
  "KHR_materials_dispersion"
]);

/* 明令拒绝的压缩/纹理扩展（白名单之外另立显式清单，让违规报告更可读） */
export const REJECTED_EXTENSIONS = Object.freeze([
  "KHR_draco_mesh_compression",
  "EXT_meshopt_compression",
  "KHR_texture_basisu",
  "EXT_texture_webp",
  "KHR_mesh_quantization"
]);

const GLB_MAGIC = 0x46546c67; // "glTF"
const CHUNK_JSON = 0x4e4f534a; // "JSON"
const CHUNK_BIN = 0x004e4942; // "BIN\0"

/**
 * 解析 GLB：12B header（magic/version/length）+ chunk 序列（length/type/data）。
 * 纯结构解析，不做材质语义判断。返回 `{ json, hasBin, binLength, declaredLength, actualLength, errors }`。
 * header 长度自洽与 JSON chunk 可解析为**硬约束**（截断/半成品产物检出）。
 */
export function parseGlb(buffer) {
  const errors = [];
  const actualLength = buffer.length;
  if (actualLength < 12) {
    return { json: null, errors: ["GLB 长度不足 12 字节（header 不完整）"], actualLength, declaredLength: null, hasBin: false, binLength: 0 };
  }
  const magic = buffer.readUInt32LE(0);
  const version = buffer.readUInt32LE(4);
  const declaredLength = buffer.readUInt32LE(8);
  if (magic !== GLB_MAGIC) errors.push(`GLB magic 非法（0x${magic.toString(16)}，期望 0x${GLB_MAGIC.toString(16)}）`);
  if (version !== 2) errors.push(`GLB version 非 2（实际 ${version}）`);
  if (declaredLength !== actualLength) errors.push(`GLB header 声明长度 ${declaredLength} ≠ 实际字节数 ${actualLength}（截断或半成品产物）`);
  let offset = 12;
  let json = null;
  let hasBin = false;
  let binLength = 0;
  let chunkIndex = 0;
  while (offset + 8 <= actualLength) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    const end = start + chunkLength;
    if (end > actualLength) {
      errors.push(`chunk#${chunkIndex} 越界（声明 ${chunkLength} 字节，剩余 ${actualLength - start}）`);
      break;
    }
    if (chunkType === CHUNK_JSON) {
      if (json !== null) errors.push("出现多个 JSON chunk（GLB 规范只允许一个）");
      else {
        try {
          json = JSON.parse(buffer.subarray(start, end).toString("utf8"));
        } catch (error) {
          errors.push(`JSON chunk 不可解析：${String(error?.message ?? error).slice(0, 120)}`);
        }
      }
    } else if (chunkType === CHUNK_BIN) {
      hasBin = true;
      binLength = chunkLength;
    }
    offset = end;
    chunkIndex += 1;
  }
  if (json === null && !errors.some((e) => e.includes("JSON chunk"))) errors.push("缺少 JSON chunk");
  return { json, hasBin, binLength, declaredLength, actualLength, errors };
}

/**
 * 校验解析后的 GLB（规格「产物可审计与渲染兼容校验」）。
 * 返回 `{ ok, errors, warnings, facts }`——errors 非空即拒绝入库（脚本非零退出）。
 *
 * 硬约束：JSON chunk 可解析 + header 长度自洽、images 全 bufferView 嵌入（无外部 uri）、
 *        extensionsUsed ⊆ 白名单（拒绝 Draco/Meshopt/KTX2 等）。
 * 警告级：mesh 名非空且落在已知节点名族、**与既有同名产物的 extensionsUsed 集合差异**
 *        （转换参数漂移审计）。
 */
export function validateGlb(buffer, { id = "?", baseline = null, meshNameFamilies = [/^tripo_node_/, /^node_/, /^blue_worker$/] } = {}) {
  const parsed = parseGlb(buffer);
  const errors = [...parsed.errors];
  const warnings = [];
  const facts = { id, bytes: parsed.actualLength, extensionsUsed: [], images: 0, externalImages: 0, meshes: [], nodes: 0, hasBin: parsed.hasBin, binLength: parsed.binLength, generator: null };
  const json = parsed.json;
  if (!json) return { ok: false, errors, warnings, facts, parsed };
  if (typeof json !== "object" || Array.isArray(json)) errors.push("JSON chunk 根节点非对象");

  facts.generator = typeof json.asset?.generator === "string" ? json.asset.generator : null;
  if (json.asset?.version !== "2.0") errors.push(`asset.version 非 "2.0"（实际 ${JSON.stringify(json.asset?.version ?? null)}）`);

  /* 贴图嵌入（无外部依赖）：images[i].uri 存在即违规（data: URI 之外一律拒绝）；
     走 bufferView 才算真正嵌入 GLB。 */
  const images = Array.isArray(json.images) ? json.images : [];
  facts.images = images.length;
  images.forEach((image, index) => {
    const label = image?.name ? `${image.name}#${index}` : `#${index}`;
    if (typeof image?.uri === "string") {
      facts.externalImages += 1;
      errors.push(`images[${label}] 引用外部 URI（贴图未嵌入 GLB）`);
    } else if (typeof image?.bufferView !== "number") {
      errors.push(`images[${label}] 既无 bufferView 也无 uri（结构不可解析）`);
    } else if (!Array.isArray(json.bufferViews) || !json.bufferViews[image.bufferView]) {
      errors.push(`images[${label}] bufferView 索引越界（${image.bufferView}）`);
    }
  });

  /* 扩展白名单：压缩扩展一票否决（渲染层 GLTFLoader 无解码器）。 */
  const extensionsUsed = Array.isArray(json.extensionsUsed) ? json.extensionsUsed.filter((e) => typeof e === "string") : [];
  facts.extensionsUsed = [...extensionsUsed].sort();
  for (const ext of extensionsUsed) {
    if (REJECTED_EXTENSIONS.includes(ext)) errors.push(`extensionsUsed 含压缩扩展 ${ext}（渲染层未配置解码器，SHALL NOT 入库）`);
    else if (!EXTENSION_WHITELIST.includes(ext)) errors.push(`extensionsUsed 含白名单外扩展 ${ext}（需人工确认渲染兼容后加入白名单）`);
  }

  /* mesh 命名（审计锚点）：非空 + 名族比对（警告级——启发式，SHALL NOT 误杀合法产物）。 */
  const nodes = Array.isArray(json.nodes) ? json.nodes : [];
  facts.nodes = nodes.length;
  nodes.forEach((node, index) => {
    if (typeof node?.mesh !== "number") return;
    const name = typeof node.name === "string" ? node.name : "";
    facts.meshes.push(name);
    if (!name) errors.push(`nodes[${index}] 引用 mesh 但节点名为空（mesh 名是与源模型比对的审计锚点）`);
    else if (!meshNameFamilies.some((re) => re.test(name))) warnings.push(`节点名 ${name} 不在已知名族（${meshNameFamilies.map(String).join(" / ")}）——人工确认是否沿用源节点名`);
    if (Array.isArray(node.children) && node.children.length > 0) warnings.push(`节点 ${name || index} 含子节点——浏览器 GLTFLoader 对含子节点层级的 mesh 不渲染，需人工确认`);
  });
  if (facts.meshes.length === 0) errors.push("产物不含任何 mesh 节点（空模型）");
  if (!parsed.hasBin && facts.images > 0) errors.push("声明了贴图但无 BIN chunk（贴图数据缺失）");

  /* 转换参数漂移审计（警告级，但必须打印）：与既有同名产物的 extensionsUsed 集合差异。 */
  const base = Array.isArray(baseline) ? [...baseline].sort() : null;
  if (base && JSON.stringify(base) !== JSON.stringify(facts.extensionsUsed)) {
    warnings.push(`extensionsUsed 与既有同名产物不一致：既有 [${base.join(", ")}] → 新 [${facts.extensionsUsed.join(", ")}]（转换参数漂移，替换前需人工复核观感档位）`);
  }
  if (base) facts.baselineExtensions = base;

  return { ok: errors.length === 0, errors, warnings, facts, parsed };
}

/** 读文件 → 解析（含既有同名产物的 extensionsUsed 作为漂移基准）→ 校验。 */
export function validateFile(filePath, { id = filePath } = {}) {
  const buffer = readFileSync(filePath);
  let baseline = null;
  try {
    const parsed = parseGlb(buffer);
    baseline = Array.isArray(parsed.json?.extensionsUsed) ? parsed.json.extensionsUsed : [];
  } catch {
    baseline = null;
  }
  return validateGlb(buffer, { id, baseline });
}

/** 人类可读报告（脚本与 --check 共用）。 */
export function formatReport(result) {
  const lines = [`[${result.facts.id}] ${result.ok ? "OK" : "FAIL"} — ${result.facts.bytes} bytes，mesh=${JSON.stringify(result.facts.meshes)}，extensionsUsed=${JSON.stringify(result.facts.extensionsUsed)}`];
  for (const warning of result.warnings) lines.push(`  warn: ${warning}`);
  for (const error of result.errors) lines.push(`  error: ${error}`);
  return lines.join("\n");
}

/* ── 脚本主体 ──────────────────────────────────────────────────────────── */

export function parseArgs(argv) {
  const out = { only: null, force: false, check: null, checkAll: false, doc: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--only") out.only = argv[++i] ?? null;
    else if (arg === "--force") out.force = true;
    else if (arg === "--check") out.check = argv[++i] ?? null;
    else if (arg === "--check-all") out.checkAll = true;
    else if (arg === "--doc") out.doc = true;
    else if (arg === "--help" || arg === "-h") out.help = true;
    else out.only = arg; // 裸位置参数视作 --only <id>
  }
  return out;
}

const USAGE = `用法：
  node scripts/build-model-assets.mjs [--only <id>] [--force] [--doc]
  node scripts/build-model-assets.mjs --check <file.glb>     # 校验单个产物（含漂移比对）
  node scripts/build-model-assets.mjs --check-all            # 全部登记产物零误报基准自检
  （package.json 捷径：pnpm models:build）`;

function printDoc() {
  console.log("FBX→GLB 转换管线（开发机工具；不入 CI 门禁）\n");
  console.log("按模型的显式转换参数：");
  for (const item of PIPELINE) {
    console.log(`  - ${item.id}: ${item.args.length ? item.args.join(" ") : "(PBR 默认，无扩展)"} — ${item.note}`);
  }
  console.log("\n非 FBX 源（手工流程，不入管线）：");
  for (const item of MANUAL_ASSETS) console.log(`  - ${item.id}: ${item.note}`);
  console.log("\n包级事实：convert() 会删除源旁同名 .fbm 目录（历史遗留物，非源资产丢失）；");
  console.log("平台二进制随包分发，需执行权限与 stdio 管道（受限沙箱/CI 可能不可用）。");
}

/** 源未变更（产物存在且比源新）→ 跳过；`--force` 覆盖。 */
function shouldSkip(srcPath, destPath, force) {
  if (force) return false;
  if (!existsSync(destPath)) return false;
  try {
    return statSync(destPath).mtimeMs >= statSync(srcPath).mtimeMs;
  } catch {
    return false;
  }
}

async function buildOne(item, { force }) {
  const src = join(ROOT, `${item.id}.fbx`);
  const dest = join(MODELS_DIR, `${item.id}.glb`);
  if (!existsSync(src)) {
    console.error(`[${item.id}] 跳过：源不存在（${src}）`);
    return { id: item.id, status: "missing" };
  }
  if (shouldSkip(src, dest, force)) {
    console.log(`[${item.id}] 跳过：源未变更（--force 可强制重建）`);
    return { id: item.id, status: "skipped" };
  }
  /* 原子替换纪律（规格「写前校验 + 临时文件原子替换」）：先转临时文件 → 对「临时产物
     + 既有同名产物」完成全部校验（扩展集合比对依赖既有产物，必须在替换前完成）→ 才覆盖。 */
  const tmpRaw = join(MODELS_DIR, `.${item.id}.raw.glb`);
  const tmpGlb = join(MODELS_DIR, `.${item.id}.candidate.glb`);
  try {
    mkdirSync(MODELS_DIR, { recursive: true });
    rmSync(tmpRaw, { force: true });
    rmSync(tmpGlb, { force: true });
    const convert = require("fbx2gltf");
    /* fbx2gltf 的 convert 会删源旁同名 .fbm（历史遗留物，见文件头注释）。 */
    await convert(src, tmpRaw, [...item.args]);
    /* 包内换名：convert 返回不带扩展名的路径，产物落在 tmpRaw（本目录内，避开宿主文件监视）。 */
    if (!existsSync(tmpRaw)) throw new Error(`转换未产出文件（${tmpRaw}）`);
    copyFileSync(tmpRaw, tmpGlb);
    const baselineResult = existsSync(dest) ? parseGlb(readFileSync(dest)) : null;
    const baseline = Array.isArray(baselineResult?.json?.extensionsUsed) ? baselineResult.json.extensionsUsed : null;
    const result = validateGlb(readFileSync(tmpGlb), { id: item.id, baseline });
    console.log(formatReport(result));
    if (!result.ok) {
      console.error(`[${item.id}] 校验失败：SHALL NOT 覆盖既有产物（既有 ${dest} 保持不动）`);
      return { id: item.id, status: "rejected" };
    }
    renameSync(tmpGlb, dest);
    console.log(`[${item.id}] 已入库：${dest}`);
    return { id: item.id, status: "written" };
  } finally {
    rmSync(tmpRaw, { force: true });
    rmSync(tmpGlb, { force: true });
  }
}

/** 最近变更的根目录 FBX 源（默认全量的排序口径：按 mtime 降序，便于先看动过的）。 */
function rootsFbxIds() {
  return readdirSync(ROOT)
    .filter((name) => name.toLowerCase().endsWith(".fbx"))
    .map((name) => name.replace(/\.fbx$/i, ""));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(USAGE);
    return 0;
  }
  if (args.doc) {
    printDoc();
    return 0;
  }
  if (args.check) {
    const result = validateFile(args.check, { id: args.check });
    console.log(formatReport(result));
    return result.ok ? 0 : 1;
  }
  if (args.checkAll) {
    /* 基准自检：对全部登记产物（含非 FBX 源的手工产物）跑校验器，确认零误报。
       漂移比对基准 = 产物自身的 extensionsUsed（集合必然相等）→ 只露硬约束与命名警告。 */
    const ids = [...PIPELINE.map((item) => item.id), ...MANUAL_ASSETS.map((item) => item.id)];
    let failed = 0;
    for (const id of ids) {
      const file = join(MODELS_DIR, `${id}.glb`);
      if (!existsSync(file)) {
        console.error(`[${id}] 产物缺失：${file}`);
        failed += 1;
        continue;
      }
      const result = validateFile(file, { id });
      console.log(formatReport(result));
      if (!result.ok) failed += 1;
      if (MANUAL_ASSETS.some((m) => m.id === id)) console.log("  note: 非 FBX 源（手工流程产物），不在转换管线范围");
    }
    console.log(`\n基准自检：${ids.length - failed}/${ids.length} 通过`);
    return failed > 0 ? 1 : 0;
  }
  const known = new Set(PIPELINE.map((item) => item.id));
  const sourceIds = rootsFbxIds();
  for (const id of sourceIds) {
    if (!known.has(id)) console.warn(`[${id}] 根目录存在 FBX 源但未登记转换参数——请先在 PIPELINE 中按模型显式登记（SHALL NOT 用一套默认参数打天下）`);
  }
  let todo = PIPELINE;
  if (args.only) {
    todo = PIPELINE.filter((item) => item.id === args.only);
    if (todo.length === 0) {
      console.error(`未知模型 id：${args.only}（已登记：${[...known].join(", ")}；非 FBX 源：${MANUAL_ASSETS.map((m) => m.id).join(", ")} 走手工流程）`);
      return 2;
    }
  }
  const results = [];
  for (const item of todo) results.push(await buildOne(item, args));
  const rejected = results.filter((r) => r.status === "rejected");
  const written = results.filter((r) => r.status === "written");
  console.log(`\n合计：写入 ${written.length}，拒绝 ${rejected.length}，跳过 ${results.length - written.length - rejected.length}`);
  return rejected.length > 0 ? 1 : 0;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error("转换管线失败：", error?.message ?? error);
      process.exitCode = 1;
    });
}
