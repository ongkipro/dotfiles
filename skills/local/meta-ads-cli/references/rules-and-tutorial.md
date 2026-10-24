# Meta Ads CLI & `dotads-meta` — Rules, SOP, and Step-by-Step Tutorial

Canonical operational rules and copy-paste recipes for running Meta (Facebook & Instagram) Ads from the terminal across all devices and all 5 AI CLIs (`claude`, `codex`, `agy`, `pi`, `omp`).

---

## Part 1: The 8 Golden Rules (Mandatory Guardrails)

1. **Workspace Separation (`~/dotfiles` vs Project Data):**
   - `~/dotfiles` holds only CLI helpers (`bin/dotads-meta`, `bin/dotads-meta-test`) and skills (`skills/local/meta-ads-cli/`).
   - Every brand or store workspace (`brand.json`, `campaigns/*.json`, `media/`, `.meta-state.json`) lives outside `~/dotfiles` (e.g. `~/Documents/work/ads/<brand-slug>/` or `<repo>/ads/`).
2. **Zero Plaintext Secrets in Project Folders:**
   - Never create `.env` files with Meta tokens inside project workspaces, and never pass tokens via CLI flags (`--access-token`).
   - Store all System User tokens in `~/.config/ai-local/secrets.env` (`chmod 600`) and let `dotads-meta` inject `ACCESS_TOKEN` in-memory via `secrets-env get`.
3. **Mandatory 4-Step Pre-Flight Sequence:**
   - Always run: (1) `dotads-meta validate <campaign.json>` -> (2) `dotads-meta deploy <campaign.json>` (dry-run) -> (3) obtain explicit user approval -> (4) `dotads-meta deploy <campaign.json> --apply`.
4. **Paused-by-Default Safety Gate:**
   - `dotads-meta deploy --apply` forces `--status PAUSED` on all created entities unless `--activate` is explicitly passed.
5. **Budget Exclusivity & Minor Currency Units:**
   - Choose exactly one budget mode per campaign: **CBO** (budget on `campaign`, none on `adsets`), **ABO** (no budget/bid_strategy/pacing_type on `campaign`, budget on each `adset`), or **Flex** (`"adset_budget_sharing": true` on `campaign`, `daily_budget` on each `adset`).
   - Budgets and bid amounts are integers in **minor currency units** (`5000` = `$50.00` USD).
6. **Conversion & DCO Completeness:**
   - `OUTCOME_SALES` / `OFFSITE_CONVERSIONS` requires `pixel_id` + `custom_event_type` on the ad set and `conversion_domain` on the ad.
   - Dynamic Creative Optimization (DCO plural fields: `images`, `videos`, `titles`, `bodies`, `descriptions`, `call_to_actions`) requires `"dynamic_creative": true` on the owning ad set.
7. **Stateful Idempotency (`.meta-state.json`):**
   - State writes replace the file atomically. Invalid state blocks deployment and status; restore a verified backup rather than deleting it. A remote creation can succeed before a state-write failure: reconcile the created ID before retrying. Do not run concurrent deployments in the same workspace.
   - Created IDs and SHA-256 media hashes (`image_hash`, `video_id`) are persisted after every step in `.meta-state.json`. Re-running `deploy --apply` skips already-created steps and reuses uploaded media hashes.
8. **Strict Flag Ordering for Raw `meta` Commands:**
   - Global flags (`--output json`, `--no-input`, `--no-color`, `--debug`) must precede `ads`; group flags (`--ad-account-id`, `--business-id`) must follow `ads` before the resource noun:
     ```bash
     dotads-meta run -- --output json --no-input ads --ad-account-id act_1234567890 campaign list
     ```

---

## Part 2: One-Time Setup Tutorial (Device & Business Manager)

### 1. Device Bootstrap
```bash
dotsync
dotads-meta setup
meta --version
dotads-meta --help
```

### 2. Meta Developer App & Business Manager System User
1. **Meta App (`developers.facebook.com/apps`):** Create a **Business** app connected to your Business Portfolio, add **Marketing API**, configure a Privacy Policy URL in **App Settings > Basic**, and switch **App Mode** from `Development` to **`Live`** (prevents `Error 1885183` on `creative create`).
2. **System User (`business.facebook.com/latest/settings/system_users`):** Create an **Admin** System User and **Assign Assets** for your Ad Account (*Manage campaigns*), Facebook Page (*Create ads*), Instagram Account (*Ads*), and Dataset/Pixel (*Manage events / Create ads*).
3. **Token Generation:** Generate a token for your App with scopes `ads_management`, `ads_read`, `business_management`, `pages_read_engagement`, `pages_manage_ads` (plus `catalog_management` if needed).
4. **Save to `secrets.env`:** Add `META_ACCESS_TOKEN=<token>` (or per-BM `META_ACCESS_TOKEN_<BRAND>`) to `~/.config/ai-local/secrets.env` and verify:
   ```bash
   secrets-env check
   dotads-meta doctor
   ```

