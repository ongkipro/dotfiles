# Next.js + shadcn Admin Starter - Implementation Contracts

> Deep implementation-contract reference harvested by direct source inspection of two
> local reference checkouts: `admin-starter` (Next.js 16 App Router + shadcn/ui +
> TanStack Table/Query/Form + nuqs) and `tailadmin-starter` (Next.js + Tailwind v4,
> markup-first).
> `SKILL.md` owns the *decisions* (which chart, which layout, which breakpoint).
> `references/github-admin-patterns.md` owns cross-product patterns (Refine, Payload,
> Medusa, Strapi, kbar, Clerk).
> **This file owns the executable contracts**: exact hook signatures, state
> partitions, URL protocols, directory boundaries, CSS token graphs, and the
> specific defects to fix on adoption.
>
> Every claim below is grounded in a named file. Claims that were reasoned rather
> than observed are tagged `[INFERENCE]`.

---

## 0. Provenance & Version Matrix

Verified from `admin-starter/package.json`:

| Package | Pinned | Contract consequence |
| --- | --- | --- |
| `next` | `16.2.12` | App Router, async `searchParams`, async `cookies()` |
| `react` / `react-dom` | `19.2.4` | `useTransition` passed into nuqs; Suspense streaming |
| `@tanstack/react-table` | `^8.21.3` | **v8 API** (`useReactTable`, `getXRowModel` options) |
| `@tanstack/react-query` | `^5.95.2` | `queryOptions`/`mutationOptions` factories, `useSuspenseQuery` |
| `@tanstack/react-form` | `^1.28.5` | `createFormHook`, `revalidateLogic`, `AnyFormApi` |
| `nuqs` | `^2.8.9` | `createParser`, `useQueryStates`, `createSearchParamsCache` |
| `zod` | `^4.3.6` | `z.infer`, `safeParse`, `error.issues[].path` |
| `next-themes` | `^0.4.6` | light/dark **mode** only (palette is separate) |
| `tailwindcss` | `^4.2.2` | CSS-first `@theme` / `@theme inline`, no JS config |
| `motion` | `^11.18.2` | Framer-successor, used by the stepper progress UI |

### 0.1 The version discrepancy you must resolve first

`SKILL.md` and `references/github-admin-patterns.md` describe **TanStack Table v9**.
This starter is **v8**. They are not source-compatible. Verified against upstream
`docs/guide/features.md` and `docs/guide/row-models.md`:

- v9 requires an explicit `features` object built with `tableFeatures({...})`; the
  core row model is included automatically and every other capability must be
  registered.
- Row-model factories move **out of** hook options **into** the features object:
  `getSortedRowModel()` -> `sortedRowModel: createSortedRowModel()`.
- `useReactTable` -> `useTable`. A transitional `useLegacyTable` accepts v8-shaped
  options while running v9 underneath.
- `ColumnMeta` / `TableMeta` module augmentation still works, but **`TFeatures` is
  now the first type parameter** on both interfaces.
- Server-side options are unchanged in spirit: `manualFiltering` / `manualSorting` /
  `manualPagination` still bypass their row models, and `manualPagination` still
  disables `autoResetPageIndex`.

**Adoption rule:** port the *architecture* from this starter, then apply the v9
delta in §2.7 before writing code. Do not copy v8 imports into a v9 project.

---

## 1. The Central Idea: URL Is the Table's Database

The starter's whole data-table stack rests on one invariant:

> **The URL query string is the single source of truth for every table state that a
> user would expect to survive reload, back-button, bookmark, and paste-to-teammate.
> Everything else is deliberately ephemeral React state.**

This produces a three-layer loop, and every layer must agree on the same param
vocabulary or the loop silently breaks:

```
  URL ?page=2&perPage=20&sort=[...]&role=Admin,QA
   |
   |-- Server Component  -> searchParamsCache.parse()  -> build `filters` -> prefetchQuery -> dehydrate
   |                                                                                             |
   |                                                                                    HydrationBoundary
   |                                                                                             |
   '-- Client Component  -> useQueryStates()           -> build `filters` -> useSuspenseQuery ---'
                                |
                          useDataTable() -> TanStack Table state
                                |
                          user interaction -> writes back to URL (throttled/debounced)
```

The fragility of this design is concentrated at exactly one place: **the `filters`
object is constructed twice, in two files, and both must produce a byte-identical
react-query key**. See §4.5.

---

## 2. `useDataTable` - the URL-as-state table hook

**File:** `src/hooks/use-data-table.ts` (284 lines, `'use client'`)

### 2.1 Signature and prop contract

```ts
interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state' | 'pageCount' | 'getCoreRowModel'
      | 'manualFiltering' | 'manualPagination' | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[];   // narrows `id` to keyof TData
  };
  history?: 'push' | 'replace';   // default 'replace'
  debounceMs?: number;            // default 300  - filter text
  throttleMs?: number;            // default 50   - history writes
  clearOnDefault?: boolean;       // default false
  enableAdvancedFilter?: boolean; // default false - hands filtering to a sibling UI
  scroll?: boolean;               // default false - do not scroll-to-top on URL change
  shallow?: boolean;              // default true  - do NOT re-run server components
  startTransition?: React.TransitionStartFunction;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>):
  { table: Table<TData>; shallow: boolean; debounceMs: number; throttleMs: number }
```

The `Omit` list is the contract's teeth: the caller is **structurally forbidden**
from supplying `state`, `getCoreRowModel`, or any `manual*` flag. `pageCount` is
`Required` - server pagination is not optional.

The return type deliberately re-exports `shallow`, `debounceMs`, `throttleMs` so a
sibling advanced-filter component can construct nuqs options identical to the
hook's without prop-drilling a config object.

### 2.2 State partition - memorize this table

| State slice | Owner | Survives reload / share? | Wiring |
| --- | --- | --- | --- |
| `pagination.pageIndex` | URL `?page` (**1-based**) | yes | `parseAsInteger.withDefault(1)` |
| `pagination.pageSize` | URL `?perPage` | yes | `parseAsInteger.withDefault(initialState?.pagination?.pageSize ?? 10)` |
| `sorting` | URL `?sort` (JSON) | yes | `getSortingStateParser(columnIds)` |
| per-column filters | URL `?<columnId>` | yes | dynamic `useQueryStates(filterParsers)` |
| `columnFilters` | React `useState` | **one-way mirror** | seeded from URL at mount, pushed to URL on change |
| `rowSelection` | React `useState` | **no** | `initialState?.rowSelection ?? {}` |
| `columnVisibility` | React `useState` | **no** | `initialState?.columnVisibility ?? {}` |
| `columnPinning` | React `useState` | **no** | `initialState?.columnPinning ?? {}` |

**The asymmetry is the single most important thing to understand.** `columnFilters`
is *not* controlled by the URL. It is React state whose **initial value only** comes
from the URL:

```ts
const [columnFilters, setColumnFilters] =
  React.useState<ColumnFiltersState>(initialColumnFilters);
```

`useState` ignores its argument after the first render. Consequences, all real:

- A programmatic URL change (a "saved view" link, a `router.push`, a browser Back
  that only alters a filter param) updates `filterValues` but **never** re-renders
  the table's filter state. The chips stay stale while the fetched data changes.
