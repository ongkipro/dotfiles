# Cloudflare Worker Toolkit

Shared source of truth for Cloudflare Worker work across all local AI CLIs.

## Goals

- Keep one durable playbook for future Cloudflare Worker work
- Avoid duplicating logic across Claude, pi, Codex, and Antigravity
- Avoid conflicts with existing built-in or already-installed Cloudflare skills
- Prefer native platform skills first, then use this toolkit as the orchestration layer

## Layout

- `PLAYBOOK.md` — primary workflow and decision guide
- `CHECKLISTS.md` — repeatable delivery and review checklists
- `TEMPLATES.md` — starter patterns and file skeletons
- `DECISIONS.md` — rules to keep future work consistent
- `TRIGGERS.md` — trigger phrases to improve auto-activation
- `AGENTS_TEMPLATE.md` — repo-level snippet for stronger project guidance

## Adapter strategy

This toolkit is consumed by thin wrappers only:

- `~/.claude/skills/cloudflare-worker-toolkit/`
- `~/.agents/skills/cloudflare-worker-toolkit/`
- `~/.gemini/skills/cloudflare-worker-toolkit/`
- `~/.codex/instructions.md`

Each wrapper should:

1. Prefer the platform's native Cloudflare skills/features
2. Read these shared docs before making structure decisions
3. Read `TRIGGERS.md` to improve auto-activation behavior
4. Avoid redefining commands or patterns already handled by native skills
5. Defer to current Cloudflare docs when limits, flags, or APIs may have changed
