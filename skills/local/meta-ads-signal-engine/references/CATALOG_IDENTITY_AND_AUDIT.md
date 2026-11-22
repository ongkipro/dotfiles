# Catalog identity and the audit that catches dead integrations

Moved from SKILL.md 2026-10-30.

## Catalog identity: the id that must match

Verified against the platform specs, 2026-08-17; Meta/TikTok naming re-checked 2026-11-19.

### Who creates the id

The merchant does, at the moment the product or variant is created in its own
system. No platform hands one back that you should use:

- **Meta has two ids per item.** Meta generates its own numeric item id (the
  Graph API product item `id`) when the item enters the catalog; ignore it for
  tracking. The id that matters is the merchant's: the `id` column of a data
  feed, shown in Commerce Manager as **Content ID**, called `retailer_id` in the
  Catalog / Items Batch API (WhatsApp: `product_retailer_id`). The Pixel's
  `content_ids` / `contents[].id` and CAPI must equal this value exactly. If two
  catalog items share it, Meta ignores **all** of them.
- **Google:** the feed `id` / `<g:id>` (Merchant API `offerId`).
- **TikTok:** the catalog `sku_id`; Pixel/Events API `content_id` must equal it
  exactly (no prefix added on one side only, same case).

So one value is minted once and copied everywhere: catalog row, feed, Pixel,
CAPI/Events API, GA4 `item_id`, order-line snapshot.

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

**Format: digits are fine, typed as a string.** No spec requires a prefix or
a numeric value. What breaks ids where feeds travel is coercion — a JavaScript
`number`, a spreadsheet dropping leading zeros, two sources merging. The shared
memory rule (`development.md` § Commerce catalog identity) is the default: a
digit-only value of at least five digits, carried as a string at every
boundary (a leading `0`, as in a `ddmmyy` id for the 1st–9th, is kept, never
stripped), separate from the database primary key, generated
server-side with a collision-safe counter. A tiny bare id such as `1` is the
real hazard; an id like `1911261001` is not. A prefix (`p1-v12`) is acceptable
when an existing contract already uses one; do not mix both styles in one
catalog. Padding an existing id only invents a new value that matches nothing.

Worked example (99ribu-cf `DEC-040`): `ddmmyy` of the WIB creation date plus a
daily sequence from `1001` — the first variant created on 19 Nov 2026 is
`1911261001`; on 5 Nov it would be `0511261001`. Parent product and variants draw from the same counter; the
parent's id is the `item_group_id`, each variant's id is the item id. The
public URL carries no id at all (`/produk/<slug>`, `/produk/<slug>/<variant-slug>`);
the id lives only in feeds, events and the admin. Moving to a new id scheme
means **new** catalogs on every platform, not an edit of the old one.

**Decide the grain before anything else.** A variant-level feed publishes one item
per variant, so:

- item id = the variant's own catalog id, unique per variant
- `item_group_id` = the product's catalog id, shared by every variant of the product
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

## Sources (accessed 2026-10-02; catalog id rows 2026-11-19)

- Meta catalog fields (`id` ≤100 chars, unique, duplicates all ignored, must match Pixel content ID; `item_group_id` for variants): https://developers.facebook.com/docs/commerce-platform/catalog/fields/
- Meta Pixel for Advantage+ catalog ads (`content_ids` / `contents[].id` must match catalog ids on ViewContent, AddToCart, Purchase): https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads/
- Meta Items Batch API (`retailer_id`): https://developers.facebook.com/docs/marketing-api/catalog-batch/reference/
- Google Merchant `id` (1–50 chars, stable, never recycled, unique per variant, parent in `item_group_id`): https://support.google.com/merchants/answer/6324405
- TikTok catalog match rate (`content_id` must equal catalog `sku_id`): https://ads.tiktok.com/resources/help/article/how-to-troubleshoot-catalog-match-rate-issues

- Graph API changelog (version/expiry dates): https://developers.facebook.com/docs/graph-api/changelog
- Deduplication (event_id+event_name, 48 h, first-received kept; fbp/external_id fallback only browser-first): https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events
- Customer information parameters (ph: digits with country code, no symbols; external_id hashing recommended, not required; fbp/fbc never hashed): https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
- Official SDK release tracking the Graph version (`facebook-nodejs-business-sdk` v26.0.2, 2026-09-21): https://github.com/facebook/facebook-nodejs-business-sdk/releases
- WebKit tracking prevention (cookie caps used in the parity reference): https://webkit.org/tracking-prevention/

No official vendor agent skill for Meta CAPI was found on GitHub on that date; nothing borrowed.
