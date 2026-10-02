# TASK-106 to TASK-110 — completed 2026-10-02

Each ran under `delivery-ledger` with tests; reviews via `ai-ask agy` (106-109) and an independent agent (110). See `.delivery/runs/`.

### TASK-106: Guard and hook parity beyond Claude Code

- **Requirement:** REQ-GUARD-PARITY (gap G3): mechanical git-guard, memory telemetry and session restore wherever a runtime supports hooks.
- **Risk Level:** R3.
- **Allowed Paths:** `bin/ai-hooks-install`, `bin/ai-hooks-install-test`, `config/ai/hooks/**`, `config/ai/claude-hooks.json`, `config/ai/adapters/*.md`, `config/ai/context/*.md`, `bin/ai-doctor`, `bin/ai-doctor-test`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/CORE.md`.
- **Canonical Contract Owners:** `runtime.guard-parity`.
- **Accepted Invariants:** git-guard stays fail-closed; a runtime that cannot 'ask' gets 'deny'; hooks never print secrets; runtimes without hook support are reported, not faked.
- **Regression Checks:** `git-guard.test.sh`, `ai-hooks-install-test`, `session-restore.test.sh`, `ai-doctor-test`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** OMP/agy/pi native configuration (device-owned).
- **Escalation Conditions:** the change needs a protected path or a live side effect.

### TASK-107: Memory and skill safety: provenance, injection scan, path triggers

- **Requirement:** REQ-MEMORY-SAFETY (gaps G7, G8, G9).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-learn`, `bin/ai-learn-test`, `bin/skill-surface-check`, `bin/skill-surface-check-test`, `bin/ai-memory-route`, `bin/ai-memory-route-test`, `config/ai/memory-router.json`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/CORE.md`.
- **Canonical Contract Owners:** `memory.safety`.
- **Accepted Invariants:** external-sourced candidates cannot be promoted without an explicit flag; hidden-instruction patterns fail the surface check; path triggers only add candidates within the existing byte budget.
- **Regression Checks:** `ai-learn-test`, `skill-surface-check-test`, `ai-memory-route-test`, `ai-policy-lint`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** semantic search (TASK-109).
- **Escalation Conditions:** the change needs a protected path or a live side effect.

### TASK-108: Daily local health report

- **Requirement:** REQ-DAILY-HEALTH (gap G6).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-health-daily`, `bin/ai-health-daily-test`, `config/ai/runtime-commands.txt`, `config/systemd/**`, `config/launchd/**`, `install.sh`, `install-macos.sh`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/CORE.md`.
- **Canonical Contract Owners:** `runtime.daily-health`.
- **Accepted Invariants:** read-only checks; writes only a local report; no network, no auto-fix, no memory writes; opt-in timer install.
- **Regression Checks:** `ai-health-daily-test`, `installer-link-test`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** remote notifications (Kelola) unless requested.
- **Escalation Conditions:** the change needs a protected path or a live side effect.

### TASK-109: Measure empty memory routes before any semantic search

- **Requirement:** REQ-ROUTER-EVIDENCE (gap G4): decide semantic fallback from data.
- **Risk Level:** R1.
- **Allowed Paths:** `bin/ai-memory-access`, `bin/ai-memory-lifecycle`, `bin/ai-memory-lifecycle-test`, `bin/ai-memory-access-test`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/memory-router.json`.
- **Canonical Contract Owners:** `memory.router-evidence`.
- **Accepted Invariants:** telemetry stays privacy-minimal (no prompt text or hash).
- **Regression Checks:** `ai-memory-lifecycle-test`, `ai-memory-access-test`.
- **Reopen Conditions:** a check above regresses or the invariant is violated.
- **Non-Scope:** embeddings or any network call.
- **Escalation Conditions:** the change needs a protected path or a live side effect.

### TASK-110: Skill content upgrade from UI, planning and stack research

