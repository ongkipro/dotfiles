# win-debloat.ps1 — Windows + WSL optimization for dev workstation
# Run as Administrator:
#   powershell -ExecutionPolicy Bypass -File C:\Users\Asus\win-debloat.ps1
#
# Optimizations:
#   1. Power plan -> Ultimate Performance
#   2. Disable hibernation (frees hiberfil.sys)
#   3. Visual effects -> Best Performance
#   4. Disable services (SysMain, DiagTrack, Xbox, Maps, etc.)
#   5. Disable startup apps (OneDrive, Edge update)
#   6. Disable ads/tips/suggestions
#   7. Defender exclusions for WSL + dev paths
#   8. Search indexing off on WSL paths
#   9. Telemetry minimum + Cortana off
#   10. Cleanup temp + prefetch + Windows Update cache
#   11. Fast Startup on
#   12. SSD TRIM
#
# Rollback commands at end of file.

#Requires -RunAsAdministrator
param(
    [switch]$SkipDefender,
    [switch]$SkipServices,
    [switch]$SkipStartup,
    [switch]$SkipAds,
    [switch]$SkipCleanup,
    [switch]$DryRun
)

$logFile = "$env:USERPROFILE\win-debloat-$(Get-Date -Format yyyyMMdd-HHmmss).log"

function Log($msg, $color = 'White') {
    $line = "[$((Get-Date).ToString('HH:mm:ss'))] $msg"
    Write-Host $line -ForegroundColor $color
    Add-Content -Path $logFile -Value $line
}

function Apply($desc, $action) {
    if ($DryRun) { Log "[DRY] $desc" 'Yellow'; return }
    try {
        & $action 2>&1 | Out-Null
        Log "OK   $desc" 'Green'
    } catch {
        Log "FAIL $desc - $_" 'Red'
    }
}

Log '=== Windows Debloat Started ===' 'Cyan'
Log "Log: $logFile" 'Gray'

# ===== 1. Power plan =====
Log "`n[1] Power plan" 'Cyan'
Apply 'Enable Ultimate Performance' {
    powercfg /duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 | Out-Null
    powercfg /setactive e9a42b02-d5df-448d-aa00-03f14749eb61
}

# ===== 2. Hibernation =====
Log "`n[2] Hibernation" 'Cyan'
Apply 'Disable hibernation' { powercfg /hibernate off }

# ===== 3. Visual effects =====
Log "`n[3] Visual effects" 'Cyan'
Apply 'Visual effects -> Best Performance' {
    Set-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects' -Name 'VisualFXSetting' -Value 2 -ErrorAction SilentlyContinue
    Set-ItemProperty 'HKCU:\Control Panel\Desktop' -Name 'UserPreferencesMask' -Value 0x90120080 -Type DWord -ErrorAction SilentlyContinue
    Set-ItemProperty 'HKCU:\Control Panel\Desktop\WindowMetrics' -Name 'MinAnimate' -Value '0' -ErrorAction SilentlyContinue
}

# ===== 4. Services =====
if (-not $SkipServices) {
    Log "`n[4] Services" 'Cyan'
    $services = 'SysMain','DiagTrack','dmwappushservice','MapsBroker','lfsvc','RetailDemo','TrkWks','XblAuthManager','XblGameSave','XboxGipSvc','XboxNetApiSvc'
    foreach ($s in $services) {
    Apply "Disable service: $s" {
            Stop-Service -Name $s -Force -ErrorAction SilentlyContinue
            Set-Service -Name $s -StartupType Disabled -ErrorAction SilentlyContinue
        }
    }
}

# ===== 5. Startup =====
if (-not $SkipStartup) {
    Log "`n[5] Startup apps" 'Cyan'
    $startupPaths = @(
        'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run',
        'HKLM:\Software\Microsoft\Windows\CurrentVersion\Run'
    )
    $patterns = 'OneDrive','EdgeUpdate','Spotify','Discord','Skype','Teams','WhatsApp'
    foreach ($p in $startupPaths) {
        if (-not (Test-Path $p)) { continue }
        $items = Get-ItemProperty -Path $p -ErrorAction SilentlyContinue
        foreach ($prop in $items.PSObject.Properties) {
            if ($prop.Name -match '^PS') { continue }
            foreach ($pat in $patterns) {
                if ($prop.Name -match $pat) {
    Apply "Disable startup: $($prop.Name)" {
                        Remove-ItemProperty -Path $p -Name $prop.Name -ErrorAction SilentlyContinue
                    }
                    break
                }
            }
        }
    }
}

# ===== 6. Ads / Tips =====
if (-not $SkipAds) {
    Log "`n[6] Ads / Tips / Suggestions" 'Cyan'
    $ads = @(
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager'; N='SystemPaneSuggestionsEnabled'; V=0 },
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager'; N='SilentInstalledAppsEnabled'; V=0 },
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager'; N='SoftLandingEnabled'; V=0 },
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager'; N='SubscribedContent-338389Enabled'; V=0 },
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager'; N='SubscribedContent-338393Enabled'; V=0 },
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager'; N='SubscribedContent-353698Enabled'; V=0 },
        @{ P='HKLM:\SOFTWARE\Policies\Microsoft\Windows\CloudContent'; N='DisableWindowsConsumerFeatures'; V=1 },
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced'; N='ShowTaskViewButton'; V=0 },
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced'; N='ShowCortanaButton'; V=0 },
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\Search'; N='BingSearchEnabled'; V=0 },
        @{ P='HKCU:\Software\Microsoft\Windows\CurrentVersion\Search'; N='CortanaConsent'; V=0 }
    )
    foreach ($r in $ads) {
    Apply "Disable $($r.N)" {
            if (-not (Test-Path $r.P)) { New-Item -Path $r.P -Force | Out-Null }
            Set-ItemProperty -Path $r.P -Name $r.N -Value $r.V -Type DWord
        }
    }
}

