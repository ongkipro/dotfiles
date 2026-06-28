---
name: petcue-shopify-site
description: PetCue (petcue.co) = Astro site on Cloudflare backed by Shopify store yn80fb-mb; blog publishing flow + cache:fetch behavior
metadata: 
  node_type: memory
  type: project
  originSessionId: 0c64c809-05f4-4dad-808b-69ea887649ce
---

**PetCue** = pet supplies store. Shopify store **yn80fb-mb.myshopify.com** (98 products), custom **Astro** site at `~/projects/petcue` deployed to **petcue.co / www.petcue.co** on Cloudflare Workers (`npx wrangler deploy`, manual, no CI). Repo: github.com/ongki5758/petcue (branch `main`). There is also a Shopify theme at `~/projects/petcue-theme`. Local optimization docs/CSV in `~/Documents/Shopify/yn80fb-mb - PetCue.co/` (sync_data.sh, products_master.csv, OPTIMIZATION_GUIDE.md) — same toolkit pattern as PixsGo.

**Blog architecture (DIFFERENT from PixsGo):** site reads Shopify blog cache `src/lib/cache/blog-<handle>-50.json` + flat `articles-{100,250}.json`. **`npm run cache:fetch` DOES regenerate these from Shopify** (unlike PixsGo where it skips blog caches). So adding blog articles = clean flow: (1) publish to Shopify via `shopify store execute --allow-mutations` with `articleCreate` (image via `image.url` external URL → Shopify CDN; SEO via metafields `global.title_tag`/`description_tag`; `isPublished:true` needs `publishDate` NOT in the future), (2) `npm run cache:fetch`, (3) `npm run build`, (4) `npx wrangler deploy`. No manual cache edits, no local webp needed (cache stores Shopify CDN urls). Article HTML is **plain `<p>`/`<h2>`/`<ul>`/`<li>`/`<strong>` (NO css classes)**. SEO titles use a **"- Petcue"** brand suffix and ":" / "-" (never "|"). Author "PetCue Team". `feed.ts getAllArticles` sorts newest-first by publishedAt.

4 blogs: **General Pet Care** (general-pet-care, gid 121600835904), **Dog Care** (dog-care, 121729876288), **Cat Care** (cat-care, 121729909056), **Small Pet Care** (small-pet-care, 121729941824). **45 articles as of 2026-06-27** (dog 15, cat 14, general 11, small 5) — 35 prior + 10 added 2026-06-27 (paw protection, dog water safety, dog training aids, cat dental, cat feeding stations, introducing a new cat, pet clothes/costumes, pets warm in winter, reptile habitat, aquarium care).

GOTCHA: `src/pages/blogs.astro` has a **hardcoded featured array** (3 travel articles: how-to-choose-an-airline-approved-pet-carrier, road-trip-checklist-for-dog-parents, best-travel-essentials-for-cats) prepended above the real Shopify-backed list — these are static template content, not in any cache, and may not resolve to real pages.

The store's CLI store-auth token (`shopify store auth -s yn80fb-mb`) has write_content/write_files/write_products. Hero images via highsfield MCP (`nano_banana_pro`, 3:2, ~2 credits each). Products were optimized 2026-06-26 (98/98 alt/title/desc OK). See [[pixsgo-categories-from-producttype]] for the parallel PixsGo blog setup.
