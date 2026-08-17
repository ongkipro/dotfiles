---
name: toko-online-builder
description: "Rencana membangun template toko online untuk jasa (1 client = 1 toko = 1 admin), stack Astro + CF Pages (storefront) + Next.js + Vercel (admin) + Supabase. Diskusi awal 2026-06-28. Dokumentasi lengkap (PRD/arsitektur/schema/UML/ADR) di ~/Documents/Development/toko-online-builder per 2026-06-29; belum coding."
metadata: 
  node_type: memory
  type: project
  originSessionId: af118496-2521-425e-a47b-d86f78516085
---

# Toko Online Builder — Jasa Template

Membangun template toko online untuk dijual sebagai jasa ke client. Bukan SaaS publik — 1 client = 1 deploy terpisah.

## Konsep

- **Model**: Template → fork → deploy ulang per client (env vars beda)
- **Client**: Isi konten sendiri (produk, banner, blog) via admin panel
- **Developer (irwan)**: Onboarding client baru ~30 menit setelah template jadi
- **Target tampilan**: Sekelas Shopify themes premium

## Stack Final

```
Storefront  → Astro + Cloudflare Pages
Admin panel → Next.js + Vercel
Database    → Supabase (project terpisah per client)
Storage     → Supabase Storage (foto produk, banner, logo)
Auth        → Supabase Auth (1 user = si client)
Payment     → Fase 1: manual transfer | Fase 2: Midtrans webhook
```

## Domain Setup per Client

```
client.com        → Astro storefront (CF Pages)
admin.client.com  → Next.js admin panel (Vercel)
```

## Yang Bisa Diubah Client Sendiri

- Banner homepage (upload gambar)
- Logo + nama toko
- Produk: foto, harga, deskripsi, stok, kategori
- Blog/artikel (rich text editor)
- Warna tema (color picker)
- Info kontak, sosmed, nomor rekening

## Schema Supabase (inti)

```
store_config   → nama, logo, warna, kontak, sosmed, rekening bank
products       → nama, deskripsi, harga, stok, foto[], kategori, aktif
categories     → nama, slug
orders         → nama, hp, alamat, items[], total, status, bukti_tf
blog_posts     → judul, slug, konten, thumbnail, published_at
```

## Biaya

| Layanan | Status |
|---|---|
| Vercel | Free (hobby plan) |
| Cloudflare Pages | Free |
| Supabase | Free s/d 2 project; project ke-3+ $25/mo atau Pro $25/mo flat (unlimited) |
| VPS | **Tidak perlu** |

**Client 1 & 2 = 100% gratis.** VPS baru relevan kalau sudah banyak client → self-host Supabase di VPS $20/mo lebih hemat.

## UI/Tampilan

Target: sekelas Shopify premium themes (Dawn, Prestige).
Stack UI: Astro + Tailwind CSS + komponen custom.

Komponen kunci:
- Hero banner slider (Swiper.js / Embla)
- Product grid + filter
- Cart drawer (Alpine.js / Svelte island)
- Sticky header + mobile nav
- Skeleton loading
- Product foto zoom

Keunggulan vs Shopify:
- Tidak ada branding Shopify
- Tidak bayar per transaksi (Shopify 0.5–2%)
- Custom checkout lokal (transfer bank dll)
- Bebas modifikasi penuh

## Payment Roadmap

**Fase 1**: Manual transfer → client order → lihat nomor rekening → transfer → admin konfirmasi di panel → status "paid"

**Fase 2**: Midtrans → tambah API route di Next.js → webhook update order otomatis (tidak ubah arsitektur)

## Alur Onboarding Client Baru

```
1. Fork repo storefront + admin
2. Buat Supabase project baru → copy URL + keys
3. Set env vars → push → auto deploy
4. Arahkan domain client → CF Pages + Vercel
5. Client login admin, isi konten sendiri
```

## Dokumentasi (2026-06-29)

Spesifikasi lengkap ditulis di `~/Documents/Development/toko-online-builder` (git, 22 file MD):
PRD, persona, mvp-scope, roadmap, arsitektur (+strategi update template monorepo), tech-stack,
security, schema DB lengkap (SQL+RLS+RPC stok atomik), diagram (ERD/use-case/sequence/C4 mermaid),
api-spec, commerce-ID (payment+ongkir), storefront/admin spec, onboarding playbook, pricing-cost,
improvements-recommendations, ADR-001/002/003. Mulai baca dari `docs/product/prd.md`.
Keputusan kunci: isolasi fisik (1 Supabase project/client), monorepo Turborepo + redeploy matrix,
pembayaran bertahap (manual/QRIS/COD/WA dulu → Midtrans/Xendit Fase 2), uang disimpan integer Rupiah.

