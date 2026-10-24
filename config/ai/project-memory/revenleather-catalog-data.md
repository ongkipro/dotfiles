# Reven Leather — Catalog, LP Funnel & Original Price Data Sources

## 1. Active Repositories & Production Surfaces
- **Ads/COD landing-page funnel (`page.revenleather.com`)**: repo `~/Projects/revenleather`
  (AdsBookCMS install, see [[adsbookcms-install-fleet]]). Checkout form behavior, payment-method
  ordering, COD rules, and tracking IDs are owned by that repo (`STATUS.md`, `TRACKING_SPECS.md`,
  `src/scripts/form-hybrid.ts`), not by this file.
- **Ads catalog working files**: `~/Documents/work/content/revenleather-lp/` — `CATALOG-MASTER-ADS.md`
  (catalog, variant IDs, discount tiers, feeds) and `approve-grafir.md` (approved engraving mapping).
  Re-count products and LPs from those files; do not trust a remembered number.
- Feed invariant: the 5-digit `products.id` is the feed `<g:id>` and the Pixel/CAPI `content_ids`.
- **Storefront Headless Repository**: `~/Projects/revenleather.com` (`github.com/ongkipro/revenleather.com`).
- **Old Website / Origin**: `https://reven.id` (Berdu platform) is the historical source for domestic Indonesian retail pricing (IDR).

## 2. Historical Data File Locations (`~/Projects/revenleather.com/data/`)
1. **`data/reven_id_live_prices.json` (Live Scrape - 2026-10-13)** — 83 products with `price`, `salePrice`, variations, and SKUs.
2. **`data/products.json` & `data/shopify_products.csv` (Harmonized Catalog - 80 Products)** — Normalized products/variants formatted for Shopify import.
3. **`content/products/*.md` & `content/CATALOG.md`** — Individual markdown dossiers per product.
4. **`backup_shopify_live/data/products.json` (Pre-USD Live Store Backup - 2026-10-08)** — Backup of `euzdfv-ur.myshopify.com` before USD conversion.
5. **`data/transformed_catalog_preview.json` & `scripts/transform_catalog_english_usd.py`** — USD catalog transformation (`(IDR_price / 15,800) + category shipping buffer ($12 - $35)`).
