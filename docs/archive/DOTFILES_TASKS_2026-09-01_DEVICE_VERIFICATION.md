# Archived task contracts — device verification and resume

Moved out of `TASKS.md` on 2026-09-04 to stay inside the hot-context budget.
Every contract here has ledger evidence ending in PASS.

TASK-042 and TASK-043 arrived last, on 2026-09-04. Their 2026-09-01 runs ended
`BLOCKED` under the rule `3820a1e` later relaxed — one that refused any run
containing a FAIL at all — and were never re-closed, so `resume-brief` still
offered finished work as the two things to resume. TASK-047 closed them the
`d479ceb` way: a fresh run each, re-executing the checks their contracts name
(`RUN-20260904T035817Z-40495c25`, `RUN-20260904T035855Z-652b034b`). They were
held in the live file until then on purpose, because the archive retires a task
from the brief and archiving them first would have hidden the gap rather than
closed it.

### TASK-044: A bound that only bounds where it was written
- **Requirement:** REQ-CROSS-DEVICE-VERIFICATION
- **Risk Level:** R1
- **Depends On:** TASK-043
- **Allowed Paths:** `config/ai/hooks/memory-usage.sh`, `bin/memory-usage-hook-test`, `bin/_toolchain-path.sh`, `bin/toolchain-path-test`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.device-verification`
- **Accepted Invariants:** a function named `bounded` is bounded on every device, or it says out loud that it is not
- **Regression Checks:** `memory-usage-hook-test`, `toolchain-path-test`
- **Runtime Evidence:** the hook ran a 30s child to completion without GNU timeout; it now stops at 5s, proven with the fallback disabled
- **Reopen Conditions:** a guard depends on a GNU-only tool without a fallback
- **Non-Scope:** installing coreutils on any device
- **Verification:** `bin/memory-usage-hook-test`
- **Escalation Conditions:** a bound cannot be expressed without a new dependency

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

## Done — prose closures carried over verbatim
Completed task contracts through TASK-023 are archived in:

- `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`
- `docs/archive/DOTFILES_TASKS_2026-08-18_THROUGH_2026-08-23.md`

- **TASK-028 / REQ-OMP-MAC-PORTABLE-VALIDATION — completed 2026-08-31 (R1).** Portable OMP reference validation is provider-aware: invalid selectors, thinking levels, and visual fallbacks still fail under an authenticated provider; other reference providers are explicitly `unjudged`. Native runtime validation remains strict.

- **TASK-013 / AUDIT-CI-01 — hosted GitHub Actions execution, resolved 2026-09-01 (R2).** Not a billing problem any more: the repository is public, where Actions minutes are free, and the Ubuntu/macOS matrix has been starting and concluding normally all along. Runs `33425819903` and `33426199372` concluded `failure` on real defects and later runs concluded `success` — execution was never blocked, the claim here was simply stale. Nothing was changed to achieve this and CI was not weakened.

- **TASK-027 / REQ-CROSS-DEVICE-VERIFICATION — completed 2026-09-01 (R1).** `ongkis-MacBook-Air` runs 8/8 after four rounds of findings; reports committed under `docs/device-reports/`. Two of the four original failures were the gate misreading a healthy machine, and one was a bug in `dev-ready` itself. Evidence: `device-verify-linux` executed, macOS recorded as asserted with its committed report.

## Historical closure — carried over verbatim
- **TASK-014 / AUDIT-BOUNDARY-01 — deterministic task change boundaries.** Baseline fingerprints, task-owned path classification, scope expansion evidence, risk escalation, independent review, and DONE denial are executable in `delivery-ledger`; its mutation-backed regression matrix passes locally.
- **Duplicate task ID correction (2026-08-19).** TASK-017 was issued twice: first for AUDIT-CI-02 on 2026-08-17, then again for REQ-OMP-ROUTING-COLLISION on 2026-08-18. The routing/collision task is now TASK-019, so task IDs here are unique but no longer chronological. Its immutable delivery evidence (`RUN-20260818T084140Z-30974d4a`, `RUN-20260818T085852Z-dc09a68d`) still records `TASK-017`; `.delivery` history is never rewritten to match. Match a run to a task by requirement ID.
- Prior completed tasks and dated audit closure evidence are retained in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Archived prose is historical, never current pass evidence.

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

### TASK-043: Probe the runtime the way it is actually used
- **Requirement:** REQ-CROSS-DEVICE-VERIFICATION
- **Risk Level:** R1
- **Allowed Paths:** `bin/_toolchain-path.sh`, `bin/toolchain-path-test`, `bin/device-verify`, `config/ai/runtime-commands.txt`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.device-verification`
- **Accepted Invariants:** a runtime candidate is accepted only if it answers under an isolated HOME, since that is how every test invokes it
- **Regression Checks:** `toolchain-path-test`, `device-verify-test`
- **Runtime Evidence:** macOS `ai-learn-test` went from FAIL to PASS; the Mac now resolves the install path, Linux still the shim
- **Reopen Conditions:** a runtime resolves in an interactive shell and fails inside a gate
- **Non-Scope:** repairing mise, or authenticating it against GitHub
- **Verification:** `bin/toolchain-path-test`
- **Escalation Conditions:** a runtime cannot be probed without side effects

## Closed on 2026-09-04 while archiving

- **TASK-022 / REQ-DELIVERY-CONTRACT-GAPS — done.** `config/ai/runtime-commands.txt` lists `project-check-test` and `ai-policy-lint` reports every `bin/` command listed; the deferral note outlived the fix.
