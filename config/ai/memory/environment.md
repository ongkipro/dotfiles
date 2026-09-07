# Memory: Environment — toolchain & install
> Part of shared memory. Update if a tool/setup changes.
> **MULTI-MACHINE — OS-specific facts MUST name the machine. Check `uname -a` first.**
> `devices/` is the generated registry and outranks this list; if a machine is
> registered there but missing here, `devices/` wins.
> - Linux (laptop): hostname **`cuan`** — ThinkPad T480, Ubuntu 26.04, kernel 7.0.0. Old nickname in memory = "fantastico" (the SAME machine).
> - Linux (desktop): hostname **`rich`** — Dell OptiPlex 7050, Ubuntu 24.04.4 LTS, kernel 7.0.0. Registered 2026-08-15.
> - Mac (secondary): hostname **`feris-MacBook-Air`** — MacBook Air M1 8GB, macOS 26.5.1 arm64. This is the same `MacBookAir10,1` previously registered as **`ongkis-MacBook-Air`**; the generated `devices/` registry records both names and is authoritative for current device facts.
> `brew` instructions = MAC ONLY. On `cuan` and `rich` use mise/apt.

## Installed tools (DO NOT reinstall)
- mise (no-sudo), per `config/mise-config.toml`: fzf, fd, bat, delta, lazygit, zoxide, eza, yq(v4), ruff, starship, helix, tealdeer, direnv, qsv, gh, jq, node.
- ripgrep and jq are declared in `config/mise-config.toml`. Use `mise install`
  to provision them and `mise ls --missing` to detect local gaps. Verify `rg` in
  a clean shell; AI runtimes may inject their own binary into PATH.
- Editor: helix (`hx`). `EDITOR=hx`.
- npm -g: pi, pnpm, typescript-language-server, vscode-langservers-extracted, @tailwindcss/language-server, yaml-language-server, bash-language-server, pyright.
- Native OMP binary at `~/.local/bin/omp`; resolve the current version with
  `omp --version` because runtime versions are machine-local and change faster
  than shared memory.
- pipx: python-lsp-server (pylsp).
- Homebrew (system): gh, tmux, pnpm, chromium, pipx.
- Browser: Chromium (`brew install chromium`), Google Chrome.
- Git + delta diff pager + `~/.gitignore_global`.

## tmux (mandatory part of the dotfiles bootstrap)
- The full tmux setup is handled by `bin/tmux-setup` (idempotent, cross-platform): installs the binary (apt/dnf/pacman/zypper on Linux, brew on macOS) + a clipboard tool (wl-clipboard/xclip on Linux; built-in pbcopy on macOS) + links `~/.tmux.conf`, `~/.local/bin/tmux-clip`, and `~/.local/bin/tmux-battery` + clones TPM + installs/cleans plugins.
- Called automatically from `install.sh` and `install-macos.sh`. Can also be run manually: `tmux-setup`.
- Prefix `Ctrl+a`. Theme: plain-font friendly Catppuccin-inspired palette (no Nerd Font dependency). Plugins: tmux-sensible, tmux-yank, resurrect, continuum, prefix-highlight, tmux-open. Clipboard via `bin/tmux-clip`, battery/status helper via `bin/tmux-battery`. Reload: prefix+r. Update plugins: prefix+U / install new plugin: prefix+I. Save session: prefix+S. Restore: prefix+R.

## How to install (when sudo)
- CLI / runtime → `mise use -g <name>` (no sudo); update `mise up`; remove `mise rm <name>`.
- Node tools → `npm i -g <package>`. Python apps → `pipx install <package>`.
- System tools → `brew install <name>`. GUI apps → `brew install --cask <name>`.
- `sudo` ONLY for system files (rarely needed on macOS).

## Detailed references

This index keeps the cross-machine baseline small. Load only the subject that matches the request:

- [OMP, 9Router, Pi, and Antigravity runtimes](environment-ai-runtimes.md)
- [Device registry, multi-machine constraints, and Git identity](environment-devices-git.md)
- [Dated TokoΦ Vultr and Coolify infrastructure record](../project-memory/tokophi-infrastructure-2026-07.md)

Machine-local runtime, login, service, and checkout state must still be checked on the relevant device. Repository files and `devices/` outrank this advisory memory.
