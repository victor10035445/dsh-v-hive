# dsh-v-hive（V 蜂巢）

DeepSeek Harness Web 插件：用 three.js 在 DSH Web 页面上构建一个 3D「无限蜂巢」，
把工作区可视化为六边形蜂巢工作室、会话可视化为工蜂，实现会话的空间化管理与操作。

- 工作区（目录）= 六边形无顶工作室，整巢可拖拽搬移（hexDist 防叠加，强制一格呼吸缝）；
- 会话 = 工蜂：`blank` 会话不出蜂（首次请求后出蜂）；五态着色——待命灰白 / 忙碌蓝 /
  求助琥珀（等待人） / 带蜜归绿 / 归档化蜜；hover/选中的蜜蜂投影 HTML 对话卡片；
- 点击蜜蜂 → 切换当前会话（`ctx.sessions.open`，零侵入官方 UI）；
- **会话浮窗**（hive-quick-commands）：官方会话页以固定居中浮窗呈现在蜂巢页之上——
  纯 CSS 整形 + 遮罩孔洞实现（官方渲染层序零干预、零卸载重挂），✕ / 点遮罩 / Esc 收起，
  草稿跨收起保留，插件扩展（输入框下方 dock 条目等）原样复用；蜂卡「打开会话」同路接浮窗；
- **情境道具栏**（context-hotbar-rework）：页面底部固定 m×n 卡片阵列，按场景选中三态互斥
  切换——巢选中 = **巢栏**（召唤卡：召唤新蜂 + 蜂种 + 预设提示词 + 自动发送；召唤关闭 =
  卡禁用态）、地板选中 = **地板栏**（建巢卡：经官方目录选择器 `pickDirectory` →
  `workspaces.create` 建巢，按槽位可选建蜂走召唤）、选中工蜂 = **蜂栏**（双通道：未勾自动
  发送 = Prompt 追加进输入框并唤起会话浮窗审查；勾选 = 经宿主 `POST /api/dsh-hive/send`
  followup 直发）。紧凑呈现：按槽位数渲染功能卡（不渲染空位占位卡）；槽位多于容量时超出
  部分不渲染（配置保留）。**内置动作卡**（hotbar-default-actions，卡组与分型经用户定稿）：
  **蜂栏常驻**——「继续」（followup 直发）+「归档会话」（归档当前会话蜂：化蜜入库不可恢复，
  与蜂卡/右键菜单同动词）+「打开会话」（收起蜂巢页直达当前会话标准视图）恒追加在用户槽位
  之后，不随自定义收回（容量不足尾随先切、用户卡优先）；**地板栏回退**——无用户槽位时呈现
  「建巢」（纯建巢），有用户槽位即收回；巢栏不设默认卡（召唤由用户自定义槽位覆盖，空巢栏
  不渲染）；卡名称与内置提示词跟随界面语言即时切换（zh/en），不持久化、不进指令编辑器；
  内置卡与用户卡同等适用三态门控、浮窗暂停、在途禁用与容量截断，提示词卡复用同一条动作链路，
  卡面带「内置」角标（悬停角标提示：蜂栏 = 常驻说明、地板栏 = 收回提示）；动作卡（归档/打开）
  另带蜜金描边（与场景归档蜜金同源），与「蓝框 = ⚡直发」语义区分；
- **工蜂阵列面板**（context-hotbar-rework）：选中巢时 canvas 右缘覆盖呈现该巢工蜂卡片阵列
  （状态色点 + 标题 + todo 进度 + 🐝无人机角标 + 蜂种徽章），按蜂位格序排列，超容量纵向
  滚动（全量可见）；点卡 = 清巢选中 + 切当前会话（与 3D 点蜂同语义）；
- **指令编辑**（context-hotbar-rework）：页头 ⌘ 入口（与蜂群编辑并排）打开左纵排三节模态
  （巢栏/蜂栏/地板栏）：槽位 CRUD + 上移下移排序 + 字段联动校验 + 暂存-保存模型（409 重放）；
