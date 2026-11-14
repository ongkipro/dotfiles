---
name: tokophi-market-and-hosting
description: "TokoΦ — market prioritas (ID sekarang; MY/SG masa depan) + keputusan edge/hosting (CF + Traefik, skip HAProxy, VPS Singapura, hindari Hetzner)"
metadata: 
  node_type: memory
  type: project
  originSessionId: a3473a68-f7cb-4f46-aa14-c07821480525
---

**Market (CATATAN arah, bukan development sekarang):** prioritas **SEKARANG = Indonesia saja** (ready-to-ID). **Malaysia + Singapore = masa depan**, bukan backlog aktif. Multi-currency (IDR → +MYR/SGD) + i18n **ditunda** sampai ekspansi — jangan dikerjakan dulu.

**Edge vs origin-LB — Cloudflare vs HAProxy = beda layer, bukan "vs":**
- **Edge = Cloudflare** (sudah diputuskan). Cocok ID/MY/SG: PoP di Jakarta/Singapore/KL → TLS/cache/WAF/DDoS/R2/Images dekat user.
- **Origin proxy = Traefik/Caddy bawaan Coolify** (route ke container + TLS Let's Encrypt) → sudah mengerjakan tugas HAProxy.
- **SKIP HAProxy** sampai benar-benar multi-origin, atau perlu LB di depan Postgres/PgBouncer (fase lanjut).

**Server/VPS — RENCANA 2-FASE (final):** **DEV = Vultr Singapore** (pakai kredit) → **PROD = Hetzner Singapore** (value terbaik, latency SG identik ~20-30ms). Vultr **TAK punya Jakarta** (Asia: Tokyo/Osaka/Seoul/Singapore/Mumbai/Delhi/Bangalore; koreksi kesalahan lama). Keduanya region SG.
- **Migrasi Vultr→Hetzner murah** (semua host-agnostic: app=git/Coolify, DB=pg_dump+migrasi Drizzle, env=.env.example, edge=Cloudflare ganti IP origin). **3 aturan:** jangan pakai layanan vendor-lock (Vultr Managed DB/Object Storage/LB) — self-host Postgres di Coolify + media ke R2; Coolify di kedua host; backup rutin→R2 + tes restore sebelum pindah.
- **AI/GPU:** prod Hetzner SG tak ada GPU → fitur AI pakai GPU instance terpisah (Vultr GPU/BiznetGio NEO/dll), normal (GPU decoupled dari web-origin).
- **Heads-up:** daftar akun Hetzner lebih awal (verifikasi identitas kadang ketat).
- **Kenyataan (bukan rencana):** sejak 2026-11-01 produksi TokoΦ jalan di host Vultr khusus (akun `dotfiles-a1`), bukan `volumdev` (pensiun 2026-10-28). Plan, harga dan sisa kredit: `~/.config/ai-local/fleet-inventory.md`; ukur ulang di akun sebelum mengutip angka biaya.
- **Alternatif** (kalau prioritas berubah): **Hetzner Singapore** (value terbaik, jalur Coolify paling teruji; punya lokasi SG sejak Agt 2024 — koreksi kesalahan lama; GPU harus provider lain) · **BiznetGio Jakarta** (latency ID juara + IDR/PT + support Bahasa 24/7 + NEO GPU/Inference lokal; risiko CLI/Terraform belum terverifikasi — trial dulu). Hindari origin Eropa/US (~150-200ms ke Jakarta).

Detail di `~/projects/tokophi/specs/docs/PROD_PLAN.md`. Bagian dari [[tokophi-project]], terkait [[tokophi-domain-status]].

