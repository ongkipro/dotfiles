## Runtime adapter — Claude Code

- Runtime facts: Claude Code reads this from `~/.claude/CLAUDE.md`; owned skills are linked at `~/.claude/skills`. How you work the task — plan mode, subagents, search depth — is yours to choose; the core's boundaries and evidence rules still apply.
- Hooks enforce part of the Git rules here, and only here: `config/ai/hooks/git-guard.sh` (PreToolUse) denies force-push and `--amend` and re-prompts destructive refspecs; `memory-usage.sh` records which memory files were routed. Wiring comes from `ai-hooks-install`; a profile started with a custom `CLAUDE_CONFIG_DIR` has no hooks until `ai-hooks-install --check` passes for it.
- Commit and PR attribution: the no-AI-attribution rule in the core overrides Claude Code's default `Co-Authored-By` guidance.
- Claude auto-memory for `$HOME` is a sealed read-only bootstrap installed by `ai-memory-link`; durable cross-device lessons go through `ai-learn capture`.
