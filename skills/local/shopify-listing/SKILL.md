---
name: shopify-listing
description: >-
  Optimize Shopify product listings end-to-end via Shopify CLI for SEO + conversion.
  Use to rewrite titles, descriptions, meta SEO, URL handles, tags, set product
  category (Google taxonomy), cleanup variants (remove country/Ships From), image
  ALT text & SEO filenames, build/assign collections, and publish. Triggers:
  optimize shopify listing, maksimalkan listing produk, rapikan produk shopify,
  edit judul/deskripsi/meta SEO, rapikan varian, buat collection, collection SEO,
  scan all products, alt image SEO. Works on any store via myshopify domain. NOT
  for theme/Liquid code or app/extension dev — use official shopify-plugin skills.
---

# Shopify Listing Optimizer

End-to-end playbook to maximize Shopify product listings (tidy, clear, convert, SEO-friendly) using the **Shopify CLI**. Store-agnostic — always confirm the target store domain first.

## When to use
The user wants to improve product *listings/merchandising data* (not theme code): titles, descriptions, SEO meta, handles, tags, category, variants, images, collections, publish. Often phrased in Indonesian ("maksimalkan listing", "rapikan", "rapikan varian", "isi category", "alt image").

## Prerequisites
1. **Shopify CLI** installed (`shopify version`; install: `npm i -g @shopify/cli@latest`).
2. **Store domain** — ask the user (e.g. `xxxxx.myshopify.com`) if not given.
3. **Auth** (interactive browser; the USER must run it, suggest `! ` prefix). Online token **expires** → re-auth on `ACCESS_DENIED`:
   ```
   shopify store auth --store <store>.myshopify.com --scopes write_products,write_files,read_products
   ```
   `write_products` = products/variants/tags/SEO/handle/category/collections · `write_files` = image ALT + filename rename.
4. Run ops: `shopify store execute --store <store> --query '...' [--variables '...'] [--allow-mutations]`. Prefix CLI calls you run with analytics env per the host's `use-shopify-cli` guidance when available.

## Workflow (recommended order)
1. **Scan & audit** — count products, read titles + `descriptionHtml` + options/variants + SEO fields. Identify gaps (missing meta/category/tags, junk scraped descriptions, country variants, code-named variants). Mine real specs (material, age, pieces, theme) from old descriptions — do NOT invent facts.
2. **Pilot one product** end-to-end, show the user before/after, get approval on style + key decisions (brand generic vs kept, market/language, SKU handling) BEFORE batching. This is a destructive, customer-facing bulk op — checkpoint once.
3. **Variant cleanup** — remove "Ships From"/country variants (keep the chosen market, default United States), delete the now-redundant option, **keep SKUs exactly as-is**.
4. **Rename variant values** — turn codes (TG507, MC701…) into real names; identify ambiguous ones by reading each variant's image (`variants.nodes.image.url`). Relabel option `Color`→`Style`/`Design` when values aren't colors.
5. **Generate listing copy** — for large catalogs, fan out to subagents (Agent tool), ~15-20 products each, writing JSON to files you then apply. Follow `references/copywriting.md` exactly. Validate (char limits, no brand leak, no CTA) before applying.
6. **Apply** via `productUpdate` (title, handle, descriptionHtml, seo, tags, productType, **category** taxonomy id).
7. **Image SEO** — set ALT (`productUpdateMedia`) and rename filenames to `<handle>-N.ext` (`fileUpdate`, needs `write_files`; skip "non-ready" files).
   - **Alt text pattern**: `[Product Title] - [view/angle/feature]` (max 125 chars). Remove generic `"main product image"` / `"product image N"` suffixes.
   - Batch per-product: pass all media items in one `productUpdateMedia` call with media array (NOT JSON — use unquoted GraphQL keys `id:` `alt:`). Use `--query-file` to avoid shell escaping issues.
   - Verify post-update: query `product.media.edges[].node.image.altText`.
8. **Collections** — `collectionCreate` + `collectionAddProductsV2`, one collection per category. Then make each collection SEO-complete via `collectionUpdate`: keyword-rich `descriptionHtml` (1-2 short paragraphs, no CTA), `seo{title,description}` (same rules as products: keyword-first metaTitle ≤60 no store-suffix; metaDescription ≤155 no CTA), and a **cover image** with `image{src,altText}`.
9. **Collection cover images** — if an image-generation tool is available (e.g. a connected MCP like Higgsfield `generate_image`), generate a consistent set of clean studio cover images (one representative subject per collection, same background/aspect ratio for grid cohesion), confirm style with the user via a pilot, then attach with `collectionUpdate(image:{src:<generated URL>, altText:"<Collection> – <Store>"})` (Shopify fetches the URL). Skip generation if no such tool; ALT + SEO text still apply.
10. **Publish** — ensure status `ACTIVE`.
11. **Log** — append what changed to a Markdown edit-log (the user often keeps one under `~/Documents/Shopify/<Store>/`).

## Hard rules (non-negotiable)
- **No brand names** in title/metaTitle/tags/imageAlt unless the user opts in — use generic terms. **No** origin ("Mainland China") or "Brand Name: NONE" anywhere.
- **No CTA** ("buy/shop/add to cart/order") in description or meta. **No** shipping line in the body unless the user asks.
- **Meta title** = keyword-focused; do NOT append "| StoreName" unless requested.
- Limits: title ≤70, metaTitle ≤60, metaDescription ≤155, handle ≤6 keyword words (unique!).
- **SKUs of kept variants stay unchanged** (inventory/fulfillment precision).
- Fix all typos; only use verifiable facts.

## Operational notes
- Make batch scripts **resume-safe** (log succeeded ids, skip on re-run) — the online token can die mid-batch.
- Run long batches in the background with a progress log; verify, then continue.
- **Handles must be unique** — similar products collide; add a distinguisher (`-led`, `-set`).
- Final QA: 0 products missing meta/category/type/tags/alt, 0 junk descriptions, 0 leftover country options.

## References (read on demand)
- `references/mutations.md` — GraphQL query/mutation cheat-sheet, taxonomy (Google category) lookup + common toy IDs, pagination, image SEO.
- `references/copywriting.md` — exact copy rules + title/description/meta templates for subagents.

## Image Alt Text Checklist

Every product image must have descriptive alt text. Common default patterns to **fix**:
- `[Title] main product image` → `[Title] - front view showing [key features]`
- `[Title] product image N` → `[Title] - [specific view label]`

View labels to rotate: `front view`, `alternate angle view`, `lifestyle in-use shot`, `size reference view`, `feature close-up view`, `packaging view`, `detail view`, `material close-up view`, `top-down view`, `side angle view`.

**Batch update tip**: Use `--query-file` with GraphQL-native syntax (no quoted JSON keys) for safe escaping:
```graphql
mutation {
  productUpdateMedia(productId: "gid://shopify/Product/...", media: [
    {id: "gid://shopify/MediaImage/...", alt: "Product Title - front view"}
  ]) { media { id alt } userErrors { field message } }
}
```

> This skill encodes a workflow proven on a 125-product catalog. Adapt thresholds/market to the user's store; always confirm market, language, and brand policy in the pilot step.
