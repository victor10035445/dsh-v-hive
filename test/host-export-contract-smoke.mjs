/**
 * 宿主契约冒烟测试（fix-primitives-icon-drift 2.1/2.2 + fix-rc5-session-navigation-migration 4.x）。
 *
 * 闸门覆盖面 = **种子模块命名导出** + **宿主服务动词面与快照形状**。两者共用本入口与
 * 同一个安装根解析（`collectHarnessRoots`，找不到即硬失败，绝不静默跳过）。
 *
 * 背景（为什么有两道闸门）：插件 client bundle 把 react / @deepseek-ai/* 全部声明为
 * esbuild external，运行时由 DSH client-modules 的种子表注入。
 *  - 命名导出漂移（第一道闸门要防的）：宿主基线的导出改名/删除后，bundle 侧解构结果
 *    静默变成 undefined（CJS interop 在 require 阶段不报错），直到某组件渲染它才抛
 *    React #130——用户看到整页崩溃（rc.5 的 `IconSettingsOutline16` 事故）。
 *  - 服务动词面/快照形状漂移（第二道闸门要防的）：宿主**不导出**也不报错——插件在事件
 *    链里调用已删除的动词（`ctx.sessions.open`）会抛 TypeError 并被监听器吞掉，读已移除
 *    的快照字段（`SessionListState.current`）恒为 undefined，门控恒空——用户看到的是
 *    「框选切蜂静默失效」（rc.5 会话导航断裂事故）。类型声明是安装树里的独立包实体文件，
 *    词边界/成员级文本断言即其形状的机械代理，无需引入 TypeScript 编译器。
 *
 * 闸门 A：种子模块命名导出（词边界文本断言）
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
 * 闸门 B：宿主服务动词面与快照形状（fix-rc5-session-navigation-migration D3）
 *   ③ 反向：src/** 文本扫描**锚定正则组禁词表**（`BANNED_CALL_PATTERNS` +
 *      `BANNED_FIELD_PATTERNS`，命中即点名文件行号）——已删除动词调用与已移除字段直读。
 *      局部别名形态（快照先存变量再读 `.current`，React ref 的 `.current` 合法面过大
 *      不可全局禁）不属机械可达面：现存唯一一处由本次迁移消除，后续靠评审纪律。
 *   ④ 正向：安装根下三个 d.ts 的成员级断言——`UiWorkspace` 含 `openSession`；`ISessions`
 *      含 `list` 且不含 `open`/`openSubagent`；`SessionListState` 含 `ids`/`byId`/`phase`
 *      且不含 `current`。「不含」断言 MUST 先剥注释、再在接口体做成员级匹配（声明注释
 *      含独立词 `open`，整文件文本断言会假红）。
 *   禁词表与成员匹配的效力由 `selfCheckGate()` 的正反夹具锁定（防「正则写错 → 永远
 *   绿灯」的假防线）；迁移前的先红后绿自检记录见
 *   openspec/changes/fix-rc5-session-navigation-migration/spike.md。
 *
 * 目标 harness 解析（找不到即硬失败，绝不静默跳过）：
 *   DSH_INSTALL_ROOT → `npm root -g`（Windows 经 shell 解析 npm.cmd）→ 常见全局根
 *   （Windows: %APPDATA%\npm\node_modules；POSIX: /usr/local/lib/node_modules 等），
 *   再在候选根下依次探测 dsh-web-frontend 的 dist/assets 布局，取其中体积最大的
 *   index-*.js（应用主 bundle，含种子表）；闸门 B 的 d.ts 走同一批候选根 ×
 *   PACKAGE_PREFIXES 布局。
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

/* ── 4. 闸门 B：宿主服务动词面与快照形状（fix-rc5-session-navigation-migration D3） ── */

/* 4.1 反向禁词表（显式常量；锚定正则组）。锚定的是「调用/直读形态」而非裸词：
   `open` / `current` 作为普通词在注释、React ref、类型参数里合法面过大。 */
