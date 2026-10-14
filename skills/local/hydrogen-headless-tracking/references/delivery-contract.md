# Hydrogen Headless Tracking & Signal Delivery Contract (2026-10 & Classic)

Last verified against `@shopify/hydrogen@2026.10.1` (`skills/hydrogen-analytics/SKILL.md`), `shopify.dev/docs/storefronts/hydrogen/analytics`, and `Shopify/Shopify-AI-Toolkit` on `2026-10-14`.

---

## 1. Hydrogen `2026.10+` Analytics Architecture vs Classic (`<= 2026.4.x`)

| Capability | Hydrogen `2026.10+` (`@shopify/hydrogen@2026.10.1`) | Classic Hydrogen (`<= 2026.4.7`) |
| --- | --- | --- |
| **Root Script & Runtime** | `<ShopifyScripts analytics={{ shop, i18n }} consent={consentConfig} />` from `@shopify/hydrogen/react` (`./vue`), or `renderShopifyScriptTags` + `initializeShopifyScripts` in Astro/SvelteKit. | `<Analytics.Provider cart={cart} shop={shop} consent={consent}>` from `@shopify/hydrogen`. |
| **First-Party Event Proxies** | Owned automatically by `handleShopifyRoutes()`: `/__shopify/*` and `/.well-known/shopify/fec/produce`. | Handled via Oxygen/Hydrogen Vite middleware and CSP headers. |
| **Publishing Route Events** | `window.Shopify?.analytics.publish(AnalyticsEvent.PAGE_VIEWED, payload)` ( plus `PRODUCT_VIEWED`, `COLLECTION_VIEWED`, `SEARCH_VIEWED`, `CART_VIEWED`) in client `useEffect` hooks. | `<Analytics.ProductView>`, `<Analytics.CollectionView>`, `<Analytics.CartView>`, `<Analytics.SearchView>` or `publish()` from `useAnalytics()`. |
| **Publishing Cart Mutations** | `useCartAnalytics()` hook (React/Vue) or `trackCartAnalytics(cartStore)` (core) wired once inside `<CartProvider>`. Automatically emits `product_added_to_cart`, `product_removed_from_cart`, and `cart_updated`. | Handled inside `<Analytics.Provider cart={cart}>` by diffing loader cart state. |
| **Custom Destinations (Meta, GA4/GTM, TikTok)** | `window.Shopify?.analytics.addDestination({ name, setup({ subscribe }) { subscribe(event, (payload, { getTrackingValues }) => ...) } })`. **Note:** `analytics.subscribe()` and `analytics.destroy()` were **removed** in `2026.10.0`! | `subscribe('product_viewed', callback)` inside a child of `<Analytics.Provider>`. |
| **Price Payload Shape** | `ProductPayload.price` and `AnalyticsCartLine.price` are `MoneyV2` objects (`{ amount: string, currencyCode: CurrencyCode }`), matching `CartViewPayload.totalValue`. | `price` was often passed as a string scalar alongside a top-level `currency`. |

---

## 2. Consent Gate & `addDestination` Replay Contract (`2026.10+`)

### Customer Privacy Consent Modes

`<ShopifyScripts>` configures Shopify's Customer Privacy API via the `consent` prop:

1. **Hosted Shopify Banner (`mode: 'auto'`, default)**:
   ```tsx
   <ShopifyScripts
     analytics={{shop, i18n}}
     consent={{mode: 'auto'}}
   />
   ```
2. **Custom Consent Banner (`mode: 'custom-banner'`)**:
   - `setup` is **mandatory** when `mode: 'custom-banner'` is used and must return a `Promise<ConsentPreferences>`:
   ```tsx
   <ShopifyScripts
     analytics={{shop, i18n}}
     consent={{
       mode: 'custom-banner',
       setup: async () => {
         const prefs = await waitForUserConsentBanner();
         return {
           analytics: prefs.analytics,
           marketing: prefs.marketing,
           preferences: prefs.preferences,
           saleOfData: prefs.saleOfData,
         };
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

---

## 3. Cart-to-Checkout Attribution & Purchase Signal Authority

1. **Preserve Click IDs & Browser Identifiers Into Checkout**:
   - Capture `_fbp`, `_fbc` (`fbclid`), `_ga`, `gclid`, `gbraid`, `wbraid`, `ttclid`, `_ttp`, and `utm_*` on landing.
   - Sync non-PII attribution keys to cart attributes (`register('attributeValue', { key, value })` + `register('attributes-update')` in `2026.10+` — remember cart attribute updates replace the full attribute list, so preserve existing cart attributes!) or cart metafields so Shopify Checkout webhooks (`orders/create`, `orders/paid`) receive them on the server.
   - Maintain a shared root domain (`store.example.com` + `checkout.example.com`) so `_shopify_y`, `_shopify_s`, `_fbp`, `_fbc`, and `_ga` cookies survive the `checkoutUrl` redirect.
2. **Purchase Authority Belongs to Shopify Checkout + Server Webhooks**:
   - Never fire an authoritative `Purchase` conversion from the Hydrogen storefront on checkout button click.
   - Browser `checkout_completed` events run inside **Shopify Admin -> Customer events (Web Pixels)** on the hosted Checkout / Thank You page, deduplicated by deterministic `event_id` (`order_id` / `checkout_token`) against server-side CAPI / Google Enhanced Conversions / TikTok Events API v2 (`meta-ads-signal-engine`, `google-ads-signal-engine`, `tiktok-ads-signal-engine`).

---

## 4. Verification & Audit Checklist

1. **Proxy & Script Verification**:
   - Confirm `handleShopifyRoutes()` is wired before the router so `/__shopify/*` and `/.well-known/shopify/fec/produce` return `200`/`204` rather than hitting the app's `404` catch-all.
   - Confirm `<ShopifyScripts analytics={{ shop, i18n }} />` renders in the root document and `useCartAnalytics()` is mounted inside `<CartProvider>`.
2. **All 7 Standard Events Verified**:
   - Verify in browser DevTools that `page_viewed`, `product_viewed`, `collection_viewed`, `search_viewed`, `cart_viewed`, `product_added_to_cart`, and `product_removed_from_cart` / `cart_updated` all fire (migrated storefronts often accidentally publish only `page_viewed`).
3. **Consent & Deduplication Proof**:
   - Verify zero marketing/analytics destinations fire when consent is denied, buffered events replay once consent is granted, `ProductPayload.price` is read as `MoneyV2` (`{ amount, currencyCode }`), and browser/server `event_id` values match 1:1.
