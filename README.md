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

- 页面底部 m×n 卡片阵列，按选中对象三态切换：
  **巢栏**（召唤新蜂：蜂种 + 预设提示词 + 自动发送）、**地板栏**（建巢，可连带建蜂）、**蜂栏**（Prompt 追加输入框 / followup 直发）
- 内置动作卡：继续 / 归档会话 / 打开会话（蜂栏常驻）；建巢（地板栏空栏回退）
- ⌘ 指令编辑器：槽位增删改、排序、字段校验、409 冲突重放

### 工蜂阵列面板

- 选中巢时 canvas 右缘呈现该巢工蜂卡片（状态色 + 标题 + todo 进度 + 蜂种徽章），点卡切会话

### 模型工具（召唤链路）

- `hive_summon`：召唤新蜂——建会话 → 绑蜂种 → 选模型 → 投首条消息
- `hive_wait`：事件驱动等待目标会话归静（30min 上限，取消传播）
- 会话内模型可自主「召唤 → 等完工 → 回报」

### 交互细节

- Z/C 键盘旋转镜头（仲裁守卫防误触）；E 直达当前会话；顶部会话概要条
- 悬停显示六字段 tips（状态 / 工作区 / 巢内会话数 / token / DPS 等）
- 蜂→无人机蜜金连线、召唤品紫连线；无人机不可选中

### 设置与入口

- ⚙ 页内设置：场景（动画/无人机/水印/快捷键/镜头跟随）、外观（墙体/配色/饰条）、布局（阵列参数）
- 入口：侧栏底部「Hive」座位按钮 + 会话头回巢按钮 + 快捷键（默认 Alt+H）
- 布局与道具栏配置由宿主持久化（`~/.dsh/storages/dsh-hive.json`，revision 乐观锁），SSE 跨页签同步

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

> **最低 DSH 版本：0.1.2-rc.1**（客户端 store 依赖种子模块 `@deepseek-ai/dsh-client-store`）。

## 从源码构建

```sh
pnpm install
pnpm build   # src/client.jsx → lib/client.js；src/index.mjs → lib/index.js
pnpm check   # 语法检查
pnpm test    # 35 个冒烟测试
```

改客户端源码后 `pnpm build` 即触发 client-hmr 免刷新重载；改宿主半区（`src/index.mjs`）需重启 dsh。

## 架构

双半区插件（参照 `dsh-v-explorer` 成熟形态）：

| 端 | 内容 |
|---|---|
| 宿主 `lib/index.js` | cordis 插件：`/api/dsh-hive/state`（zod + 乐观锁 + 原子写）、`/events`（SSE 广播）、`/summon`（槽位召唤）、`/send`（蜂栏直发）；注册模型工具 `hive_summon` / `hive_wait` |
| 客户端 `lib/client.js` | esbuild 懒 CJS 工厂；react / @deepseek-ai/* external，three 打进包内 |
| `cordis.patch.yml` | loader `- insert` 注册 |
| `package.json` | `dsh.bundle.patch` / `dsh.client.platform:"web"` 声明 |

道具栏配置持久化于布局文档的 optional `hotbars` 字段（三栏：hive / bee / floor，每栏上限 32，内置卡不落盘）：

```jsonc
{
  "hotbars": {
    "hive":  [ { "id": "…", "name": "召唤设计蜂", "summon": true, "beeTypeId": "bt-design", "prompt": "…", "autoSend": false } ],
    "bee":   [ { "id": "…", "name": "跑测试", "prompt": "…", "autoSend": true } ],
    "floor": [ { "id": "…", "name": "新巢建蜂", "createBee": true, "autoSend": false } ]
  }
}
```

## License

MIT
