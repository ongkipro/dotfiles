---
name: deploy-collision-recovery
description: Parallel deploys (SSH + GH Actions) into the same server directory corrupt node_modules → backend 502; how to recover
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8f2da746-5aac-4aba-81b9-623041dc8131
  modified: 2026-07-29T05:50:06.644Z
---

deploy.sh runs in one fixed directory (`~/kelola`). If TWO deploys run at the same time — a manual SSH deploy plus the GH Actions auto-deploy, or two agent sessions — both `npm ci` runs overwrite each other's `node_modules`, producing `ENOTEMPTY rmdir` / `TAR_ENTRY_ERROR ENOENT` errors and corrupting the npm cache (`~/.npm/_cacache`) as well. Worst case: the backend crash-loops with `ERR_MODULE_NOT_FOUND: node_modules/.bin/tsx` → PM2 shows "online" but `/api` returns **502** (the web app still returns 200, so it looks like only the API is down).

**Another signature (corrupt web/next, 2026-06-04):** `web/node_modules/next` gets corrupted too → `next build` fails with **`FATAL: TurbopackInternalError: Expected contexts directory to be a directory, found: node_modules/next/dist/server/route-modules/pages/vendored/contexts`**. The GH deploy keeps failing even though `npm ci` reports "up to date in 4s" (npm believes it is in sync while the contents are broken). Server-side symptom: `pm2 list` shows `kelola-web` and `kelola-backend` **crash-looping** (↺ in the thousands, uptime in seconds) — yet the web app still returns 200 because it is serving the OLD build (pm2 reload only runs after a successful build). Fix: force-remove `web/node_modules` and `web/.next`, then do a clean reinstall (npm's "up to date" will never repair this on its own).

**Why:** happened on 2026-06-02 — back-to-back pushes from parallel sessions triggered several GH deploys that cancelled each other while a manual SSH deploy collided with them. Disk and inodes were fine (not the cause); the root cause was concurrency plus a corrupted npm cache.

**How to apply:**
- DO NOT run a manual SSH `deploy.sh` when GH Actions might also be deploying. Check first: `gh run list --workflow=deploy.yml --limit 3` (nothing `in_progress`) AND, on the server, `pgrep -af "deploy.sh|npm ci|next build"` returns nothing.
- Recovery when node_modules is corrupted (502 / tsx not found / Turbopack contexts error) must be done while NO other process is running. **DO NOT `pm2 stop all`** — the server also runs `simantep` and `tatacuan-bot`, which are NOT in kelola's `ecosystem.config.cjs`, so deploy.sh will not bring them back up. Stop ONLY kelola:
  `pm2 stop kelola-web kelola-backend; rm -rf ~/kelola/backend/node_modules ~/kelola/web/node_modules ~/kelola/web/.next; cd ~/kelola && bash deploy.sh`
  (do not touch `~/.npm/_cacache` unless you actually see a `_cacache/content-v2` error — a half-finished `npm cache clean --force` causes ENOENT instead. See [[reference_deploy]].)
- Verify recovery: `curl localhost:3101/health` (must return `{ok:true}`) plus `curl -o/dev/null -w "%{http_code}" https://kelolatim.com/api/public/site-verification` (must be 200, not 502). (The old domain kelola.simantep.id now 301-redirects to kelolatim.com — do not use it for verification.)
- Because the deploy does `git reset --hard origin/main`, ANY successful deploy ships every commit on main — so our fix goes out as soon as one deploy turns green. See [[feedback_auto_deploy]].
