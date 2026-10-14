# Hydrogen 2026-10 Architecture & Packaged Skills Reference

Last verified against `@shopify/hydrogen@2026.10.1` (`latest` on npm), `https://shopify.dev/docs/storefronts/hydrogen`, and `https://shopify.dev/docs/storefronts/hydrogen/migrate` on `2026-10-14`.

Starting with `2026.10.0` (promoted to npm `latest` in October 2026; `2026.4.x` is now labeled **Legacy Hydrogen** on `shopify.dev`), `@shopify/hydrogen` is a **framework-agnostic storefront toolkit and server-handler library** rather than a framework wrapper that owns your server entry and build. Your framework (React Router 7 with `future.v8_middleware: true`, Next.js App Router, Astro, Nuxt, SvelteKit, or SolidStart) owns routing, rendering, and builds; Hydrogen provides per-request context, Storefront/Customer Account GraphQL clients, pre-router and post-404 request handlers, observable client stores, and Shopify Standard Actions.

---

## 1. Package Entry Points & Tooling Surface

| Entry Point | Exports & Responsibility |
| --- | --- |
| `@shopify/hydrogen` | Framework-agnostic core: `createShopifyRequestContext`, `createStorefrontClient`, `gql`, `Cache`, `handleShopifyRoutes`, `handleShopifyRedirects`, `createShopifyRouteTemplates`, `createShopifyRouteHandler`, `createCartServerHandlers`, `createCartStore`, `createCartFormRegister`, `createProductFormStore`, `createProductFormRegister`, `canAddToCart`, `buildProductSelectionSearchParams`, `createCollectionStore`, `parseCollectionParams`, `serializeCollectionParams`, `getFilterRemovalUrl`, `getSortByValue`, `createPredictiveSearchServerHandlers`, `createPredictiveSearchStore`, `formatMoney`, `flattenConnection`, `getSelectedProductOptions`, `getSelectedVariant`, `createShopPayButton`, `renderShopPayButton`, `defineShopPayButton`, `initializeShopifyScripts`, `getShopifyScriptTags`, `renderShopifyScriptTags`, `trackCartAnalytics`, `configureLogging`. |
| `@shopify/hydrogen/react` | React bindings (client components; add `'use client'` in Next.js): `createCartComponents`, `createProductComponents`, `useProductForm`, `CollectionProvider`, `useCollection`, `useCollectionActions`, `useCollectionForm`, `PredictiveSearchProvider`, `usePredictiveSearch`, `usePredictiveSearchActions`, `usePredictiveSearchForm`, `ShopifyScripts`, `ShopPayButton`, `useCartAnalytics`. |
| `@shopify/hydrogen/vue` | Vue 3.5+ bindings with identical component/composable surface (`useCart` returns a read-only ref). |
| `@shopify/hydrogen/customer-account` | `createCustomerAccountClient`, `createCustomerAccountServerHandlers`, `createCustomerSession`, Customer Account `gql`, `CUSTOMER_ACCOUNT_LOGIN_PATH` (`/account/login`), `CUSTOMER_ACCOUNT_AUTHORIZE_PATH` (`/account/authorize`), `CUSTOMER_ACCOUNT_REFRESH_PATH` (`/account/refresh`), `CUSTOMER_ACCOUNT_LOGOUT_PATH` (`/account/logout`), and error classes (`CustomerAccountApiError`, `CustomerAccountAuthenticationError`, `CustomerAccountOAuthError`, `CustomerAccountTimeoutError`). |
| `@shopify/hydrogen/vite` | `localHttps({ enabled })`, `provisionLocalHttps()`, `LOCAL_HTTPS_DEFAULTS` for trusted local HTTPS on `https://local.tryhydrogen.dev`. |
| `@shopify/hydrogen/ts-plugin` | TypeScript language service plugin (`{"name": "@shopify/hydrogen/ts-plugin"}`) validating `gql()` queries against bundled `./storefront.schema.json` and `./customer-account.schema.json`. |
| `@shopify/hydrogen/storefront-api-types` & `@shopify/hydrogen/customer-account-api-types` | Bundled TypeScript schema types for Storefront API (`2026-10`) and Customer Account API (`2026-10`). |

