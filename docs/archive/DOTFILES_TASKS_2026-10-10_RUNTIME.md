# Completed Skill, Memory, and OMP Contracts

Contracts retained verbatim; execution evidence stays in `.delivery/`.

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


End of retained contracts.
