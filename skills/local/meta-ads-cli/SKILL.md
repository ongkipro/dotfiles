---
name: meta-ads-cli
description: >-
  Automate Meta (Facebook & Instagram) Ads campaign, ad set, creative (image/video/DCO), insights, and catalog
  operations from the terminal via Meta's official meta-ads CLI and dotads-meta. Not for Pixel/CAPI tracking
  (meta-ads-signal-engine) or Ad Library competitor research (meta-ads-scout). Use when setting up Meta Ads
  workspaces, uploading local image/video creatives, validating or deploying CBO/ABO campaigns, checking ad
  account diagnostics, or running Meta Marketing API CLI workflows via Business Manager System Users.
  Triggers: "meta ads cli", "facebook ads cli", "dotads-meta", "setup meta ads dari laptop", "upload video meta ads",
  "pasang iklan fb", "deploy meta ads", "meta ads campaign create", "meta ads creative create".
---

# Meta Ads CLI & Per-Project Operations (`meta-ads-cli`)

Operate Meta (Facebook & Instagram) Ads from the terminal using Meta's official `meta-ads` CLI (`meta` binary) paired with the dotfiles orchestration helper `dotads-meta`.

## Architecture & Boundary

1. **Official Engine (`meta` CLI, `pipx install meta-ads==1.2.0`):** Handles Graph API / Marketing API calls, chunked multipart uploads for local images/videos, Dynamic Creative Optimization (DCO), Flexible Ad Format (`asset_feed_spec`), insights, and account guidance.
2. **Dotfiles Orchestrator (`dotads-meta`):** Bridges `secrets-env` (`META_ACCESS_TOKEN` -> `ACCESS_TOKEN` in-memory without plaintext `.env` files), validates campaign manifests offline against Meta ODAX and 2025–2026 Marketing API v22–v26 rules, runs dry-run plans by default, and executes idempotent L3->L1 creation with SHA-256 media caching in `.meta-state.json`.
3. **Per-Project Workspace (outside `~/dotfiles`):** Each brand or store keeps its own `brand.json`, `campaigns/*.json`, `media/`, and git-ignored `.meta-state.json` (e.g. `~/Documents/work/ads/<brand>/` or `<repo>/ads/`). Never commit client videos, images, or campaign state into `~/dotfiles`.

`dotads-meta` is the dotfiles helper name; the underlying `meta-ads` package and `meta` binary keep their upstream names. Existing `brand.json`, campaign manifests, `.meta-state.json`, and `META_ADS_BIN` / `SECRETS_ENV_BIN` overrides need no migration.

## Mandatory Approval & Safety Gates

- **Dry-Run First:** Always run `dotads-meta validate <campaign.json>` and `dotads-meta deploy <campaign.json>` (dry-run) and present the budget summary, Advantage+ alignment state, and step plan to the user before running `--apply`.
- **Live Mutation Gate:** `dotads-meta deploy <campaign.json> --apply` and raw `meta ads <resource> create|update|delete` mutate a live Meta Ad Account. Stop and obtain explicit user approval before executing `--apply` or any write subcommand.
- **Paused-by-Default:** `dotads-meta deploy --apply` forces `--status PAUSED` on every campaign, ad set, creative, and ad unless `--activate` is explicitly passed. Never pass `--activate` unless the user explicitly asks to launch active spend immediately.
- **Secret Hygiene:** Never read or print `~/.config/ai-local/secrets.env` directly, and never pass `ACCESS_TOKEN` as a command-line argument where `ps` or shell history can expose it. Use `dotads-meta` (which injects `ACCESS_TOKEN` via child process `env` from `secrets-env get`).

---

## Meta 2025–2026 AI Delivery Architecture (Andromeda, GEM & Lattice)

Meta processes ad delivery through a 3-stage AI pipeline rather than a single monolithic algorithm. Structure campaigns and creatives to align with each stage:

