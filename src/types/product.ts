export type ProductCategory = 'shirt' | 'hoodie' | 'jacket';

export interface ProductFitOverrides {
  shoulderMultiplier?: number;
  torsoMultiplier?: number;
  anchorY?: number;
  yOffset?: number;
  minScale?: number;
  maxScale?: number;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  category: ProductCategory;
  clothingBaseWidth: number;
  fit?: ProductFitOverrides;
}
