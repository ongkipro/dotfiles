---
name: hydrogen-headless-tracking
description: >-
  Consent-aware analytics and ad signals for Shopify Hydrogen: Hydrogen analytics, Web Pixels, cart-to-checkout attribution, provider browser/server events, purchase webhook evidence. Not storefront UI, SEO, or pixel config changes without approval.
---

# Shopify Hydrogen Headless Tracking & Signal Engine

Use this skill when implementing, migrating, auditing, or debugging **first-party Shopify analytics, Customer Privacy consent, cart-to-checkout attribution, and ad-platform signal pipelines** in a Shopify Hydrogen storefront (`@shopify/hydrogen@2026.10.x`, `latest` `2026.10.3`, or Classic Hydrogen `<= 2026.4.x`).

## Role & Specialist Boundaries

- **This skill (`hydrogen-headless-tracking`)**: Owns Hydrogen analytics (`<ShopifyScripts />`, `window.Shopify.analytics`, `useCartAnalytics()`, `addDestination()`, and Classic `<Analytics.Provider>`), Customer Privacy consent gating, first-party `/__shopify/*` and `/.well-known/shopify/fec/produce` proxies, cart-to-checkout click-ID/cookie bridging, and Shopify Web Pixel + webhook deduplication handoff.
- **Not this skill**:
  - Shopify store diagnostics, CLI 5.x (`store execute/bulk`), HTTP 402 triage, or Admin catalog/CMS operations -> `shopify-development`
  - General Hydrogen routes, Storefront API queries, Oxygen caching, or UI components -> `hydrogen-development`
  - Headless suitability, `<brand>` vs `checkout.<brand>` domains, or multi-system commerce boundaries -> `headless-shopify`
  - Platform-specific ad signal schemas, EMQ scoring, and server outboxes:
    - Meta Pixel + CAPI -> `meta-ads-signal-engine`
    - Google Tag / sGTM / Enhanced Conversions -> `google-ads-signal-engine`
    - TikTok Pixel + Events API v2 -> `tiktok-ads-signal-engine`

---

## Core Engineering Rules (`2026.10+` vs Classic)

### 1. Detect Hydrogen Analytics Generation First

1. **Hydrogen `2026.10+` (`@shopify/hydrogen@2026.10.3`, current `latest`)**:
   - `<Analytics.Provider>`, `useAnalytics()`, `<Analytics.ProductView>` (and other view components), `getShopAnalytics()`, `analytics.subscribe()`, and `analytics.destroy()` are **removed**.
   - Render `<ShopifyScripts shop={shop} i18n={i18n} consent={consentConfig} />` from `@shopify/hydrogen/react` (`./vue`) in the root layout (or `renderShopifyScriptTags` + `initializeShopifyScripts` in Astro/SvelteKit). `shop` and `i18n` are top-level props; `analytics` is optional bus config only (`channel`, `customData`), and `shop` is not a key of it.
   - Mount `useCartAnalytics()` (or `trackCartAnalytics(cartStore)`) once inside `<CartProvider>` so `product_added_to_cart`, `product_removed_from_cart`, and `cart_updated` publish automatically.
   - Publish route events (`AnalyticsEvent.PAGE_VIEWED`, `PRODUCT_VIEWED`, `COLLECTION_VIEWED`, `SEARCH_VIEWED`, `CART_VIEWED`) via `window.Shopify?.analytics.publish(event, payload)` in client `useEffect` hooks when location/entity changes.
2. **Classic Hydrogen (`<= 2026.4.8`)**:
   - Uses `<Analytics.Provider cart={cart} shop={shop} consent={consent}>`, `useAnalytics()`, and `<Analytics.ProductView>` / `<Analytics.CollectionView>` / `<Analytics.CartView>`.

### 2. Consent-Gated Destinations & `2026-10` Payload Traps

