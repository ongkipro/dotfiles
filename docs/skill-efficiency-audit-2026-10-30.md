# Skill Efficiency Audit — 2026-10-30

Scope: the 76 owned skills in `skills/local/` (54 authored, 22 vendored with
`.source`). Read-only measurement, then a one-by-one tightening pass. Rules
applied: `config/ai/README.md` (methodology lives in the skill, boundaries in
`CORE.md`; working style belongs to the runtime — TASK-087), `skill-check`
(12 KB `SKILL.md` budget; `.size-debt` ceilings may only shrink; vendored skills
are not judged), `ai-policy-lint` (routing-table cells must resolve).

Repository evidence and executable checks outrank this dated report.

## Baseline (before)

| Measure | Value |
|---|---|
| `SKILL.md` total | 864 KB (references 3.4 MB) |
| Owned skills over the 12 KB budget | 17 (all in `.size-debt`) |
| Description total — loaded in every session of every runtime | 35,416 chars (avg 466; Codex truncates at ~250) |
| Skills attributed in any delivery run (`ai-skill-evolution`) | 28 of 76 |
| Skills with no "path first" / minimum path | 15 |

## Findings

**A. SKILL.md carries tutorials and templates instead of decisions.**
`prd-taskbreaker` 27 KB (three full templates + consistency checklist, 0
references); `better-auth-security` 17 KB (275 code lines vs 179 prose);
`supabase-stack` 23 KB (206 code lines); `meta-ads-cli` 22 KB;
`application-security` 21 KB; `github-actions`, `vercel` 17 KB; `doku`,
`meta-ads-signal-engine`, `observability-engineering`, `full-stack-development`,
`nextjs-development` 15 KB; `postgres-drizzle`, `testing-engineering` 14 KB;
`hydrogen-development` 13 KB; `astro-development` 12.9 KB.

