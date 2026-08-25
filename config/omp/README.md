# Retired OMP Overrides

OMP uses its upstream-native runtime configuration as of 2026-08-24.

Files in this directory are retained only as historical design evidence. They
must never be copied into a native OMP profile or used as a setup baseline.
Installers do not link them,
`config/shell-tools.sh` does not inject them, and `ai-doctor` treats any live
link from `~/.omp/agent/{config.yml,models.yml,agents}` back here as drift.

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

Device-local provider selection is applied with OMP's native configuration or
a one-shot `--config` overlay and is deliberately not recorded here. This keeps
connected accounts and temporary capacity choices out of the cross-device
repository.
