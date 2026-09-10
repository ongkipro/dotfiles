# React & Next.js Performance Engineering Rules

Distilled from Vercel Engineering production rules (`vercel-labs/agent-skills/react-best-practices`). Use when authoring, reviewing, or refactoring React and Next.js App Router components, data fetching, and bundle configurations.

## Priority Hierarchy

| Priority | Category | Impact | Focus |
|---|---|---|---|
| **P1** | **Eliminating Waterfalls** | CRITICAL | Data fetching concurrency & Suspense streaming |
| **P2** | **Bundle Size Optimization** | CRITICAL | Tree-shaking, dynamic imports, barrel file avoidance |
| **P3** | **Server-Side Performance** | HIGH | Action security, request deduplication, cross-request cache |
| **P4** | **Client Hydration & State** | MEDIUM-HIGH | Leaf-node client boundaries, state placement |
| **P5** | **Rendering & Transitions** | MEDIUM | React 19 `<ViewTransition>`, layout thrash avoidance |

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
Avoid importing icons or utilities from massive barrel index files (`import { Check } from 'lucide-react'`). Barrels force bundlers to parse thousands of export definitions:
1. Prefer deep direct imports:
   ```ts
   // Recommended if not using compiler transforms:
   import Check from 'lucide-react/dist/esm/icons/check';
   ```
2. Or configure `optimizePackageImports` in `next.config.js`:
   ```js
   module.exports = {
     experimental: {
       optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'lodash-es'],
     },
   };
   ```

### `bundle-dynamic-imports`
Split heavy, client-only components (rich text editors, charts, maps, 3D/canvas widgets) using `next/dynamic` with `ssr: false`:
```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/AnalyticsChart'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
});
```

### `bundle-defer-third-party`
Never block initial page load or hydration with non-critical third-party SDKs (analytics, chat widgets, feedback tools). Load them using `next/script` with `strategy="afterInteractive"` or `strategy="lazyOnload"`.

---

## 3. Server-Side Performance (P3 - HIGH)

### `server-auth-actions` (Trust Boundary Invariant)
Every Server Action is an unauthenticated public HTTP endpoint reachable via POST request. Layouts, middleware, and hidden UI buttons do NOT protect Server Actions.
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

### `server-cache-cross-request` (Durable Caching)
For data shared across requests and users (catalogs, public articles, exchange rates), use Next.js `unstable_cache` or standard cache tags:
```ts
import { unstable_cache } from 'next/cache';

export const getPublicCatalog = unstable_cache(
  async () => fetchCatalog(),
  ['public-catalog'],
  { revalidate: 3600, tags: ['catalog'] }
);
```

---

## 4. React 19 Native Transitions & Composition (P4/P5)

### `<ViewTransition>` (Native Smooth Transitions)
In React 19 / Next.js, leverage the browser's native View Transitions API instead of heavy JavaScript animation libraries for UI state swaps:
- Trigger with `startTransition` or Suspense transitions.
- Assign matching CSS `view-transition-name` to preserve spatial continuity during list reordering, route changes, and modal expansions.

### Compound Component Architecture
Avoid boolean prop proliferation (`<Card isHighlighted hasBorder withFooter noPadding isCompact />`). Use composable compound components:
```tsx
// Good: Composable, maintainable, tree-shakeable
<Card>
  <Card.Header title="Profile" />
  <Card.Content compact>
    <UserDetails />
  </Card.Content>
  <Card.Footer />
</Card>
```
