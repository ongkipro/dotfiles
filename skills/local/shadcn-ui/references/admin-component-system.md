# Admin Component System

Use this reference after `admin-product-ux` has established the workflow and
`admin-dashboard` has chosen the screen hierarchy. It maps an accepted admin
screen to shadcn/ui components, runtime boundaries, responsive transformations,
and performance safeguards. It does not decide business rules, chart meaning,
or navigation architecture.

## Governing rule

shadcn/ui is the default component source for **React-capable admin surfaces**.
It is not a mandate to render every piece of markup through React.

- Existing `components.json`, project tokens, framework conventions, and copied
  component source always win.
- Keep semantic HTML as the foundation. A shadcn component may style or compose
  a native control; it does not replace the browser's semantics.
- In Astro, static headings, text, badges, cards, and tables stay in Astro/HTML
  when they need no React behavior. Do not hydrate markup merely to make its
  import path say `components/ui`.
- In non-React stacks, use the stack's native component system. A third-party
  port may borrow shadcn's visual language, but it is not official shadcn/ui and
  must not be treated as API-compatible.
- Add only components required by the accepted screen. A registry block is
  source material, not a finished screen or an installation bundle.

## Ownership and sequence

Apply the skills in this order:

1. `admin-product-ux`: actor, job, objects, lifecycle, permissions, task and
   exception flows, screen states, and acceptance criteria.
2. `admin-dashboard`: information hierarchy, navigation mode, KPI/table/chart
   choice, responsive behavior, density, and operator presentation.
3. `shadcn-ui`: component selection, composition, registry inspection, copied
   source, tokens, and client-boundary cost.
4. Installed framework skill: server rendering, data ownership, mutations,
   routing, caching, and deployment behavior.
5. `ui-validation`: real-browser viewport, interaction, keyboard, state, and
   accessibility evidence.
6. `web-perf`: measured performance diagnosis when the screen or dependency
   change creates material load or interaction risk.

Do not move product or IA decisions into this reference. Do not make a visual
block authoritative over the accepted screen contract.

## Component plan

For a small change, keep the plan inline. For a coordinated or data-dense
screen, map each region before implementation:

```yaml
screen: Orders
runtime: Next.js App Router
regions:
  - name: Order filters
    user_job: Narrow the queue to actionable orders
    components: [Input, Select, Button, Sheet]
    composition: Desktop toolbar; mobile filter sheet
    data_owner: Server route
    state_owner: URL
    render_mode: Server shell with client filter leaf
    responsive: Toolbar to one Filters button below the accepted breakpoint
    states: [ready, filtered-empty, permission-disabled]
    accessibility: Named controls; returned focus after Sheet closes
    performance_risk: None beyond the existing client shell
```

Every region should answer only the fields that affect implementation:

- component and composition;
- data owner and state owner;
- server/client/island boundary;
- responsive transformation;
- loading, empty, error, disabled, conflict, and success states that apply;
- keyboard/focus behavior;
- material dependency or hydration risk.

A plan that merely lists component names is incomplete. A plan that restates the
whole product contract is too large.

## Selection ladder

Stop at the first level that satisfies the accepted behavior:

1. semantic browser primitive;
2. existing copied shadcn component;
3. composition of existing shadcn components;
4. new shadcn registry item after `view` and `--dry-run` inspection;
5. already-installed dependency;
6. minimum custom component;
7. new dependency only after `native-first` approves the cost.

Examples:

- Use native `<input type="date">` when locale and browser behavior satisfy the
  job; use Calendar + Popover only for blocked dates, ranges, or richer context.
- Use a semantic table or shadcn `Table` for static data; add TanStack Table only
  when sorting, filtering, visibility, selection, or pagination is real behavior.
- Use a native select when its interaction is sufficient; use shadcn Select or a
  combobox composition when presentation, search, or option content requires it.
- Use a dedicated route instead of a modal for long, shareable, high-risk, or
  multi-step work.

## Runtime matrix

### Next.js App Router

Best fit for a full admin whose auth, protected data, mutations, and routing live
in the same application.

- Keep pages and layouts as Server Components.
- Pass serializable data into the smallest interactive shadcn leaf.
- Scope providers to the route or region that consumes them; a provider does
  not belong in the root layout merely because one screen needs it.
