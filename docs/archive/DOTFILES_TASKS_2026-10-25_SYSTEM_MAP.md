# Archived Tasks — System-Map Queryability, Coverage Gate, and Memory Hygiene (2026-10-25)

Archived from `TASKS.md` after verification; evidence lives in delivery runs `RUN-20261024T185655Z-9f997678` (TASK-141), `RUN-20261024T234022Z-b09d99aa` (TASK-144), `RUN-20261025T000650Z-31d7b9f9` (TASK-145), and `RUN-20261024T184257Z-b95d642f` (TASK-139).

### TASK-145: System map as a complete, measured dictionary

- **Requirement:** REQ-SYSTEM-MAP-ACCURACY (owner 2026-10-25: validate the map until it is final as the system dictionary; the map stays English).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/system-map`, `bin/system-map-test`, `docs/DOTFILES_SITEMAP.md`, `docs/research/system-map-references-2026-10-25.md`, `TASKS.md`, `CHANGELOG.md`, `STATUS.md`, `docs/archive/DOTFILES_TASKS_2026-10-25_SYSTEM_MAP.md`.
- **Protected Paths:** pre-existing dirty work; CORE and adapters; the federated indexes (read only).
- **Canonical Contract Owners:** sitemap -> `system-map`; project memory -> `MEMORY.md`; skills -> `skill-map`.
- **Accepted Invariants:** `--find` federates existing indexes, never copies them; every link is its own candidate; coverage extends to environment, CI, skill tools, and research; notes are re-audited against sources.
- **Regression Checks:** `system-map-test` (with a live query set: 100% top-3, >=90% top-1), `system-map --check`, `ai-policy-lint`, `skill-map --check`.
- **Runtime Evidence:** the 26-query English set from the TASK-144 validation, rerun and extended.
- **Non-Scope:** non-English synonyms; embeddings or external search; commit/push.
- **Reopen Conditions:** the live query set drops below threshold, or a tracked environment file is unlinked.
- **Escalation Conditions:** a federated index needs a format change.

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

### TASK-144: Queryable system map (intent index, `find`, invariants)

- **Requirement:** REQ-SYSTEM-MAP-ACCURACY (owner 2026-10-25: the sitemap is a development dictionary like sitemap.xml, so engineers and AI reach the exact page without screening files one by one; study GitHub references and adopt what fits).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/system-map`, `bin/system-map-test`, `docs/DOTFILES_SITEMAP.md`, `docs/research/system-map-references-2026-10-25.md`, `TASKS.md`, `CHANGELOG.md`, `STATUS.md`.
- **Protected Paths:** pre-existing dirty work; CORE and adapters.
- **Canonical Contract Owners:** sitemap -> `system-map`; references -> `docs/research/system-map-references-2026-10-25.md`.
- **Accepted Invariants:** the sitemap stays the single map (no rival index, cache, or generated file); `find` reads it read-only; entries keep the llms.txt `[name](path): note` shape; every entry carries a note.
- **Regression Checks:** `system-map-test`, `system-map --check`, `ai-policy-lint`, `skill-map --check`.
- **Runtime Evidence:** `system-map find` returns the owning page first for seeded intents; `--check` fails on an entry without a note.
- **Non-Scope:** symbol graphs and PageRank (owned by `codebase-navigation`); Diátaxis labels; external portal; commit/push.
- **Reopen Conditions:** a seeded intent stops returning its owner first, or a noteless entry passes the check.
- **Escalation Conditions:** the change needs CORE, a new dependency, or a provider call.
