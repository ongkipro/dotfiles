---
name: vps-deploy
description: >-
  Deploy and operate Node/Next.js/Astro SSR apps with PostgreSQL on an Ubuntu
  VPS via Coolify v4 or Docker Compose. Not provider console work (vultr),
  Cloudflare products (cloudflare/wrangler), schema design (postgres-drizzle),
  or deploying without approval — every live action is gated. Covers health
  checks, rolling or blue-green deploys, workers and scheduled tasks, Postgres
  backup/restore drills, rollback, hardening, logs. Use for "deploy ke VPS", Coolify setup or failures, zero
  downtime, backup and restore, rollback, server hardening, disk full, SSL/Let's
  Encrypt issues, and production readiness reviews.
---

# VPS deploy: Coolify v4 or Docker Compose

Production is an **approval gate** (`CORE.md`): plan, show the exact commands,
and wait for explicit approval before touching a live server, DNS, or a
database. Read-only inspection (status, logs, disk) is fine when access already
exists. Live hosts, accounts, and credentials are device-local
(`~/.config/ai-local/`), never in tracked files.

Facts verified against official docs on **2026-10-02** (Coolify v4.3.x,
Docker Compose, PostgreSQL 18 docs). Re-check version-specific behavior before
relying on it.

## 1. Choose the deploy shape

| Situation | Shape | Note |
|---|---|---|
| One app + Postgres, wants a UI, previews, backups | **Coolify v4** (Dockerfile or Nixpacks app + Coolify database) | Rolling updates only for single-container apps (below) |
| Multi-service stack, needs exact control | **Docker Compose** behind Caddy or Traefik | Coolify does not roll Compose apps; use blue-green |
| Static or edge site | Not this skill — Cloudflare Pages/Workers (`cloudflare`, `wrangler`) | — |

**Coolify rolling updates** start the new container, wait for health, then
remove the old one — and the docs state this is not a zero-downtime guarantee.
They are **blocked** when the app publishes a host port, uses "Consistent
Container Names", a custom container name or IP, is a PR preview, or is a
Docker Compose app. The app must shut down gracefully and tolerate old and new
versions running side by side.

## 2. Non-negotiables before the first deploy

- **Health endpoint** that checks real dependencies (DB query), with `curl` or
  `wget` present in the image; `start_period` long enough for migrations. When
  every container is unhealthy, the proxy returns 404 / "No available server".
- **Secrets**: runtime env vars or Compose `secrets:` (mounted at
  `/run/secrets/<name>`; the Postgres image supports `*_FILE`). Build-time
  secrets via Docker build secrets, never build args (they persist in image
  metadata). Never commit `.env`.
- **Ports**: Docker-published ports **bypass ufw**. Publish only the proxy
  (80/443); bind anything else to `127.0.0.1:PORT:PORT` or keep it on the
  internal network. Coolify needs 22/80/443 and 8000/6001/6002 until the
  dashboard is behind its own domain — then close 8000/6001/6002 with the
  **provider firewall** (or `DOCKER-USER` rules), because ufw cannot block
  Docker-published ports.
- **Coolify install hygiene**: create the admin account immediately after
  install (first visitor becomes admin); back up `/data/coolify/source/.env`;
  stay on the latest v4.x — 2026 advisories include a critical cross-team IDOR
  and an authenticated RCE; set webhook secrets and rotate API tokens.
- **Hardening**: SSH keys only (`PasswordAuthentication no` in a drop-in such
  as `/etc/ssh/sshd_config.d/50-hardening.conf` — the `.conf` suffix is
  required by the default `Include`; confirm with `sshd -T | grep -i
  passwordauthentication`), then `sshd -t` **before** restarting ssh — a bad
  config locks you out), `ufw limit OpenSSH`, unattended security upgrades on,
  fail2ban optional (reduces noise, does not replace key auth).
- **Logs and disk**: Docker json-file logs are unrotated by default; set
  `"log-opts": {"max-size": "10m", "max-file": "3"}` in `/etc/docker/daemon.json`
  (applies to newly created containers). Enable Coolify's disk threshold
  notification and cleanup.
- **External uptime check**: Coolify does not probe public URLs from outside.

## 3. Database safety

- **Migrations are expand-contract**: release N adds (columns, tables,
  dual-writes) and stays compatible with release N-1; the destructive
  "contract" step ships in a later release (`postgres-drizzle` owns the SQL).
  This is what makes rollback an image swap instead of a data restore.
