---
name: nextjs-development
description: >-
  Next.js App Router architecture and implementation: routes, layouts, Server/Client Components, caching, Route Handlers, Server Actions, forms, metadata, streaming, runtime. Not React tutorials, visual design, SEO, tests, AppSec, or Vercel infra.
---

# Next.js Development

Installed code wins. Current official documentation for the installed Next.js and
React versions wins over remembered syntax, defaults, and this skill. App Router
semantics—especially caching, request APIs, Proxy/Middleware conventions, Server
Functions, runtimes, and adapters—are volatile; retrieve them before changing
those surfaces.

Read only this file up front; open a reference when a step names it.

**Pick the path first:**
- Bug or small change in an existing route → "Inspect first" steps 1–2, 4,
  6 → the one section below for the surface touched → "Verification".
- New route/feature → "Inspect first" in full → sections in order →
  "Verification".
- Cache/revalidation question → "Inspect first" step 5 → "Data, memoization,
  caching" → `references/app-router-contracts.md`.

## Scope

App Router architecture and implementation: `app/` routes, layouts, special
files, navigation; Server/Client boundaries; reads, streaming, cache and
revalidation; Route Handlers and Server Actions; forms and loading/error/
not-found/redirect behavior; metadata, env boundaries, runtime, instrumentation
hooks, output mode. Not a Pages Router migration from memory and not a React
tutorial.

## Ownership and handoffs

This skill owns Next.js implementation boundaries; it implements accepted
metadata, UI, security, telemetry, and component contracts and does not
invent them. Owners by concern are in the skill map; the ones this skill hands
to most: `postgres-drizzle` (data), `better-auth-security` (auth),
`seo-website-builder` (metadata policy), `observability-engineering`
(telemetry schema), `web-perf` (measurement), `ui-validation` (browser proof),
`vercel`/`workers-best-practices` (platform), `native-first` (dependencies).

## Inspect first

Before proposing code or commands:

1. Read repository instructions, `package.json`, the lockfile, workspace config,
   and scripts. Use the lockfile's package manager and project-pinned binaries.
2. Confirm exact installed `next`, `react`, and `react-dom` versions. Determine
   whether this is App Router, Pages Router, or mixed; never infer it from the
   task wording.
3. Inspect `next.config.*`, `tsconfig.json`, the `app/`/`src/app/` tree, route
   special files, Proxy/Middleware file, instrumentation files, and deployment
   adapter/config relevant to the affected route.
4. Search for existing data-access, auth/session, validation, error, metadata,
   cache/revalidation, logging, and test patterns. Reuse them; a second convention
   is prohibited.
5. Determine whether Cache Components or another version-specific cache mode is
   configured. This decision changes the caching model.
6. Read version-matched docs first: Next.js 16.2+ bundles them at
   `node_modules/next/dist/docs/` (resolve from the app's own `node_modules` in
   a monorepo). Then retrieve only the relevant current official pages from
   `references/source-ledger.md`. Use the docs version selector or the installed
   package source/types when current docs describe a different major.
7. Write down the route's execution contract: runtime, public/private data,
   freshness, mutation boundary, failure states, and deployment capabilities.

Use `references/retrieval-and-routing.md` for the discovery decision tree.

## Server-first implementation

Pages and layouts are Server Components unless the installed version proves
otherwise. Keep data access, secrets, non-interactive transforms, and static
markup on the server.

Add `'use client'` only at the smallest interactive leaf requiring state, event
handlers, effects, browser APIs, or a client-only library. The directive creates
a client module-graph boundary: imports below it can enter the client bundle.
Never clientify a page/layout merely because one descendant is interactive.
Pass serializable data and server-rendered content across the boundary; never
pass secrets, database handles, or server-only modules.

Before adding a client data library, use `native-first`. Fetch in a Server
Component when the server owns the data. Client fetching is justified for data
whose lifecycle is genuinely browser-owned, continuously refreshed, or driven
by a client-only interaction.

## Data, memoization, caching, and revalidation

Treat these as different mechanisms:

- **Request/render memoization** deduplicates equivalent work during a render. It
  is not durable caching and does not provide freshness or invalidation.
- **Persistent/shared data caching** reuses results across renders or requests.
  It needs an explicit owner, key, scope, lifetime, and invalidation event.
- **Route/client caches** can retain rendered route payloads independently of a
  database or data cache. A data mutation does not automatically prove every
  visible cache was refreshed.

Never paste caching guidance until you have checked the installed major and
`next.config.*`. Cache Components and the previous model use materially
different APIs and defaults. Prefer explicit per-data decisions over broad route
flags. For each cached read, record:

1. who may share the value (global, tenant, user, request only);
2. the key inputs and whether auth/locale/tenant is included;
3. acceptable staleness;
4. the mutation that invalidates it;
5. behavior when the cache store is unavailable or not shared by the adapter.

