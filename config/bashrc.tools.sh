# mise: tool manager user-local (no sudo)
if command -v mise >/dev/null; then
  export PATH="$HOME/.local/share/mise/shims:$PATH"  # tool kebaca di script / non-interaktif (VSCode task, bash -c)
  eval "$(mise activate bash)"                        # interaktif: versi per-direktori
fi
# >>> dev-tools setup (claude) >>>
# Ubuntu memasang fd sebagai 'fdfind' dan bat sebagai 'batcat'
command -v fdfind >/dev/null && alias fd='fdfind'
command -v batcat >/dev/null && alias bat='batcat'
# eza sebagai pengganti ls
if command -v eza >/dev/null; then
  alias ls='eza --group-directories-first'
  alias ll='eza -la --git --group-directories-first'
  alias lt='eza --tree --level=2'
fi
# zoxide: smart cd  ->  pakai 'z <nama>'
command -v zoxide >/dev/null && eval "$(zoxide init bash)"
# fzf: Ctrl-R (history), Ctrl-T (file), Alt-C (cd)
command -v fzf >/dev/null && eval "$(fzf --bash)" 2>/dev/null
# direnv: auto-load .envrc per project
command -v direnv >/dev/null && eval "$(direnv hook bash)"
# bat sebagai pager man (warna) — prefer 'bat' (mise), fallback 'batcat' (apt)
if command -v bat >/dev/null; then export MANPAGER="sh -c 'col -bx | bat -l man -p'"
elif command -v batcat >/dev/null; then export MANPAGER="sh -c 'col -bx | batcat -l man -p'"; fi
# --- akurat & cepat: ripgrep config ---
[ -f ~/.ripgreprc ] && export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"
# --- fzf: cepat (fd) + preview jelas (bat/eza) ---
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
# --- tampilan & editor ---
command -v bat >/dev/null && export BAT_THEME="ansi"
if command -v hx >/dev/null; then export EDITOR="hx"; elif command -v vim >/dev/null; then export EDITOR="vim"; else export EDITOR="nano"; fi
export VISUAL="$EDITOR"
export PAGER="less"; export LESS="-FRX"
alias grep='grep --color=auto'
# --- akses cepat: alias & fungsi ---
alias g='git'
command -v lazygit >/dev/null && alias lg='lazygit'
alias devnotes='bat ~/Documents/dev-setup.md 2>/dev/null || cat ~/Documents/dev-setup.md'   # panduan ringkas
alias devdoc='bat ~/Documents/linux-dev-setup.md 2>/dev/null || cat ~/Documents/linux-dev-setup.md'  # dokumen lengkap/reproduksi
if command -v eza >/dev/null; then
  alias ll='eza -la --git --group-directories-first --time-style=relative'
  alias la='eza -a --group-directories-first'
fi
alias ..='cd ..'; alias ...='cd ../..'; alias ....='cd ../../..'
mkcd(){ mkdir -p -- "$1" && cd -- "$1"; }                                   # bikin folder + masuk
ff(){ local f; f=$(fzf --preview 'bat -n --color=always {} 2>/dev/null || cat {}') && [ -n "$f" ] && ${EDITOR%% *} "$f"; }  # cari file -> buka di editor
fkill(){ local pid; pid=$(ps -eo pid,comm,%cpu,%mem --sort=-%cpu | sed 1d | fzf -m --header='pilih proses (TAB=multi)' | awk '{print $1}'); [ -n "$pid" ] && echo "$pid" | xargs -r kill "${1:--15}"; }  # kill proses via fzf
# starship: prompt informatif (git branch/status, exit code, durasi, runtime per-folder)
command -v starship >/dev/null && eval "$(starship init bash)"
# <<< dev-tools setup (claude) <<<
