/**
 * 模型资产管线校验器冒烟测试（bee-model-choose-by-color 4.6，规格
 * `bee-model-asset-pipeline`「产物可审计与渲染兼容校验」全场景）。
 *
 * 手法：纯 node 构造伪 GLB（12B header + JSON chunk + 可选 BIN chunk），直测纯函数
 * 校验器 `validateGlb`——不跑 fbx2gltf（平台二进制不入 CI 门禁），只钉住「什么样的
 * 产物会被拒绝/告警」：
 *  - 合规伪 GLB → 放行；
 *  - 外部贴图 URI → 拒绝（贴图未嵌入）；
 *  - Draco 等压缩扩展 → 拒绝（渲染层 GLTFLoader 无解码器）；
 *  - header 声明长度 ≠ 实际字节数（截断）/ JSON chunk 不可解析 → 拒绝；
 *  - 与既有同名产物的 extensionsUsed 集合差异 → 警告（转换参数漂移，不阻断）；
 *  - 空 mesh 名 → 拒绝（审计锚点丢失）；
 *  - 仓库现有四份真实产物的结构事实（贴图全嵌入、mesh 名族）由基线断言看守。
 *
 * 运行：node test/model-assets-smoke.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MANUAL_ASSETS, MODELS_DIR, PIPELINE, REJECTED_EXTENSIONS, parseGlb, validateGlb, validateFile } from "../scripts/build-model-assets.mjs";

const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};
const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ── 伪 GLB 构造器（合规基线 + 各违规变体） ── */
const pad4 = (buf, fill) => {
  const rest = buf.length % 4;
  if (rest === 0) return buf;
  return Buffer.concat([buf, Buffer.alloc(4 - rest, fill)]);
};
function buildGlb(json, { bin = null, declaredLength = null } = {}) {
  const jsonChunk = pad4(Buffer.from(JSON.stringify(json), "utf8"), 0x20);
  const binChunk = bin ? pad4(bin, 0x00) : null;
  const total = 12 + 8 + jsonChunk.length + (binChunk ? 8 + binChunk.length : 0);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(declaredLength ?? total, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const parts = [header, jsonHeader, jsonChunk];
  if (binChunk) {
    const binHeader = Buffer.alloc(8);
    binHeader.writeUInt32LE(binChunk.length, 0);
    binHeader.writeUInt32LE(0x004e4942, 4);
    parts.push(binHeader, binChunk);
  }
  return Buffer.concat(parts);
}

const texture = (overrides = {}) => ({ bufferView: 0, mimeType: "image/png", ...overrides });
const baseJson = (overrides = {}) => ({
  asset: { version: "2.0", generator: "smoke-fixture" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ name: "tripo_node_7fe4119c", mesh: 0 }],
  meshes: [{ name: "tripo_node_7fe4119c", primitives: [{ attributes: { POSITION: 0 }, material: 0 }] }],
  materials: [{ name: "mat", pbrMetallicRoughness: { baseColorTexture: { index: 0 } } }],
  textures: [{ source: 0 }],
  images: [texture()],
  bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 4 }],
  accessors: [{ bufferView: 0, componentType: 5126, count: 1, type: "VEC3" }],
  buffers: [{ byteLength: 4 }],
  ...overrides
});
const BIN4 = Buffer.from([1, 2, 3, 4]);

/* ── 1. 合规伪 GLB → 放行（无告警） ── */
{
  const result = validateGlb(buildGlb(baseJson(), { bin: BIN4 }), { id: "fixture-ok" });
  ok(result.ok, `合规伪 GLB 放行（errors=${JSON.stringify(result.errors)}）`);
  eq(result.warnings, [], "合规伪 GLB 无告警（mesh 名族命中 tripo_node_*，无子节点层级）");
  eq(result.facts.meshes, ["tripo_node_7fe4119c"], "mesh 名取自节点名（审计锚点）");
  eq(result.facts.externalImages, 0, "贴图走 bufferView 嵌入（无外部 uri）");
}

