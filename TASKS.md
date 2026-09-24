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

### TASK-093: Suite validator reads root `TASKS.md`

- **Requirement:** REQ-PLANNING-CONTRACT-ALIGNMENT (TASK-090 known gap: `check-traceability.py` scans only `docs/spec`, so `TASK*`/`TRACE001` never see root `TASKS.md`).
- **Risk Level:** R2.
- **Allowed Paths:** `skills/local/development-spec-suite/scripts/check-traceability.py`, `skills/local/development-spec-suite/scripts/test-suite.py`, `skills/local/development-spec-suite/SKILL.md`, `skills/local/development-spec-suite/references/document-map.md`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `development-spec-suite`.
- **Accepted Invariants:** pack-only runs behave as today; no repository-wide scan.
- **Regression Checks:** `test-suite.py`, `skill-check development-spec-suite`.
- **Reopen Conditions:** a task in root `TASKS.md` escapes `TASK001`.
- **Non-Scope:** task field grammar.
- **Escalation Conditions:** the extra input changes an existing fixture verdict.

### TASK-094: Sweep report honesty follow-ups

- **Requirement:** REQ-MUTATION-COVERAGE (TASK-083 review: subject-mode `--json` omits `unmeasured`/`survived_total`; UNREACHED wording calls every unchanged line a guard).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/mutation-sweep`, `bin/mutation-sweep-test`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `runtime.readiness`.
- **Accepted Invariants:** text verdicts unchanged.
- **Regression Checks:** `mutation-sweep-test`.
- **Reopen Conditions:** JSON and text totals disagree.
- **Non-Scope:** the cap.
- **Escalation Conditions:** a JSON consumer depends on the old shape.

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

### TASK-088: Public UI reference fidelity and anti-template composition

- **Requirement:** REQ-PUBLIC-UI-REFERENCE-FIDELITY (2026-09-18: supplied references can collapse into generic Astro heroes/cards).
- **Risk Level:** R2.
- **Allowed Paths:** `skills/local/design-taste/**`, `skills/local/astro-development/SKILL.md`, `skills/local/ui-validation/SKILL.md`, `TASKS.md`, `.delivery/**`.
- **Canonical Contract Owners:** `design-taste` direction; `astro-development` implementation; `ui-validation` rendered evidence.
- **Accepted Invariants:** user/project evidence wins; familiar cards/centered layouts remain valid when justified; no framework/library replacement or pixel-copy rule.
- **Regression Checks:** `skill-check design-taste`, `skill-check astro-development`, `skill-check ui-validation`, `ai-policy-lint`, `ai-doctor --self-test`.
- **Runtime Evidence:** no pre-code composition contract previously prevented reference geometry from collapsing into component-kit defaults.
- **Reopen Conditions:** reference-driven work can skip or erase the accepted composition contract.
- **Non-Scope:** runtime/model routing, new UI dependencies, project tokens.
- **Escalation Conditions:** enforcement would require runtime changes, a dependency, or a universal visual style.

### TASK-080: Fifty-three mutants nothing notices
- **Requirement:** REQ-MUTATION-COVERAGE
- **Risk Level:** R2
- **Allowed Paths:** `bin/*-test`, `TASKS.md`, `.delivery/**`
- **Protected Paths:** every non-test path under `bin/`
- **Canonical Contract Owners:** `runtime.readiness`
- **Accepted Invariants:** each closed gap is an assertion about the subject's contract, never a restatement of what it currently prints; a mutant proven to change nothing is recorded in `EQUIVALENT_MUTANTS` with its reason rather than papered over with an assertion; no test gains a live side effect — network, install, or secret read — to reach a branch
- **Regression Checks:** `mutation-sweep`, `ai-policy-lint`, the touched `bin/*-test` suites
- **Runtime Evidence:** renumbered from TASK-074 on 2026-09-11: another device spent that id on `REQ-PUBLIC-UI-QUALITY` and finished a PASS run under it, so this contract read as done on foreign evidence and left the candidate list. 79 surviving mutants across 14 bash subjects, ranked 2026-09-10: `device-register` 11, `secrets-env` 10, `9router-credential-migrate` 9, `dotsync` 7, `mutation-sweep` 8 (remeasured 2026-09-11, the two new ones being the untested `run_bounded` Perl fallback), `inspect-project` 5, `dotpush` 5, then `vps-pgdump`, `tmux-clip`, `tmux-battery`, `security-check`, `pi-9router-restore` at 4, and `pi-update-safe`, `dev-ready` at 3 — `dev-ready` is 4, the batch having lost one to a timeout under load. Take the security-critical ones first regardless of count: `secrets-env` injects credentials, `security-check` stops a secret reaching a commit, and 14 mutants pass unnoticed between them. `shopify-content-helper`, `device-verify` and `ai-learn` are already clean, so zero is reachable. The ranking grows with TASK-076: the parser finds 748 guard and refusal statements across the python subjects where the regex found 534, and `ai-memory-access` stopped being UNMEASURED
- **Reopen Conditions:** a subject regresses to surviving mutants after being closed
- **Non-Scope:** changing any subject to make it easier to test; the UNMEASURED subjects until TASK-073 reaches them
- **Verification:** `bin/mutation-sweep --subject <name>` reports zero survivors for each subject the run claims
- **Escalation Conditions:** a branch cannot be reached without a live side effect, in which case the mutant is recorded as accepted with the reason rather than the test bent to reach it

