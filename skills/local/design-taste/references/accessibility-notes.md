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
