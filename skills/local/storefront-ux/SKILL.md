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

1. **Inspect reality.** Trace routes, navigation, state ownership, data
   boundaries, current analytics, and existing tests. Verify behavior in the
   running storefront when implementation is in scope.
2. **Name the user and job.** State audience, entry point, purchase intent,
   device constraints, locale, and success event. Separate browsing,
   considered purchase, repeat purchase, and post-purchase jobs.
3. **Map the critical path.** Cover discovery → evaluation → configuration →
   cart → checkout handoff → confirmation/account. For a DR/COD funnel, map
   offer → direct order form → confirmation instead. Record exits,
   back-navigation, persistence, and recovery.
4. **Inventory rules and claims.** Capture market/price basis, availability,
   fulfilment, promotions, trust evidence, cart ownership, checkout boundary,
   permissions, and analytics. Never invent commercial policy.
5. **Inventory states.** For every surface include loading, empty, partial,
   unavailable, error, stale, offline/retry, authenticated/guest, pending,
   conflict, and success states where applicable.
6. **Design progressive decisions.** Expose the minimum choice needed now;
   preserve prior choices; make destructive or irreversible transitions
   explicit; keep checkout boundaries recognizable.
7. **Specify responsive and accessible behavior.** Define focus order, keyboard
   operation, announcements, error association, touch targets, zoom/reflow, and
   mobile transformations without deleting essential information.
8. **Budget performance.** Prioritize product identity, price, availability,
   and primary decision controls. Defer secondary media, reviews, rich content,
   and recommendations. Prevent interaction and layout instability.
9. **Define analytics as a contract.** Measure meaningful outcomes and friction
   with stable event semantics. Tracking cannot block interaction or expose
   personal/payment data.
10. **Produce acceptance criteria.** Make each criterion observable across
    representative viewports, input methods, locales, and failure states.
    Hand visual hierarchy to `design-taste`, implementation to
    `storefront-development`, and browser proof to `ui-validation`.

Read [journeys-and-states.md](references/journeys-and-states.md) for canonical
buyer journeys, responsive behavior, commerce state, recovery, analytics, and
acceptance gates. For Shopify work, also read
[shopify-boundary.md](references/shopify-boundary.md); treat hosted checkout,
accelerated checkout, Customer Accounts, cart semantics, and extension surfaces
as platform contracts, not generic frontend behavior. Use `design-taste`
Storefront/Commerce mode for visual hierarchy. Generic landing-page patterns
must not specify product discovery or purchase decisions.

For a headless Shopify decision, architecture, migration, or API/cache/token/
account boundary, load `headless-shopify`. Keep this skill responsible for the
buyer journey and observable state requirements, not the runtime design.

## Decision rules

- Preserve state when users move between list and detail, change locale,
  authenticate, encounter validation errors, or return from checkout where the
  platform permits it.
- Prefer URL-addressable search, sort, filters, pagination, and product options
  when they represent shareable navigation state.
- Price and availability may vary by market, customer context, currency, tax
  basis, option, quantity, and selling plan. Keep the basis visible; cached card
  data is not checkout truth.
- Compare-at/reference pricing, savings, stock pressure, delivery promises,
  ratings, guarantees, and trust claims require an authoritative source. Place
  each claim with the decision it supports, not in a generic badge row.
- Show unavailable choices without dead ends. Distinguish selected, available,
  sold out, nonexistent, pending, and unknown without color alone.
- Treat the cart as an editable order preview. Recalculate visibly and explain
  changed price, inventory, discount, or fulfilment eligibility.
- Never imply checkout completion before the commerce backend confirms it.
  Cart success, checkout initiation, payment intent creation, and client return
  are not order confirmation.
- Do not require account creation before purchase unless the business
  constraint is verified. Preserve guest progress through authentication.
- Format price, dates, units, names, and addresses for the active market. Do
  not equate language, currency, market, and shipping destination.
- Use semantic HTML and native controls first. Announce asynchronous changes to
  availability, cart count, totals, or errors without moving focus
  unexpectedly.
- Prefer fewer reliable analytics events over click exhaust. Define meaning,
  trigger, required properties, consent, deduplication, and validation owner.

## Required deliverable

Return the smallest artifact that fits the request. For a full audit or specification include:

1. Scope, users, assumptions, merchandising intent, and verified constraints.
2. Journey map with decisions, authoritative owners, and checkout boundary.
3. Findings ranked by user harm and commercial impact, each tied to evidence.
4. Surface/state matrix including recovery behavior.
5. Responsive, accessibility, localization, and performance requirements.
6. Analytics contract for the critical funnel only.
7. Testable acceptance criteria and unresolved decisions.

Label inference as inference. Do not invent inventory policy, tax behavior, checkout capability, analytics APIs, or platform limits; inspect the project or authoritative platform documentation first.
