# Independent Visual Review

The builder cannot grade its own page. In two observed runs the author's
render critique called a templated page "authored, no cheap-template feel"
while the screenshot showed a highlighted headline word, an eyebrow pill over
every heading, rows of icon-tile cards, and placeholders set as big stats.
`scripts/design-gate.py` therefore accepts only a review written by a context
that did not build the page.

## Who reviews

A separate context with image-reading tools, the accepted design contract,
and the relevant screenshots. Same model/provider is eligible. Vendor diversity
may uncover different failures, but a small number of past disagreements does
not establish a universal model-family rule. Never relabel builder self-review
as independent review.

Run it with this skill's script, never a hand-written prompt:

```bash
python3 scripts/visual-review.py <project> --reviewer claude
python3 scripts/visual-review.py <project> --reviewer codex
```

It slices each full-page screenshot into viewport-height images (a whole
1440x11000 page reaches the reviewer about 55px wide), sends the prompt below
unchanged through `ai-ask` (read-only), and writes `design/review.md` with
prompt, design-context, reference/render image, and output hashes.
`design-gate.py` rejects a review whose prompt or text was edited, or whose
design context or images changed after it ran. In one
run a builder pre-filled `Verdict: PASS` in its own prompt and then `touch`ed
the file after a re-render; both now fail. The current `ai-ask` headless routes
for agy, pi, and omp cannot open image files; this wrapper refuses those routes.
Extend the supported routes only after image access is verified. If no capable
reviewer can start, report UNVERIFIED and the blocker; never waive review to
produce a green gate.

Record the builder under `## Render critique` as `Author: <runtime/model>`.
Each script call starts a fresh review invocation, including through the same
CLI. CLI names are not model provenance: the script records the runtime and
explicitly marks resolved model/provider unavailable when `ai-ask` does not
report them. Hashes detect changed artifacts, not whether images were really
inspected; retain the reviewer's concrete observations and tool evidence.

## Inputs

- The page at narrow and wide widths, full page (for example
  `screenshots/390.png`, `screenshots/1440.png`).
- The inspected reference images cited under `## Reference evidence` (or the
  legacy `## References`): valid ui-ref captures or supplied image paths.
- The design record, including research observations, reference roles,
  transferred principles, audience, and accepted constraints.
- Pillow is used to decode images; missing image tooling is a setup failure,
  never evidence of a passed visual check. Reuse an available environment.

## Prompt

```text
You review a web page you did not build. Open every image listed below using
image-reading tools. If any image cannot be inspected, return UNVERIFIED with
the blocker; never infer visual acceptance from text or source counts.
Judge the renders against the reference roles, observed research, user job,
content, accepted brand, and composition contract below. A familiar visual
pattern is acceptable when those justify it. Be specific; praise without a
named observation is not evidence.

For each page section, top to bottom, write one line:
<section> | generic or authored | look matched (or none) | one concrete fix

Possible template signals to investigate, not automatic failures:
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
- a page that would fit an unrelated business if the name were swapped

For each finding, name the visible problem and its consequence for hierarchy,
task clarity, brand fit, content, responsive behavior, or reference fidelity.
Do not fail a palette, font, radius, repeated card, or headline accent by
itself. Reject unsupported composition and decoration that obscures the task.

Copy that names local standards or places does not make a layout authored:
judge layout, imagery, hierarchy, and repetition. Claims such as "resmi",
"berlisensi", "terpercaya", or "bersertifikat" with no visible source are
findings. Photographs the owner has not supplied yet are owner content, not a
design failure, when the layout is built around them: labeled photo slots
with a one-line shot brief, sized as the real photo will be. Drawings,
diagrams, or generated images standing in for those photos, and layouts
with no place for photos, are findings. Broken or clipped rendering at any
width is always a finding.

Then: cite the inspected image paths and concrete observations. Compare the
transferred principles (hierarchy, rhythm, imagery, density) with the reference
images; name mismatches or explain why the renders fulfill the contract. Do
not invent a missing relationship merely to fill a critique slot. Flag missing
research or transfer rationale; an image list alone is not a design decision.

End with:
Most important change: <one sentence>
Verdict: PASS, REVISE, or UNVERIFIED
Use PASS only after inspecting all images, confirming the research/contract
supports the direction, and finding no unresolved material design issue.
Use REVISE for visible defects or unsupported decisions; use UNVERIFIED for
missing inspection. This is visual acceptance, not interaction/accessibility
test evidence.

Images: <paths>
Direction: <direction and audience lines>
```

## Output

`design/review.md` is written by the script. Do not edit it.

On REVISE the builder fixes the findings, re-renders, updates the render
critique, and requests a new review. The script counts rounds in
`design/review-rounds.log` and refuses a sixth (one run looped 19 rounds over
three hours before passing); then stop and give the owner the remaining
findings. Only the owner clears the log for more rounds. The design record,
including reasons for retaining familiar patterns, is passed to the reviewer.
The round cap bounds repeated review; it does not authorize PASS or prevent
finishing other authorized work. UNVERIFIED is retained and never treated as
acceptance.
