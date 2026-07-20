---
name: prefer-git-worktree
description: "User minta biasakan pakai git worktree untuk kerja di repo, bukan checkout/commit langsung di branch default"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d80df881-dc15-46ed-8d1a-e20e2834efbf
---

Untuk kerja non-trivial di repo mana pun, buat **git worktree** terpisah, jangan `git checkout` bolak-balik atau commit langsung di `main` pada working tree utama.

**Why:** user kerja lintas-device dengan satu akun GitHub dan sering ada beberapa alur jalan bersamaan (lihat [[skill-plumbing]], [[tokophi]] — mesin Linux push sementara Mac sedang kerja). Worktree menjaga `main` tetap bersih dan bisa di-`pull` kapan saja, memisahkan tiap alur di direktori sendiri, dan menghindari stash/rebase dadakan saat harus pindah konteks.

**How to apply:**
- Bikin: `git -C <repo> worktree add ../<repo>-<topik> -b <branch>` (atau `EnterWorktree` di Claude Code).
- Untuk subagent yang mengubah file secara paralel, pakai `isolation: "worktree"` pada tool Agent.
- Selesai & sudah di-merge: `git worktree remove <path>`, lalu `git worktree prune`.
- Cek yang aktif: `git worktree list`.

Batasnya (dikonfirmasi user 2026-07-10: "git worktree buat kerja"): worktree dipakai untuk **kerja pengembangan** — fitur, refactor, perbaikan bug, perubahan besar. Bukan untuk commit kecil pemeliharaan seperti update memory di `~/.config/ai/memory/` atau menambah satu skill di `~/dotfiles`; itu langsung di `main` karena `main` memang branch sinkronisasi antar-device.
