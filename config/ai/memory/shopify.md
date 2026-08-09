# Shopify Development

- 🔴 **`shopify-listing` dan `shopify-memory` DINONAKTIFKAN 2026-08-10** atas permintaan user — Shopify sedang dorman, diaktifkan lagi pas butuh. Keduanya masih utuh di git. Cara balikin: `git -C ~/dotfiles revert <sha>` (atau `git checkout <sha>^ -- skills/local/shopify-listing skills/local/shopify-memory`) lalu `skill-update`. **Sebelum kerja katalog/listing Shopify, aktifkan dulu** — jangan bikin ulang skill-nya dari nol.
- **Prioritas skill untuk Shopify content/SEO** (dipindah dari `AGENTS.md`, 2026-07-20): `shopify-memory`, `shopify-listing` (keduanya dinonaktifkan — lihat di atas), `seo-website-builder`, `content`, `copywriting`. Verifikasi: `skill-list`.
- Repo map lengkap & actionable: **`~/dotfiles/docs/shopify-ai-development-repos.md`** (peta repo, fungsi, kapan dipakai, clone vs link). Path lama `~/Documents/shopify-ai-development-repos.md` TIDAK ADA.
- ⚠️ Skill `shopify-ai-toolkit-router` **SUDAH DIHAPUS (2026-07-14)** — isinya 100% pointer ke 10 skill yang tidak pernah ada. Untuk kerja dev Shopify, baca repo map di atas langsung.
- Theme dev: prefer `horizon`/`dawn` + `theme-tools` (theme-check) + `theme-liquid-docs`. App: CLI `@shopify/cli` + `shopify-app-template-remix` + `shopify-app-js`. Extension: `ui-extensions` + `function-examples`.
- Plugin AI resmi: `Shopify-AI-Toolkit` (= sumber MCP `shopify-dev`) + `liquid-skills`.
- JANGAN clone repo org Shopify kecuali benar-benar perlu inspect source / base dari template/theme — selebihnya cukup reference link.
