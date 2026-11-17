# CPAS × Shopee Indonesia: Ads Manager playbook, affiliate configs, CLI limits

Reviewed 2026-11-18, updated with the Ads MCP server findings (§6b). Read this first for any Shopee CPAS or Shopee-affiliate campaign. Then open
[cpas-collaborative-ads.md](cpas-collaborative-ads.md) for result columns, economics and API traps.

Evidence labels: **[Meta]** and **[Shopee ID]** mean an official page was read. **[owner]** is an owner statement.
**[observed]** is an authenticated, read-only API read of one account. **[inference]** is analysis.
**[unverified]** means not read or not reproduced.

## 0. Owner workflow: never build CPAS from a template

A CPAS campaign is not a template. Do not create one from scratch or from a remembered recipe.
Two campaigns in the same account can differ in conversion location, tracking and link handling (§4),
and the official `meta` CLI cannot set most CPAS fields (§6).

Build in this order of preference:

1. **The owner builds the base by hand in Ads Manager (recommended).** The owner sets up one campaign, ad set and ad.
   This is the only way to be sure the hidden UI defaults are correct. The AI then duplicates it and adjusts it to match the other
   reference campaigns (name, budget, creative, link), following §5.
2. **The AI sets it up, the owner checks it in the dashboard.** Create every object `PAUSED`, and get owner approval before any write.
3. **If the dashboard check shows a mismatch, go back to step 1.** The owner builds the manual base, then the AI duplicates it.
   The AI does not keep patching a build that has drifted.

The AI duplicates the owner-built source with the Graph `/copies` edge (§5, step 9). It never rebuilds CPAS fields from a recipe.
Whoever builds the campaign, read the live source (campaign → ad set → ad → creative) first and record its IDs in the account `NOTES.md`.

## 1. Three products share the word "Shopee ads"

| Product | Where it runs | Notes |
|---|---|---|
| **Meta CPAS (Collaborative Ads)** | Meta Ads Manager, or Seller Centre → **Pusat Promosi** → **Iklan Eksternal Shopee** | [Shopee ID] There are two ways to run it. Shopee advises choosing **one** per account. Seller Centre mode is simpler and Shopee-managed. |
| **Iklan Affiliate Meta (AMS)** | Seller Centre → Affiliate Marketing Solution → tab **Iklan Affiliate** | [Shopee ID] The seller funds an Affiliate Meta ad balance, and affiliate content runs as Meta ads on Facebook and Instagram. This is the seller-side programme. |
| **Our affiliate-link campaigns** (for example GACORIN) | Meta Ads Manager, on an ad account in our business; the link is `s.shopee.co.id/...` | [observed] A CPAS-flagged campaign with affiliate short links. [inference] Settlement comes from AMS commission, not from Meta, so treat commission and CPAS-reported value as separate ledgers. |

Do not apply Seller Centre rules to a campaign built in Ads Manager. [Shopee ID] Seller Centre mode needs at least Rp144,000 per day for at least 3 days,
and Shopee recommends 14 calendar days or more. Its banner is 1:1, at least 1080×1080 px; video is 1–15 s; the file is at most 30 MB.

## 2. Official Ads Manager flow [Meta, read in full 2026-11-18]

### Standard flow ("Create a Collaborative Ads campaign in Meta Ads Manager")

1. In Ads Manager, click **+ Create**.
2. Make sure the **Collaborative Ads** toggle is on.
3. In the drop-down, choose the ad account dedicated to your retailer partner.
4. Select the objective: **Awareness**, **Traffic** or **Sales**. A campaign score may appear on the right while you draft.
5. Complete the **A/B test** and **Advantage+ campaign budget** (CBO) sections if needed, then click **Next**.
6. At the ad set, the **Conversion** section depends on the objective:
   - **Sales:** choose a **catalogue segment**, then a conversion location: **Website**, **App**, **Website and app**, or **Website+app+in-store** (only if the retailer has integrated offline signals with Meta). You can change the default performance goal.
   - **Traffic:** choose a source and catalogue segment, then Website, App or Website and app.
   - **Awareness:** choose a catalogue segment, then a performance goal.
7. Complete budget and schedule, audience and placements, then click **Next**.
8. Complete identity, ad setup, ad creative, languages and tracking, then click **Publish**.

[inference] This page names conversion location as the choice that separates reference A (Website and app) from reference B (Website, pixel only). Both appear in §4, and the choice is made at step 6 in the UI. The page does not say which to pick for affiliate links.

