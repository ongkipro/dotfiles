---
name: vultr
description: Provision & manage Vultr VPS from the terminal via the official vultr-cli, and stand up Coolify on it for Docker deploys. Automatically use when the user mentions Vultr, vultr-cli, deploy a VPS/server, spin up a cloud instance, Coolify on a server, or Indonesian phrases like beli/bikin/deploy server, sewa VPS, pasang Coolify, deploy ke Vultr, setup server baru. Pairs with the Cloudflare + Coolify self-host workflow.
---

# Vultr (CLI-first) + Coolify

Provision Vultr servers and bootstrap Coolify **from the terminal** instead of the web console. Auto-activate for Vultr / vultr-cli / "deploy server" / "pasang Coolify" tasks.

## Install vultr-cli (no sudo)

Download the latest release binary to `~/.local/bin` (Linux x86_64):
```bash
TAG=$(curl -fsSL https://api.github.com/repos/vultr/vultr-cli/releases/latest | grep -oE '"tag_name": *"[^"]+"' | head -1 | sed -E 's/.*"([^"]+)"$/\1/')
curl -fsSL -o /tmp/vcli.tgz "https://github.com/vultr/vultr-cli/releases/download/${TAG}/vultr-cli_${TAG}_linux_amd64.tar.gz"
tar -xzf /tmp/vcli.tgz -C /tmp vultr-cli && install -m755 /tmp/vultr-cli ~/.local/bin/vultr-cli
```
Note: the asset keeps the `v` in the version (e.g. `vultr-cli_v3.10.0_linux_amd64.tar.gz`). macOS → `_macos_amd64`/`_arm64`.

## Auth (secret stays out of chat/history)

Create a Personal Access Token at https://my.vultr.com/settings/#settingsapi (also add your IP under **Access Control**), then in **your own terminal**:
```bash
echo 'api-key: "PASTE_TOKEN"' > ~/.vultr-cli.yaml && chmod 600 ~/.vultr-cli.yaml
```
`vultr-cli` reads it automatically. Verify: `vultr-cli account info` (negative balance = credit).

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
