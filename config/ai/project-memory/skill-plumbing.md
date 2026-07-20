---
name: skill-plumbing
description: "Skill bersumber tunggal di ~/dotfiles/skills/local; claude & pi pakai symlink SATU-DIREKTORI, jadi `git pull` sudah cukup"
metadata: 
  node_type: memory
  type: project
  originSessionId: 678a7f8d-f6e5-48ea-a900-2ddb3e7431ff
  modified: 2026-07-20T14:34:00.642Z
---

Single source of skills = **`~/dotfiles/skills/local/`** (35 skills as of 2026-07-20; verify: `ls -1 ~/dotfiles/skills/local | grep -v '^_' | wc -l` — this number goes stale easily, disk wins). `~/.claude/skills` and `~/.pi/agent/skills` are **symlinks to that directory** — not a collection of per-skill symlinks.

**Why:** since dotfiles commit `42cd188` (2026-07-14) the model changed to a single-directory symlink. The consequence is that **`git pull` alone is enough to sync** — new skills show up on their own, deleted skills disappear on their own. `skill-update` only needs to run once when installing a new CLI.

**How to apply:** after `git pull` in dotfiles, don't run anything — just check with `ai-doctor`. Don't turn skills into `codex`/`agy` plugins: neither has a skill directory by design, they just `skill-list` and then read `~/dotfiles/skills/local/<name>/SKILL.md` directly.

⚠️ **If `skill-update` prints `Backed up existing path: ... -> *.backup.<ts>`, DO NOT assume it's a duplicate and don't delete it.** An old version of that script had a destructive bug: that message could mean the ENTIRE original skill inside dotfiles was just moved. Check that `~/dotfiles/skills/local/` is still intact first. (The old note that said "just delete it" was WRONG and has been retracted.)

**Plugin exception (decided 2026-07-20):** the "no plugins" contract in `_refresh-vendored.sh` is NOT absolute. Plugins may be used **as long as they're official from the vendor** (official site / official GitHub), not self-made. Installed & approved: `vercel@claude-plugins-official` (30 skills) + `stripe@claude-plugins-official` (5 skills), both from the `claude-plugins-official` marketplace. Check: `cat ~/.claude/plugins/installed_plugins.json`. Consequence: plugins only serve **claude**, while skills in dotfiles serve all four CLIs — so don't move local skills into a plugin.

Leftovers from the old model are **clean as of 2026-07-20**: `~/.agents/skills`, `~/.gemini/skills`, and the jezweb clone `~/.agents/repos/shared-skills` are all gone. ⚠️ `~/.codex/skills` STILL EXISTS but is **not an old leftover** — it only contains `.system` (codex's built-in skills, actively updated). **Do not delete it.**

The full contract is in `~/.config/ai/AGENTS.md` + `~/.config/ai/memory/skills.md`. Related: [[antigravity-cli-agy]].
