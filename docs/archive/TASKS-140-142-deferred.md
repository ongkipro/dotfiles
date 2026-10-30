# Deferred task records — TASK-140 and TASK-142

Moved verbatim from `TASKS.md` on 2026-10-30 (TASK-159) to keep the hot-context
budget. Both remain open; move a record back to `TASKS.md` when it starts.

## TASK-140: Codex decision trial (not before 2026-10-31)

- **Requirement:** REQ-EVAL-GUIDANCE-PROVENANCE (owner reminder; Codex usage limit resets 2026-10-31).
- **Risk Level:** R0.
- **Allowed Paths:** `docs/research/development-kit-audit-2026-10-25.md`, `TASKS.md`.
- **Accepted Invariants:** read-only `codex exec`; record `guidanceRead` and the actual model.
- **Regression Checks:** `ai-workflow-eval grade`.
- **Non-Scope:** provider purchases, commit/push.

## TASK-142: Skill consolidation (deferred)

- **Requirement:** REQ-SKILL-BUDGET (owner 2026-10-25: merging skills is cancelled for now; reopen only on a budget breach).
- **Risk Level:** R2 when reopened.
- **Allowed Paths:** decided when reopened.
- **Canonical Contract Owners:** skills.inventory -> `skill-map`.
- **Accepted Invariants:** no skill is merged or deleted while the budget holds.
- **Regression Checks:** `skill-map --check`, `ai-policy-lint`.
- **Non-Scope:** any merge before a reopen condition fires; commit/push.
- **Reopen Conditions:** the skill budget is exceeded again.
- **Escalation Conditions:** a merge would change a skill's trigger surface or remove a canonical owner.
