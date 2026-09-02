---
name: autolaris-h2h
description: >-
  Integrate AutoLaris H2H for Indonesian shipping, payment channels, Create
  Order `/submit`, and Advice reconciliation. Use when a task mentions
  AutoLaris, `/api/h2h`, Create Resi, Cek Ongkir, QRIS/VA via AutoLaris,
  `courir_id`, or Advice payment status.
---

# AutoLaris H2H Integration

Use this skill for a server-side integration with AutoLaris H2H. It covers the
published H2H endpoints, a merchant-approved non-physical payment profile, and
safe payment reconciliation. It does not authorize a live provider call, order
creation, credential read, callback change, or deployment; obtain the user's
explicit approval for those actions.

## Evidence boundary

The local references are a sanitized snapshot of the public AutoLaris Postman
collection, reviewed on 2026-09-03. The current provider documentation,
merchant account configuration, and a sanitized observed response override this
skill if they conflict.

Before relying on a changed provider contract, verify the current Postman
collection or provider support response. Do not save a raw public collection to
disk or copy credentials from it: public examples can contain exposed tokens.
Extract only the method, path, field names, and sanitized sample values needed
for the review.

## Read the smallest relevant reference

| Task | Read |
|---|---|
| First integration, prerequisite, and flow selection | [getting started](references/docs/getting-started.md) |
| Endpoint path, request fields, and response shape | [H2H reference](references/docs/reference/h2h-api.md) |
| QRIS/VA/e-wallet, fees, callbacks, Create Order, and Advice | [payment guide](references/docs/guides/payment-gateway.md) |
| Node.js, Astro, Next.js, Workers, or PHP server examples | [integration guide](references/docs/guides/integration.md) |
| Machine-readable contract review or code generation | [OpenAPI 3.1](references/openapi/autolaris-h2h.openapi.json) |

## Non-negotiable integration rules

1. Keep the Bearer API key server-side. Never put it in frontend code, source
   control, logs, fixtures, chat, or a public example. Rotate any exposed key.
2. Use `GET /api/h2h/list_payment` at runtime for enabled payment channels and
   account-specific fee configuration. Do not hardcode a global channel list.
3. For physical delivery, obtain `courir_id` from `POST /api/h2h/ongkir`; do
   not derive it from a courier name or reuse a stale hardcoded value.
4. `POST /api/h2h/submit` creates one order/payment instruction. Persist a
   stable local `reff_id` first and never pair it with a second
   `/create_payment` call for the same checkout.
5. The non-physical `courir_id: 1` profile is a merchant-account agreement, not
   a public provider guarantee. Use it only after AutoLaris has approved it for
   that account. It does not create an AWB, pickup, booking, or dispatch.
6. In Create Order, `callback_url` is for shipping tracking status, not payment
   settlement. An empty value appears in the provider example.
7. Reconcile a created transaction via `POST /api/h2h/advice` using the
   provider-issued `transaction_id`, never the local `reff_id`.
8. The provider has not published a complete Advice settlement mapping. Pending,
   generic success wording, and shipping vocabulary such as `DELIVERED` are not
   proof of payment. Mark an order paid only under a settlement policy confirmed
   for the merchant account.
9. A paid status must not automatically dispatch a physical shipment. Keep the
   fulfilment decision explicit and idempotent.

## Default implementation procedure

1. Identify whether the product is physical shipping, payment-only,
   digital/subscription, or payment instruction only.
2. Load the relevant reference above and verify its request fields against the
   current provider source when the behavior is time-sensitive.
3. Implement the provider request in a trusted server path with a timeout,
   response-envelope check (`rc === "00"`), bounded retries, and sanitized
   errors.
4. Persist `reff_id` before the request; atomically persist the provider
   `transaction_id`, `trx_id`, or `awb` returned by the selected flow.
5. For payment status, schedule bounded, idempotent Advice reads. Do not create
   a new provider transaction while retrying an unknown result.
6. Add the smallest runnable check that rejects malformed payloads, duplicate
   transaction creation, or an unproven payment-state transition.

## Published endpoint map

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/h2h/ongkir` | Quote eligible courier services and receive `courir_id` |
| `POST` | `/api/h2h/order` | Create a physical shipment / resi |
| `POST` | `/api/h2h/lacak` | Track an `awb` |
| `POST` | `/api/h2h/cancel` | Cancel a provider transaction |
| `POST` | `/api/h2h/create_payment` | Create a payment instruction without shipment |
| `GET` | `/api/h2h/list_payment` | List channels and fee configuration for the account |
| `POST` | `/api/h2h/submit` | Create an order with payment instruction |
| `POST` | `/api/h2h/advice` | Read one provider transaction status |

## Safety checks before handoff

- A live key is supplied through the project's secret mechanism, never source.
- Every successful HTTP response is checked for `rc === "00"` before consuming
  `data`.
- `reff_id` is stable and persisted before a creation request.
- `transaction_id` is saved and used for Advice.
- A physical order uses a quote-derived `courir_id`.
- Payment reconciliation does not treat a tracking callback or generic status as
  paid, and cannot dispatch delivery as a side effect.
