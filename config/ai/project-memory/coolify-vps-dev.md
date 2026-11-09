---
name: coolify-vps-dev
description: Durable Coolify recovery and access invariants; live host/account details stay device-local and must be re-verified.
metadata:
  node_type: memory
  type: project
---

# Coolify VPS durable reference

## Authority boundary

Do not store live host addresses, account emails, user IDs, passwords, auth state, or provider-specific recovery credentials in tracked memory. Keep current access facts in `~/.config/ai-local/` and verify the running Coolify instance before acting.

## Recovery invariant

If email-based password recovery is intentionally unavailable, preserve a tested console/CLI recovery path. Do not trust a success message alone after changing authentication state; verify the intended account can actually authenticate.

Some Coolify maintenance commands require a real TTY. When a password/reset command is interactive, do not pipe secret input through a non-TTY shell path merely to automate it. Use the supported interactive recovery route and verify the result.

## Operational rule

Current container names, user records, SMTP state, and provider/network details are runtime facts. Inspect them on the target host instead of relying on this memory file.

## Current instance pointer

Since 2026-10-30 the current instance is `99ribu-prod` (Vultr account `dotfiles-a1`);
its host, firewall, hardening, and recovery facts are in
`~/.config/ai-local/99ribu-prod-access.md`. Drive it with `dotfiles-a1-coolify <args>` and
`dotfiles-a1-vultr <args>`; tokens and passwords live only in `secrets-env`. The previous
`vps-main` (account `dotfiles-vultr`, `~/.config/ai-local/vps-main-access.md`) was unreachable
and its API token rejected on 2026-10-30; its CLI context was removed.

### Retired access, removed from `secrets-env` (2026-11-09)

Cleaned so that no tool can pick them up by accident. Backups of the removed lines are device-local in
`~/.config/ai-local/backups/*.20261109221353*` (mode 600); the values are not recorded anywhere else.

- `VULTR_DOTFILES_API_KEY` (account `dotfiles-vultr`): the API answered 401 from 2026-10-30; the account is retired.
  Wrapper `dotfiles-vultr` symlink removed from `~/.local/bin` (the repo file stays until its own cleanup).
- `COOLIFY_VPS_MAIN_*` (instance `vps-main`): unreachable since 2026-10-30.
- `COOLIFY_BASE_URL` and `COOLIFY_TOKEN`, plus the superseded `coolify.env`: pointed at retired `volumdev` (45.77.33.112).
  Vultr can reassign that address, so a script reading them could send a token to a stranger. `coolify-api` and
  `coolify-auth` keep their guard and stay disabled. Wrapper `dotfiles-coolify` symlink removed from `~/.local/bin`.
- Kept on purpose: `INSTALL_TOKEN` (an AdsBookCMS install token, not Coolify) and every `COOLIFY_99RIBU_PROD_*`,
  `COOLIFY_TOKOPHI_*` and `VULTR_DOTFILES_A1_API_KEY` entry.
- Verified after the cleanup: Vultr `dotfiles-a1` account answers; `tokophi-coolify` reports Coolify 4.6.0 over its SSH
  tunnel; `secrets-env check` leaves only the known empty-`.git`-in-`$HOME` finding.

### Current Coolify instances (Cloudflare Access one-time PIN in front of each dashboard, `/api` bypass by token)

| Instance | Dashboard | Vultr account | Access from the CLI |
|---|---|---|---|
| `99ribu-prod` | `dotserver.ongki.pro` | `dotfiles-a1` | `dotfiles-a1-coolify` |
| tokophi dedicated | `devserv.tokophi.com` | `dotfiles-a1` (`207.148.76.131`) | `tokophi-coolify` (SSH tunnel) |
| `geraiexpress` (Coolify 4.7.2, 2026-11-10) | `dotserver.geraiexpress.com` | `dotfiles-a1` (`139.180.142.31`) | `COOLIFY_GERAIEXPRESS_URL` + `_TOKEN` over Cloudflare |

The Coolify admin email and password of the tokophi server are deliberately not in `secrets-env`.

Lessons from the geraiexpress setup (2026-11-10), each verified at the time:
- Setting Cloudflare SSL to **strict** before the origin has an Origin CA certificate makes every proxied request that
  reaches the origin answer **526**; the Access login page still loads, so the dashboard looks fine until after login.
- A Coolify API token can disappear from the dashboard (Security > API tokens) and then every CLI call is 401; name the
  CLI token so it is obviously in use, and check `personal_access_tokens` before suspecting the network.
- Docker publishes Coolify's 8000/6001/6002 and Traefik's 8080 on 0.0.0.0 and bypasses UFW. On geraiexpress a
  `DOCKER-USER` guard unit drops them on the public interface, so the Vultr firewall group is not the only gate.
- The installer's `ROOT_USER_EMAIL` / `ROOT_USER_PASSWORD` variables create the admin during install, so the open
  registration page is never reachable; pass them on stdin, never on a command line.
Host and account facts for this instance: `~/.config/ai-local/geraiexpress-prod-access.md` (device-local).