**B. Skills restate CORE policy** (commit/push, approval, secrets, "never
invent", disk wins). Counts per skill: `application-security` 55,
`vercel` 45, `better-auth-security` 38, `supabase-stack` 35,
`github-actions` 34, `full-stack-development` 28, `doku` 24, `meta-ads-cli` 23.
CORE is always loaded; a skill repeating it costs tokens and drifts.

**C. The owner/routing graph is copied into 10 skills** (`full-stack-development`
38 rows, `nextjs-development` 20, `application-security` 15,
`mermaid-diagram` 14, `meta-ads-signal-engine` 12, `vercel` 9, …).
`development-kit` is the router; siblings need only their direct handoffs.

**D. Overlapping owners.** Planning: `development-kit` / `full-stack-development`
/ `product-intelligence` / `prd-taskbreaker` / `development-spec-suite`.
Copy: `content` / `copywriting` / `writer` (the no-CTA rule in two places).
Ads signal: meta/google/tiktok (32 KB; dedup/outbox pattern repeated 33×).
`kelola-deploy` is one project's runbook (project memory, per README).
`chain-of-thought` and half of `continuous-learning` document working style and
`ai-learn`/`ai-recall` usage already owned by `docs/adaptive-ai-system.md`.

**E. Large references without tight routing.** `seo-website-builder` 182 KB
refs; `design-taste` 242 KB refs; `hydrogen-development` 72 KB. Vendored but
heavy when used: `black-magic` 36 KB, `turnstile-spin` 30 KB, `cloudflare`
27 KB + 854 KB refs.

**F. No minimum path** (the model must read everything before acting):
`adr-record`, `automated-traffic-pipeline`, `cross-cli`, `doku`,
`github-actions`, `headless-shopify`, `mermaid-diagram`, `meta-ads-*`,
`openapi-spec`, `prd-taskbreaker`, `supabase-stack`, `tiktok`, `writer`.

**G. Telemetry agrees.** `REVIEW_WEAK_EVIDENCE` lands on the governance-heavy
skills (`application-security` verify-fail 0.21, `full-stack-development`
0.22, `native-first` 0.24, `testing-engineering` 0.24, `continuous-learning`
0.27); the compact ones are clean (`nextjs-development` 0.05,
`admin-product-ux` 0.06, `shadcn-ui` 0.12). Samples are small; this is
direction, not proof.

**H. Dated claims inside SKILL.md** (belong in `.upstream`/references):
`doku` 8, `openapi-spec`/`mermaid-diagram`/`vercel` 7, `supabase-stack` 6.

## Plan (executed in this order, one skill at a time)

1. **Descriptions ≤ 250 chars** for every owned skill: what it does + "Not …"
   boundary first; triggers only when they are not already implied. Pays in
   every session.
2. **Remove CORE restatements and copied owner tables.** Keep one line per
   direct handoff; delete approval/secret/Git paragraphs CORE already enforces.
3. **Move templates and code to references** (`prd-taskbreaker`,
   `better-auth-security`, `supabase-stack`, `meta-ads-cli`, `vercel`,
   `github-actions`, `application-security`, `observability-engineering`).
   `SKILL.md` keeps the decision path and names the reference per step.
4. **Add a minimum path** to the 15 skills without one.
5. **Merge shared patterns**: ads-signal dedup/outbox into one reference used
   by the three signal skills; copy rules stay in `copywriting` only.
6. **Reclassify**: `kelola-deploy` → project memory pointer; `chain-of-thought`
   reduced to its trigger boundary + 5-step protocol; `continuous-learning`
   stripped of tool documentation that `docs/adaptive-ai-system.md` owns.
7. **Shrink `.size-debt`** as skills fall under budget; delete entries that fit.
8. Re-run `skill-check`, `skill-map`, `ai-memory-check`, `ai-policy-lint`;
   re-test executability on three skills with a second-vendor model.

Out of scope: vendored skills (`.source`) except their description length,
which is dotfiles-owned metadata; project memory; CORE.md.

## Result (after)

| Measure | Before | After |
|---|---|---|
| Owned skills | 54 (+22 vendored) | 52 (+22 vendored) |
| Description total chars (loaded every session) | 35,416 | 16,722 (−53 %) |
| Owned skills over the 12 KB budget | 17 | 1 (`gsap-scrolltrigger`, a local fork of a vendor skill) |
| `.size-debt` entries | 17 | 1 |
| Heaviest `SKILL.md` moved to references | — | `prd-taskbreaker` 27→6 KB, `supabase-stack` 23→4 KB, `meta-ads-cli` 22→4 KB, `application-security` 21→6 KB, `better-auth-security` 17→4 KB, `github-actions` 17→6 KB, `vercel` 17→3 KB, `observability-engineering` 15→6 KB, `hydrogen-development` 13→9 KB, `meta-ads-signal-engine` 15→10 KB |
| Owner tables removed | `full-stack-development` (→ `references/owner-matrix.md`), `nextjs-development`, `application-security`, `vercel`, `meta-ads-signal-engine`, `meta-ads-cli`, `postgres-drizzle`, `testing-engineering` | |
| Skills removed | `doku-malaysia-integration` (owner: not in use), `kelola-deploy` (one project's runbook; the Kelola project-memory pack and the repository own deploy truth) — both in `~/.local/share/dotfiles-trash/skills/` | |
| Skills reduced to their method | `chain-of-thought` 7→3 KB (CORE ladder and gates no longer restated), `continuous-learning` 10→3 KB (tool semantics → `references/tooling.md`) | |

Every description is ≤ 250 characters with the boundary ("Not …") inside it,
including vendored skills; each vendored skill's `.local-fork` records the
description-only edit so a byte-for-byte refresh does not silently revert it.

No content was deleted from the repository except the two retired skills:
templates, snippets, checklists, and version notes moved verbatim into the
owning skill's `references/` and are named from the step that needs them.

Verification (executed): `skill-check` 74 skills 0 fail/0 warn;
`skill-check-test` OK; `skill-map --check` current; `system-map --check`
current; `system-map-test` live queries 65/72 first (threshold met);
`ai-memory-check` OK; `ai-policy-lint` PASSED; `skill-update` re-linked all
runtimes. Executability probe with a second vendor (`cx/gpt-6.1-terra` via
Pi/9Router) on `prd-taskbreaker` and `better-auth-security`: steps and
reference routing followed as written; one ambiguity found (`update` vs
`full` when `TASKS.md` already exists) and fixed in the skill.

Remaining, deliberately not done in this pass: splitting the large reference
sets of `design-taste`, `seo-website-builder`, and `cloudflare`; merging the
three ads-signal skills' shared dedup/outbox pattern (each already routes to
its own references; the overlap is in content, not in load cost); adding a
"path first" block to the 32 owned skills that are already ≤ 10 KB with a
reference manifest — the block would add text without reducing reads.
