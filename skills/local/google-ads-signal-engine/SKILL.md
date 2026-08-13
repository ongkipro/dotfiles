---
name: google-ads-signal-engine
description: >-
  End-to-end Google Ads Conversion Signal Operating System (Google Tag / gtag.js, GTM, Server-Side GTM / sGTM,
  Enhanced Conversions for Web & API, Consent Mode v2, transaction_id deduplication, Click-IDs gclid/gbraid/wbraid,
  COD vs Prepaid conversion taxonomy, and Google Ads API v18+ Offline Conversion Uploads).
  Use when designing, building, auditing, or troubleshooting Google Ads conversion tracking, sitewide tags, Consent Mode v2,
  Enhanced Conversions, target CPA / target ROAS Smart Bidding signals, or offline CRM conversion uploads.
  Triggers: "google ads", "google tag", "gtag", "enhanced conversions", "consent mode v2", "gclid", "gbraid", "wbraid",
  "google conversion tracking", "offline conversion upload", "google signal engine", "google conversion setup".
---

# Google Ads Signal Engine

An engineering operating system for reliable Google Ads conversion measurement, sitewide Google Tag (`gtag.js`) / GTM architecture, Consent Mode v2 compliance, Enhanced Conversions, Click-ID preservation, and offline CRM conversion uploads.

## Core Philosophy

Smart Bidding (Target CPA, Target ROAS, Maximize Conversions) relies heavily on **conversion signal quality, value accuracy, and deduplication**. Sending incomplete or duplicated conversion data distorts bidding models and wastes ad spend.

$$\text{Google Ad Click (gclid, gbraid, wbraid)} \longrightarrow \text{Sitewide Tag / GTM + Consent Mode v2} \longrightarrow \text{Enhanced Conversions (Web & API)}$$

---

## 4 Core Questions Every Google Signal Must Answer

1. **What business action occurred?** — Correct Primary vs Secondary conversion action (`Purchase`, `Lead`, `QualifiedLead`).
2. **Did it produce valid economic value?** — Accurate `value`, ISO 4217 `currency` (e.g. `IDR`), and canonical `transaction_id`.
3. **Who performed it?** — First-party customer matching via Enhanced Conversions (`email`, `phone_number`, address).
4. **Where did the click originate?** — Preserved click identifiers (`gclid`, `gbraid`, `wbraid`) across sessions and subdomains.

---

## Skill Reference Manifest

| Task | Read |
| --- | --- |
| Consent Mode v2 configuration (`ad_storage`, `ad_user_data`, `ad_personalization`) | [Consent Mode v2 Specification](references/CONSENT_MODE_V2.md) |
| Enhanced Conversions Web setup & Google Ads API v18+ Offline Uploads | [Enhanced Conversions & API](references/ENHANCED_CONVERSIONS.md) |
| `transaction_id` deduplication, dynamic value rules, and count settings | [Transaction ID & Deduplication](references/TRANSACTION_ID_DEDUPLICATION.md) |
| Preserving `gclid`, `gbraid`, `wbraid` across checkout and CRM funnels | [Click ID Preservation](references/CLICK_ID_PRESERVATION.md) |
| Google Product Category (`google_product_category`) & PMax AI feed optimization | [Google Product Category Feed](references/GOOGLE_PRODUCT_CATEGORY_FEED.md) |

---

## Checklist: 10 Commandments of Google Signal Architecture

1. **Primary vs Secondary Goals**: Set only real revenue events (`Purchase`, confirmed `Lead`) as **Primary** conversion actions for bidding.
2. **Consent Mode v2**: Initialize `ad_storage`, `ad_user_data`, `ad_personalization`, and `analytics_storage` to `denied` by default, updating to `granted` upon CMP banner accept.
3. **Unique `transaction_id`**: Always pass `transaction_id` matching your backend `order_id` to prevent duplicate purchase counting.
4. **Enhanced Conversions**: Set `user_data` with customer email and phone (E.164 format) for all conversion actions.
5. **Preserve Click IDs**: Capture `gclid`, `gbraid`, `wbraid` upon landing page entry and pass them through session storage / database orders.
6. **Conversion Linker**: Run Conversion Linker sitewide across all subdomains and checkout domains.
7. **Clean Values**: Pass raw numeric `value` (e.g. `549000`) and standard uppercase `currency` (`IDR`, `USD`). Never pass formatted strings like `"Rp 549.000"`.
8. **Server / Offline Uploads**: Upload delayed COD deliveries or offline CRM sales via Google Ads API v18+ using `transaction_id` or `gclid`.
9. **Separate Analytics**: Keep GA4 engagement events separate from Google Ads conversion bidding goals.
10. **Reconciliation**: Periodically audit Google Ads reported conversions against backend accounting truth.
