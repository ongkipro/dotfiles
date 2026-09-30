# Materials, Lighting, Textures & Loaders

Decision notes, not an API tutorial. Adapted in part from cloudai-x's
`threejs-skills` (materials, lighting, textures, loaders), keeping only what
is current and relevant to an Astro/Vite/R3F web target. Check the installed
`three` version before quoting any name below (`package.json` and the release
migration guide win over this file).

## 1. Choose the cheapest material that reaches the look

| Need | Material | Notes |
| --- | --- | --- |
| Unlit flat color, UI-like, particles | `MeshBasicMaterial` | no lights needed, cheapest |
| Stylized shading | `MeshToonMaterial` (+ gradient map) | |
| Default PBR (metal/rough) | `MeshStandardMaterial` | the baseline; matches glTF |
| Glass, clearcoat, sheen, iridescence | `MeshPhysicalMaterial` | `transmission` renders the scene twice-ish; use on a few hero meshes only |
| Custom effect | `ShaderMaterial` / `onBeforeCompile` | see `performance-and-shaders.md` |

- Share one material instance across meshes that look the same (fewer program
  switches, one thing to dispose).
- `transparent: true` objects sort by object, not by pixel. Use `alphaTest` for
  cutouts; set `depthWrite: false` on additive glow layers.
- Do not mutate `material.needsUpdate` per frame; changing defines or maps
  forces a recompile.

## 2. Lighting: prefer an environment over many lights

- **IBL first:** one HDR environment through `PMREMGenerator`
  (`fromEquirectangular`, then `dispose()` the generator) gives PBR materials
  realistic reflections at almost no per-light cost. Set it as
  `scene.environment`; only set `scene.background` when the sky should show.
- Add at most one key `DirectionalLight` if a shadow or direction is needed.
  Cost climbs with each real-time light and each shadow-casting light.
- Product-viewer default: environment + soft key, no point lights.
- **Shadows:** enable per light and per mesh (`castShadow` / `receiveShadow`).
  Map size 1024-2048; fit the shadow camera frustum tightly to the visible area;
  raise `shadow.normalBias` before increasing `bias` to fix acne. Consider
  baked shadows or a blob/contact-shadow plane for static hero objects (in R3F,
  drei's `ContactShadows` / `AccumulativeShadows`; not part of three core).
- Light units follow physical intensities; if a scene from an old tutorial
  looks dark or blown out, retune intensity rather than adding lights.

## 3. Textures and color space

- **Color maps** (`map`, `emissiveMap`) use `texture.colorSpace = THREE.SRGBColorSpace`.
  **Data maps** (normal, roughness, metalness, AO, displacement) stay linear
  (the default). Wrong color space is the most common "washed out" or "too
  dark" cause. Textures embedded in glTF are set correctly by `GLTFLoader`.
- Power-of-two is no longer required in WebGL2, but keep dimensions compact:
  4K textures on mobile are a memory problem before they are a bandwidth one.
- Mipmaps + anisotropy for surfaces seen at grazing angles:
  `texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())`.
- Ship GPU-compressed textures (KTX2/Basis) for anything large; use
  `renderer` support detection (`ktx2Loader.detectSupport(renderer)`).
- Dispose textures you created (`texture.dispose()`); see
  `disposal-and-memory.md`. Dispose the PMREM source texture after use.

## 4. Loading

- One shared `LoadingManager` drives a single progress indicator (HTML, not
  WebGL) and a single "ready" moment; reveal the canvas after the first frame.
- Configure one `GLTFLoader` with Draco + KTX2 (see `performance-and-shaders.md`
  §5); reuse it. Keep decoder/transcoder paths versioned to the installed
  `three` (the `examples/jsm/libs/basis` and `draco` folders ship in the
  package; copy them to the site's static path rather than pinning a CDN
  version that drifts).
- HDR environments: `HDRLoader` (renamed from `RGBELoader` in r180) or
  `EXRLoader`; on older versions keep `RGBELoader`. A small HDR (1-2K, ~<1MB)
  is enough for reflections; smaller and blurrier than a visible backdrop.
- Cache by URL, cancel work when the route unmounts, and handle load errors with
  a static poster fallback (the canvas must never leave an empty hole).
- R3F: `useGLTF` / `useTexture` (drei) cache and suspend; `useGLTF.preload`
  for above-the-fold assets.
