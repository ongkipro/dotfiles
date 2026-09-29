# React Three Fiber (R3F) & Modern Web Frameworks

Integrating 3D WebGL into React, Next.js, or Astro requires clear boundaries between DOM state, component unmounting lifecycles, and the continuous render loop.

---

## 1. React Three Fiber (R3F) Core Rules

R3F is not a wrapper around Three.js; it is a declarative reconciler. Objects created via JSX (`<mesh>`, `<boxGeometry>`) are direct instances of `THREE.Mesh` and `THREE.BoxGeometry`.

### Baseline Canvas Setup
```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

export function SceneCanvas() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        dpr={[1, 2]} // Clamp DPR between 1 and 2
        gl={{ powerPreference: 'high-performance', antialias: true }}
        camera={{ position: [0, 2, 5], fov: 45 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

        <Suspense fallback={null}>
          <Model url="/models/scene.glb" />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls makeDefault enableDamping />
      </Canvas>
    </div>
  );
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
useGLTF.preload('/models/scene.glb');
```

---

## 2. Invariant: Never Mutate React State Inside `useFrame`

Calling `useState` setters (`setState(...)`) inside `useFrame` causes 60 re-renders per second of the entire React tree, destroying performance.

### Anti-Pattern: Triggering React Rerenders in `useFrame`
```tsx
// BAD: Destroys performance by re-rendering React every frame
function BadSphere() {
  const [rot, setRot] = useState(0);
  useFrame((_, delta) => {
    setRot((r) => r + delta); // Causes React re-render at 60fps!
  });
  return <mesh rotation-y={rot}><sphereGeometry /></mesh>;
}
```

### Preferred Pattern: Direct Ref Mutation
```tsx
// GOOD: Mutates the underlying Three.js object directly without React re-render
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GoodSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#5d7bff" />
    </mesh>
  );
}
```

---

## 3. Coordinating DOM HUD with 3D Canvas

Keep UI/HUD overlays in ordinary HTML/React outside the `<Canvas>`, communicating via lightweight event buses, Zustand, or unidirectional state stores rather than forcing scene objects to know about UI components.

```tsx
export function ProductViewer() {
  const [selectedColor, setSelectedColor] = useState('#5d7bff');

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas>
        <ProductModel color={selectedColor} />
      </Canvas>

      {/* HTML / Tailwind DOM Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        <button onClick={() => setSelectedColor('#ff5d7b')} className="px-4 py-2 bg-black text-white text-xs font-mono">
          Crimson
        </button>
        <button onClick={() => setSelectedColor('#5d7bff')} className="px-4 py-2 bg-black text-white text-xs font-mono">
          Cobalt
        </button>
      </div>
    </div>
  );
}
```

---

## 4. Astro & Vanilla SPA Integration

In Astro (or vanilla Vite/TypeScript), encapsulate Three.js logic inside an autonomous class or controller that binds to an `<astro-canvas>` or `<div>`, attaching and detaching on lifecycle events:

```astro
---
// ProductViewer.astro
---
<div id="three-container" class="w-full h-[600px] relative overflow-hidden" data-model-url="/model.glb">
  <canvas id="three-canvas" class="w-full h-full block"></canvas>
</div>

<script>
  import { ThreeSceneController } from '../lib/three/ThreeSceneController';

  const container = document.getElementById('three-container');
  const canvas = document.getElementById('three-canvas') as HTMLCanvasElement;

  if (container && canvas) {
    const controller = new ThreeSceneController(canvas, container);

    // Support Astro view transitions cleanup
    document.addEventListener('astro:before-swap', () => {
      controller.destroy();
    }, { once: true });
  }
</script>
```