### 3. Discover Asset IDs via Terminal
```bash
dotads-meta run -- --output json --no-input ads adaccount list
dotads-meta run -- --output json --no-input ads --ad-account-id act_YOUR_ID page list
dotads-meta run -- --output json --no-input ads --ad-account-id act_YOUR_ID dataset list
```

---

## Part 3: Campaign Manifest Recipes

### Recipe 1: CBO Single-Image or Video Sales Campaign
```json
{
  "campaign": {
    "key": "camp_sales_cbo",
    "name": "ID_Sales_CBO_Launch",
    "objective": "OUTCOME_SALES",
    "status": "PAUSED",
    "daily_budget": 5000
  },
  "creatives": [
    {
      "key": "cr_video_v1",
      "name": "Cr_Video_Reel_V1",
      "video": "media/reel.mp4",
      "title": "Engineered for Daily Comfort",
      "body": "Discover breathable materials crafted for everyday durability.",
      "description": "Fast nationwide shipping",
      "link_url": "https://example.com/products/flagship",
      "call_to_action": "SHOP_NOW",
      "url_tags": "utm_source=meta&utm_medium=paid_social&utm_campaign=sales_cbo_launch"
    }
  ],
  "adsets": [
    {
      "key": "adset_broad_id",
      "name": "AdSet_Broad_ID",
      "optimization_goal": "OFFSITE_CONVERSIONS",
      "billing_event": "IMPRESSIONS",
      "custom_event_type": "PURCHASE",
      "targeting_countries": ["ID"],
      "status": "PAUSED"
    }
  ],
  "ads": [
    {
      "key": "ad_video_v1",
      "name": "Ad_Video_Reel_V1",
      "adset": "adset_broad_id",
      "creative": "cr_video_v1",
      "status": "PAUSED"
    }
  ]
}
```

### Recipe 2: Dynamic Creative Optimization (DCO Multi-Asset)
```json
{
  "campaign": {
    "key": "camp_dco_sales",
    "name": "ID_Sales_CBO_DCO",
    "objective": "OUTCOME_SALES",
    "status": "PAUSED",
    "daily_budget": 8000
  },
  "creatives": [
    {
      "key": "cr_dco_pack",
      "name": "Cr_DCO_3Img_2Copy",
      "images": ["media/img1.jpg", "media/img2.jpg", "media/img3.jpg"],
      "titles": ["Headline Variant A", "Headline Variant B"],
      "bodies": ["Primary text variant 1.", "Primary text variant 2."],
      "descriptions": ["Ships within 24 hours"],
      "call_to_actions": ["SHOP_NOW", "LEARN_MORE"],
      "link_url": "https://example.com/collections/all"
    }
  ],
  "adsets": [
    {
      "key": "adset_dco_id",
      "name": "AdSet_DCO_ID",
      "optimization_goal": "OFFSITE_CONVERSIONS",
      "billing_event": "IMPRESSIONS",
      "custom_event_type": "PURCHASE",
      "targeting_countries": ["ID"],
      "dynamic_creative": true,
      "status": "PAUSED"
    }
  ],
  "ads": [
    {
      "key": "ad_dco_pack",
      "name": "Ad_DCO_Pack",
      "adset": "adset_dco_id",
      "creative": "cr_dco_pack"
    }
  ]
}
```

---

## Part 4: Day-2 Operations (Insights, Guidance, Status & Budget Updates)

```bash
# 1. Pull last 7 days insights at ad level
dotads-meta run --brand ./brand.json -- \
  --output json --no-input ads --ad-account-id act_1234567890 \
  insights --date-preset last_7d --level ad --breakdowns age,gender

# 2. Check Advantage+ & account recommendations
dotads-meta run --brand ./brand.json -- \
  --output json --no-input ads --ad-account-id act_1234567890 guidance

# 3. Activate or pause a campaign
dotads-meta run --brand ./brand.json -- \
  --output json --no-input ads --ad-account-id act_1234567890 \
  campaign update --id <CAMPAIGN_ID> --status ACTIVE

# 4. Update a CBO campaign daily budget (in minor currency units)
dotads-meta run --brand ./brand.json -- \
  --output json --no-input ads --ad-account-id act_1234567890 \
  campaign update --id <CAMPAIGN_ID> --daily-budget 7500
```
