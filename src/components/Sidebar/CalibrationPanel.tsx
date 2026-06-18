import { RotateCcw } from 'lucide-react';

import {
  DEFAULT_PRODUCT_CALIBRATION,
  type ProductCalibration,
} from '../../types/overlay';
import type { Product } from '../../types/product';

interface CalibrationPanelProps {
  product: Product;
  calibration: ProductCalibration | undefined;
  onChange: (calibration: Partial<ProductCalibration>) => void;
  onReset: () => void;
}

export function CalibrationPanel({
  product,
  calibration,
  onChange,
  onReset,
}: CalibrationPanelProps) {
  const resolvedCalibration = {
    ...DEFAULT_PRODUCT_CALIBRATION,
    ...calibration,
  };

  return (
    <div className="border-t border-mirror-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-mirror-text">Kalibrasyon</h3>
          <p className="mt-1 truncate text-xs text-mirror-muted">{product.name}</p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="grid h-9 w-9 place-items-center rounded border border-mirror-border text-mirror-muted transition hover:border-mirror-accent hover:text-mirror-text"
          aria-label="Kalibrasyonu sıfırla"
          title="Kalibrasyonu sıfırla"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <CalibrationSlider
          label="Genişlik"
          min={0.72}
          max={1.34}
          step={0.01}
          value={resolvedCalibration.widthScale}
          onChange={(widthScale) => onChange({ widthScale })}
        />
        <CalibrationSlider
          label="Boy"
          min={0.72}
          max={1.34}
          step={0.01}
          value={resolvedCalibration.heightScale}
          onChange={(heightScale) => onChange({ heightScale })}
        />
        <CalibrationSlider
          label="Sağ/Sol"
          min={-0.45}
          max={0.45}
          step={0.01}
          value={resolvedCalibration.offsetX}
          onChange={(offsetX) => onChange({ offsetX })}
        />
        <CalibrationSlider
          label="Yukarı/Aşağı"
          min={-0.45}
          max={0.45}
          step={0.01}
          value={resolvedCalibration.offsetY}
          onChange={(offsetY) => onChange({ offsetY })}
        />
        <CalibrationSlider
          label="Rotasyon"
          min={-0.35}
          max={0.35}
          step={0.01}
          value={resolvedCalibration.rotationOffset}
          onChange={(rotationOffset) => onChange({ rotationOffset })}
          formatter={(value) => `${Math.round((value * 180) / Math.PI)}deg`}
        />
        {product.model ? (
          <div className="space-y-4 border-t border-mirror-border pt-4">
            <CalibrationSlider
              label="3D Model Scale"
              min={0.2}
              max={3}
              step={0.01}
              value={resolvedCalibration.modelScale}
              onChange={(modelScale) => onChange({ modelScale })}
            />
            <CalibrationSlider
              label="3D Model Yukari/Asagi"
              min={-2}
              max={2}
              step={0.01}
              value={resolvedCalibration.modelOffsetY}
              onChange={(modelOffsetY) => onChange({ modelOffsetY })}
            />
            <CalibrationSlider
              label="3D Rot X"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={resolvedCalibration.modelRotationX}
              onChange={(modelRotationX) => onChange({ modelRotationX })}
              formatter={(value) => `${Math.round((value * 180) / Math.PI)}deg`}
            />
            <CalibrationSlider
              label="3D Rot Y"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={resolvedCalibration.modelRotationY}
              onChange={(modelRotationY) => onChange({ modelRotationY })}
              formatter={(value) => `${Math.round((value * 180) / Math.PI)}deg`}
            />
            <CalibrationSlider
              label="3D Rot Z"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={resolvedCalibration.modelRotationZ}
              onChange={(modelRotationZ) => onChange({ modelRotationZ })}
              formatter={(value) => `${Math.round((value * 180) / Math.PI)}deg`}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface CalibrationSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatter?: (value: number) => string;
}

function CalibrationSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatter = (nextValue) => nextValue.toFixed(2),
}: CalibrationSliderProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-mirror-muted">{label}</span>
        <span className="tabular-nums text-mirror-text">{formatter(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full accent-mirror-accent"
      />
    </label>
  );
}
