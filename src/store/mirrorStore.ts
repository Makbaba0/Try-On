import { create } from 'zustand';

import type { CameraStatus } from '../types/camera';
import {
  DEFAULT_PRODUCT_CALIBRATION,
  type ProductCalibration,
  type ProductCalibrationMap,
} from '../types/overlay';
import type { Product } from '../types/product';
import type { MirrorStatus, PoseStatus } from '../types/status';

const CALIBRATION_STORAGE_KEY = 'try-on-product-calibration';

interface MirrorState extends MirrorStatus {
  selectedProduct: Product | null;
  productCalibrations: ProductCalibrationMap;
  setCameraStatus: (status: CameraStatus) => void;
  setCameraFps: (fps: number) => void;
  setPoseStatus: (status: PoseStatus) => void;
  setSelectedProduct: (product: Product | null) => void;
  updateProductCalibration: (
    productId: number,
    calibration: Partial<ProductCalibration>,
  ) => void;
  resetProductCalibration: (productId: number) => void;
  setErrorMessage: (message: string | null) => void;
}

export const useMirrorStore = create<MirrorState>((set) => ({
  cameraStatus: 'idle',
  cameraFps: 0,
  poseStatus: 'not-initialized',
  selectedProductName: null,
  selectedProduct: null,
  productCalibrations: readProductCalibrations(),
  errorMessage: null,
  setCameraStatus: (cameraStatus) => set({ cameraStatus }),
  setCameraFps: (cameraFps) => set({ cameraFps }),
  setPoseStatus: (poseStatus) => set({ poseStatus }),
  setSelectedProduct: (selectedProduct) =>
    set({ selectedProduct, selectedProductName: selectedProduct?.name ?? null }),
  updateProductCalibration: (productId, calibration) =>
    set((state) => {
      const nextCalibrations = {
        ...state.productCalibrations,
        [productId]: {
          ...DEFAULT_PRODUCT_CALIBRATION,
          ...state.productCalibrations[productId],
          ...calibration,
        },
      };

      writeProductCalibrations(nextCalibrations);
      return { productCalibrations: nextCalibrations };
    }),
  resetProductCalibration: (productId) =>
    set((state) => {
      const nextCalibrations = { ...state.productCalibrations };
      delete nextCalibrations[productId];
      writeProductCalibrations(nextCalibrations);
      return { productCalibrations: nextCalibrations };
    }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
}));

function readProductCalibrations(): ProductCalibrationMap {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(CALIBRATION_STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as ProductCalibrationMap) : {};
  } catch {
    return {};
  }
}

function writeProductCalibrations(calibrations: ProductCalibrationMap): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(calibrations));
}
