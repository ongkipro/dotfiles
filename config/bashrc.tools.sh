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
command -v starship >/dev/null 2>&1 && eval "$(starship init bash)"

# --- dotfiles quick-access ---
alias dotsync='~/.local/bin/dotsync'
alias dotpush='~/.local/bin/dotpush'
alias lg='lazygit'

# <<< dotfiles-tools (ongkipro/dotfiles) <<<
