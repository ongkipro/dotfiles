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

# OMP owns its runtime configuration, model catalog, and bundled agents.
# Remove only links created by older dotfiles installers; preserve every
# unmanaged file or link for the user and for OMP itself.
# Claude Code moved to a single native profile at ~/.claude on 2026-07-29, but that
# change only deleted the switcher scripts from this repo - it never removed what they
# had already installed on each device. On `Fantastico` the leftovers were still there
# on 2026-09-04: ~/.local/bin/claude-{kerja,personal} as REAL files (so the symlink
# prune below could not see them), a /akun slash command calling a binary that no longer
# exists, and a second profile under ~/.claude-accounts/ that was still receiving session
# writes while carrying no settings.json at all - no permissions.deny for .env, no hooks.
# Retire the launchers here; the profile directory is only reported, never deleted,
# because it holds session transcripts that are the user's to keep or discard.
retire_claude_account_profiles() {
  local stub
  for stub in "$HOME/.local/bin/claude-kerja" "$HOME/.local/bin/claude-personal"; do
    [ -e "$stub" ] || [ -L "$stub" ] || continue
    if [ -L "$stub" ] || grep -qF 'exec akun ' "$stub" 2>/dev/null; then
      rm -f "$stub"
      echo "   removed retired Claude account launcher: $stub"
    else
      echo "   ⚠️  $stub exists but is not the retired switcher stub - left untouched."
    fi
  done

  local cmd="$HOME/.claude/commands/akun.md"
  if [ -f "$cmd" ] && grep -qF 'akun open' "$cmd" 2>/dev/null; then
    rm -f "$cmd"
    echo "   removed retired /akun slash command: $cmd"
  fi

  if [ -d "$HOME/.claude-accounts" ]; then
    echo "   ⚠️  ~/.claude-accounts masih ada. Profil kedua ini TIDAK dikelola dotfiles"
    echo "       (single native profile sejak 2026-07-29) dan bisa jalan tanpa deny .env."
    echo "       Isinya transkrip sesi, jadi tidak dihapus otomatis - backup lalu hapus"
    echo "       manual kalau sudah tidak dipakai. ai-doctor juga melaporkannya."
  fi
}

retire_omp_overrides() {
  local name live tracked
  for name in config.yml models.yml agents; do
    live="$HOME/.omp/agent/$name"
    tracked="$DOT/config/omp/$name"
    if [ -L "$live" ] && [ "$(readlink "$live" 2>/dev/null)" = "$tracked" ]; then
      unlink "$live"
      echo "   removed legacy OMP override: $live"
    fi
  done
}

# Replace legacy copied shell blocks with one live source line. The timestamped
# backup preserves any hand edits that were made inside an old managed block.
ensure_shell_source() {
  local rc="$1" file="$2" marker="$3" legacy_stop="${4:-}"
  local source_line start stop backup tmp remove_block=0 remove_mise=0
  source_line='source "$HOME/dotfiles/config/'"$file"'"'
  start="# >>> $marker >>>"
  stop="# <<< $marker <<<"
  touch "$rc"

  if grep -qF "$start" "$rc"; then
    remove_block=1
    if [ -n "$legacy_stop" ] && grep -qF "$legacy_stop" "$rc"; then
      stop="$legacy_stop"
    elif ! grep -qF "$stop" "$rc"; then
      echo "ERROR: managed shell block in $rc has no closing marker" >&2
      return 1
    fi
  fi
  if grep -Eq '^[[:space:]]*eval[[:space:]]+"\$\([^)]*mise[[:space:]]+activate[[:space:]]+(bash|zsh)[^)]*\)"[[:space:]]*$' "$rc"; then
    remove_mise=1
  fi


  tmp="$(mktemp "${rc}.tmp.XXXXXX")"
  if ! awk \
      -v remove_block="$remove_block" \
      -v remove_mise="$remove_mise" \
      -v start="$start" \
      -v stop="$stop" \
      -v source_line="$source_line" '
    remove_block && $0 == start { skip = 1; found = 1; next }
    remove_block && skip && index($0, stop) == 1 { skip = 0; next }
    skip { next }
    remove_mise && $0 ~ /^[[:space:]]*eval[[:space:]]+"\$\([^)]*mise[[:space:]]+activate[[:space:]]+(bash|zsh)[^)]*\)"[[:space:]]*$/ { next }
    $0 == source_line {
      if (!source_seen) print
      source_seen = 1
      next
    }
    { print }
    END {
      if (remove_block && (skip || !found)) exit 2
      if (!source_seen) {
        if (NR > 0) print ""
        print source_line
      }
    }
  ' "$rc" > "$tmp"; then
    rm -f "$tmp"
    echo "ERROR: failed to migrate managed shell block in $rc" >&2
    return 1
  fi

  if cmp -s "$rc" "$tmp"; then
    rm -f "$tmp"
    echo "   $file already sourced once by $rc"
    return
  fi

  backup="$(mktemp "${rc}.bak.$(date +%Y%m%d-%H%M%S 2>/dev/null || echo old).XXXXXX")"
  cp -p "$rc" "$backup"
  cat "$tmp" > "$rc"
  rm -f "$tmp"
  echo "   backup: $rc -> $backup"
  [ "$remove_mise" -eq 0 ] || echo "   legacy standalone mise activation removed from $rc"
  echo "   source $file normalized in $rc"
}
link "$DOT/config/ai"                    ~/.config/ai          # memori bersama (+ memory/*.md)
link "$DOT/config/starship.toml"         ~/.config/starship.toml
link "$DOT/config/ripgreprc"             ~/.ripgreprc
link "$DOT/config/helix/config.toml"     ~/.config/helix/config.toml
link "$DOT/config/helix/languages.toml"  ~/.config/helix/languages.toml
link "$DOT/config/gitignore_global"      ~/.gitignore_global
link "$DOT/config/tmux.conf"             ~/.tmux.conf
link "$DOT/config/mise-config.toml"      ~/.config/mise/config.toml  # toolchain bersama; `mise use -g` nulis tembus symlink
link "$DOT/config/lazygit/config.yml"    ~/.config/lazygit/config.yml
link "$DOT/config/gh/config.yml"         ~/.config/gh/config.yml     # hosts.yml TIDAK di-link (berisi oauth token)
for s in skill-help skill-list skill-new skill-open skill-check skill-remove skill-update; do link "$DOT/skills/agents-bin/$s" ~/.agents/bin/$s; done
link "$DOT/home/profile"                 ~/.profile
while IFS= read -r s; do
  case "$s" in ""|\#*) continue ;; esac
  [ -x "$DOT/bin/$s" ] || { echo "ERROR: runtime command is missing or not executable: $s" >&2; exit 1; }
  link "$DOT/bin/$s" ~/.local/bin/$s
