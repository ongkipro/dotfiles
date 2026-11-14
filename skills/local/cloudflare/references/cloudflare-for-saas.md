# Cloudflare for SaaS — multi-tenant apps on customer domains

Local reference (owner rule, 2026-11-13). Verified against developers.cloudflare.com on
2026-11-13; prices, plan gates and limits change, so re-check the linked pages before relying on a
number. Pair with [APAC placement](apac-placement.md) for Indonesian/SEA tenants.

Use when one application serves many customers ("tenants") and each tenant gets its own hostname:
a platform subdomain (`toko.platform.com`) and/or a custom domain (`shop.customer.com`). Not for
running customer-supplied code — that is Workers for Platforms
([references/workers-for-platforms](workers-for-platforms/README.md)).

## 1. Pieces and how traffic flows

```
visitor ─► shop.customer.com (CNAME ► customers.platform.com)
          └► SaaS zone platform.com ─► Worker route */* ─► platform Worker (fallback origin)
                                                         └► resolve tenant from Host ─► tenant data
```

- **SaaS zone**: your own zone (e.g. `platform.com`) with Cloudflare for SaaS enabled
  (Custom Hostnames page → Enable; non-Enterprise needs a payment method).
  [Enable](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/enable/)
- **Fallback origin**: a proxied DNS record in the SaaS zone that custom hostnames route to. With a
  Worker as the app, make it **originless**: `AAAA service 100::` (proxied), set it as fallback
  origin, confirm status **Active**.
  [Worker as origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/)
- **CNAME target** (optional, recommended): `customers.platform.com` CNAME → fallback, proxied.
  Customers point their hostname here.
  [Getting started](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/)
- **Worker route `*/*`** on the SaaS zone → the platform Worker. It catches every custom hostname
  and your own subdomains; add more specific routes with **Worker: None** to exclude hostnames
  (e.g. `api.platform.com/*`). A Worker route bypasses the per-hostname `custom_origin_server`.
- **Tenant identity**: read `Host` (normalise case, strip port/trailing dot) and look it up in your
  own hostname table. `request.cf.hostMetadata` (custom metadata) exists but is an
  **Enterprise add-on**; do not design around it on Free–Business.

## 2. Plans and limits (Free/Pro/Business vs Enterprise)

| | Free / Pro / Business | Enterprise |
|---|---|---|
| Custom hostnames included | 100 | custom |
| Price per extra hostname | $0.10 / month | custom |
| Max hostnames | 50,000 (API hard cap; quota endpoint shows `hard_cap`) | unlimited (sales over 50k) |
| Apex proxying / BYOIP (bare `customer.com`) | **No** | paid add-on |
| Custom metadata (`hostMetadata`) | **No** | paid add-on |
| Wildcard custom hostnames, custom certs, CA choice, mTLS | No | Yes |
| WAF for SaaS custom rulesets | zone-plan WAF only | Yes |

Source: [Plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/).

Consequences on non-Enterprise plans:

- **Offer subdomains, not apex.** Most DNS providers forbid CNAME at the apex; without apex proxying
  the customer uses `shop.customer.com` / `www.customer.com`. Customers on Cloudflare DNS can
  CNAME-flatten the apex themselves.
- Every hostname **bills from creation until deletion**, including pending ones. Delete failed and
  churned hostnames promptly; watch `GET /zones/{zone}/custom_hostnames/quota`
  (`allocated`, `used`, `exceeded`, `hard_cap`); over the hard cap the create API refuses.
  [Quotas and billing](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/quotas-and-billing/)
- Never create a custom hostname equal to the SaaS zone name.

## 3. Custom hostname lifecycle (API)

Token permission: **SSL and Certificates Write** on the SaaS zone (read for polling).

1. `POST /zones/{zone}/custom_hostnames` `{ hostname, ssl: { method: "http"|"txt", type: "dv" } }`.
   The POST response may omit `validation_records`; **GET again after a short delay**.
