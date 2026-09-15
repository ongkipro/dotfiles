## Runtime adapter — Antigravity (`agy`)

- Native first: Antigravity loads this file from `~/.gemini/GEMINI.md` and owned skills from `~/.gemini/config/skills/`; keep its native rules, plugins, and MCP (`~/.gemini/config/mcp_config.json`) device-owned. `~/.gemini/` belongs to agy; never install `@google/gemini-cli`.
- Strong fit: large-context reading, visual/browser work, research, and alternate analysis. For an ordinary bounded development task, implement directly — do not turn it into a research workflow, an implementation-plan artifact, or delegation unless asked.
- No dotfiles hooks are wired into Antigravity: every Git and approval rule in the core is enforced only by your own behavior here.