1. **Register external destinations with `addDestination()` (`2026.10+`)**:
   - Never call removed `analytics.subscribe()`. Register Meta, GA4/GTM, or TikTok forwarders once via `window.Shopify?.analytics.addDestination({ name, setup({ subscribe }) { subscribe(event, (payload, { getTrackingValues }) => ...) } })`.
   - `window.Shopify.analytics` buffers up to **500 events** before consent resolves or before destinations register, and replays them in order once Customer Privacy allows processing.
   - `consent.mode` is `'default-banner'` (Shopify's hosted banner), `'custom-banner'`, or `'no-banner'` (also the default when omitted). There is no `'auto'` mode.
   - When using `consent={{ mode: 'custom-banner', setup }}`, `setup` is **mandatory** and is `() => Promise<void>`: it syncs the provider's choice through `window.Shopify.customerPrivacy.setTrackingConsent({ analytics, marketing, preferences, sale_of_data })` (snake_case `sale_of_data`), then resolves. Hydrogen runs it once and keeps delivery blocked if it rejects.
2. **`ProductPayload.price` is `MoneyV2`, not a string (`2026.10+`)**:
   - Both `ProductPayload.price` and `AnalyticsCartLine.price` are `MoneyV2` objects (`{ amount: string, currencyCode: CurrencyCode }`), matching `CartViewPayload.totalValue`. Always read `Number(product.price.amount)` and `product.price.currencyCode`.
3. **Ensure `handleShopifyRoutes()` runs before the router**:
   - `handleShopifyRoutes()` proxies `/__shopify/*` and `/.well-known/shopify/fec/produce` (WebMCP / first-party event collector). Without it, first-party Shopify analytics requests 404.

### 3. Cart-to-Checkout Attribution & Purchase Authority

1. **Cross-Boundary Attribution Preservation**:
   - Keep storefront and checkout on the same root domain (`store.example.com` + `checkout.example.com`) so first-party cookies (`_fbp`, `_fbc`, `_ga`, Shopify's consent and session cookies) survive the `checkoutUrl` handoff. Never read, copy, or forward `_shopify_y` or `_shopify_s`: Shopify no longer sets them, and the Storefront API proxy expires leftover copies. Read visitor and session values with `getTrackingValues()` (`uniqueToken`, `visitToken`).
   - Persist landing click IDs (`fbclid`/`_fbc`, `_fbp`, `gclid`, `gbraid`, `wbraid`, `ttclid`, `_ttp`, `utm_*`) into cart attributes (`register('attributeValue', { key, value })` + `register('attributes-update')` — preserving existing cart attributes because `attributes-update` replaces the full list) so order webhooks receive them.
2. **Server-Authoritative Purchase Signals**:
   - Never fire `Purchase` from Hydrogen on checkout link click. Emit browser purchase events from Shopify Admin **Customer events (Web Pixels)** on `checkout_completed` and server purchase events from verified `orders/paid` (or COD `orders/create`) webhooks with matching deterministic `event_id` (`meta-ads-signal-engine`, `google-ads-signal-engine`, `tiktok-ads-signal-engine`).

---

## Reference Routing

- Read [`references/delivery-contract.md`](references/delivery-contract.md) for the complete `2026.10+` vs Classic analytics matrix, `<ShopifyScripts>` consent setup, `addDestination()` code pattern, attribution bridging, and verification checklist.
- Read [`references/web-pixels.md`](references/web-pixels.md) for an App Pixel or Custom Pixel, and [`references/shopify-analytics-cookie-migration.md`](references/shopify-analytics-cookie-migration.md) when existing code reads `_shopify_y` or `_shopify_s`.
- `references/archive/` holds seven pre-2026.10 design sketches (CAPI sender, pixel connector, GTM dataLayer, identity normalizer, cross-domain attribution, CSP/consent, WeTracked parity). They are archived, not routed: four target removed APIs (`useAnalytics()`, `NonceProvider`) and two pin Graph `v22.0`. Do not open them unless a Classic Hydrogen (`<= 2026.4.x`) task needs a pattern; [`references/archive/README.md`](references/archive/README.md) maps each to its current owner. Provider event fields, normalization, hashing and CAPI belong to `meta-ads-signal-engine`, `google-ads-signal-engine` and `tiktok-ads-signal-engine`.

## Verification & Approval Gate

1. Verify all 7 standard events (`page_viewed`, `product_viewed`, `collection_viewed`, `search_viewed`, `cart_viewed`, `product_added_to_cart`, `product_removed_from_cart`/`cart_updated`) and `/__shopify/*` proxy responses in browser DevTools.
2. Stop and ask for explicit approval before modifying live Shopify Admin Web Pixels, GTM containers, or production ad-platform credentials.
