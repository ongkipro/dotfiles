# Two-way understanding and locale-native communication

Use for ambiguous intent, explanation repair, or localization. This is a
communication contract, not permission to execute commands or invent a locale's
social norms.

## Understand before acting

1. Recover the active project, desired outcome, requested action, constraints,
   negation, and referents from the current exchange and accepted repo contract.
   Read typos and mixed-language phrases in context; do not rewrite the user's
   message back to them as a grammar lesson.
2. Separate intent from proposed implementation. "Make ecommerce complete"
   does not mean "replace it with a simple online shop". Preserve accepted
   roles, order states, payment, inventory, and operational requirements; reuse
   only compatible reference patterns. A reference is not a new product brief.
3. If uncertainty changes the target, authorization, scope, or irreversible
   outcome, ask one discriminating question. Otherwise state the consequential
   assumption briefly and proceed within existing authorization.
4. Research an unknown fact against current primary sources; do not research
   the owner's personal intention as if a web source could decide it. Mark
   inference, proposal, and verified evidence separately.
5. For a substantial request, offer a compact breakdown: intended outcome,
   constraints, steps, and evidence of completion. Do not demand confirmation
   again when the user already authorized those steps.

## Make the explanation usable

Lead with the answer or outcome, then its practical consequence. Define an
unfamiliar technical term through the user's actual workflow. Keep caveats,
negation, amounts, identifiers, and what has not been tested.

