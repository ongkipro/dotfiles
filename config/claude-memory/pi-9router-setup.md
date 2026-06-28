---
name: pi-9router-setup
description: pi.dev (pi-coding-agent) is wired to route through local 9router AI router; default free model + config locations
metadata: 
  node_type: memory
  type: project
  originSessionId: 94b5abab-6d9a-43ee-a856-b32cfccea19b
---

pi.dev CLI (`@earendil-works/pi-coding-agent`, bin `pi`) routes LLM requests through **9router** (local AI router, `npm i -g 9router`, server at `http://localhost:20128/v1`, dashboard 20128). This replaced the old **omniroute** pi extension, which was deleted on 2026-06-25.

**Config:**
- `~/.pi/agent/models.json` — defines provider `9router` (api `openai-completions`, baseUrl `http://localhost:20128/v1`, apiKey = 9router local key, `compat.supportsDeveloperRole/supportsReasoningEffort: false`).
- `~/.pi/agent/settings.json` — `defaultProvider: "9router"`, `defaultModel` TOGGLES between models: verified **`opencode-go/deepseek-v4-pro` (256K context) on 2026-06-26**; was `cx/gpt-5.5` (272K) on 2026-06-25. Always read the live value from settings.json, don't assume.

**Working models via 9router (as of 2026-06-25):**
- `cx/gpt-5.5`, `cx/gpt-5.4`, `cx/gpt-5.4-mini` — GPT via 9router pooling 3 Codex OAuth accounts (romario.sumali, dinarevitabeautyinu, aussie.bensu5m) → ~3x limit + auto-rotate. Better than pi's native single-account `openai-codex/*`. `cx/gpt-5.3-codex*` NOT supported via 9router chat proxy (400 error).
- `oc/deepseek-v4-flash-free` — OpenCode free passthrough, no login/key, no risk-control, no quota use. (was the default at one point; current default is opencode-go/deepseek-v4-pro). Reasoning model (set maxTokens ≥16384 so visible content isn't eaten by reasoning_content).
- `opencode-go/deepseek-v4-pro`, `opencode-go/glm-5.2`, `opencode-go/kimi-k2.6` — higher quality, but route via user's OpenCode API key (connected in 9router as "Irwan", apikey) so they may consume OpenCode plan credits. opencode-go qwen3.7-max & minimax-m3 return empty, skip.
- `minimax/MiniMax-M2.7 / M2.5 / M2.1` — work via user's MiniMax API key (connected in 9router as "Irawan"). MiniMax inlines `<think>` in content. M3 returns empty, skip.
- `mmf/mimo-auto` (MiMo Code Free) — works but frequently throttled with 441 risk_control; unreliable backup only.

**compact-free extension** (`~/.pi/extensions/compact-free/index.mjs`, registered in settings.json packages as `../extensions/compact-free`): hooks `session_before_compact` so context compaction/summarization runs on a cheap model instead of the main model — saves GPT-5.4/Claude sub limits when running expensive main models. Model chain (tries in order): `9router/oc/deepseek-v4-flash-free` → `9router/minimax/MiniMax-M2.5` → `9router/cx/gpt-5.4-mini` (added 2026-06-25 as cheap backup before falling to main model) → default compaction (main model). Verified working 2026-06-25 (summary generated via deepseek-v4-flash-free, ~9-14s). Uses pi-ai `complete()` + `serializeConversation`/`convertToLlm`. Optional breadcrumb log at `~/.pi/compact-free.log`. Note: project-local `.pi/settings.json` compaction overrides seemed not to apply in testing; global `~/.pi/agent/settings.json` compaction settings did.

**Compaction trigger (IMPORTANT):** pi fires `shouldCompact` when `contextTokens > contextWindow − reserveTokens` (`dist/core/compaction/compaction.js:152`). So `reserveTokens` is *headroom reserved*, NOT a max — a LARGE value makes it compact EARLY. Default 16384. Was misconfigured to `270000` (with 272k window → compacted every chat at ~2k tokens). Fixed 2026-06-25 to `reserveTokens: 22000` (compacts at ~250k/272k) + `keepRecentTokens: 6000` (was 400, too aggressive). Summary maxTokens = `min(0.8*reserveTokens, model.maxTokens)` for the default path; compact-free hardcodes its own 8192.

**Gotchas:** "Ready" in 9router dashboard ≠ active; `opencode-go/*` and `xiaomi-mimo/*` error "No active credentials" until connected, but `oc/*-free` aliases work as free passthrough without connection. MiniMax inlines `<think>` in content; DeepSeek uses separate reasoning_content (cleaner). Gemini free routes are risky — Gemini CLI/Code Assist was shut down 2026-06-18.
