# Official integrations

Use this reference only when the task needs a current platform fact or an AI
host integration decision. Prefer the linked primary source over memory.

## Hydrogen framework versus developer preview

- The current Hydrogen framework is React Router based. For a new app, use
  the command shown by the current [Hydrogen documentation](https://shopify.dev/docs/api/hydrogen).
- The upstream [Hydrogen repository](https://github.com/Shopify/hydrogen)
  is the implementation source for the official generator and packages. Its
  standard skeleton currently combines React Router, Hydrogen, Oxygen, Vite,
  Shopify CLI, GraphQL code generation, and local Mini Oxygen. Treat that as
  a current scaffold baseline, not a mandate to rewrite an existing app.
- The [Hydrogen developer preview](https://shopify.dev/docs/storefronts/headless/developer-preview)
  is a separate, framework-agnostic SDK direction. Do not mix its setup or
  APIs into an installed React Router Hydrogen project without an explicit
  migration decision and verified compatibility.

## Generated contracts and versioning

The upstream project ties Hydrogen and `hydrogen-react` releases to specific
[Storefront API](https://shopify.dev/docs/api/storefront) and Customer Account
API versions. API-version upgrades can therefore be framework upgrades too.
Inspect the installed lockfile, package manifest, and generated artifacts as a
unit; do not change a GraphQL endpoint/version independently.

The current skeleton's GraphQL configuration separates Storefront documents
from Customer Account documents and its local scripts run Hydrogen codegen plus
React Router type generation. When an installed project follows that pattern:

- change source documents, not generated declaration files;
- run its `codegen` script after a query or API-version change;
- run its `typecheck` script after generation; and
- preserve `hydrogenPreset()` in React Router configuration unless the runtime
  migration is an explicit accepted task.

The generator, Node engine range, scripts, and file layout can change. The
generated project's manifest is authoritative for that project; do not derive
runtime requirements from an older README or another storefront.

## Shopify AI Toolkit

[Shopify AI Toolkit](https://github.com/Shopify/Shopify-AI-Toolkit) provides
current documentation/API schema access and code validation for supported AI
hosts. It is host tooling, not an application dependency.

When a user explicitly authorizes installation, follow the toolkit's current
host-specific instructions rather than guessing a command. Confirm the host
and inspect the install result before relying on it. The Toolkit documents
[usage telemetry and opt-out behavior](https://github.com/Shopify/Shopify-AI-Toolkit/tree/main/hooks);
do not enable or disable telemetry implicitly.

For an installed Toolkit, use its schema/doc tools to validate Shopify-specific
code or discover CLI commands. Do not treat a plugin response as authorization
for store mutations, credential access, sales-channel changes, or deployment.

## UCP is not a Hydrogen default

[`@shopify/ucp-cli`](https://github.com/Shopify/ucp-cli) supports Universal
Commerce Protocol catalog, cart, checkout, and order flows for agents. It is
not required to scaffold, run, deploy, or operate a conventional Hydrogen
storefront. Load it only when the accepted work is explicitly agentic commerce
or a UCP merchant integration; keep its credentials and merchant operations
outside the Hydrogen browser runtime.
