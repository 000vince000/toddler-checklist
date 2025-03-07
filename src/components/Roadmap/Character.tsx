import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTaskContext } from '../../context/TaskContext';

export default function Character() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { taskStatuses } = useTaskContext();
  const targetPosition = useRef(new THREE.Vector3());
  
  const completedTasks = taskStatuses.filter(t => t.status === 'checked').length;
  const position = -4 + (completedTasks * 2); // Start at -4, move 2 units per task

  useEffect(() => {
    targetPosition.current.set(position, 0, 0);
  }, [position]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Smooth movement
    meshRef.current.position.lerp(targetPosition.current, 0.1);
  });

  return (
    <mesh ref={meshRef} position={[-4, 0.5, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#FFD700" />
    </mesh>
  );
} 