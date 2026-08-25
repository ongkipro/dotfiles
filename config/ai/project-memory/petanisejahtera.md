---
name: petanisejahtera
description: "COD funnel-ads landing pages (Astro/CF Workers, Scalev backend) — repo ongkipro/petanisejahtera, middle/hybrid form by geo"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2a9362bb-2f37-47c9-b5d4-459342e1cc01
  modified: 2026-07-21T12:54:00.000Z
---

COD funnel-ads ecommerce. Repo **`ongkipro/petanisejahtera`** (public, created 2026-07-17). Astro v6 SSR with the Cloudflare Workers adapter, Tailwind v4, Lucide icons. Order backend = **Scalev API**.

**Checkout & env (2026-07-18):** cloned to `~/Projects/petanisejahtera`. **There is no `.env` in the secrets archive** `projects-env-2026-07-14/` — the project was created after that snapshot. Templates: `.env.example` + `.dev.vars.example` (Scalev keys, FB Pixel/CAPI, GTM). Running locally without keys renders fine but the order form is dead. `npm run dev` → :4321.

**Sources of truth inside the repo (do not memorize these, read the files):**
- `DEV_NOTES.md` = development index + changelog + how to add a landing page + image/colour/icon conventions. **Read this first** at the start of any session.
- `GEOFORM_HYBRID_MIDDLE_ENV.md` = **middle vs hybrid** form, excluded provinces (area filter = the `PUBLIC_COD_DISABLED_PROVINCES` env var), geo resolution order (CF→header→ipapi), and the **ads→form** lever = the `?form=middle|hybrid` query param. Code: `src/lib/form-mode.ts`.
- `META_GTM_TRACKING_FLOW.md`, `META_DUPLICATE_CONVERSION_NOTES.md` = Meta/GTM tracking plus deduplication.

**Landing-page pattern:** `src/pages/<slug>.astro`, `prerender=false`, product data from `src/data/products.ts`, shared components `GeoIpResolvedForm`/`MetaLandingTracker`/`StickyCTA`/`SocialProof` (these are a GLOBAL pattern — do not fork them per page). Per-page images live in `public/images/<slug>/` (webp).

**Status & token cleanliness (2026-08-07):** invalid Tailwind classes (`red-650`/`slate-450`/`red-350`) have been fully cleaned out of all of `src/` (0 matches). The form-mode resolver falls back to **`hybrid`** when the province is unknown (`src/lib/form-mode.ts`). Typecheck `npm run check` reported 0 errors, unit tests `npm run test` passed 25/25, and the Astro v6 SSR Cloudflare Workers build succeeded.

**Sessions 2026-07-18 through 2026-08-01:** built the `saratoga-anggrek` and `saratoga-anthurium` landing pages. Same physical product (`productSlug="saratoga"`). SEO policy was made uniform: every landing page is `index, follow` and listed in the sitemap, except `/404` and `/sitemap` which are `noindex`.
**Durable architecture:** product variants and prices are synchronized from Scalev and must be verified from the repository or provider instead of copied into memory. `BaseLayout.astro` owns the shared `BreadcrumbList` JSON-LD through its `breadcrumbs` property.
