---
name: hydrogen-development
description: >-
  Build, link, debug, upgrade, or deploy a Shopify Hydrogen storefront on Oxygen (React Router 7): live Storefront API, cart/account/session, full-page cache, GitHub CI/CD. Not store/theme CLI (shopify-development), headless architecture (headless-shopify), or tracking.
---

# Shopify Hydrogen & Oxygen Development

Use this skill when discovering, linking, implementing, debugging, migrating, auditing, or deploying a **Shopify Hydrogen storefront on Oxygen** across both **Hydrogen `2026.10+` (npm `latest` `2026.10.3` on 2026-11-11)** and **Classic Hydrogen (`<= 2026.4.7`, React Router 7 / Remix framework mode)**.

## Role & Specialist Boundaries

- **This skill (`hydrogen-development`)**: Owns Hydrogen storefront discovery/linking (`shopify hydrogen list/link/env`), server request context and handlers, live Storefront & Customer Account GraphQL integration, real cart/checkout/account/analytics gates, Metaobject Dynamic Sections, Oxygen worker & full-page cache tuning, GraphQL codegen, Vite 8 (`envDir: false`), and GitHub -> Oxygen CI/CD workflows.
- **Not this skill**:
  - Store diagnostics (`shopify store info/list/auth/execute/bulk`), HTTP 402 frozen stores, Admin GraphQL catalog/CMS/policy sync, or Liquid `shopify theme *` CLI -> `shopify-development`
  - Deciding whether headless is justified, primary (`<brand>`) vs checkout (`checkout.<brand>`) domain architecture, or cross-system token boundaries -> `headless-shopify`
  - Consent-aware analytics, Web Pixels, CAPI/sGTM attribution, and purchase webhook deduplication -> `hydrogen-headless-tracking` (paired with `meta-ads-signal-engine`, `google-ads-signal-engine`, `tiktok-ads-signal-engine`)
  - Cross-repo GitHub Actions threat modeling, reusable workflows, and runner security -> `github-actions`
  - Liquid themes or generic storefront HTML baseline -> `storefront-development`; buyer journeys -> `storefront-ux`; SEO -> `seo-website-builder`; AppSec -> `application-security`; CWV -> `web-perf`; browser proof -> `ui-validation`

---

Read this file first; open only the reference the routing table names.

## Step 0: Storefront Discovery, Linking & Generation Check

### 1. Storefront Discovery & Linking (`*.myshopify.com`)

When asked to pull, sync, or connect a Hydrogen storefront for `<shop>.myshopify.com`:

1. **Never run `shopify theme pull`** — that pulls the Online Store Liquid theme (often dormant Dawn or `hydrogen-redirect-theme`), not the Hydrogen app!
2. **Two CLIs:** inside a repo, `npx shopify` runs the project-pinned `@shopify/cli` (often `3.x`: no `--json` on `hydrogen list`/`env list`, no `--shop` on `link`); bare `shopify` is the global `5.x`. Check both `version`s; use global `shopify` for discovery/link JSON, `npx shopify` for `build`/`codegen`/`debug cpu`.
3. `hydrogen list` only runs inside a Hydrogen project (or `--path`). Find the repo first (`.github/workflows/oxygen-deployment-<storefrontId>.yml`, `gh repo list`), clone, then `shopify hydrogen link --shop <shop>.myshopify.com --storefront "<Name>"` -> `shopify hydrogen list --json` (GIDs, production URL, deployed commit) -> `env list --json` -> `env pull -f` (never read/print `.env*`; ignore `.env*`, `.shopify/`, `dist/`, `.react-router/`).

### 2. Detect the Hydrogen Generation (`package.json`)

