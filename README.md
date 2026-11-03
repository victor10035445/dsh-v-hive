# dsh-v-hive · V 蜂巢

**简体中文** | [English](README.en.md)

DeepSeek Harness Web 插件：用 three.js 构建 3D「无限蜂巢」——工作区是六边形工作室，会话是工蜂，归档是储蜜，让会话管理空间化。

纯增量插件：不替换、不禁用任何官方插件。

## 功能

### 3D 蜂巢场景

- 工作区 = 六边形无顶工作室，整巢拖拽搬移，hexDist 防叠加
- 会话 = 工蜂，五态着色：待命灰白 / 忙碌蓝 / 求助琥珀 / 带蜜归绿 / 归档化蜜
- 点击蜜蜂切换当前会话（零侵入官方 UI）；悬停/选中投影 HTML 对话卡片
- 归档会话化为巢底储蜜层的琥珀蜜杯（翻到地下可见）

### 会话浮窗

- 官方会话页以居中浮窗呈现在蜂巢页之上（纯 CSS 整形，零干预官方渲染层序）
- ✕ / 点遮罩 / Esc 收起，草稿跨收起保留，官方与插件扩展原样复用

### 情境道具栏

- 页面底部 m×n 卡片阵列，按选中对象四态切换：
  **巢栏**（召唤新蜂：蜂种 + 预设提示词 + 自动发送）、**地板栏**（建巢，可连带建蜂）、
  **蜂栏**（Prompt 追加输入框 / followup 直发；勾选「新开会话」后点击在**当前会话蜂所属巢**
  召唤新蜂——零上下文发起工具型指令，蜂种随勾选放出、模型双语义）、**提案栏**（恒召唤：
  在提案所属工作区召唤新蜂，支持 `{change}` 模板；不再有「新召唤」开关）
- 内置动作卡：继续 / 归档会话 / 打开会话（蜂栏常驻）；建巢（地板栏空栏回退）
- ⌘ 指令编辑器：槽位增删改、排序、字段校验、409 冲突重放

### 工蜂阵列面板

- 选中巢时 canvas 右缘呈现该巢工蜂卡片（状态色 + 标题 + todo 进度 + 蜂种徽章），点卡切会话

### 模型工具（召唤链路）

- `hive_summon`：召唤新蜂——建会话 → 绑蜂种 → 选模型 → 投首条消息；首条消息带
  `⟡工具召唤（非指令）·蜂种名` 可辨识前缀（显式声明数据非指令）
- `hive_wait`：事件驱动等待目标会话归静（30min 上限，取消传播）；归静返回体附带
  `finalMessage`（目标末条 assistant 正文，8 000 码点截断并置
  `finalMessageTruncated`，不可得时省略）——读蜂输出只用本工具，禁止触碰
  `~/.dsh/sessions`
- 会话内模型可自主「召唤 → 等完工 → 回报正文」

### 交互细节

- Z/C 键盘旋转镜头（仲裁守卫防误触）；E 直达当前会话；顶部会话概要条
- 悬停显示六字段 tips（状态 / 工作区 / 巢内会话数 / token / DPS 等）
- 蜂→无人机蜜金连线、召唤品紫连线；无人机不可选中

### 设置与入口

- ⚙ 页内设置：场景（动画/无人机/水印/快捷键/镜头跟随）、外观（墙体/配色/饰条）、布局（阵列参数）、
  **语音**（宿主凭据只写不读的填写框 / 宿主侧偏好表单 / 页签级会话设置三层分区）
- 入口：侧栏底部「Hive」座位按钮 + 会话头回巢按钮 + 快捷键（默认 Alt+H）+ 页头 🎙 语音工作台
- 布局与道具栏配置由宿主持久化（`~/.dsh/storages/dsh-hive.json`，revision 乐观锁），SSE 跨页签同步

### 语音工作台（add-hive-voice-desk）

页头 🎙 打开右下角工作台。设计基调是**段落制口述**（不是实时双工）：成段说话 → 停顿收段 →
拼接稿可编辑 → 停顿够久（默认 8s）自动应答。

- **说话键两种用法**：**单击**进入监听（麦克风保持开启，按钮变「结束会话」，再单击即结束）；
  **按住**说话则松手收当前段（精确控制单段）。键盘 `Alt+Space` 同款（轻点=切换，按住=收段）。
