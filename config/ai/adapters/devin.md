## Runtime adapter — Devin CLI (`devin`)

- Runtime facts: Devin reads this from `~/.config/devin/AGENTS.md`, owned skills from `~/.config/devin/skills/`, and global MCP servers from `~/.config/devin/mcp_config.json`. Its native settings (`~/.config/devin/config.json`), plugins, and auth stay device-owned; when Claude Code is also installed, keep `read_config_from.claude` set to `false` in `~/.config/devin/config.json` so `~/.claude/CLAUDE.md` is not loaded twice. How you work the task is yours to choose; the core's boundaries and evidence rules still apply.
- No dotfiles hooks are wired into Devin CLI: every Git and approval rule in the core is enforced only by your own behavior here.
