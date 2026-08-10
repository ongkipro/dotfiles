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
[[ -o interactive && -t 1 ]] && command -v starship >/dev/null 2>&1 && eval "$(starship init zsh)"

# --- dotfiles quick-access ---
alias dotsync='~/.local/bin/dotsync'
alias dotpush='~/.local/bin/dotpush'
alias lg='lazygit'

# --- OMP: inject the optional 9Router key only into the OMP child process ---
omp() {
  if [ "${1:-}" = "update" ]; then
    shift
    (set -o pipefail; curl -fsSL https://omp.sh/install | sh)
    return
  fi

  local credential_file="$HOME/.config/ai-local/credentials/9router-remote-key"
  local remote_key=""

  if [ "${NINEROUTER_REMOTE_KEY+x}" = x ]; then
    command omp "$@"
    return
  fi
  if [ -r "$credential_file" ]; then
    IFS= read -r remote_key < "$credential_file" || :
  fi
  if [ -n "$remote_key" ]; then
    NINEROUTER_REMOTE_KEY="$remote_key" command omp "$@"
  else
    command omp "$@"
  fi
}

# <<< dotfiles-tools (ongkipro/dotfiles) <<<
