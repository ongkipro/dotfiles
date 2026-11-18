# PunyaSitus

Memory gives orientation only; repository specs, decisions, task state, and executable evidence are authoritative.

## What it is

WordPress-like multi-tenant business CMS for Indonesian businesses: company profiles (compro), professional services, travel/Umrah, outlets. One website per tenant: pages, blog, media, menus, themes, settings, members, lead inbox, showcase catalog. Conversion via WhatsApp, external link, or lead form. Not a store: no cart, checkout, payment, order, or stock (DEC-008). Separate from TravelOS (own product).

## Where truth lives

- Repo `~/Projects/punyasitus` (specs; main), remote `git@github.com:ongkipro/punyasitus.git`; implementation worktree `~/Projects/punyasitus-dev` on `dev/m1` (also `punyasitus-dev-b`).
- Root docs: `PRD.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `PLAN.md`, `TASKS.md`, `STATUS.md`, `DESIGN.md`, `RELEASE.md`, `docs/` (adr, themes, workflow/OPERATOR.md). Check `STATUS.md` and `.delivery/` before assuming a task is done.

## Stack (ADR-0007, DEC-005)

Single Astro app (3 surfaces) + React islands, PostgreSQL/Drizzle, Better Auth, R2, Vultr + Coolify, Cloudflare for SaaS (custom domains).

## CMSPRO is the same product (2026-11-15)

CMSPRO (`~/Documents/work/prd/CMSPRO/`, spec-only, no repo) was an earlier parallel spec of this product. It is merged into the PunyaSitus repo: frozen copy in `docs/archive/cmspro/`, research in `docs/research/cmspro/`, adoption map in `docs/MERGE-CMSPRO.md`. Always write "CMSPRO DEC-038", never a bare ID (numbering collides). TravelOS is a separate product.
