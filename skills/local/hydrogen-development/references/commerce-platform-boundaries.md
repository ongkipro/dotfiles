# Shopify Commerce Platform Boundaries in Hydrogen (2026-10 & Classic)

## Markets, Localization, and `@inContext` (`hydrogen-markets`)

- **Automatic `@inContext` injection in Hydrogen `2026.10+`**:
  - `createShopifyRequestContext({ request, i18n: { country, language }, buyerIp })` carries the request's active `country` (`CountryCode`) and `language` (`LanguageCode`).
  - `storefrontClient.graphql()` automatically injects `country` and `language` variables from `requestContext.i18n` into any `gql()` query declaring `($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language)` unless explicitly overridden in `variables`.
- **Three Market URL Strategies**:
  1. **Subfolders** (`/fr-ca/products/...` via `($locale).*` routes): Parse the first path segment against supported locales; strip the prefix before passing `request` to `createShopifyRouteTemplates` or configure locale-aware route templates; redirect invalid prefixes (`404`) and keep canonical/alternate `hreflang` tags aligned.
  2. **Domains / Subdomains** (`ca.example.com`, `example.fr`): Derive `i18n` from `new URL(request.url).hostname`.
  3. **Cookie / Session Selector**: Read the chosen country/language from a cookie or `sessionManager`; when a buyer switches markets, update both the cookie and `cartBuyerIdentityUpdate({ countryCode })` (in `2026.10`, `cartHandlers` syncs buyer context from `requestContext.i18n`).
- **Currency & Price Invariants**:
  - Render every price from the Storefront API's localized `MoneyV2` response via `formatMoney(money, { locale })` (`2026.10+`) or `<Money>` (Classic). Never multiply prices by client-side exchange rates.

## Customer Account API, Session Storage & Cart Identity Sync (`hydrogen-customer-account`)

- **OAuth 2.0 + PKCE via `@shopify/hydrogen/customer-account` (`2026.10+`)**:
  - Create a cookie-backed `WritableCustomerSessionManager` (`getSessionOrigin`, `getSessionItem`, `setSessionItem`, `removeSessionItem`, plus `commit()` returning `Set-Cookie` with `HttpOnly; Secure; SameSite=Lax; Path=/`).
  - Wire `const customerSession = createCustomerSession({ sessionManager, customerAccountClient })` into both `createCartServerHandlers({ customerSession })` and `createCustomerAccountServerHandlers({ customerSession, cartServerHandlers: cartHandlers })`.
  - Register `customerAccountHandlers` in `handleShopifyRoutes({ handlers: [cartHandlers, customerAccountHandlers] })`. It owns `/account/login`, `/account/authorize`, `/account/refresh`, and `/account/logout`.
  - Always use plain `<a href="/account/login">` and `<form method="post" action="/account/logout">` so requests hit the server handler instead of client-side router navigation.
  - Call `requestContext.applyResponseHeaders(response.headers)` on every response so authenticated and `Set-Cookie` responses receive `Cache-Control: private, no-store` and have CDN caching headers stripped.
- **2026-10 Customer Account Schema Rules**:
  - Use `countryCode: CountryCode` (two-letter uppercase, e.g. `'ID'`, `'MY'`, `'US'`) on `CustomerAddress` and `CustomerAddressInput` (`territoryCode` is deprecated/omitted).
  - Read `Order.shippingLine { title }` instead of removed `Order.shippingTitle`.
  - Do not query removed `Customer.lastIncompleteCheckout` or `Checkout` types.
- **Web Component Option (`<shopify-account>`)**:
  - When using Shopify's hosted account menu web component, pass `<ShopifyScripts account />` so `https://cdn.shopify.com/storefront/web-components/account.js` is loaded alongside runtime scripts.

## Online Store 2.0 (Theme 2.0) & Liquid Coexistence Boundaries

- **What Hydrogen shares with Online Store 2.0**:
  - **Standard Storefront Events & Actions (`window.Shopify.actions`)**: Hydrogen `2026.10+` implements the same browser contract (`shopify:cart:lines-update`, `window.Shopify.actions.openCart()`) that Liquid themes use, so compatible storefront apps and shopping agents work across both.
  - **URL, Filter & Variant Parity**: `handleShopifyRoutes` redirects Liquid `?variant=<numeric_id>` URLs (`302`) to canonical option query params, serves `/cart/{variantId}:{qty}`, `/buy/{variantId}:{qty}`, and `/cart.js` / `/cart/add.js`, and `parseCollectionParams` uses Liquid's `filter.v.*` and `sort_by` URL parameters.
  - **Cart Cookie Sharing**: During incremental migration between a Liquid theme and Hydrogen on the same root domain, carts are shared via cookie only for products published to **both** the Online Store and Hydrogen channels.
- **What Hydrogen replaces**:
  - `.liquid` templates, `sections/*.liquid`, `blocks/*.liquid`, and `settings_data.json` do not run in Hydrogen. Replace theme sections with **Metaobject-driven Dynamic Sections** (`references/dynamic-pages-architecture.md`) and app-owned `$app` custom data definitions (`shopify.app.toml`).
  - Admin-installed ScriptTag / Theme App Embeds that depend on Liquid DOM hooks must be replaced with Storefront API queries, Customer Privacy / Web Pixels, or Checkout & Customer Account UI Extensions (`@shopify/ui-extensions` `2026-04+` Polaris web components `<s-*>`).

## Advanced Merchandising: Bundles, Combined Listings, Subscriptions, and B2B

- **Combined Listings**: When an option value points to a different parent/child product (`value.handle && value.handle !== product.handle`), render a cross-product `<a href>` using `buildProductSelectionSearchParams({ searchParams, options: value.selectedOptions })` so option state and non-option query params survive the product transition.
- **Product Bundles**: Query `ProductVariant.requiresComponents` and `components(first: ...)`, and render `CartLine` component breakdowns (`line.lineComponents` when using custom `CartFragment` on `createCartServerHandlers({ fragment })`).
- **Subscriptions (`SellingPlanGroups`)**: Query `sellingPlanGroups` and `sellingPlanAllocations` on `Product` / `ProductVariant`, pass `sellingPlanId` on cart line additions/updates, and render recurring price summaries from `SellingPlanCheckoutCharge`.
- **B2B (`purchasingCompany`)**: Authenticate via Customer Account API, sync `buyerIdentity.purchasingCompany` on the cart, and read company-specific catalog prices, quantity rules (`quantityRule { minimum maximum increment }`), and volume pricing breaks (`quantityPriceBreaks`) from `@inContext` Storefront queries.
