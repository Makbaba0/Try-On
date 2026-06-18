import clsx from 'clsx';

import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, selected, onSelect }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className={clsx(
        'group flex w-full items-center gap-3 rounded border p-3 text-left transition',
        selected
          ? 'border-mirror-accent bg-mirror-accent/10'
          : 'border-mirror-border bg-black/20 hover:border-mirror-muted',
      )}
    >
      <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded bg-black/35">
        <img
          src={product.image}
          alt={product.name}
          className="h-16 w-16 object-contain"
          draggable={false}
        />
      </span>

      <span className="min-w-0">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-mirror-text">
            {product.name}
          </span>
          {product.model ? (
            <span className="rounded border border-mirror-accent/50 px-1.5 py-0.5 text-[10px] font-semibold text-mirror-accent">
              3D
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-xs capitalize text-mirror-muted">
          {product.category}
        </span>
      </span>
    </button>
  );
}
