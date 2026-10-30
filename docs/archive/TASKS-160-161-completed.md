# TASK-160 and TASK-161 — completed

TASK-160 moved verbatim from `TASKS.md` on 2026-10-31 (committed 2fb2c8e). Its retry values
(6 retries, 120 000 ms, no chain walk) were superseded by TASK-161: upstream defaults
(10 retries, 300 000 ms) already cover every observed 9Router lock.

### TASK-160: OMP/Pi 9Router retry runbook
- **Requirement:** REQ-9ROUTER-RUNBOOK (OMP dropped on 9Router rate limits; record verified retry values).
- **Risk Level:** R1.
- **Allowed Paths:** `config/omp/config.yml`, `config/omp/README.md`, `config/ai/project-memory/omp-pi-9router-runbook.md`, `config/ai/project-memory/MEMORY.md`, `config/ai/memory-router.json`, `docs/DOTFILES_SITEMAP.md`, `TASKS.md`.
- **Canonical Contract Owners:** OMP reference (`config/omp/`); project memory `pi`.
- **Accepted Invariants:** reference values equal the live-verified device config; no credential, URL or account identity in tracked files; Pi unchanged.
- **Regression Checks:** `ai-memory-check`, `ai-memory-route-test`, `ai-policy-lint`, `ai-doctor --self-test`.
- **Runtime Evidence:** synthetic-gateway ceiling table and fallback-off live roundtrips (in the runbook).
- **Reopen Conditions:** OMP drops again below the ceiling, or upgrade changes retry semantics.
- **Non-Scope:** installing OMP config from dotfiles, gateway changes, commit/push.
- **Escalation Conditions:** gateway or account changes beyond retry settings.


### TASK-161: OMP back to upstream defaults
- **Requirement:** REQ-OMP-DEFAULT-RESET (owner decision 2026-10-31: OMP runs on upstream defaults; only the 9Router provider is connected; models are picked with `/model`).
- **Risk Level:** R2.
- **Allowed Paths:** `config/omp/config.yml`, `config/omp/README.md`, `config/omp/STATUS.md`, `bin/omp-effective-routing-test`, `config/ai/project-memory/omp-pi-9router-runbook.md`, `config/ai/project-memory/MEMORY.md`, `config/ai/memory/skills.md`, `docs/DOTFILES_AI_ENGINEERING_CONTROL_PLANE.md`, `docs/DOTFILES_SITEMAP.md`, `docs/archive/TASKS-160-161-completed.md`, `TASKS.md`.
- **Canonical Contract Owners:** OMP reference (`config/omp/`); project memory `omp-pi-9router-runbook`.
- **Accepted Invariants:** the tracked reference sets no key beyond upstream defaults; no credential, URL or account identity in tracked files; dotfiles still does not install or wrap OMP; Pi and 9Router unchanged.
- **Regression Checks:** `omp-effective-routing-test`, `omp-routing-test`, `omp-runtime-report`, `ai-memory-check`, `ai-memory-route-test`, `ai-policy-lint`, `ai-doctor --self-test`.
- **Runtime Evidence:** live `~/.omp/agent` has no `config.yml`; five-line `models.yml`; fallback-off roundtrips on Sonnet 5.5, Opus 5.5 and Sol 6.1 and 6/6 parallel (runbook).
- **Reopen Conditions:** a 9Router model fails under the default profile that the retired overrides handled, or an upgrade changes upstream defaults.
- **Non-Scope:** moving `~/.omp` off `/data`, deleting `~/.omp/wt`, gateway changes, commit/push.
- **Escalation Conditions:** a default setting proves unsafe on a device.

