# Memori: Environment — toolchain & install
> Bagian dari memori bersama. Perbarui kalau ada perubahan tool/setup.

## Tool terpasang (JANGAN install ulang)
- mise (no-sudo): fzf, fd, bat, delta, lazygit, zoxide, eza, yq(v4), ripgrep, ruff, starship, helix, tealdeer, direnv.
- Editor: helix (`hx`) + LSP: typescript-language-server, vscode-langservers-extracted (html/css/json/eslint), @tailwindcss/language-server, yaml, bash, pyright + ruff (python), pylsp. `EDITOR=hx`.
- npm -g: claude-code, pi, codex, 9router, shopify CLI, wrangler, playwright, agent-browser, pnpm.
- Node via nvm (lazy-load). Git + delta pager + alias + `~/.gitignore_global`.

## Cara install (kapan sudo)
- CLI / bahasa → `mise use -g <nama>` (no sudo); update `mise up`; hapus `mise rm <nama>`.
- Tool Node → `npm i -g <paket>`. App Python → `pipx install <paket>`.
- Paket sistem/lib → `sudo apt install`. App GUI besar → `sudo snap install`. (sudo = admin, minta password.)

## pi.dev / 9router
- pi route lewat 9router lokal (`http://localhost:20128/v1`, jalan sebagai tray app).
- Default model bisa berganti — cek `~/.pi/agent/settings.json`, jangan asumsikan.
