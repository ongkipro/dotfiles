# Tasks — dotfiles

Updated: 2026-08-17

This is the sole executable queue. Historical detail through the start of
TASK-015 is archived in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`.
Repository tests and runtime evidence outrank prose.

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

No task is in progress.

## Done

### TASK-016: Preserve bulk-bootstrap failure semantics
- **Requirement:** AUDIT-CTRL-01 — bulk bootstrap must not report success when a repository failed verification or was skipped for dirty user work.
- **Risk Level:** R3
- **Change Surface:** `bin/project-init`, `bin/project-init-test`, `TASKS.md`
- **Protected Surface:** `bin/project-init`
- **Accepted Invariants:** all-complete exits 0; any failure exits 1; safe dirty/blocked skips exit 2; dirty files remain untouched.
- **Shared Owner:** `project-contract-bootstrap`
- **Regression Checks:** `bin/project-init-test`, `bin/ai-doctor --self-test`
- **Reopen Conditions:** warning-only partial completion or mutation of a dirty repository.
- **Non-Scope:** repository contents, routing, models, production, billing.
- **Verification:** Linux fixtures prove exit 0/1/2 and dirty preservation; `ai-doctor --self-test` passes all critical gates.
- **Escalation Condition:** any required destructive cleanup or user-work overlap.

### TASK-015: Harden OMP task integration and repository contracts
- **Requirement:** AUDIT-CTRL-01 — parallel AI work must preserve semantic ownership, executable evidence, bounded integration, and compact authoritative context without changing the accepted model-routing graph.
- **Risk Level:** R4
- **Job:** implementation
- **Capability:** `native-first`, `testing-engineering`, `github-actions`
- **Execution Class:** judgment
- **Model / Provider / Reasoning:** Current Codex route; model routing is unchanged.
- **Change Surface:** `config/omp/**`, `config/templates/TASKS.md`, `bin/{delivery-ledger,delivery-ledger-test,project-init,project-init-test,ai-policy-lint,omp-routing-test,omp-effective-routing-test}`, `.github/workflows/core-runtime.yml`, `docs/**`, `TASKS.md`
- **Protected Surface:** `config/omp/config.yml`, `bin/delivery-ledger`, `bin/project-init`, `.github/workflows/**`
- **Accepted Invariants:** no automatic isolated-patch apply; recursion one level; child LSP enabled; parent integrates verified patches sequentially only after every child finishes; no user-work reset/stash/clean/overwrite; routing selectors unchanged.
- **Shared Owner:** `omp-task-runtime`, `delivery-evidence`, `project-contract-bootstrap`, `repository-ci`
- **Regression Checks:** `bin/omp-routing-test`, `bin/omp-effective-routing-test`, `bin/delivery-ledger-test`, `bin/project-init-test`, `bin/ai-policy-lint`, `bin/ai-doctor --self-test`
- **Reopen Conditions:** automatic patch application, semantic-owner collision, early/concurrent integration, invalid evidence accepted, unsafe sync/bootstrap, hot-context overflow, or green overlay evidence without an OMP runtime probe.
- **Non-Scope:** model/provider selector changes, hosted billing, production, macOS execution, new orchestration or memory systems.
- **Verification:** Run every named check locally on Linux; report hosted/macOS separately.
- **Escalation Condition:** stop before user-work overlap, external-account changes, or undeclared surfaces.
- **Completion Evidence:** Linux targeted suites and `ai-doctor --self-test` pass. Overlay loading through OMP's `models --config` path passes; OMP 17.3.5's global-flag rejection on `config` remains explicit `PARTIAL`. macOS and hosted CI were not run. Existing-repository bootstrap completed for four clean repositories, skipped four dirty repositories, and retained one pre-existing `accuflow` lint failure as `FAIL` evidence.

## Pending

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until at least five immutable real delivery records exist for one skill. Then run `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`; never fabricate or promote synthetic attribution.
- **TASK-013 / AUDIT-CI-01 — restore hosted GitHub Actions execution (R2).** Human billing owner must remove the external Actions block, then a fresh Ubuntu/macOS matrix must start and conclude normally. AI must not change billing or weaken CI.

## Historical closure

- **TASK-014 / AUDIT-BOUNDARY-01 — deterministic task change boundaries.** Baseline fingerprints, task-owned path classification, scope expansion evidence, risk escalation, independent review, and DONE denial are executable in `delivery-ledger`; its mutation-backed regression matrix passes locally.
- Prior completed tasks and dated audit closure evidence are retained in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Archived prose is historical, never current pass evidence.
