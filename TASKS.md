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

### TASK-097: Mutation gaps left after TASK-080

- **Requirement:** REQ-MUTATION-COVERAGE (TASK-080 final sweep 2026-09-24, `RUN-20260924T134257Z-432ea5cf`).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/*-test`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** every non-test path under `bin/`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** as TASK-080. Accepted open gap: `bin/vps-pgdump:45` guard-off survives on Linux because bash >= 4.4 expands an empty array under nounset; it is killed only under bash < 4.4 (macOS `/bin/bash`) and is NOT an equivalent mutant.
- **Regression Checks:** `mutation-sweep --subject <name>`, touched `bin/*-test`.
- **Runtime Evidence:** open: `vps-pgdump:45` (confirm the kill with a macOS sweep); `secrets-env:174` (subject defect, TASK-095); `dotsync` 3 and `mutation-sweep` 18 statements beyond the cap; `9router-credential-migrate` and `pi-9router-restore` deferred by the owner.
- **Reopen Conditions:** a subject claimed fully covered regresses.
- **Non-Scope:** raising the cap; changing subjects.
- **Verification:** each claimed subject reports zero survivors and no CAPPED row.
- **Escalation Conditions:** a gap needs a subject change or a live side effect.

### TASK-095: `secrets-env check` accepts an ignored in-repo secrets file

- **Requirement:** REQ-SECRET-LOCATION (CORE.md and the `secrets-env` header: 0600, outside every repository; `bin/secrets-env:174-175` prints OK for a gitignored in-repo file — found by the TASK-080 review).
- **Risk Level:** R3 — secret handling.
- **Allowed Paths:** `bin/secrets-env`, `bin/secrets-env-test`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `bin/secrets-env`.
- **Canonical Contract Owners:** `security.secrets-location`.
- **Accepted Invariants:** never prints a secret value; a file outside every repository with mode 600 still passes.
- **Regression Checks:** `secrets-env-test`, `mutation-sweep --subject secrets-env`.
- **Reopen Conditions:** `check` passes any secrets file inside a git work tree.
- **Non-Scope:** moving existing secret files on any device.
- **Escalation Conditions:** a supported device keeps its secrets file inside a repository today.

### TASK-096: Hermetic git setup in `dotpush-test`

- **Requirement:** REQ-MUTATION-COVERAGE (TASK-080 review: fixture setup `commit`/`clone`/`push` read the caller's global git config — signing or `core.hooksPath` can break or run real hooks).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/dotpush-test`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** the subject still sees its own managed `home/gitconfig`; a file-wide `GIT_CONFIG_GLOBAL` broke three cases, so scope it to setup calls.
- **Regression Checks:** `dotpush-test`.
- **Reopen Conditions:** a caller's global git config changes a `dotpush-test` verdict.
- **Non-Scope:** `bin/dotpush`.
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

