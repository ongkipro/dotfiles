---
name: tokophi-deploy-workflow
description: TokoΦ ship path — PR to origin/main, then a manual Coolify deploy on the dedicated host (since 2026-11-01); worktree, migration and deploy-verification lessons
metadata: 
  node_type: memory
  type: project
  originSessionId: 4863a141-ddc0-489d-a125-7e699e43b385
  modified: 2026-08-11T19:21:44.656Z
---

TokoΦ (`~/Projects/tokophi`) ship path — first proven by shipping the admin produk read-back + char-limit fix (PR #49, merge `aebd7189d`).

**Local `main` was reconciled with `origin/main` on 2026-08-22** (merge `1b0988b`); the old "~30 ahead / 276 behind stale fork" state no longer holds — re-check with `git rev-list --left-right --count main...origin/main` before trusting any claim here. Still **do not push `main` directly**: origin/main only advances through GitHub PRs, and local `main` carries unpushed doc merges. The "duplicate foundation" trap remains real — before re-applying local work, check whether origin already has it under different hashes (e.g. `duplicateProduct` + bulk actions were already on origin, better).

**Correct flow:** `git fetch` → new worktree off `origin/main` (`git worktree add .claude/worktrees/<name> -b <branch> origin/main`) → `npm install` in it (deps drift from local; workspace `@tokophi/*` symlinks make reusing local node_modules wrong) → re-apply the change onto origin's current files (don't cherry-pick stale commits) → `npm run build` (the real gate; `next build` runs tsc+lint, passes despite the pre-existing `set-state-in-effect` lint error on the handle-sync effect) → push branch → `gh pr create --base main` → merge → cleanup worktree+branch.

**⚠️ `drizzle-kit generate` can emit a BLOATED migration** (observed in migration 0071): the meta snapshots drifted (0067–0070 landed on other branches without their cumulative snapshot), so generate diffed schema.ts against a stale snapshot and re-added `landing_pages`/`promo_pages.content`/`stores.email` on top of my two seo columns — a plain `ADD COLUMN` that would FAIL on deploy (already exists). **Fix: trim the `.sql` to only your intended statements**; the regenerated `NNNN_snapshot.json` is the full schema so it also heals the drift. Always read the generated `.sql` before committing. Demo data is added via idempotent INSERT-IF-ABSENT seed scripts (e.g. `seed-products.ts`, `seed-journal.ts`) wired NON-FATAL into the compose migrate chain AFTER `drizzle migrate`; `seed.ts` itself is a NO-OP on a live DB (skips if any store exists), so editing it never adds to prod.

**Deploy (current since 2026-11-01): manual, on the dedicated TokoΦ host.** Merging to `origin/main` no longer deploys by itself: Cloudflare Access in front of the dashboard blocks the GitHub webhook. After merge, trigger `tokophi-coolify "/api/v1/deploy?uuid=<app-uuid>" -X POST` and poll `/api/v1/deployments/<deployment-uuid>`. Host, app UUID, SSH aliases and Postgres access: `~/.config/ai-local/tokophi-access.md` § Dedicated TokoPhi VPS; fleet overview `~/.config/ai-local/fleet-inventory.md`. The in-repo `specs/docs/DEPLOY.md` on `tokophi-dev` may still describe the retired host; the cutover record is `specs/docs/tasks/2026-11-01-dedicated-vps-bootstrap.md`.

**Still valid from the old host (re-verify on the new one):**
- **Build is 8–10 min, not ~5.** Two overlapping deploys of the same commit took 14–20 min; deploy one change, watch it land, then the next.
- Monitor read-only via SSH docker: the image tag is the full commit sha; a deploy landed when the container flips to the new sha and is `(healthy)`.

**History (retired host `volumdev`, before 2026-10-28; do not act on):** auto-build on merge, app id `1`, a revoked `COOLIFY_TOKEN`, `ssh tokophi-vps`, `~/.vultr-cli.yaml` and the `dotfiles-vultr` account are all gone.
- `application_deployment_queues` is shared by every app on a Coolify box: always filter by `application_id` (a `varchar`, so quote it).
- **Require 4/4 surfaces on the new sha TWICE in a row** — Coolify swaps services one at a time, so a single 4/4 poll can be a false green. `app.`/`rich.` answering **307** is healthy (middleware → `/login`); demanding 200 there is a permanently-red check.

**Worktree trick that removes the `npm install` per worktree:** hardlink node_modules from an existing worktree — `cp -al <src>/node_modules <new>/node_modules` (plus `apps/{admin,landing,storefront}/node_modules`). Near-instant, no disk cost. Deps must be identical (check `git diff --stat <base> origin/main -- package-lock.json`). **Never run `npm install` in a hardlinked worktree** — it corrupts every sibling. Also copy `.env`, `apps/admin/.env.local`, `apps/storefront/.env`; **`apps/super-admin/` has NO `.env.local` on main, which is the only reason `build:super` fails on a clean checkout** (environmental, not a regression).

**Verify a deploy by a signal that must CHANGE, never by a 200 or a green build** — a healthy container ran the previous commit for 2 h on 2026-07-18. Capture falsifiable before/after values (e.g. homepage `<h1>` count, a `?w=` allow-list returning 400→200) plus a DB probe (`POST /api/public/ongkir {"op":"search",…}`).

**Pelajaran 2026-08-12 (insiden slug-rename, storefront down ±9 mnt):**
- ⚠️ **Healthcheck storefront (`wget 127.0.0.1:4327/`) BERGANTUNG pada `STORE_SLUG` resolve** — host numerik jatuh ke fallback env; slug fallback yang tak ada di DB = 404 = unhealthy = Traefik 503 SEMUA host storefront. Rename slug ⇒ env Coolify wajib diganti SEBELUM deploy-nya.
- **Env Coolify**: utamakan API `PATCH /api/v1/applications/<uuid>/envs` (token jalan di host baru). Jalur darurat tanpa API: `docker exec coolify php artisan tinker` → `EnvironmentVariable::find(id)` set `value` + save.
- **Hotfix cepat antar-deploy**: file materialized di `/data/coolify/applications/<uuid>/{docker-compose.yaml,.env}` — env tertulis LITERAL di yaml (bukan interpolasi `.env`), edit yaml lalu `docker compose -p <project> --env-file .env up -d <service>`. Ditulis-ulang tiap deploy dari DB Coolify.
- ⚠️ **Monitor kesehatan: grep `"(healthy)"`, JANGAN `"healthy"`** — substring nyangkut di "unhealthy" → false green (kejadian).

Related: [[coolify-vps-dev]] [[tokophi-project]] [[tokophi-market-and-hosting]]

