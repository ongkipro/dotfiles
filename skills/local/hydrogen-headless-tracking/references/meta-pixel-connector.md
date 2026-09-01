# Meta Pixel + Hydrogen Connector Blueprint

This blueprint provides the complete, copy-paste-ready implementation of a Meta Pixel subscriber component built on `@shopify/hydrogen`'s `useAnalytics()` event bus.

---

## 1. Meta Pixel Subscriber Component (`app/components/MetaPixel.tsx`)

```tsx
// app/components/MetaPixel.tsx
import {useEffect} from 'react';
import {useAnalytics, AnalyticsEvent} from '@shopify/hydrogen';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

interface MetaPixelProps {
  pixelId?: string;
  debug?: boolean;
}

export function MetaPixel({pixelId, debug = false}: MetaPixelProps) {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('meta-pixel');

  useEffect(() => {
    if (!pixelId) {
      ready();
      return;
    }

    // 1. Initialize Meta Pixel Base Script
    if (!window.fbq) {
      /* eslint-disable */
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js',
      );
      /* eslint-enable */

      window.fbq('init', pixelId);
    }

    // Signal Hydrogen that this subscriber is initialized and ready to receive events
    ready();

    // 2. Event Subscriptions
    
    // PageView (fires on initial load and every SPA route change)
    const unsubscribePageView = subscribe(AnalyticsEvent.PAGE_VIEWED, () => {
      if (debug) console.log('[Meta Pixel] PageView');
      window.fbq('track', 'PageView');
    });

    // ViewContent (Product Details Page)
    const unsubscribeProductView = subscribe(
      AnalyticsEvent.PRODUCT_VIEWED,
      (payload: any) => {
        const product = payload.products?.[0];
        if (!product) return;

        // Strip Shopify GID prefix if your feed uses plain numeric IDs:
        // const rawId = product.id.replace('gid://shopify/Product/', '');
        const contentId = product.id;

        const data = {
          content_name: product.title,
          content_ids: [contentId],
          content_type: 'product',
          value: parseFloat(product.price || '0'),
          currency: payload.currency || 'USD',
        };

        if (debug) console.log('[Meta Pixel] ViewContent', data);
        window.fbq('track', 'ViewContent', data);
      },
    );

    // Collection View / Category
    const unsubscribeCollectionView = subscribe(
      AnalyticsEvent.COLLECTION_VIEWED,
      (payload: any) => {
        const collection = payload.collection;
        if (!collection) return;

        if (debug) console.log('[Meta Pixel] ViewCategory', collection);
        window.fbq('trackCustom', 'ViewCategory', {
          content_name: collection.handle || collection.id,
          content_type: 'product_group',
        });
      },
    );

    // AddToCart
    const unsubscribeAddToCart = subscribe(
      AnalyticsEvent.PRODUCT_ADDED_TO_CART,
      (payload: any) => {
        const product = payload.products?.[0];
        if (!product) return;

        const contentId = product.id;
        const quantity = product.quantity || 1;
        const unitPrice = parseFloat(product.price || '0');

        const data = {
          content_name: product.title,
          content_ids: [contentId],
          content_type: 'product',
          value: unitPrice * quantity,
          currency: payload.currency || 'USD',
        };

        if (debug) console.log('[Meta Pixel] AddToCart', data);
        window.fbq('track', 'AddToCart', data);
      },
    );

    // Search
    const unsubscribeSearch = subscribe(
      AnalyticsEvent.SEARCH_SUBMITTED,
      (payload: any) => {
        if (!payload.searchTerm) return;
        if (debug) console.log('[Meta Pixel] Search', payload.searchTerm);
        window.fbq('track', 'Search', {
          search_string: payload.searchTerm,
        });
      },
    );

    return () => {
      // Cleanup subscriptions on unmount
      unsubscribePageView();
      unsubscribeProductView();
      unsubscribeCollectionView();
      unsubscribeAddToCart();
      unsubscribeSearch();
    };
  }, [pixelId, subscribe, register, ready, debug]);

  return null;
}
```

---

## 2. Mounting inside `app/root.tsx`

```tsx
// app/root.tsx
import {Analytics, getShopAnalytics} from '@shopify/hydrogen';
import {MetaPixel} from '~/components/MetaPixel';

export async function loader({context}: LoaderFunctionArgs) {
  return defer({
    shop: getShopAnalytics({
      storefront: context.storefront,
      publicStorefrontId: context.env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: context.env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
    },
    metaPixelId: context.env.PUBLIC_META_PIXEL_ID,
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
      <Layout>
        <Outlet />
      </Layout>
      <MetaPixel pixelId={data.metaPixelId} debug={process.env.NODE_ENV === 'development'} />
    </Analytics.Provider>
  );
}
```
