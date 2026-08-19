---
name: tokophi-deploy-workflow
description: TokoΦ deploy = Coolify auto-build on merge to origin/main; local main is a stale fork — never push it; monitor deploy via docker image sha on the VPS
metadata: 
  node_type: memory
  type: project
  originSessionId: 4863a141-ddc0-489d-a125-7e699e43b385
  modified: 2026-08-11T19:21:44.656Z
---

TokoΦ (`~/projects/tokophi`) ship path — verified 2026-07-23 by shipping the admin produk read-back + char-limit fix (PR #49, merge `aebd7189d`).

**Local `main` is a STALE FORK — never push it.** It sits ~30 ahead / **276 behind** `origin/main`: it was branched ~2026-07-14 and origin moved on via GitHub PRs (many agent worktrees under `.claude/worktrees/`). Pushing it = rejected, or force = destroys others' merged work. Work built on local main is on a stale base and half of it may already be on origin under different hashes ("duplicate foundation" trap — e.g. `duplicateProduct` + bulk actions were already on origin, better).

**Correct flow:** `git fetch` → new worktree off `origin/main` (`git worktree add .claude/worktrees/<name> -b <branch> origin/main`) → `npm install` in it (deps drift from local; workspace `@tokophi/*` symlinks make reusing local node_modules wrong) → re-apply the change onto origin's current files (don't cherry-pick stale commits) → `npm run build` (the real gate; `next build` runs tsc+lint, passes despite the pre-existing `set-state-in-effect` lint error on the handle-sync effect) → push branch → `gh pr create --base main` → merge → cleanup worktree+branch.

**⚠️ `drizzle-kit generate` can emit a BLOATED migration** (verified 2026-07-23, migration 0071): the meta snapshots drifted (0067–0070 landed on other branches without their cumulative snapshot), so generate diffed schema.ts against a stale snapshot and re-added `landing_pages`/`promo_pages.content`/`stores.email` on top of my two seo columns — a plain `ADD COLUMN` that would FAIL on deploy (already exists). **Fix: trim the `.sql` to only your intended statements**; the regenerated `NNNN_snapshot.json` is the full schema so it also heals the drift. Always read the generated `.sql` before committing. Demo data is added via idempotent INSERT-IF-ABSENT seed scripts (e.g. `seed-products.ts`, `seed-journal.ts`) wired NON-FATAL into the compose migrate chain AFTER `drizzle migrate`; `seed.ts` itself is a NO-OP on a live DB (skips if any store exists), so editing it never adds to prod.

**Deploy = Coolify auto-build on merge to `origin/main`.** VPS <coolify-vps> (Vultr SG), SSH key `~/.ssh/tokophi_dev`, Coolify app uuid `l7r4qaqcml4zigw1dc7iptun`, **Coolify app id `1`**. **Monitor read-only via SSH docker**: the image tag IS the full commit sha (`..._admin:<sha>`); deploy landed when the container flips to the new sha and goes `(healthy)`. Merges are serialised — merge one, watch it land, then the next. See in-repo `specs/docs/DEPLOY.md`.

**Re-verified 2026-08-01 shipping PR #129 (merge `2399ea5`, 7 change sets in one integration branch). Four corrections to the above and to `DEPLOY.md`:**
- **Build is 8–10 min, not ~5** (measured: 8m28s / 9m57s / 7m57s / 8m36s / 8m32s). Two overlapping merges of the same commit took **14m36s and 20m47s**.
- **`~/.coolify_token` DOES NOT EXIST** — that is *why* the API 401s. `DEPLOY.md` claims the file is there. There is no scripted rollback path; rollback = `git revert` + push + webhook ≈ 8–10 min.
- 🔴 **`application_deployment_queues` is SHARED across Coolify apps on this box — Formalin is app id `2`.** Querying it unfiltered (as `DEPLOY.md`'s snippet does) shows *Formalin's* builds as if they were TokoΦ's. **Always `where application_id = '1'`** — it's a `varchar`, so `= 1` errors.
- **Require 4/4 surfaces on the new sha TWICE in a row** — Coolify swaps services one at a time, so a single 4/4 poll can be a false green. `app.`/`rich.` answering **307** is healthy (middleware → `/login`); demanding 200 there is a permanently-red check.

**Worktree trick that removes the `npm install` per worktree:** hardlink node_modules from an existing worktree — `cp -al <src>/node_modules <new>/node_modules` (plus `apps/{admin,landing,storefront}/node_modules`). Near-instant, no disk cost. Deps must be identical (check `git diff --stat <base> origin/main -- package-lock.json`). **Never run `npm install` in a hardlinked worktree** — it corrupts every sibling. Also copy `.env`, `apps/admin/.env.local`, `apps/storefront/.env`; **`apps/super-admin/` has NO `.env.local` on main, which is the only reason `build:super` fails on a clean checkout** (environmental, not a regression).

**Verify a deploy by a signal that must CHANGE, never by a 200 or a green build** — a healthy container ran the previous commit for 2 h on 2026-07-18. Capture falsifiable before/after values (e.g. homepage `<h1>` count, a `?w=` allow-list returning 400→200) plus a DB probe (`POST /api/public/ongkir {"op":"search",…}`).

**Pelajaran 2026-08-12 (insiden slug-rename, storefront down ±9 mnt):**
- ⚠️ **Healthcheck storefront (`wget 127.0.0.1:4327/`) BERGANTUNG pada `STORE_SLUG` resolve** — host numerik jatuh ke fallback env; slug fallback yang tak ada di DB = 404 = unhealthy = Traefik 503 SEMUA host storefront. Rename slug ⇒ env Coolify wajib diganti SEBELUM deploy-nya.
- **Env Coolify bisa diubah tanpa UI** (API token tetap 401; nilai terenkripsi di DB): `docker exec coolify php artisan tinker` → `EnvironmentVariable::find(id)` set `value` + save; buat var baru via `$e->replicate()` + ganti key/value. App tokophi = Application id 1 / uuid `l7r4qaqcml4zigw1dc7iptun`.
- **Hotfix cepat antar-deploy**: file materialized di `/data/coolify/applications/<uuid>/{docker-compose.yaml,.env}` — env tertulis LITERAL di yaml (bukan interpolasi `.env`), edit yaml lalu `docker compose -p <project> --env-file .env up -d <service>`. Ditulis-ulang tiap deploy dari DB Coolify.
- ⚠️ **Monitor kesehatan: grep `"(healthy)"`, JANGAN `"healthy"`** — substring nyangkut di "unhealthy" → false green (kejadian).

Related: [[coolify-vps-dev]] [[tokophi-project]] [[tokophi-market-and-hosting]]

