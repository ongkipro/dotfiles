# Development-kit refinement — task contract

The root queue links this retained contract. Execution disposition and exact
checks remain in `.delivery/runs/RUN-20261011T180120Z-c70e8a76.jsonl`; this
archive is not another execution queue or an assertion of runtime success.

### TASK-120: Refine development-kit routing and reference-bound evaluation

- **Requirement:** REQ-DEVELOPMENT-KIT-REFINEMENT (owner requests an audit, current GitHub research, and useful improvements to the development kit).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** development-kit, skill-creator.
- **Allowed Paths:** `TASKS.md`, `skills/local/development-kit/SKILL.md`, `skills/local/development-kit/references/ecosystem-adoption.md`, `skills/local/development-kit/references/skill-evaluation.md`, `skills/local/full-stack-development/SKILL.md`, `bin/ai-workflow-eval`, `bin/ai-workflow-eval-test`, `config/ai/evals/workflow-scenarios.json`, `docs/archive/DOTFILES_TASKS_2026-10-12_DEVELOPMENT_KIT.md`, `.delivery/**`.
- **Protected Paths:** None; preserve initial dirty memory, CORE, runtime configuration, hooks, credentials, and live applications.
- **Canonical Contract Owners:** workflow routing -> development-kit; cross-layer diagnosis -> full-stack-development; evaluation provenance -> ai-workflow-eval.
- **Accepted Invariants:** authorized maintenance reuses accepted contracts; research alone does not authorize implementation; installed stacks remain authoritative; upstream adoption has a demonstrated local gap and bounded verification; reference-only instruction changes invalidate prior decision evidence; no wholesale upstream installation or extra planning system.
- **Capability Scenarios:** authorized bug repair without replanning; bounded UI maintenance under accepted tokens; unsupported stack fallback; reviewed upstream-pattern adoption.
- **Regression Checks:** reference-edit stale-evidence reproduction; ai-workflow-eval-test; scenario-bank validation; independent routing trial; skill validation and runtime source links; policy, skill-surface, whitespace, and task-boundary checks; independent R3 review.
- **Runtime Evidence:** deterministic evidence proves the revision guard; independent decision trials require semantic review and do not prove application execution or model reliability.
- **Visual Contract:** Not applicable; no browser-rendered surface changes.
- **Non-Scope:** new skill/orchestrator, runtime hooks/settings, dependencies, production changes, other memory, commit/push.
- **Reopen Conditions:** bounded authorized work again requires new planning approval, stack is silently replaced, stale reference-only decisions pass, or upstream instructions override local scope.
- **Escalation Conditions:** improvement requires unrelated source changes, credentials, system mutation, or live effects.
