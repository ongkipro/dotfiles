# CLI, Tool, and Project Setup

Cloudflare Email Service has a REST API and Workers bindings, but resource names do not imply matching Wrangler or MCP commands. Never fabricate a command tree from an API path.

## Source-of-truth order

1. Retrieve [Email Service setup](https://developers.cloudflare.com/email-service/get-started/send-emails/) and the current [Wrangler command reference](https://developers.cloudflare.com/workers/wrangler/).
2. Use the project's installed Wrangler binary and inspect its top-level `--help`. Only use an email subcommand if that exact binary lists it.
3. For MCP or another coding-agent tool, inspect the connected server's live tool/resource schema. Do not assume generic `search`, `execute`, `cloudflare.request`, quota, or send-email operations exist.
4. When no documented CLI/tool operation exists, use the Cloudflare dashboard for onboarding or the documented REST API for sending.

## Account and domain prerequisites

Email Sending is currently public Beta on the Workers Paid plan and requires Cloudflare DNS. Re-check those facts on the [product page](https://developers.cloudflare.com/email-service/) before setup.

In the dashboard:

1. Go to **Compute > Email Service > Email Sending**.
2. Select **Onboard Domain** and choose a domain from the Cloudflare account.
3. Review the bounce MX plus SPF, DKIM, and DMARC records Cloudflare will add.
4. Wait for onboarding to complete before sending from that domain.

Do not replace this flow with an undocumented `wrangler email sending enable` or `dns get` command.

## Workers local development

The current setup guide uses a remote binding so local `wrangler dev` can call the real Email Service:

```jsonc
{
  "send_email": [
    {
      "name": "EMAIL",
      "remote": true
    }
  ]
}
```

Run the project's installed Wrangler command. For an npm project whose local dependency exposes Wrangler:

```bash
npx wrangler dev
```

Remote development sends real email. Use addresses you control, preserve service errors, and do not treat a local invocation as a mock.

## Sending from an external backend or agent

Use the documented REST endpoint when the current CLI or connected tool does not expose sending:

```bash
curl "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/email/sending/send" \
  --header "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "to": "developer@company.com",
    "from": "agent@yourdomain.com",
    "subject": "Deployment Complete",
    "text": "Your Worker was deployed successfully."
  }'
```

The token must have the permission documented by the current API reference, and the sender domain must be onboarded on the same account. Keep the token in a secret store or environment; never print it or paste it into source.

## Tool failure

If help output or a live MCP schema does not contain the requested operation, stop and say the operation is unavailable through that tool version. Do not substitute a plausible command. Offer the dashboard or the current REST/SMTP path documented by Cloudflare.
