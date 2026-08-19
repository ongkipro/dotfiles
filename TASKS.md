# Tasks — dotfiles

Updated: 2026-08-19

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


## Done
### TASK-020: Close delivery-contract, routing, and task-scale gaps
- **Requirement:** REQ-DELIVERY-CONTRACT-GAPS
- **Risk Level:** R3
- **Job:** implementation
- **Capability:** `full-stack-development`, `testing-engineering`, `native-first`
- **Execution Class:** precision
- **Model / Provider / Reasoning:** anthropic/claude-sonnet-5, anthropic, high.
- **Allowed Paths:** `bin/{delivery-ledger,delivery-ledger-test,diff-risk,diff-risk-test,project-check,project-check-test,ai-policy-lint,ai-policy-lint-test}`, `config/templates/TASKS.md`, `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`, `TASKS.md`
- **Protected Paths:** `bin/delivery-ledger`, `bin/project-check`
- **Canonical Contract Owners:** `operations.delivery-ledger`, `operations.project-check`, `operations.diff-risk`, `operations.policy-lint`
- **Producers:** boundary and review evidence.
- **Consumers:** parent orchestrator, independent reviewer, `production-gate` (via `project-check`).
- **Depends On:** TASK-018 (integrated).
- **Runtime Evidence:** live `npm`/`shopify` toolchains, real local project repositories.
- **Accepted Invariants:** `start-child` at R1-R4 carries the same resolved-provenance guard as `start`; `diff-risk` surfaces browser-visible UI paths at `minimumRisk` R0, informational only; `project-check`'s delivery-contract report never contributes to its PASS/FAIL/UNVERIFIED tally; `ai-policy-lint`'s template field check derives from the same list its per-task lint enforces.
- **Regression Checks:** `bin/delivery-ledger-test`, `bin/diff-risk-test`, `bin/project-check-test`, `bin/ai-policy-lint-test`, `bin/ai-policy-lint`, `bin/delivery-gate-test`, `bin/installer-link-test`, `bin/ai-doctor --self-test`
- **Reopen Conditions:** a docs-only repo reporting VERIFIED, a partially-adopted or worktree-checked-out repo reporting FAILED on contract-document absence alone, an R1-R4 child run accepting unresolved provenance, or documented template fields drifting from the enforced set again.
- **Rollback/Migration State:** additive checks and documentation; revert restores the narrower prior coverage.
- **Non-Scope:** OMP routing selectors, production, deployment, commits, hosted CI.
- **Verification:** every named check passes locally on Linux; independent review (Opus, then Sonnet on a separate route) found and confirmed fixed: a false-VERIFIED on doc-only repos, false-FAILED on partial/worktree adoption, a self-contradictory archive entry, and an `/api/`-bypass in the UI risk pattern.
- **Escalation Conditions:** a live catalog rejecting a required selector, or overlap with pre-existing user work.
- **Deferred:** see TASK-021 and TASK-022 under `## Pending` — both reverted mid-run over unaccepted pre-existing dirty overlap on the target file, not skipped by oversight.

### TASK-019: Remediate OMP routing and parallel collision controls
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

