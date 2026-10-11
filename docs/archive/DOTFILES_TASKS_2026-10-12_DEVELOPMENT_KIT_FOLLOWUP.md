# Development-kit follow-up — task contract

The root queue links this retained contract to keep its context budget small.
Execution disposition and checks belong to
`.delivery/runs/RUN-20261011T182900Z-84a6a84f.jsonl`; this is not another queue.

### TASK-121: Align the delivery runbook and execute browser regressions

- **Requirement:** REQ-DEVELOPMENT-KIT-CONSISTENCY (owner requests completing the development-kit refinements).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** development-kit, skill-creator, ui-validation.
- **Allowed Paths:** `TASKS.md`, `skills/local/full-stack-development/references/end-to-end-workflow.md`, `docs/archive/DOTFILES_TASKS_2026-10-12_DEVELOPMENT_KIT_FOLLOWUP.md`, `.delivery/**`.
- **Protected Paths:** None; preserve other initial dirty work, memory, CORE, runtime configuration, hooks, credentials and live applications.
- **Canonical Contract Owners:** delivery runbook -> full-stack-development; instruction selection -> development-kit; execution proof -> existing ai-workflow-eval.
- **Accepted Invariants:** an actionable scoped implementation request retains its authorization through planning; bounded maintenance reuses accepted UX and visual contracts; missing framework skills do not force stack changes; conditional record fields do not become mandatory documents; browser proof remains required when visible behavior changes.
- **Capability Scenarios:** an already-authorized feature proceeds after its missing requirements are resolved; an accepted admin repair skips fresh UX direction; an unlisted stack retains its installed runtime; research-only requests retain the implementation boundary.
- **Regression Checks:** full workflow-evaluator suite with `--browser`; scenario-bank validation; skill metadata, command-surface and policy checks; independent semantic review and final boundary review.
- **Runtime Evidence:** existing reference journey and three browser mutations execute locally; synthetic oracle checks do not prove model improvement or general application correctness.
- **Visual Contract:** Not applicable; no browser-rendered source changes. Existing browser fixtures are exercised without redesign.
- **Non-Scope:** new orchestrator, skills, dependencies, model/provider calls, unrelated memory, production work, commit/push.
- **Reopen Conditions:** the runbook again overrides existing implementation authorization, forces absent specialist skills, demands unrelated contracts, or browser regressions stop detecting behavioral failures.
- **Escalation Conditions:** completion requires credentials, new dependencies, unrelated changes or live side effects.
