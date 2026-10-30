# Catalog identity and the audit that catches dead integrations

Moved from SKILL.md 2026-10-30.

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

## Sources (accessed 2026-10-02)

- Graph API changelog (version/expiry dates): https://developers.facebook.com/docs/graph-api/changelog
- Deduplication (event_id+event_name, 48 h, first-received kept; fbp/external_id fallback only browser-first): https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events
- Customer information parameters (ph: digits with country code, no symbols; external_id hashing recommended, not required; fbp/fbc never hashed): https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
- Official SDK release tracking the Graph version (`facebook-nodejs-business-sdk` v26.0.2, 2026-09-21): https://github.com/facebook/facebook-nodejs-business-sdk/releases
- WebKit tracking prevention (cookie caps used in the parity reference): https://webkit.org/tracking-prevention/

No official vendor agent skill for Meta CAPI was found on GitHub on that date; nothing borrowed.