For a consequential choice, expose the trade-off and a concrete example. Offer
one focused check-back when it would detect a real misunderstanding ("Does this
need to reserve stock before payment, or only after payment is confirmed?").
Do not quiz the user, append "understand?" to every reply, or claim shared
understanding merely because the user said "okay". If the user corrects you,
state the corrected interpretation, identify what changes, and adjust the
existing plan instead of adding an unrelated task.

Example (synthetic):
- User: "lanjut, jangan jadi toko sederhana; checkout dan gudang tetap lengkap"
- Interpretation: continue the accepted commerce product; preserve checkout and
  inventory workflows; simplifying presentation does not authorize deleting
  operational capability.
- Reply: "Saya rapikan tampilannya tanpa mengurangi alur checkout dan stok.
  Setelah edit, saya akan uji pembayaran, reservasi stok, dan pembatalan sesuai kontrak repo."
  Name only tests actually applicable; report their results after execution.

## Localize the communication, preserve the meaning

Establish language **and locale**, audience, relationship, channel, purpose,
brand voice, and register. A country alone does not determine any of these.
User samples and accepted terminology outrank generic guidance. Keep the
explanation language separate from the artifact language.

- Compose in the target language's natural syntax; do not translate Indonesian
  politeness formulas, slang, salutations, or paragraph order mechanically.
- Check forms of address, pronouns, salutation/closing, degree of formality,
  idioms, and inclusive wording against audience evidence or a locale guide.
  German `du` versus `Sie` is a brief decision, not a claim that all German
  readers prefer one. Do not infer informality from Indonesian `kamu` alone.
- Distinguish language variants when material: Indonesian versus Malay,
  German for Germany versus Switzerland, or British versus American English.
  Ask only when that difference changes the deliverable; otherwise disclose a
  bounded assumption and preserve a provided sample's conventions.
- Verify date, decimal, currency, units, address, and plural forms. Prefer
  platform locale formatting for generated data; never convert amounts or
  legal meanings silently. Keep code, commands, URLs, and placeholders exact.
- Back-check the target version against a short meaning ledger: facts,
  uncertainty, conditions, action, audience, exclusions, numbers, and claims.
  Back-translation is a diagnostic, not proof of idiomatic quality.
- For an unfamiliar language or a consequential public/legal translation,
  mark native-reader or domain review as pending. This workflow supports
  research across languages; it does not certify fluency in every language.

## Working through models that default to another language

Applies when the active or delegated model is Chinese-first (DeepSeek, Kimi,
MiMo, MiniMax, GLM, Qwen) or when any model's output drifts into a language
the owner does not read.

- **Owner-facing replies stay Indonesian.** The model's reasoning language is
  its own; forcing reasoning into the reader's language lowered answer accuracy
  in the cited study, so constrain the reply, not the thinking.
- **Prompts to another model are written in English**, not Chinese: the owner
  can audit an English prompt, and a translation the owner cannot read is an
  unverifiable step. State the reply language explicitly in that prompt
  ("Reply in Indonesian" or "Reply in English"), because instruction alone
  does not hold reliably: language drift is documented for DeepSeek and in
  the Language Confusion Benchmark, and worsens with long or complex prompts.
- **Check the reply's language before relaying it.** Translate any Chinese
  passage into Indonesian, keep identifiers and quoted strings exact, and
  re-ask once with the language stated when the whole reply came back in the
  wrong language. Report the drift instead of silently paraphrasing around it.
- **Exempt from translation:** code, commands, paths, URLs, package names,
  proper nouns, and text the owner supplied in quotes.
- A translation by the same model is a reading aid, not verified meaning. For
  a contract, a policy, or an instruction that triggers money or a live
  change, mark the translation as unverified and name the passage.

## Learn corrections safely

Keep temporary preferences in the session. A correction becomes a durable
candidate only when the owner states it as persistent or repeated evidence
supports the same scoped lesson. Record the corrected pattern and scope, not
raw private dialogue, demographic stereotypes, or an invented personality
profile. Use the existing reviewed learning loop; never auto-promote a guess
or modify policy to make an earlier response look correct.

## Evidence status

The guidance above was reviewed with synthetic Indonesian/German cases by a
single model (recorded in the delivery ledger, 2026-10-29). That is a guidance
consistency check, not proof of native register quality in any language.
Before relying on a locale deliverable, obtain a reader of that locale or a
domain reviewer and record their verdict with the artifact; treat this file as
unverified for a locale until that happens.

## Sources and adoption boundary

- Microsoft Localization Style Guides, inspected 2026-10-29:
  <https://learn.microsoft.com/en-us/globalization/reference/microsoft-style-guides>.
  The directory explicitly separates language conventions and market-specific
  formats and provides German and Indonesian guides. Open the applicable guide
  for actual locale work; this directory alone is not evidence of a specific
  country's preferred tone. Vendor guides describe vendor style, not a whole
  population.
- Language drift and reasoning language, inspected 2026-11-15: Marchisio et
  al., "Understanding and Mitigating Language Confusion in LLMs" (EMNLP 2024,
  <https://arxiv.org/abs/2406.20052>): even strong models fail to answer
  consistently in the requested language; complex prompts aggravate it and
  few-shot prompting mitigates it partially. Qi et al., "When Models Reason in
  Your Language" (EMNLP 2025 Findings, <https://arxiv.org/abs/2505.22888>):
  prompting a model to reason in the user's language reduces answer accuracy.
  DeepSeek-V3 issue 1598 (<https://github.com/deepseek-ai/DeepSeek-V3/issues/1598>)
  collects user reports of unrequested Chinese. Abstracts and the issue were
  read. The only local measurement is a small check on 2026-11-15 (two prompts,
  two runs each, three free 9Router rows; inconclusive on language drift;
  Claude, GPT and Gemini unmeasured), so the rules above remain precautions,
  not measured compliance.
- Humanizer, `blader/humanizer`, inspected at commit
  `0ef9fe5bc3572734fd3ae6c448fe00a30cd5dcf0` (MIT):
  <https://github.com/blader/humanizer/blob/0ef9fe5bc3572734fd3ae6c448fe00a30cd5dcf0/SKILL.md>.
  The inspected introduction supports reader-specific editing, voice samples,
  and preserving claims. Adopt those checks, not blanket bans on contrasts,
  punctuation, first-person reactions, or an English-derived universal style.
  No upstream installer or code is executed; no separate humanizer skill is
  needed. Writing style cannot establish AI authorship.
