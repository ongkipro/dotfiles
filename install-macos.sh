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
  local line="$1" file="$2" backup tmp
  touch "$file"
  tmp="$(mktemp "${file}.tmp.XXXXXX")"
  awk -v source_line="$line" '
    /^[[:space:]]*eval[[:space:]]+"\$\([^)]*mise[[:space:]]+activate[[:space:]]+(bash|zsh)[^)]*\)"[[:space:]]*$/ { next }
    $0 == source_line {
      if (!source_seen) print
      source_seen = 1
      next
    }
    { print }
    END {
      if (!source_seen) {
        if (NR > 0) print ""
        print source_line
      }
    }
  ' "$file" > "$tmp"
  if cmp -s "$file" "$tmp"; then
    rm -f "$tmp"
    return 0
  fi
  if [ -s "$file" ]; then
    backup="$(mktemp "${file}.bak.$(date +%Y%m%d-%H%M%S 2>/dev/null || echo old).XXXXXX")"
    cp -p "$file" "$backup"
    say "   backup: $file -> $backup"
  fi
  cat "$tmp" > "$file"
  rm -f "$tmp"
  say "   tracked shell source normalized in $file"
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
while IFS= read -r s; do
  case "$s" in ""|\#*) continue ;; esac
  [ -x "$DOT/bin/$s" ] || { echo "ERROR: runtime command is missing or not executable: $s" >&2; exit 1; }
  link "$DOT/bin/$s" "$HOME/.local/bin/$s"
done < "$DOT/config/ai/runtime-commands.txt"
say "==> Wire canonical Claude Code hooks..."
"$HOME/.local/bin/ai-hooks-install"


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

say "==> Install tracked mise toolchain..."
if ! command -v mise >/dev/null 2>&1 && [ -x "$HOME/.local/bin/mise" ]; then
  export PATH="$HOME/.local/bin:$PATH"
fi
if command -v mise >/dev/null 2>&1; then
  say "   mise sudah ada: $(mise --version 2>&1 | head -1)"
  mise install
  say "   Node dan seluruh toolchain dari config/mise-config.toml ✓ terinstall"
else
  cat <<'EOF'
   mise belum ada. Skrip ini tidak menjalankan remote script otomatis — install manual:
       curl -fsSL https://mise.run | sh
   Lalu jalankan ulang install-macos.sh untuk memasang Node dan seluruh toolchain
   dari config/mise-config.toml.
EOF
fi

say "==> Optional Pi/remote-9Router setup..."
if [ "${DOTFILES_SETUP_PI:-0}" = "1" ]; then
  command -v pi >/dev/null 2>&1 || { say "ERROR: DOTFILES_SETUP_PI=1 but pi is not installed."; exit 1; }
  "$DOT/bin/pi-9router-restore"
else
  say "   skipped (set DOTFILES_SETUP_PI=1 to opt in)"
fi
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
# One line per rc file, and it is the tracked entry point. Everything the removed
# lines did, `config/shell-tools.sh` already does and does better: it activates
# mise, and it guards each PATH entry with a `case ":$PATH:"` test so re-sourcing
# cannot duplicate it.
#
# Writing them here as well is what produced a ~3s interactive shell on `rich`:
# these lines landed in a `~/.bashrc` that install.sh had already wired, so
# shell-tools.sh was sourced twice and `omp completions` — about a second of CPU
# per call — ran twice on every prompt. The nvm lines were dead on arrival there
# too: nvm was retired 2026-07-27, and `brew --prefix nvm` is a subshell that can
# only fail on Linux.
ensure_line 'source "$HOME/dotfiles/config/zshrc.tools.sh"' "$HOME/.zshrc"
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
