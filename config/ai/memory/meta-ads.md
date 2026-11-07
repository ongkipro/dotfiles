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


## Lesson: Shopee CPAS purchase columns, `7d_click` vs `1d_view`, and the `1-1-1` direct-to-app default

### Symptom
On Shopee Collaborative Ads (CPAS) accounts the ordinary `actions` columns looked empty while a platform-claimed `app_site_visit` looked healthy; blended purchase numbers were dominated by `1d_view` credit.

### Root cause
Observation, 2026-11-07, two Indonesia Shopee CPAS accounts under one owner (one account supplied nearly all orders): almost all purchases were reported in `catalog_segment_actions` / `catalog_segment_value`, most of the retargeting purchases were `1d_view`, and Instagram in-app-browser clicks logged `app_site_visit` without native app arrival. These are Meta claims, not settlement and not causal findings.

### Rule (scope and numbers: [cpas-collaborative-ads.md](../../../skills/local/meta-ads-cli/references/cpas-collaborative-ads.md) §7)
Query Shopee CPAS with `--metric-profile cpas_v1` and read `catalog_segment_actions:omni_purchase` with `7d_click` beside the total; verify native app arrival with `app_custom_event.fb_mobile_content_view / link_click`, never `app_site_visit` alone; treat the `1-1-1` structure, placement exclusions and gates in §7 as defaults to test, not laws.

### Fix
`dotads-meta validate` warns on CPAS `1-1-1` deviations; the commerce insight (`commerce-insight/2`) splits the `catalog_segment_*` funnel by channel; the `cpas_v1` profile adds the CPAS inventory fields; the skill documents the rules and their limits.

### Regression check
dotads-meta-test && node --test bin/_dotads-workspace-test.mjs && ai-policy-lint

> Promoted from a reviewed local candidate on 2026-11-06; scope and wording reviewed 2026-11-07 (TASK-197). Audit date: 2026-11-07.


---


## Lesson: Meta Collaborative Ads (Shopee CPAS) requires is_pca_unified=true and promoted_object at POST /campaigns creation time

### Symptom
Ads Manager UI hides Conversion location: Website and app (Shopee ID Website Pixel + Shopee ID App) inside the Ad Set, or Ad creation fails with Error 100 'You have to associate your advertiser account with this app first for tracking'

### Root cause
meta-ads CLI creates the Campaign without is_pca_unified=true and promoted_object at POST /act_<id>/campaigns creation time. Meta locks is_pca_unified=false permanently once published (Error 100 / Subcode 3858845), forcing Legacy Catalog UI.

### Durable invariant
Every Collaborative Ads (CPAS) campaign must be created at POST /act_<id>/campaigns time with is_pca_unified=true, smart_promotion_type='GUIDED_CREATION', and promoted_object={'product_catalog_id': '<catalog_id>', 'smart_pse_enabled': False}, followed by AdSet with ad_set_goal={'type': 0}, promoted_object.omnichannel_object (app + pixel), and attribution_spec 7d_click + 1d_view + 1d_engaged_video_view.

### Fix
Updated dotads-meta deploy to create CPAS campaigns directly via facebook-business SDK with is_pca_unified=true and promoted_object at creation time, and create AdSets with ad_set_goal={'type': 0}.

### Regression check
dotads-meta-test && Campaign(id).api_get(fields=['is_pca_unified','promoted_object']) returns is_pca_unified=true

> Promoted from a reviewed local candidate on 2026-11-06.


---


## Lesson: CPAS Carousel DPA (`carousel_images_multi_items`) requires SDK creative creation to preserve `template_url_spec` and `format_transformation_spec`

### Symptom
On a Shopee CPAS `1-1-1` Carousel campaign (`carousel_images_multi_items`), Ads Manager showed Collection (`FORMAT_AUTOMATION`: `['CAROUSEL', 'COLLECTION']`) active with `format_transformation_spec: [{"data_source": [], "format": "da_collection"}]` and `template_url_spec: null`; `facebook_reels` clicks opened a Meta Instant Experience grid instead of deep-linking directly into the Shopee App PDP (`0` `onsite_app_add_to_cart` on Reels vs `6` on Feed).

### Root cause
Upstream `meta` CLI 1.3.1 (`meta ads creative create`) lacks `--template-url-spec` and `--format-transformation-spec`, dropping `template_url_spec` and leaving `format_transformation_spec` at `da_collection` only. In addition, if `.meta-state.json` retains old `creatives` entries when a campaign is recreated under the same creative key, `dotads-meta deploy` skips creative creation and reuses the stale creative ID.

### Durable invariant
1. CPAS / catalog creatives with `template_url_spec`, `format_transformation_spec`, or `product_set_id` + `object_story_spec` must be created through the Python `facebook_business` SDK (`AdAccount.create_ad_creative`) with `template_url_spec: {"config": {"app_id": "957549474255294"}}`, `format_transformation_spec: [{"data_source": ["catalog"], "format": "CAROUSEL"}, {"data_source": ["catalog"], "format": "CATALOG_SINGLE_MEDIA"}]`, and `contextual_multi_ads: {"enroll_status": "OPT_IN"}`.
2. **DO / DON'T**: Use Pure Carousel (`CAROUSEL` + `CATALOG_SINGLE_MEDIA`) for 1-click direct-to-Shopee-PDP catalog cards; only use Collection (`COLLECTION_VIDEO`) in its own isolated `1-1-1` campaign when paired with a dedicated 9:16 hero demo video (`video_data`). Never recreate the Campaign/Ad Set just to fix a creative defect — hot-swap `Ad(ad_id).api_update(params={"creative": {"creative_id": new_cr_id}})` in-place.

### Fix
Updated `dotads-meta validate` to validate `format_transformation_spec` and `contextual_multi_ads` and warn when a `carousel_images_multi_items` CPAS creative only specifies `da_collection` / `FORMAT_AUTOMATION`, and updated `dotads-meta deploy` to route catalog/deep-link creative creation through `AdAccount.create_ad_creative` in the Python SDK.

### Regression check
dotads-meta-test && node --test bin/_dotads-workspace-test.mjs && ai-policy-lint

> Promoted from a reviewed local candidate on 2026-11-07.
