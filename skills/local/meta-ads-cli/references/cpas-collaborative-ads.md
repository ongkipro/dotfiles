# CPAS (Meta Collaborative Ads) with Shopee

Reviewed **2026-11-05** from a five-lane parallel study (Meta API/SDK, Shopee
Indonesia, attribution/reconciliation, operating practice, dotads-meta design).
Full evidence, quotes and conflicts live privately in
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
- Ordinary `actions`/`purchase_roas` behavior on CPAS accounts is
  **untested**; the rule is to request and read CPAS coverage independently,
  not to assume ordinary fields are always zero.
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
  link/offer friction → metric scope → overlap and settled contribution →
  marginal economics. High Meta ROAS with flat shop sales is an alignment
  question before a verdict.

## 7. Learning rules for CPAS

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

## 8. dotads-meta plan (not implemented)

[proposal] Evidence quality before automation breadth:

1. **Phase 1 — read safely.** Opt-in `metric_profile` (`legacy` default,
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
