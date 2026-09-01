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
