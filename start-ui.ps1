# PegLab local preview. Live public site: https://stp-kas.github.io/peglab-stp/
$Host.UI.RawUI.WindowTitle = "PegLab"
Set-Location $PSScriptRoot

$loopback = "http://127.0.0.1:8765/"
$url = "http://peglab.localhost:8765/"
$busy = $false
try {
  $conn = Get-NetTCPConnection -LocalPort 8765 -State Listen -ErrorAction Stop | Select-Object -First 1
  if ($conn) { $busy = $true }
} catch {}

Start-Process $loopback
if ($busy) {
  Write-Host "Already running. Opened $loopback"
  Write-Host "Public https://stp-kas.github.io/peglab-stp/"
  exit 0
}

Write-Host "Open $loopback"
Write-Host "Also $url if hosts has peglab.localhost"
Write-Host "Public https://stp-kas.github.io/peglab-stp/"
node server/serve.mjs
