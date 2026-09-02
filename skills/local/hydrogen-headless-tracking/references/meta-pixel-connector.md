# Meta Pixel + Hydrogen Connector Blueprint

> **Historical blueprint, not a canonical provider contract.** Retrieve the
> current provider event and consent specification before implementation; follow
> [Tracking delivery contract](delivery-contract.md).

This blueprint provides the complete, enterprise-grade implementation of a Meta Pixel subscriber component built on `@shopify/hydrogen`'s `useAnalytics()` event bus, featuring **automatic `event_id` deduplication** and background CAPI dispatch.

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
  enableDualCapi?: boolean; // Set true to also trigger server /api/events
  debug?: boolean;
}

export function MetaPixel({pixelId, enableDualCapi = true, debug = false}: MetaPixelProps) {
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

    // Signal Hydrogen that this subscriber is ready
    ready();

    // Helper: Dual dispatch to Server CAPI
    const dispatchCapi = (eventName: string, eventId: string, customData: any) => {
      if (!enableDualCapi) return;
      fetch('/api/events', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          eventName,
          eventId,
          eventSourceUrl: window.location.href,
          customData,
        }),
      }).catch((err) => {
        if (debug) console.warn('[Meta CAPI Dual Dispatch Error]:', err);
      });
    };

    // 2. Event Subscriptions
    
    // PageView
    const unsubscribePageView = subscribe(AnalyticsEvent.PAGE_VIEWED, () => {
      const eventId = `pv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      if (debug) console.log('[Meta Pixel] PageView', eventId);
      window.fbq('track', 'PageView', {}, {eventID: eventId});
    });

    // ViewContent (Product Details Page)
    const unsubscribeProductView = subscribe(
      AnalyticsEvent.PRODUCT_VIEWED,
      (payload: any) => {
        const product = payload.products?.[0];
        if (!product) return;

        const eventId = `vc_${product.id}_${Date.now()}`;
        const contentId = product.id;

        const data = {
          content_name: product.title,
          content_ids: [contentId],
          content_type: 'product',
          value: parseFloat(product.price || '0'),
          currency: payload.currency || 'USD',
        };

        if (debug) console.log('[Meta Pixel] ViewContent', {data, eventId});
        window.fbq('track', 'ViewContent', data, {eventID: eventId});
        dispatchCapi('ViewContent', eventId, data);
      },
    );

    // Collection View / Category
    const unsubscribeCollectionView = subscribe(
      AnalyticsEvent.COLLECTION_VIEWED,
      (payload: any) => {
        const collection = payload.collection;
        if (!collection) return;

        const eventId = `cat_${collection.id}_${Date.now()}`;
        const data = {
          content_name: collection.handle || collection.id,
          content_type: 'product_group',
        };

        if (debug) console.log('[Meta Pixel] ViewCategory', {data, eventId});
        window.fbq('trackCustom', 'ViewCategory', data, {eventID: eventId});
      },
    );

    // AddToCart
    const unsubscribeAddToCart = subscribe(
      AnalyticsEvent.PRODUCT_ADDED_TO_CART,
      (payload: any) => {
        const product = payload.products?.[0];
        if (!product) return;

        const eventId = `atc_${product.id}_${Date.now()}`;
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

        if (debug) console.log('[Meta Pixel] AddToCart', {data, eventId});
        window.fbq('track', 'AddToCart', data, {eventID: eventId});
        dispatchCapi('AddToCart', eventId, data);
      },
    );

    // Search
    const unsubscribeSearch = subscribe(
      AnalyticsEvent.SEARCH_SUBMITTED,
      (payload: any) => {
        if (!payload.searchTerm) return;
        const eventId = `search_${Date.now()}`;
        const data = {
          search_string: payload.searchTerm,
        };

        if (debug) console.log('[Meta Pixel] Search', {data, eventId});
        window.fbq('track', 'Search', data, {eventID: eventId});
      },
    );

    return () => {
      unsubscribePageView();
      unsubscribeProductView();
      unsubscribeCollectionView();
      unsubscribeAddToCart();
      unsubscribeSearch();
    };
  }, [pixelId, enableDualCapi, subscribe, register, ready, debug]);

  return null;
}
```
