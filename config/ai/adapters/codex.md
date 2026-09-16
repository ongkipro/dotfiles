## Runtime adapter — Codex CLI

- Runtime facts: Codex reads this from `~/.codex/AGENTS.md`. How you work the task is yours to choose; the core's boundaries and evidence rules still apply.
- No dotfiles hooks are wired into Codex: every Git and approval rule in the core is enforced only by your own behavior here.
- Skills are per-skill links in `~/.codex/skills/` beside Codex's built-in `.system` skills. Codex shortens skill descriptions to fit its budget — when a skill name plausibly matches the task, open its `SKILL.md` instead of judging from the shortened description.
- Codex native memories are device-local session aids, not shared truth; curated cross-device memory stays in `~/.config/ai/memory/`.
