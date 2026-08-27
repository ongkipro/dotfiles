# OMP Native Runtime and Default Reference

OMP uses its upstream-native runtime configuration. Dotfiles does not install,
link, or auto-load runtime settings.

[`config.yml`](config.yml) is the canonical secret-free cross-device reference
for the recommended model roles, fallbacks, and bundled-agent mapping. Load it
explicitly for a session when the device has the required providers:

```bash
omp --config ~/dotfiles/config/omp/config.yml
```

The remaining custom model catalog, agent definitions, routing prose, and
overlays are retained as historical design evidence. Installers do not link
them, `config/shell-tools.sh` does not inject them, and `ai-doctor` treats a
live link from `~/.omp/agent/{config.yml,models.yml,agents}` back here as drift.

Dotfiles continues to provide OMP with:

- shared context through `~/.omp/agent/AGENTS.md`;
- owned skills through `~/.omp/agent/skills`.

## Memory boundary

OMP uses the same curated memory lifecycle as the other supported AI CLIs.
Cross-device durable memory lives only in `~/.config/ai/memory/` and reaches OMP
through the shared `AGENTS.md` routing contract. After OMP completes and
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
