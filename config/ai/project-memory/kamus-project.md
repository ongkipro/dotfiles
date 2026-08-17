---
name: kamus-project
description: "Personal almanac + knowledge-OS web — git markdown repo rendered to a dashboard, like dotfiles but with UI"
metadata: 
  node_type: memory
  type: project
  originSessionId: a0624ee2-6aa1-4449-a591-0605718594cb
---

**Kamus** (`~/projects/kamus`) — almanak + "kamus lengkap" pribadi ongkipro. Model: **git repo = sumber kebenaran, web = kaca pembesar**. File markdown lokal → `git push` manual (kayak dotfiles) → web Astro render otomatis. dotfiles berhenti di GitHub; Kamus lanjut jadi web UI/UX (dark-first, mobile PWA).

**Stack:** Astro 5 (Content Collections + skema Zod), pnpm, deploy Cloudflare Pages (static `dist/`). Web `noindex, nofollow` + **code gate server-side** di `functions/_middleware.js` (Cloudflare Pages Function): cek `SITE_CODE` env sebelum serve HTML, cookie HMAC 30 hari, fail-closed. Set `SITE_CODE`/`SITE_SECRET` di CF env (bukan di repo). Gate ini yang bikin aman taruh memori pribadi (identity/business) di web. Tes logika: `scratchpad/test-gate.mjs` (6/6 lulus).

**Struktur folder root** (AI terminal nyetor ke sini, aturan di `AGENTS.md`): `journal/YYYY-MM-DD.md`, `tasks/`, `projects/`, `memory/`, `skills/`, `sessions/`, `summaries/`. `src/` = web. Frontmatter divalidasi saat build (format salah = build gagal).

**Ingestion model:** user nulis task; AI terminal nyatat yang sudah dikerjakan + rapikan + commit. Kontrak seragam di `AGENTS.md` biar semua AI (Claude/pi/codex) setor konsisten.

**Desain "Almanak":** display Bricolage Grotesque + body Inter + JetBrains Mono (metadata); aksen kobalt (bukan terracotta), semantik vermilion=urgent/hijau=done/emas=streak; signature = masthead almanak (tanggal besar + "Hari ke-184/2026" day-of-year + streak dots). `[[wikilink]]` antar-memori via remark plugin → `/kamus/<slug>`.

**Status (2026-07-03):** Fase 0+1 SELESAI & **sudah di-push ke GitHub private `ongkipro/kamus`** (commit 6db1f8d, 116 file). Isi lengkap: 36 memori (semua auto-memory keimpor via scratchpad/import-mem.mjs; API key sk- di pi-9router-setup diredaksi di salinan web), 27 skill lokal, 15 project (+halaman detail), 2 sesi, 2 rangkuman, search global `/cari`, backlink. 89 halaman. **LIVE di Cloudflare Pages: https://kamus-7km.pages.dev** (project `kamus`, akun wrangler <cf-account-email>, account ID <cloudflare-account-id>). Deploy pertama via `wrangler pages deploy dist`. Gate diverifikasi live (401 tanpa kode, 302+cookie dgn kode, konten tak bocor). Secret CF: `SITE_SECRET`=acak, `SITE_CODE`=<6-digit PIN: see `~/.config/ai-local/project-credentials.md`> (PIN 6-digit; PENTING: ganti secret Pages HARUS diikuti redeploy `wrangler pages deploy dist` baru aktif, bukan cuma `secret put`). Custom domain **https://kamus.ongki.pro LIVE** (CNAME kamus→kamus-7km.pages.dev proxied, ditambah user; SSL Google Trust CN=kamus.ongki.pro; status active). Juga tetap di kamus-7km.pages.dev. GATE PIN 6-digit tanpa rate-limit + domain guessable = brute-forceable (belum ditangani). Auto-deploy github→CF via GitHub Actions (`.github/workflows/deploy.yml`, Node 22, workerd di-allowlist, wrangler v4): install+build CI hijau, **cuma nunggu user set repo secret `CLOUDFLARE_API_TOKEN`** (CLOUDFLARE_ACCOUNT_ID sudah diset via gh). Direct-Upload project type (bukan native Git integration). **Fase 3 (2026-07-04):** urgency engine LIVE (`src/lib/urgency.ts` skoring level+due+umur+status; home & tasks urut skor, tampil ◆skor). Rangkuman AI + Telegram = SCAFFOLD siap tapi butuh secret user: `scripts/summarize.mjs` (@anthropic-ai/sdk, model claude-opus-4-8, cron `.github/workflows/summarize.yml` mingguan, commit balik→deploy) butuh repo secret `ANTHROPIC_API_KEY`; `scripts/notify.mjs` (Telegram Bot API digest urgensi, cron `notify.yml` harian) butuh `TELEGRAM_BOT_TOKEN`+`TELEGRAM_CHAT_ID`. Berikutnya: Fase 4 auto-ingest transkrip sesi; admin panel (task idea). Terkait [[dev-toolchain-mise]], [[tokophi-project]].

**Build note:** pnpm 11 di mesin ini butuh `pnpm-workspace.yaml` dgn `onlyBuiltDependencies`/`allowBuilds` (esbuild, sharp) + `verifyDepsBeforeRun: false`; build via `./node_modules/.bin/astro build` kalau `pnpm build` kena pre-run check.
