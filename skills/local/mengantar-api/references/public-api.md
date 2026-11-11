# Mengantar Public API — endpoint notes

Read from `https://api-public.mengantar.com/docs/` and the sandbox host on
2026-11-11 (sandbox notes are hidden on the production hosts). Re-read the docs
before coding; they win over this file. All paths are under
`{BASE_URL}/api/public/{API_KEY}` unless marked otherwise.

## Addresses and pickup

| Endpoint | Notes |
|---|---|
| `GET /address/search?keyword=` | Area lookup (province/city/district/subdistrict/ZIP). The path key is not validated, but keep the call server-side anyway. Returns area `_id`. |
| `POST /address` | Add or update (`_id`) a pickup address from an area `_id` (`PICKUP_AUTOFILL`). Optional `pinpointData {lat,lng}` (required for Pos Indonesia scheduled pickup) and separate `SHIPPER_*` return address. |
| `GET /address` / `PUT /address/{id}` / `DELETE /address` | List, partial update, permanent delete. |
| `POST /time` | `address_id`, `date` (`mm-dd-yyyy`), `time` (`9:00`, `10:00` … `18:00`). Must be ≥ 90 min ahead or `invalid pickup time`. Returns one slot. |
| `GET /time` | Saved slots (array). |
| `GET /my-users` | Sub-account users for `assignee`. |

## Estimates

| Endpoint | Pricing | Notes |
|---|---|---|
| `GET /order/estimate` | Account discount (shipping volume) | `courier` one of `JNE`, `SiCepat`, `Sap`, `iDexpress`, `JT`, `lion`, `anteraja`, `pos`, `spx`, or `all` (default `JNE`). `COD_AMOUNT` = goods value + shipping fee. |
| `GET /api/order/allEstimatePublic` (no key) | Flat, 20% discount | All couriers. |
| `GET /api/order/allEstimate3PL` (no key) | Raw courier rates, no markup | All couriers; no COD parameter; coverage flags can be `null` (treat as unknown); `minimumWeightCargo` for cargo-capable couriers. |
| `POST /order/getPerformancePublic` | Courier scores | Whitelisted accounts only in production (403 otherwise); not whitelisted in sandbox. |

Coverage matrix: `unsupported` true → no delivery at all (COD or not);
`unsupported` false + `unsupported_cod` true → non-COD only.

Courier rules in the docs:
- **Dangerous Goods**: `isDangerousGoods=true` on the estimate; proceed only when
  `isDangerousGoodsSupported` is true **and** `unsupported` is false. The docs disagree
  on which couriers can *create* DG orders: estimates list SiCepat, SAP, IDExpress and
  J&T; the Create Order field description lists JT, SiCepat and iDexpress; the Create
  Order DG table lists only SiCepat (`HALU`) and iDexpress. Only those two are
  consistent. Do not offer DG with SAP or JT until a sandbox `POST /order` succeeds:
  the estimate flag alone can pass and the order then fail with "Dangerous goods
  service is not supported by courier …". DG cannot combine with cargo.
- **SPX** (`spx`): ≤ 50 kg, COD ≤ Rp5,000,000, non-COD goods value ≤ Rp10,000,000.
- **Pos Indonesia** (`pos`) COD: delivered rate ≥ 82%, computed over orders of **all
  couriers** in the rolling 21–60 day window. Order creation answers 403 for
  `new_seller` (no delivered history), `insufficient` (no period yet, or under 21 days)
  and `blocked` (last three periods all below 82%); `eligible` and `warning` succeed.
  So a brand-new seller cannot use Pos COD from day one. Non-COD is unaffected.
- **Ninja**: discontinued 2026-09-01 (`400 COURIER_DISABLED`), still readable.

## Orders

`POST /order` — body `courier`, `pickup {type: scheduledPickup|dropOff, address_id,
time_id, volume: volumeTruck|volumeMobil|volumeMotor}` (`spx` accepts `dropOff` only when
SPX Drop Off is enabled for the account), `orders[]` with
`goodsValue` (non-COD) or `COD` (= goods + shipping + COD fee), `customerAddressDataId`,
`customerAddress`, `customerName`, `customerPhone` (10–15 digits), `weight` (kg),
`quantity`, `parcelContent`, optional `customProducts[]` (JNE, SiCepat, Sap, JNT; totals
must match weight and quantity), `cargo`, `isDangerousGoods` (JSON boolean),
`dropShipper {id,name,phone}` (saved master, exact match; whole batch rejected on
mismatch), `assignee` (user `_id` from `GET /my-users`; the parameter table shows it at
the top level, the examples and `GET /order` put it on each order: send it per order and
verify in sandbox).

