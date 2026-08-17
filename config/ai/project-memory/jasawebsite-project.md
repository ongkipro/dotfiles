---
name: jasawebsite-project
description: "JASAWEBSITE.co — agency site + client portal + admin panel; Astro+CF, dua DB (D1 leads + Postgres portal), repo ongkipro/jasawebsite"
metadata: 
  node_type: memory
  type: project
  originSessionId: beb8a6e4-002a-4423-856e-7313cfb65bd0
---

**JASAWEBSITE.co by VOLUM** — ~/Projects/jasawebsite; **GitHub `ongkipro/jasawebsite` (PRIVATE)** sejak 2026-07-09. Astro 5 + Cloudflare Workers + React islands + GSAP + Lenis + Tailwind v4. Clone Hello Monday **clean-white monokrom minimalist**, Bahasa Indonesia. WhatsApp `6282136093430`.

**DB:** Postgres = sumber utama (client portal + admin panel + **leads form kontak sejak 2026-07-09**). Postgres dev = **docker `jws-pg` :5434** (BUKAN :5433 = itu tokophi-db). Schema pg di `src/db/pg-schema.ts` (client_user/project/invoice/admin_user/**lead**; migration `migrations/pg/0003_lead.sql`). D1 masih ada tapi **admin lama `/admin` (+`/api/admin/*`) kini YATIM** (form kontak tidak lagi tulis D1) — kandidat dihapus, tunggu konfirmasi user.

**Portal client:** `/daftar` `/masuk` `/dashboard` (client lihat progress project + invoice). **Admin panel:** `/panel` (login/register, butuh `ADMIN_INVITE_CODE=jws-admin-2026`; dev admin `admin@jasawebsite.co`/`admin12345`) → CRUD project & invoice tiap client (inline edit status/progress + hapus) + section **"Pesan masuk"** kelola lead (status baru/dihubungi/deal/arsip, Balas WA, hapus). Endpoint `/api/panel/{project,invoice,lead}/[id]` POST update/delete, admin-guarded. Auth PBKDF2+cookie HMAC role admin/client (`src/lib/auth.ts`).

**Gotcha yang mahal dipelajari:**
- File Postgres WAJIB impor operator dari `drizzle-orm/pg-core/expressions` (bukan `drizzle-orm`) → hindari bug dual-instance TS (pnpm bikin 2 instance drizzle: D1 vs postgres).
- Ikon lucide WAJIB per-icon `@lucide/astro/icons/nama` (BUKAN barrel `@lucide/astro`) → barrel = render 2.7s di dev (muat 1746 ikon).
- Nav: View Transitions + `transition:persist` di island SmoothScroll (Lenis tunggal) + reset scroll ke atas di `astro:after-swap`.

**Aset semua DUMMY (ganti sebelum launch):** fonts self-host `/public/fonts`, `hero.mp4` 554K+poster, portfolio `/public/works/*.webp` (dulu picsum), jurnal line-art `/public/stories/*.webp`, OG per-halaman `/public/og-*.png`. Konten/harga/testimoni karangan. Lihat [[no-ai-commit-trailer]] & [[git-identity-noreply]].
