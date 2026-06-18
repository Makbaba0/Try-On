import { forwardRef } from 'react';

export const CanvasOverlay = forwardRef<HTMLCanvasElement>(function CanvasOverlay(_, ref) {
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full scale-x-[-1] object-cover"
    />
  );
});