| Stage | Engine | Core Mechanism | Structural Rule in `dotads-meta` |
| --- | --- | --- | --- |
| **1. Retrieval** | **Andromeda** (MTIA / Grace Hopper hierarchical neural index) | Scans tens of millions of ads and narrows them to a few thousand candidates by matching multimodal creative embeddings (vision, audio, OCR, copy) directly to user intent. | **Creative IS the Primary Targeting Signal.** Visually near-identical ads receive the same internal Entity ID and suffer **Entity Collapse** (self-cannibalization at retrieval). Feed genuinely distinct creative angles, hooks, personas, and aspect ratios (`9:16` Reels, `4:5` Feed, `1:1` Carousel/Catalog). |
| **2. Scoring** | **GEM** (Generative Ads Recommendation Model) & Sequence Learning | Foundation model that predicts action likelihood from longitudinal sequences of organic and paid user interactions. | **Avoid Ad Set Hyper-Fragmentation.** Splitting budgets across dozens of micro-interest ad sets fragments conversion sequences and traps ad sets in Learning Limited. Consolidate into broad/Advantage+ ad sets. |
| **3. Ranking & Auction** | **Meta Lattice** (Unified Cross-Objective / Cross-Surface Model) | Scores candidates across placements and objectives using the **Total Value** equation: $\text{Total Value} = (\text{Advertiser Bid} \times \text{Estimated Action Rate}) + \text{Ad Quality / User Value}$. | Pair clean server-authoritative CAPI signals (`meta-ads-signal-engine`) with **Incremental Attribution** (`"incremental_attribution": true`) and **Value Rules** so Lattice bids higher on net-new, high-LTV buyers. |

### Marketing API v22.0–v26.0 Structural Upgrades

1. **Unified Advantage+ Campaign Architecture (`advantage_state`):**
   - Legacy `smart_promotion_type` (`AUTOMATED_SHOPPING_ADS` for ASC and `SMART_APP_PROMOTION` for AAC) creation was deprecated in v25.0 and edits are blocked in v26.0 (`dotads-meta validate` rejects `smart_promotion_type`).
   - Instead, create standard `OUTCOME_SALES`, `OUTCOME_LEADS`, or `OUTCOME_APP_PROMOTION` campaigns. When three levers are active—**Campaign Budget (CBO)**, **Advantage+ Audience** (`"advantage_audience": true` -> `targeting_automation.advantage_audience = 1`), and **Advantage+ Placements**—Meta automatically elevates campaign `advantage_state` to `ADVANTAGE_PLUS_SALES` / `ADVANTAGE_PLUS_LEADS` / `ADVANTAGE_PLUS_APP`.
   - With `"advantage_audience": true`, age/gender/interest inputs act as soft starting suggestions while country (`targeting_countries`) and minimum legal age remain hard boundaries.
2. **Ad-Level Flexible Ad Format (`"ad_format": "AUTOMATIC_FORMAT"`) vs Ad-Set DCO (`"dynamic_creative": true`):**
   - **Classic DCO (`"dynamic_creative": true` on the ad set):** Allows only **1 ad per ad set** (`dotads-meta validate` enforces this limit).
   - **Flexible Ad Format (`"ad_format": "AUTOMATIC_FORMAT"` on the creative):** Compiles multi-asset fields (`images`, `videos`, `titles`, `bodies`, `descriptions`, `call_to_actions`) into an ad-level `asset_feed_spec` without locking the ad set to `dynamic_creative: true`. Use this to run multiple distinct multi-asset creative concepts inside one consolidated ad set.
   - **Multi-Advertiser Ads (`"contextual_multi_ads": false`):** Meta auto-enrolls eligible ads into multi-advertiser shopping carousels by default. Set `"contextual_multi_ads": false` (`--no-contextual-multi-ads`) when offer isolation or strict brand adjacency is required.
3. **Granular Advantage+ Creative (`degrees_of_freedom_spec` / `creative_features_spec`):**
   - The legacy bundled `standard_enhancements` key was deprecated in Graph API v22.0+ (`dotads-meta validate` warns if used). Control AI creative transformations per feature (`OPT_IN` or `OPT_OUT`): `image_touchups`, `image_templates`, `video_auto_crop`, `text_optimizations`, `inline_comment`, `background_generation`, `image_expansion`, `text_generation`.
