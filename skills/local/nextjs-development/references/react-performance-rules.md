# React & Next.js Performance Engineering Rules

Paraphrased from Vercel Engineering production rules
(`vercel-labs/agent-skills/react-best-practices`), with impact levels as
published there. Use when authoring, reviewing, or refactoring React and
Next.js App Router components, data fetching, and bundle configurations.
Version-sensitive APIs (caching, `next/dynamic`, view transitions) must be
checked against the installed Next.js/React versions and official docs.

## Priority Hierarchy

| Priority | Category | Impact | Focus |
|---|---|---|---|
| **P1** | **Eliminating Waterfalls** | CRITICAL | Data fetching concurrency & Suspense streaming |
| **P2** | **Bundle Size Optimization** | CRITICAL | Tree-shaking, dynamic/conditional imports, preload |
| **P3** | **Server-Side Performance** | HIGH | Action security, dedup, static I/O, cross-request cache |
| **P4** | **Client Data & Re-renders** | MEDIUM-HIGH / MEDIUM | State placement, derived state, transitions |
| **P5** | **Rendering** | MEDIUM | Hints, scripts, hydration, Activity, view transitions |

---

## 1. Eliminating Waterfalls (P1 - CRITICAL)

### `async-cheap-condition-before-await`
Evaluate synchronous condition guards and cheap memory checks before awaiting asynchronous promises or remote resources:
```ts
// Bad: awaits DB before checking feature flag or memory cache
const data = await getCustomerData(id);
if (!featureEnabled) return null;

// Good: bail out early before network/disk round-trip
if (!featureEnabled) return null;
const data = await getCustomerData(id);
```

### `async-defer-await`
Defer `await` expressions into the specific conditional branches where the resolved data is actually consumed:
```ts
// Bad: awaits both branches regardless of which one runs
const reportPromise = getReport();
const summaryPromise = getSummary();
const report = await reportPromise;
const summary = await summaryPromise;
if (mode === 'summary') return <SummaryView data={summary} />;
return <ReportView data={report} />;

// Good: only await what is needed for the active branch
if (mode === 'summary') {
  const summary = await getSummary();
  return <SummaryView data={summary} />;
}
const report = await getReport();
return <ReportView data={report} />;
```

### `async-parallel` (Independent Concurrency)
Start independent promises concurrently using `Promise.all()` instead of serial `await` chains:
```ts
// Bad: serial waterfall (T1 + T2)
const user = await getUser(id);
const posts = await getPosts(id);

// Good: parallel fetch (max(T1, T2))
const [user, posts] = await Promise.all([
  getUser(id),
  getPosts(id),
]);
```

### `async-api-routes` (CRITICAL)
In Route Handlers and Server Actions, kick off every independent operation
(auth lookup, config read, upstream fetch) as soon as its inputs exist, and
await late. Await the auth check before any side effect, but do not let it
serialize independent reads.
```ts
export async function GET(req: Request) {
  const sessionP = getSession(req);
  const configP = getConfig();          // independent: start now
  const session = await sessionP;
  if (!session) return new Response(null, { status: 401 });
  const [config, data] = await Promise.all([configP, getData(session.user.id)]);
  return Response.json({ config, data });
}
```

### `server-parallel-fetching` (CRITICAL)
Server Components that await in sequence down the tree create a waterfall.
Restructure so siblings fetch independently (each sibling component awaits its
own data, wrapped in its own `<Suspense>` when slow), or start the promises in
the parent and pass them down.

### `server-parallel-nested-fetching` (CRITICAL)
For lists where each item needs a dependent second fetch, chain the dependent
step inside each item's promise so a slow item does not block the rest:
```ts
// Bad: all first-level fetches, then all second-level fetches
const orders = await Promise.all(ids.map(getOrder));
const customers = await Promise.all(orders.map((o) => getCustomer(o.customerId)));

// Good: per-item chain
const rows = await Promise.all(
  ids.map((id) => getOrder(id).then(async (o) => ({ o, c: await getCustomer(o.customerId) }))),
);
```

### `async-suspense-boundaries`
Wrap slow, non-critical subtrees in `<Suspense>` so the fast shell renders and streams immediately to the user:
```tsx
export default function DashboardPage() {
  return (
    <div className="dashboard-shell">
      <Header />
      <FastOverviewMetrics />
      <Suspense fallback={<TableSkeleton />}>
        <SlowAnalyticsTable />
      </Suspense>
    </div>
  );
}
```

---

## 2. Bundle Size Optimization (P2 - CRITICAL)

### `bundle-barrel-imports` (Anti-Barrel Discipline)
Barrel index files force the bundler to parse every re-export. In Next.js,
`optimizePackageImports` rewrites barrel imports to direct ones, and a default
list is already optimized — including `lucide-react`, `date-fns`, `lodash-es`,
`@heroicons/react/*`, `@tabler/icons-react`, `recharts`, `react-icons/*`, and
MUI icons. So `import { Check } from 'lucide-react'` is fine in Next.js; do
**not** rewrite it to a `dist/esm/icons/...` deep path (no stable export,
often no types). Add other heavy barrel packages explicitly:
```js
// next.config.js — the option is still under `experimental` in v16 docs
module.exports = {
  experimental: { optimizePackageImports: ['my-internal-ui', '@radix-ui/react-icons'] },
};
```
Outside Next.js (Vite/Astro), prefer the package's documented per-module
subpath exports, and avoid creating barrel files in your own code.

