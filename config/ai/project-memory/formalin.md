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
- **Canonical development base:** current `origin/main`; always fetch before branching.
- The Markdown specification set is foundational project history. Do not overwrite it outside Git history.
- Current implementation truth lives in `docs/STATUS.md`; roadmap or backlog claims from older reference builds are not runtime proof.
- The project uses a pnpm/Turborepo monorepo and local PostgreSQL. Detect secret files, but never read or copy their contents into prompts or memory.
- Production infrastructure, addresses, SSH recovery, and credential-rotation details are device-local operational data. Read the repository runbook and `~/.config/ai-local/` when authorized instead of storing them here.
- Development also happens on another machine. Pull and inspect the branch before editing.

## Deployment authority (verified 2026-08-05)

- Production runs canonical `main` through Coolify resource `formalin`; reviewed source changes
  merged to `main` are the only intended deploy path.
- PR #21 reconciled the recovered production lineage and merged as `5b3178f`; CI run
  `30994102722` passed. Coolify deployment `pu1squ9pfvx9y5o6k72ncrn8` finished with all seven
  services healthy, clean migration readiness, and authenticated merchant/platform smoke checks.
- The docs-only final handoff merged as `875e6a4` and correctly triggered no deployment.
- `recover/production-snapshot` is historical rollback evidence, not a development base.
- PR #18 and PR #20 are closed as superseded. Do not revive their branches.
- Applied migrations `0000` through `0024` are immutable; new schema work starts at `0025+`.
- The retired `/opt/formalin` rsync/raw-Compose path must never be recreated.
