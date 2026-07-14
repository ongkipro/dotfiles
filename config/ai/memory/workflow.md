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
- Shopify dev routing: **official Shopify AI Toolkit BELUM terpasang** di Claude (diverifikasi 2026-07-14 — marketplace yang ada cuma `claude-plugins-official`). Repo map ada di `~/dotfiles/docs/shopify-ai-development-repos.md`. Jangan clone repo pendukung Shopify (dawn/horizon/hydrogen/cli/liquid/theme-liquid-docs) sebagai skill duplikat; cukup reference link kecuali diminta inspect/base.

## Skills — plumbing (diverifikasi 2026-07-14)
- **Satu sumber**: `~/dotfiles/skills/local/`. Konsumen via SYMLINK: `~/.claude/skills` dan `~/.pi/agent/skills` (keduanya → `dotfiles/skills/local`), plus `~/.agents/local-skills`.
- ⚠️ **`~/.gemini/skills` TIDAK ADA** — Gemini CLI sudah dihapus (2026-07-13). Jangan jadikan target sync lagi. (`~/.gemini/` sendiri TETAP dipertahankan: berisi `GEMINI.md` → AGENTS.md, dibaca Antigravity.)
- `skill-*` scripts di `~/dotfiles/skills/agents-bin/`, di-link ke `~/.agents/bin/`.
- Di macOS: `skill-update` perlu bash 5+ (brew) dan BSD `find` compatibility (telah di-patch).
- SEO: pakai skill `seo-website-builder` (berdiri sendiri, punya `references/` lengkap). ⚠️ Korpus lama `~/Documents/seo-research-google/` dan `~/Documents/SEO/` **TIDAK ADA** — jangan dicari. Jangan klaim secret Google algorithm knowledge.
- **Toolkit docs (referensi, bukan skill)**: `~/dotfiles/ai-toolkits/{cloudflare-worker-toolkit,shopify-ai-toolkit}/`. ⚠️ Path lama `~/.ai/...` **TIDAK ADA** — jangan dipakai.

## Struktur Folder

### `~/Projects/` — Koding
Semua project development: web app, SaaS, Shopify, bot, dll. (Dibuat 2026-07-14 di `cuan`; sebelumnya konvensi ini ditulis di memory tapi foldernya tidak pernah ada.)

## Auto-Routing — AI CLI langsung tahu taruh di mana

**Tanpa diperintah**, AI harus auto-save ke folder ini:

| Output | Path |
|---|---|
| PRD, task breakdown, planning | `~/Documents/work/prd/` |
| Research, SEO, competitor analysis | `~/Documents/work/research/` |
| Copywriting, blog, ads, script | `~/Documents/work/content/` |
| Draft, ide, catatan bebas | `~/Documents/work/notes/` |
| Source code project | `~/Projects/<nama>/` |

**Nama file:** `YYYY-MM-DD - judul.md`

**Rule:** JANGAN taruh file di `~/Documents/` langsung. Selalu masuk subfolder `work/`. AI harus infokan path file di akhir respons.

```
~/Documents/
└── work/
    ├── prd/          ← planning & spec
    ├── research/     ← riset & analisis
    ├── content/      ← tulisan & copy
    └── notes/        ← draft & ide

~/Projects/              ← source code
~/.config/ai/memory/     ← memory AI (symlink → dotfiles/config/ai/memory)
```

> ⚠️ **Memory AI hanya ada di `~/.config/ai/memory/`.** Catatan lama menyebut `~/dotfiles/memori-ai/` (folder KOSONG) dan `~/Documents/memori ai/` (TIDAK ADA) — dua-duanya salah, jangan dipakai.
