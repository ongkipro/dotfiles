# bashrc.tools.sh — dotfiles-specific additions (minimal, no duplicates)
# Main bashrc already handles: fzf, zoxide, eza, bat, EDITOR, PATH
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
[[ $- == *i* && -t 1 ]] && command -v starship >/dev/null 2>&1 && eval "$(starship init bash)"

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
}

# <<< dotfiles-tools (ongkipro/dotfiles) <<<
