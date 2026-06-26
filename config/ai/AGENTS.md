# Environment & Working Agreement — global context for ALL AI CLIs
> Dibaca oleh pi, codex, Claude Code, dll (via symlink). RINGKAS — ke-load tiap sesi.
> Detail lengkap: `~/Documents/linux-dev-setup.md` (perintah: `devdoc`). Skill bersama: `~/.agents/skills/`.

## Mesin & user
- Ubuntu 26.04, bash, **terminal-first**. User: fantastico (Indonesia — boleh balas Bahasa Indonesia).
- Prinsip: ringan, cepat, terminal-first. VSCode OPSIONAL (tidak wajib buat coding).

## Toolchain (SUDAH terpasang — jangan install ulang)
- CLI via **mise** (user-local, TANPA sudo): fzf, fd, bat, delta, lazygit, zoxide, eza, yq(v4), ripgrep, ruff, starship, helix, tealdeer, direnv.
- Editor: **helix (`hx`)** + LSP (ts/js/html/css/tailwind/yaml/bash/python via pyright+ruff). `EDITOR=hx`.
- Git: lazygit (`lg`), delta pager, alias lengkap, global gitignore. Node via nvm (lazy-load); pnpm.
- AI/dev CLI: claude-code, pi, codex, 9router, shopify CLI, wrangler, playwright, agent-browser.

## Aturan install (PENTING)
- Tool CLI / bahasa baru → `mise use -g <nama>` (TANPA sudo). Update semua: `mise up`.
- Tool Node → `npm i -g`. App Python → `pipx install`.
- `sudo` HANYA untuk paket sistem (apt/snap). Default: no-sudo.

## pi.dev / 9router
- pi route lewat 9router lokal (`http://localhost:20128/v1`, jalan sebagai tray app).
- Default model bisa berganti — cek `~/.pi/agent/settings.json` (jangan asumsikan).

## Konvensi kerja
- Pakai tool terminal-native: `rg` (bukan grep), `fd` (bukan find), `eza` (bukan ls), `bat` (bukan cat).
- JANGAN sarankan install ulang tool di atas. JANGAN dorong pakai VSCode.
- Dotfiles ter-backup: github.com/ongki5758/dotfiles (private). Update config → commit ke ~/dotfiles.
- Preview web: jalankan dev server di terminal, buka Chromium ke localhost.
