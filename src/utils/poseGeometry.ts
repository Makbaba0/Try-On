import { POSE_LANDMARK_INDEX, type PoseLandmark, type PoseMetrics, type PosePoint } from '../types/pose';

const MIN_VISIBILITY = 0.45;

export function calculatePoseMetrics(
  landmarks: PoseLandmark[],
  frameWidth: number,
  frameHeight: number,
): PoseMetrics | null {
  const leftShoulder = toPosePoint(landmarks[POSE_LANDMARK_INDEX.leftShoulder]);
  const rightShoulder = toPosePoint(landmarks[POSE_LANDMARK_INDEX.rightShoulder]);
  const leftHip = toPosePoint(landmarks[POSE_LANDMARK_INDEX.leftHip]);
  const rightHip = toPosePoint(landmarks[POSE_LANDMARK_INDEX.rightHip]);

  if (
    !isReliable(leftShoulder) ||
    !isReliable(rightShoulder) ||
    !isReliable(leftHip) ||
    !isReliable(rightHip)
  ) {
    return null;
  }

  const neckCenter = midpoint(leftShoulder, rightShoulder);
  const hipCenter = midpoint(leftHip, rightHip);
  const shoulderWidth = distance(leftShoulder, rightShoulder);
  const torsoHeight = distance(neckCenter, hipCenter);
  const shoulderAngle = normalizeShoulderAngle(
    Math.atan2(
      rightShoulder.y - leftShoulder.y,
      rightShoulder.x - leftShoulder.x,
    ),
  );

  return {
    leftShoulder,
    rightShoulder,
    neckCenter,
    hipCenter,
    torsoCenter: midpoint(neckCenter, hipCenter),
    torsoAngle: shoulderAngle,
    shoulderWidth,
    shoulderWidthPx: shoulderWidth * frameWidth,
    torsoHeight,
    torsoHeightPx: torsoHeight * frameHeight,
  };
}

export function denormalizePoint(
  point: PosePoint,
  frameWidth: number,
  frameHeight: number,
): PosePoint {
  return {
    x: point.x * frameWidth,
    y: point.y * frameHeight,
    visibility: point.visibility,
  };
}

function toPosePoint(landmark: PoseLandmark | undefined): PosePoint | null {
  if (!landmark) {
    return null;
  }

  return {
    x: landmark.x,
    y: landmark.y,
    visibility: landmark.visibility,
  };
}

function midpoint(a: PosePoint, b: PosePoint): PosePoint {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    visibility: Math.min(a.visibility, b.visibility),
  };
}

function distance(a: PosePoint, b: PosePoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isReliable(point: PosePoint | null): point is PosePoint {
  return Boolean(point && point.visibility >= MIN_VISIBILITY);
}

function normalizeShoulderAngle(angle: number): number {
  if (angle > Math.PI / 2) {
    return angle - Math.PI;
  }

  if (angle < -Math.PI / 2) {
    return angle + Math.PI;
  }

  return angle;
}