const BANNED_CALL_PATTERNS = [
  {
    id: "sessions.open",
    pattern: /sessions\s*(?:\?\.|\.)\s*open\s*\(/g,
    note: "已删除动词（rc.5 起导航归 uiWorkspace.openSession，SessionTarget 覆盖会话与子代理地址）"
  },
  {
    id: "sessions.openSubagent",
    pattern: /sessions\s*(?:\?\.|\.)\s*openSubagent\s*\(/g,
    note: "已删除动词（并入 uiWorkspace.openSession 的 SessionTarget 联合类型）"
  }
];

const BANNED_FIELD_PATTERNS = [
  {
    id: "list.getSnapshot().current",
    /* 容错正则：可选调用 `?.()` 与普通调用 `()` × 普通属性 `.` 与可选属性 `?.` 的组合，
       覆盖现存三变体（`getSnapshot?.()?.current` / `getSnapshot()?.current` /
       `getSnapshot().current`）。 */
    pattern: /getSnapshot\s*(?:\?\.)?\s*\(\s*\)\s*(?:\?\.|\.)\s*current(?![A-Za-z0-9_$])/g,
    note: "SessionListState.current 已移除（rc.5 快照 = {ids, byId, phase, projectionsBySession}）"
  },
  {
    id: "byId[sessions.current]",
    pattern: /byId\s*\[\s*sessions\s*(?:\?\.|\.)\s*current\s*\]/g,
    note: "同上：current 字段已移除，消费方改经单点出口 currentSessionIdOf 取当前会话"
  }
];

const BANNED_PATTERNS = [...BANNED_CALL_PATTERNS, ...BANNED_FIELD_PATTERNS];

/* 4.2 正向声明面（rc.5 契约）：包目录 + d.ts 相对路径 + 成员级断言清单。 */
const SERVICE_CONTRACT_DECLARATIONS = [
  {
    package: "@deepseek-ai/dsh-client-ui-workspace",
    file: "lib/types/client/navigation.d.ts",
    type: "UiWorkspace",
    present: ["openSession"],
    absent: []
  },
  {
    package: "@deepseek-ai/dsh-api-session-controller",
    file: "lib/types/client/contract/sessions.d.ts",
    type: "ISessions",
    present: ["list"],
    absent: ["open", "openSubagent"]
  },
  {
    package: "@deepseek-ai/dsh-api-session-controller",
    file: "lib/types/client/sessions/service.d.ts",
    type: "SessionListState",
    present: ["ids", "byId", "phase"],
    absent: ["current"]
  }
];

/* 包的相对布局（相对候选安装根；沿 ASSET_SUFFIXES 的思路）。候选根可能是
   `npm root -g` 的输出（→ 根下就是 `@deepseek-ai/<pkg>`）、profile 目录（→ 根下
   `node_modules/@deepseek-ai/<pkg>`）、dsh 包目录（→ 根下 `node_modules/@deepseek-ai/<pkg>`）
   或 `@deepseek-ai` 目录本身（→ 根下直接 `<pkg>`，这时包名要去 scope）。
   两种包名形态 × 三种前缀即覆盖全部指法。 */
const PACKAGE_PREFIXES = [
  ["@deepseek-ai", "dsh", "node_modules"], // 全局根 → dsh 包内嵌 node_modules
  ["node_modules"], // profile 目录 / dsh 包目录 → 其 node_modules
  [] // npm root -g 的输出，或 @deepseek-ai 目录本身
];

/** 包名两种形态：带 scope（`@deepseek-ai/x`）与去 scope（`x`）。 */
function packageNameVariants(name) {
  const [scope, bare] = name.startsWith("@") ? name.split("/") : [null, name];
  return scope ? [name, bare] : [name];
}

/** 剥注释，保留长度与换行（偏移/行号仍可回指原文）。 */
function blankComments(text) {
  const out = text.split("");
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") {
        out[i] = " ";
        i += 1;
      }
    } else if (text[i] === "/" && text[i + 1] === "*") {
      const close = text.indexOf("*/", i + 2);
      const end = close === -1 ? text.length : close + 2;
      for (; i < end && i < text.length; i += 1) {
        if (text[i] !== "\n") out[i] = " ";
      }
      i -= 1; // for 的 i += 1 抵消
    }
  }
  return out.join("");
}

/** 取 `interface <name> {…}` 的接口体（注释先剥空，健壮于注释内的花括号）。 */
function interfaceBody(text, name) {
  const source = blankComments(text);
  const open = new RegExp(`interface\\s+${escapeRegExp(name)}\\b[^{]*\\{`).exec(source);
  if (!open) return null;
  const start = open.index + open[0].length;
  let depth = 1;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i);
    }
  }
  return null;
}

/** 成员级匹配：名字 + 可选 `?` + `:` 或 `(` —— 排除「出现在别的成员类型/注释里的裸词」。 */
function memberPattern(name) {
  return new RegExp(`(?<![A-Za-z0-9_$])${escapeRegExp(name)}(?![A-Za-z0-9_$])\\s*(?:\\?\\s*)?(?::|\\()`, "g");
}

