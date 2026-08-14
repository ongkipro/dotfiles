---
name: skill-plumbing
description: "Owned skills use one source with runtime-native managed links"
metadata:
  node_type: memory
  type: project
  originSessionId: 678a7f8d-f6e5-48ea-a900-2ddb3e7431ff
  modified: 2026-08-10T16:47:35.000Z
---

## Current contract

Owned skills live only in `~/dotfiles/skills/local/`. Runtime directories contain
managed links, never copied owned content:

- Claude: `~/.claude/skills` directory link.
- Pi: `~/.pi/agent/skills` directory link.
- OMP: `~/.omp/agent/skills` directory link.
- Antigravity: `~/.gemini/config/skills` directory link.
- Codex: real `~/.codex/skills` directory with runtime-owned `.system` skills and
  one managed link per owned skill beside them.

`~/.agents/bin/skill-update` resolves to the tracked implementation at
`~/dotfiles/skills/agents-bin/skill-update`. It is idempotent, preserves Codex
`.system`, removes stale managed links, and never fetches external skill sources.
Run it after adding or removing an owned skill or installing a supported runtime.
A normal source edit is visible immediately through the existing links.

Verify current state from disk:

```bash
realpath ~/.agents/bin/skill-update
skill-update
skill-list
ai-doctor --self-test
```

Do not turn owned skills into provider-specific plugins. Official vendor plugins
may remain runtime-specific integrations, but they are not a second source for
owned capability methodology.
