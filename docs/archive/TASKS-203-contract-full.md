# TASK-203 full contract (verbatim)

## TASK-203: Orphan-hog monitor, rich device record, rich tooling note, lessons
- **Requirement:** REQ-PARALLEL-FOLLOWUP (owner 2026-11-07: monitor, document, review). Full contract: [TASKS-203-contract-full](TASKS-203-contract-full.md).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-capacity`, `bin/ai-capacity-test`, `bin/device-register`, `bin/device-register-test`, `devices/rich.md`, `devices/README.md`, `config/ai/project-memory/linux-rich-maintenance.md`, `config/ai/memory/{ops,development}-lessons.md`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/`.
- **Protected Paths:** `bin/delivery-ledger*`, `docs/task-change-boundary.md`, `config/ai/README.md`, `config/ai/project-memory/{MEMORY,beauty-clinic-saas,tokophi-repo-private-ruling}.md`, `skills/local/development-kit/**`.
- **Canonical Contract Owners:** `ai-capacity` (limits and the hog report); `device-register` (the device record, generated); `ai-learn` (lesson promotion).
- **Accepted Invariants:** the hog check is advice only (never changes the exit code, never stops a process) and exempts `ai-heavy.slice`; `devices/rich.md` is regenerated, never hand-edited; the capacity section is absent where `ai-capacity` is absent; only verified shared lessons are promoted; no device-local path or secret enters shared memory (device-specific paths are allowed only in `linux-rich-maintenance.md`).
- **Regression Checks:** `ai-capacity-test` (inside and outside heavy-run), `device-register-test`, `ai-doctor --self-test`, `ai-policy-lint`, `ai-memory-route-test`, `system-map --check`, `security-check`.
- **Reopen Conditions:** the advice line cannot be told apart from a normal long job; `device-register` output changes on a device without `ai-capacity`.
- **Non-Scope:** tracking `rich-db`/`rich-session`/`rich-archive` (device-local on purpose), stopping hogs automatically, off-machine backup, the other five candidates.
- **Escalation Conditions:** a change needs sudo, a live account, or another session's files.

