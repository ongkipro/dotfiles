#!/usr/bin/env bash
# Tempatkan config dotfiles + patch shell rc. Idempotent (aman dijalankan ulang).
# Support: bash + zsh, Ubuntu + macOS.
set -euo pipefail
DOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Deteksi shell & rc file
SHELL_RC=""
if [ -n "${ZSH_VERSION:-}" ] || echo "$SHELL" | grep -q zsh; then
  SHELL_RC="$HOME/.zshrc"
elif [ -n "${BASH_VERSION:-}" ] || echo "$SHELL" | grep -q bash; then
  SHELL_RC="$HOME/.bashrc"
else
  SHELL_RC="$HOME/.bashrc"  # fallback
fi

echo "==> Shell terdeteksi: $SHELL_RC"

echo "==> Symlink config & memori (file asli di repo -> edit = repo, no drift)..."
mkdir -p ~/.config/helix ~/.local/bin ~/.agents
# link <src-di-repo> <tujuan-live>: backup file asli, lalu symlink ke repo
link() {
  local src="$1" dst="$2"
  mkdir -p "$(dirname "$dst")"
  if [ -e "$dst" ] && [ ! -L "$dst" ]; then cp -r "$dst" "$dst.bak.$(date +%s 2>/dev/null || echo old)" 2>/dev/null || true; fi
  rm -rf "$dst"; ln -s "$src" "$dst"; echo "   $dst -> $src"
}
link "$DOT/config/ai"                    ~/.config/ai          # memori bersama (+ memory/*.md)
link "$DOT/config/starship.toml"         ~/.config/starship.toml
link "$DOT/config/ripgreprc"             ~/.ripgreprc
link "$DOT/config/helix/languages.toml"  ~/.config/helix/languages.toml
link "$DOT/config/gitignore_global"      ~/.gitignore_global
link "$DOT/skills/local"                 ~/.agents/local-skills   # local skills (astro, shopify-listing)
link "$DOT/config/tmux.conf"             ~/.tmux.conf
link "$DOT/home/profile"                 ~/.profile
link "$DOT/config/codex-instructions.md" ~/.codex/instructions.md
link "$DOT/bin/ai-memory-link"           ~/.local/bin/ai-memory-link
link "$DOT/bin/dotpush"                  ~/.local/bin/dotpush
for s in akun claude-kerja claude-personal tmux-clip security-check; do link "$DOT/bin/$s" ~/.local/bin/$s; done
~/.local/bin/ai-memory-link              # symlink AGENTS.md ke semua AI CLI (claude/codex/pi/gemini/antigravity)

# Snapshot (reference, TIDAK di-symlink — mesin-spesifik / ditulis tool):
#   home/bashrc.snapshot, home/zshrc.snapshot, home/gitconfig, config/mise-config.toml, config/vscode-settings.json, skills/agents-bin/
#   -> di-refresh otomatis tiap 'dotpush'. Restore manual bila perlu di device baru.

echo "==> Patch $SHELL_RC (blok dev-tools)..."
MARKER=">>> dev-tools setup (ongkipro/dotfiles)"
if grep -qF "$MARKER" "$SHELL_RC" 2>/dev/null; then
  echo "   blok sudah ada -> dilewati"
else
  { echo ""; cat "$DOT/config/shell-tools.sh"; } >> "$SHELL_RC"
  echo "   blok ditambahkan ke $SHELL_RC"
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

  5) source "$SHELL_RC"   (atau buka terminal baru)

Runbook lengkap: docs/linux-dev-setup.md
EOF
