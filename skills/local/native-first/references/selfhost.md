# Self-host: Docker + Coolify + Vultr/Hetzner — native-first

House setup (TokoΦ): Coolify on a VPS, Docker Compose build pack, Postgres in a container, Cloudflare at the edge → Traefik/Coolify at the origin.

## Don't build it; Coolify/Docker already does it

| Reaching for… | Use instead |
|---|---|
| nginx config + certbot cron | Coolify's built-in **Traefik** + automatic Let's Encrypt |
| a deploy script / rsync | Coolify **git push → build → deploy** |
| a CI runner just to build an image | Coolify builds on the server |
| a systemd unit per service | `docker compose` + `restart: unless-stopped` |
| a bash health-check loop | Compose **`healthcheck:`** + `depends_on: condition: service_healthy` |
| a hand-rolled backup script | a `backup` service running `pg_dump -Fc` on a schedule (TokoΦ: daily, keep-7) |
| a secrets file in the repo | Coolify **environment variables** (per-service) |
| HAProxy in front of Traefik | nothing — Cloudflare edge → Traefik is enough. Skipped deliberately. |

## Hard-won gotchas (already paid for on TokoΦ — don't rediscover)

- **Nixpacks fails on npm-workspace monorepos.** Use the **Docker Compose build pack**. Settled.
- Build context = **repo root** (workspaces need sibling packages), even though the Dockerfile lives in `apps/*`.
- A `db` package that throws on a missing `DATABASE_URL` **breaks the image build**. Pass a dummy at build time, or guard the assert.
- `next start` does **not** serve files written to `public/uploads` after the build. Serve them through a route (`/api/uploads/[name]`) — or better, put them in object storage.
- **Persist what matters**: named volumes for pgdata / uploads / backups. A redeploy without them is data loss.
- **Seeds must be idempotent** — they re-run on every redeploy.
- UFW is **not** the gate for containers: Docker-published ports bypass it. The provider firewall (80/443 from Cloudflare only) plus a `DOCKER-USER` guard are the gate; full procedure in `vps-deploy` → `references/coolify-behind-cloudflare.md`.

## Cost discipline — the thing that actually bites

A VPS bills whether or not you use it. **Record the monthly rate and the account's
credit runway in `~/.config/ai-local/fleet-inventory.md` when you create a server**,
not later. Treat that note as memory and re-measure before acting on it: credit and
plans come from the account (`<account>-vultr account info` shows credit as a
negative balance; `<account>-vultr instance list`). A stale cost note once claimed
the wrong plan, double the price and credit ending five months early; acting on it
would have forced a migration nothing required.

Plan of record: dev = Vultr SG (on credit) → prod = Hetzner SG. Migration is cheap (Coolify + git + `pg_dump` + repoint the Cloudflare origin IP).

## Validation

`docker compose config` (does it even parse?) → `docker compose build` → up, then **check healthchecks are green** and the volumes actually persisted across a redeploy.

**`vultr-cli instance delete`, resize, DNS repoint, and any prod redeploy are production actions** — explicit approval (see `AGENTS.md` → Approval gates).
