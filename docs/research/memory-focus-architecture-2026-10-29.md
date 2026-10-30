# Memory precision, focus, and learning — research and proposal (2026-10-29)

Owner request: make dotfiles the AI's evolving way of thinking and the
connective tissue between runtimes "like a human"; memory must be precise; a
focus system must keep a session on its own development task and prevent
unrelated projects from bleeding in; the learning loop must be completed.
The original research below is historical proposal material, not proof. The
accepted contract and corrections below supersede conflicting proposal details.

## Accepted delivery contracts

Owner authorized implementation on 2026-10-29; root TASKS.md is still the only
execution queue. Exact file allowlists and accepted dirty paths are bound in
run-start events; no broad prose here authorizes unrelated changes.

- **REQ-MEMORY-PRECISION / TASK-156 (R2):** routing/access/lifecycle commands and
  tests, router manifest and lesson split, existing indexes/docs only. Execution
  truth first; current-project triggers work without naming the project;
  untriggered arithmetic stays empty; path-only selection is at most one file
  and 40% of byte budget. Explicit references replace foreign-name matching.
  Unknown runtime stays unknown; usage is selection, not proof of reading.
  Verify route/access/lifecycle/hook tests and real slug/negative-reference
  probes. No memory deletion. Reopen on isolation/priority regression;
  escalate schema or authority changes.
- **REQ-FOCUS / TASK-157 (R2):** focus CLI/test, resume/router/access/ledger
  integrations and tests, command manifest, one short CORE instruction and
  generated contexts, existing operating/research/map docs. Device-local,
  per-checkout session claims use locks and expiry; exact paths/subtrees reuse
  ledger semantics. Overlap and malformed state fail. Explicit references
  only; a captured focus remains in the ledger after release/expiry. Repo
  product contracts retain authority, with no parallel FOCUS.md. Verify focus,
  routing, access, resume, ledger, context checks and independent review.
  No Git write interceptor, skill changes or automatic promotion. Reopen on
  claim overwrite, reference leakage or boundary bypass; escalate budget or
  authority changes.
- **REQ-TWO-WAY-LANGUAGE / TASK-158 (R2):** rename owned volumx-writer directory
  to writer, update current consumers, discovery, map, evaluation fixtures,
  CORE reference/generated contexts; add communication memory/router entry
  and writer guidance. Only name replacements in other skills; preserve
  parallel edits and historical names. Meaning, negation, register and facts
  survive; audience evidence outranks country stereotypes. Explain with
  consequences, use focused clarification, never claim the user understands
  or that all languages are certified. Source locale conventions; no copied
  Humanizer rules. Verify metadata/map/workflow/links/context/hygiene,
  communication routing and semantic dialogue review. Reopen repeated intent
  errors or literal-translation register; escalate new CORE methodology.

All three require repository policy lint and independent review for completion;
no staging, commit, push, live operations, or automatic candidate promotion.
Current tests and ledger evidence outrank this record. Skill/map checks based
on the Git index cannot certify unstaged renames as tracked membership.

## Corrections to early audit claims

- 67 NEVER_USED entries did not establish dead memory or a causal explanation
  for all misses: telemetry is incomplete, corpus-aged, and not a read receipt.
- The URL-slug hygiene warning was not proven semantic conflict; both notes
  originally preserved numeric collisions and username addressing. The earlier
  edit must not be treated as authorization to remove a global username rule.
- Only the explicitly queried npm packages and OMP updater established latest
  versions; agy/gh/Git/Node latest status was not independently established.
- The context limit is 10 * 1024 bytes, not 10,000. Old ledger observedHead and
  dated docs alone do not prove invalid state or unused documentation.
- Research discovery snippets are not independently validated benchmark results
  or peer-review evidence. Numerical claims below remain source-reported,
  unverified here; implementation is justified by local regression evidence.
- Earlier bulk lesson promotion did not independently re-run every originating
  project check. Promotion gates validate hygiene, not the truth of each claim;
  those lessons remain advisory and require re-verification before application.


## Current state (measured, this worktree)

| Measure | Value | Source |
|---|---|---|
| Runtime versions (re-verified 2026-10-30) | pi 1.4.0 = latest; claude 2.1.314 = latest; codex 0.166.0 = latest (upgraded from 0.165.0); omp 18.13.3 (`omp update` reports up to date); 9router 0.5.112 = latest; gh 2.103.3 = latest GitHub release; mise 2026.10.19 vs 2026.10.23 latest (not upgraded: system-wide change needs approval); node 24.22.1 pinned in `config/mise-config.toml` (current LTS line is 26.x; pin change is a separate decision); agy 1.4.10 — no update check available in its CLI, latest unverified | `npm view`, `npm ls -g`, `gh api .../releases/latest`, `omp update` |
| Pi extension | `@amaster.ai/pi-image-gen` upgraded 0.1.8 → 0.1.33 (Apache-2.0, peer deps satisfied); `pi -p` and `codex exec` smoke probes return OK afterwards | `~/.pi/agent/npm/package.json` |
| Memory corpus | 124 tracked files, 74 days of routing telemetry | `ai-memory-lifecycle` |
| Never routed | 67 files (2 shared, 65 project) | `ai-memory-lifecycle --json` |
| Low use (≤ 4 selections) | 16 files | same |
| Active | 41 files | same |
| Telemetry runtime attribution | none: 5 698 events, 0 carry a runtime field | `memory-usage/events.jsonl` |
| Lesson inbox after this session | 0 pending (9 promoted, 1 rejected; had been 10 for up to 23 days) | `ai-learn list` |

