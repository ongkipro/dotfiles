# Admin Visual Contract — sizes, surfaces, and measured proof

Use this before building or changing any admin screen. It exists because admin
work kept landing "too small, too big, or not precise" and picking up
AI-template ornament: sizes were chosen per screen from several conflicting
sources, then judged from screenshots. Here one contract decides every size and
surface, and `scripts/admin-geometry.mjs` measures the render against it.

## 1. Precedence — exactly one contract per product

1. **The repository's own accepted contract** (`design/admin-contract.json` or
   the project's documented tokens). Repository disk wins.
2. **House default** — the owner's accepted admin (shadcn new-york-v4), contract
   [`assets/size-contracts/volum-default.json`](../assets/size-contracts/volum-default.json).
   Default for every new admin unless the owner chooses otherwise.
3. **Compact clean-light** ([`compact.json`](../assets/size-contracts/compact.json))
   only when the owner explicitly asks for a denser back office.

Pick one at project start, copy it to `design/admin-contract.json`, and record
the choice. Never mix values from two contracts, never pick a size per screen,
and never take a number from the generic density ladder or Carbon/Fluent tables
when a contract exists; those are background evidence, not instructions.

## 2. Size roles

Every visible size maps to one role. A value not in this table is a defect, or
an intended deviation recorded in the project contract with its reason.

| Role | volum-default | compact | Tailwind / shadcn (default → compact) |
|---|---|---|---|
| Root font | 16px | 16px | never change `html` font-size or use `zoom` to "fit" |
| Body, table cell, form control text | 14px | 14px | `text-sm` (inputs `text-base md:text-sm`: 16px on phones stops iOS zoom) |
| Meta, table header label, badge | 12px | 12px | `text-xs` |
| Section / card title | 16px / 600 | 16px / 600 | `text-base font-semibold` |
| Page title | 24px / 700 | 20px / 600 | `text-2xl font-bold tracking-[-0.02em]` → `text-xl font-semibold` |
| KPI value | 24px / 700 | 20px / 600 | same as page title; never larger than it |
| Button: sm / default / lg | 32 / 36 / 40 | 28 / 32 / 36 | `h-8/h-9/h-10` → change `buttonVariants` sizes to `h-7/h-8/h-9` |
| Icon button | 36 (toolbar 32) | 32 | `size-9` (`size="icon"`), toolbar `size-8` |
| Input, select trigger: form / toolbar | 36 / 32 | 32 | `h-9` form, `h-8` table toolbar → `h-8` everywhere |
| Header | 64px | 48px | `h-16` → `h-12` |
| Sidebar expanded / icon rail | 256 / 48 | 240 / 48 | `SIDEBAR_WIDTH 16rem`/`3rem` → `15rem`/`3rem` |
| Table header row | 40px | 32px | `TableHead h-10` → `h-8` |
| Table cell padding | 8px | 6px × 8px | `TableCell p-2` → `px-2 py-1.5` |
| Page padding | 16px × 24px | 16px | `Main` `px-4 py-6` → `p-4` |
| Gap: related / section | 8 / 16 or 24 | 8 / 16 | `gap-2` / `gap-4`, `space-y-6` between page sections |
| Icon in text | 16px | 16px | `size-4`, `text-muted-foreground` |
| Touch (`pointer: coarse`) | ≥ 44px hit area | ≥ 44px | raise height or hit area; WCAG 2.5.8 floor is 24px |

Compact requires editing the owned primitives once (`button.tsx`, `input.tsx`,
`select.tsx`, `table.tsx`, `sidebar.tsx`), not overriding classes per call site.
Per-call `className="h-7"` sprinkled through features is exactly the drift this
contract prevents.

## 3. Clean surfaces — the anti-slop list

An admin screen is quiet: hierarchy comes from type, alignment, whitespace,
dividers, and tables, not from decoration. The scripted checks fail the build
evidence; the review items are checked by eye in `ui-validation`.

| Do not | Do instead | Check |
|---|---|---|
| Rounded colour-filled box holding an icon (KPI cards, list rows, empty states, settings links) | Plain 16px icon in `text-muted-foreground` beside the label, or no icon | `icon-tile` (scripted) |
| Gradients on surfaces, text, buttons, borders, or avatars | Flat `bg-background` / `bg-muted` tokens | `gradient` (scripted) |
| Soft drop shadow on every card | 1px `border`; shadow only on overlays (dialog, menu, popover, toast) | `shadow` max `shadow-sm` (default) / none (compact) |
| Random radii, `rounded-2xl`/`3xl` panels, pill-shaped buttons | Contract radii only: 4 / 6 / 8 / 10 (compact 4 / 6 / 8); full radius only for avatars and status dots | `radius` (scripted) |
| Rainbow of tinted chips and coloured panels | ≤ 5 distinct accent colours per screen, each with a meaning; status = icon/shape + text + colour | `accent-surfaces` (scripted) |
| Card around every region, cards inside cards | Sections separated by spacing and headings; one card only for a genuinely separate object | review |
| Coloured left-border accent bars, glow rings, glassmorphism, `backdrop-blur` outside overlays | Nothing; use a heading or a divider | review |
| Decorative blobs, illustrations, emoji, sparkles, "AI" badges | Real empty-state text plus the next action | review |
| Hover lift/scale/translate on rows and cards | Background tint on hover, visible focus ring | review |
| KPI card with icon tile, sparkline, delta chip, and footnote all at once | Label, value, one comparison sentence; add a sparkline only when the trend is the decision | review |
| Uppercase tracked micro-labels over every section | Sentence-case 14px/16px headings | review |

The stock house admin passes every scripted check; generated screens are what
add the ornament.

## 4. Measure, do not eyeball

```bash
# against the production build or preview (dev servers inject devtools overlays)
node ~/dotfiles/skills/local/admin-dashboard/scripts/admin-geometry.mjs \
  http://localhost:4173/orders --contract design/admin-contract.json \
  --viewports 390,1366,1536 --out design/evidence/geometry-orders
```

- Exit 0 = every visible element within the contract; 1 = drift (report names
  each offender with its value and label); 3 = no working browser — report
  **not checked**.
- **Viewports:** 390 (phone), 1366 and 1536 (common laptop CSS widths at 100% and
  125% OS scaling), plus the owner's actual screen once known — record it in the
  project contract. A screen judged only at 1280 or 1440 can still feel too
  large on a 1366 laptop.
- `NOT-CHECKED` means the page had no such element; measure a route that has
  tables or forms before claiming those roles pass.
- Measure every route you changed, in a state that shows its real content
  (seeded data, filters open where relevant). Overlays are only measured when
  opened; open them in a Playwright test when they are part of the change.
- `touch-target` is advisory: it lists controls under 44px on a phone so you
  decide where a larger hit area is needed.
- To adopt a deliberate change (e.g. a 72px header for a two-row shell), edit the
  project contract and record the reason beside it. Never widen `allowed` just to
  turn a run green.
