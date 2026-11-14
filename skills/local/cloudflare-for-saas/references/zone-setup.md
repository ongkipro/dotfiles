# SaaS zone setup with a Worker as the application

Verified 2026-11-14 against [Getting started](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/)
and [Workers as your fallback origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/)
(Nov 8, 2026).

```
visitor ─► shop.customer.com  (CNAME ► cname.platform.cc)
           └► SaaS zone platform.cc ─► Worker route */* ─► platform Worker
                                                         └► resolve tenant from Host ─► tenant data
```

## Steps (once per SaaS zone)

1. **Separate registrable domains.** Put tenant hostnames on their own zone (`platform.cc`) and the
   platform (marketing, signup, platform admin) on another (`platform.id`). Tenants' scripts then
   cannot set or read platform cookies.
2. **Enable Cloudflare for SaaS** on the tenant zone (dashboard → SSL/TLS → Custom Hostnames).
3. **Fallback origin, originless:** a proxied `AAAA fallback 100::` record; set it as the fallback
   origin; wait for status **Active**. "Active" only means Cloudflare will send traffic there.
4. **CNAME target** (optional, strongly recommended): proxied `CNAME cname → fallback.platform.cc`.
   Customers point here. Use a self-explanatory name (`cname.`, `customers.`); a wildcard
   (`*.customers.platform.cc`) is allowed if you want per-tenant targets.
5. **Own subdomains:** proxied `AAAA @ 100::` and `AAAA * 100::` so `<slug>.platform.cc` reaches the
   Worker. In a full DNS setup, Universal SSL covers the root and first-level subdomains only
   (`a.platform.cc`, not `a.b.platform.cc`).
6. **Worker route `*/*`** on the SaaS zone → the platform Worker. It catches custom hostnames and
   your own subdomains. Exclude hostnames with a more specific route set to **Worker: None**
   (e.g. `api.platform.cc/*`). With O2O, a specific route like `*.platform.cc/*` set to None also
   matches the CNAME *target* and bypasses the Worker → add `cname.platform.cc/*` → Worker
   explicitly ([o2o](o2o.md)).
7. A Worker route bypasses the per-hostname `custom_origin_server`: per-tenant routing is your
   Worker's job (read `Host`).
8. **API token for the app**: zone-scoped to the SaaS zone, the least permission the custom
   hostname create/get/edit/delete (and quota) endpoints accept — "SSL and Certificates Write"
   in our setup; confirm on the [API reference](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/create/)
   before relying on it. Never an account-wide token in the Worker.

## Location

Storage location hints are latency hints, not residency; data localization for SaaS (Regional
Services) is a separate, plan-gated product. See the `cloudflare` skill's
`references/apac-placement.md` for the per-product flags and regions, and
[Data localization for SaaS](https://developers.cloudflare.com/data-localization/how-to/cloudflare-for-saas/).
