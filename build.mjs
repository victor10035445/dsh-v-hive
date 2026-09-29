/**
 * dsh-v-hive 构建：
 *  - src/client.jsx --esbuild--> lib/client.js（懒 CJS 工厂：window.__ModuleLoader__.load
 *    包裹；react / react-dom / @deepseek-ai/* 全部 external，由 DSH client-modules
 *    的引导基线提供；three 不在基线内 → 打进包内，见 design.md D12）。
 *  - src/index.mjs 原样复制为 lib/index.js（宿主半区纯 ESM，零构建变换；
 *    依赖仅 node 内建与 zod）。
 *  - 同时产出 lib/client.js.map（外置 sourcemap）：宿主 client-modules 会探测该文件并
 *    组装**索引 sourcemap**（dsh-client-modules/lib/index.js 的 sourceMapSnapshot →
 *    comboScript 给 combo 脚本打 `sourceMappingURL`），于是浏览器里插件栈直接指向
 *    src/client.jsx 的原始行列——压缩包内定位崩溃点（TDZ / 未定义 / React 渲染错）
 *    不再需要人肉反查压缩变量名。map 与 bundle 同属产物并一并进 HMR 版本哈希
 *    （artifactRevision），改代码即换 rev，无「新包配旧 map」风险。
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import * as esbuild from "esbuild";

const PLUGIN_ID = "dsh-v-hive";

const banner = `window.__ModuleLoader__.load({ id: "${PLUGIN_ID}", factory: (require) => {
"use strict";
var module = { exports: {} };
var exports = module.exports;`;

const footer = `return module.exports;
} });`;

mkdirSync(new URL("./lib", import.meta.url), { recursive: true });

const result = await esbuild.build({
  entryPoints: ["src/client.jsx"],
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  outfile: "lib/client.js",
  banner: { js: banner },
  footer: { js: footer },
  external: ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/*"],
  minify: true,
  /* 外置 sourcemap（见文件头）：宿主探测到 lib/client.js.map 即组装索引 map 下发，
    浏览器栈可读回 src/client.jsx。 */
  sourcemap: "external",
  legalComments: "none",
  logLevel: "info",
  metafile: true
});

/* 补 `file` 键（esbuild 默认省略）：生成文件与 map 的对应关系显式化，便于工具链自证 */
const mapPath = new URL("./lib/client.js.map", import.meta.url);
const mapJson = JSON.parse(readFileSync(mapPath, "utf8"));
mapJson.file = "client.js";
writeFileSync(mapPath, JSON.stringify(mapJson));

const kb = (bytes) => (bytes / 1024).toFixed(1) + "KB";
console.log(`client bundle: ${kb(result.metafile.outputs["lib/client.js"].bytes)}（minified，含 three）`);

/* 宿主半区：纯 ESM 源码直出（node --check 可直接校验）。
   custom-bee-types 起宿主半区拆出纯逻辑模块（design D9）：入口复制为
   lib/index.js（package main 不变），纯逻辑模块保留 .mjs 扩展名复制
   （lib/index.js 的相对 import 说明符 ./<name>.mjs 与文件名一致）。
   add-hive-voice-desk 2.8：hive-voice.mjs 入列（语音纯逻辑层，审阅 R17）。
   add-hotbar-llm-model-and-import 3.1：plugin-imports.mjs 入列（导入源只读纯模块）。 */
copyFileSync(new URL("./src/index.mjs", import.meta.url), new URL("./lib/index.js", import.meta.url));
const HOST_MODULE_FILES = ["bee-types.mjs", "capabilities.mjs", "lane.mjs", "proposals.mjs", "hive-voice.mjs", "plugin-imports.mjs"];
for (const file of HOST_MODULE_FILES) {
  copyFileSync(new URL("./src/" + file, import.meta.url), new URL("./lib/" + file, import.meta.url));
}
console.log("host half: lib/index.js + " + HOST_MODULE_FILES.join(", ") + "（自 src/ 复制）");
