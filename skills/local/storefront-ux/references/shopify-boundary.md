# Shopify storefront boundary

Read this reference only when the storefront uses Shopify. Verify current capabilities against the project's installed packages, theme/app code, and official Shopify documentation before naming an API, field, limit, or checkout behavior.

## Boundary model

- Treat catalog presentation and cart interaction as storefront concerns; treat checkout completion, order creation, payment, and platform-controlled authentication surfaces as Shopify boundaries unless the verified architecture says otherwise.
- Identify the architecture first: Liquid theme, Hydrogen/headless, embedded/app extension, or a mixed storefront. Do not transfer an implementation pattern between them by assumption.
- Treat checkout customization as plan-, surface-, and extension-dependent. Specify the user outcome first, then verify whether Shopify exposes the required extension point.
- Do not recreate Shopify-owned checkout, payment, tax, or order-finalization logic in storefront code.

## Product and variant behavior

- Determine option and variant availability from the actual product model. Do not synthesize variant combinations that do not exist.
- Keep selected variant, URL state, price, compare-at price, media, selling plan, availability, quantity rules, and add-to-cart payload aligned.
- Distinguish product unavailable, variant sold out, market-unpublished, and request failure; they require different recovery paths.
- Verify whether inventory quantity is intentionally exposed. Prefer truthful availability states over invented exact stock or urgency.

## Cart and checkout handoff

- Use the project's existing cart mechanism and identifiers. Do not invent mutation names or mix theme-cart and Storefront API conventions.
- Revalidate cart lines and totals from Shopify responses after every mutation; optimistic UI must roll back or reconcile visibly.
- Verify buyer identity, market/country, currency, selling-plan, discount, and cart-attribute persistence before relying on them across checkout.
- Treat the checkout URL as a handoff, not an order confirmation. Prevent duplicate creation/navigation and retain a retryable storefront state when handoff fails.
- Never send customer, checkout, or payment-sensitive values to analytics merely because they are available in storefront state.

## Markets, localization, and account

- Do not equate locale with Shopify Market or currency. Verify how country/market selection affects catalog, pricing, duties, availability, and cart validity.
- Preserve or explain cart changes caused by switching country, currency, or market.
- Identify the active customer-account model and its platform-owned flows before specifying sign-in, return URL, order history, or session behavior.

## Validation questions

1. Which storefront architecture and Shopify surfaces are actually in use?
2. Which code owns product selection, cart state, buyer identity, and checkout navigation?
3. Which prices, inventory states, promotions, and totals come back from Shopify versus local presentation logic?
4. What changes when market, country, currency, locale, or customer state changes?
5. Which checkout/account surfaces can this project customize today?
6. Which analytics events are emitted client-side, server-side, or by Shopify, and how are duplicates prevented?
