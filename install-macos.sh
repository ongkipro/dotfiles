#!/usr/bin/env bash
# Bootstrap ringan untuk macOS: shared memory, skills, dotsync, dan shell hooks.
set -euo pipefail
DOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Aktifkan driver merge 'ours' utk file snapshot mesin (lihat .gitattributes) — anti-konflik lintas-mesin.
git -C "$DOT" config merge.ours.driver true 2>/dev/null || true

say() { printf '%s\n' "$*"; }
link() {
  local src="$1" dst="$2"
  local backup
  mkdir -p "$(dirname "$dst")"
  if [ -L "$dst" ]; then
    [ "$(readlink "$dst" 2>/dev/null)" = "$src" ] && { say "   $dst -> $src (sudah benar)"; return 0; }
    unlink "$dst"
  elif [ -e "$dst" ]; then
    backup="$dst.bak.$(date +%Y%m%d-%H%M%S 2>/dev/null || echo old).$$"
    mv "$dst" "$backup"
    say "   backup: $dst -> $backup"
  fi
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
mkdir -p "$HOME/.config/mise" "$HOME/.config/lazygit" "$HOME/.config/gh"
link "$DOT/config/mise-config.toml"      "$HOME/.config/mise/config.toml"   # toolchain bersama
link "$DOT/config/lazygit/config.yml"    "$HOME/.config/lazygit/config.yml"
link "$DOT/config/gh/config.yml"         "$HOME/.config/gh/config.yml"      # hosts.yml TIDAK di-link (oauth token)
link "$DOT/bin/ai-memory-link"           "$HOME/.local/bin/ai-memory-link"
link "$DOT/bin/dotsync"                  "$HOME/.local/bin/dotsync"
link "$DOT/bin/dotpush"                  "$HOME/.local/bin/dotpush"
link "$DOT/bin/ai-doctor"                "$HOME/.local/bin/ai-doctor"        # cek rantai AI↔device↔memori
link "$DOT/bin/ai-memory-check"          "$HOME/.local/bin/ai-memory-check"
link "$DOT/bin/security-check"           "$HOME/.local/bin/security-check"
link "$DOT/bin/security-check-test"      "$HOME/.local/bin/security-check-test"
link "$DOT/bin/skill-check-test"         "$HOME/.local/bin/skill-check-test"
link "$DOT/bin/skill-update-test"        "$HOME/.local/bin/skill-update-test"
link "$DOT/bin/installer-link-test"      "$HOME/.local/bin/installer-link-test"
link "$DOT/bin/shell-wrapper-test"       "$HOME/.local/bin/shell-wrapper-test"
link "$DOT/bin/inspect-project"          "$HOME/.local/bin/inspect-project"
link "$DOT/bin/project-init"             "$HOME/.local/bin/project-init"
link "$DOT/bin/project-init-test"        "$HOME/.local/bin/project-init-test"
for s in tmux-clip tmux-setup tmux-battery security-check 9router-start pi-9router-restore device-register; do
  [ -e "$DOT/bin/$s" ] && link "$DOT/bin/$s" "$HOME/.local/bin/$s"
done


say "==> Link local skills + skill commands..."
mkdir -p "$HOME/.agents/bin"
for s in skill-help skill-list skill-new skill-open skill-check skill-remove skill-update; do
  [ -e "$DOT/skills/agents-bin/$s" ] && link "$DOT/skills/agents-bin/$s" "$HOME/.agents/bin/$s"
done
# Runtime-native adapters: directory links for Claude/Pi/OMP/Antigravity and
# per-skill Codex links that preserve ~/.codex/skills/.system.
"$DOT/skills/agents-bin/skill-update"

say "==> Link AGENTS.md ke CLI yang ada..."
link "$DOT/config/omp/config.yml"        "$HOME/.omp/agent/config.yml"   # OMP config
link "$DOT/config/omp/models.yml"        "$HOME/.omp/agent/models.yml"   # OMP providers (9router)
link "$DOT/config/omp/agents"            "$HOME/.omp/agent/agents"     # OMP specialist agents (role-routed)
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
# Runtime managers and local command dirs must load before tracked shell helpers.
ensure_line 'eval "$($HOME/.local/bin/mise activate zsh)"' "$HOME/.zshrc"
ensure_line 'export PATH="$HOME/.local/bin:$HOME/.agents/bin:$PATH"' "$HOME/.zshrc"
ensure_line 'source "$HOME/dotfiles/config/zshrc.tools.sh"' "$HOME/.zshrc"
ensure_line 'eval "$($HOME/.local/bin/mise activate bash)"' "$HOME/.bashrc"
ensure_line 'export NVM_DIR="$HOME/.nvm"' "$HOME/.bashrc"
ensure_line '[ -s "$(brew --prefix nvm 2>/dev/null)/nvm.sh" ] && source "$(brew --prefix nvm)/nvm.sh"' "$HOME/.bashrc"
ensure_line 'export PATH="$HOME/.local/bin:$HOME/.agents/bin:$PATH"' "$HOME/.bashrc"
ensure_line 'source "$HOME/dotfiles/config/bashrc.tools.sh"' "$HOME/.bashrc"
ensure_line '[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc"' "$HOME/.bash_profile"

say "==> Daftarkan final state device ini..."
# Run after links, tools, providers, and shell startup are configured.
"$DOT/bin/device-register" || say "   ⚠️  device-register gagal — lanjut. Jalankan manual nanti."

cat <<'EOF'

==> macOS bootstrap selesai.

Langkah berikutnya:
  1) buka shell baru, atau jalankan:
       source ~/.zshrc
  2) cek sync:
       dotsync doctor

Catatan:
- Skills are linked from one owned source. Directory-link runtimes reflect
  source changes immediately; run `skill-update` after adding/removing a skill
  to reconcile Codex, or after installing a new runtime.
- Bootstrap ini fokus ke shared memory + sync + local skills.
- install.sh utama tetap Linux-first.
EOF
