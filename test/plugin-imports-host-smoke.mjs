/**
 * 跨插件配置导入端点冒烟测试（add-hotbar-llm-model-and-import 任务 3.3，
 * spec `plugin-config-import`「白名单读取与安全边界」路由层）：
 *  - 端点无条件注册、恒 200、SHALL NOT 404（不可用态 = 200 + available:false）；
 *  - 有 scope（settings 服务在册 + 命名空间已注册）→ 回吐形状化 buttons；
 *  - 无 scope（旧宿主无 settings 服务）→ settings-service-absent，其余路由照常工作；
 *  - inject 数组 SHALL NOT 含 "settings"（R1：硬依赖会让整插件不加载）；
 *  - 响应 SHALL NOT 含 describe() 输出或其它命名空间。
 * 运行：node test/plugin-imports-host-smoke.mjs
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { apply, inject } from "../src/index.mjs";
import { getPluginImportScope, setPluginImportScope } from "../src/plugin-imports.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* ── R1：settings SHALL NOT 进 inject 数组（硬依赖 = 无该服务的部署整插件不加载） ── */
ok(Array.isArray(inject) && !inject.includes("settings"), "inject 数组不含 settings（回调形态可选消费）");

process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-hive-imports-"));

let routeHandler = null;
const injectCalls = [];
/** 桩 ctx：记录 inject 调用但不立即执行回调（模拟「服务不在册」→ 插件照常加载）。 */
const makeCtx = ({ withInject = true, settingsService = undefined } = {}) => ({
  effect(fn) {
    fn();
  },
  on() {
    return () => {};
  },
  webServer: {
    register(decl) {
      routeHandler = decl.handler;
      return () => {};
    }
  },
  ...(withInject
    ? {
        inject(deps, callback) {
          injectCalls.push(deps);
          /* 服务不在册 → 不执行回调（cordis 语义）；在册 → 执行并交出 scope。 */
          if (settingsService !== undefined) callback({ settings: settingsService, effect: (fn) => fn() });
        }
      }
    : {}),
  agents: { get: () => undefined },
  sessionController: { modelCatalog: async () => ({ groups: [] }) },
  workspaceRegistry: { list: () => [], archivedSessionIds: [] }
});

const callRoute = async (method, url, body) => {
  const res = {
    status: 0,
    bodyText: "",
    writeHead(status) {
      this.status = status;
    },
    end(text) {
      this.bodyText = text ?? "";
    }
  };
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))];
  await routeHandler({ url, method, [Symbol.iterator]: chunks[Symbol.iterator].bind(chunks) }, res);
  return { status: res.status, body: res.bodyText ? JSON.parse(res.bodyText) : null };
};

/* ── 第一态：宿主无 settings 服务（旧宿主 / 服务 disabled） ── */
setPluginImportScope(null);
apply(makeCtx());
ok(typeof routeHandler === "function", "路由 handler 已捕获（端点无条件注册）");
eq(injectCalls, [["settings"]], "settings 经回调形态注入（可选消费，非 inject 数组）");
eq(getPluginImportScope(), null, "服务不在册 → 回调不执行 → scope 缺席");

const absent = await callRoute("GET", "/api/dsh-hive/imports/skill-links-buttons");
eq(absent.status, 200, "服务缺席 → 恒 200（SHALL NOT 404）");
eq(absent.body, { ok: true, available: false, reason: "settings-service-absent" }, "服务缺席 → available:false + 原因");
/* 其余路由照常工作（插件其余功能不受影响） */
const stateStillWorks = await callRoute("GET", "/api/dsh-hive/state");
eq(stateStillWorks.status, 200, "其余功能照常（GET /state 可用）");

/* ── 第二态：命名空间未注册（settings 服务在册，get → undefined） ── */
const unregisteredService = { get: () => undefined, describe: () => ({ leaked: "secret" }) };
apply(makeCtx({ settingsService: unregisteredService }));
eq(getPluginImportScope(), unregisteredService, "服务在册 → 回调执行并记录 scope");
const unreg = await callRoute("GET", "/api/dsh-hive/imports/skill-links-buttons");
eq(unreg.status, 200, "命名空间未注册 → 200");
eq(unreg.body, { ok: true, available: false, reason: "namespace-unregistered" }, "命名空间未注册 → available:false + 原因（SHALL NOT 空数组歧义）");

