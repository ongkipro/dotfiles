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

# OMP owns its runtime configuration, model catalog, and bundled agents.
# Remove only links created by older dotfiles installers; preserve every
# unmanaged file or link for the user and for OMP itself.
# Mirrors install.sh. Claude Code moved to a single native profile at ~/.claude on
# 2026-07-29; that removed the switcher scripts from this repo but not what they had
# already installed on each device. The symlink prune further down only catches links
# into $DOT/bin - on `Fantastico` these had become REAL files and survived it - so
# retire them by name here too. ~/.claude-accounts/ is reported, never deleted: it
# holds session transcripts that are the user's to keep or discard.
retire_claude_account_profiles() {
  local stub
  for stub in "$HOME/.local/bin/claude-kerja" "$HOME/.local/bin/claude-personal"; do
    [ -e "$stub" ] || [ -L "$stub" ] || continue
    if [ -L "$stub" ] || grep -qF 'exec akun ' "$stub" 2>/dev/null; then
      rm -f "$stub"
      say "   removed retired Claude account launcher: $stub"
    else
      say "   ⚠️  $stub exists but is not the retired switcher stub - left untouched."
    fi
  done

  local cmd="$HOME/.claude/commands/akun.md"
  if [ -f "$cmd" ] && grep -qF 'akun open' "$cmd" 2>/dev/null; then
    rm -f "$cmd"
    say "   removed retired /akun slash command: $cmd"
  fi

  if [ -d "$HOME/.claude-accounts" ]; then
    say "   ⚠️  ~/.claude-accounts masih ada - profil kedua ini tidak dikelola dotfiles"
    say "       dan bisa jalan tanpa deny .env. Backup lalu hapus manual; ai-doctor juga melaporkannya."
  fi
}

retire_omp_overrides() {
  local name live tracked
  for name in config.yml models.yml agents; do
    live="$HOME/.omp/agent/$name"
    tracked="$DOT/config/omp/$name"
    if [ -L "$live" ] && [ "$(readlink "$live" 2>/dev/null)" = "$tracked" ]; then
      unlink "$live"
      say "   removed legacy OMP override: $live"
    fi
  done
}
ensure_shell_source() {
  local rc="$1" file="$2" marker="$3" legacy_stop="$4"
  local source_line start backup tmp remove_block=0
  source_line='source "$HOME/dotfiles/config/'"$file"'"'
  start="# >>> $marker >>>"
  touch "$rc"
  grep -qF "$start" "$rc" && remove_block=1

  tmp="$(mktemp "${rc}.tmp.XXXXXX")"
  if ! awk \
      -v remove_block="$remove_block" \
      -v start="$start" \
      -v stop="$legacy_stop" \
      -v source_line="$source_line" '
    BEGIN { print source_line }
    function generated_duplicate(line) {
      return line == "command -v omp >/dev/null 2>&1 && eval \"$(omp completions bash)\"" ||
             line == "command -v omp >/dev/null 2>&1 && eval \"$(omp completions zsh)\"" ||
             line == "eval \"$($HOME/.local/bin/mise activate bash)\"" ||
             line == "eval \"$($HOME/.local/bin/mise activate zsh)\"" ||
             line == "export NVM_DIR=\"$HOME/.nvm\"" ||
             line == "[ -s \"$(brew --prefix nvm 2>/dev/null)/nvm.sh\" ] && source \"$(brew --prefix nvm)/nvm.sh\"" ||
             line == "export PATH=\"$HOME/.local/bin:$HOME/.agents/bin:$PATH\""
    }
    remove_block && index($0, start) == 1 { skip = 1; found = 1; next }
    remove_block && skip && $0 == stop { skip = 0; next }
    skip { next }
    generated_duplicate($0) { next }
    $0 == source_line { next }
    { print }
  ' "$rc" > "$tmp"; then
    rm -f "$tmp"
    say "ERROR: failed to migrate managed shell block in $rc"
    return 1
  fi

  if cmp -s "$rc" "$tmp"; then
    rm -f "$tmp"
    say "   $file already sourced once by $rc"
    return
  fi

  backup="$(mktemp "${rc}.bak.$(date +%Y%m%d-%H%M%S 2>/dev/null || echo old).XXXXXX")"
  cp -p "$rc" "$backup"
  cat "$tmp" > "$rc"
  rm -f "$tmp"
  say "   backup: $rc -> $backup"
  say "   source $file normalized in $rc"
}

