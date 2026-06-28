---
name: local-skills-registry
description: Daftar skill lokal di ~/dotfiles/skills/local/ yang ter-link ke semua AI CLI (claude/codex/gemini/pi/agents). Cek ini sebelum menyarankan install tool atau membuat skill baru agar tidak duplikat.
metadata: 
  node_type: memory
  type: project
  originSessionId: af118496-2521-425e-a47b-d86f78516085
---

# Local Skills Registry

Skill lokal tersimpan di `~/dotfiles/skills/local/` dan di-symlink ke semua CLI via `skill-update`.

**Total per 2026-06-28**: 18 local skills (63 repo/shared + 18 local)

## Dev Pipeline Skills (baru)

- `prd-taskbreaker` — ubah ide → PRD → numbered AI-coding tasks
- `mermaid-diagram` — generate flowchart, ERD, sequence, C4, gantt inline Markdown
- `openapi-spec` — generate + validasi OpenAPI 3.1 YAML
- `supabase-stack` — auth, PostgreSQL, storage, realtime, edge functions; cloud + self-hosted Docker VPS
- `shadcn-ui` — **fork dari jezweb**, update dengan charts (Recharts), sidebar, blocks, dark mode, combobox, date picker, 20+ components

## Skills Lokal Lain

- `astro-development` — end-to-end Astro dev
- `ai-terminal-project-runner` — workflow governor, routing antar CLI
- `shopify-ai-toolkit-router` — routing ke Shopify AI toolkit
- `shopify-listing` — Shopify product listing workflow
- `cloudflare-worker-toolkit` — Cloudflare Workers development
- `9router`, `9router-chat`, `9router-image`, `9router-stt`, `9router-tts`, `9router-web-fetch`, `9router-web-search`, `9router-embeddings` — 9router AI gateway skills

## Cara Update

```bash
skill-update   # sync semua skill dari jezweb repo + re-link local
skill-list     # list semua skill
skill-new      # buat skill baru
```

**Why:** Local skills di dotfiles tidak ketimpa saat `skill-update` menarik update jezweb — local override repo. Simpan skill custom di `~/dotfiles/skills/local/`, backup otomatis via git push.
