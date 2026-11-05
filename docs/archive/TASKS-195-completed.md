# TASK-195 — completed 2026-11-06

Shipped in `7957e73`; ledger run `RUN-20261105T185041Z-e5642b13` PASS; independent review APPROVE after four rounds; CI green.

## TASK-195: Parallel AI terminals on one machine (heavy-run scope, ai-testdb, dev-freeze)
- **Requirement:** REQ-PARALLEL-TERMINALS (owner 2026-11-05/06: AI terminals across projects stacked and slowed each other; make the machine fast for many terminals and projects, keep development safe to resume after a force close).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/heavy-run`, `bin/heavy-run-test`, `bin/ai-testdb`, `bin/ai-testdb-test`, `bin/_ai-testdb-lifecycle-test.py`, `bin/dev-freeze`, `bin/dev-freeze-test`, `config/ai/CORE.md`, `config/ai/context/*.md`, `config/ai/memory/development.md`, `config/ai/runtime-commands.txt`, `docs/DOTFILES_SITEMAP.md`, `TASKS.md`, `CHANGELOG.md`, `docs/archive/TASKS-194-completed.md`.
- **Protected Paths:** `bin/delivery-ledger`, `docs/task-change-boundary.md` (other session), `config/ai/project-memory/**`, `skills/local/development-kit/**`.
- **Canonical Contract Owners:** `heavy-run` (machine queue, locks, cgroup scope); `ai-testdb` (throwaway test databases); `dev-freeze` (pre-maintenance snapshot); `memory/development.md` (rules).
- **Accepted Invariants:** locks free only after every process of the job group ended; nested calls never run without a requested lock; a test clone is dropped on every exit path; dev-freeze never modifies a repository and never reports success when an artifact failed; trust-auth test Postgres is loopback-only and holds no real data.
- **Regression Checks:** `heavy-run-test`, `ai-testdb-test`, `dev-freeze-test`, `ai-policy-lint`, `ai-memory-link --check`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a lock survives its job, a clone survives a cancelled run, or a failed snapshot exits 0.
- **Non-Scope:** per-project adoption (repo changes), sudo tuning (zram, bfq), CI runners.
- **Escalation Conditions:** a change needs sudo, a project repo, or production data.
