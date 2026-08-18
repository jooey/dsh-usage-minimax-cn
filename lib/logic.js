/**
 * Dependency-free core logic for dsh-usage-minimax-cn.
 *
 * The MiniMax (minimax) Coding Plan reports per-model quota across
 * `current_interval` (≈ rolling), `current_weekly`, and `current_monthly`
 * windows. The endpoint returns:
 *
 *   {
 *     base_resp: { status_code, status_msg },
 *     model_remains: [
 *       {
 *         model_name: "general",
 *         start_time, end_time, remains_time,            // rolling window
 *         current_interval_total_count, _usage_count,
 *         current_interval_status, current_interval_remaining_percent,
 *         weekly_start_time, weekly_end_time, weekly_remains_time,
 *         current_weekly_total_count, _usage_count,
 *         current_weekly_status, current_weekly_remaining_percent,
 *         // (monthly_* fields appear on accounts with monthly quotas)
 *       },
 *       ...
 *     ]
 *   }
 *
 * The API reports `remaining_percent` (what's LEFT); we surface both
 * `remaining_percent` and the derived `used_percent` (100 - remaining).
 *
 * Everything here resolves only against Web/Node platform globals (fetch,
 * AbortSignal), so it can be imported from plain Node tooling and smoke tests
 * without the DSH packages.
 */

/** Official MiniMax Coding Plan quota endpoint. */
export const USAGE_URL = "https://api.minimaxi.com/v1/coding_plan/remains";
/** MiniMax developer platform landing page (the readout's click target). */
export const PLATFORM_URL = "https://platform.minimaxi.com/user-center/payment/coding-plan";
/** MiniMax Token Plan subscription invitation link (with referral bonus). */
export const INVITATION_URL = "https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link";
/** Credential reference resolved through the harness credentials seam.
 *  Matches the key name already used by `dsh-llm-minimax-cn`, so users who
 *  have the LLM provider configured don't have to add anything new. */
export const API_KEY_REF = "MINIMAX_CN_API_KEY";
/** Hard network ceiling so an unresponsive endpoint cannot hang a turn. */
export const TIMEOUT_MS = 20000;

/** Canonical window ids exposed to callers. */
export const WINDOW_IDS = ["rolling", "weekly", "monthly"];
/** Human labels for the canonical window ids. */
export const WINDOW_LABELS = {
  rolling: "Rolling",
  weekly: "Weekly",
  monthly: "Monthly"
};

/** Map canonical window -> API field prefix used for time fields. */
const TIME_KEY_MAP = {
  rolling: "",
  weekly: "weekly_",
  monthly: "monthly_"
};
/** Map canonical window -> API field prefix used for count/percent/status. */
const METER_KEY_MAP = {
  rolling: "current_interval",
  weekly: "current_weekly",
  monthly: "current_monthly"
};

/**
 * Resolve the MiniMax API base URL. The official China base URL is the
 * default; `MINIMAX_BASE_URL` (the same environment variable honoured by
 * `dsh-llm-minimax-cn`) overrides it for gateways/proxies.
 */
export function resolveBaseUrl() {
  const env = globalThis.process?.env?.MINIMAX_BASE_URL;
  if (typeof env === "string" && env.length > 0) return env.replace(/\/+$/, "");
  return "https://api.minimaxi.com";
}

/** Build the absolute quota endpoint URL for the current base URL. */
export function resolveUsageUrl() {
  return `${resolveBaseUrl()}/v1/coding_plan/remains`;
}

/** Render one numeric percent as a percent string, tolerating absence. */
export function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "n/a";
  return `${n.toFixed(1)}%`;
}

/** Convert a Unix-millisecond epoch to ISO 8601; null when input is bad. */
export function epochMsToIso(ms) {
  const t = Number(ms);
  if (!Number.isFinite(t) || t <= 0) return null;
  return new Date(t).toISOString();
}

/** Format a "remains in Xd Yh Ym" string from the API's millisecond count.
 *  The Coding Plan endpoint reports `remains_time` / `weekly_remains_time` /
 *  `monthly_remains_time` in **milliseconds** (despite the `time` suffix); we
 *  convert to seconds before splitting into days/hours/minutes. */
export function formatRemainsRelative(ms) {
  const totalMs = Number(ms);
  if (!Number.isFinite(totalMs) || totalMs <= 0) return null;
  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}

/** Pull the three windows (rolling/weekly/monthly) out of one model record. */
export function pickModelWindows(model) {
  if (!model || typeof model !== "object") return { rolling: null, weekly: null, monthly: null };
  const out = {};
  for (const id of WINDOW_IDS) {
    out[id] = pickOneWindow(model, id);
  }
  return out;
}