- Any "reset all filters" that works by rewriting the URL will not clear the UI.
  Reset must go through `table.resetColumnFilters()` (which is what
  `data-table-toolbar.tsx` correctly does).

**Fix on adoption:** either make `columnFilters` fully derived (`useMemo` over
`filterValues`, with writes going only to nuqs), or add a
`React.useEffect(() => setColumnFilters(initialColumnFilters), [initialColumnFilters])`
reconciliation. The first is preferable - it removes a state copy entirely.

### 2.3 The 1-based / 0-based pagination bridge

URLs are human-facing, so `?page=1` is the first page. TanStack is 0-based. The
hook is the only place that translates, in both directions:

```ts
const pagination: PaginationState = React.useMemo(() => ({
  pageIndex: page - 1,
  pageSize: perPage
}), [page, perPage]);

const onPaginationChange = React.useCallback((updaterOrValue: Updater<PaginationState>) => {
  const next = typeof updaterOrValue === 'function'
    ? updaterOrValue(pagination)
    : updaterOrValue;
  void setPage(next.pageIndex + 1);
  void setPerPage(next.pageSize);
}, [pagination, setPage, setPerPage]);
```

**Contract:** every TanStack `onXChange` handler receives `Updater<T> = T | ((old: T) => T)`.
Normalizing the functional form **before** writing to an external store is mandatory
for all three handlers (`onPaginationChange`, `onSortingChange`, `onColumnFiltersChange`).
Skipping it is the most common failure when moving table state out of React.

`void` on the setter calls is intentional: nuqs setters return a `Promise` and the
handler is synchronous; `void` documents the deliberate non-await instead of
tripping a floating-promise lint.

Note both setters fire on every pagination change even when only one value moved.
With `throttleMs: 50`, nuqs rate-limits the resulting history writes. `[INFERENCE]`
same-tick coalescing into a single history entry is nuqs behaviour, not something
this file guarantees - verify against your nuqs version if back-button granularity
matters to you.

### 2.4 Sorting - a validated JSON param

```ts
const columnIds = React.useMemo(
  () => new Set(columns.map((c) => c.id).filter(Boolean) as string[]),
  [columns]
);

const [sorting, setSorting] = useQueryState(
  'sort',
  getSortingStateParser<TData>(columnIds)
    .withOptions(queryStateOptions)
    .withDefault(initialState?.sorting ?? [])
);
```

`columnIds` is an **allowlist derived from the column defs**, passed into the parser
so a hostile or stale `?sort=[{"id":"password_hash","desc":true}]` is rejected
before it can reach an ORM `orderBy`. This is the security boundary of the whole
URL-state design.

**Trap - verified in `src/features/users/components/users-table/columns.tsx`:**
`columns.map((c) => c.id)` reads the **`id` field of the ColumnDef object**, not the
resolved runtime column id. A column declared with only `accessorKey: 'phone'` and
no explicit `id` contributes `undefined`, is stripped by `.filter(Boolean)`, and is
therefore **absent from the allowlist** - sorting on it is silently discarded by
the parser with no console warning.

> **Contract: every column that participates in URL sorting or URL filtering MUST
> declare an explicit `id`, even when it also has an `accessorKey`.**

The same `column.id` read powers `filterParsers`, where the failure is worse:
`acc[column.id ?? ''] = ...` writes the parser under the **empty-string key**,
producing a `?=value` param. Make the explicit-`id` rule a lint or a runtime
`invariant` in the hook.

### 2.5 Filters - dynamic parser map, debounced write-back

```ts
const filterableColumns = React.useMemo(
  () => (enableAdvancedFilter ? [] : columns.filter((c) => c.enableColumnFilter)),
  [columns, enableAdvancedFilter]
);

const filterParsers = React.useMemo(() =>
  filterableColumns.reduce<Record<string, Parser<string> | Parser<string[]>>>((acc, column) => {
    acc[column.id ?? ''] = column.meta?.options
      ? parseAsArrayOf(parseAsString, ',').withOptions(queryStateOptions)  // multi-select
      : parseAsString.withOptions(queryStateOptions);                      // free text
    return acc;
  }, {}),
[filterableColumns, queryStateOptions, enableAdvancedFilter]);

const [filterValues, setFilterValues] = useQueryStates(filterParsers);
```

The **presence of `meta.options` is the discriminator** that decides array-vs-scalar
URL encoding. `meta` is therefore not decoration - it is load-bearing schema. See §3.1.

Write-back is debounced at 300 ms and **always resets to page 1**, which is the
correct UX invariant (a filtered result set has different page boundaries):

```ts
const debouncedSetFilterValues = useDebouncedCallback((values) => {
  void setPage(1);
  void setFilterValues(values);
}, debounceMs);
```

Removal is explicit - a filter that disappeared from `next` is written as `null`,
which is how nuqs deletes a param:

```ts
for (const prevFilter of prev) {
  if (!next.some((f) => f.id === prevFilter.id)) filterUpdates[prevFilter.id] = null;
}
```

**Two defects in this block, both worth fixing on adoption:**

1. **Impure state updater.** `debouncedSetFilterValues(filterUpdates)` is called
   *inside* the `setColumnFilters((prev) => ...)` updater. React may invoke updaters
   more than once (StrictMode double-invocation in dev, or re-entrant renders).
   The debounce absorbs the duplicate today, so it is latent rather than visible.
   Move the side effect out: compute `next` from `prev` via a ref or restructure so
   the updater is pure.

2. **The token-splitting heuristic corrupts text filters.** Seeding from the URL runs:

   ```ts
   const processedValue = Array.isArray(value)
     ? value
     : typeof value === 'string' && /[^a-zA-Z0-9]/.test(value)
       ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
       : [value];
   ```

   Any free-text filter containing a non-alphanumeric character is shredded into
   tokens at mount. `?email=john@example.com` becomes `['john','example','com']`;
   `?name=O'Brien` becomes `['O','Brien']`. Worse, the scalar branch still wraps in
   an array, so a `text`-variant column's `<Input value={column.getFilterValue() as string}>`
   renders the array's `toString()` (`"john,example,com"`). **Replace the heuristic
   with the parser's own type** - the parser already knows whether the column is
   array-valued (`meta.options` present) or scalar; the runtime sniff is redundant
   and lossy.

### 2.6 Final table construction - what the caller cannot override

```ts
const table = useReactTable({
  ...tableProps,                       // caller options FIRST
  columns, initialState, pageCount,
  state: { pagination, sorting, columnVisibility, columnPinning, rowSelection, columnFilters },
  defaultColumn: { ...tableProps.defaultColumn, enableColumnFilter: false },
  enableRowSelection: true,
  onRowSelectionChange: setRowSelection,
  onPaginationChange, onSortingChange, onColumnFiltersChange,
  onColumnVisibilityChange: setColumnVisibility,
  onColumnPinningChange: setColumnPinning,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  manualPagination: true, manualSorting: true, manualFiltering: true
});
```

Because `...tableProps` is spread **first**, everything after it is non-overridable.
Most of that is correct hardening. Three items are not:

- **`enableRowSelection: true` is unconditional.** A read-only table cannot opt out
  and still pays for a selection column and selection state. Promote it to a prop.
