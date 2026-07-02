# shell-tools.sh — cross-platform dev tool setup (bash + zsh, Ubuntu + macOS)
# Auto-deteksi shell. Idempotent (aman di-source berkali-kali).
# >>> dev-tools setup (ongkipro/dotfiles) >>>

_shell_name() { basename "${SHELL:-/bin/bash}"; }

# --- mise: tool manager (no sudo) ---
if command -v mise >/dev/null; then
  export PATH="$HOME/.local/share/mise/shims:$PATH"
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
fkill(){ local pid; pid=$(ps -eo pid,comm,%cpu,%mem | sed 1d | sort -rnk3 | fzf -m --header='pilih proses (TAB=multi)' | awk '{print $1}'); [ -n "$pid" ] && echo "$pid" | xargs -r kill "${1:--15}"; }

# --- pi.dev: auto-load shared AI memory + welcome banner ---
pi() {
  local mem="$HOME/.config/ai/AGENTS.md"
  local welcome="$HOME/.config/ai/welcome.txt"
  case "${1:-}" in
    update|install|uninstall|remove|list) command pi "$@" ;;
    *)
      [ -f "$welcome" ] && cat "$welcome"
      if [ -f "$mem" ]; then command pi --append-system-prompt "$mem" "$@"; else command pi "$@"; fi
      ;;
  esac
}

# --- starship prompt ---
command -v starship >/dev/null && eval "$(starship init "$(_shell_name)")"

# <<< dev-tools setup (ongkipro/dotfiles) <<<
