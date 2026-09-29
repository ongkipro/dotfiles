# Three.js Disposal & Memory Discipline

WebGL does not participate in JavaScript garbage collection. Leaving meshes, materials, geometries, or textures unreferenced in JavaScript will **not** free their GPU video memory (VRAM). Repeatedly creating and destroying scenes, navigating routes, or hot-reloading without explicit disposal causes memory leaks, GPU context loss, and mobile browser crashes.

---

## 1. The Core Disposal Hierarchy

To completely tear down a Three.js hierarchy or object, you must dispose:
1. **Geometries**: Free vertex buffer objects (VBOs), indices, and attributes.
2. **Materials**: Free compiled shader programs.
3. **Textures**: Free GPU texture memory assigned to material map slots.
4. **Render Targets**: Free offscreen framebuffers.
5. **Renderer**: Free WebGL contexts, canvas listeners, and render state.

---

## 2. Universal Scene Disposal Helper

Use this recursive cleanup routine when unloading a scene, component, or sub-tree:

```typescript
import * as THREE from 'three';

export function disposeHierarchy(root: THREE.Object3D) {
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh || (obj as THREE.Line).isLine || (obj as THREE.Points).isPoints) {
      const mesh = obj as THREE.Mesh;

      // 1. Dispose Geometry
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      // 2. Dispose Material(s) and assigned Textures
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const mat of materials) {
          disposeMaterialTextures(mat);
          mat.dispose();
        }
      }
    }
  });

  // Remove all children from parent
  while (root.children.length > 0) {
    const child = root.children[0];
    root.remove(child);
  }
}

export function disposeMaterialTextures(material: THREE.Material) {
  // Check all common texture property slots
  const textureSlots: Array<keyof THREE.Material | string> = [
    'map',
    'alphaMap',
    'aoMap',
    'bumpMap',
    'displacementMap',
    'emissiveMap',
    'envMap',
    'lightMap',
    'metalnessMap',
    'normalMap',
    'roughnessMap',
    'clearcoatMap',
    'clearcoatNormalMap',
    'clearcoatRoughnessMap',
    'sheenColorMap',
    'sheenRoughnessMap',
    'transmissionMap',
    'thicknessMap',
    'specularMap',
    'specularColorMap',
    'specularIntensityMap',
  ];

  for (const slot of textureSlots) {
    const texture = (material as Record<string, any>)[slot];
    if (texture && typeof texture.dispose === 'function') {
      texture.dispose();
    }
  }

  // Handle custom uniforms in ShaderMaterial
  if ((material as THREE.ShaderMaterial).isShaderMaterial) {
    const shaderMat = material as THREE.ShaderMaterial;
    for (const key of Object.keys(shaderMat.uniforms)) {
      const u = shaderMat.uniforms[key];
      if (u && u.value && u.value.isTexture) {
        u.value.dispose();
      }
    }
  }
}
```

---

## 3. Complete Renderer Teardown & Lifecycle

When unmounting a canvas component (Astro, Vue, React, Svelte, or vanilla SPA):

```typescript
export class ThreeCanvasLifecycle {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private animFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  init(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // Watch for size changes
    this.resizeObserver = new ResizeObserver(() => this.onResize(container));
    this.resizeObserver.observe(container);

    this.startLoop();
  }

  private onResize(container: HTMLElement) {
    if (!this.renderer) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.renderer.setSize(width, height, false);
    // update camera aspect & projection here
  }

  private startLoop() {
    const tick = () => {
      if (!this.renderer || !this.scene) return;
      // render logic
      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  destroy() {
    // 1. Stop animation loop
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    // 2. Disconnect observers & listeners
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    // 3. Dispose all scene meshes, geometries, materials, textures
    if (this.scene) {
      disposeHierarchy(this.scene);
      this.scene = null;
    }

    // 4. Dispose renderer and context
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss(); // Force release GPU context immediately
      if (this.renderer.domElement && this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }
  }
}
```

---

## 4. WebGL Context Loss Handling

Mobile devices or background tabs aggressively reclaim WebGL contexts under memory pressure. Handle context loss events so the app recovers gracefully:

```typescript
const canvas = renderer.domElement;

canvas.addEventListener('webglcontextlost', (event) => {
  event.preventDefault(); // Prevent default abort, allowing recovery
  console.warn('WebGL context lost. Pausing rendering.');
  cancelAnimationFrame(animFrameId);
}, false);

canvas.addEventListener('webglcontextrestored', () => {
  console.info('WebGL context restored. Re-initializing scene.');
  rebuildScene();
}, false);
```

---

## 5. Memory Leak Audit Checklist

When reviewing code or debugging memory issues:
- [ ] Are geometries explicitly disposed when meshes are swapped or removed?
- [ ] Are all textures attached to a material disposed when the material is destroyed?
- [ ] Are `WebGLRenderTarget` objects disposed when dynamic shadows or post-processing passes are resized or discarded?
- [ ] Is `cancelAnimationFrame` called before tearing down the canvas?
- [ ] Is `window.addEventListener('resize')` or `ResizeObserver` disconnected on component unmount?
- [ ] Are texture loaders caching textures appropriately rather than creating duplicate textures on every render?
- [ ] Does `renderer.info.memory` confirm `geometries: 0` and `textures: 0` after scene teardown?
