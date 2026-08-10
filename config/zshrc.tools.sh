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

# --- OMP: export the 9Router tunnel key from local auth store ---
if [ -r "$HOME/.pi/agent/auth.json" ] && command -v jq >/dev/null 2>&1; then
  export NINEROUTER_REMOTE_KEY="$(jq -er '."9router-fantastico".key // empty' "$HOME/.pi/agent/auth.json" 2>/dev/null)"
fi

# <<< dotfiles-tools (ongkipro/dotfiles) <<<
