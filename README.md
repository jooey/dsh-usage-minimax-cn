<p align="center">
  <img src="https://img.shields.io/npm/v/dsh-usage-minimax-cn" alt="npm version" />
  <img src="https://img.shields.io/npm/dw/dsh-usage-minimax-cn" alt="npm downloads" />
  <img src="https://img.shields.io/npm/l/dsh-usage-minimax-cn" alt="license" />
</p>

<h1 align="center">dsh-usage-minimax-cn</h1>

<p align="center">
  <strong>极简 DSH 用量监控 · Minimal DSH usage monitor</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dsh-usage-minimax-cn">npm</a>
  · <a href="https://github.com/jooey/dsh-usage-minimax-cn">GitHub</a>
  · <a href="#install-install">Install</a>
</p>

---

**中文** · [English](#english)

把 MiniMax Coding Plan 订阅配额放进 DSH 对话界面：输入 `/usage-minimax-cn` 查看完整报告；选中 MiniMax 模型时，输入框右下角常驻读条，每分钟自动刷新。切到其他模型自动隐藏。

- **右下角读条**：按服务分行显示 `coding x% (倒计时) · video x% (倒计时)`，coding / video 各自独立配额
- **`/usage-minimax-cn` 命令**：支持 `[rolling|weekly|monthly]` 窗口过滤 + `--json` 机器可读输出
- **密钥安全**：只在 DSH 主机端解析，绝不进浏览器

## 系列插件 / Family

同一套极简监控，覆盖五家服务商，格式统一（`Rolling x% (倒计时) · Weekly …`）：

| 插件 | 服务商 | 监控内容 |
|---|---|---|
| `dsh-usage-opencode-go` | OpenCode Go | Rolling / Weekly / Monthly 配额 |
| `dsh-usage-deepseek` | DeepSeek | 账户余额 + 波峰/波谷 |
| `dsh-usage-minimax-cn` | MiniMax Coding Plan | coding / video 分服务配额 |
| `dsh-usage-kimi-cn` | Kimi Coding Plan | Rolling / Weekly 配额 |
| `dsh-usage-glm-cn` | Z.ai GLM Coding Plan | Rolling / Weekly / MCP 配额 |

## 先决条件 / Prerequisites

- 已安装 **DSH**（Node.js >= 20）：`npm install -g @deepseek-ai/dsh`
- **MiniMax API Key**，写入 `~/.dsh/.credentials.yaml`（与 `dsh-llm-minimax-cn` 共用同一 key，已配置则无需重复）：

```yaml
MINIMAX_CN_API_KEY: <你的 key>
```

（或 `export MINIMAX_CN_API_KEY=<key>`）

## Install 安装

```bash
cd ~/.dsh/profiles
npm install dsh-usage-minimax-cn --save --registry=https://registry.npmjs.org
```

然后在 `~/.dsh/profiles/web/cordis.patch.yml` 追加：

```yaml
- insert:
    - id: minimax-cn-usage
      name: 'dsh-usage-minimax-cn'
```

重启 / 刷新 web GUI 生效。

<details>
<summary>其他安装方式（一键 / git）</summary>

```bash
# 一条命令装到 DSH（自动写 patch，幂等）
dsh plugin --profile web add dsh-usage-minimax-cn

# git 安装
dsh plugin --profile web add github:jooey/dsh-usage-minimax-cn
```

</details>

## Usage 使用

- 对话里输入 **`/usage-minimax-cn`** → 完整配额报告（可选 `[rolling|weekly|monthly]` 过滤、`--json` 输出）
- 选中 **MiniMax** 模型 → 右下角读条出现

```text
右下角读条：

coding 61.0% (13m) · video 0.0% (9h 13m)
```

## Troubleshooting

- `MINIMAX_CN_API_KEY is not configured` —— 检查 `~/.dsh/.credentials.yaml`
- 读条不显示 —— 确认当前选中的是 MiniMax 模型，再硬刷新（`Ctrl+Shift+R`）

---

## English

Put your MiniMax Coding Plan quota right inside the DSH conversation UI: type `/usage-minimax-cn` for a full report, and while a MiniMax model is selected, a live chip sits in the bottom-right of the composer — auto-refreshed every minute. Hides itself automatically on other models.

- **Composer chip**: per-service rows like `coding x% (countdown) · video x% (countdown)` — coding and video have separate quotas
- **`/usage-minimax-cn` command**: `[rolling|weekly|monthly]` window filter + `--json` machine-readable output
- **Key safety**: resolved host-side only, never inlined into the browser

## Prerequisites

- **DSH** installed (Node.js >= 20): `npm install -g @deepseek-ai/dsh`
- A **MiniMax API key** in `~/.dsh/.credentials.yaml` (shared with `dsh-llm-minimax-cn`):

```yaml
MINIMAX_CN_API_KEY: <your key>
```

## Install

```bash
cd ~/.dsh/profiles
npm install dsh-usage-minimax-cn --save --registry=https://registry.npmjs.org
```

Then append to `~/.dsh/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: minimax-cn-usage
      name: 'dsh-usage-minimax-cn'
```

Restart / refresh the web GUI to activate.

MIT License · Welcome a ⭐ Star!