### Routing leak test (`ai-memory-route --repo ~/Projects/99ribu --json`)

| Prompt | Selected | Verdict |
|---|---|---|
| "bikin halaman produk dan cart toko online, checkout COD" | `development-lessons.md` (10.6 KB) only | wrong file: it matched on changed `*.css` paths, not on the prompt; none of 99ribu's four project notes was chosen |
| "cart drawer, variant picker, tokophi style storefront" | `preferences.md` only | tolerable, but `tokophi` did not pull 99ribu's own storefront pattern note either |
| "perbaiki slug produk" | `development-lessons.md` only | wrong: `99ribu-url-slugs.md` declares the trigger `slug`, yet project memory is gated behind "prompt names the project", so a developer working inside the repo never gets it |
| "deploy ke coolify dan migrasi postgres" | `current.json`, `coolify-vps-dev.md`, `ops-lessons.md` | correct |

Two root causes:

1. `project_needed` in `bin/ai-memory-route` requires the prompt to name the
   project, the scope flag, or a stock phrase ("gotcha", "prior lesson"). Being
   in the repository is not enough. Project memory is therefore unreachable for
   the normal case — working inside the project — which is also why 65 of 82
   project files have never been routed.
2. `path_score` grants a full trigger's worth to any shared entry whose `paths`
   glob matches a dirty file. Shared lesson files with broad globs
   (`**/*.css`) then win the whole budget on unrelated prompts. One 10 KB file
   consumes 88 % of the 12 KB budget, so nothing else fits.

## External evidence (read 2026-10-29)

Primary (peer reviewed or vendor documentation):

- MemDev-Bench (alphaXiv 2610.27524, 2026-10-20): memory helps localization and
  editing, but **unrelated history increases failures on otherwise solvable
  tasks**; failures come from reusing memory without re-checking applicability.
  Direct support for a hard project boundary in retrieval.
- REM (alphaXiv 2610.27377, 2026-10-19): the bottleneck is governance, not
  retrieval fidelity. Three decisions — what to store (phase-structured
  document, ~100× smaller than the trajectory), when to recall (summary at
  task start; detailed record only when a struggle gate fires), what to forget
  (evict after one exposure). Oracle-retrieved raw or summary injection did
  not help; governed injection did.
- SWE-ContextBench (via dev.to summary, 2026-08-11): free retrieval over
  distilled summaries **reduced** resolution (26.3 % → 22.2 %); oracle
  summaries raised it to 34.3 %. "A concise but unrelated memory may appear
  confident and authoritative."
- Overeager Coding Agents (arXiv 2605.18583) and SNARE (arXiv 2605.28122):
  19.5 % of benign runs across four agents take out-of-scope actions; the
  framework explains 56 % of the variance, the model 21 %. Stripping the
  in-prompt scope declaration raised the overeager rate on Claude Code from
  0 % to 17.1 %. A visible declared scope is the single most effective lever.
- SWE-MISBEHAVIOR (alphaXiv 2610.18206): a lightweight guideline + tool kit cut
  boundary violations by 34–52 %.
- CodeDelegator (alphaXiv 2601.14914): clean per-subtask context prevents
  debugging traces from polluting planning context.
- Claude Code memory docs (code.claude.com, 2026-09): CLAUDE.md walks from cwd
  to root; `.claude/rules/*.md` with `paths:` frontmatter loads only when
  matching files are touched; auto memory is per-repository and capped at 200
  lines / 25 KB; `claude --worktree` isolates parallel sessions.
- CoALA (Princeton; summarized by alexop.dev and IBM, 2026): working /
  semantic / procedural / episodic memory must interact without collapsing
  into one store.

Secondary (practitioner, used for shape not for numbers): Letta memory tiers
(core blocks in context, archival out of context with search); Alhamoud,
"Every token is rent" — retrieval is an authorization decision: filter by scope
∩ project ∩ class ∩ active ∩ not-expired **before** ranking; cap the memory
budget independently from the task budget; consolidation must preserve
disagreement; decay lowers priority or triggers re-verification, never rewrites
history.

## What dotfiles already has (map to CoALA)

| Layer | Dotfiles owner | Gap |
|---|---|---|
| Working | runtime context window + `resume-brief` + `.delivery/current.json` | no declared active scope; nothing says what this session must not touch |
| Semantic | `config/ai/memory/*.md` (shared), `project-memory/*.md`, `CORE.md` | project tier gated off; no per-file expiry or re-verify date |
| Procedural | `skills/local/*` with progressive disclosure | sound; outside this proposal (other terminal) |
| Episodic | `ai-learn` inbox → promotion; `.delivery/runs`; `ai-recall` FTS | capture works; consumption had no cadence; no runtime attribution in telemetry |

