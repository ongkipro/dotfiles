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

Di Mac ini (2026-07-10) repo di-clone ke `~/Projects/tokophi`. 32 file `.md` yang di-track git **di-symlink** (bukan disalin) ke `~/Documents/work/tokophi/` dengan struktur `prd/`, `architecture/`, `decisions/`, `ops/`, `notes/`, `agent-config/`.

**Why:** file .md itu bagian dari repo — memindahkannya keluar akan merusak repo. Symlink bikin `~/Documents` rapi tanpa duplikat yang bisa basi.

**How to apply:** edit lewat path mana pun sama saja — keduanya file yang sama. Jangan "rapikan" `~/Documents/work/tokophi` dengan menghapus/menimpa; itu menyentuh file repo. Kalau `.md` baru ditambahkan di repo, symlink-nya perlu dibuat manual.

Pengembangan utamanya di mesin lain (Linux) — `git pull` dulu sebelum kerja di Mac. Status per 2026-07-10 (223 commit): RBAC+RLS jalan, storefront baca DB sungguhan, DEV ter-deploy di Vultr Singapore + Coolify (Docker Compose, backup harian). PROD nanti Hetzner Singapore. Lihat juga [[kamus-almanak]].