### `bundle-analyzable-paths` (HIGH)
Keep import paths literal so the bundler can trace them. `import(\`./locales/${lang}.json\`)`
or a computed `require` pulls the whole directory (or fails); map known keys to
literal `import()` calls instead.

### `bundle-dynamic-imports`
Split heavy, client-only components (rich text editors, charts, maps,
3D/canvas widgets) with `next/dynamic`. `ssr: false` is only allowed inside a
Client Component; in a Server Component it errors, so put the `dynamic()` call
in a small `'use client'` wrapper:
```tsx
'use client';
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/AnalyticsChart'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
});
export function ChartSlot(props: ChartProps) { return <HeavyChart {...props} />; }
```

### `bundle-conditional` (HIGH)
Load large modules only when the feature activates — `await import('fuse.js')`
inside the handler that first needs it, or a dynamic component rendered only
when its condition is true. Never import a heavy library at module top level
for a path most users never take.

### `bundle-preload` (MEDIUM)
Warm a heavy chunk on intent: call the dynamic `import()` (or the
`next/dynamic` loader) on `pointerenter`/`focus` of the trigger so the chunk is
ready by click. Keyboard focus must trigger it too.

### `bundle-defer-third-party`
Never block initial page load or hydration with non-critical third-party SDKs (analytics, chat widgets, feedback tools). Load them using `next/script` with `strategy="afterInteractive"` or `strategy="lazyOnload"`.

---

## 3. Server-Side Performance (P3 - HIGH)

### `server-auth-actions` (Trust Boundary Invariant)
Every Server Action is an unauthenticated public HTTP endpoint reachable via POST request. Layouts, Proxy (formerly Middleware), and hidden UI buttons do NOT protect Server Actions.
```ts
// Invariant: Authenticate inside every Server Action
export async function updateUserSettings(formData: FormData) {
  'use server';
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  // Validate input schema with Zod
  // Execute database mutation scoped to session.user.id
}
```

### `server-cache-react` (Per-Request Deduping)
Use `React.cache()` to deduplicate identical reads across different components in the same render tree:
```ts
import { cache } from 'react';
import { db } from '@/lib/db';

export const getCurrentUser = cache(async (userId: string) => {
  return await db.query.users.findFirst({ where: eq(users.id, userId) });
});
// Calling getCurrentUser(id) in Layout, Page, and Header executes only 1 DB query.
```

### `server-hoist-static-io` (HIGH)
Read static inputs (fonts for OG images, JSON config, templates) once at module
scope, not inside the handler on every request. Only immutable, non-request
data qualifies (see the next rule).

### `server-no-shared-module-state`
Server renders run concurrently in one process: never write request data (user,
tenant, session) to a mutable module-level variable — it leaks across requests.
Keep it in props/arguments or `React.cache()`.

### `server-serialization` / `server-dedup-props`
Every prop crossing into a Client Component is serialized into the HTML and RSC
payload: pass only the fields the client uses. Dedup is by reference, not value —
`list` plus `list.toSorted()` ships twice; derive on the client instead.

### `server-after-nonblocking`
Use `after()` from `next/server` for logging/analytics that must not delay the
response; it still runs when the response fails or redirects.

### `server-cache-cross-request` (Durable Caching)
For data shared across requests and users (catalogs, public articles, exchange
rates), the API depends on the installed major and whether Cache Components is
enabled — check `next.config.*` first:
- **Next 16 with Cache Components:** `'use cache'` on the function or component,
  `cacheLife(...)` for lifetime, `cacheTag(...)` for invalidation. Invalidate
  with `updateTag(tag)` from a Server Action (read-your-writes) or
  `revalidateTag(tag, 'max')` (stale-while-revalidate); the single-argument
  `revalidateTag(tag)` is deprecated.
- **Legacy:** `unstable_cache` — replaced by `use cache` in Next 16; keep it only
  in an existing pre-Cache-Components codebase, do not add new uses.
```ts
import { cacheLife, cacheTag } from 'next/cache';

export async function getPublicCatalog() {
  'use cache';
  cacheLife('hours');
  cacheTag('catalog');
  return fetchCatalog();
}
```
Never cache per-user or per-tenant data under a shared key.

---

## 4. Client Data & Re-renders (P4 - MEDIUM)

### `rerender-no-inline-components`
Never define a component inside another component: a new type each render
remounts the subtree, losing state and input focus. Pass props instead.

### `rerender-derived-state-no-effect`
Compute values from props/state during render. `useState` + `useEffect` to
mirror or derive a value causes an extra render with stale UI in between.

### `rerender-move-effect-to-event`
If a side effect happens because the user did something (submit, click), run
it in that event handler — not by setting a flag and reacting in an effect.

### `rerender-use-ref-transient-values`
High-frequency values that do not drive output (pointer position during a drag,
timers, latest callback, scroll offset) belong in `useRef`; storing them in
state re-renders on every change.

