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

### TASK-026: Check the command manifest in both directions
- **Requirement:** REQ-DELIVERY-CONTRACT-GAPS
- **Risk Level:** R1
- **Allowed Paths:** `config/ai/runtime-commands.txt`, `bin/ai-policy-lint`, `bin/ai-policy-lint-test`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.command-manifest`
- **Accepted Invariants:** every extensionless executable in `bin/` is listed, and every listed entry exists
- **Regression Checks:** `ai-policy-lint`, `installer-link-test`
- **Runtime Evidence:** removing an entry fails the lint by name
- **Reopen Conditions:** a `bin/` command exists that no installer links
- **Non-Scope:** helper scripts carrying a suffix, which are sourced rather than linked
- **Verification:** `bin/ai-policy-lint`
- **Escalation Conditions:** the extensionless convention stops distinguishing commands from helpers

`installer-link-test` proved every manifest entry resolves to an executable.
Nothing proved the reverse, so a command could live in `bin/` and never reach
`~/.local/bin` on any device — invisible on the machine that wrote it, absent
everywhere else. TASK-022 fixed four such commands and still missed
`omp-runtime-report`, because its own check compared `bin/*-test` against the
manifest's `-test` entries; a non-test command was outside the question it asked.

Found while setting the Mac up, by the symlink that did not appear.

### TASK-021: Make the parallel-child example executable, not proofread
- **Requirement:** REQ-DELIVERY-CONTRACT-GAPS
- **Risk Level:** R1
- **Allowed Paths:** `docs/task-change-boundary.md`, `bin/delivery-ledger-test`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `delivery.parallel-child-contract`
- **Accepted Invariants:** the published `start-child` block runs against the shipped binary
- **Regression Checks:** `delivery-ledger-test`
- **Runtime Evidence:** the test extracts the block from the document and executes it
- **Reopen Conditions:** the document publishes a `start-child` block the test cannot run
- **Non-Scope:** `integrate-child`, which needs a patch the document does not carry
- **Verification:** `bash bin/delivery-ledger-test`
- **Escalation Conditions:** the example cannot be run without inventing state the document omits

TASK-020's routing-provenance guard broke the block eleven days ago and nothing
noticed: it omitted `--model/--provider/--reasoning-effort`, argparse defaulted
them to `unknown`, and the guard refused the run. Fixed, and now extracted from
the document and executed by `delivery-ledger-test` — proofreading is what let it
rot. The pending entry expected `--accept-dirty`; it was not needed, because the
file was clean by the time this ran.

Writing the test surfaced a second thing the document only implies: producing the
child's patch before `start-child` makes the child's boundary overlap the parent's
dirty tree, which the ledger correctly refuses. The order is now stated.

### TASK-025: Executed evidence for delivery checks
- **Requirement:** REQ-EXECUTABLE-EVIDENCE
- **Risk Level:** R2
- **Allowed Paths:** `bin/delivery-ledger`, `bin/delivery-ledger-test`, `docs/task-change-boundary.md`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `delivery.verification-event`
- **Accepted Invariants:** a recorded status is either derived from an exit code or explicitly declared, never both
- **Regression Checks:** `delivery-ledger-test`, `ai-policy-lint`
- **Runtime Evidence:** this run's own verification events carry `executed.exitCode`
- **Reopen Conditions:** a PASS is recorded for a check that has an exit code but was not run
- **Non-Scope:** child-run recording, browser evidence
- **Verification:** `bash bin/delivery-ledger-test`
- **Escalation Conditions:** the flag cannot derive a status without shelling out unsafely

`record --command` runs the check and derives the status from its exit code;
`--status` alongside it is refused, because an agent that may both run a check and
name its result can skip the first half. Motivated by this repository accepting
`installer-link-test PASS` detailed "pending run below" earlier the same day —
recorded before the check ran, by the session building these gates.

The first attempt at this run was finished `BLOCKED`: the new flag was exercised
inside the live run, and a deliberate `exit 3` probe recorded a real FAIL that
correctly barred `PASS`. The ledger behaved exactly as designed; the run did not.

### TASK-022: Register every owned test command in the runtime manifest
- **Requirement:** REQ-DELIVERY-CONTRACT-GAPS
- **Risk Level:** R1
- **Allowed Paths:** `config/ai/runtime-commands.txt`, `TASKS.md`
- **Protected Paths:** None
- **Canonical Contract Owners:** `runtime.command-manifest`
- **Accepted Invariants:** every manifest entry resolves to an executable under `bin/`
- **Regression Checks:** `installer-link-test`, `ai-policy-lint`, `skill-surface-check`
- **Runtime Evidence:** `installer-link-test` reports "runtime command manifest and hook wiring"
- **Reopen Conditions:** a `bin/*-test` exists that the manifest does not list
- **Non-Scope:** installer behaviour, hook wiring
- **Verification:** `installer-link-test`
- **Escalation Conditions:** manifest and `bin/` disagree after one repair attempt

Four commands were unregistered, not the one the pending entry named:
`ai-memory-link-test`, `project-check-test`, `vendored-refresh-test`, and
`omp-runtime-report-test` — the last added earlier the same day by the session
that then found the gap. `ai-doctor --self-test` discovers tests through its own
`bin/*-test` glob, so nothing was broken; the manifest is what every installer
links into `~/.local/bin`, so an unregistered command simply never arrives on a
new device.

## Done

Completed task contracts through TASK-023 are archived in:

- `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`
- `docs/archive/DOTFILES_TASKS_2026-08-18_THROUGH_2026-08-23.md`

## Pending

- **TASK-012 / AUDIT-MON-01 — measure real skill effectiveness (R0).** Dormant until at least five immutable real delivery records exist for one skill. Then run `ai-skill-evolution --repo <repo> --dotfiles ~/dotfiles --json`; never fabricate or promote synthetic attribution.
- **TASK-013 / AUDIT-CI-01 — restore hosted GitHub Actions execution (R2).** Human billing owner must remove the external Actions block, then a fresh Ubuntu/macOS matrix must start and conclude normally. AI must not change billing or weaken CI.
- **TASK-022 / REQ-DELIVERY-CONTRACT-GAPS — wire `project-check-test` into `config/ai/runtime-commands.txt` (R1).** Same deferral reason as TASK-021, same file class. Cosmetic only: `ai-doctor --self-test` already discovers the test via its `bin/*-test` glob.

## Historical closure

- **TASK-014 / AUDIT-BOUNDARY-01 — deterministic task change boundaries.** Baseline fingerprints, task-owned path classification, scope expansion evidence, risk escalation, independent review, and DONE denial are executable in `delivery-ledger`; its mutation-backed regression matrix passes locally.
- **Duplicate task ID correction (2026-08-19).** TASK-017 was issued twice: first for AUDIT-CI-02 on 2026-08-17, then again for REQ-OMP-ROUTING-COLLISION on 2026-08-18. The routing/collision task is now TASK-019, so task IDs here are unique but no longer chronological. Its immutable delivery evidence (`RUN-20260818T084140Z-30974d4a`, `RUN-20260818T085852Z-dc09a68d`) still records `TASK-017`; `.delivery` history is never rewritten to match. Match a run to a task by requirement ID.
- Prior completed tasks and dated audit closure evidence are retained in `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`. Archived prose is historical, never current pass evidence.
