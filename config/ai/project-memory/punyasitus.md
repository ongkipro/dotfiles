# PunyaSitus

## What it is

WordPress-like multi-tenant business CMS for Indonesian businesses: company profiles (compro), professional services, travel/Umrah, outlets. One website per tenant: pages, blog, media, menus, themes, settings, members, lead inbox, showcase catalog. Conversion via WhatsApp, external link, or lead form. Not a store: no cart, checkout, payment, order, or stock (DEC-008). Separate from TravelOS (own product).

## Where truth lives

- Code + development contract: `~/Projects/punyasitus` (`ongkipro/punyasitus`, intended public). Root contract files, `docs/adr/`, `docs/themes/`, `docs/plugins/`, `.delivery/`. Check `STATUS.md` and `.delivery/` before assuming a task is done.
- Research, frozen CMSPRO archive, HTML prototype: `~/Projects/punyasitus-docs` (private, DEC-044, split 2026-11-22). Cited from the code repo as `punyasitus-docs/docs/...`; never canonical.
- Restarted from zero 2026-11-17 (DEC-033): old `dev/m1` code and worktrees are history, never reused.

## Stack (ADR-0009, DEC-036)

One Astro SSR Worker on Cloudflare (Cloudflare for SaaS on `situsku.click`), D1 `PLATFORM_DB` + SQLite Durable Object `TenantStore` per tenant, Drizzle, Better Auth, R2, `shadcn/ui` `base-nova`. Read `PLAN.md` for the current contract.

## CMSPRO is the same product (2026-11-15)

CMSPRO (`~/Documents/work/prd/CMSPRO/`, spec-only, no repo) was an earlier parallel spec of this product. It is merged into the PunyaSitus repo: frozen copy, research and adoption map now in `punyasitus-docs/docs/` (`archive/cmspro/`, `research/cmspro/`, `MERGE-CMSPRO.md`). Always write "CMSPRO DEC-038", never a bare ID (numbering collides). TravelOS is a separate product.