# ===== 7. Defender exclusions =====
if (-not $SkipDefender) {
    Log "`n[7] Defender exclusions" 'Cyan'
    $paths = @(
        "$env:LOCALAPPDATA\Packages\*\LocalState\ext4.vhdx",
        'D:\wsl-swap.vhdx',
        "$env:USERPROFILE\.cargo",
        "$env:USERPROFILE\.rustup",
        "$env:USERPROFILE\.nuget",
        "$env:USERPROFILE\.npm",
        "$env:USERPROFILE\.next",
        "$env:USERPROFILE\go",
        'C:\Program Files\Go',
        'C:\Program Files\nodejs'
    )
    foreach ($path in $paths) {
        if ($path -notmatch '\*' -and -not (Test-Path $path)) { continue }
    Apply "Defender exclude path: $path" {
            Add-MpPreference -ExclusionPath $path -ErrorAction SilentlyContinue
        }
    }
    foreach ($proc in 'node.exe','npm.cmd','pnpm.cmd','cargo.exe','rustc.exe','go.exe') {
    Apply "Defender exclude process: $proc" {
            Add-MpPreference -ExclusionProcess $proc -ErrorAction SilentlyContinue
        }
    }
}

# ===== 8. Search indexing =====
Log "`n[8] Search indexing" 'Cyan'
Apply 'Disable Windows Search service' {
    Stop-Service -Name WSearch -Force -ErrorAction SilentlyContinue
    Set-Service -Name WSearch -StartupType Disabled -ErrorAction SilentlyContinue
}

# ===== 9. Telemetry + Cortana =====
Log "`n[9] Telemetry + Cortana" 'Cyan'
Apply 'Telemetry -> minimum' {
    if (-not (Test-Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection')) {
        New-Item -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' -Force | Out-Null
    }
    Set-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord
}
Apply 'Disable Cortana' {
    if (-not (Test-Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search')) {
        New-Item -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search' -Force | Out-Null
    }
    Set-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search' -Name 'AllowCortana' -Value 0 -Type DWord
}

# ===== 10. Cleanup =====
if (-not $SkipCleanup) {
    Log "`n[10] Cleanup" 'Cyan'
    Apply 'Clean temp + Recycle.Bin' {
        Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item 'C:\Windows\Temp\*' -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item 'C:\$Recycle.Bin\*' -Recurse -Force -ErrorAction SilentlyContinue
    }
    Apply 'Clean Prefetch' {
        Remove-Item 'C:\Windows\Prefetch\*' -Force -ErrorAction SilentlyContinue
    }
    Apply 'Clean Windows Update cache' {
        Stop-Service -Name wuauserv -Force -ErrorAction SilentlyContinue
        Remove-Item 'C:\Windows\SoftwareDistribution\Download\*' -Recurse -Force -ErrorAction SilentlyContinue
        Start-Service -Name wuauserv -ErrorAction SilentlyContinue
    }
}

# ===== 11. Fast Startup =====
Log "`n[11] Fast Startup" 'Cyan'
Apply 'Enable Fast Startup' {
    Set-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -Name 'HiberbootEnabled' -Value 1 -Type DWord
}

# ===== 12. SSD TRIM =====
Log "`n[12] SSD TRIM" 'Cyan'
Apply 'TRIM C:' { Optimize-Volume -DriveLetter C -ReTrim -ErrorAction SilentlyContinue }
Apply 'TRIM D:' { Optimize-Volume -DriveLetter D -ReTrim -ErrorAction SilentlyContinue }

# ===== Summary =====
Log "`n=== Done ===" 'Cyan'
Log "Log saved to: $logFile" 'Gray'
Log '' 'Yellow'
Log 'NEXT STEPS:' 'Yellow'
Log '  1. Reboot Windows to apply all changes' 'Yellow'
Log '  2. Run as admin in PowerShell: wsl --shutdown' 'Yellow'
Log '  3. Reopen Ubuntu, then run: wsl-info' 'Yellow'
Log '  4. (Optional) sudo ~/.local/bin/wsl-sudo-setup for inotify boost' 'Yellow'
Log '  5. Verify .wslconfig applied: wsl-info shows 4GB' 'Yellow'

<#
ROLLBACK:

Power:        powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e
Hibernate:    powercfg /hibernate on
SysMain:      Set-Service SysMain -StartupType Automatic; Start-Service SysMain
Telemetry:    Set-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 1 -Type DWord
Cortana:      Set-ItemProperty 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search' -Name 'AllowCortana' -Value 1 -Type DWord
Search:       Set-Service WSearch -StartupType Automatic; Start-Service WSearch
Fast Startup: Set-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -Name 'HiberbootEnabled' -Value 0 -Type DWord
Defender:     Remove-MpPreference -ExclusionPath <path>
#>