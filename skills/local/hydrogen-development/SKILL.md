---
name: hydrogen-development
description: >-
  Build, migrate, debug, upgrade, or verify a Shopify Hydrogen storefront (React Router, Oxygen): Storefront API, cart/session, route data, caching, release evidence. Not headless architecture (headless-shopify), tracking, Liquid, or UCP.
---

# Shopify Hydrogen Development

Use this skill when implementing, debugging, migrating, or reviewing code in a **Shopify Hydrogen storefront**.

## Role & Specialist Boundaries

- **This skill (`hydrogen-development`)**: Owns Hydrogen code across both **Hydrogen `2026.10+` (`@shopify/hydrogen@2026.10.1`, current `latest`)** and **Classic Hydrogen (`<= 2026.4.7`, labeled Legacy Hydrogen on `shopify.dev`)**: server request context and handlers, Storefront & Customer Account GraphQL clients (`gql()`), observable stores (cart, variant form, collection browser, predictive search), Online Store 2.0 (Theme 2.0) parity via Metaobject Dynamic Content Sections, Oxygen worker configuration, caching, and migration (`migrate-to-hydrogen-2026-10`).
- **Not this skill**:
  - Deciding whether headless is justified or designing multi-system boundaries -> `headless-shopify`
  - Consent-aware analytics/pixel/CAPI/sGTM signal pipelines -> `hydrogen-headless-tracking` (paired with `meta-ads-signal-engine`, `google-ads-signal-engine`, `tiktok-ads-signal-engine`)
  - Liquid themes (`sections/*.liquid`, `blocks/*.liquid`) or non-Hydrogen storefronts -> `storefront-development`
  - Commerce journey/state UX contracts -> `storefront-ux`; technical SEO -> `seo-website-builder`; security review -> `application-security`; Core Web Vitals -> `web-perf`; browser proof -> `ui-validation`

---

Read only this file up front; open the reference the routing table names.

**Pick the path first:**
- Any change → Step 0 (generation) first; a wrong generation invalidates
  every API name below.
- Bug/feature in an existing storefront → Step 0 → the one rule group and
  reference row that matches → Verification.
- New storefront or Classic → `2026.10` migration → Step 0 →
  `references/new-storefront-start.md` → Verification.

## Step 0: Detect the Hydrogen Generation First

Before writing or editing code, inspect `package.json` (`@shopify/hydrogen` version, framework packages, and scripts):

| Signal | Hydrogen `2026.10+` (`latest`: `2026.10.1`) | Classic Hydrogen (`<= 2026.4.7`) |
| --- | --- | --- |
| Mental model | **Framework-agnostic storefront toolkit & server-handler library** added to React Router 7 (`future.v8_middleware: true`), Next.js App Router, Astro, Nuxt, SvelteKit, or SolidStart. | **React Router 7 / Remix framework** where Hydrogen owns `createHydrogenContext()` in `server.ts` and the `hydrogen()` Vite plugin. |
| Server wiring | `createShopifyRequestContext` + `createStorefrontClient({ type: 'private', requestContext, config })` + pre-router `handleShopifyRoutes()` + post-404 `handleShopifyRedirects()` + `requestContext.applyResponseHeaders(response.headers)`. | `createHydrogenContext()` in `server.ts` passing `context.storefront`, `context.cart`, and `context.customerAccount` into loaders/actions. |
| GraphQL & types | `storefrontClient.graphql(gql(...))`, `@shopify/hydrogen/ts-plugin`, `hydrogen gql check --fail-on-warn`, `Cache.long()` / `Cache.short()` / `Cache.none()`. | `context.storefront.query(#graphql...)`, `shopify hydrogen codegen` (`storefrontapi.generated.d.ts`), `CacheLong()` / `CacheShort()` / `CacheNone()`. |
| Cart & UI state | Observable stores (`createCartServerHandlers` at `/api/cart` + `createCartComponents`, `createProductComponents`, `CollectionProvider`, `PredictiveSearchProvider`), `formatMoney()`, native `<img>` + CDN `width`/`height`/`crop` params, `<ShopPayButton>` custom element. | `context.cart` + `/cart` route action + `<CartForm>`, `<VariantSelector>` / `getProductOptions`, `<Pagination>`, `<Money>`, `<Image>`, `<RichText>`. |
| Analytics | `<ShopifyScripts />` + `window.Shopify.analytics.publish()` + `analytics.addDestination({ name, setup({ subscribe }) })` + `useCartAnalytics()`. | `<Analytics.Provider>` + `useAnalytics()` + `<Analytics.ProductView>` + `getShopAnalytics()`. |
| Build & CLI | `hydrogen skills check --mode=warn && vite dev`, `react-router build` (`buildDirectory: 'dist'`), `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server`. | `shopify hydrogen dev`, `shopify hydrogen build`, `shopify hydrogen deploy`. |

