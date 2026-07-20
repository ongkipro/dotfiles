---
name: prefer-git-worktree
description: "User minta biasakan pakai git worktree untuk kerja di repo, bukan checkout/commit langsung di branch default"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d80df881-dc15-46ed-8d1a-e20e2834efbf
---

For non-trivial work in any repo, create a separate **git worktree**; don't `git checkout` back and forth or commit directly on `main` in the primary working tree.

**Why:** the user works across devices with a single GitHub account, and often has several flows running at once (see [[skill-plumbing]], [[tokophi]] — the Linux machine pushes while the Mac is working). Worktrees keep `main` clean and always `pull`-able, isolate each flow in its own directory, and avoid sudden stash/rebase when a context switch is needed.

**How to apply:**
- Create: `git -C <repo> worktree add ../<repo>-<topic> -b <branch>` (or `EnterWorktree` in Claude Code).
- For subagents that modify files in parallel, use `isolation: "worktree"` on the Agent tool.
- Done & merged: `git worktree remove <path>`, then `git worktree prune`.
- Check active ones: `git worktree list`.

The limit (confirmed by the user 2026-07-10: "git worktree for work"): worktrees are for **development work** — features, refactors, bug fixes, large changes. Not for small maintenance commits like updating memory in `~/.config/ai/memory/` or adding a single skill in `~/dotfiles`; those go directly on `main` because `main` is precisely the cross-device sync branch.