- **`defaultColumn.enableColumnFilter: false`** makes filtering strictly opt-in per
  column. This is good and should be kept - it prevents accidental URL params.
- **Three row models are dead weight.** Upstream `client-side-vs-server-side.md`
  confirms `manualFiltering` / `manualSorting` / `manualPagination` bypass
  `filteredRowModel` / `sortedRowModel` / `paginatedRowModel` (the `getPre*RowModel`
  is used instead). They still ship in the bundle. Delete
  `getFilteredRowModel` / `getSortedRowModel` / `getPaginationRowModel` from a
  server-driven table.

**Faceting is a genuine correctness trap, not just waste.** `getFacetedMinMaxValues`
*does* execute - `src/components/ui/table/data-table-slider-filter.tsx:54` calls
`column.getFacetedMinMaxValues()`. Under `manualPagination`, `data` contains only
the **current page**, so the slider's min/max bounds are computed from ~10 rows and
change as the user pages. Server-driven range filters must receive their bounds
from the API response (or a dedicated facets endpoint), never from the row model.
Note the faceted *select* filter dodges this by reading a static `meta.options`
list rather than `getFacetedUniqueValues()` - which also means its `Option.count`
field is never populated.

**Missing `getRowId` - the highest-severity gap.** Verified by grep: `getRowId` is
never set anywhere in `src/`. With `enableRowSelection: true` plus server
pagination, TanStack falls back to the **page-relative row index** as the selection
key. Select the first row on page 1, navigate to page 2, and `rowSelection` is still
`{ '0': true }` - now pointing at a completely different entity. Any bulk action
built on `table.getFilteredSelectedRowModel()` will act on the wrong records.

```ts
// MANDATORY for any server-paginated table with selection
getRowId: (row) => String(row.id),
```

This is the same contract already asserted in `references/github-admin-patterns.md`;
the starter violates it.

**`pageCount` vs `rowCount`.** The starter derives
`pageCount = Math.ceil(data.total_users / params.perPage)` in
`users-table/index.tsx` and never uses `rowCount`. Upstream allows either, but
`rowCount` lets the table derive `pageCount` itself and keeps the "N rows total"
footer honest. `data-table-pagination.tsx` currently prints
`table.getFilteredRowModel().rows.length` as "row(s) total", which under manual
pagination is the **page size**, not the total - a visible bug. Supply `rowCount`
and render `table.getRowCount()`.

### 2.7 v8 -> v9 delta for this exact hook

```ts
// v9
import {
  tableFeatures, useTable,
  columnFilteringFeature, columnPinningFeature, columnVisibilityFeature,
  rowPaginationFeature, rowSelectionFeature, rowSortingFeature
} from '@tanstack/react-table';

// Module scope - static, so the type is inferable and the bundle is tree-shaken.
const features = tableFeatures({
  columnFilteringFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature
  // NO row-model factories: all three are server-driven here.
  // Core row model is included automatically.
});

const table = useTable({
  features,
  columns, data, rowCount,
  getRowId: (row) => String(row.id),
  state: { ... },
  manualPagination: true, manualSorting: true, manualFiltering: true
});
```

And the meta augmentation in `src/types/data-table.ts` gains `TFeatures` first:

```ts
declare module '@tanstack/react-table' {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData
  > { label?: string; placeholder?: string; variant?: FilterVariant; options?: Option[]; /* ... */ }
}
```

Export `type Features = typeof features` and thread it through your `ColumnDef`
generics so TypeScript refuses API calls for features you did not register.

---

## 3. Column definitions - `meta` as a filter-UI registry

### 3.1 The three-table indirection

The starter never writes a `switch` in a column file. Filter UI is resolved through
three cooperating tables:

1. **`src/types/data-table.ts`** - module augmentation turns `meta` into typed schema:

   ```ts
   declare module '@tanstack/react-table' {
     interface ColumnMeta<TData extends RowData, TValue> {
       label?: string;        // human label for header + filter chip
       placeholder?: string;  // filter input placeholder
       variant?: FilterVariant;
       options?: Option[];    // presence => array-valued URL param (see 2.5)
       range?: [number, number];
       unit?: string;
       icon?: React.FC<React.SVGProps<SVGSVGElement>>;
     }
   }
   export interface Option { label: string; value: string; count?: number; icon?: React.FC<...> }
   ```

2. **`src/config/data-table.ts`** - `variant -> legal operators`. Eight variants
   (`text`, `number`, `range`, `date`, `dateRange`, `boolean`, `select`,
   `multiSelect`) and fourteen operators (`iLike`, `notILike`, `eq`, `ne`,
   `inArray`, `notInArray`, `isEmpty`, `isNotEmpty`, `lt`, `lte`, `gt`, `gte`,
   `isBetween`, `isRelativeToToday`) plus `joinOperators: ['and','or']`. Types are
   *derived from the value* (`type FilterOperator = DataTableConfig['operators'][number]`),
   so the config object is the single source of truth - adding an operator updates
   the union automatically.

3. **`src/components/ui/table/data-table-toolbar.tsx`** - `variant -> component`:

   ```tsx
   switch (columnMeta.variant) {
     case 'text':   return <Input placeholder={columnMeta.placeholder ?? columnMeta.label} ... />;
     case 'number':
     case 'range':  return <DataTableSliderFilter column={column} title={columnMeta.label ?? column.id} />;
     case 'date':
     case 'dateRange': return <DataTableDateFilter multiple={columnMeta.variant === 'dateRange'} ... />;
     case 'select':
     case 'multiSelect': return <DataTableFacetedFilter
         options={columnMeta.options ?? []}
         multiple={columnMeta.variant === 'multiSelect'} ... />;
     default: return null;
   }
   ```

`if (!columnMeta?.variant) return null;` is the guard - a filterable column with no
`variant` renders nothing at all, silently. Pair the explicit-`id` invariant from
§2.4 with an explicit-`variant` invariant.

`src/lib/data-table.ts` closes the loop with `getFilterOperators(variant)`,
`getDefaultFilterOperator(variant)` (first entry, falling back to `iLike` for text
and `eq` otherwise), and `getValidFilters()` which drops filters whose value is
empty **unless** the operator is `isEmpty` / `isNotEmpty`. Call `getValidFilters`
before serializing to the API so empty inputs never become `WHERE col LIKE '%%'`.

### 3.2 Canonical column file

`src/features/users/components/users-table/columns.tsx`:

```tsx
export const columns: ColumnDef<User>[] = [
  {
    id: 'name',                                    // REQUIRED - URL param + sort allowlist key
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.first_name} {row.original.last_name}</span>
        <span className='text-muted-foreground text-xs'>{row.original.email}</span>
      </div>
    ),
    meta: { label: 'Name', placeholder: 'Search users...', variant: 'text', icon: Icons.text },
    enableColumnFilter: true                       // opt-in; defaultColumn sets false
  },
  {
    id: 'role', accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
    cell: ({ cell }) => <Badge variant='outline' className='capitalize'>{cell.getValue<User['role']>()}</Badge>,
    enableColumnFilter: true,
    meta: { label: 'roles', variant: 'multiSelect', options: ROLE_OPTIONS }
  },
  { id: 'actions', cell: ({ row }) => <CellAction data={row.original} /> }
];
```

