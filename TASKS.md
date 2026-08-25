# Tasks — dotfiles

Updated: 2026-08-24

This is the sole executable queue. Historical detail through TASK-016 is
archived in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Repository
tests and runtime evidence outrank prose.

## Task contract

Every implementation task records: Requirement, Risk Level, Job, Capability,
Execution Class, resolved Model/Provider/Reasoning, Change Surface, Protected
Surface, Accepted Invariants, Shared Owner, Regression Checks, Reopen
Conditions, Non-Scope, Verification, and Escalation Condition.

R0 may infer one obvious documentation path. R1 must remain bounded. R2 needs
an explicit affected surface. R3/R4 need explicit protected surfaces and
independent review evidence. Parallel children with a shared semantic owner do
not run concurrently even when their file globs are disjoint.

## In progress

### TASK-024: Restore upstream-native OMP ownership
- **Requirement:** REQ-OMP-UPSTREAM-DEFAULT
- **Risk Level:** R2
- **Job:** implementation
- **Capability:** `testing-engineering`
- **Execution Class:** precision
- **Model / Provider / Reasoning:** root-codex, codex-runtime, openai, adaptive.
- **Allowed Paths:** `config/shell-tools.sh`, `install.sh`, `install-macos.sh`, `bin/{ai-doctor,installer-link-test,shell-wrapper-test,omp-workspace-test,omp-routing-test,omp-effective-routing-test}`, `config/ai/{AGENTS.md,README.md,runtime-commands.txt,memory/skills.md,memory/environment-ai-runtimes.md,memory/decisions.md}`, `config/pi/README.md`, `config/omp/**`, `docs/{linux-dev-setup.md,DOTFILES_AI_ENGINEERING_MASTER_BLUEPRINT.md,DOTFILES_AI_ENGINEERING_CONTROL_PLANE.md}`, `TASKS.md`
- **Protected Paths:** `config/ai/AGENTS.md`, `config/shell-tools.sh`
- **Canonical Contract Owners:** `operations.omp-native-runtime`, `operations.shared-context`, `operations.omp-regression`
- **Producers:** installers, shared context/skill adapters, and OMP boundary checks.
- **Consumers:** native OMP sessions, fresh-device installs, and repository health checks.
- **Depends On:** TASK-023 (superseded by this task).
- **Runtime Evidence:** native OMP 18.0.4; no dotfiles `PI_CONFIG_FILES`; no live links to retired `config/omp/{config.yml,models.yml,agents}`; effective native `modelRoles` is empty.
- **Accepted Invariants:** OMP owns its command, runtime config, agents, model/provider catalog, routing, updates, workspace behavior, authentication, and session state; dotfiles supplies OMP only with shared `AGENTS.md` context and owned skills; installers retire only exact legacy dotfiles links and preserve native files; no credential is read or changed; shared MCP remains deferred until a concrete secret-free configuration exists.
- **Regression Checks:** `bin/shell-wrapper-test`, `bin/omp-workspace-test`, `bin/omp-routing-test`, `bin/omp-effective-routing-test`, `bin/installer-link-test`, `bin/ai-policy-lint`, `bin/ai-doctor --self-test`, `git diff --check`
- **Reopen Conditions:** a shell wrapper or `PI_CONFIG_FILES` injection returns, an installer links tracked OMP runtime state, a live runtime path points into retired `config/omp/` state, or memory/docs again claim dotfiles owns OMP routing.
- **Rollback/Migration State:** exact legacy OMP model/agent links are retired; native config, auth, sessions, cache, and unmanaged files are preserved. Retired tracked routing files remain historical evidence and are not loaded.
- **Non-Scope:** Anthropic login, credential inspection or migration, creating MCP configuration without a concrete requirement, deleting historical evidence, production, commits, and pushes.
- **Verification:** focused OMP, installer, shell, memory, and skill checks pass;
  `ai-policy-lint`, `ai-doctor --self-test`, and `git diff --check` pass; live
  OMP 18.0.4 matches a pristine native profile except for OMP's own
  `setupVersion` onboarding marker. The final boundary is `REVIEW_REQUIRED`
  because protected and accepted pre-existing paths were changed.
- **Escalation Conditions:** native OMP differs from a pristine upstream config, or final boundary review is required for the protected/pre-existing change surface.


## Done

Completed task contracts through TASK-023 are archived in:

- `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`
- `docs/archive/DOTFILES_TASKS_2026-08-18_THROUGH_2026-08-23.md`

## Pending

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until at least five immutable real delivery records exist for one skill. Then run `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`; never fabricate or promote synthetic attribution.
- **TASK-013 / AUDIT-CI-01 — restore hosted GitHub Actions execution (R2).** Human billing owner must remove the external Actions block, then a fresh Ubuntu/macOS matrix must start and conclude normally. AI must not change billing or weaken CI.
- **TASK-021 / REQ-DELIVERY-CONTRACT-GAPS — fix the broken `start-child` example in `docs/task-change-boundary.md` (R1).** TASK-020's routing-provenance guard broke the canonical parallel-child example; deferred because the file carried unaccepted pre-existing dirty work at TASK-020's `start`. New run must `--accept-dirty` it.
- **TASK-022 / REQ-DELIVERY-CONTRACT-GAPS — wire `project-check-test` into `config/ai/runtime-commands.txt` (R1).** Same deferral reason as TASK-021, same file class. Cosmetic only: `ai-doctor --self-test` already discovers the test via its `bin/*-test` glob.

## Historical closure

- **TASK-014 / AUDIT-BOUNDARY-01 — deterministic task change boundaries.** Baseline fingerprints, task-owned path classification, scope expansion evidence, risk escalation, independent review, and DONE denial are executable in `delivery-ledger`; its mutation-backed regression matrix passes locally.
- **Duplicate task ID correction (2026-08-19).** TASK-017 was issued twice: first for AUDIT-CI-02 on 2026-08-17, then again for REQ-OMP-ROUTING-COLLISION on 2026-08-18. The routing/collision task is now TASK-019, so task IDs here are unique but no longer chronological. Its immutable delivery evidence (`RUN-20260818T084140Z-30974d4a`, `RUN-20260818T085852Z-dc09a68d`) still records `TASK-017`; `.delivery` history is never rewritten to match. Match a run to a task by requirement ID.
- Prior completed tasks and dated audit closure evidence are retained in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Archived prose is historical, never current pass evidence.
