---
name: 99ribu-berlapak-catalog
description: 99ribu.com product & image data vault extracted from Berlapak.com (482 products HPP <= Rp49k, 2,882 local images in /data/99ribu-berlapak-data)
metadata:
  node_type: memory
  type: project
---

# 99ribu.com — Berlapak Product & Asset Data Vault

## 1. Canonical Locations
- **Data Vault (Drive D / `/data`)**: `/data/99ribu-berlapak-data/` (symlinked at `/data/projects/99ribu`)
- **Coming-Soon / Storefront Repo**: `/home/ongki/Projects/99ribu-comingsoon` (live at `https://99ribu.com/`)
- **Design System Spec**: `/home/ongki/Documents/work/notes/99ribu-design-system.md` (Inter typography + Mengantar component geometry + 99ribu warm-orange/amber retail palette)

## 2. Dataset Summary (`/data/99ribu-berlapak-data/`)
- **Total Berlapak Catalog Scanned**: **907 products** (`data-json/all-907-catalog-overview.json`)
  - **`< Rp10.000` (Rp1.700 – Rp9.500)**: **47 products** (5.2% of catalog | **44 Ready Stock**)
  - **`Rp10.000 – Rp49.000`**: **435 products** (48.0% of catalog | **329 Ready Stock**)
  - **Combined Target (`<= Rp49.000` for 99ribu.com)**: **482 products** (53.1% of catalog | **373 Ready Stock**)
  - `Rp50.000 – Rp99.000`: 242 products
  - `> Rp99.000`: 183 products
- **Local Image Assets (`images/`)**:
  - **2,882 `.webp` image files** (**223.97 MB** total — compressed from **2,260.29 MB / 2.26 GB**, saving **2.04 GB / 90.1%**, average **~77.7 KB** per image, max `1080x1080`, quality `82`, 0 failed) organized into 482 product folders (`images/001-<slug>/img-01.webp`, `var-01.webp`, etc.) and mapped in `data-json/image-manifest.json`.

## 3. Folder Structure in `/data/99ribu-berlapak-data/`
- `README.md` — Full documentation of the vault and field schema.
- `catalog-md/MASTER-CATALOG-482.md` — Complete 482-product Markdown table (`<= Rp49.000`: HPP, normal price, reference selling price, 99ribu bundle scheme, stock, warehouse, weight, variants, COD, sold count, GDrive link, local `.webp` image path).
- `catalog-md/UNDER-10K-47.md` — Dedicated table of the 47 products with HPP `< Rp10.000` (`Rp1.700 – Rp9.500`).
- `catalog-md/MASTER-CATALOG-435.md` — Subset table of the 435 products with HPP `Rp10.000 – Rp49.000`.
- `catalog-md/READY-STOCK-ALL.md` — Filtered table of all **373 Ready Stock** products (`<= Rp49.000`).
- `catalog-md/READY-STOCK-329.md` — Filtered table of 329 Ready Stock products (`Rp10.000 – Rp49.000`).
- `catalog-md/REKOMENDASI-BUNDLING-99RIBU.md` — 5-tier bundling unit economics for flat Rp99.000 pricing (including Tier S `< Rp10.000`), Top 35 winning SKUs, and single-origin warehouse consolidation hubs.
- `categories-md/*.md` — 12 Storefront category Markdown catalogs (`01-*.md` .. `12-*.md`) + `INDEX-KATEGORI.md`.
- `products-md/001-<slug>.md` .. `482-<slug>.md` — 482 individual product spec sheets including full variant tables, courier support, warehouse district/city/province, local `.webp` image mappings, Google Product Category ID, and full product descriptions.
- `data-json/products-up-to-49k-full.json` — Complete machine-readable JSON for all 482 products.
- `data-json/products-under-10k-full.json` — Complete JSON for the 47 `< Rp10.000` products.
- `data-json/products-10k-49k-full.json` — Complete JSON for the 435 `Rp10.000 – Rp49.000` products.
- `data-json/products-up-to-49k-ready-stock.json` — Ready-stock JSON subset (373 products).
- `data-json/image-manifest.json` — Remote-to-local `.webp` asset mapping for all 2,882 images (with original vs WebP size & dimensions).
- `images/<rank>-<slug>/` — Local product gallery and variant `.webp` images (482 folders, 223.97 MB total).

## 4. 99ribu.com 5-Tier Bundling & Warehouse Hub Rules
- **5-Tier Flat Rp99.000 Unit Economics**:
  - **Tier S (HPP Rp1.700 – Rp9.500 | 44 Ready Stock)**: Paket Super Grosir 5–10 Pcs Rp99.000 OR Free Gift / Order Bump Pengunci Konversi (Total HPP Rp17k–Rp48k | Gross Profit Rp51k–Rp82k)
  - **Tier A (HPP Rp10.000 – Rp14.000 | 44 Ready Stock)**: Paket 4 Pcs Serba Rp99.000 (Total HPP Rp40k–Rp56k | Gross Profit Rp43k–Rp59k)
  - **Tier B (HPP Rp14.500 – Rp19.500 | 56 Ready Stock)**: Paket 3 Pcs Serba Rp99.000 (Total HPP Rp43.5k–Rp58.5k | Gross Profit Rp40.5k–Rp55.5k)
  - **Tier C (HPP Rp20.000 – Rp29.500 | 109 Ready Stock)**: Paket 2 Pcs / BOGO Rp99.000 (Total HPP Rp40k–Rp59k | Gross Profit Rp40k–Rp59k)
  - **Tier D (HPP Rp30.000 – Rp49.000 | 120 Ready Stock)**: 1 Pcs Hero Product + Bonus Tier S Rp99.000 (Total HPP Rp30k–Rp49k | Gross Profit Rp50k–Rp69k)
