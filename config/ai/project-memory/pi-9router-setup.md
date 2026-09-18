---
name: pi-9router-setup
description: Durable Pi + 9router operating invariants; live endpoints, credentials, provider accounts, and model availability remain device-local.
metadata:
  node_type: memory
  type: project
---

# Pi + 9router durable reference

Pi may use the locally installed 9router service as one routing option, but **live runtime state is never owned by this file**. Before changing routing, inspect the device-local Pi/9router configuration and the runtime's current model/provider registry.

## Public-safe boundary

Never store these in tracked memory:

- tunnel URLs or tunnel identifiers;
- API keys or key fragments;
- dashboard passwords, auth cookies, or sessions;
- provider account identities;
- live quota/credit/billing state;
- currently enabled providers/models when that state can change.

Those facts belong under `~/.config/ai-local/` or the runtime's native private configuration.

## Service ownership

Use the device's managed service path for 9router when one exists. Do not start a second tray/background instance beside a managed service. If duplicate listeners/processes recur, inspect user systemd plus XDG/autostart sources before blaming a manual command.

## Configuration ownership

- Pi runtime configuration stays in Pi's native user config.
- 9router credentials and private endpoint values stay outside dotfiles.
- Tracked dotfiles may document the integration contract, not live credentials or account state.
- Model/provider availability must be queried from the runtime before use; historical model lists are not authority.

## Durable compaction lesson

For Pi compaction, `reserveTokens` is **headroom reserved from the context window**, not a maximum prompt size. A very large value causes early compaction. Keep `keepRecentTokens` large enough to preserve the active working set, and validate the behavior against the installed Pi version before changing thresholds.

## Re-verify before acting

Re-read native Pi settings and 9router runtime state whenever the task depends on current defaults, authenticated providers, model IDs, tunnel state, or service startup behavior.
