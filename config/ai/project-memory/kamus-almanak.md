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
- **Cross-collection wikilinks `[[x]]` and skill snapshot integrity were re-verified 2026-08-05** via `pnpm lint:links`: resolved by `src/lib/links.mjs` (memory→/kamus/, project→/projects/, journal→/journal/, skill→/skills/, task→/tasks#id; sessions/summaries are deliberately not targets). The same gate rejects duplicate skill names, filename/frontmatter mismatches, and drift between `skills/*.md` and `memory/local-skills-registry.md`.
- **TRAP when renaming a project:** `projects:` in journal/sessions/summaries frontmatter and `project:` in tasks are **index keys**, not free text. `src/pages/projects/[id].astro` filters `data.projects.includes(name)` — an exact match to the `name:` field in `projects/*.md`. Renaming without first changing that frontmatter = orphaned history that vanishes with no error — but this is now **machine-guarded**: `scripts/lint-links.mjs` (`pnpm lint:links`) fails `astro build` when a wikilink dangles or a project name doesn't match.
- **Security:** `pnpm lint:secrets` blocks common plaintext credential patterns in tracked content, but it does not replace GitHub secret scanning or history review. A credential removed from current content on 2026-08-04 still requires rotation because Git history retains the old value.
- **Current state (2026-08-05):** auth middleware regression tests, safe search DOM rendering, current site URL, sanitized memory, task reconciliation, and exact 41/41 local-skill parity are merged to GitHub `main` through Kamus PRs #1–#3. Ten obsolete skill pages and stale router references were removed; `development-spec-suite` and `mengantar-api` snapshots were added. Link/secret/skill-integrity guards, 9 tests, and a 126-page build run in deploy validation. All external workflow actions use verified Node 24 releases pinned to immutable SHAs; Cloudflare Pages deployment `30968792968` succeeded with zero annotations. Weekly summary remains blocked until `ANTHROPIC_API_KEY` is configured as a GitHub repository secret; never put its value in memory or chat. The remaining dotfiles working-tree reconciliation is explicitly tracked in Kamus as `tasks/dotfiles-reconcile-working-tree.md`.

When logging work, write that day's journal here. Related: [[tokophi]].
