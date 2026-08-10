# Astro Admin Dashboard Runtime

Use this reference only after `admin-dashboard` has defined the screen and
workflow and `shadcn-ui` has resolved the current component setup.

## Fit decision

Keep the admin in Astro when routes are mostly server-rendered pages and each
interactive region has a clear boundary: a sidebar shell, filter form, table,
or chart. Prefer an existing React/Next app, or a dedicated React app, when the
product needs pervasive client routing, cross-page client state, realtime
coordination, or one large interaction graph. Do not rewrite a working Astro
admin based on this heuristic alone.

## shadcn setup

shadcn/ui in Astro uses the React integration. For a new accepted setup, use the
current official Astro installer/template. For an existing project:

1. Inspect the lockfile, `astro.config.*`, `components.json`, aliases, and CSS.
2. Run `shadcn info --json` and `shadcn add <item> --dry-run`.
3. Add only the components required by the accepted screen.
4. Keep static shadcn output unhydrated when it needs no browser behavior.

## React ownership

Astro client islands are separate framework roots. React context does not cross
between separately hydrated islands. Keep a provider and all consumers that
need it in one React island; this commonly applies to `SidebarProvider`, menus,
dialogs, and a coordinated data table toolbar.

- Use `client:load` for the immediately usable application shell.
- Use `client:visible` for independent below-the-fold charts.
- Use URL query parameters as the durable source for shareable filters.
- Pass only serializable data from Astro into framework components.
- Avoid hydrating static KPI cards or table markup solely for styling.

## Data and mutations

Fetch protected page data on the server after authorization. Use Actions for
typed UI mutations and validated forms; re-check authorization in the handler.
Use endpoints for webhooks and public/machine protocols. After a mutation,
return the smallest result needed and refresh or navigate deliberately; do not
introduce a client cache library until polling, optimistic updates, or shared
cache behavior demonstrates the need.

## Cloudflare

Static Astro output cannot access Workers bindings at request time. If the
dashboard needs D1, KV, sessions, or request-time auth, use the official
Cloudflare adapter and on-demand rendering. The adapter uses server output by
default; explicitly prerender public static routes where appropriate. Read the
current Cloudflare Astro guide before config changes, and load `wrangler` before
commands. A deploy or remote database mutation still requires user approval.
