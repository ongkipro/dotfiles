# Optional Pi Configuration

Pi is a supporting standalone CLI, not a control plane or an OMP prerequisite.
OMP remains fully usable when Pi is absent. The tracked Pi configuration keeps a
small standalone fallback surface and the custom `compact-free` extension.

## Tracked files

- `settings.json` — non-secret Pi defaults and optional packages. This is a
  **seed for a fresh device, not live state**. Pi rewrites its own settings during
  normal use — switching models and recording `lastChangelogVersion` both write
  here — so `pi-9router-restore` copies this file to `~/.pi/agent/settings.json`
  rather than linking it, and never overwrites an existing local copy. Linking it
  instead would dirty the working tree on every model switch and push one
  device's preference to all four. Keep the tracked defaults pointing at a
  provider `models.template.json` actually defines.
- `models.template.json` — a non-secret starting point for machine-local Pi
  provider metadata. It is copied only when `models.json` does not exist.
- `extensions/compact-free/` — optional Pi-only conversation compaction with a
  machine-local provider fallback chain.

Image generation is not owned by Pi or a Pi package. Use the runtime-neutral
`9router` skill and its OpenAI-compatible `/v1/images/generations` API from the
active runtime.

## Restore boundaries

There is no local 9Router gateway in the supported setup. Tracked OMP and Pi
providers target the authenticated remote tunnel.

Invoke the Pi adapter only when Pi support is wanted:

```bash
~/dotfiles/bin/pi-9router-restore
```

The adapter restores Pi settings and the compaction extension, installs the
remote-catalog sync helper, and leaves existing machine-local settings intact.
It does not install or start a local gateway and does not make Pi an OMP
prerequisite.

## Credentials

These Pi files remain machine-local and must not be committed:

- `~/.pi/agent/settings.json` — the live copy Pi writes to. Must be a real file,
  never a symlink back into this repository.
- `~/.pi/agent/auth.json` — Pi provider/OAuth state.
- `~/.pi/agent/models.json` — machine-local provider availability and metadata.
- `~/.pi/agent/trust.json` — trusted sessions.
- `~/.pi/agent/sessions/` — session history.

OMP does not read Pi authentication. Its optional remote 9Router credential lives
at:

```text
~/.config/ai-local/credentials/9router-remote-key
```

To copy an existing `9router-fantastico` key out of legacy Pi auth, explicitly
run:

```bash
9router-credential-migrate
```

The migration refuses to overwrite an existing destination, creates the new file
with mode `0600`, leaves Pi auth unchanged, and never prints the credential.
Provider choice, model availability, URLs, authentication, and service status
are machine-local; inspect the relevant runtime files and service manager rather
than treating this backup as current runtime state.
