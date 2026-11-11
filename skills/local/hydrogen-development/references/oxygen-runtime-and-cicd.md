# Oxygen Runtime, Live Storefront Sync, Full-Page Cache & GitHub CI/CD Playbook

Use this reference for **Hydrogen storefront discovery & linking, enforcing 100% live Storefront API synchronization (zero static mock JSON), real cart/checkout/account gates, diagnosing `oxygen-full-page-cache: uncacheable`, GraphQL codegen + Vite 8 (`envDir: false`), worker bundle/CPU profiling, and production GitHub Actions -> Oxygen CI/CD pipelines** across both **Classic Hydrogen (`<= 2026.4.x`, React Router 7 framework mode)** and **Hydrogen `2026.10+` (`@shopify/hydrogen@2026.10.1+`)**.

---

## 1. Hydrogen Storefront Discovery & Linking (`*.myshopify.com`)

When asked to pull, sync, audit, or set up local development for an existing Hydrogen store on `<shop>.myshopify.com`:

1. **Never run `shopify theme pull`**:
   - `shopify theme pull` downloads the Online Store Liquid theme (often a dormant Dawn copy or `Shopify/hydrogen-redirect-theme`), **never** the Hydrogen React Router codebase!
2. **Run the canonical Hydrogen discovery & linking sequence**:
   ```bash
   # 1. Discover remote HydrogenStorefront GIDs, names, production URLs & latest commit metadata
   npx shopify hydrogen list --json

   # 2. Clone or cd into the linked GitHub repository, then link local directory (.shopify/project.json)
   npx shopify hydrogen link --shop <shop>.myshopify.com --storefront "<Storefront Name>"

   # 3. Inspect Oxygen environments (PRODUCTION, PREVIEW, CUSTOM) and branch mappings
   npx shopify hydrogen env list --json

   # 4. Pull environment variables into local .env (NEVER read or print .env contents in logs/prompts!)
   npx shopify hydrogen env pull -f
   ```
3. **Mandatory `.gitignore` Contract**:
   Ensure the repository `.gitignore` always excludes local Oxygen state, secrets, build artifacts, and profiling dumps:
   ```gitignore
   .env
   .env.*
   !.env.example
   .shopify/
   dist/
   .react-router/
   build/
   startup.cpuprofile
   h2_deploy_log.json
   ```

---

## 2. Anti-Mock & Live Storefront API Sync Gate

### Why Static Mock JSON (`data/*.json`) Is Strictly Banned in Production

1. **Oxygen Worker Bundle Bloat**: Importing static product/collection/blog JSON files (`import products from '~/data/products.json'`) bundles 300 KB+ of dead JSON directly into `dist/server/index.js`, inflating V8 isolate parse/startup CPU and risking Oxygen worker size/CPU limits.
2. **Catastrophic Storefront-to-Checkout Desync**: Static prices, currencies, availability flags, or stale `gid://shopify/ProductVariant/...` IDs diverge silently from Shopify Admin — shoppers see one price on the PDP and a different price (or an empty/broken cart) on `checkout.<brand>`.

### Production Data Authority Rules

1. **100% Runtime Storefront API Queries**:
   - Classic Hydrogen: `await context.storefront.query(PRODUCT_QUERY, { variables: { handle, country: context.storefront.i18n.country, language: context.storefront.i18n.language }, cache: context.storefront.CacheShort() })`
   - Hydrogen `2026.10+`: `await storefrontClient.graphql(PRODUCT_QUERY, { variables: { handle }, cache: Cache.short() })`
   - Every catalog, collection, search, menu, page, blog, and policy query **must** carry `@inContext(country: $country, language: $language)`.
   - When the Storefront API returns `null` for a handle, throw `new Response('Not Found', { status: 404 })` — never fall back to mock data.
