import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Environment, useGLTF } from '@react-three/drei';

import type { ClothingTransform } from '../../types/overlay';
import type { Product } from '../../types/product';

interface ThreeOverlayProps {
  product: Product | null;
  enabled: boolean;
}

export function ThreeOverlay({ product, enabled }: ThreeOverlayProps) {
  const transform = useClothingTransformEvent();

  if (!enabled || !product?.model || !transform) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 scale-x-[-1]">
      <div
        className="absolute"
        style={{
          left: transform.x - transform.width / 2,
          top: transform.y - transform.height * transform.anchorY,
          width: transform.width,
          height: transform.height,
          transform: `rotate(${transform.rotation}rad)`,
          transformOrigin: `50% ${transform.anchorY * 100}%`,
          opacity: transform.opacity,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 35 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={1.7} />
          <directionalLight position={[2, 3, 4]} intensity={2.2} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.1}>
              <GarmentModel src={product.model} />
            </Bounds>
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>
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
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={1}
    />
  );
}

function useClothingTransformEvent(): ClothingTransform | null {
  const [transform, setTransform] = useState<ClothingTransform | null>(null);

  useEffect(() => {
    const handleTransform = (event: Event) => {
      setTransform((event as CustomEvent<ClothingTransform | null>).detail);
    };

    window.addEventListener('tryon:clothing-transform', handleTransform);

    return () => {
      window.removeEventListener('tryon:clothing-transform', handleTransform);
    };
  }, []);

  return transform;
}
