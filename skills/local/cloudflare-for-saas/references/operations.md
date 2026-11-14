# Operations

Verified 2026-11-13/14 against [Troubleshooting](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/reference/troubleshooting/),
[Hostname analytics](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/hostname-analytics/),
[Webhook definitions](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/webhook-definitions/),
[Error 1014](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1014/).

## Errors

| Error | Meaning | Fix |
|---|---|---|
| **1014** CNAME Cross-User Banned | a CNAME between zones of different Cloudflare accounts, without SaaS for that hostname | create the custom hostname first; then the customer's CNAME works |
| **1016** Origin DNS error | hostname not validated (`custom hostname does not CNAME to this zone`), fallback origin missing/not set, or a wildcard custom hostname loses to a standalone zone | check validation; fallback origin Active |
| **403** | a custom hostname equal to the zone name | never create it |
| **522** behind a Worker route | possible cause with an originless fallback: a more specific None route bypassed the Worker (e.g. the O2O target) | add the target route → Worker ([o2o](o2o.md)) |
| `ERR_TOO_MANY_REDIRECTS` on an O2O customer | possible cause: their SSL/TLS mode is Flexible and you redirect HTTP→HTTPS | Full or Full (strict) |
| `Blocked` hostname | zone hold, or abuse history | release the hold, then Refresh / `PATCH` (no automatic retry); abuse: account team or `abusereply@cloudflare.com` |

## Watch

- Quota: `GET /zones/{zone}/custom_hostnames/quota` (`used` vs `allocated`, `hard_cap`).
- Per-tenant analytics: filter by `clientRequestHTTPHost` (dashboard or GraphQL); Logpush filters.
- SSL for SaaS webhook notifications: validation succeeded/failed, certificate issued/renewed.
- Error rate: use Cloudflare's account-level analytics/notifications for the Worker (pick the
  notification type on the [Notifications](https://developers.cloudflare.com/notifications/)
  page); per-request logging alone does not give a reliable global rate.

## Jobs an open-signup platform needs

- Reaper: delete custom hostnames pending or failed for 7 days (billing).
- Purge sweep: tenants past their removal hold → delete hostnames, R2 prefix, KV prefix, data.
- Backup of the control plane, with a restore drill into a scratch database.
- Purge cache per hostname when a tenant's domain or content changes
  ([purge by hostname](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-hostname/)).