Contracts visible here:

- **`accessorFn` + `id`** for derived/composite columns; `accessorKey` + `id` for
  direct ones. Never rely on the implicit id.
- **Two-line cell** (primary + muted secondary) is how the starter avoids a separate
  email column - denser table, same information.
- **`options` presence** flips URL encoding to comma-joined arrays (§2.5).
- **`options` lives in a sibling `options.tsx`**, not inline, so the server
  validator and the client filter UI can share one list.
- **`id: 'actions'`** with no accessor - a pure UI column.

### 3.3 Header, pinning, and the row-action cell

`data-table-column-header.tsx` short-circuits to a bare `<div>{title}</div>` when
`!column.getCanSort() && !column.getCanHide()` - no dropdown trigger is rendered for
a column with nothing to offer. Otherwise it renders asc/desc/clear plus a
`DropdownMenuCheckboxItem` for hide. Sort direction uses
`column.getIsSorted() === 'desc' ? chevronDown : 'asc' ? chevronUp : chevronsUpDown`
- a non-color, icon-based state cue, satisfying the WCAG 1.4.1 posture `SKILL.md`
requires.

`src/lib/data-table.ts` -> `getCommonPinningStyles({ column })` returns the inline
style object for sticky columns:

```ts
{
  boxShadow: isLastLeftPinnedColumn  ? '-5px 0 5px -5px var(--border) inset'
           : isFirstRightPinnedColumn ?  '5px 0 5px -5px var(--border) inset' : undefined,
  left:  isPinned === 'left'  ? `${column.getStart('left')}px` : undefined,
  right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
  position: isPinned ? 'sticky' : 'relative',
  background: isPinned ? 'var(--background)' : undefined,
  width: column.getSize(),
  zIndex: isPinned ? 1 : 0
}
```

The inset box-shadow **only on the boundary column** is what makes the pin read as
a seam rather than a border on every cell. The `var(--border)` / `var(--background)`
references are why pinning survives a palette switch (§5) with zero JS.

`users-table/index.tsx` pins actions right: `initialState: { columnPinning: { right: ['actions'] } }`.

**`cell-action.tsx` contract** - state is colocated in the cell, not hoisted:

```tsx
export function CellAction({ data }: { data: User }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const deleteMutation = useMutation({
    ...deleteUserMutation,
    onSuccess: () => { toast.success('User deleted successfully'); setDeleteOpen(false); },
    onError: () => toast.error('Failed to delete user')
  });
  return (
    <>
      <AlertModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}
                  onConfirm={() => deleteMutation.mutate(data.id)} loading={deleteMutation.isPending} />
      <UserFormSheet user={data} open={editOpen} onOpenChange={setEditOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <Icons.ellipsis className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>{/* Update / Delete */}</DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
```

Rules: `sr-only` label on the icon-only trigger; destructive action always behind
an `AlertModal` whose confirm button is `loading`-bound to `mutation.isPending`;
both modal and sheet mount per row. **Scaling note:** at 50 rows this instantiates
50 dropdowns, 50 alert modals, and 50 form sheets. Above ~50 rows, hoist a single
modal/sheet pair to the table and drive it with a
`DataTableRowAction<TData> = { row: Row<TData>; variant: 'update' | 'delete' }`
state - the type already exists, unused, in `src/types/data-table.ts`.

---

## 4. Feature-first architecture

### 4.1 The tree (verified, `src/features/users/`)

```
src/features/<feature>/
  api/
    types.ts        # wire types + filter/response/payload shapes
    service.ts      # THE ONLY BACKEND SEAM - swap this file, nothing else
    queries.ts      # queryKey factory + queryOptions factories
    mutations.ts    # mutationOptions + invalidation policy
  components/
    <feature>-listing.tsx        # Server Component: parse URL -> prefetch -> dehydrate
    <feature>-form-sheet.tsx     # create/update surface
    <feature>-table/
      index.tsx     # Client Component: re-read URL -> useSuspenseQuery -> useDataTable
      columns.tsx   # ColumnDef[] + meta registry
      options.tsx   # shared select option lists
      cell-action.tsx
  schemas/
    <entity>.ts     # zod schema + `export type XFormValues = z.infer<typeof xSchema>`
  info-content.ts   # page-level explanatory copy, kept out of JSX
```

`src/app/dashboard/users/page.tsx` is a thin route shell - it parses search params,
sets `metadata`, and renders `<PageContainer>` + `<UserListingPage />`. **All
domain logic lives under `features/`; `app/` only routes.** Shared, feature-agnostic
code lives in `components/ui/`, `hooks/`, `lib/`, `config/`, `types/`.

### 4.2 Import-direction rules (enforce with a lint boundary)

```
app/  ->  features/  ->  { components/ui, hooks, lib, config, types }
                     ->  its own api|schemas|components
features/a  -X->  features/b        # no cross-feature imports
components/ui  -X->  features/      # never upward
```

### 4.3 `service.ts` - the only file you rewrite per backend

The file's own header documents four interchangeable strategies, and the function
bodies are the *only* thing that changes:

```ts
// 1. Server Actions + ORM (Prisma/Drizzle/Supabase): 'use server' + call the ORM here.
// 2. Route Handlers + ORM:  apiClient<UsersResponse>(`/users?...`)  ->  src/app/api/users
// 3. BFF: route handlers proxy to an external backend (Laravel, Go, ...).
// 4. Direct external API (no Next backend): fetch('https://your-api.com/users?...')

export async function getUsers(filters: UserFilters): Promise<UsersResponse> { ... }
export async function createUser(data: UserMutationPayload) { ... }
export async function updateUser(id: number, data: UserMutationPayload) { ... }
export async function deleteUser(id: number) { ... }
```

The demo implementation delegates to an in-memory `fakeUsers` fixture. **Because
`queries.ts`, `mutations.ts`, and every component import only from `service.ts`,
swapping the data source touches exactly one file.** This is the property worth
copying; the fixture is not.

`src/lib/api-client.ts` is deliberately 12 lines - `BASE_URL = '/api'`,
`Content-Type: application/json`, throw on `!res.ok`, `res.json() as Promise<T>`.
No interceptors, no retry layer, no class wrapper. Resist growing it; react-query
already owns retry, dedupe, and cache.

### 4.4 Query keys and mutations

```ts
// queries.ts
export const userKeys = {
  all: ['users'] as const,
  list:   (filters: UserFilters) => [...userKeys.all, 'list',   filters] as const,
  detail: (id: number)           => [...userKeys.all, 'detail', id]      as const
};

export const usersQueryOptions = (filters: UserFilters) =>
  queryOptions({ queryKey: userKeys.list(filters), queryFn: () => getUsers(filters) });
```

```ts
// mutations.ts - module-scope objects, not hooks
export const createUserMutation = mutationOptions({
  mutationFn: (data: UserMutationPayload) => createUser(data),
  onSuccess: () => { getQueryClient().invalidateQueries({ queryKey: userKeys.all }); }
});
```

Two contracts:

- **Hierarchical keys.** Invalidating `userKeys.all` clears every list and detail
  in one call - which is why the mutations can be plain module-scope objects with
  no hook context.
