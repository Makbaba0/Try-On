import { RefObject, useEffect, useRef } from 'react';

import { requestUserCamera, stopMediaStream } from '../services/cameraService';
import { useMirrorStore } from '../store/mirrorStore';

interface UseCameraStreamResult {
  streamRef: RefObject<MediaStream | null>;
}

export function useCameraStream(
  videoRef: RefObject<HTMLVideoElement>,
): UseCameraStreamResult {
  const streamRef = useRef<MediaStream | null>(null);
  const setCameraStatus = useMirrorStore((state) => state.setCameraStatus);
  const setErrorMessage = useMirrorStore((state) => state.setErrorMessage);

  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      setCameraStatus('starting');
      setErrorMessage(null);

      try {
        const stream = await requestUserCamera();

        if (!isMounted) {
          stopMediaStream(stream);
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setCameraStatus('ready');
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Kamera başlatılırken beklenmeyen bir hata oluştu.';

        setCameraStatus(message.toLowerCase().includes('permission') ? 'blocked' : 'error');
        setErrorMessage(message);
      }
    }

    void startCamera();

    return () => {
      isMounted = false;
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    };
  }, [setCameraStatus, setErrorMessage, videoRef]);

  return { streamRef };
}
