---
name: antigravity-cli-agy
description: "The Antigravity CLI on the Mac is the `agy` binary (not `gemini`); its subcommand is `plugin`, not `extensions`"
metadata: 
  node_type: memory
  type: reference
  originSessionId: ef4c798a-d351-4318-8a07-3088786a86d4
  modified: 2026-08-01T06:01:22.631Z
---

The Antigravity CLI is the native **`agy`** binary (normally at `~/.local/bin/agy`; verify the path and version on each device). The Gemini CLI (`gemini`) is NOT installed — and the decision was made not to install it.

**Trap: "⚠ Eligibility Check ... failed to get profile picture: TLS handshake timeout" is COSMETIC, not broken auth.** All that fails is the `peopleInfo` cache (the avatar from `lh3.googleusercontent.com`), but `server_oauth.go` escalates it to `Validation failed`, which makes it look like a login problem. Check the log at `~/.gemini/antigravity-cli/log/cli-*.log`: if it shows `OAuth: authenticated successfully` plus successful `loadCodeAssist`/`fetchAvailableModels`, the session is healthy and models still work. The fix is to restart `agy` — not to re-login, and not to delete the token. Quick verification: `agy -p "reply with exactly: OK"`. A similar timeout has also hit the `play.googleapis.com/log` telemetry endpoint — same pattern, equally transient.

**Trap:** the command circulating on the internet is `gemini extensions install <url>`. That does not work here. `agy` has no `extensions` subcommand. The correct form is:

    agy plugin install <github-url>     # accepts a repo URL directly
    agy plugin list / uninstall / disable
    agy plugin import [gemini|claude]   # absorb the neighbouring ecosystems

`agy` ingests repos carrying either `gemini-extension.json` or `.claude-plugin/` — which is why the Gemini CLI is redundant. State (conversations, logs) lives in `~/.gemini/antigravity-cli/`, so the `~/.gemini` folder exists even though the Gemini CLI is not installed.

The available model catalog is runtime-managed and changes independently of dotfiles. Verify it with `agy models`; do not preserve a model snapshot in memory.

**Decision (2026-07-12):** do not install the Gemini CLI — `agy` already covers the Gemini side, and 9router already covers the "any cheap model" side. A fifth CLI would be maintenance cost (`ai-memory-link` symlinks, `skill-update`) with no new benefit.

Plugin state is device-local and runtime-managed. Verify it with `agy plugin list`; do not preserve an installed-plugin snapshot in memory. Ponytail was removed because its persistent rules duplicate shared `AGENTS.md`; the useful review workflow now lives in the owned `lean-code-review` skill.
