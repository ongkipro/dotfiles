---
name: astro-development
description: End-to-end Astro architecture and implementation for sites and light-to-medium web apps. Use when creating or auditing an Astro project, running Astro CLI commands, adding pages, content collections, React/shadcn islands, Actions, sessions, endpoints, middleware, adapters, Cloudflare Workers deployment, or choosing static versus on-demand rendering. Also use for Astro-based admin dashboards, with admin-dashboard leading UX decisions and shadcn-ui leading component APIs. Not for generic native-feature questions (native-first), SEO strategy/audits (seo-website-builder), or visual direction (design-taste).
---

# Astro Development

Inspect `package.json`, the lockfile, `astro.config.*`, `tsconfig.json`, and the
route/component tree before proposing commands or architecture. Installed code
wins over this skill; current official docs win over remembered APIs.

## Use this skill for

- New Astro projects
- Existing Astro refactors
- Blogs, docs, landing pages, business websites, content hubs
- Hybrid Astro apps with a few dynamic routes
- Content collections and MD/MDX workflows
- React/Vue/Svelte islands inside Astro
- SEO, sitemap, robots, schema, metadata
- Tailwind-based UI systems
- GSAP-powered motion, reveal effects, and scroll-driven animation in Astro islands or vanilla JS
- Contact forms, APIs, and optional database-backed features
- Deployment to Vercel, Netlify, Cloudflare, or Node

## Default mindset

- Prefer **Astro first**, minimal JS by default
- Ship **static HTML** unless interactivity is required
- Hydrate only the **smallest interactive island**
- Start with static output and opt individual routes into on-demand rendering;
  use `output: 'server'` only when most routes are dynamic
- Build for **clarity, performance, and maintainability**
- For websites, prioritize **real content + strong information architecture + SEO**
- When animation is needed, follow the `design-taste` motion ladder: CSS-first (transitions, scroll-driven animations), then vanilla JS + IntersectionObserver; reach for **GSAP** (via the installed GSAP skills) only for real pin/scrub/timeline work — never invent bespoke animation patterns

## Workflow

### 1. Classify the project

Decide which lane fits best:

- **Content site**: marketing, blog, docs, company site
- **Hybrid site**: mostly static pages plus forms, auth, dashboard, or APIs
- **App-like site**: many dynamic/server features, maybe Astro is still fine, maybe not

If Astro is a poor fit, say so early.

For an existing repository, do not re-scaffold. Run its own scripts and inspect
its installed Astro major before using current syntax.

## CLI policy

Do not install a global Astro CLI. Use the project-pinned binary through the
package manager so commands match the lockfile.

```bash
# New project; choose the package manager intended for the repo
npm create astro@latest

# Existing project; prefer package.json scripts
npm run dev
npm run build
npm run preview

# Official integrations modify dependencies and astro.config.*
npx astro add react
npx astro add cloudflare

# Smallest static checks
npx astro sync
npx astro check
```

Replace `npm`/`npx` with the lockfile's package manager. Before an unfamiliar
flag, run the project-pinned `astro --help` or relevant subcommand help. Adding
an integration mutates source/config: inspect the current official integration
guide first.

## 2. Choose rendering strategy

Use this default order:

1. **static** for most pages
2. **on-demand routes** for request-time pages or endpoints
3. **server islands** for deferred personalized fragments when an adapter is installed
4. **server output** only when most routes need request-time rendering

Rules:
- If most pages are content and public, keep the project mostly static
- If only a few routes need request-time data, use server routes or deferred server pieces
- Do not make everything server-rendered just because one form or dashboard exists

See [Rendering Strategy](references/rendering-strategy.md).

## 3. Plan the structure before coding

For new sites, define:
- page map
- layout/components split
- content model
- SEO targets
- deployment target
- where interactivity is really needed

For business/SEO sites, first produce:
- page list
- keyword/theme map
- internal linking plan
- schema types needed

See [Project Blueprint](references/project-blueprint.md).

## 4. Build with Astro-native patterns

Prefer:
- `.astro` components for static UI
- framework islands only for interactive pieces
- `src/content.config.ts` for content collections
- typed props and strict TypeScript
- optimized images
- minimal client JS

