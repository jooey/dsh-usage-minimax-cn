window.__ModuleLoader__.load({
id: "dsh-usage-minimax-cn",
factory: (require) => {
var module = { exports: {} };
var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

let React = require("react");

/* Client-face Typert remote manifest (hand-written, no build step). */
const minimaxUsageSnapshotResult$schema = {
parse(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("expected a minimax usage snapshot object");
  }
  const window = (entry) => {
    if (entry === null || entry === undefined) return null;
    if (typeof entry !== "object") return null;
    return {
      percent: typeof entry.percent === "number" ? entry.percent : null,
      remaining_percent: typeof entry.remaining_percent === "number" ? entry.remaining_percent : null,
      total_count: typeof entry.total_count === "number" ? entry.total_count : null,
      usage_count: typeof entry.usage_count === "number" ? entry.usage_count : null,
      status: typeof entry.status === "number" ? entry.status : null,
      start_time: typeof entry.start_time === "number" ? entry.start_time : null,
      reset_at: typeof entry.reset_at === "string" ? entry.reset_at : null,
      remains_ms: typeof entry.remains_ms === "number" ? entry.remains_ms : null
    };
  };
  const models = Array.isArray(value.models)
    ? value.models
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          name: typeof entry.name === "string" ? entry.name : "unknown",
          rolling: window(entry.rolling),
          weekly: window(entry.weekly),
          monthly: window(entry.monthly)
        }))
    : [];
  const status = value.status && typeof value.status === "object"
    ? {
        code: typeof value.status.code === "number" ? value.status.code : null,
        msg: typeof value.status.msg === "string" ? value.status.msg : null
      }
    : { code: null, msg: null };
  return { models, status };
}
};

/** MiniMax Token Plan subscription invitation link (with referral bonus). */
const INVITATION_URL = "https://platform.minimaxi.com/subscribe/token-plan?code=2vNMQFJrZt&source=link";
/** Provider id registered by dsh-llm-minimax-cn. */
const MINIMAX_CN_PROVIDER = "minimax-cn";

const TYPERT_REMOTE = {
package: "dsh-usage-minimax-cn",
descriptors: [
{
  id: "dsh-usage-minimax-cn#minimaxUsage/snapshot",
  service: "minimaxUsage",
  namespace: "minimaxUsage",
  method: "snapshot",
  invocation: { kind: "direct" },
  parameters: [],
  result: {
  mode: "strict",
  typeSymbol: "dsh-usage-minimax-cn/types#MiniMaxUsageSnapshot",
  schema: minimaxUsageSnapshotResult$schema
  },
  sourceLocation: { file: "lib/index.js", line: 1, column: 1 }
}
]
};

/** Format one percent value for the compact composer readout. */
function formatPercent(value) {
const n = Number(value);
if (!Number.isFinite(n)) return "n/a";
return n.toFixed(1) + "%";
}

/** Format milliseconds into a short "Xd Yh Ym" form for the readout. */
function formatRemainsShort(ms) {
const total = Number(ms);
if (!Number.isFinite(total) || total <= 0) return "n/a";
const totalSec = Math.floor(total / 1000);
const days = Math.floor(totalSec / 86400);
const hours = Math.floor((totalSec % 86400) / 3600);
const minutes = Math.floor((totalSec % 3600) / 60);
const parts = [];
if (days > 0) parts.push(days + "d");
if (hours > 0 || days > 0) parts.push(hours + "h");
parts.push(minutes + "m");
return parts.join(" ");
}

/**
 * Official MiniMax brand mark, fetched from the platform's
 * platform.minimaxi.com/subscribe/token-plan page (its `og:image` social card,
 * upscaled from the 32x32 favicon to 64x64 with Lanczos resampling for crisp
 * 14x14 rendering). Embedding the PNG as a data URL avoids shipping a
 * separate asset file and keeps the plugin a single self-contained npm package.
 */
const MINIMAX_LOGO_SRC = "data:image/png;base64,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";

function MiniMaxIcon(props) {
return React.createElement("img", Object.assign({
src: MINIMAX_LOGO_SRC,
width: 14,
height: 14,
alt: "",
"aria-hidden": true,
draggable: false,
style: { imageRendering: "auto", userSelect: "none" }
}, props));
}

/** Outer gate: never mount the hook-using chip unless a model directory store is available. */
function MiniMaxUsageChip(props) {
if (!props.directory) return null;
return React.createElement(MiniMaxBalanceChip, props);
}

