# COD vs Prepaid Purchase Signals & Event Taxonomy

The definition of a `Purchase` event determines what outcome Meta's ad algorithm learns to reproduce.

---

## 1. Prepaid Funnel Taxonomy

In prepaid ecommerce (Credit Card, E-Wallet, QRIS, Virtual Account), payment is verified instantly.

```text
User Action                       System Event                  Meta Event
─────────────────────────────────────────────────────────────────────────────
Views Product page                Page Rendered                 ViewContent
Clicks "Buy Now"                  Cart / Checkout State         InitiateCheckout
Completes Payment                 Gateway Webhook (PAID)         Purchase (CAPI + Pixel)
```

**Prepaid Rule**: `Purchase` MUST be server-authoritative upon payment status becoming `PAID`.

---

## 2. Cash On Delivery (COD) Funnel Taxonomy

In COD funnels (popular in SE Asia / Indonesia), form submission does NOT guarantee cash collection. Treating form submission as `Purchase` causes Meta to optimize for fake, unserviceable, or high-cancel orders.

### Weak COD Setup (DO NOT USE)
```text
Form Submitted  ──► Fire Purchase  ──► Meta learns fake/unreachable leads (High Cancellation CPA)
```

### High-Signal COD Setup (RECOMMENDED)
```text
User Action                       System Event                  Meta Event
─────────────────────────────────────────────────────────────────────────────
Submits COD Order Form            Order Created (UNCONFIRMED)   Lead / OrderPlaced (Custom)
Admin Confirms via Call/WA        Order Status = CONFIRMED      QualifiedLead (Custom)
Courier Collects Cash & Delivers   Order Status = DELIVERED      Purchase (CAPI Server)
```

---

## COD Trade-off Matrix

| COD Purchase Timing | Signal Quality | Event Volume | Latency | Recommended Use Case |
| --- | --- | --- | --- | --- |
| **Form Submitted** | Low (includes fake/cancels) | High | Immediate | Low volume testing only |
| **Admin Confirmed** | Medium-High | Medium | Ops-dependent (measure your own confirmation lag) | Standard COD balance |
| **Cash Delivered** | Highest (collected revenue only) | Lower | Courier-dependent, usually days | High volume COD scale |

Latency matters: Meta only deduplicates within 48 hours, so a delivery-time server `Purchase` will not pair with a browser event and must not have one. Meta also rejects the **entire request** when any `event_time` in `data` is more than 7 days in the past ([server event parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event), accessed 2026-10-02): stamp the COD `Purchase` with the delivery/collection time, send it promptly, and never batch a stale event with fresh ones. Measure your real confirmation and delivery lag from order timestamps; the labels above are qualitative, not benchmarks.
