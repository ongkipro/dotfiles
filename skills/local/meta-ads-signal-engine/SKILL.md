---
name: meta-ads-signal-engine
description: >-
  Meta Ads conversion signals: Pixel + Conversions API, event_id dedup, Advanced Matching, _fbp/_fbc preservation, COD vs prepaid Purchase, EMQ, CAPI event outbox. Not campaign operations (meta-ads-cli) or Google/TikTok signals.
---

# Meta Ads Signal Engine

An engineering operating system for reliable Meta Ads conversion tracking, Pixel & Conversions API (CAPI) implementation, deterministic event deduplication, customer matching, and attribution preservation.

## Verify the API version before writing code

**Never hardcode a Graph API version from memory or from these notes.** Meta ships a new version a few times a year and each one expires roughly two years after its successor ships (v23.0 May 2025, v24.0 Oct 2025, v25.0 Feb 2026, v26.0 Jul 2026 — changelog checked 2026-10-02), so any version written down here goes stale.

| Check | Where |
| --- | --- |
| Current Graph API version | `https://developers.facebook.com/docs/graph-api/changelog` |
| Conversions API parameters | `https://developers.facebook.com/docs/marketing-api/conversions-api/parameters` |

Pin the version in **one** exported constant so a bump is a one-line change, never a grep across trackers:

```typescript
// Verified against the changelog on <date>. Re-check before bumping.
export const META_GRAPH_API_VERSION = 'v26.0'; // latest on 2026-10-02; example only
const endpoint = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events`;
```

Reference snippets below are illustrative of *structure*, not of the current version string.

Read only this file up front; open a reference from the manifest when the
step names it.

**Pick the path first:**
- New Pixel + CAPI install → version check → 4 questions → identity contract
  → `CAPI_SENDER.md` + `DEDUPLICATION_EVENT_ID.md` → evidence ladder.
- "Events arrive but EMQ/match is bad" or "DPA retargets nobody" → Audit
  first → `IDENTITY_NORMALIZATION.md` / catalog identity → evidence ladder.
- COD store → `COD_VS_PREPAID_PURCHASE.md` before any Purchase event.

## Core Philosophy

Tracking quality alone does not guarantee lower Cost Per Acquisition (CPA), but sending **correct, server-authoritative, deduplicated, and matchable conversion signals** ensures Meta's auction algorithms learn from valid business outcomes.

$$\text{Meta Ad Click (_fbp, _fbc)} \longrightarrow \text{Browser Pixel (event_id)} + \text{Server CAPI} \longrightarrow \text{Meta Deduplication Engine}$$

---

## 4 Core Questions Every Signal Must Answer

1. **What happened?** — Correct semantic event (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Lead`, `Purchase`).
2. **What did it happen to?** — Canonical product identity (`content_ids`, `contents`, `value`, `currency`).
3. **Who likely performed it?** — Privacy-compliant matching (`_fbp`, `_fbc`, SHA-256 hashed email/phone/external_id, client_ip_address, client_user_agent).
4. **Did Meta receive exactly ONE event?** — Canonical `event_id` + identical `event_name` on both legs, deduplicated only when the second copy arrives within 48 hours of the first (Meta generally keeps the first received), and a transactional outbox.

## Identity contract before code

Do not treat every user identifier as interchangeable. Freeze the source,
transport, and hash rule for each one before a tracker or server endpoint is
written.

| Field | Canonical source | Browser/server transport | Outbound Meta value |
| --- | --- | --- | --- |
| `fbp` | Meta's first-party `_fbp` cookie | Read current cookie at send time | Raw |
| `fbc` | Meta's `_fbc`, generated from a valid `fbclid` landing when absent | Preserve and refresh as first-party state | Raw |
| `external_id` | Stable advertiser-issued customer or first-party visitor ID | Same identifier on every eligible event; never URL input | SHA-256 |
| `em` | A real customer email | Optional; omit when unknown | Trim, lowercase, SHA-256 |
| `ph` | Customer phone | Normalize to country-code digits | SHA-256 |
| IP / user agent | Server request boundary | Never trust a browser JSON claim | Raw |

An `external_id` is not an order number, not a click ID, and should not become
another permanent phone hash merely because a guest checkout has no account.
Where no durable customer ID exists, a cryptographically random first-party
visitor ID is a valid advertiser identifier when it is stored locally, validated
server-side, retained for a deliberate lifetime, and hashed on both Meta legs.
Use a normalized phone only as a documented migration fallback.

Never emit a synthetic email created solely to satisfy a payment provider. It
cannot improve matching and it corrupts the identity contract. Omit missing
identity fields rather than hashing an empty or invented string.

For paired browser/server events, assert the complete identity parity:

```text
same event_name + same event_id
same external_id source -> same SHA-256 output
raw fbp/fbc when present
server-derived IP and user agent
```


## Skill Reference Manifest

