---
name: git-identity-noreply
description: "Git commit identity must use GitHub noreply email, never the personal gmail"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 117936ff-53de-43f3-b93c-1f84d7c5a627
---

Untuk commit git, SELALU pakai identitas GitHub noreply — jangan pernah email pribadi `<personal-email>`.

- name: `ongkipro`
- email: `82156528+ongkipro@users.noreply.github.com`

Sudah diset global via `git config --global user.name/user.email` (2026-06-30).

**Why:** User tidak mau nama/email pribadi ("irwan"/remuntada) tampil di repo publik.
**How to apply:** Jangan override author/email dengan gmail saat commit. Untuk repo lama yang sudah terlanjur memakai gmail, tawarkan rewrite history (filter-branch env-filter author+committer → noreply) lalu force-push. Lihat juga [[no-ai-commit-trailer]].
