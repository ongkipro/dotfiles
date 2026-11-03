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