- **工具召唤链路**（hive-summon-tool）：宿主半区经 `ctx.tools.register` 注册两个模型可调用
  的原生工具——`hive_summon`（召唤新蜂：同巢建会话 → 绑蜂种 → 选模型 → 投首条消息
  `⟡蜂种名·召唤` + payload + presetPrompt；`workspaceId` 缺省 = 发起会话所属巢，subagent
  会话沿 `parentSession` 链上溯解析，cwd 兜底，野蜂结构化报错；serialized 蜂种走车道
  占道/排队；保险丝 spawn 计数记账到父链根会话）与 `hive_wait`（事件驱动等待目标会话
  归静：入口即检、琥珀即时上报 `waiting-interaction`、超时上限 30min、取消传播）。
  会话内模型可自主「召唤 → 等完工 → 回报」；蜂种级 `presetPrompt`（B 侧行为定义）在
  蜂群编辑浮窗配置；无人机派发/召唤/等待的权威提示词模板见
  `openspec/changes/archive/2026-09-06-hive-summon-tool/prompt-exemplar.md`（冻结召唤签名，禁止翻译改写）；
- **交互打磨**（hive-interaction-polish，7 项）：① **无人机不可选中**——点击无人机/降级停驻蜂
  无动作（悬停 tips 与双击聚焦保持），子代理会话打开路径回归官方侧栏目录；② **Z/C 键盘旋转**——
  按住 Z/C 连续旋转镜头方位（Z 逆时针 / C 顺时针，固定角速度逐帧积分、帧率无关，俯仰角锁定
  不变），焦点在文本输入 / 模态 / 浮窗 / 拖拽进行中时仲裁守卫忽略，窗口失焦自动清键防空转；
  ③ **E 直达会话**——选中（当前会话）工蜂后按 E 收起蜂巢页直达该会话标准会话视图（不开浮窗）；
  ④ **顶部会话概要条**——当前会话为已渲染工蜂时视窗顶部呈现只读概要（标题 + 末回合
  prompt/response 预览，超长截断，缺失以 `-` 占位；纯预览点击不导航）；⑤ **悬停 tips**——悬停
  蜜蜂/无人机显示六字段瞬态 tips（类型 / 状态 / 所属工作区 / 巢内会话数 / token 四桶合计 /
  平均 DPS，无数据显示 `-`，不呈现费用字段）；⑥ **蜂→无人机连线**——悬停或选中（常驻）工蜂时，
  与其全部可见无人机以半透明蜜金连线相连（逐帧跟随绕飞位置；悬停无人机不显示任何连线）；
  ⑦ **召唤连线**——`hive_summon` / 能力 spawn / 手动孵化召唤出的蜂与召唤者之间以品紫第二色
  连线（召唤者或被召唤蜂任一悬停/选中时显示；召唤边记账进布局文档 optional `summonEdges`
  字段——version 保持 1、封顶 512、随会话归档/消失自动剪边，旧宿主半区下连线静默缺席）；
- **页内设置**：页头 ⚙ 弹出左纵排 nav rail 模态——**场景**（动画等级、无人机显隐、
  水印、快捷键、镜头跟随）、**外观**（墙体/配色/饰条）与**布局**（右侧蜂群阵列
  m×n 与底部道具栏阵列 m×n 显示参数，localStorage 即时生效）；
- 归档会话化为巢底储蜜层的琥珀蜜杯（镜头翻到地下可见，v1 只读）；
- 布局与道具栏配置由宿主半区持久化（`~/.dsh/storages/dsh-hive.json`，revision 乐观锁），
  经 SSE 跨页签同步；
- 入口（对齐 `dsh-token-insight` 形态）：侧栏底部「Hive」座位按钮（Token统计/设置 同款座位），
  点击打开 DSH 应用内蜂巢整页（`shell.overlay` 整页，左缘贴侧栏右缘）；另有会话头回巢按钮与
  可配置快捷键（默认 Alt+H），页内支持全屏巡检。

## 形态

双半区插件（参照 `dsh-v-explorer` 成熟形态）：

- `lib/index.js` 宿主半区——cordis 插件，提供 `/api/dsh-hive/state`（GET/PUT，
  zod 校验 + revision 乐观锁 + 原子写）、`/api/dsh-hive/events`（SSE 布局广播）、
  `/api/dsh-hive/summon`（槽位召唤：create → 绑蜂种 → selectModel → 可选直投首条消息，
  绕 serialized 车道）与 `/api/dsh-hive/send`（蜂栏直发：`{ sessionId, prompt }` →
  `agent.followup`，空白 prompt 400 / 无活代理 404）；另经 `ctx.tools.register` 注册
  模型可调用工具 `hive_summon` / `hive_wait`（工具召唤链路，走车道不绕行——与
  `/summon` 端点的显式绕道语义分工）；
