import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

const WASM_BASE_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm';

const POSE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';

let poseLandmarkerPromise: Promise<PoseLandmarker> | null = null;

export function getPoseLandmarker(): Promise<PoseLandmarker> {
  if (!poseLandmarkerPromise) {
    poseLandmarkerPromise = createPoseLandmarker();
  }

  return poseLandmarkerPromise;
}

async function createPoseLandmarker(): Promise<PoseLandmarker> {
  const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);

  return PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: POSE_MODEL_URL,
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numPoses: 1,
    minPoseDetectionConfidence: 0.55,
    minPosePresenceConfidence: 0.55,
    minTrackingConfidence: 0.55,
    outputSegmentationMasks: false,
  });
}
