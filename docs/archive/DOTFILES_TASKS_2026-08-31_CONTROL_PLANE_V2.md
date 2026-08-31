# Archived task contracts — control-plane v2

Moved out of `TASKS.md` on 2026-09-01 to stay inside the hot-context budget.
Completed and superseded only; the live queue keeps the recent entries.

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
