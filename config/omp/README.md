# OMP Native Runtime and Default Reference

OMP runs on its upstream defaults (owner decision 2026-10-31). Dotfiles does not
install, link, wrap, or auto-load runtime settings, and it no longer recommends
model roles, fallback chains, retry values or task limits.

[`config.yml`](config.yml) is intentionally empty (`{}`): a reference that adds no
override. `omp-effective-routing-test` fails if anyone adds one, so a guessed
setting cannot quietly become policy again. Choose models in OMP with `/model`;
OMP saves the choice in the device's own `~/.omp/agent/config.yml`.

Upstream already covers what an earlier override tried to fix. With OMP 18.13.3
the defaults are `retry.maxRetries: 10` and `retry.maxDelayMs: 300000`.
`maxDelayMs` is a give-up ceiling against the gateway's `retry-after`, not a sleep
cap: a custom 5000 ms made every 9Router lock longer than 5 s read as a dropped
session. Details and measurements are in
[`omp-pi-9router-runbook`](../ai/project-memory/omp-pi-9router-runbook.md). Read
the effective values from the installed version with `omp config list`, not from
this file.

## Connecting 9Router

A device declares the `9router` provider in its own `~/.omp/agent/models.yml` (a
local file, not a link). Adapt the URL and secret reference to that device; this
example contains no usable credential:

```yaml
providers:
  9router:
    baseUrl: <device-specific 9Router /v1 URL>
    apiKey: "!secrets-env get NINEROUTER_REMOTE_KEY"
    authHeader: true
    discovery:
      type: proxy
```

This is the whole declaration, following OMP's documented
[custom providers](https://omp.sh/docs/custom-models): `discovery: proxy` lists the
gateway's models and derives each model's API from the endpoint types it
advertises, and `authHeader: true` sends the bearer token the gateway expects.
Check it with `omp models 9router`.

Verified 2026-10-31 on OMP 18.13.3 and 9Router 0.5.112 with OMP's default
settings and `retry.modelFallback: false`, so success cannot come from native
Anthropic: a file-read tool roundtrip passed on Sonnet 5.5, Opus 5.5, Fable 5.1,
Haiku 4.5 and Sol 6.1 Terra, and `:off`/`:minimal`/`:high` efforts all completed;
six parallel Sonnet and Opus requests passed 6/6. The per-model `modelOverrides`,
`api`, `disableStrictTools` and `supportsStrictMode` entries kept in
[`9router-compat.yml`](9router-compat.yml) were not needed. That file stays as
historical design evidence from an earlier debugging session and is not
referenced by any live configuration. Revalidate after an OMP or 9Router upgrade:

```bash
printf 'retry:\n  modelFallback: false\n' > /tmp/nofb.yml
omp -p --model 9router/cc/claude-sonnet-5-5 --config /tmp/nofb.yml \
  'Read marker.txt with your read tool and reply with only its exact line.'
```

Native `anthropic/*`, `openai-codex/*` and Antigravity models keep their own
logins. Do not copy Pi's auth store, credentials or client-identity headers into
OMP. `omp-9router-claude-test` is a credential-free wire regression for the
chat-compatible transport; it proves the request shape, not upstream quota.

The remaining custom model catalog, agent definitions, routing prose, and
overlays are retained as historical design evidence. Installers do not link
them, `config/shell-tools.sh` does not inject them, and `ai-doctor` treats a
live link from `~/.omp/agent/{config.yml,models.yml,agents}` back here as drift.

Dotfiles continues to provide OMP with:

- shared core plus the OMP adapter through `~/.omp/agent/AGENTS.md` (rendered `config/ai/context/omp.md`);
- owned skills through `~/.omp/agent/skills`.

## Defaults and targeted repair

Prefer upstream behavior settings and a small device-local set of intentional
model choices. A whole-directory reset also discards useful provider/session
state and shared-context links; it is not a routine update procedure.

1. Run `omp update --check`, then `omp update` when an update is wanted. Restart
   an already running OMP session to use the new executable.
2. Use `omp config path` to identify the active profile. Inspect only relevant
   non-secret settings; `omp config get` can print credential values, whereas
   `omp config list --json` masks schema-declared credentials.
3. Compare with upstream defaults using an isolated agent directory, not by
   deleting the real profile. Back up the active config outside the repository
   with private permissions before a repair.
4. Run `omp-runtime-report`. Check available selectors with `omp models --json`
   and use `omp models --kind all --json` when image or other auxiliary roles
   are involved. A bare selector inherits effort; `:auto` is native automatic
   effort and `:off` disables thinking. Concrete efforts must use native names; declared thinking levels are checked
   when available. Nonthinking models may clamp a valid effort natively.
5. Repair only stale choices using native `omp config set`, or remove a specific
   unwanted global setting with `omp config reset <key>`. Other configured
   layers may still supply it; reset does not always mean the built-in default.

Do not infer live reachability, quota, image quality, or development performance
from registry validation. Retired files under `overlays/` are historical settings
examples: their syntax may still load, but their old selectors are not certified
against today's providers. Revalidate an overlay before explicitly selecting it.

Official references: [settings](https://github.com/can1357/oh-my-pi/blob/main/docs/settings.md),
[model resolution](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/config/model-resolver.ts).

## Memory boundary

OMP uses the same curated memory lifecycle as the other supported AI CLIs.
Cross-device durable memory lives only in `~/.config/ai/memory/` and reaches OMP
through the shared core routing contract (`config/ai/CORE.md`). After OMP completes and
verifies non-trivial work, a durable reusable lesson may enter the same store
through `ai-learn capture`, human-readable review, and explicit
`ai-learn promote ... --yes`.

OMP's separate native memory backend stays off. Its empty-payload warning
describes that native backend only; it does not mean shared dotfiles context is
missing. Never auto-ingest raw OMP rollouts or create a second generated memory
store beside the curated cross-CLI source.

OMP owns settings, models, agents, provider routing, auth, sessions, updates,
and workspace behavior. No shared MCP file exists today. If one is introduced,
it must be secret-free, use OMP's native `~/.omp/agent/mcp.json` path, and keep
project-specific MCP configuration in the project repository.

The reference records selectors, not connected-account state. Authentication,
quota, provider health, profiles, sessions, and temporary capacity choices stay
device-local. A device may use OMP's native configuration or the explicit
reference overlay without making runtime state repository-owned.