- `lib/client.js` 浏览器半区——esbuild 打成懒 CJS 工厂（`window.__ModuleLoader__.load`
  包裹）；`react`/`react-dom`/`@deepseek-ai/*` external，`three` 打进包内；
- `cordis.patch.yml`——bundle 自带的 loader `- insert` 注册；
- `package.json`——`dsh.bundle.patch` / `dsh.client.platform:"web"` 声明（依赖全为静态种子词，不声明 inject/external）。

### 道具栏槽位存储示例

道具栏配置持久化进布局文档 `~/.dsh/storages/dsh-hive.json` 的 optional `hotbars` 字段
（version 保持 1，旧文档读取视为三栏空配置——蜂栏恒带常驻内置卡（用户卡后追加）、
地板栏空栏呈现「建巢」、巢栏无默认卡；内置卡本身不落盘；
数组序 = 用户槽位展示序，每栏上限 32；
旧 `commands` 字段已移除——存量残留随下次写入自然剥离）：

```jsonc
{
  "version": 1,
  "revision": 12,
  "positions": { "ws-1": { "q": 2, "r": -1 } },
  "camera": null,
  "hotbars": {
    "hive": [ { "id": "0d31548e-…", "name": "召唤设计蜂", "summon": true, "beeTypeId": "bt-design", "prompt": "开始设计任务", "autoSend": false } ],
    "bee":  [ { "id": "7c2ab9f0-…", "name": "跑测试", "prompt": "运行完整测试套件并汇总失败项", "autoSend": true } ],
    "floor": [ { "id": "3f8c21aa-…", "name": "新巢建蜂", "createBee": true, "autoSend": false } ]
  }
}
```

- `id`：客户端生成的 UUID（React key / 排序稳定，改名不破键）；`name`：trim 非空且栏内唯一；
  `summon`（巢栏）/ `createBee`（地板栏）/ `beeTypeId` / `prompt` / `autoSend` 按栏适用
  （字段联动：巢栏召唤关闭或地板栏建蜂关闭时提示词不接受）。
- 蜂栏 `autoSend: false` → 点击卡片把 Prompt 追加进输入框并唤起会话浮窗；`true` → 点击经
  `POST /api/dsh-hive/send` followup 直发。巢/地板栏召唤路径走 `POST /api/dsh-hive/summon`。
- 跨页签编辑经既有 SSE 广播收敛；409 冲突重放时 hotbars 取整体对象替换（后写者覆盖）。

## 构建

```bash
pnpm install
pnpm build   # node build.mjs：src/client.jsx → lib/client.js；src/index.mjs → lib/index.js
pnpm test    # 三十三个冒烟测试（晶格/让位/布局/蜂模型/宿主文档/道具栏纯逻辑/道具栏宿主/工厂环境/桥/UI/蜂种/蜂种预设提示词/能力/车道/引擎/渲染/相机手势/键盘仲裁/tips/连线/概要条/工具召唤/工具等待/性能等）
```

## 挂载（用户 web profile）

> **环境要求**：DSH **0.1.2-rc.1 或更新版本**（客户端 store 依赖 shell 静态种子模块
> `@deepseek-ai/dsh-client-store`；不回向兼容更早版本——旧版 harness 无该种子词）。

`~/.dsh/profiles/web/package.json`：

```jsonc
{
  "dependencies": { "dsh-v-hive": "link:F:/project/dsh-v-hive" },
  "dsh": { "profile": { "bundles": [ "...", "dsh-v-hive" ] } }
}
```

`dsh --profile web` 启动后，侧栏底部「Hive」座位按钮（Token统计/设置 旁）打开蜂巢应用内整页；另有会话头回巢按钮与可配置快捷键（默认 Alt+H）。
修改源码后 `node build.mjs` 重写 bundle，DSH client-hmr 的 stat-poll 即广播 `rebuilt` 帧，
浏览器端免刷新整包重载；改动宿主半区（`src/index.mjs`）则需重启 dsh。

## 设计文档

初始变更（统一晶格模型、墙面朝向衰减 shader、扩张滞回、宿主持久化协议等决策与 M0 尖刺结论）
见本机 openspec 工作区归档的 design.md（openspec/ 为本地开发工作区，不随仓库分发）。
