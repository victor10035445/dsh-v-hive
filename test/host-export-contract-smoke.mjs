/**
 * 宿主导出契约冒烟测试（fix-primitives-icon-drift 2.1/2.2，design D2/D3）。
 *
 * 背景：插件 client bundle 把 react / @deepseek-ai/* 全部声明为 esbuild external，
 * 运行时由 DSH client-modules 的种子表注入。宿主基线的命名导出一旦改名/删除，
 * bundle 侧的解构结果会静默变成 undefined（CJS interop 在 require 阶段不报错），
 * 直到某个组件渲染它才抛 React #130——用户看到的是整页崩溃。本测试把这类漂移
 * 提前到构建/测试期。
 *
 * 两个方向（design D2）：
 *   ① 正向：CONTRACT 中每个名字 MUST 在目标 harness 前端主 bundle 文本中以词边界
 *      命中 ≥ 1。primitives / store 在 dsh 安装树里不是独立 npm 包（只以前端 bundle
 *      内种子表工厂的形态存在），文本存在性是「种子表导出键存在」在该宿主形态下
 *      唯一可行的机械代理。词边界防「更长标识符误命中」。
 *   ② 反向：扫描 src/**（.jsx/.mjs）的静态 import 声明，凡 specifier 命中契约键或
 *      @deepseek-ai/* 前缀者，其命名导入集 MUST ⊆ CONTRACT[specifier]——源码新增
 *      宿主导入却忘了登记契约时红灯（防契约表腐化）。
 *      react/jsx-runtime 由 esbuild `jsx: "automatic"` 注入，按契约表固定项对待、
 *      不参与源码扫描。
 *
 * 目标 harness 解析（design D3，找不到即硬失败，绝不静默跳过）：
 *   DSH_INSTALL_ROOT → `npm root -g`（Windows 经 shell 解析 npm.cmd）→ 常见全局根
 *   （Windows: %APPDATA%\npm\node_modules；POSIX: /usr/local/lib/node_modules 等），
 *   再在候选根下依次探测 dsh-web-frontend 的 dist/assets 布局，取其中体积最大的
 *   index-*.js（应用主 bundle，含种子表）。
 *
 * 运行：node test/host-export-contract-smoke.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_ROOT = path.join(REPO_ROOT, "src");

/* ── 契约表（design D2）：宿主模块 specifier → 期望命名导出。 ──
   覆盖全部四项种子词。改代码里的宿主导入时 MUST 同步登记这里（反向断言会点名
   未登记的符号），宿主基线改名时 MUST 换名并重建（正向断言会点名缺失的符号）。 */
const CONTRACT = {
  react: ["useEffect", "useLayoutEffect", "useRef", "useState", "useSyncExternalStore"],
  "react/jsx-runtime": ["Fragment", "jsx", "jsxs"],
  "@deepseek-ai/dsh-client-store": ["defineStore"],
  "@deepseek-ai/dsh-client-ui-primitives": ["IconSettingsOutlineMedium"]
};

/* esbuild jsx:"automatic" 的注入面：构建产物 require 它，源码里从不写 import */
const JSX_RUNTIME = "react/jsx-runtime";
/* 宿主模块前缀：源码出现未登记契约的 @deepseek-ai/* 导入时同样红灯 */
const HOST_PREFIX = "@deepseek-ai/";

const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── 1. 定位目标 harness 的前端主 bundle（design D3） ── */

/* 已安装 dsh 的几种类布局（相对候选根的路径段）：全局根 → dsh 包 → 其内嵌前端；
   也兼容 root 直接指向 dsh 包目录、前端包目录或 assets 目录的指法。 */
const ASSET_SUFFIXES = [
  ["@deepseek-ai", "dsh", "node_modules", "@deepseek-ai", "dsh-web-frontend", "dist", "assets"],
  ["node_modules", "@deepseek-ai", "dsh-web-frontend", "dist", "assets"],
  ["@deepseek-ai", "dsh-web-frontend", "dist", "assets"],
  ["dist", "assets"],
  []
];

