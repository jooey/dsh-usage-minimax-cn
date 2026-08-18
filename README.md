<p align="center">
  <img src="https://img.shields.io/npm/v/dsh-usage-minimax-cn?label=npm" alt="npm version" />
  <img src="https://img.shields.io/github/v/release/jooey/dsh-usage-minimax-cn?label=release" alt="GitHub release" />
  <img src="https://img.shields.io/npm/dw/dsh-usage-minimax-cn" alt="npm downloads" />
  <img src="https://img.shields.io/github/stars/jooey/dsh-usage-minimax-cn" alt="GitHub stars" />
  <img src="https://img.shields.io/github/license/jooey/dsh-usage-minimax-cn" alt="GitHub license" />
</p>

<h1 align="center">dsh-usage-minimax-cn</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/dsh-usage-minimax-cn">npm package</a>
  ·
  <a href="https://github.com/jooey/dsh-usage-minimax-cn">GitHub repo</a>
  ·
  <a href="#install">Install</a>
  ·
  <a href="#usage">Usage</a>
</p>

<p align="center">
  <strong>🚀 Quick start（一条命令装到 DSH）</strong>
</p>

```bash
cd ~/.dsh/profiles
npm install dsh-usage-minimax-cn --save --registry=https://registry.npmjs.org
```

然后在 `~/.dsh/profiles/web/cordis.patch.yml` 里追加：

```yaml
- insert:
    - id: minimax-cn-usage
      name: 'dsh-usage-minimax-cn'
```

> 装完**刷新 web GUI**（`Ctrl+Shift+R`），模型选择器切到 **MiniMax（minimax-cn）** provider，输入框右下角就出读条了。
>
> 其他安装方式（DSH 自带 plugin 命令 / GitHub git 安装 / PowerShell / 源码）见下方 <a href="#install">Install</a>。

一个用于 **DSH（DeepSeek Harness）** 的插件：把你的 **MiniMax（minimax-cn）Coding Plan 订阅配额**直接显示在对话里，并且**只在当前会话选中 MiniMax provider（`minimax-cn`）时展示**；切到其他模型/供应商时自动隐藏。

- 输入 **`/usage-minimax-cn [window] [--json|-j] [--help|-h]`** —— 打印完整配额报告或单窗口报告，支持窗口过滤 + JSON 原始输出 + 帮助。
- 输入框右下角常驻一个小读条 —— MiniMax 图标 + `Rolling · Weekly · Monthly` 百分比，每分钟自动刷新，点击打开 [MiniMax Token Plan 订阅页（含邀请福利）](https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link)。
- 读条只在模型选择器选中 **MiniMax（minimax-cn）** provider 时出现。

> 还没有 MiniMax Token Plan 订阅？<br/>
> **👉 [点这里订阅 / 拿邀请福利](https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link)** 👈
> 好友订阅享 9 折 + Builder 权益，邀请人得 10% 返利 + 社区特权。

## `/usage-minimax-cn` 命令参数

```text
Usage: /usage-minimax-cn [window] [--json|-j] [--help|-h]

Arguments:
  rolling | weekly | monthly    只显示命名窗口（`rolling` 也接受别名 `current`
                                 或 `current_interval`）
  --json | -j                   输出 Coding Plan 接口原始 JSON（不格式化）
  --help | -h                   打印本帮助
```

| 用法 | 行为 |
|---|---|
| `/usage-minimax-cn` | 完整报告（默认） |
| `/usage-minimax-cn rolling` | 只显示 rolling 窗口 |
| `/usage-minimax-cn weekly` | 只显示 weekly 窗口 |
| `/usage-minimax-cn monthly` | 只显示 monthly 窗口 |
| `/usage-minimax-cn current` | 等同 `rolling`（别名） |
| `/usage-minimax-cn json` | 输出原始 JSON（不格式化） |
| `/usage-minimax-cn rolling json` | 只显示 rolling 的原始 JSON |
| `/usage-minimax-cn weekly --json` | 同上（参数顺序无关，大小写无关） |
| `/usage-minimax-cn help` | 打印帮助 |

## MiniMax provider 能提供什么样的用量统计？

我们分析了 MiniMax（minimax）Coding Plan 订阅的可用数据面：

