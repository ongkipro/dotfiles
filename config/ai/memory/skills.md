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
- Strong areas: Meta Ads, Google Ads, landing page copywriting, funnel strategy, product research, conversion optimization, tracking/attribution, ecommerce positioning.
- Evaluates ideas by profit, execution difficulty, compliance risk, scalability, maintenance cost, and speed to market.
- Prefers direct, critical analysis over agreeable brainstorming.

## SEO & content
- Focus areas: Shopify SEO, Astro/static SEO, German SEO articles, Medium SEO, Pinterest SEO, affiliate SEO, indexing strategy, internal linking, semantic page structure, image optimization.
- Article preference: dynamic templates that can render guide, comparison, review, and FAQ content while remaining SEO-friendly.
- Avoid claiming secret Google algorithm knowledge; use evidence labels and source-backed reasoning when current facts matter.

## Affiliate & monetization
- Affiliate interests: Germany-first affiliate, SaaS/tools affiliate, Amazon DE office products, Digistore24, Impact, CJ, Awin, PartnerStack, Amazon Associates.
- Preferred monetization direction: tools directory, comparison/review content, AI productivity content, office/home-office products, SEO/product research portals.
- Previously preferred tools-directory approach over broad portal/search-engine approach for affiliate software/tools.

## Dotfiles = the link between AI ↔ device ↔ memory (contract, 2026-07-14)

Three layers, separated by **how often they are paid for**:

| Layer | Location | When read | Rule |
|---|---|---|---|
| **1. Rules** | `~/.config/ai/AGENTS.md` | ALWAYS, every request, across 4 CLIs | **Keep small** (target ≤120 lines) — its cost is multiplied by four. Mandatory policy (approval gates, code discipline) MUST be here, not in a skill. |
| **2. Memory** | `~/.config/ai/memory/*.md` | when needed | Facts checkable from disk → write ONCE + include the verification command. **Disk wins over memory** when they conflict. |
| **3. Skills** | `~/dotfiles/skills/local/` | on-demand | Deep knowledge. Pure routers forbidden. |

**Smallest common denominator of the 4 CLIs**: they all read `AGENTS.md`, they can all read files + run a shell. So the inter-AI protocol = **AGENTS.md tells where things are; the rest is just files.** DO NOT use a per-CLI plugin system (creates a second source).

**Check the health of the whole chain on any device: `ai-doctor`** (`dotfiles/bin/ai-doctor`). It checks the repo, AGENTS.md into each CLI, memory, skill symlinks, dangling symlinks, security guard, and CLI login status. FAIL = broken, WARN = works but not yet complete.

## CLI routing — who does what (2026-07-14, from user)
- **claude** = global development: architecture, long context, big refactors, planning, research. Skills: AUTOMATIC.
- **pi** = all-in-one: daily terminal work. Skills: AUTOMATIC.
- **codex** = logic: focused patches, code review, debugging, second opinion. Skills: read manually.
- **agy** = UI/UX + small development: visual, preview, artifacts. Skills: read manually.
- ⚠️ **codex NOT logged in on `cuan`** (`~/.codex/auth.json` absent) — this Linux box was just installed, still being set up. Run `codex login` before relying on codex. Not a bug.
- **codex & agy have no skills directory** — their system is plugins (`plugin.json`), a different format. `agy plugin validate` rejects our `SKILL.md`. **Don't wrap them into plugins** = a second source + sync burden. Just: run `skill-list`, then read `~/dotfiles/skills/local/<name>/SKILL.md` directly.

## Skill plumbing — MODEL: SINGLE-DIRECTORY symlink (2026-07-14)

```
~/.claude/skills       ─┐
~/.pi/agent/skills     ─┼─→ ~/dotfiles/skills/local/   (check count: `skill-list`)
~/.agents/local-skills ─┘
```

