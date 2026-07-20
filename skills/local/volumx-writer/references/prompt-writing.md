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
