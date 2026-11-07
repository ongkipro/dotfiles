---
name: linux-rich-maintenance
description: "Headless rich Ubuntu dev server (Dell OptiPlex 7050): host facts that decide whether a fix is safe, boot failure cases, and remote access over Tailscale"
metadata:
  node_type: memory
  type: reference
  modified: 2026-11-05
---

# Linux `rich` Maintenance

Reusable decisions and failure-prevention rules for `rich` only. `cuan` is a
different machine with different hardware and its own file — see
[[linux-cuan-maintenance]]. Dated execution history belongs in
`docs/linux-maintenance-log.md`, not here.

## Host facts that change what is safe

Verified on disk 2026-08-16. These are the facts a fix should be checked
against before it is applied, because each one makes some remedy safe that
would be destructive on a different box.

- Dell OptiPlex 7050 desktop, Ubuntu 24.04.4 LTS, user `ongki`.
- **No encrypted volumes** (`lsblk` reports zero `crypt` devices). Nothing here
  needs a passphrase prompt at boot, which is what makes removing the graphical
  splash safe. On a machine with an encrypted root, removing it would take away
  the prompt the user types into.
- **Headless since 2026-11-03**: GNOME, gdm, xorg, snapd and the audio/portal
  daemons were purged; default target is `multi-user.target` and
  sleep/suspend/hibernate are masked. A broken network or sshd now means a
  physical console visit, so keep `network-manager`, `openssh-server` and
  `tailscale` marked manual and simulate (`apt-get -s`) every purge/autoremove.
- Single system browser: Google Chrome `.deb` at `/usr/bin/google-chrome`
  ([[playwright-browser-setup]]). `gnome-keyring` stays: `login.keyring` holds
  credentials.
- BIOS AC power recovery is on; Tailscale key expiry is disabled for `rich`.

## Remote access

- Reach it as `ssh rich` through Tailscale MagicDNS on every network; never by
  LAN IP. Server sshd is key-only with `ClientAliveInterval 15` x 20.
- The home ISP uses CGNAT (router WAN is a private address), so router UPnP
  works but cannot open the ISP NAT: off-LAN peers relay through DERP Singapore
  (about 55 ms) unless the other side has easy NAT. Remedies in order: router
  IPv6, a public IP from the ISP, or a Tailscale peer relay on a public VPS.
- No mosh (user decision 2026-11-03: no scrollback, no forwarding, UDP often
  blocked). Session survival comes from tmux plus this client config, matching
  the server's `TCPKeepAlive no` and `ClientAliveInterval 15` x 20:

```sshconfig
Host rich
  HostName rich
  User ongki
  TCPKeepAlive no
  ServerAliveInterval 15
  ServerAliveCountMax 20
  ControlMaster auto
  ControlPath ~/.ssh/cm-%C
  ControlPersist 10m
```

- Never put `RemoteCommand tmux ...` or `RequestTTY yes` in `Host rich`: they
  break `scp`, `sshfs`, `rsync` and `ssh rich <command>`. Attach explicitly
  (`ssh -t rich tmux new -A -s main`) or through the controlling device's
  `rich` helper. Bulk transfers and tunnels need their own TCP connection so
  they never stall the multiplexed interactive session over DERP: pass
  `-S none` (or `-o ControlPath=none`). `-o ControlMaster=no` alone still
  reuses an existing master through `ControlPath`.

- Ghostty runs only on the controlling device (the Mac that opens the SSH
  session), never on `rich`. That device's Ghostty config
  (`~/.config/ghostty/config`) gets `shell-integration-features = ssh-terminfo`.
  The server side is already done: `~/.terminfo` on `rich` holds
  `xterm-ghostty` and tmux maps `xterm-ghostty:RGB`.

## Multi-AI sessions and per-project databases (2026-11-05)

