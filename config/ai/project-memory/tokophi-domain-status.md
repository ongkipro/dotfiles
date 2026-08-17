---
name: tokophi-domain-status
description: "TokoΦ domain tokophi.com — sudah dibeli + di Cloudflare, DNS belum di-point (dev lokal dulu)"
metadata: 
  node_type: memory
  type: project
  originSessionId: a3473a68-f7cb-4f46-aa14-c07821480525
---

Domain **`tokophi.com` sudah dibeli + zona aktif di Cloudflare** (per 2026-07-09). Namespace dikuasai, tapi **DNS record belum di-point** — subdomain rencana `app.tokophi.com` (merchant admin), `rich.tokophi.com` (super-admin), `tokophi.com` (hub/landing) menunggu VPS ada dulu. **Keputusan: dev lokal dulu, deploy ditunda** (urutan PROD_PLAN: R2/images → storefront SSR → pooling → queue → baru Coolify deploy + point DNS = langkah ⑥).

Kode sudah **env-driven** (`PUBLIC_APP_URL`, `ADMIN_URL`, `PUBLIC_ONGKIR_API`, `PUBLIC_ORDER_API` — fallback localhost) → pindah ke domain cukup set env, tanpa ubah kode. Custom domain merchant nanti via CNAME → `cname.tokophi.com` + Cloudflare for SaaS. Detail di `~/projects/tokophi/specs/docs/PROD_PLAN.md` §5+§8. Bagian dari [[tokophi-project]].
