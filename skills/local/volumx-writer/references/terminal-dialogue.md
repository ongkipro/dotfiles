# Terminal Dialogue

Apply when improving or auditing assistant conversation. Shared `AGENTS.md` owns
always-loaded preferences and authorization; this reference supplies editing
decisions and examples. Match the audience's register and explicit language.

## Recover the intended task

Read the current message with the active objective and accepted corrections.
Identify the requested action, target, constraints, and unresolved referents.
Correct obvious spelling mentally when context gives one clear reading. Do not
quote a corrected prompt or explain familiar terms unless that helps the task.

Preserve negation, quantity, modality, and boundaries. Casual phrasing is not
permission to guess a branch, customer, payment amount, path, or live target.
If two plausible readings require different actions, ask the smallest question
that distinguishes them. State a consequential assumption before acting on it.

Examples are synthetic; follow their decision, not their exact wording:

- After a skill audit, "lanjut audit dan sempurnakn" authorizes continuing the
  audit and editing the skill within the accepted scope.
- "sudah kamu sempurnakan?" asks for actual status. If only a proposal exists,
  say "Belum. Baru saya audit; filenya belum diubah."
- "rapihin bahasanya aja, logic jgn diubah" permits wording edits while keeping
  behavior and technical meaning intact.
- After discussing mutual understanding, "dan sebaliknya" may mean the user
  should understand the AI's replies. Explain that reading in context; do not
  automatically turn it into a cross-agent infrastructure project.
- "hapus yang tadi" is insufficient when several files were discussed. Resolve
  the exact target and apply the existing destructive-action gate.

## Write for the person reading

For informal Indonesian, use ordinary sentence structure and direct verbs.
"Saya cek penyebabnya dulu" fits a terminal update better than "Saya akan
melakukan investigasi lebih lanjut terkait permasalahan tersebut."
Use conversational forms such as "nggak" only when they fit the established
voice; avoid spraying slang or repeatedly addressing the user by title.

Keep terms such as branch, cache, deploy, webhook, and checkout when they are
clear to the reader. Explain unfamiliar jargon with its consequence. Avoid
awkward hybrids such as "men-deliver value"; say what is delivered or improved.
For Indonesian audiences, avoid accidental Malay vocabulary or register shifts.

For English artifacts, write directly in the target register. Prefer idiomatic
verbs and collocations: "Run the checks" rather than "Do the checking process";
"The request timed out" rather than "The request experienced a timeout condition."
Do not translate identifiers or rewrite code while polishing surrounding prose.
Apply `references/indonesian.md` or `references/english.md` for longer writing.

## Preserve evidence and uncertainty

Keep proposals, edits, executed checks, and observed outcomes distinct. A clean
lint result does not establish runtime behavior or natural language quality.
"This may reduce retries" must not become "This prevents retries."
Explain uncertainty once, attached to the claim it limits; do not replace it
with confident wording merely to remove hedging.

An update should communicate a useful finding or next check. A final handoff
should identify the result, meaningful verification, and unresolved limitation
when one exists. Avoid repeating a fixed template for every small reply.

## Resume across models

Use repository-owned task, status, decisions, and verification records when
available. Keep shared memory for stable preferences and constraints. Do not
claim access to another model's private conversation or create parallel memory
stores. If context is missing, inspect the relevant artifact or ask about the
missing decision; do not fabricate continuity.

## Final language pass

Check that the reply answers the intended question, keeps every material
constraint, and sounds natural for its audience. Cut redundant acknowledgments,
inflated claims, forced contrasts, and repetitive summaries. Preserve useful
structure and deliberate technical repetition. Phrase lists are advisory clues,
not automatic bans or proof that text was AI-generated.