- **Primary Warehouse Consolidation Hubs (for Mix-and-Match 1x Shipping)**:
  1. **Luminary** — Gudang Serpong (`TANGERANG SELATAN, BANTEN`, 173 SKUs total: 33 SKUs `< Rp10k` + 140 SKUs `Rp10k–Rp49k`)
  2. **Ochiban** — Jakarta Barat (`JAKARTA BARAT, DKI JAKARTA`, 24 SKUs, *GlowHome* best-sellers)
  3. **David Trimarta** — Pati (`PATI, JAWA TENGAH`, 44 SKUs, Men's/Women's Fashion)
  4. **Firstman Official & PT. Laqiy Isshoni Lucky** — Bogor (`BOGOR, JAWA BARAT`, 41 SKUs)

## 5. Berlapak Seller API Notes
- Base URL: `https://app.berlapak.com/api/v1`
- Pagination on `/v1/seller/products` uses `skip` and `limit` (NOT `page`), plus optional `min_price` and `max_price` filtering on `sorting_price`.
- Products with variants omit top-level `reg_price`/`sale_price` in the list endpoint and instead expose `sorting_price` and `lowest_price_variant`; full variant arrays (`variants[]`) and warehouse details (`warehouse[]`, `distributor_address`) are returned by `GET /v1/seller/products/{slug}`.

## 6. Link Map Registry & Delta Sync System (`bin/berlapak-sync`)
- **State Snapshot**: `/data/99ribu-berlapak-data/data-json/berlapak-link-map.json` indexes all **907 Berlapak products** (482 downloaded local target products `<= Rp49.000` + 425 watchlist products `> Rp49.000`) with SHA-256 fingerprints (`_id|slug|sorting_price|reg_price|sale_price|recommend_price|primary_image`).
- **Markdown Link Map**: `/data/99ribu-berlapak-data/catalog-md/LINK-MAP-REGISTRY.md` maps every product's Berlapak Web URL & API URL to its local `.md` file and local `images/` directory.
- **Changelog & Diff**: `/data/99ribu-berlapak-data/changelog/sync-history.md` and `latest-diff.json`.
- **CLI Commands**:
  - `/data/99ribu-berlapak-data/bin/berlapak-sync --check` — Fast 3-second dry-run check for newly added products (`<= Rp49k` vs `> Rp49k`), watchlist products that dropped in price into `<= Rp49k` (`dropped_into_target`), HPP changes, or removed products.
  - `/data/99ribu-berlapak-data/bin/berlapak-sync --sync` — Incremental sync: automatically downloads full product details, writes `products-md/<rank>-<slug>.md`, downloads all gallery + variant images, converts them to `.webp`, and refreshes curation & Google Catalog feeds.

## 7. Storefront Category Architecture & Google Catalog Mapping
- **Problem Solved**: In Berlapak's raw data, **198 of 482 products (41.1%)** were dumped into `"Lainnya"`. All 482 products have now been reclassified into **12 clean `99ribu.com` Storefront Categories** (`0` items left in `"Lainnya"`) and mapped to **109 valid Official Google Product Taxonomy IDs** (taxonomy release `2021-09-21`, matched against `/data/99ribu-berlapak-data/data-json/google-product-taxonomy-en-US.txt`).
- **Key Files**:
  - `catalog-md/KATEGORI-PRODUK-DAN-GOOGLE-CATALOG-MAPPING.md` (and copy at `/home/ongki/Documents/work/research/99ribu-google-catalog-category-mapping.md`) — Full documentation of the 12 Storefront Categories, 36 Subcategories (`product_type`), 109 Google Product Taxonomy IDs, 26 Curated Bundles, and 482-product mapping table.
  - `categories-md/INDEX-KATEGORI.md` & `categories-md/01-*.md` .. `12-*.md` — 12 Storefront category Markdown files with Google Category IDs.
  - `data-json/google-catalog-category-mapping.json` — Complete JSON mapping for categories, subcategories, 26 bundles, and 482 products.
  - `data-json/google-merchant-feed-99ribu.tsv` & `data-json/google-merchant-feed-99ribu.json` — Ready-to-upload **Google Merchant Center / Meta Advantage+ Catalog Feed** (508 items: 26 Cross-SKU Bundles + 482 SKUs with `google_product_category`, `product_type`, `is_bundle`, `multipack`, and `custom_label_0..4`).
