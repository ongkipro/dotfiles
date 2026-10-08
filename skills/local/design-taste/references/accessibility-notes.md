# Accessibility Notes: Web Interface Checks and Project Record

Two parts: a short list of web interface checks that are easy to miss, then an
optional project-record template. The canonical contrast and theme rules remain
in [design-taste](../SKILL.md); browser evidence belongs to `ui-validation`.

## Web interface checks

Paraphrased from the Vercel Web Interface Guidelines
(https://github.com/vercel-labs/web-interface-guidelines, MIT) and Emil
Kowalski's `skills` (MIT); filtered to what applies across stacks.

| Area | Check |
| --- | --- |
| Anchors | In-page targets have `scroll-margin-top` at least the sticky header height |
| Focus | A sticky header or bottom bar never hides the focused element (`scroll-padding-top/bottom` on the scroller) |
| Brand names | Brand, product, and code names carry `translate="no"` so auto-translate does not rewrite them |
| Paste | Never block paste, including password, OTP, and confirmation fields |
| Spellcheck | `spellcheck="false"` (React `spellCheck={false}`) on email, username, code, and OTP inputs; set `autocomplete`, `inputmode`, and `type` to match |
| Hit targets | Label and control form one target (wrapping `<label>` or `for`/`id`); no dead gap between a checkbox and its text |
| Submit | The submit button stays enabled until the request starts; then show progress and prevent double submit. On error, move focus to the first invalid field and keep the user's input |
| Modals | `overscroll-behavior: contain` on scrollable modal/drawer content so the page behind does not scroll |
| Drag | While dragging, mark the rest of the UI `inert` (or disable selection) so stray hovers and text selection do not fire |
| Gestures | Every swipe, drag, pinch, or hold action has a visible button or keyboard alternative (WCAG 2.5.1, 2.5.7) |
| Motion media | Use `<video>` (muted, `playsinline`, poster) instead of large GIFs; anything that moves for more than 5 seconds has a pause control (WCAG 2.2.2) |
| Numbers | Prices, quantities, and table figures use `font-variant-numeric: tabular-nums` where columns or changing values must align |
| Dark mode | Native `<select>`, date inputs, and scrollbars follow `color-scheme`; set explicit option background/text colors where a platform ignores it (theme-implementation.md) |
| Focus | Never `outline: none` without a visible `:focus-visible` replacement; focus is trapped, moved, and returned per the WAI-ARIA APG pattern |
| Zoom | Never disable zoom (`user-scalable=no`, `maximum-scale=1`); mobile inputs use at least 16px text so iOS does not zoom on focus |
| URL state | Filters, tabs, pagination, and expanded panels are reflected in the URL; Back/Forward restores them and the scroll position |
| Navigation | Navigation uses `<a>`/framework `Link` (Cmd/Ctrl/middle-click work), never `<div onClick>`; anything that looks clickable is clickable |
| Feedback | Destructive actions confirm or offer Undo; toasts and inline validation use a polite `aria-live` region; a loading button keeps its label next to the spinner |
| Unsaved work | Warn before navigation discards unsaved form changes |
| Motion | Animate compositor-friendly properties (`transform`, `opacity`, `filter`, `clip-path`) and measure anything else; never `transition: all` (list properties); animations are interruptible; honor `prefers-reduced-motion` by removing movement and keeping opacity/color feedback; WCAG 2.3.3 (AAA) lets interaction-triggered motion be disabled (motion-craft.md §6) |
| Overflow | Text containers handle short, average, and very long content (`truncate`, `line-clamp-*`, `break-words`); flex children that truncate need `min-w-0` |
| States | Empty, sparse, dense, and error states are designed; skeletons mirror final layout so nothing shifts; no dead ends without a next step |
| Lists | Virtualize lists beyond roughly 50 rows; mutations target under 500 ms or show progress |
| Hydration | Controlled inputs pair `value` with `onChange` (or use `defaultValue`); date/time output is guarded against server/client mismatch |
| Locale | Dates, times, numbers, and currency use `Intl.DateTimeFormat` / `Intl.NumberFormat`, never hand-built strings |
| Status | State is never conveyed by color alone; icon-only buttons have an accurate `aria-label`; native elements before ARIA |

**Not adopted here:** English typographic rules such as forcing Title Case on
headings and buttons or converting straight quotes to curly quotes. Indonesian
and Malay copy use sentence case conventions of their own; capitalization and
punctuation belong to `copywriting` / `volumx-writer`, not this skill.

## Project accessibility record (optional template)

Copy into the project's canonical design artifact; do not create a parallel
token file or record project facts in this skill directory. Compute ratios with
`python3 scripts/contrast.py` instead of eyeballing them.

```markdown
## Accessibility notes

| Token or pair | Context | Measured ratio | Requirement | Restriction or remediation |
|---|---|---:|---|---|
| `<foreground>` on `<background>` | `<text/control/theme>` | `<ratio>` | `<AA/AAA/project rule>` | `<allowed use or required change>` |

- Keyboard/focus exceptions: <none or evidence-backed exception>
- Light/dark differences: <pairs re-derived rather than inverted>
- Verification source and date: <tool/manual check, YYYY-MM-DD>
```
