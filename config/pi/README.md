# Optional Pi Configuration

Pi and OMP may use 9Router. Claude Code, Codex and Antigravity keep their own
native logins. Each runtime owns its authentication; sharing a gateway does not
copy credentials or make Pi an OMP prerequisite.

## Installation (all devices)

Pi runs from the pi.dev managed install on every device: releases live in
`~/.pi/agent/install/releases/<version>` with a pinned lockfile,
`current-version` selects one, and `~/.local/bin/pi` links to the launcher
`~/.pi/agent/bin/pi`. It does not depend on mise's Node version, so a Node
upgrade cannot strand it.

| Situation | Command |
|---|---|
| New device | `curl -fsSL https://pi.dev/install.sh \| sh && mise reshim` |
| Device still on npm global | `pi-managed-migrate` |
| Old sessions closed afterwards | `pi-managed-migrate --cleanup` |
| Check a device | `pi-managed-migrate --status` or `ai-doctor` |
| Update Pi / packages | `pi update` / `pi update --extensions` |

Rules:

- Never `npm i -g @earendil-works/pi-coding-agent`; that recreates the second
  copy and, through the mise shim, can take `pi` back to an old version.
- Do not run the bare installer on a device whose Pi sessions run from npm: it
  migrates by `npm uninstall` underneath them. `pi-managed-migrate` runs the
  same official installer with npm's `pi` hidden from `PATH`, removes only
  npm's `pi` link, runs `mise reshim`, and uninstalls the npm package only when
  no Pi process still runs from it (exit 10 until then).
- Move a running session to the managed Pi without losing it: let it reach a
  stopping point, `/quit`, then `pi --session <same session file>`. History,
  todos and the working directory come back; background tasks and subagents of
  the old process do not, so finish or checkpoint them first.
- `settings.json`, `models.json`, `mcp.json`, auth, sessions and extensions live
  in `~/.pi/agent` and are untouched by install, migration and updates.
- `pi-update-safe` and `pi-9router-sync.js` look in the managed layout first and
  fall back to npm global, so the 9Router sync keeps `official: pi catalog`.
- `ai-doctor` reports the install kind, warns while a mise shim shadows the
  managed `pi`, and warns while the npm copy is still installed.

## Review pairing

A Pi session that implements with one model has its work reviewed by a
different one. The four review models, all through `9router-fantastico`:

| Implementer (model in use) | Reviewer, first choice | Reviewer, second choice |
|---|---|---|
| Opus 5.5 (`cc/claude-opus-5-5`, `ag/claude-opus-5-5*`) | `ag/gemini-4-argon-high` | `cx/gpt-6.1-sol` |
| Sonnet 5.5 (`cc/claude-sonnet-5-5`, `ag/claude-sonnet-5-5*`) | `ag/gemini-4-argon-high` | `cx/gpt-6.1-sol` |
| Gemini 4 Argon (`ag/gemini-4-argon-*`) | `cc/claude-opus-5-5` | `cx/gpt-6.1-sol` |
| GPT-6.1 Sol (`cx/gpt-6.1-sol`) | `cc/claude-opus-5-5` | `ag/gemini-4-argon-high` |

- Opus and Sonnet are one family (Anthropic), so neither reviews the other's
  work. Sonnet 5.5 (`cc/claude-sonnet-5-5`) is the lighter reviewer for Argon or
  Sol work when a full Opus pass is not needed.
- Choose by the substance: Argon for a broad second read of plans and
  architecture, Sol for correctness, edge cases and code-level findings, Opus
  for judgment-heavy or security-sensitive review of non-Anthropic work.
- The `reviewer` subagent defaults to `cx/gpt-6.1-sol` at high thinking
  (`subagents.agentOverrides` in `settings.json`, seeded by
  `pi-9router-restore` when absent). The parent passes `model` explicitly for
  any other pairing, for example
  `{agent: "reviewer", model: "9router-fantastico/ag/gemini-4-argon-high", task: ...}`.
- If the first choice fails (quota, 401, gateway down), use the second and say
  so. If both fail, report it; never replace the review with self-review.
