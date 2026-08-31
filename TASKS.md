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

### TASK-035: Resume from the repository, not from the conversation
- **Requirement:** REQ-RESUME-AUTHORITY
- **Risk Level:** R1
- **Allowed Paths:** `bin/resume-brief`, `bin/resume-brief-test`, `bin/device-verify`, `config/ai/runtime-commands.txt`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.resume`
- **Accepted Invariants:** the brief reports only what it can read from disk, and never presents an asserted check as an executed one
- **Regression Checks:** `resume-brief-test`, `ai-policy-lint`
- **Runtime Evidence:** the §25 scenario executed — start, partial evidence, fresh process, correct resume
- **Reopen Conditions:** a fresh session needs chat history to find the next task
- **Non-Scope:** deciding which task to do; the brief informs, the operator chooses
- **Verification:** `bin/resume-brief-test`
- **Escalation Conditions:** repository state is ambiguous about what is open

### TASK-034: A gate that lies about a healthy machine
- **Requirement:** REQ-CROSS-DEVICE-VERIFICATION
- **Risk Level:** R1
- **Allowed Paths:** `bin/device-verify`, `bin/dev-ready`, `bin/ai-doctor`, `bin/ai-policy-lint`, `TASKS.md`, `docs/device-reports/**`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.device-verification`
- **Accepted Invariants:** a gate reaches every directory the device installs into, and its report states the PATH it used
- **Regression Checks:** `dev-ready-test`, `ai-policy-lint`
- **Runtime Evidence:** macOS reports 184018Z (4 FAIL) -> 185530Z (2 FAIL) -> successor
- **Reopen Conditions:** a device report blames a command that is in fact installed
- **Non-Scope:** installing runtimes or repairing mise on any device
- **Verification:** `bin/device-verify` on both devices
- **Escalation Conditions:** a device installs into a directory no gate can predict

### TASK-033: What only macOS could find
- **Requirement:** REQ-CROSS-DEVICE-VERIFICATION
- **Risk Level:** R1
- **Allowed Paths:** `bin/dev-ready`, `bin/dev-ready-test`, `bin/device-verify`, `bin/ai-doctor`, `bin/ai-policy-lint`, `TASKS.md`, `docs/device-reports/**`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.readiness`, `runtime.device-verification`
- **Accepted Invariants:** a tool that cannot run says so precisely; it never reports a verdict it did not reach
- **Regression Checks:** `dev-ready-test`, `ai-policy-lint`
- **Runtime Evidence:** macOS report 2026-08-31T184018Z (4 gates FAILED) and its successor
- **Reopen Conditions:** a device report names a cause that is not the real one
- **Non-Scope:** installing node or actionlint on any device
- **Verification:** `bin/device-verify` on both devices
- **Escalation Conditions:** a platform difference cannot be expressed without weakening a gate

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
