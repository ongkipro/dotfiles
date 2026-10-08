# Motion Platform Support (dated)

Browser support for native motion features, checked 2026-10-08 against the
webstatus.dev API (Baseline) and MDN browser-compat-data. Re-verify quarterly
or before relying on a feature: Interop 2026 includes scroll-driven
animations, cross-document View Transitions, anchor positioning, and
dialog/popover work, so the Firefox and Safari gaps below are expected to
close during 2026-27. Single-engine features are enhancements only; content
must work without them. Decisions and craft rules: [motion-craft.md](motion-craft.md).

| Feature | Chrome | Safari | Firefox | Baseline | Use |
| --- | --- | --- | --- | --- | --- |
| Same-document View Transitions (`startViewTransition`) | 111 | 18 | 144 | Newly, 2025-10-14 | yes, progressive enhancement |
| `view-transition-class` | 125 | 18.2 | 144 | Newly, 2025-10-14 | yes |
| View transition types, `:active-view-transition-type()` | 125 | 18.2 | 147 | Newly, 2026-01-13 | yes |
| `view-transition-name: match-element` | 137 | 18.4 | 144 | not tracked | yes |
| Cross-document `@view-transition { navigation: auto }` | 126 | 18.2 | — | Limited (Interop 2026) | yes; Firefox gets a normal navigation |
| Element-scoped View Transitions | 147 | — | — | Limited, single engine | no for client work |
| Scroll-driven animations (`animation-timeline: scroll()/view()`) | 115 | 26 | — (flag/preview) | Limited (Interop 2026) | only in `@supports`, content visible by default |
| Scroll-triggered animations (`animation-trigger`) | 146 | — | — | single engine | no |
| `linear()` easing | 113 | 17.2 | 112 | Widely, 2026-06-11 | yes |
| `@starting-style` | 117 | 17.5 | 129 | Newly, 2024-08-06 | yes |
| `transition-behavior: allow-discrete` | 117 | 17.4 | 129 | Newly, 2024-08-06 | yes |
| `overlay` property | 117 | — | — | single engine | harmless where unsupported |
| `interpolate-size` / `calc-size()` | 129 | — | — | Limited, single engine | enhancement; elsewhere it snaps |
| Anchor positioning | 125 | 26 | 147 | Limited (`position-anchor` initial value changed; full feature from Chrome/Firefox 151, Safari 27) | core use with a positioned fallback |
| Container scroll-state queries | 133 | — | — | Limited, single engine | enhancement |
| Popover API | 114 | 17 | 125 | Newly, 2025-01-27 | yes |
| `popover="hint"` | 151 | — | 153 | Limited | not yet |
| `<dialog closedby>` | 134 | — | 141 | Limited | not without a fallback |
| `sibling-index()` / `sibling-count()` | 138 | 26.2 | 154 | Newly, 2026-08-18 | with a fallback |
| `prefers-reduced-motion` | yes | yes | yes | Widely, 2020-01-15 | required |
| `prefers-reduced-transparency` | 118 | — | — | Limited | enhancement |

Framework notes: Astro's docs say `<ClientRouter />` "will increasingly
become unnecessary" as browser APIs mature; it still adds a fallback,
`transition:persist`, `navigate()`, and a reduced-motion switch. Next.js 16.4
documents React `<ViewTransition>` in the App Router with `transitionTypes`
on `<Link>` (morph 400ms, exit 150ms, enter 210ms in its examples).

## Sources

webstatus.dev API `/v1/features/*`; github.com/mdn/browser-compat-data;
web.dev "Same-document view transitions are now Baseline Newly available"
(2025-10-16) and "Interop 2026" (2026-02-12); developer.chrome.com
(scroll-triggered animations 2025-12-12, Chrome 146/147 notes, scroll-state
queries 2025-01-15, entry/exit animations 2024-09-13, e-commerce case
studies, non-composited animations audit 2024-12-08); docs.astro.build view
transitions guide; nextjs.org/docs/app/guides/view-transitions (v16.4.0,
2026-09-10); motion.dev changelog, react-accessibility, performance tier list
(2025-11-05); gsap.com/standard-license and blog/3-15; npm registry (motion
14.0.0 MIT, gsap 3.15.0, vaul 1.1.2, @theatre/core 0.7.2); nngroup.com
animation-duration (2020-02-09), liquid-glass (2025-10-10), skeleton-screens;
emilkowal.ski; rauno.me/craft/interaction-design; W3C WCAG 2.2 Understanding
2.2.2 and 2.3.3; HTTP Archive Web Almanac 2025 (accessibility, performance);
androidx Material 3 motion tokens; Apple HIG Motion; Carbon motion.
Full research notes: `~/Documents/work/research/2026-10-08-motion-research.md`.
