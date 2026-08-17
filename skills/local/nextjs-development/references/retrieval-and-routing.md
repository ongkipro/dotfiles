# Retrieval and routing

Use this before choosing a Next.js API. It prevents a current-docs/current-major
answer from being pasted into an older or differently configured repository.

## 1. Establish repository truth

Inspect, in order:

1. repository instructions and workspace boundaries;
2. the lockfile and root/package-level `package.json` files;
3. installed `next`, `react`, and `react-dom` versions plus package-manager
   resolutions/overrides;
4. `next.config.*`, TypeScript config, and environment declarations (not secret
   values);
5. `app/` or `src/app/`, `pages/`, route special files, Proxy/Middleware,
   instrumentation, deployment files, and tests;
6. imports and callers of the symbol or route being changed.

Prefer scripts already in `package.json`. Use the project-pinned CLI help when a
flag or subcommand is uncertain; examples:

- npm: `npm exec next -- --help`
- pnpm: `pnpm exec next --help`
- Yarn: `yarn next --help`
- Bun: `bunx next --help`

Choose only the command matching the repository's lockfile. Do not install or
invoke `@latest` merely to discover an established project's behavior.

## 2. Classify the router and feature mode

Answer these before implementation:

| Question | Evidence | Why it matters |
|---|---|---|
| App Router, Pages Router, or mixed? | route tree and imports | Data, metadata, error, and API conventions differ. |
| Which Next/React major? | installed package metadata/lockfile | Request props, Server Functions, CLI, and caching evolve. |
| Is Cache Components configured? | `next.config.*` and installed docs | This selects a different cache/prerender model. |
| Which build engine/config path? | scripts and `next.config.*` | Bundle-analysis and config support differ. |
| Which deployment form? | output config, adapter, container/platform files | Static export, Node, and adapters support different features. |
| Which server runtime is effective? | route config, defaults, adapter docs | Package APIs, ISR/cache behavior, and instrumentation differ. |
| Is this route public, authenticated, or privileged? | existing auth/data policy | Drives cache sharing and mutation authorization. |

Do not add Cache Components, change output mode, switch runtimes, or migrate the
router as an incidental fix.

## 3. Retrieve the matching official contract

1. Start from the Next.js docs index in `source-ledger.md` and select the
   installed version when the docs site offers it.
2. Read the page for the exact surface: file convention, function, config key,
   runtime, or adapter—not a blog summary.
3. For React directives/hooks, confirm the installed React version and read the
   matching React reference.
4. If documentation and installed types/source disagree, installed code governs
   implementation. Record the mismatch rather than forcing newer syntax.
5. For an adapter, read both Next.js deployment constraints and the adapter or
   platform's official compatibility matrix. “Next.js compatible” is not proof
   that revalidation, streaming, image optimization, Server Actions, or runtime
   APIs work identically.
6. Use official GitHub issues/releases only to clarify a known version-specific
   behavior; an open issue is evidence of uncertainty, not an API contract.

APIs and defaults in the source ledger are intentionally linked, not copied into
a permanent version matrix. Recheck them when touching volatile behavior.

## 4. Trace the real flow

For a page or read:

```text
request/navigation
  -> Proxy/Middleware (if present; coarse routing only)
  -> route/layout/page
  -> Server Component/data-access function
  -> cache/memoization layer
  -> database or upstream
  -> RSC/HTML/client boundary
```

For a mutation:

```text
form/client/external caller
  -> Server Action or Route Handler
  -> authenticate + authorize resource/tenant
  -> validate input and protocol controls
  -> domain/data mutation
  -> commit
  -> invalidate/revalidate
  -> return expected state or redirect
```

Inspect every caller before changing the shared data function, action, cache tag,
route path, or returned shape. Clean cutover means migrating all callers and
removing obsolete paths; do not leave compatibility aliases unless explicitly
required.

## 5. Route to another owner when the decision is not Next.js-specific

- Unknown product flow or authorization roles: `admin-product-ux` or the product
  specification owner before implementation.
- Cross-stack auth, input, CSRF, webhook, upload, SSRF, or data-exposure policy:
  `application-security`; Better Auth mechanics: `better-auth-security`.
- Test-layer selection and durable behavioral coverage: `testing-engineering`;
  rendered browser evidence: `ui-validation`.
- Telemetry model and SLOs: `observability-engineering`; page-performance
  measurement: `web-perf`.
- Data schema/query/transaction semantics: `postgres-drizzle` or
  `supabase-stack`.
- Component APIs or admin presentation: `shadcn-ui` / `admin-dashboard`.
- Deployment provisioning and CI: the platform owner / `github-actions`.
