# Theme implementation

Mechanics only. The policy — light canonical, dark opt-in, resolution order,
three-state toggle, clock-adaptive caveats — is `SKILL.md` §4.2.1 and wins over
anything here. Read this when you are about to write the code.

## The one rule that breaks everything else

Resolve the theme **before first paint**. A theme applied after hydration
flashes the wrong colours first, and no amount of correct token work hides it.

## Astro

No provider does this for you. Put this in the `<head>` of the base layout.

`is:inline` is load-bearing: without it Astro processes and defers the script,
producing the exact flash you are preventing.

```astro
<script is:inline>
  function applyTheme(root = document.documentElement) {
    let stored = null
    try { stored = localStorage.getItem('theme') } catch {}   // throws when storage is blocked
    const dark = stored === 'dark' ||
      (stored !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', dark)
  }
  applyTheme()
  // ClientRouter replaces <html>'s attributes on navigation — re-apply to the incoming document
  document.addEventListener('astro:before-swap', (e) => applyTheme(e.newDocument.documentElement))
  // "System" must keep tracking the OS after first paint, not just at boot
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme())
</script>
```

It looks defensive because each line stops a real failure a naive version has:

| Line | Without it |
|---|---|
| `try/catch` around `localStorage` | One `SecurityError` in a blocked-storage context (third-party iframe, Safari with cookies blocked, some Android WebViews) kills the whole pre-paint script — no class, no theme, console error before first paint |
| `stored !== 'light'` rather than listing known values | Any unrecognised value (`'auto'` from an old implementation, a corrupted write) silently forces light and skips the OS signal, violating step 2 of the resolution order |
| `astro:before-swap` listener | Every internal navigation flashes: the swap replaces `<html>`'s attributes, destroying the JS-added class. Harmless no-op in projects without `ClientRouter` |
| `matchMedia` change listener | "System" freezes at boot, so the page never follows the OS when it flips at sunset |

## Astro, server-rendered routes

`localStorage` does not exist during SSR, so a returning visitor with a stored
choice is best served from a cookie:

```astro
---
const theme = Astro.cookies.get('theme')?.value  // 'light' | 'dark' | 'system' | undefined
---
<html class={theme === 'dark' ? 'dark' : undefined}>
```

**This removes the flash only for visitors whose cookie holds an explicit
`light` or `dark`. It does not remove the script.** Keep the inline script for
both remaining cases:

- cookie says `'system'` — the server cannot read `prefers-color-scheme`, and
  there is no request header to assume;
- **no cookie at all** (first-time visitor) — server-rendering light here would
  skip step 2 of the resolution order entirely and show a light flash to
  someone whose OS is set to dark.

## React / Next

`next-themes` already injects an equivalent pre-paint script — do not add a
second one. It requires `suppressHydrationWarning` on `<html>`, because the
class is stamped before React hydrates and the markup deliberately differs.
Toggle component and provider setup live in the `shadcn-ui` skill.

## Tailwind v4 prerequisite

`dark:` defaults to the **media** strategy. A toggled `.dark` class does nothing
until the CSS declares a custom variant. Two forms are in circulation:

```css
@custom-variant dark (&:where(.dark, .dark *));   /* Tailwind's documented form */
@custom-variant dark (&:is(.dark *));             /* what shadcn's init writes */
```

Prefer Tailwind's form in a plain Astro/Tailwind project: it also matches the
element *carrying* `.dark`, and `:where()` contributes zero specificity where
`:is()` inherits its argument's. If the project was scaffolded by shadcn it will
have the `:is(.dark *)` form — leave it, but remember it excludes the root
element, so `dark:` utilities on `<html>` itself won't apply.

## color-scheme

Own it in exactly one place. In an Astro/CSS project that is the stylesheet:

```css
:root { color-scheme: light; }
.dark  { color-scheme: dark; }
```

In a `next-themes` project, the library already manages the inline property and
updates it on every theme change — leave it alone, or pass
`enableColorScheme={false}` if you want the CSS rules to own it instead.

What breaks is a **hand-written inline `style.colorScheme` set once at boot**:
inline outranks every selector, so the `.dark` rule becomes dead code and native
controls, scrollbars, and date pickers freeze in the boot-time scheme when the
class later flips. That is why the Astro snippet above sets only the class.

## What to verify before calling it done

Hand these to `ui-validation`:

- Load in dark with a cold cache — no flash of light before paint.
- Reload with a stored choice — it survives, and still wins over the OS setting.
- Flip the OS setting while the page is open, with the toggle on System — the
  page follows without a reload.
- Navigate between pages (with `ClientRouter` if present) — the theme holds.
- Native controls (`<select>`, date input, scrollbar) match the active theme.
