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
