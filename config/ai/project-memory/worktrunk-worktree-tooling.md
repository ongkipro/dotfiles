---
name: worktrunk-worktree-tooling
description: "worktrunk (`wt`) is the worktree tooling on the Mac — the agy plugin needs the brew binary, not just the plugin"
metadata: 
  node_type: memory
  type: project
  originSessionId: ef4c798a-d351-4318-8a07-3088786a86d4
---

The tooling behind the [[prefer-git-worktree]] habit is now **worktrunk** (`wt`, v0.67.0 via Homebrew).

**Why:** the `worktrunk` plugin in `agy` ships only a skill plus a hook — and that hook calls a `wt` binary that is NOT installed alongside it. Installing the plugin on its own means the hook errors the moment it runs. That is what made the first attempt fail and led to it being uninstalled.

**How to apply:** install the binary first, then the plugin.

    brew install worktrunk
    wt config shell install zsh     # interactive (y/N) — pipe `y` when non-TTY
    agy plugin install https://github.com/max-sixty/worktrunk

The shell integration writes one line into `~/.zshrc` (`eval "$(command wt config shell init zsh)"`). It is required — without it `wt switch` cannot change the parent shell's directory.

Core subcommands: `wt switch` (create and switch to a worktree in one step), `list`, `remove` (removes the worktree, and the branch once merged), `merge`.
