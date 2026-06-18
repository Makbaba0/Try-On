import { RefObject, useEffect, useRef } from 'react';

import { useMirrorStore } from '../store/mirrorStore';

export function useCameraFps(videoRef: RefObject<HTMLVideoElement>): void {
  const setCameraFps = useMirrorStore((state) => state.setCameraFps);
  const frameCountRef = useRef(0);
  const lastSampleRef = useRef(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const video = videoRef.current;

      if (video && !video.paused && !video.ended && video.readyState >= 2) {
        frameCountRef.current += 1;
      }

      const now = performance.now();
      const elapsed = now - lastSampleRef.current;

      if (elapsed >= 1000) {
        setCameraFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastSampleRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setCameraFps, videoRef]);
}