### Live-video variant

The live-video page applies to Shopee brand partners in Indonesia, the Philippines, Thailand and Vietnam. It differs from the standard flow:

1. Sales objective.
2. Collaborative Ads toggle on, with the retailer-linked ad account.
3. In **Campaign details**, turn **off** "Promote catalogue sales".
4. In **Budget**, choose **Ad set budget** (ABO).
5. Continue to the **Conversion** section of the ad set.

Prerequisites [Meta]:

- The retailer sends a **collaboration invitation**. You accept it and either create a new ad account or reuse one. Once chosen, that ad account can only be used with that retailer.
- The retailer must share the catalogue with you first. On the brand side the shared catalogue needs **Partial access**.
- [owner] You cannot assign or restrict a CPAS catalogue or product set from our side unless we created the catalogue.

Screens beyond the conversion section (identity, languages, tracking panel names) are described only by section name. Verify the exact labels on screen before quoting them.

Best practices [Meta, read]:

- Build the product set with brand or product-name filters, not IDs. A retailer change can alter an ID-based set.
- Use Advantage+ Audience, and use retargeting through custom audiences.
- Use **one ad account per retailer**, and keep non-collaborative ads out of it.
- Start with maximize conversions, using **7-day click + 1-day view**, and set a bid cap from your CPA goal. Allow about 50 conversions for delivery to stabilise.

## 3. Account facts for this owner's Shopee CPAS accounts

- The API identity is a system-user token (type `SYSTEM_USER`, non-expiring). It holds `ads_management`, `ads_read`, `business_management`, `catalog_management`, `pages_manage_ads` and `read_insights` [observed].
  It reads 13 ad accounts but lists **0** catalogs, datasets and pages through the CLI. [owner] That is expected for partner-shared CPAS assets, so it is **not** evidence of a missing permission.
- The profile label (BM2, "Permatamall") differs from the account's owning business ("Melangkah - 8") [observed].
  The wrapper sets `BUSINESS_ID` to the profile ID, so `catalog list` and `dataset list` fail with `owned_product_catalogs` and `adspixels`. If you run those commands, unset `BUSINESS_ID`.
- A catalog or product-set `GET` returns `100/33` for this identity, even though active campaigns reference them [observed]. A campaign that references an ID does not prove the API identity can read, manage or copy it.

## 4. Two reference configurations (account COMPLETED - FERI - 11, observed 2026-11-18 WIB)

### A. Original GACORIN (PAUSED): omnichannel, catalogue-dynamic creative

- **Campaign:** Sales, `is_pca_unified=true`, CBO **Rp50,000/day**, Lowest Cost, `promoted_object` at catalog level.
- **Ad set:** `OFFSITE_CONVERSIONS` on PURCHASE, with an **`omnichannel_object` (Shopee app + pixel)** and a `product_set_id`.
  Indonesia, ages 18–65, Advantage+ audience, Facebook Feed and Reels, mobile and desktop, attribution 7-day click + 1-day view.
- **Ad:** one ad, using a catalogue-template creative (`template_data`, SHARE, carousel and collection format automation).
  A manual image creative with Android and iOS `object_store_urls` also exists in the account, but no ad uses it.
- **Results:** purchases appear in **`catalog_segment_actions`** (`app_custom_event.fb_mobile_purchase` and `omni_purchase`), not in ordinary `actions`.
  About 98% were `1d_view` over the observed window. Those figures are Meta-attributed, not commission.
- **Copy attempt:** the API copy failed with `100/1885015`. The cause is **unknown**. One untested hypothesis is that the app half of `omnichannel_object` cannot be resolved by the API identity.

### B. GACORIN - V1 - Copy 2 (ACTIVE): pixel-only, manual single-video affiliate links

- **Campaign:** Sales, `is_pca_unified=true`, CBO **Rp20,000/day**, Lowest Cost. Meta reports source campaign `120253878062260216`. Who created it is unknown.
- **Ad set:** PURCHASE with a **pixel and `product_set_id`, and no `omnichannel_object`**. Audience, placements (Facebook Feed and Reels) and attribution match A.
  `regional_regulated_categories` is `["VOLUNTARY_VERIFICATION"]`.
