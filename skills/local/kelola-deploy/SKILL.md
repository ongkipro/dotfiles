---
name: kelola-deploy
description: Deploy, verify, and recover the Kelola HRIS production server (kelolatim.com). Not new VPS provisioning (vultr), generic VPS setup (vps-deploy), or Vercel (vercel). Automatically use when working in the kelola repo on anything touching deploy, CI, PM2, nginx, the production VPS, a 500/502 after deploy, ChunkLoadError, node_modules corruption, or Indonesian phrases like deploy kelola, servernya error, web nya down, gak bisa login, disk penuh.
---

# Kelola — Production Deploy & Recovery Runbook

Kelola HRIS (repo `kelola`) is a private Next.js web and Hono backend deployment on one VPS. There is no public canonical upstream for this runbook. It was distilled from internal incidents in June-July 2026; incident explanations are historical operational evidence, not permanent platform facts.

At the start of every deploy or recovery, inspect the current `kelola` repository's `.github/workflows/deploy.yml`, `deploy.sh`, `ecosystem.config.cjs`, and package scripts, then compare them with live PM2/nginx state. Current repository configuration and observed host output override this file. Keep point-in-time backup tables, disk figures, credentials, and account data in approved private operational storage, not here.

## Approval gate

Everything below acts on production. Read-only checks (`gh run list`, `curl`, `pm2 show`, `pgrep`, `df`, `du`) are fine; a manual `deploy.sh`, any `rm -rf`, `git reset --hard`/`git switch` on the server, `pm2 stop/restart`, `sudo journalctl --vacuum-*`, or `.env` edits need the user's explicit approval for that step. Never print `backend/.env` contents.

## Architecture

- Server `irwansyah10@103.93.161.104`, dir `~/kelola`. Nginx in front. (For new VPS server provisioning or cloud instance management, use `vultr`).
- PM2: `kelola-web` (Next.js :3100), `kelola-backend` (Hono :3101).
  The server ALSO runs `simantep` + `tatacuan-bot` — **never `pm2 stop all`**
  (they are outside kelola's `ecosystem.config.cjs`, deploy.sh won't restart them).
- Domain: **`https://kelolatim.com`** (old `kelola.simantep.id` 301-redirects — never
  use it for health checks). Backend env: `~/kelola/backend/.env` (not in git);
  `BETTER_AUTH_URL` must equal the live domain or Google OAuth login breaks.
- Uploads live on a separate volume mounted at `/data`, symlinked from
  `backend/uploads` (video uploads are large and grow fast).

## Golden rule: push = deploy

`git push origin main` triggers `.github/workflows/deploy.yml` on a self-hosted
runner that IS the prod server, running `deploy.sh` (git reset --hard origin/main →
npm ci ×2 → db:migrate → next build with web stopped + chunk verification →
pm2 startOrReload). **Do NOT also run a manual SSH deploy** — a second concurrent
deploy is how node_modules gets corrupted.

- Concurrency guard: `deploy.yml` should declare a workflow-level `concurrency` group with `cancel-in-progress: false` — cancelling a running deploy mid-`npm ci` is itself a corruption path. By default GitHub keeps only the newest pending run in a group (older pending runs are cancelled), which matches "one green run ships all commits". Check the live file; it does not stop a manual SSH `deploy.sh`, so the rule below still applies. Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency (accessed 2026-10-02).
- The self-hosted runner is persistent and runs as the prod user: keep the repo private, never let fork/PR workflows target that runner label, and treat any workflow change as a production change. GitHub: self-hosted runners "can be persistently compromised by untrusted code in a workflow". Source: https://docs.github.com/en/actions/reference/security/secure-use#hardening-for-self-hosted-runners (accessed 2026-10-02).
- Watch: `gh run list --workflow=deploy.yml --limit 3`, or on the server
  `pgrep -af "next build|deploy.sh"` (empty = done).
- The site 500s briefly DURING the build window — wait for CI before diagnosing.
- Manual deploy only when not pushing (stuck run): `ssh irwansyah10@103.93.161.104 'cd ~/kelola && bash deploy.sh'`
  — only after confirming no CI deploy is in progress.
- Verify healthy: `https://kelolatim.com/` and `/sign-in` return 200;
  backend `curl localhost:3101/health` → `{ok:true}`.

## Required Post-Deploy Smoke Check

Run these checks only after the CI deploy has finished:

