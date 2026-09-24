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
