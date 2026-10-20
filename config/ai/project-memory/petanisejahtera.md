---
name: petanisejahtera
description: "COD funnel-ads landing pages (Astro/CF Workers, Scalev backend) — repo ongkipro/petanisejahtera, middle/hybrid form by geo"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2a9362bb-2f37-47c9-b5d4-459342e1cc01
  modified: 2026-07-21T12:54:00.000Z
---

COD funnel-ads ecommerce. Repo **`ongkipro/petanisejahtera`** (public). Astro v6 SSR with the Cloudflare Workers adapter, Tailwind v4, Lucide icons. Order backend = **Scalev API**.

**Checkout & env:** cloned to `~/Projects/petanisejahtera`. **There is no `.env` in the older secrets archive** — the project started after that snapshot. Templates: `.env.example` + `.dev.vars.example` (Scalev keys, FB Pixel/CAPI, GTM). Running locally without keys renders fine but the order form is dead. `npm run dev` → :4321.

**Sources of truth inside the repo (do not memorize these, read the files):**
- `DEV_NOTES.md` = development index + changelog + how to add a landing page + image/colour/icon conventions. **Read this first** at the start of any session.
- `GEOFORM_HYBRID_MIDDLE_ENV.md` = **middle vs hybrid** form, excluded provinces (area filter = the `PUBLIC_COD_DISABLED_PROVINCES` env var), geo resolution order (CF→header→ipapi), and the **ads→form** lever = the `?form=middle|hybrid` query param. Code: `src/lib/form-mode.ts`.
- `META_GTM_TRACKING_FLOW.md`, `META_DUPLICATE_CONVERSION_NOTES.md` = Meta/GTM tracking plus deduplication.

**Landing-page pattern:** `src/pages/<slug>.astro`, `prerender=false`, product data from `src/data/products.ts`, shared components `GeoIpResolvedForm`/`MetaLandingTracker`/`StickyCTA`/`SocialProof` (these are a GLOBAL pattern — do not fork them per page). Per-page images live in `public/images/<slug>/` (webp).

**Status & deployment (2026-10-07):** Live on `petanisejahtera.com` via Cloudflare Workers deployment `6a4b33cf-bee9-4186-9c6e-96fab4c434d1` (commit `dc3642e` + docs `4d59785` on `main`). Typecheck `npm run check` 0 errors, unit tests `npm run test` 76/76 passed (12 test suites), Astro v6 SSR build clean.

**Landing pages & Content:** Active LPs: `/bensu-jagung`, `/aussie-sawit-ganoderma`, `/saratoga-padi`, `/saratoga-anggrek`, `/saratoga-anthurium`. Catalog has 4 products: Aussie (sawit), Bensu (jagung/palawija), Saratoga (padi/anggrek/anthurium), Kojien. Articles system in `src/data/content.ts` holds 45 articles across multiple crops (anggrek, anthurium, padi, sawit, jagung, cabai). Standalone form routes (`/form-middle`, `/form-hybrid`, `/form-full`, `/geoipform`) and `/thanks` serve `noindex, nofollow`; main LPs and articles serve `index, follow`.

**Conversion & Tracking Architecture (DEC-013 through DEC-018):**
- `/thanks` visit is the single `Purchase` trigger for all payment methods (DEC-016). No conversions derived from Scalev order state or webhooks (Scalev webhook route removed).
- Application is sole owner of conversions (DEC-017); COD orders never receive Scalev-hosted URLs.
- Conversion `value` is merchandise only, never including ongkir or admin fees (DEC-013).
- Advanced Matching on COD path resolves 8 SHA-256 keys directly from typed address (`country`, `ct`, `external_id`, `fn`, `ln`, `ph`, `st`, `zp` - DEC-018).
- GTM container vars are dormant in `wrangler.jsonc`; Google Ads receives no live tag conversions, though `gclid`/`gbraid`/`wbraid` are captured in session records (DEC-015).
- Pending operational items: Visual verification of test order with `FB_TEST_EVENT_CODE` in Meta Events Manager, resolving GitHub Actions billing block on account level, and deleting unused `SCALEV_WEBHOOK_SIGNING_SECRET` from Worker.

