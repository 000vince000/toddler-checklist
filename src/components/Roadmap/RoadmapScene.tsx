import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TaskStatus } from '../../types/Task';
import { useTaskContext } from '../../context/TaskContext';

interface CheckpointProps {
  position: [number, number, number];
  status: 'checked' | 'unchecked' | 'pending';
  isActive: boolean;
}

function Checkpoint({ position, status, isActive }: CheckpointProps) {
  const color = status === 'checked' 
    ? '#4CAF50' 
    : status === 'unchecked' 
    ? '#f44336' 
    : '#FFC107';

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {isActive && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      )}
    </group>
  );
}

function Castle() {
  return (
    <group position={[8, 0, 0]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#CD853F" />
      </mesh>
    </group>
  );
}

function Path() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[16, 2]} />
      <meshStandardMaterial color="#DEB887" />
    </mesh>
  );
}

export default function RoadmapScene() {
  const { taskStatuses, currentTask } = useTaskContext();
  
  const getCheckpointPositions = (statuses: TaskStatus[]) => {
    return statuses.map((status, index) => {
      const x = (index * 2) - 4;
      return {
        position: [x, 0, 0] as [number, number, number],
        status: status.status,
        isActive: currentTask?.id === status.id
      };
    });
  };

  const checkpoints = getCheckpointPositions(taskStatuses);

  return (
    <>
      <Path />
      {checkpoints.map((checkpoint, index) => (
        <Checkpoint key={index} {...checkpoint} />
      ))}
      <Castle />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </>
  );
} 