4. **Incremental Attribution, Attribution Windows & ABO Budget Sharing:**
   - **Incremental Attribution (`"incremental_attribution": true` on ad set):** Optimizes delivery for holdout-calibrated causal lift ("would this user have converted without seeing the ad?") rather than post-view correlation.
   - **Attribution Windows (`"attribution_spec"`):** Meta deprecated `7d_view` and `28d_view` (`dotads-meta validate` rejects `VIEW_THROUGH` windows of 7 or 28 days). Use `1d_view` (`VIEW_THROUGH`, `window_days: 1`), `1d_ev` (`ENGAGED_VIEW`, `window_days: 1`), and `7d_click` / `1d_click` (`CLICK_THROUGH`).
   - **ABO Ad Set Budget Sharing (`"adset_budget_sharing": true` on campaign):** Shares up to 20% budget dynamically across ad sets in an ABO testing campaign without full CBO consolidation.
5. **Opportunity Score (`0–100`) & Value Rules:**
   - Pull account recommendations via `meta ads guidance`. Treat Opportunity Score (`0–100`) as an alignment diagnostic, never a mandatory auto-apply checklist—never accept recommendations that strip required COD/region exclusions or merge isolated creative tests.
   - **Value Rules** act as bid multipliers in the Lattice auction (max 2 criteria/rule, 10 rules/set, 6 sets/account). Meta evaluates rules in priority order and applies **only the first matching rule**; always order rules from **most specific to least specific**.

---

## 1. Business Manager & System User Setup (One-Time per Business)

For headless CLI automation across devices, use a **Business Manager System User** token rather than a short-lived personal browser token:

1. **Meta App Mode:** In `developers.facebook.com/apps`, create a Business-type App, attach it to your Business Portfolio, add the **Marketing API** product, and switch **App Mode** from `Development` to **`Live`** (Apps in Development Mode fail on `creative create` with `Error 1885183` / `subcode 1885104`).
2. **System User & Assigned Assets:** In `business.facebook.com/latest/settings/system_users`, create an **Admin** System User and click **Assign Assets**:
   - **Ad Accounts** (`act_<id>`) -> enable *Manage campaigns*.
   - **Pages** (`<page_id>`) -> enable *Create ads* & *View page performance*.
   - **Instagram Accounts** -> enable *Ads* (when running IG placements under brand identity).
   - **Datasets / Pixels** (`<pixel_id>`) -> enable *Manage events / Create ads*.
   - **Catalogs** (optional, for DPA) -> enable *Manage catalog*.
3. **Generate Token:** Click **Generate New Token**, select the App, choose **Never** (or 60 days), and grant:
   - `ads_management`, `ads_read`, `business_management`, `pages_read_engagement`, `pages_manage_ads` (plus `catalog_management` if using catalogs).
4. **Store Token in `secrets-env`:** Add `META_ACCESS_TOKEN=<token>` (or per-BM `META_ACCESS_TOKEN_<BRAND>`) to `~/.config/ai-local/secrets.env` (`chmod 600`) and verify with:
   ```bash
   secrets-env check
   dotads-meta doctor
   ```

---

## 2. Per-Project Workflow (`dotads-meta`)

- For the 8 Golden Rules, Andromeda/GEM/Lattice deep dive, granular `degrees_of_freedom_spec` JSON templates, Business Manager SOP, and copy-paste campaign JSON recipes, open [references/rules-and-tutorial.md](references/rules-and-tutorial.md).
- For **ROAS maximization, lowest CPR/CPA math, COD RTS unit-economics modeling, 6-bucket creative bottleneck diagnostics, and multi-source learning (`learn` & `analyze`)**, open [references/roas-cpr-profit-intelligence.md](references/roas-cpr-profit-intelligence.md).

