# TASK-196 — completed 2026-11-06

Shipped in `6e38288`; ledger run `RUN-20261105T191735Z-d6f6679c` PASS; independent review APPROVE after three rounds; CI green.

## TASK-196: Per-device AI capacity (terminals, subagents, heavy jobs)
- **Requirement:** REQ-AI-CAPACITY (owner 2026-11-06: no force close mid-work while AI terminals stay fast; precise for `rich`, other devices size themselves; state the maximum terminals, projects and subagents).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-capacity`, `bin/ai-capacity-test`, `bin/_ai-capacity-sweep-test.py`, `bin/heavy-run`, `config/ai/CORE.md`, `config/ai/context/*.md`, `config/ai/memory/development.md`, `config/ai/runtime-commands.txt`, `docs/DOTFILES_SITEMAP.md`, `TASKS.md`, `CHANGELOG.md`, `docs/archive/TASKS-195-completed.md`.
- **Protected Paths:** `bin/delivery-ledger`, `docs/task-change-boundary.md` (other session), `config/ai/project-memory/**`, `skills/local/development-kit/**`.
- **Canonical Contract Owners:** `ai-capacity` (sizing, device-local limits); `heavy-run` (slots from `capacity.env`); `memory/development.md` (rules and `rich` numbers).
- **Accepted Invariants:** writes only device-local files, after validation, atomically, with backups; never labels an unloaded limit enforced; degraded devices get no feasible concurrent plan; measured costs never below defaults; targets and enforced limits named by their real scope.
- **Regression Checks:** `ai-capacity-test` (incl. RAM sweep), `heavy-run-test`, `ai-policy-lint`, `ai-memory-link --check`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a refused apply writes a file, an unloaded slice is reported enforced, or a plan row exceeds its budget.
- **Non-Scope:** machine-wide subagent admission across terminals; per-project adoption; sudo tuning.
- **Escalation Conditions:** a change needs sudo or a system unit.
