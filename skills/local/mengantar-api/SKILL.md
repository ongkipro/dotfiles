---
name: mengantar-api
description: >-
  Integrate the Mengantar API (Indonesian courier aggregator): estimates, COD, idempotent orders, batching, labels, webhooks, sandbox, per-seller keys. Not AutoLaris (autolaris-h2h), storefront UX, or payment accounting.
---

# Mengantar API

Use this skill for Indonesian shipping, courier estimates, COD, labels, and order
status through Mengantar, including platforms that hold one Mengantar key per
merchant. It owns the Mengantar contract only; storefront behavior, order modeling,
payment accounting and courier UI belong to their own skills.

## Source of truth

Mengantar publishes its Public API reference; re-read it before coding, it changes
often (new couriers, discontinued couriers, new headers):

- Public API: `https://api-public.mengantar.com/docs/` (same text on
  `app.mengantar.com/docs/` and `sandbox.mengantar.com/docs/`). Fetch with plain
  `curl`; some fetchers get 403. Read the **sandbox host** too: its sandbox notes
  are hidden (`display:none`) on the production hosts, so a text extractor that
  drops hidden nodes misses them.
- Courier status codes: the "Order Status Reference Sheet" linked from the docs.
- Seller onboarding for partner platforms: documented separately and **privately**
  for partners with an agreement. Its contract never goes into a public repository;
  see [references/partner-api.md](references/partner-api.md) for the safe rules and
  `~/.config/ai-local/mengantar/` for a device-local snapshot when one exists.

This skill summarizes the docs as read on **2026-11-11**. When the docs and this
file disagree, the docs win; fix this file. Endpoint detail:
[references/public-api.md](references/public-api.md).

## Non-negotiables

1. **Server only.** Keyed paths are `{BASE_URL}/api/public/{API_KEY}/…`. Never put
   the base URL or key in browser or mobile code, analytics, error messages, or
   logs; redact the path before logging. Rotate a leaked key (that also replaces
   the Webhook Secret).
2. **Gate checkout on both coverage flags** from every estimate:
   `unsupported: true` → no delivery at all; `unsupported_cod: true` → non-COD only.
   Dangerous Goods: see the reference; only SiCepat (`HALU`) and iDexpress are DG
   couriers consistently across the docs.
3. **Create orders idempotently.** Header `idempotencyKey` (1–50 chars, your own
   order/batch reference, remembered 24 h per account), exact same body on every
   retry. `400 IDEMPOTENCY_KEY_INVALID` → fix the key. `409
   IDEMPOTENCY_REQUEST_IN_PROGRESS` → wait `Retry-After`, same key. `422
   IDEMPOTENCY_KEY_REUSED` → different body under an old key. `503
   IDEMPOTENCY_UNAVAILABLE` → nothing created, retry with the **same** key. `409
   IDEMPOTENCY_REQUEST_UNRESOLVED` or a **replayed 5xx** (`Idempotent-Replayed:
   true`) → it may have created part of the batch: check `GET /order`, then send only
   the missing orders with a **new** key. A 4xx rejected before creation releases
   the key.
