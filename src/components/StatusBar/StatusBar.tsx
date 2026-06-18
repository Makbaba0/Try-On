import { useMirrorStore } from '../../store/mirrorStore';

const poseLabels = {
  'not-initialized': 'Başlatılmadı',
  initializing: 'Başlatılıyor',
  tracking: 'Takipte',
  lost: 'Kayboldu',
  error: 'Hata',
};

export function StatusBar() {
  const cameraFps = useMirrorStore((state) => state.cameraFps);
  const cameraStatus = useMirrorStore((state) => state.cameraStatus);
  const poseStatus = useMirrorStore((state) => state.poseStatus);
  const selectedProductName = useMirrorStore((state) => state.selectedProductName);

  return (
    <footer className="grid h-12 grid-cols-3 items-center border-t border-mirror-border px-6 text-sm text-mirror-muted">
      <span>Kamera FPS: {cameraStatus === 'ready' ? cameraFps : '--'}</span>
      <span className="text-center">Poz: {poseLabels[poseStatus]}</span>
      <span className="text-right">Seçili: {selectedProductName ?? 'Yok'}</span>
    </footer>
  );
}
