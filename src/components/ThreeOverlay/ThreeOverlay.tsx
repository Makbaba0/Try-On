import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';

import type { Product } from '../../types/product';

interface ThreeOverlayProps {
  product: Product | null;
  enabled: boolean;
}

export function ThreeOverlay({ product, enabled }: ThreeOverlayProps) {
  if (!enabled || !product?.model) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 scale-x-[-1]">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 34 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.7} />
        <directionalLight position={[2, 3, 4]} intensity={2.2} />
        <Suspense fallback={null}>
          <GarmentModel src={product.model} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

interface GarmentModelProps {
  src: string;
}

function GarmentModel({ src }: GarmentModelProps) {
  const gltf = useGLTF(src);

  return (
    <primitive
      object={gltf.scene}
      position={[0, -0.2, 0]}
      rotation={[0, 0, 0]}
      scale={1.4}
    />
  );
}
