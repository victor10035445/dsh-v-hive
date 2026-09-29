/**
 * 模型/档位下拉共享纯逻辑冒烟测试（add-hotbar-llm-model-and-import 任务 4.5，
 * spec `hotbar-card-model`「模型目录共享数据源」/场景「模型选项不按档位展平」）：
 *  - modelKeyOf 两维（含 `/` 的 model id 不产生键歧义）；
 *  - buildModelOptions：首项空键 + 每模型一项（**不按档位展平**）+ 键去重先建者胜；
 *  - buildEffortOptions：首项「模型默认档位」不写 reasoningEffort，
 *    `defaultEffort` 下档位项不重键；
 *  - effortOptionsOf / modelMetaOf：反查（模型无 efforts → null = 整控件不渲染；
 *    绑定档位消失 → 落回首项）。
 * 运行：node test/model-select-smoke.mjs
 */
import { MODEL_KEY_NONE, buildEffortOptions, buildModelOptions, effortOptionsOf, modelKeyOf, modelMetaOf } from "../src/model-select.mjs";

const eq = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`FAIL: ${message}（期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}）`);
  }
};
const ok = (cond, message) => {
  if (!cond) throw new Error("FAIL: " + message);
};

/* 目录 fixture：含多档位模型、无 reasoning 模型、module id 自身含 `/`、重键组 */
const catalog = {
  default: { provider: "p-a", model: "glm-5.3-flash" },
  routableProviders: ["p-a"],
  groups: [
    {
      id: "p-a",
      name: "A 家",
      models: [
        { id: "glm-5.3-flash", name: "GLM 5.3 Flash", reasoning: { efforts: [{ id: "low", name: "低" }, { id: "medium", name: "中" }, { id: "high", name: "高" }], defaultEffort: "medium" } },
        { id: "plain-model", name: "Plain" },
        { id: "org/sub-model", name: "带斜杠" },
        /* 同 provider/model 重复条目：键去重先建者胜 */
        { id: "glm-5.3-flash", name: "重复项" }
      ]
    },
    {
      id: "p-b",
      name: "B 家",
      models: [{ id: "glm-5.3-flash", name: "同名不同家" }, { id: "other", name: "其它" }]
    }
  ]
};

/* ── modelKeyOf：两维 ── */
eq(modelKeyOf({ provider: "p-a", model: "m" }), "p-a/m", "键 = provider/model（两维）");
eq(modelKeyOf({ provider: "p-a", model: "m", reasoningEffort: "high" }), "p-a/m", "档位不进键（去掉三维的 effort 维）");
eq(modelKeyOf({ provider: "p", model: "org/sub" }), "p/org/sub", "含 `/` 的 model id 键照常拼接（查表反查，不解析）");
eq(modelKeyOf(null), MODEL_KEY_NONE, "空对象 → 空键");
eq(modelKeyOf({ provider: "", model: "m" }), MODEL_KEY_NONE, "缺 provider → 空键");
eq(MODEL_KEY_NONE, "", "空键 = 不绑定（首项锚点）");

/* ── buildModelOptions：首项空键 + 每模型一项 + 去重 ── */
const t = (key) => ({ "hive.swarm.modelNone": "使用默认模型" })[key] ?? key;
const models = buildModelOptions(catalog, t);
eq(models.items[0].key, "", "首项空键「使用默认模型」");
eq(models.items[0].entry, null, "首项 entry = null（不绑定，写 undefined）");
eq(models.items[0].label, "使用默认模型", "首项文案走 i18n 键");
eq(models.items.length, 6, "首项 + 5 个去重后模型（p-a 内重复 glm-5.3-flash 被去重）");
eq(models.items.map((it) => it.key), ["", "p-a/glm-5.3-flash", "p-a/plain-model", "p-a/org/sub-model", "p-b/glm-5.3-flash", "p-b/other"], "键序 = 目录序，先建者胜");
eq(models.items[1].label, "A 家 · GLM 5.3 Flash", "标签 = provider 名 · 模型名（先建者胜，非「重复项」）");
eq(models.items[1].entry, { provider: "p-a", model: "glm-5.3-flash" }, "entry = 落盘形状（不含档位）");
ok(models.items[1].reasoning?.efforts?.length === 3, "条目附带 reasoning 元数据（档位派生源）");
eq(models.items[2].reasoning, null, "无 reasoning 模型 → reasoning null");

/* 不按档位展平（spec 场景「模型选项不按档位展平」）：glm-5.3-flash 只出现一项 */
eq(models.items.filter((it) => it.key === "p-a/glm-5.3-flash").length, 1, "多档位模型在下拉中只出现一项（SHALL NOT 三行同名）");
ok(!models.items.some((it) => /低|中|高/.test(it.label)), "模型下拉标签不含档位名");

