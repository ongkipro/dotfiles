---
name: pixsgo-shopify-store
description: "Pix&Go Shopify store details, CLI auth, and listing-optimization log location"
metadata: 
  node_type: memory
  type: project
  originSessionId: 141f5761-052b-461f-80c0-3fa48660fd3c
---

**Snapshot dated 2026-06-29.** Catalog and publication observations below
require fresh repository and Shopify evidence before use.

**Optimizing NEW products (repeatable SOP, scripts in `~/Documents/Shopify/PixsGo/`):** `bash sync_data.sh` (pulls all → `.products_full.json` + CSV; new=unoptimized = `seo.title==null` / no tags) → `classify.py` (group→`.batches/`) → 10 parallel subagents write copy to `.out/*.json` per STYLE-GUIDE → `variant_cleanup.py` (del non-US variants + Ships From/junk Color opts, SKU-safe, resume-safe) → `apply.py` (productUpdate+ALT, handle auto-dedup, resume-safe via `.apply.log`) → `create_collections.py` / `add_collections.py`. All via Shopify CLI `store execute --allow-mutations`.

Work via **Shopify CLI**: `shopify store execute --store 2mpt3p-xv.myshopify.com` (+ `--allow-mutations` for writes). Auth = `shopify store auth` online token that **expires** → re-auth with `--scopes write_products,write_files,read_products` when ACCESS_DENIED. Auth is interactive (browser) so the user must run it.

On 2026-06-26 did a full listing optimization (variant country-cleanup → US-only keeping SKUs, rewritten titles/descriptions/meta/handles, tags, taxonomy category, image ALT + SEO filenames, variant renaming via image vision, 9 collections). Brand kept **generic** (no Robotime/Rokr in titles) per user choice.

**Storefront architecture snapshot:** Astro on Cloudflare Workers SSR, backed by
Shopify Storefront API data cached under `src/lib/cache/`. Product routes use
`/products/<handle>`, collection routes use `/collections/<handle>`, and legacy
pet-era routes were recorded in `public/_redirects`. Verify build, release, Git,
domain, and platform details in their authoritative systems.

**Frontend features (2026-06-26):** product tag pages `/shop/<tag>` (tags with ≥3 products, getStaticPaths — keep helpers INSIDE getStaticPaths, Astro runs it isolated); **feeds**: `/rss.xml` (blog) + `/feed.xml` (product catalog, Google `g:` format → submit to Pinterest/Google/Meta/TikTok, no Shopify-connect needed, refresh = cache:fetch+deploy); hero images optimized to WebP. **Deploy is flaky** ("doUpload" error) → retry, and ALWAYS `curl` the live site after deploy (a failed/partial deploy 404s everything). Build must produce `dist/client/index.html` before deploying.

**Conventions (2026-06-27 polish):** right-size Shopify CDN images with `src/lib/img.ts` (`cdnImg`/`cdnSrcset` → `?width=N`+srcset) on every `<img>`; security headers live in `public/_headers` (HSTS/X-Frame/etc.); reviews resolve by product ID with a shared dummy pool (`pickDummyReviews` in `reviews.ts`) for products without Judge.me; accent text `.text-primary`=#C2410C (AA) while buttons stay #FF5A1F; product page has a 10-tag cloud (own+random) linking only to ≥3-product `/shop/<slug>` pages. In-repo dev notes: `AGENTS.md` (=CLAUDE.md) "Session Learnings". Full session log: `~/Documents/Shopify/PixsGo/EDIT-LOG.md`.

**Edit log + keyword map + style guide live in `~/Documents/Shopify/PixsGo/`** (`EDIT-LOG.md`, `KEYWORD-MAP.md`, `STYLE-GUIDE.md`) — update EDIT-LOG when adding/editing products. Related: [[pixsgo-rebrand-play-and-go]].
