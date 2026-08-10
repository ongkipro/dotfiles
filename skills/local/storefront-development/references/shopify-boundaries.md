# Shopify Boundaries

Retrieve current Shopify documentation and inspect the installed API version
before implementation.

## Hosted Liquid theme

- Use Liquid product forms as the functional base.
- Use locale-aware `window.Shopify.routes.root` URLs for Ajax requests.
- Use the Ajax Cart API only for Shopify-hosted themes.
- Prefer bundled section rendering when a cart mutation must refresh cart items,
  icon count, live-region text, or footer; account for a successfully applied
  mutation whose requested section HTML is `null`.
- Use line keys for updates when the same variant can appear as distinct lines.
- Keep sections/blocks merchant-configurable without exposing implementation
  noise or hundreds of meaningless settings.
- Validate with `shopify theme check`, then `shopify theme dev` and browser proof.
  Theme push/publish remains a production approval gate.

Dawn is a reference, not a stable component API. Inspect the current repository
before copying product form, variant picker, cart drawer, focus, or live-region
patterns. For a new theme, compare current Horizon and Skeleton guidance too;
do not assume Dawn is Shopify's newest scaffold.

## Headless Shopify

- Use the Storefront Cart API, never the theme Ajax API.
- Use public Storefront tokens only for permitted client-side operations; keep
  private Storefront and all Admin tokens server-only.
- Treat GraphQL `userErrors` as domain outcomes, not successful mutations.
- Keep buyer identity/market context consistent with displayed pricing.
- Request a current `checkoutUrl` when the buyer is ready to leave for checkout;
  re-request stale URLs.
- Treat the secret portion of modern cart IDs like a password. Do not put it in
  shareable URLs, public markup, client analytics, or logs.
- Use Shopify-hosted checkout to complete payment.

## Checkout customization

Do not implement a custom payment/checkout page because the storefront uses
Shopify. Checkout customization is constrained to supported branding, Functions,
pixels, and extension targets. Checkout UI extensions run in an isolated
environment using Shopify-provided APIs/components. Information, shipping, and
payment-step UI extensions require Shopify Plus; verify plan and target support
before promising a design.

Do not claim a checkout extension can access arbitrary DOM, CSS, buyer data, or
network capability. Retrieve the target-specific API and capability docs for the
configured version.
