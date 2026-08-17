# App Router implementation contracts

Retrieve the installed version's official reference before copying any API name
or option from this file. The invariant is stable; syntax and defaults are not.

## Server and Client Component boundary

### Keep on the server

- database/upstream access and credentials;
- authorization-sensitive reads;
- non-interactive rendering and expensive pure transforms;
- metadata generation;
- modules that use Node/server runtime APIs.

### Move only the interactive leaf to the client

Use a Client Component for event handlers, client state, effects, browser APIs,
or a dependency that genuinely needs the DOM. The `'use client'` directive
creates a module-graph boundary, so audit what that module imports. It is not a
marker for “renders in a browser”; Server Components also produce browser UI.

Props crossing server to client must be serializable under the installed React
contract. Send the minimum display data, not whole ORM records or security
objects. A Client Component may accept already-rendered server content as
children/slots; it must not import the server implementation into its client
module graph.

Avoid:

- page/layout-wide client directives for one control;
- `useEffect` data fetching for data needed on first render;
- copying props into state and synchronizing them with an effect;
- browser bundles containing validation schemas, SDKs, or transforms used only
  on the server;
- relying on a “server-only” module marker as the sole secret-control measure.

## Data reads and concurrency

Read data in the Server Component that consumes it or through the project's
existing data-access boundary. Reuse the same data function from metadata and
page rendering when they need the same entity.

Avoid accidental waterfalls:

- start independent operations together and await them together;
- pass an unresolved promise through the supported React pattern only when it
  improves streaming and the installed version supports the consumer API;
- do not parallelize operations with a real dependency or transaction order;
- cap or batch fan-out when input size is unbounded.

Handle upstream failures deliberately: check HTTP status before trusting bodies,
set timeouts/abort behavior through the project's convention, and do not leak
upstream error payloads to users. `application-security` owns SSRF, redirect,
upload, and other cross-stack input controls.

## Memoization is not caching

| Mechanism | Purpose | What it does not prove |
|---|---|---|
| React/render request memoization | Deduplicate equivalent reads during a render | Cross-request reuse, freshness, or invalidation |
| Persistent data cache | Reuse a value beyond one render/request | Authorization correctness or visible route refresh |
| Full-route/static output | Reuse rendered route output | Freshness of every underlying system |
| Client/router cache | Reuse prefetched/visited route payloads | Server cache invalidation or database freshness |

Identical supported `fetch` requests may be memoized in the React component tree.
For ORM/non-`fetch` reads, React's `cache` may provide render-scoped deduplication
when used as documented for the installed versions. Neither is a durable cache.
Do not use memoization language when promising a freshness lifetime.

## Select the configured cache model

### Cache Components enabled

Use the installed version's Cache Components guide. Cache only the function or
component that benefits, assign an explicit lifetime/profile, and attach the
smallest useful invalidation identity where supported. Confirm current
constraints for cache keys, closed-over values, request APIs, private/user data,
and Route Handlers. Do not assume a directive can be placed in every function
body or handler.

### Cache Components not enabled

Use the official “without Cache Components”/previous-model guide for that
version. Make each `fetch` caching decision explicit. For database or other
non-`fetch` work, use the project's existing supported cache primitive. Broad
route-segment flags are a last resort because they can change every read under a
segment.

### In both models

For each cached value, document in code or its nearest contract:

- key dimensions: entity, locale, tenant/user/role where relevant;
- sharing scope and sensitivity;
- lifetime/staleness budget;
- event that invalidates it;
- tag/path relationship and affected callers;
- adapter/store behavior across processes and regions.

Revalidation APIs change semantics between releases (immediate expiry versus
stale-while-revalidate profiles, for example). Retrieve the exact function
reference before choosing one. Trigger invalidation after commit, never before.
Test the second read and the post-mutation read in a production-like local
runtime; development mode is not cache evidence.

## Route Handlers

Use `route.ts|js` when the caller needs an HTTP contract: external API, webhook,
OAuth/provider callback, feed/file response, or explicit status/header/body
control. For an internal Server Component read, call the underlying domain/data
function directly instead of adding a loopback HTTP hop.

Handler order:

1. reject unsupported method/content type and enforce request-size controls at
   the appropriate layer;
2. authenticate and authorize the actor/resource/tenant;
3. validate path/query/header/body input;
4. apply protocol controls (origin/CSRF, signature timestamp and raw-body
   verification, replay/idempotency, rate limits) as the endpoint requires;
5. execute the domain operation/transaction;
6. revalidate after commit;
7. return the contract's status, safe headers, and safe body.

GET caching differs by Next.js mode and handler behavior. Never assume a GET is
cached or uncached; retrieve the configured model and make externally observable
cache headers intentional. Do not cache an authenticated response publicly.

Webhooks should verify the provider's current signature contract against the
exact raw bytes before parsing when required. Do not reuse browser-cookie auth
or enable permissive CORS by default.

## Server Actions and forms

Use Server Actions/Functions for UI-owned mutations when the installed
Next.js/React versions support the intended form lifecycle. Treat every exported
server function as a public POST-reachable endpoint, even if its only visible
caller is a hidden or disabled control.

