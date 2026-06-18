import type { CameraStatus } from './camera';

export type PoseStatus = 'not-initialized' | 'initializing' | 'tracking' | 'lost' | 'error';

export interface MirrorStatus {
  cameraStatus: CameraStatus;
  cameraFps: number;
  poseStatus: PoseStatus;
  selectedProductName: string | null;
  errorMessage: string | null;
}
