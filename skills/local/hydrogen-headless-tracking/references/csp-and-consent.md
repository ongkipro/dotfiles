# Content Security Policy (CSP) & Customer Consent in Hydrogen

---

## 1. Content Security Policy (CSP) Whitelisting

Hydrogen automatically creates a Content Security Policy header on every response via `createContentSecurityPolicy` in `app/entry.server.tsx`.

When adding tracking tools (Meta, Google, TikTok, Hotjar, Pinterest), you must whitelist their script hosts, image beacons, and telemetry endpoints.

### Complete Production CSP Example (`app/entry.server.tsx`)

```typescript
// app/entry.server.tsx
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    // 1. Script sources (where JS can be downloaded from)
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://connect.facebook.net',
      'https://www.googletagmanager.com',
      'https://*.google-analytics.com',
      'https://analytics.tiktok.com',
    ],
    // 2. Connect sources (where fetch / XMLHttpRequest / beacon can send data)
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com', // Shopify Native Analytics
      'https://*.shopify.com',
      'https://www.facebook.com',
      'https://connect.facebook.net',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
      'https://analytics.tiktok.com',
    ],
    // 3. Image sources (for 1x1 tracking beacons)
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      'https://www.facebook.com',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://analytics.tiktok.com',
    ],
    // 4. Frame sources (if GTM or pixels use iframes)
    frameSrc: [
      "'self'",
      'https://www.googletagmanager.com',
    ],
  });

  // Inject CSP header into response
  responseHeaders.set('Content-Security-Policy', header);

  // ... rest of handleRequest
}
```

---

## 2. Customer Privacy API & Consent Banner Integration

Shopify's Customer Privacy API manages privacy compliance (GDPR, CCPA/CPRA, and Google Consent Mode v2) across both Headless Storefronts and Shopify Checkout.

### Consent Configuration in `app/root.tsx`

```typescript
// app/root.tsx
export async function loader({context}: LoaderFunctionArgs) {
  return defer({
    shop: getShopAnalytics({
      storefront: context.storefront,
      publicStorefrontId: context.env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: context.env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true, // Enables Shopify's native privacy & consent synchronization
    },
  });
}
```

### Triggering Consent from Custom Cookie Banner

When a buyer clicks "Accept All" or "Reject" on your custom banner component:

```typescript
// Grant tracking consent
export function acceptTrackingConsent() {
  if (typeof window !== 'undefined' && window.Shopify?.customerPrivacy) {
    window.Shopify.customerPrivacy.setTrackingConsent(true, () => {
      console.log('[Consent] Tracking consent granted');
    });
  }
}

// Deny tracking consent
export function rejectTrackingConsent() {
  if (typeof window !== 'undefined' && window.Shopify?.customerPrivacy) {
    window.Shopify.customerPrivacy.setTrackingConsent(false, () => {
      console.log('[Consent] Tracking consent denied');
    });
  }
}
```
