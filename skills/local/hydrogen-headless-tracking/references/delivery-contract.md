# Hydrogen Headless Tracking & Signal Delivery Contract (2026-10 & Classic)

Last verified 2026-11-22 against `@shopify/hydrogen@2026.10.3` (its bundled `skills/hydrogen-analytics`, the published `.d.mts` types, and `shopify.dev/docs/storefronts/hydrogen/analytics`). The `ShopifyScripts` and consent examples in section 2 were type-checked with TypeScript 6 against that exact package: the three forms that earlier revisions of this file showed (`analytics={{shop, i18n}}`, `mode: 'auto'`, a `setup` that returns preferences) are compile errors.

---

## 1. Hydrogen `2026.10+` Analytics Architecture vs Classic (`<= 2026.4.x`)

| Capability | Hydrogen `2026.10+` (`@shopify/hydrogen@2026.10.3`) | Classic Hydrogen (`<= 2026.4.8`) |
| --- | --- | --- |
| **Root Script & Runtime** | `<ShopifyScripts shop={shop} i18n={i18n} consent={consentConfig} />` from `@shopify/hydrogen/react` (`./vue`), or `renderShopifyScriptTags` + `initializeShopifyScripts` in Astro/SvelteKit. | `<Analytics.Provider cart={cart} shop={shop} consent={consent}>` from `@shopify/hydrogen`. |
| **First-Party Event Proxies** | Owned automatically by `handleShopifyRoutes()`: `/__shopify/*` and `/.well-known/shopify/fec/produce`. | Handled via Oxygen/Hydrogen Vite middleware and CSP headers. |
| **Publishing Route Events** | `window.Shopify?.analytics.publish(AnalyticsEvent.PAGE_VIEWED, payload)` ( plus `PRODUCT_VIEWED`, `COLLECTION_VIEWED`, `SEARCH_VIEWED`, `CART_VIEWED`) in client `useEffect` hooks. | `<Analytics.ProductView>`, `<Analytics.CollectionView>`, `<Analytics.CartView>`, `<Analytics.SearchView>` or `publish()` from `useAnalytics()`. |
| **Publishing Cart Mutations** | `useCartAnalytics()` hook (React/Vue) or `trackCartAnalytics(cartStore)` (core) wired once inside `<CartProvider>`. Automatically emits `product_added_to_cart`, `product_removed_from_cart`, and `cart_updated`. | Handled inside `<Analytics.Provider cart={cart}>` by diffing loader cart state. |
| **Custom Destinations (Meta, GA4/GTM, TikTok)** | `window.Shopify?.analytics.addDestination({ name, setup({ subscribe }) { subscribe(event, (payload, { getTrackingValues }) => ...) } })`. **Note:** `analytics.subscribe()` and `analytics.destroy()` were **removed** in `2026.10.0`! | `subscribe('product_viewed', callback)` inside a child of `<Analytics.Provider>`. |
| **Price Payload Shape** | `ProductPayload.price` and `AnalyticsCartLine.price` are `MoneyV2` objects (`{ amount: string, currencyCode: CurrencyCode }`), matching `CartViewPayload.totalValue`. | `price` was often passed as a string scalar alongside a top-level `currency`. |

---

## 2. Consent Gate & `addDestination` Replay Contract (`2026.10+`)

### Customer Privacy Consent Modes

`<ShopifyScripts>` configures Shopify's Customer Privacy API via the `consent` prop:

`shop` (`{shopId, storefrontId, myshopifyDomain}`, use `"0"` for `storefrontId` when there is none) and `i18n` (`{country, language}`, optional `currency`) are top-level props. `analytics` is optional bus config only (`channel`, `customData`) and has no `shop` key. The mode is one of three values:

1. **Hosted Shopify banner (`mode: 'default-banner'`)**: loads Shopify's banner and holds destinations until the visitor accepts or declines where the region requires it. Use it unless there is a custom consent UI.
   ```tsx
   <ShopifyScripts shop={shop} i18n={i18n} consent={{mode: 'default-banner'}} />
   ```
2. **No banner (`mode: 'no-banner'`, also the default when `consent` is omitted)**: loads only the Customer Privacy API and releases events once it loads. Visitors in regions that require consent cannot grant it, so use it only when consent is collected elsewhere.
3. **Custom banner (`mode: 'custom-banner'`)**: `setup` is **mandatory** and is `() => Promise<void>`. It syncs the provider's choice into `window.Shopify.customerPrivacy` (all four purposes, snake_case `sale_of_data`), then resolves; it returns nothing. Hydrogen runs it once per page, keeps events buffered until it resolves, and keeps delivery blocked if it rejects. Leave an unknown provider state pending instead of submitting it as a denial.
   ```tsx
   <ShopifyScripts
     shop={shop}
     i18n={i18n}
     consent={{
       mode: 'custom-banner',
       async setup() {
         const prefs = await waitForUserConsentBanner(); // app-owned adapter
         await window.Shopify!.customerPrivacy!.setTrackingConsent({
           analytics: prefs.analytics,
           marketing: prefs.marketing,
           preferences: prefs.preferences,
           sale_of_data: prefs.saleOfData,
         });
       },
     }}
   />
   ```

