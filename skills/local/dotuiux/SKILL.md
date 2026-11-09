---
name: dotuiux
description: >-
  Start any UI/UX build or redesign: brief, live-site teardown, DESIGN.md, rendered checks via dotuiux. Not visual rules (design-taste) or components (shadcn-ui). Triggers: bikin website, ui ux, landing page, dashboard UI, tampilan, slop.
---

# dotuiux

One loop for every new screen or redesign: **brief → references → direction →
build → check → compare → owner review**. The dotfiles helper `dotuiux` (zero-dependency
Node, tested by `dotuiux-test`) scaffolds the files, captures references, and
runs the rendered checks. The sibling skills own the method; this skill only
puts them in order. Flags come from `dotuiux --help`, not from this file.

Everything it writes lives in the client repository: `design/brief.md`,
`design/refs/`, and `DESIGN.md` at the root (or the accepted design artifact
that already holds those decisions — never a second one). Never copy client
screenshots or reports into `~/dotfiles`.

**Pick the path first:**

| Situation | Do |
|---|---|
| `design/brief.md` and `DESIGN.md` exist and are accepted | build (§4), then `dotuiux check <url>` (§5) |
| Small change inside an accepted system | do it, then `dotuiux check <url>` on the touched route |
| New page, new product surface, or redesign | §1 → §6 in order |
| `DESIGN.md` edited by hand | `dotuiux validate` |
| Choosing where to look for references | [reference-sources.md](references/reference-sources.md) |
| Reading a reference for what transfers | [reference-reading.md](references/reference-reading.md) |

## 1. Brief (owner, ~5 min)

`dotuiux init` scaffolds `design/brief.md`, `design/refs/`, and a `DESIGN.md`
skeleton when none exists. The brief answers the six headings `dotuiux validate`
requires, a line or two each: Niche, Audience (and what they must trust before
acting), Primary job (with the real content we have: photos, prices,
testimonials), Primary action (one), References wanted, Non-goals. The feel
words belong to `DESIGN.md` → Direction. Unanswered headings go back to the
owner — do not invent an audience or content.

## 2. References (owner picks, agent measures)

Three to five URLs: a market leader, a best-in-class product, a niche operator
where one exists, plus one or two mood references the owner chose.

- **Live shipped sites = patterns.** `dotuiux teardown <urls>` opens them in a
  real browser at 360, 768, and 1440 px and records screens plus measured facts
  (fonts and sizes, palette, nav label lengths, button and outbound-link
  counts, images, H1). Section order, steps to convert, and trust signals are
  read from the screens by the agent. Human pace; no bulk crawling; gallery
  hosts are refused.
- **Galleries = mood, picked by a human.** Dribbble, Behance, v0 templates,
  Awwwards, regards.design: the owner pastes one to three items; they inform palette family,
  type character, and photo mood only. Never scraped, never a source for admin
  or storefront patterns.
- Take patterns, never pixels, brand assets, or copy. A convention that most
  references share is one users already know; keep it unless the brief says
  otherwise.
- **Read composition, not numbers.** `facts.json` records each reference's
  section outline (heading, columns, height, media per section). Open the
  PNGs and write, per reference, the reading order, hero geometry, how much
  each section shows, and what the page leaves out —
  [reference-reading.md](references/reference-reading.md). What transfers
  becomes the C-items in §3.

## 3. Direction (agent proposes, owner picks)

Write two or three deliberately different directions from the brief and the
teardown — one accent plus neutrals, at most two typefaces with a scale,
radius, spacing base, photo style, motion profile, three "won't do". Explore
freely here; checks apply to the build, not to options. **The owner picks
one**; record it in `DESIGN.md` using the surface owner's method
(`design-taste` §1 for public pages, `admin-dashboard` §1 for admin) with:

- `Picked-by: owner YYYY-MM-DD (direction B of 3)`. No owner pick = the
  build stays UNVERIFIED; never write the line on the owner's behalf.
- A **composition contract**: `C1:`, `C2:`, … — the reference geometry that
  must survive (hero layout, section rhythm, density), each checkable on a
  sheet at a named width.
- **Sections in order, each with its one job.** More than the surface needs
  (compro ~5–6, landing ~6–8) needs a written reason; `check` warns past 8.
- Under 150 lines. History and rationale go to `docs/`, not `DESIGN.md`.

A stylistic warning the direction chooses on purpose is recorded as
`allow: <rule> — <reason>`.

## 4. Build with the owning skill

| Surface | Owner |
|---|---|
| Public page, compro, landing, storefront visuals | `design-taste` |
| Admin workflow, then admin presentation | `admin-product-ux` → `admin-dashboard` |
| Commerce journey and states | `storefront-ux` |
| React components (CLI first) | `shadcn-ui` |
| Framework code | the installed framework skill |

Styles come from `DESIGN.md` tokens; real content or a labelled placeholder.

## 5. Check

`dotuiux check <url>` renders at 360, 768, and 1440 px and reports **fail**,
**warn**, **allowed**, or **not checked** per item. Fails are broken or harmful
things (contrast, overflow, unreadable text, fake data, contact spam, motion
that ignores reduced motion); loading/empty/error states are not measured — they
stay with `ui-validation`;
fix every fail. A warn asks "is this deliberate?" — fix it or record the
`allow:` in `DESIGN.md`. Not checked is not a pass; name it in the report.
Interaction, keyboard, and themes stay with `ui-validation`.

The template signals (`section-count`, `eyebrow-overuse`, `numbered-labels`,
`mono-overuse`) catch pages that pass every floor rule and still read as a
template: a kicker over every heading, `01–05` labels in every section,
monospace "tech" labels, ten sections because a template had slots. Fix the
composition first; `allow:` only for a decision the brief explains.

**Then compare — gates are not taste.** For a new page or redesign:

```bash
dotuiux compare <url> --ref design/refs/<host>
```

It writes, per width, side-by-side sheets (reference left, build right),
`report.md` with both section outlines and the C-item checklist, and
`review-prompt.md`. Open the sheets yourself, then get **one verdict from
someone who did not build the page**: the owner, or another model given only
the sheets and the prompt (skill `cross-cli`, e.g.
`ai-ask claude -- "$(cat <out>/review-prompt.md)"`; image-capable runtimes
only). The reviewer reads the build blind first ("what business is this?");
a generic answer is REVISE. The builder's own critique never counts as this
verdict. Keep `design/compare/` out of Git unless the repository wants the
evidence.

## 6. Owner review

One pass on the live render, not a mockup, with the compare sheets beside it.
Report visual and behavioral acceptance separately (PASS / REVISE /
UNVERIFIED), and name who gave the visual verdict. No independent verdict =
visual UNVERIFIED. A verified, reusable lesson goes through
`ai-learn capture`, not into this skill.

## Hand-offs

Copy → `copywriting`/`writer`; link `rel` and indexing → `seo-website-builder`;
performance → `web-perf`; motion → `design-taste` (`motion-craft.md`) or the
`gsap-*` skills.
