---
name: cf-api-token-hijacks-wrangler
description: "A stale CF_API_TOKEN can override Wrangler OAuth; unset token variables for interactive OAuth checks instead of assigning empty values"
metadata:
  node_type: memory
  type: reference
  originSessionId: c3f8226f-2597-439c-858d-b7cd1ef35d53
  modified: 2026-07-30T17:34:58.829Z
---

A stale, zone-scoped `CF_API_TOKEN` previously overrode Wrangler's OAuth session and
caused false 403 responses for account-level Pages and Workers APIs. The variable is
not currently exported on the Mac as of 2026-08-05, and `wrangler whoami` succeeds
with OAuth in an interactive terminal.

Wrangler treats an explicitly empty token as an authentication choice, so assigning
`CLOUDFLARE_API_TOKEN=` or `CF_API_TOKEN=` is **not** a safe workaround: it can turn a
valid OAuth session into `Not logged in`. Remove the variables from the command
environment instead:

```bash
env -u CLOUDFLARE_API_TOKEN -u CF_API_TOKEN wrangler whoami
```

Use the same prefix for other interactive Wrangler commands if the variables reappear.
In non-interactive CI, provide a correctly scoped `CLOUDFLARE_API_TOKEN` through the
platform's secret store; do not depend on local OAuth state.

Cloudflare's current Wrangler documentation lists `CLOUDFLARE_API_TOKEN` as the
supported variable and `CF_API_TOKEN` as deprecated. Never read, print, or copy the
OAuth token file into prompts, memory, scripts, or repository content.
