# bashrc.tools.sh — dotfiles-specific additions (minimal, no duplicates)
# Main bashrc already handles: fzf, zoxide, eza, bat, EDITOR, PATH
# >>> dotfiles-tools (ongkipro/dotfiles) >>>

# --- pi.dev: auto-load shared AI memory ---
# Welcome banner is rendered by the pi extension (~/.pi/agent/extensions/welcome-screen.ts),
# so the wrapper must NOT also cat welcome.txt — that caused a double banner.
pi() {
  local mem="$HOME/.config/ai/AGENTS.md"
  case "${1:-}" in
    update|install|uninstall|remove|list) command pi "$@" ;;
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
