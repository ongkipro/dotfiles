# System-Map References — 2026-10-25

TASK-144, run `RUN-20261024T234022Z-b09d99aa`. Studies how mature projects make
a repository findable, page by page, for people and AI agents, and records what
`bin/system-map` adopts. Repositories were shallow-cloned outside the repository
and read only; nothing from them was installed or executed.

## Goal

`docs/DOTFILES_SITEMAP.md` is to development what `sitemap.xml` is to a website:
one map from which an engineer, programmer, or agent reaches the exact owning
page without opening and screening files one by one. TASK-141 made it complete
(every tracked member linked); this task makes it answer questions.

## Sources read

| Source | Commit read | Files studied |
|---|---|---|
| [AnswerDotAI/llms-txt](https://github.com/AnswerDotAI/llms-txt) | `3700a0a` (2026-09-25) | `llms_txt/core.py`, spec at [llmstxt.org](https://llmstxt.org/) |
| [Aider-AI/aider](https://github.com/Aider-AI/aider) | `5dc9490` (2026-05-22) | `aider/repomap.py`, [repo-map docs](https://aider.chat/docs/repomap.html) |
| [rust-lang/rust-analyzer](https://github.com/rust-lang/rust-analyzer) | `0c4d746` (2026-10-22) | `docs/book/src/contributing/architecture.md`; method from [matklad, ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) |
| [backstage/backstage](https://github.com/backstage/backstage) | `883bc77` (2026-10-24) | `docs/features/software-catalog/descriptor-format.md`, `well-known-relations.md` |
| [evildmp/diataxis-documentation-framework](https://github.com/evildmp/diataxis-documentation-framework) | `957c09c` (2026-08-06) | `source/compass.rst` |
| [yamadashy/repomix](https://github.com/yamadashy/repomix) | `64c9671` (2026-10-24) | `README.md` (output, inclusion levels, token tree), `src/core/output/` |

## Findings

### llms.txt — the entry grammar

- Markdown: H1 name (only required part), `>` summary, free prose, then H2
  sections of `- [title](url): notes` items. `parse_link` in `core.py` is one
  regex over exactly that shape.
- `## Optional` is a convention: `mk_ctx(optional=False)` skips it, so a reader
  with a small budget can stop early. `get_sizes` measures each section.
- **Adopted:** entries keep the `[name](path): note` shape, and `--check` now
  rejects an entry with no note. Our sections 6–7 already used this shape.
- **Not adopted:** fetching every linked page into one context (`llms_txt2ctx`).
  It defeats precision; the map should point, not inline.

### Aider repo map — ranking under a budget

- Builds a `networkx.MultiDiGraph` of files from tree-sitter definitions and
  references, then runs personalized PageRank. Personalization favors files in
  chat, mentioned file names, and path components that match mentioned
  identifiers.
- Edge weights: ×10 for an identifier the user mentioned, ×10 for a long
  snake/kebab/camel identifier, ×0.1 for `_private` or one defined in more than
  five files, ×50 when the referencing file is in chat, √ of reference count.
- A binary search picks how many ranked tags fit `--map-tokens` (default 1k),
  accepting within 15% of the budget.
- **Adopted:** query-time ranking that favors name and path hits (10) over
  section (3) and note (1) hits, and curated intents (×2, our equivalent of
  personalization). Entries matching more distinct terms rank first; each page
  appears once. `--limit` is the budget.
- **Not adopted:** symbol graphs, tree-sitter, and PageRank. This repository is
  mostly Markdown and scripts, and code-level graphs belong to the
  `codebase-navigation` skill (Graphify). Revisit only if `--find` misranks
  measurably.

### ARCHITECTURE.md (matklad, rust-analyzer) — codemap and invariants

- "A map of a country, not an atlas": coarse modules, where they live, how they
  relate. rust-analyzer's file has 26 **Architecture Invariant** paragraphs,
  introduced as things "deliberately absent in the source code".
- Name entities rather than link them, because links go stale; keep it short;
  revisit a couple of times a year rather than syncing with every change.
- **Adopted:** an *Architecture invariants* section of rules that hold by
  absence. Link staleness is solved differently here: the map links freely and
  `--check` fails on any link that resolves to nothing.

### Backstage catalog — metadata at the source, relations derived

- Every entity has the same envelope: `apiVersion`, `kind`, `metadata`
  (`name`, `title`, `description`, `tags`, `links`, `annotations`), `spec`
  (`type`, `lifecycle`, `owner`, `system`, `dependsOn`).
- Relations are pairs (`ownedBy`/`ownerOf`, `dependsOn`/`dependencyOf`,
  `partOf`/`hasPart`); one side is declared and the inverse is computed.
- **Not adopted now:** reading descriptions from each source file. Measured on
  `bin/`, 20 of 80 files have no line-2 description and the rest mix comment
  and docstring styles, so a generated note would be worse than the curated
  one. The ownership idea already exists as **Canonical Contract Owners** in
  `TASKS.md`. Revisit when sources carry a consistent one-line purpose.

### Diátaxis — what kind of page

- Two questions decide the type: action or cognition, acquisition or
  application. That yields tutorial, how-to guide, reference, or explanation.
- **Not adopted now:** labelling each entry. The Quick find intents already
  phrase the action ("Change…", "Find…", "Gate…"). Add labels only if readers
  keep opening explanation when they needed a how-to.

### Repomix — packing, levels, token tree

- Packs a repository into one XML/Markdown file, with per-glob levels (full,
  compressed through tree-sitter, structure only), `--token-count-tree`, and
  file sorting by Git change frequency.
- **Not adopted:** packing is the opposite of precise lookup. The token-tree
  idea is noted for a future `--find` cost column if agents need it.

## What changed

| Capability | Before | After |
|---|---|---|
| Entry point | Directory-ordered sections | `## Quick find`: 21 intents, each naming its owning page |
| Lookup | Read 440+ lines | `system-map --find <terms>` (`--limit`, `--json`), exit 1 on no match |
| Note coverage | 9 entries carried no inline note | Continuation lines count; the one truly noteless entry fixed; `--check` gates it |
| Labelled bullets | `- **TokoΦ:** [..]` lines were invisible to lookup | Labelled and mid-sentence link bullets are entries named by their label; multi-link entries print `also:` pages |
| Invariants | Implicit in contracts | Eight rules-by-absence in section 1 |

## Verification

- `system-map-test`: 28 cases, including note gate, owner-first ranking,
  once-per-page, intent precedence, continuation notes, table rows, breadth
  over single-term score, labelled items, link order, `also:` output, code
  fences, deep headings, and no-match exit.
- Manual mutations each turned the suite red: removing dedupe, the intent ×2,
  the name weight, distinct-term ordering, continuation joining, the note
  gate, link ordering, fence skipping, deep headings, and labelled items.
- An independent reviewer (fresh subagent, given the diff and contract, not
  these conclusions) found three defects, all fixed with a regression case:
  a docs-relative second link sorted ahead of the owning first link; labelled
  bullets (`- **Label:** [..]`) were not entries, so `--find tokophi` returned
  nothing; multi-link entries hid their other pages.
- Seeded live queries returned their owners first: `memory routing` →
  `config/ai/memory-router.json`; `approval gates` → `config/ai/CORE.md`;
  `risk diff` → `bin/diff-risk`; `new project template` → `bin/project-init`;
  `deploy production` → `bin/production-gate`; `secrets credentials` →
  `bin/secrets-env`; `tokophi` → `config/ai/project-memory/tokophi.md`;
  `kelola nginx` → the Kelola deploy-lessons entry, whose `also:` line names
  `feedback_deploy_nginx_patch.md`.

## Deferred, with their triggers

- Source-derived notes (Backstage): when sources share one description style.
- Diátaxis labels: when wrong-type pages are opened repeatedly.
- Cost column per hit (repomix token tree): when agents need a byte budget.
- Graph ranking (aider): when `--find` misranks a seeded intent.
