# OMP Native Runtime and Default Reference

OMP uses its upstream-native runtime configuration. Dotfiles does not install,
link, or auto-load runtime settings.

[`config.yml`](config.yml) is the canonical secret-free cross-device reference
for the recommended model roles, fallbacks, and bundled-agent mapping. Load it
explicitly for a session when the device has the required providers:

```bash
omp --config ~/dotfiles/config/omp/config.yml
```

The accepted default reference (owner decision 2026-10-29) is:

| Role | Model / route |
|---|---|
| Default | Sonnet 5.5 through `9router/cc` |
| Coding and task implementation | Opus 5.5 through `9router/cc` |
| Planning and orchestration | Fable 5.1 through `9router/cc` |
| Review, security review and deep analysis | Sol 6.1 through `9router/cx` |
| Research and design | Argon 4 through native `google-antigravity` |
| Lightweight work | Flash 3.8 through native `google-antigravity` |

Native `anthropic/*` and `openai-codex/*` models remain visible alongside
9Router and Antigravity. For default, coding, task, plan, orchestrator and vision,
the first fallback is the matching native Anthropic model. Authenticate through
OMP on each device; credentials stay local. This routing preference does not
assert that a provider account is healthy or has quota.

Exact efforts, auxiliary roles, bundled-agent mappings and fallback order live
in `config.yml`. Sonnet remains the general default; choosing Opus for development
does not make it the default for every task. Package multipliers across vendors
are not interchangeable token budgets or evidence of model quality.

The reference also records the accepted interactive retry policy (owner
decision 2026-10-30): six retries, a 120 000 ms ceiling on the gateway's
`retry-after`, and no immediate chain walk on a rate limit. The ceiling is a
give-up threshold, not a sleep cap: the earlier 5000 ms failed every 9Router
lock longer than 5 s and read as a dropped session, while Pi's 60 s default
waited them out. Measurements and the per-runtime checklist live in
[`omp-pi-9router-runbook`](../ai/project-memory/omp-pi-9router-runbook.md).
The ceiling does not bound HTTP or stream duration. Explicit reference loading
on another device must not silently revert to different upstream retry defaults.

This replaces the older `9router-fantastico` role recommendation. A device must
declare the `9router` provider in its own `~/.omp/agent/models.yml` (a local file,
not a link), and authenticate native Antigravity separately. Adapt the URL and
secret reference to that device; this example contains no usable credential:

```yaml
providers:
  9router:
    baseUrl: <device-specific 9Router /v1 URL>
    api: openai-completions
    apiKey: "!secrets-env get NINEROUTER_REMOTE_KEY"
    authHeader: true
    discovery:
      type: proxy
```

Validate the selected reference without inference:

```bash
PI_CONFIG_FILES=~/dotfiles/config/omp/config.yml omp-runtime-report
```

Provider compatibility remains device-local. With OMP 18.13.3 and 9Router
0.5.112, the working Pi client was used as an inference control: Pi completed a
Claude tool roundtrip while OMP's native `anthropic-messages` request failed with
an upstream 429 wrapped as 503. Changing the URL or disabling context management
alone did not fix it. OMP's supported `openai-completions` gateway route completed
the same tool flow. This isolates a transport/request compatibility problem;
it does not identify the exact upstream validation rule behind the 429.

For Claude `cc/...` models, merge the non-secret `modelOverrides` from
[`9router-compat.yml`](9router-compat.yml) into the device's own `models.yml`:

- `api: openai-completions` uses the gateway's `/v1/chat/completions` surface.
- `thinking.mode: effort` preserves the role's low/medium/high reasoning choice;
  `compat.supportsReasoningEffort: true` sends `reasoning_effort`.
- For verified disable-capable models (Opus 5, Sonnet 5/5.5 and Haiku 4.5), `requiresEffort: false` and a
  lowest `minimal` tier mapped to wire value `none` preserve `:off`. On this
  gateway, that `minimal` tier also means disabled; explicit `low` still sends
  `low`. Opus 5.5 and Fable 5/5.1 require thinking; `off` clamps to their lowest
  supported effort. Fable 5 returned HTTP 400 for disabled thinking despite the
  catalog advertising that it could disable it; the compatibility reference
  corrects that metadata using `requiresEffort: true`.
- `compat.supportsStrictMode: false` keeps tool schemas compatible with this route.
- Discovery continues to own context/output limits and input capabilities.

Pi can retain its working `anthropic-messages` configuration. Native OMP
`anthropic/*` and the independent Claude CLI keep their own protocols and logins.
Do not copy Pi's auth store, credentials or client-identity headers into OMP.
Codex `cx/...` continues using `compat.supportsReasoningEffort: true` on the
OpenAI-compatible gateway route.

The reference is never installed or auto-loaded. Revalidate it against the
installed runtime and proxy after upgrades. The credential-free native-runtime
regression exercises all seven advertised Claude IDs, high/low effort, explicit
`off` on every verified disable-capable row, required-thinking clamping, actual
file reads and full tool continuation:

```bash
~/dotfiles/bin/omp-9router-claude-test
```

This local fixture proves the wire contract, not upstream quota or entitlement.
Real provider acceptance must also be checked with fallback disabled, so success
cannot silently come from native Anthropic instead of 9Router.

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
