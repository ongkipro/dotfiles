# Source ledger

Verified from GitHub on 2026-08-07. Re-check upstream status, license, and
project compatibility before changing tool-selection guidance.

| Source | Role | Status at verification |
|---|---|---|
| https://github.com/microsoft/playwright | Primary browser automation and screenshot reference | Active, Apache-2.0 |
| https://github.com/dequelabs/axe-core | Conditional automated accessibility engine | Active, MPL-2.0 |

Storybook, Lighthouse CI, and visual-regression tooling are deliberately absent
from this ledger: the skill only uses them where a project already ships them,
so their upstream status is not a decision this skill makes. (One data point if
the question ever comes up: lost-pixel was archived in April 2026 — do not adopt
it as a new default.)

Repository activity is evidence about maintenance, not proof that a dependency
belongs in a project. Inspect the project's existing stack first.
