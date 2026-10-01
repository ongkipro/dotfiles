# Source ledger

Verified from GitHub on 2026-08-07. Re-check upstream status, license, and
project compatibility before changing tool-selection guidance.

| Source | Role | Status at verification |
|---|---|---|
| https://github.com/microsoft/playwright | Primary browser automation and screenshot reference | Active, Apache-2.0 |
| https://github.com/dequelabs/axe-core | Conditional automated accessibility engine | Active, MPL-2.0 |
| https://playwright.dev/docs/api/class-page#page-wait-for-timeout | `waitForTimeout` and `networkidle` marked discouraged; web-first assertions instead | Checked 2026-09-29 in `docs/src/api/{class-page,params}.md` |
| https://www.w3.org/TR/WCAG22/ | 2.4.11, 2.5.7, 2.5.8 checks in §4 | W3C Recommendation, checked 2026-09-29 |
| https://playwright.dev/docs/aria-snapshots, /docs/test-snapshots, /docs/api/class-pageassertions, /docs/test-cli | `toMatchAriaSnapshot`, `toHaveScreenshot` defaults, `--update-snapshots` modes in §5 | Checked 2026-10-02 (`@playwright/test` latest 1.63.0) |
| https://playwright.dev/docs/accessibility-testing | `AxeBuilder` scoping and tags in §4 | Checked 2026-10-02 (`@axe-core/playwright` latest 4.13.0) |
| https://www.w3.org/WAI/ARIA/apg/patterns/ (dialog-modal, combobox, grid) | Keyboard contracts in §4 | W3C WAI APG, checked 2026-10-02 |
| https://web.dev/articles/inp | Event Timing observer thresholds (104 ms default, 16 ms minimum) | Checked 2026-09-29 |

Storybook, Lighthouse CI, and visual-regression tooling are deliberately absent
from this ledger: the skill only uses them where a project already ships them,
so their upstream status is not a decision this skill makes. (One data point if
the question ever comes up: lost-pixel was archived in April 2026 — do not adopt
it as a new default.)

Repository activity is evidence about maintenance, not proof that a dependency
belongs in a project. Inspect the project's existing stack first.
