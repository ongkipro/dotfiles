# Plans and limits

Verified 2026-11-14 against [Plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/)
(page dated Aug 14, 2026) and [Quotas and billing](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/quotas-and-billing/)
(Jul 30, 2026). Re-check before quoting a number.

| | Free / Pro / Business | Enterprise |
|---|---|---|
| Custom hostnames included | 100 | custom |
| Price per additional hostname | $0.10 (Plans page; check the billing page for cadence) | custom |
| Max hostnames | 50,000 (API enforcement threshold, `hard_cap`) | unlimited (talk to sales above 50,000) |
| Custom origin per hostname | yes | yes |
| Custom analytics per hostname | yes | yes |
| Non-SNI support **for the SaaS zone** | Pro and Business only | yes |
| Apex proxying / BYOIP (A records to your IPs) | **no** | paid add-on |
| Custom metadata (`request.cf.hostMetadata`) | **no** | paid add-on |
| Wildcard custom hostnames, custom certificates, CSR, selectable CA, mTLS | no | yes |
| WAF for SaaS custom rulesets | zone-plan WAF only | yes |

Non-SNI support for the SaaS zone does not cover arbitrary custom hostnames: those require SNI
(Troubleshooting page).

Consequences on non-Enterprise plans:

- Tenant identity comes from your own hostname table, not `hostMetadata`.
- Root domains (`customer.com`) work only through a CNAME at the root, which the customer's DNS
  must flatten (Cloudflare DNS does it by default at the apex) or express as ALIAS/ANAME. See
  [root-domains](root-domains.md).
- Enable Cloudflare for SaaS on the zone (Custom Hostnames page); non-Enterprise needs a payment
  method on the account.

## Quotas and billing

- The quota is per zone or per account; it is a **soft** limit: creation continues with a billing
  warning in the create response. Non-Enterprise plans also have an API enforcement threshold
  (`hard_cap`) above which create requests are rejected.
- `GET /zones/{zone_id}/custom_hostnames/quota` returns `allocated`, `used`, `exceeded`
  (`used >= allocated`), `hard_cap`.
- **Every custom hostname counts until deleted, including pending ones** (Cloudflare). An
  open-signup platform needs a reaper for hostnames stuck pending or failed (policy: 7 days, the
  length of Cloudflare's validation retry window) and a per-tenant cap.
- Policy: your subscription limit may count root + `www` as **one customer domain**; they still
  consume **two** Cloudflare custom-hostname allocations.
