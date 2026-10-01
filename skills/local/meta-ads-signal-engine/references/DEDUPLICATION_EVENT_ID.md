# Browser + Server Deduplication & `event_id` Rules

When sending paired events via Meta Pixel (browser) and Conversions API (server), Meta uses `event_id` and `event_name` to deduplicate events. A duplicate is only removed when it arrives **within 48 hours of the first copy Meta received**, and Meta generally keeps the event received first. ([Meta dedup docs](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events), accessed 2026-10-02.)

Meta also documents a fallback that compares `event_name` with `fbp` and/or `external_id`, but it only works when the browser event arrives **first** and the server event second. Do not rely on it: a server event with no matching earlier browser event is never discarded by that path. Always send `event_id`.

---

## The Deduplication Invariant

For Meta to deduplicate a Browser event and a Server CAPI event:
1. `event_name` MUST match exactly (e.g. `Purchase` == `Purchase`).
2. `event_id` MUST be an identical string (case-sensitive) on both browser and server.

```text
BROWSER (Pixel)                     SERVER (CAPI)
fbq('track', 'Purchase',            POST /{version}/{pixel_id}/events
  { value: 299000, ... },           { "data": [{
  { eventID: 'purchase:ORD_101' }      "event_name": "Purchase",
)                                      "event_id": "purchase:ORD_101", ... }] }
       │                                   │
       └──────────────┬────────────────────┘
                      ↓
          META DEDUPLICATION ENGINE
          (Consolidates into 1 event)
```

---

## Canonical `event_id` Generators

```typescript
export function generatePurchaseEventId(orderId: string): string {
  return `purchase:${orderId.trim()}`;
}

export function generateLeadEventId(leadId: string): string {
  return `lead:${leadId.trim()}`;
}

export function generateAddToCartEventId(sessionId: string, sku: string): string {
  return `add_to_cart:${sessionId}:${sku}`;
}
```

---

## Browser Implementation Example (`fbq`)

```javascript
// Browser tracking with eventID option
const orderId = 'ORD-2026-9901';
const eventId = `purchase:${orderId}`;

fbq('track', 'Purchase', {
  value: 299000,
  currency: 'IDR',
  content_ids: ['SKU-GINKLIN-60'],
  content_type: 'product'
}, {
  eventID: eventId
});
```

---

## Common Deduplication Pitfalls

- **Missing `eventID` on Browser**: Sending CAPI with `event_id` while Pixel fires `fbq('track', 'Purchase')` without `eventID` causes Meta to log **2 separate Purchase events** (doubling reported conversions).
- **Random UUIDs**: Generating a new UUID on the browser and a separate UUID on the server prevents Meta from matching the two events.
- **Mismatching Event Names**: Sending `OrderPlaced` on CAPI and `Purchase` on Browser will fail deduplication.