- **分段与转写**：停顿即收段（单段上限 30s 自动切分续录）；只有累计有效语音够长（≥250ms）的段才送转写，
  咳嗽/键盘声之类的噪声段在本地丢弃；上游没听出内容时给**中性提示**（「没听到内容，可重录」）而不是报错；
  段文本以 chips 呈现，可删除 / 重录；转写串行执行并按段号回填（乱序不会拼错稿）。
- **「继续上次」**：会话结束时留下内存快照（拼接稿 + 多轮历史 + 文档产物），唤醒后说「继续上次」
  可恢复；刷新页面后无快照时播固定音「没有上一次」，不报错。
- **双通路分流**：拼接稿先过**本地指令语法**，命中即执行**不调用任何 LLM**：
  | 指令 | 例子 | 副作用 |
  |---|---|---|
  | 会话控制 | 「结束会话」「就到这里」「回到待机」 | 无 |
  | 会话恢复 | 「继续上次」 | 无 |
  | 蜂巢总览 | 「查看蜂巢」 | 无 |
  | 蜂聚焦 | 「看看三号蜂」 | 无 |
  | 召唤 | 「召唤两个侦察蜂」 | **有 → 确认卡** |
  | 投递 | 「把总结发给三号蜂」 | **有 → 确认卡** |
  | 确认/取消 | 「确认」「取消」「算了」 | 无 |
  | 手动应答 | 「回答」「就这些」 | 无 |

  匹配以**整段意图**为准：调研正文里出现的「召唤」「发给」字样不会劫持讨论（有负例冒烟）。
- **副作用闸门**：召唤 / 投递命中先出确认卡 + 确认音并回显解析结果（如「三号蜂 = 「调研段落制 ASR」」），
  说「确认」或点按钮才执行；30s（可调）不回应自动弹回，不悬置阻塞后续口述。
- **蜂后应答（双 register）**：未命中的拼接稿走 `/voice/answer`——人设模板 + 多轮历史 + 客户端指称表 →
  **DSH 已配置 provider**（临时蜂后会话取一次补全后立即归档）→ 一次产出 markdown 文档，
  **首段即口语摘要**（TTS 流式朗读，播放中说话可打断并中止上游）→ 详细文档由宿主写入
  `<目标工作区>/hive-voice/<YYYY-MM-DD>-<slug>.md`（排他创建 `-2/-3`，原子替换）。
  文档卡片支持「发给蜂」投递与路径复制。
- **固定语音资产**：指令应答音与附和短句是包内预生成 wav，运行期零 TTS 调用；附和只在段落间隙
  播放并带 300ms 保护窗（防串音）；可在设置里关闭。
- **焦点页约束**：只有焦点页出声/录音（失焦立即停播并中止上游），多标签各持独立会话。

> **能力边界（重要）**：蜂后**只依据你这次的口述（+ 本会话多轮历史）作答**——不读文件、不翻别的会话。
> 这是刻意的：临时蜂后会话跑在 `minimal` 工具面预设上（剥掉 `fs`/`fs-search`/`subagent`/`web`），
> 避免它把其他会话的内容混进结论；万一某次真的调了工具，回执会弹可见警告。
> 所以「帮我查一下某只蜂的资料」这类请求它会**如实回答拿不到**。要查某只蜂的产出，请用投递/召唤指令
> （「把总结发给三号蜂」等），或直接打开那个会话。
> 受控的「指名查询」指令需求已留档（`openspec/changes/add-hive-voice-desk/design.md` Q5），暂未实现。

## 语音工作台的配置与资产

### 凭据（只存宿主侧，SHALL NOT 下发浏览器）

智谱 key 用于 **ASR + TTS**（文本应答复用 DSH 已配置的 provider，不需要智谱文本模型）。

**首选：蜂巢页 ⚙ 设置 →「语音」节直接填**——粘贴 key 点「保存 key」（输入框恒空、永不回显已存值，
可随时「清除」）。同一节还能编辑宿主侧偏好（音色 / 语速 / 文本通道 / 文本模型 / 产出上限 / 人设 /
默认工作区 / ASR 热词编码），点「保存到宿主」一次写入。

