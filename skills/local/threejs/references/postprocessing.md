# Post-Processing

Post-processing multiplies fill-rate cost. Default to none; add one effect only
when the art direction needs it and the mobile budget holds.

## Rules

1. **Order:** `RenderPass` → effect passes (bloom, SSAO, DOF...) → `OutputPass`
   last. `OutputPass` applies tone mapping and output color space; do not end
   a modern chain with `GammaCorrectionShader`, and do not tone-map twice
   (set `renderer.toneMapping` and let the composer's output pass own it, or
   render without a composer).
2. **Resolution:** run the composer at a reduced pixel ratio on mobile
   (`composer.setPixelRatio(1)` or half-resolution bloom) and keep the DPR
   clamp (`SKILL.md` §3).
3. **Selective bloom:** bloom only emissive things by setting a `threshold`
   above the base scene's brightness and pushing emissive colors past it;
   full-scene bloom looks like a filter and costs more.
4. **Budget:** one or two passes on desktop, zero or one on mobile. Detect
   capability/frame time (measure, then downgrade) instead of user-agent
   sniffing.
5. **Resize and dispose:** call `composer.setSize` in the same resize handler
   as the renderer and `composer.dispose()` (plus each pass) on unmount.
6. **Reduced motion:** disable animated grain/chromatic aberration/glitch passes
   under `prefers-reduced-motion`.
7. **R3F:** use `@react-three/postprocessing` (`EffectComposer` + effects) with
   `multisampling={0}` when using bloom on mobile; do not hand-roll a composer
   inside `useFrame`.
8. **WebGPU/TSL post-processing** import paths and class names changed across
   recent releases: look up the installed version's docs (Context7) before
   writing it; do not copy older snippets.

## Skip

Glitch, halftone, pixelation, and film-grain stacks are art-direction
decisions that need a design owner (`design-taste`) and a reduced-motion
alternative; they are not defaults.