- **Split responsibility.** `mutationOptions` owns *cache* consequences;
  the call site owns *UI* consequences. `user-form-sheet.tsx` spreads the shared
  object and adds its own `onSuccess` for toast + close + `form.reset()`:

  ```ts
  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: () => { toast.success('User created'); onOpenChange(false); form.reset(); },
    onError: () => toast.error("Couldn't create user. Try again.")
  });
  ```

  Note react-query calls **both** the spread `onSuccess` and the local one.

`src/lib/query-client.ts` enforces the request/browser split:

```ts
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
      dehydrate: { shouldDehydrateQuery: (q) => defaultShouldDehydrateQuery(q) || q.state.status === 'pending' }
    }
  });
}
let browserQueryClient: QueryClient | undefined;
export function getQueryClient() {
  if (isServer) return makeQueryClient();               // NEW client per request - no cross-user leakage
  return (browserQueryClient ??= makeQueryClient());     // singleton in the browser
}
```

`status === 'pending'` in `shouldDehydrateQuery` is what enables **streaming a
not-yet-resolved query** to the client - the server does not block on the fetch.
`staleTime: 60_000` prevents an immediate refetch on hydration.

### 4.5 The server/client seam - and its one real bug

**Server (`user-listing.tsx`):**

```tsx
export default function UserListingPage() {
  const page   = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const roles  = searchParamsCache.get('role');
  const sort   = searchParamsCache.get('sort');        // RAW string, unvalidated

  const filters = { page, limit: pageLimit,
    ...(search && { search }), ...(roles && { roles }), ...(sort && { sort }) };

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(usersQueryOptions(filters));   // prefetch, NOT await fetchQuery

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersTable />
    </HydrationBoundary>
  );
}
```

**Client (`users-table/index.tsx`):**

```tsx
const [params] = useQueryStates({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString, role: parseAsString,
  sort: getSortingStateParser(columnIds).withDefault([])
});

const filters = { page: params.page, limit: params.perPage,
  ...(params.name && { search: params.name }),
  ...(params.role && { roles: params.role }),
  ...(params.sort.length > 0 && { sort: JSON.stringify(params.sort) }) };

const { data } = useSuspenseQuery(usersQueryOptions(filters));
const pageCount = Math.ceil(data.total_users / params.perPage);
const { table } = useDataTable({ data: data.users, columns, pageCount, shallow: false, debounceMs: 500,
  initialState: { columnPinning: { right: ['actions'] } } });
```

**The bug:** the server puts the **raw URL `sort` string** into the key; the client
puts **`JSON.stringify(parsed)`** into the key. These agree only when the URL text
is already canonical JSON with the exact key order `{"id":...,"desc":...}`. Any
non-canonical but valid input - `?sort=[{"desc":false,"id":"name"}]`, or a
percent-encoding round-trip that reorders or respaces - yields two different
`queryKey`s. The prefetched entry is then a cache miss and the client refetches on
hydrate, defeating the whole SSR path. `[INFERENCE]` on the exact user-visible
symptom (a duplicate request) - the key divergence itself is directly observable in
the two files.

> **Contract: build the query key through ONE shared function imported by both
> sides.** Put `buildUserFilters(source)` in `api/queries.ts`, have it normalize
> `sort` by parsing then re-serializing with a stable key order, and call it from
> the Server Component and the Client Component alike. The duplicated
> conditional-spread block in two files is the defect; the fix is deletion, not
> more validation.

Secondary: the server treats `sort` as `parseAsString` and never applies the
column-id allowlist, so the *server* prefetch can be pointed at an arbitrary
column name. The allowlist must also run server-side before the value reaches an
ORM `orderBy`.

**`shallow: false` is mandatory here** and must be understood: with nuqs's default
`shallow: true`, changing a param updates the URL **without re-running Server
Components**. The client refetch still happens (react-query sees a new key), but
the server prefetch does not re-run. `users-table/index.tsx` passes `shallow: false`
so navigation re-executes the Server Component and keeps the two caches aligned.

### 4.6 URL param namespace is flat and global

`src/lib/searchparams.ts` declares one shared cache for the entire app:

```ts
export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString, gender: parseAsString, category: parseAsString, role: parseAsString,
  sort: parseAsString,
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and','or']).withDefault('and')
};
export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
```

Consequences to plan around:

- **Every filterable column id across every feature must be registered here**, and
  ids must be globally unique. Two tables on one route both filtering `status`
  would collide.
- `searchParamsCache.parse(await props.searchParams)` **must be called in the page
  Server Component before any descendant calls `.get()`**, or `.get()` throws.
  Verified in `src/app/dashboard/users/page.tsx`.
- `serialize` is the counterpart for building links (saved views, "open in new tab")
  with the same parser set - use it instead of hand-assembling query strings.

For a large app, scope the cache per feature (`createSearchParamsCache` per route
segment) or namespace params (`users.page`) rather than growing one global object.

### 4.7 Loading skeleton contract

`src/app/dashboard/users/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className='flex flex-1 flex-col space-y-4 px-4 pt-2 pb-4 md:px-6 md:pt-4'>
      <DataTableSkeleton columnCount={6} rowCount={10} filterCount={2} />
    </div>
  );
}
```

The skeleton is **parameterized by the real shape** (6 columns, 10 rows, 2 filters)
and the wrapper reuses the page's exact padding classes. That is what prevents the
layout shift `SKILL.md` warns about - a generic pulsing block would not.

---

## 5. Theme engine - two orthogonal axes

### 5.1 The axes

| Axis | Values | Transport | Owner |
| --- | --- | --- | --- |
| **Palette** | `claude`, `discord`, `supabase`, `vercel`, `mono`, `notebook`, `light-green`, `zen`, `astro-vista`, `whatsapp` | `data-theme` attribute on `<html>`, persisted in a **cookie** | `components/themes/active-theme.tsx` |
| **Mode** | light / dark | `.dark` class on `<html>`, persisted in **localStorage** | `next-themes` via `theme-provider.tsx` |

They compose: `[data-theme='supabase']` (light block) and
`[data-theme='supabase'].dark` (dark block). 10 palettes x 2 modes with no
combinatorial component code.

### 5.2 Why the palette uses a cookie and the mode does not

`src/app/layout.tsx`:

```tsx
const cookieStore = await cookies();
const activeThemeValue = cookieStore.get('active_theme')?.value;
const isValidTheme = THEMES.some((t) => t.value === activeThemeValue);
const themeToApply = isValidTheme ? activeThemeValue! : DEFAULT_THEME;
return <html lang='en' suppressHydrationWarning data-theme={themeToApply}> ... </html>;
```

A cookie is readable **during SSR**, so the correct palette is in the very first
byte of HTML - no flash, no blocking inline script. The `THEMES.some(...)` check is
not decoration: it prevents an attacker-set cookie from injecting an arbitrary
attribute value into the server-rendered `<html>` tag.

Mode stays on `next-themes` + localStorage, which is why `suppressHydrationWarning`
is required on `<html>` (next-themes mutates the class pre-hydration).

`active-theme.tsx` re-applies client-side and keeps the cookie fresh:

