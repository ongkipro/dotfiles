# Archived tasks — 2026-09-24 planning contracts

Moved out of `TASKS.md` on 2026-09-24 to stay inside the hot-context budget.
Evidence: `.delivery/runs/RUN-20260924T060356Z-eb08171b.jsonl` (PASS), commit `30ed360`.

### TASK-090: Planning contracts

- **Requirement:** REQ-PLANNING-CONTRACT-ALIGNMENT.
- **Risk Level:** R2.
- **Allowed Paths:** planning skills, templates (see run).
- **Canonical Contract Owners:** `prd-taskbreaker`, `adr-record`.
- **Accepted Invariants:** parser/lint/validator unchanged.
- **Regression Checks:** `skill-check`, `ai-policy-lint`, `project-init-test`.
- **Reopen Conditions:** tasks unparsable by `resume-brief`.
- **Non-Scope:** parser code.
- **Escalation Conditions:** parser change.

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

Evidence: `.delivery/runs/RUN-20260924T115940Z-57ca1de6.jsonl` (PASS).

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

Evidence: `.delivery/runs/RUN-20260924T120429Z-db687cf7.jsonl` (PASS).

### TASK-092: CI flake — `grep -q` under `pipefail`

- **Requirement:** REQ-CI-DETERMINISM (Core runtime `a066af0` failed on macOS only: `ai-doctor-test` "a profile with no deny rule was not warned about").
- **Risk Level:** R1.
- **Allowed Paths:** `bin/ai-doctor-test`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** assertions unchanged; only how output reaches `grep`.
- **Regression Checks:** `ai-doctor-test`, `ai-policy-lint`.
- **Reopen Conditions:** a test fails with exit 141 while its text matched.
- **Non-Scope:** the other ~95 `printf | grep -q` sites (follow-up once this is proven).
- **Escalation Conditions:** the flake reproduces with here-strings.

Evidence: `.delivery/runs/RUN-20260924T121006Z-99c92eba.jsonl` (PASS).

### TASK-093: Suite validator reads root `TASKS.md`

- **Requirement:** REQ-PLANNING-CONTRACT-ALIGNMENT (TASK-090 known gap: `check-traceability.py` scans only `docs/spec`, so `TASK*`/`TRACE001` never see root `TASKS.md`).
- **Risk Level:** R2.
- **Allowed Paths:** `skills/local/development-spec-suite/scripts/check-traceability.py`, `skills/local/development-spec-suite/scripts/test-suite.py`, `skills/local/development-spec-suite/SKILL.md`, `skills/local/development-spec-suite/references/document-map.md`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `development-spec-suite`.
- **Accepted Invariants:** pack-only runs behave as today; no repository-wide scan.
- **Regression Checks:** `test-suite.py`, `skill-check development-spec-suite`.
- **Reopen Conditions:** a task in root `TASKS.md` escapes `TASK001`.
- **Non-Scope:** task field grammar.
- **Escalation Conditions:** the extra input changes an existing fixture verdict.

Evidence: `.delivery/runs/RUN-20260924T121241Z-2664cb3b.jsonl` (PASS).

### TASK-094: Sweep report honesty follow-ups

- **Requirement:** REQ-MUTATION-COVERAGE (TASK-083 review: subject-mode `--json` omits `unmeasured`/`survived_total`; UNREACHED wording calls every unchanged line a guard).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/mutation-sweep`, `bin/mutation-sweep-test`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** text verdicts unchanged.
- **Regression Checks:** `mutation-sweep-test`.
- **Reopen Conditions:** JSON and text totals disagree.
- **Non-Scope:** the cap.
- **Escalation Conditions:** a JSON consumer depends on the old shape.

Evidence: `.delivery/runs/RUN-20260924T122023Z-c2ccb865.jsonl` (PASS).
