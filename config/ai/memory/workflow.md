# Memori: Workflow & konvensi
> Bagian dari memori bersama.

- Terminal-first: edit `hx`, git `lg` (lazygit), multiplex `tmux`, AI claude/pi/codex.
- Preview web: jalankan dev server (`npm run dev` / `shopify theme dev` / `wrangler dev`) lalu buka Chromium ke `localhost:<port>` (auto live-reload).
- Pakai tool modern: `rg` (bukan grep), `fd` (bukan find), `eza` (bukan ls), `bat` (bukan cat), `z` zoxide (bukan cd manual).
- Git: commit cepat lewat lazygit; backup = push ke remote; JANGAN auto-commit (anti-pattern).
- VSCode opsional, bukan keharusan — jangan disarankan kecuali diminta.
- Shopify dev routing: official Shopify AI Toolkit/plugin sudah tersedia di Claude (`~/.claude/plugins/marketplaces/shopify-ai-toolkit`, v1.4.1) dan Codex cache (`~/.codex/plugins/cache/openai-curated/shopify/...`). Pi belum punya Shopify extension resmi; gunakan local router skill `shopify-ai-toolkit-router` di Pi, dan jangan clone repo pendukung Shopify (dawn/horizon/hydrogen/cli/liquid/theme-liquid-docs) sebagai skill duplikat.

## ai-terminal-project-runner
- Created local development meta-skill at `~/dotfiles/skills/local/ai-terminal-project-runner` and synced to `~/.agents/skills`, `~/.claude/skills`, `~/.codex/skills`, and `~/.gemini/skills`. It routes Pi/Claude/Codex/AGY/9router development workflows, enforces safety gates, reads memory, and includes `scripts/inspect_project.sh`.
- Patched `skill-update`, `skill-list`, `skill-new`, `skill-open`, and `skill-remove` in `~/.agents/bin` / `~/dotfiles/skills/agents-bin` to resolve `~/.agents/local-skills` symlink with `readlink -f`, so local skills in dotfiles are detected correctly.
