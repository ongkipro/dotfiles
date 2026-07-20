---
name: additive-commits-no-history-rewrite
description: "Commit harus MENAMBAH, tidak menimpa — jangan rewrite history / force-push tanpa diminta eksplisit"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 678a7f8d-f6e5-48ea-a900-2ddb3e7431ff
---

Ongki asked for commits "to add, not overwrite" (2026-07-14). Meaning: commit + merge/fast-forward push. **Do not** `git push --force`, `rebase -i`, `filter-repo`, or `reset --hard` on history that has already been pushed.

**Why:** existing history is treated as a record; overwriting it erases the trail and can collide with another device's work (dotfiles are used across machines, and in TokoΦ work was once lost because of `reset --hard`).

**How to apply:** for dotfiles use `dotpush "message"` — it merges with the remote first, never force. If there's a problem in an old commit (e.g. 73 `volumecms` commits that already used the real gmail email), **fix it going forward** (change the config so the next commits are correct) and report the remaining problem — don't resolve it with a rewrite unless the user asks explicitly.

Commit identity on all devices = `ongkipro <82156528+ongkipro@users.noreply.github.com>`. Never use the real email (`get@ongki.pro`, `ongkiardiansyah@gmail.com`) in git config. Related: [[prefer-git-worktree]].
