# TASK-202 full contract (verbatim)

## TASK-202: Fix the eight findings of the second reviewer on TASK-200 and TASK-201
- **Requirement:** REQ-PARALLEL-FOLLOWUP (owner 2026-11-07: perfect it on the agent's recommendation; independent reviews only when ordered).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-capacity{,-test}`, `bin/device-register{,-test}`, `bin/ai-memory-route-test`, `config/ai/memory-router.json`, `config/ai/memory/development-lessons.md`, `config/ai/project-memory/linux-rich-maintenance.md`, `devices/rich.md`, `docs/linux-maintenance-log.md`, `docs/archive/`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`, `TASKS.md`.
- **Protected Paths:** `bin/delivery-ledger*`, `docs/task-change-boundary.md`, `config/ai/README.md`, other `project-memory/*`, `skills/local/development-kit/**`, TASK-198 (another session's contract).
- **Canonical Contract Owners:** `ai-capacity` (advice only, never crashes status); `device-register` (generated record); `ai-memory-route` and the manifest (a promoted lesson must be reachable).
- **Accepted Invariants:** the hog advice never changes the exit code and never raises; bad overrides fall back to defaults; the device record never claims enforcement from a plan; a lesson that exists only in a large file has triggers and a regression that queries them; every new assertion was shown to fail on the defect it guards; no independent review was run (owner instruction), which this record states.
- **Regression Checks:** `ai-capacity-test`, `device-register-test`, `ai-memory-route-test`, `ai-doctor --self-test`, `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a promoted lesson stops being reachable; the advice line raises or flips the exit code; the device record claims enforcement without `apply` or on macOS.
- **Non-Scope:** a head-to-head review of this patch; TASK-198; the cosmetic setproctitle naming; pushing.
- **Escalation Conditions:** sudo, a live account, or another session's files.
