# New Hydrogen storefront start

Use this reference only for a new Hydrogen project. The generator's current
prompts, generated manifest, and official documentation are authoritative;
their Node/runtime requirements can change independently of older tutorials.

## Choose the smallest start mode

| Mode | Purpose | Shopify connection | Approval boundary |
| --- | --- | --- | --- |
| Mock.shop quickstart | Learn or validate the scaffold locally | None | Development authorization and an approved destination |
| Custom generator flow | Create a project for a defined product | Optional until linked | Development authorization and an approved destination |
| Link a real store | Use a merchant's products and storefront | Authenticates and can create/select a Hydrogen storefront | Explicit approval before authentication or store changes |
| Oxygen preview | Validate a built artifact on Oxygen | Creates an external deployment | Explicit deployment approval |

## Scaffold locally

Use the official generator. `npm create @shopify/hydrogen@latest -- --quickstart`
is appropriate only for a disposable Mock.shop evaluation; it chooses a set of
recommended defaults. Drop `--quickstart` when route, language, styling, or
other project choices must be made intentionally.

The generated route map is a starting template, not a product contract. Inspect
the generated files and its `package.json` before editing. Use the project's
own install and development scripts, then open the local app in a browser. A
Mock.shop run proves scaffold behavior only; it does not prove merchant data,
Customer Accounts, checkout, Markets, or production readiness.

## Link a real Shopify store

Do not run `shopify hydrogen link` or an equivalent link workflow until the
user explicitly approves the named store and intended storefront. Linking can
authenticate a Shopify account and create or select a Hydrogen storefront.

Environment synchronization such as `shopify hydrogen env pull` can write
Storefront and Customer Account credentials into local environment files. Do
not print a diff, values, or file contents; keep credentials out of Git and
use the repository's approved secret workflow. Before running it through an AI
tool shell, verify the CLI redacts values in captured output; otherwise have
the user run it in their local terminal and share only non-sensitive status.
After linking, prove the local app shows the intended non-sensitive catalog
data and retain the generated environment contract rather than inventing
variable names.

## Deploy only when approved

An Oxygen preview deployment is an external deployment, even when it is not a
production promotion. Run the project's build first. Deploy only after explicit
approval of the target/environment, then open the returned preview URL and
verify the requested route. A successful preview is evidence for that build,
not authorization to publish, attach domains, change a sales channel, or
promote production.

## AI Toolkit

Shopify AI Toolkit is optional host tooling, not a prerequisite for a local
quickstart. Its installation command differs by host. Follow the current
official host-specific instructions only after explicit approval; do not pipe
scaffolding, plugin installation, environment synchronization, and deployment
together.
