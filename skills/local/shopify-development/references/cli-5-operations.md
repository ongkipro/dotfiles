# Shopify CLI 5.x Store Operations, Diagnostics & HTTP 402 Triage

Verified against `@shopify/cli@5.0.1+` (`shopify store`, `shopify organization`, `shopify doc`, `shopify theme`, `shopify hydrogen`).

---

## 1. First-Contact Store Triage Sequence

Before editing code, pulling files, or debugging GraphQL tokens on any `*.myshopify.com` store, establish ground truth from the CLI in **read-only** mode:

```bash
# 1. Verify CLI version and available organizations
shopify version
shopify organization list

# 2. List accessible stores in the organization (filterable by dev|production|client-transfer|collaborator)
shopify store list --json

# 3. Inspect store metadata, plan, type, adminUrl, and granted authScopes
shopify store info --store <shop>.myshopify.com --json

# 4. Disambiguate storefront surface: Liquid themes vs Hydrogen storefronts
shopify theme list --store <shop>.myshopify.com
shopify hydrogen list --path <hydrogen-repo> --json   # only inside/pointing at a Hydrogen project
curl -sSI https://<primary-domain>/ | grep -iE '^(server|powered-by|oxygen-)'
```

Inside a project, `npx shopify` runs the CLI pinned in `package.json` (Hydrogen repos often pin `3.x`, which lacks `--json` on `hydrogen list`); bare `shopify` is the global `5.x`. Check `shopify version` and `npx shopify version`.

### Surface Disambiguation Matrix (Never Mix `theme` and `hydrogen`)

| Signal / Operator Request | Active Surface | Correct CLI Family | Forbidden Mistake |
| --- | --- | --- | --- |
| Primary domain renders Liquid HTML (`Shopify.theme` in HTML, CDN `/cdn/shop/t/...` assets) | **Online Store 2.0 Liquid Theme** | `shopify theme list`, `shopify theme pull`, `shopify theme dev`, `shopify theme check`, `shopify theme push` | Running `shopify hydrogen link` or scaffolding Hydrogen routes. |
| `shopify hydrogen list` returns a `gid://shopify/HydrogenStorefront/<id>`, or response headers include `oxygen-*` / worker SSR HTML | **Hydrogen on Oxygen** (`hydrogen-development`) | Clone the linked GitHub repo -> `shopify hydrogen link` -> `shopify hydrogen env list` -> `shopify hydrogen env pull` | Running `shopify theme pull` (pulls the dormant/redirect Liquid theme, **not** the Hydrogen React Router codebase!). |
| Custom Next.js / Astro / Vercel / Cloudflare storefront consuming `/api/2026-*/graphql.json` | **Headless Storefront (Non-Oxygen)** (`headless-shopify` + framework skill) | Framework CLI (`vercel`, `wrangler`) + `shopify store execute` for Admin catalog/CMS verification | Pushing Liquid themes or running Oxygen-only `shopify hydrogen deploy`. |

---

## 2. Diagnosing HTTP 402, Frozen, Paused & Locked Stores

When a Storefront API call, `curl`, or CLI command fails with `402`, `423`, or `"Unavailable Shop"`, **stop all code/token changes immediately** and classify the store state:

```bash
# Check store plan/type metadata
shopify store info --store <shop>.myshopify.com --json

# Probe raw HTTP status on the myshopify.com origin and Storefront GraphQL endpoint
curl -sSI "https://<shop>.myshopify.com" | head -n 15
```

| HTTP / CLI Symptom | Store Lifecycle State | What Still Works vs Breaks | Required Operator Action |
| --- | --- | --- | --- |
| **HTTP `402 Payment Required`** (`{"errors":"Unavailable Shop"}` on Storefront API; storefront shows *"Sorry, this store is currently unavailable"*) | **Frozen / Unpaid Invoice / Expired Trial** (`plan` frozen or trial ended without active billing) | Storefront API and public checkout are **hard-blocked by Shopify**. Rotating tokens or changing API versions will **never** fix a `402`. | Report the exact `402` frozen/billing blocker to the store owner. Owner must log into `admin.shopify.com/store/<subdomain>/settings/billing` and reactivate a plan. |
| **Pause and Build** (`plan` paused) | **Paused Store** | Storefront browsing and Admin edits work, **but Checkout is disabled** (`checkoutUrl` blocks purchase completion). | Confirm whether intentional maintenance; owner must resume full plan before live checkout E2E or launch. |
| **HTTP `423 Locked`** or redirect to `/password` on Online Store | **Storefront Password Lock** (Online Store preferences password enabled) | **Storefront API works normally** with a valid Storefront token! Only Liquid Online Store HTML and `checkout.<brand>` (if password-gated on trial/dev) redirect to `/password`. | Distinguish Liquid password page from Storefront API access. Disable Online Store password in `Online Store -> Preferences` only with owner approval at launch (`Shopify/hydrogen-redirect-theme` for headless). |
| `type: "client-transfer"` restriction or scope error | **Partner Client-Transfer Store** | Dev preview works; certain production domains/apps lock until merchant accepts transfer. | Complete store transfer in Partner Dashboard when ready for production billing. |
| **HTTP `401 Unauthorized`** on Storefront API (`{"errors":"[API] Invalid API key or access token"}`) | **Revoked / Wrong Token or Store Mismatch** | Store is active (`200`/`302` on origin), but `PRIVATE_STOREFRONT_API_TOKEN` / `PUBLIC_STOREFRONT_API_TOKEN` belongs to a different shop or uninstalled Headless/Hydrogen channel. | Re-link via `shopify hydrogen link` + `shopify hydrogen env pull -f`, or inspect Headless channel tokens in Admin. |

