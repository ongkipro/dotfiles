## Runtime adapter — Pi

- Native first: this context arrives through the `pi()` shell wrapper as `--append-system-prompt`, followed by device-local `~/.config/ai-local/device.md` when present. Pi owns its models, providers, auth, and sessions.
- No orchestration policy applies to Pi; execute tasks directly.
- No dotfiles hooks are wired into Pi: every Git and approval rule in the core is enforced only by your own behavior here. `pi update` routes through `pi-update-safe`.
