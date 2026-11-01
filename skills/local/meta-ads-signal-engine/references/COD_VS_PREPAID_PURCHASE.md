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

---

## Delivered-Purchase implementation rules (verified 2026-11-02)

- **Window, not acceptance.** A delivered `Purchase` sent at delivery with `event_time = delivered_at` is always accepted (the 7-day rule is against send time). What drops is attribution: a delivery more than 7 days after the click falls outside the default 7-day-click window. Log click→delivered lag and watch the Dataset Quality API `event_delay` metric.
- **Do not relabel late orders.** `action_source: physical_store` means an in-person store sale and you attest its accuracy; offline events also never dedup with web events.
- **Placement event.** Prefer the standard `InitiateCheckout` for placement if you may ever optimise on it; custom events (`Lead`/`OrderPlaced`) are fine for audiences. Keep the same choice across platforms (TikTok cannot optimise custom events).
- **Kill app-level Purchase for COD.** Shopify's Meta/Google/TikTok channels, WooCommerce plugins (COD orders are `processing` at checkout) and most tracking SaaS fire `Purchase` at placement. A delivered server `Purchase` beside them double-counts: the fallback dedup is browser-first only.
- **Value.** Send the collected amount as `value` (IDR number); put margin in `net_revenue` on the same event. There is no documented way to correct a sent value later; `AppendValue` is predicted-LTV only.
- **RTO/refused.** Never `Purchase`; an optional custom event is for **exclusion** audiences only.
- **Click-to-WhatsApp closings.** Use `action_source: business_messaging`, `messaging_channel: whatsapp`, unhashed `ctwa_clid` (only in the first inbound message `referral`; absent for WhatsApp Status ads). Meta does not dedup business-messaging events, and Automatic Events can double-count if you also send `Purchase`.
- **Hypothesis, not law.** No public A/B evidence shows delivered-only optimisation beats placement for cost per delivered order; volume drops. Treat the optimisation event as a per-account experiment judged on courier data, not Meta ROAS.
