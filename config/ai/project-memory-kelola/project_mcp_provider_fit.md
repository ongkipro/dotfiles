---
name: mcp-provider-fit
description: "Which external MCP providers are compatible with Kelola's MCP client (single static header limitation)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 11780130-c3bb-44ae-93b9-3d590a48c147
---

Kelola's MCP client (Settings → Integrasi → Server MCP) supports **only ONE static auth header** (key+value, stored encrypted) and **Streamable HTTP** transport (SSE not supported). This constrains which hosted MCP providers fit:

- **Zapier MCP** ✅ compatible — server URL is self-authenticating (secret embedded in the URL, e.g. `https://mcp.zapier.com/api/mcp/s/.../mcp`), no extra headers. Streamable HTTP. Free tier: 100 tasks/mo, 1 tool call = 2 tasks (~50 calls/mo free). **This is the recommended free option.**
- **Pipedream MCP** ❌ NOT compatible as-is — developer-oriented: requires OAuth client-credentials Bearer token (expires, needs refresh) PLUS 4 headers (`x-pd-project-id`, `x-pd-environment`, `x-pd-external-user-id`, `x-pd-app-slug`). Endpoint `https://remote.mcp.pipedream.net/v3`. Would need Kelola to support multi-header + OAuth token refresh.
- **Composio / product MCPs (GitHub PAT, etc.)** — not yet verified; GitHub via static PAT (`Authorization: Bearer <PAT>`) likely fits the single-header model; OAuth-only ones (Sentry, Notion) likely don't.

**Why:** decided to hold ("pending dulu") on 2026-06-03 after finding Pipedream needs multi-header/OAuth. **How to apply:** if user wants to add a provider, steer to single-static-header/self-auth-URL ones (Zapier) unless we first build multi-header + token-refresh support. See [[project-repliz-integration-location]].
