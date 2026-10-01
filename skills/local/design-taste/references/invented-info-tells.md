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
| Placeholder contacts (`johndoe@…`, `example.com`, `555-…` phone numbers) | Where are the owner's real email, phone, or WhatsApp number? |
| "Most popular" / "Best seller" / "Terlaris" badge | Which sales or usage data picked this item, and from when? |
| Round or falsely precise numbers (`99.99%`, `10x`, `47.3%`) | Is there a source and a date? |
| Product "screenshot" drawn in divs | Is a real screenshot available, or is it labeled as an illustration? |

## Decorative filler (ask: what does it tell the reader?)

- Tile pagination (`01 / 4`) when every tile is already visible.
- Generic step labels (`Step 01`, `Phase II`) where order is not the point.
- A three-word strip under the hero; a scroll cue ("Scroll to explore", a
  bouncing arrow) on a page whose fold already shows content; middle-dot runs.
- Emoji in headings or buttons used as decoration rather than as the brand's
  established voice.
- Pulsing status dots, `infinite` / `animate-pulse` on elements that report no
  live state.
- Pills laid over photography; vertical rotated text; micro-sentences under
  eyebrows.
- A bento grid with an empty cell; score bars on a full track.

## Hollow copy (ask: could this sentence sit on any competitor's page?)

- Filler words (elevate, seamless, unleash, supercharge, empower, next-gen,
  revolutionary, cutting-edge, game-changer, AI-powered when the AI is not the
  point the reader needs).
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

## Conflict step: the owner asks for a tell

When the owner explicitly asks for one of these markers (a "Most popular"
badge, a scroll cue, emoji buttons): name the tell and the question it raises,
ask **once** whether a real source or reason exists, then follow the owner's
decision and record it in the design read as an allowed pattern
(`Allowed patterns: "Most popular" badge — owner request, source: <data or
none given>`). Do not re-litigate it in later passes. Fabricated proof is the
exception: numbers, reviews, or scarcity that have no source stay out
regardless (`SKILL.md` delivery gate).

## Audit outcome per finding

Each finding ends in exactly one of:

1. **Allowed** — quote the design-read entry that allows it.
2. **Not this tell** — cite `file:line` and say why (e.g. the data is live).
3. **Problem** — fix it, or list it for the user.

Fix only lines this task wrote; list pre-existing tells for the user rather than
rewriting them (scope). Report as two groups, **Checked (with `file:line` or a
computed value)** and **Handed over, UNVERIFIED**. Compute contrast
with `python3 scripts/contrast.py '#831843' '#FDF2F8'` (8.83:1); do not
eyeball it.

## Scanning caveat

`python3 scripts/tells-scan.py <dir>` (stdlib, from this skill's directory;
`scripts/test-tells-scan.py` is its check) lists these markers in displayed text
of html/astro/jsx/tsx/vue/svelte/liquid files as questions. It reads text
between tags plus `alt`/`aria-label`/`placeholder`/`title`, never class or style
values. It also reports emoji in headings/buttons and **one action intent under
several labels** (e.g. `Get started` / `Start free trial` / `Sign up` across the
scanned files) as a question for the copy owner. Exit 2 means no scannable
files: report **not checked**.

`--css` scans css/scss/astro/jsx/tsx/vue/svelte/html source for style habits,
also as questions: the number of uppercase tracked micro-labels against the
number of `<section>`s, `100vh`/`h-screen`, outline removal with no
`:focus-visible` in the same file, fixed-px grid columns, `animate-pulse` or
`infinite` loops, scroll event listeners, and `overflow-x: hidden` on
html/body/main. Each can be correct; the finding asks for the reason.

**Em-dash decision:** the em dash is correct punctuation (§5 of
surface-and-mode-rules.md), so it is not a tell. The scanner prints only an
uncounted `info:` line with the total, for writers who keep an optional house
preference against it; it never appears as a finding. Punctuation style belongs
to `copywriting` / `volumx-writer`.

The scan is line-based: an element split across lines is missed.

A text search over `src/` is not a clean bill: content may live in JS arrays, a
CMS, `.ts` data files, or a directory the search never matched (e.g. an app
without `src/`). Empty grep output means "not found by this grep", not "absent".
Report an inapplicable or unreachable scan as **not checked**, never as passed.