/* ── 2. 外部贴图引用 → 拒绝（规格场景「外部贴图引用拒绝」） ── */
{
  const result = validateGlb(buildGlb(baseJson({ images: [texture({ bufferView: undefined, uri: "tripo_model_x.png" })] }), { bin: BIN4 }), { id: "fixture-ext-uri" });
  ok(!result.ok, "外部贴图 URI 被拒绝");
  ok(result.errors.some((e) => e.includes("外部 URI")), "违规清单点名「外部 URI」");
  eq(result.facts.externalImages, 1, "外部贴图计数 = 1");
}

/* ── 3. Draco / Meshopt / KTX2 → 拒绝（规格场景「压缩扩展拒绝」） ── */
for (const ext of REJECTED_EXTENSIONS.slice(0, 3)) {
  const result = validateGlb(buildGlb(baseJson({ extensionsUsed: [ext] }), { bin: BIN4 }), { id: "fixture-" + ext });
  ok(!result.ok, `${ext} 被拒绝（渲染层未配置解码器）`);
  ok(result.errors.some((e) => e.includes(ext)), `${ext} 出现在违规清单`);
}
{
  const result = validateGlb(buildGlb(baseJson({ extensionsUsed: ["KHR_materials_unlit"] }), { bin: BIN4 }), { id: "fixture-unlit" });
  ok(result.ok, "白名单内扩展（KHR_materials_unlit）不受限（规格明示）");
}

/* ── 4. 截断产物 → 拒绝（规格场景「截断产物拒绝」） ── */
{
  const full = buildGlb(baseJson(), { bin: BIN4 });
  const result = validateGlb(full.subarray(0, full.length - 6), { id: "fixture-truncated" });
  ok(!result.ok, "截断产物被拒绝（header 声明长度 ≠ 实际字节数）");
  ok(result.errors.some((e) => e.includes("声明长度")), "违规清单点名长度不自洽");
}
{
  /* JSON chunk 不可解析：长度自洽但内容不是 JSON */
  const json = Buffer.from("{not json!!}", "utf8");
  const padded = pad4(json, 0x20);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + padded.length, 8);
  const chunkHeader = Buffer.alloc(8);
  chunkHeader.writeUInt32LE(padded.length, 0);
  chunkHeader.writeUInt32LE(0x4e4f534a, 4);
  const result = validateGlb(Buffer.concat([header, chunkHeader, padded]), { id: "fixture-bad-json" });
  ok(!result.ok, "JSON chunk 不可解析被拒绝");
  ok(result.errors.some((e) => e.includes("JSON chunk 不可解析")), "违规清单点名 JSON chunk");
}
{
  const result = parseGlb(Buffer.from([1, 2, 3]));
  ok(result.json === null && result.errors.length > 0, "header 不完整（<12B）→ 拒绝且不抛异常");
}

/* ── 5. 转换参数漂移 → 警告（规格场景「转换参数漂移提示」；不阻断退出码） ── */
{
  const result = validateGlb(buildGlb(baseJson({ extensionsUsed: [] }), { bin: BIN4 }), { id: "fixture-drift", baseline: ["KHR_materials_unlit"] });
  ok(result.ok, "扩展集合与既有产物不一致为**警告级**（不阻断入库）");
  ok(result.warnings.some((w) => w.includes("与既有同名产物不一致")), "漂移警告点名「与既有同名产物不一致」");
  ok(result.warnings.some((w) => w.includes("KHR_materials_unlit")), "漂移警告列出两侧集合供人工复核");
  eq(result.facts.baselineExtensions, ["KHR_materials_unlit"], "漂移比对基准（既有产物扩展集合）如实记录");
  const same = validateGlb(buildGlb(baseJson({ extensionsUsed: ["KHR_materials_unlit"] }), { bin: BIN4 }), { id: "fixture-same", baseline: ["KHR_materials_unlit"] });
  eq(same.warnings, [], "扩展集合一致 → 无漂移告警");
}