function lineOfIndex(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) if (text[i] === "\n") line += 1;
  return line;
}

/** 全文扫描禁词（`\s*` 可跨行，故按全文匹配；行号由命中偏移回算）。 */
function scanBanned(sources, patterns) {
  const hits = [];
  for (const file of sources) {
    const text = readFileSync(file, "utf8");
    const relative = path.relative(REPO_ROOT, file);
    for (const entry of patterns) {
      entry.pattern.lastIndex = 0;
      for (const match of text.matchAll(entry.pattern)) {
        const index = match.index ?? 0;
        const line = lineOfIndex(text, index);
        const lineStart = text.lastIndexOf("\n", index - 1) + 1;
        const lineEnd = text.indexOf("\n", index);
        hits.push({
          file: relative,
          line,
          id: entry.id,
          note: entry.note,
          text: text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd).trim()
        });
      }
    }
  }
  return hits.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
}

/* 4.3 闸门自检（正反夹具）：锁死「禁词表/成员匹配写错 → 永远绿灯」这条假防线。
   反例夹具取自 rc.5 迁移前的真实形态（见 spike.md 先红自检记录）。 */
const GATE_BANNED_FIXTURES = [
  "const current = ctx.sessions?.list?.getSnapshot?.()?.current ?? null;",
  "scene.setSelected(ctx.sessions?.list.getSnapshot()?.current);",
  "const current = ctx.sessions.list.getSnapshot().current;",
  "sessionsBriefStore.set(sessionsBriefOf(sessions.byId[sessions.current]));",
  "ctx.sessions.open(sessionId);",
  "ctx.sessions?.open(sessionId);",
  "if (address) ctx.sessions.openSubagent(address);"
];
const GATE_BENIGN_FIXTURES = [
  "controllerRef.current?.actions.selectBee?.(sessionId);", // React ref 的 .current 合法面
  "const current = currentSessionIdOf(ctx);", // 单点出口读取（迁移后形态）
  "ctx.uiWorkspace.openSession(sessionId);",
  "const snapshot = ctx.sessions?.list?.getSnapshot?.();",
  "sessionsBriefStore.set(sessionsBriefOf(byId[current]));"
];
const GATE_MEMBER_FIXTURE = [
  "/** Host catalog and local reference-source counts; navigation belongs to view owners.",
  " *  A failed initial open attempt retries when current is touched. Session.open() */",
  "export interface ISessions {",
  "    readonly list: ObservableSnapshot<SessionListState>;",
  "    retain(target: SessionTarget, options: SessionRetainOptions): SessionReference;",
  "}"
].join("\n");

function selfCheckGate() {
  for (const fixture of GATE_BANNED_FIXTURES) {
    const hit = BANNED_PATTERNS.some((entry) => {
      entry.pattern.lastIndex = 0;
      return entry.pattern.test(fixture);
    });
    ok(hit, `禁词表自检：真实违规形态未被任何禁词命中（漏报）→ ${fixture}`);
  }
  for (const fixture of GATE_BENIGN_FIXTURES) {
    for (const entry of BANNED_PATTERNS) {
      entry.pattern.lastIndex = 0;
      ok(!entry.pattern.test(fixture), `禁词表自检：良性行被误判（${entry.id} 误报）→ ${fixture}`);
    }
  }
  const body = interfaceBody(GATE_MEMBER_FIXTURE, "ISessions");
  ok(body !== null, "成员断言自检：夹具接口体未解析出来（interfaceBody 失效）");
  ok(memberPattern("list").test(body), "成员断言自检：应命中成员 list 未命中（假红风险已消除？）");
  for (const name of ["open", "openSubagent"]) {
    ok(
      !memberPattern(name).test(body),
      `成员断言自检：注释里的独立词 ${name} 被判为成员声明（未剥注释 → 整文件断言会假红）`
    );
  }
}

/** 在候选安装根下定位一个声明文件（返回 null 表示未找到；尝试清单交调用方汇总）。 */
function locateDeclaration(declaration, attempted) {
  const seen = new Set();
  for (const { source, root } of collectHarnessRoots()) {
    for (const parts of PACKAGE_PREFIXES) {
      for (const name of packageNameVariants(declaration.package)) {
        const file = path.join(root, ...parts, ...name.split("/"), ...declaration.file.split("/"));
        if (seen.has(file)) continue;
        seen.add(file);
        attempted.push(`${source}: ${file}`);
        if (existsSync(file)) return { file, source };
      }
    }
  }
  return null;
}

