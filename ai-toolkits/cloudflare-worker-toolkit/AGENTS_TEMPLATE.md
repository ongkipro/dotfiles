# Project AGENTS.md snippet for Cloudflare Worker repos

Copy this into a repo-level `AGENTS.md` when you want Codex and other agentic tools to follow the shared Cloudflare Worker playbook more strongly.

```md
## Cloudflare Worker project guidance

When working on this repository:

1. Read `/home/fantastico/.ai/cloudflare-worker-toolkit/PLAYBOOK.md`
2. Use `/home/fantastico/.ai/cloudflare-worker-toolkit/CHECKLISTS.md`
3. Preserve the existing Worker structure unless explicitly asked to refactor
4. Prefer current Cloudflare docs over memory for Wrangler flags, bindings, and limits
5. After binding changes, regenerate types if the project uses Wrangler type generation
6. In final summaries, always state config changes, binding changes, validation, and manual follow-ups
```
