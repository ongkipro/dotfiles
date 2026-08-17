---
name: mystore10-furniture-shopify
description: My Store 10 (jwy0qz-ic) furniture Shopify store — listing optimization workspace like PixsGo/PetCue
metadata: 
  node_type: memory
  type: project
  originSessionId: 08b34e7f-f4f1-428f-ba4d-072e10c5af42
---

New Shopify store **jwy0qz-ic.myshopify.com** ("My Store 10", Basic plan, currency IDR, TZ Asia/Jakarta, owner <cf-account-email>). 98 raw dropship **furniture** products (end/side tables, console, coffee, nightstands, storage ottomans, accent/saucer chairs, shoe cabinets, dressers, mattress toppers, bed frames, + baby items). All ACTIVE but unoptimized (no SEO/type/tags); titles full of supplier brands (JHK, Tribesigns, SucceBuy, MCQ, HOOMIC, VEVOR); variants have `Color`/`Size`/`Ships From`.

Same listing-optimization workflow as [[pixsgo-shopify-store]] and [[petcue-shopify-site]]. Docs workspace: `~/Documents/Shopify/jwy0qz-ic - My Store 10/` (README, LISTING-PLAYBOOK, STYLE-GUIDE, KEYWORD-MAP, OPTIMIZATION_GUIDE, products_master.csv, .products_full.json, sync_data.sh, generate_files.py).

Decisions (2026-07-01): listing language = **English**; **remove `Ships From` country option entirely** (keep US variant, delete other-country variants, SKU kept intact incl country suffix for fulfillment precision); no supplier brand in title/meta; auto keyword-based copy. CLI auth: `shopify store auth --store jwy0qz-ic.myshopify.com --scopes write_products,write_files,read_products`; query via `shopify store execute --store … --query-file … --json --allow-mutations`.

**DONE 2026-07-01:** all 98 products optimized via `optimize.py` (title/handle/SEO/tags/type/category/alt + variant cleanup) — Title/Alt/SEO/Var all 98/98. Store currency was switched **IDR→USD** but price numbers didn't convert, so bulk-converted via `fix_prices.py` at rate **17,940 IDR/USD** (charm `.99`). Both scripts resume-safe (`.apply.log`, `.price.log`). Re-price after rate change: `python3 fix_prices.py --rate <n>`. **11 collections** created + all 98 assigned + per-collection SEO + AI banner images (highsfield nano_banana_pro 16:9, ~22 credits, stored on Shopify CDN) via `create_collections.py`. **2 blogs / 20 articles** (default "News" blog deleted). Both have AI header images + SEO metafields (global.title_tag/description_tag; articles have no `seo` field) + internal collection links; content/scripts in `blog/` (articles*.py, publish_articles*.py, resume-safe .articles*.log). (1) "Furniture Guides" gid 100884119710 = 10 buying-guide articles. (2) "Home Ideas & Inspiration" gid 100884283550 = 10 room/style/inspiration articles, min 500 words each + real product embeds (photo+link+price from blog/_products.json). blogDelete/articleCreate/articleUpdate all work in this API version.

**Product descriptions** (98/98) rebuilt via `add_overview.py`: Overview (2-3 product-specific sentences from title features + specs) → Why you'll love it → Specifications table. Original AliExpress specs were overwritten during first optimize, so they're preserved in `.orig_descriptions.json` (workspace) — `add_overview.py` parses specs from there, not from live/current descriptions.

**compareAtPrice** was also still IDR; converted to USD via `fix_compare.py` (same rate) → all products show ~33% strikethrough discount. **Non-CLI Admin API:** `api.py` reads the token `shopify store auth` stored at `~/.config/shopify-cli-store-nodejs/config.json` (keyed `<clientId>::<store>` → currentUserId/sessionsByUserId → accessToken shpat_…, online token ~24h expiry) and POSTs GraphQL to `/admin/api/2025-01/graphql.json` — use this when user says no Shopify CLI. **Junk product** "Test Link Only…" (id 8767504777374) set to DRAFT (could delete).

**Price anomalies FIXED:** the $5.99/$0.99 lows were junk "Accessories" variants from the AliExpress import — deleted them + cleaned the option → single-variant products (Entryway $294.99, Recliner $739.99). Junk "Test Link Only…" product deleted. **Store now 97 products, all ACTIVE**; 11 collections (all w/ image+SEO, 97 assigned); 2 blogs 10+10 articles; prices $32.99–$1519.99; compareAt on all 315 variants. `optimize.py`/`fix_compare.py`/`sync.py` all use `api.py` (direct API, no CLI); `sync.py` replaces `sync_data.sh`.

**TODO:** real store brand name still not set (placeholder in docs) — not used in listings, but update + rename folder once decided.
