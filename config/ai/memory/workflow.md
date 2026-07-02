# Memori: Workflow & konvensi
> Bagian dari memori bersama.

- Terminal-first: edit `hx`, git `lg` (lazygit), multiplex `tmux`, AI claude/pi/codex.
- Preview web: jalankan dev server (`npm run dev` / `shopify theme dev` / `wrangler dev`) lalu buka Chromium ke `localhost:<port>` (auto live-reload).
- Pakai tool modern: `rg` (bukan grep), `fd` (bukan find), `eza` (bukan ls), `bat` (bukan cat), `z` zoxide (bukan cd manual).
- Git: commit cepat lewat lazygit; backup = push ke remote; JANGAN auto-commit (anti-pattern).
- Dotfiles sync: saat ada update di GitHub (`ongkipro/dotfiles`), pull dan deploy ke lokal (terutama memory `~/.config/ai/memory/`). Sebaliknya, saat ada perubahan lokal di `~/dotfiles` yang perlu disimpan, commit + push ke GitHub. Pastikan presisi — jangan rusak pola yang ada.
- `dotpush ["pesan"]` = jalur push standar: aktifkan driver → refresh snapshot mesin → security-check → commit → **fetch+merge remote dulu (anti-divergen)** → push. Konflik non-snapshot → berhenti minta resolusi manual. `dotsync` = varian granular (status/commit/push/pull/sync/doctor).
- File snapshot mesin-spesifik (`home/gitconfig`, `home/bashrc.snapshot`, `home/zshrc.snapshot`, `config/mise-config.toml`, `config/vscode-settings.json`) ditandai `merge=ours` di `.gitattributes` → saat sync selalu pertahankan versi mesin lokal (butuh `git config merge.ours.driver true`, di-set otomatis oleh dotpush + install scripts).
- VSCode opsional, bukan keharusan — jangan disarankan kecuali diminta.
- Shopify dev routing: official Shopify AI Toolkit/plugin tersedia di Claude (`~/.claude/plugins/marketplaces/shopify-ai-toolkit`, v1.4.1) dan Codex cache. Local router skill `shopify-ai-toolkit-router` ter-link di semua CLI via `skill-update` dan menunjuk ke repo map `~/Documents/shopify-ai-development-repos.md` (symlink → `~/dotfiles/docs/`). Jangan clone repo pendukung Shopify (dawn/horizon/hydrogen/cli/liquid/theme-liquid-docs) sebagai skill duplikat; cukup reference link kecuali diminta inspect/base.

## ai-terminal-project-runner
- Meta-skill development di `~/dotfiles/skills/local/ai-terminal-project-runner`, ter-sync ke semua CLI via `skill-update`. Routes development workflows, enforces safety gates, reads memory, includes `scripts/inspect_project.sh`.
- `skill-*` scripts tersimpan di `~/dotfiles/skills/agents-bin/` dan di-link ke `~/.agents/bin/` + `~/.local/bin/` (PATH). Jalankan `skill-update` untuk sync semua skills (local + shared) ke semua CLI target: `~/.agents/skills`, `~/.claude/skills`, `~/.codex/skills`, `~/.gemini/skills`, `~/.pi/agent/skills`.
- Di macOS: `skill-update` perlu bash 5+ (brew) dan BSD `find` compatibility (telah di-patch).
- SEO research reference: `~/Documents/seo-research-google/`. Gunakan sebelum SEO tasks; jangan klaim secret Google algorithm knowledge.
- Pi settings.json loads skills dari: `~/.pi/agent/skills/` (skill-update), `~/.gemini/config/skills/`, `~/.pi/agent/vendor/Shopify-AI-Toolkit/skills/`.
- Toolkits reference: `~/.ai/cloudflare-worker-toolkit/` dan `~/.ai/shopify-ai-toolkit/` (symlink → `~/dotfiles/ai-toolkits/`).

## Struktur Folder — Konvensi Baru

### `~/Projects/` — Semua Project Development
- **Web app, SaaS, Shopify, Astro, Next.js, Cloudflare Workers, bot, dsb.**
- Setiap project punya folder sendiri: `~/Projects/<nama-project>/`
- Di dalamnya: source code, config, package.json, .git, node_modules.
- Project aktif = di-root `~/Projects/`. Project archived/tidak aktif = hapus atau pindah ke storage external.

### `~/Documents/` — Dokumentasi & AI Artifacts
- **Hanya untuk file dokumentasi**: PRD, UML, markdown, research, konten, scrape.
- **Tidak untuk source code project.**
- Struktur:
  - `ai-artifacts/` — Output AI (PRD, UML, content, research, scrapes, general)
    - `prd/` — PRD & task breakdown
    - `uml/` — Flowchart, Mermaid, diagram
    - `scrapes/` — Scraped markdown/HTML
    - `content/` — Copywriting, blog, ads
    - `research/` — Market/SEO/competitor research
    - `general/` — Draft, ideation
  - `memori ai/` — AI memory system (session, dashboard, changelog)
  - `shopify-ai-development-repos.md` — Symlink ke dotfiles
- **Konvensi Penamaan**: `[YYYY-MM-DD]-[kategori]-[nama-topik].md` (contoh: `2026-07-02-prd-dropship-tracker.md`)

## AI Artifacts Routing (Workspace Global)
- Untuk dokumen/output AI yang dibuat **di luar direktori project aktif** (seperti draft PRD, UML/Mermaid diagram, tulisan konten, hasil scrape web, dll.), wajib ditaruh di folder workspace terstruktur:
  - **Base Path**: `~/Documents/ai-artifacts/`
  - **Sub-folders**: `prd/` `uml/` `scrapes/` `content/` `research/` `general/`
  - **Konvensi Penamaan**: `[YYYY-MM-DD]-[kategori]-[nama-topik].md` (contoh: `2026-07-02-prd-dropship-tracker.md`).
- Untuk source code / project development: SELALU di `~/Projects/<nama-project>/`.
- Selalu infokan ke user path file yang disimpan pada respon akhir.
- Mulai 2 Juli 2026: folder bersih, project baru semua masuk `~/Projects/`, dokumen masuk `~/Documents/`.
