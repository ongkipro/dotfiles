# 1.5 DESIGN CONTEXT PRECEDENCE (tokens beat taste)

If the session or project carries a design spec — a `<design-context>` block,
a `design-tokens.md` / `DESIGN.md` in the repo, or an established theme in
the codebase — that spec WINS over every aesthetic default in this skill.
This skill then only polices execution quality (contrast, states, layout
discipline, AI tells), never repaints the brand.

Precedence, highest first:
1. Explicit design-context / token spec provided for the task
2. Brand assets already in the codebase (CSS variables, Tailwind config,
   existing components — extract before inventing)
3. This skill's defaults

Reading a design-context correctly:
- Tokens (colors, type scale, spacing, radius, shadows, motion durations)
  are law. Use them verbatim; do not "improve" the palette.
- The rationale section tells you WHY — apply its logic to new surfaces the
  spec doesn't cover, instead of falling back to this skill's taste.
- Its accessibility notes carry known traps (e.g. an accent that fails AA
  as text color and is button-background-only). Honor them exactly.
- If the design-context describes a dense product console (dense tables,
  13px base, fixed sidebar nav), you are in `admin-dashboard` territory:
  keep the tokens, hand the patterns to that skill.

When a project has NO spec yet and you make real design decisions, leave a
`design-tokens.md` behind in the repo so the next session inherits them:

```markdown
---
name: <project>
description: <one line: accent + canvas + personality in ten words>
theme: { default: light, dark: shipped | out-of-scope,
         white-temperature: warm | cool, why: <one line> }
colors: { primary, on-primary, primary-hover, ink, ink-secondary, ink-muted,
          canvas, surface, raised, border, link, status-* as needed }
typography: { display: family/size/weight, body: family/size/weight }
spacing: { base: 4px, scale: [...] }
radius: { sm, md, pill }   # must match the Shape Lock choice
shadows: { card, modal }   # only for things that genuinely float
motion: { duration-base, easing }
---
