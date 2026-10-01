---
name: threejs
description: Architect, build, and optimize 3D WebGL scenes with Three.js across vanilla JS, Vite, Astro, and React Three Fiber (R3F). Use for 3D graphics, shaders, GLTF models, cameras, lighting, materials, and canvas animations. NOT for CSS/2D UI animation (use gsap-*).
---

# Three.js 3D WebGL Architecture

Architect, implement, and optimize production-ready 3D WebGL experiences with Three.js across vanilla TypeScript, Vite, Astro, and React Three Fiber (R3F).

---

## 1. When to Use This Skill

Apply this skill when:
- Creating 3D scenes, models, particle systems, or spatial canvas visualizations.
- Integrating 3D interactive hero sections, product configurators, or digital orbs.
- Loading and optimizing 3D assets (`.gltf`, `.glb`, Draco, KTX2).
- Writing custom WebGL shaders (`ShaderMaterial`, GLSL vertex and fragment shaders).
- Debugging WebGL memory leaks, canvas context loss, or frame-rate drops.
- Composing declarative 3D scenes with React Three Fiber (`@react-three/fiber`) and Drei (`@react-three/drei`).

**When NOT to use:**
- 2D DOM, SVG, or timeline UI animations: load the `gsap-core` or `gsap-scrolltrigger` skills instead.
- Simple CSS transforms or transitions: prefer native CSS.
- Heavy desktop CAD or native game engines (Unity / Unreal).

---

## 2. References

Read the specific deep-dive reference matching the active task:

| Reference | Purpose & Focus Area |
|-----------|----------------------|
| [Disposal & Memory Discipline](references/disposal-and-memory.md) | Zero-leak GPU cleanup, geometry/material/texture disposal, context loss recovery |
| [Performance, Shaders & Pipeline](references/performance-and-shaders.md) | Zero-allocation RAF, DPR clamping, `InstancedMesh`, Draco/KTX2, custom GLSL |
| [R3F & Modern Web Frameworks](references/r3f-and-frameworks.md) | React Three Fiber, Drei, Astro component encapsulation, DOM HUD coordination |
| [Materials, Lighting, Textures & Loaders](references/materials-lighting-textures.md) | Material choice, IBL over many lights, shadows, color space, loading manager, HDR |
| [Post-Processing](references/postprocessing.md) | Pass order with `OutputPass`, mobile budget, selective bloom, disposal |
| [Interaction & Animation](references/interaction-animation.md) | Pointer events, raycaster hygiene, controls, `Timer`, `AnimationMixer`, scroll-driven camera |

### Pick the lightest tier that reproduces the effect

| Tier | Use | Escalate when |
|------|-----|---------------|
| Lightweight | CSS animation, SVG, `IntersectionObserver` | the effect needs real depth, particles >100, or shaders |
| Medium | Canvas 2D, GSAP, Lottie | many interacting objects or lighting are required |
| Heavy | Three.js/R3F, GLSL | only for depth, lighting, or GPU-scale particles |

Every heavy effect ships a fallback (static poster or CSS version) for
low-power devices, `prefers-reduced-motion`, and WebGL failure. Look up the
installed `three` version before using version-sensitive names. Verified
2026-10-02 against npm (`three` 0.186.x, R3F 9 + drei 10 on React 19) and the
official migration guide:

| Since | Change |
|-------|--------|
| r171 | WebGPU: import `WebGPURenderer`/node materials from `three/webgpu`, TSL from `three/tsl` |
| r179 | `THREE.Timer` is core (was an addon); call `timer.connect(document)` |
| r180 | `RGBELoader` renamed `HDRLoader` |
| r183 | `Clock` deprecated (runtime warning) -> `Timer`; WebGPU `PostProcessing` renamed `RenderPipeline` |
| r186 | `Object3D.dispose()` exists; custom subclasses call `super.dispose()` |

Addon imports use `three/addons/...` (alias of `three/examples/jsm/...`).

