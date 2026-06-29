# Memori: Environment — toolchain & install
> Bagian dari memori bersama. Perbarui kalau ada perubahan tool/setup.

## Tool terpasang (JANGAN install ulang)
- mise (no-sudo): fzf, fd, bat, delta, lazygit, zoxide, eza, yq(v4), ripgrep, ruff, starship, helix, tealdeer, direnv.
- Editor: helix (`hx`). `EDITOR=hx`.
- npm -g: pi, 9router, pnpm. Node via system/mise.
- Homebrew (system): rg (ripgrep), gh (GitHub CLI), tmux, pnpm.
- Git + delta diff pager + `~/.gitignore_global`.

## Cara install (kapan sudo)
- CLI / runtime → `mise use -g <nama>` (no sudo); update `mise up`; hapus `mise rm <nama>`.
- Tool Node → `npm i -g <paket>`. App Python → `pipx install <paket>`.
- System tools → `brew install <nama>`. GUI apps → `brew install --cask <nama>`.
- `sudo` HANYA untuk file sistem (jarang dibutuhkan di macOS).

## pi.dev
- pi pakai provider rbq97ts (cek `~/.pi/agent/settings.json` untuk default model).
- AGENTS.md di-load via wrapper `pi()` di shell config.
- Memori bersama di `~/.config/ai/` (AGENTS.md + memory/*.md).

## 9router
- 9router terinstall via npm global (`~/.npm-global/bin/9router`).