4. **One batch at a time per account for JT Premium and SiCepat** (Mengantar assigns
   their AWB numbers sequentially). Parallel requests get `409` ("Sedang ada proses
   pembuatan order …"). Queue per account and group orders into one batch.
5. **Insufficient balance still "succeeds".** A non-COD order is created with
   `isPaid: false` and `cnote_no: null`. Top up, then `POST /order/pay-unpaid`
   (`courier`, `batch_id`); never create the shipment again.
6. **Webhooks are verified and are not the only path.** HMAC-SHA256 hex of
   `{x-timestamp}.{raw body}` keyed with the Webhook Secret, constant-time compare,
   reject stale timestamps, refuse `x-environment: sandbox` in production. Delivery is
   best effort (3 retries, may arrive out of order: order by `x-timestamp`; paused
   after 20 consecutive failed updates within 24 h; missed updates are not resent),
   so reconcile with `GET /order`. Branch on `status_category` with a default branch;
   handle both `CANCELED` and `CANCELLED`.
7. **Ninja is discontinued from 1 September 2026** for estimates, new orders and
   pay-unpaid (`400 COURIER_DISABLED`); historical reads still accept it.

## Workflow

1. Areas: `GET /address/search?keyword=` → area `_id` (estimate `origin_id` /
   `destination_id`, order `customerAddressDataId`). Pickup addresses: `GET /address`;
   their `_id` is `pickup.address_id`, distinct from the area id in `PICKUP_AUTOFILL`.
2. Estimate with the endpoint that fits the business model:
   `GET /order/estimate` (keyed; account-specific discount; `COD_AMOUNT`),
   `GET {BASE_URL}/api/order/allEstimatePublic` (no key in the path; flat 20%
   discount), `GET {BASE_URL}/api/order/allEstimate3PL` (no key in the path; raw
   courier rates, no COD parameter; may return `null` coverage flags, treat as unknown).
3. Pickup slot: `POST /time` (`date` `mm-dd-yyyy`, `time` `9:00`…`18:00`, **at least
   90 minutes ahead**). SPX validates the slot against its own live schedule. Pos
   Indonesia scheduled pickup needs `pinpointData` on the pickup address.
4. Create: `POST /order` with `idempotencyKey`; store the full envelope (`data[]`,
   `batch_id`, `errors[]`, `ordersClosedDestination`).
5. Track: webhook plus `GET /order` (cursor pagination; `tracking_id`/`order_id`
   lookups return `history`). In sandbox drive statuses with `POST /order/simulation`.
6. Labels: `POST /label-generation` (one order per request, 8 Print actions per
   minute shared with Seller Web) → poll `GET /label-generation/{id}` until
   `COMPLETED`; the download URL lasts 15 minutes per poll.

## Accounts, users and environments

- **One key = one seller account.** Every order created with a key belongs to that
  account and uses its rates and balance. A platform serving many merchants keeps one
  key per merchant (their own key pasted in, or one issued through partner
  onboarding), stored per merchant and never shared across tenants.
- **Team users inside one account**: `GET /my-users` lists the account's users; pass
  a user `_id` as `assignee` to attribute an order. Label printing and the
  receiver-score allowance are counted per parent account across its sub-accounts.
- **Sandbox and production are separate deployments** with separate accounts, keys
  and Webhook Secrets. Never let a sandbox key, webhook or data path reach production.

## Sandbox (documented on the sandbox host)

- Balance: **Top Up Saldo** in the sandbox app, then pay in the Midtrans sandbox
  simulator.
- Known sandbox-only courier errors: **JNE** needs a Jakarta pickup address ("Content
  not confirm our security Policy."); **SAP** supports only non-COD Jakarta→Jakarta
  ("Service tidak ditemukan dalam kontrak"); **SPX** accepts only a Jakarta origin and
  rejects some destinations. None of these happen in production.
- `POST /order/simulation` (sandbox only, 404 in production): move your own order to
  `ON DELIVERY`, `DELIVERED` or `RTS` and fire one webhook, so create → simulate →
  read is testable end to end.
- Whitelisted endpoints are open in sandbox: courier performance, and receiver score
  (sample data; the same number gives the same sample, a number ending in `0` gives
  the "no valid courier" shape). Webhooks need no enablement in sandbox.

## Bounded sandbox smoke check

From a trusted backend with a **sandbox** key: one Jakarta→Jakarta non-COD estimate
(`courier=all`). Pass only on HTTP 2xx, documented JSON shape, at least one courier
estimate, and boolean `unsupported` / `unsupported_cod`. Record status, relevant
fields, environment and date without the credential-bearing URL. Creating orders,
paying, or anything on production needs explicit approval.
