# CPAS (Meta Collaborative Ads) with Shopee

Reviewed **2026-11-07** from a five-lane parallel study (Meta API/SDK, Shopee
Indonesia, attribution/reconciliation, operating practice, dotads-meta design)
plus a **Rp 314.57M empirical Indonesia Shopee CPAS audit** across two accounts
(`2,571` purchases). Full evidence, quotes and conflicts live privately in
`~/Documents/work/research/Shopee CPAS Meta ads system/` (report and
`research_notes/`). Read this before planning, reading or judging any campaign
that sends traffic to a Shopee catalog.

Labels: **[Meta]** / **[SDK]** official documentation or pinned
facebook-business 26.0.2 source; **[Shopee ID]** Shopee Indonesia (mostly
indexed excerpts: Seller Centre pages are JavaScript-rendered);
**[Shopee other-region]** SG/MY/PH/TH material; **[third-party]** agency or
tool writing; **[inference]** analysis; **[proposal]** this skill's rule.

## 1. What CPAS is, and what it is not

[Meta] CPAS is ordinary Advantage+ catalog advertising against a
**retailer-shared catalog segment**. There is no separate campaign type. The
brand cannot edit the segment but can build product sets from it; the
retailer's pixel/SDK reports the events; Meta advises **one ad account per
retailer**, and a linked account can only select that retailer's segments.

[inference] It is **not** "an ad that links to Shopee", a Sales objective, a
campaign named "Shopee", or IDR spend. Ad copy mentioning Shopee in a non-CPAS
account was observed locally.

| Dimension | Ordinary Meta sales | Shopee CPAS |
| --- | --- | --- |
| Catalog | Advertiser-owned | Shopee's segment; read-only for the brand [Meta] |
| Signal | Advertiser Pixel/CAPI, fixable | Shopee's pixel/SDK; the brand cannot repair it [Meta] |
| Identification | Objective/product set are not proof | Catalog lineage → `is_catalog_segment = true` [Meta]/[SDK], plus an explicit shop binding [proposal] |
| Results | `actions`, `action_values`, `purchase_roas` | Dedicated `catalog_segment_*` and `converted_product_*` arrays, requested separately [Meta]/[SDK] |
| Revenue truth | Own backend | Shopee settlement after fees, vouchers, cancellations, later adjustments [inference] |
| Competing claims | Other ad platforms | Also Shopee Ads and Shopee Affiliate (AMS) [Shopee]/[third-party] |
| Commercial levers | Site, offer | Shopee price, voucher, stock, shipping, sale slot, program fees — change results without an ad edit [proposal] |

## 2. Identify CPAS by lineage

