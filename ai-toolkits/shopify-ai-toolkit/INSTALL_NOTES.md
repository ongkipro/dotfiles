# Shopify AI Toolkit Install Notes

## Official repo

`https://github.com/Shopify/Shopify-AI-Toolkit`

## Observed support from upstream README

- Claude Code: supported via plugin install
- Gemini CLI: supported via extension install
- OpenAI Codex: supported via plugin flow in `/plugins`
- Cursor / VS Code: also supported

## Local machine state at analysis time

- Claude Code installed
- Codex CLI installed
- Shopify CLI installed
- Antigravity present instead of plain Gemini CLI
- official Shopify AI Toolkit not yet installed locally

## Recommendation

Do not clone or rename upstream skill names into local personal skills yet.
That would create maintenance drift and possible collisions later.
Use this local router now, then install the official toolkit when you want the full validated Shopify dev workflow.

## Extra upstream repos reviewed

These should **not** be installed as separate local skills right now:

- `Shopify/theme-liquid-docs` — data and schema source for Liquid/theme docs; useful as a reference repo, not a separate end-user skill install
- `shopify/cli` — source repo for Shopify CLI; local CLI is already installed on this machine, and the official toolkit already includes a Shopify CLI-oriented skill
- `Shopify/liquid` — Liquid engine source repo; useful as a reference for Liquid internals, not a separate skill install for normal Shopify app work

So the install target, when needed, is the **official Shopify AI Toolkit**, not these supporting repos.

## Client install model

- **Claude Code**: best installed as the official plugin, not copied manually into `~/.claude/skills`
- **Codex**: best installed through Codex plugin flow, not by copying individual skills
- **Antigravity**: upstream documents Gemini extension install, but this machine currently has Antigravity rather than plain Gemini CLI; keep the local router for now unless we explicitly verify extension compatibility

These do **not** all auto-connect from one install. Each client has its own plugin/extension mechanism.

## Privacy

Upstream README and skill files indicate telemetry is on by default.
For sensitive work, set:

```bash
OPT_OUT_INSTRUMENTATION=true
```

before using the official toolkit.
