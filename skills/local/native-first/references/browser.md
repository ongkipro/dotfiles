# Browser (HTML / CSS / JS) — native-first

Framework-agnostic. These ship in every evergreen browser, cost zero bytes, and
work the same in Next, Astro, a Liquid theme, or a plain `.html`.

## JS — don't install it; the browser already has it

| Reaching for… | Use instead |
|---|---|
| a currency formatter, accounting.js, numeral.js | **`Intl.NumberFormat`** — `new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)` → `Rp150.000`. Same call with `'en-US'`/`'USD'`. Never hand-roll thousand separators. |
| query-string, qs | `URLSearchParams` (parse, set, `toString()`); `new URL(href)` for the rest |
| a pluralize lib | `Intl.PluralRules` (+ `Intl.ListFormat` for "a, b, and c") |
| an infinite-scroll / lazy-load / scrollspy lib | `IntersectionObserver` |
| a resize/element-query lib | `ResizeObserver` (or `@container`, below — CSS first) |
| a copy-to-clipboard lib | `navigator.clipboard.writeText()` |
| a share-sheet lib | `navigator.share()` (feature-detect; fall back to copy link) |
| a pub/sub or event-bus package | `new EventTarget()` + `addEventListener` / `dispatchEvent(new CustomEvent(...))` |

## HTML — the element already exists

| Reaching for… | Use instead |
|---|---|
| a modal library | `<dialog>` + `showModal()` — backdrop, focus, Esc, `::backdrop`, all free |
| an accordion / collapse library | `<details><summary>` (add `name=""` for exclusive accordion) |
| a progress bar div with inline width | `<progress>`; `<meter>` for a gauge (stock, score, capacity) |
| a searchable-dropdown lib, simple cases | `<input list="x">` + `<datalist id="x">` |
| a textarea auto-grow hook | CSS `field-sizing: content` |
| a JS scroll listener for a sticky header | `position: sticky; top: 0` |

## CSS — do it in CSS, not JS

| Reaching for… | Use instead |
|---|---|
| breakpoint soup for font/spacing sizes | `clamp(min, preferred-vw, max)` — fluid type/spacing, no media queries |
| a JS grid/masonry lib for a card list | `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` — responsive with zero breakpoints |
| a JS "does this parent contain X?" class toggle | `:has()` (parent selector) |
| a component that reads window width | `@container` — size the component by *its container*, not the viewport |
| `!important` wars / specificity hacks | `@layer` (reset, base, components, utilities) |
| Sass just for nesting | native CSS nesting |
| a padding-top percentage hack | `aspect-ratio: 16 / 9` |
| a JS truncate-to-N-lines util | `-webkit-line-clamp` (with `display: -webkit-box`) |
| shipping animation to everyone | wrap it in `@media (prefers-reduced-motion: no-preference)` — accessibility, not optional |
| a carousel library, simple cases | `scroll-snap-type: x mandatory` + `scroll-snap-align` on the children |

## Still worth installing (don't be dogmatic)

`<dialog>` covers a simple modal, but **nested modals or a complex focus-trap** are a real library's job.
`IntersectionObserver` covers infinite scroll, but **virtualising 10k+ rows** needs a virtualiser (TanStack Virtual).
Likewise: a rich-text editor, a date-range picker with locale rules, a charting lib. Say in one line what you skipped and why.

## Validation

Open it in the browser and interact — a green build proves nothing about `<dialog>`, `:has()`, or a scroll snap.
Check at 390px: `document.documentElement.scrollWidth - document.documentElement.clientWidth <= 1`
(compare against `clientWidth`, not `window.innerWidth` — the latter includes
the scrollbar gutter and reports overflow that isn't there).
Keyboard-test anything interactive: Tab in, Esc out.