### `rerender-transitions` / `rerender-use-deferred-value`
Wrap non-urgent updates (filtering a large list, switching tabs) in
`startTransition` so input stays responsive; use `useDeferredValue` when the
expensive part is rendering from a fast-changing value. Both also help INP.

### `client-passive-event-listeners`
Register `touchstart`, `touchmove`, and `wheel` listeners with
`{ passive: true }` unless the handler must call `preventDefault()`; non-passive
listeners delay scrolling.

### `client-localstorage-schema`
Version every stored key (`app:v2:prefs`), store only the minimum, and parse
inside `try/catch` with a schema check that falls back to defaults. Migrating
or ignoring old versions is explicit, never a crash.

---

## 5. Rendering (P5 - MEDIUM)

### `rendering-resource-hints` (HIGH)
Use React DOM's `preconnect`, `prefetchDNS`, `preload`, and `preinit` (from
`react-dom`) to start fetching critical cross-origin resources early, instead
of hand-placing `<link>` tags in components.

### `rendering-script-defer-async` (HIGH)
Every raw `<script src>` needs `defer` (ordered, after parse) or `async`
(independent); in Next.js prefer `next/script` with an explicit `strategy`.

### `rendering-hydration-no-flicker`
For values only the client knows before paint (theme, locale preference,
dismissed banner), set them with a small synchronous inline script in the
document head that writes a class/attribute before hydration, rather than a
`useEffect` that flashes the wrong state. Mark the affected element with
`suppressHydrationWarning` only for that attribute.

### `rendering-activity`
For UI that toggles visibility but should keep state and DOM (tabs, sidebars,
back-navigation panels), use `<Activity mode="visible" | "hidden">` (stable in
React 19.2). Hidden children keep state, their effects are cleaned up, and
updates are deferred. Media elements keep playing when hidden, so pause them in
a layout-effect cleanup.

### `rendering-conditional-render`
`{count && <Badge />}` renders `0` when count is zero (and `NaN` likewise). Use
`{count > 0 ? <Badge /> : null}` or coerce to a boolean.

### `<ViewTransition>` (version-gated)
`ViewTransition` is not in React stable as of React 19.2; it ships in React
canary/experimental builds. The Next.js App Router bundles a React canary, so
`import { ViewTransition } from 'react'` works there without installing
`react@canary`; outside Next, check the installed channel. Gotchas:
- Animations activate only for updates inside a Transition, `<Suspense>`
  reveal, or `useDeferredValue`; a plain `setState` does not animate. Next.js
  navigations are transitions. Never call `document.startViewTransition`
  yourself.
- Place `<ViewTransition>` **before** any DOM node in its subtree to get
  enter/exit; wrapped inside a `<div>`, it will not animate. Put directional
  route wrappers in each `page`, not the layout (layouts persist, so enter/exit
  never fire there).
- Use `default="none"` on named and type-keyed boundaries so they do not
  crossfade on every unrelated transition. With `default="none"` on a shared
  pair, keep an explicit `share` value or the morph silently stops.
- A `name` must be unique among mounted elements across the whole app; derive
  it from the entity id (`photo-${id}`). Use `name` only for shared-element
  morphs.
- Directional navigation uses `transitionTypes` on `<Link>` or in
  `router.push/replace` (added in Next.js 16.2 — check the installed version).
  Browser back/forward, swipe gestures, and `router.refresh()` carry no type,
  so map `default: 'none'` for untyped transitions.
- Add `::view-transition { pointer-events: none; }` so clicks are not swallowed
  during the animation, and reduce or remove motion under
  `prefers-reduced-motion`.
- Browsers without the API simply skip the animation; never make content
  depend on it.

### Composition over boolean props
Avoid boolean prop proliferation (`<Card isHighlighted hasBorder withFooter noPadding isCompact />`). Use composable compound components:
```tsx
<Card>
  <Card.Header title="Profile" />
  <Card.Content compact>
    <UserDetails />
  </Card.Content>
  <Card.Footer />
</Card>
```

## Source notes

Verified 2026-10-02:
- Rule list and impact levels:
  https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
- `optimizePackageImports` default list (includes `lucide-react`; still
  experimental):
  https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
- `ssr: false` only in Client Components:
  https://nextjs.org/docs/app/guides/lazy-loading
- `unstable_cache` replaced by `use cache`; `revalidateTag` profile argument:
  https://nextjs.org/docs/app/api-reference/functions/unstable_cache,
  https://nextjs.org/docs/app/api-reference/functions/revalidateTag
- Activity stable in React 19.2; ViewTransition not in 19.2 stable:
  https://react.dev/blog/2025/10/01/react-19-2,
  https://react.dev/reference/react/Activity
- ViewTransition placement, `default="none"`, unique names, triggers:
  https://react.dev/reference/react/ViewTransition
- Next.js view transitions (bundled canary, `transitionTypes`, page-not-layout,
  untyped browser back): https://nextjs.org/docs/app/guides/view-transitions;
  `transitionTypes` added in v16.2:
  https://nextjs.org/docs/app/api-reference/components/link
