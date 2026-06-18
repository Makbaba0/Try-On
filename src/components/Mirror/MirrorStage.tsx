import { lazy, Suspense, useRef } from 'react';

import { CanvasOverlay } from '../CanvasOverlay/CanvasOverlay';
import { CameraView } from '../Camera/CameraView';
import { useCameraFps } from '../../hooks/useCameraFps';
import { useCameraStream } from '../../hooks/useCameraStream';
import { usePoseDetection } from '../../hooks/usePoseDetection';
import { useMirrorStore } from '../../store/mirrorStore';

const ThreeOverlay = lazy(() =>
  import('../ThreeOverlay').then((module) => ({ default: module.ThreeOverlay })),
);

export function MirrorStage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraStatus = useMirrorStore((state) => state.cameraStatus);
  const errorMessage = useMirrorStore((state) => state.errorMessage);
  const selectedProduct = useMirrorStore((state) => state.selectedProduct);
  const productCalibrations = useMirrorStore((state) => state.productCalibrations);

  useCameraStream(videoRef);
  useCameraFps(videoRef);
  usePoseDetection(videoRef, canvasRef, {
    enabled: cameraStatus === 'ready',
    selectedProduct,
    productCalibrations,
  });

  const showOverlay = cameraStatus !== 'ready';

  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded border border-mirror-border bg-black">
      <CameraView ref={videoRef} />
      {selectedProduct?.model ? (
        <Suspense fallback={null}>
          <ThreeOverlay product={selectedProduct} enabled={cameraStatus === 'ready'} />
        </Suspense>
      ) : null}
      <CanvasOverlay ref={canvasRef} />

      {showOverlay ? (
        <div className="absolute inset-0 grid place-items-center bg-black/70 px-8 text-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-mirror-accent">
              Kamera
            </p>
            <p className="mt-3 text-2xl font-semibold">
              {cameraStatus === 'starting'
                ? 'Kamera başlatılıyor'
                : 'Kamera bekleniyor'}
            </p>
            {errorMessage ? (
              <p className="mt-3 max-w-md text-sm leading-6 text-mirror-muted">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
