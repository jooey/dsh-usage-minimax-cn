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
 * Small MiniMax glyph drawn inline so it follows the active theme.
 *
 * The shape is a stylized "M" with rounded corners, echoing MiniMax's
 * rounded-square brand mark while remaining recognizable at 14x14. It is
 * drawn entirely with `currentColor` so the icon inherits the surrounding
 * text color and adapts to dark/light themes automatically.
 */
function MiniMaxIcon(props) {
return React.createElement("svg", Object.assign({
width: 14,
height: 14,
viewBox: "0 0 24 24",
"aria-hidden": true,
focusable: false,
fill: "none"
}, props), [
React.createElement("rect", {
key: "frame",
x: 2, y: 2, width: 20, height: 20, rx: 5, ry: 5,
fill: "currentColor",
opacity: 0.18
}),
React.createElement("path", {
key: "m-shape",
d: "M6.5 16.5V8.5L9 8.5L12 13L15 8.5H17.5V16.5",
stroke: "currentColor",
strokeWidth: 1.6,
strokeLinecap: "round",
strokeLinejoin: "round",
fill: "none"
})
]);
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
return React.createElement("span", {
  key: model.name + "-" + idx,
  style: { whiteSpace: "nowrap" }
}, model.name, " ", rem, tail ? " (" + tail + ")" : "");
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
