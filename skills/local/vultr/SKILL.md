---
name: vultr
description: >-
  Provision and manage Vultr instances with vultr-cli (create, plan/region, firewall groups) and bootstrap a fresh Coolify install. Not app deploys, Coolify operations, backups, or hardening after install (vps-deploy). Triggers: bikin server, sewa VPS.
---

# Vultr (CLI-first) + Coolify

Provision Vultr servers and bootstrap Coolify **from the terminal** instead of the web console. Auto-activate for Vultr / vultr-cli / "deploy server" / "pasang Coolify" tasks. Pairs with the `cloudflare` (Tunnel, DNS, WAF) + Coolify self-host workflow.

## Install vultr-cli (no sudo)

Download the latest release binary to `~/.local/bin` (Linux x86_64):
```bash
TAG=$(curl -fsSL https://api.github.com/repos/vultr/vultr-cli/releases/latest | grep -oE '"tag_name": *"[^"]+"' | head -1 | sed -E 's/.*"([^"]+)"$/\1/')
curl -fsSL -o /tmp/vcli.tgz "https://github.com/vultr/vultr-cli/releases/download/${TAG}/vultr-cli_${TAG}_linux_amd64.tar.gz"
tar -xzf /tmp/vcli.tgz -C /tmp vultr-cli && install -m755 /tmp/vultr-cli ~/.local/bin/vultr-cli
```
Note: the asset keeps the `v` in the version (e.g. `vultr-cli_v3.10.0_linux_amd64.tar.gz`). macOS → `_macos_amd64`/`_arm64`.

## Auth (secret stays out of chat/history)

One wrapper per Vultr account; the token lives in `secrets-env`, never in `~/.vultr-cli.yaml` (no plaintext config, and several accounts can coexist). `VULTR_API_KEY` in the environment overrides the config file.

- Current account: **`dotfiles-a1`** (`~/dotfiles/bin/dotfiles-a1-vultr`, linked into `~/.local/bin`), token `VULTR_DOTFILES_A1_API_KEY`. Run every command below as `dotfiles-a1-vultr <args>` instead of `vultr-cli <args>`. The older `dotfiles-vultr` account (`VULTR_DOTFILES_API_KEY`) answered 401 on 2026-10-30 and is pending retirement.
- Set or rotate the token: create a Personal Access Token at https://my.vultr.com/settings/#settingsapi, add this machine's IP under **Access Control**, then the user pastes it into the `VULTR_DOTFILES_API_KEY=` line of `~/.config/ai-local/secrets.env` with their own editor (never via chat or a command line). Verify with a read-only call such as `<wrapper> ssh-key list`, then `secrets-env check`. A 401 usually means this machine's current public IP is missing from Access Control (home IPs change); Access Control accepts IP/CIDR only, not machine identity.
- Another account: copy the wrapper to `bin/<name>-vultr`, change the variable it reads (`VULTR_<NAME>_API_KEY`), add an empty `# --- Vultr — <name> ---` group + variable to `~/.config/ai-local/secrets.env`, and symlink it into `~/.local/bin`.
- Retired account: delete its secret line and wrapper; check no `~/.vultr-cli.yaml` is left behind.
- Existing servers on this account (IDs, firewall group, reserved IP, SSH key): `~/.config/ai-local/99ribu-prod-access.md`. Note `plans list` shows nominal regions, not stock — confirm with `regions availability <region>` before `instance create`.

## Deploy an instance (end-to-end)

