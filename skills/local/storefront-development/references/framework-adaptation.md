# Framework Adaptation

Use the installed framework and commerce backend. The same journey contract
must survive each rendering model.

## Astro

Render catalog, collection, and product content as server/static HTML. Hydrate
only variant/media controls, predictive search, cart, and other true interaction.
Keep one cart owner; do not create separate islands with independent cart state.
Use server routes or Actions when a private token or secret cart identifier must
remain off the client. Load `astro-development` for adapter/runtime decisions.

## Next.js App Router

Render SEO/catalog content in Server Components and keep variant/cart leaves
client-side only where state/events require it. Perform private-token commerce
calls on the server. Define cache/revalidation by data volatility: content can
cache; inventory, buyer-specific price, and cart mutations cannot inherit a
static assumption. Authorize customer/account operations on the server.

## Vite + React

Use when an API or commerce platform already owns the server boundary. Keep one
cart store/provider and persist only the minimum identifier needed to restore
the cart. Do not place private commerce credentials in `VITE_*` variables; those
are exposed to the browser. Preserve crawlable server-rendered/public HTML when
SEO matters—plain SPA rendering is an explicit tradeoff, not a default.

## Shopify Liquid

Use sections, blocks, snippets, JSON templates, product forms, Ajax API, and
Section Rendering instead of rebuilding theme primitives in a client framework.
Use JavaScript as progressive enhancement and keep theme-editor events in mind
during development.

## Hydrogen

Use the installed Hydrogen conventions and official current guidance rather
than generic Storefront GraphQL wrappers. Inspect its cart/session primitives
before adding state or fetch abstractions.

## Other commerce backends

Map product/variant, price, availability, cart line, buyer context, checkout
session, order confirmation, and errors explicitly. Never assume Shopify field
names or checkout capabilities apply. Keep payment data inside the provider's
hosted/approved surface.