- [Meta] The CPAS guide's example uses campaign `objective =
  PRODUCT_CATALOG_SALES` and `promoted_object.product_catalog_id =
  <segment id>`; modern sales guidance uses `OUTCOME_SALES`. Generic catalog
  ads put `product_set_id` in the ad-set promoted object and the creative.
  An ad-set-only catalog lookup is therefore not a universal classifier.
- [proposal] Collect campaign and ad-set promoted objects and creative
  `product_set_id`; resolve product sets to catalogs; read `id, name,
  is_catalog_segment` once per distinct catalog.
- [SDK] `is_catalog_segment` (bool), `catalog_segment_filter`,
  `catalog_segment_product_set_id`, `parent_catalog_id` exist on
  ProductCatalog. No readable `is_collaborative_ads` flag on campaign, ad set,
  ad or ad account was found; `AdAccount.ClaimObjective.collaborative_ads` is an
  operation enum, not a classifier.
- [proposal] Bind retailer/market/shop explicitly. A denied or ambiguous
  lookup is **unknown**, never "not CPAS". A segment with unknown retailer is
  shared-catalog evidence, not "Shopee verified".
- [Meta] The reporting recipe lists `ads_management` + `business_management`
  and a user entitled to view reports; `ads_read` alone is not verified
  sufficient.

## 3. Read results correctly

[Meta]/[SDK] Segment fields are `list<AdsActionStats>` (not scalars), at
account, campaign, ad-set and ad level, and are **estimated**:

| Field | Meaning |
| --- | --- |
| `catalog_segment_actions` | Actions (purchase, add-to-cart, view) attributed to the shared segment, by action type |
| `catalog_segment_value` | Value of those actions across website/mobile/omni; select the purchase action, do not sum all |
| `catalog_segment_value_omni_purchase_roas` / `_website_` / `_mobile_` | Shared-item purchase ROAS by source |

[Meta]/[SDK] Product reporting is a **separate capability**:
`converted_product_quantity` (units, not orders) and `converted_product_value`,
plus channel variants (`converted_product_omni_purchase`,
`converted_product_omni_purchase_values` — plural,
`_website_pixel_purchase[_value]`,
`_app_custom_event_fb_mobile_purchase[_value]`,
`_offline_purchase[_value]`). They need
`action_breakdowns=action_converted_product_id` (or with `action_type`),
**not at account level**, and return product IDs only.

**Known incompatibility** [Meta]/[SDK]: the CPAS guide documents
`action_converted_product_id`, but the generic Insights enum and SDK
`AdsInsights.ActionBreakdowns` omit it (the response schema has it). Strict SDK
checks can throw. Capability-test it and keep the error; never turn it into
zero sales.

Rules [proposal]:

- Keep missing, empty, invalid and explicit zero apart. Do not sum omni with
  website/app/offline, overlapping windows, or entity levels; recompute period
  ROAS from value and spend, never average daily ROAS.
- **Critical CPAS Purchase Conversion column rule (`catalog_segment_*` vs ordinary `actions`)**:
  - On Collaborative Ads (CPAS) accounts, **99.9%+ of real marketplace purchase conversions are NOT reported in ordinary `actions` or `action_values`**. Ordinary `actions` (`omni_purchase`, `purchase`) only capture events fired on an ad-account-owned pixel/dataset (often `0` in 7d/30d windows on pure Shopee CPAS accounts), creating a false "0 Purchase" diagnosis if inspected alone.
  - Real CPAS Purchase Conversions live in the **Partner Catalog Segment fields**:
    - **`catalog_segment_actions`**:
      - Total CPAS Purchase Conversions: `action_type: "omni_purchase"` (or `"purchase"`)
      - In-App Shopee SDK Purchases: `action_type: "app_custom_event.fb_mobile_purchase"` (and `"onsite_app_purchase"`)
      - Website Pixel Purchases: `action_type: "offsite_conversion.fb_pixel_purchase"`
      - CPAS Add to Cart: `action_type: "omni_add_to_cart"`, `"app_custom_event.fb_mobile_add_to_cart"`, `"offsite_conversion.fb_pixel_add_to_cart"`
      - CPAS Content Views: `action_type: "omni_view_content"`, `"app_custom_event.fb_mobile_content_view"`, `"offsite_conversion.fb_pixel_view_content"`
    - **`catalog_segment_value`**:
      - Total CPAS Purchase GMV: `action_type: "omni_purchase"` (or `"purchase"`)
      - In-App Purchase GMV: `action_type: "app_custom_event.fb_mobile_purchase"`
      - Website Purchase GMV: `action_type: "offsite_conversion.fb_pixel_purchase"`
    - **ROAS & Result Indicators**:
      - `catalog_segment_value_omni_purchase_roas`, `catalog_segment_value_mobile_purchase_roas`, `catalog_segment_value_website_purchase_roas`
      - At Campaign/AdSet/Ad level, Meta Insights sets `results` indicator to `"catalog_segment_actions:omni_purchase"` and `result_values_performance_indicator` to `"catalog_segment_value:omni_purchase"` (whereas Account-level `results` defaults to `actions:omni_purchase` and misses CPAS purchases).
      - `converted_product_quantity` (`purchase` / `omni_purchase`) reports total units sold (which exceeds `catalog_segment_actions:omni_purchase` order count when buyers purchase multiple units per order).
- **Mandatory Attribution Window Split (`7d_click` vs `1d_view`) on `catalog_segment_actions`**:
  - Always request `action_attribution_windows=['1d_click','7d_click','1d_view','default']` when auditing CPAS purchase conversions.
  - In Retargeting (`RMK`) CPAS campaigns, **80%–86% of `catalog_segment_actions:omni_purchase` are `1d_view`** (impression-only view-through credit on warm marketplace shoppers who already had items in their Shopee cart/history), whereas in Cold Prospecting (`NV`), `7d_click` share is 2x higher (`~28%+`) and `CPA_7d_click` can be **cheaper than `RMK` `CPA_7d_click`**.
  - Never judge placement or creative traffic quality by `1d_view`-inflated total ROAS alone; always evaluate **Click-Through Purchase Conversion (`catalog_segment_actions:omni_purchase` `7d_click`, `CPA_7d_click`, and `ROAS_7d_click`)** alongside Total Segment Purchases.
- [inference] Value composition is **not established**: current Meta pixel
  specs do not say "whole basket incl. shipping and tax"; one vendor describes
  shared-item value as item price × quantity. Do not treat any CPAS value as
  seller net.
- Attribution [Meta]: `action_attribution_windows` sets windows,
  `action_report_time` sets the date basis, `use_unified_attribution_setting`
  aligns with Ads Manager. `7d_view`/`28d_view` stopped returning
  2026-01-12. The 2026 link-click-only click definition is scoped to
  website/in-store conversion campaigns; application to Shopee app CPAS is
  unproven. General Insights support for these parameters is documented;
  per-CPAS-field and per-account compatibility is **not verified** — test it.
  Record requested and effective settings; never label a default.
- Platform changes [Meta]: v26 (2026-07-29) forbids `applink_treatment=web_only`
  for Website+App (all versions 2026-10-27) — check Shopee deep links; v27
  (2026-11-04) can default product showcase on and expand devices. Catalog
  appearance is not CPAS identity.

## 4. Three ledgers — never mixed

| Ledger | Establishes | Does not establish |
| --- | --- | --- |
| **Meta claim** [Meta] | Estimated shared-item events/value/ROAS under a stated window and date basis | Payout, unique orders, incrementality |
| **Shopee channel claims** [Shopee other-region]/[third-party] | Shopee Ads direct/broad credit (PH/TH: 7-day click or 1-day GMV Max view; placed includes later cancellations), AMS commission | Non-overlapping totals, completion, profit |
| **Orders/settlement** [inference] | Distinct orders/items, releases, refunds, fees, pending receivables | Which ad caused the order |

[proposal]

- Never divide one ledger's revenue by another's spend; never add channel
  claims. Broad includes direct; repeated campaign order counts are not
  distinct orders.
- Join only on real keys: `(market, shop_id, order_sn)` plus line/item/model
  IDs; all IDs are strings. Normal aggregated CPAS reports need not expose
  Shopee order IDs; without a legitimate order bridge in the supplied data,
  exact Meta→order matching is unavailable. Label method:
  `EXACT_LEDGER_JOIN`, `AGGREGATE_COMPARISON`, `MODELED_ALLOCATION`,
  `UNAVAILABLE`.
- Two date views: order cohort (followed to an `as_of` cutoff) and
  cash/settlement period. Pending is not zero; missing COGS is not free.
- Optional exclusive allocation (e.g. charged affiliate → Shopee Ads → CPAS →
  residual) is a disclosed **model**, not causality.
- Incrementality needs a design (Conversion Lift if eligible, geo holdout,
  balanced switchback); one pause is not proof.

## 5. Shopee Indonesia economics (dated scenarios)

All rates below are **[third-party] transcriptions of Shopee tables, checked
October 2026**; re-read Seller Centre before use. Fees are SKU-subcategory,
seller type, upload date, enrollment and size specific — never one "Shopee %".

- **Biaya Administrasi** (table updated 2026-07-31): Non-Star/Star/Star+
  2.50–10.00%, Mall 2.50–11.70%; base = price after **seller-funded**
  discounts, excluding shipping. Mall payment fee 1.80% (cap Rp50,000/qty).
- **Biaya Proses Pesanan** Rp1,250 per completed order (allocated across
  items). Scope conflict: "all sellers from 2026-08-01" vs earlier start with
  exemptions — unresolved.
- **Gratis Ongkir XTRA** (optional, charged on all completed orders of enrolled
  sellers):

  | Scenario | Normal size | Special size (≥5 kg or ≥60 cm side or ≥20,000 cm³) |
  | --- | --- | --- |
  | Nov 2026 (from 2026-05-02) | 1–8%, cap Rp40,000/qty | 2.5–9.5%, cap Rp60,000/qty |
  | Non-Mall from **2026-12-01** | 1.5–11%, cap Rp60,000/qty | 3.5–13%, cap Rp80,000/qty |
  | Mall from **2027-01-01** | same as above | same as above |

  No "old + N points" rule; higher caps can raise cost even where a % drops.
  12.12 Non-Mall planning uses the December scenario.
- Other optional lines (not automatic): Promo XTRA, Promo XTRA+, Live/Video
  XTRA, SPayLater XTRA, Pre-Order. **AMS** commission only on qualifying
  affiliate orders.
- **PPh 22** (DJP release, government source cited in a third-party lane):
  marketplace withholding from **2026-10-01** at 0.5% of gross turnover
  **excluding PPN/PPnBM**; individuals with annual turnover up to Rp500 million
  avoid withholding when they submit the required declaration. A
  cash-flow/tax item, not an automatic second expense.
- **Iklan Affiliate Meta** [Shopee ID, indexed excerpt 2026-10-16]: AMS
  affiliate content run as Meta ads (Reels from 2026-10-08; content needs ≥1
  order). [third-party] The seller pays media **plus** commission — budget it
  separately from catalog CPAS.
- **Routes** [third-party, citing Shopee ID 12270/12268]: Seller Centre (Pusat
  Promosi → Iklan Eksternal Shopee, "Saldo Iklan Meta" wallet; reported
  Rp144,000/day × ≥3 days) vs Ads Manager (Meta payment method). Do not carry
  one route's settings to the other. Indonesian eligibility thresholds are
  **unknown**. [Shopee other-region, indexed excerpts only] SG: ≥4 active SKUs,
  >USD 30 GMV/month.
- **Settlement** [third-party]: Pending → Sudah Dilepas → Saldo Penjual → bank; income export
  in Keuangan → Penghasilan Saya (sheets include Penghasilan and Penyesuaian
  for later AMS/refund changes). Exact release trigger/timing is
  low-confidence.

Per-order headroom [proposal]:

```text
headroom = seller-net product revenue (after seller-funded discounts)
           - applicable fees (dated, SKU-level) - expected return loss
           - COGS - packing/fulfilment - target contribution
