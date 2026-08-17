---
name: petanisejahtera-project
description: "Petani Sejahtera Astro+Cloudflare funnel site — article system, landing pages, products"
metadata: 
  node_type: memory
  type: project
  originSessionId: 19e16e71-ad2d-49dc-a2b2-4168f6f6118c
---

`~/projects/petanisejahtera` — situs media/funnel pertanian (Astro v6 + Cloudflare adapter, `npm run dev` → localhost:4321). Jual 4 produk: **Aussie** (sawit/Ganoderma), **Bensu** (jagung/cabai), **Saratoga** (padi), **Kojien** (nutrisi/tanah).

- Landing page publish (`src/pages/*.astro`): aussie-sawit-ganoderma, aussie-buah-landak, bensu-jagung, saratoga-padi — mayoritas sawit/Aussie.
- Artikel: data di `src/data/content.ts` (array `articleEntries`), render `src/pages/artikel/[slug].astro` (SSR, no getStaticPaths). **Terbaru = paling atas array** (index pakai `articleEntries[0]` sebagai featured). Kategori/tag/penulis halaman dinamis — kategori baru otomatis jalan.
- Mapping kategori→produk rekomendasi ada di `[slug].astro` (`categoryToProductSlug`); ditambah `Padi: 'saratoga'`. Penulis valid: **Somali** (sawit), **Somala** (jagung & cabai) — di `src/data/home.ts`.
- Gambar artikel: `public/images/articles/<slug>.webp`, **480×480 webp**. Generate via highsfield MCP `nano_banana_pro` (2 kredit/img, gaya foto dokumenter realistis Indonesia), download PNG lalu convert: `ffmpeg -i x.png -vf scale=480:480:flags=lanczos -c:v libwebp -quality 80 x.webp` (cwebp/imagemagick TIDAK terpasang, ffmpeg ada).
- 2026-06-29: tambah 10 artikel terbaru (6 sawit, 2 jagung, 1 padi, 1 cabai) + 10 gambar, tiap artikel ≥500 kata.
