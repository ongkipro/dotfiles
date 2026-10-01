# Reference Fidelity: Research → Capture → Rebuild → Measure → Improve

Use this when the owner supplies content (for example a skincare catalogue) and
wants a site that matches a strong existing reference precisely before it is
improved. It exists because eyeballed references drift into generic kit layouts,
flat type scales, and rigid equal sections. Every step leaves an artifact, and
fidelity is **measured**, not asserted. Builds on
[design-discovery.md](design-discovery.md) (reference roles and the composition
contract) and ends with `impeccable` and `ui-validation`.

## 0. Boundary

Reproduce **structure, proportion, rhythm, hierarchy, and interaction
patterns**. Never copy a reference's logo, photography, illustrations, copy,
trademarks, proprietary fonts, or source code. Use the owner's content and
licensed or owner-supplied assets; pick a licensed typeface with the same
character when the reference font is proprietary. A clone of another brand's
identity is out of scope even when asked; propose the structural match instead.

## 1. Intake (from the owner's data)

Record in the project's design artifact: audience and market (locale, currency,
language), primary task (buy, book, enquire), the real content inventory
(number of products, variants, imagery type and aspect ratios, copy length,
reviews, certifications), brand assets that already exist, and constraints
(stack, CMS, performance budget). The content inventory decides which
references can fit: a 15-SKU catalogue with lifestyle photos does not fit a
reference built around one hero product and long editorial copy.

## 2. Research — shortlist with evidence

Start from the matching [niche-patterns/](niche-patterns/README.md) file: its
search queries seed the shortlist, its content inventory and claim traps feed
step 1 and step 6, and its reference-set table (URL, role, access date,
observation, what does not transfer) is copied into the project's design
artifact and filled there; project findings never go back into the skill.
Search in this order and keep only live, inspected pages:

1. Direct and aspirational brands in the same category and market
   (e.g. "Indonesian skincare brand website", category leaders abroad).
2. Curated galleries filtered by category (Awwwards, Godly, Land-book,
   Siteinspire, Lapa, One Page Love) — treat them as leads, then open the site.
3. Platform showcases matching the stack (Shopify theme stores, Astro themes).

The research lane can be delegated (`cross-cli` skill): for example
`ai-ask agy --timeout 900 -- "<brief + inventory>; list 8 live sites with URL and why each fits"`.
Treat the list as leads; verify every URL yourself.

Score each candidate 0–2 on: content-shape fit, audience/market fit, conversion
pattern fit (PDP, bundles, subscriptions), imagery fit, mobile quality,
performance (does it load fast), accessibility basics. Choose **one target
composition reference** and at most two directional references (type, colour,
interaction). Record URLs, access date, scores, and what transfers or does not.

## 3. Capture — measure the reference

```bash
node ~/dotfiles/skills/local/design-taste/scripts/ui-ref.mjs capture <URL> --out design/ref/<name>
```

This writes `ref.json` and full-page screenshots at 390, 768, and 1440 px:
section order and heights, column counts, heading sizes, role type scale
(h1/h2/p/button: size, weight, line height, tracking, family), dominant text and
surface colours, and radii, all read from computed styles. It uses any working
local Chrome/Chromium (no npm dependency); `CHROME_BIN` overrides. Cookie or
promo overlays appear in screenshots — note them, do not reproduce them.

Then **look** at the screenshots and fill the composition contract (C1–C7 in
design-discovery.md) with the measured numbers: "hero 810 px tall at 1440,
single column; product row 4 cards; h2 36 px / body 16 px; radius 8–10 px".

**Generated comp as a concept reference.** When no live reference fits and the
owner accepts a generated mockup as a starting point, treat it as a labelled
*concept reference*, never as evidence. Use one readable image per section
(not a whole page shrunk to a thumbnail), and before writing the composition
contract strip everything the generator invented: statistics, logos, ratings,
testimonials, certifications, and product claims. What remains is geometry,
hierarchy, and mood. Record it in the reference table with role "concept,
generated" and route the image-to-code build and polish through `impeccable`;
`ui-ref.mjs compare` cannot measure an image, so judge it side by side.

## 4. Rebuild — macro pass with the owner's content

Build the page frame, section order, proportions, and responsive transforms
first, with real content, before details. Put measured values into tokens
(spacing, type scale, radii, colours derived for the owner's brand, not the
reference's). Implement in the project's stack; component kits implement the
contract, they do not choose the layout.

## 5. Measure — compare until structure matches

```bash
node ~/dotfiles/skills/local/design-taste/scripts/ui-ref.mjs compare design/ref/<name> http://localhost:4321/ --out design/fidelity/<date>
```

It captures the build at the same viewports and reports section count, section
height (×0.8–1.25), column count, heading and role sizes (±15%), weight and
family, background colours (ΔE), dominant radius, and page length. Exit 1 means
major drift. Fix and re-run until no **major** findings remain, then compare the
screenshots side by side for what numbers miss (crop, overlap, alignment, image
treatment).

## 6. Improve — deliberate, recorded deviations

Only after the structural match, improve it for this owner: contrast and focus
states, tap targets, loading speed, clearer price/CTA hierarchy, local payment
and shipping trust, Indonesian copy length, real reviews. Write each change as an
**intended deviation** ("h1 40 px instead of 57.6 px: Indonesian product names
are longer; tested at 390 px") so the next compare run separates intent from
drift. Do not "improve" by adding decoration (see invented-info-tells.md).

## 7. Validate

Run the `impeccable` critique/polish pass, `scripts/tells-scan.py` on the source,
and `ui-validation` (keyboard, reduced motion, both breakpoints, real flows).
Report fidelity with the latest `report.md`, the deviation list, and what
remains UNVERIFIED.

## Why output is generic or rigid, and the fix

| Symptom | Usual cause | Fix in this workflow |
|---|---|---|
| Looks like every AI landing page | No target reference; kit defaults filled the gaps | Step 2 shortlist + step 3 contract; "do not substitute" list |
| Rigid, equal-height blocks | Sections sized by component defaults, not content | Measured section heights and column counts; compare flags drift |
| Flat hierarchy | One heading size reused everywhere | Role type scale from `ref.json`; compare checks h1/h2/p/button |
| Wrong mood despite right colours | Font family and weight substituted silently | Family/weight findings; choose a licensed match deliberately |
| Fake trust badges, invented numbers | Filling space without content | invented-info-tells.md + owner's real inventory |
| "Matches" claimed without proof | Visual judgment from memory | `report.md` + screenshots attached to the task evidence |
