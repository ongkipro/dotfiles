# Skills & Capability Map
> Durable skill profile for AI CLI. Use this to calibrate explanation depth, avoid over-explaining basics, and choose practical execution paths.

## Operating profile
- Role: full-stack website development + full-stack digital marketing.
- Core mode: business system architect, not just task operator.
- Strong preference: build reusable systems, workflows, SOPs, prompts, AI skills, automation, dashboards, and scalable web assets.

## Development
- Web stack focus: Astro, Tailwind, Shopify/headless Shopify, Next.js for admin/client dashboards when needed, Cloudflare Workers, VPS, Git, Linux terminal workflow.
- Shopify focus: standard Shopify store, Liquid/theme work, headless storefront, Storefront API, checkout flow, product/category structure, SEO, conversion, tracking.
- Preferred public frontend: Astro + Tailwind for SEO/static/headless projects.
- Preferred admin/client dashboard direction: Next.js + React + TypeScript + Tailwind + shadcn/ui when dashboard complexity needs React.
- Infrastructure interests: Cloudflare Workers/R2/D1/Queues, VPS, PostgreSQL (Drizzle), queue systems, scraping, API architecture, multi-domain publishing. (**Supabase NOT used** — the CLI is deliberately not installed; see development.md.)

## Marketing & conversion
- Strong areas: Meta Ads, Google Ads, landing page copywriting, funnel strategy, product research, conversion optimization, tracking/attribution, ecommerce positioning. Local skills: `meta-ads-signal-engine` (CAPI v22.0, Pixel, deduplication event_id, outbox pattern) and `google-ads-signal-engine` (Google Tag / GTM, Consent Mode v2, Enhanced Conversions, transaction_id, gclid/gbraid/wbraid, Google Ads API v18+ offline upload).
- Evaluates ideas by profit, execution difficulty, compliance risk, scalability, maintenance cost, and speed to market.
- Prefers direct, critical analysis over agreeable brainstorming.

## SEO & content
- Focus areas: Shopify SEO, Astro/static SEO, German SEO articles, Medium SEO, Pinterest SEO, affiliate SEO, indexing strategy, internal linking, semantic page structure, image optimization, AEO/GEO (Google AI Overviews, ChatGPT Search, Perplexity). Local skills: `ai-traffic-os` (4-layer traffic system, AnswerBox 134–167 words chunking, 2026 crawler matrix, multi-modal schema, dual-path referral tracking) and `automated-traffic-pipeline` (pSEO programmatic engine, IndexNow auto push, 90-day freshness cron, Pinterest/RSS distribution flywheel).
- Article preference: dynamic templates that can render guide, comparison, review, and FAQ content while remaining SEO-friendly.
- Avoid claiming secret Google algorithm knowledge; use evidence labels and source-backed reasoning when current facts matter.

## Affiliate & monetization
- Affiliate interests: Germany-first affiliate, SaaS/tools affiliate, Amazon DE office products, Digistore24, Impact, CJ, Awin, PartnerStack, Amazon Associates.
- Preferred monetization direction: tools directory, comparison/review content, AI productivity content, office/home-office products, SEO/product research portals.
- Previously preferred tools-directory approach over broad portal/search-engine approach for affiliate software/tools.

## AI development system contract

The canonical routing policy is `~/dotfiles/config/omp/ROUTING.md`. OMP owns
session orchestration and model selection. Skills own provider-neutral
methodology. Models remain replaceable workers.

Three layers are separated by ownership:

| Layer | Canonical source | Runtime behavior |
|---|---|---|
| Mandatory policy | `~/.config/ai/AGENTS.md` | Loaded through each runtime's verified context path |
| Durable memory | `~/.config/ai/memory/` | Read on demand; disk wins on conflict |
| Owned capabilities | `~/dotfiles/skills/local/` | Native runtime discovery through managed links |

`ai-doctor` is the read-only health report. `ai-doctor --self-test` additionally
runs isolated regression tests that create temporary sandbox files.

## Capability discovery

`~/dotfiles/skills/local/` is the only source for owned capabilities.
`~/.agents/bin/skill-update` must resolve to
`~/dotfiles/skills/agents-bin/skill-update`.

Runtime adapters:

- Claude: `~/.claude/skills` is a directory symlink to the canonical source.
- Pi: `~/.pi/agent/skills` is a directory symlink to the canonical source.
- OMP: `~/.omp/agent/skills` is a directory symlink to the canonical source.
- Antigravity: `~/.gemini/config/skills` is a directory symlink to the canonical source.
- Codex: `~/.codex/skills` remains a real native directory. `.system` is
  runtime-owned; each owned capability is linked beside it.

Adding or removing an owned capability is immediately visible through directory
links. Run `skill-update` after source additions/removals to reconcile Codex and
after installing a new runtime. The updater does not fetch external repositories
or copy capability content.

Third-party or experimental capability sources must remain explicitly separate.
Do not mix them into `skills/local/`, and do not install provider-specific
plugins merely to duplicate an owned `SKILL.md`.

The destructive historical linker regression is guarded by
`bin/skill-update-test`. Never replace a path that resolves inside
`skills/local`; never remove Codex `.system`.

## Capability ownership

- `native-first` owns platform-before-dependency decisions and smallest useful
  validation commands.
- `development-spec-suite`, `prd-taskbreaker`, `openapi-spec`, and
  `mermaid-diagram` own specification artifacts at their declared boundaries.
- `admin-product-ux`, `admin-dashboard`, `design-taste`, `storefront-ux`,
  `shadcn-ui`, and `ui-validation` own distinct product, visual, component, and
  browser-validation responsibilities.
- `lean-code-review` owns evidence-backed simplification review.
- Stack- and domain-specific skills own Cloudflare, Astro, storefront, Stripe,
  Supabase, advertising, logistics, and related implementation methodology.

Do not add generic role-named skills when these owners already cover the work.
A new capability needs a real reusable methodology gap, a clear trigger, one
owner domain, explicit non-goals, and deterministic verification.

## Calibration

- Do not explain beginner web or marketing concepts unless needed.
- For strategy, lead with the largest material bottleneck.
- For technical work, provide concrete architecture, paths, command flow, risks,
  and observed verification.
- For business ideas, evaluate market, margin, compliance, distribution,
  tracking, and execution capacity.
