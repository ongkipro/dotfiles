# Framework and Visual System

Keep the product contract framework-neutral. Inspect the installed stack before
mapping it to runtime behavior.

## Component system boundary

For React-capable admin surfaces, shadcn/ui is the default component source
after the workflow and screen contracts are accepted. It is not a universal
render layer: semantic browser behavior remains underneath, and static Astro
markup should not be hydrated only to reproduce a Card, Badge, heading, or
read-only table. Existing `components.json`, project tokens, and copied source
always win.

Use
[Admin component system](../../shadcn-ui/references/admin-component-system.md)
for component mapping, responsive composition, client-boundary cost, and the
browser acceptance gate.

## Framework adaptation

### Astro + React

Use for route-oriented admin surfaces with bounded interactive regions. Render
protected data on the server and hydrate the smallest useful coordinated
region. Keep React providers and consumers in one island because context does
not cross roots. Keep static presentation in Astro/HTML with the same semantic
tokens. Use URL state for shareable filters. Load `astro-development` for
Actions, hydration directives, adapters, and Cloudflare boundaries.

### Vite + React or React Router

Use for client-heavy internal tools where an API already owns auth and data.
Keep server authorization in the API. Prefer installed route loaders/actions
and data primitives before adding another client cache. Split by route and keep
heavy charts or editors out of unrelated initial bundles. Define loading,
mutation, conflict, session-expiry, and offline/network failure states where
they affect the job.

### Next.js App Router

Use for an integrated full admin whose protected data, auth, mutations, and
routing live in one application. Fetch protected data in Server Components and
keep client boundaries small. Authorize again inside every Server Action or
Route Handler. Stream independent regions when measured latency warrants it.
Do not move a component client-side merely to reuse a hook when a serializable
prop preserves the boundary.

### Other React-capable stacks

Apply the same contract to official shadcn templates and established React
runtimes: server-enforced permissions, URL-addressable views, explicit async
states, one owner for each piece of state, and minimal client scope. Verify
current framework and registry support before implementation.

### Non-React stacks

Use the stack's native component system. A third-party port may borrow shadcn's
visual language, but it is not official shadcn/ui and must not be treated as
API-compatible. Preserve the product and visual contract without forcing React
into the runtime.

## Clean-light CMS/admin baseline

When a project lacks an established visual system, default to the **clean-light CMS/admin visual baseline** rather than a heavy two-theme or heavily branded default. Existing project tokens always win, but this is the fallback for new operator surfaces.

Dark mode is not part of this baseline unless explicitly requested. Do not build a dark mode speculatively.

- **Surfaces:** White (`#ffffff`) or near-white (`#fcfcfc`) backgrounds, clean un-tinted neutrals for borders (`#e5e5e5`) and text (`#171717`, `#525252`).
- **Accent:** One restrained accent color (e.g., a subdued blue/indigo or slate) used strictly for focus rings, active selection, and primary actions.
- **Semantic status:** Pure emerald for success, amber for warning, red for destructive, blue for info. Never use the brand/accent color for semantic state.
- **Hierarchy:** Establish hierarchy through typography (weight, size), layout density, and subtle 1px borders.
- **Anti-slop:** No gradients, no glassmorphism, no oversized border radii, no excessive drop shadows, no rainbow charts, no generic bento/KPI card grids, and no emoji icons.

For exact tokens, spacing, and a functional standalone HTML reference of this baseline, see [`clean-light-cms-baseline.md`](../../admin-dashboard/references/clean-light-cms-baseline.md) and the visual fixture at `../../admin-dashboard/assets/clean-light-cms/index.html`.
