---
name: project-dotfiles-memory-sync
description: Kelola project memory now lives in ~/dotfiles (ongkipro/dotfiles) via symlink; kelola workflow overrides vs global AGENTS.md
metadata: 
  node_type: memory
  type: project
  originSessionId: f09d2e22-b31f-48f7-af93-0147234c611a
  modified: 2026-07-29T05:50:21.219Z
---

Since 2026-07-29 this project-memory directory is a **symlink into the dotfiles repo**: `~/.claude/projects/-Users-irwansyah-my-app-Kelola-Hris---Manajemen-Kerja-kelola/memory` → `~/dotfiles/config/ai/project-memory-kelola/`. The repo (`github.com/ongkipro/dotfiles`, private; account `irwansyah10` has push access) is the cross-device source of truth. Sync = `dotsync sync` (commit) + push after user approval; on other devices `git pull` + the per-project link block in `bin/ai-memory-link`. Deep durable deploy knowledge was ALSO distilled into skill `kelola-deploy` (`~/dotfiles/skills/local/kelola-deploy/SKILL.md`) so codex/pi/agy can read it too — point-in-time state stays here in memory.

**Why:** user asked (2026-07-29) to combine Kelola skills+memory with the ongkipro/dotfiles "backup brain" system so every device and AI CLI shares it.

**How to apply:**
- Edits to memory files here land in the dotfiles working tree — commit them via `dotsync` (never push silently; ask first, per [[reference-deploy]]-style standing rules in the dotfiles docs).
- **Workflow override vs global `~/.claude/CLAUDE.md` (dotfiles AGENTS.md):** the global file says "never auto-commit". In the **kelola repo that rule does NOT apply** — the user gave standing approval to commit + push to main, and push auto-deploys via GH Actions ([[feedback-auto-deploy]]). Kelola conversation language is Indonesian, and memory files here may stay Indonesian (the English-only rule covers dotfiles' own memory/skills).
- Never write secrets into this memory — it is now a git-synced repo.
