# Isolation checklist for a shared Worker

Treat tenant resolution as the security boundary: R4 work, independent review, negative tests.

## Request path

1. Pass HTTP DCV paths through first (`/.well-known/acme-challenge/*`, `/.well-known/pki-validation/*`).
2. Normalise `Host`; ignore `X-Forwarded-Host`; reject IP literals and absurd lengths.
3. Exact-match platform hosts → platform context, no tenant.
4. Authoritative lookup of the host → tenant; unknown/pending/purged → neutral 404, suspended → 403,
   recovery → 503 — all before any cache read or tenant query.
5. A host moved to another tenant: revoke, bump the old tenant's cache version, quarantine it for
   the in-isolate cache TTL before activating for the new tenant.

## Sessions and requests

- Platform and tenant hosts on different registrable domains.
- `__Host-` cookies (`Secure`, `Path=/`, no `Domain`), different signing secrets for tenant and
  platform sessions. Deleting a `__Host-` cookie also needs `Secure` (the prefix rules apply to
  every `Set-Cookie`). Local development: serve HTTPS, or verify with a set/send/delete test on
  your browser version before relying on plain-HTTP `localhost` subdomains.
- Unsafe authenticated requests: `Origin` equal to the request origin and
  `Sec-Fetch-Site: same-origin`; refuse a missing `Origin`.
- A cross-domain sign-in hand-off (platform signup → tenant admin) needs a single-use, short-lived,
  host-bound token redeemed on the tenant host by POST, with a narrow origin exception.

## Everything keyed by tenant

API keys, rate limits, outboxes, cron/alarm work, feeds, sitemaps, robots, CSP and embed
allowlists, media (R2 prefixes), KV, edge cache, logs (`tenant_id` on every line).

## Secrets and providers

Provider credentials per tenant; never fall back to a platform-wide environment secret. A static
test that fails on environment reads outside the platform module keeps it that way.

## Webhooks

Providers do not send your tenant's `Host`: route webhooks to an immutable per-tenant hostname plus
a per-tenant secret, verified before any write.

## Tests

Tenant A's session, ids, API keys, webhook secret and cookies against tenant B's host and the
platform host — refused on admin API, public API, order status, media, KV-backed endpoints,
webhooks and cached pages. Run in CI on every commit; a failure blocks release.
