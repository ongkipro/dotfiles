# Framework and Visual System

Keep the product contract framework-neutral. Inspect the installed stack before
mapping it to runtime behavior.

## Framework adaptation

### Astro

Use for route-oriented admin surfaces with bounded interactive regions. Render
protected data on the server and hydrate the smallest useful island. Keep React
providers and their consumers in one island because context does not cross
separate roots. Use URL state for shareable filters. Load `astro-development`
for Actions, adapters, and Cloudflare boundaries.

### Vite + React

Use for client-heavy internal tools where an API already owns auth and data.
Keep server authorization in the API. Prefer route loaders/actions or the
installed data layer before adding another client cache. Define loading,
mutation, conflict, and offline/network failure states explicitly.

### Next.js App Router

Fetch protected data in Server Components and keep client boundaries small.
Authorize again inside every Server Action or route handler. Stream independent
regions when latency warrants it. Do not move a component client-side merely to
reuse a hook when a serializable prop preserves the boundary.

### Other stacks

Apply the same contract: server-enforced permissions, URL-addressable views,
explicit async states, and one owner for each piece of state. Reuse native
platform behavior and installed conventions before adding libraries.

## Clean-light CMS/admin baseline

When a project lacks an established visual system, default to the **clean-light CMS/admin visual baseline** rather than a heavy two-theme or heavily branded default. Existing project tokens always win, but this is the fallback for new operator surfaces.

Dark mode is not part of this baseline unless explicitly requested. Do not build a dark mode speculatively.

- **Surfaces:** White (`#ffffff`) or near-white (`#fcfcfc`) backgrounds, clean un-tinted neutrals for borders (`#e5e5e5`) and text (`#171717`, `#525252`).
- **Accent:** One restrained accent color (e.g., a subdued blue/indigo or slate) used strictly for focus rings, active selection, and primary actions.
- **Semantic status:** Pure emerald for success, amber for warning, red for destructive, blue for info. Never use the brand/accent color for semantic state.
- **Hierarchy:** Establish hierarchy through typography (weight, size), layout density, and subtle 1px borders.
- **Anti-slop:** No gradients, no glassmorphism, no oversized border radii, no excessive drop shadows, no rainbow charts, no generic bento/KPI card grids, and no emoji icons.

For exact tokens, spacing, and a functional standalone HTML reference of this baseline, see [`clean-light-cms-baseline.md`](../../admin-dashboard/references/clean-light-cms-baseline.md) and the visual fixture at `../../admin-dashboard/assets/clean-light-cms/index.html`.
