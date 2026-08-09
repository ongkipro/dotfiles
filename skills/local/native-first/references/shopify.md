# Shopify — native-first

Highest-frequency stack in this workspace. Two very different modes — don't mix them up:

- **Store ops / listings / SEO** → the `shopify-listing` and `shopify-memory` skills owned this, and were deactivated 2026-08-10. Restore with `git revert` + `skill-update` before catalog work.
- **Theme / app / extension code** → this file + repo map `~/dotfiles/docs/shopify-ai-development-repos.md`.

## Don't build it; Shopify already has it

| Reaching for… | Use instead |
|---|---|
| a custom "custom fields" table | **Metafields** / **Metaobjects** (native, queryable, editable in admin) |
| an app to make a section configurable | Liquid **section settings + blocks** — merchant edits it in the theme editor, no app |
| a custom cart page/state | **Cart Ajax API** (`/cart/add.js`, `/cart.js`) |
| a custom search backend | Shopify's Search & Discovery + predictive search endpoint |
| a bespoke discount engine | native Discounts, or a **Shopify Function** — not app-side price math |
| a custom checkout | you can't. **Checkout Extensions** only. (Checkout.liquid is gone on Plus too.) |
| a webhook poller | registered **webhooks** (+ verify the HMAC — always) |
| a custom review system | an app (Judge.me is already in use on pixsgo) |
| storing product data in your own DB | query the **Storefront API** at build/request time. Mirror only what you must, and have a resync story. |
| REST Admin API | **GraphQL Admin API** — REST is legacy/being wound down. New code = GraphQL. |

## Headless (Astro + Storefront API) — the house pattern

Live on: pixsgo, petcue, homelook, aussie-malaysia, petanisejahtera.

- Storefront API token is **public-scoped** — fine in the client. **Admin API tokens are NOT.** Never let an Admin token reach the browser or a public Worker route.
- Prefer build-time (SSG) product fetch; go SSR only for cart/search/inventory-sensitive views.
- Cache Storefront responses at the edge — don't hit the API on every request.
- Respect rate limits: GraphQL Admin is **cost-based**, not request-count. Read `extensions.cost` in the response and back off.
- Bulk work (catalog rewrites) → **Bulk Operations**, not a `for` loop of mutations.

## Content rules (non-negotiable, from AGENTS.md)

No "Buy Now"/"Shop Now"/CTA in descriptions or meta. Brand-generic unless the user opts in — no third-party brand names in titles/ALT.

## Validation

`shopify theme check` → `shopify theme dev` (preview) → only then push.

**`shopify theme push` to a live theme is a production action** — explicit approval. Push to an unpublished theme first.
Bulk product mutations are production actions too (see `AGENTS.md` → Approval gates).
