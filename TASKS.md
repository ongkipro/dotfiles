# Tasks — dotfiles

Updated: 2026-10-29

Queue rules: `config/templates/TASKS.md`; history: `docs/archive/`. Disk/tests win.

## Pending

### TASK-156: Memory precision
- **Requirement:** REQ-MEMORY-PRECISION.
- **Risk Level:** R2.
- **Allowed Paths:** run-bound router/access/lifecycle, tests, manifest, lesson/docs paths; [contract](docs/research/memory-focus-architecture-2026-10-29.md#accepted-delivery-contracts).
- **Canonical Contract Owners:** memory.routing/access/lifecycle.
- **Accepted Invariants:** execution first; explicit foreign references; path-only ≤1 file/40%; no inferred usage.
- **Regression Checks:** route/access/lifecycle/hook tests; policy lint.
- **Runtime Evidence:** slug/negative-reference probes.
- **Reopen Conditions:** isolation regression.
- **Non-Scope:** deletion, commit/push.
- **Escalation Conditions:** schema/authority change.

### TASK-157: Session focus
- **Requirement:** REQ-FOCUS.
- **Risk Level:** R2.
- **Allowed Paths:** run-bound focus, resume/router/access/ledger and tests, manifest/CORE/context/docs; [contract](docs/research/memory-focus-architecture-2026-10-29.md#accepted-delivery-contracts).
- **Canonical Contract Owners:** focus.state; ledger completion.
- **Accepted Invariants:** isolated expiring claims; captured boundaries persist; explicit references; no rival task authority.
- **Regression Checks:** focus/route/access/resume/ledger tests, context, policy lint.
- **Runtime Evidence:** concurrent claims and boundary probes.
- **Reopen Conditions:** leakage/overwrite/bypass.
- **Non-Scope:** write interception, commit/push.
- **Escalation Conditions:** budget/authority change.

### TASK-158: Writer and two-way language
- **Requirement:** REQ-TWO-WAY-LANGUAGE.
- **Risk Level:** R2.
- **Allowed Paths:** run-bound writer migration/references, communication memory/router, CORE/context/evals/maps/docs; [contract](docs/research/memory-focus-architecture-2026-10-29.md#accepted-delivery-contracts).
- **Canonical Contract Owners:** writer; communication memory.
- **Accepted Invariants:** preserve meaning/locale/history and parallel edits; no universal fluency claims.
- **Regression Checks:** metadata/map/links/workflow/context/hygiene, routing, dialogue review.
- **Runtime Evidence:** five-runtime discovery; semantic cases.
- **Reopen Conditions:** intent/register regression.
- **Non-Scope:** auto-promotion, commit/push.
- **Escalation Conditions:** new CORE methodology.

### TASK-151: Upstream watch registry and deduplicated skill evidence

- **Requirement:** REQ-SKILL-UPSTREAM-WATCH (owner: build a skill/upstream reference so upstream changes can refine skills, and repair usage evidence, 2026-10-27).
- **Risk Level:** R2.
- **Allowed Paths:** `TASKS.md`, `bin/skill-upstream`, `bin/skill-upstream-test`, `bin/ai-skill-evolution`, `bin/ai-skill-evolution-test`, `config/ai/runtime-commands.txt`, `docs/DOTFILES_SITEMAP.md`, `skills/local/*/.upstream`, `skills/local/development-kit/references/ecosystem-adoption.md`.
- **Canonical Contract Owners:** skills.provenance -> `.source`/`.local-fork` (vendored) and `.upstream` (watch-only); skills.evidence -> `ai-skill-evolution`; adoption -> `development-kit`.
- **Accepted Invariants:** `.upstream` never triggers a fetch or write; vendored refresh semantics unchanged; the report is read-only and never edits skills; one delivery run counts once however many checkouts carry it.
- **Regression Checks:** bind skills, maps, links, policy, security, diff, evolution-regression, upstream-regression at run start.
- **Runtime Evidence:** live `skill-upstream` report over all registered watches; `ai-skill-evolution --repos-root ~/Projects` sample counts equal unique runs.
- **Non-Scope:** refreshing or reconciling vendored skills, adopting new upstream skills, scheduling, commit/push.
- **Reopen Conditions:** a watch resolves to a missing repository, or duplicated checkouts inflate evidence again.
- **Escalation Conditions:** a change to vendored refresh semantics or skill frontmatter is required.

### TASK-148: Scope remaining owner priorities

- **Requirement:** REQ-RUNTIME-EVIDENCE-FOLLOWUP (2026-10-26 audit).
- **Risk Level:** R0 planning.
- **Allowed Paths:** `TASKS.md`, `docs/research/development-kit-audit-2026-10-25.md`.
- **Verification:** select device/project targets and bind required checks before implementation; preserve deferred tasks.

### TASK-140: Codex decision trial (not before 2026-10-31)

- **Requirement:** REQ-EVAL-GUIDANCE-PROVENANCE (owner reminder; Codex usage limit resets 2026-10-31).
- **Risk Level:** R0.
- **Allowed Paths:** `docs/research/development-kit-audit-2026-10-25.md`, `TASKS.md`.
- **Accepted Invariants:** read-only `codex exec`; record `guidanceRead` and the actual model.
- **Regression Checks:** `ai-workflow-eval grade`.
- **Non-Scope:** provider purchases, commit/push.

### TASK-142: Skill consolidation (deferred)

- **Requirement:** REQ-SKILL-BUDGET (owner 2026-10-25: merging skills is cancelled for now; reopen only on a budget breach).
- **Risk Level:** R2 when reopened.
- **Allowed Paths:** decided when reopened.
- **Canonical Contract Owners:** skills.inventory -> `skill-map`.
- **Accepted Invariants:** no skill is merged or deleted while the budget holds.
- **Regression Checks:** `skill-map --check`, `ai-policy-lint`.
- **Non-Scope:** any merge before a reopen condition fires; commit/push.
- **Reopen Conditions:** the skill budget is exceeded again.
- **Escalation Conditions:** a merge would change a skill's trigger surface or remove a canonical owner.

### TASK-143: `ai-memory-harvest-test` intermittent macOS failure

- **Requirement:** REQ-PORTABLE-CHECKS (owner 2026-10-25: investigate the intermittent macOS failure).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/ai-memory-harvest-test`, `bin/ai-memory-harvest`, `TASKS.md`.
- **Canonical Contract Owners:** memory.harvest -> `ai-memory-harvest`.
- **Accepted Invariants:** investigation first; record the reproduced cause before any fix; Linux behavior unchanged.
- **Regression Checks:** `ai-memory-harvest-test` on Linux and on the hosted macOS runner.
- **Runtime Evidence:** a failing macOS run log and the passing rerun after the fix.
- **Non-Scope:** other macOS checks; CI workflow changes unless the cause lives there; commit/push.
- **Reopen Conditions:** the test fails again on macOS after the fix.
- **Escalation Conditions:** the failure cannot be reproduced after repeated macOS runs.

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

- **Requirement:** REQ-CI-DETERMINISM (`5c6c1fb`: dotpush identity and macOS `/var`/`/private/var` fixture mismatch).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/dotpush-test`, `bin/dotsync-test`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** assertions unchanged; `dotpush` still sees its own managed `home/gitconfig` (a file-wide `GIT_CONFIG_GLOBAL` broke three cases).
- **Regression Checks:** `dotpush-test` and `dotsync-test`, each also run with an empty `HOME`; Core runtime CI on both OSes.
- **Runtime Evidence:** implementation complete; local run `RUN-20260924T162918Z-e96c87ba` passed. Hosted Linux/macOS CI evidence remains pending.
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

- **Requirement:** REQ-DOTFILES-CONTROL-PLANE-HARDENING (2026-09-18).
- **Risk Level:** R3 — protected runtime, delivery, and security-methodology surfaces.
- **Allowed Paths:** `STATUS.md`, `.delivery/current.json`, `TASKS.md`, `docs/archive/TASKS-077-087-completed.md`, `bin/delivery-ledger`, `bin/delivery-ledger-test`, `bin/dev-ready`, `bin/dev-ready-test`, `bin/project-init-test`, `bin/resume-brief-test`, `bin/ai-memory-hygiene`, `bin/ai-memory-hygiene-test`, `bin/ai-learn`, `bin/ai-learn-test`, `config/ai/README.md`, `config/ai/memory/identity.md`, `config/ai/memory-hygiene.json`, `config/ai/adapters/omp.md`, `config/ai/context/omp.md`, `config/omp/GOAL-ORCHESTRATION.md`, `config/omp/STATUS.md`, `skills/local/better-auth-security/SKILL.md`.
- **Protected Paths:** `bin/delivery-ledger`, `config/ai/adapters/omp.md`, `skills/local/better-auth-security/SKILL.md`.
- **Canonical Contract Owners:** STATUS/ledger; OMP adapter; memory hygiene/learn; better-auth-security.
- **Accepted Invariants:** no new agent/orchestrator; small accepted-system UI maintenance may stay local but browser-visible work remains validated; material/reference UI still uses designer/vision capability; ledger authority fails visibly when `STATUS.md` is absent/invalid; finished runs do not leak stale checkpoints into current projection; tracked memory must be safe under public visibility; Better Auth guidance fails closed on unknown hosts and treats cached sessions/proxy headers according to current documented behavior.
- **Regression Checks:** `delivery-ledger-test`, `dev-ready-test`, `project-init-test`, `resume-brief-test`, `ai-memory-hygiene-test`, `ai-learn-test`, `omp-routing-test`, `omp-effective-routing-test`, `skill-check better-auth-security`, `ai-policy-lint`, `ai-doctor --self-test`, `git diff --check`.
- **Runtime Evidence:** exact-head Core runtime CI remains required before this task may be archived.
- **Reopen Conditions:** stale state passes, UI routing over-orchestrates, private facts enter memory, or Better Auth multi-domain/session/proxy guidance regresses.
- **Non-Scope:** model/provider selection, new agents/skills, repository visibility mutation, history rewrite, broad historical memory scrubbing, live deployment.
- **Escalation Conditions:** a fix requires rewriting Git history, changing repository visibility, weakening independent review, or removing operational history beyond the targeted public-safety cleanup.