2. **Lightweight Handle-Keyed UI Enrichment Cap (`< 5 KB`)**:
   - Prefer Shopify Admin Metaobjects and Metafields (`shopify-development`) for all structured product/editorial content.
   - If bespoke UI presentation hints (e.g., an icon slug or accent token per collection handle) must live in code temporarily, cap the entire map strictly under **`5 KB`** keyed by `handle`, and **never** include or override `id`, `title`, `price`, `compareAtPrice`, `availableForSale`, `variants`, `images`, or `seo`.
3. **Automated Live Storefront API Diff Verification**:
   Before signing off a storefront release, verify rendered routes against the live Storefront API endpoint (`https://<shop>.myshopify.com/api/2026-04/graphql.json` or `/api/2026-10/graphql.json`):
   - Confirm active product count, handles, variant GIDs, and localized `priceRange.minVariantPrice` match the rendered PDP/PLP HTML.
   - Confirm `menu(handle: "main-menu")`, `pages`, `blogs`, and `shop { privacyPolicy refundPolicy shippingPolicy termsOfService }` match Admin truth without hardcoded JSX overrides.
   - Fail CI if any route imports static catalog JSON:
     ```bash
     # Fast CI static guard against mock catalog imports in app/
     ! grep -rnE "from ['\"].*(mock|dummy|data/.*\.json)['\"]" app/
     ```

---

## 3. Real Cart, Checkout, Customer Account & Root Analytics Gates

### 1. Real Hydrogen Cart & Custom Checkout Domain (`checkout.<brand>`)

| Generation | Server Wiring | Client Mutation Pattern |
| --- | --- | --- |
| **Classic Hydrogen (`<= 2026.4.x`)** | `createCartHandler({ storefront, getCartId: cartGetIdDefault(request.headers), setCartId: cartSetIdDefault(), customMethods })` in `app/lib/context.ts` -> `context.cart` (`addLines`, `updateLines`, `removeLines`, `updateDiscountCodes`, `updateBuyerIdentity`) handled in `app/routes/cart.tsx` `action`. | `<CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{ lines }}>` |
| **Hydrogen `2026.10+`** | `createCartServerHandlers({ customerSession, fragment })` registered in pre-router `handleShopifyRoutes` (`/api/cart`). | `createCartComponents` (`<CartProvider initialData={initialCart}>`, `useCart`, `useCartForm`). |

**Non-Negotiable Cart & Checkout Bans**:
- **BAN `useState` / `localStorage` fake carts** and **BAN pre-populated dummy cart items**.
- **BAN hardcoded `https://<shop>.myshopify.com/cart/...` links**: They cause cross-domain `301` hops, break first-party cookie sharing, and expose raw `.myshopify.com` domains.
- **Enforce `cart.checkoutUrl` on `checkout.<brand>`**: Render `<a href={cart.checkoutUrl}>` (plain anchor, never client-router `<Link>`). Configure Shopify Domains so the primary root domain (`<brand>`, e.g. `brand.com`) routes to Oxygen and `checkout.<brand>` (e.g. `checkout.brand.com`) serves Shopify Online Store / Checkout (`PUBLIC_CHECKOUT_DOMAIN=checkout.brand.com`).

### 2. Real Customer Account API (`OAuth 2.0 + PKCE`)

- Classic Hydrogen: Wire `createCustomerAccountClient({ session: context.session, customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID, shopId: env.SHOP_ID, request })` on `context.customerAccount` and guard `/account*` loaders with `await context.customerAccount.handleAuthStatus()`.
- Hydrogen `2026.10+`: Wire `createCustomerAccountClient` + `createCustomerSession` + `createCustomerAccountServerHandlers` inside `handleShopifyRoutes`.
- **BAN dummy account screens**: Never ship hardcoded customer names, fake order tables, or mock address books on `/account*`.

### 3. Root Analytics & CSP Nonce Wiring (`root.tsx` + `entry.server.tsx`)

