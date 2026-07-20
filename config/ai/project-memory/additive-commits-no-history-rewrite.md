---
name: additive-commits-no-history-rewrite
description: "Commit harus MENAMBAH, tidak menimpa — jangan rewrite history / force-push tanpa diminta eksplisit"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 678a7f8d-f6e5-48ea-a900-2ddb3e7431ff
---

Ongki minta commit "untuk menambahkan, bukan menimpa" (2026-07-14). Artinya: commit + merge/fast-forward push. **Jangan** `git push --force`, `rebase -i`, `filter-repo`, atau `reset --hard` pada history yang sudah di-push.

**Why:** history yang sudah ada dianggap catatan; menimpanya menghapus jejak dan bisa menabrak kerja device lain (dotfiles dipakai lintas mesin, dan di TokoΦ pernah ada kerja hilang gara-gara `reset --hard`).

**How to apply:** untuk dotfiles pakai `dotpush "pesan"` — dia merge dengan remote dulu, tidak pernah force. Kalau ada masalah di commit lama (mis. 73 commit `volumecms` terlanjur memakai email gmail asli), **perbaiki maju ke depan** (ubah config supaya commit berikutnya benar) dan laporkan sisa masalahnya — jangan bereskan dengan rewrite kecuali user minta eksplisit.

Identitas commit di semua device = `ongkipro <82156528+ongkipro@users.noreply.github.com>`. Jangan pernah pakai email asli (`get@ongki.pro`, `ongkiardiansyah@gmail.com`) di config git. Terkait [[prefer-git-worktree]].