### Registering External Destinations (`addDestination`)

Never call removed `analytics.subscribe()` in Hydrogen `2026.10+`. Register each provider once on the client using `addDestination`:

```ts
import {AnalyticsEvent} from '@shopify/hydrogen';

window.Shopify?.analytics.addDestination({
  name: 'custom-ad-signals',
  setup({subscribe}) {
    subscribe(
      AnalyticsEvent.PRODUCT_VIEWED,
      (payload, {getTrackingValues}) => {
        const tracking = getTrackingValues();
        const product = payload.products[0];
        if (!product) return;
        // product.price is MoneyV2: { amount: string, currencyCode: CurrencyCode }
        forwardProductView({
          eventId: `pv_${tracking.uniqueToken}_${product.variantId}`,
          value: Number(product.price.amount),
          currency: product.price.currencyCode,
          product,
        });
      },
    );
  },
});
```

- **500-Event Consent Buffer**: `window.Shopify.analytics` buffers up to **500 published events** before a destination registers or while Customer Privacy consent is pending, and replays them in order only after consent allows delivery (`analyticsProcessingAllowed()`).
- **Register each destination once per page lifetime, after `ShopifyScripts` creates the bus.** Removing and re-adding a destination under the same name resumes where it left off since `2026.10.3` (earlier builds re-sent retained events, so a registration in a component effect duplicated deliveries under React Strict Mode); a new name still receives the full retained history. Keep third-party script loading and cookie writes out of `setup()`, which is not consent-gated. Do not send events to Shopify's analytics endpoint yourself; Shopify's destination already does.

---

## 3. Cart-to-Checkout Attribution & Purchase Signal Authority

1. **Preserve Click IDs & Browser Identifiers Into Checkout**:
   - Capture `_fbp`, `_fbc` (`fbclid`), `_ga`, `gclid`, `gbraid`, `wbraid`, `ttclid`, `_ttp`, and `utm_*` on landing.
   - Sync non-PII attribution keys to cart attributes (`register('attributeValue', { key, value })` + `register('attributes-update')` in `2026.10+` — remember cart attribute updates replace the full attribute list, so preserve existing cart attributes!) or cart metafields so Shopify Checkout webhooks (`orders/create`, `orders/paid`) receive them on the server.
   - Maintain a shared root domain (`store.example.com` + `checkout.example.com`) so first-party cookies (`_fbp`, `_fbc`, `_ga`, Shopify's consent and session cookies) survive the `checkoutUrl` redirect.
   - Do not read, copy, or synthesize `_shopify_y` or `_shopify_s`. Shopify deprecated them (changelog 2025-08-04; Hydrogen upgrade deadline 2026-04-30) and the 2026.10 Storefront API proxy now expires leftover copies it sees. `getTrackingValues()` in the destination callback returns `uniqueToken` (replaces `_shopify_y`) and `visitToken` (replaces `_shopify_s`), and returns empty strings while tracking is not allowed. Shopify offers no replacement value for `_shopify_s`; a session-length cookie of your own is the documented equivalent.
2. **Purchase Authority Belongs to Shopify Checkout + Server Webhooks**:
   - Never fire an authoritative `Purchase` conversion from the Hydrogen storefront on checkout button click.
   - Browser `checkout_completed` events run inside **Shopify Admin -> Customer events (Web Pixels)** on the hosted Checkout / Thank You page, deduplicated by deterministic `event_id` (`order_id` / `checkout_token`) against server-side CAPI / Google Enhanced Conversions / TikTok Events API v2 (`meta-ads-signal-engine`, `google-ads-signal-engine`, `tiktok-ads-signal-engine`).

---

## 4. Verification & Audit Checklist

1. **Proxy & Script Verification**:
   - Confirm `handleShopifyRoutes()` is wired before the router so `/__shopify/*` and `/.well-known/shopify/fec/produce` return `200`/`204` rather than hitting the app's `404` catch-all.
   - Confirm `<ShopifyScripts shop={shop} i18n={i18n} />` renders in the root document and `useCartAnalytics()` is mounted inside `<CartProvider>`.
   - Confirm the app publishes `PAGE_VIEWED` itself on first load and on every client navigation. `ShopifyScripts` only fires the `shopify:page:view` DOM event for Shopify's performance script; destinations read `page_viewed` from `window.Shopify.analytics`, so without it GA4 and the other destinations record no page views.
2. **All 7 Standard Events Verified**:
   - Verify in browser DevTools that `page_viewed`, `product_viewed`, `collection_viewed`, `search_viewed`, `cart_viewed`, `product_added_to_cart`, and `product_removed_from_cart` / `cart_updated` all fire (migrated storefronts often accidentally publish only `page_viewed`).
3. **Consent & Deduplication Proof**:
   - Verify zero marketing/analytics destinations fire when consent is denied, buffered events replay once consent is granted, `ProductPayload.price` is read as `MoneyV2` (`{ amount, currencyCode }`), and browser/server `event_id` values match 1:1.
