# Cloudflare Worker Decisions

## Non-conflict policy

This toolkit must not replace or shadow existing platform-native Cloudflare skills unless the task is specifically about this shared toolkit.

### pi
Prefer these first when applicable:
- `cloudflare-worker-builder`
- `cloudflare-api`
- `hono-api-scaffolder`
- `d1-drizzle-schema`
- `d1-migration`

### Antigravity
Prefer these first when applicable:
- `cloudflare`
- `wrangler`
- `workers-best-practices`
- `durable-objects`

### Claude
Use the local standalone skill as a lightweight router into this toolkit.
Do not duplicate a large plugin stack unless the team later wants shareable packaged plugins.

### Codex
Use global instructions plus repo-level `AGENTS.md` when a specific project needs tighter rules.

## Future maintenance

When Cloudflare patterns change:
1. update the shared docs here first
2. keep adapters thin
3. avoid platform-specific rewrites unless necessary
4. preserve backward compatibility for existing repos where practical