/* ── 第三态：可用（已注册命名空间 → 形状化 buttons） ── */
const skillLinksValue = {
  directories: ["/private/skills"],
  commands: [{ name: "c", prompt: "p" }],
  buttons: [
    { name: "设计", prompt: "做设计", autoSend: true, model: { provider: "deepseek-official", model: "glm-5.3-flash", reasoningEffort: "max" } },
    { name: "新建", prompt: "新建提案", autoSend: false }
  ]
};
const service = {
  get(namespace) {
    if (namespace === "v-skill-links") return skillLinksValue;
    return { leakedNamespace: namespace };
  },
  describe: () => ({ namespaces: ["v-skill-links", "dsh-voice"], secrets: "should-not-leak" })
};
apply(makeCtx({ settingsService: service }));
const avail = await callRoute("GET", "/api/dsh-hive/imports/skill-links-buttons");
eq(avail.status, 200, "可用态 → 200");
eq(avail.body.available, true, "可用态 available:true");
eq(avail.body.ok, true, "可用态 ok:true");
eq(avail.body.buttons.length, 2, "buttons 逐条回吐");
eq(avail.body.buttons[0], { name: "设计", prompt: "做设计", autoSend: true, model: { provider: "deepseek-official", model: "glm-5.3-flash", reasoningEffort: "max" } }, "model 1:1 形状化（含档位）");
eq(avail.body.buttons[1], { name: "新建", prompt: "新建提案", autoSend: false }, "无 model 条目不含该键");
const bodyText = JSON.stringify(avail.body);
ok(!bodyText.includes("private") && !bodyText.includes("directories"), "响应不含未注册消费的节（directories）");
ok(!bodyText.includes("dsh-voice") && !bodyText.includes("should-not-leak") && !bodyText.includes("namespaces"), "响应不含 describe() 输出或其它命名空间（D7）");
eq(Object.keys(avail.body).sort(), ["available", "buttons", "ok"], "响应键面固定（无元信息透传口）");

/* ── 未知路由仍 404（对照：不可用态不靠 404 表达） ── */
const bogus = await callRoute("GET", "/api/dsh-hive/imports/nope");
eq(bogus.status, 404, "未知路由仍 404（端点自身恒 200，对照明确）");
const wrongMethod = await callRoute("POST", "/api/dsh-hive/imports/skill-links-buttons", {});
ok(wrongMethod.status !== 200, "非 GET 不命中该分支（端点只读）");

/* ── ctx.inject 缺席（旧宿主/测试桩）：跳过注入，插件不炸 ── */
setPluginImportScope(null);
apply(makeCtx({ withInject: false }));
eq(getPluginImportScope(), null, "inject 缺席 → scope 保持缺席（不抛错）");
const noInject = await callRoute("GET", "/api/dsh-hive/imports/skill-links-buttons");
eq(noInject.status, 200, "inject 缺席仍恒 200");
eq(noInject.body.reason, "settings-service-absent", "inject 缺席 → 服务缺席态");
eq((await callRoute("GET", "/api/dsh-hive/state")).status, 200, "inject 缺席 ≠ 插件不加载（其余路由照常）");

/* ── 回调内 scope 获取失败：try/catch 兜住，仍照常加载 ── */
const throwingService = {
  get() {
    throw new Error("boom");
  }
};
apply(makeCtx({ settingsService: throwingService }));
const thrown = await callRoute("GET", "/api/dsh-hive/imports/skill-links-buttons");
eq(thrown.status, 200, "scope 读取异常 → 仍 200");
eq(thrown.body.reason, "namespace-unregistered", "读取异常收敛为源不可用（不裸异常）");

setPluginImportScope(null);
console.log("ALL PLUGIN-IMPORTS HOST SMOKE TESTS PASSED");
