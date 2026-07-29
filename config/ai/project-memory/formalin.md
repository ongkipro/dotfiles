---
name: formalin
description: "Formalin — VolumX engine monorepo (ID direct-response commerce); canonical repo is irwansyah10/formalin, NOT ongkipro"
metadata:
  node_type: memory
  type: project
  originSessionId: d1bb94a0-db9b-4064-98b0-6761b1204808
  modified: 2026-07-25T03:57:43.527Z
---

Formalin — VolumX engine monorepo (Indonesian direct-response commerce). Checked out at `~/Projects/formalin` (since 2026-07-24).

- **Canonical repository:** `irwansyah10/formalin`; the verified `origin` points there. `ongkipro/formalin` is a docs-only ancestor.
- **Verified active branch:** `run-001-monorepo`, tracking `origin/run-001-monorepo`.
- The Markdown specification set is foundational project history. Do not overwrite it outside Git history.
- Current implementation truth lives in `docs/STATUS.md`; roadmap or backlog claims from older reference builds are not runtime proof.
- The project uses a pnpm/Turborepo monorepo and local PostgreSQL. Detect secret files, but never read or copy their contents into prompts or memory.
- Production infrastructure, addresses, SSH recovery, and credential-rotation details are device-local operational data. Read the repository runbook and `~/.config/ai-local/` when authorized instead of storing them here.
- Development also happens on another machine. Pull and inspect the branch before editing.
