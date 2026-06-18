export type CameraStatus = 'idle' | 'starting' | 'ready' | 'blocked' | 'error';

export interface CameraSettings {
  width: number;
  height: number;
  frameRate: number;
}
