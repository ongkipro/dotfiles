# Design Discovery and Direction Record

Use for a new surface or material redesign before the first visual edit. Skip
online discovery for a bounded change inside an accepted visual system; inspect
and preserve repository evidence instead.

## Research sequence

1. Resolve the subject, audience/job, global versus localized-global versus
   country-specific market, locale, content/assets, business constraints,
   accessibility, and installed visual system. Unresolved audience or market
   behavior routes to `product-intelligence`; do not invent a persona.
2. Inspect a small relevant set of professional production references and
   authoritative design-system/accessibility guidance. Include local products
   when language, market, culture, trust, payment, or fulfilment behavior is
   local; use mature global products for breadth.
3. Record the observed pattern, why it transfers, and what must not be copied.
   Community examples may reveal failure patterns but do not establish product
   truth. Do not assemble a collage of competitor brand treatments.
4. If the brief leaves a material choice open, compare two or three genuinely
   different directions. Score audience/job fit, content and asset needs,
   accessibility, responsive behavior, implementation cost, and risk, then
   recommend one. If evidence clearly selects one, state it directly rather
   than manufacture alternatives.
5. Derive one justified signature from the subject's materials, tools,
   artifacts, vernacular, content, or operating environment. Express it through
   composition, type, imagery, interaction, or texture—not a decorative badge.
   Distinctive may be restrained; it does not mean maximal, animated, or loud.

## Direction record

| Reference | Observed principle | Transfer rationale | Do not copy |
|---|---|---|---|
| [Source/date] | [Pattern] | [Fit to audience/job] | [Brand/product-specific element] |

| Candidate | Audience/job fit | Assets/content | Accessibility/responsive fit | Cost/risk | Decision |
|---|---|---|---|---|---|
| [Direction] | [Evidence] | [Needs] | [Evidence] | [Trade-off] | Selected / Rejected / Open |

- Selected direction and rationale: [decision].
- Subject-derived signature: [one reproducible choice].
- Anti-template rule: [how composition avoids repeated equal cards, nested
  frames, excessive containers, uniform large rounding, ornamental badges,
  default bento grids, and unsupported KPI/chart shells].
- Design dials: [variance, motion, density with reasons].

## Canonical design artifact

In a suite, write the accepted direction into
`docs/spec/10-DESIGN-SYSTEM-WHITELABEL.md` and reference UX/market decisions in
`docs/spec/17-UX-FLOWS-SCREEN-CONTRACTS.md`. In a standalone repository, extend
its accepted design artifact, or create `DESIGN.md` only when durable
cross-screen decisions need an owner and none exists. Never create a parallel
`design-tokens.md`.

Minimum reusable visual record:

```markdown
## Visual Direction
- Audience/job and market model: ...
- Character expressed through concrete choices: ...
- Subject-derived signature: ...
- Reference decision: ...

## Tokens
- Theme: default; dark shipped or out-of-scope; surface temperature and reason
- Colors: action, on-action, canvas, surface, raised, border, ink levels, status
- Typography: display and body families, sizes, weights, loading
- Spacing: base and scale
- Shape: radius system and exceptions
- Elevation: border/shadow rules
- Motion: durations, easing, reduced-motion behavior

## Accessibility Notes
- Verified contrast pairs, restricted tokens, focus, reflow, motion, and theme limitations
```

Token values must be executable or testable, use semantic names, and follow the
installed framework/component system. Record why each major choice fits the
accepted audience and content.
