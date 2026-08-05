# Shared AI Context

This directory is the single tracked source for cross-CLI operating rules and
durable memory.

```text
AGENTS.md       Always-loaded policy kept deliberately small
memory/         Cross-project facts loaded on demand
project-memory/ Project-specific decisions and gotchas, indexed by MEMORY.md
```

`ai-memory-link` connects `AGENTS.md` to the native context path of each
supported CLI:

| Live path | Consumer |
|---|---|
| `~/.claude/CLAUDE.md` | Claude Code |
| `~/.codex/AGENTS.md` | Codex |
| `~/.antigravity/AGENTS.md` | Antigravity (`agy`) |
| `~/.gemini/GEMINI.md` | Antigravity compatibility path, not Gemini CLI |

Pi receives the same file through the `pi()` shell wrapper. `~/AGENTS.md` must
remain absent because it would duplicate the same policy for sessions below the
home directory.

Owned skills live only in `~/dotfiles/skills/local/`. Claude and Pi discover the
shared directory through symlinks; Codex and Antigravity use `skill-list` and
read the selected `SKILL.md` directly.

Edit tracked memory only for durable, verified facts. Device-private facts belong
in `~/.config/ai-local/`; secrets and authentication state never belong here.
Review and commit changes explicitly with Lazygit. See `README.md` and
`docs/ai-memory-sync.md` for setup and synchronization details.
