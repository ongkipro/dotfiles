# Device OMP Overlay — ongkis-MacBook-Air

> **Status:** Backup/reference only. Disk is authoritative.
> This records the intended device-local MiniMax + OpenCode Go overlay without
> replacing the shared routing configuration on other machines.

The Mac can use a device-local overlay when its provider accounts offer a better
capacity pool than the shared default. Availability, quota, and login state are
runtime facts; verify them on the Mac instead of trusting this backup.

## Runtime contract

The canonical `omp()` wrapper in `config/shell-tools.sh` checks for a
device-local, non-secret configuration file at:
`~/.config/ai-local/omp-overlay.yml`

When present, normal sessions receive it through `--config`. Administrative
subcommands such as `omp models` and `omp agents` deliberately bypass it. Keep
credentials in runtime auth or approved machine-local credential storage, never
inside the YAML or this memory file.

## Reference overlay

After restoring this reference, validate every selector against the Mac model
catalog and run a live smoke test before relying on it.

```yaml
# Device-local OMP overlay (ongkis-MacBook-Air)
# Purpose: use native MiniMax and OpenCode Go capacity on this device

modelRoles:
  # Fast, low-cost lane
  tiny: minimax-code/MiniMax-M2.5-lightning:low
  smol: minimax-code/MiniMax-M2.7-highspeed:medium

  # Primary development lane
  default: minimax-code/MiniMax-M3:medium
  task: minimax-code/MiniMax-M3:medium
  plan: minimax-code/MiniMax-M3:high
  
  # Precision lane
  slow: minimax-code/MiniMax-M3:high

  # Visual lane
  vision: minimax-code/MiniMax-M3:high
  designer: minimax-code/MiniMax-M3:high

  # Research and discovery lanes
  research: minimax-code/MiniMax-M3:high
  discovery: minimax-code/MiniMax-M3:high
  
  # Independent judgment lanes
  advisor: minimax-code/MiniMax-M3:high
  
  # Reserve OpenCode Go for the highest reasoning tiers
  advisor-xhigh: opencode-go/deepseek-v4-pro:xhigh
  advisor-max: opencode-go/deepseek-v4-pro:max

modelProviderOrder:
  - minimax-code
  - opencode-go
  - openai-codex
  - anthropic

cycleOrder:
  - smol
  - default
  - slow
```

Do not record credential values or assume a particular credential file here.
Use each provider's supported runtime authentication and verify it locally.