等效的手工路径（优先级更高，便于 CI 或多账号切换）：

1. 环境变量 `ZHIPU_API_KEY` → `ZHIPUAI_API_KEY`
2. `$DSH_HOME/hive-voice.json`：

```jsonc
{
  "apiKey": "…",                 // 同 env，二者取其一；设置内填写也写在这里
  "voice": "tongtong",           // tongtong | chuichui | xiaochen | jam | kazi | douji | luodo
  "speed": 1,                    // 0.5–2
  "textChannel": "dsh",          // dsh（默认，复用 DSH provider）| zhipu（兜底直调 chat/completions）
  "textModel": { "provider": "…", "model": "…" },  // 可选；缺省用 modelCatalog().default
  "personaId": "queen-research", // 人设模板
  "targetWorkspaceId": "…",      // 默认落盘工作区（缺省 = 蜂巢页当前工作区）
  "maxTokens": 4096,             // 产出 token 硬上限
  "asrHotwordsEncoding": "repeat", // hotwords 的 multipart 编码：repeat（默认）| json
  "textAgentPreset": "minimal"   // 临时蜂后会话的 agent 预设（默认 minimal：剥掉 fs/subagent/web 等工具面）
}
```

> **为什么默认 `minimal`**：临时蜂后会话是 DSH 的完整 agent 会话。用宿主默认的 `standard` 预设时，
> 它带着 `fs`/`fs-search`/`subagent`/`web` 等工具且继承宿主的沙箱策略，**模型有能力去读取别的会话
> 或工作区历史**——实测会出现「应答里带出其他会话信息」。`minimal` 只留一个常驻 shell。
> 插件另有一层可见性兜底：若某次应答确实调用了工具，回执会明确警告
> 「⚠️ 本次应答调用了工具（…），内容可能引用了会话外信息」。要彻底消除需要 DSH 提供
> **无工具的一次性补全入口**（当前不存在）。

配置**每请求读一次**，改完立即对 ASR/TTS/应答生效（无需重启）。`/api/dsh-hive/voice/status` 与
`PUT /api/dsh-hive/voice/config` 的响应体**均不含 key**，只回「已配置 / 未配置 / 缺文本模型 + 来源」；
设置内写入是**只写不读**通路（key 从不下发浏览器，与既有 `/send`、`/summon` 同层同信任模型）。
文本模型不可路由（`routableProviders` 为空）时 `/voice/answer` 返回结构化 `no-model`，工作台给引导文案。

> 兜底链路（`textChannel: "zhipu"`）直调 `POST /api/paas/v4/chat/completions`，**不是默认路径**：
> 仅在确认 DSH 临时蜂后会话形态不可用时启用。

### 固定语音资产（包内预生成 wav）

指令应答音与附和短句由 `scripts/build-voice-assets.mjs` 在开发期用 GLM-TTS 一次性生成到
`assets/voice/*.wav`（清单唯一事实源：`src/hive/voice/assets.mjs`）：

```sh
pnpm voice:build --dry-run            # 只列清单，不发请求
pnpm voice:build                      # 全量生成（需要 key）
pnpm voice:build --voice jam --speed 1.1
pnpm voice:build --rate 24000 --no-trim   # 关掉归一化（保留上游原始格式）
pnpm voice:build --check              # 只校验既有资产（体积预算/缺失），不需要 key
```

**归一化是必需的**（2026-09-27 真实上游实测）：GLM-TTS 非流式 wav 是 24 kHz 单声道 PCM16
（48 KB/秒），而且**每条前面挂着 ≈2.0 s 低电平水印噪声**（峰值约 5%，人声段约 71%）——
「好的」原始就有 2.51 s / 118 KB。脚本因此内置 `normalizeCueWav`：按**相对阈值**
（`全局峰值 × 0.15`）切出人声段 → 降到 16 kHz 单声道 → 重编码。当前 22 条资产实测
**0.43–1.39 s / 13.4–43.4 KB / 合计 628 KB**（上游原始合计 3051 KB）。

