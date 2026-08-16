# Shopify Development

- 🔴 **`shopify-listing` and `shopify-memory` were DISABLED on 2026-08-10** at the user's request — Shopify is dormant and they are re-enabled when needed. Both are still intact in git. To restore: `git -C ~/dotfiles revert <sha>` (or `git checkout <sha>^ -- skills/local/shopify-listing skills/local/shopify-memory`) then `skill-update`. **Re-enable them before doing any Shopify catalog/listing work** — do not rebuild the skills from scratch.
- **Skill priority for Shopify content/SEO** (moved out of `AGENTS.md`, 2026-07-20): `shopify-memory`, `shopify-listing` (both currently disabled — see above), `seo-website-builder`, `content`, `copywriting`. Verify with: `skill-list`.
- Complete, actionable repo map: **`~/dotfiles/docs/shopify-ai-development-repos.md`** (repo map, purpose, when to use, clone vs link). The old path `~/Documents/shopify-ai-development-repos.md` DOES NOT EXIST.
- ⚠️ The `shopify-ai-toolkit-router` skill **WAS DELETED (2026-07-14)** — its contents were 100% pointers to 10 skills that never existed. For Shopify dev work, read the repo map above directly.
- Theme dev: prefer `horizon`/`dawn` + `theme-tools` (theme-check) + `theme-liquid-docs`. App: CLI `@shopify/cli` + `shopify-app-template-remix` + `shopify-app-js`. Extension: `ui-extensions` + `function-examples`.
- Official AI plugin: `Shopify-AI-Toolkit` (= the source of the `shopify-dev` MCP) + `liquid-skills`.
- DO NOT clone Shopify org repos unless genuinely inspecting source or basing work on a template/theme — a reference link is enough otherwise.