---

## 3. Store Authentication (`shopify store auth`)

`shopify store execute` and `shopify store bulk` require stored online Admin API credentials per store. Request **least-privilege read scopes first**; request `write_*` scopes only when authorized to mutate store data:

```bash
# Read-only audit scopes (safe default for catalog, CMS, menus, policies, metaobjects, publications)
shopify store auth \
  --store <shop>.myshopify.com \
  --scopes read_products,read_inventory,read_content,read_online_store_pages,read_online_store_navigation,read_legal_policies,read_metaobjects,read_metaobject_definitions,read_publications,read_markets,read_locales \
  --json

# Inspect stores currently authenticated with `store auth`
shopify store auth list
```

- If a subsequent `store execute` returns `ACCESS_DENIED` on a field, re-run `shopify store auth` adding the exact missing scope (for example `write_products`, `write_content`, `write_online_store_pages`, `write_online_store_navigation`, `write_metaobjects`, `write_metaobject_definitions`, `write_publications`).
- Never read, echo, or log raw `.env` files or cached CLI credential tokens.

---

## 4. Direct Admin GraphQL Execution (`shopify store execute`)

`shopify store execute` runs against the Shopify Admin GraphQL API and **blocks mutations by default** unless `--allow-mutations` is explicitly passed.

```bash
# Inline read-only health & domain check
shopify store execute \
  --store <shop>.myshopify.com \
  --query 'query StoreAudit { shop { name myshopifyDomain primaryDomain { host url sslEnabled } plan { displayName partnerDevelopment shopifyPlus } currencyCode } }' \
  --json

# Complex parameterized read query from a file (preferred over shell-escaped strings)
shopify store execute \
  --store <shop>.myshopify.com \
  --query-file ./queries/catalog-audit.graphql \
  --variables '{"first": 50}' \
  --version 2026-04 \
  --json

# Authorized mutation (ONLY after explicit user approval + dry-run verification of inputs)
shopify store execute \
  --store <shop>.myshopify.com \
  --query-file ./mutations/publish-product.graphql \
  --variable-file ./mutations/variables.json \
  --allow-mutations \
  --json
```

### Safe Execution Rules
1. **Prefer `--query-file` and `--variable-file`** over inline `-q` strings to avoid bash `$variable` expansion bugs on GraphQL `$id: ID!` variables!
2. **Always check `userErrors`**: GraphQL mutations return HTTP `200` even when validation fails; every mutation selection set **must** request `userErrors { field message }`.
3. **Approval boundary**: Every `--allow-mutations` call against a shared or production store requires explicit user authorization naming the target store and records affected.

---

## 5. Asynchronous Bulk Operations (`shopify store bulk`)

Use `shopify store bulk` whenever reading or mutating **> 250 items** (full catalog exports, 1,000+ SKU price updates, metafield backfills) to avoid Admin GraphQL pagination loops and leaky-bucket throttling:

```bash
# 1. Export full product + variant + publication inventory to JSONL
shopify store bulk execute \
  --store <shop>.myshopify.com \
  --query-file ./queries/bulk-products.graphql \
  --watch \
  --output-file /tmp/store-products.jsonl

# 2. Check running or recent (last 7 days) bulk operations
shopify store bulk status --store <shop>.myshopify.com --json

# 3. Bulk mutation from JSONL variable file (one JSON object per line, requires approval)
shopify store bulk execute \
  --store <shop>.myshopify.com \
  --query-file ./mutations/product-variants-update.graphql \
  --variable-file ./mutations/variants-input.jsonl \
  --allow-mutations \
  --watch \
  --output-file /tmp/bulk-mutation-results.jsonl

# 4. Cancel a runaway bulk operation
shopify store bulk cancel --store <shop>.myshopify.com --id gid://shopify/BulkOperation/123456789
```

- **JSONL parent-child structure**: In bulk query outputs, child connection nodes (`ProductVariant`, `Metafield`) appear on separate lines with a `"__parentId"` field pointing to their parent `Product` GID. Stream-parse line-by-line rather than loading multi-hundred-MB files into memory.

---

## 6. Native Documentation Lookup (`shopify doc`) & `@shopify/dev-mcp`

Never guess Admin or Storefront GraphQL field names from memory:

```bash
# Vector search across shopify.dev (returns relevant chunks as JSON)
shopify doc search --query "productSet mutation publications" --api-name admin --api-version 2026-04

# Fetch an entire shopify.dev page verbatim as Markdown
shopify doc fetch --url https://shopify.dev/docs/api/admin-graphql/latest/mutations/productSet
```

When the `@shopify/dev-mcp` server is available in the runtime, pair `learn_shopify_api(api: "admin")` + `introspect_graphql_schema` + `validate_graphql_codeblocks` before running `shopify store execute`.
