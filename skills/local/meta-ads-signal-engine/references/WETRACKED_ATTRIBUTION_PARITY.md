# WeTracked.io Parity & Deep Attribution Engineering Spec

> Architectural deep-dive and validation specification comparing commercial tracking platforms (WeTracked.io, Elevar, TripleWhale) against native dotfiles signal engines.

---

## 1. Deep Technical Comparison: How Tracking Solutions Work

| Engineering Vector | WeTracked.io / Elevar (hosted SaaS; check current pricing) | Dotfiles AI Signal Engine (native code, no tracking SaaS) | Implementation Standard in Dotfiles |
| :--- | :--- | :--- | :--- |
| **Safari ITP Cookie Lifetime** | Often a CNAME subdomain (`track.domain.com`) writing `Set-Cookie`; WebKit caps cookies from third-party CNAME/IP-cloaked responses to 7 days. | `Set-Cookie` from the site's own origin server or Worker route (same site, not a cloaked third party). | `Set-Cookie: _fbp=...; Max-Age=<deliberate lifetime>; Path=/; SameSite=Lax; Secure` from the first-party origin. |
| **Event Match Quality (EMQ)** | Automated client/server hashing engine. | Built-in SHA-256 phone & email normalizer contract, per platform. | `IDENTITY_NORMALIZATION.md` (Meta `ph`: country-code digits without `+`; Google and TikTok document `+E.164` — see their skills). |
| **Payment Gateway Redirects** | Session stitching via Shopify app DB. | Order DB Session Preservation Pattern. | Persist `_fbp`, `_fbc`, `ttclid`, `gclid` into Order record at `InitiateCheckout`. |
| **Event Deduplication** | Automated `event_id` payload injection. | Shared `event_id` contract (`order_id` or UUIDv4). | Client `fbq`/`ttq`/`gtag` + Server CAPI payload share identical `event_id`. |
| **Handling Network Failures** | SaaS retry queue. | Transactional Outbox Pattern (`capi_outbox`). | Async background worker with exponential backoff retries for 5xx/429 status codes. |
| **Data Privacy & Ownership** | Data passes through 3rd-party SaaS servers. | 100% Direct First-Party Server-to-API transmission. | Zero 3rd party dependency; direct Graph API, TikTok Events API, Google Data Manager API (Google Ads API only for integrations already grandfathered). |

---

## 2. The 4 Critical Edge-Cases Solved by Our Signal Engine

### 2.1 Edge Case 1: Safari ITP 7-Day Cookie Decay
- **Problem**: WebKit ITP deletes cookies created in JavaScript (and other script-writable storage) after 7 days without user interaction with the site, and caps JavaScript cookies set on a landing page reached through link decoration from a classified tracking domain to 24 hours. A conversion after that window loses the browser-side ID.
- **Dotfiles Solution**: Set first-party IDs via **HTTP response headers** (`Set-Cookie`) from the site's own origin or Worker route. These caps target script-writable storage; WebKit separately caps cookies in responses from third-party CNAME-cloaked or IP-cloaked servers to 7 days, so a tracking subdomain pointed at a vendor does not escape them. Browsers still impose their own maximum cookie lifetimes — choose a deliberate `Max-Age` and verify actual expiry in Safari rather than assuming a year.
- **Source**: [WebKit Tracking Prevention](https://webkit.org/tracking-prevention/), accessed 2026-10-02.

### 2.2 Edge Case 2: Payment Gateway Disconnection (Midtrans/Stripe/Xendit)
- **Problem**: Customer clicks ad → lands on store → goes to Midtrans/Stripe payment page → returns to thank-you page. `document.referrer` is now `payment.midtrans.com`, losing ad source context.
- **Dotfiles Solution**: At `InitiateCheckout`, save `_fbp`, `_fbc`, `ttclid`, `gclid`, and client `user_agent` directly into the database `orders` table row. When payment webhook confirms purchase, server reads attribution IDs from the order row and fires CAPI.

### 2.3 Edge Case 3: E.164 Phone Normalization Failure
- **Problem**: In Indonesia & Asia, users enter phone numbers as `0812-3456-7890` or `+62 812 3456 7890`. Hashed as typed, the digest matches no platform profile, and nothing errors because a hash always looks valid.
- **Dotfiles Solution**: Normalize to country code + national number before hashing, then apply each platform's documented form:
  1. Strip all non-digit characters (`+`, `-`, spaces).
  2. If starting with the national trunk `0`, replace it with the country code (e.g. `0812...` → `62812...`).
  3. Meta `ph`: hash the digits (`62812...`). Google Ads enhanced conversions and TikTok: hash `+62812...` (`+E.164`). Verify each platform's current docs; one shared digest for all three is wrong.

### 2.4 Edge Case 4: Asynchronous Payment & COD Webhook Firing
- **Problem**: Cash On Delivery (COD) orders or bank transfers are placed at Time T, but paid/delivered at Time T+3 Days. Firing `Purchase` on checkout placement creates fake attribution for uncollected COD orders.
- **Dotfiles Solution**: Split events into two distinct signals:
  - Placement: Fire `PlaceAnOrder` / `InitiateCheckout`.
  - Cash Collection: Fire server CAPI `Purchase` / `CompletePayment` ONLY when payment status becomes `PAID` / `DELIVERED_AND_COLLECTED`.

---

## 3. High-Conversion & Low-CPA Attribution Architecture

```
[Ad Click (Meta/TikTok/Google)]
       │
       ▼ (URL params: ?fbclid=... & ?ttclid=... & ?gclid=...)
[Server HTTP Response Header] ──► Sets first-party HTTP cookies with a deliberate lifetime (_fbp, _fbc, _ttp, ttclid)
       │
       ▼
[InitiateCheckout] ────────────► Persists (_fbp, _fbc, ttclid, gclid, SHA256 Email/Phone) into Order Record
       │
       ▼
[Payment Webhook / Confirm] ──► Writes payload to `capi_outbox` Table
       │
       ▼
[Async Worker Queue] ──────────► Sends CAPI / TikTok Events API / Google (Data Manager API) (exact event_id match)
```
