## Runtime adapter — Codex CLI

- Native first: prefer direct execution for bounded implementation, refactor, test, and bug-fix work. Inspect the repository before proposing architecture; keep diffs minimal and aligned with existing patterns.
- Do not delegate or spawn parallel work unless the task has genuinely independent parts.
- No dotfiles hooks are wired into Codex: every Git and approval rule in the core is enforced only by your own behavior here.
- Skills are per-skill links in `~/.codex/skills/` beside Codex's built-in `.system` skills. Codex may shorten skill descriptions to fit its budget — when a skill name plausibly matches the task, open its `SKILL.md` instead of judging from the shortened description.
- Codex native memories are device-local session aids, not shared truth; curated cross-device memory stays in `~/.config/ai/memory/`.
