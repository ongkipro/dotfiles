# Root domains (`customer.com`) without Enterprise

Verified 2026-11-14 against [Apex proxying](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/apex-proxying/)
(Jun 10, 2026), [CNAME flattening](https://developers.cloudflare.com/dns/cname-flattening/)
(Jun 24, 2026), [Set up CNAME flattening](https://developers.cloudflare.com/dns/cname-flattening/set-up-cname-flattening/)
and [Getting started](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/).

## What Cloudflare says

- Normal SaaS onboarding is a **CNAME** to your target. "Most DNS providers do not allow CNAME
  records at the zone's root", so customers usually end up on `shop.customer.com`.
- **Apex proxying** removes that limit by giving your account static IP prefixes the customer
  points an `A` record at — a **paid Enterprise add-on**. "By default, using an A record to point to
  the target is not a supported setup."
- The same page's footnote: Cloudflare offers root CNAMEs through **CNAME flattening**. On
  Cloudflare DNS, flattening at the apex is on by default for every plan.
- Flattening returns the target's IPs instead of the CNAME (so the CNAME itself is not visible in
  public DNS).

So a root domain works on Free–Business when the **customer's DNS can CNAME the root** — Cloudflare
DNS (flattening) or a provider with ALIAS/ANAME — and the custom hostname validates. External
ALIAS/ANAME providers are not covered by Cloudflare's docs: mark a provider supported only after a
recorded successful validation.

## Two branches to offer

| Branch | Hostnames you create | Customer DNS | Redirect |
|---|---|---|---|
| **Root primary** (default) | `customer.com` and `www.customer.com` | `@ CNAME → cname.platform.cc` (flattened) or `ALIAS/ANAME @`; `www CNAME → cname.platform.cc` | `www` → root, **only after both are active** |
| **`www` primary** (fallback) | `www.customer.com` only | `www CNAME → cname.platform.cc`; root stays at the customer's provider and redirects to `www` | root → `www` at the customer's side |

Policy: count the pair as **one customer domain** against your plan cap (Cloudflare still counts
two hostnames). Switching branches must reuse the existing `www` hostname, not fail as a duplicate.

## What the app can and cannot know

- A public DNS lookup of a flattened root returns A/AAAA answers. It **cannot prove** the record
  type, the target, or the provider's capability (and an unrelated Cloudflare-hosted site also
  resolves to Cloudflare IPs). Show lookups as progress hints only.
- Readiness = Cloudflare `status` and `ssl.status` active **plus** an HTTPS probe that the host
  serves this tenant ([hostname-lifecycle](hostname-lifecycle.md)).

## Indonesian registrars (field notes, verify per provider)

Many local panels (registrar DNS of common Indonesian hosts) accept no CNAME at `@` and offer only
HTTP URL forwarding (no certificate on `https://customer.com`). Guide in this order:

1. **Recommended:** move the domain's nameservers to free Cloudflare DNS, then `@ CNAME` (flattened)
   and `www CNAME` to the target. Step-by-step with screenshots per registrar.
2. If the customer must stay: `www` primary, and warn when the registrar's root forwarding has no
   HTTPS (in-app browsers from ads open `https://` first and show an error).
3. Before changing `@` or nameservers: keep `MX` and mail records exactly as they are.
4. If the customer's zone is on Cloudflare: [o2o](o2o.md) rules apply (create the hostname first,
   SSL/TLS mode Full or Full (strict)).
