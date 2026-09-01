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

### TASK-042: One definition of where this machine's runtimes are
- **Requirement:** REQ-CROSS-DEVICE-VERIFICATION
- **Risk Level:** R1
- **Allowed Paths:** `bin/_toolchain-path.sh`, `bin/ai-doctor`, `bin/dev-ready`, `bin/device-verify`, `bin/device-verify-test`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.device-verification`
- **Accepted Invariants:** every owned command resolves node the same way, and a gate is starred only for work it actually skipped
- **Regression Checks:** `device-verify-test`, `ai-policy-lint`
- **Runtime Evidence:** macOS starred `dev-ready-test` for a passing case name containing "degraded"; `ai-learn-test` failed on a dangling shim `ai-doctor` could not see past
- **Reopen Conditions:** a fourth copy of the node-resolution rule appears
- **Non-Scope:** repairing mise on any device
- **Verification:** `bin/device-verify` on both devices
- **Escalation Conditions:** a runtime lives somewhere this file does not know

### TASK-041: Pin what the sync tool promises
- **Requirement:** REQ-SYNC-SAFETY
- **Risk Level:** R1
- **Allowed Paths:** `bin/dotsync-test`, `config/ai/runtime-commands.txt`, `TASKS.md`
- **Protected Paths:** `bin/dotsync`
- **Canonical Contract Owners:** `runtime.sync`
- **Accepted Invariants:** dotsync acts on the repository its script lives in, refuses to mutate without a TTY or `--yes`, and will not commit without a passing security scan
- **Regression Checks:** `dotsync-test`, `ai-policy-lint`
- **Runtime Evidence:** four mutations — auto-consent, skipped scan, no `cd`, no empty-commit guard — each fail named cases
- **Reopen Conditions:** `dotsync` gains a mutating path with no case covering it
- **Non-Scope:** changing `git add -A` behaviour; the sweep is pinned, not redesigned
- **Verification:** `bin/dotsync-test`
- **Escalation Conditions:** the sweep must become selective

### TASK-040: A task lifecycle that cannot go stale
- **Requirement:** REQ-TASK-GRAPH
- **Depends On:** TASK-037
- **Risk Level:** R1
- **Allowed Paths:** `bin/resume-brief`, `bin/resume-brief-test`, `bin/ai-policy-lint`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.resume`
- **Accepted Invariants:** only the dependency edge is human-authored; every other lifecycle fact is derived from ledger evidence and cannot contradict it
- **Regression Checks:** `resume-brief-test`, `ai-policy-lint`
- **Runtime Evidence:** an unmet dependency marks a task waiting and names the blocker; a dangling edge fails the lint
- **Reopen Conditions:** a written-down status field appears in a task contract
- **Non-Scope:** deciding which ready task to take
- **Verification:** `bin/resume-brief-test`
- **Escalation Conditions:** a dependency cycle needs expressing

### TASK-039: What five rounds of independent review found
- **Requirement:** REQ-REVIEW-REMEDIATION
- **Risk Level:** R2
- **Allowed Paths:** `bin/**`, `TASKS.md`, `docs/**`, `config/ai/runtime-commands.txt`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.readiness`, `runtime.resume`, `runtime.device-verification`, `runtime.memory-bootstrap`
- **Accepted Invariants:** every guard has a mutation that fails a named case; a test cannot damage the repository it tests; a refusal never damages what it refuses to touch
- **Regression Checks:** `ai-memory-link-test`, `dev-ready-test`, `resume-brief-test`, `device-verify-test`, `ai-policy-lint`
- **Runtime Evidence:** five review passes; every surviving finding closed with a mutation that bites
- **Reopen Conditions:** a guard is added without a mutation proving its case fails
- **Non-Scope:** rewriting the pushed commits whose messages the review corrected
- **Verification:** `bin/ai-doctor --self-test`
- **Escalation Conditions:** a defect class recurs after being fixed twice

### TASK-038: Guard the gate that judges every device
- **Requirement:** REQ-CROSS-DEVICE-VERIFICATION
- **Risk Level:** R1
- **Allowed Paths:** `bin/device-verify-test`, `config/ai/runtime-commands.txt`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.device-verification`
- **Accepted Invariants:** a failing gate is named by its own failing line, and a gate that judged nothing is never reported as a plain PASS
- **Regression Checks:** `device-verify-test`, `ai-policy-lint`
- **Runtime Evidence:** two mutations — removing `PASS*` and removing the failing-line extraction — each fail the suite
- **Reopen Conditions:** device-verify changes without a case covering the change
- **Non-Scope:** running device-verify-test from inside device-verify; `ai-doctor --self-test` discovers it and CI runs that
- **Verification:** `bin/device-verify-test`
- **Escalation Conditions:** a gate's behaviour cannot be reproduced with a stub root