- **Classic Hydrogen (`<= 2026.4.x`)**:
  - In `app/entry.server.tsx`: call `createContentSecurityPolicy({ shop: { checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN, storeDomain: context.env.PUBLIC_STORE_DOMAIN } })` and pass `<NonceProvider>` + `Content-Security-Policy` header.
  - In `app/root.tsx`: read `const nonce = useNonce()`, return `shop: getShopAnalytics({ storefront: context.storefront, publicStorefrontId: context.env.PUBLIC_STOREFRONT_ID })` and `consent` from `loader`, and wrap `<Outlet />` in `<Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>`.
- **Hydrogen `2026.10+`**:
  - Render `<ShopifyScripts analytics={{ shop, i18n }} consent={consentConfig} nonce={nonce} />` + `useCartAnalytics()`.

---

## 4. Oxygen Runtime, Full-Page Cache Mastery, Codegen & Vite 8

### Diagnosing `oxygen-full-page-cache: uncacheable` (or `BYPASS`)

Inspect live response headers on anonymous public GET routes (`/`, `/collections/<handle>`, `/products/<handle>`):

```bash
curl -sSI https://<production-or-preview-url>/collections/<handle> | grep -iE 'cache-control|oxygen|set-cookie|age'
```

| Symptom in Headers | Root Cause | Exact Fix |
| --- | --- | --- |
| `oxygen-full-page-cache: uncacheable` **AND** `set-cookie: session=...` present on an anonymous `GET` | **`server.ts` commits the session unconditionally on every request!** Oxygen refuses to full-page-cache any response carrying `Set-Cookie` to prevent cross-buyer session leakage. | In Classic `server.ts`, guard cookie emission strictly behind `isPending`:<br>`if (appLoadContext.session.isPending) { response.headers.append('Set-Cookie', await appLoadContext.session.commit()); }`<br>In `2026.10+`, only emit `Set-Cookie` when `sessionManager` was mutated, then call `requestContext.applyResponseHeaders(response.headers)`. |
| `oxygen-full-page-cache: uncacheable` with **no** `Set-Cookie`, `cache-control: no-store` or `private` | A loader called `CacheNone()` / `Cache.none()`, read `customerAccount` in a way that triggered token refresh/private marking, or omitted public `Cache-Control` headers. | Use `storefront.CacheShort()` / `CacheLong()` (Classic) or `Cache.short()` / `Cache.long()` (`2026.10+`) on public catalog queries; keep personalized cart/account fetches on `/api/cart` or client/session boundaries that do not poison anonymous catalog HTML when full-page cache is targeted. |
| Headers (`Cache-Control`, `Set-Cookie`, `X-Robots-Tag`, `404` status) silently ignored or dropped | **Post-stream mutation pitfall**: With `renderToReadableStream`, HTTP status and headers flush with the initial shell before `<Suspense><Await>` promises resolve! | Resolve `404` checks, redirects, auth checks, and any `session.set()` mutations **before** returning from `loader`. Never mutate `session` or response headers inside deferred promises. Always `await body.allReady` when `isbot(request.headers.get('user-agent'))` is `true`. |

### Worker Cold-Start Profiling & Bundle Size Analysis

Oxygen runs on global V8 isolates with strict startup CPU and worker memory/size budgets:

1. **Bundle Size Audit (`server-bundle-analyzer.html`)**:
   - Build with bundle stats (`npx shopify hydrogen build --bundle-stats` on Classic, or inspect `dist/server/` + Rollup/Vite visualizer on `2026.10+`) and inspect `dist/server/server-bundle-analyzer.html`.
   - Hunt down and eliminate:
     - Static `data/*.json` files or embedded base64/SVG blobs (`build.assetsInlineLimit: 0` in `vite.config.ts` prevents asset inlining into the worker!).
     - Barrel-imported icon/animation libraries (`lucide-react`, `gsap`, `three`) accidentally imported without tree-shaking or SSR guards.
2. **Isolate Startup CPU Profile**:
   ```bash
   npx shopify hydrogen debug cpu --output startup.cpuprofile
   ```
   Inspect `startup.cpuprofile` in Chrome DevTools Performance panel to remove heavy module-scope initialization, regex compilation, or synchronous crypto/parsing at worker boot.

