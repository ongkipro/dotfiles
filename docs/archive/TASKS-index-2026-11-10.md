# TASKS index — archived 2026-11-10

Moved verbatim from `TASKS.md` by TASK-207 to keep the hot file under its budget. Completion evidence: TASK-207 run `RUN-20261109T190426Z-58ac7e2d` (PASS, Argon review approved); TASK-206 commit `8208ed14`; TASK-200 run `RUN-20261107T105314Z-1567e199` (PASS).

## TASK-206: Fix the three findings of an owner-ordered review of the pushed TASK-205 and the merge
- **Requirement:** REQ-PARALLEL-FOLLOWUP (owner 2026-11-07). Full contract: [TASKS-206-contract-full](TASKS-206-contract-full.md).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-policy-lint{,-test}`, `bin/ai-memory-route-test`, `bin/device-register`, `config/ai/memory-router.json`, `devices/rich.md`, `docs/DOTFILES_SITEMAP.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/`.
- **Protected Paths:** `bin/delivery-ledger*`, `docs/task-change-boundary.md`, `config/ai/README.md`, other `project-memory/*`, `skills/local/development-kit/**`, the other device's TASK-200.
- **Canonical Contract Owners:** `ai-policy-lint` (ledger binding), `ai-memory-route` and its manifest, `device-register`.
- **Accepted Invariants:** a historical exemption names the exact run file and cannot cover a new run; everyday phrases never pull the operations lessons; the device record does not overstate macOS.
- **Regression Checks:** `ai-policy-lint-test`, `ai-memory-route-test`, `device-register-test`, `ai-doctor --self-test`, `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a new wrong-pair run is accepted; an everyday phrase pulls the lessons; macOS overstated.
- **Non-Scope:** the other device's CI failures; pushing.
- **Escalation Conditions:** sudo, a live account, another session's files.


## TASK-200: Adaptive Meta Ads conversion guardrails, BM markdown renderer v5 & memory hygiene
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

## TASK-207: Context precision overhaul (infra memory, routing, skill leak, hot-path cost)
- **Requirement:** REQ-CONTEXT-PRECISION (owner 2026-11-10: agents misread project context and forget prior Vultr/Coolify/Cloudflare setup; "kerjakan dan review, cek, audit sempurnakan keseluruhan"; Argon review ordered).
- **Risk Level:** R2.
- **Allowed Paths:** run-bound (`RUN-20261109T190426Z-58ac7e2d`): infra skills, skill tooling, memory + router, CORE/context, memory hooks, `ai-memory-route`/`focus`/`resume-brief`, retired wrappers, policy + templates, sitemap, changelog, tasks.
- **Protected Paths:** `bin/delivery-ledger`, `docs/task-change-boundary.md`, `config/ai/locked-rules.json`.
- **Canonical Contract Owners:** `vps-deploy` runbook (server procedure); `memory.routing`; `skill-update` (runtime skill adapters); `planning-artifacts` policy (hot-file budget).
- **Accepted Invariants:** one canonical Coolify-behind-Cloudflare runbook; no live IP or credential in tracked files; retired hosts only as labelled history; infra and active-project prompts route to their memory; prose never admits a foreign project inside a known one; Claude.ai synced skills stay out of `skills/local`; read-only `focus` creates no files.
- **Regression Checks:** `skill-update-test`, `skill-check`, `ai-memory-route-test`, `focus-test`, `resume-brief-test`, `memory-usage-hook-test`, `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** a `SKILL.md` appears below `skills/local/*/`; "setup vps vultr" routes nothing; `focus` leaves a `.lock` on read; a runbook again contradicts `coolify-behind-cloudflare.md`.
- **Non-Scope:** live servers, DNS, deploys; project repositories (separate owner-approved follow-up); commit/push.
- **Escalation Conditions:** sudo, a live account, another session's files.

## TASK-208: Re-verify the spec-suite sources past or near review (SRC008)
- **Requirement:** REQ-SPEC-SOURCES-FRESH (owner 2026-11-10: "kerjakan dan sempurnakan yang belum"; scheduled Development Specification Suite CI fails SRC008 since 2026-11-04).
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/development-spec-suite/assets/sources.json`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/`.
- **Protected Paths:** `skills/local/development-spec-suite/scripts/**`.
- **Canonical Contract Owners:** `development-spec-suite` source ledger.
- **Accepted Invariants:** each refreshed record states what was verified live and how; material changes (amendments, court rulings, reforms) are recorded, not hidden; no legal conclusion is drawn.
- **Regression Checks:** `audit-sources` (as of today), spec-suite `test-suite.py`, `ai-policy-lint`.
- **Reopen Conditions:** a record's revision claims a check that was not performed.
- **Non-Scope:** script behaviour. Outcome: 13 of 15 records refreshed (7 overdue + 6 due by 2026-11-30); scope expanded to `scripts/test-suite.py` (fixture date) and `references/jurisdiction-overlays.md` (PDPC link) under the ledger.
- **Escalation Conditions:** a source no longer resolves to an official authority.

## TASK-209: Pi managed install (pi.dev installer) on every device
- **Requirement:** REQ-PI-MANAGED-INSTALL (owner 2026-11-10: move Pi from npm global to the pi.dev managed install, starting with `rich`; dotfiles config and the 9Router sync must stay safe).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/pi-update-safe`, `bin/pi-update-safe-test`, `bin/pi-9router-sync.js`, `bin/pi-9router-restore-test`, `bin/ai-doctor`, `docs/linux-install-step-by-step.md`, `docs/macos-install-step-by-step.md`, `config/pi/README.md`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/**`.
- **Protected Paths:** `bin/delivery-ledger*`, `config/ai/CORE.md`.
- **Canonical Contract Owners:** `pi.update` (`pi-update-safe`), `pi.9router.catalog` (`pi-9router-sync.js`), `doctor.runtime`.
- **Accepted Invariants:** helpers find Pi's package in the managed layout (`~/.pi/agent/install/releases/<current-version>`) first and fall back to npm global; the skill lint never skips silently because of layout; the 9Router sync keeps `official: pi catalog`; `models.json`, `settings.json`, packages and auth are untouched by the migration.
- **Regression Checks:** `pi-update-safe-test`, `pi-9router-restore-test`, `ai-doctor-test`.
- **Runtime Evidence:** on `rich` and `dot`: `type -a pi` resolves the managed launcher, `pi --version`, `pi list`, `pi-9router-sync` reports `pi catalog`, `ai-doctor` pi line.
- **Reopen Conditions:** a helper reports `unavailable` or skips the lint on a managed device; `pi` resolves a stale npm/mise shim.
- **Non-Scope:** killing running Pi sessions; removing the npm copy while sessions still use it; other CLIs; commit/push.
- **Escalation Conditions:** sudo, a change to `models.json`/auth, or a session that must be killed.
- **Outcome (2026-11-10):** Done. Commits `ca9c419`, `d148db1`, `bb7dca9` (`pi-managed-migrate`), `dca75ab` and this one (`ag/` Opus and Sonnet in `/model`), `f1c550a` (review pairing, Argon APPROVE). `rich` 7/7 and `dot` 6/6 sessions moved on their own session files; npm copy removed on both; both on Pi 1.5.2 via `pi update`; `ai-doctor` clean; 9Router sync `official: pi catalog` (27 models). Other devices migrate with `pi-managed-migrate` when `ai-doctor` warns.
