#!/usr/bin/env bash
# Tempatkan config dotfiles + patch shell rc. Idempotent (aman dijalankan ulang).
# Support: bash + zsh, Ubuntu + macOS.
set -euo pipefail
DOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Aktifkan driver merge 'ours' utk file snapshot mesin (lihat .gitattributes) — anti-konflik lintas-mesin.
git -C "$DOT" config merge.ours.driver true 2>/dev/null || true

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
mkdir -p ~/.config/helix ~/.local/bin ~/.agents ~/.agents/bin
# link <src-di-repo> <tujuan-live>: backup file asli, lalu symlink ke repo
link() {
  local src="$1" dst="$2"
  local backup
  mkdir -p "$(dirname "$dst")"
  if [ -L "$dst" ]; then
    [ "$(readlink "$dst" 2>/dev/null)" = "$src" ] && { echo "   $dst -> $src (sudah benar)"; return 0; }
    unlink "$dst"
  elif [ -e "$dst" ]; then
    backup="$dst.bak.$(date +%Y%m%d-%H%M%S 2>/dev/null || echo old).$$"
    mv "$dst" "$backup"
    echo "   backup: $dst -> $backup"
  fi
  ln -s "$src" "$dst"
  echo "   $dst -> $src"
}
link "$DOT/config/ai"                    ~/.config/ai          # memori bersama (+ memory/*.md)
link "$DOT/config/starship.toml"         ~/.config/starship.toml
link "$DOT/config/ripgreprc"             ~/.ripgreprc
link "$DOT/config/helix/config.toml"     ~/.config/helix/config.toml
link "$DOT/config/helix/languages.toml"  ~/.config/helix/languages.toml
link "$DOT/config/gitignore_global"      ~/.gitignore_global
link "$DOT/skills/local"                 ~/.agents/local-skills   # local skills (astro, shopify-listing)
link "$DOT/config/tmux.conf"             ~/.tmux.conf
link "$DOT/config/mise-config.toml"      ~/.config/mise/config.toml  # toolchain bersama; `mise use -g` nulis tembus symlink
link "$DOT/config/lazygit/config.yml"    ~/.config/lazygit/config.yml
link "$DOT/config/gh/config.yml"         ~/.config/gh/config.yml     # hosts.yml TIDAK di-link (berisi oauth token)
for s in skill-help skill-list skill-new skill-open skill-check skill-remove skill-update; do link "$DOT/skills/agents-bin/$s" ~/.agents/bin/$s; done
link "$DOT/home/profile"                 ~/.profile
link "$DOT/bin/ai-memory-link"           ~/.local/bin/ai-memory-link
link "$DOT/bin/dotpush"                  ~/.local/bin/dotpush
link "$DOT/bin/dotsync"                  ~/.local/bin/dotsync
for s in tmux-clip tmux-setup security-check security-check-test skill-check-test inspect-project ai-doctor ai-memory-check vps-pgdump 9router-start pi-9router-restore device-register; do link "$DOT/bin/$s" ~/.local/bin/$s; done
link "$DOT/config/omp/config.yml"        ~/.omp/agent/config.yml   # OMP config (model, theme, approval)
link "$DOT/config/omp/models.yml"        ~/.omp/agent/models.yml   # OMP providers (9router)
~/.local/bin/ai-memory-link              # symlink AGENTS.md ke semua AI CLI (claude/codex/pi/agy/omp)
"$DOT/skills/agents-bin/skill-update"    # ~/.claude/skills + ~/.pi/agent/skills + ~/.omp/agent/skills -> dotfiles/skills/local (idempoten)

# Jaminan native binary claude ter-unduh. `npm i -g @anthropic-ai/claude-code` (step 3)
# menaruh native binary via optional-dep/postinstall yang KADANG gagal senyap → `claude`
# error "native binary not installed". Kalau launch gagal, jalankan ulang postinstall-nya.
if command -v claude >/dev/null 2>&1 && ! claude --version >/dev/null 2>&1; then
  echo "==> claude native binary hilang — menjalankan postinstall..."
  node "$(npm root -g)/@anthropic-ai/claude-code/install.cjs" \
    && echo "   claude native binary ✓ diperbaiki" \
    || echo "   ⚠️  postinstall gagal — perbaiki manual: npm i -g @anthropic-ai/claude-code"
fi

echo "==> Daftarkan device ini ke registry (devices/<hostname>.md)..."
# Non-fatal: registry cuma dokumentasi. Jangan sampai bootstrap device baru gagal
# total hanya karena probe hardware bermasalah (install.sh pakai `set -e`).
"$DOT/bin/device-register" || echo "   ⚠️  device-register gagal — lanjut. Jalankan manual nanti."

echo "==> Setup tmux (install binary + clipboard + TPM + plugin)..."
"$DOT/bin/tmux-setup"

# Snapshot (reference, TIDAK di-symlink — mesin-spesifik / ditulis tool):
#   home/bashrc.snapshot, home/zshrc.snapshot, home/gitconfig, config/vscode-settings.json, skills/agents-bin/
#   (config/mise-config.toml SUDAH di-symlink sejak 2026-07-13 — dulu reference-only, dan itulah
#    penyebab repo cuma mencatat 4 tool sementara mesin live punya 17.)
#   -> di-refresh otomatis tiap 'dotpush'. Restore manual bila perlu di device baru.

echo "==> Patch $SHELL_RC (blok dev-tools)..."
MARKER=">>> dev-tools setup (ongkipro/dotfiles)"
if grep -qF "$MARKER" "$SHELL_RC" 2>/dev/null; then
  echo "   blok dev-tools sudah ada -> dilewati"
else
  { echo ""; cat "$DOT/config/shell-tools.sh"; } >> "$SHELL_RC"
  echo "   blok dev-tools ditambahkan ke $SHELL_RC"
fi

# WSL2-specific block (only added when running inside WSL)
if grep -qi 'microsoft' /proc/version 2>/dev/null; then
  WSL_MARKER=">>> WSL optimizations (ongki/dotfiles)"
  if grep -qF "$WSL_MARKER" "$SHELL_RC" 2>/dev/null; then
    echo "   blok WSL sudah ada -> dilewati"
  else
    { echo ""; cat "$DOT/config/wsl-tools.sh"; } >> "$SHELL_RC"
    echo "   blok WSL ditambahkan ke $SHELL_RC"
  fi
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
