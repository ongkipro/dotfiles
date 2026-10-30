# Setup, per-project workflow, raw `meta` CLI commands

Read the section the current step needs. Flags were verified against `meta-ads 1.2.0`; confirm with `meta ads <resource> <action> --help` before running a command not shown here.

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

## 2. Per-Project Workflow (`dotads-meta`)

- For operational guardrails, documented delivery components, granular `degrees_of_freedom_spec` JSON templates, Business Manager SOP, and copy-paste campaign JSON recipes, open [references/rules-and-tutorial.md](rules-and-tutorial.md).
- For **ROAS/CPR interpretation, COD contribution estimates, data-quality checks,
  and scoped observational learning (`learn` & `analyze`)**, open
  [references/roas-cpr-profit-intelligence.md](roas-cpr-profit-intelligence.md).

### Step 0: Device Bootstrap (Once per Laptop)
```bash
dotads-meta setup
```
Checks `meta` and can install it through `pipx` if missing. Use this bootstrap only when installation is authorized; it is unnecessary for offline validation or a read-only audit.
Recovery queries pipx's effective shared-library path, attempts at most one
repair/retry when shared pip is missing, and stops if either repair step fails.
Installation success also requires the requested CLI version to be runnable.

### Step 1: Scaffold an Account / Brand Workspace
```bash
dotads-meta init act_1234567890--brand-alpha
# or explicit path: dotads-meta init ~/Documents/dotads-meta-report/act_1234567890--brand-alpha
```
This ensures `~/Documents/dotads-meta-report/` (`0700`) exists and creates:
- `brand.json`: holds `ad_account_id` (`act_<digits>`), `business_id`, `page_id`, `instagram_user_id`, `pixel_id`, `conversion_domain`, `currency`, and `token_env` (default `"META_ACCESS_TOKEN"`).
- `campaigns/sample-campaign.json`: declarative L3->L1 campaign manifest (`campaign`, `creatives`, `adsets`, `ads`).
- `memory/ads-memory.json` & `memory/MEMORY.md`: per-brand economics assumptions,
  scoped observations, manually supplied verdicts, and competitor references.
  Stored labels do not independently prove profitability or causality.
- `media/`: directory for local `.jpg`, `.png`, `.webp`, `.mp4`, `.mov` assets.
- `.gitignore`: excludes `.meta-state.json`, `.dotads-meta.lock/`, and `.env*`.

Bare names always resolve under the Documents root, even when the current
directory contains a matching name. Use `./name` or an absolute path for an
explicit location. Root permissions must be verified; symlink workspace
directories/files are rejected before scaffold files are written. Parents are
operator-controlled; concurrent directory replacement is outside this bootstrap
contract. An inferred folder ID is not proof of Meta access. Templates still
contain example identity, currency, market and offer values to replace.
This creates local scaffolding, not an account export, registry or report sync.

### Step 1b: Configure Conversion Unit Economics & Consult Brand Memory
```bash
# Set AOV, COGS, shipping subsidy, COD RTS rate, and target net margin
dotads-meta learn unit-economics --brand ~/Documents/dotads-meta-report/act_1234567890--brand-alpha/brand.json \
  --aov 250000 --cogs 75000 --shipping-fee 15000 --cod-rts-rate 0.12 --rts-penalty 20000 --target-margin 0.20

# Review the evidence, scope, and age of existing observations before planning
dotads-meta learn list --brand ~/Documents/dotads-meta-report/act_1234567890--brand-alpha/brand.json
```

### Step 2: Offline Validation
```bash
dotads-meta validate ~/Documents/dotads-meta-report/act_1234567890--brand-alpha/campaigns/sample-campaign.json
```
Checks brand/manifest structure, budget exclusivity, conversion inputs,
Flexible Format/DCO limits, retired fields/windows, attribution-mode compatibility,
local media existence/hashes, and a minor/major-unit budget summary. Copy length,
CTA wording, and ID/MY vocabulary checks are **local warnings**, not Meta ranking
rules. Advantage+ output is an unverified local candidate; validation does not
certify account eligibility, all v26 features, or successful live requests.