max CPA  = headroom
```

Do not divide Meta's shared-item value by this CPA and call it break-even;
use compatible bases and settled fees for mature orders.

## 6. Operating playbook (graded)

Grades: **A** documented constraint or data-integrity control; **B** qualified
regional/historical practice with rationale; **C** local hypothesis to test;
**Hold** unverified entitlement. No representative Indonesia 2024–2026 CPAS
benchmark exists in the evidence.

- **A — readiness first**: accepted segment, correct retailer account,
  permissions, shop binding, eligible stock, working destinations on iOS,
  Android and web, requested vs returned coverage. Signal defects go to
  Shopee, not a brand pixel.
- **B — structure**: consolidated; always-on acquisition plus retargeting when
  the audience supports it; a spike campaign for mega sales (MY 2021 handbook,
  SG guidance). **C**: ABO for bounded comparisons.
- **B — optimization**: judge on purchases and contribution. Low volume →
  consolidate, check signal/link, then offer and margin. **C**: view-content /
  add-to-cart experiments still judged downstream. The ~50 events/week figure
  is a planning heuristic, not a launch minimum; "≤20% budget edits" and
  "restart within 14 days keeps learning" are **not verified**.
- **B — product sets**: broadest commercially coherent set with stock, valid
  variants and acceptable realized margin; split only for different CPA
  limits or messages. **Unverified lead:** a Meta Help Center excerpt (page
  unreadable, discovery-only) suggests filtering product sets by brand/product
  name rather than IDs; validate on a live account before relying on it.
- **B — audiences**: broad acquisition is the consistent regional baseline;
  separate viewed/carted non-buyers from repeat buyers. **Hold**: lookalikes,
  retailer custom audiences, Extended Audience Retargeting, Basket Insights
  until granted.
- **B — creative**: the segment is read-only but primary text, carousel,
  collection, frames are usable; keep a BAU control, teaser, valid
  price/voucher and real final-hours assets. No verified refresh cadence.
- **B — mega sales**: start at least one month ahead (Shopee Marketing
  Solutions); approve SKU economics at the actual discounted price, voucher
  funding, stock, spend ceiling and rollback owner first. Fixed budget splits
  are illustrative only. 2026 dates (third-party): 11.11 and 12.12
  (Harbolnas); check platform windows.
- **Diagnose in order**: account/segment/products → price/stock upstream →
  link/offer friction (`InApp_VC / link_click` via `app_custom_event.fb_mobile_content_view`) → metric scope → overlap and settled contribution →
  marginal economics. High Meta ROAS with flat shop sales is an alignment
  question before a verdict.

## 7. Empirical Indonesia Shopee CPAS Architecture (`1-1-1` Direct-to-App Standard — Dynamic Across All Niches & Products)

Audited **2026-11-07** across **Rp 327,129,231** of Indonesia Shopee CPAS spend
(**`87,830` `catalog_segment_actions:omni_purchase` orders** — `14,501`
`7d_click` + `73,329` `1d_view` — generating **Rp 5,287,444,081** in attributed
GMV across multiple accounts). The **technical, column-measurement, and placement
invariants (§7.1–§7.4)** apply universally to every Shopee CPAS campaign
regardless of brand or category; the **commercial, audience, catalog, and budget
parameters (§7.5)** adapt dynamically to each brand's niche, catalog size, AOV,
and unit economics (never locked to a single brand or vertical).

### 7.1 Forensic Purchase Conversion columns (`catalog_segment_*`), `7d_click` vs `1d_view`, & deep-link law

- **99.94% of CPAS purchases live only in `catalog_segment_actions` & `catalog_segment_value`**:
  - Across audited accounts, ordinary `actions:omni_purchase` recorded only `57`
    purchases (`0` in 7d/30d windows), whereas
    `catalog_segment_actions:omni_purchase` recorded **`87,830` purchases**
    (`86,209` in Account A worth Rp 5.10B at `ROAS 19.16x`; `1,621` in Account B
    worth Rp 185.03M at `ROAS 3.04x`). Always query `--metric-profile cpas_v1`
    (`catalog_segment_actions`, `catalog_segment_value`,
    `catalog_segment_value_*_purchase_roas`).
- **99.999% Mobile App SDK Purchase Conversion**:
  - Inside `catalog_segment_actions`, `app_custom_event.fb_mobile_purchase`
    accounted for **`87,829 / 87,830` purchases (`99.999%`)** and
    `offsite_conversion.fb_pixel_purchase` accounted for **`1` purchase
    (`0.001%`)**.
- **Separate `7d_click` (Click-Through Purchase) vs `1d_view` (View-Through Purchase)**:
  - In Retargeting (`RMK`), **85.6%** of `catalog_segment_actions:omni_purchase`
    came from `1d_view` (`64,948` `1d_view` vs `10,953` `7d_click`;
    `CPA_Total = Rp 2,930` vs `CPA_7d_click = Rp 20,303`; `ROAS_Total = 20.14x`
    vs `ROAS_7d_click = 3.05x`).
  - In Cold Prospecting (`NV`), `7d_click` achieved a **25% cheaper Click-Through
    Purchase CPA** (`CPA_7d_click = Rp 15,269`, `ROAS_7d_click = 3.90x`) than
    Retargeting (`CPA_7d_click = Rp 20,303`, `ROAS_7d_click = 3.05x`)! Relying
    only on blended `1d_view` + `7d_click` causes operators to over-allocate
    budget to `RMK` and under-fund `NV` prospecting.
- **`app_site_visit` is NOT proof the native Shopee App opened**: when Instagram
  WebView intercepts a Shopee universal link
  (`https://shopee.co.id/universal-link/product/...`) into the Instagram In-App
  Browser (IAB), Meta logs `app_site_visit` on the universal-link hit while
  actual Shopee App SDK arrival (`app_custom_event.fb_mobile_content_view`,
  `InApp_VC`) collapses (`0.83%` on IG Feed Carousel; `0.52%` on IG Stories).
