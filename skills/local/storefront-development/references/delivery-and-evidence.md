# Delivery and Evidence

Use project scripts first. A build proves compilation, not commerce behavior.

## Required journey checks

- home/collection/product render useful content without hydration failure
- product option changes resolve media, price, availability, URL, and action
- invalid, sold-out, and unavailable combinations are distinct
- add succeeds once under rapid activation and recovers after network failure
- cart count, lines, quantities, discount, and subtotal reconcile from backend
- cart persists/restores according to the defined session contract
- empty cart and stale inventory have recovery paths
- checkout handoff uses the current backend target and explains the transition
- back navigation does not corrupt selection or cart
- keyboard, focus, live announcements, zoom/reflow, and reduced motion work
- analytics respects consent and excludes cart secrets and personal/payment data

## Representative viewports and conditions

Test at least narrow mobile, wider mobile, tablet/compact desktop, and desktop
with realistic long titles, translated labels, sale prices, multiple variants,
empty results, and slow/error responses. Inspect horizontal overflow and layout
shift. Verify the primary purchase action remains reachable without hiding
material price or variant decisions.

## Performance priorities

- Keep above-the-fold product identity and primary media lean.
- Give the likely LCP image correct dimensions and priority; lazy-load secondary
  media.
- Avoid shipping a framework runtime for static merchandising alone.
- Reserve media geometry and avoid cart/variant-induced layout shifts.
- Defer recommendations, reviews, tracking, chat, and rich media behind the
  critical product decision path.

Use `ui-validation` for browser evidence and `web-perf` when measured budgets or
Core Web Vitals fail.
