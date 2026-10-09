# Skill and Memory Consistency Audit

Audit date: 2026-10-10 (Asia/Jakarta). Requirement:
`REQ-SKILLS-MEMORY-CONSISTENCY`, TASK-116. Repository evidence and executable
checks outrank this dated report.

## Coverage and limits

- Inventory: 75 owned skill entrypoints, 668 Markdown files in the skill tree,
  20 shared-memory files, 76 project-memory files including the index, and
  18 separately scoped Kelola memory files (114 memory files in total).
- Whole-corpus checks cover frontmatter, descriptions, routing, links, command
  surfaces, hygiene rules, and repeated/conflicting instruction searches.
  Semantic inspection focuses on the matches and their owning contracts;
  this is not a claim of manual line-by-line certification of every reference.
- `config/ai/memory/projects-platforms.md` was already dirty. Its content was
  excluded from manual inspection and edits; repository read-only validators
  still include it in their normal corpus.
- No secret/session files, paid model calls, live APIs, services, or provider
  settings were accessed or changed. No mass upstream refresh was performed.
  This audit does not establish that every external API example is current.

## Repaired contradictions

| Finding | Repair and owner |
|---|---|
| `development-kit` still preferred a different-vendor reviewer after the review contract changed. | A separate capable reviewer is required; same model/provider is eligible. Parent verification remains mandatory. |
| Reasoning guidance required two hypotheses, one check per reasoning step, a rigid retry ceiling, and a large output template. | Compare alternatives when material, verify behavioral claims, reassess evidence on failures, and size the explanation to the task. |
| Reference-fidelity research imposed a directional-reference ceiling. | Add inspected references when they resolve an open decision; no quota. Fidelity and validation remain required. |
| Graphify memory still described a pre-adoption state and pointed at a device-only July report. | Link the actual codebase-navigation skill and ecosystem adoption contract; retain the no-global-installer boundary. |
| Pi memory combined conflicting old defaults, local-gateway instructions, catalogs, and unsafe secret sourcing. | Replace changing snapshots with the tracked optional-remote adapter contract and approved credential-injection guidance. Retain the reserved-headroom debugging lesson, with an installed-version recheck requirement. |
| Skill registry memory stored obsolete CI run IDs, test counts, a stale defect, and Indonesian methodology. | Keep concise English pointers to source-owned discovery and executable checks; current CI evidence must match the tested revision. |
| Index summaries contradicted their corrected child memories: automatic handoff commits, a required local gateway, stale catalog counts. | Align summaries with the child contracts; explicitly label dated operational snapshots as historical context. |
| Git identity memory suggested rewriting history for old authors. | Verify effective noreply identity for authorized future commits; exact approval is required for any historical rewrite. |
| Workflow memory repeated old plugin/link snapshots and could independently authorize sync or Kelola pushes. | Use canonical source pointers and current repository authorization; distinguish shared, project, and device-only memory. |
| Skill calibration repeated numerical SEO heuristics and omitted new owners. | Link current domain owners; add codebase-navigation and concise-dialogue ownership without duplicating methodology. |
| Adding this audit's contract exceeded the hot `TASKS.md` budget. | Move completed TASK-114/115 contracts verbatim to `docs/archive/DOTFILES_TASKS_2026-10-10_SKILLS.md`; retain immutable execution evidence and active tasks. |

## Verification and residual work

The delivery run records executed checks and independent review. Structural
success does not prove every natural-language instruction or API example works.

Memory hygiene initially reported 25 dated-claim warnings; after removing the
superseded Pi snapshots it reports 20 across 11 files. These warnings are retained,
not suppressed or made fresh by changing dates:

- Shared: `projects-sites.md`.
- Project: `autolaris-payment-integration.md`, `dev-toolchain-mise.md`,
  `kiriminaja-integration.md`, `mengantar-docs-project.md`,
  `mystore10-furniture-shopify.md`, `ongki-pro-site.md`,
  `petcue-shopify-site.md`, `pixsgo-categories-from-producttype.md`,
  `pixsgo-rebrand-play-and-go.md`, and `tokophi-build-log.md`.

TASK-117 explicitly labels these files as historical reference while retaining
the dates and claims. The 20 dated-claim warnings remain visible; the label is not a new check
of their live systems. The repeated provenance banners also trigger 50 advisory
semantic-duplicate findings (70 total); these are disclosed boilerplate, not
newly verified facts or a reason to weaken the hygiene checker.

Reconcile these against their owning repositories or authorized live evidence
when working on those projects. Keep useful incident invariants, move changing
status to repository-owned records, and do not erase historical evidence merely
to make hygiene green. Age alone does not prove a claim false.

Skill-effectiveness telemetry is sparse: most attributed skills have insufficient
samples. It does not justify deleting skills, claiming causal improvement, or
introducing a new orchestrator. Lifecycle recommendations are advisory; low use
alone does not justify deleting memory.

For a future upstream refresh, select a concrete affected skill, inspect its
provenance and official sources, preserve managed local forks, and run its own
checks. A whole-corpus scan is not permission to replace every skill with latest.