## Kode Monorepo (2026-06-29)

Scaffold kode di `~/projects/toko-online-builder` → GitHub **ongkipro/toko-online-builder-app** (private).
Turborepo+pnpm: `apps/storefront` (Astro+Tailwind, adapter node utk lokal, ganti @astrojs/cloudflare di prod),
`apps/admin` (Next.js 15 App Router+Tailwind), `packages/db` (tipe+Zod+Supabase client+queries, **mode demo**
pakai data dummy bila env kosong), `packages/ui` (formatRupiah/waLink/slugify), `packages/config` (token tema,
status order). Storefront `/api/order` panggil RPC `create_order`. **Build kedua app + smoke test lolos**
(homepage+produk render, JSON-LD SEO, error API rapi Bahasa Indonesia). SQL migration ada di repo SPECS
(`~/Documents/Development/toko-online-builder/supabase/`), bukan di repo kode.
2 repo terpisah: specs=`toko-online-builder`, kode=`toko-online-builder-app`.

## MVP Demo Selesai (2026-06-29)

MVP storefront+admin **lengkap & jalan di mode demo** (tanpa Supabase, pakai data dummy). Build kedua
app + smoke test runtime lolos (13 halaman 200, sitemap 14 URL, /api/shipping & /api/track OK).
Storefront: homepage, katalog+filter, detail produk (JSON-LD + ViewContent Pixel), keranjang
(drawer+halaman, localStorage vanilla JS), checkout (alamat+ongkir flat demo+bayar), **checkout WA**,
konfirmasi order, lacak, blog, statis (tentang/kontak/faq), sitemap.xml/robots.txt, /api/order(RPC).
Admin: dashboard, produk, pesanan (list+detail+ubah status placeholder), pengaturan, login placeholder.
63 file, push ke ongkipro/toko-online-builder-app.

### Admin UI/UX dirombak pakai shadcn (2026-06-29)
User pilih: fitur/flow beda → revisi PRD sebagian + UI baru; "aku desain, kamu implement".
Dibuat folder `ui-ux/{storefront,admin}/` (design-brief, references, wireframes, pages template) di repo kode.
**Admin panel dirombak total pakai shadcn/ui** (skill vercel:shadcn). Admin di-upgrade ke **Tailwind v4 +
Base UI (style base-nova)** — PENTING: komponen pakai prop `render` (bukan `asChild`); globals.css v4
(@theme inline + oklch); next-themes dark default; Geist font var `--font-geist-sans`. Storefront TETAP
Tailwind v3 (terpisah). Halaman admin (shadcn): dashboard (cards+tabel+stok), produk (tabel+dropdown),
pesanan (list+detail+ubah status), kategori, banner, blog, pengaturan (tabs), login. Sidebar collapsible +
mode toggle. Build+smoke test 9 halaman 200, screenshot OK (tampil premium). 102 file.

### RESET ke blank slate (2026-06-29)
User minta hapus SEMUA UI (admin+storefront) + shadcn + tema → mau kasih HTML lalu rebuild dari situ.
DIHAPUS: semua pages/components/layouts UI, shadcn (src/components/ui), next-themes/recharts/base-ui/sonner/
lucide (269 paket ke-prune), globals tema. DISIMPAN: packages/db,ui,config; storefront API
(/api/order,shipping,track) + sitemap/robots; supabase migrations; config build (next/astro/tailwind);
folder ui-ux/. Admin sekarang Tailwind v4 polos (globals = @import "tailwindcss"), Astro Tailwind v3 polos.
Tiap app cuma punya 1 placeholder page. Build kedua app hijau. 53 file tracked.
**ALUR BARU: user kasih HTML → aku konversi ke komponen, consume @toko/db (mode demo).**

### Sisa
- [ ] Rebuild UI dari HTML user (admin dulu, fokus admin)
- [ ] Konek Supabase: env, CRUD admin nyata + Auth, upload Storage, ongkir Biteship
- [ ] Midtrans (fase 2); adapter Astro → Cloudflare; deploy CF/Vercel

**Why:** Ini rencana jasa yang bisa menghasilkan recurring revenue per client tanpa server cost. Prioritaskan setelah project aktif selesai.
