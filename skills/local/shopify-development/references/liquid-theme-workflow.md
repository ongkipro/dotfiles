# Online Store 2.0 & Horizon Liquid Theme CLI Workflow

Use this operational workflow when managing Shopify Liquid themes (`Online Store` channel) via Shopify CLI 5.x (`shopify theme *`). For Liquid component markup, Dawn progressive enhancement, and storefront UX rules, pair with `storefront-development` and `storefront-ux`.

---

## 1. Choosing the Right Liquid Theme Base

| Theme / Repo | Role | When to Select |
| --- | --- | --- |
| **`Shopify/horizon`** | Flagship Theme Blocks architecture (`blocks/*.liquid` + `{% content_for 'blocks' %}`) | New modern Liquid theme builds needing nested composable blocks and section groups. |
| **`Shopify/skeleton-theme`** | Minimal official starter | Clean-slate bespoke Liquid themes without stripping Dawn's opinionated CSS. |
| **`Shopify/dawn`** | Mature Online Store 2.0 reference (`sections/*.liquid`, `templates/*.json`) | Maintaining Dawn-derived themes or referencing proven accessible progressive-enhancement patterns. |
| **`Shopify/hydrogen-redirect-theme`** | Lightweight Online Store redirect theme for headless Hydrogen stores | Active Online Store theme when Hydrogen serves `<brand>` and `checkout.<brand>` handles Shopify Checkout: redirects stray Liquid URLs to `settings.storefront_hostname` while preserving `/checkpoint` bot protection, `templates/gift_card.liquid`, and B2B `company_location_id` handoff. |

- **Never use archived legacy tooling**: `themekit`, Ruby `shopify-cli`, `slate`, `Timber`, or archived Ruby `theme-check`. All linting, LSP, and formatting live in `@shopify/cli` + `Shopify/theme-tools`.

---

## 2. Safe Theme CLI Operational Ladder

### Step 1: Inventory Remote Themes Before Pulling or Pushing

```bash
shopify theme list --store <shop>.myshopify.com
```

Record the exact numeric Theme ID and role (`[live]`, `[unpublished]`, `[development]`). **Never overwrite a `[live]` theme blindly.**

### Step 2: Pull Baseline Safely

```bash
# Pull the active live theme read-only to inspect or initialize Git tracking
shopify theme pull --store <shop>.myshopify.com --live --path ./theme

# Or pull a specific staging/unpublished theme by ID
shopify theme pull --store <shop>.myshopify.com --theme <theme-id> --path ./theme
```

### Step 3: Local Development & Hot Preview

```bash
shopify theme dev --store <shop>.myshopify.com --path ./theme
```

- `shopify theme dev` uploads an ephemeral `[development]` theme bound to your CLI session, syncs Liquid/CSS/JS edits live, and serves a local proxy (`http://127.0.0.1:9292`).
- Validate real rendering at mobile (`390x844`) and desktop (`1440x900`) viewports via `ui-validation`.
- Download current shop metafield definitions locally for IDE/theme-check completions when needed:
  ```bash
  shopify theme metafields pull --store <shop>.myshopify.com --path ./theme
  ```

### Step 4: Static Validation & Liquid Profiling

```bash
# Run official theme-check linter (from @shopify/theme-tools)
shopify theme check --path ./theme --fail-level error

# Optional: profile server-side Liquid render bottlenecks on slow templates
shopify theme profile --store <shop>.myshopify.com --url /products/<sample-handle>
```

### Step 5: Staging Push, Share Preview & Merchant Cutover

**CRITICAL MERCHANT DATA RULE**: Merchants customize content live inside Shopify Theme Editor, writing directly to:
- `config/settings_data.json`
- `templates/*.json` and `templates/customers/*.json`
- `sections/*-group.json` (header/footer/aside section groups)
- `locales/*.json` (merchant translation overrides)

Pushing local copies of those JSON files to a live or staging theme **wipes out merchant Theme Editor work** unless you either pulled fresh seconds earlier or explicitly ignore them!

```bash
# Push to a new unpublished staging theme for review (safe, non-destructive)
shopify theme push --store <shop>.myshopify.com --unpublished --json

# Generate a shareable preview link for merchant sign-off
shopify theme share --store <shop>.myshopify.com

# Push code-only updates to an existing staging/live theme WITHOUT overwriting merchant JSON content
# (Requires explicit user approval before targeting --live!)
shopify theme push \
  --store <shop>.myshopify.com \
  --theme <target-theme-id> \
  --ignore "config/settings_data.json" \
  --ignore "templates/*.json" \
  --ignore "sections/*-group.json"

# Promote an approved staging theme ID to live (explicit approval gate!)
shopify theme publish --store <shop>.myshopify.com --theme <approved-theme-id>
```

---

## 3. GitHub Actions CI Gate for Liquid Themes

Pair with `github-actions` rules (SHA-pinned actions, minimal `permissions: { contents: read }`, no secrets in PR lint jobs):

1. Run `shopify theme check --fail-level error` on every `pull_request` and `push` to `main`.
2. If utilizing Shopify's GitHub Online Store integration (`Online Store -> Themes -> Add theme -> Connect from GitHub`), let Shopify's native GitHub App sync the branch rather than racing `shopify theme push --live` from Actions, and commit merchant Theme Editor pulls cleanly via PRs.