Several AI CLIs run at once on `rich`, one tmux session each. Device-local
tools enforce isolation; their source and the full blueprint stay outside
dotfiles (`~/.local/bin/rich-db`, `~/.local/bin/rich-session`,
`~/.config/ai-local/rich-shell-guard.sh`, blueprint
`~/Documents/work/notes/rich-ai-db-isolation-blueprint.md`). Device-local on purpose, not in dotfiles:
`rich-db`, `rich-session`, and `rich-archive` (moves session transcripts older than N days from the SSD to
`/data/backups/ai-sessions-archive-<date>/`; dry run by default, copy then verified delete). The machine-wide
rules (parallel limits, SSD for hot data and `/data` for cold copies) are in `docs/parallel-ai-dev-machine.md`
and the device-local `device.md`.

- **One AI per checkout.** A second task gets its own worktree at
  `~/Projects/.worktrees/<slug>/<task>` (branch `work/<task>`, tmux session
  `wt-<slug>-<task>`); `~/Projects/<slug>` stays the primary checkout. The
  shell guard asks before starting `claude`/`pi`/`codex`/`omp`/`agy` in a
  checkout another pane's AI already uses; `RICH_ALLOW_SHARED_WORKTREE=1`
  overrides. Each tmux session exports `AI_FOCUS_SESSION=rich-<session>`.
- **No shared Postgres.** Projects pin different majors and cluster-global
  roles. Default is a per-worktree Unix socket container
  (`network_mode: none`, no host port); stacks that need TCP get a
  `127.0.0.1` 10-port block in `55100-55999` from
  `/data/backups/registry/project-ports.tsv`. Ports `5432` and `5433` stay
  vacant so a missing `.env` fails instead of writing another project's DB.
  Never `"5433:5432"` (binds `0.0.0.0`), never a fixed `container_name:`.
- **Backups** go to `/data/backups/postgres/<project>/` (0700): one
  `pg_dump -Fc` archive per primary DB, verified with the container's own
  `pg_restore --list` and a `.sha256`, plus a plain-SQL
  `pg_dumpall --roles-only --no-role-passwords` snapshot (exit status checked,
  not archive-verified). A container from another worktree of the same
  project writes into its own `<project>/<worktree>~<hash>/` subfolder, so
  equal database names never overwrite each other. `rich-db-backup.timer`
  runs 03:15 and 15:15 WIB; 14-day retention, at least 5 per DB; `*_test` and
  `*_e2e` DBs skipped. `rich-db-reap.timer` removes `gxdb-audit-<pid>-*`
  containers and networks only when that PID is no longer the isolated test
  runner.
- **Chrome DevTools MCP** runs with `--isolated --no-usage-statistics` so
  concurrent sessions never fight over Chrome's `SingletonLock`.
- Per-repo compose migrations (clinic-dashboard `5432/5433`, geraicuan
  `55433`, kliniknuma, bukalaris RAM) wait until their agents are idle; the
  queue lives in the blueprint. tokophi was bound to `127.0.0.1:5433` on
  2026-11-07 (dump taken first; the compose change is left for that project's
  own PR).


---


## Lesson: Plymouth waiter can hold systemd boot indefinitely

### Symptom
systemctl is-system-running remained starting for six days and systemd-analyze timed out while plymouthd consumed CPU.

### Root cause
quiet splash started Plymouth, but the GDM handoff never quit plymouthd, leaving plymouth-quit-wait.service active.

### Durable invariant
A completed boot must have no running systemd jobs and systemctl is-system-running must report running or degraded for a known failure, never starting indefinitely.

### Fix
Run plymouth quit for the current boot; on an unencrypted headless host remove splash from GRUB_CMDLINE_LINUX_DEFAULT and regenerate grub.cfg.

### Regression check
systemctl is-system-running; systemctl list-jobs --no-pager; pgrep -a plymouthd; systemd-analyze

> Promoted from a reviewed local candidate on 2026-08-16.

The lesson above says "unencrypted headless host". In 2026-08 `rich` still had a
display manager (headless only since 2026-11-03) — and the fix still applied,
because what makes removing `splash` safe is the absence of an encrypted volume
needing a passphrase prompt, not the absence of a screen. Losing the graphical
splash on a desktop costs appearance, nothing else.

Applied and verified on `rich` 2026-08-16: `GRUB_CMDLINE_LINUX_DEFAULT="quiet"`
with `splash` removed, `pgrep plymouthd` empty, and `systemctl is-system-running`
reporting `running` rather than `starting`.