| 数据面 | 是否可用 | 说明 |
|---|---|---|
| `GET https://api.minimaxi.com/v1/coding_plan/remains` | ✅ 可用 | Coding Plan 时间窗口配额：`current_interval_*`（rolling）、`weekly_*`、`monthly_*`，每个含 `total_count` / `usage_count` / `remains` / `reset_at` |
| Rolling / Weekly / Monthly 用量百分比 | ✅ 派生 | 由 `usage_count` / `total_count` 实时算出，类似 dsh-usage-opencode-go |
| 账户余额（balance） | ⚠️ 非 Coding Plan | Coding Plan 是订阅配额而非按量余额，账户余额需另查 `https://api.minimaxi.com/v1/api/balance`（不在本插件范围） |
| 按模型/按日 token 用量明细 | ❌ 无公开端点 | 仅 MiniMax 平台后台可见 |

因此本插件展示的"用量/额度统计"就是 MiniMax Coding Plan **时间窗口配额**：rolling / weekly / monthly 三个窗口的用量百分比、已用/总量、剩余，以及每个窗口的重置时间。

## 凭据读取（与 DSH 一致）

`MINIMAX_CN_API_KEY` **只通过 DSH harness credentials seam** 读取（`ctx.credentials.resolve(API_KEY_REF)`，由 `@deepseek-ai/dsh-credentials-local` 提供）。插件从不直接读文件或环境变量——harness 会按 DSH 的规则聚合 `~/.dsh/.credentials.yaml` 里的 `MINIMAX_CN_API_KEY` 和环境变量 `MINIMAX_CN_API_KEY`，每次请求时重新解析（改了凭据无需重启 DSH）。返回值形如 `{ value: "<key>", source: "file" | "env" }`。

> 之所以用 `MINIMAX_CN_API_KEY` 这个名字，是因为它跟 `dsh-llm-minimax-cn`（MiniMax LLM provider 插件）用的是**同一个** key 名——所以你只要装过一次 `dsh-llm-minimax-cn` 并配过 key，这个 plugin 直接就能用，不用重复配。

主机端是**唯一**读 key 的地方。浏览器端（`lib/client.js`）从不接触 key——它只通过 Typert 远程服务（`minimaxUsage/snapshot`）向主机要归一化后的 `{percent, reset_at, ...}` snapshot；真正带 `Authorization: Bearer ...` 发请求到 MiniMax Coding Plan 接口的是主机。

## 截图 / 效果

**`/usage-minimax-cn`** （默认 — 完整报告，每行 `[model] window: used% · count/total · resets in X · status Y`）：

```text
MiniMax (minimax-cn) Coding Plan usage

[general] Rolling: 13.0% used · 0/0 · resets in 28m (status 1)
[general] Weekly:  0.0% used  · 0/0 · resets in 5d 13h 20m (status 3)
[video]   Rolling: 0.0% used  · 3/3 · resets in 14h 26m (status 1)
[video]   Weekly:  0.0% used  · 21/21 · resets in 5d 13h 20m (status 1)

MiniMax platform: https://platform.minimaxi.com/user-center/payment/coding-plan
Get MiniMax Token Plan (invite bonus): https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link
```

**`/usage-minimax-cn rolling`** （只看一个窗口）：

```text
MiniMax (minimax-cn) Coding Plan usage — rolling

[general] Rolling: 13.0% used · 0/0 · resets in 28m (status 1)
[video]   Rolling: 0.0% used  · 3/3 · resets in 14h 26m (status 1)

MiniMax platform: https://platform.minimaxi.com/user-center/payment/coding-plan
Get MiniMax Token Plan (invite bonus): https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link
```

**`/usage-minimax-cn rolling json`** （单窗口原始 JSON）：

```text
MiniMax (minimax-cn) Coding Plan usage — rolling (json)

[
  {
    "model_name": "general",
    "percent": 13,
    "remaining_percent": 87,
    "total_count": 0,
    "usage_count": 0,
    "status": 1,
    "start_time": 1786950000000,
    "reset_at": "2026-08-20T18:00:00.000Z",
    "remains_ms": 1700000
  },
  {
    "model_name": "video",
    "percent": 0,
    "remaining_percent": 100,
    "total_count": 3,
    "usage_count": 3,
    "status": 1,
    "start_time": 1786896000000,
    "reset_at": "2026-08-21T08:00:00.000Z",
    "remains_ms": 52000000
  }
]

MiniMax platform: https://platform.minimaxi.com/user-center/payment/coding-plan
Get MiniMax Token Plan (invite bonus): https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link
```

