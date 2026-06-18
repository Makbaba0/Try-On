export interface ClothingTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  anchorY: number;
  rotation: number;
  opacity: number;
  modelScale: number;
  modelOffsetY: number;
  modelRotationX: number;
  modelRotationY: number;
  modelRotationZ: number;
}

export interface ProductCalibration {
  offsetX: number;
  offsetY: number;
  widthScale: number;
  heightScale: number;
  rotationOffset: number;
  modelScale: number;
  modelOffsetY: number;
  modelRotationX: number;
  modelRotationY: number;
  modelRotationZ: number;
}

export type ProductCalibrationMap = Record<number, ProductCalibration>;

export const DEFAULT_PRODUCT_CALIBRATION: ProductCalibration = {
  offsetX: 0,
  offsetY: 0,
  widthScale: 1,
  heightScale: 1,
  rotationOffset: 0,
  modelScale: 1,
  modelOffsetY: 0,
  modelRotationX: 0,
  modelRotationY: 0,
  modelRotationZ: 0,
};
