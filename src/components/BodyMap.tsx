'use client';

import { useCallback, useRef } from 'react';
import { Marker, BodyView, BodyType, PainIntensity, INTENSITY_COLORS } from '@/types';

// SVG body outline paths
const BODY_PATHS = {
  male: {
    front: {
      outline: `M 150,30 C 150,13 138,2 125,2 C 112,2 100,13 100,30 C 100,47 112,58 125,58 C 138,58 150,47 150,30 Z
        M 125,58 L 125,65
        M 100,75 C 90,72 75,73 65,80 L 35,130 C 30,140 25,155 30,160 C 35,165 42,160 45,155 L 70,115 L 80,100
        M 150,75 C 160,72 175,73 185,80 L 215,130 C 220,140 225,155 220,160 C 215,165 208,160 205,155 L 180,115 L 170,100
        M 95,65 C 85,68 80,75 80,85 L 80,100 L 78,160 L 80,180 L 85,200
        M 155,65 C 165,68 170,75 170,85 L 170,100 L 172,160 L 170,180 L 165,200
        M 85,200 C 82,210 78,215 80,220 L 85,250 L 88,280 L 90,310 L 88,340 L 82,370 L 78,395 C 76,405 80,410 90,408 C 100,406 100,400 98,395 L 105,370 L 110,340 L 115,310
        M 165,200 C 168,210 172,215 170,220 L 165,250 L 162,280 L 160,310 L 162,340 L 168,370 L 172,395 C 174,405 170,410 160,408 C 150,406 150,400 152,395 L 145,370 L 140,340 L 135,310`,
      regions: [
        // Head
        { d: 'M 150,30 C 150,13 138,2 125,2 C 112,2 100,13 100,30 C 100,47 112,58 125,58 C 138,58 150,47 150,30 Z', label: 'Head' },
        // Torso
        { d: 'M 95,65 L 80,85 L 78,160 L 85,200 L 165,200 L 172,160 L 170,85 L 155,65 Z', label: 'Torso' },
        // Left arm
        { d: 'M 80,80 L 65,80 L 30,140 L 25,160 L 35,165 L 70,115 L 80,100 Z', label: 'Left Arm' },
        // Right arm
        { d: 'M 170,80 L 185,80 L 220,140 L 225,160 L 215,165 L 180,115 L 170,100 Z', label: 'Right Arm' },
        // Left leg
        { d: 'M 85,200 L 80,220 L 82,260 L 88,310 L 82,370 L 78,400 L 98,400 L 110,340 L 115,310 L 125,200 Z', label: 'Left Leg' },
        // Right leg
        { d: 'M 165,200 L 170,220 L 168,260 L 162,310 L 168,370 L 172,400 L 152,400 L 140,340 L 135,310 L 125,200 Z', label: 'Right Leg' },
      ],
    },
    back: {
      outline: `M 150,30 C 150,13 138,2 125,2 C 112,2 100,13 100,30 C 100,47 112,58 125,58 C 138,58 150,47 150,30 Z
        M 125,58 L 125,65
        M 100,75 C 90,72 75,73 65,80 L 35,130 C 30,140 25,155 30,160 C 35,165 42,160 45,155 L 70,115 L 80,100
        M 150,75 C 160,72 175,73 185,80 L 215,130 C 220,140 225,155 220,160 C 215,165 208,160 205,155 L 180,115 L 170,100
        M 95,65 C 85,68 80,75 80,85 L 80,100 L 78,160 L 80,180 L 85,200
        M 155,65 C 165,68 170,75 170,85 L 170,100 L 172,160 L 170,180 L 165,200
        M 85,200 C 82,210 78,215 80,220 L 85,250 L 88,280 L 90,310 L 88,340 L 82,370 L 78,395 C 76,405 80,410 90,408 C 100,406 100,400 98,395 L 105,370 L 110,340 L 115,310
        M 165,200 C 168,210 172,215 170,220 L 165,250 L 162,280 L 160,310 L 162,340 L 168,370 L 172,395 C 174,405 170,410 160,408 C 150,406 150,400 152,395 L 145,370 L 140,340 L 135,310`,
      regions: [
        { d: 'M 150,30 C 150,13 138,2 125,2 C 112,2 100,13 100,30 C 100,47 112,58 125,58 C 138,58 150,47 150,30 Z', label: 'Head' },
        { d: 'M 95,65 L 80,85 L 78,160 L 85,200 L 165,200 L 172,160 L 170,85 L 155,65 Z', label: 'Back' },
        { d: 'M 80,80 L 65,80 L 30,140 L 25,160 L 35,165 L 70,115 L 80,100 Z', label: 'Left Arm' },
        { d: 'M 170,80 L 185,80 L 220,140 L 225,160 L 215,165 L 180,115 L 170,100 Z', label: 'Right Arm' },
        { d: 'M 85,200 L 80,220 L 82,260 L 88,310 L 82,370 L 78,400 L 98,400 L 110,340 L 115,310 L 125,200 Z', label: 'Left Leg' },
        { d: 'M 165,200 L 170,220 L 168,260 L 162,310 L 168,370 L 172,400 L 152,400 L 140,340 L 135,310 L 125,200 Z', label: 'Right Leg' },
      ],
    },
  },
  female: {
    front: {
      outline: `M 148,30 C 148,14 137,3 125,3 C 113,3 102,14 102,30 C 102,46 113,57 125,57 C 137,57 148,46 148,30 Z
        M 125,57 L 125,64
        M 100,74 C 92,71 78,72 68,78 L 40,125 C 35,135 30,150 34,155 C 38,160 44,156 47,151 L 72,112 L 82,98
        M 150,74 C 158,71 172,72 182,78 L 210,125 C 215,135 220,150 216,155 C 212,160 206,156 203,151 L 178,112 L 168,98
        M 97,64 C 88,67 83,74 82,84 L 80,98 L 77,150 L 78,175 L 82,200
        M 153,64 C 162,67 167,74 168,84 L 170,98 L 173,150 L 172,175 L 168,200
        M 82,200 C 78,212 75,218 77,225 L 82,255 L 86,285 L 88,310 L 86,342 L 80,372 L 76,397 C 74,407 78,412 88,410 C 98,408 98,402 96,397 L 103,372 L 108,342 L 113,310
        M 168,200 C 172,212 175,218 173,225 L 168,255 L 164,285 L 162,310 L 164,342 L 170,372 L 174,397 C 176,407 172,412 162,410 C 152,408 152,402 154,397 L 147,372 L 142,342 L 137,310`,
      regions: [
        { d: 'M 148,30 C 148,14 137,3 125,3 C 113,3 102,14 102,30 C 102,46 113,57 125,57 C 137,57 148,46 148,30 Z', label: 'Head' },
        { d: 'M 97,64 L 82,84 L 77,150 L 82,200 L 168,200 L 173,150 L 168,84 L 153,64 Z', label: 'Torso' },
        { d: 'M 82,78 L 68,78 L 35,135 L 30,155 L 38,160 L 72,112 L 82,98 Z', label: 'Left Arm' },
        { d: 'M 168,78 L 182,78 L 215,135 L 220,155 L 212,160 L 178,112 L 168,98 Z', label: 'Right Arm' },
        { d: 'M 82,200 L 77,225 L 82,260 L 88,310 L 80,372 L 76,400 L 96,400 L 108,342 L 113,310 L 125,200 Z', label: 'Left Leg' },
        { d: 'M 168,200 L 173,225 L 168,260 L 162,310 L 170,372 L 174,400 L 154,400 L 142,342 L 137,310 L 125,200 Z', label: 'Right Leg' },
      ],
    },
    back: {
      outline: `M 148,30 C 148,14 137,3 125,3 C 113,3 102,14 102,30 C 102,46 113,57 125,57 C 137,57 148,46 148,30 Z
        M 125,57 L 125,64
        M 100,74 C 92,71 78,72 68,78 L 40,125 C 35,135 30,150 34,155 C 38,160 44,156 47,151 L 72,112 L 82,98
        M 150,74 C 158,71 172,72 182,78 L 210,125 C 215,135 220,150 216,155 C 212,160 206,156 203,151 L 178,112 L 168,98
        M 97,64 C 88,67 83,74 82,84 L 80,98 L 77,150 L 78,175 L 82,200
        M 153,64 C 162,67 167,74 168,84 L 170,98 L 173,150 L 172,175 L 168,200
        M 82,200 C 78,212 75,218 77,225 L 82,255 L 86,285 L 88,310 L 86,342 L 80,372 L 76,397 C 74,407 78,412 88,410 C 98,408 98,402 96,397 L 103,372 L 108,342 L 113,310
        M 168,200 C 172,212 175,218 173,225 L 168,255 L 164,285 L 162,310 L 164,342 L 170,372 L 174,397 C 176,407 172,412 162,410 C 152,408 152,402 154,397 L 147,372 L 142,342 L 137,310`,
      regions: [
        { d: 'M 148,30 C 148,14 137,3 125,3 C 113,3 102,14 102,30 C 102,46 113,57 125,57 C 137,57 148,46 148,30 Z', label: 'Head' },
        { d: 'M 97,64 L 82,84 L 77,150 L 82,200 L 168,200 L 173,150 L 168,84 L 153,64 Z', label: 'Back' },
        { d: 'M 82,78 L 68,78 L 35,135 L 30,155 L 38,160 L 72,112 L 82,98 Z', label: 'Left Arm' },
        { d: 'M 168,78 L 182,78 L 215,135 L 220,155 L 212,160 L 178,112 L 168,98 Z', label: 'Right Arm' },
        { d: 'M 82,200 L 77,225 L 82,260 L 88,310 L 80,372 L 76,400 L 96,400 L 108,342 L 113,310 L 125,200 Z', label: 'Left Leg' },
        { d: 'M 168,200 L 173,225 L 168,260 L 162,310 L 170,372 L 174,400 L 154,400 L 142,342 L 137,310 L 125,200 Z', label: 'Right Leg' },
      ],
    },
  },
};

