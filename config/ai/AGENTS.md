# Shared Memory — Cross-CLI Conventions

> Loaded into: claude / codex / antigravity(`agy`) via symlink, pi (via `pi()` wrapper).
> Stack AI CLI resmi = **claude, codex, pi, agy**. Gemini CLI sudah dihapus (2026-07-13) — stack Gemini dipakai lewat Antigravity. Jangan install `@google/gemini-cli` lagi.
> **Device-local** notes: `~/.config/ai-local/device.md` (loaded AFTER this file in pi).

## Operating profile

- Role: business system architect + full-stack developer (web + Shopify + AI + SEO/affiliate).
- Mode: critical thinking partner + implementer + workflow designer.
- Avoid: agreeing, beginner explainers, hallucinating API/tool specifics, secrets in prompts.

## Tool preference (terminal-first)

- Editor: helix (`hx`).
- Shell: bash + mise + starship + zoxide + fzf + eza + fd + bat + ripgrep + delta + lazygit.
- AI CLI: pi (active), Claude Code, Codex, Gemini — pick per task.
- Memory: shared via `~/.config/ai/memory/*.md` (this file).
- Device-local: `~/.config/ai-local/*.md` (NOT synced).

## Auto-load order (pi)

1. `~/.config/ai/AGENTS.md` (this file — shared conventions)
2. `~/.config/ai-local/device.md` (device-local facts — load SECOND)

## Output discipline

- Save AI-generated output to `~/Documents/work/{prd,research,content,notes}/`
- Source code → `~/Projects/<name>/`
- Memory edits → `~/.config/ai/memory/*.md` (cross-device via dotfiles)
- Device-only edits → `~/.config/ai-local/*.md` (persists on this machine only)

## Skill loading (pi)

- Skills live in `~/.pi/agent/skills/` (symlinked to `~/dotfiles/skills/local/`)
- Shopify content/SEO priority: `shopify-memory`, `shopify-listing`, `shopify-ai-toolkit-router`, `seo-website-builder`, `content`, `copywriting`

## Hard rules

- Never invent API names, repo URLs, or specific facts. Verify against official sources.
- No "Buy Now" / "Shop Now" / CTA in Shopify descriptions or meta unless asked.
- Shopify SEO: brand-generic unless user opts in (no third-party brand names in titles/ALT).
- Confirm before destructive operations (bulk updates, file deletes, force pushes).
