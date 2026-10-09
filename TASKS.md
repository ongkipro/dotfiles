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

### TASK-117: Native OMP update and configuration health

- **Requirement:** REQ-OMP-NATIVE-CONFIG-HEALTH (owner requests applying audit recommendations, assessing a default reset, and updating OMP CLI).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** native-first, continuous-learning.
- **Allowed Paths:** `bin/omp-runtime-report`, `bin/omp-runtime-report-test`, `bin/omp-effective-routing-test`, `config/omp/README.md`, `config/omp/STATUS.md`, `config/omp/BUILD-LOG.md`, `skills/local/native-first/SKILL.md`, `config/ai/memory/projects-sites.md`, `config/ai/project-memory/autolaris-payment-integration.md`, `config/ai/project-memory/dev-toolchain-mise.md`, `config/ai/project-memory/kiriminaja-integration.md`, `config/ai/project-memory/mengantar-docs-project.md`, `config/ai/project-memory/mystore10-furniture-shopify.md`, `config/ai/project-memory/ongki-pro-site.md`, `config/ai/project-memory/petcue-shopify-site.md`, `config/ai/project-memory/pixsgo-categories-from-producttype.md`, `config/ai/project-memory/pixsgo-rebrand-play-and-go.md`, `config/ai/project-memory/tokophi-build-log.md`, `docs/skills-memory-audit.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** None; runtime state remains device-local, not installed from dotfiles.
- **Canonical Contract Owners:** `omp.native-health`, `ai.memory-history`.
- **Accepted Invariants:** update through native updater; back up before narrow runtime repair; preserve provider/auth/session state and valid role choices; native bare selectors and auto/off effort remain usable; missing models, invalid concrete effort, and blind visual models still fail; auxiliary catalogs cannot certify chat health; retired overlays are not active routing; historical claims keep dates and warnings.
- **Regression Checks:** `omp-runtime-report-test`, `omp-runtime-report`, `omp-effective-routing-test`, `omp-routing-test`, `omp update --check`, `ai-policy-lint`, `ai-memory-hygiene`, `git diff --check`, independent review.
- **Runtime Evidence:** native update 18.8.6 → 18.8.7 with verified checksum; local retired Claude selectors repaired using available registry successors. Registry validation is not a live inference or quality benchmark.
- **Visual Contract:** Not applicable; no application UI changes.
- **Reopen Conditions:** native syntax gets rejected, a genuinely unavailable active selector passes, or unrelated runtime state changes during repair.
- **Non-Scope:** full runtime reset, credential access, paid inference, new provider, mass upstream upgrade, commit/push; initial dirty memory untouched.
- **Escalation Conditions:** repair needs auth replacement, destructive reset, or discard of unrelated work.

### TASK-116: Skill and memory consistency audit

- **Requirement:** REQ-SKILLS-MEMORY-CONSISTENCY (owner asks for a whole skill/memory scan and cleanup).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** skill-creator, continuous-learning.
- **Allowed Paths:** `skills/local/development-kit/SKILL.md`, `skills/local/chain-of-thought/SKILL.md`, `skills/local/design-taste/references/reference-fidelity.md`, `config/ai/memory/decisions.md`, `config/ai/memory/skills.md`, `config/ai/memory/workflow.md`, `config/ai/project-memory/local-skills-registry.md`, `config/ai/project-memory/pi-9router-setup.md`, `config/ai/project-memory/pi-9router-models-compaction.md`, `config/ai/project-memory/git-identity-noreply.md`, `config/ai/project-memory/MEMORY.md`, `skills/local/README.md`, `docs/skills-memory-audit.md`, `docs/archive/DOTFILES_TASKS_2026-10-10_SKILLS.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** None; shared CORE and runtime configuration are unchanged.
- **Canonical Contract Owners:** `ai.skill-memory-consistency`.
- **Accepted Invariants:** skill methodology remains adaptive and evidence-backed; independent review does not require a different vendor; memory cannot authorize Git/secret/live actions or own changing project status; no false freshness, automatic deletion, or bulk upstream upgrade; initial dirty memory stays untouched.
- **Regression Checks:** `skill-check`, `skill-surface-check`, `ai-policy-lint`, `ai-memory-hygiene`, `ai-memory-check`, `skill-map --check`, independent conflict-case review, `git diff --check`.
- **Runtime Evidence:** structural/routing checks cover the owned corpus; targeted semantic review fixes evidenced contradictions. Dated project claims remain advisory and are not re-certified. Scope and residual findings: `docs/skills-memory-audit.md`.
- **Visual Contract:** Not applicable; no UI or application behavior change.
- **Reopen Conditions:** unsafe secret sourcing or automatic commit instructions survive in an active route, memory snapshots override code, or skill linkage regresses.
- **Non-Scope:** provider/model/runtime changes, full API-by-API upstream certification, live project mutations, unrelated dirty memory, commit/push.
- **Escalation Conditions:** a repair requires private credentials, discarding user work, deployment, or replacing canonical runtime configuration.

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

