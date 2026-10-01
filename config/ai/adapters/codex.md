## Runtime adapter — Codex CLI

- Runtime facts: Codex reads this from `~/.codex/AGENTS.md`. How you work the task is yours to choose; the core's boundaries and evidence rules still apply.
- Hooks: `ai-hooks-install --runtime codex` wires `~/.codex/hooks.json` with the same git-guard, memory-usage and session-restore hooks as Claude. Codex cannot answer "ask", so git-guard denies those cases; run such a command yourself only with the user's approval. Codex runs a hook only after its exact definition is trusted: after installing or changing hooks, open `/hooks` in an interactive Codex session and trust them, otherwise they are skipped. Rules a hook cannot see (other interpreters, wrappers) still rest on your own behavior.
- Skills are per-skill links in `~/.codex/skills/` beside Codex's built-in `.system` skills. Codex shortens skill descriptions to fit its budget — when a skill name plausibly matches the task, open its `SKILL.md` instead of judging from the shortened description.
- Codex native memories are device-local session aids, not shared truth; curated cross-device memory stays in `~/.config/ai/memory/`.
