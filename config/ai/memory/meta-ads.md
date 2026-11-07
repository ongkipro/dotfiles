# Meta Ads — shared knowledge and reviewed learning

<!-- locked:dotads-name -->
Naming (owner rule, locked): "dotads" always means the dotfiles ads CLI tool family, one command per ad platform named `dotads-<platform>`: `dotads-meta` is the one built now; `dotads-google`, `dotads-tiktok`, `dotads-pinterest` and others come later. There is no "dotads" app repository.
<!-- /locked:dotads-name -->

The old commerce-engine repo that used the name was deleted on 2026-11-01 and
backed up as `/data/backups/platform-iklan-commerce-2026-11-01/`
(`platform-iklan-commerce`).

Dotfiles owns the reusable Meta Ads operating knowledge. Start with
[meta-ads-cli](../../../skills/local/meta-ads-cli/SKILL.md), then load only the
reference needed for the task:

- [Algorithm and source record](../../../skills/local/meta-ads-cli/references/api-and-evidence.md): documented delivery components, dated sources and API limits; recheck changing claims against Meta.
- [Campaign decisions and recipes](../../../skills/local/meta-ads-cli/references/rules-and-tutorial.md): objective, structure, audience, budget, creative and controlled experiments.
- [Conversion and ROAS interpretation](../../../skills/local/meta-ads-cli/references/roas-cpr-profit-intelligence.md): measurement scope, order basis, contribution economics and uncertainty.
- [CPAS / Shopee Collaborative Ads](../../../skills/local/meta-ads-cli/references/cpas-collaborative-ads.md): marketplace catalog segment, `catalog_segment_*` purchase columns with `7d_click` beside `1d_view`, three non-additive ledgers, and the observed `1-1-1` direct-to-app defaults (labelled as one dated audit); read before any campaign that sends traffic to Shopee.
- [Delivery, learning and 2026 measurement changes](../../../skills/local/meta-ads-cli/references/algorithm-and-learning.md): Andromeda/GenRecs/GEM facts, learning phase, evidence-to-hypothesis checks.
- [Indonesia baseline](../../../skills/local/meta-ads-cli/references/indonesia-market.md): general province/city context for an explicitly selected ID market, not product demand or a spending prescription. Indonesian customer copy applies to that market only.
- [Terminal contract](../../../skills/local/meta-ads-cli/references/terminal-control.md) and [runtime guide](../../../skills/local/meta-ads-cli/references/account-workspace-runtime.md): operator boundaries, private account records and executable capabilities. The [human guide](../../../skills/local/meta-ads-cli/GUIDE.id.md) is Indonesian.

Private account snapshots, reports, media and campaign observations belong under
`~/Documents/dotads-meta-report/act_<id>--<slug>/`, with brand learning in
`memory/ads-memory.json` and `memory/MEMORY.md`. Dotfiles synchronization does not
transfer these private files or credentials. Inspect the selected account's
records before planning; never borrow another account's results implicitly.

Record each experiment's hypothesis, market, dates, objective, attribution,
budget, creative/landing-page changes, evidence and limitations in that private
workspace. Separate observations from hypotheses and repeatable findings.
Reconcile conversions/value with backend outcomes and allow conversion lag;
high attributed ROAS alone does not establish profit or causal lift.

After review, improve the existing skill with a de-identified, reusable method
and its supporting evidence. Engineering lessons follow `continuous-learning`;
campaign findings need campaign evidence and are not automatically promoted by
an engineering PASS. Keep contradictory results and retest conditions. No
account-specific winner, fixed ad count or demographic default is universal.

Repository documentation and executable checks own current truth. This card is
an on-demand navigation reference, not account state or an automatic learner.


---


## Operating rules (owner rules; moved verbatim from preferences.md on 2026-11-07 to keep that file inside the router budget)

