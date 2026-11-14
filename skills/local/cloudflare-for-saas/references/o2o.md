# O2O — customers who are also on Cloudflare

Verified 2026-11-14 against [How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/)
(Jun 19, 2026), [Error 1014](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1014/)
(Sep 23, 2026), [Workers as fallback origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/),
[Hostname routing](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/hostname-routing/)
and [Flexible SSL](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/flexible/).

## When it applies

O2O ("orange to orange") happens when the customer's own Cloudflare zone, **in a different
account**, has a **proxied CNAME** to your target. It does not apply to A records (apex proxying)
or to zones in your own account.

Traffic passes the customer's zone first (their cache, WAF, redirects, rules), then yours. Your
zone sees `cf-connecting-o2o: 1`; there is no API field that says a hostname is O2O.

## Rules

- **Create the custom hostname before the customer saves the proxied CNAME.** A CNAME between zones
  in different Cloudflare accounts is refused with **Error 1014 (CNAME Cross-User Banned)** unless
  the target owner uses Cloudflare for SaaS for that hostname.
- **Real-time validation only**: hostname pre-validation is not available for O2O.
- **Route with `*/*`**: it is the only pattern that invokes your Worker for both proxied and
  DNS-only customer records (Cloudflare's recommendation). A more specific `*.platform.cc/*` set
  to None also matches the CNAME *target* and bypasses the Worker — with an originless fallback this
  can fail with **522**; add `cname.platform.cc/*` → Worker explicitly.
- **Customer SSL/TLS mode should be Full or Full (strict)** (guidance). Flexible makes their zone
  fetch yours over HTTP; an HTTP→HTTPS redirect on your side then loops
  (`ERR_TOO_MANY_REDIRECTS`). Put this in the onboarding guide.
- **"Works on my domain, not theirs"**: check the customer zone's cache rules, redirects and WAF.
  Send `Cache-Control: private, no-store` on personalised and admin responses; their rules still
  apply first.
- Test with a domain in a **second Cloudflare account**; your own account never shows O2O.
