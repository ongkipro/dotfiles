# TASKS index — archived 2026-11-12

Moved verbatim from `TASKS.md` to keep the hot file under its budget; earlier archives stay as they were.

## TASK-213: Inbox triage and the two lessons from this week
- **Requirement:** REQ-INBOX-TRIAGE (owner 2026-11-12: "audit dan sempurnakan").
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/postgres-drizzle/references/queries-and-concurrency.md`, `config/ai/memory/ops-lessons.md`, `config/ai/memory/development-lessons.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/**`; scope expansions recorded in the ledger: `config/ai/memory-router.json`, `bin/ai-memory-route-test`, `docs/DOTFILES_SITEMAP.md`.
- **Canonical Contract Owners:** `postgres-drizzle` skill; shared lesson memory.
- **Accepted Invariants:** a candidate already encoded in a repo or skill is closed as such, not duplicated; promoted facts cite an official source; memory files stay within the router budget.
- **Regression Checks:** `skill-check`, `ai-policy-lint`, `ai-memory-route-test`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a closed candidate turns out not to be encoded where its reason says.
- **Non-Scope:** project repositories.
- **Escalation Conditions:** none expected (documentation and memory only).
- **Outcome (2026-11-12):** see CHANGELOG 2026-11-12 (TASK-213). Run `RUN-20261112T112930Z-7af6ebf4`; independent review Gemini 4 Carbon high (round 1 FAIL: MVCC snapshot gap, lesson promotion path, archive placement, missing router tests; round 2 FAIL: `FOR KEY SHARE` does not conflict with a non-key update, sitemap scope; all fixed).
