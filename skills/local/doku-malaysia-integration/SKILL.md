---
name: doku-malaysia-integration
description: Integrate DOKU's Global API for Malaysia storefront payments (FPX, Touch 'n Go, GrabPay, ShopeePay, BNPL, cards) — base URLs, credentials, the hosted Checkout API, the HMAC-SHA256 Global signature scheme, and webhook/notification handling. Automatically use when the project mentions DOKU, SenangPay, DOKU Malaysia, Malaysia payment gateway, or Indonesian phrases like integrasi payment malaysia, gateway malay, doku malaysia, checkout malaysia. senangPay is a DOKU company since its 2022 acquisition (BNM-regulated, PCI-DSS certified) — the same API applies.
---

## What this is

DOKU's Global API covers both Indonesia and Malaysia; Malaysia-specific channels
(FPX, e-wallets, BNPL) are just enum values on the same endpoints. senangPay —
a Bank Negara Malaysia-regulated, PCI DSS-certified payment gateway — became a
DOKU company after DOKU's 2022 acquisition; DOKU's own docs are the correct
integration surface for a Malaysia-facing product, not a separate SenangPay API.

Canonical source: `https://doku-developers.apidog.io`. Verify against it before
trusting anything below if DOKU has since revised the API — this skill is a
distillation, not a mirror.

## Environments and credentials

| Environment | Base URL |
|---|---|
| Sandbox | `https://api-sandbox.doku.com` |
| Production | `https://api.doku.com` |

Per environment, per merchant, DOKU issues three credentials:

- **Client ID** — identifies the merchant account (e.g. `BRN-001-0000001`).
- **Secret Key** — never sent directly; used only to compute the `Signature` header (HMAC-SHA256). Treat like a password. Encrypt at rest.
- **API Key** — used as the `Authorization` header via HTTP Basic auth with no password: `Authorization: Basic BASE64(API_KEY:)` (note the trailing colon before encoding).

**Never commit these to a repository or write them into a planning doc/PRD/memory file.** Store dev credentials in a local secrets store (this environment: `~/.config/ai-local/secrets.env`, read via `secrets-env`, never `source`d). A PEM public key or other multi-line value doesn't fit that file's one-line-per-var format — base64-encode it onto one line and decode on read (`secrets-env get KEY_B64 | base64 -d`).

For a multi-tenant SaaS, each tenant's DOKU/SenangPay credentials are a separate
encrypted record — reuse whatever per-tenant encrypted provider-credential
pattern the project already has (tenant + provider-bound AAD), the same way
other provider integrations (e.g. a 3PL or an existing payment gateway) are
stored. Don't invent a second credential-storage mechanism.

## Which endpoint: Checkout vs. direct Payment

Two ways to charge a customer:

- **`POST /v3/checkouts` (hosted Checkout page) — prefer this** for most
  integrations. DOKU returns a `payment.checkout_url`; redirect the shopper
  there and DOKU handles channel-specific UI (bank picker, e-wallet redirect,
  card form). Matches a compact storefront that avoids building/maintaining
  channel-specific payment UI or shipping arbitrary client JavaScript.
- **`POST /v3/payments` (direct API)** — only when the merchant needs full
  control of the payment page/UX per channel. Requires handling `bank_code`,
  `business_model` (FPX), and per-channel `next_action.url` redirects itself.

Both require headers: `Authorization`, `Client-Id`, `Request-Timestamp`
(ISO8601 UTC), `API-Version`, `Signature` (see below), and optionally
`Idempotency-Id`. **`API-Version` value is per API family, not one constant**
— the docs show `arabica.2025-12-01` for Payment/Checkout and
`doku-global.2025-12-01` for Notification; confirm the current value for each
endpoint rather than reusing one string everywhere.

DOKU's OpenAPI spec marks `Signature` as `required: true` on `/v3/payments`
but `required: false` on `/v3/checkouts` and on the Notification callback —
likely a documentation inconsistency rather than an intentional relaxation.
**Always compute and send it regardless**; DOKU verifies it whenever present,
and every worked example in the docs includes it.

### Malaysia-relevant `channel` / `payment_channels` values

