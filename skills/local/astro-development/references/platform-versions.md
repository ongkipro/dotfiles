# Astro 6/7 Platform Facts (through 7.4)

Verified 2026-11-12 against docs.astro.build, the package changelogs, npm and a
run of astro 7.4.11 (`astro` latest 7.4.11, `@astrojs/cloudflare` latest 14.4.7;
first verified 2026-10-02 on 7.3.5 / 14.3.3). Read the installed `astro` and adapter
majors from the lockfile first; a 5.x project does not get these APIs, and a
6.x project does not get the 7.x ones.

## What changed by major

| Major | Fact that changes the code you write |
|---|---|
| 6 | Node 22.12.0+ (18/20 dropped). Zod 4: import from `astro/zod`; `z.email()` replaces `z.string().email()`; a `.default()` must match the post-transform type. |
| 6 | Removed: legacy (v2) content collections, `Astro.glob()` (use `import.meta.glob()`, which no longer returns a Promise), `<ViewTransitions />` (use `<ClientRouter />`). The `Astro` object inside `getStaticPaths()` is deprecated; use `import.meta.env.SITE`. |
| 6 | Stable: CSP (`security.csp`), Fonts API (`fonts`), live content collections. Scripts and styles render in declaration order. |
| 6 | i18n: `redirectToDefaultLocale` defaults to `false` and only applies with `prefixDefaultLocale: true`. |
| 7 | Rust compiler is the default: unclosed tags are errors and invalid HTML is no longer auto-corrected. Fix the markup; do not look for a flag. |
| 7 | `compressHTML` defaults to `'jsx'`: whitespace between inline elements can disappear like in React. Check inline links/icons in rendered text. |
| 7 | Vite 8 (Rolldown). Sätteri is the default Markdown processor; remark/rehype plugins need porting or `@astrojs/markdown-remark` reinstalled. |
| 7 | `src/fetch.ts` is reserved for advanced routing (whole request pipeline, Hono-compatible). Rename an existing file with that name. `@astrojs/db` is removed. |
| 7 | Stable: route caching, the logger, queued rendering. Agent-aware CLI: `astro dev`/`preview` background mode with a lock file and `status`/`logs`/`stop` (see SKILL.md). |
| 7.4 | **Node `>=22.23.4`** since 7.4.2 (October 2026 Node security releases; 7.4.0 required 22.22.0). Read `engines` from the installed version before pinning Node in CI or Docker. |
| 7.4 | `astro build --timings`; `image.service` accepts `{ build, runtime }` (build service for prerendered pages and dev, runtime for on-demand pages and `/_image`); `notFound()` from `astro/hono` / `astro/fetch` for custom `src/fetch.ts` entrypoints (put it before `pages()`); font providers may implement `getFontProperties()` (required in Astro 8). Experimental: `experimental.parallelPrerender` (`true` or `{ workers }`, more memory per worker; ignored when the adapter prerenders itself, which `@astrojs/cloudflare` does) and `experimental.redirectPage` (`src/pages/3xx.astro`). |
| 7.4.x | Security behavior: malformed percent-encoded paths answer 400 (7.4.5, and in dev/preview since 7.4.11); `security.allowedDomains` validates `X-Forwarded-Proto`, `-Host` and `-Port` together and rejects non-HTTP(S) protocols (7.4.11); with `security.csp.scriptDirective.strictDynamic`, bundled script hashes and an integrity import map are emitted (7.4.9). |

Sources: https://docs.astro.build/en/guides/upgrade-to/v6/,
https://docs.astro.build/en/guides/upgrade-to/v7/,
https://astro.build/blog/astro-7/ (7.0 released 2026-06-22),
https://astro.build/blog/astro-740/ (7.4 released 2026-10-15),
https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md.

## Feature notes

