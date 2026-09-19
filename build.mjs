/**
 * dsh-v-hive 构建：
 *  - src/client.jsx --esbuild--> lib/client.js（懒 CJS 工厂：window.__ModuleLoader__.load
 *    包裹；react / react-dom / @deepseek-ai/* 全部 external，由 DSH client-modules
 *    的引导基线提供；three 不在基线内 → 打进包内，见 design.md D12）。
 *  - src/index.mjs 原样复制为 lib/index.js（宿主半区纯 ESM，零构建变换；
 *    依赖仅 node 内建与 zod）。
 */
import { copyFileSync, mkdirSync } from "node:fs";
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
  legalComments: "none",
  logLevel: "info",
  metafile: true
});

const kb = (bytes) => (bytes / 1024).toFixed(1) + "KB";
console.log(`client bundle: ${kb(result.metafile.outputs["lib/client.js"].bytes)}（minified，含 three）`);

/* 宿主半区：纯 ESM 源码直出（node --check 可直接校验）。
   custom-bee-types 起宿主半区拆出纯逻辑模块（design D9）：入口复制为
   lib/index.js（package main 不变），纯逻辑模块保留 .mjs 扩展名复制
   （lib/index.js 的相对 import 说明符 ./<name>.mjs 与文件名一致）。 */
copyFileSync(new URL("./src/index.mjs", import.meta.url), new URL("./lib/index.js", import.meta.url));
const HOST_MODULE_FILES = ["bee-types.mjs", "capabilities.mjs", "lane.mjs", "status-cards.mjs"];
for (const file of HOST_MODULE_FILES) {
  copyFileSync(new URL("./src/" + file, import.meta.url), new URL("./lib/" + file, import.meta.url));
}
console.log("host half: lib/index.js + " + HOST_MODULE_FILES.join(", ") + "（自 src/ 复制）");
