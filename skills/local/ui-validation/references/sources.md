# Source ledger

Verified from GitHub on 2026-08-07. Re-check upstream status, license, and
project compatibility before changing tool-selection guidance.

| Source | Role | Status at verification |
|---|---|---|
| https://github.com/microsoft/playwright | Primary browser automation and screenshot reference | Active, Apache-2.0 |
| https://github.com/dequelabs/axe-core | Conditional automated accessibility engine | Active, MPL-2.0 |
| https://playwright.dev/docs/api/class-page#page-wait-for-timeout | `waitForTimeout` and `networkidle` marked discouraged; web-first assertions instead | Checked 2026-09-29 in `docs/src/api/{class-page,params}.md` |
| https://www.w3.org/TR/WCAG22/ | 2.4.11, 2.5.7, 2.5.8 checks in §4 | W3C Recommendation, checked 2026-09-29 |
| https://web.dev/articles/inp | Event Timing observer thresholds (104 ms default, 16 ms minimum) | Checked 2026-09-29 |

Storybook, Lighthouse CI, and visual-regression tooling are deliberately absent
from this ledger: the skill only uses them where a project already ships them,
so their upstream status is not a decision this skill makes. (One data point if
the question ever comes up: lost-pixel was archived in April 2026 — do not adopt
it as a new default.)

Repository activity is evidence about maintenance, not proof that a dependency
belongs in a project. Inspect the project's existing stack first.