/* byKey：键 → entry 反查（onChange 用），空键映射 null */
eq(models.byKey.size, 6, "byKey 覆盖全部键");
eq(models.byKey.get(""), null, "空键 → null（清 model 字段）");
eq(models.byKey.get("p-a/org/sub-model"), { provider: "p-a", model: "org/sub-model" }, "含 `/` 的键反查回原对象（无字符串解析）");
eq(models.byKey.get("nope"), undefined, "未知键 → undefined");

/* 目录缺席/坏形状 → 仅首项（不可用态仍可渲染「使用默认模型」） */
eq(buildModelOptions(null, t).items.length, 1, "目录 null → 仅首项");
eq(buildModelOptions({ groups: "bad" }, t).items.length, 1, "groups 非数组 → 仅首项");
eq(buildModelOptions({ groups: [{ id: "", models: [{ id: "m" }] }, { id: "p", models: [{ id: "" }, null] }] }, t).items.length, 1, "空 provider/model 条目跳过");

/* ── buildEffortOptions：首项空键 + efforts ── */
const effortT = (key) => ({ "hive.hb.effortDefault": "模型默认档位" })[key] ?? key;
const meta = modelMetaOf(catalog, "p-a/glm-5.3-flash");
eq(meta.entry, { provider: "p-a", model: "glm-5.3-flash" }, "modelMetaOf 反查目录条目");
const efforts = buildEffortOptions({ ...meta.entry, reasoning: meta.reasoning }, effortT);
eq(efforts.items.map((it) => it.key), ["", "low", "medium", "high"], "首项空键 + 各档位一项（defaultEffort 不额外产项 → 不重键）");
eq(efforts.items[0].label, "模型默认档位", "首项文案 = 模型默认档位");
eq(efforts.items[0].entry, null, "首项不写 reasoningEffort（由宿主按 defaultEffort 执行）");
eq(efforts.items[2].entry, { provider: "p-a", model: "glm-5.3-flash", reasoningEffort: "medium" }, "档位项 entry = 完整存储形状");
eq(new Set(efforts.items.map((it) => it.key)).size, efforts.items.length, "无重键（含 defaultEffort = medium 的目录）");
eq(efforts.byKey.get(""), null, "空键 → null（清除绑定的档位）");

/* 无 efforts / 坏形状 */
eq(buildEffortOptions({ provider: "p", model: "m" }, effortT).items.length, 1, "无 reasoning → 仅首项");
eq(buildEffortOptions(null, effortT).items.length, 1, "null → 仅首项");
eq(buildEffortOptions({ provider: "p", model: "m", reasoning: { efforts: [{ id: "a" }, { id: "a" }, null, { name: "无名" }] } }, effortT).items.map((it) => it.key), ["", "a"], "重键/无名/坏条目跳过");

/* ── effortOptionsOf：整控件渲染判定 + 预选 ── */
eq(effortOptionsOf({ provider: "p-a", model: "plain-model" }, catalog, effortT), null, "所选模型无 efforts → null（整控件不渲染）");
eq(effortOptionsOf(null, catalog, effortT), null, "未绑定模型 → null");
eq(effortOptionsOf({ provider: "p-a", model: "nope" }, catalog, effortT), null, "不在目录中 → null");
const bound = effortOptionsOf({ provider: "p-a", model: "glm-5.3-flash", reasoningEffort: "high" }, catalog, effortT);
eq(bound.selectedEffortKey, "high", "预选 = 已绑定档位");
eq(effortOptionsOf({ provider: "p-a", model: "glm-5.3-flash" }, catalog, effortT).selectedEffortKey, "", "无绑定档位 → 落首项（模型默认档位）");
eq(effortOptionsOf({ provider: "p-a", model: "glm-5.3-flash", reasoningEffort: "gone" }, catalog, effortT).selectedEffortKey, "", "绑定档位已从目录消失 → 落回首项（不悬空）");
eq(effortOptionsOf({ provider: "p-a", model: "glm-5.3-flash" }, catalog, effortT).items.length, 4, "档位控件消费同一派生（单源）");

/* ── 值轨道纪律：受控 value 与 option value 同出 modelKeyOf ── */
const roundTrip = { provider: "p-a", model: "org/sub-model" };
ok(models.items.some((it) => it.key === modelKeyOf(roundTrip)), "回显值命中选项键（选择后不弹回默认）");
eq(models.byKey.get(modelKeyOf(roundTrip)), roundTrip, "键回查得到同形对象（两轨相等）");

console.log("ALL MODEL-SELECT SMOKE TESTS PASSED");
