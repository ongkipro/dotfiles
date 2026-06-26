# UI and Islands

## Use no hydration by default

Astro's advantage is static HTML first.

## Good island candidates

- mobile navigation
- search/filter widgets
- booking/contact forms with client validation
- tabs/accordion if progressive enhancement is useful
- charts or dashboards

## Hydration guidance

- `client:load` for immediately interactive UI
- `client:idle` for lower-priority interactivity
- `client:visible` for below-the-fold widgets
- avoid hydrating entire large sections when only one control is interactive

## Practical rule

If a component only renders content and links, keep it `.astro` and static.
