# WeTracked.io Parity & Deep Attribution Engineering Spec

> Architectural deep-dive and validation specification comparing commercial tracking platforms (WeTracked.io, Elevar, TripleWhale) against native dotfiles signal engines.

---

## 1. Deep Technical Comparison: How Tracking Solutions Work

| Engineering Vector | WeTracked.io / Elevar (SaaS $50-$300/mo) | Dotfiles AI Signal Engine (Native Code $0) | Implementation Standard in Dotfiles |
| :--- | :--- | :--- | :--- |
| **Safari ITP Cookie Lifetime** | Uses custom CNAME subdomains (`track.domain.com`) to write `Set-Cookie` HTTP headers. | Cloudflare Workers / Server `Set-Cookie` HTTP response headers. | `Set-Cookie: _fbp=...; Max-Age=31536000; Path=/; SameSite=Lax; Secure` via server proxy. |
| **Event Match Quality (EMQ)** | Automated client/server hashing engine. | Built-in SHA-256 E.164 phone & email normalizer contract. | `IDENTITY_NORMALIZATION.md` (strip whitespace, lowercase, E.164 phone without `+`). |
| **Payment Gateway Redirects** | Session stitching via Shopify app DB. | Order DB Session Preservation Pattern. | Persist `_fbp`, `_fbc`, `ttclid`, `gclid` into Order record at `InitiateCheckout`. |
| **Event Deduplication** | Automated `event_id` payload injection. | Shared `event_id` contract (`order_id` or UUIDv4). | Client `fbq`/`ttq`/`gtag` + Server CAPI payload share identical `event_id`. |
| **Handling Network Failures** | SaaS retry queue. | Transactional Outbox Pattern (`capi_outbox`). | Async background worker with exponential backoff retries for 5xx/429 status codes. |
| **Data Privacy & Ownership** | Data passes through 3rd-party SaaS servers. | 100% Direct First-Party Server-to-API transmission. | Zero 3rd party dependency; direct Graph API, TikTok Events API, Google Ads API. |

---

## 2. The 4 Critical Edge-Cases Solved by Our Signal Engine

### 2.1 Edge Case 1: Safari ITP 7-Day Cookie Decay
- **Problem**: Client-side JavaScript cookies (`document.cookie = "_fbp=..."`) are capped by Apple Safari ITP to 7 days (or 24 hours if coming from an ad click). If a customer converts on Day 8, attribution is lost.
- **Dotfiles Solution**: Set cookies exclusively via **HTTP Response Headers** (`Set-Cookie`) from a first-party domain or Cloudflare Worker route. Server-set HTTP cookies receive full 1-year persistence under Safari ITP rules.

### 2.2 Edge Case 2: Payment Gateway Disconnection (Midtrans/Stripe/Xendit)
- **Problem**: Customer clicks ad → lands on store → goes to Midtrans/Stripe payment page → returns to thank-you page. `document.referrer` is now `payment.midtrans.com`, losing ad source context.
- **Dotfiles Solution**: At `InitiateCheckout`, save `_fbp`, `_fbc`, `ttclid`, `gclid`, and client `user_agent` directly into the database `orders` table row. When payment webhook confirms purchase, server reads attribution IDs from the order row and fires CAPI.

### 2.3 Edge Case 3: E.164 Phone Normalization Failure
- **Problem**: In Indonesia & Asia, users enter phone numbers as `0812-3456-7890` or `+62 812 3456 7890`. If hashed directly, Meta/TikTok/Google cannot match the customer profile, resulting in low EMQ (Match Score < 4.0).
- **Dotfiles Solution**: Apply strict E.164 transformation before hashing:
  1. Strip all non-digit characters (`+`, `-`, spaces).
  2. If starting with `0`, replace leading `0` with country code (e.g. `0812...` → `62812...`).
  3. Compute SHA-256 digest on the resulting digits string.

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
[Server HTTP Response Header] ──► Sets HTTP-level 1-Year First-Party Cookies (_fbp, _fbc, _ttp, ttclid)
       │
       ▼
[InitiateCheckout] ────────────► Persists (_fbp, _fbc, ttclid, gclid, SHA256 Email/Phone) into Order Record
       │
       ▼
[Payment Webhook / Confirm] ──► Writes payload to `capi_outbox` Table
       │
       ▼
[Async Worker Queue] ──────────► Sends CAPI / TikTok / Google Ads API (Exact event_id match)
```
