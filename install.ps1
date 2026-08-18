# Installs the dsh-usage-minimax-cn plugin into the DSH web profile.
param(
  [string]$Profile = "web"
)
$ErrorActionPreference = "Stop"
$src = $PSScriptRoot
$modulesDir = Join-Path $env:USERPROFILE ".dsh\profiles\node_modules"
$dest = Join-Path $modulesDir "dsh-usage-minimax-cn"
$patchPath = Join-Path $env:USERPROFILE ".dsh\profiles\$Profile\cordis.patch.yml"

if (-not (Test-Path (Join-Path $src "lib\index.js"))) {
  throw "Plugin source not found at $src"
}

# 1. copy the package into the profile module fallback
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path (Join-Path $dest "lib") -Force | Out-Null
Copy-Item (Join-Path $src "package.json") (Join-Path $dest "package.json") -Force
Copy-Item (Join-Path $src "lib\index.js") (Join-Path $dest "lib\index.js") -Force
Copy-Item (Join-Path $src "lib\logic.js") (Join-Path $dest "lib\logic.js") -Force
Copy-Item (Join-Path $src "lib\client.js") (Join-Path $dest "lib\client.js") -Force
Copy-Item (Join-Path $src "lib\typert.host.js") (Join-Path $dest "lib\typert.host.js") -Force
Copy-Item (Join-Path $src "lib\typert.remote-client.js") (Join-Path $dest "lib\typert.remote-client.js") -Force
Copy-Item (Join-Path $src "lib\index.d.ts") (Join-Path $dest "lib\index.d.ts") -Force
Write-Host "Installed plugin => $dest"

# 2. register it in the profile patch layer (idempotent)
$insert = @"
# dsh-usage-minimax-cn: /usage-minimax-cn command + composer readout for the MiniMax Coding Plan quota.
- insert:
    - id: minimax-cn-usage
      name: 'dsh-usage-minimax-cn'
"@
$text = Get-Content $patchPath -Raw -ErrorAction SilentlyContinue
if ($null -eq $text) { $text = "" }
if ($text -notmatch "minimax-cn-usage") {
  Add-Content -Path $patchPath -Value $insert
  Write-Host "Registered plugin in $patchPath"
} else {
  Write-Host "Plugin already registered in $patchPath"
}
Write-Host "Done. Restart the DSH web app. Select a MiniMax (minimax-cn) model to see the composer readout; /usage-minimax-cn prints the full Coding Plan quota report."