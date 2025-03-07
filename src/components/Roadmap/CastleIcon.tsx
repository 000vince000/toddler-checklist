import React from 'react';
import { Box } from '@mui/material';

export default function CastleIcon() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        '& .castle': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: '#8B728E',
          borderRadius: '10px 10px 0 0',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '40px',
            background: '#9B829E',
            borderRadius: '20px 20px 0 0'
          }
        },
        '& .tower': {
          position: 'absolute',
          bottom: '60%',
          width: '25%',
          height: '50%',
          background: '#8B728E',
          borderRadius: '10px 10px 0 0',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '20px solid #B19CD9'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -35,
            left: '50%',
            width: '20px',
            height: '15px',
            background: '#ff4757',
            borderRadius: '2px',
            transform: 'translateX(-5px)',
            animation: 'flagWave 2s ease-in-out infinite',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -2,
              top: 0,
              width: '2px',
              height: '25px',
              background: '#fff'
            }
          },
          '&.left': { left: 0 },
          '&.right': { right: 0 },
          '&.center': {
            left: '50%',
            transform: 'translateX(-50%)',
            height: '70%',
            bottom: '70%'
          }
        },
        '& .window': {
          position: 'absolute',
          width: '20px',
          height: '30px',
          background: '#FFD700',
          borderRadius: '10px 10px 0 0',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '20px',
            background: '#FFF',
            borderRadius: '5px 5px 0 0',
            opacity: 0.3
          }
        },
        '@keyframes flagWave': {
          '0%, 100%': {
            transform: 'translateX(-5px) rotate(0deg)'
          },
          '50%': {
            transform: 'translateX(-5px) rotate(-10deg)'
          }
        }
      }}
    >
      <div className="castle">
        {/* Windows */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="window"
            style={{
              left: `${25 + i * 17}%`,
              top: '50%'
            }}
          />
        ))}
      </div>
      <div className="tower left" />
      <div className="tower center" />
      <div className="tower right" />
    </Box>
  );
} 