/**
 * Composer bottom-right readout. Mounts only while the session's selected
 * provider is `minimax-cn`; any other provider renders null so the readout
 * disappears. While visible it shows:
 *
 *   [MiniMax mark] general 57.0% (2h 19m) · video 0.0% (6h 19m)
 *
 * with the most-restricted model listed first and a "resets in X" tail per
 * model. Refreshed every 60 seconds, and links to the MiniMax Coding Plan
 * page on click.
 */
function MiniMaxBalanceChip(props) {
const directory = props.directory;
const snapshot = props.snapshot;

const state = React.useSyncExternalStore(
(fn) => directory.subscribe(fn),
() => directory.getSnapshot()
);
const isMiniMaxCn = !!(state && state.current && state.current.provider === MINIMAX_CN_PROVIDER);

const [data, setData] = React.useState(null);
const [failed, setFailed] = React.useState(false);

React.useEffect(() => {
if (!isMiniMaxCn) return;
let alive = true;
const load = async () => {
try {
  const result = await snapshot();
  if (!alive) return;
  if (result && result.ok) {
  setData(result.value);
  setFailed(false);
  } else {
  setData(null);
  setFailed(true);
  }
} catch {
  if (alive) {
  setData(null);
  setFailed(true);
  }
}
};
load();
const timer = setInterval(load, 60000);
return () => {
alive = false;
clearInterval(timer);
};
}, [snapshot, isMiniMaxCn]);

if (!isMiniMaxCn) return null;

const models = data && Array.isArray(data.models) ? data.models : [];
// Sort by remaining % ascending so the most-restricted model is shown first.
const visible = models
.map((model) => {
const win = model.rolling || model.weekly || model.monthly;
if (!win) return null;
return { model, win };
})
.filter((entry) => entry !== null)
.sort((a, b) => {
const ra = a.win.remaining_percent ?? 100;
const rb = b.win.remaining_percent ?? 100;
return ra - rb;
});

const summary = (entry, idx) => {
const { model, win } = entry;
const rem = win.remaining_percent !== null ? formatPercent(100 - win.remaining_percent) : (failed ? "n/a" : "...");
const tail = win.remains_ms !== null ? formatRemainsShort(win.remains_ms) : null;
// The API reports the coding-plan model as "general"; display it as "coding"
// so the chip reads "coding 61.0%" instead of the opaque internal name.
const label = model.name === "general" ? "coding" : model.name;
return React.createElement("span", {
  key: model.name + "-" + idx,
  style: { whiteSpace: "nowrap" }
}, label, " ", rem, tail ? " (" + tail + ")" : "");
};

return React.createElement(
"a",
{
href: INVITATION_URL,
target: "_blank",
rel: "noreferrer noopener",
title: failed ? "MiniMax Coding Plan usage unavailable" : "MiniMax (minimax-cn) Coding Plan usage · 🎁 get MiniMax Token Plan (invite bonus)",
style: {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  height: "100%",
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: 1,
  color: "var(--dsw-alias-label-tertiary)",
  textDecoration: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  maxWidth: "420px",
  overflow: "hidden"
}
},
React.createElement(MiniMaxIcon, {
style: { flex: "none", color: "var(--dsw-alias-label-tertiary)" }
}),
visible.length > 0
? visible.map(summary).reduce((acc, el, idx) => {
    if (idx === 0) return [el];
    return acc.concat(
      React.createElement("span", { key: "sep-" + idx, style: { opacity: 0.4 } }, " · "),
      el
    );
  }, [])
: React.createElement("span", {
  key: "loading",
  style: { opacity: 0.6 }
}, failed ? "usage n/a" : "loading…")
);
}

/**
 * Client body: mount the remote capability, then register the composer readout
 * through a scoped injection that exposes the session's model directory so the
 * chip can subscribe to the currently selected provider and hide itself for
 * non-MiniMax models.
 */
async function apply(ctx) {
await ctx.remote.$mount(TYPERT_REMOTE);
// ctx.get() reads the mounted namespace service without requiring a declared
// inject edge, which would deadlock a self-mounting plugin.
const minimaxUsage = ctx.get("remote.minimaxUsage");

ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
name: "conversation.input.right",
id: "minimax-cn-usage",
order: 0,
inject: (sessionId) => {
let directory = null;
try {
  directory = ctx.modelDirectories.directoryFor(sessionId).store;
} catch {
  directory = null;
}
return {
  directory,
  snapshot: () => minimaxUsage.snapshot()
};
}
}, MiniMaxUsageChip));
}

const inject = ["slots", "remote", "modelDirectories"];

exports.apply = apply;
exports.inject = inject;
return module.exports;
}
});