| Signal | Hydrogen `2026.10+` (`latest`: `2026.10.3`) | Classic Hydrogen (`<= 2026.4.7`) |
| --- | --- | --- |
| Architecture | **Framework-agnostic storefront toolkit & server-handler library** added to React Router 7 (`future.v8_middleware: true`), Next.js, Astro, Nuxt, or SvelteKit. | **React Router 7 / Remix framework** where Hydrogen owns `createHydrogenContext()` in `server.ts` and the `hydrogen()` Vite plugin. |
| Server & GraphQL | `createShopifyRequestContext` + `createStorefrontClient` + `handleShopifyRoutes` + `handleShopifyRedirects` + `applyResponseHeaders`; `storefrontClient.graphql(gql(...))`, `@shopify/hydrogen/ts-plugin`, `hydrogen gql check --fail-on-warn`, `Cache.short()`/`Cache.long()`. | `createHydrogenContext()` (`context.storefront`, `context.cart`, `context.customerAccount`); `context.storefront.query(#graphql...)`, `@shopify/hydrogen-codegen` (`.graphqlrc.ts` -> `storefrontapi.generated.d.ts`), `CacheShort()`/`CacheLong()`. |
| Cart, Account & Analytics | `createCartServerHandlers` (`/api/cart`) + `createCartComponents`, `createCustomerAccountServerHandlers`, `<ShopifyScripts />` + `useCartAnalytics()`. | `createCartHandler` (`context.cart` + `/cart` action + `<CartForm>`), `context.customerAccount`, `<Analytics.Provider>` + `getShopAnalytics()` + `useNonce()`. |
| Build & Deploy | `react-router build` (`buildDirectory: 'dist'`), `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server`. | `shopify hydrogen check routes`, `shopify hydrogen codegen`, `shopify hydrogen build`, `shopify hydrogen deploy`. |

- **SemVer Caret Trap (`^2026.4.0` vs `~2026.4.0`)**: Both lines share CalVer major `2026`. Pin Classic storefronts with `"~2026.4.0"` or exact `"2026.4.7"` so fresh installs do not resolve `2026.10.x` and break the build.

---

## Mandatory Production Authenticity & Oxygen Gates

### 1. Anti-Mock / Live Storefront API Sync Gate

- **BAN static mock JSON (`data/*.json`, `mockProducts`, hardcoded catalogs/pages/policies)** in production loaders: it bloats the Oxygen worker (300 KB+, slower cold start), and hardcoded prices, availability, or stale `ProductVariant` GIDs desync PDP/PLP from Checkout.
- Query live Storefront API at runtime (`context.storefront.query` / `storefrontClient.graphql`) with `@inContext(country: $country, language: $language)`. Return HTTP `404` when a handle resolves to `null`.
- Allow at most a **`< 5 KB` handle-keyed UI enrichment map** for non-commerce presentation hints not yet in Metaobjects, never overriding `id`, `title`, `price`, `compareAtPrice`, `availableForSale`, `variants`, or `seo`.
- Before release, diff rendered routes against the live Storefront API (`/api/<pinned-version>/graphql.json`).

### 2. Real Cart, Checkout (`checkout.<brand>`), Customer Account & Analytics Gates

- **Real Hydrogen Cart & Checkout**:
  - Enforce `createCartHandler` / `context.cart` (`addLines`, `updateLines`, `removeLines`) in Classic or `createCartServerHandlers` + `createCartComponents` in `2026.10+`.
  - **BAN** `useState`/`localStorage` fake carts, **BAN** pre-populated dummy cart items, and **BAN** hardcoded `https://<shop>.myshopify.com/cart/...` URLs (causes 301 hops and cookie loss).
  - Always hand off via `<a href={cart.checkoutUrl}>` resolving to the custom checkout subdomain (`checkout.<brand>`, matching `PUBLIC_CHECKOUT_DOMAIN`).
- **Real Customer Accounts (`OAuth 2.0 + PKCE`)**:
  - Enforce `context.customerAccount` (Classic) or `createCustomerAccountServerHandlers` (`2026.10+`) on `/account*`. **BAN** dummy customer profiles, fake order history, or mock login forms.
- **Root Analytics & CSP Nonce**:
  - Classic: Enforce `<Analytics.Provider>` + `getShopAnalytics` + `useNonce()` in `app/root.tsx` paired with `createContentSecurityPolicy` in `app/entry.server.tsx`.
  - `2026.10+`: Enforce `<ShopifyScripts>` + `useCartAnalytics()` + CSP nonce.

### 3. Oxygen Runtime, Full-Page Cache, Codegen & Vite 8

- **Prevent `oxygen-full-page-cache: uncacheable` on public GETs**:
  - Oxygen caches a page only with `Oxygen-Cache-Control: public, max-age>0`, a non-`*` `Vary`, and **no** `Set-Cookie` (incl. `_shopify_*` consent cookies); plain `Cache-Control` is not enough. Pair with `CacheShort()`/`CacheLong()`.
  - Commit the session only when changed: Classic `if (context.session.isPending)`; `2026.10+` only when mutated, then `requestContext.applyResponseHeaders(response.headers)`.
  - Resolve 404s, redirects, auth checks, and cookie mutations **before** `renderToReadableStream` flushes headers, and `await body.allReady` for `isbot`.