function collectHarnessRoots() {
  const roots = [];
  const seen = new Set();
  const push = (source, root) => {
    if (!root) return;
    const resolved = path.resolve(root);
    if (seen.has(resolved)) return;
    seen.add(resolved);
    roots.push({ source, root: resolved });
  };

  /* ① 显式指路（非标准布局 / CI） */
  if (process.env.DSH_INSTALL_ROOT) push("DSH_INSTALL_ROOT", process.env.DSH_INSTALL_ROOT);

  /* ② npm 全局根。Windows 下 npm 是 npm.cmd：execFile 直调会被 Node 拒绝
        （.cmd 需 shell），故走 execSync 的 shell 解析；npm 缺失/超时则继续回退。 */
  try {
    const npmRoot = execSync("npm root -g", {
      encoding: "utf8",
      timeout: 20000,
      windowsHide: true,
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    push("npm root -g", npmRoot);
  } catch {
    /* npm 不可用：常见全局根仍可能命中 */
  }

  /* ③ 常见全局安装根 */
  if (process.platform === "win32") {
    if (process.env.APPDATA) push("%APPDATA%/npm", path.join(process.env.APPDATA, "npm", "node_modules"));
    if (process.env.ProgramFiles) push("%ProgramFiles%/nodejs", path.join(process.env.ProgramFiles, "nodejs", "node_modules"));
  } else {
    push("node prefix", path.join(path.dirname(process.execPath), "..", "lib", "node_modules"));
    push("/usr/local/lib", "/usr/local/lib/node_modules");
    push("/usr/lib", "/usr/lib/node_modules");
  }
  push("~/.npm-global", path.join(homedir(), ".npm-global", "lib", "node_modules"));
  push("~/.local", path.join(homedir(), ".local", "lib", "node_modules"));

  return roots;
}

function locateBaselineBundle() {
  const attempted = [];

  for (const { source, root } of collectHarnessRoots()) {
    for (const parts of ASSET_SUFFIXES) {
      const dir = path.join(root, ...parts);
      attempted.push(`${source}: ${dir}`);
      if (!existsSync(dir)) continue;

      const assets = readdirSync(dir)
        .filter((name) => /^index-.*\.js$/.test(name))
        .map((name) => {
          const full = path.join(dir, name);
          return { path: full, size: statSync(full).size };
        })
        .sort((a, b) => b.size - a.size);
      if (assets.length === 0) continue;

      /* 体积最大者即应用主 bundle（种子表所在）；淘汰旧构建残留的小 chunk。 */
      return { ...assets[0], source };
    }
  }

  throw new Error(
    [
      "FAIL: 无法定位目标 harness 的前端主 bundle（dsh-web-frontend/dist/assets/index-*.js）。",
      "本插件生来服务于已安装的 DSH harness，契约测试不能静默跳过（design D3）。",
      "",
      "已尝试的候选路径：",
      ...attempted.map((line) => "  - " + line),
      "",
      "排查指引：",
      "  1) 安装 DSH：npm i -g @deepseek-ai/dsh（本插件要求 DSH 0.2.1-rc.5+）；",
      "  2) 非标准布局：设置 DSH_INSTALL_ROOT 指向安装根（通常即 `npm root -g` 的输出，"
        + "其内含 @deepseek-ai/dsh 目录）；",
      "  3) 确认该安装里存在 @deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-web-frontend/dist/assets/index-*.js。"
    ].join("\n")
  );
}

/* ── 2. 正向：契约名在基线主 bundle 文本中以词边界命中 ≥ 1 ── */

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/* 词边界 = 前后都不是标识符字符。锚定的是最稳定的形态事实（名字存在性），
   避免 `IconSettingsOutlineMediumX` 这类更长标识符误命中。 */
const namePattern = (name) => new RegExp(`(?<![A-Za-z0-9_$])${escapeRegExp(name)}(?![A-Za-z0-9_$])`, "g");

const bundle = locateBaselineBundle();
const bundleText = readFileSync(bundle.path, "utf8");

const hitCounts = new Map();
const missing = [];
for (const [specifier, names] of Object.entries(CONTRACT)) {
  for (const name of names) {
    const hits = bundleText.match(namePattern(name))?.length ?? 0;
    hitCounts.set(`${specifier} · ${name}`, hits);
    if (hits === 0) missing.push(`${specifier} 的命名导出 ${name}`);
  }
}
if (missing.length > 0) {
  throw new Error(
    [
      "FAIL: 目标 harness 基线中缺失契约命名导出——宿主导出已漂移（改名/删除）。",
      `基线 bundle: ${bundle.path}（来源 ${bundle.source}，${(bundle.size / 1024).toFixed(1)}KB）`,
      "缺失符号：",
      ...missing.map((line) => "  - " + line),
      "",
      "修复：换用当前基线的名字并同步 CONTRACT，然后 pnpm build；",
      "若你本机 dsh 版本 < 0.2.1-rc.5，属文档声明的显式不支持组合（旧基线没有"
        + " IconSettingsOutlineMedium），请先升级 harness。"
    ].join("\n")
  );
}

/* ── 3. 反向：src/** 静态 import 的宿主导入集 ⊆ 契约表 ── */

function listSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listSourceFiles(full));
    else if (entry.isFile() && /\.(jsx|mjs)$/.test(entry.name)) files.push(full);
  }
  return files.sort();
}

/**
 * 读取一个文件里的静态 import 声明。
 * 形态假设（本仓库 client 侧为纯 ESM）：`import ... from "specifier"` 与副作用式
 * `import "specifier"`；`import(...)` / `import.meta` 不是静态声明，按 lookahead 排除；
 * 声明内允许跨行与注释。TS 语法不在本仓库范围内（若引入，需扩展此解析器）。
 */