- **Requirement:** REQ-SKILL-CONTENT-2026-10 (owner 2026-10-02: modern niche-adapted UI/UX; six-doc planning lane; front end, back end, admin, Hydrogen, storefront completeness).
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/**`, `config/templates/**`, `bin/skill-map`, `bin/skill-map-test`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `skills/local/impeccable/**` beyond pointer lines, vendored `skills/local/gsap-*/**`, `config/ai/CORE.md`.
- **Canonical Contract Owners:** `skills.content`.
- **Accepted Invariants:** paraphrase sources, never copy verbatim; no new dependencies; no blanket style bans or numeric dials (docs/public-ui-skill-audit.md); version-sensitive facts carry a verify note.
- **Regression Checks:** `skill-check`, `ai-policy-lint`, `skill-map --check`, script tests under `skills/local/design-taste/scripts/`, `development-spec-suite` tests.
- **Reopen Conditions:** a check above regresses.
- **Non-Scope:** new owned skills unless a methodology gap is proven.
- **Escalation Conditions:** a change needs a protected path.

## TASK-111 — RUN-20261001T200850Z-5af003d8 (PASS)

### TASK-111: Codex hook command never invoked git-guard

- **Requirement:** REQ-GUARD-PARITY (reopens TASK-106: a live Codex session ran `git push --mirror` past the hook; the generated `env AI_HOOK_RUNTIME=codex g=...;` consumed the assignment, so the guard never ran).
- **Risk Level:** R3.
- **Allowed Paths:** `bin/ai-hooks-install`, `bin/ai-hooks-install-test`, `config/ai/adapters/codex.md`, `config/ai/context/codex.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/hooks/git-guard.sh`, `config/ai/CORE.md`.
- **Canonical Contract Owners:** `runtime.guard-parity`.
- **Accepted Invariants:** the installed Codex command, executed by a shell with a Codex payload, returns git-guard's deny; Claude wiring unchanged.
- **Regression Checks:** `ai-hooks-install-test` executing the generated commands, `git-guard.test.sh`, a live Codex probe.
- **Reopen Conditions:** a generated hook command exits without running its script.
- **Non-Scope:** Codex hook trust prompts (owner action).
- **Escalation Conditions:** Codex refuses user-level hooks in `exec` mode.

## TASK-112 — RUN-20261002T022453Z-cb04d42f (PASS)

### TASK-112: External runtimes misreported as missing owned commands

- **Requirement:** REQ-SKILL-SURFACE (daily health 2026-10-02 reported `pi`/`omp` in cross-cli as missing owned commands).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/skill-surface-check`, `bin/skill-surface-check-test`, `config/ai/memory/long-task-debugging.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/CORE.md`.
- **Canonical Contract Owners:** `skills.surface`.
- **Accepted Invariants:** a missing owned `family-name` command is still reported; a bare external CLI name is not.
- **Regression Checks:** `skill-surface-check-test`, `skill-surface-check` CLEAN on the repo.
- **Reopen Conditions:** a real missing owned command stops being reported.
- **Non-Scope:** changing cross-cli content.
- **Escalation Conditions:** none expected.

## TASK-113 — RUN-20261002T022621Z-d6001d4a (PASS)

### TASK-113: Daily health report can drop warning lines

- **Requirement:** REQ-DAILY-HEALTH (a section keeps only its last 60 lines, so ai-doctor's early `!` lines were cut from the 2026-10-02 report).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/ai-health-daily`, `bin/ai-health-daily-test`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `config/ai/CORE.md`.
- **Canonical Contract Owners:** `runtime.daily-health`.
- **Accepted Invariants:** every warning or failure line of a section appears in the report regardless of output length; still read-only and redacted.
- **Regression Checks:** `ai-health-daily-test`.
- **Reopen Conditions:** a warning line is missing from a report.
- **Non-Scope:** changing ai-doctor.
- **Escalation Conditions:** none expected.