- **Anti-Boncos & Profit-First Scaling (owner rule 2026-11-05)**:
  - **Lowest Cost Ceiling (Rp 300K–400K)**: Never scale Lowest Cost campaigns (`LOWEST_COST_WITHOUT_CAP`) to Rp 1 Juta+/day. Pacing rush causes Meta to bid into unqualified auctions and spikes CPR. Keep Lowest Cost capped at **Rp 300.000 – Rp 400.000/hari** for tight, profitable delivery.
  - **Scale via Bid Cap & Min ROAS**: Budgets of Rp 1 Jt – Rp 2 Jt+ belong strictly to **Bid Cap** (`LOWEST_COST_WITH_BID_CAP`) or **Target ROAS** (`LOWEST_COST_WITH_MIN_ROAS`). Hard cost constraints (for the owner's lead/COD products, for example a bid cap of Rp 34K–46.5K or a min ROAS of 4.0x; not CPAS targets) act as automated algorithmic brakes that prevent boncos while capturing volume.
  - **Hard Stop-Loss Rule (Content Ad Level — Owner Rule 2026-11-06; decision rule, applying a pause follows *Leak response* below)**:
    - Konten iklan (ad-level) di semua produk lead/COD kita non-CPAS (daftar produk per akun ada di NOTES.md akun; kampanye Shopee CPAS memakai gate di skill `cpas-collaborative-ads.md` §7.5): Batas toleransi testing adalah **Rp 50.000 per konten ad**.
    - Jika satu konten ad sudah menghabiskan budget **≥ Rp 50.000 dengan 0 lead / 0 purchase** ➔ **rekomendasikan PAUSE kontennya**.
    - Jika spend masih **< Rp 50.000**, jangan dimatikan terlalu dini; berikan ruang bagi algoritma untuk menjemput lead hingga menyentuh batas 50K.
    - Jika konten menghasilkan lead/purchase sebelum atau di sekitar 50K (konten pemenang dicatat di NOTES.md akun), biarkan tetap ON.
    - Usulkan prune adset duplikat di CBO yang menyedot budget tanpa hasil (konsolidasi ke adset single broad pemenang); ini testing/isolasi, bukan aturan struktur untuk CPAS.
  - **Comment hygiene (decision rule; applying it is a live mutation under *Leak response*)**: negative comment or complaint → propose hide (`is_hidden: true`); positive inquiry → draft the warm reply pointing to the product landing page with COD and promo wording. The owner approves before anything is posted.
  - **Leak response (owner goal: zero boncos, maximum profit)**: when a leak is detected (inflated budget, bleeding ad set, choked spend cap, negative comment), read fresh data, name the exact entity and the rule it breaks, and propose the fix with its expected effect. Changing a live ad account follows the live-mutation clause in the `meta-ads-cli` skill (`SKILL.md` §1: owner approval per action, or the owner's own dated standing approval in that account's `NOTES.md`); this line grants none.
  - **Shopee Collaborative Ads (CPAS `1-1-1` Direct-to-App, owner rule 2026-11-07; the full rules live in the skill, not here)**: read [cpas-collaborative-ads.md](../../../skills/local/meta-ads-cli/references/cpas-collaborative-ads.md) §7 before planning, reading or judging any campaign that sends traffic to Shopee. Defaults for every niche and price tier (skill §7: defaults to test until the account's own read contradicts them, not law): read purchases from `catalog_segment_actions` / `catalog_segment_value` (ordinary `actions` are usually empty) and always split `7d_click` from `1d_view`; one campaign, one ad set, one ad; exclude Instagram and Audience Network; deep link with `applink_treatment: "deeplink_with_web_fallback"`; verify true app arrival with `InApp_VC` instead of `app_site_visit`. Budgets, stop-loss gates and product sets adapt to each niche's unit economics (§7.5).

---

## Lesson: Shopee CPAS purchase columns, `7d_click` vs `1d_view`, Pure Carousel vs Collection (`da_collection`), and in-place creative hot-swap

- **Symptom & root cause:** On Shopee CPAS accounts, ordinary `actions` looked empty while orders lived in `catalog_segment_actions` / `catalog_segment_value` (`1d_view` heavy), Instagram WebView logged `app_site_visit` without native app arrival, Ads Manager hid `Website and app` (Error 100 / Subcode 3858845) without `is_pca_unified=true` + `promoted_object`, and `facebook_reels` opened `da_collection` grids when `template_url_spec` or `asset_feed_spec` was missing ([cpas-collaborative-ads.md](../../../skills/local/meta-ads-cli/references/cpas-collaborative-ads.md) §7).
- **Rule & fix:** Query CPAS with `--metric-profile cpas_v1`, read `catalog_segment_actions:omni_purchase` (`7d_click` beside total), and verify native app arrival via `app_custom_event.fb_mobile_content_view / link_click`. `dotads-meta deploy` creates CPAS campaigns via the Python SDK with `is_pca_unified=true`, `smart_promotion_type='GUIDED_CREATION'`, and `promoted_object`, AdSets with `ad_set_goal={'type': 0}` + `omnichannel_object`, and catalog creatives via `AdAccount.create_ad_creative` with `template_url_spec.config.app_id`, `asset_feed_spec: {"ad_formats": ["CAROUSEL"], "optimization_type": "FORMAT_AUTOMATION"}`, `format_transformation_spec` (`carousel` + `catalog_single_media` without `da_collection`), and `contextual_multi_ads: {"enroll_status": "OPT_IN"}`. **DO:** Use Pure Carousel (`dotads: Carousel | ...`) for 1-click Shopee PDP cards; isolate Collection (`dotads: Collection | ...`, `COLLECTION_VIDEO`) in its own `1-1-1` campaign with a dedicated 9:16 hero video + Instant Experience Canvas. **DON'T:** Mix Carousel + auto `da_collection`, or recreate Campaign/Ad Set just to fix a creative — hot-swap `Ad(ad_id).api_update(params={"creative": {"creative_id": new_cr_id}})` in-place.
- **Check:** `dotads-meta-test && node --test bin/_dotads-workspace-test.mjs && ai-policy-lint`

---

## Lesson: Adaptive Website Conversion (`OUTCOME_SALES`) Liquidity, Multi-Horizon Timing (`>= 24h`), Scaling & Signal Coupling

- **Principle (priors to calibrate per business model and unit economics, never a rigid lock):**
  1. **CLI Campaign Prefix (`dotads: `):** Every campaign created via `dotads-meta` (`deploy` or `run -- ads campaign create`) carries the `dotads: <campaign_name>` label (`validate` warns if omitted; `deploy`/`run` auto-prefixes `dotads: `).
  2. **Auction Liquidity vs. Hard Controls:** Over-filtering (`advantage_audience: 0`, narrow age/gender locks, unnecessary placement exclusions, or click-only attribution) shrinks Andromeda retrieval pools and raises clearing CPM/CPC. Use **0 interests + `advantage_audience: 1` + Broad + Advantage+ Placements + `OFFSITE_CONVERSIONS` + `7d_click + 1d_view (+ 1d_ev)`** as the starting baseline; apply hard `Audience Controls` only for verified legal/age floors, geographic serviceability/margin boundaries, >15% measured demographic leakage, or technical app-routing constraints.
  3. **Multi-Horizon Audit Timing (`>= 24h` Diurnal Floor):** Intraday pacing exploration and conversion lag make `<24h` performance pauses unreliable. Use `0–6h` for technical sanity checks only; require `>= 24h` (`>= 1` full diurnal cycle) + declared test spend (`>= 1.0x Target_CPA` or owner stop-loss floor) before proposing a zero-intent stop-loss (`0 Conversions` and `ATC <= 1`); hold ad sets with active mid-funnel intent (`ATC` / `IC`) to `48–72h`; and judge scaling or retirement on `3–7d` (`last_7d`) cohorts.
  4. **Coupled Scaling & Funnel Velocity:** Scale Up vertically in `+15%–25%` steps every `48–72h` (transitioning from `LOWEST_COST_WITHOUT_CAP` to `COST_CAP` / `BID_CAP` / `MIN_ROAS` at higher budgets), and Scale Out horizontally via orthogonal creative angles (`3–5` concepts per ad set; avoid crowding `>6` ads on micro-budgets) and low-friction checkout flows (`LPV -> ATC -> IC -> Purchase`) paired with high-EMQ Pixel + CAPI (`event_id` 48h dedup). See [algorithm-and-learning.md](../../../skills/local/meta-ads-cli/references/algorithm-and-learning.md) §6–§7 and [PIXEL_2026_CHANGES.md](../../../skills/local/meta-ads-signal-engine/references/PIXEL_2026_CHANGES.md).
- **Check:** `dotads-meta-test && node --test bin/_dotads-workspace-test.mjs && ai-policy-lint`
