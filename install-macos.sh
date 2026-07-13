#!/usr/bin/env bash
# Bootstrap ringan untuk macOS: shared memory, skills, dotsync, dan shell hooks.
set -euo pipefail
DOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Aktifkan driver merge 'ours' utk file snapshot mesin (lihat .gitattributes) — anti-konflik lintas-mesin.
git -C "$DOT" config merge.ours.driver true 2>/dev/null || true

say() { printf '%s\n' "$*"; }
link() {
  local src="$1" dst="$2"
  mkdir -p "$(dirname "$dst")"
  if [ -e "$dst" ] && [ ! -L "$dst" ]; then
    cp -R "$dst" "$dst.bak.$(date +%s 2>/dev/null || echo old)" 2>/dev/null || true
  fi
  rm -rf "$dst"
  ln -s "$src" "$dst"
  say "   $dst -> $src"
}
ensure_line() {
  local line="$1" file="$2"
  touch "$file"
  grep -Fqx "$line" "$file" 2>/dev/null || printf '\n%s\n' "$line" >> "$file"
}

say "==> Symlink shared memory, config penting, dan scripts..."
mkdir -p "$HOME/.config" "$HOME/.local/bin" "$HOME/.agents/bin"
link "$DOT/config/ai"                    "$HOME/.config/ai"
link "$DOT/config/starship.toml"         "$HOME/.config/starship.toml"
link "$DOT/config/ripgreprc"             "$HOME/.ripgreprc"
link "$DOT/config/helix/config.toml"     "$HOME/.config/helix/config.toml"
link "$DOT/config/helix/languages.toml"  "$HOME/.config/helix/languages.toml"
link "$DOT/config/gitignore_global"      "$HOME/.gitignore_global"
link "$DOT/config/codex-instructions.md" "$HOME/.codex/instructions.md"
mkdir -p "$HOME/.config/mise" "$HOME/.config/lazygit" "$HOME/.config/gh"
link "$DOT/config/mise-config.toml"      "$HOME/.config/mise/config.toml"   # toolchain bersama
link "$DOT/config/lazygit/config.yml"    "$HOME/.config/lazygit/config.yml"
link "$DOT/config/gh/config.yml"         "$HOME/.config/gh/config.yml"      # hosts.yml TIDAK di-link (oauth token)
link "$DOT/bin/ai-memory-link"           "$HOME/.local/bin/ai-memory-link"
link "$DOT/bin/dotsync"                  "$HOME/.local/bin/dotsync"
link "$DOT/bin/dotpush"                  "$HOME/.local/bin/dotpush"
link "$DOT/bin/project-init"             "$HOME/.local/bin/project-init"
for s in akun claude-kerja claude-personal tmux-clip tmux-setup tmux-battery security-check 9router-start pi-9router-restore device-register; do
  [ -e "$DOT/bin/$s" ] && link "$DOT/bin/$s" "$HOME/.local/bin/$s"
done

say "==> Daftarkan device ini ke registry (devices/<hostname>.md)..."
# Non-fatal — registry cuma dokumentasi, jangan bikin bootstrap gagal total.
"$DOT/bin/device-register" || say "   ⚠️  device-register gagal — lanjut. Jalankan manual nanti."

say "==> Link local skills + skill commands..."
link "$DOT/skills/local"                 "$HOME/.agents/local-skills"
mkdir -p "$HOME/.agents/bin"
for s in skill-help skill-list skill-new skill-open skill-remove skill-update sync-jezweb-claude-skills.sh; do
  [ -e "$DOT/skills/agents-bin/$s" ] && link "$DOT/skills/agents-bin/$s" "$HOME/.agents/bin/$s"
done
[ -L "$HOME/.agents/bin/sync-jezweb-claude-skills.sh" ] && ln -sfn "$HOME/.agents/bin/sync-jezweb-claude-skills.sh" "$HOME/.agents/bin/skill-sync"

say "==> Link AGENTS.md ke CLI yang ada..."
"$HOME/.local/bin/ai-memory-link"

say "==> Setup tmux (install binary + clipboard + TPM + plugin)..."
"$DOT/bin/tmux-setup"

say "==> Install mise (tool manager)..."
if command -v mise >/dev/null 2>&1; then
  say "   mise sudah ada: $(mise --version 2>&1 | head -1)"
else
  curl -fsSL https://mise.run | sh
fi
eval "$($HOME/.local/bin/mise activate bash 2>/dev/null || $HOME/.local/bin/mise activate zsh 2>/dev/null || true)"

say "==> Install essential tools via mise..."
MISE_TOOLS="starship direnv lazygit helix"
for tool in $MISE_TOOLS; do
  if mise which "$tool" >/dev/null 2>&1; then
    say "   $tool sudah ada"
  else
    mise use -g "$tool" && say "   $tool ✓ terinstall"
  fi
done

say "==> Setup 9router (AI gateway for pi.dev)..."
if command -v 9router >/dev/null 2>&1; then
  say "   9router sudah ada: $(9router --version 2>&1 | head -1)"
else
  say "   Install 9router via npm..."
  npm i -g 9router && say "   9router ✓ terinstall"
fi
# Restore pi settings + 9router launchd service
"$DOT/bin/pi-9router-restore"
if [ ! -f "$HOME/.gitconfig" ]; then
  cat > "$HOME/.gitconfig" <<GITEOF
[user]
    # Identitas SAMA di semua device (Linux + Mac). Pakai GitHub noreply supaya email
    # asli tidak pernah bocor ke riwayat commit — dan commit tetap terhitung ke profil.
    name = ongkipro
    email = 82156528+ongkipro@users.noreply.github.com
[core]
    excludesfile = $DOT/config/gitignore_global
    autocrlf = input
[init]
    defaultBranch = main
[push]
    autoSetupRemote = true
[pull]
    rebase = true
[color]
    ui = auto
GITEOF
  say "   ~/.gitconfig dibuat"
else
  say "   ~/.gitconfig sudah ada — pastikan excludesfile = $DOT/config/gitignore_global"
fi

say "==> Create work folder structure..."
mkdir -p "$HOME/Documents/work/"{prd,research,content,notes}
mkdir -p "$HOME/Projects"
say "   ~/Documents/work/{prd,research,content,notes}"
say "   ~/Projects/"

say "==> Patch ~/.zshrc dan ~/.bashrc (tanpa overwrite total)..."
# Gunakan single-quote agar $HOME tetap dinamis di .zshrc (portabel antar user/mesin)
ensure_line 'eval "$($HOME/.local/bin/mise activate zsh)"' "$HOME/.zshrc"
ensure_line 'source "$HOME/dotfiles/config/zshrc.tools.sh"' "$HOME/.zshrc"
ensure_line 'source "$HOME/dotfiles/config/bashrc.tools.sh"' "$HOME/.bashrc"
# Pastikan ~/.local/bin dan ~/.agents/bin ada di PATH
ensure_line 'export PATH="$HOME/.local/bin:$HOME/.agents/bin:$PATH"' "$HOME/.zshrc"

cat <<'EOF'

==> macOS bootstrap selesai.

Langkah berikutnya:
  1) buka shell baru, atau jalankan:
       source ~/.zshrc
  2) sync skills ke semua CLI:
       ~/.agents/bin/skill-update
  3) cek sync:
       dotsync doctor

Catatan:
- Bootstrap ini fokus ke shared memory + sync + local skills.
- install.sh utama tetap Linux-first.
EOF