2. Tell the customer: CNAME `shop.customer.com → customers.platform.com` (+ TXT records if you use
   pre-validation or TXT DCV).
3. Poll `GET /zones/{zone}/custom_hostnames/{id}` (or subscribe to the SSL for SaaS webhook
   notifications). **Ready only when `status == "active"` AND `ssl.status == "active"`** and DNS
   points at your target. A TLS handshake succeeding is not proof (another cert may answer).
   [Common API calls](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/common-api-calls/)
4. Route tenant traffic only after both are active; before that, serve a "connecting your domain"
   page or 404 — never the wrong tenant.
5. Churn: `DELETE` the custom hostname (also deletes its certificates, stops billing). If the
   customer only repoints DNS, the hostname goes **Moved**, then **Deleted** after 7 days — and while
   it exists a customer on Cloudflare can still route to you (hostname priority). Always delete.
   [Remove](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/remove-custom-hostnames/)

Statuses: `pending`, `active`, `active re-deploying`, `blocked` (abuse history; email
abusereply), `moved`, `deleted`. Re-check: `PATCH` with the same `ssl` object restarts validation.
[Validation status](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/validation-status/)

Validation timing: 75 retries over **7 days** (first 10 within ~20 min, then capped at 4 h apart);
unvalidated → deleted. Sending a no-change `PATCH` resets the backoff — use it when the customer
says "I added the CNAME".
[Backoff schedule](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/backoff-schedule/)

Certificate issuance rate limit: **15 certificates per minute** (successful POSTs); over it, new
issuance is blocked for 30 s. Queue bulk onboarding.
[Troubleshooting](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/reference/troubleshooting/)

## 4. Hostname vs certificate validation (two different things)

- **Hostname validation** (`ownership_verification*`) → `status`. Real-time (customer adds the
  CNAME; simple, a short gap possible) or pre-validation (TXT/HTTP token first; zero downtime;
  **not supported for O2O** hostnames).
- **Certificate DCV** (`ssl.validation_records`) → `ssl.status`. One `ssl.method`: `http` (automatic
  once the hostname points at you and is proxied — least customer effort), `txt`, or `email`.
  Renewal (90-day certs, renewable 30 days before expiry) may switch to HTTP automatically.
- **Delegated DCV**: customer adds once `_acme-challenge.<host> CNAME <host>.<your dcv target>`;
  Cloudflare renews forever. Existing `_acme-challenge` TXT records break it.

## 5. O2O — customers who are also on Cloudflare

If `shop.customer.com` is a **proxied** CNAME in the customer's own Cloudflare zone, traffic passes
the customer's zone first, then yours (`cf-connecting-o2o: 1` header). Effects:

- Route on `*/*`: the only pattern that invokes your Worker for both proxied and DNS-only customer
  records. Hostname-specific or target-specific routes break for one of the two.
- Pre-validation is unavailable; use real-time validation.
- The customer's zone settings (cache, WAF, redirects) apply before yours — "it works on my test
  domain but not theirs" is often O2O.
[How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/),
[Hostname routing](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/hostname-routing/)

## 6. Tenant data: where each tenant's rows live

