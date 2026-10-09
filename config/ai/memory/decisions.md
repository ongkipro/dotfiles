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

## AI tooling decisions (updated 2026-08-24)
> Runtime availability, active models, and service status must be checked on the
> relevant machine. Do not preserve them here as current facts.

### Runtime and credential boundaries
- OMP uses its upstream-native command, configuration, agents, model/provider
  catalog, routing, updates, workspace behavior, authentication, and session
  state. Dotfiles supplies only shared context and owned skills; it must not
  wrap OMP or install runtime configuration. Pi remains optional and independent.
- The optional remote 9Router credential is machine-local. Dotfiles must not
  inject it into OMP, globally export it, print it, log it, or infer it from Pi
  state during normal setup.
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
- OMP provider choice, authentication, and active models are native
  machine-local state; verify them through OMP instead of dotfiles memory.
- Never invent a rationale for a provider switch that was only observed on disk.

### Pitfall: prefix `ocg/` ≠ 9router
- `ocg/` is a NATIVE pi provider prefix (opencode-go), NOT 9router. Do not set `defaultModel: "ocg/..."` while `defaultProvider: "9router"` — invalid combination. `ocg/*` models are accessed via the `opencode-go` provider.


### Graphify — optional code navigation, no global installer
- The initial no-global-install decision remains. TASK-115 added an optional
  code-only pilot and query lane; it did not install runtime hooks or replace
  canonical AI configuration.
- [codebase-navigation](../../../skills/local/codebase-navigation/SKILL.md) owns
  the tested package pin, commands, scope selection, freshness, and limitations.
  Start with repository search; use graph relationships when they help the task.
- [Ecosystem adoption](../../../skills/local/development-kit/references/ecosystem-adoption.md)
  records the Ponytail, Graphify, and Caveman adoption boundaries. Do not infer
  current package quality or runtime state from the old July review.
- Memory links remain validated by `ai-memory-check`; graph navigation does not
  replace repository truth or memory hygiene. Reviewed learning stays a local
  candidate until explicit promotion, without automatic Git mutation.

### Anti-pattern memory (lesson 2026-07-14)
- **Operational facts that keep changing (service status, default model, versions) should not be copied into many files.** It happened before: the 9router autostart fact was copied 6×, and ALL of them became wrong the moment the service was disabled; pi's default model had 4 conflicting answers across 2 files.
- Rule: facts checkable from disk → write ONCE, state the **verification command**, don't duplicate. An agent reading the contradiction will guess.