// Anatomical detail lines for more realistic body rendering
const DETAIL_LINES = {
  front: [
    // Spine line
    'M 125,65 L 125,200',
    // Chest lines
    'M 95,85 Q 110,95 125,90 Q 140,95 155,85',
    // Ab lines
    'M 110,120 L 140,120',
    'M 112,140 L 138,140',
    'M 113,160 L 137,160',
    // Navel
    'M 122,150 A 3,3 0 1,1 128,150 A 3,3 0 1,1 122,150',
    // Hip lines
    'M 85,195 Q 105,205 125,200 Q 145,205 165,195',
    // Knee caps
    'M 90,305 A 8,8 0 1,1 106,305 A 8,8 0 1,1 90,305',
    'M 144,305 A 8,8 0 1,1 160,305 A 8,8 0 1,1 144,305',
  ],
  back: [
    // Spine
    'M 125,65 L 125,200',
    // Shoulder blades
    'M 90,80 Q 95,100 110,105 Q 115,95 115,85',
    'M 160,80 Q 155,100 140,105 Q 135,95 135,85',
    // Lower back dimples
    'M 110,185 A 4,4 0 1,1 118,185 A 4,4 0 1,1 110,185',
    'M 132,185 A 4,4 0 1,1 140,185 A 4,4 0 1,1 132,185',
    // Gluteal fold
    'M 90,210 Q 105,225 125,222 Q 145,225 160,210',
    // Back of knee
    'M 92,310 Q 100,318 108,310',
    'M 142,310 Q 150,318 158,310',
  ],
};