```tsx
function setThemeCookie(theme: string) {
  if (typeof window === 'undefined') return;
  document.cookie =
    `active_theme=${theme}; path=/; max-age=31536000; SameSite=Lax; ` +
    `${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
}

React.useEffect(() => {
  const current = document.documentElement.getAttribute('data-theme');
  if (current !== activeTheme) {
    setThemeCookie(activeTheme);
    document.documentElement.removeAttribute('data-theme');
    Array.from(document.body.classList)
      .filter((c) => c.startsWith('theme-'))
      .forEach((c) => document.body.classList.remove(c));
    document.documentElement.setAttribute('data-theme', activeTheme);
  } else {
    setThemeCookie(activeTheme);   // still refresh in case it is missing
  }
}, [activeTheme]);
```

The `current !== activeTheme` guard is what stops a hydration-time attribute
churn on every mount. `useThemeConfig()` throws outside the provider - the correct
context contract.

### 5.3 Anatomy of a theme file

Each `src/styles/themes/<name>.css` has exactly three blocks:

```css
/* 1. LIGHT - raw values */
[data-theme='supabase'] {
  --background: oklch(0.9911 0 0);
  --foreground: oklch(0.2046 0 0);
  --primary:    oklch(0.8348 0.1302 160.908);
  --primary-foreground: oklch(0.2626 0.0147 166.4589);
  /* card, popover, secondary, muted, accent, destructive, border, input, ring */
  --chart-1: oklch(0.8348 0.1302 160.908);  /* ... --chart-5 */
  --sidebar: oklch(0.9911 0 0);             /* ... --sidebar-ring */
  --font-sans / --font-serif / --font-mono / --radius
  --shadow-2xs ... --shadow-2xl            /* 8 composites from 6 primitives */
  --tracking-normal: 0em;  --spacing: 0.25rem;
}

/* 2. DARK - same key set, different values */
[data-theme='supabase'].dark { --background: oklch(0.1822 0 0); ... }

/* 3. TAILWIND BINDING - raw vars -> utility namespaces */
[data-theme='supabase'] {
  @theme inline {
    --color-background: var(--background);
    --color-primary: var(--primary);
    /* ...33 color bindings... */
    --font-sans: var(--font-sans);
    --radius-sm: calc(var(--radius) - 4px);
    --radius-md: calc(var(--radius) - 2px);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) + 4px);
    --shadow-2xs: var(--shadow-2xs);  /* ...8 shadows... */
  }
}
```

Block 3 is what makes `bg-background`, `text-primary`, `rounded-lg`, `shadow-md`
resolve per palette. Because the components only ever reference semantic utilities,
**palette switching requires zero component changes**.

`src/styles/theme.css` is the aggregator - ten `@import './themes/x.css'` lines plus
the font-cascade fix (§5.5).

### 5.4 Two concrete defects in the palette set

**(a) `mono` destroys every chart.** `themes/mono.css` sets
`--chart-1` through `--chart-5` to the identical value `oklch(0.5555 0 0)`. Any
multi-series chart rendered under `data-theme='mono'` collapses to one flat grey -
legend, tooltip, and series become indistinguishable. This directly violates the
non-color-alone requirement in `SKILL.md`. **Fix:** give monochrome palettes a
**lightness ramp** (`oklch(0.35 0 0)` .. `oklch(0.75 0 0)`) and pair series with
distinct dash patterns or markers so the chart is still readable without hue.

**(b) The `@theme inline` block is duplicated ten times, and has already diverged.**
Verified: `supabase.css` lines 111-167 include six `--tracking-*` bindings
(`--tracking-tighter` through `--tracking-widest`, all `calc(var(--tracking-normal) +/- Nem)`);
`mono.css` lines 109-162 **omit them entirely**. The bindings are otherwise
identical across files. Since block 3 is pure plumbing that never varies with the
palette's values, **hoist one `@theme inline` into `globals.css`** and let each
theme file contain only blocks 1 and 2. That deletes ~500 lines, removes the
divergence class of bug, and makes "add `--chart-6`" a one-file change instead of a
ten-file change. `[INFERENCE]` on the precise cascade symptom of the current
divergence (which `tracking-*` values win under `mono`) - the divergence itself is
directly observed.

### 5.5 The next/font cascade override

`next/font` emits its CSS variables on the element carrying the font class -
here, `<body>`. Theme variables live on `<html>[data-theme]`. Since `body` is more
specific for its own subtree, next/font would win and every palette would render in
the same typeface. `theme.css` defeats this:

```css
[data-theme] body {
  --font-sans: initial;
  --font-serif: initial;
  --font-mono: initial;
  font-family: var(--font-sans);   /* now resolves from html[data-theme] */
}
```

Setting a custom property to `initial` makes it **guaranteed-invalid**, so
`var(--font-sans)` falls back through the cascade to the `html` declaration. This
is the only way to let a theme own typography while still using `next/font`'s
preloading. `font.config.ts` registers 14 Google fonts and exposes
`fontVariables = cn(...14 .variable)`.

### 5.6 View-Transition circular reveal

`src/lib/theme-transition.ts`:

```ts
export function startThemeTransition({ apply, origin }:
  { apply: () => void; origin?: { clientX: number; clientY: number } }) {
  if (!document.startViewTransition) return apply();          // graceful fallback
  if (origin) {
    document.documentElement.style.setProperty('--x', `${origin.clientX}px`);
    document.documentElement.style.setProperty('--y', `${origin.clientY}px`);
  }
  document.startViewTransition(apply);
}
```

`globals.css`:

```css
::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
::view-transition-old(root) { z-index: 0; }
::view-transition-new(root) { z-index: 1; }
@keyframes reveal {
  from { clip-path: circle(0%   at var(--x, 50%) var(--y, 50%)); opacity: 0.7; }
  to   { clip-path: circle(150% at var(--x, 50%) var(--y, 50%)); opacity: 1; }
}
::view-transition-new(root) { animation: reveal 0.4s ease-in-out forwards; }
```

The technique: disable the default cross-fade, stack new above old, then clip-path
the **new** view open from the pointer position. `theme-mode-toggle.tsx` passes the
click event, falling back to centre for the keyboard path:

```tsx
const handleThemeToggle = React.useCallback((e?: React.MouseEvent) => {
  const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
  startThemeTransition({ apply: () => setTheme(newMode), origin: e });   // no event => centre
}, [resolvedTheme, setTheme]);
```

It also binds a `D D` double-tap shortcut with a proper editable-target guard
(`HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | isContentEditable`)
and skips when `metaKey`/`ctrlKey` is held - the correct pattern for any
single-letter hotkey in an admin app.

**Accessibility defect (verified by grep of `globals.css`):** the only
`@media (prefers-reduced-motion: reduce)` block in the file targets `.shimmer`.
The 0.4 s full-viewport `reveal` animation is **unguarded**. Add:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-new(root) { animation: none; }
}
```

A full-screen expanding clip-path is exactly the class of motion the preference
exists to suppress.

---

## 6. Forms - composition root, field contexts, multi-step gate

### 6.1 Why the form layer is two files

`src/lib/form-context.ts` (no component imports):

