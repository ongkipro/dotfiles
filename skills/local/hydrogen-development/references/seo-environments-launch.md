# SEO, environments, and launch

Read this reference for Hydrogen SEO routes, Oxygen environment behavior, or a
Liquid-to-Hydrogen launch. It complements `seo-website-builder`, which owns
SEO/indexation strategy and acceptance criteria.

## Route SEO

Use the installed Hydrogen metadata utility and React Router route `meta`
contract. Merge nested route SEO so that the most specific route (for example,
a product) overrides root defaults. Preserve the default canonical behavior
unless a documented indexation requirement proves query parameters belong in a
canonical URL.

Check for existing `sitemap.xml` and `robots.txt` routes before generating
anything. Current scaffold templates can include both. Their cache behavior is
an implementation detail to verify in the installed project, not a reason to
invent a second sitemap or robots response.

Oxygen protects non-production discoverability: a shareable preview or auth
bypass can receive a crawler-disallowing robots response. Preserve that guard;
do not make a preview indexable to test SEO. Verify production HTML metadata,
sitemap, and robots using the public production domain only after authorization.

## Oxygen environments and variables

Oxygen has production, preview, and optional custom environments associated
with Git branches. Variables can differ by environment, and deployments retain
the values that existed when they were built. A variable change may therefore
require an explicitly approved redeployment before it takes effect.

Inspect variable names and environment assignment without reading values.
Keep server-only tokens, session secrets, and private Storefront credentials
out of browser code, Git, logs, and diffs. Do not make a private environment
public or copy variables between environments without an explicit target and
approval.

## Launch and redirect traffic

Treat a Hydrogen launch as a production cutover, not a frontend deployment.
Before changing traffic, confirm the production checklist, public-domain
behavior, Shopify-hosted checkout subdomain, catalog publication to the needed
channels, redirects, canonicals, feeds, notifications, consent, analytics, and
rollback path.

Online Store and Hydrogen can share carts only when relevant products are
published to both channels. If the existing Online Store remains reachable,
evaluate a supported redirect strategy instead of assuming traffic moves
automatically. Domain targets, DNS, password protection, storefront visibility,
and redirect-theme publication are separate live changes requiring explicit
approval.
