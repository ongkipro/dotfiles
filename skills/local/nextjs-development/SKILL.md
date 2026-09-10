---
name: nextjs-development
description: Retrieval-first Next.js App Router architecture and implementation. Use when creating, changing, debugging, or reviewing Next.js App Router routes, layouts, Server/Client Components, data fetching and caching, Route Handlers, Server Actions, forms, metadata, streaming, runtime selection, instrumentation, or deployment output. Inspect the installed Next.js/React versions and project configuration before using APIs. Not for generic React tutorials, visual design, SEO strategy, automated test strategy, cross-stack AppSec, observability design, or Vercel infrastructure.
---

# Next.js Development

Installed code wins. Current official documentation for the installed Next.js and
React versions wins over remembered syntax, defaults, and this skill. App Router
semantics—especially caching, request APIs, Proxy/Middleware conventions, Server
Functions, runtimes, and adapters—are volatile; retrieve them before changing
those surfaces.

## Scope and triggers

Use this skill for App Router architecture and implementation:

- `app/` routes, layouts, route groups, special files, and navigation;
- Server and Client Component boundaries;
- server data reads, streaming, cache policy, and revalidation wiring;
- Route Handlers and Server Actions/Functions;
- forms and route-level loading, expected-error, exception, not-found, and
  redirect behavior;
- metadata implementation, environment boundaries, runtime choice,
  instrumentation hooks, output mode, and framework bundle work.

Do not use it for Pages Router migration from memory. Inspect the existing
router and retrieve the installed version's migration guide before a cutover.
Do not turn a Next.js task into a generic React tutorial.

## Ownership and handoffs

This skill owns **Next.js implementation boundaries**, not every decision inside
them:

| Need | Owner |
|---|---|
| End-to-end stack routing and evidence gates | `full-stack-development` |
| Product/operator workflow, roles, lifecycle, and screen contracts | `admin-product-ux` |
| Admin information architecture and presentation | `admin-dashboard` |
| Non-admin visual direction | `design-taste` |
| Existing shadcn component APIs and registry work | `shadcn-ui` |
| Storefront journey/state decisions and implementation | `storefront-ux`, then `storefront-development` |
| Automated behavioral test strategy and contract coverage | `testing-engineering` |
| Browser-visible evidence | `ui-validation` |
| Cross-stack application security | `application-security` |
| Better Auth configuration and hardening | `better-auth-security` |
| Logs, metrics, traces, and SLO design | `observability-engineering` |
| Performance diagnosis and measurement | `web-perf` |
| Plain PostgreSQL/Drizzle data engineering | `postgres-drizzle` |
| Supabase Auth/RLS/Storage/Realtime | `supabase-stack` |
| Public REST contract | `openapi-spec` |
| SEO strategy, indexation, schema, sitemap/canonical policy | `seo-website-builder` |
| Native feature/dependency decision | `native-first` |
| CI workflow engineering | `github-actions` |
| Cloudflare runtime implementation | `workers-best-practices` |
| Vercel deployment, domains, project linking, and edge infrastructure | `vercel` |

Next.js implements accepted metadata and UI contracts; it does not invent SEO,
workflow, security, observability, component, or visual policy.

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
6. Retrieve only the relevant current official pages from
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
mutation or data authorization boundary. With Better Auth, load
`better-auth-security` before touching auth code.

## Route and platform concerns

- Use Route Handlers' Web `Request`/`Response` APIs unless an inspected Next
  extension is necessary. Make method, content type, status, and cache headers
  explicit where they are part of the contract.
- Implement metadata with the App Router metadata object/function or metadata
  files supported by the installed version. Keep it in Server Components and
  deduplicate shared reads. `seo-website-builder` decides content/indexing policy.
- Keep secrets server-only. `NEXT_PUBLIC_*` values are public and normally frozen
  into client output at build time; they are not a runtime secret channel.
  Distinguish build-time from request-time environment needs.
- Default to the supported Node runtime. Select another runtime only after
  checking package/API compatibility, cache/ISR constraints, streaming, and the
  deployment adapter's current support.
- Instrumentation hooks provide framework lifecycle integration; event names,
  telemetry schema, sampling, redaction, and SLOs belong to
  `observability-engineering`.
- Node/Docker, static export, and adapters have different feature envelopes.
  Verify Server Actions, Route Handlers, image optimization, cache persistence,
  revalidation, streaming, and filesystem assumptions against the target.
  Platform provisioning and Vercel infrastructure route to `vercel`.

## Bundle and performance discipline

Apply the production rules in `references/react-performance-rules.md` (concurrency waterfalls, barrel imports, action auth, React.cache).
Keep `'use client'` leaves narrow, import heavy browser libraries only where
used, and run expensive non-interactive transforms on the server. Prefer native
Next image/font/linking and code-splitting features already in the installed
version. Analyze a bundle only with the project's existing tooling or a
version-confirmed official method; do not add an analyzer speculatively.

A build reports compilation/prerendering/output facts, not Core Web Vitals or UI
correctness. Hand measured diagnosis to `web-perf` and browser behavior to
`ui-validation`.

## Verification and delivery

Use `references/verification.md`. Minimum evidence is layered:

1. Run the narrowest project script that checks the changed contract (types,
   focused behavioral test, or route-specific check).
2. Run the repository build when output, prerendering, cache/static analysis,
   metadata generation, runtime compatibility, or production bundling changed.
3. Start the real local runtime and smoke the affected route/action/handler,
   including the relevant unauthorized/error path for a trust boundary.
4. For browser-visible behavior, use `ui-validation` and exercise the page. A
   successful build is never UI evidence.
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
- Claiming `next build` proves interaction, responsive layout, accessibility,
  cache invalidation at runtime, or production platform behavior.
