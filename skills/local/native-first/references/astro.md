# Astro — native-first

Astro's whole premise is *ship no JS by default*. Most "I need a library" instincts are wrong here.

## Don't install it; Astro already has it

| Reaching for… | Use instead |
|---|---|
| a React island for static markup | plain `.astro` — **zero JS**. An island is a cost; pay it only for real interactivity. |
| next/image equivalent, sharp wrappers | `astro:assets` → `<Image />` / `<Picture />` (AVIF/WebP, sizing, lazy) |
| a markdown/MDX pipeline | Content Collections + **zod schema** (`src/content.config.ts`) — typed, validated at build |
| a CMS SDK for local content | Content Collections. Reach for a CMS only when a non-dev edits it. |
| a router library | file-based routing + `[slug].astro` / `[...path].astro` |
| a sitemap generator | `@astrojs/sitemap` (official) |
| an RSS lib | `@astrojs/rss` (official) |
| client-side page transitions (barba, swup) | `<ClientRouter />` (view transitions) |
| a scroll-anim library, for simple cases | CSS `animation-timeline: view()` / `scroll()`. GSAP+ScrollTrigger only when you need orchestration. |
| a dark-mode lib | `prefers-color-scheme` + a CSS var flip + one inline script to avoid FOUC |
| a state library across islands | `nanostores` (Astro's documented answer) — but first ask if the islands need to share state at all |
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
`document.documentElement.scrollWidth === window.innerWidth`.
