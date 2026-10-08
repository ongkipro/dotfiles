# Astro — native-first

Astro's whole premise is *ship no JS by default*. Most "I need a library" instincts are wrong here.

## Don't install it; Astro already has it

| Reaching for… | Use instead |
|---|---|
| a React island for static markup | plain `.astro` — **zero JS**. An island is a cost; pay it only for real interactivity. |
| next/image equivalent, sharp wrappers | `astro:assets` → `<Image />` / `<Picture />` (AVIF/WebP, sizing, lazy) |
| a markdown/MDX pipeline | Content Collections + **zod schema** (`src/content.config.ts`) — typed, validated at build |
| a CMS SDK for local content | Content Collections. Reach for a CMS only when a non-dev edits it — then `cms-content` picks the smallest one (its git-based options keep collections as the storage layer). |
| a router library | file-based routing + `[slug].astro` / `[...path].astro` |
| a sitemap generator | `@astrojs/sitemap` (official) |
| an RSS lib | `@astrojs/rss` (official) |
| client-side page transitions (barba, swup) | native cross-document view transitions: `@view-transition { navigation: auto; }` in CSS (zero JS; Chrome 126+, Safari 18.2+; Firefox does a normal navigation). Add `<ClientRouter />` only for `transition:persist`, a fallback animation in unsupported browsers, or `navigate()` (Astro docs: it "will increasingly become unnecessary"). Dates: `design-taste` motion-platform-support.md |
| a scroll-anim library, for simple cases | CSS `animation-timeline: view()` / `scroll()` inside `@supports`, with content visible by default (Firefox has no scroll-driven animations as of 2026-10). GSAP+ScrollTrigger only when you need orchestration. |
| a dark-mode lib | `prefers-color-scheme` + a CSS var flip + one inline script to avoid FOUC |
| a state library across islands | `nanostores` (Astro's documented answer) — but first ask if the islands need to share state at all |
| Algolia/Elastic/a search server for a static site | **Pagefind** — runs after `astro build` over the output dir (e.g. `npx pagefind --site dist`) and ships a static index + UI; no server. Dynamic/user data search belongs in the DB (`postgres-drizzle`). |
| env var loader | `import.meta.env` (+ `astro:env` for typed/secret vars) |

## Island discipline

- `client:load` is the **most expensive** directive. Ladder down:
  `client:visible` (below the fold) → `client:idle` → `client:media` → **no directive at all**.
- One island per interactive widget. Not one island wrapping the page.
- Passing a big object as an island prop **serializes it into the HTML**. Pass an id, fetch server-side.

## Static vs server

- Default **static** (SSG). Add `output: 'server'` / prerender opt-out only for routes that genuinely need per-request data (cart, auth, search).
- Per-route: `export const prerender = false` — don't flip the whole site to SSR for one page.

## Validation

`astro check` (types + template diagnostics) → `astro build`. Then serve `dist/` and look at it.

Mobile overflow is the recurring bug in this codebase's Astro sites — check at 390px:
`document.documentElement.scrollWidth - document.documentElement.clientWidth <= 1`
(not `window.innerWidth`, which includes the scrollbar gutter and produces false
positives on desktop).

## Source notes

Pagefind verified 2026-10-02 (https://pagefind.app/docs/): post-build static
indexer, no server component. Verify flags against the installed version.
