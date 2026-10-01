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

1. **What happened?** — Correct semantic event (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, `Lead`). TikTok renamed `CompletePayment` → `Purchase` and `SubmitForm` → `Lead` in May 2025; legacy names are still accepted and auto-converted, but new setups should use the new names. `PlaceAnOrder` is not in TikTok's current standard-event list — verify before relying on it, or send a custom event.
2. **What did it happen to?** — Canonical product payload (`contents`: `[{ content_id, content_type, quantity, price }]`, `value`, `currency`).
3. **Who likely performed it?** — Hashed identity & tracking IDs (`ttclid`, `ttp` cookie, SHA-256 hashed email, E.164 SHA-256 hashed phone, `client_ip_address`, `user_agent`).
4. **Did TikTok receive exactly ONE event?** — Identical `event` name and `event_id` on browser (`ttq.track`) and server (`/open_api/<version>/event/track/`). Pixel + Events API copies are merged when they arrive within 5 minutes, and deduplicated (first received kept) up to 48 hours after the first event.

---

## Skill Reference Manifest

| Task | Read |
| --- | --- |
| TikTok Events API v2 Server Sender & Payload structure | [TikTok Events API v2 Sender](references/TIKTOK_EVENTS_API_V2.md) |
| Multi-Platform Product Taxonomy & Audit Checklist | `google-ads-signal-engine` references (`ADVERTISING_TAXONOMY_AND_FEED_AUDIT.md`) |
| Catalog identity & event deduplication invariants | `meta-ads-signal-engine` |


## API Version Boundary

`Events API v2` is the product/payload contract; its `/open_api/<marketing-api-version>/` endpoint segment is versioned separately. The exact endpoint and its dated provenance live only in [TIKTOK_EVENTS_API_V2.md](references/TIKTOK_EVENTS_API_V2.md).

Before writing or changing sender code, verify the current server-events endpoint in TikTok's [official Marketing API documentation](https://ads.tiktok.com/marketing_api/docs) and changelog. Pin the verified segment in the reference's single `TIKTOK_MARKETING_API_VERSION` constant, record the verification date, and exercise TikTok's test/sandbox flow. Never infer a new version from the product name or silently bump a deployed integration.

---

## Checklist: 8 Commandments of TikTok Signal Architecture

1. **Server-Authoritative `Purchase`**: Fire `Purchase` (legacy `CompletePayment`) from confirmed backend payment/order status. Use the same name on both legs; do not mix legacy and new names for one event.
2. **Matching `event_id`**: Send identical `event_id` in browser `ttq.track('Purchase', payload, { event_id: id })` and server Events API payload `{ "event_id": id }`.
3. **Preserve `ttclid` & `ttp`**: Capture `ttclid` (URL param `?ttclid=...`) and `_ttp` cookie on landing and persist them in user session/order table.
4. **Normalize & SHA-256 Hash Identifiers**: Lowercase & trim emails before hashing. Format phone numbers as `+E.164` (`+62812...`, no spaces or dashes) before SHA-256 — unlike Meta, which drops the `+`. Re-check TikTok's current Events API page; it has a documented exception for country code 86.
5. **Set Canonical `content_id`**: Match product SKUs between TikTok Catalog and conversion payload.
6. **Prepaid vs COD Signals**: Map COD order placement to `InitiateCheckout` or a custom event, and fire `Purchase` on confirmed collection. Collection-time `Purchase` arrives too late to pair with any browser event, so send it server-only.
7. **Transactional Outbox & Retries**: Queue server events in a database outbox table and process asynchronously with retries on 5xx network errors.
8. **Client IP & User Agent**: Always pass the real client `ip` and `user_agent` in server payloads. Read IP from your platform's trusted header (e.g. `CF-Connecting-IP` behind Cloudflare); a raw `x-forwarded-for` first hop is client-controlled.

## Sources (accessed 2026-10-02)

- Updated standard events (May 2025 renames; legacy names auto-converted): https://ads.tiktok.com/resources/help/article/how-to-adopt-tiktoks-updated-standard-events?lang=en
- Supported standard events list: https://ads.tiktok.com/help/article/supported-standard-events
- Event deduplication (5-minute merge, 48-hour window, first event kept): https://ads.tiktok.com/help/article/event-deduplication
- Events API 2.0 reference (JavaScript-rendered; the `+E.164` phone rule was read from TikTok's docs via search index, re-confirm in a browser): https://business-api.tiktok.com/portal/docs/events-api-2.0/v1.3
