---
name: claude-code-permission-matcher-limits
description: "Claude Code permission rules cannot carve an exception out of a denied directory, and prefix rules ignore flags — use a PreToolUse hook for either."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 17b3c956-e8a3-487b-85b2-d40790658acc
  modified: 2026-08-09T02:49:34.355Z
---

Two limits of the `permissions` matcher in `~/.claude/settings.json`, both verified on 2026-08-09 with decoy files rather than reasoning:

1. **No carve-outs inside a denied path.** `deny` always beats `allow`, and extglob negation does not work — `Read(~/.ssh/!(config|known_hosts))` was tested and denied *everything*, including the names inside `!( )`. So "block the keys but let me read `~/.ssh/config`" is not expressible. Name-based denies (`Read(~/.ssh/id_*)` and friends) leave a real hole: a key named `volumdev` was readable. Keep `Read(~/.ssh/**)` airtight and use **`ssh -G <host>`** to get host config instead — it does not name the path, so Bash gating lets it through. Read denies gate Bash too (`cat`, `ls`, even `rm` on those paths).

2. **Allow/deny rules are prefix matches, so they cannot see flags.** `Bash(git push:*)` also permits `git push --force`, `--mirror`, `--delete`, and `+refspec`; `Bash(git commit:*)` permits `--amend`. A deny like `Bash(git push --force:*)` does not help, because it misses `git push origin main --force`. Flag-level policy needs a **PreToolUse hook** — ours is `~/dotfiles/config/ai/hooks/git-guard.sh` with a runnable check beside it.

Hook-matching gotchas that cost three iterations: the payload is the whole command string, so a heredoc commit message describing a blocked command trips the guard; an argument that merely mentions one does too unless the match is anchored to command position; and stripping a leading `(` without the trailing `)` breaks flag matching. See [[additive-commits-no-history-rewrite]].
