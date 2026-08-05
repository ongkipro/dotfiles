---
name: formalin
description: "Formalin — VolumX engine monorepo (ID direct-response commerce); canonical repo is irwansyah10/formalin, NOT ongkipro"
metadata:
  node_type: memory
  type: project
  originSessionId: d1bb94a0-db9b-4064-98b0-6761b1204808
  modified: 2026-08-01T06:21:41.898Z
---

Formalin — VolumX engine monorepo (Indonesian direct-response commerce). Checked out at `~/Projects/formalin` (since 2026-07-24).

- **Canonical repository:** `irwansyah10/formalin`; the verified `origin` points there. `ongkipro/formalin` is a docs-only ancestor.
- **Verified active branch:** `run-001-monorepo`, tracking `origin/run-001-monorepo`.
- The Markdown specification set is foundational project history. Do not overwrite it outside Git history.
- Current implementation truth lives in `docs/STATUS.md`; roadmap or backlog claims from older reference builds are not runtime proof.
- The project uses a pnpm/Turborepo monorepo and local PostgreSQL. Detect secret files, but never read or copy their contents into prompts or memory.
- Production infrastructure, addresses, SSH recovery, and credential-rotation details are device-local operational data. Read the repository runbook and `~/.config/ai-local/` when authorized instead of storing them here.
- Development also happens on another machine. Pull and inspect the branch before editing.

**Deployment (2026-08-01): the branch that runs in production is `recover/production-snapshot`, not `main`.**

The code serving `formalin.store` had never been committed — it existed only as an rsynced
directory at `/opt/formalin` on the VPS, and no branch in either GitHub remote contained it
(both stopped at migration `0012_domain_tables`, production ran through `0024_offer_images`).
It is now committed as `recover/production-snapshot`.

Why this still matters when picking a branch to work from:

- `main` is **not** deployable as-is — it carries two migrations numbered `0011` and two
  numbered `0012`, residue of a merge between the two lines. `recover/production-snapshot`
  has one of each and matches the live database ledger exactly.
- Reconciling `main` with the production line is open work, and nobody has done it.

Formalin now runs as a Coolify Docker Compose resource on the shared VPS, configured the same
way as TokoΦ (`build_pack=dockercompose`, `/docker-compose.coolify.yml`, auto-deploy on) — so
a push to `recover/production-snapshot` deploys. The migration write-up, including three
deployment defects that only surfaced by deploying, is in the repo at
`docs/PRD_COOLIFY_MIGRATION.md`. Read that before touching the deployment.
