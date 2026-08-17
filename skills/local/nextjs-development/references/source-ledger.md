# Source ledger

Primary sources retrieved 2026-08-17. The current Next.js pages identified
themselves as version 16.3.1 when this ledger was written. That is an access
snapshot, **not the skill's assumed project version**. Before using a function,
directive, file convention, config key, CLI command, cache default, runtime, or
adapter claim, recheck the installed `next`/`react` versions and the matching
current official documentation. Installed project types/source and scripts win.

## Discovery indexes and repositories

- [Next.js documentation index](https://nextjs.org/docs/llms.txt) — official
  machine-readable map; use it to find the current exact page instead of guessing
  paths.
- [Next.js documentation](https://nextjs.org/docs) — versioned product docs and
  migration guides.
- [vercel/next.js](https://github.com/vercel/next.js) — official framework source,
  releases, examples, and issue history.
- [React documentation](https://react.dev/) — official React and React Server
  Components reference.
- [facebook/react](https://github.com/facebook/react) — official React source and
  releases.
- [Vercel documentation](https://vercel.com/docs) — official platform behavior;
  use only when Vercel is the selected target.
- [vercel/vercel](https://github.com/vercel/vercel) — official Vercel CLI/platform
  open-source repository. Platform provisioning remains outside this skill.

## App Router structure and boundaries

- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
  — default component type, client module graph, composition, serialization, and
  bundle boundary.
- [Project structure](https://nextjs.org/docs/app/getting-started/project-structure)
  — App Router files and component hierarchy.
- [React Server Components](https://react.dev/reference/rsc/server-components) —
  React execution model.
- [`use client`](https://react.dev/reference/rsc/use-client) and
  [`use server`](https://react.dev/reference/rsc/use-server) — React directive
  contracts; verify framework support in the installed versions.

## Data, caching, and streaming

- [Fetching data](https://nextjs.org/docs/app/getting-started/fetching-data) —
  Server Component reads, request memoization, ORM reads, and streaming entry
  points.
- [Caching with Cache Components](https://nextjs.org/docs/app/getting-started/caching)
  — current configured-model guide.
- [Caching without Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components)
  — previous/config-disabled model. Do not combine its defaults and APIs with the
  Cache Components model.
- [Revalidating](https://nextjs.org/docs/app/getting-started/revalidating) — current
  time- and event-driven invalidation semantics.
- [Extended `fetch`](https://nextjs.org/docs/app/api-reference/functions/fetch) —
  exact supported cache/revalidation options and memoization notes.
- [React `cache`](https://react.dev/reference/react/cache) — render memoization,
  not a substitute for a persistent cache.
- [Streaming guide](https://nextjs.org/docs/app/guides/streaming) and
  [`loading` file](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
  — Suspense/route streaming and infrastructure caveats.
- [React `Suspense`](https://react.dev/reference/react/Suspense) — boundary
  behavior; check React version before relying on newer capabilities.

## Mutations, HTTP, security, and errors

- [Mutating data](https://nextjs.org/docs/app/getting-started/mutating-data) —
  Server Functions/Actions and form invocation. It explicitly treats exported
  functions as direct POST-reachable boundaries requiring authentication and
  authorization.
- [Server Actions and mutations](https://nextjs.org/docs/app/guides/server-actions)
  — Next.js-specific transport, security, and deployment behavior.
- [Forms](https://nextjs.org/docs/app/guides/forms) — validation, action state,
  pending state, and progressive enhancement.
- [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) and
  [`route` file reference](https://nextjs.org/docs/app/api-reference/file-conventions/route)
  — Web Request/Response contract, supported methods, route conflicts, cache
  behavior, and configured-mode differences.
- [Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend) —
  when Route Handlers complement the app and their backend limitations.
- [Data security](https://nextjs.org/docs/app/guides/data-security) — server-only
  data access, authorization, tainting, and action security. Cross-stack policy
  remains with `application-security`.
- [Error handling](https://nextjs.org/docs/app/getting-started/error-handling) —
  expected results versus exceptions, boundaries, not-found, and redirect.
- [React `useActionState`](https://react.dev/reference/react/useActionState) — form
  state API; installed React support must be checked.

## Metadata, environment, runtime, and instrumentation

- [Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
  — metadata object/function, server-only export, file conventions, and shared
  read memoization. `seo-website-builder` owns strategy.
- [Environment variables](https://nextjs.org/docs/app/guides/environment-variables)
  — load order, server/public boundary, build-time inlining, and runtime values.
- [Runtime reference](https://nextjs.org/docs/app/api-reference/edge) — current
  Node/default and constrained runtime capabilities. The URL/title and supported
  runtime usage can change; retrieve it again before selecting a runtime.
- [Instrumentation guide](https://nextjs.org/docs/app/guides/instrumentation) and
  [instrumentation file reference](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation)
  — registration lifecycle and runtime-specific imports.
- [Proxy file reference](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
  — current coarse request-routing convention. Older projects may use Middleware;
  inspect the installed version. Neither replaces authorization in a mutation or
  data-access boundary.

## Performance and deployment

- [Package bundling](https://nextjs.org/docs/app/guides/package-bundling) — current
  official analyzer paths and server/client bundle guidance. Analyzer commands
  and stability are volatile; verify installed CLI support first.
- [Lazy loading](https://nextjs.org/docs/app/guides/lazy-loading) and
  [production checklist](https://nextjs.org/docs/app/guides/production-checklist)
  — framework performance implementation checks. Measurements belong to
  `web-perf`.
- [Deploying](https://nextjs.org/docs/app/getting-started/deploying) — Node,
  Docker, static export, verified adapters, and feature-support boundaries.
- [Deploying to platforms](https://nextjs.org/docs/app/guides/deploying-to-platforms)
  and [Deployment Adapter API](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath)
  — compatibility responsibilities. Verify the selected adapter's own current
  support matrix as well.
- [Self-hosting](https://nextjs.org/docs/app/guides/self-hosting) — framework-side
  cache, proxy, streaming, and multi-instance concerns; infrastructure ownership
  remains with the platform skill/operator.
- [Vercel Next.js framework guide](https://vercel.com/docs/frameworks/full-stack/nextjs)
  — Vercel-specific framework support when Vercel is explicitly the target. It
  does not justify assuming Vercel behavior on another adapter.
