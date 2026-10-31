# TASK-169 — completed

Moved from `TASKS.md` when it finished (2026-10-31).

### TASK-169: `dotuiux` — primary-source check, D8 trial, real-page cases
- **Requirement:** REQ-DOTUIUX (owner 2026-10-31: verify thresholds against current sources, run the approved D8 sandbox trial, and run `dotuiux check` on real pages so rules change from real failure cases, §17).
- **Risk Level:** R1.
- **Allowed Paths:** `bin/dotuiux`, `bin/dotuiux-test`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/TASKS-169-completed.md`, `docs/DOTFILES_SITEMAP.md`, `skills/local/dotuiux/SKILL.md`.
- **Protected Paths:** `skills/local/design-taste/scripts/**`, `skills/local/admin-dashboard/scripts/**`.
- **Evidence (outside the repo):** `~/Documents/work/research/dotuiux/04-threshold-verification-2026-10-31.md` (primary sources), `05-d8-trial-and-real-pages-2026-10-31.md` (D8 trial, four real builds, before/after JSON in `sandbox-d8/real/`).
- **Done:** contrast bounded over gradients; stacked gradient layers composited per layer; instant scroll scan up to 120 screens / 45 s with a note past that; thin pseudo-element lines (≤ 4 px) and off-page elements no longer distort results; painted pseudo bands are collected page-wide and keep text in their containing block NOT CHECKED (also closes four pre-existing wrong-FAIL cases on HEAD: grid-placed, box-shadow, border and sibling overlays); `lcp-entrance` fails only on a hidden start, including a larger first-viewport element that fades in; WCAG 2.5.8 user-agent exception; `ease-in` labelled D1; new warn `heading-skip`.
- **Accepted Invariants:** floor (fail) set unchanged at 13 ids; new rule enters as warn; zero dependencies; unmeasurable stays NOT CHECKED, never pass; `impeccable` and `@google/design.md` stay out of the repo (owner decides on the advisory use proposed in `05-*.md`).
- **Review:** independent rounds 1–4 returned REVISE with reproduced wrong floor FAILs (pooled gradient layers, fading header/glow/svg as LCP, pseudo-box geometry under transforms and margins, unseen pseudo overlays); each repro is a regression fixture; pseudo-box geometry was replaced by page-wide band regions plus a live stack check (a superset of the earlier behaviour except the plain-line exemption). Rounds 5–6 (narrow verification): PASS.
- **Ledger:** `RUN-20261031T105543Z-a8d97c37` finished **BLOCKED**, not PASS: the boundary failed only because a concurrent session edited the unrelated `config/ai/project-memory/adsbookcms-install-fleet.md` after the run started; that file is not part of this commit.
- **Regression Checks:** `bin/dotuiux-test`; mutation runs for instant scroll, gradient coverage, layer splitting, LCP candidate filter, larger-element LCP, off-page visibility and the pseudo rule; `bin/system-map --check`; `bin/system-map-test`; `skill-check`; real-page before/after run.
- **Non-Scope:** fixing the client pages' own real fails; commit/push.
