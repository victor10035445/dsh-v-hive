/**
 * LLM 模型/推理档位下拉的共享派生纯逻辑（add-hotbar-llm-model-and-import D5/R3）。
 * 独立无依赖模块——client.jsx 消费（esbuild 打进 lib/client.js）、冒烟测试直测
 * （模式同 hotbars.mjs / proposals.mjs）。
 *
 * **只被 client.jsx 相对引用**：它不被宿主半区 lib/index.js 相对导入，故**不进**
 * build.mjs 的 HOST_MODULE_FILES、也不进 package.json 的 files 白名单。
 *
 * 三层 API（模型选择控件拆两个独立控件后的职责分层）：
 *  1. `modelKeyOf(entry)`——键 = `provider/model`（**两维**；三维键是「模型 × 档位」
 *     展平枚举的产物，与「模型下拉 + 推理档位下拉」两控件模型冲突）；
 *  2. `buildModelOptions(catalog, t)`——首项空键「使用默认模型」+ 每模型一项
 *     （键去重先建者胜 = fix-swarm-llm-model-select 的值轨道纪律），标签
 *     `provider · 模型`；条目附带 `reasoning` 供档位派生；
 *  3. `buildEffortOptions(catalogModel, t)`——首项空键「模型默认档位」（**不写**
 *     `reasoningEffort`；由宿主按目录 `reasoning.defaultEffort` 语义执行，故不会与
 *     同名 effort 项重键）+ 该模型 `reasoning.efforts`；无 efforts → 调用方
 *     （`effortOptionsOf`）判定整控件不渲染。
 *
 * 存储形状不动：卡片/工具/导入三处仍是 `{ provider, model, reasoningEffort? }`——
 * 变的只是「下拉键」（三维 → 两维）与新增的档位键。含 `/` 的 model id 仍走
 * 「键 ↔ 对象映射查表」反查，SHALL NOT 由字符串解析还原（modelKeyOf 只用于比较）。
 */

/** 空键 = 不绑定（跟随部署默认模型 / 模型默认档位）。 */
export const MODEL_KEY_NONE = "";

/** 下拉键：`provider/model`（两维）。受控 value 与各 <option> value 的唯一出处。 */
export function modelKeyOf(entry) {
  if (!entry || typeof entry !== "object") return MODEL_KEY_NONE;
  const provider = typeof entry.provider === "string" ? entry.provider : "";
  const model = typeof entry.model === "string" ? entry.model : "";
  if (!provider || !model) return MODEL_KEY_NONE;
  return provider + "/" + model;
}

const translateWith = (t) => (typeof t === "function" ? t : (key) => key);

/**
 * 模型下拉选项（目录 → options）。
 * @returns {{items: Array<{key: string, entry: object|null, label: string, reasoning: object|null}>, byKey: Map<string, object|null>}}
 *   `entry` = 落盘形状 `{ provider, model }`（不含档位）；`reasoning` = 该目录条目的
 *   `reasoning` 元数据（档位派生源）；`byKey` = 键 → entry 映射（onChange 反查，
 *   SHALL NOT 由字符串解析还原对象）。
 */
export function buildModelOptions(catalog, t) {
  const tr = translateWith(t);
  const noneItem = { key: MODEL_KEY_NONE, entry: null, label: String(tr("hive.swarm.modelNone") ?? ""), reasoning: null };
  const items = [noneItem];
  const byKey = new Map([[MODEL_KEY_NONE, null]]);
  for (const group of catalog?.groups ?? []) {
    const provider = typeof group?.id === "string" ? group.id : "";
    if (!provider) continue;
    for (const model of group?.models ?? []) {
      const modelId = typeof model?.id === "string" ? model.id : "";
      if (!modelId) continue;
      const entry = { provider, model: modelId };
      const key = modelKeyOf(entry);
      /* 键去重先建者胜（值轨道纪律：同一 provider/model 只出现一项，SHALL NOT 重键）。 */
      if (byKey.has(key)) continue;
      const providerLabel = String(group?.name ?? provider);
      const modelLabel = String(model?.name ?? modelId);
      const item = {
        key,
        entry,
        label: providerLabel + " · " + modelLabel,
        reasoning: model?.reasoning && typeof model.reasoning === "object" ? model.reasoning : null
      };
      byKey.set(key, entry);
      items.push(item);
    }
  }
  return { items, byKey };
}

