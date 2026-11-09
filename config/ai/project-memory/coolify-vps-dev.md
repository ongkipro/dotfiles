---
name: coolify-vps-dev
description: Where the Coolify/Vultr/Cloudflare server facts live, the canonical setup runbook, and durable Coolify invariants; live hosts stay device-local and must be re-verified.
metadata:
  node_type: memory
  type: project
---

# Coolify VPS fleet — pointer and invariants

## Where things are (read in this order)

1. **Which servers exist, how to reach them, how each deviates from the baseline:**
   `~/.config/ai-local/fleet-inventory.md` (device-local; one row per active host, retired hosts listed as history).
   Per-host detail: the `~/.config/ai-local/<host>-access.md` file named in that table.
2. **How to build or re-harden a server** (host baseline, provider firewall before Docker, `DOCKER-USER` guard,
   headless Coolify root user, Origin CA, SSL mode order, Cloudflare Access, Cloudflare-only origin):
   `skills/local/vps-deploy/references/coolify-behind-cloudflare.md` — the only procedure. The `vultr` skill only
   provisions the machine.
3. **Credentials:** names only, values via `secrets-env`. Vultr account: `dotfiles-a1` (`dotfiles-a1-vultr`).

As of 2026-11-10 there are three active Coolify hosts (99ribu production, TokoΦ production, GeraiExpress), all on
Vultr `dotfiles-a1`, Singapore, behind Cloudflare with Access one-time PIN on each dashboard and `/api` + `/webhooks`
bypassed. Addresses and IDs are device-local only. Before acting, re-verify the host; when it differs, fix the
inventory in the same session.

## Durable invariants

- Retired hosts (`volumdev`, `vps-main`) and the retired `dotfiles-vultr` / `dotfiles-coolify` / `coolify-api`
  access must never be reused: a reassigned IP could receive a token. Their history is in the inventory only.
- If email-based password recovery is unavailable, keep a tested console/CLI recovery path
  (`docker exec -it coolify php artisan root:reset-password`, needs a real TTY). Never pipe a secret through a
  non-TTY path to automate it, and verify the account can actually authenticate after any auth change.
- Container names, user records, SMTP state and network details are runtime facts: inspect the host, not memory.

## Lessons verified on these hosts (2026-10-30 to 2026-11-10)

- Cloudflare SSL **strict** before the origin serves an Origin CA certificate → 526 on every proxied request that
  reaches the origin; the Access login still loads, so the break shows only after login.
- A Coolify API token can vanish (deleted in Security > API tokens); every CLI call is then 401. Name CLI tokens
  so they look in use; check `personal_access_tokens` before the network.
- Docker publishes Coolify 8000/6001/6002 and Traefik 8080 on 0.0.0.0, past UFW. The provider firewall is the gate;
  a `DOCKER-USER` guard is defence in depth.
- The installer's `ROOT_USERNAME` / `ROOT_USER_EMAIL` / `ROOT_USER_PASSWORD` create the root user during install, so
  `/register` is never reachable; pass the password on stdin, never on a command line.
- Coolify compose apps register every `${VAR}` as build-time and inject app variables into every service; set
  secrets via API with `is_buildtime:false` (the CLI flag is rejected with 422).
