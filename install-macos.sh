#!/usr/bin/env bash
# Bootstrap ringan untuk macOS: shared memory, skills, dotsync, dan shell hooks.
set -euo pipefail
DOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
link "$DOT/config/gitignore_global"      "$HOME/.gitignore_global"
link "$DOT/config/codex-instructions.md" "$HOME/.codex/instructions.md"
link "$DOT/bin/ai-memory-link"           "$HOME/.local/bin/ai-memory-link"
link "$DOT/bin/dotsync"                  "$HOME/.local/bin/dotsync"
link "$DOT/bin/dotpush"                  "$HOME/.local/bin/dotpush"
for s in akun claude-kerja claude-personal tmux-clip security-check; do
  [ -e "$DOT/bin/$s" ] && link "$DOT/bin/$s" "$HOME/.local/bin/$s"
done

say "==> Link local skills + skill commands..."
link "$DOT/skills/local"                 "$HOME/.agents/local-skills"
mkdir -p "$HOME/.agents/bin"
for s in skill-help skill-list skill-new skill-open skill-remove skill-update sync-jezweb-claude-skills.sh; do
  [ -e "$DOT/skills/agents-bin/$s" ] && link "$DOT/skills/agents-bin/$s" "$HOME/.agents/bin/$s"
done
[ -L "$HOME/.agents/bin/sync-jezweb-claude-skills.sh" ] && ln -sfn "$HOME/.agents/bin/sync-jezweb-claude-skills.sh" "$HOME/.agents/bin/skill-sync"

say "==> Link AGENTS.md ke CLI yang ada..."
"$HOME/.local/bin/ai-memory-link"

say "==> Patch ~/.zshrc dan ~/.bashrc (tanpa overwrite total)..."
ensure_line 'source "$HOME/dotfiles/config/zshrc.tools.sh"' "$HOME/.zshrc"
ensure_line 'source "$HOME/dotfiles/config/bashrc.tools.sh"' "$HOME/.bashrc"

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
