# Shared AI Context

This directory is the single tracked source for cross-CLI operating rules and
durable memory. One source, one small adapter per runtime — never one identical
megaprompt for every CLI.

```text
CORE.md             Shared policy every runtime needs in nearly every session (≤ 8 KB)
adapters/<rt>.md    Runtime facts only: paths, hooks, skills, ownership (5 runtimes)
context/<rt>.md     GENERATED: header + CORE.md + adapters/<rt>.md (committed, ≤ 10 KB)
policies/           Shared policy referenced by several skills (planning artifacts)
claude-home-memory/ Minimal bootstrap loaded only for Claude sessions at $HOME
memory/             Cross-project facts loaded on demand
project-memory/     Project-specific decisions and gotchas, indexed by MEMORY.md
```

Precedence is one line and lives in `CORE.md`: repository disk and executable
checks > repository contracts > project memory > shared memory > history.
Methodology belongs to the skill that owns it, never to the always-loaded core.

Two axes, kept apart deliberately. **Memory and skills are one shared source** for
every runtime. **How an AI works a task** — planning depth, subagents, search,
orchestration — is the runtime's own; dotfiles states boundaries (approval,
secrets, Git, source of truth, evidence) and facts, not working style. An adapter
that starts telling a runtime how to think is drifting back into one prompt for
all (TASK-087).

## Runtime wiring

`ai-memory-link` re-renders any stale `context/<rt>.md`, then links each runtime's
native global context path to its own rendered file. `ai-memory-link --check`
writes nothing and fails on a stale render; `ai-policy-lint` runs it and enforces
the byte budgets, and `ai-doctor` checks the live links.

| Live path | Rendered file | Consumer | How verified |
|---|---|---|---|
| `~/.claude/CLAUDE.md` | `context/claude.md` | Claude Code | loaded into this Claude Code session, 2026-09-15 |
| `~/.codex/AGENTS.md` | `context/codex.md` | Codex CLI | `codex debug prompt-input` renders it (Codex 0.154, 2026-09-15; needs no model quota) |
| `~/.gemini/GEMINI.md` | `context/antigravity.md` | Antigravity (`agy`) | strace, agy 1.2.0, 2026-09-15 |
| `~/.omp/agent/AGENTS.md` | `context/omp.md` | OMP | strace, OMP 18.1.x, 2026-09-15 |
| `pi()` `--append-system-prompt` | `context/pi.md` | Pi | `config/shell-tools.sh` |

agy opens only `~/.gemini/GEMINI.md` and probes `~/.gemini/AGENTS.md` and
`~/.gemini/config/{AGENTS,GEMINI}.md`. `~/.antigravity/AGENTS.md` and
`~/.gemini/antigravity-cli/{AGENTS,GEMINI}.md` are never read; `ai-memory-link`
removes them when they are dotfiles-managed links and leaves anything else alone.
`~/AGENTS.md` must remain absent because it would duplicate the policy for every
session below the home directory.

To change policy: edit `CORE.md` (only if nearly every session in every runtime
needs it) or one adapter, run `ai-memory-link`, and commit the source together
with the re-rendered `context/` files.

Claude's `$HOME` project entry links to a device-local, read-only copy of
`claude-home-memory/MEMORY.md`. This prevents Claude auto-memory from writing
unrelated project facts into tracked dotfiles. Project memory is selected on
demand by `ai-memory-access`; it is never exposed as one ambient directory.

Owned skills live only in `~/dotfiles/skills/local/`. `skill-update` reconciles
the runtime-native discovery adapters, including OMP's
`~/.omp/agent/skills`; Codex keeps its built-in `.system` skills alongside
per-skill links to the owned source. Only skill metadata is loaded up front;
bodies load on demand. Codex shortens every description to ~250 characters once
many skills are installed (measured with `codex debug prompt-input`), so an owned
skill states what it does and its boundary within the first ~240 characters;
`skill-check` warns when a "Not"/"NOT" boundary starts later.

OMP otherwise stays upstream-native. Dotfiles does not install its
`config.yml`, `models.yml`, or `agents/`, does not wrap the `omp` command, and
does not inject `PI_CONFIG_FILES`. See `config/omp/README.md`.

## Rules for working on dotfiles itself

Moved here from the former always-loaded `AGENTS.md`; they only matter when the
working tree is this repository.

- **Visibility is not a secrets boundary.** `ongkipro/dotfiles` visibility toggles;
  verify with `gh api repos/ongkipro/dotfiles --jq .visibility` before trusting any
  claim of it. History and what to keep out of commits: `docs/repo-visibility.md`.
- **Device contributions are additive.** A device may add memory, owned skills, its
  own `devices/<host>.md`, or a reviewed lesson, but must not install OMP runtime
  settings, model catalogs, agent definitions, or provider routing. Device-only
  facts go to `~/.config/ai-local/`.
- **Straight to main.** dotfiles is a config repository whose workflow commits to
  `main`; commit and push still happen only on explicit request.
- **Hooks bind only where wired.** `~/.claude/settings.json` is device-local, so
  hook wiring is reconciled from `config/ai/claude-hooks.json` by
  `ai-hooks-install` (run it on a new device and after a settings reset;
  `--check` reports drift, and `ai-doctor` runs it). `hooks/git-guard.sh` denies
  force-push and `--amend` and re-prompts mirror/prune, remote-branch deletion, and
  forced refspecs. It cannot see Git launched inside Lazygit, wrapped in another
  interpreter (`bash -c`), or via `$(which git)`. `hooks/memory-usage.sh` records
  only which memory files were routed and their byte counts, and fails open.
  Both hooks exist only in Claude Code; Codex, Antigravity, Pi, and OMP rely on
  the Git rules in `CORE.md` alone.

## Learning loop

All supported CLIs receive the same learning rule through `CORE.md`. After a
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
