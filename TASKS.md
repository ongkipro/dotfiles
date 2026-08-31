# Tasks — dotfiles

Updated: 2026-08-28

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

_None._

## Recently completed

### TASK-032: The portable reference must not demand one device's providers
- **Requirement:** REQ-PORTABLE-ROUTING
- **Risk Level:** R1
- **Allowed Paths:** `bin/omp-effective-routing-test`, `config/omp/STATUS.md`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.routing-validation`
- **Accepted Invariants:** a selector under a provider the device authenticates is judged; one under an absent provider is reported unjudged, never passed silently
- **Regression Checks:** `omp-effective-routing-test`, `ai-policy-lint`
- **Runtime Evidence:** mutation D (unknown model, present provider) FAILs; mutation E (absent provider) reports unjudged
- **Reopen Conditions:** a device passes this gate while its own routing is broken
- **Non-Scope:** forcing the native config to match the tracked reference
- **Verification:** `bin/omp-effective-routing-test`
- **Escalation Conditions:** two devices need mutually incompatible reference selectors

### TASK-031: A readiness gate that runs before development, not after it
- **Requirement:** REQ-DEV-READINESS
- **Risk Level:** R1
- **Allowed Paths:** `bin/dev-ready`, `bin/dev-ready-test`, `config/ai/runtime-commands.txt`, `TASKS.md`, `bin/device-verify`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** every check has a constructed failing case; a blocker names the precise missing capability and never downgrades the task
- **Regression Checks:** `dev-ready-test`, `ai-policy-lint`
- **Runtime Evidence:** `dev-ready` against this repository
- **Reopen Conditions:** a check passes on a repository that cannot actually be developed in
- **Non-Scope:** repairing anything it finds, or installing a missing capability
- **Verification:** `bin/dev-ready-test`
- **Escalation Conditions:** a required capability has no valid fallback

### TASK-030: The read-only memory bootstrap must actually be read-only
- **Requirement:** REQ-MEMORY-OWNERSHIP
- **Risk Level:** R1
- **Allowed Paths:** `bin/ai-memory-link`, `config/ai/project-memory/**`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.memory-bootstrap`
- **Accepted Invariants:** the runtime directory is mode 500 with exactly one mode-400 `MEMORY.md`, on every path including refusal
- **Regression Checks:** `ai-policy-lint`, `ai-doctor`
- **Runtime Evidence:** `memory-bootstrap-sealed` recorded via `record --command`
- **Reopen Conditions:** a second file appears in a bootstrap directory on any device
- **Non-Scope:** changing what Claude Code writes, or where its auto-memory goes
- **Verification:** `memory-bootstrap-sealed`
- **Escalation Conditions:** a device needs the directory writable for a reason the contract does not cover

### TASK-029: One command that verifies a device and reports back
- **Requirement:** REQ-CROSS-DEVICE-VERIFICATION
- **Risk Level:** R1
- **Allowed Paths:** `bin/device-verify`, `config/ai/runtime-commands.txt`, `TASKS.md`, `docs/device-reports/**`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.device-verification`
- **Accepted Invariants:** the command repairs nothing and its report names the failing line
- **Regression Checks:** `ai-policy-lint`, `omp-effective-routing-test`
- **Runtime Evidence:** `docs/device-reports/rich-*.md` from this machine
- **Reopen Conditions:** a report names a separator or tally instead of the failure
- **Non-Scope:** repairing anything it finds
- **Verification:** `bin/device-verify`
- **Escalation Conditions:** a gate cannot run on a device for reasons the report cannot express

`bin/device-verify` runs every gate, records the platform facts that actually
differ between machines (omp location, authenticated providers, sed flavour,
unlinked manifest commands), writes `docs/device-reports/<host>-<utc>.md`, and
exits non-zero if anything failed. The report travels by git, so a device reports
back without a live session between them.

Its first run found two things immediately. The new command was itself unlisted
in the manifest, so TASK-026's guard fired on its author. And the report's "last
line" for a failing gate was `────────────`, which told nobody anything — the
line a reader needs is the first one naming the problem, not the last one
printed. Both fixed.

### TASK-028: Stop narrowing capacity below what OMP itself ships
- **Requirement:** REQ-FULLSTACK-CAPACITY
- **Risk Level:** R2
- **Allowed Paths:** `config/omp/config.yml`, `bin/omp-effective-routing-test`, `config/omp/ROUTING.md`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `omp.capacity-profile`
- **Accepted Invariants:** a deviation from an upstream default is recorded with its reason or removed
- **Regression Checks:** `omp-effective-routing-test`
- **Runtime Evidence:** both values pinned; restoring either fails the suite
- **Reopen Conditions:** an upstream default changes, or a full-stack slice still truncates at the budget
- **Non-Scope:** concurrency, recursion depth, isolation — deliberate deviations that stay
- **Verification:** `bash bin/omp-effective-routing-test`
- **Escalation Conditions:** raising the budget produces runaway subagent cost

`softRequestBudget` 80 -> 200 and `defaultThinkingLevel` `auto` -> `high`, both
upstream's own values. Neither was a decision: they arrived together in 473926c
with a one-line message and no recorded reasoning, and both narrowed the profile
*below* what OMP ships.

80 force-stopped a subagent at 120 requests against upstream's 300; a full-stack
slice can spend that before finishing, and a truncated slice looks finished.
`auto` delegated per-turn reasoning depth to the `tiny` role — Gemini Flash — the
one place in an otherwise explicit routing design where a cheap model decided a
routing parameter, on every turn.

Found by comparing against OMP's real defaults read from an isolated agent
directory, not from its documentation, which does not tabulate these paths.

## Done

Completed task contracts through TASK-023 are archived in:

- `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`
- `docs/archive/DOTFILES_TASKS_2026-08-18_THROUGH_2026-08-23.md`

- **TASK-028 / REQ-OMP-MAC-PORTABLE-VALIDATION — completed 2026-08-31 (R1).** Portable OMP reference validation is provider-aware: invalid selectors, thinking levels, and visual fallbacks still fail under an authenticated provider; other reference providers are explicitly `unjudged`. Native runtime validation remains strict.

## Pending

- **TASK-027 / REQ-CROSS-DEVICE-VERIFICATION — verify the 2026-08-31 gates on macOS (R1).** On `ongkis-macbook-air`: `cd ~/dotfiles && git pull --ff-only && bin/device-verify`, then commit and push `docs/device-reports/`. That one command runs every gate, records this machine's platform facts, and writes the report; it repairs nothing. Report a FAIL as a finding — a gate that is wrong on macOS is a gate to correct in the repository, not to weaken locally. Setup already done there on 2026-08-31: pull, all manifest commands linked, and the blind `vision` fallback replaced (backup at `~/.omp/agent/config.yml.bak-20260831`).

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until at least five immutable real delivery records exist for one skill. Then run `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`; never fabricate or promote synthetic attribution.
- **TASK-013 / AUDIT-CI-01 — restore hosted GitHub Actions execution (R2).** Human billing owner must remove the external Actions block, then a fresh Ubuntu/macOS matrix must start and conclude normally. AI must not change billing or weaken CI.
- **TASK-022 / REQ-DELIVERY-CONTRACT-GAPS — wire `project-check-test` into `config/ai/runtime-commands.txt` (R1).** Same deferral reason as TASK-021, same file class. Cosmetic only: `ai-doctor --self-test` already discovers the test via its `bin/*-test` glob.

## Historical closure

- **TASK-014 / AUDIT-BOUNDARY-01 — deterministic task change boundaries.** Baseline fingerprints, task-owned path classification, scope expansion evidence, risk escalation, independent review, and DONE denial are executable in `delivery-ledger`; its mutation-backed regression matrix passes locally.
- **Duplicate task ID correction (2026-08-19).** TASK-017 was issued twice: first for AUDIT-CI-02 on 2026-08-17, then again for REQ-OMP-ROUTING-COLLISION on 2026-08-18. The routing/collision task is now TASK-019, so task IDs here are unique but no longer chronological. Its immutable delivery evidence (`RUN-20260818T084140Z-30974d4a`, `RUN-20260818T085852Z-dc09a68d`) still records `TASK-017`; `.delivery` history is never rewritten to match. Match a run to a task by requirement ID.
- Prior completed tasks and dated audit closure evidence are retained in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Archived prose is historical, never current pass evidence.
