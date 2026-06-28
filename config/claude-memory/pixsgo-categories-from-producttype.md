---
name: pixsgo-categories-from-producttype
description: "Pix&Go storefront categories = real Shopify collections (9 of them); productType taxonomy was the earlier interim"
metadata: 
  node_type: memory
  type: project
  originSessionId: 55d03e92-6d73-4109-8c38-acde4f1411f7
---

Pix&Go's Shopify store (2mpt3p-xv) now has **9 real collections** (created in admin) plus `frontpage`/home: `3d-wooden-puzzles` (41), `fidget-sensory-toys` (28), `more-toys` (20), `brain-teaser-puzzles` (11), `music-boxes` (8), `building-blocks` (7), `marble-run-kits` (6), `puzzles-for-kids` (2), `toy-blasters-guns` (2) — all 125 products covered.

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

Shopify has 4 category **blogs** (handles `play-guides`/`toy-reviews`/`gift-guides`/`toy-news`) — renamed 2026-06-26 to display labels **How-To & Tips / Hands-On Reviews / Gift Inspiration / Fresh Finds** (handles kept = URLs stable; labels live in `JOURNAL_CATEGORIES`). The empty "News" blog was deleted. **20 articles total as of 2026-06-27** (play-guides 7, toy-reviews 6, gift-guides 5, toy-news 2) — 10 original + 10 added 2026-06-27. Each has image+seo+author+publishedAt.

**GOTCHA: `npm run cache:fetch` does NOT write the `blog-*-12.json` cache files** (the script explicitly skips them — see comments in `scripts/fetch-shopify-cache.js`). So adding blog articles is a TWO-step manual flow, NOT cache:fetch: (1) publish to Shopify via `shopify store execute --allow-mutations` with the `articleCreate` mutation (SEO via metafields `global.title_tag`/`global.description_tag`; image via `image.url` = external URL, Shopify auto-downloads to its CDN; `isPublished:true` requires `publishDate` NOT in the future or it errors), then (2) hand-write the new article objects into `src/lib/cache/blog-<handle>-12.json` (keys: id,title,handle,excerpt,contentHtml,publishedAt,seo{title,description},authorV2{name},image{url},blog{title,handle},tags) + drop a 3:2 webp into `public/images/blog/<handle>.webp`, then build + `npx wrangler deploy` (no CI; deploy is manual from `main`). contentHtml must use the site's exact Tailwind classes (intro `text-base sm:text-lg ... font-normal mb-6`, h2 `font-serif text-xl sm:text-2xl font-bold text-dark mt-8 mb-4`, body p `text-sm sm:text-base text-slate-600 ... font-light mb-5`, ul `list-disc pl-5 space-y-2 mb-6 ...`).

The `.env` `SHOPIFY_ADMIN_ACCESS_TOKEN` has no content scope; the **Shopify CLI store-auth token for 2mpt3p-xv** has `write_content,write_files,write_products,read_*` (verified 2026-06-27 via `currentAppInstallation.accessScopes`). Article hero images generated via highsfield MCP (`nano_banana_pro`, 3:2, ~2 credits each). Legacy reverse-direction scripts still exist: `scripts/export-journal.mjs`, `publish-blog.mjs`, `publish-blog-seo.mjs`.

See [[pixsgo-rebrand-play-and-go]], [[pixsgo-shopify-store]].
