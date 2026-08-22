# Official sources and freshness

Use the primary Shopify source that governs the capability. Community reports
are useful for finding edge cases, but never establish entitlement, a limit, or
a security claim from them alone.

| Need | First source |
|---|---|
| Headless channel, credentials, routes | Shopify Headless / Bring your own stack docs |
| Catalog, Cart, checkout URL, tokens | Storefront API reference and Cart guides |
| Customer login/accounts | Customer Account API docs |
| API lifecycle and limits | Shopify API versioning and usage limits |
| Cache/data loading | Hydrogen caching and performance docs, or runtime docs for custom stack |
| Consent | Customer Privacy API docs |
| Attribution/pixels | Web Pixels API and Shopify analytics docs |
| Checkout capability | Checkout technologies and target-specific extension docs |
| Platform changes | Shopify developer changelog |

At the time this skill was refreshed, Shopify documents quarterly stable API
versions with at least 12 months of support. Do not hard-code version names,
quotas, plan eligibility, release dates, or deprecated behavior from this file;
retrieve the current official page before taking action.

Research community GitHub issues, Shopify Community posts, and production
maintainer discussions only after official documentation establishes the
platform boundary. Record the source as anecdotal and convert it into a
reproducible project probe before changing architecture or declaring a defect.
