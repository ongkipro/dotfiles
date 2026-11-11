---
name: shopify-development
description: >-
  Operate Shopify stores and Shopify CLI 5.x (store info/list/auth/execute/bulk, HTTP 402 triage, Admin GraphQL catalog/CMS/policies/menus/metaobjects, Liquid theme CLI). Not Hydrogen code (hydrogen-development) or headless architecture (headless-shopify).
---

# Shopify Platform & CLI 5.x Operations

Use this skill for **Shopify store diagnostics, Shopify CLI 5.x (`@shopify/cli >= 5.0`) store/Admin operations, HTTP 402 frozen/paused store triage, Liquid theme CLI workflows, Admin GraphQL catalog/CMS/policy/menu management, and Metaobject/Metafield schema setup**.

## Role & Specialist Boundaries

| Concern | Canonical Owner |
| --- | --- |
| Store inventory/diagnostics (`shopify store info/list/auth/execute/bulk`), HTTP 402 triage, Admin GraphQL catalog/CMS/policies/menus/publications, Metaobject/Metafield schema ops, Liquid theme CLI (`shopify theme *`) | `shopify-development` |
| Headless suitability gate, token/privacy boundaries, primary (`<brand>`) vs checkout (`checkout.<brand>`) domain architecture, Storefront & Customer Account API contracts | `headless-shopify` |
| Hydrogen storefront discovery (`shopify hydrogen list/link/env`), React Router/Oxygen code, live Storefront API loaders, cart/account handlers, Oxygen cache & GitHub CI/CD | `hydrogen-development` |
| Consent-aware Hydrogen analytics, Web Pixels, CAPI/sGTM attribution & purchase deduplication | `hydrogen-headless-tracking` |
| Storefront HTML/Liquid/React component implementation & Dawn/Horizon progressive enhancement | `storefront-development` |
| Commerce journeys, variant/filter/cart UX contracts, conversion states | `storefront-ux` |
| Client content-editing model selection | `cms-content` |
| Technical SEO, JSON-LD, sitemaps, brand-generic non-CTA meta copy (`shopify-content-helper`) | `seo-website-builder` |

---

## Pick the Path First

- **Unknown `*.myshopify.com` store or pull/sync request** -> §1 (Surface & Health Triage) -> [`references/cli-5-operations.md`](references/cli-5-operations.md).
- **HTTP `402` / `"Unavailable Shop"` / frozen / paused / locked error** -> §2 -> [`references/cli-5-operations.md`](references/cli-5-operations.md) §2.
- **Audit or sync products, sales-channel publications, collections, pages, blogs, legal policies, menus, or Metaobjects/Metafields** -> §3 -> [`references/admin-graphql-catalog-cms-sync.md`](references/admin-graphql-catalog-cms-sync.md).
- **Pull, preview, lint, or push an Online Store 2.0 / Horizon / Dawn Liquid theme** -> §4 -> [`references/liquid-theme-workflow.md`](references/liquid-theme-workflow.md).

---

## 1. First-Contact Store & Surface Triage (Never Mix `theme` and `hydrogen`)

Before pulling files or mutating anything on `<shop>.myshopify.com`, inspect in read-only mode:

```bash
shopify store info --store <shop>.myshopify.com --json
shopify theme list --store <shop>.myshopify.com
curl -sSI https://<primary-domain>/ | grep -iE '^(server|powered-by|oxygen-|x-shopid)'
```

`shopify hydrogen list` only runs inside a Hydrogen project, so it cannot discover a storefront from an empty folder: `oxygen-*` response headers on the primary domain, a `checkout.<brand>` primary domain in `store info`, or an `oxygen-deployment-*.yml` repo mean Hydrogen.

1. **Distinguish Liquid Theme vs Hydrogen Storefront immediately**:
   - If the live domain runs on Oxygen (or `shopify hydrogen list` inside the repo returns a `gid://shopify/HydrogenStorefront/<id>`), **do NOT run `shopify theme pull`** (that downloads the dormant or redirect Liquid theme, not the Hydrogen app). Hand off to `hydrogen-development` (`shopify hydrogen list` -> GitHub repo -> `shopify hydrogen link` -> `shopify hydrogen env pull`).
   - If the active storefront is an Online Store 2.0 Liquid theme (`horizon`, `dawn`, `skeleton-theme`), use `shopify theme list/pull/dev/check/push` (§4).
2. **Never read `.env` files**: Inspect variable metadata with `shopify hydrogen env list` or `shopify store info --json`, never by opening `.env*` secrets.
3. **Verify official docs via CLI 5.x or MCP**: Use `shopify doc search --query "<query>" [--api-name admin|storefront|hydrogen]` and `shopify doc fetch --url <shopify.dev URL>` (or `@shopify/dev-mcp` when exposed by the runtime) instead of guessing GraphQL fields from memory.

---

## 2. HTTP 402 Frozen / Paused / Password-Locked Store Gate

When Storefront API or storefront probes return **HTTP `402 Payment Required`** (`{"errors":"Unavailable Shop"}`), **HTTP `423 Locked`**, or checkout blocks:

