---
name: meta-ads-signal-engine
description: >-
  End-to-end Meta Ads Conversion Signal Operating System (Pixel, Conversions API / CAPI Graph API v22.0,
  Deduplication event_id, Advanced Matching, _fbp/_fbc attribution preservation, COD vs Prepaid Purchase
  definitions, and CAPI Event Outbox pattern).
  Use when designing, building, auditing, or troubleshooting Meta Ads conversion tracking, pixel setups, CAPI integrations,
  event match quality (EMQ), deduplication bugs, or server-authoritative Purchase signals.
  Triggers: "meta ads", "meta pixel", "capi", "conversions api", "facebook pixel", "event_id deduplication",
  "event match quality", "emq", "meta signal engine", "pixel capi setup".
---

# Meta Ads Signal Engine

An engineering operating system for reliable Meta Ads conversion tracking, Pixel & Conversions API (CAPI) implementation, deterministic event deduplication, customer matching, and attribution preservation.

## Core Philosophy

Tracking quality alone does not guarantee lower Cost Per Acquisition (CPA), but sending **correct, server-authoritative, deduplicated, and matchable conversion signals** ensures Meta's auction algorithms learn from valid business outcomes.

$$\text{Meta Ad Click (_fbp, _fbc)} \longrightarrow \text{Browser Pixel (event_id)} + \text{Server CAPI (v22.0)} \longrightarrow \text{Meta Deduplication Engine}$$

---

## 4 Core Questions Every Signal Must Answer

1. **What happened?** — Correct semantic event (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Lead`, `Purchase`).
2. **What did it happen to?** — Canonical product identity (`content_ids`, `contents`, `value`, `currency`).
3. **Who likely performed it?** — Privacy-compliant matching (`_fbp`, `_fbc`, SHA-256 hashed email/phone/external_id, client_ip_address, client_user_agent).
4. **Did Meta receive exactly ONE event?** — Canonical `event_id`, browser/server deduplication window (48 hours), and transactional outbox.

---

## Skill Reference Manifest

| Task | Read |
| --- | --- |
| CAPI Graph API v22.0 Server Sender & Payload structure | [CAPI v22 Sender Pattern](references/CAPI_V22_SENDER.md) |
| Browser + Server Deduplication & `event_id` rules | [Deduplication & Event ID](references/DEDUPLICATION_EVENT_ID.md) |
| Customer identity matching, E.164 phone normalization, SHA-256 hashing, `_fbp`/`_fbc` rules | [Identity Normalization](references/IDENTITY_NORMALIZATION.md) |
| Purchase event taxonomy for Prepaid vs Cash On Delivery (COD) funnels | [COD vs Prepaid Purchase Signals](references/COD_VS_PREPAID_PURCHASE.md) |
| WeTracked.io / Elevar parity & deep attribution engineering | [WeTracked.io Attribution Parity](references/WETRACKED_ATTRIBUTION_PARITY.md) |

---

## Checklist: 10 Commandments of Meta Signal Architecture

1. **Server-Authoritative Purchase**: Fire `Purchase` from confirmed backend payment or order state, not thank-you page load.
2. **Matching `event_id`**: Browser `fbq('track', 'Purchase', payload, { eventID: id })` and Server CAPI `{ "event_id": id }` MUST share identical string IDs.
3. **Preserve `_fbp` & `_fbc`**: Store `_fbp` and `_fbc` cookies on click and attach them to customer sessions/orders. DO NOT SHA-256 hash `_fbp` or `_fbc`.
4. **Phone & Email Normalization**: Trim and lowercase email before hashing. Format phone numbers in E.164 (e.g. `08...` → `628...`) before SHA-256 hashing.
5. **Canonical `content_ids`**: Match product SKUs between Pixel, CAPI, and Meta Commerce Catalog.
6. **No Fake Micro-Events**: Do NOT map every scroll or CTA click to `Lead` or `Purchase`.
7. **Transactional Outbox**: Store CAPI events in a database outbox (`capi_event_outbox`) and retry failed HTTP requests asynchronously.
8. **Low Latency**: Dispatch CAPI events immediately upon backend state confirmation.
9. **Separate Analytics from Signal Layer**: Keep GA4/PostHog UI events separate from Meta Ads optimization events.
10. **Reconciliation**: Periodically reconcile backend database order totals against Meta reported conversions.
