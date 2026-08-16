---
name: storefront-ux
description: >-
  Use when designing, auditing, or repairing end-to-end commerce interaction flows and state behavior across
  search, product listing and filtering, product detail and variants, cart, checkout handoff,
  customer account, localization, accessibility, performance, and analytics. Use for storefront
  UX specifications, journey audits, edge-state inventories, responsive commerce behavior,
  conversion-friction diagnosis, direct COD or single-page order form behavior, or
  implementation acceptance criteria. Keep decisions
  backend-neutral; use the Shopify boundary reference when the project uses Shopify. Not for
  visual styling or aesthetics (design-taste), marketing or product copy (copywriting/content),
  API syntax or component installation (storefront-development implements the accepted contract),
  admin dashboards, or browser-based validation execution.
---

# Storefront UX

Own the behavior of the commerce journey, including failure and recovery paths. Do not own its visual style, prose, component library, or backend API implementation.

## Route adjacent work

| Need | Use |
|---|---|
| Implement storefront pages, product controls, cart, checkout handoff, or framework boundaries | `storefront-development` |
| Visual hierarchy, art direction, spacing, motion, aesthetic review | `design-taste` |
| Product, merchandising, SEO, or interface copy | `content` or `copywriting` |
| AnswerBox passages, crawler guidance, or AEO/GEO evidence | `ai-traffic-os` |
| Framework/component API details beyond the storefront boundary | Relevant framework or component skill |
| Admin and operational dashboards | `admin-dashboard` |
| Runtime performance diagnosis | `web-perf` |
| Browser, accessibility, and visual validation execution | `ui-validation` |

Keep semantic structure, keyboard behavior, state recovery, performance budgets, and measurement requirements here because they affect journey correctness.

## Workflow

1. **Inspect reality.** Trace routes, navigation, state ownership, data boundaries, current analytics, and existing tests. Verify behavior in the running storefront when implementation is in scope.
2. **Name the user and job.** State audience, entry point, purchase intent, device constraints, locale, and success event. Separate browsing, considered purchase, repeat purchase, and post-purchase jobs.
3. **Map the critical path.** Cover discovery → evaluation → configuration → cart → checkout handoff → confirmation/account. For a DR/COD funnel the path collapses to offer → direct order form → confirmation; map that one instead of forcing the full journey onto it. Record exits, back-navigation, persistence, and recovery.
4. **Inventory states.** For every surface include loading, empty, partial, unavailable, error, stale, offline/retry, authenticated/guest, and permission-sensitive states where applicable.
5. **Resolve commercial invariants.** Make price, currency, tax/shipping qualification, inventory, variant availability, quantity limits, promotions, and totals internally consistent. Never hide a material price change.
6. **Design progressive decisions.** Expose the minimum choice needed now; preserve prior choices; make destructive or irreversible transitions explicit; keep checkout boundaries recognizable.
7. **Specify responsive and accessible behavior.** Define focus order, keyboard operation, announcements, error association, touch targets, zoom/reflow, and mobile adaptations without deleting essential information.
8. **Budget performance.** Prioritize product identity, price, availability, and primary decision controls. Defer secondary media and recommendations. Prevent interaction and layout instability.
9. **Define analytics as a contract.** Measure meaningful user outcomes and friction with stable event semantics. Do not let tracking block interaction or expose personal/payment data.
10. **Produce acceptance criteria.** Make each criterion observable and testable across representative viewports, input methods, locales, and failure states.

Read [journeys-and-states.md](references/journeys-and-states.md) for
surface-specific requirements. Read [public-frontend-patterns.md](references/public-frontend-patterns.md) for behavioral and state requirements for high-conversion public frontends across e-commerce, travel, and direct-response landing pages. Read
[shopify-boundary.md](references/shopify-boundary.md) only for Shopify
storefronts. Read [sources.md](references/sources.md) only when refreshing the
upstream evidence or changing this skill's scope.

## Decision rules

- Preserve state when users move between list and detail, change locale, authenticate, encounter validation errors, or return from checkout where the platform permits it.
- Prefer URL-addressable search, sort, filters, pagination, and product options when they represent shareable navigation state.
- Show unavailable choices without creating dead ends: distinguish sold out, nonexistent combinations, quantity limits, and temporarily unknown inventory.
- Treat the cart as an editable order preview, not a second product page. Recalculate totals visibly and explain changed price, inventory, discount, or fulfillment eligibility.
- Never imply checkout completion before the commerce backend confirms it. Make redirects, external domains, accelerated checkout, and return states understandable.
- Do not require account creation before purchase unless the business constraint is verified. Preserve guest progress through authentication.
- Format price, dates, units, names, and addresses for the active market. Do not equate language, currency, market, and shipping destination.
- Use semantic HTML and native controls first. Announce asynchronous changes that affect availability, cart count, totals, or errors without moving focus unexpectedly.
- Prefer fewer reliable analytics events over click exhaust. Define event meaning, trigger, required properties, consent behavior, deduplication, and validation owner.

## Required deliverable

Return the smallest artifact that fits the request. For a full audit or specification include:

1. Scope, users, assumptions, and verified constraints.
2. Journey map with decision and system boundaries.
3. Findings ranked by user harm and commercial impact, each tied to evidence.
4. Surface/state matrix including recovery behavior.
5. Responsive, accessibility, localization, and performance requirements.
6. Analytics contract for the critical funnel only.
7. Testable acceptance criteria and unresolved decisions.

Label inference as inference. Do not invent inventory policy, tax behavior, checkout capability, analytics APIs, or platform limits; inspect the project or authoritative platform documentation first.
