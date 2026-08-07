# Next.js (App Router) + React — native-first

## Don't install it; Next/React already has it

| Reaching for… | Use instead |
|---|---|
| axios, got, node-fetch | native `fetch` (+ `next: { revalidate, tags }`) |
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
| a route-guard HOC | `middleware.ts`, or check in the layout/Server Component |
| express/fastify inside Next | Route Handler (`app/api/*/route.ts`) |
| a hand-rolled memo cache | `unstable_cache` / `cache()`; then `revalidateTag` / `revalidatePath` |

## Server-first defaults

- **Server Component is the default. `"use client"` is a cost** — it ships JS. Push it to the leaf that actually needs interactivity, not the page.
- Fetch in the Server Component that renders the data. No prop-drilling a fetch result down three layers; no `useEffect` fetch waterfall.
- Mutations → **Server Actions**, then `revalidateTag`/`revalidatePath`. You rarely need a Route Handler for your own UI's mutations — Route Handlers are for *external* consumers (webhooks, public API).
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
