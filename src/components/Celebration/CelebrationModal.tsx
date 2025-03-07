import { useEffect, useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { Task } from '../../types/Task';
import confetti from 'canvas-confetti';

interface CelebrationModalProps {
  task: Task;
  onComplete: () => void;
}

export default function CelebrationModal({ task, onComplete }: CelebrationModalProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Trigger confetti when modal opens
    if (open) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto close after animation
      const timer = setTimeout(() => {
        setOpen(false);
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open, onComplete]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
        onComplete();
      }}
      aria-labelledby="celebration-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 1
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'primary.main',
              mb: 2,
              fontWeight: 'bold',
              animation: 'bounce 1s infinite'
            }}
          >
            Great Job!
          </Typography>
          <Typography variant="h5" color="text.secondary">
            You completed: {task.name}
          </Typography>
        </Box>

        {/* 3D celebration scene */}
        <Canvas
          camera={{ position: [0, 0, 5] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* Add your 3D celebration elements here */}
        </Canvas>
      </Box>
    </Modal>
  );
} 