import type { PoseConnection, PoseLandmark, PoseMetrics, PosePoint } from '../types/pose';
import { denormalizePoint } from './poseGeometry';

export const POSE_CONNECTIONS: PoseConnection[] = [
  { start: 11, end: 12 },
  { start: 11, end: 13 },
  { start: 13, end: 15 },
  { start: 12, end: 14 },
  { start: 14, end: 16 },
  { start: 11, end: 23 },
  { start: 12, end: 24 },
  { start: 23, end: 24 },
  { start: 23, end: 25 },
  { start: 25, end: 27 },
  { start: 24, end: 26 },
  { start: 26, end: 28 },
];

export function drawPoseLandmarks(
  context: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  width: number,
  height: number,
  metrics: PoseMetrics | null = null,
): void {
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';

  drawConnections(context, landmarks, width, height);
  drawPoints(context, landmarks, width, height);
  drawMetrics(context, metrics, width, height);

  context.restore();
}

export function clearCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  context.clearRect(0, 0, width, height);
}

function drawConnections(
  context: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  width: number,
  height: number,
): void {
  context.strokeStyle = 'rgba(45, 212, 191, 0.9)';
  context.lineWidth = Math.max(3, width * 0.003);

  for (const connection of POSE_CONNECTIONS) {
    const start = landmarks[connection.start];
    const end = landmarks[connection.end];

    if (!isVisible(start) || !isVisible(end)) {
      continue;
    }

    context.beginPath();
    context.moveTo(start.x * width, start.y * height);
    context.lineTo(end.x * width, end.y * height);
    context.stroke();
  }
}

function drawPoints(
  context: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  width: number,
  height: number,
): void {
  const radius = Math.max(4, width * 0.004);

  for (const landmark of landmarks) {
    if (!isVisible(landmark)) {
      continue;
    }

    context.beginPath();
    context.fillStyle = 'rgba(232, 237, 242, 0.95)';
    context.arc(landmark.x * width, landmark.y * height, radius, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.strokeStyle = 'rgba(10, 13, 16, 0.8)';
    context.lineWidth = 2;
    context.arc(landmark.x * width, landmark.y * height, radius, 0, Math.PI * 2);
    context.stroke();
  }
}

function isVisible(landmark: PoseLandmark | undefined): landmark is PoseLandmark {
  return Boolean(landmark && landmark.visibility > 0.45);
}

function drawMetrics(
  context: CanvasRenderingContext2D,
  metrics: PoseMetrics | null,
  width: number,
  height: number,
): void {
  if (!metrics) {
    return;
  }

  const leftShoulder = denormalizePoint(metrics.leftShoulder, width, height);
  const rightShoulder = denormalizePoint(metrics.rightShoulder, width, height);
  const neckCenter = denormalizePoint(metrics.neckCenter, width, height);
  const torsoCenter = denormalizePoint(metrics.torsoCenter, width, height);

  context.strokeStyle = 'rgba(248, 250, 252, 0.95)';
  context.lineWidth = Math.max(4, width * 0.004);
  context.beginPath();
  context.moveTo(leftShoulder.x, leftShoulder.y);
  context.lineTo(rightShoulder.x, rightShoulder.y);
  context.stroke();

  drawMetricPoint(context, neckCenter, '#facc15', width);
  drawMetricPoint(context, torsoCenter, '#fb7185', width);
  drawMetricLabel(context, metrics, neckCenter, width);
}

function drawMetricPoint(
  context: CanvasRenderingContext2D,
  point: PosePoint,
  color: string,
  width: number,
): void {
  context.beginPath();
  context.fillStyle = color;
  context.arc(point.x, point.y, Math.max(6, width * 0.006), 0, Math.PI * 2);
  context.fill();
}

function drawMetricLabel(
  context: CanvasRenderingContext2D,
  metrics: PoseMetrics,
  anchor: PosePoint,
  width: number,
): void {
  const angleDeg = Math.round((metrics.torsoAngle * 180) / Math.PI);
  const label = `Shoulders ${Math.round(metrics.shoulderWidthPx)}px | Angle ${angleDeg}deg`;
  const paddingX = 10;
  const paddingY = 7;
  const x = anchor.x + 14;
  const y = anchor.y - 34;

  context.font = `${Math.max(13, Math.round(width * 0.012))}px Inter, Arial, sans-serif`;
  const textWidth = context.measureText(label).width;

  context.fillStyle = 'rgba(10, 13, 16, 0.78)';
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = 28 + paddingY;

  context.fillRect(x - paddingX, y - 18, boxWidth, boxHeight);
  context.fillStyle = 'rgba(232, 237, 242, 0.96)';

  context.save();
  context.translate(x + textWidth / 2, y + 5);
  context.scale(-1, 1);
  context.fillText(label, -textWidth / 2, 0);
  context.restore();
}
