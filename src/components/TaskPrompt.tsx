import React, { useEffect, useState } from 'react';
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

  if (!currentTask || !showPrompt) {
    return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography variant="h5">No active tasks</Typography>
      </Box>
    );
  }

  const handleCheck = () => {
    if (currentTask) {
      completeTask(currentTask.id);
      
      // Update stats and check achievements
      const updatedStats = statsTracker.updateStats(currentTask.id);
      const newAchievements = achievementManager.checkAchievements(updatedStats);
      
      // Show achievement notifications
      newAchievements.forEach(achievement => {
        // You can use your existing notification system here
        console.log(`Achievement unlocked: ${achievement.name}`);
      });

      setShowCelebration(true);
    }
  };

  const handleSkip = () => {
    if (currentTask) {
      skipTask(currentTask.id);
      navigate('/roadmap');
    }
  };

  const handleCelebrationComplete = () => {
    setShowPrompt(false);
    navigate('/roadmap');
  };

  const bind = useGesture({
    onDrag: ({ movement: [mx], direction: [xDir], velocity: [vx], down }) => {
      const trigger = vx > 0.2;
      if (!down && trigger) {
        if (xDir > 0) {
          handleCheck();
        } else {
          handleSkip();
        }
      } else {
        api.start({ x: down ? mx : 0, immediate: down });
      }
    },
  });

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      <StatsOverlay stats={statsTracker.getStats()} />
      
      <Box sx={{ 
        position: 'absolute', 
        bottom: 32, 
        left: 0, 
        right: 0, 
        display: 'flex', 
        justifyContent: 'space-between', 
        px: 4 
      }}>
        <IconButton 
          onClick={() => {
            skipTask(currentTask.id);
            navigate('/roadmap');
          }}
          sx={{ bgcolor: 'background.paper' }}
        >
          <CloseIcon />
        </IconButton>
        
        <IconButton 
          onClick={() => {
            completeTask(currentTask.id);
            setShowCelebration(true);
          }}
          sx={{ bgcolor: 'background.paper' }}
        >
          <CheckIcon />
        </IconButton>
      </Box>

      {showCelebration && (
        <CelebrationModal
          task={currentTask}
          onComplete={() => {
            setShowCelebration(false);
            navigate('/roadmap');
          }}
        />
      )}

      <AchievementsDrawer
        open={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </Box>
  );
} 