---
name: cloudflare-worker-toolkit
description: Shared Cloudflare Worker workflow router for this machine. Automatically use when the user mentions Cloudflare Workers, Wrangler, Hono on Workers, D1, KV, R2, Durable Objects, Queues, worker bindings, wrangler.jsonc, deploy worker, build worker API, review worker code, migrate Worker config, fix Cloudflare Worker issues, or Indonesian/mixed phrases like bikin worker, buat worker, deploy ke cloudflare, tambah D1, tambah KV, tambah R2, benerin wrangler, review code worker. Prefer the existing pi Cloudflare skills first, while keeping future-proof consistency across local AI CLIs.
---

# Cloudflare Worker Toolkit

Auto-activate this skill for Cloudflare Worker work, especially when the request includes terms like Worker, Wrangler, D1, KV, R2, Durable Objects, Queues, Hono, bindings, deploy, migration, routes, or `wrangler.jsonc`.

## Prefer existing pi skills first

Use these first when they directly match the task:
- `cloudflare-worker-builder`
- `cloudflare-api`
- `hono-api-scaffolder`
- `d1-drizzle-schema`
- `d1-migration`

## Shared docs

Read these before making Cloudflare Worker architecture decisions:
- `/home/fantastico/.ai/cloudflare-worker-toolkit/README.md`
- `/home/fantastico/.ai/cloudflare-worker-toolkit/TRIGGERS.md`
- `/home/fantastico/.ai/cloudflare-worker-toolkit/PLAYBOOK.md`
- `/home/fantastico/.ai/cloudflare-worker-toolkit/CHECKLISTS.md`
- `/home/fantastico/.ai/cloudflare-worker-toolkit/DECISIONS.md`

## Rules

- Do not shadow or redefine the existing pi Cloudflare skills
- Use this skill as a routing and consistency layer
- Prefer current Cloudflare docs and local project conventions
- Final answers should state config changes, binding impact, validation, and manual follow-ups