/**
 * 推理档位下拉选项（所选目录模型 → options）。
 * @param {{reasoning?: {efforts?: Array<{id: string, name?: string}>, defaultEffort?: string}}|null} catalogModel
 *   所选模型在目录中的条目（`buildModelOptions` 条目的 `entry` + `reasoning`）。
 * @returns {{items: Array<{key: string, entry: object|null, label: string}>, byKey: Map<string, object|null>}}
 *   首项空键「模型默认档位」（entry = null → 不写 `reasoningEffort`）；其余每档一项
 *   （键 = effort id，entry = `{ provider, model, reasoningEffort }`）。`defaultEffort`
 *   只影响首项语义（由宿主执行），SHALL NOT 写成显式值——故不与同名 effort 项重键。
 */
export function buildEffortOptions(catalogModel, t) {
  const tr = translateWith(t);
  const items = [{ key: MODEL_KEY_NONE, entry: null, label: String(tr("hive.hb.effortDefault") ?? "") }];
  const byKey = new Map([[MODEL_KEY_NONE, null]]);
  const provider = typeof catalogModel?.provider === "string" ? catalogModel.provider : "";
  const modelId = typeof catalogModel?.model === "string" ? catalogModel.model : "";
  for (const effort of catalogModel?.reasoning?.efforts ?? []) {
    const id = typeof effort?.id === "string" ? effort.id : "";
    if (!id || byKey.has(id)) continue;
    const entry = { provider, model: modelId, reasoningEffort: id };
    byKey.set(id, entry);
    items.push({ key: id, entry, label: String(effort?.name ?? id) });
  }
  return { items, byKey };
}

/**
 * 按已绑定模型反查档位选项（值轨道纪律的读侧）：模型未绑定 / 目录条目缺席 /
 * 该模型未暴露 `reasoning.efforts` → `null`（调用方据此整控件不渲染）。
 * 绑定档位在目录中已消失时，`selectedEffortKey` 落回首项（模型默认档位）。
 * @returns {{items: Array, byKey: Map, selectedEffortKey: string}|null}
 */
export function effortOptionsOf(boundModel, catalog, t) {
  const key = modelKeyOf(boundModel);
  if (!key) return null;
  const meta = modelMetaOf(catalog, key);
  if (!meta || !(meta.reasoning?.efforts ?? []).length) return null;
  const options = buildEffortOptions({ provider: meta.entry.provider, model: meta.entry.model, reasoning: meta.reasoning }, t);
  const bound = typeof boundModel?.reasoningEffort === "string" ? boundModel.reasoningEffort : "";
  return { ...options, selectedEffortKey: options.byKey.has(bound) ? bound : MODEL_KEY_NONE };
}

/**
 * 键 → 目录模型元数据（含 `reasoning`）查表：键含 `/` 的 model id 也无需字符串解析。
 * @returns {{entry: {provider: string, model: string}, reasoning: object|null}|null}
 */
export function modelMetaOf(catalog, key) {
  if (!key) return null;
  for (const group of catalog?.groups ?? []) {
    const provider = typeof group?.id === "string" ? group.id : "";
    if (!provider) continue;
    for (const model of group?.models ?? []) {
      const modelId = typeof model?.id === "string" ? model.id : "";
      if (!modelId) continue;
      if (modelKeyOf({ provider, model: modelId }) !== key) continue;
      return {
        entry: { provider, model: modelId },
        reasoning: model?.reasoning && typeof model.reasoning === "object" ? model.reasoning : null
      };
    }
  }
  return null;
}
