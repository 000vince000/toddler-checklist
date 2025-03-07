import React from 'react';
import { Box, keyframes } from '@mui/material';
import { Task } from '../../types/Task';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
  100% { filter: brightness(1); }
`;

interface MapTileProps {
  task: Task;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export default function MapTile({ task, isActive, isCompleted, onClick }: MapTileProps) {
  const getIcon = () => {
    switch (task.period) {
      case 'morning':
        return '🌅';
      case 'evening':
        return '🌙';
      default:
        return '⭐';
    }
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        width: 80,
        height: 80,
        borderRadius: 2,
        backgroundColor: isCompleted ? '#4CAF50' : isActive ? '#FFC107' : '#E0E0E0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '2rem',
        transition: 'all 0.3s ease',
        animation: isActive ? `${bounce} 1s infinite` : 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 2,
          background: isCompleted ? 
            'linear-gradient(45deg, #43A047 30%, #66BB6A 90%)' : 
            'none',
          animation: isCompleted ? `${shine} 2s infinite` : 'none',
          zIndex: 0
        },
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }
      }}
    >
      {getIcon()}
    </Box>
  );
} 