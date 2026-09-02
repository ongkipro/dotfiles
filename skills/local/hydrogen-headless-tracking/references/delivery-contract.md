# Tracking delivery contract

Use this reference for a Hydrogen tracking or conversion-signal change. The
installed project and current official Shopify/provider documentation win over
any older example.

## Source map

- [Hydrogen analytics and consent](https://shopify.dev/docs/storefronts/headless/hydrogen/analytics)
- [Hydrogen consent setup](https://shopify.dev/docs/storefronts/headless/hydrogen/analytics/consent)
- [Hydrogen cart attributes](https://shopify.dev/docs/storefronts/headless/hydrogen/cart/attributes)
- [Storefront cart attributes](https://shopify.dev/docs/api/storefront/latest/objects/Attribute)
- [Web Pixels API](https://shopify.dev/docs/api/web-pixels-api)

## Contract before code

For every event, record its trigger, event authority, consent purpose, allowed
data, destination, event-ID/deduplication owner, retry behavior, and evidence.
One logical conversion must have one authoritative business record even when it
is reported to multiple systems.

Hydrogen analytics and Shopify-hosted Web Pixels are separate integrations.
Web Pixels are sandboxed and provider scripts may have different CORS, storage,
and consent behavior. Use each surface's official contract rather than moving
code between them.

## Cart attribution

Cart attributes are string key/value pairs. They can carry to the resulting
order and are visible to a buyer at checkout by default. An underscore-prefixed
attribute is hidden at checkout, but hiding is not a privacy or security
control. Do not place personal data, tokens, or sensitive identifiers there.

## Server events and webhooks

Use server-side processing for secrets, provider delivery, and durable
idempotency. Verify each provider's current signature and event contract. For
Shopify webhooks, verify the raw request before parsing; process retries and
duplicates without repeating an external conversion or other side effect.

## Evidence

Prove consent suppression, permitted event emission, data minimization,
deduplication behavior, and effective CSP in the relevant authorized test
environment. Provider dashboards and a production checkout are operational
evidence, not safe local-test substitutes.
