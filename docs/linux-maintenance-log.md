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
## 2026-08-15 — `rich` / `cuan` — OMP v17.3.4 & AI Engineering Control Plane Upgrade

### Scope

- Update OMP binary to `v17.3.4` and unpack full set of 11 specialist agents (`designer`, `librarian`, `reviewer`, `scout`, `security-reviewer`, `sonic`, `task`, `architect`, `complex-developer`, `debugger`, `writer`).
- Implement deterministic engineering tools: `project-check`, `diff-risk`, `ai-policy-lint`.
- Upgrade `config/templates/TASKS.md` with rich task execution contract.
- Formalize Risk-Aware Classification Framework (R0–R4) in `config/omp/ROUTING.md`.
- Integrate Control Plane and Audit blueprints into `docs/`.
- Run full system self-tests (`ai-doctor --self-test`, `ai-policy-lint`, `project-check`, `diff-risk`, `security-check`, `git-guard.test.sh`).

### Results

- OMP updated from `17.3.0` to `17.3.4`.
- All 15 `ai-doctor --self-test` gates: **PASSED**.
- All 21 `git-guard.test.sh` unit tests: **PASSED**.
- `ai-policy-lint`: **PASSED** (0 policy/routing errors).
- All 3 new tools (`project-check`, `diff-risk`, `ai-policy-lint`) linked to `~/.local/bin/`.
- Changes committed and pushed to `main` (`ongkipro/dotfiles`).

## 2026-11-03 — `dot` & `rich` — Lenovo Yoga Book 9i (13IRU8) Ubuntu 26.04 LTS Hardware & Zero-Mosh Workstation Optimization

### Scope

- Complete hardware enablement on `dot` (Lenovo Yoga Book 9 13IRU8 / `82YQ`, Ubuntu 26.04.1 LTS, Kernel `7.0.0-42-generic`, GNOME 50 / Mutter Wayland):
  - Bowers & Wilkins quad-speaker soundbar (Realtek ALC287 + 4x TI `TAS2781` `i2c-TIAS2781:00`).
  - Dual 2.8K OLED displays (`eDP-1` Top `SDC 0x4167` physically mounted 180° `upside_down` + `eDP-2` Bottom `SDC 0x4182`), GDM 50 login orientation, backlight sync, and layout switcher.
  - Dual touchscreen and stylus (`INGENIC 17ef:6161`) independent screen mapping and top-screen 180° coordinate inversion.
  - Native kernel 7.0 + UPower Battery Conservation Mode (`Long_Life` ~80% threshold).