> **水印说明**：`watermark_enabled` 默认为 `true`（显式 + 隐式数字水印，政策要求），且实测
> **显式传 `false` 不生效**（文件反而更长）——官方说明只对完成「去水印」流程的账号有效。
> 因此上面的归一化是在**保留水印**的前提下把体积压下来的；本插件不代改该默认值。

纪律：**无 key 时非零退出且不产出半套资产**（全部音频先在内存生成、归一化、过预算后才一次性落盘）；
预算单条 ≤80 KB、总量 ≤1.5 MB（按实测标定；包内 GLB 模型约 9 MB，资产占比很小）；
上游错误码会翻译成可执行指引（1113 余额不足 / 1000 鉴权失败 / 1214 音色不存在 / 1301 限流）。
资产缺失时工作台降级为静音 + 一行提示，链路不报错。

### 体积与成本口径

- ASR：按音频分钟计费（`glm-asr-2512`），单段 ≤30s、≤25MB；上传面独立 2MB 上限（不复用 512KB JSON 口径）。
- TTS：仅**摘要段**合成（人设模板约定首段 2–4 句、可直接朗读），文档正文不朗读；
  固定应答音零成本（预生成资产）。运行时一次摘要的流式合成实测：**首个可播音频帧 833 ms**、
  该句 3 帧 / 415 KB PCM（音频不落盘，只在内存里边收边播）。
- 文本应答：走 DSH 已配置 provider 的既有额度，插件不另收 key；
  实测一份完整文档的端到端时延 **≈23 s**（deepseek-flash + reasoning max，含落盘）。

## 安装

**方式一 · GitHub 地址直装（推荐）**——lib 已随仓库提交，无需构建：

```sh
dsh plugin --profile web add "github:victor10035445/dsh-v-hive"
```

锁定版本：`dsh plugin --profile web add "github:victor10035445/dsh-v-hive#<commit-sha>"`

**方式二 · 本地 clone + link 直连**（适合开发调试）：

```sh
git clone https://github.com/victor10035445/dsh-v-hive.git
dsh plugin --profile web add "link:<克隆路径>"
```

**方式三 · tgz 打包安装**：

```sh
npm pack
dsh plugin --profile web add "<tgz 的绝对路径>"
```

装完**重启 `dsh web`** 生效。也可在 `~/.dsh/profiles/web/cordis.patch.yml` 手动加 `- insert: [{id: dsh-v-hive, name: dsh-v-hive}]`（`patchReload: live` 下保存即热重载）。

> **最低 DSH 版本：0.2.1-rc.5**。该版把客户端 primitives 的 Settings 图标族由
> `IconSettingsOutline14/16/18` 重命名为 `IconSettingsOutlineMedium/Regular`，本插件
> 0.2.2 起对齐新基线（页头设置齿轮用 `IconSettingsOutlineMedium` + `size 16`，与官方
> 设置入口同款同尺寸）；更早版本没有 `Medium`、新基线已删除 `16` 族，两侧互斥，属
> 文档声明的**显式不支持组合**。
>
> `pnpm test` 含**宿主契约测试**（`test/host-export-contract-smoke.mjs`），闸门覆盖面 =
> **种子模块命名导出 + 宿主服务动词面与快照形状**：它读取本机已安装 dsh 的前端基线
> bundle 与服务类型声明，核验插件用到的每个宿主命名导出真实存在、`ctx.sessions` /
> `ctx.uiWorkspace` 的动词面与 `SessionListState` 形状仍与插件口径一致（rc.5 起导航归
> `uiWorkspace.openSession`、快照不再有 `current` 字段）。运行前置：
> 本机已安装 dsh（`npm i -g @deepseek-ai/dsh`），或用 `DSH_INSTALL_ROOT` 指向安装根
> （通常即 `npm root -g` 的输出）。定位不到基线/类型声明时测试会直接失败并列出已尝试
> 路径——不静默跳过（本插件生来服务于已安装的 harness，跳过等于防线失效）。

## 从源码构建

```sh
pnpm install
pnpm build   # src/client.jsx → lib/client.js；src/index.mjs → lib/index.js
pnpm check   # 语法检查（含 lib/hive-voice.mjs）
pnpm test    # 全量冒烟测试（含宿主契约；需本机已安装 dsh 或设置 DSH_INSTALL_ROOT）
```