- **Mandatory deep-link health check**: always verify true native Shopee App
  arrival via `catalog_segment_actions` / `actions`
  `app_custom_event.fb_mobile_content_view / link_click` (healthy target
  `35%–60%+` on Facebook Feed/Reels), `app_custom_event.fb_mobile_add_to_cart`,
  and `catalog_segment_actions:omni_purchase` (`7d_click` + `1d_view`), never
  `app_site_visit` alone.

### 7.2 Placement & device architecture by `7d_click` Purchase Conversion (`Mobile Only`, `FB Feed + FB Reels + Threads Stream`)

- **Device**: `device_platforms: ["mobile"]` (`0%` desktop).
- **Allowed placements (proven #1 & #2 on `7d_click` Purchase Conversion)**:
  - `publisher_platforms: ["facebook", "threads"]`
  - `facebook_positions: ["feed", "facebook_reels"]`
  - `threads_positions: ["threads_stream"]`
  - In Cold Prospecting (`NV`), **`facebook_reels`** delivered the **#1 cheapest
    Click-Through Purchase CPA (`CPA_7d_click = Rp 8,727`, `CVR_7d_click = 6.95%`,
    `ROAS_7d_click = 6.59x`, `ROAS_Total = 15.44x`)** and **`facebook | feed`**
    delivered the **#1 Click-Through Purchase volume (`1,097` `7d_click`
    purchases, `CPA_7d_click = Rp 14,677`, `ROAS_7d_click = 4.32x`,
    `ROAS_Total = 13.64x`)**.
