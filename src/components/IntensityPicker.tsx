'use client';

import { PainIntensity, INTENSITY_COLORS, INTENSITY_LABELS } from '@/types';

interface IntensityPickerProps {
  selected: PainIntensity;
  onChange: (intensity: PainIntensity) => void;
}

export default function IntensityPicker({ selected, onChange }: IntensityPickerProps) {
  const intensities: PainIntensity[] = ['mild', 'moderate', 'severe'];

  return (
    <div className="flex gap-2 justify-center">
      {intensities.map((intensity) => {
        const isActive = selected === intensity;
        const color = INTENSITY_COLORS[intensity];
        return (
          <button
            key={intensity}
            onClick={() => onChange(intensity)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 border-2 min-h-[48px]
              ${isActive ? 'scale-105' : 'opacity-60 hover:opacity-80'}
            `}
            style={{
              borderColor: color,
              backgroundColor: isActive ? `${color}20` : 'transparent',
              color: color,
              boxShadow: isActive ? `0 0 16px ${color}30` : 'none',
            }}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            {INTENSITY_LABELS[intensity]}
          </button>
        );
      })}
    </div>
  );
}
