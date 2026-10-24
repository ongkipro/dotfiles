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

1. **Official Engine (`meta` CLI, `pipx install meta-ads==1.2.0`):** Handles Graph API / Marketing API calls, chunked multipart uploads for local images/videos, Dynamic Creative Optimization (DCO), insights, and account guidance.
2. **Dotfiles Orchestrator (`dotads-meta`):** Bridges `secrets-env` (`META_ACCESS_TOKEN` -> `ACCESS_TOKEN` in-memory without plaintext `.env` files), validates campaign manifests offline against Meta ODAX rules, runs dry-run plans by default, and executes idempotent L3->L1 creation with SHA-256 media caching in `.meta-state.json`.
3. **Per-Project Workspace (outside `~/dotfiles`):** Each brand or store keeps its own `brand.json`, `campaigns/*.json`, `media/`, and git-ignored `.meta-state.json` (e.g. `~/Documents/work/ads/<brand>/` or `<repo>/ads/`). Never commit client videos, images, or campaign state into `~/dotfiles`.

`dotads-meta` is the dotfiles helper name; the underlying `meta-ads` package and `meta` binary keep their upstream names. Existing `brand.json`, campaign manifests, `.meta-state.json`, and `META_ADS_BIN` / `SECRETS_ENV_BIN` overrides need no migration.

## Mandatory Approval & Safety Gates

- **Dry-Run First:** Always run `dotads-meta validate <campaign.json>` and `dotads-meta deploy <campaign.json>` (dry-run) and present the budget summary and step plan to the user before running `--apply`.
- **Live Mutation Gate:** `dotads-meta deploy <campaign.json> --apply` and raw `meta ads <resource> create|update|delete` mutate a live Meta Ad Account. Stop and obtain explicit user approval before executing `--apply` or any write subcommand.
- **Paused-by-Default:** `dotads-meta deploy --apply` forces `--status PAUSED` on every campaign, ad set, creative, and ad unless `--activate` is explicitly passed. Never pass `--activate` unless the user explicitly asks to launch active spend immediately.
- **Secret Hygiene:** Never read or print `~/.config/ai-local/secrets.env` directly, and never pass `ACCESS_TOKEN` as a command-line argument where `ps` or shell history can expose it. Use `dotads-meta` (which injects `ACCESS_TOKEN` via child process `env` from `secrets-env get`).

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

For the complete 8 Golden Rules, Business Manager SOP, and 6 copy-paste campaign JSON recipes (single image, video + SHA-256 reuse, DCO, ABO custom targeting, and post boosting), open [references/rules-and-tutorial.md](references/rules-and-tutorial.md).

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
- `media/`: directory for local `.jpg`, `.png`, `.webp`, `.mp4`, `.mov` assets.
- `.gitignore`: excludes `.meta-state.json` and `.env*`.

### Step 2: Offline Validation
```bash
dotads-meta validate ~/Documents/work/ads/brand-alpha/campaigns/sample-campaign.json
```
Checks `brand.json` format, CBO vs ABO budget rules, `OUTCOME_SALES` conversion requirements (`pixel_id`, `custom_event_type`, `conversion_domain`), DCO asset limits, local media file existence + SHA-256 hashes, and prints the minor/major unit budget summary (including zero-decimal `IDR`/`JPY` offset guidance).

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

# Check Advantage+ & account delivery guidance
dotads-meta run --brand ./brand.json -- --output json --no-input ads --ad-account-id act_1234567890 guidance
```

### Creative Modes in `meta ads creative create`
1. **Single Image or Video:** `--image ./media/hero.jpg` (or `--video ./media/reel.mp4`) + `--page-id` + `--title` + `--body` + `--link-url` + `--call-to-action SHOP_NOW`.
2. **Reuse Uploaded Asset (Zero Re-Upload):** `--image-hash <hash>` or `--video-id <id>`.
3. **Dynamic Creative (DCO):** Repeat `--images` (up to 10) or `--videos` (up to 10), `--titles` (up to 5), `--bodies` (up to 5), `--descriptions` (up to 5), `--call-to-actions` (up to 5). Requires `--dynamic-creative` on the owning ad set (`"dynamic_creative": true` in `campaign.json`).
4. **Boost Existing Post:** `--object-story-id <PAGEID_POSTID>`, `--source-instagram-media-id <IG_MEDIA_ID>`, or `--instagram-permalink-url <URL>`.
5. **Advanced JSON Escape Hatches:** `--object-story-spec @oss.json` (carousels, custom deep links), `--asset-feed-spec @feed.json`, `--degrees-of-freedom-spec @dof.json`.

---

## 4. The 7 Critical Meta Ads API Traps

1. **Minor Currency Units (Cents Trap):** Meta's `--daily-budget`, `--lifetime-budget`, `--spend-cap`, and `--bid-amount` are integers in **minor currency units** (`5000` = `$50.00` USD). Always verify the ad account's currency and minor-unit scale before applying budgets.
2. **Development Mode App Failure (`Error 1885183`):** If the Meta App in `developers.facebook.com` is in `Development` mode, `campaign create` may succeed while `creative create` fails with `Ads creative post was created by an app that is in development mode`. Switch the App to **Live** mode.
3. **CBO vs ABO Budget Collision (`Error 1885621`):** Never set a budget on both the campaign (CBO) and an ad set (ABO). Furthermore, on plain ABO campaigns, omit `--bid-strategy` and `--pacing-type` on the campaign and set them on the ad set instead.
4. **Partial Build Orphans:** Meta has no multi-resource transaction across Campaign -> Creative -> Ad Set -> Ad. Always use `dotads-meta deploy --apply` so `.meta-state.json` records each step's ID immediately and prevents duplicate orphans on retry.
5. **Redundant Video/Image Uploads:** Re-uploading a 50 MB video on every test wastes bandwidth and hits rate limits. `dotads-meta` hashes local files with SHA-256 and caches `image_hash` / `video_id` in `.meta-state.json`.
6. **Sales & Conversion Completeness:** For `OUTCOME_SALES` / `OFFSITE_CONVERSIONS`, the ad set requires `--pixel-id` + `--custom-event-type` (e.g. `PURCHASE`), and the ad requires `--conversion-domain` (e.g. `example.com`).
7. **Binary Flag Verification:** Never invent flags from third-party blog posts. Verify against the installed binary (`meta ads <resource> <action> --help`) before running custom commands.

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
