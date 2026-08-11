# Runtime-Neutral 9Router Configuration

9Router is an optional gateway capability shared by runtimes. It is not owned by
Pi, and Pi is not required to restore or use the generic gateway configuration.
Runtime/provider availability and service status remain machine-local.

## Tracked files

- `aliases.json` — non-secret model aliases.
- `runtime-package.json` — manifest copied to
  `~/.9router/runtime/package.json` for user-writable runtime dependencies.
- `pi-extra-models.json` — optional Pi-only model metadata; the generic restore
  does not install it.

The generic restore path is:

```bash
~/dotfiles/bin/9router-restore
```

It restores shared config and the platform user service without touching
`~/.pi`. The optional `pi-9router-restore` adapter adds Pi settings/model sync
and delegates generic setup to this helper.

## Remote credential contract

The runtime-neutral local credential file is:

```text
~/.config/ai-local/credentials/9router-remote-key
```

It is never tracked, printed, or globally exported. Shell wrappers read it only
when `NINEROUTER_REMOTE_KEY` is not already set and inject the value only into
the OMP child process. A missing credential leaves OMP available; only the
optional provider that needs the key is unavailable.

Legacy Pi users may explicitly run `9router-credential-migrate`. The helper
copies the `9router-fantastico` key to the neutral path with mode `0600`, refuses
to overwrite an existing destination, leaves the source untouched, and does not
print the value.

## Capability boundary

Image generation belongs to the runtime-neutral `9router` skill and the
OpenAI-compatible `/v1/images/generations` API. Do not make a Pi extension the
owner of this capability.

Never back up `~/.9router/db/`, `auth/`, `jwt-secret`, `machine-id`, tunnel state,
logs, or any credential-bearing runtime file.
