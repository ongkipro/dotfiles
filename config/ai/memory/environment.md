# Memori: Environment — toolchain & install
> Bagian dari memori bersama. Perbarui kalau ada perubahan tool/setup.
> Mesin utama: Linux (Ubuntu). macOS 26 (Darwin arm64, MacBook Air M1 8GB) = device kedua.

## Tool terpasang macOS (JANGAN install ulang)
- mise (no-sudo): starship, direnv, lazygit, helix.
- Homebrew (system): gh, tmux, fzf, fd, bat, eza, zoxide, ripgrep, zsh-autosuggestions, zsh-syntax-highlighting.
- Editor: helix (`hx`). `EDITOR=hx`.
- npm -g (via nvm): pi.
- Browser: Google Chrome.
- Git + `~/.gitignore_global`.

## Tool Linux (mesin utama, referensi)
- mise: fzf, fd, bat, delta, lazygit, zoxide, eza, yq, ripgrep, ruff, starship, helix, tealdeer, direnv.
- npm -g: pi, 9router, pnpm, typescript-language-server, vscode-langservers-extracted, @tailwindcss/language-server, yaml-language-server, bash-language-server, pyright.
- pipx: python-lsp-server (pylsp).

## tmux (bagian wajib bootstrap dotfiles)
- Setup tmux full di-handle `bin/tmux-setup` (idempotent, cross-platform).
- Dipanggil otomatis dari `install.sh` dan `install-macos.sh`.
- Prefix `Ctrl+a`. Theme: Catppuccin-inspired palette (tanpa Nerd Font).
- Plugin: tmux-sensible, tmux-yank, resurrect, continuum, prefix-highlight, tmux-open.
- Clipboard via `bin/tmux-clip` (pbcopy di macOS, wl-copy/xclip di Linux).
- Battery indicator via `bin/tmux-battery`.
- Reload: `prefix+r`. Plugin: `prefix+I` (install), `prefix+U` (update).
- Session: `prefix+S` (save), `prefix+R` (restore).

## Cara install (kapan sudo)
- CLI / runtime → `mise use -g <nama>` (no sudo).
- Tool Node → `npm i -g <paket>`. App Python → `pipx install <paket>`.
- System tools macOS → `brew install <nama>`.
- `sudo` HANYA untuk file sistem (jarang dibutuhkan).

## pi.dev
- macOS: pi pakai provider `opencode-go`, default model `deepseek-v4-pro`. Settings di `~/.pi/agent/settings.json`.
- Linux: pi route lewat 9router lokal (`http://localhost:20128/v1`), provider `9router`.
- AGENTS.md di-load via symlink ke semua CLI. Memori bersama di `~/.config/ai/` (AGENTS.md + memory/*.md).
- Pi wrapper di shell rc auto-load AGENTS.md via `--append-system-prompt` flag.
- Claude account launcher: `claude` dan `claude-personal` → `akun personal`; `claude-kerja` → `akun kerja`.

## Folder structure
```
~/Projects/              ← source code (capital P)
~/Documents/work/        ← AI-generated output
  ├── prd/               ← planning & spec
  ├── research/          ← riset & analisis
  ├── content/           ← tulisan & copy
  └── notes/             ← draft & ide
~/dotfiles/              ← config & memory source of truth
```