| Option | Dynamic per tenant without redeploy? | Fit |
|---|---|---|
| **One D1 per tenant** | **No.** D1 is reached through a static binding; adding a binding means re-uploading the Worker (Cloudflare engineer, workerd discussion #3564, no ETA). ~5,000 bindings per script. The D1 REST API is reachable dynamically but is "best suited for administrative use": global API limit 1,200 requests / 5 min per token. | Only for a small, slowly changing tenant set with a deploy per new tenant; or Workers for Platforms (bindings per user Worker). |
| **Shared D1 + `tenant_id` column** | Yes | Simplest; one 10 GB, single-threaded database for everyone; every query needs the tenant predicate (enforce in a data layer + tests). |
| **Sharded D1** (N bindings, tenant → shard) | Yes, within the bound shards | Shared-D1 rules per shard; more capacity; shard map in a control table. |
| **SQLite Durable Object per tenant** (`idFromName(tenantId)`) | **Yes** — unlimited objects, created on first use | Physical isolation per tenant, 10 GB each, 30-day PITR, `locationHint` (`apac-se`). Code runs inside the DO (RPC); queries are synchronous SQLite in the object. Billed on DO requests, duration and storage. Docs list "per-user or per-customer SQL state" as a DO use case. |

If you put a `D1Database`-shaped adapter over a SQLite Durable Object (to keep D1 call sites),
these semantics were verified 2026-11-13 (D1 emulator source + local workerd probe; re-check in
production): D1 `meta.changes` = delta of `SELECT total_changes()` around the statement (it
**includes trigger writes**) — not cursor `rowsWritten` (adds index writes) and not `changes()`
(excludes triggers); `last_row_id` = `last_insert_rowid()`; a D1 `batch()` maps to one
`ctx.storage.transactionSync` (rolls back on throw); SQL `BEGIN`/`SAVEPOINT` are refused;
`PRAGMA user_version` → `SQLITE_AUTH`; `PRAGMA foreign_keys` toggles are no-ops inside a
transaction; trigger bodies, `RETURNING`, `?1` reuse, `AUTOINCREMENT` work. Never migrate in the
DO constructor (`blockConcurrencyWhile` has a 30 s limit and a throw resets the object; a PITR
restore would re-run the migration): migrate through an explicit RPC after persisting a bookmark.
Host→tenant ownership must not be decided by KV (eventually consistent, 60 s+).

Other per-tenant resources: **R2** one bucket with `t/<tenantId>/` key prefixes (bucket per tenant
only if needed; 100k default); **KV** key prefix `t:<tenantId>:`; **Cache API** — the cache key
includes the full URL so different hosts never collide, but never cache a response that varies by
cookie or tenant setting without putting it in the key.

Limits worth re-checking: [D1](https://developers.cloudflare.com/d1/platform/limits/) (100,000 DBs
included on Workers Paid, 10 GB each, single-threaded),
[DO](https://developers.cloudflare.com/durable-objects/platform/limits/) (10 GB per object, 500
classes), [API rate limits](https://developers.cloudflare.com/fundamentals/api/reference/limits/).

## 7. Isolation checklist for a shared Worker

Treat tenant resolution as the security boundary (R4 work, independent review):

- Tenant comes **only** from the resolved `Host` (or an authenticated platform token); never from a
  body/query parameter or a cookie alone.
- Unknown, pending, suspended host → 404/suspended page **before** any tenant query.
- Sessions/cookies: host-only cookies (no `Domain=`), and the session row bound to the tenant;
  re-check tenant on every authenticated request.
- Webhooks from providers (payment, courier) carry no tenant `Host`: route them by a per-tenant
  secret path or by looking up the provider's reference in a platform-level index.
- API keys, rate-limit counters, outboxes, crons, feeds, sitemaps, robots, CSP/embed allowlists:
  all keyed by tenant.
- Provider credentials per tenant; never fall back to a platform-wide env secret.
- Negative tests: tenant A's session, ids and keys against tenant B's host are refused everywhere.

## 8. Operations

- Analytics per tenant: filter by `clientRequestHTTPHost` (dashboard or GraphQL); Logpush with
  filters. [Analytics](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/hostname-analytics/)
- Notifications: SSL for SaaS webhook events (validation succeeded/failed, issued, renewed).
  [Webhook definitions](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/webhook-definitions/)
- Errors: **1016** = hostname not validated / fallback origin missing / standalone zone wins over a
  wildcard custom hostname; **522** behind a Worker route = request did not hit the Worker
  (check O2O and route specificity).
- Regional Services for SaaS (Enterprise) can pin TLS termination to a region; there is no
  Indonesian region, and APAC placement hints are latency, not residency (see apac-placement.md).
