# Memori: Environment — toolchain & install
> Bagian dari memori bersama. Perbarui kalau ada perubahan tool/setup.

## Tool terpasang (JANGAN install ulang)
- mise (no-sudo): fzf, fd, bat, delta, lazygit, zoxide, eza, yq(v4), ripgrep, ruff, starship, helix, tealdeer, direnv.
- Editor: helix (`hx`). `EDITOR=hx`.
- npm -g: pi, 9router, pnpm. Node via system/mise.
- Homebrew (system): rg (ripgrep), gh (GitHub CLI), tmux, pnpm.
- Git + delta diff pager + `~/.gitignore_global`.

## tmux (bagian wajib bootstrap dotfiles)
- Setup tmux full di-handle `bin/tmux-setup` (idempotent, cross-platform): install binary (apt/dnf/pacman/zypper di Linux, brew di macOS) + clipboard tool (wl-clipboard/xclip di Linux; pbcopy bawaan macOS) + link `~/.tmux.conf` & `~/.local/bin/tmux-clip` + clone TPM + install plugin.
- Dipanggil otomatis dari `install.sh` dan `install-macos.sh`. Bisa juga dijalankan manual: `tmux-setup`.
- Prefix `Ctrl+a`. Plugin: tmux-sensible, tmux-yank, resurrect, continuum, catppuccin (mocha). Clipboard via `bin/tmux-clip`. Reload: prefix+r. Update plugin: prefix+I.

## Cara install (kapan sudo)
- CLI / runtime → `mise use -g <nama>` (no sudo); update `mise up`; hapus `mise rm <nama>`.
- Tool Node → `npm i -g <paket>`. App Python → `pipx install <paket>`.
- System tools → `brew install <nama>`. GUI apps → `brew install --cask <nama>`.
- `sudo` HANYA untuk file sistem (jarang dibutuhkan di macOS).

## pi.dev / 9router
- pi route lewat 9router lokal (`http://localhost:20128/v1`), sekarang jalan sebagai **systemd user service** `9router.service` (auto-start + auto-restart), bind local-only `127.0.0.1`.
- pi pakai provider rbq97ts; default model bisa berganti — cek `~/.pi/agent/settings.json`, jangan asumsikan.
- AGENTS.md di-load via wrapper `pi()` di shell config. Memori bersama di `~/.config/ai/` (AGENTS.md + memory/*.md).
- 9router terinstall via npm global; restore helper ada di `~/dotfiles/bin/pi-9router-restore` untuk generate service dari path `node` + `9router` aktif di mesin.
- Claude account launcher: `claude` and `claude-personal` default to personal account via `akun personal`; `claude-kerja` uses isolated `~/.claude-accounts/kerja` for bang.joe90@gmail.com. Wrappers live in `~/dotfiles/bin/` symlinked to `~/.local/bin/`.

## Isolasi 9router (policy: 9router HANYA untuk pi.dev)
- 9router (localhost:20128, MITM + cloudflare tunnel) khusus dipakai pi.dev via `~/.pi/agent/models.json`.
- codex DILEPAS dari 9router (29 Jun 2026): `model_provider`/blok `[model_providers.9router]` di `~/.codex/config.toml` di-comment; codex balik ke OpenAI native (punya OPENAI_API_KEY + login ChatGPT di ~/.codex/auth.json). Uncomment utk pulihkan.
- Claude Code TIDAK boleh lewat 9router: jalankan `claude` biasa (jangan via launcher/menu 9router yg menyuntik proxy+CA per-proses). Tak ada env/proxy global — kebocoran hanya jika diluncurkan lewat 9router. Model `cc/claude-*` yg muncul di selector = MITM 9router & tak punya rute upstream (error "may not exist").
- gemini sudah bersih (tak pernah nunjuk 9router).
