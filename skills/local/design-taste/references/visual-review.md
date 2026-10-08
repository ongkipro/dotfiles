# Independent Visual Review

The builder cannot grade its own page. In two observed runs the author's
render critique called a templated page "authored, no cheap-template feel"
while the screenshot showed a highlighted headline word, an eyebrow pill over
every heading, rows of icon-tile cards, and placeholders set as big stats.
`scripts/design-gate.py` therefore accepts only a review written by a context
that did not build the page.

## Who reviews

A model from another family than the builder, through another installed CLI.
On the same page a fresh Gemini subagent of the Gemini builder rated every
section "authored" and passed; Claude, given the identical prompt, returned
REVISE with eight sections it called generic, and those findings matched a
human read. A same-family subagent is not independent enough.

Run it with this skill's script, never a hand-written prompt:

```bash
python3 scripts/visual-review.py <project> --reviewer claude   # builder agy/Gemini or Codex
python3 scripts/visual-review.py <project> --reviewer codex    # builder Claude
```

It slices each full-page screenshot into viewport-height images (a whole
1440x11000 page reaches the reviewer about 55px wide), sends the prompt below
unchanged through `ai-ask` (read-only), and writes `design/review.md` with
prompt, image, and output hashes. `design-gate.py` rejects a review whose
prompt or text was edited, or whose screenshots changed after it ran. In one
run a builder pre-filled `Verdict: PASS` in its own prompt and then `touch`ed
the file after a re-render; both now fail. If no other family is installed,
record `gate-allow: review - <why>` and report the review as same-family.

Record the builder under `## Render critique` as `Author: <runtime/model>`;
the script refuses a reviewer from the same family.

## Inputs

- The page at narrow and wide widths, full page (for example
  `screenshots/390.png`, `screenshots/1440.png`).
- One or two reference captures (`design/refs/<name>/1440.png`).
- The direction and audience lines from the design file.

## Prompt

```text
You review a web page you did not build. Open every image listed below and
judge only what is visible. Be specific; praise without a named reason is not
evidence.

For each page section, top to bottom, write one line:
<section> | generic or authored | look matched (or none) | one concrete fix

Generic looks to check (a match is generic unless the direction asks for it):
- dark navy or near-black hero with a dot/grid texture and a spec or
  "blueprint"/terminal panel beside the headline
- one word of the headline in the accent color or a gradient
- a small pill or tracked uppercase eyebrow above most headings
- rows of 3-4 equal cards with an icon in a tinted tile, title, text
- the same card treatment for unrelated kinds of content
- monospace for labels or figures that are not code or tables
- `A // B`, `A · B · C`, `LAYANAN 01`, `03 / Section` labels
- `→` on every button; checkmark bullet lists in every card
- big stat figures that are placeholders or unsourced claims
- warm cream + serif + terracotta; near-black + one acid accent
- a page that would fit an unrelated business if the name were swapped

Copy that names local standards or places does not make a layout authored:
judge layout, imagery, hierarchy, and repetition. Claims such as "resmi",
"berlisensi", "terpercaya", or "bersertifikat" with no visible source are
findings. Photographs the owner has not supplied yet are owner content, not a
design failure, when the layout is built around them: labeled photo slots
with a one-line shot brief, sized as the real photo will be. Drawings,
diagrams, or generated images standing in for those photos, and layouts
with no place for photos, are findings. Broken or clipped rendering at any
width is always a finding.

Then: compare with the reference captures. Name one relationship the
references have (hierarchy, rhythm, imagery, density) that the page lacks.

End with:
Most important change: <one sentence>
Verdict: PASS or REVISE
Use PASS only if no section matches a generic look the direction did not ask
for and you can name what makes the page specific to this business.

Images: <paths>
Direction: <direction and audience lines>
```

## Output

`design/review.md` is written by the script. Do not edit it.

On REVISE the builder fixes the findings, re-renders, updates the render
critique, and requests a new review. The script counts rounds in
`design/review-rounds.log` and refuses a sixth (one run looped 19 rounds over
three hours before passing); then stop and give the owner the remaining
findings. Only the owner clears the log for more rounds. A gate-allowed look
(`gate-allow:` line in the design file) is passed to the reviewer as part of
the direction.
