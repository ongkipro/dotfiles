# TASK-206 full contract (verbatim)

## TASK-206: Fix the three findings of an owner-ordered review of the pushed TASK-205 and the merge
- **Requirement:** REQ-PARALLEL-FOLLOWUP (owner 2026-11-07: review).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-policy-lint`, `bin/ai-policy-lint-test`, `bin/ai-memory-route-test`, `bin/device-register`, `config/ai/memory-router.json`, `devices/rich.md`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/`.
- **Protected Paths:** `bin/delivery-ledger*`, `docs/task-change-boundary.md`, `config/ai/README.md`, other `project-memory/*`, `skills/local/development-kit/**`, the other device's TASK-200 and everything of it.
- **Canonical Contract Owners:** `ai-policy-lint` (ledger binding); `ai-memory-route` and its manifest; `device-register`.
- **Accepted Invariants:** a historical label exemption names the exact run file and cannot cover a new run; the router never surfaces the operations lessons for everyday phrases such as "from scratch"; the device record states what is enforced where without overreaching; no change to the other device's work; no independent review beyond the one that raised these findings.
- **Regression Checks:** `ai-policy-lint-test`, `ai-memory-route-test`, `device-register-test`, `ai-doctor --self-test`, `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a new run with a wrong pair is accepted; an everyday phrase pulls the lessons; the device record overstates macOS support.
- **Non-Scope:** the other device's two CI failures (skill map, REQ-200 label), which wait for that device; pushing.
- **Escalation Conditions:** sudo, a live account, another session's files.
