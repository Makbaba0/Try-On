import { RefObject, useEffect, useRef } from 'react';

import { getPoseLandmarker } from '../services/poseLandmarkerService';
import { useMirrorStore } from '../store/mirrorStore';
import type { ClothingTransform } from '../types/overlay';
import type { Product } from '../types/product';
import { getCachedClothingImage } from '../utils/clothingImageCache';
import { calculateClothingTransform, drawClothingOverlay } from '../utils/clothingOverlay';
import { calculatePoseMetrics } from '../utils/poseGeometry';
import { clearCanvas, drawPoseLandmarks } from '../utils/poseDrawing';

interface UsePoseDetectionOptions {
  enabled: boolean;
  selectedProduct: Product | null;
}

export function usePoseDetection(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  options: UsePoseDetectionOptions,
): void {
  const setPoseStatus = useMirrorStore((state) => state.setPoseStatus);
  const setErrorMessage = useMirrorStore((state) => state.setErrorMessage);
  const lastPoseStatusRef = useRef<string | null>(null);
  const clothingTransformRef = useRef<ClothingTransform | null>(null);
  const previousProductIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!options.enabled) {
      return;
    }

    let isCancelled = false;
    let animationFrameId: number | null = null;

    const updatePoseStatus = (status: 'initializing' | 'tracking' | 'lost' | 'error') => {
      if (lastPoseStatusRef.current !== status) {
        lastPoseStatusRef.current = status;
        setPoseStatus(status);
      }
    };

    async function startPoseLoop() {
      updatePoseStatus('initializing');

      try {
        const landmarker = await getPoseLandmarker();

        const detectFrame = () => {
          if (isCancelled) {
            return;
          }

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas?.getContext('2d');

          if (!video || !canvas || !context || video.readyState < 2) {
            animationFrameId = requestAnimationFrame(detectFrame);
            return;
          }

          const width = video.videoWidth;
          const height = video.videoHeight;

          if (width === 0 || height === 0) {
            animationFrameId = requestAnimationFrame(detectFrame);
            return;
          }

          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }

          const result = landmarker.detectForVideo(video, performance.now());
          const landmarks = result.landmarks[0];
          clearCanvas(context, width, height);

          if (landmarks) {
            const metrics = calculatePoseMetrics(landmarks, width, height);
            const selectedProduct = options.selectedProduct;

            if (selectedProduct?.id !== previousProductIdRef.current) {
              clothingTransformRef.current = null;
              previousProductIdRef.current = selectedProduct?.id ?? null;
            }

            if (metrics && selectedProduct) {
              const clothingImage = getCachedClothingImage(selectedProduct.image);
              clothingTransformRef.current = calculateClothingTransform(
                metrics,
                selectedProduct,
                width,
                height,
                clothingTransformRef.current,
              );
              drawClothingOverlay(context, clothingImage, clothingTransformRef.current);
            }

            drawPoseLandmarks(context, landmarks, width, height, metrics);
            updatePoseStatus('tracking');
          } else {
            clothingTransformRef.current = null;
            updatePoseStatus('lost');
          }

          animationFrameId = requestAnimationFrame(detectFrame);
        };

        animationFrameId = requestAnimationFrame(detectFrame);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'MediaPipe Pose Landmarker başlatılamadı.';

        updatePoseStatus('error');
        setErrorMessage(message);
      }
    }

    void startPoseLoop();

    return () => {
      isCancelled = true;

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    canvasRef,
    options.enabled,
    options.selectedProduct,
    setErrorMessage,
    setPoseStatus,
    videoRef,
  ]);
}
