---
name: cloudflare-pages-direct-upload-lock
description: Cloudflare Pages Direct Upload and Git integration are distinct setup paths; verify current project mode before changing deployment architecture
metadata:
  node_type: memory
  type: reference
  originSessionId: c3f8226f-2597-439c-858d-b7cd1ef35d53
  modified: 2026-07-30T17:35:06.199Z
---

Cloudflare Pages deployment mode is an architectural choice, not an interchangeable
CLI flag. The official Direct Upload flow uses `wrangler pages project create` and
`wrangler pages deploy`; Git integration is created by connecting a GitHub or GitLab
repository through Cloudflare's authorization flow.

Cloudflare's current known-issues documentation explicitly says a Git-integrated
project cannot switch to Direct Upload later. The documentation does not make the
same explicit permanence claim in the reverse direction, so do not overstate it;
verify current docs and the actual project before planning a migration.

**How to apply:** when push-to-deploy is required, do not create or deploy a Pages
project with Wrangler as an improvised first release. Stop for approval, verify the
project's mode in the dashboard, and use **Connect to Git** for a new Git-integrated
project. Deleting or replacing a live Pages project remains destructive.

For read-only Wrangler checks in an interactive terminal, remove stale token variables
rather than assigning empty values:

```bash
env -u CLOUDFLARE_API_TOKEN -u CF_API_TOKEN wrangler pages project list
```

Wrangler may require an API token in non-interactive environments even when local OAuth
exists; CI credentials must come from the CI secret store. Treat historical project
inventory in memory as stale unless it is re-verified against the account.

See [[cf-api-token-hijacks-wrangler]] for the authentication precedence trap.
