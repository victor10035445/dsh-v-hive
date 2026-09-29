# assets/voice — 固定语音资产

本目录存放**预生成**的指令应答音与附和短句（`*.wav`），运行期由浏览器 WebAudio 直接解码播放，
**零 TTS 调用**。清单的唯一事实源是 `src/hive/voice/assets.mjs`（`VOICE_CUES`）。

生成 / 校验（详见 README「语音工作台的配置与资产」）：

```sh
pnpm voice:build --check      # 只校验既有资产（体积预算 / 缺失），不需要 key
pnpm voice:build              # 全量生成（需要 ZHIPU_API_KEY 或 $DSH_HOME/hive-voice.json）
pnpm voice:build --dry-run    # 只列清单
```

纪律：无 key 时脚本**非零退出且不产出半套资产**；单条 ≤40KB、总量 ≤2MB。
资产缺失时工作台降级为静音 + 一行提示，不影响其余链路。

GLM-TTS 默认加水印（`watermark_enabled: true`，显式 + 隐式数字水印），本插件不代改该默认值。
