---
name: hydrogen-headless-tracking
description: >-
  Implement, audit, or troubleshoot consent-aware analytics and advertising
  signals for Shopify Hydrogen. Use for Hydrogen analytics, Shopify-hosted Web
  Pixels, cart-to-checkout attribution, provider browser/server events, and
  purchase webhook evidence. Not for ordinary storefront UI, generic SEO, or
  pixel configuration changes without explicit approval.
---

# Hydrogen Headless Tracking

Build an auditable event path across three separate surfaces: the Hydrogen
storefront, Shopify-hosted pixels/checkout, and a server-side provider or
webhook consumer. Do not collapse them into one browser-runtime assumption.

## Inspect the accepted event contract first

Identify the business objective, provider, event names, source of truth for
each event, consent purpose, allowed fields, retention, merchant/store scope,
cart and checkout domains, current analytics implementation, CSP, webhook
receiver, deduplication store, and tests. Do not print credentials or customer
data.

Read [Tracking delivery contract](references/delivery-contract.md) for all
tracking work. Read [Shopify-hosted Web Pixels](references/web-pixels.md) for
an App Pixel or Custom Pixel. Retrieve current official provider documentation
before using its event fields, hashing rules, deduplication window, endpoint,
or API version.
Read [Shopify analytics cookie migration](references/shopify-analytics-cookie-migration.md)
when an existing Hydrogen integration reads or depends on Shopify visitor or
session cookies.

## Keep execution surfaces separate

- **Hydrogen storefront:** owns server-rendered commerce interactions and its
  supported analytics/consent integration. Keep client enhancement optional.
- **Shopify-hosted checkout and Web Pixels:** run in Shopify-controlled
  sandboxes. Use only their documented APIs; do not reuse Hydrogen session or
  DOM assumptions.
- **Server processing:** owns provider credentials, webhook signature checks,
  durable deduplication, retry policy, and protected logs. A browser redirect
  or thank-you page is never authoritative purchase evidence by itself.

## Privacy, attribution, and purchase evidence

Send no marketing or analytics signal before the accepted consent condition is
met. Minimize event data to the documented provider requirement and never put
secrets, raw payment data, or unnecessary customer data in browser state, URLs,
cart attributes, client logs, or analytics payloads.

Cart attributes can carry into an order after checkout and are visible at
checkout by default. Use them only for an explicitly approved, consented, and
non-sensitive attribution contract; use the platform's supported private
convention when checkout visibility is inappropriate. Never use cart
attributes as a secret store or assume they make attribution complete.

For provider browser/server pairs, generate one deterministic event identifier
per logical event only when the current provider contract supports it. Verify
deduplication in that provider's tooling; do not assert match-quality scores,
cookie lifetimes, or delivery percentages in code or handoff evidence.

## Secure server-side processing

Verify Shopify webhook signatures over raw request bytes before parsing or
performing a side effect. Bind the event to the expected shop/topic, persist a
provider delivery identifier behind durable uniqueness, and make retries and
duplicates safe. Store provider secrets server-side and use the real proxy
trust boundary for IP/client metadata; never trust a client-submitted event as
purchase authority.

Keep CSP minimal and project-specific. Include the verified storefront and
checkout domains required by the installed Hydrogen consent integration, then
add only exact provider hosts that the accepted integration needs. Verify the
effective response header in a browser; do not broaden wildcard sources to
make a vendor script work.

## Verify the complete path

Run the project checks, then exercise the relevant storefront interaction in a
browser with consent both denied and granted. For checkout/pixel or webhook
work, verify only in an authorized test environment:

1. expected events appear once with the allowed fields only;
2. denied consent suppresses the intended non-essential signal;
3. cart-to-checkout handoff preserves only the accepted data;
4. an invalid or duplicate webhook has no repeated side effect; and
5. browser console and effective CSP have no integration violation.

Record unavailable provider, checkout, or production checks as `UNVERIFIED`.
Do not alter Shopify Customer Events, pixel settings, webhooks, sales-channel
configuration, provider settings, or production data without explicit approval.
