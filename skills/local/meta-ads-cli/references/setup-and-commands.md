# Setup, per-project workflow, raw `meta` CLI commands

Read the section the current step needs. Flags were verified against `meta-ads 1.2.0` (device later upgraded to 1.3.1 / SDK 26.0.2 / API v26.0 on 2026-11-04); confirm with `meta ads <resource> <action> --help` before running a command not shown here.

## 0. AI-managed env preparation: the operator fills one token line

When asked to set up a device, the AI owns reversible local preparation instead
of handing the operator a configuration checklist. This is an **AI operating
procedure**, not a new CLI subcommand: neither `setup --workspace-only` nor
post-pull reconciliation creates/edits credentials automatically.

1. **Inspect once.** Verify the installed `dotads-meta` path and configured
   secret source (`SECRETS_ENV_FILE`, otherwise `~/.config/ai-local/secrets.env`).
   Existing-file checks use `secrets-env`; never dump the file, print token
   values, source it in a shell, or retry a guard-blocked inspection by another
   route. Reuse an existing profile, exact label and saved `token_env` first.
2. **Resolve identity once.** Reuse the matching, explicitly authorized local
   BM metadata (`bm.json`/selected brand) only when its key, BM ID and token
   reference agree. If the BM ID is unknown or sources conflict, ask one bounded
   question before writing; never derive an ID from a token/name/ad-account ID.
   Device-local identities and tokens are not transported by a dotfiles pull.
3. **Prepare the env after authorization.** Create a missing credential file
   exclusively at mode 0600 in a private location outside repositories; do not
   truncate/replace an existing file. For an existing file, append only keys
   verified absent through the approved loader, preserving all existing bytes,
   credentials and bindings. Refuse duplicates or format migration; do not
   rewrite permissions/ACLs or move files silently. Prefill the confirmed BM ID
   and optional display name. Use the existing token naming convention; for a
   new profile, `META_ACCESS_TOKEN_<KEY>` with `META_BM_<KEY>_ID` is supported.
   Leave a genuinely new token value **empty**, not an active example token.
   If an existing token is available, skip token entry entirely.
4. **Give one edit instruction.** Show the local file path and only the token
   key to fill, with a clearly illustrative placeholder; never ask for the
   value in chat. `nano ~/.config/ai-local/secrets.env` is an editor, not a
   request to reconstruct the entire configuration. No leading indentation,
   `export`, shell quoting, or commented-out active keys. The AI prepares the
   metadata; the operator pastes the token locally.
5. **Finish, don't repeat instructions.** After the operator says it is filled,
   run `dotads-meta setup --workspace-only --bm <matching-label>` and verify
   the reported directory and its `assets/` really exist. Do not ask for the
   same token/ID again unless evidence identifies a specific missing field.
   Report actual folder success separately from authenticated Meta access.

Illustration for an existing AUTOLARIS profile (not a fixed device default):

```dotenv
META_ACCESS_TOKEN_AUTOLARIS=<paste-token-locally>
```

That is the only line the operator fills; the AI has already supplied the
confirmed `META_BM_AUTOLARIS_ID` and optional `_NAME`. Never write the example
placeholder into a runnable configuration or use it as proof of a valid token.
`--bm autolaris` matches that suffix; it is not an alias for `autokirim`.

If setup fails, classify the actual evidence once: unknown label, unavailable
named token, missing/invalid BM ID, conflicting references, loader refusal or
filesystem failure. Do not infer token invalidity from profile detection or
reinterpret a Git-location audit warning as a token failure. Audit findings
remain separate and require explicit approval for corrective secret/Git work.
Never create an empty reporting folder just to claim setup succeeded.

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
4. **AI prepares one named profile per BM; the operator fills only the token:**
   Follow §0 before asking for manual edits. In the device-local
   `~/.config/ai-local/secrets.env` (0600), the AI prepares
   `meta_ads_token_autolaris` and required `meta_ads_bm_id_autolaris`.
   Optional `meta_ads_bm_name_autolaris` sets the display name; otherwise the
   suffix is the local label. Use your own lowercase label instead of
   `autolaris`; it is an example, never a fixed business or device default.
   Each device configures its own labels, BM IDs and tokens locally; dotfiles
   pulls synchronize the generic naming convention, not these private values.
   Keep token values out of chat and Git. Existing `META_ACCESS_TOKEN_<KEY>`
   names are supported with explicit `META_BM_<KEY>_ID` and optional
   `META_BM_<KEY>_NAME` (defaults to the key); saved `token_env` stays unchanged.
   `META_ACCESS_TOKEN_AUTOLARIS` selects `--bm autolaris`, not `autokirim`.
   A token alone is not enough to infer BM identity. Legacy `META_BM_*` profiles
   stay supported, but do not define multiple token formats for the same BM.
   Existing saved token references require explicit migration. See the
   [BM auto-setup contract](account-workspace-runtime.md#business-manager-auto-setup).
   ```bash
   secrets-env check
   dotads-meta setup --workspace-only
   # Authorized account/auth read only when requested:
   dotads-meta doctor --bm autolaris
   ```
   Legacy `META_ACCESS_TOKEN`/custom token references remain supported when no
   named BM profile is selected; they are never assigned to a BM by guesswork.

## 2. Per-Project Workflow (`dotads-meta`)

- For operational guardrails, documented delivery components, granular `degrees_of_freedom_spec` JSON templates, Business Manager SOP, and copy-paste campaign JSON recipes, open [references/rules-and-tutorial.md](rules-and-tutorial.md).
- For **ROAS/CPR interpretation, COD contribution estimates, data-quality checks,
  and scoped observational learning (`learn` & `analyze`)**, open
  [references/roas-cpr-profit-intelligence.md](roas-cpr-profit-intelligence.md).

### Step 0: Device Bootstrap (Once per Laptop)
```bash
# Offline local structure; also reconciled after dotfiles pull:
dotads-meta setup --workspace-only
# Install/check the upstream CLI only when installation is authorized:
dotads-meta setup
```
Checks `meta` and can install it through `pipx` if missing. Use this bootstrap only when installation is authorized; it is unnecessary for offline validation or a read-only audit.
Recovery queries pipx's effective shared-library path, attempts at most one
repair/retry when shared pip is missing, and stops if either repair step fails.
Installation success also requires the requested CLI version to be runnable.

### Step 1: Scaffold an Account / Brand Workspace

For named BM profiles, use the canonical account folder:

```bash
dotads-meta init --bm autolaris --account act_1234567890 --account-name 'Example Account'
# After sync/init registration, omit --account-name to reuse it.
```

New folders are `<BM name>--bm_<id>/Example Account (act_1234567890)/`.
Sync creates the same canonical account workspace automatically. Campaigns,
notes and Markdown reports stay inside it. Reusable images/videos default to
BM-level `assets/`; `import-media --temporary` makes optional scratch copies
without automatic deletion. Internal JSON remains for state/provenance.

The following examples describe the compatible legacy unscoped workflow. For
BM commands use `--bm KEY` and the actual canonical account path instead:

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
