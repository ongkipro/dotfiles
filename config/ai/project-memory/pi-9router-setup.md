---
name: pi-9router-setup
description: Optional Pi adapter, remote 9Router configuration ownership, and credential-safe troubleshooting
metadata:
  node_type: memory
  type: project
---

# Optional Pi and 9Router Reference

The old June–September local-gateway/model snapshots are superseded by the
tracked [Pi adapter contract](../../pi/README.md). Dotfiles does not install or
start a local gateway. Pi is optional; OMP uses its own native configuration.

- `config/pi/settings.json` and `models.template.json` are fresh-device seeds,
  not current machine state. `pi-9router-restore` preserves existing local copies.
- Pi owns live settings and model selection. A picker can change defaults; do
  not restore an old default merely because it differs from a remembered value.
- Provider catalogs, quotas, tunnel URLs, account connections, and authentication
  are device-local. Discover them through the current supported helper/runtime
  and official documentation, not a historical list of working model IDs.
- Read [9router](../../../skills/local/9router/SKILL.md) for current gateway usage
  and [the credential section](../../pi/README.md#credentials) for the optional
  adapter's credential ownership and migration. Do not open auth/session files
  or print provider configuration that may contain secrets.
- Development credentials are accessed only through `secrets-env` under the
  shared authorization policy. Use `secrets-env list` for names and approved
  `secrets-env run -- <command>` for injection. Never source the secrets store,
  paste a token into an interpreting shell, or copy it into memory.
- A missing provider/model or quota error is not permission to change services,
  reconnect accounts, expose a listener, or re-enable a public tunnel.

Compaction semantics and source pointers: [[pi-9router-models-compaction]].
Historical service-exposure lesson: [[pi-9router-autostart-incident]]. That
incident is context, not an instruction to start a gateway on this device.
