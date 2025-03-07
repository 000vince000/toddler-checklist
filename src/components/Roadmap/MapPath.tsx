import React from 'react';
import { keyframes } from '@mui/material';

const flow = keyframes`
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
`;

interface MapPathProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  isActive: boolean;
  isCompleted: boolean;
}

export default function MapPath({ start, end, isActive, isCompleted }: MapPathProps) {
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 1 // Ensure road is under the steps
      }}
    >
      {/* Base road */}
      <path
        d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
        stroke="#8B4513"
        strokeWidth={40}
        strokeLinecap="round"
        fill="none"
      />
      {/* Road edges */}
      <path
        d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
        stroke="#654321"
        strokeWidth={42}
        strokeLinecap="round"
        fill="none"
        style={{ opacity: 0.5 }}
      />
      {/* Road pattern */}
      <path
        d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={40}
        strokeDasharray="8 12"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
} 