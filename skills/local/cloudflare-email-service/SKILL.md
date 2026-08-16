---
name: cloudflare-email-service
description: Send and receive transactional emails with Cloudflare Email Service (Email Sending + Email Routing). Use when building email sending (Workers binding or REST API), email routing, Agents SDK email handling, or integrating email into any app — Workers, Node.js, Python, Go, etc. Also use for email deliverability, SPF/DKIM/DMARC, wrangler email setup, MCP email tools, or when a coding agent needs to send emails. Even for simple requests like "add email to my Worker" — this skill has critical config details.
---

# Cloudflare Email Service

Cloudflare Email Service changes quickly. **Retrieve current Cloudflare documentation before every implementation** and let the live docs/API schema override this convenience guide.

Email Sending entered public Beta on April 16, 2026. Cloudflare's current product page marks outbound Email Sending as Beta and available on the Workers Paid plan. Email Routing is the inbound-routing capability. Re-check status, plan entitlement, limits, and API shape at task time; do not infer general availability from the presence of a binding or REST endpoint.

## Retrieval sources

| Source | Use for |
| --- | --- |
| [Email Service product page](https://developers.cloudflare.com/email-service/) | Current Beta/plan status and capability index |
| [Email Sending setup](https://developers.cloudflare.com/email-service/get-started/send-emails/) | Cloudflare DNS requirement, domain onboarding, current binding/REST/SMTP examples |
| [Email Sending REST API](https://developers.cloudflare.com/email-service/api/send-emails/rest-api/) | Endpoint, request/response shape, errors, links to the live OpenAPI schema |
| [Email Sending public Beta changelog](https://developers.cloudflare.com/changelog/post/2026-04-16-email-sending-public-beta/) | Public Beta timeline |
| Installed Wrangler `--help` and [Wrangler docs](https://developers.cloudflare.com/workers/wrangler/) | Commands actually available in the user's installed CLI |
| [`@cloudflare/workers-types`](https://www.npmjs.com/package/@cloudflare/workers-types) or generated Wrangler types | Current Workers binding signatures |

## First: check prerequisites

Before writing email code:

1. Retrieve the product and setup pages above. Confirm Email Sending is still available to the account's plan and region/status; currently it is Beta on Workers Paid.
2. Confirm the sending domain uses Cloudflare DNS and is onboarded at **Compute > Email Service > Email Sending** in the Cloudflare dashboard. Domain onboarding adds the documented bounce MX and SPF, DKIM, and DMARC records.
3. For a Worker, confirm a `send_email` binding exists and use the project's installed Wrangler version. Do not invent `wrangler email sending ...` commands: inspect that binary's `--help` and current official command reference first.
4. Install or reuse `postal-mime` only when the receiving flow actually parses raw MIME.

## What Do You Need?

Start here. Find your situation, then follow the link for full details.

| I want to... | Path | Reference |
|--------------|------|-----------|
| **Send emails from a Cloudflare Worker** | Workers binding (no API keys needed) | [sending.md](references/sending.md) |
| **Send emails from an external backend** (Node.js, Go, Python, etc.) | REST API with a scoped bearer token | [rest-api.md](references/rest-api.md) |
| **Send emails from a coding agent** | REST API or an installed, documented tool whose live schema exposes Email Service | [cli-and-mcp.md](references/cli-and-mcp.md) |
| **Receive and process incoming emails** (Email Routing) | Workers `email()` handler | [routing.md](references/routing.md) |
| **Onboard Email Sending or Email Routing** | Cloudflare dashboard; use CLI/API only when current official docs or live tool schema exposes the operation | [cli-and-mcp.md](references/cli-and-mcp.md) |
| **Improve deliverability, avoid spam folders** | Authentication, content, compliance | [deliverability.md](references/deliverability.md) |

## Quick Start — Workers Binding

After dashboard onboarding, add the binding to `wrangler.jsonc`, then call `env.EMAIL.send()`.

```jsonc
// wrangler.jsonc
{ "send_email": [{ "name": "EMAIL" }] }
```

```typescript
const response = await env.EMAIL.send({
  to: "user@example.com",
  from: "welcome@yourdomain.com",
  subject: "Welcome!",
  html: "<h1>Welcome!</h1>",
  text: "Welcome!",
});

console.log(response.messageId);
```

The binding is recommended for Workers and returns a `messageId`. It does not require an Email Sending REST API token. If the user specifically requests the REST API from a Worker, follow the current REST API documentation instead.

See [sending.md](references/sending.md) for the full API, batch sends, attachments, custom headers, restricted bindings, and Agents SDK integration.

## Quick Start — REST API

For backends outside Workers, retrieve the current REST guide and linked OpenAPI schema. The current endpoint is `POST https://api.cloudflare.com/client/v4/accounts/{account_id}/email/sending/send`, authenticated by a scoped Cloudflare API token. The documented minimal `from` value is an onboarded email-address string. A successful REST response groups recipients under `delivered`, `permanent_bounces`, and `queued`; it does not return the Workers binding's `messageId`.

Do not carry Workers-only binding types into a REST request. Use the live REST schema for named addresses, `reply_to`, attachments, custom headers, and limits.

See [rest-api.md](references/rest-api.md) for examples and error handling.

## Common Mistakes

| Mistake | Why It Happens | Fix |
|---------|---------------|-----|
| Forgetting `send_email` binding in wrangler config | Email Service uses a binding, not an API key | Add `"send_email": [{ "name": "EMAIL" }]` to wrangler.jsonc |
| Sending from a domain that is not onboarded | Email Sending requires a domain configured in the dashboard | Onboard the Cloudflare DNS domain under **Compute > Email Service > Email Sending** |
| Reading `message.raw` twice in email handler | The raw stream is single-use — second read returns empty | Buffer first: `const raw = await new Response(message.raw).arrayBuffer()` |
| Missing `text` field (HTML only) | Some email clients only show plain text; also helps spam scores | Always include both `html` and `text` versions |
| Using email for marketing/bulk sends | Email Service is for transactional email only | Use a dedicated marketing email platform for newsletters and campaigns |
| Forwarding to an unverified destination | `message.forward()` only works with verified addresses | Verify the destination in the Email Routing dashboard |
| Testing with fake addresses | Bounces from non-existent addresses hurt sender reputation | Use real addresses you control during development |
| Hardcoding API tokens in source code | Tokens in code get committed and leaked | Use environment variables or Cloudflare secrets |
| Ignoring the `from` domain requirement | The `from` address must use a domain onboarded to Email Service | Verify the domain first, then send from `anything@that-domain.com` |
| Using `email` key in REST API `from` object | REST API uses `address` not `email` for `from` object | Use `{ "address": "...", "name": "..." }` for REST, `{ "email": "...", "name": "..." }` for Workers |
| Using `replyTo` in REST API | REST API uses snake_case field names | Use `reply_to` for REST API, `replyTo` for Workers binding |

## References

Read the reference that matches your situation. You don't need all of them.

- **[references/sending.md](references/sending.md)** — Workers binding API, attachments, Agents SDK email. For Workers or Agents SDK.
- **[references/rest-api.md](references/rest-api.md)** — REST endpoint, curl examples, error handling. For apps NOT on Workers.
- **[references/routing.md](references/routing.md)** — Inbound `email()` handler, forwarding, replying, parsing. For receiving emails.
- **[references/cli-and-mcp.md](references/cli-and-mcp.md)** — Domain setup, wrangler commands, MCP tools. For first-time setup.
- **[references/deliverability.md](references/deliverability.md)** — SPF/DKIM/DMARC, bounces, suppressions, best practices.
