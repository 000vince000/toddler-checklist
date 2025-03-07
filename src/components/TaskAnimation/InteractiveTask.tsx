import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface InteractiveTaskProps {
  taskId: string;
  position: [number, number, number];
  onComplete: () => void;
}

export default function InteractiveTask({ taskId, position, onComplete }: InteractiveTaskProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const springs = useSpring({
    scale: hovered ? 1.2 : 1,
    rotation: clicked ? [0, Math.PI * 2, 0] : [0, 0, 0],
    config: { mass: 1, tension: 170, friction: 26 },
  });

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.1;
  });

  const handleClick = () => {
    if (!clicked) {
      setClicked(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={springs.scale}
      rotation={springs.rotation as any}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#FFA500' : '#FFD700'} />
    </animated.mesh>
  );
} 