1. `curl -fsS -o /dev/null -w '%{http_code}\n' https://kelolatim.com/` returns `200`.
2. `curl -fsS -o /dev/null -w '%{http_code}\n' https://kelolatim.com/sign-in` returns `200`.
3. On the server, `curl -fsS localhost:3101/health` returns the repository's current healthy response (historically `{ok:true}`).
4. `pm2 show kelola-web` and `pm2 show kelola-backend` show the expected revision running without a new restart loop.

Record the CI run/revision and observed results. A green workflow alone is not proof that the public routes and backend are healthy.

## Failure modes → recovery

| Symptom | Cause | Fix |
|---|---|---|
| `npm ci` fails once (ETXTBSY, sqlite3 make error) | transient / OOM | just re-run deploy (1–2×) |
| `/api` 502, web still 200, PM2 ↺ thousands | corrupted `node_modules` (parallel deploys) | `pm2 stop kelola-web kelola-backend; rm -rf ~/kelola/{backend,web}/node_modules ~/kelola/web/.next; cd ~/kelola && bash deploy.sh` |
| `TurbopackInternalError ... vendored/contexts`, `npm ci` says "up to date" | `web/node_modules/next` corrupted | same clean reinstall — npm will not self-heal |
| every route 500, `.next/server/middleware-manifest.json` missing | build raced running web (old deploy.sh) | `pm2 stop kelola-web; cd ~/kelola/web && rm -rf .next && npm run build && pm2 startOrReload ~/kelola/ecosystem.config.cjs` |
| ChunkLoadError / one chunk 500s | Turbopack cache/output desync | as above but also `rm -rf node_modules/.cache` |
| `ENOTEMPTY rmdir node_modules/...` during npm ci | crash-looping pm2 process holds handles | stop the two kelola apps first, then reinstall |
| `ENOENT ..._cacache/content-v2...` | half-cleaned npm cache | `rm -rf ~/.npm/_cacache` fully, then reinstall (never `npm cache clean --force` mid-recovery) |
| deploy "green" but changes not live | a later deploy.sh step aborted under `set -e` | check deploy log tail; nginx patch step must stay non-fatal |
| ENOSPC / disk >90% | video uploads or caches | `pm2 flush`, `rm -rf ~/.cache/ffmpeg-static-nodejs ~/.npm/_cacache`, `sudo journalctl --vacuum-size=200M`, check `du -xh --max-depth=1 /data` |
| login broken after domain/env change | `BETTER_AUTH_URL` mismatch | fix `backend/.env`, `pm2 restart kelola-backend` (no rebuild) |


## Roll Back a Bad Application Revision

Use this only when a specific application revision is broken, a last-known-good commit or tag is known, and its schema is compatible with the current database. Never guess a revision and never downgrade production data automatically.

1. Confirm no CI or manual deploy is running, identify the exact last-known-good SHA/tag from a previously healthy run, and record the current SHA.
2. On the server, run `cd ~/kelola && git status --short`; stop if it prints anything. Confirm the revision object exists with `git cat-file -e '<last-known-good-sha-or-tag>^{commit}'`, then run `git switch --detach <last-known-good-sha-or-tag>`.
   Do not run `git pull`, reset to `origin/main`, or call `deploy.sh`; those actions would redeploy main and may run migrations.
3. Reinstall dependencies for each affected workspace from that revision (`npm --prefix backend ci` and/or `npm --prefix web ci`). If the web app is affected, stop only `kelola-web`, run `npm --prefix web run build`, then `pm2 restart kelola-web`. If the backend is affected, restart only `kelola-backend`.
4. Record `git rev-parse HEAD`, run the required smoke check above, and inspect both affected PM2 processes for a new restart loop.
5. Keep the host on the known-good detached revision only until a forward fix reaches `main`; the next normal CI deploy returns the checkout to `origin/main`.

If the bad release applied an incompatible migration, stop and use the migration's reviewed recovery/forward-fix plan. An application checkout is not a database rollback.

## Guardrails

- A `deploy.sh` edit only takes effect on the NEXT deploy (the running copy is
  already loaded). To apply it now (approval required, and only when no deploy is running
  and `git -C ~/kelola status --short` is empty): `git -C ~/kelola fetch && git -C ~/kelola reset --hard origin/main`,
  then run `deploy.sh`. This discards any server-side edits and leaves a rollback checkout.
- Deploy resets to `origin/main` → always commit+push local work before any deploy.
- Any successful deploy ships ALL commits on main — after a collision, one green
  run is enough; don't pile on more deploys.