- Record the reviewer's real model in `delivery-ledger review-boundary
  --reviewer-model ... --reviewer-provider 9router-fantastico`.
- Verified 2026-11-10 on `dot`: all four answer through 9Router.

## Tracked reference and local state

- `settings.json` runs Pi on its documented defaults (`docs/settings.md` in the installed package):
  it sets only the startup provider/model (`9router-fantastico/cc/claude-sonnet-5-5`)
  and thinking level (`medium`; switch per task with `Shift+Tab` or `/thinking`,
  and to Opus with `Ctrl+P` when the work needs it),
  the `enabledModels` cycling list (Ctrl+P; patterns for providers a device has
  not authenticated simply do not match; it includes Opus 5.5 through 9Router's
  Antigravity route, `ag/claude-opus-5-5` and its `-high`/`-medium` variants,
  which the sync serves over `openai-completions` with tools and thinking), `quietStartup`, `hideThinkingBlock`
  (thinking shows as a `Thinking...` label, `Ctrl+T` reveals it; answers stay
  in full and tool output is already collapsed by default, `Ctrl+O`), the package set below
  (`pi-subagents` and `pi-lsp` stay pinned to their verified versions), and a
  bounded `rewind.retention`. Thinking level,
  theme, startup output and compaction stay at Pi's defaults; Pi's built-in
  compaction runs on the active 9Router model. The provider label
  preserves existing Pi authentication. Authenticate that provider through Pi
  before using it; a second label does not inherit its key.
- `packages[]` is the device-independent baseline of Pi packages (`pi-web-access`,
  `pi-agent-browser-native`, `pi-subagents`, `@narumitw/pi-lsp`, `cc-safety-net`,
  `pi-background-tasks`, `@ff-labs/pi-fff`, `@narumitw/pi-plan-mode`,
  `@juicesharp/rpiv-todo`, `pi-rewind-hook`, `@narumitw/pi-worktree`,
  `@narumitw/pi-btw`). Pi installs a missing package at
  startup, `pi update --extensions` reconciles versions, and `pi list` shows
  what a device actually resolved. The baseline is additive: a device may keep
  local packages the tracked list does not carry, and `pi-9router-restore`
  never removes them.
- `pi list` is the honest signal: a package listed without an install path is
  not in the device's package manifest. `pi update --extensions` skipped a
  scoped, version-pinned source (`npm:@scope/name@version`) on one device, so
  run `pi install npm:@scope/name@version` once to register it.
- A device that installs `pi-mcp-adapter` instead of Pi's built-in MCP
  extension must record `"extensions": ["-builtin:mcp"]` and
  `"defaultTools": ["+codemode"]` in its own `settings.json`: both register
  `/mcp`, and only the built-in extension turns codemode on by itself. Servers
  still come from `~/.pi/agent/mcp.json`, written by `ai-mcp-sync`.
- `cc-safety-net` is the Pi-side guard for destructive commands and secret-file
  reads. It does not replace the approval gates in `config/ai/CORE.md`.
- `models.template.json` is a non-secret starter. Set its copied `baseUrl` for
  the actual device: localhost only on the gateway host, otherwise the owner's
  configured remote endpoint. The helper contains no fixed tunnel address.
- `pi-fff.json` configures the `@ff-labs/pi-fff` search package (when a device
  installs it): `enableHomeDirScanning: false` stops it indexing all of `$HOME`
  when Pi starts from `~`. FFF search is then off for that session; start Pi
  from a project directory. Use `"warnOnHomeDirScan": false` instead to keep
  indexing `$HOME` and silence only the warning.
- `pi-lsp.json` routes `@narumitw/pi-lsp` to `typescript-language-server`,
  `pyright-langserver` and `bash-language-server` (install them with mise/npm;
  a missing server is skipped). The TypeScript route also needs the
  `typescript` package itself, because the language server starts that
  package's `tsserver.js`: TypeScript 7.x is the native port and ships no
  `tsserver.js`, so the route needs `typescript` 6.x or lower.

## Package set

Pi ships four tools; these packages close the gap to a full terminal coding
agent. Each was chosen because no dotfiles helper already covers it. Packages
run with Pi's permissions, so add one only after reading its source.

| Capability | Package | Notes |
|---|---|---|
| Guardrail | `cc-safety-net` | Blocks destructive commands and secret-file reads before the tool runs. Pi has no dotfiles hooks; this is its enforcement layer. Not a sandbox. |
| Plan mode | `@narumitw/pi-plan-mode` | `/plan`: read-only exploration and an approved plan before edits. |
| Worktree | `@narumitw/pi-worktree` | `/worktree`: create, inspect, switch, and prune Git worktrees in TUI while moving the active session into the new worktree directory. Registers no model tools. |
| Side thread | `@narumitw/pi-btw` | `/btw <question>`: ask side questions in an overlay thread without polluting the main conversation history or prompt cache. Registers no model tools. |
| Task list | `@juicesharp/rpiv-todo` | Model-maintained todo overlay that survives compaction. |
| Rewind | `pi-rewind-hook` | `/tree` or `/fork` restores files with the conversation. Stores snapshots under `refs/pi-rewind/store` in the project's own `.git` with a temporary index (never the working index); retention keeps it bounded. Needs a Git repository. |
| Diagnostics | `@narumitw/pi-lsp` | `lsp_diagnostics`, `lsp_fix`; see `pi-lsp.json`. |
| Search | `@ff-labs/pi-fff` | Fast fuzzy file/content search; see `pi-fff.json`. |
| Web and docs | `pi-web-access` | Search, fetch, PDF, repository and video reading. |
| Browser | `pi-agent-browser-native` + Playwright MCP | Rendered UI evidence. Playwright MCP runs headless Chrome with `--isolated` and `--output-dir /tmp/playwright-mcp`, carries a system-prompt `description`, and hides `browser_run_code_unsafe` while keeping the remaining 24 tools behind Pi's built-in `codemode`. |
| Subagents | `pi-subagents` | `scout`, `reviewer`, `oracle`, parallel or background children. Children drop the global context unless an agent sets `inheritGlobalContext`. |
| Background shell | `pi-background-tasks` | The `pi()` wrapper sets `PI_BG_FEATURES=process`: background shell tasks only. Its `attribution` default reads Claude Code account IDs from `~/.claude.json`, `delegate` duplicates `pi-subagents`, and `fusion` accepts only subscription OAuth, not a base-URL gateway. |

Considered and not installed: a per-call permission dialog (`cc-safety-net`
plus plan mode already gate the risky cases without prompting on every edit)
and bundles that also install sandboxes, model routing or memory (they overlap
`focus`, `ai-memory-route`, `ai-recall` and 9Router).

## Multi-device setup and daily controls

On a new or existing device after `git pull`:

```bash
pi-9router-restore
ai-mcp-sync
```

`pi-9router-restore` seeds missing `settings.json`, `models.json`, `pi-fff.json` and
`pi-lsp.json`, and removes the retired `~/.pi/extensions/compact-free` copy.
An existing `settings.json` gains tracked packages it lacks (matched by
package name, so a local pin wins), deduplicates repeated `packages` (keeping
any version-pinned entry) and `enabledModels` entries, guards `pi-mcp-adapter`
against colliding with `builtin:mcp` when present, and seeds missing
`enabledModels`, `rewind`, `hideThinkingBlock`, `quietStartup`, and
`defaultThinkingLevel` when absent; Pi installs added packages on its next
start. `dotsync autopull` does
not run it automatically, so third-party extension code is never installed
silently. `ai-mcp-sync` updates `~/.pi/agent/mcp.json` with the shared
Playwright MCP definition (`--isolated`, `--output-dir /tmp/playwright-mcp`,
Pi `description`, and `toolExposure`).

| Control / Command | Behavior |
|---|---|
| `Ctrl+T` | Toggle the collapsed `Thinking...` block (`hideThinkingBlock: true` keeps reasoning collapsed by default). |
| `Ctrl+O` | Toggle collapsed tool output (file reads, grep, bash). |
| `Shift+Tab` or `/thinking` | Switch thinking level for the current task (`defaultThinkingLevel: "medium"`). |
| `Ctrl+P` | Cycle across `enabledModels` (Sonnet 5.5, Opus 5.5, GPT-6.1, etc.). |
| `/plan <prompt>` | Enter read-only Plan mode (`@narumitw/pi-plan-mode`), clarify via structured questions, and review before edits. |
| `/worktree` | Create, inspect, switch, or prune Git worktrees (`@narumitw/pi-worktree`) and transfer the active Pi session into the selected worktree. |
| `/btw <question>` | Open a side-question overlay (`@narumitw/pi-btw`) without changing the main conversation history or prompt cache. |
| `/tree` or `/fork` | Navigate or branch conversation history while `pi-rewind-hook` restores tracked files to that point. |
| `/mcp` or `pi mcp list` | Inspect the connected Playwright MCP server and its `codemode` tool exposure. |

`pi-9router-restore` preserves existing real settings files and does not install or start 9Router.
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
pi auth check --provider 9router-fantastico --model cc/claude-sonnet-5-5 --json
pi --list-models
~/dotfiles/bin/pi-9router-restore-test
systemctl --user list-timers pi-9router-sync.timer
```

The `pi()` shell wrapper appends the shared context to sessions only; `auth`,
`mcp`, `config`, `install`, `remove`, `list` and `update` reach Pi unchanged.
`ai-ask pi` appends the shared `context/pi.md` itself (not the device-local
`device.md`), since scripts bypass the wrapper. It runs with the read-only
built-ins `read,grep,find,ls` and without extensions, MCP or project-local
`.pi` files, so a Pi reviewer can inspect the repository without editing it.

Do not add `--credentials` to an auth check or print token commands. Registry
checks do not prove inference: use a small real tool roundtrip when changing
transport or authentication. Changelog entries titled `Fixed` describe release
history; they are not runtime error reports.

Keep `~/.pi/agent/{settings.json,models.json,auth.json,trust.json}`, sessions and
runtime extension state local. OMP manages its own configuration independently.
Shared context and skills are reconciled through `ai-memory-link` and
`skill-update`; supported MCP wiring uses `ai-mcp-sync`.
