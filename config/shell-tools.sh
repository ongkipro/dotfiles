# shell-tools.sh — cross-platform dev tool setup (bash + zsh, Ubuntu + macOS)
# Auto-deteksi shell. Idempotent (aman di-source berkali-kali).
# >>> dev-tools setup (ongkipro/dotfiles) >>>

_shell_name() {
  if [ -n "${ZSH_VERSION:-}" ]; then
    printf '%s\n' zsh
  else
    printf '%s\n' bash
  fi
}

# --- PATH: bin scripts (dotfiles + skills) ---
case ":$PATH:" in *":$HOME/.local/bin:"*) ;; *) export PATH="$HOME/.local/bin:$PATH";; esac
case ":$PATH:" in *":$HOME/.agents/bin:"*) ;; *) export PATH="$HOME/.agents/bin:$PATH";; esac

# --- mise: tool manager (no sudo) ---
if command -v mise >/dev/null; then
  case ":$PATH:" in *":$HOME/.local/share/mise/shims:"*) ;; *) export PATH="$HOME/.local/share/mise/shims:$PATH";; esac
  eval "$(mise activate "$(_shell_name)")"
fi

# --- eza: modern ls ---
if command -v eza >/dev/null; then
  alias ls='eza --group-directories-first'
  alias ll='eza -la --git --group-directories-first --time-style=relative'
  alias la='eza -a --group-directories-first'
  alias lt='eza --tree --level=2'
fi

# --- zoxide: smart cd ---
command -v zoxide >/dev/null && eval "$(zoxide init "$(_shell_name)")"

# --- fzf: fuzzy finder ---
if [ -n "${ZSH_VERSION:-}" ]; then
  command -v fzf >/dev/null && eval "$(fzf --zsh)" 2>/dev/null
else
  command -v fzf >/dev/null && eval "$(fzf --bash)" 2>/dev/null
fi

# --- direnv: auto-load .envrc ---
command -v direnv >/dev/null && eval "$(direnv hook "$(_shell_name)")"

# --- bat: colored man pager ---
command -v bat >/dev/null && export MANPAGER="sh -c 'col -bx | bat -l man -p'"

# --- ripgrep ---
[ -f ~/.ripgreprc ] && export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"

# --- fzf previews (fd + bat + eza) ---
if command -v fzf >/dev/null; then
  command -v fd >/dev/null && {
    export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
    export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
    export FZF_ALT_C_COMMAND='fd --type d --hidden --follow --exclude .git'
  }
  export FZF_DEFAULT_OPTS="--height 45% --layout=reverse --border=rounded --info=inline"
  command -v bat >/dev/null && export FZF_CTRL_T_OPTS="--preview 'bat -n --color=always --line-range :300 {}' --preview-window=right,60%"
  command -v eza >/dev/null && export FZF_ALT_C_OPTS="--preview 'eza --tree --level=2 --color=always {}'"
fi

# --- editor & tampilan ---
command -v bat >/dev/null && export BAT_THEME="ansi"
if   command -v hx  >/dev/null; then export EDITOR="hx"
elif command -v vim >/dev/null; then export EDITOR="vim"
else export EDITOR="nano"; fi
export VISUAL="$EDITOR"
export PAGER="less"; export LESS="-FRX"
alias grep='grep --color=auto'

# --- shortcuts ---
alias g='git'
command -v lazygit >/dev/null && alias lg='lazygit'
alias ..='cd ..'; alias ...='cd ../..'; alias ....='cd ../../..'
mkcd(){ mkdir -p -- "$1" && cd -- "$1"; }
ff(){ local f; f=$(fzf --preview 'bat -n --color=always {} 2>/dev/null || cat {}') && [ -n "$f" ] && ${EDITOR%% *} "$f"; }
fkill(){ local pid signal="${1:--15}"; pid=$(ps -eo pid,comm,%cpu,%mem | sed 1d | sort -rnk3 | fzf -m --header='pilih proses (TAB=multi)' | awk '{print $1}'); [ -n "$pid" ] && printf '%s\n' "$pid" | while IFS= read -r selected; do [ -n "$selected" ] && kill "$signal" "$selected"; done; }

# --- pi.dev: auto-load shared AI memory ---
pi() {
  local mem="$HOME/.config/ai/AGENTS.md"
  local local_mem="$HOME/.config/ai-local/device.md"
  local safe_update="$HOME/dotfiles/bin/pi-update-safe"
  case "${1:-}" in
    update)
      shift
      if [ -x "$safe_update" ]; then "$safe_update" "$@"; else command pi update "$@"; fi
      ;;
    install|uninstall|remove|list) command pi "$@" ;;
    *)
      # Build --append-system-prompt args: shared memory + device-local memory
      local -a args=()
      [ -f "$mem" ]       && args+=(--append-system-prompt "$mem")
      [ -f "$local_mem" ] && args+=(--append-system-prompt "$local_mem")
      if [ ${#args[@]} -gt 0 ]; then
        command pi "${args[@]}" "$@"
      else
        command pi "$@"
      fi
      ;;
  esac
}

# --- omp (omp.sh): primary coding control plane ---
# Native user context is linked at ~/.omp/agent/AGENTS.md. The optional
# 9Router credential is injected only into this child process.
omp() {
  case "${1:-}" in
    update)
      shift
      (set -o pipefail; curl -fsSL https://omp.sh/install | sh)
      ;;
    *)
      local credential_file="$HOME/.config/ai-local/credentials/9router-remote-key"
      local remote_key=""
      local overlay_file="$HOME/.config/ai-local/omp-overlay.yml"
      local -a args=("$@")

      if [ -f "$overlay_file" ]; then
        case "${1:-}" in
          acp|agents|auth-broker|auth-gateway|bench|browser-relay|cleanse|commit|completions|compress|config|dry-balance|gallery|gc|grep|grievances|install|join|models|plugin|read|say|search|setup|share|shell|ssh|stats|tiny-models|token|ttsr|update|usage|worktree)
            ;;
          *)
            args=(--config "$overlay_file" "${args[@]}")
            ;;
        esac
      fi

      if [ "${NINEROUTER_REMOTE_KEY+x}" = x ]; then
        command omp "${args[@]}"
        return
      fi
      if [ -r "$credential_file" ]; then
        IFS= read -r remote_key < "$credential_file" || :
      fi
      if [ -n "$remote_key" ]; then
        NINEROUTER_REMOTE_KEY="$remote_key" command omp "${args[@]}"
      else
        command omp "${args[@]}"
      fi
      ;;
  esac
}

