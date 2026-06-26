---
name: shopify-ai-toolkit-router
description: Router for Shopify development tasks — apps, Shopify CLI, app deploy/dev, GraphQL Admin/Storefront, Hydrogen, Functions, Liquid/theme code, extensions, Polaris, shopify.app.toml/shopify.extension.toml, validation. Points to the official repo map + Shopify AI Toolkit. Also Indonesian/mixed phrases like bikin app shopify, benerin shopify cli, validasi extension shopify, develop theme shopify. NOT first for store content/product management — use shopify-listing / shopify-products / shopify-setup.
---

# Shopify AI Toolkit Router

Lightweight router. This skill does **not** hold repo details — it routes to the right
references. The full, current repo map lives at:

**`~/Documents/shopify-ai-development-repos.md`** ← read this for repo functions, when to use each, clone vs link.

Prefer the **official Shopify Dev MCP / AI Toolkit** when installed (it gives live docs,
API schemas, and anti-hallucination validation):
- `/plugin marketplace add Shopify/shopify-ai-toolkit` → `/plugin install shopify-plugin@shopify-ai-toolkit`
- Local toolkit notes: `~/.ai/shopify-ai-toolkit/{README,TRIGGERS,DECISIONS,INSTALL_NOTES}.md`

## Routing table (task → references)

| Task | Refer to | Skill to prefer |
|------|----------|-----------------|
| **Theme / Liquid** | `horizon` (newest, theme blocks), `dawn` (mature patterns), `skeleton-theme` (starter); lint via `theme-tools` (theme-check); Liquid spec via `theme-liquid-docs` | `shopify-liquid` |
| **App** | CLI `cli` (`@shopify/cli`); scaffold `shopify-app-template-remix`; libs `shopify-app-js`, `shopify-api-js`, `shopify-app-bridge`; examples `shopify-app-examples` | `shopify-use-shopify-cli`, `shopify-admin` |
| **Extension / Function** | `ui-extensions` (API defs), `function-examples`, `extensions-templates`, `discounts-reference-app` | `shopify-functions`, `shopify-polaris-*` |
| **Custom data** | metafields/metaobjects | `shopify-custom-data` |
| **Hydrogen / headless** | `hydrogen`, `hydrogen-demo-store` (always via skill) | `shopify-hydrogen` |
| **Admin UI** | Polaris GitHub repos are deprecated | `shopify-polaris-app-home` |
| **Store ops (products/content)** | — | `shopify-listing`, `shopify-products`, `shopify-setup` (NOT this router) |

## Routing rules (apply first, every Shopify dev task)
1. **Theme / Liquid / Dawn tasks → consult the repo map first** (`~/Documents/shopify-ai-development-repos.md`) before choosing repos or writing code.
2. **App / CLI / extension / function tasks → consult the repo map first** for the right official repo/template, then act.
3. **Do not clone Shopify repos unless explicitly asked.** Default to reference links. Clone read-only only when the user asks to inspect specific source or base a project on a template/theme (`horizon`/`dawn`/`skeleton-theme`), into a separate reference folder — never into a project.
4. **Prefer official Shopify repos and docs over guesses.** Use the repo map + `shopify-dev` MCP / installed Shopify skills; do not invent repo names, APIs, or Liquid filters — verify against `theme-liquid-docs` / shopify.dev.

## Notes
- Rely on installed Shopify skills + `shopify-dev` MCP before opening repos.
- Validate theme: `shopify theme check`; preview: `shopify theme dev` → Chromium localhost.
- This router is for app/theme/extension **development**, not store content/product ops.