### Step 0: Device Bootstrap (Once per Laptop)
```bash
dotads-meta setup
```
Verifies `meta` (`meta-ads==1.2.0`) is installed via `pipx` and installs it automatically if missing after `dotsync`.

### Step 1: Scaffold a Brand Workspace
```bash
mkdir -p ~/Documents/work/ads/brand-alpha
dotads-meta init ~/Documents/work/ads/brand-alpha
```
This creates:
- `brand.json`: holds `ad_account_id` (`act_<digits>`), `business_id`, `page_id`, `instagram_user_id`, `pixel_id`, `conversion_domain`, `currency`, and `token_env` (default `"META_ACCESS_TOKEN"`).
- `campaigns/sample-campaign.json`: declarative L3->L1 campaign manifest (`campaign`, `creatives`, `adsets`, `ads`).
- `memory/ads-memory.json` & `memory/MEMORY.md`: per-brand conversion unit economics, proven winners, burned losers, and competitor/outsource intelligence.
- `media/`: directory for local `.jpg`, `.png`, `.webp`, `.mp4`, `.mov` assets.
- `.gitignore`: excludes `.meta-state.json`, `.dotads-meta.lock/`, and `.env*`.

### Step 1b: Configure Conversion Unit Economics & Consult Brand Memory
```bash
# Set AOV, COGS, shipping subsidy, COD RTS rate, and target net margin
dotads-meta learn unit-economics --brand ~/Documents/work/ads/brand-alpha/brand.json \
  --aov 250000 --cogs 75000 --shipping-fee 15000 --cod-rts-rate 0.12 --rts-penalty 20000 --target-margin 0.20

# Review existing winners, losers, and competitor/outsource insights before writing a campaign
dotads-meta learn list --brand ~/Documents/work/ads/brand-alpha/brand.json
```

### Step 2: Offline Validation
```bash
dotads-meta validate ~/Documents/work/ads/brand-alpha/campaigns/sample-campaign.json
```
Checks `brand.json` format, CBO vs ABO vs Flex budget rules, Unified Advantage+ readiness (`ADVANTAGE_PLUS_SALES`), `OUTCOME_SALES` conversion requirements (`pixel_id`, `custom_event_type`, `conversion_domain`, `url_tags` UTM attribution), Flexible Format (`AUTOMATIC_FORMAT`) vs DCO limits, deprecated API fields (`smart_promotion_type`, `7d_view`/`28d_view`, `standard_enhancements`), **Andromeda copy hygiene & viewport truncation** (warns on pushy direct-click / WhatsApp CTA clutter and headlines `>40` chars / descriptions `>30` chars), **bidirectional Indonesia (`ID`) $\leftrightarrow$ Malaysia (`MY`) lexical isolation** (flags Malaysian Malay leaks on `"ID"` ad sets and Indonesian slang leaks on `"MY"` ad sets), local media file existence + SHA-256 hashes, and prints the minor/major unit budget summary (including zero-decimal `IDR`/`JPY` offset guidance).

### Step 3: Dry-Run Deployment Plan & Drift Check
```bash
dotads-meta deploy ~/Documents/work/ads/brand-alpha/campaigns/sample-campaign.json
```
Prints the exact `meta` CLI commands that will run, marks any entity already recorded in `.meta-state.json` as `SKIP`, and warns (`⚠ DRIFT`) if a deployed entity's local JSON spec changed without bumping its `key`. Makes zero network calls.

### Step 4: Execute Deployment & Inspect State (Requires User Approval)
```bash
dotads-meta deploy ~/Documents/work/ads/brand-alpha/campaigns/sample-campaign.json --apply
dotads-meta status ~/Documents/work/ads/brand-alpha/campaigns/sample-campaign.json
```
Executes `campaign create` -> `creative create` -> `adset create` -> `ad create` sequentially with `PAUSED` status, saving each returned ID and media `image_hash` / `video_id` immediately to `.meta-state.json`. If a step fails mid-run, re-running the command skips already-created steps and resumes from the failed step.

