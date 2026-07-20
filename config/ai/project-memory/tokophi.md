---
name: tokophi
description: "TokoΦ commerce SaaS — repo di ~/Projects/tokophi, dokumentasi .md di-symlink ke ~/Documents/work/tokophi"
metadata: 
  node_type: memory
  type: project
  originSessionId: d80df881-dc15-46ed-8d1a-e20e2834efbf
---

TokoΦ (`ongkipro/tokophi`, private) — Shopify-style commerce SaaS untuk Indonesia. Monorepo: `apps/{admin,super-admin,storefront}`, `packages/{db,data,lib,ui,sections}`, `specs/`.

Nama lama proyek ini `indostore`; rebrand 2026-07-08. Repo `ongkipro/indostore` **masih ada di GitHub tapi dorman** — jangan dipakai, jangan di-push. Seluruh 94 commit-nya sudah termuat di history `tokophi` (HEAD lama `e95b71f`). Kalau baca catatan lama yang menyebut "Indostore", itu proyek yang sama, bukan proyek terpisah.

**Tidak ada clone di Mac ini** (diverifikasi 2026-07-20: `~/Projects/tokophi` tidak ada — catatan lama yang menyebut clone 2026-07-10 sudah usang; dev utama di Linux, `git pull` dulu bila di-clone lagi). 32 file `.md` yang di-track git dirancang untuk **di-symlink** (bukan disalin) ke `~/Documents/work/tokophi/` dengan struktur `prd/`, `architecture/`, `decisions/`, `ops/`, `notes/`, `agent-config/` saat repo hadir.

**Gotcha bisnis/ops yang TIDAK terbaca dari kode** (dipindah dari `projects.md` 2026-07-20):
- Integrasi **KiriminAja** (shipping) + **AutoLaris** (payment VA/QRIS) — platform-managed & **white-label**: brand provider disembunyikan dari client, hanya super-admin yang lihat. COD ada.
- **`KIRIMINAJA_ENV` default `sandbox`** (`tdev.kiriminaja.com`) — env yang tak di-set diam-diam bicara ke sandbox; tarif nyata tapi bukan produksi. Ini langkah terakhir sebelum uang sungguhan.
- **E-wallet (OVO/GoPay/DANA/ShopeePay/LinkAja) + retail MATI karena AutoLaris menolaknya** (`rc=07` di probe langsung), bukan bug. Hanya 6 kanal hidup: QRIS + 5 VA (BCA/Mandiri/BNI/BRI/Permata). Menyalakannya = pembeli pilih metode tak-tertagih → jualan mati di langkah akhir; mengaktifkan = urusan ke AutoLaris, bukan kode.
- **`npm run audit:responsive -w @tokophi/storefront`** = gerbang responsif (10 rute × 11 lebar 320→1920). Jalankan sebelum klaim "responsif".
- **Multi-agen satu worktree = kerja hilang** (pernah hilang 2×). Baca `AGENTS.md` repo sebelum coding: jangan `pkill astro/next` (membunuh server agen lain), jangan `git add -A` (pakai pathspec eksplisit), commit sesering mungkin.

**Why:** file .md itu bagian dari repo — memindahkannya keluar akan merusak repo. Symlink bikin `~/Documents` rapi tanpa duplikat yang bisa basi.

**How to apply:** edit lewat path mana pun sama saja — keduanya file yang sama. Jangan "rapikan" `~/Documents/work/tokophi` dengan menghapus/menimpa; itu menyentuh file repo. Kalau `.md` baru ditambahkan di repo, symlink-nya perlu dibuat manual.

Pengembangan utamanya di mesin lain (Linux) — `git pull` dulu sebelum kerja di Mac. Status per 2026-07-14 (repo WORKLOG): RBAC+RLS jalan, storefront multi-tenant SSR baca DB, COD live end-to-end, dan **keempat surface tayang di `tokophi.com`** (Cloudflare HTTPS) di atas server Vultr Singapore + Coolify (Docker Compose, backup harian). Ini masih infra DEV — **PROD nanti migrasi ke Hetzner Singapore**. Lihat juga [[kamus-almanak]].
