# zshrc.tools.sh — dotfiles-specific additions (minimal, no duplicates)
# Main zshrc already handles: mise, fzf, zoxide, eza, bat, EDITOR, Oh-My-Zsh, PATH
# >>> dotfiles-tools (ongkipro/dotfiles) >>>

# --- pi.dev: auto-load shared AI memory ---
pi() {
  local mem="$HOME/.config/ai/AGENTS.md"
  case "${1:-}" in
    update|install|uninstall|remove|list) command pi "$@" ;;
    *) if [ -f "$mem" ]; then command pi --append-system-prompt "$mem" "$@"; else command pi "$@"; fi ;;
  esac
}

# --- starship prompt (plain, no Nerd Font) ---
command -v starship >/dev/null 2>&1 && eval "$(starship init zsh)"

# --- dotfiles quick-access ---
alias dotsync='~/.local/bin/dotsync'
alias dotpush='~/.local/bin/dotpush'
alias lg='lazygit'

# <<< dotfiles-tools (ongkipro/dotfiles) <<<