## Proposal

Ordered by evidence strength and by how little code each needs.

### P1 — Retrieval is an authorization decision (memory precision)

1. **Project tier is on by default inside a repository.** Replace the
   `project_needed` gate with: if `project_from_repo` resolves, project entries
   compete on triggers like shared ones; untriggered project entries get the
   current low band. Prompt-names-project stays as a boost, not a gate.
2. **Project boundary is hard.** When a repo resolves to project X, every
   project-memory entry owned by another project is excluded before ranking,
   even on a trigger hit. Shared and lesson tiers remain. This is the
   MemDev-Bench finding turned into one filter.
3. **Path hits widen recall, they do not pay for the whole budget.** Cap a
   `path_score`-only selection at one file and at most 40 % of `maxBytes`, or
   split `development-lessons.md` so no single routed file exceeds ~6 KB.
   Measure with the four prompts above before and after.
4. **Telemetry carries the runtime.** The prompt hook records
   `runtime: claude|codex|pi|omp|agy`; `ai-memory-lifecycle` reports per
   runtime. Without it, "never used" cannot distinguish a dead file from a
   file only Pi ever needed.
5. **Lifecycle acts on its own classes.** `NEVER_USED` after ≥ 60 days of
   observation → `archive-review` list in `ai-doctor` (advisory). The 65
   project files: review in one pass; most are project notes for repositories
   that are finished or dormant, which the hard project boundary (item 2)
   already keeps out of unrelated sessions — so the main risk after item 2 is
   bytes, not distraction.
6. **Every memory file states its horizon.** Front matter
   `verified: YYYY-MM-DD` and optional `expires: YYYY-MM-DD`; hygiene warns
   past expiry, lifecycle lowers priority, nothing is deleted automatically.

### P2 — Focus system (new)

Definition proposed from the owner's examples: a session has exactly one
declared **focus** = project + intent + allowed surface + explicit non-scope,
and every runtime can read it from disk.

1. **`FOCUS.md` at the repository root, or `.delivery/focus.json`** — one
   active intent, the task id if any, allowed paths, and "not this session"
   list (e.g. `not: skills/** (other terminal)`). `resume-brief` prints it
   first; `ai-memory-route` reads it to set `project` and to exclude other
   projects; `diff-risk`/`delivery-ledger check-boundary` treat a change
   outside the allowed paths as a boundary breach.
2. **Why on disk and not in the prompt**: the overeager studies show the
   visible declaration is what changes behaviour; on disk it survives
   compaction, crashes, and runtime switches, and two terminals on one repo
   can see each other's claim.
3. **Cross-terminal claim.** `focus claim --surface skills/**` writes a
   device-local lock (`~/.config/ai-local/focus/<repo>.json`, pid + ttl).
   A second session in the same repo sees "skills/** held by pid N since T"
   in `resume-brief` and in the prompt hook. Advisory, not enforced by Git.
4. **Reference pull, not project pull.** When a focus declares
   `references: [tokophi, storefront-ux]`, the router may admit *named*
   foreign project files as `reference` scope with low priority — the
   "ecommerce may consult tokophi, must not become tokophi" case. Absent that
   declaration, the hard boundary holds.
5. **Drift check at the gate.** `delivery-ledger finish` and `production-gate`
   fail when the diff touches paths outside the focus surface without an
   `expand-scope` record — the ledger already has that verb.

### P3 — Learning loop completion

1. **Cadence, not tooling.** `ai-doctor` escalates pending candidates from
   `!` to `✗` after 7 days or 5 items; `ai-health-daily` lists them.
2. **Store phase-structured, recall once.** Keep the existing five-field
   lesson (symptom / root cause / invariant / fix / check); add an optional
   `trajectory:` pointer to the delivery run so the detailed record is
   available on demand (REM's withheld record) without inflating memory.
3. **Promotion stays reviewed.** No auto-promotion; the evidence says
   unverified memory harms more than it helps.
4. **Candidate from focus close.** `focus release` offers `ai-learn capture`
   with the run id pre-filled; the human still writes the invariant.

## Sequencing and ownership

- P1.1–P1.3 are one R2 task on `bin/ai-memory-route` + its test + router
  manifest; verifiable with the four prompts above.
- P1.4 touches `hooks/memory-usage.sh` and `ai-memory-lifecycle`; R1.
- P2 is new surface: PRD first (`prd-taskbreaker`), then a task per command.
  It changes `CORE.md` (one line: "read FOCUS before acting"), so it waits
  until the skills terminal has committed; two terminals editing CORE is a
  guaranteed conflict.
- P3.1 is R1; P3.2–P3.4 ride on P2.
- `@amaster.ai/pi-image-gen` upgrade is independent and needs owner approval
  (changes an installed extension).

## Non-goals

Vector databases, embedding services, background LLM consolidation, auto
memory writes from any runtime into tracked files, merging the skill tier.
