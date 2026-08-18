# dsh-usage-minimax-cn

DSH plugin: shows your MiniMax (minimax-cn) Coding Plan quota in the chat and in the composer readout. Only renders while the session's provider is `minimax-cn`.

[![npm](https://img.shields.io/npm/v/dsh-usage-minimax-cn)](https://www.npmjs.com/package/dsh-usage-minimax-cn)
[![GitHub](https://img.shields.io/github/license/jooey/dsh-usage-minimax-cn)](https://github.com/jooey/dsh-usage-minimax-cn)

## Install

```bash
dsh plugin --profile web add dsh-usage-minimax-cn
```

Then refresh the DSH web GUI (`Ctrl+Shift+R`) and select a model under the **MiniMax (minimax-cn)** provider.

The plugin reads `MINIMAX_CN_API_KEY` from the DSH harness credentials seam — the same key you already configured for `dsh-llm-minimax-cn`. No extra setup needed.

## Usage

### `/usage-minimax-cn` slash command

```text
Usage: /usage-minimax-cn [rolling|weekly|monthly] [--json|-j] [--help|-h]
```

With no arguments, prints every model's quota (rolling / weekly / monthly windows with percent used, used/total counts, and time until reset). `weekly` / `monthly` / `json` filter or change the output; `--help` prints usage.

### Composer readout

When the selected model is on `minimax-cn`, a small chip appears in the bottom-right of the input box showing per-model remaining-percent and time until reset. Refreshes every 60 seconds.

## License

MIT