### TASK-018: Audit and repair routing, collision, and review-independence controls
- **Requirement:** REQ-OMP-AUDIT-REPAIR
- **Risk Level:** R3
- **Job:** implementation
- **Capability:** `full-stack-development`, `application-security`, `testing-engineering`
- **Execution Class:** precision
- **Model / Provider / Reasoning:** anthropic/claude-opus-5, anthropic, high.
- **Allowed Paths:** `bin/{delivery-ledger,delivery-ledger-test,ai-policy-lint,ai-policy-lint-test,omp-routing-test,project-init,delivery-benchmark-test}`, `config/omp/{ROUTING.md,STATUS.md,overlays/codex-only.yml}`, `docs/task-change-boundary.md`, `TASKS.md`
- **Protected Paths:** `config/omp/**`, `bin/delivery-ledger`, `bin/project-init`
- **Canonical Contract Owners:** `operations.routing`, `operations.delivery-ledger`, `operations.policy-lint`, `operations.task-contract`
- **Producers:** boundary and review evidence.
- **Consumers:** parent orchestrator, independent reviewer, and `ai-policy-lint`.
- **Depends On:** TASK-019 (integrated).
- **Runtime Evidence:** live OMP model catalog and the installed OMP config parser.
- **Accepted Invariants:** an exact path and its own `**` subtree collide before dispatch; R1-R4 runs carry resolved routing provenance; independent review records reviewer identity, model, provider, reasoning, and an evidence digest bound to the latest boundary check, compared case- and whitespace-insensitively; approval cannot survive an unreviewed change; documented pools match executable selectors.
- **Regression Checks:** `bin/delivery-ledger-test`, `bin/omp-routing-test`, `bin/omp-effective-routing-test`, `bin/ai-policy-lint-test`, `bin/ai-policy-lint`, `bin/diff-risk-test`, `bin/project-init-test`, `bin/delivery-benchmark-test`, `bin/ai-doctor --self-test`
- **Reopen Conditions:** a collision shape passing pre-dispatch, an `unknown`-provenance R1-R4 run, an approval surviving a later edit, or documented routing diverging from `config.yml`.
- **Rollback/Migration State:** additive guards and documentation; revert restores the weaker checks.
- **Non-Scope:** provider credentials, `.delivery` history, production, deployment, commits, and hosted CI.
- **Verification:** every named check and `ai-doctor --self-test` pass locally on Linux; `omp-effective-routing-test` stays `PARTIAL` on the known OMP `--config` parser defect. A metric with no real value is recorded as `unavailable: <reason>`, never as `unknown`.
- **Escalation Conditions:** a live catalog rejecting a required selector, a fix collapsing provider diversity, or overlap with pre-existing user work.

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

## Pending

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until at least five immutable real delivery records exist for one skill. Then run `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`; never fabricate or promote synthetic attribution.
- **TASK-013 / AUDIT-CI-01 — restore hosted GitHub Actions execution (R2).** Human billing owner must remove the external Actions block, then a fresh Ubuntu/macOS matrix must start and conclude normally. AI must not change billing or weaken CI.
- **TASK-021 / REQ-DELIVERY-CONTRACT-GAPS — fix the broken `start-child` example in `docs/task-change-boundary.md` (R1).** TASK-020's routing-provenance guard broke the canonical parallel-child example; deferred because the file carried unaccepted pre-existing dirty work at TASK-020's `start`. New run must `--accept-dirty` it.
- **TASK-022 / REQ-DELIVERY-CONTRACT-GAPS — wire `project-check-test` into `config/ai/runtime-commands.txt` (R1).** Same deferral reason as TASK-021, same file class. Cosmetic only: `ai-doctor --self-test` already discovers the test via its `bin/*-test` glob.

## Historical closure

- **TASK-014 / AUDIT-BOUNDARY-01 — deterministic task change boundaries.** Baseline fingerprints, task-owned path classification, scope expansion evidence, risk escalation, independent review, and DONE denial are executable in `delivery-ledger`; its mutation-backed regression matrix passes locally.
- **Duplicate task ID correction (2026-08-19).** TASK-017 was issued twice: first for AUDIT-CI-02 on 2026-08-17, then again for REQ-OMP-ROUTING-COLLISION on 2026-08-18. The routing/collision task is now TASK-019, so task IDs here are unique but no longer chronological. Its immutable delivery evidence (`RUN-20260818T084140Z-30974d4a`, `RUN-20260818T085852Z-dc09a68d`) still records `TASK-017`; `.delivery` history is never rewritten to match. Match a run to a task by requirement ID.
- Prior completed tasks and dated audit closure evidence are retained in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Archived prose is historical, never current pass evidence.