Idempotency: header `idempotencyKey` (read from the header only, ignored on a
`validate` request); codes and retry rules in SKILL.md rule 3. A replay returns the
first response with `Idempotent-Replayed: true` / `"idempotentReplayed": true`; it is a
copy, not current state. A first request that failed with 5xx is replayed, never re-run.
Deleting a batch does not release the key: resend with a new key.

| Endpoint | Notes |
|---|---|
| `POST /order/pay-unpaid` | `courier`, `batch_id`; returns count and `cnote_no[]`. |
| `GET /order` | `size` ≤ 100, `page` ≤ 100, then `cursor` (`nextCursor`). page × size ≤ 1,500 without `courier`, and also with `courier` when `dateRange` reaches archived orders (> ~6 months); `cursor` has no ceiling. `tracking_id` / `order_id` returns one order with `history[]` (`DD-MM-YYYY HH:mm`, Asia/Jakarta) and searches the archive. Default window ≈ last 6 months unless `dateRange`. |
| `DELETE /order` | Only while `active`, `error`, `PENDING PICKUP`, `PICKUP FAILED`, `PICKUP_FAILED_API`. AnterAja only after 5 minutes. Other couriers forward to the courier, which may refuse. |
| `GET /batch`, `DELETE /batch` | Batch list (`orderData[]`): `page` ≤ 100, `size` ≤ 100, no cursor; without `courier` the size is split across couriers. Delete reports `deletedCount`/`unDeletedCount`. |
| `POST /order/simulation` (sandbox only) | Set one own order to `ON DELIVERY`, `DELIVERED` or `RTS` (`orderId` or `trackingId`; `statusCategory` or `status`). Fires one webhook. 404 in production; 409 deleted order; 422 with `supportedValues` for a bad target. `ON DELIVERY` is stored per courier (e.g. SiCepat category `DELIVERY COURIER`). Ninja unsupported. |
| `GET /invoices` | Balance and invoices, cursor pagination. |
| `GET /getReceiverScoreByNumberUser?search=` | Production: whitelisted (403 otherwise), daily allowance by order volume (429). Sandbox: open, deterministic sample data (number ending in `0` → no-valid-courier shape). One number per request (422 otherwise). `summary.average_score` may carry a `≈` prefix. |
| `POST/GET /dropshippers` | Saved dropshipper master; needs `createOrder` permission and the feature enabled; search `perPage` ≤ 100 (default 20). |

## Labels (beta, asynchronous)

`POST /label-generation` (`orderId`, `courier`, `format`) → `202` with
`labelGenerationId`, never a URL. `GET /label-generation/{id}` → `PENDING`,
`PROCESSING`, `COMPLETED` (signed URL, 15 min per poll), `FAILED` (`errorMessage`).
`FAILED` still answers HTTP 200. Formats `normal-1/2/4/6`, `thermal-10x10/10x15/8x6`;
`thermal-new-10x10` and `thermal-new-10x15` only for J&T or SPX. Needs the `labelGeneration` permission. 8 Print actions per minute per parent
account, shared with Seller Web.

## Webhook

Set in Settings → Account → Integrasi Public API (HTTPS, public host, ≤ 512 chars).
Production webhooks are enabled per account during the staged rollout; sandbox has
them for everyone. Body: `cnote_no`, `order_id`, `courier`, `status_category`.
Headers `x-timestamp` (ms), `x-signature`, and `x-environment: sandbox` on sandbox only
(not signed). Respond 2xx within 5 s; no redirects. Docs test vector: secret
`testsecret`, timestamp `1787548800000`, body
`{"cnote_no":"JNE1234567890","order_id":"ORD-000123","courier":"JNE","status_category":"DELIVERED"}`
→ `05826dec707ea7164801d952cb7eaf7ce9adc0c8aa0b93366480434164a1a111`.
Mengantar-originated values: `ACTIVE/WAITING NEXT PROCESS`, `ERROR`. Paused after 20
consecutive failed updates within 24 h (any success resets); reactivate in the same
settings section; updates during the pause are not resent.
