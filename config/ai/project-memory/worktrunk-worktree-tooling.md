---
name: worktrunk-worktree-tooling
description: "worktrunk (`wt`) adalah tooling worktree di Mac — plugin agy butuh binary brew, bukan cuma plugin"
metadata: 
  node_type: memory
  type: project
  originSessionId: ef4c798a-d351-4318-8a07-3088786a86d4
---

Tooling untuk kebiasaan [[prefer-git-worktree]] sekarang adalah **worktrunk** (`wt`, v0.67.0 via Homebrew).

**Why:** plugin `worktrunk` di `agy` hanya membawa skill + hook — hook-nya memanggil binary `wt` yang TIDAK ikut terpasang. Install plugin saja = hook error saat dipakai. Ini yang bikin percobaan pertama gagal dan sempat di-uninstall.

**How to apply:** pasang binary dulu, baru plugin.

    brew install worktrunk
    wt config shell install zsh     # interaktif (y/N) — pipe `y` kalau non-TTY
    agy plugin install https://github.com/max-sixty/worktrunk

Integrasi shell menulis satu baris ke `~/.zshrc` (`eval "$(command wt config shell init zsh)"`). Wajib — tanpa itu `wt switch` tidak bisa memindahkan direktori shell induk.

Subcommand inti: `wt switch` (bikin/pindah worktree sekaligus), `list`, `remove` (hapus worktree + branch kalau sudah merged), `merge`.
