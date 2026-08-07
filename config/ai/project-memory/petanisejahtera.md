---
name: petanisejahtera
description: "LP funnel ads COD (Astro/CF Workers, backend Scalev) — repo ongkipro/petanisejahtera, form middle/hybrid by geo"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2a9362bb-2f37-47c9-b5d4-459342e1cc01
  modified: 2026-07-21T12:54:00.000Z
---

E-dagang COD funnel-ads. Repo **`ongkipro/petanisejahtera`** (publik, dibuat 2026-07-17). Astro v6 SSR + adapter Cloudflare Workers, Tailwind v4, ikon Lucide. Order backend = **Scalev API**.

**Checkout & env (2026-07-18):** di-clone ke `~/Projects/petanisejahtera` (jadi sekarang Mac punya `volumform` **dan** ini). **Tidak ada `.env` di arsip secrets** `projects-env-2026-07-14/` — project dibuat setelah snapshot. Template: `.env.example` + `.dev.vars.example` (Scalev keys, FB Pixel/CAPI, GTM). Jalan lokal tanpa key = render OK, form order mati. `npm run dev` → :4321.

**Sumber kebenaran di dalam repo (jangan hafal, baca file):**
- `DEV_NOTES.md` = indeks pengembangan + changelog + cara nambah LP + konvensi gambar/warna/ikon. **Baca ini dulu** tiap mulai kerja.
- `GEOFORM_HYBRID_MIDDLE_ENV.md` = form **middle vs hybrid**, excluded province (filter area = ENV `PUBLIC_COD_DISABLED_PROVINCES`), urutan geo (CF→header→ipapi), tuas **ads→form** = query `?form=middle|hybrid`. Kode: `src/lib/form-mode.ts`.
- `META_GTM_TRACKING_FLOW.md`, `META_DUPLICATE_CONVERSION_NOTES.md` = tracking Meta/GTM + dedup.

**Pola LP funnel:** `src/pages/<slug>.astro`, `prerender=false`, produk dari `src/data/products.ts`, komponen bersama `GeoIpResolvedForm`/`MetaLandingTracker`/`StickyCTA`/`SocialProof` (POLA GLOBAL — jangan diubah per halaman). Gambar per-LP di `public/images/<slug>/` (webp).

**Status & Token Cleanliness (2026-08-07):** Class Tailwind invalid (`red-650`/`slate-450`/`red-350`) sudah dibersihkan total dari seluruh `src/` (0 matches). Fallback resolver form mode jika provinsi tidak diketahui adalah **`hybrid`** (`src/lib/form-mode.ts`). Typecheck `npm run check` 0 error, unit tests `npm run test` 25/25 passed, build Astro v6 SSR Cloudflare Workers sukses.

**Sesi 2026-07-18 s/d 2026-08-01:** dibuat LP `saratoga-anggrek` & `saratoga-anthurium`. Produk fisik sama (`productSlug="saratoga"`). Kebijakan SEO diseragamkan: semua LP `index, follow` & terdaftar di sitemap, kecuali `/404` & `/sitemap` yang `noindex`.
**Durable architecture:** product variants and prices are synchronized from Scalev and must be verified from the repository or provider instead of copied into memory. `BaseLayout.astro` owns the shared `BreadcrumbList` JSON-LD through its `breadcrumbs` property.
