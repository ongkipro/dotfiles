# wsl-tools.sh — WSL2-specific bashrc additions
# Idempotent (aman di-source berkali-kali). Pakai dari install.sh atau manual:
#   echo 'source ~/dotfiles/config/wsl-tools.sh' >> ~/.bashrc
# >>> WSL optimizations (ongki/dotfiles) >>>

# Clipboard helpers (WSL ↔ Windows)
command -v clip.exe >/dev/null && alias clipout='clip.exe'
command -v powershell.exe >/dev/null && alias clipin='powershell.exe -NoProfile -Command "Get-Clipboard"'

# WSL path conversion
command -v wslpath >/dev/null && {
  alias wpath='wslpath -w'
  alias upath='wslpath -u'
}

# Open in Windows default handler (uses helper if present, else fallback)
if [ -x "$HOME/.local/bin/wsl-open" ]; then
  alias open='wsl-open'
fi
command -v explorer.exe >/dev/null && alias explorer='explorer.exe'

# WSL info shortcut
[ -x "$HOME/.local/bin/wsl-info" ] && alias wsl='wsl-info'

# WSL env: force modern terminal
export TERM="${TERM:-xterm-256color}"
export COLORTERM="${COLORTERM:-truecolor}"
export FORCE_COLOR=1

# Clear noisy Windows env vars (break some Linux tools)
unset NO_PROXY HTTP_PROXY HTTPS_PROXY 2>/dev/null || true

# XDG base dirs
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_CACHE_HOME="$HOME/.cache"

# Forward Windows OpenSSH agent to WSL (common pattern)
if [ -z "${SSH_AUTH_SOCK:-}" ] && [ -S "/mnt/c/Users/${USER}/.ssh/agent.sock" ]; then
  export SSH_AUTH_SOCK="/mnt/c/Users/${USER}/.ssh/agent.sock"
fi

# Distro name (helpful when running multiple distros)
export WSL_DISTRO_NAME
WSL_DISTRO_NAME=$(grep ^NAME /etc/os-release 2>/dev/null | cut -d= -f2 | tr -d '"')

# Quick reload of bashrc
alias reload='source ~/.bashrc && echo "✓ bashrc reloaded"'

# Project dir shortcut
alias proj='cd ~/Projects 2>/dev/null || cd ~/projects 2>/dev/null || echo "~/Projects not found"'

# Shopify CLI shortcut (because it's used a lot)
command -v shopify >/dev/null && alias shopi='shopify'

# Cleanup WSL temp files (frees /tmp space)
wsl-cleanup() {
  find /tmp -maxdepth 1 -type f -atime +1 -delete 2>/dev/null
  find /tmp -maxdepth 1 -type d -empty -mtime +1 -delete 2>/dev/null
  echo "✓ /tmp cleaned"
}

# <<< WSL optimizations (ongki/dotfiles) <<<