See:
- [Astro Core Patterns](references/astro-core-patterns.md)
- [Content Collections](references/content-collections.md)
- [UI and Islands](references/ui-and-islands.md)
- [Admin Dashboard Runtime](references/admin-dashboard-runtime.md) when the
  project combines Astro, React, and shadcn/ui

## 5. Add SEO and site quality by default

For public-facing sites, always include:
- unique title and meta description
- canonical URL
- OG/Twitter metadata
- sitemap
- robots.txt
- semantic headings
- structured data where relevant
- descriptive internal linking

See [SEO and Content Sites](references/seo-and-content-sites.md).

## 6. Add dynamic features carefully

When needed, support:
- forms
- API endpoints
- search
- auth-protected pages
- DB-backed features
- admin utilities

Use dynamic behavior only where it adds value.

Prefer Astro Actions for type-safe UI-to-server mutations and validated form
input. Keep API endpoints for public protocols, webhooks, machine clients, or
responses that need explicit HTTP control. Actions are public endpoints: check
authentication and authorization inside every privileged handler.

### Middleware authorization: read `context.url`, never `context.request.url`

Astro routes on a **normalized** pathname — it percent-decodes in a loop and
collapses duplicate slashes — and exposes that value as `context.url` /
`Astro.url`. It leaves `context.request` holding the raw bytes the client sent.

Any middleware that classifies a request from `new URL(context.request.url)`
therefore judges one path while Astro serves another. Measured on a real Worker,
with no session cookie:

```
GET  /api/admin/settings    -> 401
GET  //api/admin/settings   -> 200, full provider settings
GET  /%61dmin/orders        -> 200
PUT  //api/admin/settings   -> 200 from a cross-site origin
```

The gate itself was a correct default-deny allowlist. It was simply never
reached: `startsWith('/api/admin/')` is false for `//api/admin/...`, so the
session check, the role check, the CSRF origin check and the password-rotation
gate were all skipped together. Astro ships
`collapseDuplicateLeadingSlashes` with the comment "prevents middleware
authorization bypass when the URL starts with `//`" — upstream treats this shape
as reachable in the wild.

Two follow-ons worth pinning:

- A test harness that builds a context must supply `url` itself. Supplying only
  `request` is how this passes CI: the handler reads `undefined.pathname` or,
  worse, silently classifies nothing as private.
- `pathname.startsWith('/admin')` also claims `/admin-sale` and `/administrasi`.
  Match `=== '/admin' || startsWith('/admin/')`.

See [Dynamic Features](references/dynamic-features.md).

## 7. Ship and validate

Before done:
- run typecheck/build
- check route behavior
- verify metadata
- test responsive layout
- confirm hydration choices are reasonable
- verify deployment config matches platform

See [Delivery Checklist](references/delivery-checklist.md).

## Decision rules

### When to use plain Astro
Use plain Astro when the UI is mostly static or templated.

### When to use React/Vue/Svelte islands
Use islands only for:
- forms with client validation
- toggles, drawers, tabs, accordions if needed
- search/filter widgets
- charts or rich interactions

### When to use server behavior
Use server rendering or API routes only when you need:
- request data
- cookies/session
- DB queries
- private/admin flows
- protected actions

### When not to force Astro
Consider another framework when:
- nearly everything is app-like and client-driven
- collaboration/realtime is core
- heavy auth dashboard is the whole product

## Output expectations

When doing Astro work, aim to produce:
- complete file changes, not vague ideas
- architecture choices with a short reason
- correct Astro conventions
- maintainable folder structure
- minimal overengineering

## Skill routing

- Load `admin-dashboard` for admin IA, density, tables, KPIs, charts, operator
  workflows, and responsive behavior.
- Load `shadcn-ui` for current component/CLI APIs. In an Astro project, run
  `shadcn info --json`; use the official Astro install guide rather than
  adapting a Next.js snippet blindly.
- Load `workers-best-practices` for runtime code and `wrangler` before Wrangler
  commands. Deployment and remote binding writes retain their approval gates.
- Load `ui-validation` after browser-visible changes.

## Optional advanced mode

If the user wants to publish skills from an Astro website, also use:
- [Publishing Skills from Astro](references/publishing-skills-from-astro.md)

That is optional and not part of normal site building.
