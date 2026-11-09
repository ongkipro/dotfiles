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
- **Storefront Headless Repository**: `~/Documents/Shopify/Reven Leather` (`github.com/ongkipro/revenleather.com`, deployed on Shopify Oxygen as `ongki.pro ENGINE`, `gid://shopify/HydrogenStorefront/1000180487`). Read `STATUS.md` in that repo for operational truth.
- **Old Website / Origin**: `https://reven.id` (Berdu platform) is the historical source for domestic Indonesian retail pricing (IDR).

## 2. Live Storefront API vs Historical Migration Files
- **Current Source of Truth (since commit `791632e`, 2026-11-05)**: All products (82 active SKUs), collections (13 collections), navigation menus (`main-menu`), institutional pages (10 pages), store policies (4 policies), blog articles (`jurnal`), and localized SEO fields (`EN`, `ID`, `AR`) are queried live from Shopify Storefront API (`euzdfv-ur.myshopify.com`) via `@inContext(country, language)`.
- **Removed Local Migration Dumps**: The ~260 MB (`2,120+` files) of one-time migration dumps (`data/`, `content/`, `images/`, `scripts/`, `docs/`) were deleted from the repository in commit `791632e` after full Storefront API synchronization (still recoverable from Git history prior to `791632e` if historical JSON/CSV snapshots are ever needed).
