# OMP Native Runtime and Default Reference

OMP uses its upstream-native runtime configuration. Dotfiles does not install,
link, or auto-load runtime settings.

[`config.yml`](config.yml) is the canonical secret-free cross-device reference
for the recommended model roles, fallbacks, and bundled-agent mapping. Load it
explicitly for a session when the device has the required providers:

```bash
omp --config ~/dotfiles/config/omp/config.yml
```

Its `task`/`slow` roles and sol fallbacks use `9router-fantastico/cx/gpt-6-sol`
(owner decision 2026-09-24, TASK-091), so the device must declare that provider
in its own `~/.omp/agent/models.yml` — a local file, not a link:

```yaml
providers:
  9router-fantastico:
    baseUrl: <9Router /v1 URL from this device's ~/.config/ai-local/ notes>
    api: openai-completions
    apiKey: "!secrets-env get NINEROUTER_REMOTE_KEY"
    authHeader: true
    discovery:
      type: openai-models-list
```

Verify with `omp -p --model 9router-fantastico/cx/gpt-6-sol "ping"`.

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