### Step 5: Analyze Conversion Performance & Harvest Multi-Source Memory
```bash
# Pull live ad insights (or pass ./insights.json), reconcile COD delivery rate, classify 8 ROAS buckets & record to memory/
dotads-meta analyze --pull --date-preset last_7d --delivery-rate 0.88 --brand ./brand.json --record-memory

# Or analyze a saved insights JSON file against brand unit economics
dotads-meta analyze ./insights-last-7d.json --brand ./brand.json --record-memory

# Record insights from competitor research (meta-ads-scout), outsource media buyers, or funnel audits
dotads-meta learn add --brand ./brand.json \
  --source competitor --category hook --verdict insight \
  --title "45-Day Active Competitor Hook" \
  --summary "Split-screen durability demonstration ran 45+ days in ID/MY." \
  --action "Test physical durability demonstration in first 3 seconds."
```

---

### State recovery

State is saved atomically after each creation. Invalid JSON, unsupported state versions, and malformed records stop `deploy` and `status`; restore a verified state copy instead of deleting the file. If saving fails after a remote creation, inspect that entity and reconcile its returned ID before retrying: local state cannot make a remote API call transactional. Run one deployment at a time per workspace.

## 3. Raw `meta` CLI Command Structure & Escape Hatches

Use `dotads-meta run --brand <brand.json> -- <meta args...>` to run any raw `meta` command with `ACCESS_TOKEN`, `AD_ACCOUNT_ID`, and `BUSINESS_ID` injected in-memory. The selected brand overrides inherited account defaults; a brand without a business ID clears an inherited `BUSINESS_ID`. Explicit raw CLI account flags remain available.

### Strict Flag Ordering Rule
Global options (`--output json`, `--no-input`, `--no-color`, `--debug`) **must precede `ads`**, and group options (`--ad-account-id`, `--business-id`) **must follow `ads`** before the resource noun:

```bash
dotads-meta run --brand ./brand.json -- \
  --output json --no-input ads --ad-account-id act_1234567890 campaign list
```

### Common Read & Diagnostic Commands
```bash
# List pages accessible to the token
dotads-meta run --brand ./brand.json -- --output json --no-input ads --ad-account-id act_1234567890 page list

# List pixels / datasets
dotads-meta run --brand ./brand.json -- --output json --no-input ads --ad-account-id act_1234567890 dataset list

# Pull performance insights (last 7 days, broken down by age)
dotads-meta run --brand ./brand.json -- --output json --no-input ads --ad-account-id act_1234567890 \
  insights --date-preset last_7d --level ad --breakdowns age

# Check Advantage+ Opportunity Score & account delivery guidance
dotads-meta run --brand ./brand.json -- --output json --no-input ads --ad-account-id act_1234567890 guidance
```

### Creative Modes in `meta ads creative create`
1. **Single Image or Video:** `--image ./media/hero.jpg` (or `--video ./media/reel.mp4`) + `--page-id` + `--title` + `--body` + `--link-url` + `--call-to-action SHOP_NOW`.
2. **Reuse Uploaded Asset (Zero Re-Upload):** `--image-hash <hash>` or `--video-id <id>`.
3. **Flexible Ad Format (Recommended Multi-Asset):** Repeat `--images` (up to 10) or `--videos` (up to 10), `--titles` (up to 5), `--bodies` (up to 5), `--descriptions` (up to 5), `--call-to-actions` (up to 5) with `--ad-format AUTOMATIC_FORMAT` (`"ad_format": "AUTOMATIC_FORMAT"` in `campaign.json`). Allows multiple multi-asset ads inside the same ad set.
4. **Classic Dynamic Creative (DCO):** Same plural asset flags, but requires `--dynamic-creative` (`"dynamic_creative": true`) on the owning ad set and is limited to 1 ad per DCO ad set.
5. **Boost Existing Post:** `--object-story-id <PAGEID_POSTID>`, `--source-instagram-media-id <IG_MEDIA_ID>`, or `--instagram-permalink-url <URL>`.
6. **Advanced JSON Escape Hatches:** `--object-story-spec @oss.json` (carousels, custom deep links), `--asset-feed-spec @feed.json`, `--degrees-of-freedom-spec @dof.json`.

