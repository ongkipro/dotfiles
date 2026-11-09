# Tasks — dotfiles

Updated: 2026-11-07

Queue rules: `config/templates/TASKS.md`; history: `docs/archive/`. Disk/tests win.

Done through 2026-11-07: see [TASKS-index-2026-11-07](docs/archive/TASKS-index-2026-11-07.md) (TASK-194 to TASK-199 and TASK-203 to TASK-205, see the index; TASK-200 and TASK-206 are open below).

## In progress

### TASK-206: Fix the three findings of an owner-ordered review of the pushed TASK-205 and the merge
- **Requirement:** REQ-PARALLEL-FOLLOWUP (owner 2026-11-07). Full contract: [TASKS-206-contract-full](docs/archive/TASKS-206-contract-full.md).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-policy-lint{,-test}`, `bin/ai-memory-route-test`, `bin/device-register`, `config/ai/memory-router.json`, `devices/rich.md`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/`.
- **Protected Paths:** `bin/delivery-ledger*`, `docs/task-change-boundary.md`, `config/ai/README.md`, other `project-memory/*`, `skills/local/development-kit/**`, the other device's TASK-200.
- **Canonical Contract Owners:** `ai-policy-lint` (ledger binding), `ai-memory-route` and its manifest, `device-register`.
- **Accepted Invariants:** a historical exemption names the exact run file and cannot cover a new run; everyday phrases never pull the operations lessons; the device record does not overstate macOS.
- **Regression Checks:** `ai-policy-lint-test`, `ai-memory-route-test`, `device-register-test`, `ai-doctor --self-test`, `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a new wrong-pair run is accepted; an everyday phrase pulls the lessons; macOS overstated.
- **Non-Scope:** the other device's CI failures; pushing.
- **Escalation Conditions:** sudo, a live account, another session's files.

### TASK-200: Adaptive Meta Ads conversion guardrails, BM markdown renderer v5 & memory hygiene
- **Requirement:** REQ-META-ADAPTIVE-FRAMEWORK (owner 2026-11-07).
- **Risk Level:** R3.
- **Allowed Paths:** `bin/_dotads-workspace.mjs`, `bin/_dotads-workspace-test.mjs`, `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/**`, `skills/local/meta-ads-signal-engine/**`, `config/ai/memory/**`, `config/ai/project-memory/**`, `docs/DOTFILES_SITEMAP.md`, `docs/archive/**`, `TASKS.md`, `CHANGELOG.md`.
- **Protected Paths:** `bin/delivery-ledger`, `docs/task-change-boundary.md`, `config/ai/README.md`.
- **Canonical Contract Owners:** `dotads-meta`; `_dotads-workspace.mjs`; `algorithm-and-learning.md`; `PIXEL_2026_CHANGES.md`; `meta-ads.md`.
- **Accepted Invariants:** shared skills/memory stay generalizable (no case lock); `meta-ads.md` <= 12,000B; `dotads-markdown/5` preserves prior revisions; `ai-memory-hygiene` 0 issues.
- **Regression Checks:** `workspace`, `meta-cli`, `hygiene`, `route`, `system-map`, `policy`, `security`.
- **Reopen Conditions:** `meta-ads.md` > 12,000B; case figures in skills; BM report revision collision.
- **Non-Scope:** live Meta mutations; private `dotads-meta-report` data.
- **Escalation Conditions:** unapproved live account mutation.

### TASK-175: Cloudflare Asia-Pacific placement default
- **Requirement:** REQ-CLOUDFLARE-APAC (owner 2026-11-02: web projects for Indonesia/Asia use Cloudflare SEA/Asia/Singapore; understand the breakdown and improve the skill).
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/cloudflare/SKILL.md`, `skills/local/cloudflare/.local-fork`, `skills/local/cloudflare/references/apac-placement.md`, `config/ai/memory/preferences.md`, `CHANGELOG.md`, `TASKS.md`, `docs/DOTFILES_SITEMAP.md`.
- **Canonical Contract Owners:** `cloudflare` skill (product guidance); `memory/preferences.md` (owner default).
- **Accepted Invariants:** facts from current Cloudflare docs only; hints never presented as residency; no remote resource changed.
- **Regression Checks:** `skill-check`; `bin/system-map --check`; `ai-policy-lint`.
- **Reopen Conditions:** Cloudflare adds a finer Asian hint or an Asian jurisdiction; a project created with `--location apac` is found outside APAC.
- **Non-Scope:** migrating existing D1/R2 resources; deploys; commit/push.
- **Escalation Conditions:** any change to a live D1/R2/DO resource or deploy.

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

### TASK-148: Scope remaining owner priorities

- **Requirement:** REQ-RUNTIME-EVIDENCE-FOLLOWUP (2026-10-26 audit).
- **Risk Level:** R0 planning.
- **Allowed Paths:** `TASKS.md`, `docs/research/development-kit-audit-2026-10-25.md`.
- **Verification:** select device/project targets and bind required checks before implementation; preserve deferred tasks.

### Deferred: TASK-140 (from 2026-10-31), TASK-142
- Full records: [docs/archive/TASKS-140-142-deferred.md](docs/archive/TASKS-140-142-deferred.md). Both stay open; copy a record back into Pending before starting its run.

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
- **Runtime Evidence:** open: `vps-pgdump:45` (confirm the kill with a macOS sweep); `secrets-env:174` was closed by TASK-095 (2026-10-01); `dotsync` 3 and `mutation-sweep` 18 statements beyond the cap; `pi-9router-restore` deferred by the owner (`9router-credential-migrate` removed 2026-11-02).
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

