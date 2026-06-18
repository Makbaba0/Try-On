import type { NormalizedLandmark, PoseLandmarkerResult } from '@mediapipe/tasks-vision';

export type PoseLandmark = NormalizedLandmark;
export type PoseResult = PoseLandmarkerResult;

export interface PoseConnection {
  start: number;
  end: number;
}

export interface PosePoint {
  x: number;
  y: number;
  visibility: number;
}

export interface PoseMetrics {
  leftShoulder: PosePoint;
  rightShoulder: PosePoint;
  neckCenter: PosePoint;
  hipCenter: PosePoint;
  torsoCenter: PosePoint;
  torsoAngle: number;
  shoulderWidth: number;
  shoulderWidthPx: number;
  torsoHeight: number;
  torsoHeightPx: number;
}

export const POSE_LANDMARK_INDEX = {
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
} as const;
