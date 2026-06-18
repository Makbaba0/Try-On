import { create } from 'zustand';

import type { CameraStatus } from '../types/camera';
import type { Product } from '../types/product';
import type { MirrorStatus, PoseStatus } from '../types/status';

interface MirrorState extends MirrorStatus {
  selectedProduct: Product | null;
  setCameraStatus: (status: CameraStatus) => void;
  setCameraFps: (fps: number) => void;
  setPoseStatus: (status: PoseStatus) => void;
  setSelectedProduct: (product: Product | null) => void;
  setErrorMessage: (message: string | null) => void;
}

export const useMirrorStore = create<MirrorState>((set) => ({
  cameraStatus: 'idle',
  cameraFps: 0,
  poseStatus: 'not-initialized',
  selectedProductName: null,
  selectedProduct: null,
  errorMessage: null,
  setCameraStatus: (cameraStatus) => set({ cameraStatus }),
  setCameraFps: (cameraFps) => set({ cameraFps }),
  setPoseStatus: (poseStatus) => set({ poseStatus }),
  setSelectedProduct: (selectedProduct) =>
    set({ selectedProduct, selectedProductName: selectedProduct?.name ?? null }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
}));
