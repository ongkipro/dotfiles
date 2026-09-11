# Archived task contracts — mutation coverage and public UI quality

Moved out of `TASKS.md` on 2026-09-11 to stay inside the hot-context budget.
Both entries have ledger evidence ending in PASS.

Only completed work belongs here. The first pass of this file swept in TASK-079
and TASK-077 together with the finished records, because both were sitting under
the `Recently completed` heading in full contract form. TASK-077 has no run and
was restored to `TASKS.md`; TASK-079 has a run ending PASS and stays here. The
tell is neither the heading nor the formatting — it is the ledger. `TASKS.md`
says so itself: state is derived, and `resume-brief` derives it from
`.delivery/runs/`. Checking the runs would have separated these two in one
command; reading the file could not.

- **TASK-078 / REQ-PUBLIC-UI-QUALITY (R3, reviewed).** Framework-neutral UX,
  reference research, and contextual anti-slop/evidence review. Skill, policy,
  runtime-link, targeted model cases, and independent review passed.
  Historical run used TASK-074: `RUN-20260910T184228Z-9eb168f3`.
  Contract, findings, and log: `docs/public-ui-skill-audit.md`.

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

- **TASK-081 / REQ-LEDGER-ID-INTEGRITY (R2, reviewed).** A run is evidence for a contract
  only when it names that contract's requirement. `resume-brief` matched runs to tasks by id
  alone, so when another device ran `REQ-PUBLIC-UI-QUALITY` under TASK-074, finished it PASS
  and renumbered its own contract to TASK-079, an unrelated TASK-074 was read as finished and
  left the candidate list without a word. Nothing failed; a queue got shorter, which is the
  quietest way for a derived state to be wrong. Measured over 96 runs and 62 ids: 8 ids carry
  two requirements in the ledger and 7 runs name a requirement their contract does not
  declare, baselined by id with reasons — renumbering a historical run would falsify evidence
  to quiet a lint. Ids no record declares stay exempt: they cannot mark a contract done, and
  14 runs predate the convention. `ai-policy-lint` gained `check_ledger_task_binding` so the
  collision fails loudly; `resume-brief` discounts foreign evidence, keeps the task listed as
  having no run, and names what it discounted, because silently ignoring evidence fails the
  same way as silently accepting it. Gate and derivation are one contract: a lint that fails
  does not help a session that just sees fewer tasks. Two review rounds, six defects, and the
  second round found one the first round's FIX had introduced — bounding the lookahead at the
  next regex hit rather than the next record let a bold bullet cross-referencing another task
  truncate a contract before its own Requirement, reproducing the same silent false completion
  through ordinary prose. An explicit Requirement field now outranks one named in passing.
  Every assertion was proven to bite by reverting its mechanism: ten mutations, ten named
  failures. Two of the first fixtures did not bite and were sharpened rather than kept. Known
  limits recorded rather than fixed: the two parsers are line-for-line duplicates, not a shared
  import; a bullet-only record with a discounted run is more visible than one with no run at
  all; and `resume-brief` degrades quietly on an unreadable run file where the lint fails,
  which is the safe direction — a corrupt file can only manufacture a false "still open".

- **TASK-076 / REQ-MUTATION-COVERAGE (R2, reviewed).** A guard-shaped LINE is not a guard.
  Both patterns matched text without knowing whether it was code, and two different defects
  hid under that: `if x > 0:` inside a docstring is inert, so mutating it changes nothing and
  reporting the survivor sends gap-closing work chasing prose; `exit 124;` inside the quoted
  Perl program in `run_bounded` is real code in a language these operators do not speak,
  rewritten by bash's own rule. Each language now answers with its own instrument. Python uses
  its own parser — the dependency the contract named, so a subject its interpreter cannot parse
  is UNMEASURED by name rather than guessed at. Bash answers in bash, because reaching for
  python there would make every bash subject unmeasurable on a machine without it: a narrow
  blind spot traded for a wide one. Measured: the parser finds 748 statements where the regex
  found 534, of which 541 are rewritable; `ai-memory-access` went from UNMEASURED to 11
  statements; 4 of 297 bash targets sit inside a heredoc or quoted string — `ai-doctor:75/93`
  and `mutation-sweep:83/101`, all four the same Perl fallback — now EMBEDDED rather than
  mutated as bash. Verdicts were proven unmoved rather than assumed: byte-identical reports for
  `tmux-battery`, `tmux-clip`, `security-check` and `ai-policy-lint`.

  The parser also exposed guards the line-based rewrite cannot touch, which were being skipped
  in silence — one subject printed `KILLED 1/1` beside eleven guards it had never reached. They
  are now UNREACHED, they fail the run, and a subject carrying them is not called fully covered.
  The first count was reported as 207 multi-line conditions and that was wrong: splitting the
  two shapes apart showed **205 with a body on the same line as the `if`** and **2** whose
  condition genuinely spans several lines. A true count with a false explanation is how a report
  starts being read past, so the two are now counted and named separately.

  Writing the bash scanner produced six defects of its own, and every one of them was the
  scanner being lied to by text it could not tell from code — the same disease as the bug it
  was written to cure. Two were caught by measuring:
  `<<<` is a here-STRING, and reading it as a heredoc opened a region that never closed,
  swallowing every guard after `done <<< "$targets"`; and a comment glob matching any indented
  line CONTAINING a `#` skipped the line that opened a string. Three more came from independent
  review, all of them the scanner being lied to by text: a continuation line of an open string
  that begins with `#` was treated as a comment, so the quote never closed and real guards after
  it were reported EMBEDDED — coverage removed, dressed as honesty; `<<\EOF`, the idiomatic
  "do not expand this body" form and therefore exactly where a foreign program gets embedded,
  was not recognised as an opener at all; `cat <<A <<B` captured only the first delimiter,
  leaving the second body to be read as bash; and the opener scan ran on the raw line BEFORE
  quoted spans were removed, so `echo 'usage: cat <<EOF > file'` opened a heredoc that never
  closed and every guard after a usage message was dropped from coverage. Two of these are the
  very failure TASK-076 exists to close, reachable through ordinary shell idiom; two remove real
  coverage while looking like caution, which is the worse direction. The ordering that fixes the
  last one cuts both ways — removing quotes first would have eaten `<<'EOF'`, so the delimiter's
  own quoting is unwrapped before quoted spans are stripped, and a string opening on the same
  line as a `<<NAME` wins, because that is what bash itself does with it.

  Fourteen mechanisms, fourteen hand mutations, fourteen named failures. Three fixtures did not bite
  and were sharpened rather than kept: the here-string one asserted a line was mentioned, which
  stayed true when it was mentioned as EMBEDDED; the comment one used an unindented opener the
  loose glob never matched; and one mutation was invalid rather than survived — replacing
  `while` with `if` left a dangling `done` and broke the tool outright, which is not evidence
  of anything. Known limits recorded, not fixed, both TASK-083: `MAX_MUTANTS` caps at 20 and a
  subject with more guards reports `KILLED 20/20` with the rest neither tested nor named, and
  `os._exit(N)` is not in the refusal vocabulary.
