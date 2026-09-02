# Meta Conversions API (CAPI) Server Engine for Hydrogen

> **Historical blueprint, not a canonical provider contract.** Its endpoint,
> API version, event fields, webhook payload assumptions, and delivery claims
> must be replaced with current official provider and Shopify documentation
> before implementation. Follow [Tracking delivery contract](delivery-contract.md)
> for security, consent, and evidence requirements.

> Server-side Conversions API (CAPI) implementation for Hydrogen (Remix) providing 100% conversion delivery, test event verification, and automatic deduplication with browser pixels.

---

## 1. CAPI Sender Service (`app/lib/meta-capi.server.ts`)

```typescript
// app/lib/meta-capi.server.ts
import {buildMetaUserData, RawCustomerData} from './normalizer.server';

export const META_GRAPH_API_VERSION = 'v22.0';

export interface MetaCustomData {
  currency?: string;
  value?: number;
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{id: string; quantity: number; item_price?: number}>;
  order_id?: string;
  num_items?: number;
}

export interface SendCapiEventParams {
  pixelId: string;
  accessToken: string;
  testEventCode?: string; // Set from Meta Events Manager > Test Events
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | string;
  eventId: string; // Must be identical to browser eventID
  eventSourceUrl?: string;
  customerData: RawCustomerData;
  customData?: MetaCustomData;
  clientIp?: string | null;
  clientUserAgent?: string | null;
}

export async function sendMetaCapiEvent({
  pixelId,
  accessToken,
  testEventCode,
  eventName,
  eventId,
  eventSourceUrl,
  customerData,
  customData,
  clientIp,
  clientUserAgent,
}: SendCapiEventParams) {
  if (!pixelId || !accessToken) {
    console.warn('[CAPI] Missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN. Skipping CAPI send.');
    return {success: false, error: 'Missing credentials'};
  }

  const payload: Record<string, any> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: 'website',
        user_data: buildMetaUserData(customerData, clientIp, clientUserAgent),
        custom_data: customData,
      },
    ],
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  const endpoint = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[CAPI] Meta Graph API Error:', result);
      return {success: false, error: result};
    }

    return {success: true, result};
  } catch (error) {
    console.error('[CAPI] Network / Runtime Exception:', error);
    return {success: false, error};
  }
}
```

---

## 2. Storefront Mid-Funnel CAPI Route (`app/routes/api.events.tsx`)

This endpoint receives events from Hydrogen's browser (`AddToCart`, `ViewContent`) and sends an identical server event to Meta CAPI:

```typescript
// app/routes/api.events.tsx
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {sendMetaCapiEvent} from '~/lib/meta-capi.server';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const body = await request.json();
  const {eventName, eventId, eventSourceUrl, customData, customerData} = body;

  const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for');
  const clientUserAgent = request.headers.get('user-agent');

  // Background send to Meta CAPI
  context.waitUntil(
    sendMetaCapiEvent({
      pixelId: context.env.PUBLIC_META_PIXEL_ID,
      accessToken: context.env.META_CAPI_ACCESS_TOKEN,
      testEventCode: context.env.META_TEST_EVENT_CODE, // optional for testing
      eventName,
      eventId,
      eventSourceUrl,
      customerData: customerData || {},
      customData,
      clientIp,
      clientUserAgent,
    }),
  );

  return json({success: true, eventId});
}
```

---

## 3. Order Paid Webhook Receiver (`app/routes/api.webhooks.orders.tsx`)

When a customer completes a purchase, Shopify fires the `orders/paid` webhook. This guarantees the `Purchase` event is sent to Meta with 100% conversion delivery:

```typescript
// app/routes/api.webhooks.orders.tsx
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {sendMetaCapiEvent} from '~/lib/meta-capi.server';

export async function action({request, context}: ActionFunctionArgs) {
  const hmac = request.headers.get('X-Shopify-Hmac-Sha256');
  const topic = request.headers.get('X-Shopify-Topic');

  if (topic !== 'orders/paid' && topic !== 'orders/create') {
    return json({status: 'ignored'});
  }

  const order = await request.json();

  // 1. Extract saved attribution cookies from custom_attributes
  const customAttrs: Array<{name: string; value: string}> = order.note_attributes || [];
  const getAttr = (k: string) => customAttrs.find((a) => a.name === k)?.value || null;

  const fbp = getAttr('_fbp');
  const fbc = getAttr('_fbc');

  const customer = order.customer || {};
  const shippingAddress = order.shipping_address || order.billing_address || {};

  // 2. Fire Server-Side Purchase CAPI
  await sendMetaCapiEvent({
    pixelId: context.env.PUBLIC_META_PIXEL_ID,
    accessToken: context.env.META_CAPI_ACCESS_TOKEN,
    testEventCode: context.env.META_TEST_EVENT_CODE,
    eventName: 'Purchase',
    eventId: `order_${order.id}`, // Canonical shared event_id
    eventSourceUrl: `https://${context.env.PUBLIC_CHECKOUT_DOMAIN}/thank_you`,
    customerData: {
      email: order.email || customer.email,
      phone: shippingAddress.phone || customer.phone,
      firstName: shippingAddress.first_name || customer.first_name,
      lastName: shippingAddress.last_name || customer.last_name,
      city: shippingAddress.city,
      province: shippingAddress.province_code || shippingAddress.province,
      zip: shippingAddress.zip,
      countryCode: shippingAddress.country_code,
      externalId: customer.id ? String(customer.id) : undefined,
      fbp,
      fbc,
    },
    customData: {
      currency: order.currency,
      value: parseFloat(order.total_price || '0'),
      order_id: String(order.id),
      num_items: order.line_items?.length || 0,
      content_type: 'product',
      contents: order.line_items?.map((item: any) => ({
        id: String(item.product_id || item.variant_id),
        quantity: item.quantity,
        item_price: parseFloat(item.price || '0'),
      })),
      content_ids: order.line_items?.map((item: any) => String(item.product_id || item.variant_id)),
    },
    clientIp: order.browser_ip,
    clientUserAgent: order.client_details?.user_agent,
  });

  return json({status: 'processed', orderId: order.id});
}
```
