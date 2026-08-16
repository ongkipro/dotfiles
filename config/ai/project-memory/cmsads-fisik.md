# CMSAds (fisik)

Cross-session reference only. Decisions, requirements, execution state, and build truth live in the repository — **repository disk wins**.

## What it is

Self-hosted order-management system and landing-page CMS engine for COD ads funnels: storefront, checkout forms, admin console, Mengantar shipping, AutoLaris payments, and Meta/Google conversion signal in one Astro app on Cloudflare Workers + D1.

**Do not confuse it with the older `ongkipro/petanisejahtera` repo.** That one is a standalone LP funnel with a Scalev backend. Here, *petanisejahtera* is only a content pack and the default tenant of this engine.

## Where truth lives

- **Repo:** `~/Projects/cmsads-fisik` — Astro 7 SSR, `@astrojs/cloudflare`, Tailwind 4, Drizzle + D1, React islands (shadcn) for admin
- **Canonical docs:** repo root `AGENTS.md`, `PRD.md`, `PLAN.md`, `TASKS.md`, `STATUS.md`, `BUILD-LOG.md`, plus `doc/SCREENING-AUDIT.md` (system audit findings and what is still open)
- **Sibling checkouts:** `cmsads-digital`, `cmsads-malaysia`, `cmsads-storefront`, `cms-origin`. `cmsads(BLOCKED)` is deliberately parked — the directory name is the marker, and `/home/ongki/Projects/cmsads` does not exist.

## Durable invariants

Things that are expensive to rediscover and damaging to forget:

- **Tenant isolation is infrastructural, not query-level.** One Worker and one D1 per tenant, declared per environment in `wrangler.jsonc`. That is *why* single-store queries like `SELECT … FROM stores ORDER BY id LIMIT 1` are correct throughout the codebase. Putting two tenants in one database breaks the whole app at once.
- **The oversell guard is invisible to the schema.** `product_variants` stock cannot go negative because of a `RAISE(ABORT, 'INSUFFICIENT_STOCK')` trigger created by hand in migration `0003`. Drizzle does not model triggers, so `schema.ts` has no trace of it. **Never rebuild a tenant database with `drizzle-kit push`** — always apply migrations in order, or overselling silently becomes possible again.
- **Deploy and remote migration are name-gated on purpose.** Bare `npm run cf:deploy` and `db:migrate:remote` refuse with an error by design; the real commands are `npm run tenant:deploy -- <tenant>` and `tenant:migrate:remote -- <tenant>`. Do not "fix" the refusing scripts.
- **Conversion-signal tests must assert the wire payload.** The storefront trackers post commerce fields *flat* with customer fields under `user_data.customer_*`; the server contract is `src/lib/meta-event-contract.ts`. A test written against a hand-authored Meta-shaped fixture once hid a complete server-side signal outage while staying green — assert what the trackers actually send.

## Working notes

Stack validation is `npm run check` (astro check + tsc), `npm test` (node --test over `src/lib/*.test.ts`), `npm run build`, `npm run tenant:validate`, and `npx drizzle-kit check`. All five should be green before deploy.