```ts
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

// The shared "touched AND invalid" rule - errors surface only after interaction.
export function useFieldInvalid() {
  const field = useFieldContext();
  return field.state.meta.isTouched && !field.state.meta.isValid;
}

export interface BaseFieldProps { label?: string; description?: string; required?: boolean }
```

`src/lib/form.ts` (imports all 16 field components):

```ts
export const { useAppForm, withForm } = createFormHook({
  fieldContext, formContext,
  fieldComponents: { TextField, TextareaField, SelectField, CheckboxField, SwitchField,
    RadioGroupField, SliderField, ComboboxField, DatePickerField, DateRangeField, OtpField,
    ColorField, FileUploadField, CheckboxGroupField, TagsField, ToggleGroupField },
  formComponents: { SubmitButton }
});
```

**The split exists to break a cycle:** every field component calls
`useFieldContext()`. If the contexts lived in `form.ts`, each field would import
`form.ts` while `form.ts` imports each field. Keeping the contexts in a
component-free module makes the graph a DAG. Copy the two-file split, not just the
API.

`useFieldInvalid()` in one place is why every field renders errors with identical
timing - no field decides on its own when to show red.

Usage:

```tsx
<form.AppField name='email' children={(field) => (
  <field.TextField label='Email' required type='email' placeholder='john@example.com' />
)} />
```

Drop to raw `form.Field` + the `Field` primitives only for genuine one-offs;
otherwise add a field component to the registry so the behaviour stays uniform.

### 6.2 `useFormStepper` - schema-per-step

**File:** `src/hooks/use-stepper.tsx`

```ts
export function useFormStepper(schemas: ZodTypeAny[], options?: UseFormStepperOptions): {
  step: StepState;             // { value, count, goToNextStep, goToPrevStep, goToStep, isCompleted }
  currentStep: number;         // 1-based
  isFirstStep: boolean;
  currentValidator: ZodTypeAny | undefined;
  triggerFormGroup: () => Promise<boolean>;
  handleNextStepOrSubmit: () => Promise<void>;
  handleCancelOrBack: (opts?: { onBack?: VoidFunction; onCancel?: VoidFunction }) => void;
}
```

The wizard is defined by **an array of zod schemas derived from one master schema**
(`multi-step-product-form.tsx`):

```ts
const productFormSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  price: z.number({ error: 'Price is required' }).min(0.01, 'Price must be greater than 0'),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

const stepSchemas = [
  productFormSchema.pick({ name: true, category: true, price: true }), // Step 1: Basic Info
  productFormSchema.pick({ description: true }),                       // Step 2: Details
  z.object({})                                                         // Step 3: Review (no validation)
];
```

`.pick()` guarantees a step schema can never drift from the master schema - the
single most valuable property of this design. The empty `z.object({})` review step
is the idiomatic "no gate here".

The form wires the current step's schema into dynamic revalidation:

```ts
const form = useAppForm({
  defaultValues, validationLogic: revalidateLogic(),
  validators: { onDynamic: currentValidator, onSubmit: productFormSchema },
  onSubmit: async ({ value }) => { /* ... */ }
});
```

`onDynamic` validates only the fields in view; `onSubmit` re-checks the whole thing.

### 6.3 The step gate

`triggerFormGroup()`:

1. `await form.validateAllFields('submit')` - runs field-level validators.
2. Mark every field in the current step schema as `isTouched` so errors are allowed
   to render (§6.1's rule).
3. `currentValidator.safeParse(form.state.values)` - the cross-field/step gate.
4. On failure, `applyStepIssues(form, result.error.issues)` and return `false`.

Critically, this **never calls `form.handleSubmit()`**, so `submissionAttempts` does
not increment while stepping - the submit button's disabled/pending state stays
meaningful.

`applyStepIssues` is the zod -> TanStack Form bridge and encodes two hard-won details:

```ts
const path = issue.path.reduce<string>((acc, seg) =>
  typeof seg === 'number' ? `${acc}[${seg}]`
                          : acc ? `${acc}.${String(seg)}` : String(seg), '');
```

- **Path encoding:** TanStack notation is `a.b` for keys and `[i]` appended for
  indices - `items[0].sku`, never `items.0.sku`.
- **Error shape:** messages must be written as `{ message }` **objects**, not bare
  strings, because shadcn's `<FieldError>` only renders object entries (the same
  shape zod issues arrive in):

  ```ts
  form.setFieldMeta(path as never, (meta) => ({
    ...meta, isTouched: true,
    errorMap: { ...meta?.errorMap, onSubmit: messages.map((message) => ({ message })) }
  }));
  ```

- **Pathless (cross-field) issues** have no field to render at, so they go to
  `form.setErrorMap({ onServer: pathless.join(' ') })` and surface in the
  form-level error region.

Errors are written under the `onSubmit` cause, so the next successful field
validation overwrites them naturally - no manual clearing.

On the final step, `handleNextStepOrSubmit` re-parses the **full** schema, and if it
fails, jumps back to the first offending step before painting the errors:

```ts
if (!full.success) {
  const firstBadStep = /* index of the earliest step schema containing a failing path */;
  step.goToStep(firstBadStep);
  setTimeout(() => applyStepIssues(form, full.error.issues), 0);  // after the step re-paints
  return;
}
await form.handleSubmit();
```

The `setTimeout(..., 0)` is deliberate: fields on the target step are not mounted
until after the step change commits, so writing meta synchronously would target
unmounted fields.

`handleCancelOrBack` collapses two buttons into one control - Back on every step
after the first (including Review), Cancel only on step 1.

### 6.4 `useControllableState`

**File:** `src/hooks/use-controllable-state.tsx` (Radix-derived), built on
`use-callback-ref.tsx`.

```ts
function useControllableState<T>({ prop, defaultProp, onChange = () => {} }: {
  prop?: T | undefined; defaultProp?: T | undefined; onChange?: (state: T) => void;
}): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>]
```

Contract:

- `isControlled = prop !== undefined`. When controlled, the returned setter calls
  `onChange` with the resolved next value and **never** touches internal state.
- When uncontrolled, it sets internal state *and* fires `onChange` via an effect
  that compares against a `prevValueRef` - so `onChange` fires exactly once per
  real change.
- `useCallbackRef` wraps `onChange` in a ref so an inline arrow prop does not
  re-create callbacks or re-run effects (it returns a stable
  `React.useMemo(() => (...args) => callbackRef.current?.(...args), [])`).
- **With no `defaultProp`, the uncontrolled value is `T | undefined`.** The one
  consumer, `src/components/file-uploader.tsx`, omits `defaultProp` and therefore
  must write `files?.length ?? 0` everywhere. Pass `defaultProp` unless you
  genuinely want the tri-state.

Use this for any component that must work as both `<X value onValueChange>` and
`<X defaultValue>`. Do not hand-roll the controlled/uncontrolled dance per component.

### 6.5 Supporting hooks - and the duplication to delete

| Hook | Contract |
| --- | --- |
| `use-callback-ref.tsx` | Stable identity wrapper for callbacks; the base of the two above. |
| `use-debounced-callback.ts` | `useCallbackRef` + a `useRef(0)` timer, cleared on unmount; used by the filter write-back. |
| `use-mobile.ts` | `useIsMobile()`, 768 px, `matchMedia` + `useState<boolean \| undefined>`, returns `!!isMobile`. |
| `use-media-query.ts` | `useMediaQuery()`, **also** 768 px, returns `{ isOpen }`. |