const IMPORT_START = /^[ \t]*import(?![ \t]*[.(])[ \t]+(?=[{*'"A-Za-z_$])/gm;

function findStringEnd(source, quoteIndex) {
  const quote = source[quoteIndex];
  for (let i = quoteIndex + 1; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "\\") {
      i += 1;
      continue;
    }
    if (ch === quote) return i;
    if (ch === "\n") return -1; // 单/双引号字符串不跨行
  }
  return -1;
}

function readImportStatement(source, start) {
  let braces = 0;
  const limit = Math.min(source.length, start + 4096); // 病态输入的护栏
  for (let i = start; i < limit; i += 1) {
    const ch = source[i];
    if (ch === "/" && source[i + 1] === "/") {
      const newline = source.indexOf("\n", i + 2);
      if (newline === -1) return null;
      i = newline;
      continue;
    }
    if (ch === "/" && source[i + 1] === "*") {
      const close = source.indexOf("*/", i + 2);
      if (close === -1) return null;
      i = close + 1;
      continue;
    }
    if (ch === "{") braces += 1;
    else if (ch === "}") braces -= 1;
    else if ((ch === '"' || ch === "'") && braces <= 0) {
      const end = findStringEnd(source, i);
      if (end === -1) return null;
      return {
        clause: source.slice(start, i),
        specifier: source.slice(i + 1, end)
      };
    } else if (ch === ";" && braces <= 0) {
      return null; // malformed / 非静态形态
    }
  }
  return null;
}

function parseNamedImports(clause) {
  const open = clause.indexOf("{");
  const close = clause.lastIndexOf("}");
  if (open === -1 || close <= open) return [];
  /* 声明里不可能出现字符串字面量（specifier 在引号之后），注释可以安全剥掉 */
  const inner = clause
    .slice(open + 1, close)
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/[^\n]*/g, " ");
  return inner
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const named = part.match(/^(?:type[ \t]+)?([A-Za-z_$][\w$]*)(?:[ \t]+as[ \t]+[A-Za-z_$][\w$]*)?$/);
      return named ? named[1] : part; // 解析不了的形态原样保留，参与子集断言（宁可红灯）
    });
}

function collectStaticImports(source) {
  const imports = [];
  /* 剥 BOM：Windows 编辑器可能写入 UTF-8 BOM，否则首行 import 会被 ^ 锚点漏扫 */
  const text = source.replace(/^\uFEFF/, "");
  for (const match of text.matchAll(IMPORT_START)) {
    const statement = readImportStatement(text, match.index + match[0].length);
    if (!statement) continue;
    imports.push({ specifier: statement.specifier, named: parseNamedImports(statement.clause) });
  }
  return imports;
}

const sourceFiles = listSourceFiles(SRC_ROOT);
ok(sourceFiles.length > 0, "src/ 下未找到 .jsx/.mjs 源文件（扫描面为空等于防线失效）");

const hostImports = [];
const problems = [];
for (const file of sourceFiles) {
  const relative = path.relative(REPO_ROOT, file);
  for (const declaration of collectStaticImports(readFileSync(file, "utf8"))) {
    const { specifier, named } = declaration;
    const isContractKey = Object.prototype.hasOwnProperty.call(CONTRACT, specifier);
    if (!isContractKey && !specifier.startsWith(HOST_PREFIX)) continue;
    /* react/jsx-runtime 是构建注入面，按契约表固定项对待、不参与源码扫描 */
    if (specifier === JSX_RUNTIME) continue;

    hostImports.push({ file: relative, specifier, named });
    if (!isContractKey) {
      problems.push(`${relative}: 宿主模块 ${specifier} 未登记契约（请在 CONTRACT 中补齐期望导出）`);
      continue;
    }
    for (const name of named) {
      if (!CONTRACT[specifier].includes(name)) {
        problems.push(`${relative}: ${specifier} 的命名导入 ${name} 未登记契约`);
      }
    }
  }
}
if (problems.length > 0) {
  throw new Error(
    [
      "FAIL: 源码宿主导入面超出契约表（防止契约表腐化 / 未登记的宿主 API 面）。",
      ...problems.map((line) => "  - " + line),
      "",
      "修复：把该符号补进 test/host-export-contract-smoke.mjs 的 CONTRACT 表，"
        + "并确认它在目标 harness 基线中真实存在（正向断言会替你验证）。"
    ].join("\n")
  );
}

/* ── 4. 结果输出 ── */

console.log("HOST EXPORT CONTRACT: PASS");
console.log(`  baseline: ${bundle.path}`);
console.log(`  source  : ${bundle.source}（${(bundle.size / 1024).toFixed(1)}KB）`);
for (const [label, hits] of hitCounts) console.log(`  forward : ${label} ×${hits}`);
console.log(
  `  reverse : ${sourceFiles.length} 个源文件、${hostImports.length} 条宿主导入，命名导入 ⊆ 契约表`
);
