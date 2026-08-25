---
name: google-ads-signal-engine
description: >-
  End-to-end Google Ads Conversion Signal Operating System (Google Tag / gtag.js, GTM, Server-Side GTM / sGTM,
  Enhanced Conversions for Web & API, Consent Mode v2, transaction_id deduplication, Click-IDs gclid/gbraid/wbraid,
  COD vs Prepaid conversion taxonomy, and Google Ads API Offline Conversion Uploads).
  Use when designing, building, auditing, or troubleshooting Google Ads conversion tracking, sitewide tags, Consent Mode v2,
  Enhanced Conversions, target CPA / target ROAS Smart Bidding signals, or offline CRM conversion uploads.
  Triggers: "google ads", "google tag", "gtag", "enhanced conversions", "consent mode v2", "gclid", "gbraid", "wbraid",
  "google conversion tracking", "offline conversion upload", "google signal engine", "google conversion setup".
---

# Google Ads Signal Engine

An engineering operating system for reliable Google Ads conversion measurement, sitewide Google Tag (`gtag.js`) / GTM architecture, Consent Mode v2 compliance, Enhanced Conversions, Click-ID preservation, and offline CRM conversion uploads.

## Verify the API version before writing code

**Never hardcode a Google Ads API version from memory or from these notes.** Google ships a major version roughly quarterly and sunsets older ones on a published schedule; a version written down here rots fast. (These notes said `v18+` while the shipping version was `v25`.)

| Check | Where |
| --- | --- |
| Current Google Ads API version + sunset dates | `https://developers.google.com/google-ads/api/docs/release-notes` |
| gtag / Consent Mode parameters | `https://developers.google.com/tag-platform/gtagjs/reference` |

Pin it once in config, never inline across call sites.

## Core Philosophy

Smart Bidding (Target CPA, Target ROAS, Maximize Conversions) relies heavily on **conversion signal quality, value accuracy, and deduplication**. Sending incomplete or duplicated conversion data distorts bidding models and wastes ad spend.

$$\text{Google Ad Click (gclid, gbraid, wbraid)} \longrightarrow \text{Sitewide Tag / GTM + Consent Mode v2} \longrightarrow \text{Enhanced Conversions (Web & API)}$$

---

## 4 Core Questions Every Google Signal Must Answer

1. **What business action occurred?** — Correct Primary vs Secondary conversion action (`Purchase`, `Lead`, `QualifiedLead`).
2. **Did it produce valid economic value?** — Accurate `value`, ISO 4217 `currency` (e.g. `IDR`), and canonical `transaction_id`.
3. **Who performed it?** — First-party customer matching via Enhanced Conversions (`email`, `phone_number`, address).
4. **Where did the click originate?** — Preserved click identifiers (`gclid`, `gbraid`, `wbraid`) across sessions and subdomains.

## Configuration contract before code

Freeze the ownership of every Google conversion action before adding a tag:

| Concern | Contract |
| --- | --- |
| Direct Google tag | One valid `AW-…` tag ID plus one conversion label; both or neither |
| GTM | May own GA4/dataLayer handling, but must not fire the same Google Ads conversion action as the direct tag |
| `transaction_id` | Stable backend order identity; never blank, browser-minted, or a payment-provider attempt ID |
| Enhanced conversions | Real first-party data only; consent and account setup are prerequisites |
| Consent Mode | Actual policy by jurisdiction and CMP behavior, initialized before `config` or `event` |

Do not make direct Google Ads and GTM mutually exclusive merely because both are
configured: GTM may legitimately consume ecommerce events for GA4. The invariant
is narrower—exactly one owner fires each Google Ads conversion action. Two paths
to the same `send_to` double-count while every local tag check appears healthy.

Environment fallback is configuration, not a bypass. Validate its `AW-…` ID and
label with the same atomic rule as dashboard settings; disable a malformed pair
rather than emitting a broken `send_to`.

Never use a synthetic payment-provider email, unavailable identity field, or an
empty-string hash for enhanced conversions.

---

---

## Skill Reference Manifest