selfCheckGate();

const bannedHits = scanBanned(sourceFiles, BANNED_PATTERNS);
if (bannedHits.length > 0) {
  throw new Error(
    [
      "FAIL: 源码仍引用 rc.5 已删除的会话导航动词或已移除的快照字段（服务动词面漂移未迁移）。",
      ...bannedHits.map(
        (hit) => `  - ${hit.file}:${hit.line} [${hit.id}] ${hit.note}\n      ${hit.text}`
      ),
      "",
      "修复：会话切换改走 `ctx.uiWorkspace.openSession(target)`；当前会话读取改走",
      "`currentSessionIdOf(ctx)` 单点出口（主源 uiSession.adapter.current，降级本地镜像）。"
    ].join("\n")
  );
}

const declarationAttempts = [];
const declarationProblems = [];
const declarationMissing = [];
for (const declaration of SERVICE_CONTRACT_DECLARATIONS) {
  const found = locateDeclaration(declaration, declarationAttempts);
  if (!found) {
    declarationMissing.push(`${declaration.package}/${declaration.file}（interface ${declaration.type}）`);
    continue;
  }
  const body = interfaceBody(readFileSync(found.file, "utf8"), declaration.type);
  if (body === null) {
    declarationProblems.push(
      `${declaration.package}/${declaration.file}: 找不到 interface ${declaration.type}（声明面已重构？）`
    );
    continue;
  }
  for (const member of declaration.present) {
    if (!memberPattern(member).test(body)) {
      declarationProblems.push(
        `${declaration.package}/${declaration.file} 的 ${declaration.type}: 缺失成员 ${member}（宿主服务面漂移） — ${found.file}`
      );
    }
  }
  for (const member of declaration.absent) {
    if (memberPattern(member).test(body)) {
      declarationProblems.push(
        `${declaration.package}/${declaration.file} 的 ${declaration.type}: 出现应已移除的成员 ${member}（宿主快照形状回退 / rc.5 以下基线） — ${found.file}`
      );
    }
  }
}

if (declarationMissing.length > 0) {
  throw new Error(
    [
      "FAIL: 无法在安装根下定位服务契约的类型声明文件（安装树不完整 / 版本过低）。",
      "声明文件缺失即硬失败——MUST NOT 静默跳过该断言（跳过等于服务动词面防线失效）。",
      "缺失：",
      ...declarationMissing.map((line) => "  - " + line),
      "",
      "已尝试的候选路径：",
      ...declarationAttempts.map((line) => "  - " + line),
      "",
      "排查指引：",
      "  1) 本插件要求 DSH 0.2.1-rc.5+（该版起导航归 UiWorkspace.openSession、SessionListState 无 current）；",
      "  2) 非标准布局：设置 DSH_INSTALL_ROOT 指向安装根（通常即 `npm root -g` 的输出）；",
      "  3) 确认安装里存在 @deepseek-ai/dsh-client-ui-workspace 与 @deepseek-ai/dsh-api-session-controller 的 lib/types/。"
    ].join("\n")
  );
}

if (declarationProblems.length > 0) {
  throw new Error(
    [
      "FAIL: 宿主服务动词面 / 快照形状与插件的 rc.5 契约不符（服务动词面漂移）。",
      ...declarationProblems.map((line) => "  - " + line),
      "",
      "修复：换用当前基线的服务面（并同步 src 的调用点 / 读源），或升级 harness 到文档声明的最低版本。"
    ].join("\n")
  );
}

/* ── 5. 结果输出 ── */

console.log("HOST EXPORT CONTRACT: PASS");
console.log(`  baseline: ${bundle.path}`);
console.log(`  source  : ${bundle.source}（${(bundle.size / 1024).toFixed(1)}KB）`);
for (const [label, hits] of hitCounts) console.log(`  forward : ${label} ×${hits}`);
console.log(
  `  reverse : ${sourceFiles.length} 个源文件、${hostImports.length} 条宿主导入，命名导入 ⊆ 契约表`
);
console.log(
  `  verbs   : ${sourceFiles.length} 个源文件禁词 0 命中（${BANNED_PATTERNS.length} 条锚定正则）；`
    + `${SERVICE_CONTRACT_DECLARATIONS.length} 个 d.ts 成员级断言通过`
);
