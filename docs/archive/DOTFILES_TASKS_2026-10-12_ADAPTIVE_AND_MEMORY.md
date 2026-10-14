# Adaptive workflow, execution evaluation, and memory-routing contracts

The root queue links these retained contracts to keep its hot-context budget under 12 KB.
Execution disposition and checks belong to `.delivery/runs/`; this is not another queue.

### TASK-122: Clarify advisory memory-routing output

- **Requirement:** REQ-MEMORY-ROUTING-CLARITY (owner requests removing the ambiguity that made an empty routing result look like disabled memory access).
- **Risk Level:** R1.
- **Job:** implementation.
- **Capability:** continuous-learning, codebase-navigation.
- **Allowed Paths:** `TASKS.md`, `bin/ai-memory-access`, `bin/ai-memory-access-test`, `bin/memory-usage-hook-test`, `config/ai/README.md`, `.delivery/**`.
- **Canonical Contract Owners:** advisory routing message -> ai-memory-access.
- **Accepted Invariants:** human-readable output identifies context selection and makes no permission decision; JSON, selection, budgets and private telemetry remain unchanged; tests use synthetic memory fixtures.
- **Regression Checks:** ai-memory-access-test; memory-usage-hook-test; shell/Python syntax; whitespace and task boundary checks.
- **Runtime Evidence:** `RUN-20261012T032304Z-e7606641`; CLI and real UserPromptSubmit hook passed with synthetic fixtures, and a separate agent review passed. The regression rejected the original output before the fix. That implementation audit was invalidated by a concurrent change to unrelated pre-existing Adsbookcms memory; the subsequent verification-only run in `.delivery/` owns final checks against the current source.
- **Non-Scope:** memory contents, memory deletion, router matching changes, hook wiring/trust, credentials, commit/push.
- **Verification:** `./bin/ai-memory-access-test` and `./bin/memory-usage-hook-test`.
- **Reopen Conditions:** a routing result again implies denied access or an output change breaks JSON/telemetry.
- **Escalation Conditions:** the fix requires access-control, runtime wiring or unrelated user changes.

### TASK-119: Executed cross-layer evaluation

- **Requirement:** REQ-ADAPTIVE-EXECUTION-EVAL (continue the adaptive AI system with observed behavior beyond decision-only trials).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** development-kit, testing-engineering, ui-validation, native-first.
- **Allowed Paths:** `TASKS.md`, `bin/ai-workflow-eval`, `bin/ai-workflow-eval-test`, `bin/_workflow-execution.py`, `config/ai/evals/execution/**`, `skills/local/design-taste/scripts/ui-ref.mjs`, `skills/local/design-taste/scripts/ui-ref.test.mjs`, `docs/adaptive-ai-system.md`, `docs/ai-execution-evaluation.md`, `skills/local/development-kit/references/skill-evaluation.md`, `.delivery/**`.
- **Protected Paths:** None; no runtime credentials, model/provider configuration, CORE, hooks, production app or deployment changes.
- **Canonical Contract Owners:** execution oracle -> ai-workflow-eval; browser transport -> existing ui-ref; workflow -> development-kit.
- **Accepted Invariants:** synthetic loopback-only fixture; no paid model invocation; fresh output paths; independent database assertions; full PASS requires browser evidence; no model-parity claim; preserve TASK-118 work and unrelated initial dirty memory.
- **Regression Checks:** decision evaluator tests; reference execution; behavioral mutation detection; independent agent repair trial; existing browser transport tests; policy, surface, whitespace and boundary checks; independent R3 review.
- **Runtime Evidence:** bind source hashes, actual runtime provenance and case-level observations; missing browser remains UNVERIFIED. A successful local coding trial is not a general model benchmark.
- **Non-Scope:** new orchestrator, production authentication, hostile-code sandbox, provider benchmarks, dependency downloads without need, commit/push.
- **Reopen Conditions:** fixture can certify itself, cross-tenant writes survive, errors retain partial writes, missing browser passes, or unrelated dirty changes become task-owned.
- **Escalation Conditions:** acceptance requires secrets, paid providers, live writes or destructive/system changes.

### TASK-118: Adaptive cross-CLI AI workflow and evidence

- **Requirement:** REQ-ADAPTIVE-AI-SYSTEM (owner authorizes research, Markdown documentation, implementation, local dependencies when useful, and parallel work; OMP remains one CLI).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** development-kit, skill-creator, native-first, continuous-learning, volumx-writer.
- **Allowed Paths:** `TASKS.md`, `docs/adaptive-ai-system.md`, `docs/research/adaptive-ai-sources.md`, `docs/archive/DOTFILES_TASKS_2026-10-10_RUNTIME.md`, `config/ai/README.md`, `config/ai/evals/workflow-scenarios.json`, `config/ai/runtime-commands.txt`, `bin/ai-workflow-eval`, `bin/ai-workflow-eval-test`, `bin/dev-ready`, `bin/dev-ready-test`, `skills/local/development-kit/SKILL.md`, `skills/local/development-kit/references/adaptive-execution.md`, `skills/local/development-kit/references/skill-evaluation.md`, `skills/local/full-stack-development/SKILL.md`, `skills/local/continuous-learning/SKILL.md`, `skills/local/volumx-writer/references/terminal-dialogue.md`, `.delivery/**`.
- **Protected Paths:** None; no CORE, hooks, credentials, model/provider settings or live deployment changes. Runtime gates require R3 independent review.
- **Canonical Contract Owners:** adaptive workflow -> development-kit; delivery -> full-stack-development and ledger; dialogue -> volumx-writer; learning -> continuous-learning; native runtime -> adapters.
- **Accepted Invariants:** no CLI/model lock; capability-appropriate context; repository truth; authorization preserved; no secrets/raw sessions; verified improvement before promotion; eval decisions cannot certify executed behavior; no model-parity guarantee.
- **Capability Scenarios:** informal corrections/status/negation; cross-layer tenant-safe delivery; small-model/tool limitation; fresh docs; cross-session resume; bounded self-improvement; CLI-independent readiness.
- **Regression Checks:** new evaluator fixtures and independent decision trial; dev-ready-test; resume-brief-test; skill-surface-check; relevant skill-check; ai-policy-lint; installer-link-test; git diff checks; boundary and independent review.
- **Runtime Evidence:** record exact trial type and exposed provenance; offline fixtures and decision trials do not prove live provider or production behavior.
- **Non-Scope:** model training, wholesale upstream installation, live deployment, credential access, commit/push, initial dirty projects-platforms memory.
- **Reopen Conditions:** SKIP claims health, new CLI requires OMP, answer key leaks into trial prompt, or simulated decisions claim real execution.
- **Escalation Conditions:** new behavior requires destructive/system/live changes beyond existing authorization.
