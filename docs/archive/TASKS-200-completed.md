# TASK-200 — completed 2026-11-07

Shipped in `d39634b`; GPT-6.1 Sol review round 3 APPROVE; ledger `RUN-20261107T075441Z-11d2b4fb` PASS; Post-push CI result pending at the time of writing.

## TASK-200: Orphan-hog monitor, rich device record, rich tooling note, lessons
- **Requirement:** REQ-PARALLEL-FOLLOWUP (owner 2026-11-07). Full contract: [TASKS-200-contract-full](TASKS-200-contract-full.md).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/{ai-capacity,device-register}{,-test}`, `devices/{rich,README}.md`, `config/ai/project-memory/linux-rich-maintenance.md`, `config/ai/memory/{ops,development}-lessons.md`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/`.
- **Protected Paths:** `bin/delivery-ledger*`, `docs/task-change-boundary.md`, `config/ai/README.md`, other `project-memory/*`, `skills/local/development-kit/**`.
- **Canonical Contract Owners:** `ai-capacity` (limits, hog report); `device-register` (generated record); `ai-learn` (promotion).
- **Accepted Invariants:** hog check is advice only (never changes the exit code, never stops a process) and exempts `ai-heavy.slice`; `devices/rich.md` regenerated not hand-edited; capacity section absent without `ai-capacity`; only verified shared lessons promoted; no device-local path or secret in shared memory (device-specific paths are allowed only in `linux-rich-maintenance.md`).
- **Regression Checks:** `ai-capacity-test` (inside and outside heavy-run), `device-register-test`, `ai-doctor --self-test`, `ai-policy-lint`, `ai-memory-route-test`, `system-map --check`, `security-check`.
- **Reopen Conditions:** an advice line that cannot be told apart from a normal long job is reported as noise; `device-register` output changes on a device without `ai-capacity`.
- **Non-Scope:** tracking `rich-*` tools (device-local on purpose), auto-stopping hogs, off-machine backup, the other five candidates.
- **Escalation Conditions:** sudo, a live account, or another session's files.