- **Backups leave the machine.** A dump on the same disk is not a backup.
  Coolify scheduled backups can upload to S3; otherwise `bin/vps-pgdump` pulls
  dumps off the VPS. Use `pg_dump -Fc` (or `-Fd` for parallel dumps) **plus**
  `pg_dumpall --globals-only` for roles.
- **A backup is only proven by a restore** (Coolify's own docs: a successful
  backup only proves a file was created).
- **PITR** (base backup + WAL archive via pgBackRest or WAL-G) when the
  acceptable data-loss window is shorter than the dump interval.

### Restore drill (monthly, on a throwaway container — never production)

1. Fetch the latest off-host dump and globals.
2. Start a disposable Postgres of the same major version.
3. `psql -f globals.sql`, then
   `pg_restore --create --exit-on-error -j4 -d postgres <dump>`.
4. `ANALYZE`, compare row counts of key tables, run the app's smoke test
   against it.
5. Record restore duration against the recovery-time target; delete the
   container.

## 4. Deploy procedure (after approval)

1. Fresh off-host backup; confirm the previous image is still retained.
2. Run the **expand** migration.
3. Deploy:
   - Coolify: trigger the rolling update; watch the deployment log.
   - Compose: `docker compose up -d --wait --wait-timeout <s>` with
     `depends_on: {db: {condition: service_healthy}}`; or stand up "green"
     beside "blue" and switch the proxy only when green is healthy (Caddy
     `health_uri` + `lb_try_duration`).
4. Smoke-test critical flows (login, checkout or main form, an admin page);
   watch logs and the external monitor for ~15 minutes.
5. Record the deploy in the project's release/observability notes.

## 5. Rollback

- **Coolify**: Configuration → Rollback to a retained image. It does not undo
  migrations, volumes, or external services.
- **Compose / blue-green**: switch the proxy back to blue, or re-tag the
  previous image and `up --wait`.
- Restore the database **only** when data is damaged; with expand-only
  migrations the old version runs against the new schema.

## 6. Scheduled tasks and workers

- **Workers run in their own container**, built from the same image as the web
  app with a different command (`node dist/worker.js`): a second Coolify
  application or a separate Compose service. Never run a long-lived job loop
  inside the web process — rolling updates, scaling, and crashes then take jobs
  with them. Give the worker its own health signal (heartbeat row or file) and
  graceful shutdown that finishes or releases the current job.
- **Cron on Coolify**: use the resource's Scheduled Tasks (name, command,
  frequency as five-field cron or a named schedule, timeout, container name for
  multi-container resources). Coolify runs the command through `sh` inside the
  **running** container — enter it without `docker exec` — evaluates the
  schedule in the server's timezone, and skips the run if the app is stopped or
  the server is unavailable. Check "Recent executions" for status and output,
  and use Execute Now to test the command. Host crontab is not the default.
- **Compose without Coolify**: a dedicated scheduler service (or host
  `systemd` timer calling `docker compose exec`) — one scheduler only, never one
  per web replica.
- **Every job is idempotent**: schedules can be skipped, run twice (manual run
  plus schedule, overlap with a slow previous run), or retried. Use a DB lock or
  claimed-row pattern and idempotency keys (`postgres-drizzle` owns the outbox /
  `SKIP LOCKED` pattern), store times in UTC, and make a missed run catch up
  from the last processed watermark rather than "since one interval ago".
- Count worker and cron connections in the Postgres connection budget, and
  alert when a scheduled task fails or a worker heartbeat goes stale.

Sources (verified 2026-10-02):
https://coolify.io/docs/core/automation/scheduled-tasks/overview and
https://coolify.io/docs/knowledge-base/cron-syntax.

## 7. Troubleshooting map

| Symptom | First checks |
|---|---|
| 404 / "No available server" after deploy | Container health status; health endpoint path/port; `curl` in image |
| Let's Encrypt fails | Port 80 reachable; Cloudflare proxy/WAF in front (use DNS challenge or pause proxy); DNS points at the server |
| Rolling update did a hard restart | One of the rolling-update blockers in §1 |
| Disk full | `docker system df`, log rotation, old images, backup directory |
| Service reachable on an unexpected port | Published port bypassing ufw — bind to 127.0.0.1 |

## 8. Evidence to leave behind

Deploy and rollback commands actually run, health and smoke results, the
latest successful restore drill (date, duration), and open risks — in the
project's `RELEASE.md` / `OBSERVABILITY.md` or delivery evidence. Facts that
change (hosts, versions in use) are verified on the server, not copied into
memory.
