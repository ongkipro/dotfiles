---
name: toko-online-builder
description: "Rencana membangun template toko online untuk jasa (1 client = 1 toko = 1 admin), stack Astro + CF Pages (storefront) + Next.js + Vercel (admin) + Supabase. Diskusi awal 2026-06-28, belum diimplementasi."
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

## Next Steps (belum dimulai)

- [ ] Scaffold repo storefront (Astro template)
- [ ] Scaffold repo admin panel (Next.js template)
- [ ] Design system: warna, font, komponen dasar
- [ ] Schema Supabase + migration
- [ ] Komponen storefront: hero, product grid, cart, checkout
- [ ] Admin panel: auth, CRUD produk, upload foto, order management
- [ ] Integrasi Midtrans (fase 2)
- [ ] Dokumentasi onboarding untuk client baru

**Why:** Ini rencana jasa yang bisa menghasilkan recurring revenue per client tanpa server cost. Prioritaskan setelah project aktif selesai.