输入框底部工具行（模型选择器左侧，且仅选中 minimax-cn 时）:

```text
[ ⬜ MiniMax 图标 ] general 13.0% (28m) · video 0.0% (14h 26m)
```

> 读条本身是邀请链接：hover 显示 `MiniMax (minimax-cn) Coding Plan usage · 🎁 get MiniMax Token Plan (invite bonus)`，点击打开 [Token Plan 订阅页](https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link)，把朋友拉进来你俩都有福利。

## 第 0 步：安装 DSH

还没有 DSH？先全局安装启动器（Node.js >= 20）：

```bash
npm install -g @deepseek-ai/dsh
dsh --version
```

首次使用会自动初始化 `web` profile 到 `~/.dsh/profiles/web`（Windows：`%USERPROFILE%\.dsh\profiles\web`）。

## 先决条件

- 已安装 **DSH** 并使用 `web` profile（见上一步）。
- 拥有 **MiniMax Coding Plan** 的 API Key（`MINIMAX_CN_API_KEY`）。
  - 到 <https://platform.minimaxi.com> 申请 Coding Plan 订阅，然后写入 `~/.dsh/.credentials.yaml`：

      ```yaml
      MINIMAX_CN_API_KEY: <你的 key>
      ```

      （也可以直接 `export MINIMAX_API_KEY=<key>`）
  - 如使用网关/代理，可选地设置 `MINIMAX_BASE_URL` 覆盖默认 base URL（与 `dsh-llm-minimax-cn` 共用同一环境变量）。

## Install

### 方式 A：DSH 自带 plugin 命令（最简单）

```bash
dsh plugin --profile web add dsh-usage-minimax-cn
```

DSH 会自动从 npm 拉取、拷到 `~/.dsh/profiles/node_modules/`、写 cordis.patch.yml（幂等）。一条命令搞定。

### 方式 B：npm 安装（推荐）

```bash
cd ~/.dsh/profiles
npm install dsh-usage-minimax-cn --save --registry=https://registry.npmjs.org
```

然后在 `~/.dsh/profiles/web/cordis.patch.yml` 中追加：

```yaml
- insert:
    - id: minimax-cn-usage
      name: 'dsh-usage-minimax-cn'
```

### 方式 C：直接给 DSH 传 GitHub 链接（git 安装）

```bash
dsh plugin --profile web add github:<用户名>/dsh-usage-minimax-cn

# 或完整 URL 形式（任选其一）
dsh plugin --profile web add https://github.com/<用户名>/dsh-usage-minimax-cn.git
```

> 注意：仓库必须是**公开**的；安装器会直接以仓库根目录的
> `package.json`（名字必须为 `dsh-usage-minimax-cn`）建链安装。
> 本仓库是纯 JS 包、无构建步骤，所以 git 安装可以直接用。

安装后同样要在 `~/.dsh/profiles/web/cordis.patch.yml` 里追加：

```yaml
- insert:
    - id: minimax-cn-usage
      name: 'dsh-usage-minimax-cn'
```

### 方式 D：bash 一键脚本（WSL / Linux / macOS 推荐）

仓库自带 `install.sh`：

```bash
cd /mnt/d/jooeyAICoding/DSH-Desktop/dsh-usage-minimax-cn   # 或者你 clone 下来的路径
./install.sh
```

它会自动：
1. 拷贝 `lib/*` + `package.json` 到 `~/.dsh/profiles/node_modules/dsh-usage-minimax-cn/`
2. 把 patch 写入 `~/.dsh/profiles/web/cordis.patch.yml`（幂等）

可选参数：
```bash
./install.sh --profile xxx    # 装到非默认 profile
./install.sh --help           # 帮助
```

### 方式 E：PowerShell 一键脚本（Windows 原生 PowerShell）

仓库自带 `install.ps1`：

```powershell
.\install.ps1
```

行为同 `install.sh`，只是 PowerShell 语法。

### 方式 F：源码手动安装

```bash
# 1. 拷贝包到 profile 的 node_modules fallback
rm -rf ~/.dsh/profiles/node_modules/dsh-usage-minimax-cn
cp -r . ~/.dsh/profiles/node_modules/dsh-usage-minimax-cn

# 2. 在 ~/.dsh/profiles/web/cordis.patch.yml 里追加：
#    - insert:
#        - id: minimax-cn-usage
#          name: 'dsh-usage-minimax-cn'
```

