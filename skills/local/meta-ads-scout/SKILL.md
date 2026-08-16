---
name: meta-ads-scout
description: >-
  Mengeksekusi skrip Headless Browser Playwright untuk melakukan riset intelijen kompetitor di Meta Ads Library.
  Triggers: riset ads, facebook ads, meta ads library, cari iklan kompetitor, bedah copywriting fb ads, spy ads.
---

# Meta Ads Scout

Skill ini digunakan untuk mengekstrak data iklan kompetitor langsung dari Meta/Facebook Ads Library secara *stealth* (bypass anti-bot), dan menyajikannya sebagai intelijen bisnis kepada pengguna.

## Cara Menggunakan (Untuk AI Agent)

1. Jika pengguna meminta riset iklan kompetitor untuk suatu produk/kata kunci, **JANGAN** meminta izin API Token atau melakukan pencarian web biasa.
2. Langsung gunakan tool `bash` untuk mengeksekusi skrip ini:
   ```bash
   node ~/dotfiles/skills/local/meta-ads-scout/scout.js "<KEYWORD_PRODUK>" "ID"
   ```
3. Skrip akan mengembalikan `stdout` berformat **JSON**.
4. Baca data JSON tersebut secara internal.
5. Berikan laporan analitik kepada pengguna dengan format:
   - **Daftar Kompetitor Terdeteksi** (Sebutkan siapa saja yang menjalankan iklan).
   - **Winning Angles** (Analisis sudut pandang penawaran dari *raw_copywriting*).
   - **Rekomendasi Copywriting** (Buatkan 2-3 draft *copywriting* baru yang lebih baik untuk pengguna berdasarkan kelemahan/celah dari iklan kompetitor).

## Failsafe
Jika hasil JSON mengembalikan pesan error DOM atau hasil kosong, sampaikan kepada pengguna bahwa struktur Meta sedang mengalami *delay rendering*, dan cobalah bereksperimen dengan keyword yang lebih luas.