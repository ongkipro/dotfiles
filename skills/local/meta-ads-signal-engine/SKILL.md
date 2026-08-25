---
name: meta-ads-signal-engine
description: >-
  End-to-end Meta Ads Conversion Signal Operating System (Pixel, Conversions API / CAPI,
  Deduplication event_id, Advanced Matching, _fbp/_fbc attribution preservation, COD vs Prepaid Purchase
  definitions, and CAPI Event Outbox pattern).
  Use when designing, building, auditing, or troubleshooting Meta Ads conversion tracking, pixel setups, CAPI integrations,
  event match quality (EMQ), deduplication bugs, or server-authoritative Purchase signals.
  Triggers: "meta ads", "meta pixel", "capi", "conversions api", "facebook pixel", "event_id deduplication",
  "event match quality", "emq", "meta signal engine", "pixel capi setup".
---

# Meta Ads Signal Engine

An engineering operating system for reliable Meta Ads conversion tracking, Pixel & Conversions API (CAPI) implementation, deterministic event deduplication, customer matching, and attribution preservation.

## Verify the API version before writing code

**Never hardcode a Graph API version from memory or from these notes.** Meta ships a new version roughly every quarter and retires each one after about two years, so any version written down here is stale the moment it is written.

| Check | Where |
| --- | --- |
| Current Graph API version | `https://developers.facebook.com/docs/graph-api/changelog` |
| Conversions API parameters | `https://developers.facebook.com/docs/marketing-api/conversions-api/parameters` |

Pin the version in **one** exported constant so a bump is a one-line change, never a grep across trackers:

```typescript
// Verified against the changelog on <date>. Re-check before bumping.
export const META_GRAPH_API_VERSION = 'v26.0';
const endpoint = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events`;
```

Reference snippets below are illustrative of *structure*, not of the current version string.

## Core Philosophy

Tracking quality alone does not guarantee lower Cost Per Acquisition (CPA), but sending **correct, server-authoritative, deduplicated, and matchable conversion signals** ensures Meta's auction algorithms learn from valid business outcomes.

$$\text{Meta Ad Click (_fbp, _fbc)} \longrightarrow \text{Browser Pixel (event_id)} + \text{Server CAPI} \longrightarrow \text{Meta Deduplication Engine}$$

---

## 4 Core Questions Every Signal Must Answer

1. **What happened?** — Correct semantic event (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Lead`, `Purchase`).
2. **What did it happen to?** — Canonical product identity (`content_ids`, `contents`, `value`, `currency`).
3. **Who likely performed it?** — Privacy-compliant matching (`_fbp`, `_fbc`, SHA-256 hashed email/phone/external_id, client_ip_address, client_user_agent).
4. **Did Meta receive exactly ONE event?** — Canonical `event_id`, browser/server deduplication window (48 hours), and transactional outbox.

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
| Multi-Platform Product Taxonomy, Custom Labels & 12-Point Audit Checklist | Load `skills/local/google-ads-signal-engine/references/ADVERTISING_TAXONOMY_AND_FEED_AUDIT.md` |

---

## Checklist: 10 Commandments of Meta Signal Architecture

1. **Server-Authoritative Purchase**: Fire `Purchase` from confirmed backend payment or order state, not thank-you page load.
2. **Matching `event_id`**: Browser `fbq('track', 'Purchase', payload, { eventID: id })` and Server CAPI `{ "event_id": id }` MUST share identical string IDs.
3. **Preserve browser and advertiser IDs**: Forward `_fbp` and `_fbc` raw. Hash a stable `external_id`; do not use an order ID, click ID, invented value, or permanent phone substitute.
4. **Phone & email normalization**: Trim/lowercase a real email. Format phone numbers in E.164 digits (e.g. `08...` → `628...`) before SHA-256. Omit synthetic or unavailable identity fields.
5. **Canonical `content_ids`**: the string the Pixel and CAPI send must be *byte-identical* to the catalog's `id`. Derive it from an identifier that cannot change — see "Catalog identity" below. Prefer SKU only where SKU is immutable and always present.
6. **No Fake Micro-Events**: Do NOT map every scroll or CTA click to `Lead` or `Purchase`.
7. **Transactional Outbox**: Store CAPI events in a database outbox (`capi_event_outbox`) and retry failed HTTP requests asynchronously.
8. **Low Latency**: Dispatch CAPI events immediately upon backend state confirmation.
9. **Separate Analytics from Signal Layer**: Keep GA4/PostHog UI events separate from Meta Ads optimization events.
10. **Reconciliation**: Periodically reconcile backend database order totals against Meta reported conversions.

