'use client';

import { PressureSignal, PRESSURE_CONFIG } from '@/types';

interface PressureFeedbackProps {
  onSignal: (signal: PressureSignal) => void;
  disabled?: boolean;
  lastSignal?: PressureSignal | null;
}

export default function PressureFeedback({ onSignal, disabled, lastSignal }: PressureFeedbackProps) {
  const signals: PressureSignal[] = ['more', 'less', 'good', 'stop'];

  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
      {signals.map((signal) => {
        const config = PRESSURE_CONFIG[signal];
        const isActive = lastSignal === signal;
        return (
          <button
            key={signal}
            onClick={() => onSignal(signal)}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center
              min-h-[64px] rounded-xl font-semibold text-lg
              transition-all duration-200 active:scale-95
              border-2 disabled:opacity-40
              ${isActive
                ? 'scale-105 shadow-lg'
                : 'hover:scale-[1.02]'
              }
            `}
            style={{
              backgroundColor: isActive ? config.color : 'transparent',
              borderColor: config.color,
              color: isActive ? '#fff' : config.color,
              boxShadow: isActive ? `0 0 20px ${config.color}40` : 'none',
            }}
          >
            <span className="text-2xl mb-1">{config.icon}</span>
            <span className="text-sm">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