/** Pull one specific window's fields out of one model record. */
function pickOneWindow(model, windowId) {
  if (!model || typeof model !== "object") return null;
  const meter = METER_KEY_MAP[windowId];
  const time = TIME_KEY_MAP[windowId];
  if (!meter) return null;
  // The rolling window's time fields are bare (`start_time`); weekly/monthly
  // use a `<window>_` prefix. Look up under the shape the API uses.
  const start = time === "" ? model.start_time : model[`${time}start_time`];
  const end = time === "" ? model.end_time : model[`${time}end_time`];
  const remains = time === "" ? model.remains_time : model[`${time}remains_time`];
  const hasAny =
    model[`${meter}_total_count`] !== undefined ||
    model[`${meter}_usage_count`] !== undefined ||
    model[`${meter}_remaining_percent`] !== undefined ||
    model[`${meter}_status`] !== undefined ||
    start !== undefined || end !== undefined || remains !== undefined;
  if (!hasAny) return null;
  return {
    total_count: model[`${meter}_total_count`],
    usage_count: model[`${meter}_usage_count`],
    status: model[`${meter}_status`],
    remaining_percent: model[`${meter}_remaining_percent`],
    start_time: start,
    end_time: end,
    remains_time: remains
  };
}

/** Normalize one API window entry into the canonical snapshot shape. */
export function normalizeWindow(entry) {
  if (!entry || typeof entry !== "object") return null;
  const total = Number(entry.total_count);
  const usage = Number(entry.usage_count);
  const remainingPct = Number(entry.remaining_percent);
  const status = Number(entry.status);
  const end = Number(entry.end_time);
  const start = Number(entry.start_time);
  const remainsSec = Number(entry.remains_time);
  const percent = Number.isFinite(remainingPct)
    ? Math.max(0, Math.min(100, 100 - remainingPct))
    : null;
  return {
    percent,
    remaining_percent: Number.isFinite(remainingPct) ? remainingPct : null,
    total_count: Number.isFinite(total) ? total : null,
    usage_count: Number.isFinite(usage) ? usage : null,
    status: Number.isFinite(status) ? status : null,
    start_time: Number.isFinite(start) && start > 0 ? start : null,
    reset_at: epochMsToIso(end),
    // The API returns *_remains_time in milliseconds (not seconds).
    remains_ms: Number.isFinite(remainsSec) && remainsSec > 0 ? remainsSec : null
  };
}

/** Iterate `model_remains` and yield per-model normalized records. */
export function* iterateModels(usage) {
  if (!usage || typeof usage !== "object") return;
  const models = Array.isArray(usage.model_remains) ? usage.model_remains : [];
  for (const raw of models) {
    if (!raw || typeof raw !== "object") continue;
    yield {
      name: typeof raw.model_name === "string" && raw.model_name.length > 0 ? raw.model_name : "unknown",
      windows: pickModelWindows(raw)
    };
  }
}

