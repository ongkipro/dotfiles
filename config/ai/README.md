# Shared AI Context

This directory is the single tracked source for cross-CLI operating rules and
durable memory.

```text
AGENTS.md       Always-loaded policy kept deliberately small
claude-home-memory/ Minimal bootstrap loaded only for Claude sessions at $HOME
memory/         Cross-project facts loaded on demand
project-memory/ Project-specific decisions and gotchas, indexed by MEMORY.md
```

Claude's `$HOME` project entry links to a device-local, read-only copy of
`claude-home-memory/MEMORY.md`. This prevents Claude auto-memory from writing
unrelated project facts into tracked dotfiles. Project memory is selected on
demand by `ai-memory-access`; it is never exposed as one ambient directory.

`ai-memory-link` connects `AGENTS.md` to the native context path of each
supported CLI:

| Live path | Consumer |
|---|---|
| `~/.claude/CLAUDE.md` | Claude Code |
| `~/.codex/AGENTS.md` | Codex |
| `~/.antigravity/AGENTS.md` | Antigravity (`agy`) |
| `~/.gemini/GEMINI.md` | Antigravity compatibility path, not Gemini CLI |
| `~/.omp/agent/AGENTS.md` | OMP native user context |

Pi receives the same file through the `pi()` shell wrapper. `~/AGENTS.md` must
remain absent because it would duplicate the same policy for sessions below the
home directory.

Owned skills live only in `~/dotfiles/skills/local/`. `skill-update` reconciles
the runtime-native discovery adapters, including OMP's
`~/.omp/agent/skills` link; Codex keeps its built-in `.system` skills alongside
per-skill links to the owned source.

OMP otherwise stays upstream-native. Dotfiles does not install its
`config.yml`, `models.yml`, or `agents/`, does not wrap the `omp` command, and
does not inject `PI_CONFIG_FILES`. OMP owns user settings, auth, sessions,
bundled agents, models, routing, and updates. A secret-free recommended role
graph is tracked at `config/omp/config.yml` for explicit cross-device reference;
it is never installed or auto-loaded. User-level MCP may be synchronized later
through OMP's native `~/.omp/agent/mcp.json` only when a real secret-free shared
configuration exists; project MCP remains repository-owned.

Edit tracked memory only for durable, verified facts. Device-private facts belong
in `~/.config/ai-local/`; secrets and authentication state never belong here.
Commit changes explicitly — either review them yourself in Lazygit, or ask the
agent to stage, commit, and push them. See `README.md` and
`docs/ai-memory-sync.md` for setup and synchronization details.

## Learning loop

All supported CLIs receive the same learning rule through `AGENTS.md`. After a
verified non-trivial fix, a CLI may summarize a reusable lesson with:

```bash
ai-learn capture \
  --title "Preserve full-replace fields" \
  --symptom "Saving metadata erased the existing body" \
  --root-cause "The read model omitted a field written by the form" \
  --invariant "A full-replace form must load every field it writes" \
  --fix "Return the field and seed the editor from persisted data" \
  --check "Edit metadata and assert the body remains byte-identical" \
  --scope project --project example --repo ~/Projects/example
```

This creates a mode-`600` candidate under
`~/.config/ai-local/memory-inbox/`; it does not modify dotfiles. Review and
promote deliberately:

```bash
ai-learn list
ai-learn show CANDIDATE.md
ai-learn promote CANDIDATE.md --target project:example --yes
```

Use `shared:workflow` for a cross-project target or `project:example` for an
existing project-memory file. Promotion validates Markdown references, archives
the candidate locally, and performs no Git action. Raw sessions are never
ingested because they mix useful lessons with secrets, private data, transient
state, and unverified reasoning.
