# Tasks — dotfiles

Updated: 2026-09-11

The sole executable queue. Completed contracts live under `docs/archive/`;
repository tests and runtime evidence outrank prose.

## Task contract

Fields and risk rules: `config/templates/TASKS.md`. R0 may infer one obvious file;
R1 stays bounded; R2 names its surface; R3/R4 add protected surfaces and review.
Only the dependency edge is human-authored; state is derived.

## Done

Archived under `docs/archive/`, newest `DOTFILES_TASKS_2026-09-11_MUTATION_COVERAGE.md`
(TASK-078, TASK-073), then `TASKS-074-history.md` (TASK-072), then `DOTFILES_TASKS_2026-09-10_TEST_EFFICACY.md`,
then `DOTFILES_TASKS_2026-09-04_QUEUE.md`
(TASK-047..059), then `DOTFILES_TASKS_2026-09-01_DEVICE_VERIFICATION.md`
(TASK-038–041, 044; prose closures for TASK-013/022/027/028).

## Pending

### TASK-077: Cross-model intent and language guidance

- **Requirement:** REQ-CROSS-MODEL-LANGUAGE (user-requested audit and improvement).
- **Risk Level:** R1 (declared); boundary-classified R2 due to the five-file surface, requiring independent review.
- **Canonical Contract Owners:** `ai.communication` (shared baseline), `writing.dialogue` (detailed methodology).
- **Allowed Paths:** `config/ai/AGENTS.md`, `skills/local/volumx-writer/SKILL.md`, `skills/local/volumx-writer/references/terminal-dialogue.md`, `skills/local/volumx-writer/references/dialogue-evaluation.md`, `TASKS.md`.
- **Accepted Invariants:** Preserve approval gates, technical meaning, artifact language rules, and existing repository/memory ownership; no provider-specific runtime changes.
- **Verification:** `skill-check volumx-writer`, `ai-policy-lint`, `ai-memory-check`, `git diff --check`, and delivery boundary check.
- **Runtime Evidence:** Shared context/skill link checks; cross-provider behavioral evaluation is not performed by static validation.
- **Non-Scope:** Model routing, credentials, automatic translation, new memory stores, commit/push.
- **Reopen Conditions:** A supplied dialogue case reveals changed meaning, missed authorization, or unclear language attributable to these instructions.
- **Escalation Conditions:** Any required provider execution or runtime change beyond the instruction-only scope.
- **Evidence:** `RUN-20260910T183355Z-0cd4d108`; completion is determined by its final ledger result. Twelve synthetic behavioral cases are supplied; no cross-provider quality claim is made.

Completed TASK-072 record: [retained history](docs/archive/TASKS-074-history.md).

### TASK-080: Fifty-three mutants nothing notices
- **Requirement:** REQ-MUTATION-COVERAGE
- **Risk Level:** R2
- **Allowed Paths:** `bin/*-test`, `TASKS.md`, `.delivery/**`
- **Protected Paths:** every non-test path under `bin/`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** each closed gap is an assertion about the subject's contract, never a restatement of what it currently prints; a mutant proven to change nothing is recorded in `EQUIVALENT_MUTANTS` with its reason rather than papered over with an assertion; no test gains a live side effect — network, install, or secret read — to reach a branch
- **Regression Checks:** `mutation-sweep`, `ai-policy-lint`, the touched `bin/*-test` suites
- **Runtime Evidence:** renumbered from TASK-074 on 2026-09-11: another device spent that id on `REQ-PUBLIC-UI-QUALITY` and finished a PASS run under it, so this contract read as done on foreign evidence and left the candidate list. 79 surviving mutants across 14 bash subjects, ranked 2026-09-10: `device-register` 11, `secrets-env` 10, `9router-credential-migrate` 9, `dotsync` 7, `mutation-sweep` 8 (remeasured 2026-09-11, the two new ones being the untested `run_bounded` Perl fallback), `inspect-project` 5, `dotpush` 5, then `vps-pgdump`, `tmux-clip`, `tmux-battery`, `security-check`, `pi-9router-restore` at 4, and `pi-update-safe`, `dev-ready` at 3 — `dev-ready` is 4, the batch having lost one to a timeout under load. Take the security-critical ones first regardless of count: `secrets-env` injects credentials, `security-check` stops a secret reaching a commit, and 14 mutants pass unnoticed between them. `shopify-content-helper`, `device-verify` and `ai-learn` are already clean, so zero is reachable. The ranking grows with TASK-076: the parser finds 748 guard and refusal statements across the python subjects where the regex found 534, and `ai-memory-access` stopped being UNMEASURED
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

### TASK-083: The sweep does not say what it did not look at
- **Requirement:** REQ-MUTATION-COVERAGE
- **Risk Level:** R2
- **Allowed Paths:** `bin/mutation-sweep`, `bin/mutation-sweep-test`, `TASKS.md`, `.delivery/**`
- **Protected Paths:** `bin/*-test`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** a subject with statements the run never examined is never reported fully covered; the report names how many were skipped and why; the refusal vocabulary is whatever actually ends a process in that language, not whatever the first version happened to match; the cap stays, because mutating every guard of every subject costs hours — what changes is that the report stops implying it looked
- **Regression Checks:** `mutation-sweep-test`, `ai-policy-lint`
- **Runtime Evidence:** two blind spots, both found by review of TASK-076 and both the same shape as the defect that task closed — the tool saying nothing about what it did not do. `MAX_MUTANTS` caps target collection at 20 and the `KILLED` row prints `$killed/$total` counted from the mutants actually generated, so a subject with 30 guards whose first 20 are trivially killed reports `KILLED 20/20` and reads as full coverage while ten guards are neither tested nor named; `delivery-ledger` has 195 statements and `ai-policy-lint` 79, so the cap is reached constantly rather than rarely. Separately, `python_statements` treats only `sys.exit` and `SystemExit` as refusals, so `os._exit(N)` — the irreversible form, used around forked children, exactly where a missed refusal matters most — is invisible with nothing said
- **Reopen Conditions:** a report claims a count that is not the number of statements in the subject
- **Non-Scope:** raising or removing the cap; closing any gap the named statements reveal; bash's refusal vocabulary, which `exit N` already covers
- **Verification:** a subject with more guards than the cap reports how many it did not examine, and is not reported fully covered; a subject whose only refusal is `os._exit(1)` yields a refusal mutant
- **Escalation Conditions:** naming the unexamined statements requires parsing every subject, which for bash would mean the dependency TASK-076 deliberately refused

