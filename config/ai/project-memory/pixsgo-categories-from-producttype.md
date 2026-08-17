---
name: pixsgo-categories-from-producttype
description: "Pix&Go storefront categories = real Shopify collections (9 of them); productType taxonomy was the earlier interim"
metadata: 
  node_type: memory
  type: project
  originSessionId: 55d03e92-6d73-4109-8c38-acde4f1411f7
---

Pix&Go's Shopify store (2mpt3p-xv) now has **14 real collections** (as of 2026-06-29; was 9) plus `frontpage`/home: `3d-wooden-puzzles` (41), `more-toys` (30), `fidget-sensory-toys` (28), `building-blocks` (24), `hand-puppets` (20)⭐, `reborn-art-dolls` (19)⭐, `brain-teaser-puzzles` (11), `play-kitchens` (10)⭐, `inflatables-pool` (10)⭐, `music-boxes` (8), `plush-soft-toys` (6)⭐, `marble-run-kits` (6), `puzzles-for-kids` (2), `toy-blasters-guns` (2). ⭐ = 5 new collections created 2026-06-29 for the +96-product batch (full SEO desc/meta + AI cover image via Higgsfield, set via `collectionUpdate(image)`). Frontend deployed 2026-06-29 (commit 8af442f): cache synced to 217 products, 5 new slugs added to Header/Footer nav, built + `wrangler deploy`'d → all 92 new products LIVE on pixsgo.com (/shop, feed.xml, product pages). The 5 new collections were **published to the Online Store channel (manually in Shopify admin) on 2026-06-30**, so the Storefront API now returns all 14 and `npm run cache:fetch` is self-sufficient — no workaround needed. (Earlier stopgap `build_collection_cache.py` is now obsolete.) **Permanent safety net:** `cache:fetch` runs `scripts/fetch-shopify-cache.js && scripts/merge-admin-collections.mjs`; the merge step pulls via Admin API (CLI auth, read_products) any collection NOT yet Storefront-visible (excludes `frontpage`) and merges it into the cache — a NO-OP once everything is published, but keeps future new/unpublished collections from disappearing from nav/getCategories. Deployed commit d061fb9. NOTE: CLI store-auth token still LACKS `write_publications`, so collection publishing must be done in the admin UI (not via CLI `publishablePublish`).

**The storefront's categories ARE these real collections** (excluding `frontpage`). Earlier they were derived from `productType` (a `PRODUCT_CATEGORIES` map) as an interim when only `frontpage` existed — that map is now removed.

**How it works (collection-backed, in `src/lib/shopify.ts`):**
- `getCategories()` reads `collections-100.json` + `collection-<handle>.json` (cached by `npm run cache:fetch`) → returns each collection with title/description/image/products.
- `getProductsByCategory(slug)` reads `collection-<slug>.json`.
- `getCategorySlugs()` → collection handles for getStaticPaths.
- `getProductPrimaryCategory(detailedProduct)` → the product's first non-frontpage collection (breadcrumb/related on product page).
- `getBrowsableProducts()` → full catalog (all products are in collections).
- `/collections/[handle]` routes off real collection handles + synthetic `all`. shop, footer, header nav, sitemap, product breadcrumbs/related all consume these. Header/Footer pick a curated 5-slug nav subset (3d-wooden-puzzles, fidget-sensory-toys, brain-teaser-puzzles, music-boxes, building-blocks).

**To change categories:** edit the collections in Shopify admin, then `npm run cache:fetch`. Update the curated nav subset slugs in Header.astro/Footer.astro if needed.

Reviews are wired to a static cache (`reviews-all.json` via `npm run cache:fetch`) and resolve to products by `product_external_id`.

**Journal/blog content: Shopify is now the SOURCE OF TRUTH (reversed 2026-06-26).** `src/lib/journal.ts` no longer hardcodes articles — it READS the Shopify blog cache (`import.meta.glob('./cache/blog-*-12.json')`) and builds `JOURNAL_ARTICLES`/`JOURNAL_CATEGORIES` from it (incl. each article's `seo` → meta title). Consumed by blogs.astro, [category].astro, [category]/[handle].astro, home/Articles.astro, sitemap, and `/rss.xml`. **To update blog content: edit articles in Shopify admin → `npm run cache:fetch` → build/deploy** (NOT edit journal.ts).

Shopify has 4 category **blogs** (handles `play-guides`/`toy-reviews`/`gift-guides`/`toy-news`) — renamed 2026-06-26 to display labels **How-To & Tips / Hands-On Reviews / Gift Inspiration / Fresh Finds** (handles kept = URLs stable; labels live in `JOURNAL_CATEGORIES`). The empty "News" blog was deleted. **30 articles total as of 2026-07-01** (play-guides 10, toy-reviews 9, gift-guides 7, toy-news 4) — added 10 on 2026-07-01 (batch: hand puppets, reborn/art dolls, play-kitchen learning+comparison, plush, pool-float safety, toddler gifts, pretend-play trend, marionettes, wooden-vs-plastic). Each has image+seo+author+publishedAt.

**FIXED 2026-07-01 (commit e5f3094): `npm run cache:fetch` now WRITES `blog-*-12.json`** — the old script had `void blogData` (skipped the write), so journal.ts (which globs those files) never saw new articles. Re-enabled `writeCache(\`blog-${b.handle}-12.json\`, blogData)` + added `sortKey: PUBLISHED_AT, reverse: true` so the newest 12 per blog are always cached (home "recent"/blog-featured show latest). So the blog flow is now the SAME as petcue: **(1) publish via `shopify store execute -s 2mpt3p-xv --allow-mutations` `articleCreate`** (SEO via metafields `global.title_tag`/`global.description_tag`; image `image.url` = external URL auto-downloaded to CDN; set `isPublished:true` and OMIT `publishDate` — a future publishDate errors, omitting stamps publishedAt=now = newest) → **(2) `npm run cache:fetch`** (wait ~1-2 min for Storefront to index the new articles, else they're missing) → **(3) build + `npx wrangler deploy`** (no CI; manual from `main`). Reusable script: `scripts/publish-batch-articles.mjs` (+ results map). contentHtml must use the site's exact Tailwind classes (intro `text-base sm:text-lg ... font-normal mb-6`, h2 `font-serif text-xl sm:text-2xl font-bold text-dark mt-8 mb-4`, body p `text-sm sm:text-base text-slate-600 ... font-light mb-5`, ul `list-disc pl-5 space-y-2 mb-6 ...`); SEO title has NO brand suffix; authors rotate across a 6-name roster.

The `.env` `SHOPIFY_ADMIN_ACCESS_TOKEN` has no content scope; the **Shopify CLI store-auth token for 2mpt3p-xv** has `write_content,write_files,write_products,read_*` (verified 2026-06-27 via `currentAppInstallation.accessScopes`). Article hero images generated via highsfield MCP (`nano_banana_pro`, 3:2, ~2 credits each). Legacy reverse-direction scripts still exist: `scripts/export-journal.mjs`, `publish-blog.mjs`, `publish-blog-seo.mjs`.

See [[pixsgo-rebrand-play-and-go]], [[pixsgo-shopify-store]].