`INTERNET_BANKING_FPX`, `EWALLET_TNG` (Touch 'n Go), `EWALLET_GRABPAY`,
`EWALLET_SHOPEEPAY`, `BNPL_GRABPAY`, `BNPL_SHOPEEPAY`, `CREDIT_CARD`. Omit
`payment_channels` in a Checkout request to show all enabled channels, or list
specific ones to restrict the page. `device_info` (platform/browser/os/
ip_address) is **mandatory** when the channel is Touch 'n Go, ShopeePay, or
SPayLater — send it on every request rather than conditionally, since omitting
it only fails for a subset of channels and that failure mode is easy to miss
in testing if you only exercise FPX.

`checkout_experience.language` enum is `EN` / `MY` (Bahasa Melayu), default
`EN` — separate from `/v3/payments`'s `customization_landing_page.themes.language`
enum, which is `ID` / `EN` (no `MY`). Don't assume the same enum applies to
both; a storefront defaulting to English system chrome should set `EN`
explicitly on whichever field the chosen endpoint exposes.

A curious asymmetry in the OpenAPI spec: `/v3/payments` marks `payment.processor`
(`approvel_code`, `response_code`) as a **required request field**, which reads
like an acquirer *response* echoed back rather than something a merchant would
supply when creating a payment. This looks like a documentation artifact
rather than a real requirement — confirm with DOKU support or a sandbox call
before building around it, and prefer `/v3/checkouts` (which has no such
field) if it turns out to be a real blocker.

### Checkout request shape (minimum)

```json
{
  "id": "merchant-generated-reference-id",
  "order": {
    "amount": 100.25,
    "invoice_number": "INV-20260901-0001",
    "currency": "MYR",
    "expired_at": "2026-09-17T07:30:45Z"
  },
  "checkout_experience": {
    "channels": ["EWALLET_TNG", "INTERNET_BANKING_FPX", "EWALLET_GRABPAY"],
    "language": "EN",
    "auto_redirect": true,
    "callback_url": "https://merchant.host/payment/callback",
    "callback_url_cancel": "https://merchant.host/payment/cancel",
    "callback_url_result": "https://merchant.host/payment/result"
  },
  "customer": { "name": "...", "email": "...", "phone": "+60..." }
}
```

Response returns `payment.checkout_url`, `payment.status` (`SUCCESS` /
`PENDING` / `FAILED` / `EXPIRED`), `payment.state`. `invoice_number` is capped
at 30 chars if a Credit Card channel is active (acquirer requirement). A line
item can represent a non-product charge such as Malaysia's SST (Sales and
Service Tax) — add it as a plain `{ name: "SST", quantity: 1, price: ... }`
entry alongside real products; DOKU doesn't distinguish tax lines structurally.

`/v3/payments`' response instead returns `payment.next_action` — `{ required,
type: "not_applicable" | "auth_redirection", url }` — redirect the shopper to
`next_action.url` only when `required` is true and `type` is
`auth_redirection`; this is the extra redirect-handling work `/v3/checkouts`
avoids.

## Signature — two DIFFERENT schemes, don't mix them up

DOKU's docs describe two signature schemes on the same site. Using the wrong
one for the wrong API produces a silent `invalid_signature` failure.

### Global signature — use this for `/v3/checkouts`, `/v3/payments`, and their notifications

String-to-sign, joined with `\n`, **no field-name prefixes**, no trailing
newline:

```
{Client-Id}
{Request-Timestamp}
{Request-Target}
{Digest}
```

- `Request-Target` is the request path, e.g. `/v3/checkouts`. For a webhook
  DOKU sends *to* the merchant, it's the merchant's own notification URL path.
- `Digest` = `base64(SHA256(raw request body bytes))`. Use the body exactly as
  sent/received — do not re-serialize or pretty-print JSON before hashing, or
  the digest won't match. Omit `Digest` entirely (and its line) for GET/DELETE
  with no body.

```
HMAC-SHA256(secret_key, string_to_sign) -> base64 -> prepend "HMACSHA256="
Signature: HMACSHA256=X78G6dJOsfFS5KjPbN9Y0iQ8ZMkadT0UZFzGwHTACHE=
```

Node.js reference:

```js
const crypto = require("crypto");

function digest(rawBody) {
  return crypto.createHash("sha256").update(rawBody, "utf-8").digest("base64");
}

