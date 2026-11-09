# Reading a reference

`dotuiux teardown` measures; this file says what to read from the screens.
The usual miss: a strong reference is reduced to its fonts and palette, then
the build falls back to the template the model always writes. What transfers
from a reference is **composition and restraint**, not colour.

## Per reference, write five lines into `design/refs/<host>/notes.md`

1. **Reading order** — the sections in order, each in a few words of what it
   lets the reader do (from the `outline` in `facts.json` plus the PNG).
2. **Hero geometry** — where text, image, and the one action sit at 360 and
   1440; how tall it is; what peeks below it.
3. **Density** — how much each section shows: one idea with a big image, or a
   comparison table? Count items, not adjectives.
4. **What it leaves out** — the template slots it skips (no stats row, no
   kicker labels, no icon grid, no FAQ). This line prevents most slop.
5. **What transfers** — one or two items, phrased as checkable C-items:
   `C1: hero text left 6/12, product photo right bleeding off the edge;
   stacks photo-first at 360`.

## Rules

- Read at the widths the page will be judged at (360 and 1440). Mobile
  composition is its own decision, not a stacked desktop.
- Several references sharing a convention = a pattern users already know;
  keep it. One reference's signature move = transfer it only when the brief
  needs it.
- The reference's section count is a ceiling hint, not a target. A
  local business page rarely needs a global SaaS site's fourteen sections.
- Never transfer: brand assets, copy, invented-looking metrics, a "live
  dashboard" card when the business has no such product to show.
- A reference that only gives mood (palette, photo style) is a mood item, not
  a composition source; record it as such.

## Smells in your own direction

If the direction reads like any of these, it came from habit, not the
references: a kicker over every heading; `01–05` labels in several sections;
monospace labels to look technical; a fake dashboard card in the hero; a
hairline bento of four stats; tabs + calculator + dark section on one page;
every section a different "interesting" layout. `dotuiux check` warns on the
first three; the rest are judged on the compare sheets.
