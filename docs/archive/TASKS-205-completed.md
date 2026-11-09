# TASK-205 — completed 2026-11-07

Shipped in `40ff351`; pushed in `b51525e`; ledger `RUN-20261107T100814Z-fbb66b32` PASS; no independent review at the time, then reviewed on the owner's order (findings fixed in TASK-206).

## TASK-205: Fix the eight findings of the second reviewer on TASK-203 and TASK-204
- **Requirement:** REQ-PARALLEL-FOLLOWUP (owner 2026-11-07). Full contract: [TASKS-205-contract-full](TASKS-205-contract-full.md).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/{ai-capacity,device-register}{,-test}`, `bin/ai-memory-route-test`, `config/ai/memory-router.json`, `config/ai/memory/development-lessons.md`, `config/ai/project-memory/linux-rich-maintenance.md`, `devices/rich.md`, `docs/linux-maintenance-log.md`, `docs/archive/`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`, `TASKS.md`.
- **Protected Paths:** `bin/delivery-ledger*`, `docs/task-change-boundary.md`, `config/ai/README.md`, other `project-memory/*`, `skills/local/development-kit/**`, TASK-198.
- **Canonical Contract Owners:** `ai-capacity`, `device-register`, `ai-memory-route` and its manifest.
- **Accepted Invariants:** advice never raises or changes the exit code; the device record never claims enforcement from a plan; a promoted lesson is reachable by trigger; each new assertion was shown to fail on its defect; no independent review was run (owner instruction).
- **Regression Checks:** `ai-capacity-test`, `device-register-test`, `ai-memory-route-test`, `ai-doctor --self-test`, `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a promoted lesson is unreachable; the advice raises; the device record claims enforcement without `apply` or on macOS.
- **Non-Scope:** a head-to-head review; TASK-198; cosmetic naming; pushing.
- **Escalation Conditions:** sudo, a live account, another session's files.

