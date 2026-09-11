# Tasks — dotfiles

Updated: 2026-09-11

The sole executable queue. Completed contracts live under `docs/archive/`;
repository tests and runtime evidence outrank prose.

## Task contract

Fields and risk rules: `config/templates/TASKS.md`. R0 may infer one obvious file;
R1 stays bounded; R2 names its surface; R3/R4 add protected surfaces and review.
Only the dependency edge is human-authored; state is derived.

## In progress

_None._

## Recently completed

- **TASK-072 / REQ-TEST-EFFICACY (R2).** `mutation-sweep --subject <name>` mutates the
  subject instead of stubbing it, closing the limit recorded on 2026-09-04: stubbing asks
  whether a test asserts anything, mutating asks whether it would notice a plausible bug,
  and nine of ten tests passed the stub then fell to a hand mutation days later. Two
  operators only — a guard that stops firing, a refusal that stops refusing — because every
  defect found here was one of those two shapes and a wider set produces equivalent mutants
  that drown the signal. Opt-in and bounded: `ai-policy-lint` takes 14 seconds, so mutating
  it costs minutes. First run found real gaps — `inspect-project` 5, `dotpush` 8, `tmux-clip`
  4, `tmux-battery` 4. A subject the bash-shaped operators cannot reach reports UNMEASURED
  and fails the run; a 0 that means untested must not read as covered. It also checks the
  test passes UNMUTATED first, because a test already failing makes every mutant look killed.
  Two pre-existing bugs fixed on the way: the runner captured output through a command
  substitution, so an orphaned child kept the pipe open and a 2-second bound measured 30
  seconds; and the mutation runner did not close stdin while the stub runner did.

- **TASK-073 / REQ-MUTATION-COVERAGE (R2).** The two operators now have python shapes:
  `if COND:` / `elif COND:` becomes `if False:`, and `sys.exit(N)` / `raise SystemExit(N)`
  becomes a zero exit. Still two operators, still one per shape — the language changed, the
  question did not. `ai-policy-lint` went from UNMEASURED to 13 surviving mutants on its
  first run, so the half of `bin/` the sweep could not read was not the covered half.
  UNMEASURED survives for node and still fails the run, now naming the language it has no
  shapes for rather than claiming the operators are bash-shaped. Existing bash verdicts were
  proven unchanged rather than assumed: the pre-change binary and the new one produce
  byte-identical reports for `tmux-battery`, `tmux-clip` and `security-check`. A compile
  check on each mutant was written and then removed — applying both operators to every
  matching line of all 23 python subjects yields 519 mutants and 0 that fail to parse, so
  the check could never fire, and a guard that cannot fire is decoration. One recorded
  number was wrong, not regressed: `dev-ready` is 4 survivors, not the 3 the batch run
  reported; the pre-change binary agrees at 4, so the batch under load lost one mutant to a
  timeout that counted as killed. The R3 review found three real defects, none of them
  visible by reading: the working copy of `bin/mutation-sweep` had a diff of the other file
  appended to it by a `$_` that expands to the last argument BEFORE a redirect, not to the
  redirect target, so the tool aborted under `set -u` and returned 1 for every run; the
  operator was dispatched on the substring `exit`, which sent the guard header
  `if msg == "call sys.exit(1) to quit":` down the refusal branch and rewrote its string
  literal instead — the operators stayed two in name and became something else in fact, now
  dispatched on which shape the line IS; and two assertions read "this line is absent from
  the survivor list", which passes equally when a mutant was killed and when it was never
  generated, now backed by a fixture asserting the denominator (three shapes in, `3/3`
  noticed). All three fixes were proven to bite by hand-mutating the tool: reverting the
  dispatch, breaking the python guard shape, and letting UNMEASURED exit 0 each fail the
  suite. Known limit, measured rather than assumed: the guard pattern is textual, so an
  `if ...:` inside a docstring would be mutated as code — 0 of 518 matched lines in the 23
  python subjects are anything but a real `if` per `ast`, so it is a latent trap, TASK-076.

## Done

Archived under `docs/archive/`, newest `DOTFILES_TASKS_2026-09-10_TEST_EFFICACY.md`,
then `DOTFILES_TASKS_2026-09-04_QUEUE.md`
(TASK-047..059), then `DOTFILES_TASKS_2026-09-01_DEVICE_VERIFICATION.md`
(TASK-038–041, 044; prose closures for TASK-013/022/027/028).

## Pending

