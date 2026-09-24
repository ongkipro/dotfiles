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