- **Single source:** `~/dotfiles/skills/local/`. Always check the active count with `skill-list`; don't store a number as a fixed fact. The jezweb repo has been detached from this model (the "104 skills" claim is stale) and the clone `~/.agents/repos/shared-skills` **no longer exists on any machine** (Mac verified 2026-07-20: `ls ~/.agents/repos/` is empty).
- 🔑 **CROSS-DEVICE SYNC = `git pull` ONLY.** No extra step. New skills appear on their own; deleted skills disappear on their own — across all CLIs at once. The old note *"`git pull` does NOT create symlinks, `skill-update` is required"* is now **WRONG** — that applied to the per-skill model that has been dropped.
- `skill-update` is now **only used ONCE per new machine** (and is called automatically by `install.sh` / `install-macos.sh`). Idempotent — safe to re-run, a no-op if already correct. Needed again only if you install a new CLI.
- `skill-new` / `skill-remove` **no longer need a sync** — they take effect / disappear immediately across all CLIs.
- ⚠️ `~/.gemini/skills`, `~/.agents/skills` **are not targets** and are not maintained. Gemini CLI was removed 2026-07-13. `skill-update` deliberately SKIPS a CLI that isn't installed rather than creating its folder. As of 2026-07-20 **both folders no longer exist** on Mac or `cuan` — leftovers of the old per-skill model are cleaned up. Don't confuse them: **`~/.gemini/` (root) is Antigravity's (`agy`) home, DO NOT delete it.**
  - ❗ **`~/.codex/skills` is DIFFERENT — it STILL EXISTS and is ACTIVELY USED.** It contains `.system/` (e.g. `skill-creator`, used by the validator in the `volumx-writer` section below). **DO NOT delete it.** It's not a `skill-update` target, but it's also not stale leftover.

### ☠️ A destructive bug that has been fixed — don't bring it back
The OLD `skill-update` used a **per-skill symlink** model. If the target (`~/.claude/skills`) turned out to already be a single-directory symlink to the source, `backup_conflict()` would **`mv` every ORIGINAL skill directory inside dotfiles** to `*.backup.<ts>`, then create a symlink pointing to itself → `Too many levels of symbolic links`. **All skills vanish.** Reproduced in a sandbox (2026-07-14).
- The new version has a hard guard: **it refuses to touch any path that resolves INTO `skills/local`**.
- The old note *"if `skill-update` prints `Backed up existing path` it means there's a duplicate, just delete the backup"* → **DANGEROUS, that is actually the sound of the disaster.** No longer applies.

### New device / another laptop — this is enough
```bash
git clone git@github.com:ongkipro/dotfiles.git ~/dotfiles
cd ~/dotfiles && ./install.sh        # macOS: ./install-macos.sh
# done — skills, AGENTS.md, memory are linked into every installed CLI.
```
After that, updating = just `git pull`. If you install a new CLI later (e.g. just installed Claude Code): `skill-update` once.

## Dedup 2026-07-14 — 43 → 33 skills (HISTORICAL NUMBER, not the current count)
> The current count is **not** 33 — it has grown since then (35 as of 2026-07-20). Always check: `ls ~/dotfiles/skills/local | grep -v '^_' | wc -l` or `skill-list`.
- **Deleted (100% broken pointers, zero content):** `cloudflare-worker-toolkit`, `shopify-ai-toolkit-router`. Both pointed to `/home/fantastico/…` — a user that **DOES NOT EXIST** — and to ~26 skills that never existed.
- **Deleted:** `ai-terminal-project-runner`. Its content = (a) defaults the harness already does, (b) a routing table to ghost skills, (c) safety gates. **Its safety gates were LIFTED into `AGENTS.md` → section "Approval gates — ALWAYS ON"**, because mandatory policy must not depend on the model choosing to call a skill. Its script was rescued → `dotfiles/bin/inspect-project`.
- **Merged:** 7 `9router-*` skills → `9router/references/*.md`. One description in the system prompt, not eight.
- **DELIBERATELY NOT merged:** `copywriting` vs `content` — correctly factored (rules vs workflow), and `shopify-listing/references/copywriting.md` is a purpose-built subagent prompt, not a copy. Don't "tidy" it again.
- **Principle:** policy that must ALWAYS be active → `AGENTS.md`. Deep knowledge called on demand → skill. Pure router → must not exist.

