export type PainIntensity = 'mild' | 'moderate' | 'severe';
export type BodyView = 'front' | 'back';
export type BodyType = 'male' | 'female';
export type SessionStatus = 'active' | 'completed';
export type PressureSignal = 'more' | 'less' | 'good' | 'stop';

export interface Profile {
  id: string;
  full_name: string | null;
  business_name: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  therapist_id: string;
  client_name: string | null;
  notes: string | null;
  status: SessionStatus;
  created_at: string;
  completed_at: string | null;
}

export interface Marker {
  id: string;
  session_id: string;
  x: number;
  y: number;
  view: BodyView;
  body_type: BodyType;
  intensity: PainIntensity;
  note: string | null;
  created_at: string;
}

export interface PressureSignalRecord {
  id: string;
  session_id: string;
  signal: PressureSignal;
  created_at: string;
}

export const INTENSITY_COLORS: Record<PainIntensity, string> = {
  mild: '#22c55e',
  moderate: '#eab308',
  severe: '#ef4444',
};

export const INTENSITY_LABELS: Record<PainIntensity, string> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
};

export const PRESSURE_CONFIG: Record<PressureSignal, { label: string; color: string; icon: string }> = {
  more: { label: 'More Pressure', color: '#3b82f6', icon: '⬆' },
  less: { label: 'Less Pressure', color: '#a855f7', icon: '⬇' },
  good: { label: 'Good', color: '#22c55e', icon: '✓' },
  stop: { label: 'Stop', color: '#ef4444', icon: '✕' },
};
