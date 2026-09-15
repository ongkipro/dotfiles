## Runtime adapter — Claude Code

- Native first: use Claude Code's own tools, plan mode, skills, and hooks; nothing here adds an orchestration layer.
- Execute bounded tasks directly. Use subagents only for genuinely independent or context-heavy work (broad searches, parallel audits, independent review); the main session owns integration and final verification. Stop exploring once repository evidence is sufficient.
- Hooks enforce part of the Git rules here only: `config/ai/hooks/git-guard.sh` (PreToolUse) denies force-push and `--amend` and re-prompts destructive refspecs; `memory-usage.sh` records which memory files were routed. Wiring comes from `ai-hooks-install`; a profile started with a custom `CLAUDE_CONFIG_DIR` has no hooks until `ai-hooks-install --check` passes for it.
- Commit and PR attribution: the no-AI-attribution rule in the core overrides Claude Code's default `Co-Authored-By` guidance.
- Claude auto-memory for `$HOME` is a sealed read-only bootstrap installed by `ai-memory-link`; durable cross-device lessons go through `ai-learn capture`.
