---
name: tiktok-ads-signal-engine
description: >-
  TikTok Ads conversion signals: Pixel + Events API v2, event_id dedup, Advanced Matching (SHA-256 email/phone), ttclid preservation, VBO/low-CPA signals, server-side purchase. Not Meta or Google signals. Triggers: tiktok pixel, events api v2, ttclid.
---

# TikTok Ads Signal Engine

An engineering operating system for reliable TikTok Ads conversion tracking, TikTok Pixel & Events API v2 implementation, deterministic event deduplication (`event_id`), customer identity matching, and `ttclid` attribution preservation for low CPA/CPR optimization.

---

## Core Philosophy

TikTok's auction algorithm and Value-Based Optimization (VBO) rely heavily on **server-authoritative, deduplicated conversion signals** paired with accurate customer match parameters (`ttclid`, SHA-256 hashed phone/email).

$$\text{TikTok Ad Click (ttclid)} \longrightarrow \text{Browser Pixel (event_id)} + \text{Server Events API v2} \longrightarrow \text{TikTok Attribution & Deduplication Engine}$$

---

## 4 Core Signal Requirements

1. **What happened?** — Correct semantic event (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, `Lead`). TikTok renamed `CompletePayment` → `Purchase` and `SubmitForm` → `Lead` in May 2025; legacy names are still accepted and auto-converted, but new setups should use the new names. `PlaceAnOrder` is being sunset (2027) — do not adopt it. **Custom events can be used for audiences but not for optimisation**, so any event you may optimise on must be a standard event.
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

## Checklist: 9 Commandments of TikTok Signal Architecture

1. **Server-Authoritative `Purchase`**: Fire `Purchase` (legacy `CompletePayment`) from confirmed backend payment/order status. Use the same name on both legs; do not mix legacy and new names for one event.
2. **Matching `event_id`**: Send identical `event_id` in browser `ttq.track('Purchase', payload, { event_id: id })` and server Events API payload `{ "event_id": id }`.
3. **Preserve `ttclid` & `ttp`**: Capture `ttclid` (URL param `?ttclid=...`) and `_ttp` cookie on landing and persist them in user session/order table.
4. **Normalize & SHA-256 Hash Identifiers**: Lowercase & trim emails before hashing. Format phone numbers as `+E.164` (`+62812...`, no spaces or dashes) before SHA-256 — unlike Meta, which drops the `+`. Server field name is `phone`; the Pixel `identify` key is `phone_number`. Re-check TikTok's current Events API page; it has a documented exception for country code 86.
5. **Set Canonical `content_id`**: Match product SKUs between TikTok Catalog and conversion payload.
6. **Prepaid vs COD Signals**: Map COD order placement to the standard `InitiateCheckout` (a custom event cannot be optimised), and fire `Purchase` on confirmed collection, `event_time` = collection time. Set the ad group's click-through window to 28 days **at creation** (it cannot be changed after publishing) so courier delays stay attributable. The official WooCommerce plugin fires `Purchase` on both `woocommerce_payment_complete` and `woocommerce_thankyou` with a fresh `event_id` each time (two undeduplicable Purchases, at placement for COD) — disable it for COD. TikTok Shop / Tokopedia orders are measured in-app and need no Events API. Collection-time `Purchase` arrives too late to pair with any browser event, so send it server-only.
7. **Transactional Outbox & Retries**: Queue server events in a database outbox table and process asynchronously. Success is HTTP 200 **and** body `code === 0`; retry 5xx and `40100` (throttled) with backoff; `40001`/`40104` mean reconnect, not retry; `40002` is a bad payload: isolate an event only when `message` names a `data.<index>` path; otherwise fix the request-level cause (invalid JSON, > 1,000 events → rebatch) and keep the events for correction rather than dropping them. Field contract and error table: [TIKTOK_EVENTS_API_V2.md §2a](references/TIKTOK_EVENTS_API_V2.md#2a-field-contract-official-eventtrack-reference-read-in-a-browser-2026-11-12).
8. **No server PageView, and `page.url` always**: Events API has no page-view standard event (`ttq.page()` stays browser-only), and every web event must carry `page.url` — for a delayed server event, the URL stored with the order.
9. **Client IP & User Agent**: Always pass the real client `ip` and `user_agent` in server payloads. Read IP from your platform's trusted header (e.g. `CF-Connecting-IP` behind Cloudflare); a raw `x-forwarded-for` first hop is client-controlled.

## Sources (accessed 2026-10-02; field names, plugin and window re-checked 2026-11-02)

- Updated standard events (May 2025 renames; legacy names auto-converted): https://ads.tiktok.com/resources/help/article/how-to-adopt-tiktoks-updated-standard-events?lang=en
- Supported standard events list: https://ads.tiktok.com/help/article/supported-standard-events
- Event deduplication (5-minute merge, 48-hour window, first event kept): https://ads.tiktok.com/help/article/event-deduplication
- Events API 2.0 reference (JavaScript-rendered; the `+E.164` phone rule was read from TikTok's docs via search index, re-confirm in a browser): https://business-api.tiktok.com/portal/docs/events-api-2.0/v1.3
- Pixel `ttq.identify` keys (`email`, `phone_number`): https://business-api.tiktok.com/gateway/docs/index?doc_id=1739585700402178
- `/event/track/` parameters, supported events, deduplication, responses and errors (read in a browser 2026-11-12): https://business-api.tiktok.com/portal/docs?id=1771101303285761, ?id=1771101186666498, ?id=1771100965992450, ?id=1771101162079234
- Official WooCommerce plugin read (tiktok-for-business 1.4.3, `pixel/tt4b_pixel.php`): https://wordpress.org/plugins/tiktok-for-business/
