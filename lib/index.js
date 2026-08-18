/**
 * dsh-usage-minimax-cn
 *
 * Human-facing `/usage-minimax-cn` command for the MiniMax (minimax-cn) Coding
 * Plan subscription, plus a browser composer readout (bottom-right tool row)
 * fed by a Typert remote service.
 *
 * The MINIMAX_CN_API_KEY credential is resolved through the harness credentials
 * seam on the HOST (kept server-side; never inlined into the browser), the
 * official Coding Plan quota endpoint `GET https://api.minimaxi.com/v1/coding_plan/remains`
 * is queried, and the rolling / weekly / monthly usage percentages are
 * rendered inline. The composer readout only renders while the selected model
 * provider is `minimax-cn` (the provider id registered by dsh-llm-minimax-cn).
 */

import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import {
  API_KEY_REF,
  INVITATION_URL,
  PLATFORM_URL,
  USAGE_HELP,
  fetchUsage,
  formatPercent,
  formatUsageAsJson,
  formatUsages,
  fetchUsageSnapshot,
  parseUsageArgs
} from "./logic.js";

const name = "dsh-usage-minimax-cn";
const inject = ["commands", "credentials"];

/**
 * Host-side remote service exposing the latest usage snapshot to the browser.
 *
 * Mounted as a Typert remote service; the `./typert` manifest registers the
 * `minimaxUsage/snapshot` endpoint, and the client mounts it via `ctx.remote`.
 */
class MiniMaxUsageGateway extends TypertRemoteService {
  static inject = ["credentials"];

  constructor(ctx) {
    super(ctx, "minimaxUsage");
  }

  /** Latest normalized usage snapshot; throws on credential/network/API failure. */
  async snapshot() {
    return fetchUsageSnapshot(this.ctx.credentials);
  }
}

/** Render the final message body for the `/usage-minimax-cn` slash command. */
function buildUsageMessage(usage, opts) {
  const title = `MiniMax (minimax-cn) Coding Plan usage${opts.window ? ` — ${opts.window}` : ""}${opts.asJson ? " (json)" : ""}`;
  const body = opts.asJson ? formatUsageAsJson(usage, opts.window) : formatUsages(usage, opts.window);
  return `${title}\n\n${body}\n\nMiniMax platform: ${PLATFORM_URL}\nGet MiniMax Token Plan (invite bonus): ${INVITATION_URL}`;
}

/** Register the `/usage-minimax-cn` command and mount the browser remote gateway. */
async function apply(ctx) {
  await ctx.plugin(MiniMaxUsageGateway);
  ctx.commands.register({
    name: "usage-minimax-cn",
    description: "Show MiniMax (minimax-cn) Coding Plan subscription quota usage (accepts: [rolling|weekly|monthly] [--json] [--help])",
    handler: async (rawArgs) => {
      // Defensive: DSH surfaces pass the trailing text in different shapes
      // (string / object / array); `parseUsageArgs` normalises every shape.
      const opts = parseUsageArgs(rawArgs);
      if (opts.wantHelp) {
        return { kind: "success", text: USAGE_HELP };
      }
      try {
        const result = await fetchUsage(ctx);
        if (!result.ok) return { kind: "error", text: `MiniMax usage: ${result.error}` };
        return { kind: "success", text: buildUsageMessage(result.usage, opts) };
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        return { kind: "error", text: `MiniMax usage failed: ${detail}` };
      }
    }
  });
}

// fetchUsage / formatUsages / fetchUsageSnapshot / parseUsageArgs are
// re-exported for standalone smoke tests; the loader only consumes the Cordis
// plugin contract ({ name, inject, apply }).
export {
  apply,
  inject,
  name,
  fetchUsage,
  formatPercent,
  formatUsages,
  formatUsageAsJson,
  fetchUsageSnapshot,
  parseUsageArgs,
  USAGE_HELP,
  MiniMaxUsageGateway,
  API_KEY_REF
};