- **Live content collections** — runtime data (inventory, prices, CMS drafts)
  without a rebuild. Define in `src/live.config.ts` with
  `defineLiveCollection()`; a live loader implements `loadCollection` and
  `loadEntry`. Query with `getLiveCollection()` / `getLiveEntry()` from
  `astro:content`, which return an `error` to handle (`LiveEntryNotFoundError`,
  `LiveCollectionValidationError`, ...), not a throw. Use build-time
  collections when the content changes at deploy time. Loaders may return
  `cacheHint` (`tags`, `lastModified`) for `Astro.cache.set()`.
  https://docs.astro.build/en/guides/content-collections/
- **Sessions** — `Astro.session` (on-demand pages only) and `context.session`
  in endpoints, Actions, and middleware (not edge middleware): `get`, `set`,
  `regenerate` (call after login to prevent fixation), `destroy`. Node,
  Cloudflare (KV), and Netlify (Blobs) adapters supply a default driver; others
  need `session.driver`. Type data with `App.SessionData` in `src/env.d.ts`.
  Values serialize with devalue (no class instances or functions).
  https://docs.astro.build/en/guides/sessions/
- **CSP** — `security.csp: true` (or an object with `algorithm`, `directives`,
  `scriptDirective`, `styleDirective`) hashes Astro-managed scripts and styles
  and emits a `<meta>` policy. Inline scripts or third-party tags added outside
  Astro need explicit `hashes`/`resources`; test the real page for console CSP
  violations. `security.checkOrigin` (default `true`) is the built-in CSRF
  origin check for on-demand routes. Policy design belongs to
  `application-security`.
  https://docs.astro.build/en/reference/configuration-reference/
- **Fonts** — top-level `fonts: [{ provider: fontProviders.fontsource(), name,
  cssVariable }]` (`fontProviders` from `astro/config`), rendered with
  `<Font cssVariable="--font-x" preload />` from `astro:assets`. Prefer it to
  hand-written `@font-face` plus third-party CSS links in new work; it
  self-hosts and generates metric-matched fallbacks.
  https://docs.astro.build/en/guides/fonts/
- **Route caching (7.x)** — set `cache.provider` (for example `memoryCache()`
  from `astro/config` on Node), then `Astro.cache.set({...})` /
  `context.cache.set()` per response, with tags for invalidation, or
  `routeRules` in config for route groups. The Netlify, Vercel, and Cloudflare
  CDN providers are still experimental. Never cache a response that varies by
  session or role without a key that includes it.
  https://docs.astro.build/en/guides/caching/

## Cloudflare adapter (13+)

- Workers only; Cloudflare Pages deployment is no longer supported.
  The vendored `cloudflare` skill's C3 examples (`--platform=pages`) predate
  this; for adapter 13+ scaffold or migrate to Workers instead.
- Bindings: `import { env } from 'cloudflare:workers'`. `Astro.locals.runtime`
  is removed; the `cf` object is `Astro.request.cf` and the execution context
  is `Astro.locals.cfContext`. Run `wrangler types` after config changes.
- `astro dev` and `astro preview` run in `workerd` (Cloudflare Vite plugin);
  prerendering also runs in `workerd` unless `prerenderEnvironment: 'node'`.
- Sessions default to a KV binding named `SESSION`
  (`sessionKVBindingName` to change it). The default image service is
  `'cloudflare-binding'` (Cloudflare Images).
- Wrangler config is optional for basic projects; when present, `main` is
  `@astrojs/cloudflare/entrypoints/server`. Deploys go through `wrangler`
  (load that skill) and keep their approval gate.
- 14.4 (needs `astro@^7.4.0`): images on prerendered pages go through Astro's
  built-in image pipeline like every other adapter; Cloudflare Images binding
  results are cached between builds; `/_image` answers 404/400 for a missing or
  non-image source (14.4.2) and `304` on revalidation (14.4.5). The adapter's
  `process.env` define applies to the server output only (14.4.3), so client
  islands must not rely on `process.env`.
- 15.0 is in beta (`@astrojs/cloudflare@beta`); stay on 14.x unless a project
  opts into the beta deliberately.

Source: https://docs.astro.build/en/guides/integrations-guide/cloudflare/ and
https://github.com/withastro/astro/blob/main/packages/integrations/cloudflare/CHANGELOG.md
