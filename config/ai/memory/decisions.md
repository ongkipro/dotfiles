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
- Decision: shadcn/ui is the preferred component source for React-capable admin
  and client dashboards. Next.js App Router remains the preferred integrated
  full-admin runtime; Vite + React fits API-backed client apps, and Astro +
  React fits route-oriented admin surfaces with bounded interactivity.
- Reason: consistent accessible components and dashboard patterns without
  making one rendering model mandatory across every project.
- Tradeoff: React component consistency must not create unnecessary hydration;
  static Astro regions stay semantic server-rendered markup.

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
- Privacy and personal-profile retention constraints are owned by `identity.md`.
- Do not treat conflicting Human Design/personality readings as final facts without verification.
- Prefer separating facts, assumptions, opinions, and unknowns when uncertainty matters.

## AI tooling decisions (consolidated 2026-07-14)
> Runtime availability, active models, and service status must be checked on the
> relevant machine. Do not preserve them here as current facts.

### Control-plane and credential boundaries
- OMP is the only primary control plane. Pi is an optional standalone fallback
  with its own custom compaction behavior; OMP must work when Pi is absent.
- The optional remote 9Router credential lives only at
  `~/.config/ai-local/credentials/9router-remote-key`. Shell wrappers may inject
  it into a direct child process, but it must not be globally exported, printed,
  logged, or read from Pi state.
- `9router-credential-migrate` is an explicit, non-destructive bridge from a
  legacy Pi auth entry. It must not overwrite the neutral destination or delete
  the source.

### Dotfiles-coupled vs machine-coupled config
- Dotfiles-coupled (safe to sync across machines): non-secret Pi settings,
  extensions, remote provider templates, and `helix/languages.toml`.
- Machine-coupled (never copy raw into dotfiles): the neutral remote 9Router
  credential and `~/.pi/agent/{models.json,auth.json,sessions/}`.
- Pi provider choice is machine-local. Inspect Pi state only when operating the
  optional Pi CLI; never use it as evidence for OMP routing or credentials.
- Never invent a rationale for a provider switch that was only observed on disk.

### Pitfall: prefix `ocg/` ≠ 9router
- `ocg/` is a NATIVE pi provider prefix (opencode-go), NOT 9router. Do not set `defaultModel: "ocg/..."` while `defaultProvider: "9router"` — invalid combination. `ocg/*` models are accessed via the `opencode-go` provider.


### Graphify — no global install (reviewed 2026-07-29)
- Tool: `Graphify-Labs/graphify` v0.9.29 (`graphifyy` on PyPI), Apache-2.0, Python 3.10+, tree-sitter plus optional semantic extraction. The repository is active and well tested; this is not a quality rejection.
- Current installers are platform-selective, so the old claim that one install always edits both Claude and Codex was stale. The conflict remains: the default Claude install appends to `~/.claude/CLAUDE.md`, which is our shared `AGENTS.md` symlink, while `--platform agents` creates a second skill source outside `~/dotfiles/skills/local/`.
- Our current navigation layer (`MEMORY.md`, project-memory index, `skill-list`, and `rg`) is adequate. A global package, generated graph state, hooks, and another query syntax do not yet earn their maintenance cost.
- **What was taken:** make missing and ambiguous memory edges visible. `ai-memory-check` now validates relative Markdown links and wikilinks, and `ai-doctor` runs it.
- **Reviewed lesson inbox (2026-08-15):** `ai-learn` adds a small capture → review → promote loop without a daemon, session-log ingestion, generated graph, or automatic Git mutation. Candidates are device-local; only explicit promotion updates canonical memory. `ai-doctor` exposes pending review work.
- Revisit only for a specific large codebase or mixed research corpus where the current index plus `rg` measurably fails. Pilot ad hoc with code-only extraction before considering persistent hooks or an extension; do not install globally by default.
- Full current analysis: `~/Documents/work/research/ponytail-graphify-dotfiles-analysis-2026-07-29.md`.

### Anti-pattern memory (lesson 2026-07-14)
- **Operational facts that keep changing (service status, default model, versions) should not be copied into many files.** It happened before: the 9router autostart fact was copied 6×, and ALL of them became wrong the moment the service was disabled; pi's default model had 4 conflicting answers across 2 files.
- Rule: facts checkable from disk → write ONCE, state the **verification command**, don't duplicate. An agent reading the contradiction will guess.
