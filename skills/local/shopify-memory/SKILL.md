---
name: shopify-memory
description: >-
  Capture, query, and refresh memory across ALL Shopify-related projects (headless
  storefronts, standard stores, theme/liquid work, app dev, admin/dashboards, and
  Shopify-style marketplaces). Aggregates canonical memory files plus per-project
  facts into a single queryable index. Use when starting a new Shopify task,
  onboarding a project, auditing store footprint, or answering "what do we know
  about <store>/<project>". Triggers: shopify memory, memori shopify, ambil memori
  shopify, shopify project list, store audit, shopify footprint, lintas shopify,
  cross-store context. NOT for execution (listing rewrite, theme code, app dev) —
  pair with shopify-listing for action.
---

# Shopify Memory Aggregator

Single entry point for **cross-project Shopify context**. Reads canonical memory
plus per-project facts and produces a queryable, up-to-date index. **Does not
execute** Shopify changes — combine with `shopify-listing` (content/ops) or
the repo map `~/dotfiles/docs/shopify-ai-development-repos.md` (dev/theme/app/extension).

## When to use

- "Ambil memori semua project shopify" / "refresh memory shopify"
- Onboarding a new Shopify task — load context first, decide next skill.
- Auditing the user's Shopify footprint across all machines.
- Answering "what stores/projects do we have?" / "apa saja project shopify kita?".
- Before/after a multi-store session: confirm scope, find conflicts (brand policy,
  market, language), verify SKUs/handles patterns.

## Canonical sources (always read)

| Path | Owner | What it has |
|---|---|---|
| `~/.config/ai/memory/shopify.md` | cross-CLI | Global Shopify rules, repo map pointer, MCP/plugin list |
| `~/.config/ai/memory/projects.md` | cross-CLI | Per-project facts (path, stack, status, gotchas) — search for `### <name>` blocks |
| `~/.config/claude-memory/*.md` | Claude | Auto-memory snapshots per project — search filenames (e.g. `pixsgo-shopify-store.md`, `petcue-shopify-site.md`) |
| `~/Documents/shopify-ai-development-repos.md` | docs | Repo map (functions, when to use, clone vs link) |
| `~/dotfiles/ai-toolkits/shopify-ai-toolkit/{README,TRIGGERS,DECISIONS,INSTALL_NOTES}.md` | local | Installed AI toolkit notes (if present) |

> The first time the skill loads in a session, run `scripts/scan.sh --json` to build
> a fresh index. Cache the JSON to a session variable; refresh only when the user
> says so or when a project state looks stale.

## Workflow

1. **Scan** — `~/.agents/local-skills/shopify-memory/scripts/scan.sh [--json] [--project <name>]`.
   - Walks known project roots (`~/Projects/`, `~/Projects/*/`, plus Linux paths from
     `projects.md` if cross-machine context applies).
   - For each project: detect stack markers (`astro.config.mjs`, `package.json`
     deps `astro-shopify-storefront` / `@shopify/cli`, `shopify.app.toml`,
     `theme.liquid`), extract brand name from settings/SEO, count products via
     `shopify products count --store <domain>` if `shopify` CLI exists (skip on
     missing creds), collect last-modified dates.
   - Output: human table + `--json` for downstream parsing.
2. **Query** — read canonical memory files. Grep for `<store-domain>`, `<brand>`,
   `<product-handle>`, `<project-name>` (case-insensitive). Surface 3–5 bullets per
   match: path, stack, status, latest gotcha.
3. **Refresh** — re-run scan + re-read `projects.md`. Diff against the session
   cache. If the user is editing memory in this session, the canonical files in
   `~/.config/ai/memory/` and `~/Documents/` are the source of truth (they are
   symlinked from the dotfiles repo — `~/dotfiles/config/ai/memory/`).
4. **Route** — based on the task shape:
   - Content/listing/ops (titles, descriptions, meta, collections, variants, ALT) →
     hand off to `shopify-listing`.
   - Dev (apps, theme/liquid, extension/function, hydrogen, Polaris, validation) →
     hand off to the repo map at `~/dotfiles/docs/shopify-ai-development-repos.md` (which lists the official repos
     and the Shopify Dev MCP when installed).
5. **Audit** — when the user asks for a full cross-store audit, run scan + grep +
   produce a Markdown report under `~/Documents/Shopify/_audits/<date>.md` and
   reference it back.

## Hard rules

- **Never execute `productUpdate`, theme push, or app deploy** from this skill —
  it is read-only + index. Hand off to the right action skill.
- **Never overwrite canonical memory** silently. If a fact looks wrong or stale,
  surface it and propose the edit; let the user (or `dotsync`) push the change.
- **Token-safe**: prefer `scan.sh --json` then read selectively; do not bulk-dump
  memory into the prompt unless the user asks.
- **Brand policy respected**: aggregate but do not leak third-party brand names
  from the user's memory into outputs unless the store actually carries that
  brand (mirror `shopify-listing/references/copywriting.md` hard rule #1).
- **Cross-machine note**: `projects.md` mixes legacy Linux paths (`/home/fantastico/...`, now dead) and
  macOS (`~/Projects/...`) paths. On Linux, scan only Linux paths; report macOS
  paths as "see macOS machine" if not present locally.

## Output shape (when reporting)

```md
## Shopify Footprint — <date>

- **Active projects**: <count> (<comma-separated list>)
- **Stores (myshopify)**: <count> (<comma-separated list of domains>)
- **Heads of brand**: <brand>: <store-domain> (<stack>, <status>)
- **Open gotchas**: <list top 3 from memory>
- **Next action**: <route to shopify-listing | repo map | memory edit>
```

## Operational notes

- `scripts/scan.sh` is idempotent and safe to re-run; never writes to memory.
- If `shopify` CLI is missing, skip live counts; report "products: unknown (no CLI)".
- Prefer local skill `seo-website-builder` if the task is SEO-only (it has
  Shopify-specific playbooks under `references/SHOPIFY_SEO_PLAYBOOK.md`).
- When adding a new store/project, suggest updating `~/.config/ai/memory/projects.md`
  with a `### <project>` block — this is the durable cross-CLI record.

## References

- `references/playbook.md` — short playbook for common aggregations
  (onboarding, cross-store audit, before-listing-check).

## Scripts

- `scripts/scan.sh` — walk known roots, detect Shopify, output table + JSON.
  Flags: `--json` (machine-readable), `--project <name>` (filter),
  `--root <path>` (add extra project root), `--quiet` (no header).