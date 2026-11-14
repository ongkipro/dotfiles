# One Primitive Library per Project

A shadcn/ui project builds its components on exactly one headless library,
named by `base` in `shadcn info --json`:

| `base` | Package imported by `components/ui` | Typical style names |
|---|---|---|
| `base` | `@base-ui/react` | `base-nova`, other `base-*` |
| `radix` | `radix-ui` (unified) or legacy `@radix-ui/react-*` | `radix-nova`, `new-york` |
| `aria` | `react-aria-components` | `aria-*` |

Two libraries in one admin bundle ship two focus, portal, positioning and
dismissal implementations, two prop conventions (`asChild` vs `render`), and
two sets of state attributes. Agents then copy whichever file they opened
last, and the split widens. It happens quietly: one component added from a
blog, a hand-installed `@radix-ui/react-slot`, or an item viewed under the
wrong style.

Checked against shadcn CLI 4.23.0, the CLI docs, and `@base-ui/react` 1.9.0
type definitions on 2026-11-12.

## 1. Detect

```bash
npx shadcn@latest info --json          # base, style, installed components
rg -l --glob '*.{ts,tsx}' "from ['\"](radix-ui|@radix-ui/)" <ui-dir> <components-dir>
rg -l --glob '*.{ts,tsx}' "from ['\"]@base-ui/react" <ui-dir> <components-dir>
rg -l --glob '*.{ts,tsx}' "from ['\"]react-aria-components" <ui-dir> <components-dir>
```

Search both the `ui` alias directory and the feature components: feature code
sometimes imports a primitive directly. More than one non-empty result is a
mixed project. Also read `package.json`: an installed but unimported
primitive package is dead weight to remove.

## 2. New project

- Choose `base` once, at `init --base`. Default to `base` (Base UI): it is
  the shadcn default, every new component ships for it, and `toast` is
  Base UI only. Pick `radix` only when the project must share code with an
  existing Radix codebase; pick `aria` only for React Aria's accessibility
  model on purpose.
- `style` is immutable after init and carries the base, so the choice is a
  re-init, not an edit.
- Record the choice where the project records decisions (ADR or design
  system doc) and add the guard in §5 in the first commit.

## 3. Existing project on one library

- `add` new items through the CLI only; it generates them for the project's
  style. Never paste a component from another style's docs page, registry
  item, or blog.
- Third-party registry items: inspect with `add <item> --dry-run` and
  `--view`; reject or rewrite an item whose files import the other library.
- Do not hand-install `@radix-ui/*`, `radix-ui`, `@base-ui/react`, or
  `react-aria-components` to make one item work.

## 4. Mixed project: converge on the declared `base`

There is no CLI migration between libraries. `migrate radix` only rewrites
`@radix-ui/react-*` imports to the unified `radix-ui` package; it does not
move a project to Base UI or the reverse.

Work only when the convergence is in scope. A mixed project that is a live
production line for other users is a separate task with its own approval;
do not start it as a side effect of another request.

1. **Inventory.** List every file importing the minority library, every
   consumer of those components (`rg -n "<ComponentName>"`), and every
   consumer use of library-specific props and state selectors:
   `asChild`, `onSelect` on menu items, `checked="indeterminate"`,
   `onOpenAutoFocus` / `onCloseAutoFocus`, `delayDuration`,
   `data-[state=open|closed|checked]`, `--radix-*` CSS variables.
2. **Regenerate, do not hand-port.** For each component, get the declared
   base's version from the registry (`add <item> --dry-run --view <file>` or
   `view <item>`), then merge the project's local edits (tokens, sizes,
   classes) into it by hand. Keep the registry's structure and primitive
   calls; carry over only intentional local changes.
3. **Update consumers** with the API table in `SKILL.md` §4. Typical Radix →
   Base UI moves:
   - `asChild` + child element → `render={<Element />}`; a non-button
     rendered by `Button` also needs `nativeButton={false}`.
   - Menu item `onSelect` → `onClick`; `event.preventDefault()` to keep a
     menu open becomes `closeOnClick={false}` on the item.
   - Checkbox `checked="indeterminate"` → `indeterminate` prop (boolean),
     with `checked` kept boolean.
   - Dialog/Sheet `onOpenAutoFocus` / `onCloseAutoFocus` → `initialFocus` /
     `finalFocus` on the popup (boolean, ref, or function).
   - Tooltip provider `delayDuration` → `delay` (plus `closeDelay`).
   - State selectors: `data-[state=open]` → `data-open`,
     `data-[state=checked]` → `data-checked`; `--radix-*-transform-origin` /
     `--radix-*-available-height` → `--transform-origin` /
     `--available-height`; trigger width → `--anchor-width`.
   Confirm each prop against the Base UI API page linked from
   `shadcn docs <component>`; the list above is a checklist, not the API.
4. **Remove** the minority package from `package.json` once nothing imports
   it, and reinstall so the lockfile drops it.
5. **Prove it.** Run the project's type check and tests, render every admin
   island that uses a changed component (an island that throws during SSR
   answers 200 with an empty body), and exercise each changed control in a
   real browser at a narrow and a wide viewport: open, keyboard, focus
   return, dismiss, selection (`ui-validation`).

Convert one component family per commit (dialog + sheet, dropdown menu,
tooltip + sidebar, checkbox + switch, separator + badge) so a regression
points at one family.

## 5. Guard

Add one test that fails when a second library appears. Adjust the allowed
package to the project's `base` and the paths to its aliases:

```ts
// ui-primitive-library.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ALLOWED = /from ["']@base-ui\/react/; // base = "base"
const FORBIDDEN = /from ["'](radix-ui|@radix-ui\/[^"']+|react-aria-components)["']/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|astro)$/.test(name) ? [path] : [];
  });
}

test("components use one primitive library", () => {
  const offenders = files("src/components").filter((file) =>
    FORBIDDEN.test(readFileSync(file, "utf8")),
  );
  assert.deepEqual(offenders, []);
});

test("package.json declares no second primitive library", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const extra = Object.keys(deps).filter((name) =>
    /^(radix-ui|react-aria-components|@radix-ui\/.+)$/.test(name),
  );
  assert.deepEqual(extra, []);
});
```

`ALLOWED` documents intent; the assertion is on `FORBIDDEN`. While a mixed
project is mid-convergence, list the not-yet-converted files in an explicit
allowlist that the test also fails on when an entry no longer needs it, so
the list can only shrink.
