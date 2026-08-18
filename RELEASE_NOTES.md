# Release Notes

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