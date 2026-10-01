# Dynamic Features

Use dynamic features surgically.

## Good candidates

- contact/lead forms
- newsletter signup
- authenticated account pages
- search APIs
- lightweight admin pages
- database-backed submissions

## Patterns

- keep public pages static where possible
- mark only necessary routes as server-rendered
- isolate admin/private concerns
- keep database code in a clear lib/data layer

## Choose the server boundary

- Use an Astro Action for form submissions and UI mutations that benefit from
  typed input, validation, and standardized errors.
- Use an endpoint for webhooks, public APIs, feeds/files, non-Astro clients, or
  precise HTTP method/header/body behavior.
- Use middleware for cross-cutting request context and broad gates, but repeat
  object-level authorization in privileged Actions/endpoints.
- Use sessions only after an adapter/runtime is chosen. Node, Cloudflare (KV
  `SESSION`), and Netlify supply a default driver; others need
  `session.driver`. Call `session.regenerate()` after login and
  `session.destroy()` on logout, and type values with `App.SessionData`.
  Verify the installed version's API in [Platform versions](platform-versions.md)
  instead of inventing a store shape from memory.
- Keep `security.checkOrigin` on (the default); it is Astro's built-in CSRF
  origin check for on-demand routes and Actions submitted by forms.

Actions are reachable as public endpoints. Validate input at the boundary and
authorize inside the handler. Never treat an absent UI button as access control.

## Database note

A database is optional for most marketing/content sites.
Use one only when the workflow needs stored user or operational data.