- **100% exclusion of Instagram (`0%` budget)**:
  - Even when a creative is configured with
    `applink_treatment: "deeplink_with_web_fallback"` and `template_url_spec`
    (`app_id: "957549474255294"`), Instagram's WebView intercepts Dynamic
    Product Carousel (`CAROUSEL_DPA`) clicks inside the Instagram In-App
    Browser (`0.83%` `InApp_VC`, `99.17%` drop-off).
  - Measured by true **`7d_click` Purchase Conversion** in Cold Prospecting
    (`NV`), Instagram placements were **2.2x to 5.3x more expensive per
    click-through purchase** than Facebook Reels/Feed:
    - `instagram | feed`: `CPA_7d_click = Rp 46,579`, `ROAS_7d_click = 1.21x`
    - `instagram | instagram_stories`: `CPA_7d_click = Rp 44,375`, `CVR_7d_click = 1.12%`, `ROAS_7d_click = 1.27x` (and Rp 195,976 / `0.58x` ROAS in Account B)
    - `instagram | instagram_reels`: `CPA_7d_click = Rp 19,070`, `ROAS_7d_click = 2.91x` (and Rp 140,831 / `0.81x` ROAS in Account B)
- **100% exclusion of Audience Network & Messenger (`0%` budget)**:
  - Audience Network third-party banner/rewarded-video clicks produced
    **0.012% `InApp_VC`** (`4` native app views out of `32,506` link clicks;
    `99.99%` bounce) and in Cold Prospecting (`NV`) yielded only `2` `7d_click`
    purchases from `890` clicks (`CVR_7d_click = 0.22%`, `CPA_7d_click = Rp 63,264`,
    `ROAS_7d_click = 0.63x` loss) while claiming `379` `1d_view` remarketing
    purchases (`96.9%` view-through).
