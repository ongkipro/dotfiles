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