- Re-authorize every mutation in its Server Action or Route Handler.
- Stream independent slow regions when measured latency warrants it.
- Lazy-load charts, rich editors, and other client-only heavy modules from a
  client boundary; do not move the whole page client-side to enable one import.
- Avoid a browser fetch waterfall for data already available to the server.

### Vite + React or React Router

Best fit when an existing API owns auth and data and an all-client application
is genuinely the simpler runtime.

- Authorization remains enforced by the API; hidden buttons are not a boundary.
- Reuse installed route loaders/actions and data primitives before adding a
  second client cache.
- Split by route. A chart, editor, or rarely used settings surface must not enter
  every route's initial bundle.
- Keep one owner for URL state, server cache, form draft, and transient overlay
  state; duplicated stores produce stale screens.
- Define initial load, background refresh, mutation, conflict, offline/network
  failure, and session-expiry behavior where they affect the job.

### Astro + React

Best fit for route-oriented admin surfaces with bounded interactive regions.

- Render protected data and static structure on the server.
- Hydrate the smallest **useful coordinated region**, not the smallest possible
  element. Providers and every consumer must share one React root.
- Keep static shadcn-like presentation in Astro/HTML with the same semantic
  tokens; do not create islands for Card, Badge, heading, or read-only text.
- Choose the hydration directive from actual interaction timing through
  `astro-development`; do not stamp `client:load` on every component.
- Do not add an external store to bridge islands that should have been one
  island.
- If most routes need pervasive shared client state or realtime coordination,
  reassess the runtime instead of hydrating the entire Astro admin by accident.

### Other supported React runtimes

TanStack Start, Laravel with React, and future official templates use the same
contract: inspect the installed runtime, keep server authority on the server,
minimize client scope, and verify current shadcn installation guidance. Never
infer compatibility from a visual resemblance to shadcn.

## Component inventory and escalation

This is a decision inventory, not an install command.

### Foundation and feedback

Default vocabulary:

- Button, Input, Label/Field, Textarea;
- Separator, Badge, Avatar;
- Alert, Skeleton, Progress when progress is measurable;
- one toast system, normally Sonner when the project already accepts it;
- one icon library from `components.json`.

Rules:

- A skeleton mirrors final geometry; a generic spinner is not a content layout.
- Empty state explains why the set is empty and the next valid action.
- Filtered-empty and system-empty are different states.
- A toast supplements the changed screen state; it must not be the only evidence
  of success or failure.
- Critical information never lives only in a tooltip.

### Navigation

Typical vocabulary: Sidebar, Breadcrumb, Tabs, Dropdown Menu, Command, Sheet,
and Collapsible.

- Use one shell across the admin.
- Keep current location visible when the sidebar collapses.
- Transform full sidebar to rail or Sheet according to `admin-dashboard`; do not
  merely shrink labels until they disappear.
- Keep tenant/store scope and impersonation state persistent and unmistakable.
- Command palettes supplement visible navigation; they do not hide the only path
  to a primary task.

### Forms

Typical vocabulary: Field, Input, Textarea, Select, Checkbox, Radio Group,
Switch, Calendar, Popover, Dialog, Sheet, and AlertDialog.

- Preserve native form submission and labels where the runtime supports them.
- Use the project's installed form library only when the form earns it through
  cross-field validation, repeated fields, complex controlled inputs, or shared
  form infrastructure.
- Associate help, validation, and server errors with the correct field.
- Preserve entered values after recoverable validation or server failure.
- Focus the first actionable error after submission.
- Use Switch for an immediately applied binary setting; use Checkbox for a
  selected value or consent inside a form.
- Use AlertDialog for irreversible or costly actions. Reversible actions should
  not receive ritual confirmation.
- Move long, shareable, high-risk, or multi-step forms to a route rather than
  stacking Dialogs.

### Data display and operations

Typical vocabulary: Table, Checkbox, Dropdown Menu, Badge, Pagination, Sheet,
Accordion, and Scroll Area only where native overflow is insufficient.

- Add TanStack Table only for real table behavior, not for styled rows.
- Keep shareable filters, sorting, and pagination in the URL.
- For large sets, push filter, sort, and pagination into the server. Virtualizing
  fetched rows does not reduce network or query cost.