改客户端源码后 `pnpm build` 即触发 client-hmr 免刷新重载；改宿主半区（`src/index.mjs`）需重启 dsh。

## 架构

双半区插件（参照 `dsh-v-explorer` 成熟形态）：

| 端 | 内容 |
|---|---|
| 宿主 `lib/index.js` | cordis 插件：`/api/dsh-hive/state`（zod + 乐观锁 + 原子写）、`/events`（SSE 广播）、`/summon`（槽位召唤）、`/send`（蜂栏直发）、`/proposals`（提案清单：全工作区 × `openspec/changes`）与 `/proposals/status{,es}`（状态位置位 / 状态列表整单替换，均 persistDoc + SSE 广播）、`/assets/{models,voice}/<file>`（白名单子目录静态资产）、`/voice/{status,asr,tts,answer,index}`（语音代理：multipart 转写 / SSE 转发 / 双 register 应答 + 落盘 / 索引）；注册模型工具 `hive_summon` / `hive_wait` |
| 宿主纯逻辑 `lib/hive-voice.mjs` | 语音口径常量、凭据解析、multipart 与 WAV 解析、热词表、人设模板与提示词、`spoken` 抽取、落盘文件名与排他创建、截断判定 |
| 宿主纯逻辑 `lib/proposals.mjs` | 提案清单收集口径（`openspec/changes` 目录名过滤）、`proposalStates` 归一化/剪除/封顶、**提案状态列表**归一化与有效列表缺省合并、面板让位 reserve |
| 客户端 `lib/client.js` | esbuild 懒 CJS 工厂；react / @deepseek-ai/* external，three 打进包内；`src/hive/voice/*`（grammar / recorder / session / speech / desk）随包 |
| `cordis.patch.yml` | loader `- insert` 注册 |
| `package.json` | `dsh.bundle.patch` / `dsh.client.platform:"web"` 声明；`files` 含 `assets/`（模型与语音资产） |

道具栏配置持久化于布局文档的 optional `hotbars` 字段（四栏：hive / bee / floor / proposal，每栏上限 32，内置卡不落盘）：

```jsonc
{
  "hotbars": {
    "hive":     [ { "id": "…", "name": "召唤设计蜂", "summon": true, "beeTypeId": "bt-design", "prompt": "…", "autoSend": false } ],
    // 蜂栏：newSession 缺省不落盘（未勾 = 既有双通道）；勾选时另携带 beeTypeId
    // （读取路径对未勾槽位裁剪该键，缺省 = 默认蜂）。
    "bee":      [ { "id": "…", "name": "跑测试", "prompt": "…", "autoSend": true },
                  { "id": "…", "name": "跑测试（新会话）", "prompt": "…", "autoSend": true, "newSession": true, "beeTypeId": "bt-design" } ],
    "floor":    [ { "id": "…", "name": "新巢建蜂", "createBee": true, "autoSend": false } ],
    // 提案栏恒走召唤通道（summon 已退役：存量键读取时剥离、SHALL NOT 再物化）；
    // prompt 必填（模板，{change} = 选中提案名）；citeName 缺省 = 勾选
    // （执行前把 @提案名 前置到提示词最前）；setStatus 只做形状校验，
    // 不在当前状态列表即执行时静默跳过。
    "proposal": [ { "id": "…", "name": "继续推进", "beeTypeId": "bt-design", "prompt": "继续推进 {change}", "autoSend": true, "setStatus": "reviewed", "citeName": false } ]
  }
}
```

提案工作台的可配置项（蜂巢页 ⚙ 设置 →「提案」节）：

- **可视卡片行数**（3–32，默认 24）：页签设置（localStorage，即时生效），面板经 CSS 变量
  `--jyv-proposalMaxH` 消费；画布封顶与作战报告让位恒高于该设置。
- **状态列表**（封顶 16 条，`doc.proposalStatuses`）：出厂四值「已审阅 / 已执行 / 已暂停 / 已归档」，
  可在设置节增删改名改色，**草稿 + 显式「保存到宿主」**整单替换写入（专用路由 + SSE 广播，
  跨页签收敛）。删除某状态后，已打该状态的提案保留数据但不再显示标记，同名 id 重新加回即恢复。

## License

MIT
