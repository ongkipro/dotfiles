# Optional Pi Configuration

Pi and OMP may use 9Router. Claude Code, Codex and Antigravity keep their own
native logins. Each runtime owns its authentication; sharing a gateway does not
copy credentials or make Pi an OMP prerequisite.

## Tracked reference and local state

- `settings.json` seeds a fresh Pi profile with `9router-fantastico/cx/gpt-6.1-sol`.
  The provider label preserves existing Pi authentication. Authenticate that
  provider through Pi before using it; a second label does not inherit its key.
- `models.template.json` is a non-secret starter. Set its copied `baseUrl` for
  the actual device: localhost only on the gateway host, otherwise the owner's
  configured remote endpoint. The helper contains no fixed tunnel address.
- `extensions/compact-free/` tries cataloged gateway models, then Pi's active
  model. The historical extension name does not promise free inference.
  Only a complete nonempty summary may replace conversation history.

Use `pi-9router-restore` to seed missing settings/models and restore the extension.
It preserves existing real settings files and does not install or start 9Router.
It can enable the optional Linux Pi catalog-sync service; inspect the device's
endpoint before enabling it. Runtime settings must remain local copies, not
symlinks into the repository.

## Catalog synchronization

Run `pi-9router-sync.js` to refresh existing Pi providers named `9router` or
`9router-*`. It uses each provider's configured `/models` endpoint, reads no auth
store, preserves provider credentials/custom fields and unrelated providers,
and replaces the model list only after successful validation. Protected catalog
responses fail closed; no credential is borrowed from Claude, Codex or OMP.

The installed 9Router catalog exposes discovery without an inference key.
Inference remains authenticated by Pi. Context/output limits and capabilities
come from the catalog. Claude uses `anthropic-messages`; adaptive rows enable
Pi's `forceAdaptiveThinking`, with strict tools disabled. Codex uses
`openai-completions` with `supportsReasoningEffort`. Revalidate compatibility
against the installed Pi and gateway after upgrades.

The selected device can retain `9router-fantastico` while OMP calls its provider
`9router`: verify the same intended endpoint and available model IDs, rather
than copying accounts or demanding identical provider labels.

## Verification and updates

```bash
pi-update-safe --self
pi auth check --provider 9router-fantastico --model cx/gpt-6.1-sol --json
pi --list-models
~/dotfiles/bin/pi-9router-restore-test
~/dotfiles/bin/pi-compact-test
```

Do not add `--credentials` to an auth check or print token commands. Registry
checks do not prove inference: use a small real tool roundtrip when changing
transport or authentication. Changelog entries titled `Fixed` describe release
history; they are not runtime error reports.

Keep `~/.pi/agent/{settings.json,models.json,auth.json,trust.json}`, sessions and
runtime extension state local. OMP manages its own configuration independently.
Shared context and skills are reconciled through `ai-memory-link` and
`skill-update`; supported MCP wiring uses `ai-mcp-sync`.
