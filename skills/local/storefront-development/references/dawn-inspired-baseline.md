# Dawn-Inspired Baseline

Dawn's durable lesson is not its exact CSS. It is an HTML-first storefront with
JavaScript used only where enhancement earns its cost, plus merchant-configured
sections and disciplined performance/accessibility checks.

## Visual hierarchy

- Let product media and product identity dominate.
- Keep header/navigation compact and predictable.
- Use one primary purchase action per decision stage.
- Use neutral surfaces and borders before tinted cards.
- Keep typography roles few and consistent; reserve display treatment for
  merchandising, not utility controls.
- Make price, variant, availability, fulfilment, returns, and purchase action
  visually adjacent.
- Keep trust information factual and close to the relevant decision.

## Page baseline

### Home

Communicate store category and value quickly, then lead to meaningful
collections/products. Prefer a static, intentional hero over an auto-rotating
carousel. Limit section count to what real merchandising content supports.

### Collection and search

Provide crawlable product links, stable image ratios, visible price/availability,
URL-addressable sort/filter state, result count, clear-filter recovery, and a
true no-results state. Quick add must not bypass required variant choices.

### Product

Put title, price, selected variant, availability, quantity constraints, primary
purchase action, and material fulfilment information in the first decision
region. Keep description/details readable and progressive. Synchronize media,
URL, price, SKU, selling plan, availability, and button label on variant change.

### Cart

Treat cart as an editable order preview: identity, selected options, quantity,
line price, discounts, subtotal, material estimates, remove/edit, and checkout.
Recommendations remain secondary and must not displace correction or checkout.

## Interaction baseline

- A link navigates; a button performs an action.
- Drawers use dialog semantics, labelled close controls, focus containment, and
  focus restoration.
- Dynamic changes have live-region feedback without chatty announcements.
- Loading preserves geometry; errors preserve recoverable data.
- Motion explains state change and respects reduced-motion preferences.
- Touch targets, zoom/reflow, keyboard order, and visible focus are designed,
  not added after styling.
