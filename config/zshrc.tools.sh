# zshrc.tools.sh — dotfiles-specific additions (minimal, no duplicates)
# Main zshrc already handles: mise, fzf, zoxide, eza, bat, EDITOR, Oh-My-Zsh, PATH
# >>> dotfiles-tools (ongkipro/dotfiles) >>>

# --- pi.dev: auto-load shared AI memory ---
pi() {
  local mem="$HOME/.config/ai/AGENTS.md"
  local safe_update="$HOME/dotfiles/bin/pi-update-safe"
  case "${1:-}" in
    update)
      shift
      if [ -x "$safe_update" ]; then "$safe_update" "$@"; else command pi update "$@"; fi
      ;;
    install|uninstall|remove|list) command pi "$@" ;;
    *)
      if [ -f "$mem" ]; then command pi --append-system-prompt "$mem" "$@"; else command pi "$@"; fi
      ;;
  esac
}

# --- starship prompt (plain, no Nerd Font) ---
command -v starship >/dev/null 2>&1 && eval "$(starship init zsh)"

# --- dotfiles quick-access ---
alias dotsync='~/.local/bin/dotsync'
alias dotpush='~/.local/bin/dotpush'
alias lg='lazygit'

# --- OMP: inject the 9Router tunnel key only into the OMP process ---
omp() {
  local auth_file="$HOME/.pi/agent/auth.json"
  local remote_key=""

  if [ -n "${NINEROUTER_REMOTE_KEY:-}" ]; then
    command omp "$@"
    return
  fi
  if [ -r "$auth_file" ] && command -v jq >/dev/null 2>&1; then
    remote_key="$(jq -er '."9router-fantastico".key // empty' "$auth_file" 2>/dev/null)" || remote_key=""
  fi
  if [ -n "$remote_key" ]; then
    NINEROUTER_REMOTE_KEY="$remote_key" command omp "$@"
  else
    command omp "$@"
  fi
}

# <<< dotfiles-tools (ongkipro/dotfiles) <<<
