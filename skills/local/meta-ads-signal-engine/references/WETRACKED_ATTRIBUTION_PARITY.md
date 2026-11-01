# Managed Tracking SaaS vs Owned Signal Engine (wetracked.io, Elevar and peers)

> How commercial server-side tracking products actually work, observed in their
> shipped code, and the owned-engine standard that replaces each mechanism.
> Evidence date: 2026-11-02. Full research, artifacts and per-tool cards:
> `~/Documents/work/research/wetracked-2026/README.md` (device-local; vendor
> behaviour drifts, so re-verify before quoting a vendor in client work).

---

## 1. What the vendors really do (evidence-based)

Labels: **[RUN]** executed offline against the shipped script · **[SRC]** read in
shipped code · **[DOC]** vendor docs · **[LST]** public blocklist.

| Mechanism | wetracked.io | Elevar | Owned engine standard |
| :--- | :--- | :--- | :--- |
| **Browser collector host** | Shared third-party host `pixel.wetracked.io`; listed in EasyPrivacy, AdGuard Tracking and HaGeZi [LST] | Shopify app proxy `/a/elevar/` + `hits.getelevar.com`; both, including the proxy path, listed in EasyPrivacy [LST] | Endpoint on the merchant's own origin (Worker/route), non-signature path |
| **Visitor identity** | `_wtp` = Shopify cart token via `/cart/update.js` (90 d) or random UUID (365 d); **JS-set** cookies [RUN] | 1-year `_elevar_*` cookie + cart attributes [SRC/DOC] | `Set-Cookie` from the merchant origin; store click IDs on the order at checkout |
| **Click-ID survival across hops** | Link decoration of every absolute link; cart-permalink `attributes[]` copy IDs onto the order [RUN] | Cart attributes via `/cart/update.js` [SRC] | Persist `fbc/fbp/ttclid/gclid` server-side on first request and on the order row |
| **Meta delivery** | **Server-only** from order webhooks; browser pixel must be removed, so no dedup needed [SRC/DOC] | Pixel + server with a shared id [DOC] | Redundant Pixel + CAPI with a shared `event_id` (Meta's recommendation) |
| **Browser `eventID`** | `wt:page:eid` is never assigned, so `eventID` is `undefined` [RUN] | Shared id on both legs [SRC] | Deterministic id: `order_id` for Purchase, random shared id otherwise |
| **Network failures** | WooCommerce plugin: fire-and-forget (`blocking:false`, 10 ms timeout), **no outbox, no retry** [SRC] | GCP Pub/Sub with ack and retries, webhook replay, accuracy alerts [DOC] | Transactional outbox with backoff, stop auto-retry inside the 48 h dedup window |
| **COD** | Shopify external checkout → Purchase on `orders/create`; Woo COD gateway sets `processing`, so **every Woo COD order is a Purchase at placement** [SRC] | Purchase on order creation; delivered only via a custom server-to-server event [DOC] | Placement → `InitiateCheckout`; courier `delivered` → server `Purchase` (see COD reference) |
| **PII normalisation** | Woo plugin lowercases email but does not trim; names keep punctuation [RUN] | Client-side normalisers + SHA-256 [SRC] | `IDENTITY_NORMALIZATION.md`; never trust a library to add `62` (see §2.3) |

Takeaways:
- "Adblock-proof" in this category means **order events come from webhooks**. The browser collector of most hosted tools is blocklisted (11 of 14 checked).
- No reviewed tool fires `Purchase` from courier delivery status automatically. PixelFly's COD hold-and-release accepts a `delivered` webhook, but it also releases on `processing`/`shipped`.
- Proof belongs in the engine: per-event payload + response log and order-level reconciliation (the model Savrena sells).

---

## 2. The edge cases an owned engine must solve

### 2.1 WebKit cookie caps
- **Problem**: WebKit ITP deletes script-set cookies after 7 days without interaction, and caps JS cookies set on a landing page reached through link decoration from a classified tracking domain to **24 hours**. Cookies from third-party CNAME- or IP-cloaked responses are capped at 7 days.
- **Solution**: set first-party IDs with an HTTP `Set-Cookie` from the site's own origin or Worker route (not a CNAME to a vendor), read `fbclid` server-side on the first request, and persist it on the order. Choose a deliberate `Max-Age`; verify actual expiry in Safari.
- **Source**: [WebKit Tracking Prevention](https://webkit.org/tracking-prevention/), accessed 2026-11-02.

### 2.2 Payment-gateway and domain hops (Midtrans/Xendit/Stripe, order-form domains)
- **Problem**: the shopper returns from the payment page with `document.referrer` set to the gateway; cross-domain order forms lose the landing cookies.
- **Solution**: at `InitiateCheckout`, save `fbc`, `fbp`, `ttclid`, `gclid`, IP and user agent on the order row; the payment/courier webhook reads them back. For order-form domains, forward IDs in the link without altering their case or characters.

### 2.3 Phone normalisation (no official library does it for Indonesia)
- **Problem**: `0812-3456-7890` hashed as typed matches nobody, and nothing errors.
- **Observed (2026-11-02)**: Meta Business SDK and `capi-param-builder` produce `81234567890`; Google Data Manager's formatter produces `+081234567890`; reference sGTM templates and the TikTok Woo plugin do not add `62`; Meta Pixel automatic matching prefixes a code guessed from the **browser language** (`en-US` → `1…`).
- **Solution**: normalise once to `+62…` (libphonenumber, region `ID`), then serialise per destination — Meta and Pinterest: digits `62…`; Google and TikTok: `+62…`. Send the pre-normalised value on the Pixel too so both legs hash the same input.

### 2.4 COD and delayed payment
- **Problem**: COD orders are paid days later; `Purchase` at placement trains the algorithm on uncollected orders.
- **Solution**: placement → `InitiateCheckout` (standard event; TikTok cannot optimise custom events and is sunsetting `PlaceAnOrder`); delivered and collected → server `Purchase` with `event_time` = delivery time, sent immediately. Meta's 7-day `event_time` rule is measured against **send time**, so this is always accepted; the real limit is the 7-day-click attribution window. Never relabel late web orders as `physical_store`. Disable app-level Purchase for COD orders (native apps and plugins fire at placement) to avoid double counting.

---

## 3. Owned architecture

```
[Ad click (Meta/TikTok/Google)]
       │ ?fbclid / ?ttclid / ?gclid (case-sensitive, read server-side)
       ▼
[Merchant-origin response] ──► Set-Cookie _fbp/_fbc (deliberate lifetime) + click map stored server-side
       │
       ▼
[InitiateCheckout / order placed] ──► persist click IDs, IP, UA, phone_e164 on the order row
       │
       ▼
[Payment or courier "delivered" webhook] ──► write payload to `capi_outbox` (unique destination+order+event)
       │
       ▼
[Async worker] ──► Meta CAPI / TikTok Events API / Google Data Manager API
                   per-destination serialisers, shared event_id, response log, reconciliation
```