- **Excluded Facebook positions**: `story`, `instream_video`, `marketplace`,
  `profile_feed`, `right_hand_column`, `search`.

### 7.3 `1-1-1` Structure & Format Rules by Funnel Stage (`CAROUSEL_DPA` vs `COLLECTION_VIDEO` vs `SINGLE_IMAGE_DPA`)

- **Golden unit (`1-1-1`)**: `1 Campaign` (`OUTCOME_SALES`,
  `smart_promotion_type: "GUIDED_CREATION"`, CBO `daily_budget` sized
  dynamically per §7.5, `LOWEST_COST_WITHOUT_CAP`) → `1 Ad Set`
  (`OFFSITE_CONVERSIONS`, `IMPRESSIONS`, `custom_event_type: "PURCHASE"`,
  attribution `1d_view` + `7d_click`) → `1 Ad` (never mix different creative
  formats inside the same ad set).
- **Never mix `COLLECTION_VIDEO` (`collection_video`) with `CAROUSEL_DPA` in the
  same ad set**:
  - In mixed ad sets, `COLLECTION_VIDEO` captures ~78% of impressions due to
    higher video CTR, starving `CAROUSEL_DPA` of delivery. Always isolate each
    format in its own dedicated `1-1-1` campaign.
- **Empirical format performance by `catalog_segment_actions:omni_purchase`**:
  - **Catalog Carousel (`CAROUSEL_DPA` / `CAROUSEL_MIXED`)**:
    - Direct-to-Shopee-PDP per card (no Instant Experience intermediary screen).
    - In Retargeting (`RMK`), `CAROUSEL` delivered the **highest volume and
      highest total ROAS (`31,384` segment purchases, `CPA_Total = Rp 2,604`,
      `CPA_7d_click = Rp 18,800`, `ROAS_Total = 22.57x`, `ROAS_7d_click = 3.32x`)**.
  - **Dynamic Single Image (`SINGLE_IMAGE_DPA`, `show_multiple_images: false`)**:
    - In Retargeting (`RMK`), achieved the **cheapest Click-Through Purchase CPA
      (`20,981` segment purchases, `3,324` `7d_click`, `CPA_7d_click = Rp 17,404`,
      `CPA_Total = Rp 2,757`, `ROAS_7d_click = 3.51x`, `ROAS_Total = 21.18x`)**.
  - **Collection Video (`COLLECTION_VIDEO` — Hero Demonstration Video + Catalog
    Grid)**:
    - When run in its **own isolated `1-1-1` campaign** on `FB Feed + FB Reels`
      with a strong KOL/founder product-demo video, `COLLECTION_VIDEO` is highly
      effective for **Cold Prospecting (`NV`)** (`7,076` segment purchases,
      `2,496` `7d_click`, `CVR_7d_click = 4.91%`, `CPA_7d_click = Rp 11,811`,
      `ROAS_7d_click = 5.04x`, `ROAS_Total = 14.68x` in Account A; `1,380`
      segment purchases, `ROAS_Total = 3.35x`, `ROAS_7d_click = 1.34x` in
      Account B). However, weak/generic cover videos suffer heavy drop-off at the
      Instant Experience screen (`86%` drop-off when paired with `"automatic"`
      applink treatment).
  - **Collection Static Image (`COLLECTION_IMAGE`)**:
    - Underperformed across both accounts (`CPA_7d_click = Rp 40,330` in `NV` and
      `Rp 31,335` in `RMK` in Account A; `CPA_7d_click = Rp 92,502`, `ROAS_Total = 2.02x`
      in Account B) because a static cover image adds an extra Instant Experience
      click step without the persuasion lift of video. Prefer `CAROUSEL_DPA` or
      `SINGLE_IMAGE_DPA` over static `COLLECTION_IMAGE`.

### 7.4 Creative deep-link & dynamic template contract

- `applink_treatment`: `"deeplink_with_web_fallback"` (never `"automatic"`,
  which leaked `65%–72%` of Facebook Feed clicks to the mobile web browser).
- `template_url_spec` (for Shopee Indonesia; substitute the corresponding
  marketplace app IDs when running in another country/retailer):
  ```json
  {
    "android": { "app_name": "Shopee ID", "package": "com.shopee.id" },
    "config": { "app_id": "957549474255294" },
    "ios": { "app_name": "Shopee ID", "app_store_id": "959841449" }
  }
  ```