- **Structure:** 1 campaign, 1 ad set, **2 manual single-video ads**. Each ad has its own `s.shopee.co.id/...` affiliate link, **Shop Now**, `applink_treatment=web_only` and no `omnichannel_link_spec`.
- [owner] On a phone, the affiliate link opens the Shopee app from these placements.
- [unverified] Whether a web-pixel PURCHASE is received when the sale completes inside the app. A web pixel does not fire in the app, so after at least 24 hours compare `catalog_segment_actions` with the pixel purchase before you judge the campaign.
- `web_only` fits only a web ad set. [Meta, per the cpas reference §3] v26 forbids `web_only` for Website+App. If an ad set has `omnichannel_object`, use `deeplink_with_web_fallback` and `omnichannel_link_spec`. Never mix the two.
- Both ads reuse the same Rp1 price-led copy. Promo validity is not verified, so do not carry price or discount claims forward.

**Choosing between A and B:** match the live reference you are copying, and prefer the one that actually records purchases. Pick Web or Web+App by where purchases are recorded, not by whether the link opens the app.

## 5. Checklist before a new Shopee CPAS or affiliate campaign

1. Name the reference campaign to mirror, then re-read it live: status, budget, ad set `promoted_object` and creative link fields. Record its IDs in the account `NOTES.md`.
2. Decide which ledger you are judging: CPAS-reported value, affiliate **settled** commission, or ad spend. Never mix them.
3. Build the product set by brand or product name, and check that it still contains products.
4. Use one ad account per retailer. Do not mix collaborative and ordinary ads.
5. Ask the owner for the budget. The Rp50,000 CBO draft and the Rp20,000 live campaign differ, so never assume one. Keep status `PAUSED` until the owner approves activation.
6. For the creative, a 9:16 single video is acceptable. Confirm the short link resolves to the intended product (it redirects with affiliate tracking parameters). Do not invent a price or discount.
7. Test on a real phone: tap the preview, confirm the app opens, and confirm it shows the right product. Desktop or headless proof is not enough.
8. After at least 24 hours, read `catalog_segment_actions` split by `7d_click` and `1d_view`, plus the pixel purchase and `InApp_VC`.
9. For any API write, copy the owner-built source with `POST /<id>/copies` (`deep_copy=false`, and pass `start_time` inside the ad-set copy request). Journal each mutation. If a write fails with an unexplained error, do not retry it.

## 6. What the official CLI can and cannot do [Meta, read 2026-11-18; installed `meta-ads` 1.3.1]

- The docs list `create`, `get`, `update` and `delete` for campaigns, ad sets, ads and creatives. They also list insights, catalog, product-set, dataset, guidance and study commands.
- Official auth is a **system-user token** with the scopes in §3. The CLI reads `ACCESS_TOKEN`, `AD_ACCOUNT_ID` and an optional `BUSINESS_ID`. Install with Homebrew (`facebook/fb`) or `pip` (Python 3.12 or later).
- Official `campaign create` has `--execution-options validate_only`, a server-side dry run. Our wrapper uses its own dry run instead.
- The CLI has **no** `is_pca_unified`, `omnichannel_object` helper, `template_url_spec`, or campaign and ad-set `/copies`. Our wrapper uses the installed Python SDK for those.
  That is outside the documented CLI surface, so read back every such call.
- Our setup matches the docs on version, token type, scopes and the `PAUSED` default. It differs on `BUSINESS_ID` (§3). Installing with pipx is acceptable.
- Local `meta ads adset create` accepts `--promoted-object` as raw JSON, but plain creation does not reproduce the CPAS hidden defaults (cpas reference, trap 7).

## 6b. Meta Ads MCP server (`https://mcp.facebook.com/ads`) [Meta docs read + authenticated read-only probe, 2026-11-18]

**Verdict: use it as the precise reader and previewer, and as the duplicator on a source the owner built. Do not use it to build CPAS from scratch.**

What was verified:

