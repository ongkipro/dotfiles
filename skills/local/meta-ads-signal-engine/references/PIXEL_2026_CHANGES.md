# How the Pixel works and what changed in 2026

Reviewed **2026-11-05**. Read before a new Pixel/CAPI install, an audit, or
explaining a sudden change in reported conversions. Labels: **Meta** = Meta's
own statement; **third-party** = reporting by others.

## How the Pixel and Conversions API work

Overview of mechanics documented by Meta's Pixel and Conversions API developer
pages; detailed rules and sources live in the linked owner references.

1. **Pixel (browser).** `fbq` loads on the page, sets the first-party `_fbp`
   cookie, and stores `_fbc` when the visitor lands with `fbclid`. Each
   `fbq('track', ...)` sends the event, URL and browser context to Meta.
2. **Conversions API (server).** The backend sends the same business event with
   server-derived IP/user agent, hashed customer data and raw `fbp`/`fbc`.
   Server events survive ad blockers, browser limits and closed tabs.
3. **Dataset.** In Events Manager the Pixel is one source inside a **dataset**
   together with server, app, offline and messaging events. The Pixel ID is the
   dataset ID; `fbq` is unchanged (third-party summary of current UI).
4. **Deduplication.** Paired browser/server events in the same dataset share
   `event_name` and `event_id`; Meta deduplicates them when the second copy
   arrives within 48 hours of the first. Ordering rules: `DEDUPLICATION_EVENT_ID.md`.
5. **Matching.** Meta links the event to a person using `fbp`/`fbc`, hashed
   email/phone/`external_id`, IP and user agent. Event Match Quality (EMQ,
   1–10) scores this per event in Events Manager; third-party guides report a
   Dataset Quality API field for it as well. See `IDENTITY_NORMALIZATION.md`.
6. **Attribution and optimization.** A matched event is credited to an ad
   within the ad set's attribution setting and becomes an optimization event
   for delivery. Missing or wrong events teach delivery the wrong objective.

## 2026 changes

| When | Change | Action |
| --- | --- | --- |
| 2026-01-12 | Insights API stopped returning `7d_view` / `28d_view` (Meta). | Do not compare old view-window numbers with current ones. |
| 2026-03 (gradual) | Click-through attribution counts link clicks only; other clicks move to engage-through; engaged video view 10 s → 5 s (Meta). | Expect lower click-attributed and higher engage-through counts; closer to GA4. |
| 2026-04 | **Meta-enabled Conversions API**: one-click, no-code, no-token web server connection added alongside the Pixel; "nothing changes" for existing partner/custom CAPI (Meta). Web events only, not app/offline/messaging (third-party). | Good for Pixel-only sites. A custom CAPI is still needed for backend-confirmed Purchase, COD delivery events, offline/messaging events and full identity control. Do not run both for the same events without one shared `event_id` scheme. |
| 2026-04 | **Pixel AI feature** may add page/product details (name, availability, business details) to events; 30-day notice for existing pixels, then on, adjustable per category in Events Manager (Meta). Not available for some data source categories. | Review the categories shared; keep sensitive data out (advertiser responsibility under Business Tools terms). |
| 2026-11-12 (gradual) | **Measure conversions on customer devices**: eligible pixels match ad views to purchases on the buyer's device; Meta receives only that a purchase happened and which campaign gets credit; works alongside Pixel/CAPI; windows and models unchanged; on by default (Meta). Conditions (Meta Help Center via third-party): not for EU/UK people, Pixel directly on the page (not iframe or img pixel), site requires login by email or phone. | Record a baseline of Meta-attributed vs backend orders before and after. Opt-out per dataset in Events Manager → Data sources → pixel → Settings if attributed sales diverge from orders without explanation. Unknown: value/currency on recovered events, effect on bidding, browser coverage. |
| 2026-05-04 | Marketing API access tiers renamed Limited/Full access; auto-approval threshold 500 calls in 15 days (Meta). | Affects app review for custom integrations, not Pixel itself. |

Meta reports an average 17.8% lower cost per result for advertisers with web
CAPI versus without; no period, sample or method published. Not a forecast.

## Requirements checklist

**Meta feature condition:** on-device conversions require the Pixel directly on
the page (not iframe/img) and email/phone login (see table). Everything below is
this skill's **local** engineering standard, not a Meta eligibility rule.

- Pixel loaded on every relevant page, directly rather than in an iframe.
- Dataset, domain verification and Aggregated Event priorities as Events Manager
  currently requires for the market.
- Server CAPI for the business-confirming event (Purchase/Lead), with outbox
  retries; COD stores follow `COD_VS_PREPAID_PURCHASE.md`.
- Shared `event_id` across browser/server legs; one source of truth if the
  Meta-enabled CAPI is also on.
- `fbp`/`fbc` preserved, real hashed email/phone, stable `external_id`.
- `value` and `currency` on value events; `content_ids` byte-identical to the
  catalog `id`.
- Consent handled for the market before sending identifiers.
- Test Events receipt, dedup and EMQ confirmed; backend reconciliation after.

## Sources (retrieved 2026-11-05)

- [Pixel and Conversions API updates](https://www.facebook.com/business/news/pixel-conversionsapi-updates) (Meta)
- [Click attribution change](https://www.facebook.com/business/news/click-attribution) (Meta, 2026-03-03)
- [Insights API attribution changes](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/) (Meta)
- [Marketing API changelog](https://developers.facebook.com/documentation/ads-commerce/marketing-api/marketing-api-changelog/) (Meta)
- [On-device conversions](https://ppc.land/meta-pixel-will-count-more-conversions-from-nov-12-unless-advertisers-opt-out/) · [Who it applies to](https://www.elsop.com/meta-pixel-on-device-conversions/) (third-party)
- [Meta-enabled CAPI limits](https://ppc.land/metas-free-one-click-conversions-api-is-now-live-no-developer-needed/) (third-party)
