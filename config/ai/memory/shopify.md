# Shopify Development

- 🔴 **`shopify-listing` and `shopify-memory` were DISABLED on 2026-08-10** at the user's request — Shopify is dormant and they are re-enabled when needed. Both are still intact in git. To restore: `git -C ~/dotfiles revert <sha>` (or `git checkout <sha>^ -- skills/local/shopify-listing skills/local/shopify-memory`) then `skill-update`. **Re-enable them before doing any Shopify catalog/listing work** — do not rebuild the skills from scratch.
- **Skill priority for Shopify content/SEO**: `shopify-memory`, `shopify-listing` (when re-enabled — see above), `seo-website-builder`, `content`, `copywriting`. Verify with: `skill-list`.
- Complete, actionable repo map: **`~/dotfiles/docs/shopify-ai-development-repos.md`** (repo map, purpose, when to use, clone vs link). The old path `~/Documents/shopify-ai-development-repos.md` DOES NOT EXIST.
- ⚠️ The `shopify-ai-toolkit-router` skill **WAS DELETED (2026-07-14)** — its contents were 100% pointers to 10 skills that never existed. For Shopify dev work, read the repo map above directly.
- Theme dev: prefer `horizon`/`dawn` + `theme-tools` (theme-check) + `theme-liquid-docs`. Headless: prefer `hydrogen` (React Router v7 on Oxygen edge runtime, free on all plans) + Storefront API; use Next.js/Astro only when required by custom constraints. App: CLI `@shopify/cli` + `shopify-app-template-remix` + `shopify-app-js`. Extension: `ui-extensions` + `function-examples`.
- **Hydrogen Headless Invariants & Dynamic Pages**:
  - *Framework Mode & Single Fetch*: In React Router v7 framework mode, route loaders return resolved data objects directly (`return await promise`), NOT `Response.json(...)`, enabling seamless `useFetcher` serialization.
  - *Storefront API `predictiveSearch` Constraint*: The GraphQL `limit` argument MUST strictly be between `1..10`. Any value `> 10` crashes with a GraphQL validation error. Always clamp: `Math.min(10, Math.max(1, limit))`.
  - *Grid-Proportional Pagination*: Dynamic PLPs (`/collections/$handle`) must paginate in exact multiples of the desktop column count (e.g. 12 items for a 4-column layout = 4x3) to prevent single orphan product cards.
  - *PDP Variant Purity*: When a product has no user-selectable options, suppress synthetic Shopify variant text (`Title: Default Title`) from the buyer-facing UI. Format Rupiah cleanly without trailing decimals `,00` (`formatRupiah`).
  - *404 & SEO Dual-Layer Defense*: Enforce `noindex, nofollow` in both route HTML meta (`<meta name="robots" content="noindex, nofollow" />`) AND edge HTTP response headers (`X-Robots-Tag: noindex, nofollow` in `entry.server.jsx`).
- Official AI plugin & MCP: `Shopify-AI-Toolkit` (`shopify-dev` MCP for live schema introspection, API docs, & GraphQL query validation; install via `/plugin marketplace add Shopify/shopify-ai-toolkit` or `npx skills add Shopify/shopify-ai-toolkit`) + `liquid-skills`.
- DO NOT clone Shopify org repos unless genuinely inspecting source or basing work on a template/theme — a reference link is enough otherwise.


---


## Lesson: Bare shpat_ client-bundle grep false-positives on Shopify Hydrogen runtime guard

### Symptom
A GitHub Actions post-build secret scan grepping bare 'shpat_' against dist/client/ fails even when zero secrets are leaked.

### Root cause
@shopify/hydrogen embeds a client-side token validation guard containing the literal prefix check o.startsWith('shpat_') in its production client bundle.

### Durable invariant
Client-bundle Shopify private token guards must match actual hex token suffixes rather than bare prefix substrings.

### Fix
Use grep -rnE 'shpat_[0-9a-fA-F]{16,}|shpss_[0-9a-fA-F]{16,}|shpca_[0-9a-fA-F]{16,}' dist/client/ in Oxygen CI verification.

### Regression check
shopify hydrogen build && ! grep -rnE 'shpat_[0-9a-fA-F]{16,}|shpss_[0-9a-fA-F]{16,}|shpca_[0-9a-fA-F]{16,}' dist/client/

> Promoted from a reviewed local candidate on 2026-11-22.


---


## Lesson: Shopify Oxygen self-hosted fonts require Vite ?url imports instead of hardcoded /fonts/ paths in JSX preload links

### Symptom
On Shopify Oxygen production, @font-face rules in CSS load WOFF2 files with HTTP 200 from https://cdn.shopify.com/oxygen-v2/.../, while JSX <link rel='preload' as='font' href='/fonts/...'> requests 404 on the custom storefront origin and cause duplicate font fetches.

### Root cause
shopify hydrogen deploy rewrites Vite asset base URLs to a per-deployment cdn.shopify.com/oxygen-v2 prefix for CSS url() and Vite asset modules, whereas static string literals like href='/fonts/...' in SSR JSX bypass Vite asset rewriting and hit the Oxygen worker route table.

### Durable invariant
Every preloaded local font or media asset in a Shopify Hydrogen / Oxygen app must resolve through the exact same Vite asset pipeline (?url module import + relative CSS url('../assets/...')) so preload href and @font-face src match byte-for-byte on both local MiniOxygen and Oxygen CDN.

### Fix
Store self-hosted WOFF2 files under app/assets/fonts/, reference url('../assets/fonts/<file>.woff2') in CSS, and import '<file>.woff2?url' in root.tsx for <link rel='preload' as='font'>.

### Regression check
grep -oE '/assets/<font-prefix>-[A-Za-z0-9_-]+\.woff2' dist/server/index.js | sort | uniq -c must show count 2 (preload + @font-face sharing one hash).

> Promoted from a reviewed local candidate on 2026-11-22.


---


## Lesson: Hardcoded /cart fetcher action drops /ar subpath locale in Hydrogen

### Symptom
Cart quantity updates, line removals, or order notes submitted from /ar pages return English titles and reset fallback buyerIdentity country.

### Root cause
getLocaleFromRequest resolves AR language from pathname prefix /ar, so fetcher.submit(..., {action: '/cart', method: 'POST'}) executes the cart route action under default EN instead of AR.

### Durable invariant
Every cart mutation fetcher.submit in subpath-localized Hydrogen routes must target the active locale prefix (/ar/cart when language is AR, /cart otherwise).

### Fix
Derive cartAction = isRTL ? '/ar/cart' : '/cart' in CartDrawer and cart.tsx and pass {action: cartAction, method: 'POST'} to all fetcher.submit calls.

### Regression check
rg -n "action:\s*['\"]/cart['\"]" app/ returns zero hardcoded /cart fetcher actions.

> Promoted from a reviewed local candidate on 2026-11-22.
