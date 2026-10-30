---
name: hydrogen-headless-tracking
description: >-
  Consent-aware analytics and ad signals for Shopify Hydrogen: Hydrogen analytics, Web Pixels, cart-to-checkout attribution, provider browser/server events, purchase webhook evidence. Not storefront UI, SEO, or pixel config changes without approval.
---

# Shopify Hydrogen Headless Tracking & Signal Engine

Use this skill when implementing, migrating, auditing, or debugging **first-party Shopify analytics, Customer Privacy consent, cart-to-checkout attribution, and ad-platform signal pipelines** in a Shopify Hydrogen storefront (`@shopify/hydrogen@2026.10.1` or Classic Hydrogen `<= 2026.4.x`).

## Role & Specialist Boundaries

- **This skill (`hydrogen-headless-tracking`)**: Owns Hydrogen analytics (`<ShopifyScripts />`, `window.Shopify.analytics`, `useCartAnalytics()`, `addDestination()`, and Classic `<Analytics.Provider>`), Customer Privacy consent gating, first-party `/__shopify/*` and `/.well-known/shopify/fec/produce` proxies, cart-to-checkout click-ID/cookie bridging, and Shopify Web Pixel + webhook deduplication handoff.
- **Not this skill**:
  - General Hydrogen routes, Storefront API queries, or UI components -> `hydrogen-development`
  - Headless suitability or multi-system commerce boundaries -> `headless-shopify`
  - Platform-specific ad signal schemas, EMQ scoring, and server outboxes:
    - Meta Pixel + CAPI -> `meta-ads-signal-engine`
    - Google Tag / sGTM / Enhanced Conversions -> `google-ads-signal-engine`
    - TikTok Pixel + Events API v2 -> `tiktok-ads-signal-engine`

---

## Core Engineering Rules (`2026.10+` vs Classic)

### 1. Detect Hydrogen Analytics Generation First

1. **Hydrogen `2026.10+` (`@shopify/hydrogen@2026.10.1`, current `latest`)**:
   - `<Analytics.Provider>`, `useAnalytics()`, `<Analytics.ProductView>` (and other view components), `getShopAnalytics()`, `analytics.subscribe()`, and `analytics.destroy()` are **removed**.
   - Render `<ShopifyScripts analytics={{ shop, i18n }} consent={consentConfig} />` from `@shopify/hydrogen/react` (`./vue`) in the root layout (or `renderShopifyScriptTags` + `initializeShopifyScripts` in Astro/SvelteKit).
   - Mount `useCartAnalytics()` (or `trackCartAnalytics(cartStore)`) once inside `<CartProvider>` so `product_added_to_cart`, `product_removed_from_cart`, and `cart_updated` publish automatically.
   - Publish route events (`AnalyticsEvent.PAGE_VIEWED`, `PRODUCT_VIEWED`, `COLLECTION_VIEWED`, `SEARCH_VIEWED`, `CART_VIEWED`) via `window.Shopify?.analytics.publish(event, payload)` in client `useEffect` hooks when location/entity changes.
2. **Classic Hydrogen (`<= 2026.4.7`)**:
   - Uses `<Analytics.Provider cart={cart} shop={shop} consent={consent}>`, `useAnalytics()`, and `<Analytics.ProductView>` / `<Analytics.CollectionView>` / `<Analytics.CartView>`.

### 2. Consent-Gated Destinations & `2026-10` Payload Traps

1. **Register external destinations with `addDestination()` (`2026.10+`)**:
   - Never call removed `analytics.subscribe()`. Register Meta, GA4/GTM, or TikTok forwarders once via `window.Shopify?.analytics.addDestination({ name, setup({ subscribe }) { subscribe(event, (payload, { getTrackingValues }) => ...) } })`.
   - `window.Shopify.analytics` buffers up to **500 events** before consent resolves or before destinations register, and replays them in order once Customer Privacy allows processing.
   - When using `consent={{ mode: 'custom-banner', setup }}`, `setup` is **mandatory** and must return a `Promise<ConsentPreferences>` (`{ analytics, marketing, preferences, saleOfData }`).
2. **`ProductPayload.price` is `MoneyV2`, not a string (`2026.10+`)**:
   - Both `ProductPayload.price` and `AnalyticsCartLine.price` are `MoneyV2` objects (`{ amount: string, currencyCode: CurrencyCode }`), matching `CartViewPayload.totalValue`. Always read `Number(product.price.amount)` and `product.price.currencyCode`.
3. **Ensure `handleShopifyRoutes()` runs before the router**:
   - `handleShopifyRoutes()` proxies `/__shopify/*` and `/.well-known/shopify/fec/produce` (WebMCP / first-party event collector). Without it, first-party Shopify analytics requests 404.

### 3. Cart-to-Checkout Attribution & Purchase Authority

1. **Cross-Boundary Attribution Preservation**:
   - Keep storefront and checkout on the same root domain (`store.example.com` + `checkout.example.com`) so `_shopify_y`, `_shopify_s`, `_fbp`, `_fbc`, and `_ga` cookies survive `checkoutUrl` handoff.
   - Persist landing click IDs (`fbclid`/`_fbc`, `_fbp`, `gclid`, `gbraid`, `wbraid`, `ttclid`, `_ttp`, `utm_*`) into cart attributes (`register('attributeValue', { key, value })` + `register('attributes-update')` — preserving existing cart attributes because `attributes-update` replaces the full list) so order webhooks receive them.
2. **Server-Authoritative Purchase Signals**:
   - Never fire `Purchase` from Hydrogen on checkout link click. Emit browser purchase events from Shopify Admin **Customer events (Web Pixels)** on `checkout_completed` and server purchase events from verified `orders/paid` (or COD `orders/create`) webhooks with matching deterministic `event_id` (`meta-ads-signal-engine`, `google-ads-signal-engine`, `tiktok-ads-signal-engine`).

---

## Reference Routing

- Read [`references/delivery-contract.md`](references/delivery-contract.md) for the complete `2026.10+` vs Classic analytics matrix, `<ShopifyScripts>` consent setup, `addDestination()` code pattern, attribution bridging, and verification checklist.

## Verification & Approval Gate

1. Verify all 7 standard events (`page_viewed`, `product_viewed`, `collection_viewed`, `search_viewed`, `cart_viewed`, `product_added_to_cart`, `product_removed_from_cart`/`cart_updated`) and `/__shopify/*` proxy responses in browser DevTools.
2. Stop and ask for explicit approval before modifying live Shopify Admin Web Pixels, GTM containers, or production ad-platform credentials.
