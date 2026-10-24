# Archived Tasks — System-Map Coverage Gate and Memory Hygiene (2026-10-25)

Archived from `TASKS.md` after verification; evidence lives in delivery runs `RUN-20261024T185655Z-9f997678` (TASK-141) and `RUN-20261024T184257Z-b95d642f` (TASK-139).

### TASK-141: Generated system-map inventory and coverage gate

- **Requirement:** REQ-SYSTEM-MAP-ACCURACY (owner 2026-10-25: keep the sitemap tidy and precise; audit found 7 bin commands, 1 template, 14 top-level docs unlinked and 5 project memories missing from `MEMORY.md`).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/system-map`, `bin/system-map-test`, `bin/ai-policy-lint`, `config/ai/runtime-commands.txt`, `docs/DOTFILES_SITEMAP.md`, `config/ai/project-memory/MEMORY.md`, `TASKS.md`, `CHANGELOG.md`, `STATUS.md`.
- **Protected Paths:** pre-existing dirty work; CORE and adapters.
- **Canonical Contract Owners:** sitemap -> `system-map`; project-memory index -> `MEMORY.md`.
- **Accepted Invariants:** narrative stays hand-written; only the inventory block is rendered; one index per collection; `--check` writes nothing.
- **Regression Checks:** `system-map-test`, `system-map --check`, `ai-policy-lint`, `skill-map --check`.
- **Runtime Evidence:** `--check` fails on a seeded unlinked file and a broken link, then passes on the repository.
- **Non-Scope:** rewriting curated narrative, commit/push.
- **Reopen Conditions:** a tracked collection member can be added without the check failing.
- **Escalation Conditions:** the check needs CORE or provider calls.

### TASK-139: Memory hygiene before publication

- **Requirement:** REQ-MEMORY-HYGIENE (owner 2026-10-25: scan, validate, review and commit memory; repository is public).
- **Risk Level:** R1.
- **Allowed Paths:** the six project-memory files flagged by `ai-memory-hygiene`, `TASKS.md`.
- **Protected Paths:** other memory files; credentials.
- **Canonical Contract Owners:** memory -> `ai-memory-hygiene`.
- **Accepted Invariants:** re-measure or reduce dated claims to timeless facts; no secret, address, or new client data.
- **Regression Checks:** `ai-memory-hygiene`, `ai-memory-check`, `security-check`, `ai-policy-lint`.
- **Runtime Evidence:** HEAD requests for re-measured domain claims.
- **Non-Scope:** push.
- **Reopen Conditions:** a rewritten line changes meaning.
- **Escalation Conditions:** a claim cannot be re-measured or safely generalized.
