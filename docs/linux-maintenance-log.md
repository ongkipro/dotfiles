# Linux Maintenance Log

Operational history for Linux workstation maintenance. This file records observed state, actions, verification, and intentionally deferred work. Durable lessons belong in `config/ai/project-memory/linux-cuan-maintenance.md` rather than being duplicated here.

## 2026-08-07 — `cuan` — Safe standard maintenance

### Scope

- Audit `/tmp`, user caches, APT cache, package updates, firmware, and AI terminal tools.
- Apply conservative Ubuntu updates and cache cleanup.
- Update selected developer and AI CLI tools without forcing major-version upgrades.
- Do not prune Docker data, remove packages offered by `apt autoremove`, or force Ubuntu phased updates.

### Initial state

- OS: Ubuntu 24.04.4 LTS (Noble).
- Root filesystem: 218 GB total, approximately 50 GB used, 158 GB available (24%).
- `/tmp`: 341 MB.
- `~/.cache`: 430 MB.
- `~/.npm`: 1.39 GB, including about 1.17 GB of verified npm cache content.
- `/var/cache/apt`: 293 MB.
- System journal: 165.6 MB.
- Firmware: no updates available.
- Snap packages: up to date.
- Docker storage was not audited because the current user could not access the Docker socket without elevation.

### Actions

1. Refreshed APT indexes with `sudo apt-get update`.
2. Applied the normal, non-forced upgrade path with `sudo apt-get upgrade -y`.
3. Cleaned downloaded APT archives with `sudo apt-get clean`.
4. Applied the system tmpfiles retention policy with `sudo systemd-tmpfiles --clean`; no blanket deletion of `/tmp` was performed.
5. Cleaned npm cache with `npm cache clean --force`.
6. Pruned unused pnpm store data with `pnpm store prune`.
7. Pruned unreferenced mise runtimes with `mise prune -y`.
8. Updated configured mise tools with `mise up`.
9. Selectively updated Claude Code, Pi, 9Router, and Wrangler through npm. npm itself and the standalone global `better-sqlite3` package were not major-upgraded.
10. Checked Antigravity and OMP through their native update commands; both were already current.
11. Restarted the user-level 9Router service after its package update and waited for its health endpoint.

### System package results

Thirteen packages were upgraded, including:

- Docker CE and CLI 29.7.2.
- containerd.io 2.3.3.
- Google Chrome 151.0.7922.108.
- NetworkManager 1.46.0-1ubuntu2.8.
- GNOME Control Center 46.7-0ubuntu0.24.04.5.

Eight Ubuntu updates remained deferred by the distribution's phased rollout: `alsa-ucm-conf`, the Apport packages, `libinput-bin`, `libinput10`, and the related Python packages. They were not forced.

APT reported `libfwupd2` as automatically installed and no longer required. It was intentionally retained because the selected maintenance scope excluded `apt autoremove`.

### Tool results

| Tool | Before | After |
|---|---:|---:|
| Claude Code | 2.1.223 | 2.1.224 |
| Pi | 0.84.0 | 0.84.1 |
| 9Router | 0.5.40 | 0.5.50 |
| Wrangler | 4.118.0 | 4.120.0 |
| LazyGit | 0.63.1 | 0.64.0 |
| fzf | 0.74.1 | 0.74.2 |
| Ruff | 0.16.0 | 0.16.1 |
| GitHub CLI via mise | 2.96.0 | 2.97.0 |

Already current during the check:

- OMP 17.2.10.
- Antigravity 1.1.11.
- Codex CLI 0.147.0.

The running OMP process retained its pre-update PATH. A clean interactive shell resolved `gh` through the mise shim and reported 2.97.0; non-interactive inherited shells could still resolve Ubuntu's `/usr/bin/gh` 2.45.0 until the parent terminal was restarted.

### Cleanup results

- `~/.npm`: 1.39 GB → 133 MB after the final cache cleanup.
- `~/.cache`: 430 MB → 119 MB.
- `/var/cache/apt`: 293 MB → 36 KB.
- `/tmp`: 341 MB → approximately 335 MB; active and policy-retained files were left intact.
- Root filesystem after maintenance: approximately 49 GB used and 159 GB available (24%).

`mise prune` removed two unreferenced runtimes:

- Python 3.14.6.
- PostgreSQL 16.14 client runtime.

Reinstall an explicit mise version before relying on either runtime again.

### Verification

- Docker system service: `active`.
- 9Router user service: `active`.
- 9Router `http://localhost:20128/api/health`: `{"ok":true}`.
- All configured mise tools: up to date.
- Remaining global npm updates were major-only: npm 11.16.0 → 12.0.2 and `better-sqlite3` 12.6.2 → 13.0.3; both were intentionally deferred.

### Pending

`/var/run/reboot-required.pkgs` lists `libc6`. The user chose to reboot later. Complete activation with:

```bash
sudo reboot
```

Docker images, volumes, build cache, system journals, and `libfwupd2` remain untouched.
