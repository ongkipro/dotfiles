---
name: cloudflare-for-saas
description: >-
  Multi-tenant customer domains on Cloudflare for SaaS. Not product choice (cloudflare) or Worker style (workers-best-practices). Covers custom hostnames, root domains, O2O, one-Worker routing, tenant isolation and data.
---

# Cloudflare for SaaS — many tenants, one Worker, customer domains

Use this skill when one application serves many customers ("tenants") and each tenant reaches it
on its own hostname: a platform subdomain (`toko.platform.cc`) and/or the customer's own domain
(`shop.customer.com` or `customer.com`). It owns the SaaS-zone setup, the custom-hostname
lifecycle, root-domain onboarding, O2O, tenant resolution, per-tenant data choice and the isolation
checklist. It does not own product selection (`cloudflare`), Worker code quality
(`workers-best-practices`), Wrangler commands (`wrangler`), Durable Object code (`durable-objects`),
or running customer-supplied code (Workers for Platforms, see `cloudflare`).

Facts attributed to Cloudflare were checked against developers.cloudflare.com on 2026-11-13/14
(review: `~/Documents/work/notes/adsbook-review-2026-11-13/review-skill-cloudflare-for-saas-2026-11-14.md`).
Plans, prices and limits change: re-read the linked page before relying on a number, and say
which page and date you used. **Unless a line is attributed to Cloudflare, the security,
isolation, readiness and cleanup rules are this skill's recommended application policy.**

## Read the smallest relevant reference

| Task | Read |
|---|---|
| Plans, prices, what is Enterprise-only | [plans-and-limits](references/plans-and-limits.md) |
| Set up the SaaS zone, fallback origin, CNAME target, Worker route | [zone-setup](references/zone-setup.md) |
| Create, validate, activate, re-check, delete a custom hostname | [hostname-lifecycle](references/hostname-lifecycle.md) |
| Seller wants `customer.com` (root), not a subdomain; local DNS registrars | [root-domains](references/root-domains.md) |
| Customer is also on Cloudflare (O2O), Error 1014, Flexible SSL loops | [o2o](references/o2o.md) |
| Where each tenant's data lives (D1 vs Durable Object per tenant) | [tenant-data](references/tenant-data.md) |
| Isolation boundary, cookies, CSRF, webhooks, tests | [isolation](references/isolation.md) |
| Errors (1014, 1016, 403, 522), analytics, notifications, quota | [operations](references/operations.md) |

## Non-negotiable rules

1. **Tenant comes only from the `Host` header**, resolved by an authoritative read of your own
   hostname table. Never from a body, query, cookie alone, `X-Forwarded-Host`, or KV (eventually
   consistent). `request.cf.hostMetadata` is an Enterprise add-on; do not design around it.
2. **Unknown, pending, suspended or purged host → neutral 404/403 before any tenant query or cache
   read.** Never fall back to a default tenant.
3. **Do not intercept HTTP DCV paths** (`/.well-known/acme-challenge/*`,
   `/.well-known/pki-validation/*`): pass them through before host classification, or HTTP
   certificate validation of pending hostnames fails. If you use HTTP hostname *pre-validation*,
   serve the returned ownership token at the URL Cloudflare gives you.
4. **Activate application routing only after `status` and `ssl.status` are both `active`**, DNS
   points at your target and a tenant-specific HTTPS probe succeeds. Cloudflare calls this ready
   for production HTTPS; it may route earlier, and a TLS handshake can succeed on another
   certificate, so neither is proof.
5. **Every custom hostname counts toward usage until deleted, pending included** (Cloudflare).
   Delete failed, stale-pending and churned hostnames yourself (a 7-day reaper is a sound policy);
   do not rely on Cloudflare's automatic deletion. Watch the quota endpoint.
6. **Never create a custom hostname equal to the SaaS zone name** (403).
7. **Never tell a customer to point an A record at Cloudflare IPs.** Anycast IPs are shared and
   not stable; A-record onboarding needs apex proxying (Enterprise add-on). Root domains go through
   CNAME flattening / ALIAS / ANAME ([root-domains](references/root-domains.md)).
8. **Separate registrable domains** for the platform (signup, platform admin) and the tenant
   hostnames, `__Host-` cookies, strict same-origin checks on unsafe requests: customers'
   scripts (GTM, pixels) run on tenant hosts.
9. **Per-tenant data without redeploys is not "one native D1 binding per tenant"**: a Worker
   cannot add a D1 binding for a database created after deploy (the REST API exists but is meant
   for administration). Use a shared D1 with a tenant key, sharded D1, or a SQLite
   Durable Object per tenant ([tenant-data](references/tenant-data.md)).
10. Creating, deleting or editing real custom hostnames, DNS records or zone settings is a
    production action: get the owner's explicit approval for each one.

## Worked example

`adsbook.id` (2026-11-13/14) applies every rule above: platform on `adsbook.id`, sellers on
`<slug>.belanja.cc`, CNAME target `cname.belanja.cc`, root domains by flattening with a `www`
fallback, one SQLite Durable Object per tenant. Spec: `~/Projects/adsbook.id-docs/docs/spec/`
(`08-DOMAIN-ROUTING.md`, `06-TENANT-ISOLATION.md`) and
`docs/architecture/MULTI-TENANT-DESIGN.md`. Treat it as an example, not as this skill's authority.