1. **Stop all token rotation and code edits immediately.** An HTTP `402` means the store's billing plan is frozen, unpaid, or its trial expired — no Storefront token, API version bump, or theme push can bypass it.
2. Run `shopify store info --store <shop>.myshopify.com --json` to confirm `plan` and `type` (`dev`, `production`, `client-transfer`, `collaborator`).
3. Distinguish **Pause and Build** (storefront renders, checkout disabled) and **Online Store Password Lock** (`423` / `/password` on Liquid HTML while Storefront API still works with a valid token) from a true **HTTP `402` Frozen Store**.
4. Report the exact store status and Admin billing URL (`https://admin.shopify.com/store/<subdomain>/settings/billing`) to the store owner.

---

## 3. Admin GraphQL, Sales-Channel Publications & Custom Data Rules

Use `shopify store auth` + `shopify store execute` (single queries/mutations) or `shopify store bulk execute` (`> 250` records). Full GraphQL templates live in [`references/admin-graphql-catalog-cms-sync.md`](references/admin-graphql-catalog-cms-sync.md).

1. **Least-privilege auth & read-only default**:
   - Authenticate with `read_*` scopes first (`shopify store auth --store <shop>.myshopify.com --scopes read_products,read_content,read_online_store_pages,read_online_store_navigation,read_legal_policies,read_metaobjects,read_metaobject_definitions,read_publications --json`).
   - `shopify store execute` disables mutations by default. Adding `--allow-mutations` or `write_*` scopes on a shared/live store requires **explicit user approval**.
   - Always pass `--query-file` and `--variable-file` (avoiding shell `$id` expansion) and assert `userErrors` is empty on every mutation response.
2. **Sales-channel publication parity (`publications` + `publishablePublish`)**:
   - `status: ACTIVE` in Admin is **not** enough for headless/Hydrogen: products and collections return `null` on the Storefront API until published to the target `Hydrogen` / `Headless` `Publication` ID! Always audit `resourcePublicationsV2` when Storefront API queries return empty results.
   - Verify whether a real `all` collection (`handle: "all"`) exists before linking `/collections/all` in headless navigation.
3. **Single source of truth for CMS, menus & legal policies**:
   - Store institutional `pages`, editorial `blogs`/`articles`, navigation `menus` (`main-menu`, `footer`), `urlRedirects`, and `shopPolicies` (`PRIVACY_POLICY`, `REFUND_POLICY`, `SHIPPING_POLICY`, `TERMS_OF_SERVICE`, `CONTACT_INFORMATION`) in Shopify Admin so Storefront API and Shopify Checkout never drift.
4. **Metaobject & Metafield Storefront visibility invariants**:
   - Set `access: { storefront: PUBLIC_READ }` on every storefront-consumed Metaobject/Metafield definition (defaults to `NONE`, causing silent `null` reads in Storefront API).
   - When `capabilities.publishable` is enabled on a Metaobject definition, set entry status to `ACTIVE` (defaults to `DRAFT`, also returning `null` in Storefront API).
   - Use `$app:` reserved definitions in `shopify.app.toml` for custom apps/Checkout UI Extensions (`useAppMetafields()`), and `custom.*` / merchant-owned Metaobjects for Admin-authored storefront sections.

---

## 4. Liquid Theme CLI Safety Ladder (`shopify theme`)

1. Run `shopify theme list --store <shop>.myshopify.com` first to record theme IDs and roles (`[live]`, `[unpublished]`, `[development]`).
2. Develop against `shopify theme dev` and lint with `shopify theme check --fail-level error` (`@shopify/theme-tools`).
3. **Protect live merchant Theme Editor JSON**: Never overwrite `config/settings_data.json`, `templates/*.json`, `sections/*-group.json`, or `locales/*.json` on a staging/live theme without pulling fresh or passing `--ignore`.
4. Push to `--unpublished` (or a staging `--theme <id>`) and preview via `shopify theme share`; **never** run `shopify theme push --live` or `shopify theme publish` without explicit user approval.

---

## Reference Routing Table

| Task / Operational Playbook | Reference File |
| --- | --- |
| Shopify CLI 5.x (`store info/list/auth/execute/bulk`, `doc search/fetch`), surface disambiguation, and HTTP 402 / paused / password-lock triage | [`references/cli-5-operations.md`](references/cli-5-operations.md) |
| Admin GraphQL (`2026-04`/`2026-10`) queries & mutations: `publications`, `productSet`, collections, `pages`, `blogs`, `shopPolicies`, `menus`, `urlRedirects`, and Metaobject `PUBLIC_READ` / `ACTIVE` rules | [`references/admin-graphql-catalog-cms-sync.md`](references/admin-graphql-catalog-cms-sync.md) |
| Online Store 2.0 / Horizon / Dawn / `hydrogen-redirect-theme` CLI lifecycle, merchant JSON protection, `theme check`, and GitHub CI | [`references/liquid-theme-workflow.md`](references/liquid-theme-workflow.md) |

---

## Verification & Approval Gate

1. Confirm store status (`shopify store info --json`), surface type (`theme list` vs `hydrogen list`), and `userErrors: []` on any executed Admin GraphQL operation.
2. For Liquid changes, pass `shopify theme check --fail-level error` and real-browser mobile + desktop checks (`ui-validation`).
3. Stop and obtain explicit user approval before `--allow-mutations` Admin writes, `shopify store bulk execute --allow-mutations`, `shopify theme push --live`, `shopify theme publish`, or `shopify theme delete`.