- **Access works.** Our existing system-user token was accepted (HTTP 200, 106 tools). [inference] Meta documents that only Employee-role system users can use the MCP server, so this token is Employee-role. Minimum scopes are `ads_mcp_management` plus `ads_read` or `ads_management`, and our token has them. Auth options are OAuth, a user token, or a system-user token.
- **It reads the whole account, archived included.** The official `meta ads campaign list` hid archived campaigns by default and showed 1 campaign; MCP `ads_get_ad_entities` with an explicit status filter showed 5. [inference] That gap is a default of that CLI command, not a limit of the CLI: `dotads-meta sync` snapshots already include ARCHIVED, so reading does not need MCP. As of this read: `GACORIN - V1 - Copy 2` is ACTIVE; `GACORIN` (reference A), `GACORIN - V1`, `GACORIN - V1 - Copy` and `GACORIN - V1 - Copy 3` are ARCHIVED. [inference] Reference A is therefore no longer a live copy source. We did not archive anything.
- **It has a native duplicate tool, `ads_duplicate_entity`.** It copies a campaign, ad set or ad, and can place an ad set or ad under a new parent with `destination_parent_id`. It creates a PAUSED copy. A live copy cannot take an exact custom name, so rename it afterwards with `ads_update_entity`. Meta says not to repeat a duplication after copies were returned.
- **Preview.** `ads_get_ad_preview` renders an ad or creative per placement. [unverified] Whether it shows the Shopee app hand-off. A phone test is still required (§5, step 7).
- **Guard rails.** Write tools create objects PAUSED, and activation is a separate call (`ads_activate_entity`) that needs user confirmation. Meta also offers **MCP rules** (for example deny a budget increase above a limit). They are limited availability and need full control of the business portfolio.

What it does not give us:

- No tool or schema field is named for Collaborative Ads, `is_pca_unified`, `omnichannel_object`, catalog segment, or `omnichannel_link_spec`. The only match is an A/B test tool that mentions a catalog segment. [inference] Creating CPAS through `ads_create_campaign`, `ads_create_ad_set` or `ads_create_creative` would hit the same hidden-default problem as plain API creation (cpas reference, trap 7).
- Whether `ads_duplicate_entity` preserves CPAS fields such as `omnichannel_object` is [unverified]. The earlier API `/copies` of reference A failed with `100/1885015`. Test duplication on a small owner-built source first, and compare the copy with the source field by field before trusting it.

Data handling: MCP tool calls carry `advertiser_request`, `advertiser_job` and `client_conversation_id` fields that are sent to Meta. Leave `advertiser_request` empty or generic, and never put customer data, secrets or personal details in it.

### Recommendation and the `dotads-meta-mcp` helper

**The CLI (`dotads-meta`) stays the primary path.** MCP is a limited extra, and it is not registered in Pi permanently, because that would add a write path to the ad account.

| Need | Use |
|---|---|
| Read campaigns, ad sets, ads, insights, audits | `dotads-meta` (CLI/SDK, snapshots on disk) |
| Preview an ad per placement | MCP `ads_get_ad_preview` (the CLI has none) |
| Duplicate an owner-built source | `dotads-meta-mcp duplicate`, only after one tested copy is compared with its source |
| Build CPAS from scratch | Neither: no CPAS field exists in the CLI or in MCP |

`bin/dotads-meta-mcp` (tested by `bin/dotads-meta-mcp-test`, offline with a mock server) wraps the hosted server:

- `tools`, `accounts`, `entities` (asks for every status including ARCHIVED), and `tool` (runs read tools only; refuses create, update, activate, delete and duplicate).
- `duplicate` is a **dry run by default**. `--apply` also needs `--journal <file>` (mode 0600): a second apply for the same source and destination is refused, so a copy is never repeated. It pins `copy_count` to 1, creates the copy PAUSED, and never activates, renames or deletes.
- The token is read through `secrets-env` and sent only as a header; `--bm` is required. `advertiser_request` is never sent. `DOTADS_MCP_URL` accepts loopback only, for tests.
- Run it from the dotfiles checkout or after `ai-memory-link` installs `bin/dotads-meta-mcp` on `PATH`.

Use order: (1) the owner builds the base by hand (§0); (2) the AI reads the live account (`dotads-meta sync`, or `dotads-meta-mcp entities` when archived status matters); (3) after owner approval, `dotads-meta-mcp duplicate --apply --journal <file>`, then read the copy back and compare it with the source field by field; (4) rename the copy with the owner's approval, then the owner checks it in Ads Manager before any activation.

## 7. Sources

- [Meta] Create a Collaborative Ads campaign using live video; Best Practices for Collaborative Ads; Ads CLI overview, get started, configuration and command reference (`developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-cli/`).
- [Shopee ID] Cara Mendaftar Iklan Meta CPAS (`seller.shopee.co.id/edu/article/27999`); Iklan Facebook (`.../12270`); Iklan Affiliate Facebook di AMS (`.../27976`, read only through a search excerpt because the page is JavaScript-rendered); Syarat dan Ketentuan AMS §8, Meta Affiliate Ads (`help.shopee.co.id/portal/4/article/73983`).
- [observed] Account-local `campaigns/gacorin-active-inspection.json` and `campaigns/conv-signals-gacorin-old.json`.
