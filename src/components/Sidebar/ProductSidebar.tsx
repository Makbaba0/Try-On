import { useEffect, useMemo } from 'react';

import { ProductCard } from '../ProductCard/ProductCard';
import { getProducts } from '../../services/productService';
import { useMirrorStore } from '../../store/mirrorStore';

export function ProductSidebar() {
  const products = useMemo(() => getProducts(), []);
  const selectedProduct = useMirrorStore((state) => state.selectedProduct);
  const setSelectedProduct = useMirrorStore((state) => state.setSelectedProduct);

  useEffect(() => {
    if (!selectedProduct && products[0]) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct, setSelectedProduct]);

  return (
    <aside className="hidden w-80 flex-col border-l border-mirror-border bg-mirror-panel lg:flex">
      <div className="border-b border-mirror-border p-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-mirror-muted">
          Urunler
        </h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedProduct?.id === product.id}
            onSelect={setSelectedProduct}
          />
        ))}
      </div>
    </aside>
  );
}
