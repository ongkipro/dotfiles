# Optional Pi Configuration

Pi and OMP may use 9Router. Claude Code, Codex and Antigravity keep their own
native logins. Each runtime owns its authentication; sharing a gateway does not
copy credentials or make Pi an OMP prerequisite.

## Tracked reference and local state

- `settings.json` runs Pi on its documented defaults (`docs/settings.md` in the installed package):
  it sets only the startup provider/model (`9router-fantastico/cx/gpt-6.1-sol`)
  and two packages (`pi-web-access`, `pi-agent-browser-native`). Thinking level,
  theme, startup output and compaction stay at Pi's defaults. The provider label
  preserves existing Pi authentication. Authenticate that provider through Pi
  before using it; a second label does not inherit its key.
- `models.template.json` is a non-secret starter. Set its copied `baseUrl` for
  the actual device: localhost only on the gateway host, otherwise the owner's
  configured remote endpoint. The helper contains no fixed tunnel address.
- `extensions/compact-free/` is an optional summarizer that tries cataloged
  gateway models, then Pi's active model. It is **not loaded by default**: Pi's
  own compaction runs on the active 9Router model (verified 2026-10-31: a
  69K-token session compacted to ~40K with the conversation facts kept). Add
  `"../extensions/compact-free"` to `packages` only to spend summaries on a
  cheaper model. Only a complete nonempty summary may replace history.

Use `pi-9router-restore` to seed missing settings/models and copy the extension.
It preserves existing real settings files and does not install or start 9Router.
On Linux it installs `pi-9router-sync.timer` (one minute after boot, then
hourly; failed runs retry every 30 s, because a boot-time run can reach the
gateway before it listens). Inspect the device's endpoint before enabling it.
Runtime settings must remain local copies, not symlinks into the repository.

## Catalog synchronization

Run `pi-9router-sync.js` to refresh existing Pi providers named `9router` or
`9router-*`. It uses each provider's configured `/models` endpoint, reads no auth
store, preserves provider credentials/custom fields and unrelated providers,
and replaces the model list only after successful validation. Protected catalog
responses fail closed; no credential is borrowed from Claude, Codex or OMP.

The installed 9Router catalog exposes discovery without an inference key.
Inference remains authenticated by Pi. Context/output limits and vision come
from the gateway; everything else comes from Pi's own generated catalog in the
installed `pi-ai` package, so a Pi upgrade updates the rows on the next sync:

- `cc/<id>` copies `anthropic/<id>`: `anthropic-messages`, thinking levels
  (including `xhigh`/`max`), prompt-cache lifetimes, strict tools, adaptive
  thinking. Its `baseUrl` drops `/v1`, because the Anthropic client appends
  `/v1/messages` itself. The mid-conversation flags (`supportsMidConvoEffort`,
  `supportsMidConvoSystemMessages`, `supportsMidConvoToolChanges`) are removed:
  with them every request carried `output_config.effort: "high"` regardless of
  the chosen level; without them `max` and `low` reach the gateway as sent.
- `cx/<id>` copies `openai-codex/<id>` thinking levels and compat and uses
  `openai-responses` (9Router's `/v1/responses`), which carries
  `reasoning.effort` up to `max`, returns reasoning summaries and reads the
  prompt cache; `openai-completions` did not.
- Other chat rows use the provider's `openai-completions` with no compat guess.
- Rows whose `/v1/models/info` kind is not `llm` (Jev is a `systemone`
  classifier) are dropped; Pi lists classifiers separately.
- Without the Pi catalog the helper falls back to conservative gateway-only
  metadata and reports it in its output.

Verified 2026-10-31 on Pi 1.4.0 and 9Router 0.5.112 with a read-tool roundtrip on
every chat row (12/13 pass; `mmf/mimo-auto` is rejected by its own upstream as
"Unsupported model", a gateway account issue). OpenCode `oc/*` rows need 9Router's
lazily installed `wreq-js` in `~/.9router/runtime`; when the service's PATH lacks
`npm` that install fails with `spawn npm ENOENT` until it is installed by hand
and the gateway restarted. Revalidate after a Pi or 9Router upgrade.

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
systemctl --user list-timers pi-9router-sync.timer
```

The `pi()` shell wrapper appends the shared context to sessions only; `auth`,
`mcp`, `config`, `install`, `remove`, `list` and `update` reach Pi unchanged.
`ai-ask pi` appends the shared `context/pi.md` itself (not the device-local
`device.md`), since scripts bypass the wrapper.

Do not add `--credentials` to an auth check or print token commands. Registry
checks do not prove inference: use a small real tool roundtrip when changing
transport or authentication. Changelog entries titled `Fixed` describe release
history; they are not runtime error reports.

Keep `~/.pi/agent/{settings.json,models.json,auth.json,trust.json}`, sessions and
runtime extension state local. OMP manages its own configuration independently.
Shared context and skills are reconciled through `ai-memory-link` and
`skill-update`; supported MCP wiring uses `ai-mcp-sync`.
