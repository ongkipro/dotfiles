---
name: linux-rich-maintenance
description: "Boot and service failure cases for the rich Ubuntu desktop (Dell OptiPlex 7050), with the host facts that decide whether a fix is safe there"
metadata:
  node_type: memory
  type: reference
  modified: 2026-08-16
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
- Desktop with a display manager, not a headless server — so "no console output
  during boot" is a cosmetic loss, not a diagnostic one.


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

The lesson above says "unencrypted headless host". `rich` is unencrypted but it
is a desktop with a display manager, not headless — and the fix still applied,
because what makes removing `splash` safe is the absence of an encrypted volume
needing a passphrase prompt, not the absence of a screen. Losing the graphical
splash on a desktop costs appearance, nothing else.

Applied and verified on `rich` 2026-08-16: `GRUB_CMDLINE_LINUX_DEFAULT="quiet"`
with `splash` removed, `pgrep plymouthd` empty, and `systemctl is-system-running`
reporting `running` rather than `starting`.
