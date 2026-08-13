# 2. THE THREE DIALS

`DESIGN_VARIANCE` (1 symmetric → 10 chaos) / `MOTION_INTENSITY` (1 static →
10 cinematic) / `VISUAL_DENSITY` (1 airy → 10 packed).

| Use case | VAR | MOT | DEN |
|---|---|---|---|
| DR / COD funnel LP (ID/MY market) | 3 | 2 | 5 |
| Storefront / e-commerce marketing | 5 | 4 | 4 |
| SaaS landing (volumform/volumup class) | 7 | 5 | 4 |
| Agency / creative (jasawebsite class) | 8 | 7 | 3 |
| Portfolio | 7 | 6 | 3 |
| Editorial / blog / kamus-style docs | 5 | 3 | 3 |
| Redesign - preserve | match existing | +1 | match |
| Redesign - overhaul | +2 | +2 | match |

Dial meanings, compressed: VAR 1-3 symmetric grid and centered OK; 4-7
offsets, mixed aspect ratios, left-aligned headers; 8-10 masonry, fractional
grids, big empty zones. MOT 1-3 hover/active only; 4-7 load-in cascades and
scroll reveals (CSS-first); 8-10 pin/scrub scrolltelling (GSAP). DEN 1-3
`py-32`+ gaps; 4-7 `py-16`-`py-24`; 8-10 tight, hairlines instead of cards,
mono numerals.

Asymmetric layouts (VAR ≥ 4) MUST collapse to single column below 768px,
declared explicitly per section.