```bash
# 1. SSH key (private stays local; upload the public part)
[ -f ~/.ssh/<name> ] || ssh-keygen -t ed25519 -f ~/.ssh/<name> -N "" -C "<name>"
KEY=$(vultr-cli ssh-key create --name <name> --key "$(cat ~/.ssh/<name>.pub)" | awk '/^ID/{print $2}')

# 2. Look up IDs
vultr-cli regions list | grep -i singapore          # e.g. sgp
vultr-cli plans list | grep vhp-8c-16gb-amd          # High Performance AMD (Shared CPU, NVMe)
vultr-cli os list | grep -i "ubuntu 24.04"           # e.g. 2284

# 3. Create
vultr-cli instance create --region sgp --plan <plan> --os 2284 \
  --host <host> --label "<Label>" --ssh-keys "$KEY"

# 4. Poll for IP (status active + MAIN IP != 0.0.0.0), then SSH
vultr-cli instance get <id> | awk '/^MAIN IP/{print $3}'
ssh -i ~/.ssh/<name> root@<IP>
```
CLI and API facts verified 2026-10-30 (vultr-cli 3.11):
- `instance create` accepts `--firewall-group <id>` and `--reserved-ipv4 <reserved-ip-id>` (the reserved IP becomes the main IP; reserve it first with `reserved-ip create --region <r> --type v4 --label <l>`). The reserved IP was not routable until one `instance restart`; `reserved-ip attach <id> --instance-id <id>` then answered "restart your server".
- `instance create` prints the generated root password; filter it from output and log in with the SSH key.
- `ssh-key create` output does not start with `ID`; read the ID back with `ssh-key list`.
- `firewall rule create <group-id>` always needs `--subnet` and `--size`, even with `--source cloudflare` (use `0.0.0.0`/`0`, `::`/`0`). Delete by rule number, highest first. Rule changes take about a minute to apply.
- `firewall group get` reported 0 instances and 0 rules for an attached, enforcing group; prove enforcement with a port probe instead.
- Bind a group after creation with `instance update-firewall-group <instance-id> --firewall-group-id <id>`.

Plan naming: `vhp-*` = High Performance (AMD, NVMe), `vhf-*` = High Frequency (Intel 3GHz+, NVMe), `vc2-*` = Regular. Vultr has **no Jakarta** — Singapore (`sgp`) is closest to Indonesia (~20-30ms). Vertical resize is easy but **disk can't shrink**, so start small.

## Bootstrap Coolify (Docker deploys)

```bash
ssh root@<IP> 'export DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=a; \
  apt-get update -y && apt-get upgrade -y -o Dpkg::Options::="--force-confold"; \
  curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash'
# Host-service allowlist only; Docker-published ports can bypass UFW (see below).
ssh root@<IP> 'for p in 22 80 443 8000 6001 6002; do ufw allow $p/tcp; done; ufw --force enable'
```

**Network boundary (official guidance):** Docker diverts published-container
traffic before it reaches UFW's `INPUT`/`OUTPUT` chains, so UFW alone is not an
effective container-port boundary. Attach a Vultr Firewall group and allow TCP
22, 80, and 443, plus 8000 (dashboard), 6001 (real-time), and 6002 (terminal)
only while accessing Coolify directly by IP. After a custom domain works
through Coolify's integrated Traefik/Caddy proxy, close 8000, 6001, and 6002 at
the Vultr Firewall and use 80/443. Keep UFW as defense in depth for host
services. If a provider firewall is unavailable, Coolify documents
`ufw-docker` as the advanced self-hosted fallback; do not disable Docker's
firewall-rule generation, which Docker says is likely to break container
networking.

Official sources: [Docker and UFW](https://docs.docker.com/engine/network/packet-filtering-firewalls/#docker-and-ufw),
[Coolify firewall ports and closure strategy](https://coolify.io/docs/knowledge-base/server/firewall),
and [Vultr Firewall rules](https://docs.vultr.com/products/network/firewall-groups/management/rules).
- Coolify installer **also installs Docker** (steps 1-8) — do NOT install Docker separately.
- Dashboard: `http://<IP>:8000` → **register the first admin immediately** (first registrant = owner).
- Server type on onboarding = **"This Machine" / Localhost** for a single-server setup.
- Monorepo apps: use the **Docker Compose** build pack (base directory `/`) with per-service `build.context: .` (repo root) + `dockerfile: apps/<app>/Dockerfile` — Nixpacks base-directory FAILS on npm workspaces.

## Cheaper alternative for prod

Both Vultr and **Hetzner** have Singapore with identical latency to ID. Hetzner is cheaper (better value) but its Asia region is Singapore only + AMD CPX/CCX types, no cloud GPU. Common pattern: **dev on Vultr (credit) → prod on Hetzner** (migration is trivial when everything is Coolify + git + `pg_dump` + Cloudflare-in-front).

## AI-native option

`rsp2k/mcp-vultr` — an MCP server (335+ tools) for managing Vultr via natural language; add to an MCP-capable client instead of scripting the CLI when you want conversational control.
