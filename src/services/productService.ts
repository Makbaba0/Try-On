import productsData from '../products/products.json';
import type { Product } from '../types/product';

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getDefaultProduct(): Product {
  const [firstProduct] = getProducts();

  if (!firstProduct) {
    throw new Error('products.json icinde urun bulunamadi.');
  }

  return firstProduct;
}
