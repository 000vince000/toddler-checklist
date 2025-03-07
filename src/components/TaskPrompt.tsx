import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useTaskContext } from '../context/TaskContext';
import PixelAnimation from './PixelAnimation';
import CelebrationModal from './Celebration/CelebrationModal';
import { useGesture } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';
import { AchievementManager } from '../utils/AchievementManager';
import { StatsTracker } from '../utils/StatsTracker';
import AchievementsDrawer from './achievements/AchievementsDrawer';
import StatsOverlay from './stats/StatsOverlay';

export default function TaskPrompt() {
  const navigate = useNavigate();
  const { currentTask, completeTask, skipTask } = useTaskContext();
  const [showPrompt, setShowPrompt] = useState(true);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const [showAchievements, setShowAchievements] = useState(false);
  const achievementManager = AchievementManager.getInstance();
  const statsTracker = StatsTracker.getInstance();

  useEffect(() => {
    console.log('TaskPrompt mounted');
    console.log('Initial currentTask:', currentTask);
    console.log('Initial showPrompt:', showPrompt);
  }, []);

  useEffect(() => {
    // Reset timer when navigating back to prompt
    setShowPrompt(true);
  }, [currentTask]);

  useEffect(() => {
    // Auto-redirect to roadmap after 1 minute of inactivity
    if (showPrompt) {
      if (redirectTimer) clearTimeout(redirectTimer);
      const timer = setTimeout(() => {
        navigate('/roadmap');
      }, 60000);
      setRedirectTimer(timer);
    }
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [showPrompt, navigate]);

  // Add debug logging
  useEffect(() => {
    console.log('TaskPrompt render state:', {
      currentTask,
      showPrompt,
      pathname: window.location.pathname
    });
  });

  // Return early if no task or prompt shouldn't be shown
  if (!currentTask || !showPrompt) {
    return null; // Don't show anything, let the router handle the redirect
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#e6f3ff', // Baby blue background
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Task Title */}
      <Typography 
        variant="h2" 
        sx={{ 
          mb: 12,
          mt: 36,
          color: '#2c3e50',
          fontWeight: 'bold',
          textAlign: 'center',
          '&::after': {
            content: '"Let\'s do this!"',
            display: 'block',
            fontSize: '1rem',
            marginTop: 1,
            color: '#34495e',
            fontWeight: 'normal'
          }
        }}
      >
        {currentTask.name}
      </Typography>

      {/* 8-bit Animation Area */}
      <Box sx={{ 
        flex: 1, 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        mt: -4
      }}>
        <PixelAnimation 
          spriteSheet={currentTask.spriteSheet} 
          width={300} 
          height={300}
        />
      </Box>

      {/* Bottom Controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)', // Center the container
          display: 'flex',
          gap: 4, // Add space between buttons
          width: '80%', // Use percentage of screen width
          maxWidth: '800px' // Maximum width to prevent too-wide buttons
        }}
      >
        <IconButton
          onClick={() => {
            skipTask(currentTask.id);
            navigate('/roadmap');
          }}
          sx={{
            bgcolor: '#ff4d4d',
            width: '50%', // Take up half the container width
            height: 120, // Reduced height for more rectangular shape
            borderRadius: 2,
            '&:hover': {
              bgcolor: '#ff3333'
            }
          }}
        >
          <CloseIcon sx={{ fontSize: 64 }} />
        </IconButton>

        <IconButton
          onClick={() => {
            completeTask(currentTask.id);
            setShowCelebration(true);
          }}
          sx={{
            bgcolor: '#4CAF50',
            width: '50%', // Take up half the container width
            height: 120,
            borderRadius: 2,
            '&:hover': {
              bgcolor: '#45a049'
            }
          }}
        >
          <CheckIcon sx={{ fontSize: 64 }} />
        </IconButton>
      </Box>

      {/* Celebration Modal */}
      {showCelebration && (
        <CelebrationModal
          task={currentTask}
          onComplete={() => {
            setShowCelebration(false);
            navigate('/roadmap');
          }}
        />
      )}
    </Box>
  );
} 