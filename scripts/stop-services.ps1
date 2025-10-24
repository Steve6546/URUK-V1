$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$pidFile = Join-Path $PSScriptRoot 'runtime-pids.json'

if (Test-Path $pidFile) {
    $pidInfo = Get-Content $pidFile | ConvertFrom-Json
} else {
    $pidInfo = $null
}

function Stop-IfRunning {
    param(
        [int]$Pid,
        [string]$Name
    )

    if (-not $Pid) {
        return
    }

    try {
        Stop-Process -Id $Pid -Force -ErrorAction Stop
        Write-Host "Stopped $Name (PID $Pid)." -ForegroundColor Yellow
    } catch {
        Write-Host "Unable to stop $Name (PID $Pid): $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
}

if ($pidInfo) {
    Stop-IfRunning -Pid $pidInfo.backendPid -Name 'backend server'
    Stop-IfRunning -Pid $pidInfo.cloudflaredPid -Name 'cloudflared'
    Remove-Item $pidFile -Force
} else {
    Write-Host 'No runtime PID file found. Attempting graceful stop by process name...' -ForegroundColor DarkYellow
    Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-IfRunning -Pid $_.Id -Name 'node'
    }
    Get-Process cloudflared -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-IfRunning -Pid $_.Id -Name 'cloudflared'
    }
}
