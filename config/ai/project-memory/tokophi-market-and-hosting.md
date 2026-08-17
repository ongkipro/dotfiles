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
- ⚠️ **RENCANA vs KENYATAAN — diukur 2026-08-05, jangan kutip rencananya sebagai fakta.** Rencana lama: "dev start Vultr <$20/bln (NVMe 2GB ~$12 / Regular 4GB $20)". **Yang benar-benar jalan: SATU instance `<coolify-vps>` (`volumdev`), plan `vhp-4c-8gb-amd`, Singapore, dibuat 2026-07-10, $48,00/bln** — 2,4× rencana. Sisa kredit **$262,54**, pending **$8,08** → runway **~5,5 bulan (~pertengahan Januari 2027)**, bukan hitungan hari. `vultr-cli` terpasang & `~/.vultr-cli.yaml` ADA (catatan lama "hilang" salah). Cek ulang dengan `vultr-cli instance list` + `vultr-cli account info` — **Vultr menampilkan kredit sebagai BALANCE negatif**. **Prod Hetzner nanti:** CCX AMD dedicated (mis. CCX23 4vCPU/16GB) SG.
- **Alternatif** (kalau prioritas berubah): **Hetzner Singapore** (value terbaik, jalur Coolify paling teruji; punya lokasi SG sejak Agt 2024 — koreksi kesalahan lama; GPU harus provider lain) · **BiznetGio Jakarta** (latency ID juara + IDR/PT + support Bahasa 24/7 + NEO GPU/Inference lokal; risiko CLI/Terraform belum terverifikasi — trial dulu). Hindari origin Eropa/US (~150-200ms ke Jakarta).

Detail di `~/projects/tokophi/specs/docs/PROD_PLAN.md`. Bagian dari [[tokophi-project]], terkait [[tokophi-domain-status]].

