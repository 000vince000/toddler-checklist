import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RoadmapScene from './Roadmap/RoadmapScene';
import Character from './Roadmap/Character';
import Environment from './Roadmap/Environment';

export default function Roadmap() {
  const [autoRedirect, setAutoRedirect] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-redirect to current task after 1 minute
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 60000);
    
    setAutoRedirect(timer);
    return () => {
      if (autoRedirect) clearTimeout(autoRedirect);
    };
  }, []);

  return (
    <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #E0F7FA)' }}
      >
        <Environment />
        <RoadmapScene />
        <Character />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </Box>
  );
} 