interface BodyMapProps {
  view: BodyView;
  bodyType: BodyType;
  markers: Marker[];
  onTap?: (x: number, y: number) => void;
  selectedIntensity?: PainIntensity;
  interactive?: boolean;
}

export default function BodyMap({
  view,
  bodyType,
  markers,
  onTap,
  interactive = false,
}: BodyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const bodyData = BODY_PATHS[bodyType][view];

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!interactive || !onTap || !svgRef.current) return;

      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const scaleX = 250 / rect.width;
      const scaleY = 420 / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      onTap(x, y);
    },
    [interactive, onTap]
  );

  const handleTouch = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (!interactive || !onTap || !svgRef.current) return;
      e.preventDefault();

      const touch = e.touches[0];
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const scaleX = 250 / rect.width;
      const scaleY = 420 / rect.height;
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      onTap(x, y);
    },
    [interactive, onTap]
  );

  const viewMarkers = markers.filter((m) => m.view === view);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 250 420"
      className={`w-full max-w-[300px] mx-auto ${interactive ? 'cursor-crosshair' : ''}`}
      onClick={handleClick}
      onTouchStart={handleTouch}
      style={{ touchAction: 'none' }}
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
        </radialGradient>
        <filter id="markerGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bodyOutlineGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="250" height="420" fill="url(#bodyGlow)" rx="8" />

      {/* Body region fills (interactive hover targets) */}
      {bodyData.regions.map((region, i) => (
        <path
          key={`region-${i}`}
          d={region.d}
          fill="rgba(0,240,255,0.03)"
          stroke="none"
          className={interactive ? 'hover:fill-[rgba(0,240,255,0.08)] transition-colors' : ''}
        />
      ))}

      {/* Body outline */}
      <path
        d={bodyData.outline}
        fill="none"
        stroke="#00F0FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
        filter="url(#bodyOutlineGlow)"
      />

      {/* Anatomical detail lines */}
      {DETAIL_LINES[view].map((d, i) => (
        <path
          key={`detail-${i}`}
          d={d}
          fill="none"
          stroke="#00F0FF"
          strokeWidth="0.5"
          opacity="0.2"
          strokeLinecap="round"
        />
      ))}

      {/* View label */}
      <text
        x="125"
        y="415"
        textAnchor="middle"
        fill="#00F0FF"
        fontSize="10"
        opacity="0.5"
        fontFamily="system-ui"
      >
        {view === 'front' ? 'FRONT' : 'BACK'}
      </text>

      {/* Markers */}
      {viewMarkers.map((marker) => (
        <g key={marker.id} filter="url(#markerGlow)">
          <circle
            cx={marker.x}
            cy={marker.y}
            r="8"
            fill={INTENSITY_COLORS[marker.intensity]}
            opacity="0.3"
          />
          <circle
            cx={marker.x}
            cy={marker.y}
            r="5"
            fill={INTENSITY_COLORS[marker.intensity]}
            stroke="#fff"
            strokeWidth="1.5"
            opacity="0.9"
          />
        </g>
      ))}

      {/* Tap hint */}
      {interactive && viewMarkers.length === 0 && (
        <text
          x="125"
          y="215"
          textAnchor="middle"
          fill="#00F0FF"
          fontSize="11"
          opacity="0.4"
          fontFamily="system-ui"
        >
          Tap to mark pain points
        </text>
      )}
    </svg>
  );
}