- De-bloat Ubuntu 26.04 LTS on `dot` for maximum available LPDDR5x RAM and zero background disk/CPU jitter.
- Configure Full-Stack AI Terminal (`ghostty`, `tmux`, `pi` 10-package lean core synced to `rich`'s 9Router gateway) and Daily Browsing (Google Chrome native Wayland + Intel Iris Xe VA-API hardware video decoding).
- Configure bidirectional, roaming-resilient pure-SSH (`dot` ↔ `rich` over Tailscale WireGuard, without Mosh) on both client (`dot`) and server (`rich`).

### Actions & Hardware Fixes

1. **GRUB, PCIe LPSS I2C Bus & Audio (`TAS2781`)**:
   - Removed legacy `acpi=noirq` from `/etc/default/grub` and `/etc/modprobe.d/snd.conf` so `intel-lpss` (`00:15.1`) and `intel-ish-ipc` (`00:12.0`) enumerate normally.
   - Purged `easyeffects` and LV2 plugins (`lsp-plugins-lv2`, `mda-lv2`, `zam-plugins`) and cleaned PipeWire/WirePlumber state.
   - Verified `/lib/firmware/ti/audio/tas2781/TIAS2781RCA2.bin.zst` (`0x5c=0x19` across all 6 blocks) and `TAS2XXX3881.bin.zst`.
   - Enabled ALSA `Speaker Force Firmware Load = on` and `Speaker Analog Volume = 100%`, persisted via `alsactl store 0` and `/etc/udev/rules.d/99-tas2781-power.rules` (`ATTR{power/control}="on"`).
2. **Dual-Screen Touchscreen & Stylus (`17ef:6161` -> `eDP-1`, `17ef:6162` -> `eDP-2`)**:
   - Installed `/usr/local/bin/yogabook-touch-bridge` and `yogabook-touch-bridge.service` (`libevdev` + `/dev/uinput`) to grab raw `17ef:6161` `Touchscreen Bottom` and `Stylus Bottom` nodes and expose them as virtual product ID `17ef:6162`.
   - Installed `/etc/udev/rules.d/99-yoga-book-9i-touch.rules`: applies `ENV{LIBINPUT_CALIBRATION_MATRIX}="-1 0 1 0 -1 1 0 0 1"` to `Touchscreen Top` and `Stylus Top` (`17ef:6161`) to cancel `eDP-1`'s 180° physical panel mounting, and sets `ENV{LIBINPUT_IGNORE_DEVICE}="1"` on raw `17ef:6161` `Bottom`, `Keyboard`, and `Emulated Touchpad` nodes.
   - Configured GNOME `dconf` peripheral mappings: `17ef:6161` -> `['SDC', '0x4167', '0x00000000', 'eDP-1']` and `17ef:6162` -> `['SDC', '0x4182', '0x00000000', 'eDP-2']`.
3. **Dual-OLED Display Orientation, Backlight & Battery Conservation**:
   - Synced `~/.config/monitors.xml` (`<rotation>upside_down</rotation>` on `eDP-1`) to `/etc/xdg/monitors.xml` and `/var/lib/gdm3/.config/monitors.xml` for GDM 50 login screen alignment.
   - Locked `org.gnome.settings-daemon.peripherals.touchscreen orientation-lock = true`.
   - Installed `~/.local/bin/yogabook-layout` (`stacked` | `side-by-side` | `status`) using `gdctl set --persistent`.
   - Enabled `charge_types = Long_Life` on `/sys/class/power_supply/BAT0/charge_types` via UPower D-Bus (`EnableChargeThreshold(true)`) and `/etc/udev/rules.d/99-yoga-book-9i-power.rules`.
4. **Zero-Bloat Memory & Kernel Tuning on `dot`**:
   - Removed `/etc/default/grub.d/kdump-tools.cfg` and purged `kdump-tools` / `kexec-tools` to reclaim **512 MB of physical RAM** previously reserved by `crashkernel`.
   - Masked user-session bloat daemons (`localsearch-3.service`, `evolution-addressbook-factory.service`, `evolution-calendar-factory.service`, `evolution-source-registry.service`, `speech-dispatcher.service`, and `org.gnome.Evolution-alarm-notify.desktop`) and disabled system `ModemManager.service`, `cups-browsed.service`, and `snap.cups`, freeing ~560 MB RAM and eliminating background Tracker3 disk indexing spikes.
   - Applied `/etc/sysctl.d/99-workstation-tuning.conf`: `fs.inotify.max_user_watches = 524288`, `fs.inotify.max_user_instances = 1024`, `vm.swappiness = 20`, `net.core.default_qdisc = fq`, `net.ipv4.tcp_congestion_control = bbr`, `net.ipv4.tcp_slow_start_after_idle = 0`, `net.ipv4.tcp_mtu_probing = 1`.
5. **Browser Wayland + VA-API & AI Terminal Integration**:
   - Configured `~/.config/chrome-flags.conf`, `~/.config/chromium-flags.conf`, and `~/.local/bin/google-chrome-stable` wrapper for native Wayland (`--ozone-platform-hint=auto`) and Intel Iris Xe VA-API hardware video decoding (`VaapiVideoDecodeLinuxGL`, `AcceleratedVideoDecodeLinuxZeroCopyGL`).
   - Configured `~/.config/ghostty/config.ghostty` with `shell-integration-features = ssh-terminfo,ssh-env` (validated with `ghostty +validate-config`) and set Ghostty as the default GNOME terminal.
   - Pointed `dot`'s `~/.pi/agent/models.json` to `rich`'s 9Router gateway over Tailscale and enabled `pi-9router-sync.timer` (16 models synced).
   - Trimmed Pi package stack to 10 core extensions (`pi-web-access`, `pi-agent-browser-native`, `pi-mcp-adapter`, `cc-safety-net`, `pi-subagents`, `pi-background-tasks`, `@narumitw/pi-worktree`, `pi-lens`, `pi-context-view`, `pi-psql`), removing 449 redundant npm dependencies.
6. **Pure-SSH Roaming Architecture (`dot` ↔ `rich` over Tailscale, Zero Mosh)**:
   - Configured `~/.ssh/config` on `dot` and `/etc/ssh/sshd_config.d/99-ai-perf.conf` + `/etc/sysctl.d/99-ssh-ai-roaming.conf` on `rich` with `TCPKeepAlive no`, `ClientAliveInterval 15` / `ServerAliveInterval 15`, `ClientAliveCountMax 20` / `ServerAliveCountMax 20` (5-minute Wi-Fi/hotspot transition tolerance over Tailscale), `UseDNS no`, `IPQoS ef af21`, `ControlMaster auto` (`ControlPersist 4h`), `net.ipv4.tcp_slow_start_after_idle = 0`, and `net.ipv4.tcp_mtu_probing = 1`.
   - Installed `~/.local/bin/rich` on `dot` with automatic stale `ControlMaster` socket recovery (`ensure_healthy_socket`), persistent remote `tmux` session attachment (`rich`, `rich 1..7`, `rich ls`), port forwarding (`rich tunnel`), and resilient `sshfs` mounting (`rich mount`).
   - Consolidated idempotent hardware/system script at `~/Documents/work/notes/yoga-book-9i-ubuntu26-setup.sh`.

### Verification

- `org.gnome.Mutter.InputMapping.GetDeviceMapping`: `17ef:6161` Top Touch & Stylus -> `((0, 0, 1440, 900),)` (`eDP-1`); `17ef:6162` Bottom Touch & Stylus -> `((1440, 0, 1440, 900),)` (`eDP-2`).
- `systemctl --failed` and `systemctl --user --failed` on both `dot` and `rich`: `0 failed units`.
- Multiplexed `ssh rich` roundtrip latency on `dot`: `19ms`; bidirectional `dot` ↔ `rich` SSH verified.
- `ai-policy-lint` and `system-map --check`: **PASSED**.

## 2026-11-03 — `rich` — Headless dev server conversion

### Scope

- Turn `rich` from an unused GNOME desktop into a headless dev/AI-terminal server reached over SSH and Tailscale.
- Keep one browser for MCP and Playwright; remove unused daemons, snaps and caches without touching project data.

### Initial state

- Boot target `graphical.target`; gdm showed a login screen nobody used. All sessions arrived over SSH/Tailscale into tmux.
- Google Chrome was missing, so `chrome-devtools` MCP (`/usr/bin/google-chrome`) and Playwright MCP (`--browser chrome`) were broken.
- Root filesystem 59 GB free (72%); about 2.9 GB RAM free. One stale `tsserver` held 3.9 GB.

### Actions

1. Installed Google Chrome `.deb` (156) as the single system browser.
2. Marked network, SSH, Tailscale, Docker, fonts and other essentials manual, simulated every purge, then purged GNOME/gdm/xorg/cups/avahi/fwupd, snapd with all snaps, pipewire/wireplumber, xdg portals, gvfs, udisks2, upower, accountsservice, rtkit, packagekit and mosh. Kept `gnome-keyring`, `poppler-utils`, `ghostscript`, `p11-kit`.
3. Set `multi-user.target`; masked sleep/suspend/hibernate, `wpa_supplicant` (no Wi-Fi hardware) and `motd-news`.
4. Pruned the Docker build cache, npm cache and pnpm store; removed `~/snap` and residual configs of old kernels. Kept `chromium-1228` (seven projects pin Playwright 1.61.1), tagged Docker images and all volumes.
5. Rebound kliniknuma Postgres to `127.0.0.1:55435` (it was open to the LAN). Its port comes from `POSTGRES_PORT` in the shell, not `.env`: run `POSTGRES_PORT=55435 docker compose up -d`.
6. Pointed live 99ribu docs (README, OBSERVABILITY, TASKS) at `/usr/bin/google-chrome`.
7. Added `xterm-ghostty:RGB` to tmux terminal features.

### Verification

- `playwright screenshot --channel chrome` rendered CJK and emoji; 99ribu `npm run test:prototype` passed 36/36 with Google Chrome.
- After the purge: `ssh`, `tailscaled`, `docker`, `NetworkManager`, `unattended-upgrades` enabled and active; zero failed units; only port 22 listens on all interfaces.
- Result: 81 GB free (62%), about 8 GB RAM free.
- `tailscale netcheck`: UPnP mapping works, but the router WAN address is private (ISP CGNAT), so off-LAN peers still relay via DERP Singapore.

### Deferred

- Router IPv6 or an ISP public IP for direct off-LAN Tailscale paths.
- Client-side `~/.ssh/config` and Ghostty `ssh-terminfo` on each controlling device (see `config/ai/project-memory/linux-rich-maintenance.md`).

## 2026-11-05 — `rich` — Multi-AI isolation, Postgres vault and SSH client alignment

### Scope

- Stop parallel AI sessions (claude, pi, codex, omp, agy) from colliding on one checkout, one database, one Chrome profile or one host port.
- Back up every running project Postgres to the 1 TB HDD with verification.
- Correct the documented `Host rich` client snippet.

### Initial state

- Six tmux sessions ran AI CLIs at once, one per project checkout.
- Postgres containers: tokophi on `0.0.0.0:5433` (LAN/Tailnet, default dev credentials); clinic-dashboard on `127.0.0.1:5432` (+5433 backup profile); geraicuan's default `55433` blocked by geraiexpress PostgREST; bukalaris ~1.6 GiB RAM with 122 leftover test databases; no project had a `mem_limit`. Only 99ribu used a per-worktree Unix socket.
- geraiexpress isolated tests created a Docker bridge per run, so `tailscaled` logged `LinkChange: major, rebinding`; killed runs left `gxdb-audit-<pid>-*` orphans.
- The documented `Host rich` snippet used `RequestTTY yes` + `RemoteCommand tmux new -A -s main`, which breaks `scp`, `sshfs`, `rsync` and non-interactive `ssh rich <cmd>`.

### Actions

1. Created the vault `/data/backups/{postgres,worktrees,registry}` (0700) and the port registry `/data/backups/registry/project-ports.tsv` (Unix-socket tier, `127.0.0.1` 10-port blocks in `55100-55999`, `5432`/`5433` reserved vacant).
2. Installed device-local `~/.local/bin/rich-db` (status, verified backup, port registry, socket compose template, worktree archive, orphan reaper) with user timers `rich-db-backup.timer` (03:15/15:15 WIB, Persistent) and `rich-db-reap.timer` (15 min).
3. Installed `~/.local/bin/rich-session` (agent radar, free terminal, `rich work <slug> [task]` worktrees under `~/Projects/.worktrees/<slug>/<task>`) and `~/.config/ai-local/rich-shell-guard.sh` (per-session `AI_FOCUS_SESSION`, prompt before a second AI in one checkout).
4. `chrome-devtools` MCP for Claude now runs `--isolated --no-usage-statistics`.
5. Review fixes applied the same day (originals kept in `/data/backups/registry/tool-backups-20261105T153829/`):
   - `rich-db`: the reaper treated any process whose cmdline contained `node` as the live owner, so a reused PID kept orphans and an unrelated runner could be mistaken; owner must now be `test-backend-isolated`. Networks need the same minimum age as containers before removal, read from `docker network inspect` JSON; an unknown or unparsable creation time keeps the network. Worktree containers (`.worktrees/<slug>/<task>`, `<slug>-wt/<task>`) now back up under their project instead of a folder named after the task, each in its own `<worktree>~<hash>/` subfolder so equal DB names cannot overwrite each other; the primary checkout keeps the project folder. A failed roles snapshot or database listing is counted as a failure instead of being skipped or crashing the whole run. Dump names keep a hash suffix when sanitizing changes a DB name, so two databases cannot share a retention group. `ports --allocate` is locked, idempotent and bounded to `55990`. SHA-256 is streamed.
   - `rich-session`: a symlinked `.worktrees/<slug>/<task>` can no longer place a worktree outside the root; conflicts count AI panes in subfolders and in detached sessions; long session names get a hash suffix instead of colliding on truncation.
   - `rich-shell-guard.sh`: other windows of the same tmux session now count as a conflict (compares pane IDs, not session names).
6. Corrected `Host rich` in `config/ai/project-memory/linux-rich-maintenance.md`: `TCPKeepAlive no`, `ServerAliveInterval 15`, `ServerAliveCountMax 20`, `ControlMaster auto`; no `RemoteCommand`/`RequestTTY`. Bulk/tunnel connections need `-S none`; `ControlMaster=no` alone reuses an existing master.

### Verification

- After the fixes: `rich-db self-test` 35 assertions (worktree subfolders, PID reuse, Docker timestamps incl. offsets, recent/old network creation and fail-closed inspect failure, invalid JSON, unparsable, zero and null creation times, bounded locked allocation) and `rich-session self-test` 13 assertions pass; guard prompt shown and declined in a pty against a fake tmux pane list; `rich-db status` and a reaper dry run on the live fleet; all five running containers still map to their existing project folder.
- Before the fixes (timer run 15:19 WIB): 39 verified dumps, 0 failures, roles snapshots present, 78 `.sha256` files. That run predates the worktree subfolder change; no worktree container was running.
- `rich-session resolve-work` reports the live conflict on an occupied checkout and rejects `../x` and `bad/task`.
- `ai-mcp-sync --check`, `ai-policy-lint`, `system-map --check`: see the delivery run for TASK-190.

### Deferred

- Per-repo compose migrations (tokophi `0.0.0.0:5433` → `127.0.0.1:55131`, clinic-dashboard `5432/5433` → `55141/55143`, geraicuan `55433` → `55151`, kliniknuma, bukalaris `mem_limit` and test-DB cleanup, geraiexpress shared-netns tests) wait until each project's agent is idle; queue in the blueprint.
- tokophi remains reachable on `0.0.0.0:5433` until that migration.

## 2026-11-06 to 2026-11-07 — `rich` — Machine tidy, parallel AI limits, an orphaned build, data routing

### Scope

- Make `rich` (4 cores, 31 GB, SATA SSD without DRAM) comfortable for several AI terminals and projects at once, and safe to resume after a forced close.
- Record what was measured, what was changed, and what is still open. Ownership of the rules is in `docs/parallel-ai-dev-machine.md` and the device-local `device.md`; this entry is the dated evidence.

### Initial state

- SSD at 83% used; load 5 to 7 with no heavy job queued; test and build jobs from several terminals overlapped.
- 51 stale per-test PostgreSQL databases, 26 per-task Docker images and a large Docker build cache on the SSD.
- Observed: a process `npm prune --omit=dev` (its parent was a `sh -c 'npm run build && npm prune --omit=dev && rm -rf .next/cache'` shell whose own parent PID was 1) had been running for 1 day 9 hours. `ps` reported 421% CPU, which is cumulative CPU time divided by elapsed time (a lifetime average of about 4.2 cores); a 3-second sample taken later read about 1.5 cores. Its cgroup was a Docker container scope, not `ai-heavy.slice`, and `heavy-run --status` showed both slots free, so `heavy-run` was not accounting for it.
- Inferred, not observed: the parent command line, the start time (2026-11-06 03:04) and a `dockerd` restart at 03:12 in the journal fit a Docker image build whose client died with the daemon. No build log was kept, so this cause is a reconstruction.
- `tokophi-db` was published on `0.0.0.0:5433` (all interfaces).

### Actions

1. Froze the working state before changes (`dev-freeze`: 66 repositories, 4 GB, plus restart notes) and dumped the 51 test databases before dropping them. SSD went from 83% to 61-63%.
2. Added the queue and caps (`heavy-run`: pool slots, named locks, `ai-heavy.slice`), throwaway databases (`ai-testdb`, tmpfs), the freeze tool (`dev-freeze`) and per-device sizing (`ai-capacity`: 4 terminals comfortable, 5 maximum, 2 heavy slots, 3 children per run on this device). Commits `7957e73` and `6e38288`.
3. Owner-run, with sudo: zram swap and the `bfq` scheduler for the SATA SSD (`/etc/udev/rules.d/60-io-scheduler.rules`); apt upgrades (Docker, Tailscale, Chrome).
4. The orphaned `npm prune` and its parent were stopped by the owner with sudo, by exact PID; the process was gone at the next check. The 1-minute load average, 7.3 at the last check with the process present (5-minute value 6.8), read 4.9 at the first check after it was stopped (the 1-minute figure lags) and between 0.6 and 2.5 at later separate checks.
5. Took a full `pg_dumpall` of `tokophi-db` first, then bound it to `127.0.0.1:5433` through its compose file. Afterwards a live check found the container healthy on the same volume with 18 non-template databases and 85 tables in `public`; no matching count was taken before the change (the dump holds 1,499 `CREATE TABLE` statements across all schemas, which is not a comparable figure). The compose change is left uncommitted in that project for its own agent.
6. Port audit (read only, local view: `ss`, `tailscale serve status`, `sshd -T`; no external scan was run, so reachability from outside was not tested). Non-loopback listeners were SSH on all interfaces (port 22) and services bound to the Tailscale address; Tailscale Serve entries are marked "tailnet only" and no Funnel is configured. `sshd -T` reported `passwordauthentication no`, `permitrootlogin no`, `pubkeyauthentication yes`. `ufw` and `fail2ban` are inactive. Loopback listeners (for example the PostgreSQL containers) were not part of the non-loopback list.
7. Added `ai-capacity status` advice for long-running CPU users outside `heavy-run` (advice only; it cannot tell an orphan from a legitimate long build). Device-local `rich-archive` (dry run by default; copy, size check, then delete) moves cold session transcripts to `/data`. Data routing rule recorded in the device-local `device.md`: hot work on the SSD, cold copies on `/data`, one direction.

### Verification

- Load before and after step 4, `heavy-run --status` (both slots free) and `ai-capacity status` were read live (1-minute load average 7.3 before, with the 5-minute value 6.8 from the same reading; 4.9 right after the process was stopped, and 1.5, 2.0, 0.6 and 2.5 at separate later checks, listed without a time order). `dotuiux-test` timed out once while the process was running and passed inside the full self-test after it was gone. That is consistent with load-related timing pressure; the cause of the timeout was not isolated.
- CI: `6e2cf00` green on both jobs; the two commits before it were red on `ai-memory-route-test` (a memory file over the 12,000-byte router budget).
- `rich-archive --days 14` dry run: 747 files, 9.90 GB movable; not applied.

### Deferred

- `/etc/systemd/zram-generator.conf` has `compression-algorithm =` with `zstd` on the next line, so the active algorithm is `lzo-rle`, not `zstd`. Optional fix, needs sudo.
- Backups are written to `/data` on the same machine only. An off-machine destination is not chosen.
- The dangling Docker volumes hold development PostgreSQL data and were not deleted; their count went from 42 to 47 between 2026-11-06 and 2026-11-07 and the cause was not investigated.
- `rich-archive --apply` and the Gemini transcripts (3.7 GB older than 14 days, report only) await the owner.
- Not measured: four heavy terminals working at once after these changes.
