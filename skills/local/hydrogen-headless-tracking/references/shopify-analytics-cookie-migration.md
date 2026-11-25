# Shopify analytics cookie migration

Shopify deprecated the `shopify_y` unique-visitor and `shopify_s` session
cookies on April 30, 2026. Do not read, copy, or synthesize either cookie in a
Hydrogen integration.

This applies to Classic Hydrogen (2026-04 and earlier), where the fix is the
upgrade to the latest minor of the installed line. In `2026.10+` there is
nothing to migrate: the Storefront API proxy expires leftover `_shopify_y` and
`_shopify_s` cookies it sees, and `getTrackingValues()` supplies `uniqueToken`
(replaces `_y`) and `visitToken` (replaces `_s`). Outside Hydrogen, a Web Pixel
gets the visitor ID from `event.clientId`, and Shopify offers no replacement
for `_s`.

For an affected installed project, first identify its Hydrogen generation and
hosting model. Upgrade only after checking the installed version's release
guidance and project compatibility; do not run a global or automatic upgrade.
On non-Oxygen hosts, ensure the installed Hydrogen web-standard request handler
and context setup preserve the headers/cookies its current version requires.

Use Hydrogen's supported tracking utilities for the equivalent visitor/session
values rather than browser-cookie access. Validate with consent both denied and
granted: Shopify tracking telemetry should be absent without tracking consent
and present only with the expected current payload when consent permits it.
Never treat a particular telemetry payload field or browser cookie as a stable
public contract; retrieve current official docs before diagnosing it.
