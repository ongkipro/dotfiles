# Shopify-hosted Web Pixels

Web Pixels run in Shopify-controlled sandboxes and subscribe to Shopify
customer events. They are distinct from the Hydrogen storefront runtime and
from server-side webhook/conversion processing.

## Choose the pixel surface

- **App Web Pixel:** strict sandbox. Register with
  `@shopify/web-pixels-extension`; the Standard API provides `analytics`,
  constrained `browser` access, render-time `init`, and app-managed `settings`.
- **Custom Pixel:** lax sandbox configured in Shopify Admin. The available
  developer interface exposes `analytics`, `browser`, and `init`; it has no
  `settings` property.

Do not assume direct DOM access, ordinary top-frame storage, Hydrogen session
state, or a secret-bearing environment in either pixel surface.

## Event and consent contract

Prefer documented standard customer events for stable analytics requirements.
Subscriptions such as `all_events`, `all_standard_events`,
`all_custom_events`, and DOM-event variants are useful for diagnostics but are
not a durable event schema because their contents can change.

Before emitting to an external vendor, establish consent, allowed fields,
event ID/deduplication ownership, and the checkout/storefront boundary. Never
use a pixel as the sole Purchase source when an accepted server-authoritative
record exists.

## Verification

Verify in the appropriate Shopify pixel/event tooling and in a real checkout
flow when authorized. Confirm that consent changes suppress or permit only the
intended emissions. Do not inspect customer data or alter pixel configuration
without explicit approval.