### GraphQL Codegen (`@shopify/hydrogen-codegen`) & React Router Typegen

1. **Classic Hydrogen (`<= 2026.4.x` + React Router 7)**:
   Configure `.graphqlrc.ts` with `@shopify/hydrogen-codegen` and `@graphql-codegen/cli`:
   ```ts
   // .graphqlrc.ts
   import type {IGraphQLConfig} from 'graphql-config';
   import {getSchema} from '@shopify/hydrogen-codegen';

   export default {
     projects: {
       default: {
         schema: getSchema('storefront'),
         documents: [
           './*.{ts,tsx,js,jsx}',
           './app/**/*.{ts,tsx,js,jsx}',
           '!./app/graphql/customer-account/*.{ts,tsx,js,jsx}',
         ],
       },
       customer: {
         schema: getSchema('customer-account'),
         documents: ['./app/graphql/customer-account/*.{ts,tsx,js,jsx}'],
       },
     },
   } satisfies IGraphQLConfig;
   ```
   Standard `package.json` scripts:
   ```json
   {
     "scripts": {
       "codegen": "shopify hydrogen codegen && react-router typegen",
       "typecheck": "shopify hydrogen codegen && react-router typegen && tsc --noEmit"
     }
   }
   ```
2. **Hydrogen `2026.10+`**:
   Uses `@shopify/hydrogen/ts-plugin` in `tsconfig.json` + `react-router typegen && tsc --noEmit && hydrogen gql check --fail-on-warn`.

### Vite 8 & MiniOxygen Environment Isolation (`envDir: false`)

In Vite 8 + `@shopify/mini-oxygen` projects, Vite's automatic `.env` loading can collide with MiniOxygen's worker `env` injection or expose host `.env` values to Vite plugins unexpectedly. Set `envDir: false` in `vite.config.ts` when MiniOxygen / `shopify hydrogen dev` manages worker bindings so `PRIVATE_STOREFRONT_API_TOKEN` and `SESSION_SECRET` remain strictly inside the server worker's `env` object and never leak into `dist/client`:

```ts
// vite.config.ts
import {defineConfig} from 'vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  envDir: false,
  plugins: [...oxygen({entry: './server.ts'}), reactRouter(), tsconfigPaths()],
  build: {
    assetsInlineLimit: 0,
  },
});
```
*(Note: On Classic Hydrogen `<= 2026.4.x`, keep `[hydrogen(), oxygen(), reactRouter(), tsconfigPaths()]` alongside `envDir: false` and `assetsInlineLimit: 0` when upgrading Vite.)*

---

## 5. Production GitHub Actions & Oxygen CI/CD Blueprint

Follow `github-actions` security invariants:
- **Pin every third-party action to a verified 40-character commit SHA** with the release tag in a comment (re-verify current SHAs upstream when creating/updating workflows).
- **Least-privilege `permissions`**: top-level `permissions: {}` and job-level `permissions: { contents: read, deployments: write }` only on the deploy job.
- **Do NOT use archived `Shopify/oxygenctl-action` or `Shopify/github-deployment-action`**. Invoke `npx shopify hydrogen deploy` directly.
- **CI `--env` Rejection Trap**: When authenticating with `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN`, `shopify hydrogen deploy` **rejects `--env <handle>`** in CI. Always pass `--env-branch <branch>` (or `SHOPIFY_HYDROGEN_ENVIRONMENT_BRANCH`).
- **Fork PR secret safety**: Never pass `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN` to untrusted public fork `pull_request` runs (`if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository`).

### Canonical `.github/workflows/oxygen-deployment.yml` Template

