---
name: kelola-deploy
description: Deploy, verify, and recover the Kelola HRIS production server (kelolatim.com). Automatically use when working in the kelola repo on anything touching deploy, CI, PM2, nginx, the production VPS, a 500/502 after deploy, ChunkLoadError, node_modules corruption, or Indonesian phrases like deploy kelola, servernya error, web nya down, gak bisa login, disk penuh.
---

# Kelola — Production Deploy & Recovery Runbook

Kelola HRIS (repo `kelola`): Next.js web + Hono backend, deployed to one VPS.
Distilled from incidents Jun–Jul 2026. Point-in-time state (backup tables, disk
figures) lives in project memory, not here.

## Architecture

- Server `irwansyah10@103.93.161.104`, dir `~/kelola`. Nginx in front.
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

- Watch: `gh run list --workflow=deploy.yml --limit 3`, or on the server
  `pgrep -af "next build|deploy.sh"` (empty = done).
- The site 500s briefly DURING the build window — wait for CI before diagnosing.
- Manual deploy only when not pushing (stuck run): `ssh irwansyah10@103.93.161.104 'cd ~/kelola && bash deploy.sh'`
  — only after confirming no CI deploy is in progress.
- Verify healthy: `https://kelolatim.com/` and `/sign-in` return 200;
  backend `curl localhost:3101/health` → `{ok:true}`.

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

## Guardrails

- A `deploy.sh` edit only takes effect on the NEXT deploy (the running copy is
  already loaded); to apply now: `git -C ~/kelola fetch && git reset --hard origin/main` first.
- Deploy resets to `origin/main` → always commit+push local work before any deploy.
- Any successful deploy ships ALL commits on main — after a collision, one green
  run is enough; don't pile on more deploys.
