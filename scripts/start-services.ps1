param(
    [switch]$UseNpmDev
)

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$serverDir = Join-Path $projectRoot 'server'
$stdoutPath = Join-Path $projectRoot 'server-stdout.log'
$stderrPath = Join-Path $projectRoot 'server-stderr.log'
$cloudflaredLogPath = Join-Path $projectRoot 'cloudflared.log'
$pidFile = Join-Path $PSScriptRoot 'runtime-pids.json'

if (Test-Path $stdoutPath) { Remove-Item $stdoutPath -Force }
if (Test-Path $stderrPath) { Remove-Item $stderrPath -Force }

$backendProcess = if ($UseNpmDev) {
    Start-Process -FilePath 'npm.cmd' `
        -ArgumentList 'run','dev' `
        -WorkingDirectory $serverDir `
        -RedirectStandardOutput $stdoutPath `
        -RedirectStandardError $stderrPath `
        -WindowStyle Hidden `
        -PassThru
} else {
    $nodeExecutable = 'node'
    if (Test-Path 'C:\Program Files\nodejs\node.exe') {
        $nodeExecutable = 'C:\Program Files\nodejs\node.exe'
    }
    Start-Process -FilePath $nodeExecutable `
        -ArgumentList 'index.js' `
        -WorkingDirectory $serverDir `
        -RedirectStandardOutput $stdoutPath `
        -RedirectStandardError $stderrPath `
        -WindowStyle Hidden `
        -PassThru
}

$cloudArgs = @(
    'tunnel'
    '--url', 'http://localhost:3001'
    '--logfile', $cloudflaredLogPath
    '--no-autoupdate'
)

$cloudflaredProcess = Start-Process -FilePath 'cloudflared' `
    -ArgumentList $cloudArgs `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -PassThru

$pidInfo = [ordered]@{
    backendPid     = $backendProcess.Id
    backendCommand = if ($UseNpmDev) { 'npm run dev' } else { 'node index.js' }
    cloudflaredPid = $cloudflaredProcess.Id
    startedAt      = (Get-Date).ToString('o')
}

$pidInfo | ConvertTo-Json | Set-Content -Path $pidFile

Write-Host "Backend started (PID $($backendProcess.Id)) using $($pidInfo.backendCommand)." -ForegroundColor Green
Write-Host "Cloudflare tunnel started (PID $($cloudflaredProcess.Id)). Check $cloudflaredLogPath for the hostname." -ForegroundColor Green
Write-Host "PID metadata stored at $pidFile" -ForegroundColor DarkGray
