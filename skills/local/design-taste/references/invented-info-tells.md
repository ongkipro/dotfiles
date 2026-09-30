# Invented-Information Tells: Questions, Not Bans

Companion to `surface-and-mode-rules.md` §5. Each item is a marker that models
add to look authentic when the brief never supplied the fact. Treat every one as
a **question aimed at the brief**, never an automatic defect: a real timezone
strip for a real studio, a real "Est." year, or a genuine version label is fine.

Adapted from the `tells` catalogue in AThevon's `genjutsu` (MIT); native-mobile,
palette-dataset, and pipeline parts deliberately excluded.

## Invented facts (ask: where did this come from?)

| Marker | Question |
| --- | --- |
| Locale/clock strip (`LIS 14:23 · 18°C`, `GMT+1`) | Does the user need the time or weather here, and is it live? |
| Fake build/status text (`v0.6.2-rc.1`, `last sync 4s ago`) | Is it real, generated from the build, or decoration? |
| Heritage or year stamp (`ESTD. 2018`) | Is the year in the brief? |
| Section/part codes (`SEC-01`, `MK.I`, `Plate 03`) | Does the reader navigate by them? |
| Stock or viewer counters, scarcity | Is there a backend source? (never fabricate) |
| Photo credits, "House archive" captions | Is there a real credit? |
| Placeholder people/companies (`John Doe`, `Acme`) | Replace with real content or mark as concept |
| Round or falsely precise numbers (`99.99%`, `10x`, `47.3%`) | Is there a source and a date? |
| Product "screenshot" drawn in divs | Is a real screenshot available, or is it labeled as an illustration? |

## Decorative filler (ask: what does it tell the reader?)

- Tile pagination (`01 / 4`) when every tile is already visible.
- Generic step labels (`Step 01`, `Phase II`) where order is not the point.
- A three-word strip under the hero; a scroll cue; middle-dot runs.
- Pulsing status dots, `infinite` / `animate-pulse` on elements that report no
  live state.
- Pills laid over photography; vertical rotated text; micro-sentences under
  eyebrows.
- A bento grid with an empty cell; score bars on a full track.

## Hollow copy (ask: could this sentence sit on any competitor's page?)

- Filler verbs (elevate, seamless, unleash, supercharge, empower).
- One intent under several button labels (`Get started` / `Start free trial` /
  `Sign up`); keep one label per intent (`SKILL.md` §4.7 copy rule).
- Poetic section labels ("Field notes") and mannered proof ("Quietly trusted
  by") where a plain label serves.
- Register drift between sections. Reflex display faces or warm-paper grounds
  chosen because they are a habit, not because the brief named them.
- Copy owner: `copywriting` and `volumx-writer`. This list flags, they fix.

## Allowed patterns protocol

When the design read (`SKILL.md` §1) deliberately uses one of the above, record
it: `Allowed patterns: <named pattern + reason>` or `none`. A mood word
("editorial", "premium") unlocks nothing; only a named pattern with a reason
does. Guessability test: if the direction could be written from the product
category alone, it is a default, not a decision.

## Audit outcome per finding

Each finding ends in exactly one of:

1. **Allowed** — quote the design-read entry that allows it.
2. **Not this tell** — cite `file:line` and say why (e.g. the data is live).
3. **Problem** — fix it, or list it for the user.

Fix only lines this task wrote; list pre-existing tells for the user rather than
rewriting them (scope). Report as two groups, **Checked (with `file:line` or a
computed value)** and **Handed over, UNVERIFIED**. Compute contrast
(`#831843 on #FDF2F8 = 9.4:1`); do not eyeball it.

## Scanning caveat

`python3 scripts/tells-scan.py <dir>` (stdlib, from this skill's directory;
`scripts/test-tells-scan.py` is its check) lists these markers in displayed text
of html/astro/jsx/tsx/vue/svelte/liquid files as questions. It reads text
between tags plus `alt`/`aria-label`/`placeholder`/`title`, never class or style
values. Exit 2 means no scannable files: report **not checked**.

A text search over `src/` is not a clean bill: content may live in JS arrays, a
CMS, `.ts` data files, or a directory the search never matched (e.g. an app
without `src/`). Empty grep output means "not found by this grep", not "absent".
Report an inapplicable or unreachable scan as **not checked**, never as passed.