- **Bundle, CPU & Vite 8 Hygiene**:
  - Keep `build.assetsInlineLimit: 0` (official template; strict CSP, no base64 in the worker). Set `envDir: false` when the CLI warns `envFile option is deprecated` (Classic + Vite 8); client exposure is still only `VITE_`-prefixed vars, so keep secrets unprefixed.
  - When cold start or worker size grows: `dist/server/server-bundle-analyzer.html`, `npx shopify hydrogen debug cpu` (`startup.cpuprofile`).
  - Run GraphQL codegen (`@shopify/hydrogen-codegen` + `@graphql-codegen/cli` + `.graphqlrc.ts` -> `shopify hydrogen codegen && react-router typegen`) or `hydrogen gql check --fail-on-warn` (`2026.10+`).

### 4. GitHub & Oxygen CI/CD Recommendations

- Follow [`references/oxygen-runtime-and-cicd.md`](references/oxygen-runtime-and-cicd.md) §5 for `.github/workflows/oxygen-deployment-*.yml` (the generated one deploys every push with no gate): SHA-pinned actions, `permissions: { contents: read, deployments: write }`, concurrency (`cancel-in-progress` on PRs only), a `verify` job (routes, codegen, typegen, `tsc`, build, anti-mock & secret-leak checks), CI `--env-branch` (shopify.dev: CI rejects `--env`; CLI 5's local `--env-branch is deprecated` warning does not apply to CI), never archived `oxygenctl-action`, and `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN` secret protection. Pushing workflow files over HTTPS needs a token with `workflow` scope (`gh auth refresh -s workflow`); never drop the workflow change to get a push through.

---

## Reference Routing Table

| Task / Domain | Reference File |
| --- | --- |
| Storefront discovery/linking, anti-mock live Storefront API gate, real cart/checkout/account gates, `oxygen-full-page-cache: uncacheable` fixes, `.graphqlrc.ts`, Vite 8 `envDir: false`, worker profiling, and GitHub -> Oxygen CI/CD YAML | [`references/oxygen-runtime-and-cicd.md`](references/oxygen-runtime-and-cicd.md) |
| Hydrogen `2026.10+` entry points, request handlers, `gql()` types, observable stores, cart drawer/metafields, variant picker, collection browser, Customer Accounts, `configureLogging` | [`references/hydrogen-2026-10-architecture.md`](references/hydrogen-2026-10-architecture.md) |
| Canonical Oxygen React Router 7 template (`entry.server.tsx`, `ssr.optimizeDeps.include`, `resolveShopIdentity`), Next.js 16+ & Astro 6 wiring, and Classic -> `2026.10` migration traps | [`references/new-storefront-start.md`](references/new-storefront-start.md) |
| Online Store 2.0 Metaobject Section CMS (`RouteContent`, `Sections`, Rich Text AST) and dynamic page contracts | [`references/dynamic-pages-architecture.md`](references/dynamic-pages-architecture.md) |
| Markets (`@inContext`), Customer Account `2026-10` schema, Online Store coexistence, Bundles, Combined Listings, Subscriptions, B2B | [`references/commerce-platform-boundaries.md`](references/commerce-platform-boundaries.md) |
| SEO metadata, custom sitemaps, `Shopify/hydrogen-redirect-theme`, and Playwright E2E smoke-test gate | [`references/seo-environments-launch.md`](references/seo-environments-launch.md) |
| Verified `2026-10-14` package snapshot, 20 packaged skills, `github.com/Shopify` repo map, and `@shopify/dev-mcp` workflow | [`references/official-integrations.md`](references/official-integrations.md) |

---

## Verification & Release Gate

1. **Routes, Codegen & Typecheck**:
   - Classic (`<= 2026.4.x`): `npx shopify hydrogen check routes && npx shopify hydrogen codegen && npx react-router typegen && npx tsc --noEmit`
   - `2026.10+`: `npx hydrogen skills check --mode=warn && npx react-router typegen && npx tsc --noEmit && npx hydrogen gql check --fail-on-warn`
2. **Production Build & Bundle/Mock Audit**: `npx shopify hydrogen build --lockfile-check` (or `npm run build`), zero `data/*.json` mock imports in `app/`, zero private tokens in `dist/client`.
3. **Browser & Cache Proof (`ui-validation`)**: Mobile (`390x844`) + desktop (`1440x900`) with zero `console.error`/`pageerror`, live Storefront API price/variant parity, real cart + `cart.checkoutUrl` (`checkout.<brand>`), and `oxygen-full-page-cache` cacheability on anonymous catalog GETs.
4. **Live Deployment Gate**: Obtain explicit user approval before running `shopify hydrogen deploy`, modifying Oxygen env vars, or mutating live store data.