`use-mobile.ts` and `use-media-query.ts` are two hooks for the same breakpoint with
different return shapes and a duplicated magic number. Keep one. Both start
`false`/`undefined` on the server, so **neither may gate content that must be
correct in the first paint** - use CSS (or container queries) for layout and
reserve the hook for behaviour that genuinely needs JS.

---

## 7. `tailadmin-starter` - harvest markup, reject architecture

Direct comparison, both checkouts inspected:

| Concern | `admin-starter` | `tailadmin-starter` | Verdict |
| --- | --- | --- | --- |
| Theme transport | cookie -> SSR `data-theme`, no flash | `localStorage` read in `useEffect` behind an `isInitialized` gate | **Reject.** Guaranteed flash of wrong theme on first paint. |
| Token model | semantic (`--primary`, `--background`) re-bound per palette | literal ramps in `@theme` (`--color-brand-500: #465fff`) + `@custom-variant dark (&:is(.dark *))` | **Reject for admin.** Dark mode must be spelled `dark:` at every call site (`AppSidebar.tsx` alone stacks `bg-white dark:bg-gray-900 dark:border-gray-800`, plus `dark:hidden` / `hidden dark:block` logo pairs). Semantic tokens make that a no-op. |
| Responsive | CSS-first | `SidebarContext` runs `window.innerWidth < 768` in a `resize` listener and re-renders | **Reject.** JS-driven breakpoints re-render on drag and are wrong during SSR. |
| Tables | `ColumnDef[]` + URL state + server pagination | `BasicTableOne.tsx` embeds a hardcoded `tableData: Order[]` literal in the component file; no column defs, no state | **Reject as architecture.** It is static markup. |
| Icons / markup | shadcn primitives | ~60 hand-tuned SVGs + a typed `svg.d.ts` | **Harvest.** The icon set and the dense list/badge markup are the genuine value. |

**Rule: take the *presentation inventory* from tailadmin and the *system* from
admin-starter.** Do not mix the two token models - a project with both semantic
tokens and literal `brand-*` ramps has two conventions and will drift.

---

## 8. Adoption checklist

Port in this order; each step is independently verifiable.

**Data layer**

1. Create `src/features/<feature>/{api,components,schemas}` and add the
   import-direction lint boundary (§4.2).
2. Write `api/types.ts` and `api/service.ts` first. `service.ts` is the only file
   that knows your backend.
3. Add `queries.ts` with a hierarchical key factory and `mutations.ts` with
   `mutationOptions` + `invalidateQueries({ queryKey: <feature>Keys.all })`.
4. Copy `lib/query-client.ts` **including** `shouldDehydrateQuery: ... || status === 'pending'`.
5. **Write ONE `buildFilters()` used by both the Server Component and the Client
   Component.** Do not duplicate the conditional-spread block (§4.5).

**Table layer**

6. Copy `config/data-table.ts`, `types/data-table.ts`, `lib/data-table.ts`,
   `lib/parsers.ts` unchanged - they are self-contained and correct.
7. Copy `hooks/use-data-table.ts`, then apply these fixes before first use:
   - add `getRowId` (blocking, if selection is enabled);
   - make `enableRowSelection` a prop;
   - delete `getFilteredRowModel` / `getSortedRowModel` / `getPaginationRowModel`;
   - replace the regex token-splitting heuristic with parser-typed values;
   - reconcile `columnFilters` with `filterValues` (or derive it);
   - move `debouncedSetFilterValues` out of the state updater;
   - switch `pageCount` to `rowCount` and render `table.getRowCount()` in the footer.
8. Enforce **explicit `id` + explicit `meta.variant`** on every filterable/sortable
   column (lint rule or dev-time `invariant`).
9. Register every filterable column id in `lib/searchparams.ts`, or scope the cache
   per feature.
10. Feed range-filter bounds from the API, never from `getFacetedMinMaxValues()`
    under manual pagination.
11. Above ~50 rows, hoist row-action modals out of the cell using the existing
    `DataTableRowAction<TData>` type.

**Theme layer**

12. Copy the cookie -> SSR `data-theme` flow **with** the `THEMES.some()` validation.
13. Hoist the single `@theme inline` binding block into `globals.css`; theme files
    keep only light + dark value blocks.
14. Give monochrome palettes a `--chart-*` lightness ramp and non-color series cues.
15. Add the `prefers-reduced-motion` guard for `::view-transition-new(root)`.
16. Keep the `[data-theme] body { --font-sans: initial; ... }` override if you use
    `next/font`.

**Form layer**

17. Copy the two-file `form-context.ts` / `form.ts` split verbatim; put every field
    component in the registry.
18. For wizards, derive step schemas with `.pick()` from one master schema.
19. Copy `applyStepIssues` exactly - the `[i]` path encoding and the `{ message }`
    object shape are both load-bearing.

**Version**

20. If the project is on TanStack Table v9, apply §2.7 before writing any table code.

---

## 9. Invariants (the short list)

1. **URL owns shareable table state; React owns ephemeral state.** Never blur the
   line, and never let a URL-owned slice degrade into a one-way `useState` mirror.
2. **Column ids are a public protocol** - they appear in URLs, sort allowlists, and
   API payloads. Declare them explicitly; validate them server-side before they
   reach an ORM.
3. **`meta` is schema, not decoration.** It selects the filter component, the URL
   encoding, and the operator set.
4. **One backend seam per feature** (`api/service.ts`). Everything else imports
   through it.
5. **One query-key builder shared by server and client.** Two builders means a
   silent cache miss.
6. **Row identity must be stable across pages** - `getRowId` is mandatory whenever
   selection meets server pagination.
7. **Semantic CSS variables, never literal palettes**, so a theme switch is a
   zero-component-change operation.
8. **Theme state that must be correct in the first paint travels in a cookie**, and
   its value is validated against an allowlist before it reaches the DOM.
9. **Errors surface on `isTouched && !isValid`, decided in exactly one place.**
10. **Step schemas derive from the master schema.** A hand-written step schema will
    drift.

---

## 10. Freshness

Source inspection: `/tmp/gh-references/admin-starter/src/`,
`/tmp/gh-references/tailadmin-starter/src/`, at the pinned versions in §0.

Upstream verification (TanStack Table v9 `features` requirement, row-model
relocation, `ColumnMeta<TFeatures, ...>` generic order, `manual*` semantics and
`autoResetPageIndex` behaviour) was performed against the TanStack Table repository
docs: `docs/guide/features.md`, `docs/guide/row-models.md`,
`docs/guide/table-and-column-meta.md`, `docs/guide/client-side-vs-server-side.md`.

nuqs, TanStack Query/Form, next-themes, and Tailwind v4 behaviours are described as
observed in this checkout. Re-verify library APIs against your own lockfile before
implementing - this stack moves fast.

`[INFERENCE]` markers above flag the two places where a consequence was reasoned
rather than executed: the duplicate-request symptom of the query-key divergence
(§4.5) and the exact cascade outcome of the `--tracking-*` divergence (§5.4b). Both
underlying facts - the two divergent code paths - are directly observable in the
named files.
