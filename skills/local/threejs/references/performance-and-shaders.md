# Three.js Performance, Shaders & Asset Pipeline

Maintaining 60 FPS in WebGL requires disciplined CPU-to-GPU bandwidth management, zero GC churn in the render loop, and optimized asset pipelines.

---

## 1. Zero Garbage Collection in the Render Loop

Creating objects (`new THREE.Vector3()`, `new THREE.Matrix4()`, object literals, arrays) inside `requestAnimationFrame` forces the browser's Garbage Collector to pause the thread, causing micro-stutters and frame drops.

### Anti-Pattern: Allocations in RAF
```typescript
// BAD: Allocates new Vector3 and Euler every frame
function tick() {
  requestAnimationFrame(tick);
  const offset = new THREE.Vector3(0, Math.sin(Date.now() * 0.002) * 0.5, 0); // GC pressure!
  mesh.position.add(offset);
  renderer.render(scene, camera);
}
```

### Preferred Pattern: Scratch Instances (Pre-allocation)
```typescript
// GOOD: Pre-allocated scratch objects reused every frame
const _scratchVec = new THREE.Vector3();
const _scratchMat = new THREE.Matrix4();
const _timer = new THREE.Timer(); // core since r179; Clock is deprecated since r183
_timer.connect(document); // Page Visibility API: no delta spike after a hidden tab

function tick(timestamp: number) {
  requestAnimationFrame(tick);
  _timer.update(timestamp);
  const elapsedTime = _timer.getElapsed();

  _scratchVec.set(0, Math.sin(elapsedTime * 2) * 0.5, 0);
  mesh.position.copy(_scratchVec);

  renderer.render(scene, camera);
}
```

---

## 2. DPR Clamping & Adaptive Resolution

High-DPI mobile devices (e.g. iPhone Retina 3x) render 9x more pixels per frame if unconstrained, choking mobile GPUs.

```typescript
// Invariant: Always clamp devicePixelRatio to 2 max
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// For low-power tiers, prefer a capability/coarse-pointer check over user-agent sniffing
if (window.matchMedia('(pointer: coarse)').matches) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
}
```

---

## 3. Tab Visibility & In-Viewport Throttling

Do not waste GPU cycles rendering when the user is not viewing the canvas.

```typescript
let isPaused = false;

// 1. Pause RAF when browser tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isPaused = true;
  } else {
    isPaused = false;
    // _timer.connect(document) already absorbs the hidden-tab gap
  }
});

// 2. Pause when canvas scrolls out of viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    isPaused = !entry.isIntersecting;
    if (!isPaused) _timer.reset(); // the timer saw no updates while off-screen; restart delta
  });
}, { threshold: 0.1 });

observer.observe(renderer.domElement);
```

---

## 4. InstancedMesh for Duplicate Geometry

When rendering hundreds or thousands of repeated objects (particles, markers, foliage, or interactive nodes), never use individual `THREE.Mesh` objects. Use `THREE.InstancedMesh` to render all instances in a single draw call.

```typescript
import * as THREE from 'three';

const count = 1000;
const geometry = new THREE.SphereGeometry(0.1, 16, 16);
const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

const matrix = new THREE.Matrix4();
const position = new THREE.Vector3();
const rotation = new THREE.Euler();
const scale = new THREE.Vector3(1, 1, 1);
const color = new THREE.Color();

for (let i = 0; i < count; i++) {
  position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
  rotation.set(0, Math.random() * Math.PI, 0);
  matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
  instancedMesh.setMatrixAt(i, matrix);

  // Optional per-instance color
  color.setHSL(i / count, 0.7, 0.5);
  instancedMesh.setColorAt(i, color);
}

instancedMesh.instanceMatrix.needsUpdate = true;
if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
scene.add(instancedMesh);
```

---

## 5. Asset Pipeline: GLTF, DRACO & KTX2

Ship 3D models using binary `.glb` with Draco mesh compression and KTX2 Basis Universal texture compression.

```typescript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

export function createOptimizedGLTFLoader(renderer: THREE.WebGLRenderer): GLTFLoader {
  const gltfLoader = new GLTFLoader();

  // 1. Draco mesh decompression
  const dracoLoader = new DRACOLoader();
  // Copy node_modules/three/examples/jsm/libs/draco/ to the static dir so it matches the installed three
  dracoLoader.setDecoderPath('/draco/');
  gltfLoader.setDRACOLoader(dracoLoader);

  // 2. KTX2 GPU texture decompression
  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath('/basis/'); // copied from three/examples/jsm/libs/basis/
  ktx2Loader.detectSupport(renderer);
  gltfLoader.setKTX2Loader(ktx2Loader);

  return gltfLoader;
}
```

---

## 6. Custom ShaderMaterial Architecture

When built-in materials cannot achieve the visual target (e.g. fresnel shields, energy orbs, flow fields), write modular GLSL in a `ShaderMaterial`:

```typescript
const customMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#5d7bff') },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;
      // Procedural vertex ripple
      pos += normal * sin(pos.y * 5.0 + uTime * 3.0) * 0.05;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      // Fresnel rim lighting
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
      gl_FragColor = vec4(mix(uColor, vec3(1.0), fresnel), 0.85);
    }
  `,
  transparent: true,
  depthWrite: false,
});
```
