---
name: tokophi
description: "TokoΦ commerce SaaS — repo di ~/Projects/tokophi, dokumentasi .md di-symlink ke ~/Documents/work/tokophi"
metadata: 
  node_type: memory
  type: project
  originSessionId: d80df881-dc15-46ed-8d1a-e20e2834efbf
---

TokoΦ (`ongkipro/tokophi`, private) — Shopify-style commerce SaaS for Indonesia. Monorepo: `apps/{admin,super-admin,storefront}`, `packages/{db,data,lib,ui,sections}`, `specs/`.

This project's old name was `indostore`; rebranded 2026-07-08. The repo `ongkipro/indostore` **still exists on GitHub but is dormant** — don't use it, don't push to it. All 94 of its commits are already contained in the `tokophi` history (old HEAD `e95b71f`). If you read an old note mentioning "Indostore", that's the same project, not a separate one.

The repository may not exist on every device. Inspect local disk and Git before acting; do not infer clone state, branch freshness, or deployment status from this reference memory. Git-tracked `.md` files may be **symlinked** (not copied) into `~/Documents/work/tokophi/` with the structure `prd/`, `architecture/`, `decisions/`, `ops/`, `notes/`, `agent-config/` when the repo is present.

**Business/ops gotchas that are NOT readable from the code** (moved from `projects.md` 2026-07-20):
- **KiriminAja** (shipping) + **AutoLaris** (payment VA/QRIS) integration — platform-managed & **white-label**: the provider brand is hidden from the client, only the super-admin sees it. COD exists.
- **`KIRIMINAJA_ENV` defaults to `sandbox`** (`tdev.kiriminaja.com`) — an unset env silently talks to sandbox; real rates but not production. This is the last step before real money.
- **E-wallet (OVO/GoPay/DANA/ShopeePay/LinkAja) + retail are DEAD because AutoLaris rejects them** (`rc=07` on a direct probe), not a bug. Only 6 channels are live: QRIS + 5 VA (BCA/Mandiri/BNI/BRI/Permata). Turning them on = a buyer picks an uncharged method → the sale dies at the final step; enabling them is a matter for AutoLaris, not the code.
- **`npm run audit:responsive -w @tokophi/storefront`** = the responsive gate (10 routes × 11 widths 320→1920). Run it before claiming "responsive".
- **Multiple agents in one worktree = lost work** (lost twice already). Read the repo `AGENTS.md` before coding: don't `pkill astro/next` (it kills another agent's server), don't `git add -A` (use an explicit pathspec), commit as often as possible.

**Why:** those .md files are part of the repo — moving them out would break the repo. Symlinks keep `~/Documents` tidy without a duplicate that can go stale.

**How to apply:** editing via either path is the same — they're the same file. Don't "tidy up" `~/Documents/work/tokophi` by deleting/overwriting; that touches repo files. When a new `.md` is added in the repo, its symlink needs to be created manually.

Current implementation, deployment, infrastructure, and migration status belong in the repository and live systems, not here. Read the repository's `AGENTS.md`, status documents, and disk state before working. See also [[kamus-almanak]].

Operational findings measured on 2026-08-05, including Coolify access behavior, environment parity,
Compose validation constraints, and local mirror details, are device-specific. Read
`~/.config/ai-local/tokophi-access.md` and `~/.config/ai-local/coolify-local.md` on the relevant machine.
