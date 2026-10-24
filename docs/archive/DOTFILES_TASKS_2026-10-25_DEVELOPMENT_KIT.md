# Archived Tasks — Development-Kit Audit and Eval Provenance (2026-10-25)

Archived from `TASKS.md` after verification; evidence lives in the referenced delivery runs and `docs/research/development-kit-audit-2026-10-25.md`.

### TASK-137: Development-kit completeness audit and standalone contract gaps

- **Requirement:** REQ-DEVKIT-COMPLETENESS (owner 2026-10-25: audit the kit against professional kits and community research; refine skills, framework and memory; add what is missing).
- **Risk Level:** R2.
- **Allowed Paths:** as declared in `RUN-20261024T175250Z-7593b11a` (five templates, five chain skills, evals, research doc, skill map, archive).
- **Protected Paths:** pre-existing dirty memory/design/tmux work; CORE and adapters.
- **Canonical Contract Owners:** routing -> `development-kit`; templates -> `project-init`; evaluation -> `ai-workflow-eval`.
- **Accepted Invariants:** no new per-repo file or persona agent; sections filled only when applicable; release/probe parsers unchanged.
- **Regression Checks:** `ai-policy-lint`, `skill-check`, eval, project-init, release, gate and spec-suite tests.
- **Runtime Evidence:** baseline and post-change decision trials in `docs/research/development-kit-audit-2026-10-25.md`.
- **Non-Scope:** commit/push, CORE rewrite, live services.
- **Reopen Conditions:** a section becomes mandatory boilerplate or a parser regresses.
- **Escalation Conditions:** the change needs pre-existing user edits or CORE.

### TASK-138: Label decision trials by guidance actually read

- **Requirement:** REQ-EVAL-GUIDANCE-PROVENANCE (owner 2026-10-25: continue refining after TASK-137 found trials whose participant opened no skill body).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-workflow-eval`, `bin/ai-workflow-eval-test`, `docs/adaptive-ai-system.md`, `skills/local/development-kit/references/skill-evaluation.md`, `docs/research/development-kit-audit-2026-10-25.md`, `TASKS.md`, `CHANGELOG.md`, plus ledger-accepted expansions in `RUN-20261024T183052Z-c375c599`.
- **Protected Paths:** pre-existing dirty work; CORE and adapters.
- **Canonical Contract Owners:** evaluation -> `ai-workflow-eval`.
- **Accepted Invariants:** PASS/FAIL semantics unchanged; `guidanceRead` optional and self-reported; malformed values fail closed; no provider call.
- **Regression Checks:** `ai-workflow-eval-test`, `ai-workflow-eval check`, `ai-policy-lint`.
- **Runtime Evidence:** grade an existing TASK-137 trial with and without `guidanceRead`.
- **Non-Scope:** changing case expectations, commit/push.
- **Reopen Conditions:** a label changes a decision result or accepts a traversal path.
- **Escalation Conditions:** the change needs CORE or provider calls.
