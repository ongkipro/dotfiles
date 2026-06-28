---
name: pixsgo-shopify-store
description: "Pix&Go Shopify store details, CLI auth, and listing-optimization log location"
metadata: 
  node_type: memory
  type: project
  originSessionId: 141f5761-052b-461f-80c0-3fa48660fd3c
---

Pix&Go Shopify store = `2mpt3p-xv.myshopify.com` (storefront https://cart.pixsgo.com). Toys & Hobbies catalog, 125 products, US market / USD. Mostly 3D wooden mechanical puzzles, model kits, brain-teasers, marble runs, fidget/sensory toys (Robotime/Rokr-style dropship imports).

Work via **Shopify CLI**: `shopify store execute --store 2mpt3p-xv.myshopify.com` (+ `--allow-mutations` for writes). Auth = `shopify store auth` online token that **expires** → re-auth with `--scopes write_products,write_files,read_products` when ACCESS_DENIED. Auth is interactive (browser) so the user must run it.

On 2026-06-26 did a full listing optimization (variant country-cleanup → US-only keeping SKUs, rewritten titles/descriptions/meta/handles, tags, taxonomy category, image ALT + SEO filenames, variant renaming via image vision, 9 collections). Brand kept **generic** (no Robotime/Rokr in titles) per user choice.

**Frontend** = Astro project `~/Projects/pixsgo/` (Cloudflare Workers SSR; git repo → GitHub `ongki5758/pixsgo` PRIVATE, branch `main`; `.env` gitignored). Deploy: `npm run build && npx wrangler deploy` (worker name `pixsgo`, domains pixsgo.com + www). gh authed as `ongki5758`. Pulls Shopify via Storefront API into a build-time cache under `src/lib/cache/` — refresh with `npm run cache:fetch` then `npm run build`; cache bundled via `import.meta.glob`. Product URLs `/products/<handle>`, collections `/collections/<handle>`. Old pet-era product URLs 301 → `/shop` via `public/_redirects`; `www` 301→apex (working). Same store (`2mpt3p-xv`).

**Frontend features (2026-06-26):** product tag pages `/shop/<tag>` (tags with ≥3 products, getStaticPaths — keep helpers INSIDE getStaticPaths, Astro runs it isolated); **feeds**: `/rss.xml` (blog) + `/feed.xml` (product catalog, Google `g:` format → submit to Pinterest/Google/Meta/TikTok, no Shopify-connect needed, refresh = cache:fetch+deploy); hero images optimized to WebP. **Deploy is flaky** ("doUpload" error) → retry, and ALWAYS `curl` the live site after deploy (a failed/partial deploy 404s everything). Build must produce `dist/client/index.html` before deploying.

**Conventions (2026-06-27 polish):** right-size Shopify CDN images with `src/lib/img.ts` (`cdnImg`/`cdnSrcset` → `?width=N`+srcset) on every `<img>`; security headers live in `public/_headers` (HSTS/X-Frame/etc.); reviews resolve by product ID with a shared dummy pool (`pickDummyReviews` in `reviews.ts`) for products without Judge.me; accent text `.text-primary`=#C2410C (AA) while buttons stay #FF5A1F; product page has a 10-tag cloud (own+random) linking only to ≥3-product `/shop/<slug>` pages. In-repo dev notes: `AGENTS.md` (=CLAUDE.md) "Session Learnings". Full session log: `~/Documents/Shopify/PixsGo/EDIT-LOG.md`.

**Edit log + keyword map + style guide live in `~/Documents/Shopify/PixsGo/`** (`EDIT-LOG.md`, `KEYWORD-MAP.md`, `STYLE-GUIDE.md`) — update EDIT-LOG when adding/editing products. Related: [[pixsgo-rebrand-play-and-go]].
