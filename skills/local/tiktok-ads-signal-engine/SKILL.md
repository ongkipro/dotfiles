---
name: tiktok-ads-signal-engine
description: >-
  End-to-end TikTok Ads Conversion Signal Operating System (TikTok Pixel, Events API v2,
  Deduplication event_id, Advanced Matching with SHA-256 email/phone, ttclid attribution preservation,
  and VBO/Low-CPA Signal Engine).
  Use when designing, building, auditing, or troubleshooting TikTok Ads conversion tracking, TikTok Pixel,
  Events API v2 integration, event match quality, ttclid tracking, or server-side purchase signals.
  Triggers: "tiktok ads", "tiktok pixel", "tiktok events api", "events api v2", "ttclid", "tiktok conversion tracking",
  "tiktok signal engine", "tiktok cpa optimization".
---

# TikTok Ads Signal Engine

An engineering operating system for reliable TikTok Ads conversion tracking, TikTok Pixel & Events API v2 implementation, deterministic event deduplication (`event_id`), customer identity matching, and `ttclid` attribution preservation for low CPA/CPR optimization.

---

## Core Philosophy

TikTok's auction algorithm and Value-Based Optimization (VBO) rely heavily on **server-authoritative, deduplicated conversion signals** paired with accurate customer match parameters (`ttclid`, SHA-256 hashed phone/email).

$$\text{TikTok Ad Click (ttclid)} \longrightarrow \text{Browser Pixel (event_id)} + \text{Server Events API v2} \longrightarrow \text{TikTok Attribution & Deduplication Engine}$$

---

## 4 Core Signal Requirements

1. **What happened?** — Correct semantic event (`ViewContent`, `AddToCart`, `InitiateCheckout`, `PlaceAnOrder`, `CompletePayment`).
2. **What did it happen to?** — Canonical product payload (`contents`: `[{ content_id, content_type, quantity, price }]`, `value`, `currency`).
3. **Who likely performed it?** — Hashed identity & tracking IDs (`ttclid`, `ttp` cookie, SHA-256 hashed email, E.164 SHA-256 hashed phone, `client_ip_address`, `user_agent`).
4. **Did TikTok receive exactly ONE event?** — Matching `event_id` string on both browser (`ttq.track`) and server (`/v2/place`).

---

## Skill Reference Manifest

| Task | Read |
| --- | --- |
| TikTok Events API v2 Server Sender & Payload structure | [TikTok Events API v2 Sender](references/TIKTOK_EVENTS_API_V2.md) |
| Multi-Platform Product Taxonomy, Custom Labels & 12-Point Audit Checklist | Load `skills/local/google-ads-signal-engine/references/ADVERTISING_TAXONOMY_AND_FEED_AUDIT.md` |

---

## Checklist: 8 Commandments of TikTok Signal Architecture

1. **Server-Authoritative `CompletePayment`**: Fire `CompletePayment` from confirmed backend payment/order status.
2. **Matching `event_id`**: Send identical `event_id` in browser `ttq.track('CompletePayment', payload, { event_id: id })` and server Events API payload `{ "event_id": id }`.
3. **Preserve `ttclid` & `ttp`**: Capture `ttclid` (URL param `?ttclid=...`) and `_ttp` cookie on landing and persist them in user session/order table.
4. **Normalize & SHA-256 Hash Identifiers**: Lowercase & trim emails before hashing. Format phone numbers in E.164 (`62812...`) before SHA-256 hashing.
5. **Set Canonical `content_id`**: Match product SKUs between TikTok Catalog and conversion payload.
6. **Prepaid vs COD Signals**: Map COD orders to `PlaceAnOrder` or `CompletePayment` based on merchant risk tolerance; fire `CompletePayment` upon cash collection for zero fake-attribution.
7. **Transactional Outbox & Retries**: Queue server events in a database outbox table and process asynchronously with retries on 5xx network errors.
8. **Client IP & User Agent**: Always pass real client `ip` (`x-forwarded-for`) and `user_agent` in server payloads.
