---
name: headless-shopify
description: >-
  Architect, migrate, or audit Shopify headless storefronts (Storefront API, Hydrogen, custom): is headless justified, API/token boundaries, cart and checkout handoff, Customer Account API, Markets, caching. Not Liquid themes or Hydrogen code.
---

# Shopify Headless Storefront Architecture

Use this skill when deciding whether a Shopify project should go headless, selecting between **Online Store 2.0 Liquid themes**, **Storefront Web Components**, **Hydrogen `2026.10+` toolkit**, or a **Bring-Your-Own-Stack Storefront API** architecture, or auditing cross-system boundaries (tokens, Markets, Customer Accounts, custom data, Checkout UI Extensions, caching, and migration).

## Role & Specialist Boundaries

- **This skill (`headless-shopify`)**: Owns the headless suitability gate, Shopify authority matrix, Storefront API (`2026-10`) and Customer Account API (`2026-10`) token/client boundaries, Online Store 2.0 parity via Metaobject Section CMS and `$app:` custom data, Checkout & Customer Account UI Extension (`2026-04+`) boundaries, and reversible Liquid-to-headless migration.
- **Not this skill**:
  - Implementing Hydrogen routes, request handlers, `gql()` queries, and observable stores -> `hydrogen-development`
  - Online Store 2.0 Liquid themes (`sections/*.liquid`, `blocks/*.liquid`) or non-Shopify storefronts -> `storefront-development`
  - Buyer commerce journeys, filter/variant/cart UX contracts -> `storefront-ux`
  - Consent-aware Hydrogen analytics, Web Pixels, and ad signal engines -> `hydrogen-headless-tracking`
  - Technical SEO & canonical/indexation strategy -> `seo-website-builder`; security audits -> `application-security`; Core Web Vitals -> `web-perf`; browser verification -> `ui-validation`

---

## Core Architectural Rules (`2026-10`)

### 1. Suitability Gate & Surface Selection

1. **Challenge headless first**: Do not build a custom headless storefront when an Online Store 2.0 Liquid theme (`storefront-development`), Storefront Web Components (`<shopify-account>`, embedded buy widgets), or Checkout/Customer Account UI Extensions solve the business requirement with lower operational risk.
2. **Choose the right headless tier**:
   - **Hydrogen `2026.10+` (`@shopify/hydrogen@2026.10.1`, current `latest`)**: Framework-agnostic storefront toolkit and server-handler library added to React Router 7 (Oxygen), Next.js App Router (Vercel), Astro, Nuxt, SvelteKit, or SolidStart. Preferred for all web headless builds (`hydrogen-development`).
   - **Bring Your Own Stack (Raw Storefront API `2026-10`)**: Reserve for native mobile apps, kiosks, or non-JS server runtimes.

### 2. Token, Client & Privacy Boundaries

1. **Private vs Public Storefront Clients**:
   - Use `type: 'private'` (`PRIVATE_STOREFRONT_API_TOKEN`) on the server with a real `buyerIp` (`oxygen-buyer-ip`, `cf-connecting-ip`, or `x-forwarded-for`) on `createShopifyRequestContext` so Shopify rate-limits per buyer rather than throttling your server IP.
   - Use `type: 'private_no_buyer_context'` only for module-scoped/build-time catalog reads with no buyer context.
   - Use `type: 'public'` with **no token** when testing against `mock.shop` (never pass `PUBLIC_STOREFRONT_API_TOKEN=""` as an empty string).
2. **Response Privacy Enforcement**:
   - Call `requestContext.applyResponseHeaders(response.headers)` on every framework response after committing session cookies. Any response setting cookies or touching the Customer Account client must carry `Cache-Control: private, no-store` with CDN cache headers stripped.

### 3. `2026-10` Storefront & Customer Account Schema Invariants

1. **Storefront API (`2026-10`)**:
   - Query `Cart.discountApplications`, `CartDeliveryGroup.discountAllocations`, `CartDiscountAllocation.sourceDiscountApplication`, and `lineLevelOnly` (default `true`) on cart line `discountAllocations` instead of deprecated `Cart.discountAllocations`.
   - Keep cart metafield writes server-only (`metafieldsSet` / `cartMetafieldDelete`) on an app-owned POST route returning `{ userErrors }` followed by client `useCartActions().refresh()`.
2. **Customer Account API (`2026-10`)**:
   - Use two-letter uppercase `countryCode: CountryCode` on `CustomerAddress` and `CustomerAddressInput` (`territoryCode` is deprecated/omitted).
   - Query `Order.shippingLine { title }` instead of removed `Order.shippingTitle`, and never query removed `Customer.lastIncompleteCheckout` or `Checkout` types.
   - Sync cart buyer identity on login/logout by wiring `createCustomerSession` into both `createCartServerHandlers` and `createCustomerAccountServerHandlers`.

### 4. Online Store 2.0 Parity, Custom Data (`$app:`), and UI Extensions

1. **Metaobjects as Headless Theme 2.0 Section CMS**:
   - Model `Route` -> `Sections` (`section_hero`, `section_featured_products`, `section_featured_collections`, `section_rich_text`) in Shopify Admin Metaobjects and resolve them via single-round-trip inline fragments (`references/hydrogen-ui-ux-architecture.md`).
2. **App-Reserved Custom Data (`$app:`)**:
   - When pairing a headless storefront with a custom Shopify app, declare `[product.metafields.app-reserved.*]` and `[metaobjects.app-reserved.*]` in `shopify.app.toml` (`$app:` prefix) so definitions deploy atomically, survive uninstall, and can be read in Checkout UI Extensions via `useAppMetafields()` with zero network latency.
3. **Checkout & Customer Account UI Extensions (`2026-04+`)**:
   - Build extensions with `@shopify/ui-extensions/preact` and Polaris `<s-*>` web components (`<s-banner>`, `<s-stack>`, `<s-button>`, `<s-text>`). Always check `shopify.instructions.value.attributes.canUpdateAttributes` before calling `shopify.applyAttributeChange()`.

---

## Reference Routing Table

| Topic | Reference File |
| --- | --- |
| Suitability gate, surface selection (Liquid 2.0 vs Web Components vs Hydrogen 2026.10 vs BYO stack), `$app:` custom data, and reversible migration | [`references/architecture-decisions.md`](references/architecture-decisions.md) |
| Token/client boundaries, `buyerIp`, `applyResponseHeaders` privacy guard, `2026-10` schema breaking changes, and UI extension contracts | [`references/delivery-contract.md`](references/delivery-contract.md) |
| Progressive HTML-first variant/collection/cart primitives and Online Store 2.0 Metaobject Section CMS architecture | [`references/hydrogen-ui-ux-architecture.md`](references/hydrogen-ui-ux-architecture.md) |
| Verified `2026-10-14` API/SDK matrix, `shopify.dev` URLs, and `@shopify/dev-mcp` retrieval workflow | [`references/official-sources.md`](references/official-sources.md) |

---

## Verification & Release Gate

1. Validate all Storefront and Customer Account GraphQL operations against `2026-10` using `npx hydrogen gql check --fail-on-warn` and `@shopify/dev-mcp` `validate_graphql_codeblocks`.
2. Confirm `Cache-Control: private, no-store` and stripped CDN cache headers on `/api/cart`, `/account/*`, and any response with `Set-Cookie`.
3. Prove end-to-end browse -> variant switch -> cart -> `checkoutUrl` handoff in a real browser (`ui-validation`) before cutover, and ask for explicit approval before live deployment or bulk Shopify mutations.
