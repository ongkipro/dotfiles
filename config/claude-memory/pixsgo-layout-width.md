---
name: pixsgo-layout-width
description: "Pixs&Go layout width convention (1200px content, 1920px body) + Tailwind v4 arbitrary-value gotcha"
metadata: 
  node_type: memory
  type: project
  originSessionId: adacada1-53f8-4363-aaeb-f6840baa401d
---

Pixs&Go content containers are capped at **1200px** (`max-w-[1200px] mx-auto`) per section, and `<body>` is capped at **1920px** (`max-w-[1920px] mx-auto` in `src/layouts/Layout.astro`) so the site frames cleanly on ultra-wide screens while section backgrounds stay full-bleed.

**Gotcha (Tailwind v4):** arbitrary pixel/viewport values MUST use bracket syntax — `max-w-[1200px]`, `max-h-[580px]`, `min-h-[85vh]`. Bare forms like `max-w-1200px` are NOT valid in v4 (no config defines them), so they are silently ignored and the element gets no constraint. The whole site had been written with the bare form, so content was not actually capped at 1200px until all `(max-w|max-h|min-w|min-h|w|h)-NNN(px|vh|vw)` classes were converted to bracket syntax across `src/`. When adding new sizing classes, always bracket arbitrary values.

Related: [[pixsgo-rebrand-play-and-go]]
