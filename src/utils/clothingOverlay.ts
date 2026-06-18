import {
  DEFAULT_PRODUCT_CALIBRATION,
  type ClothingTransform,
  type ProductCalibration,
} from '../types/overlay';
import type { Product, ProductCategory, ProductFitOverrides } from '../types/product';
import type { PoseMetrics } from '../types/pose';
import { denormalizePoint } from './poseGeometry';

const SMOOTHING = 0.22;
const CLOTHING_ANCHOR_X = 0.5;

interface AutoFitProfile {
  shoulderMultiplier: number;
  torsoMultiplier: number;
  anchorY: number;
  yOffset: number;
  minScale: number;
  maxScale: number;
}

const AUTO_FIT_PROFILES: Record<ProductCategory, AutoFitProfile> = {
  shirt: {
    shoulderMultiplier: 1.28,
    torsoMultiplier: 1.42,
    anchorY: 0.18,
    yOffset: -0.02,
    minScale: 0.42,
    maxScale: 1.22,
  },
  hoodie: {
    shoulderMultiplier: 1.36,
    torsoMultiplier: 1.52,
    anchorY: 0.19,
    yOffset: -0.025,
    minScale: 0.44,
    maxScale: 1.28,
  },
  jacket: {
    shoulderMultiplier: 1.4,
    torsoMultiplier: 1.58,
    anchorY: 0.18,
    yOffset: -0.02,
    minScale: 0.45,
    maxScale: 1.32,
  },
};

export function calculateClothingTransform(
  metrics: PoseMetrics,
  product: Product,
  calibration: ProductCalibration | undefined,
  frameWidth: number,
  frameHeight: number,
  previous: ClothingTransform | null,
): ClothingTransform {
  const neckCenter = denormalizePoint(metrics.neckCenter, frameWidth, frameHeight);
  const fit = resolveFitProfile(product.category, product.fit);
  const resolvedCalibration = {
    ...DEFAULT_PRODUCT_CALIBRATION,
    ...calibration,
  };
  const targetWidth = metrics.shoulderWidthPx * fit.shoulderMultiplier;
  const targetHeight = metrics.torsoHeightPx * fit.torsoMultiplier;
  const widthScale = targetWidth / product.clothingBaseWidth;
  const bodyAwareMinScale = Math.max(fit.minScale, (metrics.torsoHeightPx * 0.85) / product.clothingBaseWidth);
  const bodyAwareMaxScale = Math.min(fit.maxScale, (frameHeight * 0.86) / product.clothingBaseWidth);
  const clampedScale = clamp(widthScale, bodyAwareMinScale, bodyAwareMaxScale);
  const width = product.clothingBaseWidth * clampedScale;
  const height = clamp(targetHeight, width * 0.95, frameHeight * 0.88);

  const target: ClothingTransform = {
    x: neckCenter.x + metrics.shoulderWidthPx * resolvedCalibration.offsetX,
    y:
      neckCenter.y +
      metrics.torsoHeightPx * fit.yOffset +
      metrics.torsoHeightPx * resolvedCalibration.offsetY,
    width: width * resolvedCalibration.widthScale,
    height: height * resolvedCalibration.heightScale,
    anchorY: fit.anchorY,
    rotation: metrics.torsoAngle + resolvedCalibration.rotationOffset,
    opacity: 1,
    modelScale: resolvedCalibration.modelScale,
    modelOffsetY: resolvedCalibration.modelOffsetY,
    modelRotationX: resolvedCalibration.modelRotationX,
    modelRotationY: resolvedCalibration.modelRotationY,
    modelRotationZ: resolvedCalibration.modelRotationZ,
  };

  if (!previous) {
    return target;
  }

  return {
    x: lerp(previous.x, target.x, SMOOTHING),
    y: lerp(previous.y, target.y, SMOOTHING),
    width: lerp(previous.width, target.width, SMOOTHING),
    height: lerp(previous.height, target.height, SMOOTHING),
    anchorY: lerp(previous.anchorY, target.anchorY, SMOOTHING),
    rotation: lerpAngle(previous.rotation, target.rotation, SMOOTHING),
    opacity: lerp(previous.opacity, target.opacity, SMOOTHING),
    modelScale: lerp(previous.modelScale, target.modelScale, SMOOTHING),
    modelOffsetY: lerp(previous.modelOffsetY, target.modelOffsetY, SMOOTHING),
    modelRotationX: lerpAngle(previous.modelRotationX, target.modelRotationX, SMOOTHING),
    modelRotationY: lerpAngle(previous.modelRotationY, target.modelRotationY, SMOOTHING),
    modelRotationZ: lerpAngle(previous.modelRotationZ, target.modelRotationZ, SMOOTHING),
  };
}

export function drawClothingOverlay(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: ClothingTransform,
): void {
  if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
    return;
  }

  const width = transform.width;
  const height = transform.height;
  const anchorX = width * CLOTHING_ANCHOR_X;
  const anchorY = height * transform.anchorY;

  context.save();
  context.translate(transform.x, transform.y);
  context.rotate(transform.rotation);
  context.globalAlpha = transform.opacity;
  context.drawImage(image, -anchorX, -anchorY, width, height);
  context.restore();
}

function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function lerpAngle(from: number, to: number, amount: number): number {
  const delta = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + delta * amount;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function resolveFitProfile(
  category: ProductCategory,
  overrides: ProductFitOverrides | undefined,
): AutoFitProfile {
  return {
    ...AUTO_FIT_PROFILES[category],
    ...overrides,
  };
}
