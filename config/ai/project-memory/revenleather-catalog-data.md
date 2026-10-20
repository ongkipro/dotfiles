# Reven Leather — Catalog & Original Price Data Sources

## Overview & Authority
- **Old Website / Origin**: `https://reven.id` (Berdu platform) is the authoritative source for original domestic Indonesian retail pricing (IDR).
- **Storefront Headless Repository**: `~/Projects/revenleather.com` (`github.com/ongkipro/revenleather.com`).

## Data File Locations (`~/Projects/revenleather.com/data/`)

1. **`data/reven_id_live_prices.json` (Authoritative Up-to-Date Live Scrape - 2026-10-13)**
   - Pulled live from `https://reven.id/sitemap.xml` and product endpoints on 2026-10-13.
   - Contains **83 products** with exact `price` (selling price), `salePrice` (promo/compare-at), variations, and SKUs.
   - Includes 3 new products not in the September snapshot:
     - `nerow-backpack`: Rp 1.890.100 (coret Rp 3.750.000)
     - `nerow-totebag`: Rp 1.020.100 (coret Rp 2.250.000)
     - `virello-wallet`: Rp 190.100 (coret Rp 380.000)
   - Price change recorded:
     - `jayatra-handbag`: Rp 510.100 -> Rp 530.000 (coret Rp 989.000).

2. **`data/products.json` & `data/shopify_products.csv` (Harmonized Catalog - 80 Products)**
   - Normalized 80 products / 209 variants formatted for Shopify import.
   - Contains clean fields: `priceMin`, `priceMax`, `compareAtPriceMin`, `compareAtPriceMax`, clean SKUs, and weights.

3. **`content/products/*.md` & `content/CATALOG.md` (Markdown Product Dossiers)**
   - Individual markdown files per product with frontmatter metadata (price, SKU, material, dimensions, warranty).

4. **`backup_shopify_live/data/products.json` (Pre-USD Live Store Backup - 2026-10-08)**
   - Complete backup of the Shopify store (`euzdfv-ur.myshopify.com`) before USD conversion.
   - Records all variants and prices as they were live in IDR.

5. **`data/transformed_catalog_preview.json` & `scripts/transform_catalog_english_usd.py`**
   - Active USD catalog logic for global quiet luxury repositioning.
   - Formula: `(IDR_price / 15,800) + category shipping buffer ($12 - $35)` rounded to clean `.00`.
