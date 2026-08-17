---
name: kiriminaja-docs-project
description: "~/Documents/kiriminaja (ongkipro/kiriminaja-documentation, PUBLIC) — reference docs KiriminAja shipping API ID; sister repo mengantar; pakai istilah \"capture\" bukan \"scrape\"; banner pixel-art SVG"
metadata: 
  node_type: memory
  type: project
  originSessionId: 794d2396-a1a0-4513-a72c-d3d6e3aa3c2c
---

Repo dokumentasi referensi API pengiriman **KiriminAja** (aggregator kurir Indonesia).

- GitHub: `ongkipro/kiriminaja-documentation` (**PUBLIC**), clone lokal `~/Documents/kiriminaja`.
- Isi: 34 halaman referensi / 10 seksi di `documents/`, `spec/openapi.yaml` (OpenAPI 3.1 placeholder), `examples/kiriminaja-client.ts` (TS client server-only), `scripts/smoke.sh`, mermaid arch/flow di README.
- Sejajar dengan repo saudara [[mengantar-docs-project]] (pola & positioning sama).
- **Terminologi**: sejak 2026-07-07 semua "scrape/scraper/scraped" di-reframe → "capture/captured" (README, AGENTS, SECURITY, CONTRIBUTING, CHANGELOG, 00-INDEX). About repo juga tidak lagi memuat kata "scraped". Jaga konsisten.
- Capture tooling **tidak** di-ship di repo (dulu ada perintah `/tmp/*.cjs` broken + path Chrome macOS — sudah dibuang; `documents/` = output kurasi).
- Banner: `assets/kiriminaja-banner.svg` = **pixel-art** (judul arcade "KIRIMINAJA" pixel-font + truk→paket→pin + strip 9 kurir), selaras estetika arcade ongki.pro. Digenerate via script Python pixel-map (di-render verifikasi pakai google-chrome headless).
- Base URL API: `tdev.kiriminaja.com` (sandbox); auth Bearer token; response punya field `status: true/false`.