# OMP generates completions from live command metadata, so new upstream
# subcommands do not require a hand-maintained completion file.
# `omp completions` costs about a second of pure CPU per call — measured 0.97s on
# `rich`, which made it the single largest contributor to a ~3s interactive shell
# start once a duplicated bashrc block was running it twice. Cache the output and
# key it on the binary's mtime, so the cost is paid once per omp upgrade instead
# of on every shell. Everything here fails open: a missing or stale cache costs
# completions, never a working shell.
if [[ $- == *i* ]] && command -v omp >/dev/null 2>&1; then
  _omp_shell=bash
  [ -n "${ZSH_VERSION:-}" ] && _omp_shell=zsh
  _omp_bin="$(command -v omp)"
  _omp_cache="${XDG_CACHE_HOME:-$HOME/.cache}/omp-completions.$_omp_shell"
  if [ ! -s "$_omp_cache" ] || [ "$_omp_bin" -nt "$_omp_cache" ]; then
    mkdir -p "$(dirname "$_omp_cache")" 2>/dev/null
    if command omp completions "$_omp_shell" >"$_omp_cache.tmp" 2>/dev/null; then
      mv "$_omp_cache.tmp" "$_omp_cache"
    else
      rm -f "$_omp_cache.tmp"
    fi
  fi
  [ -s "$_omp_cache" ] && source "$_omp_cache"
  unset _omp_shell _omp_bin _omp_cache
fi

# --- starship prompt ---
[[ $- == *i* && -t 1 ]] && command -v starship >/dev/null 2>&1 && eval "$(starship init "$(_shell_name)")"


# --- ImageMagick v7: use 'magick' (the actual command name now) ---
command -v magick >/dev/null && alias convert='magick'
command -v magick >/dev/null && alias mogrify='magick mogrify'
command -v magick >/dev/null && alias identify='magick identify'

# --- Shopify content/SEO shortcuts ---
# SEO audit (run inside a project)
shopify-seo-audit() {
  local url="${1:?usage: shopify-seo-audit <store-url>}"
  echo "→ Auditing $url ..."
  echo ""
  echo "[title]"
  curl -sL "$url" | grep -oE '<title>[^<]+</title>' | head -1
  echo ""
  echo "[meta description]"
  curl -sL "$url" | grep -oE '<meta name="description" content="[^"]+"' | head -1
  echo ""
  echo "[canonical]"
  curl -sL "$url" | grep -oE '<link rel="canonical" href="[^"]+"' | head -1
  echo ""
  echo "[h1]"
  curl -sL "$url" | grep -oE '<h1[^>]*>[^<]+</h1>' | head -3
  echo ""
  echo "[og:image]"
  curl -sL "$url" | grep -oE '<meta property="og:image" content="[^"]+"' | head -1
}

# Convert images to WebP (Shopify CDN serves better when WebP available)
shopify-webp() {
  local src="${1:?usage: shopify-webp <image> [width]}"
  local width="${2:-1200}"
  local out="${src%.*}.webp"
  magick "$src" -resize "${width}x>" -quality 85 -define webp:method=6 "$out" \
    && echo "✓ $out ($(du -h "$out" | cut -f1))" \
    || echo "✗ failed"
}

# Generate sitemap entry stub for a Shopify page
shopify-sitemap-entry() {
  local url="$1" lastmod="$2" changefreq="${3:-weekly}" priority="${4:-0.7}"
  printf '  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>%s</changefreq>\n    <priority>%s</priority>\n  </url>\n' \
    "$url" "$lastmod" "$changefreq" "$priority"
}

# Open Shopify store admin in browser
alias shopi-admin='powershell.exe -NoProfile -Command "Start-Process https://${SHOPIFY_STORE:-<your-store>}.myshopify.com/admin"'


# --- Shopify content/SEO helper (comprehensive tool) ---
[ -x "$HOME/.local/bin/shopify-content-helper" ] && alias sch='shopify-content-helper'

# --- One-shot audit: full SEO + content + schema check for a URL ---
shopify-full-audit() {
  local url="${1:?usage: shopify-full-audit <url>}"
  echo "=== Full SEO + content audit for: $url ==="
  echo
  shopify-content-helper seo-audit "$url"
  echo "=== Strict char-limit check ==="
  shopify-content-helper seo-check "$url"
}

# --- Windows debloat (run as admin from Windows PowerShell) ---
if [ -f /mnt/c/Users/Asus/win-debloat.ps1 ]; then
  alias win-debloat='powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\\Users\\Asus\\win-debloat.ps1'
fi
# <<< dev-tools setup (ongkipro/dotfiles) <<<