- State whether selection means the current page or the entire filtered set.
- Bulk actions report partial success and identify failed items.
- Status badges use domain language and a semantic non-color cue where needed.
- Do not render complete desktop and mobile interactive trees simultaneously
  just to hide one with CSS. Preserve one state owner and one accessible tree.
- Pick horizontal scroll, priority columns, expandable detail, card transform,
  or filter-first behavior through `admin-dashboard`; no single mobile table
  pattern fits every job.

### Overlays

- Tooltip: brief supporting explanation.
- Popover: bounded contextual interaction.
- Dropdown Menu: compact secondary actions.
- Dialog: focused short task that benefits from retained page context.
- AlertDialog: destructive confirmation with the object and consequence named.
- Sheet: mobile navigation, filters, or bounded secondary detail.
- Dedicated route: long, linkable, high-risk, or multi-step work.

Return focus to the trigger after dismissal. Nested overlays require a concrete
workflow justification; they are not a default composition.

### Analytics

Use shadcn Chart/Recharts for ordinary charts only after `admin-dashboard`
selects the relationship and chart type.

- Keep charts in client leaves and out of routes that do not render them.
- Use semantic chart tokens and a non-color series cue.
- Give every KPI its period, comparison basis, and freshness.
- A task queue, exception list, or approval inbox may be the correct first
  screen; do not force KPI cards and charts onto every admin home.
- Escalate beyond Recharts only after the data volume or chart form proves the
  need.

## Visual and token contract

- Existing project tokens win.
- For a new operator surface without a visual system, use
  `admin-dashboard`'s clean-light baseline.
- Dark mode is not speculative scope. Implement it only when accepted, then
  define every semantic and chart token in both themes and verify both.
- Use one restrained accent for focus, active selection, and primary action.
- Keep success, warning, destructive, and informational colors semantic rather
  than branded.
- Establish hierarchy through typography, spacing, alignment, density, and
  subtle borders—not gradients, glass, card nesting, or decorative shadows.
- A Card groups related content. It is not the default wrapper for every region.

## Performance prevention contract

Before adding components:

1. Run `shadcn info --json` in an installed project.
2. Inspect the copied component and existing alternatives.
3. Run `shadcn view <item>` and `shadcn add <item> --dry-run` for a new item.
4. Review every npm and registry dependency the item introduces.

During implementation:

- import only the components and icons used;
- avoid wildcard icon imports and UI barrel files that obscure route cost;
- keep providers and client boundaries as low as their shared state permits;
- lazy-load charts, rich editors, and rare heavy workflows by route or action;
- do not hydrate static Astro presentation;
- do not ship thousands of rows and call virtualization a performance fix;
- avoid duplicate desktop/mobile interactive trees;
- reserve final geometry for skeletons, images, tables, and async regions;
- avoid a client data request when the server already owns the result;
- keep background refresh from reordering rows under the operator's cursor.

Do not encode one universal JavaScript budget across Next, Vite, and Astro.
Establish a project route baseline, then compare initial JavaScript, transferred
resources, request chains, layout shifts, and interaction cost after material
changes. `web-perf` owns measurement and diagnosis.

## Browser acceptance gate

A browser-visible admin change is complete only after evidence appropriate to
its risk:

- exercise the affected route and primary job;
- check a narrow phone and wide desktop when layout changes, plus the actual
  tablet breakpoint when sidebar or table behavior changes there;
- verify no accidental page-level horizontal overflow;
- exercise keyboard order, visible focus, accessible name/role/state, overlay
  focus return, and changed form errors;
- trigger relevant loading, empty, error, disabled, conflict, or partial-success
  states instead of inferring them from source;
- confirm no relevant console, hydration, or failed-request errors;
- run a measured trace when a new chart, editor, provider, large table, or other
  material client dependency changes route cost.

Build and type checks support this evidence; they do not replace the browser.

## Freshness boundary

shadcn registry items, supported templates, base libraries, CLI flags, and copied
source change over time. Verify current project context and upstream guidance
before implementation:

- https://ui.shadcn.com/docs/installation
- https://ui.shadcn.com/docs/cli
- https://ui.shadcn.com/docs/components

The standard registry does not require MCP. Use MCP when conversational registry
browsing or private registries materially improve the workflow; the native CLI
remains the deterministic baseline.