install_mise_tools() {
  local mise_bin
  if mise_bin="$(command -v mise 2>/dev/null)"; then
    say "   mise sudah ada: $("$mise_bin" --version 2>&1 | head -1)"
    eval "$("$mise_bin" activate bash 2>/dev/null || "$mise_bin" activate zsh 2>/dev/null || true)"

    say "==> Install essential tools via mise..."
    local spec
    for spec in "starship:starship" "direnv:direnv" "lazygit:lazygit" "helix:hx"; do
      ensure_mise_tool "${spec%%:*}" "${spec#*:}"
    done
  else
    printf '%s\n' \
      '   mise belum ada. Skrip ini tidak menjalankan remote script otomatis — install manual:' \
      '       curl -fsSL https://mise.run | sh' \
      '   Lalu jalankan ulang install-macos.sh untuk lanjut instal starship/direnv/lazygit/helix via mise.'
  fi
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
ensure_mise_tool() {
  local tool="$1" executable="${2:-$1}"
  if mise which "$executable" >/dev/null 2>&1; then
    say "   $tool sudah ada"
  else
    mise use -g "$tool" && say "   $tool ✓ terinstall"
  fi
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

# Commands removed from the manifest must not leave dead links on upgraded Macs.
# Only prune broken links that point into this repository's bin directory.
for dst in "$HOME/.local/bin"/*; do
  [ -L "$dst" ] || continue
  target="$(readlink "$dst")"
  case "$target" in
    "$DOT/bin/"*) [ -e "$target" ] || { unlink "$dst"; say "   pruned stale command link: $dst"; } ;;
  esac
done
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
retire_omp_overrides
retire_claude_account_profiles
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

# Jaminan native binary claude ter-unduh. `npm i -g @anthropic-ai/claude-code` (step 4,
# lihat docs/macos-install-step-by-step.md) menaruh native binary via optional-dep/
# postinstall — dan `install.cjs`-nya (postinstall itu sendiri) bisa DIBLOKIR npm 12+:
# default barunya menolak semua install-script kecuali di-allowlist eksplisit ("N package
# had install scripts blocked because they are not covered by allowScripts"), bukan cuma
# gagal jaringan/optional-dep senyap seperti dugaan awal. Verified di Linux 2026-08-19,
# mekanisme npm-nya sama persis di macOS.
# Preventif: allowlist paket ini sekali di scope user (idempotent, gabung dengan entri lain
# yang mungkin sudah ada — bukan menimpa; baca dari `--location=user` secara eksplisit,
# bukan nilai gabungan efektif, supaya `.npmrc` proyek di cwd lain tidak ikut kebaca/ketulis)
# supaya setiap `npm install -g` berikutnya — manual atau ter-trigger otomatis oleh CLI-nya
# sendiri — benar-benar menjalankan postinstall-nya, bukan cuma reaktif memperbaiki sesudah
# rusak. Bisa langsung jalan di sini (beda dengan install.sh Linux): `mise install` di atas
# sudah menaruh npm sebelum baris ini.
if command -v npm >/dev/null 2>&1; then
  allowed="$(npm config get allow-scripts --location=user 2>/dev/null || true)"
  case ",$allowed," in
    *,@anthropic-ai/claude-code,*) ;;
    *)
      new_allowed="@anthropic-ai/claude-code"
      [ -n "$allowed" ] && [ "$allowed" != "undefined" ] && new_allowed="$allowed,$new_allowed"
      npm config set "allow-scripts=$new_allowed" --location=user \
        && say "==> npm allow-scripts: @anthropic-ai/claude-code ✓ diizinkan (cegah native binary hilang lagi)" \
        || say "   ⚠️  gagal set npm allow-scripts — perbaiki manual: npm config set allow-scripts=@anthropic-ai/claude-code --location=user"
      ;;
  esac
else
  say "==> npm belum ada — allow-scripts belum bisa diset otomatis."
  say "    Sebelum 'npm i -g @anthropic-ai/claude-code' (step 4):"
  say "      npm config set allow-scripts=@anthropic-ai/claude-code --location=user"
fi

# Reaktif: kalau native binary tetap hilang saat ini (mis. sebelum allowlist di atas
# terpasang), perbaiki langsung dengan menjalankan ulang postinstall-nya.
if command -v claude >/dev/null 2>&1 && ! claude --version >/dev/null 2>&1; then
  say "==> claude native binary hilang — menjalankan postinstall..."
  node "$(npm root -g)/@anthropic-ai/claude-code/install.cjs" \
    && say "   claude native binary ✓ diperbaiki" \
    || say "   ⚠️  postinstall gagal — perbaiki manual: npm i -g @anthropic-ai/claude-code"
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
# Replace the copied legacy setup block with one tracked source. Exact trailing
# lines generated by older macOS installers are removed in the same backed-up
# rewrite; unrelated user setup after the old block is preserved.
ensure_shell_source \
  "$HOME/.zshrc" \
  "zshrc.tools.sh" \
  "dev-tools setup (ongkipro/dotfiles)" \
  'command -v starship >/dev/null && eval "$(starship init zsh)"'
ensure_shell_source \
  "$HOME/.bashrc" \
  "bashrc.tools.sh" \
  "dev-tools setup (ongkipro/dotfiles)" \
  'command -v starship >/dev/null && eval "$(starship init bash)"'
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
