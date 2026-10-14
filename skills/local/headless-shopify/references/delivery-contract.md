# Headless Shopify Delivery Contract (2026-10)

## 1. Access Tokens, Client Types & Security Boundaries

| Client / Token | Scope & Exposure | Mandatory Guardrails |
| --- | --- | --- |
| **Private Storefront Token** (`PRIVATE_STOREFRONT_API_TOKEN`, `type: 'private'`) | Server-only (`server.ts`, framework middleware, loaders/actions). Never bundled into browser code. | Must pass a real `buyerIp` (`oxygen-buyer-ip`, `cf-connecting-ip`, or `x-forwarded-for`) into `createShopifyRequestContext({ request, i18n, buyerIp })` so Shopify rate-limits per buyer rather than throttling your server IP. |
| **Private No-Buyer-Context Client** (`type: 'private_no_buyer_context'`) | Server-only / build-time SSG / cron jobs / sitemaps. | Omit `buyerIp`; never use for buyer-specific cart, personalized pricing, or authenticated queries. |
| **Public Storefront Token** (`PUBLIC_STOREFRONT_API_TOKEN`, `type: 'public'`) | Safe for client or server; omit token completely when pointing at `mock.shop`. | Never set `PUBLIC_STOREFRONT_API_TOKEN=""` to an empty string (the `2026.10` client rejects empty strings). |
| **Customer Account API Client** (`PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`, `@shopify/hydrogen/customer-account`) | OAuth 2.0 + PKCE (`2026-10`). | Store tokens in a signed `HttpOnly; Secure; SameSite=Lax` cookie via `WritableCustomerSessionManager`. Always call `requestContext.applyResponseHeaders(response.headers)` so responses touching Customer Account or setting cookies get `Cache-Control: private, no-store` and have CDN cache headers stripped. |

## 2. Storefront API & Customer Account API (`2026-10`) Schema Contract

- **Query discipline**:
  - Pin and validate against `2026-10` using `gql()` + `@shopify/hydrogen/ts-plugin` and `npx hydrogen gql check --fail-on-warn`.
  - Pass `@inContext(country: $country, language: $language)` on catalog, product, collection, search, and cart queries.
  - Keep field selection bounded (`first: <= 50`, explicit fragments, no unbounded nested connections).
- **2026-10 Cart Discount & Metafield Contract**:
  - Query `Cart.discountApplications`, `CartDeliveryGroup.discountAllocations`, `CartDiscountAllocation.sourceDiscountApplication`, and `lineLevelOnly` (default `true`) on cart line `discountAllocations` instead of deprecated `Cart.discountAllocations`.
  - Read cart metafields via custom `CartFragment` on `createCartServerHandlers({ fragment })`; write cart metafields via an app-owned server POST endpoint (`metafieldsSet` / `cartMetafieldDelete`) returning only `{ userErrors }`, followed by `await useCartActions().refresh()`.
- **2026-10 Customer Account Contract**:
  - Use two-letter uppercase `countryCode: CountryCode` on `CustomerAddress` and `CustomerAddressInput` (`territoryCode` is deprecated/omitted).
  - Query `Order.shippingLine { title }` instead of removed `Order.shippingTitle`.
  - Do not query removed `Customer.lastIncompleteCheckout` or `Checkout` types.

## 3. Checkout & Customer Account UI Extensions (`2026-04+`)

When headless storefronts pair with custom Checkout or Customer Account UI Extensions:

- Target `2026-04` or later using `@shopify/ui-extensions/preact` and Polaris `<s-*>` web components (`<s-banner>`, `<s-stack>`, `<s-button>`, `<s-text>`).
- Before calling `shopify.applyAttributeChange()`, `applyNoteChange()`, `applyDiscountCodeChange()`, or `applyCartLinesChange()`, always check `shopify.instructions.value.attributes.canUpdateAttributes` (or the corresponding instruction flag), which can be `false` on accelerated wallets (Shop Pay, Apple Pay) or B2B checkouts.
- Declare `network_access = true` under `[extensions.capabilities]` in `shopify.extension.toml` before making external `fetch()` calls, and prefer `useAppMetafields()` (`$app:` reserved metafields in `shopify.app.toml`) to read data in checkout with zero network latency.

## 4. Verification & Release Evidence

1. **Schema & Type Verification**: `npx hydrogen gql check --fail-on-warn`, `tsc`, and `@shopify/dev-mcp` `validate_graphql_codeblocks` pass with zero errors.
2. **Response Privacy Proof**: Inspect response headers on `/api/cart`, `/account/*`, and any route setting cookies to confirm `Cache-Control: private, no-store` is present and CDN cache headers are stripped.
3. **End-to-End Commerce Proof (`ui-validation`)**: Prove browse -> filter/sort -> variant selection (`replace: true`) -> add-to-cart -> cart drawer/page -> `checkoutUrl` redirect on both mobile (`390x844`) and desktop (`1440x900`) viewports with zero `console.error` or `pageerror`.
