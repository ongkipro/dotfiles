# Tasks — dotfiles

Updated: 2026-10-20

The sole executable queue. Completed contracts live under `docs/archive/`;
repository tests and runtime evidence outrank prose.

## Task contract

Fields and risk rules: `config/templates/TASKS.md`. R0 may infer one obvious file;
R1 stays bounded; R2 names its surface; R3/R4 add protected surfaces and review.
Only the dependency edge is human-authored; state is derived.

## Done

Archived under `docs/archive/` (`DOTFILES_TASKS_<date>_*.md`, newest date first;
`git grep TASK-NNN docs/archive` finds any contract).

- TASK-127, TASK-126, TASK-125, TASK-124, TASK-123: [`black-magic` reverse-engineering skill, Meta Ads CLI, Shopify Hydrogen 2026.10, UI/UX skill suite, and Supabase full-spectrum skill suite](docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md).
- TASK-122, TASK-119, TASK-118: [Adaptive workflow, execution evaluation, and memory-routing contracts](docs/archive/DOTFILES_TASKS_2026-10-12_ADAPTIVE_AND_MEMORY.md).
- TASK-121: [Development-kit runbook consistency and browser verification](docs/archive/DOTFILES_TASKS_2026-10-12_DEVELOPMENT_KIT_FOLLOWUP.md).
- TASK-120: [Development-kit routing and evaluation refinement](docs/archive/DOTFILES_TASKS_2026-10-12_DEVELOPMENT_KIT.md).

### TASK-128: Conditional inbound routing to `black-magic` for deep reference extraction and `rea-skill-sync` hint in `_refresh-vendored.sh`

- **Requirement:** REQ-BLACK-MAGIC-REFERENCE-ORCHESTRATION (owner authorizes wiring `black-magic` into `development-kit`, `full-stack-development`, `design-taste`, and `_refresh-vendored.sh` where it genuinely maximizes reference extraction and sync discoverability without adding bloat to ordinary tasks).
- **Risk Level:** R2.
- **Job:** implementation.
- **Capability:** black-magic, development-kit, full-stack-development, design-taste.
- **Allowed Paths:** `TASKS.md`, `docs/archive/DOTFILES_TASKS_2026-10-14_UI_UX_SKILLS.md`, `skills/local/README.md`, `skills/local/_refresh-vendored.sh`, `skills/local/development-kit/SKILL.md`, `skills/local/full-stack-development/SKILL.md`, `skills/local/design-taste/references/design-discovery.md`, `.delivery/**`.
- **Protected Paths:** None; preserve unrelated initial dirty memory files, CORE, hooks, credentials, and live applications.
- **Canonical Contract Owners:** reference discovery & workflow routing -> `development-kit`; cross-layer orchestration -> `full-stack-development`; public UI reference evidence -> `design-taste`; vendored/fork refresh reporting -> `skills/local/_refresh-vendored.sh`.
- **Accepted Invariants:** ordinary source-repo and static-screenshot tasks remain fast and lightweight (no mandatory REA execution on routine edits); `black-magic` is invoked automatically when a supplied reference or integration target is a `.har`/`.saz` capture, shipped bundle/binary/APK/SQLite snapshot, or live interactive flow whose computed tokens/motion/API state are not resolved by static screenshot capture; `_refresh-vendored.sh` surfaces `sync_tool:` from `.local-fork` without breaking offline `vendored-refresh-test`; all `SKILL.md` files stay under 500 lines; `TASKS.md` stays under 12,288 bytes.
- **Regression Checks:** `vendored-refresh-test`, `skill-map --check`, `skill-map-test`, `skill-check development-kit`, `skill-check full-stack-development`, `skill-check design-taste`, `skill-surface-check`, `ai-policy-lint`, `ai-memory-check`, `git diff --check`, boundary check.
- **Non-Scope:** forcing REA on ordinary source or static UI tasks, git commit/push unless requested, touching pre-existing dirty memory files.
- **Reopen Conditions:** `vendored-refresh-test` fails, `skill-map` drifts from `skills/local/README.md`, any `SKILL.md` exceeds 500 lines, or `TASKS.md` exceeds 12,288 bytes.
- **Escalation Conditions:** requires modifying runtime hooks, live secrets, or unrelated user files.

## Pending


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

