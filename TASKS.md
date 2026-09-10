# Tasks — dotfiles

Updated: 2026-09-08

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

## Done

Archived under `docs/archive/`, newest `DOTFILES_TASKS_2026-09-10_TEST_EFFICACY.md`,
then `DOTFILES_TASKS_2026-09-04_QUEUE.md`
(TASK-047..059), then `DOTFILES_TASKS_2026-09-01_DEVICE_VERIFICATION.md`
(TASK-038–041, 044; prose closures for TASK-013/022/027/028).

## Pending

### TASK-073: The sweep is blind to more than half of bin/
- **Requirement:** REQ-MUTATION-COVERAGE
- **Risk Level:** R2
- **Allowed Paths:** `bin/mutation-sweep`, `bin/mutation-sweep-test`, `TASKS.md`, `.delivery/**`
- **Protected Paths:** `bin/*-test`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** a Python subject yields guard and refusal mutants the way a bash one does; the operators stay two in kind — a guard that stops firing, a refusal that stops refusing — because a wider set produces equivalent mutants that drown the signal; `UNMEASURED` still fails the run and still names the language, so a subject the operators genuinely cannot reach is never read as covered; every existing bash verdict is unchanged, proven by re-running the same subjects
- **Regression Checks:** `mutation-sweep-test`, `ai-policy-lint`
- **Runtime Evidence:** measured 2026-09-10 across 31 of 44 subjects — **18 are UNMEASURED**, every one of them Python, including `delivery-ledger`, `ai-policy-lint`, `diff-risk`, `migration-risk` and all seven `ai-memory-*` commands. `bin/` is 23 python, 21 bash, 1 node, so the tool sees under half of it and the half it cannot see holds the gates everything else defers to. The 53 surviving mutants found so far are all from bash subjects; the ranking is not yet a ranking of the repository
- **Reopen Conditions:** a language appears in `bin/` that the operators cannot reach and `UNMEASURED` does not name it
- **Non-Scope:** the single node subject unless the same two operators reach it cleanly; closing any gap the extension reveals — that is TASK-074; rewriting any subject
- **Verification:** `bin/mutation-sweep --subject ai-policy-lint` reports mutants rather than `UNMEASURED`, and `bin/mutation-sweep-test` covers a python guard and a python refusal
- **Escalation Conditions:** Python guards cannot be mutated by line without parsing, which would make this a different task

### TASK-074: Fifty-three mutants nothing notices
- **Requirement:** REQ-MUTATION-COVERAGE
- **Risk Level:** R2
- **Depends On:** TASK-073
- **Allowed Paths:** `bin/*-test`, `TASKS.md`, `.delivery/**`
- **Protected Paths:** every non-test path under `bin/`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** each closed gap is an assertion about the subject's contract, never a restatement of what it currently prints; a mutant proven to change nothing is recorded in `EQUIVALENT_MUTANTS` with its reason rather than papered over with an assertion; no test gains a live side effect — network, install, or secret read — to reach a branch
- **Regression Checks:** `mutation-sweep`, `ai-policy-lint`, the touched `bin/*-test` suites
- **Runtime Evidence:** ranked by surviving mutants on 2026-09-10, bash subjects only: `device-register` 11, `9router-credential-migrate` 9, `dotsync` 7, `mutation-sweep` 6, `inspect-project` 5, `dotpush` 5, `pi-9router-restore` 4, `pi-update-safe` 3, `dev-ready` 3. Two subjects are already clean — `device-verify` and `ai-learn` — so a zero here is reachable. The ranking will change once TASK-073 lands, which is why it depends on it
- **Reopen Conditions:** a subject regresses to surviving mutants after being closed
- **Non-Scope:** changing any subject to make it easier to test; the UNMEASURED subjects until TASK-073 reaches them
- **Verification:** `bin/mutation-sweep --subject <name>` reports zero survivors for each subject the run claims
- **Escalation Conditions:** a branch cannot be reached without a live side effect, in which case the mutant is recorded as accepted with the reason rather than the test bent to reach it