Never cache personalized or authorization-sensitive output under a public key.
Do not assume development reproduces production cache behavior. Revalidate only
after a successful committed mutation, at the narrowest tag/path supported by
the installed model. See `references/app-router-contracts.md`.

## Reads, streaming, and failure states

Start independent reads before awaiting them; avoid serial waterfalls. Fetch
near the Server Component that consumes the data unless a shared data-access
boundary already exists. Do not make a Server Component call the application's
own Route Handler over HTTP; call the underlying domain/data function directly.

Use route `loading.*` for route-segment fallback and `<Suspense>` for a smaller
slow subtree. A fallback should resemble the eventual region and preserve useful
shell content. Streaming improves delivery order, not database latency; verify
that the deployment adapter actually streams and does not buffer.

Model expected failures (validation, conflict, known upstream rejection) as
explicit values/statuses. Let unexpected exceptions reach the nearest intended
error boundary and observability path. Use `notFound` only for a genuinely
missing resource and redirect for an intentional navigation outcome. Framework
navigation helpers may use control-flow exceptions; verify current docs and do
not swallow them in broad `try/catch` blocks.

## Mutations: Server Actions and Route Handlers

Prefer Server Actions/Functions for mutations owned by the rendered Next.js UI
when progressive enhancement and the framework form lifecycle fit. Prefer Route
Handlers for public/machine APIs, webhooks, callbacks, downloads, or work needing
explicit HTTP method/status/header/body control.

Both are remotely reachable trust boundaries. **Every mutation entry point must
independently authenticate and authorize the actor and resource**, even when a
layout, Proxy/Middleware, or hidden button also checks access. Then validate
untrusted input, enforce tenant/ownership scope, perform the mutation, and only
then revalidate/redirect. Apply CSRF/origin, webhook signature, replay/idempotency,
rate, and payload-limit controls as required by `application-security` and the
project's existing stack. Never log raw secrets, tokens, or sensitive form data.

Proxy/Middleware is useful for coarse routing and early rejection, not the sole
mutation or data authorization boundary (Next.js 16 renamed the
`middleware` file convention to `proxy`; check the installed major). With
Better Auth, load `better-auth-security` before touching auth code and its
`references/auth-flows.md` for sign-up, verification, reset, invite, OAuth or
magic-link, and session-expiry UX.

## Internationalization

App Router i18n is `app/[lang]/` + locale negotiation in Proxy + server-side
dictionaries; the Pages Router `i18n` config does not apply. Details and the
version-specific APIs: `references/app-router-contracts.md` § Internationalization.
Hreflang and localized sitemaps belong to `seo-website-builder`.

## Route, platform, and bundle concerns

Route Handlers use Web `Request`/`Response`; metadata lives in Server
Components via the installed version's metadata API; secrets stay server-only
(`NEXT_PUBLIC_*` is public and frozen at build); default Node runtime unless
compatibility evidence says otherwise; Node/Docker, static export, and
adapters have different feature envelopes — verify Server Actions, image
optimization, cache persistence, streaming against the target. Keep
`'use client'` leaves narrow and heavy browser libraries at their use site;
analyze bundles only with existing tooling. Details:
`references/app-router-contracts.md` § Route and platform concerns and
`references/react-performance-rules.md` (waterfalls, re-renders, view
transitions, `motion` import rules). A build reports output facts, not Core
Web Vitals (`web-perf`) or UI correctness (`ui-validation`).

## Verification and delivery

Use `references/verification.md`. Minimum evidence is layered:

1. Run the narrowest project script that checks the changed contract (types,
   focused behavioral test, or route-specific check).
2. Run the repository build when output, prerendering, cache/static analysis,
   metadata generation, runtime compatibility, or production bundling changed.
3. Start the real local runtime and smoke the affected route/action/handler,
   including the relevant unauthorized/error path for a trust boundary.
4. For browser-visible behavior, use `ui-validation` and exercise the page. A successful build is never
   UI evidence.
5. Report the command, route/state exercised, and observed result. Do not claim
   deployment compatibility, cache invalidation, streaming, or UI behavior that
   was not observed.

## Anti-patterns

- Adding `'use client'` to a page/layout to fix one hook or third-party widget.
- Treating request memoization as durable caching or assuming cache defaults from
  another Next.js major.
- Caching user/tenant data without identity in the key and an invalidation plan.
- Fetching the app's own Route Handler from a Server Component.
- Trusting a layout, Proxy/Middleware, or client visibility as authorization.
- Returning validation errors as generic exceptions or swallowing redirects in
  `catch` blocks.
- Exposing a secret through `NEXT_PUBLIC_*` or passing it into a Client Component.
- Selecting a non-default runtime for presumed speed without dependency and
  adapter evidence.
- Adding client state/effects for derived or server-owned data.
- Claiming a route is clean because it returned HTTP 200 — in `next dev` a
  route with blocking errors still returns 200; read the overlay or `/_next/mcp`.
- Claiming `next build` proves interaction, responsive layout, accessibility,
  cache invalidation at runtime, or production platform behavior.
