---
name: kamus-almanak
description: "Kamus = almanak/memori kedua Ongki di kamus.ongki.pro (repo ongkipro/kamus) — markdown di-render jadi dashboard Astro, punya kontrak AGENTS.md"
metadata: 
  node_type: memory
  type: project
  originSessionId: 175472a6-0990-4f5a-a737-847321f1963f
---

**Kamus** (`ongkipro/kamus`, private → `kamus.ongki.pro`, gated by Cloudflare Access so anonymous gets 401) is Ongki's **second memory system**, separate from this CLI memory. Markdown files at the repo root are rendered into an Astro dashboard. **No clone on this Mac** (verified 2026-07-20: `~/Projects/kamus` does not exist — the old note mentioning a clone 2026-07-10 is stale).

Folder = collection: `journal/` (per day, `YYYY-MM-DD.md`), `tasks/`, `projects/`, `memory/`, `skills/`, `sessions/`, `summaries/`.

**Why:** when updating Ongki's memory, this is often the place he means — not just `~/.claude/…/memory` or `~/.config/ai/memory`. All three can desync (kamus was once 6 days behind the TokoΦ rebrand).

**How to apply:**
- **Read `AGENTS.md` in the repo first.** Frontmatter is enforced by zod in `src/content.config.ts` — wrong format = **build fails**. Run `pnpm build` before commit.
- One fact / one day / one task = **one file**. Bahasa Indonesia.
- Push triggers a deploy (`.github/workflows/deploy.yml`). `AGENTS.md` says don't push automatically unless asked.
- Commit **without** the `Co-Authored-By` trailer — see `memory/no-ai-commit-trailer.md` in that repo.
- **Cross-collection wikilinks `[[x]]` were FIXED 2026-07-14** (not re-verified against disk — the repo isn't cloned on the Mac; source: `projects.md`, which is newer than this note): resolved via `src/lib/links.mjs` (memory→/kamus/, project→/projects/, journal→/journal/, skill→/skills/, task→/tasks#id; sessions/summaries are deliberately not targets). The old note saying `[[projects]]`/`[[tasks]]` still 404 is stale.
- **TRAP when renaming a project:** `projects:` in journal/sessions/summaries frontmatter and `project:` in tasks are **index keys**, not free text. `src/pages/projects/[id].astro` filters `data.projects.includes(name)` — an exact match to the `name:` field in `projects/*.md`. Renaming without first changing that frontmatter = orphaned history that vanishes with no error — but this is now **machine-guarded**: `scripts/lint-links.mjs` (`pnpm lint:links`) fails `astro build` when a wikilink dangles or a project name doesn't match.

When logging work, write that day's journal here. Related: [[tokophi]].
