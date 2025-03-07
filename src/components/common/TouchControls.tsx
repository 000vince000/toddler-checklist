import React, { useEffect, useState } from 'react';
import { Box, IconButton, Fade } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TouchControls() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showControls, setShowControls] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
      setShowControls(true);
      
      // Hide controls after 3 seconds of inactivity
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX === null) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      
      // Minimum swipe distance (in pixels)
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right - go back
          handlePrevious();
        } else {
          // Swipe left - go forward
          handleNext();
        }
      }
      
      setTouchStartX(null);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(timeout);
    };
  }, [touchStartX, navigate, location]);

  const handlePrevious = () => {
    if (location.pathname === '/roadmap') {
      navigate('/');
    }
  };

  const handleNext = () => {
    if (location.pathname === '/') {
      navigate('/roadmap');
    }
  };

  return (
    <Fade in={showControls}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
          pointerEvents: 'none',
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={handlePrevious}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
            pointerEvents: 'auto',
            opacity: location.pathname === '/roadmap' ? 1 : 0.3
          }}
          disabled={location.pathname === '/'}
        >
          <NavigateBeforeIcon />
        </IconButton>
        
        <IconButton
          onClick={handleNext}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
            pointerEvents: 'auto',
            opacity: location.pathname === '/' ? 1 : 0.3
          }}
          disabled={location.pathname === '/roadmap'}
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>
    </Fade>
  );
} 