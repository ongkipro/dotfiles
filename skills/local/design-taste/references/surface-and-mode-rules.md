# Surface-specific rules, AI tells, funnel overrides, and redesign protocol

Extracted from `SKILL.md` §4.5.1–§7 for token economy. Policy sections §0–§4.5
and §8–§9 remain in `SKILL.md`; theme switching code is in
`theme-implementation.md`.

---

## §4.5.1 Editorial, docs, and portfolio surfaces

These run in Brand mode. §2 assigns their dials, but §4.5 is written for
marketing sections, so two of its rules are suspended here: the per-section word
caps (long-form body copy is the point of the surface), and the ">5 items never
ships as a hairline `<ul>`" rule — an index of terms, posts, or projects **is** a
legitimate hairline list, and chunking it into cards is the actual error.
Everything else in §4.5 still applies, including the copy self-audit.

- **Measure wins over grid.** Keep §4.1's `max-w-[65ch]`; docs may go to 75ch
  where scanning beats reading. A full-bleed column of prose is a readability
  bug even when the layout could go wider.
- **Rhythm from one scale.** Heading space is asymmetric off the §4.1 spacing
  scale — roughly 2:1 above vs below (`mt-16 mb-8` at H2) — so a heading binds
  to the text it introduces instead of floating between two blocks.
- **Body furniture needs designing too**, and it is what actually distinguishes
  an editorial surface: figure + caption (caption is secondary ink, never
  centered under a left-aligned column), blockquote (indent or rule, not both),
  code blocks (own scroll container per §4.7, never the page), tables (header
  contrast + `overflow-x` wrapper), and footnote or reference rendering.
- **Docs:** current location always visible, nav reachable without scrolling
  back up, and only the open branch expanded past two levels. A term or entry
  page is a dense index, not a marketing section — density comes from §2's DEN
  dial, not from §4.5's airy defaults. Once it grows a fixed sidebar console and
  data tables, §1.5 hands it to `admin-dashboard`.
- **Portfolio: the work is the design.** An index card is one real image, the
  title, and one line of context, all visible without hover (§4.7). §2 gives
  portfolio VAR 7 / MOT 6 — spend that on the *index grid* (mixed aspect ratios,
  offset rows, load-in cascade), not on the card interior, which stays uniform
  so the work is what varies. Case-study detail follows problem → what you did →
  outcome, with real numbers or none at all.

---

## §4.6 Images

1. Image-gen tool available → generate section-specific assets at the right
   aspect ratio. Never use generated people, testimonials, before/after
   imagery, or results as customer evidence.
2. Else approved brand assets or licensed stock photography.
3. Else labeled placeholder slots + tell the user what's needed. Never fill
   with div-based fake screenshots or hand-rolled decorative SVG
   illustrations.
- Even minimalist pages need 2-3 real images. Text + gradient blob is not a
  hero.
- Logo walls use real SVG logos (Simple Icons / brand assets) or a generated
  monogram for invented brands — not styled text spans. Logos only, no
  category labels under them, working in both themes.

---

## §4.7 Mobile & touch reality

Device behavior, not taste. §6 lists these as non-overridable in funnel mode.

- **iOS Safari auto-zoom:** any `<input>`, `<textarea>`, or `<select>` whose
  computed font-size is under 16px makes Safari zoom the page on focus and
  wreck the layout. Force `text-base` on mobile form controls. On a COD order
  form this is a conversion bug, not a cosmetic one.
- Kill the tap flash (`[-webkit-tap-highlight-color:transparent]`) **only where
  an `:active` state (§4.4) already supplies the feedback** — removing the
  highlight with nothing behind it is the touch version of `outline: none`.
- `select-none` on buttons and tabs. On cards, only the chrome — never the
  price, SKU, or product name, which people legitimately long-press to copy.
- Touch targets ≥ 44px. Never put a required action behind hover only.
- **Fluid over snapping:** card and tile grids use
  `grid-cols-[repeat(auto-fit,minmax(min(100%,<min>),1fr))]` with `gap`, so they
  resize at every pixel width. The `min(100%,…)` is required — a bare
  `minmax(<min>,1fr)` forces horizontal scroll on viewports narrower than the
  min track, i.e. exactly the cheap Android devices §6 targets. Reserve hard
  breakpoints for real layout changes (split → stack, sidebar → drawer), not
  for column counts.
- Bottom tab bars belong to app and storefront shells. Marketing and funnel
  pages don't get one; their mobile anchor is the sticky CTA (§6).

---

## §5 AI TELLS (hard bans unless the brief asks)

Visual: neon/outer glows, pure black, oversaturated accents, gradient text
on big headers, custom cursors, crosshair/hairline decoration grids,
vertical rotated text, `<br>`-and-italic headline splits.

