# Next.js (App Router) + React — native-first

## Don't install it; Next/React already has it

| Reaching for… | Use instead |
|---|---|
| axios, got, node-fetch | native `fetch` (cache options are version-dependent — check Cache Components mode) |
| swr / react-query *for server data* | Server Component `await`. Reach for a client cache only for genuinely client-owned, refetching state. |
| moment, date-fns, dayjs | `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat`. Timezone-correct and zero bytes. |
| lodash | `Object.groupBy`, `structuredClone`, `Array.prototype.at/flat/toSorted`, spread |
| classnames / clsx *(if absent)* | template literal; but if `clsx`/`cn` already exists in the repo, use it — rung 2 beats rung 6 |
| uuid | `crypto.randomUUID()` |
| dotenv | Next loads `.env*` itself |
| react-helmet, next-seo | `generateMetadata()` |
| an image CDN wrapper | `next/image` (sizing, lazy, AVIF/WebP) |
| a webfont loader | `next/font` (self-hosts, kills layout shift) |
| a custom form-state hook | `useActionState` + Server Action; `useOptimistic` for optimistic UI |
| a spinner-state boolean | `loading.tsx` + `<Suspense>`; `useTransition` / `isPending` |
| a custom error boundary | `error.tsx` |
| a route-guard HOC | authorize in the data-access layer and inside every Server Action/Route Handler; Proxy (Next 16 renamed `middleware.ts` → `proxy.ts`) only for coarse redirects. A layout check is not authorization. Follow `nextjs-development`. |
| express/fastify inside Next | Route Handler (`app/api/*/route.ts`) |
| a hand-rolled memo cache | `React.cache()` for per-request dedupe; for durable caching check the installed major + Cache Components mode first (Next 16: `'use cache'` replaces `unstable_cache`, and `revalidateTag` takes a profile argument) and follow `nextjs-development` |

## Server-first defaults

- **Server Component is the default. `"use client"` is a cost** — it ships JS. Push it to the leaf that actually needs interactivity, not the page.
- Fetch in the Server Component that renders the data. No prop-drilling a fetch result down three layers; no `useEffect` fetch waterfall.
- Mutations → **Server Actions** (authorize inside each one), then the installed version's revalidation API (see `nextjs-development`). You rarely need a Route Handler for your own UI's mutations — Route Handlers are for *external* consumers (webhooks, public API).
- `useEffect` is for **synchronizing with something outside React** (a subscription, a DOM API). Data fetching, derived state, and "run once on mount" are usually a mistake — derive during render, or move it to the server.
- Derived state: compute it. Don't `useState` + `useEffect` to mirror a prop.

## Performance without a library

- `next/dynamic` for a heavy client-only widget (chart, editor, map).
- Streaming: wrap the slow part in `<Suspense>` — the shell ships immediately.
- `key` to reset state, not an effect.
- Before "optimizing": React Compiler / `memo` is a last resort. Fix the render tree first.

## Validation

Run the project's lint script or configured linter, then `tsc --noEmit` and
`next build`. Next.js CLI commands vary by installed version, so inspect
`package.json` and `next --help` rather than assuming `next lint` exists. Then
**open the page**. A green build says nothing about whether the UI works.

Common build-time trap (hit before on TokoΦ): code that throws at import time (e.g. a `db` module asserting `DATABASE_URL`) breaks `next build` in Docker. Guard the assert, or pass a dummy at build.

## Source notes

Verified 2026-10-02 against Next.js docs v16.3: Proxy rename and "verify auth
inside each Server Function"
(https://nextjs.org/docs/app/api-reference/file-conventions/proxy),
`unstable_cache` replaced by `use cache`
(https://nextjs.org/docs/app/api-reference/functions/unstable_cache),
`revalidateTag(tag, profile)` with the single-argument form deprecated
(https://nextjs.org/docs/app/api-reference/functions/revalidateTag). Verify
against the installed version's bundled docs before applying.
