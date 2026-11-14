# Custom hostname lifecycle

Verified 2026-11-13/14 against [Getting started](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/),
[Common API calls](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/common-api-calls/),
[Validation status](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/validation-status/),
[Backoff schedule](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/backoff-schedule/),
[Remove custom hostnames](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/remove-custom-hostnames/),
[Troubleshooting](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/reference/troubleshooting/).

## Order that works

| # | Who | Step |
|---|---|---|
| 1 | app | Claim: normalise the host (lowercase, strip port and trailing dot), refuse the zone name, your platform domain, a host another tenant owns, and anything over the tenant's cap. Save a local row `pending`. |
| 2 | app | **Create** `POST /zones/{zone}/custom_hostnames` `{ "hostname": "...", "ssl": { "method": "http", "type": "dv", "settings": { "min_tls_version": "1.2" } } }`. Leave `certificate_authority` empty (default CA; Cloudflare checks CAA first). The POST may omit `validation_records`: **GET again after a short delay**. Create **before** the customer saves a proxied CNAME, or their side shows Error 1014 ([o2o](o2o.md)). |
| 3 | customer | Point DNS: `CNAME shop → cname.platform.cc` (root: [root-domains](root-domains.md)). |
| 4 | Cloudflare | Validates: 75 retries over 7 days (first ten within about 20 min, then at most 4 h apart). What happens next is documented inconsistently (Backoff page: deleted; Validation status page: Moved, then Deleted after 7 more days) — inspect the API state and delete abandoned hostnames yourself. |
| 5 | app | "Check again" button: a `PATCH` with the same `ssl` method and type restarts validation. |
| 6 | app | Poll `GET /zones/{zone}/custom_hostnames/{id}` (or SSL for SaaS webhook notifications). |
| 7 | app | **Activate routing** (policy) only when `status == "active"` and `ssl.status == "active"` and DNS points at your target: local row active, cache version bumped. |
| 8 | app | **Probe**: an HTTPS request to the host returns this tenant's marker. Only then promote it to primary (canonical URLs, sitemap, ad event source URLs). A failed probe keeps the old primary. |
| 9 | app | **Delete** when the tenant removes it, churns, or it stays pending/failed 7 days: `DELETE` also removes its certificates and stops billing. |

Never rely on "the customer repointed DNS": the hostname goes **Moved**, is deleted after 7 days,
and while it exists a customer on Cloudflare can still route to you. Always delete.

## Statuses

`Pending`, `Active`, `Active re-deploying`, `Blocked`, `Moved`, `Deleted` (dashboard labels;
check the API's spelling). **Blocked is terminal and does not retry**: for a held zone the customer
releases the zone hold (also the "Also prevent subdomains" option), then you select Refresh or send
the `PATCH`; for abuse-related blocking, Enterprise customers contact their account team,
otherwise follow Cloudflare's `abusereply@cloudflare.com` instructions.

## Two validations, not one

- **Hostname validation** (`ownership_verification*`) → `status`. Real-time (customer adds the
  CNAME; a short gap) or pre-validation (TXT/HTTP token first; no gap; **not available for O2O**).
- **Certificate DCV** (`ssl.validation_records`) → `ssl.status`. `http` (automatic once the host
  points at you and is proxied — least effort), `txt`, or `email`. 90-day certificates, eligible
  for renewal 30 days before expiry.
- **Delegated DCV**: the hostname must use certificate method `txt`; copy the zone's DCV
  delegation hostname from the dashboard; the customer keeps
  `_acme-challenge.<host> CNAME <host>.<copied hostname>` in place; remove any conflicting
  `_acme-challenge` TXT records.

## Remedies the app should show

| Signal | Remedy |
|---|---|
| `verification_errors: custom hostname does not CNAME to this zone` | DNS not pointed yet, or pointed elsewhere; show the exact record |
| HTTP DCV unreachable (customer WAF, redirects, O2O rules) | `PATCH` `ssl.method = "txt"` and show the TXT record |
| CAA error in `ssl.validation_errors` | Switching method does not help; allow the CA in the CAA records (Cloudflare tries Google Trust Services, falls back to Let's Encrypt) or remove a restrictive CAA — check the customer's name and, if relevant, the target's |
| `Blocked`, zone hold | Customer releases the hold; then you Refresh / `PATCH` (no automatic retry) |
| Certificate rate limit | 15 per minute by default, counting successful submissions (POST 200); over it, issuance blocked 30 s — queue bulk onboarding |