done < "$DOT/config/ai/runtime-commands.txt"

# A command dropped from the manifest leaves its link behind on every device that
# once installed it. Prune links pointing into this repo's bin/ that no longer resolve.
for dst in ~/.local/bin/*; do
  [ -L "$dst" ] || continue
  target="$(readlink "$dst")"
  case "$target" in "$DOT/bin/"*) [ -e "$target" ] || { unlink "$dst"; echo "   pruned stale command link: $dst"; } ;; esac
done

echo "==> Wire canonical Claude Code hooks..."
# ~/.claude is THE profile; ~/.claude-accounts/* is retired and must not be recreated
# (retire_claude_account_profiles above reports any survivor). It is still wired here
# deliberately: on a device where such a profile lingers, an unguarded one is worse than
# a deprecated one, and this loop is what gives it deny .env + git-guard until it is
# removed. The loop must never be the reason a second profile is created - it only
# matches directories that already exist.
for cfg in "$HOME/.claude" "$HOME"/.claude-accounts/*/; do
  [ -d "$cfg" ] || continue
  "$HOME/.local/bin/ai-hooks-install" --settings "${cfg%/}/settings.json"
done
retire_omp_overrides
retire_claude_account_profiles

# `config/codex-instructions.md` has been removed from the repo. Clean up the
# legacy symlink so ai-doctor does not flag a dangling path on upgraded devices.
if [ -L "$HOME/.codex/instructions.md" ] && [ "$(readlink "$HOME/.codex/instructions.md" 2>/dev/null)" = "$DOT/config/codex-instructions.md" ]; then
  unlink "$HOME/.codex/instructions.md"
  echo "   removed legacy ~/.codex/instructions.md symlink"
fi
~/.local/bin/ai-memory-link              # runtime-native AGENTS.md links (including ~/.omp/agent/AGENTS.md)
"$DOT/skills/agents-bin/skill-update"    # directory links + Codex per-skill adapter preserving .system

# Pi's remote 9Router adapter is optional and does not require a local gateway.
# Credential migration remains a separate manual command.
if [ "${DOTFILES_SETUP_PI:-0}" = "1" ]; then
  command -v pi >/dev/null 2>&1 || { echo "ERROR: DOTFILES_SETUP_PI=1 but pi is not installed." >&2; exit 1; }
  "$DOT/bin/pi-9router-restore"
else
  echo "==> Optional Pi/remote-9Router restore skipped (set DOTFILES_SETUP_PI=1 to opt in)."
fi

