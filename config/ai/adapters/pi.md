## Runtime adapter — Pi

- Runtime facts: this context arrives through the `pi()` shell wrapper as `--append-system-prompt`, followed by device-local `~/.config/ai-local/device.md` when present. Pi owns its models, providers, auth, and sessions. How you work the task is yours to choose; the core's boundaries and evidence rules still apply.
- No dotfiles hooks are wired into Pi: every Git and approval rule in the core is enforced only by your own behavior here. `pi update` routes through `pi-update-safe`.
