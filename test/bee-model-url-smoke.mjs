/**
 * 外观模型资产加载冒烟（bee-model-asset-url）：
 * 钉住「场景取模型的 URL 形状」与「预载触发面」——实盘踩过的坑：
 *
 *  - **URL 少一段子目录**（既有缺陷）：宿主资产路由是
 *    `/api/dsh-hive/assets/<白名单子目录>/<file>`（`src/index.mjs` 资产服务段：
 *    `parts.length !== 2` 即 400），而 `bees.mjs` 曾请求 `/api/dsh-hive/assets/<id>.glb`
 *    → 四个外观模型全部 400 → `variants.delete()` 静默回落图元蜂：**场景里的蜂恒为
 *    白色图元体，与所选外观无关**（用户看到「不是黑红蜂」的真因，HEAD 即存在）。
 *  - **预载触发面**：编辑浮窗打开经 `scene.ensureEditorVariants()` → `bees.ensureAllVariants()`
 *    对全部 `BEE_APPEARANCE_MODELS` 各发一次请求；已就绪/加载中 SHALL no-op（幂等）。
 *
 * 手法：给 `bees.mjs` 的 `loadModel` 注入浏览器环境（`document`）+ 捕获 fetch 的
 * GLTFLoader 桩；URL 由 GLTFLoader 内部 fetch 发出，故直接断言 fetch 收到的地址。
 *
 * 运行：node test/bee-model-url-smoke.mjs
 */
import * as THREE from "three";
import { BeeLayer } from "../src/hive/bees.mjs";
import { BEE_APPEARANCE_MODELS, DEFAULT_APPEARANCE_MODEL } from "../src/bee-types.mjs";

const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};
const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};

/* ── 浏览器环境桩 + fetch 捕获 ──
   three 的 FileLoader 走 fetch 分支时先 `new Request(url)`：浏览器按页面基址解析相对
   URL，Node 的 undici 直接抛 ERR_INVALID_URL。故此处补一个 `Request` 替身，按宿主基址
   （127.0.0.1:3080，与登录跳转页一致）解析——这样「插件打算请求哪个地址」可完整断言。 */
const HOST_BASE = "http://127.0.0.1:3080";
const RealRequest = globalThis.Request;
const requested = [];
class BrowserLikeRequest {
  constructor(input, init) {
    const url = typeof input === "string" ? new URL(input, HOST_BASE).href : String(input?.url ?? input);
    this.url = url;
    this.init = init;
    this._real = new RealRequest(url, init);
  }
  clone() { return new BrowserLikeRequest(this.url, this.init); }
}
globalThis.location = { href: HOST_BASE + "/" };
globalThis.Request = BrowserLikeRequest;
const fetchStub = (input, init) => {
  const raw = typeof input === "string" ? input : input?.url ?? init?.url;
  let path = String(raw);
  try { path = new URL(String(raw), HOST_BASE).pathname; } catch { /* 保持原样 */ }
  requested.push(path);
  /* 响应形状对齐浏览器（status/url/headers.get 齐备——three 读 response.url 拼 mimeType 判断） */
  return Promise.resolve({
    ok: false,
    status: 400,
    statusText: "Bad Request",
    url: new URL(path, HOST_BASE).href,
    headers: new Headers({ "content-type": "application/json" }),
    arrayBuffer: async () => new ArrayBuffer(0)
  });
};
globalThis.window = { fetch: fetchStub, addEventListener() {}, removeEventListener() {} };
globalThis.document = { createElementNS: () => ({ style: {} }), createElement: () => ({ style: {} }) };
globalThis.self = globalThis;
globalThis.URL.createObjectURL = () => "blob:stub";
globalThis.URL.revokeObjectURL = () => {};
globalThis.fetch = fetchStub;

const layer = new BeeLayer(new THREE.Scene(), { reduced: true });
const defaultUrl = `/api/dsh-hive/assets/models/${DEFAULT_APPEARANCE_MODEL}.glb`;
eq(requested, [defaultUrl], `构造即载默认外观，且 URL = ${defaultUrl}（含 models/ 段）`);
ok(defaultUrl.startsWith("/api/dsh-hive/assets/models/"), "URL SHALL 含白名单子目录 `models/`（少一段 → 宿主 400）");
/* 旧缺陷锚点：漏写 models/ 段的 URL 必须被宿主拒（本用例改动前会在此红） */
ok(!requested.some((u) => /^\/api\/dsh-hive\/assets\/[A-Za-z0-9._-]+\.glb$/.test(u)), "SHALL NOT 出现漏写子目录的旧式 URL");

/* 宿主路由白名单口径复刻：子目录 + 文件名各为单段 [A-Za-z0-9._-] */
const SAFE = /^[A-Za-z0-9._-]+$/;
const hostAccepts = (route) => {
  const parts = route.slice("/api/dsh-hive/assets/".length).split("/");
  return parts.length === 2 && ["models", "voice"].includes(parts[0]) && SAFE.test(parts[1]) && !parts[1].includes("..");
};
ok(hostAccepts(defaultUrl), "默认外观 URL 通过宿主路由校验（parts=2 + 白名单子目录 + 安全文件名）");
ok(!hostAccepts("/api/dsh-hive/assets/purple_worker.glb"), "对照：漏写 models/ 的旧 URL 被宿主拒绝（回归锚点）");

/* ── 预载：全部外观模型各一次，幂等可重入 ── */
requested.length = 0;
layer.ensureAllVariants();
const expectedAll = BEE_APPEARANCE_MODELS.filter((id) => id !== DEFAULT_APPEARANCE_MODEL).map((id) => `/api/dsh-hive/assets/models/${id}.glb`);
eq(requested, expectedAll, "ensureAllVariants() 对非默认外观各发一次请求（默认项构造已载 → no-op）");
ok(requested.every(hostAccepts), "预载发出的每个 URL 都通过宿主路由校验（四个外观无一 400）");

requested.length = 0;
layer.ensureAllVariants();
eq(requested, [], "重复预载 SHALL no-op（加载中/已就绪项不重发——幂等，HTTP 缓存兜底）");

/* ── 变体簿记：四个外观全部登记（loading 占位；默认项为构造期加载） ── */
ok(BEE_APPEARANCE_MODELS.length === 4, "外观模型清单为四项（回归锚点：新外观须同步本用例）");
for (const id of BEE_APPEARANCE_MODELS) {
  ok(layer.variants.has(id), `${id} 已登记变体（loading 占位）`);
}
ok(layer.variants.size === BEE_APPEARANCE_MODELS.length, "变体表 = 外观模型清单（无多余/遗漏）");

console.log("ALL BEE MODEL URL SMOKE TESTS PASSED");