### TASK-074: Fifty-three mutants nothing notices
- **Requirement:** REQ-MUTATION-COVERAGE
- **Risk Level:** R2
- **Allowed Paths:** `bin/*-test`, `TASKS.md`, `.delivery/**`
- **Protected Paths:** every non-test path under `bin/`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** each closed gap is an assertion about the subject's contract, never a restatement of what it currently prints; a mutant proven to change nothing is recorded in `EQUIVALENT_MUTANTS` with its reason rather than papered over with an assertion; no test gains a live side effect — network, install, or secret read — to reach a branch
- **Regression Checks:** `mutation-sweep`, `ai-policy-lint`, the touched `bin/*-test` suites
- **Runtime Evidence:** 79 surviving mutants across 14 bash subjects, ranked 2026-09-10: `device-register` 11, `secrets-env` 10, `9router-credential-migrate` 9, `dotsync` 7, `mutation-sweep` 6, `inspect-project` 5, `dotpush` 5, then `vps-pgdump`, `tmux-clip`, `tmux-battery`, `security-check`, `pi-9router-restore` at 4, and `pi-update-safe`, `dev-ready` at 3. Take the security-critical ones first regardless of count: `secrets-env` reads and injects credentials and `security-check` is what stops a secret reaching a commit, and between them 14 mutants pass unnoticed. Three subjects are already clean — `shopify-content-helper`, `device-verify`, `ai-learn` — so zero is reachable rather than aspirational. The ranking grows once TASK-073 lands, which is why it depends on it
- **Reopen Conditions:** a subject regresses to surviving mutants after being closed
- **Non-Scope:** changing any subject to make it easier to test; the UNMEASURED subjects until TASK-073 reaches them
- **Verification:** `bin/mutation-sweep --subject <name>` reports zero survivors for each subject the run claims
- **Escalation Conditions:** a branch cannot be reached without a live side effect, in which case the mutant is recorded as accepted with the reason rather than the test bent to reach it

### TASK-075: A clean subject vanishes from a multi-subject report
- **Requirement:** REQ-MUTATION-COVERAGE
- **Risk Level:** R1
- **Allowed Paths:** `bin/mutation-sweep`, `bin/mutation-sweep-test`, `TASKS.md`, `.delivery/**`
- **Protected Paths:** `bin/*-test`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** a subject's own verdict is decided by its own counters; the run's exit code keeps deciding on the totals, because one gap anywhere must still fail the run
- **Regression Checks:** `mutation-sweep-test`
- **Runtime Evidence:** the per-subject KILLED row is gated on the GLOBAL `survived_total` and `errored`, not on the subject's own `survived`. `mutation-sweep --subject device-verify` reports `KILLED 4/4` and one subject fully covered; `mutation-sweep --subject pi-update-safe device-verify` reports the same three `pi-update-safe` survivors and then says **0 subject(s) fully covered**, with `device-verify` absent from the report entirely. Found 2026-09-11 while proving TASK-073 changed no bash verdict. Left unfixed there on purpose: that task's invariant was that existing verdicts do not move, and this fix moves them — it puts rows back that the report is currently dropping
- **Reopen Conditions:** a subject's verdict depends on any counter but its own
- **Non-Scope:** the exit-code rule, which is correct as it stands; closing any gap the restored rows reveal
- **Verification:** `bin/mutation-sweep --subject pi-update-safe device-verify` names `device-verify` as fully covered while still exiting non-zero
- **Escalation Conditions:** restoring the dropped rows reveals that a subject reported covered in an earlier batch was never actually clean, which would make every batch-derived ranking suspect

### TASK-076: The guard pattern reads text, not code
- **Requirement:** REQ-MUTATION-COVERAGE
- **Risk Level:** R2
- **Allowed Paths:** `bin/mutation-sweep`, `bin/mutation-sweep-test`, `TASKS.md`, `.delivery/**`
- **Protected Paths:** `bin/*-test`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** a line that is not a statement is never mutated as one; the operators stay two in kind; a subject that cannot be parsed is UNMEASURED rather than skipped silently; existing verdicts move only where the moved verdict was wrong, and each move is named
- **Regression Checks:** `mutation-sweep-test`, `ai-policy-lint`
- **Runtime Evidence:** the python guard pattern `^[[:space:]]*(if|elif)[[:space:]].*:[[:space:]]*$` matches any line of that shape, including one inside a triple-quoted string; the R3 review of TASK-073 built a subject whose docstring contains `if x > 0:` and the sweep reported it as a surviving guard at that line. Measured on the real repository the same day: `ast` says 0 of 518 matched lines across the 23 python subjects are anything but a genuine `if`/`elif`, so this costs nothing today and is a trap for the first subject with a worked example in its docstring. The same textual pattern also never reaches `if x:  # type: ignore`, a common idiom, because it requires the colon to be the last character. Both are the escalation condition TASK-073 named: reaching them needs a parser
- **Reopen Conditions:** a reported line number turns out not to be a statement
- **Non-Scope:** bash, which has no docstrings and where the same pattern is sound; adding a third operator; closing any gap the corrected targeting reveals
- **Verification:** a subject whose docstring contains a guard-shaped line reports no mutant for that line, and one whose guard carries a trailing comment does report one
- **Escalation Conditions:** parsing makes the sweep depend on the subject's own interpreter being importable, which would make an unparseable subject unmeasurable rather than merely under-measured
