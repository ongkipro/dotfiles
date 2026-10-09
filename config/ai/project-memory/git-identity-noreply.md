---
name: git-identity-noreply
description: Use the user's GitHub noreply commit identity; verify effective configuration and preserve history
metadata:
  node_type: memory
  type: feedback
---

# Git Commit Identity

For the user's repositories, use the GitHub noreply identity selected by the
repository or device configuration. Verify the effective `user.name` and
`user.email` before an authorized commit; do not assume every device uses the
same account or copy one person's address onto another person's machine.

Never substitute a personal email or add AI-attribution trailers; see
[[no-ai-commit-trailer]]. A mistaken historical author does not authorize a
history rewrite. Prefer correct identity for future commits; rewriting history
and force-pushing require explicit approval of the exact operation under
`CORE.md`. Memory does not grant that approval.
