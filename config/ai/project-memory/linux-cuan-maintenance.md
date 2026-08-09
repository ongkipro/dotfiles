---
name: linux-cuan-maintenance
description: "Safe maintenance rules for the cuan Ubuntu workstation: policy-based tmp cleanup, selective CLI updates, service verification, and explicit destructive gates"
metadata:
  node_type: memory
  type: reference
  originSessionId: 019fdc41-cea5-7000-8c1a-7f63325a8415
  modified: 2026-08-07T22:16:12+07:00
---

# Linux `cuan` Maintenance

Use `docs/linux-maintenance-log.md` for dated execution history. This memory keeps only reusable decisions and failure-prevention rules.

## Safe standard maintenance

Use the platform's own maintenance paths; do not hand-delete broad directories:

1. Audit first: `df`, scoped `du`, cached `apt list --upgradable`, `snap refresh --list`, `fwupdmgr get-updates`, `npm outdated -g --depth=0`, and `mise outdated`.
2. Ask before sudo, cache wipes, package removal, service disruption, or reboot even when the intended maintenance is otherwise routine.
3. Use normal APT phasing: `apt-get update` followed by `apt-get upgrade`. Do not force phased updates unless a concrete fix requires them.
4. Use `systemd-tmpfiles --clean` for `/tmp`. Never blanket-delete `/tmp`; OMP, browsers, tmux, Playwright, systemd services, and active project audits keep live files there.
5. Clean package-manager caches through their native commands: `apt-get clean`, `npm cache clean --force`, and `pnpm store prune`.
6. Update AI CLIs selectively. Avoid a blanket global npm update when it would pull unrelated major releases such as npm itself or `better-sqlite3`.
7. Verify versions, the actual executable path, affected services, and one real health endpoint before declaring completion.

## Case: `mise prune` can remove useful runtimes

`mise prune -y` removed unreferenced Python 3.14.6 and PostgreSQL 16.14 on 2026-08-07. This was internally consistent with mise's tracked configs but removes tools that may still be useful for one-off work.

Future default:

```bash
mise prune --dry-run
```

Review the list before approval, then prune only accepted tools. A mise shim can remain after its runtime disappears, so `which psql` is not proof that PostgreSQL is usable; run `psql --version`.

## Case: updating a running CLI leaves stale PATH state

After `mise up`, the already-running OMP process retained a PATH entry for the removed GitHub CLI version. A fresh interactive shell correctly resolved `~/.local/share/mise/shims/gh` and the new version.

When a mise-managed tool was replaced:

- verify with a fresh interactive shell, not only an inherited non-interactive subprocess;
- restart the terminal or OMP session if the parent process predates the update;
- check both `which <tool>` and `<tool> --version`.

## Case: 9Router package updates require service verification

9Router is a running user service, not only a CLI package. After an npm update:

```bash
systemctl --user restart 9router.service
systemctl --user is-active 9router.service
curl -fsS --retry 10 --retry-connrefused --retry-delay 1 \
  http://localhost:20128/api/health
```

An immediate health request can race startup even when systemd already reports `active`; retry connection refusal briefly rather than treating the first failure as a broken installation.

## Case: Docker cleanup is a separate approval scope

Do not run `docker system prune`, image prune, volume prune, or builder prune as part of generic cache maintenance. First obtain `docker system df` with the required permissions, identify reclaimable data, and ask explicitly. Volumes can contain project databases and are never generic cache.

## Case: autoremove, journals, and reboot stay explicit

- Review `apt-get --dry-run autoremove` before removal. On 2026-08-07 it proposed removing `libfwupd2`, so safe-standard maintenance retained it.
- Journal vacuuming is optional; a modest journal is not an urgent cleanup target.
- Read `/var/run/reboot-required.pkgs` to identify why reboot is requested. Reboot remains a separate approval because it terminates OMP, terminal, browser, and development sessions.

## Last verified state

On 2026-08-07, Ubuntu 24.04.4 LTS completed safe-standard maintenance. Docker and 9Router were active, 9Router health returned `{"ok":true}`, and a later reboot remained pending for `libc6`. See the dated log for exact package versions and storage figures.
