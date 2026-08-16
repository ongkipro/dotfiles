# TravelOS

TravelOS memory supplies orientation only; repository specifications, decisions, task state, and executable evidence are authoritative.

## What it is

AI-native global travel platform: sourced-fact discovery content, personalized trip planner, and affiliate commerce. Reset from an earlier "Commerce OS" multi-tenant store prototype on 2026-08-11; the reset is tracked as Phase 0 "Contract Reset" in the repo task plan.

## Where truth lives

- **Repo:** `~/Projects/TravelOS` (pnpm monorepo: `apps/{web,app,admin,api}`, `packages/{domain,shared,ui}`), private GitHub `ongkipro/travelos` (since 2026-08-12; main, no auto-deploy)
- **Canonical docs:** repo root `PRD.md`, `TRAVELOS_MASTER_BLUEPRINT.md`, `PLAN.md`, `TASKS.md`, `STATUS.md`, `BUILD-LOG.md` + `docs/` (architecture, data model, IAM, security, privacy, UI/UX spec, audit matrix)
- **Superseded drafts:** `~/Documents/work/prd/TravelOS/` — pointer stubs only, never implement from there

## Stack direction (accepted in repo PRD)

- Public: Astro static-first (`apps/web`); Admin: Astro on-demand via `@astrojs/cloudflare` (`apps/admin`); API: Hono (`apps/api`); Cloudflare platform target; PostgreSQL/PostGIS planned.
- `apps/app` (Next.js) is a legacy prototype scheduled for removal after Astro parity (T-005).

## Standing cautions

- Product Owner requested UI-first implementation; UI evidence exists ahead of task status — check `STATUS.md` before assuming a task is done.
- All UI data is explicit sample data until Phase 1+ lands; never present it as production.
- Blocking decisions (auth provider, Postgres provider/region, map licensing, affiliate providers, privacy retention, KPI targets) are intentionally open until their milestone gates — do not pick defaults silently.
