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
- [CPAS / Shopee Collaborative Ads](../../../skills/local/meta-ads-cli/references/cpas-collaborative-ads.md): marketplace catalog segment, retailer-owned signal, `catalog_segment_actions` & `catalog_segment_value` purchase conversion columns (and `7d_click` vs `1d_view` attribution separation), forensic In-App SDK (`app_custom_event.fb_mobile_*`) vs Web Pixel (`offsite_conversion.fb_pixel_*`) vs `app_site_visit` verification, empirical Indonesia Shopee `1-1-1` Direct-to-App architecture (Mobile Only, `FB Feed + FB Reels + Threads Stream`, 100% exclusion of Instagram IAB trap and Audience Network), three non-additive ledgers and dated Shopee Indonesia economics; read before any campaign that sends traffic to Shopee.
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


## Lesson: Shopee CPAS Purchase Conversion Columns (`catalog_segment_*`), `7d_click` vs `1d_view`, and `1-1-1` Direct-to-App Architecture

### Symptom
Shopee Collaborative Ads (CPAS) accounts appeared to have zero or near-zero purchases in ordinary `actions`/`action_values` columns, while high platform-claimed `app_site_visit` on Instagram Carousel and high CTR on mixed Collection Video masked 86% to 99.99% drop-off before opening the native Shopee App SDK.

### Root cause
1) On Shopee CPAS accounts, 99.94%+ of real marketplace purchase conversions are reported in `catalog_segment_actions` (`omni_purchase`, `app_custom_event.fb_mobile_purchase`) and `catalog_segment_value` (`omni_purchase`), not in ordinary `actions`, and 80%-86% of Retargeting (`RMK`) segment purchases are `1d_view` impression credit rather than `7d_click` click-through purchases. 2) Instagram WebView intercepts Shopee universal links into the Instagram In-App Browser (IAB), logging a false-positive `app_site_visit` while true Shopee App SDK arrival (`app_custom_event.fb_mobile_content_view`) collapses to 0.83% on IG Feed Carousel and 0.52% on IG Stories, making Cold Prospecting (`NV`) `CPA_7d_click` 2.2x-5.3x more expensive than Facebook Reels/Feed. 3) Audience Network accidental clicks produced 0.012% `InApp_VC` (99.99% bounce) and 96.9% `1d_view` attribution pollution.

### Durable invariant
Always query Shopee CPAS with `--metric-profile cpas_v1` and `action_attribution_windows=['1d_click','7d_click','1d_view','default']`, evaluating `catalog_segment_actions:omni_purchase` (`7d_click` CPA/ROAS alongside Total) and `app_custom_event.fb_mobile_content_view / link_click` (never ordinary `actions` or `app_site_visit` alone). Enforce dynamic `1-1-1` format-isolated campaigns (`CAROUSEL_DPA` / `SINGLE_IMAGE_DPA` or isolated `COLLECTION_VIDEO`, never static `COLLECTION_IMAGE`) on `device_platforms=['mobile']`, `publisher_platforms=['facebook','threads']`, `facebook_positions=['feed','facebook_reels']`, `threads_positions=['threads_stream']` with 0% Instagram and 0% Audience Network, `applink_treatment='deeplink_with_web_fallback'`, and `template_url_spec.config.app_id='957549474255294'`.

### Fix
Added CPAS `1-1-1` Direct-to-App guardrails to `dotads-meta validate`, enriched `_dotads-workspace.mjs` `commerceInsight` to extract `catalog_segment_actions` and `catalog_segment_value` funnel and channel splits, and documented dynamic multi-niche CPAS rules in `meta-ads-cli` (`cpas-collaborative-ads.md` and `rules-and-tutorial.md`).

### Regression check
dotads-meta-test && node --test bin/_dotads-workspace-test.mjs && ai-policy-lint

> Promoted from a reviewed local candidate on 2026-11-06.