### TASK-037: A resume brief that hides retired work and watches CI
- **Requirement:** REQ-RESUME-AUTHORITY
- **Risk Level:** R1
- **Allowed Paths:** `bin/resume-brief`, `bin/resume-brief-test`, `TASKS.md`, `docs/**`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.resume`
- **Accepted Invariants:** a task retired in `docs/archive` is never a resume candidate, and CI status is best-effort and never fails the brief
- **Regression Checks:** `resume-brief-test`, `ai-policy-lint`
- **Runtime Evidence:** TASK-023 left the candidate list; CI line reports honestly when no run was triggered
- **Reopen Conditions:** a retired task reappears as a candidate, or a red CI goes unmentioned
- **Non-Scope:** making CI green, or deciding which task to resume
- **Verification:** `bin/resume-brief-test`
- **Escalation Conditions:** `gh` is the only way to see CI and it is unavailable everywhere

### TASK-036: A PASS that judged nothing is a different fact
- **Requirement:** REQ-CROSS-DEVICE-VERIFICATION
- **Risk Level:** R1
- **Allowed Paths:** `bin/device-verify`, `TASKS.md`, `docs/device-reports/**`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.device-verification`
- **Accepted Invariants:** a gate that exits 0 while leaving something unexamined is reported as `PASS*` and the omission is named
- **Regression Checks:** `ai-policy-lint`, `dev-ready-test`
- **Runtime Evidence:** `rich-2026-08-31T191525Z.md` marks 50 unjudged selectors that earlier reports hid
- **Reopen Conditions:** a report shows a bare PASS for a gate that skipped work
- **Non-Scope:** installing the tools a device lacks
- **Verification:** `bin/device-verify` on both devices
- **Escalation Conditions:** a gate cannot express what it skipped

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

## Done

Completed task contracts through TASK-023 are archived in:

- `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`
- `docs/archive/DOTFILES_TASKS_2026-08-18_THROUGH_2026-08-23.md`

- **TASK-028 / REQ-OMP-MAC-PORTABLE-VALIDATION — completed 2026-08-31 (R1).** Portable OMP reference validation is provider-aware: invalid selectors, thinking levels, and visual fallbacks still fail under an authenticated provider; other reference providers are explicitly `unjudged`. Native runtime validation remains strict.

- **TASK-013 / AUDIT-CI-01 — hosted GitHub Actions execution, resolved 2026-09-01 (R2).** Not a billing problem any more: the repository is public, where Actions minutes are free, and the Ubuntu/macOS matrix has been starting and concluding normally all along. Runs `33425819903` and `33426199372` concluded `failure` on real defects and later runs concluded `success` — execution was never blocked, the claim here was simply stale. Nothing was changed to achieve this and CI was not weakened.

- **TASK-027 / REQ-CROSS-DEVICE-VERIFICATION — completed 2026-09-01 (R1).** `ongkis-MacBook-Air` runs 8/8 after four rounds of findings; reports committed under `docs/device-reports/`. Two of the four original failures were the gate misreading a healthy machine, and one was a bug in `dev-ready` itself. Evidence: `device-verify-linux` executed, macOS recorded as asserted with its committed report.

## Pending


- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until at least five immutable real delivery records exist for one skill. Then run `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`; never fabricate or promote synthetic attribution.

- **TASK-022 / REQ-DELIVERY-CONTRACT-GAPS — wire `project-check-test` into `config/ai/runtime-commands.txt` (R1).** Same deferral reason as TASK-021, same file class. Cosmetic only: `ai-doctor --self-test` already discovers the test via its `bin/*-test` glob.

## Historical closure

- **TASK-014 / AUDIT-BOUNDARY-01 — deterministic task change boundaries.** Baseline fingerprints, task-owned path classification, scope expansion evidence, risk escalation, independent review, and DONE denial are executable in `delivery-ledger`; its mutation-backed regression matrix passes locally.
- **Duplicate task ID correction (2026-08-19).** TASK-017 was issued twice: first for AUDIT-CI-02 on 2026-08-17, then again for REQ-OMP-ROUTING-COLLISION on 2026-08-18. The routing/collision task is now TASK-019, so task IDs here are unique but no longer chronological. Its immutable delivery evidence (`RUN-20260818T084140Z-30974d4a`, `RUN-20260818T085852Z-dc09a68d`) still records `TASK-017`; `.delivery` history is never rewritten to match. Match a run to a task by requirement ID.
- Prior completed tasks and dated audit closure evidence are retained in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Archived prose is historical, never current pass evidence.
