---
name: jasawebsite-co-brand
description: "JASAWEBSITE.co by VOLUM — web agency brand, services, market, and PRD location"
metadata: 
  node_type: memory
  type: project
  originSessionId: 80e6e83a-b6e3-49c0-ae69-3f6d52f8c72f
---

**JASAWEBSITE.co** (studio/parent brand: **VOLUM**) — web agency milik user. Tagline positioning: *"Website cantik yang menjual"* (craft visual sekelas studio internasional + fokus konversi/ROI).

**Pasar:** Indonesia (primer) + Malaysia (cross-border). Bahasa: Indonesia profesional & mudah dipahami; istilah teknis tetap English (campaign, ads, landing page, funnel, ROAS, lead). Currency IDR/MYR. WhatsApp-first lead gen.

**7 Layanan:** (1) Website Toko Online, (2) Shopify Development ⭐, (3) Company Profile/Compro, (4) Website Sales (kompleks + profiling ala compro), (5) Custom Web, (6) Meta Ads, (7) Google Ads.

**Portfolio nyata:** PetCue.co (Shopify CRO theme, pet brand) — lihat [[sf-theme-shopify-store]] & [[petcue-dawn-rebuild]].

**Stack situs sendiri (FINAL, dipilih user):** **Cloudflare + Astro** — Astro + React islands (GSAP/Lenis) di Pages/Workers; DB **D1 (SQLite + Drizzle)**; storage **R2** (invoice/media); **KV** (cache/session); Turnstile (anti-spam); Resend/MailChannels (email); Sanity (CMS konten). Dipilih karena termurah + sesuai skill Cloudflare user + admin sederhana. Next.js/Vercel DITOLAK (overkill+mahal); Next.js tetap opsi utk proyek KLIEN web-app kompleks.

**Frontend publik:** animation-heavy ala Hello Monday. **Homepage = portfolio showcase-first** (pamer karya, bukan brosur layanan). **Mobile-first** (mayoritas pasar Android). SEO-friendly (Astro zero-JS).

**Admin panel (sederhana):** shadcn/ui + Tailwind + TypeScript (React) + Workers/D1/R2. Modul: Contact/Leads, Clients, Projects(progress), Invoices (PDF→R2), Settings. 2 role (admin/staff). BUKAN CRM berat/portal klien.

**Kode:** `~/Projects/jasawebsite` (git, commit awal 2026-07-08). Astro 5 + React islands + Tailwind v4 + GSAP/Lenis + adapter Cloudflare. Build hijau, migration D1 lokal applied. Sudah ada: 13 route publik, /api/contact, admin skeleton (login PBKDF2/HMAC, leads inbox, setup endpoint). TODO fase 2: shadcn penuh di admin (clients/projects/invoices), Sanity, Turnstile keys, D1/KV/R2 ID real di wrangler.toml, harga & konten real.

**PRD lengkap (v6.0, build-ready):** `~/Documents/work/prd/prd-jasawebsite-co-by-volum.md` — 35 bagian. Termasuk API contract, project structure + wrangler.toml + env vars, dev setup/build kickoff, pre-dev checklist, UML Mermaid. Stack Cloudflare+Astro, admin shadcn sederhana. Referensi kualitas Hello Monday. Sisa yang perlu input Owner: brand visual final, copywriting, harga real IDR, aset portfolio (di luar kode, bisa paralel).
