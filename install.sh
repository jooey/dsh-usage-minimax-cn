#!/usr/bin/env bash
# Installs the dsh-usage-minimax-cn plugin into the DSH profile.
#
# Equivalent to install.ps1, but for POSIX shells (WSL / Linux / macOS).
# Usage:
#   ./install.sh                  # install into the default `web` profile
#   ./install.sh --profile xxx    # install into a different profile
#
# What it does:
#   1. Copy this directory's lib/ + package.json into
#      $HOME/.dsh/profiles/node_modules/dsh-usage-minimax-cn/
#   2. Idempotently append the plugin's cordis.patch.yml entry into
#      $HOME/.dsh/profiles/<profile>/cordis.patch.yml
set -euo pipefail

# --- args --------------------------------------------------------------------
PROFILE="web"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile|-p)
      PROFILE="${2:-web}"
      shift 2
      ;;
    --help|-h)
      sed -n '2,12p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

# --- paths -------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR"
DEST="$HOME/.dsh/profiles/node_modules/dsh-usage-minimax-cn"
PATCH="$HOME/.dsh/profiles/${PROFILE}/cordis.patch.yml"

if [[ ! -f "$SRC/lib/index.js" ]]; then
  echo "Plugin source not found at $SRC (missing lib/index.js)" >&2
  exit 1
fi

# --- 1. copy the package into the profile module fallback --------------------
if [[ -d "$DEST" ]]; then rm -rf "$DEST"; fi
mkdir -p "$DEST/lib"
cp "$SRC/package.json"                 "$DEST/package.json"
cp "$SRC/lib/index.js"                 "$DEST/lib/index.js"
cp "$SRC/lib/logic.js"                 "$DEST/lib/logic.js"
cp "$SRC/lib/client.js"                "$DEST/lib/client.js"
cp "$SRC/lib/typert.host.js"           "$DEST/lib/typert.host.js"
cp "$SRC/lib/typert.remote-client.js"  "$DEST/lib/typert.remote-client.js"
cp "$SRC/lib/index.d.ts"               "$DEST/lib/index.d.ts"
echo "Installed plugin => $DEST"

# --- 2. register it in the profile patch layer (idempotent) ------------------
mkdir -p "$(dirname "$PATCH")"
touch "$PATCH"

if grep -q "minimax-cn-usage" "$PATCH"; then
  echo "Plugin already registered in $PATCH"
else
  cat >> "$PATCH" <<'EOF'

# dsh-usage-minimax-cn: /usage-minimax-cn command + composer readout for the MiniMax Coding Plan quota.
- insert:
    - id: minimax-cn-usage
      name: 'dsh-usage-minimax-cn'
EOF
  echo "Registered plugin in $PATCH"
fi

echo "Done. Restart the DSH web app. Select a MiniMax (minimax-cn) model to see the composer readout; /usage-minimax-cn prints the full Coding Plan quota report."