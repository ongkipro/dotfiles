# Retired OMP Overrides

OMP uses its upstream-native runtime configuration as of 2026-08-24.

Files in this directory are retained only as historical design evidence while
the pending repository cleanup is reviewed. Installers do not link them,
`config/shell-tools.sh` does not inject them, and `ai-doctor` treats any live
link from `~/.omp/agent/{config.yml,models.yml,agents}` back here as drift.

Dotfiles continues to provide OMP with:

- shared context through `~/.omp/agent/AGENTS.md`;
- owned skills through `~/.omp/agent/skills`.

OMP owns settings, models, agents, provider routing, auth, sessions, updates,
and workspace behavior. No shared MCP file exists today. If one is introduced,
it must be secret-free, use OMP's native `~/.omp/agent/mcp.json` path, and keep
project-specific MCP configuration in the project repository.
