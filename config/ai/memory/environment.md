# Memori: Environment — toolchain & install
> Bagian dari memori bersama. Perbarui kalau ada perubahan tool/setup.
> Mesin: macOS 26 (Darwin arm64), MacBook Air M1 8GB.

## Tool terpasang (JANGAN install ulang)
- mise (no-sudo): fzf, fd, bat, delta, lazygit, zoxide, eza, yq(v4), ripgrep, ruff, starship, helix, tealdeer, direnv, qsv.
- Editor: helix (`hx`). `EDITOR=hx`.
- npm -g: pi, 9router, pnpm, typescript-language-server, vscode-langservers-extracted, @tailwindcss/language-server, yaml-language-server, bash-language-server, pyright.
- pipx: python-lsp-server (pylsp).
- Homebrew (system): gh, tmux, pnpm, chromium, pipx.
- Browser: Chromium (`brew install chromium`), Google Chrome.
- Git + delta diff pager + `~/.gitignore_global`.

## tmux (bagian wajib bootstrap dotfiles)
- Setup tmux full di-handle `bin/tmux-setup` (idempotent, cross-platform): install binary (apt/dnf/pacman/zypper di Linux, brew di macOS) + clipboard tool (wl-clipboard/xclip di Linux; pbcopy bawaan macOS) + link `~/.tmux.conf`, `~/.local/bin/tmux-clip`, dan `~/.local/bin/tmux-battery` + clone TPM + install/clean plugin.
- Dipanggil otomatis dari `install.sh` dan `install-macos.sh`. Bisa juga dijalankan manual: `tmux-setup`.
- Prefix `Ctrl+a`. Theme: plain-font friendly Catppuccin-inspired palette (tanpa ketergantungan Nerd Font). Plugin: tmux-sensible, tmux-yank, resurrect, continuum, prefix-highlight, tmux-open. Clipboard via `bin/tmux-clip`, battery/status helper via `bin/tmux-battery`. Reload: prefix+r. Update plugin: prefix+U / install plugin baru: prefix+I. Save session: prefix+S. Restore: prefix+R.

## Cara install (kapan sudo)
- CLI / runtime → `mise use -g <nama>` (no sudo); update `mise up`; hapus `mise rm <nama>`.
- Tool Node → `npm i -g <paket>`. App Python → `pipx install <paket>`.
- System tools → `brew install <nama>`. GUI apps → `brew install --cask <nama>`.
- `sudo` HANYA untuk file sistem (jarang dibutuhkan di macOS).

## pi.dev / 9router
- pi route lewat 9router lokal (`http://localhost:20128/v1`), jalan sebagai **launchd agent** `com.9router.autostart` (auto-start on login), bind local-only `127.0.0.1`, port 20128.
- pi pakai provider `9router` (internal ID: rbq97ts); default model `ocg/deepseek-v4-pro`. Cek `~/.pi/agent/settings.json` (symlink → dotfiles).
- AGENTS.md di-load via symlink ke semua CLI. Memori bersama di `~/.config/ai/` (AGENTS.md + memory/*.md). Memori AI system di `~/dotfiles/memori-ai/`.
- 9router terinstall via npm global; launchd plist di `~/Library/LaunchAgents/com.9router.autostart.plist`.
- Claude account launcher: `claude` dan `claude-personal` default ke personal account via `akun personal`; `claude-kerja` pakai isolated `~/.claude-accounts/kerja`. Wrappers di `~/dotfiles/bin/` symlinked ke `~/.local/bin/`.

## Isolasi 9router (policy: 9router HANYA untuk pi.dev)
- 9router (localhost:20128, MITM + cloudflare tunnel) khusus dipakai pi.dev via `~/.pi/agent/models.json`.
- codex DILEPAS dari 9router (29 Jun 2026): `model_provider`/blok `[model_providers.9router]` di `~/.codex/config.toml` di-comment; codex balik ke OpenAI native (punya OPENAI_API_KEY + login ChatGPT di ~/.codex/auth.json). Uncomment utk pulihkan.
- Claude Code TIDAK boleh lewat 9router: jalankan `claude` biasa (jangan via launcher/menu 9router yg menyuntik proxy+CA per-proses). Tak ada env/proxy global — kebocoran hanya jika diluncurkan lewat 9router. Model `cc/claude-*` yg muncul di selector = MITM 9router & tak punya rute upstream (error "may not exist").
- gemini sudah bersih (tak pernah nunjuk 9router).
- Pi global extension `~/.pi/agent/extensions/welcome-screen.ts` customises the TUI header with a Garuda welcome screen; use `theme.fg(color, text)` (not curried) when editing pi TUI themes/extensions.