### Two Distinct CLIs (`npx hydrogen` vs `npx shopify hydrogen`)

Hydrogen `2026-10+` splits CLI responsibilities between the `@shopify/hydrogen` package binary and the Shopify CLI (`@shopify/cli >= 4.8.0` bundling `@shopify/cli-hydrogen >= 13.0.4`):

1. **`@shopify/hydrogen` Package CLI (`npx @shopify/hydrogen <cmd>` / `npx hydrogen <cmd>`)**:
   - `setup`: Installs `@shopify/hydrogen` (detecting the lockfile's package manager) and syncs version-matched agent instructions into `.claude` and `.agents` without modifying application code.
   - `skills sync` / `skills check --mode=warn|error`: Syncs or validates the 20 packaged skills in `@shopify/hydrogen/skills/*`.
   - `gql check [--fail-on-warn]`: Validates all Storefront and Customer Account `gql()` queries against bundled schemas (`tsc` alone does **not** catch invalid GraphQL fields inside `gql()`).
   - `certs install` / `certs uninstall`: Installs or removes the local mkcert CA and TLS certificates for `https://local.tryhydrogen.dev`.
2. **Shopify CLI Hydrogen Commands (`npx shopify hydrogen <cmd>` — `https://shopify.dev/docs/api/shopify-cli/hydrogen`)**:
   - **Supported in Hydrogen `2026-10` (10 commands)**:
     - `customer-account-push`: Pushes Customer Account API OAuth URLs to Shopify Admin (`--dev-origin <url>`, `--javascript-origin <url>` which **must not include a port** because Shopify rejects origins with ports, `--relative-redirect-uri` default `'/account/authorize'`, `--relative-logout-uri`, `--storefront-id gid://shopify/HydrogenStorefront/...`). Automatically invoked on `vite dev` startup by the `localHttps` Vite plugin (requires `@shopify/cli-hydrogen >= 13.0.4`, bundled in `@shopify/cli >= 4.8.0`).
     - `deploy`: Builds and deploys to Oxygen (`--assets-dir`, `--worker-dir`, `--entry`, `--build-command`, `--preview`, `--env`, `--env-branch`, `--auth-bypass-token`, `--auth-bypass-token-duration <hours>` up to `12` default `2`).
     - `env list`, `env pull` (pulls `.env` leaving secret values empty), `env push` (`--dry-run`, `--env`, `--env-file`, `--force`).
     - `link` (`--storefront`, `--create-storefront`, `--name`, `--shop`), `unlink`, `list`, `login`, `logout`.
   - **Blocked / Legacy-Only in `2026-10` (15 commands — `@shopify/cli-hydrogen >= 13.0.1` stops with an error when `@shopify/hydrogen` `2026-10+` is installed)**:
     - `shopify hydrogen init` (**TRAP**: creates a Legacy `2026-04` project! Never run `shopify hydrogen init` for `2026-10`—use the React Router Oxygen template, Vercel Shop, or `npx @shopify/hydrogen@latest setup` on a framework starter), `build`, `check`, `codegen`, `debug cpu`, `dev`, `generate route`, `generate routes`, `preview`, `setup`, `setup css`, `setup markets`, `setup vite`, `shortcut`, `upgrade`.

---

## 2. Per-Request Context & Storefront Client (`hydrogen-storefront-client`, `hydrogen-request-handlers`)

### Request Context Invariants

1. **Create once per request**: Call `createShopifyRequestContext({ request, i18n: { country, language }, buyerIp })` once per incoming request. Share that exact `requestContext` across `createStorefrontClient`, `createCustomerAccountClient`, `handleShopifyRoutes`, and `cartHandlers.get()`. Creating a second `requestContext` causes `handleShopifyRoutes()` to throw.
2. **Apply response headers on every normal response**: Always call `requestContext.applyResponseHeaders(response.headers)` before returning a framework response (after committing `sessionManager.commit?.()`). Whenever `Set-Cookie` is present or the Customer Account client ran, `applyResponseHeaders` forces `Cache-Control: private, no-store` and strips CDN cache headers (`Oxygen-Cache-Control`, `CDN-Cache-Control`, `Cloudflare-CDN-Cache-Control`, `Surrogate-Control`, `s-maxage`) to prevent cross-buyer session/cart leakage.

### Storefront Client Types

| `type` | Token & `buyerIp` | Use Case |
| --- | --- | --- |
| `'private'` | Requires `privateStorefrontToken` (`shpat_...`) and a real `buyerIp` on `requestContext` | **Production default** for SSR loaders/actions. Sends `Shopify-Storefront-Buyer-IP` and forwards `_shopify_y` / `_shopify_s` cookies so Shopify rate-limits per buyer rather than throttling your server IP. |
| `'private_no_buyer_context'` | Requires `privateStorefrontToken`; `requestContext` optional (`buyerIp` must be omitted) | Background jobs, build-time SSG (`export const prerender = true`), sitemaps, or shared catalog reads at module scope with no buyer session. |
| `'public'` | Optional `publicStorefrontToken` (omit token for `mock.shop`) | Public token storefronts or `mock.shop` testing (`mock.shop` rejects private tokens and empty-string `PUBLIC_STOREFRONT_API_TOKEN=""`). |

### Typed GraphQL (`gql()`) & Structural Prop Typing Rules

- Wrap Storefront queries in `gql()` from `@shopify/hydrogen` and Customer Account queries in `gql()` from `@shopify/hydrogen/customer-account`.
- Pass child fragments in the second array argument: `gql(`query Product($handle: String!) { product(handle: $handle) { ...MoneyProduct } }`, [MoneyProductFragment])`.
- Execute queries via `await storefrontClient.graphql(QUERY, { variables, cache: Cache.long() })` (replaces Classic `context.storefront.query()` and `CacheLong()`).
- **Branded query string (`StorefrontQueryString`), not `gql.tada` `FragmentOf`**: `gql()` returns a branded query string, not a `gql.tada` document. `FragmentOf<typeof MyFragment>` does **not** work—always derive component prop types by indexing into the parent query result (`NonNullable<ProductQuery['product']>`) or narrowing union results (`search.nodes`, `metaobject.field.references.nodes`) with `Extract<Nodes[number], { __typename: 'Metaobject' }>`.
- **Structural `MoneyV2` typing**: Storefront API `MoneyV2.currencyCode` and Customer Account API `MoneyV2.currencyCode` are distinct TypeScript enums. Type shared price-display components structurally as `{ amount: string; currencyCode: string }` so they accept money values from both APIs without casts.

---

## 3. Pre-Router & Post-404 Request Handlers (`hydrogen-request-handlers`, `hydrogen-routing`)

Wire Hydrogen around your framework router in two gates:

1. **Pre-router gate (`handleShopifyRoutes`)**:
   - Call `const shopifyRoute = handleShopifyRoutes({ request, requestContext, sessionManager, storefrontClient, routeTemplates, handlers: [cartHandlers, customerAccountHandlers, predictiveSearchHandlers] })` **before** framework routing.
   - `handleShopifyRoutes` decides **synchronously** whether it owns the URL: it returns `null` when unmatched or `Promise<Response>` when matched. Check `if (shopifyRoute)` without `await`, and inside a `try/catch` use `if (shopifyRoute) return await shopifyRoute;` so rejections are caught.
   - **Routes owned by `handleShopifyRoutes`** (delete competing app route files for these paths!):
     - Storefront API proxy: `/api/{version}/graphql.json` (`POST`/`GET`, plus `/api/unstable/graphql.json`).
     - Shopify tracking, consent, and WebMCP proxies: `/__shopify/*`, `/.well-known/ucp`, `/.well-known/shopify/fec/produce`, `/api/mcp`, `/api/ucp/mcp`.
     - Checkout & cart permalinks: `/checkout`, `/cart/c/*`, `/cart/{variantId}:{qty}`, `/buy/{variantId}:{qty}` (`303` redirect to checkout), `/discount/{code}`.
     - Legacy theme AJAX cart compatibility: `/cart.js`, `/cart/add.js`, `/cart/update.js`, `/cart/change.js`, `/cart/clear.js`.
     - Liquid `?variant=<numeric_id>` parity: `GET` requests on product routes matching `routeTemplates` with a numeric `?variant=` query parameter automatically query the variant's selected options and `302` redirect to canonical option query params (`?Color=Blue&Size=M`).
     - Dev GraphiQL: `/graphiql` (non-production only).
     - Registered handler groups: `/api/cart` (`GET`/`POST`), `/api/predictive-search` (`GET`), and `/account/login`, `/account/authorize`, `/account/refresh`, `/account/logout`.
   - **React Router 7 catch-all requirement**: Keep a catch-all route (`app/routes/$.tsx`), because React Router `v8_middleware` only executes for matched routes.

2. **Post-404 gate (`handleShopifyRedirects`)**:
   - Run **only when the framework router returns a `404`**:
     ```ts
     if (response.status === 404) {
       const redirect = await handleShopifyRedirects({ request, storefrontClient, routeTemplates });
       if (redirect) return redirect;
     }
     ```
   - Handles `/admin` redirects, route-template redirects, Storefront API `urlRedirects` lookups, and safe same-origin `return_to` / `redirect` query parameter normalization.

---

## 4. Observable Stores & Progressive Commerce UI

### Selector Stability Rule

Store hooks (`useCart`, `useProductForm`, `useCollection`, `usePredictiveSearch`) compare selector return values by reference (`Object.is`). Never return a newly allocated `{ ... }` or `.map()`/`.filter()` array inside a selector—select existing store references (`state.data.lines.nodes`, `state.errors`, `state.pending.lines`) and derive view models in the component body.

### Cart Store, Drawer & Metafields (`hydrogen-cart-ui`, `hydrogen-cart-drawer`, `hydrogen-cart-metafields`)

- **Setup**: Create `export const cartHandlers = createCartServerHandlers({ customerSession, fragment })` on the server and `export const { CartProvider, useCart, useCartActions, useCartForm } = createCartComponents<typeof cartHandlers>()` for React/Vue.
- **Root loader hydration**: Load initial cart data in the root loader via `const { data: initialCart } = await cartHandlers.get({ storefrontClient, request, sessionManager, requestContext })` and pass `initialData={initialCart}` (the `{ cart, errors? }` envelope, not `cart` alone) to `<CartProvider>`. Never pass a deferred root `cart` promise into `<Await>`—render all cart surfaces from `useCart`.
- **Single-concern `/api/cart` mutations**: `/api/cart` rejects combined JSON payloads. Each `POST` must send only one mutation kind: `lines` (`add`/`update`/`remove`), `discountCodes`, `attributes`, or `note`.
- **Optimistic lines & pending controls**: Only disable quantity/remove buttons when `line.id.startsWith('optimistic:')`. Disabling on `state.pending.lines.has(line.id)` locks controls on every click and breaks rapid quantity steppers.
- **Cart Drawer (`<dialog>`)**:
  - Use native `<dialog closedby="any">` opened via `.showModal()` (never the `open` HTML attribute, which skips top-layer backdrop and `Escape` handling) and lock background scroll in CSS (`html:has(dialog[open]) { overflow: hidden; }`).
  - Render the header cart trigger as `<a href="/cart">` until hydration completes (`useHydrated()`), then swap to `<button type="button">`.
  - Auto-open the drawer when `useCart((s) => s.pending.lines.size > 0)` transitions from `false` to `true` (not when `totalQuantity` changes, and not from `useFetchers()`).
  - Register `window.Shopify.actions.openCart.configure({ handle: () => openDrawer() })` so third-party apps and agents can open the drawer.
- **Cart Attributes vs Cart Metafields (`createShopifyRouteHandler` pattern)**:
  - **Cart attributes** (`AttributeInput[]`) use `register('attributeValue', { key, value })` + `register('attributes-update')` and perform a **complete list replacement** (include hidden inputs for every existing attribute you want to preserve).
  - **Cart metafields** are server-only (`cartMetafieldsSet` / `cartMetafieldDelete`). Read them via a custom `CartFragment` on `createCartServerHandlers({ fragment })`. Write them by registering a custom `ShopifyRouteHandlerGroup` via `createShopifyRouteHandler('/api/cart/metafields', 'POST', handler)` inside `handleShopifyRoutes({ handlers: [cartHandlers, cartMetafieldHandlers, ...] })`.
  - **Empty-cart metafield race guard**: In the metafield POST handler, read `const cartId = getCartId(request)` and **never create a cart** if `cartId` is missing (return `{ type: 'error', error: { code: 'missing_cart', message: 'No cart exists.' } }`) so two concurrent metafield writes on an empty cart cannot race `cartCreate` and orphan a cart. After a successful mutation returning `{ type: 'json', data: { userErrors } }`, call `await useCartActions().refresh()` on the client.

### Variant Picker & Combined Listings (`hydrogen-variant-form`)

- **Required Product Query Fields**: Always query `options { id name optionValues { id name firstSelectableVariant { ... } swatch { color image { previewImage { url } } } } }`, `selectedOrFirstAvailableVariant`, `encodedVariantExistence`, and `encodedVariantAvailability`.
- **Symmetric Existence & Availability**:
  - Hide the entire option picker when `product.options.every((o) => o.values.length <= 1)` (default `"Title" / "Default Title"`).
  - `exists: false` -> render `<button type="button" disabled>` (unavailable combination).
  - `exists: true, available: false` -> **NEVER disable sold-out options**. Render as an interactive `<a href>` link with `"Sold out"` styling so buyers can still select it and inspect the variant or reach sister options.
  - **NEVER hide option values** based on the current selection.
- **Progressive GET Option Links & Combined Listings**:
  - For same-product options (`exists: true`), render `<a {...register('optionValue', { optionName, valueName })}>`. Plain left-clicks call `preventDefault()` + registered `onClick()` so `ProductProvider`'s `onSelect` performs a single replace-navigation (`navigate(href, { replace: true, preventScrollReset: true })`); modifier/middle clicks use native browser link behavior.
  - For **Combined Listings** (`value.handle && value.handle !== product.handle`), render a cross-product link to `/products/${value.handle}?${buildProductSelectionSearchParams({ searchParams, options: value.selectedOptions })}` while preserving focus across navigation.
  - Gate the submit button with `canAddToCart(product, options)` and bind `<input {...register('merchandiseId')} />`.

### Collection Filtering, Sorting & Predictive Search (`hydrogen-collection-browser`, `hydrogen-predictive-search`)

- **Liquid-Compatible URL Params**: `parseCollectionParams(request.url)` and `serializeCollectionParams()` use Shopify's standard Online Store 2.0 parameters (`filter.v.price.gte`, `filter.v.price.lte`, `filter.v.availability`, `filter.p.m.<namespace>.<key>`, `sort_by`, `cursor`, `direction`).
- **Browse Form Rules**: Render `<form {...register('form')} method="get" action={pathname}>` with explicit literal `method="get"` and `action` attributes. Keep filter inputs mounted and enabled during loading (`isPending`), and debounce price range inputs (`register('priceMin')`, `register('priceMax')`) by `350ms` in `createCollectionStore({ priceDebounceMs: 350 })` while prefixing inputs with an `aria-hidden="true"` `formatMoney(..., { locale }).currencyNarrowSymbol`.
- **Predictive Search**: Register `createPredictiveSearchServerHandlers({ storefrontClient })` in `handleShopifyRoutes` (`/api/predictive-search`), wrap the search UI in `<PredictiveSearchProvider>`, and link results with `getPredictiveSearchItemUrl(item, { routes: routeTemplates })` / `getSearchResultUrl()`.

### Customer Accounts, Session Caching & Local HTTPS (`hydrogen-customer-account`, `hydrogen-local-https`)

- **Signed `__Host-session` Cookie & Module-Cached `createCustomerSession`**:
  - Use `createCookie('__Host-session', { httpOnly: true, secure: true, sameSite: 'Lax', path: '/', secrets: [secret] })` (`@remix-run/cookie`) + `createCookieSessionStorage()` (`@remix-run/session/cookie-storage`).
  - Cache `createCustomerSession({ shopId, customerAccountApiClientId })` and `createCustomerAccountServerHandlers({ customerSession, defaultPostLoginRedirectPathname: '/account' })` at **module scope** keyed by `${shopId}:${customerAccountApiClientId}` so concurrent token refreshes for the same customer share a single in-flight request to Shopify.
  - Wire `customerSession` into `createCartServerHandlers({ customerSession })` (or pass `cartServerHandlers` into `createCustomerAccountServerHandlers`) so cart `buyerIdentity` syncs automatically on login/logout.
- **Server Navigation Only**: Link to `/account/login` with a plain `<a href="/account/login">` and submit logout with a plain `<form method="post" action="/account/logout">` (never React Router `<Link>` or `<Form>`, which intercept client-side before `handleShopifyRoutes` can run).
- **2026-10 Customer Account Schema Breaking Changes**:
  - `CustomerAddress.territoryCode` and `CustomerAddressInput.territoryCode` are deprecated/omitted in `2026-10` — use two-letter uppercase `countryCode` (`CountryCode` enum).
  - `Order.shippingTitle` was removed — use `Order.shippingLine { title }`.
  - `Customer.lastIncompleteCheckout` and `Checkout` types were removed.
- **Local HTTPS**: Customer Account OAuth requires HTTPS even in local dev. Run `npx hydrogen certs install`, enable `localHttps({ enabled })` from `@shopify/hydrogen/vite`, add `allowedHosts: ['.tryhydrogen.dev']`, and test at `https://local.tryhydrogen.dev:5173`.

### Shop Pay, Money & Images (`hydrogen-shop-pay`, `hydrogen-money`, `hydrogen-image`)

- **Shop Pay**: Render `<ShopPayButton variantIdsAndQuantities={[{ id: variant.id, quantity }]} storeDomain={storeDomain} />` (or `renderShopPayButton` / `createShopPayButton`). In `2026.10`, it renders a self-contained `<hydrogen-shop-pay-button>` custom element with a declarative shadow root that works before client JS loads.
- **Money**: `<Money>` is removed in `2026.10`. Use `formatMoney({ amount, currencyCode }, { locale })` and never perform client-side price math.
- **Images**: `<Image>` and `<MediaFile>` are removed in `2026.10`. Size `cdn.shopify.com` and `*.mock.shop` URLs via `URL.searchParams` (`width`, `height`, `crop`) and render responsive `<img>` tags with `srcset`, `sizes`, `width`, `height`, `loading="eager"` + `fetchPriority="high"` on the hero/PDP LCP image, and `loading="lazy"` below the fold.

---

## 5. Error Reporting & Logging Taxonomy (`configureLogging`)

Configure Hydrogen's structured logger once at server startup via `configureLogging({ logger, level: 'warn' })` from `@shopify/hydrogen` (default console sink formats `[hydrogen:<level>:<scope>] <message>` across `trace`, `debug`, `info`, `warn`, `error`, `fatal` with `LogContext`):

| Failure Category | Handling Rule |
| --- | --- |
| **Programming / configuration errors** (missing required config, reused `requestContext`) | Throw synchronously (`Error`, `TypeError`, `StorefrontCacheConfigError`) with an actionable fix message. |
| **Request-scoped operational failures** (Storefront/Customer Account network failure, non-2xx, GraphQL `errors`, invalid OAuth state) | Throw typed error classes (`StorefrontApiError`, `CustomerAccountApiError`, `CustomerAccountAuthenticationError`, `CustomerAccountOAuthError`, `CartNetworkError`) preserving `cause`, HTTP `status`, and `requestId`. |
| **Server route handlers** (`cartHandlers`, `predictiveSearchHandlers`, `customerAccountHandlers`) | Catch operational errors at the HTTP boundary, log with `scope` and `cause`, and return structured JSON error envelopes (`{ type: 'error', error: { code, message } }`). |
| **Expected buyer-facing `userErrors`** (sold-out quantity, invalid discount code) | **Never log**. Propagate into reactive store state (`state.errors`) so the UI renders inline validation feedback. |
| **Fire-and-forget side effects** (analytics beacons, non-critical background work) | Catch and log at `warn` or `debug`; never reject the buyer's primary request or navigation. |