Micro-label slop: version labels in hero (`V0.6`, `BETA`), section-number
eyebrows (`001 · Capabilities`), `01/4` pagination on tiles, "Brand · No.
01" micro-meta, decoration strips at hero bottom (`DESIGN · BUILD · SHIP`),
floating top-right sub-text, weather/locale/time strips, scroll cues
("Scroll to explore"), decorative status dots, pills/labels overlaid on
photos, fake photo-credits (`Field study no. 12`), version footers
(`v1.4.2 · Build 0048`) on marketing pages, "Reservation 412 of 800" fake
counters, generic step labels ("Step 1 / Stage 2" — the verb is the label),
scoring/progress bars with filled background tracks as comparison visuals
(use a number + icon instead).

Copy slop: "Quietly trusted by", performative-craftsman labels ("Field
notes", "On our desks"), mock-humble asides, filler verbs (Elevate,
Seamless, Unleash, Next-Gen), "Jane Doe"/"Acme"/egg-avatar placeholder
data, fake-perfect numbers (99.99%). Replacements, not just bans: use
approved real data; for prototypes, label the data explicitly as sample
content instead of making it look real.

Separator slop: middle-dot `·` max once per metadata line. **Em-dash (`—`)
and en-dash-as-separator (`–`) are fully banned in visible page copy** —
headlines, body, quotes, captions, buttons, alt text. Use period, comma,
colon, parentheses, or plain hyphen. Zero tolerance; it is the #1 AI tell.
This ban outranks any dash separator shown inside `copywriting` skill
templates: keep the template's structure, substitute a colon or hyphen.

Fake product previews: no div-built fake dashboards/terminals/task lists.
Real screenshot, generated image, real mini-component, or nothing.

---

## §6 DR / COD FUNNEL MODE OVERRIDES

Funnel LPs (petanisejahtera/pesantren class) are direct-response pages for
mobile-first ID/MY ad traffic. Conversion evidence beats taste rules. In
this mode:

**Overridden (allowed and often required):**
- **Repeated CTA:** the order CTA repeats after every major persuasion
  block, plus sticky bottom button on mobile. The one-label rule still
  applies (same wording every time), the one-per-intent COUNT rule does
  not. This overrides the single-CTA-band shape in `copywriting`'s LP
  template; CTA WORDING still follows copywriting's rules.
- **Long-form copy:** story → problem → solution → proof → offer → FAQ.
  The 20-word/25-word caps do not apply; section rhythm does.
- **Urgency/scarcity:** allowed when backed by real data (real stock, real
  promo end). Fabricated countdowns and fake "412 of 800" counters stay
  banned — lying breaks trust and ad-account health.
- **Centered, stacked, symmetric layout:** correct here. VAR stays 2-4;
  fancy asymmetry hurts scan-speed on cheap Android devices.
- Single locked light theme, no toggle, no dark-mode variant (§4.2.1).
- Emotional/hype register within platform ad-policy limits; testimonial
  blocks may be long if scannable.

**NOT overridden (still mandatory):**
- Real product images and verified, consented testimonial evidence. Never
  generate customer portraits, quotes, ratings, or before/after proof.
- Contrast audits, label-above-input forms, inline errors — the order form
  IS the product; a broken form is a dead funnel.
- Performance: this traffic is mid-range Android on mobile data. MOT ≤ 3,
  zero JS animation libraries, LCP < 2.5s on the hero image, CLS < 0.1
  (reserve image space).
- All Section 5 AI-tell bans, the em-dash ban, the copy self-audit.
- All of §4.7 (mobile and touch reality). The 16px input floor is a
  conversion rule here, not a style one.
- Never rename form field names / IDs / slugs that tracking (Meta pixel,
  GTM, Scalev) depends on.

---

## §7 REDESIGN PROTOCOL

1. **Detect mode:** greenfield / preserve / overhaul. Ambiguous → ask once.
2. **Audit before touching:** brand tokens (colors, type, radii, logo), IA
   and conversion paths, content blocks worth keeping, patterns to retire,
   current dial reading, SEO baseline (ranking pages, meta, structured
   data — the #1 redesign risk; QA with `seo-website-builder`).
3. **Preserve unless asked:** slugs, anchor IDs, nav labels, copy voice,
   a11y wins, analytics event names/selectors. A purple brand stays purple.
4. **Modernisation levers, in order — stop when satisfied:** typography →
   spacing/rhythm → color recalibration → motion layer → hero recomposition
   → full block replacement (last resort). IA+SEO sound → targeted
   evolution (levers 1-4) wins ~70% of the value at ~40% of the risk.
5. **Never change silently:** URLs, nav labels, form field names/order,
   logo, legal/consent copy.
