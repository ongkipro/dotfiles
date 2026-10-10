# Tasks — dotfiles

Updated: 2026-09-18

The sole executable queue. Completed contracts live under `docs/archive/`;
repository tests and runtime evidence outrank prose.

## Task contract

Fields and risk rules: `config/templates/TASKS.md`. R0 may infer one obvious file;
R1 stays bounded; R2 names its surface; R3/R4 add protected surfaces and review.
Only the dependency edge is human-authored; state is derived.

## Done

Archived under `docs/archive/` (`DOTFILES_TASKS_<date>_*.md`, newest date first;
`git grep TASK-NNN docs/archive` finds any contract).

## Pending

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

### TASK-097: Mutation gaps left after TASK-080

- **Requirement:** REQ-MUTATION-COVERAGE (TASK-080 final sweep 2026-09-24, `RUN-20260924T134257Z-432ea5cf`).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/*-test`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** every non-test path under `bin/`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** as TASK-080. Accepted open gap: `bin/vps-pgdump:45` guard-off survives on Linux because bash >= 4.4 expands an empty array under nounset; it is killed only under bash < 4.4 (macOS `/bin/bash`) and is NOT an equivalent mutant.
- **Regression Checks:** `mutation-sweep --subject <name>`, touched `bin/*-test`.
- **Runtime Evidence:** open: `vps-pgdump:45` (confirm the kill with a macOS sweep); `secrets-env:174` was closed by TASK-095 (2026-10-01); `dotsync` 3 and `mutation-sweep` 18 statements beyond the cap; `9router-credential-migrate` and `pi-9router-restore` deferred by the owner.
- **Reopen Conditions:** a subject claimed fully covered regresses.
- **Non-Scope:** raising the cap; changing subjects.
- **Verification:** each claimed subject reports zero survivors and no CAPPED row.
- **Escalation Conditions:** a gap needs a subject change or a live side effect.

### TASK-096: TASK-080 tests depend on the caller's environment

- **Requirement:** REQ-CI-DETERMINISM (Core runtime `5c6c1fb` red on both OSes: `dotpush-test` needs a global git identity CI lacks; `dotsync-test` compares an unresolved macOS `/var` temp path with `realpath` output under `/private/var`).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/dotpush-test`, `bin/dotsync-test`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** assertions unchanged; `dotpush` still sees its own managed `home/gitconfig` (a file-wide `GIT_CONFIG_GLOBAL` broke three cases).
- **Regression Checks:** `dotpush-test` and `dotsync-test`, each also run with an empty `HOME`; Core runtime CI on both OSes.
- **Reopen Conditions:** a caller's global git config or temp-dir symlink changes a verdict.
- **Non-Scope:** `bin/dotpush`, `bin/dotsync`.
- **Escalation Conditions:** isolation needs a subject change.

### TASK-091: OMP sol roles via 9Router

- **Requirement:** REQ-OMP-9ROUTER-SOL (owner decision 2026-09-24: device `rich` lacks `openai-codex/gpt-5.6-sol`; route sol roles through 9Router `cx/gpt-6-sol`).
- **Risk Level:** R2.
- **Allowed Paths:** `config/omp/config.yml`, `config/omp/README.md`, `config/ai/memory/environment-ai-runtimes.md`, `TASKS.md`, `docs/archive/DOTFILES_TASKS_2026-09-24_PLANNING.md`, `.delivery/**`.
- **Canonical Contract Owners:** OMP reference → `config/omp/`; runtime topology → `environment-ai-runtimes.md`.
- **Accepted Invariants:** no secret in any file; key read at runtime via `secrets-env get`; dotfiles still does not install or wrap OMP.
- **Regression Checks:** `omp-effective-routing-test`, `omp-routing-test`, `ai-policy-lint`, a live `ninerouter/cx/gpt-6-sol` completion.
- **Reopen Conditions:** a sol role resolves to an unusable selector on `rich`.
- **Non-Scope:** non-sol roles, other devices' live config.
- **Escalation Conditions:** OMP cannot reach the tunnel without a stored key.

### TASK-089: Control-plane integrity and adaptive routing

- **Requirement:** REQ-DOTFILES-CONTROL-PLANE-HARDENING (2026-09-18 audit: align delivery authority, proportional UI routing, tracked-memory privacy, and current Better Auth multi-tenant security guidance).
- **Risk Level:** R3 — protected runtime, delivery, and security-methodology surfaces.
- **Allowed Paths:** `STATUS.md`, `.delivery/current.json`, `TASKS.md`, `docs/archive/TASKS-077-087-completed.md`, `bin/delivery-ledger`, `bin/delivery-ledger-test`, `bin/dev-ready`, `bin/dev-ready-test`, `bin/project-init-test`, `bin/resume-brief-test`, `bin/ai-memory-hygiene`, `bin/ai-memory-hygiene-test`, `bin/ai-learn`, `bin/ai-learn-test`, `config/ai/README.md`, `config/ai/memory/identity.md`, `config/ai/memory-hygiene.json`, `config/ai/adapters/omp.md`, `config/ai/context/omp.md`, `config/omp/GOAL-ORCHESTRATION.md`, `config/omp/STATUS.md`, `skills/local/better-auth-security/SKILL.md`.
- **Protected Paths:** `bin/delivery-ledger`, `config/ai/adapters/omp.md`, `skills/local/better-auth-security/SKILL.md`.
- **Canonical Contract Owners:** delivery state → `STATUS.md` + `delivery-ledger`; OMP capability routing → OMP adapter/playbook; memory privacy → `ai-memory-hygiene` + `ai-learn`; auth methodology → `better-auth-security`.
- **Accepted Invariants:** no new agent/orchestrator; small accepted-system UI maintenance may stay local but browser-visible work remains validated; material/reference UI still uses designer/vision capability; ledger authority fails visibly when `STATUS.md` is absent/invalid; finished runs do not leak stale checkpoints into current projection; tracked memory must be safe under public visibility; Better Auth guidance fails closed on unknown hosts and treats cached sessions/proxy headers according to current documented behavior.
- **Regression Checks:** `delivery-ledger-test`, `dev-ready-test`, `project-init-test`, `resume-brief-test`, `ai-memory-hygiene-test`, `ai-learn-test`, `omp-routing-test`, `omp-effective-routing-test`, `skill-check better-auth-security`, `ai-policy-lint`, `ai-doctor --self-test`, `git diff --check`.
- **Runtime Evidence:** exact-head Core runtime CI remains required before this task may be archived.
- **Reopen Conditions:** stale workflow state can pass ledger verification, bounded UI maintenance again requires unnecessary design orchestration, tracked memory accepts explicitly non-public facts, or current Better Auth multi-domain/session/proxy guidance regresses.
- **Non-Scope:** model/provider selection, new agents/skills, repository visibility mutation, history rewrite, broad historical memory scrubbing, live deployment.
- **Escalation Conditions:** a fix requires rewriting Git history, changing repository visibility, weakening independent review, or removing operational history beyond the targeted public-safety cleanup.