---

## 3. Core Architecture & Standards

### Standard WebGLRenderer Configuration
Always configure modern color management and clamp device pixel ratio to avoid mobile GPU exhaustion:

```typescript
import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
  alpha: true, // Transparent canvas backdrop if layered over HTML
});

// Color management (Three.js r152+ standard)
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; // or AgXToneMapping / NeutralToneMapping (product color fidelity)
renderer.toneMappingExposure = 1.0;

// DPR Clamping: Never allow raw 3x DPR on mobile
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(width, height, false);
```

### Camera & Responsive Resize
Update camera aspect ratio and projection matrix whenever viewport dimensions change:

```typescript
function handleResize(width: number, height: number) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
```

---

## 4. Non-Negotiable Invariants

1. **Explicit Disposal on Unmount**:
   - WebGL memory is not freed by JavaScript garbage collection.
   - When a component or route unmounts, call `geometry.dispose()`, `material.dispose()`, and dispose every attached texture (`map`, `normalMap`, `roughnessMap`, etc.). See [references/disposal-and-memory.md](references/disposal-and-memory.md).
2. **Zero Allocation Inside the Animation Loop**:
   - Never instantiate `new THREE.Vector3()`, `new THREE.Matrix4()`, or object literals inside `requestAnimationFrame` or `useFrame`. Pre-allocate scratch variables outside the loop.
3. **Tab Inactivity & Viewport Throttling**:
   - Pause the render loop when `document.hidden` is true or when the canvas element scrolls out of view via `IntersectionObserver`. Use `THREE.Timer` with `timer.connect(document)` (absorbs hidden-tab gaps) and `timer.reset()` when resuming from off-screen to prevent delta spikes.
4. **Respect Reduced Motion**:
   - Check `window.matchMedia('(prefers-reduced-motion: reduce)')`. Disable aggressive rotations, continuous camera swaying, and high-speed particle simulations for sensitive users.
5. **DOM Overlays for HUD/UI**:
   - Keep user interfaces (buttons, text, tooltips, modals) in HTML/CSS/Tailwind above the canvas. Do not render text or complex UI buttons inside WebGL unless spatial 3D placement is required.

---

## 5. Anti-Patterns to Flag

| Anti-Pattern | Consequence | Preferred Pattern |
|--------------|-------------|-------------------|
| Unconstrained `window.devicePixelRatio` | Overheats mobile GPUs, drops frames to <15 FPS | `Math.min(window.devicePixelRatio, 2)` |
| `new THREE.Vector3()` in RAF loop | Triggers frequent GC pauses and frame stutter | Pre-allocated module-level scratch instances |
| Swapping models without `.dispose()` | VRAM leak until browser kills WebGL context | Traverse and call `dispose()` on geom, mat, textures |
| `setState` inside R3F `useFrame` | Triggers 60 React re-renders per second | Direct ref mutation on Three.js objects |
| Uncompressed `.obj` or `.fbx` assets | Massive bundle size, multi-second load delay | Optimized `.glb` with Draco and KTX2 |
| Deprecated `renderer.outputEncoding` | Incorrect gamma/color representation | `renderer.outputColorSpace = THREE.SRGBColorSpace` |
| Over-sized shadow maps (`4096+`) | Severe GPU bandwidth bottleneck | `1024` or `2048` max with tight shadow camera frustum |

---

## 6. Verification & Quality Gate

Before declaring Three.js implementation complete:
- [ ] Run `renderer.info.memory` to verify geometries and textures are 0 after cleanup.
- [ ] Test tab switching: verify RAF loop pauses when tab is hidden and resumes smoothly.
- [ ] Verify responsive resize: inspect mobile (375px), tablet (768px), and desktop (1440px) without distortion.
- [ ] Verify mobile performance: clamp DPR, confirm absence of stutter or memory spikes.
- [ ] Verify reduced motion behavior when `prefers-reduced-motion: reduce` is enabled.