---

## 4. The 10 Critical Meta Ads API & Conversion Traps

1. **Minor Currency Units (Cents Trap):** Meta's `--daily-budget`, `--lifetime-budget`, `--spend-cap`, and `--bid-amount` are integers in **minor currency units** (`5000` = `$50.00` USD). Always verify the ad account's currency and minor-unit scale before applying budgets.
2. **Development Mode App Failure (`Error 1885183`):** If the Meta App in `developers.facebook.com` is in `Development` mode, `campaign create` may succeed while `creative create` fails with `Ads creative post was created by an app that is in development mode`. Switch the App to **Live** mode.
3. **CBO vs ABO Budget Collision (`Error 1885621`):** Never set a budget on both the campaign (CBO) and an ad set (ABO). Furthermore, on plain ABO campaigns, omit `--bid-strategy` and `--pacing-type` on the campaign and set them on the ad set instead.
4. **Legacy `smart_promotion_type` Block (v25.0–v26.0):** Never pass `smart_promotion_type=AUTOMATED_SHOPPING_ADS` or `SMART_APP_PROMOTION`. Use Unified Advantage+ (`OUTCOME_SALES` + CBO + `"advantage_audience": true`).
5. **DCO Multi-Ad Collision vs Flexible Format:** An ad set with `"dynamic_creative": true` rejects a second ad. To test multiple multi-asset creatives in one consolidated ad set, set `"ad_format": "AUTOMATIC_FORMAT"` on each creative and keep `"dynamic_creative"` off on the ad set.
6. **Deprecated `standard_enhancements` & `7d_view`/`28d_view`:** Use granular `creative_features_spec` keys inside `degrees_of_freedom_spec`, and restrict view-through `attribution_spec` windows to `1d_view` (`window_days: 1`) or `1d_ev` (`ENGAGED_VIEW`).
7. **Partial Build Orphans:** Meta has no multi-resource transaction across Campaign -> Creative -> Ad Set -> Ad. Always use `dotads-meta deploy --apply` so `.meta-state.json` records each step's ID immediately and prevents duplicate orphans on retry.
8. **Sales & Conversion Completeness:** For `OUTCOME_SALES` / `OFFSITE_CONVERSIONS`, the ad set requires `--pixel-id` + `--custom-event-type` (e.g. `PURCHASE`), and the ad requires `--conversion-domain` (e.g. `example.com`).
9. **Andromeda Copy Hygiene & Market Localization (`ID` vs `MY`):** Never stuff `body`/`title`/`description` with pushy text CTAs (`"Klik link di bawah"`, `"Chat WA sekarang"`, `"Beli sekarang juga"`)—Meta's native `call_to_action` button (`SHOP_NOW` / `LEARN_MORE`) handles the CTA while Andromeda NLP uses the text for semantic buyer retrieval. When targeting Indonesia (`"ID"`), write strictly in natural **Bahasa Indonesia** (`gratis`, `pengiriman`, `diskon`, `pesan`)—never Malaysian Malay (`percuma`, `penghantaran`, `diskaun`, `tempah`).
10. **Binary Flag Verification:** Never invent flags from third-party blog posts. Verify against the installed binary (`meta ads <resource> <action> --help`) before running custom commands.

---

## Sibling Skill Routing

| Need | Owner |
| --- | --- |
| Meta Pixel, Conversions API (CAPI), `event_id` deduplication, EMQ, `_fbp`/`_fbc` | `meta-ads-signal-engine` |
| Competitor ad research in Meta Ad Library (`/ads_archive` & UI review) | `meta-ads-scout` |
| Ad headlines, primary text rules, character limits, compliance copy | `copywriting` |
| Multi-asset content production & creative batching | `content` |
| Google Ads conversion tracking & Enhanced Conversions | `google-ads-signal-engine` |
| TikTok Ads Pixel & Events API v2 | `tiktok-ads-signal-engine` |
