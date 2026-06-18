import { forwardRef } from 'react';

export const CameraView = forwardRef<HTMLVideoElement>(function CameraView(_, ref) {
  return (
    <video
      ref={ref}
      className="h-full w-full scale-x-[-1] object-cover"
      muted
      playsInline
      autoPlay
    />
  );
});
