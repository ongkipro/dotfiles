# Interaction & Animation

## Pointer input

- Use **pointer events** (`pointerdown/move/up`), not separate mouse and touch
  handlers; set `touch-action: none` (or `pan-y` when the page must still
  scroll vertically) on the canvas so gestures are not stolen unexpectedly.
- Convert to normalized device coordinates from `getBoundingClientRect()`,
  not `window.innerWidth`, since the canvas is rarely full-window.
- **Raycaster hygiene:** keep a short list of clickable/hoverable objects and
  call `raycaster.intersectObjects(list, false)`, never
  `intersectObjects(scene.children, true)` on a large scene. Throttle hover
  raycasts to the frame loop (one cast per frame, on pointer move only), reuse
  the `Raycaster` and `Vector2`, and use `layers` to exclude non-interactive
  meshes. Instanced meshes report `instanceId`.
- `Raycaster` results carry `object`, `point`, `distance`, `instanceId`; do
  not rely on `face` being a `Face3` (removed long ago).
- Controls: `OrbitControls` with `enableDamping`, clamp `minDistance`,
  `maxDistance`, `minPolarAngle`, `maxPolarAngle`, and `enableZoom = false`
  when the canvas sits inside a scrolling page (otherwise it hijacks scroll).
  Call `controls.update()` in the loop when damping; `controls.dispose()` on
  unmount. In R3F use drei `OrbitControls`.
- The canvas is decoration or a focused widget: give it an accessible name
  (`role="img"` + `aria-label`, or a real label for an interactive viewer),
  a keyboard alternative for anything it triggers, and keep meaningful
  content in HTML.

## Time and loop

- Frame-rate independent motion: multiply by delta time; damp toward targets
  with `THREE.MathUtils.damp(current, target, lambda, dt)` instead of raw lerp
  factors.
- `THREE.Clock` is deprecated (runtime warning since r183) in favor of
  `THREE.Timer` (`timer.update(timestamp)` each frame; `getDelta()`,
  `getElapsed()`; `timer.connect(document)` zeroes the delta when the tab is
  hidden, which replaces manual delta resets; `timer.reset()` after resuming an
  off-screen pause). `Timer` is in core since r179 (before that,
  `three/addons/misc/Timer.js`); on releases before r183 `Clock` remains fine.
  Match the installed version.

## Animation (glTF and procedural)

- `AnimationMixer` per animated root; call `mixer.update(dt)` in the loop.
  Use `mixer.clipAction(clip)`; switch actions with `fadeOut` / `fadeIn` or
  `crossFadeTo` (with `warp` only when needed) for smooth transitions.
- Optimize imported clips (`clip.optimize()`), keep one mixer per character, and
  dispose with `mixer.stopAllAction()` + `mixer.uncacheRoot(root)` on unmount.
- Scroll-driven camera or model motion: drive a single progress value from
  GSAP ScrollTrigger (`gsap-scrolltrigger`) and read it inside the render loop;
  do not create tweens per frame. R3F: mutate refs inside `useFrame`, never
  React state.
- Under `prefers-reduced-motion`, freeze idle rotation, camera sway, and
  looping ambient animation; keep user-driven interaction working.
