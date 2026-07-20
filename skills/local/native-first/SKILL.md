---
name: native-first
description: >-
  Per-stack cheatsheet for "what does the platform already give me?" — reach for
  the built-in before adding a dependency, an abstraction, or a custom layer.
  Also carries the smallest validation command per stack. Use BEFORE installing
  a package, writing a util/wrapper/abstraction, hand-rolling auth/cache/date/
  validation logic, or choosing how to verify a change. Covers Next.js/React,
  Astro, Node/TS, Cloudflare Workers, Vercel, Postgres+Drizzle+better-auth,
  Shopify (Liquid/Storefront/CLI), and self-host (Docker/Coolify/Vultr).
  Triggers: "perlu install apa", "pakai library apa", "npm i", "pnpm add",
  "bikin helper/wrapper/abstraction", "cara validasi", "gimana cek ini jalan",
  over-engineering, bloat, dependency baru. NOT a general dev-task router —
  it answers one question: does the platform already do this?
---

# Native-first

The ladder lives in `AGENTS.md` (always on). This skill is rung 3–5 made concrete:
**what does this specific stack already give me, before I add anything?**

Read only the reference for the stack you're in. Don't load them all.

| Stack | Reference |
|---|---|
| Next.js 16 / React | `references/next-react.md` |
| Astro | `references/astro.md` |
| Node / TypeScript | `references/node-ts.md` |
| Cloudflare Workers | `references/cloudflare.md` |
| Vercel | `references/vercel.md` |
| Postgres + Drizzle + better-auth | `references/data.md` |
| Shopify (Liquid / Storefront / CLI) | `references/shopify.md` |
| Self-host (Docker / Coolify / Vultr) | `references/selfhost.md` |
| Browser (HTML / CSS / JS — any framework) | `references/browser.md` |

## The dependency test

Before `npm i` / `pnpm add`, answer all four. Any "no" → don't install.

1. **Does the runtime already do it?** (`fetch`, `URL`, `Intl`, `crypto`, `structuredClone`, CSS, a DB constraint)
2. **Does an already-installed dep do it?** Check `package.json` first — you probably have it.
3. **Is it more than ~30 lines to write?** Below that, a dep costs more than it saves (supply chain, bundle, upgrade tax).
4. **Is it maintained?** Last release < 12 months, no critical advisories.

Adding it anyway is a legitimate call — but say in one line what you skipped and why.

## Validation — smallest check that fails if you broke it

Never claim "it works" without running one of these. Prefer the project's own
`package.json` scripts over anything here.

| Stack | Smallest → fuller |
|---|---|
| Next.js | `next lint` → `tsc --noEmit` → `next build` |
| Astro | `astro check` → `astro build` |
| Node/TS | `tsc --noEmit` → `node --test` |
| Cloudflare Workers | `wrangler types` → `wrangler dev` (hit the route) → `wrangler deploy --dry-run` |
| Drizzle | `drizzle-kit generate` (inspect the SQL — never blind-apply) → `drizzle-kit migrate` |
| Shopify theme | `shopify theme check` → `shopify theme dev` |
| Docker/Coolify | `docker compose config` → `docker compose build` → healthcheck green |

**Browser-visible change?** Run the dev server and actually look — a green build
is not proof the UI works. Playwright at 390px is the house check for mobile
overflow: `document.documentElement.scrollWidth === window.innerWidth`.

## Anti-patterns seen in this codebase's history

- A 404-line date picker where `<input type="date">` was the answer.
- An interface with one implementation. A factory for one product. A config for a value that never changes.
- A custom cache class where `unstable_cache` / `caches.default` / an index already covered it.
- Patching the one caller the ticket named, leaving three sibling callers broken.
