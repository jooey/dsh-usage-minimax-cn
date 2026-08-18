# dsh-usage-minimax-cn

A DSH plugin that displays your MiniMax (minimax-cn) Coding Plan quota in the chat and as a composer readout. The readout only renders while the session's selected provider is `minimax-cn`; switching to any other provider hides it.

DSH 插件，把 MiniMax（minimax-cn）Coding Plan 订阅配额显示在对话里和输入框右下角的常驻读条上。读条只在当前会话的 provider 为 `minimax-cn` 时显示，切到其他 provider 自动隐藏。

[![npm](https://img.shields.io/npm/v/dsh-usage-minimax-cn)](https://www.npmjs.com/package/dsh-usage-minimax-cn)
[![GitHub](https://img.shields.io/github/license/jooey/dsh-usage-minimax-cn)](https://github.com/jooey/dsh-usage-minimax-cn)

---

## Install / 安装

```bash
dsh plugin --profile web add dsh-usage-minimax-cn
```

DSH will fetch from npm, copy into `~/.dsh/profiles/node_modules/`, and patch `cordis.patch.yml` (idempotent). Refresh the DSH web GUI with `Ctrl+Shift+R` and pick a model under the **MiniMax (minimax-cn)** provider.

The plugin reads `MINIMAX_CN_API_KEY` from the DSH harness credentials seam — the same key already configured for `dsh-llm-minimax-cn`, so no extra setup is needed.

DSH 会从 npm 拉取、拷贝到 `~/.dsh/profiles/node_modules/`，并把条目写入 `cordis.patch.yml`（幂等）。刷一下 web GUI（`Ctrl+Shift+R`），模型选择器切到 **MiniMax（minimax-cn）** provider 即可。`MINIMAX_CN_API_KEY` 通过 DSH harness credentials seam 读取——和 `dsh-llm-minimax-cn` 共用同一个 key 名，无需重复配置。

## Usage / 用法

### Slash command

```text
/usage-minimax-cn [rolling|weekly|monthly] [--json|-j] [--help|-h]
```

- No arguments — print every model's quota (rolling / weekly / monthly windows with percent used, used/total counts, and time until reset).
- `rolling` / `weekly` / `monthly` — keep only that window.
- `--json` / `-j` — print the raw API payload as JSON.
- `--help` / `-h` — print usage.

不带参数：打印每个 model 的完整配额报告（rolling / weekly / monthly 三窗口，含已用百分比、已用/总量、重置倒计时）。`rolling` / `weekly` / `monthly` 只显示对应窗口。`--json` 输出 Coding Plan 接口原始 JSON。`--help` 打印帮助。

### Composer readout

When the selected model is on `minimax-cn`, a small chip appears in the bottom-right of the input box showing per-model remaining-percent and time until reset. Refreshes every 60 seconds.

当模型 provider 为 `minimax-cn` 时，输入框右下角会出现一个常驻小读条，按 model 展示剩余百分比和重置倒计时，每 60 秒自动刷新。

## Subscribe MiniMax Token Plan / 订阅 Token Plan

If you don't have a MiniMax Token Plan subscription yet, [subscribe here](https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link) — friends get a discount and you get a referral rebate.

还没订阅 MiniMax Token Plan？[点此订阅](https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link) — 好友得折扣，你得返利。

---

## Development cost / 开发成本

This plugin was built with assistance from **MiniMax-M3** (the MiniMax China-region MiniMax model). The full session DSH stats for the v1.0.x release cycle:

本插件由 **MiniMax-M3**（MiniMax 中国区 MiniMax 模型）协助开发。整个发布周期的 DSH 会话统计：

| Metric / 指标 | Value / 数值 |
|---|---|
| Turns | 28 |
| Steps | 353 |
| LLM time / LLM 耗时 | 56m32s |
| Tool call time / 工具调用耗时 | 17m47s |
| TTFT avg / 平均首 token 时延 | 5.5s |
| Decode speed / 解码速度 | 126 tok/s |
| Cache hit / 缓存命中 | 99% |
| Input tokens | 54.4M |
| Output tokens | 185K |

> These numbers reflect the cumulative DSH session that produced the plugin (coding + npm publish + GitHub push + brand-logo swap + README iterations). They are not plugin runtime costs — the plugin itself only calls the MiniMax Coding Plan quota endpoint and produces no LLM tokens.

以上是该 DSH 会话（编码 + npm 发布 + GitHub 推送 + 真实品牌 logo 替换 + README 迭代）的累计统计，仅作开发透明度记录，不代表插件运行时的任何 token 消耗——插件本身只是定时调用 MiniMax Coding Plan 配额接口，不产生 LLM token。

## License

MIT
