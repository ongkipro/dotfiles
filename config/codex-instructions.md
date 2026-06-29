# Global Codex guidance for Cloudflare Worker work

When a task involves Cloudflare Workers, Wrangler, Hono on Workers, D1, KV, R2, Queues, or Durable Objects:

1. Read `~/.ai/cloudflare-worker-toolkit/README.md`
2. Read `~/.ai/cloudflare-worker-toolkit/TRIGGERS.md`
3. Read `~/.ai/cloudflare-worker-toolkit/PLAYBOOK.md`
4. Use `~/.ai/cloudflare-worker-toolkit/CHECKLISTS.md` during implementation/review
5. Prefer current Cloudflare docs over memory for changing details
6. Preserve the repository's existing Cloudflare structure unless explicitly asked to refactor
7. Report config changes, binding changes, validation run, and manual follow-ups

For project-specific overrides, also respect repo `AGENTS.md` files if present.

When a task involves Shopify app development, Shopify CLI, Shopify GraphQL, Hydrogen, Functions, Liquid theme code, app/extension TOML validation, or Shopify extensions:

0. Consult the repo map FIRST: `~/Documents/shopify-ai-development-repos.md` (theme→horizon/dawn+theme-tools; app→@shopify/cli+app templates+shopify-app-js; extension→ui-extensions+function-examples). Do NOT clone Shopify repos unless explicitly asked; prefer official Shopify repos/docs over guesses.
1. Read `~/.ai/shopify-ai-toolkit/README.md`
2. Read `~/.ai/shopify-ai-toolkit/TRIGGERS.md`
3. Read `~/.ai/shopify-ai-toolkit/DECISIONS.md`
4. Read `~/.ai/shopify-ai-toolkit/INSTALL_NOTES.md`
5. Prefer the official Shopify AI Toolkit if it is installed later
6. Keep Shopify store-operation workflows separate from Shopify app-dev workflows
7. If recommending the official toolkit, mention the upstream telemetry-default behavior and the `OPT_OUT_INSTRUMENTATION=true` escape hatch