- **SemVer Caret Trap (`^2026.4.0` vs `~2026.4.0`)**: Because both `2026.4.x` (Classic) and `2026.10.x` (new toolkit) share CalVer major `2026` and `2026.10.1` is npm `latest`, `"@shopify/hydrogen": "^2026.4.0"` in a Classic storefront resolves to `2026.10.x` on fresh install and breaks the build. Classic storefronts that have not migrated yet must pin with a tilde range (`"~2026.4.0"`) or exact `"2026.4.7"`.
- Read [`references/hydrogen-2026-10-architecture.md`](references/hydrogen-2026-10-architecture.md) for all `2026.10+` APIs and the 20 packaged skills in `@shopify/hydrogen/skills/*`. If scaffolding or migrating from `<= 2026.4.x` to `2026.10`, read [`references/new-storefront-start.md`](references/new-storefront-start.md) and `https://shopify.dev/docs/storefronts/hydrogen/migrate`.

---

## Core rules (Hydrogen `2026.10+`)

The four rule groups — one `ShopifyRequestContext` per request with
`buyerIp` and `applyResponseHeaders` on every response; `handleShopifyRoutes`
before framework routing and `handleShopifyRedirects` only on 404; stable
store selectors, single-concern `/api/cart` mutations, the symmetric variant
picker, Liquid-compatible collection params; Metaobject-driven dynamic
sections — live in `references/hydrogen-2026-10-architecture.md` § Core
engineering rules. Open the group the change touches.

---

## Reference Routing Table

Load only the reference file needed for the active task:

| Task / Domain | Reference File |
| --- | --- |
| Hydrogen `2026.10+` entry points, request handlers, `gql()` branded types, observable stores, cart/drawer/metafields, variant picker, collection browser, Customer Accounts (`__Host-session`), `configureLogging` | [`references/hydrogen-2026-10-architecture.md`](references/hydrogen-2026-10-architecture.md) |
| Verified `2026-10-14` package snapshot, 20 packaged skills + 3 upstream repo skills in `Shopify/hydrogen`, `github.com/Shopify` repository map, `shopify.dev` URLs, and `@shopify/dev-mcp` workflow | [`references/official-integrations.md`](references/official-integrations.md) |
| Online Store 2.0 Metaobject Section CMS (`RouteContent`, `Sections`, Rich Text AST) and dynamic page contracts (home, PLP, PDP, cart, account) | [`references/dynamic-pages-architecture.md`](references/dynamic-pages-architecture.md) |
| Canonical Oxygen React Router 7 template (`entry.server.tsx`, `ssr.optimizeDeps.include`, `resolveShopIdentity`), Next.js 16+ (`proxy.ts`) & Astro 6 wiring, and Classic -> `2026.10` migration traps | [`references/new-storefront-start.md`](references/new-storefront-start.md) |
| Markets (`@inContext`), Customer Account `2026-10` schema (`countryCode`), Online Store 2.0 coexistence, Bundles, Combined Listings, Subscriptions, B2B | [`references/commerce-platform-boundaries.md`](references/commerce-platform-boundaries.md) |
| SEO metadata, custom sitemaps, `Cache.*` & `applyResponseHeaders` privacy rules, Oxygen deploy, `Shopify/hydrogen-redirect-theme`, and Playwright E2E smoke-test gate | [`references/seo-environments-launch.md`](references/seo-environments-launch.md) |

---

## Verification & Release Gate

Never claim a Hydrogen change works without running:

1. **Packaged skills & GraphQL schema check (`2026.10+`)**:
   - `npx hydrogen skills check --mode=warn`
   - `npm run typecheck` (`react-router typegen && tsc && hydrogen gql check --fail-on-warn`)
   - Classic Hydrogen (`<= 2026.4.x`): `npx shopify hydrogen codegen && npm run typecheck`
2. **Production build check**:
   - `npm run build` (`react-router build` outputting `dist/client` and `dist/server`)
3. **Browser smoke evidence (`ui-validation` / `hydrogen-smoke-test`)**:
   - Verify affected routes at mobile (`390x844`) and desktop (`1440x900`) viewports with zero `console.error` / `pageerror`: variant option switching (`replace: true`), cart drawer open/update/remove, collection filtering/sorting, and `checkoutUrl` handoff.
4. **Live deployment gate**:
   - Stop and ask for explicit approval before running `shopify hydrogen deploy`, changing Oxygen environment variables, or mutating live store Metaobjects/Metafields.
