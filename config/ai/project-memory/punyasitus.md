# PunyaSitus

Memory gives orientation only; repository specs, decisions, task state, and executable evidence are authoritative.

## What it is

WordPress-like multi-tenant business CMS for Indonesian businesses: company profiles (compro), professional services, travel/Umrah, outlets. One website per tenant: pages, blog, media, menus, themes, settings, members, lead inbox, showcase catalog. Conversion via WhatsApp, external link, or lead form. Not a store: no cart, checkout, payment, order, or stock (DEC-008). Separate from TravelOS (own product).

## Where truth lives

- Two repositories side by side (DEC-044, split 2026-11-22): public `~/Projects/punyasitus` (`ongkipro/punyasitus`, code + contract) and private `~/Projects/punyasitus-docs` (`ongkipro/punyasitus-docs`, research, frozen CMSPRO archive, HTML prototype; cited as `punyasitus-docs/docs/...`, never canonical).
- Restarted from zero 2026-11-17 (DEC-033): prior September 2026 `dev/m1` / `dev/m1-b` code is archived in private `ongkipro/punyasitus-history` and must not be reused.
- Root docs in `~/Projects/punyasitus`: `PRD.md`, `ARCHITECTURE.md` (system map as built), `DECISIONS.md`, `PLAN.md`, `DESIGN.md`, `TASKS.md` (index, contracts in `docs/tasks/`), `STATUS.md`, `RELEASE.md`, `docs/README.md`, `docs/adr/`, `docs/api/openapi.json`, `docs/operations/release-checklist.md`, `docs/security/`, `docs/themes/`, `docs/plugins/`. Check `STATUS.md`, `ARCHITECTURE.md`, and `.delivery/` for current state and remaining external staging/legal gates (`EXT-01..EXT-10`).

## Stack (ADR-0007, ADR-0009, DEC-036)

100% Cloudflare: single Astro SSR Worker (`apps/web`, 4 host-isolated surfaces: `punyasitus.com`, `app.punyasitus.com`, `console.punyasitus.com`, `*.situsku.click` / custom domains) + React 19 islands (`shadcn/ui` `base-nova` / `@base-ui/react`, never Radix UI), `PLATFORM_DB` (D1) + `TenantStore` (SQLite Durable Object per site), Drizzle ORM, Better Auth (`provider: "sqlite"`), R2 + Images + Containers (`ffmpeg`), Queues + Cron, Email Service, Workers AI, Cloudflare for SaaS, AutoLaris relay. Local dev runs on `workerd` (`astro dev` / `wrangler dev`). Read `ARCHITECTURE.md` and `PLAN.md` for the current contract.

## CMSPRO is the same product (2026-11-15)

CMSPRO (`~/Documents/work/prd/CMSPRO/`, spec-only, no repo) was an earlier parallel spec of this product. It is merged into PunyaSitus (DEC-034, DEC-035): frozen copy, research, and adoption map live in `punyasitus-docs/docs/` (`archive/cmspro/`, `research/cmspro/`, `MERGE-CMSPRO.md`). Always write "CMSPRO DEC-038", never a bare ID (numbering collides). TravelOS is a separate product.