Action order:

1. authenticate inside the action;
2. authorize the specific operation and resource using trusted server data;
3. parse and validate every `FormData`/bound argument—hidden fields are
   attacker-controlled;
4. apply the domain transaction and idempotency/concurrency rule;
5. return a typed expected-error state or, after success, invalidate and
   navigate according to the accepted flow.

Bind identifiers for ergonomics only, not trust. Re-read ownership/tenant scope
on the server. Avoid mass-assigning `FormData` or accepting client-supplied role,
price, owner, or tenant fields as authoritative.

Prefer semantic `<form>` controls and progressive enhancement. Use the current
React form/action state APIs for field/general errors and pending state only
after checking the installed React version. Preserve input where the accepted
flow requires it, prevent accidental repeat submission in the UI, and enforce
idempotency server-side for consequential or retryable operations.

Expected validation/conflict failures should be safe structured results.
Unexpected infrastructure or programming failures should throw to an error
boundary and telemetry path. Never return stack traces, SQL/provider errors, or
whether an unrelated protected resource exists.

## Loading, error, not-found, and redirect

- `loading.*` covers a route-segment transition; a nearer `<Suspense>` boundary
  isolates one slow subtree. Keep meaningful shell content outside the boundary.
- Expected errors render a recoverable state with a useful message. Unexpected
  exceptions reach the nearest intentional `error.*`/global boundary.
- `notFound()` represents absence, not a generic substitute for forbidden,
  invalid, or failed data. Choose disclosure behavior with `application-security`
  and the product contract.
- Redirect only after deciding the request outcome. Navigation helpers can throw
  framework control-flow signals; do not consume them in broad catches.
- An error boundary fallback must avoid exposing sensitive error details and
  offer only recovery that is safe to repeat.

Test loading, empty, invalid, unauthorized/forbidden, missing, conflict, upstream
failure, and success states that the changed route can actually reach.

## Metadata

Use the App Router metadata object for static values, the installed
`generateMetadata` contract for route data, and supported metadata file
conventions for icons/OG/sitemap/robots. Metadata exports belong to Server
Components. Share/memoize entity reads with the page under the configured data
model rather than issuing an accidental duplicate database query.

`seo-website-builder` owns titles/descriptions/canonical/indexation/schema
strategy. This skill implements that accepted contract. Verify rendered head
output at the actual route, including missing entities and dynamic parameters;
a typecheck does not prove final metadata or crawler behavior.

## Environment and secret boundaries

- Next loads environment files according to its documented order; inspect names
  and declarations, never secret values, during routine work.
- Unprefixed variables stay server-side only if they are never copied into client
  props, rendered markup, logs, or public responses.
- `NEXT_PUBLIC_*` means public, client-bundled configuration and is normally
  inlined/frozen at build time. It is unsuitable for secrets and for values that
  must change when one artifact is promoted between environments.
- Separate values required during `next build` from values required only while a
  request is handled. Avoid importing a secret-dependent client into a
  prerender/build path unintentionally.
- Validate required configuration at the narrowest reliable lifecycle boundary
  for the deployment form. Do not fabricate placeholder production fallbacks.

## Runtime and deployment adapters

Node is the default full-featured runtime. Choose a constrained/edge runtime
only when the route benefits and every imported dependency/API is compatible.
Check current limitations for Node APIs, native modules, ISR/revalidation,
streaming, and dynamic evaluation. Runtime choice is per actual deployment
support, not a latency slogan.

Before accepting an output/adapter change, check:

- Server Actions and Route Handlers;
- dynamic rendering and request APIs;
- cache persistence, tag/path invalidation, and multi-instance behavior;
- image optimization and metadata image generation;
- streaming versus buffering;
- filesystem writes, native dependencies, and process lifetime;
- instrumentation/runtime hooks and environment timing;
- static export's unsupported server features.

Next.js implementation stops at the adapter contract. Provisioning, domains,
regions, secrets, production promotion, and Vercel infrastructure remain with
the deployment/platform owner.

## Instrumentation

Use the installed instrumentation convention as a framework hook. Registration
can run once per server instance, not once for the lifetime of a distributed
application. Keep startup bounded, conditionally import runtime-specific code,
and do not run schema migrations or destructive initialization from
instrumentation.

`observability-engineering` owns event/attribute names, trace propagation,
sampling, redaction, retention, and SLOs. This skill only connects the accepted
telemetry implementation to the correct Next.js lifecycle and runtime.

## Bundle and rendering performance

1. Audit client boundaries and their import graphs before adding memoization.
2. Move non-interactive transforms and server-safe libraries out of client
   modules.
3. Start independent reads concurrently and place Suspense around genuinely slow
   regions rather than every component.
4. Use installed Next image/font/navigation/lazy-loading primitives when they fit.
5. Use a version-matched official bundle-analysis path only when measurement
   identifies a bundle question.
6. Hand Core Web Vitals and network/render diagnosis to `web-perf`.

Streaming and Server Components can improve delivery, but only measurement proves
performance. A smaller client boundary is an implementation invariant; a faster
page is a measured result.