- `url_tags`: `"utm_source=facebook-ca&utm_medium=seller"`
- `object_story_spec.template_data`:
  - `format_option`: `"carousel_images_multi_items"`
  - `name`: `"{{product.name}}"`
  - `description`: `"{{product.current_price strip_zeros}}"` (renders discounted
    Shopee price and strips `.00`, outperforming raw `"{{product.price}}"`).
  - `call_to_action`: `{"type": "SHOP_NOW"}`
  - `link`: `"http://shopee.co.id/"`
  - `message`: clean plain-Latin copy (`2–3` lines adapted to the product niche:
    Line 1 category problem/desire hook; Line 2 core benefit + category trust
    signal such as BPOM/Halal/Warranty/Material/Official Store; Line 3 Shopee
    voucher/bundle/free-shipping/COD offer). Never use Unicode mathematical
    alphanumeric fonts (e.g. `𝙄𝙣𝙞`), which degrade Meta NLP text parsing and
    accessibility.

### 7.5 Dynamic adaptation across niches, catalogs, and AOV/margin tiers

Never hardcode a single brand's SKU count, demographic, or IDR threshold when
the new product's unit economics differ. Adapt these four levers dynamically:

1. **Dynamic 3-Pillar Product Set Matrix (for any catalog size & vertical)**:
   - **Pillar A — Hero / Best-Seller Set (`~50%` budget)**: `2–5` proven top
     SKUs with strong marketplace social proof (`4.8+` rating and established
     review volume) so Meta cannot waste catalog impressions on cold SKUs.
   - **Pillar B — Full / Category Discovery Set (`~30%` budget)**: `≥ 5` active
     in-stock SKUs (or category-specific product sets for multi-category stores)
     for algorithmic cross-selling.
   - **Pillar C — Bundle / Multi-Pack Set (`~20%` budget)**: `2–4` bundle,
     starter-kit, or twin-pack SKUs designed to lift basket `AOV` relative to
     per-order marketplace fees and CPA.
2. **Dynamic `[PROS]` vs `[RMK]` Campaign Split (adapted to niche buying cycle)**:
   - **`[PROS]` (Prospecting)**: Broad Mobile Indonesia
     (`targeting_automation: {"advantage_audience": 1}`), with `age_min`,
     `age_max`, and `genders` matched to the product's real buyer demographic
     (e.g. `18–65+` all genders for general FMCG/household; category-appropriate
     age/gender bounds for specialized fashion, mom & baby, automotive, or B2B
     supplies).
   - **`[RMK]` (Remarketing)**: Custom Audience View Content / Add to Cart
     excluding Purchase, with lookback window scaled to the niche's consideration
     cycle (`14d` for fast-moving impulse goods; `30d` for higher-ticket or
     considered purchases).
3. **Dynamic `1-1-1` CBO Budget & Horizontal Scaling (scaled by `Target_CPA` / `AOV`)**:
   - **Initial `1-1-1` CBO Daily Budget**:
     `max(Rp 25,000, 1.5x to 2.5x Target_CPA)`
     - Low/mid-ticket goods (`AOV ≤ Rp 150,000`, `Target_CPA ≤ Rp 15,000`):
       **Rp 25,000–35,000/day** per `1-1-1` campaign.
     - Higher-ticket goods (`AOV > Rp 150,000`): scale initial CBO budget
       proportionally to `1.5x–2.5x Target_CPA` (while keeping any `LOWEST_COST_WITHOUT_CAP`
       campaign below the `Rp 300,000–400,000/day` pacing-rush ceiling).
   - **Horizontal scaling**: scale spend by duplicating winning `1-1-1` CBO
     campaign units rather than inflating a single Lowest Cost CBO 3x–10x
     overnight.
4. **Dynamic Stop-Loss / Kill Gates (scaled by `Max_CPA` headroom)**:
   - **Early ATC Kill Gate**: pause at
     `Spend >= max(Rp 45,000, 1.5x Max_CPA)`
     with `0` `app_custom_event.fb_mobile_add_to_cart`.
   - **Hard Purchase Kill Gate**: pause at
     `Spend >= max(Rp 75,000, 2.5x Max_CPA)`
     with `0` `app_custom_event.fb_mobile_purchase`.
   - **Deep-Link Health Gate**: inspect `applink_treatment` and
     `template_url_spec` immediately if `InApp_VC / link_click < 25%` after
     `≥ 50` link clicks.

## 8. Learning rules for CPAS

[proposal]

- Lifecycle stays observation → hypothesis → experiment → outcome, starting
  `UNASSESSED` / `NOT_ESTABLISHED`. Learning never authorizes spend.
