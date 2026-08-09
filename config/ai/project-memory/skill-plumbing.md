---
name: skill-plumbing
description: "Custom skills are sourced from ~/dotfiles/skills/local, but the runtime dirs are MANAGED directories of per-skill symlinks — `git pull` alone does not wire a new skill, `skill-update` does"
metadata: 
  node_type: memory
  type: project
  originSessionId: 678a7f8d-f6e5-48ea-a900-2ddb3e7431ff
  modified: 2026-08-05T10:15:00.000Z
---

Single source for **our own** skills = **`~/dotfiles/skills/local/`** (reached by `skill-update`
through `~/.agents/local-skills`, a symlink to it). Check the count on disk; any number written here
goes stale — `skill-list`, or `ls -1 ~/dotfiles/skills/local | grep -v '^_' | wc -l`.

**Measured 2026-08-05 on `cuan`, and it contradicts what this file used to say:** `~/.claude/skills`
and `~/.pi/agent/skills` are **not** single-directory symlinks into dotfiles. They are ordinary
directories holding **97 per-skill symlinks each — 35 into `skills/local`, 62 into
`~/.agents/repos/shared-skills`** (the `jezweb/claude-skills` clone, which **still exists and is
still fetched on every `skill-update`**; do not delete it).

**Why it matters:** `git pull` in dotfiles moves the SOURCE and nothing else. Today's pull brought 22
commits and five new skills — `admin-dashboard`, `design-taste`, `development-spec-suite`,
`lean-code-review`, `premium-ui-ux` (deleted 2026-08-09) — and all five were **invisible to claude and pi** until
`skill-update` ran, because no symlink pointed at them. The old note *"`git pull` alone is enough to
sync"* described the single-directory model and is **retracted**.

🔴 **The state above is what the JEZWEB installer produces — dotfiles ships a DIFFERENT
`skill-update` that would replace it.** `install.sh:51` links
`~/dotfiles/skills/agents-bin/skill-update` into `~/.agents/bin/`, and that version builds a
whole-DIRECTORY symlink (`~/.claude/skills` → `skills/local`, 40 skills, no jezweb). On `cuan`
2026-08-05 `~/.agents/bin/skill-update` is a **real file** carrying the jezweb version instead,
shadowing that link — nobody has decided which model this machine should be on. Identify it first:
`head -3 ~/.agents/bin/skill-update`. Both are idempotent and dotfiles' one refuses to touch
anything resolving inside `skills/local`; the difference is the resulting runtime (97 skills vs 40).

**How to apply:** after a dotfiles pull that adds or removes a skill, run **`skill-update`** (the one
currently installed), then `ai-doctor`. Confirm nothing is stranded:

```bash
comm -23 <(ls -1 ~/dotfiles/skills/local | grep -v '^_' | LC_ALL=C sort) \
         <(find ~/.claude/skills -maxdepth 1 -type l -exec basename {} \; | LC_ALL=C sort)
# empty = every custom skill is wired
```

⚠️ **`skill-update` maintains FIVE target dirs and recreates them every run** — `~/.agents/skills`,
`~/.claude/skills`, `~/.codex/skills`, `~/.gemini/skills`, `~/.pi/agent/skills` (102 symlinks each on
2026-08-05). Any note claiming those folders "are gone" or "are deliberately skipped" cannot survive
one run. `~/.codex/skills` also keeps its own `.system/` (codex's built-ins). **Don't delete any of
them, and don't read their existence as drift.**

⚠️ **If `skill-update` prints `Backed up existing path: ... -> *.backup.<ts>`, do NOT assume it is a
duplicate and delete it.** An old version of that script had a destructive bug where the message
meant an ENTIRE original skill inside dotfiles had just been moved. Check `~/dotfiles/skills/local/`
is intact first. (The old note saying "just delete it" was WRONG and has been retracted.) Since the
pi wrapper routes `pi update` through `~/dotfiles/bin/pi-update-safe`, leftover backup folders are
archived out of `~/.pi/agent/skills` and `~/.claude/skills` before they can collide with discovery —
and `ai-doctor` reports any that survive.

Don't turn skills into `codex`/`agy` plugins: neither has a skill directory by design, they just run
`skill-list` and read `~/dotfiles/skills/local/<name>/SKILL.md` directly.

**Plugin exception (decided 2026-07-20):** the "no plugins" contract in `_refresh-vendored.sh` is NOT
absolute. Plugins may be used **as long as they're official from the vendor** (official site /
official GitHub), not self-made. Installed & approved: `vercel@claude-plugins-official` (30 skills) +
`stripe@claude-plugins-official` (5 skills), both from the `claude-plugins-official` marketplace.
Check: `cat ~/.claude/plugins/installed_plugins.json`. Consequence: plugins only serve **claude**,
while skills in dotfiles serve all four CLIs — so don't move local skills into a plugin.

The full contract is in `~/.config/ai/AGENTS.md` + `~/.config/ai/memory/skills.md`. Related:
[[antigravity-cli-agy]].