/** Fetch and shape the raw Coding Plan quota payload without formatting it. */
export async function fetchUsage(ctx) {
  // Read the API key exclusively through the DSH harness credentials seam.
  // The seam aggregates ~/.dsh/.credentials.yaml + `process.env.MINIMAX_CN_API_KEY`
  // (and any future source DSH adds); we never read the file or env directly
  // so the plugin stays in lock-step with the rest of the DSH ecosystem.
  const credential = await ctx.credentials.resolve(API_KEY_REF);
  if (!credential || typeof credential.value !== "string" || credential.value.length === 0) {
    return { ok: false, error: `${API_KEY_REF} is not configured. Store it in ~/.dsh/.credentials.yaml or set it as the environment variable \`${API_KEY_REF}\`.` };
  }
  const response = await fetch(resolveUsageUrl(), {
    headers: {
      Authorization: `Bearer ${credential.value}`,
      Accept: "application/json"
    },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  if (!response.ok) {
    return { ok: false, error: `MiniMax Coding Plan API returned HTTP ${response.status}` };
  }
  let body;
  try {
    body = await response.json();
  } catch (error) {
    return { ok: false, error: `MiniMax Coding Plan API returned a non-JSON response: ${error instanceof Error ? error.message : String(error)}` };
  }
  const baseResp = body && typeof body === "object" ? body.base_resp : undefined;
  if (baseResp && typeof baseResp === "object" && Number(baseResp.status_code) !== 0) {
    return {
      ok: false,
      error: `MiniMax Coding Plan API error: ${baseResp.status_msg ?? `status ${baseResp.status_code}`}`
    };
  }
  return { ok: true, usage: body };
}

/** Render the `model_remains` array as a human-readable multi-line report. */
export function formatUsages(usage, windowFilter = null) {
  if (!usage || typeof usage !== "object") return "No usage data returned.";
  const baseResp = usage.base_resp;
  if (baseResp && typeof baseResp === "object" && Number(baseResp.status_code) !== 0) {
    return `API error: ${baseResp.status_msg ?? `status ${baseResp.status_code}`}`;
  }
  const lines = [];
  for (const model of iterateModels(usage)) {
    const ids = windowFilter ? [windowFilter] : WINDOW_IDS;
    for (const id of ids) {
      const win = normalizeWindow(model.windows[id]);
      if (!win) continue;
      // Skip windows that have nothing to report at all.
      if (win.percent === null && win.usage_count === null && win.total_count === null) continue;
      const label = WINDOW_LABELS[id];
      const counts = (win.usage_count !== null && win.total_count !== null)
        ? ` · ${win.usage_count}/${win.total_count}`
        : "";
      const reset = win.remains_ms !== null
        ? ` · resets in ${formatRemainsRelative(win.remains_ms)}`
        : (win.reset_at ? ` · resets ${win.reset_at}` : "");
      const status = win.status !== null ? ` (status ${win.status})` : "";
      lines.push(`[${model.name}] ${label}: ${formatPercent(win.percent)} used${counts}${reset}${status}`);
    }
  }
  return lines.length > 0 ? lines.join("\n") : "No usage data returned.";
}

/** The unfiltered raw API payload, pretty-printed for the `--json` branch. */
export function formatUsageAsJson(usage, windowFilter = null) {
  if (!usage || typeof usage !== "object") return JSON.stringify(usage, null, 2);
  if (!windowFilter) return JSON.stringify(usage, null, 2);
  const out = [];
  for (const model of iterateModels(usage)) {
    const win = normalizeWindow(model.windows[windowFilter]);
    if (!win) continue;
    out.push({ model_name: model.name, ...win });
  }
  return JSON.stringify(out, null, 2);
}

/**
 * Parse the raw argument payload that DSH's `commands.register` handler
 * receives. Different DSH surfaces pass the trailing text in different shapes
 * (a bare string, `{ args }`, `{ text }`, or an array of tokens), so this
 * helper normalises every shape into a flat token array.
 *
 * Recognised tokens:
 *   - `rolling` | `weekly` | `monthly` -> window filter
 *   - `json` | `--json` | `-j`         -> emit the raw payload as JSON
 *   - `help` | `--help` | `-h`         -> request the help text
 */
export function parseUsageArgs(rawArgs) {
  let tokens = [];
  if (typeof rawArgs === "string") {
    tokens = rawArgs.trim().split(/\s+/).filter(Boolean);
  } else if (Array.isArray(rawArgs)) {
    for (const entry of rawArgs) {
      if (typeof entry === "string") tokens.push(...entry.trim().split(/\s+/).filter(Boolean));
    }
  } else if (rawArgs && typeof rawArgs === "object") {
    const candidate = rawArgs.args ?? rawArgs.text ?? rawArgs.input ?? rawArgs.command;
    if (typeof candidate === "string") tokens = candidate.trim().split(/\s+/).filter(Boolean);
  }
  const lowerTokens = tokens.map((token) => token.toLowerCase());
  const windowAliases = { rolling: "rolling", weekly: "weekly", monthly: "monthly" };
  let window = null;
  let asJson = false;
  let wantHelp = false;
  for (const token of lowerTokens) {
    if (token === "json" || token === "--json" || token === "-j") {
      asJson = true;
    } else if (token === "help" || token === "--help" || token === "-h") {
      wantHelp = true;
    } else if (Object.prototype.hasOwnProperty.call(windowAliases, token)) {
      window = windowAliases[token];
    }
  }
  return { window, asJson, wantHelp, tokens };
}

/** Help text rendered when the user passes `help` / `--help` / `-h`. */
export const USAGE_HELP = [
  "Usage: /usage-minimax-cn [window] [--json|-j] [--help|-h]",
  "",
  "Show the MiniMax (minimax-cn) Coding Plan subscription quota usage.",
  "",
  "Arguments:",
  "  rolling | weekly | monthly    Show only the named window",
  "  --json | -j                   Print the raw API payload as JSON",
  "                                 instead of the formatted report.",
  "  --help | -h                   Print this help text.",
  "",
  "With no arguments, prints every model/window with percent used, used/total",
  "counts, time until reset, and quota status code."
].join("\n");

/** Fetch and normalize the usage snapshot, throwing a descriptive error on any failure. */
export async function fetchUsageSnapshot(credentials) {
  // Read the API key exclusively through the DSH harness credentials seam.
  // The browser-side Typert gateway only ever receives the normalized result
  // of this function - the key never leaves the host.
  const credential = await credentials.resolve(API_KEY_REF);
  if (!credential || typeof credential.value !== "string" || credential.value.length === 0) {
    throw new Error(`${API_KEY_REF} is not configured. Store it in ~/.dsh/.credentials.yaml or set it as the environment variable \`${API_KEY_REF}\`.`);
  }
  const response = await fetch(resolveUsageUrl(), {
    headers: {
      Authorization: `Bearer ${credential.value}`,
      Accept: "application/json"
    },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  if (!response.ok) {
    throw new Error(`MiniMax Coding Plan API returned HTTP ${response.status}`);
  }
  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new Error(`MiniMax Coding Plan API returned a non-JSON response: ${error instanceof Error ? error.message : String(error)}`);
  }
  const models = [];
  for (const model of iterateModels(body)) {
    models.push({
      name: model.name,
      rolling: normalizeWindow(model.windows.rolling),
      weekly: normalizeWindow(model.windows.weekly),
      monthly: normalizeWindow(model.windows.monthly)
    });
  }
  return {
    models,
    status: body && typeof body.base_resp === "object"
      ? { code: Number(body.base_resp.status_code) || null, msg: typeof body.base_resp.status_msg === "string" ? body.base_resp.status_msg : null }
      : { code: null, msg: null }
  };
}
