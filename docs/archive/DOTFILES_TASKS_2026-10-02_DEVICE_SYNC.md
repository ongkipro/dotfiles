# TASK-099 — completed 2026-10-01

Run: RUN-20261001T164710Z-5951836b (PASS), commit ecd67ab.

**Outcome:** background `dotsync autopull` at interactive shell start; `ai-doctor` reports the outcome and fetch age. Each other device needs one manual `dotsync pull` and a new shell; `ai-doctor` then shows the `autopull:` line.

## Original contract

### TASK-099: Devices drift because dotfiles pulls are manual

- **Requirement:** REQ-DEVICE-SYNC (owner goal 2026-10-01: dotfiles stays the single source for every AI CLI on every device; the device registry shows four devices last registered 45-80 days ago).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/dotsync`, `bin/dotsync-test`, `bin/ai-doctor`, `config/shell-tools.sh`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `bin/secrets-env`, `config/ai/CORE.md`.
- **Canonical Contract Owners:** `runtime.device-sync`.
- **Accepted Invariants:** never commits, pushes, merges a divergent history, or touches a dirty tree automatically; a shell start is never blocked by the network; `dotsync pull` keeps its confirmation.
- **Regression Checks:** `dotsync-test`, `ai-doctor-test`, `mutation-sweep --subject dotsync`.
- **Reopen Conditions:** an automatic pull creates a merge commit, discards local work, or delays a shell prompt.
- **Non-Scope:** automatic commit or push; syncing `~/.config/ai-local/`.
- **Runtime Evidence:** implemented and verified on `rich` (RUN-20261001T164710Z-5951836b, PASS). Open: each other device needs one manual `dotsync pull` and a new shell before autopull runs there; `ai-doctor` then shows the `autopull:` line.
- **Escalation Conditions:** a supported device cannot fast-forward without manual intervention.
