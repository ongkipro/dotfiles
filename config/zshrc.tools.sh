# PATH: local bin + agents bin
[[ ":$PATH:" != *":$HOME/.local/bin:"* ]] && export PATH="$HOME/.local/bin:$PATH"
[[ ":$PATH:" != *":$HOME/.agents/bin:"* ]] && export PATH="$HOME/.agents/bin:$PATH"

# mise: tool manager user-local (no sudo)
if command -v mise >/dev/null; then
  export PATH="$HOME/.local/share/mise/shims:$PATH"
  eval "$(mise activate zsh)"
fi
# >>> dev-tools setup (zsh) >>>
command -v fdfind >/dev/null && alias fd='fdfind'
command -v batcat >/dev/null && alias bat='batcat'
if command -v eza >/dev/null; then
  alias ls='eza --group-directories-first'
  alias ll='eza -la --git --group-directories-first'
  alias lt='eza --tree --level=2'
fi
command -v zoxide >/dev/null && eval "$(zoxide init zsh)"
command -v fzf >/dev/null && eval "$(fzf --zsh)" 2>/dev/null
command -v direnv >/dev/null && eval "$(direnv hook zsh)"
if command -v bat >/dev/null; then export MANPAGER="sh -c 'col -bx | bat -l man -p'"
elif command -v batcat >/dev/null; then export MANPAGER="sh -c 'col -bx | batcat -l man -p'"; fi
[ -f ~/.ripgreprc ] && export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"
if command -v fzf >/dev/null; then
  if command -v fd >/dev/null; then
    export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
    export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
    export FZF_ALT_C_COMMAND='fd --type d --hidden --follow --exclude .git'
  fi
  export FZF_DEFAULT_OPTS="--height 45% --layout=reverse --border=rounded --info=inline"
  command -v bat >/dev/null && export FZF_CTRL_T_OPTS="--preview 'bat -n --color=always --line-range :300 {}' --preview-window=right,60%"
  command -v eza >/dev/null && export FZF_ALT_C_OPTS="--preview 'eza --tree --level=2 --color=always {}'"
fi
command -v bat >/dev/null && export BAT_THEME="ansi"
if command -v hx >/dev/null; then export EDITOR="hx"; elif command -v vim >/dev/null; then export EDITOR="vim"; else export EDITOR="nano"; fi
export VISUAL="$EDITOR"
export PAGER="less"; export LESS="-FRX"
alias grep='grep --color=auto'
alias g='git'
command -v lazygit >/dev/null && alias lg='lazygit'
alias devnotes='bat ~/Documents/dev-setup.md 2>/dev/null || cat ~/Documents/dev-setup.md'
alias devdoc='bat ~/Documents/linux-dev-setup.md 2>/dev/null || cat ~/Documents/linux-dev-setup.md'
if command -v eza >/dev/null; then
  alias ll='eza -la --git --group-directories-first --time-style=relative'
  alias la='eza -a --group-directories-first'
fi
alias ..='cd ..'; alias ...='cd ../..'; alias ....='cd ../../..'
mkcd(){ mkdir -p -- "$1" && cd -- "$1"; }
ff(){ local f; f=$(fzf --preview 'bat -n --color=always {} 2>/dev/null || cat {}') && [ -n "$f" ] && ${EDITOR%% *} "$f"; }
fkill(){ local pid; pid=$(ps -eo pid,comm,%cpu,%mem | sed 1d | fzf -m --header='pilih proses (TAB=multi)' | awk '{print $1}'); [ -n "$pid" ] && print -r -- "$pid" | xargs kill "${1:--15}"; }
pi() {
  local mem="$HOME/.config/ai/AGENTS.md"
  case "${1:-}" in
    update|install|uninstall|remove|list) command pi "$@" ;;
    *) if [ -f "$mem" ]; then command pi --append-system-prompt "$mem" "$@"; else command pi "$@"; fi ;;
  esac
}
command -v starship >/dev/null && eval "$(starship init zsh)"
# <<< dev-tools setup (zsh) <<<
