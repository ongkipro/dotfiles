# Technical and Product Documentation

- Optimize for correctness, task completion, and maintainability before elegance.
- Preserve identifiers, APIs, commands, file paths, code blocks, schemas, status names, and requirements language.
- Distinguish current behavior, proposed behavior, decisions, assumptions, and open questions.
- Use MUST, SHOULD, and MAY consistently when normative language is intended.

## Developer-doc conventions

Unless the project's own style guide says otherwise:

- Address the reader as "you"; use active voice so the actor is clear; present tense for behavior.
- Put the condition before the instruction ("If the build fails, run …").
- Numbered lists for ordered steps, bullets for everything else; sentence case headings.
- Code font for code, commands, paths, and identifiers; bold for UI element names.
- Descriptive link text, never "click here"; unambiguous dates (`2026-10-02`).
- Do not pre-announce unreleased features.

Source (accessed 2026-10-02): Google developer documentation style guide highlights <https://developers.google.com/style/highlights>.

## PRD and architecture

Include only relevant sections: problem, users, goals, non-goals, flows, functional requirements, non-functional requirements, data model, integrations, permissions, observability, risks, acceptance criteria, and open questions.

## Procedures

State prerequisites, ordered steps, expected results, failure modes, and rollback or recovery when relevant.

## API and README

Use valid examples. Never invent endpoints, parameters, environment variables, or output fields. Mark placeholders clearly.
