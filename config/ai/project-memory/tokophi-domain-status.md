---
name: tokophi-domain-status
description: "TokoΦ domains: tokophi.com live since 2026-07-13 (landing/app/rich/toko); merchant storefronts on <slug>.tokophi.id"
metadata: 
  node_type: memory
  type: project
  originSessionId: a3473a68-f7cb-4f46-aa14-c07821480525
---

Live since 2026-07-13 behind Cloudflare: `tokophi.com`/`www` = landing, `app.` = Dashboard Seller, `rich.` = Super Admin, `toko.tokophi.com` = demo store. **Merchant storefronts are `<slug>.tokophi.id`**; `<slug>.tokophi.com` answers a permanent 308 → `.tokophi.id`, while the demo store is the reverse (`toko.tokophi.id` → `toko.tokophi.com`); both measured 2026-10-25 with HEAD requests. The admin's built-in-domain copy reads `STOREFRONT_BASE_DOMAIN` (default `tokophi.id`). Custom merchant domains: CNAME → Cloudflare for SaaS (`specs/docs/CUSTOM_DOMAIN.md`). Live state always lives in the repo's `STATUS.md`, not here. Part of [[tokophi-project]].
