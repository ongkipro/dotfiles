# Archived task contracts — mutation coverage

Moved out of `TASKS.md` on 2026-09-11 to stay inside the hot-context budget.
Every entry has ledger evidence ending in PASS. The thread through them: the
sweep stopped asking whether a test asserts anything and started asking whether
it would notice a plausible bug — first in bash, then in the half of `bin/` it
could not read at all.

### TASK-079: Publish reviewed UI skills after remote integration

- **Requirement:** REQ-UI-SKILL-PUBLISH (user-authorized commit/push).
- **Risk Level:** R2.
- **Allowed Paths:** `TASKS.md`, `docs/public-ui-skill-audit.md`; `.delivery/` is ledger-owned.
- **Canonical Contract Owners:** `skills.publication`.
- **Accepted Invariants:** Preserve remote records, reviewed UI bytes, local language work, and immutable logs; publish only UI and integration evidence.
- **Verification:** Policy/skill/security checks, byte preservation, staged scope, independent review, and remote HEAD.
- **Runtime Evidence:** Existing link/model evidence; no rendered UI claim.
- **Non-Scope:** Deploy, tags, language-skill publication.
- **Reopen Conditions:** Lost task/source or unrelated staged content.
- **Escalation Conditions:** Conflict or failed verification.
- **Evidence:** `RUN-20260911T041027Z-0f497beb`; ledger determines completion. Historical 073/074 map to 077/078.

- **TASK-078 / REQ-PUBLIC-UI-QUALITY (R3, reviewed).** Framework-neutral UX,
  reference research, and contextual anti-slop/evidence review. Skill, policy,
  runtime-link, targeted model cases, and independent review passed.
  Historical run used TASK-074: `RUN-20260910T184228Z-9eb168f3`.
  Contract, findings, and log: `docs/public-ui-skill-audit.md`.

### TASK-077: Cross-model intent and language guidance

- **Requirement:** REQ-CROSS-MODEL-LANGUAGE (user-requested audit and improvement).
- **Risk Level:** R1 (declared); boundary-classified R2 due to the five-file surface, requiring independent review.
- **Canonical Contract Owners:** `ai.communication` (shared baseline), `writing.dialogue` (detailed methodology).
- **Allowed Paths:** `config/ai/AGENTS.md`, `skills/local/volumx-writer/SKILL.md`, `skills/local/volumx-writer/references/terminal-dialogue.md`, `skills/local/volumx-writer/references/dialogue-evaluation.md`, `TASKS.md`.
- **Accepted Invariants:** Preserve approval gates, technical meaning, artifact language rules, and existing repository/memory ownership; no provider-specific runtime changes.
- **Verification:** `skill-check volumx-writer`, `ai-policy-lint`, `ai-memory-check`, `git diff --check`, and delivery boundary check.
- **Runtime Evidence:** Shared context/skill link checks; cross-provider behavioral evaluation is not performed by static validation.
- **Non-Scope:** Model routing, credentials, automatic translation, new memory stores, commit/push.
- **Reopen Conditions:** A supplied dialogue case reveals changed meaning, missed authorization, or unclear language attributable to these instructions.
- **Escalation Conditions:** Any required provider execution or runtime change beyond the instruction-only scope.
- **Evidence:** `RUN-20260910T183355Z-0cd4d108`; completion is determined by its final ledger result. Twelve synthetic behavioral cases are supplied; no cross-provider quality claim is made.

Completed TASK-072 record: [retained history](TASKS-074-history.md).

- **TASK-073 / REQ-MUTATION-COVERAGE (R2).** The two operators now have python shapes:
  `if COND:` / `elif COND:` becomes `if False:`, and `sys.exit(N)` / `raise SystemExit(N)`
  becomes a zero exit. Still two operators, still one per shape — the language changed, the
  question did not. `ai-policy-lint` went from UNMEASURED to 13 surviving mutants on its
  first run, so the half of `bin/` the sweep could not read was not the covered half.
  UNMEASURED survives for node and still fails the run, now naming the language it has no
  shapes for rather than claiming the operators are bash-shaped. Existing bash verdicts were
  proven unchanged rather than assumed: the pre-change binary and the new one produce
  byte-identical reports for `tmux-battery`, `tmux-clip` and `security-check`. A compile
  check on each mutant was written and then removed — applying both operators to every
  matching line of all 23 python subjects yields 519 mutants and 0 that fail to parse, so
  the check could never fire, and a guard that cannot fire is decoration. One recorded
  number was wrong, not regressed: `dev-ready` is 4 survivors, not the 3 the batch run
  reported; the pre-change binary agrees at 4, so the batch under load lost one mutant to a
  timeout that counted as killed. The R3 review found three real defects, none of them
  visible by reading: the working copy of `bin/mutation-sweep` had a diff of the other file
  appended to it by a `$_` that expands to the last argument BEFORE a redirect, not to the
  redirect target, so the tool aborted under `set -u` and returned 1 for every run; the
  operator was dispatched on the substring `exit`, which sent the guard header
  `if msg == "call sys.exit(1) to quit":` down the refusal branch and rewrote its string
  literal instead — the operators stayed two in name and became something else in fact, now
  dispatched on which shape the line IS; and two assertions read "this line is absent from
  the survivor list", which passes equally when a mutant was killed and when it was never
  generated, now backed by a fixture asserting the denominator (three shapes in, `3/3`
  noticed). All three fixes were proven to bite by hand-mutating the tool: reverting the
  dispatch, breaking the python guard shape, and letting UNMEASURED exit 0 each fail the
  suite. Known limit, measured rather than assumed: the guard pattern is textual, so an
  `if ...:` inside a docstring would be mutated as code — 0 of 518 matched lines in the 23
  python subjects are anything but a real `if` per `ast`, so it is a latent trap, TASK-076.
