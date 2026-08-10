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

## Two-theme admin baseline

Use light and dark as deliberately designed peers. Default to light unless the
project already records another preference; expose Light, Dark, and System when
user choice exists. Prevent first-paint flash through the framework's accepted
theme mechanism.

Use neutral surfaces with one blue/indigo brand axis, following the measured
TokoPhi Seller pattern without treating its exact project tokens as universal:

- light: near-white background/card, dark neutral text, subtle neutral border
- dark: dark neutral background, slightly raised cards, low-alpha borders
- primary/ring/sidebar active state: one blue/indigo hue
- semantic states: emerald success, amber warning, red destructive, blue info
- never use the brand color to mean success or danger
- chart series require non-color cues and a reviewed categorical palette

For a new Tailwind v4 + shadcn setup, a reasonable starting accent is TokoPhi's
verified blue-indigo family: approximately `oklch(0.515 0.23 277)` in light and
`oklch(0.62 0.20 277)` in dark. Treat these as starting points, not a mandate.
Read existing CSS and `components.json` before editing; preserve project tokens.

Test both themes for text, focus, disabled, hover, selected, chart, badge,
skeleton, empty, error, and destructive states. A token block alone is not dark
mode completion; use `ui-validation` in the browser.
