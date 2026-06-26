# Listing Copywriting Rules + Templates

Conversion-focused, SEO-friendly product copy. Confirm **market, language, and brand policy** in the pilot step; defaults below assume US / English / generic-brand. Give this file to subagents verbatim (with a product batch JSON of `{id, title, specs, category, price}`) and have them write a JSON array to a file.

## Hard rules
1. **Brand:** generic by default — NEVER put brand names (Robotime, Rokr, NeeDoh, etc.) in title/metaTitle/tags/imageAlt. Use the store's own brand only if the user asks. Body may use generic praise, no third-party brands.
2. **Never** include country of origin, "Brand Name: NONE", or logistics/shipping text.
3. Fix ALL typos from the source title.
4. Use ONLY facts from the source title + provided specs. Don't invent piece counts, sizes, materials. Feature any theme/name in the title (it's the selling point).
5. **No CTA** anywhere ("buy", "shop", "add to cart", "order now").

## Output fields (per product)
- **title** ≤70 — primary keyword first, Title Case, no comma-stuffing/ALL-CAPS/brand. `[Primary Keyword] – [Theme/Feature] [Audience]`.
- **handle** — lowercase-hyphenated, keyword-based, ≤6 words, no random IDs, **unique**.
- **metaTitle** ≤60 — keyword-focused. **Do NOT append "| StoreName"** unless asked.
- **metaDescription** ≤155 — benefit + primary keyword. No CTA, no brand.
- **bodyHtml** — structure below, **no CTA / no shipping line**:
  ```html
  <p><strong>[hook].</strong> [1-2 sentences: what it is + core benefit].</p>
  <h3>Why you'll love it</h3>
  <ul><li><strong>[benefit]</strong> — [detail].</li> … 3-5 …</ul>
  <h3>Specifications</h3>
  <table><tr><td>Material</td><td>…</td></tr> … known specs only …</table>
  ```
  End after the specs table.
- **imageAlt** ≤120 — SEO description of the photo, generic brand.
- **tags** 6-9 lowercase — category + 1-2 features + audience + gift modifier. No brand.
- **productType** — short label (e.g. `3D Wooden Puzzle`, `Fidget Toy`, `Marble Run Kit`).
- **collection** — one slug from the agreed collection list for the store.

## Tone
Warm, benefit-led, concrete — sell the experience (relaxing, satisfying, display-worthy, great gift). No fluff, no unverifiable claims.

## Example (toy / 3D wooden puzzle)
- title: `3D Wooden Landmark Puzzle – Tower Bridge, Big Ben & Eiffel Tower`
- metaTitle: `3D Wooden Landmark Puzzle Model Kit for Adults`
- metaDescription: `Build iconic landmarks—Tower Bridge, Big Ben or the Eiffel Tower—from real wood. A relaxing no-glue DIY 3D wooden puzzle and a great gift for adults.`
- handle: `3d-wooden-landmark-puzzle-model-kit`
- tags: `["3d wooden puzzle","model building kit","diy puzzle","mechanical puzzle","architecture model","gift for adults","stem toy","gifts for teens"]`

## Subagent dispatch pattern (large catalogs)
Split products into batches of ~15-20. Each subagent: read this file + its batch JSON, generate copy, **write a JSON array to a file** (`out_N.json`), reply only with count + "valid JSON". Then the main agent merges, validates (limits, brand leak, CTA, unique handles, allowed collection), and applies via `productUpdate`.