function globalSignature({ clientId, requestTimestamp, requestTarget, rawBody, secretKey }) {
  const parts = [clientId, requestTimestamp, requestTarget];
  if (rawBody) parts.push(digest(rawBody));
  const stringToSign = parts.join("\n");
  const hmac = crypto.createHmac("sha256", secretKey).update(stringToSign).digest("base64");
  return `HMACSHA256=${hmac}`;
}
```

DOKU signs its responses the same way but with one field swapped: the
string-to-sign uses **`Response-Timestamp`** (from the response header) in
place of `Request-Timestamp`, and `Digest` is computed over the *response*
body. Recompute and compare on receipt; reject on mismatch rather than merely
logging it. This response-signature check and the webhook-signature check
(below) are the same mechanism applied to two different message directions —
implement one verifier and reuse it for both.

### Cards-only signature — do NOT use for Checkout/Payment/Malaysia e-wallet flows

A separate scheme exists specifically for the legacy Cards Payment API and
includes an extra `Request-Id` component with `Key:value` prefixed lines
(`Client-Id:...\nRequest-Id:...\n...`). It only applies when integrating that
older card-specific endpoint directly. If you're using `/v3/checkouts` or
`/v3/payments`, ignore this scheme.

**This matters for webhook verification too, not just outgoing requests**:
DOKU's own "Sample Notification - Cards" reference uses the Cards-only scheme
(`Client-Id`, `Request-Id`, `Request-Timestamp`, `Request-Target`, `Digest`,
all `Key:value`-prefixed) and a different header set (no `Authorization`/
`API-Version`), while "Sample Notification - Global" (what a Checkout/e-wallet/
FPX/BNPL flow triggers) uses the Global scheme described above. Which scheme a
notification arrives signed with **depends on which product produced the
underlying payment**, not on the fact that it's a webhook. For a
Malaysia storefront built on `/v3/checkouts`, expect Global-scheme
notifications only — unless a Cards-specific integration is added later.

## Webhook / payment notification

DOKU does **not** take a notification URL via API call — it's configured
per tenant, per payment channel, in **DOKU Back Office → Settings → Webhook →
Create Webhook**. Each payment channel can only be linked to one URL endpoint.
This is a manual dashboard step: a multi-tenant product's onboarding flow must
surface the tenant's exact notification URL for them to paste there, since
nothing automates it.

Requirements:
- Endpoint must be public HTTPS — DOKU cannot reach `localhost`, VPN-gated, or
  auth-gated URLs.
- Only the **Payment Notification** event is currently supported (per DOKU's
  own docs) — don't design for other webhook event types yet.
- Respond with HTTP `2xx` to acknowledge. A non-2xx response is retried 3
  times: 30 min after the original attempt, then 5h30m after *that* (6h from
  the original), then 11h30m after that (12h from the original) — then DOKU
  stops. Make the notification handler idempotent (dedupe on `id`/invoice
  number), since a slow-but-eventually-2xx response can still overlap a retry.
- Verify the `Signature` header (Global scheme, `Request-Target` = your own
  notification path) before trusting the payload — reject on mismatch.
- Payload: `id`, `order{amount, invoice_number, currency, expired_at}`,
  `payment{channel, type, amount, currency, status, state}`, `customer`,
  `metadata`.
- Ops note: a merchant can also manually re-trigger a stuck notification from
  **DOKU Back Office → Integration → HTTP Notification** (find it, click the
  retry/plane icon) — useful to document in a support runbook for "customer
  paid but order shows unpaid" tickets, before assuming it's a bug in the
  integration.

## Do / Don't

- ✅ Do encrypt the Secret Key at rest (tenant+provider-bound AAD if
  multi-tenant).
- ✅ Do use the raw, unmodified response/request body when computing or
  verifying a `Digest` — beautifying JSON breaks the hash.
- ✅ Do reject (not just log) a notification with an invalid `Signature`.
- ❌ Don't send the Secret Key in any request — it's signature-only.
- ❌ Don't expose the Secret Key in client-side code or a mobile app.
- ❌ Don't use the Cards-only signature scheme for Checkout/Payment/e-wallet
  flows, or vice versa — including for webhook verification.
- ❌ Don't assume a webhook URL can be registered via API — it's dashboard-only.
- ❌ Don't hardcode one `API-Version` string across Payment/Checkout and
  Notification calls — they differ.
- ❌ Don't treat a slow notification handler as safe just because it
  eventually returns 2xx — DOKU may already be mid-retry; make handling
  idempotent.

## Further reference

A DOKU-published Postman collection for Malaysia exists at
`github.com/PTNUSASATUINTIARTHA-DOKU/postman-collection-my` — useful for
cross-checking a concrete request/response pair against what this skill
describes.