| Task | Read |
| --- | --- |
| CAPI server sender, payload structure & transactional outbox | [CAPI Sender Pattern](references/CAPI_SENDER.md) |
| Browser + Server Deduplication & `event_id` rules | [Deduplication & Event ID](references/DEDUPLICATION_EVENT_ID.md) |
| Customer identity matching, E.164 phone normalization, SHA-256 hashing, `_fbp`/`_fbc` rules | [Identity Normalization](references/IDENTITY_NORMALIZATION.md) |
| Purchase event taxonomy for Prepaid vs Cash On Delivery (COD) funnels | [COD vs Prepaid Purchase Signals](references/COD_VS_PREPAID_PURCHASE.md) |
| WeTracked.io / Elevar parity & deep attribution engineering | [WeTracked.io Attribution Parity](references/WETRACKED_ATTRIBUTION_PARITY.md) |
| Catalog `id` rules (Google + Meta), feed grain, the audit of integrations that pass every test, sources | [Catalog identity and audit](references/CATALOG_IDENTITY_AND_AUDIT.md) |
| Multi-platform product taxonomy, custom labels, 12-point feed audit | `../google-ads-signal-engine/references/ADVERTISING_TAXONOMY_AND_FEED_AUDIT.md` |

---

## Checklist: 10 Commandments of Meta Signal Architecture

1. **Server-Authoritative Purchase**: Fire `Purchase` from confirmed backend payment or order state, not thank-you page load.
2. **Matching `event_id`**: Browser `fbq('track', 'Purchase', payload, { eventID: id })` and Server CAPI `{ "event_id": id }` MUST share identical string IDs.
3. **Preserve browser and advertiser IDs**: Forward `_fbp` and `_fbc` raw. Hash a stable `external_id`; do not use an order ID, click ID, invented value, or permanent phone substitute.
4. **Phone & email normalization**: Trim/lowercase a real email. Format phone numbers in E.164 digits (e.g. `08...` → `628...`) before SHA-256. Omit synthetic or unavailable identity fields.
5. **Canonical `content_ids`**: the string the Pixel and CAPI send must be *byte-identical* to the catalog's `id`. Derive it from an identifier that cannot change — derive it from the immutable primary key, prefixed (`p1-v12`), never SKU — `references/CATALOG_IDENTITY_AND_AUDIT.md`.
6. **No Fake Micro-Events**: Do NOT map every scroll or CTA click to `Lead` or `Purchase`.
7. **Transactional Outbox**: Store CAPI events in a database outbox (`capi_event_outbox`) and retry failed HTTP requests asynchronously.
8. **Low Latency**: Dispatch CAPI events immediately upon backend state confirmation.
9. **Separate Analytics from Signal Layer**: Keep GA4/PostHog UI events separate from Meta Ads optimization events.
10. **Reconciliation**: Periodically reconcile backend database order totals against Meta reported conversions.

## Audit first: failures that pass every test

A CAPI integration can be dead while types check, tests pass, the endpoint
returns 200, and Events Manager shows events. Before trusting any of that,
check `references/CATALOG_IDENTITY_AND_AUDIT.md`: tracker/validator contract
drift (write fixtures from the wire payload, never from docs), invented ID
format rules, the three-value catalog id (Pixel vs feed vs admin), `_fbp`/
`_fbc` read but never carried, `08…` vs `628…` phones, bare `fetch` with no
outbox. The reliable check is a real event confirmed in Test Events.

## Verification evidence ladder

Never collapse these into one green status:

| Layer | What it proves | What it cannot prove |
| --- | --- | --- |
| Focused unit/contract test | Normalization, payload shape, outbox idempotency, browser/server parity | Provider acceptance |
| Local browser smoke | Cookie lifecycle, Pixel bootstrap, page event wiring, visible form flow | CAPI delivery or attribution |
| Production browser smoke | The deployed browser emits expected first-party state and request wiring | Meta processed or matched the event |
| Meta Test Events / Events Manager | Receipt, freshness, deduplication, and EMQ | Incremental business impact |
| Reconciliation or lift experiment | Reporting completeness and business impact | A universal performance guarantee |

For a live Pixel, capture evidence in this order:

1. a valid first-party `external_id` is stable across navigation;
2. Pixel sends its SHA-256 version and paired browser/server events share
   `event_name` plus `event_id`;
3. the server event carries raw `fbp`/`fbc` where available and derives IP/user
   agent at the request boundary;
4. Events Manager confirms Test Events receipt, freshness, deduplication, and
   EMQ;
5. only then evaluate reported-conversion, CPA, or ROAS movement.

Do not add individual claimed uplifts across identifiers. They overlap, change
with traffic mix and baseline implementation, and are not a revenue forecast.

## Hand-offs

Campaign operations → `meta-ads-cli`; competitor research → `meta-ads-scout`;
Google/TikTok signals → their signal-engine skills; copy → `copywriting`;
payment webhook verification and the outbox's place in the app →
`full-stack-development`.

