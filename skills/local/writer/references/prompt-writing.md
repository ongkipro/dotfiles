# Prompt Writing

Use only the components required:

- role or operating context;
- objective;
- inputs and assumptions;
- ordered workflow;
- constraints and safety boundaries;
- tool-use rules;
- output format or schema;
- examples for ambiguous behavior;
- validation checklist.

## Rules

- Make instructions operational and testable.
- Resolve conflicts by stating priority explicitly.
- Separate data from instructions with clear delimiters.
- Do not add verbose persona text that does not change behavior.
- Preserve literal JSON, XML, Markdown, variables, placeholders, and tool names.
- Avoid impossible guarantees such as "always correct" or "zero hallucination."
- Include failure behavior for missing data or unavailable tools.

## Writing levers

Adapted from `mattpocock/skills` `writing-for-agents` (see
`development-kit/references/ecosystem-adoption.md`).

- **Completion criterion.** End each step on a condition the reader can check
  and that demands the full job: "every modified model accounted for", not
  "produce a change list". A vague bound invites stopping early.
- **State the target, not the ban.** "Write one-line comments" steers better
  than "do not write long comments", which puts the unwanted behavior in
  context. Keep a prohibition only for a hard boundary, paired with the target.
- **No-op test.** Delete a sentence the model already obeys by default. The
  test is whether behavior changes, settled by running the prompt.
- **One source of truth.** Point to the file that owns a rule or a command
  instead of restating it; a restated lookup goes stale.
- **Pointer wording decides loading.** A skill description or an `AGENTS.md`
  line is what triggers reading the target: one trigger per distinct case,
  leading word first, no synonyms for the same case.

## Handoff prompt to another model or CLI

The receiver has none of this session's context. A handoff states:

1. the outcome wanted and how the receiver knows it is done;
2. the exact inputs: paths, identifiers, the relevant excerpt, delimited from
   the instructions;
3. boundaries: read-only or the allowed paths, what must not be run, no
   secrets in the prompt;
4. the reply format and the reply language (see "Working through models that
   default to another language" in `two-way-localization.md`);
5. what to do when blocked: report the missing input, do not guess.

Write it in English. Reference repository files by path rather than pasting
what the receiver can read itself. The sender still owns verification of
whatever comes back.