/* ── 6. 审计锚点与结构硬约束 ── */
{
  const result = validateGlb(buildGlb(baseJson({ nodes: [{ mesh: 0 }] }), { bin: BIN4 }), { id: "fixture-noname" });
  ok(!result.ok, "mesh 节点名为空 → 拒绝（mesh 名是与源模型比对的审计锚点）");
}
{
  const result = validateGlb(buildGlb(baseJson({ nodes: [] }), { bin: BIN4 }), { id: "fixture-nomesh" });
  ok(!result.ok, "无 mesh 节点 → 拒绝（空模型）");
}
{
  const result = validateGlb(buildGlb(baseJson(), { bin: null }), { id: "fixture-nobin" });
  ok(!result.ok, "声明贴图但无 BIN chunk → 拒绝（贴图数据缺失）");
}
{
  /* 名族外节点名：仅告警（启发式 SHALL NOT 误杀合法产物） */
  const result = validateGlb(buildGlb(baseJson({ nodes: [{ name: "weird_node_name", mesh: 0 }] }), { bin: BIN4 }), { id: "fixture-alien" });
  ok(result.ok, "名族外节点名仅告警、不拒绝（SHALL NOT 因启发误杀合法产物）");
  ok(result.warnings.some((w) => w.includes("不在已知名族")), "名族告警在案");
}
{
  /* blue_worker 的 `node_0` 名单在允许名族内（不误杀手工产物） */
  const result = validateGlb(buildGlb(baseJson({ nodes: [{ name: "node_0", mesh: 0 }] }), { bin: BIN4 }), { id: "fixture-blue" });
  ok(result.ok, "`node_0` 名族放行（blue_worker 手工产物不误杀）");
}

/* ── 7. 仓库真实产物基线（贴图全嵌入、mesh 名族、扩展白名单） ── */
for (const item of PIPELINE) {
  const result = validateFile(join(MODELS_DIR, `${item.id}.glb`), { id: item.id });
  ok(result.ok, `既有产物 ${item.id}.glb 零误报（errors=${JSON.stringify(result.errors)}）`);
  eq(result.facts.externalImages, 0, `${item.id}.glb 贴图全嵌入（无外部 uri）`);
  ok(result.facts.meshes.length > 0 && result.facts.meshes.every(Boolean), `${item.id}.glb mesh 名非空`);
  ok(!result.warnings.some((w) => w.includes("不在已知名族")), `${item.id}.glb mesh 名族命中（不误报）`);
}
for (const item of MANUAL_ASSETS) {
  const result = validateFile(join(MODELS_DIR, `${item.id}.glb`), { id: item.id });
  ok(result.ok, `非 FBX 源产物 ${item.id}.glb 同样零误报（仅可校验，不入管线）`);
  eq(result.facts.meshes, ["node_0"], `${item.id} 的 mesh 名 = node_0（独立结构，手工流程产物）`);
}
/* 实测事实固化：worker = unlit，purple/pink = PBR（转换参数按模型显式的原因） */
{
  const worker = parseGlb(readFileSync(join(MODELS_DIR, "worker.glb"))).json;
  const purple = parseGlb(readFileSync(join(MODELS_DIR, "purple_worker.glb"))).json;
  eq(worker.extensionsUsed, ["KHR_materials_unlit"], "worker.glb 带 KHR_materials_unlit（unlit 档位，转换参数须按模型显式给）");
  eq(purple.extensionsUsed ?? [], [], "purple_worker.glb 无扩展（PBR）——两者参数不同即「SHALL NOT 一套默认参数打天下」的依据");
}
/* 管线清单与手工清单不重叠（覆盖范围如实：4 项里 3 项可重复 + 1 项手工） */
{
  const pipelineIds = PIPELINE.map((p) => p.id);
  const manualIds = MANUAL_ASSETS.map((m) => m.id);
  ok(pipelineIds.length === 3 && manualIds.length === 1, "管线覆盖 3 项 FBX 源 + 1 项非 FBX 源（blue_worker）手工流程");
  ok(pipelineIds.every((id) => !manualIds.includes(id)), "两清单不重叠");
  const rootFbx = readFileSync(join(ROOT, "package.json"), "utf8");
  ok(rootFbx.includes('"models:build"'), "package.json 暴露 models:build 入口");
}

console.log("ALL MODEL ASSETS SMOKE TESTS PASSED");
