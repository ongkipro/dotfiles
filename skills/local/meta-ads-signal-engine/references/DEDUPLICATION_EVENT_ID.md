# Browser + Server Deduplication & `event_id` Rules

When sending paired events via Meta Pixel (browser) and Conversions API (server), Meta uses `event_id` and `event_name` to deduplicate events received within a **48-hour deduplication window**.

---

## The Deduplication Invariant

For Meta to deduplicate a Browser event and a Server CAPI event:
1. `event_name` MUST match exactly (e.g. `Purchase` == `Purchase`).
2. `event_id` MUST be an identical string (case-sensitive) on both browser and server.

```text
BROWSER (Pixel)                     SERVER (CAPI)
fbq('track', 'Purchase',            POST /v22.0/{pixel_id}/events
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