# Jaminan native binary claude ter-unduh. `npm i -g @anthropic-ai/claude-code` (step 4,
# lihat docs/linux-install-step-by-step.md) menaruh native binary via optional-dep/
# postinstall — dan `install.cjs`-nya (postinstall itu sendiri) bisa DIBLOKIR npm 12+:
# default barunya menolak semua install-script kecuali di-allowlist eksplisit ("N package
# had install scripts blocked because they are not covered by allowScripts"), bukan cuma
# gagal jaringan/optional-dep senyap seperti dugaan awal. Verified 2026-08-19: `npm install
# --global @anthropic-ai/claude-code@2.1.235` ter-log sukses (exit 0) tapi native binary-nya
# tetap stub, persis karena warning ini.
# Preventif: allowlist paket ini sekali di scope user (idempotent, gabung dengan entri lain
# yang mungkin sudah ada — bukan menimpa; baca dari `--location=user` secara eksplisit,
# bukan nilai gabungan efektif, supaya `.npmrc` proyek di cwd lain tidak ikut kebaca/ketulis)
# supaya setiap `npm install -g` berikutnya — manual atau ter-trigger otomatis oleh CLI-nya
# sendiri — benar-benar menjalankan postinstall-nya, bukan cuma reaktif memperbaiki sesudah
# rusak. TIDAK BISA jalan di sini di bootstrap paling pertama — npm baru ada setelah `mise
# install` (step 3, manual, sesudah skrip ini selesai) — makanya peringatan yang sama juga
# ada di docs/linux-install-step-by-step.md SEBELUM baris `npm i -g` step 4. Tetap berguna
# untuk device yang sudah lengkap dan menjalankan ulang install.sh (idempotent by design).
if command -v npm >/dev/null 2>&1; then
  allowed="$(npm config get allow-scripts --location=user 2>/dev/null || true)"
  case ",$allowed," in
    *,@anthropic-ai/claude-code,*) ;;
    *)
      new_allowed="@anthropic-ai/claude-code"
      [ -n "$allowed" ] && [ "$allowed" != "undefined" ] && new_allowed="$allowed,$new_allowed"
      npm config set "allow-scripts=$new_allowed" --location=user \
        && echo "==> npm allow-scripts: @anthropic-ai/claude-code ✓ diizinkan (cegah native binary hilang lagi)" \
        || echo "   ⚠️  gagal set npm allow-scripts — perbaiki manual: npm config set allow-scripts=@anthropic-ai/claude-code --location=user"
      ;;
  esac
else
  echo "==> npm belum ada (belum 'mise install') — allow-scripts belum bisa diset otomatis."
  echo "    Setelah 'mise install', sebelum 'npm i -g @anthropic-ai/claude-code' (step 4):"
  echo "      npm config set allow-scripts=@anthropic-ai/claude-code --location=user"
fi

# Reaktif: kalau native binary tetap hilang saat ini (mis. sebelum allowlist di atas
# terpasang), perbaiki langsung dengan menjalankan ulang postinstall-nya.
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

echo "==> Wire Linux shell startup to tracked shell tools..."
ensure_shell_source \
  "$HOME/.bashrc" \
  "shell-tools.sh" \
  "dev-tools setup (ongkipro/dotfiles)" \
  "[ -f /mnt/c/Users/Asus/win-debloat.ps1 ]"
if [ "$SHELL_RC" != "$HOME/.bashrc" ]; then
  ensure_shell_source \
    "$SHELL_RC" \
    "shell-tools.sh" \
    "dev-tools setup (ongkipro/dotfiles)" \
    "[ -f /mnt/c/Users/Asus/win-debloat.ps1 ]"
fi

# WSL2-specific tools stay source-linked too.
if grep -qi 'microsoft' /proc/version 2>/dev/null; then
  ensure_shell_source \
    "$HOME/.bashrc" \
    "wsl-tools.sh" \
    "WSL optimizations (ongki/dotfiles)"
  if [ "$SHELL_RC" != "$HOME/.bashrc" ]; then
    ensure_shell_source \
      "$SHELL_RC" \
      "wsl-tools.sh" \
      "WSL optimizations (ongki/dotfiles)"
  fi
fi

cat <<EOF

==> Config terpasang. Langkah berikutnya (sekali, NO-SUDO):

  1) Install mise (kalau belum):
       curl -fsSL https://mise.run | sh

  2) Muat shell startup yang baru dinormalisasi:
       source "$SHELL_RC"   (atau buka terminal baru)

  3) Pasang Node dan seluruh toolchain dari config mise yang dilacak:
       mise install

  4) Language server (autocomplete Helix):
       npm i -g typescript-language-server vscode-langservers-extracted \\
                @tailwindcss/language-server yaml-language-server bash-language-server pyright
       pipx install python-lsp-server

  5) Git identity: ikuti "Login & Verifikasi" di:
       docs/linux-install-step-by-step.md

Runbook lengkap: docs/linux-install-step-by-step.md
EOF