| Task | Read |
| --- | --- |
| Consent Mode v2 configuration (`ad_storage`, `ad_user_data`, `ad_personalization`) | [Consent Mode v2 Specification](references/CONSENT_MODE_V2.md) |
| Enhanced Conversions Web setup & Google Ads API Offline Uploads | [Enhanced Conversions & API](references/ENHANCED_CONVERSIONS.md) |
| `transaction_id` deduplication, dynamic value rules, and count settings | [Transaction ID & Deduplication](references/TRANSACTION_ID_DEDUPLICATION.md) |
| Preserving `gclid`, `gbraid`, `wbraid` across checkout and CRM funnels | [Click ID Preservation](references/CLICK_ID_PRESERVATION.md) |
| Google Product Category (`google_product_category`) & PMax AI feed optimization | [Google Product Category Feed](references/GOOGLE_PRODUCT_CATEGORY_FEED.md) |
| Master Advertising Taxonomy, Custom Labels, Schema.org & 12-Point System Audit | [Advertising Taxonomy & Feed Audit](references/ADVERTISING_TAXONOMY_AND_FEED_AUDIT.md) |

---

## Checklist: 10 Commandments of Google Signal Architecture

1. **Primary vs Secondary Goals**: Set only real revenue events (`Purchase`, confirmed `Lead`) as **Primary** conversion actions for bidding.
2. **Consent Mode v2**: Set defaults before `config` or `event`; scope them to the jurisdictions where the actual consent banner and policy apply, then update on the user's stored choice. Do not grant or deny globally by reflex.
3. **Unique `transaction_id`**: Always pass a non-empty canonical backend order ID for Purchase; omit the field for events that do not have one rather than sending an empty string.
4. **Enhanced Conversions**: Send only real first-party data, using the Google-account method selected in Ads and the applicable consent state. Normalize/hash phone as `+` E.164 and email according to Google's current rules.
5. **Preserve Click IDs**: Capture `gclid`, `gbraid`, `wbraid` upon landing page entry and pass them through session storage / database orders.
6. **Conversion ownership**: A direct Google tag or GTM owns a given Google Ads conversion action, never both.
7. **Clean Values**: Pass raw numeric `value` (e.g. `549000`) and standard uppercase `currency` (`IDR`, `USD`). Never pass formatted strings like `"Rp 549.000"`.
8. **Server / Offline Uploads**: Upload delayed COD deliveries or offline CRM sales only when the Google Ads API contract, conversion action, click identity, and timestamp are known. A stored click ID makes this possible; it does not authorize a made-up offline conversion.
9. **Separate Analytics**: Keep GA4 engagement events separate from Google Ads conversion bidding goals.
10. **Reconciliation**: Periodically audit Google Ads reported conversions against backend accounting truth.

## Verification evidence ladder

Keep these outcomes separate:

| Layer | Proves | Does not prove |
| --- | --- | --- |
| Unit/contract test | Valid destination pair, numeric value, `transaction_id` presence, click-ID persistence | Google received a conversion |
| Browser smoke | Consent command order, tag bootstrap, direct event wiring | Google Ads processed or deduplicated it |
| Google Tag Assistant / conversion diagnostics | Tag implementation and destination diagnostics | Incremental business impact |
| Google Ads reporting | Recorded conversions and enhanced-conversion status | Correct revenue or causality |
| Reconciliation / approved experiment | Backend-to-Ads completeness and business impact | A universal CPA or ROAS uplift |

Enhanced conversions require the advertiser to enable the corresponding Google
Ads setting and accept applicable customer-data terms. A correct browser payload
can still be discarded when that account-side prerequisite is absent.

---

## Catalog identity

`id` in a Merchant Center feed is 1–50 characters of alphanumerics, underscores
and dashes. There is **no minimum length and no digits-only rule**; any code
enforcing one invented it. The binding rules are that an id is stable forever,
never reused — even for a deleted product — and identical to what the conversion
and remarketing tags send.

Grouped variants need more than a shared `item_group_id`: Google requires them to
be distinguishable by `color`, `size`, `material` or `pattern`. A group submitted
without one is a common outright disapproval, and it will not surface as an error
in your own tests.

Derivation, grain, and the verification method are shared with Meta and are
documented once, in `meta-ads-signal-engine` → "Catalog identity: the id that
must match". Do not restate them here.
