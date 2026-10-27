# Meta, SEO, and retired-skill integration — contracts

Archived from TASKS.md after scoped executable checks and independent approvals.
The original Runtime Evidence fields below retain the historical global 9Router
blocker. Final retirement/integration verification belongs to TASK-150 below and its
delivery run RUN-20261027T033501Z-b45c84ff; earlier BLOCKED runs remain immutable.

Meta implementation: RUN-20261027T030857Z-7ac86001.
SEO implementation: RUN-20261026T163737Z-54b6f99f.

### TASK-146: Meta Ads API compatibility and evidence-backed guidance

- **Requirement:** REQ-META-ADS-2026-ALGORITHM-AND-API (owner: repair and independently review API/algorithm guidance, 2026-10-27).
- **Risk Level:** R2.
- **Allowed Paths:** `TASKS.md`, `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/**`.
- **Protected Paths:** `config/ai/CORE.md`, `config/ai/adapters/**`.
- **Canonical Contract Owners:** CLI -> `bin/dotads-meta`; guidance -> `meta-ads-cli`.
- **Accepted Invariants:** preserve subcommands, secret injection, state v1, media hashes, PAUSED default, and existing ODAX/DCO/attribution guards; no live calls or invented algorithm effects.
- **Capability Checks:** reject conflicting incremental/window attribution and unsupported current API inputs; preserve valid alternatives; distinguish documented engine behavior from campaign heuristics.
- **Regression Checks:** bind meta-regression, skill-metadata, source-links, surface, policy, security, diff at run start; offline fixtures and independent review.
- **Runtime Evidence:** offline fixes/4 recipe plans and 3 decision cases pass; independent review APPROVE. Final checks: delivery run. Global lint awaits unrelated 9Router repair.
- **Non-Scope:** credentials, live mutations, installs, automatic campaign recommendations, commit/push.
- **Reopen Conditions:** valid workspaces regress, guidance lacks primary evidence, or TASKS exceeds 12,288 bytes.
- **Escalation Conditions:** live access or protected-policy edits are needed.

### TASK-149: Adaptive SEO guidance from current official sources

- **Requirement:** REQ-ADAPTIVE-SEO-SKILL (owner: audit/improve SEO and compare GitHub skills, 2026-10-26).
- **Risk Level:** R2.
- **Allowed Paths:** `skills/local/seo-website-builder/**`, `skills/local/ai-traffic-os/SKILL.md`, `skills/local/ai-traffic-os/references/AI_REFERRAL_TRACKING.md`, `skills/local/ai-traffic-os/references/CRAWLER_MATRIX_2026.md`, `skills/local/README.md`, `TASKS.md`, `docs/archive/DOTFILES_TASKS_2026-10-26_RUNTIME.md`.
- **Canonical Contract Owners:** seo.guidance, ai-traffic.measurement.
- **Accepted Invariants:** preserve owner metadata/Shopify rules; proportional loading; current primary-source evidence; unknown data stays unknown; no ranking guarantee or automatic policy adoption.
- **Regression Checks:** skill metadata/map/surface, offline SEO fixture, guided repair, links, policy, security, diff.
- **Runtime Evidence:** scoped trials/review pass; global lint awaits unrelated 9Router link/map repair.
- **Reopen Conditions:** source-backed guidance or scoped repair regresses.
- **Non-Scope:** live site/account mutations, secrets, installs, scheduling, commit/push.
- **Escalation Conditions:** live/credential access or changing owner preferences is needed.

### TASK-150: Retire the removed 9Router skill and verify pending integration

- **Requirement:** REQ-NINEROUTER-SKILL-RETIREMENT (owner: clean removed skill references, then commit/push, 2026-10-27).
- **Risk Level:** R2.
- **Allowed Paths:** removed `skills/local/9router/**`; `bin/skill-map`; output-only `bin/pi-9router-restore` expansion; `skills/local/README.md`; content skill; visual-asset reference; Pi README and related runtime memories; `docs/DOTFILES_SITEMAP.md`; `TASKS.md`; Meta/SEO contract archive. Exact paths bind to the delivery run and its accepted expansion.
- **Canonical Contract Owners:** skill discovery -> skill-map; Pi adapter -> existing Pi helper/README; prior implementation evidence -> delivery ledger.
- **Accepted Invariants:** retire skill routes and stale links; preserve optional remote gateway/Pi helpers, credentials, services, and historical evidence; retain verified Meta/SEO behavior.
- **Capability Checks:** native-capability content routing has no deleted skill prerequisite; generated maps and links agree with the staged tree.
- **Regression Checks:** policy, maps, links, skill metadata/surface, Meta/SEO fixtures, Pi adapter fixtures, security, diff, ledger; independent review before commit.
- **Runtime Evidence:** RUN-20261027T033501Z-b45c84ff owns final integration checks and independent review; historical blocked runs remain unchanged.
- **Non-Scope:** account/service mutations, credentials, installs, full gateway retirement.
- **Reopen Conditions:** stale skill route/link, map drift, or pending implementation regression.
- **Escalation Conditions:** credentials, service/config changes, or full gateway removal are required.