### Step 3: Dry-Run Deployment Plan & Drift Check
```bash
dotads-meta deploy ~/Documents/dotads-meta-report/act_1234567890--brand-alpha/campaigns/sample-campaign.json
```
Prints the exact `meta` CLI commands that will run, marks any entity already recorded in `.meta-state.json` as `SKIP`, and warns (`⚠ DRIFT`) if a deployed entity's local JSON spec changed without bumping its `key`. Makes zero network calls.

### Step 4: Execute Deployment & Inspect State (Requires User Approval)
```bash
dotads-meta deploy ~/Documents/dotads-meta-report/act_1234567890--brand-alpha/campaigns/sample-campaign.json --apply
dotads-meta status ~/Documents/dotads-meta-report/act_1234567890--brand-alpha/campaigns/sample-campaign.json
```
Executes `campaign create` -> `creative create` -> `adset create` -> `ad create` sequentially with `PAUSED` status, saving each returned ID and media `image_hash` / `video_id` immediately to `.meta-state.json`. If a step fails mid-run, re-running the command skips already-created steps and resumes from the failed step.

### Step 5: Analyze Conversion Performance & Harvest Multi-Source Memory

Use a scoped saved Insights JSON export for offline analysis. Authorized
`analyze --pull` now uses the installed official SDK adapter with an explicit
ad-level query; it does not pass unsupported flags to CLI 1.2.0. Read the
[runtime contract](account-workspace-runtime.md) before account reads.
Installed-SDK contract tests substitute HTTP; they do not establish actual
account permissions, effective API version or business outcomes.

```bash
# Offline analysis: declare the order basis only when the source establishes it
dotads-meta analyze ./insights-last-7d.json --purchase-basis placed --brand ./brand.json --record-memory

# Record insights from competitor research (meta-ads-scout), outsource media buyers, or funnel audits
dotads-meta learn add --brand ./brand.json \
  --source competitor --category hook --verdict insight \
  --title "45-Day Active Competitor Hook" \
  --summary "Split-screen durability demonstration ran 45+ days in ID/MY." \
  --action "Test physical durability demonstration in first 3 seconds."
```

Analysis produces observations and review hypotheses, not proven winners,
causal diagnoses, or executable scale/pause recommendations. Unknown metrics,
cost coverage, order basis, and partial backend reconciliation stay visible.
Repeated recording of the same observation is not independent replication.

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

# Inspect supported Insights controls locally before planning an authorized pull
meta ads insights get --help

# Read account delivery recommendations
dotads-meta run --brand ./brand.json -- --output json --no-input ads --ad-account-id act_1234567890 guidance list
```

### Creative Modes in `meta ads creative create`
1. **Single Image or Video:** `--image ./media/hero.jpg` (or `--video ./media/reel.mp4`) + `--page-id` + `--title` + `--body` + `--link-url` + `--call-to-action SHOP_NOW`.
2. **Reuse Uploaded Asset (Zero Re-Upload):** `--image-hash <hash>` or `--video-id <id>`.
3. **Flexible Ad Format (Recommended Multi-Asset):** Repeat `--images` (up to 10) or `--videos` (up to 10), `--titles` (up to 5), `--bodies` (up to 5), `--descriptions` (up to 5), `--call-to-actions` (up to 5) with `--ad-format AUTOMATIC_FORMAT` (`"ad_format": "AUTOMATIC_FORMAT"` in `campaign.json`). Allows multiple multi-asset ads inside the same ad set.
4. **Classic Dynamic Creative (DCO):** Same plural asset flags, but requires `--dynamic-creative` (`"dynamic_creative": true`) on the owning ad set and is limited to 1 ad per DCO ad set.
5. **Boost Existing Post:** `--object-story-id <PAGEID_POSTID>`, `--source-instagram-media-id <IG_MEDIA_ID>`, or `--instagram-permalink-url <URL>`.
6. **Advanced JSON Escape Hatches:** `--object-story-spec @oss.json` (carousels, custom deep links), `--asset-feed-spec @feed.json`, `--degrees-of-freedom-spec @dof.json`.

---
