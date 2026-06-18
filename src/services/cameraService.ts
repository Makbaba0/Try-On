import type { CameraSettings } from '../types/camera';

const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  width: 1280,
  height: 720,
  frameRate: 30,
};

export async function requestUserCamera(
  settings: CameraSettings = DEFAULT_CAMERA_SETTINGS,
): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Bu tarayıcı kamera erişimini desteklemiyor.');
  }

  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: { ideal: settings.width },
      height: { ideal: settings.height },
      frameRate: { ideal: settings.frameRate, min: 24 },
      facingMode: 'user',
    },
  });
}

export function stopMediaStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}
