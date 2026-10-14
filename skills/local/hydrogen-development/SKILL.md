---
name: hydrogen-development
description: Build, migrate, debug, upgrade, or verify a Shopify Hydrogen storefront (React Router framework, Oxygen runtime). Not for generic headless architecture (headless-shopify), tracking-only work, Liquid themes, or UCP agentic-commerce integrations. Use for Storefront API integration, cart/session behavior, route data, caching, and storefront release evidence.
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

## Core Engineering Rules (Hydrogen `2026.10+`)

### 1. Request Context, Storefront Client & Privacy Headers

1. **Single `ShopifyRequestContext` per request**: Call `createShopifyRequestContext({ request, i18n: { country, language }, buyerIp })` once per request and reuse that instance across `createStorefrontClient`, `createCustomerAccountClient`, `handleShopifyRoutes`, and `cartHandlers.get()`. Creating a second context causes `handleShopifyRoutes()` to throw.
2. **Always forward `buyerIp` on `'private'` clients**: Extract `oxygen-buyer-ip`, `cf-connecting-ip`, or `x-forwarded-for` (fallback `'127.0.0.1'` in non-production) so Shopify rate-limits per buyer rather than throttling the server IP. Use `type: 'private_no_buyer_context'` only for module-scoped/build-time catalog reads with no buyer context, and `type: 'public'` (with no token) when testing against `mock.shop`.
3. **Never skip `requestContext.applyResponseHeaders(response.headers)`**: Call it on every normal response after committing `sessionManager`. It marks any response that sets cookies or uses the Customer Account client as `Cache-Control: private, no-store` and strips CDN caching headers (`Oxygen-Cache-Control`, `CDN-Cache-Control`, `Cloudflare-CDN-Cache-Control`, `Surrogate-Control`, `s-maxage`).

### 2. Pre-Router (`handleShopifyRoutes`) & Post-404 (`handleShopifyRedirects`) Gates

1. **Run `handleShopifyRoutes` before framework routing**:
   - It decides synchronously whether it owns the URL (`null` when unmatched; `Promise<Response>` when matched). Do not `await` before checking truthiness, and inside a `try/catch` use `if (shopifyRoute) return await shopifyRoute;`.
   - Delete competing route files for paths Hydrogen owns (`/api/cart`, `/api/predictive-search`, `/checkout`, `/cart/c/*`, `/cart/{id}:{qty}`, `/buy/{id}:{qty}`, `/discount/{code}`, `/cart.js`, `/account/login`, `/account/authorize`, `/account/refresh`, `/account/logout`), but **keep a catch-all route (`app/routes/$.tsx`)** in React Router 7 so root middleware runs on unmatched URLs.
   - Always pass `routeTemplates` (`createShopifyRouteTemplates`) so legacy Liquid `?variant=<numeric_id>` URLs on custom product routes `302`-redirect to canonical option query params.
2. **Run `handleShopifyRedirects` only on `404` responses**:
   - After `const response = await next()`, if `response.status === 404`, check `await handleShopifyRedirects({ request, storefrontClient, routeTemplates })`.

### 3. Observable Stores, Cart, Variant Picker & Collection Browser

1. **Stable store selectors**: `useCart`, `useProductForm`, `useCollection`, and `usePredictiveSearch` compare selector output by reference. Never allocate a new object/array inside a selector; select existing store slices (`state.data.lines.nodes`, `state.errors`, `state.pending.lines`) and derive view models in the component body.
2. **Cart hydration & single-concern mutations**:
   - Hydrate `<CartProvider initialData={initialCart}>` from `await cartHandlers.get({ storefrontClient, request, sessionManager, requestContext })` in the root loader (`{ cart, errors? }` envelope) and render all cart UI from `useCart((s) => s.data)`. Never pass a deferred root `cart` promise to `<Await>`.
   - `/api/cart` rejects combined JSON payloads: send only one mutation kind per POST (`lines`, `discountCodes`, `attributes`, or `note`).
   - Disable line item controls **only** when `line.id.startsWith('optimistic:')`, never for all `state.pending.lines`.
   - Build the Cart Drawer with native `<dialog closedby="any">` + `.showModal()`, CSS `html:has(dialog[open]) { overflow: hidden }`, pre-hydration `<a href="/cart">` trigger, auto-open on `state.pending.lines.size > 0`, and `window.Shopify.actions.openCart.configure()`.
   - Read cart metafields via `createCartServerHandlers({ fragment })`; write them through an app-owned `createShopifyRouteHandler('/api/cart/metafields', 'POST', ...)` route that checks `getCartId(request)` without creating a cart, runs `cartMetafieldsSet` / `cartMetafieldDelete`, and calls `await useCartActions().refresh()`.
3. **Symmetric Variant Picker (`encodedVariantExistence` / `encodedVariantAvailability`)**:
   - Hide the entire option picker when `product.options.every((o) => o.values.length <= 1)`.
   - Render `exists: false` as `<button type="button" disabled>`, keep sold-out (`exists: true, available: false`) as an interactive `<a href>` link with `"Sold out"` styling, and never hide option values based on the current selection.
   - Support **Combined Listings** (`value.handle !== product.handle`) with cross-product links preserving non-option search params via `buildProductSelectionSearchParams()`.
4. **Collection & Search Browser**:
   - Use Liquid-compatible URL params via `parseCollectionParams(request.url)` (`filter.v.*`, `sort_by`, `cursor`, `direction`), explicit `<form method="get" action={pathname}>`, and 350ms debounced price inputs prefixed with `formatMoney(..., { locale }).currencyNarrowSymbol`.

### 4. Online Store 2.0 (Theme 2.0) Dynamic Sections in Hydrogen

- Hydrogen replaces Liquid `templates/*.json` + `sections/*.liquid` with **Metaobject-driven Dynamic Content Sections** (`Route` metaobject -> `sections` reference list -> inline-fragment GraphQL query -> `<Sections>` React switch dispatcher + dev/preview `<EditRoute>` deep link to Shopify Admin).
- Follow [`references/dynamic-pages-architecture.md`](references/dynamic-pages-architecture.md) for the complete `ROUTE_CONTENT_QUERY`, `SECTIONS_FRAGMENT`, Rich Text AST rendering, and caching patterns across both Hydrogen `2026.10+` and Classic Hydrogen.

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