以下通用步骤（方式 A–F 都要做）：改完 patch 后，**重启 / 刷新** web GUI（该 profile 默认关闭 HMR）。

## Usage

安装后**重启 / 刷新** web GUI：

- 对话里输入 **`/usage-minimax-cn`** → 完整配额报告（rolling / weekly / monthly）。
- 输入 **`/usage-minimax-cn rolling`**（或 `weekly` / `monthly` / `current`）→ 只看单个窗口。
- 输入 **`/usage-minimax-cn json`** → 输出 Coding Plan 接口原始 JSON（不格式化）。
- 组合：`/usage-minimax-cn rolling json`、`/usage-minimax-cn weekly --json` 等都支持。
- 输入 **`/usage-minimax-cn help`** → 打印帮助。
- 选中 **MiniMax（minimax-cn）** provider 的模型 → 输入框右下角显示用量 readout；切到其他 provider 自动隐藏。

### 验证配置（不启动服务）

```powershell
dsh --profile web --dump-config
# 找到：- id: minimax-cn-usage /  name: dsh-usage-minimax-cn
```

## 工作原理

| 端 | 文件 | 作用 |
|---|---|---|
| 主机 | `lib/index.js` | Cordis 插件：`/usage-minimax-cn` 命令 + `minimaxUsage` Typert 远程服务 |
| 主机 | `lib/typert.host.js` | Typert 主机 face 清单（`minimaxUsage/snapshot`） |
| 主机 | `lib/logic.js` | 无依赖纯逻辑（fetch / 格式化）；把 Coding Plan 的 `usage_count / total_count` 折叠成 `percent` 推给浏览器 |
| 浏览器 | `lib/client.js` | 挂载远程服务，注册 `conversation.input.right` slot readout；通过 `modelDirectories` 订阅当前模型，仅 `minimax-cn` 时渲染（其他 provider 自动隐藏）；含 MiniMax 图标 |
| 浏览器 | `lib/typert.remote-client.js` | Typert 客户端 face 清单 |
| 类型 | `lib/index.d.ts` | 主机 face 类型声明 |

## Troubleshooting

- `MINIMAX_CN_API_KEY is not configured` —— 检查 `~/.dsh/.credentials.yaml` 是否已写入 `MINIMAX_CN_API_KEY`。
- `MiniMax Coding Plan API returned HTTP 4xx` —— key 被配额接口拒绝；必须是有 Coding Plan 权限的 MiniMax API key。
- 右下角 readout 不显示 —— 先确认当前选中的模型是 **MiniMax（minimax-cn）** provider；若是，再硬刷新浏览器（`Ctrl+Shift+R`）。若控制台报 `Failed to load plugins`，确认包已正确安装、patch 里的 `name` 是 `dsh-usage-minimax-cn`。
- 用网关/代理时 quota 接口域名被替换 —— 设置 `MINIMAX_BASE_URL` 指向你的网关 base URL（不要带 `/v1/coding_plan/remains`，插件会自动拼接）。

## 为开发者

```bash
# 跑通核心逻辑（读取真实 key）
node test/logic.mjs

# 打包前预览 tarball
npm pack --dry-run

# 发布
npm publish --registry=https://registry.npmjs.org --access public
```

MIT License · 欢迎 ⭐ Star！

---

## 开发成本（透明记录）

本插件由 **MiniMax-M3**（MiniMax 中国区 MiniMax 模型）协助开发。整个开发会话（截至 **v1.0.1**，含首次 npm + GitHub 发布 + 用真实品牌 logo 替换占位 SVG）的 DSH 统计为：

| 指标 | 数值 |
|---|---|
| Turns | 21 |
| Steps | 273 |
| LLM 耗时 | 44m49s |
| Tool call | 6m34s |
| TTFT avg | 5.3s |
| 解码速度 | 123 tok/s |
| Cache hit | 99% |
| Input | 32.8M tok |
| Output | 152K tok |

> 以上为该 DSH 会话的累计统计（采用 MiniMax-M3 模型），仅作开发透明度记录，不代表插件运行时的任何 token 消耗——插件本身只是定时调用 MiniMax Coding Plan 配额接口，不产生 LLM token。

---

**订阅 MiniMax Token Plan**（含邀请福利，邀友双赢）：https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link

> 好友订阅享 9 折 + Builder 权益，邀请人得 10% 返利 + 社区特权！