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

### Zero-DB-read edge cache & instant atomic purge (default pattern for ad-traffic SaaS)

When an advertiser launches a campaign, thousands of anonymous visitors hit the same product or
landing page within a minute. Protect per-tenant Durable Object RPCs and D1 row budgets with the
**hand-rolled Cache API (`caches.default`) pattern** (not automatic Workers Cache, which skips the
Worker and drops first-party click-ID cookie capture):

1. **Resolve tenant first (5 s in-isolate memory cache on `PLATFORM_DB`), then check `caches.default`
   before opening the tenant store (`TenantStore` DO / D1):**
   - Synthetic cache key: `https://cache.<platform>/t/<tenantId>/v<cacheVersion>/<host><path>?<keptQuery>`.
   - Strip ad/attribution parameters (`fbclid`, `gclid`, `gbraid`, `wbraid`, `ttclid`, `_ttp`, `_fbp`,
     `_fbc`, `utm_*`, `ref`, `msclkid`, `gad_*`) from `<keptQuery>` so 5,000 ad clicks share **one**
     cached HTML entry (`0` tenant DB reads on hits!).
   - If the page varies by geo-IP (e.g. province-based COD vs non-COD form), append an internal
     geo key (`__prov=<CF-Region-Code>`) to the synthetic cache URL, never the public URL.
   - **Never** read or write the cache when a session cookie or `Authorization` header is present,
     or when the response has `Set-Cookie`, `private`, or `no-store`.
2. **Preserve first-party attribution cookies on cache hits:**
   - Because the Worker still executes on a `caches.default.match()` hit, parse `?fbclid` / `?gclid` /
     `?ttclid` / `?utm_*` from the incoming `request.url` and append the first-party `Set-Cookie`
     header onto a mutable copy of the cached `Response` before returning it! Browser `Cache-Control`
     stays `public, max-age=0, must-revalidate` while the internal edge copy holds `max-age=120`.
3. **Instant atomic cache invalidation (`cache_version = cache_version + 1`):**
   - Never rely on slow URL-by-URL purge APIs. Increment `tenants.cache_version` in `PLATFORM_DB`
     (and invalidate the isolate's 5 s host-cache entry for that tenant) whenever:
     - a tenant is suspended, resumed, or purged, or its hostname moves; **AND**
     - the tenant admin mutates storefront-visible data (product price/active state/content, landing
       page publish/edit, store identity/theme/COD-province rules, or ad pixel IDs).
   - Every isolate picks up `v<cacheVersion + 1>` within `<= 5 s` (0 s on the writing isolate),
     making stale HTML unreachable worldwide with **one integer increment**!

## Secrets and providers

Provider credentials per tenant; never fall back to a platform-wide environment secret. A static
test that fails on environment reads outside the platform module keeps it that way.

## Webhooks

Providers do not send your tenant's `Host`: route webhooks to an immutable per-tenant hostname plus
a per-tenant secret, verified before any write. A secret carried as a path segment makes the request
URL sensitive: Workers invocation logs record the full URL (Cloudflare Workers Logs, 2026-11-15), so
turn them off (`observability.logs.invocation_logs: false`) and log the matched route pattern instead.

## Tests

Tenant A's session, ids, API keys, webhook secret and cookies against tenant B's host and the
platform host — refused on admin API, public API, order status, media, KV-backed endpoints,
webhooks and cached pages. Run in CI on every commit; a failure blocks release.
