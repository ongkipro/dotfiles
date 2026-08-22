# Headless delivery contract

Use this reference for implementation, audit, or migration acceptance. Adapt
the details to the approved architecture; do not create a generic integration
layer merely to satisfy the checklist.

## Data and cache classification

| Class | Examples | Rule |
|---|---|---|
| Public, slow-changing | brand content, policies, stable collections | Cache deliberately; invalidate or accept stated staleness |
| Public, context-sensitive | product price, availability, localization, market catalog | Vary cache by every response-changing context; keep TTL conservative |
| Private or mutable | cart, account, buyer identity, personalized price, consent | `no-store`/private; never put in a shared response cache |
| Mutation result | cart updates, login callback, webhook processing | Authoritative server response; idempotency/retry/error contract required |

Do not cache a full page that can include cart/account/customer context unless
the personalized fragments are isolated and the cache boundary is demonstrably
safe. Caching is an explicit data-safety decision, not only a performance tool.

## Commerce lifecycle

1. Resolve product and variant from current Shopify data using the active
   market and buyer context where applicable.
2. Create/read/update the cart through Storefront API. Preserve opaque cart ID
   confidentiality and reconcile UI from returned cart fields and `userErrors`.
3. Explain recovered conflicts: unavailable line, quantity rule, discount,
   delivery eligibility, price, market, or cart expiry. Never silently discard
   the buyer's intent.
4. Navigate only to current `checkoutUrl` returned by Shopify. Shopify checkout
   owns payment, tax, final delivery price, order creation, and confirmation.
5. Treat a return or Thank You render as a distinct lifecycle from finalized
   order evidence. Use supported platform event/data surfaces for the claim the
   experience needs.

## Account, privacy, and analytics

- Use OAuth 2.0 + PKCE and server-side session handling for Customer Account
  API flows. Account responses must never be shared-cacheable.
- Respect consent before emitting non-essential tracking. For custom storefront
  integration, use Shopify’s Customer Privacy API with its headless setting;
  use the supported Shopify analytics/pixel path where it meets the need.
- Define one funnel-event owner and a deduplication key across browser,
  server, pixels, checkout, and ad platforms. Never log cart IDs, access
  tokens, customer fields, addresses, payment data, or raw authorization data.
- Validate analytics separately from checkout completion: page view, product
  view, add to cart, checkout initiation, and order/purchase signals each have
  different authorities and consent conditions.

## Resilience and operations

- Pin supported Storefront and Customer Account API versions and review the
  Shopify changelog on the project’s scheduled upgrade cadence.
- Handle GraphQL errors, `userErrors`, transport failures, checkout throttles,
  and Shopify security rejection without exposing implementation details.
- Pass the actual buyer IP on private server-side Storefront calls when the
  runtime safely provides it. Do not forward untrusted spoofable headers
  without a verified proxy policy.
- Make webhook consumers authenticated, signature-verified, idempotent,
  observable, and replay-safe before relying on them for a mirror or cache
  purge. A missed webhook requires a bounded reconciliation mechanism.
- Rotate credentials using overlap: provision new, update all consumers,
  verify, then revoke old. This is an approval-gated external operation.

## Minimum executable evidence

Prove the approved journey in a running environment: public routes and
redirects, market/locale behavior, variant selection, cart mutation/error
recovery, checkout handoff, account login/logout if present, consent-aware
analytics, private cache non-leakage, and monitoring/error visibility. For a
migration, additionally prove canonical/redirect behavior, merchant content
updates, and rollback readiness.