## Auditing: the failure modes that pass every test

A CAPI integration can be completely dead while types check, tests pass, the endpoint returns 200, and Meta's dashboard shows events arriving. Check these first — each one has been found in production:

1. **Contract drift between tracker and validator.** Diff the payload the browser actually sends against the keys the server actually reads. A server that reads `custom_data.value` while trackers post `value` flat will happily forward `undefined` for every commerce and matching field, and every layer reports success. **Write the test fixture from the wire payload, never from the API docs** — a docs-shaped fixture validates a contract nobody implements.
2. **Identifier format assumptions.** Confirm a real ID from the live database passes the validator. A `^\d{5}$` catalog-ID rule against six-digit IDs rejects everything, and a test fixture with a made-up five-digit ID hides it forever. There is **no minimum length and no digits-only rule** in either platform's spec — any code enforcing one was invented, and the padding it applies is itself a source of mismatch.
3. **The three-value catalog id.** Print, side by side, what the Pixel sends, what the feed publishes, and what the admin shows the operator. Found in production as `"1"`, `"10001"` and `"10001"` — three values for one product, every test green. Nothing errors when they disagree: Advantage+ and DPA simply retarget nobody while the merchant pays for the traffic. **Check the two halves against each other, never each against its own fixture** — separate fixtures are exactly how three values pass CI.
4. **Signals collected then dropped.** Grep for `_fbp`/`_fbc` on both legs. Browsers frequently read the cookies correctly while the server type never had fields to carry them.
5. **Phone normalization mismatch.** See `IDENTITY_NORMALIZATION.md` — `08…` vs `628…` is a guaranteed miss, and it is invisible because a hash always *looks* fine.
6. **Silently dropped failures.** A bare `fetch` to Meta with no outbox loses conversions on every network blip, 429, or expired token, and nothing anywhere records that it happened.

The reliable check is end-to-end: fire a real event, then confirm the value, `content_ids`, and match keys in Meta's Test Events tool. Do not infer health from HTTP 200.

---

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

## Catalog identity: the id that must match

Verified against the platform specs, 2026-08-17.

| | Google Merchant Center | Meta Catalog |
| --- | --- | --- |
| `id` length | 1–50 characters | up to 100 |
| `id` charset | alphanumeric, `_`, `-` (ASCII recommended) | not restricted explicitly |
| Numeric required | no | no |
| Minimum length | **none** | **none** |
| Hard rule | stable forever, never changed, never reused — even for a deleted product | must exactly match the Pixel's content ID |

**Derive from an immutable key, not from SKU.** Both platforms *recommend* SKU,
and that advice is wrong wherever SKU is nullable or merchant-editable: Google's
rule is that an id, once assigned, never changes, and an editable field is
precisely the one that will. A database primary key never changes and is never
handed out twice. Use it.

**Prefix it.** No spec requires it, but a bare `1` is fragile exactly where feeds
travel — spreadsheet and CSV coercion, dropped leading zeros, collisions when two
sources merge. Three characters remove all of it and make the id self-describing:
`p1-v12` says what it is, `12` does not. Padding to a fixed width buys none of
this; it only invents a new value that matches nothing.

**Decide the grain before anything else.** A variant-level feed publishes one item
per variant, so:

- item id = `p{product}-v{variant}`, unique per variant
- `item_group_id` = `p{product}`, shared by every variant of the product
- the group id is **never** published as an item id

Both of the following have shipped and neither errors: publishing the first
variant without its `item_group_id` (group of one, orphan id equal to the group
id), and submitting a group with no variant-identifying attribute. Google requires
grouped items to be distinguishable by `color`, `size`, `material` or `pattern`
— a group without one is a common outright disapproval.

**Which id does an event send?** The one naming what the visitor is looking at. No
variant chosen yet (product page, landing page) → the first variant's id. Variant
chosen (AddToCart, InitiateCheckout, Purchase) → that variant's id. No variants at
all → **omit `content_ids`**. An id matching nothing is worse than none: Meta
reports it as a match rate the merchant cannot act on.

**Never change an id after a feed has been submitted.** Doing so orphans the
catalog history. Get this right before the first install goes live; after that it
is a catalog re-creation, not an edit.
