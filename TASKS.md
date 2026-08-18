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


## Done
### TASK-017: Remediate OMP routing and parallel collision controls
- **Requirement:** REQ-OMP-ROUTING-COLLISION
- **Risk Level:** R3
- **Job:** implementation
- **Capability:** `full-stack-development`, `application-security`, `testing-engineering`
- **Execution Class:** precision
- **Allowed Paths:** `config/omp/**`, `bin/delivery-ledger`, `bin/delivery-ledger-test`, `bin/omp-routing-test`, `bin/omp-effective-routing-test`, `config/templates/TASKS.md`, `docs/task-change-boundary.md`, `TASKS.md`
- **Protected Paths:** `config/omp/**`, `bin/delivery-ledger`
- **Producers:** OMP role resolution and delivery-ledger child lifecycle.
- **Consumers:** parent orchestrator and isolated child workers.
- **Depends On:** none.
- **Runtime Evidence:** OMP parser and live model catalog.
- **Reopen Conditions:** selector drift, a reachable Lite path, or a pre-dispatch collision bypass.
- **Rollback/Migration State:** declarative routing change; restore only with fresh catalog evidence.
- **Canonical Contract Owners:** `operations.routing`, `operations.delivery-ledger`
- **Accepted Invariants:** no reachable Gemini Flash Lite route; three-worker implementation ceiling; child paths and hierarchical owners cannot collide; parent applies immutable verified patches sequentially.
- **Regression Checks:** `bin/omp-routing-test`, `bin/omp-effective-routing-test`, `bin/delivery-ledger-test`
- **Non-Scope:** provider credentials, catalog records, production, deployment, commits.
- **Escalation Conditions:** absent catalog capability, boundary overlap, or failed collision regression.

### TASK-017: Make workflow and OMP overlay evidence executable
- **Requirement:** AUDIT-CI-02 — local and hosted validation must reject invalid GitHub workflows, while OMP global-overlay evidence must prove the runtime applied the overlay rather than merely parsing YAML or exiting zero.
- **Risk Level:** R3
- **Job:** implementation
- **Capability:** `github-actions`, `testing-engineering`, `native-first`, `lean-code-review`
- **Execution Class:** judgment
- **Model / Provider / Reasoning:** Current Codex route; model routing is unchanged.
- **Change Surface:** `.github/workflows/core-runtime.yml`, `config/mise-config.toml`, `config/ai/runtime-commands.txt`, `bin/ai-policy-lint`, `bin/ai-policy-lint-test`, `bin/omp-effective-routing-test`, `config/omp/STATUS.md`, `TASKS.md`
- **Protected Surface:** `.github/workflows/**`, `config/omp/**`
- **Accepted Invariants:** actionlint is version- and checksum-pinned; every supported device receives it through mise; `ai-policy-lint` fails when workflow validation is missing or invalid; OMP global `--config` must change a sentinel value before it can report full verification; the known upstream rejection remains explicit `PARTIAL`.
- **Shared Owner:** `repository-ci`, `omp-runtime-evidence`
- **Regression Checks:** `actionlint`, `bin/ai-policy-lint-test`, `bin/ai-policy-lint`, `bin/omp-effective-routing-test`, `bin/installer-link-test`, `bin/ai-doctor --self-test`, hosted Ubuntu/macOS Core runtime.
- **Reopen Conditions:** workflow syntax can bypass local policy lint, an unverified actionlint binary executes, or OMP reports full verification without proving overlay semantics.
- **Non-Scope:** model/provider routing changes, OMP upstream implementation, production, billing, new orchestration, or a second workflow-lint subsystem.
- **Verification:** Linux actionlint 1.7.12, its checksum-pinned CI installer fixture, mutation-backed policy/OMP guards, installer integration, and the authoritative repository self-test pass locally. Hosted Core runtime run `32045480144` passed the pinned installer, actionlint gate, and full suite on Ubuntu and macOS.
- **Escalation Condition:** any requirement to weaken an existing CI gate, expose credentials, or overlap pre-existing user work.

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
