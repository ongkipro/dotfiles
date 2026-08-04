---
name: kamus-almanak
description: "Kamus = almanak/memori kedua Ongki di kamus.ongki.pro (repo ongkipro/kamus) — markdown di-render jadi dashboard Astro, punya kontrak AGENTS.md"
metadata: 
  node_type: memory
  type: project
  originSessionId: 175472a6-0990-4f5a-a737-847321f1963f
---

**Kamus** (`ongkipro/kamus`, private → `kamus.ongki.pro`, anonymous HTTP 401) is Ongki's **second memory system**, separate from this CLI memory. Markdown files at the repo root are rendered into an Astro dashboard. The repo is cloned on this Mac at `~/Projects/kamus` (verified 2026-08-04).

Folder = collection: `journal/` (per day, `YYYY-MM-DD.md`), `tasks/`, `projects/`, `memory/`, `skills/`, `sessions/`, `summaries/`.

**Why:** when updating Ongki's memory, this is often the place he means — not just `~/.claude/…/memory` or `~/.config/ai/memory`. All three can desync (kamus was once 6 days behind the TokoΦ rebrand).

**How to apply:**
- **Read `AGENTS.md` in the repo first.** Frontmatter is enforced by zod in `src/content.config.ts` — wrong format = **build fails**. Run `pnpm build` before commit.
- One fact / one day / one task = **one file**. Bahasa Indonesia.
- Push triggers a deploy (`.github/workflows/deploy.yml`). `AGENTS.md` says don't push automatically unless asked.
- Commit **without** the `Co-Authored-By` trailer — see `memory/no-ai-commit-trailer.md` in that repo.
- **Cross-collection wikilinks `[[x]]` were re-verified 2026-08-04** via `pnpm lint:links`: resolved by `src/lib/links.mjs` (memory→/kamus/, project→/projects/, journal→/journal/, skill→/skills/, task→/tasks#id; sessions/summaries are deliberately not targets).
- **TRAP when renaming a project:** `projects:` in journal/sessions/summaries frontmatter and `project:` in tasks are **index keys**, not free text. `src/pages/projects/[id].astro` filters `data.projects.includes(name)` — an exact match to the `name:` field in `projects/*.md`. Renaming without first changing that frontmatter = orphaned history that vanishes with no error — but this is now **machine-guarded**: `scripts/lint-links.mjs` (`pnpm lint:links`) fails `astro build` when a wikilink dangles or a project name doesn't match.
- **Security:** `pnpm lint:secrets` blocks common plaintext credential patterns in tracked content, but it does not replace GitHub secret scanning or history review. A credential removed from current content on 2026-08-04 still requires rotation because Git history retains the old value.
- **Current state (2026-08-05):** auth middleware regression tests, safe search DOM rendering, current site URL, weekly-summary validation, sanitized memory, and exact 38/38 local-skill parity are committed on local feature branch `codex/kamus-sync-hardening-20260805` and deployed directly to Cloudflare Pages production. Ten obsolete skill pages and their stale router references were removed. The branch has not been pushed, so GitHub `origin/main` still points to the previous version. Weekly summary remains blocked until `ANTHROPIC_API_KEY` is configured as a GitHub repository secret; never put its value in memory or chat.

When logging work, write that day's journal here. Related: [[tokophi]].
