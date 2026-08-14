---
name: claude-code-model-selection
description: Opus 4.8 is entitled on this account but absent from the /model picker; reach it by full model name via settings.json or --model.
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0426a5be-0eff-4b18-b796-a035bc8fb807
  modified: 2026-08-05T04:44:50.722Z
---

Claude Code's `/model` picker is **server-curated per account**, not a capability list. Entitlement to call a model and inclusion in the picker are separate systems — a model absent from the picker can still be fully callable.

Verified 2026-08-05 on the Mac: `claude-opus-4-8` and `claude-opus-4-8[1m]` both return successfully via `claude -p --model <id> "say OK"` even though neither appears in `/model`. The binary even carries the `Opus 4.8` display label, so the omission is a server-side curation decision, not a missing client feature.

Absence from the picker is a de-emphasis signal worth heeding: Opus 5 costs the same as Opus 4.8 ($5/$25 per MTok), has the same 1M context and 128K output, and is more capable — so pinning an older Opus buys nothing. Pin an unlisted model only for a specific reason, and pair it with `fallbackModel` so a future retirement doesn't fail silently.

**How to reach an unlisted model:**
- Session default — `"model": "claude-opus-4-8[1m]"` in `~/.claude/settings.json` (the schema also accepts `fallbackModel`).
- One-off — `claude --model 'claude-opus-4-8[1m]'`, or `ANTHROPIC_MODEL=<id>`.
- Confirm which model a session actually resolved to: `claude -p --output-format json "hi"` and read the `modelUsage` keys.

**Dead ends:** the picker cannot be extended. `modelOverrides` in the settings schema is an enterprise managed-settings remap (`Record<string,string>`), not a way to add rows.

Discover valid IDs by grepping the binary at `$(dirname "$(realpath "$(command -v claude)")")/claude.exe` — but prefer verifying with a `-p` call, since a string in the binary does not prove entitlement.

Ongki tried pinning Opus 4.8 on 2026-08-05, then reverted the same day once the pricing/capability comparison showed no upside — `~/.claude/settings.json` carries **no** `model` key, so sessions use the default `claude-opus-5[1m]`.
