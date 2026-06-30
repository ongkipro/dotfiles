---
name: astro-development
description: End-to-end Astro development skill for building, scaling, reviewing, and shipping Astro sites and apps. Use when creating a new Astro project, adding pages or components, choosing static vs server rendering, setting up content collections, SEO, Tailwind, React islands, forms, APIs, adapters, deployment, or auditing an existing Astro codebase. Also use when the user asks to build a website in Astro without specifying the architecture.
---

# Astro Development

All-in-one Astro skill for real project delivery.

This skill combines:
- **Astro framework expertise** for architecture and implementation decisions
- **Astro builder workflow** for shipping complete websites
- **SEO/content site patterns** for business and marketing sites
- **optional skill publishing** notes for teams that want to distribute skills from an Astro site

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
- Prefer **hybrid thinking** over making the whole app fully server-rendered
- Build for **clarity, performance, and maintainability**
- For websites, prioritize **real content + strong information architecture + SEO**
- When animation is needed, prefer **GSAP** and route to the installed GSAP skills rather than inventing bespoke animation patterns

## Workflow

### 1. Classify the project

Decide which lane fits best:

- **Content site**: marketing, blog, docs, company site
- **Hybrid site**: mostly static pages plus forms, auth, dashboard, or APIs
- **App-like site**: many dynamic/server features, maybe Astro is still fine, maybe not

If Astro is a poor fit, say so early.

## 2. Choose rendering strategy

Use this default order:

1. **static** for most pages
2. **server islands** or selective server routes for dynamic fragments
3. **server-rendered routes** only where needed

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

## Optional advanced mode

If the user wants to publish skills from an Astro website, also use:
- [Publishing Skills from Astro](references/publishing-skills-from-astro.md)

That is optional and not part of normal site building.
