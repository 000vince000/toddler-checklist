import React from 'react';
import { Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Task } from '../../types/Task';

interface GroundStepProps {
  task: Task;
  isActive: boolean;
  isCompleted: boolean;
  showCharacter?: boolean;
}

export default function GroundStep({ task, isActive, isCompleted, showCharacter }: GroundStepProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 120,
        height: 40,
        background: 'linear-gradient(45deg, #d1d5db, #e5e7eb)',
        borderRadius: '8px 8px 0 0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isCompleted 
            ? 'linear-gradient(45deg, #4ade80, #22c55e)'
            : isActive 
              ? 'linear-gradient(45deg, #fbbf24, #f59e0b)'
              : 'none',
          borderRadius: '8px 8px 0 0',
          opacity: 0.7
        }
      }}
    >
      {isCompleted && (
        <CheckCircleIcon
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#166534',
            fontSize: 32
          }}
        />
      )}
      {!isCompleted && !isActive && (
        <CancelIcon
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#dc2626',
            fontSize: 32
          }}
        />
      )}
      {showCharacter && (
        <Box
          sx={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 80
          }}
        >
          <PixelAnimation
            spriteSheet={task.spriteSheet}
            width={60}
            height={80}
          />
        </Box>
      )}
    </Box>
  );
} 