## Skill `native-first` (new, 2026-07-14)
- Answers ONE question: **"does the platform already have this?"** — called before `npm i`, before building an abstraction/wrapper, before choosing how to validate.
- 8 references: `next-react`, `astro`, `node-ts`, `cloudflare`, `vercel`, `data` (Postgres+Drizzle+better-auth), `shopify`, `selfhost` (Docker/Coolify/Vultr). Read ONE per the stack, not all.
- It also holds the **smallest validation command per stack** + gotchas we've already paid for (Nixpacks fails for a monorepo, `next start` doesn't serve `public/uploads`, `@tokophi/db` throws at build).
- ⚠️ **PHP/Laravel DELIBERATELY absent** — zero PHP footprint across all projects (2026-07-14). "WordPress-style CMS" (`volumecms`) is **Next.js**, not PHP. Don't add PHP guidance without a real PHP project.
- Trigger deliberately NARROW (the decision moment: about to install / about to build an abstraction / about to validate), NOT "all dev tasks" — the wide trigger was the sin of the discarded `ai-terminal-project-runner`.
- **Don't use `claude plugin install`** for a skill meant to be used cross-CLI — that only registers it with Claude Code and creates a second source. A skill = a directory containing `SKILL.md` in `dotfiles/skills/local/`.
- History: 2026-07-10 eleven Cloudflare/web-perf skills were still original directories duplicated across several consumers; they've been moved to dotfiles. Since the single-directory model (2026-07-14) that kind of duplication can no longer happen.

## Skill `volumx-writer` (2026-07-19)
- A cross-channel quality engine for create/rewrite/humanize/localize/audit/score in Indonesian or English. Its main responsibilities: **preservation ledger**, anti-hallucination, naturalness, brand voice, and claim integrity.
- Stays separate from `content` (production/batching/publish workflow) and `copywriting` (house rules/templates). For Shopify, `shopify-listing` remains the owner of catalog operations and hard rules; `volumx-writer` must not add CTAs or third-party brands to descriptions/meta unless the user opts in.
- The initial source was audited from `/Users/ongki/Downloads/volumx-writer`, then adapted to the dotfiles contract. The README and validator bundle were not installed because they are not runtime knowledge; UI metadata uses `agents/openai.yaml`, validation uses the standard `skill-creator` validator.
- Disk verification: `skill-list | rg 'volumx-writer'`; validation: `python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py ~/dotfiles/skills/local/volumx-writer`; cross-agent paths: `readlink ~/.claude/skills ~/.pi/agent/skills ~/.agents/local-skills`.

## AI workflow
- Tools in active scope: Claude Code, Codex, pi.dev, Antigravity (`agy`), local skills. (9Router exists but is DOWN — see environment.md.)
- Skills (`SKILL.md`) are shared via symlink; Memory is shared separately via `~/.config/ai/` (symlink to `dotfiles/config/ai/`).
- Goal: standardized AI terminal workflow with shared memory, skills, project context, and repeatable execution rules.
- AI should help as critical thinking partner, architect, implementer, auditor, and workflow designer.

## Team leverage
- Often designs systems that can be operated by interns, admins, clients, or AI agents.
- Known context: has discussed using SMK interns for affiliate/content execution and systemized workflows.

## Calibration rules for AI
- Do not explain beginner web/marketing concepts unless needed.
- For strategic questions, start with biggest weakness or bottleneck when material.
- For technical questions, give concrete architecture, file structure, command flow, and risk notes.
- For business ideas, check market, margin, compliance, distribution, data/tracking, and execution capacity.

## Local-only installations (macOS-specific, NOT in dotfiles sync)
- **Ponytail** (DietrichGebert/ponytail) — **REMOVED and re-verified 2026-07-29**. Upstream remains v4.8.4; local `agy plugin list` shows `worktrunk` only.
  - **Why it stays removed:** its persistent seven-rung ladder already lives in `## Code discipline` in `AGENTS.md`, which auto-loads across all four CLIs. Installing its plugin, hooks, or MCP server would create a second policy source and duplicate prompt injection.
  - **What was taken:** the distinct one-shot simplification workflow is now the owned `lean-code-review` skill in `~/dotfiles/skills/local/`. It reports evidence-backed deletions and smaller replacements without weakening validation, security, accessibility, or required behavior.
  - Backup: `~/Documents/work/notes/ponytail-v4.8.4-uninstalled-2026-07-20/`. Earlier teardown: `~/Documents/work/research/ponytail-teardown-2026-07-20.md`. Current combined analysis: `~/Documents/work/research/ponytail-graphify-dotfiles-analysis-2026-07-29.md`.
  - Do not reinstall the extension or MCP server unless the shared policy architecture changes.
  - Remaining `agy` plugin: **`worktrunk` only** (verify: `agy plugin list`).
- **General convention:** "experimental" or "personal" skills/extensions → install to `~/.pi/agent/external/<name>/` + manual symlink. Skills that are "approved/default" → put in `~/dotfiles/skills/local/` so they sync via `skill-update`.