```yaml
name: Oxygen Deployment

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]

permissions: {}

concurrency:
  group: oxygen-${{ github.workflow }}-${{ github.ref }}
  # Cancel superseded PR preview runs; never cancel an in-flight production deploy on main
  cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}

jobs:
  verify:
    name: Static, Schema & Build Gates
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: read
    steps:
      # Replace <40-char-sha> with the verified commit SHA for the current action release
      - name: Checkout repository
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2 (re-verify latest SHA)

      - name: Setup Node.js 24
        uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0 (re-verify latest SHA)
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies cleanly
        run: npm ci

      - name: Guard against static mock catalog JSON in app/
        run: |
          if grep -rnE "from ['\"].*(mock|dummy|data/.*\.json)['\"]" app/; then
            echo "ERROR: Static mock JSON import detected in app/." >&2
            exit 1
          fi

      - name: Check standard Shopify routes & GraphQL types
        # Classic Hydrogen (<= 2026.4.x):
        run: |
          npx shopify hydrogen check routes
          npx shopify hydrogen codegen
          npx react-router typegen
          npx tsc --noEmit
        # For Hydrogen 2026.10+, replace the block above with:
        #   npx hydrogen skills check --mode=error
        #   npx react-router typegen
        #   npx tsc --noEmit
        #   npx hydrogen gql check --fail-on-warn

      - name: Production Oxygen build & lockfile check
        run: npx shopify hydrogen build --lockfile-check
        # For Hydrogen 2026.10+, use: npm run build

      - name: Verify zero secrets leaked into client bundle
        run: |
          if grep -rnE "shpat_|shpss_|PRIVATE_STOREFRONT_API_TOKEN" dist/client/; then
            echo "ERROR: Private token pattern found in dist/client!" >&2
            exit 1
          fi

  deploy-preview:
    name: Deploy Oxygen Preview
    needs: verify
    if: >-
      github.event_name == 'pull_request' &&
      github.event.pull_request.head.repo.full_name == github.repository
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: read
      deployments: write
    env:
      SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN: ${{ secrets.SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - name: Setup Node.js 24
        uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Oxygen Preview environment
        env:
          PR_BRANCH: ${{ github.head_ref }}
        run: |
          npx shopify hydrogen deploy \
            --preview \
            --env-branch "$PR_BRANCH" \
            --auth-bypass-token \
            --auth-bypass-token-duration 2 \
            --json-output

  deploy-production:
    name: Deploy Oxygen Production
    needs: verify
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    environment:
      name: production
    permissions:
      contents: read
      deployments: write
    env:
      SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN: ${{ secrets.SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2

      - name: Setup Node.js 24
        uses: actions/setup-node@53b83947a5a98c8d113130e565377fae1a50d02f # v6.3.0
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Oxygen Production environment
        run: |
          npx shopify hydrogen deploy \
            --env-branch main \
            --metadata-user "${{ github.actor }}" \
            --json-output
          # For Hydrogen 2026.10+, append: --assets-dir dist/client --worker-dir dist/server
```

### Branch Protection & Post-Deploy Release Verification

1. **GitHub Ruleset / Branch Protection on `main`**:
   - Require PR before merging, require the `Static, Schema & Build Gates` status check to pass, block force-pushes, and configure reviewer/branch restrictions on the `production` GitHub Environment.
2. **Secret Hygiene**:
   - Store `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN` in GitHub Secrets (scoped to repository or `production`/`preview` environments). Never hardcode deployment tokens in workflow YAML.
3. **Post-Deploy Live Smoke Probes**:
   - Read deployment URL from `h2_deploy_log.json` (or `--json` output).
   - Verify HTTP `200` on `/`, `/collections/<handle>`, `/products/<handle>`, `/pages/<handle>`, `/policies/privacy-policy`, and `/sitemap.xml`.
   - Verify `oxygen-full-page-cache` is **not** `uncacheable` on anonymous public catalog GETs (warm twice and confirm `HIT`).
   - Verify `/cart` and `/account*` return `Cache-Control: private, no-store` and `cart.checkoutUrl` resolves to `https://checkout.<brand>/...`.
