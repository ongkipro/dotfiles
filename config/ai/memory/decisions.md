# Decision Memory
> Durable decisions and working assumptions. Update when a decision changes. Do not treat uncertain notes as final facts.

## Development stack decisions

### Linux-first workflow
- Status: active preference.
- Decision: prefer Ubuntu/Linux, terminal-first workflow, tmux, Helix, mise/npm/pipx, and CLI tools.
- Reason: better fit for AI terminal, server/dev workflow, speed, reproducibility, and reduced GUI dependency.
- Avoid: suggesting GUI-heavy workflow as default unless user asks.

### Public frontend direction
- Status: active preference.
- Decision: Astro + Tailwind is preferred for public frontend, SEO blog, content site, affiliate portal, and headless storefront when static/SEO speed matters.
- Reason: performance, SEO, simplicity, static-first architecture, Cloudflare fit.
- Tradeoff: less ideal for very interactive admin dashboards.

### Admin/client dashboard direction
- Status: active preference.
- Decision: Next.js + React + TypeScript + Tailwind + shadcn/ui is preferred for admin panel and client dashboard when interaction complexity is high.
- Reason: component ecosystem, dashboard patterns, stateful UI, auth/admin flows.
- Tradeoff: heavier than Astro for public SEO pages.

### Shopify development direction
- Status: active preference.
- Decision: use Shopify CLI/theme workflow when working with Shopify themes, but user prefers local-dev clarity similar to Astro.
- Reason: Shopify preview/sync can feel less precise than modern Astro dev flow.
- AI should provide concrete commands, preview logic, file mapping, and safe sync instructions.

## Business decisions / preferences

### Tools directory vs broad portal
- Status: prior chosen direction for software/tools affiliate.
- Decision: tools directory/comparison/review approach is preferred over broad unfocused portal/search-engine approach.
- Reason: clearer monetization, easier topical authority, better buyer intent.

### Germany affiliate direction
- Status: active strategic focus.
- Decision: Germany-first affiliate content is a serious track, especially SaaS/tools, productivity, AI office, and Amazon DE office/home-office products.
- Avoid: low-trust ClickBank-style claims, fake income, weird spiritual/magic-cure positioning for German audience.

### KIHeute content positioning
- Status: active decision.
- Decision: KIHeute is for practical AI in office/business workflows, not AI news, AI art, crypto, programming, gaming, student content, or general AI trend commentary.
- Reason: clearer audience pain, stronger affiliate fit, less trend dependency.

### Build systems, not one-offs
- Status: durable preference.
- Decision: favor repeatable systems, SOPs, prompts, AI skills, workflow automation, and reusable assets.
- Reason: user frequently delegates to interns/admins/AI agents and wants compounding leverage.

## Memory governance decisions
- Do not store credentials, API keys, auth tokens, private keys, or raw secrets.
- Do not store family/children biodata in GitHub memory unless user explicitly confirms exact details to store.
- Do not treat conflicting Human Design/personality readings as final facts without verification.
- Prefer separating facts, assumptions, opinions, and unknowns when uncertainty matters.

## AI tooling decisions (consolidated 2026-07-14)
> Operational pi/9router facts (active model, service status) are in **environment.md**, section "pi.dev + 9router". Here only DECISIONS + durable lessons.

### Dotfiles-coupled vs machine-coupled config
- Dotfiles-coupled (safe to sync across machines): `settings.json` (machine-coupled fields MUST be dropped/parameterized), `extensions/*`, `9router/aliases.json`, `9router/runtime-package.json`, `helix/languages.toml`.
- Machine-coupled (DO NOT put raw in dotfiles): `~/.pi/agent/models.json` (API key + model availability varies), `~/.pi/agent/auth.json` (oauth token), `~/.pi/agent/sessions/` (history), `~/.9router/{auth,jwt-secret,machine-id,tunnel/}`.
- Lesson: the `skills` array in settings.json once hardcoded `/Users/feriromansyah/...` — wrong machine. Solution: use pi auto-discovery (skills in `~/.pi/agent/skills/`) and DO NOT hardcode someone else's absolute path.

### pi back through 9router (2026-07-20) — reversal of an old decision
- The old decision "pi default = NATIVE provider `minimax`/`MiniMax-M3`, NOT through 9router, do not 'fix' it" **has been cancelled**. Disk now: `defaultProvider: "9router"`, `defaultModel: "cx/gpt-5.4"`.
- **The reason for the switch is NOT known** — do not make it up. This is recorded as a verified condition as of the date above, not a decision rationale.
- Consequence: 9router is no longer optional for pi. If the gateway is down, pi's main chat goes down too (previously it didn't). Verify: `jq '.defaultProvider, .defaultModel' ~/.pi/agent/settings.json`.

### Pitfall: prefix `ocg/` ≠ 9router
- `ocg/` is a NATIVE pi provider prefix (opencode-go), NOT 9router. Do not set `defaultModel: "ocg/..."` while `defaultProvider: "9router"` — invalid combination. `ocg/*` models are accessed via the `opencode-go` provider.

### Pitfall: don't run `9router --tray` alongside the service
- Port 20128 conflict. Pick one.

### Graphify — no global install (reviewed 2026-07-29)
- Tool: `Graphify-Labs/graphify` v0.9.29 (`graphifyy` on PyPI), Apache-2.0, Python 3.10+, tree-sitter plus optional semantic extraction. The repository is active and well tested; this is not a quality rejection.
- Current installers are platform-selective, so the old claim that one install always edits both Claude and Codex was stale. The conflict remains: the default Claude install appends to `~/.claude/CLAUDE.md`, which is our shared `AGENTS.md` symlink, while `--platform agents` creates a second skill source outside `~/dotfiles/skills/local/`.
- Our current navigation layer (`MEMORY.md`, project-memory index, `skill-list`, and `rg`) is adequate. A global package, generated graph state, hooks, and another query syntax do not yet earn their maintenance cost.
- **What was taken:** make missing and ambiguous memory edges visible. `ai-memory-check` now validates relative Markdown links and wikilinks, and `ai-doctor` runs it.
- Revisit only for a specific large codebase or mixed research corpus where the current index plus `rg` measurably fails. Pilot ad hoc with code-only extraction before considering persistent hooks or an extension; do not install globally by default.
- Full current analysis: `~/Documents/work/research/ponytail-graphify-dotfiles-analysis-2026-07-29.md`.

### Anti-pattern memory (lesson 2026-07-14)
- **Operational facts that keep changing (service status, default model, versions) should not be copied into many files.** It happened before: the 9router autostart fact was copied 6×, and ALL of them became wrong the moment the service was disabled; pi's default model had 4 conflicting answers across 2 files.
- Rule: facts checkable from disk → write ONCE, state the **verification command**, don't duplicate. An agent reading the contradiction will guess.