- An admissible CPAS entry carries, besides account/BM/currency/timezone:
  retailer, market, shop, catalog segment, product set (or explicit null),
  merchant vs affiliate model, metric/action and value definition,
  attribution and report-time basis, grain/date/cohort/as-of, coverage and
  maturity, mapping/economics/reconciliation revision.
- Record Shopee-side events (price, voucher, stock-out, fee/program change,
  sale slot, shipping promise) and measurement rollouts as dated events.
- Required evidence grows with the claim: CPAS identity needs catalog
  evidence; revenue comparison needs compatible definitions; contribution
  needs costs, fee coverage, full spend and mature settlement; exact channel
  claims need real keys; causal claims need a controlled design.
- Do not memorize agency ROAS anecdotes, "half overlap", fixed refresh
  cadences, ramp percentages, premium entitlements or unofficial dates as
  general facts. Fee rows and waivers carry effective dates and expire.
- Restatements and overlapping windows are revisions, not replications.

## 9. dotads-meta plan

[proposal] Evidence quality before automation breadth:

1. **Phase 1 — read safely.** *Partly implemented (TASK-194):* opt-in
   `--metric-profile cpas_v1` adds the five segment arrays; legacy requests and
   hashes are unchanged; reports show CPAS status, unverified catalog lineage
   and segment values separately. Still open: catalog-observation file with
   `is_catalog_segment`, and the product query. Opt-in `metric_profile` (`legacy` default,
   byte-identical hashes; `cpas_v1` adds the five segment arrays). Product
   query is a separate, capability-tested option. Classification is a
   separate immutable catalog-observation file, not a new v1 resource.
   Separate CPAS report section; no profit, winner or lift claims. Existing
   snapshots, reports and history semantics unchanged. Code anchors (audit
   time): provider `bin/_dotads-meta-provider.py` field/plan/validation
   regions; workspace hashing and preparation in `bin/_dotads-workspace.mjs`;
   plan/collect identity in `bin/dotads-meta`.
2. **Phase 2 — offline settlement import.** Explicit plan/import/reconcile for
   operator-supplied Seller Centre exports (orders, income, adjustments) with a
   manifest (file hash, sheet/header, column map, IDR decimal policy, signed
   amounts), dry-run, immutable restricted raw store, and a separate
   `shopee_merchant_v1` economics config with dated fee lines. PII (buyer
   names, phones, addresses) dropped at import. Shopee Open Platform APIs
   deferred until access is confirmed.
3. **Phase 3 — learning v2.** Entry-level CPAS context and typed evidence
   references; v1 memory and bundles unchanged; strict context matching;
   immature outcomes qualified.

Highest-value missing evidence: an authorized **redacted** current Indonesian
export fixture set plus an explicit shop/catalog/product map, then a minimal
authorized Meta read on a known CPAS and a known ordinary catalog.

## Sources

Evidence, quotes and dates for every line above are in the private research
report `Shopee CPAS Meta ads system.md` and its notes. Key public sources:
[Meta Collaborative Ads](https://developers.facebook.com/docs/marketing-api/collaborative-ads/) ·
[Premium Options](https://developers.facebook.com/docs/marketing-api/collaborative-ads/partner-premium-options/) ·
[Pixel for Collaborative Ads](https://developers.facebook.com/docs/meta-pixel/implementation/pixel-for-collaborative-ads/) ·
[Best practices](https://www.facebook.com/business/help/421342551932381) ·
[Insights reference](https://developers.facebook.com/documentation/ads-commerce/marketing-api/reference/ad-account/insights) ·
[SDK 26.0.2 AdsInsights](https://raw.githubusercontent.com/facebook/facebook-python-business-sdk/26.0.2/facebook_business/adobjects/adsinsights.py) ·
[Insights metric changes](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/) ·
[v27 release](https://developers.facebook.com/blog/post/2026/11/04/introducing-graph-api-v27-and-marketing-api-v27/) ·
[Shopee ID admin fees](https://seller.shopee.co.id/edu/article/3489) ·
[Shopee ID XTRA](https://seller.shopee.co.id/edu/article/3479) ·
[Shopee ID Iklan Affiliate Meta](https://seller.shopee.co.id/edu/article/27976) ·
[Shopee PH ads metrics](https://ads.shopee.ph/learn/faq/58/29) ·
[Shopee Marketing Solutions guides](https://ms.shopee.com/onboarding-guides/) ·
[DJP PPh 22](https://www.pajak.go.id/id/siaran-pers/pemungutan-pph-pasal-22-melalui-marketplace-mulai-dilaksanakan-1-oktober-2026) ·
[DataGlass attribution](https://learn.dataglasslabs.com/id/docs/features/shops/attribution-and-dedup) ·
[Shopilitik XTRA](https://shopilitik.com/biaya-admin-shopee/gratis-ongkir-xtra)
