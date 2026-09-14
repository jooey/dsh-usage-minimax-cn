# Release Notes

## v1.2.0

**新增：内容超宽时悬停跑马灯滚动，窗口缩放即时生效**

- 读条文本装入「裁剪窗 + 自然宽度轨道」结构：内容超出读条宽度时，鼠标悬停即向左滚动跑马灯，尾部不再被静默截断；完整文本仍以悬停提示（title）兜底
- 滚动范围精确等于溢出量（+8px 余量），图标区域永不遮挡
- 溢出量改用 ResizeObserver 监听裁剪窗：浏览器窗口放大/缩小时跑马灯立即重新武装，不再等 5 秒轮询
- 与家族已有跑马灯的 glm-cn / opencode-go 行为对齐

**English**: hover-to-scroll marquee on overflow (clip window + max-content track, icon never covered, full text still in the tooltip); overflow is re-measured via ResizeObserver on the clip box, so resizing the browser window re-arms the marquee immediately instead of waiting for the 5s poll. Aligned with the glm-cn / opencode-go behavior.

## v1.1.2

**兼容 dsh 0.1.2-alpha.2**

- 客户端 `inject` 显式声明 `remote.session`：新版 Cordis 守卫会把 `directoryFor()` 内部的 session 远端访问归属到插件，不声明则在服务重启后首次创建会话目录时被拒，用量读条全部消失
- 读条宽度计算加 14px 安全边距：新版输入框工具行把 slot 容器改为 `display: contents`，旧的剩余空间算法差几个像素会把整行挤成两行
- `peerDependencies` 的 dsh-* 范围放宽为 `>=`，与实际兼容的 dsh 版本一致

**English**: declare `remote.session` in the client inject (dsh 0.1.2 guard rejects transitive session-remote access, killing all readouts after a restart); add a 14px safety margin to the chip width fit (the new display:contents composer row wrapped to two lines); relax stale peer ranges.


## v1.1.1

**修复：窄窗口下输入框读条覆盖左侧 Full access 下拉框**

- 读条宽度不再使用固定 `max-width` 上限，改为**实测适配**：测量输入框工具行的真实剩余空间（行内宽 − 行间隔 − 左侧工具组 − 右侧模型选择/上下文计量/发送按钮），把读条精确限制在剩余宽度内
- 空间足够时完整显示；空间紧张时平滑截断；剩余不足 80px 时收起为仅图标——任何窗口宽度下都不再向左溢出
- 通过 `ResizeObserver` 监听行与右侧组：窗口缩放、模型切换、发送按钮出现/消失时自动重算（`useLayoutEffect` 首测在绘制前完成，无闪烁）

**English**: chip width is now measured to fit the composer row's actual leftover space instead of a fixed max-width cap — full text when it fits, smooth truncation when tight, icon-only below 80px, so it never overlaps the left "Full access" dropdown at any width; refit is driven by ResizeObserver on the row and the trailing group.

## v1.1.0

**极简 DSH 用量监控 · 统一格式**

- 读条标签 `general` 改为 `coding`（API 内部名 → 用户视角的服务名），读条显示 `coding x% (倒计时) · video x% (倒计时)`
- 与五插件家族（OpenCode Go / DeepSeek / MiniMax / Kimi / GLM）格式统一
- README 重写：中英双语，主打「极简 DSH 用量监控」
- 修复 smoke test（`test/logic.mjs`）引用不存在的导出

**English**: chip label `general` renamed to `coding`; format unified with the five-plugin family; bilingual README rewrite; smoke test export fixes.

## v1.0.0

DSH 插件首发：在对话里查看你的 MiniMax（minimax-cn）Coding Plan 订阅配额。

**功能**

- `/usage-minimax-cn` 命令：完整配额报告（按 model × window 展示 + 重置时间 + 已用/总量/状态码）
  - 支持参数：`[rolling|weekly|monthly]` 窗口过滤、`--json|-j` 输出原始 JSON、`--help|-h` 帮助
- 输入框右下角常驻读条：MiniMax 图标 + 按 `remaining_percent` 排序的 model 用量，每分钟自动刷新
- 读条只在当前会话选中 **MiniMax** provider（`minimax-cn`）时显示，切到其他模型自动隐藏
- 读条可点击，打开 [MiniMax Token Plan 订阅页（邀请福利）](https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link)
- 密钥只在 DSH 主机端解析，不进浏览器；密钥名 `MINIMAX_CN_API_KEY` 与 `dsh-llm-minimax-cn` 共用

**安装**

```bash
cd ~/.dsh/profiles
npm install dsh-usage-minimax-cn --save --registry=https://registry.npmjs.org
```

然后在 `cordis.patch.yml` 里 insert `minimax-cn-usage` 条目（见 README）。