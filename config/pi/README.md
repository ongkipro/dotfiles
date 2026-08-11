# Optional Pi Configuration

Pi is a supporting standalone CLI, not a control plane or an OMP prerequisite.
OMP remains fully usable when Pi is absent. The tracked Pi configuration keeps a
small standalone fallback surface and the custom `compact-free` extension.

## Tracked files

- `settings.json` — non-secret Pi defaults and optional packages.
- `models.template.json` — a non-secret starting point for machine-local Pi
  provider metadata. It is copied only when `models.json` does not exist.
- `extensions/compact-free/` — optional Pi-only conversation compaction with a
  machine-local provider fallback chain.

Image generation is not owned by Pi or a Pi package. Use the runtime-neutral
`9router` skill and its OpenAI-compatible `/v1/images/generations` API from the
active runtime.

## Restore boundaries

The generic helper restores shared 9Router config and its user service without
reading or writing any Pi path:

```bash
~/dotfiles/bin/9router-restore
```

Only invoke the Pi adapter when Pi support is wanted:

```bash
~/dotfiles/bin/pi-9router-restore
```

The adapter restores Pi settings, the compaction extension, and optional model
sync metadata, then delegates generic gateway setup to `9router-restore`. It
does not make Pi a dependency of OMP and does not overwrite an existing
`~/.pi/agent/models.json`.

## Credentials

These Pi files remain machine-local and must not be committed:

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
