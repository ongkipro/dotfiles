#!/usr/bin/env bash
# Tempatkan config dotfiles + patch ~/.bashrc. Idempotent (aman dijalankan ulang).
set -euo pipefail
DOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Menempatkan file config..."
mkdir -p ~/.config/helix
backup() { [ -f "$1" ] && cp "$1" "$1.bak.$(date +%s 2>/dev/null || echo old)" 2>/dev/null || true; }

backup ~/.config/starship.toml;        cp "$DOT/config/starship.toml"        ~/.config/starship.toml
backup ~/.ripgreprc;                   cp "$DOT/config/ripgreprc"            ~/.ripgreprc
backup ~/.config/helix/languages.toml; cp "$DOT/config/helix/languages.toml" ~/.config/helix/languages.toml
backup ~/.gitignore_global;            cp "$DOT/config/gitignore_global"     ~/.gitignore_global
echo "   starship.toml, .ripgreprc, helix/languages.toml, .gitignore_global -> terpasang"

# Memori bersama AI CLI (satu sumber -> symlink ke semua tool)
mkdir -p ~/.config/ai ~/.claude ~/.codex
[ -s ~/.claude/CLAUDE.md ] && [ ! -L ~/.claude/CLAUDE.md ] && cp ~/.claude/CLAUDE.md ~/.claude/CLAUDE.md.bak
cp -r "$DOT/config/ai/." ~/.config/ai/    # AGENTS.md + README.md + memory/*.md
ln -sf ~/.config/ai/AGENTS.md ~/AGENTS.md
ln -sf ~/.config/ai/AGENTS.md ~/.claude/CLAUDE.md
ln -sf ~/.config/ai/AGENTS.md ~/.codex/AGENTS.md
echo "   AGENTS.md (memori bersama) -> ~/AGENTS.md, ~/.claude/CLAUDE.md, ~/.codex/AGENTS.md"

echo "==> Patch ~/.bashrc (blok dev-tools)..."
if grep -qF ">>> dev-tools setup" ~/.bashrc 2>/dev/null; then
  echo "   blok sudah ada -> dilewati"
else
  { echo ""; cat "$DOT/config/bashrc.tools.sh"; } >> ~/.bashrc
  echo "   blok ditambahkan ke ~/.bashrc"
fi

cat <<'EOF'

==> Config terpasang. Langkah berikutnya (sekali, NO-SUDO):

  1) Install mise (kalau belum):
       curl -fsSL https://mise.run | sh

  2) Tool CLI:
       mise use -g fzf fd bat delta lazygit zoxide eza yq direnv starship helix ruff
       mise use -g "aqua:tealdeer-rs/tealdeer"

  3) Language server (autocomplete Helix):
       npm i -g typescript-language-server vscode-langservers-extracted \
                @tailwindcss/language-server yaml-language-server bash-language-server pyright
       pipx install python-lsp-server

  4) Git config: jalankan perintah di docs/linux-dev-setup.md (Bagian 2.6)

  5) source ~/.bashrc   (atau buka terminal baru)

Runbook lengkap: docs/linux-dev-setup.md
EOF
