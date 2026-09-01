# Google Tag Manager (GTM) & GA4 DataLayer Blueprint

This blueprint shows how to bridge Hydrogen's `useAnalytics()` event bus into the standard `window.dataLayer` object so marketing teams can manage Meta, TikTok, GA4, and Pinterest tags directly inside GTM.

---

## 1. GTM DataLayer Connector Component (`app/components/GTMConnector.tsx`)

```tsx
// app/components/GTMConnector.tsx
import {useEffect} from 'react';
import {useAnalytics, AnalyticsEvent} from '@shopify/hydrogen';

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

interface GTMConnectorProps {
  gtmId?: string;
}

export function GTMConnector({gtmId}: GTMConnectorProps) {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('gtm-connector');

  useEffect(() => {
    if (!gtmId) {
      ready();
      return;
    }

    // 1. Initialize dataLayer and GTM script
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(script);

    ready();

    // 2. Map Hydrogen Events to GA4 / GTM eCommerce Schema
    
    // Page View
    const unsubPageView = subscribe(AnalyticsEvent.PAGE_VIEWED, (payload: any) => {
      window.dataLayer?.push({
        event: 'page_view',
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
      });
    });

    // View Item (Product Details)
    const unsubProductView = subscribe(AnalyticsEvent.PRODUCT_VIEWED, (payload: any) => {
      const product = payload.products?.[0];
      if (!product) return;

      window.dataLayer?.push({
        event: 'view_item',
        ecommerce: {
          currency: payload.currency || 'USD',
          value: parseFloat(product.price || '0'),
          items: [
            {
              item_id: product.id,
              item_name: product.title,
              price: parseFloat(product.price || '0'),
              item_brand: product.vendor,
              item_variant: product.variantTitle,
              quantity: 1,
            },
          ],
        },
      });
    });

    // View Item List (Collection)
    const unsubCollectionView = subscribe(AnalyticsEvent.COLLECTION_VIEWED, (payload: any) => {
      const collection = payload.collection;
      if (!collection) return;

      window.dataLayer?.push({
        event: 'view_item_list',
        ecommerce: {
          item_list_id: collection.id,
          item_list_name: collection.handle,
        },
      });
    });

    // Add To Cart
    const unsubAddToCart = subscribe(AnalyticsEvent.PRODUCT_ADDED_TO_CART, (payload: any) => {
      const product = payload.products?.[0];
      if (!product) return;

      window.dataLayer?.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: payload.currency || 'USD',
          value: parseFloat(product.price || '0') * (product.quantity || 1),
          items: [
            {
              item_id: product.id,
              item_name: product.title,
              price: parseFloat(product.price || '0'),
              item_brand: product.vendor,
              quantity: product.quantity || 1,
            },
          ],
        },
      });
    });

    return () => {
      unsubPageView();
      unsubProductView();
      unsubCollectionView();
      unsubAddToCart();
    };
  }, [gtmId, subscribe, register, ready]);

  return null;
}
```
