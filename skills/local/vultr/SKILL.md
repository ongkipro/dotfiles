---
name: vultr
description: >-
  Provision and manage Vultr instances with vultr-cli (create, plan/region, firewall groups, reserved IPs). Not Coolify install, hardening, app deploys, or backups (vps-deploy runbook). Triggers: bikin server, sewa VPS.
---

# Vultr (CLI-first)

Provision Vultr servers **from the terminal** instead of the web console. Coolify and hardening continue in the `vps-deploy` runbook.

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

- Current account: **`dotfiles-a1`** (`~/dotfiles/bin/dotfiles-a1-vultr`, linked into `~/.local/bin`), token `VULTR_DOTFILES_A1_API_KEY`. Run every command below as `dotfiles-a1-vultr <args>` instead of `vultr-cli <args>`. An older account (retired 2026-11-09) has no wrapper anymore; never recreate it.
- Set or rotate the token: create a Personal Access Token at https://my.vultr.com/settings/#settingsapi, add this machine's IP under **Access Control**, then the user pastes it into the `VULTR_DOTFILES_A1_API_KEY=` line of `~/.config/ai-local/secrets.env` with their own editor (never via chat or a command line). Verify with a read-only call such as `<wrapper> ssh-key list`, then `secrets-env check`. A 401 usually means this machine's current public IP is missing from Access Control (home IPs change); Access Control accepts IP/CIDR only, not machine identity.
- Another account: copy the wrapper to `bin/<name>-vultr`, change the variable it reads (`VULTR_<NAME>_API_KEY`), add an empty `# --- Vultr — <name> ---` group + variable to `~/.config/ai-local/secrets.env`, and symlink it into `~/.local/bin`.
- Retired account: delete its secret line and wrapper; check no `~/.vultr-cli.yaml` is left behind.
- Existing servers on this account: `~/.config/ai-local/fleet-inventory.md` (one row per host, pointing to its `*-access.md`). Note `plans list` shows nominal regions, not stock — confirm with `regions availability <region>` before `instance create`.

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

## After provisioning: Coolify and hardening

This skill stops at a reachable, key-only machine. Everything after that (host
baseline, provider firewall before Docker, headless Coolify root user, Origin CA,
Cloudflare Access, Cloudflare-only origin) has one canonical procedure:
`vps-deploy` → [references/coolify-behind-cloudflare.md](../vps-deploy/references/coolify-behind-cloudflare.md).
Do not open 8000/6001/6002 publicly or register the first admin in a browser.

Vultr-specific facts that runbook relies on:
- Attach the firewall group at `instance create` (`--firewall-group <id>`) so the
  machine is never public without it; Docker-published ports bypass UFW
  ([Docker and UFW](https://docs.docker.com/engine/network/packet-filtering-firewalls/#docker-and-ufw),
  [Coolify firewall](https://coolify.io/docs/knowledge-base/server/firewall)).
- Monorepo apps on Coolify: Docker Compose build pack (base directory `/`) with
  per-service `build.context: .` and `dockerfile: apps/<app>/Dockerfile`; Nixpacks
  base-directory fails on npm workspaces.
- After creating a server, add it to `~/.config/ai-local/fleet-inventory.md` and
  record its monthly rate and the account's credit runway.

## Cheaper alternative for prod

Both Vultr and **Hetzner** have Singapore with identical latency to ID. Hetzner is cheaper (better value) but its Asia region is Singapore only + AMD CPX/CCX types, no cloud GPU. Common pattern: **dev on Vultr (credit) → prod on Hetzner** (migration is trivial when everything is Coolify + git + `pg_dump` + Cloudflare-in-front).

## AI-native option

`rsp2k/mcp-vultr` — an MCP server (335+ tools) for managing Vultr via natural language; add to an MCP-capable client instead of scripting the CLI when you want conversational control.
